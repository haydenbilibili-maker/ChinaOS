import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { getTheme, subscribeTheme } from '../../lib/theme.js';
import { usFlagBlue, usFlagBlueAlpha } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { DOMAINS, TIER_LABEL } from './domains.js';
import { TECH_AS_OF, CHAIN_OF, NECK_ITEMS, MILESTONES, SCORECARD, DEPENDS, propagateRisk, simTech, buildTechReport } from './techDeep.js';

// ============================================================================
// 科技树作战盘 · 12 大战略科技领域（作战地图版）
// ----------------------------------------------------------------------------
// 数据层：./domains.js（被博弈桌 wargameData 派生，结构不动）
//        ./techDeep.js（供应链断点 / 卡脖子清单 / 里程碑 / 记分牌 / 推演引擎）
// 页面结构：
//   0  PageHeader + IntroCard（位势→断点→投入→时间）+ Stat×4
//   ①  TRL × 自主度矩阵 + 战略权重排序（双图并排）
//   ②  领域作战室：雷达 + 战略判读 + 供应链断点条 + 卡脖子清单 + 里程碑
//      + 域间依赖图（断点传导网络：circular graph + propagateRisk 注记，点节点切域）
//   ③  攻关推演模拟器：三滑杆 → 十年自主度曲线（突破线 / 断供冲击 / 突破年）
//      当前域方案实时回写账本 'cos-tech-plans'（博弈桌『自主攻关』按方案动态加权）
//   ④  中美记分牌：六维双向条
//   ⑤  全库卡脖子总表：12 域平铺 · severity 降序 · tier 筛选
//   ⑥  攻关推演报告：buildTechReport → Markdown 复制
//   ♟  博弈桌攻关回执（保留原实现）→ FrameworkTrio → ModuleFooter
// 铁律：零随机、零当前时间——所有数值为确定性常量与纯函数推演。
// 口径：全部数值为「公开信息梳理 + 示意标定」，非预测、非投资建议。
// 配色：#c41e3a(红/受制) #22d3ee(青/追赶) #e8a317(金/攻坚) #10b981(绿/领先)
// ============================================================================

// tier: lead 领先梯队 / chase 并跑追赶 / locked 受制卡脖子
const TIER_COLOR = { lead: '#10b981', chase: '#22d3ee', locked: '#c41e3a' };

// 卡脖子严重度：3 重度（硬卡点）/ 2 中度 / 1 轻度
const SEV_META = {
  3: { label: '重度', color: '#c41e3a' },
  2: { label: '中度', color: '#e8a317' },
  1: { label: '轻度', color: '#64748b' },
};

// 供应链节点自主度 → 颜色：<45 红（断点）/ <70 金（薄弱）/ ≥70 绿（可控）
const chainColor = (auto) => (auto < 45 ? '#c41e3a' : auto < 70 ? '#e8a317' : '#10b981');

// 雷达维度：自主可控 / 工程化 / 人才储备 / 产业生态 / 投资强度
const RADAR_IND = [
  { name: '自主可控', max: 100 },
  { name: '工程化', max: 100 },
  { name: '人才储备', max: 100 },
  { name: '产业生态', max: 100 },
  { name: '投资强度', max: 100 },
];

// 五角星 symbol path（ECharts 无内置 star，用于突破年 markPoint）
const STAR_PATH = 'path://M150 0 L179 90 L274 90 L197 146 L226 236 L150 180 L74 236 L103 146 L26 90 L121 90 Z';

// ---- ① 全领域 TRL × 自主度 散点矩阵（一眼看卡脖子）----
const scatterOption = {
  grid: { left: 56, right: 28, top: 28, bottom: 44 },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
    formatter: (p) => `${p.data.name}<br/>TRL ${p.data.value[0]} · 自主度 ${p.data.value[1]}%<br/>分层：${TIER_LABEL[p.data.tier]}`,
  },
  xAxis: {
    type: 'value', name: 'TRL 成熟度', min: 2, max: 9, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  yAxis: {
    type: 'value', name: '自主度 %', min: 30, max: 100, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  series: [{
    type: 'scatter',
    symbolSize: (v) => 14 + v[2] * 0.22,
    data: DOMAINS.map((d) => ({
      name: d.name, value: [d.trl, d.auto, d.weight], tier: d.tier,
      itemStyle: { color: TIER_COLOR[d.tier], opacity: 0.85, borderColor: 'rgba(255,255,255,0.25)', borderWidth: 1 },
    })),
    label: {
      show: true, position: 'top', formatter: (p) => p.data.name, fontSize: 10, color: '#93a1b5',
    },
    markArea: {
      silent: true,
      itemStyle: { color: 'rgba(196,30,58,0.06)' },
      data: [[{ xAxis: 2, yAxis: 30 }, { xAxis: 6, yAxis: 60 }]],
    },
  }],
};

// ---- ① 全领域战略权重条形 ----
const sortedByWeight = [...DOMAINS].sort((a, b) => a.weight - b.weight);
const weightOption = {
  grid: { left: 110, right: 40, top: 12, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' } },
  xAxis: { type: 'value', max: 100, name: '战略权重', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
  yAxis: { type: 'category', data: sortedByWeight.map((d) => d.name), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 13,
    data: sortedByWeight.map((d) => ({ value: d.weight, itemStyle: { color: TIER_COLOR[d.tier], borderRadius: [0, 3, 3, 0] } })),
    label: { show: true, position: 'right', formatter: '{c}', color: '#93a1b5', fontSize: 10 },
  }],
};

// ---- Stat 派生（全部为构建期常量，确定性）----
const cnt = (t) => DOMAINS.filter((d) => d.tier === t).length;
const avgAuto = Math.round(DOMAINS.reduce((s, d) => s + d.auto, 0) / DOMAINS.length);
const avgTrl = (DOMAINS.reduce((s, d) => s + d.trl, 0) / DOMAINS.length).toFixed(1);

// 全库卡脖子平铺行：{domain, tier, weight, item, severity, alt}
const ALL_NECK_ROWS = DOMAINS.flatMap((d) =>
  (NECK_ITEMS[d.k] || []).map((n) => ({
    k: d.k, domain: d.name, tier: d.tier, weight: d.weight,
    item: n.item, severity: n.severity, alt: n.alt,
  }))
).sort((a, b) => (b.severity - a.severity) || (b.weight - a.weight));

// 全库硬卡点（severity=3）总数
const HARD_TOTAL = ALL_NECK_ROWS.filter((r) => r.severity === 3).length;

// 记分牌均值（一句总评用）
const scoreCnAvg = Math.round(SCORECARD.reduce((s, r) => s + r.cn, 0) / (SCORECARD.length || 1));
const scoreUsAvg = Math.round(SCORECARD.reduce((s, r) => s + r.us, 0) / (SCORECARD.length || 1));

// ---- ♟ 博弈桌攻关回执：只读博弈桌对局存档（写入方在 /wargame）----
const WARGAME_RUNS_KEY = 'cos-wargame-runs';

/** 读档：解析失败 / 结构异常一律降级为空数组（与博弈桌读档同约定，最多取 6 行） */
function readWargameRuns() {
  try {
    const arr = JSON.parse(localStorage.getItem(WARGAME_RUNS_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.filter((r) => r && typeof r === 'object' && r.judge && r.final).slice(0, 6);
  } catch {
    return [];
  }
}

/** 攻关线 id → 领域名：新档 id 即 DOMAINS.k；旧档（litho/soft/aero 等）原样显示 id */
function trackLabelOf(id) {
  if (!id) return '—';
  const d = DOMAINS.find((x) => x.k === id);
  return d ? d.name : String(id);
}

// ---- ③ 攻关方案账本：本页为唯一写入方（博弈桌『自主攻关』为读取方）----
// 契约：{ plans: { [k]: { rd, talent, open, breakthrough, auto2030 } }, stamp: 整数递增 }
const TECH_PLANS_KEY = 'cos-tech-plans';

// ---- ② 域间依赖图：k → 领域名 / 被依赖次数（入度，决定节点大小 8 + n*4）----
const DOMAIN_NAME_OF = Object.fromEntries(DOMAINS.map((d) => [d.k, d.name]));
const IN_DEGREE = Object.fromEntries(
  DOMAINS.map((d) => [d.k, DEPENDS.filter((e) => e.to === d.k).length])
);

// 传导风险边级描述 → 颜色（与 SEV_META 同语义梯度）
const DEP_SEV_COLOR = { 重度传导: '#c41e3a', 中度传导: '#e8a317', 轻度传导: '#64748b' };

/** ② 域间依赖图 option：circular 布局（铁律禁 force——其布局含随机性） */
function buildDependsOption(sel) {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
      formatter: (p) => {
        if (p.dataType === 'edge') {
          return `${p.data.fromName} 依赖 ${p.data.toName}<br/>${p.data.note}（强度 ${p.data.strength}）`;
        }
        return `${p.data.name}<br/>被依赖 ${p.data.inDeg} 次 · ${TIER_LABEL[p.data.tier]}${p.data.k === sel ? '<br/>当前选中域' : ''}`;
      },
    },
    series: [{
      type: 'graph',
      layout: 'circular',
      circular: { rotateLabel: false },
      roam: false,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 7,
      emphasis: { focus: 'adjacency' },
      data: DOMAINS.map((d) => ({
        name: d.name, k: d.k, tier: d.tier, inDeg: IN_DEGREE[d.k],
        symbolSize: 8 + IN_DEGREE[d.k] * 4,
        itemStyle: {
          color: TIER_COLOR[d.tier],
          borderColor: d.k === sel ? '#e8a317' : 'rgba(255,255,255,0.2)',
          borderWidth: d.k === sel ? 3 : 1,
        },
        label: {
          show: true, fontSize: 10,
          color: d.k === sel ? '#e8a317' : '#93a1b5',
          fontWeight: d.k === sel ? 'bold' : 'normal',
        },
      })),
      links: DEPENDS.map((e) => {
        const isOut = e.from === sel; // 选中域的出边=它的上游依赖，红色高亮
        return {
          source: DOMAIN_NAME_OF[e.from], target: DOMAIN_NAME_OF[e.to],
          fromName: DOMAIN_NAME_OF[e.from], toName: DOMAIN_NAME_OF[e.to],
          note: e.note, strength: e.strength,
          lineStyle: {
            color: isOut ? '#c41e3a' : 'rgba(148,163,184,0.3)',
            width: isOut ? e.strength * 1.6 : e.strength,
            opacity: isOut ? 0.95 : 0.45,
            curveness: 0.22,
          },
          label: isOut
            ? { show: true, formatter: e.note, fontSize: 9, color: '#c41e3a' }
            : { show: false },
        };
      }),
    }],
  };
}

// ============================================================================
// 子组件
// ============================================================================

/** 严重度徽章：重度红 / 中度金 / 轻度灰 */
function SevBadge({ severity }) {
  const m = SEV_META[severity] || SEV_META[1];
  return (
    <span
      className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
      style={{ background: `${m.color}1f`, color: m.color, border: `1px solid ${m.color}55` }}
    >{m.label}</span>
  );
}

/** 供应链断点条：五节点横向链（上游→下游），纯 div/flex 实现 */
function ChainStrip({ chain }) {
  if (!chain || chain.length === 0) {
    return <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>该领域链路数据待补。</p>;
  }
  return (
    <div className="flex items-start" style={{ gap: 0 }}>
      {chain.map((node, i) => {
        const c = chainColor(node.auto);
        return (
          <React.Fragment key={node.node}>
            {i > 0 && (
              <div className="flex-1 self-start" style={{ paddingTop: 17, minWidth: 12 }}>
                <div style={{ height: 2, background: 'rgba(148,163,184,0.22)' }} />
              </div>
            )}
            <div className="flex flex-col items-center text-center" style={{ width: 86 }} title={node.note}>
              <div
                className="rounded-full flex items-center justify-center mono font-bold"
                style={{
                  width: 36, height: 36, fontSize: 11,
                  background: `${c}1f`, color: c, border: `2px solid ${c}`,
                }}
              >{node.auto}</div>
              <div className="text-[11px] mt-1.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>{node.node}</div>
              <div className="text-[10px] mono" style={{ color: c }}>{node.auto}%</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/** 卡脖子清单表（单域）：severity 徽章 + item + alt 替代路线 */
function NeckList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>该领域无登记卡点——不等于无风险，仅口径内未列。</p>;
  }
  return (
    <div className="space-y-1.5">
      {items.map((n) => (
        <div key={n.item} className="flex items-start gap-2 text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
          <span className="pt-0.5"><SevBadge severity={n.severity} /></span>
          <div className="min-w-0">
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{n.item}</div>
            <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>替代路线：{n.alt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** 里程碑时间线（单域）：三节点横排，year + event */
function MilestoneStrip({ items, accent }) {
  if (!items || items.length === 0) {
    return <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>该领域里程碑待补。</p>;
  }
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((m, i) => (
        <div key={`${m.year}-${i}`} className="relative">
          <div className="flex items-center mb-1.5">
            <div className="rounded-full shrink-0" style={{ width: 9, height: 9, background: accent, border: '2px solid rgba(255,255,255,0.25)' }} />
            {i < items.length - 1 && <div className="flex-1" style={{ height: 2, background: 'rgba(148,163,184,0.18)' }} />}
          </div>
          <div className="text-xs mono font-bold" style={{ color: accent }}>{m.year}</div>
          <p className="text-[11px] leading-relaxed mt-0.5 pr-2" style={{ color: 'var(--text-secondary)' }}>{m.event}</p>
        </div>
      ))}
    </div>
  );
}

/** 推演滑杆：标签 + 数值 + range 输入 + 机理小字 */
function LeverSlider({ label, value, onChange, accent, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span className="text-xs mono font-bold" style={{ color: accent }}>{value}</span>
      </div>
      <input
        type="range" min="0" max="100" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: accent }}
      />
      <p className="text-[10px] leading-relaxed mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>
    </div>
  );
}

/** 记分牌单行：cn 左红 / us 右蓝，居中对称双向条 */
function ScoreRow({ row, usBlue, usBlueFade }) {
  return (
    <div className="py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs mono shrink-0 text-right" style={{ width: 96, color: 'var(--text-primary)' }}>{row.dim}</span>
        {/* 左半：中国（右对齐向中轴生长） */}
        <div className="flex-1 flex items-center justify-end gap-1.5">
          <span className="text-[10px] mono" style={{ color: '#c41e3a' }}>{row.cn}</span>
          <div className="rounded-l" style={{ width: `${row.cn * 0.9}%`, maxWidth: '92%', height: 12, background: 'linear-gradient(90deg, rgba(196,30,58,0.35), #c41e3a)' }} />
        </div>
        {/* 中轴 */}
        <div className="shrink-0" style={{ width: 2, height: 18, background: 'rgba(148,163,184,0.4)' }} />
        {/* 右半：美国（左对齐向外生长） */}
        <div className="flex-1 flex items-center gap-1.5">
          <div className="rounded-r" style={{ width: `${row.us * 0.9}%`, maxWidth: '92%', height: 12, background: `linear-gradient(90deg, ${usBlue}, ${usBlueFade})` }} />
          <span className="text-[10px] mono" style={{ color: usBlue }}>{row.us}</span>
        </div>
      </div>
      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)', paddingLeft: 104 }}>{row.note}</p>
    </div>
  );
}

// ---- ③ 攻关推演曲线 option 构造（纯函数，依赖 sim 结果与领域色）----
function buildSimOption(d, sim) {
  const years = sim.path.map((p) => String(p.year));
  const lineColor = TIER_COLOR[d.tier];
  const autoAt = (year) => {
    const p = sim.path.find((x) => x.year === year);
    return p ? p.auto : null;
  };

  // 断供冲击 markPoint（红 pin）
  const shockPoints = (sim.shocks || [])
    .filter((s) => autoAt(s.year) != null)
    .map((s) => ({
      name: s.label || '断供冲击',
      coord: [String(s.year), autoAt(s.year)],
      symbol: 'pin', symbolSize: 34,
      itemStyle: { color: '#c41e3a' },
      label: { show: true, formatter: () => `-${s.hit}`, color: '#fff', fontSize: 9 },
    }));

  // 突破年 markPoint（金星）
  const breakPoints = (sim.breakthrough && autoAt(sim.breakthrough) != null)
    ? [{
        name: '突破',
        coord: [String(sim.breakthrough), autoAt(sim.breakthrough)],
        symbol: STAR_PATH, symbolSize: 20,
        itemStyle: { color: '#e8a317' },
        label: { show: true, position: 'top', formatter: '突破', color: '#e8a317', fontSize: 10, fontWeight: 'bold' },
      }]
    : [];

  return {
    grid: { left: 44, right: 24, top: 32, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
      formatter: (ps) => {
        const p = ps[0];
        return `${p.axisValue} 年<br/>推演自主度 ${p.data}%`;
      },
    },
    xAxis: {
      type: 'category', data: years,
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 },
    },
    yAxis: {
      type: 'value', min: 20, max: 100, name: '自主度 %', nameTextStyle: { color: '#5b6a82' },
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    },
    series: [{
      type: 'line', data: sim.path.map((p) => p.auto),
      smooth: true, symbol: 'circle', symbolSize: 5,
      lineStyle: { color: lineColor, width: 2.5 },
      itemStyle: { color: lineColor },
      areaStyle: { color: `${lineColor}14` },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#e8a317', type: 'dashed', width: 1.5 },
        label: { color: '#e8a317', fontSize: 10, formatter: '突破线 85' },
        data: [{ yAxis: 85 }],
      },
      markPoint: { data: [...shockPoints, ...breakPoints] },
    }],
  };
}

// ⑤ 总表 tier 筛选 chips
const TIER_FILTERS = [
  { k: 'all', label: '全部', accent: '#e8a317' },
  { k: 'locked', label: '受制', accent: '#c41e3a' },
  { k: 'chase', label: '并跑', accent: '#22d3ee' },
  { k: 'lead', label: '领先', accent: '#10b981' },
];

// ============================================================================
// 主组件
// ============================================================================
export default function Page() {
  const [sel, setSel] = useState('ai');
  const d = DOMAINS.find((x) => x.k === sel);

  const [theme, setTheme] = useState(getTheme);
  useEffect(() => subscribeTheme(setTheme), []);
  const usBlue = usFlagBlue(theme);
  const usBlueFade = usFlagBlueAlpha(theme, 0.35);
  const usBlueSoft = usFlagBlueAlpha(theme, 0.08);

  // ③ 推演滑杆：研发投入强度 / 人才引进力度 / 开放合作度（默认 60/50/40）
  const [rd, setRd] = useState(60);
  const [talent, setTalent] = useState(50);
  const [open, setOpen] = useState(40);

  // ⑤ 总表筛选
  const [tierFilter, setTierFilter] = useState('all');

  // ⑥ 报告
  const [report, setReport] = useState('');
  const [copied, setCopied] = useState(false);

  // ♟ 博弈桌存档：双监听（storage 跨标签页 + cos-ledger-change 本页内）
  const [wgRuns, setWgRuns] = useState(readWargameRuns);
  useEffect(() => {
    const sync = () => setWgRuns(readWargameRuns());
    window.addEventListener('storage', sync);
    window.addEventListener('cos-ledger-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cos-ledger-change', sync);
    };
  }, []);

  // 切换领域：清空旧报告（避免报告与当前选中域错位）
  useEffect(() => {
    setReport('');
    setCopied(false);
  }, [sel]);

  // ③ 推演：纯函数，确定性（同输入恒同输出）
  const sim = useMemo(() => simTech({ k: sel, rd, talent, open }), [sel, rd, talent, open]);
  const simOption = useMemo(() => buildSimOption(d, sim), [d, sim]);
  const auto2030 = useMemo(() => {
    const p = sim.path.find((x) => x.year === 2030);
    return p ? p.auto : sim.path[Math.min(4, sim.path.length - 1)]?.auto ?? '—';
  }, [sim]);

  // ③→账本：当前域攻关方案回写 'cos-tech-plans'（合并保留其他域方案）
  // 防循环：useRef 记住上次写入的 (域|方案) JSON + 与账本现值 JSON 比对，相同即跳过
  const planWrittenRef = useRef('');
  useEffect(() => {
    try {
      const p2030 = sim.path.find((x) => x.year === 2030);
      const plan = {
        rd, talent, open,
        breakthrough: sim.breakthrough, // 年份 | null
        auto2030: p2030 ? Math.round(p2030.auto * 10) / 10 : 0, // 2030 推演自主度（1 位小数）
      };
      const nextJson = JSON.stringify(plan);
      const guard = `${sel}|${nextJson}`;
      if (planWrittenRef.current === guard) return;

      // 坏档降级：解析失败 / 结构异常一律按空账本重建
      let ledger = null;
      try { ledger = JSON.parse(localStorage.getItem(TECH_PLANS_KEY) || 'null'); } catch { ledger = null; }
      const plans = ledger && typeof ledger === 'object' && ledger.plans && typeof ledger.plans === 'object'
        ? ledger.plans : {};
      if (JSON.stringify(plans[sel] ?? null) === nextJson) {
        planWrittenRef.current = guard;
        return;
      }

      const stamp = Number.isFinite(Number(ledger?.stamp)) ? Math.floor(Number(ledger.stamp)) + 1 : 1;
      localStorage.setItem(TECH_PLANS_KEY, JSON.stringify({ plans: { ...plans, [sel]: plan }, stamp }));
      planWrittenRef.current = guard;
      window.dispatchEvent(new CustomEvent('cos-ledger-change', { detail: { key: TECH_PLANS_KEY } }));
    } catch {
      // localStorage 不可用（隐私模式等）：静默降级，页面功能不受影响
    }
  }, [sel, rd, talent, open, sim]);

  // ② 域间依赖图：传导风险（纯函数）+ graph option（选中域高亮）
  const depRisk = useMemo(() => propagateRisk(sel), [sel]);
  const dependsOption = useMemo(() => buildDependsOption(sel), [sel]);
  // EChart 封装无 onEvents prop，但暴露 onReady(chart)——直接挂原生 click 事件；
  // setSel 为 useState setter（引用稳定），只在挂载时绑定一次即可
  const onDependsReady = (chart) => {
    chart.on('click', (params) => {
      if (params.dataType === 'node' && params.data && params.data.k) setSel(params.data.k);
    });
  };

  // ② 选中域深度数据
  const chain = CHAIN_OF[sel] || [];
  const necks = NECK_ITEMS[sel] || [];
  const miles = MILESTONES[sel] || [];

  // ⑤ 总表筛选行 + 当前口径硬卡点数
  const filteredRows = useMemo(
    () => (tierFilter === 'all' ? ALL_NECK_ROWS : ALL_NECK_ROWS.filter((r) => r.tier === tierFilter)),
    [tierFilter]
  );
  const filteredHard = filteredRows.filter((r) => r.severity === 3).length;

  // ② 雷达 option（依赖选中域 + 主题）
  const radarOption = useMemo(() => ({
    legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
    radar: {
      indicator: RADAR_IND, axisName: { color: '#93a1b5', fontSize: 11 }, radius: '62%',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(148,163,184,0.03)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: [{
      type: 'radar',
      data: [
        { value: d.radar, name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' }, itemStyle: { color: '#c41e3a' } },
        // 美国基线以「能力位势」近似映射到五维（示意）
        { value: RADAR_IND.map(() => d.us), name: '美国', lineStyle: { color: usBlue, type: 'dashed' }, areaStyle: { color: usBlueSoft }, itemStyle: { color: usBlue } },
      ],
    }],
  }), [d, usBlue, usBlueSoft]);

  // ⑥ 生成报告（当前选中域 + 滑杆值 + sim 结果）
  const genReport = () => {
    setReport(buildTechReport({ domain: d, levers: { rd, talent, open }, sim }));
    setCopied(false);
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div>
      {/* ================= 0 · 页头 + 导读 + 四指标 ================= */}
      <PageHeader
        badge="Tech Tree · 科技作战盘"
        title="科技树作战盘"
        subtitle={`12 大战略科技领域 · 位势 → 断点 → 投入 → 时间 —— 一张作战地图回答四个问题 · 基准 ${TECH_AS_OF}`}
      />

      <IntroCard>
        科技图谱不是排行榜，是<strong style={{ color: 'var(--text-primary)' }}>作战地图</strong>——它必须连续回答四个问题：
        <strong style={{ color: '#e8a317' }}>位势</strong>（我在哪：TRL × 自主度 × 中美相对差，①②），
        <strong style={{ color: '#c41e3a' }}>断点</strong>（卡在哪：供应链五节点哪一环 &lt;45%，谁是 severity 3 硬卡点，②⑤），
        <strong style={{ color: '#22d3ee' }}>投入</strong>（往哪压：研发 / 人才 / 开放三根杠杆怎么配，③），
        <strong style={{ color: '#10b981' }}>时间</strong>（几年见效：自主度何时穿越 85 突破线，断供冲击落在哪一年，③④）。
        四个问题答完，一个领域才算「看清」——
        <span style={{ color: '#10b981' }}> 绿=领先梯队</span>守扩护城河、
        <span style={{ color: '#22d3ee' }}> 青=并跑追赶</span>以工程化反超、
        <span style={{ color: '#c41e3a' }}> 红=受制卡脖子</span>守防御带等换道窗口。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="12" label={`战略科技领域 · 均 TRL ${avgTrl}`} accent="#e8a317" />
        <Stat value={cnt('locked')} label="受制卡脖子(领域)" accent="#c41e3a" />
        <Stat value={HARD_TOTAL} label="全库硬卡点(severity 3)" accent="#c41e3a" />
        <Stat value={`${avgAuto}%`} label="平均自主度(12 域)" accent="#22d3ee" />
      </StatGrid>

      {/* ================= ① 矩阵 + 权重排序 ================= */}
      <Grid cols={2} className="mb-6">
        <Card title="① 全领域 TRL × 自主度矩阵（左下红区=卡脖子 · 气泡=战略权重）">
          <EChart option={scatterOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>气泡越大战略权重越高；落入左下红色阴影区者为低成熟+低自主的攻坚优先级。</p>
        </Card>
        <Card title="① 全领域战略权重排序（颜色=分层）">
          <EChart option={weightOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>半导体、新能源、AI 居权重顶端；红色高权重领域=最需国家级资源倾斜。</p>
        </Card>
      </Grid>

      {/* ================= ② 领域作战室 ================= */}
      <Card title="② 领域作战室 · 点选领域切换四联装详情（颜色=分层）" className="mb-3">
        <SelectorBar items={DOMAINS} activeKey={sel} onSelect={setSel} getKey={(x) => x.k} getLabel={(x) => x.name} getAccent={(x) => TIER_COLOR[x.tier]} />
      </Card>

      <Grid cols={2} className="mb-3">
        <Card title={`② ${d.name} · 中美能力对比雷达（示意）`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: TIER_COLOR[d.tier], border: `1px solid ${TIER_COLOR[d.tier]}` }}>
              {TIER_LABEL[d.tier]}
            </span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>TRL {d.trl} · 自主度 {d.auto}% · 战略权重 {d.weight}</span>
          </div>
          <EChart option={radarOption} style={{ height: 280 }} />
        </Card>

        <Card title={`② ${d.name} · 战略判读`}>
          <div className="space-y-3">
            <div style={{ borderLeft: `2px solid ${TIER_COLOR[d.tier]}`, paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>主导路线 / 代表项目</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.route}</p>
            </div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>卡脖子环节</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.neck}</p>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: '#c41e3a' }}>{d.cn}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>中国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: usBlue }}>{d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>美国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: d.cn - d.us >= 0 ? '#10b981' : '#e8a317' }}>{d.cn - d.us >= 0 ? `+${d.cn - d.us}` : d.cn - d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>相对差(中-美)</div>
              </div>
            </div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>战略判读</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.verdict}</p>
            </div>
          </div>
        </Card>
      </Grid>

      <Card title={`② ${d.name} · 供应链断点条（上游 → 下游 · 圆内数字=节点自主度）`} className="mb-3">
        <ChainStrip chain={chain} />
        <p className="text-[10px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: '#c41e3a' }}>红 &lt;45</span> 断点 ·
          <span style={{ color: '#e8a317' }}> 金 &lt;70</span> 薄弱 ·
          <span style={{ color: '#10b981' }}> 绿 ≥70</span> 可控 —— 链强度由最弱节点决定，悬停节点看判注。
        </p>
      </Card>

      <Grid cols={2} className="mb-3">
        <Card title={`② ${d.name} · 卡脖子清单（severity 分级 + 替代路线）`}>
          <NeckList items={necks} />
        </Card>
        <Card title={`② ${d.name} · 公开里程碑（节点克制口径）`}>
          <MilestoneStrip items={miles} accent={TIER_COLOR[d.tier]} />
          <p className="text-[10px] mt-3" style={{ color: 'var(--text-tertiary)' }}>仅收录广为公开的节点，表述克制；里程碑是回看坐标，不是预测依据。</p>
        </Card>
      </Grid>

      {/* ================= ② 域间依赖图 · 断点传导网络 ================= */}
      <Card title="② 域间依赖图 · 断点传导网络（箭头指向被依赖方 · 点节点切换选中域）" className="mb-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 2fr' }}>
          <div>
            <EChart option={dependsOption} onReady={onDependsReady} style={{ height: 360 }} />
            <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              节点大小=被依赖次数（半导体 / 新材料为全网最大底座）· 颜色=分层 · 金描边=当前选中域；
              <span style={{ color: '#c41e3a' }}> 红色出边</span>=选中域的上游依赖（标注依赖注记），灰边=其余依赖；边宽=依赖强度。
            </p>
          </div>
          <div>
            <div className="text-center p-3 rounded mb-3" style={{ background: 'var(--bg-elevated)' }}>
              <div
                className="text-3xl font-bold mono"
                style={{ color: depRisk.score >= 70 ? '#c41e3a' : depRisk.score >= 40 ? '#e8a317' : depRisk.score > 0 ? '#22d3ee' : '#10b981' }}
              >{depRisk.score}</div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {d.name} · 上游断点传导风险（0-100）
              </div>
            </div>
            {depRisk.paths.length === 0 ? (
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                该域无上游依赖出边——它是传导网络的根部底座：断点不从别处传来，只从这里向全网下游扩散。
                根部域自身的硬卡点，就是全网的系统性风险源。
              </p>
            ) : (
              <div className="space-y-1.5">
                {depRisk.paths.map((p) => (
                  <div key={p.via} className="text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: `${DEP_SEV_COLOR[p.severity] || '#64748b'}1f`,
                          color: DEP_SEV_COLOR[p.severity] || '#64748b',
                          border: `1px solid ${DEP_SEV_COLOR[p.severity] || '#64748b'}55`,
                        }}
                      >{p.severity}</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.via}</span>
                    </div>
                    <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                      {p.via}：{p.note}——上游硬卡点会沿这条边传导。
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              评分=Σ 依赖强度×(上游硬卡点×10 + 最弱链节点断点深度×0.5)，归一至 0-100——确定性合成，非预测。
            </p>
          </div>
        </div>
      </Card>

      {/* ================= ③ 攻关推演模拟器 ================= */}
      <Card title={`③ 攻关推演模拟器 · ${d.name} 十年自主度曲线（确定性推演 · 示意标定）`} className="mb-6">
        <Grid cols={3} className="mb-4">
          <LeverSlider
            label="研发投入强度" value={rd} onChange={setRd} accent="#c41e3a"
            hint="压强越高爬坡越快，但边际递减——钱买不来时间的部分由人才与生态补。"
          />
          <LeverSlider
            label="人才引进力度" value={talent} onChange={setTalent} accent="#e8a317"
            hint="人才决定吸收能力上限——没有承接队伍，设备与图纸都是死资产。"
          />
          <LeverSlider
            label="开放合作度" value={open} onChange={setOpen} accent="#22d3ee"
            hint="开放换技术外溢与迭代速度，同时放大断供冲击的暴露面。"
          />
        </Grid>

        <EChart option={simOption} style={{ height: 300 }} />

        <Grid cols={4} className="mt-3">
          <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-lg font-bold mono" style={{ color: TIER_COLOR[d.tier] }}>{auto2030}%</div>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>2030 推演自主度</div>
          </div>
          <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-lg font-bold mono" style={{ color: sim.breakthrough ? '#e8a317' : 'var(--text-tertiary)' }}>
              {sim.breakthrough || '窗口外'}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>突破年(自主度≥85)</div>
          </div>
          <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-lg font-bold mono" style={{ color: (sim.shocks || []).length > 0 ? '#c41e3a' : '#10b981' }}>
              {(sim.shocks || []).length}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>断供冲击(次)</div>
          </div>
          <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold leading-relaxed px-1 pt-1" style={{ color: 'var(--text-secondary)' }}>{sim.note}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>推演判读</div>
          </div>
        </Grid>

        {d.tier === 'locked' && (
          <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#e8a317' }}>
            受制域机理提示：「以开放换速度，以速度换脆弱」——开放合作度抬高爬坡斜率，也同步抬高断供冲击的命中深度；
            受制域的最优解往往不是开放度拉满，而是在防御带（成熟环节自主兜底）建成之后再放开放杠杆。
          </p>
        )}
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          曲线为确定性纯函数推演（同输入恒同输出），基准 {TECH_AS_OF}；金虚线=85 突破线，红钉=断供冲击（数字为命中深度），金星=突破年。示意标定 · 非预测。
        </p>
        <p className="text-[10px] mt-1" style={{ color: '#22d3ee' }}>
          当前方案已回写图谱账本——博弈桌『自主攻关』将按此方案动态加权。
        </p>
      </Card>

      {/* ================= ④ 中美记分牌 ================= */}
      <Card title="④ 中美科技记分牌 · 六维双向条（左红=中国 · 右蓝=美国 · 示意标定）" className="mb-6">
        <div className="space-y-1">
          {SCORECARD.map((row) => <ScoreRow key={row.dim} row={row} usBlue={usBlue} usBlueFade={usBlueFade} />)}
        </div>
        <div className="mt-3 p-2.5 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #e8a317' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            总评：六维均值 中 <span className="mono font-bold" style={{ color: '#c41e3a' }}>{scoreCnAvg}</span> vs
            美 <span className="mono font-bold" style={{ color: usBlue }}>{scoreUsAvg}</span>，
            差距 <span className="mono font-bold" style={{ color: scoreUsAvg - scoreCnAvg > 0 ? '#e8a317' : '#10b981' }}>
              {scoreUsAvg - scoreCnAvg > 0 ? `-${scoreUsAvg - scoreCnAvg}` : `+${scoreCnAvg - scoreUsAvg}`}
            </span>——
            {scoreUsAvg > scoreCnAvg
              ? '总位势仍居守势，但差距集中在源头创新与高端工具链两维；工程化与规模化两维已构成反向压强。'
              : '总位势进入相持，源头创新维度的代差是剩余主战场。'}
          </p>
        </div>
      </Card>

      {/* ================= ⑤ 全库卡脖子总表 ================= */}
      <Card title="⑤ 全库卡脖子总表 · 12 域平铺（severity 降序 · 同级按战略权重）" className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {TIER_FILTERS.map((f) => (
            <button
              key={f.k}
              type="button"
              onClick={() => setTierFilter(f.k)}
              className={`os-filter-chip mono ${tierFilter === f.k ? 'is-active' : ''}`}
              style={{ '--chip-accent': f.accent }}
            >{f.label}</button>
          ))}
          <span className="text-[11px] mono ml-auto px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: '#c41e3a', border: '1px solid rgba(196,30,58,0.4)' }}>
            硬卡点 {filteredHard} 项 / 共 {filteredRows.length} 项
          </span>
        </div>
        <div className="space-y-1.5" style={{ maxHeight: 420, overflowY: 'auto' }}>
          {filteredRows.map((r) => (
            <div key={`${r.k}-${r.item}`} className="flex items-start gap-2.5 text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
              <span className="pt-0.5"><SevBadge severity={r.severity} /></span>
              <span className="mono shrink-0 px-1.5 py-0.5 rounded text-[10px]" style={{ color: TIER_COLOR[r.tier], border: `1px solid ${TIER_COLOR[r.tier]}44` }}>
                {r.domain}
              </span>
              <div className="min-w-0">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.item}</span>
                <span className="text-[10px] ml-2" style={{ color: 'var(--text-tertiary)' }}>替代路线：{r.alt}</span>
              </div>
            </div>
          ))}
          {filteredRows.length === 0 && (
            <p className="text-xs py-2" style={{ color: 'var(--text-tertiary)' }}>该分层下无登记卡点。</p>
          )}
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          severity 3=硬卡点（无近期替代）、2=中度（替代路线在途）、1=轻度（多源可换）；清单为公开信息梳理的示意口径，非完备名录。
        </p>
      </Card>

      {/* ================= ⑥ 攻关推演报告 ================= */}
      <Card title="⑥ 攻关推演报告 · 当前选中域 + 滑杆配置 → Markdown" className="mb-6">
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          把 ②③ 的判读固化为一页报告：领域位势、断点清单、杠杆配置（研发 {rd} / 人才 {talent} / 开放 {open}）、
          十年推演曲线关键点与机理判读——示意标定 · 非预测 · 非投资建议。
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={genReport}
            className="text-xs mono px-3 py-1.5 rounded font-semibold"
            style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.45)', cursor: 'pointer' }}
          >生成攻关推演报告（{d.name}）</button>
          {report && (
            <button
              type="button"
              onClick={copyReport}
              className="text-xs mono px-3 py-1.5 rounded font-semibold"
              style={{
                background: 'rgba(148,163,184,0.1)',
                color: copied ? '#10b981' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)', cursor: 'pointer',
              }}
            >{copied ? '已复制 ✓' : '复制 Markdown'}</button>
          )}
        </div>
        {report && (
          <pre
            className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
            style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
            }}
          >{report}</pre>
        )}
      </Card>

      {/* ================= ♟ 博弈桌攻关回执（保留原实现） ================= */}
      <Card title="♟ 博弈桌攻关回执 · 攻关线在推演桌上的战绩" className="mb-6">
        {wgRuns.length === 0 ? (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            博弈桌尚未开局——攻关线的真实压力测试在那张桌上。
            <Link to="/sandbox?tab=wargame" className="ml-2 font-semibold" style={{ color: '#22d3ee' }}>→ 上博弈桌推演</Link>
          </p>
        ) : (
          <>
            <div className="space-y-1.5 mb-2">
              {wgRuns.map((r) => (
                <div key={r.id} className="flex items-center gap-3 flex-wrap text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>#{r.id}</span>
                  <span className="shrink-0 font-semibold" style={{ color: 'var(--text-primary)' }}>攻关线 · {trackLabelOf(r.track)}</span>
                  <span className="shrink-0" style={{ color: 'var(--text-secondary)' }}>对手 {r.strategyLabel || r.strategy || '—'}</span>
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `${r.judge.color}1f`, color: r.judge.color, border: `1px solid ${r.judge.color}55` }}
                  >{r.judge.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              回执来自 <Link to="/sandbox?tab=wargame" style={{ color: '#22d3ee' }}>大国博弈推演桌</Link> 的对局存档（最多回显 6 局）——攻关线即本盘领域，作战盘改数据，博弈桌同步换线。
            </p>
          </>
        )}
      </Card>

      {/* ================= 框架三卡 + 页脚 ================= */}
      <FrameworkTrio cards={[
        {
          title: '位势的物理', subtitle: '存量能力 × 生态耦合', accent: '#e8a317', border: '#e8a317',
          body: '位势不是单点指标，是存量能力与生态耦合度的乘积——TRL 量「能不能做」，自主度量「断供后还能不能做」，权重量「值不值得倾国家之力做」。三者错配处即战略误判高发区。',
          pillars: [['TRL', '工程可行性的刻度。'], ['自主度', '断供情景下的存活率。'], ['权重', '国家资源的分配函数。']],
        },
        {
          title: '断点的经济学', subtitle: '供给弹性决定卡的深度', accent: '#22d3ee', border: '#22d3ee',
          body: '卡脖子的本质不是技术差距，是替代供给的弹性——severity 3 硬卡点之所以硬，是因为替代路线的成本曲线在可见周期内压不下来；攻关的真正目标是把对手的「断供期权」贬值。',
          pillars: [['硬卡点', '无近期替代=对手期权满值。'], ['替代路线', '在途即威慑——不必等量产。'], ['防御带', '成熟环节自主兜底是底仓。']],
        },
        {
          title: '时间的盟友与敌人', subtitle: '复利方向决定阵营', accent: '#c41e3a', border: '#c41e3a',
          body: '时间对领先域是盟友（生态与成本优势按复利累积），对受制域是敌人（代差同样按复利扩大）——除非换道。模拟器的 85 突破线就是时间阵营的换防点：穿越之前抢时间，穿越之后用时间。',
          pillars: [['领先域', '用时间滚大护城河。'], ['受制域', '与代差复利赛跑。'], ['换道窗口', '新范式重置所有人的钟。']],
        },
      ]} />

      <ModuleFooter
        moduleId="techtree"
        links={[
          { to: '/sandbox?tab=wargame', label: '大国博弈推演桌', note: '攻关线即本盘领域——上桌做压力测试。' },
          { to: '/manufacturing', label: '制造业 · GVC 位势', note: '国产替代与微笑曲线锚点。' },
          { to: '/semiconductor', label: '半导体 · 卡脖子', note: '科技树最硬受制节点深潜。' },
        ]}
        disclaimer={`TRL / 自主度 / 断点 / 记分牌 / 推演曲线均为「公开信息梳理 + 示意标定」（基准 ${TECH_AS_OF}），示意标定 · 非预测 · 非投资建议；里程碑仅收录广为公开的节点`}
      />
    </div>
  );
}
