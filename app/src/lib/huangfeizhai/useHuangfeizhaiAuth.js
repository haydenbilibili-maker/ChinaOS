import { useState, useEffect, useCallback } from 'react';
import {
  AUTH_CHANGED_EVENT,
  getHuangfeizhaiAuthState,
  loginHuangfeizhai,
  logoutHuangfeizhai,
  refreshHuangfeizhaiSession,
} from '../../domain/huangfeizhai.ts';

let inflight = null;

/** 同一时刻多个组件挂载只发一次会话查询 */
function ensureSession() {
  if (getHuangfeizhaiAuthState() !== 'unknown') return Promise.resolve();
  if (!inflight) inflight = refreshHuangfeizhaiSession().finally(() => { inflight = null; });
  return inflight;
}

/**
 * 荒废斋会话 hook。
 * status: 'unknown'（尚未向服务端确认）| 'authenticated' | 'anonymous'
 */
export function useHuangfeizhaiAuth() {
  const [status, setStatus] = useState(getHuangfeizhaiAuthState);

  useEffect(() => {
    const sync = () => setStatus(getHuangfeizhaiAuthState());
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    ensureSession().then(sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, []);

  /** @returns {Promise<import('../../domain/huangfeizhai.ts').HfzLoginResult>} */
  const unlock = useCallback((password, rememberSession = false) => loginHuangfeizhai(password, rememberSession), []);

  const lock = useCallback(() => logoutHuangfeizhai(), []);

  return { status, authenticated: status === 'authenticated', unlock, lock };
}
