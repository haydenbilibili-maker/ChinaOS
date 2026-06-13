import { PageHeader } from '../../app/ui.jsx';
import JiazhengPanel from './JiazhengPanel.jsx';
import './jiazheng.css';

/**
 * 中国人群分析 · 家政与照护工人(GY-31)
 * 人群画像分层第二十九子集 · 与 GY-30 同构 · 出借的守护进程模型
 */
export default function JiazhengPage() {
  return (
    <div className="jiazheng-page">
      <PageHeader
        badge="GY-31 · 人群画像分层"
        title="家政与照护工人"
        subtitle="出借的守护进程 · 照护别家，自家停摆"
      />
      <JiazhengPanel />
    </div>
  );
}
