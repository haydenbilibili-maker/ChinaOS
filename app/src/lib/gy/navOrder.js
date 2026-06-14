// ============================================================================
// 中国人群分析 · 左侧分类树排序（语义密度 / 优先级 / 相似性 / 标题长度）
// ----------------------------------------------------------------------------
// 排序信号（侧栏专用 POPULATION_NAV_ORDER，与 atlasData 可视化簇解耦）：
//   1) 语义密度：GY-00 母索引置顶 → 基准三片+核心轴锚点 → 主题批次
//   2) 优先级：高信号基础人群先于长尾；敏感「多视角不裁决」置末
//   3) 相似性：劳动权益 / 公卫健康 / 儿童家庭 / 制度土地 / 移民 / 受害者 / 信访边疆
//      等同主题切片相邻（如 50 尘肺邻制造劳动簇，54 儿童邻 25 失独/46 殡葬）
//   4) 标题长度：同批次内短标题优先（registry.title 字数），避免长标题堆在段首
// 未列入显式序的并发新增切片 → 已分类之后按 GY 编号兜底，绝不丢项。
// 纯函数、零随机。仅供 registry.modulesByGroup('population') 调用。
// ============================================================================
import { GY_MODULES } from './registry.js';

const ATLAS_ID = 'renqunTupu'; // GY-00 母索引

// id → GY 编号（两位字符串）反查
const ID_TO_NUM = {};
for (const [num, mod] of Object.entries(GY_MODULES)) {
  if (mod && mod.id) ID_TO_NUM[mod.id] = num;
}

/**
 * 侧栏导航主题批次（策展序；与 ATLAS_CLUSTERS 可视化布局独立）
 * 每批内模块已按侧栏可读性预排，比较器在同批内再以 title 字数微调。
 */
export const POPULATION_NAV_BATCHES = [
  { head: '母索引', nums: ['00'] },
  { head: '基准三片 · 核心锚点', nums: ['03', '04', '05', '08', '06', '07', '09'] },
  { head: '阶层与退出', nums: ['10', '16', '32', '42', '43'] },
  { head: '城乡户籍断层', nums: ['20', '21', '35', '30', '45'] },
  { head: '性别与年龄', nums: ['17', '19', '26', '34'] },
  {
    head: '劳动权益 · 制造平台与服务末梢',
    nums: ['11', '22', '28', '27', '29', '39', '40', '41', '50', '33', '38', '14', '31'],
  },
  {
    head: '公共卫生与健康总账',
    nums: ['18', '15', '23', '37', '53', '49', '55', '57'],
  },
  { head: '儿童与家庭', nums: ['54', '25', '46'] },
  { head: '治理与军事组织', nums: ['12', '24', '47'] },
  { head: '意义与媒介', nums: ['13', '36'] },
  { head: '制度土地 · 移民安置', nums: ['51', '56'] },
  { head: '受害者保护与权利救济', nums: ['52', '44'] },
  { head: '多视角不裁决', nums: ['48', '58'] },
];

/** @type {string[]} 扁平导航序（57 项 = GY-00 + GY-03…58） */
export const POPULATION_NAV_ORDER = POPULATION_NAV_BATCHES.flatMap((b) => b.nums);

// gyNum → { batchIdx, orderInBatch }
const NAV_RANK = {};
POPULATION_NAV_BATCHES.forEach((batch, bi) => {
  (batch.nums || []).forEach((num, si) => {
    NAV_RANK[String(num)] = { batchIdx: bi, orderInBatch: si };
  });
});

const titleLen = (title) => (title ? [...title].length : 99);

/**
 * 人群分类树排序权重（越小越靠前）。
 * @param {string} moduleId registry 模块 id
 * @param {string} [title] registry 侧栏标题（同批内按字数微调）
 * @returns {number}
 */
export function populationNavRank(moduleId, title = '') {
  if (moduleId === ATLAS_ID) return -1;
  const num = ID_TO_NUM[moduleId];
  if (!num) return 9_000_000;
  const numInt = parseInt(num, 10) || 0;
  const nr = NAV_RANK[num];
  if (nr) {
    return nr.batchIdx * 100_000 + nr.orderInBatch * 100 + titleLen(title);
  }
  return 8_000_000 + numInt;
}

/** 人群组模块比较器（registry.modulesByGroup 注入） */
export function populationNavCompare(a, b) {
  const ra = populationNavRank(a.id, a.title);
  const rb = populationNavRank(b.id, b.title);
  if (ra !== rb) return ra - rb;
  return (parseInt(ID_TO_NUM[a.id], 10) || 0) - (parseInt(ID_TO_NUM[b.id], 10) || 0);
}
