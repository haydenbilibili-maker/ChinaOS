import { PageHeader } from '../../app/ui.jsx';
import JunrenPanel from './JunrenPanel.jsx';
import './junren.css';

/**
 * 中国人群分析 · 现役军人(GY-47)
 * 人群画像分层第四十五子集 · 与 GY-46 同构 · 内核态特权进程 / 受最严格访问控制
 * 注记:仅政治社会学与制度分析,不涉作战能力、装备、部署、编制等军事信息。
 */
export default function JunrenPage() {
  return (
    <div className="junren-page">
      <PageHeader
        badge="GY-47 · 人群画像分层"
        title="现役军人"
        subtitle="内核态特权进程 · 受最严格访问控制"
      />
      <JunrenPanel />
    </div>
  );
}
