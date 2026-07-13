import { DECISION_LANES } from '../signals.seed.ts';
import { computeRegime } from '../computeRegime.ts';

export default function DecisionLanes({ resolve }) {
  const { regime } = computeRegime(resolve);
  const offense = regime === 'offense';

  return (
    <section className="sp-section">
      <div className="sp-s-head">
        <span className="sp-tier sp-tier-brass">个</span>
        <h2>超个体动作映射</h2>
        <span className="sp-desc">随态势自动切换 · 防御版 / 进攻版</span>
      </div>
      <div className="sp-lanes">
        {DECISION_LANES.map((lane) => (
          <div key={lane.key} className="sp-lane">
            <h3>
              {lane.key} <span className="ico">{lane.ico}</span>
            </h3>
            <div className="now">
              <span className={`sp-tag ${offense ? 'tag-green' : 'tag-amber'}`}>
                {offense ? '进攻版' : '防御版'}
              </span>
              <br />
              {offense ? lane.offense : lane.defense}
            </div>
            <div className="flip">
              <b>{offense ? '若回落转防御' : '态势转进攻时'}</b> · {offense ? lane.defense : lane.offense}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
