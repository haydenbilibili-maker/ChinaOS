import { calcDecisionStats } from '../../../domain/personal.ts';

function parseInput(raw) {
  if (raw.trim() === '') return '';
  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

export default function DecisionCalculator({ decision, onFieldChange }) {
  const stats = calcDecisionStats(decision);

  return (
    <div className={`pr-deck ${decision.deckCls}`}>
      <div className="pr-d-hd">
        <h3>{decision.name}</h3>
        <span className={`pr-tag ${decision.tagCls}`}>{decision.tag}</span>
      </div>
      <div className="pr-inputs">
        {decision.fields.map((f) => (
          <div className="pr-irow" key={f.key}>
            <label>{f.l}</label>
            <input
              type="number"
              placeholder="—"
              value={f.value === '' ? '' : f.value}
              onChange={(e) =>
                onFieldChange(decision.id, f.key, parseInput(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="pr-calc">
        <div className="pr-stat">
          <div className="pr-stat-v" style={{ color: stats.color1 }}>
            {stats.value1}
          </div>
          <div className="pr-stat-k">{stats.label1}</div>
        </div>
        <div className="pr-stat">
          <div className="pr-stat-v" style={{ color: stats.color2 }}>
            {stats.value2}
          </div>
          <div className="pr-stat-k">{stats.label2}</div>
        </div>
      </div>
      <div
        className="pr-d-note"
        dangerouslySetInnerHTML={{ __html: decision.note }}
      />
    </div>
  );
}

export { calcDecisionStats };
