import GySliceShell from '../shared/gy/GySliceShell.jsx';
import XinnongPanel from './XinnongPanel.jsx';
import './xinnong.css';

/**
 * 中国人群分析 · 职业农民与新农人(GY-35)
 * 人群画像分层第三十三子集 · 与 GY-34 同构 · 不可关闭的根服务模型
 */
export default function XinnongPage() {
  return (
    <GySliceShell
      badge="GY-35 · 人群画像分层"
      title="职业农民与新农人"
      subtitle="不可关闭的根服务 · 跑在老化硬件上"
      appId="xn-app"
      moduleId="xinnong"
      className="xinnong-page"
    >
      <XinnongPanel />
    </GySliceShell>
  );
}
