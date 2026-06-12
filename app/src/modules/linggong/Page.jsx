import { PageHeader } from '../../app/ui.jsx';
import LinggongPanel from './LinggongPanel.jsx';
import './linggong.css';

/**
 * 中国人群分析 · 零工经济人群（GY-05）
 * 人群画像分层第三子集 · 与 GY-03 青年 / GY-04 性少数同构
 */
export default function LinggongPage() {
  return (
    <div className="linggong-page">
      <PageHeader
        badge="GY-05 · 人群画像分层"
        title="零工经济人群"
        subtitle="悬空的基础设施 · 系统压在他们身上，他们不站在任何东西上"
      />
      <LinggongPanel />
    </div>
  );
}
