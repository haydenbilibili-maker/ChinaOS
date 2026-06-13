import { PageHeader } from '../../app/ui.jsx';
import XianyuPanel from './XianyuPanel.jsx';
import './xianyu.css';

/**
 * 中国人群分析 · 县域青年:留下的人(GY-20)
 * 人群画像分层第十八子集 · 与 GY-19 同构 · 未被监控的中间件模型
 */
export default function XianyuPage() {
  return (
    <div className="xianyu-page">
      <PageHeader
        badge="GY-20 · 人群画像分层"
        title="县域青年 · 留下的人"
        subtitle="未被监控的中间件 · 关系即调度器"
      />
      <XianyuPanel />
    </div>
  );
}
