import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  REPORT_META,
  EXECUTIVE_SUMMARY,
  OUTLOOK_SUMMARY,
  TABLE1,
  KEY_READINGS,
  SECTIONS,
  BOXES,
  DISCLAIMER,
} from './ceuReportData.js';

const TABS = [
  ['overview', '概述与预测'],
  ['recent', '近期形势'],
  ['outlook', '前景政策'],
  ['special', '低碳专题'],
  ['data', '指标表'],
];

function ForecastChart({ rows, years }) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 11 } },
    grid: { left: 48, right: 24, top: 28, bottom: 48 },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: '#27324a' } },
      axisLabel: { color: '#93a1b5', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
      axisLabel: { color: '#93a1b5', fontSize: 11 },
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

  return <EChart option={option} style={{ height: 320 }} />;
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

export default function Page() {
  const [tab, setTab] = useState('overview');
  const section = SECTIONS.find((s) => s.id === tab);

  return (
    <div>
      <PageHeader
        badge="看板 · 世界银行中国经济简报"
        title={`${REPORT_META.title} · ${REPORT_META.edition}`}
        subtitle="供强需弱下的增长韧性 · 能源冲击与再通胀 · 消费再平衡与低碳技能缺口 · 数据截至 2026-06-30"
      />

      <IntroCard>
        本页结构化呈现世界银行 {REPORT_META.edition}《{REPORT_META.title}》中文版要点：概述与基线预测、
        近期经济形势（供强需弱、地产调整、出口对冲、信贷与财政）、前景风险与政策考虑，以及
        「弥合低碳转型技能缺口」专题。与世行 WDI 实时长序列（见
        {' '}<Link to="/econ-dashboard" className="mono" style={{ color: 'var(--cyber-cyan)' }}>经济大盘</Link>）互补——
        本简报侧重月度研判与政策叙事，WDI 侧重年度指标长序列。
        {' '}<a href={REPORT_META.pdfPath} download className="mono" style={{ color: 'var(--cyber-cyan)' }}>下载 PDF 原文</a>
      </IntroCard>

      <Grid cols={4} className="mb-6">
        {KEY_READINGS.slice(0, 4).map((k) => (
          <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
        ))}
      </Grid>

      <SelectorBar items={TABS.map(([id, label]) => ({ key: id, label }))} activeKey={tab} onSelect={setTab} getKey={(i) => i.key} getLabel={(i) => i.label} getAccent={() => '#22d3ee'} />

      {tab === 'overview' && (
        <>
          <Card title="概述 · 执行摘要">
            <div className="space-y-3">
              {EXECUTIVE_SUMMARY.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>
          </Card>

          <Card title="中国经济前景 · 基线预测" className="mt-6">
            <ForecastChart rows={OUTLOOK_SUMMARY.rows} years={OUTLOOK_SUMMARY.years} />
            <p className="text-xs mt-3 mono" style={{ color: 'var(--text-tertiary)' }}>{OUTLOOK_SUMMARY.note}</p>
          </Card>

          <Grid cols={2} gap="1.25rem" className="mt-6">
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

      {section && tab !== 'overview' && tab !== 'data' && (
        <Card title={`${section.part}. ${section.title}`}>
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
        </Card>
      )}

      {tab === 'data' && (
        <>
          <Card title="表 1 · 中国部分经济指标（2023–2028）">
            <div className="overflow-x-auto mb-3">
              <div className="mono text-xs flex gap-2 mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {TABLE1.years.map((y) => (
                  <span key={y} style={{ minWidth: 52, textAlign: 'right', color: y.includes('f') ? '#22d3ee' : undefined }}>{y}</span>
                ))}
              </div>
              <DataTable sections={TABLE1.sections} years={TABLE1.years} />
            </div>
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              来源：世界银行 · f = 预测值（基线情景）· * 广义财政收支余额为世行工作人员估算
            </p>
          </Card>

          <Card title="关键读数速览" className="mt-6">
            <Grid cols={4}>
              {KEY_READINGS.map((k) => (
                <Stat key={k.label} value={k.value} label={k.label} sub={k.sub} accent={k.accent} />
              ))}
            </Grid>
          </Card>
        </>
      )}

      <div className="os-card mt-6" style={{ padding: 'var(--card-padding)', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs mono mb-1" style={{ color: 'var(--text-tertiary)' }}>
              数据截至 {REPORT_META.asOf} · {REPORT_META.source}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{DISCLAIMER}</p>
          </div>
          <a
            href={REPORT_META.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm px-4 py-2 rounded-lg"
            style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee' }}
          >
            打开 PDF 全文 ↗
          </a>
        </div>
      </div>

      <ModuleFooter
        moduleId="wbCeReport"
        disclaimer={`世界银行 ${REPORT_META.edition} 中国经济简报结构化要点 · 数据截至 ${REPORT_META.asOf}`}
      />
    </div>
  );
}
