import { statusBadge } from '../computeRegime.ts';
import { SignalAttributionChip } from './RegimeVerdict.jsx';

export default function SignalCard({ signal, status, onCycle }) {
  const badge = statusBadge(status);

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCycle();
    }
  };

  return (
    <div
      className={`sp-card s-${status}`}
      role="button"
      tabIndex={0}
      onClick={onCycle}
      onKeyDown={handleKey}
      aria-label={`${signal.name}，点击循环切换`}
    >
      <div className="sp-c-top">
        <span className="sp-dot" />
        <span className="sp-c-name">{signal.name}</span>
        <span className="sp-c-id">
          {signal.id} · w{signal.w}
        </span>
      </div>
      <div className="sp-c-read">{signal.read}</div>
      <div className="sp-c-trig">
        <span className={`sp-badge ${badge.cls}`}>{badge.label}</span>{' '}
        <b>翻绿触发</b> · {signal.trig}
      </div>
      {signal.attribution && (
        <div className="sp-c-link">
          <SignalAttributionChip attribution={signal.attribution} />
        </div>
      )}
    </div>
  );
}
