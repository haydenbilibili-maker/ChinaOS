import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_SESSION_KEY,
  AUTH_STORAGE_KEY,
  DEFAULT_PASSWORD,
  isHuangfeizhaiAuthenticated,
  isHuangfeizhaiRoute,
  lockHuangfeizhai,
  unlockHuangfeizhai,
  verifyPassword,
} from '../../../domain/huangfeizhai.ts';

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

describe('huangfeizhai auth', () => {
  beforeEach(() => {
    vi.stubGlobal('sessionStorage', mockStorage());
    vi.stubGlobal('localStorage', mockStorage());
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    lockHuangfeizhai();
    vi.unstubAllGlobals();
  });

  it('verifies default password', () => {
    expect(verifyPassword(DEFAULT_PASSWORD)).toBe(true);
    expect(verifyPassword('wrong')).toBe(false);
  });

  it('unlocks with session storage by default', () => {
    expect(isHuangfeizhaiAuthenticated()).toBe(false);
    unlockHuangfeizhai(false);
    expect(isHuangfeizhaiAuthenticated()).toBe(true);
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeTruthy();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('persists when remember session is checked', () => {
    unlockHuangfeizhai(true);
    expect(isHuangfeizhaiAuthenticated()).toBe(true);
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy();
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('locks and clears both storages', () => {
    unlockHuangfeizhai(true);
    lockHuangfeizhai();
    expect(isHuangfeizhaiAuthenticated()).toBe(false);
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('recognizes protected routes', () => {
    expect(isHuangfeizhaiRoute('/modules/huangfeizhai')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/personal-review')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/me')).toBe(true);
    expect(isHuangfeizhaiRoute('/modules/observatory')).toBe(false);
  });
});
