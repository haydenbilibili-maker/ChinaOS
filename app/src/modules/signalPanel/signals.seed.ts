import type { PowerLayer, Regime, SignalAttributionLink, SignalStatus } from '../../domain/governance.ts';
import { MACRO_BY_SIGNAL } from '../../domain/macro-indicators.ts';

export interface SignalSeed {
  id: string;
  name: string;
  w: number;
  status: SignalStatus;
  read: string;
  trig: string;
  attribution?: SignalAttributionLink;
}

export interface SignalSectionSeed {
  tier: string;
  title: string;
  desc: string;
  signals: SignalSeed[];
}

/** verbatim from chinaos-signal-dashboard1.html */
export const SIGNAL_SECTIONS: SignalSectionSeed[] = [
  {
    tier: 'A',
    title: '元改革信号',
    desc: '最高权重 · 决定态势切换',
    signals: [
      {
        id: 'A1',
        name: '考核指挥棒换锚',
        w: 3,
        status: 'red',
        read: '仍以增长为主刻度；中央 500 亿激励资金奖励地方"做大经济蛋糕"，居民收入/消费率未入约束性指标。',
        trig: '"居民消费率"进入中央经济工作会议/政府工作报告的约束性目标（质变信号）。',
        attribution: { issueId: 'dir-security-growth', layer: 'direction' },
      },
      {
        id: 'A2',
        name: '中央加杠杆',
        w: 3,
        status: 'green',
        read: '赤字率 4%，赤字增量 2300 亿全部由中央承担，中央占赤字 86.4%；3000 亿特别国债补充大行资本。日本镜子里"消防员自己着火"的死结正在解。',
        trig: '已实质推进；若 2027 赤字率再上抬且仍中央承担，确认决心强化。',
        attribution: { issueId: 'dec-deficit', layer: 'decision' },
      },
      {
        id: 'A3',
        name: '特别国债"投人 vs 投物"',
        w: 2,
        status: 'amber',
        read: '2500 亿以旧换新 + 约 1000 亿育儿补贴（投人）；但 8000 亿超长期国债仍偏"两重"基建（投物）。',
        trig: '投人占比明显抬升、超过投物增量。',
        attribution: { issueId: 'dec-deficit', layer: 'decision' },
      },
    ],
  },
  {
    tier: 'B',
    title: '居民端落地信号',
    desc: '中权重 · 决定消费能否起来',
    signals: [
      {
        id: 'B1',
        name: '育儿补贴标准',
        w: 1,
        status: 'amber',
        read: '全国统一 3600 元/孩/年（约 300 元/月）已破冰，惠及 3000 多万婴幼儿；剂量偏低。这是中国第一次大规模全国性直接现金转移。',
        trig: '标准显著上调（如翻倍）。',
        attribution: { issueId: 'dec-childcare-subsidy', layer: 'decision' },
      },
      {
        id: 'B2',
        name: '免费教育年限',
        w: 1,
        status: 'amber',
        read: '免费学前一年已落地。',
        trig: '延长至学前三年 / 向义务教育上下游扩展。',
        attribution: { issueId: 'dec-social-security', layer: 'decision' },
      },
      {
        id: 'B3',
        name: '居民基础养老金涨幅',
        w: 1,
        status: 'red',
        read: '城乡居民基础养老金月最低标准再 +20 元，挤牙膏式提升。',
        trig: '涨幅显著提速（脱离每年 +20 元节奏）。',
        attribution: { issueId: 'dec-social-security', layer: 'decision' },
      },
      {
        id: 'B4',
        name: '现金普发突破',
        w: 1,
        status: 'red',
        read: '仍走以旧换新 / 贷款贴息 / 有奖发票，绕开"发钱养懒汉"的意识形态坎。',
        trig: '出现面向特定群体的直接现金补贴（跨坎强信号）。',
        attribution: { issueId: 'dec-cash-transfer', layer: 'decision' },
      },
      {
        id: 'B5',
        name: '户籍与公共服务脱钩',
        w: 1,
        status: 'red',
        read: '仅社保扩面（灵活就业/新业态参保），户籍市民化最慢，三亿农民工需求未解锁。',
        trig: '积分落户放宽 / 随迁子女就学 / 社保全国统筹结算实质推进。',
        attribution: { issueId: 'dec-fiscal-relation', layer: 'decision' },
      },
    ],
  },
  {
    tier: 'C',
    title: '宏观确诊信号',
    desc: '验证药是否起效',
    signals: [
      {
        id: 'C1',
        name: 'GDP 平减指数转正（闸门）',
        w: 3,
        status: 'red',
        read: MACRO_BY_SIGNAL.C1?.read ?? '连续三年为负。报告称"有望 2026 二季度走出通缩"——当承诺核对。',
        trig: '连续两季由负转正并站稳（态势总确认闸门）。',
        attribution: { issueId: 'dec-deficit', layer: 'decision' },
      },
      {
        id: 'C2',
        name: '社零增速 vs 固投增速',
        w: 1,
        status: 'amber',
        read: '社零 6 月同比 +4.6% vs 固投累计 +3.6%：消费略跑赢投资，但差距未拉开，引擎切换待确认。',
        trig: '社零增速持续高于固定资产投资增速。',
        attribution: { issueId: 'dir-security-growth', layer: 'direction' },
      },
      {
        id: 'C3',
        name: '居民消费占 GDP 比重',
        w: 1,
        status: 'red',
        read: MACRO_BY_SIGNAL.C3?.read ?? '约 39%，主要经济体最低档（病根指标）。',
        trig: '该比重持续上行（结构性胜利）。',
        attribution: { issueId: 'dir-welfare-philosophy', layer: 'direction' },
      },
      {
        id: 'C4',
        name: '居民中长期贷款恢复',
        w: 1,
        status: 'red',
        read: MACRO_BY_SIGNAL.C4?.read ?? '信心体温计；资产负债表衰退是否缓解看此项。房价较峰值跌约 30%。',
        trig: '新增居民中长贷由缩转增并持续。',
        attribution: { issueId: 'dir-real-estate-role', layer: 'direction' },
      },
    ],
  },
];

export const DECISION_LANES = [
  {
    key: '创业',
    ico: 'CREATE',
    defense:
      '押政策顺风方向：服务消费 / 银发 / 托育 / 文旅 / 入境消费 / 出海。避开重资产、长回收、投资驱动的红海。超个体靠"窄而深的特定人群"穿越通缩，不依赖宏观总量。',
    offense:
      '需求总量回暖，可扩张产能与门店、加大投放；从"窄深求生"切到"顺周期放量"，抢服务消费复苏的 β。',
  },
  {
    key: '投资',
    ico: 'INVEST',
    defense:
      '防御为主：通缩下现金/高等级债实际购买力上升；偏好确定性分红的"类债"资产 + 政策顺风服务消费。房产托底非反弹，投资性加仓逻辑不成立。',
    offense:
      '切进攻：超配顺周期权益与困境反转资产。扳机 = 平减指数转正且社零持续超固投，不抢跑。',
  },
  {
    key: '融资',
    ico: 'FINANCE',
    defense:
      '主动薅政策：促内需专项资金下的经营贷贴息、设备更新贴息、民间投资担保。低成本资金投向能产生现金流的扩张，而非贬值资产。',
    offense:
      '融资窗口仍开且需求改善，放大生产性借贷、加速扩张；优先锁定长久期低成本资金。',
  },
  {
    key: '借贷',
    ico: 'CREDIT',
    defense:
      '通缩抬高实际债务：压消费性/资产性杠杆，保现金流安全垫；仅"生产性 + 有贴息 + 能自偿"的债可进。',
    offense:
      '通缩解除后实际债务负担下降，可适度提升杠杆；仍以能自偿的生产性负债为先。',
  },
];

export const SIGNAL_VAL: Record<SignalStatus, number> = { red: 0, amber: 0.5, green: 1 };

export const REGIME_META: Record<
  Regime,
  { word: string; cls: string; pos: number; sub: string }
> = {
  defense: {
    word: '防御',
    cls: 's-red',
    pos: 12,
    sub: '国家在做"中央加杠杆 + 补贴购买行为"的治标动作；治本（换考核 / 给家庭 / 松户籍）尚未启动。个人以防御为主，进攻扳机未到。',
  },
  watch: {
    word: '观察',
    cls: 's-amber',
    pos: 50,
    sub: '部分治本信号松动，处于临界区。保持防御主仓，备好进攻清单，等待闸门确认。',
  },
  offense: {
    word: '进攻',
    cls: 's-green',
    pos: 88,
    sub: '治本信号确认启动（换锚或平减指数转正）。可由防御切进攻，抢结构性复苏的先手。',
  },
};

export function allSignals(): SignalSeed[] {
  return SIGNAL_SECTIONS.flatMap((s) => s.signals);
}
