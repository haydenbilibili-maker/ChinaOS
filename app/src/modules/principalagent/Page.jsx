import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 委托代理理论（Principal-Agent · 信息不对称）
// ----------------------------------------------------------------------------
// 委托人无法完全观察代理人 → 道德风险(隐藏行动)、逆向选择(隐藏类型)。
// 交互：监督强度 + 激励比例 两滑杆 → 代理人努力水平 & 委托总成本（存在最优点）。
// ============================================================================

const RISKS = [
  ['道德风险 · 隐藏行动', '合约签订后，代理人行动不可观测 → 偷懒、卸责、为部门私利套利（基层执行打折扣）。'],
  ['逆向选择 · 隐藏类型', '签约前，代理人真实能力/意图不可知 → 劣币驱逐良币（带病提拔、数据注水竞标）。'],
];
const SOLUTIONS = [
  ['激励相容', '让代理人「为己即为公」——绩效与报酬挂钩，把代理人利益对齐委托目标。'],
  ['监督', '审计、巡视、督查、留痕——直接压缩信息不对称，但本身有成本。'],
  ['声誉', '重复博弈下，长期声誉资本约束短期机会主义（晋升锦标赛即声誉排序）。'],
  ['绩效合约', '一利五率等可量化指标合约，把不可观测的「努力」替换为可考核的「结果」。'],
];

export default function Page() {
  const [m, setM] = useState(40); // 监督强度
  const [w, setW] = useState(50); // 激励比例（绩效占报酬比）

  // 代理人努力：随激励上升、随监督上升（但监督边际递减），上限 100
  const effort = useMemo(() => Math.round(Math.min(100, 20 + w * 0.6 + Math.sqrt(m) * 4)), [m, w]);
  // 监督成本随强度凸性上升；激励成本 = 让渡给代理人的剩余索取权
  const monCost = useMemo(() => Math.round((m * m) / 100), [m]);
  const incCost = useMemo(() => Math.round((w * effort) / 100), [w, effort]);
  // 代理损失：努力越低、损失越大（未实现的委托价值）
  const agencyLoss = useMemo(() => Math.round((100 - effort) * 0.9), [effort]);
  const total = monCost + incCost + agencyLoss; // 委托总成本（越低越好）

  // 扫描激励比例 0–100，固定当前监督，画总成本曲线找最优点
  const sweep = useMemo(() => {
    const xs = [], cost = [], eff = [];
    for (let ww = 0; ww <= 100; ww += 5) {
      const e = Math.min(100, 20 + ww * 0.6 + Math.sqrt(m) * 4);
      const c = Math.round((m * m) / 100 + (ww * e) / 100 + (100 - e) * 0.9);
      xs.push(ww); cost.push(c); eff.push(Math.round(e));
    }
    return { xs, cost, eff };
  }, [m]);
  const optIdx = sweep.cost.indexOf(Math.min(...sweep.cost));
  const optW = sweep.xs[optIdx];

  const chart = {
    legend: { data: ['委托总成本', '代理人努力'], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', name: '激励比例 %', nameTextStyle: { color: '#93a1b5' }, data: sweep.xs, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: [
      { type: 'value', name: '成本', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } } },
      { type: 'value', name: '努力', max: 100, splitLine: { show: false }, axisLine: { lineStyle: { color: '#27324a' } } },
    ],
    series: [
      { name: '委托总成本', type: 'line', smooth: true, data: sweep.cost, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' },
        markPoint: { symbolSize: 44, data: [{ name: '最优', coord: [optIdx, sweep.cost[optIdx]], itemStyle: { color: '#10b981' }, label: { formatter: '最优', color: '#fff', fontSize: 10 } }] } },
      { name: '代理人努力', type: 'line', smooth: true, yAxisIndex: 1, data: sweep.eff, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  };

  const Slider = ({ val, set, label, hint }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{val}%</span></div>
      <input type="range" min="0" max="100" value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
      <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 委托代理" title="委托代理理论 · 信息不对称下的治理成本"
        subtitle="委托人看不见代理人 → 道德风险与逆向选择 —— 调监督与激励，看努力水平与委托总成本如何权衡" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        当委托人（上级/股东）的目标依赖代理人（下级/经理）执行，而代理人的<strong style={{ color: 'var(--text-primary)' }}>行动与类型不可完全观测</strong>时，便产生委托代理问题：代理人有动机追逐自身利益、对委托目标打折扣。治理的核心，就是用<strong style={{ color: 'var(--text-primary)' }}>激励、监督、声誉、合约</strong>四种手段压低代理成本——但每种手段都有代价，故存在最优配比。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={effort} label="代理人努力水平（实时）" accent={effort > 75 ? '#10b981' : effort > 50 ? '#e8a317' : '#c41e3a'} />
        <Stat value={total} label="委托总成本（越低越好）" accent="#e8a317" />
        <Stat value={optW + '%'} label="当前监督下的最优激励比例" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="治理参数 · 拖动调参">
          <Slider val={m} set={setM} label="监督强度 Monitoring" hint="审计/巡视/留痕的力度。压缩信息不对称，但成本随强度凸性上升（边际递减）。" />
          <Slider val={w} set={setW} label="激励比例 Incentive" hint="绩效占报酬之比。提升努力最有效，但需让渡剩余索取权（让代理人分享成果）。" />
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div><div className="mono text-sm" style={{ color: '#e8a317' }}>{monCost}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>监督成本</div></div>
            <div><div className="mono text-sm" style={{ color: '#e8a317' }}>{incCost}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>激励成本</div></div>
            <div><div className="mono text-sm" style={{ color: '#c41e3a' }}>{agencyLoss}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>代理损失</div></div>
          </div>
        </Card>
        <Card title="激励—成本权衡曲线（固定当前监督）">
          <EChart option={chart} style={{ height: 280 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="两类信息不对称">
          {RISKS.map(([t, d]) => (
            <div key={t} className="mb-3" style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Card>
        <Card title="四种解法 · 压低代理成本">
          <Grid cols={2}>
            {SOLUTIONS.map(([t, d]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
        </Card>
      </Grid>

      <Card title="现实映射 · 与政府体系 / 国资模块呼应">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>央地关系（压力型体制）</strong>：中央是委托人、地方是代理人，目标考核层层加码以对抗执行打折扣；
          <strong style={{ color: 'var(--text-primary)' }}>官僚执行</strong>：政策在传导链上被信息不对称稀释，「上有政策、下有对策」即典型道德风险；
          <strong style={{ color: 'var(--text-primary)' }}>国企「一利五率」</strong>：国资委以可量化绩效合约替代不可观测努力，正是激励相容 + 绩效合约的制度落地。调参即在脑中预演不同监督/激励组合的治理代价。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为分析框架与思想工具，参数与权重为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
