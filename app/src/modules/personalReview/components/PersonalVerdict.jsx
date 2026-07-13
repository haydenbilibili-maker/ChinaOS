import { Link } from 'react-router-dom';
import {
  SIGNAL_PANEL_ROUTE,
  THREE_FORCES_ROUTE,
} from '../../../domain/governance.ts';
import { computePersonalVerdict } from '../../../domain/personal.ts';
import { useGovernanceLinkage } from '../../../lib/governance/useGovernanceLinkage.ts';

export default function PersonalVerdict() {
  const { regime, regimeLabel, proximityScore, proximityLabel } =
    useGovernanceLinkage();
  const verdict = computePersonalVerdict(regime, proximityScore);

  return (
    <section className="pr-verdict">
      <div className="pr-verdict-ey">
        宏观联动 · {verdict.stance} · {regimeLabel} × {proximityLabel}
      </div>
      <h2 className="pr-verdict-headline">{verdict.headline}</h2>
      <p className="pr-verdict-body" dangerouslySetInnerHTML={{ __html: verdict.body }} />
      <div className="pr-verdict-kick" dangerouslySetInnerHTML={{ __html: verdict.kick }} />
      <div className="pr-verdict-links">
        <span className="pr-link-label">读数来源</span>
        <Link to={SIGNAL_PANEL_ROUTE}>宏观再平衡信号灯</Link>
        <Link to={THREE_FORCES_ROUTE}>三力监测仪</Link>
        <span className="pr-link-sep">·</span>
        <span className="pr-regime-tag">
          当前宏观态势 · <b>{regimeLabel}</b>
          {regime === 'defense' ? '（治标买时间）' : ''}
        </span>
      </div>
    </section>
  );
}

export { computePersonalVerdict };
