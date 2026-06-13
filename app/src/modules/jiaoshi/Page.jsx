import { PageHeader } from '../../app/ui.jsx';
import JiaoshiPanel from './JiaoshiPanel.jsx';
import './jiaoshi.css';

/**
 * 中国人群分析 · 中小学教师(GY-38)
 * 人群画像分层第三十六子集 · 与 GY-37 同构 · 优先级反转 / 中断过载的进程模型
 */
export default function JiaoshiPage() {
  return (
    <div className="jiaoshi-page">
      <PageHeader
        badge="GY-38 · 人群画像分层"
        title="中小学教师"
        subtitle="被中断抢占的进程 · 优先级反转"
      />
      <JiaoshiPanel />
    </div>
  );
}
