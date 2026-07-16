import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// Layout: ink-observatory · os-card · os-reveal-stagger · TabBar (Round 2)
import { PageHeader, TabBar, LoadingSkeleton } from '../../app/ui.jsx';
import { FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { ECON_AS_OF, ECON_DATA_AS_OF, ECON_TAB_IDS, KEY_INDICATORS } from './econData.js';
import { toneOf, ARROW } from './econHelpers.jsx';
import { useWorldBank } from './liveWorldBank.js';
import MacroTab from './tabs/MacroTab.jsx';
import DataFreshnessBar from './DataFreshnessBar.jsx';
import './econ.css';

const StructureTab = lazy(() => import('./tabs/StructureTab.jsx'));
const FinanceTab = lazy(() => import('./tabs/FinanceTab.jsx'));
const RegionalTab = lazy(() => import('./tabs/RegionalTab.jsx'));
const CanaryTab = lazy(() => import('./tabs/CanaryTab.jsx'));
const WorldBankTab = lazy(() => import('./tabs/WorldBankTab.jsx'));
const EconConsume15 = lazy(() => import('../econConsume15/Page.jsx'));
const EconH1Review = lazy(() => import('../econH1Review/Page.jsx'));

// ============================================================================
// 经济大盘 · 全景与实时监测（ink-observatory Round 2）
// ----------------------------------------------------------------------------
// 八 Tab：宏观态势 → 结构矛盾 → 资本市场 → 区域产业 → 信号金丝雀 → 世行经济简报 → 十五五促消费 → 半年经济解读
// 侧栏仅「经济大盘」；世行/促消费/半年解读均为二级 Tab 全文嵌入（深链 ?tab=）
// ============================================================================

const TABS = [
  { id: 'macro', label: '宏观态势', accent: 'var(--cyber-cyan)' },
  { id: 'structure', label: '结构矛盾', accent: 'var(--fire-gold)' },
  { id: 'finance', label: '资本市场', accent: '#8b5cf6' },
  { id: 'regional', label: '区域产业', accent: '#c99a4e' },
  { id: 'canary', label: '信号金丝雀', accent: 'var(--china-red)' },
  { id: 'worldbank', label: '世行经济简报', accent: '#22d3ee' },
  { id: 'consume15', label: '十五五促消费', accent: '#f472b6' },
  { id: 'h1review', label: '半年经济解读', accent: '#e8a317' },
];

function TabFallback() {
  return <LoadingSkeleton rows={3} label="板块载入中…" className="econ-tab-fallback" />;
}

const SUMMARY_IDS = ['gdp_h1', 'iva', 'retail', 'export', 'cpi'];
const SUMMARY_LABELS = { gdp_h1: 'GDP·H1', iva: '规上工业', retail: '社零', export: '出口', cpi: 'CPI' };

function KeyReadingStrip() {
  const items = SUMMARY_IDS
    .map((id) => KEY_INDICATORS.find((k) => k.id === id))
    .filter(Boolean);
  return (
    <div className="econ-readout" role="group" aria-label="关键读数摘要 · 2026 H1">
      <span className="econ-readout__title mono">H1 读数</span>
      <div className="econ-readout__items">
        {items.map((k) => {
          const tone = toneOf(k.trend ?? k.yoy);
          return (
            <span key={k.id} className="econ-readout__chip" title={k.label} style={{ '--econ-chip-tone': tone }}>
              <span className="econ-readout__k">{SUMMARY_LABELS[k.id] || k.label}</span>
              <span className="econ-readout__v mono os-mono-tabular">
                {k.value}<span className="econ-readout__u">%</span>
              </span>
              <span className="econ-readout__arrow mono" style={{ color: tone }} aria-hidden="true">
                {ARROW(k.trend ?? k.yoy)}
              </span>
            </span>
          );
        })}
      </div>
      <details className="econ-note">
        <summary className="econ-note__summary mono">ⓘ 口径</summary>
        <p className="econ-note__body">
          NBS 快照（基准日 {ECON_DATA_AS_OF}）· 世行 WDI 实时长序列 · 公开数据派生领先指标。
          公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
        </p>
      </details>
    </div>
  );
}

export default function Page({ embedded = false }) {
  const wb = useWorldBank();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localTab, setLocalTab] = useState('macro');

  const tab = useMemo(() => {
    if (embedded) return localTab;
    const raw = searchParams.get('tab');
    const id = raw === 'wb' ? 'worldbank' : raw;
    return ECON_TAB_IDS.includes(id) ? id : 'macro';
  }, [embedded, localTab, searchParams]);

  const setTab = useCallback((id) => {
    const next = ECON_TAB_IDS.includes(id) ? id : 'macro';
    if (embedded) {
      setLocalTab(next);
      return;
    }
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (!next || next === 'macro') params.delete('tab');
      else params.set('tab', next);
      return params;
    }, { replace: true });
  }, [embedded, setSearchParams]);

  // 长文 Tab：自带仪表盘/出处/FrameworkTrio，隐藏大盘工具条与尾栏，避免重复壳层
  const isLongFormTab = tab === 'h1review' || tab === 'consume15';

  const tabPanel = (() => {
    switch (tab) {
      case 'macro':
        return <MacroTab wb={wb} />;
      case 'structure':
        return <StructureTab />;
      case 'finance':
        return <FinanceTab />;
      case 'regional':
        return <RegionalTab />;
      case 'canary':
        return <CanaryTab wbData={wb.data || {}} />;
      case 'worldbank':
        return <WorldBankTab wb={wb} />;
      case 'consume15':
        return <EconConsume15 embedded />;
      case 'h1review':
        return <EconH1Review embedded />;
      default:
        return <MacroTab wb={wb} />;
    }
  })();

  const shell = (
    <>
      {!embedded && (
        <PageHeader
          badge="Dashboard · 经济大盘"
          title="经济大盘"
          subtitle={`NBS 快照 × 世行长序列 × 金丝雀 · 十五五开局 2026 H1 · 截至 ${ECON_AS_OF}`}
        >
          <div className="econ-header-chips flex flex-wrap gap-1.5 items-center">
            <Link to="/dashboard" className="econ-cross-chip">中枢看板 ↗</Link>
            <Link to="/modules/signal-panel" className="econ-cross-chip">信号灯 ↗</Link>
            <Link to="/modules/observatory" className="econ-cross-chip econ-cross-chip--amber">观象台 ↗</Link>
          </div>
        </PageHeader>
      )}

      {!isLongFormTab && (
        <div className="econ-toolbelt" aria-label="时效与关键读数">
          <DataFreshnessBar />
          <KeyReadingStrip />
        </div>
      )}

      <div className="econ-sticky-nav">
        <TabBar tabs={TABS} value={tab} onChange={setTab} accent="var(--cyber-cyan)" sticky className="econ-tab-bar" />
      </div>

      <div className="os-reveal-stagger">
        <Suspense fallback={<TabFallback />}>
          {tabPanel}
        </Suspense>
      </div>

      {!isLongFormTab && (
        <FrameworkTrio cards={[
          {
            title: '统计的政治学', subtitle: '口径即立场 · 度量即权力', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
            body: '一个经济体被怎么测量，决定了它被怎么治理。GDP 把什么算进来、什么留在外面，CPI 篮子放哪些商品、权重几何——口径不是技术细节，是政治选择。数据先于政策，统计制度本身就是一项基础设施。',
            pillars: [['口径', '算什么即重视什么。'], ['权重', '篮子决定通胀感受。'], ['发布', '节奏与披露是治理动作。']],
          },
          {
            title: '指标的领先与滞后', subtitle: '体温计 · 后视镜 · 金丝雀', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
            body: 'GDP 是后视镜——确认已经发生的事；PMI、用电量、货运量是体温计——同步感知当下；信贷脉冲、票据利率、招聘指数是金丝雀——先于官方数据感知转折。读经济不是读一个数，是读一组指标的时间错位。',
            pillars: [['滞后', 'GDP 确认过去。'], ['同步', '景气量度当下。'], ['领先', '金丝雀预告拐点。']],
          },
          {
            title: '全景的盲区', subtitle: '看得见的与漏掉的', accent: 'var(--china-red)', border: 'var(--china-red)',
            body: '再全的大盘也有盲区：均值掩盖分布，总量遮蔽结构，存量数据看不见资产负债表的隐性裂缝。基尼系数、城乡比、债务-收入比这些「分布与结构」指标，常常比总量更早预告麻烦。看全景的同时，要盯住它没照亮的角落。',
            pillars: [['分布', '均值之下有裂缝。'], ['结构', '总量之内有失衡。'], ['隐性', '表外即下一处风险。']],
          },
        ]} />
      )}

      {!embedded && !isLongFormTab && (
        <ModuleFooter
          moduleId="econdash"
          disclaimer="公开统计梳理 · 示意标定 · 非投资建议 · 非预测"
          sourceNote={`数据源：国家统计局公开口径快照 · 世界银行 WDI 实时 · 领先指标为公开数据派生示意 · 截至 ${ECON_AS_OF}`}
        />
      )}
    </>
  );

  if (embedded) return <div>{shell}</div>;

  return <div className="ink-observatory econ-wrap">{shell}</div>;
}
