import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i;

/** 与 streamUtils.js HLS_PROXY_ALLOW_HOSTS 同步 */
const HLS_PROXY_ALLOW_HOSTS = [
  'devstreaming-cdn.apple.com',
  'nasa-i.akamaihd.net',
];

function isAllowedProxyTarget(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (PRIVATE_HOST_RE.test(u.hostname)) return false;
    if (!/\.m3u8(\?|$)/i.test(u.pathname + u.search)) return false;
    return HLS_PROXY_ALLOW_HOSTS.some(
      (h) => u.hostname === h || u.hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

/** 开发环境 HLS 代理：仅转发 .m3u8，屏蔽内网地址 */
function streamProxyPlugin() {
  return {
    name: 'stream-proxy',
    configureServer(server) {
      server.middlewares.use('/api/stream-proxy', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const target = urlObj.searchParams.get('url');
          if (!target || !isAllowedProxyTarget(target)) {
            res.statusCode = 400;
            res.end('Invalid stream URL');
            return;
          }

          const targetUrl = new URL(target);
          const upstream = await fetch(target, {
            headers: {
              Accept: '*/*',
              'User-Agent': 'china2OS-dev-stream-proxy/1.0',
              ...(targetUrl.hostname.endsWith('akamaihd.net')
                ? { Referer: 'https://www.nasa.gov/' }
                : {}),
            },
          });

          res.statusCode = upstream.status;
          const ct = upstream.headers.get('content-type');
          if (ct) res.setHeader('Content-Type', ct);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'no-cache');

          const body = Buffer.from(await upstream.arrayBuffer());
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.end(String(err?.message || 'Proxy error'));
        }
      });
    },
  };
}

// base: './' 便于部署到任意静态子路径（与现有 china.html 静态托管一致）
export default defineConfig({
  plugins: [react(), streamProxyPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    proxy: {
      // 新浪行情 · 开发环境规避 CORS
      '/api/sina': {
        target: 'https://hq.sinajs.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sina/, ''),
        headers: { Referer: 'https://finance.sina.com.cn' },
      },
      // Frankfurter 汇率 · 部分网络环境直连不稳定
      '/api/frankfurter': {
        target: 'https://api.frankfurter.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/frankfurter/, ''),
      },
      // Yahoo Finance · 美债收益率等
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      // 东方财富 · A 股备用源
      '/api/eastmoney': {
        target: 'https://push2.eastmoney.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/eastmoney/, ''),
      },
    },
  },
});
