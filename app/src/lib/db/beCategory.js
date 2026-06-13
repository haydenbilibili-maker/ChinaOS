// ============================================================================
// 商业精英 · 角色 / 行业维度分类（种子生成 / 运行时归一化 共用）
// ============================================================================

/** 角色维度 */
export const BE_ROLE_CATS = ['founder', 'controller', 'executive', 'investor', 'industry_leader'];

/** 旧 URL ?be= 键 → 角色键（向后兼容） */
export const BE_ROLE_LEGACY_ALIASES = {
  ceo: 'executive',
  创始人: 'founder',
  实控人: 'controller',
  高管: 'executive',
  投资人: 'investor',
  行业领袖: 'industry_leader',
};

export const BE_ROLE_LABEL = {
  founder: '创始人',
  controller: '实控人',
  executive: 'CEO/高管',
  investor: '投资人',
  industry_leader: '行业领袖',
};

/** 行业维度（归一化 sectorKey） */
export const BE_SECTOR_CATS = ['tech', 'new_energy', 'manufacturing', 'consumer', 'finance', 'pharma', 'infra', 'other'];

export const BE_SECTOR_LABEL = {
  tech: '科技互联网',
  new_energy: '新能源',
  manufacturing: '制造硬科技',
  consumer: '消费零售',
  finance: '金融投资',
  pharma: '医药生物',
  infra: '物流基建',
  other: '综合其他',
};

/** 所有制维度（央企/国企 vs 民营） */
export const BE_OWNERSHIP_CATS = ['private', 'state_owned', 'mixed'];
export const BE_OWNERSHIP_LABEL = {
  private: '民营私营',
  state_owned: '央企国企',
  mixed: '混合所有制',
};

const TECH_KW = [
  '互联网', '人工智能', '软件', '网络安全', '教育科技', '无人机', '机器人', '通信',
  '科技', '消费电子', '打印', '传媒', '文化传媒', '游戏', '云计算', '大数据',
];
const NEW_ENERGY_KW = ['新能源', '新能源汽车', '汽车制造', '光伏', '电池', '电气', '锂电', '储能'];
const MFG_KW = [
  '制造业', '工程机械', '钢铁', '石化', '纺织', '电子制造', '工业自动化', '打印耗材',
  'PCB', '航空', '医疗器械', '半导体', '无人机', '化工', '农业机械', '家居', '打印',
  '工程机械', '炭素', '低压电器',
];
const CONSUMER_KW = ['消费品', '零售', '餐饮', '农业食品', '运动品牌', '家居', '纺织', '农业'];
const FINANCE_KW = ['金融', '投资', '保险', '银行', '证券'];
const PHARMA_KW = ['生物医药', '医疗服务', '医疗器械', '疫苗', '创新药', '眼科', '生命科技'];
const INFRA_KW = ['房地产', '物流', '基建', '港口', '快递', '航空', '铁路', '地产'];

/** 由 industry 字段推断 sectorKey */
export function classifyBusinessSector(industry = '') {
  const s = String(industry);
  if (TECH_KW.some((k) => s.includes(k))) return 'tech';
  if (NEW_ENERGY_KW.some((k) => s.includes(k))) return 'new_energy';
  if (PHARMA_KW.some((k) => s.includes(k))) return 'pharma';
  if (FINANCE_KW.some((k) => s.includes(k))) return 'finance';
  if (CONSUMER_KW.some((k) => s.includes(k))) return 'consumer';
  if (INFRA_KW.some((k) => s.includes(k))) return 'infra';
  if (MFG_KW.some((k) => s.includes(k))) return 'manufacturing';
  return 'other';
}

const BE_CAT_ALIASES = {
  founder: 'founder', controller: 'controller', executive: 'executive',
  investor: 'investor', industry_leader: 'industry_leader',
  ...BE_ROLE_LEGACY_ALIASES,
};

/** 角色键归一化 */
export function normalizeBusinessEliteCategory(r) {
  if (!r || r.sector === '文化' || (r.id || '').startsWith('ce-')) return null;
  const id = r.id || '';
  if (id.startsWith('be-')) {
    const raw = r.category;
    if (raw && BE_CAT_ALIASES[raw]) return BE_CAT_ALIASES[raw];
    if (raw && BE_ROLE_CATS.includes(raw)) return raw;
  }
  const raw = r.subCategory || r.category;
  if (raw && BE_CAT_ALIASES[raw]) return BE_CAT_ALIASES[raw];
  if (raw && BE_ROLE_CATS.includes(raw)) return raw;
  if (r.company && r.industry) return 'founder';
  return null;
}

export function resolveBeRoleKey(key) {
  if (!key) return 'founder';
  return BE_ROLE_LEGACY_ALIASES[key] || (BE_ROLE_CATS.includes(key) ? key : 'founder');
}

export function resolveBeSectorKey(key) {
  if (!key) return '';
  return BE_SECTOR_CATS.includes(key) ? key : '';
}

/** 运行时补全 sectorKey / enterpriseType */
export function enrichBusinessEliteRow(r) {
  if (!r) return r;
  const sectorKey = r.sectorKey || classifyBusinessSector(r.industry);
  const enterpriseType = r.enterpriseType
    || (/(央企|国有|国资|中石油|中石化|国家电网|中国移动|中国建筑|中铁|中车|中核|中广核)/.test(`${r.company || ''}${r.industry || ''}${r.honors || ''}`) ? 'state_owned' : 'private');
  return { ...r, sectorKey, enterpriseType };
}
