import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// ============================================================================
// 可视化引擎核心 · ECharts 封装
// ----------------------------------------------------------------------------
// 统一的图表组件：传入 option 即渲染，自动处理 resize 与 dispose（防内存泄漏）。
// 地图、雷达、热力、关系图等都走同一封装，主题统一为暗色科技感。
// 用法：<EChart option={option} style={{height: 320}} />
// ============================================================================

const DARK_TEXT = '#93a1b5';

// 注入统一暗色基调，模块只需关心数据
function withTheme(option) {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: DARK_TEXT, fontFamily: 'system-ui, sans-serif' },
    ...option,
  };
}

export default function EChart({ option, style, className, onReady }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    if (onReady) onReady(chart);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // 仅在挂载时初始化；option 更新走下面的 effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chartRef.current && option) {
      chartRef.current.setOption(withTheme(option), true);
    }
  }, [option]);

  return <div ref={ref} className={className} style={{ width: '100%', height: 300, ...style }} />;
}
