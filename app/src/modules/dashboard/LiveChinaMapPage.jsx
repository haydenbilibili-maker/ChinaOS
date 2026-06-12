import React from 'react';
import { PageHeader } from '../../app/ui.jsx';
import LiveChinaMap from './LiveChinaMap.jsx';
import { AS_OF, LAYERS } from './liveMapData.js';

export default function LiveChinaMapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="省级动态 · 十二层指标"
        title="神州活图"
        subtitle="产业投资 · 科创密度 · 口岸流量 · 电力碳排 · 文旅消费 · 风险态势"
      />
      <p className="text-xs max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
        覆盖 {LAYERS.length} 个省级分层指标，支持区域缩放、12 月时间轴回放、双省对比与省份详情雷达。
        数据为内置种子示意（AS_OF {AS_OF}），模拟动态抖动仅供「实时」氛围演示，非真实 API 推送。
      </p>
      <LiveChinaMap variant="full" />
    </div>
  );
}
