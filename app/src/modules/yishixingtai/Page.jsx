import { PageHeader } from '../../app/ui.jsx';
import YishixingtaiPanel from './YishixingtaiPanel.jsx';
import './yishixingtai.css';

/** 意识形态架构 GY-02 · 合法性机器 */
export default function YishixingtaiPage() {
  return (
    <div className="yishixingtai-page">
      <PageHeader
        badge="GY-02 · 意识形态分析"
        title="合法性机器"
        subtitle="五组件剖面 · 优先序仲裁 · 与 GY-01 国运推演双向耦合"
      />
      <YishixingtaiPanel />
    </div>
  );
}
