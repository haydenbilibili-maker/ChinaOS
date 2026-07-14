import { Link } from 'react-router-dom';
import { PERSONAL_REVIEW_ROUTE } from '../../../domain/governance.ts';
import { STRUCTURAL_TENSIONS } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 两重结构张力 · 反腐与发展的对冲 */
export default function StructuralTensions() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">03</span>
        <h2>两重结构张力</h2>
        <span className="ac-sec-s">反腐与发展的对冲</span>
      </div>
      <div className="ac-tens">
        {STRUCTURAL_TENSIONS.map((ten) => (
          <article key={ten.id} className="ac-ten">
            <h3>{ten.title}</h3>
            {ten.paragraphs.map((p) => (
              <Rich key={p.slice(0, 24)} className="ac-ten-p" html={p} tag="p" />
            ))}
            {ten.id === 'bureaucratic-paralysis' ? (
              <p className="ac-ten-link">
                连回 <Link to={PERSONAL_REVIEW_ROUTE}>决策复盘</Link>（模块 04）与书中第四章。
              </p>
            ) : null}
            <Rich className="ac-ten-loop" html={ten.loop} />
          </article>
        ))}
      </div>
    </section>
  );
}
