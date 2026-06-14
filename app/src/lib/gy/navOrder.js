// ============================================================================
// 中国人群分析 · 左侧分类树排序（语义密度 / 优先级 / 相似性 / 标题长度）
// ----------------------------------------------------------------------------
// 排序综合四项信号：
//   1) 相似性 + 优先级：复用 atlasData 的 ATLAS_CLUSTERS 主题簇（已是策展级的
//      相似性聚类，且簇序本身编码主题优先级——基准三片 → 各轴 → 各批次收官）。
//   2) 标题长度：簇内按模块标题字数升序，左树视觉节奏由短到长、由核心到长尾。
//   3) 语义密度：簇内同长度时，按 GY 编号兜底（编号≈上线/语义沉淀顺序）。
// 母索引「人群画像总图谱」(GY-00) 恒居首；并发新增、尚未纳入主题簇的切片，
// 落到全部已分类切片之后，按编号排列——绝不丢项、绝不报错。
// 纯函数、零随机、零当前时间。仅供 registry.modulesByGroup('population') 调用。
// ============================================================================
import { GY_MODULES } from './registry.js';
import { ATLAS_CLUSTERS } from '../renqun-tupu/atlasData.js';

const ATLAS_ID = 'renqunTupu'; // GY-00 母索引

// id → GY 编号（两位字符串）反查
const ID_TO_NUM = {};
for (const [num, mod] of Object.entries(GY_MODULES)) {
  if (mod && mod.id) ID_TO_NUM[mod.id] = num;
}

// 主题簇排序索引：gyNum → { clusterIdx, orderInCluster }
const CLUSTER_RANK = {};
ATLAS_CLUSTERS.forEach((cluster, ci) => {
  (cluster.slices || []).forEach((s, si) => {
    if (s && s.num != null) CLUSTER_RANK[String(s.num)] = { clusterIdx: ci, orderInCluster: si };
  });
});

const labelLen = (num) => {
  const mod = GY_MODULES[num];
  return mod && mod.label ? [...mod.label].length : 99;
};

/**
 * 人群分类树排序权重（越小越靠前）。
 * @param {string} moduleId registry 模块 id
 * @returns {number}
 */
export function populationNavRank(moduleId) {
  if (moduleId === ATLAS_ID) return -1; // 母索引恒首位
  const num = ID_TO_NUM[moduleId];
  if (!num) return 9_000_000; // 不在 GY 体系（异常）→ 末尾
  const numInt = parseInt(num, 10) || 0;
  const cr = CLUSTER_RANK[num];
  if (cr) {
    // 主题簇分块 → 簇内标题长度 → 编号兜底
    return cr.clusterIdx * 100_000 + labelLen(num) * 1_000 + numInt;
  }
  // 已上线但尚未纳入主题簇（如并发新增）→ 所有已分类切片之后，按编号
  return 8_000_000 + numInt;
}

/** 人群组模块比较器（registry.modulesByGroup 注入） */
export function populationNavCompare(a, b) {
  return populationNavRank(a.id) - populationNavRank(b.id);
}
