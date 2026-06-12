import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { DOMAINS, TIER_LABEL } from './domains.js';

// ============================================================================
// 科技树作战盘 · 12 大战略科技领域
// ----------------------------------------------------------------------------
// 领域数据层在 ./domains.js（博弈桌攻关线由其派生）；本页只做渲染与判读。
// 数值为示意值（公开信息综合），用于定位「换道超车」的领先 / 追赶 / 受制分层。
// 配色：#c41e3a(中国红/受制) #22d3ee(青/追赶) #e8a317(金/攻坚) #10b981(绿/领先)
// ============================================================================

// tier: lead 领先梯队 / chase 并跑追赶 / locked 受制卡脖子
const TIER_COLOR = { lead: '#10b981', chase: '#22d3ee', locked: '#c41e3a' };

// 雷达维度：自主可控 / 工程化 / 人才储备 / 产业生态 / 投资强度
const RADAR_IND = [
  { name: '自主可控', max: 100 },
  { name: '工程化', max: 100 },
  { name: '人才储备', max: 100 },
  { name: '产业生态', max: 100 },
  { name: '投资强度', max: 100 },
];

// ---- 图① 全领域 TRL × 自主度 散点矩阵（一眼看卡脖子）----
const scatterOption = {
  grid: { left: 56, right: 28, top: 28, bottom: 44 },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
    formatter: (p) => `${p.data.name}<br/>TRL ${p.data.value[0]} · 自主度 ${p.data.value[1]}%<br/>分层：${TIER_LABEL[p.data.tier]}`,
  },
  xAxis: {
    type: 'value', name: 'TRL 成熟度', min: 2, max: 9, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  yAxis: {
    type: 'value', name: '自主度 %', min: 30, max: 100, nameTextStyle: { color: '#5b6a82' },
    axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
  },
  series: [{
    type: 'scatter',
    symbolSize: (v) => 14 + v[2] * 0.22,
    data: DOMAINS.map((d) => ({
      name: d.name, value: [d.trl, d.auto, d.weight], tier: d.tier,
      itemStyle: { color: TIER_COLOR[d.tier], opacity: 0.85, borderColor: 'rgba(255,255,255,0.25)', borderWidth: 1 },
    })),
    label: {
      show: true, position: 'top', formatter: (p) => p.data.name, fontSize: 10, color: '#93a1b5',
    },
    markArea: {
      silent: true,
      itemStyle: { color: 'rgba(196,30,58,0.06)' },
      data: [[{ xAxis: 2, yAxis: 30 }, { xAxis: 6, yAxis: 60 }]],
    },
  }],
};

// ---- 图③ 全领域战略权重条形 ----
const sortedByWeight = [...DOMAINS].sort((a, b) => a.weight - b.weight);
const weightOption = {
  grid: { left: 110, right: 40, top: 12, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' } },
  xAxis: { type: 'value', max: 100, name: '战略权重', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
  yAxis: { type: 'category', data: sortedByWeight.map((d) => d.name), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 13,
    data: sortedByWeight.map((d) => ({ value: d.weight, itemStyle: { color: TIER_COLOR[d.tier], borderRadius: [0, 3, 3, 0] } })),
    label: { show: true, position: 'right', formatter: '{c}', color: '#93a1b5', fontSize: 10 },
  }],
};

// ---- Stat 派生 ----
const cnt = (t) => DOMAINS.filter((d) => d.tier === t).length;
const avgAuto = Math.round(DOMAINS.reduce((s, d) => s + d.auto, 0) / DOMAINS.length);
const avgTrl = (DOMAINS.reduce((s, d) => s + d.trl, 0) / DOMAINS.length).toFixed(1);

// ---- 博弈桌攻关回执：只读博弈桌对局存档（写入方在 /wargame）----
const WARGAME_RUNS_KEY = 'cos-wargame-runs';

/** 读档：解析失败 / 结构异常一律降级为空数组（与博弈桌读档同约定，最多取 6 行） */
function readWargameRuns() {
  try {
    const arr = JSON.parse(localStorage.getItem(WARGAME_RUNS_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.filter((r) => r && typeof r === 'object' && r.judge && r.final).slice(0, 6);
  } catch {
    return [];
  }
}

/** 攻关线 id → 领域名：新档 id 即 DOMAINS.k；旧档（litho/soft/aero 等）原样显示 id */
function trackLabelOf(id) {
  if (!id) return '—';
  const d = DOMAINS.find((x) => x.k === id);
  return d ? d.name : String(id);
}

export default function Page() {
  const [sel, setSel] = useState('ai');
  const d = DOMAINS.find((x) => x.k === sel);

  // 博弈桌存档：双监听（storage 跨标签页 + cos-ledger-change 本页内）
  const [wgRuns, setWgRuns] = useState(readWargameRuns);
  useEffect(() => {
    const sync = () => setWgRuns(readWargameRuns());
    window.addEventListener('storage', sync);
    window.addEventListener('cos-ledger-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cos-ledger-change', sync);
    };
  }, []);

  // ---- 图② 选中领域 中美能力对比雷达 ----
  const radarOption = {
    legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
    radar: {
      indicator: RADAR_IND, axisName: { color: '#93a1b5', fontSize: 11 }, radius: '62%',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(148,163,184,0.03)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: [{
      type: 'radar',
      data: [
        { value: d.radar, name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' }, itemStyle: { color: '#c41e3a' } },
        // 美国基线以「能力位势」近似映射到五维（示意）
        { value: RADAR_IND.map(() => d.us), name: '美国', lineStyle: { color: '#22d3ee', type: 'dashed' }, areaStyle: { color: 'rgba(34,211,238,0.08)' }, itemStyle: { color: '#22d3ee' } },
      ],
    }],
  };

  return (
    <div>
      <PageHeader
        badge="Tech Tree · 科技作战盘"
        title="科技树作战盘"
        subtitle="12 大战略科技领域 · TRL × 自主度定位卡脖子 · 中美位势分层 —— 锚定换道超车的节点"
      />

      <IntroCard>
        以 <strong style={{ color: 'var(--text-primary)' }}>技术成熟度(TRL)、自主可控度、战略权重、中美相对位势</strong>四把尺子横扫战略科技版图：
        <span style={{ color: '#10b981' }}> 绿=领先梯队</span>（新能源/6G）、
        <span style={{ color: '#22d3ee' }}> 青=并跑追赶</span>（AI/航天/机器人）、
        <span style={{ color: '#c41e3a' }}> 红=受制卡脖子</span>（半导体/脑机）。
        换道超车的逻辑——在受制领域守住可辩护防御带，在并跑领域以工程化与生态反超。
      </IntroCard>

      <Grid cols={5} className="mb-6">
        <Stat value="12" label="战略科技领域" accent="#e8a317" />
        <Stat value={cnt('lead')} label="领先梯队(领域)" accent="#10b981" />
        <Stat value={cnt('chase')} label="并跑追赶(领域)" accent="#22d3ee" />
        <Stat value={cnt('locked')} label="受制卡脖子(领域)" accent="#c41e3a" />
        <Stat value={`${avgAuto}%`} label={`自主度均值 · 均 TRL ${avgTrl}`} />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="① 全领域 TRL × 自主度矩阵（左下红区=卡脖子 · 气泡=战略权重）">
          <EChart option={scatterOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>气泡越大战略权重越高；落入左下红色阴影区者为低成熟+低自主的攻坚优先级。</p>
        </Card>
        <Card title="③ 全领域战略权重排序（颜色=分层）">
          <EChart option={weightOption} style={{ height: 320 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>半导体、新能源、AI 居权重顶端；红色高权重领域=最需国家级资源倾斜。</p>
        </Card>
      </Grid>

      <Card title="点选领域 · 切换右侧作战详情" className="mb-3">
        <SelectorBar items={DOMAINS} activeKey={sel} onSelect={setSel} getKey={(x) => x.k} getLabel={(x) => x.name} getAccent={(x) => TIER_COLOR[x.tier]} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`② ${d.name} · 中美能力对比雷达（示意）`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)', color: TIER_COLOR[d.tier], border: `1px solid ${TIER_COLOR[d.tier]}` }}>
              {TIER_LABEL[d.tier]}
            </span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>TRL {d.trl} · 自主度 {d.auto}% · 战略权重 {d.weight}</span>
          </div>
          <EChart option={radarOption} style={{ height: 280 }} />
        </Card>

        <Card title={`${d.name} · 战略判读`}>
          <div className="space-y-3">
            <div style={{ borderLeft: `2px solid ${TIER_COLOR[d.tier]}`, paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>主导路线 / 代表项目</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.route}</p>
            </div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>卡脖子环节</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.neck}</p>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: '#c41e3a' }}>{d.cn}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>中国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: '#22d3ee' }}>{d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>美国位势</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-lg font-bold mono" style={{ color: d.cn - d.us >= 0 ? '#10b981' : '#e8a317' }}>{d.cn - d.us >= 0 ? `+${d.cn - d.us}` : d.cn - d.us}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>相对差(中-美)</div>
              </div>
            </div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 12 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>战略判读</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.verdict}</p>
            </div>
          </div>
        </Card>
      </Grid>

      <Card title="♟ 博弈桌攻关回执 · 攻关线在推演桌上的战绩" className="mb-6">
        {wgRuns.length === 0 ? (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            博弈桌尚未开局——攻关线的真实压力测试在那张桌上。
            <Link to="/wargame" className="ml-2 font-semibold" style={{ color: '#22d3ee' }}>→ 上博弈桌推演</Link>
          </p>
        ) : (
          <>
            <div className="space-y-1.5 mb-2">
              {wgRuns.map((r) => (
                <div key={r.id} className="flex items-center gap-3 flex-wrap text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>#{r.id}</span>
                  <span className="shrink-0 font-semibold" style={{ color: 'var(--text-primary)' }}>攻关线 · {trackLabelOf(r.track)}</span>
                  <span className="shrink-0" style={{ color: 'var(--text-secondary)' }}>对手 {r.strategyLabel || r.strategy || '—'}</span>
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `${r.judge.color}1f`, color: r.judge.color, border: `1px solid ${r.judge.color}55` }}
                  >{r.judge.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              回执来自 <Link to="/wargame" style={{ color: '#22d3ee' }}>大国博弈推演桌</Link> 的对局存档（最多回显 6 局）——攻关线即本盘领域，作战盘改数据，博弈桌同步换线。
            </p>
          </>
        )}
      </Card>

      <FrameworkTrio cards={[
        { title: '领先梯队', subtitle: '守扩护城河', accent: '#10b981', border: '#10b981', body: '新能源、6G 已形成全链优势——以标准、成本与生态把领先转化为长期规则话语权。', pillars: [['新能源', '全产业链统治。'], ['6G', '标准卡位先发。'], ['生态', '专利与规模护城河。']] },
        { title: '并跑追赶', subtitle: '工程化反超', accent: '#22d3ee', border: '#22d3ee', body: 'AI、航天、机器人、量子在并跑区——以场景规模与系统优化弥补单点硬件代差，争取反超窗口。', pillars: [['AI', '系统优化补偿算力。'], ['航天', '星座与可复用。'], ['机器人', '具身智能落地。']] },
        { title: '受制卡脖子', subtitle: '守防御带', accent: '#c41e3a', border: '#c41e3a', body: '半导体、脑机接口受制于上游——守住成熟制程/封装等可辩护防御带，沿换道窗口长期攻坚。', pillars: [['半导体', 'EUV/EDA 瓶颈。'], ['脑机', '器件与临床双约束。'], ['换道', 'Chiplet/特色工艺。']] },
      ]} />

      <ModuleFooter moduleId="techtree" disclaimer="TRL / 自主度 / 战略权重 / 中美位势均为示意值（公开信息综合），仅用于相对定位与分层判读，不代表精确测度" />
    </div>
  );
}
