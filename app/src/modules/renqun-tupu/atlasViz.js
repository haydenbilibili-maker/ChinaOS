/**
 * 人群画像总图谱 · 多维坐标合成与图表选项
 * ------------------------------------------------------------------
 * 纯数据 + 纯函数模块。零 React、零随机、零当前时间。
 * 把稀疏的 8 轴 + 簇元数据，合成为「每个切片的 8 维连续坐标」，
 * 供多维立体（伪 3D 等距投影）、平行坐标、簇雷达三类图表绘制。
 *
 * 口径：人群画像为公开结构分析框架·示意标定·非真实人事评价·非投资建议。
 * 确定性铁律：所有派生只依赖静态数据与编号字符串哈希，不读时间、不用随机。
 *
 * 数据源（只读，勿改）：
 *   ../../lib/renqun-tupu/atlasData.js → ATLAS_AXES / ATLAS_CLUSTERS
 *   ../../lib/gy/registry.js          → GY_MODULES / POPULATION_SLICE_GY_NUMS
 */

import { ATLAS_AXES, ATLAS_CLUSTERS } from '../../lib/renqun-tupu/atlasData.js';
import { GY_MODULES, POPULATION_SLICE_GY_NUMS } from '../../lib/gy/registry.js';

/* ============================================================
 * 0. 色板（与项目主壳一致，循环使用）
 * ============================================================ */
const PALETTE = [
  '#c41e3a',
  '#22d3ee',
  '#e8a317',
  '#10b981',
  '#8b5cf6',
  '#fb923c',
  '#64748b',
];

/* 轴框线 / 网格 / 标签色 */
const AXIS_LINE = '#27324a';
const AXIS_LABEL = '#93a1b5';
const GRID_FILL = 'rgba(148,163,184,0.1)';

/* ============================================================
 * 1. 八个分析维度 SPACE_DIMS
 *    前 5 维映射到 ATLAS_AXES（按 name 模糊匹配），后 3 维从元数据派生。
 * ============================================================ */

/** 按子串模糊匹配 ATLAS_AXES.name，返回命中的轴 name 或 null */
function matchAxisName(keyword) {
  const hit = ATLAS_AXES.find((ax) => ax.name.includes(keyword));
  return hit ? hit.name : null;
}

/**
 * @typedef {{ id:string, label:string, sub:string, axisName:(string|null) }} SpaceDim
 * @type {SpaceDim[]}
 */
export const SPACE_DIMS = [
  { id: 'class', label: '阶层位', sub: '塔尖 → 底层', axisName: matchAxisName('阶层') },
  { id: 'age', label: '年龄位', sub: '幼 → 终', axisName: matchAxisName('年龄') },
  { id: 'gender', label: '性别暴露', sub: '分叉 → 折叠', axisName: matchAxisName('性别') },
  { id: 'system', label: '体制距离', sub: '体制内 → 对照组', axisName: matchAxisName('政治') },
  { id: 'urbanRural', label: '城乡位', sub: '县域 → 流动 → 夹心', axisName: matchAxisName('城乡') },
  { id: 'exit', label: '退出能力', sub: '原地 → 离岸', axisName: null }, // 派生：退出轴 + extremal/退出/境外 tag
  { id: 'sensitivity', label: '敏感度', sub: '低 → 校准点', axisName: null }, // 派生：sens 字段
  { id: 'marginality', label: '边缘度', sub: '中心 → 末梢', axisName: null }, // 派生：簇序 + 底层/编外/兜底 tag
];

/* 维度 id → 下标，便于 build3DOption 取值 */
const DIM_INDEX = SPACE_DIMS.reduce((acc, d, i) => {
  acc[d.id] = i;
  return acc;
}, /** @type {Record<string,number>} */ ({}));

/* ============================================================
 * 2. 确定性工具
 * ============================================================ */

const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

/**
 * 编号字符串确定性哈希 → 落在 [lo, hi] 的稳定中段值。
 * 用于「不在任何轴上」时的插补，保证同一编号永远得到同一值。
 */
function stableMid(num, lo = 30, hi = 70) {
  const s = `GY-${num}`;
  let h = 2166136261; // FNV-1a 32bit 起始
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const frac = ((h >>> 0) % 1000) / 999; // [0,1] 确定性
  return clamp(lo + frac * (hi - lo));
}

/** 某轴上 num 的位置值：idx/(len-1)*100；轴只有一个节点则记 50 */
function axisPositionValue(axisName, num) {
  const ax = ATLAS_AXES.find((a) => a.name === axisName);
  if (!ax) return null;
  const idx = ax.nodes.findIndex((n) => n.num === num);
  if (idx < 0) return null;
  const len = ax.nodes.length;
  if (len <= 1) return 50;
  return clamp((idx / (len - 1)) * 100);
}

/* 退出轴 / 城乡轴 等的 name 缓存（用于插补的轴 tag 命中） */
const EXIT_AXIS_NAME = (() => {
  const hit = ATLAS_AXES.find((a) => a.name.includes('退出'));
  return hit ? hit.name : null;
})();

/* slice.num → slice 元数据 + 所属簇信息 的索引 */
const SLICE_META_BY_NUM = (() => {
  /** @type {Record<string,{meta:object, clusterIdx:number, head:string, posInCluster:number, clusterLen:number}>} */
  const map = {};
  ATLAS_CLUSTERS.forEach((cluster, clusterIdx) => {
    cluster.slices.forEach((meta, posInCluster) => {
      map[meta.num] = {
        meta,
        clusterIdx,
        head: cluster.head,
        posInCluster,
        clusterLen: cluster.slices.length,
      };
    });
  });
  return map;
})();

/* ============================================================
 *   派生维度规则（确定性）
 * ============================================================ */

/**
 * 退出能力维：
 *   1. 若在退出轴上 → 取轴位置；
 *   2. 否则 extremal 或 axes 含 退出/境外/离岸 tag → 高（80）；
 *   3. 否则按编号哈希落在 25-55 的低-中段（退出能力默认偏低）。
 */
function deriveExit(num, meta) {
  if (EXIT_AXIS_NAME) {
    const onAxis = axisPositionValue(EXIT_AXIS_NAME, num);
    if (onAxis !== null) return onAxis;
  }
  const tags = (meta && meta.axes) || [];
  const exitTag = tags.some((t) => /退出|境外|离岸|信用/.test(t));
  if ((meta && meta.extremal) || exitTag) return 80;
  return stableMid(num, 25, 55);
}

/**
 * 敏感度维：
 *   · sens 含 '校准点' → 92；
 *   · sens 含 '高'     → 80；
 *   · sens 含 '中高'   → 70;
 *   · sens 含 '敏' 或 '中' → 58；
 *   · sens 存在但其它（如 收官/情绪收束/前瞻）→ 45；
 *   · 无 sens → 编号哈希落在 15-40 的低-中段。
 */
function deriveSensitivity(num, meta) {
  const sens = meta && meta.sens;
  if (!sens) return stableMid(num, 15, 40);
  if (sens.includes('校准点')) return 92;
  if (sens.includes('高')) return 80;
  if (sens.includes('中高')) return 70;
  if (sens.includes('敏') || sens.includes('中')) return 58;
  return 45;
}

/**
 * 边缘度维：所属簇越靠后 + tag 越「底层/编外/兜底/末梢」越高。
 *   base = 簇序 / (簇数-1) * 60          （结构性：后批=末梢汇流）
 *   + tag 命中 底层/编外/兜底/末梢/救济/风险/流动 → +25
 *   + extremal（极值校准点，多为可见性零点/退出峰值等边缘极点）→ +10
 *   clamp[0,100]；若完全无簇信息（理论不该发生）→ 编号哈希中段。
 */
function deriveMarginality(num, ctx) {
  if (!ctx) return stableMid(num, 30, 70);
  const clusterCount = ATLAS_CLUSTERS.length;
  const base = clusterCount > 1 ? (ctx.clusterIdx / (clusterCount - 1)) * 60 : 30;
  const tags = (ctx.meta && ctx.meta.axes) || [];
  const marginTag = tags.some((t) => /底层|编外|兜底|末梢|救济|风险|流动|横切/.test(t));
  const blurb = (ctx.meta && ctx.meta.blurb) || '';
  const blurbMargin = /末梢|兜底|底端|最低|废墟|裸跑|边缘/.test(blurb);
  let v = base;
  if (marginTag) v += 25;
  if (blurbMargin) v += 12;
  if (ctx.meta && ctx.meta.extremal) v += 10;
  return clamp(v);
}

/* ============================================================
 * 2(主). sliceVectors() — 全部已上线切片的 8 维向量
 * ============================================================ */

/**
 * @typedef {{
 *   num:string, code:string, label:string, path:string,
 *   cluster:string, clusterIdx:number,
 *   vec:number[],            // 8 个 0-100，顺序同 SPACE_DIMS
 *   imputed:boolean[],       // 8 个，true=该维为插补/派生而非真实轴位
 *   extremal:boolean, sens:(string|undefined)
 * }} SliceVector
 */

/**
 * 计算全部已上线人群切片（POPULATION_SLICE_GY_NUMS）的 8 维连续坐标。
 *
 * 前 5 维（阶层/年龄/性别/体制/城乡）：
 *   · 若 slice.num 在该维对应轴的 nodes 中 → 轴位置 = idx/(len-1)*100（imputed=false）；
 *   · 不在轴上 → 看 slice.axes 是否命中该维相关 tag：命中给中高 72，否则按编号哈希落在 30-70 稳定中段（imputed=true）。
 * 后 3 维（退出/敏感度/边缘度）：见 deriveExit / deriveSensitivity / deriveMarginality（均标 imputed=true，因系派生量）。
 *
 * 顺序与编号一致（POPULATION_SLICE_GY_NUMS 已 sort）。
 * @returns {SliceVector[]}
 */
export function sliceVectors() {
  /* 前 5 维各自相关 tag（用于不在轴上时的插补判定） */
  const FRONT_DIM_TAGS = {
    class: ['阶层'],
    age: ['年龄', '老龄', '青年', '终点'],
    gender: ['性别', '照护'],
    system: ['体制内', '组织化', '治理', '政治', '内核', '编外'],
    urbanRural: ['城乡', '户籍', '流动'],
  };

  return POPULATION_SLICE_GY_NUMS.map((num) => {
    const mod = GY_MODULES[num] || { label: `GY-${num}`, path: '' };
    const ctx = SLICE_META_BY_NUM[num];
    const meta = ctx ? ctx.meta : null;
    const clusterIdx = ctx ? ctx.clusterIdx : -1;
    const head = ctx ? ctx.head : '（未归簇）';

    const vec = new Array(8).fill(0);
    const imputed = new Array(8).fill(false);

    /* 前 5 维 */
    for (const dim of SPACE_DIMS.slice(0, 5)) {
      const di = DIM_INDEX[dim.id];
      const onAxis = dim.axisName ? axisPositionValue(dim.axisName, num) : null;
      if (onAxis !== null) {
        vec[di] = onAxis;
        imputed[di] = false;
      } else {
        // 插补：tag 命中给中高，否则编号哈希稳定中段
        const tags = (meta && meta.axes) || [];
        const dimTags = FRONT_DIM_TAGS[dim.id] || [];
        const hit = tags.some((t) => dimTags.some((dt) => t.includes(dt)));
        vec[di] = hit ? 72 : stableMid(num, 30, 70);
        imputed[di] = true;
      }
    }

    /* 后 3 维（派生量） */
    vec[DIM_INDEX.exit] = deriveExit(num, meta);
    imputed[DIM_INDEX.exit] = true;
    vec[DIM_INDEX.sensitivity] = deriveSensitivity(num, meta);
    imputed[DIM_INDEX.sensitivity] = true;
    vec[DIM_INDEX.marginality] = deriveMarginality(num, ctx);
    imputed[DIM_INDEX.marginality] = true;

    return {
      num,
      code: `GY-${num}`,
      label: mod.label,
      path: mod.path,
      cluster: head,
      clusterIdx,
      vec: vec.map(clamp),
      imputed,
      extremal: !!(meta && meta.extremal),
      sens: meta ? meta.sens : undefined,
    };
  });
}

/* ============================================================
 * 3. CLUSTER_DEFS — 从 ATLAS_CLUSTERS 派生
 * ============================================================ */

/**
 * @type {{ idx:number, head:string, color:string, count:number }[]}
 */
export const CLUSTER_DEFS = ATLAS_CLUSTERS.map((c, idx) => ({
  idx,
  head: c.head,
  color: PALETTE[idx % PALETTE.length],
  count: c.slices.length,
}));

/** 按簇下标取颜色（越界回退至灰） */
function clusterColor(idx) {
  if (idx < 0 || idx >= CLUSTER_DEFS.length) return AXIS_LABEL;
  return CLUSTER_DEFS[idx].color;
}

/* ============================================================
 * 4. build3DOption — 等距投影伪 3D 散点
 * ============================================================ */

/**
 * 等距投影公式（确定性，无 echarts-gl）：
 *   归一化 (x,y,z) ∈ [0,1]（= 维度值/100）
 *   cos30 = √3/2 ≈ 0.8660254，sin30 = 0.5
 *   sx = ox + (x - y) * cos30 * scale
 *   sy = oy + (x + y) * sin30 * scale - z * scale
 * 屏幕 y 轴在 ECharts grid 中向上为正（这里用 value 坐标系，故 -z*scale 抬高），
 * 我们用一个隐藏的等比 value-value grid，把所有计算好的 (sx,sy) 当作普通散点喂入，
 * 立方体 12 条棱 + 三轴标签 + 地面网格用 markLine / 单独 line series 自绘。
 *
 * @param {{xDim:string,yDim:string,zDim:string,theme?:'dark'|'light'}} cfg
 *   x/y/z 为 SPACE_DIMS 的 id
 * @returns {object} ECharts option（含 series）
 */
export function build3DOption({ xDim = 'class', yDim = 'system', zDim = 'exit', theme = 'dark' } = {}) {
  const COS30 = Math.sqrt(3) / 2;
  const SIN30 = 0.5;
  const scale = 100;
  const ox = 0; // 投影后再用 grid 自适应，原点偏移设 0
  const oy = 0;

  const project = (x, y, z) => {
    // x,y,z ∈ [0,1]
    const sx = ox + (x - y) * COS30 * scale;
    const sy = oy + (x + y) * SIN30 * scale - z * scale;
    return [sx, sy];
  };

  const dimById = (id) => SPACE_DIMS[DIM_INDEX[id]];
  const dx = dimById(xDim);
  const dy = dimById(yDim);
  const dz = dimById(zDim);
  const xi = DIM_INDEX[xDim];
  const yi = DIM_INDEX[yDim];
  const zi = DIM_INDEX[zDim];

  const vectors = sliceVectors();

  /* ---- 散点：每切片一点，按簇着色，symbolSize 按边缘度 ---- */
  const points = vectors.map((s) => {
    const x = s.vec[xi] / 100;
    const y = s.vec[yi] / 100;
    const z = s.vec[zi] / 100;
    const [sx, sy] = project(x, y, z);
    const margin = s.vec[DIM_INDEX.marginality];
    return {
      value: [sx, sy],
      symbolSize: 8 + (margin / 100) * 16, // 8–24，边缘度越高越大
      itemStyle: { color: clusterColor(s.clusterIdx), opacity: 0.9 },
      _meta: {
        code: s.code,
        label: s.label,
        cluster: s.cluster,
        xv: s.vec[xi],
        yv: s.vec[yi],
        zv: s.vec[zi],
        xName: dx.label,
        yName: dy.label,
        zName: dz.label,
      },
    };
  });

  /* ---- 立方体 8 顶点（单位立方体的 8 角） ---- */
  const corners = [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ].map(([x, y, z]) => project(x, y, z));

  // 12 条棱：底面 4 + 顶面 4 + 立柱 4
  const EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 0], // 底
    [4, 5], [5, 6], [6, 7], [7, 4], // 顶
    [0, 4], [1, 5], [2, 6], [3, 7], // 柱
  ];
  const edgeData = EDGES.map(([a, b]) => [
    { coord: corners[a] },
    { coord: corners[b] },
  ]);

  /* ---- 地面网格：底面 z=0 的内部网格线（4×4） ---- */
  const groundLines = [];
  const G = 4;
  for (let i = 1; i < G; i++) {
    const t = i / G;
    groundLines.push([{ coord: project(t, 0, 0) }, { coord: project(t, 1, 0) }]);
    groundLines.push([{ coord: project(0, t, 0) }, { coord: project(1, t, 0) }]);
  }

  /* ---- 三轴标签（放在棱中点外侧） ---- */
  const axisLabels = [
    { name: dx.label, coord: project(1.08, 0, 0) }, // x 轴（向右下）
    { name: dy.label, coord: project(0, 1.08, 0) }, // y 轴（向左下）
    { name: dz.label, coord: project(0, 0, 1.12) }, // z 轴（向上）
  ];

  const isDark = theme !== 'light';
  const bg = 'transparent';
  const tipBg = isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)';
  const tipText = isDark ? '#e2e8f0' : '#1e293b';

  return {
    backgroundColor: bg,
    grid: { left: '6%', right: '6%', top: '8%', bottom: '6%', containLabel: true },
    tooltip: {
      trigger: 'item',
      backgroundColor: tipBg,
      borderColor: AXIS_LINE,
      textStyle: { color: tipText, fontSize: 12 },
      formatter: (p) => {
        const m = p.data && p.data._meta;
        if (!m) return '';
        return [
          `<b>${m.code}</b> ${m.label}`,
          `<span style="color:${AXIS_LABEL}">${m.cluster}</span>`,
          `${m.xName}: ${m.xv} · ${m.yName}: ${m.yv} · ${m.zName}: ${m.zv}`,
        ].join('<br/>');
      },
    },
    xAxis: { type: 'value', show: false, min: -110, max: 110 },
    yAxis: { type: 'value', show: false, min: -130, max: 110 },
    series: [
      // 地面网格
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        silent: true,
        lineStyle: { color: GRID_FILL, width: 1 },
        data: groundLines.map((d) => ({ coords: [d[0].coord, d[1].coord] })),
      },
      // 立方体 12 棱
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        silent: true,
        lineStyle: { color: AXIS_LINE, width: 1.4, opacity: 0.9 },
        data: edgeData.map((d) => ({ coords: [d[0].coord, d[1].coord] })),
      },
      // 三轴标签（用 scatter 承载 label）
      {
        type: 'scatter',
        silent: true,
        symbolSize: 1,
        itemStyle: { color: 'transparent' },
        label: {
          show: true,
          formatter: (p) => p.data.name,
          color: AXIS_LABEL,
          fontSize: 12,
          fontWeight: 'bold',
        },
        data: axisLabels.map((a) => ({ value: a.coord, name: a.name })),
      },
      // 切片散点
      {
        type: 'scatter',
        z: 5,
        data: points,
        emphasis: { scale: 1.3, itemStyle: { opacity: 1 } },
      },
    ],
  };
}

/* ============================================================
 * 5. buildParallelOption — 8 维（或所选 dims）平行坐标
 * ============================================================ */

/**
 * @param {{dims?:string[], theme?:'dark'|'light'}} cfg
 *   dims = SPACE_DIMS 的 id 子集；缺省=全部 8 维。
 * @returns {object} ECharts option（含 series）
 */
export function buildParallelOption({ dims, theme = 'dark' } = {}) {
  const useDims = (Array.isArray(dims) && dims.length
    ? dims.map((id) => SPACE_DIMS[DIM_INDEX[id]]).filter(Boolean)
    : SPACE_DIMS);
  const idxList = useDims.map((d) => DIM_INDEX[d.id]);

  const vectors = sliceVectors();

  const parallelAxis = useDims.map((d, i) => ({
    dim: i,
    name: d.label,
    min: 0,
    max: 100,
    nameTextStyle: { color: AXIS_LABEL, fontSize: 11 },
    axisLine: { lineStyle: { color: AXIS_LINE } },
    axisLabel: { color: AXIS_LABEL, fontSize: 10 },
    axisTick: { lineStyle: { color: AXIS_LINE } },
    splitLine: { show: false },
  }));

  const isDark = theme !== 'light';
  const tipBg = isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)';
  const tipText = isDark ? '#e2e8f0' : '#1e293b';

  const data = vectors.map((s) => ({
    value: idxList.map((i) => s.vec[i]),
    lineStyle: { color: clusterColor(s.clusterIdx), opacity: 0.32, width: 1 },
    name: `${s.code} ${s.label}`,
  }));

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tipBg,
      borderColor: AXIS_LINE,
      textStyle: { color: tipText, fontSize: 12 },
      formatter: (p) => (p.data && p.data.name) || '',
    },
    parallel: {
      left: '5%',
      right: '12%',
      top: '12%',
      bottom: '10%',
      parallelAxisDefault: { type: 'value' },
    },
    parallelAxis,
    series: [
      {
        type: 'parallel',
        smooth: 0.2,
        lineStyle: { width: 1, opacity: 0.32 },
        emphasis: { lineStyle: { width: 2, opacity: 0.95 } },
        data,
      },
    ],
  };
}

/* ============================================================
 * 6. buildClusterRadarOption — 单簇成员 8 维均值雷达
 * ============================================================ */

/**
 * @param {number} clusterIdx 簇下标（ATLAS_CLUSTERS 的下标）
 * @returns {object} ECharts option（含 series radar）；越界返回空 series
 */
export function buildClusterRadarOption(clusterIdx) {
  const def = CLUSTER_DEFS[clusterIdx];
  const members = sliceVectors().filter((s) => s.clusterIdx === clusterIdx);

  const indicator = SPACE_DIMS.map((d) => ({ name: d.label, max: 100 }));

  // 8 维均值（确定性：成员向量逐维求和 / 成员数；空簇全 0）
  const mean = new Array(8).fill(0);
  if (members.length) {
    for (const s of members) {
      for (let i = 0; i < 8; i++) mean[i] += s.vec[i];
    }
    for (let i = 0; i < 8; i++) mean[i] = clamp(mean[i] / members.length);
  }

  const color = def ? def.color : AXIS_LABEL;
  const head = def ? def.head : '（无此簇）';

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    title: {
      text: head,
      subtext: `成员数 ${members.length}`,
      left: 'center',
      textStyle: { color: AXIS_LABEL, fontSize: 13 },
      subtextStyle: { color: AXIS_LABEL, fontSize: 11 },
    },
    radar: {
      indicator,
      radius: '62%',
      center: ['50%', '58%'],
      axisName: { color: AXIS_LABEL, fontSize: 10 },
      axisLine: { lineStyle: { color: AXIS_LINE } },
      splitLine: { lineStyle: { color: AXIS_LINE } },
      splitArea: { areaStyle: { color: [GRID_FILL, 'transparent'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: mean,
            name: head,
            symbolSize: 4,
            lineStyle: { color, width: 2 },
            areaStyle: { color, opacity: 0.18 },
            itemStyle: { color },
          },
        ],
      },
    ],
  };
}

/* ============================================================
 * 7. dimSummary — 概览研判
 * ============================================================ */

/**
 * @returns {{
 *   dimCount:number, sliceCount:number, clusterCount:number,
 *   variances:{id:string,label:string,variance:number}[],
 *   verdict:string
 * }}
 */
export function dimSummary() {
  const vectors = sliceVectors();
  const n = vectors.length;

  /* 各维方差（总体方差，确定性） */
  const variances = SPACE_DIMS.map((d, di) => {
    const vals = vectors.map((s) => s.vec[di]);
    const mean = vals.reduce((a, b) => a + b, 0) / (n || 1);
    const variance = vals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (n || 1);
    return { id: d.id, label: d.label, variance: Math.round(variance * 10) / 10 };
  });

  const ranked = [...variances].sort((a, b) => b.variance - a.variance);
  const top = ranked.slice(0, 3).map((v) => v.label);

  const verdict =
    `方差最大（最分化）三维：${top.join(' / ')}——` +
    `图谱在这些维度上把人群拉得最开，是结构差异的主断层。`;

  return {
    dimCount: SPACE_DIMS.length,
    sliceCount: n,
    clusterCount: ATLAS_CLUSTERS.length,
    variances,
    verdict,
  };
}
