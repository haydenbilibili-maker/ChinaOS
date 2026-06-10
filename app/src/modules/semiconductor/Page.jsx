import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 一、产业链七环节 · 自主度/格局/卡脖子/突破/代表企业（示意值）
// ============================================================================
const CHAIN = [
  {
    key: 'eda', label: 'EDA / IP', accent: '#c41e3a', autonomy: 12,
    title: 'EDA 工具与 IP 核 · 数字世界的「绘图权」',
    landscape: 'Synopsys / Cadence / Siemens EDA 三家合计占全球 ~75% 份额；ARM 垄断移动端 IP，x86 双寡头。没有 EDA，设计公司一行代码都流不出去。',
    choke: '先进工艺（7nm 以下）全流程 EDA 对华禁售；ARM 最新架构授权受审查；先进节点 PDK 与验证算力构成隐性壁垒。',
    breakthrough: '华大九天在模拟全流程接近可用；点工具（DRC/LVS、时序签核）逐点突破；RISC-V 生态成为 IP 备胎——但数字全流程仍缺整链。',
    players: '华大九天 · 概伦电子 · 广立微 · 芯华章 · 平头哥(RISC-V)',
    radar: [12, 55, 60, 35, 92],
    chokeLevel: 90,
  },
  {
    key: 'design', label: '芯片设计', accent: '#22d3ee', autonomy: 45,
    title: '芯片设计 (Fabless) · 离市场最近的环节',
    landscape: '美国 Fabless 占全球 ~60%+（NVIDIA/Qualcomm/AMD/Broadcom）；中国设计企业数量全球第一（3000+ 家），但营收高度长尾。',
    choke: 'AI 训练芯片（A100/H100 级）对华禁售触发倒逼；高端手机 SoC 依赖台积电先进代工——设计能力受制造天花板封顶。',
    breakthrough: '海思麒麟借 N+2 工艺回归；寒武纪/昇腾/海光在 AI 推理侧放量；长尾设计公司在 MCU、电源管理、射频前端蚕食成熟市场。',
    players: '华为海思 · 紫光展锐 · 寒武纪 · 海光 · 韦尔股份 · 兆易创新',
    radar: [45, 70, 75, 60, 88],
    chokeLevel: 72,
  },
  {
    key: 'fab', label: '制造代工', accent: '#e8a317', autonomy: 30,
    title: '晶圆制造 (Foundry) · 资本与良率的绞肉机',
    landscape: '台积电独占全球先进代工 ~60%+（3nm 以下近乎 100%）；三星追赶吃力；中芯国际全球第三但收入差一个量级。',
    choke: 'EUV 光刻机禁运封死 7nm 以下「正路」；美籍人才禁令抽走关键工艺团队；先进制程良率与成本受多重曝光拖累。',
    breakthrough: '中芯 N+2（等效 7nm）以 DUV 多重曝光实现量产并装入旗舰手机——成本与产能受限，但证明封锁线可被「斜向穿透」。',
    players: '中芯国际 · 华虹集团 · 晶合集成 · 长鑫/长存(IDM)',
    radar: [30, 95, 60, 55, 95],
    chokeLevel: 85,
  },
  {
    key: 'equip', label: '设备', accent: '#8b5cf6', autonomy: 18,
    title: '半导体设备 · 光刻链是最硬的约束',
    landscape: 'ASML 垄断 EUV（独家）与高端 DUV；应用材料/泛林/东京电子瓜分沉积刻蚀；五家美日荷企业控制设备市场 ~70%。',
    choke: 'EUV 完全禁运、浸没式 DUV 加码限制、设备维保与零部件断供条款——「卖给你的机器也能让它变砖」。',
    breakthrough: '北方华创进入全球设备商前十；中微刻蚀机打入台积电 5nm 产线；上海微电子 28nm 浸没式光刻机仍在攻坚——光刻机是最后的山头。',
    players: '北方华创 · 中微公司 · 拓荆科技 · 上海微电子 · 华海清科',
    radar: [18, 90, 50, 42, 98],
    chokeLevel: 98,
  },
  {
    key: 'material', label: '材料', accent: '#10b981', autonomy: 28,
    title: '半导体材料 · 看不见的「工业味精」',
    landscape: '日本控制光刻胶（JSR/信越/TOK ~80%）、大硅片（信越/SUMCO ~50%+）、电子特气关键品类；2019 日韩材料战展示其武器化潜力。',
    choke: '高端 ArF/EUV 光刻胶几乎全依赖进口；12 英寸大硅片认证周期 2-3 年；材料与工艺共演进，替换成本极高。',
    breakthrough: '沪硅产业 12 英寸硅片放量；南大光电 ArF 胶通过验证；电子特气国产化率快速爬升——材料是「慢变量」但替代不可逆。',
    players: '沪硅产业 · 南大光电 · 安集科技 · 雅克科技 · 华特气体',
    radar: [28, 60, 55, 48, 80],
    chokeLevel: 65,
  },
  {
    key: 'atp', label: '封测', accent: '#fb923c', autonomy: 75,
    title: '封装测试 (OSAT) · 防御带中的「已得分项」',
    landscape: '中国大陆封测全球份额 ~25%+，长电科技全球第三；台湾日月光居首。封测是中国半导体自主度最高的环节。',
    choke: '先进封装（CoWoS 级 2.5D/3D）产能集中于台积电；HBM 堆叠与混合键合设备仍受设备链制约。',
    breakthrough: 'Chiplet + 先进封装成为「等效制程跳跃」的国家路径：以成熟制程裸片 + 高密度互连补偿单片制程差距，封测从低端代工跃升为换道主战场。',
    players: '长电科技 · 通富微电 · 华天科技 · 甬矽电子',
    radar: [75, 55, 65, 70, 45],
    chokeLevel: 35,
  },
  {
    key: 'memory', label: '存储', accent: '#64748b', autonomy: 35,
    title: '存储芯片 · 大宗商品化的正面战场',
    landscape: '三星/SK 海力士/美光三分 DRAM；NAND 多寡头。存储是标准品，拼的是制程代际 + 产能成本——最像「重工业」的芯片。',
    choke: '长江存储被列实体清单，设备断供直接冻结扩产节奏；HBM（AI 显存）对华出口管制收紧，卡 AI 算力的「第二把锁」。',
    breakthrough: '长存 Xtacking 架构实现 232 层 NAND 全球第一梯队；长鑫 DRAM 追至 17nm 级并启动 HBM 攻关——封锁前抢出的身位。',
    players: '长江存储 · 长鑫存储 · 兆易创新(利基)',
    radar: [35, 92, 58, 50, 90],
    chokeLevel: 80,
  },
];

const RADAR_IND = [
  { name: '自主度', max: 100 }, { name: '资本强度', max: 100 }, { name: '人才储备', max: 100 },
  { name: '生态成熟', max: 100 }, { name: '管制敏感', max: 100 },
];

// ============================================================================
// 二、制程追赶曲线（全球最先进量产 vs 中国最先进量产 · nm · 示意）
// ============================================================================
const NODE_YEARS = ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024', '2026E'];
const NODE_GLOBAL = [32, 22, 16, 10, 7, 5, 3, 3, 2];
const NODE_CHINA = [65, 40, 28, 28, 14, 14, 7, 7, 5];

// ============================================================================
// 三、「小院高墙」出口管制层级（封锁强度 0-100 · 示意）
// ============================================================================
const BLOCKADE = [
  { name: 'EUV 光刻机', v: 100, c: '#c41e3a', note: '2019 起完全禁运 · 零交付' },
  { name: '浸没式 DUV', v: 85, c: '#e8a317', note: '2023 起新机+维保受限' },
  { name: '先进制程设备', v: 80, c: '#e8a317', note: '14/16nm 以下设备许可证制' },
  { name: 'AI 训练芯片', v: 75, c: '#fb923c', note: 'A100/H100 及阉割版迭代封堵' },
  { name: 'EDA (先进节点)', v: 70, c: '#fb923c', note: '7nm 以下全流程禁售' },
  { name: 'HBM 高带宽存储', v: 65, c: '#8b5cf6', note: 'AI 算力的第二把锁' },
  { name: '美籍人才任职', v: 60, c: '#22d3ee', note: '「美国人条款」抽走工艺团队' },
  { name: '成熟制程 (28nm+)', v: 15, c: '#10b981', note: '小院之外 · 反成中方产能武器' },
];

// ============================================================================
// 四、国产化率分档（示意） + 全球环节霸权 + 大基金三期投向
// ============================================================================
const LOCALIZATION = [
  { name: '封测', v: 75 }, { name: '成熟制程制造', v: 55 }, { name: '功率/模拟', v: 50 },
  { name: '材料(整体)', v: 28 }, { name: '设备(整体)', v: 18 }, { name: 'EDA', v: 12 }, { name: '先进制程', v: 8 },
];
const locColor = (v) => (v >= 60 ? '#10b981' : v >= 35 ? '#e8a317' : v >= 20 ? '#fb923c' : '#c41e3a');

const HEGEMONY = {
  categories: ['EDA/IP', '设计', '代工', '设备', '材料', '封测'],
  series: [
    { name: '美国', data: [78, 60, 10, 42, 12, 8], itemStyle: { color: '#c41e3a' } },
    { name: '中国台湾', data: [2, 18, 62, 1, 8, 38], itemStyle: { color: '#e8a317' } },
    { name: '日本/荷兰', data: [8, 6, 4, 45, 55, 6], itemStyle: { color: '#8b5cf6' } },
    { name: '韩国', data: [1, 6, 16, 2, 8, 8], itemStyle: { color: '#22d3ee' } },
    { name: '中国大陆', data: [3, 8, 7, 6, 12, 28], itemStyle: { color: '#10b981' } },
    { name: '其他', data: [8, 2, 1, 4, 5, 12], itemStyle: { color: '#64748b' } },
  ],
};

const FUND3_DONUT = [
  { name: '制造产能(成熟+特色)', value: 40, itemStyle: { color: '#c41e3a' } },
  { name: '设备攻关(光刻链)', value: 25, itemStyle: { color: '#8b5cf6' } },
  { name: '材料与零部件', value: 15, itemStyle: { color: '#10b981' } },
  { name: '设计与 EDA', value: 12, itemStyle: { color: '#22d3ee' } },
  { name: '先进封装/HBM', value: 8, itemStyle: { color: '#fb923c' } },
];

// ============================================================================
// 五、芯片之路时间线
// ============================================================================
const STAGES = [
  { period: '1990-1999', title: '908/909 工程', accent: '#64748b', desc: '国家级攻关起步即受《瓦森纳协定》代差锁定：「建成即落后两代」。908 工程审批七年，投产即亏损；909 工程（华虹）以举国之力换一条 8 英寸线。教训写进基因：行政审批速度跑不过摩尔定律。' },
  { period: '2000-2013', title: '中芯国际 · 市场化试水', accent: '#22d3ee', desc: '张汝京携团队建厂，走「海归 + 外资 + 代工」路线，速度空前——但台积电专利战与股权动荡暴露软肋：没有主权资本护航的追赶者，会在知识产权与资本市场两条战线被绞杀。' },
  { period: '2014-2018', title: '大基金 I/II 期 · 国家资本入场', accent: '#e8a317', desc: '《国家集成电路产业发展推进纲要》+ 大基金一期 1387 亿、二期 2041 亿——主权资本以股权投资替代行政拨款，撬动地方与社会资本数倍杠杆。产能与营收起飞，但「重制造轻设备材料」的结构性偏科埋下伏笔。' },
  { period: '2018-2022', title: '实体清单 · 极限施压', accent: '#c41e3a', desc: '中兴休克、华为断供、EUV 禁运、2022.10 全面设备管制——美国把芯片从商品重新定义为战略武器。封锁的意外后果：国产设备材料获得「保送验证」的市场，替代从「可选项」变成「生死题」。' },
  { period: '2023-2024', title: '7nm 突破 · 大基金 III 期', accent: '#8b5cf6', desc: 'Mate 60 搭载国产 N+2 芯片回归，证明 DUV 多重曝光可斜向穿透封锁线；大基金三期 3440 亿注册资本超前两期之和，投向明确转向设备、材料、HBM——补齐偏科，对准光刻链最后山头。' },
  { period: '2025→', title: '全链自主攻坚', accent: '#10b981', desc: '终局问题只剩一个：国产光刻机能否在 EUV 锁死的窗口期内完成 DUV 自主 + 下一代技术路线（如 SSMB/LDP）卡位。同时以成熟制程产能优势反向施压全球供应链——封锁与反封锁进入消耗战。' },
];

// ============================================================================
// 组件
// ============================================================================
export default function Page() {
  const [link, setLink] = useState('eda');
  const [stageIdx, setStageIdx] = useState(4);
  const seg = CHAIN.find((c) => c.key === link);

  // 制程追赶曲线（log y 轴，nm 越小越先进）
  const nodeChart = useMemo(() => ({
    tooltip: { trigger: 'axis', formatter: (ps) => ps.map((p) => `${p.seriesName}: ${p.value}nm`).join('<br/>') },
    legend: { data: ['全球最先进量产', '中国最先进量产'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { ...GRID, top: 30, left: 44 },
    xAxis: categoryX(NODE_YEARS),
    yAxis: logY({ name: 'nm(log)', nameTextStyle: { color: '#5b6a82', fontSize: 10 }, inverse: true }),
    series: [
      { name: '全球最先进量产', type: 'line', data: NODE_GLOBAL, smooth: false, symbol: 'circle', symbolSize: 7, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '中国最先进量产', type: 'line', data: NODE_CHINA, smooth: false, symbol: 'diamond', symbolSize: 8, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' },
        markPoint: { data: [{ coord: ['2022', 7], value: '7nm\n突破', itemStyle: { color: '#e8a317' }, label: { fontSize: 9, color: '#0b1120' } }], symbolSize: 44 },
        markLine: { silent: true, lineStyle: { color: 'rgba(232,163,23,0.5)', type: 'dashed' }, label: { color: '#e8a317', fontSize: 9, formatter: 'EUV 禁运线' }, data: [{ xAxis: '2020' }] } },
    ],
  }), []);

  // 小院高墙封锁强度（横向 bar）
  const blockadeChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => { const i = ps[0].dataIndex; return `${BLOCKADE[i].name}：强度 ${BLOCKADE[i].v}<br/>${BLOCKADE[i].note}`; } },
    grid: { left: 100, right: 36, top: 8, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: { type: 'category', data: BLOCKADE.map((b) => b.name).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', barWidth: 12, data: BLOCKADE.map((b) => ({ value: b.v, itemStyle: { color: b.c, borderRadius: [0, 3, 3, 0] } })).reverse(), label: { show: true, position: 'right', color: '#5b6a82', fontSize: 9 } }],
  }), []);

  // 产业链自主度双系列雷达（中国 vs 全球第一梯队 · 内联）
  const dualRadar = useMemo(() => ({
    legend: { data: ['中国', '全球第一梯队'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    radar: {
      indicator: [{ name: 'EDA', max: 100 }, { name: '设备', max: 100 }, { name: '材料', max: 100 }, { name: '制造', max: 100 }, { name: '设计', max: 100 }, { name: '封测', max: 100 }],
      axisName: { color: '#93a1b5', fontSize: 10 }, radius: '62%',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: [12, 18, 28, 30, 45, 75], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
        { value: [95, 95, 92, 98, 95, 90], name: '全球第一梯队', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      ],
    }],
  }), []);

  // 国产化率分档 bar
  const locChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { ...GRID, left: 44 },
    xAxis: categoryX(LOCALIZATION.map((d) => d.name), { interval: 0, rotate: 24 }),
    yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'bar', barWidth: 22,
      data: LOCALIZATION.map((d) => ({ value: d.v, itemStyle: { color: locColor(d.v), borderRadius: [3, 3, 0, 0] } })),
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 9, formatter: '{c}%' },
      markLine: { silent: true, lineStyle: { color: 'rgba(232,163,23,0.5)', type: 'dashed' }, label: { color: '#e8a317', fontSize: 9, formatter: '安全线 35%' }, data: [{ yAxis: 35 }] },
    }],
  }), []);

  // 全球环节霸权 stackedBar
  const hegemonyChart = useMemo(() => stackedBarOpt({ categories: HEGEMONY.categories, series: HEGEMONY.series }), []);

  // 保留：IC 进出口 + 大基金一二三期结构
  const ieChart = useMemo(() => ({
    legend: { data: ['进口', '出口'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { left: 44, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(['2019', '2021', '2023', '2024E']),
    yAxis: valueY({ name: '亿$', nameTextStyle: { color: '#5b6a82', fontSize: 10 } }),
    series: [
      { name: '进口', type: 'bar', data: [3055, 4326, 3494, 3850], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
      { name: '出口', type: 'bar', data: [1015, 1538, 1360, 1500], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  const fundChart = useMemo(() => stackedBarOpt({
    categories: ['一期 1387亿', '二期 2041亿', '三期 3440亿'],
    series: [
      { name: '制造/设计', data: [70, 55, 45], itemStyle: { color: '#c41e3a' } },
      { name: '设备材料', data: [20, 35, 40], itemStyle: { color: '#22d3ee' } },
      { name: '封装/其他', data: [10, 10, 15], itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  const fund3Donut = useMemo(() => donutOpt(FUND3_DONUT), []);
  const segRadar = useMemo(() => radarOpt(RADAR_IND, seg.radar, { name: seg.label, color: seg.accent }), [seg]);

  return (
    <div>
      <PageHeader badge="Semiconductor · 芯片主权" title="半导体与芯片主权" subtitle="制程追赶 · 小院高墙 · 大基金三期 —— 算力时代的石油、火药与国境线" />

      <IntroCard>
        芯片是数字时代的<strong style={{ color: 'var(--text-primary)' }}>石油与火药</strong>：既是一切算力的燃料，也是大国博弈的武器。中国是全球最大芯片进口国（年进口额一度超过原油），却在 EDA、光刻机、高端材料上被「小院高墙」精准锁喉。这里没有温情叙事——只有<strong style={{ color: 'var(--text-primary)' }}>权力的物理学</strong>：谁控制 13.5nm 波长的极紫外光，谁就控制 7nm 以下的物理世界；而中国的回答是成熟制程产能包抄 + Chiplet 换道 + 万亿主权资本的全链替代消耗战。本页拆解七个产业链环节的封锁与突围。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~20-25%" label="芯片自给率(口径存争议)" accent="#c41e3a" />
        <Stat value="3440 亿¥" label="大基金三期注册资本" accent="#e8a317" />
        <Stat value="~30%" label="全球晶圆产能份额(E·含外资在华)" accent="#22d3ee" />
        <Stat value="3000+" label="芯片设计企业数" accent="#8b5cf6" />
      </Grid>

      {/* ====== 产业链环节选择器 ====== */}
      <Card title="产业链七环节 · 点选看封锁与突围" className="mb-6">
        <SelectorBar items={CHAIN} activeKey={link} onSelect={setLink} />
        <Grid cols={2}>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: seg.accent }}>{seg.title}</div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold mono" style={{ color: locColor(seg.autonomy) }}>{seg.autonomy}%</span>
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>自主度(示意) · 封锁强度 {seg.chokeLevel}/100</span>
            </div>
            <div className="space-y-2">
              <div style={{ borderLeft: '2px solid #64748b', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>全球格局</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{seg.landscape}</p>
              </div>
              <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>卡脖子点</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{seg.choke}</p>
              </div>
              <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>突破进展</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{seg.breakthrough}</p>
              </div>
              <div style={{ borderLeft: `2px solid ${seg.accent}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>代表企业</div>
                <p className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{seg.players}</p>
              </div>
            </div>
          </div>
          <div>
            <EChart option={segRadar} style={{ height: 230 }} />
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>五维画像：自主度越低 + 管制敏感越高 = 越接近「小院」核心。封测是唯一进入安全区的环节。</p>
          </div>
        </Grid>
      </Card>

      {/* ====== 制程追赶 + 封锁图谱 ====== */}
      <Grid cols={2} className="mb-6">
        <Card title="制程追赶曲线 · 全球 vs 中国量产节点（nm · 越低越先进）">
          <EChart option={nodeChart} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>2020 EUV 禁运线后两曲线本应发散，2022 国产 7nm（DUV 多重曝光）令差距重新收敛至 2-3 代——以良率和成本为代价换时间窗口。</p>
        </Card>
        <Card title="「小院高墙」封锁图谱 · 出口管制强度（0-100 示意）">
          <EChart option={blockadeChart} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>封锁强度的精确分层暴露其逻辑：锁先进、放成熟——而成熟制程恰是中方产能反包抄的出口。</p>
        </Card>
      </Grid>

      {/* ====== 双系列雷达 + 国产化率 ====== */}
      <Grid cols={2} className="mb-6">
        <Card title="产业链自主度雷达 · 中国 vs 全球第一梯队">
          <EChart option={dualRadar} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>缺口最深处（EDA/设备）正是大基金三期资本投向最重处——主权资本按雷达图的「凹陷」配置弹药。</p>
        </Card>
        <Card title="国产化率进度 · 分档着色（示意）">
          <EChart option={locChart} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>绿色=已建立防御带；橙红=仍在火线下。35% 被视为供应链「断供可生存」的经验安全线。</p>
        </Card>
      </Grid>

      {/* ====== 大基金 + 进出口 ====== */}
      <Grid cols={2} className="mb-6">
        <Card title="大基金三期投向结构（% · 示意）">
          <EChart option={fund3Donut} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>三期 3440 亿超一二期之和；设备+材料合计四成——万亿级主权资本明确押注「最后的山头」光刻链与上游。</p>
        </Card>
        <Card title="大基金 I/II/III 期投向演变（堆叠 % · 示意）">
          <EChart option={fundChart} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>从「重制造设计」到「补设备材料」：结构迁移本身就是对一二期偏科的纠错——资本密度须转化为良率数据闭环，否则只是过剩产能。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="全球环节霸权 · 各环节份额分布（% · 示意）">
          <EChart option={hegemonyChart} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>设计美国、代工台湾、设备美荷日、材料日本——半导体是「没有一国能单独完成」的全球分工，这正是封锁与反制都有效的原因。</p>
        </Card>
        <Card title="IC 进出口与逆差（亿$ · 示意）">
          <EChart option={ieChart} style={{ height: 250 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>年逆差 ~2300-2800 亿$：芯片长期是中国第一大进口商品。每一个百分点的国产替代都是百亿美元级的贸易结构改写。</p>
        </Card>
      </Grid>

      {/* ====== 时间线 ====== */}
      <Card title="芯片之路 · 从 908 工程到全链攻坚" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ====== 战略结论（保留并强化） ====== */}
      <Card title="战略结论 · 权力的物理学" className="mb-6">
        <Grid cols={3}>
          {[['1 · 换道超车在封装与系统', 'EUV 短缺约束下，以 Chiplet、先进封装与系统级优化维持 AI/HPC 可用性，是物理约束下的理性选择——不是退而求其次，而是另一条收敛路径。'],
            ['2 · 功率与车规是现金牛', 'SiC、IGBT、车规 MCU 绑定新能源车与电网改造，成熟制程 + 确定政策红利 + 全球最大单一市场，构成自我造血的「防御带经济」。'],
            ['3 · 出口管制常态化', '设备、EDA、高算力 GPU 的长臂管辖使「芯片主权」与外交、金融制裁工具箱联动；镓锗稀土反制表明博弈已是双向消耗战。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="制度锚点" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          半导体是大基金、科创板与地方招商的交汇点，也是「举国体制 2.0」的压力测试场：以股权投资替代行政拨款、以市场退出约束投资纪律。但若缺乏良率与迭代数据闭环，资本密度会转化为武汉弘芯式的烂尾，而非技术主权。封锁的悖论在于——它替中国完成了市场最难完成的事：强制为国产设备材料创造了验证机会与订单。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '硅基权力', subtitle: '芯片 = 石油 + 火药', body: '芯片同时是燃料（一切算力的物质基础）与武器（断供即瘫痪）。控制 EUV 光源即控制 7nm 以下的物理世界——技术霸权在此呈现为对自然规律入口的垄断。', pillars: [['进口 ~4000 亿$', '超过原油的第一大宗。'], ['EUV 独家', 'ASML 一台机器锁一国。'], ['长臂管辖', '美技术含量>0 即受管。']] },
        { title: '小院高墙博弈', subtitle: '精准封锁 vs 全链替代', body: '美方逻辑：把最致命的少数技术圈进「小院」筑「高墙」，其余照常贸易。中方回应：既然不知道明天什么会进小院，就必须全链替代——精准封锁反而触发了最大化的脱钩。', pillars: [['实体清单', '休克疗法的免疫激活。'], ['7nm 斜穿', 'DUV 多重曝光证伪封死论。'], ['镓锗反制', '上游材料的对等筹码。']] },
        { title: '成熟制程包抄', subtitle: '28nm+ 的不对称战略', body: '先进制程打不进，就在成熟制程建立产能霸权：汽车、工控、家电芯片 70% 用 28nm+。当全球成熟产能重心移向中国，封锁方的车厂与军工供应链也将被反向人质化。', pillars: [['产能 ~30%', '全球份额持续抬升。'], ['Chiplet', '成熟裸片拼等效先进。'], ['硅盾联动', '与台海模块互为镜像。']] },
      ]} />

      <ModuleFooter moduleId="semiconductor" disclaimer="数据均为公开资料整理之示意值（自主度/封锁强度/份额等含主观评估），非官方统计 · 仅供分析框架参考，非投资建议" />
    </div>
  );
}
