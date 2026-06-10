import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ----------------------------------------------------------------------------
// 业态档案：六大零工业态（规模/收入/痛点/算法约束，示意值）
// ----------------------------------------------------------------------------
const SECTORS = [
  {
    key: 'rider', label: '外卖骑手', accent: '#e8a317',
    scale: '1,300 万+', scaleNote: '注册骑手（活跃约 1/3）',
    income: '5,800', incomeNote: '月均收入（元 · 一线专送）',
    insure: 38, insureNote: '职业伤害保障覆盖率（试点省）',
    algo: 86, algoNote: '算法约束强度（0-100）',
    pain: '配送时限逐年压缩，交通事故风险外部化给个体；「以罚代管」的评分体系使申诉成本极高。',
    constraint: '派单算法 + 时限倒计时 + 超时罚款：劳动节奏由系统毫秒级调度，骑手对定价与路线几乎无议价权。',
    radar: [92, 45, 38, 55, 86, 30],
  },
  {
    key: 'driver', label: '网约车', accent: '#22d3ee',
    scale: '700 万+', scaleNote: '取得双证的合规司机',
    income: '7,200', incomeNote: '月均流水（元 · 扣除抽成前）',
    insure: 31, insureNote: '职业伤害保障覆盖率',
    algo: 78, algoNote: '算法约束强度（0-100）',
    pain: '运力饱和 + 抽成不透明：多地发布运力饱和预警，单均收入持续摊薄，「阳光行动」强制公示抽成上限。',
    constraint: '动态定价 + 服务分派单：司机收入由抽成比例与热力图调度共同决定，账号分值即生产资料。',
    radar: [85, 50, 31, 48, 78, 25],
  },
  {
    key: 'courier', label: '快递', accent: '#c41e3a',
    scale: '450 万+', scaleNote: '一线快递从业人员',
    income: '6,500', incomeNote: '月均收入（元 · 计件为主）',
    insure: 52, insureNote: '工伤/职业伤害合计覆盖率',
    algo: 64, algoNote: '算法约束强度（0-100）',
    pain: '加盟制层层转包稀释保障责任；单价「内卷」下沉至 1 元/件以下，旺季劳动强度极限拉伸。',
    constraint: '路区承包 + 计件单价：算法约束弱于外卖，但总部考核（签收率/投诉率）经加盟商层层放大。',
    radar: [80, 52, 52, 50, 64, 42],
  },
  {
    key: 'live', label: '直播电商', accent: '#a78bfa',
    scale: '1,500 万+', scaleNote: '主播及直播间运营从业者',
    income: '4,200', incomeNote: '月收入中位数（元 · 头部极化）',
    insure: 12, insureNote: '任何形式社保覆盖率',
    algo: 72, algoNote: '算法约束强度（0-100）',
    pain: '收入极端幂律分布：头部 1% 拿走绝大部分 GMV 分成，腰尾部主播实际收入低于本地最低工资。',
    constraint: '流量分发算法即雇主：开播时长、停留时长、转化率决定推荐权重，「停播即降权」形成隐性全勤约束。',
    radar: [70, 35, 12, 60, 72, 15],
  },
  {
    key: 'skill', label: '知识技能零工', accent: '#10b981',
    scale: '900 万+', scaleNote: '设计/开发/翻译/咨询等接单者',
    income: '8,900', incomeNote: '月均收入（元 · 项目制波动大）',
    insure: 22, insureNote: '以灵活就业身份自缴社保比例',
    algo: 35, algoNote: '算法约束强度（0-100）',
    pain: '平台抽佣 + 竞价压价：跨平台比价使技能单价长期承压；AIGC 替代正在侵蚀低复杂度订单。',
    constraint: '约束最弱的一档：算法主要作用于撮合与信用评级，而非劳动过程本身——但订单波动完全自担。',
    radar: [55, 72, 22, 75, 35, 20],
  },
  {
    key: 'flex', label: '灵活用工平台', accent: '#94a3b8',
    scale: '4,000 万+', scaleNote: '经灵工平台结算的劳动者',
    income: '4,800', incomeNote: '月均结算额（元 · 多为兼职叠加）',
    insure: 28, insureNote: '由平台代投商业险比例',
    algo: 48, algoNote: '算法约束强度（0-100）',
    pain: '「去劳动关系化」工具箱：部分平台将事实雇佣拆解为众包结算以规避社保，监管正穿透认定。',
    constraint: '排班/计件系统替代人事管理：劳动关系被结算关系覆盖，争议焦点在「事实劳动关系」的司法认定。',
    radar: [75, 42, 28, 40, 48, 22],
  },
];

// ----------------------------------------------------------------------------
// 从业者画像：三个维度（年龄/学历/来源），donut 切换
// ----------------------------------------------------------------------------
const PROFILE_DIMS = [
  {
    key: 'age', label: '年龄结构', accent: '#e8a317',
    note: '零工经济是「青壮年密集型」劳动池：80%+ 集中于 21-45 岁，与制造业流失的年龄段高度重合。',
    data: [
      { value: 12, name: '20 岁及以下', itemStyle: { color: '#22d3ee' } },
      { value: 34, name: '21-30 岁', itemStyle: { color: '#c41e3a' } },
      { value: 31, name: '31-40 岁', itemStyle: { color: '#e8a317' } },
      { value: 17, name: '41-50 岁', itemStyle: { color: '#10b981' } },
      { value: 6, name: '51 岁以上', itemStyle: { color: '#94a3b8' } },
    ],
  },
  {
    key: 'edu', label: '学历构成', accent: '#22d3ee',
    note: '高中及以下占六成——零工平台事实上承接了未被高等教育分流的劳动力主体；大专以上多流向知识技能与直播业态。',
    data: [
      { value: 24, name: '初中及以下', itemStyle: { color: '#c41e3a' } },
      { value: 37, name: '高中/中专', itemStyle: { color: '#e8a317' } },
      { value: 26, name: '大专', itemStyle: { color: '#22d3ee' } },
      { value: 13, name: '本科及以上', itemStyle: { color: '#10b981' } },
    ],
  },
  {
    key: 'origin', label: '城乡来源', accent: '#10b981',
    note: '农村户籍占比近七成：零工经济是农民工进城的「第一接口」，也意味着社保账户的城乡分割直接投射到平台劳动。',
    data: [
      { value: 68, name: '农村户籍（跨省/省内流动）', itemStyle: { color: '#c41e3a' } },
      { value: 21, name: '本地城镇户籍', itemStyle: { color: '#e8a317' } },
      { value: 11, name: '外地城镇户籍', itemStyle: { color: '#22d3ee' } },
    ],
  },
];

// ----------------------------------------------------------------------------
// 业态演进时间线
// ----------------------------------------------------------------------------
const TIMELINE = [
  { period: '1980s-2000s', title: '劳务市场零工', accent: '#94a3b8', desc: '马路劳务市场与包工头中介：零工以「站街等活」形式存在，匹配靠熟人网络，保障完全空白。这是零工经济的前数字形态——弹性早已存在，只是尚未被算法接管。' },
  { period: '2014-2019', title: '平台经济爆发', accent: '#22d3ee', desc: '外卖/网约车补贴大战将千万劳动力卷入平台：注册即上岗、多劳多得的叙事吸纳了制造业外溢人口。「灵活」被包装为自由，劳动关系被「合作协议」替代，社保问题被增长速度掩盖。' },
  { period: '2020-2021', title: '「困在系统里」争议', accent: '#c41e3a', desc: '《外卖骑手，困在系统里》引爆公共讨论：配送时限五年压缩近半、事故率攀升、「以罚代管」浮出水面。算法首次被公众识别为「新型劳动管理者」，监管窗口随之打开。' },
  { period: '2021-2023', title: '新就业形态权益政策', accent: '#e8a317', desc: '八部门《维护新就业形态劳动者权益指导意见》确立「劳动三分法」（劳动关系/不完全劳动关系/民事关系）；算法备案、抽成公示、强制休息上线——治理从「要不要管」转向「怎么精细地管」。' },
  { period: '2022-至今', title: '职业伤害保障扩面', accent: '#10b981', desc: '职业伤害保障试点从 7 省扩至全国主要平台业态：按单缴费、平台出资、政府统筹。目标是在不摧毁平台弹性的前提下补上安全网——全覆盖仍有约一半缺口待填。' },
];

// ----------------------------------------------------------------------------
// 静态图表（与业态无关）
// ----------------------------------------------------------------------------

// 灵活就业规模 vs 城镇就业占比（蓄水池趋势，双轴多线）
const POOL_YEARS = ['2015', '2017', '2019', '2021', '2023', '2025E'];
const poolTrend = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['灵活就业人数（亿人）', '城镇就业总量（亿人）', '灵活就业占比（%）'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: { left: 40, right: 44, top: 32, bottom: 28 },
  xAxis: categoryX(POOL_YEARS),
  yAxis: [
    valueY({ name: '亿人', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    valueY({ name: '%', max: 60, nameTextStyle: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } }),
  ],
  series: [
    { name: '灵活就业人数（亿人）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1.1, 1.4, 1.7, 2.0, 2.2, 2.4], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { name: '城镇就业总量（亿人）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [4.0, 4.2, 4.4, 4.7, 4.7, 4.8], lineStyle: { color: '#94a3b8', width: 1.5, type: 'dashed' }, itemStyle: { color: '#94a3b8' } },
    { name: '灵活就业占比（%）', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'rect', symbolSize: 6, data: [27, 33, 39, 43, 47, 50], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

// 算法治理张力：配送时限压缩 vs 事故率（双轴，自写内联）
const algoTension = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['平均配送时限（分钟）', '骑手交通事故率指数'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: { left: 40, right: 44, top: 32, bottom: 28 },
  xAxis: categoryX(['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']),
  yAxis: [
    valueY({ name: '分钟', min: 20, nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    valueY({ name: '指数', nameTextStyle: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } }),
  ],
  series: [
    { name: '平均配送时限（分钟）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [38, 35, 32, 30, 28, 29, 30, 31], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, markPoint: { symbolSize: 1, label: { color: '#e8a317', fontSize: 10, formatter: '2021 算法新规\n时限回调' }, data: [{ coord: ['2021', 29] }] } },
    { name: '骑手交通事故率指数', type: 'bar', yAxisIndex: 1, barWidth: 14, data: [100, 118, 142, 168, 190, 172, 158, 150], itemStyle: { color: 'rgba(196,30,58,0.7)', borderRadius: 2 } },
  ],
};

// 社保覆盖缺口（试点参保 vs 应保尽保，stackedBar）
const insureGap = stackedBarOpt({
  categories: ['外卖骑手', '网约车', '快递', '直播电商', '知识技能', '灵工平台'],
  series: [
    { name: '已纳入职业伤害保障', data: [38, 31, 52, 12, 22, 28], itemStyle: { color: '#10b981', borderRadius: [0, 0, 0, 0] } },
    { name: '覆盖缺口', data: [62, 69, 48, 88, 78, 72], itemStyle: { color: 'rgba(196,30,58,0.45)' } },
  ],
});

// 零工经济健康度雷达（系统总评，单系列用 helper）
const HEALTH_DIMS = ['就业吸纳', '收入水平', '社保覆盖', '职业发展', '算法公平', '组织保障'];
const healthRadar = radarOpt(HEALTH_DIMS, [88, 52, 34, 30, 46, 25], { name: '系统健康度', color: '#e8a317' });

// 平台抽成趋势（监管介入前后）
const takeRate = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['网约车平均抽成（%）', '外卖综合费率（%）'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: GRID,
  xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024E']),
  yAxis: valueY({ max: 35 }),
  series: [
    { name: '网约车平均抽成（%）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [22, 24, 26, 27, 25, 24, 23], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '外卖综合费率（%）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [18, 20, 22, 23, 22, 21, 20], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, markLine: { silent: true, symbol: 'none', label: { color: '#e8a317', fontSize: 9, formatter: '2021 抽成公示「阳光行动」' }, lineStyle: { color: '#e8a317', type: 'dashed' }, data: [{ xAxis: '2021' }] } },
  ],
};

// ----------------------------------------------------------------------------
// 原有图表（保留）
// ----------------------------------------------------------------------------
const jobDistPie = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['50%', '85%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 2, borderColor: 'transparent', borderWidth: 2 },
    label: { show: true, color: '#93a1b5', fontSize: 11 },
    data: [
      { value: 40, name: '外卖配送与物流', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '直播、自媒体与内容', itemStyle: { color: '#e8a317' } },
      { value: 20, name: '网约车与出行服务', itemStyle: { color: '#22d3ee' } },
      { value: 15, name: '知识技能/设计开发', itemStyle: { color: '#10b981' } },
    ],
  }],
};
const algRadar = {
  radar: {
    indicator: [{ name: '定价权分配', max: 100 }, { name: '劳动时间限制', max: 100 }, { name: '派单算法中立', max: 100 }, { name: '评价体系公正', max: 100 }, { name: '个人数据可携', max: 100 }, { name: '争议申诉效率', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [65, 88, 75, 82, 40, 85], name: '治理水位', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }] }],
};
const bufferLogic = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['劳动力流入量', '就业吸纳耐性'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { left: 44, right: 24, top: 32, bottom: 28 },
  xAxis: { type: 'category', data: ['制造业低迷期', '服务业复苏期', '出口波动期', '节日需求峰值'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '劳动力流入量', type: 'bar', data: [180, 120, 210, 150], barWidth: 22, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '就业吸纳耐性', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [90, 85, 95, 88], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

const SECTOR_RADAR_DIMS = ['从业规模', '收入水平', '保障覆盖', '职业发展', '算法约束', '组织化程度'];

export default function Page() {
  const [sectorKey, setSectorKey] = useState('rider');
  const [profileKey, setProfileKey] = useState('age');
  const [stageIdx, setStageIdx] = useState(2);

  const sector = useMemo(() => SECTORS.find((s) => s.key === sectorKey) ?? SECTORS[0], [sectorKey]);
  const profile = useMemo(() => PROFILE_DIMS.find((d) => d.key === profileKey) ?? PROFILE_DIMS[0], [profileKey]);

  const sectorRadar = useMemo(
    () => radarOpt(SECTOR_RADAR_DIMS, sector.radar, { name: sector.label, color: sector.accent }),
    [sector],
  );
  const profileDonut = useMemo(() => donutOpt(profile.data), [profile]);

  return (
    <div>
      <PageHeader badge="Gig Economy · Digital Labor Market & Elastic Economy" title="平台灵活就业 · 算法治理" subtitle="就业蓄水池 · 社保覆盖 · 骑手与算法 —— 零工经济与数字劳动力" />
      <IntroCard>零工经济是中国经济面临人口结构变化与产业升级时的「系统级自适应」：体制通过数字平台将 2 亿+ 劳动力「原子化」，以推荐算法实现超大规模劳务市场的毫秒级匹配；治理重心则从「极致效率」转向「合理劳动强度」与新型安全网重构。本页以业态为切口：先看蓄水池的总量，再看每一类劳动者被怎样的算法约束着，最后看安全网补到了哪一格。</IntroCard>
      <Grid cols={4} className="mb-6">
        <Stat value="2.3 亿+" label="灵活就业总人数 · 占城镇就业 ~23%" accent="#e8a317" />
        <Stat value="1,300 万+" label="注册外卖骑手 · 数字化深度介入" />
        <Stat value="700 万+" label="合规网约车司机 · 运力趋于饱和" accent="#22d3ee" />
        <Stat value="~1,000 万" label="职业伤害保障参保人数 · 试点扩面中" accent="#c41e3a" />
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 01 · 业态选择器：六类零工的系统档案 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="01 · 业态切片：同一个「灵活」，六种不同的约束" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <div>
            <Grid cols={2} className="mb-4">
              <div style={{ borderLeft: `2px solid ${sector.accent}`, paddingLeft: 10 }}>
                <div className="text-lg font-bold mono" style={{ color: sector.accent }}>{sector.scale}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{sector.scaleNote}</div>
              </div>
              <div style={{ borderLeft: `2px solid ${sector.accent}`, paddingLeft: 10 }}>
                <div className="text-lg font-bold mono" style={{ color: sector.accent }}>¥{sector.income}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{sector.incomeNote}</div>
              </div>
              <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
                <div className="text-lg font-bold mono" style={{ color: '#10b981' }}>{sector.insure}%</div>
                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{sector.insureNote}</div>
              </div>
              <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
                <div className="text-lg font-bold mono" style={{ color: '#c41e3a' }}>{sector.algo}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{sector.algoNote}</div>
              </div>
            </Grid>
            <div className="os-card p-4 mb-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
              <div className="text-[10px] mono uppercase tracking-wider mb-1" style={{ color: sector.accent }}>Pain Point // 保障痛点</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.pain}</p>
            </div>
            <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #22d3ee' }}>
              <div className="text-[10px] mono uppercase tracking-wider mb-1" style={{ color: '#22d3ee' }}>Algorithmic Constraint // 算法约束</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.constraint}</p>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>{sector.label} · 业态体征雷达（0-100 · 示意）</div>
            <EChart option={sectorRadar} style={{ height: 280 }} />
            <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>读法：「算法约束」越高，劳动过程越被系统接管；「组织化程度」普遍低位——原子化劳动者缺少集体议价的接口，这是六类业态共享的结构性短板。</p>
          </div>
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 02 · 蓄水池：总量趋势 + 波动敏感度 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="02 · 就业蓄水池：社会的避震器" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>灵活就业规模 vs 城镇就业总盘（示意趋势）</div>
            <EChart option={poolTrend} style={{ height: 260 }} />
          </div>
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>零工经济承载了中国经济转型中的<strong style={{ color: 'var(--text-primary)' }}>「摩擦性失业」</strong>，是制造业出海、出口波动时的社会稳定器。当传统行业收缩时，平台经济以极低的进入门槛迅速吸收冗余劳动力，防止结构性失业引发震荡——这种<strong style={{ color: '#c41e3a' }}>「瞬间吸纳力」</strong>是国家治理韧性的重要物理体现。但蓄水池的另一面是：水位越高，池底的保障缺口就越显眼。</p>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>经济波动下的零工流入/流出敏感度</div>
            <EChart option={bufferLogic} style={{ height: 200 }} />
          </div>
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 03 · 从业者画像 + 岗位构成 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="03 · 从业者画像：谁在池子里">
          <SelectorBar items={PROFILE_DIMS} activeKey={profileKey} onSelect={setProfileKey} />
          <EChart option={profileDonut} style={{ height: 220 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>{profile.note}</p>
        </Card>
        <Card title="04 · 劳动力重构：数字化身与原子化生存">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>个体不再依附于固定组织，而是依附于<strong style={{ color: 'var(--text-primary)' }}>「评分系统」</strong>——平台将劳动力的损耗控制在极低水平，实现碎片化与最优化并存。<span className="mono text-[10px]" style={{ color: '#22d3ee' }}> Status: Fragmented &amp; Optimized</span></p>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>灵活就业岗位构成分布（2024E · %）</div>
          <EChart option={jobDistPie} style={{ height: 220 }} />
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 05 · 算法治理张力 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="05 · 「困在系统里」：算法治理的张力曲线" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>配送时限压缩 vs 事故率指数（示意）</div>
            <EChart option={algoTension} style={{ height: 240 }} />
            <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>2016-2020：算法以「预估到达时间」为目标函数持续压缩时限，事故率同步攀升——风险被外部化给骑手与道路。2021 年「算法取中」新规后时限回调、事故率回落：这是中国第一次以行政手段直接修改一个商业算法的目标函数。</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>平台抽成/费率趋势 · 监管介入前后（示意）</div>
            <EChart option={takeRate} style={{ height: 240 }} />
            <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>抽成是平台与劳动者之间最直接的分配界面。2021 年起「阳光行动」要求公示抽成上限与计价规则，抽成曲线从单调爬升转为缓慢回落——治理没有取缔抽成，而是给抽成装上了天花板与显示屏。</p>
          </div>
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 06 · 算法治理边界雷达（保留）+ 社保覆盖缺口 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="06 · 算法治理边界（治理水位 · 0-100）">
          <EChart option={algRadar} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>数据揭示：治理逻辑正从「极致效率」转向「合理劳动强度」。通过强制休息机制与算法备案制，系统正在防止<strong style={{ color: 'var(--text-secondary)' }}>「系统性怠工」</strong>；个人数据可携（40）仍是最大短板。</p>
        </Card>
        <Card title="07 · 社保覆盖缺口：安全网补到了哪一格">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>职业伤害保障覆盖 vs 缺口（% · 按业态 · 示意）</div>
          <EChart option={insureGap} style={{ height: 220 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>缺口的形状即治理的优先级：事故率最高的骑手/快递先被纳入按单缴费试点；直播电商因「劳动关系最稀薄」覆盖率最低——保障的渗透速度与劳动关系的可识别度成正比。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 08 · 业态演进时间线 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="08 · 业态演进：从马路劳务市场到算法备案制" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 09 · 健康度总评 + 安全网重构 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="09 · 零工经济系统健康度（六维总评 · 0-100）" className="mb-6">
        <Grid cols={2}>
          <EChart option={healthRadar} style={{ height: 260 }} />
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>六维读数呈现典型的<strong style={{ color: 'var(--text-primary)' }}>「单极强、五极弱」</strong>结构：就业吸纳（88）一骑绝尘，其余五维全部低于及格线。这意味着系统当前的稳定是「吸纳力透支型」稳定——蓄水池在持续进水，但池壁（社保 34、组织保障 25）尚未砌牢。</p>
            <div className="space-y-2">
              {[['就业吸纳 88', '#e8a317', '宏观波动期的核心价值，也是政策投鼠忌器的原因'],
                ['收入水平 52', '#22d3ee', '名义灵活溢价正被运力饱和与单价内卷吞噬'],
                ['社保覆盖 34', '#c41e3a', '职业伤害险试点扩面是当前补课主线'],
                ['职业发展 30', '#c41e3a', '零工年限不可累积为职业资本，是长期隐患'],
                ['算法公平 46', '#e8a317', '备案制与「算法取中」之后仍是黑箱博弈'],
                ['组织保障 25', '#c41e3a', '工会进平台试点中，集体协商机制几乎空白']].map(([t, c, d]) => (
                <div key={t} className="flex items-baseline gap-2">
                  <span className="text-[11px] mono font-bold" style={{ color: c, minWidth: 86 }}>{t}</span>
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      <Card title="10 · 新型安全网重构：职业伤害保障 · 算法下的安全锁" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正尝试通过「第三种劳动关系」解决社保难题——既不完全等同于正式员工，也不是纯粹的独立承包。通过建立由平台出资、政府统筹的<strong style={{ color: 'var(--text-primary)' }}>「职业伤害保障」</strong>试点，体制在不摧毁平台效率的前提下，为原子化劳动者提供基础的安全冗余，实现治理风险的社会化再分配。</p>
        <Grid cols={3}>
          {[['Digital Asset Entitlement', '数字资产确权', '骑手账号、评分与接单记录构成数字劳动资产，可携性决定劳动者议价能力。'],
            ['Social Insurance Portability', '社保可携转', '打破户籍与单位绑定的缴纳结构，让保障跟人走而非跟岗位走。'],
            ['Platform Liability Protocol', '平台责任协议', '按单缴费、平台出资的职业伤害保障，将算法派单的风险外部性内部化。']].map(([en, t, d]) => (
            <div key={en} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-[10px] mono uppercase tracking-wider" style={{ color: '#10b981' }}>{en}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>零工经济的本质是一场三方博弈：平台要效率、劳动者要保障、体制要稳定。算法备案制与职业伤害险试点表明，治理目标不是消灭弹性，而是给弹性装上「安全锁」——就业蓄水池能否长期蓄水，取决于安全网能否跟上原子化的速度。当 2 亿人的劳动节奏由目标函数决定时，修改目标函数本身就成了一种社会政策。</p>
        <div className="flex flex-wrap gap-6 text-[10px] font-bold mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// LABOR: ELASTIC</span><span>// ALGORITHM: CALIBRATED</span><span>// SAFETY_NET: PATCHING</span><span>// SOCIAL_STABILITY: HIGH</span>
        </div>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', body: '蓄水池逻辑：经济波动期的就业缓冲是平台经济获得政策容忍的根本筹码——平台用工游离于传统劳保体系之外，却承担着稳定器职能，这一交换是默契而非契约。', pillars: [['瞬间吸纳', '低门槛接住制造业与出口波动外溢的劳动力'], ['延迟清算', '保障欠账被增长掩盖，在增速放缓时集中暴露'], ['不可替代', '2 亿人规模使「取缔式监管」失去现实选项']] },
        { key: 'stone', body: '算法权力：平台算法已是事实上的「新型劳动管理者」——派单、计价、考核、惩罚全链路由系统执行。治理的试点路径是算法备案 → 抽成公示 → 「算法取中」，逐格收回算法的立法权。', pillars: [['备案制', '算法规则向监管报备，黑箱转为灰箱'], ['取中原则', '时限与单价不得取极值，目标函数被行政修正'], ['申诉接口', '强制建立人工复核通道，对冲评分专制']] },
        { key: 'path', body: '保障补课：「劳动三分法」承认不完全劳动关系，职业伤害险按单缴费、平台出资——升级路径是让保障从「跟单位走」变为「跟人走」，把弹性就业从制度缝隙搬进制度框架。', pillars: [['三分法', '劳动关系 / 不完全劳动关系 / 民事关系分层适用'], ['按单缴费', '保障成本嵌入每一笔订单，随交易自动累积'], ['全覆盖目标', '从 7 省试点到主要平台业态全量纳入']] },
      ]} />
      <ModuleFooter moduleId="gig" disclaimer="本页数据为公开资料整理与示意推算，规模/收入/覆盖率等均非官方统计口径 · 仅供分析框架参考" />
    </div>
  );
}
