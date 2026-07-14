import React, { Suspense, lazy, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat, StatGrid, SourceBadge, LoadingSkeleton } from '../../../app/ui.jsx';
import { ECON_AS_OF, KEY_INDICATORS } from '../econData.js';
import { filterIndicators, IndicatorCard } from '../econHelpers.jsx';
import { financeKpis } from '../finance/financeData.js';

const FinanceVizPanel = lazy(() => import('../finance/FinanceVizPanel.jsx'));

const FINANCE_HUB = [
  { to: '/capital-market', label: '资本市场 · 耐心资本', note: '注册制改革、中长期资金入市与创投政策主线。', accent: '#8b5cf6' },
  { to: '/finance', label: '金融系统 · 系统风险', note: '增长账单的另一面：杠杆、宏观审慎与金融安全。', accent: '#c41e3a' },
  { to: '/debt', label: '地方债务 · 省际热力', note: '广义财政与化债方案，城投风险地理分布。', accent: '#e8a317' },
  { to: '/market-pulse', label: '全球资产脉搏 · 实时行情', note: '股债汇大宗 18 标的轮询，资本市场情绪温度计。', accent: '#22d3ee' },
  { to: '/financeRmb', label: '人民币国际化 · CIPS', note: '跨境清算与离岸窗口，货币主权维度。', accent: '#10b981' },
  { to: '/greenfinance', label: '绿色金融 · 碳定价', note: '双碳目标下的金融工具与碳市场接口。', accent: '#62a89e' },
];

export default function FinanceTab() {
  const moneyIndicators = useMemo(() => filterIndicators(KEY_INDICATORS, 'money'), []);
  const priceIndicators = useMemo(() => filterIndicators(KEY_INDICATORS, 'price'), []);
  const kpis = useMemo(() => financeKpis(), []);

  return (
    <div className="econ-section">
      <StatGrid className="econ-hero-stats">
        <Stat value={`${kpis.m2}%`} label="M2 同比增速（近似）" accent="var(--fire-gold)" />
        <Stat value={`${kpis.scissors} pct`} label="M1−M2 剪刀差" accent="var(--econ-indigo, #8090c6)" />
        <Stat value={`${kpis.afre}%`} label="社融存量增速" accent="var(--china-red)" />
        <Stat value={`${kpis.cpi}%`} label="CPI 同比" accent="var(--cyber-cyan)" />
      </StatGrid>

      <Suspense fallback={<LoadingSkeleton rows={4} label="资本市场可视化载入中…" />}>
        <FinanceVizPanel />
      </Suspense>

      <Card title="金融货币 · 指标快照">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
            M2、社融与新增融资是「宽货币→宽信用→实体」传导链的关键节点——总量偏松但活化偏慢，是 2026 H1 主线之一。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>
        <Grid cols={3} gap="0.75rem" stagger>
          {moneyIndicators.map((k) => <IndicatorCard key={k.id} k={k} />)}
        </Grid>
      </Card>

      <Card title="物价传导 · 金融定价锚">
        <Grid cols={2} gap="0.75rem" stagger>
          {priceIndicators.map((k) => <IndicatorCard key={k.id} k={k} />)}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // CPI/PPI 近零与负增长，名义利率与实际利率的剪刀差塑造金融条件
        </p>
      </Card>

      <Card title="资本市场 · 关联深潜">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          经济大盘的货币层读数需与资本市场、金融系统模块交叉验证——耐心资本、系统风险与资产价格三条线互为镜像。
        </p>
        <div className="econ-hub-grid">
          {FINANCE_HUB.map((h) => (
            <Link key={h.to} to={h.to} className="econ-hub-card" style={{ borderLeft: `3px solid ${h.accent}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{h.label} ↗</div>
              <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{h.note}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
