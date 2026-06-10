import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import DataBus from '../data/DataBus.js';

// ============================================================================
// 可视化引擎 · 中国地图（省级 choropleth）
// ----------------------------------------------------------------------------
// 全项目复用的地图组件：传入 data（[{name, value}]，name 用 datav 全称如「黑龙江省」）
// 自动拉取并注册省级边界、按值着色、暗色科技主题、resize/dispose。
// 地理边界源：阿里 DataV（与 china.html 同源），首次拉取后缓存、全局只注册一次。
// 用法：<ChinaMap data={[{name:'河南省', value:6600}]} valueName="粮食产量(万吨)" max={8000} />
// ============================================================================

const GEO_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
let registerPromise = null;

function ensureChinaMap() {
  if (!registerPromise) {
    registerPromise = DataBus.getJSON(GEO_URL, { ttlMs: 24 * 60 * 60 * 1000 }).then((geo) => {
      echarts.registerMap('china', geo);
      return true;
    });
  }
  return registerPromise;
}

export default function ChinaMap({ data = [], valueName = '数值', max = 100, style, className }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  // 1) 注册地图（全局一次），完成后翻转 ready
  useEffect(() => {
    let alive = true;
    ensureChinaMap()
      .then(() => alive && setReady(true))
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  // 2) ready 后同步初始化图表（ref 一定已挂载，规避异步 init 的时序问题）
  useEffect(() => {
    if (!ready || !ref.current) return;
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [ready]);

  // 3) 数据/配置变化时 setOption
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p) => `${p.name}<br/>${valueName}: ${p.value != null && !Number.isNaN(p.value) ? p.value : '—'}`,
      },
      visualMap: {
        min: 0, max, left: 8, bottom: 8, calculable: true,
        inRange: { color: ['#1a2333', '#8b0000', '#c41e3a', '#e8a317'] },
        textStyle: { color: '#93a1b5' },
      },
      series: [{
        type: 'map', map: 'china', roam: false, nameProperty: 'name',
        itemStyle: { borderColor: 'rgba(148,163,184,0.25)', borderWidth: 0.5, areaColor: '#141c2b' },
        emphasis: { itemStyle: { areaColor: '#22d3ee' }, label: { color: '#0a0e17' } },
        label: { show: false },
        data,
      }],
    }, true);
  }, [data, valueName, max, ready]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: 420, ...style }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {!ready && !err && (
        <div className="mono text-xs" style={{ position: 'absolute', top: 8, left: 8, color: 'var(--text-tertiary)' }}>// 加载地图边界…</div>
      )}
      {err && (
        <div className="mono text-xs" style={{ position: 'absolute', top: 8, left: 8, color: 'var(--text-tertiary)' }}>地图加载失败：{err}</div>
      )}
    </div>
  );
}
