import { PageHeader } from '../../app/ui.jsx';
import ManjiuPanel from './ManjiuPanel.jsx';
import './manjiu.css';

/**
 * 中国人群分析 · 慢就业青年/全职儿女/NEET(GY-34)
 * 人群画像分层第三十二子集 · 与 GY-33 同构 · 主动挂起的进程模型
 */
export default function ManjiuPage() {
  return (
    <div className="manjiu-page">
      <PageHeader
        badge="GY-34 · 人群画像分层"
        title="慢就业青年 · 全职儿女 · NEET"
        subtitle="主动挂起的进程 · 从调度队列里退出"
      />
      <ManjiuPanel />
    </div>
  );
}
