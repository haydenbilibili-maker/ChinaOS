import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import ChroniclePanel from './ChroniclePanel.jsx';

/** @deprecated 请使用国运模拟器 /modules/guoyun?tab=timeline */
export default function ChroniclePage() {
  return (
    <div>
      <PageHeader
        badge="国运 · 时间轴"
        title="国运时间轴谱系"
        subtitle="1949→2026 · 七个时代 × 六域大事记 · 路径依赖底片"
      />
      <ChroniclePanel />
    </div>
  );
}
