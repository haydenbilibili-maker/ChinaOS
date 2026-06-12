/** 直播信号工具：播放地址解析、可播性判定、角标文案 */

const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i;

/** 开发代理白名单：curl 验证通过但无 CORS 头的 HLS 源端 */
export const HLS_PROXY_ALLOW_HOSTS = [
  'devstreaming-cdn.apple.com',
  'nasa-i.akamaihd.net',
];

/** @param {string} rawUrl */
export function isHlsProxyAllowed(rawUrl) {
  if (!rawUrl) return false;
  try {
    const { hostname } = new URL(rawUrl);
    return HLS_PROXY_ALLOW_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

/** @param {string} raw */
export function isAllowedStreamTarget(raw) {
  if (!raw || typeof raw !== 'string') return false;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (PRIVATE_HOST_RE.test(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * 开发环境经 Vite 代理拉取 HLS，规避无 CORS 头的源端限制。
 * 仅对白名单域名启用代理；CORS 开放的源直连即可。
 * @param {string} rawUrl
 * @param {{ forceProxy?: boolean, useProxy?: boolean }} [opts]
 */
export function resolveHlsUrl(rawUrl, opts = {}) {
  if (!rawUrl) return rawUrl;
  const wantProxy = opts.useProxy ?? import.meta.env.DEV;
  const useProxy = wantProxy && isHlsProxyAllowed(rawUrl);
  if (useProxy && isAllowedStreamTarget(rawUrl)) {
    return `/api/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

/** @param {{ playVerified?: boolean }} stream */
export function isPlayableInPage(stream) {
  return stream?.playVerified === true;
}

/** @param {{ playVerified?: boolean, id?: string, embedType?: string, needsProxy?: boolean }} stream */
export function embedBadgeLabel(stream) {
  if (!stream) return '外链';
  if (stream.embedType === 'hls' && stream.id?.startsWith('hls-demo-')) {
    return stream.playVerified ? '演示流' : '演示流·代理';
  }
  if (isPlayableInPage(stream)) return '公开信号';
  if (stream.embedType === 'hls' && stream.needsProxy) return '演示流·代理';
  return '外链';
}

/** @param {{ playVerified?: boolean }} stream */
export function embedBadgeTone(stream) {
  return isPlayableInPage(stream) ? 'playable' : 'external';
}
