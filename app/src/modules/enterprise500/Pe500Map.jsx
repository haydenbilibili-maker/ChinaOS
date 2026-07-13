import { AXIS, LABEL } from '../shared/chartHelpers.js';
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';

const registered = new Set(['_init']);
const nameToProv = {};

function loadChina() {
  if (registered.has('china')) return Promise.resolve('china');
  return DataBus.regionGeo('100000').then((geo) => {
    echarts.registerMap('china', geo);
    registered.add('china');
    (geo.features || []).forEach((f) => {
      if (f.properties?.name) nameToProv[f.properties.name] = f.properties.name;
    });
    return 'china';
  });
}

export function provFromMapName(name) {
  return nameToProv[name] || name;
}

export default function Pe500Map({
  metrics = [],
  metricIdx = 0,
  selectedProv = '',
  hoverProv = '',
  onRegionClick,
  onRegionHover,
  style,
  className,
}) {
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  const metric = metrics[metricIdx] || metrics[0] || { data: [], max: 1, valueName: '数值' };

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
      if (p.name && onRegionClick) onRegionClick(p.name);
    });
    chart.on('mouseover', (p) => {
      if (p.name && onRegionHover) onRegionHover(p.name);
    });
    chart.on('globalout', () => {
      if (onRegionHover) onRegionHover('');
    });

    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, [ready, onRegionClick, onRegionHover]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;

    const data = (metric.data || []).map((d) => {
      const sel = selectedProv && d.name === selectedProv;
      const hov = hoverProv && d.name === hoverProv;
      return {
        ...d,
        itemStyle: sel
          ? { areaColor: '#fb923c', borderColor: '#fff', borderWidth: 1.5 }
          : hov
            ? { areaColor: '#22d3ee', borderColor: 'rgba(34,211,238,0.6)', borderWidth: 1 }
            : undefined,
      };
    });

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10,14,23,0.92)',
        borderColor: 'rgba(251,146,60,0.35)',
        textStyle: { color: '#e2e8f0', fontSize: 11 },
        formatter: (p) => {
          const extra = p.data?.extra;
          const top3 = extra?.topNames?.length
            ? extra.topNames.map((n, i) => `${i + 1}. ${n}`).join('<br/>')
            : '—';
          const rev = extra?.revenueYi != null ? `${extra.revenueYi.toLocaleString()} 亿元` : '—';
          const cnt = extra?.count ?? (p.value != null ? p.value : '—');
          return `<b>${p.name}</b><br/>企业数：${cnt}<br/>营收汇总：${rev}<br/><span style="color:#fb923c">Top3</span><br/>${top3}`;
        },
      },
      visualMap: {
        show: true,
        min: 0,
        max: metric.max || 1,
        left: 8,
        bottom: 8,
        calculable: true,
        inRange: { color: ['#141c2b', '#7c2d12', '#fb923c', '#fde68a'] },
        textStyle: { color: LABEL.color, fontSize: 10 },
        text: ['高', '低'],
      },
      series: [{
        type: 'map',
        map: 'china',
        roam: true,
        scaleLimit: { min: 0.8, max: 3 },
        nameProperty: 'name',
        itemStyle: { borderColor: 'rgba(148,163,184,0.25)', borderWidth: 0.5, areaColor: '#141c2b' },
        emphasis: { itemStyle: { areaColor: '#22d3ee' }, label: { show: true, color: '#0a0e17', fontSize: 10 } },
        label: { show: false },
        selectedMode: false,
        data,
      }],
    }, true);
  }, [ready, metric, metricIdx, selectedProv, hoverProv]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: 400, ...style }}>
      <div ref={elRef} style={{ width: '100%', height: '100%' }} />
      {!ready && !err && (
        <div className="mono text-xs" style={{ position: 'absolute', top: 8, left: 8, color: 'var(--text-tertiary)' }}>
          // 加载地图边界…
        </div>
      )}
      {err && (
        <div className="mono text-xs" style={{ position: 'absolute', top: 8, left: 8, color: 'var(--text-tertiary)' }}>
          地图加载失败：{err}
        </div>
      )}
    </div>
  );
}
