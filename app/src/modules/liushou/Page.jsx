import GySliceShell from '../shared/gy/GySliceShell.jsx';
import LiushouPanel from './LiushouPanel.jsx';
import './liushou.css';

/**
 * 中国人群分析 · 农村留守老人(GY-30)
 * 人群画像分层第二十八子集 · 与 GY-29 同构 · 断电的边缘节点模型
 */
export default function LiushouPage() {
  return (
    <GySliceShell
      badge="GY-30 · 人群画像分层"
      title="农村留守老人"
      subtitle="断电的边缘节点 · 被抽走供电的留守者"
      appId="ll-app"
      moduleId="liushou"
      className="liushou-page"
    >
      <LiushouPanel />
    </GySliceShell>
  );
}
