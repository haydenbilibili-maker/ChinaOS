import React, { useEffect, useRef } from 'react';

/**
 * 执政时间轴 · 水平节点轨 + 进度连线 + 微动效
 * stages: { period, title, desc, accent }
 */
export function EraTimeline({ stages, activeIdx, onSelect, renderDetail }) {
  const scrollRef = useRef(null);
  const nodeRefs = useRef([]);
  const count = stages.length;
  const progress = count > 1 ? activeIdx / (count - 1) : 1;

  useEffect(() => {
    const el = nodeRefs.current[activeIdx];
    if (!el || !scrollRef.current) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIdx]);

  return (
    <div className="lead-era-tl">
      <div className="lead-era-tl-scroll" ref={scrollRef}>
        <div
          className="lead-era-tl-track"
          style={{
            '--lead-tl-count': count,
            '--lead-tl-progress': progress,
          }}
        >
          <div className="lead-era-tl-axis" aria-hidden="true">
            <div className="lead-era-tl-line" />
            <div className="lead-era-tl-progress" />
          </div>

          <div className="lead-era-tl-nodes">
            {stages.map((st, i) => {
              const active = i === activeIdx;
              const accent = st.accent || st.color || 'var(--cyber-cyan)';
              return (
                <button
                  key={st.period || st.label || i}
                  type="button"
                  ref={(node) => { nodeRefs.current[i] = node; }}
                  onClick={() => onSelect(i)}
                  className={`lead-era-tl-node${active ? ' is-active' : ''}`}
                  style={{ '--node-accent': accent, '--node-idx': i }}
                  aria-pressed={active}
                  aria-label={`${st.period} ${st.title}`}
                >
                  <span className="lead-era-tl-dot" />
                  <span className="lead-era-tl-year mono">{st.period || st.range}</span>
                  <span className="lead-era-tl-card">
                    <span className="lead-era-tl-title">{st.title || st.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div key={activeIdx} className="lead-era-tl-detail-wrap">
        {renderDetail
          ? renderDetail(stages[activeIdx], activeIdx)
          : (
            <div
              className="os-card lead-era-tl-detail"
              style={{
                padding: 'var(--card-padding)',
                background: 'var(--bg-elevated)',
                borderLeft: `3px solid ${stages[activeIdx]?.accent || 'var(--china-red)'}`,
              }}
            >
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {[stages[activeIdx]?.period, stages[activeIdx]?.title].filter(Boolean).join(' · ')}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {stages[activeIdx]?.desc}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
