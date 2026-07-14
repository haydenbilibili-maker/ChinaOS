import { Link } from 'react-router-dom';
import { SIGNAL_PANEL_ROUTE } from '../../domain/governance.ts';
import InvertedWarning from './components/InvertedWarning.jsx';
import ProximityVerdict from './components/ProximityVerdict.jsx';
import ForcePanels from './components/ForcePanels.jsx';
import BetSection from './components/BetSection.jsx';
import ExternalForceInputs from './components/ExternalForceInputs.jsx';
import { FORCES } from './forces.seed.ts';
import { useForceStore } from './useForceStore.ts';
import './three-forces.css';

export default function ThreeForcesMonitor() {
  const { resolve, cycle, reset } = useForceStore();

  return (
    <div className="ink-observatory tf-wrap">
      <header className="tf-masthead os-reveal">
        <div className="tf-brand">
          <span className="tf-glyph">ChinaOS</span>
          <h1>
            三力监测仪 <span>· 改革窗口的压力读数</span>
          </h1>
        </div>
        <div className="tf-meta">
          基准 · <b>2026-07</b>
          <br />
          模型 · 外部压力 / 内部危机 / 认知迭代
          <br />
          互补 · <Link to={SIGNAL_PANEL_ROUTE}>信号灯面板</Link>（&quot;改没改&quot;）
        </div>
      </header>

      <div className="os-reveal-stagger">
        <InvertedWarning />
        <ProximityVerdict resolve={resolve} />
        <ForcePanels forces={FORCES} resolve={resolve} onCycle={cycle} />
        <ExternalForceInputs dimension="internal_crisis" />
        <BetSection />
      </div>

      <div className="tf-controls">
        <button type="button" className="tf-btn" onClick={reset}>
          ↺ 复位至基准读数
        </button>
        <span className="tf-hint">
          点击任一指标可循环切换 沉寂 → 积蓄 → 逼近，窗口临近度将实时重算并本地保存。
        </span>
      </div>

      <footer className="tf-foot">
        <b>使用</b>　本仪表回答&quot;何时会被迫改&quot;，
        <Link to={SIGNAL_PANEL_ROUTE}>信号灯面板</Link>
        回答&quot;改没改&quot;。两者并用：信号灯长期无绿灯 + 三力持续升压 = 僵局正在积累代价。
        <br />
        <b>悖论</b>　注意每一力的&quot;悖论警告&quot;——三种力都可能反向作用（外部压力可能硬化集权、内部危机可能被慢性化消解、认知迭代可能永远不来）。压力升高≠改革必然发生。
        <br />
        <b>边界</b>　本工具基于公开政策文本与制度事实的结构性分析，不含高层&quot;内幕&quot;推测；它提供可争论的框架，不宣称掌握真相。
      </footer>
    </div>
  );
}
