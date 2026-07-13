import { LAYER_META } from '../../../domain/governance.ts';
import { misattributionWarning } from '../judgment.ts';

export default function VerdictCard({ result, showConfidence = true }) {
  const { issue, confidence, method, matchedKeywords } = result;
  const meta = LAYER_META[issue.layer];
  const warning = misattributionWarning(issue);

  return (
    <article
      className="aa-verdict"
      style={{ '--aa-layer-color': meta.color, '--aa-layer-bg': meta.colorBg }}
    >
      <div className="aa-verdict-top">
        <div>
          <div className="aa-verdict-ey">归因判定 · {meta.label}</div>
          <div className="aa-verdict-state">
            <span className="aa-verdict-lamp" aria-hidden />
            <h2 className="aa-verdict-word">{meta.shortLabel}</h2>
          </div>
          <p className="aa-verdict-title">{issue.title}</p>
        </div>
        {showConfidence && (
          <div className="aa-verdict-score">
            <div className="n">{Math.round(confidence * 100)}</div>
            <div className="l">规则置信</div>
            <div className="aa-verdict-method">{method === 'exact' ? '精确匹配' : method === 'keyword' ? '关键词' : '层级推断'}</div>
          </div>
        )}
      </div>

      <div className="aa-verdict-body">
        <section>
          <h3>判定理由</h3>
          <p>{issue.rationale}</p>
        </section>
        <section>
          <h3>该问责谁</h3>
          <p className="aa-actor">{issue.accountableActor}</p>
        </section>
        <section>
          <h3>可合理期待什么</h3>
          <p>{issue.reasonableExpectation}</p>
        </section>
      </div>

      {warning && (
        <div className="aa-misattrib" role="alert">
          <strong>误诊警告</strong>
          <p>{warning}</p>
        </div>
      )}

      {matchedKeywords?.length > 0 && method !== 'exact' && (
        <div className="aa-kw-hits">
          命中规则：
          {matchedKeywords.slice(0, 6).map((k) => (
            <span key={k} className="aa-kw-chip">{k}</span>
          ))}
        </div>
      )}

      {issue.tags?.length > 0 && (
        <div className="aa-tags">
          {issue.tags.map((t) => (
            <span key={t} className="aa-tag">{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}
