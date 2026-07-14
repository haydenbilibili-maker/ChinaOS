import { THRESHOLD_MECHANISM } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 「不收敛不收手」· 阈值机制 */
export default function ThresholdMechanism() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">03</span>
        <h2>「不收敛不收手」· 一个被低估的精巧设计</h2>
        <span className="ac-sec-s">通报里最重要的六个字</span>
      </div>
      <div className="ac-thresh">
        <h3>{THRESHOLD_MECHANISM.title}</h3>
        <div className="ac-thresh-q">{THRESHOLD_MECHANISM.quote}</div>
        {THRESHOLD_MECHANISM.paragraphs.map((p) => (
          <Rich key={p.slice(0, 24)} className="ac-thresh-p" html={p} tag="p" />
        ))}
        <Rich className="ac-thresh-fn" html={THRESHOLD_MECHANISM.footnote} />
      </div>
    </section>
  );
}
