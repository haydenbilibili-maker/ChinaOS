import GySliceShell from '../shared/gy/GySliceShell.jsx';
import WangyuePanel from './WangyuePanel.jsx';
import './wangyue.css';

/**
 * 中国人群分析 · 网约车司机(GY-40)
 * 人群画像分层第三十八子集 · 与 GY-39 同构 · 竞价实例 / 算法定价的方向盘
 */
export default function WangyuePage() {
  return (
    <GySliceShell
      badge="GY-40 · 人群画像分层"
      title="网约车司机"
      subtitle="竞价实例 · 算法定价的方向盘"
      appId="wy-app"
      moduleId="wangyue"
      className="wangyue-page"
    >
      <WangyuePanel />
    </GySliceShell>
  );
}
