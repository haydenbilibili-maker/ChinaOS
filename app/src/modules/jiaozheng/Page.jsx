import GySliceShell from '../shared/gy/GySliceShell.jsx';
import JiaozhengPanel from './JiaozhengPanel.jsx';
import './jiaozheng.css';

/**
 * 中国人群分析 · 社区矫正与刑释人员(GY-44)
 * 人群画像分层第四十二子集 · 与 GY-43 同构 · 解除隔离后的权限残留 / 前科作为持久标记
 */
export default function JiaozhengPage() {
  return (
    <GySliceShell
      badge="GY-44 · 人群画像分层"
      title="社区矫正与刑释人员"
      subtitle="解除隔离后的权限残留 · 前科作为持久标记"
      appId="jc-app"
      moduleId="jiaozheng"
      className="jiaozheng-page"
    >
      <JiaozhengPanel />
    </GySliceShell>
  );
}
