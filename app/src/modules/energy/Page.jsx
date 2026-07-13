import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 能源品种档案 ─────────────────────────────────────────────
const FUELS = [
  {
    key: 'coal', label: '煤炭', accent: '#64748b',
    share: 52, dep: 8, grade: 'A · 自主可控', stance: '压舱石 · 调节电源',
    line: '煤炭是中国能源安全的最终兜底。储采比充裕、本土自产，但单位热值碳排最高——它的使命正从「主力电源」让位为「应急调峰 + 保供托底」。',
    choke: '高效清洁燃烧、CCUS 成本、煤电灵活性改造跟不上风光波动节奏。',
    radar: [98, 85, 95, 70, 40], // 供给/价格/通道/储备/清洁
  },
  {
    key: 'oil', label: '石油', accent: '#c41e3a',
    share: 18, dep: 72, grade: 'D · 高危敞口', stance: '战略软肋 · 通道依赖',
    line: '原油对外依存 ~72%，是能源版图上最深的伤口。八成进口原油须穿越马六甲海峡——一条可被掐断的生命线，构成最现实的地缘勒索点。',
    choke: '马六甲海峡咽喉、海上运输线无远洋护航纵深、炼化高端料仍部分依赖进口。',
    radar: [30, 45, 25, 60, 55],
  },
  {
    key: 'gas', label: '天然气', accent: '#22d3ee',
    share: 9, dep: 42, grade: 'C · 中度敞口', stance: '过渡能源 · 多元进口',
    line: '天然气对外依存 ~42%，管道气（中亚/中俄）与 LNG（海运）并行。它是「煤退」与「绿进」之间的桥梁燃料，调峰价值高但仍受国际气价与航道挟制。',
    choke: 'LNG 海运同样过马六甲、储气库工作气量不足、冬季保供峰谷调节能力弱。',
    radar: [55, 40, 50, 45, 70],
  },
  {
    key: 'nuclear', label: '核电', accent: '#8b5cf6',
    share: 5, dep: 12, grade: 'B · 自主升级', stance: '稳定基荷 · 技术换道',
    line: '华龙一号实现三代核电自主化，沿海基荷电源稳定输出，与风光随机性形成「源网荷储」互补。铀资源部分进口，但储备 + 海外权益布局已对冲断供风险。',
    choke: '天然铀对外依存、内陆核电选址受限、四代/小堆商业化尚早。',
    radar: [80, 88, 75, 65, 95],
  },
  {
    key: 'hydro', label: '水电', accent: '#10b981',
    share: 8, dep: 0, grade: 'A · 完全自主', stance: '清洁基荷 · 资源见顶',
    line: '水电是规模最大的成熟可再生能源，完全本土、零进口。但优质坝址趋于开发殆尽，增量空间有限，且枯水年出力波动直接冲击西南电网与西电东送。',
    choke: '优质资源见顶、枯水年出力骤降、生态/移民约束趋严。',
    radar: [85, 95, 90, 50, 98],
  },
  {
    key: 'renew', label: '风光', accent: '#fb923c',
    share: 18.5, dep: 5, grade: 'A · 装备自主', stance: '增量主力 · 饱和扩张',
    line: '风电光伏是「换道超车」的物理方案：本土气候资源 + 全球第一的装备制造，把能源生产从进口化石燃料转向本土阳光与风。短板是随机性、消纳与配储成本。',
    choke: '出力随机性、消纳/弃风弃光、关键矿料（部分多晶硅辅料）与配储经济性。',
    radar: [70, 92, 95, 35, 100],
  },
  {
    key: 'storage', label: '储能氢能', accent: '#e8a317',
    share: 1.5, dep: 10, grade: 'B · 前沿攻坚', stance: '系统稳定器 · 长时调节',
    line: '储能与绿氢是新型电力系统的「缓冲层」：把波动的风光「削峰填谷」，解决可再生能源不可调度的根本矛盾。当前以锂电短时储能为主，长时储能与绿氢仍在成本爬坡。',
    choke: '长时储能技术路线未定、电池金属资源、绿氢制储运全链成本高。',
    radar: [60, 50, 90, 40, 95],
  },
];

const RADAR_DIMS = ['供给保障', '价格可控', '通道安全', '储备纵深', '清洁低碳'];

// ── 能源结构演进（堆叠图）──────────────────────────────────────
const mixEvolution = stackedBarOpt({
  categories: ['2010', '2015', '2020', '2025E', '2030E'],
  series: [
    { name: '煤炭', data: [69, 64, 57, 52, 44], itemStyle: { color: '#64748b' } },
    { name: '石油', data: [17, 18, 19, 18, 16], itemStyle: { color: '#c41e3a' } },
    { name: '天然气', data: [4, 6, 8, 9, 12], itemStyle: { color: '#22d3ee' } },
    { name: '水电', data: [6, 7, 8, 8, 8], itemStyle: { color: '#10b981' } },
    { name: '核电', data: [1, 1.5, 2.5, 4, 6], itemStyle: { color: '#8b5cf6' } },
    { name: '风光及其他', data: [3, 3.5, 5.5, 9, 14], itemStyle: { color: '#fb923c' } },
  ],
});

// ── 对外依存度对比 ──────────────────────────────────────────
const depCompare = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>对外依存：{c}%' },
  grid: { left: 56, right: 24, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  yAxis: { type: 'category', data: ['原油', '天然气', '铀料', '煤炭'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 18,
    data: [
      { value: 72, itemStyle: { color: '#c41e3a' } },
      { value: 42, itemStyle: { color: '#22d3ee' } },
      { value: 30, itemStyle: { color: '#8b5cf6' } },
      { value: 8, itemStyle: { color: '#64748b' } },
    ],
    label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
  }],
};

// ── 油气进口通道（马六甲依赖）──────────────────────────────────
const channelDonut = donutOpt([
  { value: 78, name: '马六甲海峡（海运）', itemStyle: { color: '#c41e3a' } },
  { value: 12, name: '中俄/中亚管道（陆运）', itemStyle: { color: '#10b981' } },
  { value: 10, name: '中缅管道（绕行）', itemStyle: { color: '#e8a317' } },
], { center: ['50%', '46%'] });

// ── 碳市场趋势 ──────────────────────────────────────────────
const carbonMarket = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  grid: GRID,
  xAxis: categoryX(['2021', '2022', '2023', '2024', '2025E']),
  yAxis: valueY(),
  series: [
    { name: '交易均价（元/吨）', type: 'line', smooth: true, data: [45, 58, 72, 92, 105], lineStyle: { color: '#10b981', width: 2 }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '累计成交量（指数）', type: 'bar', data: [30, 45, 85, 120, 160], barWidth: 18, itemStyle: { color: '#22d3ee', opacity: 0.55, borderRadius: 3 } },
  ],
};

// ── 装机容量增长 ────────────────────────────────────────────
const capacityGrowth = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
  grid: GRID,
  xAxis: categoryX(['2018', '2020', '2022', '2024', '2025E']),
  yAxis: valueY({ name: '亿千瓦', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
  series: [
    { name: '风电装机', type: 'line', smooth: true, data: [1.8, 2.8, 3.7, 4.9, 5.6], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '光伏装机', type: 'line', smooth: true, data: [1.7, 2.5, 3.9, 7.1, 9.0], lineStyle: { color: '#fb923c', width: 2 }, itemStyle: { color: '#fb923c' } },
    { name: '储能装机', type: 'line', smooth: true, data: [0.1, 0.3, 0.7, 2.1, 3.2], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

// ── 双碳路径时间线 ──────────────────────────────────────────
const CARBON_STAGES = [
  { period: '2020–2030', title: '碳达峰前 · 总量爬坡', accent: '#fb923c', desc: '能耗与碳排仍在爬坡，核心是「上新不停旧」——饱和式扩张风光装机的同时，煤电压舱兜底保供。新型电力系统试点、特高压通道与配储是这一阶段的主战场。' },
  { period: '2030', title: '碳达峰 · 拐点锁定', accent: '#c41e3a', desc: '碳排放总量见顶回落。非化石能源消费占比目标 25%，风光装机突破 12 亿千瓦。煤电正式从主力退居调节，电力系统进入「绿电主导、煤电托底」的新平衡。' },
  { period: '2030–2060', title: '深度脱碳 · 系统重构', accent: '#10b981', desc: '电气化全面渗透交通/工业/建筑，绿氢与长时储能补齐难脱碳环节。电网调度从「源随荷动」转向「源网荷储」协同，CCUS 处理残余排放。' },
  { period: '2060', title: '碳中和 · 物理闭环', accent: '#8b5cf6', desc: '非化石能源成为绝对主体，剩余化石排放由碳汇与 CCUS 抵消。能源安全的逻辑被根本改写——从「保障进口通道」转向「掌控本土清洁产能与电网算法」。' },
];

export default function Page() {
  const [fuelKey, setFuelKey] = useState('oil');
  const [stageIdx, setStageIdx] = useState(1);

  const f = useMemo(() => FUELS.find((x) => x.key === fuelKey) || FUELS[1], [fuelKey]);

  const fuelRadar = useMemo(
    () => radarOpt(RADAR_DIMS, f.radar, { name: f.label, color: f.accent }),
    [f]
  );

  const uhvRadar = radarOpt(['跨区输电', '数字化调度', '绿电消纳', '网损控制', '应急恢复'], [95, 88, 92, 85, 98], { name: '电网能级', color: '#e8a317' });

  return (
    <div>
      <PageHeader badge="Energy · 双碳" title="能源 · 压舱石与转型" subtitle="品种结构 · 对外依存 · 通道安全 · 双碳路径 · 新型电力系统" />

      <IntroCard>
        现实主义逻辑下，能源不是商品而是<strong style={{ color: 'var(--text-primary)' }}>权力的物理基座</strong>。中国能源的核心矛盾是：八成进口原油须穿越可被掐断的<strong style={{ color: 'var(--text-primary)' }}>马六甲海峡</strong>。双碳转型并非道德叙事，而是彻底摆脱油气进口依赖、规避地缘断供的<strong style={{ color: 'var(--text-primary)' }}>唯一物理路径</strong>——用本土的风、光、水替代可被勒索的化石燃料通道。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~57 亿吨标煤" label="一次能源消费总量 · 示意" accent="#64748b" />
        <Stat value="~18.5%" label="非化石能源消费占比" accent="#10b981" />
        <Stat value="~72%" label="原油对外依存 · 攻坚点" accent="#c41e3a" />
        <Stat value="~36 亿千瓦" label="全社会发电装机 · 示意" accent="#22d3ee" />
      </Grid>

      {/* 1 · 能源品种选择器 */}
      <Card title="交互 · 七大能源品种档案" className="mb-6">
        <SelectorBar items={FUELS} activeKey={fuelKey} onSelect={setFuelKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <span className="text-base font-semibold" style={{ color: f.accent }}>{f.label}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{f.stance}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.line}</p>
        </div>
        <Grid cols={4} className="mb-4">
          <Stat value={`${f.share}%`} label="一次能源占比" accent={f.accent} />
          <Stat value={`${f.dep}%`} label="对外依存度" accent={f.dep >= 50 ? '#c41e3a' : f.dep >= 30 ? '#e8a317' : '#10b981'} />
          <Stat value={f.grade.split(' · ')[0]} label="安全评级" accent={f.accent} />
          <Stat value={f.radar[2]} label="通道安全指数" accent="#22d3ee" />
        </Grid>
        <Grid cols={2}>
          <Card title={`${f.label} · 能源安全五维评估`}>
            <EChart option={fuelRadar} style={{ height: 240 }} />
          </Card>
          <Card title={`${f.label} · 卡脖子风险点`}>
            <div className="os-card p-4 mb-3" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>CHOKE_POINTS</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.choke}</p>
            </div>
            <div className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>战略定位：{f.stance} · 安全评级：{f.grade}</div>
          </Card>
        </Grid>
      </Card>

      {/* 2 · 结构演进堆叠图 + 3 安全雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="一次能源结构演进（2010→2030E · 煤退新能源进）">
          <EChart option={mixEvolution} style={{ height: 280 }} />
        </Card>
        <Card title="能源体系安全 · 五维综合评估">
          <EChart option={radarOpt(RADAR_DIMS, [78, 62, 48, 55, 70], { name: '能源安全综合', color: '#c41e3a' })} style={{ height: 280 }} />
        </Card>
      </Grid>

      {/* 4 · 对外依存 + 通道困局 */}
      <Grid cols={2} className="mb-6">
        <Card title="对外依存度对比 · 油气是最深敞口">
          <EChart option={depCompare} style={{ height: 240 }} />
        </Card>
        <Card title="油气进口通道 · 马六甲困局">
          <EChart option={channelDonut} style={{ height: 200 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            约 <strong style={{ color: '#c41e3a' }}>78%</strong> 进口油气经马六甲海运抵达。中俄/中亚管道与中缅管道提供陆上冗余，但运量有限——通道多元化是规避「咽喉勒索」的核心对冲。
          </p>
        </Card>
      </Grid>

      {/* 5 · 双碳时间线 */}
      <Card title="交互 · 双碳转型路径时间线（2020 → 2060）" className="mb-6">
        <TimelineBar stages={CARBON_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* 装机增长 + 碳市场 */}
      <Grid cols={2} className="mb-6">
        <Card title="风光储装机增长（亿千瓦 · 示意）">
          <EChart option={capacityGrowth} style={{ height: 260 }} />
        </Card>
        <Card title="碳排放权交易趋势 · 减碳的财务理性">
          <EChart option={carbonMarket} style={{ height: 220 }} />
          <Grid cols={2} className="mt-3">
            <Stat value="105+ 元" label="碳价基准（CEA · 示意）" accent="#e8a317" />
            <Stat value="50 亿吨+" label="覆盖 CO₂ 排放量" accent="#10b981" />
          </Grid>
        </Card>
      </Grid>

      {/* 特高压电网能级 */}
      <Grid cols={2} className="mb-6">
        <Card title="特高压电网 · 能级评估">
          <EChart option={uhvRadar} style={{ height: 240 }} />
        </Card>
        <Card title="新型电力系统 · 源网荷储一体化">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            特高压「西电东送」是把西部绿电秒级输送至东部负荷中心的物理大动脉，消解能源供需的地理错配。未来竞争不仅是能源量的竞争，更是<strong style={{ color: 'var(--text-primary)' }}>全生命周期效率与电网调度算法</strong>的竞争。
          </p>
          <Grid cols={2}>
            <Stat value="40+ 条" label="特高压线路（示意）" accent="#22d3ee" />
            <Stat value="50.4%" label="可再生能源装机占比" accent="#10b981" />
          </Grid>
        </Card>
      </Grid>

      {/* 6 · FrameworkTrio */}
      <FrameworkTrio cards={[
        {
          title: '能源不可能三角', subtitle: '安全 · 经济 · 清洁', body: '能源安全、经济性、清洁低碳三者无法同时最大化——煤电安全便宜但脏，风光清洁但贵且不稳。治理的本质是在三角内动态权衡：保供优先级永远高于一切。',
          pillars: [['安全', '兜底压倒一切。'], ['经济', '电价民生约束。'], ['清洁', '双碳刚性目标。']],
        },
        {
          title: '压舱石逻辑', subtitle: '煤电兜底 · 油气对冲', body: '原油对外依存 ~72% 是最现实的风险点。煤电压舱石不消失而是换角色——从主力转为调节，为绿电突围腾挪系统空间；战略储备与通道多元化对冲油气断供。',
          pillars: [['煤电托底', '从主力到调节。'], ['SPR 储备', '油气战略纵深。'], ['通道多元', '消解马六甲。']],
        },
        {
          title: '新能源换道', subtitle: '风光储 + 特高压', body: '换道超车的物理方案：本土气候资源 + 装备制造优势替代进口燃料。风光随机性靠储能削峰、核电基荷打底、特高压跨区调配三重对冲，构建高抗冲击的能源体系。',
          pillars: [['饱和风光', '本土资源替代。'], ['储能缓冲', '波动性削峰。'], ['UHV 调配', '地理错配消解。']],
        },
      ]} />

      <ModuleFooter
        moduleId="energy"
        disclaimer="数据为公开信息综合的示意值，非官方统计 · 仅供分析框架参考，非投资建议"
        sourceNote="由 china.html「能源」专题迁移升级 · 七品种 + 双碳路径扩容"
      />
    </div>
  );
}
