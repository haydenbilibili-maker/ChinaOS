// ============================================================================
// 人才库 · 时效溯源与详情格式化
// ============================================================================

import { AS_OF } from '../db/figureCommon.js';
import { buildTalentLink } from './routing.js';

export const VERIFY_TIER_LABEL = {
  official: '官方发布',
  media: '主流媒体',
  academic: '学术/机构',
  inferred: '公开推断',
};

export const CONFIDENCE_LABEL = {
  high: '高（多源交叉）',
  medium: '中（单源公开）',
  low: '低（存争议/待核）',
};

const TIER_COLOR = {
  official: '#10b981',
  media: '#22d3ee',
  academic: '#a78bfa',
  inferred: '#fb923c',
};

const CONF_COLOR = {
  high: '#10b981',
  medium: '#e8a317',
  low: '#c41e3a',
};

/** @param {string} [asOf] */
export function formatAsOf(recordOrDate) {
  const v = typeof recordOrDate === 'string' ? recordOrDate : recordOrDate?.asOf;
  return v || AS_OF;
}

/** @param {object} record */
export function formatSources(record) {
  if (!record) return '';
  const raw = record.sources ?? record.source;
  if (Array.isArray(raw)) return raw.filter(Boolean).join(' · ');
  return raw || '';
}

export function verifyTierLabel(tier) {
  return VERIFY_TIER_LABEL[tier] || tier || '';
}

export function verifyTierColor(tier) {
  return TIER_COLOR[tier] || 'var(--text-secondary)';
}

export function confidenceLabel(c) {
  return CONFIDENCE_LABEL[c] || c || '';
}

export function confidenceColor(c) {
  return CONF_COLOR[c] || 'var(--text-secondary)';
}

/** 核查层级 badge 文案 */
export function verifyBadgeText(record) {
  const tier = record?.verifyTier;
  if (!tier) return null;
  const label = verifyTierLabel(tier);
  const at = record.verifiedAt ? ` · ${record.verifiedAt}` : '';
  return `${label}${at}`;
}

/**
 * 时效与溯源字段网格
 * @param {object} record
 * @returns {{ label: string, value?: string, accent?: string, span?: number }[]}
 */
export function buildProvenanceFields(record) {
  if (!record) return [];
  const sources = formatSources(record);
  return [
    { label: '数据截至', value: formatAsOf(record) },
    { label: '核查日期', value: record.verifiedAt },
    { label: '核查层级', value: verifyTierLabel(record.verifyTier), accent: verifyTierColor(record.verifyTier) },
    { label: '可信度', value: confidenceLabel(record.confidence), accent: confidenceColor(record.confidence) },
    { label: '数据口径', value: record.provenance, span: 3 },
    { label: '最近公开活动', value: record.lastPublicActivity, span: 3 },
    { label: '公开来源', value: sources, span: 3 },
    { label: '公开记录备注', value: record.publicRecordNote, span: 3 },
  ];
}

/** @param {object} record */
export function hasProvenance(record) {
  return buildProvenanceFields(record).some((f) => f.value != null && f.value !== '');
}

/**
 * 详情分组：时效与溯源
 * @param {object} record
 */
export function buildProvenanceSection(record) {
  const fields = buildProvenanceFields(record);
  if (!fields.some((f) => f.value != null && f.value !== '')) return null;
  return { title: '时效与溯源', fields, cols: 3 };
}

/** 归一化 tags：字符串或数组 */
export function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return String(tags).split(/[,，、;；|]/).map((t) => t.trim()).filter(Boolean);
}

/**
 * 关联模块深链
 * @param {object} record
 * @param {{ queue?: string, policy?: boolean, legal?: boolean, sandbox?: boolean }} opts
 */
export function buildCrossRefLinks(record, opts = {}) {
  const links = [];
  const q = record?.name || '';
  const { queue, policy = true, legal = true, sandbox = true } = opts;

  if (policy) {
    links.push({ label: '政策文件', path: `/policydocs?q=${encodeURIComponent(q)}`, accent: '#d4af37' });
  }
  if (legal) {
    links.push({ label: '法律法规', path: `/policydocs?tab=legal&q=${encodeURIComponent(q)}`, accent: '#8b5cf6' });
  }
  if (sandbox && (queue === 'resume' || queue === 'figures')) {
    links.push({ label: '治国沙盒', path: '/sandbox', accent: '#c41e3a' });
  }
  if (queue === 'business') {
    links.push({ label: '民企500强', path: '/enterprise500', accent: '#e8a317' });
  }
  if (queue === 'knowledge' || queue === 'education') {
    links.push({ label: '科教人才', path: '/edu-sci-talent', accent: '#22d3ee' });
  }
  if (queue === 'anticorruption') {
    links.push({ label: '反腐透视', path: '/anticorruption', accent: '#c41e3a' });
  }
  if (record?.id && queue) {
    links.unshift({
      label: '人才深链',
      path: buildTalentLink({ tab: queue === 'figures' ? 'resume' : queue, id: record.id, q }),
      accent: 'var(--cyber-cyan)',
    });
  }
  return links;
}

/**
 * 关联网络分组（tags + cross-refs 摘要）
 * @param {object} record
 * @param {object} opts
 */
export function buildNetworkSection(record, opts = {}) {
  const tags = normalizeTags(record?.tags);
  const crossRefs = normalizeTags(record?.crossRefs);
  const related = [...new Set([...tags, ...crossRefs])];
  const fields = [
    { label: '标签', value: related.length ? related.join(' · ') : null, span: 3 },
    { label: '关联实体', value: record?.relatedEntities?.length ? record.relatedEntities.join(' · ') : null, span: 3 },
    { label: '备注', value: record?.notes, span: 3 },
  ];
  if (!fields.some((f) => f.value)) return null;
  return { title: '关联网络', fields, cols: 3 };
}

/**
 * keyEvents → timeline 格式
 * @param {object} record
 */
export function eventsToTimeline(record) {
  const ev = record?.keyEvents || record?.career;
  if (!ev?.length) return null;
  return ev.map((e) => (typeof e === 'object' && e.desc
    ? e
    : { from: e.from || e.year || '', to: e.to || '', desc: e.desc || e.event || String(e) }));
}

/**
 * 公开履历要点（bio / works / background）
 * @param {object} record
 */
export function pickPublicBio(record) {
  return record?.bio || record?.works || record?.background || record?.achievements || '';
}

/**
 * 合并详情 sections：去重空分组
 * @param {...(object|null|undefined)[]} sections
 */
export function mergeDetailSections(...sections) {
  return sections.filter(Boolean).filter((s) => s.fields?.length || s.content);
}

/**
 * 标准 footer 元组
 * @param {object} record
 */
export function buildDetailFooter(record) {
  const sources = formatSources(record);
  return (
    <>
      {sources && <span>来源：{sources}</span>}
      {record?.asOf && <span>截至：{formatAsOf(record)}</span>}
      {record?.verifyTier && <span>核查：{verifyTierLabel(record.verifyTier)}</span>}
      {record?.kind && <span>类型：{record.kind}</span>}
    </>
  );
}
