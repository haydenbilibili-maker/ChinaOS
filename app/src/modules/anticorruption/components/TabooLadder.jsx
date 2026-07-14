import { TABOO_LADDER, TABOO_SHRINK_BAR } from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 禁忌递降 · 保护区单调收缩 */
export default function TabooLadder() {
  return (
    <section className="ac-sec os-reveal">
      <div className="ac-sec-hd">
        <span className="ac-sn">02</span>
        <h2>禁忌递降 · 保护区在单调收缩</h2>
        <span className="ac-sec-s">标志性案件 = 结构标本</span>
      </div>
      <p className="ac-lead">
        这不是一份落马名单。<b>这是一张「保护规则」的失效记录</b>——
        每一个标志性案件的结构意义，在于它<b>破除了一条此前被认为不可触碰的规则</b>。
        把它们按时间排开，你会看到一条清晰的趋势线。
      </p>
      <div className="ac-ladder">
        {TABOO_LADDER.map((l) => (
          <div key={`${l.yr}-${l.broke}`} className="ac-lrow">
            <div className="ac-lyr">{l.yr}</div>
            <div className="ac-lbroke">
              <span className="ac-lx">✕</span>
              {l.broke}
            </div>
            <div className="ac-lzone">
              <Rich html={l.zone} />
              <br />
              <span className="ac-lcase">标本 · {l.case}</span>
            </div>
          </div>
        ))}
        <div className="ac-lbar">
          <div className="ac-lbar-t">
            <b>结构读数：保护区在单调收缩。趋势线指向——没有结构性的安全区。</b>
            <br />
            这在反腐的维度上是「进展」。<b>但请立刻翻到下一节：因为它的另一面，是不确定性的单调上升。</b>
          </div>
          <div className="ac-shrink">
            {TABOO_SHRINK_BAR.map((b) => (
              <div key={b.label} style={{ width: `${b.width}%`, background: b.color }}>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
