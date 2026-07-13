import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 一 · 工程选择器数据：八大超级工程档案（示意值，量级参考公开报道）
// roi 五维：经济回报 / 战略价值 / 技术外溢 / 民生效益 / 生态代价（越高代价越大）
// ============================================================================
const PROJECTS = [
  {
    key: 'sanxia', label: '三峡工程', accent: '#22d3ee', status: '已建成',
    invest: 0.25, investLabel: '~2500亿元（动态总投资·示意）', period: '1994–2009（主体）',
    direct: '年发电约 1000 亿千瓦时级；电费现金流早已覆盖财务成本',
    spill: '防洪（荆江河段标准跃升）、航运（万吨级船队直达重庆）、水资源调度——三本账均不进商业报表',
    dispute: '百万移民安置、库区地质与生态、泥沙淤积的长期争论；财务账与国家账的张力样本',
    roi: [78, 92, 70, 85, 72],
    ledger: [['发电账', '财务可计量，已回本', '#10b981'], ['防洪账', '避免损失计量难，但单次大洪水避损可达千亿级', '#22d3ee'], ['航运账', '长江黄金水道运能跃升，外溢给沿江工业带', '#e8a317'], ['生态/移民账', '负债端：水库生态、131万移民的代际成本', '#c41e3a']],
  },
  {
    key: 'nsbd', label: '南水北调', accent: '#3b82f6', status: '东中线运行',
    invest: 0.5, investLabel: '~5000亿元+（东中线累计·示意）', period: '2002–2014（东中线通水）',
    direct: '中线年调水超百亿立方米，受水人口上亿；水费远不覆盖全成本',
    spill: '华北地下水超采治理、京津冀城市群水安全底座——「水权再分配」的国家级工程表达',
    dispute: '终端水价与财政补贴的可持续性、汉江中下游生态、西线高寒高海拔方案的巨大不确定性',
    roi: [35, 90, 45, 88, 68],
    ledger: [['水费账', '财务上长期亏损，靠财政与价格双轨维持', '#c41e3a'], ['水安全账', '华北平原地下水位止跌回升，战略含水层修复', '#22d3ee'], ['城市化账', '没有外调水就没有京津冀的人口与产业承载力', '#e8a317'], ['流域账', '调出区（汉江）的生态与发展权补偿仍在博弈', '#93a1b5']],
  },
  {
    key: 'uhv', label: '西电东送·特高压', accent: '#e8a317', status: '持续扩张',
    invest: 0.9, investLabel: '~9000亿元级（特高压累计·示意）', period: '2009 至今',
    direct: '±800kV/±1100kV 直流干线，单线送电能力达千万千瓦级；输电费现金流稳定',
    spill: '中国主导特高压国际标准；西部风光水电得以货币化，是「双碳」的物理前提',
    dispute: '点对点直流的灵活性短板、受端省份本地电源博弈、投资由全国电价分摊的隐性成本',
    roi: [72, 88, 95, 70, 35],
    ledger: [['输电账', '电网企业可计量回报，准许收益率模式', '#10b981'], ['能源安全账', '能源生产与消费的空间错配被电网强行抹平', '#e8a317'], ['标准账', 'IEC 特高压标准由中国主导——技术话语权变现', '#22d3ee'], ['碳账', '西部清洁电入东部负荷中心，碳减排计入国家承诺', '#3b82f6']],
  },
  {
    key: 'hsr', label: '高铁网', accent: '#c41e3a', status: '4.5万km+',
    invest: 6.0, investLabel: '~6万亿元级（累计投入·示意）', period: '2008 至今',
    direct: '京沪高铁等干线盈利；路网整体负债约 6 万亿级，多数中西部线路财务亏损',
    spill: '时空压缩重构经济地理：城市群一体化、要素流动加速、装备（CR450）与标准整体出口',
    dispute: '国铁集团债务可持续性、边际线路的客流密度、对民航与普铁公益运能的挤压',
    roi: [55, 95, 90, 92, 40],
    ledger: [['票务账', '干线赚钱、支线亏损——网络必须整体核算', '#c41e3a'], ['土地账', '高铁新城与沿线地价升值，收益落在地方财政', '#e8a317'], ['时间账', '人均出行时间节约 × 数亿人次 = 不进报表的国民生产率', '#22d3ee'], ['动员账', '战时与应急状态下的运力投送冗余，定价无解', '#93a1b5']],
  },
  {
    key: 'hzmb', label: '港珠澳大桥', accent: '#10b981', status: '已通车',
    invest: 0.13, investLabel: '~1269亿元（主体工程·示意）', period: '2009–2018',
    direct: '车流低于早期预测，通行费难覆盖财务成本；财务账上是「亏损工程」',
    spill: '沉管隧道、人工岛成套技术冲到世界前沿，直接反哺深中通道；大湾区一小时圈的政治粘合剂',
    dispute: '三地通关制度摩擦抑制车流——硬件世界级、制度软件拖后腿的典型案例',
    roi: [25, 85, 88, 60, 30],
    ledger: [['通行费账', '财务回收期遥遥无期，账面长期亏损', '#c41e3a'], ['湾区整合账', '港澳与内地的物理连接本身即政治资产', '#10b981'], ['技术账', '外海沉管技术从被国外天价报价到自主反超', '#22d3ee'], ['门面账', '国家工程能力的展示橱窗——权力的可见性', '#e8a317']],
  },
  {
    key: 'baihetan', label: '白鹤滩水电', accent: '#a78bfa', status: '已投产',
    invest: 0.22, investLabel: '~2200亿元（动态投资·示意）', period: '2017–2022',
    direct: '1600万千瓦装机、全球单机容量最大（100万千瓦水轮机组）；发电现金流优质',
    spill: '百万千瓦级水电机组全产业链国产化封顶；与乌东德、溪洛渡、向家坝构成梯级调度集群',
    dispute: '金沙江干流梯级开发的生态累积效应、移民安置、下游来沙锐减的长期影响',
    roi: [82, 80, 85, 65, 60],
    ledger: [['电力账', '大水电是现金牛，财务模型最接近商业逻辑', '#10b981'], ['装备账', '100万千瓦机组国产化 = 水电装备的工业能力天花板', '#a78bfa'], ['调度账', '梯级水库群参与全国电力平衡与防洪体系', '#22d3ee'], ['生态账', '干流连续筑坝的代价由流域生态系统长期支付', '#c41e3a']],
  },
  {
    key: 'yaxia', label: '雅下水电（在建）', accent: '#f97316', status: '2025开工',
    invest: 1.2, investLabel: '~1.2万亿元级（规划量级·示意）', period: '2025 起 · 工期超10年',
    direct: '规划装机约 6000–8100万千瓦级（约三个三峡），建成后年发电量 3000 亿千瓦时级',
    spill: '史上最大单体基建：隧洞引水截弯取直、超高海拔施工、藏东南交通电网整体重构、地缘水资源筹码',
    dispute: '跨境河流（布拉马普特拉河）的下游反应、高烈度地震带风险、超长工期内的成本失控可能',
    roi: [60, 100, 92, 55, 75],
    ledger: [['电力账', '电送粤港澳/长三角，财务模型依赖特高压配套', '#10b981'], ['地缘账', '跨境水资源的事实控制权——不可定价的筹码', '#f97316'], ['边疆账', '藏东南基础设施密度跃升，治理纵深实体化', '#c41e3a'], ['工程账', '把隧洞、高坝、装备能力再推一个数量级', '#22d3ee']],
  },
  {
    key: 'css', label: '中国空间站', accent: '#64748b', status: '常态运营',
    invest: 0.15, investLabel: '~1500亿元级（累计估算·示意）', period: '2021 组装完成',
    direct: '无直接商业现金流；运营成本持续投入',
    spill: '载人航天全链条能力（长征五号B/七号、交会对接、出舱、再生生保）；国际空间站退役后或成唯一在轨空间站',
    dispute: '纯财务视角下零回报；其价值全部记在科技主权、国际话语权与人才管线上',
    roi: [10, 95, 90, 30, 15],
    ledger: [['商业账', '几乎为零——这是刻意为之的非商业工程', '#c41e3a'], ['主权账', '近地轨道长期载人存在 = 大国身份的硬通货', '#64748b'], ['科研账', '微重力实验平台向全球开放，议程设置权', '#22d3ee'], ['人才账', '一整代航天工程师的训练场与忠诚装置', '#e8a317']],
  },
];

// ============================================================================
// 二 · 投资规模横向对比（横向 bar，雅下顶格）
// ============================================================================
const investBar = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => `${ps[0].name}<br/>投资量级：约 ${ps[0].value} 万亿元（示意）` },
  grid: { left: 110, right: 40, top: 16, bottom: 24 },
  xAxis: valueY({ name: '万亿元', nameTextStyle: { color: LABEL.color } }),
  yAxis: { type: 'category', data: [...PROJECTS].sort((a, b) => a.invest - b.invest).map((p) => p.label), axisLine: AXIS, axisLabel: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 14,
    data: [...PROJECTS].sort((a, b) => a.invest - b.invest).map((p) => ({ value: p.invest, itemStyle: { color: p.accent, borderRadius: 3, opacity: 0.9 } })),
    label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c} 万亿' },
  }],
};

// ============================================================================
// 三 · 高铁网络效应：营业里程增长 + 网络价值（梅特卡夫式示意）
// ============================================================================
const HSR_YEARS = ['2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024', '2025E'];
const HSR_KM = [0.07, 0.5, 0.9, 1.6, 2.2, 2.9, 3.8, 4.2, 4.7, 4.8];
const hsrGrowth = {
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 48, top: 36, bottom: 24 },
  xAxis: categoryX(HSR_YEARS),
  yAxis: [
    valueY({ name: '万公里', nameTextStyle: { color: LABEL.color } }),
    { type: 'value', name: '网络效应指数', nameTextStyle: { color: LABEL.color }, splitLine: { show: false }, axisLabel: { color: LABEL.color, fontSize: 10 } },
  ],
  series: [
    { name: '高铁营业里程（万公里）', type: 'bar', barWidth: 16, data: HSR_KM, itemStyle: { color: '#c41e3a', borderRadius: 3, opacity: 0.85 } },
    { name: '网络效应指数（节点²·示意）', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: HSR_KM.map((v) => Math.round(v * v * 10)), lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

const HSR_CORRIDORS = [
  ['八纵', '沿海 / 京沪 / 京港(台) / 京哈—京港澳 / 呼南 / 京昆 / 包(银)海 / 兰(西)广', '#c41e3a'],
  ['八横', '绥满 / 京兰 / 青银 / 陆桥 / 沿江 / 沪昆 / 厦渝 / 广昆', '#22d3ee'],
];

// ============================================================================
// 四 · 工程能力外溢：从国内工程内需到全球输出（示意指数）
// ============================================================================
const spilloverBar = stackedBarOpt({
  categories: ['盾构机', '特高压', '桥梁工程', '高铁装备', '水电机组', '港口机械'],
  series: [
    { name: '国内工程锤炼（能力积累指数）', data: [90, 95, 92, 95, 90, 88], itemStyle: { color: AXIS.lineStyle.color, borderRadius: 0 } },
    { name: '全球市场输出（份额/输出指数）', data: [70, 60, 55, 35, 45, 80], itemStyle: { color: '#e8a317', borderRadius: 3 } },
  ],
});

const SPILLOVER_NOTES = [
  ['盾构机', '从依赖进口到产销量全球第一，国产化率 90%+；地铁狂潮是它的训练场', '#e8a317'],
  ['特高压', '从设备到 IEC 标准的整体输出（巴西美丽山等项目）', '#22d3ee'],
  ['港口机械', '岸桥全球份额 70%+ ——超级港口群养出的隐形冠军', '#10b981'],
];

// ============================================================================
// 五 · 时间线：超级工程演进
// ============================================================================
const STAGES = [
  { period: '1953–1978', title: '156项工程·重工业奠基', accent: '#93a1b5', desc: '苏联援建 156 项重点工程奠定工业骨架；三线建设以国防逻辑重排工业地理。工程即国家意志的空间投影——财务核算从一开始就不在方程里。' },
  { period: '1980s–2000s', title: '三峡 / 西电东送 / 青藏铁路', accent: '#22d3ee', desc: '改革开放后第一代超级工程：三峡论证四十年后上马，西电东送把能源版图重写，青藏铁路把主权写进冻土。开始引入贷款与电费回收，但国家账本始终是主账本。' },
  { period: '2008–2015', title: '高铁狂飙·四万亿', accent: '#c41e3a', desc: '金融危机后基建作为逆周期武器全功率开动。高铁从 0 到世界第一里程只用十年；代价是路网负债与产能惯性——动员能力与债务约束的赛跑从此开始。' },
  { period: '2015–2022', title: '超级跨海·新基建', accent: '#10b981', desc: '港珠澳大桥、深中通道把跨海工程推到世界前沿；「新基建」（5G/特高压/算力）将工程逻辑从土木延伸到数字底座。工程能力开始成体系出口（雅万高铁）。' },
  { period: '2023 →', title: '雅下 / 深空深海新边疆', accent: '#f97316', desc: '雅下水电（1.2 万亿级）、空间站常态运营、深海开发——超级工程进入「无人区」：没有先例可抄、没有财务模型可套，纯粹以国家能力为担保的边疆推进。' },
];

// ============================================================================
// 六 · 决策底层逻辑（保留原有）
// ============================================================================
const LOGICS = [
  ['⚙ 逆周期调节与产能蓄水池', '#22d3ee', '下行周期中，大型工程可吸纳钢铁、水泥等基础产能，稳定就业并通过乘数效应传导信用与流动性（示意性表述）。'],
  ['🗺 打破胡焕庸线：空间资源重配', '#c41e3a', '南水北调、西气东输、西电东送等，以工程手段缓解资源与人口、产业的空间错配，支撑全国统一大市场物理连通。'],
  ['🛡 国家安全与底线思维', '#10b981', '大飞机、北斗、关键基础设施等，在地缘紧张背景下更强调供应链与技术自主，财务回报常退居次要。'],
];

// 投资重心演变：传统基建存量（柱）vs 新基建增速（线）—— 示意趋势（保留原有）
const infraTrend = {
  grid: { left: 48, right: 48, top: 36, bottom: 24 },
  legend: { top: 0, textStyle: { color: LABEL.color } },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024E', '2025E'], axisLine: AXIS },
  yAxis: [
    { type: 'value', name: '存量(万亿)', nameTextStyle: { color: LABEL.color }, splitLine: GRID_LINE },
    { type: 'value', name: '增速(%)', max: 35, nameTextStyle: { color: LABEL.color }, splitLine: { show: false } },
  ],
  series: [
    { name: '传统基建投资存量估算（万亿元·示意）', type: 'bar', data: [12, 14, 16, 17.5, 18.2, 18.8, 19.5, 21, 22.5, 23.5, 24.5], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3, opacity: 0.8 } },
    { name: '新基建投资增速（%·示意）', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [5, 8, 12, 18, 22, 28, 25, 20, 18, 15, 14], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

// 多维 ROI：资本市场模型 vs 综合战略取向（保留原有，双系列内联）
const roiRadarCompare = {
  legend: { bottom: 0, textStyle: { color: LABEL.color } },
  radar: {
    indicator: [{ name: '直接财务回报', max: 100 }, { name: '产业链带动', max: 100 }, { name: '区域协调', max: 100 }, { name: '地缘与国防安全', max: 100 }, { name: '前沿技术突破', max: 100 }],
    radius: '62%', axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
  },
  series: [{ type: 'radar', data: [
    { value: [30, 95, 90, 100, 95], name: '国家战略评估（示意）', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' } },
    { value: [95, 40, 10, 5, 60], name: '纯商业资本评估（示意）', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.15)' } },
  ] }],
};

const CASES = [
  ['🚄 八纵八横高铁网 · 时空压缩与经济重塑', '#c41e3a',
    '表层目标是城际通达、缓解春运等峰值出行压力；深层是缩短时空距离，强化京津冀、长三角、大湾区等轴带联系，装备与工程能力外溢至雅万高铁等境外项目，网络在人员物资快速投送上的应急动员价值常被讨论。',
    '争议与风险：建设与运营主体负债、中西部线路客流与财务可持续性、土地与环保约束等需长期平衡。'],
  ['🌊 南水北调 · 跨流域水资源配置', '#22d3ee',
    '东线、中线已大规模通水，西线方案仍在论证。缓解华北地下水超采、支撑城市与工业用水结构；同时涉及移民安置、生态补偿与调出区利益协调，以及长距离输水的成本、水价与财政补贴机制。',
    '争议与风险：终端水价与全成本回收、汉江等中下游生态与航运影响、干旱年调度规则等。'],
  ['💻 东数西算 · 算力与能源协同', '#e8a317',
    '八大枢纽、十大集群为国家发改委等公开布局框架。将时延不敏感算力向西部清洁能源优势区布局，降低 PUE 与碳强度，带动西部数字产业投资；核心热数据与低时延业务仍依赖东部与边缘节点。',
    '前沿挑战：跨区域算力调度、电价与市场机制、数据安全与灾备层级设计等。'],
];

const ROI_DIMS = ['经济回报', '战略价值', '技术外溢', '民生效益', '生态代价'];

export default function Page() {
  const [projKey, setProjKey] = useState('yaxia');
  const [stageIdx, setStageIdx] = useState(4);

  const proj = useMemo(() => PROJECTS.find((p) => p.key === projKey) || PROJECTS[0], [projKey]);
  const projRadar = useMemo(() => radarOpt(ROI_DIMS, proj.roi, { name: proj.label, color: proj.accent }), [proj]);

  return (
    <div>
      <PageHeader badge="Mega Projects · Macro-Strategy Briefing" title="超级工程 · 国家能力与空间重塑" subtitle="铁公基 · 胡焕庸线 · 多维 ROI · 国家账本 · 能力外溢" />

      <IntroCard>超级工程（Mega Projects）不仅是工程技术的集中展示，也是跨越发展陷阱、重塑经济地理、对冲地缘风险的宏观政策工具。在西方经济学语境下，许多超级工程因漫长投资回报期而显得「不经济」——但决策层往往同时核算<strong style={{ color: 'var(--text-primary)' }}>综合国家账本</strong>：外部性、安全与区域平衡。看懂超级工程，就是看懂「集中力量办大事」这台动员机器如何把权力意志变成混凝土、钢轨与轨道舱——以及这种能力的债务与生态对价。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="4.7万km+" label="高铁营业里程（2024·示意）· 全球占比超 2/3" accent="#c41e3a" />
        <Stat value="40+条" label="特高压交直流线路投运（累计·示意）" accent="#e8a317" />
        <Stat value="~1.2万亿" label="雅下水电规划投资量级（在建·示意）" accent="#f97316" />
        <Stat value="全球第一" label="盾构机/岸桥/水电机组 工程装备出口（示意）" accent="#22d3ee" />
      </Grid>

      {/* ============ 工程档案选择器 ============ */}
      <Card title="一 · 超级工程档案库 · 逐项核算（点选切换）" className="mb-6">
        <SelectorBar items={PROJECTS} activeKey={projKey} onSelect={setProjKey} />
        <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${proj.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-base font-semibold" style={{ color: proj.accent }}>{proj.label}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{proj.status}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{proj.period}</span>
            <span className="text-[11px] mono" style={{ color: proj.accent }}>{proj.investLabel}</span>
          </div>
          <Grid cols={3}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>直接收益</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{proj.direct}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>战略外溢</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{proj.spill}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>争议与风险</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{proj.dispute}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>多维 ROI 画像（五维·示意评分）</div>
            <EChart option={projRadar} style={{ height: 260 }} />
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「生态代价」维度分值越高代价越大——雷达面积大不等于「好工程」，而是「国家账本上动用的科目多」。</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>多账本拆解：{proj.label} 的国家记账法</div>
            <div className="space-y-2">
              {proj.ledger.map(([t, d, c]) => (
                <div key={t} className="flex gap-3 items-start" style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold mono shrink-0" style={{ color: c, minWidth: 64 }}>{t}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ============ 投资规模对比 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="二 · 投资规模横向对比（万亿元量级·示意）">
          <EChart option={investBar} style={{ height: 300 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>雅下水电以 1.2 万亿级单体投资顶格——约等于五个三峡。高铁网为累计路网投入，非单体工程，量级另当别论：它是「一个用六万亿写成的国土改写程序」。</p>
        </Card>
        <Card title="国家账本逻辑 · 双重记账法">
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>财务账本：</strong>现金流、回收期、DCF。按此标准，港珠澳大桥、南水北调、空间站都是「坏投资」；只有白鹤滩与干线高铁勉强及格。</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>国家账本：</strong>防洪避损、时空压缩、能源安全、技术主权、边疆实控、动员冗余——这些科目无法 IPO，但构成政权的物理基础。三峡的防洪账、高铁的动员账、雅下的地缘账，全部记在这里。</p>
            <p className="text-xs" style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10, color: 'var(--text-tertiary)' }}>权力物理学的核心命题：<strong>能把不赚钱但必要的工程持续干成，本身就是国家能力的硬指标</strong>——这正是多数发展中国家被卡住的地方。代价端同样真实：债务、生态与代际转移支付不会因记在「国家账本」上而消失。</p>
          </div>
        </Card>
      </Grid>

      {/* ============ 高铁网络效应 ============ */}
      <Card title="三 · 高铁网络效应 · 时空压缩的经济地理重构" className="mb-6">
        <EChart option={hsrGrowth} style={{ height: 280 }} />
        <Grid cols={2} className="mt-3">
          {HSR_CORRIDORS.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: c }}>{t}通道</div>
              <p className="text-[11px] mt-1 leading-relaxed mono" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>网络价值随节点数平方级增长（梅特卡夫式示意）：单条线路是交通工程，4.5 万公里成网后是<strong style={{ color: 'var(--text-secondary)' }}>经济地理操作系统</strong>——城市与「八纵八横」的拓扑距离，开始替代其与海岸线的物理距离，重新定价每一块土地。这也是路网敢于背负 6 万亿债务的底层赌注。</p>
      </Card>

      {/* ============ 工程能力外溢 ============ */}
      <Card title="四 · 工程能力外溢 · 从内需训练场到全球输出（示意指数）" className="mb-6">
        <EChart option={spilloverBar} style={{ height: 260 }} />
        <Grid cols={3} className="mt-3">
          {SPILLOVER_NOTES.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>路径高度一致：超大规模国内工程 → 装备被迫国产化 → 在本土极端工况中迭代 → 成本与性能双优 → 携标准出海。超级工程因此是<strong style={{ color: 'var(--text-secondary)' }}>装备与标准的孵化器</strong>——每一条隧道都是盾构机的考场，每一条特高压都是 IEC 标准的草稿纸。</p>
      </Card>

      {/* ============ 时间线 ============ */}
      <Card title="五 · 超级工程演进时间线（点选阶段）" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ============ 决策底层逻辑（保留） ============ */}
      <Card title="六 · 超级工程的决策底层逻辑" className="mb-6">
        <Grid cols={3}>
          {LOGICS.map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="七 · 投资重心演变：「铁公基」与「新基建」（示意趋势）" className="mb-6">
        <EChart option={infraTrend} style={{ height: 280 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>数据洞察：传统基建存量巨大、边际效益分化；新基建（5G、特高压、算力枢纽）增速阶段性走高，成为数字化与能源转型的载体之一。</p>
      </Card>

      <div className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>八 · 战略级案例拆解</div>
      <Grid cols={3} className="mb-6">
        {CASES.map(([t, c, body, risk]) => (
          <Card key={t} title={t}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
            <p className="text-[11px] mt-3 leading-relaxed" style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10, color: 'var(--text-tertiary)' }}>{risk}</p>
          </Card>
        ))}
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="九 · 多维 ROI：商业资本 vs 国家战略维度权重（示意）"><EChart option={roiRadarCompare} style={{ height: 300 }} /></Card>
        <Card title="资本市场模型 vs 综合战略取向">
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>商业 ROI 导向：</strong>强调现金流、回收期、DCF；对偏远线型基础设施往往给出偏低财务评分。</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>国家战略取向：</strong>将产业链、区域协调、安全与长期风险对冲纳入，财务指标仅为维度之一。</p>
            <p className="text-xs" style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10, color: 'var(--text-tertiary)' }}>审视超级工程时，需同时区分<strong>可货币化收益</strong>与<strong>公共品外部性</strong>，避免单一财务指标误判。</p>
          </div>
        </Card>
      </Grid>

      <Card title="系统观察" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>超级工程的真正回报写在「综合国家账本」上：逆周期托底、空间重配与安全冗余三者叠加，构成单一商业 ROI 无法捕捉的战略外部性；其代价——债务、生态与利益协调——同样需要长期核算。从 156 项工程到雅下水电，变的是工程对象，不变的是同一套动员语法：以政权信用为担保、以举国之力为杠杆、以数十年为周期下注。图表为定性趋势示意，不构成投资建议或工程审计依据。</p></Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '集中力量办大事', subtitle: '举国体制 · 工程表达', body: '超级工程是法家动员逻辑的现代化身：徭役变成专项债，征发变成央企集团军。能在十年尺度上锁定资源、压制否决点、贯彻单一意志——这种能力本身比任何单体工程更稀缺。', pillars: [['资源锁定', '财政+政策性金融+土地的三位一体融资'], ['否决点压制', '环评/移民/地方博弈在体制内闭环消化'], ['长周期信用', '以政权连续性担保跨届工程不烂尾']] },
        { key: 'stone', title: '多账本 ROI', subtitle: '不能只算财务账', body: '每个超级工程同时记五本账：财务账、安全账、空间账、技术账、政治账。财务账亏损不等于工程失败，但五本账全亏就是灾难——评估纪律在于诚实核算每一本，而非用「战略价值」一词掩盖全部赤字。', pillars: [['可货币化', '电费/票务/通行费——市场能定价的部分'], ['公共品外部性', '防洪/时空压缩/安全冗余——定价无解'], ['代价端', '债务/生态/移民——同样要进账本']] },
        { key: 'path', title: '能力溢出', subtitle: '工程=装备与标准孵化器', body: '超级工程的隐藏产出是工业能力本身：盾构机、特高压、百万千瓦机组都在国内工程的极端工况里完成进化，再携标准出海。下一站是雅下级地质、深空深海——工程边疆推到哪里，装备能力就被迫长到哪里。', pillars: [['内需训练场', '超大规模工程量是装备迭代的母体'], ['标准输出', '从产品出口升级为 IEC 级规则输出'], ['新边疆', '高海拔/深海/轨道——无先例工况倒逼']] },
      ]} />

      <ModuleFooter moduleId="megaprojects" disclaimer="投资额/里程/装机等均为公开报道量级示意，非官方统计 · 仅供分析框架参考，非投资建议或工程评估依据" sourceNote="由 mega-projects.html 独立报告迁移并按共享范式扩容" />
    </div>
  );
}
