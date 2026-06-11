// ============================================================================
// 大国博弈推演桌 · 纯函数引擎（零 React · 零外部依赖）
// ----------------------------------------------------------------------------
// 中美科技-经贸博弈的回合制思想实验：8 张抽象牌 × 5 回合 × 3 档对手策略。
// 安全红线：仅科技/经贸/产业维度的抽象博弈，不涉军事冲突情景；
//          牌名一律中性术语，不出现任何具体真实企业名。
// 声明：思想实验 / 分析框架 · 非预测 · 非政策倡导 · 双方收益矩阵为示意标定。
// 全部逻辑确定性纯函数：无随机数、无当前时间（基准日为常量字符串）。
// ============================================================================

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
 * 次序：科技自然增长 +1 → 驻留持续牌生效 → 本回合出牌生效
 *      （持续牌首次打出即驻留并当回合生效；重复打出视为弃置）。
 */
export function resolveTurn(state, cnCards, usCards) {
  if (!state || state.turn >= MAX_TURNS) return state;
  const cn = sanitizePlay('cn', cnCards);
  const us = sanitizePlay('us', usCards);

  const next = {
    cn: { ...state.cn },
    us: { ...state.us },
    turn: state.turn + 1,
    log: [...state.log],
    persist: [...state.persist],
    lastCn: [...cn],
    history: [...state.history],
  };

  // 1. 科技线自然增长：没人出牌，追赶也在发生
  next.cn.tech += TECH_GROWTH;
  next.us.tech += TECH_GROWTH;

  // 2. 驻留持续牌逐回合生效
  next.persist.forEach((p) => {
    const c = CARD_MAP[p.cardId];
    if (c) applyEffect(next, p.side, c.effect);
  });

  // 3. 本回合出牌生效（持续牌入驻留；重复打出弃置）
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
      applyEffect(next, sideId, c.effect);
      played[sideId].push(c.decay === '持续' ? `${c.label}（驻留）` : c.label);
    });
  });

  // 4. 截断到 0..100
  next.cn.tech = clamp(next.cn.tech);
  next.cn.econ = clamp(next.cn.econ);
  next.us.tech = clamp(next.us.tech);
  next.us.econ = clamp(next.us.econ);

  // 5. 记账：回合纪要 + 曲线点
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

  if (-dCnTech > 8) {
    return {
      label: '美方锁喉', color: '#22d3ee',
      note: '断供链条压过了追赶速度：中方科技线被按进负增长区间。锁喉的代价计在美方经贸账上——但账单到期日在五回合之外。',
    };
  }
  if (dCnTech > dUsTech && state.cn.econ >= 55) {
    return {
      label: '中方突围', color: '#c41e3a',
      note: '科技增幅反超且经贸底盘未破：封锁变成了倒逼出来的进度表。突围不靠奇迹，靠的是每回合多挤出的那一点点投入。',
    };
  }
  if (state.cn.econ < 55 && state.us.econ < 55) {
    return {
      label: '双输螺旋', color: '#e8a317',
      note: '两条供应链互相放血，谁都没赢——只是输的速度不同。螺旋一旦转起来，止损本身就成了示弱，于是没人止损。',
    };
  }
  if (state.cn.econ >= 65 && state.us.econ >= 65) {
    return {
      label: '缓和窗口', color: '#10b981',
      note: '双方经贸线都保住了体面：窗口期不是和解，是双方同时算清了对抗的边际成本。窗口能开多久，取决于下一轮谁先变现敌意。',
    };
  }
  return {
    label: '相持消耗', color: '#64748b',
    note: `四线对账：科技 ${dCnTech >= 0 ? '+' : ''}${dCnTech}/${dUsTech >= 0 ? '+' : ''}${dUsTech}，经贸 ${dCnEcon >= 0 ? '+' : ''}${dCnEcon}/${dUsEcon >= 0 ? '+' : ''}${dUsEcon}。没有胜负，只有消耗速率——耐力赛进入了拼血条厚度的中段。`,
  };
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
