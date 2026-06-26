import { PageHeader } from '../../app/ui.jsx';
import HeshanNav from '../shared/HeshanNav.jsx';
import HeshanFiscalPanel from './HeshanFiscalPanel.jsx';
import './heshanFiscal.css';

/** 财政重构沙盘 · 转移支付 · 减层 · 债务 */
export default function HeshanFiscalPage() {
  return (
    <div className="heshan-fiscal-page">
      <PageHeader
        badge="重构河山 · 财政"
        title="财政重构沙盘"
        subtitle="区划是骨财政是血 · 因素法转移支付 · 减层节支 · 债务过渡测算"
      />
      <HeshanNav current="fiscal" />
      <HeshanFiscalPanel />
    </div>
  );
}
