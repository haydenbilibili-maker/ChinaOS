import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 制氢路线对比（成本 / 碳排放 / 国产化） ──────────────────────────────
const H2_TYPES = [
  { key: 'grey', label: '灰氢', accent: '#64748b', share: 62, cost: 12, co2: 11, local: 95,
    desc: '煤制氢 / 天然气重整为主，碳排放高但成本最低——过渡期的现实选择，绿氢替代需时间。装置与催化剂高度国产，但碳约束下没有未来。' },
  { key: 'blue', label: '蓝氢', accent: '#22d3ee', share: 20, cost: 18, co2: 3, local: 70,
    desc: '化石制氢 + CCUS 捕集，成本介于灰氢与绿氢之间；化工园区示范先行。CCUS 装置与封存场地是瓶颈，本质仍依赖化石资源。' },
  { key: 'green', label: '绿氢', accent: '#10b981', share: 15, cost: 35, co2: 0.5, local: 80,
    desc: '电解水制氢，电力占比极高；西北风光基地 + 特高压是降本物理路径——电价决定天花板。电解槽国产度高，膜 / 催化剂仍受制于人。' },
];

// ── 产业链环节选择器 ──────────────────────────────────────────────────
const CHAIN_LINKS = [
  { key: 'make', label: '制氢', accent: '#10b981',
    status: '电解槽 ALK 路线成熟，PEM/SOEC 攻关；绿氢成本受绿电价格主导。',
    cost: '绿氢 ~35 元/kg，目标 2030 降至 15 元以下', neck: '质子膜（全氟磺酸）、铱基催化剂仍依赖进口', local: 80,
    metrics: [['ALK 单位投资', '2200 元/kW', '#22d3ee'], ['PEM 单位投资', '7000 元/kW', '#c41e3a'], ['系统能效', '60–70%', '#e8a317']] },
  { key: 'store', label: '储运', accent: '#22d3ee',
    status: '高压气态为主（20–35MPa 长管拖车）；液氢 / 管道掺氢 / 液氨载体示范。',
    cost: '长管拖车 200km 内运费占终端 ~30%', neck: '70MPa 储氢瓶碳纤维、液氢核心装备、氢气压缩机', local: 60,
    metrics: [['长管拖车', '350–500kg/车', '#22d3ee'], ['液氢密度', '70.8 kg/m³', '#10b981'], ['掺氢比例', '试点 ≤20%', '#e8a317']] },
  { key: 'station', label: '加氢站', accent: '#e8a317',
    status: '建成 400+ 座居全球第一，但单站利用率与盈利仍是难题。',
    cost: '建站投资 1200–1800 万/座，氢价 60–80 元/kg', neck: '压缩机、加氢枪、流量计等加注核心装备', local: 65,
    metrics: [['全国加氢站', '400+ 座', '#e8a317'], ['单站投资', '~1500 万', '#c41e3a'], ['日加注能力', '500–1000kg', '#22d3ee']] },
  { key: 'fc', label: '燃料电池', accent: '#c41e3a',
    status: '电堆功率密度追平国际，但膜电极 / 质子膜 / 催化剂仍是卡脖子核心。',
    cost: '系统成本 ~3000 元/kW，目标降至 800 元', neck: '质子交换膜、铂催化剂、碳纸气体扩散层', local: 62,
    metrics: [['电堆功率密度', '4.0 kW/L', '#c41e3a'], ['系统成本', '3000 元/kW', '#e8a317'], ['寿命', '~15000h', '#22d3ee']] },
  { key: 'app', label: '应用场景', accent: '#8b5cf6',
    status: '重卡 / 物流先行，氢冶金 / 绿色化工示范；难脱碳领域是主战场。',
    cost: '燃料电池重卡 TCO 仍高于柴油 ~30%', neck: '终端用氢成本、加注网络、标准认证体系', local: 75,
    metrics: [['燃料电池车', '2万+ 辆', '#8b5cf6'], ['示范城市群', '5 大', '#22d3ee'], ['绿钢示范', '起步', '#10b981']] },
];

// ── 应用场景结构 ──────────────────────────────────────────────────────
const APP_MIX = [
  { value: 38, name: '交通(重卡/物流)', itemStyle: { color: '#8b5cf6' } },
  { value: 30, name: '工业(钢铁/化工)', itemStyle: { color: '#e8a317' } },
  { value: 18, name: '储能', itemStyle: { color: '#22d3ee' } },
  { value: 14, name: '发电/掺氢', itemStyle: { color: '#10b981' } },
];

// ── 燃料电池关键部件自主度 ────────────────────────────────────────────
const FC_PARTS = ['电堆', '膜电极', '质子膜', '催化剂', '双极板', '空压机'];
const FC_LOCAL = [88, 65, 35, 30, 90, 72];
const FC_INTL = [100, 100, 100, 100, 100, 100];

const PHASES = [
  { period: '2020–2022', title: '示范探索', accent: '#64748b', desc: '国家氢能中长期规划出台，示范城市群启动，电解槽项目备案 400+；以政策驱动、点状示范为主。' },
  { period: '2023–2024', title: '城市群示范', accent: '#e8a317', desc: '五大燃料电池汽车示范城市群以奖代补落地，ALK 单位投资 3500→2200 元/kW，PEM 仍处高位；绿氢成本 ~35 元/kg。' },
  { period: '2025–2027', title: '绿氢规模化', accent: '#22d3ee', desc: '风光制绿氢一体化项目放量，西北基地 GW 级电解槽招标；储运与标准认证决定能否走向规模。' },
  { period: '2028–2030', title: '全链条自主', accent: '#10b981', desc: '质子膜 / 催化剂 / 储运材料国产突破，燃料电池系统成本逼近 800 元/kW；目标绿氢 15 元/kg 以下。' },
  { period: '2030+', title: '平价应用', accent: '#c41e3a', desc: '绿氢在难脱碳领域（重卡 / 氢冶金 / 绿色化工）实现商业闭环，碳成本与氢成本双变量逼近平价。' },
];

export default function Page() {
  const [h2, setH2] = useState('green');
  const [link, setLink] = useState('make');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const h = H2_TYPES.find((x) => x.key === h2) || H2_TYPES[2];
  const lk = CHAIN_LINKS.find((x) => x.key === link) || CHAIN_LINKS[0];

  // 氢源结构 donut（随类型切换示意）
  const mixDonut = useMemo(() => donutOpt([
    { value: h2 === 'grey' ? 75 : 62, name: '灰氢', itemStyle: { color: LABEL.color } },
    { value: h2 === 'blue' ? 30 : 20, name: '蓝氢', itemStyle: { color: '#22d3ee' } },
    { value: h2 === 'green' ? 35 : 15, name: '绿氢', itemStyle: { color: '#10b981' } },
    { value: 3, name: '其他', itemStyle: { color: '#e8a317' } },
  ]), [h2]);

  // 制氢成本曲线（随类型切换）
  const costTrend = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(['2020', '2022', '2024', '2026E', '2030E']),
    yAxis: valueY({ name: '元/kg' }),
    series: [{ type: 'line', smooth: true, name: `${h.label}成本`,
      data: h2 === 'green' ? [45, 38, 35, 22, 15] : h2 === 'blue' ? [22, 20, 18, 16, 14] : [12, 12, 11, 10, 9],
      lineStyle: { color: h.accent, width: 2 }, itemStyle: { color: h.accent },
      areaStyle: { color: `${h.accent}18` } }],
  }), [h2, h]);

  // 三条路线成本 vs 碳排放 散点
  const costCo2Scatter = useMemo(() => ({
    grid: { ...GRID, left: 44 },
    tooltip: { trigger: 'item', formatter: (p) => `${p.data[2]}<br/>成本 ${p.data[0]} 元/kg<br/>碳排 ${p.data[1]} kgCO₂/kgH₂` },
    xAxis: valueY({ name: '成本 元/kg', nameGap: 22, min: 0, max: 40 }),
    yAxis: valueY({ name: 'kgCO₂/kg', min: 0, max: 12 }),
    series: [{
      type: 'scatter',
      data: H2_TYPES.map((t) => ({ value: [t.cost, t.co2, t.label], itemStyle: { color: t.accent }, symbolSize: t.share / 2 + 18 })),
      label: { show: true, formatter: (p) => p.data.value[2], position: 'top', color: 'var(--text-secondary)', fontSize: 10 },
    }],
  }), []);

  // 绿氢成本下降趋势（电解槽 + 绿电双驱动，logY）
  const greenCostDriver = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(['2020', '2022', '2024', '2026E', '2028E', '2030E']),
    yAxis: logY({ name: '指数' }),
    series: [
      { type: 'line', smooth: true, name: '绿氢成本(元/kg)', data: [45, 38, 35, 26, 20, 15],
        lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: '#10b98115' } },
      { type: 'line', smooth: true, name: '电解槽投资(百元/kW)', data: [35, 28, 22, 18, 15, 12],
        lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { type: 'line', smooth: true, name: '绿电成本(分/kWh)', data: [35, 30, 26, 22, 18, 15],
        lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // 应用场景 donut
  const appDonut = useMemo(() => donutOpt(APP_MIX), []);

  // 燃料电池关键部件自主度雷达
  const fcRadar = useMemo(() => ({
    ...radarOpt(FC_PARTS, FC_LOCAL, { name: '国产化率', color: '#c41e3a' }),
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'radar',
      data: [
        { value: FC_INTL, name: '国际先进(100)', lineStyle: { color: AXIS.lineStyle.color, width: 1, type: 'dashed' }, itemStyle: { color: AXIS.lineStyle.color }, areaStyle: { color: 'rgba(148,163,184,0.04)' } },
        { value: FC_LOCAL, name: '国产化率(%)', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      ],
    }],
  }), []);

  // 产业链能力对标雷达
  const chainRadar = useMemo(() => radarOpt(['电解槽', '储运', '材料', '场景', '政策', '国际合作'],
    h2 === 'green' ? [100, 92, 55, 88, 95, 65] : [85, 80, 70, 75, 90, 60],
    { name: '中国', color: h.accent }), [h2, h]);

  // 环节国产化率 堆叠条（国产 vs 缺口）
  const localBar = useMemo(() => stackedBarOpt({
    categories: CHAIN_LINKS.map((c) => c.label),
    series: [
      { name: '国产化率', data: CHAIN_LINKS.map((c) => c.local), itemStyle: { color: '#10b981' } },
      { name: '进口缺口', data: CHAIN_LINKS.map((c) => 100 - c.local), itemStyle: { color: '#3a1f24' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Hydrogen · 双碳二次能源" title="绿氢 · 制储运加用全链条" subtitle="电解槽 · 绿氢降本 · 燃料电池 · 难脱碳场景" />
      <IntroCard>电解水制氢成本中<strong style={{ color: 'var(--text-primary)' }}>电力占比极高</strong>，与风光消纳、特高压送电及 CCUS 路径竞争。氢的产业化必须沿「制—储—运—加—用」全链条同步推进，任一环节短板都会抬高终端用氢成本。<strong style={{ color: 'var(--text-primary)' }}>氢不是能源，是能量载体</strong>——它的价值在于把难以直接电气化的领域（重卡、氢冶金、绿色化工）与廉价风光绿电耦合起来。</IntroCard>

      <StatGrid className="mb-6">
        <Stat value="~3700 万吨/年" label="制氢产量（全球第一·示意）" accent="#10b981" />
        <Stat value="400+ 座" label="加氢站建成（全球第一）" accent="#e8a317" />
        <Stat value="2 万+ 辆" label="燃料电池车保有（示意）" accent="#c41e3a" />
        <Stat value="<5%" label="绿氢占比（爬坡期·情景）" accent="#22d3ee" />
      </StatGrid>

      {/* ── 交互① 产业链环节选择器 ── */}
      <Card title="交互① · 产业链环节选择器（制—储—运—加—用）" className="mb-6">
        <SelectorBar items={CHAIN_LINKS} activeKey={link} onSelect={setLink} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${lk.accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{lk.label} · 技术现状</div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{lk.status}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>成本</span> {lk.cost}　·　<span style={{ color: '#c41e3a' }}>卡脖子</span> {lk.neck}
          </p>
        </div>
        <Grid cols={3}>
          {lk.metrics.map(([t, v, c]) => (
            <div key={t} className="os-card p-3 text-center" style={{ background: 'var(--bg-surface)', borderTop: `2px solid ${c}` }}>
              <div className="text-lg font-semibold mono" style={{ color: c }}>{v}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{t}</div>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ── 交互② 氢源类型选择器 ── */}
      <Card title="交互② · 氢源类型选择器（灰 / 蓝 / 绿）" className="mb-6">
        <SelectorBar items={H2_TYPES} activeKey={h2} onSelect={setH2} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${h.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
        </div>
        <StatGrid className="mb-4">
          <Stat value={`~${h.cost} 元/kg`} label={`${h.label}成本`} accent={h.accent} />
          <Stat value={`${h.co2} kgCO₂`} label="每 kg 氢碳排" accent="#c41e3a" />
          <Stat value={`${h.local}%`} label="装备国产化率" accent="#10b981" />
          <Stat value={`${h.share}%`} label="当前结构占比（示意）" accent="#22d3ee" />
        </StatGrid>
        <Grid cols={2}>
          <Card title="氢源结构（随类型切换）"><EChart option={mixDonut} style={{ height: 240 }} /></Card>
          <Card title="制氢成本曲线（2020→2030E）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* ── 制氢路线对比 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="制氢路线 · 成本 vs 碳排放（气泡=结构占比）"><EChart option={costCo2Scatter} style={{ height: 260 }} /></Card>
        <Card title="绿氢成本下降 · 电解槽与绿电双驱动（log）"><EChart option={greenCostDriver} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ── 应用场景 + 燃料电池部件 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="氢能应用场景结构（难脱碳优先·示意）">
          <EChart option={appDonut} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>交通 / 工业占主体——电池难覆盖的重载与高温热场景，是氢的核心战场。</p>
        </Card>
        <Card title="燃料电池关键部件自主度（vs 国际 100）">
          <EChart option={fcRadar} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>质子膜与催化剂是最深的凹陷——电堆 / 双极板已追平，膜电极核心材料仍受制于人。</p>
        </Card>
      </Grid>

      {/* ── 全链条国产化率 ── */}
      <Card title="全链条装备国产化率 · 国产 vs 进口缺口（示意）" className="mb-6">
        <EChart option={localBar} style={{ height: 240 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>储运与燃料电池环节缺口最大；制氢端电解槽国产度高，但膜 / 催化剂仍是软肋。</p>
      </Card>

      {/* ── 交互③ 时间线 ── */}
      <Card title="交互③ · 氢能发展时间线（示范 → 自主 → 平价）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ── 产业链能力对标 + 电解槽路线 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="氢能产业链能力对标（随氢源切换）"><EChart option={chainRadar} style={{ height: 280 }} /></Card>
        <Card title="制 · 电解槽三条技术路线">
          <div className="space-y-2">
            {[['ALK 碱性', '成熟度高，适合大规模集中制氢；成本最低，国产化彻底，是当前绿氢主力。', '#22d3ee'],
              ['PEM 质子交换膜', '启停快，适配风光波动；贵金属与质子膜成本高，是膜 / 催化剂卡脖子集中地。', '#c41e3a'],
              ['SOEC 高温电解', '可与工业余热耦合，效率最高；耐久与密封攻关中，离规模化尚远。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ── 框架三联 ── */}
      <FrameworkTrio cards={[
        { title: '难脱碳领域', subtitle: '氢的根本位置', accent: '#8b5cf6', border: '#8b5cf6',
          body: '电池难覆盖的重载与高温热场景，才是氢真正不可替代的战场；与其在乘用车上和锂电硬碰，不如锁定重卡、航运、氢冶金、绿色化工。',
          pillars: [['重卡/航运', '长里程 + 快补能。'], ['氢冶金', 'DRI 替代焦炭。'], ['绿色化工', '绿氨 / 绿色甲醇。']] },
        { title: '绿电耦合', subtitle: '消纳 + 脱碳双赢', accent: '#10b981', border: '#10b981',
          body: '风光制绿氢把弃风弃光变成可储运的化学能——既解决消纳，又给难脱碳领域提供零碳原料；电价每降 0.1 元，绿氢成本降 ~2 元/kg。',
          pillars: [['风光基地', '源网荷储一体化。'], ['特高压', '西电东送耦合。'], ['消纳', '弃风弃光制氢。']] },
        { title: '卡脖子', subtitle: '材料 · 储运', accent: '#c41e3a', border: '#c41e3a',
          body: '电解槽与电堆可国产，但质子膜（全氟磺酸）、铱基催化剂、70MPa 储氢碳纤维与液氢装备仍受制于人——材料端不破，全链条降本就有天花板。',
          pillars: [['质子膜', '全氟磺酸国产化。'], ['催化剂', '铂铱减量替代。'], ['储运材料', '碳纤维 / 液氢。']] },
      ]} />

      <ModuleFooter moduleId="hydrogen" disclaimer="公开资料整理，数值为示意非官方 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「氢能」专题迁移升级" />
    </div>
  );
}
