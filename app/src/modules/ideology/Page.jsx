import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 意识形态理论分析（自由 / 马克思 / 民族 / 保守 / 新自由 / 无政府 / 社达 / 法西斯·反面参照）
// ----------------------------------------------------------------------------
// 思想史与政治哲学梳理，用于理解叙事背后的人性假设与历史观；非价值倡导。
// ============================================================================

const IDEOLOGIES = {
  liberalism: {
    label: '自由主义', color: '#22d3ee', origin: '洛克 · 密尔 · 哈耶克',
    human: '个体理性、自利且可自我决定；天赋权利先于国家。',
    value: '个人自由、私有产权、法治、有限政府、市场自发秩序。',
    state: '国家是「守夜人」：保护权利与契约，尽量不干预。',
    history: '非目的论：自由扩展是渐进试错，无必然终点。',
    critique: '被批评忽视实质不平等、原子化个人、市场失灵与公地问题。',
    project: '与「营商环境/法治/民营经济」模块的市场化逻辑相通，但与「集中力量办大事」张力明显。',
    radar: [95, 40, 25, 30, 50],
  },
  marxism: {
    label: '马克思主义', color: '#c41e3a', origin: '马克思 · 恩格斯 · 列宁',
    human: '人是社会关系的总和；意识由物质生产方式决定（存在决定意识）。',
    value: '消灭剥削、生产资料公有、按需分配、阶级解放。',
    state: '国家是阶级统治工具；过渡期无产阶级专政，终极目标国家消亡。',
    history: '历史唯物主义 · 目的论：生产力—生产关系矛盾推动社会形态依次演进。',
    critique: '被批评经济决定论过强、计划经济的信息与激励难题、实践中的集权风险。',
    project: '是「国有资本/共同富裕/制度演进」的理论底色；中国语境下与市场要素长期并轨（双轨）。',
    radar: [30, 95, 90, 95, 70],
  },
  socialdarwin: {
    label: '社会达尔文主义', color: '#e8a317', origin: '斯宾塞 · 萨姆纳（达尔文本人并不主张）',
    human: '人群如物种，竞争中「适者生存」；强弱分化是自然法则。',
    value: '竞争、效率、优胜劣汰；反对对弱者的「人为」扶助。',
    state: '国家应少干预，让竞争自然淘汰——极端形态滑向种族/国族优越论。',
    history: '将生物进化误用于社会：把现状强弱说成「自然且正当」。',
    critique: '科学上错误（自然选择≠社会应然）、伦理上危险（曾为殖民、优生、法西斯背书）。',
    project: '作为「反面参照系」：大国博弈中的丛林叙事、产业「内卷」与淘汰逻辑可借其识别与警惕。',
    radar: [70, 30, 60, 10, 85],
  },
  nationalism: {
    label: '民族主义', color: '#10b981', origin: '赫尔德 · 马志尼 · 费希特',
    human: '人首先是民族/国族共同体的成员；身份、语言与历史先于个体选择。',
    value: '民族自决、文化认同、主权统一、共同体优先于个人。',
    state: '国家应是民族意志的载体，对外捍卫主权、对内凝聚认同。',
    history: '半目的论：民族「复兴/崛起」叙事，把历史读作共同体命运的实现。',
    critique: '易滑向排外与族群对立；「想象的共同体」可被动员，掩盖内部阶级与利益分化。',
    project: '与「大国博弈/民族复兴/主权叙事」直接对接；是凝聚动员的强力话语，也是对外摩擦的火源。',
    radar: [35, 45, 70, 65, 60],
  },
  conservatism: {
    label: '保守主义', color: '#fb923c', origin: '柏克 · 奥克肖特 · 托克维尔',
    human: '人理性有限、易犯错；秩序与德性靠传统、习俗与中间团体维系。',
    value: '渐进改良、尊重传统与权威、家庭/社群/宗教等中间结构、审慎。',
    state: '国家应稳健有限，警惕激进重构；维护既有秩序与社会纽带。',
    history: '反目的论：拒斥宏大蓝图，相信经验积累胜于理性设计。',
    critique: '被批评为既得利益辩护、对结构性不公反应迟缓、抗拒必要变革。',
    project: '与「制度演进/稳中求进/治理审慎」相通；提供对激进改革的「刹车」视角与路径依赖解释。',
    radar: [50, 40, 50, 20, 45],
  },
  neoliberalism: {
    label: '新自由主义', color: '#8b5cf6', origin: '哈耶克 · 弗里德曼 · 朝圣山学社',
    human: '人是理性的市场行为者；价格信号比集中计划更能配置资源。',
    value: '私有化、放松管制、自由贸易、财政紧缩、市场扩展至更多领域。',
    state: '国家退为「市场守护者」：保护产权与竞争秩序，减少再分配干预。',
    history: '非目的论但有强方向感：相信市场化是通向效率与自由的普遍路径。',
    critique: '被批评加剧贫富分化、金融化风险、公共服务退化、「市场逻辑」侵蚀社会领域。',
    project: '是「市场化改革/营商环境/对外开放」的工具底色，但与「共同富裕/国有主导」存在再分配张力。',
    radar: [90, 30, 20, 35, 75],
  },
  anarchism: {
    label: '无政府主义', color: '#06b6d4', origin: '蒲鲁东 · 巴枯宁 · 克鲁泡特金',
    human: '人本可自治互助；强制性权威（而非人性）才是腐化与压迫之源。',
    value: '废除国家与强制等级、自愿结社、互助、直接民主、自下而上自治。',
    state: '反对国家本身：主张以横向、自治的联合体取代集中权力机器。',
    history: '反目的论且反集权：解放是去中心化的持续实践，无须经由国家阶段。',
    critique: '被批评在大规模社会中协调与防御难题、易陷入碎片化或被强权吞并。',
    project: '作为「极端去中心化」参照：用以审视平台自治、社区共治与「强国家」路径的边界与代价。',
    radar: [80, 75, 5, 15, 30],
  },
  fascism: {
    label: '法西斯主义', color: '#ef4444', origin: '反面参照 · 历史警示（墨索里尼 · 纳粹德国）',
    human: '否定个体与平等；个人只在为「民族/国家」献身的整体中才有意义。',
    value: '极端民族主义 + 领袖崇拜 + 暴力净化 + 反理性的意志神话；排斥多元。',
    state: '极权国家吞没社会：一党、一领袖、一意志，取消权利与制衡。',
    history: '伪目的论：以「民族再生/优等」神话动员，实为暴力与扩张的话语外衣。',
    critique: '历史已证其灾难性——战争、屠杀与极权恐怖；在思想史中作反面警示而非选项。',
    project: '【反面参照·历史警示】用以识别并警惕：领袖崇拜、暴力排外、取消制衡等危险信号，绝非倡导。',
    radar: [5, 10, 95, 90, 95],
  },
};
const RADAR_IND = [{ name: '个人主义', max: 100 }, { name: '平等取向', max: 100 }, { name: '国家干预', max: 100 }, { name: '历史目的论', max: 100 }, { name: '竞争/淘汰', max: 100 }];

const DIMS = [['人性假设', 'human'], ['核心价值', 'value'], ['国家角色', 'state'], ['历史观', 'history'], ['主要批判', 'critique'], ['项目投射', 'project']];

// ---- 议题立场矩阵：同一议题，八种答案（位置 0=极左/全干预侧标签 ↔ 100=极右/全放任侧标签）----
const ISSUES = {
  market: {
    label: '市场与再分配', left: '强再分配/公有', right: '纯市场/私有',
    pos: {
      liberalism: [68, '市场优先，但接受法治框架内的有限社会保障。'],
      marxism: [8, '生产资料公有是根本；再分配只是过渡手段，目标是消灭剥削本身。'],
      socialdarwin: [92, '反对扶助「弱者」：再分配被视为干扰自然淘汰。'],
      nationalism: [45, '市场服务于国族整体实力：可保护主义、可补贴，关键看是否壮大共同体。'],
      conservatism: [58, '尊重私产与市场，但警惕其瓦解社群纽带；支持温和的济贫传统。'],
      neoliberalism: [90, '私有化 + 放松管制 + 自由贸易；再分配压到最小。'],
      anarchism: [22, '反对资本等级也反对国家再分配：主张互助经济与工人自治。'],
      fascism: [50, '【反面参照】名义上「超越左右」：私产保留但完全服从国家战争动员。'],
    },
  },
  stateIndividual: {
    label: '国家与个人', left: '国家/集体优先', right: '个人绝对优先',
    pos: {
      liberalism: [85, '权利先于国家；国家越界即为暴政，个人是最终单位。'],
      marxism: [25, '阶级解放优先于个体偏好；但终极理想是「自由人的联合体」。'],
      socialdarwin: [70, '强个体崇拜：但「弱者」的个人权利不在保护之列。'],
      nationalism: [30, '个人因民族而有意义；危急时刻共同体可要求个体牺牲。'],
      conservatism: [55, '个人嵌于家庭与社群之中：既反国家全能，也反原子化个人。'],
      neoliberalism: [80, '个人即市场行为者；选择自由是最高价值。'],
      anarchism: [75, '个人自治至上——但通过自愿联合而非孤立原子实现。'],
      fascism: [3, '【反面参照】个人完全溶解于国家意志：极权吞没一切私域。'],
    },
  },
  migration: {
    label: '移民与边界', left: '开放边界', right: '封闭排外',
    pos: {
      liberalism: [30, '迁徙自由是基本权利的延伸；倾向开放但接受秩序管理。'],
      marxism: [20, '「全世界无产者联合起来」：阶级身份高于国族边界。'],
      socialdarwin: [88, '历史上为排外与种族等级提供「科学」外衣——典型误用。'],
      nationalism: [78, '边界即共同体的皮肤：移民须以同化与忠诚为前提。'],
      conservatism: [65, '审慎接纳：担心快速流入冲击既有文化与社会纽带。'],
      neoliberalism: [25, '劳动力也是要素：倾向开放流动以优化配置。'],
      anarchism: [5, '废除边界本身：国界是国家强制的产物。'],
      fascism: [98, '【反面参照】极端排外 + 种族净化神话：历史灾难的核心成分。'],
    },
  },
  tradition: {
    label: '传统与变革', left: '激进重构', right: '固守传统',
    pos: {
      liberalism: [40, '渐进改良：理性批判传统，但反对暴力推倒重来。'],
      marxism: [10, '革命性重构：旧上层建筑随生产关系一并改造。'],
      socialdarwin: [55, '现状强弱即「自然」：既不护传统也不求正义，只认淘汰结果。'],
      nationalism: [70, '从历史与传统中提取认同资源：常「发明传统」以凝聚共同体。'],
      conservatism: [88, '传统是世代试错的积淀；变革须如修船——逐板更换而不沉船。'],
      neoliberalism: [35, '对传统行业与体制持「创造性破坏」态度：效率优先于惯例。'],
      anarchism: [15, '反对一切世袭权威结构，包括以传统为名的等级。'],
      fascism: [60, '【反面参照】伪复古：借「光辉过去」神话行激进极权之实。'],
    },
  },
  globalization: {
    label: '全球化与主权', left: '全球整合', right: '主权至上',
    pos: {
      liberalism: [30, '国际法、自由贸易与普世权利：主权应受规则约束。'],
      marxism: [25, '资本本性即全球扩张；国际主义传统深厚，但警惕资本主导的全球化。'],
      socialdarwin: [75, '国际关系即丛林：强国扩张被说成「自然法则」。'],
      nationalism: [85, '主权不容稀释：全球化须服从国族利益的算术。'],
      conservatism: [60, '怀疑超国家工程：忠诚与认同难以越过民族国家尺度。'],
      neoliberalism: [12, '资本、商品、服务全球自由流动：主权让位于市场规则。'],
      anarchism: [40, '反对民族国家也反对资本全球化：主张草根跨国互助网络。'],
      fascism: [95, '【反面参照】极端主权神话 + 对外扩张：以「生存空间」为名。'],
    },
  },
  technology: {
    label: '技术与监管', left: '强监管/公共化', right: '完全放任',
    pos: {
      liberalism: [60, '创新自由优先，监管限于防止具体伤害（隐私、垄断）。'],
      marxism: [15, '技术是生产力也属生产关系：平台与数据应公共化而非私人垄断。'],
      socialdarwin: [85, '技术竞赛即淘汰赛：落后者出局被视为当然。'],
      nationalism: [35, '技术即国力：举国攻关、自主可控、防「卡脖子」。'],
      conservatism: [45, '对颠覆性技术持审慎默认：先问代价，再谈速度。'],
      neoliberalism: [88, '监管即扭曲：让市场与风投决定技术路线。'],
      anarchism: [50, '反对国家监控也反对平台垄断：主张开源、联邦化、社区自治技术。'],
      fascism: [20, '【反面参照】技术全面服务于监控、宣传与战争机器。'],
    },
  },
};

// ---- 马克思主义中国化 · 层积结构 ----
const SINIC_LAYERS = [
  { name: '马列原典', period: '19C 中—20C 初', color: '#94a3b8', question: '回答「资本主义向何处去」：剩余价值、阶级斗争、历史唯物主义、先锋队建党学说。', revision: '基底层：提供历史观与组织技术的「源代码」。' },
  { name: '毛泽东思想', period: '1920s—1976', color: '#c41e3a', question: '回答「落后农业国如何革命」：农村包围城市、新民主主义、矛盾论/实践论。', revision: '修正了「城市工人阶级中心」的欧洲预设——主体从工人改写为农民。' },
  { name: '中国特色社会主义理论体系', period: '1978—2012', color: '#e8a317', question: '回答「社会主义如何搞经济」：社会主义初级阶段、社会主义市场经济、「三个代表」、科学发展观。', revision: '修正了「计划=社会主义、市场=资本主义」的等式——把市场纳入社会主义框架。' },
  { name: '新时代思想', period: '2012—', color: '#22d3ee', question: '回答「大国如何治理与竞争」：国家治理现代化、共同富裕、总体安全观、人类命运共同体。', revision: '修正了「发展优先于一切」的单一目标——把安全、公平与文明叙事提至与发展并列。' },
];

// ---- 意识形态四功能 ----
const FUNCTIONS4 = [
  { name: '认知地图', icon: '🗺', color: '#22d3ee', desc: '把无限复杂的社会现实压缩为可操作的简化模型——告诉成员「世界是什么、谁是朋友谁是对手」。没有地图，集体行动无从谈起。' },
  { name: '合法性供给', icon: '⚖', color: '#e8a317', desc: '回答「凭什么是你统治」：天命、契约、阶级使命或绩效。任何政权都无法长期只靠暴力——韦伯所谓统治须被「相信」。' },
  { name: '动员工具', icon: '📢', color: '#c41e3a', desc: '把分散个体的精力对准同一目标：革命、战争、建设或改革。意识形态降低组织成本——口号比命令便宜得多。' },
  { name: '身份认同', icon: '🪞', color: '#10b981', desc: '回答「我们是谁」：给成员归属感与意义感，划出我群与他群的边界。认同一旦内化，维护它本身就成为行动动机。' },
];

// ---- 全球意识形态版图变迁 ----
const WORLD_ERAS = [
  { period: '1947–1991', title: '冷战两极', accent: '#c41e3a', desc: '世界被两套总体性意识形态切分：资本主义自由阵营 vs 共产主义阵营，第三世界在不结盟与代理人战争之间摇摆。意识形态即地缘：信什么决定站哪边、买谁的武器、进谁的市场。' },
  { period: '1991–2008', title: '「历史终结论」时刻', accent: '#22d3ee', desc: '苏联解体后，福山宣称自由民主 + 市场经济是「人类政体演化的终点」。华盛顿共识全球推广，意识形态被宣告「退场」——但这本身就是一种意识形态：把一时胜利读作历史目的。' },
  { period: '2008–2016', title: '裂缝显现', accent: '#e8a317', desc: '全球金融危机动摇了新自由主义的绩效神话；中国模式在危机中表现引发「北京共识」讨论；占领华尔街与欧债危机暴露发达国家内部分配裂痕——终结论开始被质疑。' },
  { period: '2016–今', title: '多元回潮 · 终结论的终结', accent: '#8b5cf6', desc: '民粹主义（左右两翼）、民族主义回归、威权资本主义被部分国家视为可行路线、认同政治与技术加速主义并起。单一普世叙事让位于多元竞争——「历史终结论」自身被历史终结。' },
];

// ---- 中美叙事竞争 · 维度对照（客观并列，不做立场判断）----
const NARRATIVE_DIMS = [
  { dim: '权利序位', cn: '发展权优先：生存与发展是最大人权，先吃饱饭再谈其他。', us: '自由权优先：公民与政治权利不可让渡，不因发展阶段打折。' },
  { dim: '合法性来源', cn: '绩效合法性：以脱贫、增长、基建与治理效能证明制度有效。', us: '程序合法性：以选举、分权制衡与司法独立证明权力正当。' },
  { dim: '价值普遍性', cn: '文明多样性：各国国情不同，现代化道路不止一条。', us: '普世价值：自由民主人权超越文化边界，适用于一切社会。' },
  { dim: '国际秩序观', cn: '多极化 + 主权平等：反对干涉内政，主张共商共建。', us: '基于规则的秩序：由民主国家联盟维护的自由国际秩序。' },
  { dim: '国家—市场', cn: '有为政府 + 有效市场：国家规划与产业政策是合法工具。', us: '市场主导 + 有限政府：产业政策长期被视为扭曲（近年有回摆）。' },
];

// ---- 概念史时间线 ----
const CONCEPT_HISTORY = [
  { period: '1796', title: '特拉西「观念学」', accent: '#94a3b8', desc: '法国启蒙学者德斯蒂·德·特拉西创造 idéologie 一词，本义是中性的「观念的科学」——研究观念如何从感觉中产生。拿破仑嘲讽「观念学家」不切实际，使该词首次染上贬义。' },
  { period: '1845', title: '马克思「虚假意识」', accent: '#c41e3a', desc: '《德意志意识形态》：统治阶级的思想是占统治地位的思想；意识形态是颠倒现实的「照相机暗箱」，掩盖真实的生产关系——意识形态从此成为批判性概念。' },
  { period: '1929', title: '曼海姆 · 知识社会学', accent: '#e8a317', desc: '《意识形态与乌托邦》：所有思想（包括批判者自己的）都受社会位置制约——「意识形态」维护现状，「乌托邦」指向变革。批判的武器对准了所有人，包括持武器者。' },
  { period: '1930s', title: '葛兰西 · 文化霸权', accent: '#10b981', desc: '狱中札记：统治不仅靠强制（国家机器），更靠「同意」（市民社会中的文化领导权）。学校、教会、媒体让被统治者把统治秩序当作常识——意识形态斗争是阵地战。' },
  { period: '1989', title: '福山 · 历史终结论', accent: '#22d3ee', desc: '冷战落幕之际宣告意识形态竞争的终结：自由民主已无系统性对手。这一论断本身成为 1990s 全球化时代的主导意识形态——「无意识形态」的意识形态。' },
  { period: '2010s–', title: '多元回潮', accent: '#8b5cf6', desc: '民粹、民族主义、威权资本主义、认同政治、加速主义并起；中美叙事竞争公开化。意识形态非但没有终结，反而重新成为大国竞争与社会撕裂的主轴。' },
];

const DOT = (c) => ({ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}`, flexShrink: 0 });

export default function Page() {
  const [k, setK] = useState('marxism');
  const [issueKey, setIssueKey] = useState('market');
  const [eraIdx, setEraIdx] = useState(5);
  const x = IDEOLOGIES[k];
  const issue = ISSUES[issueKey];
  const compare = useMemo(() => ({
    legend: { data: Object.values(IDEOLOGIES).map((v) => v.label), textStyle: { color: LABEL.color }, top: 0 },
    radar: { indicator: RADAR_IND, axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: Object.values(IDEOLOGIES).map((v) => ({ value: v.radar, name: v.label, lineStyle: { color: v.color }, areaStyle: { color: v.color + '22' } })) }],
  }), []);
  return (
    <div>
      <PageHeader badge="Cognition · 意识形态理论" title="意识形态理论分析"
        subtitle="自由主义 · 马克思主义 · 民族主义 · 保守主义 · 新自由主义 · 无政府主义 · 社会达尔文主义 · 法西斯主义（反面参照）—— 透视叙事背后的人性假设、国家角色与历史观" />
      <IntroCard>意识形态不是空洞口号，而是一套关于<strong style={{ color: 'var(--text-primary)' }}>人性、平等、国家与历史</strong>的底层假设。本模块作思想史与政治哲学的结构对照，<strong style={{ color: 'var(--text-primary)' }}>非价值倡导</strong>。</IntroCard>
      <Card title="交互 · 意识形态选择器" className="mb-6">
        <SelectorBar items={Object.entries(IDEOLOGIES).map(([key, v]) => ({ key, label: v.label, accent: v.color }))} activeKey={k} onSelect={setK} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`${x.label} · 维度拆解`}>
          <div className="text-xs mono mb-3" style={{ color: x.color }}>代表：{x.origin}</div>
          <div className="space-y-2">
            {DIMS.map(([label, key]) => (
              <div key={key} style={{ borderLeft: `2px solid ${x.color}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{x[key]}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="八大意识形态 · 五维对照（示意）">
          <EChart option={compare} style={{ height: 300 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>同一坐标系下的相对位置：个人主义↔集体、平等↔效率、小政府↔强干预、有无历史目的论、竞争淘汰强度。</p>
        </Card>
      </Grid>

      <Card title="交互 · 议题立场矩阵 —— 同一议题，八种答案" className="mb-6">
        <SelectorBar items={Object.entries(ISSUES).map(([key, v]) => ({ key, label: v.label }))} activeKey={issueKey} onSelect={setIssueKey} />
        <div className="flex justify-between text-[11px] mono mt-4 mb-2" style={{ color: 'var(--text-tertiary)' }}>
          <span>← {issue.left}</span><span>{issue.right} →</span>
        </div>
        <div className="space-y-3">
          {Object.entries(IDEOLOGIES).map(([key, v]) => {
            const [pos, stmt] = issue.pos[key];
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-1">
                  <span style={DOT(v.color)} />
                  <span className="text-xs mono" style={{ color: v.color, minWidth: 92 }}>{v.label}</span>
                  <div style={{ flex: 1, position: 'relative', height: 8, background: 'var(--bg-elevated)', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ position: 'absolute', left: `${pos}%`, top: '50%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: '50%', background: v.color, boxShadow: `0 0 8px ${v.color}` }} />
                  </div>
                  <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)', minWidth: 24, textAlign: 'right' }}>{pos}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)', paddingLeft: 17 }}>{stmt}</p>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>定位为思想史定性折算（0–100 示意），同一意识形态内部亦有流派分歧；法西斯条目仅作反面参照与历史警示。</p>
      </Card>

      <Card title="马克思主义中国化 · 层积结构（每层回答什么时代问题，修正了什么）" className="mb-6">
        <div className="space-y-3">
          {SINIC_LAYERS.map((l, i) => (
            <div key={l.name} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${l.color}`, marginLeft: i * 18 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{`L${i} · ${l.name}`}</span>
                <span className="text-[10px] mono" style={{ color: l.color }}>{l.period}</span>
              </div>
              <p className="text-[11px] leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}><span style={{ color: l.color }}>时代之问：</span>{l.question}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}><span style={{ color: 'var(--text-secondary)' }}>层积修正：</span>{l.revision}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>「层积」而非「替换」：每一层都宣称继承下层正统，同时改写其中与现实冲突的部分——这是理解官方理论文本的钥匙（客观思想史梳理）。</p>
      </Card>

      <Card title="意识形态的四种功能 —— 为什么任何政权都需要它" className="mb-6">
        <Grid cols={4}>
          {FUNCTIONS4.map((f) => (
            <div key={f.name} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${f.color}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: f.color }}>{f.icon} {f.name}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{f.desc}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>四功能是分析框架而非褒贬：自由主义国家同样依赖「自由叙事」完成认知、合法性、动员与认同——区别在内容，不在是否需要。</p>
      </Card>

      <Card title="全球意识形态版图变迁 ——「历史终结论」的终结" className="mb-6">
        <Grid cols={4}>
          {WORLD_ERAS.map((e, i) => (
            <div key={e.title} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${e.accent}` }}>
              <div className="text-[10px] mono mb-1" style={{ color: e.accent }}>{`阶段 ${i + 1} · ${e.period}`}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{e.title}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{e.desc}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="叙事竞争 · 中美核心维度对照（客观并列，不做立场判断）" className="mb-6">
        <div className="space-y-2">
          <div className="flex gap-3 text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
            <div style={{ width: 84 }}>维度</div>
            <div style={{ flex: 1, color: '#c41e3a' }}>中国叙事强调</div>
            <div style={{ flex: 1, color: '#22d3ee' }}>美国叙事强调</div>
          </div>
          {NARRATIVE_DIMS.map((r) => (
            <div key={r.dim} className="flex gap-3 p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold" style={{ width: 84, color: 'var(--text-primary)' }}>{r.dim}</div>
              <p className="text-[11px] leading-relaxed" style={{ flex: 1, color: 'var(--text-secondary)', borderLeft: '2px solid #c41e3a', paddingLeft: 8 }}>{r.cn}</p>
              <p className="text-[11px] leading-relaxed" style={{ flex: 1, color: 'var(--text-secondary)', borderLeft: '2px solid #22d3ee', paddingLeft: 8 }}>{r.us}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>两套叙事各自内部自洽、各有现实软肋；本表呈现「双方各自如何讲」，而非裁判孰是孰非——与「大国博弈/文明透视」模块对照阅读。</p>
      </Card>

      <Card title="概念史 ·「意识形态」一词的两百年漂流" className="mb-6">
        <TimelineBar stages={CONCEPT_HISTORY} activeIdx={eraIdx} onSelect={setEraIdx} />
      </Card>

      <Card title="意识形态光谱 · 左—右 / 国家—个人 定位（示意）" className="mb-6">
        <div style={{ position: 'relative', height: 300, background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {/* 坐标轴 */}
          <div style={{ position: 'absolute', left: '50%', top: 12, bottom: 12, width: 1, background: 'rgba(148,163,184,0.2)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 1, background: 'rgba(148,163,184,0.2)' }} />
          <span className="text-[11px] mono" style={{ position: 'absolute', left: 14, top: '48%', color: 'var(--text-tertiary)' }}>← 左 / 平等</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', right: 14, top: '48%', color: 'var(--text-tertiary)' }}>右 / 效率 →</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', color: 'var(--text-tertiary)' }}>↑ 强国家</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', color: 'var(--text-tertiary)' }}>↓ 个人/去中心</span>
          {Object.values(IDEOLOGIES).map((v) => {
            // x：右倾 = (效率/竞争 - 平等) 归一；y：国家干预（越高越靠上）
            const xv = 50 + (v.radar[4] - v.radar[1]) / 2;          // 0..100
            const yv = 100 - v.radar[2];                            // 干预高→靠上
            return (
              <div key={v.label} style={{ position: 'absolute', left: `${Math.max(6, Math.min(94, xv))}%`, top: `${Math.max(8, Math.min(92, yv))}%`, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                <span style={DOT(v.color)} />
                <span className="text-[11px] mono" style={{ color: v.color }}>{v.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>横轴：左（平等）↔右（效率/竞争）；纵轴：强国家干预↔个人/去中心。坐标由五维雷达定性折算，仅作思想史结构定位示意。</p>
      </Card>

      <FrameworkTrio cards={[
        { title: '人性假设', subtitle: '个体 · 集体', body: '自由主义视人为理性自利个体；马克思主义视人为社会关系的总和。', pillars: [['自由主义', '天赋权利先于国家。'], ['马克思主义', '存在决定意识。'], ['民族主义', '共同体先于个人。']] },
        { title: '国家角色', subtitle: '守夜人 · 工具', body: '从有限政府到无产阶级专政，国家角色定义政策边界。', pillars: [['自由主义', '守夜人定位。'], ['新自由主义', '市场守护者。'], ['法西斯', '反面：极权吞没社会。']] },
        { title: '历史观', subtitle: '目的论 · 渐进', body: '马克思主义历史唯物主义 vs 保守主义反目的论，决定对改革的姿态。', pillars: [['目的论', '马克思/民族复兴叙事。'], ['非目的论', '自由主义/保守渐进。'], ['杂糅', '中国语境多轨张力。']] },
      ]} />

      <Card title="作为思想工具 · 识别叙事的底层假设">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实政策往往是多套意识形态的<strong style={{ color: 'var(--text-primary)' }}>杂糅</strong>：中国语境下，马克思主义的历史观与国家角色 + 市场化的（新）自由主义工具 + 民族复兴的凝聚话语 + 治理上的保守审慎 + 对丛林竞争（社会达尔文式）的警惕，构成多轨张力；而无政府主义与法西斯主义（反面参照）则标出去中心化与极权两端的边界。读懂这些坐标，就能解析「共同富裕」「集中力量办大事」「民族复兴」「内卷」等话语各自调用了哪套假设——这是与<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>权力逻辑 / 国有资本 / 民营经济 / 文明透视</span>对照阅读的认知底座。
        </p>
      </Card>
      <ModuleFooter moduleId="ideology" disclaimer="本模块为政治哲学/思想史的结构性梳理与思想工具，雷达与立场定位均为定性示意，不代表任何立场倡导；法西斯条目仅作反面参照与历史警示" />
    </div>
  );
}
