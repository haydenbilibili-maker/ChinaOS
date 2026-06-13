import { PageHeader } from '../../app/ui.jsx';
import ManbingPanel from './ManbingPanel.jsx';
import './manbing.css';

/**
 * 中国人群分析 · 带病生存的年轻人:健康的阶层化(GY-23)
 * 人群画像分层第二十一子集 · 与 GY-22 同构 · 提前折旧的电池模型
 */
export default function ManbingPage() {
  return (
    <div className="manbing-page">
      <PageHeader
        badge="GY-23 · 人群画像分层"
        title="带病生存的年轻人 · 健康的阶层化"
        subtitle="提前折旧的电池 · 健康度在年轻时就开始掉"
      />
      <ManbingPanel />
    </div>
  );
}
