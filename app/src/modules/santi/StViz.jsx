import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';

const EChart = lazy(() => import('../../lib/viz/EChart.jsx'));

/** 尊重 prefers-reduced-motion */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function ChartSkeleton({ height = 260 }) {
  return (
    <div className="st-chart-skel" style={{ minHeight: height }} role="status" aria-live="polite">
      <span className="mono">图表加载中…</span>
    </div>
  );
}

/**
 * 深空图表壳：标题 + 可选「示意」标 + 懒加载 EChart
 */
export function StChartCard({
  title,
  tag,
  illustrative = false,
  option,
  height = 280,
  variant = 'default',
  children,
}) {
  return (
    <figure className="st-chart-card st-reveal">
      <figcaption className="st-chart-card__cap">
        <span className="st-chart-card__title">{title}</span>
        <span className="st-chart-card__tags">
          {illustrative && <span className="st-badge-illus mono">示意</span>}
          {tag && <span className="st-sec-tag mono">{tag}</span>}
        </span>
      </figcaption>
      {option ? (
        <Suspense fallback={<ChartSkeleton height={height} />}>
          <EChart
            option={option}
            variant={variant}
            style={{ height }}
            className="st-echart"
          />
        </Suspense>
      ) : (
        children
      )}
    </figure>
  );
}

export function StChartGrid({ children }) {
  return <div className="st-chart-grid">{children}</div>;
}

/**
 * 因果链步进播放器（可暂停；reduced-motion 时仅切换无动画）
 */
export function ChainStepper({
  nodes,
  activeId,
  onSelect,
  playingLabel = '步进播放',
  intervalMs = 1600,
}) {
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || !nodes?.length) return undefined;
    if (reduced) {
      setPlaying(false);
      return undefined;
    }
    const ids = nodes.map((n) => n.id);
    const tick = () => {
      const idx = ids.indexOf(activeId);
      const next = ids[(idx + 1) % ids.length];
      onSelect(next);
    };
    const t = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(t);
  }, [playing, nodes, activeId, onSelect, intervalMs, reduced]);

  const toggle = useCallback(() => {
    if (reduced) {
      // 无动画：单步前进
      const ids = nodes.map((n) => n.id);
      const idx = ids.indexOf(activeId);
      onSelect(ids[(idx + 1) % ids.length]);
      return;
    }
    setPlaying((p) => !p);
  }, [reduced, nodes, activeId, onSelect]);

  return (
    <div className="st-stepper" role="group" aria-label="因果链步进">
      <button
        type="button"
        className={`st-stepper__btn${playing ? ' is-playing' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
      >
        {reduced ? '下一步' : playing ? '暂停' : playingLabel}
      </button>
      <span className="st-stepper__hint mono">
        {reduced ? '已降级为静态步进' : playing ? '播放中 · 可暂停' : '点击播放沿主链高亮'}
      </span>
    </div>
  );
}

/** 双栏映射（可复用） */
export function DualMirror({ similar, diffs, LinkComp }) {
  const Link = LinkComp;
  return (
    <div className="st-dual st-dual--inline">
      <div className="st-dual__col st-dual__similar">
        <h4>相似机制</h4>
        <ul>
          {(similar || []).map((m) => (
            <li key={m.text || m}>
              {m.to && Link ? <Link to={m.to}>{m.text}</Link> : (m.text || m)}
            </li>
          ))}
        </ul>
      </div>
      <div className="st-dual__col st-dual__diff">
        <h4>关键差异</h4>
        <ul>
          {(diffs || []).map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
