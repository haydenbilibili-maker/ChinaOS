import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 康波周期（Kondratiev Wave）交互分析工具
// ----------------------------------------------------------------------------
// 康德拉季耶夫长波：约 50—60 年的资本主义经济长期波动（远长于基钦/朱格拉周期）。
// 本工具：嵌套周期对比 + 五波叠加图（春夏秋冬相位）+ 多周期共振模拟器 +
// 四季资产轮动框架 + 第六波技术群成熟度 + 历次长波换轨成本 + 中国定位。
// ============================================================================

// 已识别的五次长波 + 第六波推演（起止为学界常见区间，存争议）
const WAVES = [
  { id: 1, from: 1780, to: 1840, tech: '蒸汽机 · 纺织 · 运河', driver: '机械化', icon: '蒸', color: '#64748b',
    note: '第一次工业革命。蒸汽动力与机器纺织把生产从手工作坊推向工厂，运河网络降低运输成本。', china: '错失：清中叶闭关，与工业革命擦肩。' },
  { id: 2, from: 1840, to: 1890, tech: '铁路 · 钢铁 · 蒸汽船', driver: '运输革命', icon: '铁', color: '#22d3ee',
    note: '铁路狂热与钢铁冶金重塑空间，蒸汽轮船连通全球贸易，资本市场随铁路债券扩张。', china: '错失：洋务运动起步晚、未成体系，沦为半殖民地。' },
  { id: 3, from: 1890, to: 1940, tech: '电气 · 化工 · 内燃机', driver: '电力化', icon: '电', color: '#10b981',
    note: '第二次工业革命。电力、合成化工与内燃机催生新产业，泰勒制大规模生产成型，终于两次大战与大萧条。', china: '错失：内忧外患，工业基础薄弱。' },
  { id: 4, from: 1940, to: 1990, tech: '石油 · 汽车 · 电子', driver: '石化—消费', icon: '油', color: '#e8a317',
    note: '战后黄金时代。石油—汽车—郊区化—家电构成消费社会，半导体在尾声埋下下一波种子，1970s 石油危机为转折。', china: '中段切入：改革开放（1978）末班车，从计划转向市场，承接全球产业转移。' },
  { id: 5, from: 1990, to: 2040, tech: '信息技术 · 互联网 · 半导体', driver: '信息化', icon: 'IT', color: '#c41e3a',
    note: '信息革命。PC—互联网—移动—云重构生产与生活；2000 互联网泡沫(夏)、2008 金融危机(秋)、2015+ 进入萧条(冬)，孕育下一波。', china: '全面追赶：以制造规模 + 应用场景切入，部分环节（5G/电商/移动支付）跻身领跑，但先进半导体/EDA 仍受制。' },
  { id: 6, from: 2040, to: 2090, tech: 'AI · 新能源 · 生物科技', driver: '智能化（推演）', icon: 'AI', color: '#8b5cf6',
    note: '推演中的第六波。AI/具身智能、可控核聚变与新能源、合成生物可能成为新主导技术群；技术种子正在第五波的「冬天」孕育。', china: '力图换道超车：押注 AI/新能源/生物，争取从「追赶者」转为「定义者」——这是科技树与新质生产力的周期逻辑。' },
];

// 四季相位（康波春夏秋冬 · 周期视角下的一般规律，非投资建议）
const SEASONS = [
  ['春 · 回升 Recovery', '#10b981', '新技术扩散、信用复苏、加杠杆。增长动能重启，风险偏好回升。'],
  ['夏 · 繁荣/滞胀 Prosperity', '#e8a317', '增长见顶、通胀抬头、资产泡沫。实物与抗通胀资产相对占优。'],
  ['秋 · 衰退 Recession', '#c41e3a', '信用收缩、泡沫破裂、去杠杆。避险与现金/债券相对占优。'],
  ['冬 · 萧条 Depression', '#64748b', '出清与通缩，旧技术红利耗尽；下一波技术在此孕育，现金为王、布局种子。'],
];

// 四季 × 大类资产相对表现（周期框架的一般规律表述，非任何投资建议）
const ROTATION = [
  { season: '春 · 回升', color: '#10b981', cells: ['★★★', '★★', '★★', '★', '★★'], note: '风险偏好回升，权益与成长资产弹性最大' },
  { season: '夏 · 繁荣/滞胀', color: '#e8a317', cells: ['★★', '★★★', '★', '★', '★★★'], note: '通胀抬头，商品与抗通胀实物资产相对占优' },
  { season: '秋 · 衰退', color: '#c41e3a', cells: ['★', '★', '★★★', '★★', '★★'], note: '去杠杆与避险，债券/现金类相对防御' },
  { season: '冬 · 萧条', color: '#64748b', cells: ['★', '★', '★★', '★★★', '★★'], note: '出清通缩，现金为王；同时是播种下一波技术的窗口' },
];
const ROTATION_ASSETS = ['股票', '商品', '债券', '现金', '黄金'];

// 第六波候选技术群成熟度（0—100 示意评分：距产业化的距离，60 为产业化门槛）
const SEEDS = [
  { name: 'AI / 大模型', score: 78, color: '#c41e3a', note: '已跨产业化门槛，正处扩散早段——最像第六波的「铁路时刻」' },
  { name: '新能源/储能', score: 72, color: '#10b981', note: '光伏/电池成本曲线持续下穿，规模化扩散中' },
  { name: '合成生物', score: 46, color: '#e8a317', note: '平台技术成型，量产成本与监管路径待解' },
  { name: '量子计算', score: 30, color: '#22d3ee', note: '纠错与规模化是硬墙，实用化仍在远端' },
  { name: '脑机接口', score: 24, color: '#fb923c', note: '医疗特批场景先行，消费级遥远' },
  { name: '可控核聚变', score: 18, color: '#8b5cf6', note: 'Q 值刚过 1 的实验阶段，但一旦成功将重置能源体系' },
];

// 历次长波交替期的体系切换（霸权 / 货币 / 能源「换轨」）
const SWITCHES = [
  { era: '约 1840s', wave: '第1→2波', hegemon: '英国霸权确立', money: '金本位随贸易扩张', energy: '水力 → 煤', color: '#22d3ee' },
  { era: '约 1890s', wave: '第2→3波', hegemon: '美/德挑战英国', money: '英镑体系承压', energy: '煤 → 电气 + 内燃萌芽', color: '#10b981' },
  { era: '约 1940s', wave: '第3→4波', hegemon: '美国霸权 + 布雷顿森林', money: '英镑 → 美元', energy: '煤 → 石油', color: '#e8a317' },
  { era: '约 1990s', wave: '第4→5波', hegemon: '冷战终结 · 单极时刻', money: '信用美元 + 石油美元巩固', energy: '石油 + 电气化深化', color: '#c41e3a' },
  { era: '约 2040s?', wave: '第5→6波（推演）', hegemon: '多极竞逐 · 中美定义权之争', money: '美元松动? 数字货币 / 多元结算?', energy: '油 → 电（可再生 + 核/聚变）', color: '#8b5cf6' },
];

// 嵌套周期对比（年）
const NESTED = {
  grid: { left: 90, right: 40, top: 10, bottom: 24 },
  xAxis: { type: 'value', name: '年', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['基钦(库存)', '朱格拉(设备)', '库兹涅茨(建筑)', '康波(长波)'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
  series: [{ type: 'bar', data: [3.5, 9, 20, 55], barWidth: 16,
    itemStyle: { borderRadius: 3, color: (p) => ['#64748b', '#22d3ee', '#e8a317', '#c41e3a'][p.dataIndex] },
    label: { show: true, position: 'right', formatter: '{c} 年', color: LABEL.color } }],
};

const NOW_YEAR = 2024;
const SIM_YEAR = 2026;

// 相位(0—100%) → 四季判读
function phaseSeason(p) {
  if (p < 25) return { name: '春 · 回升', color: '#10b981' };
  if (p < 50) return { name: '夏 · 繁荣', color: '#e8a317' };
  if (p < 75) return { name: '秋 · 衰退', color: '#c41e3a' };
  return { name: '冬 · 萧条', color: '#64748b' };
}

// 第六波成熟度 bar
const SEED_OPT = {
  grid: { ...GRID, left: 80, bottom: 20 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}：${p[0].value} / 100` },
  yAxis: categoryX(SEEDS.map((s) => s.name).reverse()),
  xAxis: { ...valueY({ max: 100 }), type: 'value' },
  series: [{
    type: 'bar', barWidth: 14, data: SEEDS.map((s) => s.score).reverse(),
    itemStyle: { borderRadius: 3, color: (p) => SEEDS[SEEDS.length - 1 - p.dataIndex].color },
    label: { show: true, position: 'right', formatter: '{c}', color: LABEL.color, fontSize: 10 },
    markLine: { silent: true, symbol: 'none', data: [{ xAxis: 60, label: { formatter: '产业化门槛 60', color: '#e8a317', position: 'insideEndTop' }, lineStyle: { color: '#e8a317', type: 'dashed' } }] },
  }],
};

export default function Page() {
  const [sel, setSel] = useState(5);
  // 多周期共振模拟器：三周期的当前相位（0—100%，即处于各自周期的第几成）
  const [kPhase, setKPhase] = useState(82);   // 康波 54y · 默认冬末
  const [jPhase, setJPhase] = useState(40);   // 朱格拉 9y
  const [bPhase, setBPhase] = useState(65);   // 基钦 3.5y
  const w = WAVES.find((x) => x.id === sel);

  // 康波长波叠加曲线（约 54 年周期的复合正弦），并对选中波叠加春夏秋冬相位带
  const longWave = useMemo(() => {
    const pts = [];
    for (let y = 1775; y <= 2055; y += 1) pts.push([y, +(Math.sin((2 * Math.PI * (y - 1788)) / 54)).toFixed(3)]);
    const span = (w.to - w.from) / 4;
    const seasonColors = ['rgba(16,185,129,0.10)', 'rgba(232,163,23,0.10)', 'rgba(196,30,58,0.10)', 'rgba(100,116,139,0.12)'];
    const seasonNames = ['春', '夏', '秋', '冬'];
    const areas = seasonNames.map((nm, i) => [
      { xAxis: w.from + span * i, itemStyle: { color: seasonColors[i] }, label: { show: true, formatter: nm, color: LABEL.color, position: 'insideTop' } },
      { xAxis: w.from + span * (i + 1) },
    ]);
    return {
      grid: { left: 30, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue} 年` },
      xAxis: { type: 'value', min: 1775, max: 2055, interval: 40, axisLabel: { formatter: (v) => String(v), color: '#5b6a82' }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
      yAxis: { type: 'value', min: -1.4, max: 1.4, axisLabel: { show: false }, splitLine: { show: false } },
      series: [{
        type: 'line', smooth: true, symbol: 'none', data: pts,
        lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.06)' },
        markArea: { silent: true, data: areas },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: NOW_YEAR, label: { formatter: '今 ' + NOW_YEAR, color: '#c41e3a', position: 'insideEndTop' }, lineStyle: { color: '#c41e3a', type: 'dashed' } }] },
      }],
    };
  }, [w]);

  // 多周期共振：三正弦叠加（振幅 康波1.0 / 朱格拉0.55 / 基钦0.3），投影未来 20 年
  const resonance = useMemo(() => {
    const cyc = [
      { T: 54, A: 1.0, p: kPhase, name: '康波 54y', color: '#c41e3a' },
      { T: 9, A: 0.55, p: jPhase, name: '朱格拉 9y', color: '#22d3ee' },
      { T: 3.5, A: 0.3, p: bPhase, name: '基钦 3.5y', color: '#e8a317' },
    ];
    const val = (c, dt) => c.A * Math.sin(2 * Math.PI * (c.p / 100 + dt / c.T));
    const comp = [];
    const parts = cyc.map(() => []);
    let peak = { v: -9, y: SIM_YEAR };
    let trough = { v: 9, y: SIM_YEAR };
    for (let dt = 0; dt <= 20; dt += 0.25) {
      const y = +(SIM_YEAR + dt).toFixed(2);
      const s = cyc.reduce((acc, c) => acc + val(c, dt), 0);
      comp.push([y, +s.toFixed(3)]);
      cyc.forEach((c, i) => parts[i].push([y, +val(c, dt).toFixed(3)]));
      if (s > peak.v) peak = { v: s, y };
      if (s < trough.v) trough = { v: s, y };
    }
    const now = comp[0][1];
    const readings = cyc.map((c) => ({ ...c, season: phaseSeason(c.p), v: val(c, 0) }));
    const sameDown = readings.every((r) => r.v < -0.1 * r.A);
    const sameUp = readings.every((r) => r.v > 0.1 * r.A);
    const verdict = now >= 1.2 ? { t: '多周期同向共振 · 大繁荣区', c: '#10b981' }
      : now <= -1.2 ? { t: '多周期同向共振 · 大萧条区', c: '#c41e3a' }
      : Math.abs(now) < 0.4 ? { t: '周期相互对冲 · 景气钝化区', c: '#64748b' }
      : now > 0 ? { t: '温和扩张（未形成共振）', c: '#22d3ee' } : { t: '温和收缩（未形成共振）', c: '#e8a317' };
    const opt = {
      grid: { left: 36, right: 16, top: 30, bottom: 26 },
      tooltip: { trigger: 'axis', valueFormatter: (v) => (typeof v === 'number' ? v.toFixed(2) : v) },
      legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
      xAxis: { type: 'value', min: SIM_YEAR, max: SIM_YEAR + 20, interval: 4, axisLabel: { formatter: (v) => String(v), color: '#5b6a82' }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
      yAxis: { type: 'value', min: -2.2, max: 2.2, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: '#5b6a82', fontSize: 10 } },
      series: [
        ...cyc.map((c, i) => ({ name: c.name, type: 'line', smooth: true, symbol: 'none', data: parts[i], lineStyle: { color: c.color, width: 1, opacity: 0.45, type: 'dashed' } })),
        { name: '景气合成', type: 'line', smooth: true, symbol: 'none', data: comp,
          lineStyle: { color: '#8b5cf6', width: 3 }, areaStyle: { color: 'rgba(139,92,246,0.10)' },
          markPoint: { symbolSize: 1, label: { fontSize: 10 }, data: [
            { coord: [peak.y, +peak.v.toFixed(2)], value: `峰 ${Math.round(peak.y)}`, label: { color: '#10b981' } },
            { coord: [trough.y, +trough.v.toFixed(2)], value: `谷 ${Math.round(trough.y)}`, label: { color: '#c41e3a' } },
          ] },
          markLine: { silent: true, symbol: 'none', data: [{ yAxis: 0, lineStyle: { color: 'rgba(148,163,184,0.3)' }, label: { show: false } }] } },
      ],
    };
    return { opt, readings, now, verdict, peak, trough };
  }, [kPhase, jPhase, bPhase]);

  const sliders = [
    ['康波 54y', kPhase, setKPhase, '#c41e3a'],
    ['朱格拉 9y', jPhase, setJPhase, '#22d3ee'],
    ['基钦 3.5y', bPhase, setBPhase, '#e8a317'],
  ];

  return (
    <div>
      <PageHeader badge="Cognition · 理论模型库" title="康波周期 · 康德拉季耶夫长波"
        subtitle="约 50—60 年的经济长波 —— 透过技术革命的潮汐，定位中国「换道超车」的周期坐标" />
      <IntroCard>康波周期由苏联经济学家<strong style={{ color: 'var(--text-primary)' }}>尼古拉·康德拉季耶夫</strong>于 1920 年代提出：资本主义存在约 50—60 年的长期波动。每一轮长波由一组<strong style={{ color: 'var(--text-primary)' }}>主导技术</strong>驱动，经历回升—繁荣—衰退—萧条四季；旧波的「冬天」正是下一波技术种子的孕育期。本页另附多周期共振模拟器：同一时点的景气，是康波/朱格拉/基钦多周期相位的合成。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="50—60 年" label="长波周期" accent="#c41e3a" />
        <Stat value="5 (+1)" label="已识别 / 推演长波" accent="#22d3ee" />
        <Stat value="四季" label="回升·繁荣·衰退·萧条" accent="#e8a317" />
        <Stat value="第5波·冬" label="当前坐标（约 2015–2025）" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="周期嵌套 · 四种周期长度对比"><EChart option={NESTED} style={{ height: 220 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>短周期叠加在长波之上：同一时点的景气，是多周期相位的合成。</p>
        </Card>
        <Card title="康波四季 · 相位与一般规律">
          <div className="space-y-2">
            {SEASONS.map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="交互 · 五次长波选择器（叠加春夏秋冬相位）" className="mb-6">
        <SelectorBar items={WAVES.map((x) => ({ key: x.id, label: `第${x.id}波 · ${x.from}`, accent: x.color }))} activeKey={sel} onSelect={setSel} getKey={(i) => i.key} />
        <EChart option={longWave} style={{ height: 280 }} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`第 ${w.id} 波 · ${w.tech}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: w.color }}>{w.icon}</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{w.from} – {w.to}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{w.driver}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.note}</p>
        </Card>
        <Card title={`中国在第 ${w.id} 波的位置`}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.china}</p>
          {w.id >= 5 && (
            <div className="mt-3 p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>周期注脚</span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>「换道超车」的本质，是在第五波的「冬天」抢占第六波（AI/新能源/生物）的起跑线——这正是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>科技树 / 新质生产力 / 半导体 / 能源主权</span>各模块的长波坐标。</p>
            </div>
          )}
        </Card>
      </Grid>

      <Card title="模拟器 · 多周期共振（康波 × 朱格拉 × 基钦 → 未来 20 年景气合成）" className="mb-6">
        <Grid cols={3} className="mb-3">
          {sliders.map(([label, val, setter, color], i) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color }}>{label} · 相位</span>
                <span className="mono" style={{ color: 'var(--text-primary)' }}>{val}% <span style={{ color: resonance.readings[i].season.color }}>（{resonance.readings[i].season.name}）</span></span>
              </div>
              <input type="range" min={0} max={100} step={1} value={val} onChange={(e) => setter(+e.target.value)} style={{ width: '100%', accentColor: '#c41e3a' }} />
            </div>
          ))}
        </Grid>
        <EChart option={resonance.opt} style={{ height: 290 }} />
        <div className="mt-3 p-3 rounded" style={{ background: 'var(--bg-elevated)', border: `1px solid ${resonance.verdict.c}40` }}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: resonance.verdict.c }}>{SIM_YEAR} 判读：{resonance.verdict.t}</span>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>合成读数 {resonance.now.toFixed(2)}（区间 ±1.85）</span>
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            投影窗口内：合成峰值约 <span className="mono" style={{ color: '#10b981' }}>{Math.round(resonance.peak.y)} 年（{resonance.peak.v.toFixed(2)}）</span>，谷值约 <span className="mono" style={{ color: '#c41e3a' }}>{Math.round(resonance.trough.y)} 年（{resonance.trough.v.toFixed(2)}）</span>。
            核心机制：当三周期<strong style={{ color: 'var(--text-primary)' }}>同向叠加（共振）</strong>，波动被放大为大繁荣或大萧条——1929 与 2008 常被解读为「康波秋冬 + 朱格拉下行 + 基钦去库」的三杀共振；反之相位错开时彼此对冲，景气表现为「温吞震荡」。
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>正弦叠加为教学示意：真实周期非严格正弦、周期长度漂移、且可被政策强行移相。拖动滑杆体验「相位组合 → 景气形态」的敏感性即可，勿作预测。</p>
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="四季资产轮动 · 周期框架表">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-tertiary)' }}>
                <th className="text-left py-1.5" style={{ borderBottom: '1px solid var(--border-default)' }}>相位</th>
                {ROTATION_ASSETS.map((a) => <th key={a} className="text-center py-1.5" style={{ borderBottom: '1px solid var(--border-default)' }}>{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROTATION.map((r) => (
                <tr key={r.season} title={r.note}>
                  <td className="py-2 font-semibold whitespace-nowrap" style={{ color: r.color, borderBottom: '1px solid var(--border-default)' }}>{r.season}</td>
                  {r.cells.map((c, i) => (
                    <td key={i} className="text-center py-2 mono" style={{ color: c === '★★★' ? r.color : 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>★ 数量表示该相位下的<em>相对</em>表现（多 = 相对占优）。<strong style={{ color: 'var(--text-primary)' }}>此为周期视角的一般规律框架，非投资建议</strong>——真实资产表现受政策、估值起点与流动性主导，长波相位只是其中一个低频变量。</p>
        </Card>
        <Card title="第六波技术群 · 成熟度（冬天里的种子，哪些先发芽）">
          <EChart option={SEED_OPT} style={{ height: 230 }} />
          <div className="space-y-1 mt-1">
            {SEEDS.slice(0, 3).map((s) => (
              <p key={s.name} className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}><span className="mono" style={{ color: s.color }}>{s.name}</span> — {s.note}</p>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="换轨成本 · 历次长波交替期的体系切换（霸权 / 货币 / 能源）" className="mb-6">
        <Grid cols={5}>
          {SWITCHES.map((s) => (
            <div key={s.era} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${s.color}` }}>
              <div className="text-xs font-bold mono" style={{ color: s.color }}>{s.era}</div>
              <div className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{s.wave}</div>
              {[['霸权', s.hegemon], ['货币', s.money], ['能源', s.energy]].map(([k, v]) => (
                <div key={k} className="mb-1.5">
                  <span className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>{k}</span>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{v}</p>
                </div>
              ))}
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          规律：长波交替期往往伴随<strong style={{ color: 'var(--text-primary)' }}>体系级「换轨」</strong>——霸权易位（或承压）、储备货币切换（英镑→美元）、能源底座更替（煤→油→电）。换轨成本极高（通常伴随战争/危机/秩序重建），但<strong style={{ color: 'var(--text-primary)' }}>新轨道的定义权属于在冬天完成布局的一方</strong>。第六波的悬念：电力底座 + 算力货币化 + 多极结算，谁来定义？——这正是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>能源主权 / 人民币国际化 / 算力基建</span>模块的长波坐标。
        </p>
      </Card>

      <Card title="当前坐标 · 第五波的萧条期与第六波的孕育" className="mb-6">
        <Grid cols={3}>
          {[['萧条期出清', '信息技术红利边际递减，全球进入去杠杆与低增长；这是康波冬季的典型特征（约 2015–2025）。'],
            ['技术种子孕育', 'AI、可控核聚变、新能源、合成生物在冬天积蓄——历史上下一波的主导技术，总在上一波萧条中成型。'],
            ['大国卡位', '谁能在冬季完成对第六波技术群的布局，谁就可能定义下一个 50 年的繁荣——这是现实主义的长周期博弈。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '长波引擎', subtitle: '技术群 S 曲线', body: '每轮长波由主导技术群的扩散 S 曲线驱动：导入期（春）→ 加速扩散（夏）→ 红利递减（秋）→ 耗尽出清（冬）。', pillars: [['导入', '新技术嵌入基础设施。'], ['扩散', '成本下穿引爆需求。'], ['耗尽', '红利递减孕育下波。']] },
        { title: '多周期共振', subtitle: '相位合成', body: '景气是康波/朱格拉/基钦相位的合成：同向叠加放大为大繁荣/大萧条，错相则相互对冲。', pillars: [['基钦 3.5年', '库存周期。'], ['朱格拉 9年', '设备周期。'], ['共振', '同向叠加放大波动。']] },
        { title: '换道窗口', subtitle: '冬天播种', body: '长波交替期是体系换轨期：在旧波冬天完成对新技术群的布局，方能争夺新轨道定义权。', pillars: [['第4波末班车', '改革开放 1978。'], ['第5波全面追赶', '制造+应用场景。'], ['第6波卡位', 'AI/新能源/生物。']] },
      ]} />

      <Card title="作为思想工具 · 康波的用法与边界">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          康波不是占卜，而是一副<strong style={{ color: 'var(--text-primary)' }}>「长焦镜头」</strong>：它提醒我们把今天的政策与产业放到 50 年尺度上看——为什么国家不惜代价押注 AI/半导体/聚变？因为长波的窗口期一旦错过，就是一代人的落后。
        </p>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          边界：长波周期是否客观存在、相位如何划分，学界仍有争议（驱动机制、起止年份、是否被政策熨平均存分歧）。本页全部曲线为<strong style={{ color: 'var(--text-primary)' }}>教学示意（正弦叠加），非实证拟合</strong>；资产轮动表为周期框架的一般规律表述。<strong style={{ color: 'var(--text-primary)' }}>本页为分析框架与思想工具，不构成任何投资建议</strong>；起止年份、相位与成熟度评分均为示意标注，请结合各业务模块的实证数据使用。
        </p>
      </Card>
      <ModuleFooter moduleId="cognition" disclaimer="长波周期是否客观存在学界仍有争议；本页全部曲线为正弦示意而非实证拟合，为分析框架与思想工具，不构成投资建议" />
    </div>
  );
}
