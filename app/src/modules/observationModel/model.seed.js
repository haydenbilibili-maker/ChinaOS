// ============================================================================
// 复杂网络观测模型 · 数据种子（单一数据源）
// ----------------------------------------------------------------------------
// 与 data/observation-model/*.csv 同步；方法与口径见 docs/observation-model/。
// 信源等级：A 已核对官方一手 · B 公开履历/权威媒体未逐一复核 · C 模型推断（主观）。
// 情景概率与圈层划分属模型主观判断，不是统计数据。
// ============================================================================

export const MODEL_AS_OF = '2026-11-26';

/** 二十大选出的中央委员 205 人 + 候补中央委员 171 人 */
export const CC_BASE = 376;

/** 全会出席率预警线（%） */
export const ATTENDANCE_ALERT = 80;

export const INDICATOR_GROUPS = ['政治精英', '军队', '经济', '外部', '话语'];

/** 指标字典 · 第 15 节 */
export const INDICATORS = [
  { id: 'P1', group: '政治精英', name: '中央全会出席率', definition: '（出席中委+候补）÷376', source: '全会公报', frequency: '每次全会', current: '74.2%（五中）', threshold: '低于 80%', status: '预警' },
  { id: 'P2', group: '政治精英', name: '政治局原委员被查比例', definition: '被查人数÷24', source: '中纪委/新华社', frequency: '事件驱动', current: '3/24', threshold: '出现常委', status: '关注' },
  { id: 'P3', group: '政治精英', name: '常委会稳定性', definition: '二十大常委留任人数', source: '公开报道', frequency: '事件驱动', current: '7/7', threshold: '任一人变动', status: '正常' },
  { id: 'P4', group: '政治精英', name: '省委书记调整个数', definition: '年内更换的省级一把手', source: '新华社', frequency: '月', current: '2026 年已核实至少 4 个', threshold: '大会前半年内超过 8 个', status: '关注' },
  { id: 'P5', group: '政治精英', name: '递补中委时被跳过人数', definition: '按得票顺序应递补而未递补者', source: '公报名单比对', frequency: '每次全会', current: '待编码', threshold: '每次 ≥3 人', status: '待评' },
  { id: 'P6', group: '政治精英', name: '全会开除追认人数', definition: '全会确认的开除党籍人数', source: '全会公报', frequency: '每次全会', current: '14（四中）→33（五中）', threshold: '连续上升', status: '关注' },
  { id: 'M1', group: '军队', name: '军委原成员留任率', definition: '二十届原 7 人中仍在任人数', source: '国防部/新华社', frequency: '事件驱动', current: '2/7', threshold: '低于 4/7', status: '预警' },
  { id: 'M2', group: '军队', name: '军委委员增补', definition: '大会前增补人数', source: '人大常委会任免', frequency: '月', current: '0', threshold: '大会前仍为 0', status: '预警' },
  { id: 'M3', group: '军队', name: '上将晋衔', definition: '晋衔仪式次数与人数', source: '新华社', frequency: '事件驱动', current: '上一次 2025-12-22', threshold: '一年以上无晋衔', status: '关注' },
  { id: 'M4', group: '军队', name: '台海月度架次', definition: '台防务部门公布的解放军飞机架次', source: 'TSM 汇总', frequency: '月', current: '232（10 月）', threshold: '超过 400 或有命名演习', status: '正常' },
  { id: 'E1', group: '经济', name: 'GDP 累计同比', definition: '不变价', source: '国家统计局', frequency: '季', current: '+4.6%（前三季度）', threshold: '单季低于 4.0%', status: '关注' },
  { id: 'E2', group: '经济', name: '核心 CPI', definition: '同比', source: '国家统计局', frequency: '月', current: '+1.1%（前三季度）', threshold: '连续 3 个月低于 0.5%', status: '正常' },
  { id: 'E3', group: '经济', name: 'PPI', definition: '同比', source: '国家统计局', frequency: '月', current: '+5.0%（9 月）', threshold: '上游涨价未传导到利润', status: '关注' },
  { id: 'E4', group: '经济', name: '房地产开发投资', definition: '累计同比', source: '国家统计局', frequency: '月', current: '−21.6%（1–10 月）', threshold: '降幅继续扩大', status: '预警' },
  { id: 'E5', group: '经济', name: '全国固定资产投资', definition: '累计同比', source: '国家统计局', frequency: '月', current: '−8.1%（1–10 月）', threshold: '为负', status: '预警' },
  { id: 'E6', group: '经济', name: '知识产权产品投资', definition: '累计同比', source: '国家统计局', frequency: '月', current: '+9.2%（1–10 月）', threshold: '低于 5%', status: '正常' },
  { id: 'X1', group: '外部', name: '中美元首当面会晤', definition: '年内次数', source: '外交部', frequency: '事件驱动', current: '2026 年 3 次', threshold: '已定会晤取消', status: '正常' },
  { id: 'X2', group: '外部', name: '中美休战剩余期限', definition: '距到期日天数', source: '双方公告', frequency: '周', current: '约 2027 年 1 月到期', threshold: '少于 30 天且无续期安排', status: '预警' },
  { id: 'D1', group: '话语', name: '个人化新提法', definition: '全会公报中以习命名的新思想条目', source: '全会公报', frequency: '每次全会', current: '习近平党建思想', threshold: '修改党章的提议', status: '关注' },
  { id: 'D2', group: '话语', name: '局内发声频率', definition: '《人民日报》头版非习常委个人署名文章数', source: '《人民日报》数字版', frequency: '月', current: '待建基线', threshold: '某人明显上升', status: '待评' },
];

/** 二十届政治局 · 第 16 节（added=true 为 2026 年增选） */
export const POLITBURO = [
  { name: '习近平', birthYear: 1953, post: '总书记', circle: '枢纽', ageOut2027: null, status: '在任', grade: 'A' },
  { name: '李强', birthYear: 1959, post: '常委、总理', circle: '闽浙沪旧部', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '赵乐际', birthYear: 1957, post: '常委、人大委员长', circle: '陕西关系', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '王沪宁', birthYear: 1955, post: '常委、政协主席', circle: '理论系统', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '蔡奇', birthYear: 1955, post: '常委、书记处书记、中办主任', circle: '闽浙沪旧部', ageOut2027: true, status: '在任', grade: 'A' },
  { name: '丁薛祥', birthYear: 1962, post: '常委、常务副总理', circle: '闽浙沪旧部', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '李希', birthYear: 1956, post: '常委、中纪委书记', circle: '陕西关系', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '王毅', birthYear: 1953, post: '外交系统负责人', circle: '专业官僚', ageOut2027: true, status: '在任', grade: 'A' },
  { name: '尹力', birthYear: 1962, post: '北京市委书记', circle: '专业官僚', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '石泰峰', birthYear: 1956, post: '中组部部长（2025-04 起）', circle: '专业官僚', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '刘国中', birthYear: 1962, post: '副总理', circle: '陕西关系', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '李干杰', birthYear: 1964, post: '统战部部长', circle: '专业官僚', ageOut2027: false, status: '在任', grade: 'A' },
  { name: '李书磊', birthYear: 1964, post: '中宣部部长', circle: '闽浙沪旧部', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '李鸿忠', birthYear: 1956, post: '人大副委员长', circle: '前任网络', ageOut2027: true, status: '在任', grade: 'B' },
  { name: '何立峰', birthYear: 1955, post: '副总理', circle: '闽浙沪旧部', ageOut2027: true, status: '在任', grade: 'A' },
  { name: '张国清', birthYear: 1964, post: '副总理', circle: '军工技术官僚', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '陈文清', birthYear: 1960, post: '中央政法委书记', circle: '安全系统', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '陈吉宁', birthYear: 1964, post: '上海市委书记', circle: '军工技术官僚', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '陈敏尔', birthYear: 1960, post: '天津市委书记', circle: '闽浙沪旧部', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '袁家军', birthYear: 1962, post: '重庆市委书记', circle: '军工技术官僚', ageOut2027: false, status: '在任', grade: 'B' },
  { name: '黄坤明', birthYear: 1956, post: '广东省委书记', circle: '闽浙沪旧部', ageOut2027: true, status: '在任', grade: 'A' },
  { name: '张升民', birthYear: 1958, post: '军委副主席（2026-10 增选）', circle: '陕西关系/军队', ageOut2027: true, status: '在任', grade: 'A', added: true },
  { name: '马兴瑞', birthYear: null, post: '2026-07 开除党籍公职', circle: '军工技术官僚', ageOut2027: null, status: '被查处', grade: 'A' },
  { name: '何卫东', birthYear: null, post: '2025-10 开除党籍军籍', circle: '军队', ageOut2027: null, status: '被查处', grade: 'A' },
  { name: '张又侠', birthYear: null, post: '2026-09 开除党籍军籍', circle: '友人与二代', ageOut2027: null, status: '被查处', grade: 'A' },
];

/** 二十届中央军委原成员 · 2022 年组成 */
export const CMC = [
  { name: '习近平', role2022: '主席', status: '在任', inOffice: true },
  { name: '张又侠', role2022: '副主席', status: '2026-09 开除党籍军籍', inOffice: false },
  { name: '何卫东', role2022: '副主席', status: '2025-10 开除党籍军籍', inOffice: false },
  { name: '李尚福', role2022: '委员、国防部长', status: '2024-06 开除党籍', inOffice: false },
  { name: '刘振立', role2022: '委员、联合参谋部参谋长', status: '2026-09 开除党籍军籍', inOffice: false },
  { name: '苗华', role2022: '委员、政治工作部主任', status: '2025-10 开除党籍军籍', inOffice: false },
  { name: '张升民', role2022: '委员、军委纪委书记', status: '2025-10 升副主席；2026-10 入政治局', inOffice: true },
];

/** 二十届中央全会出席人数（全会公报） */
export const PLENUMS = [
  { plenum: '二中', date: '2023-02', full: 203, alternates: 170 },
  { plenum: '三中', date: '2024-07', full: 199, alternates: 165 },
  { plenum: '四中', date: '2025-10', full: 168, alternates: 147 },
  { plenum: '五中', date: '2026-10', full: 162, alternates: 117 },
];

/** 情景主观概率 · 第 17 节（%） */
export const SCENARIOS = [
  { dimension: '领导层（二十一大）', id: 'L1', label: '连任，不明确接班', p: 75 },
  { dimension: '领导层（二十一大）', id: 'L2', label: '连任，出现明确接班安排', p: 22 },
  { dimension: '领导层（二十一大）', id: 'L3', label: '其他结果', p: 3 },
  { dimension: '经济政策（2027）', id: 'R1', label: '安全优先，渐进刺激', p: 70 },
  { dimension: '经济政策（2027）', id: 'R2', label: '大规模消费刺激＋对民企制度性放权', p: 30 },
  { dimension: '外部环境（2027）', id: 'X1', label: '中美与台海可管控', p: 75 },
  { dimension: '外部环境（2027）', id: 'X2', label: '休战破裂或台海危机', p: 25 },
];

/** L 维度信号似然表 · P(信号 | L1/L2/L3) */
export const L_SIGNALS = [
  { key: 's1', label: '1960 年代出生的政治局委员大会前兼任书记处要职或国家副主席', like: { L1: 0.1, L2: 0.7, L3: 0.3 } },
  { key: 's2', label: '任一常委被查或长期不公开露面', like: { L1: 0.05, L2: 0.05, L3: 0.3 } },
  { key: 's3', label: '军委大会前增补 ≥2 名委员', like: { L1: 0.6, L2: 0.6, L3: 0.3 } },
  { key: 's4', label: '《求是》/全会出现“干部年轻化”“培养接班人”的显著话语', like: { L1: 0.3, L2: 0.7, L3: 0.4 } },
  { key: 's5', label: '大会前提出修改党章写入新的个人化表述', like: { L1: 0.7, L2: 0.5, L3: 0.1 } },
  { key: 's6', label: '下一次全会出席率再降 5 个百分点以上', like: { L1: 0.4, L2: 0.3, L3: 0.5 } },
];

/** 2026 年主要指标同比（%） */
export const ECON = [
  { metric: '知识产权产品投资', period: '1–10 月', value: 9.2 },
  { metric: 'GDP', period: '前三季度', value: 4.6 },
  { metric: 'PPI', period: '前三季度', value: 2.3 },
  { metric: '核心 CPI', period: '前三季度', value: 1.1 },
  { metric: '全国固定资产投资', period: '1–10 月', value: -8.1 },
  { metric: '新建商品房销售额', period: '1–10 月', value: -14.3 },
  { metric: '房地产开发投资', period: '1–10 月', value: -21.6 },
];

/** 房地产开发投资累计同比（%），首项为 2025 年同期对照 */
export const PROPERTY_TREND = [
  { period: '2025 年 1–10 月', value: -14.7 },
  { period: '2026 年 1–6 月', value: -18.0 },
  { period: '2026 年 1–8 月', value: -19.9 },
  { period: '2026 年 1–10 月', value: -21.6 },
];

/** 2026 年事件日志 · 按编码协议，新事件置顶 */
export const EVENTS = [
  { date: '2026-11-19', event: '深圳 APEC 期间习特会晤；首次中俄美三国元首会晤', type: '外部', grade: 'A', indicators: 'X1', direction: 'X1 ↑' },
  { date: '2026-10-29', event: '五中全会：提出习近平党建思想；张升民入政治局；追认 33 人开除', type: '政治/话语', grade: 'A', indicators: 'P1 P6 D1', direction: 'L1 ↑' },
  { date: '2026-10-19', event: '前三季度 GDP +4.6%，投资下滑', type: '经济', grade: 'A', indicators: 'E1 E5', direction: 'R2 小幅 ↑' },
  { date: '2026-09-23', event: '皖、豫、闽三省省委书记调整', type: '政治', grade: 'A', indicators: 'P4', direction: '中性' },
  { date: '2026-09-23', event: '习近平访问华盛顿（至 25 日），休战延长两个月', type: '外部', grade: 'B', indicators: 'X1 X2', direction: 'X1 ↑' },
  { date: '2026-09-21', event: '张又侠、刘振立被开除党籍军籍', type: '军队', grade: 'A', indicators: 'M1 P2', direction: 'L1 ↑；L3 小幅 ↑' },
  { date: '2026-07-14', event: '马兴瑞被开除党籍公职', type: '政治', grade: 'A', indicators: 'P2', direction: 'L1 ↑' },
  { date: '2026-05-30', event: '湖北省委书记调整', type: '政治', grade: 'A', indicators: 'P4', direction: '中性' },
  { date: '2026-05-13', event: '特朗普访华（至 15 日）', type: '外部', grade: 'B', indicators: 'X1', direction: 'X1 ↑' },
  { date: '2026-01-24', event: '张又侠、刘振立被立案审查调查', type: '军队', grade: 'A', indicators: 'M1', direction: 'L1 ↑' },
];

export const MODEL_SOURCES = [
  { label: '二十届五中全会公报', url: 'https://id.china-embassy.gov.cn/wjyw/202610/t20261029_12049538.htm' },
  { label: '新华网 · 张又侠、刘振立被开除党籍军籍', url: 'https://www.news.cn/20260921/45d181bd2f6041e0bd1a653a3274d03e/c.html' },
  { label: '新华网 · 马兴瑞被开除党籍公职', url: 'https://www.news.cn/20260714/4d99c47e9d31440c8a2ff9a19623b326/c.html' },
  { label: '人民网 · 二十届历次全会', url: 'https://cpc.people.com.cn/GB/64162/448263/index.html' },
  { label: '国家统计局 · 1–10 月房地产', url: 'https://www.stats.gov.cn/sj/zxfbhjd/202611/t20261116_1965840.html' },
  { label: '外交部 · 习近平会见特朗普（深圳）', url: 'https://www.mfa.gov.cn/zyxw/202611/t20261119_12062924.shtml' },
];
