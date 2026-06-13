import { PageHeader } from '../../app/ui.jsx';
import ZhaiwuPanel from './ZhaiwuPanel.jsx';
import './zhaiwu.css';

/**
 * 中国人群分析 · 失信被执行人与债务人群(GY-32)
 * 人群画像分层第三十子集 · 与 GY-31 同构 · 被标记的账户模型
 */
export default function ZhaiwuPage() {
  return (
    <div className="zhaiwu-page">
      <PageHeader
        badge="GY-32 · 人群画像分层"
        title="失信被执行人与债务人群"
        subtitle="被标记的账户 · 一次违约触发系统性降权"
      />
      <ZhaiwuPanel />
    </div>
  );
}
