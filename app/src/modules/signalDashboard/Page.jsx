import { PageHeader } from '../../app/ui.jsx';
import SignalDashboardPanel from './SignalDashboardPanel.jsx';
import './signalDashboard.css';

/** 宏观再平衡信号灯 · 超个体决策仪表盘 */
export default function SignalDashboardPage() {
  return (
    <div className="signal-dashboard-page">
      <PageHeader
        badge="推演与训练 · 信号灯"
        title="宏观再平衡信号灯"
        subtitle="A/B/C 三档信号 · 数据事实观察 · 态势合成 · 超个体动作映射 · 2026 政府工作报告口径"
      />
      <SignalDashboardPanel />
    </div>
  );
}
