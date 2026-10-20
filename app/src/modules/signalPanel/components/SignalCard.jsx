import Signal from '../../../vi/Signal.jsx';
import { SignalAttributionChip, STATUS_TO_LEVEL } from './RegimeVerdict.jsx';

const OPTIONS = [
  { status: 'red', label: '警' },
  { status: 'amber', label: '观' },
  { status: 'green', label: '稳' },
];

/** 信号卡：灯 + 判读 + 翻绿扳机；右上三段开关直接设定状态（不再盲点循环） */
export default function SignalCard({ signal, status, onSet }) {
  const level = STATUS_TO_LEVEL[status] || 'unknown';
  const changed = status !== signal.status;
  return (
    <article className={`spc spc--${level}${changed ? ' is-changed' : ''}`}>
      <header className="spc__head">
        <Signal level={level} size="m" showLabel={false} />
        <div className="spc__title">
          <h3>{signal.name}</h3>
          <span className="spc__id vi-figure">{signal.id} · 权重 {signal.w}</span>
        </div>
        <div className="spc__switch" role="radiogroup" aria-label={`${signal.name} 判读`}>
          {OPTIONS.map((o) => (
            <button
              key={o.status}
              type="button"
              role="radio"
              aria-checked={status === o.status}
              className={`spc__opt spc__opt--${STATUS_TO_LEVEL[o.status]}${status === o.status ? ' is-on' : ''}`}
              onClick={() => onSet(o.status)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </header>
      <p className="spc__read">{signal.read}</p>
      <p className="spc__trig"><b>翻绿扳机</b>{signal.trig}</p>
      <footer className="spc__foot">
        {changed ? <span className="spc__mine">我的判读 · 基准为「{OPTIONS.find((o) => o.status === signal.status)?.label}」</span> : <span className="spc__base">基准判读</span>}
        {signal.attribution && <SignalAttributionChip attribution={signal.attribution} />}
      </footer>
    </article>
  );
}
