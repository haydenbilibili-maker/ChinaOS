import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, SourceBadge } from '../../../app/ui.jsx';
import { ECON_AS_OF, KEY_INDICATORS } from '../econData.js';
import { GaugeCard } from '../econUI.jsx';
import { HEADLINE_GAUGES } from '../econDeflation.js';
import { filterIndicators, IndicatorCard } from '../econHelpers.jsx';

const FINANCE_HUB = [
  { to: '/capital-market', label: '资本市场 · 耐心资本', note: '注册制改革、中长期资金入市与创投政策主线。', accent: '#8b5cf6' },
  { to: '/finance', label: '金融系统 · 系统风险', note: '增长账单的另一面：杠杆、宏观审慎与金融安全。', accent: '#c41e3a' },
  { to: '/debt', label: '地方债务 · 省际热力', note: '广义财政与化债方案，城投风险地理分布。', accent: '#e8a317' },
  { to: '/market-pulse', label: '全球资产脉搏 · 实时行情', note: '股债汇大宗 18 标的轮询，资本市场情绪温度计。', accent: '#22d3ee' },
  { to: '/financeRmb', label: '人民币国际化 · CIPS', note: '跨境清算与离岸窗口，货币主权维度。', accent: '#10b981' },
  { to: '/greenfinance', label: '绿色金融 · 碳定价', note: '双碳目标下的金融工具与碳市场接口。', accent: '#62a89e' },
];

function liquidityGauges() {
  const ids = new Set(['m1m2', 'bill_rate_vs_credit', 'afre_vs_household_loan']);
  return (HEADLINE_GAUGES || []).filter((g) => ids.has(g.id) || /M1|M2|信贷|利率|流动性|社融/i.test(`${g.label}${g.sub || ''}`));
}

function lastValue(points) {
  if (!Array.isArray(points) || !points.length) return null;
  const last = points[points.length - 1];
  if (typeof last === 'number') return last;
  if (typeof last === 'object') return last.value ?? last.v ?? null;
  return null;
}

export default function FinanceTab() {
  const moneyIndicators = useMemo(() => filterIndicators(KEY_INDICATORS, 'money'), []);
  const priceIndicators = useMemo(() => filterIndicators(KEY_INDICATORS, 'price'), []);
  const gauges = useMemo(() => liquidityGauges(), []);

  return (
    <div className="econ-section">
      <Card title="金融货币 · 资金活化读数">
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

      {gauges.length > 0 && (
        <Card title="流动性表盘 · 领先信号">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {gauges.map((g, i) => {
              const series = g.series || g.points || [];
              const latest = lastValue(series);
              const unit = g.unit || '';
              return (
                <GaugeCard
                  key={g.id || i}
                  label={g.label}
                  sub={g.sub}
                  points={series}
                  color="#8b5cf6"
                  signal={g.signal}
                  source={g.source}
                  freq={g.freq}
                  note={g.note}
                  latest={latest != null ? `${latest}${unit}` : null}
                  zero={g.zero}
                />
              );
            })}
          </div>
        </Card>
      )}

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
