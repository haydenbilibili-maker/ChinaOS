import GySliceShell from '../shared/gy/GySliceShell.jsx';
import BaoanPanel from './BaoanPanel.jsx';
import './baoan.css';

/**
 * 中国人群分析 · 保安群体(GY-39)
 * 人群画像分层第三十七子集 · 与 GY-38 同构 · 空闲轮询的待命进程 / 在场即服务
 */
export default function BaoanPage() {
  return (
    <GySliceShell
      badge="GY-39 · 人群画像分层"
      title="保安群体"
      subtitle="空闲轮询的待命进程 · 在场即服务"
      appId="ba-app"
      moduleId="baoan"
      className="baoan-page"
    >
      <BaoanPanel />
    </GySliceShell>
  );
}
