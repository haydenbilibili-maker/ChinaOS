import { useState, useEffect, useCallback } from 'react';
import DataBus from '../../lib/data/DataBus.js';
import {
  buildMacroKpiSnapshot,
  DASHBOARD_REFRESH_MS,
  MACRO_AS_OF,
} from './data.js';

function mergeLiveGdp(kpis, live) {
  const growth = live?.gdpGrowth;
  if (growth?.value == null) return kpis;
  return kpis.map((k) => {
    if (k.liveKey !== 'gdpGrowth') return k;
    return {
      ...k,
      v: `${Number(growth.value).toFixed(1)}%`,
      asOf: String(growth.date || k.asOf),
      note: 'WB 实时 · 年同比',
      live: true,
    };
  });
}

/** 宏观 KPI 脉冲：60s DataBus 刷新 + 倒计时 + 刷新计数（驱动 Hero 闪光） */
export function useMacroPulse() {
  const [kpis, setKpis] = useState(buildMacroKpiSnapshot);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [secondsToNext, setSecondsToNext] = useState(Math.floor(DASHBOARD_REFRESH_MS / 1000));

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      DataBus.clearCache();
      const live = await DataBus.chinaIndicators().catch(() => null);
      setKpis(mergeLiveGdp(buildMacroKpiSnapshot(), live));
      setLastRefresh(new Date());
      setRefreshCount((c) => c + 1);
      setSecondsToNext(Math.floor(DASHBOARD_REFRESH_MS / 1000));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, DASHBOARD_REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsToNext((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return {
    kpis,
    asOf: MACRO_AS_OF,
    lastRefresh,
    isRefreshing,
    refreshCount,
    secondsToNext,
    refresh,
  };
}
