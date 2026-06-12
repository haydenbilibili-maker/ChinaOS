// ============================================================================
// 大国博弈推演桌 · 纯函数引擎（零 React · 仅依赖科技树纯数据层）
// ----------------------------------------------------------------------------
// 中美科技-经贸博弈的回合制思想实验：8 张抽象牌 × 5 回合 × 3 档对手策略
// + 两个第三方摇摆天平（欧盟/东盟）× 五条攻关目标线（由科技树 12 领域派生）。
// 安全红线：仅科技/经贸/产业维度的抽象博弈，不涉军事冲突情景；
//          牌名一律中性术语，不出现任何具体真实企业名。
// 声明：思想实验 / 分析框架 · 非预测 · 非政策倡导 · 双方收益矩阵为示意标定。
// 全部逻辑确定性纯函数：无随机数、无当前时间（基准日为常量字符串）。
// ============================================================================

import { DOMAINS } from '../techtree/domains.js';

export const WG_AS_OF = '2026-06-11';

export const MAX_TURNS = 5;     // 总回合数
export const AP_PER_TURN = 3;   // 每回合行动点
export const TECH_GROWTH = 1;   // 每回合科技线自然增长

export const SIDES = [
  { id: 'cn', label: '中方', color: '#c41e3a' },
  { id: 'us', label: '美方', color: '#22d3ee' },
];

// 初值标定：中方科技 52 起步——追赶者设定；经贸两线同为 70（深度互嵌的存量）。
export const INIT = {
  cn: { tech: 52, econ: 70 },
  us: { tech: 60, econ: 70 },
};

// ----------------------------------------------------------------------------
// 第三方摇摆方：tilt ∈ [-100, 100]，-100 完全亲美 · 0 中立 · +100 完全亲中。
// 初值标定：欧盟 -20（跨大西洋惯性，先天偏美一档）；东盟 +10（供应链互嵌，先天微偏中）。
// ----------------------------------------------------------------------------
export const THIRD_PARTIES = [
  { id: 'eu', label: '欧盟', color: '#8b5cf6', init: -20 },
  { id: 'asean', label: '东盟', color: '#10b981', init: 10 },
];

// 牌 → tilt 的确定性影响表（出牌当回合一次性结算，两个第三方同步加减；
// 持续牌只在打出那一回合计 tilt，驻留期间不逐回合重复计；重复打出被弃置的不计）。
// 机理：中方谈判/开放/标准 → 给摇摆方递的筹码越实在，倾中越多（+6/+8/+10）；
//      中方稀土筹码 → 胁迫的副作用：摇摆方兔死狐悲，向美侧离心（-8）；
//      美方出口管制/实体清单 → 管制溢出殃及盟友供应链，把摇摆方推向中方（+4）；
//      美方谈判窗口 → 展示可交易性，摇摆方回流美侧（-6）。
export const TILT_EFFECTS = {
  cn: { talk: 6, open_market: 8, std_alliance: 10, rare_earth: -8 },
  us: { export_control: 4, entity_list: 4, talk: -6 },
};

// 倾斜回合效应：|tilt| ≥ TILT_TIPPING 的第三方，每回合给倾向侧 econ 加成；
// 权重：欧盟体量大 → 1 × 1.5 向上取整 = +2；东盟 = +1。≥ TILT_SIDED 视为实质选边。
export const TILT_TIPPING = 40;
export const TILT_SIDED = 60;
const TILT_WEIGHT = { eu: 2, asean: 1 };

function clampTilt(v) { return Math.max(-100, Math.min(100, v)); }

/** 第三方天平初值表（旧档无 tilts 字段时按此补齐——向后兼容） */
function initialTilts() {
  return Object.fromEntries(THIRD_PARTIES.map((tp) => [tp.id, tp.init]));
}

// ----------------------------------------------------------------------------
// 攻关目标线：「自主攻关」驻留后的逐回合 tech 增益 = curve[当前回合-1]（替代原固定 +3）。
// 由科技树作战盘 12 领域（techtree/domains.js）确定性派生，共 5 条：
//   tier==='locked' 全部入列（半导体/脑机接口——受制者必上攻关桌），
//   再取 chase 中战略权重最高的若干补足（AI/航天/机器人）。
// 曲线派生规则（全确定性，无随机；见 deriveCurve）：
//   五回合总增益 = 13 + Math.round(weight / 50)——战略权重越高总增益越大（约 14-15）；
//   时间形状由 TRL 决定——trl≤5 后程爆发（前 2 回合 0，赌后程）；
//   trl 6-7 中段发力（峰值在第 3 回合）；trl≥8 线性平滑（逐回合稳定爬坡）。
// 旧档 litho/soft/aero 三个 id 已退役：引擎侧 resolveTurn 找不到 id 一律回退第一条，
// 展示侧（存档行）label 兜底为原 id 字符串——旧档不崩溃、不丢行。
// ----------------------------------------------------------------------------

/**
 * 曲线派生纯函数：trl 决定形状、total 为五回合总增益，返回长度 5、求和恰为 total 的数组。
 * trl≤5 后程爆发：[0, 0, ≈15%, ≈32%, 余额]——前两回合颗粒无收，增益全押在后程；
 * trl 6-7 中段发力：[≈7%, ≈20%, ≈33%, ≈25%, 余额]——第 3 回合见顶，先慢热后收敛；
 * trl≥8 线性平滑：[1, 2, 3, 4, total-10]——成熟领域替代曲线平滑，没有惊喜也没有惊吓。
 */
export function deriveCurve(trl, total) {
  if (trl <= 5) {
    const t3 = Math.round(total * 0.15);
    const t4 = Math.round(total * 0.32);
    return [0, 0, t3, t4, total - t3 - t4];
  }
  if (trl <= 7) {
    const t1 = Math.round(total * 0.07);
    const t2 = Math.round(total * 0.2);
    const t3 = Math.round(total * 0.33);
    const t4 = Math.round(total * 0.25);
    return [t1, t2, t3, t4, total - t1 - t2 - t3 - t4];
  }
  return [1, 2, 3, 4, total - 10];
}

const LOCKED_DOMAINS = DOMAINS.filter((d) => d.tier === 'locked');
const CHASE_TOP = DOMAINS
  .filter((d) => d.tier === 'chase')
  .slice()
  .sort((a, b) => b.weight - a.weight)
  .slice(0, Math.max(0, 5 - LOCKED_DOMAINS.length));

export const TECH_TRACKS = [...LOCKED_DOMAINS, ...CHASE_TOP].map((d) => ({
  id: d.k,
  label: d.name,
  neck: d.neck,
  curve: deriveCurve(d.trl, 13 + Math.round(d.weight / 50)),
}));

// ----------------------------------------------------------------------------
// 牌库：effect 四值均以「出牌方」为 self（-10..+10）；decay 持续 = 效果驻留逐回合生效
// 设计自洽：管制类伤对方科技但反噬己方经贸；攻关类慢热（持续小步快跑）；
//          谈判/开放双正但小——缓和的收益从来不如对抗的伤害醒目，这正是博弈的难处。
// ----------------------------------------------------------------------------
export const CARDS = [
  {
    id: 'export_control', label: '出口管制', side: 'us', cost: 2, decay: '持续',
    effect: { selfTech: 0, selfEcon: -2, oppTech: -4, oppEcon: -1 },
    desc: '高端环节断供，对手科技线逐回合受压；本国供应商失去最大客户，经贸线同步失血。',
  },
  {
    id: 'entity_list', label: '实体清单', side: 'us', cost: 2, decay: '一次性',
    effect: { selfTech: 0, selfEcon: -2, oppTech: -6, oppEcon: -3 },
    desc: '点名拉黑式精确打击：一次性重创对手科技与供应链信用，己方出口收入同步反噬。',
  },
  {
    id: 'tariff', label: '关税调整', side: 'both', cost: 1, decay: '一次性',
    effect: { selfTech: 0, selfEcon: -1, oppTech: 0, oppEcon: -4 },
    desc: '价格武器：压对手经贸线最直接的杠杆，己方进口端与下游成本同步承压。',
  },
  {
    id: 'talk', label: '谈判窗口', side: 'both', cost: 1, decay: '一次性',
    effect: { selfTech: 0, selfEcon: 3, oppTech: 0, oppEcon: 3 },
    desc: '降温信号：双方经贸线小幅修复。不改变科技线竞争——谈判买的是时间，不是终局。',
  },
  {
    id: 'selfdev', label: '自主攻关', side: 'cn', cost: 3, decay: '持续',
    effect: { selfTech: 3, selfEcon: -1, oppTech: 0, oppEcon: 0 },
    desc: '重投入慢热牌：科技线逐回合爬坡，短期利润与财政承压。耐力赛里最贵也最硬的一手。',
  },
  {
    id: 'open_market', label: '市场开放', side: 'cn', cost: 1, decay: '一次性',
    effect: { selfTech: 1, selfEcon: 3, oppTech: 0, oppEcon: 2 },
    desc: '以市场换缓和：己方经贸回血并承接技术外溢，对方经贸亦受益——给对方鸽派递筹码。',
  },
  {
    id: 'std_alliance', label: '标准联盟', side: 'both', cost: 2, decay: '持续',
    effect: { selfTech: 2, selfEcon: 1, oppTech: -1, oppEcon: 0 },
    desc: '拉伙伴定标准：持续抬升己方科技话语权，缓慢挤出对手生态位——慢刀子，但不流血。',
  },
  {
    id: 'rare_earth', label: '稀土筹码', side: 'cn', cost: 2, decay: '一次性',
    effect: { selfTech: 0, selfEcon: -2, oppTech: -5, oppEcon: -2 },
    desc: '上游卡位的一次性反制：重创对手材料端产线，己方出口收入自损。底牌打一张少一张。',
  },
];

const CARD_MAP = Object.fromEntries(CARDS.map((c) => [c.id, c]));

// ----------------------------------------------------------------------------
// 美方 AI 策略三档（确定性规则，不掷骰子）
// ----------------------------------------------------------------------------
export const STRATEGIES = [
  { id: 'hawk', label: '强硬施压', desc: '管制牌优先、逐回合加码——赌对手科技线先于自家经贸线断气。' },
  { id: 'tit', label: '对等反制', desc: '镜像上一回合：你打多重我还多重，你递缓和我跟缓和——以牙还牙，以礼还礼。' },
  { id: 'deal', label: '交易优先', desc: '谈判窗口优先，能换条款就不掀桌——交易者眼里关税只是开价方式。' },
];

/** 某持续牌是否已在场上驻留 */
function persistHas(state, side, cardId) {
  return ((state && state.persist) || []).some((p) => p.side === side && p.cardId === cardId);
}

/** 一手出牌的「烈度」：对对方两线的负向效果合计（镜像反制的标尺） */
function hostilityOf(cardIds) {
  return (cardIds || []).reduce((s, id) => {
    const c = CARD_MAP[id];
    if (!c) return s;
    return s + Math.max(0, -c.effect.oppTech) + Math.max(0, -c.effect.oppEcon);
  }, 0);
}

/**
 * 美方该回合出牌（确定性）：返回牌 id 数组，总行动点 ≤ AP_PER_TURN。
 * hawk：管制优先——出口管制未驻留先驻留，之后逐回合实体清单+关税；
 * tit ：镜像中方上一回合烈度（≥7 重拳 / ≥1 对等 / 0 跟进缓和）；
 * deal：首回合搭标准联盟，此后只留谈判窗口——克制本身就是开价。
 */
export function usMove(strategy, state, turn) {
  if (strategy === 'hawk') {
    return persistHas(state, 'us', 'export_control')
      ? ['entity_list', 'tariff']
      : ['export_control', 'tariff'];
  }
  if (strategy === 'deal') {
    return turn <= 1 ? ['std_alliance', 'talk'] : ['talk'];
  }
  // tit：对等反制
  const hostility = hostilityOf(state && state.lastCn);
  if (hostility >= 7) return ['entity_list', 'tariff'];
  if (hostility >= 1) {
    return persistHas(state, 'us', 'export_control')
      ? ['entity_list', 'tariff']
      : ['export_control', 'tariff'];
  }
  return persistHas(state, 'us', 'std_alliance') ? ['talk'] : ['talk', 'std_alliance'];
}

// ----------------------------------------------------------------------------
// 回合结算
// ----------------------------------------------------------------------------

/** 初始局面（turn 0，含曲线起点） */
export function makeInitialState() {
  return {
    cn: { ...INIT.cn },
    us: { ...INIT.us },
    turn: 0,
    log: [],
    persist: [],   // 驻留中的持续牌 [{side, cardId}]
    lastCn: [],    // 中方上一回合出牌（tit 镜像依据）
    tilts: initialTilts(),   // 第三方天平 {eu, asean}
    history: [{ turn: 0, cnTech: INIT.cn.tech, cnEcon: INIT.cn.econ, usTech: INIT.us.tech, usEcon: INIT.us.econ }],
  };
}

/** 出牌合法化：本方可出（side 匹配）、去重、按顺序累计行动点 ≤ AP_PER_TURN */
function sanitizePlay(sideId, cardIds) {
  const seen = new Set();
  const out = [];
  let ap = 0;
  (cardIds || []).forEach((id) => {
    const c = CARD_MAP[id];
    if (!c || seen.has(id)) return;
    if (c.side !== sideId && c.side !== 'both') return;
    if (ap + c.cost > AP_PER_TURN) return;
    seen.add(id);
    ap += c.cost;
    out.push(id);
  });
  return out;
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }

/** 把一张牌（或驻留效果）按出牌方向量加到双方四线上 */
function applyEffect(next, sideId, effect) {
  const self = next[sideId];
  const opp = next[sideId === 'cn' ? 'us' : 'cn'];
  self.tech += effect.selfTech;
  self.econ += effect.selfEcon;
  opp.tech += effect.oppTech;
  opp.econ += effect.oppEcon;
}

/**
 * 结算一个回合 → 新 state（输入 state 不被修改）。
 * 次序：科技自然增长 +1 → 驻留持续牌生效 → 本回合出牌生效（含第三方 tilt 一次性结算）
 *      → 第三方倾斜回合效应（|tilt|≥40 给倾向侧 econ 加成，入 log）
 *      （持续牌首次打出即驻留并当回合生效；重复打出视为弃置，弃置不计 tilt）。
 * opts.track：「自主攻关」所走的攻关目标线 id（TECH_TRACKS[].id，即领域 k），
 *            缺省为派生后第一条（TECH_TRACKS[0].id，当前为 semi）；
 *            传入未知 id（含旧档 litho/soft/aero）同样回退第一条，不抛错——
 *            不传 opts 与传 {track: TECH_TRACKS[0].id} 结果全等（向后兼容）。
 */
export function resolveTurn(state, cnCards, usCards, opts) {
  if (!state || state.turn >= MAX_TURNS) return state;
  const cn = sanitizePlay('cn', cnCards);
  const us = sanitizePlay('us', usCards);
  const track = TECH_TRACKS.find((t) => t.id === (opts && opts.track)) || TECH_TRACKS[0];

  const next = {
    cn: { ...state.cn },
    us: { ...state.us },
    turn: state.turn + 1,
    log: [...state.log],
    persist: [...state.persist],
    lastCn: [...cn],
    tilts: { ...(state.tilts || initialTilts()) },   // 旧档无 tilts：按初值补齐（向后兼容）
    history: [...state.history],
  };

  // 自主攻关的本回合 tech 增益按攻关线曲线取值（按对局回合数索引，替代原固定 +3）：
  // 打出与驻留同走一条曲线——光刻后程爆发 / 软件线性 / 航发前期沉默。
  const effectFor = (c) => (
    c.id === 'selfdev'
      ? { ...c.effect, selfTech: track.curve[Math.min(next.turn, track.curve.length) - 1] }
      : c.effect
  );

  // 1. 科技线自然增长：没人出牌，追赶也在发生
  next.cn.tech += TECH_GROWTH;
  next.us.tech += TECH_GROWTH;

  // 2. 驻留持续牌逐回合生效
  next.persist.forEach((p) => {
    const c = CARD_MAP[p.cardId];
    if (c) applyEffect(next, p.side, effectFor(c));
  });

  // 3. 本回合出牌生效（持续牌入驻留；重复打出弃置；tilt 出牌当回合一次性结算）
  const played = { cn: [], us: [] };
  [['cn', cn], ['us', us]].forEach(([sideId, ids]) => {
    ids.forEach((id) => {
      const c = CARD_MAP[id];
      if (c.decay === '持续') {
        if (persistHas(next, sideId, id)) {
          played[sideId].push(`${c.label}（已驻留 · 弃置）`);
          return;
        }
        next.persist.push({ side: sideId, cardId: id });
      }
      applyEffect(next, sideId, effectFor(c));
      const dTilt = (TILT_EFFECTS[sideId] || {})[id] || 0;
      if (dTilt) {
        THIRD_PARTIES.forEach((tp) => {
          next.tilts[tp.id] = clampTilt((next.tilts[tp.id] || 0) + dTilt);
        });
      }
      played[sideId].push(c.decay === '持续' ? `${c.label}（驻留）` : c.label);
    });
  });

  // 3.5 第三方倾斜回合效应：|tilt|≥40 给倾向侧经贸加成（欧盟 +2 / 东盟 +1），写入 log
  const tiltNotes = [];
  THIRD_PARTIES.forEach((tp) => {
    const t = next.tilts[tp.id] || 0;
    if (Math.abs(t) < TILT_TIPPING) return;
    const beneficiary = t > 0 ? 'cn' : 'us';
    const bonus = TILT_WEIGHT[tp.id] || 1;
    next[beneficiary].econ += bonus;
    tiltNotes.push(`${tp.label}（tilt ${t > 0 ? '+' : ''}${t} · ${t > 0 ? '倾中' : '倾美'}）→ ${beneficiary === 'cn' ? '中方' : '美方'}经贸 +${bonus}`);
  });

  // 4. 截断到 0..100
  next.cn.tech = clamp(next.cn.tech);
  next.cn.econ = clamp(next.cn.econ);
  next.us.tech = clamp(next.us.tech);
  next.us.econ = clamp(next.us.econ);

  // 5. 记账：回合纪要（含第三方天平快照与加成明细）+ 曲线点
  const delta = {
    cnTech: next.cn.tech - state.cn.tech,
    cnEcon: next.cn.econ - state.cn.econ,
    usTech: next.us.tech - state.us.tech,
    usEcon: next.us.econ - state.us.econ,
  };
  next.log.push({
    turn: next.turn,
    cn: played.cn.length ? played.cn : ['按兵不动'],
    us: played.us.length ? played.us : ['按兵不动'],
    delta,
    after: { cnTech: next.cn.tech, cnEcon: next.cn.econ, usTech: next.us.tech, usEcon: next.us.econ },
    tilts: { ...next.tilts },
    tiltNotes,
  });
  next.history.push({ turn: next.turn, cnTech: next.cn.tech, cnEcon: next.cn.econ, usTech: next.us.tech, usEcon: next.us.econ });
  return next;
}

/**
 * 中方全程出牌统计（策略实验室存档用）：去重计次 → ['自主攻关×3','谈判窗口']。
 * 剔除「按兵不动」与重复打出被弃置的牌；驻留标注还原为原牌名。纯函数。
 */
export function tallyCnPlays(log) {
  const counts = new Map();
  (log || []).forEach((r) => {
    ((r && r.cn) || []).forEach((raw) => {
      if (typeof raw !== 'string' || raw === '按兵不动' || raw.includes('弃置')) return;
      const label = raw.replace('（驻留）', '');
      counts.set(label, (counts.get(label) || 0) + 1);
    });
  });
  return [...counts.entries()].map(([label, n]) => (n > 1 ? `${label}×${n}` : label));
}

// ----------------------------------------------------------------------------
// 终局判定（5 回合后）：五档结局，各配一句冷峻判语
// ----------------------------------------------------------------------------
export function judge(state) {
  const dCnTech = state.cn.tech - INIT.cn.tech;
  const dUsTech = state.us.tech - INIT.us.tech;
  const dCnEcon = state.cn.econ - INIT.cn.econ;
  const dUsEcon = state.us.econ - INIT.us.econ;

  let v;
  if (-dCnTech > 8) {
    v = {
      label: '美方锁喉', color: '#22d3ee',
      note: '断供链条压过了追赶速度：中方科技线被按进负增长区间。锁喉的代价计在美方经贸账上——但账单到期日在五回合之外。',
    };
  } else if (dCnTech > dUsTech && state.cn.econ >= 55) {
    v = {
      label: '中方突围', color: '#c41e3a',
      note: '科技增幅反超且经贸底盘未破：封锁变成了倒逼出来的进度表。突围不靠奇迹，靠的是每回合多挤出的那一点点投入。',
    };
  } else if (state.cn.econ < 55 && state.us.econ < 55) {
    v = {
      label: '双输螺旋', color: '#e8a317',
      note: '两条供应链互相放血，谁都没赢——只是输的速度不同。螺旋一旦转起来，止损本身就成了示弱，于是没人止损。',
    };
  } else if (state.cn.econ >= 65 && state.us.econ >= 65) {
    v = {
      label: '缓和窗口', color: '#10b981',
      note: '双方经贸线都保住了体面：窗口期不是和解，是双方同时算清了对抗的边际成本。窗口能开多久，取决于下一轮谁先变现敌意。',
    };
  } else {
    v = {
      label: '相持消耗', color: '#64748b',
      note: `四线对账：科技 ${dCnTech >= 0 ? '+' : ''}${dCnTech}/${dUsTech >= 0 ? '+' : ''}${dUsTech}，经贸 ${dCnEcon >= 0 ? '+' : ''}${dCnEcon}/${dUsEcon >= 0 ? '+' : ''}${dUsEcon}。没有胜负，只有消耗速率——耐力赛进入了拼血条厚度的中段。`,
    };
  }

  // 第三方实质选边判语：终局任一 |tilt| ≥ 60（旧档无 tilts 视为全中立，不触发）
  const sided = THIRD_PARTIES
    .filter((tp) => Math.abs((state.tilts || {})[tp.id] || 0) >= TILT_SIDED)
    .map((tp) => tp.label);
  if (sided.length) {
    v = { ...v, note: `${v.note}${sided.join('、')}已实质选边——多极是修辞，站队是现实。` };
  }
  return v;
}

// ----------------------------------------------------------------------------
// 推演报告
// ----------------------------------------------------------------------------
const sgn = (v) => (v > 0 ? `+${v}` : `${v}`);

/**
 * 生成 Markdown 推演报告。
 * ctx: { strategy: 策略 id 或对象, state: 终局 state }
 */
export function buildWarReport(ctx) {
  const { state } = ctx;
  const strat = typeof ctx.strategy === 'string'
    ? (STRATEGIES.find((s) => s.id === ctx.strategy) || STRATEGIES[0])
    : ctx.strategy;
  const verdict = judge(state);
  const L = [];

  L.push('# 大国博弈推演报告');
  L.push('');
  L.push(`> 推演基准日 ${WG_AS_OF} · 思想实验 / 分析框架 · 非预测 · 非政策倡导 · 双方收益矩阵为示意标定`);
  L.push('');

  L.push('## 一、策略设定');
  L.push('');
  L.push(`- **美方策略**：${strat.label} —— ${strat.desc}`);
  const trk = TECH_TRACKS.find((t) => t.id === ctx.track);
  if (trk) L.push(`- **攻关目标线**：${trk.label} —— 卡点：${trk.neck} · 逐回合增益 ${trk.curve.join('/')}`);
  L.push(`- **初值标定**：中方 科技 ${INIT.cn.tech} / 经贸 ${INIT.cn.econ}（追赶者设定）；美方 科技 ${INIT.us.tech} / 经贸 ${INIT.us.econ}`);
  L.push(`- **规则**：每回合行动点 ${AP_PER_TURN}，共 ${MAX_TURNS} 回合；科技线每回合自然增长 +${TECH_GROWTH}；持续牌效果驻留至终局`);
  L.push('');

  L.push('## 二、五回合出牌纪要');
  L.push('');
  L.push('| 回合 | 中方出牌 | 美方出牌 | 中方Δ（科技/经贸） | 美方Δ（科技/经贸） |');
  L.push('|---|---|---|---|---|');
  state.log.forEach((r) => {
    L.push(`| 第${r.turn}回合 | ${r.cn.join('+')} | ${r.us.join('+')} | ${sgn(r.delta.cnTech)} / ${sgn(r.delta.cnEcon)} | ${sgn(r.delta.usTech)} / ${sgn(r.delta.usEcon)} |`);
  });
  L.push('');

  L.push('## 三、终局四线对比');
  L.push('');
  L.push('| 线 | 初值 | 终值 | 净变 |');
  L.push('|---|---|---|---|');
  L.push(`| 中方科技 | ${INIT.cn.tech} | ${state.cn.tech} | ${sgn(state.cn.tech - INIT.cn.tech)} |`);
  L.push(`| 中方经贸 | ${INIT.cn.econ} | ${state.cn.econ} | ${sgn(state.cn.econ - INIT.cn.econ)} |`);
  L.push(`| 美方科技 | ${INIT.us.tech} | ${state.us.tech} | ${sgn(state.us.tech - INIT.us.tech)} |`);
  L.push(`| 美方经贸 | ${INIT.us.econ} | ${state.us.econ} | ${sgn(state.us.econ - INIT.us.econ)} |`);
  L.push('');
  if (state.tilts) {
    L.push(`第三方天平终值：${THIRD_PARTIES.map((tp) => `${tp.label} ${sgn(state.tilts[tp.id] || 0)}`).join(' · ')}（正值倾中 / 负值倾美，|tilt|≥${TILT_TIPPING} 起每回合给倾向侧经贸加成）`);
    L.push('');
  }

  L.push('## 四、判定与机理');
  L.push('');
  L.push(`**${verdict.label}** —— ${verdict.note}`);
  L.push('');
  L.push('机理三条：');
  L.push('1. **筹码不对称**：管制牌伤对方科技立竿见影，反噬己方经贸却分期付款——短期烈度永远高估了长期收益。');
  L.push('2. **时滞与耐力**：攻关类持续牌单回合不起眼，五回合复利可观；博弈的胜负手不在最响的那张牌，在最沉得住气的那张。');
  L.push('3. **缓和的窗口期**：谈判与开放双正但小，单看一回合永远不划算——它买的不是分数，是把博弈拖入对自己有利的时间结构。');
  L.push('');
  L.push('---');
  L.push('');
  L.push('*本报告为思想实验，非预测、非政策倡导；牌面与收益矩阵均为示意标定，不构成对任何现实主体行为的判断或建议。*');
  return L.join('\n');
}
