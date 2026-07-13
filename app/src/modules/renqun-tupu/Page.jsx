import { PageHeader } from '../../app/ui.jsx';
import { POPULATION_SLICE_COUNT } from '../../lib/gy/registry.js';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import RenqunTupuPanel from './RenqunTupuPanel.jsx';
import SectionSpace3D from './SectionSpace3D.jsx';
import SectionParallel from './SectionParallel.jsx';
import SectionLens from './SectionLens.jsx';
import './renqunTupu.css';

/**
 * 中国人群分析 · 人群画像总图谱（GY-00）
 * 人群切片母索引 · 人群分层组第一顺位入口
 */
export default function RenqunTupuPage() {
  return (
    <div className="renqun-tupu-page">
      <PageHeader
        badge="GY-00 · 人群分层 · 母索引"
        title="人群画像总图谱"
        subtitle={`${POPULATION_SLICE_COUNT} 片切片 · 八轴全光谱 · 一张隐性价目表的全息验证`}
      />
      <RenqunTupuPanel />
      <div className="mt-8 space-y-6 os-section-stagger">
        <SectionSpace3D />
        <SectionParallel />
        <SectionLens />
      </div>
      <ModuleFooter moduleId="renqunTupu" />
    </div>
  );
}
