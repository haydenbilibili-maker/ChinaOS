import { Link } from 'react-router-dom';
import { ATTRIBUTION_ROUTE, LAYER_META } from '../../../domain/governance.ts';
import { computeRegime, getRegimeMeta } from '../computeRegime.ts';

export default function RegimeVerdict({ resolve }) {
  const { score, regime, gate } = computeRegime(resolve);
  const meta = getRegimeMeta(regime);

  return (
    <section className="sp-verdict">
      <div className="sp-v-top">
        <div>
          <div className="sp-v-ey">当前态势 · REGIME</div>
          <div className="sp-v-state">
            <span className={`sp-v-lamp ${meta.cls}`} />
            <span className="sp-v-word">{meta.word}</span>
          </div>
          <div className="sp-v-sub">{meta.sub}</div>
        </div>
        <div className="sp-v-score">
          <div className="n">{score}</div>
          <div className="l">治本进度 / 100</div>
        </div>
      </div>
      <div className="sp-track">
        <div className="sp-rail">
          <div className="sp-knob" style={{ left: `${meta.pos}%` }} />
        </div>
        <div className="sp-rlabels">
          <span className={regime === 'defense' ? 'on' : ''}>防御 · 治标买时间</span>
          <span className={regime === 'watch' ? 'on' : ''}>观察 · 临界</span>
          <span className={regime === 'offense' ? 'on' : ''}>进攻 · 治本启动</span>
        </div>
      </div>
      <div className="sp-trigger">
        <b>切换扳机</b> · A1 考核换锚转绿　或　C1 平减指数连续两季转正（当前闸门：
        {gate ? '开启' : '关闭'}）⟶ 态势切&quot;进攻&quot;。
      </div>
    </section>
  );
}

export function SignalAttributionChip({ attribution }) {
  if (!attribution) return null;
  const layerMeta = LAYER_META[attribution.layer];
  return (
    <Link
      to={`${ATTRIBUTION_ROUTE}?issue=${attribution.issueId}`}
      className="sp-attrib-link"
      style={{ '--layer-color': layerMeta.color }}
      onClick={(e) => e.stopPropagation()}
    >
      {layerMeta.shortLabel}层归因 →
    </Link>
  );
}
