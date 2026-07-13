/**
 * 重构河山 · 拟省地级单元分组
 * ---------------------------------------------------------------------------
 * 方案 A：以 DataV 地级边界为底，按校准底表逐市归并至 34 个拟设单元着色。
 * 未在校准底表逐市列出的地级单元，按地理邻接归入最近拟省（简化示意，
 * 非精确勘界）。跨省单元（淮海省等）以市为单位拆分原省级面。
 * 保留二十单元仍以省级面展示，不着色拟省指标。
 */
import { HESHAN_CALIBRATION_REGIONS, HESHAN_FISCAL_ROWS } from '../shared/heshanData.js';

/** 需下钻至地级边界的原省级 adcode */
export const SPLIT_PROVINCE_ADCODES = [
  130000, // 河北
  150000, // 内蒙古
  370000, // 山东
  410000, // 河南
  320000, // 江苏
  330000, // 浙江
  340000, // 安徽
  420000, // 湖北
  350000, // 福建
  440000, // 广东
  510000, // 四川
  610000, // 陕西
  620000, // 甘肃
];

/** 保留单元（省级面，不参与拟省 choropleth） */
export const KEPT_PROVINCE_NAMES = new Set([
  '北京市', '天津市', '上海市', '重庆市',
  '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江西省', '湖南省',
  '广西壮族自治区', '海南省',
  '贵州省', '云南省',
  '宁夏回族自治区', '青海省', '西藏自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区', '台湾省',
]);

/** 拟省 canonical 名 → 图册卡片 slug */
export const HESHAN_UNIT_SLUGS = {
  '京畿省': 'jingji',
  '冀南省': 'jinan',
  '冀东省': 'jidong',
  '蒙东省': 'mengdong',
  '蒙中省': 'mengzhong',
  '蒙西省': 'mengxi',
  '胶东省': 'jiaodong',
  '鲁中省': 'luzhong',
  '中原省': 'zhongyuan',
  '豫西南省': 'yuxinan',
  '淮海省': 'huaihai',
  '苏南省': 'sunan',
  '江淮省': 'jianghuai',
  '浙北省': 'zhebei',
  '浙南省': 'zhenan',
  '皖南省': 'wannan',
  '皖中省': 'wanzhong',
  '湖北(重组)': 'hubei-reorg',
  '鄂西省': 'exi',
  '闽东省': 'mindong',
  '闽南省': 'minnan',
  '深圳': 'shenzhen',
  '珠三角省': 'zhusanjiao',
  '潮汕省': 'chaoshan',
  '粤西省': 'yuexi',
  '粤北省': 'yuebei',
  '成都平原省': 'chengdu-pingyuan',
  '川南省': 'chuannan',
  '攀西省': 'panxi',
  '关中省': 'guanzhong',
  '陕北省': 'shanbei',
  '陕南省': 'shannan',
  '陇右省': 'longyou',
  '河西省': 'hexi',
};

/** 校准底表拟省名 → fiscal 行 canonical 名 */
const CALIBRATION_NAME_MAP = {
  '湖北省（重组）': '湖北(重组)',
  '淮海省 ★': '淮海省',
};

/** GeoJSON 地名 → 校准底表短名 */
const GEO_CITY_ALIASES = {
  石家庄市: '石家庄',
  唐山市: '唐山',
  秦皇岛市: '秦皇岛',
  邯郸市: '邯郸',
  邢台市: '邢台',
  保定市: '保定',
  张家口市: '张家口',
  承德市: '承德',
  沧州市: '沧州',
  廊坊市: '廊坊',
  衡水市: '衡水',
  呼和浩特市: '呼和浩特',
  包头市: '包头',
  乌海市: '乌海',
  赤峰市: '赤峰',
  通辽市: '通辽',
  鄂尔多斯市: '鄂尔多斯',
  呼伦贝尔市: '呼伦贝尔',
  巴彦淖尔市: '巴彦淖尔',
  乌兰察布市: '乌兰察布',
  兴安盟: '兴安盟',
  锡林郭勒盟: '锡林郭勒盟',
  阿拉善盟: '阿拉善盟',
  济南市: '济南',
  青岛市: '青岛',
  淄博市: '淄博',
  枣庄市: '枣庄',
  东营市: '东营',
  烟台市: '烟台',
  潍坊市: '潍坊',
  济宁市: '济宁',
  泰安市: '泰安',
  威海市: '威海',
  日照市: '日照',
  临沂市: '临沂',
  德州市: '德州',
  聊城市: '聊城',
  滨州市: '滨州',
  菏泽市: '菏泽',
  郑州市: '郑州',
  开封市: '开封',
  洛阳市: '洛阳',
  平顶山市: '平顶山',
  安阳市: '安阳',
  鹤壁市: '鹤壁',
  新乡市: '新乡',
  焦作市: '焦作',
  濮阳市: '濮阳',
  许昌市: '许昌',
  漯河市: '漯河',
  三门峡市: '三门峡',
  南阳市: '南阳',
  商丘市: '商丘',
  信阳市: '信阳',
  周口市: '周口',
  驻马店市: '驻马店',
  济源市: '济源',
  南京市: '南京',
  无锡市: '无锡',
  徐州市: '徐州',
  常州市: '常州',
  苏州市: '苏州',
  南通市: '南通',
  连云港市: '连云港',
  淮安市: '淮安',
  盐城市: '盐城',
  扬州市: '扬州',
  镇江市: '镇江',
  泰州市: '泰州',
  宿迁市: '宿迁',
  杭州市: '杭州',
  宁波市: '宁波',
  温州市: '温州',
  嘉兴市: '嘉兴',
  湖州市: '湖州',
  绍兴市: '绍兴',
  金华市: '金华',
  衢州市: '衢州',
  舟山市: '舟山',
  台州市: '台州',
  丽水市: '丽水',
  合肥市: '合肥',
  芜湖市: '芜湖',
  蚌埠市: '蚌埠',
  淮南市: '淮南',
  马鞍山市: '马鞍山',
  淮北市: '淮北',
  铜陵市: '铜陵',
  安庆市: '安庆',
  黄山市: '黄山',
  滁州市: '滁州',
  阜阳市: '阜阳',
  宿州市: '宿州',
  六安市: '六安',
  亳州市: '亳州',
  池州市: '池州',
  宣城市: '宣城',
  武汉市: '武汉',
  黄石市: '黄石',
  十堰市: '十堰',
  宜昌市: '宜昌',
  襄阳市: '襄阳',
  鄂州市: '鄂州',
  荆门市: '荆门',
  孝感市: '孝感',
  荆州市: '荆州',
  黄冈市: '黄冈',
  咸宁市: '咸宁',
  随州市: '随州',
  恩施土家族苗族自治州: '恩施州',
  仙桃市: '仙桃',
  潜江市: '潜江',
  天门市: '天门',
  神农架林区: '神农架',
  福州市: '福州',
  厦门市: '厦门',
  莆田市: '莆田',
  三明市: '三明',
  泉州市: '泉州',
  漳州市: '漳州',
  南平市: '南平',
  龙岩市: '龙岩',
  宁德市: '宁德',
  广州市: '广州',
  韶关市: '韶关',
  深圳市: '深圳',
  珠海市: '珠海',
  汕头市: '汕头',
  佛山市: '佛山',
  江门市: '江门',
  湛江市: '湛江',
  茂名市: '茂名',
  肇庆市: '肇庆',
  惠州市: '惠州',
  梅州市: '梅州',
  汕尾市: '汕尾',
  河源市: '河源',
  阳江市: '阳江',
  清远市: '清远',
  东莞市: '东莞',
  中山市: '中山',
  潮州市: '潮州',
  揭阳市: '揭阳',
  云浮市: '云浮',
  成都市: '成都',
  自贡市: '自贡',
  攀枝花市: '攀枝花',
  泸州市: '泸州',
  德阳市: '德阳',
  绵阳市: '绵阳',
  广元市: '广元',
  遂宁市: '遂宁',
  内江市: '内江',
  乐山市: '乐山',
  南充市: '南充',
  眉山市: '眉山',
  宜宾市: '宜宾',
  广安市: '广安',
  达州市: '达州',
  雅安市: '雅安',
  巴中市: '巴中',
  资阳市: '资阳',
  阿坝藏族羌族自治州: '阿坝州',
  甘孜藏族自治州: '甘孜州',
  凉山彝族自治州: '凉山州',
  西安市: '西安',
  铜川市: '铜川',
  宝鸡市: '宝鸡',
  咸阳市: '咸阳',
  渭南市: '渭南',
  延安市: '延安',
  汉中市: '汉中',
  榆林市: '榆林',
  安康市: '安康',
  商洛市: '商洛',
  兰州市: '兰州',
  嘉峪关市: '嘉峪关',
  金昌市: '金昌',
  白银市: '白银',
  天水市: '天水',
  武威市: '武威',
  张掖市: '张掖',
  平凉市: '平凉',
  酒泉市: '酒泉',
  庆阳市: '庆阳',
  定西市: '定西',
  陇南市: '陇南',
  临夏回族自治州: '临夏州',
  甘南藏族自治州: '甘南州',
};

/**
 * 未在校准底表逐市列出的地级单元 · 简化邻接归并
 * （仅用于示意合并边界，见模块页脚说明）
 */
const INFERRED_CITY_UNITS = {
  潍坊: '胶东省',
  临沂: '淮海省',
  德州: '鲁中省',
  聊城: '中原省',
  安阳: '中原省',
  鹤壁: '中原省',
  濮阳: '中原省',
  周口: '豫西南省',
  淮安: '淮海省',
  盐城: '江淮省',
  阜阳: '淮海省',
  亳州: '中原省',
  随州: '鄂西省',
  广元: '鄂西省',
  遂宁: '川南省',
  乐山: '成都平原省',
  南充: '成都平原省',
  广安: '成都平原省',
  达州: '成都平原省',
  巴中: '成都平原省',
  甘南州: '陇右省',
};

function canonicalUnitName(name) {
  return CALIBRATION_NAME_MAP[name] || name.replace(/ ★$/, '');
}

function shortCityName(geoName) {
  if (!geoName) return '';
  if (GEO_CITY_ALIASES[geoName]) return GEO_CITY_ALIASES[geoName];
  return geoName
    .replace(/土家族苗族自治州|藏族羌族自治州|藏族自治州|彝族自治州|回族自治州|特别行政区/g, '')
    .replace(/地区|盟|市|林区/g, '');
}

/** @type {Map<string, { unit: string, regionColor: string }>} */
const cityToUnit = new Map();

for (const region of HESHAN_CALIBRATION_REGIONS) {
  for (const prov of region.provs) {
    const unit = canonicalUnitName(prov.n);
    for (const [city] of prov.cities) {
      cityToUnit.set(city, { unit, regionColor: region.color });
    }
  }
}

for (const [city, unit] of Object.entries(INFERRED_CITY_UNITS)) {
  if (!cityToUnit.has(city)) {
    const region = HESHAN_CALIBRATION_REGIONS.find((r) => r.provs.some((p) => canonicalUnitName(p.n) === unit));
    cityToUnit.set(city, { unit, regionColor: region?.color || '#5a6a72' });
  }
}

/** @type {Map<string, { name: string, pop: number, gdp: number, cost: number, slug: string }>} */
export const HESHAN_UNITS = new Map(
  HESHAN_FISCAL_ROWS.map(([name, pop, gdp, cost]) => [
    name,
    { name, pop, gdp, cost, slug: HESHAN_UNIT_SLUGS[name] || name },
  ]),
);

/**
 * @param {{ name?: string, level?: string, adcode?: number }} props
 * @returns {{ unit: string|null, regionColor: string, kept: boolean, cityKey: string }}
 */
export function resolveFeatureUnit(props = {}) {
  const { name = '', level = '', adcode } = props;

  if (level === 'province' || (adcode && adcode % 10000 === 0 && adcode < 900000)) {
    if (KEPT_PROVINCE_NAMES.has(name)) {
      return { unit: null, regionColor: '#3a4548', kept: true, cityKey: name };
    }
    return { unit: null, regionColor: '#3a4548', kept: false, cityKey: name };
  }

  const cityKey = shortCityName(name);
  if (cityKey === '仙桃' || cityKey === '潜江' || cityKey === '天门') {
    const hit = cityToUnit.get('仙潜天');
    if (hit) return { ...hit, kept: false, cityKey };
  }

  const hit = cityToUnit.get(cityKey);
  if (hit) return { ...hit, kept: false, cityKey };

  return { unit: null, regionColor: '#4a5568', kept: false, cityKey };
}

export function getUnitMeta(unitName) {
  return unitName ? HESHAN_UNITS.get(unitName) : null;
}

export function metricForUnit(unitName, metric = 'gdp') {
  const meta = getUnitMeta(unitName);
  if (!meta) return null;
  return metric === 'pop' ? meta.pop : meta.gdp;
}

/** 拟省单元色阶（按宏观区域色相） */
export function unitFillColor(unitName, regionColor, { light = false } = {}) {
  if (!unitName) return light ? 'rgba(58,70,89,0.15)' : 'rgba(58,70,89,0.35)';
  const base = regionColor || '#5a6a72';
  return light ? `${base}cc` : `${base}dd`;
}
