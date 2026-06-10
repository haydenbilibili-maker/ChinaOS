import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 耗散结构与熵（Dissipative Structure · Prigogine）
// ----------------------------------------------------------------------------
// 孤立系统熵增→无序（热二定律）；开放系统靠「负熵流」在远离平衡态自组织出有序。
// 交互：拖动负熵流输入强度 → 看系统有序度曲线随时间维持 / 崩溃，及临界相变。
// ============================================================================

const REGIMES = [
  ['封闭 · 熵增崩溃', '关起门来无物质/能量/信息交换，熵单调上升，结构走向死寂（孤立系统的宿命）。'],
  ['临界 · 涨落放大', '负熵流逼近临界点，微小涨落被放大，系统在有序与无序间剧烈摇摆（相变窗口）。'],
  ['远离平衡 · 自组织', '持续充足的负熵流支撑系统跨过临界点，自发涌现稳定有序结构（耗散结构）。'],
];

const MAP = [
  ['治理即持续对抗熵增', '官僚僵化、信息失真、利益固化都是熵增；治理现代化本质是不断做功「熵减」，与「治国沙盒·熵增监控」直接同构。'],
  ['改革开放 = 引入外部负熵流', '打开国门换入资本/技术/制度/信息——为系统注入负熵流，把濒临平衡死寂的结构推向远离平衡的自组织。'],
  ['临界点与涨落', '重大改革多发生在危机临界点：旧序参量失效、涨落被放大，一个局部试点（涨落）可能被放大为全局新秩序。'],
];

export default function Page() {
  const [flux, setFlux] = useState(45); // 负熵流输入强度 0–100，临界点≈50

  // 有序度随时间演化：熵增以恒定速率侵蚀，负熵流持续做功补偿。
  // order(t+1) = order + 负熵贡献 − 熵增侵蚀；临界点附近涨落放大。
  const series = useMemo(() => {
    const steps = 24, crit = 50;
    const decay = 6;                       // 每步熵增侵蚀（无序倾向）
    const gain = (flux / 100) * 11;        // 负熵流做功
    const noise = Math.max(0, 14 - Math.abs(flux - crit) * 0.9); // 临界点附近涨落最大
    const out = [];
    let o = 60;
    for (let t = 0; t < steps; t++) {
      const fluct = Math.sin(t * 1.7) * noise;
      o = Math.max(0, Math.min(100, o + gain - decay + fluct * 0.6));
      out.push(Math.round(o));
    }
    return out;
  }, [flux]);

  const finalOrder = series[series.length - 1];
  const verdict = flux < 38 ? 0 : flux < 58 ? 1 : 2;
  const entropy = Math.max(0, 100 - finalOrder);
  const accent = verdict === 2 ? '#10b981' : verdict === 1 ? '#e8a317' : '#c41e3a';

  const lineOpt = {
    grid: { left: 40, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: series.map((_, i) => `t${i}`), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', interval: 3 } },
    yAxis: { type: 'value', max: 100, min: 0, name: '有序度', nameTextStyle: { color: '#93a1b5' }, axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [{
      type: 'line', smooth: true, data: series, showSymbol: false,
      lineStyle: { color: accent, width: 2 }, itemStyle: { color: accent },
      areaStyle: { color: verdict === 2 ? 'rgba(16,185,129,0.12)' : verdict === 1 ? 'rgba(232,163,23,0.12)' : 'rgba(196,30,58,0.12)' },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#22d3ee', type: 'dashed' }, data: [{ yAxis: 50, label: { formatter: '临界有序线', color: '#22d3ee', fontSize: 10 } }] },
    }],
  };
  const gaugeOpt = {
    series: [{
      type: 'gauge', min: 0, max: 100, progress: { show: true, width: 14, itemStyle: { color: accent } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#1a2333']] } }, axisLabel: { color: '#5b6a82', fontSize: 10 },
      axisTick: { show: false }, splitLine: { show: false }, pointer: { itemStyle: { color: '#93a1b5' } },
      detail: { valueAnimation: true, color: '#e8edf6', fontSize: 26, offsetCenter: [0, '40%'], formatter: '{value}' },
      data: [{ value: finalOrder }],
    }],
  };

  return (
    <div>
      <PageHeader badge="Cognition · 耗散结构" title="耗散结构与熵 · 治理即持续对抗熵增"
        subtitle="孤立系统熵增走向死寂；开放系统靠负熵流在远离平衡态自组织出有序 —— 拖动负熵流，看系统是崩溃还是维持有序" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        普里高津（Prigogine）的<strong style={{ color: 'var(--text-primary)' }}>耗散结构</strong>理论：孤立系统遵循热力学第二定律，熵只增不减，终归无序与死寂。但<strong style={{ color: 'var(--text-primary)' }}>开放系统</strong>可以通过与环境交换物质、能量、信息引入<strong style={{ color: 'var(--cyber-cyan)' }}>负熵流</strong>；当系统被推到<strong style={{ color: 'var(--text-primary)' }}>远离平衡态</strong>、负熵流足以抵消熵增时，涨落会被放大，系统跨过临界点自发涌现出稳定有序结构。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={finalOrder} label="稳态有序度（实时）" accent={accent} />
        <Stat value={entropy} label="残余熵（无序度）" accent="#c41e3a" />
        <Stat value={flux} label="负熵流输入强度" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="负熵流调参 · 拖动看系统命运">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>负熵流输入强度（物质 / 能量 / 信息交换）</span>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{flux}</span>
          </div>
          <input type="range" min="0" max="100" value={flux} onChange={(e) => setFlux(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c41e3a' }} />
          <div className="mt-3 p-3 rounded" style={{ background: `${accent}14`, border: `1px solid ${accent}40` }}>
            <span className="text-[10px] mono uppercase" style={{ color: accent }}>{REGIMES[verdict][0]}</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{REGIMES[verdict][1]}</p>
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>临界点≈50：低于阈值熵增吞噬有序→崩溃；临界附近涨落剧烈放大；越过阈值系统自组织维持有序。</p>
        </Card>
        <Card title="系统有序度演化 + 稳态仪表">
          <EChart option={lineOpt} style={{ height: 180 }} />
          <EChart option={gaugeOpt} style={{ height: 150 }} />
        </Card>
      </Grid>

      <Card title="三态 · 从封闭死寂到远离平衡的自组织" className="mb-6">
        <Grid cols={3}>
          {REGIMES.map(([t, d], i) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${i === 0 ? '#c41e3a' : i === 1 ? '#e8a317' : '#10b981'}` }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="项目映射 · 治理即持续对抗熵增" className="mb-6">
        <Grid cols={3}>
          {MAP.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="用法 · 与各模块的接口">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          耗散结构是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>治国沙盒·熵增监控 / 治理现代化·熵减</span>的物理学母本：任何组织若不持续引入负熵流（改革、开放、信息流通、人才更替），都会滑向官僚化的熵增死寂。调参即在脑中预演——多大的开放强度，才足以让一个庞大系统持续维持有序。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为思想工具与示意，有序度曲线与临界阈值为定性演示，用于结构化思考而非实证测量。</p>
    </div>
  );
}
