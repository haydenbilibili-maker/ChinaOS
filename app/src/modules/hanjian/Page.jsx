import { PageHeader } from '../../app/ui.jsx';
import HanjianPanel from './HanjianPanel.jsx';
import './hanjian.css';

/**
 * 中国人群分析 · 罕见病与大病自救群体(GY-53)
 * 人群画像分层第五十一子集 · 与 GY-52 同构
 * 注记:以健康与医保救助框架处理,尊重患者、不渲染,
 * 聚焦诊断、用药可及与保障机制,强调「个体罕见、群体庞大」悖论与制度补位的进展。
 */
export default function HanjianPage() {
  return (
    <div className="hanjian-page">
      <PageHeader
        badge="GY-53 · 人群画像分层"
        title="罕见病与大病自救群体"
        subtitle="低概率分支 · 缺专用 handler 的进程"
      />
      <HanjianPanel />
    </div>
  );
}
