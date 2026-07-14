import React, { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, TabBar } from '../../app/ui.jsx';
import { IntroCard, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import LiveChinaMap from './LiveChinaMap.jsx';
import { AS_OF, LAYERS } from './liveMapData.js';
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
// URL 深链：?prov=广东省&layer=economy&view=heatmap
// ============================================================================

export { LIVE_MAP_VIEWS };

const TABS = [
  { id: 'situation', label: '全国态势', accent: 'var(--cyber-cyan)' },
  { id: 'heatmap', label: '区域热力', accent: '#10b981' },
  { id: 'signals', label: '信号图层', accent: 'var(--fire-gold)' },
  { id: 'timeline', label: '时间轴', accent: '#8b5cf6' },
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

  return (
    <div className="ink-observatory lcm-wrap lcm-page-wrap os-content-fluid">
      <PageHeader
        badge="Dashboard · 省级动态 · 图层架构"
        title="神州活图"
        subtitle={`本地省界优先 · 可分享深链 · 财政自给网络层 · 截至 ${AS_OF}`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/dashboard" className="lcm-cross-chip">中枢看板 ↗</Link>
          <Link to="/econ-dashboard?tab=regional" className="lcm-cross-chip">经济大盘 · 区域 ↗</Link>
          <Link to="/modules/heshan/factsheets" className="lcm-cross-chip lcm-cross-chip--red">重构河山 · 拟省图 ↗</Link>
          <Link to="/modules/signal-panel" className="lcm-cross-chip lcm-cross-chip--amber">宏观信号灯 ↗</Link>
          <Link to="/regional" className="lcm-cross-chip">区域协调 ↗</Link>
        </div>
      </PageHeader>

      <IntroCard className="lcm-intro mb-5">
        省界底图<strong style={{ color: 'var(--text-primary)' }}>优先从本地 bundled GeoJSON 加载</strong>（<code className="mono text-[10px]">/geo/china-100000.json</code>），
        失败时经 Worker 代理或 DataV 回退。
        覆盖 <strong style={{ color: 'var(--text-primary)' }}>{LAYERS.length} 个种子指标层</strong> + 实测气象/空气/地震/空情/航运/卫星云图层；
        支持 URL 深链分享：<span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>?prov=广东省&amp;layer=economy</span>
        <span className="mono" style={{ color: 'var(--text-tertiary)' }}> · 口径：公开统计梳理 · 示意标定 · 非官方发布</span>
      </IntroCard>

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
        disclaimer="公开统计梳理 · 示意标定 · 非官方发布 · 实况 API 为第三方观测"
        sourceNote={`数据源：统计公报种子 · 本地省界 GeoJSON · Open-Meteo/OpenAQ/USGS · 截至 ${AS_OF}`}
      />
    </div>
  );
}
