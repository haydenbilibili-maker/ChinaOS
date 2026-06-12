/**
 * China OS Worker：托管 app/dist（Vite React SPA），并将遗留 /china 入口重定向到新 Hash 路由。
 */

const LEGACY_ENTRY = /^\/china(?:\.html)?$/i;

/** 带 content hash 的构建产物可长期缓存；index.html 禁止缓存以免部署后仍见旧版 */
function withCacheHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  if (pathname === '/' || pathname.endsWith('/index.html')) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('CDN-Cache-Control', 'no-store');
  } else if (/\/assets\/[^/]+\.(js|css|woff2?)$/i.test(pathname)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
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
    const isHashedAsset = /\/assets\/[^/]+\.(js|css|woff2?|png|jpe?g|svg|webp|ico|json)$/i.test(url.pathname);

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
