import { PageHeader } from '../../app/ui.jsx';
import YiyiPanel from './YiyiPanel.jsx';
import './yiyi.css';

/**
 * 中国人群分析 · 意义市场:信仰人群(GY-13)
 * 人群画像分层第十一子集 · 与 GY-11 职校生 / GY-12 退役军人同构
 */
export default function YiyiPage() {
  return (
    <div className="yiyi-page">
      <PageHeader
        badge="GY-13 · 人群画像分层"
        title="信仰人群"
        subtitle="无主端口 · 被许可的玄学"
      />
      <YiyiPanel />
    </div>
  );
}
