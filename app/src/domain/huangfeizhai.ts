/** 荒废斋 · 私人信息分区配置与客户端门禁（混淆级，非服务端安全） */

export const HUANGFEIZHAI_GROUP_ID = 'huangfeizhai';
export const HUANGFEIZHAI_HUB_ROUTE = '/modules/huangfeizhai';
export const AUTH_STORAGE_KEY = 'chinaos.huangfeizhai.auth.v1';
export const AUTH_SESSION_KEY = 'chinaos.huangfeizhai.auth.session';
export const AUTH_CHANGED_EVENT = 'chinaos:huangfeizhai-auth-changed';

/** 默认访问密钥（仅客户端混淆；生产可改此常量或后续接环境变量） */
export const DEFAULT_PASSWORD = 'admin888';

/** 「记住本会话」持久化有效期（毫秒） */
export const PERSISTENT_SESSION_MS = 24 * 60 * 60 * 1000;

export interface HuangfeizhaiAuthRecord {
  v: 1;
  at: number;
  exp?: number;
}

function parseRecord(raw: string | null): HuangfeizhaiAuthRecord | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as HuangfeizhaiAuthRecord;
    if (o?.v !== 1 || typeof o.at !== 'number') return null;
    if (o.exp != null && Date.now() > o.exp) return null;
    return o;
  } catch {
    return null;
  }
}

function readAuth(storage: Storage, key: string): HuangfeizhaiAuthRecord | null {
  try {
    return parseRecord(storage.getItem(key));
  } catch {
    return null;
  }
}

function writeAuth(storage: Storage, key: string, record: HuangfeizhaiAuthRecord): void {
  try {
    storage.setItem(key, JSON.stringify(record));
  } catch {
    /* 隐私模式等场景静默跳过 */
  }
}

function clearAuth(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    /* 隐私模式等场景静默跳过 */
  }
}

function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

export function verifyPassword(password: string): boolean {
  return password === DEFAULT_PASSWORD;
}

export function isHuangfeizhaiAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const session = readAuth(sessionStorage, AUTH_SESSION_KEY);
  if (session) return true;
  const persistent = readAuth(localStorage, AUTH_STORAGE_KEY);
  return persistent != null;
}

export function unlockHuangfeizhai(rememberSession = false): void {
  const record: HuangfeizhaiAuthRecord = {
    v: 1,
    at: Date.now(),
    ...(rememberSession ? { exp: Date.now() + PERSISTENT_SESSION_MS } : {}),
  };

  if (rememberSession) {
    writeAuth(localStorage, AUTH_STORAGE_KEY, record);
    clearAuth(sessionStorage, AUTH_SESSION_KEY);
  } else {
    writeAuth(sessionStorage, AUTH_SESSION_KEY, record);
    clearAuth(localStorage, AUTH_STORAGE_KEY);
  }
  notifyAuthChanged();
}

export function lockHuangfeizhai(): void {
  if (typeof window === 'undefined') return;
  clearAuth(sessionStorage, AUTH_SESSION_KEY);
  clearAuth(localStorage, AUTH_STORAGE_KEY);
  notifyAuthChanged();
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
