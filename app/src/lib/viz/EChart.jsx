import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { applyChartTheme, chartTextColor, CHART_TOOLTIP } from '../../modules/shared/chartHelpers.js';
import { getTheme, THEME_EVENT } from '../theme.js';

// ============================================================================
// 可视化引擎核心 · ECharts 封装
// ----------------------------------------------------------------------------
// 统一的图表组件：传入 option 即渲染，自动处理 resize 与 dispose（防内存泄漏）。
// 地图、雷达、热力、关系图等都走同一封装，主题随日/夜切换即时重渲染。
// 用法：<EChart option={option} style={{height: 320}} />
// ============================================================================

// 注入统一基调，文本色随主题取自共享调色板；模块只需关心数据
function withTheme(option) {
  const base = {
    backgroundColor: 'transparent',
    textStyle: { color: chartTextColor(), fontFamily: 'var(--font-sans), system-ui, sans-serif', fontSize: 11 },
  };
  const merged = { ...base, ...option };
  if (merged.tooltip && typeof merged.tooltip === 'object') {
    merged.tooltip = { ...CHART_TOOLTIP, ...merged.tooltip };
  } else if (option?.series?.length) {
    merged.tooltip = { ...CHART_TOOLTIP };
  }
  return merged;
}

export default function EChart({ option, style, className, onReady }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const optionRef = useRef(option);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    if (onReady) onReady(chart);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);

    // 主题切换：更新共享调色板后以最新文本色重绘当前 option
    const onTheme = () => {
      applyChartTheme(getTheme());
      if (chartRef.current && optionRef.current) {
        chartRef.current.setOption(withTheme(optionRef.current), true);
      }
    };
    window.addEventListener(THEME_EVENT, onTheme);

    return () => {
      ro.disconnect();
      window.removeEventListener(THEME_EVENT, onTheme);
      chart.dispose();
      chartRef.current = null;
    };
    // 仅在挂载时初始化；option 更新走下面的 effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    optionRef.current = option;
    if (chartRef.current && option) {
      chartRef.current.setOption(withTheme(option), true);
    }
  }, [option]);

  return (
    <div
      ref={ref}
      className={`os-chart ${className || ''}`.trim()}
      style={{ width: '100%', height: 300, ...style }}
    />
  );
}
