import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../app/ui.jsx';
import { ATTRIBUTION_ROUTE, PREMIER_RADIUS_THESIS } from '../../domain/governance';
import { prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import DriversPanel from './DriversPanel.jsx';
import PolicyScatter from './PolicyScatter.jsx';
import RadiusChart from './RadiusChart.jsx';
import TermDetail from './TermDetail.jsx';
import { GLOBAL_INFLECTIONS, PREMIER_TERMS, STRUCTURAL_DRIVERS } from './premiers.seed.js';
import './premierRadius.css';

/** 总理权限半径图谱 · 1998—今四任职权收缩时序 */
export default function PremierRadiusPage() {
  const [selectedId, setSelectedId] = useState('liqiang');
  const selectedTerm = PREMIER_TERMS.find((t) => t.id === selectedId) ?? PREMIER_TERMS[0];

  useEffect(() => {
    prefetchFigureAvatars(PREMIER_TERMS, 4);
  }, []);

  return (
    <div className="premier-radius-page">
      <PageHeader
        badge="推演与训练 · 权限半径"
        title="总理权限半径图谱"
        subtitle="诊断权与处方权分离 · 制度变迁轨迹 · 非能力排序 · 1998—今"
      />
      <div id="pr-app">
        <div className="pr-wrap">
          <div className={`pr-grid ${selectedTerm ? 'has-sidebar' : ''}`}>
            <div>
              <RadiusChart
                terms={PREMIER_TERMS}
                globalInflections={GLOBAL_INFLECTIONS}
                selectedId={selectedId}
                onSelectTerm={setSelectedId}
              />
              <PolicyScatter terms={PREMIER_TERMS} />
              <DriversPanel drivers={STRUCTURAL_DRIVERS} />
            </div>
            {selectedTerm && (
              <TermDetail term={selectedTerm} onClose={() => setSelectedId(null)} />
            )}
          </div>

          <blockquote className="pr-thesis">
            <strong>终局命题 · </strong>
            {PREMIER_RADIUS_THESIS}
          </blockquote>

          <Link to={ATTRIBUTION_ROUTE} className="pr-cross-link" style={{ marginTop: 16, display: 'inline-flex' }}>
            关联模块：三层归因分析器（共享 PowerLayer 与 issue id）↗
          </Link>
        </div>
      </div>
    </div>
  );
}
