import { PageHeader, Card } from '../../app/ui.jsx';
import AttributionAnalyzer from './AttributionAnalyzer.jsx';
import './attribution.css';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 三层归因分析器 · 路线/决策/执行权力落点判定 */
export default function AttributionPage() {
  return (
    <div className="attribution-page">
      <PageHeader
        badge="治理结构 · 归因"
        title="三层归因分析器"
        subtitle="路线 / 决策 / 执行 · 摆对被告席 · 区分「没做成」与「没权做」 · 规则判定非 LLM"
      />
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <AttributionAnalyzer />
      </Card>
      <ModuleFooter moduleId="attribution" />

    </div>
  );
}
