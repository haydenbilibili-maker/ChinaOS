import { useState, useEffect, useCallback } from 'react';
import {
  AUTH_CHANGED_EVENT,
  isHuangfeizhaiAuthenticated,
  lockHuangfeizhai,
  unlockHuangfeizhai,
  verifyPassword,
} from '../../domain/huangfeizhai.ts';

export function useHuangfeizhaiAuth() {
  const [authenticated, setAuthenticated] = useState(() => isHuangfeizhaiAuthenticated());

  useEffect(() => {
    const sync = () => setAuthenticated(isHuangfeizhaiAuthenticated());
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, []);

  const unlock = useCallback((password, rememberSession = false) => {
    if (!verifyPassword(password)) return false;
    unlockHuangfeizhai(rememberSession);
    setAuthenticated(true);
    return true;
  }, []);

  const lock = useCallback(() => {
    lockHuangfeizhai();
    setAuthenticated(false);
  }, []);

  return { authenticated, unlock, lock };
}
