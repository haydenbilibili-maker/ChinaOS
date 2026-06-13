import { PageHeader } from '../../app/ui.jsx';
import GetihuPanel from './GetihuPanel.jsx';
import './getihu.css';

/**
 * 中国人群分析 · 个体工商户与小微商家(GY-29)
 * 人群画像分层第二十七子集 · 与 GY-28 同构 · 无异常捕获的裸跑进程模型
 */
export default function GetihuPage() {
  return (
    <div className="getihu-page">
      <PageHeader
        badge="GY-29 · 人群画像分层"
        title="个体工商户与小微商家"
        subtitle="无异常捕获的裸跑进程 · 自负盈亏到底"
      />
      <GetihuPanel />
    </div>
  );
}
