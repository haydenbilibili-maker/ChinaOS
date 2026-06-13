import { PageHeader } from '../../app/ui.jsx';
import HuochePanel from './HuochePanel.jsx';
import './huoche.css';

/**
 * 中国人群分析 · 货车司机与公路货运劳动者(GY-27)
 * 人群画像分层第二十五子集 · 与 GY-26 同构 · 被卫星监控的实时进程模型
 */
export default function HuochePage() {
  return (
    <div className="huoche-page">
      <PageHeader
        badge="GY-27 · 人群画像分层"
        title="货车司机与公路货运劳动者"
        subtitle="轮子上的实时进程 · 北斗即调度器"
      />
      <HuochePanel />
    </div>
  );
}
