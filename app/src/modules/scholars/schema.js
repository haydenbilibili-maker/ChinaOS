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
 * 候选名单为编辑部选题池，不代表评价或排序。
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
  { id: 'slot-02', name: '待建', status: 'planned', archetype: '发展经济学', fields: ['新结构经济学'], accent: '#64748b' },
  { id: 'slot-03', name: '待建', status: 'planned', archetype: '制度经济学', fields: ['产权 · 土地'], accent: '#64748b' },
  { id: 'slot-04', name: '待建', status: 'planned', archetype: '宏观 / 金融', fields: ['货币 · 债务'], accent: '#64748b' },
  { id: 'slot-05', name: '待建', status: 'planned', archetype: '国际政治经济学', fields: ['中美 · 全球化'], accent: '#64748b' },
];

/** 单学者看板的标准 Tab（新学者沿用，缺维度可隐藏） */
export const SCHOLAR_TABS = [
  { id: 'overview', label: '总览 · 人物与框架' },
  { id: 'views', label: '分领域观点' },
  { id: 'ledger', label: '预判检验台账' },
  { id: 'library', label: '著作与讲话文库' },
  { id: 'debate', label: '争议与出处' },
];
