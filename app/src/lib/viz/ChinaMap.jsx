import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';
import DataBus from '../data/DataBus.js';

// ============================================================================
// 可视化引擎 · 中国地图（省级 choropleth · 支持下钻与多指标）
// ----------------------------------------------------------------------------
// 能力：
//   1) 省级下钻：点击省份 → 经 DataBus 拉取该省市级边界 → 渲染，可返回全国。
//   2) 多指标切换：传入 metrics 数组，内置切换按钮。
//   3) 地理数据统一经 DataBus 拉取并缓存（与 china.html 同源 DataV）。
// 用法（单指标）：<ChinaMap metrics={[{key:'a',label:'城镇化率',valueName:'城镇化率(%)',max:90,data:[{name:'广东省',value:75}]}]} />
// name 用 DataV 全称（如「广东省」「北京市」）。下钻市级数据缺省时由省值派生示意值。
// ============================================================================

const registered = new Set(['_init']);
const nameToAdcode = {}; // 省/市名 → adcode，用于下钻

function loadRegion(adcode) {
  const mapName = adcode === '100000' ? 'china' : `r_${adcode}`;
  if (registered.has(mapName)) return Promise.resolve(mapName);
  return DataBus.regionGeo(adcode).then((geo) => {
    echarts.registerMap(mapName, geo);
    registered.add(mapName);
    (geo.features || []).forEach((f) => {
      if (f.properties && f.properties.name) nameToAdcode[f.properties.name] = String(f.properties.adcode);
    });
    return mapName;
  });
}

// 下钻市级缺省数据：由省值派生确定性示意值（无随机，按序号微调）
function deriveCityData(mapName, baseValue) {
  const geo = echarts.getMap(mapName);
  const feats = geo && geo.geoJSON && geo.geoJSON.features ? geo.geoJSON.features : [];
  return feats.map((f, i) => ({
    name: f.properties.name,
    value: Math.round((baseValue || 50) * (0.78 + 0.04 * (i % 8))),
  }));
}

export default function ChinaMap({ metrics = [], style, className, enableDrill = true }) {
  const wrapRef = useRef(null);
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);
  const [mIdx, setMIdx] = useState(0);
  const [view, setView] = useState({ mapName: 'china', name: '全国' });

  const metric = metrics[mIdx] || { valueName: '数值', max: 100, data: [] };

  // 1) 注册全国地图
  useEffect(() => {
    let alive = true;
    loadRegion('100000').then(() => alive && setReady(true)).catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, []);

  // 2) ready 后初始化图表 + 绑定下钻点击
  useEffect(() => {
    if (!ready || !elRef.current) return;
    const chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);
    chart.on('click', (p) => {
      if (!enableDrill) return;
      // 仅在全国视图点省份时下钻
      if (chartRef.current.__view !== 'china') return;
      const adcode = nameToAdcode[p.name];
      if (!adcode || adcode === '100000') return;
      loadRegion(adcode)
        .then((mapName) => {
          const base = (metricRef.current.data.find((d) => d.name === p.name) || {}).value;
          chartRef.current.__cityData = deriveCityData(mapName, base);
          setView({ mapName, name: p.name });
        })
        .catch((e) => setErr(String(e)));
    });
    return () => { ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, [ready, enableDrill]);

  // 让点击回调读到最新 metric / view
  const metricRef = useRef(metric);
  metricRef.current = metric;
  useEffect(() => { if (chartRef.current) chartRef.current.__view = view.mapName === 'china' ? 'china' : 'region'; }, [view]);

  // 3) 渲染 option（指标/视图变化时）
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;
    const isChina = view.mapName === 'china';
    const data = isChina ? metric.data : (chart.__cityData || []);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p) => `${p.name}<br/>${metric.valueName}: ${p.value != null && !Number.isNaN(p.value) ? p.value : '—'}`,
      },
      visualMap: {
        min: 0, max: metric.max, left: 8, bottom: 8, calculable: true,
        inRange: { color: ['#1a2333', '#8b0000', '#c41e3a', '#e8a317'] },
        textStyle: { color: '#93a1b5' },
      },
      series: [{
        type: 'map', map: view.mapName, roam: false, nameProperty: 'name',
        itemStyle: { borderColor: 'rgba(148,163,184,0.25)', borderWidth: 0.5, areaColor: '#141c2b' },
        emphasis: { itemStyle: { areaColor: '#22d3ee' }, label: { color: '#0a0e17' } },
        label: { show: false },
        data,
      }],
    }, true);
  }, [ready, mIdx, view, metric.max, metric.valueName]);

  const back = useCallback(() => setView({ mapName: 'china', name: '全国' }), []);

  // 暴露给自动化测试的下钻钩子（无害）
  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.__chinaMap = {
        drill: (adcode, base = 50) => loadRegion(adcode).then((mn) => {
          chartRef.current.__cityData = deriveCityData(mn, base);
          setView({ mapName: mn, name: adcode });
        }),
        back,
      };
    }
  });

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', width: '100%', height: 440, ...style }}>
      <div className="flex items-center justify-between mb-2" style={{ minHeight: 28 }}>
        <div className="flex items-center gap-2 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <button onClick={back} disabled={view.mapName === 'china'} style={{ color: view.mapName === 'china' ? 'var(--text-tertiary)' : 'var(--cyber-cyan)', cursor: view.mapName === 'china' ? 'default' : 'pointer', background: 'none', border: 'none', padding: 0 }}>全国</button>
          {view.mapName !== 'china' && <span style={{ color: 'var(--text-secondary)' }}>› {view.name} · 点「全国」返回</span>}
          {view.mapName === 'china' && enableDrill && <span>· 点击省份下钻</span>}
        </div>
        {metrics.length > 1 && (
          <div className="flex gap-1">
            {metrics.map((mm, i) => (
              <button key={mm.key} onClick={() => setMIdx(i)}
                className="text-xs px-2 py-0.5 rounded mono"
                style={{ background: i === mIdx ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: i === mIdx ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                {mm.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={elRef} style={{ width: '100%', height: 'calc(100% - 36px)' }} />
      {!ready && !err && <div className="mono text-xs" style={{ position: 'absolute', top: 40, left: 8, color: 'var(--text-tertiary)' }}>// 加载地图边界…</div>}
      {err && <div className="mono text-xs" style={{ position: 'absolute', top: 40, left: 8, color: 'var(--text-tertiary)' }}>地图加载失败：{err}</div>}
    </div>
  );
}
