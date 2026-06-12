// ============================================================================
// 自媒体队列 · 从知识精英等队列迁出的条目转换
// ============================================================================
import { CULTURAL_ELITE_2026 } from './figureCulturalElite2026.js';
import { CULTURAL_ELITE_EXPANSION } from './talentBulkExpansion2026.js';
import { isSelfMediaPrimary, normalizeSelfMediaName } from './selfMediaPrimary.js';
import { enrichSelfMediaRow } from './smCategory.js';

const PLATFORM_GUESS = [
  [/B站|bilibili/i, 'bilibili'],
  [/抖音|douyin/i, 'douyin'],
  [/微博|weibo/i, 'weibo'],
  [/微信|公众号|wechat/i, 'wechat'],
  [/YouTube|youtube/i, 'youtube'],
  [/播客|podcast/i, 'podcast'],
];

function guessPlatformKey(text) {
  const hay = text || '';
  for (const [re, key] of PLATFORM_GUESS) {
    if (re.test(hay)) return key;
  }
  return 'multi';
}

function nicheFromField(field, institution) {
  const hay = `${field || ''} ${institution || ''}`;
  if (/财经|商业|资本|投资|宏观/.test(hay)) return '财经';
  if (/科技|数码|科普|物理|AI|计算机/.test(hay)) return '科技';
  if (/历史|考古|唐史|明史/.test(hay)) return '历史';
  if (/军事|国防|军武/.test(hay)) return '军事';
  if (/国际|外交|两岸/.test(hay)) return '国际';
  if (/生活|美食|田园|直播|带货/.test(hay)) return '生活';
  if (/娱乐|脱口秀|搞笑|游戏|音乐/.test(hay)) return '娱乐';
  if (/时政|评论|调查|传媒/.test(hay)) return '时政评论';
  return field || institution || '文化';
}

function categoryFromNiche(niche) {
  const n = niche || '';
  if (/时政|调查|评论/.test(n)) return 'politics';
  if (/财经|商业|投资|宏观/.test(n)) return 'finance';
  if (/科技|数码|科普|考研|教育/.test(n)) return 'tech';
  if (/历史/.test(n)) return 'history';
  if (/军事/.test(n)) return 'military';
  if (/国际|两岸/.test(n)) return 'international';
  if (/生活|美食|田园|直播|带货|汽车/.test(n)) return 'lifestyle';
  if (/娱乐|脱口秀|搞笑|游戏|音乐|明星/.test(n)) return 'entertainment';
  return 'culture';
}

function tierFromWorks(works, institution) {
  const hay = `${works || ''} ${institution || ''}`;
  if (/千万|亿|顶流|跨年|B站1000万|抖音1亿/.test(hay)) return 'S';
  if (/百万|得到|樊登|罗辑|十三邀|东方甄选/.test(hay)) return 'A';
  return 'B';
}

/** 将知识精英 media 类记录转为自媒体格式 */
export function convertCulturalEliteToSelfMedia(row) {
  if (!row?.name) return null;
  const platformKey = guessPlatformKey(`${row.institution || ''} ${row.works || ''} ${row.source || ''}`);
  const niche = nicheFromField(row.field || row.discipline, row.institution);
  const category = row.category === 'media' ? categoryFromNiche(niche) : categoryFromNiche(niche);
  const id = row.id?.startsWith('ce-')
    ? row.id.replace(/^ce-/, 'sm-mg-').replace(/^ce-x-/, 'sm-mg-')
    : `sm-mg-${normalizeSelfMediaName(row.name)}`;
  return enrichSelfMediaRow({
    id,
    name: row.name,
    platformKey,
    niche,
    category,
    followers: row.rankNotes || '公开报道',
    bio: row.bio || row.works || `${row.institution || ''} ${row.title || ''}`.trim(),
    keyWorks: row.works || row.strengths || '',
    controversies: row.notes?.includes('争议') ? row.notes : (row.notes === '—' ? '' : row.notes || ''),
    tier: tierFromWorks(row.works, row.institution),
    asOf: row.asOf,
    source: row.source || '公开报道',
    notes: `自知识精英队列迁出；原机构：${row.institution || '—'}`,
    migratedFrom: 'knowledge',
    crossRefs: `knowledge:${row.id || row.name}`,
    selfMediaPrimary: true,
  });
}

/** 从知识精英种子提取应迁出的自媒体主身份条目 */
export function buildMigratedSelfMediaRows() {
  const pool = [...CULTURAL_ELITE_2026, ...CULTURAL_ELITE_EXPANSION];
  const out = [];
  const seen = new Set();
  for (const row of pool) {
    if (!isSelfMediaPrimary(row.name)) continue;
    const n = normalizeSelfMediaName(row.name);
    if (seen.has(n)) continue;
    seen.add(n);
    const converted = convertCulturalEliteToSelfMedia(row);
    if (converted) out.push(converted);
  }
  return out;
}

export const MIGRATED_SELF_MEDIA_COUNT = buildMigratedSelfMediaRows().length;
