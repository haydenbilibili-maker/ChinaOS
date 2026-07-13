import React from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

// ============================================================================
// ⑱ 价值观与驱动力 · 为什么这样选
// ----------------------------------------------------------------------------
// 自包含组件：把「为什么这样选」拆成两张图——左侧六维驱动力雷达（自主性/影响力
// 最高，正解释了 fork 创业与回迁的两次逆向下注）；右侧 35 岁回迁创业期的
// 时间·精力分配 donut（创业吃掉大半，健康与社交被挤压）。
// 口径：私享自画像 · 本人自述 · 自评示意标定 · 非预测非承诺。
// ============================================================================


// —— 驱动力六维（自评示意 0-100）——
const DRIVE_DIMS = ['自主性', '影响力', '意义感', '成长', '安全感', '连接'];
const DRIVE_VALUE = [95, 88, 82, 78, 42, 58];
const DRIVE_COLOR = '#8b5cf6';

// —— 时间·精力分配（35 岁回迁创业期现状示意，合计 100）——
const ALLOC = [
  { name: '创业', value: 46, color: '#c41e3a' },
  { name: '家庭', value: 20, color: '#10b981' },
  { name: '学习', value: 16, color: '#22d3ee' },
  { name: '健康', value: 10, color: '#e8a317' },
  { name: '社交', value: 8, color: '#94a3b8' },
];

function radarOption() {
  return {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: DRIVE_DIMS.map((d) => ({ name: d, max: 100 })),
      radius: '66%',
      axisName: { color: LABEL.color, fontSize: 11 },
      splitLine: { lineStyle: { color: GRID_LINE.lineStyle.colorStrong } },
      axisLine: { lineStyle: { color: GRID_LINE.lineStyle.color } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [{
        name: '驱动力强度', value: DRIVE_VALUE,
        lineStyle: { color: DRIVE_COLOR, width: 2 },
        itemStyle: { color: DRIVE_COLOR },
        areaStyle: { color: DRIVE_COLOR, opacity: 0.14 },
      }],
    }],
  };
}

function donutOption() {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 11 }, icon: 'circle', data: ALLOC.map((a) => a.name) },
    series: [{
      type: 'pie', radius: ['46%', '70%'], center: ['50%', '44%'],
      avoidLabelOverlap: true,
      label: { show: true, formatter: '{b}\n{c}%', color: LABEL.color, fontSize: 10, lineHeight: 14 },
      labelLine: { length: 8, length2: 8, lineStyle: { color: GRID_LINE.lineStyle.color } },
      itemStyle: { borderColor: 'var(--bg-base, #0b1220)', borderWidth: 2 },
      data: ALLOC.map((a) => ({ name: a.name, value: a.value, itemStyle: { color: a.color } })),
    }],
  };
}

export default function SectionValues() {
  return (
    <Card title="⑱ 价值观与驱动力 · 为什么这样选" className="mt-6">
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div>
          <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>// 驱动力 · 六维内核</div>
          <EChart option={radarOption()} style={{ height: 320 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            <span style={{ color: '#8b5cf6' }}>自主性 + 影响力</span> 是两根最高的轴——这解释了两次逆向下注：从打工的确定性 fork 出自负盈亏的创业，是要回收「调度权」；从一线回迁长春，是要在自己能定义边界的盘面上做事。安全感这一轴明显塌陷，正是 35 岁这次时钟中断里迷茫的来源。
          </p>
        </div>
        <div>
          <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>// 时间·精力 · 回迁创业期现状</div>
          <EChart option={donutOption()} style={{ height: 320 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            张力：创业吃掉近一半的盘子，把 <span style={{ color: '#e8a317' }}>健康</span> 与 <span style={{ color: '#94a3b8' }}>社交</span> 一起压到了最薄——短期是冲刺的必要代价，长期却是会反噬现金流安全边际的隐性透支。
          </p>
        </div>
      </div>
      <p className="text-[11px] mt-4 pt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)' }}>
        私享自画像 · 本人自述 · 驱动力与精力分配为自评示意标定 · 非预测、非承诺。
      </p>
    </Card>
  );
}
