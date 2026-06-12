import { PageHeader } from '../../app/ui.jsx';
import TizhineiPanel from './TizhineiPanel.jsx';
import './tizhinei.css';

/**
 * 中国人群分析 · 体制内人群(GY-07)
 * 人群画像分层第五子集 · 与 GY-05 零工 / GY-06 农民工同构
 */
export default function TizhineiPage() {
  return (
    <div className="tizhinei-page">
      <PageHeader
        badge="GY-07 · 人群画像分层"
        title="体制内人群"
        subtitle="常驻内存 · 刚兑的最后分区"
      />
      <TizhineiPanel />
    </div>
  );
}
