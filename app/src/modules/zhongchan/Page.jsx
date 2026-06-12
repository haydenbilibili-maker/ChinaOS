import { PageHeader } from '../../app/ui.jsx';
import ZhongchanPanel from './ZhongchanPanel.jsx';
import './zhongchan.css';

/**
 * 中国人群分析 · 中产阶层(GY-08)
 * 人群画像分层第六子集 · 与 GY-06 农民工 / GY-07 体制内同构
 */
export default function ZhongchanPage() {
  return (
    <div className="zhongchan-page">
      <PageHeader
        badge="GY-08 · 人群画像分层"
        title="中产阶层"
        subtitle="质押态进程 · 三张折价的凭证"
      />
      <ZhongchanPanel />
    </div>
  );
}
