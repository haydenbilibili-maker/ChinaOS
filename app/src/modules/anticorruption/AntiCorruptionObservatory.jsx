import { Link } from 'react-router-dom';
import { AS_OF_LABEL } from '../../lib/config/asOfBaseline.js';
import { THREE_FORCES_ROUTE } from '../../domain/governance.ts';
import {
  ANTICORRUPTION_AS_OF,
  FIFTH_COPY_VERDICT,
  MATERIAL_BOUNDARY,
  MODULE_DISCIPLINE,
  MODULE_FOOTER_NOTE,
} from '../../domain/anticorruption.ts';
import './store.ts';
import CorruptionEquation from './components/CorruptionEquation.jsx';
import RentSurfaceMonitor from './components/RentSurfaceMonitor.jsx';
import StructuralCureLights from './components/StructuralCureLights.jsx';
import StructuralTensions from './components/StructuralTensions.jsx';
import FairnessPanel from './components/FairnessPanel.jsx';
import './anticorruption.css';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 反腐结构观测 · 不数人头，只数租金面 */
export default function AntiCorruptionObservatory() {
  return (
    <div className="ink-observatory ac-wrap">
      <header className="ac-top os-reveal">
        <div className="ac-id">
          <span className="ac-mark">ChinaOS · 07</span>
          <h1>
            反腐结构观测 <span>· Anti-Corruption Structural Observatory</span>
          </h1>
        </div>
        <div className="ac-stamp">
          读数基准 · <b>{ANTICORRUPTION_AS_OF}</b>
          <br />
          命题 · <b>反腐 = 第五种抄写</b>
          <br />
          材料 · 仅限官方通报与公开政策文本
        </div>
      </header>

      <div className="ac-discipline os-reveal">
        <b>⚠ 设计纪律（不可移除）</b>　
        <span className="ac-discipline-rule">本模块不数人头，只数租金面。</span>
        {MODULE_DISCIPLINE.replace(/^本模块不数人头，只数租金面。/, '')}
      </div>

      <div className="os-reveal-stagger">
        <CorruptionEquation />
        <RentSurfaceMonitor />
        <StructuralCureLights />
        <StructuralTensions />
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
          三力读数 → <Link to={THREE_FORCES_ROUTE}>三力监测仪 · 内部危机</Link>
          {' · '}
          数据截至 <span className="mono">{AS_OF_LABEL}</span>
        </p>
      </footer>
    </div>
  );
}
