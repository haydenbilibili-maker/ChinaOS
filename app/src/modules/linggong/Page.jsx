import GySliceShell from '../shared/gy/GySliceShell.jsx';
import LinggongPanel from './LinggongPanel.jsx';
import './linggong.css';

/**
 * 中国人群分析 · 零工经济人群（GY-05）
 * 人群画像分层第三子集 · 与 GY-03 青年 / GY-04 性少数同构
 */
export default function LinggongPage() {
  return (
    <GySliceShell
      badge="GY-05 · 人群画像分层"
      title="零工经济"
      subtitle="悬空的基础设施 · 系统压在他们身上，他们不站在任何东西上"
      appId="lg-app"
      moduleId="linggong"
      className="linggong-page"
    >
      <LinggongPanel />
    </GySliceShell>
  );
}
