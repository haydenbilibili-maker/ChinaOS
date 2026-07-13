import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 总体国家安全观「大安全」领域矩阵 ──────────────────────────────────
// 每域：核心威胁 / 主防线 / 当前抓手 / 态势评级（示意，1-5 越高越紧张）/ 威胁热度
const DOMAINS = [
  { key: 'political', label: '政治安全', accent: '#c41e3a', rating: 4, heat: 86,
    threat: '政权稳定与意识形态领导权的侵蚀：颜色革命范式、境外舆论渗透、价值观分化。',
    line: '党的全面领导 + 意识形态阵地管控 + 基层组织穿透。把政治安全置于「根本」位序。',
    grip: '反渗透反颠覆、网络意识形态斗争、国家安全教育常态化。',
    note: '总体国家安全观以政治安全为根本——其余领域皆为其服务的派生变量。' },
  { key: 'economic', label: '经济安全', accent: '#e8a317', rating: 4, heat: 82,
    threat: '金融脱钩、汇率与资本异动、产业空心化、关键支付/结算通道被切断。',
    line: '人民币国际化 + 跨境支付自主（CIPS）+ 外汇储备压舱 + 内需主导双循环。',
    grip: '防范系统性金融风险、产业链备份、稳外贸稳外资。',
    note: '经济安全是发展的物质基座——既要增长效率，又要在极端制裁下的生存确定性。' },
  { key: 'resource', label: '粮食能源资源', accent: '#10b981', rating: 3, heat: 68,
    threat: '口粮以外的结构性对外依存（大豆/原油/铁矿/关键矿产），海上运输咽喉受制。',
    line: '18 亿亩耕地红线 + 藏粮于地于技 + SPR 90+ 天 + 非化石转型 + 矿产多元化。',
    grip: '种业振兴、战略储备扩容、「电代油」消解马六甲依赖。',
    note: '粮食与能源是物理生存底线——不可谈判、不可外包的硬约束。' },
  { key: 'tech', label: '科技安全', accent: '#22d3ee', rating: 5, heat: 91,
    threat: '高端芯片/EDA/光刻被「卡脖子」，基础研究与关键设备代际落差，标准与生态被锁定。',
    line: '新型举国体制 + 全国统一大市场牵引 + 自主可控替代 + 基础研究长周期投入。',
    grip: '集中攻坚关键核心技术、构建自主产业链生态、人才与设备双线突围。',
    note: '科技安全是当前对抗烈度最高的主战场——胜负决定其余领域的天花板。' },
  { key: 'cyber', label: '网络数据', accent: '#818cf8', rating: 4, heat: 79,
    threat: '境外 APT 持续渗透、关键基础设施攻击、数据跨境流失、认知空间信息战。',
    line: '自主骨干网 + 数据分级跨境审查 + 关基防护 + 政务系统国产化。',
    grip: '网络安全审查、数据三法落地、根服务器副本与态势感知。',
    note: '主权不止于地理疆界，更在数据流向与语义/认知空间的国家可控性。' },
  { key: 'bio', label: '生物安全', accent: '#34d399', rating: 3, heat: 61,
    threat: '重大新发突发传染病、外来物种入侵、生物技术误用与实验室泄漏、种质资源外流。',
    line: '生物安全法体系 + 疾控监测预警 + 高级别生物安全实验室 + 种质库。',
    grip: '传染病联防联控、实验室分级管理、生物技术伦理审查。',
    note: '生物安全是「非传统安全」纳入总体框架的标志性领域——低频但尾部极重。' },
  { key: 'military', label: '军事国防', accent: '#f87171', rating: 4, heat: 84,
    threat: '周边热点（台海/南海/边境）、海上通道封锁、技术代差与体系对抗压力。',
    line: '战略威慑（核常兼备）+ 体系作战能力 + 军民融合 + 国防动员潜力。',
    grip: '联合作战指挥、装备现代化、战略后方与动员冗余。',
    note: '军事是安全的「最后保险」——为统筹发展与安全提供物理担保与战略定力。' },
  { key: 'social', label: '社会安全', accent: '#94a3b8', rating: 3, heat: 64,
    threat: '群体性事件、经济下行期的就业与债务压力传导、公共安全与基层治理失序。',
    line: '网格化基层治理 + 矛盾源头化解（枫桥经验）+ 社会保障兜底 + 应急管理体系。',
    grip: '就业优先、信访与维稳前置、公共安全风险隐患排查。',
    note: '社会安全是稳定的「毛细血管」——宏观安全最终在基层个体层面被验证。' },
];

// 各域威胁热度（大安全全景 · 横向条）
const heatBarOpt = () => ({
  grid: { left: 86, right: 28, top: 8, bottom: 16 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: 威胁热度 {c} · 示意' },
  xAxis: valueY({ max: 100 }),
  yAxis: { type: 'category', data: [...DOMAINS].reverse().map((d) => d.label), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 13,
    data: [...DOMAINS].reverse().map((d) => ({ value: d.heat, itemStyle: { color: d.accent, borderRadius: [0, 3, 3, 0] } })),
    label: { show: true, position: 'right', formatter: '{c}', color: LABEL.color, fontSize: 10 },
  }],
});

// 大安全全域威胁雷达（八域评级 ×20 → 0-100）
const domainRadarOpt = radarOpt(
  DOMAINS.map((d) => d.label),
  DOMAINS.map((d) => d.rating * 20),
  { name: '威胁紧张度 · 示意', color: '#c41e3a' },
);

// ── 既有支柱数据（保留并复用）──────────────────────────────────────
const grainChart = () => ({
  grid: GRID,
  xAxis: categoryX(['口粮', '谷物', '大豆', '食用油']),
  yAxis: valueY({ max: 110, axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', data: [100, 95, 15, 30], barWidth: 28,
    itemStyle: { color: (p) => ['#10b981', '#10b981', '#c41e3a', '#e8a317'][p.dataIndex], borderRadius: [3, 3, 0, 0] },
    label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color } }],
});

const sprChart = () => ({
  grid: GRID,
  xAxis: categoryX(['2019', '2021', '2023', '2025E']),
  yAxis: valueY({ name: '天', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, data: [60, 75, 90, 110], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
});

const cyberDonut = () => donutOpt([
  { value: 42, name: '境外 APT', itemStyle: { color: '#c41e3a' } },
  { value: 28, name: '勒索/木马', itemStyle: { color: '#e8a317' } },
  { value: 18, name: '认知渗透', itemStyle: { color: '#22d3ee' } },
  { value: 12, name: '内部风险', itemStyle: { color: '#64748b' } },
]);

// ── 关键领域自主可控进度（已实现 vs 缺口堆叠）──────────────────────
const autonomyOpt = stackedBarOpt({
  categories: ['口粮', '能源', '高端芯片', '工业软件', '关键矿产', '核心数据', '基础种源'],
  series: [
    { name: '已自主可控', data: [100, 80, 38, 45, 55, 78, 72], itemStyle: { color: '#10b981' } },
    { name: '对外依存/缺口', data: [0, 20, 62, 55, 45, 22, 28], itemStyle: { color: 'rgba(196,30,58,0.55)' } },
  ],
});

// ── 安全 vs 发展 张力指针（仪表盘）──────────────────────────────────
// 0 = 全力发展，100 = 全力安全；近年重心偏向安全侧
const tensionGaugeOpt = (val) => ({
  series: [{
    type: 'gauge', startAngle: 200, endAngle: -20, min: 0, max: 100, splitNumber: 5,
    center: ['50%', '60%'], radius: '92%',
    axisLine: { lineStyle: { width: 14, color: [[0.4, '#22d3ee'], [0.6, '#e8a317'], [1, '#c41e3a']] } },
    pointer: { width: 5, itemStyle: { color: '#e2e8f0' } },
    axisTick: { distance: -14, length: 5, lineStyle: { color: AXIS.lineStyle.color } },
    splitLine: { distance: -14, length: 14, lineStyle: { color: AXIS.lineStyle.color } },
    axisLabel: { distance: 18, color: '#5b6a82', fontSize: 9,
      formatter: (v) => (v === 0 ? '发展' : v === 100 ? '安全' : '') },
    detail: { valueAnimation: true, formatter: '安全权重 {value}', color: LABEL.color, fontSize: 12, offsetCenter: [0, '36%'] },
    data: [{ value: val }],
  }],
});

// ── 风险传导链（外部脱钩 → 社会）──────────────────────────────────
const CASCADE = [
  { stage: '外部脱钩/制裁', detail: '技术禁运 · 实体清单 · 通道切断', accent: '#c41e3a' },
  { stage: '供应链断点', detail: '关键零部件/设备/原料无法获取', accent: '#e8a317' },
  { stage: '产业受冲击', detail: '高端制造停摆 · 产能利用率下滑', accent: '#f59e0b' },
  { stage: '就业与收入', detail: '岗位收缩 · 居民收入与预期走弱', accent: '#818cf8' },
  { stage: '社会面承压', detail: '消费收缩 · 债务与维稳压力上行', accent: '#94a3b8' },
];

// ── 安全观演进时间线 ──────────────────────────────────────────────
const TIMELINE = [
  { period: '1949–1990s', title: '传统国防安全', accent: '#64748b',
    desc: '安全 ≈ 军事国防 + 政权安全。以「保家卫国」「备战备荒」为主轴，安全是边界与生存的物理防御概念。' },
  { period: '2000s', title: '非传统安全纳入', accent: '#22d3ee',
    desc: '经济、金融、能源、生态、公共卫生等非传统安全议题进入视野。SARS、金融危机推动安全外延扩展。' },
  { period: '2014', title: '总体国家安全观提出', accent: '#c41e3a',
    desc: '中央国安委成立，提出涵盖政治、国土、军事、经济、文化、社会、科技、网络、生态等多领域的「大安全」体系——以政治安全为根本、以人民安全为宗旨。' },
  { period: '2017–2021', title: '安全发展并重', accent: '#e8a317',
    desc: '「统筹发展和安全」写入治国理政主线，双循环、产业链备份、关键核心技术攻坚——安全从「成本」升格为「前提」。' },
  { period: '2022 →', title: '新安全格局', accent: '#10b981',
    desc: '以新安全格局保障新发展格局：底线思维 + 极限情景预案 + 全域冗余。安全与发展构成动态再平衡的双螺旋。' },
];

export default function Page() {
  const [domainKey, setDomainKey] = useState('tech');
  const [tIdx, setTIdx] = useState(2);
  const [pillarKey, setPillarKey] = useState('grain');

  const d = useMemo(() => DOMAINS.find((x) => x.key === domainKey) || DOMAINS[0], [domainKey]);

  const ratingLabel = (r) => ['—', '低', '中低', '中', '中高', '高'][r] || '中';
  const PILLARS = [
    { key: 'grain', label: '粮食', accent: '#10b981' },
    { key: 'energy', label: '能源', accent: '#e8a317' },
    { key: 'cyber', label: '网络', accent: '#22d3ee' },
    { key: 'chain', label: '供应链', accent: '#c41e3a' },
  ];

  return (
    <div>
      <PageHeader badge="Omni-Security · 总体国家安全观" title="大安全观 · 全域主权盾牌"
        subtitle="十一域一盘棋 · 统筹发展与安全 · 消灭不可控随机变量，构建极致生存确定性" />

      <IntroCard>
        总体国家安全观的本质是<strong style={{ color: 'var(--text-primary)' }}>把整个国家组织为一个高韧性闭环系统</strong>：以政治安全为根本，
        在经济、资源、科技、网络、生物、军事、社会等多域同步加固，以<strong style={{ color: 'var(--text-primary)' }}>底线思维</strong>预置极限情景的备份冗余。
        这不是单点防御，而是「大安全」的总体性——任一领域的随机变量都被纳入同一张风险账本统一统筹。安全是发展的前提，发展是安全的目的，二者构成动态再平衡的双螺旋。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="8+ 域" label="大安全覆盖领域 · 示意" accent="#c41e3a" />
        <Stat value="12+ 部" label="安全相关立法 · 示意" accent="#e8a317" />
        <Stat value="7 项" label="关键自主可控领域追踪" accent="#10b981" />
        <Stat value="安全 65" label="发展—安全指针权重 · 示意" accent="#22d3ee" />
      </Grid>

      {/* ── 1+2. 领域选择器 + 大安全全景 ── */}
      <Card title="交互 · 总体国家安全观「大安全」领域矩阵" className="mb-6">
        <SelectorBar items={DOMAINS} activeKey={domainKey} onSelect={setDomainKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${d.accent}` }}>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-base font-semibold" style={{ color: d.accent }}>{d.label}</span>
              <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.15)', color: d.accent }}>
                态势 {ratingLabel(d.rating)} · {d.rating}/5
              </span>
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <div><span className="text-xs mono" style={{ color: 'var(--china-red)' }}>核心威胁 ▸ </span><span style={{ color: 'var(--text-secondary)' }}>{d.threat}</span></div>
              <div><span className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>主防线 ▸ </span><span style={{ color: 'var(--text-secondary)' }}>{d.line}</span></div>
              <div><span className="text-xs mono" style={{ color: 'var(--fire-gold)' }}>当前抓手 ▸ </span><span style={{ color: 'var(--text-secondary)' }}>{d.grip}</span></div>
              <div className="pt-2 mt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>{d.note}</span>
              </div>
            </div>
          </div>
          <Card title="全域威胁紧张度雷达 · 示意"><EChart option={domainRadarOpt} style={{ height: 260 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="大安全全景 · 各域威胁热度（示意）"><EChart option={heatBarOpt()} style={{ height: 260 }} /></Card>

        {/* ── 3. 安全 vs 发展 张力轴 ── */}
        <Card title="统筹发展与安全 · 张力指针（示意）">
          <EChart option={tensionGaugeOpt(65)} style={{ height: 200 }} />
          <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
            指针位置为重心而非弃取：近年在「既要又要」的动态平衡中<strong style={{ color: 'var(--china-red)' }}>明显向安全侧上移</strong>——
            以新安全格局保障新发展格局。发展不停，但每一步发展都要先过安全冗余的压力测试。
          </p>
        </Card>
      </Grid>

      {/* ── 4. 风险传导网络 ── */}
      <Card title="风险传导链 · 外部脱钩如何穿透到社会面" className="mb-6">
        <div className="flex flex-wrap items-stretch gap-2">
          {CASCADE.map((c, i) => (
            <React.Fragment key={c.stage}>
              <div className="os-card p-3 flex-1" style={{ minWidth: 150, background: 'var(--bg-elevated)', borderTop: `3px solid ${c.accent}` }}>
                <div className="text-xs mono mb-1" style={{ color: c.accent }}>{`0${i + 1}`}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{c.stage}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c.detail}</div>
              </div>
              {i < CASCADE.length - 1 && <div className="flex items-center text-lg" style={{ color: 'var(--text-tertiary)' }}>▸</div>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>
          {'// 底线思维：在每个断点预置备份与冗余，切断传导链——这正是「自主可控」的物理意义。'}
        </p>
      </Card>

      {/* ── 5. 关键领域自主可控进度 ── */}
      <Card title="关键领域自主可控进度 · 已实现 vs 缺口（% · 示意）" className="mb-6">
        <EChart option={autonomyOpt} style={{ height: 280 }} />
        <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
          口粮接近绝对安全；能源以储备与转型对冲；<strong style={{ color: 'var(--china-red)' }}>高端芯片与工业软件是缺口最深的攻坚带</strong>。
          自主可控不是闭关，而是在极端断供情景下仍能维持系统运转的生存冗余。
        </p>
      </Card>

      {/* ── 6. 安全观演进时间线 ── */}
      <Card title="演进 · 从传统国防安全到新安全格局" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={tIdx} onSelect={setTIdx} />
      </Card>

      {/* ── 既有支柱图表（保留复用）── */}
      <Card title="交互 · 四大支柱图表联动" className="mb-6">
        <SelectorBar items={PILLARS} activeKey={pillarKey} onSelect={setPillarKey} />
        <Grid cols={2}>
          {pillarKey === 'grain' && <><Card title="粮食自给率结构（%）"><EChart option={grainChart()} style={{ height: 240 }} /></Card><Card title="全域冗余雷达"><EChart option={radarOpt(['粮食', '能源', '网络', '供应链', '金融', '认知'], [98, 85, 92, 78, 88, 90], { name: '全域冗余', color: '#10b981' })} style={{ height: 240 }} /></Card></>}
          {pillarKey === 'energy' && <><Card title="SPR 冗余天数演进"><EChart option={sprChart()} style={{ height: 240 }} /></Card><Card title="能源结构注解"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>SPR 扩容至 90+ 天，非化石装机突破 50%。<strong style={{ color: 'var(--fire-gold)' }}>「电代油」</strong>消解对马六甲海峡的过度依赖——把能源安全从海上通道博弈转化为国内可控的电力问题。</p></Card></>}
          {pillarKey === 'cyber' && <><Card title="攻击来源分布"><EChart option={cyberDonut()} style={{ height: 240 }} /></Card><Card title="语义防火墙 · 赛博反馈"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>跨境数据审查 + 根服务器副本 + 政务系统国产化，构成数字护城河。认知渗透与 APT 攻击在<strong style={{ color: 'var(--cyber-cyan)' }}>赛博反馈</strong>闭环中被持续迭代封堵。</p></Card></>}
          {pillarKey === 'chain' && <><Card title="供应链韧性雷达"><EChart option={radarOpt(['芯片', '材料', '装备', '软件', '物流', '金融'], [65, 72, 80, 58, 85, 75], { name: '供应链韧性', color: '#c41e3a' })} style={{ height: 240 }} /></Card><Card title="国产替代进度"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>关键节点备份 + 库存韧性 + 多源采购，确保极端制裁下 90 天+ 生存确定性。与半导体、关键材料模块形成交叉验证。</p></Card></>}
        </Grid>
      </Card>

      {/* ── 7. FrameworkTrio ── */}
      <FrameworkTrio cards={[
        { title: '总体性', subtitle: '大安全 · 一盘棋', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '11+ 领域不是并列清单，而是同一张风险账本：政治安全为根本，各域互为条件、协同加固。任一领域失守都会沿传导链冲击全局。',
          pillars: [['以政治安全为根本', '其余领域是其派生与支撑。'], ['多域协同', '跨域风险联防联控、统一统筹。'], ['人民安全为宗旨', '宏观安全在个体层面被验证。']] },
        { title: '底线思维', subtitle: '极限情景 · 备份冗余', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '从最坏处准备，向最好处努力。在每个关键断点预置备份与冗余，把不可控的尾部风险转化为可承受的工程问题。',
          pillars: [['极限推演', '假设最严断供与最坏冲突。'], ['备份冗余', '储备/产能/通道的多重保险。'], ['可承受', '宁可冗余成本，不留致命缺口。']] },
        { title: '统筹发展与安全', subtitle: '既要 · 又要 · 动态平衡', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '安全不是发展的对立面，而是发展的前提与质量约束。以新安全格局保障新发展格局，二者在张力中持续再平衡。',
          pillars: [['2014', '总体国家安全观确立。'], ['统筹', '发展每一步先过安全压力测试。'], ['双螺旋', '安全与发展互为目的与手段。']] },
      ]} />

      <Card title="调研结论 · 构建极致确定性">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          大安全观的战略目标是消灭一切不可控的随机变量：以政治安全为根本，在经济、资源、科技、网络、生物、军事、社会多域同步加固，
          用底线思维预置极限情景的备份冗余，把整个国家转化为高韧性闭环系统。安全与发展不是取舍，而是同一系统的两个相位——
          在动态再平衡中维持战略定力。
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>{'// TOTAL_SECURITY_VIEW: ENGAGED'}</span>
          <span>{'// SURVIVAL_REDUNDANCY: MAXIMIZED'}</span>
          <span>{'// DEV_SECURITY_BALANCE: DYNAMIC'}</span>
        </div>
      </Card>

      <ModuleFooter moduleId="omnisecurity"
        disclaimer="数据与评级均为示意值，仅供分析框架参考，非官方口径、非投资建议"
        sourceNote="由 china.html「大安全观」专题迁移升级 · 总体国家安全观分析框架" />
    </div>
  );
}
