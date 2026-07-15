/**
 * 史鉴案例库 · 事件时间序真源
 * eventYear：单案取核心拐点年（BC 为负）；综合矩阵取成员中位年（见 SYNTHESIS_EVENT_YEARS 注释）
 */
export const SHIJIAN_CASE_EVENT_YEARS = {
  shijianSJ05: 1069,   // 熙宁变法
  shijianSJ06: 755,    // 天宝之乱
  shijianSJ08: 907,    // 朱温篡唐 · 五代开端
  shijianSJ09: 1581,   // 一条鞭法全面推行
  shijianSJ10: 1644,   // 崇祯易代
  shijianSJ11: -350,   // 商鞅变法（前350 系年）
  shijianSJ12: -209,   // 陈胜起义
  shijianSJ13: 9,      // 王莽称帝
  shijianSJ25: -221,   // 秦统一六国 · 称皇帝
  shijianSJ26: -213,   // 焚书令
  shijianSJ29: 166,    // 第一次党锢
  shijianSJ30: 184,    // 黄巾起义
  shijianSJ14: 1861,   // 洋务运动开端
  shijianSJ15: 1911,   // 辛亥革命
  shijianSJ27: -180,   // 文景之治中段
  shijianSJ28: -119,   // 元狩四年漠北之战 · 财政越阈
  shijianSJ31: 200,    // 官渡之战
  shijianSJ32: 220,    // 九品中正制度化
  shijianSJ33: 383,    // 淝水之战
  shijianSJ34: 494,    // 孝文帝迁都洛阳
  shijianSJ35: 581,    // 隋文帝建隋
  shijianSJ36: 605,    // 大运河开凿（大业元年）
  shijianSJ37: 618,    // 江都兵变 · 隋亡
  shijianSJ38: 627,    // 贞观之治
  shijianSJ39: 780,    // 两税法
  shijianSJ40: 875,    // 黄巢起义
  shijianSJ41: 1127,   // 靖康之变
  shijianSJ42: 1138,   // 南宋定都临安
  shijianSJ43: 1005,   // 澶渊之盟
  shijianSJ44: 1219,   // 蒙古西征花剌子模
  shijianSJ45: 1271,   // 行省制成熟（元世祖）
  shijianSJ46: 1351,   // 红巾起义
  shijianSJ47: 1449,   // 土木堡之变
  shijianSJ48: 1405,   // 郑和首次下西洋
  shijianSJ49: 1750,   // 康乾鼎盛隐性拐点（人口峰值段）
  shijianSJ50: 1851,   // 太平天国金田起义
  shijianSJ51: 1898,   // 戊戌变法
  shijianSJ52: 1919,   // 五四运动
  shijianSJ53: 1926,   // 北伐誓师
  shijianSJ54: -386,   // 吴起变法
  shijianSJ55: -318,   // 合纵连横高峰
  shijianSJ56: -260,   // 长平之战
  shijianSJ57: -300,   // 百家争鸣
};

/** 综合矩阵：成员案中位年（文档化规则） */
export const SYNTHESIS_EVENT_YEARS = {
  shijianSJ07: 755,    // 崩解矩阵 · 成员中位（秦-209…辛亥1911）
  shijianSJ16: 834,    // 变法谱系 · 五案均值
  shijianSJ17: 538,    // 上升奠基 · 四案均值
  shijianSJ18: 755,    // 拐点谱系 · 三案（贞观627/天宝755/康乾1750）中位
  shijianSJ19: 438,    // 分裂重整 · 四案均值
};

export const SYNTHESIS_MODULE_IDS = new Set(Object.keys(SYNTHESIS_EVENT_YEARS));

/**
 * @param {{ id?: string, casesBand?: string, eventYear?: number }} mod
 */
export function getShijianEventYear(mod) {
  if (!mod?.id) return 0;
  if (mod.casesBand === 'synthesis' || SYNTHESIS_MODULE_IDS.has(mod.id)) {
    return SYNTHESIS_EVENT_YEARS[mod.id] ?? mod.eventYear ?? 9999;
  }
  return SHIJIAN_CASE_EVENT_YEARS[mod.id] ?? mod.eventYear ?? 0;
}

export function formatEventYear(year) {
  if (year < 0) return `前${Math.abs(year)}`;
  return String(year);
}

export function isSynthesisCase(mod) {
  return mod?.casesBand === 'synthesis' || SYNTHESIS_MODULE_IDS.has(mod?.id);
}
