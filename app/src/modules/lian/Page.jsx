import GySliceShell from '../shared/gy/GySliceShell.jsx';
import LianPanel from './LianPanel.jsx';
import './lian.css';

/**
 * 中国人群分析 · 离岸中国人:境外节点与未结清的账户(GY-16)
 * 人群画像分层第十四子集(系列收官) · 与 GY-14 主播创作者 / GY-15 医保里的人同构
 */
export default function LianPage() {
  return (
    <GySliceShell
      badge="GY-16 · 人群画像分层 · 系列收官"
      title="离岸华人"
      subtitle="境外节点 · 未结清的账户"
      appId="la-app"
      moduleId="lian"
      className="lian-page"
    >
      <LianPanel />
    </GySliceShell>
  );
}
