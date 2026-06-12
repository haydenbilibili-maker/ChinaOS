import { useState, useEffect, useCallback } from 'react';
import {
  fetchLiveMarketQuotes,
  MARKET_SEED,
  REFRESH_INTERVAL_MS,
} from './liveQuotes.js';

/**
 * @typedef {import('./liveQuotes.js').MarketQuote} MarketQuote
 */

/**
 * @returns {{
 *   quotes: MarketQuote[],
 *   status: 'loading'|'ready'|'error'|'offline',
 *   mode: 'live'|'mixed'|'seed',
 *   updatedAt: string|null,
 *   liveCount: number,
 *   error: string|null,
 *   refresh: () => void,
 *   stale: boolean,
 * }}
 */
export function useLiveMarketData() {
  const [state, setState] = useState({
    quotes: MARKET_SEED,
    status: 'loading',
    mode: 'seed',
    updatedAt: null,
    liveCount: 0,
    error: null,
    stale: false,
  });

  const load = useCallback(async (isPoll = false) => {
    if (!isPoll) {
      setState((s) => ({ ...s, status: s.quotes.length ? 'ready' : 'loading' }));
    }
    try {
      const { quotes, mode, updatedAt, error, liveCount } = await fetchLiveMarketQuotes();
      setState({
        quotes,
        status: navigator.onLine === false ? 'offline' : 'ready',
        mode,
        updatedAt,
        liveCount,
        error: error || null,
        stale: false,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        quotes: s.quotes.length ? s.quotes : MARKET_SEED,
        status: 'error',
        mode: 'seed',
        error: e?.message || '拉取失败',
        stale: true,
      }));
    }
  }, []);

  useEffect(() => {
    let alive = true;
    load(false);
    const timer = setInterval(() => {
      if (!alive) return;
      load(true);
    }, REFRESH_INTERVAL_MS);

    const onOffline = () => setState((s) => ({ ...s, status: 'offline', stale: true }));
    const onOnline = () => { if (alive) load(true); };

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [load]);

  const refresh = useCallback(() => { load(false); }, [load]);

  return { ...state, refresh };
}
