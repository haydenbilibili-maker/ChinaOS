import GySliceShell from '../shared/gy/GySliceShell.jsx';
import XingshaoshuPanel from './XingshaoshuPanel.jsx';
import './xingshaoshu.css';

/**
 * 中国人群分析 · 性少数群像（GY-04）
 * 人群画像分层第二子集 · 与 GY-03 青年同构
 */
export default function XingshaoshuPage() {
  return (
    <GySliceShell
      badge="GY-04 · 人群画像分层"
      title="性少数"
      subtitle="挤压性存在 · 被允许的可见形态 = 被允许的存在形态"
      appId="xs-app"
      moduleId="xingshaoshu"
      className="xingshaoshu-page"
    >
      <XingshaoshuPanel />
    </GySliceShell>
  );
}
