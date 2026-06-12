import React, { useState } from 'react';
import { verifyBadgeText, verifyTierColor } from '../../lib/talent/metadata.jsx';

const labelStyle = { color: 'var(--text-tertiary)' };
const valueStyle = { color: 'var(--text-secondary)' };

/** 分组标题 */
export function DetailSection({ title, children, className = '' }) {
  if (!children) return null;
  return (
    <div className={className}>
      <div className="text-[10px] mono mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{title}</div>
      {children}
    </div>
  );
}

/** 多列键值网格 — fields: { label, value, accent?, span? }[] */
export function DetailFieldGrid({ fields, cols = 2 }) {
  const items = (fields || []).filter((f) => f.value != null && f.value !== '' && f.value !== '—');
  if (!items.length) return null;
  const colTpl = cols === 1
    ? 'minmax(0, 1fr)'
    : cols === 3
      ? 'repeat(3, minmax(0, 1fr))'
      : 'repeat(2, minmax(0, 1fr))';
  return (
    <div
      className="gap-x-3 gap-y-2 talent-detail-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: colTpl,
      }}
    >
      {items.map((f) => (
        <div
          key={f.label}
          className={f.span === 2 ? 'col-span-full' : f.span === 3 ? 'col-span-full' : 'min-w-0'}
          style={f.span === 3 ? { gridColumn: '1 / -1' } : f.span === 2 ? { gridColumn: '1 / -1' } : undefined}
        >
          <div className="text-[10px] truncate" style={labelStyle}>{f.label}</div>
          <div className="text-xs leading-snug break-words" style={{ color: f.accent || valueStyle.color }}>{f.value}</div>
        </div>
      ))}
    </div>
  );
}

/** 内联标签 chips */
export function DetailTags({ tags, accent = '#d4af37' }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${accent}1f`, color: accent }}>{t}</span>
      ))}
    </div>
  );
}

/** 详情正文 — 与 ExpandableText 同基线，主题感知 */
export function DetailBodyText({ children }) {
  if (children == null || children === '') return null;
  return (
    <p className="text-xs leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </p>
  );
}

/** 可折叠长文本 */
export function ExpandableText({ text, maxLen = 140, accent }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  const long = text.length > maxLen;
  const shown = long && !open ? `${text.slice(0, maxLen)}…` : text;
  return (
    <div>
      <p className="text-xs leading-relaxed" style={{ color: accent || 'var(--text-secondary)' }}>{shown}</p>
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-[10px] mono mt-1" style={{ color: 'var(--cyber-cyan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {open ? '收起' : '展开全文'}
        </button>
      )}
    </div>
  );
}

/** 履历/时间线 */
export function DetailTimeline({ items, accent = 'var(--cyber-cyan)', expandable = false, preview = 6 }) {
  if (!items?.length) return null;
  const [open, setOpen] = useState(false);
  const long = expandable && items.length > preview;
  const shown = long && !open ? items.slice(0, preview) : items;
  return (
    <div className="space-y-1.5">
      {shown.map((c, i) => (
        <div key={i} className="flex gap-2" style={{ position: 'relative' }}>
          <span className="text-[10px] mono shrink-0 text-right pt-px" style={{ width: 72, color: accent }}>
            {c.from}{c.to ? `–${c.to}` : '–今'}
          </span>
          <span className="shrink-0" style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 5, background: c.to ? 'var(--text-tertiary)' : 'var(--china-red)' }} />
          <span className="text-[11px] flex-1 leading-snug" style={{ color: 'var(--text-secondary)' }}>{c.desc}</span>
        </div>
      ))}
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {open ? '收起时间线' : `展开全部 ${items.length} 条`}
        </button>
      )}
    </div>
  );
}

/**
 * 高密度详情面板
 * @param {{ name, subtitle?, avatar?, badges?, sections?, tags?, timeline?, footer?, queueNote?, accent?, crossLinks?, institutionCard?, verifyRecord?, timelineExpandable? }} props
 */
export default function TalentDetailPanel({
  name,
  subtitle,
  avatar,
  badges,
  sections = [],
  tags,
  tagAccent,
  timeline,
  timelineAccent,
  timelineExpandable = false,
  footer,
  queueNote,
  crossLinks,
  institutionCard,
  verifyRecord,
}) {
  const verifyText = verifyBadgeText(verifyRecord);
  const verifyColor = verifyTierColor(verifyRecord?.verifyTier);

  return (
    <div className="os-detail-pane space-y-3 p-1">
      <div className="flex items-start gap-2.5 pb-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {avatar}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</span>
            {badges}
            {verifyText && (
              <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${verifyColor}18`, color: verifyColor }}>
                {verifyText}
              </span>
            )}
          </div>
          {subtitle && <div className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>{subtitle}</div>}
          {tags?.length > 0 && <div className="mt-1.5"><DetailTags tags={tags} accent={tagAccent} /></div>}
          {crossLinks}
        </div>
      </div>

      {institutionCard && (
        <DetailSection title="机构载体">
          {institutionCard}
        </DetailSection>
      )}

      {sections.map((sec) => (
        sec.fields?.length ? (
          <DetailSection key={sec.title} title={sec.title}>
            <DetailFieldGrid fields={sec.fields} cols={sec.cols || 2} />
          </DetailSection>
        ) : sec.bioText ? (
          <DetailSection key={sec.title} title={sec.title}>
            <ExpandableText text={sec.bioText} maxLen={180} accent="var(--cyber-cyan)" />
          </DetailSection>
        ) : sec.content ? (
          <DetailSection key={sec.title} title={sec.title}>
            {typeof sec.content === 'string' ? <DetailBodyText>{sec.content}</DetailBodyText> : sec.content}
          </DetailSection>
        ) : null
      ))}

      {timeline?.length > 0 && (
        <DetailSection title={`公开履历 · ${timeline.length} 条`}>
          <DetailTimeline items={timeline} accent={timelineAccent} expandable={timelineExpandable} />
        </DetailSection>
      )}

      {queueNote && (
        <p className="text-[10px] mono leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{queueNote}</p>
      )}

      {footer && (
        <div className="pt-2 text-[10px] flex flex-wrap gap-x-3 gap-y-0.5" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
