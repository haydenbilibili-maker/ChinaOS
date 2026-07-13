import GySliceShell from '../shared/gy/GySliceShell.jsx';
import BaoxianPanel from './BaoxianPanel.jsx';
import './baoxian.css';

/**
 * 中国人群分析 · 保险代理与直销末梢(GY-41)
 * 人群画像分层第三十九子集 · 与 GY-40 同构 · 增员制的进程树 / 自我繁殖与坍缩
 */
export default function BaoxianPage() {
  return (
    <GySliceShell
      badge="GY-41 · 人群画像分层"
      title="保险代理与直销末梢"
      subtitle="增员制的进程树 · 自我繁殖与坍缩"
      appId="bx-app"
      moduleId="baoxian"
      className="baoxian-page"
    >
      <BaoxianPanel />
    </GySliceShell>
  );
}
