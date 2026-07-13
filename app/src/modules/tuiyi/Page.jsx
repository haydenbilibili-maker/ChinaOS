import GySliceShell from '../shared/gy/GySliceShell.jsx';
import TuiyiPanel from './TuiyiPanel.jsx';
import './tuiyi.css';

/**
 * 中国人群分析 · 退役军人:预装组织力(GY-12)
 * 人群画像分层第十子集 · 与 GY-10 塔尖 / GY-11 职校生同构
 */
export default function TuiyiPage() {
  return (
    <GySliceShell
      badge="GY-12 · 人群画像分层"
      title="退役军人"
      subtitle="预装组织力 · 被定向赎买的人群"
      appId="ty-app"
      moduleId="tuiyi"
      className="tuiyi-page"
    >
      <TuiyiPanel />
    </GySliceShell>
  );
}
