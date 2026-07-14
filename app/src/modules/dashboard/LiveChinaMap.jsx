import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import {
  CHART_TOOLTIP, applyChartTheme, chartTextColor, AXIS, LABEL,
  mapChoropleth, mapDeltaChoropleth, mapAreaIdle,
} from '../shared/chartHelpers.js';
import { EmptyState, LoadingSkeleton } from '../../app/ui.jsx';
import { getTheme, subscribeTheme, THEME_EVENT } from '../../lib/theme.js';
import {
  AS_OF,
  LAST_UPDATED,
  LAYERS,
  PALETTES,
  LAYER_TOOLTIP_FIELDS,
  REGION_PRESETS,
  getLayerById,
  getNationalStats,
  getRankings,
  PROVINCE_COORDS,
  PROVINCE_NAMES,
  RADAR_DIMS,
  getProvinceRadar,
  POLICY_ZONES,
} from './liveMapData.js';
import EChart from '../../lib/viz/EChart.jsx';
import {
  useLiveWeather, REAL_LAYERS, REAL_PALETTES, REAL_PALETTES_LIGHT,
  buildRealSeries, formatRealTooltip, formatLiveTime,
} from './liveWeather.js';
import {
  useLiveAirQuality, REAL_AQI_LAYERS, AQI_PALETTES,
  buildAqiSeries, formatAqiTooltip,
} from './liveAirQuality.js';
import {
  useLiveQuakes, buildQuakeSeries, quakeSymbolSize, quakeColor, formatQuakeTooltip,
} from './liveQuakes.js';
import {
  useLiveFlights, buildFlightSeries, formatFlightTooltip,
} from './liveFlights.js';
import {
  useLiveShipping, buildPortSeries, buildVesselSeries, portSymbolSize,
  formatPortTooltip, formatVesselTooltip,
} from './liveShipping.js';
import {
  useLiveSatellite, loadSatelliteOpacity, saveSatelliteOpacity,
  MIN_SATELLITE_OPACITY, MAX_SATELLITE_OPACITY,
  formatSatelliteTime,
} from './liveSatellite.js';
import SatelliteCloudOverlay from './SatelliteCloudOverlay.jsx';

// 种子层 + 实时层合并（综合态势置首，随后实测层，再接其余种子层）
const ALL_LAYERS = [LAYERS[0], ...REAL_LAYERS, ...REAL_AQI_LAYERS, ...LAYERS.slice(1)];
import { getTimelineSeries, MONTH_COUNT, CURRENT_MONTH_INDEX } from './liveMapHistory.js';
import LiveMapLayerBar from './LiveMapLayerBar.jsx';
import LiveMapLayerPanel from './LiveMapLayerPanel.jsx';
import LiveMapTimeline from './LiveMapTimeline.jsx';
import LiveMapSituationHero from './LiveMapSituationHero.jsx';
import LiveMapSignalSummary from './LiveMapSignalSummary.jsx';
import ProvinceDetailDrawer from './ProvinceDetailDrawer.jsx';
import { loadChinaGeo } from './liveMapGeo.js';
import {
  loadLayerPrefs, saveLayerPrefs, isLayerVisible,
  buildOverlaySeries, buildGeoLabelOption, fetchFiscalChoropleth,
} from './liveMapLayers.js';

const STEEL = '#22d3ee';
const HOLD = '#e8a317';
const ROTATE_MS = 10000;
const JITTER_MS = 30000;
const TIMELINE_MS = 1200;

function SourceBadge({ label, loading, error, fetchedAt, okColor = '#10b981', warnColor = '#e8a317' }) {
  if (loading) {
    return <span style={{ color: okColor }}>// {label} 拉取中…</span>;
  }
  if (error) {
    return <span style={{ color: warnColor }}>{label}：{error}</span>;
  }
  if (fetchedAt) {
    return (
      <span className="inline-flex items-center gap-1" style={{ color: okColor }}>
        <span className="lcm-live-dot" style={{ background: okColor }} />
        {label} {formatLiveTime(fetchedAt)}
      </span>
    );
  }
  return null;
}

function Icon({ name, size = 14, style }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} style={style} />;
}

function formatTooltip(name, layerId, metrics) {
  if (!metrics) return name;
  const layer = getLayerById(layerId);
  const lines = [`<b>${name}</b>`, `${layer.valueName}：${metrics.value}${layer.unit || ''}`];
  const fields = LAYER_TOOLTIP_FIELDS[layerId] || [];
  fields.slice(0, 4).forEach((f) => {
    const v = metrics[f.key];
    if (v != null) lines.push(`${f.label}：${f.fmt(v)}`);
  });
  return lines.join('<br/>');
}

function RankList({ title, items, accent }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] mono mb-1.5" style={{ color: 'var(--text-tertiary)' }}>{title}</div>
      <ul className="space-y-1">
        {items.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-xs rounded px-2 py-1"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <span className="mono w-4 shrink-0" style={{ color: accent }}>{i + 1}</span>
            <span className="truncate flex-1" style={{ color: 'var(--text-primary)' }}>{d.name.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')}</span>
            <span className="mono shrink-0" style={{ color: accent }}>{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatStrip({ stats, layer, simLive, inline = false }) {
  const className = inline
    ? 'flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] mono'
    : 'flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] mono py-2 px-3 rounded-lg';
  const boxStyle = inline
    ? undefined
    : { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' };

  return (
    <div className={className} style={boxStyle}>
      <span style={{ color: 'var(--text-tertiary)' }}>均值 <b key={`a${stats.avg}`} className="lcm-flash" style={{ color: STEEL }}>{stats.avg}</b></span>
      <span style={{ color: 'var(--text-tertiary)' }}>最高 <b key={`m${stats.max}`} className="lcm-flash" style={{ color: '#10b981' }}>{stats.max}</b>{!inline && <span className="hidden sm:inline"> ({stats.maxProv?.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')})</span>}</span>
      <span style={{ color: 'var(--text-tertiary)' }}>最低 <b key={`n${stats.min}`} className="lcm-flash-gold" style={{ color: '#64748b' }}>{stats.min}</b>{!inline && <span className="hidden sm:inline"> ({stats.minProv?.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')})</span>}</span>
      {!inline && (
        <>
          <span style={{ color: 'var(--text-tertiary)' }}>单位 <b style={{ color: 'var(--text-secondary)' }}>{layer.unit || '指数 0–100'}</b></span>
          <span style={{ color: 'var(--text-tertiary)' }}>更新 <b style={{ color: 'var(--text-secondary)' }}>{LAST_UPDATED}</b></span>
        </>
      )}
      {simLive && (
        <span className="inline-flex items-center gap-1" style={{ color: '#e8a317' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#e8a317' }} />
          模拟 ±2%
        </span>
      )}
    </div>
  );
}

export default function LiveChinaMap({
  className,
  variant = 'full',
  view = 'heatmap',
  deepLink,
  onDeepLinkChange,
}) {
  const isCompact = variant === 'compact';
  const showSituation = !isCompact && view === 'situation';
  // 全国态势 / 区域热力 / 信号图层 / 时间轴 均挂载中国地图（研判下钻用散点）
  const showMap = isCompact
    || view === 'situation'
    || view === 'heatmap'
    || view === 'signals'
    || view === 'timeline';
  const showSignals = !isCompact && view === 'signals';
  const showTimeline = !isCompact && view === 'timeline';
  const showAnalysis = !isCompact && view === 'analysis';
  const showLayerPanel = !isCompact && (view === 'heatmap' || view === 'signals');
  const showRankSidebar = !isCompact && (view === 'heatmap' || view === 'situation');
  const mapGridMod = showSignals
    ? 'lcm-map-grid--signals'
    : showLayerPanel && showRankSidebar
      ? 'lcm-map-grid--heatmap'
      : showRankSidebar
        ? 'lcm-map-grid--situation'
        : 'lcm-map-grid--map-only';
  const searchInputRef = useRef(null);
  const shellRef = useRef(null);
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const skipDeepLinkWrite = useRef(true);
  const [ready, setReady] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);
  /** setOption 完成且容器有有效尺寸后，才允许卫星层 convertToPixel */
  const [geoReady, setGeoReady] = useState(false);
  const [err, setErr] = useState(null);
  const [geoSource, setGeoSource] = useState('');
  const [layerPrefs, setLayerPrefs] = useState(loadLayerPrefs);
  const [satelliteOpacity, setSatelliteOpacity] = useState(loadSatelliteOpacity);
  const [fiscalData, setFiscalData] = useState(null);
  const [fiscalLoading, setFiscalLoading] = useState(false);
  const [layerId, setLayerId] = useState('composite');
  const [autoRotate, setAutoRotate] = useState(false);
  const [simLive, setSimLive] = useState(!isCompact);
  const [jitterSeed, setJitterSeed] = useState(0);
  const [theme, setThemeState] = useState(getTheme);
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH_INDEX);
  const [timelinePlaying, setTimelinePlaying] = useState(false);
  const [regionId, setRegionId] = useState('national');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [compareNames, setCompareNames] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isCompact);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [deltaMode, setDeltaMode] = useState(false);
  const [zoneId, setZoneId] = useState('');
  const [xLayer, setXLayer] = useState('economy');
  const [yLayer, setYLayer] = useState('risk');
  const [now, setNow] = useState(() => new Date());

  const showLabels = isLayerVisible('labels', layerPrefs);
  const showFiscal = isLayerVisible('fiscal-network', layerPrefs);

  const layer = ALL_LAYERS.find((l) => l.id === layerId) || getLayerById(layerId) || getLayerById('composite');
  const isReal = !!layer?.live;
  const region = REGION_PRESETS.find((r) => r.id === regionId) || REGION_PRESETS[0];

  // 真实数据源：Open-Meteo 气象/空气 + USGS 地震 + airplanes.live 空情 + 航运港口
  const isLiveWeather = layerId === 'liveTemp' || layerId === 'livePrecip';
  const isLiveAqi = layerId === 'livePm25';
  const weather = useLiveWeather(600000, (isLiveWeather || isLiveAqi) && !isCompact);
  const airQuality = useLiveAirQuality(600000, (isLiveAqi || isLiveWeather) && !isCompact);
  const showQuakes = isLayerVisible('overlay-quakes', layerPrefs);
  const showFlights = isLayerVisible('overlay-flights', layerPrefs);
  const showShipping = isLayerVisible('overlay-shipping', layerPrefs);
  const showSatellite = isLayerVisible('satellite-cloud', layerPrefs);
  const quakesState = useLiveQuakes(900000, showQuakes && !isCompact);
  const flightsState = useLiveFlights(600000, showFlights && !isCompact);
  const shippingState = useLiveShipping(600000, showShipping && !isCompact);
  const satelliteState = useLiveSatellite(600000, showSatellite && !isCompact);

  const overlayStatuses = useMemo(() => ({
    'overlay-quakes': showQuakes ? quakesState : null,
    'overlay-flights': showFlights ? flightsState : null,
    'overlay-shipping': showShipping ? shippingState : null,
    'satellite-cloud': showSatellite ? satelliteState : null,
  }), [showQuakes, showFlights, showShipping, showSatellite, quakesState, flightsState, shippingState, satelliteState]);

  const liveMetricStatus = useMemo(() => {
    if (!isReal) return null;
    if (layerId === 'livePm25') return { label: 'PM2.5', ...airQuality };
    return { label: '气象', ...weather };
  }, [isReal, layerId, weather, airQuality]);

  // 头部实时时钟（30s 粒度足够）
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const mapData = useMemo(() => {
    if (isReal) return []; // 实况层走 realSeries，种子时间轴函数不识别 live 层 id
    if (monthIndex !== CURRENT_MONTH_INDEX || timelinePlaying) {
      return getTimelineSeries(layerId, monthIndex);
    }
    if (simLive) {
      return getTimelineSeries(layerId, CURRENT_MONTH_INDEX).map((d, i) => {
        const noise = ((jitterSeed + i * 17) % 200 - 100) / 100 * 0.02;
        const value = Math.round(d.value * (1 + noise) * 10) / 10;
        return { ...d, value, metrics: { ...d.metrics, value } };
      });
    }
    return getTimelineSeries(layerId, CURRENT_MONTH_INDEX);
  }, [layerId, monthIndex, timelinePlaying, simLive, jitterSeed, isReal]);

  // Δ环比模式：当前月 − 12 月前（首月），分色呈现「谁在升温、谁在降温」（仅种子层）
  const deltaData = useMemo(() => {
    if (!deltaMode || isReal) return null;
    const cur = getTimelineSeries(layerId, CURRENT_MONTH_INDEX);
    const base = getTimelineSeries(layerId, 0);
    const baseMap = Object.fromEntries(base.map((d) => [d.name, d.value]));
    return cur.map((d) => {
      const dv = +(d.value - (baseMap[d.name] ?? d.value)).toFixed(1);
      return { ...d, value: dv, metrics: { ...d.metrics, value: dv } };
    });
  }, [deltaMode, layerId, isReal]);

  // 实况层序列（Open-Meteo / OpenAQ 实测；未就绪/失败 → 空序列 + 状态条提示）
  const realSeries = useMemo(() => {
    if (!isReal) return [];
    if (layerId === 'livePm25') return buildAqiSeries(airQuality.data);
    return buildRealSeries(layerId, weather.data);
  }, [isReal, layerId, weather.data, airQuality.data]);

  const displayData = useMemo(() => {
    const raw = showFiscal && fiscalData?.series?.length
      ? fiscalData.series
      : (isReal ? realSeries : (deltaMode && deltaData ? deltaData : mapData));
    return Array.isArray(raw) ? raw : [];
  }, [showFiscal, fiscalData, isReal, realSeries, deltaMode, deltaData, mapData]);
  const statSeries = useMemo(() => displayData.filter((d) => d?.value != null), [displayData]);
  const coloringFiscal = showFiscal && !!fiscalData?.series?.length;

  const rankings = useMemo(() => getRankings(coloringFiscal ? 'fiscal' : layerId, 5, statSeries), [coloringFiscal, layerId, statSeries]);
  const stats = useMemo(() => (statSeries.length ? getNationalStats(coloringFiscal ? 'fiscal' : layerId, statSeries) : { avg: '—', max: '—', min: '—', maxProv: '', minProv: '' }), [coloringFiscal, layerId, statSeries]);
  const themeKey = theme === 'light' ? 'light' : 'dark';
  const palette = coloringFiscal
    ? mapChoropleth(themeKey)
    : isReal && layerId === 'livePm25'
      ? AQI_PALETTES[themeKey]
      : isReal
        ? (themeKey === 'light' ? (REAL_PALETTES_LIGHT[layerId] || REAL_PALETTES[layerId]) : REAL_PALETTES[layerId])
        : (PALETTES[themeKey][layerId] || mapChoropleth(themeKey));

  const hotCoords = useMemo(() => {
    if (deltaMode || isReal) return [];
    const threshold = rankings.hot[Math.min(2, rankings.hot.length - 1)]?.value ?? 80;
    return mapData
      .filter((d) => d.value >= threshold && PROVINCE_COORDS[d.name])
      .slice(0, 8)
      .map((d) => ({ name: d.name, value: [...PROVINCE_COORDS[d.name], d.value] }));
  }, [mapData, rankings, deltaMode]);

  useEffect(() => {
    let alive = true;
    loadChinaGeo('100000')
      .then((meta) => {
        if (!alive) return;
        setGeoSource(meta.source);
        setReady(true);
        setErr(null);
      })
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  // URL 深链 → 初始省份 / 图层（缺省 layer 时强制综合态势，确保首屏即有色阶）
  useEffect(() => {
    if (!deepLink || isCompact) return undefined;
    skipDeepLinkWrite.current = true;
    setLayerId(deepLink.layer || 'composite');
    if (deepLink.province) {
      setSelectedProvince(deepLink.province);
      setSidebarOpen(false);
    }
    const id = requestAnimationFrame(() => {
      skipDeepLinkWrite.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [deepLink?.province, deepLink?.layer, isCompact]);

  // 省份 / 图层变更 → 写回 URL
  useEffect(() => {
    if (!onDeepLinkChange || isCompact || skipDeepLinkWrite.current) return;
    onDeepLinkChange({ province: selectedProvince, layer: layerId });
  }, [selectedProvince, layerId, onDeepLinkChange, isCompact]);

  useEffect(() => {
    if (!showFiscal) return undefined;
    let alive = true;
    setFiscalLoading(true);
    fetchFiscalChoropleth()
      .then((data) => alive && setFiscalData(data))
      .catch(() => alive && setFiscalData(null))
      .finally(() => alive && setFiscalLoading(false));
    return () => { alive = false; };
  }, [showFiscal]);

  const handleLayerPrefToggle = useCallback((id) => {
    setLayerPrefs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveLayerPrefs(next);
      return next;
    });
  }, []);

  const handleSatelliteOpacity = useCallback((v) => {
    const n = Math.min(MAX_SATELLITE_OPACITY, Math.max(MIN_SATELLITE_OPACITY, v));
    setSatelliteOpacity(n);
    saveSatelliteOpacity(n);
  }, []);

  useEffect(() => subscribeTheme((t) => {
    applyChartTheme(t);
    setThemeState(t);
  }), []);

  useEffect(() => {
    applyChartTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!autoRotate || isCompact) return undefined;
    const id = setInterval(() => {
      setLayerId((cur) => {
        const idx = ALL_LAYERS.findIndex((l) => l.id === cur);
        return ALL_LAYERS[(idx + 1) % ALL_LAYERS.length].id;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [autoRotate, isCompact]);

  useEffect(() => {
    if (!simLive) return undefined;
    const id = setInterval(() => setJitterSeed((s) => s + 1), JITTER_MS);
    return () => clearInterval(id);
  }, [simLive]);

  useEffect(() => {
    if (!timelinePlaying) return undefined;
    const id = setInterval(() => {
      setMonthIndex((m) => (m + 1) % MONTH_COUNT);
    }, TIMELINE_MS);
    return () => clearInterval(id);
  }, [timelinePlaying]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    if (!ready || !elRef.current || !showMap) return undefined;
    let alive = true;
    let chart = null;
    let ro = null;

    import('echarts').then((echarts) => {
      if (!alive || !elRef.current) return;
      chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
      chartRef.current = chart;
      setGeoReady(false);
      setChartInstance(chart);
      ro = new ResizeObserver(() => {
        if (chart && !chart.isDisposed?.()) {
          const el = elRef.current;
          if (el && (el.clientWidth === 0 || el.clientHeight === 0)) return;
          chart.resize();
        }
      });
      ro.observe(elRef.current);

      chart.on('click', (params) => {
        if (params.name) {
          setSelectedProvince(params.name);
          setSidebarOpen(false);
        }
      });
      // 初始化完成后立刻 resize，避免容器尚在布局中时画布为 0 宽
      requestAnimationFrame(() => {
        if (alive && chart && !chart.isDisposed?.()) {
          const el = elRef.current;
          if (el && el.clientWidth > 0 && el.clientHeight > 0) chart.resize();
        }
      });
    });

    const onTheme = () => {
      applyChartTheme(getTheme());
      setThemeState(getTheme());
    };
    window.addEventListener(THEME_EVENT, onTheme);

    return () => {
      alive = false;
      ro?.disconnect();
      window.removeEventListener(THEME_EVENT, onTheme);
      if (chart) {
        chart.off('click');
        chart.dispose();
      }
      chartRef.current = null;
      setChartInstance(null);
      setGeoReady(false);
    };
  }, [ready, showMap]);

  // 视图切换 / 侧栏显隐后强制自适应，避免时间轴等单列布局残留旧尺寸
  useEffect(() => {
    if (!chartInstance || !showMap) return undefined;
    const run = () => {
      if (chartInstance && !chartInstance.isDisposed?.()) chartInstance.resize();
    };
    const raf = requestAnimationFrame(run);
    const t = setTimeout(run, 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [chartInstance, showMap, view, mapGridMod, isFullscreen]);

  // 键盘：Esc 关抽屉 · ←→ 切省 · / 聚焦搜索
  useEffect(() => {
    if (isCompact) return undefined;
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'Escape') {
        setSelectedProvince(null);
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && PROVINCE_NAMES.length) {
        const idx = selectedProvince
          ? PROVINCE_NAMES.indexOf(selectedProvince)
          : -1;
        const next = e.key === 'ArrowRight'
          ? PROVINCE_NAMES[(idx + 1) % PROVINCE_NAMES.length]
          : PROVINCE_NAMES[(idx <= 0 ? PROVINCE_NAMES.length : idx) - 1];
        setSelectedProvince(next);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCompact, selectedProvince]);

  const toggleCompare = useCallback((name) => {
    setCompareNames((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 2) return [prev[1], name];
      return [...prev, name];
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // 导出当前地图视图为 PNG（2x 像素密度，按主题填充底色）
  const exportPng = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: theme === 'light' ? '#ffffff' : '#0a0e17' });
    const a = document.createElement('a');
    a.href = url;
    a.download = `shenzhou-live-${layerId}-${AS_OF}.png`;
    a.click();
  }, [theme, layerId]);

  // 省份搜索定位：支持简称（如「黑龙江」「内蒙古」）模糊命中 → 打开省份抽屉
  const handleSearch = useCallback((q) => {
    setSearchQ(q);
    const kw = q.trim();
    if (kw.length < 2) return;
    const hit = PROVINCE_NAMES.find((n) => n === kw) || PROVINCE_NAMES.find((n) => n.includes(kw));
    if (hit) {
      setSelectedProvince(hit);
      setSidebarOpen(false);
    }
  }, []);

  const buildOption = useCallback(() => {
    const isDark = theme !== 'light';
    const borderBase = isDark ? 'rgba(148,163,184,0.22)' : 'rgba(58,70,89,0.18)';
    const areaIdle = mapAreaIdle(isDark ? 'dark' : 'light');
    const labelColor = chartTextColor();
    const deltaPalette = mapDeltaChoropleth(isDark ? 'dark' : 'light');
    const seriesData = (displayData || []).filter((d) => d && d.name).map((d) => {
      const isHot = hotCoords.some((h) => h.name === d.name);
      const isSelected = d.name === selectedProvince;
      return {
        ...d,
        value: d.value ?? null,
        itemStyle: isHot && isDark
          ? {
            borderColor: `${STEEL}${isSelected ? 'ff' : '88'}`,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: 'rgba(34,211,238,0.28)',
            shadowBlur: 6,
          }
          : isSelected
            ? { borderColor: STEEL, borderWidth: 2 }
            : undefined,
      };
    });

    const choroplethDim = showSatellite ? 0.42 : 1;
    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mapAnim = reduceMotion ? 0 : 600;

    return {
      backgroundColor: 'transparent',
      animation: !reduceMotion,
      animationDuration: mapAnim,
      animationDurationUpdate: mapAnim,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
      tooltip: {
        trigger: 'item',
        ...CHART_TOOLTIP,
        formatter: (p) => {
          if (p.seriesType === 'lines') return '';
          if (p.seriesName === 'quakes') return formatQuakeTooltip(p);
          if (p.seriesName === 'flights') return formatFlightTooltip(p);
          if (p.seriesName === 'ports') return formatPortTooltip(p);
          if (p.seriesName === 'vessels') return formatVesselTooltip(p);
          if (isReal && layerId === 'livePm25') {
            return formatAqiTooltip(p.name, airQuality.data?.[p.name], airQuality.fetchedAt);
          }
          if (isReal) {
            return formatRealTooltip(
              p.name, layerId, weather.data?.[p.name], weather.fetchedAt, airQuality.data?.[p.name],
            );
          }
          if (coloringFiscal) {
            const m = p.data?.metrics;
            return m
              ? `<b>${p.name}</b><br/>财政自给：${m.fiscal_self}%<br/>人口：${m.pop}万 · 变动 ${m.pop_change > 0 ? '+' : ''}${m.pop_change}万`
              : p.name;
          }
          if (deltaMode) {
            const v = p.data?.value;
            return v == null ? p.name : `<b>${p.name}</b><br/>${layer?.label || layerId} Δ12月：${v > 0 ? '+' : ''}${v}`;
          }
          if (p.seriesType === 'effectScatter') return formatTooltip(p.name, layerId, mapData.find((x) => x.name === p.name)?.metrics);
          return formatTooltip(p.name, layerId, p.data?.metrics);
        },
      },
      visualMap: deltaMode && !isReal && !coloringFiscal
        ? {
          show: true,
          min: -15,
          max: 15,
          left: 8,
          bottom: isCompact ? 4 : 8,
          calculable: false,
          inRange: { color: deltaPalette },
          text: ['升温 Δ', '降温'],
          textStyle: { color: labelColor, fontSize: 10 },
          itemWidth: 12,
          itemHeight: isCompact ? 56 : 80,
          formatter: (v) => (v > 0 ? `+${Math.round(v)}` : Math.round(v)),
        }
        : {
          show: true,
          min: coloringFiscal ? 0 : (layer?.min ?? 0),
          max: coloringFiscal ? 100 : (layer?.max ?? 100),
          left: 8,
          bottom: isCompact ? 4 : 8,
          calculable: false,
          inRange: { color: palette || mapChoropleth(isDark ? 'dark' : 'light') },
          text: coloringFiscal ? ['高自给 %', '低'] : [`高${layer?.unit ? ` (${layer.unit})` : ''}`, '低'],
          textStyle: { color: labelColor, fontSize: 10 },
          itemWidth: 12,
          itemHeight: isCompact ? 56 : 80,
          formatter: (v) => Math.round(v),
        },
      geo: {
        map: 'china',
        roam: true,
        center: region.center,
        zoom: region.zoom,
        scaleLimit: { min: 0.85, max: 6 },
        regions: zoneId && POLICY_ZONES[zoneId]
          ? POLICY_ZONES[zoneId].map((n) => ({
            name: n,
            itemStyle: { borderColor: '#d4af37', borderWidth: 1.8, shadowColor: 'rgba(212,175,55,0.45)', shadowBlur: 8 },
          }))
          : [],
        itemStyle: {
          areaColor: areaIdle,
          borderColor: borderBase,
          borderWidth: 0.6,
        },
        emphasis: {
          itemStyle: {
            areaColor: isDark ? 'rgba(34,211,238,0.45)' : 'rgba(8,145,178,0.35)',
            borderColor: isDark ? STEEL : '#0891b2',
            borderWidth: 1.2,
          },
          label: { show: false },
        },
        label: buildGeoLabelOption(showLabels, labelColor),
      },
      series: [
        {
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data: seriesData,
          selectedMode: false,
          itemStyle: { opacity: choroplethDim },
          emphasis: { itemStyle: { opacity: Math.min(1, choroplethDim + 0.25) } },
        },
        ...['flow-migration', 'scatter-capitals', 'overlay-quakes', 'overlay-flights', 'overlay-shipping']
          .filter((id) => isLayerVisible(id, layerPrefs))
          .flatMap((id) => buildOverlaySeries(id, {
            theme, isCompact, STEEL, HOLD,
            quakesState, flightsState, shippingState,
            buildQuakeSeries, quakeSymbolSize, quakeColor,
            buildFlightSeries,
            buildPortSeries, buildVesselSeries, portSymbolSize,
          }) || []),
      ],
    };
  }, [theme, layer, mapData, displayData, deltaMode, isReal, coloringFiscal, weather.data, weather.fetchedAt, airQuality.data, airQuality.fetchedAt, zoneId, layerId, palette, hotCoords, region, selectedProvince, isCompact, layerPrefs, showLabels, showSatellite, quakesState, flightsState, shippingState, buildQuakeSeries, quakeSymbolSize, quakeColor, buildFlightSeries, buildPortSeries, buildVesselSeries, portSymbolSize]);

  // 依赖 chartInstance：echarts 异步 init 完成后必须再跑一遍，否则刷新后空白直至点图层
  useEffect(() => {
    const chart = chartRef.current || chartInstance;
    if (!chart || !ready || !showMap || chart.isDisposed?.()) return undefined;

    let cancelled = false;
    let retryRaf = 0;
    let retryTimer = 0;

    const apply = (allowRetry = true) => {
      if (cancelled || chart.isDisposed?.()) return;
      const el = elRef.current;
      const w = el?.clientWidth ?? chart.getWidth?.() ?? 0;
      const h = el?.clientHeight ?? chart.getHeight?.() ?? 0;
      // 容器为 0 时 setOption/geo 坐标会不完整，延后到有尺寸再渲染
      if (!(w > 0 && h > 0)) {
        setGeoReady(false);
        if (allowRetry) {
          retryRaf = requestAnimationFrame(() => apply(false));
          retryTimer = window.setTimeout(() => apply(false), 120);
        }
        return;
      }
      try {
        if (!chart.isDisposed?.()) {
          chart.resize();
        }
        chart.showLoading('default', { text: '图层渲染中…', color: STEEL, textColor: chartTextColor(), maskColor: 'rgba(10,14,23,0.35)' });
        chart.setOption(buildOption(), { notMerge: false, lazyUpdate: false });
        chart.hideLoading();
        if (!cancelled && !chart.isDisposed?.()) setGeoReady(true);
      } catch {
        if (!cancelled) setGeoReady(false);
      }
    };

    apply(true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(retryRaf);
      clearTimeout(retryTimer);
    };
  }, [ready, showMap, buildOption, chartInstance]);

  const handleLayerChange = (id) => {
    setLayerId(id);
    setMonthIndex(CURRENT_MONTH_INDEX);
    setTimelinePlaying(false);
  };

  // 图层×图层 象限散点：31 省在任意两个指标维度上的交叉定位（均值十字分象限）
  const scatterOpt = useMemo(() => {
    const xs = getTimelineSeries(xLayer, CURRENT_MONTH_INDEX);
    const ys = getTimelineSeries(yLayer, CURRENT_MONTH_INDEX);
    const ymap = Object.fromEntries(ys.map((d) => [d.name, d.value]));
    const pts = xs.filter((d) => ymap[d.name] != null).map((d) => ({ name: d.name, value: [d.value, ymap[d.name]] }));
    const xa = +(pts.reduce((s, p) => s + p.value[0], 0) / (pts.length || 1)).toFixed(1);
    const ya = +(pts.reduce((s, p) => s + p.value[1], 0) / (pts.length || 1)).toFixed(1);
    const xl = getLayerById(xLayer);
    const yl = getLayerById(yLayer);
    const short = (n) => n.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
    return {
      grid: { left: 44, right: 20, top: 26, bottom: 32 },
      tooltip: { ...CHART_TOOLTIP, formatter: (p) => `<b>${p.name}</b><br/>${xl.label}：${p.value[0]}<br/>${yl.label}：${p.value[1]}` },
      xAxis: { type: 'value', name: xl.label, nameGap: 22, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, scale: true, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      yAxis: { type: 'value', name: yl.label, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, scale: true, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      series: [{
        type: 'scatter',
        data: pts,
        symbolSize: 9,
        itemStyle: { color: STEEL, opacity: 0.8 },
        label: { show: true, position: 'top', fontSize: 8.5, color: LABEL.color, formatter: (p) => short(p.name) },
        emphasis: { itemStyle: { color: HOLD, opacity: 1 }, label: { color: HOLD } },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: 'rgba(148,163,184,0.35)', type: 'dashed' },
          label: { color: '#5b6a82', fontSize: 9 },
          data: [{ xAxis: xa, label: { formatter: `均值 ${xa}` } }, { yAxis: ya, label: { formatter: `均值 ${ya}` } }],
        },
      }],
    };
  }, [xLayer, yLayer]);

  return (
    <section
      ref={shellRef}
      className={`os-card os-section live-china-map-shell lcm-map-shell lcm-premium p-4 md:p-5 lg:p-6 ${isFullscreen ? 'live-china-map-fullscreen' : ''} ${className || ''}`}
    >
      {/* Header: title left, controls right */}
      <div className="live-china-map-toolbar flex flex-wrap items-start justify-between gap-x-6 gap-y-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Icon name="Map" size={16} style={{ color: STEEL }} />
            <h2 className="os-card-title m-0">神州活图</h2>
            <span className="lcm-live-badge inline-flex items-center gap-1.5 text-[10px] mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(34,211,238,0.12)', color: STEEL, border: '1px solid rgba(34,211,238,0.25)' }}>
              <span className="lcm-live-dot" style={{ background: '#ef4444' }} />
              LIVE
            </span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{ALL_LAYERS.length} 层 · 其中 {REAL_LAYERS.length + REAL_AQI_LAYERS.length} 实测</span>
            {!isCompact && (
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} CST
              </span>
            )}
          </div>
          <p className="text-xs m-0 mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            {isCompact ? '省级动态预览 · 点击进入完整体验' : `省级边界热力 · 实况气象/空气/地震图层 · 截至 ${AS_OF}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isCompact && (
            <Link to="/shenzhou-live" className="text-xs mono px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.35)', color: STEEL }}>
              进入模块 →
            </Link>
          )}
          {!isCompact && (
            <>
              <div className="relative">
                <Lucide.Search size={12} style={{ position: 'absolute', left: 7, top: 7, color: 'var(--text-tertiary)' }} />
                <input
                  ref={searchInputRef}
                  value={searchQ}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="定位省份…"
                  list="shenzhou-prov-list"
                  className="text-[10px] mono rounded"
                  style={{ width: 110, padding: '5px 8px 5px 24px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  aria-label="搜索省份"
                />
                <datalist id="shenzhou-prov-list">
                  {PROVINCE_NAMES.map((n) => <option key={n} value={n.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')} />)}
                </datalist>
              </div>
              <label className="inline-flex items-center gap-1.5 select-none text-[10px] mono whitespace-nowrap" style={{ color: isReal ? 'var(--text-tertiary)' : deltaMode ? '#ef4444' : 'var(--text-tertiary)', opacity: isReal ? 0.4 : 1, cursor: isReal ? 'not-allowed' : 'pointer' }} title={isReal ? '实况层为即时读数，无环比' : '当前月 − 12 月前：红升蓝降'}>
                <input type="checkbox" disabled={isReal || coloringFiscal} checked={deltaMode && !isReal && !coloringFiscal} onChange={(e) => setDeltaMode(e.target.checked)} style={{ accentColor: '#ef4444' }} />
                Δ环比
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[10px] mono whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                <input type="checkbox" checked={simLive} onChange={(e) => setSimLive(e.target.checked)} style={{ accentColor: STEEL }} />
                模拟动态
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[10px] mono whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} style={{ accentColor: STEEL }} />
                轮播图层
              </label>
              <button type="button" onClick={exportPng} className="p-1.5 rounded touch-manipulation"
                style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}
                aria-label="导出 PNG" title="导出当前视图 PNG">
                <Lucide.Download size={14} />
              </button>
              <button type="button" onClick={toggleFullscreen} className="p-1.5 rounded touch-manipulation"
                style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}
                aria-label="全屏">
                {isFullscreen ? <Lucide.Minimize2 size={14} /> : <Lucide.Maximize2 size={14} />}
              </button>
            </>
          )}
        </div>
      </div>

      <LiveMapLayerBar layers={ALL_LAYERS} activeId={layerId} onSelect={handleLayerChange} accent={STEEL} compact={isCompact} />

      {showSituation && (
        <div className="lcm-section mt-4">
          <LiveMapSituationHero
            layerId={coloringFiscal ? 'fiscal' : layerId}
            statSeries={statSeries}
            layerLabel={coloringFiscal ? '财政自给' : layer.label}
          />
        </div>
      )}

      {!isCompact && (
        <div className="lcm-kbd-hint mt-3" aria-hidden="false">
          <span><kbd>Esc</kbd> 关闭抽屉</span>
          <span><kbd>←</kbd><kbd>→</kbd> 切换省份</span>
          <span><kbd>/</kbd> 搜索定位</span>
        </div>
      )}

      {!isCompact ? (
        <div className="live-china-map-meta flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-3 mb-1">
          <span className="text-[10px] mono min-w-0 inline-flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
            {coloringFiscal ? '财政自给率' : layer.desc} · 数据源：<span style={{ color: coloringFiscal || isReal ? '#10b981' : 'var(--text-secondary)' }}>{coloringFiscal ? (fiscalData?.source === 'live' ? '网络' : '本地') : (layer.source === 'seed' ? '内置种子' : layer.source || '实况 API')}</span>
            {geoSource && <span>· 边界 <span style={{ color: geoSource === 'local' ? STEEL : geoSource === 'network' ? '#10b981' : 'var(--text-secondary)' }}>{geoSource === 'local' ? '本地' : geoSource === 'network' ? '网络' : geoSource === 'proxy' ? '代理' : '缓存'}</span></span>}
            {showFiscal && fiscalLoading && <span style={{ color: STEEL }}>// 拉取财政层…</span>}
            {liveMetricStatus && (
              <SourceBadge
                label={liveMetricStatus.label}
                loading={liveMetricStatus.loading}
                error={liveMetricStatus.error}
                fetchedAt={liveMetricStatus.fetchedAt}
              />
            )}
          </span>
          <StatStrip stats={stats} layer={layer} simLive={simLive && !isReal} inline />
        </div>
      ) : (
        <>
          <div className="text-[10px] mono mt-2.5 mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {layer.desc} · 数据源：<span style={{ color: 'var(--text-secondary)' }}>{layer.source === 'seed' ? '内置种子' : '实时'}</span>
          </div>
          <StatStrip stats={stats} layer={layer} simLive={false} />
        </>
      )}

      {!isCompact && (view === 'heatmap' || view === 'situation' || view === 'signals' || view === 'timeline') && (
        <div className="live-china-map-controls space-y-3 mt-3 lcm-section">
          {(view === 'heatmap' || view === 'situation') && (
            <>
              <div className="live-china-map-regions flex flex-wrap gap-1.5">
                {REGION_PRESETS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegionId(r.id)}
                    className="lcm-chip text-[10px] mono px-2 py-0.5 rounded-full touch-manipulation"
                    style={{
                      background: regionId === r.id ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)',
                      border: `1px solid ${regionId === r.id ? 'rgba(34,211,238,0.45)' : 'var(--border-subtle)'}`,
                      color: regionId === r.id ? STEEL : 'var(--text-secondary)',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>战略带</span>
                {Object.keys(POLICY_ZONES).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZoneId(zoneId === z ? '' : z)}
                    className="lcm-chip text-[10px] mono px-2 py-0.5 rounded-full touch-manipulation"
                    style={{
                      background: zoneId === z ? 'rgba(212,175,55,0.18)' : 'var(--bg-elevated)',
                      border: `1px solid ${zoneId === z ? 'rgba(212,175,55,0.5)' : 'var(--border-subtle)'}`,
                      color: zoneId === z ? '#d4af37' : 'var(--text-secondary)',
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </>
          )}
          {(showTimeline || view === 'heatmap') && !isReal && (
            <LiveMapTimeline
              monthIndex={monthIndex}
              onChange={(m) => { setMonthIndex(m); setTimelinePlaying(false); }}
              playing={timelinePlaying}
              onTogglePlay={() => setTimelinePlaying((p) => !p)}
              accent={STEEL}
            />
          )}
          {isReal && view !== 'situation' && (
            <div className="text-[10px] mono px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              实况层为即时观测快照（无 12 月回放）· 悬停省份查看气温/湿度/风速/降水/PM2.5 全要素 · 来源 Open-Meteo / OpenAQ 公开 API，非官方发布口径
            </div>
          )}
        </div>
      )}

      {showSignals && !isCompact && (
        <LiveMapSignalSummary
          prefs={layerPrefs}
          overlayStatuses={overlayStatuses}
          geoSource={geoSource}
          activeMetricLabel={coloringFiscal ? '财政自给率' : layer.label}
        />
      )}

      {showMap && (
      <div className={`live-china-map-body lcm-section ${!isCompact ? `live-china-map-body--full lcm-map-grid ${mapGridMod}` : ''} mt-4`}>
        {showLayerPanel && (
          <LiveMapLayerPanel
            className={showSignals ? '' : 'lcm-layer-panel--desktop-only'}
            prefs={layerPrefs}
            onToggle={handleLayerPrefToggle}
            geoSource={geoSource}
            activeMetricLabel={coloringFiscal ? '财政自给率' : layer.label}
            fiscalActive={coloringFiscal}
            fiscalMeta={fiscalData?.meta ? { year: fiscalData.meta.year, sourceNote: fiscalData.source } : null}
            overlayStatuses={overlayStatuses}
            satelliteOpacity={satelliteOpacity}
            onSatelliteOpacityChange={handleSatelliteOpacity}
            expanded={showSignals}
          />
        )}
        <div className={`live-china-map-canvas relative min-w-0 w-full ${isCompact ? 'live-china-map-canvas--compact' : ''}`}>
          <div ref={elRef} style={{ width: '100%', height: '100%' }} />
          {!isCompact && (
            <SatelliteCloudOverlay
              chart={geoReady ? chartInstance : null}
              config={satelliteState.config}
              visible={showSatellite && geoReady && !satelliteState.loading && !satelliteState.error}
              opacity={satelliteOpacity}
              theme={theme}
            />
          )}
          {showSatellite && satelliteState.loading && (
            <div className="mono text-xs absolute top-3 right-3 lcm-satellite-status" style={{ color: STEEL }}>
              // 卫星云图拉取中…
            </div>
          )}
          {showSatellite && satelliteState.error && (
            <div className="mono text-xs absolute top-3 right-3 lcm-satellite-status" style={{ color: '#e8a317' }}>
              {satelliteState.error}
            </div>
          )}
          {showSatellite && satelliteState.config && !satelliteState.error && (
            <div className="mono text-[10px] absolute bottom-2 right-2 lcm-satellite-legend px-2 py-1 rounded"
              style={{ background: 'rgba(10,14,23,0.72)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
              {satelliteState.legend || '卫星云图'}
              {formatSatelliteTime(satelliteState.timestamp) && (
                <span> · {formatSatelliteTime(satelliteState.timestamp)}</span>
              )}
            </div>
          )}
          {!ready && !err && (
            <div className="absolute inset-0 flex items-center justify-center lcm-geo-loading pointer-events-none">
              <LoadingSkeleton rows={2} label="正在加载省界边界（本地优先）…" className="w-[min(320px,80%)]" />
            </div>
          )}
          {err && (
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <div className="lcm-geo-error-banner pointer-events-auto max-w-md w-full">
                <EmptyState
                  title="地图边界加载失败"
                  description={`${err}。已尝试本地 /geo/china-100000.json、Worker 代理与 DataV。请刷新或检查网络。`}
                />
              </div>
            </div>
          )}
          {selectedProvince && !isCompact && (
            <>
              <button
                type="button"
                className="lcm-drawer-backdrop lg:hidden"
                aria-label="关闭省份详情"
                onClick={() => setSelectedProvince(null)}
              />
              <ProvinceDetailDrawer
                key={selectedProvince}
                provinceName={selectedProvince}
                layerId={isReal ? 'climate' : layerId}
                compareNames={compareNames}
                onClose={() => setSelectedProvince(null)}
                onToggleCompare={toggleCompare}
                theme={theme}
                sheet
              />
            </>
          )}
        </div>

        {!isCompact && showRankSidebar && (
          <aside className={`live-china-map-sidebar ${sidebarOpen ? 'block' : 'hidden lg:block'} ${!sidebarOpen ? 'lcm-sidebar--collapsed' : ''}`}>
            <button
              type="button"
              className="lg:hidden w-full text-[10px] mono mb-2 py-1.5 rounded flex items-center justify-center gap-1"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <Lucide.PanelRight size={12} />
              {sidebarOpen ? '收起排行' : '展开排行'}
            </button>
            <div
              className={`live-china-map-rankings flex flex-row lg:flex-col gap-4 p-3 rounded-lg lg:max-h-[560px] lg:overflow-y-auto ${!sidebarOpen ? 'hidden lg:flex' : 'flex'}`}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <RankList title={`${coloringFiscal ? '财政自给' : layer.label} · Top5`} items={rankings.hot} accent={STEEL} />
              <RankList title={`${coloringFiscal ? '财政自给' : layer.label} · Bottom5`} items={rankings.cold} accent="#64748b" />
            </div>
          </aside>
        )}
      </div>
      )}
      {(compareNames.length > 0) && !isCompact && (
        <div className="mt-4 p-3 rounded-lg"
          style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <div className="text-[10px] mono flex flex-wrap gap-2 items-center">
            <span style={{ color: 'var(--text-tertiary)' }}>对比{compareNames.length < 2 ? '（再选一省成盘）' : ''}：</span>
            {compareNames.map((n, i) => (
              <span key={n} className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: i === 0 ? STEEL : HOLD }}>
                {n.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')}
              </span>
            ))}
            <button type="button" onClick={() => setCompareNames([])} style={{ color: 'var(--text-tertiary)' }}>清除</button>
          </div>
          {compareNames.length === 2 && (() => {
            const [a, b] = compareNames;
            const va = getProvinceRadar(a);
            const vb = getProvinceRadar(b);
            const sa = a.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
            const sb = b.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
            const radar = {
              tooltip: {},
              legend: { data: [sa, sb], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10 },
              radar: {
                indicator: RADAR_DIMS.map((d) => ({ name: d.label, max: 100 })),
                radius: '64%',
                axisName: { color: LABEL.color, fontSize: 10 },
                splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
                axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
                splitArea: { show: false },
              },
              series: [{
                type: 'radar',
                data: [
                  { value: va, name: sa, lineStyle: { color: STEEL, width: 2 }, itemStyle: { color: STEEL }, areaStyle: { color: 'rgba(34,211,238,0.14)' } },
                  { value: vb, name: sb, lineStyle: { color: HOLD, width: 2 }, itemStyle: { color: HOLD }, areaStyle: { color: 'rgba(232,163,23,0.12)' } },
                ],
              }],
            };
            return (
              <div className="live-map-compare grid gap-3 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                <EChart option={radar} style={{ height: 230 }} />
                <div className="space-y-1.5 self-center">
                  {RADAR_DIMS.map((d, i) => {
                    const diff = va[i] - vb[i];
                    const lead = diff >= 0 ? sa : sb;
                    const c = diff >= 0 ? STEEL : HOLD;
                    return (
                      <div key={d.key} className="flex items-center gap-2 text-[11px]">
                        <span className="mono w-8 shrink-0" style={{ color: 'var(--text-tertiary)' }}>{d.label}</span>
                        <span className="mono w-8 text-right" style={{ color: STEEL }}>{va[i]}</span>
                        <span className="flex-1 rounded-sm relative" style={{ height: 10, background: 'var(--bg-base)' }}>
                          <span className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${va[i] / (va[i] + vb[i] || 1) * 100}%`, background: `${STEEL}55` }} />
                          <span className="absolute inset-y-0 right-0 rounded-sm" style={{ width: `${vb[i] / (va[i] + vb[i] || 1) * 100}%`, background: `${HOLD}55` }} />
                        </span>
                        <span className="mono w-8" style={{ color: HOLD }}>{vb[i]}</span>
                        <span className="mono w-20 text-right shrink-0" style={{ color: c }}>{lead} +{Math.abs(diff)}</span>
                      </div>
                    );
                  })}
                  <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                    在省份抽屉中点「加入对比」可更换对手 · 六维取自当月图层读数（示意）
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {showAnalysis && !isCompact && (
        <div className="mt-5 p-3 rounded-lg lcm-section" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Lucide.ScatterChart size={14} style={{ color: STEEL }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>象限研判 · 图层 × 图层</span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>31 省交叉定位 · 均值十字分象限 · 点击省份开详情</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
              X
              <select value={xLayer} onChange={(e) => setXLayer(e.target.value)} className="text-[10px] mono rounded"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '3px 6px' }}>
                {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              Y
              <select value={yLayer} onChange={(e) => setYLayer(e.target.value)} className="text-[10px] mono rounded"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '3px 6px' }}>
                {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </span>
          </div>
          <EChart
            option={scatterOpt}
            style={{ height: 300 }}
            onReady={(ch) => ch.on('click', (p) => { if (p.name) { setSelectedProvince(p.name); setSidebarOpen(false); } })}
          />
          <p className="text-[10px] mono mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            右上 = 双高（如 经济热度×风险态势 右上即「高热高险」需重点盯防）· 左下 = 双低 · 离均值十字越远，结构特征越极端
          </p>
        </div>
      )}

      <div className="live-china-map-footer flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 pt-4 text-[10px]" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
        {!isCompact && (
          <span className="mono inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>// 实况刷新</span>
            {liveMetricStatus && (
              <SourceBadge
                label={liveMetricStatus.label}
                loading={liveMetricStatus.loading}
                error={liveMetricStatus.error}
                fetchedAt={liveMetricStatus.fetchedAt}
              />
            )}
            {showQuakes && (
              <SourceBadge label="地震" loading={quakesState.loading} error={quakesState.error} fetchedAt={quakesState.fetchedAt} />
            )}
            {showFlights && (
              <SourceBadge label="空情" loading={flightsState.loading} error={flightsState.error} fetchedAt={flightsState.fetchedAt} />
            )}
            {showShipping && (
              <SourceBadge label="航运" loading={shippingState.loading} error={shippingState.error || shippingState.note} fetchedAt={shippingState.fetchedAt} />
            )}
            {showSatellite && (
              <SourceBadge
                label="云图"
                loading={satelliteState.loading}
                error={satelliteState.error}
                fetchedAt={satelliteState.fetchedAt}
              />
            )}
          </span>
        )}
        <span className="mono">// 纵深模块</span>
        <Link to="/modules/heshan/factsheets" className="mono hover:underline" style={{ color: STEEL }}>重构河山 ↗</Link>
        <Link to="/modules/observatory" className="mono hover:underline" style={{ color: STEEL }}>观象台 ↗</Link>
        <Link to="/econ-dashboard?tab=regional" className="mono hover:underline" style={{ color: STEEL }}>经济大盘 · 区域 ↗</Link>
        {!isCompact && <Link to="/shenzhou-live" className="mono hover:underline" style={{ color: STEEL }}>神州活图全屏页 →</Link>}
      </div>
    </section>
  );
}
