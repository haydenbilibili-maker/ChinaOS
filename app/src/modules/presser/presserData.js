// ============================================================================
// 舆情风暴应对台 · 纯函数引擎（零 React 零 import）
// ----------------------------------------------------------------------------
// 声明：六个情景全部为抽象通用社会题材原创虚构，不指向任何真实事件、企业、
// 地区或人物。本页是思想工具，推演的是「响应时机 × 回应口径 × 发布渠道」
// 的机理结构，不构成任何公关建议。
//
// 机理总纲（全部确定性差分：无随机数、无系统时间，基准日用常量）：
//   1. 未响应期：热度按画面感复利攀升——每 12 小时 ×(1+visual×0.18)。
//      短视频时代画面即燃料：visual 越高烧得越快，hours 越大峰值越高。
//   2. 口径效应（响应后的逐日衰减率与信任后果）：
//      · full 全透明披露：响应日热度小幅跳升 +8（信息增量本身是话题），
//        但衰减率最大（×0.62/天）；trust +8（facts≥60 时 +12——事越大越
//        该一次说全）；次生风险最低。
//      · deny 硬否认：facts<40（传闻型）时压热度最快（×0.55/天）且次生
//        低——谣言经不起硬碰硬；facts≥40 时埋下反转引信：第 peakDay+3
//        天证据浮出「反转引爆」，二次峰 = min(100, 首峰×1.35)，此后公信
//        力破产、渠道失效，固定 ×0.85/天 缓慢消退；trust −22、次生最高。
//      · drip 挤牙膏回应：衰减最慢（×0.85/天）、长尾最高——每挤一次
//        牙膏都是新话题；trust −6、次生中等。
//      · frame 权威定调访谈：衰减居中（×0.72/天）、trust +4，实际效果
//        高度依赖所选渠道的 reach 与 trust。
//   3. 渠道效应：Σreach 加速触达——日衰减率再 ×(1−Σreach/600)，说得越
//      快越广话题翻篇越快；Σtrust 修正公信力与次生风险（高信任渠道压缩
//      阴谋论空间）。零渠道 = 鸵鸟：等效 hours=72 且加重——衰减 ×1.1
//      （封顶 0.96/天）、次生 +18、trust 追加 −6。
// ============================================================================

export const PR_AS_OF = '2026-06-11';

// —— 六个抽象情景（原创虚构 · 不指向任何真实事件/企业/地区/人物） ——
// facts：事实烈度 0-100（指控属实的程度与严重性）
// heat0：初始热度 0-100；visual：画面感系数 0.6-1.4（画面即燃料）
export const PR_SCENARIOS = [
  {
    id: 'factory', label: '工厂安全事故', color: '#c41e3a',
    intro: '某制造企业车间发生安全事故，现场画面流出，伤亡数字成为全网追问的焦点。',
    facts: 85, heat0: 45, visual: 1.25,
  },
  {
    id: 'food', label: '食品安全传闻', color: '#e8a317',
    intro: '一段「某品牌食品有问题」的传闻短视频疯传，检测结论未出，情绪已经先行。',
    facts: 25, heat0: 35, visual: 1.30,
  },
  {
    id: 'speech', label: '干部会场言论失当', color: '#8b5cf6',
    intro: '某单位干部会场发言片段被剪辑传播，措辞失当引发身份对立式解读。',
    facts: 55, heat0: 40, visual: 1.00,
  },
  {
    id: 'dataleak', label: '平台用户数据泄露', color: '#22d3ee',
    intro: '某平台被曝用户数据泄露，技术细节门槛高，恐慌主要靠转述与想象扩散。',
    facts: 80, heat0: 30, visual: 0.65,
  },
  {
    id: 'scenic', label: '景区天价消费纠纷', color: '#fb923c',
    intro: '游客晒出「天价账单」视频指控某景区宰客，账单真伪与计价口径均存疑。',
    facts: 30, heat0: 38, visual: 1.35,
  },
  {
    id: 'canteen', label: '学校食堂卫生风波', color: '#10b981',
    intro: '某学校食堂后厨画面令家长群情激愤，问题属实程度与画面冲击不成比例。',
    facts: 55, heat0: 42, visual: 1.30,
  },
];

// —— 四档回应口径 ——
export const STANCES = [
  { id: 'full', label: '全透明披露', desc: '事实、责任、处置一次性给足——短痛换长信，信息增量当天会冲一波热度。' },
  { id: 'drip', label: '挤牙膏回应', desc: '问一句答一句，每次回应都是新话题——热度衰减最慢，长尾最长。' },
  { id: 'deny', label: '硬否认', desc: '坚决否认指控——赌的是事实站在你这边；赌输的代价是反转引爆。' },
  { id: 'frame', label: '权威定调访谈', desc: '借权威场域定性叙事、争夺解释权——效果高度依赖渠道的触达与信任。' },
];

// —— 四条发布渠道（reach 触达 0-100 / trust 信任 0-100） ——
export const CHANNELS = [
  { id: 'notice', label: '官方通报', reach: 60, trust: 80, desc: '盖章文本，可信但触达有限，易被截图二次创作。' },
  { id: 'presser', label: '新闻发布会', reach: 75, trust: 75, desc: '现场问答见真章，准备不足会当场塌方。' },
  { id: 'shortvideo', label: '短视频直面回应', reach: 90, trust: 55, desc: '画面对画面，触达最广但信任折价。' },
  { id: 'interview', label: '权威媒体专访', reach: 70, trust: 90, desc: '高信任背书，节奏可控但触达偏窄。' },
];

/**
 * 14 天舆情推演（确定性差分，机理见文件头注释）。
 * @param {object} p { scenario:情景对象, hours:响应时机 0-72, stance:口径 id, channels:选中渠道 id 数组 }
 * @returns {object} { curve:[14 天热度], peak, peakDay, longTail(第10-14天均值),
 *                     secondary(次生舆情风险 0-100), trust(公信力变化 -25..+12),
 *                     reversal: null | { day, value, firstPeak, firstPeakDay } }
 */
export function simulateOpinion({ scenario, hours, stance, channels }) {
  const sc = scenario;
  const sel = (channels || []).map((id) => CHANNELS.find((c) => c.id === id)).filter(Boolean);
  const noChannel = sel.length === 0;
  // 零渠道 = 鸵鸟：什么都没发出去，等效拖满 72 小时
  const effHours = noChannel ? 72 : Math.max(0, Math.min(72, hours || 0));
  const sumReach = sel.reduce((s, c) => s + c.reach, 0);
  const sumTrust = sel.reduce((s, c) => s + c.trust, 0);

  // —— 口径基础日衰减率 ——
  let decayDay;
  if (stance === 'full') decayDay = 0.62;
  else if (stance === 'drip') decayDay = 0.85;
  else if (stance === 'frame') decayDay = 0.72;
  else decayDay = sc.facts < 40 ? 0.55 : 0.70; // deny：对传闻是灭火器，对事实是引信

  // —— 渠道加速触达：衰减率再 ×(1−Σreach/600)；鸵鸟加重 ×1.1（封顶 0.96） ——
  let decayEff = decayDay * (1 - sumReach / 600);
  if (noChannel) decayEff = decayEff * 1.1;
  decayEff = Math.max(0.30, Math.min(0.96, decayEff));
  const decay12 = Math.sqrt(decayEff);      // 折算每 12h 衰减
  const grow12 = 1 + sc.visual * 0.18;      // 每 12h 复利攀升（画面即燃料）
  const respStep = Math.min(6, Math.max(0, Math.round(effHours / 12)));

  // —— 第一遍：基础 14 天曲线（28 个 12h 步，整日取样） ——
  let heat = sc.heat0;
  let jumped = false;
  const curve = [];
  for (let s = 1; s <= 28; s++) {
    if (s <= respStep) {
      heat = Math.min(100, heat * grow12); // 未响应期：复利攀升
    } else {
      if (!jumped && stance === 'full') heat = Math.min(100, heat + 8); // 全透明响应日小跳升
      jumped = true;
      heat *= decay12;                     // 响应后：口径×渠道决定衰减
    }
    if (s % 2 === 0) curve.push(heat);
  }

  // 首峰（按整日曲线统计）
  let firstPeak = -1;
  let firstPeakDay = 1;
  curve.forEach((v, i) => { if (v > firstPeak) { firstPeak = v; firstPeakDay = i + 1; } });

  // —— 第二遍：deny × facts≥40 的「反转引爆」——
  // 第 peakDay+3 天证据浮出，二次峰 = min(100, 首峰×1.35)；
  // 此后公信力破产、渠道失效，固定 ×0.85/天 缓慢消退。
  let reversal = null;
  if (stance === 'deny' && sc.facts >= 40) {
    const revDay = firstPeakDay + 3;
    if (revDay <= 14) {
      const spike = Math.min(100, firstPeak * 1.35);
      curve[revDay - 1] = spike;
      for (let d = revDay + 1; d <= 14; d++) curve[d - 1] = curve[d - 2] * 0.85;
      reversal = {
        day: revDay,
        value: Math.round(spike * 10) / 10,
        firstPeak: Math.round(firstPeak * 10) / 10,
        firstPeakDay,
      };
    }
  }

  // 全程峰值（反转后重算：二次峰可能高于首峰）
  let peak = -1;
  let peakDay = 1;
  curve.forEach((v, i) => { if (v > peak) { peak = v; peakDay = i + 1; } });

  // 长尾：第 10-14 天均值
  const longTail = Math.round((curve.slice(9, 14).reduce((a, b) => a + b, 0) / 5) * 10) / 10;

  // —— 次生舆情风险：口径基数 + 事实烈度联动 + 迟滞惩罚 − 渠道信任压制 ——
  let sBase;
  if (stance === 'full') sBase = 6 + sc.facts * 0.05;
  else if (stance === 'drip') sBase = 25 + sc.facts * 0.20; // 每挤一次牙膏都是新话题
  else if (stance === 'frame') sBase = 15 + sc.facts * 0.12;
  else sBase = sc.facts < 40 ? 10 + sc.facts * 0.10 : 45 + sc.facts * 0.45;
  let secondary = sBase + effHours * 0.25 - sumTrust * 0.04 + (noChannel ? 18 : 0);
  secondary = Math.round(Math.max(0, Math.min(100, secondary)));

  // —— 公信力变化：口径基数 + 渠道信任修正 − 迟滞折损，夹 [-25, +12] ——
  let tBase;
  if (stance === 'full') tBase = sc.facts >= 60 ? 12 : 8;
  else if (stance === 'drip') tBase = -6;
  else if (stance === 'frame') tBase = 4;
  else tBase = sc.facts < 40 ? 2 : -22; // 否认成立小赚姿态分；否认翻车公信力破产
  const chAdj = noChannel ? -6 : sel.reduce((s, c) => s + (c.trust - 65) / 25, 0);
  let trust = Math.round(tBase + chAdj - effHours / 36);
  trust = Math.max(-25, Math.min(12, trust));

  return {
    curve: curve.map((v) => Math.round(v * 10) / 10),
    peak: Math.round(peak * 10) / 10,
    peakDay,
    longTail,
    secondary,
    trust,
    reversal,
  };
}

/**
 * 四档判定（按危险度从高到低短路，保证全覆盖）：
 * 次生反噬(secondary≥60) → 舆情软着陆(peak<55 且 secondary<30) →
 * 长尾纠缠(longTail≥20) → 其余归高开稳走。
 */
export function verdictOf(res) {
  if (res.secondary >= 60) {
    return {
      label: '次生反噬', color: '#c41e3a',
      note: '处置本身成了第二事故。公众可以原谅事故，很难原谅欺骗——反转之后，你说什么都是错的。',
    };
  }
  if (res.peak < 55 && res.secondary < 30) {
    return {
      label: '舆情软着陆', color: '#10b981',
      note: '火没烧起来就熄了。最好的危机应对是让多数人从未听说这件事——前提是你没有撒谎。',
    };
  }
  if (res.longTail >= 20) {
    return {
      label: '长尾纠缠', color: '#e8a317',
      note: '热度没死透，每隔几天被翻出来鞭一次。挤牙膏省下的不是成本，是把一次危机分期成十次。',
    };
  }
  return {
    label: '高开稳走', color: '#22d3ee',
    note: '峰值压不住是事实决定的，但你让曲线只有一个峰。扛过最高点之后，每一天都在变便宜。',
  };
}

/**
 * 应对复盘报告（Markdown）。
 * @param {object} ctx { scenario, hours, stance(口径 id), channels(渠道 id 数组), res(simulateOpinion 结果) }
 */
export function buildPresserReport({ scenario, hours, stance, channels, res }) {
  const st = STANCES.find((s) => s.id === stance) || STANCES[0];
  const chs = (channels || []).map((id) => CHANNELS.find((c) => c.id === id)).filter(Boolean);
  const noChannel = chs.length === 0;
  const v = verdictOf(res);
  const L = [];

  L.push(`# 舆情风暴应对复盘 · ${scenario.label}`);
  L.push('');
  L.push(`> 思想工具 · 抽象情景推演 · 与任何真实事件无关 · 非公关建议 · 推演基准日 ${PR_AS_OF}`);
  L.push('');
  L.push('## 一、情景与处置参数');
  L.push('');
  L.push(`- **情景**：${scenario.label}（抽象虚构）——${scenario.intro}`);
  L.push(`- **事实烈度 facts**：${scenario.facts}/100 · **画面感 visual**：×${scenario.visual.toFixed(2)} · **初始热度**：${scenario.heat0}`);
  L.push(`- **响应时机**：事发后 ${noChannel ? '—（零渠道 = 鸵鸟，等效拖满 72h 并加重）' : `${hours} 小时`}`);
  L.push(`- **回应口径**：${st.label}——${st.desc}`);
  L.push(`- **发布渠道**：${noChannel ? '无（未做任何发布）' : chs.map((c) => `${c.label}(触达${c.reach}/信任${c.trust})`).join(' + ')}`);
  L.push('');
  L.push('## 二、14 天热度曲线关键点');
  L.push('');
  L.push(`- 第 1 天热度 ${res.curve[0]} → 峰值 **${res.peak}**（第 ${res.peakDay} 天）${res.peak >= 55 ? '，越过 55 警戒线' : '，未越 55 警戒线'}`);
  if (res.reversal) {
    L.push(`- **反转引爆**：第 ${res.reversal.day} 天证据浮出，二次峰 ${res.reversal.value}（首峰 ${res.reversal.firstPeak}，第 ${res.reversal.firstPeakDay} 天）——硬否认被事实击穿`);
  }
  L.push(`- 第 7 天热度 ${res.curve[6]} · 第 14 天热度 ${res.curve[13]} · 长尾（第 10-14 天均值）**${res.longTail}**`);
  L.push(`- 次生舆情风险 **${res.secondary}**/100 · 公信力变化 **${res.trust > 0 ? '+' : ''}${res.trust}**`);
  L.push('');
  L.push('## 三、判定与机理复盘');
  L.push('');
  L.push(`- **判定：${v.label}** —— ${v.note}`);
  L.push(`- **时间的价格**：未响应期热度按画面感复利攀升（每 12h ×${(1 + scenario.visual * 0.18).toFixed(3)}）。${noChannel ? '零渠道等于把 72 小时全让给对手叙事。' : hours >= 48 ? '拖到 48 小时以上，峰值基本由别人决定。' : hours <= 12 ? '12 小时内开口，把峰值锁死在低位。' : '响应尚算及时，但每多沉默 12 小时峰值都在复利。'}`);
  L.push(`- **口径的杠杆**：${stance === 'deny' ? (scenario.facts >= 40 ? '对烈度 ≥40 的事实硬否认，是在给反转装引信——第二峰是否认自己造出来的。' : '事实烈度低，硬否认成立——谣言经不起硬碰硬，这是 deny 唯一的安全区。') : stance === 'full' ? '全透明披露当天会自己冲一波热度，但换来全口径中最快的衰减与最高的公信力。' : stance === 'drip' ? '挤牙膏让每次回应都成为新话题，衰减最慢、长尾最长。' : '权威定调拿到的是解释权，兑现多少取决于渠道的触达与信任。'}`);
  L.push(`- **渠道的信任套利**：${noChannel ? '没有渠道就没有触达，也没有信任修正——鸵鸟不是选项，是最贵的选项。' : `Σ触达 ${chs.reduce((s, c) => s + c.reach, 0)} 加速话题翻篇，Σ信任 ${chs.reduce((s, c) => s + c.trust, 0)} 压缩阴谋论空间——高触达抢时间，高信任做定性。`}`);
  L.push('');
  L.push('---');
  L.push('');
  L.push('*尾注：本推演为思想工具 · 抽象情景推演 · 与任何真实事件无关 · 非公关建议。六个情景均为抽象通用社会题材原创虚构，不指向任何真实事件、企业、地区或人物；全部数值为机理示意。*');
  return L.join('\n');
}
