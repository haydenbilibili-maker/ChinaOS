// ============================================================================
// 学者专栏 · 余永定 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 网传托名"余永定最新讲话"未见可靠出处者一律不收录；"整理未经本人确认"的会议稿按 media 计。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  growth: { label: '宏观与增长', color: '#8b5cf6' },
  fiscal: { label: '财政扩张与地方债', color: '#c41e3a' },
  monetary: { label: '货币政策与通缩', color: '#22d3ee' },
  fx: { label: '汇率与资本账户', color: '#e8a317' },
  reserves: { label: '外汇储备与美债', color: '#10b981' },
  global: { label: '中美与全球金融', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '余永定',
  born: '1948 年 11 月 · 江苏南京（籍贯广东台山）',
  summary:
    '1965 年毕业于北京四中，中专毕业后在北京重型机器厂做工十年；1979 年进入中国社会科学院世界经济研究所，1988—1994 年赴牛津大学纳菲尔德学院攻读博士（DPhil）。1998—2009 年任社科院世界经济与政治研究所所长，2004—2006 年任中国人民银行货币政策委员会委员，2006 年当选社科院学部委员，2013—2018 年任十二届全国政协委员（外事委员会）。研究主线从"双顺差—美元陷阱"与汇率、资本账户之辩，延伸到 2019 年后的"保增长—扩张性财政—基建投资"主张与 2022 年后的外储安全议题，是国内扩张性财政派的代表人物之一。',
  current: [
    '中国社会科学院学部委员',
    '浦山基金会会长（2016-07 起任学术委员会主席）',
    '中国金融四十人论坛（CF40）学术顾问',
    '国家发展规划专家委员会委员（"十一五"至"十五五"）',
  ],
  sources: 'CF40 作者简介；清华大学经管学院讲者简介（PDF）；爱思想作者页；新华网 2013-03-13 政协委员名单；社科院世经政所所史。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 6,
  subtitle: '人物履历 · 增长与财政 · 通缩与货币 · 汇率与外储 · 预判检验',
  span: '1979—2026',
  careerTitle: '履历时间线 · 工厂 → 社科院 → 牛津 → 世经政所 → 政策咨询',
  defaultTheme: 'fiscal',
  moduleId: 'scholarYuYongding',
  sourceNote: '署名文章 / 著作原书 / 主办方与授权刊发稿 / 主流媒体报道 · 对照数据：国家统计局、财政部与政府工作报告、国家外汇管理局',
};

export const CAREER_GROUPS = {
  worker: { label: '工厂', color: '#94a3b8' },
  cass: { label: '社科院', color: '#c41e3a' },
  study: { label: '留学', color: '#8b5cf6' },
  policy: { label: '政策咨询', color: '#22d3ee' },
  tk: { label: '智库 / 基金会', color: '#10b981' },
};

export const CAREER = [
  { id: 'c1', role: '北京重型机器厂工人', org: '北京', start: 1969.5, end: 1979.0, group: 'worker', note: '1969 年北京科学技术学校（中专）毕业后入厂，约十年' },
  { id: 'c2', role: '世界经济研究所研究人员（1983 助理研究员 → 1995 研究员）', org: '中国社会科学院', start: 1979.0, end: 1998.0, group: 'cass', note: '1986 年获硕士学位' },
  { id: 'c3', role: '西方经济理论研究室主任', org: '中国社会科学院世界经济研究所', start: 1986.0, end: 1988.5, group: 'cass', note: '起始年 1986 / 1987 两说并陈' },
  { id: 'c4', role: '牛津大学纳菲尔德学院 DPhil', org: '英国牛津', start: 1988.5, end: 1994.0, group: 'study' },
  { id: 'c5', role: '世界经济与政治研究所所长', org: '中国社会科学院', start: 1998.0, end: 2009.5, group: 'cass', note: '2009-06 由张宇燕接任' },
  { id: 'c6', role: '国家发展规划专家委员会委员', org: '国家发展改革委', start: 2004.0, end: 2026.75, group: 'tk', note: '"十一五"至"十五五"规划' },
  { id: 'c7', role: '货币政策委员会委员', org: '中国人民银行', start: 2004.5, end: 2006.5, group: 'policy' },
  { id: 'c8', role: '学部委员', org: '中国社会科学院', start: 2006.0, end: 2026.75, group: 'cass' },
  { id: 'c9', role: '联合国发展政策委员会委员', org: '联合国经社理事会', start: 2010.0, end: 2013.0, group: 'policy', note: '仅见单一履历来源，存疑' },
  { id: 'c10', role: '外交政策咨询委员会委员', org: '外交部', start: 2010.0, end: 2026.75, group: 'tk', note: '任期终点未核' },
  { id: 'c11', role: '十二届全国政协委员（外事委员会）', org: '全国政协', start: 2013.2, end: 2018.2, group: 'policy' },
  { id: 'c12', role: '学术委员会主席 → 会长', org: '浦山基金会', start: 2016.5, end: 2026.75, group: 'tk' },
];

export const BOOKS = [
  { id: 'b1', year: 1996, title: '西方经济学（主编）', publisher: '经济科学出版社', coauthors: '张宇燕、郑秉文', themes: ['growth'], verified: 'reprint', note: '仅见二手书目，出版年 1996 / 1997 两说' },
  { id: 'b2', year: 2004, title: '我看世界经济', publisher: '生活·读书·新知三联书店', date: '2004-01', isbn: '9787108019974', themes: ['global', 'growth'], verified: 'primary', note: '部分书目记为 2003 年' },
  { id: 'b3', year: 2005, title: '一个学者的思想轨迹：余永定论文选', publisher: '中信出版社', date: '2005-05', isbn: '9787508603827', themes: ['fiscal', 'growth'], verified: 'primary', note: '收《财政稳定问题研究的一个理论框架》等' },
  { id: 'b4', year: 2010, title: '见证失衡：双顺差、人民币汇率和美元陷阱', publisher: '生活·读书·新知三联书店', date: '2010-06', isbn: '9787108033864', themes: ['reserves', 'fx'], verified: 'primary' },
  { id: 'b5', year: 2016, title: '最后的屏障：资本项目自由化和人民币国际化之辩', publisher: '东方出版社', date: '2016-01', isbn: '9787506088817', themes: ['fx'], verified: 'primary', note: '收 1997—2014 年文章 35 篇' },
  { id: 'b6', year: 2019, title: '太阳之下无新事（经世学人文丛）', publisher: '中国社会科学出版社', date: '2019-12', isbn: '9787520353496', themes: ['growth', 'fiscal', 'fx'], verified: 'primary', note: '版权页 2019-12；作者自序署 2020 年' },
  { id: 'b7', year: 2024, title: '见证失衡II：双顺差的结束、人民币国际化和美元武器化（浦山书系）', publisher: '电子工业出版社', date: '2024-08', isbn: '9787121485503', themes: ['reserves', 'fx', 'global'], verified: 'primary', note: '出版社官网 2024-08；台湾三民书局记 2024-10-01' },
  { id: 'b8', year: 2025, title: '增长是硬道理：我对中国宏观调控的思考（浦山书系）', publisher: '中国科学技术出版社', date: '2025-11', isbn: '9787523613924', themes: ['growth', 'fiscal', 'monetary'], verified: 'primary' },
  { id: 'b9', year: null, title: '一个学者的非学术编年', publisher: '未核实', themes: ['growth'], verified: 'doubt', note: '检索未见任何出版记录，见存疑区' },
];

// ============================================================================
// 文库：讲话、署名文章、采访（观点条目的出处真源）
// ============================================================================
export const CORPUS = [
  { id: 'k2000', date: '2000-06', form: '论文', venue: '《财政稳定问题研究的一个理论框架》·《世界经济》2000 年第 6 期', source: '《世界经济》（维普期刊库）', verified: 'primary', themes: ['fiscal'] },
  { id: 'k2009a', date: '2009-04-13', form: '采访', venue: '《第一财经日报》专访 · 美元陷阱与外储损失', source: '第一财经日报（新浪财经转载）', url: 'http://finance.sina.com.cn/review/20090413/00006094560.shtml', verified: 'media', themes: ['reserves'] },
  { id: 'k2009b', date: '2009-05-11', form: '讲座', venue: '讲座 · 国际货币体系改革和中国外汇储备', source: '新浪财经', url: 'http://finance.sina.com.cn/hy/20090511/14456209285.shtml', verified: 'media', themes: ['reserves', 'global'] },
  { id: 'k2011', date: '2011-08-08', form: '署名文章', venue: '中国如何摆脱“美元陷阱”？', source: 'FT中文网', url: 'https://www.ftchinese.com/story/001040005', verified: 'primary', themes: ['reserves', 'global'] },
  { id: 'k2012', date: '2012', form: '文献综述', venue: '资本账户开放之争（余永定、张明、张斌四点异议综述）', source: '中国社会科学院国际金融研究（PDF）', url: 'http://ifb.cssn.cn/newpc/xscg/lwbg/202012/P020201225574897209546.pdf', verified: 'reprint', themes: ['fx'] },
  { id: 'k2016a', date: '2016-01', form: '读书会', venue: '北大国发院读书会 ·《最后的屏障》', source: '北京大学国家发展研究院', url: 'https://www.nsd.pku.edu.cn/jxxm/bks/dtxx/265409.htm', verified: 'media', themes: ['fx'] },
  { id: 'k2016b', date: '2016-03-05', form: '讲话', venue: '保外储还是保汇率（整理稿）', source: '商务财经网', url: 'http://www.swcjw.com/mjzl/rw/2016-03-05/26665.html', verified: 'reprint', themes: ['fx', 'reserves'] },
  { id: 'k2017', date: '2017-05-19', form: '采访', venue: '《财经》专访 · 汇率维稳与资本外流', source: '财经杂志', url: 'http://magazine.caijing.com.cn/20170519/4274147.shtml', verified: 'media', themes: ['fx'] },
  { id: 'k2018a', date: '2018-08-15', form: '署名文章', venue: '保汇率还是保外储', source: '新浪财经专栏', url: 'http://finance.sina.com.cn/zl/china/2018-08-15/zl-ihhtfwqr6217519.shtml', verified: 'primary', themes: ['fx', 'reserves'] },
  { id: 'k2018b', date: '2018-09-14', form: '采访', venue: '经济观察网 · 首席对话', source: '经济观察网', url: 'http://m.eeo.com.cn/2018/0914/337076.shtml', verified: 'media', themes: ['fx'] },
  { id: 'k2019a', date: '2019-05-21', form: '采访', venue: '人民政协网 · 中美经贸摩擦', source: '人民政协网', url: 'https://www.rmzxw.com.cn/c/2019-05-21/2348652.shtml', verified: 'media', themes: ['global'] },
  { id: 'k2019b', date: '2019-12-01', form: '署名文章', venue: '《财经》· 经济增速已滑至 6%，该刹车了', source: '财经杂志（财新音频、中央社转引）', url: 'https://www.cna.com.tw/news/acn/201912020200.aspx', verified: 'media', themes: ['growth', 'fiscal'] },
  { id: 'k2019c', date: '2019-12-15', form: '研讨会', venue: 'CF40 青年论坛双周内部研讨会 · "保 6"之辩', source: '界面新闻', url: 'https://m.jiemian.com/article/3790823.html', verified: 'media', themes: ['growth'] },
  { id: 'k2022a', date: '2022-05-14', form: '演讲', venue: '2022 清华五道口首席经济学家论坛（整理未经本人确认）', source: '清华大学五道口金融学院 CIFER', url: 'https://cifer.pbcsf.tsinghua.edu.cn/info/1184/3024.htm', verified: 'media', themes: ['reserves', 'global'] },
  { id: 'k2022b', date: '2022-05-24', form: '文章', venue: '俄乌冲突美国将金融“武器化”的启示（转载）', source: '红色文化网', url: 'https://www.hswh.org.cn/wzzx/xxhq/oz/2022-05-24/75562.html', verified: 'reprint', themes: ['reserves'] },
  { id: 'k2022c', date: '2022-07-01', form: '署名文章', venue: '《中国改革》2022 年第 4 期 · 外汇储备安全', source: '财新网·中国改革', url: 'https://cnreform.caixin.com/m/2022-07-06/101908915.html', verified: 'primary', themes: ['reserves', 'global'] },
  { id: 'k2023', date: '2023-12-17', form: '演讲', venue: '2023 三亚·财经国际论坛', source: '观察者网', url: 'https://www.guancha.cn/YuYongDing/2023_12_26_720298.shtml', verified: 'media', themes: ['reserves'] },
  { id: 'k2024a', date: '2024-09-01', form: '采访', venue: '财联社《安安访谈录》', source: '财联社（新浪财经转载）', url: 'https://finance.sina.com.cn/roll/2024-09-01/doc-incmrhrq5283282.shtml', verified: 'media', themes: ['fiscal', 'monetary', 'fx'] },
  { id: 'k2024b', date: '2024-10-11', form: '署名文章', venue: '如何看待一揽子增量政策？', source: '观察者网', url: 'https://www.guancha.cn/YuYongDing/2024_10_11_751420_1.shtml', verified: 'primary', themes: ['growth', 'fiscal'] },
  { id: 'k2024c', date: '2024-10-13', form: '署名文章', venue: '笔谈 · 债务可持续性', source: '观察者网', url: 'https://www.guancha.cn/YuYongDing/2024_10_14_751640.shtml', verified: 'primary', themes: ['fiscal'] },
  { id: 'k2025a', date: '2025-01-06', form: '采访', venue: '问诊 2025', source: '观察者网', url: 'https://www.guancha.cn/politics/2025_01_06_761236.shtml', verified: 'media', themes: ['fiscal'] },
  { id: 'k2025b', date: '2025-04-14', form: '文章', venue: '财政政策可能仍需进一步加码（转载）', source: '腾讯新闻', url: 'https://news.qq.com/rain/a/20250414A09OHI00', verified: 'reprint', themes: ['fiscal'] },
  { id: 'k2025c', date: '2025-10-29', form: '演讲', venue: '清华经管长安讲坛第 431 期 · 宏观经济政策认识误区辨析（2026-03 全文刊发）', source: '新浪财经', url: 'https://finance.sina.com.cn/cj/2026-03-04/doc-inhpvaym0160596.shtml', verified: 'media', themes: ['growth', 'fiscal', 'monetary'] },
  { id: 'k2025d', date: '2025-11-21', form: '著作序言', venue: '《增长是硬道理》序', source: 'CF40（新浪财经专栏）', url: 'http://finance.sina.com.cn/zl/china/2025-11-21/zl-infycinm9109890.shtml', verified: 'primary', themes: ['growth', 'fiscal', 'monetary'] },
  { id: 'k2025e', date: '2025-12-27', form: '演讲', venue: '2025 三亚·财经国际论坛', source: '新京报、证券时报', url: 'https://www.bjnews.com.cn/detail/1766833881168515.html', verified: 'media', themes: ['fiscal', 'growth'] },
  { id: 'k2026a', date: '2026-04-02', form: '演讲', venue: '上海发展研究基金会第 200 期沙龙 / 上海货币论坛（整理稿）', source: '清华五道口 CIFER 转载', url: 'https://cifer.pbcsf.tsinghua.edu.cn/info/1136/3736.htm', verified: 'reprint', themes: ['global', 'reserves', 'fx'] },
  { id: 'k2026b', date: '2026-05-12', form: '署名文章', venue: '复盘“四万亿计划”，基建投资仍是中国当前的正确选择', source: '观察者网（CF40 2026-05-22 同文）', url: 'https://www.guancha.cn/YuYongDing/2026_05_12_816663.shtml', verified: 'primary', themes: ['growth', 'fiscal', 'monetary'] },
  { id: 'k2026c', date: '2026-09-19', form: '演讲', venue: '2026 清华五道口首席经济学家论坛（授权刊发）', source: '观察者网', url: 'https://www.guancha.cn/YuYongDing/2026_09_21_901386.shtml', verified: 'primary', themes: ['global', 'reserves', 'fiscal', 'growth'] },
  { id: 'k2026d', date: '2026-09-20', form: '演讲', venue: '2026 清华五道口首席经济学家论坛（现场报道）', source: '凤凰网', url: 'https://i.ifeng.com/c/8wZbwAo20Lv', verified: 'media', themes: ['monetary'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 宏观与增长 ——
  { id: 'g1', k: 'k2025d', theme: 'growth', type: '原话', text: '任何国家都不可能永远保持10%左右的经济增速，在这个意义上，“中国经济奇迹已经结束”，但是没有任何理论可以证明中国经济增速下跌到6%或更低是不可避免的。' },
  { id: 'g2', k: 'k2025c', theme: 'growth', type: '原话', text: '显然，不是消费驱动经济增长，而是建立在储蓄基础上的投资驱动经济增长。' },
  { id: 'g3', k: 'k2026b', theme: 'growth', type: '原话', text: '中国的情况则有所不同。独特的制度优势使政府具有直接决定基础设施投资规模与增速的能力。' },
  { id: 'g4', k: 'k2026b', theme: 'growth', type: '转述', text: '以 2026 年一季度基础设施投资增速由 2025 年的 -2.2% 升至 8.9% 为据，判断基建很可能再次成为经济增长的初始助推器。' },
  { id: 'g5', k: 'k2024b', theme: 'growth', type: '原话', text: '总而言之，我觉得基础设施投资已经饱和这种说法是错的。' },
  { id: 'g6', k: 'k2025c', theme: 'growth', type: '原话', text: '产能过剩是行业和产品问题、结构问题，不是宏观经济问题。' },
  { id: 'g7', k: 'k2026c', theme: 'growth', type: '原话', text: '宏观经济只存在两种需要政府干预的状态：其一，有效需求不足、就业不足、通缩。其二，经济过热、通胀。' },
  { id: 'g8', k: 'k2025d', theme: 'growth', type: '原话', text: '在中国，经济学辩论像是一场运动员、裁判和观众一起上阵的‘足球比赛’。混战结束后，留下的只是一堆无人认领的鞋子。' },
  // —— 财政扩张与地方债 ——
  { id: 'f1', k: 'k2000', theme: 'fiscal', type: '转述', text: '提出财政稳定的理论框架：在赤字率与经济增速给定时，国债余额/GDP 收敛于"赤字率 ÷ 增速"的稳态值，债务可持续性取决于增长而非单年赤字。' },
  { id: 'f2', k: 'k2024c', theme: 'fiscal', type: '原话', text: '一个国家只要经济增速高于利率，这个国家的债务就是可持续的。' },
  { id: 'f3', k: 'k2025a', theme: 'fiscal', type: '原话', text: '在讨论财政政策时，我们应该关注的是财政的可持续性，而不是如何恢复财政平衡' },
  { id: 'f4', k: 'k2025c', theme: 'fiscal', type: '原话', text: '中国应该调整中央政府和地方政府之间的债务结构；应该明显提高国债在中国政府全口径债务总额的比例。' },
  { id: 'f5', k: 'k2025c', theme: 'fiscal', type: '原话', text: '中国的财政完全是可持续的，目前中国的通货膨胀水平很低，政府完全应该加大财政政策的扩张力度，提高赤字率，增发国债—特别是长期国债，为基础设施投资提供资金，尽快消除通缩压力，实现5%左右的经济增长速度。' },
  { id: 'f6', k: 'k2025d', theme: 'fiscal', type: '原话', text: '中央财政对基础设施投资、融资的贡献过低是地方隐债严重的重要原因' },
  { id: 'f7', k: 'k2026c', theme: 'fiscal', type: '原话', text: '我们完全可以，而且应该用国债置换地方政府债。' },
  { id: 'f8', k: 'k2019b', theme: 'fiscal', type: '原话', text: '宁愿让财政政策导致财政状况暂时恶化，也要稳住经济增长' },
  { id: 'f9', k: 'k2025e', theme: 'fiscal', type: '转述', text: '主张 2026 年将赤字率提高到 5% 左右，启动增长主要依靠基础设施投资。' },
  { id: 'f10', k: 'k2024a', theme: 'fiscal', type: '原话', text: '2024年政府应该大力增发国债支持基础设施投资，唯其如此，2025年我们才能顺利实现5%的经济增长目标。' },
  // —— 货币政策与通缩 ——
  { id: 'm1', k: 'k2024a', theme: 'monetary', type: '原话', text: '只要审时度势、掌握好分寸，中央银行购买国债不会导致通胀失控。' },
  { id: 'm2', k: 'k2024a', theme: 'monetary', type: '转述', text: '判断中国处于"准通货紧缩"，主张央行以"第二小提琴手"身份配合扩张性财政。' },
  { id: 'm3', k: 'k2026b', theme: 'monetary', type: '原话', text: '对于像中国这样的经济体，正常的CPI增长率应该大致维持在3%-4%之间。' },
  { id: 'm4', k: 'k2025d', theme: 'monetary', type: '转述', text: '以 PPI 三轮长时段负增长（2012 年起 54 个月、2022-10 至 2025-07 共 33 个月等）说明总需求不足与通缩压力的持续性。' },
  { id: 'm5', k: 'k2026d', theme: 'monetary', type: '原话', text: '如果通货膨胀起来了，物价上去了，再搞刺激性的、扩张性的财政或货币政策，你再想降息是非常困难的。' },
  { id: 'm6', k: 'k2026d', theme: 'monetary', type: '原话', text: '机会窗口是不能失去的，失去就来不到。' },
  // —— 汇率与资本账户 ——
  { id: 'x1', k: 'k2016b', theme: 'fx', type: '原话', text: '总而言之，如果让我选择，我选择保住外汇储备，不保人民币汇率。' },
  { id: 'x2', k: 'k2017', theme: 'fx', type: '原话', text: '我们的汇率维稳政策客观上帮助热钱实现了“胜利大逃亡”。' },
  { id: 'x3', k: 'k2018a', theme: 'fx', type: '原话', text: '退一步讲，即便是以1万亿美元的代价换来了汇率的自主稳定，这也不是什么值得夸耀的结果。' },
  { id: 'x4', k: 'k2018b', theme: 'fx', type: '原话', text: '无需盯着7，什么时候破7，并不重要，重要的是再也不能像过去那样大量损耗外汇储备去保汇率' },
  { id: 'x5', k: 'k2012', theme: 'fx', type: '转述', text: '2012 年资本账户开放之争中，与张明、张斌共同反对"加快开放条件基本成熟"的判断，主张先完成汇率形成机制与利率市场化改革，再有序开放资本账户。' },
  { id: 'x6', k: 'k2016a', theme: 'fx', type: '转述', text: '《最后的屏障》的核心论点：资本管制是防范跨境资本冲击与金融危机的最后屏障，不应在汇率与金融体系改革到位前轻易拆除。' },
  { id: 'x7', k: 'k2024a', theme: 'fx', type: '原话', text: '关于汇率问题，我认为不必过分担心。' },
  { id: 'x8', k: 'k2026a', theme: 'fx', type: '原话', text: '人民币国际化是一个过程，不是一天两天能够做到的。' },
  // —— 外汇储备与美债 ——
  { id: 'r1', k: 'k2009a', theme: 'reserves', type: '原话', text: '对于中国来说，当务之急是避免进一步落入美元陷阱，其次是尽量减少已有外汇存量可能发生的损失。' },
  { id: 'r2', k: 'k2011', theme: 'reserves', type: '原话', text: '一个人均收入位居全球100名之后的发展中国家，数十年来却一直把钱借给全球最富有的国家，这有违情理。' },
  { id: 'r3', k: 'k2022a', theme: 'reserves', type: '原话', text: '美国冻结俄罗斯外汇储备这个事实说明如果美国认为需要，它完全可能会扣押中国的海外资产，特别是外汇储备。' },
  { id: 'r4', k: 'k2022c', theme: 'reserves', type: '原话', text: '外汇储备的“武器化”，迫使我们不得不重新审视中国外汇储备和海外资产的安全性问题。' },
  { id: 'r5', k: 'k2023', theme: 'reserves', type: '原话', text: '中国不会抛售，因为如果抛售的话，不但会冲击国际债券市场，中国自己也要受到损失。' },
  { id: 'r6', k: 'k2026a', theme: 'reserves', type: '原话', text: '我们要高度警惕美元资产的安全性。' },
  { id: 'r7', k: 'k2026c', theme: 'reserves', type: '原话', text: '中国的贸易顺差主要转化为美元金融资产，这里存在严重的安全性问题。' },
  { id: 'r8', k: 'k2022a', theme: 'reserves', type: '转述', text: '提出减少顺差转化为美元资产的一揽子建议：取消出口退税、让汇率更多浮动、少买美国国债、扩大内需等。' },
  // —— 中美与全球金融 ——
  { id: 'w1', k: 'k2019a', theme: 'global', type: '原话', text: '中美长期以来建立了非常紧密的经贸关系。我们之所以反击，是以战止战，是为了维持这样一种关系。' },
  { id: 'w2', k: 'k2026a', theme: 'global', type: '原话', text: '在美国，国际收支危机和财政危机是‘双胞胎’。' },
  { id: 'w3', k: 'k2026c', theme: 'global', type: '原话', text: '中国应该落实双循环战略、清理出口导向政策、或其残余物（退税、补贴）、加速全国统一大市场大市场的建设' },
  { id: 'w4', k: 'k2026c', theme: 'global', type: '转述', text: '以美国净外债约 21.27 万亿美元（约占 GDP 66.7%）、联邦债务突破 40 万亿美元为据，判断美元资产的中长期风险上升。' },
  { id: 'w5', k: 'k2009b', theme: 'global', type: '转述', text: '从美元本位国际货币体系的结构缺陷解释中国外储困境，主张在国际货币体系改革进程中减少新增美元资产积累。' },
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

export const FEATURED = ['g1', 'g2', 'f2', 'f7', 'm5', 'x4', 'r3', 'w1'];

export const THEME_LINKS = {
  growth: [{ to: '/econ-dashboard', label: '经济大盘' }, { to: '/japan-lost-decades', label: '日本失落年代' }],
  fiscal: [{ to: '/debt', label: '地方债务' }, { to: '/govsystem', label: '政府体系' }],
  monetary: [{ to: '/econ-dashboard', label: '物价与货币' }, { to: '/japan-lost-decades', label: '通缩镜鉴' }],
  fx: [{ to: '/rmb', label: '人民币' }, { to: '/finance-system', label: '金融体系' }],
  reserves: [{ to: '/rmb', label: '人民币与外储' }, { to: '/finance-system', label: '金融体系' }],
  global: [{ to: '/foreign-trade', label: '对外贸易' }, { to: '/thucydides', label: '中美关系' }],
};

export const THEME_INTRO = {
  growth: '增长观的核心是"增长是硬道理"：反对把增速下滑视为不可避免的"新常态"，认为中国是投资驱动而非消费驱动的经济，政府可直接调节基建投资规模，因而在需求不足时应以基建为初始助推器。',
  fiscal: '财政观建立在 2000 年"财政稳定框架"之上：债务可持续性取决于增速与利率之比而非单年赤字，主张提高赤字率、增发长期国债，并以国债置换地方政府债、提高中央在全口径债务中的比重。',
  monetary: '货币观强调通缩风险：以 PPI 长期负增长、GDP 平减指数转负为据判断需求不足，认为适度央行购债不致通胀失控；2026 年物价回升后转而强调"窗口期"——一旦通胀起来，扩张空间将收窄。',
  fx: '汇率观一以贯之地主张汇率弹性优先：2015—2017 年"保外储不保汇率"，反对以巨额外储维稳；资本账户开放须排在汇率与利率改革之后，资本管制是"最后的屏障"。',
  reserves: '外储观源于 2009 年的"美元陷阱"论：高储蓄发展中国家把巨额储蓄借给最富国家，既低效又有安全风险；2022 年俄罗斯外储被冻结后，这一论点转为"外储武器化"下的资产安全议题。',
  global: '全球观把中美问题落在国际收支结构上：美国"双赤字"与净外债累积削弱美元资产安全，中国应以双循环、清理出口导向政策、统一大市场减少顺差对美元资产的依赖；对中美经贸关系持"以战止战、维持关系"立场。',
};

// ============================================================================
// 预判检验台账：只收可被数据检验的前瞻性表述；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2024-09-01', venue: '财联社《安安访谈录》',
    url: 'https://finance.sina.com.cn/roll/2024-09-01/doc-incmrhrq5283282.shtml',
    claim: '2024年政府应该大力增发国债支持基础设施投资，唯其如此，2025年我们才能顺利实现5%的经济增长目标。',
    check: '结果项兑现：2025 年 GDP 140.19 万亿元、实际增长 5.0%。但前提项只部分落地——2024 年未年中追加国债，增量政策以 2024-11 的 6 万亿元地方债限额置换隐性债务为主；2025 年赤字率升至 4%、超长期特别国债 1.3 万亿元；其本人文章称 2025 年基建投资 -2.2%。"唯其如此"的因果链未获数据支持。',
    dataSrc: '国家统计局 2026-01-20；2025 年政府工作报告；全国人大常委会 2024-11-08 决议',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '2019-12-01', venue: '《财经》· 经济增速已滑至 6%，该刹车了',
    claim: '宁愿让财政政策导致财政状况暂时恶化，也要稳住经济增长',
    check: '赤字率突破 3% 惯例的方向已兑现：2020 年 3.6% 以上，2023 年 10 月增发国债后 3.8% 左右，2025、2026 年均为 4% 左右，并连续发行超长期特别国债（2024 年 1 万亿元、2025—2026 年各 1.3 万亿元）。',
    dataSrc: '历年政府工作报告；全国人大常委会 2023-10 预算调整决议',
  },
  {
    id: 'L3', status: 'failed', type: '转述', date: '2025-12-27', venue: '2025 三亚·财经国际论坛',
    url: 'https://www.bjnews.com.cn/detail/1766833881168515.html',
    claim: '2026 年赤字率应提高到 5% 左右',
    check: '2026 年政府工作报告定赤字率 4% 左右、赤字规模 5.89 万亿元（比上年增 2300 亿元），另安排超长期特别国债 1.3 万亿元、特别国债 3000 亿元、专项债 4.4 万亿元。狭义赤字率未达其建议值。',
    dataSrc: '2026 年政府工作报告（新华网 2026-03-13）',
  },
  {
    id: 'L4', status: 'failed', type: '转述', date: '2019-12-15', venue: 'CF40 青年论坛双周内部研讨会',
    url: 'https://m.jiemian.com/article/3790823.html',
    claim: '2020 年应以扩张性政策"保 6"',
    check: '2020 年因新冠疫情未设增长目标，GDP 增长 2.2%（国家统计局最终核实数）。属外生冲击导致的未兑现，不宜据此评判其政策逻辑。',
    dataSrc: '国家统计局 2020 年 GDP 最终核实公告',
  },
  {
    id: 'L5', status: 'open', type: '原话', date: '2026-05-12', venue: '署名文章 · 基建投资仍是中国当前的正确选择',
    url: 'https://www.guancha.cn/YuYongDing/2026_05_12_816663.shtml',
    claim: '2026年经济实现5%增长的前景可期。',
    check: '2026 年上半年 GDP 69.57 万亿元、增长 4.7%（一季度 5.0%、二季度 4.3%），处于官方 4.5%—5% 目标区间内但逐季放缓，待全年数据。',
    dataSrc: '国家统计局 2026-07-15',
  },
  {
    id: 'L6', status: 'open', type: '转述', date: '2026-05-12', venue: '署名文章 · 基建投资仍是中国当前的正确选择',
    url: 'https://www.guancha.cn/YuYongDing/2026_05_12_816663.shtml',
    claim: '基建投资很可能再次成为 2026 年经济增长的初始助推器',
    check: '起点数据属实：一季度基础设施投资同比 +8.9%。但 1—8 月基建投资 -4.0%、全部固投 -7.2%，基建增速由正转负，"助推器"判断面临反向证据，待全年数据。',
    dataSrc: '国家统计局 2026-04-16、2026-09-15（本站经济大盘模块）',
  },
  {
    id: 'L7', status: 'done', type: '转述', date: '2024-09-01', venue: '财联社《安安访谈录》',
    url: 'https://finance.sina.com.cn/roll/2024-09-01/doc-incmrhrq5283282.shtml',
    claim: '中国处于"准通货紧缩"，需以扩张性政策消除通缩压力',
    check: '诊断与数据一致：GDP 平减指数 2023 年 -0.51%、2024 年 -0.76%、2025 年 -0.92%，连续三年为负；PPI 2022-10 起连续 41 个月负增长，2026-03 才转正（+0.5%）。',
    dataSrc: '世界银行 WDI（NY.GDP.DEFL.KD.ZG）；国家统计局 2026-04-10',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2026-09-20', venue: '2026 清华五道口首席经济学家论坛',
    url: 'https://i.ifeng.com/c/8wZbwAo20Lv',
    claim: '如果通货膨胀起来了，物价上去了，再搞刺激性的、扩张性的财政或货币政策，你再想降息是非常困难的。',
    check: '物价正在上行：8 月 PPI 同比 +3.8%、1—8 月累计 +2.0%；CPI 8 月 +0.8%、1—8 月 +0.9%、核心 1.0%；财新报道二季度名义增速 13 个季度来首次高于实际增速。上游涨价尚未传导至消费端，"窗口期"判断待观察。',
    dataSrc: '国家统计局 2026-09-09（本站经济大盘模块）；财新网 2026-07-15',
  },
  {
    id: 'L9', status: 'open', type: '原话', date: '2026-09-19', venue: '2026 清华五道口首席经济学家论坛',
    url: 'https://www.guancha.cn/YuYongDing/2026_09_21_901386.shtml',
    claim: '我们完全可以，而且应该用国债置换地方政府债。',
    check: '现行置换以地方债为工具：2024-11 起 6 万亿元地方债限额置换隐性债务，2026 年专项债 4.4 万亿元中含置换额度；以中央国债置换地方债的安排至核验日未见。',
    dataSrc: '全国人大常委会 2024-11-08 决议；2026 年政府工作报告',
  },
  {
    id: 'L10', status: 'done', type: '转述', date: '2018-09-14', venue: '经济观察网 · 首席对话',
    url: 'http://m.eeo.com.cn/2018/0914/337076.shtml',
    claim: '中国基本面较好，不用担心人民币大幅贬值（贬幅逾 25%）',
    check: '人民币对美元 2019-08 破 7，此后最弱阶段约在 7.3 附近，较 2018 年中水平远未贬 25%；2026-09-28 中间价 6.7399。',
    dataSrc: '中国外汇交易中心中间价',
  },
  {
    id: 'L11', status: 'done', type: '原话', date: '2023-12-17', venue: '2023 三亚·财经国际论坛',
    url: 'https://www.guancha.cn/YuYongDing/2023_12_26_720298.shtml',
    claim: '中国不会抛售，因为如果抛售的话，不但会冲击国际债券市场，中国自己也要受到损失。',
    check: '美国财政部 TIC 数据显示中国持有美债此后呈渐进下降，未见冲击性集中抛售。本站未逐月核对具体持仓数额。',
    dataSrc: '美国财政部 TIC 月度报告（定性）',
  },
  {
    id: 'L12', status: 'open', type: '转述', date: '2022-05-14', venue: '2022 清华五道口首席经济学家论坛',
    url: 'https://cifer.pbcsf.tsinghua.edu.cn/info/1184/3024.htm',
    claim: '取消出口退税、少买美债，减少顺差向美元资产转化',
    check: '2024-12-01 起取消铝材、铜材等出口退税并下调部分产品退税率，但出口退税制度整体仍在；中国持有美债渐进下降方向一致。2026-09 其本人仍呼吁清理退税、补贴，说明主张尚未整体落实。',
    dataSrc: '财政部、税务总局 2024 年出口退税调整公告；美国财政部 TIC（定性）',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '2026 年一季度基建投资增速', said: 8.9, official: 8.9, unit: '%', saidSrc: '2026-05-12 署名文章', offSrc: '国家统计局 2026-04-16：基础设施投资同比 +8.9%', comparable: true },
  { id: 'n2', label: '2023 年一般公共预算赤字率', said: 3.8, official: 3.8, unit: '%', saidSrc: '2024-09-01 财联社访谈', offSrc: '全国人大常委会 2023-10 预算调整：赤字率由 3% 提至 3.8% 左右', comparable: true },
  { id: 'n3', label: '2025 年赤字规模', said: 5.66, official: 5.66, unit: '万亿元', saidSrc: '2025-04-14 转载稿', offSrc: '2025 年政府工作报告：赤字 5.66 万亿元', comparable: true },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '增长与投资', '财政与债务', '货币与通缩', '汇率与资本账户', '外储与全球金融'],
  nodes: [
    { id: 'core', name: '增长是\n硬道理', cat: 0, size: 58 },
    { id: 'invest', name: '投资驱动', cat: 1, size: 34 },
    { id: 'infra', name: '基建初始助推器', cat: 1, size: 36 },
    { id: 'baoliu', name: '反对"保 6 放弃论"', cat: 1, size: 26 },
    { id: 'overcap', name: '产能过剩≠宏观问题', cat: 1, size: 24 },
    { id: 'stab', name: '财政稳定框架', cat: 2, size: 34 },
    { id: 'gr', name: '增速 > 利率', cat: 2, size: 30 },
    { id: 'deficit', name: '提高赤字率', cat: 2, size: 32 },
    { id: 'swap', name: '国债置换地方债', cat: 2, size: 30 },
    { id: 'deflation', name: '通缩 / 平减指数', cat: 3, size: 32 },
    { id: 'qe', name: '央行购债配合', cat: 3, size: 26 },
    { id: 'window', name: '窗口期', cat: 3, size: 26 },
    { id: 'float', name: '汇率弹性', cat: 4, size: 30 },
    { id: 'reservefirst', name: '保外储不保汇率', cat: 4, size: 30 },
    { id: 'barrier', name: '资本管制"最后的屏障"', cat: 4, size: 28 },
    { id: 'trap', name: '美元陷阱', cat: 5, size: 34 },
    { id: 'weapon', name: '外储武器化', cat: 5, size: 30 },
    { id: 'dual', name: '双循环 / 清理出口导向', cat: 5, size: 28 },
    { id: 'twin', name: '美国双赤字', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'invest'], ['core', 'stab'], ['core', 'deflation'], ['core', 'float'], ['core', 'trap'],
    ['invest', 'infra'], ['invest', 'overcap'], ['core', 'baoliu'], ['infra', 'deficit'],
    ['stab', 'gr'], ['gr', 'deficit'], ['deficit', 'swap'], ['infra', 'swap'],
    ['deflation', 'deficit'], ['deflation', 'qe'], ['qe', 'deficit'], ['deflation', 'window'],
    ['float', 'reservefirst'], ['float', 'barrier'], ['reservefirst', 'trap'],
    ['trap', 'weapon'], ['trap', 'dual'], ['weapon', 'twin'], ['dual', 'float'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '赤字率与债务可持续：扩张派 vs 财政纪律派',
    sides: [
      { who: '余永定（署名文章 / 长安讲坛）', view: '转述：只要增速高于利率债务即可持续，中国财政完全可持续，应把赤字率提到 5% 左右并增发长期国债，以国债置换地方债。' },
      { who: '楼继伟（财新 2023-12-25；中国日报 2023-07-08）', view: '转述：2024 年赤字率最好维持在 3.8% 左右，不必大幅增加公共投资，重点增加一般性支出；地方债不应靠债务置换解决，须守住中央"坚决不救"底线。' },
    ],
    note: '分歧核心在于"赤字用来干什么"与"中央是否兜底地方债"。2026 年赤字率定为 4% 左右，介于两者建议之间；以地方专项债置换隐性债务的现行路径，与两人方案都不完全一致。',
  },
  {
    id: 'x2',
    title: '稳增长靠基建还是靠消费',
    sides: [
      { who: '余永定（长安讲坛 2025-10-29；署名文章 2026-05-12）', view: '转述：中国是储蓄支撑的投资驱动型经济，"变投资驱动为消费驱动"不能作为逆周期工具，基建投资饱和论是错的。' },
      { who: '刘世锦（21世纪经济报道 2025-08-29）', view: '转述：当前需求不足主要是消费不足而非投资不足，房地产与基建存在超前和透支，应以抓投资的力度抓消费，提高农村居民养老金等。' },
    ],
    note: '2019 年"保 6"之辩中刘世锦即提出"用刺激性办法保 6，还是用改革的办法稳 5"。2026 年 1—8 月基建投资 -4.0%、社零 +1.1%，两条路径的效果均未在数据上明确胜出。',
  },
  {
    id: 'x3',
    title: '与林毅夫的异同：同为投资拉动，逻辑不同',
    sides: [
      { who: '余永定', view: '转述：凯恩斯式需求侧逻辑——需求不足、通缩时以财政扩张和基建投资弥补有效需求缺口，投资是逆周期工具。' },
      { who: '林毅夫（每日经济新闻 2024-03-05）', view: '转述：新结构经济学的供给侧逻辑——投资应投向技术创新、产业升级与基础设施短板，靠有效投资提升增长潜力。' },
    ],
    note: '两人都反对"放弃投资、单靠消费"，但余强调短期总需求管理，林强调长期结构升级；对产业层面的侧重也不同：余认为产能过剩是行业结构问题、不应据此否定宏观扩张，林则以"有为政府"因势利导产业升级为核心。',
  },
  {
    id: 'x4',
    title: '资本账户开放与汇率维稳',
    sides: [
      { who: '盛松成 / 央行调查统计司课题组（2012）', view: '转述：2012 年 2 月报告与陆家嘴论坛表态认为加快资本账户开放的"条件基本成熟"。' },
      { who: '余永定、张明、张斌（2012 起）', view: '转述：资本账户开放应排在汇率形成机制与利率市场化之后；2015—2017 年主张"保外储不保汇率"，反对以巨额外储维稳。' },
    ],
    note: '汇率维稳之争另有沈建光（财新 2017-05-09 称"保外储"论已被证伪）与管涛（新浪 2017-11-01 认为保汇率与保储备具有内在一致性）等不同意见。2019 年破 7 后人民币弹性明显增强。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传"余永定最新讲话"拼接稿', status: '不收录', reason: '自媒体稿件拼接不同年份讲话或无出处托名，缺主办方、日期或原始媒体可追溯。' },
  { id: 'q2', item: '著作《一个学者的非学术编年》', status: '〔存疑〕', reason: '多轮检索未见出版社、ISBN 或书评记录，不能确认此书存在。' },
  { id: 'q3', item: '"美元杀手"称号及"其言论多次导致美元汇率走弱"', status: '不收录', reason: '为媒体标签（财新 2010-09-10 等），非本人自述；因果说法无市场数据支撑。' },
  { id: 'q4', item: '中国世界经济学会会长起始年', status: '并陈', reason: '爱思想与维基记 2000 年，RIETI 记 2001 年，50人论坛与清华简介记 2003 年。' },
  { id: 'q5', item: '西方经济理论研究室主任起始年', status: '并陈', reason: '50人论坛记 1986 年；爱思想记 1987 年，与晋升副研究员同年。' },
  { id: 'q6', item: '某履历页"1994年8月—2006年8月11日"任职记录', status: '〔存疑〕', reason: '与所长任期 1998—2009 年（CF40 简介、世经政所所史）不符，来源不明。' },
  { id: 'q7', item: '人大经济论坛等简介中的"她"、1948-11-18 生日', status: '更正', reason: '性别为男；具体生日未见权威来源，本模块只写 1948 年 11 月。' },
  { id: 'q8', item: '2026-05 文章称 PPI"自2019年10月又连续23个月负增长""自2024年11月至今依然是负增长"', status: '以官方为准', reason: '国家统计局口径：PPI 2019-07 至 2020-12 负增长；2022-10 起连续 41 个月负增长，2026-03 同比转正（+0.5%）。与其本人《增长是硬道理》序的区间表述亦不一致。' },
  { id: 'q9', item: '《太阳之下无新事》出版时间', status: '并陈', reason: '版权页 2019-12；作者自序署 2020 年。' },
  { id: 'q10', item: '2006 年"辞去货币政策委员会委员"传闻及本人否认', status: '未检验', reason: '仅见检索摘要提及，未找到原始报道，不收入正文。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
