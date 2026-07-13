import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据层（示意值 · 公开资料量级整理）
// ---------------------------------------------------------------------------

/** 交互① · 创新主体六元结构 */
const ACTORS = [
  {
    key: 'enterprise', label: '企业', accent: '#c41e3a',
    role: '研发执行的绝对主体 · 约 77.7% 的 R&D 经费在企业端花掉',
    share: '77.7%', shareLabel: 'R&D 执行占比',
    output: '试验开发、产品迭代、工艺改进——离市场最近，离源头最远。',
    pain: '结构性偏科：企业研发中基础研究占比不足 1%，跟随式开发居多；头部平台研发集中于应用层，源头创新外溢有限。',
    bars: [['试验开发', 84], ['应用研究', 13], ['基础研究', 3]],
  },
  {
    key: 'university', label: '高校', accent: '#22d3ee',
    role: '论文与人才的主产地 · 基础研究执行占比约一半',
    share: '~7.6%', shareLabel: 'R&D 执行占比',
    output: '高被引论文全球占比第一梯队、研究生供给的蓄水池。',
    pain: '评价体系重论文轻转化：高校发明专利产业化率仅约 3.9%，大量专利为职称与考核而生——「纸面专利」的主产区。',
    bars: [['基础研究', 41], ['应用研究', 49], ['试验开发', 10]],
  },
  {
    key: 'institute', label: '科研院所', accent: '#e8a317',
    role: '国家任务的承接者 · 大科学装置与战略方向的主力',
    share: '~12.4%', shareLabel: 'R&D 执行占比',
    output: '深空深海深地、核心元器件预研等国家目标导向产出。',
    pain: '转制遗留的定位摇摆：既要面向市场自负盈亏，又要承担公益性国家任务，激励机制在两套逻辑间撕扯。',
    bars: [['应用研究', 42], ['基础研究', 30], ['试验开发', 28]],
  },
  {
    key: 'natlab', label: '国家实验室', accent: '#a78bfa',
    role: '战略科技力量的塔尖 · 体系重组中的新枢纽',
    share: '重组中', shareLabel: '体系定位',
    output: '面向量子、AI、生命科学等方向的建制化大兵团作战。',
    pain: '与原有国家重点实验室体系的整合磨合期：编制、经费、考核三套体系并轨，组织成本不可低估。',
    bars: [['建制化攻关', 60], ['前沿探索', 28], ['平台开放', 12]],
  },
  {
    key: 'newrd', label: '新型研发机构', accent: '#10b981',
    role: '实验室与产线之间的「翻译层」 · 全国约 2400+ 家（示意）',
    share: '2400+', shareLabel: '机构数量（示意）',
    output: '中试、孵化、概念验证——专啃成果转化的死亡之谷。',
    pain: '可持续商业模式未定型：财政输血退坡后，多数机构尚未跑通「技术服务 + 持股孵化」的自我造血闭环。',
    bars: [['中试孵化', 46], ['技术服务', 34], ['自主研发', 20]],
  },
  {
    key: 'vc', label: '创投资本', accent: '#f472b6',
    role: '风险的定价者 · 从美元基金主导转向国资 LP 主导',
    share: '~70%', shareLabel: '国资背景 LP 占比（示意）',
    output: '硬科技赛道的早期筛选与资源配置信号。',
    pain: '退出通道收窄 + 国资容错机制缺位：风险偏好系统性下降，「投早投小投硬」的口号与尽责免责的现实之间存在落差。',
    bars: [['硬科技', 52], ['医疗生物', 22], ['消费及其他', 26]],
  },
];

/** 交互② · 重点领域（保留原有维度） */
const DOMAINS = [
  { key: 'ai', label: '人工智能', accent: '#22d3ee', desc: '大模型 · 智算 · 行业落地，自主可控度高但底层算力受限。' },
  { key: 'quantum', label: '量子信息', accent: '#c41e3a', desc: '九章 · 祖冲之 · 保密通信，国际第一梯队。' },
  { key: 'space', label: '航天', accent: '#e8a317', desc: '北斗全球组网、空间站常态化运营、深空探测。' },
  { key: 'energy', label: '能源', accent: '#10b981', desc: '新能源装机与核电技术形成规模优势，支撑双碳路径。' },
];

/** 交互③ · 体系演进时间线（五阶段） */
const PHASES = [
  { period: '1995–2005', title: '科教兴国', accent: '#64748b', desc: '科学技术是第一生产力的制度化表达；863/973 计划框架成型，R&D 强度从不足 0.6% 起步爬坡。' },
  { period: '2006–2012', title: '自主创新 · 中长期规划', accent: '#22d3ee', desc: '《国家中长期科技发展规划纲要(2006–2020)》锚定 16 个重大专项；「引进消化吸收再创新」成为主路径。' },
  { period: '2012–2017', title: '创新驱动发展战略', accent: '#10b981', desc: '创新被置于发展全局核心；高企认定、双创、科技成果转化法修订——制度供给密集落地。' },
  { period: '2018–2022', title: '科技自立自强', accent: '#e8a317', desc: '外部断供倒逼内生路线：卡脖子清单、揭榜挂帅、科创板硬科技定位——从开放协作叙事转向安全叙事。' },
  { period: '2023–', title: '新型举国体制 2.0', accent: '#c41e3a', desc: '中央科技委统筹 + 教育科技人才一体化部署；有为政府与有效市场的组合拳，效率与试错容忍度待观察。' },
];

const RD_YEARS = ['2012', '2014', '2016', '2018', '2020', '2022', '2024'];
const RD_TOTAL = [10298, 13016, 15677, 19678, 24393, 30783, 36130];   // 亿元
const RD_INTENSITY = [1.91, 2.02, 2.10, 2.14, 2.41, 2.55, 2.69];      // %GDP

const HTE_YEARS = ['2016', '2018', '2020', '2022', '2024'];

export default function Page() {
  const [actorKey, setActorKey] = useState('enterprise');
  const [domain, setDomain] = useState('ai');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const actor = ACTORS.find((a) => a.key === actorKey) || ACTORS[0];
  const d = DOMAINS.find((x) => x.key === domain) || DOMAINS[0];

  // -------------------------------------------------------------------------
  // 交互① · 主体相关图表
  // -------------------------------------------------------------------------

  /** R&D 执行结构 donut（全局结构，不随选择切换，作为参照系） */
  const execDonut = useMemo(() => donutOpt([
    { value: 77.7, name: '企业', itemStyle: { color: '#c41e3a' } },
    { value: 12.4, name: '科研院所', itemStyle: { color: '#e8a317' } },
    { value: 7.6, name: '高校', itemStyle: { color: '#22d3ee' } },
    { value: 2.3, name: '其他', itemStyle: { color: '#64748b' } },
  ]), []);

  /** 选中主体的活动结构横向 bar */
  const actorBar = useMemo(() => ({
    grid: { left: 88, right: 48, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(actor.bars.map(([n]) => n).reverse()),
    series: [{
      type: 'bar', barWidth: 18,
      data: actor.bars.map(([, v]) => v).reverse().map((v) => ({ value: v, itemStyle: { color: actor.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
    }],
  }), [actor]);

  // -------------------------------------------------------------------------
  // 交互② · 领域相关图表（保留并增强）
  // -------------------------------------------------------------------------

  /** R&D 投入全景：总量 + 强度双轴（全球第二的投入体量） */
  const rdTrend = useMemo(() => ({
    grid: { left: 56, right: 44, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 }, data: ['R&D 经费 (亿元)', 'R&D 强度 (%GDP)'] },
    xAxis: categoryX(RD_YEARS),
    yAxis: [valueY({ name: '亿元' }), valueY({ name: '%', min: 1.5, max: 3, splitLine: { show: false } })],
    series: [
      { name: 'R&D 经费 (亿元)', type: 'bar', barWidth: 16, data: RD_TOTAL, itemStyle: { color: d.accent, borderRadius: [3, 3, 0, 0], opacity: 0.85 } },
      { name: 'R&D 强度 (%GDP)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: RD_INTENSITY, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    ],
  }), [d]);

  /** 投入结构指标（随领域微调，保留原图） */
  const structureBar = useMemo(() => ({
    grid: { left: 100, right: 48, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(['企业主体', '基础研究', '高企占比', '民营高企']),
    series: [{
      type: 'bar', barWidth: 16,
      data: [77.7, 6.9, 90, domain === 'ai' ? 88 : 85].map((v) => ({ value: v, itemStyle: { color: d.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
    }],
  }), [domain, d]);

  // -------------------------------------------------------------------------
  // 全局图表（不随选择器切换）
  // -------------------------------------------------------------------------

  /** 投入结构国际对比：中美日德韩 R&D 强度 + 基础研究占比 */
  const intlBar = useMemo(() => ({
    grid: { ...GRID, top: 30 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 } },
    xAxis: categoryX(['中国', '美国', '日本', '德国', '韩国']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: 'R&D 强度 (%GDP)', type: 'bar', barWidth: 18, data: [2.69, 3.59, 3.41, 3.13, 4.96], itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
      { name: '基础研究占比 (%)', type: 'bar', barWidth: 18, data: [6.9, 15.2, 12.6, 17.1, 14.8], itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  /** 创新产出三联：PCT / 高被引论文占比 / 独角兽 */
  const outputBar = useMemo(() => ({
    grid: { left: 48, right: 48, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 } },
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2024']),
    yAxis: [valueY({ name: '千件 / 家' }), valueY({ name: '%', max: 40, splitLine: { show: false } })],
    series: [
      { name: 'PCT 专利 (千件)', type: 'bar', barWidth: 14, data: [43, 53, 69, 70, 70], itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
      { name: '独角兽 (家)', type: 'bar', barWidth: 14, data: [131, 205, 251, 312, 369], itemStyle: { color: '#e8a317', borderRadius: [3, 3, 0, 0], opacity: 0.85 } },
      { name: '高被引论文全球占比 (%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: [12.8, 17.0, 24.8, 27.3, 33.8], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  /** 创新体系效能雷达 · 中国 vs 创新强国均值（双系列 · 自写内联 option） */
  const effRadar = useMemo(() => ({
    tooltip: {},
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 11 } },
    radar: {
      indicator: ['投入强度', '产出质量', '转化效率', '企业主体性', '人才储备', '开放合作'].map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
      radius: '62%',
    },
    series: [{
      type: 'radar',
      data: [
        { value: [74, 70, 48, 86, 82, 52], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' } },
        { value: [88, 90, 80, 78, 76, 84], name: '创新强国均值', lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.10)' } },
      ],
    }],
  }), []);

  /** 领域自主可控雷达（单系列 · radarOpt，随领域切换） */
  const domainRadar = useMemo(() => radarOpt(
    ['研发投入', '人才与论文', '基础设施', '原始创新', '产业转化'],
    domain === 'ai' ? [88, 92, 95, 70, 90]
      : domain === 'quantum' ? [85, 90, 86, 80, 58]
      : domain === 'space' ? [86, 84, 92, 78, 74]
      : [90, 80, 94, 72, 92],
    { name: d.label, color: d.accent },
  ), [domain, d]);

  /** 科技成果转化漏斗：专利→转化→产业化的折损链 */
  const FUNNEL = [
    ['发明专利申请', 100, '#22d3ee'],
    ['获得授权', 55, '#10b981'],
    ['有效维持 (>5年)', 38, '#e8a317'],
    ['实施 / 许可转让', 22, '#f472b6'],
    ['形成产业化收入', 9, '#c41e3a'],
  ];
  const funnelBar = useMemo(() => ({
    grid: { left: 120, right: 56, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}' } }),
    yAxis: categoryX(FUNNEL.map(([n]) => n).reverse()),
    series: [{
      type: 'bar', barWidth: 18,
      data: FUNNEL.map(([, v, c]) => ({ value: v, itemStyle: { color: c, borderRadius: 3, opacity: 0.9 } })).reverse(),
      label: { show: true, position: 'right', formatter: '{c} / 100', color: LABEL.color, fontSize: 10 },
    }],
  }), []);

  /** 高新技术企业梯队趋势（高企 / 专精特新小巨人 / 独角兽 · logY 跨三个量级） */
  const hteTrend = useMemo(() => ({
    grid: { left: 56, right: 24, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 } },
    xAxis: categoryX(HTE_YEARS),
    yAxis: logY({ name: '家 (log)' }),
    series: [
      { name: '高新技术企业 (万家)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [10.4, 18.1, 27.5, 40.0, 46.3], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' } },
      { name: '专精特新小巨人 (千家)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [0.2, 0.8, 2.0, 9.0, 14.6], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
      { name: '独角兽 (百家)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [1.3, 2.1, 2.5, 3.1, 3.7], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  /** R&D 活动类型结构演变（stackedBar：基础 / 应用 / 试验开发） */
  const rdTypeStack = useMemo(() => stackedBarOpt({
    categories: ['2015', '2018', '2021', '2024'],
    series: [
      { name: '基础研究', data: [5.1, 5.5, 6.5, 6.9], itemStyle: { color: '#c41e3a' } },
      { name: '应用研究', data: [10.8, 11.1, 11.3, 11.1], itemStyle: { color: '#e8a317' } },
      { name: '试验开发', data: [84.1, 83.4, 82.2, 82.0], itemStyle: { color: '#334155' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Tech Policy · 科技自立自强" title="国家创新体系 · R&D 与高企" subtitle="研发强度 · 创新主体 · 成果转化 · 高新技术企业梯队" />
      <IntroCard>
        2024 年全国 R&D 经费约 <strong style={{ color: 'var(--text-primary)' }}>3.6 万亿元</strong>（全球第二），强度约 2.69%。
        体系的悖论在于：投入与产出的「量」均已世界级，而基础研究占比 6.9%、专利产业化折损率约九成——
        这是一台<strong style={{ color: 'var(--text-primary)' }}>规模巨大、转化链条仍在折损</strong>的创新机器。本页拆解六类主体、投入结构、产出质量与转化漏斗。
      </IntroCard>

      {/* 概览 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="3.6 万亿" label="R&D 经费 (2024 · 全球第二)" accent="#c41e3a" />
        <Stat value="2.69%" label="R&D 强度 (占 GDP)" accent="#22d3ee" />
        <Stat value="~7.0 万件" label="PCT 国际专利 (全球第一)" accent="#e8a317" />
        <Stat value="46 万+ 家" label="高新技术企业" accent="#10b981" />
      </Grid>

      {/* 交互① 创新主体选择器 */}
      <Card title="交互① · 创新主体选择器 — 谁在花钱，谁在产出，谁在卡壳" className="mb-6">
        <SelectorBar items={ACTORS} activeKey={actorKey} onSelect={setActorKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${actor.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-base font-semibold" style={{ color: actor.accent }}>{actor.label}</span>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{actor.shareLabel} · {actor.share}</span>
          </div>
          <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>{actor.role}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>产出：</strong>{actor.output}</p>
        </div>
        <div className="os-card p-4 mb-4" style={{ background: 'rgba(196,30,58,0.06)', borderLeft: '3px solid var(--china-red)' }}>
          <div className="text-xs font-semibold mb-1 mono" style={{ color: 'var(--china-red)' }}>结构性痛点</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{actor.pain}</p>
        </div>
        <Grid cols={2}>
          <Card title={`${actor.label} · 活动结构（示意 %）`}><EChart option={actorBar} style={{ height: 220 }} /></Card>
          <Card title="参照系 · 全国 R&D 执行结构（2024 示意）"><EChart option={execDonut} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      {/* R&D 投入全景 + 国际对比 */}
      <Grid cols={2} className="mb-6">
        <Card title="R&D 投入全景 · 总量 × 强度 (2012–2024)"><EChart option={rdTrend} style={{ height: 260 }} /></Card>
        <Card title="国际对比 · R&D 强度与基础研究占比（示意）"><EChart option={intlBar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* 投入活动类型结构 + 创新产出 */}
      <Grid cols={2} className="mb-6">
        <Card title="R&D 活动类型结构演变 · 试验开发恒占八成 (%)"><EChart option={rdTypeStack} style={{ height: 260 }} /></Card>
        <Card title="创新产出 · PCT / 独角兽 / 高被引论文占比"><EChart option={outputBar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* 转化漏斗 */}
      <Card title="科技成果转化漏斗 · 从纸面到产线的折损链（每 100 件申请 · 示意）" className="mb-6">
        <Grid cols={2}>
          <EChart option={funnelBar} style={{ height: 240 }} />
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              「纸面专利」之困：考核驱动的申请冲动制造了全球最大的专利存量，
              但高校发明专利产业化率仅约 <strong style={{ color: 'var(--china-red)' }}>3.9%</strong>，
              全链条看，每百件申请最终形成产业化收入的不足一成。
            </p>
            <Grid cols={2}>
              {[['死亡之谷 ①', '实验室样品 → 工程样机：中试资金与场地缺口，财政与风投都不愿接。'],
                ['死亡之谷 ②', '样机 → 商品：首台套不敢用、采购方风险厌恶，市场验证迟迟无法闭环。'],
                ['制度修补', '职务科技成果赋权改革、先使用后付费、概念验证中心——补丁逐个上线。'],
                ['未解之问', '考核指挥棒不改，存量专利只会继续膨胀而非继续转化。']].map(([t, txt]) => (
                <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>{t}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{txt}</p>
                </div>
              ))}
            </Grid>
          </div>
        </Grid>
      </Card>

      {/* 高企梯队 + 体系效能雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="高新技术企业梯队 · 高企 / 小巨人 / 独角兽（对数轴）"><EChart option={hteTrend} style={{ height: 280 }} /></Card>
        <Card title="创新体系效能雷达 · 中国 vs 创新强国均值（示意）"><EChart option={effRadar} style={{ height: 280 }} /></Card>
      </Grid>

      {/* 交互② 重点领域选择器 */}
      <Card title="交互② · 重点领域透视 — 同一台机器在不同赛道的成色" className="mb-6">
        <SelectorBar items={DOMAINS} activeKey={domain} onSelect={setDomain} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${d.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="投入结构指标（随领域切换）"><EChart option={structureBar} style={{ height: 240 }} /></Card>
          <Card title={`${d.label} · 五维成色雷达（示意）`}><EChart option={domainRadar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* 交互③ 体系演进时间线 */}
      <Card title="交互③ · 创新体系演进时间线 — 从科教兴国到举国体制 2.0" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* 三框架 */}
      <FrameworkTrio cards={[
        {
          title: '企业主体', subtitle: '3/4 的钱在企业',
          body: '研发投入约四分之三在企业端的结构转变已完成，但「执行主体」不等于「创新主体」——企业研发中基础研究不足 1%，离源头创新仍有一代人的距离。',
          pillars: [['77.7%', 'R&D 执行占比。'], ['<1%', '企业内基础研究占比。'], ['转型', '从跟随开发到源头创新。']],
        },
        {
          title: '转化之困', subtitle: '死亡之谷',
          body: '实验室与产线之间横亘着中试与市场验证两道死亡之谷：财政不愿养、风投不敢接、采购方不敢用——制度补丁密集，但考核指挥棒尚未根本调向。',
          pillars: [['3.9%', '高校专利产业化率。'], ['<10%', '申请到产业化的全链留存。'], ['新型研发机构', '翻译层尚未自我造血。']],
        },
        {
          title: '举国体制 2.0', subtitle: '有为政府 + 有效市场',
          body: '中央科技委统筹、教育科技人才一体化、揭榜挂帅与创投引导基金并用——组合拳的赌注在于：行政动员的速度优势能否覆盖资源错配与试错容忍度下降的成本。',
          pillars: [['统筹', '中央科技委 + 国家实验室体系。'], ['一体化', '教育 · 科技 · 人才同卷部署。'], ['代价', '风险偏好下降的隐性税。']],
        },
      ]} />

      {/* 研判要点 */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 结构变量', '基础研究占比能否在 2030 前向两位数爬坡——这是原始创新短板能否补上的唯一先行指标。'],
            ['2 · 转化变量', '专利产业化折损率的收窄速度，比专利申请量的增长速度更值得盯。'],
            ['3 · 资本变量', '国资 LP 主导下创投风险偏好的系统性下降，是体系中最被低估的暗变量。'],
            ['4 · 主体变量', '企业从跟随式开发转向源头式创新，需要的不是补贴而是竞争与产权预期。'],
            ['5 · 组织变量', '国家实验室体系重组的磨合成本与产出周期，2027 前后见分晓。'],
            ['6 · 叙事变量', '2035 科技强国目标最终以「规模」还是「能力」交卷，决定整套体系的评分标准。']].map(([t, txt]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{txt}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="tech" disclaimer="数值为公开资料量级整理之示意，非官方统计 · 仅供分析框架参考" sourceNote="由 china.html「科技与创新」专题迁移扩容" />
    </div>
  );
}
