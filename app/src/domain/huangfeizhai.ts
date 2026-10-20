/**
 * 荒废斋 · 私人信息分区配置与客户端会话状态
 *
 * 鉴权在服务端（worker/index.js）：密钥摘要存于 Worker secret，登录成功后下发
 * HttpOnly 会话 Cookie；私密模块的构建产物（private/*.js）只在会话有效时下发。
 * 客户端只缓存「会话是否有效」用于渲染，不持有任何密钥或令牌。
 */

export const HUANGFEIZHAI_GROUP_ID = 'huangfeizhai';
export const HUANGFEIZHAI_HUB_ROUTE = '/modules/huangfeizhai';
export const AUTH_CHANGED_EVENT = 'chinaos:huangfeizhai-auth-changed';
export const HFZ_API = '/api/hfz';

/** 开发环境（vite dev，无 Worker）下的会话标记，仅存本标签页 */
const DEV_SESSION_KEY = 'chinaos.huangfeizhai.dev-session';

export type HfzAuthState = 'unknown' | 'authenticated' | 'anonymous';

export type HfzLoginError = 'invalid' | 'rate_limited' | 'not_configured' | 'network' | 'bad_request';

export type HfzLoginResult = { ok: true } | { ok: false; error: HfzLoginError; retryAfterSec?: number };

let state: HfzAuthState = 'unknown';

function isDev(): boolean {
  try {
    return Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);
  } catch {
    return false;
  }
}

function setState(next: HfzAuthState): void {
  if (state === next) return;
  state = next;
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

/** Worker 未接管（vite dev 时 /api 落到 SPA 回退）→ 响应不是 JSON */
function isJson(res: Response): boolean {
  return (res.headers.get('Content-Type') || '').includes('application/json');
}

function readDevSession(): boolean {
  try {
    return sessionStorage.getItem(DEV_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDevSession(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(DEV_SESSION_KEY, '1');
    else sessionStorage.removeItem(DEV_SESSION_KEY);
  } catch {
    /* 隐私模式等场景静默跳过 */
  }
}

export function getHuangfeizhaiAuthState(): HfzAuthState {
  return state;
}

export function isHuangfeizhaiAuthenticated(): boolean {
  return state === 'authenticated';
}

/** 向服务端确认会话；网络失败时保守视为未登录 */
export async function refreshHuangfeizhaiSession(fetchImpl: typeof fetch = fetch): Promise<boolean> {
  try {
    const res = await fetchImpl(`${HFZ_API}/session`, { credentials: 'same-origin', cache: 'no-store' });
    if (!isJson(res)) {
      const dev = isDev() && readDevSession();
      setState(dev ? 'authenticated' : 'anonymous');
      return dev;
    }
    const body = (await res.json()) as { authenticated?: boolean };
    const ok = body.authenticated === true;
    setState(ok ? 'authenticated' : 'anonymous');
    return ok;
  } catch {
    setState('anonymous');
    return false;
  }
}

export async function loginHuangfeizhai(
  password: string,
  remember = false,
  fetchImpl: typeof fetch = fetch,
): Promise<HfzLoginResult> {
  if (!password) return { ok: false, error: 'bad_request' };
  let res: Response;
  try {
    res = await fetchImpl(`${HFZ_API}/login`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, remember }),
    });
  } catch {
    return { ok: false, error: 'network' };
  }

  if (!isJson(res)) {
    // 本地 vite dev 没有 Worker：放行并在本标签页记住，生产构建永不走此分支
    if (isDev()) {
      writeDevSession(true);
      setState('authenticated');
      return { ok: true };
    }
    return { ok: false, error: 'not_configured' };
  }

  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: HfzLoginError };
  if (res.ok && body.ok) {
    setState('authenticated');
    return { ok: true };
  }
  const retry = Number(res.headers.get('Retry-After'));
  return {
    ok: false,
    error: body.error ?? (res.status === 429 ? 'rate_limited' : 'invalid'),
    ...(Number.isFinite(retry) && retry > 0 ? { retryAfterSec: retry } : {}),
  };
}

export async function logoutHuangfeizhai(fetchImpl: typeof fetch = fetch): Promise<void> {
  writeDevSession(false);
  try {
    await fetchImpl(`${HFZ_API}/logout`, { method: 'POST', credentials: 'same-origin' });
  } catch {
    /* 即使网络失败也先在本地锁上 */
  }
  setState('anonymous');
}

/** 仅供测试：重置模块内状态 */
export function __resetHuangfeizhaiState(): void {
  state = 'unknown';
}

export const HUANGFEIZHAI_PROTECTED_ROUTES = [
  HUANGFEIZHAI_HUB_ROUTE,
  '/modules/personal-review',
  '/modules/me',
] as const;

export function isHuangfeizhaiRoute(path: string): boolean {
  return HUANGFEIZHAI_PROTECTED_ROUTES.some(
    (r) => path === r || path.startsWith(`${r}/`),
  );
}
