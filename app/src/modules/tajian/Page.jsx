import { PageHeader } from '../../app/ui.jsx';
import TajianPanel from './TajianPanel.jsx';
import './tajian.css';

/**
 * 中国人群分析 · 塔尖:高净值与企业家(GY-10)
 * 人群画像分层第八子集 · 与 GY-08 中产 / GY-09 老年同构
 */
export default function TajianPage() {
  return (
    <div className="tajian-page">
      <PageHeader
        badge="GY-10 · 人群画像分层"
        title="塔尖阶层"
        subtitle="可迁移进程 · 要钱不要人的塔尖"
      />
      <TajianPanel />
    </div>
  );
}
