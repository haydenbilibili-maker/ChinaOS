/**
 * GY 系列模块路由注册表 · 人群切片 GY-03–26 + 推演 GY-01/02
 * 供方法论脚注 GY-xx 交叉引用链接化
 */

/** @type {Record<string, { id: string, path: string, label: string, group: 'sim' | 'population' }>} */
export const GY_MODULES = {
  '01': { id: 'guoyun', path: '/modules/guoyun', label: '国运推演', group: 'sim' },
  '02': { id: 'yishixingtai', path: '/modules/yishixingtai', label: '合法性机器', group: 'sim' },
  '03': { id: 'qingnian', path: '/modules/qingnian', label: '青年', group: 'population' },
  '04': { id: 'xingshaoshu', path: '/modules/xingshaoshu', label: '性少数', group: 'population' },
  '05': { id: 'linggong', path: '/modules/linggong', label: '零工经济', group: 'population' },
  '06': { id: 'nongmingong', path: '/modules/nongmingong', label: '农民工', group: 'population' },
  '07': { id: 'tizhinei', path: '/modules/tizhinei', label: '体制内', group: 'population' },
  '08': { id: 'zhongchan', path: '/modules/zhongchan', label: '中产', group: 'population' },
  '09': { id: 'laonian', path: '/modules/laonian', label: '老年', group: 'population' },
  '10': { id: 'tajian', path: '/modules/tajian', label: '塔尖阶层', group: 'population' },
  '11': { id: 'zhixiao', path: '/modules/zhixiao', label: '职校生', group: 'population' },
  '12': { id: 'tuiyi', path: '/modules/tuiyi', label: '退役军人', group: 'population' },
  '13': { id: 'yiyi', path: '/modules/yiyi', label: '信仰人群', group: 'population' },
  '14': { id: 'liupiao', path: '/modules/liupiao', label: '创作者', group: 'population' },
  '15': { id: 'yibao', path: '/modules/yibao', label: '医保群体', group: 'population' },
  '16': { id: 'lian', path: '/modules/lian', label: '离岸华人', group: 'population' },
  '17': { id: 'zhongnv', path: '/modules/zhongnv', label: '中年女性', group: 'population' },
  '18': { id: 'canzhang', path: '/modules/canzhang', label: '残障人群', group: 'population' },
  '19': { id: 'danshen', path: '/modules/danshen', label: '单身女性', group: 'population' },
  '20': { id: 'xianyu', path: '/modules/xianyu', label: '县域青年', group: 'population' },
  '21': { id: 'xinyimin', path: '/modules/xinyimin', label: '城市新移民', group: 'population' },
  '22': { id: 'jigong', path: '/modules/jigong', label: '技术工人', group: 'population' },
  '23': { id: 'manbing', path: '/modules/manbing', label: '带病青年', group: 'population' },
  '24': { id: 'moshao', path: '/modules/moshao', label: '治理末梢', group: 'population' },
  '25': { id: 'shidu', path: '/modules/shidu', label: '计生后遗', group: 'population' },
  '26': { id: 'shuzi', path: '/modules/shuzi', label: '数字原住民', group: 'population' },
};

/** @param {string} num two-digit string e.g. "03" */
export function gyModulePath(num) {
  const mod = GY_MODULES[num];
  return mod ? `#${mod.path}` : null;
}

/** @param {string} raw e.g. "GY-03", "03" */
export function normalizeGyNum(raw) {
  const m = String(raw).match(/(\d{2})/);
  return m ? m[1] : null;
}

/** Parse "GY-01/03/05" or "GY-01 / GY-02" into unique module nums */
export function parseGyRefList(text) {
  const nums = new Set();
  const re = /GY-(\d{2})/g;
  let m;
  while ((m = re.exec(text)) !== null) nums.add(m[1]);
  return [...nums].sort();
}
