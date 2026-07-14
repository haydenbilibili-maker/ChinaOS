import { Link } from 'react-router-dom';
import { AS_OF_LABEL } from '../../lib/config/asOfBaseline.js';
import { THREE_FORCES_ROUTE } from '../../domain/governance.ts';
import { ABLE_OFFICIAL_PARADOX_ROUTE } from '../../domain/ableOfficialParadox.ts';
import {
  ANTICORRUPTION_AS_OF,
  ANTICORRUPTION_VERSION,
  FIFTH_COPY_VERDICT,
  MATERIAL_BOUNDARY,
  MODULE_DISCIPLINE,
  MODULE_FOOTER_NOTE,
} from '../../domain/anticorruption.ts';
import './store.ts';
import CorruptionDensityMap from './components/CorruptionDensityMap.jsx';
import PhaseEvolution from './components/PhaseEvolution.jsx';
import TabooLadder from './components/TabooLadder.jsx';
import ThresholdMechanism from './components/ThresholdMechanism.jsx';
import CostCurve from './components/CostCurve.jsx';
import StructuralCureLights from './components/StructuralCureLights.jsx';
import FairnessPanel from './components/FairnessPanel.jsx';
import './anticorruption.css';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 反腐结构观测 v2.0 · 不数人头，只数租金面 */
export default function AntiCorruptionObservatory() {
  return (
    <div className="ink-observatory ac-wrap">
      <header className="ac-top os-reveal">
        <div className="ac-id">
          <span className="ac-mark">ChinaOS · 07 · {ANTICORRUPTION_VERSION}</span>
          <h1>
            反腐结构观测 <span>· 2012—2026 系统化</span>
          </h1>
        </div>
        <div className="ac-stamp">
          观测窗口 · <b>十八大以来 14 年</b>
          <br />
          命题 · <b>反腐 = 第五种抄写</b>
          <br />
          读数基准 · <b>{ANTICORRUPTION_AS_OF}</b>
        </div>
      </header>

      <div className="ac-discipline os-reveal">
        <b>⚠ 第一设计不变量（不可移除）</b>　
        <span className="ac-discipline-rule">本模块不数人头，只数租金面。</span>
        <Rich html={MODULE_DISCIPLINE} tag="span" />
      </div>

      <div className="os-reveal-stagger">
        <CorruptionDensityMap />
        <PhaseEvolution />
        <TabooLadder />
        <ThresholdMechanism />
        <CostCurve />

        <section className="ac-sec os-reveal">
          <div className="ac-sec-hd">
            <span className="ac-sn">05</span>
            <h2>治本信号灯 · 三盏，一盏都没绿</h2>
            <span className="ac-sec-s">不看抓了谁，看结构变没变</span>
          </div>
          <p className="ac-lead">
            十四年，四百万人次被查处。<b>但要判断这是「治标」还是开始「治本」，那些数字一个都不算数。</b>
            因为它们衡量的是<b>租金的兑现</b>，而不是<b>租金的供给</b>。盯这三个结构指标——<b>一盏转绿，才是质变信号。</b>
          </p>
          <StructuralCureLights />
        </section>

        <FairnessPanel />

        <section className="ac-verdict os-reveal">
          <div className="ac-ey">第五种抄写 · THE FIFTH COPY</div>
          {FIFTH_COPY_VERDICT.paragraphs.map((p) => (
            <Rich key={p.slice(0, 20)} className="ac-verdict-p" html={p} tag="p" />
          ))}
          <Rich className="ac-verdict-kick" html={FIFTH_COPY_VERDICT.kick} />
        </section>
      </div>

      <footer className="ac-foot">
        <Rich
          html={`<b>与其他模块的联动</b>　${MODULE_FOOTER_NOTE}<br><b>材料边界</b>　${MATERIAL_BOUNDARY}`}
        />
        <p className="ac-foot-link">
          微观机制 → <Link to={ABLE_OFFICIAL_PARADOX_ROUTE}>能吏悖论</Link>
          {' · '}
          三力读数 → <Link to={THREE_FORCES_ROUTE}>三力监测仪 · 内部危机</Link>
          {' · '}
          数据截至 <span className="mono">{AS_OF_LABEL}</span>
        </p>
      </footer>
    </div>
  );
}
