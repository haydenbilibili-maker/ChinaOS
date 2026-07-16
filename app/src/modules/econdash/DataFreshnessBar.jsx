import React, { useEffect, useState } from 'react';
import { ECON_DATA_AS_OF } from './econData.js';
import {
  assessFreshness,
  formatCstParts,
  STALE_THRESHOLD_DAYS,
} from '../../lib/time/dataFreshness.js';

// ============================================================================
// 经济大盘 · 数据时效条（紧凑单行：截至日 · 北京钟 · 陈旧态）
// ----------------------------------------------------------------------------

const LEVEL_META = {
  fresh: {
    dot: 'var(--status-positive)',
    text: 'var(--status-positive)',
    tag: '最新',
  },
  aging: {
    dot: 'var(--status-caution)',
    text: 'var(--status-caution)',
    tag: '临近窗口',
  },
  stale: {
    dot: 'var(--status-negative)',
    text: 'var(--status-negative)',
    tag: '可能过期',
  },
  unknown: {
    dot: 'var(--text-tertiary)',
    text: 'var(--text-tertiary)',
    tag: '时效未知',
  },
};

/**
 * 数据时效条（紧凑版）。
 * @param {{ dataAsOf?: string, className?: string, compact?: boolean }} props
 */
export default function DataFreshnessBar({ dataAsOf = ECON_DATA_AS_OF, className = '', compact = true }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = formatCstParts(now);
  const fresh = assessFreshness(dataAsOf, now, STALE_THRESHOLD_DAYS);
  const meta = LEVEL_META[fresh.level] || LEVEL_META.unknown;
  const ageText = Number.isNaN(fresh.ageDaysWhole) ? '—' : `${fresh.ageDaysWhole}d`;

  return (
    <section
      className={`econ-freshness ${compact ? 'econ-freshness--compact' : ''} ${fresh.isStale ? 'is-stale' : ''} ${className}`}
      aria-label="经济大盘数据时效"
    >
      <div className="econ-freshness__row">
        <div className="econ-freshness__cell">
          <span className="econ-freshness__k mono">截至</span>
          <span className="econ-freshness__v mono os-mono-tabular">{dataAsOf}</span>
        </div>

        <span className="econ-freshness__sep" aria-hidden="true" />

        <div className="econ-freshness__cell">
          <span className="econ-freshness__k mono">北京</span>
          <span className="econ-freshness__v mono os-mono-tabular">
            <time dateTime={now.toISOString()} aria-live="off">{clock.full}</time>
          </span>
        </div>

        <span className="econ-freshness__sep" aria-hidden="true" />

        <div className="econ-freshness__cell econ-freshness__cell--verdict">
          <span className="econ-freshness__badge mono" style={{ color: meta.text }}>
            <span className="econ-freshness__badge-dot" style={{ background: meta.dot }} aria-hidden="true" />
            {meta.tag}
            <span className="econ-freshness__age mono" aria-label={`数据年龄 ${ageText}`}>· {ageText}</span>
          </span>
        </div>
      </div>

      {fresh.isStale && (
        <p className="econ-freshness__alert" role="status" aria-live="polite">
          <span aria-hidden="true">⚠</span>
          数据可能已过期，建议更新经济大盘数据——{fresh.label}
        </p>
      )}
    </section>
  );
}
