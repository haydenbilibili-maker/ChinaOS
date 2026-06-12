import { PageHeader } from '../../app/ui.jsx';
import YibaoPanel from './YibaoPanel.jsx';
import './yibao.css';

/**
 * 中国人群分析 · 医保里的人:慢病与老龄财政的前线(GY-15)
 * 人群画像分层第十三子集 · 与 GY-13 信仰人群 / GY-14 主播创作者同构
 */
export default function YibaoPage() {
  return (
    <div className="yibao-page">
      <PageHeader
        badge="GY-15 · 人群画像分层"
        title="医保里的人 · 慢病与老龄财政"
        subtitle="全员接口 · 单方面改版的契约"
      />
      <YibaoPanel />
    </div>
  );
}
