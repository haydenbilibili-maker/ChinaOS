import { PageHeader } from '../../app/ui.jsx';
import QingnianPanel from './QingnianPanel.jsx';
import './qingnian.css';

/**
 * 中国人群分析 · 青年（GY-03）
 * 后续同组模块：老年、中产等 → app/src/modules/{slug}/ + group: population
 */
export default function QingnianPage() {
  return (
    <div className="qingnian-page">
      <PageHeader
        badge="GY-03 · 世代研究"
        title="青年"
        subtitle="机器的盲区 · 概率的暗物质 · 与 GY-01/GY-02 双向耦合"
      />
      <QingnianPanel />
    </div>
  );
}
