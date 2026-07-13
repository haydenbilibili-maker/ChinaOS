import GySliceShell from '../shared/gy/GySliceShell.jsx';
import JigongPanel from './JigongPanel.jsx';
import './jigong.css';

/**
 * 中国人群分析 · 制造业技术工人:被需要却不被向往(GY-22)
 * 人群画像分层第二十子集 · 与 GY-21 同构 · 无人认领的关键依赖模型
 */
export default function JigongPage() {
  return (
    <GySliceShell
      badge="GY-22 · 人群画像分层"
      title="制造业技术工人 · 被需要却不被向往"
      subtitle="无人认领的关键依赖 · 维护者在流失"
      appId="jg-app"
      moduleId="jigong"
      className="jigong-page"
    >
      <JigongPanel />
    </GySliceShell>
  );
}
