import { computeProximity, getProximityMeta } from '../computeProximity.ts';

export default function ProximityVerdict({ resolve }) {
  const score = computeProximity(resolve);
  const meta = getProximityMeta(score);
  const bandIdx = score < 34 ? 0 : score < 62 ? 1 : 2;

  return (
    <section className="tf-window">
      <div className="tf-win-top">
        <div>
          <div className="tf-win-ey">窗口临近度 · WINDOW PROXIMITY</div>
          <div className="tf-win-word">{meta.word}</div>
          <div className="tf-win-sub">{meta.sub}</div>
        </div>
        <div className="tf-win-score">
          <div className="n">{score}</div>
          <div className="l">压力合成 / 100</div>
        </div>
      </div>
      <div className="tf-gauge">
        <div className="tf-gauge-rail">
          <div className="tf-gauge-knob" style={{ left: `${meta.pos}%` }} />
        </div>
        <div className="tf-gauge-labels">
          <span className={bandIdx === 0 ? 'on' : ''}>沉寂 · 不改仍是最优解</span>
          <span className={bandIdx === 1 ? 'on' : ''}>积蓄 · 成本在追平</span>
          <span className={bandIdx === 2 ? 'on' : ''}>逼近 · 不改更危险</span>
        </div>
      </div>
    </section>
  );
}
