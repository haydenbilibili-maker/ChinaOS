import { FAIRNESS_PANEL } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 公道话 · 不可移除 */
export default function FairnessPanel() {
  return (
    <section className="ac-fair os-reveal">
      <h2>{FAIRNESS_PANEL.title}</h2>
      <p className="ac-fair-lead">{FAIRNESS_PANEL.lead}</p>
      <div className="ac-fair-grid">
        {FAIRNESS_PANEL.cards.map((card) => (
          <article key={card.title} className="ac-fair-card">
            <div className="ac-fair-card-t">{card.title}</div>
            <Rich className="ac-fair-card-d" html={card.body} />
          </article>
        ))}
      </div>
      <Rich className="ac-debate" html={FAIRNESS_PANEL.debate} />
    </section>
  );
}
