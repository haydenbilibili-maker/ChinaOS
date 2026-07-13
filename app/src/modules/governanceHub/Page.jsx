import ObservatoryHome from './ObservatoryHome.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 观象台 · 治理结构组总入口 — 第一屏即判读，非模块导航列表 */
export default function ObservatoryPage() {
  return (
    <div className="observatory-page">
      <ObservatoryHome />
      <ModuleFooter moduleId="governanceHub" />

    </div>
  );
}
