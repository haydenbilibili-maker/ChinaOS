import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Stat } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import { GROUPS, MODULES, modulesByGroup, moduleById } from '../../app/registry.js';
import { DIM_PROFILE, DIM_LINKS, dimRadarOf } from './depthDeep.js';

function Icon({ name, size = 17 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

// 深度透视 = 项目内容主体：八大内容维度（认知内核/透镜/沙盒/底座不计入）。
const CONTENT_GROUPS = ['institutions', 'depthtopics', 'techtopics', 'society', 'industry', 'finance', 'region', 'security'];
const GROUP_MAP = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

// 含真实中国地图（drill-down）的专题，给个角标。
const HAS_MAP = new Set(['foodSecurity', 'urban', 'debtHeatmap', 'regional']);

const MOMENTUM_STYLE = {
  上行: { color: '#10b981', bg: 'rgba(16,185,129,0.14)', icon: 'TrendingUp' },
  承压: { color: '#c41e3a', bg: 'rgba(196,30,58,0.14)', icon: 'TrendingDown' },
  胶着: { color: '#e8a317', bg: 'rgba(232,163,23,0.14)', icon: 'MoveHorizontal' },
};

const DIM_BY_KEY = Object.fromEntries(DIM_PROFILE.map((d) => [d.key, d]));

function SectionTitle({ icon, title, note }) {
  return (
    <div className="flex items-baseline gap-2.5 mb-3 mt-8">
      <span style={{ color: 'var(--fire-gold)' }}><Icon name={icon} size={16} /></span>
      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {note && <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{note}</span>}
    </div>
  );
}

// ── 作战室三联装之一：态势卡 ────────────────────────────────────────────────
function PostureCard({ dim }) {
  const mom = MOMENTUM_STYLE[dim.momentum];
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: dim.color }}>{dim.label} · 态势</span>
        <span className="mono text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: mom.bg, color: mom.color }}>
          <Icon name={mom.icon} size={12} />{dim.momentum}
        </span>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <span className="mono font-bold" style={{ fontSize: 40, lineHeight: 1, color: dim.color }}>{dim.tension}</span>
        <div className="pb-1">
          <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>张力评分 / 100（示意标定）</div>
          <div style={{ width: 120, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', marginTop: 4 }}>
            <div style={{ width: `${dim.tension}%`, height: '100%', borderRadius: 3, background: dim.color }} />
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{dim.posture}</p>
      <div className="text-[11px] mono mb-1.5" style={{ color: 'var(--text-tertiary)' }}>核心问题</div>
      <ul className="mb-3" style={{ display: 'grid', gap: 6 }}>
        {dim.keyQuestions.map((q, i) => (
          <li key={q} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="mono text-[10px] px-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: dim.color, flexShrink: 0 }}>Q{i + 1}</span>
            {q}
          </li>
        ))}
      </ul>
      <div className="text-[11px] mono mb-1.5" style={{ color: 'var(--text-tertiary)' }}>观察指标</div>
      <div className="flex flex-wrap gap-1.5">
        {dim.watch.map((w) => (
          <span key={w} className="mono text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            <Lucide.Eye size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />{w}
          </span>
        ))}
      </div>
    </Card>
  );
}

// ── 作战室三联装之二：五维雷达 ──────────────────────────────────────────────
function DimRadar({ dim }) {
  const option = useMemo(() => {
    const r = dimRadarOf(dim.key);
    return {
      tooltip: {},
      radar: {
        indicator: r.indicator,
        radius: '62%',
        center: ['50%', '52%'],
        splitNumber: 4,
        axisName: { color: LABEL.color, fontSize: 11 },
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
        splitArea: { show: false },
      },
      series: [{
        type: 'radar',
        symbolSize: 4,
        data: [{
          value: r.value,
          name: dim.label,
          lineStyle: { color: '#e8a317', width: 2 },
          itemStyle: { color: '#e8a317' },
          areaStyle: { color: 'rgba(232,163,23,0.18)' },
        }],
      }],
    };
  }, [dim.key, dim.label]);
  return (
    <Card className="h-full">
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>五维体检雷达</div>
      <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>指标随维度切换 · 0–100 相对标定</div>
      <EChart option={option} style={{ height: 248 }} />
    </Card>
  );
}

// ── 作战室三联装之三：阅读路径 ──────────────────────────────────────────────
function ReadingPath({ dim }) {
  const mods = dim.readingPath.map((id) => moduleById(id)).filter(Boolean);
  return (
    <Card className="h-full">
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>推荐阅读路径</div>
      <div className="text-[10px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>三步进入该维度纵深 · 点击直达</div>
      <div style={{ display: 'grid', gap: 10 }}>
        {mods.map((m, i) => (
          <Link key={m.id} to={m.path} className="os-card block p-3 transition-colors"
            style={{ borderLeft: `3px solid ${dim.color}`, position: 'relative', background: 'var(--bg-elevated)' }}>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${dim.color}22`, color: dim.color }}>STEP {i + 1}</span>
              <span style={{ color: dim.color }}><Icon name={m.icon} size={15} /></span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
            </div>
            <p className="text-xs leading-snug" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</p>
            <Lucide.ArrowUpRight size={13} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--text-tertiary)' }} />
          </Link>
        ))}
      </div>
    </Card>
  );
}

// ── 维度联动网：circular graph + 选中维出边高亮 ─────────────────────────────
function LinkageGraph({ dimKey }) {
  const option = useMemo(() => {
    const nodes = DIM_PROFILE.map((d) => ({
      name: d.label,
      symbolSize: d.key === dimKey ? 34 : 24,
      itemStyle: {
        color: d.color,
        borderColor: d.key === dimKey ? '#e8a317' : 'transparent',
        borderWidth: d.key === dimKey ? 2 : 0,
      },
      label: { show: true, color: d.key === dimKey ? '#e8a317' : '#93a1b5', fontSize: 11 },
    }));
    const links = DIM_LINKS.map((l) => {
      const hot = l.from === dimKey;
      return {
        source: DIM_BY_KEY[l.from].label,
        target: DIM_BY_KEY[l.to].label,
        note: l.note,
        lineStyle: {
          color: hot ? '#e8a317' : 'rgba(148,163,184,0.25)',
          width: hot ? 2.6 : 1,
          curveness: 0.22,
        },
        label: { show: hot, formatter: l.note, color: '#e8a317', fontSize: 10 },
      };
    });
    return {
      tooltip: {
        formatter: (p) => (p.dataType === 'edge'
          ? `${p.data.source} → ${p.data.target}<br/>${p.data.note}`
          : p.name),
      },
      series: [{
        type: 'graph',
        layout: 'circular',
        circular: { rotateLabel: false },
        data: nodes,
        links,
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 7,
        emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
        lineStyle: { curveness: 0.22 },
      }],
    };
  }, [dimKey]);
  return <EChart option={option} style={{ height: 330 }} />;
}

function LinkageList({ dimKey }) {
  const related = DIM_LINKS.filter((l) => l.from === dimKey || l.to === dimKey);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {related.length === 0 && (
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>该维度暂无登记联动边。</p>
      )}
      {related.map((l) => {
        const out = l.from === dimKey;
        const peer = DIM_BY_KEY[out ? l.to : l.from];
        return (
          <div key={`${l.from}-${l.to}`} className="os-card p-3" style={{ borderLeft: `3px solid ${out ? '#e8a317' : peer.color}`, background: 'var(--bg-elevated)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="mono text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: out ? 'rgba(232,163,23,0.16)' : 'var(--bg-surface)', color: out ? '#e8a317' : 'var(--text-tertiary)' }}>
                {out ? '出边' : '入边'}
              </span>
              <span className="text-xs mono" style={{ color: 'var(--text-secondary)' }}>
                {DIM_BY_KEY[l.from].label} → {DIM_BY_KEY[l.to].label}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{l.note}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── 八维张力总览：横向 bar，momentum 着色 ───────────────────────────────────
function TensionBar() {
  const option = useMemo(() => {
    const sorted = [...DIM_PROFILE].sort((a, b) => a.tension - b.tension);
    return {
      grid: { left: 96, right: 84, top: 8, bottom: 24 },
      xAxis: {
        type: 'value', max: 100,
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
        axisLabel: { color: LABEL.color },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((d) => d.label),
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
        axisLabel: { color: LABEL.color, fontSize: 11 },
        axisTick: { show: false },
      },
      series: [{
        type: 'bar',
        barWidth: 14,
        data: sorted.map((d) => ({
          value: d.tension,
          itemStyle: { color: MOMENTUM_STYLE[d.momentum].color, borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true, position: 'right', fontSize: 10, fontFamily: 'monospace',
          color: LABEL.color,
          formatter: (p) => `${p.value} · ${sorted[p.dataIndex].momentum}`,
        },
      }],
      tooltip: { formatter: (p) => `${p.name}<br/>张力 ${p.value} · ${sorted[p.dataIndex].momentum}` },
    };
  }, []);
  return <EChart option={option} style={{ height: 300 }} />;
}

export default function Page() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all'); // 导航矩阵的维度筛选
  const [dimKey, setDimKey] = useState('security'); // 作战室选中维（张力最高维开局）
  const dim = DIM_BY_KEY[dimKey];

  const sections = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return CONTENT_GROUPS
      .filter((gid) => filter === 'all' || filter === gid)
      .map((gid) => ({
        group: GROUP_MAP[gid],
        mods: modulesByGroup(gid).filter(
          (m) => !kw || m.title.toLowerCase().includes(kw) || (m.subtitle || '').toLowerCase().includes(kw)
        ),
      }))
      .filter((s) => s.mods.length);
  }, [q, filter]);

  const total = useMemo(() => CONTENT_GROUPS.reduce((n, g) => n + modulesByGroup(g).length, 0), []);
  const hit = sections.reduce((n, s) => n + s.mods.length, 0);

  return (
    <div>
      <PageHeader badge="Depth Lens · 作战中枢" title="深度透视 · 八维作战中枢"
        subtitle="八大内容维度的态势研判 + 全专题索引：张力评分 / 五维雷达 / 联动网 / 阅读路径，再到全部专题的统一检索直达" />

      <IntroCard>
        深度透视从「导航索引」升级为<strong style={{ color: 'var(--text-primary)' }}>作战中枢</strong>：上半部是八维作战室——每个维度给出态势研判、张力评分、五维体检雷达、维度联动网与三步阅读路径；下半部仍是完整的八维专题矩阵，统一检索、维度筛选与直达入口。带 <span className="mono" style={{ color: 'var(--china-red)' }}>MAP</span> 标记的专题含可下钻中国省级地图；新增模块自动同步注册表。张力与雷达数值为分析标定示意。
      </IntroCard>

      {/* 概览统计 */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))' }}>
        <Stat value={total} label="已建专题" accent="var(--cyber-cyan)" />
        <Stat value={CONTENT_GROUPS.length} label="内容维度" accent="var(--fire-gold)" />
        <Stat value={DIM_LINKS.length} label="维度联动边" accent="#8b5cf6" />
        <Stat value={HAS_MAP.size} label="含中国地图" accent="var(--china-red)" />
        <Stat value={MODULES.length} label="模块总数 (全栈)" accent="#10b981" />
      </div>

      {/* ════ 一、维度作战室 ════ */}
      <SectionTitle icon="Crosshair" title="维度作战室" note="选维 → 态势 / 雷达 / 阅读路径三联装" />
      <SelectorBar
        items={DIM_PROFILE}
        activeKey={dimKey}
        onSelect={setDimKey}
        getLabel={(d) => `${d.label} ${d.tension}`}
      />
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <PostureCard dim={dim} />
        <DimRadar dim={dim} />
        <ReadingPath dim={dim} />
      </div>

      {/* ════ 二、维度联动网 ════ */}
      <SectionTitle icon="Share2" title="维度联动网" note={`${DIM_LINKS.length} 条传导边 · 金色为「${dim.label}」出边`} />
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>八维传导环</div>
          <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>circular 布局 · 节点按维色 · 箭头为传导方向</div>
          <LinkageGraph dimKey={dimKey} />
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>「{dim.label}」相关传导</div>
          <div className="text-[10px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>出边 = 该维向外施压 · 入边 = 被外维传导</div>
          <LinkageList dimKey={dimKey} />
        </Card>
      </div>

      {/* ════ 三、八维张力总览 ════ */}
      <SectionTitle icon="Gauge" title="八维张力总览" note="示意标定 · 按张力排序 · 颜色 = 动量（绿上行 / 红承压 / 金胶着）" />
      <Card className="mb-6">
        <TensionBar />
        <div className="flex gap-4 mt-1 flex-wrap">
          {Object.entries(MOMENTUM_STYLE).map(([k, v]) => (
            <span key={k} className="text-[11px] mono flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: v.color }} />{k}
            </span>
          ))}
        </div>
      </Card>

      {/* ════ 四、八维专题矩阵（完整导航保留） ════ */}
      <SectionTitle icon="LayoutGrid" title="八维专题矩阵" note="全部专题统一检索 · 维度筛选 · 直达入口" />

      {/* 检索 + 维度筛选 */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px' }}>
          <Lucide.Search size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="检索专题（标题 / 关键词）…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }} />
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Lucide.X size={15} /></button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter('all')} className="text-xs px-3 py-1 rounded-full mono"
            style={{ background: filter === 'all' ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)', color: filter === 'all' ? 'var(--cyber-cyan)' : 'var(--text-secondary)', border: `1px solid ${filter === 'all' ? 'var(--cyber-cyan)' : 'transparent'}`, cursor: 'pointer' }}>
            全部 {total}
          </button>
          {CONTENT_GROUPS.map((gid) => {
            const g = GROUP_MAP[gid]; const c = modulesByGroup(gid).length; const on = filter === gid;
            return (
              <button key={gid} onClick={() => setFilter(gid)} className="text-xs px-3 py-1 rounded-full mono"
                style={{ background: on ? `${g.accent}26` : 'var(--bg-elevated)', color: on ? g.accent : 'var(--text-secondary)', border: `1px solid ${on ? g.accent : 'transparent'}`, cursor: 'pointer' }}>
                {g.label} {c}
              </button>
            );
          })}
        </div>
      </Card>

      {hit === 0 && (
        <Card><p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>未命中「{q}」相关专题，试试其它关键词。</p></Card>
      )}

      {/* 分组矩阵 */}
      {sections.map(({ group, mods }) => (
        <div key={group.id} className="mb-7">
          <div className="flex items-baseline gap-3 mb-3">
            <span style={{ width: 9, height: 9, borderRadius: 2, background: group.accent }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{group.label}</h3>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{group.desc} · {mods.length}</span>
            {DIM_BY_KEY[group.id] && (
              <button onClick={() => setDimKey(group.id)} className="text-[10px] mono px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-elevated)', color: DIM_BY_KEY[group.id].color, border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                进作战室 ↑
              </button>
            )}
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
            {mods.map((m) => (
              <Link key={m.id} to={m.path} className="os-card p-4 block transition-colors"
                style={{ borderLeft: `3px solid ${group.accent}`, position: 'relative' }}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span style={{ color: group.accent }}><Icon name={m.icon} /></span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
                  {HAS_MAP.has(m.id) && <span className="mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.16)', color: 'var(--china-red)' }}>MAP</span>}
                </div>
                <p className="text-xs leading-snug" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</p>
                <Lucide.ArrowUpRight size={14} style={{ position: 'absolute', top: 14, right: 14, color: 'var(--text-tertiary)' }} />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* ════ 框架三卡 ════ */}
      <FrameworkTrio cards={[
        {
          title: '态势研判', subtitle: '张力 · 动量 · 核心问题',
          body: '每个维度先给一句态势判断，再用张力评分与动量方向标定「紧不紧、往哪走」，三个核心问题就是该维度的作业题。',
          pillars: [
            ['张力评分', '0–100 相对标定，安全/金融最高，区域最低'],
            ['动量三态', '上行 / 承压 / 胶着，对应绿红金三色'],
            ['核心问题', '每维三问，回答不了就去阅读路径补课'],
          ],
        },
        {
          title: '传导网络', subtitle: '出边施压 · 入边受力',
          body: '维度不是孤岛：信贷传导、自主可控倒逼、人口流动重排——十条传导边把八维连成一张受力网，看清楚谁在推谁。',
          pillars: [
            ['出边', '该维度向外施压的传导方向'],
            ['入边', '被其它维度牵引的受力来源'],
            ['环形布局', '确定性 circular，无随机扰动'],
          ],
        },
        {
          title: '阅读路径', subtitle: '三步进纵深',
          body: '每个维度精选三个专题模块作为推荐阅读顺序：先看权力与结构，再看主战场，最后看风险出口，点击卡片直达。',
          pillars: [
            ['STEP 1', '结构入门 · 看清该维度的底层逻辑'],
            ['STEP 2', '主战场 · 当下张力最集中的专题'],
            ['STEP 3', '风险与出口 · 往哪儿演化'],
          ],
        },
      ]} />

      <ModuleFooter moduleId="depth" disclaimer="张力评分 / 雷达 / 联动边为分析框架内的示意标定，非实时量化指标 · 专题导航自动同步注册表；传统视图见 china.html" />
    </div>
  );
}
