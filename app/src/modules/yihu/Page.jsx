import { PageHeader } from '../../app/ui.jsx';
import YihuPanel from './YihuPanel.jsx';
import './yihu.css';

/**
 * 中国人群分析 · 医护人员(GY-37)
 * 人群画像分层第三十五子集 · 与 GY-36 同构 · 请求队列溢出的服务进程模型
 */
export default function YihuPage() {
  return (
    <div className="yihu-page">
      <PageHeader
        badge="GY-37 · 人群画像分层"
        title="医护人员"
        subtitle="永远满载的服务进程 · 请求队列溢出"
      />
      <YihuPanel />
    </div>
  );
}
