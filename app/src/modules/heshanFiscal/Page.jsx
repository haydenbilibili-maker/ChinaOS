import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanFiscalPanel from './HeshanFiscalPanel.jsx';
import './heshanFiscal.css';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

/** 财政重构沙盘 · 转移支付 · 减层 · 债务 */
export default function HeshanFiscalPage() {
  return (
    <div className="heshan-fiscal-page">
      <PageHeader
        badge="重构河山 · 财政"
        title="财政重构沙盘"
        subtitle="收支倒挂 · 因素法转移支付 · 减层节支 · 债务过渡 · 2025 财政口径"
      />
      <HeshanNav current="fiscal" />
      <HeshanFiscalPanel />
      <ModuleFooter moduleId="heshanFiscal" />

    </div>
  );
}
