import React, { useCallback, useEffect, useRef } from 'react';
import {
  buildTileUrl, estimateTileZoom, getVisibleTileRange, tileBounds,
  isChartReadyForGeo, safeConvertToPixel,
} from './liveSatellite.js';

/**
 * DOM 瓦片叠加层 — 与 ECharts geo 漫游/缩放同步
 * @param {{ chart: import('echarts').ECharts | null, config: object | null, visible: boolean, opacity: number, theme: string }} props
 */
export default function SatelliteCloudOverlay({ chart, config, visible, opacity, theme }) {
  const layerRef = useRef(null);
  const tileElsRef = useRef(new Map());

  const effectiveOpacity = opacity * (theme === 'light' ? 0.82 : 1);

  const clearTiles = useCallback(() => {
    const layer = layerRef.current;
    if (layer) layer.innerHTML = '';
    tileElsRef.current.clear();
  }, []);

  const syncTiles = useCallback(() => {
    const layer = layerRef.current;
    if (!layer || !chart || !config || !visible) {
      clearTiles();
      return;
    }

    // 宽高为 0、实例已销毁、或 geo 尚未 setOption 完成时跳过，避免 queryComponents 崩溃
    if (!isChartReadyForGeo(chart)) {
      return;
    }

    let rawZ;
    let range;
    try {
      rawZ = estimateTileZoom(chart);
      const maxZ = config.maxZoom || 7;
      const z = Math.min(rawZ, maxZ);
      range = getVisibleTileRange(chart, z);
    } catch {
      return;
    }

    const z = range.z;
    const needed = new Set();

    for (let x = range.xMin; x <= range.xMax; x += 1) {
      for (let y = range.yMin; y <= range.yMax; y += 1) {
        const key = `${z}/${x}/${y}`;
        needed.add(key);
        const bounds = tileBounds(x, y, z);
        const nw = safeConvertToPixel(chart, [bounds.west, bounds.north]);
        const se = safeConvertToPixel(chart, [bounds.east, bounds.south]);
        if (!nw || !se) continue;

        const left = nw[0];
        const top = nw[1];
        const width = se[0] - nw[0];
        const height = se[1] - nw[1];
        if (width < 2 || height < 2) continue;

        let img = tileElsRef.current.get(key);
        if (!img) {
          img = document.createElement('img');
          img.alt = '';
          img.decoding = 'async';
          img.loading = 'lazy';
          img.draggable = false;
          img.style.position = 'absolute';
          img.style.pointerEvents = 'none';
          img.style.objectFit = 'fill';
          tileElsRef.current.set(key, img);
          layer.appendChild(img);
        }

        const url = buildTileUrl(config, z, x, y);
        if (url && img.dataset.src !== url) {
          img.dataset.src = url;
          img.src = url;
        }

        img.style.left = `${left}px`;
        img.style.top = `${top}px`;
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
      }
    }

    for (const [key, el] of tileElsRef.current) {
      if (!needed.has(key)) {
        el.remove();
        tileElsRef.current.delete(key);
      }
    }
  }, [chart, config, visible, clearTiles]);

  useEffect(() => {
    if (!chart || !visible) {
      clearTiles();
      return undefined;
    }

    const onRoam = () => syncTiles();
    const onFinished = () => syncTiles();
    chart.on('georoam', onRoam);
    chart.on('finished', onFinished);

    const dom = chart.getDom?.();
    const ro = dom ? new ResizeObserver(() => {
      // 布局未完成（宽高 0）时不强制 sync，等下次有效尺寸
      if (isChartReadyForGeo(chart)) syncTiles();
    }) : null;
    if (dom && ro) ro.observe(dom);

    const raf = requestAnimationFrame(syncTiles);

    return () => {
      cancelAnimationFrame(raf);
      try {
        chart.off('georoam', onRoam);
        chart.off('finished', onFinished);
      } catch { /* disposed */ }
      ro?.disconnect();
    };
  }, [chart, visible, syncTiles, clearTiles]);

  useEffect(() => {
    syncTiles();
  }, [config, syncTiles]);

  if (!visible) return null;

  return (
    <div
      ref={layerRef}
      className="lcm-satellite-overlay"
      style={{ opacity: effectiveOpacity }}
      aria-hidden
    />
  );
}
