import React from 'react';
import { resolveAcademy, academyBadgeLabel, academyTooltip } from '../db/academicianCommon.js';

/**
 * 两院院士专属标记
 * @param {object} props
 * @param {object} props.record — 含 academy / academyCas / academyCae 或 title 中含院士
 * @param {'sm' | 'md'} [props.size='sm']
 * @param {boolean} [props.compact]
 */
export default function AcademicianBadge({ record, size = 'sm', compact = false }) {
  const academy = resolveAcademy(record);
  const label = academyBadgeLabel(academy);
  if (!label) return null;
  const tip = academyTooltip(record);
  const fontSize = size === 'md' ? 10 : 8;
  const pad = size === 'md' ? '2px 6px' : '1px 4px';
  const display = compact && academy === 'both' ? '两院' : compact && academy === 'cas' ? 'CAS' : compact && academy === 'cae' ? 'CAE' : label;

  return (
    <span
      className="academy-badge mono rounded shrink-0"
      data-kind={academy}
      title={tip}
      style={{
        fontSize,
        padding: pad,
        border: '1px solid',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {display}
    </span>
  );
}
