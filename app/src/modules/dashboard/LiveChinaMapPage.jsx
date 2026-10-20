import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, TabBar } from '../../app/ui.jsx';
import { FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import LiveChinaMap from './LiveChinaMap.jsx';
import ShenzhouDeck from '../shenzhou/ShenzhouDeck.jsx';
import LiveMapTicker from './LiveMapTicker.jsx';
import { AS_OF } from './liveMapData.js';
import {
  LIVE_MAP_VIEWS,
  readDeepLinkFromParams,
  writeDeepLinkToParams,
} from './liveMapDeepLink.js';
import './liveMap.css';

// ============================================================================
// 神州活图 · Live Map v2（ink-observatory Round 2）
// ----------------------------------------------------------------------------
// 五视图：全国态势 → 区域热力 → 信号图层 → 时间轴 → 研判下钻
// URL 深链：?prov=广东省&layer=economy&view=heatmap（实现细节，勿写入 UI intro）
// 坪效原则：Intro/副标题只写用户能力（热力·实况·截至日）；文件路径、代理链、
// 层清单、深链语法 → LIVE ticker / ModuleFooter「数据说明」，禁堆灰墙长文。
// ============================================================================

export { LIVE_MAP_VIEWS };

const TABS = [
  { id: 'situation', label: '全国态势', accent: 'var(--cyber-cyan)' },
  { id: 'heatmap', label: '区域热力', accent: '#6fc2ae' },
  { id: 'signals', label: '信号图层', accent: 'var(--fire-gold)' },
  { id: 'timeline', label: '时间轴', accent: '#b07cc6' },
  { id: 'analysis', label: '研判下钻', accent: 'var(--china-red)' },
];

export default function LiveChinaMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localView, setLocalView] = useState('heatmap');

  const view = useMemo(() => {
    const raw = searchParams.get('view');
    return LIVE_MAP_VIEWS.includes(raw) ? raw : localView;
  }, [searchParams, localView]);

  const deepLink = useMemo(() => readDeepLinkFromParams(searchParams), [searchParams]);

  // 默认进入观测舱；带 ?view= 的旧深链或 ?mode=workbench 进入研判工作台
  const mode = searchParams.get('mode') === 'workbench' || searchParams.get('view') ? 'workbench' : 'deck';

  const openWorkbench = useCallback(({ layer, province } = {}) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('mode', 'workbench');
      if (layer && layer !== 'composite') params.set('layer', layer);
      if (province) params.set('prov', province);
      return params;
    });
  }, [setSearchParams]);

  const openDeck = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('mode');
      params.delete('view');
      return params;
    });
  }, [setSearchParams]);

  // 观测舱自身写回 URL 时不重建；外部导航（同页内跳到另一条 ?prov= / ?cmp= 深链）时重挂载以应用新初始态
  const deckWroteRef = useRef(null);
  const deckSeenRef = useRef(searchParams.toString());
  const deckKeyRef = useRef(0);
  const qsNow = searchParams.toString();
  if (qsNow !== deckSeenRef.current) {
    if (qsNow !== deckWroteRef.current) deckKeyRef.current += 1;
    deckSeenRef.current = qsNow;
  }

  const onDeckState = useCallback(({ layer, province, compare }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (layer) params.set('layer', layer); else params.delete('layer');
      if (province) params.set('prov', province); else params.delete('prov');
      if (compare?.length) params.set('cmp', compare.join(',')); else params.delete('cmp');
      if (params.toString() === prev.toString()) return prev;
      deckWroteRef.current = params.toString();
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const setView = useCallback((id) => {
    const next = LIVE_MAP_VIEWS.includes(id) ? id : 'heatmap';
    setLocalView(next);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (!next || next === 'heatmap') params.delete('view');
      else params.set('view', next);
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const onDeepLinkChange = useCallback(({ province, layer }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      writeDeepLinkToParams(params, { province, layer });
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const hashPath = window.location.hash.split('?')[0] || '#/shenzhou-live';
    const qs = searchParams.toString();
    return `${window.location.origin}${window.location.pathname}${window.location.search}${hashPath}${qs ? `?${qs}` : ''}`;
  }, [searchParams]);

  if (mode === 'deck') {
    return (
      <ShenzhouDeck
        key={deckKeyRef.current}
        initialLayer={deepLink.layer || 'composite'}
        initialProvince={deepLink.province || null}
        initialCompare={(searchParams.get('cmp') || '').split(',').filter(Boolean)}
        onStateChange={onDeckState}
        onOpenWorkbench={openWorkbench}
      />
    );
  }

  return (
    <div className="ink-observatory lcm-wrap lcm-page-wrap os-content-fluid">
      <PageHeader
        badge="Dashboard · 省级动态 · 图层架构"
        title="神州活图"
        subtitle={`省级边界热力 · 实况气象/空气图层 · 截至 ${AS_OF}`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <button type="button" className="os-btn os-btn-sm" onClick={openDeck}>返回观测舱</button>
          <Link to="/dashboard" className="lcm-cross-chip">中枢看板 ↗</Link>
          <Link to="/econ-dashboard?tab=regional" className="lcm-cross-chip">经济大盘 · 区域 ↗</Link>
          <Link to="/modules/heshan/factsheets" className="lcm-cross-chip lcm-cross-chip--red">重构河山 · 拟省图 ↗</Link>
          <Link to="/modules/signal-panel" className="lcm-cross-chip lcm-cross-chip--amber">宏观信号灯 ↗</Link>
          <Link to="/regional" className="lcm-cross-chip">区域协调 ↗</Link>
        </div>
      </PageHeader>

      <LiveMapTicker
        layerId={deepLink.layer || 'composite'}
        className="mb-4"
      />

      <div className="lcm-sticky-nav">
        <TabBar tabs={TABS} value={view} onChange={setView} accent="var(--cyber-cyan)" sticky className="lcm-tab-bar" />
      </div>

      <div className="os-reveal-stagger">
        <LiveChinaMap
          variant="full"
          view={view}
          deepLink={deepLink}
          onDeepLinkChange={onDeepLinkChange}
        />
      </div>

      {(deepLink.province || deepLink.layer) && (
        <p className="text-[10px] mono mt-3 px-1" style={{ color: 'var(--text-tertiary)' }}>
          深链状态：
          {deepLink.province && <span style={{ color: 'var(--cyber-cyan)' }}> {deepLink.province}</span>}
          {deepLink.layer && <span> · 图层 {deepLink.layer}</span>}
          {shareUrl && (
            <button
              type="button"
              className="ml-2 underline"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => navigator.clipboard?.writeText(shareUrl)}
            >
              复制分享链接
            </button>
          )}
        </p>
      )}

      <FrameworkTrio cards={[
        {
          title: '空间政治', subtitle: '尺度 · 边界 · 转移', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '省级区划不是自然地理单元，而是治理半径与财政能力的折中。热力图上的高低差，往往映射转移支付、战略带叠加与口岸位置的复合效应。',
          pillars: [['尺度', '治理半径决定虹吸。'], ['边界', '省界即财政界。'], ['对流', '要素沿梯度流动。']],
        },
        {
          title: '图层即视角', subtitle: '同一国土 · 多重读数', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '经济热度、能源负荷、风险态势与实况观测是同一空间的不同投影。切换图层不是换皮肤，是换判读框架——综合态势加权，实况层即时快照。',
          pillars: [['种子', '公报量级示意。'], ['实测', 'Open-Meteo 等。'], ['叠加', '财政/云图/空情。']],
        },
        {
          title: '时间轴对比', subtitle: '谁在升温 · 谁在降温', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '12 月回放与 Δ 环比模式揭示结构变迁：不是看某一时刻的绝对值，而是看相对基线的偏移。象限研判把两维指标交叉，定位极端省份。',
          pillars: [['回放', '12 月序列。'], ['环比', 'Δ12 月分色。'], ['象限', '双指标交叉。']],
        },
      ]} />

      <ModuleFooter
        moduleId="shenzhou-live"
        disclaimer="公开统计梳理 · 示意标定 · 非官方发布 · 实况观测为第三方公开接口（非官方权威发布）"
        sourceNote={`数据说明：统计公报种子层 · 本地省界边界 · Open-Meteo / OpenAQ / USGS 等公开源 · 截至 ${AS_OF}`}
      />
    </div>
  );
}
