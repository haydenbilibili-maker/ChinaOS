import { Link } from 'react-router-dom';
import { ATTRIBUTION_ROUTE, LAYER_META } from '../../domain/governance';

export default function TermDetail({ term, onClose }) {
  if (!term) return null;

  return (
    <aside className="pr-panel pr-term-detail">
      <div className="pr-panel-ey">任期详情</div>
      <div className="pr-term-name">{term.name}</div>
      <div className="pr-term-range">
        {term.start} — {term.end ?? '今'} · {term.radius.map((l) => LAYER_META[l].shortLabel).join(' + ')}
      </div>
      <p style={{ fontSize: 13, color: 'var(--pr-text-dim)', lineHeight: 1.6 }}>{term.radiusNote}</p>

      {term.keyAnnotation && (
        <p style={{ fontSize: 12, color: 'var(--pr-brass)', fontStyle: 'italic', marginTop: 12 }}>
          「{term.keyAnnotation}」
        </p>
      )}

      <h3 style={{ fontSize: 13, marginTop: 16, marginBottom: 8 }}>约束 / 时代条件</h3>
      <p style={{ fontSize: 12, color: 'var(--pr-text-dim)', lineHeight: 1.65 }}>{term.constraints}</p>

      <h3 style={{ fontSize: 13, marginTop: 16, marginBottom: 8 }}>代表作（按层着色）</h3>
      <ul className="pr-policy-list">
        {term.signaturePolicies.map((p) => {
          const meta = LAYER_META[p.layer];
          return (
            <li key={`${p.year}-${p.title}`} className="pr-policy-item">
              {p.issueId ? (
                <Link
                  to={`${ATTRIBUTION_ROUTE}?issue=${encodeURIComponent(p.issueId)}`}
                  className="pr-policy-link"
                  style={{ textDecoration: 'none' }}
                >
                  {p.title}
                </Link>
              ) : (
                <span className="pr-policy-link" style={{ cursor: 'default' }}>{p.title}</span>
              )}
              <div className="pr-policy-meta" style={{ color: meta.color }}>
                {p.year} · {meta.shortLabel} · {p.note}
              </div>
            </li>
          );
        })}
      </ul>

      {term.inflectionPoints.length > 0 && (
        <div className="pr-inflection-list">
          <h3 style={{ fontSize: 13, marginBottom: 8 }}>任内转折点</h3>
          {term.inflectionPoints.map((inf) => (
            <div key={`${inf.year}-${inf.event}`} className="pr-inflection-item">
              <strong style={{ color: 'var(--pr-brass)' }}>{inf.year}</strong> · {inf.event}
              <div style={{ marginTop: 4 }}>{inf.significance}</div>
            </div>
          ))}
        </div>
      )}

      <Link to={ATTRIBUTION_ROUTE} className="pr-cross-link">
        打开三层归因分析器 ↗
      </Link>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 12,
            background: 'none',
            border: '1px solid var(--pr-hair)',
            color: 'var(--pr-text-dim)',
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          关闭侧栏
        </button>
      )}
    </aside>
  );
}
