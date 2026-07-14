import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AS_OF,
  LAST_UPDATED,
  LAYERS,
  getNationalStats,
} from './liveMapData.js';
import { useLiveWeather, buildRealSeries, formatLiveTime, REAL_LAYERS } from './liveWeather.js';
import { useLiveAirQuality, buildAqiSeries, REAL_AQI_LAYERS } from './liveAirQuality.js';
import { useLiveQuakes } from './liveQuakes.js';

const STEEL = '#22d3ee';
const HOLD = '#e8a317';
const LIVE = '#10b981';

function shortProv(name) {
  if (!name) return '—';
  return name.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
}

function fmtClock(d) {
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function resolveLayer(id) {
  const seed = LAYERS.find((l) => l.id === id);
  if (seed) return seed;
  const real = [...REAL_LAYERS, ...REAL_AQI_LAYERS].find((l) => l.id === id);
  return real || LAYERS[0];
}

function seriesExtremes(series, unit = '') {
  const vals = (series || []).filter((d) => d.value != null && Number.isFinite(d.value));
  if (!vals.length) return null;
  let max = vals[0];
  let min = vals[0];
  let sum = 0;
  for (const d of vals) {
    if (d.value > max.value) max = d;
    if (d.value < min.value) min = d;
    sum += d.value;
  }
  const avg = Math.round((sum / vals.length) * 10) / 10;
  return {
    avg,
    max: max.value,
    min: min.value,
    maxProv: shortProv(max.name),
    minProv: shortProv(min.name),
    unit,
  };
}

function TickerChip({ item }) {
  const body = (
    <>
      <span className="lcm-ticker__k" style={{ color: 'var(--text-tertiary)' }}>{item.k}</span>
      <span className="lcm-ticker__v" style={{ color: item.color || 'var(--text-primary)' }}>{item.v}</span>
      {item.note && (
        <span className="lcm-ticker__note" style={{ color: 'var(--text-tertiary)' }}>{item.note}</span>
      )}
    </>
  );

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="lcm-ticker__chip lcm-ticker__chip--link inline-flex items-center gap-1.5 text-xs mono shrink-0"
        title={item.title}
      >
        {body}
      </Link>
    );
  }

  return (
    <span
      className="lcm-ticker__chip inline-flex items-center gap-1.5 text-xs mono shrink-0"
      title={item.title}
    >
      {body}
    </span>
  );
}

/**
 * 神州活图 · 实况跑马灯
 * 仅聚合既有种子层统计 + Open-Meteo/USGS 刷新态，不编造事件标题。
 */
export default function LiveMapTicker({
  layerId = 'composite',
  className = '',
  compact = false,
}) {
  const weather = useLiveWeather();
  const aqi = useLiveAirQuality();
  const quakes = useLiveQuakes();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const activeId = layerId || 'composite';
  const activeLayer = resolveLayer(activeId);
  const activeLabel = activeLayer.label || activeId;
  const isLiveMetric = !!(activeLayer.live || REAL_LAYERS.some((l) => l.id === activeId) || REAL_AQI_LAYERS.some((l) => l.id === activeId));
  const seedStats = useMemo(
    () => (isLiveMetric ? null : getNationalStats(activeId)),
    [activeId, isLiveMetric],
  );

  const items = useMemo(() => {
    const list = [];

    list.push({
      id: 'live-clock',
      k: 'CST',
      v: fmtClock(now),
      color: STEEL,
      title: '本地时钟（约 30s 刷新显示）',
    });

    list.push({
      id: 'as-of',
      k: 'AS_OF',
      v: AS_OF,
      color: LIVE,
      note: '基准',
      title: `种子层数据基准 ${LAST_UPDATED}`,
    });

    list.push({
      id: 'layer',
      k: '当前层',
      v: activeLabel,
      color: STEEL,
      note: isLiveMetric ? '实测' : '示意',
      title: activeLayer.desc || activeLabel,
    });

    if (seedStats) {
      list.push({
        id: 'stat-avg',
        k: '均值',
        v: String(seedStats.avg),
        color: STEEL,
        note: activeLayer.unit || '指数',
        title: `${activeLabel} 全国均值（种子）`,
      });
      list.push({
        id: 'stat-max',
        k: '最高',
        v: `${shortProv(seedStats.maxProv)} ${seedStats.max}`,
        color: LIVE,
        title: `${activeLabel} 最高省份（种子）`,
      });
      list.push({
        id: 'stat-min',
        k: '最低',
        v: `${shortProv(seedStats.minProv)} ${seedStats.min}`,
        color: '#94a3b8',
        title: `${activeLabel} 最低省份（种子）`,
      });
    }

    if (weather.fetchedAt && !weather.error) {
      list.push({
        id: 'wx-refresh',
        k: '气象',
        v: formatLiveTime(weather.fetchedAt),
        color: LIVE,
        note: 'Open-Meteo',
        title: '实况气温/降水最近刷新',
      });
      const tempEx = seriesExtremes(buildRealSeries('liveTemp', weather.data), '°C');
      if (tempEx) {
        list.push({
          id: 'wx-max',
          k: '气温最高',
          v: `${tempEx.maxProv} ${tempEx.max}${tempEx.unit}`,
          color: HOLD,
          title: '省会站点实况气温最高（近似）',
        });
        list.push({
          id: 'wx-min',
          k: '气温最低',
          v: `${tempEx.minProv} ${tempEx.min}${tempEx.unit}`,
          color: STEEL,
          title: '省会站点实况气温最低（近似）',
        });
      }
    } else if (weather.loading) {
      list.push({
        id: 'wx-load',
        k: '气象',
        v: '拉取中…',
        color: STEEL,
        title: 'Open-Meteo 请求中',
      });
    } else if (weather.error) {
      list.push({
        id: 'wx-err',
        k: '气象',
        v: '暂不可用',
        color: HOLD,
        note: '示意层仍可用',
        title: weather.error,
      });
    }

    if (aqi.fetchedAt && !aqi.error) {
      list.push({
        id: 'aqi-refresh',
        k: 'PM2.5',
        v: formatLiveTime(aqi.fetchedAt),
        color: LIVE,
        note: '空气质量',
        title: 'PM2.5 实况最近刷新',
      });
      const pmEx = seriesExtremes(buildAqiSeries(aqi.data), ' µg/m³');
      if (pmEx) {
        list.push({
          id: 'pm-max',
          k: 'PM2.5 最高',
          v: `${pmEx.maxProv} ${pmEx.max}`,
          color: HOLD,
          note: '近似',
          title: '省会站点 PM2.5 最高（近似）',
        });
      }
    }

    if (quakes.fetchedAt && quakes.quakes) {
      list.push({
        id: 'quake',
        k: '地震层',
        v: `M4.0+ ${quakes.quakes.length} 条`,
        color: quakes.quakes.length ? HOLD : LIVE,
        note: `USGS · ${formatLiveTime(quakes.fetchedAt)}`,
        title: '近 30 日中国及周边 M4.0+（USGS）',
      });
    } else if (quakes.loading) {
      list.push({
        id: 'quake-load',
        k: '地震层',
        v: '同步中',
        color: STEEL,
        title: 'USGS 拉取中',
      });
    }

    list.push({
      id: 'geo',
      k: '省界',
      v: '本地 GeoJSON',
      color: STEEL,
      note: '优先',
      title: '/geo/china-100000.json · DataV 仅作回退',
    });

    list.push({
      id: 'x-econ',
      k: '对照',
      v: '经济大盘 · 区域',
      color: STEEL,
      to: '/econ-dashboard?tab=regional',
      title: '跳转经济大盘区域视图',
    });

    list.push({
      id: 'x-heshan',
      k: '对照',
      v: '重构河山',
      color: '#f87171',
      to: '/modules/heshan/factsheets',
      title: '跳转重构河山拟省图',
    });

    return list;
  }, [now, activeId, activeLabel, activeLayer, isLiveMetric, seedStats, weather, aqi, quakes]);

  const track = (dup) => items.map((item) => (
    <TickerChip key={`${dup}-${item.id}`} item={item} />
  ));

  return (
    <div
      className={`lcm-ticker${compact ? ' lcm-ticker--compact' : ''} ${className}`.trim()}
      role="region"
      aria-label="神州活图实况跑马灯"
    >
      <div className="lcm-ticker__head">
        <span className="lcm-ticker__live" aria-hidden="true">
          <span className="lcm-ticker__pulse" />
          LIVE
        </span>
        <span className="lcm-ticker__meta mono">
          实况条 · {activeLabel} · hover 暂停
        </span>
      </div>
      <div className="lcm-ticker__rail os-ticker">
        <div className="lcm-ticker__track os-ticker-track">
          {track('a')}
          {track('b')}
        </div>
      </div>
    </div>
  );
}
