import { STRUCTURAL_CURES } from '../../../domain/anticorruption.ts';

const STATUS_COLORS = {
  red: 'var(--red)',
  amber: 'var(--amber)',
  green: 'var(--green)',
};

function Rich({ html, className = '' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 治本信号灯 · 不看抓了谁，看结构变没变 */
export default function StructuralCureLights() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">02</span>
        <h2>治本信号灯 · 三盏都没绿</h2>
        <span className="ac-sec-s">不看抓了谁，看结构变没变</span>
      </div>
      <p className="ac-lead">
        要判断这轮反腐是「治标」还是开始「治本」，<strong>不要看抓了多少人、级别多高——那是流量指标。</strong>
        盯这三个结构指标。<strong>一盏转绿，才是质变信号。</strong>
      </p>
      <div className="ac-cures">
        {STRUCTURAL_CURES.map((cure) => (
          <article key={cure.name} className="ac-cure">
            <div className="ac-cure-dot" style={{ background: STATUS_COLORS[cure.status] }} />
            <div>
              <h3>{cure.name}</h3>
              <Rich className="ac-cure-p" html={cure.note} />
            </div>
            <div className="ac-cure-status" style={{ color: STATUS_COLORS[cure.status] }}>
              {cure.statusLabel}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
