import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';
import { THEATERS, PROVINCE_THEATER, MILITARY_BASES, BASE_TYPE_COLORS } from '../../lib/db/militaryIntel2026.js';

const registered = new Set(['_init']);
const THEATER_COLORS = Object.fromEntries(THEATERS.map((t) => [t.id, t.color]));

function loadChina() {
  if (registered.has('china')) return Promise.resolve('china');
  return DataBus.regionGeo('100000').then((geo) => {
    echarts.registerMap('china', geo);
    registered.add('china');
    return 'china';
  });
}

export default function MilitaryMap({
  mode = 'theater',
  selectedTheater = '',
  selectedBase = '',
  onTheaterClick,
  onBaseClick,
  style,
  className,
}) {
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    loadChina().then(() => alive && setReady(true)).catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!ready || !elRef.current) return;
    const chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);

    chart.on('click', (p) => {
      if (p.seriesType === 'scatter' && p.data?.id && onBaseClick) onBaseClick(p.data.id);
      else if (p.name && mode === 'theater' && onTheaterClick) {
        const tid = PROVINCE_THEATER[p.name];
        if (tid) onTheaterClick(tid);
      }
    });

    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, [ready, mode, onTheaterClick, onBaseClick]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;

    if (mode === 'theater') {
      const mapData = Object.entries(PROVINCE_THEATER).map(([name, tid]) => ({
        name,
        value: 1,
        itemStyle: {
          areaColor: selectedTheater && selectedTheater !== tid
            ? `${THEATER_COLORS[tid]}33`
            : `${THEATER_COLORS[tid]}88`,
          borderColor: selectedTheater === tid ? '#fff' : 'rgba(148,163,184,0.25)',
          borderWidth: selectedTheater === tid ? 1.5 : 0.5,
        },
      }));

      const hqScatter = THEATERS.map((t) => ({
        name: t.hq,
        value: [...t.hqCoord, t.name],
        symbol: 'pin',
        symbolSize: selectedTheater === t.id ? 36 : 28,
        itemStyle: { color: t.color, borderColor: '#fff', borderWidth: 1 },
        label: {
          show: true,
          formatter: t.name.replace('战区', ''),
          position: 'right',
          color: '#e2e8f0',
          fontSize: 10,
        },
      }));

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(10,14,23,0.92)',
          borderColor: 'rgba(196,30,58,0.35)',
          textStyle: { color: '#e2e8f0', fontSize: 11 },
          formatter: (p) => {
            if (p.seriesType === 'scatter') return `<b>${p.data.value[2]}</b><br/>机关驻地：${p.name}`;
            const tid = PROVINCE_THEATER[p.name];
            const th = THEATERS.find((x) => x.id === tid);
            return th
              ? `<b>${p.name}</b><br/>${th.name}<br/><span style="color:${th.color}">${th.focus}</span>`
              : p.name;
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 0.85, max: 4 },
          itemStyle: { areaColor: 'rgba(30,41,59,0.6)', borderColor: 'rgba(148,163,184,0.2)' },
          emphasis: { itemStyle: { areaColor: 'rgba(196,30,58,0.35)' }, label: { show: false } },
        },
        series: [
          { type: 'map', map: 'china', geoIndex: 0, data: mapData, selectedMode: false },
          { type: 'scatter', coordinateSystem: 'geo', data: hqScatter, zlevel: 2 },
        ],
      }, true);
    } else {
      const scatter = MILITARY_BASES.map((b) => ({
        id: b.id,
        name: b.name,
        value: [...b.coord, b.type],
        symbolSize: selectedBase === b.id ? 14 : 9,
        itemStyle: {
          color: BASE_TYPE_COLORS[b.type] || '#64748b',
          borderColor: selectedBase === b.id ? '#fff' : 'transparent',
          borderWidth: selectedBase === b.id ? 2 : 0,
        },
      }));

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(10,14,23,0.92)',
          borderColor: 'rgba(34,211,238,0.35)',
          textStyle: { color: '#e2e8f0', fontSize: 11 },
          formatter: (p) => {
            const b = MILITARY_BASES.find((x) => x.id === p.data?.id);
            if (!b) return p.name;
            return `<b>${b.name}</b><br/>类型：${b.type} · ${b.branch}<br/>${b.note}<br/><span style="color:#64748b;font-size:10px">${b.source}</span>`;
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 0.6, max: 5 },
          center: mode === 'bases-global' ? [105, 28] : undefined,
          zoom: mode === 'bases-global' ? 1.1 : 1.2,
          itemStyle: { areaColor: 'rgba(30,41,59,0.55)', borderColor: 'rgba(148,163,184,0.2)' },
          emphasis: { itemStyle: { areaColor: 'rgba(34,211,238,0.2)' }, label: { show: false } },
        },
        series: [{ type: 'scatter', coordinateSystem: 'geo', data: scatter, zlevel: 2 }],
      }, true);
    }
  }, [ready, mode, selectedTheater, selectedBase]);

  if (err) {
    return (
      <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
        地图加载失败：{err}
      </div>
    );
  }

  return (
    <div ref={elRef} className={className} style={{ width: '100%', minHeight: 360, ...style }} />
  );
}

export function BaseTypeLegend() {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(BASE_TYPE_COLORS).map(([k, c]) => (
        <span key={k} className="text-[10px] mono px-2 py-0.5 rounded flex items-center gap-1" style={{ background: `${c}18`, color: c }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
          {k}
        </span>
      ))}
    </div>
  );
}

export function TheaterLegend({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {THEATERS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect?.(selected === t.id ? '' : t.id)}
          className="text-[10px] mono px-2 py-1 rounded"
          style={{
            background: selected === t.id ? `${t.color}33` : 'var(--bg-elevated)',
            color: selected === t.id ? '#fff' : t.color,
            border: `1px solid ${selected === t.id ? t.color : 'var(--border-subtle)'}`,
            cursor: 'pointer',
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
