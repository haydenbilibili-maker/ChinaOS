import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 公地悲剧与集体行动（哈丁 / 奥尔森 / 奥斯特罗姆）
// ----------------------------------------------------------------------------
// 公共资源因个体理性叠加而集体崩溃；规模越大越难自发约束（搭便车）；
// 奥斯特罗姆证明：社群自主治理是私有化/国有化之外的第三条路。
// ============================================================================

// 资源动态：存量 R，自然再生 g*R*(1−R/K)；每期消耗 = 人数 × 人均放牧。
// 人均放牧随「治理强度」下降；规模越大、治理越弱 → 越快越过临界点而崩溃。
function simulate(herders, governance) {
  const K = 100; const g = 0.32; const steps = 24;
  let R = 90; const series = [];
  const perHead = 1.15 * (1 - governance / 100); // 治理压低人均索取
  for (let t = 0; t <= steps; t++) {
    series.push(Math.max(0, Math.round(R)));
    const regen = g * R * (1 - R / K);
    const take = Math.min(R, herders * perHead);
    R = R + regen - take;
    if (R < 0) R = 0;
  }
  return series;
}

const SOLUTIONS = [
  ['产权 · 私有化', '#e8a317', '把公地切给个体（科斯）：边界清晰则外部性内部化，但分割成本高、生态系统难切分（一条河、一片大气切给谁？）。'],
  ['管制 · 利维坦', '#22d3ee', '由国家设配额、征税、强制（哈丁原解）：自上而下监控成本高，且地方信息不对称，易僵化与寻租。'],
  ['自治 · 奥斯特罗姆', '#10b981', '社群自定规则、分级制裁、低成本冲突调解（八项设计原则）：在边界可识别、可重复博弈处往往最优——破解「必然私有化或国有化」的迷思。'],
];

const MAPPINGS = [
  ['碳排放 / 双碳', '大气是全球公地，减排成本自付、收益共享 → 典型搭便车；需配额（管制）+ 碳市场（准产权）。'],
  ['过度捕捞', '公海渔业无主，竞相抢捞 → 渔业崩溃；区域配额与渔民自治社群是有效解。'],
  ['内卷', '注意力/分数是固定公地，个体理性加码 → 集体收益不增反降的负和竞争。'],
  ['地方债共担', '隐性担保使举债收益归地方、风险上移共担 → 软预算约束下的公地透支。'],
];

export default function Page() {
  const [herders, setHerders] = useState(20);
  const [governance, setGovernance] = useState(15);

  const series = useMemo(() => simulate(herders, governance), [herders, governance]);
  const endStock = series[series.length - 1];
  const collapsed = endStock <= 5;
  // 集体行动难度 ≈ 规模惩罚 − 治理（搭便车随规模上升）
  const difficulty = useMemo(() => Math.max(0, Math.min(100, Math.round(herders * 1.6 - governance * 0.6))), [herders, governance]);

  const chart = {
    grid: { left: 40, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'category', boundaryGap: false, data: series.map((_, i) => i), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    series: [{
      type: 'line', smooth: true, data: series, showSymbol: false,
      lineStyle: { color: collapsed ? '#c41e3a' : '#10b981', width: 2 },
      areaStyle: { color: collapsed ? 'rgba(196,30,58,0.12)' : 'rgba(16,185,129,0.12)' },
      markLine: { silent: true, symbol: 'none', label: { color: '#93a1b5', fontSize: 10 }, lineStyle: { color: '#e8a317', type: 'dashed' }, data: [{ yAxis: 20, name: '临界存量' }] },
    }],
  };

  const Slider = ({ val, set, min, max, label, color }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color }}>{val}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 公地悲剧" title="公地悲剧与集体行动 · 个体理性如何拖垮集体"
        subtitle="哈丁的牧场 / 奥尔森的搭便车 / 奥斯特罗姆的自主治理 —— 拖动滑杆看公共资源随时间枯竭或可持续" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        哈丁（1968）的牧场寓言：每个牧民多养一头牛，<strong style={{ color: 'var(--text-primary)' }}>收益归己、损耗共担</strong>，于是人人理性扩张，公地必然过载枯竭。奥尔森补充：<strong style={{ color: 'var(--text-primary)' }}>大集团比小集团更难集体行动</strong>——人越多越易搭便车，需「选择性激励」。奥斯特罗姆（1990）则用实证反驳了「不私有化即国有化」的二分：<strong style={{ color: 'var(--text-primary)' }}>社群自主治理是真实存在的第三条路</strong>。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={endStock} label="期末资源存量（满分100）" accent={collapsed ? '#c41e3a' : endStock > 40 ? '#10b981' : '#e8a317'} />
        <Stat value={collapsed ? '已崩溃' : '可持续'} label="公地终局" accent={collapsed ? '#c41e3a' : '#10b981'} />
        <Stat value={difficulty} label="集体行动难度指数（奥尔森）" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="参数 · 拖动调参">
          <Slider val={herders} set={setHerders} min={3} max={60} label="放牧者数量 / 集团规模" color="#c41e3a" />
          <Slider val={governance} set={setGovernance} min={0} max={90} label="治理强度（规则/制裁/激励）" color="#10b981" />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>规模越大越快越过临界线（虚线＝再生跟不上索取）；唯有把治理拉够高，曲线才从崩溃转为可持续。这正是「规模 vs 自律」的张力。</p>
        </Card>
        <Card title="资源存量演化（示意）">
          <EChart option={chart} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>绿＝可持续，红＝跌破临界后崩溃。横轴为时间期数。</p>
        </Card>
      </Grid>

      <Card title="三种破局解 · 产权 / 管制 / 自治" className="mb-6">
        <Grid cols={3}>
          {SOLUTIONS.map(([t, c, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          奥斯特罗姆的洞见：<strong style={{ color: 'var(--text-primary)' }}>没有万能解</strong>——选哪条路取决于资源边界是否清晰、博弈是否可重复、监督成本几何。三条路常组合使用（碳市场＝产权×管制）。
        </p>
      </Card>

      <Card title="现实映射 · 与生态 / 债务模块呼应" className="mb-6">
        <Grid cols={2}>
          {MAPPINGS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为分析框架与思想工具，再生/消耗参数为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
