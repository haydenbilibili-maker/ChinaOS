/**
 * China OS Worker：托管 app/dist（Vite React SPA），并将遗留 /china 入口重定向到新 Hash 路由。
 */

const LEGACY_ENTRY = /^\/china(?:\.html)?$/i;

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
