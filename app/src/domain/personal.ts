import type { Proximity, Regime } from './governance.ts';
import { proximityBand } from './governanceVerdict.ts';

/** 决策类型：防御 / 进攻 / 期权 / 锚点 */
export type DecisionKind = 'defense' | 'offense' | 'option' | 'anchor';

export type DecisionFieldKey = 'cost' | 'flow' | 'now';

export interface DecisionField {
  key: DecisionFieldKey;
  label: string;
  /** 空字符串表示未填 */
  value: number | '';
}

export interface Decision {
  id: string;
  kind: DecisionKind;
  tag: string;
  tagCls: string;
  deckCls: string;
  name: string;
  /** 可迁移性（罗盘横轴） */
  transferable: boolean;
  /** 是否产生现金流（罗盘纵轴） */
  hasCashflow: boolean;
  fields: DecisionField[];
  /** 决策复盘注记（verbatim 文案） */
  note: string;
}

/** 个人四层垫子 · 区别于 governance.CushionLayer 的国家对照版 */
export interface PersonalCushionLayer {
  name: string;
  q: string;
  /** 0–100 厚度刻度 */
  score: number | '';
  color: string;
  verdict: string;
  /** 制度垫等：用户自砌标记 */
  selfBuilt?: boolean;
}

export interface RunwayInput {
  /** 当前可动用现金（万元） */
  cash: number | '';
  /** 月必需支出（元） */
  expense: number | '';
  /** 门店月分红（元） */
  divid: number | '';
  /** 压力情景：分红剩余比例（%） */
  stress: number | '';
}

export interface DecisionCalcResult {
  label1: string;
  value1: string;
  color1: string;
  label2: string;
  value2: string;
  color2: string;
}

export interface RunwayScenario {
  months: number;
  label: string;
  color: string;
  display: string;
}

export interface RunwayResult {
  scenarios: RunwayScenario[];
  gap: number;
  gapDisplay: string;
  gapColor: string;
}

export type PersonalStance = '守成' | '备战' | '预热' | '进攻';

export interface PersonalVerdictResult {
  key: string;
  stance: PersonalStance;
  headline: string;
  body: string;
  kick: string;
}

export const PERSONAL_STORAGE_KEY = 'chinaos.personal.v1';
export const PERSONAL_REVIEW_ROUTE = '/modules/personal-review';

export interface PersonalReviewState {
  decisions: Decision[];
  cushions: PersonalCushionLayer[];
  runway: RunwayInput;
  /** 用户自定义罗盘待兑现区条目 */
  pendingItems: string[];
}

/** 格式化数字 · 与参考 HTML fmt 一致 */
export function fmt(n: number, d = 1): string {
  return Number.isFinite(n) ? n.toFixed(d) : '—';
}

function num(v: number | ''): number {
  if (v === '' || v == null) return 0;
  return Number(v) || 0;
}

/** 决策卡实时演算 · 与 hayden-decision-review.html calcAll 一致 */
export function calcDecisionStats(decision: Decision): DecisionCalcResult {
  const costField = decision.fields.find((f) => f.key === 'cost');
  const flowField = decision.fields.find((f) => f.key === 'flow');
  const nowField = decision.fields.find((f) => f.key === 'now');

  if (decision.id === 'pension') {
    const pc = num(costField?.value) * 10000;
    const pf = num(flowField?.value);
    const pYr = pf * 12;
    const pBack = pYr > 0 ? pc / pYr : NaN;
    const pRoi = pc > 0 ? (pYr / pc) * 100 : NaN;
    return {
      label1: '静态回收期',
      value1: `${fmt(pBack)} 年`,
      color1: 'var(--def)',
      label2: '年化回报',
      value2: `${fmt(pRoi)}%`,
      color2: 'var(--def)',
    };
  }

  if (decision.id === 'store') {
    const sc = num(costField?.value) * 10000;
    const sf = num(flowField?.value);
    const sYr = sf * 12;
    const sBack = sYr > 0 ? (sc / sYr) * 12 : NaN;
    const sRoi = sc > 0 ? (sYr / sc) * 100 : NaN;
    return {
      label1: '静态回收期',
      value1: `${fmt(sBack)} 个月`,
      color1: 'var(--off)',
      label2: '年化回报',
      value2: `${fmt(sRoi, 0)}%`,
      color2: 'var(--off)',
    };
  }

  // house / generic property
  const hc = num(costField?.value);
  const hn = num(nowField?.value);
  const hGain = hc > 0 ? ((hn - hc) / hc) * 100 : NaN;
  return {
    label1: '账面增值',
    value1: hc > 0 ? `+${fmt(hGain, 0)}%` : '—',
    color1: 'var(--def)',
    label2: '月供负担（全款）',
    value2: '¥0',
    color2: 'var(--def)',
  };
}

export type CompassQuadrant =
  | 'anchor'
  | 'productive'
  | 'valueTrap'
  | 'pending';

/** 罗盘象限分类 */
export function classifyCompassQuadrant(
  transferable: boolean,
  hasCashflow: boolean,
): CompassQuadrant {
  if (hasCashflow && !transferable) return 'anchor';
  if (hasCashflow && transferable) return 'productive';
  if (!hasCashflow && !transferable) return 'valueTrap';
  return 'pending';
}

function runwayColor(months: number): string {
  if (months === Infinity) return 'var(--off)';
  if (months >= 12) return 'var(--off)';
  if (months >= 6) return 'var(--warn)';
  return 'var(--risk)';
}

function runwayDisplay(months: number): string {
  return months === Infinity ? '∞' : `${fmt(months, 1)} 月`;
}

/** 安全垫三情景压力测试 · 与参考 HTML calcRunway 一致 */
export function calcRunway(input: RunwayInput): RunwayResult {
  const cash = num(input.cash) * 10000;
  const exp = num(input.expense);
  const div = num(input.divid);
  const st = num(input.stress) / 100;

  const netA = exp - div;
  const monA = netA <= 0 ? Infinity : cash / netA;

  const netB = exp - div * st;
  const monB = netB <= 0 ? Infinity : cash / netB;

  const monC = exp <= 0 ? Infinity : cash / exp;

  const target = 12;
  const gap = Math.max(0, target * exp - cash);

  return {
    scenarios: [
      { months: monA, label: '情景A · 分红正常', color: runwayColor(monA), display: runwayDisplay(monA) },
      {
        months: monB,
        label: `情景B · 分红降至 ${st * 100}%`,
        color: runwayColor(monB),
        display: runwayDisplay(monB),
      },
      { months: monC, label: '情景C · 门店全停', color: runwayColor(monC), display: runwayDisplay(monC) },
    ],
    gap,
    gapDisplay: gap > 0 ? `¥${(gap / 10000).toFixed(1)}万` : '已达标',
    gapColor: gap > 0 ? 'var(--warn)' : 'var(--off)',
  };
}

const PERSONAL_VERDICTS: Record<string, Omit<PersonalVerdictResult, 'key'>> = {
  'defense+quiet': {
    stance: '守成',
    headline: '防御态势 · 窗口尚远 — 守成',
    body:
      '宏观信号灯仍处防御，三力亦未逼近临界。个人策略与体制读数同频：<b>封风险、进生产性资产、长账本</b>——但不宜抢跑，以窄而深积累现金流与可迁移能力为主。',
    kick: '账本在长。不是叙事在长，是账本在长。<b>你已经在「有为」那一格里了。剩下的，是不要在牌桌打开之前，把自己耗空。</b>',
  },
  'defense+building': {
    stance: '守成',
    headline: '防御态势 · 压力积蓄 — 守成',
    body:
      '信号灯防御、三力积蓄——政策治本未启动，但「不改」的成本正在积累。个人维持守成主仓：<b>封尾部风险、保生产性现金流、增厚可迁移账本</b>；勿因压力读数 alone 转向高杠杆进攻。',
    kick: '账本在长。不是叙事在长，是账本在长。<b>你已经在「有为」那一格里了。剩下的，是不要在牌桌打开之前，把自己耗空。</b>',
  },
  'defense+imminent': {
    stance: '备战',
    headline: '防御态势 · 窗口逼近 — 备战',
    body:
      '信号灯仍处防御，但三力已逼近临界——<b>表面未改、代价逼近</b>。个人不宜抢跑，但须<b>备好方案清单与安全垫</b>：窗口可能突然打开，而你必须有本钱撑到它开。',
    kick: '改革窗口极其短暂。<b>安全垫的意义不是收益，是「在窗口打开时，你有资格等」。</b>',
  },
  'watch+building': {
    stance: '预热',
    headline: '观察态势 · 临界僵持 — 预热',
    body:
      '信号灯处于观察区、三力积蓄——部分治本信号松动，不改的成本正在追平。个人可<b>预热</b>：保持防御主仓，紧盯平减闸门与通缩读数；信号灯长期无绿灯 + 三力持续升压 = 僵局代价复利。',
    kick: '最需警惕「慢性化」——<b>危机被拉长，改革功能被消解。预热不是进攻，是把账本与现金垫调到「窗口一开就能动」。</b>',
  },
  'offense+any': {
    stance: '进攻',
    headline: '治本确认 · 可切进攻',
    body:
      '治本闸门已开，态势许可由防御切进攻。无论三力压力读数如何，政策面已承认再平衡方向——<b>顺周期放量与结构性复苏可能重叠，但窗口极其短暂。</b>',
    kick: '方案写完再动，不抢跑于单一指标。<b>你已经在「有为」那一格里了——进攻期更忌把表达误认为积累。</b>',
  },
};

const PERSONAL_VERDICT_FALLBACK: Omit<PersonalVerdictResult, 'key'> = {
  stance: '守成',
  headline: '双仪表交叉读数',
  body: '信号灯与三力读数处于非典型组合。并用两仪表：一个回答「改没改」，一个回答「何时被迫改」。',
  kick: '参照矩阵四象限（守成 / 备战 / 预热 / 进攻）校准个人仓位。',
};

/**
 * PersonalVerdict 联动矩阵
 * defense+quiet/building→守成 · defense+imminent→备战 · watch+building→预热 · offense+any→进攻
 */
export function computePersonalVerdict(
  regime: Regime,
  proximityScore: number,
): PersonalVerdictResult {
  const band = proximityBand(proximityScore);

  let key: string | null = null;
  if (regime === 'offense') key = 'offense+any';
  else if (regime === 'defense' && band === 'imminent') key = 'defense+imminent';
  else if (regime === 'defense' && (band === 'quiet' || band === 'building')) {
    key = band === 'quiet' ? 'defense+quiet' : 'defense+building';
  } else if (regime === 'watch' && band === 'building') key = 'watch+building';

  const picked = key ? PERSONAL_VERDICTS[key] : PERSONAL_VERDICT_FALLBACK;
  return { key: key ?? 'fallback', ...picked };
}

/** 三笔关键决策 · 结构模板（数值留空，文案 verbatim） */
export function blankDecisionTemplates(): Decision[] {
  return [
    {
      id: 'pension',
      kind: 'defense',
      tag: '防御',
      tagCls: 't-def',
      deckCls: 'd-def',
      name: '母亲养老保险（买断）',
      transferable: false,
      hasCashflow: true,
      fields: [
        { key: 'cost', label: '一次性投入（万元）', value: '' },
        { key: 'flow', label: '每月现金流（元）', value: '' },
      ],
      note:
        '<b>三笔里最被低估、也最高明的一笔。</b>它买断的不是收益，是风险——一个东北下岗工人家庭最大的尾部风险，就是父母无养老金无医保，一场大病直接击穿整个家庭并永久锁死你的现金流。<b>你用 15 万，把这个能吞噬你未来二十年自由的黑洞封住了。真实回报不是年化数字，是"我妈老了我不会被拖垮"这个自由。</b>',
    },
    {
      id: 'store',
      kind: 'offense',
      tag: '进攻',
      tagCls: 't-off',
      deckCls: 'd-off',
      name: '山海造物门店（生产性）',
      transferable: true,
      hasCashflow: true,
      fields: [
        { key: 'cost', label: '投入（万元）', value: '' },
        { key: 'flow', label: '每月分红（元）', value: '' },
      ],
      note:
        '<b>你唯一一笔真正的生产性投资。</b>模型的核心纪律是：通缩里压消费性/资产性杠杆，进生产性/能自偿的投资——你做到了。更关键的是性质：它不是被动财务投资，<b>它就是你的账本本身</b>，与品牌、内容、身份一体。<b>注意：160% 级别的回报不可持续（见风险 R1 压力测试）。</b>',
    },
    {
      id: 'house',
      kind: 'defense',
      tag: '锚点',
      tagCls: 't-def',
      deckCls: 'd-def',
      name: '白泉镇房产（全款）',
      transferable: false,
      hasCashflow: false,
      fields: [
        { key: 'cost', label: '购入（万元）', value: '' },
        { key: 'now', label: '现估值（万元）', value: '' },
      ],
      note:
        '看似最"不理性"，实则三处精准：<b>①全款——在"通缩自动抬高实际债务"的环境里，你没背任何按揭，避开了这代人最大的陷阱。②靠近学校医院——人口收缩的县镇里，唯一还有需求支撑的就是医教资源周边。③它的功能不是投资标的，是"家庭锚点"</b>——它的价值该用"它让你敢于离开、敢于折腾"来衡量。',
    },
  ];
}

export function blankCushionTemplates(): PersonalCushionLayer[] {
  return [
    {
      name: '国家垫',
      q: '时代给的',
      score: '',
      color: 'var(--warn)',
      verdict:
        '成长于中国最好的二十年，吃到移动互联网与出海红利；<b>但黄金十年恰好是旧引擎熄火的十年</b>。此层无法选择。',
    },
    {
      name: '家庭垫',
      q: '起点',
      score: '',
      color: 'var(--risk)',
      verdict:
        '<b>极薄，且是你自己后来砌上去的。</b>零家庭资本启动，甚至需反哺。<b>你不是在管理继承来的资产，你是在从零构筑一个家庭的资产负债表。</b>',
    },
    {
      name: '制度垫',
      q: '谁在下面接着',
      score: '',
      color: 'var(--off)',
      selfBuilt: true,
      verdict:
        '<b>你自己买的。</b>15 万买断母亲养老金 = 亲手为家庭砌的制度垫。<b>国家没给的，你自己补上了。</b>',
    },
    {
      name: '时间垫',
      q: '还剩多少年',
      score: '',
      color: 'var(--off)',
      verdict:
        '33 岁。<b>最关键的一层——你还有时间</b>，且位置极佳：<b>旧引擎已熄火（无沉没成本），新引擎（AI）刚点火（还赶得上）</b>。远优于 45 岁、房贷未清、在大厂被优化的人。',
    },
  ];
}

export function blankRunwayInput(): RunwayInput {
  return { cash: '', expense: '', divid: '', stress: '' };
}

export function blankPersonalState(): PersonalReviewState {
  return {
    decisions: blankDecisionTemplates(),
    cushions: blankCushionTemplates(),
    runway: blankRunwayInput(),
    pendingItems: [],
  };
}

/** R1/R2/R3 · verbatim */
export const PERSONAL_RISKS = [
  {
    id: 'R1',
    title: '现金流的脆弱性',
    body:
      '收入结构 = <b>高波动主业 + 门店分红</b>。月分红 2 万是很好的基础现金流，但<b>高度依赖两家店的经营</b>——长春门店的抗风险能力，在东北宏观环境下要打问号。<b>你缺一个"就算全停摆也能撑 12–18 个月"的现金安全垫。</b>',
    fix: '<b>修复</b>：见下方安全垫计算器。安全垫不是为了收益，<b>是为了在窗口打开时你有资格等</b>。',
  },
  {
    id: 'R2',
    title: '账本的"可兑换性"',
    body:
      '接御宅族那面镜子：你的能力（出海/冷启动/AI）<b>高度可兑换，这很好</b>。但要警惕——<b>若山海造物做成纯粹"自我表达"的品牌（很美、有调性、但不产生现金流和规模），它就会从"账本"退化成"精美的收藏架"。</b>',
    fix: '<b>修复</b>：超个体最容易掉的坑是<b>把"表达"误认为"积累"</b>。定期做账本测试：这个月，是作品/技能/资产变厚了，还是只有叙事变厚了？',
  },
  {
    id: 'R3',
    title: '能力绑定在"增长"上，而增长的时代正在结束',
    body:
      '核心竞争力是"从 0 到 1 做增长"——<b>增量时代的黄金技能</b>。但在存量时代，市场需要的可能不是"增长专家"，而是<b>"存量运营专家"或"利润专家"</b>。',
    fix: '<b>修复</b>：主动转型——<b>从"把 DAU 做到 300 万"，转向"把 100 个人的生意做到极致的利润和忠诚"</b>。山海造物恰恰是这个转型的最好载体。',
  },
] as const;

export const VALUE_TRAP_COPY = {
  empty: '— 空 —',
  hint: '（大城市按揭房 / 纯收藏 / 纯表达型品牌）',
} as const;
