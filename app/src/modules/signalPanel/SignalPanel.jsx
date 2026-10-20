import { Link } from 'react-router-dom';
import { THREE_FORCES_ROUTE } from '../../domain/governance.ts';
import RegimeVerdict from './components/RegimeVerdict.jsx';
import SignalCard from './components/SignalCard.jsx';
import DecisionLanes from './components/DecisionLanes.jsx';
import { SIGNAL_SECTIONS } from './signals.seed.ts';
import { useSignalStore } from './useSignalStore.ts';
import './signal-panel.css';
import './signal-panel-v2.css';

export default function SignalPanel() {
  const { resolve, set, reset, overrides } = useSignalStore();
  const changedCount = Object.keys(overrides || {}).length;

  return (
    <div className="ink-observatory sp-wrap sp2">
      <p className="sp2-meta">
        口径 · 2026 政府工作报告 / 预算报告　标尺 · 《重构山河》第八章改革序列　判读 · {changedCount ? `含我的 ${changedCount} 处调整` : '系统基准'}
      </p>

      <div className="os-reveal-stagger">
        <RegimeVerdict resolve={resolve} />

        {SIGNAL_SECTIONS.map((sec) => (
          <section key={sec.tier} className="sp2-section">
            <header className="sp2-section__head">
              <span className="sp2-tier vi-figure">{sec.tier}</span>
              <div>
                <h2 className="vi-h2">{sec.title}</h2>
                <p>{sec.desc}</p>
              </div>
            </header>
            <div className="sp2-grid">
              {sec.signals.map((sig) => {
                const status = resolve(sig.id, sig.status);
                return (
                  <SignalCard
                    key={sig.id}
                    signal={sig}
                    status={status}
                    onSet={(next) => set(sig.id, next, sig.status)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <DecisionLanes resolve={resolve} />
      </div>

      <div className="sp-controls">
        <button type="button" className="os-btn" onClick={reset} disabled={!changedCount}>
          复位至基准判读
        </button>
        <span className="sp-hint">
          用每张卡右上角的 警 / 观 / 稳 设定你的判读，态势、天灯与首页判词实时重算，并保存在本机。
        </span>
      </div>

      <footer className="sp-foot">
        <b>读法</b>　A 档（元改革）是态势总开关：A 不动、仅 B/C 微调 = 治标买时间，取防御；A1 换锚或 C1
        平减指数连续转正 = 治本启动，方可转进攻。
        <br />
        <b>配对</b>　本仪表回答&quot;改没改&quot;；
        <Link to={THREE_FORCES_ROUTE}>三力监测仪</Link>
        回答&quot;何时会被迫改&quot;。信号灯长期无绿灯 + 三力持续升压 = 僵局正在积累代价。
        <br />
        <b>免责</b>　基于公开政策的结构性分析工具，非投资建议；个人仓位与负债决策需结合自身风险承受力与现金流，必要时咨询持牌顾问。
      </footer>
    </div>
  );
}
