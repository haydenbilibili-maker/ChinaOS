import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';
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
} from './liveMapData.js';
import EChart from '../../lib/viz/EChart.jsx';
import { getTimelineSeries, MONTH_COUNT, CURRENT_MONTH_INDEX } from './liveMapHistory.js';
import LiveMapLayerBar from './LiveMapLayerBar.jsx';
import LiveMapTimeline from './LiveMapTimeline.jsx';
import ProvinceDetailDrawer from './ProvinceDetailDrawer.jsx';

const registered = new Set(['_init']);
const STEEL = '#22d3ee';
const HOLD = '#e8a317';
const ROTATE_MS = 10000;
const JITTER_MS = 30000;
const TIMELINE_MS = 1200;

// 省际迁徙流（七普口径主通道 · 权重为示意标定，驱动弧线粗细）
const MIGRATION_FLOWS = [
  ['河南省', '广东省', 10], ['湖南省', '广东省', 9], ['广西壮族自治区', '广东省', 9],
  ['四川省', '广东省', 8], ['安徽省', '江苏省', 8], ['河南省', '浙江省', 8],
  ['黑龙江省', '广东省', 8], ['河北省', '北京市', 7], ['安徽省', '上海市', 6],
  ['江西省', '浙江省', 6], ['贵州省', '浙江省', 6], ['湖北省', '广东省', 6],
  ['辽宁省', '北京市', 5], ['吉林省', '广东省', 5], ['黑龙江省', '山东省', 5],
  ['甘肃省', '新疆维吾尔自治区', 4],
];

function loadChina() {
  if (registered.has('china')) return Promise.resolve('china');
  return DataBus.regionGeo('100000').then((geo) => {
    echarts.registerMap('china', geo);
    registered.add('china');
    return 'china';
  });
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
      <span style={{ color: 'var(--text-tertiary)' }}>均值 <b style={{ color: STEEL }}>{stats.avg}</b></span>
      <span style={{ color: 'var(--text-tertiary)' }}>最高 <b style={{ color: '#10b981' }}>{stats.max}</b>{!inline && <span className="hidden sm:inline"> ({stats.maxProv?.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')})</span>}</span>
      <span style={{ color: 'var(--text-tertiary)' }}>最低 <b style={{ color: '#64748b' }}>{stats.min}</b>{!inline && <span className="hidden sm:inline"> ({stats.minProv?.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')})</span>}</span>
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
  const [showFlows, setShowFlows] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const layer = getLayerById(layerId);
  const region = REGION_PRESETS.find((r) => r.id === regionId) || REGION_PRESETS[0];

  const mapData = useMemo(() => {
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
  }, [layerId, monthIndex, timelinePlaying, simLive, jitterSeed]);

  const rankings = useMemo(() => getRankings(layerId, 5, mapData), [layerId, mapData]);
  const stats = useMemo(() => getNationalStats(layerId, mapData), [layerId, mapData]);
  const palette = PALETTES[theme === 'light' ? 'light' : 'dark'][layerId] || PALETTES.dark.composite;

  const hotCoords = useMemo(() => {
    const threshold = rankings.hot[Math.min(2, rankings.hot.length - 1)]?.value ?? 80;
    return mapData
      .filter((d) => d.value >= threshold && PROVINCE_COORDS[d.name])
      .slice(0, 8)
      .map((d) => ({ name: d.name, value: [...PROVINCE_COORDS[d.name], d.value] }));
  }, [mapData, rankings]);

  useEffect(() => {
    let alive = true;
    loadChina().then(() => alive && setReady(true)).catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
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
        const idx = LAYERS.findIndex((l) => l.id === cur);
        return LAYERS[(idx + 1) % LAYERS.length].id;
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

    const seriesData = mapData.map((d) => {
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
          if (p.seriesType === 'effectScatter') return formatTooltip(p.name, layerId, mapData.find((x) => x.name === p.name)?.metrics);
          return formatTooltip(p.name, layerId, p.data?.metrics);
        },
      },
      visualMap: {
        show: true,
        min: layer.min,
        max: layer.max,
        left: 8,
        bottom: isCompact ? 4 : 8,
        calculable: false,
        inRange: { color: palette },
        text: [`高${layer.unit ? ` (${layer.unit})` : ''}`, '低'],
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
        label: { show: false },
      },
      series: [
        {
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data: seriesData,
          selectedMode: false,
        },
        ...(isDark && hotCoords.length && !isCompact
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
        ...(showFlows && !isCompact
          ? [{
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 3,
            silent: true,
            effect: { show: true, period: 5, trailLength: 0.45, symbol: 'arrow', symbolSize: 4.5, color: HOLD },
            lineStyle: { color: HOLD, opacity: 0.22, curveness: 0.32 },
            data: MIGRATION_FLOWS
              .filter(([f, t]) => PROVINCE_COORDS[f] && PROVINCE_COORDS[t])
              .map(([f, t, w]) => ({ coords: [PROVINCE_COORDS[f], PROVINCE_COORDS[t]], lineStyle: { width: 0.5 + w * 0.16 } })),
          }]
          : []),
      ],
    };
  }, [theme, layer, mapData, layerId, palette, hotCoords, pulsePhase, region, selectedProvince, isCompact, showFlows]);

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

  return (
    <section
      ref={shellRef}
      className={`os-card os-section live-china-map-shell p-4 md:p-5 lg:p-6 ${isFullscreen ? 'live-china-map-fullscreen' : ''} ${className || ''}`}
      style={{ borderColor: 'rgba(34,211,238,0.2)' }}
    >
      {/* Header: title left, controls right */}
      <div className="live-china-map-toolbar flex flex-wrap items-start justify-between gap-x-6 gap-y-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Icon name="Map" size={16} style={{ color: STEEL }} />
            <h2 className="os-card-title m-0">神州活图</h2>
            <span className="text-[10px] mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(34,211,238,0.12)', color: STEEL, border: '1px solid rgba(34,211,238,0.25)' }}>
              LIVE
            </span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{LAYERS.length} 层</span>
          </div>
          <p className="text-xs m-0 mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            {isCompact ? '省级动态预览 · 点击进入完整体验' : `实时动态中国 · 省级 choropleth · 时间轴 · 对比 · AS_OF ${AS_OF}`}
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
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[10px] mono whitespace-nowrap" style={{ color: showFlows ? HOLD : 'var(--text-tertiary)' }}>
                <input type="checkbox" checked={showFlows} onChange={(e) => setShowFlows(e.target.checked)} style={{ accentColor: HOLD }} />
                迁徙流
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

      <LiveMapLayerBar layers={LAYERS} activeId={layerId} onSelect={handleLayerChange} accent={STEEL} compact={isCompact} />

      {!isCompact ? (
        <div className="live-china-map-meta flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-3 mb-1">
          <span className="text-[10px] mono min-w-0" style={{ color: 'var(--text-tertiary)' }}>
            {layer.desc} · 数据源：<span style={{ color: 'var(--text-secondary)' }}>{layer.source === 'seed' ? '内置种子' : '实时'}</span>
          </span>
          <StatStrip stats={stats} layer={layer} simLive={simLive} inline />
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
                className="text-[10px] mono px-2 py-0.5 rounded-full touch-manipulation"
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
          <LiveMapTimeline
            monthIndex={monthIndex}
            onChange={(m) => { setMonthIndex(m); setTimelinePlaying(false); }}
            playing={timelinePlaying}
            onTogglePlay={() => setTimelinePlaying((p) => !p)}
            accent={STEEL}
          />
        </div>
      )}

      <div className={`live-china-map-body ${!isCompact ? 'live-china-map-body--full' : ''} mt-4`}>
        <div className={`live-china-map-canvas relative min-w-0 ${isCompact ? 'live-china-map-canvas--compact' : ''}`}>
          <div ref={elRef} style={{ width: '100%', height: '100%' }} />
          {!ready && !err && (
            <div className="mono text-xs absolute top-3 left-3" style={{ color: 'var(--text-tertiary)' }}>// 加载地图边界…</div>
          )}
          {err && (
            <div className="mono text-xs absolute top-3 left-3" style={{ color: 'var(--text-tertiary)' }}>地图加载失败：{err}</div>
          )}
          {selectedProvince && !isCompact && (
            <ProvinceDetailDrawer
              provinceName={selectedProvince}
              layerId={layerId}
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
              <RankList title={`${layer.label} · Top5`} items={rankings.hot} accent={STEEL} />
              <RankList title={`${layer.label} · Bottom5`} items={rankings.cold} accent="#64748b" />
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
