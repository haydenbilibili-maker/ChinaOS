import GySliceShell from '../shared/gy/GySliceShell.jsx';
import LaonianPanel from './LaonianPanel.jsx';
import './laonian.css';

/**
 * 中国人群分析 · 老年群体(GY-09)
 * 人群画像分层第七子集 · 与 GY-07 体制内 / GY-08 中产同构
 */
export default function LaonianPage() {
  return (
    <GySliceShell
      badge="GY-09 · 人群画像分层"
      title="老年"
      subtitle="应计负债 · 账期已至的三亿人"
      appId="ln-app"
      moduleId="laonian"
      className="laonian-page"
    >
      <LaonianPanel />
    </GySliceShell>
  );
}
