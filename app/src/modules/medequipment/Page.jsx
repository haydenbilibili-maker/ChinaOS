import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 品类数据 · 八大装备品类（示意值，刻画进口替代的真实梯度）
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    key: 'imaging', label: 'CT/MRI 影像', accent: '#c41e3a',
    localization: 42, gpsShare: 62, tier: '深水区',
    players: ['联影医疗', '东软医疗', '万东医疗'],
    foreign: ['GE 医疗', '西门子医疗', '飞利浦'],
    breakthrough: '联影 3.0T MRI / 320 排 CT 进入三级医院装机榜前列；5.0T 全身磁共振全球首发，从「跟跑」切入「并跑」。',
    bottleneck: 'X 射线球管、平板探测器、超导磁体国产化率显著低于整机；高端临床科研合作生态仍由 GPS 主导。',
    metric: '高端机型国产份额 ~42% · 球管自给率 <20%',
    momentum: [12, 18, 26, 35, 42],
  },
  {
    key: 'ultrasound', label: '超声', accent: '#10b981',
    localization: 68, gpsShare: 38, tier: '相对成熟',
    players: ['迈瑞医疗', '开立医疗', '祥生医疗'],
    foreign: ['GE 医疗', '飞利浦', '佳能医疗'],
    breakthrough: '迈瑞高端彩超进入欧美三甲级医院采购名单，中低端市场国产基本盘稳固；便携/掌上超声出海放量。',
    bottleneck: '高端心脏超声探头与单晶体材料仍有差距；超高端科研型机型外资仍占优。',
    metric: '整体国产化率 ~68% · 出口增速 >15%',
    momentum: [40, 48, 55, 62, 68],
  },
  {
    key: 'endoscope', label: '内窥镜', accent: '#e8a317',
    localization: 18, gpsShare: 82, tier: '攻坚期',
    players: ['开立医疗', '澳华内镜', '海泰新光'],
    foreign: ['奥林巴斯', '富士胶片', '卡尔史托斯'],
    breakthrough: '软镜 4K 成像与电子染色技术国产突破，澳华 AQ-300 对标奥林巴斯主力机型；硬镜光学件国产配套成型。',
    bottleneck: '日系软镜垄断 80%+ 份额，CMOS 图像传感器与镜体工艺积累差距明显；医生使用习惯迁移成本高。',
    metric: '软镜国产化率 <15% · 日系三强 >80%',
    momentum: [5, 8, 11, 14, 18],
  },
  {
    key: 'radiotherapy', label: '放疗设备', accent: '#8b5cf6',
    localization: 30, gpsShare: 70, tier: '攻坚期',
    players: ['联影医疗', '新华医疗', '大医集团'],
    foreign: ['瓦里安(西门子)', '医科达'],
    breakthrough: '国产直线加速器获批放量，联影一体化 CT-linac 切入精准放疗；质子重离子装置国产化立项推进。',
    bottleneck: '高端直线加速器瓦里安/医科达双寡头，磁控管、多叶光栅等核心部件依赖进口；装机审批（甲类大型设备）节奏受配置证约束。',
    metric: '直线加速器国产份额 ~30% · 双寡头 ~70%',
    momentum: [10, 15, 20, 25, 30],
  },
  {
    key: 'ivd', label: '体外诊断 IVD', accent: '#22d3ee',
    localization: 55, gpsShare: 45, tier: '替代中段',
    players: ['迈瑞医疗', '新产业', '安图生物', '万孚生物'],
    foreign: ['罗氏诊断', '雅培', '丹纳赫', '西门子'],
    breakthrough: '化学发光国产份额持续抬升，集采（安徽/江西联盟）倒逼外资降价、国产以成本与渠道放量；分子诊断疫后产能沉淀。',
    bottleneck: '高端化学发光试剂菜单宽度与封闭系统粘性仍是外资护城河；上游酶/抗体原料部分依赖进口。',
    metric: '化学发光国产份额 ~30%→上行 · 生化 >70%',
    momentum: [35, 42, 47, 51, 55],
  },
  {
    key: 'robot', label: '手术机器人', accent: '#fb923c',
    localization: 15, gpsShare: 85, tier: '最深水区',
    players: ['微创机器人', '天智航', '精锋医疗'],
    foreign: ['直觉外科(达芬奇)', '史赛克', '美敦力'],
    breakthrough: '图迈腔镜机器人获批并完成 5G 超远程手术验证；天玑骨科机器人装机国内领先，国产获批术式逐年扩展。',
    bottleneck: '达芬奇在腔镜领域近乎垄断，耗材绑定 + 培训体系构成生态壁垒；力反馈、减速器等核心件依赖进口。',
    metric: '腔镜机器人国产份额 <15% · 装机缺口大',
    momentum: [2, 4, 7, 11, 15],
  },
  {
    key: 'implant', label: '植介入耗材', accent: '#64748b',
    localization: 60, gpsShare: 40, tier: '集采重塑',
    players: ['微创医疗', '乐普医疗', '威高骨科', '春立医疗'],
    foreign: ['美敦力', '雅培', '波士顿科学', '强生'],
    breakthrough: '冠脉支架集采后国产份额 >70%；骨科关节/脊柱集采落地，国产以价换量完成入院渗透；瓣膜介入(TAVR)国产三强成型。',
    bottleneck: '集采压缩利润倒逼出海与创新管线；高端电生理、神经介入外资份额仍高，镍钛合金等材料部分进口。',
    metric: '冠脉支架国产 >70% · 电生理 <35%',
    momentum: [42, 48, 52, 56, 60],
  },
  {
    key: 'petct', label: 'PET-CT/核医学', accent: '#c41e3a',
    localization: 38, gpsShare: 62, tier: '攻坚期',
    players: ['联影医疗', '东软医疗'],
    foreign: ['GE 医疗', '西门子医疗', '飞利浦'],
    breakthrough: '联影 uEXPLORER 全景动态 PET-CT 实现 194cm 轴向视野全球领先，反向输出美国顶级医研机构。',
    bottleneck: '闪烁晶体(LYSO)、SiPM 探测器上游链条与放射性药物配套仍需补课；配置证总量管控影响装机节奏。',
    metric: '国产装机份额 ~38% · 单点技术全球领先',
    momentum: [8, 15, 24, 31, 38],
  },
];

const TIER_COLOR = (v) => (v >= 60 ? '#10b981' : v >= 40 ? '#e8a317' : v >= 25 ? '#fb923c' : '#c41e3a');

// ---------------------------------------------------------------------------
// 静态图表 option
// ---------------------------------------------------------------------------
const marketScale = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['2016', '2018', '2020', '2022', '2023', '2025E']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万亿' } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.37, 0.53, 0.73, 0.98, 1.27, 1.65], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
};

const localizationBar = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  grid: { left: 40, right: 16, top: 16, bottom: 46 },
  xAxis: categoryX(['体外诊断', '1.5T MRI', '3.0T MRI', '64排 CT', 'PET-CT', '手术机器人'], { fontSize: 10, interval: 0 }),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '2020 国产化率', type: 'bar', data: [75, 35, 12, 15, 8, 2], barWidth: 12, itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '2024E 国产化率', type: 'bar', data: [92, 68, 42, 45, 35, 18], barWidth: 12, itemStyle: { color: '#10b981', borderRadius: 3 } },
  ],
};

// GPS 三巨头高端影像份额（示意）
const gpsDonut = donutOpt([
  { value: 24, name: 'GE 医疗', itemStyle: { color: '#22d3ee' } },
  { value: 22, name: '西门子医疗', itemStyle: { color: '#8b5cf6' } },
  { value: 16, name: '飞利浦', itemStyle: { color: '#e8a317' } },
  { value: 26, name: '联影医疗', itemStyle: { color: '#c41e3a' } },
  { value: 7, name: '东软/万东等', itemStyle: { color: '#10b981' } },
  { value: 5, name: '其他', itemStyle: { color: '#64748b' } },
]);

// 装备自主度雷达（双系列 → 自写内联 option）
const AUTONOMY_INDICATORS = ['核心部件', '整机集成', '软件算法', '临床认证', '服务网络', '高端市场'];
const autonomyRadar = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  radar: {
    indicator: AUTONOMY_INDICATORS.map((n) => ({ name: n, max: 100 })),
    radius: '62%', center: ['50%', '46%'],
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [38, 72, 65, 58, 52, 40], name: '中国头部厂商', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
      { value: [90, 92, 88, 90, 92, 88], name: '国际巨头 (GPS/直觉外科)', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    ],
  }],
};

// 市场规模 + 出口双轴
const exportDual = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  grid: { left: 48, right: 52, top: 20, bottom: 46 },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024E', '2025E']),
  yAxis: [
    valueY({ name: '国内市场(万亿)', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
    { type: 'value', name: '出口(千亿)', nameTextStyle: { color: LABEL.color, fontSize: 10 }, axisLabel: { color: LABEL.color }, splitLine: { show: false } },
  ],
  series: [
    { name: '国内市场规模', type: 'bar', barWidth: 16, data: [0.63, 0.73, 0.85, 0.98, 1.27, 1.45, 1.65], itemStyle: { color: 'rgba(196,30,58,0.65)', borderRadius: 3 } },
    { name: '器械出口额', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: [2.9, 4.8, 4.5, 4.2, 4.8, 5.5, 6.3], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '新兴市场出口', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: [0.8, 1.2, 1.5, 1.7, 2.1, 2.6, 3.2], lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
  ],
};

// 集采降价 vs 创新械获批
const tensionBar = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  grid: { left: 40, right: 44, top: 20, bottom: 46 },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024']),
  yAxis: [
    valueY({ max: 100, axisLabel: { formatter: '-{value}%' } }),
    { type: 'value', axisLabel: { color: LABEL.color }, splitLine: { show: false } },
  ],
  series: [
    { name: '集采平均降幅(%)', type: 'bar', barWidth: 14, data: [0, 93, 82, 84, 70, 63], itemStyle: { color: 'rgba(196,30,58,0.7)', borderRadius: 3 } },
    { name: '创新械年度获批(件)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: [19, 26, 35, 55, 61, 65], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
  ],
};

const aiDonut = donutOpt([
  { value: 35, name: 'AI 影像辅助', itemStyle: { color: '#c41e3a' } },
  { value: 25, name: '病理与检验', itemStyle: { color: '#22d3ee' } },
  { value: 18, name: '手术导航', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '医院信息化', itemStyle: { color: '#10b981' } },
  { value: 10, name: '其他 AI', itemStyle: { color: '#64748b' } },
]);

// 替代之路时间轴
const TIMELINE = [
  { period: '1980s–2000s', title: '外资全面垄断', accent: '#64748b', desc: 'GPS 三巨头与日系内镜厂商凭借数十年技术与服务沉淀，占据中国高端装备装机绝对主导。三甲医院影像科几乎清一色进口机型，国产厂商困于低端黑白超与基础 X 光机，「能用」与「敢用」之间隔着整个临床信任链。' },
  { period: '2000s–2014', title: '低端起步 · 农村包围城市', accent: '#e8a317', desc: '迈瑞、万东等从基层医疗与县级医院切入，以性价比换市场；新医改基层装备采购潮提供第一桶量。低端市场的现金流与渠道网络，为后续高端攻坚积累了弹药——但「国产=低端」的标签也在此期固化。' },
  { period: '2014–2020', title: '联影破局 · 高端影像撕开口子', accent: '#c41e3a', desc: '联影以「整机+核心部件+软件」全栈自研路线直攻 3.0T MRI 与 PET-CT，uEXPLORER 全景 PET-CT 实现单点全球领先并反向输出美国。国家「优秀国产设备遴选」与配置证政策倾斜，首次在三级医院打开高端国产装机窗口。' },
  { period: '2020–2023', title: '集采倒逼 + 创新械通道', accent: '#22d3ee', desc: '冠脉支架集采降价 93% 震动行业：以价换量完成国产渗透，同时压缩利润倒逼创新与出海。创新医疗器械特别审查通道年获批量翻三倍，「集采管存量、创新开增量」的双轨制度框架成型。' },
  { period: '2023–', title: '机器人与超高端攻坚', accent: '#8b5cf6', desc: '手术机器人、软式内镜、高端放疗成为最后的深水区——技术差距叠加生态壁垒（耗材绑定、医生培训、术式认证）。5.0T MRI、质子治疗装置立项攻关，出海从东南亚/中东向欧美注册纵深，进口替代进入「啃硬骨头」阶段。' },
];

// ---------------------------------------------------------------------------
export default function Page() {
  const [catKey, setCatKey] = useState('imaging');
  const [stageIdx, setStageIdx] = useState(2);
  const cat = useMemo(() => CATEGORIES.find((c) => c.key === catKey) || CATEGORIES[0], [catKey]);

  // 品类国产化率全景（横向 bar · 分档着色）
  const allCatBar = useMemo(() => {
    const sorted = [...CATEGORIES].sort((a, b) => a.localization - b.localization);
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}<br/>国产化率：${p[0].value}%` },
      grid: { left: 92, right: 36, top: 8, bottom: 24 },
      xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
      yAxis: { type: 'category', data: sorted.map((c) => c.label), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      series: [{
        type: 'bar', barWidth: 14,
        data: sorted.map((c) => ({
          value: c.localization,
          itemStyle: { color: c.key === catKey ? '#fff' : TIER_COLOR(c.localization), borderRadius: 3, borderColor: c.key === catKey ? c.accent : 'transparent', borderWidth: c.key === catKey ? 0 : 0, opacity: c.key === catKey ? 1 : 0.85 },
        })),
        label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
      }],
    };
  }, [catKey]);

  // 当前品类：国产化率爬坡迷你线
  const momentumOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 12, top: 12, bottom: 22 },
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2024E'], { fontSize: 9 }),
    yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%', fontSize: 9 } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: cat.momentum, lineStyle: { color: cat.accent, width: 2 }, itemStyle: { color: cat.accent }, areaStyle: { color: 'rgba(148,163,184,0.08)' } }],
  }), [cat]);

  // 当前品类：内外资份额对比 donut
  const shareDonut = useMemo(() => donutOpt([
    { value: cat.localization, name: '国产份额', itemStyle: { color: cat.accent } },
    { value: 100 - cat.localization, name: '外资份额', itemStyle: { color: '#64748b' } },
  ], { center: ['50%', '42%'] }), [cat]);

  // 集采 vs 创新 通道结构（堆叠 bar）
  const channelStack = useMemo(() => stackedBarOpt({
    categories: ['冠脉支架', '骨科关节', '脊柱耗材', '电生理', '化学发光', '人工晶体'],
    series: [
      { name: '集采后国产份额', data: [72, 58, 55, 35, 42, 45], itemStyle: { color: '#c41e3a', borderRadius: 0 } },
      { name: '外资剩余份额', data: [28, 42, 45, 65, 58, 55], itemStyle: { color: AXIS.lineStyle.color } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Med Equipment · 健康中国 2030" title="高端医疗装备 · 进口替代" subtitle="影像设备 · 集采降价 · 国产替代 —— 从「采购清单」到产业安全变量" />
      <IntroCard>
        健康中国 2030 与集采、创新审批绿色通道双轮驱动国产替代与高端突破：影像设备、手术机器人、PET-CT 等高端器械国产化率持续提升，但<strong style={{ color: 'var(--text-primary)' }}>球管、探测器、超导磁体等核心部件仍存对外依赖</strong>。进口替代不是一条均匀战线——超声、植介入耗材已过中场，软式内镜与手术机器人仍在 20% 以下的深水区。器械竞争力是<strong style={{ color: 'var(--text-primary)' }}>临床可及性与产业链韧性的交集</strong>，替代的终点不是「装机数字」，而是核心部件自给与临床生态的双重收复。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~1.3 万亿" label="2023 市场规模 (RMB)" accent="#c41e3a" />
        <Stat value="~40%" label="高端影像国产化率" accent="#e8a317" />
        <Stat value="65 件" label="2024 创新械获批（示意）" accent="#10b981" />
        <Stat value="~4,800 亿" label="器械出口规模（示意）" accent="#22d3ee" />
      </Grid>

      {/* ---------------- 品类选择器 ---------------- */}
      <Card title="八大品类 · 进口替代梯度扫描（点选切换）" className="mb-6">
        <SelectorBar items={CATEGORIES} activeKey={catKey} onSelect={setCatKey} />
        <div className="os-card p-5 mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${cat.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(148,163,184,0.12)', color: TIER_COLOR(cat.localization) }}>{cat.tier}</span>
            <span className="text-[11px] mono" style={{ color: cat.accent }}>{cat.metric}</span>
          </div>
          <Grid cols={2}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>突破点</div>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{cat.breakthrough}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>卡点</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cat.bottleneck}</p>
            </div>
            <div>
              <Grid cols={2}>
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>国产代表</div>
                  {cat.players.map((p) => <div key={p} className="text-[11px] mono py-0.5" style={{ color: cat.accent }}>{p}</div>)}
                </div>
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>外资主导方</div>
                  {cat.foreign.map((p) => <div key={p} className="text-[11px] mono py-0.5" style={{ color: '#64748b' }}>{p}</div>)}
                </div>
              </Grid>
              {/* 国产化率进度条 */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span>国产化率</span><span style={{ color: TIER_COLOR(cat.localization) }}>{cat.localization}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'rgba(148,163,184,0.12)', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.localization}%`, height: '100%', borderRadius: 4, background: TIER_COLOR(cat.localization), transition: 'width .3s' }} />
                </div>
                <div className="flex justify-between text-[10px] mono mb-1 mt-3" style={{ color: 'var(--text-tertiary)' }}>
                  <span>外资垄断度（高端段）</span><span style={{ color: '#64748b' }}>{cat.gpsShare}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'rgba(148,163,184,0.12)', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.gpsShare}%`, height: '100%', borderRadius: 4, background: '#64748b', transition: 'width .3s' }} />
                </div>
              </div>
            </div>
          </Grid>
        </div>
        <Grid cols={2} className="mt-4">
          <div className="os-card p-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{cat.label} · 国产化率爬坡（示意 · %）</div>
            <EChart option={momentumOpt} style={{ height: 170 }} />
          </div>
          <div className="os-card p-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{cat.label} · 内外资份额（示意 · %）</div>
            <EChart option={shareDonut} style={{ height: 170 }} />
          </div>
        </Grid>
      </Card>

      {/* ---------------- 国产替代全景 ---------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="国产替代进度全景（分档着色 · 当前品类高亮 · %）">
          <EChart option={allCatBar} style={{ height: 250 }} />
          <div className="flex gap-4 mt-2 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
            <span><span style={{ color: '#10b981' }}>■</span> ≥60% 中场已过</span>
            <span><span style={{ color: '#e8a317' }}>■</span> 40–60% 替代中段</span>
            <span><span style={{ color: '#fb923c' }}>■</span> 25–40% 攻坚期</span>
            <span><span style={{ color: '#c41e3a' }}>■</span> &lt;25% 深水区</span>
          </div>
        </Card>
        <Card title="高端影像装机格局 · GPS 与联影的攻防（示意 · %）">
          <EChart option={gpsDonut} style={{ height: 220 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>GE/飞利浦/西门子（GPS）合计仍握高端影像六成上下份额；联影以全栈自研在 MRI/PET-CT 单点反超，但 GPS 的存量装机、服务网络与临床科研绑定构成长期防线。</p>
        </Card>
      </Grid>

      {/* ---------------- 自主度雷达 + 市场出海 ---------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="装备自主度雷达 · 中国 vs 国际巨头（示意 · 0–100）">
          <EChart option={autonomyRadar} style={{ height: 280 }} />
          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>整机集成与软件算法差距收窄最快；核心部件（球管/探测器/磁体/减速器）与高端市场占有是雷达上最深的两道缺口。</p>
        </Card>
        <Card title="国内市场 × 出海第二曲线（示意 · 双轴）">
          <EChart option={exportDual} style={{ height: 280 }} />
          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>集采压缩国内利润后，东南亚、中东、拉美与「一带一路」新兴市场成为性价比包抄的主航道；对欧美出口则受注册周期与地缘审查双重约束。</p>
        </Card>
      </Grid>

      {/* ---------------- 集采与创新张力 ---------------- */}
      <Card title="集采与创新的制度张力 · 一只手压价，一只手开门" className="mb-6">
        <Grid cols={2}>
          <div>
            <EChart option={tensionBar} style={{ height: 240 }} />
            <p className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>左轴：历年国家/联盟集采平均降幅（示意） · 右轴：创新医疗器械年度获批件数（示意）</p>
          </div>
          <div className="space-y-3">
            {[['集采的双刃', '冠脉支架均价从 1.3 万降至 700 元上下：以价换量让国产份额冲过 70%，但毛利坍缩同时压缩了再研发弹药——替代完成的品类立即面临「内卷出清」。', '#c41e3a'],
              ['创新械通道', '创新医疗器械特别审查程序（绿色通道）将审批周期压缩约 1/3，2024 年获批量约为 2019 年三倍；制度意图明确：集采管存量、创新开增量。', '#10b981'],
              ['张力的本质', '压价提升可及性、获批激励创新，但二者在企业现金流上相互拉扯。能同时穿越集采与创新周期的，只有具备核心部件自研与出海第二曲线的头部厂商。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
        <div className="mt-4">
          <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>集采落地品类 · 国产/外资份额结构（示意 · %）</div>
          <EChart option={channelStack} style={{ height: 220 }} />
        </div>
      </Card>

      {/* ---------------- 三线突破（保留） ---------------- */}
      <Card title="影像设备与高端器械 · MRI / CT / PET-CT 三线突破" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>MRI、CT、PET-CT 与国产超导、探测器、关键部件突破，是进口替代的主战场。</p>
        <Grid cols={3}>
          {[['磁共振成像 (MRI)', '国产 1.5T 普及、3.0T 放量，头部企业攻关 5.0T 与 9.4T 超高端；超导磁体与线圈自主化推进。', '场强 1.5–9.4T · 国产份额提升', '#c41e3a'],
            ['高端 CT', '从 16 排到 640 排，国产宽体 CT 与能谱 CT 放量；X 射线管、探测器国产替代加速。', '排数 16–640 · 国产份额提升', '#22d3ee'],
            ['PET-CT 与核医学成像', '国产 PET-CT 装机与放射性药物配套跟进；探测器、晶体与多模态融合（PET-MR）为长期攻关方向，与肿瘤早筛、精准诊疗绑定。', '示踪剂自主推进 · 国产装机约 40%', '#10b981']].map(([t, d, m, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <div className="text-[10px] mt-2 mono" style={{ color: c }}>{m}</div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="医疗器械市场规模（万亿元 · 药监局/行业机构 · 示意）"><EChart option={marketScale} style={{ height: 240 }} /></Card>
        <Card title="高端器械国产化率对比（2020 vs 2024E · %）"><EChart option={localizationBar} style={{ height: 240 }} /></Card>
      </Grid>

      {/* ---------------- GPS 三层对标 + 手术机器人（保留） ---------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="GPS 三巨头对标 · 进口替代的真实坐标">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>GE、Philips、Siemens（GPS）长期占据高端影像装机主导，国产厂商（联影等）以整机性价比 + 集采准入切入，再向核心部件与超高端机型纵深替代。</p>
          <div className="space-y-2">
            {[['整机层', '国产 1.5T/64 排已具竞争力，3.0T 与宽体 CT 进入三级医院；超高端（5.0T、能谱）仍是 GPS 优势区。', '#c41e3a'],
              ['部件层', '球管、探测器、超导磁体国产化率低于整机，是「替代深水区」与卡脖子风险点。', '#e8a317'],
              ['生态层', '装机后服务、临床科研合作与医生培训体系决定长期粘性，GPS 沉淀数十年，国产正在补课。', '#22d3ee']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="手术机器人 · 腔镜放量与骨科、神外拓展">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>进口多孔腔镜仍占高端份额，国产在获批术式、成本与服务体系上追赶；5G 远程主从手术在示教与应急场景落地，受制于网络时延与责任界定。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>腔镜手术机器人</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>机械臂精度、力反馈与视觉融合决定临床可替代空间；培训与跟台体系是商业化关键变量。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>5G 远程主从手术</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>端到端时延需稳定低于约 10ms 量级方可主从同步；当前多用于指导与部分术式验证。</p></div>
            <div className="text-[10px] mono mt-2" style={{ color: LABEL.color }}>精度: 追赶 · 装机: 放量 · 术式: 拓展</div>
          </div>
        </Card>
      </Grid>

      {/* ---------------- 数字化与 AI（保留） ---------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="医疗 AI 应用结构（示意 · %）"><EChart option={aiDonut} style={{ height: 240 }} /></Card>
        <Card title="数字化 · AI + 影像、病理与医院信息化">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>AI 辅助诊断、结构化病历与 DRG/DIP 联动改变医院运营；三类证审批与真实世界数据（RWE）决定产品生命周期与入院节奏。</p>
          <Grid cols={2}>
            <div className="os-card p-3 text-center"><div className="text-lg font-bold mono" style={{ color: '#22d3ee' }}>&gt;95%</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>AI 影像示意敏感度（特定病种辅助筛查）</div></div>
            <div className="os-card p-3 text-center"><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>3,000+ 项</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>数字疗法与软件在研管线（含非三类）</div></div>
          </Grid>
        </Card>
      </Grid>

      {/* ---------------- 替代之路时间轴 ---------------- */}
      <Card title="替代之路 · 四十年攻防时间轴（点选阶段）" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ---------------- 战略结论（保留） ---------------- */}
      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 国产替代与创新并行', '集采压价与绿色通道并行，高端影像、机器人与 AI 软件构成三条主战线。'],
            ['2 · 支付与入院节奏', 'DRG/DIP 与医院资本开支周期决定设备更新；高值耗材「量价」再平衡是常态约束。'],
            ['3 · 供应链与合规', '核心部件（球管、探测器、磁体）与放射性药物仍存对外依赖，出海需同步适配海外监管与临床证据链。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>健康中国 2030 将医疗装备从「采购清单」提升为公共卫生能力与产业安全变量；器械竞争力是临床可及性与产业链韧性的交集。</p></Card>

      <FrameworkTrio cards={[
        {
          key: 'salt', title: '高端破壁', subtitle: '影像三巨头垄断的攻坚',
          body: 'GPS 在高端影像沉淀数十年的不只是技术，还有装机存量、服务网络与临床科研绑定。国产破壁走的是「全栈自研 + 单点反超」路线：联影以 uEXPLORER 在 PET-CT 单点全球领先，撬动整个高端序列的临床信任。',
          pillars: [['全栈自研', '整机—部件—软件垂直打通，避免被上游卡死'], ['单点反超', '用一个全球第一改写「国产=低端」叙事'], ['政策杠杆', '配置证 + 优秀国产遴选倾斜装机窗口']],
        },
        {
          key: 'stone', title: '临床生态', subtitle: '替代 = 性能 + 习惯 + 服务',
          body: '装备替代从来不是参数表竞赛：医生的操作习惯、跟台培训、术式认证、装机后 7×24 服务响应，共同构成外资最深的护城河。软式内镜与手术机器人替代率低于 20%，卡点一半在技术，一半在生态。',
          pillars: [['医生迁移', '培训中心 + 学术合作降低换机成本'], ['服务网络', '县域响应速度成为国产反超的杠杆'], ['真实世界证据', 'RWE 数据回流加速临床信任积累']],
        },
        {
          key: 'path', title: '出海第二曲线', subtitle: '新兴市场的性价比包抄',
          body: '集采压缩国内利润后，出海从「可选项」变成「生存项」。东南亚、中东、拉美与一带一路市场对性价比敏感、监管壁垒相对低，是国产装备复制「农村包围城市」的全球版图；欧美注册则是品牌天花板之战。',
          pillars: [['新兴市场放量', '性价比 + 整体解决方案打包输出'], ['本地化深耕', '海外装机 + 服务团队属地化建设'], ['欧美认证', 'FDA/CE 注册撑开品牌与利润天花板']],
        },
      ]} />
      <ModuleFooter moduleId="medequipment" disclaimer="本页数据为公开资料整理之示意值，非官方统计 · 仅供产业分析框架参考，不构成任何医疗建议或投资建议" />
    </div>
  );
}
