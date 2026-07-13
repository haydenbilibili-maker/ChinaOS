import { BET_SECTION } from '../forces.seed.ts';

export default function BetSection() {
  return (
    <section className="tf-bet">
      <h2>{BET_SECTION.title}</h2>
      <p className="tf-lead" dangerouslySetInnerHTML={{ __html: BET_SECTION.lead }} />
      <div className="tf-bet-grid">
        {BET_SECTION.cards.map((card) => (
          <div key={card.title} className="tf-bet-card">
            <div className="as">{card.title}</div>
            <div className="ln" dangerouslySetInnerHTML={{ __html: card.body }} />
          </div>
        ))}
      </div>
    </section>
  );
}
