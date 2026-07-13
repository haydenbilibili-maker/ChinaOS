import GySliceShell from '../shared/gy/GySliceShell.jsx';
import DanshenPanel from './DanshenPanel.jsx';
import './danshen.css';

/**
 * 中国人群分析 · 单身女性与不婚者:主动退出的常态化(GY-19)
 * 人群画像分层第十七子集 · 与 GY-18 残障同构 · 独立运行实例模型
 */
export default function DanshenPage() {
  return (
    <GySliceShell
      badge="GY-19 · 人群画像分层"
      title="单身女性与不婚者 · 主动退出的常态化"
      subtitle="独立运行实例 · 从默认服务解绑"
      appId="ds-app"
      moduleId="danshen"
      className="danshen-page"
    >
      <DanshenPanel />
    </GySliceShell>
  );
}
