// ============================================================================
// 领导体制观察 · 推演层（leadershipSim.js）
// ----------------------------------------------------------------------------
// 定位：纯数据 + 纯函数，零 React、零随机、零当前时间。
// 内容：注意力配置器（议程设置理论思想实验）+ 行政首脑任期制度公开比较 +
//       治理逻辑解构报告生成器。
//
// 敏感口径（最高优先级，逐条强制）：
// 1. 注意力配置器为议程设置理论的思想实验，参数全部为抽象示意标定，
//    不对应任何现实决策、资源或情报数据；非评价、非预测、非倡导。
// 2. 国际任期比较只收录教科书级宪法/法律条文事实与公开任职事实，
//    中性并列，零褒贬词，不构成制度优劣评价。
// 3. 涉台海/军事课题仅作为抽象议程标签参与权衡演示，零作战内容。
// 4. 报告输出全程挂「公开信息梳理 · 学理分析框架 · 思想实验 ·
//    非评价 · 非预测 · 非倡导」。
// ============================================================================

import { AGENDA } from './leadershipData.js';

export const SIM_NOTE =
  '注意力配置器为议程设置理论（有限注意力的分配权衡）的思想实验：参数为抽象示意标定，推演不对应任何现实决策或资源数据，非评价、非预测、非倡导。';

// ---------------------------------------------------------------------------
// 一、六课题抽象参数（示意标定 · 键 = AGENDA 六 id）
// difficulty 推进难度 0-100 / urgency 议程压力 0-100 / coupling 耦合课题 ≤2
// 标定逻辑（抽象示意）：台海与中美议程压力高且互相耦合；科技推进难度高且
// 耦合中美；共富人口推进难度高、议程压力中；化险议程压力高且耦合共富。
// ---------------------------------------------------------------------------
export const TOPIC_PARAMS = {
  'military-mod': {
    difficulty: 58,
    urgency: 56,
    coupling: ['taiwan-strait'],
    note: '长周期工程，与台海议程耦合',
  },
  'taiwan-strait': {
    difficulty: 70,
    urgency: 82,
    coupling: ['us-china', 'military-mod'],
    note: '议程压力高，双向耦合中美与军事',
  },
  'us-china': {
    difficulty: 74,
    urgency: 80,
    coupling: ['taiwan-strait', 'tech-selfreliance'],
    note: '议程压力高，耦合台海与科技',
  },
  'tech-selfreliance': {
    difficulty: 84,
    urgency: 60,
    coupling: ['us-china'],
    note: '推进难度最高，外部约束来自中美',
  },
  'common-prosperity': {
    difficulty: 80,
    urgency: 55,
    coupling: ['risk-defuse'],
    note: '难度高压力中，慢变量长周期',
  },
  'risk-defuse': {
    difficulty: 62,
    urgency: 76,
    coupling: ['common-prosperity'],
    note: '议程压力高，与共富分配耦合',
  },
};

// ---------------------------------------------------------------------------
// 二、注意力推演（确定性纯函数）
// alloc = { [id]: 0-100, Σ=100 }
// progress = clamp(round(alloc*1.35 - difficulty*0.28 + 耦合alloc均值*0.15 + 8))
// strain   = clamp(round(urgency - alloc*1.05 - 耦合alloc均值*0.1))
// ---------------------------------------------------------------------------
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const VERDICTS = {
  full: {
    label: '全面推进',
    color: '#10b981',
    note: '六题同时压住——前提是注意力总量充裕且难度结构温和；有限注意力下这一窗口在理论上存在、在配置上罕见。',
  },
  focus: {
    label: '重点突破',
    color: '#22d3ee',
    note: '重点方向推进领先，代价是其余课题在低位维持运转——定向集中是议程设置的常态形态，收益与暴露面同时放大。',
  },
  tradeoff: {
    label: '顾此失彼',
    color: '#e8a317',
    note: '高压议程未被压住——注意力流向何处，张力就从别处冒头；这是有限注意力的硬约束，不随配置意愿转移。',
  },
  overload: {
    label: '议程过载',
    color: '#c41e3a',
    note: '注意力被摊薄或被单点挤占，部分课题事实停摆——议程上的每一项加码，都是对存量课题的隐性扣减。',
  },
};

/**
 * 注意力配置推演（议程设置理论思想实验 · 抽象权衡演示）。
 * @param {Object} alloc { [agendaId]: 0-100 }，约定 Σ=100
 * @returns {{ rows: Array, verdict: {label,color,note}, spill: string }}
 */
export function simAttention(alloc) {
  const a = alloc && typeof alloc === 'object' ? alloc : {};
  const get = (id) => {
    const v = Number(a[id]);
    return Number.isFinite(v) ? clamp(v, 0, 100) : 0;
  };

  const rows = AGENDA.map((t) => {
    const p = TOPIC_PARAMS[t.id];
    const own = get(t.id);
    const partners = p.coupling || [];
    const spillIn = partners.length
      ? partners.reduce((s, pid) => s + get(pid), 0) / partners.length
      : 0;
    const progress = clamp(
      Math.round(own * 1.35 - p.difficulty * 0.28 + spillIn * 0.15 + 8),
      0,
      100,
    );
    const strain = clamp(
      Math.round(p.urgency - own * 1.05 - spillIn * 0.1),
      0,
      100,
    );
    const flags = [];
    if (own > 42) flags.push('单点过载');
    return {
      id: t.id,
      label: t.label,
      color: t.color,
      alloc: own,
      progress,
      strain,
      spillIn,
      flags,
    };
  });

  const maxStrain = Math.max(...rows.map((r) => r.strain));
  const minProgress = Math.min(...rows.map((r) => r.progress));
  const maxProgress = Math.max(...rows.map((r) => r.progress));
  const overloadCount = rows.filter((r) => r.flags.includes('单点过载')).length;

  // 全局议程暴露：maxStrain≥72 时，张力≥72 的课题追加标记
  if (maxStrain >= 72) {
    rows.forEach((r) => {
      if (r.strain >= 72) r.flags.push('议程暴露');
    });
  }

  let verdict;
  if (overloadCount >= 2 || minProgress < 20) verdict = VERDICTS.overload;
  else if (maxStrain >= 72) verdict = VERDICTS.tradeoff;
  else if (minProgress >= 55 && maxStrain < 50) verdict = VERDICTS.full;
  else if (maxProgress >= 75 && maxStrain < 72) verdict = VERDICTS.focus;
  else verdict = VERDICTS.tradeoff;

  // 耦合外溢判读（确定性：取外溢收益最大的课题，平手取 AGENDA 顺序靠前者）
  let spill;
  const best = rows.reduce((m, r) => (r.spillIn > m.spillIn ? r : m), rows[0]);
  if (best.spillIn <= 0) {
    spill =
      '当前配置下耦合外溢趋近于零——注意力分布与议程耦合结构脱节，相邻课题得不到溢出收益。';
  } else {
    const partnerLabels = (TOPIC_PARAMS[best.id].coupling || [])
      .map((pid) => {
        const t = AGENDA.find((x) => x.id === pid);
        return t ? t.label : pid;
      })
      .join('、');
    const gain = Math.round(best.spillIn * 0.15 * 10) / 10;
    spill = `耦合外溢最强方向：${best.label}——来自 ${partnerLabels} 的注意力溢出贡献约 +${gain} 推进；议程相互耦合，注意力从不孤立作用。`;
  }

  return { rows, verdict, spill };
}

// ---------------------------------------------------------------------------
// 三、行政首脑任期制度公开比较（教科书级宪法/法律事实 · 中性并列 · 零褒贬）
// ---------------------------------------------------------------------------
export const INTL_TERM_COMPARE = [
  {
    country: '美国',
    system: '总统制',
    rule: '宪法第二十二修正案：当选总统以两届为限',
    fact: '该修正案于1951年批准生效',
  },
  {
    country: '俄罗斯',
    system: '半总统制',
    rule: '2020年修宪：总统既往任期计数清零',
    fact: '修宪案经2020年全民投票通过',
  },
  {
    country: '德国',
    system: '议会共和制',
    rule: '基本法对联邦总理连任次数无限制',
    fact: '默克尔2005至2021年在任十六年',
  },
  {
    country: '英国',
    system: '议会君主制',
    rule: '首相任期无固定上限，随议会多数进退',
    fact: '撒切尔1979至1990年连续在任',
  },
  {
    country: '日本',
    system: '议会君主制',
    rule: '首相无法定任期上限；自民党总裁三届九年',
    fact: '安倍晋三两段累计在任约八年九个月',
  },
  {
    country: '新加坡',
    system: '议会共和制',
    rule: '宪法对总理任期与连任次数无限制',
    fact: '李光耀1959至1990年任总理31年',
  },
];

export const INTL_NOTE =
  '制度比较为公开宪法/法律条文与公开任职事实的中性并列，不构成任何制度优劣评价。';

// ---------------------------------------------------------------------------
// 四、治理逻辑解构报告（Markdown 生成器 · 确定性）
// ctx = { eraLabel, agendaTopic, alloc, sim, receipts:{wargame,tech,alerts} }
// ---------------------------------------------------------------------------
const FOOTER =
  '公开信息梳理 · 学理分析框架 · 思想实验 · 非评价 · 非预测 · 非倡导';

/**
 * 生成「领袖统治 · 治理逻辑解构报告」Markdown。
 * @param {Object} ctx
 * @returns {string}
 */
export function buildLeadReport(ctx) {
  const c = ctx && typeof ctx === 'object' ? ctx : {};
  const era = c.eraLabel || '——';
  const topic = c.agendaTopic || '——';
  const sim = c.sim && Array.isArray(c.sim.rows) ? c.sim : null;
  const receipts = c.receipts && typeof c.receipts === 'object' ? c.receipts : {};

  const lines = [];
  lines.push('# 领袖统治 · 治理逻辑解构报告');
  lines.push('');
  lines.push(`> ${FOOTER}`);
  lines.push('');

  lines.push('## 一、观察窗口与课题');
  lines.push('');
  lines.push(`- 观察窗口：${era}`);
  lines.push(`- 聚焦课题：${topic}`);
  lines.push('');

  lines.push('## 二、注意力配置与推演（思想实验）');
  lines.push('');
  lines.push(`> ${SIM_NOTE}`);
  lines.push('');
  if (sim) {
    lines.push('| 课题 | 注意力 | 推进 | 张力残量 | 状态 |');
    lines.push('| --- | ---: | ---: | ---: | --- |');
    sim.rows.forEach((r) => {
      const flags = r.flags && r.flags.length ? r.flags.join('·') : '—';
      lines.push(
        `| ${r.label} | ${r.alloc} | ${r.progress} | ${r.strain} | ${flags} |`,
      );
    });
    lines.push('');
    lines.push(`- 推演判定：**${sim.verdict.label}** — ${sim.verdict.note}`);
    lines.push(`- 耦合外溢：${sim.spill}`);
  } else {
    lines.push('（本次未运行注意力推演。）');
  }
  lines.push('');

  lines.push('## 三、全站推演回执');
  lines.push('');
  const receiptRows = [
    ['博弈推演', receipts.wargame],
    ['科技图谱', receipts.tech],
    ['风险警讯', receipts.alerts],
  ].filter(([, v]) => typeof v === 'string' && v.length > 0);
  if (receiptRows.length) {
    receiptRows.forEach(([k, v]) => lines.push(`- ${k}：${v}`));
  } else {
    lines.push('（本次无全站推演回执。）');
  }
  lines.push('');

  lines.push('## 四、学理提示');
  lines.push('');
  lines.push(
    '议程设置理论的核心约束是有限注意力：任何最高决策层在同一时间窗口内能实际推进的课题数量有限，注意力的每一次定向集中都同时是一次对其余议程的扣减；耦合课题之间存在外溢收益，但外溢不能替代直接投入。本推演以抽象参数演示这一权衡结构，不对应任何现实决策、资源配置或情报判断。',
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(FOOTER);
  lines.push('');

  return lines.join('\n');
}
