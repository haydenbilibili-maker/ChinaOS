import GySliceShell from '../shared/gy/GySliceShell.jsx';
import YulunPanel from './YulunPanel.jsx';
import './yulun.css';

/**
 * 中国人群分析 · 网络舆论场人群(GY-36)
 * 人群画像分层第三十四子集(第三批收官) · 与 GY-35 同构 · 情绪驱动的中断风暴模型
 */
export default function YulunPage() {
  return (
    <GySliceShell
      badge="GY-36 · 人群画像分层 · 第三批收官"
      title="网络舆论场人群"
      subtitle="共享事件总线上的中断风暴 · 受众即弹药"
      appId="yl-app"
      moduleId="yulun"
      className="yulun-page"
    >
      <YulunPanel />
    </GySliceShell>
  );
}
