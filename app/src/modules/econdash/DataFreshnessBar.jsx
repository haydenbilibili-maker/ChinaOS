import React, { useEffect, useState } from 'react';
import { ECON_DATA_AS_OF } from './econData.js';
import {
  assessFreshness,
  formatCstParts,
  STALE_THRESHOLD_DAYS,
} from '../../lib/time/dataFreshness.js';

// ============================================================================
// 经济大盘 · 数据时效条（数据更新时间戳 + 中国标准时间实时钟 + 陈旧告警）
// ----------------------------------------------------------------------------
// 三段合一：
//   1) 数据截至/更新于 —— 展示数据时间戳（ECON_DATA_AS_OF），玻璃拟态卡。
//   2) 实时时间 —— 中国标准时间（UTC+8），setInterval 秒级刷新，卸载即清理。
//   3) 陈旧研判 —— 计算「实时时间 − 数据时间戳」间隔，>阈值(35 天) 醒目告警，
//      未超阈值显示「数据为最新」态。判定逻辑抽在 lib/time/dataFreshness.js（纯函数）。
// 无外部依赖；配色走 --status-* / --cyber-cyan 令牌，随日夜主题切换。
// ============================================================================

const LEVEL_META = {
  fresh: {
    dot: 'var(--status-positive)',
    text: 'var(--status-positive)',
    tag: '数据为最新',
  },
  aging: {
    dot: 'var(--status-caution)',
    text: 'var(--status-caution)',
    tag: '临近更新窗口',
  },
  stale: {
    dot: 'var(--status-negative)',
    text: 'var(--status-negative)',
    tag: '数据可能已过期',
  },
  unknown: {
    dot: 'var(--text-tertiary)',
    text: 'var(--text-tertiary)',
    tag: '时效未知',
  },
};

/**
 * 数据时效条。
 * @param {{ dataAsOf?: string, className?: string }} props
 *   dataAsOf 数据时间戳（默认 ECON_DATA_AS_OF）；className 透传外层样式。
 */
export default function DataFreshnessBar({ dataAsOf = ECON_DATA_AS_OF, className = '' }) {
  // 实时时间：秒级刷新；组件卸载时清理 interval，防泄漏。
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = formatCstParts(now);
  const fresh = assessFreshness(dataAsOf, now, STALE_THRESHOLD_DAYS);
  const meta = LEVEL_META[fresh.level] || LEVEL_META.unknown;
  const ageText = Number.isNaN(fresh.ageDaysWhole) ? '—' : `${fresh.ageDaysWhole} 天`;

  return (
    <section
      className={`econ-freshness ${fresh.isStale ? 'is-stale' : ''} ${className}`}
      aria-label="经济大盘数据时效"
    >
      <div className="econ-freshness__row">
        {/* 数据更新时间戳 */}
        <div className="econ-freshness__cell">
          <span className="econ-freshness__k mono">数据更新于</span>
          <span className="econ-freshness__v mono os-mono-tabular">{dataAsOf}</span>
          <span className="econ-freshness__note">国家统计局 2026 上半年（H1）发布 · 以官方为准</span>
        </div>

        <span className="econ-freshness__sep" aria-hidden="true" />

        {/* 实时时间（中国标准时间 UTC+8） */}
        <div className="econ-freshness__cell">
          <span className="econ-freshness__k mono">实时时间 · 北京 UTC+8</span>
          <span className="econ-freshness__v mono os-mono-tabular">
            <time dateTime={now.toISOString()} aria-live="off">{clock.full}</time>
          </span>
          <span className="econ-freshness__note">{clock.weekday} · 浏览器本地钟按中国标准时间呈现</span>
        </div>

        <span className="econ-freshness__sep" aria-hidden="true" />

        {/* 陈旧研判 */}
        <div className="econ-freshness__cell econ-freshness__cell--verdict">
          <span className="econ-freshness__badge mono" style={{ color: meta.text }}>
            <span className="econ-freshness__badge-dot" style={{ background: meta.dot }} aria-hidden="true" />
            {meta.tag}
          </span>
          <span className="econ-freshness__note">
            数据年龄 {ageText} · 阈值 {fresh.thresholdDays} 天
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
