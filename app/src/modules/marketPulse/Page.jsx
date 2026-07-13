import React from 'react';
import { PageHeader, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { IntroCard, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import MarketTicker from '../shared/MarketTicker.jsx';
import { AS_OF_MARKET, MARKET_SEED } from '../../lib/market/liveQuotes.js';

export default function Page() {
  const equityCount = MARKET_SEED.filter((q) => q.category === 'equity').length;
  const bondCount = MARKET_SEED.filter((q) => q.category === 'bond').length;
  const fxCount = MARKET_SEED.filter((q) => q.category === 'fx').length;
  const commodityCount = MARKET_SEED.filter((q) => q.category === 'commodity').length;

  return (
    <div>
      <PageHeader
        badge="实时行情 · 多源聚合"
        title="全球资产脉搏"
        subtitle="股市 · 债市 · 汇市 · 大宗"
      />

      <IntroCard>
        覆盖 A 股/港股/美股主要指数、中美 10Y 国债、主要汇率与黄金原油等 {MARKET_SEED.length} 个标的——
        开发环境经 Vite 代理拉取 Sina / Frankfurter / Yahoo 行情，离线时回退内置种子快照。
        数据基准 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF_MARKET}</span>，仅供研究判读，非投资建议。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value={equityCount} label="股市标的" accent="#c41e3a" />
        <Stat value={bondCount} label="债市标的" accent="#e8a317" />
        <Stat value={fxCount} label="汇市标的" accent="#22d3ee" />
        <Stat value={commodityCount} label="大宗标的" accent="#10b981" />
      </StatGrid>

      <MarketTicker variant="full" hideTitle className="mb-6" />

      <ModuleFooter
        moduleId="marketPulse"
        sourceNote={`数据截至 ${AS_OF_MARKET} · 非投资建议`}
      />
    </div>
  );
}
