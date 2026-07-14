import { RENT_SOURCES } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 三个租金源 · 直接来自通报措辞 */
export default function RentSurfaceMonitor() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">01</span>
        <h2>三个租金源 · 直接来自通报措辞</h2>
        <span className="ac-sec-s">条越长 = 租金面越大</span>
      </div>
      <p className="ac-lead">
        2026 年 7 月 14 日的官方通报里，反复出现三个词。它们不是修辞，
        <strong>它们精确地对应了一个官员手里最值钱的三种权力：给谁位子、给谁项目、给谁批文。</strong>
        通报没有说他是个坏人——<strong>通报说的是，他把手里的三样权力，变现了。</strong>
      </p>
      <div className="ac-rents">
        {RENT_SOURCES.map((rent) => (
          <article
            key={rent.source}
            className={`ac-rent${rent.source === 'project_contracting' ? ' is-critical' : ''}`}
          >
            <div className="ac-rent-hd">
              <h3>{rent.officialTerm}</h3>
              <span className="ac-rent-quote">通报原词</span>
            </div>
            <div className="ac-rent-power">权力形态 · {rent.powerForm}</div>
            <Rich className="ac-rent-why" html={rent.whyValuable} />
            <div className="ac-gauge">
              <div className="ac-gauge-row">
                <span>租金面大小</span>
                <span>{rent.surfaceSize} / 100</span>
              </div>
              <div className="ac-track">
                <div
                  className="ac-fill"
                  style={{ width: `${rent.surfaceSize}%`, background: rent.trendColor }}
                />
              </div>
              <div className="ac-trend" style={{ color: rent.trendColor }}>
                <span className="ac-trend-ar">{rent.arrow}</span>
                <span>{rent.trend}</span>
              </div>
            </div>
            <div className="ac-rent-note">{rent.note}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
