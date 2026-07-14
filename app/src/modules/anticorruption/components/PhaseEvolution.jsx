import { PHASE_EVOLUTION } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 三阶段演化 · 2012—2026 */
export default function PhaseEvolution() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">01</span>
        <h2>三阶段演化 · 从运动，到机器，到系统整肃</h2>
        <span className="ac-sec-s">2012 — 2026</span>
      </div>
      <p className="ac-lead">
        十四年不是一条直线。<b>它有三个性质完全不同的阶段——而理解阶段的切换，比记住任何一个名字都重要。</b>
      </p>
      <div className="ac-phases">
        {PHASE_EVOLUTION.map((p) => (
          <div key={p.num} className="ac-ph">
            <div className="ac-ph-num">{p.num}</div>
            <h3>{p.name}</h3>
            <div className="ac-ph-yr">{p.yr}</div>
            <div className="ac-ph-core">{p.core}</div>
            <Rich className="ac-ph-body" html={p.body} />
            <div className="ac-ph-marks">
              <Rich className="ac-ph-mk" html={p.marks} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
