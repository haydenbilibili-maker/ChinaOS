/**
 * China OS Worker：托管 app/dist（Vite React SPA），并将遗留 /china 入口重定向到新 Hash 路由。
 *
 * 实况 API 代理（免 CORS · 内存缓存 10 分钟）：
 *   GET /api/live/weather  → Open-Meteo forecast（免 key）
 *   GET /api/live/aqi      → Open-Meteo air-quality；失败尝试 OpenAQ v2
 *   GET /api/live/shipping → 主要港口 + 可选 AISHub（secret: AIS_HUB_USERNAME）
 *   GET /api/live/satellite → RainViewer 清单 + NASA GIBS 云图回退（免 key）
 * 可选 secret: WAQI_TOKEN（IQAir WAQI，未配置则跳过）
 */

const LEGACY_ENTRY = /^\/china(?:\.html)?$/i;
const GEO_PROXY = /^\/api\/geo\/(\d+)(?:\.json)?$/i;
const LIVE_WEATHER = /^\/api\/live\/weather$/i;
const LIVE_AQI = /^\/api\/live\/aqi$/i;
const LIVE_SHIPPING = /^\/api\/live\/shipping$/i;
const LIVE_SATELLITE = /^\/api\/live\/satellite$/i;

const RAINVIEWER_MANIFEST = 'https://api.rainviewer.com/public/weather-maps.json';
const GIBS_HOST = 'https://gibs.earthdata.nasa.gov';
const GIBS_CLOUD_LAYER = 'MODIS_Terra_CorrectedReflectance_TrueColor';

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

/**
 * 卫星云图清单：RainViewer 红外（若可用）→ NASA GIBS MODIS 真彩色回退
 * RainViewer 卫星红外已于 2026-01 下线，manifest 中 infrared 常为空数组
 */
async function proxyLiveSatellite() {
  const cacheKey = 'satellite';
  const hit = liveMemCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < LIVE_TTL_MS) {
    return jsonLiveResponse(hit.body, hit.status);
  }

  let rainviewer = null;
  try {
    const res = await fetch(RAINVIEWER_MANIFEST, {
      headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-LiveProxy/1.0' },
    });
    if (res.ok) rainviewer = await res.json();
  } catch { /* GIBS fallback */ }

  const host = rainviewer?.host || 'https://tilecache.rainviewer.com';
  const infrared = rainviewer?.satellite?.infrared;
  const radarPast = rainviewer?.radar?.past;

  let payload;
  if (Array.isArray(infrared) && infrared.length) {
    const latest = infrared[infrared.length - 1];
    payload = {
      source: 'rainviewer-satellite',
      host,
      path: latest.path,
      timestamp: latest.time,
      tileSize: 512,
      maxZoom: 7,
      color: 0,
      options: '1_1',
      legend: 'RainViewer · 红外云图',
      note: null,
      proxiedAt: new Date().toISOString(),
    };
  } else {
    payload = {
      source: 'gibs',
      host: GIBS_HOST,
      layer: GIBS_CLOUD_LAYER,
      time: 'default',
      tileMatrixSet: 'GoogleMapsCompatible_Level9',
      ext: 'jpg',
      maxZoom: 9,
      timestamp: rainviewer?.generated || Math.floor(Date.now() / 1000),
      legend: 'NASA GIBS · MODIS 真彩色云图',
      note: 'RainViewer 卫星红外已下线，回退 NASA GIBS',
      radar: Array.isArray(radarPast) && radarPast.length
        ? { path: radarPast[radarPast.length - 1].path, time: radarPast[radarPast.length - 1].time }
        : null,
      proxiedAt: new Date().toISOString(),
    };
  }

  const body = JSON.stringify(payload);
  liveMemCache.set(cacheKey, { body, status: 200, ts: Date.now() });
  return jsonLiveResponse(body);
}

/** DataV 区划边界代理 · 上游 403 时回退本地 /geo/china-*.json */
async function proxyRegionGeo(adcode, env, origin) {
  const upstream = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
  try {
    const res = await fetch(upstream, {
      headers: { Accept: 'application/json', 'User-Agent': 'ChinaOS-GeoProxy/1.0' },
    });
    if (res.ok) {
      return new Response(res.body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch {
    /* 上游不可达 → 本地兜底 */
  }

  const localPath = `/geo/china-${adcode}.json`;
  const local = await env.ASSETS.fetch(new Request(`${origin}${localPath}`));
  if (local.ok) {
    return new Response(local.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'X-ChinaOS-Geo-Source': 'local-fallback',
      },
    });
  }

  return new Response(JSON.stringify({ error: `geo ${adcode} unavailable (upstream + local)` }), {
    status: 502,
    headers: {
      'Content-Type': 'application/json',
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

// ============================================================================
// 荒废斋 · 服务端鉴权
// ----------------------------------------------------------------------------
// secrets（wrangler secret put）：
//   HFZ_PASSWORD_SHA256  访问密钥的 SHA-256 十六进制摘要（明文不入库）
//   HFZ_SESSION_SECRET   会话签名密钥（任意高熵字符串）
// 会话 = HttpOnly Cookie「hfz_session」= base64url(exp).HMAC-SHA256；
// 构建产物 private/*.js（私密模块 chunk）仅在会话有效时下发。
// ============================================================================

const HFZ_LOGIN = /^\/api\/hfz\/login$/i;
const HFZ_SESSION = /^\/api\/hfz\/session$/i;
const HFZ_LOGOUT = /^\/api\/hfz\/logout$/i;
const HFZ_PRIVATE_ASSET = /^\/private\//i;
const HFZ_COOKIE = 'hfz_session';
const HFZ_REMEMBER_SEC = 24 * 60 * 60;
const HFZ_SESSION_SEC = 12 * 60 * 60;
const HFZ_MAX_ATTEMPTS = 8;
const HFZ_WINDOW_MS = 10 * 60 * 1000;
/** @type {Map<string, { n: number, ts: number }>} 每个 isolate 内的简易登录限流 */
const hfzAttempts = new Map();

const te = new TextEncoder();

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** 长度无关的常量时间比较 */
function safeEqual(a, b) {
  const x = te.encode(a);
  const y = te.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function sha256Hex(text) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode(text))));
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', te.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, te.encode(data))));
}

function hfzConfigured(env) {
  return Boolean(env.HFZ_PASSWORD_SHA256 && env.HFZ_SESSION_SECRET);
}

function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

async function hfzSessionValid(request, env) {
  if (!hfzConfigured(env)) return false;
  const token = readCookie(request, HFZ_COOKIE);
  if (!token) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now() || !sig) return false;
  return safeEqual(sig, await hmac(env.HFZ_SESSION_SECRET, `hfz:${expStr}`));
}

function hfzJson(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function hfzCookie(value, maxAgeSec) {
  const parts = [`${HFZ_COOKIE}=${value}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Strict'];
  if (maxAgeSec != null) parts.push(`Max-Age=${maxAgeSec}`);
  return parts.join('; ');
}

async function hfzLogin(request, env) {
  if (!hfzConfigured(env)) return hfzJson({ ok: false, error: 'not_configured' }, 503);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return hfzJson({ ok: false, error: 'bad_origin' }, 403);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const rec = hfzAttempts.get(ip);
  if (rec && now - rec.ts < HFZ_WINDOW_MS && rec.n >= HFZ_MAX_ATTEMPTS) {
    return hfzJson({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': String(Math.ceil((HFZ_WINDOW_MS - (now - rec.ts)) / 1000)) });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return hfzJson({ ok: false, error: 'bad_request' }, 400);
  }
  const password = typeof body.password === 'string' ? body.password : '';
  const remember = body.remember === true;

  const ok = password.length > 0 && safeEqual(await sha256Hex(password), String(env.HFZ_PASSWORD_SHA256).toLowerCase());
  if (!ok) {
    const fresh = !rec || now - rec.ts >= HFZ_WINDOW_MS;
    hfzAttempts.set(ip, { n: fresh ? 1 : rec.n + 1, ts: fresh ? now : rec.ts });
    return hfzJson({ ok: false, error: 'invalid' }, 401);
  }
  hfzAttempts.delete(ip);

  const ttl = remember ? HFZ_REMEMBER_SEC : HFZ_SESSION_SEC;
  const expStr = String(Math.floor(now / 1000) + ttl);
  const token = `${expStr}.${await hmac(env.HFZ_SESSION_SECRET, `hfz:${expStr}`)}`;
  return hfzJson({ ok: true, expiresAt: Number(expStr) * 1000 }, 200, {
    'Set-Cookie': hfzCookie(token, remember ? ttl : null),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST' && HFZ_LOGIN.test(url.pathname)) {
      return hfzLogin(request, env);
    }

    if (request.method === 'GET' && HFZ_SESSION.test(url.pathname)) {
      return hfzJson({ authenticated: await hfzSessionValid(request, env), configured: hfzConfigured(env) });
    }

    if (request.method === 'POST' && HFZ_LOGOUT.test(url.pathname)) {
      return hfzJson({ ok: true }, 200, { 'Set-Cookie': hfzCookie('', 0) });
    }

    if (HFZ_PRIVATE_ASSET.test(url.pathname)) {
      if (!(await hfzSessionValid(request, env))) {
        return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
      }
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'private, no-store');
      headers.set('CDN-Cache-Control', 'no-store');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    }

    if (request.method === 'GET' && GEO_PROXY.test(url.pathname)) {
      const adcode = url.pathname.match(GEO_PROXY)[1];
      return proxyRegionGeo(adcode, env, url.origin);
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

    if (request.method === 'GET' && LIVE_SATELLITE.test(url.pathname)) {
      return proxyLiveSatellite();
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
