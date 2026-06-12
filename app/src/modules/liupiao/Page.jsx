import { PageHeader } from '../../app/ui.jsx';
import LiupiaoPanel from './LiupiaoPanel.jsx';
import './liupiao.css';

/**
 * 中国人群分析 · 流量彩票:主播与创作者(GY-14)
 * 人群画像分层第十二子集 · 与 GY-12 退役军人 / GY-13 信仰人群同构
 */
export default function LiupiaoPage() {
  return (
    <div className="liupiao-page">
      <PageHeader
        badge="GY-14 · 人群画像分层"
        title="流量彩票 · 主播与创作者"
        subtitle="彩票调度 · 用中奖伪装的职业"
      />
      <LiupiaoPanel />
    </div>
  );
}
