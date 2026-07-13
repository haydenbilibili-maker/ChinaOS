import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { FrameworkTrio, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  VOLUMES, STACK_ORDER, STACK_DISPLAY_TOPDOWN, CANONICAL_ORDER,
  REGIME, REGIME_TAG, VOL_LINKS, CIV_META, wordEstimate, getLayerCode, sortByStackOrder,
} from './volumes.js';
import {
  DYNASTY_CASES, CYCLE_STAGES, FACTOR_DEFS, LEVER_DEFS, simDynasty, buildCivReport,
} from './civDeep.js';

// ============================================================================
// 文明透视 · 作战室扩容（数据层 ./civDeep.js）
//   ⑤ 王朝病理切片：六案例 → 五因子横向条 + peak/collapse/lesson 判读
//   ⑥ 治乱周期模拟器：四杆投入 → simDynasty 十二期健康度曲线 + 判定徽章
//   ⑦ 周期推演报告：buildCivReport → Markdown 复制
// 铁律：零随机、零当前时间——曲线为确定性纯函数推演，同输入恒同输出。
// 口径：理想型分析框架 · 非实证史学 · 非现实影射；朝代数据为史学常识级
//       粗粒度示意标定，不构成历史实证结论。
// ============================================================================

// ---- ⑤ 五因子着色：值高=病重（红 ≥70 / 金 ≥45 / 绿 <45）----
const factorColor = (v) => (v >= 70 ? '#c41e3a' : v >= 45 ? '#e8a317' : '#10b981');

// 六案例五因子均值（构建期常量 · 病理切片对照小字用）
const FACTOR_MEANS = FACTOR_DEFS.map((f) => ({
  key: f.key,
  label: f.label,
  mean: Math.round(DYNASTY_CASES.reduce((s, c) => s + c.factors[f.key], 0) / DYNASTY_CASES.length),
}));

// ---- ⑤ 单案例五因子横向 bar option（纯函数，依赖案例）----
function buildFactorOption(c) {
  const rows = [...FACTOR_DEFS].reverse(); // 横向 bar 自上而下按定义序展示
  return {
    grid: { left: 76, right: 40, top: 10, bottom: 26 },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
      formatter: (ps) => {
        const p = ps[0];
        const mean = FACTOR_MEANS.find((m) => m.label === p.name)?.mean;
        return `${c.name} · ${p.name}<br/>病重度 ${p.data.value}（六案均值 ${mean}）`;
      },
    },
    xAxis: {
      type: 'value', max: 100, name: '病重度', nameTextStyle: { color: '#5b6a82' },
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    },
    yAxis: {
      type: 'category', data: rows.map((f) => f.label),
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 },
    },
    series: [{
      type: 'bar', barWidth: 14,
      data: rows.map((f) => ({ value: c.factors[f.key], itemStyle: { color: factorColor(c.factors[f.key]), borderRadius: [0, 3, 3, 0] } })),
      label: { show: true, position: 'right', formatter: '{c}', color: '#93a1b5', fontSize: 10 },
    }],
  };
}

// ---- ⑥ 十二期健康度曲线 option（纯函数，依赖 sim 结果）----
function buildCycleOption(sim) {
  const x = sim.curve.map((_, i) => `第${i + 1}期`);

  // 阶段色带：连续同阶段期合并为一段 markArea
  const areas = [];
  let s = 0;
  for (let i = 1; i <= sim.stageIdx.length; i++) {
    if (i === sim.stageIdx.length || sim.stageIdx[i] !== sim.stageIdx[s]) {
      const st = CYCLE_STAGES[sim.stageIdx[s]];
      areas.push([
        {
          xAxis: x[s], itemStyle: { color: `${st.color}14` },
          label: { show: true, position: 'insideTop', formatter: st.label, color: st.color, fontSize: 9 },
        },
        { xAxis: x[i - 1] },
      ]);
      s = i;
    }
  }

  // 崩溃节点 markPoint（红 pin）
  const collapsePoint = sim.collapse
    ? [{
        name: '跌破崩溃线', coord: [x[sim.collapse - 1], sim.curve[sim.collapse - 1]],
        symbol: 'pin', symbolSize: 34, itemStyle: { color: '#c41e3a' },
        label: { show: true, formatter: '崩', color: '#fff', fontSize: 9 },
      }]
    : [];

  return {
    grid: { left: 44, right: 24, top: 30, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
      formatter: (ps) => {
        const p = ps[0];
        return `${p.axisValue}<br/>健康度 ${p.data} · ${CYCLE_STAGES[sim.stageIdx[p.dataIndex]].label}`;
      },
    },
    xAxis: {
      type: 'category', data: x,
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 },
    },
    yAxis: {
      type: 'value', min: 0, max: 100, name: '健康度', nameTextStyle: { color: '#5b6a82' },
      axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    },
    series: [{
      type: 'line', data: sim.curve, smooth: true, symbol: 'circle', symbolSize: 5,
      lineStyle: { color: sim.verdict.color, width: 2.5 },
      itemStyle: { color: sim.verdict.color },
      areaStyle: { color: `${sim.verdict.color}14` },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#c41e3a', type: 'dashed', width: 1.5 },
        label: { color: '#c41e3a', fontSize: 10, formatter: '崩溃线 25' },
        data: [{ yAxis: 25 }],
      },
      markArea: { silent: true, data: areas },
      markPoint: { data: collapsePoint },
    }],
  };
}

/** ⑥ 投入滑杆：标签 + 数值 + range 输入 + 机理小字 */
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

const COMPARE_DIMS = [
  { name: '个体 / 集体', max: 100 },
  { name: '超越性来源', max: 100 },
  { name: '权力合法性', max: 100 },
  { name: '变革方式', max: 100 },
  { name: '商业地位', max: 100 },
  { name: '法律 / 关系', max: 100 },
];
const COMPARE_TABLE = [
  ['个体 / 集体', '个人主义 · 契约社会', '集体 / 关系 · 家国同构', 85],
  ['超越性来源', '人格神 · 彼岸超越', '天命 · 祖先 · 现世内在', 80],
  ['权力合法性', '神授君权 / 民约', '绩效合法性 · 敬天保民', 75],
  ['变革方式', '革命 · 断裂 · 制度重设', '均值回归 · 治乱循环 · 改良', 70],
  ['商业地位', '商人入主流 · 资本驱动', '士农工商 · 资本政治天花板', 88],
  ['法律 / 关系', '成文法 · 罪感约束', '人情面子 · 耻感约束', 78],
];
const compareRadar = {
  tooltip: {},
  radar: { indicator: COMPARE_DIMS, axisName: { color: '#93a1b5', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
  legend: { data: ['中华文明栈', '西方文明栈（理想型）'], textStyle: { color: '#93a1b5' }, bottom: 0 },
  series: [{
    type: 'radar',
    data: [
      { value: COMPARE_TABLE.map((r) => r[3]), name: '中华文明栈', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.16)' }, itemStyle: { color: '#c41e3a' } },
      { value: COMPARE_TABLE.map((r) => 100 - r[3]), name: '西方文明栈（理想型）', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' }, itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

function StackBars({ active, onPick, dimFor }) {
  return (
    <div className="space-y-1">
      {STACK_DISPLAY_TOPDOWN.map((k) => {
        const x = VOLUMES[k];
        const sel = k === active;
        const op = dimFor ? dimFor(k) : 1;
        return (
          <button key={k} onClick={() => onPick(k)}
            className="w-full text-left rounded flex items-stretch gap-0 overflow-hidden transition-all"
            style={{ background: sel ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${sel ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer', opacity: op }}>
            <span style={{ width: 5, background: x.color, flexShrink: 0 }} />
            <span className="flex items-center gap-3 px-3 py-2 flex-1">
              <span className="text-[10px] mono shrink-0" style={{ width: 132, color: x.color }}>{x.role}</span>
              <span className="text-xs flex-1" style={{ color: sel ? '#fff' : 'var(--text-secondary)' }}>{x.num} · {x.title}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function VolumeCard({ volId, compact, stackSeq }) {
  const v = VOLUMES[volId];
  const layer = getLayerCode(v.role);
  const [rtag, rcolor] = REGIME_TAG[REGIME[volId]];
  const words = wordEstimate(v);
  return (
    <div className="os-card p-4 flex flex-col h-full" style={{ borderLeft: `3px solid ${v.color}` }}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {stackSeq != null && (
          <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>
            栈序 {stackSeq}/12
          </span>
        )}
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v.num}</span>
        {layer && (
          <span className="text-[10px] mono px-2 py-0.5 rounded font-semibold" style={{ background: `${v.color}22`, color: v.color, border: `1px solid ${v.color}44` }}>{layer}</span>
        )}
        <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
        <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
      </div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{v.title}</div>
      {!compact && <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: 'var(--text-secondary)' }}>{v.thesis.slice(0, 120)}…</p>}
      <div className="flex flex-wrap gap-1 mb-3">
        {v.tags?.slice(0, 3).map((t) => (
          <span key={t} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{v.sections?.length} 节 · ~{words} 字</span>
        <Link to={`/civilization/v/${volId}`} className="text-xs mono px-2.5 py-1 rounded"
          style={{ background: `${v.color}22`, color: '#fff', border: `1px solid ${v.color}` }}>
          进入全文 →
        </Link>
      </div>
    </div>
  );
}

const TABS = [
  ['stack', '文明栈总览'], ['read', '逐卷精读'], ['schedule', '治乱调度算法'],
  ['pathology', '王朝病理切片'], ['cycle', '治乱周期模拟器'], ['compare', '中西对照'],
];

export default function Page() {
  const [vol, setVol] = useState('v11');
  const [tab, setTab] = useState('stack');
  const [regime, setRegime] = useState('boom');

  // ⑤ 王朝病理切片：选中案例
  const [caseId, setCaseId] = useState('han');
  const kase = DYNASTY_CASES.find((c) => c.id === caseId) || DYNASTY_CASES[0];
  const factorOption = useMemo(() => buildFactorOption(kase), [kase]);
  // 当前案例高于六案均值的因子（对照小字）
  const aboveMean = useMemo(
    () => FACTOR_MEANS.filter((m) => kase.factors[m.key] > m.mean).map((m) => m.label),
    [kase],
  );

  // ⑥ 治乱周期模拟器：四杆投入（默认 50）→ 确定性推演
  const [fiscal, setFiscal] = useState(50);
  const [elite, setElite] = useState(50);
  const [periphery, setPeriphery] = useState(50);
  const [mobilize, setMobilize] = useState(50);
  const leverState = { fiscal, elite, periphery, mobilize };
  const leverSetters = { fiscal: setFiscal, elite: setElite, periphery: setPeriphery, mobilize: setMobilize };
  const sim = useMemo(() => simDynasty({ fiscal, elite, periphery, mobilize }), [fiscal, elite, periphery, mobilize]);
  const cycleOption = useMemo(() => buildCycleOption(sim), [sim]);
  const finalStage = CYCLE_STAGES[sim.stageIdx[sim.stageIdx.length - 1]];
  const minHealth = useMemo(() => Math.min(...sim.curve), [sim]);

  // ⑦ 周期推演报告：手动生成 + 复制；杆值变化即清空旧报告（防错位）
  const [civReport, setCivReport] = useState('');
  const [civCopied, setCivCopied] = useState(false);
  useEffect(() => {
    setCivReport('');
    setCivCopied(false);
  }, [fiscal, elite, periphery, mobilize]);
  const genCivReport = () => {
    setCivReport(buildCivReport({ levers: { fiscal, elite, periphery, mobilize }, sim }));
    setCivCopied(false);
  };
  const copyCivReport = () => {
    navigator.clipboard?.writeText(civReport).then(() => {
      setCivCopied(true);
      setTimeout(() => setCivCopied(false), 1600);
    });
  };

  const v = VOLUMES[vol];
  const [rtag, rcolor] = REGIME_TAG[REGIME[vol]];
  const btn = (a) => ({ background: a ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: a ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 14px', fontSize: 13 });
  const dimFor = (k) => {
    const r = REGIME[k];
    if (r === regime || r === 'both') return 1;
    if (r === 'base') return 0.5;
    return 0.16;
  };

  return (
    <div>
      <PageHeader badge="Civilization Lens · 12 卷"
        title="文明透视 · 文明源代码栈"
        subtitle="把文明拆成一台可分层调试的操作系统：地理物理底座 → 宇宙观 → 法家内核 → 儒家源代码 → 道家减震器 → 汉字科举硬件 → 佛学心理补丁 → 人情非正式层 → 盐铁财富闭环，以总纲串成引导扇区" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        与「<Link to="/depth" className="mono" style={{ color: 'var(--cyber-cyan)' }}>深度透视</Link>」经济—地缘主线并列的文化战略长篇。核心隐喻：每一卷是一层，自下而上叠成全栈；<strong style={{ color: 'var(--text-primary)' }}>外儒内法剂之以道</strong>不是并列，而是<strong style={{ color: 'var(--text-primary)' }}>分时调度</strong>——顺境儒法扩张、逆境切道家熬冬。点击「逐卷精读」或「进入全文」可打开完整报告详情页。
        新增「王朝病理切片 / 治乱周期模拟器」为<strong style={{ color: 'var(--text-primary)' }}>理想型分析框架</strong>：朝代五因子为史学常识级粗粒度示意，推演为确定性纯函数（同输入恒同输出）——非实证史学、非现实影射。
      </p></Card>
      <StatGrid className="mb-6">
        <Stat value={`${CIV_META.volumeCount}/${CIV_META.volumeCount}`} label="全栈卷数 · 已就绪" accent="#c41e3a" />
        <Stat value={`${CIV_META.stackDepth} 层`} label="OS 栈深度（9+总纲）" accent="#22d3ee" />
        <Stat value={`${Math.round(CIV_META.totalWords / 1000)}k`} label="总字数约" accent="#e8a317" />
        <Stat value="6 维" label="中西对照维度" accent="#10b981" />
      </StatGrid>

      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} style={btn(k === tab)} className="mono">{label}</button>)}
      </div>

      {tab === 'stack' && (
        <Grid cols={2} className="mb-6">
          <Card title="文明 OS 栈 · 自下而上（点层切换）">
            <StackBars active={vol} onPick={setVol} />
            <p className="text-[11px] mono mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>// 左侧色条 = 各层在栈中的位置；下层为上层提供运行前提</p>
          </Card>
          <Card title={`${v.num} · ${v.title}`}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              <Link to={`/civilization/v/${vol}`} className="text-[11px] mono px-2 py-0.5 rounded"
                style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)' }}>
                → 全文报告
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
            {v.frameworks && <FrameworkTrio cards={v.frameworks} />}
            <Link to={`/civilization/v/${vol}`} className="text-xs mono inline-block mt-2"
              style={{ color: 'var(--cyber-cyan)' }}>
              展开完整报告（{v.sections?.length} 节 + 框架卡）→
            </Link>
          </Card>
        </Grid>
      )}

      {tab === 'read' && (
        <div className="mb-6">
          <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
            // 推荐阅读序：自下而上 L0→L9（卷十一地理底座起，卷一总纲收束）· 与详情页 prev/next 一致
          </p>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {CANONICAL_ORDER.map((k) => {
              const layer = getLayerCode(VOLUMES[k].role);
              return (
                <Link key={k} to={`/civilization/v/${k}`}
                  className="text-xs px-2.5 py-1 rounded mono inline-flex items-center gap-1.5"
                  style={{ background: k === vol ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === vol ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === vol ? VOLUMES[k].color : 'transparent'}` }}>
                  {layer && <span style={{ color: k === vol ? '#fff' : VOLUMES[k].color, fontSize: 10 }}>{layer}</span>}
                  {VOLUMES[k].num}
                </Link>
              );
            })}
          </div>
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {CANONICAL_ORDER.map((k, i) => <VolumeCard key={k} volId={k} stackSeq={i + 1} />)}
          </div>
          <Card className="mb-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{v.num} · {v.title}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              <Link to={`/civilization/v/${vol}`} className="text-[11px] mono ml-auto" style={{ color: 'var(--cyber-cyan)' }}>→ 进入全文报告</Link>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
          </Card>
          <Grid cols={2} className="mb-4">
            {v.sections.map((sec) => (
              <Card key={sec.id} title={sec.title}>
                {sec.lead && <p className="text-[11px] mono mb-2" style={{ color: v.color }}>{sec.lead}</p>}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sec.body[0]}</p>
              </Card>
            ))}
          </Grid>
          {VOL_LINKS[vol] && <CrossLinks title={`${v.num} · 现实接口 · 直跳业务模块`} links={VOL_LINKS[vol]} />}
        </div>
      )}

      {tab === 'schedule' && (
        <Grid cols={2} className="mb-6">
          <Card title="治乱调度算法 · 同一套栈的两种系统态">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setRegime('boom')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'boom' ? 'rgba(232,163,23,0.2)' : 'var(--bg-elevated)', color: regime === 'boom' ? '#e8a317' : 'var(--text-secondary)', border: `1px solid ${regime === 'boom' ? '#e8a317' : 'transparent'}`, cursor: 'pointer' }}>顺境 · 儒法扩张</button>
              <button onClick={() => setRegime('bust')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'bust' ? 'rgba(16,185,129,0.2)' : 'var(--bg-elevated)', color: regime === 'bust' ? '#10b981' : 'var(--text-secondary)', border: `1px solid ${regime === 'bust' ? '#10b981' : 'transparent'}`, cursor: 'pointer' }}>逆境 · 道家熬冬</button>
            </div>
            <StackBars active={vol} onPick={setVol} dimFor={dimFor} />
            <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>// 亮 = 当前态主调度层 · 半亮 = 结构常量底座 · 暗 = 另一态才激活</p>
          </Card>
          <Card title={regime === 'boom' ? '顺境调度 · 儒法驱动扩张' : '逆境调度 · 道家低耗熬冬'}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {regime === 'boom'
                ? '王朝上升期 / 经济扩张期：法家内核（L2）以 KPI 与动员驱动增长，儒家源代码（L3）供合法性与愿景，汉字—科举（L5）持续收敛精英入口。系统高整合、高动员，代价是低方差、压抑高风险创新（李约瑟难题之果）。现实回响：强监管、超级工程、集中力量办大事。'
                : '王朝末年 / 经济崩溃期：切换道家减震器（L4）——轻徭薄赋、与民休息、放松管制、负面清单，靠自发秩序修复元气；佛学心理补丁（L6）卸载意义溢出。系统低耗、容错、均值回归。现实回响：从强监管转向稳预期、休养生息、「我无为而民自化」。'}
            </p>
            <div className="space-y-2">
              {sortByStackOrder(Object.keys(REGIME).filter((k) => REGIME[k] === regime || REGIME[k] === 'both')).map((k) => (
                <Link key={k} to={`/civilization/v/${k}`} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded block"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: VOLUMES[k].color }} />
                  <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${VOLUMES[k].color}22`, color: VOLUMES[k].color }}>{getLayerCode(VOLUMES[k].role)}</span>
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{VOLUMES[k].num} · {VOLUMES[k].title}</span>
                  <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>{VOLUMES[k].role}</span>
                </Link>
              ))}
            </div>
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>暴力强制层（L2b）两态常驻——无论扩张或收缩，对暴力的垄断始终是内核的最终保障。</p>
          </Card>
        </Grid>
      )}

      {tab === 'pathology' && (
        <div className="mb-6">
          <Card title="⑤ 王朝病理切片 · 点选案例切换五因子病理条（理想型框架 · 非实证史学）" className="mb-4">
            <SelectorBar
              items={DYNASTY_CASES} activeKey={caseId} onSelect={setCaseId}
              getKey={(c) => c.id} getLabel={(c) => `${c.name} · ${c.span}`} getAccent={(c) => c.color}
            />
            <p className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
              // 五因子 0-100 为史学常识级粗粒度示意标定，值高=病重；同一框架量尺，方便横向对照，不构成历史实证测量
            </p>
          </Card>
          <Grid cols={2} className="mb-4">
            <Card title={`⑤ ${kase.name} · 五因子病理条（红 ≥70 病危 · 金 ≥45 病重 · 绿 <45 可控）`}>
              <EChart option={factorOption} style={{ height: 240 }} />
              <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                六案均值对照：{FACTOR_MEANS.map((m) => `${m.label} ${m.mean}`).join(' · ')}；
                {kase.name}高于均值的因子：{aboveMean.length > 0 ? aboveMean.join('、') : '无（各因子均不超过六案均值）'}。
              </p>
            </Card>
            <Card title={`⑤ ${kase.name}（${kase.span}）· 病理判读`}>
              <div className="space-y-3">
                <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 12 }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>鼎盛期</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{kase.peak}</p>
                </div>
                <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 12 }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>崩溃机理</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{kase.collapse}</p>
                </div>
                <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 12 }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>冷峻教训</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{kase.lesson}</p>
                </div>
              </div>
              <p className="text-[10px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
                案例切片仅为框架内的理想型归因——真实王朝衰亡是多因叠加，单句机理是放大镜，不是判决书。
              </p>
            </Card>
          </Grid>
        </div>
      )}

      {tab === 'cycle' && (
        <div className="mb-6">
          <Card title="⑥ 治乱周期模拟器 · 四杆投入 → 十二期国祚健康度（确定性推演 · 理想型框架）" className="mb-4">
            <Grid cols={4} className="mb-4">
              {LEVER_DEFS.map((d) => (
                <LeverSlider
                  key={d.key} label={d.label} accent={d.accent} hint={d.hint}
                  value={leverState[d.key]} onChange={leverSetters[d.key]}
                />
              ))}
            </Grid>

            <EChart option={cycleOption} style={{ height: 300 }} />

            <div className="flex items-center gap-3 flex-wrap mt-4">
              {/* 判定大徽章 */}
              <div
                className="px-4 py-2 rounded-lg"
                style={{ background: `${sim.verdict.color}1a`, border: `1px solid ${sim.verdict.color}` }}
              >
                <div className="text-lg font-bold mono" style={{ color: sim.verdict.color }}>{sim.verdict.label}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>周期判定</div>
              </div>
              {/* 终局阶段 chip */}
              <span
                className="text-xs mono px-3 py-1.5 rounded"
                style={{ background: `${finalStage.color}1a`, color: finalStage.color, border: `1px solid ${finalStage.color}55` }}
              >终局阶段 · {finalStage.label}</span>
              {/* 崩溃节点 chip */}
              <span
                className="text-xs mono px-3 py-1.5 rounded"
                style={{
                  background: 'var(--bg-elevated)',
                  color: sim.collapse ? '#c41e3a' : '#10b981',
                  border: `1px solid ${sim.collapse ? 'rgba(196,30,58,0.45)' : 'rgba(16,185,129,0.45)'}`,
                }}
              >{sim.collapse ? `第 ${sim.collapse} 期跌破崩溃线` : '十二期内未跌破崩溃线'}</span>
              <span className="text-xs mono px-3 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                全程最低 {minHealth}
              </span>
            </div>

            {/* 阶段图例 */}
            <div className="flex items-center gap-3 flex-wrap mt-3">
              {CYCLE_STAGES.map((st, i) => (
                <span key={st.id} className="inline-flex items-center gap-1.5 text-[10px] mono"
                  style={{ color: i === sim.stageIdx[sim.stageIdx.length - 1] ? st.color : 'var(--text-tertiary)' }} title={st.desc}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: st.color, display: 'inline-block' }} />
                  {st.label}
                </span>
              ))}
            </div>

            <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#e8a317' }}>
              机理提示：精英内卷随承平自增（承平越久、分利联盟越大），「抑制内卷」杆只能压低起点、压不住趋势——
              这正是只压财政不管精英时，中后期盈余仍被吃光的来源。
            </p>
            <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
              确定性差分推演（健康度初值 80 · 每期基础熵增 3 + 未压制风险加权 · 同输入恒同输出）；红虚线=崩溃线 25，色带=治乱周期阶段。
              理想型框架 · 非实证史学 · 非现实影射。
            </p>
          </Card>

          <Card title="⑦ 周期推演报告 · 当前四杆配置 → Markdown" className="mb-4">
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              把 ⑥ 的推演固化为一页报告：投入组合（财政 {fiscal} / 内卷 {elite} / 边防 {periphery} / 动员 {mobilize}）、
              十二期轨迹关键点、阶段变迁、四档判定，以及与六个王朝案例中风险结构最近者的框架类比——
              理想型框架 · 非实证史学 · 非现实影射。
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={genCivReport}
                className="text-xs mono px-3 py-1.5 rounded font-semibold"
                style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.45)', cursor: 'pointer' }}
              >生成周期推演报告（{sim.verdict.label}）</button>
              {civReport && (
                <button
                  type="button"
                  onClick={copyCivReport}
                  className="text-xs mono px-3 py-1.5 rounded font-semibold"
                  style={{
                    background: 'rgba(148,163,184,0.1)',
                    color: civCopied ? '#10b981' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)', cursor: 'pointer',
                  }}
                >{civCopied ? '已复制 ✓' : '复制 Markdown'}</button>
              )}
            </div>
            {civReport && (
              <pre
                className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
                style={{
                  background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
                }}
              >{civReport}</pre>
            )}
          </Card>
        </div>
      )}

      {tab === 'compare' && (
        <Grid cols={2} className="mb-6">
          <Card title="中西文明操作系统对照 · 雷达（理想型 · 非实证）">
            <EChart option={compareRadar} style={{ height: 300 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>刻度向外（红）= 偏中华栈取向，向内反向（青）= 偏西方理想型；二者每一维度互为镜像，仅作思想史对照，不代表优劣或精确测量。</p>
          </Card>
          <Card title="维度逐项对照表">
            <div className="space-y-2">
              {COMPARE_TABLE.map(([dim, west, china]) => (
                <div key={dim} className="pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{dim}</div>
                  <div className="flex gap-2 text-[11px] leading-snug">
                    <div className="flex-1" style={{ color: 'var(--cyber-cyan)' }}>西 · {west}</div>
                    <div className="flex-1 text-right" style={{ color: 'var(--china-red)' }}>{china} · 华</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      )}

      <CrossLinks title="叠读提示 · 文明栈与现实模块的接口" links={[
        { to: '/powerlogic', label: '权力逻辑', note: '卷二法家内核 ↔ 儒表法里的当代运行。' },
        { to: '/military', label: '军事力量', note: '卷九暴力垄断 ↔ 枪杆子里出政权。' },
        { to: '/soe', label: '国有资本', note: '卷十二盐铁逻辑 ↔ 战略底座与链主。' },
        { to: '/redweb', label: '红网结构', note: '非正式层与人情面子 ↔ 权贵网络。' },
        { to: '/straits', label: '台海局势', note: '卷十一地理密室 ↔ 地缘重力与硅盾。' },
        { to: '/private', label: '民营经济', note: '卷十交换层 ↔ 缝隙内卷与资本天花板。' },
      ]} />
      <ModuleFooter
        links={[]}
        disclaimer="全文报告已内嵌至 React 详情页（/civilization/v/:id）；原 civilization-*.html 独立报告仍保留于仓库根目录 · 思想史隐喻，非实证结论 · 理想型框架 · 非实证史学 · 非现实影射"
      />
    </div>
  );
}
