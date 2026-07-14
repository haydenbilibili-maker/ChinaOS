import {
  EQUATION_FACTORS,
  EQUATION_IMPLICATION,
} from '../../../domain/anticorruption.ts';

function Rich({ html, className = '' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 招牌元件：腐败规模 = 租金面 × 监督缺口 */
export default function CorruptionEquation() {
  return (
    <section className="ac-eq-wrap os-reveal">
      <div className="ac-ey">核心方程 · THE EQUATION</div>
      <div className="ac-eq-title">腐败规模 = 租金面 × 监督缺口</div>

      <div className="ac-eq">
        <div className="ac-factor">
          <div className="ac-factor-k">{EQUATION_FACTORS.rentSurface.label}</div>
          <div className="ac-factor-v">
            <span className="ac-factor-w" style={{ color: EQUATION_FACTORS.rentSurface.color }}>
              {EQUATION_FACTORS.rentSurface.display}
            </span>
            <span className="ac-factor-n">{EQUATION_FACTORS.rentSurface.arrow}</span>
          </div>
          <Rich className="ac-factor-d" html={EQUATION_FACTORS.rentSurface.detail} />
        </div>
        <div className="ac-times">×</div>
        <div className="ac-factor">
          <div className="ac-factor-k">{EQUATION_FACTORS.monitoringGap.label}</div>
          <div className="ac-factor-v">
            <span className="ac-factor-w" style={{ color: EQUATION_FACTORS.monitoringGap.color }}>
              {EQUATION_FACTORS.monitoringGap.display}
            </span>
            <span className="ac-factor-n">{EQUATION_FACTORS.monitoringGap.arrow}</span>
          </div>
          <Rich className="ac-factor-d" html={EQUATION_FACTORS.monitoringGap.detail} />
        </div>
      </div>

      <div className="ac-eq-out">
        <div className="ac-eq-out-lb">推论 · Implication</div>
        <div className="ac-eq-out-v">{EQUATION_IMPLICATION.headline}</div>
        <Rich className="ac-eq-out-d" html={EQUATION_IMPLICATION.body} />
      </div>

      <Rich className="ac-eq-note" html={EQUATION_IMPLICATION.footnote} />
    </section>
  );
}
