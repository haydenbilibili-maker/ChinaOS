// ============================================================================
// 自媒体人队列 · 分类与平台维度
// ============================================================================

export const SM_SUB_CATS = [
  'politics', 'finance', 'tech', 'culture', 'history',
  'military', 'international', 'lifestyle', 'entertainment',
];

export const SM_TAB_LABEL = {
  politics: '时政评论',
  finance: '财经',
  tech: '科技',
  culture: '文化',
  history: '历史',
  military: '军事',
  international: '国际',
  lifestyle: '生活',
  entertainment: '娱乐',
};

export const SM_CAT_ALIASES = {
  politics: 'politics', finance: 'finance', tech: 'tech', culture: 'culture',
  history: 'history', military: 'military', international: 'international',
  lifestyle: 'lifestyle', entertainment: 'entertainment',
  时政: 'politics', 时政评论: 'politics', 财经: 'finance', 科技: 'tech',
  文化: 'culture', 历史: 'history', 军事: 'military', 国际: 'international',
  生活: 'lifestyle', 娱乐: 'entertainment',
};

export const SM_PLATFORMS = ['weibo', 'bilibili', 'douyin', 'wechat', 'youtube', 'podcast', 'multi'];

export const SM_PLATFORM_LABEL = {
  weibo: '微博',
  bilibili: 'B站',
  douyin: '抖音',
  wechat: '微信公众号',
  youtube: 'YouTube',
  podcast: '播客',
  multi: '多平台',
};

export const SM_TIER_LABEL = { S: '顶流', A: '头部', B: '中腰部', C: '垂直' };

export function normalizeSelfMediaCategory(r) {
  if (!r?.name) return null;
  const raw = r.category || r.niche;
  if (raw && SM_CAT_ALIASES[raw]) return SM_CAT_ALIASES[raw];
  if (raw && SM_SUB_CATS.includes(raw)) return raw;
  return null;
}

export function normalizePlatformKey(r) {
  const raw = r.platformKey || r.platform;
  if (!raw) return 'multi';
  const k = String(raw).toLowerCase();
  if (SM_PLATFORMS.includes(k)) return k;
  const alias = {
    微博: 'weibo', b站: 'bilibili', bilibili: 'bilibili', 抖音: 'douyin',
    微信: 'wechat', 公众号: 'wechat', youtube: 'youtube', 播客: 'podcast',
    多平台: 'multi', 小红书: 'multi',
  };
  return alias[raw] || alias[k] || 'multi';
}

export function enrichSelfMediaRow(row) {
  const category = normalizeSelfMediaCategory(row);
  const platformKey = normalizePlatformKey(row);
  return {
    ...row,
    category,
    platformKey,
    platform: row.platform || SM_PLATFORM_LABEL[platformKey] || platformKey,
    niche: row.niche || SM_TAB_LABEL[category] || category,
  };
}
