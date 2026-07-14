import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { LoadingSkeleton } from '../../app/ui.jsx';
import { applyChartTheme, chartTextColor, CHART_TOOLTIP } from '../../modules/shared/chartHelpers.js';
import { getTheme, THEME_EVENT } from '../theme.js';

// ============================================================================
// 可视化引擎核心 · ECharts 封装
// ----------------------------------------------------------------------------
// 统一的图表组件：传入 option 即渲染，自动处理 resize 与 dispose（防内存泄漏）。
// 地图、雷达、热力、关系图等都走同一封装，主题随日/夜切换即时重渲染。
// variant: default | compact | dashboard — 控制默认高度与动画节奏
// 用法：<EChart option={option} variant="compact" />
// ============================================================================

const VARIANT_PRESETS = {
  default: { height: 300, animationDuration: 500, fontSize: 11 },
  compact: { height: 200, animationDuration: 400, fontSize: 10 },
  dashboard: { height: 360, animationDuration: 600, fontSize: 11 },
};

function animationDuration(baseMs) {
  if (typeof window === 'undefined') return baseMs;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : baseMs;
}

function seriesHasData(series) {
  if (!series) return false;
  const list = Array.isArray(series) ? series : [series];
  return list.some((s) => {
    const data = s?.data;
    if (Array.isArray(data)) return data.length > 0;
    if (data && typeof data === 'object') return Object.keys(data).length > 0;
    return false;
  });
}

export function isChartOptionEmpty(option) {
  if (!option) return true;
  if (seriesHasData(option.series)) return false;
  if (option.dataset?.source?.length) return false;
  if (option.dataset?.length) return false;
  return true;
}

// 注入统一基调，文本色随主题取自共享调色板；模块只需关心数据
function withTheme(option, variant = 'default') {
  const preset = VARIANT_PRESETS[variant] || VARIANT_PRESETS.default;
  const anim = animationDuration(preset.animationDuration);
  const base = {
    backgroundColor: 'transparent',
    textStyle: {
      color: chartTextColor(),
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
      fontSize: preset.fontSize,
    },
    animationDuration: anim,
    animationDurationUpdate: anim,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
  };
  const merged = { ...base, ...option };
  if (merged.tooltip && typeof merged.tooltip === 'object') {
    merged.tooltip = { ...CHART_TOOLTIP, ...merged.tooltip };
  } else if (option?.series?.length) {
    merged.tooltip = { ...CHART_TOOLTIP };
  }
  return merged;
}

export default function EChart({
  option,
  style,
  className,
  onReady,
  variant = 'default',
  emptyTitle = '暂无图表数据',
  emptyDescription,
  loading = false,
  loadingLabel = '图表加载中…',
}) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const optionRef = useRef(option);
  const variantRef = useRef(variant);
  const preset = VARIANT_PRESETS[variant] || VARIANT_PRESETS.default;
  const isEmpty = isChartOptionEmpty(option);

  useEffect(() => {
    if (!ref.current || isEmpty) return undefined;
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    if (onReady) onReady(chart);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);

    // 主题切换：更新共享调色板后以最新文本色重绘当前 option
    const onTheme = () => {
      applyChartTheme(getTheme());
      if (chartRef.current && optionRef.current) {
        chartRef.current.setOption(withTheme(optionRef.current, variantRef.current), true);
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
  }, [isEmpty]);

  useEffect(() => {
    optionRef.current = option;
    variantRef.current = variant;
    if (isEmpty) {
      chartRef.current?.dispose();
      chartRef.current = null;
      return;
    }
    if (chartRef.current && option) {
      chartRef.current.setOption(withTheme(option, variant), true);
    }
  }, [option, variant, isEmpty]);

  if (loading) {
    return (
      <div
        className={`os-chart os-chart--${variant} os-chart--loading ${className || ''}`.trim()}
        style={{ width: '100%', height: preset.height, ...style }}
        role="status"
        aria-live="polite"
      >
        <LoadingSkeleton rows={3} label={loadingLabel} className="os-chart-loading-skeleton" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={`os-chart os-chart--${variant} os-chart--empty ${className || ''}`.trim()}
        style={{ width: '100%', height: preset.height, ...style }}
        role="status"
      >
        <span className="os-chart-empty__title">{emptyTitle}</span>
        {emptyDescription ? <span className="os-chart-empty__desc">{emptyDescription}</span> : null}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`os-chart os-chart--${variant} os-chart-enter ${className || ''}`.trim()}
      style={{ width: '100%', height: preset.height, ...style }}
    />
  );
}
