// 中国政要 · 共享构造器
export const AS_OF = '2026-06-11';

/** @typedef {'official'|'media'|'academic'|'inferred'} VerifyTier */
/** @typedef {'high'|'medium'|'low'} Confidence */

/**
 * 可选溯源字段（向后兼容）：
 * asOf, source/sources[], verifiedAt, verifyTier, provenance,
 * lastPublicActivity, confidence, publicRecordNote, keyEvents[], tags, crossRefs[]
 */

/** @param {object} o */
export function fig(o) {
  const sources = o.sources || (o.source ? [o.source] : undefined);
  return {
    kind: '公开',
    asOf: o.asOf || AS_OF,
    verifyTier: o.verifyTier || 'official',
    verifiedAt: o.verifiedAt || AS_OF,
    confidence: o.confidence || 'high',
    fields: { ethnic: '汉族', ...o.fields },
    career: o.career || o.keyEvents || [],
    keyEvents: o.keyEvents || o.career || [],
    ...(sources ? { sources, source: o.source || sources[0] } : {}),
    ...o,
  };
}

/** 非政要队列记录增密包装 */
export function withProvenance(o, defaults = {}) {
  const sources = o.sources || (o.source ? [o.source] : undefined);
  return {
    asOf: AS_OF,
    verifyTier: 'media',
    verifiedAt: AS_OF,
    confidence: 'medium',
    ...defaults,
    ...o,
    ...(sources ? { sources, source: o.source || sources[0] } : {}),
  };
}
