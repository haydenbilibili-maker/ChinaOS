import { AXIS, LABEL } from '../shared/chartHelpers.js';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import { IntroCard, SelectorBar } from '../shared/ModuleParadigm.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import SandboxToolkit from './SandboxToolkit.jsx';
import {
  HANDONG_SCENARIOS, HANDONG_TOOLS, TEAM_ROLES, DEFAULT_HANDONG_CONFIG,
  loadHandongConfig, saveHandongConfig,
} from './handongScenarios.js';
import {
  computeHandongBaseline, handongMitigatedImpact, handongComposite,
  buildCandidatePool, validateOfficial, buildHandongReport,
  computeGovernanceScores, suggestCadreActions,
} from './handongEngine.js';

const ACTION_COLORS = { 升迁: '#10b981', 留任: '#22d3ee', 约谈: '#e8a317', 调整: '#ef4444', 降职: '#c41e3a', 表彰: '#8b5cf6' };

const DEFAULT_ALLOC = Object.fromEntries(HANDONG_TOOLS.map((t) => [t.id, 20]));

export default function HandongSandbox() {
  const figures = useFigures();
  const [config, setConfig] = useState(loadHandongConfig);
  const [scenarioKey, setScenarioKey] = useState('anticorruption');
  const [secondCrisis, setSecondCrisis] = useState('');
  const [intensity, setIntensity] = useState(55);
  const [alloc, setAlloc] = useState(DEFAULT_ALLOC);
  const [reportMd, setReportMd] = useState('');
  const [reportCopied, setReportCopied] = useState(false);
  const [simStarted, setSimStarted] = useState(false);
  const [eventIdx, setEventIdx] = useState(0);
  const [activeRole, setActiveRole] = useState('secretary');

  useEffect(() => { saveHandongConfig(config); }, [config]);

  const baseline = useMemo(() => computeHandongBaseline(config), [config]);
  const scenario = useMemo(() => {
    const A = HANDONG_SCENARIOS[scenarioKey];
    if (secondCrisis && secondCrisis !== scenarioKey && HANDONG_SCENARIOS[secondCrisis]) {
      return handongComposite(A, HANDONG_SCENARIOS[secondCrisis], intensity);
    }
    return A;
  }, [scenarioKey, secondCrisis, intensity]);

  const engine = useMemo(() => handongMitigatedImpact(scenario, intensity, alloc), [scenario, intensity, alloc]);
  const governanceScores = useMemo(() => {
    const filledRoles = TEAM_ROLES.filter((r) => config.team[r.id]).length;
    const teamBonus = Math.min(8, filledRoles * 1.5);
    return computeGovernanceScores(engine.net, teamBonus);
  }, [engine.net, config.team]);

  const cadreActions = useMemo(
    () => suggestCadreActions(config.team, governanceScores, TEAM_ROLES),
    [config.team, governanceScores]
  );

  const timeline = scenario.timeline || [];
  const eventLog = simStarted ? timeline.slice(0, eventIdx + 1) : [];

  const industryPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'pie', radius: ['40%', '68%'],
      data: [
        { name: '第一产业', value: config.industryMix.primary, itemStyle: { color: '#10b981' } },
        { name: '第二产业', value: config.industryMix.secondary, itemStyle: { color: '#c41e3a' } },
        { name: '第三产业', value: config.industryMix.tertiary, itemStyle: { color: '#22d3ee' } },
      ],
      label: { color: LABEL.color, fontSize: 10 },
    }],
  }), [config.industryMix]);

  const radarOption = useMemo(() => ({
    radar: {
      indicator: governanceScores.map((s) => ({ name: s.domain, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [{ value: governanceScores.map((s) => s.score), name: '政绩', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
    }],
  }), [governanceScores]);

  const updateConfig = useCallback((patch) => setConfig((prev) => ({ ...prev, ...patch })), []);
  const updateNested = useCallback((key, sub, val) => {
    setConfig((prev) => ({ ...prev, [key]: { ...prev[key], [sub]: val } }));
  }, []);

  const assignOfficial = (roleId, official) => {
    setConfig((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        [roleId]: official ? { id: official.id, name: official.name, title: official.fields?.title || official.org || '', age: official.age, fields: official.fields } : null,
      },
    }));
  };

  const candidates = useMemo(() => buildCandidatePool(figures, activeRole), [figures, activeRole]);
  const activeRoleDef = TEAM_ROLES.find((r) => r.id === activeRole);

  const startSimulation = () => {
    setSimStarted(true);
    setEventIdx(0);
    setReportMd('');
  };

  const advanceEvent = () => {
    if (eventIdx < timeline.length - 1) setEventIdx((i) => i + 1);
  };

  const buildReport = useCallback(({ crisis, engine: eng, team, intensity: inten, alloc: a }) => buildHandongReport({
    scenarioLabel: crisis.label,
    config,
    intensity: inten,
    alloc: a,
    raw: eng.raw,
    net: eng.net,
    score: eng.score,
    verdict: eng.verdict,
    team,
    eventLog,
  }), [config, eventLog]);

  return (
    <div>
      <IntroCard>
        <span className="mono text-[10px] px-2 py-0.5 rounded mr-2" style={{ background: 'rgba(196,30,58,0.15)', color: 'var(--china-red)' }}>虚构推演 · 汉东省沙盘</span>
        汉东省为<strong style={{ color: 'var(--text-primary)' }}>虚构省域</strong>（省会京州市），灵感取自戏剧叙事但采用冷峻中立分析口径。配置 P0 参数 → 选派主官组建班子 → 选择情景推演 → 调用四件套（政策配置/复合危机/应对小组/治理报告）→ 根据政绩生成升迁任免建议。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${config.population} 万`} label="常住人口" accent="#22d3ee" />
        <Stat value={config.capital} label="省会" accent="#e8a317" />
        <Stat value={`${config.gdpGrowth}%`} label="GDP 增速（设定）" accent="#10b981" />
        <Stat value={baseline.entropy} label="省域熵增指数" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="汉东省 · P0 参数配置">
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span style={{ color: 'var(--text-tertiary)' }}>人口（万）</span>
                <input type="number" value={config.population} min={500} max={15000}
                  onChange={(e) => updateConfig({ population: Number(e.target.value) })}
                  className="w-full mt-1 os-input" />
              </label>
              <label className="block">
                <span style={{ color: 'var(--text-tertiary)' }}>省会</span>
                <input type="text" value={config.capital}
                  onChange={(e) => updateConfig({ capital: e.target.value })}
                  className="w-full mt-1 os-input" />
              </label>
              <label className="block">
                <span style={{ color: 'var(--text-tertiary)' }}>GDP 增速 %</span>
                <input type="range" min={1} max={12} step={0.1} value={config.gdpGrowth}
                  onChange={(e) => updateConfig({ gdpGrowth: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#10b981' }} />
                <span className="mono">{config.gdpGrowth}%</span>
              </label>
              <label className="block">
                <span style={{ color: 'var(--text-tertiary)' }}>经济发展水平</span>
                <select value={config.gdpTier} onChange={(e) => updateConfig({ gdpTier: e.target.value })}
                  className="w-full mt-1 os-input">
                  <option value="落后">落后</option>
                  <option value="中游">中游</option>
                  <option value="上游">上游</option>
                </select>
              </label>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>财政自给 {config.fiscalSelf}% · 债务率 {config.debtRatio}%</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input type="range" min={10} max={90} value={config.fiscalSelf}
                  onChange={(e) => updateConfig({ fiscalSelf: Number(e.target.value) })}
                  style={{ accentColor: '#e8a317' }} />
                <input type="range" min={50} max={350} value={config.debtRatio}
                  onChange={(e) => updateConfig({ debtRatio: Number(e.target.value) })}
                  style={{ accentColor: '#c41e3a' }} />
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>资源禀赋</span>
              {Object.entries(config.resources).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mt-1">
                  <span className="w-12 mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <input type="range" min={0} max={100} value={v}
                    onChange={(e) => updateNested('resources', k, Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#22d3ee' }} />
                  <span className="mono w-6 text-right">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>产业结构（合计自动归一）</span>
              {['primary', 'secondary', 'tertiary'].map((k, i) => {
                const labels = ['一产', '二产', '三产'];
                return (
                  <div key={k} className="flex items-center gap-2 mt-1">
                    <span className="w-8 text-[10px]">{labels[i]}</span>
                    <input type="range" min={5} max={70} value={config.industryMix[k]}
                      onChange={(e) => updateNested('industryMix', k, Number(e.target.value))}
                      style={{ flex: 1, accentColor: '#8b5cf6' }} />
                    <span className="mono w-8">{config.industryMix[k]}%</span>
                  </div>
                );
              })}
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>班子结构</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="text-[10px]">常委 {config.teamStructure.standingCommittee}
                  <input type="range" min={9} max={13} value={config.teamStructure.standingCommittee}
                    onChange={(e) => updateNested('teamStructure', 'standingCommittee', Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#c41e3a' }} />
                </label>
                <label className="text-[10px]">平均年龄 {config.teamStructure.avgAge}
                  <input type="range" min={48} max={58} value={config.teamStructure.avgAge}
                    onChange={(e) => updateNested('teamStructure', 'avgAge', Number(e.target.value))}
                    style={{ width: '100%' }} />
                </label>
                <label className="text-[10px]">研究生占比 {config.teamStructure.graduateRatio}%
                  <input type="range" min={40} max={95} value={config.teamStructure.graduateRatio}
                    onChange={(e) => updateNested('teamStructure', 'graduateRatio', Number(e.target.value))}
                    style={{ width: '100%' }} />
                </label>
              </div>
            </div>
            <button type="button" onClick={() => setConfig({ ...DEFAULT_HANDONG_CONFIG, team: { ...DEFAULT_HANDONG_CONFIG.team } })}
              className="text-[10px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              恢复默认参数
            </button>
          </div>
        </Card>

        <Card title="产业结构 · 政绩雷达（实时）">
          <Grid cols={2}>
            <EChart option={industryPieOption} style={{ height: 200 }} />
            <EChart option={radarOption} style={{ height: 200 }} />
          </Grid>
          <p className="text-[10px] mt-2 mono" style={{ color: 'var(--text-tertiary)' }}>
            熵增 = 0.35×(100−财政自给) + 0.3×债务率/3 + 0.2×增速缺口 + 0.15×资源短板
          </p>
        </Card>
      </Grid>

      <Card title="主官派遣 · 班子组建" className="mb-6">
        <SelectorBar items={TEAM_ROLES} activeKey={activeRole} onSelect={setActiveRole} getKey={(r) => r.id} getLabel={(r) => r.label} />
        <Grid cols={2}>
          <div>
            <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>
              候选池 · {activeRoleDef?.label}（履历关键词匹配）
            </div>
            {figures === null && <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 加载政要库…</p>}
            {!candidates.length && figures && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                暂无匹配候选。到 <Link to="/talent" style={{ color: 'var(--cyber-cyan)' }}>人才精英库</Link> 载入数据。
              </p>
            )}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {candidates.map((f) => (
                <button key={f.id || f.name} type="button" onClick={() => assignOfficial(activeRole, f)}
                  className="w-full text-left p-2 rounded os-card-interactive"
                  style={{ background: config.team[activeRole]?.name === f.name ? 'rgba(196,30,58,0.12)' : 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{f.fields?.title || f.org} · 匹配 {f.matchScore}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>当前班子</div>
            <div className="space-y-2">
              {TEAM_ROLES.map((role) => {
                const off = config.team[role.id];
                const val = validateOfficial(off, role);
                return (
                  <div key={role.id} className="p-2 rounded flex justify-between items-start" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${val.ok ? '#10b981' : '#ef4444'}` }}>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{role.label}</div>
                      {off ? (
                        <>
                          <div className="text-[11px]" style={{ color: 'var(--cyber-cyan)' }}>{off.name} · {off.title}</div>
                          <div className="text-[9px] mono" style={{ color: val.ok ? '#10b981' : '#ef4444' }}>{val.msg}</div>
                        </>
                      ) : (
                        <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{role.required ? '必填岗 · 待选派' : '选填 · 空缺'}</div>
                      )}
                    </div>
                    {off && (
                      <button type="button" onClick={() => assignOfficial(role.id, null)} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>撤换</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
      </Card>

      <Card title="多场景模拟 · 剧情推演" className="mb-6">
        <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {Object.entries(HANDONG_SCENARIOS).map(([k, s]) => (
            <button key={k} type="button" onClick={() => { setScenarioKey(k); setSimStarted(false); setEventIdx(0); }}
              className="os-card p-3 text-left transition-colors"
              style={{
                background: k === scenarioKey ? `${s.color}18` : 'var(--bg-elevated)',
                border: k === scenarioKey ? `1px solid ${s.color}66` : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}>
              <div className="text-xs font-semibold" style={{ color: k === scenarioKey ? s.color : 'var(--text-primary)' }}>{s.label}</div>
              <p className="text-[10px] mt-1 leading-snug line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{s.intro.slice(0, 48)}…</p>
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <button type="button" onClick={startSimulation} className="os-btn os-btn-primary os-btn-sm">启动推演</button>
          {simStarted && eventIdx < timeline.length - 1 && (
            <button type="button" onClick={advanceEvent} className="os-btn os-btn-sm">推进剧情 (+1)</button>
          )}
          <span className="text-[10px] mono self-center" style={{ color: 'var(--text-tertiary)' }}>
            {simStarted ? `进度 ${eventIdx + 1}/${timeline.length}` : '选择情景后启动'}
          </span>
        </div>
        {simStarted && (
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${scenario.color}` }}>
            <div className="text-[10px] mono mb-2" style={{ color: scenario.color }}>剧情推演 · {scenario.label}</div>
            <div className="space-y-2">
              {eventLog.map((ev, i) => (
                <div key={ev.phase + i} className="flex gap-2 text-xs" style={{ opacity: i === eventIdx ? 1 : 0.65 }}>
                  <span className="mono shrink-0 px-1.5 py-0.5 rounded text-[10px]" style={{ background: `${scenario.color}22`, color: scenario.color }}>{ev.phase}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{ev.event}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap mt-3">
              {scenario.triggers?.map((t) => (
                <span key={t} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(148,163,184,0.12)', color: 'var(--text-tertiary)' }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mb-6">
        <SandboxToolkit
          mode="handong"
          crises={HANDONG_SCENARIOS}
          crisisKey={scenarioKey}
          setCrisisKey={(k) => { setScenarioKey(k); setSimStarted(false); }}
          secondCrisis={secondCrisis}
          setSecondCrisis={setSecondCrisis}
          intensity={intensity}
          setIntensity={setIntensity}
          alloc={alloc}
          setAlloc={setAlloc}
          figures={figures}
          reportMd={reportMd}
          setReportMd={setReportMd}
          reportCopied={reportCopied}
          setReportCopied={setReportCopied}
          buildReport={buildReport}
          title="汉东省危机应对 · 四件套"
          subtitle="政策资源配置器 · 复合危机叠加 · 应对小组自动组建 · 治理报告生成"
        />
      </div>

      <Card title="升迁与任免 · 政绩驱动" className="mb-6">
        {!cadreActions.length ? (
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>请先完成主官选派并运行推演，系统将基于五域政绩分生成任免建议。</p>
        ) : (
          <Grid cols={2}>
            {cadreActions.map((a) => (
              <div key={a.roleId} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${ACTION_COLORS[a.action] || '#93a1b5'}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{a.roleLabel} · {a.name}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{a.title}</div>
                  </div>
                  <span className="text-[10px] mono px-2 py-0.5 rounded font-semibold" style={{ background: `${ACTION_COLORS[a.action]}22`, color: ACTION_COLORS[a.action] }}>{a.action}</span>
                </div>
                <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.reason}</p>
                <Link to={a.talentLink} className="text-[10px] mono mt-1 inline-block" style={{ color: 'var(--cyber-cyan)' }}>查看履历 ↗</Link>
              </div>
            ))}
          </Grid>
        )}
        <Grid cols={5} className="mt-4">
          {governanceScores.map((s) => (
            <Stat key={s.domain} value={s.score} label={s.domain} accent={s.score >= 70 ? '#10b981' : s.score >= 50 ? '#e8a317' : '#c41e3a'} />
          ))}
        </Grid>
      </Card>

      <CrossLinks title="横向打通 · 汉东推演关联" links={[
        { to: '/talent', label: '人才精英库 · 中国政要', note: '主官派遣候选池与履历深链。' },
        { to: '/anticorruption', label: '反腐专题', note: '反腐风暴情景的制度语境。' },
        { to: '/policydocs', label: '政策文件库', note: '产业政策与督查整改话语支撑。' },
        { to: '/sandbox?tab=party-school', label: '党校研修', note: '干部培训与梯队建设参照。' },
      ]} />
    </div>
  );
}
