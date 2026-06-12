// ============================================================================
// 人才详情 · 共享 section 构建器
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  buildProvenanceSection,
  buildNetworkSection,
  buildCrossRefLinks,
  eventsToTimeline,
  pickPublicBio,
  normalizeTags,
} from './metadata.jsx';

/**
 * 组装高密度详情 sections
 * @param {object} record
 * @param {object} opts
 */
export function buildTalentDetailSections(record, opts = {}) {
  const {
    baseSections = [],
    includeProvenance = true,
    includeNetwork = true,
    includeBio = true,
    bioLabel = '公开履历要点',
  } = opts;

  const sections = [...baseSections];

  if (includeBio) {
    const bio = pickPublicBio(record);
    if (bio) {
      sections.push({ title: bioLabel, bioText: bio });
    }
  }

  if (includeProvenance) {
    const prov = buildProvenanceSection(record);
    if (prov) sections.push(prov);
  }

  if (includeNetwork) {
    const net = buildNetworkSection(record, opts);
    if (net) sections.push(net);
  }

  return sections;
}

/** 关联模块链接行 */
export function CrossRefLinks({ record, queue }) {
  const links = buildCrossRefLinks(record, { queue });
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {links.map((l) => (
        <Link
          key={l.path}
          to={l.path}
          className="text-[9px] mono px-1.5 py-0.5 rounded"
          style={{ background: `${l.accent}18`, color: l.accent, textDecoration: 'none' }}
        >
          {l.label} →
        </Link>
      ))}
    </div>
  );
}

/** 机构卡片（高校/智库/院所） */
export function InstitutionCard({ record }) {
  const name = record?.institution || record?.org || record?.affiliation;
  if (!name) return null;
  const sub = [record?.type, record?.tier, record?.field || record?.discipline].filter(Boolean).join(' · ');
  return (
    <div className="rounded p-2.5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>}
      {record?.focusAreas && <div className="text-[10px] mt-1 leading-snug" style={{ color: 'var(--text-secondary)' }}>{record.focusAreas}</div>}
    </div>
  );
}

export { eventsToTimeline, normalizeTags, pickPublicBio };
