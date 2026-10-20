import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetHuangfeizhaiState,
  getHuangfeizhaiAuthState,
  isHuangfeizhaiAuthenticated,
  isHuangfeizhaiRoute,
  loginHuangfeizhai,
  logoutHuangfeizhai,
  refreshHuangfeizhaiSession,
} from '../../../domain/huangfeizhai.ts';

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function mockStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k) => store.get(k) ?? null,
    key: (i) => [...store.keys()][i] ?? null,
    removeItem: (k) => { store.delete(k); },
    setItem: (k, v) => { store.set(k, v); },
  };
}

describe('huangfeizhai server auth client', () => {
  beforeEach(() => {
    __resetHuangfeizhaiState();
    vi.stubGlobal('sessionStorage', mockStorage());
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts unknown and resolves from the session endpoint', async () => {
    expect(getHuangfeizhaiAuthState()).toBe('unknown');
    const fetchImpl = vi.fn(async () => json({ authenticated: true, configured: true }));
    await expect(refreshHuangfeizhaiSession(fetchImpl as unknown as typeof fetch)).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith('/api/hfz/session', expect.objectContaining({ credentials: 'same-origin' }));
    expect(isHuangfeizhaiAuthenticated()).toBe(true);
  });

  it('treats a network failure as anonymous', async () => {
    const fetchImpl = vi.fn(async () => { throw new Error('offline'); });
    await expect(refreshHuangfeizhaiSession(fetchImpl as unknown as typeof fetch)).resolves.toBe(false);
    expect(getHuangfeizhaiAuthState()).toBe('anonymous');
  });

  it('sends the password to the server and never compares it locally', async () => {
    const fetchImpl = vi.fn(async () => json({ ok: true }));
    const res = await loginHuangfeizhai('secret', true, fetchImpl as unknown as typeof fetch);
    expect(res).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/hfz/login');
    expect(JSON.parse(String(init.body))).toEqual({ password: 'secret', remember: true });
    expect(isHuangfeizhaiAuthenticated()).toBe(true);
  });

  it('maps server rejections to error codes', async () => {
    const invalid = vi.fn(async () => json({ ok: false, error: 'invalid' }, 401));
    await expect(loginHuangfeizhai('x', false, invalid as unknown as typeof fetch)).resolves.toEqual({ ok: false, error: 'invalid' });

    const limited = vi.fn(async () => json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '120' }));
    await expect(loginHuangfeizhai('x', false, limited as unknown as typeof fetch)).resolves.toEqual({
      ok: false,
      error: 'rate_limited',
      retryAfterSec: 120,
    });
    expect(isHuangfeizhaiAuthenticated()).toBe(false);
  });

  it('rejects an empty password without a request', async () => {
    const fetchImpl = vi.fn();
    await expect(loginHuangfeizhai('', false, fetchImpl as unknown as typeof fetch)).resolves.toEqual({ ok: false, error: 'bad_request' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('logs out on the server and locks locally', async () => {
    await loginHuangfeizhai('secret', false, (async () => json({ ok: true })) as unknown as typeof fetch);
    const fetchImpl = vi.fn(async () => json({ ok: true }));
    await logoutHuangfeizhai(fetchImpl as unknown as typeof fetch);
    expect(fetchImpl).toHaveBeenCalledWith('/api/hfz/logout', expect.objectContaining({ method: 'POST' }));
    expect(isHuangfeizhaiAuthenticated()).toBe(false);
  });

  it('recognizes protected routes', () => {
    expect(isHuangfeizhaiRoute('/modules/huangfeizhai')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/personal-review')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/me')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/observatory')).toBe(false);
  });
});
