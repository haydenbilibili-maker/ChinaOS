import {
  VALUE_TRAP_COPY,
  classifyCompassQuadrant,
} from '../../../domain/personal.ts';

const KIND_DOT = {
  defense: 'var(--def)',
  offense: 'var(--off)',
  option: 'var(--opt)',
  anchor: 'var(--def)',
};

function DecisionItem({ decision }) {
  return (
    <div className="pr-c-item">
      <i style={{ background: KIND_DOT[decision.kind] || 'var(--def)' }} />
      {decision.name}
      {decision.fields.some((f) => f.key === 'flow' && f.value !== '') && (
        <span className="pr-c-flow">
          {decision.fields.find((f) => f.key === 'flow')?.value
            ? `（¥${Number(decision.fields.find((f) => f.key === 'flow')?.value).toLocaleString()}/月）`
            : ''}
        </span>
      )}
    </div>
  );
}

export default function DecisionCompass({ decisions, pendingItems = [] }) {
  const buckets = {
    anchor: [],
    productive: [],
    valueTrap: [],
    pending: [...pendingItems.map((name) => ({ id: name, name, kind: 'option' }))],
  };

  decisions.forEach((d) => {
    const q = classifyCompassQuadrant(d.transferable, d.hasCashflow);
    buckets[q].push(d);
  });

  return (
    <div className="pr-compass">
      <div />
      <div className="pr-c-hd">不可迁移</div>
      <div className="pr-c-hd">可迁移</div>

      <div className="pr-c-rw">
        有
        <br />
        现金流
      </div>
      <div className="pr-c-cell hot">
        <div className="pr-c-lbl">锚定型资产</div>
        {buckets.anchor.length ? (
          buckets.anchor.map((d) => <DecisionItem key={d.id} decision={d} />)
        ) : (
          <div className="pr-c-item faint">— 空 —</div>
        )}
      </div>
      <div className="pr-c-cell hot">
        <div className="pr-c-lbl">生产型资产 ★ 最优象限</div>
        {buckets.productive.length ? (
          buckets.productive.map((d) => <DecisionItem key={d.id} decision={d} />)
        ) : (
          <div className="pr-c-item faint">— 空 —</div>
        )}
      </div>

      <div className="pr-c-rw">
        无
        <br />
        现金流
      </div>
      <div className="pr-c-cell cold">
        <div className="pr-c-lbl">价值陷阱区</div>
        {buckets.valueTrap.length ? (
          buckets.valueTrap.map((d) => <DecisionItem key={d.id} decision={d} />)
        ) : (
          <>
            <div className="pr-c-item faint">{VALUE_TRAP_COPY.empty}</div>
            <div className="pr-c-item faint pr-c-hint">{VALUE_TRAP_COPY.hint}</div>
          </>
        )}
      </div>
      <div className="pr-c-cell">
        <div className="pr-c-lbl">待兑现区</div>
        {buckets.pending.length ? (
          buckets.pending.map((d) => (
            <div key={d.id} className="pr-c-item faint">
              {d.name}
            </div>
          ))
        ) : (
          <div className="pr-c-item faint">个人品牌 / 内容资产（尚未变现）</div>
        )}
      </div>
    </div>
  );
}

export { classifyCompassQuadrant };
