// ============================================================================
// 中国学者专栏 · 通用数据契约（IA 见 docs/scholars/README.md）
// ----------------------------------------------------------------------------
// 每位学者 = 一个 data.js，按下列形状导出；专栏总览只读 SCHOLARS 名册。
// 核验硬约束：引语须有可追溯出处（场合 + 日期 + 媒体/著作）；转述标 type:'转述'；
// 未核实者进 DOUBTFUL 或不收录；数字标口径与出处。
// ============================================================================

/**
 * @typedef {'原话'|'转述'} ClaimType
 * @typedef {'primary'|'media'|'reprint'|'doubt'} VerifyLevel
 *   primary 主办方/官方/署名文章/著作原文 · media 主流媒体报道 · reprint 转载整理稿（未见主办方原文）· doubt 存疑
 *
 * @typedef {Object} Claim 观点/引语条目
 * @property {string} id
 * @property {string} text       原话须逐字；转述为本模块概括
 * @property {ClaimType} type
 * @property {string} date       YYYY-MM-DD / YYYY-MM / YYYY
 * @property {string} venue      场合（会议 / 采访 / 著作章节）
 * @property {string} source     媒体或著作
 * @property {string} [url]
 * @property {VerifyLevel} verified
 *
 * @typedef {Object} LedgerItem 预判检验台账
 * @property {string} id
 * @property {string} claim
 * @property {ClaimType} type
 * @property {string} date
 * @property {string} venue
 * @property {string} [url]
 * @property {'done'|'failed'|'open'} status
 * @property {string} check      对照口径与数据
 * @property {string} dataSrc
 */

export const VERIFY_META = {
  primary: { label: '一手', color: '#10b981', note: '主办方 / 官方 / 署名文章 / 著作原文' },
  media: { label: '媒体', color: '#22d3ee', note: '主流媒体现场报道' },
  reprint: { label: '转载', color: '#e8a317', note: '整理稿转载，未见主办方原文' },
  doubt: { label: '存疑', color: '#c41e3a', note: '口径或出处未能核实' },
};

export const LEDGER_META = {
  done: { label: '已兑现', color: '#10b981' },
  failed: { label: '已失败', color: '#c41e3a' },
  open: { label: '未决', color: '#e8a317' },
};

/**
 * 专栏名册：status 'live' 已建看板；'planned' 仅占位（不写任何观点内容）。
 * 顺序为上线次序，不代表评价或排序；选人理由见 docs/scholars/roster.md。
 */
export const SCHOLARS = [
  {
    id: 'huang-qifan',
    name: '黄奇帆',
    status: 'live',
    domain: 'econ',
    route: '/scholars/huang-qifan',
    archetype: '学者型官员',
    roles: '重庆市原市长 · 十二届全国人大财经委原副主任委员 · 中国金融四十人论坛学术顾问',
    fields: ['宏观与结构性改革', '土地与房地产', '产业链与开放', '数字经济', '国际贸易'],
    corpus: '著作 7 部 · 讲话/文章 29 篇 · 1995–2026',
    accent: '#d4af37',
  },
  {
    id: 'lin-yifu', name: '林毅夫', status: 'live', domain: 'econ', route: '/scholars/lin-yifu', archetype: '发展经济学',
    roles: '北京大学新结构经济学研究院院长 · 国家发展研究院名誉院长 · 全国政协常委 · 原世界银行首席经济学家',
    fields: ['新结构经济学', '增长潜力', '中国改革史', '投资与财政', '全球南方'], corpus: '著作 15 部 · 讲话/文章 30 篇 · 1992–2026', accent: '#e8a317',
  },
  {
    id: 'zhou-qiren', name: '周其仁', status: 'live', domain: 'econ', route: '/scholars/zhou-qiren', archetype: '产权制度经济学',
    roles: '北京大学博雅资深教授 · 国家发展研究院教授 · 原国发院院长（2008—2012）',
    fields: ['产权与土地', '城乡中国', '货币与宏观', '医疗与公共服务', '企业突围'], corpus: '著作 10 部 · 讲话/文章 27 篇 · 2002–2026', accent: '#22d3ee',
  },
  {
    id: 'wen-tiejun', name: '温铁军', status: 'live', domain: 'econ', route: '/scholars/wen-tiejun', archetype: '三农与危机论',
    roles: '西南大学中国乡村建设学院执行院长 · 福建农林大学乡村振兴学院院长 · 国家粮食安全专家委员会委员',
    fields: ['三农', '土地制度', '成本转嫁', '县域生态化', '粮食安全'], corpus: '著作 11 部 · 讲话/文章 26 篇 · 1996–2026', accent: '#10b981',
  },
  {
    id: 'he-xuefeng', name: '贺雪峰', status: 'live', domain: 'politics', route: '/scholars/he-xuefeng', archetype: '农村社会学',
    roles: '武汉大学社会学院院长 · 中国乡村治理研究中心主任 · 教育部长江学者特聘教授',
    fields: ['基层治理', '土地制度', '城市化与农民工', '乡村振兴', '县域城镇化'], corpus: '著作 13 部 · 讲话/文章 29 篇 · 2003–2026', accent: '#fb923c',
  },
  {
    id: 'yu-yongding', name: '余永定', status: 'live', domain: 'econ', route: '/scholars/yu-yongding', archetype: '宏观与国际金融',
    roles: '中国社会科学院学部委员 · 原世界经济与政治研究所所长 · 原央行货币政策委员会委员 · 浦山基金会会长',
    fields: ['宏观与增长', '财政扩张', '通缩与货币', '汇率与资本账户', '外储安全'], corpus: '著作 8 部 · 讲话/文章 29 篇 · 1996–2026', accent: '#8b5cf6',
  },
  {
    id: 'cai-fang', name: '蔡昉', status: 'live', domain: 'econ', route: '/scholars/cai-fang', archetype: '人口与劳动经济',
    roles: '中国社会科学院国家高端智库首席专家 · 学部委员 · CF40 学术委员会主席 · 原社科院副院长',
    fields: ['人口转变', '劳动力市场', '户籍与城市化', '收入分配与消费', '增长潜力'], corpus: '著作 12 部 · 讲话/文章 28 篇 · 1990–2026', accent: '#c41e3a',
  },
  {
    id: 'zhou-li-an', name: '周黎安', status: 'live', domain: 'politics', route: '/scholars/zhou-li-an', archetype: '政治经济学',
    roles: '北京大学经济与管理学部主任 · 光华管理学院应用经济系教授 · 第十四届全国政协委员',
    fields: ['晋升锦标赛', '行政发包制', '官场+市场', '地方债与土地财政', '治理不可能三角'], corpus: '著作 6 部 · 论文/讲话/文章 26 篇 · 1992–2026', accent: '#94a3b8',
  },
  {
    id: 'yan-xuetong', name: '阎学通', status: 'live', domain: 'intlSoc', route: '/scholars/yan-xuetong', archetype: '道义现实主义',
    roles: '清华大学文科资深教授 · 国际关系研究院名誉院长 · 俄罗斯科学院外籍院士',
    fields: ['道义现实主义', '中美两极', '台海与周边', '数字时代竞争', '预测检验'], corpus: '著作 12 部 · 讲话/文章 31 篇 · 1996–2026', accent: '#22d3ee',
  },
  {
    id: 'xiang-biao', name: '项飙', status: 'live', domain: 'intlSoc', route: '/scholars/xiang-biao', archetype: '社会人类学',
    roles: '马克斯·普朗克社会人类学研究所所长 · 原牛津大学社会人类学教授',
    fields: ['流动人口', '悬浮与内卷', '附近', '全球劳动流动', '方法论'], corpus: '著作 8 部 · 讲话/采访/文章 24 篇 · 2000–2026', accent: '#10b981',
  },
  {
    id: 'yu-keping', name: '俞可平', status: 'live', domain: 'politics', route: '/scholars/yu-keping', archetype: '民主治理 · 善治',
    roles: '深圳大学政府管理学院院长 · 北京大学讲席教授、中国政治学研究中心主任 · 原中央编译局副局长',
    fields: ['增量民主', '善治', '国家治理现代化', '地方政府创新', '官本主义'], corpus: '著作 15 部 · 讲话/文章 29 篇 · 1989–2026', accent: '#22d3ee',
  },
  {
    id: 'wang-shaoguang', name: '王绍光', status: 'live', domain: 'politics', route: '/scholars/wang-shaoguang', archetype: '国家能力论',
    roles: '香港中文大学政治与公共行政系荣休讲座教授 · 清华大学国情研究院兼职高级研究员',
    fields: ['国家能力', '汲取能力', '代表型民主', '政道思维', '议程设置'], corpus: '著作 13 部 · 讲话/文章 29 篇 · 1991–2026', accent: '#e8a317',
  },
  {
    id: 'yang-guangbin', name: '杨光斌', status: 'live', domain: 'politics', route: '/scholars/yang-guangbin', archetype: '历史政治学',
    roles: '中国人民大学国际关系学院院长、吴玉章讲席教授 · 全国政协委员 · 中国政治学会副会长',
    fields: ['可治理的民主', '历史政治学', '国家治理能力', '政党中心主义', '自主知识体系'], corpus: '著作 12 部 · 讲话/文章 30 篇 · 2003–2026', accent: '#c41e3a',
  },
  {
    id: 'pan-wei', name: '潘维', status: 'live', domain: 'politics', route: '/scholars/pan-wei', archetype: '中华体制论',
    roles: '澳门大学政府与行政学系讲座教授、全球与公共事务研究所所长 · 原北京大学国际关系学院教授',
    fields: ['中国模式', '中华体制', '民本政治', '咨询型法治', '社稷体制'], corpus: '著作 9 部 · 讲话/文章 28 篇 · 2002–2026', accent: '#d4af37',
  },
  {
    id: 'xiao-gongqin', name: '萧功秦', status: 'live', domain: 'politics', route: '/scholars/xiao-gongqin', archetype: '新权威主义',
    roles: '上海师范大学人文学院历史系教授 · 上海市文史研究馆馆员',
    fields: ['新权威主义', '后全能体制', '中国模式', '晚清镜鉴', '反激进主义'], corpus: '著作 13 部 · 讲话/文章 26 篇 · 1986–2025', accent: '#8b5cf6',
  },
  {
    id: 'xu-yong', name: '徐勇', status: 'live', domain: 'politics', route: '/scholars/xu-yong', archetype: '田野政治学',
    roles: '华中师范大学资深教授、政治学部部长 · 教育部"长江学者"特聘教授',
    fields: ['村民自治', '田野政治学', '家户制', '国家化', '关系中的国家'], corpus: '著作 15 部 · 讲话/文章 30 篇 · 1992–2025', accent: '#10b981',
  },
  {
    id: 'zhou-xueguang', name: '周雪光', status: 'live', domain: 'politics', route: '/scholars/zhou-xueguang', archetype: '组织社会学',
    roles: '斯坦福大学社会学系教授、Kwoh-Ting Li 讲座教授 · FSI 高级研究员 · 斯坦福东亚研究中心主任',
    fields: ['一统体制', '帝国逻辑', '运动型治理', '控制权理论', '共谋与变通'], corpus: '著作 9 部 · 论文/讲座/采访 30 篇 · 1992–2026', accent: '#fb923c',
  },
  {
    id: 'jing-yuejin', name: '景跃进', status: 'live', domain: 'politics', route: '/scholars/jing-yuejin', archetype: '党政关系',
    roles: '清华大学社会科学学院政治学系教授 ·《当代中国政府与政治》主编之一',
    fields: ['党政体制', '将政党带进来', '基层民主', '代表理论', '学科建设'], corpus: '著作 10 部 · 论文/讲话/文章 30 篇 · 1989–2026', accent: '#94a3b8',
  },
];

/**
 * 思想光谱 · 关键议题（总览页对照矩阵的行）。
 * 每位学者的 <slug>/stances.js 只为有可核验公开表态的议题提供条目；无表态则留空，不推测。
 */
export const STANCE_ISSUES = [
  { id: 'industrialPolicy', group: 'econ', label: '产业政策', hint: '政府是否及如何因势利导 / 选择产业' },
  { id: 'land', group: 'econ', label: '土地制度', hint: '农地产权、宅基地、集体建设用地入市' },
  { id: 'property', group: 'econ', label: '房地产', hint: '房价、去库存、新模式与长效机制' },
  { id: 'localDebt', group: 'econ', label: '地方债与财政', hint: '隐性债务、化债、财政扩张空间' },
  { id: 'consumption', group: 'econ', label: '消费与收入分配', hint: '扩内需、居民收入占比、社保与转移支付' },
  { id: 'usChina', group: 'econ', label: '中美关系', hint: '脱钩、关税战、大国竞争格局' },
  { id: 'population', group: 'econ', label: '人口', hint: '老龄化、少子化、户籍与流动人口' },
  { id: 'democracy', group: 'politics', label: '民主与治理', hint: '民主的内涵与形式、选举与协商、增量民主 / 全过程人民民主 / 善治' },
  { id: 'partyState', group: 'politics', label: '党政关系', hint: '党的领导体制、党政分开与党政统合、政党中心的国家建设' },
  { id: 'centralLocal', group: 'politics', label: '中央地方关系', hint: '集权与分权、一统体制与有效治理、行政发包、属地管理' },
  { id: 'bureaucracy', group: 'politics', label: '官僚激励与干部', hint: '干部考核与晋升、避责与形式主义、运动型治理' },
  { id: 'legitimacy', group: 'politics', label: '政治合法性来源', hint: '绩效、民本 / 民心、选举程序、传统与意识形态' },
  { id: 'reformPath', group: 'politics', label: '改革路径', hint: '渐进改革与新权威、政治体制改革的次序、顶层设计' },
];

export const STANCE_GROUPS = {
  econ: { label: '经济与社会议题' },
  politics: { label: '政治与治理议题' },
};

/** 名册分组（总览页按组展示；SCHOLARS[].domain 引用其 key） */
export const SCHOLAR_DOMAINS = [
  { id: 'econ', label: '经济与民生', note: '宏观金融、发展与制度经济学、人口与三农' },
  { id: 'politics', label: '政治与治理', note: '国家治理、政治发展道路、央地与干部制度、基层治理' },
  { id: 'intlSoc', label: '国际与社会', note: '国际关系与社会人类学' },
];

/** 单学者看板的标准 Tab（新学者沿用，缺维度可隐藏） */
export const SCHOLAR_TABS = [
  { id: 'overview', label: '总览 · 人物与框架' },
  { id: 'views', label: '分领域观点' },
  { id: 'ledger', label: '预判检验台账' },
  { id: 'library', label: '著作与讲话文库' },
  { id: 'debate', label: '争议与出处' },
];
