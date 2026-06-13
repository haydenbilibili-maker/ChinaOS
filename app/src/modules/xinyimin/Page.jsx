import { PageHeader } from '../../app/ui.jsx';
import XinyiminPanel from './XinyiminPanel.jsx';
import './xinyimin.css';

/**
 * 中国人群分析 · 城市新移民与夹心层:有城无籍(GY-21)
 * 人群画像分层第十九子集 · 与 GY-20 同构 · 无持久化的访客会话模型
 */
export default function XinyiminPage() {
  return (
    <div className="xinyimin-page">
      <PageHeader
        badge="GY-21 · 人群画像分层"
        title="城市新移民与夹心层 · 有城无籍"
        subtitle="无持久化的访客会话 · 贡献全额，权限受限"
      />
      <XinyiminPanel />
    </div>
  );
}
