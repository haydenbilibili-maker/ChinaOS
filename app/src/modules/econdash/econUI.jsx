import React from 'react';

// ============================================================================
// 经济观测台 · 共享展示原子（Round2 产出，后续轮次复用，签名固定）
// ----------------------------------------------------------------------------
// 纯展示组件 + 设计语言常量，零数据、零随机、零副作用，全部 theme-aware。
// 蓝图四色语义：朱砂（收缩/通缩/背离/警示）、青（扩张/名义/好转）、
// 赭（区域/财政视角）、黛（宏观叙事视角）。视角 lens 三态：叙/域/双。
// 容器一律用 .os-card（自定义边框走 <div className="os-card" style={{...}}>，
// 绝不给 Card 组件传 style prop）。
// 声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

// —— 设计语言四色 + 中性槽位（ink/hair 走 CSS 变量随日夜切换）——
export const ECON_COLORS = {
  cinnabar: '#c44e3d', // 朱砂：收缩 / 通缩 / 背离 / 警示
  teal: '#62a89e', // 青：扩张 / 名义 / 好转
  ochre: '#c99a4e', // 赭：区域 / 财政视角
  indigo: '#8090c6', // 黛：宏观叙事视角
  ink: 'var(--bg-elevated)', // 卡面底
  hair: 'var(--border-subtle)', // 发丝线
};

// —— 视角 lens 三态元数据 ——
export const LENS_META = {
  叙: { label: '叙', colors: ['#8090c6'], desc: '宏观叙事视角' },
  域: { label: '域', colors: ['#c99a4e'], desc: '区域投资视角' },
  双: { label: '双', colors: ['#8090c6', '#c99a4e'], desc: '叙事×区域双视角' },
};

// 衬线标题字栈（无专用 CSS 变量，就地声明，保证 band-head 衬线观感）
const SERIF = "'Noto Serif SC', 'Songti SC', 'STSong', 'Source Han Serif SC', Georgia, 'Times New Roman', serif";

// —— signal 语义 → 颜色映射 ——
const SIGNAL_COLOR = {
  green: ECON_COLORS.teal,
  teal: ECON_COLORS.teal,
  amber: ECON_COLORS.ochre,
  red: ECON_COLORS.cinnabar,
  cinnabar: ECON_COLORS.cinnabar,
};

/**
 * LensChip — 视角徽章：按 LENS_META.colors 渲染 1~2 个小方点 + mono 文字。
 * @param {{ lens: '叙'|'域'|'双' }} props
 */
export function LensChip({ lens }) {
  const meta = LENS_META[lens] || LENS_META.叙;
  return (
    <span
      className="inline-flex items-center gap-1.5 mono text-[10px] px-1.5 py-0.5 rounded"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
      title={meta.desc}
    >
      <span className="inline-flex items-center gap-0.5">
        {meta.colors.map((c, i) => (
          <span
            key={i}
            style={{ width: 6, height: 6, borderRadius: 1, background: c, display: 'inline-block' }}
          />
        ))}
      </span>
      {meta.label}
    </span>
  );
}

/**
 * BandHead — 标题区：编号(mono) + 衬线标题 + flex 横线（en 可选小字）。
 * @param {{ n?: string|number, title: string, en?: string }} props
 */
export function BandHead({ n, title, en }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      {n != null && (
        <span className="mono text-xs font-semibold shrink-0" style={{ color: ECON_COLORS.cinnabar }}>
          {n}
        </span>
      )}
      <h3
        className="text-base font-semibold shrink-0 leading-tight"
        style={{ fontFamily: SERIF, color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      {en && (
        <span className="mono text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>
          {en}
        </span>
      )}
      <span
        className="flex-1 self-center"
        style={{ height: 1, background: 'var(--border-subtle)', minWidth: 16 }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Sparkline — 纯 SVG 折线（无依赖）。points 线性归一化到 viewBox，
 * y 轴翻转（值大在上）；zero=true 画一条零轴虚线（仅当数据跨零时可见）。
 * @param {{ points?: number[], color?: string, zero?: boolean, width?: number, height?: number }} props
 */
export function Sparkline({ points, color = '#62a89e', zero = false, width = 120, height = 30 }) {
  const pts = Array.isArray(points) ? points.filter((p) => typeof p === 'number' && isFinite(p)) : [];
  const pad = 3;
  if (pts.length === 0) {
    return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="sparkline 无数据" />;
  }

  let min = Math.min(...pts);
  let max = Math.max(...pts);
  if (zero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  const span = max - min || 1; // 防 0 除
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);

  // 值大在上：y 翻转
  const mapY = (v) => pad + (1 - (v - min) / span) * innerH;
  const mapX = (i) => (pts.length === 1 ? width / 2 : pad + (i / (pts.length - 1)) * innerW);

  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${mapX(i).toFixed(2)},${mapY(v).toFixed(2)}`).join(' ');
  const lastX = mapX(pts.length - 1);
  const lastY = mapY(pts[pts.length - 1]);
  const zeroInRange = zero && min <= 0 && max >= 0;
  const zeroY = mapY(0);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="sparkline">
      {zeroInRange && (
        <line
          x1={pad}
          y1={zeroY}
          x2={width - pad}
          y2={zeroY}
          stroke="var(--border-subtle)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
}

/**
 * SignalDot — 语义信号圆点。
 * green/teal→青系，amber→赭，red/cinnabar→朱砂。
 * @param {{ signal?: 'green'|'amber'|'red'|'teal'|'cinnabar' }} props
 */
export function SignalDot({ signal }) {
  const color = SIGNAL_COLOR[signal] || 'var(--text-tertiary)';
  return (
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        boxShadow: `0 0 6px ${color}88`,
      }}
      aria-label={`信号 ${signal || '无'}`}
    />
  );
}

/**
 * TensionBar — 左右对冲张力条（左黛右朱砂，宽度按 left/right%）。
 * left/right 为相对权重，内部自动归一化。
 * @param {{ left?: number, right?: number, leftColor?: string, rightColor?: string }} props
 */
export function TensionBar({
  left = 50,
  right = 50,
  leftColor = ECON_COLORS.indigo,
  rightColor = ECON_COLORS.cinnabar,
}) {
  const l = Math.max(0, Number(left) || 0);
  const r = Math.max(0, Number(right) || 0);
  const total = l + r || 1;
  const lPct = (l / total) * 100;
  const rPct = (r / total) * 100;
  return (
    <div
      className="flex w-full overflow-hidden rounded-full"
      style={{ height: 6, background: 'var(--bg-elevated)' }}
      role="img"
      aria-label={`张力 ${Math.round(lPct)}:${Math.round(rPct)}`}
    >
      <span style={{ width: `${lPct}%`, background: leftColor, display: 'block' }} />
      <span style={{ width: `${rPct}%`, background: rightColor, display: 'block' }} />
    </div>
  );
}

/**
 * Meter — 0~100 渐变进度条（默认赭→朱砂）。
 * @param {{ value?: number, from?: string, to?: string }} props
 */
export function Meter({ value = 50, from = ECON_COLORS.ochre, to = ECON_COLORS.cinnabar }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      role="img"
      aria-label={`读数 ${Math.round(v)}/100`}
    >
      <span
        style={{
          width: `${v}%`,
          height: '100%',
          display: 'block',
          background: `linear-gradient(90deg, ${from}, ${to})`,
        }}
      />
    </div>
  );
}

/**
 * GaugeCard — 蓝图 headline gauge 卡。
 * label + sub 小字 + Sparkline + 底部 source·freq meta + 可选 latest 大数 + signal 点（右上角）。
 * @param {{
 *   label: string, sub?: string, points?: number[], color?: string,
 *   signal?: 'green'|'amber'|'red'|'teal'|'cinnabar', source?: string,
 *   freq?: string, note?: string, latest?: string|number
 * }} props
 */
export function GaugeCard({ label, sub, points, color = ECON_COLORS.teal, signal, source, freq, note, latest }) {
  const metaBits = [source, freq].filter(Boolean);
  return (
    <div className="os-card p-4" style={{ position: 'relative' }}>
      {signal && (
        <span style={{ position: 'absolute', top: 12, right: 12 }}>
          <SignalDot signal={signal} />
        </span>
      )}
      <div className="text-sm font-semibold leading-tight pr-5" style={{ color: 'var(--text-primary)' }}>
        {label}
      </div>
      {sub && (
        <div className="text-[11px] leading-snug mt-0.5 pr-5" style={{ color: 'var(--text-tertiary)' }}>
          {sub}
        </div>
      )}

      {latest != null && (
        <div className="mono text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
          {latest}
        </div>
      )}

      <div className="mt-2">
        <Sparkline points={points} color={color} width={180} height={34} />
      </div>

      {note && (
        <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
          {note}
        </p>
      )}

      {metaBits.length > 0 && (
        <div
          className="mono text-[10px] mt-2 pt-2 flex items-center gap-1.5 flex-wrap"
          style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}
        >
          {metaBits.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--border-subtle)' }}>·</span>}
              <span>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
