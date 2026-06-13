import { PageHeader } from '../../app/ui.jsx';
import JipinPanel from './JipinPanel.jsx';
import './jipin.css';

/**
 * 中国人群分析 · 城市极贫与救助对象(GY-43)
 * 人群画像分层第四十一子集 · 与 GY-42 同构 · 最低保活进程 / keep-alive 兜底
 */
export default function JipinPage() {
  return (
    <div className="jipin-page">
      <PageHeader
        badge="GY-43 · 人群画像分层"
        title="城市极贫与救助对象"
        subtitle="最低保活进程 · keep-alive 兜底"
      />
      <JipinPanel />
    </div>
  );
}
