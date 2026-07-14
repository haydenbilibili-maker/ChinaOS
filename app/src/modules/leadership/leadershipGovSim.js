// ============================================================================
// 领袖统治 · 治理结构推演引擎（leadershipGovSim.js）
// ----------------------------------------------------------------------------
// 定位：纯数据 + 纯函数。模拟的是「制度位点—约束—选项—后果」的结构权衡，
// 不是个人能力评分，也不是内幕剧情。
//
// 口径：
// 1. 议题锚定公开制度事实（党中央/政治局/国务院/财经委等建制位点）
// 2. 采用三层归因框架：路线 / 决策 / 执行（与 domain/governance PowerLayer 对齐）
// 3. 引入诊断权 vs 处方权分离命题（与总理权限半径同源）
// 4. 约束为结构性物理量的思想实验标定，非情报、非评价、非预测
// ============================================================================

/** @typedef {'direction'|'decision'|'execution'} PowerLayer */

export const LEADERSHIP_SIM_STORAGE_KEY = 'chinaos.leadership.sim.v1';

export const GOV_SIM_METHODOLOGY = {
  models: [
    '制度位点：把选项映射到党中央/政治局常委会/中央财经委/国务院等公开建制位点，而非个人。',
    '权力三层：路线层设定约束，决策层开具方案与剂量，执行层决定落地质量——评估结构位置。',
    '诊断权 vs 处方权：国务院可具备高分辨率诊断能力，但结构性改革处方权可能已上移至党的议事协调机构。',
    '约束四参量：财政空间、社会稳定、干部执行容量、信息不对称——思想实验标定的物理上限。',
  ],
  doesNotClaim: [
    '不对任何领导人做个人能力、性格或功过评分。',
    '不编造非公开会议、派系斗争或接班剧情。',
    '不输出作战方案、武力时间表或政策倡导。',
    '不声称仿真结果可外推为现实预测。',
  ],
};

export const GOV_SIM_CAUTIONS = [
  '本推演评估的是制度位点与资源约束下的结构权衡，不是对在任官员的个人褒贬。',
  '「诊断权」与「处方权」分离是比较政治学命题：能看见问题，不等于持有改变结构的授权。',
  '财政空间、社会稳定、干部容量、信息不对称均为思想实验示意刻度（0–100），非官方统计。',
  '选项后果矩阵区分：意图效果 / 伴生副作用 / 不可逆成本——均为学理示意，可复现、可审计。',
];

export const FLOW_STEPS = [
  { key: 'scenario', label: '选题', hint: '情景简报 · 制度位点 · 利害' },
  { key: 'constraints', label: '约束', hint: '四参量即时反馈' },
  { key: 'options', label: '选项', hint: '可执行组合与位点' },
  { key: 'outcome', label: '后果', hint: '矩阵 · 雷达 · 固化' },
];

/** 约束参量定义 */
export const CONSTRAINT_DEFS = [
  {
    key: 'fiscalSpace',
    label: '财政空间',
    short: '财政',
    accent: '#e8a317',
    note: '中央与地方可支配财力、化债占用、再杠杆余地。空间越窄，高剂量处方越易触顶。',
  },
  {
    key: 'socialStability',
    label: '社会稳定缓冲',
    short: '稳定',
    accent: '#c41e3a',
    note: '就业与民生暴露面、舆情可吸收余量。缓冲越薄，激进调整的政治成本越高。',
  },
  {
    key: 'cadreCapacity',
    label: '干部执行容量',
    short: '干部',
    accent: '#22d3ee',
    note: '基层与部委同时推进多任务的组织带宽。容量不足时，政策文本≠执行穿透。',
  },
  {
    key: 'infoAsymmetry',
    label: '信息不对称',
    short: '信息',
    accent: '#8b5cf6',
    note: '上行过滤与地方隐瞒的程度。不对称越高，路线层看到的画面越平滑、越滞后。',
  },
];

export const DEFAULT_CONSTRAINTS = {
  fiscalSpace: 42,
  socialStability: 58,
  cadreCapacity: 55,
  infoAsymmetry: 62,
};

/**
 * 制度位点目录（公开建制 · 与 PowerLayer 对齐）
 * @type {Array<{id:string,label:string,layer:PowerLayer,org:string,role:string}>}
 */
export const INSTITUTIONAL_LOCI = [
  {
    id: 'party-center',
    label: '党中央',
    layer: 'direction',
    org: '党中央',
    role: '路线与重大工作集中统一领导',
  },
  {
    id: 'psc',
    label: '政治局常委会',
    layer: 'direction',
    org: '中央政治局常委会',
    role: '最高层日常议事与议程排序',
  },
  {
    id: 'pb',
    label: '中央政治局',
    layer: 'decision',
    org: '中央政治局',
    role: '重大政策审议与部委/地方对表',
  },
  {
    id: 'cfe',
    label: '中央财经委',
    layer: 'decision',
    org: '中央财经委员会',
    role: '经济议程顶层设计与剂量裁定（处方权上移后的关键位点）',
  },
  {
    id: 'state-council',
    label: '国务院',
    layer: 'execution',
    org: '国务院',
    role: '行政执行、工具箱落地与体感质量（诊断权常驻于此）',
  },
  {
    id: 'ndrc-line',
    label: '发改委线',
    layer: 'execution',
    org: '国家发展改革委等综合部门',
    role: '规划与宏观工具的操作性执行',
  },
];

const locusById = (id) => INSTITUTIONAL_LOCI.find((l) => l.id === id) || null;

/**
 * 治理情景（公开议题 · 制度框架 · 无个人评分）
 * options[].effects: { intended, sideEffects, irreversible } 文本
 * options[].deltas: 对各约束与治理指标的确定性偏移（思想实验）
 */
export const GOV_SCENARIOS = [
  {
    id: 'local-debt',
    label: '地方隐性债务与财政倒挂',
    tag: '财政',
    accent: '#e8a317',
    agendaId: 'risk-defuse',
    layer: /** @type {PowerLayer} */ ('decision'),
    primaryLocus: 'cfe',
    secondaryLoci: ['state-council', 'psc'],
    diagnosisPrescription: {
      diagnosis: '诊断权：国务院与地方财政汇报链可清晰描述自给率下行、隐性债滚雪球与保运转压力。',
      prescription: '处方权：化债剂量、中央兜底边界、地方融资窗开合——结构性方案多在财经委/常委会议程排序中裁定。',
    },
    stakes: '守住系统性风险底线与保增长、保民生、防道德风险之间的三维张力。',
    actors: ['中央财经委', '国务院', '地方政府', '金融机构'],
    legalFrame:
      '公开制度事实：地方政府债务管理、一揽子化债政策口径、全国人大预算监督框架。不含非公开谈判细节。',
    brief:
      '部分省份财政自给率持续承压，隐性债务化解进入深水区；同时中央要求稳增长与保基本民生。仿真问题：在处方权上移、诊断仍在行政链的结构下，剂量如何选择。',
    relatedRoutes: [
      { to: '/modules/attribution', label: '三层归因分析器' },
      { to: '/modules/premier-radius', label: '总理权限半径' },
      { to: '/modules/signal-panel', label: '宏观再平衡信号灯' },
      { to: '/debt', label: '地方债务' },
    ],
    footnotes: [
      '公开制度事实：地方政府债券管理与化债政策文本可检索。',
      '2026 H1：一揽子化债与特殊再融资债券续推，部分省财政自给率仍承压（据公开决算口径）。',
      '不以个人褒贬评分：不评判具体官员「魄力」或「能力」。',
    ],
    options: [
      {
        id: 'debt-extend',
        label: '展期置换为主 · 缓释为主',
        locus: 'cfe',
        summary: '以置换与展期争取时间窗，压低即期信用事件概率，延后硬出清。',
        intended: '短中期信用风险缓释；地方保运转压力下降。',
        sideEffects: '道德风险累积；市场对中央兜底预期强化；财政空间被长期占用。',
        irreversible: '若窗口被用于新项目加杠杆，负债结构更难逆转。',
        baseDeltas: {
          fiscalSpace: -8,
          socialStability: 10,
          cadreCapacity: 4,
          systemicRisk: -18,
          growthImpulse: 4,
          reformDepth: -6,
          executionQuality: 2,
        },
      },
      {
        id: 'debt-hard',
        label: '硬约束出清 · 项目甄别',
        locus: 'cfe',
        summary: '抬高地方融资门槛，按项目现金流甄别，接受短期经济与社会摩擦。',
        intended: '压缩无效融资；修复央地激励相容；降低长期系统性隐患。',
        sideEffects: '投资与就业脉冲下行；部分地方保运转紧张；干部避责倾向上升。',
        irreversible: '出清过程中若误伤可经营资产，产能与税基损失难完全回补。',
        baseDeltas: {
          fiscalSpace: 6,
          socialStability: -14,
          cadreCapacity: -8,
          systemicRisk: -10,
          growthImpulse: -16,
          reformDepth: 14,
          executionQuality: -4,
        },
      },
      {
        id: 'debt-split',
        label: '分账分类 · 中央设上限',
        locus: 'state-council',
        summary: '行政执行层主导分账分类与信息披露，中央设定兜底上限与观察期。',
        intended: '提升透明度；把道德风险装进可观测规则；保留剂量机动。',
        sideEffects: '部委与地方博弈成本上升；短时信息不完全暴露引发预期波动。',
        irreversible: '一旦披露标准固化，既往隐瞒空间被永久压缩（信息制度锁定）。',
        baseDeltas: {
          fiscalSpace: -2,
          socialStability: 2,
          cadreCapacity: -6,
          systemicRisk: -12,
          growthImpulse: -4,
          reformDepth: 10,
          executionQuality: 12,
        },
      },
    ],
  },
  {
    id: 'tech-blockade',
    label: '科技管制与产业链安全',
    tag: '科技',
    accent: '#22d3ee',
    agendaId: 'tech-selfreliance',
    layer: /** @type {PowerLayer} */ ('direction'),
    primaryLocus: 'party-center',
    secondaryLoci: ['cfe', 'state-council'],
    diagnosisPrescription: {
      diagnosis: '诊断权：产业部门与企业可识别断供环节、替代路径与时间成本。',
      prescription: '处方权：举国攻关资源排序、市场开放与安全边界——属路线层对增长/安全排序的裁量。',
    },
    stakes: '短中期稳预期就业 与 中长期关键技术自主 的注意力与财政争夺。',
    actors: ['党中央', '中央财经委', '工信/科技口', '龙头企业'],
    legalFrame: '公开制度事实：出口管制清单为可观察外部变量；国内新型举国体制与发展规划公开文本。',
    brief:
      '外部技术管制收紧，关键产业链存在断供风险。仿真问题：安全排序上升后，执行层如何在就业与攻关之间分配稀缺注意力与财政带宽。',
    relatedRoutes: [
      { to: '/modules/attribution', label: '三层归因分析器' },
      { to: '/modules/signal-panel', label: '宏观再平衡信号灯' },
      { to: '/techtree', label: '科技图谱' },
      { to: '/semiconductor', label: '集成电路' },
    ],
    footnotes: [
      '公开制度事实：管制清单与产业政策文本可核验。',
      '不输出任何规避管制的操作指引。',
    ],
    options: [
      {
        id: 'tech-sprint',
        label: '集中攻关冲刺 · 高剂量投入',
        locus: 'party-center',
        summary: '路线层确认安全优先，财政与组织动员向断链环节倾斜。',
        intended: '关键节点国产替代提速；供应链安全边际上升。',
        sideEffects: '其他民生与地方投资议题被挤出；重复建设与寻租风险抬升。',
        irreversible: '一旦形成产能路径锁定，错配资本退出成本高。',
        baseDeltas: {
          fiscalSpace: -16,
          socialStability: -4,
          cadreCapacity: -12,
          systemicRisk: 4,
          growthImpulse: -6,
          reformDepth: 8,
          executionQuality: 6,
        },
      },
      {
        id: 'tech-dual',
        label: '双轨并行 · 稳预期+定点攻关',
        locus: 'cfe',
        summary: '决策层设定剂量上限：保市场预期的同时，对少数卡点定点投入。',
        intended: '降低就业与预期冲击；保留有限攻关动量。',
        sideEffects: '两边都吃紧时易出现「两边都不够」；协调成本上升。',
        irreversible: '双轨制度一旦写进规划周期，短期难回调为单一优先级。',
        baseDeltas: {
          fiscalSpace: -8,
          socialStability: 6,
          cadreCapacity: -6,
          systemicRisk: 0,
          growthImpulse: 2,
          reformDepth: 4,
          executionQuality: 4,
        },
      },
      {
        id: 'tech-market',
        label: '执行层工具箱 · 标准与采购撬动',
        locus: 'state-council',
        summary: '在不改变路线排序前提下，用标准、首台套、政府采购撬动替代进程。',
        intended: '提高执行穿透与企业体感；减少全面动员摩擦。',
        sideEffects: '若处方权未同步，工具箱触及结构瓶颈后效果递减。',
        irreversible: '采购与标准一旦写入行业惯例，切换成本较高。',
        baseDeltas: {
          fiscalSpace: -4,
          socialStability: 4,
          cadreCapacity: -2,
          systemicRisk: 2,
          growthImpulse: 4,
          reformDepth: 2,
          executionQuality: 14,
        },
      },
    ],
  },
  {
    id: 'demo-pressure',
    label: '人口负增长与社保承压',
    tag: '人口',
    accent: '#10b981',
    agendaId: 'common-prosperity',
    layer: /** @type {PowerLayer} */ ('decision'),
    primaryLocus: 'pb',
    secondaryLoci: ['state-council', 'cfe'],
    diagnosisPrescription: {
      diagnosis: '诊断权：统计与社保部门可持续更新赡养比、基金现金流与地方分化。',
      prescription: '处方权：退休年龄、费率、转移支付与生育支持剂量——跨代际再分配需决策层乃至路线层确认。',
    },
    stakes: '代际再分配摩擦、地方财政分化与长期人力资本之间的慢变量冲突。',
    actors: ['中央政治局', '国务院', '人社/卫健', '地方政府'],
    legalFrame: '公开制度事实：人口普查与统计公报、社保法规框架、生育支持政策文本。',
    brief:
      '老龄化与少子化叠加，社保中长期平衡承压。仿真问题：慢变量改革在信息滞后与干部容量约束下，如何避免「看得见、开不出、落不下」。',
    relatedRoutes: [
      { to: '/modules/premier-radius', label: '总理权限半径' },
      { to: '/modules/cushion-monitor', label: '垫子厚度监测' },
      { to: '/demographic', label: '人口结构' },
      { to: '/fertility-support', label: '生育支持' },
    ],
    footnotes: [
      '公开制度事实：普查与统计公报可核验。',
      '不对生育选择做价值评判，只呈现财政与制度约束。',
    ],
    options: [
      {
        id: 'demo-param',
        label: '参数改革 bundle · 费率/年龄/口径',
        locus: 'pb',
        summary: '决策层打包推进参数调整，换取基金平衡中期改善。',
        intended: '改善精算可持续性；降低隐性债务扩张速度。',
        sideEffects: '当期社会摩擦上升；地方执行差异放大不公平感。',
        irreversible: '法定参数一旦调整，政治再回摆成本高。',
        baseDeltas: {
          fiscalSpace: 10,
          socialStability: -12,
          cadreCapacity: -8,
          systemicRisk: -8,
          growthImpulse: -2,
          reformDepth: 16,
          executionQuality: -6,
        },
      },
      {
        id: 'demo-pilot',
        label: '地方试点扩围 · 观察期加长',
        locus: 'state-council',
        summary: '执行层扩大试点并加强评估，把全国性处方留作后续。',
        intended: '降低全国性误判风险；积累可迁移经验。',
        sideEffects: '地区分化加剧；「试点疲劳」消耗干部容量。',
        irreversible: '试点地区路径依赖可能抬高全国统一的政治讨价还价成本。',
        baseDeltas: {
          fiscalSpace: -4,
          socialStability: 4,
          cadreCapacity: -10,
          systemicRisk: 2,
          growthImpulse: 0,
          reformDepth: 6,
          executionQuality: 8,
        },
      },
      {
        id: 'demo-transfer',
        label: '中央转移支付托底 · 缓改',
        locus: 'cfe',
        summary: '用转移支付与调剂熨平即期缺口，参数改革节奏放缓。',
        intended: '短期社会稳定与地方保发放。',
        sideEffects: '中央财政承压；结构性失衡继续累积。',
        irreversible: '托底预期固化后，退出托底的政治成本显著上升。',
        baseDeltas: {
          fiscalSpace: -14,
          socialStability: 12,
          cadreCapacity: 2,
          systemicRisk: 6,
          growthImpulse: 2,
          reformDepth: -8,
          executionQuality: 2,
        },
      },
    ],
  },
  {
    id: 'reform-window',
    label: '结构性改革窗口与风险熔断',
    tag: '改革',
    accent: '#c41e3a',
    agendaId: 'common-prosperity',
    layer: /** @type {PowerLayer} */ ('decision'),
    primaryLocus: 'cfe',
    secondaryLoci: ['party-center', 'state-council'],
    diagnosisPrescription: {
      diagnosis: '诊断权：执行层对乱收费、拖欠账款、市场分割等微观梗阻感受最强（体感诊断）。',
      prescription: '处方权：财税、土地、要素市场化等结构性改革——处方权上移后，窗口期取决于路线层优先级排序。',
    },
    stakes: '改革突破收益 与 下行期社会韧性上限 之间的时间窗口博弈。',
    actors: ['中央财经委', '党中央', '国务院', '利益相关部门'],
    legalFrame: '公开制度事实：二十届三中全会决定文本、机构改革方案、统一大市场相关政策。',
    brief:
      '「真正的问题不是药方人人会开，而是在诊断权与处方权分离的结构里，改革如何才可能发生。」仿真据此检验：窗口感知、熔断预置与剂量选择。',
    relatedRoutes: [
      { to: '/modules/premier-radius', label: '总理权限半径' },
      { to: '/modules/attribution', label: '三层归因分析器' },
      { to: '/modules/three-forces', label: '三力逼近监测' },
      { to: '/modules/signal-panel', label: '宏观再平衡信号灯' },
    ],
    footnotes: [
      '命题引自本站总理权限半径模块学理表述，非内部消息。',
      '2026 H1 公开锚点：十五五规划纲要落地、二十届中央纪委五次全会（2026-01）严的基调语境下，结构性改革窗口仍处观察期。',
      '不以「改革派/保守派」标签评价具体人物。',
    ],
    options: [
      {
        id: 'reform-narrow',
        label: '窄切口试点 · 熔断预置',
        locus: 'state-council',
        summary: '执行层推进可逆的窄切口，预设观测指标与熔断线。',
        intended: '在韧性上限内试错；保留回调空间。',
        sideEffects: '改革信号偏弱；既得利益可拖延等待试点结束。',
        irreversible: '熔断频繁触发会锁定「只试不推」的制度预期。',
        baseDeltas: {
          fiscalSpace: -2,
          socialStability: 6,
          cadreCapacity: -4,
          systemicRisk: -2,
          growthImpulse: 2,
          reformDepth: 6,
          executionQuality: 10,
        },
      },
      {
        id: 'reform-pack',
        label: '打包推进 · 高层背书',
        locus: 'party-center',
        summary: '路线层提高结构性改革优先级，打包多部门同步推进。',
        intended: '突破部门否决点；在窗口期内形成不可轻易回摆的制度动量。',
        sideEffects: '社会与市场摩擦脉冲加大；干部容量过载；误判代价放大。',
        irreversible: '打包立法/规划一旦通过，回撤意味着公开权威成本。',
        baseDeltas: {
          fiscalSpace: -10,
          socialStability: -10,
          cadreCapacity: -14,
          systemicRisk: 4,
          growthImpulse: -4,
          reformDepth: 22,
          executionQuality: -2,
        },
      },
      {
        id: 'reform-exec-only',
        label: '仅执行层整治 · 不改结构',
        locus: 'state-council',
        summary: '在处方权未下移时，用执法规范、清欠、政务服务改善体感。',
        intended: '短期体感改善；降低误诊为「执行不力」的政治压力。',
        sideEffects: '结构性梗阻未动；诊断—处方分离继续，窗口可能空转。',
        irreversible: '体感改善若被误读为结构已改，会延误真正的处方窗口。',
        baseDeltas: {
          fiscalSpace: 0,
          socialStability: 8,
          cadreCapacity: -6,
          systemicRisk: 2,
          growthImpulse: 4,
          reformDepth: -4,
          executionQuality: 16,
        },
      },
    ],
  },
];

export const scenarioById = (id) => GOV_SCENARIOS.find((s) => s.id === id) || null;

const clamp = (v, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));
const round1 = (v) => Math.round(Number(v) * 10) / 10;

/**
 * 约束压力即时读数（不选选项也可反馈）
 * @param {typeof DEFAULT_CONSTRAINTS} constraints
 */
export function readConstraintPressure(constraints) {
  const c = { ...DEFAULT_CONSTRAINTS, ...(constraints || {}) };
  const fiscalTight = 100 - c.fiscalSpace;
  const stabilityRisk = 100 - c.socialStability;
  const capacityGap = 100 - c.cadreCapacity;
  const fog = c.infoAsymmetry;
  const composite = round1(
    fiscalTight * 0.28 + stabilityRisk * 0.3 + capacityGap * 0.22 + fog * 0.2,
  );

  let band = '可操作窗口';
  let color = '#10b981';
  let note =
    '四约束尚未同时触顶；仍存在有限的结构操作空间——但窗口会随任一参量恶化而收缩。';
  if (composite >= 72) {
    band = '高压受限';
    color = '#c41e3a';
    note = '复合约束已进入高压区：高剂量处方极易触发社会或财政硬约束，宜优先降低信息不对称与明确熔断线。';
  } else if (composite >= 55) {
    band = '摩擦区间';
    color = '#e8a317';
    note = '处于摩擦区间：任何选项都会显式暴露贸易offs；注意力应集中在不可逆成本可控的切口。';
  }

  return {
    composite,
    band,
    color,
    note,
    axes: {
      fiscalTight: round1(fiscalTight),
      stabilityRisk: round1(stabilityRisk),
      capacityGap: round1(capacityGap),
      fog: round1(fog),
    },
  };
}

/**
 * 运行一次治理推演（确定性）
 * @param {{ scenarioId: string, optionId: string, constraints?: object }} input
 */
export function runGovernanceSim(input) {
  const scenario = scenarioById(input?.scenarioId);
  if (!scenario) {
    return { ok: false, error: '情景未找到。请重新选题。' };
  }
  const option = (scenario.options || []).find((o) => o.id === input?.optionId);
  if (!option) {
    return { ok: false, error: '未选择有效选项。请返回选项步。' };
  }

  const constraints = { ...DEFAULT_CONSTRAINTS, ...(input.constraints || {}) };
  const pressure = readConstraintPressure(constraints);
  const d = option.baseDeltas || {};

  // 约束调制：财政越紧，改革深度与增长脉冲越受罚；稳定缓冲越薄，社会成本放大；
  // 干部容量不足惩罚执行质量；信息不对称抬高系统性误判溢价。
  const fiscalMod = (100 - constraints.fiscalSpace) / 100;
  const stabMod = (100 - constraints.socialStability) / 100;
  const capacMod = (100 - constraints.cadreCapacity) / 100;
  const infoMod = constraints.infoAsymmetry / 100;

  const metrics = {
    systemicRisk: clamp(
      55 + (d.systemicRisk || 0) + fiscalMod * 8 + infoMod * 6,
    ),
    growthImpulse: clamp(
      48 + (d.growthImpulse || 0) - fiscalMod * 10 - stabMod * 6,
    ),
    reformDepth: clamp(
      40 + (d.reformDepth || 0) - capacMod * 12 - infoMod * 8,
    ),
    executionQuality: clamp(
      50 + (d.executionQuality || 0) - capacMod * 18 - infoMod * 6,
    ),
    socialFriction: clamp(
      35 + stabMod * 30 - (d.socialStability || 0) * 0.4 + Math.abs(d.reformDepth || 0) * 0.25,
    ),
    fiscalStrain: clamp(
      40 + fiscalMod * 35 - (d.fiscalSpace || 0) * 0.5,
    ),
  };

  const postConstraints = {
    fiscalSpace: clamp(constraints.fiscalSpace + (d.fiscalSpace || 0)),
    socialStability: clamp(constraints.socialStability + (d.socialStability || 0)),
    cadreCapacity: clamp(constraints.cadreCapacity + (d.cadreCapacity || 0)),
    infoAsymmetry: clamp(
      constraints.infoAsymmetry - (option.id.includes('split') || option.id.includes('pilot') ? 8 : 2),
    ),
  };

  // 综合判读（非评分、非褒贬）
  const tension = round1(
    metrics.socialFriction * 0.3 +
      metrics.fiscalStrain * 0.25 +
      metrics.systemicRisk * 0.2 +
      (100 - metrics.executionQuality) * 0.15 +
      (100 - metrics.reformDepth) * 0.1,
  );

  let verdict;
  if (metrics.reformDepth >= 60 && metrics.socialFriction < 55 && metrics.fiscalStrain < 65) {
    verdict = {
      label: '结构推进可行',
      color: '#10b981',
      note: '在当前约束下，所选剂量能同时维持有限改革深度与可控摩擦——窗口存在，但依赖执行穿透持续兑现。',
    };
  } else if (metrics.socialFriction >= 70 || metrics.fiscalStrain >= 78) {
    verdict = {
      label: '硬约束触顶',
      color: '#c41e3a',
      note: '社会缓冲或财政空间已接近触顶：继续加码会把短期危机概率推高；更合理的是收缩剂量或改换切口。',
    };
  } else if (metrics.executionQuality < 40 && metrics.reformDepth > 50) {
    verdict = {
      label: '处方—执行断裂',
      color: '#e8a317',
      note: '处方深度超过干部执行容量：文本上的改革无法转化为穿透，诊断权提示的梗阻会在末梢复发。',
    };
  } else {
    verdict = {
      label: '权衡维持',
      color: '#22d3ee',
      note: '意图效果与副作用并存；无免费午餐。可考虑调整约束假设后复跑，或与另一存档对照。',
    };
  }

  const primary = locusById(option.locus) || locusById(scenario.primaryLocus);
  const layerLabel =
    scenario.layer === 'direction' ? '路线层' : scenario.layer === 'decision' ? '决策层' : '执行层';

  return {
    ok: true,
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    optionId: option.id,
    optionLabel: option.label,
    primaryLocus: primary,
    layer: scenario.layer,
    layerLabel,
    diagnosisPrescription: scenario.diagnosisPrescription,
    constraints: { ...constraints },
    postConstraints,
    pressure,
    metrics: Object.fromEntries(
      Object.entries(metrics).map(([k, v]) => [k, round1(v)]),
    ),
    tension,
    verdict,
    matrix: {
      intended: option.intended,
      sideEffects: option.sideEffects,
      irreversible: option.irreversible,
    },
    footnotes: scenario.footnotes || [],
    asOfNote:
      '思想实验 · 确定性函数 · 公开制度位点 · 非评价 · 非预测 · 非倡导',
  };
}

/** 导出单次运行的 Markdown */
export function buildGovSimExport(run) {
  const r = run?.result;
  if (!r?.ok) return '// 无有效推演结果可导出';
  const lines = [
    '# 领袖统治 · 治理结构推演存档',
    '',
    `> ${r.asOfNote}`,
    '',
    '## 情景',
    '',
    `- 选题：${r.scenarioLabel}`,
    `- 权力层：${r.layerLabel}`,
    `- 选项：${r.optionLabel}`,
    `- 制度位点：${r.primaryLocus?.org || '——'}（${r.primaryLocus?.role || ''}）`,
    '',
    '## 约束（运行前）',
    '',
    `- 财政空间 ${r.constraints.fiscalSpace}`,
    `- 社会稳定缓冲 ${r.constraints.socialStability}`,
    `- 干部执行容量 ${r.constraints.cadreCapacity}`,
    `- 信息不对称 ${r.constraints.infoAsymmetry}`,
    `- 复合压力 ${r.pressure.composite} · ${r.pressure.band}`,
    '',
    '## 后果矩阵',
    '',
    `- 意图效果：${r.matrix.intended}`,
    `- 伴生副作用：${r.matrix.sideEffects}`,
    `- 不可逆成本：${r.matrix.irreversible}`,
    '',
    '## 指标（示意）',
    '',
    `- 系统性风险 ${r.metrics.systemicRisk}`,
    `- 增长脉冲 ${r.metrics.growthImpulse}`,
    `- 改革深度 ${r.metrics.reformDepth}`,
    `- 执行质量 ${r.metrics.executionQuality}`,
    `- 社会摩擦 ${r.metrics.socialFriction}`,
    `- 财政紧张 ${r.metrics.fiscalStrain}`,
    '',
    `## 判读：${r.verdict.label}`,
    '',
    r.verdict.note,
    '',
    '## 诊断权 / 处方权',
    '',
    `- ${r.diagnosisPrescription.diagnosis}`,
    `- ${r.diagnosisPrescription.prescription}`,
    '',
    '## 脚注',
    '',
    ...(r.footnotes || []).map((f) => `- ${f}`),
    '',
    '## 方法论边界',
    '',
    ...GOV_SIM_METHODOLOGY.doesNotClaim.map((x) => `- ${x}`),
    '',
    '---',
    '',
    GOV_SIM_CAUTIONS[0],
    '',
  ];
  return lines.join('\n');
}

/** 两轮对照摘要 */
export function compareGovRuns(a, b) {
  if (!a?.result?.ok || !b?.result?.ok) {
    return { ok: false, error: '请选择两份成功存档进行对照。' };
  }
  const keys = [
    'systemicRisk',
    'growthImpulse',
    'reformDepth',
    'executionQuality',
    'socialFriction',
    'fiscalStrain',
  ];
  const labels = {
    systemicRisk: '系统性风险',
    growthImpulse: '增长脉冲',
    reformDepth: '改革深度',
    executionQuality: '执行质量',
    socialFriction: '社会摩擦',
    fiscalStrain: '财政紧张',
  };
  const rows = keys.map((k) => ({
    key: k,
    label: labels[k],
    a: a.result.metrics[k],
    b: b.result.metrics[k],
    delta: round1(b.result.metrics[k] - a.result.metrics[k]),
  }));
  return {
    ok: true,
    aLabel: `${a.result.scenarioLabel} · ${a.result.optionLabel}`,
    bLabel: `${b.result.scenarioLabel} · ${b.result.optionLabel}`,
    rows,
    note: '对照仅显示示意指标差值，不构成优劣排序或政策建议。',
  };
}
