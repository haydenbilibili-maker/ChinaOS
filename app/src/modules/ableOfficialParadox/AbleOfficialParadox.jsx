import { Link } from 'react-router-dom';
import { AS_OF_LABEL } from '../../lib/config/asOfBaseline.js';
import { ANTICORRUPTION_ROUTE } from '../../domain/anticorruption.ts';
import { THREE_FORCES_ROUTE } from '../../domain/governance.ts';
import {
  ABLE_OFFICIAL_AS_OF,
  EXIT_PATH,
  FIFTH_COPY_VERDICT,
  MATERIAL_BOUNDARY,
  MECHANISMS,
  MODULE_FOOTER_NOTE,
  MODULE_GUARD,
  QUADRANT_VERDICT,
  SELECTION_FLIP,
  TOLERANCE_PARADOX,
} from '../../domain/ableOfficialParadox.ts';
import './able-official-paradox.css';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 能吏悖论 · 能办事 = 能寻租 */
export default function AbleOfficialParadox() {
  return (
    <div className="ink-observatory aop-wrap">
      <header className="aop-top os-reveal">
        <div className="aop-id">
          <span className="aop-mark">ChinaOS · 08</span>
          <h1>
            能吏悖论 <span>· The Able-Official Paradox</span>
          </h1>
        </div>
        <div className="aop-stamp">
          配套 · <b>模块 07 反腐结构观测</b>
          <br />
          命题 · <b>能办事 = 能寻租</b>（同一种能力）
          <br />
          读数基准 · <b>{ABLE_OFFICIAL_AS_OF}</b>
        </div>
      </header>

      <div className="aop-guard os-reveal">
        <b>⚠ 先设一道防线：这不是「能吏无罪论」。</b>
        <Rich html={MODULE_GUARD} tag="span" />
      </div>

      <section className="aop-qw os-reveal">
        <div className="aop-ey">招牌元件 · 能吏悖论象限</div>
        <h2>在现行规则下，「做事」且「清白」这个格子，几乎住不了人。</h2>
        <p className="aop-sub">
          横轴：<b>是否做事</b>（能否交出可见政绩）。纵轴：<b>是否踩线</b>（是否在灰色地带操作）。
          四个格子，四种官员。<b>请特别注意左上角——它不是"人少"，它是结构性地空着。</b>
          而那个缺口，就是这个体制真正的病灶。
        </p>

        <div className="aop-quad">
          <div />
          <div className="aop-qhd">不做事</div>
          <div className="aop-qhd">做事</div>

          <div className="aop-qrw">
            不
            <br />
            踩线
          </div>
          <div className="aop-cell aop-survivor">
            <div className="aop-tag">新筛选机制的存活者</div>
            <h3>程序完人</h3>
            <p className="aop-who">
              留痕齐全、从不拍板、任何事先请示、宁可错过也不担责。
              <b>技术上，他是干净的。</b>而且——<b>他是当下这套新筛选机制的优等生。</b>
            </p>
            <div className="aop-pop">占比 ↑ 上升中</div>
          </div>
          <div className="aop-cell aop-void">
            <div className="aop-vx">∅</div>
            <div className="aop-vt">结构性空缺</div>
            <p className="aop-vd">
              既办成了事，又<b>一条线都没踩过</b>。
              <br />
              在现行规则下，<b>这个格子几乎住不了人</b>——
              <br />
              因为一个严格遵守每一条规则的官员，<b>什么也办不成。</b>
            </p>
          </div>

          <div className="aop-qrw">
            踩
            <br />
            线
          </div>
          <div className="aop-cell aop-worm">
            <div className="aop-tag">纯粹的蛀虫</div>
            <h3>庸而贪</h3>
            <p className="aop-who">
              既不做事，又在寻租。<b>但他的级别通常上不去</b>——
              因为晋升锦标赛要的是可见政绩，而他交不出。<b>他是小官巨贪，不是大老虎。</b>
            </p>
            <div className="aop-pop">级别天花板低</div>
          </div>
          <div className="aop-cell aop-winner">
            <div className="aop-tag">晋升锦标赛的赢家</div>
            <h3>能吏 · 高危人群</h3>
            <p className="aop-who">
              能办事、敢越界、有一张密集的能替他办事的网。
              <b>他是这套晋升机制的优等生——也是反腐的主要捕获对象。</b>
              <b>他的政绩和他的罪证，长在同一根藤上。</b>
            </p>
            <div className="aop-pop">← 落马者主要来自这里</div>
          </div>
        </div>

        <div className="aop-qnote">
          <div className="aop-qnote-lb">这个象限真正的判决 · The Verdict</div>
          <div className="aop-qnote-v">{QUADRANT_VERDICT.headline}</div>
          <Rich className="aop-qnote-d" html={QUADRANT_VERDICT.body} tag="p" />
        </div>
      </section>

      <section className="aop-sec os-reveal">
        <div className="aop-sec-hd">
          <span className="aop-sn">01</span>
          <h2>三个机制 · 「能办事」为何等于「能寻租」</h2>
          <span className="aop-sec-s">不是巧合，是同一块肌肉</span>
        </div>
        <p className="aop-lead">
          这个空格子不是道德现象，是三个机制叠加的产物。<b>拆开看，每一条都冷得让人不适。</b>
        </p>
        <div className="aop-mechs">
          {MECHANISMS.map((m) => (
            <div key={m.num} className="aop-mech">
              <div className="aop-mech-n">{m.num}</div>
              <h3>{m.title}</h3>
              <Rich className="aop-mech-p" html={m.body} tag="p" />
              <Rich className="aop-mech-core" html={m.core} />
            </div>
          ))}
        </div>
      </section>

      <section className="aop-sec os-reveal">
        <div className="aop-sec-hd">
          <span className="aop-sn">02</span>
          <h2>最沉重的后果 · 选择机制反转了</h2>
          <span className="aop-sec-s">这不是士气问题，是筛选标准变了</span>
        </div>
        <div className="aop-flip">
          <h3>{SELECTION_FLIP.title}</h3>
          <Rich className="aop-flip-warn" html={SELECTION_FLIP.warn} tag="p" />
          <div className="aop-fx">
            <div className="aop-fbox aop-fbox-old">
              <div className="aop-era">{SELECTION_FLIP.oldEra}</div>
              <div className="aop-rule">{SELECTION_FLIP.oldRule}</div>
              <Rich className="aop-fwho" html={SELECTION_FLIP.oldWho} tag="p" />
            </div>
            <div className="aop-farr">→</div>
            <div className="aop-fbox aop-fbox-new">
              <div className="aop-era">{SELECTION_FLIP.newEra}</div>
              <div className="aop-rule">{SELECTION_FLIP.newRule}</div>
              <Rich className="aop-fwho" html={SELECTION_FLIP.newWho} tag="p" />
            </div>
          </div>
          <Rich className="aop-fkick" html={SELECTION_FLIP.kick} />
        </div>
      </section>

      <section className="aop-sec os-reveal">
        <div className="aop-sec-hd">
          <span className="aop-sn">03</span>
          <h2>容错机制 · 一个几乎无解的悖论</h2>
          <span className="aop-sec-s">纸面上成立，心理上失效</span>
        </div>
        <div className="aop-tol">
          <h3>{TOLERANCE_PARADOX.title}</h3>
          {TOLERANCE_PARADOX.paragraphs.map((p) => (
            <Rich key={p.slice(0, 20)} className="aop-tol-p" html={p} tag="p" />
          ))}
          <Rich className="aop-tol-par" html={TOLERANCE_PARADOX.paradox} />
        </div>
      </section>

      <section className="aop-sec os-reveal">
        <div className="aop-sec-hd">
          <span className="aop-sn">04</span>
          <h2>唯一的出路 · 让「做事」不再需要踩线</h2>
          <span className="aop-sec-s">然后你会发现，它又绕回了同一个地方</span>
        </div>
        <div className="aop-tol aop-tol-brass">
          <Rich className="aop-tol-p aop-tol-p-first" html={EXIT_PATH.lead} tag="p" />
          <Rich className="aop-tol-p" html={EXIT_PATH.requirements} tag="p" />
          <p className="aop-tol-p">
            用一个词概括——<b className="aop-keyword">{EXIT_PATH.keyword}</b>。
          </p>
          <Rich className="aop-tol-p" html={EXIT_PATH.separation} tag="p" />
          <Rich className="aop-tol-par aop-tol-par-red" html={EXIT_PATH.powerTransfer} />
        </div>
      </section>

      <section className="aop-verdict os-reveal">
        <div className="aop-ey">第五种抄写 · 更彻底的版本</div>
        {FIFTH_COPY_VERDICT.paragraphs.map((p) => (
          <Rich key={p.slice(0, 20)} className="aop-verdict-p" html={p} tag="p" />
        ))}
        <Rich className="aop-verdict-kick" html={FIFTH_COPY_VERDICT.kick} />
      </section>

      <footer className="aop-foot">
        <Rich html={`<b>方法论边界</b>　${MODULE_FOOTER_NOTE}<br><b>与其他模块的联动</b>　${MATERIAL_BOUNDARY}`} />
        <p className="aop-foot-link">
          宏观结构 → <Link to={ANTICORRUPTION_ROUTE}>反腐结构观测 v2.0</Link>
          {' · '}
          三力读数 → <Link to={THREE_FORCES_ROUTE}>三力监测仪 · 内部危机</Link>
          {' · '}
          数据截至 <span className="mono">{AS_OF_LABEL}</span>
        </p>
      </footer>
    </div>
  );
}
