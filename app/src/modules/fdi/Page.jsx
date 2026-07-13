import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 方向选择器：六个观察视角，各自切换规模/结构/政策/约束叙事 ────────────────
const DIRECTIONS = [
  {
    key: 'ifdi', label: '引进来 · IFDI', accent: '#22d3ee',
    headline: '从「低成本要素」到「全产业链效率」',
    desc: '全球唯一全工业门类配套形成物理级产业粘性——撤离意味着放弃最优响应速度与成本平衡。吸引力核心已从廉价劳动力转向供应链密度本身。',
    stats: [['1.13 万亿', '年度实际利用外资（RMB · 示意）', '#22d3ee'], ['39%', '高技术产业占比', '#10b981'], ['12,000+', '新设外企（季 · 示意）', '#e8a317']],
  },
  {
    key: 'ofdi', label: '走出去 · OFDI', accent: '#e8a317',
    headline: '从世界工厂到资本输出',
    desc: '制造业产能、新能源与数字平台加速出海——双向流动的另一翼。地缘转向：增量从发达经济体流向东盟与一带一路沿线，以市场换安全、以效率锁利益。',
    stats: [['1.78 万亿', '年度对外直接投资（RMB · 示意）', '#e8a317'], ['52%', '流向一带一路+东盟占比', '#c41e3a'], ['净输出', '双向流量再平衡', '#10b981']],
  },
  {
    key: 'neglist', label: '负面清单', accent: '#c41e3a',
    headline: '法无禁止即可为',
    desc: '负面清单管「能不能进」，从 2013 年全国版 190 条压减至 29 条；制造业限制条目清零标志着以绝对产业自信迎接全球竞争。清单缩短即开放度提升。',
    stats: [['29 条', '全国版负面清单', '#c41e3a'], ['27 条', '自贸区版负面清单', '#e8a317'], ['ZERO', '制造业限制条目', '#10b981']],
  },
  {
    key: 'ftz', label: '自贸区', accent: '#10b981',
    headline: '境内开放的灰度试验场',
    desc: '从「边境开放」转向「境内开放」：在自贸试验区测试 CPTPP、DEPA 等国际高标准经贸规则。谁定义了规则的本地化闭环，谁就掌握了在岸市场的准入话语权。',
    stats: [['22 个', '自贸试验区（含海南港）', '#10b981'], ['CPTPP/DEPA', '对接的高标准规则', '#22d3ee'], ['先行先试', '可复制可推广机制', '#e8a317']],
  },
  {
    key: 'security', label: '安全审查', accent: '#94a3b8',
    headline: '开放与审查并行不悖',
    desc: '负面清单之外，外商投资国家安全审查单独守住安全边界——管「会不会伤」。关键基础设施、核心技术、重要农产品、网络与数据安全领域设置独立闸门，构成开放叙事的对冲项。',
    stats: [['独立闸门', '关基/核心技术/数据', '#94a3b8'], ['事前申报', '触发门槛行业制', '#c41e3a'], ['张力点', '准入 vs 安全', '#e8a317']],
  },
  {
    key: 'rcep', label: 'RCEP 区域', accent: '#a78bfa',
    headline: '区域价值链的引力中心',
    desc: '全球最大自贸区下，区域累积原产地规则把东亚供应链锁进同一关税圈。投资与贸易合流：产能在区域内重新配置，中国既是终端市场也是中间品枢纽。',
    stats: [['15 国', 'RCEP 成员经济体', '#a78bfa'], ['~30%', '占全球 GDP/人口（示意）', '#22d3ee'], ['原产地累积', '区域价值链锁定', '#10b981']],
  },
];

// ── 各方向 → 雷达画像（跨境投资环境六维，0–100 示意） ──────────────────────
const RADAR_AXES = ['准入开放', '审批效率', '产权保护', '利润汇出', '政策稳定', '争端解决'];
const RADAR_BY_DIR = {
  ifdi: [82, 70, 68, 75, 72, 60],
  ofdi: [78, 65, 60, 80, 70, 55],
  neglist: [88, 74, 66, 76, 70, 58],
  ftz: [92, 85, 72, 82, 75, 70],
  security: [62, 58, 70, 64, 80, 66],
  rcep: [85, 76, 64, 78, 73, 72],
};

// ── 历史保留：随流向切换的高技术占比（兼容旧 FLOWS 语义，挂到方向上） ───────────
const HITECH_BY_DIR = { ifdi: 39, ofdi: 28, neglist: 33, ftz: 45, security: 30, rcep: 36 };

// ── 双向投资流量（2010→2025，IFDI vs OFDI，单位 千亿 RMB · 示意） ─────────────
const FLOW_YEARS = ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024', '2025E'];
const IFDI_SERIES = [7.4, 8.3, 8.6, 8.1, 9.2, 10.0, 11.6, 11.3, 11.0];
const OFDI_SERIES = [4.0, 5.7, 7.2, 12.0, 9.4, 9.9, 10.5, 11.8, 12.4];

// ── IFDI 行业结构（制造业占比下降、服务业/高技术上升） ─────────────────────────
const IFDI_STRUCT = donutOpt([
  { value: 28, name: '制造业', itemStyle: { color: '#c41e3a' } },
  { value: 41, name: '服务业', itemStyle: { color: '#22d3ee' } },
  { value: 22, name: '高技术产业', itemStyle: { color: '#10b981' } },
  { value: 9, name: '其他', itemStyle: { color: '#64748b' } },
]);

// ── OFDI 目的地分布（地缘转向：南方/区域上升） ──────────────────────────────
const OFDI_DEST = donutOpt([
  { value: 31, name: '东盟', itemStyle: { color: '#a78bfa' } },
  { value: 24, name: '一带一路（非东盟）', itemStyle: { color: '#e8a317' } },
  { value: 19, name: '欧洲', itemStyle: { color: '#22d3ee' } },
  { value: 14, name: '北美', itemStyle: { color: '#c41e3a' } },
  { value: 12, name: '其他', itemStyle: { color: '#64748b' } },
]);

// 历史保留：外资在华研发中心行业分布
const RD_CENTER_PIE = donutOpt([
  { value: 40, name: '生物医药', itemStyle: { color: '#22d3ee' } },
  { value: 25, name: '汽车与智驾', itemStyle: { color: '#c41e3a' } },
  { value: 20, name: '新材料', itemStyle: { color: '#10b981' } },
  { value: 15, name: '数字技术', itemStyle: { color: '#e8a317' } },
]);

// ── 开放演进时间线（外资三法 → 入世 → 自贸区 → 外商投资法 → 制度型开放） ───────
const PHASES = [
  { period: '1979–2000', title: '外资三法', accent: '#64748b', desc: '《中外合资经营企业法》等三法奠基，逐案审批、合资优先。外资作为引进资金、技术与管理的窗口，置于强管制框架内。' },
  { period: '2001–2012', title: '入世并轨', accent: '#22d3ee', desc: '加入 WTO，按承诺逐步取消外资限制、降低关税、开放服务业。《外商投资产业指导目录》成为准入主轴，制造业大规模引入。' },
  { period: '2013–2017', title: '负面清单试点', accent: '#10b981', desc: '上海等自贸区先行试点，全国版负面清单 190 条起步。从「正面目录」转向「负面清单」——管理逻辑的根本切换。' },
  { period: '2018–2021', title: '外商投资法', accent: '#e8a317', desc: '外资三法合一为《外商投资法》，确立准入前国民待遇+负面清单管理制度；制造业限制条目清零，国民待遇法定化。' },
  { period: '2022–至今', title: '制度型开放', accent: '#c41e3a', desc: '自贸试验区对接 CPTPP、DEPA 高标准规则，从「边境开放」转向「境内开放」；国家安全审查与开放并行，规则话语权竞争上升。' },
];

export default function Page() {
  const [dir, setDir] = useState('ifdi');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const d = DIRECTIONS.find((x) => x.key === dir) || DIRECTIONS[0];
  const hiTech = HITECH_BY_DIR[dir] ?? 35;

  // 双向投资流量多线（按方向高亮对应曲线）
  const flowDual = useMemo(() => ({
    grid: { ...GRID, top: 30 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, icon: 'circle' },
    xAxis: categoryX(FLOW_YEARS),
    yAxis: valueY({ axisLabel: { formatter: '{value}' } }),
    series: [
      {
        name: 'IFDI 引进来', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        data: IFDI_SERIES,
        lineStyle: { color: '#22d3ee', width: dir === 'ifdi' ? 3 : 1.5, opacity: dir === 'ofdi' ? 0.45 : 1 },
        itemStyle: { color: '#22d3ee' },
        areaStyle: dir === 'ifdi' ? { color: 'rgba(34,211,238,0.12)' } : undefined,
      },
      {
        name: 'OFDI 走出去', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        data: OFDI_SERIES,
        lineStyle: { color: '#e8a317', width: dir === 'ofdi' ? 3 : 1.5, opacity: dir === 'ifdi' ? 0.45 : 1 },
        itemStyle: { color: '#e8a317' },
        areaStyle: dir === 'ofdi' ? { color: 'rgba(232,163,23,0.12)' } : undefined,
      },
    ],
  }), [dir]);

  // 高技术占比趋势（随方向切换终点值）
  const hiTechLine = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2018', '2020', '2022', '2024E']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [20, 25, 34, hiTech], lineStyle: { color: d.accent, width: 2 },
      itemStyle: { color: d.accent }, areaStyle: { color: `${d.accent}18` },
    }],
  }), [d, hiTech]);

  // 负面清单压减（全国版 vs 自贸区版 双线）
  const negativeList = useMemo(() => ({
    grid: { ...GRID, top: 30 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, icon: 'circle' },
    xAxis: categoryX(['2013', '2017', '2019', '2021', '2024']),
    yAxis: valueY(),
    series: [
      {
        name: '全国版', type: 'line', step: 'end', data: [190, 63, 40, 31, 29],
        lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' },
        areaStyle: { color: 'rgba(232,163,23,0.1)' }, label: { show: true, color: LABEL.color, fontSize: 10 },
      },
      {
        name: '自贸区版', type: 'line', step: 'end', data: [null, 95, 37, 30, 27],
        lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' },
        label: { show: true, color: LABEL.color, fontSize: 10 },
      },
    ],
  }), []);

  // 跨境投资环境雷达（随方向切换）
  const envRadar = useMemo(
    () => radarOpt(RADAR_AXES, RADAR_BY_DIR[dir] || RADAR_BY_DIR.ifdi, { name: d.label, color: d.accent }),
    [dir, d],
  );

  // OFDI 目的地结构演进（地缘转向：发达 → 区域/南方）堆叠条
  const ofdiShift = useMemo(() => stackedBarOpt({
    categories: ['2013', '2018', '2024'],
    series: [
      { name: '发达经济体', data: [62, 48, 33], itemStyle: { color: '#22d3ee' } },
      { name: '东盟+一带一路', data: [26, 40, 55], itemStyle: { color: '#e8a317' } },
      { name: '其他', data: [12, 12, 12], itemStyle: { color: '#64748b' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="FDI · 双向直投" title="跨境直接投资 · 双向流动" subtitle="负面清单 · 国家安全审查 · 自贸区 · RCEP · 对外投资" />
      <IntroCard>
        现实主义框架下，中国对外资的吸引力已从「低成本要素」转向<strong style={{ color: 'var(--text-primary)' }}>全产业链效率</strong>；
        与此同时，资本回路的另一翼——<strong style={{ color: 'var(--text-primary)' }}>OFDI 出海</strong>把产能、新能源与数字平台输向区域与南方。
        负面清单（法无禁止即可为）与国家安全审查（关键领域独立闸门）并行，构成「开放与安全」的对冲结构。下方选择器切换六个观察视角。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="1.13 万亿" label="实际利用外资 IFDI（RMB · 示意）" accent="#22d3ee" />
        <Stat value="1.78 万亿" label="对外直接投资 OFDI（RMB · 示意）" accent="#e8a317" />
        <Stat value="29 条" label="全国版负面清单条目" accent="#c41e3a" />
        <Stat value="22 个" label="自贸试验区（含海南港）" accent="#10b981" />
      </Grid>

      <Card title="交互① · 方向选择器（六视角）" className="mb-6">
        <SelectorBar items={DIRECTIONS} activeKey={dir} onSelect={setDir} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${d.accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: d.accent }}>{d.headline}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.desc}</p>
        </div>
        <Grid cols={3} className="mb-4">
          {d.stats.map(([v, l, a]) => <Stat key={l} value={v} label={l} accent={a} />)}
        </Grid>
        <Grid cols={2}>
          <Card title="高技术产业占比（随视角切换）"><EChart option={hiTechLine} style={{ height: 220 }} /></Card>
          <Card title="跨境投资环境雷达（六维 · 示意）"><EChart option={envRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 双向投资流量（2010→2025 · 千亿 RMB · 示意）" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          从净引入到双向均衡乃至阶段性净输出：OFDI 曲线在 2016 年前后冲高、近年与 IFDI 并行——中国的资本身份从「世界工厂」叠加为「资本输出者」。
          当前视角 <strong style={{ color: d.accent }}>{d.label}</strong> 对应曲线已高亮。
        </p>
        <EChart option={flowDual} style={{ height: 260 }} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="IFDI 行业结构（制造业降 · 服务/高技术升 · 示意）"><EChart option={IFDI_STRUCT} style={{ height: 260 }} /></Card>
        <Card title="OFDI 目的地分布（地缘转向 · 示意）"><EChart option={OFDI_DEST} style={{ height: 260 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="负面清单压减（全国版 vs 自贸区版）"><EChart option={negativeList} style={{ height: 240 }} /></Card>
        <Card title="OFDI 目的地结构演进（发达 → 区域/南方 · %）"><EChart option={ofdiShift} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="交互③ · 开放政策阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="外资在华研发中心行业分布（示意）"><EChart option={RD_CENTER_PIE} style={{ height: 260 }} /></Card>
        <Card title="制度型开放 · 规则接轨">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            从「边境开放」转向「境内开放」：在自贸试验区测试 CPTPP、DEPA 等国际高标准经贸规则。谁定义了规则的本地化闭环，谁就掌握了在岸市场的准入话语权。
          </p>
          <Grid cols={2}>
            <Stat value="ZERO" label="制造业限制条目" accent="#10b981" />
            <Stat value="ACCELERATING" label="服务业开放深度" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '双向再平衡', subtitle: 'FDI + ODI', body: '从世界工厂到资本输出：IFDI 锚定供应链密度与全链条效率，OFDI 把产能、新能源与数字平台输向区域与南方，构成「以市场换安全、以效率锁利益」的资本回路。', pillars: [['市场重力场', '全工业门类配套。'], ['ODI 出海', '产能与平台输出。'], ['Chain Locking', '千亿级利润再投资。']] },
        { title: '负面清单逻辑', subtitle: '190→29 条', body: '法无禁止即可为：清单管「能不能进」，从 190 条压减至 29 条、制造业限制清零，标志着以绝对产业自信迎接全球竞争。清单缩短即开放度提升。', pillars: [['正面→负面', '管理逻辑切换。'], ['国民待遇', '准入前法定化。'], ['可复制', '自贸区先行先试。']] },
        { title: '安全与开放并重', subtitle: '准入 vs 审查', body: '国家安全审查管「会不会伤」：关键基础设施、核心技术、数据安全领域设独立闸门，与负面清单并行不悖——开放叙事内置的对冲与张力点。', pillars: [['清单管准入', '能不能进。'], ['审查管安全', '会不会伤。'], ['张力共存', '开放与审查并行。']] },
      ]} />

      <ModuleFooter moduleId="fdi" disclaimer="公开资料整理，数值为示意非官方 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「FDI」专题迁移升级" />
    </div>
  );
}
