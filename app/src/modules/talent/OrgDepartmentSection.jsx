import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Grid, Stat, OS_INPUT } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio } from '../shared/ModuleParadigm.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import { ABILITY_DIMS, TAG_DEFS, profileOf, matchScore, summarizeLibrary } from '../shared/talentProfile.js';
import { CRISES, CRISIS_DOMAINS } from '../sandbox/crisisData.js';
import { abilityToDomain } from '../handong/realPool.js';

// ============================================================================
// 中央组织部 · 全库人才画像引擎（模拟）
// 画像由公开履历关键词自动推断（算法层 shared/talentProfile.js），
// 情景匹配为沙盒危机库（sandbox/crisisData.js）提供人岗匹配底座的演示。
// 思想实验框架，不代表任何机构真实流程，不构成人事评价。
// ============================================================================

const GOLD = '#e8a317';
const AXIS = '#27324a';
const LABEL = '#93a1b5';
const SPLIT = 'rgba(148,163,184,0.1)';

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };

// 雷达底座：六维统一指标轴
const RADAR_FRAME = {
  indicator: ABILITY_DIMS.map((d) => ({ name: d, max: 100 })),
  axisName: { color: LABEL, fontSize: 10 },
  splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
  axisLine: { lineStyle: { color: SPLIT } },
  splitArea: { show: false },
};

// 治理场景（内联）：需求向量与 ABILITY_DIMS 同序
// [理论素养, 治理实操, 组织动员, 经济金融, 科技产业, 风险应对]
const GOV_SCENES = [
  { key: 'rural', label: '乡村振兴攻坚', color: '#10b981', need: [45, 92, 85, 55, 35, 60], desc: '县域治理 + 组织动员 + 农业农村条线经验为先的攻坚场景。' },
  { key: 'finrisk', label: '金融风险处置', color: '#22d3ee', need: [40, 60, 45, 95, 35, 88], desc: '经济金融专业线 + 风险应对能力为先的拆弹场景。' },
];

// 六危机（沙盒库）+ 治理场景 → 统一场景列表；危机 needDims = impact × 100
// 注：危机 impact 按六域（科技/经济/社会/外交/能源/金融）刻画，此处按序近似映射到六维能力需求
const SCENES = [
  ...Object.entries(CRISES).map(([key, c]) => ({
    key, label: c.label, color: c.color,
    need: c.impact.map((v) => Math.round(v * 100)),
    desc: `${c.intro}（需求向量 = 危机六域冲击系数 × 100，域序 ${CRISIS_DOMAINS.join('/')} 按序映射六维）`,
  })),
  ...GOV_SCENES,
];

const LEVEL_ORDER = ['党和国家领导人', '副国级', '正部级', '省部级', '副部级', '正厅级'];

// 汉东沙盘六域空间（与 handong/Page.jsx HD_DOMAINS 同序）：补位推荐的需求向量口径
const HD_DOMAINS = ['科技产业', '经济', '社会民生', '外部环境', '能源资源', '金融财政'];

function tagDefOf(label) {
  return TAG_DEFS.find((t) => t.label === label);
}

/** 六维分行条 */
function DimRows({ dims, accent = GOLD }) {
  return (
    <div className="space-y-1.5">
      {ABILITY_DIMS.map((d, i) => (
        <div key={d} className="flex items-center gap-2">
          <span className="text-[11px] mono w-14 shrink-0" style={{ color: LABEL }}>{d}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: SPLIT }}>
            <div className="h-full rounded-full" style={{ width: `${dims[i]}%`, background: accent }} />
          </div>
          <span className="text-[11px] mono w-7 text-right" style={{ color: 'var(--text-secondary)' }}>{dims[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function OrgDepartmentSection() {
  const figures = useFigures();
  const [query, setQuery] = useState('');
  const [tagSel, setTagSel] = useState([]); // 多选 AND（tagId 数组）
  const [levelSel, setLevelSel] = useState('全部');
  const [picked, setPicked] = useState(null); // 选中人物 name
  const [scnKey, setScnKey] = useState('chipBan');
  const [report, setReport] = useState('');
  const [copied, setCopied] = useState(false);

  // ── 全库画像：profileOf 一次性跑完并缓存 ──
  const profiles = useMemo(
    () => (figures || []).map((f) => ({ fig: f, p: profileOf(f) })),
    [figures]
  );
  const lib = useMemo(
    () => (profiles.length ? summarizeLibrary(profiles.map((x) => x.p)) : null),
    [profiles]
  );

  const stats = useMemo(() => {
    if (!lib) return null;
    const tagged = profiles.filter((x) => x.p.tags.length > 0).length;
    return {
      count: profiles.length,
      tagCover: Math.round((tagged / profiles.length) * 100),
      crossAvg: Math.round(lib.crossProvAvg * 10) / 10,
      dimMean: Math.round(lib.dimAvg.reduce((a, b) => a + b, 0) / lib.dimAvg.length),
    };
  }, [profiles, lib]);

  const libRadarOption = useMemo(() => lib && ({
    radar: RADAR_FRAME,
    series: [{ type: 'radar', data: [{ value: lib.dimAvg.map((v) => Math.round(v)), name: '全库六维均值', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' }, itemStyle: { color: '#c41e3a' } }] }],
  }), [lib]);

  const tagBarOption = useMemo(() => lib && ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 86, right: 36, top: 8, bottom: 20 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { color: LABEL, fontSize: 10 } },
    yAxis: { type: 'category', data: [...TAG_DEFS].reverse().map((t) => t.label), axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: LABEL, fontSize: 10 } },
    series: [{ type: 'bar', barWidth: 10, data: [...TAG_DEFS].reverse().map((t) => ({ value: lib.tagCounts[t.label] || 0, itemStyle: { color: t.color, borderRadius: [0, 3, 3, 0] } })), label: { show: true, position: 'right', color: LABEL, fontSize: 10 } }],
  }), [lib]);

  // ── 画像浏览器：搜索 + 标签 AND + 层级筛选 ──
  const levels = useMemo(() => {
    const set = new Set(profiles.map((x) => x.p.seniority));
    return ['全部', ...LEVEL_ORDER.filter((l) => set.has(l)), ...[...set].filter((l) => !LEVEL_ORDER.includes(l))];
  }, [profiles]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return profiles.filter(({ fig, p }) => {
      if (levelSel !== '全部' && p.seniority !== levelSel) return false;
      if (tagSel.length && !tagSel.every((id) => p.tagIds.includes(id))) return false;
      if (!q) return true;
      const hay = [fig.name, fig.org, fig.role, fig.province, fig.fields?.title, fig.raw].filter(Boolean).join(' ');
      return hay.includes(q);
    });
  }, [profiles, query, tagSel, levelSel]);

  const shown = filtered.slice(0, 30);
  const selected = useMemo(() => profiles.find((x) => x.fig.name === picked) || null, [profiles, picked]);

  const personRadarOption = useMemo(() => selected && ({
    radar: RADAR_FRAME,
    series: [{ type: 'radar', data: [{ value: selected.p.dims, name: selected.fig.name, lineStyle: { color: GOLD }, areaStyle: { color: 'rgba(232,163,23,0.15)' }, itemStyle: { color: GOLD } }] }],
  }), [selected]);

  // ── 情景匹配引擎：全库 matchScore 排序 ──
  const scene = SCENES.find((s) => s.key === scnKey) || SCENES[0];
  const ranking = useMemo(
    () => profiles
      .map(({ fig, p }) => ({ fig, p, score: Math.round(matchScore(p.dims, scene.need)) }))
      .sort((a, b) => b.score - a.score),
    [profiles, scene]
  );
  const top12 = ranking.slice(0, 12);
  const top1 = top12[0] || null;

  const matchRadarOption = useMemo(() => top1 && ({
    legend: { data: ['场景需求', top1.fig.name], textStyle: { color: LABEL, fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10 },
    radar: { ...RADAR_FRAME, radius: '62%' },
    series: [{ type: 'radar', data: [
      { value: scene.need, name: '场景需求', lineStyle: { color: scene.color }, areaStyle: { opacity: 0.1 }, itemStyle: { color: scene.color } },
      { value: top1.p.dims, name: top1.fig.name, lineStyle: { color: GOLD }, areaStyle: { color: 'rgba(232,163,23,0.12)' }, itemStyle: { color: GOLD } },
    ] }],
  }), [scene, top1]);

  // ── 汉东补位联动：读出缺账本（'cos-hd-vacancies'，mount 读一次 + 双监听）──
  // useRef 缓存原始串：同串不重设 state，避免账本事件风暴下的无谓重渲染
  const [hdVacancies, setHdVacancies] = useState(null);
  const vacRawRef = useRef(null);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('cos-hd-vacancies');
        if (raw === vacRawRef.current) return;
        vacRawRef.current = raw;
        const parsed = JSON.parse(raw || 'null');
        setHdVacancies(parsed && Array.isArray(parsed.vacancies) ? parsed : null);
      } catch (_) { setHdVacancies(null); }
    };
    read();
    window.addEventListener('storage', read);
    window.addEventListener('cos-ledger-change', read);
    return () => {
      window.removeEventListener('storage', read);
      window.removeEventListener('cos-ledger-change', read);
    };
  }, []);

  // ── 汉东补位推荐：全库画像（能力空间）经 abilityToDomain 投影到汉东六域空间，
  //    按各出缺岗位 need 向量 matchScore 排序取 Top5（复用 profiles 缓存，不重跑 profileOf）──
  const hdRecs = useMemo(() => {
    const vacs = hdVacancies?.vacancies;
    if (!Array.isArray(vacs) || !vacs.length || !profiles.length) return null;
    const pool = profiles.map(({ fig, p }) => ({ fig, p, domainDims: abilityToDomain(p.dims, p.tagIds) }));
    const recs = {};
    const blocks = vacs.map((v) => {
      const top5 = pool
        .map((x) => ({ fig: x.fig, p: x.p, score: matchScore(x.domainDims, v.need) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      recs[v.postId] = top5.map((x) => ({
        name: x.fig.name, score: x.score, level: x.p.seniority, tags: (x.p.tags || []).slice(0, 2),
      }));
      return { postId: v.postId, label: v.label, need: v.need, top5 };
    });
    return { blocks, recs };
  }, [hdVacancies, profiles]);

  // ── 名单回流汉东：Top5 按契约写 'cos-hd-recommend'（useRef 缓存 JSON 串，不同才写防循环）──
  const recWrittenRef = useRef('');
  useEffect(() => {
    if (!hdRecs) return;
    const payload = JSON.stringify(hdRecs.recs);
    if (payload === recWrittenRef.current) return;
    try {
      let prevStamp = 0;
      try {
        const parsed = JSON.parse(localStorage.getItem('cos-hd-recommend') || 'null');
        prevStamp = Number(parsed?.stamp) || 0;
      } catch (_) { /* 坏档按 0 起步 */ }
      localStorage.setItem('cos-hd-recommend', JSON.stringify({ recs: hdRecs.recs, stamp: prevStamp + 1 }));
      recWrittenRef.current = payload;
      window.dispatchEvent(new CustomEvent('cos-ledger-change'));
    } catch (_) { /* 存储不可用时静默放弃 */ }
  }, [hdRecs]);

  // ── 流动性分析：跨省分布 + 历练/深耕占比 ──
  const mobility = useMemo(() => {
    const bins = [0, 0, 0, 0];
    profiles.forEach(({ p }) => { bins[Math.min(p.crossProv, 3)] += 1; });
    const mobile = profiles.filter(({ p }) => p.crossProv >= 2).length;
    const share = profiles.length ? Math.round((mobile / profiles.length) * 100) : 0;
    return { bins, mobile, local: profiles.length - mobile, share };
  }, [profiles]);

  const mobBarOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 16, top: 16, bottom: 24 },
    xAxis: { type: 'category', data: ['0 省', '1 省', '2 省', '3+ 省'], axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: LABEL } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { color: LABEL, fontSize: 10 } },
    series: [{ type: 'bar', barWidth: 26, data: mobility.bins, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] }, label: { show: true, position: 'top', color: LABEL, fontSize: 10 } }],
  }), [mobility]);

  const mobDonutOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['52%', '76%'], label: { color: LABEL, fontSize: 10, formatter: '{b}\n{c} 人 ({d}%)' }, data: [
      { name: '跨省历练（≥2 省）', value: mobility.mobile, itemStyle: { color: '#c41e3a' } },
      { name: '本地深耕（≤1 省）', value: mobility.local, itemStyle: { color: '#64748b' } },
    ] }],
  }), [mobility]);

  const toggleTag = (id) => setTagSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // ── 人岗匹配报告：当前情景 + 匹配结果 + 库级统计 → Markdown ──
  const genReport = () => {
    if (!lib || !stats) return;
    const lines = [];
    lines.push('# 组织画像引擎 · 人岗匹配报告');
    lines.push('');
    lines.push(`> 情景匹配引擎输出 · 全库 ${stats.count} 人画像 × matchScore 加权向量距离（算法演示）`);
    lines.push('');
    lines.push('## 一、情景与需求画像');
    lines.push('');
    lines.push(`- 选中情景：**${scene.label}**（key: ${scene.key}）`);
    lines.push(`- 情景说明：${scene.desc}`);
    lines.push('- 需求向量（六维，0-100）：');
    ABILITY_DIMS.forEach((d, i) => lines.push(`  - ${d}：${scene.need[i]}`));
    const needMax = Math.max(...scene.need);
    lines.push(`- 首要需求维度：**${ABILITY_DIMS[scene.need.indexOf(needMax)]}**（${needMax}）——匹配权重随需求强度分配。`);
    lines.push('');
    lines.push('## 二、Top 推荐名单');
    lines.push('');
    top12.forEach(({ fig, p, score }, i) => {
      const tags = p.tags.length ? p.tags.join('/') : '无标签命中';
      lines.push(`${i + 1}. ${fig.name} — 匹配分 ${score} · ${p.seniority} · 标签：${tags}（公开履历画像）`);
    });
    lines.push('');
    lines.push('## 三、库级供给面观察');
    lines.push('');
    lines.push(`- 已画像 ${stats.count} 人；经历标签覆盖率 ${stats.tagCover}%；平均跨省足迹 ${stats.crossAvg}；六维总均分 ${stats.dimMean}。`);
    lines.push(`- 全库六维均值：${ABILITY_DIMS.map((d, i) => `${d} ${Math.round(lib.dimAvg[i])}`).join(' / ')}。`);
    const topTags = Object.entries(lib.tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topTags.length) lines.push(`- 标签供给前三：${topTags.map(([t, c]) => `${t}（${c} 人）`).join('、')}。`);
    lines.push(`- 跨省历练（≥2 省）${mobility.mobile} 人（${mobility.share}%），本地深耕（≤1 省）${mobility.local} 人。`);
    const gaps = ABILITY_DIMS
      .map((d, i) => ({ d, gap: scene.need[i] - Math.round(lib.dimAvg[i]) }))
      .filter((x) => x.gap > 0)
      .sort((a, b) => b.gap - a.gap);
    lines.push(gaps.length
      ? `- 供给缺口（需求 − 全库均值 > 0）：${gaps.map((x) => `${x.d} +${x.gap}`).join('、')}——该情景需求对全库供给面构成结构性压力。`
      : '- 本情景各维需求均不超过全库均值，供给面整体充裕。');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('*画像由公开履历关键词自动推断，匹配为算法演示；不构成对任何真实人物的人事评价或预测*');
    setReport(lines.join('\n'));
    setCopied(false);
  };

  const copyReport = () => {
    navigator.clipboard?.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <>
      <IntroCard>
        在干部治理体系中，组织部门事实上扮演干部数据的中枢处理器角色——「知事识人、人岗相适」是这套制度的标准表达：
        以履历、考核与日常考察为输入，以班子配备与岗位匹配为输出。本引擎将这一逻辑做成可触摸的模拟：对全库公开履历
        逐条运行关键词画像算法（六维能力 + 12 类经历标签 + 跨省/跨系统足迹），并以向量匹配把画像接入沙盒危机情景，
        演示「情景需求 → 人才检索」的底座机制。模拟性质声明：画像由公开履历文本自动推断，分值只刻画关键词命中的
        相对差异，不代表任何机构的真实流程与评价。
      </IntroCard>

      {!profiles.length ? (
        <Card title="人才库为空 · 引擎待命">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            画像引擎依赖人才库中的公开履历数据。请先到「人才库」模块载入内置数据，本页将自动完成全库画像与情景匹配。
          </p>
        </Card>
      ) : (
        <>
          {/* ── 库级总览 ── */}
          <Grid cols={4} className="mb-8">
            <Stat value={stats.count} label="已画像人数" accent="#c41e3a" />
            <Stat value={`${stats.tagCover}%`} label="经历标签覆盖率" accent="#22d3ee" />
            <Stat value={stats.crossAvg} label="平均跨省足迹数" accent={GOLD} />
            <Stat value={stats.dimMean} label="六维总均分" accent="#8b5cf6" />
          </Grid>
          <Grid cols={2} className="mb-8">
            <Card title="全库六维能力均值 · 雷达" asSection={false}>
              <EChart option={libRadarOption} style={{ height: 300 }} />
            </Card>
            <Card title="12 类经历标签 · 全库命中计数" asSection={false}>
              <EChart option={tagBarOption} style={{ height: 300 }} />
            </Card>
          </Grid>

          {/* ── 画像浏览器 ── */}
          <Card title="画像浏览器 · 全库检索与单人画像卡">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索姓名 / 机构 / 履历关键词…"
                style={{ ...OS_INPUT, minWidth: 240 }}
              />
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>命中 {filtered.length} / {profiles.length} 人</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {TAG_DEFS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`os-filter-chip mono ${tagSel.includes(t.id) ? 'is-active' : ''}`}
                  style={{ '--chip-accent': t.color }}
                >{t.label}</button>
              ))}
            </div>
            <SelectorBar
              items={levels.map((l) => ({ key: l, label: l, accent: '#22d3ee' }))}
              activeKey={levelSel}
              onSelect={setLevelSel}
            />
            <Grid cols={2} gap="1.25rem">
              <div>
                <div className="space-y-1">
                  {shown.map(({ fig, p }) => (
                    <button
                      key={fig.name}
                      type="button"
                      onClick={() => setPicked(fig.name)}
                      className="w-full text-left px-3 py-2 rounded flex items-center justify-between gap-2"
                      style={{
                        background: picked === fig.name ? 'var(--bg-elevated)' : 'transparent',
                        border: `1px solid ${picked === fig.name ? GOLD : 'var(--border-subtle)'}`,
                      }}
                    >
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{fig.name}</span>
                      <span className="text-[11px] mono shrink-0" style={{ color: LABEL }}>
                        {p.seniority} · {p.tags.length} 标签 · 跨省 {p.crossProv}
                      </span>
                    </button>
                  ))}
                </div>
                {filtered.length > 30 && (
                  <p className="text-[11px] mt-2 mono" style={{ color: 'var(--text-tertiary)' }}>
                    已折叠 {filtered.length - 30} 条结果——请用搜索 / 标签 / 层级进一步收窄。
                  </p>
                )}
                {!filtered.length && (
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>无匹配结果，请放宽筛选条件。</p>
                )}
              </div>
              <div>
                {selected ? (
                  <>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{selected.fig.name}</span>
                      <span className="text-[11px] mono" style={{ color: GOLD }}>{selected.p.seniority}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      现任：{selected.fig.fields?.title || selected.fig.role || selected.fig.org || '—'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selected.p.tags.length ? selected.p.tags.map((label) => {
                        const def = tagDefOf(label);
                        return (
                          <span key={label} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ color: def?.color || LABEL, border: `1px solid ${def?.color || LABEL}` }}>{label}</span>
                        );
                      }) : <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>无标签命中</span>}
                    </div>
                    <div className="flex gap-4 text-[11px] mono mb-2" style={{ color: LABEL }}>
                      <span>跨省 {selected.p.crossProv}</span>
                      <span>跨系统 {selected.p.crossSys}</span>
                      <span>履历年限 {selected.p.spanYears} 年</span>
                    </div>
                    <EChart option={personRadarOption} style={{ height: 220 }} />
                    <DimRows dims={selected.p.dims} />
                  </>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    ← 点选左侧任意人物，查看六维雷达、经历标签与流动足迹组成的个人画像卡。
                  </p>
                )}
              </div>
            </Grid>
          </Card>

          {/* ── 情景匹配引擎 ── */}
          <Card title="情景匹配引擎 · 需求向量 × 全库画像（沙盒底座演示）">
            <SelectorBar items={SCENES} activeKey={scnKey} onSelect={setScnKey} getKey={(s) => s.key} getAccent={(s) => s.color} />
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{scene.desc}</p>
            <Grid cols={2} gap="1.25rem">
              <div>
                <div className="text-[11px] mono mb-2" style={{ color: LABEL }}>全库匹配 Top 12（matchScore 加权向量距离）</div>
                <Grid cols={2} gap="0.4rem 1rem">
                  {top12.map(({ fig, p, score }, i) => {
                    const strongest = ABILITY_DIMS[p.dims.indexOf(Math.max(...p.dims))];
                    return (
                      <div key={fig.name} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', border: `1px solid ${i === 0 ? scene.color : 'var(--border-subtle)'}` }}>
                        <span className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                          <span className="mono mr-1" style={{ color: 'var(--text-tertiary)' }}>{i + 1}.</span>{fig.name}
                        </span>
                        <span className="text-[10px] mono shrink-0 text-right" style={{ color: LABEL }}>
                          {p.seniority}<br /><span style={{ color: scene.color }}>{score}</span> · {strongest}
                        </span>
                      </div>
                    );
                  })}
                </Grid>
              </div>
              <div>
                <div className="text-[11px] mono mb-2" style={{ color: LABEL }}>需求 vs Top1 画像 · 双系列雷达</div>
                {matchRadarOption && <EChart option={matchRadarOption} style={{ height: 280 }} />}
                {top1 && (
                  <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Top1 {top1.fig.name} 匹配分 {top1.score}：分值仅刻画画像向量与场景需求向量的相对贴合度，权重随需求强度分配，为推演演示而非任何形式的人事结论。
                  </p>
                )}
              </div>
            </Grid>
          </Card>

          {/* ── 汉东补位推荐：跨模块联动（出缺账本 → 全库画像 Top5 → 名单回流沙盘）── */}
          <Card title="🏯 汉东补位推荐 · 跨模块联动">
            {!hdRecs ? (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                汉东班子目前满员——沙盘那边没有空椅子
              </p>
            ) : (
              <>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                  汉东治理沙盘第 {hdVacancies?.term ?? '—'} 届班子出缺 {hdRecs.blocks.length} 岗。全库画像经能力空间 → 汉东六域空间线性投影后，按各岗需求向量加权匹配取 Top5，名单已回流沙盘「班子组建」区。
                </p>
                <div className="space-y-3">
                  {hdRecs.blocks.map((b) => (
                    <div key={b.postId} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-baseline gap-2 flex-wrap mb-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{b.label}</span>
                        <span className="text-[10px] mono" style={{ color: LABEL }}>
                          需求 {HD_DOMAINS.map((d, i) => `${d} ${(b.need && b.need[i]) || 0}`).join(' · ')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {b.top5.map((x, i) => (
                          <div key={`${x.fig.name}-${i}`} className="flex items-center gap-2 text-xs flex-wrap">
                            <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)', width: 18 }}>{i + 1}.</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{x.fig.name}</span>
                            <span className="mono shrink-0" style={{ color: '#8b5cf6' }}>匹配 {x.score}</span>
                            <span className="text-[10px] mono shrink-0" style={{ color: LABEL }}>{x.p.seniority}</span>
                            {(x.p.tags || []).slice(0, 2).map((t) => (
                              <span key={t} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ border: '1px solid var(--border-subtle)', color: LABEL }}>{t}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
              画像由公开履历关键词自动推断，推荐为算法演示；不构成对任何真实人物的人事评价或预测
            </p>
          </Card>

          {/* ── 人岗匹配报告 ── */}
          <Card title="📄 人岗匹配报告">
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              将当前选中情景（{scene.label}）的需求画像、Top 推荐名单与库级供给面观察拼装为 Markdown 报告，可一键复制归档。
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" style={BTN_CYAN} onClick={genReport}>生成匹配报告</button>
              {report && (
                <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
                  {copied ? '已复制 ✓' : '复制 Markdown'}
                </button>
              )}
            </div>
            {report && (
              <pre
                className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
                style={{
                  background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
                }}
              >{report}</pre>
            )}
          </Card>

          {/* ── 流动性分析 ── */}
          <Card title="流动性分析 · 异地交流制度的画像痕迹">
            <Grid cols={2} gap="1.25rem">
              <div>
                <div className="text-[11px] mono mb-2" style={{ color: LABEL }}>跨省足迹数分布（履历文本检出的省级地名数）</div>
                <EChart option={mobBarOption} style={{ height: 240 }} />
              </div>
              <div>
                <div className="text-[11px] mono mb-2" style={{ color: LABEL }}>跨省历练 vs 本地深耕</div>
                <EChart option={mobDonutOption} style={{ height: 240 }} />
              </div>
            </Grid>
            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
              判读：全库 {mobility.share}% 的画像呈现 ≥2 个省级地名的跨省足迹——这是干部异地交流与任职回避制度在公开履历文本里留下的可检索痕迹；
              {mobility.share >= 50 ? '跨省历练型占多数，与「主官异地化、条线属地化」的配备逻辑一致。' : '本地深耕型占多数，多见于专业条线与属地化岗位，主官梯队的跨省比例通常显著高于全库均值。'}
            </p>
          </Card>

          <FrameworkTrio cards={[
            {
              title: '知事识人 · 数据化', subtitle: '履历即结构化档案', accent: 'var(--china-red)', border: 'var(--china-red)',
              body: '组织系统的第一性工作是把「人」变成可比较的信息：履历、考核、谈话、巡视移交共同构成干部数据底座。本引擎用关键词画像复刻其中可公开计算的一小层——六维能力与经历标签，是「知事识人」逻辑的最简数字化表达。',
            },
            {
              title: '人岗相适 · 向量匹配', subtitle: '需求向量 × 能力向量', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
              body: '把岗位/情景需求写成六维向量、把人写成六维画像，匹配就退化为一次加权距离计算。沙盒危机的冲击系数在这里直接变成用人需求——这正是「事业为上、依事择人」的算法化隐喻：场景定义需求，需求检索画像。',
            },
            {
              title: '画像边界 · 方法论自觉', subtitle: '关键词推断的局限', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
              body: '关键词画像只能看见履历文本写出来的东西：看不见能力的真实水位、看不见关系网络、也看不见考核与巡视掌握的非公开信息。维度分、标签与匹配分都是文本痕迹的函数，任何超出「演示机制」的解读都是误用。',
            },
          ]} />

        </>
      )}
    </>
  );
}
