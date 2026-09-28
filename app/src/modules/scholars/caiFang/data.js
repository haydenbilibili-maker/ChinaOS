// ============================================================================
// 学者专栏 · 蔡昉 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 自媒体以"蔡昉最新演讲"为题、无主办方与原始媒体可追溯的拼接稿一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  demography: { label: '人口转变与老龄化', color: '#c41e3a' },
  labor: { label: '劳动力市场与就业', color: '#22d3ee' },
  hukou: { label: '户籍与城市化', color: '#e8a317' },
  distribution: { label: '收入分配与消费', color: '#10b981' },
  welfare: { label: '社会保障与民生', color: '#8b5cf6' },
  growth: { label: '增长潜力与宏观', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '蔡昉',
  born: '1956 年 9 月 · 北京（籍贯江西萍乡）',
  summary:
    '1982 年毕业于中国人民大学农业经济系，1985、1989 年先后获中国社会科学院研究生院经济学硕士、博士学位。1985 年起在中国社科院农村发展研究所工作，1993 年调任人口研究所（后改为人口与劳动经济研究所）副所长，1998—2014 年任所长；2014—2021 年任中国社科院副院长。曾任第十一、十二、十三届全国人大常委会委员，其中十三届兼任农业与农村委员会副主任委员（2018—2023），2021—2024 年任中国人民银行货币政策委员会委员。研究以“刘易斯转折点”“人口红利”为轴，延伸至潜在增长率、户籍改革、收入分配与人口负增长下的需求侧冲击。',
  current: [
    '中国社会科学院国家高端智库首席专家、学部委员',
    '中国金融四十人论坛（CF40）学术委员会主席（2023-04 当选）',
    '中国社会科学院丝绸之路研究院理事长（据百科，现任状态未独立核实）',
  ],
  sources: '人民网、财新网 2014-08-22 任职报道；中国社科院大学应用经济学院简介；南京财经大学图书馆学者页；CF40 2023-04-15 年会决议报道；维基百科/百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 7,
  subtitle: '人物履历 · 刘易斯转折点 · 人口红利 · 需求侧冲击 · 投资于人 · 预判检验',
  span: '1994—2026',
  careerTitle: '履历时间线 · 农发所 → 人口所 → 社科院 → 全国人大 / 央行货币政策委员会 → 智库',
  defaultTheme: 'demography',
  moduleId: 'scholarCaiFang',
  sourceNote: '著作原书 / 署名文章 / 主办方页面 / 主流媒体报道 · 对照数据：国家统计局人口与 GDP 公报、《“十三五”规划纲要》、全国人大常委会延迟退休决定、世界银行收入分组',
};

export const CAREER_GROUPS = {
  rural: { label: '农村发展研究所', color: '#10b981' },
  iple: { label: '人口与劳动经济研究所', color: '#c41e3a' },
  cass: { label: '中国社科院院领导', color: '#8b5cf6' },
  npc: { label: '全国人大', color: '#e8a317' },
  pboc: { label: '央行货币政策委员会', color: '#22d3ee' },
  tk: { label: '智库 / 论坛', color: '#fb923c' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '中国社科院农村发展研究所研究人员 → 农村发展理论研究室主任', org: '北京', start: 1985.6, end: 1993.6, group: 'rural', note: '1988-10 评副研究员、1993-08 评研究员（百科口径）' },
  { id: 'c2', role: '中国社科院人口研究所副所长（兼研究生院人口学系主任）', org: '北京', start: 1993.6, end: 1998.7, group: 'iple' },
  { id: 'c3', role: '中国社科院人口（与劳动经济）研究所所长', org: '北京', start: 1998.7, end: 2014.7, group: 'iple', note: '2006-05 至 2007-05 挂职南水北调中线干线工程建设管理局副局长（百科口径）' },
  { id: 'c4', role: '中国社科院副院长、党组成员', org: '北京', start: 2014.55, end: 2021.2, group: 'cass', note: '2014-08-19 首次以副院长身份公开亮相；卸任时间据维基为 2021-03' },
  { id: 'c5', role: '十一届全国人大常委会委员、农业与农村委员会委员', org: '北京', start: 2008.2, end: 2013.2, group: 'npc' },
  { id: 'c6', role: '十二届全国人大常委会委员', org: '北京', start: 2013.2, end: 2018.2, group: 'npc', note: '见《读懂中国经济》作者简介与维基；未见人大官网名单页直接核对' },
  { id: 'c7', role: '十三届全国人大常委会委员、农业与农村委员会副主任委员', org: '北京', start: 2018.2, end: 2023.2, group: 'npc' },
  { id: 'c8', role: '中国人民银行货币政策委员会委员', org: '北京', start: 2021.2, end: 2024.2, group: 'pboc', note: '起止据维基（2021-03 至 2024-03）' },
  { id: 'c9', role: '中国社科院丝绸之路研究院理事长', org: '北京', start: 2017.3, end: 2026.75, group: 'cass', note: '2017-04 起兼任；现任状态仅见百科，未独立核实〔存疑〕' },
  { id: 'c10', role: '中国社科院国家高端智库首席专家', org: '北京', start: 2021.2, end: 2026.75, group: 'tk' },
  { id: 'c11', role: '中国金融四十人论坛学术委员会主席', org: '北京', start: 2023.3, end: 2026.75, group: 'tk', note: '2023-04-15 CF40 年会换届当选' },
];

export const BOOKS = [
  { id: 'b1', year: 1990, title: '中国的二元经济与劳动力转移——理论分析与政策建议', publisher: '中国人民大学出版社', themes: ['labor'], verified: 'reprint', note: '仅见百科书目' },
  { id: 'b2', year: 1994, title: '中国的奇迹：发展战略与经济改革', publisher: '上海三联书店、上海人民出版社', isbn: '7208018901', coauthors: '林毅夫、李周', themes: ['growth'], verified: 'primary', note: '1994 年初版；1999 年增订版；2014 年格致出版社新一版。百科误作 1995 年' },
  { id: 'b3', year: 2008, title: '刘易斯转折点：中国经济发展新阶段', publisher: '社会科学文献出版社', date: '2008-10', isbn: '9787509703687', themes: ['labor', 'growth'], verified: 'primary' },
  { id: 'b4', year: 2011, title: '超越人口红利', publisher: '社会科学文献出版社', date: '2011-09', isbn: '9787509725467', themes: ['demography', 'labor', 'hukou'], verified: 'primary', note: '文集；作者简介称获 2013 年中国出版政府奖' },
  { id: 'b5', year: 2014, title: '破解中国经济发展之谜', publisher: '中国社会科学出版社', themes: ['growth'], verified: 'media', note: '中国青年报 2014-01-13 报道新书发布；出版月份未核' },
  { id: 'b6', year: 2014, title: '从人口红利到改革红利', publisher: '社会科学文献出版社', date: '2014-06', isbn: '9787509760123', themes: ['demography', 'growth', 'welfare'], verified: 'primary', note: '全面深化改革研究书系' },
  { id: 'b7', year: 2017, title: '读懂中国经济：大国拐点与转型路径', publisher: '中信出版社', date: '2017-09', isbn: '9787508674506', themes: ['growth', 'labor'], verified: 'primary' },
  { id: 'b8', year: 2018, title: '四十不惑：中国改革开放发展经验分享', publisher: '中国社会科学出版社', date: '2018-05', isbn: '9787520322447', themes: ['growth'], verified: 'primary', note: '中国社科院网 2018-06-29 出版座谈会报道' },
  { id: 'b9', year: 2023, title: '人口负增长时代：中国经济增长的挑战与机遇', publisher: '中信出版集团', date: '2023-03', isbn: '9787521753592', themes: ['demography', 'distribution', 'welfare'], verified: 'primary' },
  { id: 'b10', year: 2024, title: '中国经济的未来可能性', publisher: '社会科学文献出版社', date: '2024-07', isbn: '9787522836577', themes: ['demography', 'labor', 'distribution'], verified: 'primary', note: '社科文献出版社新书页、皮书数据库' },
  { id: 'b11', year: 2025, title: '新人口红利', publisher: '中信出版集团', date: '2025-03', isbn: '9787521774047', themes: ['demography', 'labor'], verified: 'primary' },
  { id: 'b12', year: 2025, title: '中国就业新趋势：人工智能如何重塑劳动力市场', publisher: '中信出版集团', date: '2025-10', isbn: '9787521780857', themes: ['labor', 'distribution'], verified: 'primary' },
];

/** 讲话 / 采访 / 署名文章 / 论文文库 */
export const CORPUS = [
  { id: 'k1994', date: '1994', form: '著作', venue: '《中国的奇迹：发展战略与经济改革》（与林毅夫、李周合著）', source: '上海三联书店、上海人民出版社；林毅夫二十周年再版序（北大国发院 BiMBA 转载）', verified: 'primary', themes: ['growth'] },
  { id: 'k2008', date: '2008-10', form: '著作', venue: '《刘易斯转折点：中国经济发展新阶段》', source: '社会科学文献出版社（内容简介）', url: 'https://book.douban.com/subject/3261210/', verified: 'primary', themes: ['labor', 'growth'] },
  { id: 'k2010', date: '2010-04', form: '论文', venue: '《人口转变、人口红利与刘易斯转折点》·《经济研究》2010 年第 4 期', source: '《经济研究》（摘要及正文见经管之家转帖）', url: 'https://bbs.pinggu.org/thread-848558-1-1.html', verified: 'reprint', themes: ['demography', 'labor', 'growth'] },
  { id: 'k2011', date: '2011-03-23', form: '采访', venue: '《第一财经日报》专访 · 刘易斯转折点与收入分配', source: '第一财经日报', url: 'https://www.yicai.com/news/713627.html', verified: 'media', themes: ['labor', 'distribution', 'welfare'] },
  { id: 'k2013a', date: '2013-03-30', form: '文章', venue: '延迟退休利弊之争（专家观点整理）', source: '人民网理论频道（冯蕾整理）', url: 'http://theory.people.com.cn/n/2013/0330/c49154-20973560.html', verified: 'media', themes: ['welfare'] },
  { id: 'k2013b', date: '2013', form: '论文', venue: 'Population Change and Resulting Slowdown in Potential GDP Growth in China（与陆旸合著）', source: 'China & World Economy 2013（人口与劳动经济研究所网站 PDF）', url: 'http://iple.cssn.cn/webpic/web/iple/upload/2013/04/d20130407135235775.pdf', verified: 'primary', themes: ['growth', 'demography'] },
  { id: 'k2014a', date: '2014-07-01', form: '采访', venue: '《每日经济新闻》· 从供给入手提高潜在增长率', source: '每日经济新闻', url: 'https://www.nbd.com.cn/articles/2014-07-01/845412.html', verified: 'media', themes: ['growth'] },
  { id: 'k2014b', date: '2014-11-16', form: '讲话', venue: '经济参考报社“2014 中国经济发展年会”', source: '经济参考报（人民网 2014-11-17 转载）', url: 'http://finance.people.com.cn/n/2014/1117/c1004-26035974.html', verified: 'media', themes: ['growth', 'hukou'] },
  { id: 'k2017', date: '2017-09-29', form: '署名文章', venue: '署名文章 · 拨开迷雾，读懂中国经济', source: '财新网', url: 'https://opinion.caixin.com/m/2017-09-29/101152136.html', verified: 'primary', themes: ['growth', 'hukou'] },
  { id: 'k2020', date: '2020-12-17', form: '讲话', venue: '财经中国 2020 年会暨第十八届财经风云榜', source: '封面新闻（新浪转载）', url: 'https://news.sina.cn/gn/2020-12-19/detail-iiznctke7315948.d.html', verified: 'media', themes: ['demography', 'distribution'] },
  { id: 'k2021a', date: '2021', form: '讲话', venue: '中国金融四十人论坛 2021 年会（具体日期未核）', source: '界面新闻（据 CF40 微信公众号）', url: 'https://www.jiemian.com/article/6058208.html', verified: 'media', themes: ['demography', 'welfare', 'distribution'] },
  { id: 'k2021b', date: '2021-07-21', form: '署名文章', venue: 'CF40 专栏 · 中国第二个人口转折', source: '界面新闻（中国金融四十人论坛供稿）', url: 'https://www.jiemian.com/article/6381989.html', verified: 'media', themes: ['demography', 'welfare'] },
  { id: 'k2022', date: '2022-01', form: '论文', venue: '《刘易斯转折点——中国经济发展阶段的标识性变化》·《经济研究》2022 年第 1 期', source: '爱思想作者专栏转载（《经济评论》网站亦转）', url: 'https://www.aisixiang.com/data/131954.html', verified: 'reprint', themes: ['labor'] },
  { id: 'k2023a', date: '2023-01-18', form: '署名文章', venue: '如何应对人口负增长时代？（摘自《中国式现代化：发展战略与路径》）', source: '观察者网', url: 'https://www.guancha.cn/Caifang/2023_01_18_676367.shtml', verified: 'reprint', themes: ['demography', 'growth', 'hukou'] },
  { id: 'k2023b', date: '2023-04-19', form: '署名文章', venue: '署名文章 · 实施渐进式延迟法定退休年龄', source: '人民论坛网', url: 'https://www.rmlt.com.cn/2023/0419/671429.shtml', verified: 'primary', themes: ['welfare', 'labor'] },
  { id: 'k2024a', date: '2024-03-31', form: '署名文章', venue: '人口负增长时代如何扩大居民消费？', source: '观察者网（作者专栏）', url: 'https://www.guancha.cn/Caifang/2024_03_31_730164.shtml', verified: 'media', themes: ['distribution', 'welfare'] },
  { id: 'k2024b', date: '2024-04-24', form: '讲话', venue: 'CMF 宏观经济热点问题研讨会（第 84 期）· 老龄化时代的居民消费潜力', source: '中国人民大学国家发展与战略研究院（观点整理；爱思想、新浪转载）', url: 'http://ier.ruc.edu.cn/ltzj/hgjjrdwtyth/2024n2024n/dbssqwgyfcygzlfzdjytzyclxz/index.htm', verified: 'primary', themes: ['distribution', 'demography'] },
  { id: 'k2025a', date: '2025-03-07', form: '署名文章', venue: '署名文章 · 新人口红利在哪里', source: '财新网', url: 'https://conferences.caixin.com/m/2025-03-07/102295618.html', verified: 'primary', themes: ['demography', 'growth'] },
  { id: 'k2025b', date: '2025-03', form: '著作', venue: '《新人口红利》书摘', source: '中信出版集团（腾讯新闻 2025-03-10、北京日报 2025-03-17 书摘）', url: 'https://bjrbdzb.bjd.com.cn/bjrb/mobile/2025/20250317/20250317_012/content_20250317_012_1.htm', verified: 'media', themes: ['demography', 'labor'] },
  { id: 'k2025d', date: '2025-03-16', form: '署名文章', venue: '署名文章 · 完善人口发展战略的新理念', source: '新浪财经转载（原刊未核）', url: 'https://finance.sina.com.cn/roll/2025-03-16/doc-inepwhpa1352882.shtml', verified: 'reprint', themes: ['demography', 'distribution'] },
  { id: 'k2025e', date: '2025-11', form: '讲话', venue: '中国经济运行与政策国际论坛 2025', source: '星岛环球网（2025-11-18）', url: 'http://www.stnn.cc/detail/6a28bf88c90959391b21ad09.html', verified: 'media', themes: ['growth', 'distribution'] },
  { id: 'k2025f', date: '2025-10', form: '著作', venue: '《中国就业新趋势：人工智能如何重塑劳动力市场》第七章节选', source: '中信出版集团（21 世纪经济报道 2025-12-05 书评节选）', url: 'https://www.21jingji.com/article/20251205/herald/9f986b696843f086fc9b1f56b30050b7.html', verified: 'media', themes: ['labor', 'distribution'] },
  { id: 'k2026a', date: '2026-03-22', form: '讲话', venue: '中国发展高层论坛 2026 年年会 · 人口变化与经济增长专题研讨会', source: '界面新闻；第一财经', url: 'https://www.jiemian.com/article/14149010.html', verified: 'media', themes: ['demography', 'welfare', 'labor'] },
  { id: 'k2026b', date: '2026-04-01', form: '署名文章', venue: '署名文章 · “十五五”时期投资于人的主要着力点', source: '求是网（理论周刊）', url: 'https://www.qstheory.cn/20260401/374741d492ca477194e54493f04ca1ac/c.html', verified: 'primary', themes: ['distribution', 'welfare', 'labor'] },
  { id: 'k2026c', date: '2026-04-18', form: '讲话', venue: '2026·金融四十人年会 · 寓“投资于人”于“投资于AI”', source: '爱思想作者专栏（演讲稿）', url: 'https://www.aisixiang.com/data/175219.html', verified: 'reprint', themes: ['growth', 'welfare'] },
  { id: 'k2026d', date: '2026-06', form: '讲话', venue: 'CMF 2026 年中期论坛（总第 73 期）· 拥抱人工智能，必须投资于人', source: '爱思想（观点整理）', url: 'https://www.aisixiang.com/data/178684.html', verified: 'reprint', themes: ['labor', 'distribution'] },
  { id: 'k2026e', date: '2026-08', form: '讲话', venue: '2026 网易经济学家年会·夏季论坛（深圳）· 扩大消费需求的政策思考', source: '网易财经（2026-08-21）', url: 'https://www.163.com/money/article/L4SBHOP800259S57.html', verified: 'media', themes: ['distribution', 'labor', 'growth'] },
  { id: 'k2026f', date: '2026-09-14', form: '采访', venue: '网易财经智库专访 · 户籍、养老金与人工智能', source: '中华网转载（网易财经智库）', url: 'https://business.china.com/toutiao/13004642/20260914/49738430.html', verified: 'media', themes: ['hukou', 'distribution'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 人口转变与老龄化 ——
  { id: 'd1', k: 'k2020', theme: 'demography', type: '原话', text: '2025年中国人口总量或将达到峰值，以后就是负增长。' },
  { id: 'd2', k: 'k2021b', theme: 'demography', type: '原话', text: '我的保守估计是，第二个转折点在2025年到2030年间到达。但从最新的人口数据来看，第二个转折点在2025年就会达到，即总人口达到峰值，之后便开始负增长。' },
  { id: 'd3', k: 'k2021a', theme: 'demography', type: '转述', text: '总人口峰值将在 2025 年前到来，是继 2010 年劳动年龄人口峰值之后老龄化的“第二个转折点”；老龄化经人口总量、收入分配、年龄结构三个效应抑制消费。' },
  { id: 'd4', k: 'k2023a', theme: 'demography', type: '原话', text: '人口负增长的趋势无法逆转，但可以改变行为，改变预期。' },
  { id: 'd5', k: 'k2025a', theme: 'demography', type: '原话', text: '我们仍然可以说人口红利，但将是一种新的人口红利，我们可以称之为人力资本的培养带来的人口质量红利或人才红利。' },
  { id: 'd6', k: 'k2025b', theme: 'demography', type: '原话', text: '这并不意味着广义人口红利消失，或经济增长从此失去动力。' },
  { id: 'd7', k: 'k2025b', theme: 'demography', type: '转述', text: '书中称 2023 年人口以 1.48‰ 的速度减少、老龄化率达 15.4%，并引中国人口与发展研究中心预测：2032 年老龄化率将超过 21%。' },
  { id: 'd8', k: 'k2026a', theme: 'demography', type: '原话', text: '投资于降低‘三育成本’，不是让它的价格控制下来，而是要越来越多地把它变成基本公共服务清单中的内容，也就是说政府来承担主要的支出责任，真正让居民、家庭在这方面的支出显著降下来，否则的话很难做到提高生育率。' },
  { id: 'd9', k: 'k2026a', theme: 'demography', type: '转述', text: '据界面新闻同场报道：中国生育率下降兼有经济社会发展与政策两方面原因，因而存在“独特潜力”，“下大力量是可以有所成效的”。' },
  { id: 'd10', k: 'k2010', theme: 'demography', type: '转述', text: '引其与王德文 2005 年合作估算：1982—2000 年人口红利（以抚养比为代理）对人均 GDP 增长的贡献为 26.8%，并判断约 2013 年人口抚养比由降转升、传统人口红利趋于消失。' },
  { id: 'd11', k: 'k2021a', theme: 'demography', type: '原话', text: '最紧迫的问题就是努力在降低孩子的生育、养育和教育成本方面，推出真金白银和精准到位的硬措施。' },

  // —— 劳动力市场与就业 ——
  { id: 'l1', k: 'k2011', theme: 'labor', type: '原话', text: '其实（劳动力供应减少）这个趋势是不以人的意志为转移的，不管你同意还是不同意。' },
  { id: 'l2', k: 'k2011', theme: 'labor', type: '转述', text: '确认此前“最早 2004 年、最迟 2009 年”劳动力供求曲线交叉的判断；称首次“民工荒”出现在 2003 年，2004 年在沿海已较普遍。' },
  { id: 'l3', k: 'k2008', theme: 'labor', type: '转述', text: '劳动力无限供给特征一旦消失即意味着刘易斯转折点到来；这一转折既开启新发展阶段，也伴随严峻挑战。' },
  { id: 'l4', k: 'k2022', theme: 'labor', type: '转述', text: '以 2004 年为刘易斯转折点的标志性时点；若采用“刘易斯转折区间”概念，则 2004 年（劳动力短缺显现）至 2010 年（劳动年龄人口峰值）符合其特征。' },
  { id: 'l5', k: 'k2026a', theme: 'labor', type: '转述', text: '就业矛盾已由总量性转向结构性，以“一老一小”即青年劳动者和大龄劳动者就业困难最为严重，需以公共就业服务应对。' },
  { id: 'l6', k: 'k2026b', theme: 'labor', type: '转述', text: '大语言模型削弱白领岗位入门级技能价值，大龄劳动者可能在数字鸿沟之上再遇“智能鸿沟”，主张劳动者全工作生命周期都能得到公共就业服务。' },
  { id: 'l7', k: 'k2026e', theme: 'labor', type: '转述', text: '人工智能冲击是“强化版”的结构性就业矛盾，须以“升级版”积极就业政策应对；就业率按年龄呈倒 U 形，青年与大龄劳动者低于平均。' },
  { id: 'l8', k: 'k2026d', theme: 'labor', type: '原话', text: '总之，中国既要拥抱人工智能，也必须投资于人。', verified: 'reprint' },

  // —— 户籍与城市化 ——
  { id: 'h1', k: 'k2014b', theme: 'hukou', type: '转述', text: '户籍制度改革应以农民工市民化推进新型城镇化，可“一石三鸟”：增加劳动力供给、延续资源重新配置带来的生产率提高、改善分配并扩大消费。' },
  { id: 'h2', k: 'k2023a', theme: 'hukou', type: '转述', text: '以农民工市民化为核心的新型城镇化是需求侧改革红利的重要来源，可同时释放消费潜力与提高生产率。' },
  { id: 'h3', k: 'k2026f', theme: 'hukou', type: '转述', text: '援引中国社科院与 OECD 经济学家测算：给农民工城市户口可使其消费水平提高约 30%，一亿多稳定在城的农民工可带来 1 万亿—2 万亿元新增消费，拉动消费率至少 1 个百分点。' },
  { id: 'h4', k: 'k2026f', theme: 'hukou', type: '转述', text: '不必再造房地产大周期，但城镇化仍有空间、户籍与常住人口城镇化率约 18 个百分点的差距意味着住房需求长期存在。' },
  { id: 'h5', k: 'k2017', theme: 'hukou', type: '转述', text: '财新署名文章导语：改革与增长并非此消彼长，改革可以提高潜在增长率，至少户籍制度改革能够做到。' },

  // —— 收入分配与消费 ——
  { id: 'c1', k: 'k2020', theme: 'distribution', type: '原话', text: '未来中国的经济增长拉动力主要靠消费需求，消费需求主要靠提高居民收入，更好的收入分配可以提高总体消费需求。' },
  { id: 'c2', k: 'k2011', theme: 'distribution', type: '原话', text: '刘易斯转折点的到来意味着普通劳动者的收入增长加快，就是说中低收入家庭的收入增长加快，因此就具备了库兹涅茨转折点出现的条件。' },
  { id: 'c3', k: 'k2024a', theme: 'distribution', type: '转述', text: '世界银行口径下 2021 年中国家庭消费支出占 GDP 约 38%，低于高收入国家 58%、世界 55%、中等偏上收入国家 45%。' },
  { id: 'c4', k: 'k2024b', theme: 'distribution', type: '转述', text: '中国老龄化率比世界平均至少高 5 个百分点，居民消费率却比世界平均低 18 个百分点，“未富先老”造成年龄结构与消费能力失衡。' },
  { id: 'c5', k: 'k2025f', theme: 'distribution', type: '转述', text: '提出“人口金字塔消费悖论”：2023 年居民消费率 39.1%，低于中等偏上收入国家 47.9% 与世界 56.5%（世界银行），老龄化加深抑制消费能力与意愿。' },
  { id: 'c6', k: 'k2026b', theme: 'distribution', type: '原话', text: '“分好蛋糕”已经成为“做大蛋糕”的前提条件' },
  { id: 'c7', k: 'k2026b', theme: 'distribution', type: '转述', text: '2024 年居民消费率 39.9%，与中等偏上收入国家 48.2% 差约 8 个百分点、与高收入国家 57.8% 再差约 10 个百分点；基尼系数降至 0.4 以下、城乡收入比降至 2.0 以下须较大力度再分配。' },
  { id: 'c8', k: 'k2026e', theme: 'distribution', type: '原话', text: '提高居民消费率不是短期政策和刺激政策可以解决的，必须是更综合的政策。' },
  { id: 'c9', k: 'k2026e', theme: 'distribution', type: '原话', text: '有收入，但不敢花。' },
  { id: 'c10', k: 'k2025d', theme: 'distribution', type: '原话', text: '过去从供给侧角度来说，人口红利有利于经济增长。从需求侧角度来说，人口红利也很重要。' },

  // —— 社会保障与民生 ——
  { id: 'w1', k: 'k2021a', theme: 'welfare', type: '原话', text: '不必保护过剩产能、低效率企业，也不必保护不需要的就业岗位，而只需要保人本身。否则，很可能以保就业岗位的名义保了僵尸企业。' },
  { id: 'w2', k: 'k2021b', theme: 'welfare', type: '转述', text: '各国人均 GDP 1 万—2.5 万美元区间政府支出占 GDP 比重约由 26% 升至 36%，中国 2035 年前正处这一区间，应以覆盖全生命周期的基本公共服务加快建设“中国特色福利国家”。' },
  { id: 'w3', k: 'k2013a', theme: 'welfare', type: '转述', text: '2013 年认为提高法定退休年龄“不应成为近期的选择”，理由是临近退休的转轨一代人力资本处于劣势，主张弹性退休并加强大龄劳动者培训（整理稿）。' },
  { id: 'w4', k: 'k2023b', theme: 'welfare', type: '原话', text: '延迟法定退休年龄不应毕其功于一役，而是应该分解成较小的时间单位，采取长远设计、分步实施、小步快走的策略。' },
  { id: 'w5', k: 'k2026a', theme: 'welfare', type: '原话', text: '劳动生产率的提高速度是可以跑赢老龄化的速度的。' },
  { id: 'w6', k: 'k2026a', theme: 'welfare', type: '转述', text: '据界面新闻同场报道：2035 年前老龄化赡养比年均提高约 4.6%，按潜在增长率测算劳动生产率年均可增 5.6%，计入人工智能贡献可超 7%；养老“缺的不是资金”，而是生产率红利的分享机制。' },
  { id: 'w7', k: 'k2011', theme: 'welfare', type: '转述', text: '主张把新农保式“福利型养老”（social pension）引入城市以快速提高覆盖率，并赞成降低企业社保缴费率、以国企分红补偿。' },
  { id: 'w8', k: 'k2026b', theme: 'welfare', type: '原话', text: '正如投资于物的落地要以企业、行业和项目为本位一样，投资于人要求确立家庭本位。' },

  // —— 增长潜力与宏观 ——
  { id: 'g1', k: 'k2014a', theme: 'growth', type: '原话', text: '总体判断，如果没有别的变化，我国的潜在增长率会从2010之前的大概10%，降到“十二五”期间平均的7.6%，到目前为止我们的测算和现实是很贴近的。到“十三五”期间就会降到6.2%。' },
  { id: 'g2', k: 'k2014a', theme: 'growth', type: '转述', text: '建议“十二五”后两年增长预期目标定在 7.5%，“十三五”时期平均确定在 7%；目标既不作为下限追求超越，也不作为上限容忍更低。' },
  { id: 'g3', k: 'k2013b', theme: 'growth', type: '转述', text: '与陆旸模拟：潜在增长率由 1995—2009 年的 9.8% 降至“十二五”7.2%、“十三五”6.1%（与 2014 年媒体口径 7.6%/6.2% 不同，为不同版本测算）。' },
  { id: 'g4', k: 'k2014b', theme: 'growth', type: '原话', text: '因此，面对新常态我们要做的一件事，而且是最重要的一件事，就是如何从人口红利转向改革红利。' },
  { id: 'g5', k: 'k2010', theme: 'growth', type: '原话', text: '保持稳定的经济增长，尽早进入高收入国家的行列，是缩小“未富先老”缺口的关键和唯一途径。' },
  { id: 'g6', k: 'k2023a', theme: 'growth', type: '原话', text: '我提出“取乎其上得乎中”，就是必须用高预测方案的改革力度，才能达到中预测方案的实际增长潜力。' },
  { id: 'g7', k: 'k2025e', theme: 'growth', type: '转述', text: '预计至 2035 年经济增速维持在 4.5%—4.8%，足以使人均 GDP 超过 2 万美元、成为中等发达国家，但消费需求是关键制约。' },
  { id: 'g8', k: 'k2026e', theme: 'growth', type: '转述', text: '称中国预计今年或明年跨过高收入国家门槛，从中等偏上收入向高收入跨越阶段消费率回升是客观规律。' },
  { id: 'g9', k: 'k1994', theme: 'growth', type: '转述', text: '与林毅夫、李周以“赶超战略—比较优势战略”框架解释改革期高速增长，并预测增长可持续。' },
  { id: 'g10', k: 'k2026c', theme: 'growth', type: '原话', text: '“投资于人”最有机会创造新的超级周期，也恰是探讨生产率红利全民分享途径的绝佳机会。' },
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

export const FEATURED = ['d2', 'd5', 'd8', 'l1', 'c6', 'c8', 'w1', 'g4'];

export const THEME_LINKS = {
  demography: [{ to: '/demographic', label: '人口' }, { to: '/fertility-support', label: '生育支持' }, { to: '/silver-economy', label: '银发经济' }],
  labor: [{ to: '/gig', label: '零工经济' }, { to: '/talent', label: '人才' }],
  hukou: [{ to: '/urban', label: '城镇化' }, { to: '/rural', label: '乡村' }, { to: '/housing', label: '住房地产' }],
  distribution: [{ to: '/consumption', label: '消费' }, { to: '/econ-dashboard', label: '经济大盘' }],
  welfare: [{ to: '/socialgov', label: '社会治理' }, { to: '/healthcare', label: '医疗' }],
  growth: [{ to: '/middleincometrap', label: '中等收入陷阱' }, { to: '/japan-lost-decades', label: '中日比较' }, { to: '/econ-dashboard', label: '经济大盘' }],
};

export const THEME_INTRO = {
  demography: '从“人口红利”到“人口负增长时代”再到“新人口红利”，其人口线索前后连贯：先论证数量红利消退，再把总人口峰值定义为需求侧冲击的起点，近年转向以降低“三育成本”和人力资本培育重新定义红利。',
  labor: '以 2004 年“民工荒”为刘易斯转折点标志，坚持劳动力由无限供给转为短缺的判断；近年议题转向结构性就业矛盾与人工智能对青年、大龄劳动者的差异化冲击。',
  hukou: '把户籍制度改革视为兼具供给与需求效应的“立竿见影”型改革：农民工市民化既延续劳动力再配置带来的生产率，又释放被公共服务不均抑制的消费。',
  distribution: '主张制约增长的主要因素已从供给侧转向需求侧，居民消费率偏低是核心短板；以收入分配、再分配与基本公共服务均等化提高长期消费率，而非依赖短期刺激。',
  welfare: '从 2011 年倡导“福利型养老”到 2021 年后系统论述“中国特色福利国家”与“投资于人”，强调保护“人”而非保护岗位与企业；对延迟退休的立场随人口形势由审慎转为支持渐进推进。',
  growth: '以人口结构变化解释潜在增长率下行，是“十二五”“十三五”潜在增长率测算的代表性来源；主张通过户籍、社保等改革获取“改革红利”，并以“取乎其上得乎中”强调改革力度。',
};

// ============================================================================
// 预判检验台账：只收可被数据检验的前瞻性表述；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '2010-04', venue: '《经济研究》2010 年第 4 期（引 2005 年合作估算）',
    claim: '约 2013 年人口抚养比由下降转为提高，传统人口红利趋于消失',
    check: '国家统计局口径总抚养比 2010 年降至 34.2% 谷底后回升（2013 年 35.3%，2020 年七普 45.9%）。方向兑现，拐点比预测早约 3 年。',
    dataSrc: '国家统计局《中国统计年鉴》人口年龄结构与抚养比；七普公报解读（2021-05）',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '2014-07-01', venue: '《每日经济新闻》',
    url: 'https://www.nbd.com.cn/articles/2014-07-01/845412.html',
    claim: '潜在增长率降到“十二五”期间平均的 7.6%',
    check: '“十二五”时期 GDP 年均实际增长 7.8%（2016 年政府工作报告），与 7.6% 的潜在增长率测算接近。注意潜在增长率与实际增速口径不同。',
    dataSrc: '2016 年政府工作报告；国家统计局',
  },
  {
    id: 'L3', status: 'done', type: '原话', date: '2014-07-01', venue: '《每日经济新闻》',
    url: 'https://www.nbd.com.cn/articles/2014-07-01/845412.html',
    claim: '到“十三五”期间就会降到 6.2%',
    check: '“十三五”前四年 GDP 年均增长 6.6%，2020 年受疫情影响增长 2.3%，五年年均约 5.7%。6.2% 落在疫情前与含疫情两种口径之间，趋势判断兑现。',
    dataSrc: '国家发展改革委《“十三五”规划纲要总结评估》（2021-12）',
  },
  {
    id: 'L4', status: 'failed', type: '转述', date: '2014-07-01', venue: '《每日经济新闻》',
    claim: '“十三五”时期增长预期目标平均确定在 7% 的水平上（政策建议）',
    check: '《“十三五”规划纲要》将 GDP 年均增长目标定为 6.5% 以上，未采用 7% 的建议值（建议未落地；与 L3 的潜在增长率判断相区分）。',
    dataSrc: '《国民经济和社会发展第十三个五年规划纲要》（2016-03）',
  },
  {
    id: 'L5', status: 'done', type: '转述', date: '2021', venue: '中国金融四十人论坛 2021 年会（界面新闻报道）',
    url: 'https://www.jiemian.com/article/6058208.html',
    claim: '中国总人口峰值将在 2025 年之前到来',
    check: '年末总人口 2021 年 141260 万为峰值，2022 年起连续负增长：141175 万（2022）、140967 万（2023）、140828 万（2024）、140489 万（2025）。另：2020-12 与 2021-07 两次表述均指向“2025 年”达峰，实际早约 3—4 年。',
    dataSrc: '国家统计局历年统计公报；2026-01-19 人口数据发布',
  },
  {
    id: 'L6', status: 'done', type: '原话', date: '2023-04-19', venue: '人民论坛署名文章',
    url: 'https://www.rmlt.com.cn/2023/0419/671429.shtml',
    claim: '延迟法定退休年龄不应毕其功于一役，而是应该分解成较小的时间单位，采取长远设计、分步实施、小步快走的策略。',
    check: '2024-09-13 全国人大常委会决定：自 2025-01-01 起用 15 年将男职工法定退休年龄由 60 岁延至 63 岁、女职工由 50/55 岁延至 55/58 岁，每 4 个月（或 2 个月）延迟 1 个月，并设最长 3 年弹性。政策形态与其“小步快走”主张一致（不代表因果）。',
    dataSrc: '全国人大常委会《关于实施渐进式延迟法定退休年龄的决定》；人社部 2024-09-13 发布会',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2021', venue: '中国金融四十人论坛 2021 年会（界面新闻报道）',
    claim: '人口峰值后消费需求将成为经济增长的常态化制约（需求侧冲击）',
    check: '2026 年 1—8 月社会消费品零售总额同比 +1.1%、CPI +0.9%；其本人引世界银行口径 2024 年居民消费率 39.9%。数据方向与判断一致，但消费疲弱难以单独归因于人口因素，暂列未决。',
    dataSrc: '国家统计局 2026-09-15 月度数据（本站经济大盘模块）；世界银行 WDI',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2026-03-22', venue: '中国发展高层论坛 2026 年年会',
    url: 'https://www.jiemian.com/article/14149010.html',
    claim: '劳动生产率的提高速度是可以跑赢老龄化的速度的。',
    check: '检验窗口至 2035 年。“十四五”时期全员劳动生产率年均增长 6.0%（2020 年价格），高于其所引 2035 年前赡养比年均 4.6% 的增速；后续取决于潜在增长率与 AI 贡献。',
    dataSrc: '国家统计局“十四五”成就系列报告之一（2026-06-02）',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2025-11', venue: '中国经济运行与政策国际论坛 2025（星岛环球网报道）',
    claim: '至 2035 年经济增速维持在 4.5%—4.8%，人均 GDP 超过 2 万美元',
    check: '2025 年 GDP 增长 5.0%，2026 年上半年 +4.7%；2025 年人均 GDP 13953 美元（按年均汇率）。窗口至 2035 年。',
    dataSrc: '国家统计局 2026-01-19 发布；2026 年上半年 GDP（本站经济大盘模块）',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2026-08', venue: '2026 网易经济学家年会·夏季论坛（网易财经报道）',
    claim: '中国预计今年或明年跨过高收入国家门槛',
    check: '世界银行 2026-07 分组：2025 年中国人均 GNI（Atlas 法）14230 美元，高收入门槛 14375 美元，差 145 美元，仍属中等偏上收入。2026 年数据将于 2027-07 分组时判定。',
    dataSrc: '世界银行 Country and Lending Groups（FY2027）；World Bank WDI',
  },
  {
    id: 'L11', status: 'open', type: '转述', date: '2026-03-22', venue: '中国发展高层论坛 2026 年年会（界面新闻报道）',
    url: 'https://www.jiemian.com/article/14148846.html',
    claim: '中国生育率下降既有经济社会发展原因也有政策因素，提升生育率“下大力量是可以有所成效的”',
    check: '出生人口 2023 年 902 万、2024 年 954 万、2025 年 792 万（出生率 5.63‰）；国家育儿补贴（每孩每年 3600 元，至 3 周岁）自 2025 年起实施。政策效果需更长周期观察。',
    dataSrc: '国家统计局历年统计公报；中办国办《育儿补贴制度实施方案》（2025-07-28）',
  },
  {
    id: 'L12', status: 'open', type: '转述', date: '2026-04-01', venue: '求是网署名文章',
    url: 'https://www.qstheory.cn/20260401/374741d492ca477194e54493f04ca1ac/c.html',
    claim: '居民消费率向中等偏上收入国家平均水平趋同（差距约 8 个百分点）是可以预期的目标',
    check: '长期目标，对应“十五五”规划“居民消费率明显提高”。世界银行口径 2024 年 39.9%，年度序列更新滞后，暂无法闭环。',
    dataSrc: '世界银行 WDI；“十五五”规划纲要',
  },
  {
    id: 'L13', status: 'open', type: '转述', date: '2026-09-14', venue: '网易财经智库专访（中华网转载）',
    claim: '给农民工城市户口可使其消费提高约 30%，带来 1 万亿—2 万亿元新增消费',
    check: '属条件性测算，前提是户籍与基本公共服务均等化改革落地；2025 年末常住人口城镇化率 67.9%，户籍人口城镇化率官方未例行公布。',
    dataSrc: '国家统计局 2025 年统计公报',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '2023 年人口负增长速度', said: 1.48, official: 1.48, unit: '‰', saidSrc: '《新人口红利》书摘（2025-03）', offSrc: '国家统计局：2023 年人口自然增长率 -1.48‰', comparable: true },
  { id: 'n2', label: '2023 年 65 岁及以上人口占比', said: 15.4, official: 15.4, unit: '%', saidSrc: '《新人口红利》书摘（2025-03）', offSrc: '国家统计局 2023 年统计公报：15.4%', comparable: true },
  { id: 'n3', label: '2020 年总和生育率', said: 1.3, official: 1.3, unit: '', saidSrc: '观察者网 2023-01-18；求是网 2026-04-01', offSrc: '第七次全国人口普查：1.3', comparable: true },
  { id: 'n4', label: '“十二五”增长（潜在 vs 实际）', said: 7.6, official: 7.8, unit: '%', saidSrc: '2014-07-01 每经：潜在增长率 7.6%', offSrc: '“十二五”GDP 年均实际增长 7.8%（口径不同）', comparable: false },
  { id: 'n5', label: '“十三五”增长（潜在 vs 实际）', said: 6.2, official: 5.7, unit: '%', saidSrc: '2014-07-01 每经：潜在增长率 6.2%', offSrc: '“十三五”GDP 年均约 5.7%，含 2020 年疫情冲击（口径不同）', comparable: false },
  { id: 'n6', label: '劳动生产率年均增速', said: 5.6, official: 6.0, unit: '%', saidSrc: '2026-03-22 中国发展高层论坛：2035 年前潜在 5.6%', offSrc: '“十四五”全员劳动生产率年均 6.0%（窗口不同）', comparable: false },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '人口转变', '劳动力市场', '城市化与户籍', '分配与消费', '增长与改革'],
  nodes: [
    { id: 'core', name: '人口—经济\n转折点', cat: 0, size: 58 },
    { id: 'dividend', name: '人口红利', cat: 1, size: 36 },
    { id: 'peak', name: '总人口峰值\n负增长', cat: 1, size: 34 },
    { id: 'aging', name: '未富先老', cat: 1, size: 30 },
    { id: 'newdiv', name: '新人口红利', cat: 1, size: 30 },
    { id: 'sanyu', name: '三育成本', cat: 1, size: 24 },
    { id: 'lewis', name: '刘易斯转折点', cat: 2, size: 40 },
    { id: 'structural', name: '结构性就业矛盾', cat: 2, size: 28 },
    { id: 'ai', name: 'AI 就业冲击', cat: 2, size: 26 },
    { id: 'retire', name: '渐进延迟退休', cat: 2, size: 24 },
    { id: 'hukou', name: '户籍改革', cat: 3, size: 34 },
    { id: 'citizen', name: '农民工市民化', cat: 3, size: 30 },
    { id: 'demandshock', name: '需求侧冲击', cat: 4, size: 34 },
    { id: 'consrate', name: '居民消费率', cat: 4, size: 30 },
    { id: 'redistribute', name: '再分配', cat: 4, size: 26 },
    { id: 'welfare', name: '中国特色\n福利国家', cat: 4, size: 28 },
    { id: 'potential', name: '潜在增长率', cat: 5, size: 34 },
    { id: 'reformdiv', name: '改革红利', cat: 5, size: 32 },
    { id: 'invest', name: '投资于人', cat: 5, size: 32 },
    { id: 'miracle', name: '比较优势\n（中国的奇迹）', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'dividend'], ['core', 'lewis'], ['core', 'peak'], ['core', 'potential'], ['core', 'demandshock'],
    ['dividend', 'lewis'], ['dividend', 'aging'], ['dividend', 'newdiv'], ['peak', 'aging'], ['peak', 'demandshock'],
    ['newdiv', 'sanyu'], ['newdiv', 'invest'], ['lewis', 'structural'], ['structural', 'ai'], ['aging', 'retire'],
    ['lewis', 'hukou'], ['hukou', 'citizen'], ['citizen', 'consrate'], ['demandshock', 'consrate'],
    ['consrate', 'redistribute'], ['redistribute', 'welfare'], ['welfare', 'invest'], ['potential', 'reformdiv'],
    ['reformdiv', 'hukou'], ['miracle', 'potential'], ['ai', 'invest'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '刘易斯转折点是否已经到来',
    sides: [
      { who: '蔡昉（《经济研究》2010-04、2022-01 等）', view: '以 2004 年起普遍性劳动力短缺和普通劳动者工资持续上涨为标志，判断刘易斯转折点已到；2004—2010 年可视为“转折区间”。认为否定论者“固守过于严格的剩余劳动力定义”。' },
      { who: '南亮进、马欣欣、孟昕等及部分政策研究', view: '据蔡昉 2022 年文献综述转述：Minami & Ma（2009）、Meng（2014）等认为农业与工业边际劳动生产力尚未趋同，转折点未到。2010 年《经济参考报》援引申银万国报告：农业就业占比与边际产出差距仍大、城市化率远低于日韩拐点时水平，“民工荒”不能等同于拐点；另有研究以“标准结构法”估算农村仍沉淀约 15% 剩余劳动力。' },
    ],
    note: '分歧核心在判据：劳动力短缺与工资上涨（蔡昉）vs 农业与非农部门边际生产力相等（严格定义）。乡村研究数据库收录的《对我国是否已进入“刘易斯拐点”的判断和政策选择》报告持“尚有距离、不久将到”的中间立场。本站不裁定，仅并陈。',
  },
  {
    id: 'x2',
    title: '延迟法定退休年龄：时机与前提',
    sides: [
      { who: '蔡昉（2013，人民网整理稿）', view: '转述：发达国家普遍提高退休年龄，但中国临近退休的“转轨一代”人力资本处于劣势，提高法定退休年龄不应成为近期选择；宜采取弹性退休并加强培训。' },
      { who: '蔡昉（2023，人民论坛署名文章）', view: '转述：鉴于老龄化加深，延迟法定退休年龄“时不我待”，但须以提高大龄劳动者实际劳动参与率为直接目标，“小步快走”并配套就业保障与养老金激励。' },
    ],
    note: '同一学者立场随人口形势（2021 年进入中度老龄化、2022 年人口负增长）调整，属观点演变而非矛盾。政策结果：2024-09-13 全国人大常委会决定自 2025-01-01 起渐进实施，并设最长 3 年弹性、不得强制选择退休年龄。',
  },
  {
    id: 'x3',
    title: '鼓励生育：公共服务化还是大额现金补贴',
    sides: [
      { who: '蔡昉（中国发展高层论坛 2026、CF40 2021）', view: '主张把生育、养育、教育成本纳入基本公共服务清单、由政府承担主要支出责任；2021 年称“不能指望生育率的实质性回升”，2026 年称中国存在“独特潜力”，“下大力量是可以有所成效的”。' },
      { who: '梁建章（财新网 2025-07-29）', view: '认为发钱补贴生育有效但“力度要够大”，育儿补贴应主要由中央财政负担，视之为全面生育福利的起步。' },
    ],
    note: '另一端：石智雷（界面新闻 2025）基于湖北田野实验认为补贴能提高生育意愿但需达一定额度，同时称当前“大力度的生育补贴是不现实的”。各方对政策方向（加大支持）并无根本分歧，差异在工具（现金 vs 公共服务）与力度；本站不作评价。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传“蔡昉最新演讲 / 最新发声”无出处拼接稿', status: '不收录', reason: '检索未见本人针对具体托名语录的辟谣；自媒体以此为题、无主办方或原始媒体可追溯的稿件一律不收录。' },
  { id: 'q2', item: '“中国经济将面临失去的10年”', status: '〔存疑〕', reason: '见爱思想转载的人物特稿标题，系记者对其观点的概括（“甚至预言”），未见本人原话出处，不作引语。' },
  { id: 'q3', item: '著作《中国经济的未来》', status: '更正', reason: '实为《中国经济的未来可能性》（社会科学文献出版社 2024-07，ISBN 978-7-5228-3657-7）。' },
  { id: 'q4', item: '《中国的奇迹》出版年份', status: '并陈', reason: '百度百科作 1995 年；上海三联书店版书目、林毅夫二十周年序均为 1994 年初版，本站取 1994。' },
  { id: 'q5', item: '人口峰值预测的不同版本', status: '并陈', reason: '2020-12 称“2025 年或将达峰”；2021 年 CF40 年会称“2025 年之前”；2021-07 称保守估计 2025—2030 年、据新数据为 2025 年。实际峰值 2021 年。' },
  { id: 'q6', item: '刘易斯转折点时点表述', status: '并陈', reason: '2011 年采访称首次“民工荒”在 2003 年；2022 年论文以 2004 年为标志年并提出 2004—2010 年“转折区间”；另一篇论文称“自 2003 年以来”劳动力短缺持续出现。' },
  { id: 'q7', item: '“世界银行就业问题高级别咨询委员会成员”', status: '〔存疑〕', reason: '仅见书店商品页作者简介，未见世界银行官方名单。' },
  { id: 'q8', item: '中国金融四十人论坛 2021 年会讲话具体日期', status: '〔存疑〕', reason: '界面新闻仅称“近日”，据文中引用 2021 年 2 月失业率推断为 2021 年春，未核实具体日期。' },
  { id: 'q9', item: '“十二五”“十三五”潜在增长率两组数字', status: '并陈', reason: 'China & World Economy 2013 论文为 7.2%/6.1%，2014 年媒体采访口径为 7.6%/6.2%，属不同版本测算。' },
  { id: 'q10', item: '《破解中国经济发展之谜》出版时间', status: '〔存疑〕', reason: '中国青年报 2014-01-13 报道为新著发布，出版月份（2013 年末或 2014 年初）未核。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
