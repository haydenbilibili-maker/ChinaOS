import GySliceShell from '../shared/gy/GySliceShell.jsx';
import CanzhangPanel from './CanzhangPanel.jsx';
import './canzhang.css';

/**
 * 中国人群分析 · 残障人群:可见性的零点(GY-18)
 * 人群画像分层第十六子集 · 与 GY-17 中年女性同构 · 未挂载设备模型
 */
export default function CanzhangPage() {
  return (
    <GySliceShell
      badge="GY-18 · 人群画像分层"
      title="残障人群 · 可见性的零点"
      subtitle="未挂载设备 · 没有驱动的外设"
      appId="cz-app"
      moduleId="canzhang"
      className="canzhang-page"
    >
      <CanzhangPanel />
    </GySliceShell>
  );
}
