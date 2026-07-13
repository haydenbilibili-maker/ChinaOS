import { Link } from 'react-router-dom';
import {
  ATTRIBUTION_ROUTE,
  CUSHION_MONITOR_ROUTE,
  OBSERVATORY_ROUTE,
  PREMIER_RADIUS_ROUTE,
  SIGNAL_PANEL_ROUTE,
  THREE_FORCES_ROUTE,
} from '../../domain/governance.ts';
import { computeGovernanceVerdict } from '../../domain/governanceVerdict.ts';
import { computeRegime } from '../signalPanel/computeRegime.ts';
import { allSignals } from '../signalPanel/signals.seed.ts';
import { computeProximity } from '../threeForces/computeProximity.ts';
import { FORCES } from '../threeForces/forces.seed.ts';
import './governanceVerdict.css';

function loadSignalOverrides() {
  try {
    return JSON.parse(localStorage.getItem('chinaos.signals.v1') || '{}') || {};
  } catch {
    return {};
  }
}

function loadForceOverrides() {
  try {
    return JSON.parse(localStorage.getItem('chinaos.threeforces.v1') || '{}') || {};
  } catch {
    return {};
  }
}

function defaultSignalResolve(id, fallback) {
  const ov = loadSignalOverrides();
  return ov[id] ?? fallback;
}

function defaultForceResolve(id, fallback) {
  const ov = loadForceOverrides();
  return ov[id] ?? fallback;
}

const signalDefaults = Object.fromEntries(allSignals().map((s) => [s.id, s.status]));
const forceDefaults = Object.fromEntries(FORCES.flatMap((f) => f.inds.map((i) => [i.id, i.lv])));

/** 双仪表合成读数 · 固定改革时序文案 */
export default function GovernanceVerdict({ compact = false }) {
  const signalResolve = (id, fb) => defaultSignalResolve(id, signalDefaults[id] ?? fb);
  const forceResolve = (id, fb) => defaultForceResolve(id, forceDefaults[id] ?? fb);

  const { score: regimeScore, regime } = computeRegime(signalResolve);
  const proximityScore = computeProximity(forceResolve);
  const verdict = computeGovernanceVerdict(regime, proximityScore);

  return (
    <section className={`gv-panel ink-observatory ${compact ? 'gv-compact' : ''}`}>
      <div className="gv-head">
        <span className="gv-ey">治理结构 · 双仪表合成</span>
        <h2 className="gv-title">{verdict.headline}</h2>
        {!compact && (
          <p className="gv-body">{verdict.body}</p>
        )}
      </div>
      <div className="gv-metrics">
        <div className="gv-metric">
          <span className="gv-m-label">信号灯 · 治本进度</span>
          <span className="gv-m-val">{regimeScore}</span>
          <span className="gv-m-sub">{regime === 'defense' ? '防御' : regime === 'watch' ? '观察' : '进攻'}</span>
        </div>
        <div className="gv-metric">
          <span className="gv-m-label">三力 · 压力合成</span>
          <span className="gv-m-val">{proximityScore}</span>
          <span className="gv-m-sub">{proximityScore < 34 ? '沉寂' : proximityScore < 62 ? '积蓄' : '逼近'}</span>
        </div>
      </div>
      <p className="gv-timing">
        <b>改革时序</b> · {verdict.reformTiming}
      </p>
      <div className="gv-links">
        <Link to={OBSERVATORY_ROUTE}>观象台</Link>
        <Link to={ATTRIBUTION_ROUTE}>三层归因</Link>
        <Link to={PREMIER_RADIUS_ROUTE}>权限半径</Link>
        <Link to={SIGNAL_PANEL_ROUTE}>信号灯</Link>
        <Link to={THREE_FORCES_ROUTE}>三力监测</Link>
        <Link to={CUSHION_MONITOR_ROUTE}>垫子监测</Link>
      </div>
    </section>
  );
}
