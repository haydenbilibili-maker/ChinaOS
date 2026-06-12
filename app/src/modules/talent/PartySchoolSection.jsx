import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio } from '../shared/ModuleParadigm.jsx';
import { buildTalentLink } from '../../lib/talent/routing.js';
import {
  AS_OF, COURSE_MODULES, COHORTS, INSTRUCTORS, ASSESSMENT_DIMS, CANDIDATES,
  GOVERNANCE_CASES, SCHEDULE_BLOCKS, FRAMEWORK,
  getCohort, filterCandidates, compositeScore,
  buildCourseDonut, buildAssessmentRadar, buildCohortRadar,
  buildLeaderboard, buildCaseTimeline, buildScheduleHeatmap,
} from '../partySchool/data.js';

// ============================================================================
// 推演与训练 · 中央党校模拟器
// 声明：推演沙盘 · 教学用途 · 人才均为画像/原型，非真实组织系统
// ============================================================================

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };

/** 结业考核报告（Markdown）：纯函数，仅由当前 state 决定，无随机数/无当前时间 */
function buildGraduationReport({ cohort, minScore, candidates, selected }) {
  const pool = CANDIDATES.filter((c) => c.cohort === cohort.key);
  const passIds = new Set(candidates.map((c) => c.id));
  const eliminated = pool
    .filter((c) => !passIds.has(c.id))
    .map((c) => {
      const avg = compositeScore(c.scores);
      const reasons = [];
      if (avg < minScore) reasons.push(`综合分 ${avg} 低于阈值 ${minScore}`);
      if (c.age < cohort.criteria.minAge) reasons.push(`年龄 ${c.age} 低于班次下限 ${cohort.criteria.minAge}`);
      if (c.age > cohort.criteria.maxAge) reasons.push(`年龄 ${c.age} 超出班次上限 ${cohort.criteria.maxAge}`);
      if (!reasons.length) reasons.push('未达班次综合口径');
      return { ...c, avg, reason: reasons.join('；') };
    })
    .sort((a, b) => b.avg - a.avg);
  const passRate = pool.length ? Math.round((candidates.length / pool.length) * 100) : 0;
  const dimAvg = ASSESSMENT_DIMS.map((_, i) => (candidates.length
    ? Math.round(candidates.reduce((s, c) => s + c.scores[i], 0) / candidates.length)
    : 0));
  const weakIdx = candidates.length ? dimAvg.indexOf(Math.min(...dimAvg)) : -1;
  const insRanked = INSTRUCTORS
    .map((ins) => ({ ...ins, avg: compositeScore(ins.scores) }))
    .sort((a, b) => b.avg - a.avg);
  const bestTeach = insRanked.reduce((best, ins) => (ins.scores[2] > best.scores[2] ? ins : best), insRanked[0]);

  const L = [];
  L.push('# 中央党校研修推演 · 结业考核报告');
  L.push('');
  L.push(`> 推演沙盘 · 教学用途 · AS_OF ${AS_OF}`);
  L.push('');
  L.push('## 一、班次与考核口径');
  L.push('');
  L.push(`- 班次：${cohort.label}（名额 ${cohort.quota}）`);
  L.push(`- 结业综合分阈值：≥${minScore}（四维量规均值）`);
  L.push(`- 年龄口径：${cohort.criteria.minAge}—${cohort.criteria.maxAge} 岁 · 最低任职年限 ${cohort.criteria.minTenure} 年`);
  L.push(`- 重点领域：${cohort.criteria.domains.join(' / ')}`);
  L.push(`- 考核维度：${ASSESSMENT_DIMS.join(' / ')}`);
  L.push(`- 班次选拔维度：${(cohort.dimensions || ASSESSMENT_DIMS).join(' / ')}`);
  if (selected) {
    L.push(`- 当前考核对象：${selected.name}（${selected.province} · ${selected.domain}）· 综合 ${compositeScore(selected.scores)} · 匹配 ${selected.fit}`);
  }
  L.push('');
  L.push('## 二、通过 / 淘汰统计与名单（合成画像）');
  L.push('');
  L.push(`- 班内候选 ${pool.length} 人 · 通过 ${candidates.length} 人 · 淘汰 ${eliminated.length} 人 · 通过率 ${passRate}%`);
  if (candidates.length) {
    L.push(`- 通过学员四维均值：${ASSESSMENT_DIMS.map((d, i) => `${d} ${dimAvg[i]}`).join(' · ')}`);
  }
  L.push('');
  L.push('### 通过名单');
  L.push('');
  if (candidates.length) {
    L.push('| 排名 | 画像 | 省份 | 领域 | 年龄 | 综合分 | 匹配分 | 标签 |');
    L.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    candidates.forEach((c, i) => {
      L.push(`| ${i + 1} | ${c.name} | ${c.province} | ${c.domain} | ${c.age} | ${c.avg} | ${c.fit} | ${c.tags.join('、')} |`);
    });
  } else {
    L.push('- 无（当前阈值下无人通过，建议下调滑杆复核口径）');
  }
  L.push('');
  L.push('### 淘汰名单');
  L.push('');
  if (eliminated.length) {
    L.push('| 画像 | 省份 | 领域 | 年龄 | 综合分 | 淘汰原因 |');
    L.push('| --- | --- | --- | --- | --- | --- |');
    eliminated.forEach((c) => {
      L.push(`| ${c.name} | ${c.province} | ${c.domain} | ${c.age} | ${c.avg} | ${c.reason} |`);
    });
  } else {
    L.push('- 无（当前口径下班内候选全员通过）');
  }
  L.push('');
  L.push('## 三、教学侧观察');
  L.push('');
  L.push(`- 讲学遴选池 ${INSTRUCTORS.length} 人（知识精英 / 智库 / 科研队列），按四维综合排序：`);
  insRanked.forEach((ins, i) => {
    L.push(`  ${i + 1}. ${ins.name}（${ins.org} · ${ins.field}）— ${ASSESSMENT_DIMS.map((d, j) => `${d} ${ins.scores[j]}`).join(' / ')} · 综合 ${ins.avg}`);
  });
  L.push(`- 综合首位：${insRanked[0].name}（综合 ${insRanked[0].avg}），建议承担本班次核心理论模块。`);
  L.push(`- 教学能力维度最强：${bestTeach.name}（教学能力 ${bestTeach.scores[2]}），适配案例推演与小组答辩环节。`);
  if (weakIdx >= 0) {
    L.push(`- 通过学员相对短板：${ASSESSMENT_DIMS[weakIdx]}（均值 ${dimAvg[weakIdx]}），建议下一轮排课加密对应模块课时。`);
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push('*模拟推演：画像为合成原型，不代表任何机构真实流程，不构成人事评价*');
  return L.join('\n');
}

function SummaryPanel({ cohort, candidates, selected, minScore }) {
  const top = candidates.slice(0, 3);
  return (
    <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--fire-gold)' }}>
      <div className="text-xs font-semibold mb-2 mono" style={{ color: 'var(--fire-gold)' }}>部务会商模拟 · 筛选摘要</div>
      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        班次：<strong style={{ color: 'var(--text-primary)' }}>{cohort.label}</strong>
        {' · '}阈值 ≥{minScore} · 通过 {candidates.length}/{cohort.quota} 名额
      </p>
      {selected && (
        <div className="mb-3 p-3 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: cohort.accent }}>当前考核对象 · {selected.name}</div>
          <div className="flex flex-wrap gap-2 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            {ASSESSMENT_DIMS.map((d, i) => (
              <span key={d}>{d} {selected.scores[i]}</span>
            ))}
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>综合 {compositeScore(selected.scores)}</span>
          </div>
        </div>
      )}
      <div className="text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>短名单 Top 3</div>
      <ol className="space-y-1">
        {top.map((c, i) => (
          <li key={c.id} className="text-sm flex justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>{i + 1}. {c.name} · {c.province}</span>
            <span className="mono" style={{ color: cohort.accent }}>{c.fit}</span>
          </li>
        ))}
      </ol>
      <p className="text-[10px] mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>
        导出格式示意 · AS_OF {AS_OF} · 仅供教学推演
      </p>
    </div>
  );
}

export default function PartySchoolSection() {
  const [cohortKey, setCohortKey] = useState('youth');
  const [minScore, setMinScore] = useState(82);
  const [selectedId, setSelectedId] = useState(null);
  const [caseIdx, setCaseIdx] = useState(0);
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);

  const cohort = getCohort(cohortKey);
  const candidates = useMemo(() => filterCandidates(cohortKey, minScore), [cohortKey, minScore]);
  const selected = candidates.find((c) => c.id === selectedId) || candidates[0] || null;

  const genReport = () => {
    try {
      setReportMd(buildGraduationReport({ cohort, minScore, candidates, selected }));
    } catch (e) {
      setReportMd(`# 报告生成异常\n\n${String(e)}`);
    }
    setCopied(false);
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const courseDonut = useMemo(() => buildCourseDonut(), []);
  const leaderboard = useMemo(() => buildLeaderboard(cohortKey), [cohortKey]);
  const caseTimeline = useMemo(() => buildCaseTimeline(), []);
  const scheduleHeat = useMemo(() => buildScheduleHeatmap(), []);
  const assessRadar = useMemo(
    () => (selected ? buildAssessmentRadar(selected.scores, { name: selected.name, color: cohort.accent }) : buildAssessmentRadar([80, 80, 80, 80])),
    [selected, cohort.accent],
  );
  const cohortRadar = useMemo(
    () => (selected ? buildCohortRadar(cohort, selected) : null),
    [cohort, selected],
  );

  return (
    <div>
      <IntroCard>
        本模块为<strong style={{ color: 'var(--text-primary)' }}>推演沙盘 · 教学用途</strong>，模拟党校课程体系、教学人才遴选、班次组织筛选与人才考核流程。
        人才均为公开资料整理的<strong style={{ color: 'var(--text-primary)' }}>画像/原型</strong>，不指向任何真实人事评价。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={COURSE_MODULES.length} label="课程模块" accent="#c41e3a" />
        <Stat value={COHORTS.length} label="专题班次" accent="#22d3ee" />
        <Stat value={INSTRUCTORS.length} label="讲学人才池" accent="#e8a317" />
        <Stat value={ASSESSMENT_DIMS.length} label="考核维度" accent="#8b5cf6" />
      </Grid>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '理论垄断 · 梯队阀门', body: FRAMEWORK.salt.body, pillars: FRAMEWORK.salt.pillars },
        { key: 'stone', title: '摸石头方法论', subtitle: '专题班 · 案例推演', body: FRAMEWORK.stone.body, pillars: FRAMEWORK.stone.pillars },
        { key: 'path', title: '升级路径', subtitle: '教学—筛选—考核', body: FRAMEWORK.path.body, pillars: FRAMEWORK.path.pillars },
      ]} />

      <Card title="课程体系 · 模块卡片" className="mb-6">
        <Grid cols={3}>
          {COURSE_MODULES.map((m) => (
            <div key={m.key} className="os-card p-4" style={{ borderLeft: `3px solid ${m.accent}` }}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold" style={{ color: m.accent }}>{m.label}</span>
                <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{m.hours}h</span>
              </div>
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{m.desc}</p>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </Grid>
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>学分学时分布</div>
          <EChart option={courseDonut} style={{ height: 240 }} />
        </div>
      </Card>

      <Card title="教学人才推演 · 讲学遴选" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          从知识精英、智库、科研院所队列筛选适合党校讲学的学者与政策研究者（画像匹配，非真人推荐）。
        </p>
        <Grid cols={2}>
          {INSTRUCTORS.map((ins) => (
            <div key={ins.id} className="os-card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ins.name}</span>
                <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{ins.queue}</span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{ins.org} · {ins.field}</p>
              <div className="flex flex-wrap gap-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {ASSESSMENT_DIMS.map((d, i) => <span key={d}>{d} {ins.scores[i]}</span>)}
              </div>
              <Link to={buildTalentLink(ins.talentLink)} className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>
                人才库深链 ↗
              </Link>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="组织筛选 · 班次学员选拔" className="mb-6">
        <SelectorBar
          items={COHORTS.map((c) => ({ key: c.key, label: c.label, accent: c.accent }))}
          activeKey={cohortKey}
          onSelect={(k) => { setCohortKey(k); setSelectedId(null); }}
        />
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{cohort.desc}</p>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            综合分阈值
            <input
              type="range" min={70} max={95} value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="ml-2 align-middle"
            />
            <span className="mono ml-2" style={{ color: 'var(--fire-gold)' }}>≥{minScore}</span>
          </label>
        </div>
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>选拔维度雷达 · {selected?.name || '—'}</div>
            {cohortRadar && <EChart option={cohortRadar} style={{ height: 280 }} />}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>候选池（点击选中）</div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left os-card p-3 transition-colors ${selected?.id === c.id ? 'ring-1' : ''}`}
                  style={{
                    background: selected?.id === c.id ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    borderColor: selected?.id === c.id ? cohort.accent : 'var(--border-subtle)',
                    '--tw-ring-color': cohort.accent,
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    <span className="mono" style={{ color: cohort.accent }}>{c.fit}</span>
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {c.province} · {c.domain} · {c.age}岁
                  </div>
                </button>
              ))}
              {!candidates.length && (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>无符合阈值的候选人，请调低滑块。</p>
              )}
            </div>
          </div>
        </Grid>
      </Card>

      <Card title="人才考核 · 四维量规与排行榜" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>考核雷达 · 理论素养 / 政策解读 / 教学能力 / 党性修养</div>
            <EChart option={assessRadar} style={{ height: 280 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>班次考核排行榜</div>
            <EChart option={leaderboard} style={{ height: 280 }} />
          </div>
        </Grid>
      </Card>

      <Card title="治理教学场景 · 案例推演与排课表" className="mb-6">
        <TimelineBar
          stages={GOVERNANCE_CASES}
          activeIdx={caseIdx}
          onSelect={setCaseIdx}
        />
        <Grid cols={2} className="mt-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>案例参与度走势（示意）</div>
            <EChart option={caseTimeline} style={{ height: 220 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>专题班周排课热力</div>
            <EChart option={scheduleHeat} style={{ height: 220 }} />
          </div>
        </Grid>
        <div className="mt-4 os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>本周课表摘要</div>
          <Grid cols={5}>
            {SCHEDULE_BLOCKS.map((b) => (
              <div key={b.day} className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                <div className="font-semibold mb-1" style={{ color: 'var(--cyber-cyan)' }}>{b.day}</div>
                {b.slots.map((s) => <div key={s}>· {s}</div>)}
              </div>
            ))}
          </Grid>
        </div>
      </Card>

      <Card title="交互出口 · 筛选摘要面板" className="mb-6">
        <SummaryPanel cohort={cohort} candidates={candidates} selected={selected} minScore={minScore} />
      </Card>

      <Card title="📄 结业考核报告" className="mb-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          按当前班次、考核阈值与通过/淘汰名单生成 Markdown 结业报告（合成画像 · 仅供教学推演）。
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>生成结业报告</button>
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

    </div>
  );
}
