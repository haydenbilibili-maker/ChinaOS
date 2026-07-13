import { NavLink } from 'react-router-dom';
import './heshan-theme.css';

/** 重构河山 · 四稿交叉导航 */
export const HESHAN_MODULES = [
  { id: 'reform', path: '/modules/heshan/reform', label: '重构山河', desc: '区划诊断 · 调整建议' },
  { id: 'factsheets', path: '/modules/heshan/factsheets', label: '新省图册', desc: '三十四份建省档案' },
  { id: 'fiscal', path: '/modules/heshan/fiscal', label: '财政沙盘', desc: '转移支付 · 减层 · 债务' },
  { id: 'calibration', path: '/modules/heshan/calibration', label: '数据校准', desc: '建省口径 · 可审计底表' },
];

export default function HeshanNav({ current }) {
  return (
    <nav
      className="heshan-nav os-card mb-6 flex flex-wrap gap-2 p-2"
      aria-label="重构河山系列导航"
    >
      {HESHAN_MODULES.map((m) => (
        <NavLink
          key={m.id}
          to={m.path}
          className={({ isActive }) => `heshan-nav__item rounded-lg px-3 py-2 text-xs no-underline transition-colors ${
            isActive || current === m.id ? 'is-active' : ''
          }`}
        >
          <span className="font-semibold block">{m.label}</span>
          <span className="opacity-70">{m.desc}</span>
        </NavLink>
      ))}
      <a
        href="/heshan/重构山河-行政区划改革白皮书-合订本.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="heshan-nav__item heshan-nav__pdf rounded-lg px-3 py-2 text-xs no-underline ml-auto"
      >
        <span className="font-semibold block">PDF 合订本</span>
        <span className="opacity-70">离线阅读 · 荒废斋</span>
      </a>
    </nav>
  );
}
