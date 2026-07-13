import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import * as echarts from 'echarts';
import { CHART_TOOLTIP, applyChartTheme, chartTextColor } from '../shared/chartHelpers.js';
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
  buildRealSeries, formatRealTooltip,
} from './liveWeather.js';
import {
  useLiveQuakes, buildQuakeSeries, quakeSymbolSize, quakeColor, formatQuakeTooltip,
} from './liveQuakes.js';
import {
  useLiveFlights, buildFlightSeries, formatFlightTooltip,
} from './liveFlights.js';

// 种子层 + 实时层合并（综合态势置首，随后两个真实数据层，再接其余种子层）
const ALL_LAYERS = [LAYERS[0], ...REAL_LAYERS, ...LAYERS.slice(1)];
import { getTimelineSeries, MONTH_COUNT, CURRENT_MONTH_INDEX } from './liveMapHistory.js';
import LiveMapLayerBar from './LiveMapLayerBar.jsx';
import LiveMapLayerPanel from './LiveMapLayerPanel.jsx';
import LiveMapTimeline from './LiveMapTimeline.jsx';
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

const FISCAL_PALETTE = {
  dark: ['#0a1628', '#1e3a5f', '#b45309', '#dc2626'],
  light: ['#f8fafc', '#fde68a', '#f59e0b', '#b91c1c'],
};

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
          <li key={d.name} className="lcm-rise flex items-center gap-2 text-xs rounded px-2 py-1"
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

export default function LiveChinaMap({ className, variant = 'full' }) {
  const isCompact = variant === 'compact';
  const shellRef = useRef(null);
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);
  const [geoSource, setGeoSource] = useState('');
  const [layerPrefs, setLayerPrefs] = useState(loadLayerPrefs);
  const [fiscalData, setFiscalData] = useState(null);
  const [fiscalLoading, setFiscalLoading] = useState(false);
  const [layerId, setLayerId] = useState('composite');
  const [autoRotate, setAutoRotate] = useState(false);
  const [simLive, setSimLive] = useState(!isCompact);
  const [jitterSeed, setJitterSeed] = useState(0);
  const [theme, setThemeState] = useState(getTheme);
  const [pulsePhase, setPulsePhase] = useState(0);
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

  const layer = ALL_LAYERS.find((l) => l.id === layerId) || getLayerById(layerId);
  const isReal = !!layer.live;
  const region = REGION_PRESETS.find((r) => r.id === regionId) || REGION_PRESETS[0];

  // 真实数据源：Open-Meteo 气象/空气质量（实况层激活时取数）+ USGS 地震（开关激活时取数）
  const weather = useLiveWeather();
  const quakesState = useLiveQuakes();
  const flightsState = useLiveFlights();

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

  // 实况层序列（Open-Meteo 实测；未就绪/失败 → 空序列 + 状态条提示）
  const realSeries = useMemo(() => {
    if (!isReal || !weather.data) return [];
    return buildRealSeries(layerId, weather.data);
  }, [isReal, layerId, weather.data]);

  const displayData = showFiscal && fiscalData?.series?.length
    ? fiscalData.series
    : (isReal ? realSeries : (deltaMode && deltaData ? deltaData : mapData));
  const statSeries = useMemo(() => displayData.filter((d) => d.value != null), [displayData]);
  const coloringFiscal = showFiscal && !!fiscalData?.series?.length;

  const rankings = useMemo(() => getRankings(coloringFiscal ? 'fiscal' : layerId, 5, statSeries), [coloringFiscal, layerId, statSeries]);
  const stats = useMemo(() => (statSeries.length ? getNationalStats(coloringFiscal ? 'fiscal' : layerId, statSeries) : { avg: '—', max: '—', min: '—', maxProv: '', minProv: '' }), [coloringFiscal, layerId, statSeries]);
  const palette = coloringFiscal
    ? FISCAL_PALETTE[theme === 'light' ? 'light' : 'dark']
    : isReal
      ? (theme === 'light' ? (REAL_PALETTES_LIGHT[layerId] || REAL_PALETTES[layerId]) : REAL_PALETTES[layerId])
      : (PALETTES[theme === 'light' ? 'light' : 'dark'][layerId] || PALETTES.dark.composite);

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
      })
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

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
    const id = setInterval(() => setPulsePhase((p) => (p + 1) % 60), 120);
    return () => clearInterval(id);
  }, []);

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
    if (!ready || !elRef.current) return undefined;
    const chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);

    chart.on('click', (params) => {
      if (params.name) {
        setSelectedProvince(params.name);
        setSidebarOpen(false);
      }
    });

    const onTheme = () => {
      applyChartTheme(getTheme());
      setThemeState(getTheme());
    };
    window.addEventListener(THEME_EVENT, onTheme);

    return () => {
      ro.disconnect();
      window.removeEventListener(THEME_EVENT, onTheme);
      chart.off('click');
      chart.dispose();
      chartRef.current = null;
    };
  }, [ready]);

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
    const areaIdle = isDark ? '#141c2b' : '#e8edf4';
    const labelColor = chartTextColor();
    const pulseScale = 2.2 + Math.sin(pulsePhase * 0.15) * 0.6;

    const seriesData = displayData.map((d) => {
      const isHot = hotCoords.some((h) => h.name === d.name);
      const isSelected = d.name === selectedProvince;
      return {
        ...d,
        itemStyle: isHot && isDark
          ? {
            borderColor: `${STEEL}${isSelected ? 'ff' : '88'}`,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: 'rgba(34,211,238,0.35)',
            shadowBlur: 6 + Math.sin(pulsePhase * 0.12) * 4,
          }
          : isSelected
            ? { borderColor: STEEL, borderWidth: 2 }
            : undefined,
      };
    });

    return {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 600,
      animationDurationUpdate: 800,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicInOut',
      tooltip: {
        trigger: 'item',
        ...CHART_TOOLTIP,
        formatter: (p) => {
          if (p.seriesType === 'lines') return '';
          if (p.seriesName === 'quakes') return formatQuakeTooltip(p);
          if (p.seriesName === 'flights') return formatFlightTooltip(p);
          if (isReal) return formatRealTooltip(p.name, layerId, weather.data?.[p.name], weather.fetchedAt);
          if (coloringFiscal) {
            const m = p.data?.metrics;
            return m
              ? `<b>${p.name}</b><br/>财政自给：${m.fiscal_self}%<br/>人口：${m.pop}万 · 变动 ${m.pop_change > 0 ? '+' : ''}${m.pop_change}万`
              : p.name;
          }
          if (deltaMode) {
            const v = p.data?.value;
            return v == null ? p.name : `<b>${p.name}</b><br/>${layer.label} Δ12月：${v > 0 ? '+' : ''}${v}`;
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
          inRange: { color: isDark ? ['#3b82f6', '#16203a', '#ef4444'] : ['#2563eb', '#eef1f6', '#dc2626'] },
          text: ['升温 Δ', '降温'],
          textStyle: { color: labelColor, fontSize: 10 },
          itemWidth: 12,
          itemHeight: isCompact ? 56 : 80,
          formatter: (v) => (v > 0 ? `+${Math.round(v)}` : Math.round(v)),
        }
        : {
          show: true,
          min: coloringFiscal ? 0 : layer.min,
          max: coloringFiscal ? 100 : layer.max,
          left: 8,
          bottom: isCompact ? 4 : 8,
          calculable: false,
          inRange: { color: palette },
          text: coloringFiscal ? ['高自给 %', '低'] : [`高${layer.unit ? ` (${layer.unit})` : ''}`, '低'],
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
        },
        ...(isDark && hotCoords.length && !isCompact && !coloringFiscal
          ? [{
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: hotCoords,
            symbolSize: (val) => 4 + (val[2] / 100) * 8,
            rippleEffect: { scale: pulseScale, brushType: 'stroke', period: 3.5 },
            itemStyle: { color: STEEL, shadowBlur: 8, shadowColor: 'rgba(34,211,238,0.5)' },
            zlevel: 2,
          }]
          : []),
        ...['flow-migration', 'scatter-capitals', 'overlay-quakes', 'overlay-flights']
          .filter((id) => isLayerVisible(id, layerPrefs))
          .flatMap((id) => buildOverlaySeries(id, {
            theme, isCompact, pulsePhase, STEEL, HOLD,
            quakesState, flightsState,
            buildQuakeSeries, quakeSymbolSize, quakeColor,
            buildFlightSeries,
          }) || []),
      ],
    };
  }, [theme, layer, mapData, displayData, deltaMode, isReal, coloringFiscal, weather.data, weather.fetchedAt, zoneId, layerId, palette, hotCoords, pulsePhase, region, selectedProvince, isCompact, layerPrefs, showLabels, quakesState, flightsState, buildQuakeSeries, quakeSymbolSize, quakeColor, buildFlightSeries]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;
    chart.setOption(buildOption(), { notMerge: false, lazyUpdate: false });
  }, [ready, buildOption]);

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
      xAxis: { type: 'value', name: xl.label, nameGap: 22, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, scale: true, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
      yAxis: { type: 'value', name: yl.label, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, scale: true, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
      series: [{
        type: 'scatter',
        data: pts,
        symbolSize: 9,
        itemStyle: { color: STEEL, opacity: 0.8 },
        label: { show: true, position: 'top', fontSize: 8.5, color: '#93a1b5', formatter: (p) => short(p.name) },
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
            <span className="lcm-breathe inline-flex items-center gap-1.5 text-[10px] mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(34,211,238,0.12)', color: STEEL, border: '1px solid rgba(34,211,238,0.25)' }}>
              <span className="lcm-live-dot" style={{ color: '#ef4444' }} />
              LIVE
            </span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{ALL_LAYERS.length} 层 · 其中 {REAL_LAYERS.length} 实测</span>
            {!isCompact && (
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} CST
              </span>
            )}
          </div>
          <p className="text-xs m-0 mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            {isCompact ? '省级动态预览 · 点击进入完整体验' : `实时动态中国 · Open-Meteo 实测气象/空气 + USGS 地震 + 种子态势层 · AS_OF ${AS_OF}`}
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
                  value={searchQ}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="定位省份…"
                  list="shenzhou-prov-list"
                  className="text-[10px] mono rounded"
                  style={{ width: 110, padding: '5px 8px 5px 24px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
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

      {!isCompact ? (
        <div className="live-china-map-meta flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-3 mb-1">
          <span className="text-[10px] mono min-w-0 inline-flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
            {coloringFiscal ? '财政自给率（网络）' : layer.desc} · 数据源：<span style={{ color: coloringFiscal || isReal ? '#10b981' : 'var(--text-secondary)' }}>{coloringFiscal ? (fiscalData?.source === 'live' ? 'province-stats 网络' : 'province-stats 本地') : (layer.source === 'seed' ? '内置种子' : 'Open-Meteo 实测')}</span>
            {geoSource && <span>· 边界 <span style={{ color: geoSource === 'network' ? '#10b981' : STEEL }}>{geoSource === 'network' ? 'DataV API' : geoSource === 'proxy' ? 'Worker' : '本地'}</span></span>}
            {showFiscal && fiscalLoading && <span style={{ color: STEEL }}>// 拉取财政层…</span>}
            {isReal && weather.loading && <span style={{ color: STEEL }}>// 正在获取实测…</span>}
            {isReal && weather.error && <span style={{ color: HOLD }}>实时源不可达：{weather.error} · 自动重试中</span>}
            {isReal && !weather.error && weather.fetchedAt && (
              <span className="inline-flex items-center gap-1" style={{ color: '#10b981' }}>
                <span className="lcm-live-dot" style={{ color: '#10b981' }} />
                实测 {weather.fetchedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} · 10min 自动刷新
              </span>
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

      {!isCompact && (
        <div className="live-china-map-controls space-y-3 mt-3">
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
          {!isReal && (
            <LiveMapTimeline
              monthIndex={monthIndex}
              onChange={(m) => { setMonthIndex(m); setTimelinePlaying(false); }}
              playing={timelinePlaying}
              onTogglePlay={() => setTimelinePlaying((p) => !p)}
              accent={STEEL}
            />
          )}
          {isReal && (
            <div className="text-[10px] mono px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              实况层为即时观测快照（无 12 月回放）· 悬停省份查看 气温/湿度/风速/降水/PM2.5 全要素 · 来源 Open-Meteo 公开气象 API，非官方气象部门发布口径
            </div>
          )}
        </div>
      )}

      <div className={`live-china-map-body ${!isCompact ? 'live-china-map-body--full' : ''} mt-4`}>
        {!isCompact && (
          <LiveMapLayerPanel
            prefs={layerPrefs}
            onToggle={handleLayerPrefToggle}
            geoSource={geoSource}
            activeMetricLabel={coloringFiscal ? '财政自给率' : layer.label}
            fiscalActive={coloringFiscal}
            fiscalMeta={fiscalData?.meta ? { year: fiscalData.meta.year, sourceNote: fiscalData.source } : null}
          />
        )}
        <div className={`live-china-map-canvas lcm-scan relative min-w-0 ${isCompact ? 'live-china-map-canvas--compact' : ''}`}>
          <div ref={elRef} style={{ width: '100%', height: '100%' }} />
          {!ready && !err && (
            <div className="mono text-xs absolute top-3 left-3 lcm-geo-loading" style={{ color: 'var(--text-tertiary)' }}>
              // 正在从网络加载省界边界…
            </div>
          )}
          {err && (
            <div className="mono text-xs absolute top-3 left-3" style={{ color: 'var(--text-tertiary)' }}>地图加载失败：{err}</div>
          )}
          {selectedProvince && !isCompact && (
            <ProvinceDetailDrawer
              key={selectedProvince}
              provinceName={selectedProvince}
              layerId={isReal ? 'climate' : layerId}
              compareNames={compareNames}
              onClose={() => setSelectedProvince(null)}
              onToggleCompare={toggleCompare}
              theme={theme}
            />
          )}
        </div>

        {!isCompact && (
          <aside className={`live-china-map-sidebar ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
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

      {compareNames.length > 0 && !isCompact && (
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
              legend: { data: [sa, sb], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10 },
              radar: {
                indicator: RADAR_DIMS.map((d) => ({ name: d.label, max: 100 })),
                radius: '64%',
                axisName: { color: '#93a1b5', fontSize: 10 },
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

      {!isCompact && (
        <div className="mt-5 p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
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
        <span className="mono">// 纵深模块</span>
        <Link to="/regional" className="mono hover:underline" style={{ color: STEEL }}>区域协调 →</Link>
        <Link to="/northeast" className="mono hover:underline" style={{ color: STEEL }}>东北振兴 →</Link>
        <Link to="/enterprise500" className="mono hover:underline" style={{ color: STEEL }}>民企500强地图 →</Link>
        {!isCompact && <Link to="/shenzhou-live" className="mono hover:underline" style={{ color: STEEL }}>神州活图全屏页 →</Link>}
      </div>
    </section>
  );
}
