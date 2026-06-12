// ============================================================================
// 深度透视 · 八维作战室数据（示意标定）
// ----------------------------------------------------------------------------
// 维度键与 Page 的 CONTENT_GROUPS / registry 分组一致。
// readingPath 的模块 id 必须真实存在于 registry.js（冒烟脚本正则校验）。
// tension / 雷达数值为分析框架内的相对标定，非实时量化指标。
// ============================================================================

export const DIM_PROFILE = [
  {
    key: 'institutions',
    label: '制度与改革',
    color: '#e8a317',
    posture: '改革进入深水区，制度供给速度与执行损耗赛跑，存量利益再切分阻力上升。',
    tension: 58,
    momentum: '胶着',
    keyQuestions: ['央地财权事权如何再切分', '国资扩张与民企信心怎样并存', '法治能否约束运动式执行'],
    watch: ['统一大市场清单', '央地财政改革节奏', '营商环境外资口碑'],
    readingPath: ['powerlogic', 'reform', 'govsystem'],
  },
  {
    key: 'depthtopics',
    label: '深度专题',
    color: '#10b981',
    posture: '开放与数字两条线持续推进，贸易新三样与制度型开放对冲外部脱钩压力。',
    tension: 46,
    momentum: '上行',
    keyQuestions: ['制度型开放能换来多少增量', '新三样出口的天花板在哪', '民营经济预期如何真正修复'],
    watch: ['新三样出口增速', '自贸区负面清单', '民间投资占比'],
    readingPath: ['private', 'foreignTrade', 'digital'],
  },
  {
    key: 'techtopics',
    label: '科技专题',
    color: '#22d3ee',
    posture: '封锁倒逼自主，先进制程与智算底座加速补课，原始创新仍是最长的短板。',
    tension: 73,
    momentum: '上行',
    keyQuestions: ['先进制程何时摆脱卡点', '智算供给能否追上需求', '基础研究投入如何见效'],
    watch: ['国产设备验证进度', '智算中心利用率', '基础研究经费占比'],
    readingPath: ['semiconductor', 'aiplus', 'npf'],
  },
  {
    key: 'society',
    label: '社会与民生',
    color: '#f0abfc',
    posture: '人口负增长叠加地产下行，民生支出刚性上升，社会预期修复慢于政策投放。',
    tension: 54,
    momentum: '承压',
    keyQuestions: ['生育支持能否扭转出生数', '养老金缺口靠什么填', '住房去库存还要多久'],
    watch: ['出生人口数据', '青年调查失业率', '保障房筹建进度'],
    readingPath: ['demographic', 'housing', 'consumption'],
  },
  {
    key: 'industry',
    label: '产业与制造',
    color: '#fb923c',
    posture: '制造规模优势仍在扩大，高端环节持续突破，产能与利润的剪刀差待解。',
    tension: 64,
    momentum: '上行',
    keyQuestions: ['内卷式产能如何有序出清', '链主企业能否带动中小厂', '绿色转型成本由谁消化'],
    watch: ['制造业PMI走向', '工业企业利润率', '新能源装机节奏'],
    readingPath: ['manufacturing', 'energy', 'supplychain'],
  },
  {
    key: 'finance',
    label: '货币金融',
    color: '#d4af37',
    posture: '化债与稳汇率双线作战，信用扩张依赖财政接力，金融让利空间逼近边界。',
    tension: 78,
    momentum: '承压',
    keyQuestions: ['地方化债与发展如何兼得', '低利率下银行息差怎么守', '人民币国际化下一跳板'],
    watch: ['社融与M2剪刀差', '城投债到期高峰', 'CIPS结算份额'],
    readingPath: ['finance', 'debtHeatmap', 'financeRmb'],
  },
  {
    key: 'region',
    label: '区域与全球化',
    color: '#8b5cf6',
    posture: '板块分化趋稳，人口与产业向优势区域集聚，海洋与通道经营稳步外推。',
    tension: 38,
    momentum: '胶着',
    keyQuestions: ['转移支付模式还能走多远', '东北与县域如何留住人', '海洋权益经营边际在哪'],
    watch: ['省际人口净流入', '中欧班列开行量', '海洋经济总量'],
    readingPath: ['regional', 'rural', 'marine'],
  },
  {
    key: 'security',
    label: '安全与国防',
    color: '#c41e3a',
    posture: '台海与科技安全双热点叠加，威慑与反介入体系加速成型，灰色地带博弈常态化。',
    tension: 87,
    momentum: '胶着',
    keyQuestions: ['台海威慑的可信度阈值', '大安全观的成本边界', '动员体系能否平战转换'],
    watch: ['环台演训频次', '军费结构变化', '关键物资储备'],
    readingPath: ['straits', 'military', 'omnisecurity'],
  },
];

export const DIM_LINKS = [
  { from: 'finance', to: 'industry', note: '信贷传导：宽信用先到制造' },
  { from: 'security', to: 'techtopics', note: '自主可控倒逼研发投入' },
  { from: 'techtopics', to: 'industry', note: '技术扩散改造产线' },
  { from: 'society', to: 'finance', note: '养老缺口压资产负债表' },
  { from: 'institutions', to: 'finance', note: '化债框架靠央地重构' },
  { from: 'industry', to: 'region', note: '产业转移重塑板块格局' },
  { from: 'depthtopics', to: 'region', note: '开放通道牵引边疆板块' },
  { from: 'institutions', to: 'depthtopics', note: '制度型开放定规则接口' },
  { from: 'security', to: 'finance', note: '制裁风险倒逼金融备份' },
  { from: 'region', to: 'society', note: '人口流动重排公共服务' },
];

// 每维 5 指标雷达（指标名贴维度语义，数值为相对标定示意）
const RADAR_MAP = {
  institutions: {
    names: ['改革推进度', '执行一致性', '法治约束力', '央地协同', '制度开放度'],
    values: [62, 55, 58, 50, 64],
  },
  depthtopics: {
    names: ['开放广度', '贸易韧性', '数字渗透', '民企活力', '文化外溢'],
    values: [72, 68, 76, 52, 58],
  },
  techtopics: {
    names: ['自主可控', '研发强度', '人才厚度', '成果转化', '前沿卡位'],
    values: [58, 74, 66, 52, 70],
  },
  society: {
    names: ['民生保障', '就业吸纳', '住房消化', '生育友好', '养老准备'],
    values: [64, 58, 46, 42, 50],
  },
  industry: {
    names: ['规模优势', '链条完整', '高端突破', '绿色转型', '成本竞争'],
    values: [88, 82, 60, 66, 72],
  },
  finance: {
    names: ['系统稳健', '化债进度', '资本活性', '货币国际化', '风险缓冲'],
    values: [56, 52, 48, 38, 60],
  },
  region: {
    names: ['板块均衡', '要素流动', '边疆稳固', '海洋拓展', '对外通道'],
    values: [48, 56, 70, 62, 66],
  },
  security: {
    names: ['威慑可信度', '装备现代化', '动员韧性', '网络防御', '周边缓和度'],
    values: [76, 72, 64, 68, 44],
  },
};

export function dimRadarOf(key) {
  const r = RADAR_MAP[key] || RADAR_MAP.institutions;
  return {
    indicator: r.names.map((name) => ({ name, max: 100 })),
    value: r.values.slice(),
  };
}
