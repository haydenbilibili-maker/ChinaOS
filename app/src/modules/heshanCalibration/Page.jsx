import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanCalibrationPanel from './HeshanCalibrationPanel.jsx';
import './heshanCalibration.css';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 数据校准底表 · 建省口径透明化 */
export default function HeshanCalibrationPage() {
  return (
    <div className="heshan-calibration-page">
      <PageHeader
        badge="重构河山 · 底表"
        title="数据校准底表"
        subtitle="逐市加总 · 可审计可追溯 · 2025 统计年鉴对齐 · 数据截至 2026-06"
      />
      <HeshanNav current="calibration" />
      <HeshanCalibrationPanel />
      <ModuleFooter moduleId="heshanCalibration" />

    </div>
  );
}
