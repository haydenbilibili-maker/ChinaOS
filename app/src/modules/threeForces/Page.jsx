import { PageHeader } from '../../app/ui.jsx';
import ThreeForcesMonitor from './ThreeForcesMonitor.jsx';

/** 三力监测仪 · 治理结构模块 4 */
export default function ThreeForcesPage() {
  return (
    <div className="three-forces-page">
      <PageHeader
        badge="治理结构 · 三力"
        title="三力监测仪"
        subtitle="外部压力 / 内部危机 / 认知迭代 · 改革窗口压力读数 · 反直觉仪表"
      />
      <ThreeForcesMonitor />
    </div>
  );
}
