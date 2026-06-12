import { AVATAR_OVERRIDES_BY_ID, AVATAR_OVERRIDES_BY_NAME } from '../db/avatarOverrides.js';
import { prefetchFigureAvatarBatch } from './figureAvatar.js';

/**
 * 从人才记录合并头像解析元数据（种子字段 + 离线覆盖表）
 * @param {object} [record]
 * @returns {{ name: string, nameEn?: string, wikiTitle?: string, wikiLang?: string, avatarUrl?: string, verifyTier?: string, source?: string, id?: string }}
 */
export function figureAvatarProps(record) {
  if (!record) return { name: '?' };
  const name = record.name || '';
  const id = record.id || '';
  const ov = (id && AVATAR_OVERRIDES_BY_ID[id]) || AVATAR_OVERRIDES_BY_NAME[name] || {};
  return {
    id,
    name,
    nameEn: record.nameEn || ov.nameEn || '',
    wikiTitle: ov.wikiTitle || record.wikiTitle || '',
    wikiLang: ov.wikiLang || record.wikiLang || '',
    avatarUrl: record.fields?.avatarUrl || record.avatarUrl || ov.avatarUrl || '',
    verifyTier: ov.verifyTier || record.verifyTier || '',
    source: ov.source || record.source || '',
  };
}

/** @param {object[]} records @param {number} [limit] */
export function prefetchFigureAvatars(records, limit = 48) {
  if (!records?.length) return;
  try {
    prefetchFigureAvatarBatch(records.slice(0, limit).map(figureAvatarProps));
  } catch { /* offline */ }
}
