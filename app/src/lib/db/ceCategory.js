// ============================================================================
// 知识精英 · 二级类目分类（种子生成 / 运行时归一化 / 院士并入 共用）
// ============================================================================

export const CE_SUB_CATS = ['humanities', 'socialsci', 'art', 'basicsci', 'engineering', 'health', 'media', 'religion'];

/** 旧 URL / 旧种子键 → 新二级键 */
export const CE_TAB_LEGACY_ALIASES = {
  scholar: 'humanities',
  sci: 'basicsci',
  talent: 'media',
};

export const CE_TAB_LABEL = {
  humanities: '文史哲',
  socialsci: '社科经管',
  art: '艺术类',
  basicsci: '基础科学',
  engineering: '工程技术',
  health: '医学健康',
  media: '知识传播',
  religion: '宗教界人士',
};

const SOCIAL_KW = [
  '经济', '法学', '社会', '政治', '管理', '人类学', '国际关系', '教育', '心理',
  '商业科普', '农业经济', '地理', '统计', '公共管理', '财政', '金融', '贸易',
];
const HEALTH_KW = [
  '医学', '药学', '公共卫生', '传染病', '感染病', '呼吸', '血液', '临床',
  '外科', '内科', '移植', '抗疫', '病理', '肿瘤', '护理', '康复', '卫生',
  '免疫', '神经疾病', '精神卫生',
];
const ENG_KW = [
  '计算机', '人工智能', '通信', '航天', '航空', '导弹', '导航', '工程',
  '土木', '岩土', '爆破', '桥梁', '船舶', '电气', '汽车', '控制', '雷达',
  '激光', '材料', '纳米', '力学', '软件', '云计算', '虚拟', '图形', '机器',
  '制造', '水利', '机械', '冶金', '建筑', '测绘', '矿业', '纺织', '能源',
  '电力', '电子', '信息', '网络',   '密码', '岛隧', '盾构', '隧道', '探月',
  '火星', '北斗', '智能', '超声', '超导', '化工', '运载', '农机', '高铁',
];

function hay(field, institution) {
  return `${field || ''}${institution || ''}`;
}

function matchAny(text, kws) {
  return kws.some((k) => text.includes(k));
}

/** ce-s-* 人文社科子类 */
export function classifyScholarField(field = '') {
  return matchAny(String(field), SOCIAL_KW) ? 'socialsci' : 'humanities';
}

/** ce-sci-* / ac-* 理工医子类 */
export function classifySciField(field = '', institution = '', academy = '') {
  const text = hay(field, institution);
  if (matchAny(text, HEALTH_KW)) return 'health';
  if (matchAny(text, ENG_KW)) return 'engineering';
  if (academy === 'cae') return 'engineering';
  return 'basicsci';
}

const CE_CAT_ALIASES = {
  humanities: 'humanities', socialsci: 'socialsci', art: 'art',
  basicsci: 'basicsci', engineering: 'engineering', health: 'health', media: 'media', religion: 'religion',
  scholar: 'humanities', sci: 'basicsci', talent: 'media',
  顶级学者: 'humanities', 学者: 'humanities', 人文社科: 'humanities', 文史哲: 'humanities',
  社科经管: 'socialsci', 经管法教: 'socialsci',
  艺术类: 'art', 艺术: 'art',
  自然科学: 'basicsci', 理学: 'basicsci', 基础科学: 'basicsci',
  工程技术: 'engineering', 工科: 'engineering',
  医学健康: 'health', 医学: 'health',
  文化人才: 'media', 知识传播: 'media', 传媒: 'media',
  宗教界人士: 'religion', 宗教界: 'religion', 宗教: 'religion',
};

/** 子类键：优先 id 前缀，其次显式字段，再按行形态推断；排除高等教育/商业误入 */
export function normalizeCulturalEliteCategory(r) {
  if (!r || r.sector === '商业' || r.sector === '高等教育' || (r.id || '').startsWith('be-') || (r.id || '').startsWith('he-')) return null;
  const id = r.id || '';
  if (id.startsWith('ce-u-')) return null;
  if (id.startsWith('ce-a-')) return 'art';
  if (id.startsWith('ce-t-')) return 'media';
  if (id.startsWith('ce-h-')) return 'humanities';
  if (id.startsWith('ce-ss-')) return 'socialsci';
  if (id.startsWith('ce-bs-')) return 'basicsci';
  if (id.startsWith('ce-en-')) return 'engineering';
  if (id.startsWith('ce-md-')) return 'health';
  if (id.startsWith('ce-r-')) return 'religion';
  if (id.startsWith('ce-s-')) return classifyScholarField(r.field || r.discipline);
  if (id.startsWith('ce-sci-')) return classifySciField(r.field || r.discipline, r.institution);
  if (id.startsWith('ac-cas-') || id.startsWith('ac-both-')) {
    return classifySciField(r.field || r.discipline, r.institution, r.academy || 'cas');
  }
  if (id.startsWith('ac-cae-')) {
    return classifySciField(r.field || r.discipline, r.institution, 'cae');
  }
  if (r.subCategory && CE_CAT_ALIASES[r.subCategory]) return CE_CAT_ALIASES[r.subCategory];
  const raw = r.subCategory || r.category;
  if (raw === 'university') return null;
  if (raw && CE_CAT_ALIASES[raw]) return CE_CAT_ALIASES[raw];
  if (raw && CE_SUB_CATS.includes(raw)) return raw;
  if (r.decade) return 'humanities';
  if (r.works || r.institution) return 'media';
  return null;
}

export function resolveCeTabKey(key) {
  if (!key) return 'humanities';
  return CE_TAB_LEGACY_ALIASES[key] || (CE_SUB_CATS.includes(key) ? key : 'humanities');
}
