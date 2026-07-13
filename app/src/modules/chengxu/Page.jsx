import GySliceShell from '../shared/gy/GySliceShell.jsx';
import ChengxuPanel from './ChengxuPanel.jsx';
import './chengxu.css';

/**
 * 中国人群分析 · 程序员与大厂白领(GY-28)
 * 人群画像分层第二十六子集 · 与 GY-27 同构 · 自我弃用的进程模型
 */
export default function ChengxuPage() {
  return (
    <GySliceShell
      badge="GY-28 · 人群画像分层"
      title="程序员与大厂白领"
      subtitle="自我弃用的进程 · 写自己 deprecation 的人"
      appId="cx-app"
      moduleId="chengxu"
      className="chengxu-page"
    >
      <ChengxuPanel />
    </GySliceShell>
  );
}
