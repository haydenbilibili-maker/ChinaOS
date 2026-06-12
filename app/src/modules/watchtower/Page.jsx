import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { AS_OF, LEVELS, DOMAINS, INDICATORS, domainScore } from './data.js';

const LEVEL_ORDER = ['cool', 'hold', 'warm'];

// ===========================================================================
// 账本联动（监测台告警 → 治国沙盒战役 → 判定回流）
// 写 'cos-watch-alerts'：从六域 36 指标中按确定性规则提取 ≤6 条红/橙告警；
// 读 'cos-sandbox-verdicts'：治国沙盒战役判定回执（≤6 条新进先出）。
// domain 序号对齐沙盒 CRISIS_DOMAINS=['科技','经济','社会','外交','能源','金融']；
// 本页 structure（结构风险）域指标全为债务/银行/资本/汇率/外储，归口「金融」。
// ===========================================================================
const WATCH_ALERTS_KEY = 'cos-watch-alerts';
const SANDBOX_VERDICTS_KEY = 'cos-sandbox-verdicts';
const LEDGER_EVENT = 'cos-ledger-change';
const DOMAIN_TO_CRISIS_INDEX = { tech: 0, economy: 1, society: 2, diplomacy: 3, energy: 4, structure: 5 };
const ALERT_LEVEL = { cool: '红', hold: '橙' }; // 红档=红、黄档(管控/僵持)=橙；绿档不出告警

// 告警严峻度（0-100，确定性，无随机无时钟）：
// 红档基础 80 / 橙档基础 55；越线后仍在移动（trend ≠ →）+12；
// 同域健康分越低再加 0~6（(100−domainScore)/12 取整）；并列按 INDICATORS 原序稳定排序。
function alertSeverity(ind, scoreByDomain) {
  const base = ind.level === 'cool' ? 80 : 55;
  const moving = ind.trend !== '→' ? 12 : 0;
  const drag = Math.round((100 - (scoreByDomain[ind.domain] ?? 60)) / 12);
  return Math.min(100, base + moving + drag);
}

// 回执判定三色：<30 绿（可吸收）/ <60 金（承压管理）/ 其余红（系统性应激）
function verdictColor(score) {
  return score < 30 ? '#10b981' : score < 60 ? '#e8a317' : '#c41e3a';
}

const DISCIPLINES = [
  ['行为优先', '话语≈噪声，行为=信号。读数只采可观测行为与硬数据，不采表态与口径修辞。'],
  ['层间对照', '单指标越线先与同域其余指标对照，再与跨域指标对照——孤证不重判。'],
  ['阈值即重判', '任一指标跨档触发该域情景重审，更新假设而非辩护旧判读。'],
  ['红档≠预测', '红档是观察加密令：提高采样频率、收窄置信区间，而非宣告结局。'],
  ['绿档防自满', '常态档的最大风险是停止追问。绿档指标同样维持采样纪律。'],
];

function DomainChip({ domain, small = false }) {
  const Icon = Lucide[domain?.icon] || Lucide.Square;
  return (
    <span
      className={`inline-flex items-center gap-1 mono rounded ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}
      style={{ background: `color-mix(in srgb, ${domain?.accent || '#888'} 14%, transparent)`, color: domain?.accent || 'var(--text-secondary)' }}
    >
      <Icon size={small ? 10 : 12} />
      {domain?.label}
    </span>
  );
}

function LevelPill({ level }) {
  const lv = LEVELS[level];
  if (!lv) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] mono px-1.5 py-0.5 rounded"
      style={{ background: `color-mix(in srgb, ${lv.color} 16%, transparent)`, color: lv.color }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: lv.color }} />
      {lv.label}
    </span>
  );
}

function IndicatorCard({ ind }) {
  const domain = DOMAINS.find((d) => d.id === ind.domain);
  const lv = LEVELS[ind.level];
  return (
    <div
      className="os-card os-card-interactive p-4 flex flex-col gap-2"
      style={{ borderTop: `3px solid ${domain?.accent || 'var(--border-subtle)'}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <DomainChip domain={domain} small />
        <div className="flex items-center gap-1.5">
          <LevelPill level={ind.level} />
          <span className="mono text-sm" style={{ color: lv?.color }}>{ind.trend}</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ind.name}</div>
        {ind.sub && <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{ind.sub}</div>}
      </div>
      <div className="mono text-xl font-semibold" style={{ color: lv?.color }}>{ind.reading}</div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ind.note}</p>
      <div className="flex flex-col gap-1 mt-1 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {LEVEL_ORDER.map((lvKey) => {
          const band = ind.bands?.[lvKey];
          const on = ind.level === lvKey;
          return (
            <div key={lvKey} className="flex items-center gap-1.5" style={{ opacity: on ? 1 : 0.45 }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVELS[lvKey].color }} />
              <span className="text-[10px] mono shrink-0" style={{ color: LEVELS[lvKey].color }}>{LEVELS[lvKey].label}</span>
              <span className="text-[10px] truncate" style={{ color: on ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{band}</span>
            </div>
          );
        })}
      </div>
      <Link to={ind.to} className="os-link mono text-[11px] mt-auto" style={{ color: 'var(--cyber-cyan)' }}>
        来源 {ind.src} →
      </Link>
    </div>
  );
}

export default function Page() {
  const [domainFilter, setDomainFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const coolList = useMemo(() => INDICATORS.filter((i) => i.level === 'cool'), []);
  const holdCount = useMemo(() => INDICATORS.filter((i) => i.level === 'hold').length, []);
  const warmCount = useMemo(() => INDICATORS.filter((i) => i.level === 'warm').length, []);

  const filtered = useMemo(
    () => INDICATORS.filter(
      (i) => (domainFilter === 'all' || i.domain === domainFilter) && (levelFilter === 'all' || i.level === levelFilter),
    ),
    [domainFilter, levelFilter],
  );

  const scores = useMemo(
    () => DOMAINS.map((d) => ({ ...d, score: domainScore(INDICATORS, d.id) })),
    [],
  );

  // 账本写出：六域 36 指标 → 红/橙告警 Top6（确定性提取，映射六域序号）
  const ledgerAlerts = useMemo(() => {
    const scoreByDomain = Object.fromEntries(DOMAINS.map((d) => [d.id, domainScore(INDICATORS, d.id)]));
    return INDICATORS
      .filter((i) => i.level === 'cool' || i.level === 'hold')
      .map((i) => ({
        key: i.id,
        label: i.name,
        domain: DOMAIN_TO_CRISIS_INDEX[i.domain],
        level: ALERT_LEVEL[i.level],
        score: alertSeverity(i, scoreByDomain),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, []);

  // 写 'cos-watch-alerts'：useRef 缓存 JSON 串、内容不同才写（防循环）；stamp 整数递增（首次 1）
  const alertsJsonRef = useRef('');
  useEffect(() => {
    try {
      const json = JSON.stringify(ledgerAlerts);
      if (alertsJsonRef.current === json) return;
      let stamp = 0;
      try {
        const prev = JSON.parse(localStorage.getItem(WATCH_ALERTS_KEY) || 'null');
        if (prev && typeof prev === 'object') {
          if (Number.isInteger(prev.stamp)) stamp = prev.stamp;
          if (JSON.stringify(prev.alerts) === json) { alertsJsonRef.current = json; return; }
        }
      } catch { /* 坏档照常覆写 */ }
      localStorage.setItem(WATCH_ALERTS_KEY, JSON.stringify({ alerts: ledgerAlerts, stamp: stamp + 1 }));
      alertsJsonRef.current = json;
      window.dispatchEvent(new CustomEvent(LEDGER_EVENT));
    } catch { /* 存储不可用即降级为纯展示 */ }
  }, [ledgerAlerts]);

  // 读 'cos-sandbox-verdicts'：mount 读一次 + storage/cos-ledger-change 双监听
  const [sandboxVerdicts, setSandboxVerdicts] = useState([]);
  const verdictsJsonRef = useRef('');
  useEffect(() => {
    const load = () => {
      let list = [];
      try {
        const parsed = JSON.parse(localStorage.getItem(SANDBOX_VERDICTS_KEY) || 'null');
        if (parsed && Array.isArray(parsed.verdicts)) list = parsed.verdicts.slice(0, 6);
      } catch { list = []; }
      const json = JSON.stringify(list);
      if (json !== verdictsJsonRef.current) { verdictsJsonRef.current = json; setSandboxVerdicts(list); }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener(LEDGER_EVENT, load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener(LEDGER_EVENT, load);
    };
  }, []);

  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: DOMAINS.map((d) => ({ name: d.label, max: 100 })),
      radius: '65%',
      splitNumber: 4,
      axisName: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.18)' } },
      splitArea: { areaStyle: { color: ['rgba(148,163,184,0.03)', 'rgba(148,163,184,0.06)'] } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: scores.map((s) => s.score),
        name: '六域健康度',
        lineStyle: { color: '#c41e3a', width: 2 },
        itemStyle: { color: '#c41e3a' },
        areaStyle: { color: 'rgba(196,30,58,0.22)' },
      }],
    }],
    tooltip: { trigger: 'item' },
  }), [scores]);

  return (
    <div>
      <PageHeader
        badge="Watch Tower · 全局监测台"
        title="全局监测台 · 先行指标聚合盘"
        subtitle={`六域 ${INDICATORS.length} 项指标 · 三档阈值 · 越线告警 —— 把全系统的判读纪律收口到一块盘面（基准日 ${AS_OF}）`}
      />

      <IntroCard>
        监测台的哲学只有三条：话语≈噪声、行为=信号，所以指标只盯可观测行为与硬数据；阈值触发重判，
        任何指标跨档即强制重审该域情景假设，而非为旧判读辩护；低概率高冲击事件单列管理，不与常规读数混档。
        本盘读数为各专题模块 2026-06 判读基准的聚合镜像——它不生产新判断，只把分散在全系统的判读纪律收口为一块可巡检的盘面。
      </IntroCard>

      <div className="grid gap-4 mb-6 os-section-stagger" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Stat value={INDICATORS.length} label="监测指标总数" accent="var(--cyber-cyan)" />
        <Stat value={coolList.length} label="红档 · 越线告警" accent={LEVELS.cool.color} />
        <Stat value={holdCount} label="黄档 · 管控僵持" accent={LEVELS.hold.color} />
        <Stat value={warmCount} label="绿档 · 常态向好" accent={LEVELS.warm.color} />
      </div>

      {coolList.length > 0 && (
        <div className="mb-6 os-section">
          <h3 className="os-card-title mb-3" style={{ color: LEVELS.cool.color }}>⚠ 越线告警 · {coolList.length} 项</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {coolList.map((ind) => (
              <div key={ind.id} className="os-card p-4" style={{ borderLeft: `3px solid ${LEVELS.cool.color}` }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ind.name}</span>
                  <span className="mono text-sm" style={{ color: LEVELS.cool.color }}>{ind.trend}</span>
                </div>
                <div className="mono text-base mb-1" style={{ color: LEVELS.cool.color }}>{ind.reading}</div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{ind.note}</p>
                <Link to={ind.to} className="os-link mono text-[11px]" style={{ color: 'var(--cyber-cyan)' }}>→ 溯源 {ind.src}</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card title="📮 沙盒推演回执 · 战役判定回流" className="mb-6">
        {sandboxVerdicts.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>治国沙盒尚无战役回执——告警正等着被推演验证</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {sandboxVerdicts.map((v, i) => {
              const score = Number(v.score) || 0;
              const c = verdictColor(score);
              return (
                <div key={`${v.label || 'verdict'}-${i}`} className="flex items-center gap-2">
                  <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{v.label || '—'}</span>
                  {Array.isArray(v.crisisKeys) && v.crisisKeys.length > 1 && (
                    <span className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(239,68,68,0.16)', color: '#ef4444' }}>复合</span>
                  )}
                  <span className="mono text-sm shrink-0" style={{ color: c }}>{score}</span>
                  <span className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0" style={{ background: `color-mix(in srgb, ${c} 16%, transparent)`, color: c }}>{v.verdict || '—'}</span>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          本页已把红/橙档 Top6 告警写入账本；到 <Link to="/sandbox" className="os-link mono" style={{ color: 'var(--cyber-cyan)' }}>治国沙盒 · 战役模式</Link> 一键开战役，判定经「📮 回执」流回此卡（最近 6 局新进先出）。
        </p>
      </Card>

      <div className="mb-4 os-section">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => setDomainFilter('all')}
            className={`os-filter-chip mono ${domainFilter === 'all' ? 'is-active' : ''}`}
            style={{ '--chip-accent': 'var(--china-red)' }}
          >全部域</button>
          {DOMAINS.map((d) => {
            const Icon = Lucide[d.icon] || Lucide.Square;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDomainFilter(d.id)}
                className={`os-filter-chip mono ${domainFilter === d.id ? 'is-active' : ''}`}
                style={{ '--chip-accent': d.accent }}
              >
                <span className="inline-flex items-center gap-1"><Icon size={12} />{d.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`os-filter-chip mono ${levelFilter === 'all' ? 'is-active' : ''}`}
            style={{ '--chip-accent': 'var(--cyber-cyan)' }}
          >全部档位</button>
          {LEVEL_ORDER.map((lvKey) => (
            <button
              key={lvKey}
              type="button"
              onClick={() => setLevelFilter(lvKey)}
              className={`os-filter-chip mono ${levelFilter === lvKey ? 'is-active' : ''}`}
              style={{ '--chip-accent': LEVELS[lvKey].color }}
            >{LEVELS[lvKey].label}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mb-8 os-section" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map((ind) => <IndicatorCard key={ind.id} ind={ind} />)}
        {filtered.length === 0 && (
          <div className="os-card p-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>// 空集</span> — 当前筛选条件下无指标，调整域或档位。
          </div>
        )}
      </div>

      <Grid cols={2} className="mb-6 os-section">
        <Card title="六域健康雷达 · domainScore 聚合">
          <EChart option={radarOption} height={320} />
        </Card>
        <Card title="六域得分 · 0-100（warm=90 / hold=60 / cool=30 取均值）">
          <div className="flex flex-col gap-3 mt-1">
            {scores.map((s) => {
              const Icon = Lucide[s.icon] || Lucide.Square;
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Icon size={13} style={{ color: s.accent }} />{s.label}
                    </span>
                    <span className="mono text-sm font-semibold" style={{ color: s.accent }}>{s.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.accent }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              得分越低代表该域红/黄档指标占比越高 —— 低分域优先安排溯源巡检，而非简单视为「形势恶化」。
            </p>
          </div>
        </Card>
      </Grid>

      <Card title="判读纪律 · 五条铁律" className="mb-6">
        <ol className="flex flex-col gap-3">
          {DISCIPLINES.map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="mono text-sm shrink-0 w-6 h-6 inline-flex items-center justify-center rounded" style={{ background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)' }}>{i + 1}</span>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</span>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <ModuleFooter
        moduleId="watchtower"
        links={[
          { to: '/diplomacy', label: '外交全局框架盘', note: '大国关系矢量与情景' },
          { to: '/policydocs', label: '政策文件库', note: '施政基准与提法变迁' },
          { to: '/dashboard', label: '中枢看板', note: '态势速览与简报生成' },
        ]}
        disclaimer="读数为各专题模块判读基准之聚合镜像（公开口径示意），非实时数据源、非预测、非投资建议"
      />
    </div>
  );
}
