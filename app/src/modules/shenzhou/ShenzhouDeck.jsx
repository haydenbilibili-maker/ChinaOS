import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as echarts from 'echarts';
import {
  Activity, ArrowUpRight, CloudRain, CloudSun, Factory, Landmark, Layers, Leaf, LayoutGrid,
  Microscope, Palmtree, Pause, Plane, Play, ShieldAlert, Ship, Thermometer, TrendingUp, Users,
  Wind, X, Zap,
} from 'lucide-react';
import { getTheme, THEME_EVENT } from '../../lib/theme.js';
import Signal from '../../vi/Signal.jsx';
import { Spark } from '../../vi/Kpi.jsx';
import {
  AS_OF, LAYERS, REGION_PRESETS, PROVINCE_COORDS, RADAR_DIMS,
  getLayerById, getNationalStats, getRankings, getProvinceRadar, getProvinceModuleLink,
} from '../dashboard/liveMapData.js';
import {
  MONTH_LABELS, CURRENT_MONTH_INDEX, getTimelineSeries, getProvinceHistory, getNationalHistory,
} from '../dashboard/liveMapHistory.js';
import { loadChinaGeo, shortProvinceName } from '../dashboard/liveMapGeo.js';
import { useLiveWeather, REAL_LAYERS, buildRealSeries, formatLiveTime } from '../dashboard/liveWeather.js';
import { useLiveAirQuality, REAL_AQI_LAYERS, buildAqiSeries } from '../dashboard/liveAirQuality.js';
import { useLiveQuakes, buildQuakeSeries, quakeSymbolSize, quakeColor } from '../dashboard/liveQuakes.js';
import { useLiveFlights, buildFlightSeries } from '../dashboard/liveFlights.js';
import { useLiveShipping, buildPortSeries, buildVesselSeries, portSymbolSize } from '../dashboard/liveShipping.js';
import { buildOverlaySeries } from '../dashboard/liveMapLayers.js';
import './shenzhou.css';

// ============================================================================
// 神州活图 · 观测舱（VI 2.0 旗舰视图）
// ----------------------------------------------------------------------------
// 地图优先：全幅浮雕地图 + 琉璃 HUD（图层罗盘 / 读数 / 排行 / 省份卡 / 时间轴）。
// 数据口径：实测层（Open-Meteo）与示意指数层（种子序列）在界面上始终区分标注。
// ============================================================================

const LAYER_ICONS = {
  liveTemp: Thermometer, livePrecip: CloudRain, livePm25: Wind,
  composite: Layers, economy: TrendingUp, industry: Factory, innovation: Microscope,
  portflow: Ship, tourism: Palmtree, migration: Users, policy: Landmark,
  energy: Zap, carbon: Leaf, climate: CloudSun, risk: ShieldAlert,
};

const LAYER_GROUPS = [
  { id: 'live', label: '实测', ids: ['liveTemp', 'livePrecip', 'livePm25'] },
  { id: 'econ', label: '经济', ids: ['composite', 'economy', 'industry', 'innovation', 'portflow', 'tourism'] },
  { id: 'society', label: '社会', ids: ['migration', 'policy'] },
  { id: 'risk', label: '资源与风险', ids: ['energy', 'carbon', 'climate', 'risk'] },
];

const ALL = [...REAL_LAYERS, ...REAL_AQI_LAYERS, ...LAYERS];
const layerOf = (id) => ALL.find((l) => l.id === id) || getLayerById('composite');

/** VI 2.0 地图色带（§9）：指数 = 玄→铜→朱砂；气温 = 霁蓝↔朱砂；降水 = 玄→霁蓝；PM2.5 = 青瓷→朱砂 */
const RAMPS = {
  dark: {
    index: ['#191c24', '#3a3224', '#7a5c32', '#d4a25a', '#e5483b'],
    liveTemp: ['#3d5bd9', '#6e8cff', '#2a2d36', '#d4a25a', '#e5483b'],
    livePrecip: ['#191c24', '#25344f', '#3d5bd9', '#6e8cff', '#c2cdff'],
    livePm25: ['#6fc2ae', '#a8b77a', '#d4a25a', '#e07a3f', '#e5483b'],
  },
  light: {
    index: ['#efe9dc', '#e2cfa5', '#c79a52', '#b8652f', '#c8322a'],
    liveTemp: ['#3d5bd9', '#8fa5ff', '#efe9dc', '#d49a4a', '#c8322a'],
    livePrecip: ['#efe9dc', '#c7d2f5', '#8fa5ff', '#3d5bd9', '#22388f'],
    livePm25: ['#237561', '#8a8a3a', '#8a6224', '#b8552a', '#c8322a'],
  },
};

const THEME_COLORS = {
  dark: {
    sea: '#07080b', land: '#14171f', border: 'rgba(237,232,223,0.22)', plinth: '#050608',
    edge: '#3b2f1d', edgeLine: 'rgba(212,162,90,0.55)', glow: 'rgba(212,162,90,0.28)',
    brass: '#d4a25a', cinnabar: '#e5483b', ink: '#ede8df', ink3: '#8a847a', hover: 'rgba(110,140,255,0.55)',
  },
  light: {
    sea: '#e6e0d3', land: '#f7f3ea', border: 'rgba(22,19,15,0.25)', plinth: '#cdbf9f',
    edge: '#b89a64', edgeLine: 'rgba(138,98,36,0.6)', glow: 'rgba(90,64,24,0.28)',
    brass: '#8a6224', cinnabar: '#c8322a', ink: '#16130f', ink3: '#736c61', hover: 'rgba(61,91,217,0.45)',
  },
};

const fmt = (v, unit = '') => (v == null || Number.isNaN(Number(v)) ? '—' : `${Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}${unit}`);

function useThemeKey() {
  const [t, setT] = useState(() => (getTheme() === 'light' ? 'light' : 'dark'));
  useEffect(() => {
    const on = () => setT(getTheme() === 'light' ? 'light' : 'dark');
    window.addEventListener(THEME_EVENT, on);
    return () => window.removeEventListener(THEME_EVENT, on);
  }, []);
  return t;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function levelFor(layer, value) {
  if (value == null) return 'unknown';
  const lo = layer?.min ?? 0;
  const hi = layer?.max ?? 100;
  const r = (value - lo) / (hi - lo || 1);
  if (layer?.id === 'liveTemp' || layer?.id === 'livePrecip') return 'unknown';
  return r >= 0.75 ? 'alert' : r >= 0.5 ? 'watch' : 'ok';
}

/* ─────────────────────────────── HUD 部件 ─────────────────────────────── */

function LayerCompass({ layerId, onChange }) {
  return (
    <nav className="sz-compass" aria-label="图层">
      {LAYER_GROUPS.map((g) => (
        <div key={g.id} className="sz-compass__group">
          <span className="sz-compass__label">{g.label}</span>
          <div className="sz-compass__items">
            {g.ids.map((id) => {
              const l = layerOf(id);
              const Icon = LAYER_ICONS[id] || Layers;
              const active = id === layerId;
              return (
                <button
                  key={id}
                  type="button"
                  className={`sz-compass__item${active ? ' is-active' : ''}${l.live ? ' is-live' : ''}`}
                  onClick={() => onChange(id)}
                  aria-pressed={active}
                  title={l.desc}
                >
                  <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                  <span>{l.label.replace('空气 ', '')}</span>
                  {l.live && <span className="sz-compass__live" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Legend({ ramp, layer }) {
  return (
    <div className="sz-legend" aria-label="色带">
      <span className="sz-legend__end vi-figure">{fmt(layer.min)}</span>
      <span className="sz-legend__ramp" style={{ background: `linear-gradient(90deg, ${ramp.join(', ')})` }} />
      <span className="sz-legend__end vi-figure">{fmt(layer.max)}{layer.unit ? <span className="vi-unit">{layer.unit}</span> : null}</span>
    </div>
  );
}

function RankPanel({ rankings, layer, onPick }) {
  const max = Math.max(1, ...rankings.hot.map((d) => d.value ?? 0));
  const row = (d, i, tone) => (
    <li key={d.name}>
      <button type="button" className="sz-rank__row" onClick={() => onPick(d.name)}>
        <span className="sz-rank__no vi-figure">{i + 1}</span>
        <span className="sz-rank__name">{shortProvinceName(d.name)}</span>
        <span className="sz-rank__bar" aria-hidden="true">
          <span className={`sz-rank__fill sz-rank__fill--${tone}`} style={{ width: `${Math.max(6, ((d.value ?? 0) / max) * 100)}%` }} />
        </span>
        <span className="sz-rank__v vi-figure">{fmt(d.value)}</span>
      </button>
    </li>
  );
  return (
    <section className="sz-rank" aria-label="省份排行">
      <header className="sz-panel__head">
        <span className="sz-panel__title">排行</span>
        <span className="sz-panel__meta">{layer.valueName}</span>
      </header>
      <p className="sz-rank__caption">最高</p>
      <ol className="sz-rank__list">{rankings.hot.map((d, i) => row(d, i, 'hot'))}</ol>
      <p className="sz-rank__caption">最低</p>
      <ol className="sz-rank__list">{rankings.cold.map((d, i) => row(d, i, 'cold'))}</ol>
    </section>
  );
}

function ProvinceCard({ name, layer, series, isReal, monthIndex, onClose }) {
  const sorted = useMemo(() => series.slice().sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity)), [series]);
  const rank = sorted.findIndex((d) => d.name === name) + 1;
  const datum = series.find((d) => d.name === name);
  const history = !isReal ? getProvinceHistory(name, layer.id) : null;
  const radar = getProvinceRadar(name);
  const link = getProvinceModuleLink(name);
  const level = levelFor(layer, datum?.value);
  return (
    <section className="sz-province" aria-label={`${name} 详情`}>
      <header className="sz-province__head">
        <div>
          <span className="sz-panel__meta">{isReal ? '实测' : MONTH_LABELS[monthIndex]}</span>
          <h3 className="sz-province__name">{name}</h3>
        </div>
        <button type="button" className="sz-icon-btn" onClick={onClose} aria-label="关闭省份详情"><X size={16} /></button>
      </header>
      <div className="sz-province__figure">
        <span className="vi-figure sz-province__value">{fmt(datum?.value)}{layer.unit ? <span className="vi-unit">{layer.unit}</span> : null}</span>
        <div className="sz-province__meta">
          <Signal level={level} size="s" />
          <span>{layer.valueName}{rank > 0 ? ` · 第 ${rank} / ${series.length}` : ''}</span>
        </div>
      </div>
      {history && (
        <div className="sz-province__spark">
          <Spark data={history} level={level} height={52} />
          <div className="sz-province__axis"><span>{MONTH_LABELS[0]}</span><span>{MONTH_LABELS[MONTH_LABELS.length - 1]}</span></div>
        </div>
      )}
      {radar.length > 0 && (
        <div className="sz-province__dims">
          <span className="sz-rank__caption">六维画像 · 示意指数</span>
          {RADAR_DIMS.map((d, i) => (
            <div key={d.key} className="sz-dim">
              <span>{d.label}</span>
              <span className="sz-dim__bar"><span style={{ width: `${Math.min(100, radar[i])}%` }} /></span>
              <span className="vi-figure">{Math.round(radar[i])}</span>
            </div>
          ))}
        </div>
      )}
      <Link to={link.to} className="sz-province__link">
        {link.label}<ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </section>
  );
}

function Timeline({ monthIndex, onChange, playing, onToggle, national }) {
  return (
    <div className="sz-timeline" role="group" aria-label="时间轴">
      <button type="button" className="sz-play" onClick={onToggle} aria-label={playing ? '暂停' : '播放'}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="sz-timeline__track">
        <div className="sz-timeline__spark" aria-hidden="true">
          <Spark data={national} height={26} />
        </div>
        <input
          type="range"
          min={0}
          max={MONTH_LABELS.length - 1}
          step={1}
          value={monthIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sz-timeline__range"
          aria-valuetext={MONTH_LABELS[monthIndex]}
          style={{ '--p': `${(monthIndex / (MONTH_LABELS.length - 1)) * 100}%` }}
        />
        <div className="sz-timeline__ticks" aria-hidden="true">
          {MONTH_LABELS.map((m, i) => (
            <span key={m} className={i === monthIndex ? 'is-on' : ''}>{i % 3 === 0 || i === MONTH_LABELS.length - 1 ? m.slice(2).replace('-', '.') : ''}</span>
          ))}
        </div>
      </div>
      <span className="sz-timeline__now vi-figure">{MONTH_LABELS[monthIndex]}</span>
    </div>
  );
}

/* ─────────────────────────────── 主体 ─────────────────────────────── */

export default function ShenzhouDeck({ initialLayer, initialProvince, onStateChange, onOpenWorkbench }) {
  const theme = useThemeKey();
  const C = THEME_COLORS[theme];
  const now = useClock();
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [geoReady, setGeoReady] = useState(false);
  const [geoErr, setGeoErr] = useState('');
  const [layerId, setLayerId] = useState(() => (layerOf(initialLayer)?.id === initialLayer ? initialLayer : 'composite'));
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH_INDEX);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(initialProvince || null);
  const [regionId, setRegionId] = useState('national');
  const [overlays, setOverlays] = useState({ quakes: false, flights: false, shipping: false });
  const [box, setBox] = useState(null); // 地图可用区域（像素）：避开四周 HUD

  const layer = layerOf(layerId);
  const isReal = !!layer.live;
  const weather = useLiveWeather(600000, layerId === 'liveTemp' || layerId === 'livePrecip');
  const air = useLiveAirQuality(600000, layerId === 'livePm25');
  const quakesState = useLiveQuakes(900000, overlays.quakes);
  const flightsState = useLiveFlights(600000, overlays.flights);
  const shippingState = useLiveShipping(600000, overlays.shipping);

  const series = useMemo(() => {
    if (layerId === 'livePm25') return buildAqiSeries(air.data) || [];
    if (isReal) return buildRealSeries(layerId, weather.data) || [];
    return getTimelineSeries(layerId, monthIndex);
  }, [layerId, isReal, monthIndex, weather.data, air.data]);

  const valued = useMemo(() => series.filter((d) => d?.value != null), [series]);
  const stats = useMemo(() => (valued.length ? getNationalStats(layerId, valued) : null), [layerId, valued]);
  const rankings = useMemo(() => (valued.length ? getRankings(layerId, 5, valued) : { hot: [], cold: [] }), [layerId, valued]);
  const national = useMemo(() => (isReal ? [] : getNationalHistory(layerId)), [layerId, isReal]);
  const ramp = (RAMPS[theme][layerId] || RAMPS[theme].index);
  const liveState = layerId === 'livePm25' ? air : weather;
  const region = REGION_PRESETS.find((r) => r.id === regionId) || REGION_PRESETS[0];

  // 状态外传（深链）：回调放进 ref，只在图层 / 省份真正变化时写 URL，
  // 避免路由回调身份变化引发的循环
  const stateCbRef = useRef(onStateChange);
  stateCbRef.current = onStateChange;
  useEffect(() => {
    stateCbRef.current?.({ layer: layerId === 'composite' ? '' : layerId, province: selected || '' });
  }, [layerId, selected]);

  // 播放：每 1.2s 前进一月，循环
  useEffect(() => {
    if (!playing || isReal) return undefined;
    const id = setInterval(() => setMonthIndex((m) => (m + 1) % MONTH_LABELS.length), 1200);
    return () => clearInterval(id);
  }, [playing, isReal]);

  // 键盘：Esc 取消选中；←/→ 切换月份
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName) && e.target.type !== 'range') return;
      if (e.key === 'Escape') setSelected(null);
      if (!isReal && e.key === 'ArrowRight') setMonthIndex((m) => Math.min(MONTH_LABELS.length - 1, m + 1));
      if (!isReal && e.key === 'ArrowLeft') setMonthIndex((m) => Math.max(0, m - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReal]);

  // 地理边界
  useEffect(() => {
    let alive = true;
    loadChinaGeo('100000').then(() => alive && setGeoReady(true)).catch((e) => alive && setGeoErr(String(e?.message || e)));
    return () => { alive = false; };
  }, []);

  // 初始化 echarts 实例
  useEffect(() => {
    if (!geoReady || !elRef.current) return undefined;
    const chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const measure = () => {
      const el = elRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const deck = el.closest('.sz-deck');
      const cs = deck ? getComputedStyle(deck) : null;
      const px = (name, fb) => {
        const v = parseFloat(cs?.getPropertyValue(name));
        return Number.isFinite(v) ? v : fb;
      };
      const overlay = window.matchMedia('(min-width: 1024px)').matches;
      const g = px('--sz-gutter', 24);
      const left = overlay ? px('--sz-left-w', 228) + g * 2 : 8;
      const right = overlay ? px('--sz-right-w', 300) + g * 2 : 8;
      const top = overlay ? g : 8;
      const bottom = overlay ? px('--sz-bottom-h', 132) + g : 8;
      setBox({ w, h, left, right, top, bottom });
    };
    measure();
    const ro = new ResizeObserver(() => { chart.resize(); measure(); });
    ro.observe(elRef.current);
    const onClick = (p) => {
      const name = p?.name;
      if (name && PROVINCE_COORDS[name]) setSelected((cur) => (cur === name ? null : name));
    };
    chart.on('click', onClick);
    return () => {
      ro.disconnect();
      chart.off('click', onClick);
      chart.dispose();
      chartRef.current = null;
    };
  }, [geoReady]);

  const option = useMemo(() => {
    if (!geoReady) return null;
    const focus = selected && PROVINCE_COORDS[selected] ? { center: PROVINCE_COORDS[selected], zoom: Math.max(region.zoom, 2.4) } : { center: region.center, zoom: region.zoom };
    // 中国版图（含南海诸岛框）宽高比约 1.3：在避开 HUD 的可用区内尽量放大并居中
    const availW = box ? Math.max(120, box.w - box.left - box.right) : 0;
    const availH = box ? Math.max(120, box.h - box.top - box.bottom) : 0;
    const size = box ? Math.round(Math.min(availW, availH * 1.3) * 0.98) : '92%';
    const cx = box ? box.left + availW / 2 : '50%';
    const cy = box ? box.top + availH / 2 : '50%';
    const depth = box ? Math.max(5, Math.round((typeof size === 'number' ? size : 600) * 0.012)) : 8;
    const at = (dy) => (box ? [cx, cy + dy] : ['50%', '50%']);
    const layout = { layoutCenter: at(0), layoutSize: size };
    const base = { map: 'china', roam: false, silent: true, aspectScale: 0.78, ...focus, animationDurationUpdate: 900, animationEasingUpdate: 'cubicInOut' };
    const top3 = rankings.hot.slice(0, 3).filter((d) => PROVINCE_COORDS[d.name]);
    const labelNames = new Set([...rankings.hot.slice(0, 5).map((d) => d.name), selected].filter(Boolean));

    const overlaySeries = [
      overlays.quakes && 'overlay-quakes',
      overlays.flights && 'overlay-flights',
      overlays.shipping && 'overlay-shipping',
    ].filter(Boolean).flatMap((id) => (buildOverlaySeries(id, {
      theme, isCompact: false, STEEL: theme === 'light' ? '#3d5bd9' : '#6e8cff', HOLD: C.brass,
      quakesState, flightsState, shippingState,
      buildQuakeSeries, quakeSymbolSize, quakeColor, buildFlightSeries,
      buildPortSeries, buildVesselSeries, portSymbolSize,
    }) || [])).map((s) => ({ ...s, geoIndex: 2 }));

    return {
      backgroundColor: 'transparent',
      animationDuration: 900,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'item',
        className: 'sz-tooltip',
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        extraCssText: 'box-shadow:none;',
        formatter: (p) => {
          if (p.seriesType !== 'map') return p.name || '';
          const v = p.value;
          return `<div class="sz-tip"><span class="sz-tip__name">${p.name}</span><span class="sz-tip__v">${fmt(v)}<em>${layer.unit || ''}</em></span><span class="sz-tip__k">${layer.valueName}${isReal ? ' · 实测' : ` · ${MONTH_LABELS[monthIndex]} · 示意`}</span></div>`;
        },
      },
      visualMap: {
        show: false,
        seriesIndex: 0,
        min: layer.min ?? 0,
        max: layer.max ?? 100,
        inRange: { color: ramp },
      },
      geo: [
        // 0 · 底座：远投影，制造悬浮感
        { ...base, ...layout, layoutCenter: at(depth * 2), z: 0,
          itemStyle: { areaColor: C.plinth, borderColor: C.plinth, borderWidth: 1, shadowColor: C.glow, shadowBlur: 60, shadowOffsetY: 26 } },
        // 1 · 侧壁：铜色厚度
        { ...base, ...layout, layoutCenter: at(depth), z: 1,
          itemStyle: { areaColor: C.edge, borderColor: C.edgeLine, borderWidth: 0.8 } },
        // 2 · 顶面：数据着色
        { ...base, ...layout, silent: false, z: 2,
          itemStyle: { areaColor: C.land, borderColor: C.border, borderWidth: 0.7 },
          emphasis: { itemStyle: { areaColor: C.hover, borderColor: C.ink, borderWidth: 1.2 }, label: { show: false } },
          select: { disabled: true },
          regions: selected ? [{ name: selected, itemStyle: { borderColor: C.cinnabar, borderWidth: 2, shadowColor: C.cinnabar, shadowBlur: 16 } }] : [] },
      ],
      series: [
        {
          type: 'map',
          map: 'china',
          geoIndex: 2,
          data: series.map((d) => ({ name: d.name, value: d.value })),
          animationDurationUpdate: 600,
        },
        {
          name: 'pulse',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          geoIndex: 2,
          zlevel: 2,
          rippleEffect: { brushType: 'stroke', scale: 4.2, period: 3.2 },
          symbolSize: (v) => 7 + Math.min(6, (v[2] ?? 0) / 20),
          itemStyle: { color: C.brass, shadowBlur: 12, shadowColor: C.brass },
          data: top3.map((d) => ({ name: d.name, value: [...PROVINCE_COORDS[d.name], d.value] })),
          silent: true,
        },
        ...(selected && PROVINCE_COORDS[selected] ? [{
          name: 'selected',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          geoIndex: 2,
          zlevel: 3,
          rippleEffect: { brushType: 'stroke', scale: 5.5, period: 2.4 },
          symbolSize: 11,
          itemStyle: { color: C.cinnabar, shadowBlur: 16, shadowColor: C.cinnabar },
          data: [{ name: selected, value: [...PROVINCE_COORDS[selected], 1] }],
          silent: true,
        }] : []),
        {
          name: 'labels',
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 2,
          zlevel: 4,
          symbolSize: 0,
          silent: true,
          data: [...labelNames].filter((n) => PROVINCE_COORDS[n]).map((n) => ({ name: n, value: [...PROVINCE_COORDS[n], 0] })),
          label: {
            show: true,
            position: 'right',
            distance: 10,
            formatter: (p) => shortProvinceName(p.name),
            color: C.ink,
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: 'Inter, "Noto Sans SC", sans-serif',
            textBorderColor: theme === 'light' ? 'rgba(247,243,234,0.9)' : 'rgba(7,8,11,0.85)',
            textBorderWidth: 3,
          },
        },
        ...overlaySeries,
      ],
    };
  }, [geoReady, box, selected, region, rankings, overlays, theme, C, quakesState, flightsState, shippingState, layer, isReal, monthIndex, ramp, series]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !option) return;
    chart.setOption(option, { replaceMerge: ['series', 'geo'] });
  }, [option]);

  const pickLayer = useCallback((id) => {
    setLayerId(id);
    setPlaying(false);
    setMonthIndex(CURRENT_MONTH_INDEX);
  }, []);

  const clock = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' });
  const provenance = isReal
    ? { level: liveState.error ? 'alert' : liveState.loading ? 'unknown' : 'ok', text: liveState.error ? '实测源暂不可用' : liveState.fetchedAt ? `实测 · Open-Meteo · ${formatLiveTime(liveState.fetchedAt)}` : '实测 · 连接中…' }
    : { level: 'watch', text: '示意指数 · 种子序列 · 非官方统计' };
  const toggleOverlay = (k) => setOverlays((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className={`sz-deck sz-deck--${theme}`}>
      <div className="sz-stage">
        <div className="sz-stage__sea" aria-hidden="true" />
        {geoErr ? (
          <div className="sz-stage__error" role="alert">地图边界加载失败：{geoErr}</div>
        ) : (
          <div ref={elRef} className="sz-map" role="img" aria-label={`中国省级地图 · ${layer.label}`} />
        )}
        {!geoReady && !geoErr && <div className="sz-stage__loading" role="status">正在校准浑仪…</div>}

        {/* 标题与读数 */}
        <header className="sz-title">
          <div className="sz-title__eyebrow">
            <span className="sz-title__dot" aria-hidden="true" />
            <span>观测舱</span>
            <span className="vi-figure sz-title__clock">北京 {clock}</span>
          </div>
          <h1 className="sz-title__layer">{layer.label}</h1>
          <p className="sz-title__desc">{layer.desc}</p>
          {stats ? (
            <dl className="sz-readout">
              <div><dt>均值</dt><dd className="vi-figure">{fmt(stats.avg)}</dd></div>
              <div><dt>最高</dt><dd><span className="vi-figure">{fmt(stats.max)}</span><span className="sz-readout__p">{shortProvinceName(stats.maxProv || '')}</span></dd></div>
              <div><dt>最低</dt><dd><span className="vi-figure">{fmt(stats.min)}</span><span className="sz-readout__p">{shortProvinceName(stats.minProv || '')}</span></dd></div>
            </dl>
          ) : (
            <p className="sz-title__empty">{isReal ? '等待实测数据…' : '暂无数据'}</p>
          )}
          <div className="sz-provenance"><Signal level={provenance.level} size="s" showLabel={false} /><span>{provenance.text}</span></div>
        </header>

        {/* 图层罗盘 */}
        <aside className="sz-left">
          <LayerCompass layerId={layerId} onChange={pickLayer} />
        </aside>

        {/* 右侧：省份卡 / 排行 */}
        <aside className="sz-right">
          {selected ? (
            <ProvinceCard name={selected} layer={layer} series={valued} isReal={isReal} monthIndex={monthIndex} onClose={() => setSelected(null)} />
          ) : (
            rankings.hot.length > 0 && <RankPanel rankings={rankings} layer={layer} onPick={setSelected} />
          )}
        </aside>

        {/* 底部：时间轴 + 色带 + 叠加 + 区域 */}
        <footer className="sz-bottom">
          <div className="sz-bottom__main">
            {!isReal && (
              <Timeline monthIndex={monthIndex} onChange={(i) => { setPlaying(false); setMonthIndex(i); }} playing={playing} onToggle={() => setPlaying((p) => !p)} national={national} />
            )}
            <Legend ramp={ramp} layer={layer} />
          </div>
          <div className="sz-bottom__tools">
            <div className="sz-chips" role="group" aria-label="区域">
              {REGION_PRESETS.map((r) => (
                <button key={r.id} type="button" className={`sz-chip${r.id === regionId && !selected ? ' is-on' : ''}`} onClick={() => { setSelected(null); setRegionId(r.id); }}>{r.label}</button>
              ))}
            </div>
            <div className="sz-chips" role="group" aria-label="实时叠加">
              <button type="button" className={`sz-chip${overlays.quakes ? ' is-on' : ''}`} onClick={() => toggleOverlay('quakes')} aria-pressed={overlays.quakes}><Activity size={13} />地震</button>
              <button type="button" className={`sz-chip${overlays.flights ? ' is-on' : ''}`} onClick={() => toggleOverlay('flights')} aria-pressed={overlays.flights}><Plane size={13} />航班</button>
              <button type="button" className={`sz-chip${overlays.shipping ? ' is-on' : ''}`} onClick={() => toggleOverlay('shipping')} aria-pressed={overlays.shipping}><Ship size={13} />航运</button>
              {onOpenWorkbench && (
                <button type="button" className="sz-chip sz-chip--ghost" onClick={() => onOpenWorkbench({ layer: layerId, province: selected })}><LayoutGrid size={13} />研判工作台</button>
              )}
            </div>
          </div>
        </footer>
      </div>
      <p className="sz-footnote">
        边界：本地省界 GeoJSON · 示意指数层由公报量级种子生成，用于结构比较而非精确统计 · 实测层来自 Open-Meteo 公开接口 · 基准日 {AS_OF}
      </p>
    </div>
  );
}
