import React, { Suspense, lazy, useMemo, useState, useCallback } from 'react';
import { Card, Grid, SourceBadge, LoadingSkeleton } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { FINANCE_AS_OF, FINANCE_SECTIONS, financeKpis, FINANCE_CANARY_LINKS } from './financeData.js';
import {
  moneySupplyOption, liquidityGaugeOption, cpiPpiOption, rateCorridorOption,
  fxOption, sentimentOption, tsfDonutOption, financeMixOption,
  sectorTreemapOption, regionalAfreOption, marginSparkOption,
} from './financeCharts.js';
import { macroReadForIndicator } from '../econMacroBridge.js';
import { CANARY_SIGNALS } from '../econData.js';
import { CANARY_LIGHT } from '../econHelpers.jsx';
import { POLICY_NODES } from './financeData.js';

const LazyChart = lazy(() => Promise.resolve({ default: EChart }));

function ChartBlock({ option, height = 280, label }) {
  return (
    <Suspense fallback={<LoadingSkeleton rows={1} label={label || '图表载入中…'} />}>
      <LazyChart option={option} variant="dashboard" style={{ height }} loading={!option} />
    </Suspense>
  );
}

function SectionShell({ id, title, note, source, children }) {
  return (
    <section id={`finance-${id}`} className="econ-finance-section scroll-mt-24">
      <Card title={title}>
        {(note || source) && (
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            {note && <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>{note}</p>}
            <SourceBadge live={false} asOf={FINANCE_AS_OF} />
          </div>
        )}
        {source && (
          <p className="text-[10px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
            // 来源：{source}
          </p>
        )}
        {children}
      </Card>
    </section>
  );
}

export default function FinanceVizPanel() {
  const [activeSection, setActiveSection] = useState('money');
  const kpis = useMemo(() => financeKpis(), []);

  const opts = useMemo(() => ({
    money: moneySupplyOption(),
    liquidity: liquidityGaugeOption(kpis.scissors, kpis.afre - kpis.m2),
    cpiPpi: cpiPpiOption(),
    rates: rateCorridorOption(),
    fx: fxOption(),
    sentiment: sentimentOption(),
    tsf: tsfDonutOption(),
    mix: financeMixOption(),
    sector: sectorTreemapOption(),
    regional: regionalAfreOption(),
    margin: marginSparkOption(),
  }), [kpis]);

  const scrollTo = useCallback((id) => {
    setActiveSection(id);
    document.getElementById(`finance-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const canaryMap = useMemo(() => {
    const m = {};
    (CANARY_SIGNALS || []).forEach((c) => { m[c.id] = c; });
    return m;
  }, []);

  return (
    <>
      <nav className="econ-finance-subnav" aria-label="资本市场子导航">
        {FINANCE_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`econ-finance-subnav-btn${activeSection === s.id ? ' is-active' : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="os-reveal-stagger econ-finance-viz">
        <SectionShell
          id="money"
          title="货币供应 · M0/M1/M2 与剪刀差"
          note="宽货币→宽信用传导链的第一环：M2 偏松但 M1 活化偏慢，流动性陷阱风险未解。"
          source={undefined}
        >
          <ChartBlock option={opts.money} height={300} label="货币供应载入中…" />
          <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
            // M2/剪刀差同源 econDeflation · M0 为公开口径近似 · 新口径 M1 含部分活期存款
          </p>
        </SectionShell>

        <SectionShell
          id="liquidity"
          title="流动性温度计 · 信用体温"
          note="M1−M2 剪刀差衡量资金「趴账还是动」；社融脉冲（社融同比−M2）衡量宽信用超额。"
        >
          <ChartBlock option={opts.liquidity} height={220} label="流动性表盘载入中…" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="os-card p-3" style={{ borderLeft: '3px solid #8090c6' }}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>剪刀差读数</div>
              <div className="mono text-xl font-bold" style={{ color: kpis.scissors < 0 ? '#c44e3d' : '#62a89e' }}>
                {kpis.scissors} pct
              </div>
              <p className="text-[10px] m-0 mt-1" style={{ color: 'var(--text-tertiary)' }}>
                负差=资金趴账；收敛=边际活化（示意）
              </p>
            </div>
            <div className="os-card p-3" style={{ borderLeft: '3px solid #c99a4e' }}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>社融脉冲</div>
              <div className="mono text-xl font-bold" style={{ color: '#e8a317' }}>
                {(kpis.afre - kpis.m2).toFixed(1)} pct
              </div>
              <p className="text-[10px] m-0 mt-1" style={{ color: 'var(--text-tertiary)' }}>
                政府债撑总量、私人信用偏弱（示意）
              </p>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          id="price"
          title="物价传导 · CPI-PPI 剪刀差"
          note="CPI 近零、PPI 深度负值——名义利率与实际利率剪刀差塑造金融条件，通缩压力带自我强化。"
        >
          <ChartBlock option={opts.cpiPpi} height={280} label="物价传导载入中…" />
          <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
            // 阴影区为通缩压力带（PPI≤0 且 CPI≤0.5%）· 同源 INDICATOR_SPARKLINES
          </p>
        </SectionShell>

        <Grid cols={2} gap="1rem">
          <SectionShell
            id="rates"
            title="利率走廊 · LPR/MLF/DR007"
            note="政策利率→LPR→实体融资的传导链条；DR007 围绕政策利率波动。"
            source="人民银行 · 月均值近似"
          >
            <ChartBlock option={opts.rates} height={260} label="利率走廊载入中…" />
          </SectionShell>

          <SectionShell
            id="fx"
            title="汇率与外部约束 · USD/CNY"
            note="内外利差与关税冲击下，宏观审慎工具平滑汇率预期；7.0 附近为心理关口。"
            source="外汇交易中心 · 月均值近似"
          >
            <ChartBlock option={opts.fx} height={260} label="汇率走势载入中…" />
          </SectionShell>
        </Grid>

        <SectionShell
          id="sentiment"
          title="资本市场情绪 · 股债跷跷板"
          note="股债相对强弱 + 北向/融资余额——宽货币未完全转化为风险偏好回升。"
          source="上证/中债/交易所 · 示意"
        >
          <ChartBlock option={opts.sentiment} height={300} label="市场情绪载入中…" />
          <Grid cols={2} gap="0.75rem" className="mt-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>融资余额（万亿 · 示意）</div>
              <ChartBlock option={opts.margin} height={160} label="融资余额载入中…" />
            </div>
            <div className="os-card p-3 flex flex-col justify-center" style={{ borderLeft: '3px solid #22d3ee' }}>
              <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>实时种子读数 · liveQuotes</div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>上证指数</div>
                  <div className="mono text-lg font-bold" style={{ color: '#c41e3a' }}>{kpis.sse ?? '—'}</div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>USD/CNY</div>
                  <div className="mono text-lg font-bold" style={{ color: '#10b981' }}>{kpis.usdcny ?? '—'}</div>
                </div>
              </div>
              <p className="text-[10px] m-0 mt-2" style={{ color: 'var(--text-tertiary)' }}>
                北向资金自 2024-08 停止实时披露 · 上图柱状为月度估算示意
              </p>
            </div>
          </Grid>
        </SectionShell>

        <Grid cols={2} gap="1rem">
          <SectionShell
            id="structure"
            title="金融结构 · 社融存量构成"
            note="间接融资仍为主体，直接融资占比缓升——耐心资本与注册制改革的长坡。"
            source="finance/Page TSF_STOCK 同源 · 示意"
          >
            <ChartBlock option={opts.tsf} height={260} label="社融构成载入中…" />
          </SectionShell>

          <SectionShell
            id="structure-mix"
            title="直接 vs 间接融资演进"
            note="贷款占比从八成降至六成附近，股债融资通道拓宽但仍非主导。"
            source="capitalMarket + finance 模块同源 · 示意"
          >
            <ChartBlock option={opts.mix} height={260} label="融资结构载入中…" />
          </SectionShell>
        </Grid>

        <SectionShell
          id="sector"
          title="行业/区域资本流向"
          note="社融增量政府债占比高、居民贷款偏弱；区域上东部存量主导、西部增速偏快。"
          source="人民银行/Wind · 示意 · 口径待核"
        >
          <Grid cols={2} gap="1rem">
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>2026 H1 社融增量结构（示意）</div>
              <ChartBlock option={opts.sector} height={260} label="行业结构载入中…" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>区域社融存量占比 vs 增速</div>
              <ChartBlock option={opts.regional} height={260} label="区域流向载入中…" />
            </div>
          </Grid>
        </SectionShell>

        <SectionShell
          id="canary"
          title="金丝雀联动 · 金融指标交叉验证"
          note="货币层读数需与领先指标、宏观域指标交叉验证——避免单指标误判。"
        >
          <Grid cols={2} gap="0.75rem" stagger>
            {FINANCE_CANARY_LINKS.map((link) => {
              const canary = canaryMap[link.canaryId];
              const macro = macroReadForIndicator(link.id === 'cpi_ppi' ? 'ppi' : link.id === 'rate' ? 'cpi' : link.id);
              const light = CANARY_LIGHT[link.signal] || CANARY_LIGHT.amber;
              return (
                <div key={link.id} className="os-card p-3" style={{ borderLeft: `3px solid ${light.c}` }}>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{link.label}</span>
                    {macro?.tag && (
                      <span className="econ-cross-chip">{macro.tag} ↗</span>
                    )}
                  </div>
                  <div className="mono text-base font-bold mb-1" style={{ color: light.c }}>{link.reading}</div>
                  {canary && (
                    <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                      联动金丝雀 · {canary.label}：{canary.reading}
                    </p>
                  )}
                  {macro?.read && (
                    <p className="text-[10px] mono mt-1 mb-0" style={{ color: 'var(--text-tertiary)' }}>
                      域级读数 · {macro.read.slice(0, 48)}…
                    </p>
                  )}
                </div>
              );
            })}
          </Grid>
        </SectionShell>

        <SectionShell
          id="timeline"
          title="政策时间轴 · 2023–2026 货币金融节点"
          note="宽货币、化债、活跃市场、耐心资本——政策节奏塑造资本市场定价锚。"
        >
          <div className="econ-finance-timeline">
            {POLICY_NODES.map((node) => (
              <div key={`${node.y}-${node.title}`} className="econ-finance-timeline-node" style={{ borderLeftColor: node.accent }}>
                <div className="mono text-[10px] mb-0.5" style={{ color: node.accent }}>{node.y} · {node.m}月</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{node.title}</div>
                <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>
    </>
  );
}
