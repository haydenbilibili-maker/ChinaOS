import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanFactsheetsPanel from './HeshanFactsheetsPanel.jsx';
import './heshanFactsheets.css';

/** 新省图册 · 三十四份建省档案 */
export default function HeshanFactsheetsPage() {
  return (
    <div className="heshan-factsheets-page">
      <PageHeader
        badge="重构河山 · 图册"
        title="新省图册"
        subtitle="三十四份建省档案 · 人口 GDP 聚合 · 配套《重构山河》建议书"
      />
      <HeshanNav current="factsheets" />
      <HeshanFactsheetsPanel />
    </div>
  );
}
