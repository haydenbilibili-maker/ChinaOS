import { PageHeader } from '../../app/ui.jsx';
import ZhongnvPanel from './ZhongnvPanel.jsx';
import './zhongnv.css';

/**
 * 中国人群分析 · 中年女性:被折叠的一代(GY-17)
 * 人群画像分层第十五子集 · 与 GY-16 离岸华人同构 · 后台守护进程模型
 */
export default function ZhongnvPage() {
  return (
    <div className="zhongnv-page">
      <PageHeader
        badge="GY-17 · 人群画像分层"
        title="中年女性 · 被折叠的一代"
        subtitle="后台守护进程 · 维持系统的不可见线程"
      />
      <ZhongnvPanel />
    </div>
  );
}
