import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import EChart from '../../lib/viz/EChart.jsx';
import { LoadingSkeleton, EmptyState } from '../../app/ui.jsx';
import { getTheme, subscribeTheme } from '../../lib/theme.js';
import { CHART_TOOLTIP, mapChoropleth, chartTextColor } from '../shared/chartHelpers.js';
import { HESHAN_AS_OF } from '../shared/heshanData.js';
import { loadHeshanReformGeo, HESHAN_MAP_NAME } from './heshanMapGeo.js';
import {
  getUnitMeta,
  metricForUnit,
} from './heshanProvinceGroups.js';

const METRICS = [
  { id: 'gdp', label: 'GDP', unit: '亿元' },
  { id: 'pop', label: '人口', unit: '万人' },
];

function formatMetric(v, metric) {
  if (v == null) return '—';
  if (metric === 'gdp' && v >= 10000) return `${(v / 10000).toFixed(1)} 万亿`;
  if (metric === 'gdp') return `${Math.round(v).toLocaleString()} 亿`;
  return `${Math.round(v).toLocaleString()} 万`;
}

function HeshanProvinceDrawer({ unitName, metric, onClose, onScrollToCard }) {
  const meta = getUnitMeta(unitName);
  if (!meta) return null;
  const m = METRICS.find((x) => x.id === metric);

  return (
    <aside
      className="heshan-province-drawer lcm-province-drawer"
      aria-label={`${unitName} 拟省档案`}
    >
      <div className="heshan-province-drawer__head">
        <div className="min-w-0">
          <h3 className="heshan-province-drawer__title">{unitName}</h3>
          <p className="heshan-province-drawer__sub">拟省单元 · {m?.label} 着色</p>
        </div>
        <button
          type="button"
          className="heshan-province-drawer__close"
          onClick={onClose}
          aria-label="关闭档案"
        >
          <Lucide.X size={15} />
        </button>
      </div>
      <div className="heshan-province-drawer__body">
        <div className="heshan-province-drawer__hero">
          <span className="heshan-province-drawer__hero-val">{formatMetric(meta.gdp, 'gdp')}</span>
          <span className="heshan-province-drawer__hero-unit">GDP</span>
        </div>
        <ul className="heshan-province-drawer__grid">
          <li>
            <span className="heshan-province-drawer__k">人口</span>
            <span className="heshan-province-drawer__v">{formatMetric(meta.pop, 'pop')}</span>
          </li>
          <li>
            <span className="heshan-province-drawer__k">财政成本</span>
            <span className="heshan-province-drawer__v">{formatMetric(meta.cost, 'gdp')}</span>
          </li>
          <li>
            <span className="heshan-province-drawer__k">{m?.label}</span>
            <span className="heshan-province-drawer__v">{formatMetric(metricForUnit(unitName, metric), metric)}</span>
          </li>
        </ul>
        <button
          type="button"
          className="heshan-province-drawer__cta"
          onClick={() => onScrollToCard?.(meta.slug, unitName)}
        >
          定位建省档案
          <Lucide.ArrowDown size={12} />
        </button>
      </div>
    </aside>
  );
}

export default function HeshanFactsheetMap({ onSelectUnit }) {
  const chartRef = useRef(null);
  const [metric, setMetric] = useState('gdp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featureMeta, setFeatureMeta] = useState([]);
  const [geoMeta, setGeoMeta] = useState(null);
  const [theme, setThemeState] = useState(getTheme);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => subscribeTheme(setThemeState), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadHeshanReformGeo()
      .then((meta) => {
        if (!cancelled) {
          setFeatureMeta(meta.features || []);
          setGeoMeta(meta);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message || '地图边界加载失败');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const light = theme === 'light';

  const seriesData = useMemo(() => {
    const keptFill = light ? 'rgba(51,71,74,0.16)' : 'rgba(90,120,125,0.28)';
    const keptBorder = light ? '#9a7b3f' : '#5a7a7e';
    const unmappedFill = light ? 'rgba(124,114,100,0.2)' : 'rgba(74,85,104,0.5)';

    return featureMeta.map((f) => {
      if (f.kept) {
        return {
          name: f.name,
          value: null,
          kept: true,
          itemStyle: { areaColor: keptFill, borderColor: keptBorder, borderWidth: 0.8 },
          emphasis: { itemStyle: { areaColor: light ? 'rgba(154,123,63,0.35)' : 'rgba(90,154,142,0.45)' } },
        };
      }
      const val = f.unit ? metricForUnit(f.unit, metric) : null;
      const selected = f.slug && f.slug === selectedSlug;
      const base = {
        name: f.name,
        value: val ?? 0,
        unitName: f.unit,
        slug: f.slug,
        itemStyle: selected
          ? { borderColor: light ? '#9e2b25' : '#e07068', borderWidth: 1.5 }
          : undefined,
      };
      if (!f.unit) {
        base.itemStyle = { ...(base.itemStyle || {}), areaColor: unmappedFill };
        base.value = null;
      }
      return base;
    });
  }, [featureMeta, metric, light, selectedSlug]);

  const metricValues = seriesData.map((d) => d.value).filter((v) => v != null && v > 0);
  const minV = metricValues.length ? Math.min(...metricValues) : 0;
  const maxV = metricValues.length ? Math.max(...metricValues) : 1;
  const palette = useMemo(() => mapChoropleth(light ? 'light' : 'dark'), [light]);

  const option = useMemo(() => {
    const muted = light ? '#7c7264' : '#8a8278';
    const line = light ? '#cdc0a9' : '#3a4548';

    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...CHART_TOOLTIP,
        trigger: 'item',
        formatter(params) {
          const d = params?.data || {};
          if (d.kept) {
            return `<b>${params.name.replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区)/g, '')}</b><br/>保留单元 · 未纳入 34 拟省底表`;
          }
          if (!d.unitName) {
            return `<b>${params.name}</b><br/><span style="color:${muted}">未映射地级单元（示意归并）</span>`;
          }
          const m = METRICS.find((x) => x.id === metric);
          return [
            `<b>${d.unitName}</b>`,
            params.name,
            `${m.label}：${formatMetric(d.value, metric)}`,
          ].join('<br/>');
        },
      },
      visualMap: {
        type: 'continuous',
        min: minV,
        max: maxV,
        calculable: false,
        show: false,
        inRange: { color: palette },
        seriesIndex: 0,
      },
      series: [
        {
          type: 'map',
          map: HESHAN_MAP_NAME,
          roam: true,
          scaleLimit: { min: 0.85, max: 6 },
          zoom: 1.12,
          center: [104.5, 36.2],
          selectedMode: 'single',
          label: { show: false, fontSize: 9, color: chartTextColor() },
          emphasis: {
            label: { show: true, fontSize: 10, color: chartTextColor() },
            itemStyle: { areaColor: light ? '#9e2b25' : '#d06058', borderWidth: 1.2 },
          },
          itemStyle: {
            borderColor: line,
            borderWidth: 0.55,
          },
          data: seriesData,
        },
      ],
    };
  }, [light, metric, minV, maxV, palette, seriesData]);

  const handleReady = useCallback((chart) => {
    chartRef.current = chart;
    chart.off('click');
    chart.on('click', (params) => {
      const slug = params?.data?.slug;
      const unitName = params?.data?.unitName;
      if (!slug) return;
      setSelectedSlug(slug);
      setSelectedUnit(unitName || null);
      onSelectUnit?.(slug, unitName);
    });
  }, [onSelectUnit]);

  const closeDrawer = useCallback(() => {
    setSelectedSlug(null);
    setSelectedUnit(null);
  }, []);

  const activeMetric = METRICS.find((x) => x.id === metric);

  return (
    <section className="heshan-map-section wrap reveal" aria-label="拟省合并示意地图">
      <div className="heshan-map-head">
        <div>
          <h2>拟省<span className="accent">合并示意</span></h2>
          <p className="heshan-map-sub">
            地级边界按校准底表归并着色 · 保留单元以省级面示 · 数据截至 {HESHAN_AS_OF}
          </p>
        </div>
        <div className="heshan-map-controls" role="group" aria-label="指标切换">
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`heshan-map-toggle${metric === m.id ? ' is-active' : ''}`}
              onClick={() => setMetric(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`heshan-map-shell${loading ? ' is-loading' : ''}${error ? ' has-error' : ''}${selectedUnit ? ' has-drawer' : ''}`}>
        {loading && (
          <div className="heshan-map-status heshan-map-status--skeleton" role="status" aria-live="polite">
            <LoadingSkeleton rows={3} label="边界加载中…" className="heshan-map-skeleton" />
          </div>
        )}
        {error && (
          <div className="heshan-map-status is-error">
            <EmptyState title="地图边界加载失败" description={error} />
          </div>
        )}
        {!loading && !error && featureMeta.length === 0 && (
          <div className="heshan-map-status">
            <EmptyState title="暂无边界要素" description="拟省底表未返回可渲染面，请稍后重试。" />
          </div>
        )}
        {!error && featureMeta.length > 0 && (
          <>
            <EChart
              option={option}
              variant="dashboard"
              className="heshan-map-chart"
              style={{ height: 'min(62vh, 520px)', minHeight: 320 }}
              onReady={handleReady}
            />
            <div className="heshan-map-legend" role="img" aria-label={`${activeMetric?.label} 色带图例`}>
              <span className="heshan-map-legend__label">{activeMetric?.label}</span>
              <div className="heshan-map-legend__track">
                <div
                  className="heshan-map-legend__bar"
                  style={{ background: `linear-gradient(90deg, ${palette.join(', ')})` }}
                />
              </div>
              <div className="heshan-map-legend__ends">
                <span>{formatMetric(minV, metric)}</span>
                <span>{formatMetric(maxV, metric)}</span>
              </div>
            </div>
          </>
        )}
        {selectedUnit && !loading && !error && (
          <HeshanProvinceDrawer
            unitName={selectedUnit}
            metric={metric}
            onClose={closeDrawer}
            onScrollToCard={onSelectUnit}
          />
        )}
        <div className="heshan-map-foot">
          <span>底图 geo.datav.aliyun.com · Worker 代理兜底</span>
          <span>点击拟省区域打开档案抽屉</span>
          {geoMeta?.featureCount ? <span>{geoMeta.featureCount} 个面要素</span> : null}
        </div>
      </div>
    </section>
  );
}
