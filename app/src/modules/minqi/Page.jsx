import { PageHeader } from '../../app/ui.jsx';
import MinqiPanel from './MinqiPanel.jsx';
import './minqi.css';

/**
 * 中国人群分析 · 中小民营企业主(GY-42)
 * 人群画像分层第四十子集 · 与 GY-41 同构 · 两头 I/O 阻塞的中间件进程 / 夹心资本
 */
export default function MinqiPage() {
  return (
    <div className="minqi-page">
      <PageHeader
        badge="GY-42 · 人群画像分层"
        title="中小民营企业主"
        subtitle="两头 I/O 阻塞的中间件进程 · 夹心资本"
      />
      <MinqiPanel />
    </div>
  );
}
