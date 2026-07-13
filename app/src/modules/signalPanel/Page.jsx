import { PageHeader } from '../../app/ui.jsx';
import SignalPanel from './SignalPanel.jsx';

/** 宏观再平衡信号灯 · 治理结构模块 3 */
export default function SignalPanelPage() {
  return (
    <div className="signal-panel-page">
      <PageHeader
        badge="治理结构 · 信号灯"
        title="宏观再平衡信号灯"
        subtitle="A/B/C 三档信号 · 态势合成 · 超个体动作映射 · 2026 政府工作报告口径"
      />
      <SignalPanel />
    </div>
  );
}
