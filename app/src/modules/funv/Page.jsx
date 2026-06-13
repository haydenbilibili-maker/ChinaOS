import { PageHeader } from '../../app/ui.jsx';
import FunvPanel from './FunvPanel.jsx';
import './funv.css';

/**
 * 中国人群分析 · 农村留守妇女(GY-45)
 * 人群画像分层第四十三子集 · 与 GY-44 同构 · 独自维持集群的主节点 / 一人承托全家
 */
export default function FunvPage() {
  return (
    <div className="funv-page">
      <PageHeader
        badge="GY-45 · 人群画像分层"
        title="农村留守妇女"
        subtitle="独自维持集群的主节点 · 一人承托全家"
      />
      <FunvPanel />
    </div>
  );
}
