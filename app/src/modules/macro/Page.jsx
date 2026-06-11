import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  MACRO_AS_OF, MACRO_INIT, POLICY_LEVERS, MACRO_STATES,
  defaultLevers, simulate, quadrant, buildMacroReport,
} from './macroData.js';

// ============================================================================
// 宏观调控 · 四难平衡驾驶舱（模拟器页）
// ----------------------------------------------------------------------------
// 五根政策杆 → 八季度差分推演 → 象限判定 → Markdown 推演报告。
// 全部逻辑确定性纯函数（macroData.js），页面只做交互与呈现；
// 基准日为常量字符串，运行时不取随机数、不取当前时间。
// 声明：示意模型 · 思想工具 · 非投资建议 · 非预测。
// ============================================================================

const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_RED = { ...BTN, background: 'rgba(196,30,58,0.16)', border: '1px solid rgba(196,30,58,0.4)', color: '#c41e3a', fontWeight: 600 };
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };
const BTN_GOLD = { ...BTN, background: 'rgba(232,163,23,0.12)', border: '1px solid rgba(232,163,23,0.35)', color: '#e8a317', fontWeight: 600 };

/** 预设政策组合（按钮组） */
const PRESETS = [
  {
    id: 'expand', label: '积极扩张', style: BTN_RED,
    levers: { fiscal: 5.0, rate: -50, bonds: 6, fx: 40, industry: 70 },
    hint: '财政货币双松 + 产业加码：增长先到，通胀与杠杆账单后到。',
  },
  {
    id: 'neutral', label: '稳健中性', style: BTN_CYAN,
    levers: defaultLevers(),
    hint: '全杆中性参考：基线情景，潜在增速缓降、杠杆惯性缓升。',
  },
  {
    id: 'tighten', label: '紧缩去杠杆', style: BTN_GOLD,
    levers: { fiscal: 2.5, rate: 50, bonds: 2, fx: 60, industry: 30 },
    hint: '财政收缩 + 加息出清：杠杆弯头以增长和就业为对价。',
  },
  {
    id: 'reset', label: '恢复默认', style: BTN,
    levers: defaultLevers(),
    hint: '回到中性参考组合。',
  },
];

/** 滑杆取值显示：小数步长保留一位；利率正向加号标明加息 */
function fmtLeverValue(lever, v) {
  const num = lever.step < 1 ? Number(v).toFixed(1) : String(v);
  const signed = lever.id === 'rate' && v > 0 ? `+${num}` : num;
  return `${signed}${lever.unit}`;
}

/** 单根政策杆：标签 + 取值高亮 + 滑杆 + 机理小字 */
function RangeRow({ lever, value, onChange }) {
  return (
    <div className="py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {lever.label}
          <span className="text-[10px] mono font-normal ml-2" style={{ color: 'var(--text-tertiary)' }}>
            {lever.min}–{lever.max}{lever.unit}
          </span>
        </span>
        <span className="mono text-sm font-bold" style={{ color: lever.color }}>{fmtLeverValue(lever, value)}</span>
      </div>
      <input
        type="range"
        min={lever.min}
        max={lever.max}
        step={lever.step}
        value={value}
        onChange={(e) => onChange(lever.id, parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: lever.color }}
      />
      <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>{lever.desc}</p>
    </div>
  );
}

/** 末季四态 chip：值 + Δ（杠杆涨为红，其余涨绿跌红） */
function DeltaChip({ state, value }) {
  const init = MACRO_INIT[state.id];
  const d = Math.round((value - init) * 100) / 100;
  const sign = d > 0 ? `+${d}` : `${d}`;
  let tone = '#64748b';
  if (d !== 0) {
    const up = d > 0;
    const bad = state.id === 'leverage' ? up : !up; // 杠杆相反：涨即恶化
    tone = bad ? '#c41e3a' : '#10b981';
  }
  return (
    <div className="os-card p-3" style={{ borderLeft: `3px solid ${state.color}` }}>
      <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{state.label}</div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
        <span className="mono text-xs font-semibold" style={{ color: tone }}>{sign}</span>
        <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>初值 {init}</span>
      </div>
    </div>
  );
}

export default function Page() {
  const [levers, setLevers] = useState(() => defaultLevers());
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);

  const traj = useMemo(() => simulate(levers), [levers]);
  const verdict = useMemo(() => quadrant(traj), [traj]);

  const setLever = (id, v) => setLevers((prev) => ({ ...prev, [id]: v }));
  const applyPreset = (preset) => {
    setLevers({ ...preset.levers });
    setReportMd('');
  };

  const genReport = () => setReportMd(buildMacroReport({ levers, traj, verdict }));
  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // —— ② 八季度轨迹图：增长/通胀挂左轴，就业/杠杆挂右轴 ——
  const trajOption = useMemo(() => {
    const byId = Object.fromEntries(MACRO_STATES.map((s) => [s.id, s]));
    const mkSeries = (id, yAxisIndex, markLine) => ({
      name: byId[id].label,
      type: 'line',
      yAxisIndex,
      data: traj[id],
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: 2, color: byId[id].color },
      itemStyle: { color: byId[id].color },
      ...(markLine ? { markLine } : {}),
    });
    return {
      legend: { data: MACRO_STATES.map((s) => s.label), textStyle: { color: AX.text, fontSize: 11 }, top: 0 },
      grid: { left: 48, right: 56, top: 36, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: QUARTERS,
        axisLine: { lineStyle: { color: AX.line } },
        axisLabel: { color: AX.text },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: '增长 / 物价（%）',
          nameTextStyle: { color: AX.text, fontSize: 10 },
          axisLine: { lineStyle: { color: AX.line } },
          axisLabel: { color: AX.text },
          splitLine: { lineStyle: { color: AX.split } },
          scale: true,
        },
        {
          type: 'value',
          name: '就业 / 杠杆',
          nameTextStyle: { color: AX.text, fontSize: 10 },
          axisLine: { lineStyle: { color: AX.line } },
          axisLabel: { color: AX.text },
          splitLine: { show: false },
          scale: true,
        },
      ],
      series: [
        mkSeries('growth', 0, {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: '#22d3ee', opacity: 0.55 },
          label: { color: '#22d3ee', fontSize: 10, formatter: '增长警戒 4.5' },
          data: [{ yAxis: 4.5 }],
        }),
        mkSeries('inflation', 0, {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: '#c41e3a', opacity: 0.55 },
          label: { color: '#c41e3a', fontSize: 10, formatter: '通胀警戒 2.5' },
          data: [{ yAxis: 2.5 }],
        }),
        mkSeries('employ', 1),
        mkSeries('leverage', 1),
      ],
    };
  }, [traj]);

  return (
    <div>
      {/* 0 —— 页头 / 总览 */}
      <PageHeader
        badge="Simulation · 宏观调控驾驶舱"
        title="宏观调控 · 四难平衡驾驶舱"
        subtitle="五根政策杆，八个季度，四张互相透支的资产负债表——拉动任何一根杆，代价都在别处、在后面。"
      />
      <IntroCard>
        增长、物价、就业、杠杆——宏观调控的四难平衡：每一根政策杆都同时作用于不止一个目标，
        且作用带着时滞。财政当季见效、杠杆账单第 3 季才开始计提；降息第 2 季拉增长、第 4 季抬通胀；
        产业政策第 4 季才起效，却是唯一不衰减的杆。时滞让代价后置——刺激是本届的政绩，利息是下届的遗产。
        本页用一组确定性差分方程把这套时滞结构压进八个季度的推演里：拖动滑杆，看每个选择的全部账单。
        示意模型，思想工具，非投资建议、非预测。
      </IntroCard>
      <Grid cols={4} className="mb-8">
        <Stat value={MACRO_AS_OF} label="推演基准日" accent="#22d3ee" />
        <Stat value="5 根" label="政策杆（财政/利率/专项债/汇率/产业）" accent="#c41e3a" />
        <Stat value="8 季" label="差分推演窗口" accent="#e8a317" />
        <Stat value="4 难" label="增长 · 物价 · 就业 · 杠杆" accent="#10b981" />
      </Grid>

      {/* 1 —— 政策组合台 */}
      <Card title="① 政策组合台 · 五根杆与三套预设">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" style={p.style} onClick={() => applyPreset(p)} title={p.hint}>
              {p.label}
            </button>
          ))}
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
            // 预设只是起点——真实的组合都在杆与杆的缝隙里
          </span>
        </div>
        {POLICY_LEVERS.map((lever) => (
          <RangeRow key={lever.id} lever={lever} value={levers[lever.id]} onChange={setLever} />
        ))}
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 各杆「中性参考」即默认值：赤字率 3.0% / 利率 0bp / 专项债 3.9 万亿 / 汇率弹性 50 / 产业强度 40
        </p>
      </Card>

      {/* 2 —— 八季度轨迹 */}
      <Card title="② 八季度轨迹 · 时滞让代价后置">
        <EChart option={trajOption} style={{ height: 320 }} />
        <Grid cols={4} gap="0.75rem" className="mt-4">
          {MACRO_STATES.map((s) => (
            <div key={s.id} className="min-w-0">
              <div className="text-xs font-semibold mb-1" style={{ color: s.color }}>{s.label}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 虚线为警戒位：增长 4.5（左轴）、通胀 2.5（左轴）；就业与杠杆挂右轴
        </p>
      </Card>

      {/* 3 —— 象限判定 */}
      <Card title="③ 象限判定 · 末季落点与四态损益">
        <div
          className="rounded-lg p-5 mb-4"
          style={{
            background: `${verdict.color}14`,
            border: `1px solid ${verdict.color}55`,
            borderLeft: `4px solid ${verdict.color}`,
          }}
        >
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="text-2xl font-bold" style={{ color: verdict.color }}>{verdict.label}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
              第 8 季末判定 · 基准日 {MACRO_AS_OF}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{verdict.note}</p>
        </div>
        <Grid cols={4} gap="0.75rem">
          {MACRO_STATES.map((s) => (
            <DeltaChip key={s.id} state={s} value={traj[s.id][traj[s.id].length - 1]} />
          ))}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // Δ 为末季值减初值：增长/物价/就业涨绿跌红，杠杆相反——杠杆涨为红，今天的刺激就是明天的账单
        </p>
      </Card>

      {/* 4 —— 推演报告 */}
      <Card title="④ 推演报告 · 把这套组合写成一页 Markdown">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          按当前政策组合、八季度轨迹与末季判定生成确定性报告：政策杆取值表、轨迹关键点、机理解读与时滞结构备注。
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>📄 生成推演报告</button>
          {reportMd && (
            <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
              {copied ? '已复制 ✓' : '复制 Markdown'}
            </button>
          )}
        </div>
        {reportMd && (
          <pre
            className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
            style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
            }}
          >{reportMd}</pre>
        )}
      </Card>

      {/* 5 —— 框架三卡 + 页脚 */}
      <FrameworkTrio cards={[
        {
          title: '时滞的政治学', subtitle: '政绩在前 · 账单在后', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '财政当季见效、杠杆第 3 季计提；降息第 2 季拉增长、第 4 季抬通胀。时滞结构决定了刺激的收益归本届、成本归下届——调控的第一约束从来不是经济学，而是任期与账单到期日的错位。',
          pillars: [['错位', '收益与成本不同届。'], ['诱惑', '先刺激后买单。'], ['纪律', '对冲时滞靠制度。']],
        },
        {
          title: '工具的代价表', subtitle: '没有免费的杆', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '赤字与专项债共用一张杠杆账单；降息抬通胀、加息压就业；汇率管制把外部冲击转嫁给国内增长；产业政策最慢但不衰减。每根杆都标着价签——调控不是选最优解，是选可承受的代价组合。',
          pillars: [['财政', '刺激与利息同源。'], ['货币', '增长与物价互换。'], ['产业', '最慢却最持久。']],
        },
        {
          title: '不可能三角的中国式解法', subtitle: '弹性区间 · 相机抉择', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '汇率稳定、资本流动、货币自主不可兼得——教科书答案是三选二，实践答案是三个目标各取一段弹性区间，用管制阀门和逆周期工具在三角内部走折线：不追求角点解，追求可调头的中间态。',
          pillars: [['区间', '三目标各留余地。'], ['阀门', '管制即缓冲器。'], ['折线', '路径优先于落点。']],
        },
      ]} />
      <ModuleFooter
        moduleId="macro"
        links={[
          { to: '/sandbox', label: '治国沙盒', note: '把宏观杆放进危机情景：同一套工具在六域冲击下的对冲推演。' },
          { to: '/reform', label: '改革开放', note: '四十余年宏观调控范式的来路：从价格闯关到跨周期调节。' },
        ]}
        disclaimer="示意模型 · 思想工具 · 非投资建议 · 非预测"
      />
    </div>
  );
}
