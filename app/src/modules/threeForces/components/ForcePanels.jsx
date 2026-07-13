import { FORCE_LV_NAME } from '../forces.seed.ts';
import { forceLevel, forceScore, levelColor } from '../computeProximity.ts';

function ForceCard({ force, resolve, onCycle }) {
  const score = forceScore(force, resolve);
  const lv = forceLevel(score);

  return (
    <div className="tf-force">
      <div className="tf-force-hd">
        <span className={`tf-force-lamp l-${lv}`} />
        <h3>{force.name}</h3>
        <span className="tf-pct" style={{ color: levelColor(lv) }}>
          {score}
        </span>
      </div>
      <div className="tf-force-mech">{force.mech}</div>
      <div className="tf-paradox" dangerouslySetInnerHTML={{ __html: force.paradox }} />
      <div className="tf-ind">
        {force.inds.map((ind) => {
          const l = resolve(ind.id, ind.lv);
          const handleKey = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCycle(ind.id, l);
            }
          };
          return (
            <div
              key={ind.id}
              className="tf-ind-item"
              role="button"
              tabIndex={0}
              onClick={() => onCycle(ind.id, l)}
              onKeyDown={handleKey}
            >
              <span className={`tf-ind-dot d-${l}`} />
              <span className="tf-ind-body">
                <span className="tf-ind-name">{ind.name}</span>
                <div className="tf-ind-read">{ind.read}</div>
              </span>
              <span className={`tf-ind-lv lv-${l}`}>{FORCE_LV_NAME[l]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ForcePanels({ forces, resolve, onCycle }) {
  return (
    <div className="tf-forces">
      {forces.map((f) => (
        <ForceCard key={f.id} force={f} resolve={resolve} onCycle={onCycle} />
      ))}
    </div>
  );
}
