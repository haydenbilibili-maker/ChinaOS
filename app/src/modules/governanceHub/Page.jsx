import ObservatoryHome from './ObservatoryHome.jsx';
import { Card } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 观象台 · 治理结构组总入口 — 第一屏即判读，非模块导航列表 */
export default function ObservatoryPage() {
  return (
    <div className="observatory-page">
      <Card asSection={false} className="!p-0 !mb-0 !bg-transparent !border-0 !shadow-none">
        <ObservatoryHome />
      </Card>
      <ModuleFooter moduleId="governanceHub" />

    </div>
  );
}
