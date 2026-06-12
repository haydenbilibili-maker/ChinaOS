// ============================================================================
// 文档原文解析 · 法律条文 / 政策文件
// Tier A: 结构化 fullText / chapters（条文原文）
// Tier B: 扩展 body（要点汇编 · 非官方全文）
// Tier C: 由 highlights / keyArticles 拼接的可读 fallback
// ============================================================================

import { LEGAL_BODIES, POLICY_BODIES } from './documentBodies.js';
import { CORPUS_TIER_LABELS, CORPUS_DISCLAIMER } from './legalCorpus.js';
import { POLICY_CORPUS_TIER_LABELS, POLICY_CORPUS_DISCLAIMER } from './policyCorpus.js';

export const TIER_LABELS = {
  corpus: '本地原文库',
  full: '条文原文',
  extended: '要点汇编 · 非官方全文',
  fallback: '要点汇编 · 非官方全文',
};

export const TIER_BADGE_STYLE = {
  corpus: { bg: 'rgba(16,185,129,0.18)', color: '#34d399', border: 'rgba(16,185,129,0.45)' },
  corpusExcerpt: { bg: 'rgba(232,163,23,0.14)', color: '#e8a317', border: 'rgba(232,163,23,0.4)' },
  corpusStub: { bg: 'rgba(249,115,22,0.14)', color: '#f97316', border: 'rgba(249,115,22,0.4)' },
  full: { bg: 'rgba(16,185,129,0.14)', color: '#10b981', border: 'rgba(16,185,129,0.35)' },
  extended: { bg: 'rgba(232,163,23,0.12)', color: '#e8a317', border: 'rgba(232,163,23,0.35)' },
  fallback: { bg: 'rgba(100,116,139,0.14)', color: '#94a3b8', border: 'rgba(100,116,139,0.35)' },
};

/** @param {'full'|'excerpt'|'extended'|'stub'|null|undefined} corpusTier */
export function corpusTierBadgeStyle(corpusTier) {
  if (corpusTier === 'full') return TIER_BADGE_STYLE.corpus;
  if (corpusTier === 'stub') return TIER_BADGE_STYLE.corpusStub;
  if (corpusTier === 'excerpt' || corpusTier === 'extended') return TIER_BADGE_STYLE.corpusExcerpt;
  return TIER_BADGE_STYLE.corpus;
}

const FALLBACK_DISCLAIMER =
  '本阅读器所载内容为结构化摘要、要点汇编或节选章节，不构成官方法律/政策正式文本；引用、执法与合规请以国家法律法规数据库及官方发布渠道为准。';

function joinBlocks(parts) {
  return parts.filter(Boolean).join('\n\n');
}

function fallbackFromLegal(record) {
  const parts = [];
  if (record.summary) parts.push(`## 规范概述\n\n${record.summary}`);
  if (record.keyArticles?.length) {
    parts.push('## 核心条款 / 要点\n\n' + record.keyArticles.map((a, i) => `${i + 1}. ${a}`).join('\n'));
  }
  return joinBlocks(parts);
}

function fallbackFromPolicy(record) {
  const parts = [];
  if (record.stance?.fiscal || record.stance?.monetary) {
    parts.push(`## 政策定调\n\n财政：${record.stance.fiscal || '—'}\n货币：${record.stance.monetary || '—'}`);
  }
  if (record.tasks?.length) {
    parts.push('## 重点任务\n\n' + record.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n'));
  }
  if (record.highlights?.length) {
    parts.push('## 要点\n\n' + record.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n'));
  }
  if (record.keywords?.length) {
    parts.push('## 关键提法\n\n' + record.keywords.map((k) => `- ${k}`).join('\n'));
  }
  return joinBlocks(parts);
}

/**
 * 本地原文库优先；corpusBody 由 DocumentViewer 异步 fetch 后注入
 * @param {object} record
 * @param {{ corpusTier?: 'full'|'excerpt', corpusFile?: string } | null} [corpusEntry]
 * @param {string | null} [corpusBody]
 */
export function resolveLegalDocument(record, corpusEntry = null, corpusBody = null) {
  if (!record) return null;
  const extra = LEGAL_BODIES[record.id];

  if (corpusBody && corpusEntry?.corpusFile) {
    const sub = CORPUS_TIER_LABELS[corpusEntry.corpusTier] || CORPUS_TIER_LABELS.full;
    return {
      tier: 'corpus',
      label: sub,
      corpusTier: corpusEntry.corpusTier || 'full',
      body: corpusBody,
      attachments: record.keyArticles,
      sourceUrl: extra?.sourceUrl,
      corpusFile: corpusEntry.corpusFile,
      disclaimer: CORPUS_DISCLAIMER,
    };
  }

  if (extra?.chapters?.length) {
    return {
      tier: extra.bodyTier || 'full',
      label: TIER_LABELS[extra.bodyTier || 'full'],
      chapters: extra.chapters,
      body: extra.body,
      attachments: extra.attachments || record.keyArticles,
      sourceUrl: extra.sourceUrl,
      disclaimer: FALLBACK_DISCLAIMER,
    };
  }
  if (extra?.body) {
    return {
      tier: extra.bodyTier || 'extended',
      label: TIER_LABELS[extra.bodyTier || 'extended'],
      body: extra.body,
      attachments: extra.attachments || record.keyArticles,
      sourceUrl: extra.sourceUrl,
      disclaimer: FALLBACK_DISCLAIMER,
    };
  }
  return {
    tier: 'fallback',
    label: TIER_LABELS.fallback,
    body: fallbackFromLegal(record),
    attachments: record.keyArticles,
    sourceUrl: extra?.sourceUrl,
    disclaimer: FALLBACK_DISCLAIMER,
  };
}

/** @returns {{ tier: string, label: string, body?: string, attachments?: string[], sourceUrl?: string, disclaimer: string, chapters?: object[], corpusFile?: string }} */
export function resolvePolicyDocument(record, corpusEntry = null, corpusBody = null) {
  if (!record) return null;
  const extra = POLICY_BODIES[record.id];

  if (corpusBody && corpusEntry?.corpusFile) {
    const sub = POLICY_CORPUS_TIER_LABELS[corpusEntry.corpusTier] || POLICY_CORPUS_TIER_LABELS.full;
    return {
      tier: 'corpus',
      label: sub,
      corpusTier: corpusEntry.corpusTier || 'full',
      body: corpusBody,
      attachments: extra?.attachments || record.highlights,
      sourceUrl: extra?.sourceUrl,
      corpusFile: corpusEntry.corpusFile,
      disclaimer: POLICY_CORPUS_DISCLAIMER,
    };
  }

  if (extra?.body) {
    return {
      tier: extra.bodyTier || 'extended',
      label: TIER_LABELS[extra.bodyTier || 'extended'],
      body: extra.body,
      attachments: extra.attachments || record.highlights,
      sourceUrl: extra.sourceUrl,
      disclaimer: FALLBACK_DISCLAIMER,
    };
  }
  return {
    tier: 'fallback',
    label: TIER_LABELS.fallback,
    body: fallbackFromPolicy(record),
    attachments: record.highlights,
    sourceUrl: extra?.sourceUrl,
    disclaimer: FALLBACK_DISCLAIMER,
  };
}

export function resolveDocument(record, kind, corpusEntry = null, corpusBody = null) {
  return kind === 'legal'
    ? resolveLegalDocument(record, corpusEntry, corpusBody)
    : resolvePolicyDocument(record, corpusEntry, corpusBody);
}

export function hasEmbeddedBody(record, kind) {
  if (!record?.id) return false;
  if (kind === 'legal') return Boolean(LEGAL_BODIES[record.id]);
  return Boolean(POLICY_BODIES[record.id]);
}

/** @deprecated use hasEmbeddedBody or hasLocalCorpus */
export function hasExtendedBody(record, kind) {
  return hasEmbeddedBody(record, kind);
}

export function countBodiesWithTier() {
  const legalFull = Object.values(LEGAL_BODIES).filter((b) => (b.bodyTier || 'full') === 'full' || b.chapters?.length).length;
  const legalExtended = Object.values(LEGAL_BODIES).filter((b) => b.bodyTier === 'extended' && !b.chapters?.length).length;
  const policyExtended = Object.values(POLICY_BODIES).filter((b) => b.body).length;
  return {
    legal: { full: legalFull, extended: legalExtended, total: Object.keys(LEGAL_BODIES).length },
    policy: { extended: policyExtended, total: Object.keys(POLICY_BODIES).length },
  };
}
