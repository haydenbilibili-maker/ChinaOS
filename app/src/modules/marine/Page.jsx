import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 海洋产业七支柱：规模 / 全球地位 / 卡位与痛点 ──────────────────────
const SECTORS = [
  {
    key: 'fish', label: '渔 · 海洋渔业', accent: '#22d3ee', gopShare: 18, scale: '~1.5 万亿',
    rank: '产量全球第一 · 远洋船队规模第一',
    grip: '远洋捕捞与海水养殖规模全球第一，深蓝渔业牧场化、远洋基地（如西非、南太）持续扩张。运力即存在，渔船亦是蓝海前沿的民用触角。',
    pain: '近海资源枯竭、配额与公海治理博弈、远洋后勤补给点稀缺，渔权摩擦常态化。',
  },
  {
    key: 'oilgas', label: '油 · 海洋油气', accent: '#e8a317', gopShare: 9, scale: '~0.8 万亿',
    rank: '浅海成熟 · 深水装备追赶中',
    grip: '渤海、南海北部稳产，"深海一号"等深水气田投产标志超深水自主开发能力。油气是能源压舱石中最受通道与争议海域制约的一环。',
    pain: '南海争议海域油气难以单边开发、深水钻采高端装备与软件仍部分受制，边际成本高于陆上。',
  },
  {
    key: 'engi', label: '工 · 海洋工程装备', accent: '#8b5cf6', gopShare: 8, scale: '~0.7 万亿',
    rank: '产能全球前列 · 高端设计待突破',
    grip: '自升式/半潜式平台、FPSO、铺管船等总装产能居前，承接大量海外订单。海工装备是造船工业母机向深海能源主权的延伸。',
    pain: '高端设计、动力定位、水下生产系统（SPS）核心模块依赖进口，订单周期受油价剧烈摆动。',
  },
  {
    key: 'ship', label: '船 · 造船', accent: '#c41e3a', gopShare: 16, scale: '~1.3 万亿',
    rank: '三大指标全球第一 · 完工 50%+',
    grip: '造船完工 50.2% / 新接 66.6% / 手持 55.0% 全面领先，LNG 船等高附加值船型国产化突破。造船能力 = 运力主权与军民两用工业母机。',
    pain: '主机、曲轴、高端配套与船舶设计软件部分受制，利润率受钢价与汇率挤压，高端船型与韩国仍有缠斗。',
  },
  {
    key: 'port', label: '港 · 港口航运', accent: '#10b981', gopShare: 17, scale: '~1.4 万亿',
    rank: '吞吐与集装箱全球第一',
    grip: '全球前十大港口中国占七席，集装箱吞吐量约占全球三成。港口是贸易生命线的物理锚点，海外港口布局延伸为通道节点。',
    pain: '海外枢纽港受地缘审查（"债务陷阱"叙事），航运公司在国际班轮联盟中议价权仍弱于马士基等巨头。',
  },
  {
    key: 'tour', label: '游 · 海洋旅游', accent: '#f472b6', gopShare: 17, scale: '~1.4 万亿',
    rank: '增加值占比最高板块之一',
    grip: '滨海与邮轮旅游为海洋经济第一大增加值来源，首艘国产大型邮轮"爱达·魔都号"交付补齐高端制造短板。',
    pain: '高度依赖宏观消费景气与客流，邮轮产业链上游设计运营仍在学习曲线早期。',
  },
  {
    key: 'newq', label: '新 · 海洋新兴', accent: '#38bdf8', gopShare: 15, scale: '~1.2 万亿',
    rank: '海上风电装机全球第一',
    grip: '海上风电累计与新增装机居全球前列，海洋生物医药、海水淡化、波浪能等新赛道并进，对接双碳与能源安全双目标。',
    pain: '深远海漂浮式风电、生物医药转化率与商业化仍处早期，补贴退坡后经济性承压。',
  },
];

// ── 海洋经济规模趋势（GOP 与占全国 GDP 比重）──────────────────────────
const gopTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2012', '2015', '2018', '2020', '2022', '2023', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万亿' } }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [5.0, 6.5, 8.3, 8.0, 9.5, 9.9, 10.5],
    lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.12)' },
  }],
};

// 海洋 GDP 占全国 GDP 比重（%，示意）
const gopShareTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  xAxis: categoryX(['2012', '2015', '2018', '2020', '2022', '2023', '2024']),
  yAxis: valueY({ min: 7, max: 10, axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [9.3, 9.4, 9.3, 7.9, 7.8, 7.9, 7.8],
    lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.10)' },
  }],
};

// ── 造船全球份额：中日韩三国三大指标堆叠对比 ─────────────────────────
const shipCompare = {
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${v}%` },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  xAxis: categoryX(['造船完工量', '新接订单量', '手持订单量']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '中国', type: 'bar', data: [50.2, 66.6, 55.0], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '韩国', type: 'bar', data: [28.5, 25.5, 31.0], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '日本', type: 'bar', data: [15.0, 6.0, 12.0], barWidth: 16, itemStyle: { color: '#e8a317', borderRadius: 3 } },
  ],
};

// 造船份额历史跃迁（中国完工量全球份额逐年，logY 突出指数式追赶）
const shipRiseTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2023']),
  yAxis: logY({ axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [4, 13, 38, 41, 43, 50.2],
    lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.10)' },
  }],
};

// ── 海洋经济结构 donut（各产业增加值占比，与 SECTORS 对齐）──────────────
const structurePie = donutOpt(
  SECTORS.map((s) => ({ value: s.gopShare, name: s.label.split(' · ')[1] || s.label, itemStyle: { color: s.accent } })),
);

// ── 海权综合实力雷达：中国 vs 美国 ──────────────────────────────────
const seaPowerRadar = {
  radar: {
    indicator: [
      { name: '商船队运力', max: 100 }, { name: '造船产能', max: 100 },
      { name: '远洋渔业', max: 100 }, { name: '海工装备', max: 100 },
      { name: '港口枢纽', max: 100 }, { name: '海军投送', max: 100 },
    ],
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'radar',
    data: [
      { value: [88, 96, 95, 80, 98, 62], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
      { value: [55, 12, 50, 90, 70, 100], name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } },
    ],
  }],
};

// 深蓝产业能力雷达（保留原图）
const deepSeaRadar = radarOpt(['深潜技术', 'ROV/AUV', '海洋观测', '钻探开采', '深海生物', '装备制造'], [98, 85, 92, 78, 88, 95], { name: '深蓝产业能力', color: '#22d3ee' });

// ── 海洋战略阶段时间线 ──────────────────────────────────────────────
const STAGES = [
  { period: '1949–1980', title: '陆权为主', accent: '#6b7280', desc: '大陆国家路径依赖，海军定位"近岸防御"，海洋经济以近海渔业为主，海权意识与远洋能力近乎空白。' },
  { period: '1980s–2000s', title: '近海防御', accent: '#22d3ee', desc: '"近海防御"战略成型，第一岛链内防御纵深建设，造船业承接全球产业转移、开始规模化，海洋油气浅海起步。' },
  { period: '2012–2017', title: '海洋强国战略', accent: '#e8a317', desc: '十八大提出"建设海洋强国"，GOP 跃升，造船全球第一巩固，岛礁建设与南海存在强化，海权从口号转为体系工程。' },
  { period: '2017–2022', title: '远海护卫 · 双航母', accent: '#c41e3a', desc: '"近海防御 + 远海护卫"双重战略，双航母成军、055 大驱列装、亚丁湾常态护航，运力与投送能力同步抬升。' },
  { period: '2022–', title: '深蓝存在', accent: '#8b5cf6', desc: '三航母、深远海风电、深水油气、国产大型邮轮齐头并进，从"造得出"走向"控得住通道、占得住深蓝"。' },
];

export default function Page() {
  const [sectorKey, setSectorKey] = useState('ship');
  const [stageIdx, setStageIdx] = useState(2);
  const sector = useMemo(() => SECTORS.find((s) => s.key === sectorKey) || SECTORS[3], [sectorKey]);

  // 选中产业高亮的结构环（其它产业半透明）
  const sectorPie = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie', radius: ['44%', '68%'], center: ['50%', '50%'],
      label: { show: false },
      data: SECTORS.map((s) => ({
        value: s.gopShare,
        name: s.label.split(' · ')[1] || s.label,
        itemStyle: { color: s.key === sectorKey ? s.accent : `${s.accent}44` },
      })),
    }],
  }), [sectorKey]);

  return (
    <div>
      <PageHeader badge="Marine Economy · 海权" title="海权与深蓝 · 海洋经济" subtitle="GOP · 造船 · EEZ · 海军前沿存在 · 岛链突破 · 通道护卫" />
      <IntroCard>
        中国主张约 <strong style={{ color: 'var(--text-primary)' }}>300 万平方公里</strong>管辖海域。海洋经济从来不是单纯的 GDP 板块——它是海权的物理载体：
        造船能力即<strong style={{ color: 'var(--text-primary)' }}>运力主权</strong>，港口与商船队即贸易生命线，深蓝技术即资源开发权。
        一个大陆国家正系统性地把自己改写为海洋国家，与台海、海外资源模块共同构成海权三角。下方为公开资料整理的示意框架。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~10.5 万亿" label="海洋生产总值 GOP（2024 示意）" accent="#22d3ee" />
        <Stat value="50.2%" label="造船完工量全球份额" accent="#c41e3a" />
        <Stat value="170 亿吨" label="港口货物吞吐 · 全球第一" accent="#10b981" />
        <Stat value="~7.8%" label="海洋 GDP 占全国 GDP" accent="#e8a317" />
      </Grid>

      {/* 1 · 海洋产业选择器 */}
      <Card title="交互 · 海洋产业七支柱 — 规模 / 全球地位 / 卡位与痛点" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <EChart option={sectorPie} style={{ height: 240 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-base font-semibold" style={{ color: sector.accent }}>{sector.label}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>增加值 {sector.scale} · 占比 {sector.gopShare}%</span>
            </div>
            <div className="text-xs mono mb-2" style={{ color: 'var(--cyber-cyan)' }}>全球地位 · {sector.rank}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.grip}</p>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>痛点 · 卡位</div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{sector.pain}</p>
          </div>
        </Grid>
      </Card>

      {/* 2 · 造船全球份额 + 历史跃迁 */}
      <Grid cols={2} className="mb-6">
        <Card title="造船三大指标 · 中日韩全球份额（2023 · %）">
          <EChart option={shipCompare} style={{ height: 250 }} />
          <p className="text-[12px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            三大指标全面过半，新接订单逼近七成——新接份额预示未来产能锁定，中国把全球商船建造的"增量定价权"收入囊中。
          </p>
        </Card>
        <Card title="中国造船完工量全球份额 · 指数式追赶（logY · %）">
          <EChart option={shipRiseTrend} style={{ height: 250 }} />
          <p className="text-[12px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            从 2000 年 4% 到 2023 年逾 50%，二十余年完成对日韩的全面超越。造船是军民两用工业母机：商船产能即海军舰艇的隐性储备产能。
          </p>
        </Card>
      </Grid>

      {/* 3 · 结构 donut + 4 · 规模与占比趋势 */}
      <Grid cols={2} className="mb-6">
        <Card title="海洋经济结构 · 各产业增加值占比（示意）">
          <EChart option={structurePie} style={{ height: 260 }} />
        </Card>
        <Card title="海洋生产总值 GOP 趋势 · 万亿元">
          <EChart option={gopTrend} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="海洋 GDP 占全国 GDP 比重 · %（示意）">
          <EChart option={gopShareTrend} style={{ height: 240 }} />
          <p className="text-[12px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            占比长期徘徊在 8% 上下：海洋经济绝对规模高速扩张，但相对内陆经济的份额并未显著抬升——海权的价值不在 GDP 权重，而在不可替代的通道与战略冗余。
          </p>
        </Card>
        <Card title="海权综合实力雷达 · 中国 vs 美国（示意）">
          <EChart option={seaPowerRadar} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="深蓝产业能力雷达">
          <EChart option={deepSeaRadar} style={{ height: 260 }} />
        </Card>
        <Card title="通道安全 · 马六甲困局与蓝碳">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            约八成原油进口经马六甲海峡入境——"马六甲困局"是海权叙事的核心焦虑。中缅油气管道、瓜达尔港、北极航道为通道备份，
            海军前沿存在与亚丁湾常态护航则是"控得住"的硬支撑。蓝碳（红树林、海草床、盐沼）纳入双碳与生态补偿，固碳评估起步。
          </p>
          <Grid cols={2}>
            <Stat value="~80%" label="原油进口经马六甲" accent="#c41e3a" />
            <Stat value="备份 3" label="陆桥 / 港口 / 北极航道" accent="#22d3ee" />
            <Stat value="护航 16y+" label="亚丁湾常态护航" accent="#e8a317" />
            <Stat value="蓝碳 85" label="生态监测指数 · 示意" accent="#10b981" />
          </Grid>
        </Card>
      </Grid>

      {/* 6 · 海洋战略时间线 */}
      <Card title="海洋战略演进 · 从陆权为主到深蓝存在" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* 7 · 三框架 */}
      <FrameworkTrio cards={[
        {
          title: '陆海权转向', subtitle: '从大陆国家到海洋国家', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '历史上的大陆国家正主动改写地缘基因：海军从近岸防御走向远海护卫，海洋经济从近海渔业走向深蓝勘探，海权意识从边缘补充变为国家战略主线。',
          pillars: [['路径依赖', '陆权惯性与漫长海岸线张力。'], ['战略主线', '海洋强国写入顶层设计。'], ['投送能力', '双/三航母与 055 列装。']],
        },
        {
          title: '造船工业母机', subtitle: '军民两用底盘', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '造船是工业母机级别的能力底盘：完工量全球过半意味着商船产能可在战时转化为舰艇产能。运力主权与海军隐性产能储备由同一套船坞、配套与工人撑起。',
          pillars: [['完工 50%+', '三大指标全球第一。'], ['军民两用', '船坞产能可转化。'], ['高端缠斗', 'LNG/邮轮补短板。']],
        },
        {
          title: '通道安全', subtitle: '马六甲困局与航道护卫', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '通道即生命线：八成石油经马六甲，海运承载绝大部分外贸。破解之道是"备份 + 护卫"双轨——陆桥/北极航道分流通道风险，远洋护航与海外保障点提供硬存在。',
          pillars: [['马六甲', '能源贸易咽喉要冲。'], ['通道备份', '中缅管道 · 北极航道。'], ['远洋护卫', '亚丁湾 · 海外保障点。']],
        },
      ]} />

      <ModuleFooter moduleId="marine" disclaimer="公开资料整理，规模/份额/雷达均为示意，非官方数据 · 仅供分析框架参考" sourceNote="由 china.html「海洋经济」专题迁移升级" />
    </div>
  );
}
