import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanReformPanel from './HeshanReformPanel.jsx';
import './heshanReform.css';

/** 重构山河 · 中国省市行政区划调整建议书 */
export default function HeshanReformPage() {
  return (
    <div className="heshan-reform-page">
      <PageHeader
        badge="重构河山 · 建议书"
        title="重构山河"
        subtitle="结构性诊断 · 区划调整建议 · 可视化底稿 · 数据截至 2026-06 · 十五五区划改革窗口"
      />
      <HeshanNav current="reform" />
      <HeshanReformPanel />
    </div>
  );
}
