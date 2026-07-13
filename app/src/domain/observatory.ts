import type { Proximity, Regime } from './governance.ts';
import { proximityBand } from './governanceVerdict.ts';
import { computePersonalVerdict } from './personal.ts';

export const OBSERVATORY_AS_OF = '2026-07-13';
export const OBSERVATORY_MODULE_COUNT = 6;

export interface ObservatoryGauge {
  label: string;
  word: string;
  score: number;
  color: string;
  description: string;
}

export interface ObservatoryAction {
  index: string;
  title: string;
  description: string;
}

export interface ObservatoryVerdict {
  key: string;
  headline: string;
  explanation: string;
  stance: string;
}

export interface ObservatoryTrigger {
  c1GateOpen: boolean;
  c1Label: string;
  c1Color: string;
}

export interface NarrativeModuleReadout {
  text: string;
  color: string;
}

export interface NarrativeModule {
  id: string;
  name: string;
  question: string;
  route: string;
  readout: NarrativeModuleReadout;
  highlight?: boolean;
}

export interface NarrativeStage {
  id: string;
  index: string;
  title: string;
  question: string;
  modules: NarrativeModule[];
}

export interface ObservatoryReading {
  asOf: string;
  signalGauge: ObservatoryGauge;
  forceGauge: ObservatoryGauge;
  verdict: ObservatoryVerdict;
  actions: ObservatoryAction[];
  trigger: ObservatoryTrigger;
  stages: NarrativeStage[];
}

const SIGNAL_GAUGE_DESC =
  '中央加杠杆已实质推进（赤字率 4%，增量全由中央承担），' +
  '但钱仍流向"物"而非"人"——20 万亿城市更新 vs 1000 亿育儿补贴。<b>治本未启动。</b>';

const FORCE_GAUGE_DESC =
  '外需贡献率骤降至不足 15%、通缩连续三年、新生儿 793 万创新低。' +
  '压力在升，但体制的慢性化能力极强。<b>窗口未开，代价在累积。</b>';

export const OBSERVATORY_ACTIONS: ObservatoryAction[] = [
  {
    index: '01',
    title: '补安全垫',
    description:
      '目标 12–18 个月。<b>安全垫不是为了收益，是为了在窗口打开时，你有资格等。</b>',
  },
  {
    index: '02',
    title: '只进生产性杠杆',
    description:
      '能自偿、有贴息、产生现金流的债可进；消费性/资产性杠杆要收——通缩会自动抬高实际债务。',
  },
  {
    index: '03',
    title: '账本加速',
    description: '作品、技能、可迁移资产。<b>账本在长是有为，只有叙事在长是沉沦。</b>',
  },
  {
    index: '04',
    title: '进攻清单就位',
    description: '先写好、别先下注。扳机扣响时，胜出的是早已把方案写完的人。',
  },
];

const OBSERVATORY_VERDICTS: Record<string, Omit<ObservatoryVerdict, 'key'>> = {
  'defense+building': {
    stance: '备战',
    headline: '僵局代价累积中 —— 个人取「备战」姿态',
    explanation:
      '不改，但压力正在逼近。这是最需要克制、也最需要准备的阶段：' +
      '<b>不抢跑（扳机未到），但也不能空着手等</b>。' +
      '改革不会因为有人被说服而发生，只会因为"不改"终于变得比"改"更危险而发生——' +
      '<b>而窗口一旦打开，通常极其短暂。</b>',
  },
  'defense+imminent': {
    stance: '备战',
    headline: '表面未改 · 代价逼近 —— 个人取「备战」姿态',
    explanation:
      '信号灯仍处防御，但三力已逼近临界——政策读数显示治本未启动，「不改」的成本正在追上「改」。' +
      '<b>窗口可能突然打开，但个人不宜抢跑；须备好方案清单与安全垫。</b>',
  },
  'defense+quiet': {
    stance: '守成',
    headline: '双低读数 · 窗口尚远 —— 个人取「守成」姿态',
    explanation:
      '信号灯与三力均处低读数：政策治本未启动，外部与内部压力亦未逼近临界。' +
      '<b>以防御与「窄而深」求生为主，积累现金流与可迁移能力；勿将零星补贴误判为体制转向。</b>',
  },
  'watch+building': {
    stance: '预热',
    headline: '临界僵持 · 慢性化风险 —— 个人取「预热」姿态',
    explanation:
      '信号灯处于观察区、三力积蓄——部分治本信号松动，不改的成本正在追平。' +
      '<b>最需警惕「慢性化」：危机被国有银行体系与行政工具拉长，改革功能被消解。</b>',
  },
  'offense+any': {
    stance: '进攻',
    headline: '治本确认 · 可切「进攻」姿态',
    explanation:
      '治本闸门已开（A1 换锚或 C1 平减指数转正），态势许可由防御切进攻。' +
      '<b>顺周期放量与结构性复苏可能重叠——但历史证明窗口极其短暂；方案写完再动。</b>',
  },
};

const OBSERVATORY_FALLBACK: Omit<ObservatoryVerdict, 'key'> = {
  stance: '守成',
  headline: '双仪表交叉读数 —— 参照矩阵校准姿态',
  explanation:
    '信号灯与三力读数处于非典型组合。并用两仪表：一个回答「改没改」，一个回答「何时被迫改」。' +
    '<b>信号灯长期无绿灯 + 三力持续升压 = 僵局正在积累代价。</b>',
};

/** Regime × Proximity 观象台组合判词（固定文案，非 LLM） */
export function computeObservatoryVerdict(
  regime: Regime,
  proximityScore: number,
): ObservatoryVerdict {
  const band = proximityBand(proximityScore);

  let key: string | null = null;
  if (regime === 'offense') key = 'offense+any';
  else if (regime === 'defense' && band === 'imminent') key = 'defense+imminent';
  else if (regime === 'defense' && band === 'quiet') key = 'defense+quiet';
  else if (regime === 'defense' && band === 'building') key = 'defense+building';
  else if (regime === 'watch' && band === 'building') key = 'watch+building';

  const picked = key ? OBSERVATORY_VERDICTS[key] : OBSERVATORY_FALLBACK;
  return { key: key ?? 'fallback', ...picked };
}

export function regimeDisplay(regime: Regime): { word: string; color: string } {
  if (regime === 'offense') return { word: '进攻', color: 'var(--green)' };
  if (regime === 'watch') return { word: '观察', color: 'var(--amber)' };
  return { word: '防御', color: 'var(--red)' };
}

export function proximityDisplay(proximity: Proximity): { word: string; color: string } {
  if (proximity === 'imminent') return { word: '逼近', color: 'var(--red)' };
  if (proximity === 'building') return { word: '积蓄', color: 'var(--amber)' };
  return { word: '沉寂', color: 'var(--def)' };
}

export function computeObservatoryTrigger(c1GateOpen: boolean): ObservatoryTrigger {
  return {
    c1GateOpen,
    c1Label: c1GateOpen ? '开启' : '关闭',
    c1Color: c1GateOpen ? 'var(--green)' : 'var(--red)',
  };
}

export interface BuildObservatoryReadingInput {
  regime: Regime;
  regimeScore: number;
  regimeLabel: string;
  proximity: Proximity;
  proximityScore: number;
  proximityLabel: string;
  c1GateOpen: boolean;
  attributionIssueCount: number;
  cushionSummary: string;
  cushionColor: string;
  personalReadout: string;
  personalColor: string;
  routes: {
    threeForces: string;
    cognition: string;
    signalPanel: string;
    attribution: string;
    premierRadius: string;
    cushionMonitor: string;
    personalReview: string;
  };
}

/** 合成观象台第一屏 + 叙事链读数 */
export function buildObservatoryReading(input: BuildObservatoryReadingInput): ObservatoryReading {
  const regimeDisp = regimeDisplay(input.regime);
  const proxDisp = proximityDisplay(input.proximity);
  const verdict = computeObservatoryVerdict(input.regime, input.proximityScore);
  const personal = computePersonalVerdict(input.regime, input.proximityScore);

  return {
    asOf: OBSERVATORY_AS_OF,
    signalGauge: {
      label: '改没改 · 信号灯（治本进度）',
      word: regimeDisp.word,
      score: input.regimeScore,
      color: regimeDisp.color,
      description: SIGNAL_GAUGE_DESC,
    },
    forceGauge: {
      label: '何时被迫改 · 三力（压力合成）',
      word: proxDisp.word,
      score: input.proximityScore,
      color: proxDisp.color,
      description: FORCE_GAUGE_DESC,
    },
    verdict: {
      ...verdict,
      stance: personal.stance,
    },
    actions: OBSERVATORY_ACTIONS,
    trigger: computeObservatoryTrigger(input.c1GateOpen),
    stages: [
      {
        id: 'world',
        index: '壹',
        title: '世界',
        question: '我们在长波的哪里？',
        modules: [
          {
            id: 'three-forces',
            name: '三力监测仪',
            question: '外部压力 / 内部危机 / 认知迭代——何时会被迫改',
            route: input.routes.threeForces,
            readout: { text: `${proxDisp.word} · ${input.proximityScore}`, color: proxDisp.color },
          },
          {
            id: 'kondratiev',
            name: '康波定位（内建）',
            question: '第五轮尾部 / 第六轮安装期。AI 是候选引擎，卡在能源与分配两道闸',
            route: input.routes.cognition,
            readout: { text: '安装期·狂热段', color: 'var(--amber)' },
          },
        ],
      },
      {
        id: 'china',
        index: '贰',
        title: '中国',
        question: '为什么动不了？',
        modules: [
          {
            id: 'signal-panel',
            name: '宏观再平衡信号灯',
            question: 'A/B/C 三档 12 项信号——改没改',
            route: input.routes.signalPanel,
            readout: { text: `${regimeDisp.word} · ${input.regimeScore}`, color: regimeDisp.color },
          },
          {
            id: 'attribution',
            name: '三层归因分析器',
            question: '路线 / 决策 / 执行——这事该问责谁',
            route: input.routes.attribution,
            readout: {
              text: `${input.attributionIssueCount} 条已判定`,
              color: 'var(--def)',
            },
          },
          {
            id: 'premier-radius',
            name: '总理权限半径图谱',
            question: '1998→今 · 诊断权与处方权的分离',
            route: input.routes.premierRadius,
            readout: { text: '四任 · 单调收缩', color: 'var(--def)' },
          },
        ],
      },
      {
        id: 'peer',
        index: '叁',
        title: '同类',
        question: '别人躺下时垫着什么？',
        modules: [
          {
            id: 'cushion-monitor',
            name: '垫子厚度监测',
            question: '中 / 日 / 韩 / 美 四国对照 · 四层垫子',
            route: input.routes.cushionMonitor,
            readout: { text: input.cushionSummary, color: input.cushionColor },
          },
          {
            id: 'fate-matrix',
            name: '命运矩阵（内建）',
            question: '垫子 × 新牌桌 —— 是乘积，不是加法',
            route: input.routes.cushionMonitor,
            readout: { text: '风险象限门口', color: 'var(--red)' },
          },
        ],
      },
      {
        id: 'self',
        index: '肆',
        title: '我',
        question: '那我该怎么办？',
        modules: [
          {
            id: 'personal-review',
            name: '超个体决策复盘',
            question: '决策罗盘 / 四层垫子体检 / 安全垫计算器',
            route: input.routes.personalReview,
            readout: { text: input.personalReadout, color: input.personalColor },
            highlight: true,
          },
          {
            id: 'ledger-test',
            name: '账本测试（内建）',
            question: '系统坐标之外，是否有一本正在增长的账？',
            route: input.routes.personalReview,
            readout: { text: '期权持有中', color: 'var(--opt)' },
          },
        ],
      },
    ],
  };
}
