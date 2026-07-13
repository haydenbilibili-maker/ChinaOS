import React, { useState, useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

// ============================================================================
// ⑮ 人生路径推演器 · 35→40 的五年推演
// ----------------------------------------------------------------------------
// 本页旗舰交互件，呼应全站「模拟器 DNA」：五根滑杆驱动一个确定性纯函数，
// 把五年里几个关键押注（现金流 / AI 杠杆 / 出海赌注 / 地域 / 团队）映射成
// 五维结果（自由度 / 预期收入 / 抗风险 / 意义感 / 本地适应），并给一句冷峻研判。
// 机理是自评示意标定，非任何预测或承诺；全程零随机、零当前时间，同输入同输出。
// 口径：私享自画像 · 本人自述 · 自评示意标定 · 非预测非承诺 · 仅供自我校准。
// ============================================================================


// 色板（与全站一致）
const C = {
  red: '#c41e3a', cyan: '#22d3ee', gold: '#e8a317',
  green: '#10b981', violet: '#8b5cf6', orange: '#fb923c', slate: '#94a3b8',
};

// 五根杠杆：key / 标签 / 副提示 / accent / 两端语义
const LEVERS = [
  { key: 'cash', label: '现金流储备', accent: C.green,
    hint: '跑道月数：所有冒险的安全边际', left: '月光', right: '36+ 月' },
  { key: 'ai', label: 'AI 杠杆', accent: C.cyan,
    hint: '用 AI 放大个人产能的程度', left: '不用', right: '深度嵌入' },
  { key: 'overseas', label: '出海赌注', accent: C.gold,
    hint: '压在「出海 2.0」上的资源比例', left: '不下注', right: '梭哈' },
  { key: 'region', label: '地域押注', accent: C.violet,
    hint: '0=留东北长春 … 100=回一线/海外', left: '长春', right: '一线/海外' },
  { key: 'team', label: '团队规模', accent: C.orange,
    hint: '0=纯一人公司 … 100=重团队', left: '一人', right: '重团队' },
];

const RESULT_DIMS = ['自由度', '预期收入', '抗风险', '意义感', '本地适应'];

// —— 确定性纯函数：levers(0..100) → 五维结果(0..100) ——
// 机理（自洽、自评示意，非预测）：
//  · AI 杠杆↑：直接抬自由度与收入（产能放大），但要现金流垫底——
//    现金不足时，AI 带来的收益要打折（cashFloor 抑制其释放）。
//  · 出海赌注↑：抬收入「上限」（红利想象空间），但红利不确定，
//    赌注越重抗风险越低；且出海需要 AI 工具与一线/海外资源配合才能兑现。
//  · 地域押注偏一线/海外：抬收入与机会，但压低「本地适应」与成本友好度
//    （长春的低成本是抗风险的隐性补贴，离开即失去）。
//  · 团队规模↑：抬产能上限（收入天花板），但压低自由度、且持续烧现金流。
//  · 现金流储备：是一切冒险的地板。低现金流时抗风险与意义感都打折
//    （焦虑会侵蚀长期投入的从容）。
// 所有系数为手工标定常量，clamp 到 0..100；无随机、无 Date。
function simulate(levers) {
  const { cash, ai, overseas, region, team } = levers;
  // 归一化到 0..1，便于写机理
  const n = (v) => Math.max(0, Math.min(100, v)) / 100;
  const Ca = n(cash), Ai = n(ai), Ov = n(overseas), Re = n(region), Te = n(team);

  // 现金流地板：现金越低，对冒险收益的「释放系数」越低（0.55..1.0）
  const cashFloor = 0.55 + 0.45 * Ca;

  // —— 自由度：AI 放大个人产能 + 留小城 + 一人公司都更自由；现金充裕给底气 ——
  // 团队越重越不自由；现金不足时 AI 的自由度红利打折。
  const freedom = 22
    + 42 * Ai * cashFloor      // AI 提自由度，但需现金垫底
    + 14 * Ca                  // 现金本身=自由
    + 10 * (1 - Te)            // 一人公司更自由
    + 8 * (1 - Re);            // 留小城、半径小但更自主

  // —— 预期收入：出海上限 + 一线机会 + AI 产能 + 团队天花板；皆需现金兑现 ——
  // 出海/一线/团队抬「上限」，但都靠 AI 与现金把潜力落地（cashFloor）。
  const income = 18
    + 26 * Ov * (0.5 + 0.5 * Ai)   // 出海红利需 AI 工具配合兑现
    + 20 * Re                       // 一线/海外的机会密度
    + 18 * Ai * cashFloor           // AI 直接放大个人产能
    + 14 * Te * cashFloor;          // 团队抬天花板，但要现金养

  // —— 抗风险：现金是主梁；出海赌注与重团队烧钱拉低；留小城成本友好补血 ——
  const resilience = 30
    + 40 * Ca                  // 现金=安全边际主力
    - 24 * Ov                  // 出海红利不确定，越赌越脆
    - 16 * Te * (1 - Ca)       // 重团队在现金不足时尤其危险
    + 14 * (1 - Re);           // 长春低成本=隐性抗风险补贴

  // —— 意义感：出海 2.0 与 AIGC 是热爱所在 + 自主权；现金不足时焦虑打折 ——
  const meaning = (28
    + 22 * Ov                  // 出海 2.0 是叙事与热爱
    + 18 * Ai                  // AIGC 前沿带来的兴奋
    + 12 * (1 - Te)            // 为自己而非为平台调度
    + 10 * Re)                 // 更大的舞台带来意义
    * (0.7 + 0.3 * Ca);        // 焦虑（低现金）侵蚀从容

  // —— 本地适应：偏一线/海外即离开长春根系；重团队与高出海赌注加深抽离 ——
  const local = 78
    - 52 * Re                  // 越往一线/海外，越远离东北根系
    - 12 * Ov                  // 出海注意力外移，本地脱节
    - 8 * Te;                  // 重团队多在外地，本地黏性下降

  const clamp = (v) => Math.round(Math.max(0, Math.min(100, v)));
  return {
    自由度: clamp(freedom),
    预期收入: clamp(income),
    抗风险: clamp(resilience),
    意义感: clamp(meaning),
    本地适应: clamp(local),
  };
}

// —— 研判：按结果组合给四档冷峻判语（确定性，仅看阈值）——
function verdict(r, levers) {
  const { 自由度: f, 预期收入: inc, 抗风险: res, 意义感: mean } = r;
  const { ai, overseas } = levers;
  // 超级个体跑通：AI 高 + 自由度与收入双高 + 不至于裸奔
  if (ai >= 55 && f >= 62 && inc >= 58 && res >= 45) {
    return {
      tag: '超级个体跑通', color: C.cyan,
      text: '现金垫底、AI 加杠杆，一人或小队把产能放大到平台级——自由度与收入同时在线。这是这张牌面里最锋利的一条路，前提是别把现金流花到见底。',
    };
  }
  // 孤注一掷：出海赌注重 + 抗风险被打穿
  if (overseas >= 60 && res < 42) {
    return {
      tag: '孤注一掷', color: C.red,
      text: '资源压在出海 2.0 上，红利窗口却在身后关闭——收入的想象空间很大，抗风险已被赌注掏空。赢则翻盘，输则没有第二条命，先把跑道续到 18 个月再谈。',
    };
  }
  // 稳健过渡：抗风险与意义都过线，没有任何一维崩盘
  if (res >= 55 && mean >= 50 && f >= 45) {
    return {
      tag: '稳健过渡', color: C.green,
      text: '不押极端、留足现金、用 AI 慢慢加力——五维没有塌角。35→40 不求一战封神，先把进程稳稳迁移到下一个可持续的运行态，这是给自己留余量的活法。',
    };
  }
  // 守成待变：低风险但低增长、收入与意义偏冷
  return {
    tag: '守成待变', color: C.slate,
    text: '杠杆都收着、押注都很轻——抗风险够高，但收入与意义感偏冷，更像在等下一个窗口。安全，却也在消耗 35 岁仅剩的进取期；守可以，别守太久。',
  };
}

// —— 三套预设 ——
const PRESETS = [
  { id: 'super', label: 'AI 超级个体', accent: C.cyan,
    levers: { cash: 70, ai: 92, overseas: 30, region: 35, team: 15 } },
  { id: 'overseas2', label: '出海 2.0 重启', accent: C.gold,
    levers: { cash: 45, ai: 75, overseas: 88, region: 80, team: 60 } },
  { id: 'northeast', label: '东北稳扎', accent: C.green,
    levers: { cash: 80, ai: 55, overseas: 20, region: 12, team: 20 } },
];

const DEFAULT_LEVERS = { cash: 60, ai: 70, overseas: 45, region: 40, team: 30 };

function radarOption(result) {
  return {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: RESULT_DIMS.map((d) => ({ name: d, max: 100 })),
      center: ['50%', '54%'],
      radius: '66%',
      axisName: { color: LABEL.color, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: GRID_LINE.lineStyle.color } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [{
        name: '五年推演',
        value: RESULT_DIMS.map((d) => result[d]),
        lineStyle: { color: C.cyan, width: 2 },
        itemStyle: { color: C.cyan },
        areaStyle: { color: C.cyan, opacity: 0.14 },
        label: { show: true, color: LABEL.color, fontSize: 10, formatter: (p) => p.value },
      }],
    }],
  };
}

function Slider({ lever, value, onChange }) {
  return (
    <div className="os-card p-3" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lever.label}</span>
        <span className="mono text-sm font-bold" style={{ color: lever.accent }}>{value}</span>
      </div>
      <p className="text-xs mb-2 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{lever.hint}</p>
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={(e) => onChange(lever.key, Number(e.target.value))}
        className="w-full"
        style={{ accentColor: lever.accent, cursor: 'pointer' }}
        aria-label={lever.label}
      />
      <div className="flex items-center justify-between mt-1 mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <span>{lever.left}</span><span>{lever.right}</span>
      </div>
    </div>
  );
}

export default function SectionSimulator() {
  const [levers, setLevers] = useState(DEFAULT_LEVERS);

  const setLever = (key, v) => setLevers((prev) => ({ ...prev, [key]: v }));
  const applyPreset = (p) => setLevers({ ...p.levers });

  // 确定性纯函数重算：同输入同输出，无随机、无时间
  const result = useMemo(() => simulate(levers), [levers]);
  const opt = useMemo(() => radarOption(result), [result]);
  const v = useMemo(() => verdict(result, levers), [result, levers]);

  return (
    <Card title="⑮ 人生路径推演器 · 35→40 的五年推演">
      <p className="text-sm mb-5 max-w-3xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        把未来五年的几个关键押注拧成五根滑杆——现金流垫底、AI 加杠杆、出海下注、地域取舍、团队轻重，
        看它们如何在<strong style={{ color: 'var(--text-primary)' }}>自由度 / 预期收入 / 抗风险 / 意义感 / 本地适应</strong>之间彼此挤压。
        机理是确定性的，没有运气项：同样的牌面，永远落到同样的结局。
      </p>

      {/* 预设 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="mono text-xs mr-1" style={{ color: 'var(--text-tertiary)' }}>// 一键载入剧本</span>
        {PRESETS.map((p) => (
          <button
            key={p.id} type="button" onClick={() => applyPreset(p)}
            className="rounded-md px-3 py-1.5 text-sm font-semibold transition-colors"
            style={{
              background: `color-mix(in srgb, ${p.accent} 14%, var(--bg-base))`,
              color: p.accent,
              border: `1px solid color-mix(in srgb, ${p.accent} 40%, transparent)`,
              cursor: 'pointer',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:gap-6" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        {/* 左：五根滑杆 */}
        <div className="grid gap-3" style={{ alignContent: 'start' }}>
          {LEVERS.map((lv) => (
            <Slider key={lv.key} lever={lv} value={levers[lv.key]} onChange={setLever} />
          ))}
        </div>

        {/* 右：雷达 + 研判 */}
        <div className="flex flex-col">
          <div className="os-card p-2" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
            <EChart option={opt} style={{ height: 320 }} />
          </div>
          <div
            className="os-card p-4 mt-4"
            style={{ background: 'var(--bg-base)', border: `1px solid color-mix(in srgb, ${v.color} 45%, transparent)` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>研判</span>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded mono"
                style={{ background: `color-mix(in srgb, ${v.color} 18%, transparent)`, color: v.color }}
              >
                {v.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.text}</p>
          </div>
        </div>
      </div>

      <p className="text-xs mt-5 pt-3 mono" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}>
        情景推演 · 非预测非承诺 · 仅供自我校准 —— 机理为自评示意标定，确定性纯函数，零随机零时间。
      </p>
    </Card>
  );
}
