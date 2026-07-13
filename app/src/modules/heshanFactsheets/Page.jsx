import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanFactsheetsPanel from './HeshanFactsheetsPanel.jsx';
import './heshanFactsheets.css';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 新省图册 · 三十四份建省档案 */
export default function HeshanFactsheetsPage() {
  return (
    <div className="heshan-factsheets-page">
      <PageHeader
        badge="重构河山 · 图册"
        title="新省图册"
        subtitle="三十四份建省档案 · 2025 年报口径 · 人口 GDP 聚合 · 数据截至 2026-06"
      />
      <HeshanNav current="factsheets" />
      <HeshanFactsheetsPanel />
      <ModuleFooter moduleId="heshanFactsheets" />

    </div>
  );
}
