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
    route: '/scholars/huang-qifan',
    archetype: '学者型官员',
    roles: '重庆市原市长 · 十二届全国人大财经委原副主任委员 · 中国金融四十人论坛学术顾问',
    fields: ['宏观与结构性改革', '土地与房地产', '产业链与开放', '数字经济', '国际贸易'],
    corpus: '著作 7 部 · 讲话/文章 29 篇 · 1995–2026',
    accent: '#d4af37',
  },
  {
    id: 'lin-yifu', name: '林毅夫', status: 'live', route: '/scholars/lin-yifu', archetype: '发展经济学',
    roles: '北京大学新结构经济学研究院院长 · 国家发展研究院名誉院长 · 全国政协常委 · 原世界银行首席经济学家',
    fields: ['新结构经济学', '增长潜力', '中国改革史', '投资与财政', '全球南方'], corpus: '著作 15 部 · 讲话/文章 30 篇 · 1992–2026', accent: '#e8a317',
  },
  {
    id: 'zhou-qiren', name: '周其仁', status: 'live', route: '/scholars/zhou-qiren', archetype: '产权制度经济学',
    roles: '北京大学博雅资深教授 · 国家发展研究院教授 · 原国发院院长（2008—2012）',
    fields: ['产权与土地', '城乡中国', '货币与宏观', '医疗与公共服务', '企业突围'], corpus: '著作 10 部 · 讲话/文章 27 篇 · 2002–2026', accent: '#22d3ee',
  },
  {
    id: 'wen-tiejun', name: '温铁军', status: 'live', route: '/scholars/wen-tiejun', archetype: '三农与危机论',
    roles: '西南大学中国乡村建设学院执行院长 · 福建农林大学乡村振兴学院院长 · 国家粮食安全专家委员会委员',
    fields: ['三农', '土地制度', '成本转嫁', '县域生态化', '粮食安全'], corpus: '著作 11 部 · 讲话/文章 26 篇 · 1996–2026', accent: '#10b981',
  },
  {
    id: 'he-xuefeng', name: '贺雪峰', status: 'live', route: '/scholars/he-xuefeng', archetype: '农村社会学',
    roles: '武汉大学社会学院院长 · 中国乡村治理研究中心主任 · 教育部长江学者特聘教授',
    fields: ['基层治理', '土地制度', '城市化与农民工', '乡村振兴', '县域城镇化'], corpus: '著作 13 部 · 讲话/文章 29 篇 · 2003–2026', accent: '#fb923c',
  },
  {
    id: 'yu-yongding', name: '余永定', status: 'live', route: '/scholars/yu-yongding', archetype: '宏观与国际金融',
    roles: '中国社会科学院学部委员 · 原世界经济与政治研究所所长 · 原央行货币政策委员会委员 · 浦山基金会会长',
    fields: ['宏观与增长', '财政扩张', '通缩与货币', '汇率与资本账户', '外储安全'], corpus: '著作 8 部 · 讲话/文章 29 篇 · 1996–2026', accent: '#8b5cf6',
  },
  {
    id: 'cai-fang', name: '蔡昉', status: 'live', route: '/scholars/cai-fang', archetype: '人口与劳动经济',
    roles: '中国社会科学院国家高端智库首席专家 · 学部委员 · CF40 学术委员会主席 · 原社科院副院长',
    fields: ['人口转变', '劳动力市场', '户籍与城市化', '收入分配与消费', '增长潜力'], corpus: '著作 12 部 · 讲话/文章 28 篇 · 1990–2026', accent: '#c41e3a',
  },
  {
    id: 'zhou-li-an', name: '周黎安', status: 'live', route: '/scholars/zhou-li-an', archetype: '政治经济学',
    roles: '北京大学经济与管理学部主任 · 光华管理学院应用经济系教授 · 第十四届全国政协委员',
    fields: ['晋升锦标赛', '行政发包制', '官场+市场', '地方债与土地财政', '治理不可能三角'], corpus: '著作 6 部 · 论文/讲话/文章 26 篇 · 1992–2026', accent: '#94a3b8',
  },
  {
    id: 'yan-xuetong', name: '阎学通', status: 'live', route: '/scholars/yan-xuetong', archetype: '道义现实主义',
    roles: '清华大学文科资深教授 · 国际关系研究院名誉院长 · 俄罗斯科学院外籍院士',
    fields: ['道义现实主义', '中美两极', '台海与周边', '数字时代竞争', '预测检验'], corpus: '著作 12 部 · 讲话/文章 31 篇 · 1996–2026', accent: '#22d3ee',
  },
  {
    id: 'xiang-biao', name: '项飙', status: 'live', route: '/scholars/xiang-biao', archetype: '社会人类学',
    roles: '马克斯·普朗克社会人类学研究所所长 · 原牛津大学社会人类学教授',
    fields: ['流动人口', '悬浮与内卷', '附近', '全球劳动流动', '方法论'], corpus: '著作 8 部 · 讲话/采访/文章 24 篇 · 2000–2026', accent: '#10b981',
  },
];

/**
 * 思想光谱 · 关键议题（总览页对照矩阵的行）。
 * 每位学者的 <slug>/stances.js 只为有可核验公开表态的议题提供条目；无表态则留空，不推测。
 */
export const STANCE_ISSUES = [
  { id: 'industrialPolicy', label: '产业政策', hint: '政府是否及如何因势利导 / 选择产业' },
  { id: 'land', label: '土地制度', hint: '农地产权、宅基地、集体建设用地入市' },
  { id: 'property', label: '房地产', hint: '房价、去库存、新模式与长效机制' },
  { id: 'localDebt', label: '地方债与财政', hint: '隐性债务、化债、财政扩张空间' },
  { id: 'consumption', label: '消费与收入分配', hint: '扩内需、居民收入占比、社保与转移支付' },
  { id: 'usChina', label: '中美关系', hint: '脱钩、关税战、大国竞争格局' },
  { id: 'population', label: '人口', hint: '老龄化、少子化、户籍与流动人口' },
];

/** 单学者看板的标准 Tab（新学者沿用，缺维度可隐藏） */
export const SCHOLAR_TABS = [
  { id: 'overview', label: '总览 · 人物与框架' },
  { id: 'views', label: '分领域观点' },
  { id: 'ledger', label: '预判检验台账' },
  { id: 'library', label: '著作与讲话文库' },
  { id: 'debate', label: '争议与出处' },
];
