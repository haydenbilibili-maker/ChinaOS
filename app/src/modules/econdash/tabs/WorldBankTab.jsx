import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat, StatGrid, SourceBadge, EmptyState } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { AXIS, LABEL, LEGEND } from '../../shared/chartHelpers.js';
import { SelectorBar } from '../../shared/ModuleParadigm.jsx';
import { WB_INDICATORS } from '../liveWorldBank.js';
import { wbStat } from '../liveWorldBank.js';
import { ECON_AS_OF, econTabPath } from '../econData.js';
import {
  REPORT_META,
  EXECUTIVE_SUMMARY,
  OUTLOOK_SUMMARY,
  TABLE1,
  KEY_READINGS,
  SECTIONS,
  BOXES,
  DISCLAIMER,
} from '../../wbCeReport/ceuReportData.js';

const SUB_TABS = [
  { id: 'overview', label: '概述与预测' },
  { id: 'recent', label: '近期形势' },
  { id: 'outlook', label: '前景政策' },
  { id: 'special', label: '低碳专题' },
  { id: 'data', label: '指标表' },
  { id: 'wdi', label: 'WDI 长序列' },
];

const WB_FOCUS_KEYS = ['gdpGrowth', 'cpi', 'gdp', 'gdpPerCap'];

function ForecastChart({ rows, years }) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 11 } },
    grid: { left: 48, right: 24, top: 28, bottom: 48 },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      axisLabel: { color: LABEL.color, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
      axisLabel: { color: LABEL.color, fontSize: 11 },
    },
    series: rows.map((r) => ({
      name: r.label,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: r.values,
      lineStyle: { width: 2, color: r.accent },
      itemStyle: { color: r.accent },
    })),
  }), [rows, years]);

  return (
    <EChart
      option={option}
      style={{ height: 320 }}
      loading={false}
      loadingLabel="基线预测载入中…"
    />
  );
}

function DataTable({ sections, years }) {
  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div key={sec.title} style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          <div className="mono text-xs px-3 py-2" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            {sec.title}
          </div>
          {sec.rows.map((row, ri) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: `minmax(140px, 1.6fr) repeat(${years.length}, 1fr)`,
                borderTop: ri ? '1px solid var(--border-subtle)' : 'none',
                fontSize: 12,
                fontWeight: row.bold ? 600 : 400,
              }}
            >
              <div style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{row.label}</div>
              {row.values.map((v, vi) => (
                <div
                  key={vi}
                  className="mono"
                  style={{
                    padding: '8px 10px',
                    textAlign: 'right',
                    color: years[vi]?.includes('f') ? '#22d3ee' : 'var(--text-primary)',
                    borderLeft: '1px solid var(--border-subtle)',
                  }}
                >
                  {typeof v === 'number' ? v.toFixed(1) : v}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionBullets({ section }) {
  if (!section) return null;
  return (
    <div className="space-y-6">
      {section.subsections.map((sub) => (
        <div key={sub.title}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: section.accent }}>{sub.title}</h3>
          <ul className="space-y-2">
            {sub.bullets.map((b, i) => (
              <li key={i} className="text-sm leading-relaxed pl-4 relative" style={{ color: 'var(--text-secondary)' }}>
                <span className="absolute left-0" style={{ color: section.accent }}>▸</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function WorldBankTab({ wb }) {
  const [subTab, setSubTab] = useState('overview');
  const [wbKey, setWbKey] = useState('gdpGrowth');

  const wbData = wb?.data || {};
  const wbIndicators = useMemo(
    () => (WB_INDICATORS || []).filter((d) => WB_FOCUS_KEYS.includes(d.key)),
    [],
  );
  const wbDef = useMemo(
    () => (WB_INDICATORS || []).find((d) => d.key === wbKey) || null,
    [wbKey],
  );
  const wbSeries = wbKey ? wbData[wbKey] : null;

  const wbLineOption = useMemo(() => {
    const series = wbSeries?.series || [];
    if (!series.length) return null;
    const years = series.map((p) => String(p.year));
    const vals = series.map((p) => p.value);
    const kind = wbDef?.kind || 'pct';
    const axisFmt = (v) => (kind === 'money' ? wbStat(v, 'money') : `${v}`);
    return {
      grid: { left: 48, right: 18, top: 30, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const p = params?.[0];
          if (!p) return '';
          return `${p.axisValue}<br/>${wbDef?.label || ''} ${kind === 'money' ? wbStat(p.data, 'money') : axisFmt(p.data) + (kind === 'pct' ? '' : ` ${wbDef?.unit || ''}`)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
        axisLabel: { color: LABEL.color, fontSize: 11 },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
        axisLabel: {
          color: LABEL.color,
          fontSize: 11,
          formatter: (v) => (kind === 'money' ? wbStat(v, 'money') : v),
        },
      },
      series: [{
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: vals,
        lineStyle: { width: 2, color: '#22d3ee' },
        itemStyle: { color: '#22d3ee' },
        areaStyle: { color: 'rgba(34,211,238,0.08)' },
      }],
    };
  }, [wbSeries, wbDef]);

  const wbLoading = wb?.loading && !wbSeries?.series?.length;
  const section = SECTIONS.find((s) => s.id === subTab);

  return (
    <div className="econ-section">
      <Card title={`世行经济简报 · ${REPORT_META.edition}`}>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
            世界银行《{REPORT_META.title}》结构化要点：月度研判与基线预测，与 WDI 年度长序列互补。
            数据截至 {REPORT_META.asOf} · {REPORT_META.source}
          </p>
          <SourceBadge live={false} asOf={REPORT_META.asOf} />
        </div>

        <StatGrid className="mb-4">
          {KEY_READINGS.slice(0, 4).map((k) => (
            <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
          ))}
        </StatGrid>

        <div className="econ-finance-subnav" role="tablist" aria-label="世行简报子导航">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={subTab === t.id}
              className={`econ-finance-subnav-btn${subTab === t.id ? ' is-active' : ''}`}
              onClick={() => setSubTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {subTab === 'overview' && (
        <>
          <Card title="概述 · 执行摘要">
            <div className="space-y-3">
              {EXECUTIVE_SUMMARY.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>
          </Card>

          <Card title="中国经济前景 · 基线预测">
            <ForecastChart rows={OUTLOOK_SUMMARY.rows} years={OUTLOOK_SUMMARY.years} />
            <p className="text-xs mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>{OUTLOOK_SUMMARY.note}</p>
          </Card>

          <Grid cols={2} gap="1.25rem">
            {BOXES.map((b) => (
              <div
                key={b.id}
                className="os-card"
                style={{ padding: 'var(--card-padding)', borderLeft: `3px solid ${b.accent}` }}
              >
                <div className="text-sm font-semibold mb-2" style={{ color: b.accent }}>{b.title}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b.text}</p>
              </div>
            ))}
          </Grid>
        </>
      )}

      {section && subTab !== 'overview' && subTab !== 'data' && subTab !== 'wdi' && (
        <Card title={`${section.part}. ${section.title}`}>
          <SectionBullets section={section} />
        </Card>
      )}

      {subTab === 'data' && (
        <>
          <Card title="表 1 · 中国部分经济指标（2023–2028）">
            <div className="overflow-x-auto mb-3">
              <DataTable sections={TABLE1.sections} years={TABLE1.years} />
            </div>
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              来源：世界银行 · f = 预测值（基线情景）· * 广义财政收支余额为世行工作人员估算
            </p>
          </Card>

          <Card title="关键读数速览">
            <StatGrid>
              {KEY_READINGS.map((k) => (
                <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
              ))}
            </StatGrid>
          </Card>
        </>
      )}

      {subTab === 'wdi' && (
        <Card title="WDI 长序列 · 与世行简报交叉验证">
          <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
            浏览器直连 World Bank Open Data 实时取数，35 年年度口径；与 CEU 月度研判存在时滞与统计差异。
          </p>
          <SelectorBar items={wbIndicators} activeKey={wbKey} onSelect={setWbKey} />
          <div className="mt-4" style={{ minHeight: 280 }}>
            {wbSeries?.error ? (
              <EmptyState title="实时取数失败" description={`${String(wbSeries.error)}；可稍后重试或前往宏观态势 Tab。`} />
            ) : (
              <EChart
                option={wbLineOption}
                style={{ height: 280 }}
                loading={wbLoading}
                loadingLabel="World Bank 序列拉取中…"
              />
            )}
          </div>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div>
              <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{wbDef?.label || '—'} · 最新值</div>
              <div className="mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {wbSeries?.latest ? wbStat(wbSeries.latest.value, wbDef?.kind || 'pct') : (wb?.loading ? '载入中' : '—')}
              </div>
              {wbSeries?.latest?.year && (
                <div className="text-[11px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>数据年份 {wbSeries.latest.year}</div>
              )}
            </div>
            {wbDef?.note && (
              <p className="text-[11px] leading-relaxed flex-1" style={{ color: 'var(--text-tertiary)' }}>{wbDef.note}</p>
            )}
          </div>
          <p className="text-[10px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
            数据源：{wbSeries?.source || 'World Bank · WDI'} · 截至 {ECON_AS_OF}
          </p>
        </Card>
      )}

      <Card title="交叉深潜 · 关联模块">
        <div className="econ-hub-grid">
          <Link to={econTabPath('macro')} className="econ-hub-card" style={{ borderLeft: '3px solid #22d3ee' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>宏观态势 · WDI 全指标 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              12 项世行长序列 + NBS 快照 + 国际对比，与本简报年度口径互补。
            </p>
          </Link>
          <Link to={econTabPath('canary')} className="econ-hub-card" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>信号金丝雀 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              领先指标示意与 CEU 供强需弱叙事交叉验证。
            </p>
          </Link>
          <Link to="/wb-ce-report" className="econ-hub-card" style={{ borderLeft: '3px solid #10b981' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>世行简报独立页 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              完整五段式阅读体验与 PDF 原文下载。
            </p>
          </Link>
          <a
            href={REPORT_META.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="econ-hub-card"
            style={{ borderLeft: '3px solid #e8a317' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>CEU PDF 原文 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {REPORT_META.edition} 中文版 · 正式引用请以 PDF 为准。
            </p>
          </a>
        </div>
      </Card>

      <div
        className="os-card"
        style={{ padding: 'var(--card-padding)', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}
      >
        <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>
          数据截至 {REPORT_META.asOf} · {REPORT_META.source} · NBS 快照截至 {ECON_AS_OF}
        </div>
        <p className="text-xs m-0" style={{ color: 'var(--text-secondary)' }}>{DISCLAIMER}</p>
      </div>
    </div>
  );
}
