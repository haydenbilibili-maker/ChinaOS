import { Link } from 'react-router-dom';
import { ANTICORRUPTION_ROUTE } from '../../../domain/governance.ts';
import { getThreeForcesInputs } from '../../../domain/threeForcesInputs.ts';
import '../../anticorruption/store.ts';

const DIMENSION_LABELS = {
  external_pressure: '外部压力',
  internal_crisis: '内部危机',
  cognitive_iteration: '认知迭代',
};

export default function ExternalForceInputs({ dimension = 'internal_crisis' }) {
  const inputs = getThreeForcesInputs(dimension);
  if (!inputs.length) return null;

  return (
    <section className="tf-ext os-reveal">
      <div className="tf-ext-hd">
        <span className="tf-ext-tag">外部读数</span>
        <h2>{DIMENSION_LABELS[dimension]} · 联动供给</h2>
      </div>
      {inputs.map((input) => (
        <article key={input.source} className="tf-ext-item">
          <div className="tf-ext-top">
            <span className="tf-ext-src">{input.label}</span>
            <span className="tf-ext-score">{input.reading()}</span>
          </div>
          <p className="tf-ext-rationale">{input.rationale}</p>
          {input.source === 'anticorruption' ? (
            <Link to={ANTICORRUPTION_ROUTE} className="tf-ext-link">
              来源 · 反腐结构观测 →
            </Link>
          ) : null}
        </article>
      ))}
    </section>
  );
}
