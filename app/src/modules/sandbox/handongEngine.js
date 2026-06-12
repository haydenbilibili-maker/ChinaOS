// ============================================================================
// 汉东省沙盘 · 推演算法层
// ============================================================================

import { AS_OF } from './crisisData.js';
import { HANDONG_DOMAINS, HANDONG_TOOLS } from './handongScenarios.js';

/** 省域冲击-缓解-判定（五域版） */
export function handongMitigatedImpact(scenario, intensity, alloc = {}) {
  const raw = scenario.impact.map((c) => Math.round(c * intensity));
  const reliefExact = HANDONG_DOMAINS.map((_, i) =>
    HANDONG_TOOLS.reduce((sum, t) => {
      const row = (scenario.mitigation && scenario.mitigation[t.id]) || [];
      return sum + ((alloc[t.id] || 0) / 100) * (row[i] || 0);
    }, 0)
  );
  const net = raw.map((r, i) => Math.max(0, Math.round(r - reliefExact[i])));
  const score = Math.round(net.reduce((a, b) => a + b, 0) / net.length);
  const verdict = score < 25
    ? ['可控', '#10b981', '冲击在省域治理冗余内可消化，常规节奏可维持。']
    : score < 50
      ? ['承压', '#e8a317', '系统承压但未失稳：须盯紧次生传导，政策资源不可撤火。']
      : ['高危', '#c41e3a', '冲击超出常规吸收能力，进入非常规应对：动员储备、接受局部损失。'];
  return { raw, net, score, verdict };
}

/** 复合情景叠加 */
export function handongComposite(scenarioA, scenarioB, intensity) {
  const combined = HANDONG_DOMAINS.map((_, i) =>
    Math.min(100, Math.round((scenarioA.impact[i] + scenarioB.impact[i]) * intensity * 0.68))
  );
  const impact = intensity > 0
    ? combined.map((v) => v / intensity)
    : HANDONG_DOMAINS.map((_, i) => Math.min(1, (scenarioA.impact[i] + scenarioB.impact[i]) * 0.68));
  const mitigation = {};
  HANDONG_TOOLS.forEach((t) => {
    const ra = (scenarioA.mitigation && scenarioA.mitigation[t.id]) || [];
    const rb = (scenarioB.mitigation && scenarioB.mitigation[t.id]) || [];
    mitigation[t.id] = HANDONG_DOMAINS.map((_, i) =>
      Math.round(((ra[i] || 0) + (rb[i] || 0)) / 2 * 0.82)
    );
  });
  return {
    label: `${scenarioA.label} × ${scenarioB.label}`,
    color: '#ef4444',
    intro: `复合情景：${scenarioA.label}与${scenarioB.label}非线性耦合——救援资源互相挤占，工具效力打 82 折。`,
    chain: [scenarioA.triggers?.[0] || '', scenarioB.triggers?.[0] || '', '跨域共振', '政策边际递减'],
    impact,
    toolbox: [...(scenarioA.toolbox || []).slice(0, 2), ...(scenarioB.toolbox || []).slice(0, 2)],
    talentNeed: '复合指挥型：需同时驾驭两条危机链的统筹操盘手。',
    talentKeywords: [...(scenarioA.talentKeywords || []), ...(scenarioB.talentKeywords || [])],
    mitigation,
    timeline: [...(scenarioA.timeline || []), ...(scenarioB.timeline || [])],
  };
}

/** 从省域参数推导基线体征 */
export function computeHandongBaseline(config) {
  const { population, gdpGrowth, fiscalSelf, debtRatio, industryMix, resources } = config;
  const resourceScore = Math.round(
  (resources.coal + resources.agriculture + resources.port + resources.tourism) / 4
  );
  const industryBalance = 100 - Math.abs(industryMix.secondary - 45) - Math.abs(industryMix.tertiary - 40);
  return {
    population,
    gdpGrowth,
    fiscalSelf,
    debtRatio,
    resourceScore,
    industryBalance: Math.max(0, Math.round(industryBalance)),
    entropy: Math.round(
      0.35 * (100 - fiscalSelf) + 0.3 * Math.min(100, debtRatio / 3) + 0.2 * Math.max(0, 6 - gdpGrowth) * 8 + 0.15 * (100 - resourceScore)
    ),
  };
}

/** 履历池匹配应对小组 */
export function matchHandongTeam(figures, scenario, limit = 5) {
  if (!figures || !scenario.talentKeywords) return [];
  return figures
    .map((f) => {
      const hay = [f.raw, f.org, f.fields?.title, ...(f.career || []).map((c) => c.desc)].filter(Boolean).join(' ');
      const hits = scenario.talentKeywords.filter((k) => hay.includes(k));
      return hits.length ? { id: f.id, name: f.name, title: f.fields?.title || f.org || f.role || '', score: hits.length, hits } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** 班子候选人池（省级主官画像） */
export function buildCandidatePool(figures, roleId) {
  if (!figures) return [];
  const roleKeywords = {
    secretary: ['书记', '省委', '组织', '纪检'],
    governor: ['省长', '市长', '政府', '常务'],
    discipline: ['纪委', '纪检', '监察'],
    politics: ['政法', '公安', '维稳'],
    executive: ['常务', '副省长', '发改'],
  };
  const kws = roleKeywords[roleId] || [];
  return figures
    .map((f) => {
      const hay = [f.raw, f.org, f.fields?.title, f.role, ...(f.career || []).map((c) => c.desc)].filter(Boolean).join(' ');
      const hits = kws.filter((k) => hay.includes(k));
      const age = f.fields?.age || (f.fields?.birth ? new Date().getFullYear() - parseInt(f.fields.birth, 10) : null);
      return hits.length ? { ...f, matchScore: hits.length, age } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);
}

/** 简化年龄/任期校验 */
export function validateOfficial(official, role) {
  if (!official) return { ok: false, msg: '未选派' };
  const age = official.age || official.fields?.age;
  if (age && (age < role.minAge || age > role.maxAge)) {
    return { ok: false, msg: `年龄 ${age} 超出 ${role.minAge}–${role.maxAge} 区间` };
  }
  return { ok: true, msg: '符合简化任职规则' };
}

/** 治理报告生成 */
export function buildHandongReport({
  scenarioLabel, config, intensity, alloc, raw, net, score, verdict, team, eventLog,
}) {
  const lines = [];
  lines.push('# 汉东省治理推演报告');
  lines.push(`> 虚构推演 · 汉东省沙盘 · AS_OF ${AS_OF}`);
  lines.push('');
  lines.push(`## 省域基线`);
  lines.push(`- 人口：${config.population} 万 · 省会：${config.capital}`);
  lines.push(`- GDP 增速：${config.gdpGrowth}% · 财政自给：${config.fiscalSelf}% · 债务率：${config.debtRatio}%`);
  lines.push('');
  lines.push(`## 情景：${scenarioLabel}（烈度 ${intensity}）`);
  HANDONG_DOMAINS.forEach((d, i) => {
    lines.push(`- ${d}：冲击 ${raw[i]} → 残余 ${net[i]}（缓解 ${Math.max(0, raw[i] - net[i])}）`);
  });
  lines.push('');
  lines.push('## 政策配置');
  const used = HANDONG_TOOLS.filter((t) => (alloc[t.id] || 0) > 0);
  if (used.length) used.forEach((t) => lines.push(`- ${t.label}：${alloc[t.id]} 点`));
  else lines.push('- 未投放政策资源');
  lines.push('');
  lines.push(`## 综合判定：${score} · ${verdict[0]}`);
  lines.push(verdict[2]);
  if (eventLog?.length) {
    lines.push('');
    lines.push('## 剧情推演纪要');
    eventLog.forEach((e) => lines.push(`- [${e.phase}] ${e.event}`));
  }
  if (team?.length) {
    lines.push('');
    lines.push('## 应对小组');
    team.forEach((m) => lines.push(`- ${m.name} · ${m.title} · 匹配 ${m.score}`));
  }
  lines.push('');
  lines.push('> 虚构省域思想实验，非预测；不构成对任何真实人物或人事安排的评价。');
  return lines.join('\n');
}

/** 政绩评分 → 五域得分（100 - 残余冲击，叠加班子加成） */
export function computeGovernanceScores(net, teamBonus = 0) {
  return HANDONG_DOMAINS.map((d, i) => ({
    domain: d,
    score: Math.min(100, Math.max(0, 100 - net[i] + teamBonus)),
  }));
}

/** 升迁与任免建议 */
export function suggestCadreActions(team, scores, TEAM_ROLES) {
  const avgScore = scores.reduce((s, x) => s + x.score, 0) / scores.length;
  const political = scores.find((s) => s.domain === '政治生态')?.score ?? 50;
  const economic = scores.find((s) => s.domain === '经济发展')?.score ?? 50;

  return TEAM_ROLES.filter((r) => team[r.id]).map((role) => {
    const official = team[role.id];
    let action = '留任';
    let reason = '政绩均衡，维持现状';

    if (political < 40 && role.id === 'secretary') {
      action = '调整';
      reason = '政治生态得分偏低，建议中央调整省委书记';
    } else if (economic < 35 && role.id === 'governor') {
      action = '约谈';
      reason = '经济发展承压，省长需向省委说明情况';
    } else if (avgScore >= 75 && (role.id === 'secretary' || role.id === 'governor')) {
      action = '升迁';
      reason = '综合政绩突出，纳入省部级后备梯队';
    } else if (avgScore < 45) {
      action = '降职';
      reason = '综合得分偏低，建议平调或降职使用';
    } else if (political >= 70 && role.id === 'discipline') {
      action = '表彰';
      reason = '反腐与生态净化成效显著';
    }

    return {
      roleId: role.id,
      roleLabel: role.label,
      name: official.name,
      title: official.title || official.fields?.title || '',
      action,
      reason,
      talentLink: official.id ? `/talent?id=${encodeURIComponent(official.id)}` : '/talent',
    };
  });
}
