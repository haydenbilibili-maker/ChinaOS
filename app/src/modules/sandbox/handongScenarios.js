// ============================================================================
// 汉东省沙盘 · 虚构省域推演数据层
// 声明：汉东省、京州市等为虚构地名，仅供治理逻辑推演，不映射任何真实行政区。
// ============================================================================

export const HANDONG_STORAGE_KEY = 'c2os-handong-config';

export const HANDONG_DOMAINS = ['经济发展', '社会稳定', '政治生态', '生态文明', '民生福祉'];

export const HANDONG_TOOLS = [
  { id: 'fiscal', label: '财政投入', color: '#e8a317', desc: '专项债/转移支付/减税——稳投资、兜底线' },
  { id: 'industry', label: '产业扶持', color: '#8b5cf6', desc: '链主培育/技改补贴/园区升级——调结构、促转型' },
  { id: 'org', label: '组织整顿', color: '#c41e3a', desc: '巡视整改/人事调整/纪律震慑——净生态、强执行' },
  { id: 'invest', label: '招商让利', color: '#10b981', desc: '土地优惠/审批提速/营商环境——引项目、增税源' },
  { id: 'stability', label: '维稳兜底', color: '#22d3ee', desc: '信访化解/网格治理/应急储备——控风险、保底线' },
];

export const DEFAULT_HANDONG_CONFIG = {
  population: 4200,
  capital: '京州市',
  gdpTier: '中游',
  gdpGrowth: 5.2,
  resources: { coal: 65, agriculture: 55, port: 40, tourism: 30 },
  industryMix: { primary: 12, secondary: 48, tertiary: 40 },
  fiscalSelf: 42,
  debtRatio: 180,
  teamStructure: {
    standingCommittee: 11,
    avgAge: 54,
    graduateRatio: 72,
    localRatio: 38,
  },
  team: {
    secretary: null,
    governor: null,
    discipline: null,
    politics: null,
    executive: null,
  },
};

export const TEAM_ROLES = [
  { id: 'secretary', label: '省委书记', required: true, minAge: 50, maxAge: 65 },
  { id: 'governor', label: '省长', required: true, minAge: 50, maxAge: 65 },
  { id: 'discipline', label: '纪委书记', required: false, minAge: 48, maxAge: 63 },
  { id: 'politics', label: '政法委书记', required: false, minAge: 50, maxAge: 63 },
  { id: 'executive', label: '常务副省长', required: false, minAge: 48, maxAge: 62 },
];

/** 六类省域情景 */
export const HANDONG_SCENARIOS = {
  anticorruption: {
    label: '反腐风暴',
    color: '#c41e3a',
    intro: '中央巡视组进驻，多名厅局级干部落马，政治生态震荡与项目停摆叠加，考验班子定力与制度重建能力。',
    triggers: ['巡视进驻', '厅官落马', '项目审查', '舆论聚焦'],
    timeline: [
      { phase: 'T+0', event: '巡视组进驻动员会，宣布重点审查领域' },
      { phase: 'T+2周', event: '首批厅局级干部被带走，多个在建项目停工审查' },
      { phase: 'T+1月', event: '省纪委通报典型案例，引发干部观望情绪' },
      { phase: 'T+2月', event: '整改方案上报中央，班子调整窗口打开' },
      { phase: 'T+3月', event: '政治生态评估与问责清单落地' },
    ],
    impact: [0.35, 0.55, 0.9, 0.2, 0.4],
    toolbox: [
      ['以案促改', '举一反三建制度，堵塞审批与招投标漏洞'],
      ['人事调整', '关键岗位补缺配强，打破利益固化格局'],
      ['项目复工', '分类处置存量项目，区分腐败与合规'],
    ],
    talentNeed: '需要纪律审查型 + 经济恢复型复合主官：既敢刮骨疗毒，又能稳住投资与就业基本盘。',
    talentKeywords: ['纪检', '巡视', '组织', '政法', '发改'],
    mitigation: {
      fiscal: [8, 12, 5, 4, 14],
      industry: [12, 6, 4, 3, 8],
      org: [6, 10, 42, 4, 6],
      invest: [18, 8, 8, 2, 10],
      stability: [4, 28, 12, 3, 12],
    },
  },
  industryTransform: {
    label: '产业转型',
    color: '#8b5cf6',
    intro: '煤炭产能压减与新兴产业培育并行，传统就业承压、财政税源收缩，转型阵痛与增长目标冲突。',
    triggers: ['产能压减令', '煤价波动', '就业压力', '新兴产业招商'],
    timeline: [
      { phase: 'Q1', event: '中央下达产能压减指标，多家煤矿关停' },
      { phase: 'Q2', event: '失业人员安置与再培训方案启动' },
      { phase: 'Q3', event: '新能源产业园签约，但落地进度滞后' },
      { phase: 'Q4', event: '全年GDP增速承压，班子考核压力陡增' },
    ],
    impact: [0.75, 0.6, 0.35, 0.55, 0.65],
    toolbox: [
      ['链主培育', '聚焦新能源与装备制造，以点带面'],
      ['就业兜底', '矿工转岗培训+公益性岗位托底'],
      ['财政转型', '争取转移支付+发行专项债补缺口'],
    ],
    talentNeed: '需要产业操盘手型省长：懂煤炭退出节奏，能协调央企与地方利益，有新兴产业招商实绩。',
    talentKeywords: ['工信', '发改', '能源', '产业', '招商'],
    mitigation: {
      fiscal: [22, 10, 4, 6, 18],
      industry: [38, 8, 3, 12, 14],
      org: [4, 6, 8, 2, 4],
      invest: [28, 6, 2, 4, 10],
      stability: [6, 18, 4, 4, 16],
    },
  },
  environmental: {
    label: '环保督查',
    color: '#10b981',
    intro: '中央环保督察组点名汉东：煤矿生态破坏、京州空气质量不达标，一批项目被叫停，绿色考核一票否决。',
    triggers: ['督察进驻', '红线项目', '空气质量', '生态赔偿'],
    timeline: [
      { phase: 'D+0', event: '督察组通报典型案例，要求立行立改' },
      { phase: 'D+7', event: '12 家企业停产整顿，涉及产值占全省 8%' },
      { phase: 'D+30', event: '生态赔偿与修复方案启动，财政支出陡增' },
      { phase: 'D+90', event: '整改验收与问责，部分主官被约谈' },
    ],
    impact: [0.55, 0.45, 0.5, 0.85, 0.5],
    toolbox: [
      ['停产整治', '分类关停与限期整改并行'],
      ['生态修复', '矿山复绿+流域治理专项'],
      ['绿色转型', '压减高耗能，扶持清洁产能'],
    ],
    talentNeed: '需要生态治理型主官：有环保督察整改经验，能在发展与环保间找平衡。',
    talentKeywords: ['生态', '环保', '自然资源', '水利', '林'],
    mitigation: {
      fiscal: [10, 8, 4, 22, 12],
      industry: [14, 4, 2, 28, 6],
      org: [4, 8, 14, 8, 4],
      invest: [12, 4, 2, 18, 6],
      stability: [6, 16, 6, 10, 10],
    },
  },
  debtResolution: {
    label: '债务化解',
    color: '#e8a317',
    intro: '城投平台隐性债务暴露，多家平台违约传闻，融资成本飙升，土地财政断崖式下滑。',
    triggers: ['平台违约', '利差走阔', '土地财政', '三保压力'],
    timeline: [
      { phase: 'W+0', event: '某城投非标违约，市场信心受挫' },
      { phase: 'W+2', event: '省金融办启动债务摸底，口径从严' },
      { phase: 'M+1', event: '置换债方案上报，部分项目停建' },
      { phase: 'M+3', event: '化债方案获批，但新增投资近乎冻结' },
    ],
    impact: [0.8, 0.5, 0.45, 0.15, 0.55],
    toolbox: [
      ['债务重组', '展期置换+资产盘活组合拳'],
      ['平台转型', '剥离政府融资职能，市场化运营'],
      ['三保刚性', '压缩非刚性支出，保工资保运转保民生'],
    ],
    talentNeed: '需要金融处置型省长：懂城投债结构，能谈判银行与债权人，有化债实操履历。',
    talentKeywords: ['财政', '金融', '国资', '发改', '审计'],
    mitigation: {
      fiscal: [32, 14, 8, 2, 22],
      industry: [12, 6, 4, 2, 8],
      org: [6, 8, 12, 2, 6],
      invest: [18, 4, 4, 1, 8],
      stability: [8, 20, 6, 2, 14],
    },
  },
  petitionStability: {
    label: '信访维稳',
    color: '#22d3ee',
    intro: '京州某开发区征地补偿纠纷引发群体性事件，网络舆情发酵，信访量激增，维稳压力陡升。',
    triggers: ['群体事件', '网络舆情', '信访激增', '考核问责'],
    timeline: [
      { phase: 'H+0', event: '数百群众聚集省政府门口，诉求征地补偿' },
      { phase: 'H+6', event: '网络视频传播，舆论压力上升' },
      { phase: 'D+1', event: '省政法委牵头成立专班，现场处置' },
      { phase: 'D+7', event: '补偿方案谈判，部分诉求仍未满足' },
      { phase: 'D+30', event: '信访积案化解与问责同步推进' },
    ],
    impact: [0.25, 0.9, 0.55, 0.2, 0.7],
    toolbox: [
      ['现场处置', '专班进驻，分类化解诉求'],
      ['补偿谈判', '依法依规，适度让利稳预期'],
      ['舆情管控', '权威口径+谣言澄清'],
    ],
    talentNeed: '需要维稳复合型主官：有群体性事件处置经验，懂信访条例与舆情管理。',
    talentKeywords: ['政法', '信访', '公安', '应急', '统战'],
    mitigation: {
      fiscal: [6, 10, 4, 2, 18],
      industry: [4, 4, 2, 1, 6],
      org: [4, 12, 18, 2, 6],
      invest: [6, 6, 2, 1, 8],
      stability: [4, 42, 10, 3, 22],
    },
  },
  investment: {
    label: '招商引资',
    color: '#fb923c',
    intro: '邻省打出激进招商政策，汉东外资与民企项目外流，书记亲自带队「抢项目」，但环保与债务约束仍在。',
    triggers: ['项目外流', '书记带队', '政策比拼', '落地考核'],
    timeline: [
      { phase: 'M1', event: '三家重点企业宣布外迁意向' },
      { phase: 'M2', event: '省委书记带队赴长三角招商' },
      { phase: 'M3', event: '签约 200 亿项目，但落地率仅 40%' },
      { phase: 'M6', event: '考核倒逼，未落地项目问责' },
    ],
    impact: [0.7, 0.35, 0.3, 0.25, 0.45],
    toolbox: [
      ['政策包', '税收优惠+土地让利+审批绿色通道'],
      ['书记带队', '一把手招商，提升项目能级'],
      ['落地考核', '签约≠落地，全生命周期跟踪'],
    ],
    talentNeed: '需要招商操盘手：有长三角/珠三角招商实绩，懂产业链图谱与政策博弈。',
    talentKeywords: ['招商', '商务', '工信', '园区', '发改'],
    mitigation: {
      fiscal: [14, 4, 2, 3, 8],
      industry: [28, 4, 2, 6, 10],
      org: [4, 6, 8, 2, 4],
      invest: [38, 6, 4, 4, 12],
      stability: [6, 10, 4, 2, 8],
    },
  },
};

export function loadHandongConfig() {
  try {
    const raw = localStorage.getItem(HANDONG_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_HANDONG_CONFIG, team: { ...DEFAULT_HANDONG_CONFIG.team } };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HANDONG_CONFIG,
      ...parsed,
      resources: { ...DEFAULT_HANDONG_CONFIG.resources, ...parsed.resources },
      industryMix: { ...DEFAULT_HANDONG_CONFIG.industryMix, ...parsed.industryMix },
      teamStructure: { ...DEFAULT_HANDONG_CONFIG.teamStructure, ...parsed.teamStructure },
      team: { ...DEFAULT_HANDONG_CONFIG.team, ...parsed.team },
    };
  } catch {
    return { ...DEFAULT_HANDONG_CONFIG, team: { ...DEFAULT_HANDONG_CONFIG.team } };
  }
}

export function saveHandongConfig(config) {
  try {
    localStorage.setItem(HANDONG_STORAGE_KEY, JSON.stringify(config));
  } catch { /* noop */ }
}
