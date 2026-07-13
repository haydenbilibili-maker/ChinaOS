/**
 * China OS Worker：托管 app/dist（Vite React SPA），并将遗留 /china 入口重定向到新 Hash 路由。
 *
 * 实况 API 代理（免 CORS · 内存缓存 10 分钟）：
 *   GET /api/live/weather  → Open-Meteo forecast（免 key）
 *   GET /api/live/aqi      → Open-Meteo air-quality；失败尝试 OpenAQ v2
 *   GET /api/live/shipping → 主要港口 + 可选 AISHub（secret: AIS_HUB_USERNAME）
 * 可选 secret: WAQI_TOKEN（IQAir WAQI，未配置则跳过）
 */

const LEGACY_ENTRY = /^\/china(?:\.html)?$/i;
const GEO_PROXY = /^\/api\/geo\/(\d+)(?:\.json)?$/i;
const LIVE_WEATHER = /^\/api\/live\/weather$/i;
const LIVE_AQI = /^\/api\/live\/aqi$/i;
const LIVE_SHIPPING = /^\/api\/live\/shipping$/i;

const LIVE_TTL_MS = 10 * 60 * 1000;
/** @type {Map<string, { body: string, status: number, ts: number }>} */
const liveMemCache = new Map();

const MAJOR_PORTS = [
  { id: 'sha', name: '上海港', lon: 121.47, lat: 31.23, rank: 10, teuM: 47 },
  { id: 'nbg', name: '宁波舟山港', lon: 121.55, lat: 29.87, rank: 9, teuM: 35 },
  { id: 'szn', name: '深圳港', lon: 114.05, lat: 22.52, rank: 9, teuM: 30 },
  { id: 'qdg', name: '青岛港', lon: 120.32, lat: 36.07, rank: 8, teuM: 27 },
  { id: 'tjg', name: '天津港', lon: 117.73, lat: 38.98, rank: 8, teuM: 22 },
  { id: 'gzn', name: '广州港', lon: 113.45, lat: 23.10, rank: 7, teuM: 25 },
  { id: 'dlc', name: '大连港', lon: 121.65, lat: 38.92, rank: 6, teuM: 5 },
  { id: 'xmn', name: '厦门港', lon: 118.04, lat: 24.45, rank: 6, teuM: 12 },
  { id: 'ytn', name: '烟台港', lon: 121.39, lat: 37.55, rank: 5, teuM: 4 },
  { id: 'lzh', name: '连云港', lon: 119.22, lat: 34.76, rank: 5, teuM: 5 },
  { id: 'zjg', name: '湛江港', lon: 110.40, lat: 21.20, rank: 4, teuM: 3 },
  { id: 'hko', name: '海口港', lon: 110.33, lat: 20.03, rank: 3, teuM: 2 },
];

function jsonLiveResponse(body, status = 200, maxAgeSec = 600) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return new Response(text, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAgeSec}`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function cachedLiveProxy(cacheKey, upstreamUrl, ttlMs = LIVE_TTL_MS) {
  const hit = liveMemCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < ttlMs) {
    return jsonLiveResponse(hit.body, hit.status, Math.floor(ttlMs / 1000));
  }
  const res = await fetch(upstreamUrl, {
    headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-LiveProxy/1.0' },
  });
  const body = await res.text();
  if (res.ok) {
    liveMemCache.set(cacheKey, { body, status: res.status, ts: Date.now() });
  }
  return jsonLiveResponse(body, res.status, res.ok ? Math.floor(ttlMs / 1000) : 60);
}

/** Open-Meteo 气象代理：透传 query string */
async function proxyLiveWeather(url) {
  const qs = url.search || '';
  const upstream = `https://api.open-meteo.com/v1/forecast${qs}`;
  return cachedLiveProxy(`weather:${qs}`, upstream);
}

/** Open-Meteo 空气质量；失败回退 OpenAQ 单点聚合 */
async function proxyLiveAqi(url, env) {
  const qs = url.search || '';
  const cacheKey = `aqi:${qs}`;
  const hit = liveMemCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < LIVE_TTL_MS) {
    return jsonLiveResponse(hit.body, hit.status);
  }

  const omUrl = `https://air-quality-api.open-meteo.com/v1/air-quality${qs}`;
  try {
    const res = await fetch(omUrl, {
      headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-LiveProxy/1.0' },
    });
    if (res.ok) {
      const body = await res.text();
      const wrapped = JSON.stringify({
        ...JSON.parse(body),
        meta: { source: 'open-meteo', proxiedAt: new Date().toISOString() },
      });
      liveMemCache.set(cacheKey, { body: wrapped, status: 200, ts: Date.now() });
      return jsonLiveResponse(wrapped);
    }
  } catch { /* fall through */ }

  // OpenAQ 兜底：北京单站代表华北（稀疏 · 仅作连通性兜底）
  try {
    const oaq = await fetch(
      'https://api.openaq.org/v2/latest?coordinates=39.9,116.4&radius=80000&limit=5',
      { headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-LiveProxy/1.0' } },
    );
    if (oaq.ok) {
      const j = await oaq.json();
      const pm = j?.results?.[0]?.measurements?.find((m) => m.parameter === 'pm25');
      const fallback = {
        current: { pm2_5: pm?.value ?? null, us_aqi: null },
        meta: { source: 'openaq-fallback', proxiedAt: new Date().toISOString() },
      };
      const body = JSON.stringify(fallback);
      liveMemCache.set(cacheKey, { body, status: 200, ts: Date.now() });
      return jsonLiveResponse(body);
    }
  } catch { /* ignore */ }

  // 可选 WAQI（需 wrangler secret WAQI_TOKEN）
  if (env?.WAQI_TOKEN) {
    try {
      const wq = await fetch('https://api.waqi.info/feed/beijing/?token=' + env.WAQI_TOKEN);
      if (wq.ok) {
        const j = await wq.json();
        const iaqi = j?.data?.iaqi;
        const fallback = {
          current: {
            pm2_5: iaqi?.pm25?.v ?? null,
            us_aqi: j?.data?.aqi ?? null,
          },
          meta: { source: 'waqi', proxiedAt: new Date().toISOString() },
        };
        return jsonLiveResponse(JSON.stringify(fallback));
      }
    } catch { /* ignore */ }
  }

  return jsonLiveResponse({ error: 'aqi unavailable' }, 503, 60);
}

/** 航运：港口锚点 + 可选 AISHub */
async function proxyLiveShipping(env) {
  const cacheKey = 'shipping';
  const hit = liveMemCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < LIVE_TTL_MS) {
    return jsonLiveResponse(hit.body, hit.status);
  }

  const vessels = [];
  let source = 'ports';
  let note = '仅显示主要港口锚点 · 配置 AIS_HUB_USERNAME 可启用船位';

  const user = env?.AIS_HUB_USERNAME;
  if (user) {
    try {
      const aisUrl =
        `https://data.aishub.net/ws.php?username=${encodeURIComponent(user)}` +
        '&format=1&output=json&latmin=18&latmax=42&lonmin=105&lonmax=125&interval=60';
      const res = await fetch(aisUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-LiveProxy/1.0' },
      });
      if (res.ok) {
        const j = await res.json();
        const rows = Array.isArray(j) ? j : (j?.vessels || j?.data || []);
        for (const r of rows.slice(0, 200)) {
          const lat = Number(r.LATITUDE ?? r.lat);
          const lon = Number(r.LONGITUDE ?? r.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
          vessels.push({
            mmsi: String(r.MMSI ?? r.mmsi ?? ''),
            name: (r.NAME ?? r.name ?? '船舶').trim(),
            lat,
            lon,
            sog: Number(r.SOG ?? r.sog) || null,
            cog: Number(r.COG ?? r.cog) || null,
          });
        }
        if (vessels.length) {
          source = 'aishub';
          note = null;
        }
      }
    } catch { /* ports only */ }
  }

  const body = JSON.stringify({
    ports: MAJOR_PORTS,
    vessels,
    source,
    note,
    proxiedAt: new Date().toISOString(),
  });
  liveMemCache.set(cacheKey, { body, status: 200, ts: Date.now() });
  return jsonLiveResponse(body);
}

/** DataV 区划边界代理 · 规避浏览器直连 CDN 的 CORS/403 */
async function proxyRegionGeo(adcode) {
  const upstream = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
  const res = await fetch(upstream, {
    headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-GeoProxy/1.0' },
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: `upstream ${res.status}` }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(res.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

const INDEX_PATH_RE = /^\/(?:index\.html)?$/i;
const IMMUTABLE_ASSET_RE =
  /\/assets\/(?:mod-[^/]+-|[\w.-]+-)[A-Za-z0-9_-]{6,}\.(?:js|css|woff2?|png|jpe?g|svg|webp|ico|json)$/i;

function isSpaEntryPath(pathname) {
  return INDEX_PATH_RE.test(pathname) || pathname.endsWith('/index.html');
}

/** 带 content hash 的构建产物可长期缓存；index.html / SPA 回退禁止缓存以免部署后仍见旧版 */
function withCacheHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  if (isSpaEntryPath(pathname)) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('CDN-Cache-Control', 'no-store');
  } else if (IMMUTABLE_ASSET_RE.test(pathname)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('CDN-Cache-Control', 'public, max-age=31536000, immutable');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** 遗留 china.html ?tab= 入口 → HashRouter 路径 /#/module */
function legacyChinaRedirect(url) {
  const tab = url.searchParams.get('tab') || 'dashboard';
  const rest = new URLSearchParams(url.search);
  rest.delete('tab');
  const qs = rest.toString();
  return `${url.origin}/#/${tab}${qs ? `?${qs}` : ''}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'GET' && GEO_PROXY.test(url.pathname)) {
      const adcode = url.pathname.match(GEO_PROXY)[1];
      return proxyRegionGeo(adcode);
    }

    if (request.method === 'GET' && LIVE_WEATHER.test(url.pathname)) {
      return proxyLiveWeather(url);
    }

    if (request.method === 'GET' && LIVE_AQI.test(url.pathname)) {
      return proxyLiveAqi(url, env);
    }

    if (request.method === 'GET' && LIVE_SHIPPING.test(url.pathname)) {
      return proxyLiveShipping(env);
    }

    if ((request.method === 'GET' || request.method === 'HEAD') && LEGACY_ENTRY.test(url.pathname)) {
      if (request.method === 'HEAD') {
        return new Response(null, {
          status: 302,
          headers: { Location: legacyChinaRedirect(url) },
        });
      }
      return Response.redirect(legacyChinaRedirect(url), 302);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const isHashedAsset = IMMUTABLE_ASSET_RE.test(url.pathname);

    if (assetResponse.ok || (isHashedAsset && assetResponse.status !== 404)) {
      return withCacheHeaders(assetResponse, url.pathname);
    }

    // 非静态文件 GET（如直链 /dashboard）→ SPA 入口（/ 即 index.html）
    if (request.method === 'GET' && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      const spa = await env.ASSETS.fetch(new Request(`${url.origin}/`, request));
      return withCacheHeaders(spa, '/index.html');
    }

    return assetResponse;
  },
};
