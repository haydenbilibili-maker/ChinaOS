import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import { LEAD_AS_OF, ERA_TIMELINE, TERM_SYSTEM, GOV_MODEL, BRAIN_TRUST, AGENDA, TRADEOFFS } from './leadershipData.js';

// ─────────────────────────────────────────────────────────────────────────────
// 领袖统治 · 治理逻辑解构（公开口径）
// 铁律：只用广为公开、可多源核验的事实；学理解构、两面呈现；零预测、零倡导、
// 零作战内容、零私人信息；台海/军事课题仅引公开政策表述。
// 确定性：零随机、零当前时间，基准日由数据层 LEAD_AS_OF 常量供给。
// ─────────────────────────────────────────────────────────────────────────────

const RED = '#c41e3a';
const CYAN = '#22d3ee';
const GOLD = '#e8a317';
const GREEN = '#10b981';
const PURPLE = '#8b5cf6';
const SLATE = '#64748b';

// 全页区块统一口径声明（敏感口径第 5 条：页面与所有区块声明）
const SCOPE_NOTE = '公开信息梳理 · 学理分析框架 · 非评价 · 非预测 · 非倡导';

/** 区块口径角标：每个区块底部统一挂载 */
function ScopeTag({ extra }) {
  return (
    <p className="text-[11px] mono mt-4 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
      {SCOPE_NOTE}{extra ? ` · ${extra}` : ''}
    </p>
  );
}

/** 小标签 pill */
function pillStyle(c) {
  return {
    display: 'inline-block',
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '2px 8px',
    borderRadius: 20,
    border: `1px solid ${c}55`,
    background: `${c}14`,
    color: c,
    whiteSpace: 'nowrap',
  };
}

/** TERM_SYSTEM 条目兼容渲染：字符串或 {title/t, desc/d} 对象均可 */
function termItemParts(item) {
  if (typeof item === 'string') return { head: null, body: item };
  return {
    head: item.title || item.t || item.label || null,
    body: item.desc || item.d || item.body || item.text || '',
  };
}

/** ② 任期制四联小卡 */
function TermCard({ title, tag, accent, items }) {
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', borderTop: `3px solid ${accent}`, background: 'var(--bg-surface)' }}>
      <div className="flex flex-col gap-1 mb-3">
        <span className="text-sm font-semibold" style={{ color: accent }}>{title}</span>
        <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{tag}</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {(items || []).map((it, i) => {
          const { head, body } = termItemParts(it);
          return (
            <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="mono mr-1.5" style={{ color: accent }}>▸</span>
              {head && <span className="font-semibold mr-1" style={{ color: 'var(--text-primary)' }}>{head}</span>}
              {body}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** ③ 治理操作系统组件卡（贴项目 OS 隐喻视觉） */
function GovModelCard({ m }) {
  return (
    <div className="os-card os-card-lift" style={{ padding: 'var(--card-padding)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.label}</span>
        <span style={pillStyle(CYAN)}>{m.os}</span>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
      <p className="text-[11px] leading-relaxed mono" style={{ color: 'var(--text-tertiary)' }}>
        公开依据：{m.evidence}
      </p>
    </div>
  );
}

// 政治局常委公开排序（二十届一中全会公报公开顺序，仅用于展示排序）
const PSC_ORDER = ['习近平', '李强', '赵乐际', '王沪宁', '蔡奇', '丁薛祥', '李希'];

/** ④ 下半区：政治局常委 · 公开分工（人才库同源，加载中/空库均空安全） */
function PscGrid({ figures }) {
  const psc = useMemo(() => {
    if (!figures) return null; // 加载中
    const hit = figures.filter(
      (f) => f.level === '党和国家领导人' && (f.fields?.rank || '').includes('常委')
    );
    return [...hit].sort((a, b) => {
      const ia = PSC_ORDER.indexOf(a.name);
      const ib = PSC_ORDER.indexOf(b.name);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [figures]);

  if (psc === null) {
    return (
      <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>// 简历库加载中…</p>
    );
  }
  if (psc.length === 0) {
    return (
      <div className="rounded-md p-4 text-xs" style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)', color: 'var(--text-tertiary)' }}>
        简历库暂无「党和国家领导人」记录 —— 请先到
        <Link to="/foundation" className="os-link mono mx-1">数据底座</Link>
        载入政要种子库（figureProvincial2026），本区将自动同步显示。
      </div>
    );
  }
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
      {psc.map((f) => (
        <div key={f.name} className="rounded-md p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
            <span style={pillStyle(RED)}>常委</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {f.fields?.title || f.role || '——'}
          </p>
        </div>
      ))}
    </div>
  );
}

/** ① 时间轴选中节点详情行：节点序号 + 前后导航（确定性，仅依赖 props） */
function EraDetail({ stages, idx, onSelect }) {
  const st = stages[idx];
  if (!st) return null;
  const accent = st.accent || RED;
  const navBtn = (disabled) => ({
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '3px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-base)',
    color: disabled ? 'var(--text-tertiary)' : 'var(--cyber-cyan)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  });
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', background: 'var(--bg-elevated)', borderLeft: `3px solid ${accent}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="mono text-sm font-semibold" style={{ color: accent }}>{st.period}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{st.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            节点 {idx + 1} / {stages.length}
          </span>
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => onSelect(Math.max(0, idx - 1))}
            style={navBtn(idx === 0)}
          >← 前一节点</button>
          <button
            type="button"
            disabled={idx === stages.length - 1}
            onClick={() => onSelect(Math.min(stages.length - 1, idx + 1))}
            style={navBtn(idx === stages.length - 1)}
          >后一节点 →</button>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{st.desc}</p>
    </div>
  );
}

/** ⑤ 课题是否属台海/军事敏感口径（命中则追加专项声明） */
function isMilOrStrait(a) {
  return /tai|strait|mil|defense|army/i.test(a.id || '') || /台|军|国防/.test(a.label || '');
}

/** ⑤ 治理课题作战盘 · 选中课题大卡 */
function AgendaDetail({ a }) {
  const color = a.color || RED;
  const rows = [
    { key: 'goal', tag: '公开目标口径', accent: GREEN, text: a.goal },
    { key: 'progress', tag: '进展观察', accent: CYAN, text: a.progress },
    { key: 'tension', tag: '张力点 · 学理框架', accent: GOLD, text: a.tension },
  ];
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', background: 'var(--bg-elevated)', borderLeft: `3px solid ${color}` }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-base font-semibold" style={{ color }}>{a.label}</span>
        <span style={pillStyle(color)}>{a.id}</span>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.key}>
            <span style={pillStyle(r.accent)}>{r.tag}</span>
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
          </div>
        ))}
      </div>
      {(a.links || []).length > 0 && (
        <div className="mt-5">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>横向直跳 · 在专题模块看全盘</div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {a.links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="os-card-interactive block rounded-md p-3 transition-colors"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-xs font-semibold" style={{ color: 'var(--cyber-cyan)' }}>
                  {l.label} <span className="mono" style={{ color: 'var(--text-tertiary)' }}>↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <p className="text-[11px] mono mt-4 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
        {isMilOrStrait(a)
          ? '仅公开政策表述 · 零作战内容 · 非预测非倡导'
          : '公开目标与公开进展梳理 · 张力分析为学理框架 · 非预测非倡导'}
      </p>
    </div>
  );
}

/** ⑤ 作战盘总览：六课题一屏速读（点击切换详情） */
function AgendaOverview({ items, activeId, onSelect }) {
  return (
    <div className="grid gap-3 mt-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
      {items.map((a) => {
        const on = a.id === activeId;
        const color = a.color || RED;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className="text-left rounded-md p-3 transition-colors"
            style={{
              background: on ? `${color}14` : 'var(--bg-surface)',
              border: `1px solid ${on ? `${color}66` : 'var(--border-subtle)'}`,
              cursor: 'pointer',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: color }} />
              <span className="text-xs font-semibold" style={{ color: on ? color : 'var(--text-primary)' }}>{a.label}</span>
              {isMilOrStrait(a) && <span style={pillStyle(SLATE)}>公开口径</span>}
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {a.goal}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  // ① 时间轴选中节点
  const [eraIdx, setEraIdx] = useState(ERA_TIMELINE.length ? ERA_TIMELINE.length - 1 : 0);
  // ⑤ 作战盘选中课题
  const [agendaId, setAgendaId] = useState(AGENDA[0]?.id || '');
  const figures = useFigures(); // 加载中为 null，下游全部空安全
  const activeAgenda = AGENDA.find((a) => a.id === agendaId) || AGENDA[0];

  // TimelineBar 契约映射：{year → period}
  const eraStages = useMemo(
    () => ERA_TIMELINE.map((e) => ({ period: e.year, title: e.title, desc: e.desc, accent: e.accent })),
    []
  );

  return (
    <div>
      {/* ───────── 0 · 页头 + 定位声明 + 总览 ───────── */}
      <PageHeader
        badge="Institutions · 领袖统治（公开口径）"
        title="领袖统治 · 治理逻辑解构"
        subtitle="执政时间轴 · 任期制变更 · 治理模式 · 议程作战盘"
      />

      <IntroCard>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>定位声明：</span>
        本页是对最高领导层治理模式的<span style={{ color: CYAN }}>公开信息梳理与学理分析框架</span>——
        事实层只取党代会与中央全会公报、宪法修正案公开条文、政府公开发布与公开职务任免等广为公开、可多源核验的材料；
        分析层呈现该治理模式的内在逻辑与公开理据，同时并列呈现学界公开讨论的制度张力
        （决策效率与信息过滤、政策连续性与接班机制、动员能力与基层负载），两面都讲。
        本页<span style={{ color: GOLD }}>非评价、非预测、非倡导</span>，不含任何私人信息与猜测性内容。
      </IntroCard>

      <Grid cols={4} className="os-section mb-8">
        <Stat value={LEAD_AS_OF} label="基准日（数据层常量）" accent={CYAN} />
        <Stat value={ERA_TIMELINE.length} label="执政时间轴 · 公开节点" accent={RED} />
        <Stat value={AGENDA.length} label="治理课题 · 作战盘" accent={GOLD} />
        <Stat value={BRAIN_TRUST.length} label="智囊机构 · 公开建制" accent={GREEN} />
      </Grid>

      {/* ───────── ① 执政时间轴 ───────── */}
      <Card title="① 执政时间轴 · 公开节点（党代会 / 全会 / 公开任免）">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          只收录党代会与中央全会日期及决议名、宪法修正案、公开职务任免等公开事件节点。点选节点查看详情。
        </p>
        <TimelineBar
          stages={eraStages}
          activeIdx={eraIdx}
          onSelect={setEraIdx}
          renderDetail={(_, idx) => <EraDetail stages={eraStages} idx={idx} onSelect={setEraIdx} />}
        />
        <ScopeTag extra="节点事实均可于公报/公开发布多源核验" />
      </Card>

      {/* ───────── ② 任期制变更专题 ───────── */}
      <Card title="② 任期制变更 · 1982→2018 制度沿革专题">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          以公开条文与公开程序事实为底，第四卡为学界公开讨论的制度分析框架——中性梳理、不点名、不预测。
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          <TermCard
            title="1982 · 任期制起源"
            tag="八二宪法 · 公开条文"
            accent={CYAN}
            items={TERM_SYSTEM.origin}
          />
          <TermCard
            title="2018 · 宪法修正案"
            tag="十三届全国人大一次会议 · 公开程序"
            accent={RED}
            items={TERM_SYSTEM.change2018}
          />
          <TermCard
            title="制度事实 · 现行框架"
            tag="公开制度安排 · 描述性梳理"
            accent={GREEN}
            items={TERM_SYSTEM.institutional}
          />
          <TermCard
            title="制度张力 · 讨论框架"
            tag="学界公开讨论框架 · 中性梳理"
            accent={GOLD}
            items={TERM_SYSTEM.debate}
          />
        </div>
        <ScopeTag extra="条文要点以公开文本为准 · 第四卡仅为学界公开讨论的制度分析框架" />
      </Card>

      {/* ───────── ③ 治理操作系统 ───────── */}
      <Card title="③ 治理操作系统 · 六组件解构（OS 隐喻）">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          把公开可见的治理机制映射为操作系统组件：每张卡 = 机制 + 运行逻辑 + 公开依据。隐喻只为认知压缩，不附加评价。
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {GOV_MODEL.map((m) => (
            <GovModelCard key={m.id} m={m} />
          ))}
        </div>
        <ScopeTag extra="每卡公开依据可独立核验" />
      </Card>

      {/* ───────── ④ 智囊与班子图谱 ───────── */}
      <Card title="④ 智囊与班子图谱 · 公开建制">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          上半为中央直属政策机构的公开建制与现任公开职务；下半为政治局常委公开分工，与人才库（简历库）同源同口径。
          不渲染任何非公开影响力关系。
        </p>

        {/* 上半：智囊机构表 */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-tertiary)' }}>
                {['机构', '职能定位', '现任主任（公开任职）', '备注'].map((h) => (
                  <th key={h} className="text-left mono font-normal py-2 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BRAIN_TRUST.map((b) => (
                <tr key={b.org} className="align-top">
                  <td className="py-2.5 pr-4 border-b font-semibold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{b.org}</td>
                  <td className="py-2.5 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{b.role}</td>
                  <td className="py-2.5 pr-4 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: b.head === '——' ? 'var(--text-tertiary)' : CYAN, whiteSpace: 'nowrap' }}>{b.head}</td>
                  <td className="py-2.5 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 下半：政治局常委 · 公开分工（人才库同源） */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>政治局常委 · 公开分工</span>
          <span style={pillStyle(SLATE)}>简历库实时同源</span>
        </div>
        <PscGrid figures={figures} />
        <ScopeTag extra="仅公开机构与公开职务 · 与人才库同口径" />
      </Card>

      {/* ───────── ⑤ 治理课题作战盘（核心区） ───────── */}
      <Card title="⑤ 治理课题作战盘 · 公开目标 × 进展观察 × 张力框架">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          六大治理课题：每题三段——公开目标口径（官方公开发布）、进展观察（公开事实）、张力点（学理分析框架）。
          台海与军事课题仅引公开政策表述，零作战内容。
        </p>
        <SelectorBar
          items={AGENDA}
          activeKey={agendaId}
          onSelect={setAgendaId}
          getKey={(i) => i.id}
          getLabel={(i) => i.label}
          getAccent={(i) => i.color}
        />
        {activeAgenda && <AgendaDetail a={activeAgenda} />}
        <AgendaOverview items={AGENDA} activeId={agendaId} onSelect={setAgendaId} />
        <ScopeTag />
      </Card>

      {/* ───────── ⑥ 张力分析 ───────── */}
      <div className="os-section mb-2">
        <h3 className="os-card-title mb-1">⑥ 张力分析 · 学界公开讨论的三组权衡</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          每组权衡两端都呈现公开理据——这是制度分析的标准做法，不构成对任何一端的背书或否定。
        </p>
      </div>
      <FrameworkTrio cards={TRADEOFFS} />
      <p className="text-[11px] mono -mt-4 mb-8" style={{ color: 'var(--text-tertiary)' }}>{SCOPE_NOTE}</p>

      {/* ───────── 页脚 ───────── */}
      <ModuleFooter
        moduleId="leadership"
        links={[
          { to: '/anticorruption', label: '反腐风暴 · 纪检监察', note: '自我监督机制的公开案例库与制度分析' },
          { to: '/diplomacy', label: '外交棋盘 · 元首外交', note: '元首外交作为最高校准器的全球盘面' },
          { to: '/chronicle', label: '编年史 · 公开大事记', note: '本页时间轴节点的全量编年语境' },
        ]}
        disclaimer="公开信息梳理 · 学理分析框架 · 非评价 · 非预测 · 非倡导"
        sourceNote="事实口径：党代会公报/宪法修正案/政府公开发布；班子信息与人才库同源"
      />
    </div>
  );
}
