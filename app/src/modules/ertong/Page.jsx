import GySliceShell from '../shared/gy/GySliceShell.jsx';
import ErtongPanel from './ErtongPanel.jsx';
import './ertong.css';

/**
 * 中国人群分析 · 流动与留守儿童(GY-54)
 * 人群画像分层第五十二子集 · 与 GY-53 同构
 * 注记:涉未成年人,以儿童权益与发展视角处理,
 * 聚焦监护、教育、关爱保护制度,不渲染苦难、不制造恐慌、不将儿童问题化,
 * 强调关爱保护体系的进展与儿童作为权利主体。
 */
export default function ErtongPage() {
  return (
    <GySliceShell
      badge="GY-54 · 人群画像分层"
      title="流动与留守儿童"
      subtitle="亲代进程缺失/迁移的子进程 · 监护链断裂或受限"
      appId="et-app"
      moduleId="ertong"
      className="ertong-page"
    >
      <ErtongPanel />
    </GySliceShell>
  );
}
