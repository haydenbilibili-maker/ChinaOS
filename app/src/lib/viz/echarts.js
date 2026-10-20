// ============================================================================
// ECharts 按需入口：全站唯一的 echarts 引入点。
// 只注册代码里实际出现的 18 种系列 + 常用组件，避免整包进入每个图表 chunk。
// 新增图表类型时在这里补注册——未注册的系列在生产构建里会静默不渲染。
// 清单核对：grep -rhoE "type: ?'(line|bar|...)'" src
// ============================================================================
import * as echarts from 'echarts/core';
import {
  BarChart, CustomChart, EffectScatterChart, FunnelChart, GaugeChart, GraphChart, HeatmapChart,
  LineChart, LinesChart, MapChart, ParallelChart, PieChart, RadarChart, SankeyChart, ScatterChart,
  SunburstChart, TreeChart, TreemapChart,
} from 'echarts/charts';
import {
  AriaComponent, AxisPointerComponent, CalendarComponent, DataZoomComponent, DatasetComponent,
  GeoComponent, GraphicComponent, GridComponent, LegendComponent, MarkAreaComponent,
  MarkLineComponent, MarkPointComponent, ParallelComponent, PolarComponent, RadarComponent,
  SingleAxisComponent, TimelineComponent, TitleComponent, ToolboxComponent, TooltipComponent,
  TransformComponent, VisualMapComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

/** 已注册的系列类型（供单测核对源码里出现的 type） */
export const REGISTERED_SERIES = [
  'bar', 'custom', 'effectScatter', 'funnel', 'gauge', 'graph', 'heatmap', 'line', 'lines', 'map',
  'parallel', 'pie', 'radar', 'sankey', 'scatter', 'sunburst', 'tree', 'treemap',
];

echarts.use([
  BarChart, CustomChart, EffectScatterChart, FunnelChart, GaugeChart, GraphChart, HeatmapChart,
  LineChart, LinesChart, MapChart, ParallelChart, PieChart, RadarChart, SankeyChart, ScatterChart,
  SunburstChart, TreeChart, TreemapChart,
  AriaComponent, AxisPointerComponent, CalendarComponent, DataZoomComponent, DatasetComponent,
  GeoComponent, GraphicComponent, GridComponent, LegendComponent, MarkAreaComponent,
  MarkLineComponent, MarkPointComponent, ParallelComponent, PolarComponent, RadarComponent,
  SingleAxisComponent, TimelineComponent, TitleComponent, ToolboxComponent, TooltipComponent,
  TransformComponent, VisualMapComponent,
  LabelLayout, UniversalTransition,
  CanvasRenderer, SVGRenderer,
]);

export { echarts };
export default echarts;
