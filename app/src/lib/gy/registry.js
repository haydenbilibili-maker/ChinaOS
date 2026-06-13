/**
 * GY 系列模块路由注册表 · 人群切片 GY-03–46 + 推演 GY-01/02
 * 供方法论脚注 GY-xx 交叉引用链接化
 */

/** @type {Record<string, { id: string, path: string, label: string, group: 'sim' | 'population' }>} */
export const GY_MODULES = {
  '00': { id: 'renqunTupu', path: '/modules/renqun-tupu', label: '人群画像总图谱', group: 'population' },
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
  '27': { id: 'huoche', path: '/modules/huoche', label: '货车司机', group: 'population' },
  '28': { id: 'chengxu', path: '/modules/chengxu', label: '程序员', group: 'population' },
  '29': { id: 'getihu', path: '/modules/getihu', label: '个体户', group: 'population' },
  '30': { id: 'liushou', path: '/modules/liushou', label: '留守老人', group: 'population' },
  '31': { id: 'jiazheng', path: '/modules/jiazheng', label: '家政照护工', group: 'population' },
  '32': { id: 'zhaiwu', path: '/modules/zhaiwu', label: '债务人群', group: 'population' },
  '33': { id: 'qingjiao', path: '/modules/qingjiao', label: '高校青椒', group: 'population' },
  '34': { id: 'manjiu', path: '/modules/manjiu', label: '慢就业青年', group: 'population' },
  '35': { id: 'xinnong', path: '/modules/xinnong', label: '职业农民', group: 'population' },
  '36': { id: 'yulun', path: '/modules/yulun', label: '网络舆论场', group: 'population' },
  '37': { id: 'yihu', path: '/modules/yihu', label: '医护人员', group: 'population' },
  '38': { id: 'jiaoshi', path: '/modules/jiaoshi', label: '中小学教师', group: 'population' },
  '39': { id: 'baoan', path: '/modules/baoan', label: '保安群体', group: 'population' },
  '40': { id: 'wangyue', path: '/modules/wangyue', label: '网约车司机', group: 'population' },
  '41': { id: 'baoxian', path: '/modules/baoxian', label: '保险代理', group: 'population' },
  '42': { id: 'minqi', path: '/modules/minqi', label: '中小民企主', group: 'population' },
  '43': { id: 'jipin', path: '/modules/jipin', label: '城市极贫', group: 'population' },
  '44': { id: 'jiaozheng', path: '/modules/jiaozheng', label: '社区矫正', group: 'population' },
  '45': { id: 'funv', path: '/modules/funv', label: '留守妇女', group: 'population' },
  '46': { id: 'binzang', path: '/modules/binzang', label: '殡葬临终', group: 'population' },
  '47': { id: 'junren', path: '/modules/junren', label: '现役军人', group: 'population' },
  '48': { id: 'bianjiang', path: '/modules/bianjiang', label: '边疆民族', group: 'population' },
};

/** GY-03…46 已上线人群切片编号（不含 GY-00 母索引） */
export const POPULATION_SLICE_GY_NUMS = Object.entries(GY_MODULES)
  .filter(([, m]) => m.group === 'population' && m.id !== 'renqunTupu')
  .map(([num]) => num)
  .sort();

export const POPULATION_SLICE_COUNT = POPULATION_SLICE_GY_NUMS.length;

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
