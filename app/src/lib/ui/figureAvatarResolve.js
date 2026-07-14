import { AVATAR_OVERRIDES_BY_ID, AVATAR_OVERRIDES_BY_NAME } from '../db/avatarOverrides.js';
import { prefetchFigureAvatarBatch } from './figureAvatar.js';

/**
 * 从人才记录合并头像解析元数据（种子字段 + 离线覆盖表）
 * @param {object} [record]
 * @returns {{ name: string, nameEn?: string, wikiTitle?: string, wikiLang?: string, avatarUrl?: string, verifyTier?: string, source?: string, id?: string }}
 */
/**
 * 仅当覆盖表条目允许安全回退到「按姓名」时采用 BY_NAME。
 * 同名多人（如「李强」）禁止用姓名覆盖，避免错脸。
 */
function safeNameOverride(name, idOverride) {
  if (idOverride) return null;
  const ov = AVATAR_OVERRIDES_BY_NAME[name];
  if (!ov) return null;
  // 姓名覆盖仅在 curated / 已核验肖像时启用；zh-default 不得按名拉网
  if (ov.verifyTier === 'verified_portrait' || ov.source === 'curated') return ov;
  return null;
}

export function figureAvatarProps(record) {
  if (!record) return { name: '?' };
  const name = record.name || '';
  const id = record.id || '';
  const ovById = (id && AVATAR_OVERRIDES_BY_ID[id]) || null;
  const ov = ovById || safeNameOverride(name, ovById) || {};
  // 肖像核验字段与履历 verifyTier（official/media）分离：覆盖表优先
  const portraitTier = ov.verifyTier || record.portraitVerifyTier || '';
  const portraitSource = ov.source || record.portraitSource || '';
  return {
    id,
    name,
    nameEn: record.nameEn || ov.nameEn || '',
    wikiTitle: ov.wikiTitle || record.wikiTitle || '',
    wikiLang: ov.wikiLang || record.wikiLang || '',
    avatarUrl: record.fields?.avatarUrl || record.avatarUrl || ov.avatarUrl || '',
    verifyTier: portraitTier,
    source: portraitSource === 'curated' || portraitTier === 'verified_portrait'
      ? (portraitSource || 'curated')
      : portraitSource,
  };
}

/** @param {object[]} records @param {number} [limit] */
export function prefetchFigureAvatars(records, limit = 48) {
  if (!records?.length) return;
  try {
    prefetchFigureAvatarBatch(records.slice(0, limit).map(figureAvatarProps));
  } catch { /* offline */ }
}
