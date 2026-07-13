import { PERSONAL_RISKS } from '../../../domain/personal.ts';

export default function RiskPanel() {
  return (
    <div className="pr-risks">
      {PERSONAL_RISKS.map((r) => (
        <div className="pr-risk" key={r.id}>
          <h3>
            <span className="pr-rn">{r.id}</span> {r.title}
          </h3>
          <p dangerouslySetInnerHTML={{ __html: r.body }} />
          <div className="pr-fix" dangerouslySetInnerHTML={{ __html: r.fix }} />
        </div>
      ))}
    </div>
  );
}
