import { Link } from 'react-router-dom';
import { THREE_FORCES_ROUTE } from '../../domain/governance.ts';
import RegimeVerdict from './components/RegimeVerdict.jsx';
import SignalCard from './components/SignalCard.jsx';
import DecisionLanes from './components/DecisionLanes.jsx';
import { SIGNAL_SECTIONS } from './signals.seed.ts';
import { useSignalStore } from './useSignalStore.ts';
import './signal-panel.css';

export default function SignalPanel() {
  const { resolve, cycle, reset } = useSignalStore();

  return (
    <div className="ink-observatory sp-wrap">
      <header className="sp-masthead os-reveal">
        <div className="sp-brand">
          <span className="sp-glyph">ChinaOS</span>
          <h1>
            宏观再平衡信号灯 <span>· 超个体决策仪表盘</span>
          </h1>
        </div>
        <div className="sp-meta">
          基准 · <b>2026-07</b>
          <br />
          口径 · 2026 政府工作报告 / 预算报告
          <br />
          标尺 · 《重构山河》第八章改革序列
        </div>
      </header>

      <div className="os-reveal-stagger">
        <RegimeVerdict resolve={resolve} />

        {SIGNAL_SECTIONS.map((sec) => (
          <section key={sec.tier} className="sp-section os-reveal">
            <div className="sp-s-head">
              <span className="sp-tier">{sec.tier}</span>
              <h2>{sec.title}</h2>
              <span className="sp-desc">{sec.desc}</span>
            </div>
            <div className="sp-grid">
              {sec.signals.map((sig) => {
                const status = resolve(sig.id, sig.status);
                return (
                  <SignalCard
                    key={sig.id}
                    signal={sig}
                    status={status}
                    onCycle={() => cycle(sig.id, status)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <DecisionLanes resolve={resolve} />
      </div>

      <div className="sp-controls">
        <button type="button" className="sp-btn" onClick={reset}>
          ↺ 复位至基准读数
        </button>
        <span className="sp-hint">
          点击任一信号卡循环切换 红 → 琥珀 → 绿，态势与动作实时重算并本地保存。
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
