// ============================================================================
// 学者专栏 · 黄奇帆 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 网传托名"黄奇帆最新演讲"未见可靠出处者一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  macro: { label: '宏观与结构性改革', color: '#8b5cf6' },
  capital: { label: '金融与资本市场', color: '#22d3ee' },
  property: { label: '土地与房地产', color: '#c41e3a' },
  industry: { label: '产业与开放', color: '#10b981' },
  trade: { label: '贸易与全球秩序', color: '#e8a317' },
  digital: { label: '数字经济', color: '#fb923c' },
  social: { label: '社会与民生', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '黄奇帆',
  born: '1952 年 5 月 · 浙江诸暨',
  summary:
    '从上海焦化厂工人起步，历任上海市经委、浦东开发办、市政府副秘书长兼经委主任；2001 年赴重庆任副市长，2010—2016 年任重庆市市长；2017—2018 年任十二届全国人大财经委副主任委员。卸任后以中国金融四十人论坛（CF40）学术顾问、复旦大学特聘教授等身份持续演讲著述，议题集中于土地与房地产、结构性改革、开放型产业链、数字金融与贸易格局。',
  current: [
    '中国金融四十人论坛学术顾问',
    '中国国际经济交流中心原副理事长（任期未核）',
    '复旦大学特聘教授',
    '国家创新与发展战略研究会学术委员会常务副主席（任职时间未核）',
  ],
  sources: '财新网 2016-12-30 人事报道；公开履历（名人传记数据库 / 智库机构页面）；本人回忆文章。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 1,
  subtitle: '人物履历 · 人地钱房 · 产业开放 · 贸易格局 · 预判检验',
  span: '1995—2026',
  careerTitle: '履历时间线 · 上海 → 重庆 → 北京 → 智库',
  defaultTheme: 'property',
  moduleId: 'scholarHuangQifan',
  sourceNote: '著作原书 / 主办方页面 / 署名文章 / 主流媒体报道 · 对照数据：财政部、海关总署、国家统计局、国务院关税税则委员会',
};

export const CAREER_GROUPS = {
  sh: { label: '上海', color: '#22d3ee' },
  cq: { label: '重庆', color: '#c41e3a' },
  bj: { label: '全国人大', color: '#e8a317' },
  tk: { label: '智库/高校', color: '#10b981' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '上海焦化厂（工人 → 副厂长）', org: '上海', start: 1968.7, end: 1983.9, group: 'sh' },
  { id: 'c2', role: '上海市经委综合规划室副主任', org: '上海', start: 1984.3, end: 1987.0, group: 'sh' },
  { id: 'c3', role: '上海市经济信息中心主任', org: '上海', start: 1987.0, end: 1990.5, group: 'sh', note: '本人回忆为 1986 年起，与公开履历 1987-01 不一致' },
  { id: 'c4', role: '上海市人民政府浦东开发办公室副主任', org: '上海', start: 1990.5, end: 1993.0, group: 'sh', note: '本人回忆 1990-04-22 获任命；公开履历为 1990-06' },
  { id: 'c5', role: '浦东新区管委会副主任', org: '上海', start: 1993.0, end: 1994.7, group: 'sh', note: '起止时间未核实〔存疑〕' },
  { id: 'c6', role: '上海市委/市政府副秘书长、市体改委副主任、市委研究室主任', org: '上海', start: 1994.7, end: 1998.3, group: 'sh' },
  { id: 'c7', role: '上海市政府副秘书长、市经委主任', org: '上海', start: 1998.3, end: 2001.8, group: 'sh' },
  { id: 'c8', role: '重庆市副市长（2002-05 起兼市委常委）', org: '重庆', start: 2001.8, end: 2009.9, group: 'cq' },
  { id: 'c9', role: '重庆市代市长 → 市长', org: '重庆', start: 2009.9, end: 2017.0, group: 'cq', note: '2016-12-30 市人大常委会接受辞职' },
  { id: 'c10', role: '十二届全国人大财经委副主任委员', org: '北京', start: 2017.1, end: 2018.2, group: 'bj' },
  { id: 'c11', role: '智库与高校（CF40 学术顾问、复旦特聘教授等）', org: '—', start: 2018.2, end: 2026.75, group: 'tk' },
];

export const BOOKS = [
  { id: 'b1', year: 1995, title: '谈浦东开发的战略、政策及其管理', publisher: '上海人民出版社', isbn: '7208020019', themes: ['industry'], verified: 'reprint', note: '仅见二手书目记录' },
  { id: 'b2', year: 2020, title: '结构性改革：中国经济的问题与对策', publisher: '中信出版集团', date: '2020-08', themes: ['macro', 'property', 'capital'], verified: 'primary', note: '澎湃新闻 2020-08-18 书讯；定价 88 元' },
  { id: 'b3', year: 2020, title: '分析与思考：黄奇帆的复旦经济课', publisher: '上海人民出版社', isbn: '9787208164321', themes: ['macro', 'property'], verified: 'primary' },
  { id: 'b4', year: 2022, title: '数字经济：内涵与路径', publisher: '中信出版集团', date: '2022-08', isbn: '9787521745023', coauthors: '朱岩、邵平', themes: ['digital'], verified: 'primary' },
  { id: 'b5', year: 2022, title: '战略与路径：黄奇帆的十二堂经济课', publisher: '上海人民出版社', date: '2022-10', isbn: '9787208178212', themes: ['macro', 'trade', 'industry'], verified: 'primary' },
  { id: 'b6', year: 2024, title: '重组与突破', publisher: '中信出版集团（CF40 书系）', date: '2024-04', isbn: '9787521764055', themes: ['property', 'social', 'industry', 'capital'], verified: 'primary', note: '含地票、公租房、户籍改革、渝新欧、融资平台"十要十不能"、REITs 等专章' },
  { id: 'b7', year: 2024, title: '新质生产力', publisher: '浙江人民出版社', date: '2024-05', coauthors: '等（合著）', themes: ['industry', 'digital'], verified: 'reprint', note: '另有湖南人民出版社 2024-02 同名书，勿混淆' },
  { id: 'b8', year: null, title: '读懂中国，关键要读懂中国式现代化', publisher: '未核实', themes: ['macro'], verified: 'doubt', note: '仅见智库介绍提及，出版社与年份未核〔存疑〕' },
];

/** 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k2010a', date: '2010-02-27', form: '采访', venue: '《21世纪经济报道》专访 · 重庆公租房', source: '21世纪经济报道（新浪财经转载）', url: 'https://finance.sina.com.cn/roll/20100227/03477468531.shtml', verified: 'media', themes: ['social', 'property'] },
  { id: 'k2010b', date: '2010-04-16', form: '采访', venue: '《经济参考报》· 笔记本电脑产业与"一头在外"', source: '经济参考报', url: 'http://jjckb.xinhuanet.com/gnyw/2010-04/16/content_217273.htm', verified: 'media', themes: ['industry', 'trade'] },
  { id: 'k2010c', date: '2010-07-28', form: '讲话', venue: '重庆市户籍制度改革工作会议', source: '新浪财经', verified: 'media', themes: ['social'] },
  { id: 'k2010d', date: '2010', form: '采访', venue: '地票制度专访', source: '武汉市自然资源和规划局网站转载', verified: 'reprint', themes: ['property'] },
  { id: 'k2010e', date: '2010-11-01', form: '讲话', venue: '重庆公租房政策表态', source: '新浪财经', verified: 'media', themes: ['social', 'property'] },
  { id: 'k2015', date: '2015-05-07', form: '署名文章', venue: '署名文章 · 重庆地票制度', source: '中国网', verified: 'primary', themes: ['property'] },
  { id: 'k2017', date: '2017-05-26', form: '讲座', venue: '复旦大学"中国大问题"讲堂第 11 讲 · 房地产长效机制', source: '复旦大学经济学院；界面新闻、观察者网', url: 'https://econ.fudan.edu.cn/info/1645/14336.htm', verified: 'primary', themes: ['property', 'macro'] },
  { id: 'k2018a', date: '2018-12-13', form: '采访', venue: '侠客岛专访 · 浦东开发亲历', source: '人民日报海外版·侠客岛（人民网转载）', verified: 'media', themes: ['industry'] },
  { id: 'k2018b', date: '2018', form: '采访', venue: '界面新闻 · 浦东开发回顾', source: '界面新闻', url: 'https://www.jiemian.com/article/2708548.html', verified: 'media', themes: ['industry', 'capital'] },
  { id: 'k2018c', date: '2018-12-22', form: '讲话', venue: '2018—2019 中国经济年会', source: '每日经济新闻', url: 'https://www.nbd.com.cn/articles/2018-12-22/1284413.html', verified: 'media', themes: ['trade'] },
  { id: 'k2018d', date: '2018-12-29', form: '讲话', venue: '第十七届中国经济论坛', source: '中国经济周刊', verified: 'media', themes: ['trade'] },
  { id: 'k2019a', date: '2019-01-12', form: '讲话', venue: '第二十三届中国资本市场论坛', source: '新浪财经', verified: 'media', themes: ['capital'] },
  { id: 'k2019b', date: '2019-10-28', form: '讲话', venue: '首届外滩金融峰会', source: '清华大学国家金融研究院网站转载', url: 'https://iii.tsinghua.edu.cn/info/1023/1131.htm', verified: 'media', themes: ['digital', 'capital'] },
  { id: 'k2020a', date: '2020-05-11', form: '讲座', venue: 'CF40 浦山讲坛第 16 期 · 土地制度改革', source: '中国金融四十人论坛（清华大学国家金融研究院网站转载）', verified: 'media', themes: ['property', 'macro'] },
  { id: 'k2020b', date: '2020-07-12', form: '讲座', venue: '混沌大学 · 数字化经济的底层逻辑', source: '中央财经大学中国互联网经济研究院网站转载', url: 'https://ccie.cufe.edu.cn/info/1033/1287.htm', verified: 'reprint', themes: ['digital', 'capital'] },
  { id: 'k2020c', date: '2020-10-25', form: '讲话', venue: '第二届外滩金融峰会', source: '21世纪经济报道', verified: 'media', themes: ['digital'] },
  { id: 'k2023a', date: '2023-03-25', form: '讲话', venue: '中国发展高层论坛 2023 年年会', source: '凤凰网、北京周报', url: 'https://news.ifeng.com/c/8ORUfgvxI4o', verified: 'media', themes: ['trade', 'industry'] },
  { id: 'k2023b', date: '2023-09-24', form: '讲话', venue: '第五届外滩金融峰会', source: '财新网', verified: 'media', themes: ['digital', 'trade'] },
  { id: 'k2024a', date: '2024-03-20', form: '署名文章', venue: '署名文章 · 以"先立后破"化解房地产风险', source: '第一财经', url: 'https://www.yicai.com/news/102033919.html', verified: 'primary', themes: ['property', 'capital'] },
  { id: 'k2024b', date: '2024-07-11', form: '文章', venue: '回忆重庆户籍制度改革', source: '腾讯新闻', verified: 'media', themes: ['social'] },
  { id: 'k2024c', date: '2024-09-05', form: '讲话', venue: '第六届外滩金融峰会 · 人民币国际化', source: '清华大学国家金融研究院网站转载', verified: 'media', themes: ['capital', 'trade'] },
  { id: 'k2024d', date: '2024-12-27', form: '讲座', venue: '年末公开课 · 应对外部冲击', source: '中国经济体制改革研究会网站转载', verified: 'reprint', themes: ['trade', 'macro'] },
  { id: 'k2025a', date: '2025-01-12', form: '讲话', venue: '经济峰会演讲（活动名称未核实）', source: '腾讯新闻等转载', verified: 'reprint', themes: ['property'] },
  { id: 'k2025b', date: '2025-05-25', form: '讲座', venue: '中欧 EMBA · 前沿观察', source: '中欧国际工商学院 EMBA 官网', url: 'https://cn.ceibs.edu/emba/frontier-observation/27088', verified: 'primary', themes: ['trade', 'industry'] },
  { id: 'k2025c', date: '2025-07-10', form: '讲话', venue: '贝壳财经年会', source: '新京报贝壳财经（新浪财经转载，录音整理）', verified: 'media', themes: ['industry', 'macro'] },
  { id: 'k2025d', date: '2025', form: '署名文章', venue: '署名文章 · 城乡融合发展的目标路径', source: '宏观中国网站', url: 'https://mcrp.macrochina.cn/u/60/archives/2025/4254.html', verified: 'reprint', themes: ['social'] },
  { id: 'k2026a', date: '2026-05', form: '讲话', venue: '2026 清华五道口全球金融论坛（成都）', source: '清华大学新闻网', url: 'https://www.tsinghua.edu.cn/info/2246/126531.htm', verified: 'primary', themes: ['trade'] },
  { id: 'k2026b', date: '2026-05', form: '讲话', venue: '同场演讲整理稿（五道口论坛）', source: '网易号·亿欧、中国地产基金百人会、红星资本局', url: 'https://www.163.com/dy/article/KTDF6RH605118K7K.html', verified: 'reprint', themes: ['trade', 'social'] },
  { id: 'k2026c', date: '2026-08-03', form: '讲座', venue: '华夏大讲堂', source: '华夏银行', verified: 'primary', themes: ['macro'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 土地与房地产 ——
  { id: 'p1', k: 'k2017', theme: 'property', type: '原话', text: '一个城市土地供应总量，按一人100平方米，100万人就供100平方公里，一千万人就供1000平方公里。' },
  { id: 'p2', k: 'k2017', theme: 'property', type: '原话', text: '坚决守住开发商自有资金拿地这条底线。任何开发商拿地的钱必须是自有资金，这个规定早已有之。' },
  { id: 'p3', k: 'k2017', theme: 'property', type: '转述', text: '城市人均 100 平方米建设用地中，基础设施约 55、工业约 20、住宅约 20、商业约 5；房价中地价宜约占三分之一；提出土地、金融、税收、租赁市场、地票五项长效机制，房产税"适时征收"。' },
  { id: 'p4', k: 'k2010d', theme: 'property', type: '转述', text: '介绍重庆地票：农村建设用地复垦为耕地后形成指标入市交易，截至采访时成交约 2.57 万亩、29.77 亿元。' },
  { id: 'p5', k: 'k2015', theme: 'property', type: '转述', text: '署名文章称地票运行六年累计交易 15.26 万亩、307.59 亿元，均价约 20 万元/亩。' },
  { id: 'p6', k: 'k2020a', theme: 'property', type: '原话', text: '新一轮的土地改革，其伟大意义不亚于80年代农村承包制改革……也不亚于90年代初的土地批租市场的改革……会在今后数十年产生几十万亿级的红利。' },
  { id: 'p7', k: 'k2020a', theme: 'property', type: '转述', text: '以重庆为例，称当地房价约为家庭年收入的 6—7 倍，作为土地供给与房价调控的正面样本。' },
  { id: 'p8', k: 'k2024a', theme: 'property', type: '原话', text: '将现有‘按揭后即月供’的做法改为‘不交楼、不月供’，以压实银行监管责任' },
  { id: 'p9', k: 'k2024a', theme: 'property', type: '转述', text: '主张房企资产负债率不超过 70%、不得"背着银行炒地皮"，并取消限购等行政性限制，以"先立后破"建立新发展模式。' },
  { id: 'p10', k: 'k2025a', theme: 'property', type: '转述', text: '称全国卖地收入由 2020 年约 8.7 万亿元降至 2024 年"3 万亿左右"，2024 年 11 月房价较 2020 年下跌约 40%；房价收入比已由 23—30 倍降至 10—20 倍，十年内将回落至 8—10 倍；重申"自有资本买地是个铁的原则"。' },

  // —— 社会与民生 ——
  { id: 's1', k: 'k2010a', theme: 'social', type: '原话', text: '外地人，在重庆找到工作，就说明这个城市需要你，就给住房，为什么要搞户口限制呢。' },
  { id: 's2', k: 'k2010a', theme: 'social', type: '转述', text: '重庆计划 10 年建设公租房 4000 万平方米，其中前三年 2000 万平方米，不设户籍门槛。' },
  { id: 's3', k: 'k2010e', theme: 'social', type: '转述', text: '强调公租房"姓公不姓私"，保障对象按"3+1"类群体划定。' },
  { id: 's4', k: 'k2010c', theme: 'social', type: '转述', text: '户籍制度改革目标：2011 年底前转户 338 万人，至 2020 年累计转户 1000 万人。' },
  { id: 's5', k: 'k2024b', theme: 'social', type: '转述', text: '回忆称至 2016 年底重庆累计转户 449.7 万人，户籍人口城镇化率由约 29% 升至 47.9%，公租房建成 4000 万平方米（本人口径）。' },
  { id: 's6', k: 'k2025d', theme: 'social', type: '转述', text: '主张户籍人口城镇化率由约 48% 提高到 2040 年约 78%，2030 年前推动约 2.5 亿人落户城镇。' },

  // —— 金融与资本市场 ——
  { id: 'f1', k: 'k2019a', theme: 'capital', type: '原话', text: '我相信我国真正的退市制度往后十年会非常良好的展开。随着退市制度的完善，注册制应运而生就会健康发展。' },
  { id: 'f2', k: 'k2019a', theme: 'capital', type: '转述', text: '据记者转述：注册制"条件成熟之后就会改革，时间并不会太长远"；A 股约 92% 交易量来自散户，企业年金等长期资金是短板。' },
  { id: 'f3', k: 'k2018b', theme: 'capital', type: '转述', text: '概括浦东开发方略为"金融先行、贸易兴市、基础铺路、工业联动"。' },
  { id: 'f4', k: 'k2024c', theme: 'capital', type: '转述', text: '人民币国际化并非要取代美元的国际地位，并提出推进人民币国际化的四方面举措。' },
  { id: 'f5', k: 'k2020b', theme: 'capital', type: '转述', text: '平台开展放贷须有足额资本金，自有资本占比不低于约 10%，不能以极少资本撬动巨额信贷。' },

  // —— 数字经济 ——
  { id: 'd1', k: 'k2019b', theme: 'digital', type: '原话', text: '中国人民银行很可能是全球第一个推出数字货币的央行。' },
  { id: 'd2', k: 'k2019b', theme: 'digital', type: '转述', text: '将央行数字货币（DCEP）定位为对流通中现金 M0 的替代。' },
  { id: 'd3', k: 'k2020b', theme: 'digital', type: '转述', text: '提出数字化平台以"五全信息"为基础重构产业链，数据成为新的生产要素。' },
  { id: 'd4', k: 'k2020c', theme: 'digital', type: '原话', text: '在产业互联网时代，任何数字化平台的发展，不能靠简单的烧钱来扩大市场占有率，也不能让客户有成本无效果、长期赔钱，这是不可持续的自杀行为。' },
  { id: 'd5', k: 'k2023b', theme: 'digital', type: '转述', text: '建议将自贸试验区建设为数字经济发展示范区。' },

  // —— 产业与开放 ——
  { id: 'i1', k: 'k2018a', theme: 'industry', type: '原话', text: '十条政策的全部内容十分简单，就两页纸。' },
  { id: 'i2', k: 'k2010b', theme: 'industry', type: '转述', text: '以"一头在外"加工贸易集群模式发展笔记本电脑产业，并预计全球笔电销量由 2008 年 1.6 亿台增至 2012 年 3.2 亿台。' },
  { id: 'i3', k: 'k2023a', theme: 'industry', type: '转述', text: '未来的旗舰型终端产品将是无人驾驶新能源汽车、人形机器人等。' },
  { id: 'i4', k: 'k2025b', theme: 'industry', type: '原话', text: '发展经济抓新质生产力不抓生产性服务业，就是南辕北辙。' },
  { id: 'i5', k: 'k2025c', theme: 'industry', type: '转述', text: '生产性服务业占 GDP 比重当前约 27%—28%，应在 2040 年达 35%、2050 年达 40%，同时制造业占比保持在 25% 以上。' },

  // —— 贸易与全球秩序 ——
  { id: 't1', k: 'k2018c', theme: 'trade', type: '转述', text: '建议在长三角设立自由贸易港。' },
  { id: 't2', k: 'k2018d', theme: 'trade', type: '原话', text: '三零对中国是有利的。' },
  { id: 't3', k: 'k2023a', theme: 'trade', type: '原话', text: '单一市场是指法律体系统一、税务体系统一、商业规则统一、语言文化统一的市场。' },
  { id: 't4', k: 'k2023a', theme: 'trade', type: '转述', text: '判断"脱钩断链"不会成功。' },
  { id: 't5', k: 'k2024d', theme: 'trade', type: '转述', text: '称中国进口关税总水平 2023 年"差不多降到了 6% 左右"，并预计 2024、2025 年将降到 5% 以下。' },
  { id: 't6', k: 'k2025b', theme: 'trade', type: '原话', text: '一，丢掉幻想，准备斗争；二，保持定力，增强信心；三，坚守底线，灵活应对；四，抓住关键，补上短板' },
  { id: 't7', k: 'k2025b', theme: 'trade', type: '转述', text: '以"四个原则、五张牌"框架应对关税战；称 2024 年出口"34000 多亿美元"、制造业占 GDP 约 34%。' },
  { id: 't8', k: 'k2026a', theme: 'trade', type: '转述', text: '清华官方报道：提出优化贸易顺差、治理"内卷式"竞争。' },
  { id: 't9', k: 'k2026b', theme: 'trade', type: '转述', text: '整理稿：贸易顺差占 GDP 2%—3% 较为合理；提出人民币十年渐进升值 15%—20%、下调出口退税、关税再降 2—3 个百分点、减少加班、增加 5—10 天假期等五项措施；预计 2026 年顺差仍在 1.2 万亿美元左右。' },

  // —— 宏观与结构性改革 ——
  { id: 'm1', k: 'k2017', theme: 'macro', type: '转述', text: '以"十大失衡"概括中国经济与房地产领域的结构性矛盾，并据此提出长效机制。' },
  { id: 'm3', k: 'k2026c', theme: 'macro', type: '转述', text: '提出"三个融合"：城乡融合、科技与产业融合、国内与国际融合。' },
];

export const CLAIMS = RAW_CLAIMS.map((c) => {
  const k = CORPUS_BY_ID[c.k];
  return {
    id: c.id,
    theme: c.theme,
    type: c.type,
    text: c.text,
    date: k.date,
    venue: k.venue,
    source: k.source,
    url: k.url,
    verified: c.verified ?? k.verified,
  };
});

export const QUOTES = CLAIMS.filter((c) => c.type === '原话');

export const FEATURED = ['p1', 'p6', 's1', 'f1', 'd4', 'i4', 't3', 't6'];

export const THEME_LINKS = {
  property: [{ to: '/housing', label: '住房地产' }, { to: '/debt', label: '地方债务' }],
  social: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }],
  capital: [{ to: '/capital-market', label: '资本市场' }, { to: '/rmb', label: '人民币' }],
  digital: [{ to: '/digital', label: '数字经济' }, { to: '/data-element', label: '数据要素' }],
  industry: [{ to: '/manufacturing', label: '制造业' }, { to: '/supplychain', label: '供应链' }],
  trade: [{ to: '/foreign-trade', label: '外贸' }, { to: '/econ-dashboard', label: '经济大盘' }],
  macro: [{ to: '/econ-dashboard', label: '经济大盘' }, { to: '/japan-lost-decades', label: '中日比较' }],
};

export const THEME_INTRO = {
  property: '"人地钱房"是其最系统的一条线：以常住人口决定土地供给、以自有资金约束拿地、以地票打通城乡建设用地指标，并在 2024 年后转向"先立后破"的存量风险处置。',
  social: '重庆任内的户籍改革与公租房构成"民生—城镇化"组合，卸任后延伸为以户籍城镇化率为核心指标的城乡融合路线图。',
  capital: '关注资本市场基础制度（注册制、退市、长期资金）与金融科技的资本约束，对人民币国际化持渐进立场。',
  digital: '较早讨论央行数字货币与平台经济治理，强调产业互联网阶段平台须回归实体效率、受资本金约束。',
  industry: '从浦东开发到重庆笔电集群、渝新欧通道，其产业观以"产业链集群 + 开放通道"为骨架，近年强调生产性服务业对新质生产力的支撑。',
  trade: '立场由"对标高水平规则、以开放倒逼改革"延续至关税战时期的"四个原则、五张牌"，2026 年转向讨论顺差规模与内部再平衡。',
  macro: '以"结构性改革"为统摄框架，把土地、金融、户籍、开放等分领域主张串成长效机制叙事。',
};

// ============================================================================
// 预判检验台账：只收可被数据检验的前瞻性表述；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '2019-01-12', venue: '第二十三届中国资本市场论坛（记者转述）',
    claim: '注册制"条件成熟之后就会改革，时间并不会太长远"',
    check: '2019-07-22 科创板以注册制试点开市；2023-02-17 全面实行股票发行注册制。',
    dataSrc: '上交所、中国证监会公告',
  },
  {
    id: 'L2', status: 'done', type: '转述', date: '2010-02-27', venue: '《21世纪经济报道》专访',
    claim: '10 年建设公租房 4000 万平方米',
    check: '本人 2024 年回忆称已建成 4000 万平方米；重庆官方累计口径未独立核实，结论依赖当事人口径。',
    dataSrc: '腾讯新闻 2024-07-11 回忆文章',
  },
  {
    id: 'L3', status: 'failed', type: '原话', date: '2019-10-28', venue: '首届外滩金融峰会',
    url: 'https://iii.tsinghua.edu.cn/info/1023/1131.htm',
    claim: '中国人民银行很可能是全球第一个推出数字货币的央行。',
    check: '巴哈马"沙元"于 2020-10-20 正式推出，被普遍视为首个全国性央行数字货币；数字人民币 2020 年起分批试点，至核验日仍处试点扩围阶段。',
    dataSrc: '巴哈马央行公告；中国人民银行数字人民币试点信息',
  },
  {
    id: 'L4', status: 'failed', type: '转述', date: '2024-12-27', venue: '年末公开课（转载稿）',
    claim: '进口关税总水平 2024、2025 年将降到 5% 以下',
    check: '国务院关税税则委员会《2025 年关税调整方案》载明关税总水平为 7.3%；2026 年方案未公布总水平。',
    dataSrc: '国务院关税税则委员会 2025 年关税调整方案',
  },
  {
    id: 'L5', status: 'open', type: '原话', date: '2019-01-12', venue: '第二十三届中国资本市场论坛',
    claim: '我相信我国真正的退市制度往后十年会非常良好的展开。',
    check: '检验窗口至 2029 年。A 股退市家数：2022 年 46 家、2023 年 45 家、2024 年 52 家、2025 年 31 家，常态化退市已成形但仍在观察期。',
    dataSrc: '沪深北交易所年度统计（媒体汇总）',
  },
  {
    id: 'L6', status: 'open', type: '转述', date: '2017-05-26', venue: '复旦"中国大问题"讲堂',
    claim: '房产税"适时征收"',
    check: '2021-10-23 全国人大常委会授权部分地区开展试点；2022-03-16 财政部称当年不具备扩大试点条件。至核验日未见立法落地。',
    dataSrc: '全国人大常委会授权决定；财政部 2022-03-16 答记者问',
  },
  {
    id: 'L7', status: 'open', type: '原话', date: '2024-03-20', venue: '第一财经署名文章',
    url: 'https://www.yicai.com/news/102033919.html',
    claim: '将现有‘按揭后即月供’的做法改为‘不交楼、不月供’',
    check: '至核验日未检索到全国性"不交楼不月供"制度；现房销售与预售资金监管在部分城市推进。',
    dataSrc: '住建部及地方预售资金监管政策（检索截至 2026-09）',
  },
  {
    id: 'L8', status: 'open', type: '转述', date: '2025-01-12', venue: '经济峰会演讲（转载稿）',
    claim: '房价收入比十年内回落至 8—10 倍',
    check: '检验窗口至约 2035 年。70 城指数：新房较峰值累计约 -13.97%，二手房约 -23.42%（至 2026-08）。',
    dataSrc: '国家统计局 70 个大中城市住宅销售价格指数（本站住房模块测算）',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2026-05', venue: '清华五道口全球金融论坛整理稿',
    claim: '2026 年货物贸易顺差仍在 1.2 万亿美元左右',
    check: '2026 年 1—8 月进出口 34.78 万亿元、出口 20.17 万亿元，隐含顺差约 5.56 万亿元；线性外推全年约 8.3 万亿元，量级与该判断接近，待全年海关数据。',
    dataSrc: '海关总署 1—8 月数据（本站经济大盘模块）',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2026-05', venue: '清华五道口全球金融论坛整理稿',
    claim: '人民币十年渐进升值 15%—20%；增加 5—10 天假期',
    check: '属政策建议型长期目标。人民币对美元中间价 2026-09-28 为 6.7399；法定节假日未见新增调整。',
    dataSrc: '中国外汇交易中心；国务院办公厅节假日安排',
  },
  {
    id: 'L11', status: 'open', type: '转述', date: '2023-03-25', venue: '中国发展高层论坛',
    claim: '"脱钩断链"不会成功',
    check: '2025 年出口 3.8 万亿美元、同比 +5.5%，但对美出口约 -20%，呈"总量韧性 + 双边收缩"并存，尚难定论。',
    dataSrc: '海关总署 2026-01-14 发布；财新网',
  },
  {
    id: 'L12', status: 'open', type: '转述', date: '2025', venue: '署名文章 · 城乡融合发展的目标路径',
    claim: '户籍人口城镇化率 2040 年达约 78%',
    check: '2023 年户籍人口城镇化率 48.3%，此后官方未再例行公布；常住人口城镇化率 2025 年末 67.89%。',
    dataSrc: '国家统计局；国家发展改革委',
  },
  {
    id: 'L13', status: 'open', type: '转述', date: '2025-07-10', venue: '贝壳财经年会',
    claim: '生产性服务业占 GDP 比重 2040 年达 35%',
    check: '长期目标，统计口径（生产性服务业分类）尚无年度官方占比序列，暂无法逐年跟踪。',
    dataSrc: '国家统计局《生产性服务业统计分类》',
  },
  {
    id: 'L14', status: 'open', type: '转述', date: '2018-12-22', venue: '2018—2019 中国经济年会',
    claim: '在长三角设立自由贸易港',
    check: '上海 2019 年设自贸试验区临港新片区（非自由贸易港）；自由贸易港落地海南，2025 年实施全岛封关。长三角自贸港至今未设立。',
    dataSrc: '国务院临港新片区总体方案；海南自由贸易港建设总体方案',
  },
  {
    id: 'L15', status: 'open', type: '转述', date: '2010-07-28', venue: '重庆市户籍制度改革工作会议',
    claim: '至 2020 年累计转户 1000 万人',
    check: '可得数据止于 2016 年底累计 449.7 万人（本人回忆口径），2020 年累计数未见官方发布，无法闭环。',
    dataSrc: '腾讯新闻 2024-07-11 回忆文章',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '2020 年卖地收入', said: 8.7, official: 8.4142, unit: '万亿元', saidSrc: '2025-01-12 峰会（转载稿）', offSrc: '财政部：国有土地使用权出让收入 84142 亿元', comparable: true },
  { id: 'n2', label: '2024 年卖地收入', said: 3.0, official: 4.8699, unit: '万亿元', saidSrc: '2025-01-12 峰会（转载稿）"3 万亿左右"', offSrc: '财政部：48699 亿元', comparable: true },
  { id: 'n3', label: '2025 年关税总水平', said: 5.0, official: 7.3, unit: '%', saidSrc: '2024-12-27 公开课：预计降到 5% 以下（取上限）', offSrc: '国务院关税税则委员会 2025 年方案', comparable: true },
  { id: 'n4', label: '2024 年出口额', said: 3.4, official: 3.577, unit: '万亿美元', saidSrc: '2025-05-25 中欧 EMBA："34000 多亿美元"', offSrc: '海关总署：2024 年出口约 3.58 万亿美元', comparable: true },
  { id: 'n5', label: '2025 年出口额', said: 3.0, official: 3.8, unit: '万亿美元', saidSrc: '2026-05 整理稿"3 万亿美元"（疑为记录误差）', offSrc: '海关总署 2026-01-14：3.8 万亿美元', comparable: true },
  { id: 'n6', label: '2024 年制造业占 GDP', said: 34, official: 24.9, unit: '%', saidSrc: '2025-05-25 中欧 EMBA（另有场合称"接近 30%"）', offSrc: '工信部/国家统计局：制造业增加值占比 24.9%', comparable: true },
  { id: 'n7', label: '房价累计跌幅', said: 40, official: 23.42, unit: '%', saidSrc: '2025-01-12 峰会：2024-11 较 2020 年约 -40%', offSrc: '70 城二手住宅较峰值 -23.42%（至 2026-08，窗口不同）', comparable: false },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '人地钱房', '民生城镇化', '金融制度', '产业开放', '贸易格局'],
  nodes: [
    { id: 'core', name: '结构性改革\n长效机制', cat: 0, size: 58 },
    { id: 'land', name: '人口定地', cat: 1, size: 34 },
    { id: 'dipiao', name: '地票', cat: 1, size: 38 },
    { id: 'selfcap', name: '自有资金拿地', cat: 1, size: 30 },
    { id: 'ptax', name: '房产税', cat: 1, size: 24 },
    { id: 'xianli', name: '先立后破', cat: 1, size: 28 },
    { id: 'hukou', name: '户籍改革', cat: 2, size: 34 },
    { id: 'gzf', name: '公租房', cat: 2, size: 32 },
    { id: 'urban', name: '城乡融合', cat: 2, size: 30 },
    { id: 'reg', name: '注册制 / 退市', cat: 3, size: 28 },
    { id: 'dcep', name: '数字货币', cat: 3, size: 24 },
    { id: 'platform', name: '平台资本约束', cat: 3, size: 24 },
    { id: 'rmb', name: '人民币国际化', cat: 3, size: 26 },
    { id: 'laptop', name: '笔电"一头在外"', cat: 4, size: 28 },
    { id: 'yxo', name: '渝新欧', cat: 4, size: 30 },
    { id: 'pss', name: '生产性服务业', cat: 4, size: 28 },
    { id: 'ftz', name: '自贸区 / 自贸港', cat: 4, size: 26 },
    { id: 'rules', name: '三零规则 / 单一市场', cat: 5, size: 28 },
    { id: 'fourfive', name: '四个原则 · 五张牌', cat: 5, size: 30 },
    { id: 'surplus', name: '顺差再平衡', cat: 5, size: 30 },
    { id: 'neijuan', name: '反内卷', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'land'], ['core', 'hukou'], ['core', 'reg'], ['core', 'pss'], ['core', 'rules'],
    ['land', 'dipiao'], ['land', 'selfcap'], ['land', 'ptax'], ['selfcap', 'xianli'],
    ['dipiao', 'hukou'], ['hukou', 'gzf'], ['hukou', 'urban'], ['dipiao', 'urban'],
    ['reg', 'rmb'], ['dcep', 'platform'], ['reg', 'platform'],
    ['laptop', 'yxo'], ['yxo', 'ftz'], ['pss', 'laptop'], ['ftz', 'rules'],
    ['rules', 'fourfive'], ['fourfive', 'surplus'], ['surplus', 'neijuan'], ['surplus', 'rmb'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '重庆"八大投"与地方债务规模',
    sides: [
      { who: '黄奇帆（经刘海影转述）', view: '重庆政府性债务可控，所引口径约 1200 亿元（转述，未见原始出处）。' },
      { who: '刘海影（财新博客）', view: '结合审计署 2010 年末区县债务数据，估算重庆融资平台贷款约 4620 亿元，认为"八大投"模式隐含杠杆远高于官方口径。' },
    ],
    note: '双方口径（政府直接债务 vs 平台贷款全口径）不同，数字不可直接对比；映象网 2012-03-26 亦有相关讨论。本站地方债务模块提供全国口径。',
  },
  {
    id: 'x2',
    title: '地票制度的效果评价',
    sides: [
      { who: '周其仁（经济观察报"城乡中国"专栏 2014-07-28，北大国发院网站转载）', view: '署名文章题为《"地票"是一个了不起的创造》，认为地票把城乡建设用地"挂钩"推进了市场（详见周其仁看板土地领域）。' },
      { who: '批评性研究（S-CAD 论文等）', view: '转述：农户实际参与度偏低，复垦指标与耕地保护、开发需求之间存在张力。' },
    ],
    note: '重庆官方口径：净收益按农户 85%、集体 15% 分配（2016 年），至 2022-08 累计约 35.4 万亩、695 亿元。',
  },
  {
    id: 'x3',
    title: '数字口径前后不一',
    sides: [
      { who: '其公开表述', view: '卖地收入、关税水平、出口额、制造业占比等在不同场合存在数值差异（详见"预判检验台账"中的口径对照图）。' },
      { who: '官方统计', view: '以财政部、海关总署、国务院关税税则委员会、国家统计局公布数据为准。' },
    ],
    note: '部分偏差可能源自整理稿记录误差（如 2025 年出口"3 万亿美元"），已按"转载"级别降权，不作为其本人立场定论。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传"黄奇帆最新演讲"拼接稿', status: '不收录', reason: '大量自媒体稿件拼接不同年份讲话或托名创作，无主办方、日期或原始媒体可追溯。' },
  { id: 'q2', item: '2026-03-27 全球开发者先锋大会发言', status: '不收录', reason: '仅见视频平台二次转载，未见主办方或主流媒体原文。' },
  { id: 'q3', item: '吴敬琏对重庆模式的批评', status: '〔存疑〕', reason: '仅见境外媒体二手转述，未能找到吴敬琏本人公开原文，故不作引语。' },
  { id: 'q4', item: '2026 五道口论坛整理稿中的"重庆"地点', status: '以官方为准', reason: '清华大学新闻网载明论坛在成都举办；整理稿存在地点与数字记录误差。' },
  { id: 'q5', item: '《读懂中国，关键要读懂中国式现代化》', status: '〔存疑〕', reason: '出版社、年份未核实。' },
  { id: 'q6', item: '上海市经济信息中心、浦东开发办任职起点', status: '并陈', reason: '本人回忆（1986 年；1990-04-22）与公开履历（1987-01；1990-06）不一致。' },
  { id: 'q7', item: '2010 年全球笔电 2012 年达 3.2 亿台的预测', status: '未检验', reason: '缺少与其口径一致的全球销量权威统计，暂不列入台账。' },
  { id: 'q8', item: '"十三届全国人大财经委副主任委员"说法', status: '更正', reason: '正确为十二届（2017-02 至 2018-03）。' },
  { id: 'q9', item: '著作《数字化经济》', status: '更正', reason: '未见此书；对应为合著《数字经济：内涵与路径》（2022）及 2020 年讲座"数字化经济的底层逻辑"。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
