import { PageHeader } from '../../app/ui.jsx';
import MoshaoPanel from './MoshaoPanel.jsx';
import './moshao.css';

/**
 * 中国人群分析 · 基层治理末梢:网格员、辅警、社工、协管(GY-24)
 * 人群画像分层第二十二子集 · 与 GY-23 同构 · 借权代理进程模型
 */
export default function MoshaoPage() {
  return (
    <div className="moshao-page">
      <PageHeader
        badge="GY-24 · 人群画像分层"
        title="基层治理末梢 · 网格员、辅警、社工、协管"
        subtitle="借权代理进程 · 执行权力，不拥有账户"
      />
      <MoshaoPanel />
    </div>
  );
}
