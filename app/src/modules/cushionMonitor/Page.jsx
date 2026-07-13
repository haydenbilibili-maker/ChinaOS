import { PageHeader, Card } from '../../app/ui.jsx';
import CushionMonitor from './CushionMonitor.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 垫子厚度监测 · 治理结构模块 5 */
export default function CushionMonitorPage() {
  return (
    <div className="cushion-monitor-page">
      <PageHeader
        badge="治理结构 · 垫子"
        title="垫子厚度监测"
        subtitle="未富先躺 · 四国锚点 · 命运矩阵 · 四层拆解"
      />
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <CushionMonitor />
      </Card>
      <ModuleFooter moduleId="cushionMonitor" />

    </div>
  );
}
