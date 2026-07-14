import { COST_CURVE } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 代价曲线 · 保护区收缩 ⟷ 官场躺平 */
export default function CostCurve() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">04</span>
        <h2>代价曲线 · 保护区收缩 ⟷ 官场躺平</h2>
        <span className="ac-sec-s">两者是机械联动的</span>
      </div>
      <div className="ac-cost">
        <h3>{COST_CURVE.title}</h3>
        {COST_CURVE.paragraphs.map((p) => (
          <Rich key={p.slice(0, 24)} className="ac-cost-p" html={p} tag="p" />
        ))}
        <Rich className="ac-cost-loop" html={COST_CURVE.loop} />
      </div>
    </section>
  );
}
