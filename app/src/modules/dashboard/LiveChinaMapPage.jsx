import React from 'react';
import { PageHeader } from '../../app/ui.jsx';
import LiveChinaMap from './LiveChinaMap.jsx';
import { AS_OF, LAYERS } from './liveMapData.js';

export default function LiveChinaMapPage() {
  return (
    <div className="ink-observatory lcm-page-wrap os-content-fluid space-y-6">
      <PageHeader
        badge="省级动态 · 图层架构"
        title="神州活图"
        subtitle="网络区划边界 · 可扩展图层 · 财政自给网络层 · 时间轴对比"
      />
      <p className="text-xs max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
        省界底图优先从阿里云 DataV API 加载（失败时经 Worker 代理或本地 GeoJSON 兜底）。
        覆盖 {LAYERS.length} 个种子指标层 + 实测气象/空气层；图层控制面板可开关省名标注、财政自给率着色、迁徙弧线、省会点位等叠加层。
        AS_OF {AS_OF}。
      </p>
      <LiveChinaMap variant="full" />
    </div>
  );
}
