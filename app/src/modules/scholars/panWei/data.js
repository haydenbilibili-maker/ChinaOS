// ============================================================================
// 学者专栏 · 潘维 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"潘维认为"而无原文可溯者一律不收录。
// 主编文集中他人撰写的章节不归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  model: { label: '中国模式与中华体制', color: '#c41e3a' },
  minben: { label: '民本政治与民主观', color: '#e8a317' },
  fazhi: { label: '咨询型法治', color: '#8b5cf6' },
  sheji: { label: '社稷体制与基层社会', color: '#10b981' },
  rural: { label: '农民与农村集体', color: '#94a3b8' },
  west: { label: '中西比较与国际格局', color: '#22d3ee' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '潘维',
  born: '1960 年（本人自述）',
  summary:
    '北京大学国际政治系学士（1982）、硕士（1984，导师陈翰笙），硕士毕业后任职中国社会科学院世界经济与政治研究所，后赴美留学，1996 年获加州大学伯克利分校政治学博士。1996 年起任教北京大学国际关系学院，曾任北京大学中国与世界研究中心主任，2023 年秋自北大退休后转任澳门大学。2000—2003 年提出"咨询型法治"政体设想，2009 年主编《中国模式：解读人民共和国的60年》并以"国民经济—民本政治—社稷体制"三位一体概括"当代中华体制"，2017 年出版《信仰人民》；近年公开文字多为国际格局短评与民族—国家概念辨析。',
  current: [
    '澳门大学社会科学学院政府与行政学系讲座教授（2023-09 起）',
    '澳门大学全球与公共事务研究所所长（2023-09 起）',
    '北京大学中外人文交流研究基地特约专家（据北大 IGCU 2026-03 转载署名）',
  ],
  sources: '澳门大学全球与公共事务研究所及社会科学学院个人页；澳门特区政府新闻局 2024 年报道；本人《与北大国际政治系结缘》（爱思想 2024）；北师大、复旦 2026 年来访报道；百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 14,
  subtitle: '中国模式 · 当代中华体制 · 民本政治 · 咨询型法治 · 社稷体制 · 信仰人民',
  span: '2002—2026',
  careerTitle: '履历时间线 · 北大国政 → 社科院 → 伯克利 → 北大国关 → 澳门大学',
  defaultTheme: 'model',
  moduleId: 'scholarPanWei',
  sourceNote: '期刊论文原文 / 署名文章与书序 / 讲演整理稿 / 主流媒体采访 · 对照：宪法修正案、中办国办文件、国家统计局、教育部、外汇局及国际通讯社报道',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  study: { label: '求学', color: '#8b5cf6' },
  cass: { label: '社科院', color: '#e8a317' },
  pku: { label: '北大教职', color: '#22d3ee' },
  um: { label: '澳门大学', color: '#10b981' },
};

/** 履历甘特：起止为小数年；月份未载者取近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '北京大学国际政治系本科', org: '北京大学', start: 1978.7, end: 1982.5, group: 'study', note: '入学年据本人自述"1978 年"；澳大页作 1982 年学士' },
  { id: 'c2', role: '北京大学国际政治系硕士研究生（导师陈翰笙）', org: '北京大学', start: 1982.7, end: 1984.5, group: 'study', note: '导师与提前一年毕业据百度百科，未见本人简历载明〔存疑〕' },
  { id: 'c3', role: '中国社会科学院世界经济与政治研究所', org: '中国社会科学院', start: 1984.6, end: 1987.5, group: 'cass', note: '1986 年随浦山率团访新加坡任秘书，次年赴美；起止月份为推定' },
  { id: 'c4', role: '加州大学伯克利分校政治学博士研究生', org: 'UC Berkeley', start: 1987.6, end: 1996.5, group: 'study', note: '1996 年获博士学位；入学年据本人"次年"赴美自述推定' },
  { id: 'c5', role: '北京大学国际关系学院副教授、教授', org: '北京大学', start: 1996.6, end: 2023.6, group: 'pku', note: '2004 年前后公开文献称副教授；升任教授年份未见官方载明〔存疑〕' },
  { id: 'c6', role: '北京大学中国与世界研究中心主任', org: '北京大学', start: 2003.0, end: 2023.6, group: 'pku', note: '任期起止未见官方载明，按中心刊物 2003—2023 推定〔存疑〕' },
  { id: 'c7', role: '澳门大学政府与行政学系讲座教授', org: '澳门大学', start: 2023.67, end: 2026.75, group: 'um' },
  { id: 'c8', role: '澳门大学全球与公共事务研究所所长', org: '澳门大学', start: 2023.67, end: 2026.75, group: 'um' },
];

export const BOOKS = [
  { id: 'b1', year: 2003, title: '农民与市场：中国基层政权与乡镇企业', publisher: '商务印书馆', isbn: '9787100039260', themes: ['rural', 'sheji'], verified: 'primary', note: '445 页；以伯克利博士论文为基础，论证基层政权与乡村集体工业的"联盟"；月份各馆藏记录作 2003-01 或 2003-09' },
  { id: 'b2', year: 2003, title: '法治与"民主迷信"——一个法治主义者眼中的中国现代化和世界秩序', publisher: '香港社会科学出版社有限公司', date: '2003-05', isbn: '9789626200629', themes: ['fazhi', 'minben'], verified: 'primary', note: '379 页；"咨询型法治"论述的结集' },
  { id: 'b3', year: 2006, title: 'Debating Political Reform in China: Rule of Law vs. Democratization', publisher: 'M.E. Sharpe（后归 Routledge）', coauthors: 'Suisheng Zhao 主编', themes: ['fazhi'], verified: 'primary', note: '收入潘维第 1 章与第 14 章"Reflections on \u2018Consultative Rule of Law Regime\u2019: A Response to My Critics"；非本人专著' },
  { id: 'b4', year: 2006, title: '社会主义新农村建设的理论与实践', publisher: '出版社未独立核对', coauthors: '贺雪峰', themes: ['rural'], verified: 'doubt', note: '仅据澳门大学个人页著作目录，版权页未核' },
  { id: 'b5', year: 2008, title: '中国社会价值观变迁30年', publisher: '出版社未独立核对', coauthors: '廉思', themes: ['west'], verified: 'doubt', note: '仅据澳门大学个人页著作目录，版权页未核' },
  { id: 'b6', year: 2009, title: '中国模式：解读人民共和国的60年', publisher: '中央编译出版社', date: '2009-11', isbn: '9787511700773', themes: ['model'], verified: 'primary', note: '潘维主编，630 页；总论《当代中华体制——中国模式的经济、政治、社会解析》为本人执笔，其余章节作者含温铁军、张静、朱云汉等；新闻报道称 2009 年 12 月底面世，见存疑栏' },
  { id: 'b7', year: 2010, title: '当代中华体制：中国模式的经济、政治、社会解析', publisher: '香港三联书店（当代中国研究丛书）', isbn: '9789620429361', themes: ['model', 'minben', 'sheji'], verified: 'primary', note: '据豆瓣书目' },
  { id: 'b8', year: 2014, title: '比较政治学理论与方法', publisher: '北京大学出版社', date: '2014-03', isbn: '9787301238820', themes: ['west'], verified: 'primary', note: '教材' },
  { id: 'b9', year: 2015, title: 'Behind China\u2019s Economic Miracle: The Coalition of Rural Collective Industries & Grassroots Authorities', publisher: 'Foreign Languages Press', date: '2015-09', isbn: '9787119093840', themes: ['rural'], verified: 'primary', note: '《农民与市场》英译本；澳门大学个人页作 2017，见存疑栏' },
  { id: 'b10', year: 2017, title: '信仰人民：中国共产党与中国政治传统', publisher: '中国人民大学出版社', date: '2017-04', isbn: '9787300234748', themes: ['sheji', 'minben'], verified: 'primary', note: '自序以"党为什么会腐化？党是做什么的？"为题转载' },
  { id: 'b11', year: 2019, title: '士者弘毅', publisher: '中国人民大学出版社', isbn: '9787300267081', themes: ['sheji', 'model'], verified: 'primary', note: '察网 2019-04-19 称"近日出版"，观察者网称 2019 年 4 月出版；另有网站标 2018，见存疑栏' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k2002', date: '2002-06', form: '讲演', venue: '《民主迷信与中国政治体制改革的方向》（对北大学生讲演，原载北大在线）', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/808.html', verified: 'primary', themes: ['fazhi', 'minben', 'rural'] },
  { id: 'k2003a', date: '2003-02', form: '论文', venue: 'Pan Wei, "Toward a Consultative Rule of Law Regime in China", Journal of Contemporary China 12(34): 3—43', source: 'Taylor & Francis 摘要页', url: 'https://www.tandfonline.com/doi/abs/10.1080/10670560305465', verified: 'primary', themes: ['fazhi'] },
  { id: 'k2003b', date: '2003-05', form: '书介', venue: '《法治与"民主迷信"》内容简介与作者自述', source: '网上书店书目页（转录）', verified: 'reprint', themes: ['fazhi', 'minben'] },
  { id: 'k2004', date: '2004', form: '署名文章', venue: '《评选举迷信》（据文中"乌克兰选举""今年春天"推定为 2004 年）', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/16893.html', verified: 'primary', themes: ['minben', 'fazhi'] },
  { id: 'k2007', date: '2007', form: '论文', venue: '《论现代社会的核心价值观》（年份据许雅棠 2019 年论文脚注）', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/13210.html', verified: 'primary', themes: ['west', 'minben'] },
  { id: 'k2008', date: '2008-10-27', form: '署名文章', venue: '《农地"流转集中"到谁手里？》', source: '爱思想（2009-01-08 转载）', url: 'https://www.aisixiang.com/data/24061.html', verified: 'primary', themes: ['rural'] },
  { id: 'k2009a', date: '2009-01', form: '采访', venue: '《新财经》专访 · 警惕资本下乡夺走农民土地', source: '《新财经》（爱思想转载）', url: 'https://www.aisixiang.com/data/24062.html', verified: 'media', themes: ['rural'] },
  { id: 'k2009b', date: '2009-01-17', form: '讲演', venue: '新加坡中国商会演讲，刊《绿叶》2009 年第 4 期，题《中国模式，人民共和国60年的成果》', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/28130.html', verified: 'primary', themes: ['model', 'minben', 'sheji', 'west'] },
  { id: 'k2010a', date: '2010-01-18', form: '采访', venue: '新浪新闻专题 ·"中国学派"说了什么', source: '新浪新闻', url: 'http://news.sina.com.cn/c/sd/2010-01-18/150019492388_2.shtml', verified: 'media', themes: ['minben', 'model'] },
  { id: 'k2010b', date: '2010-02-24', form: '采访', venue: '《国际先驱导报》专访 · 中国模式不是为了顶礼膜拜', source: '《国际先驱导报》（中国社会科学网转载）', url: 'https://www.sinoss.net/c/2010-02-24/532947.shtml', verified: 'media', themes: ['model'] },
  { id: 'k2014', date: '2014-04-13', form: '署名文章', venue: '《谈民主法治和制度迷信》，《环球时报》；爱思想转载题《世上没有永葆"善政"的制度》', source: '环球时报（爱思想转载）', url: 'https://www.aisixiang.com/data/73619.html', verified: 'primary', themes: ['model', 'minben'] },
  { id: 'k2015a', date: '2015-02', form: '书序', venue: '《大道之行》（中国人民大学出版社 2015-02）序言，转载题《国家兴衰不取决于政制，而取决于政策》，原题《要警惕共产党的国民党化》', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/85088.html', verified: 'primary', themes: ['model', 'minben'] },
  { id: 'k2015b', date: '2015-11-04', form: '讲话', venue: '清华大学福山演讲会评议人发言', source: '澎湃新闻报道', url: 'https://www.thepaper.cn/newsDetail_forward_1393102', verified: 'media', themes: ['fazhi', 'west'] },
  { id: 'k2017', date: '2017-04', form: '书序', venue: '《信仰人民》自序，转载题《党为什么会腐化？党是做什么的？》', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/103875.html', verified: 'primary', themes: ['sheji', 'minben'] },
  { id: 'k2019a', date: '2019-04-19', form: '书摘', venue: '《士者弘毅》书摘', source: '察网 / 昆仑策转载', verified: 'reprint', themes: ['sheji'] },
  { id: 'k2019b', date: '2019-06-29', form: '讲演', venue: '都市治理讲座整理稿（2018-09 讲座）', source: '观察者网', verified: 'reprint', themes: ['sheji'] },
  { id: 'k2019c', date: '2019-07-03', form: '采访', venue: '《湖南日报》专访', source: '湖南智库网转载', url: 'https://www.hnzk.gov.cn/zhikujianyan/10673.html', verified: 'media', themes: ['sheji', 'model'] },
  { id: 'k2019d', date: '2019-07-31', form: '署名文章', venue: '《中美贸易战，是一场冰冻和平之战》', source: '观察者网作者专栏', url: 'https://www.guancha.cn/PanWei/2019_07_31_511666.shtml', verified: 'primary', themes: ['west'] },
  { id: 'k2020', date: '2020-01', form: '论文', venue: '《论社会进步的标准》，《开放时代》2020 年第 1 期', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/119907.html', verified: 'primary', themes: ['sheji', 'west'] },
  { id: 'k2021', date: '2021', form: '署名文章', venue: '《百年中国共产党与政党制度及社会主义运动》，《北京大学校报》第 1573 期', source: '北京大学校报（爱思想转载）', url: 'https://www.aisixiang.com/data/126033.html', verified: 'primary', themes: ['model', 'west'] },
  { id: 'k2022', date: '2022-03', form: '署名文章', venue: '《人类共同价值的世界潮流》', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/132308.html', verified: 'primary', themes: ['west'] },
  { id: 'k2023', date: '2023-12-14', form: '讲演', venue: '《找回国家：当代中国语境下现代化理论的范式演进》（2023 年中央和国家机关干部研修班讲座，马楚博整理修订）', source: '爱思想转载', url: 'https://www.aisixiang.com/data/147972.html', verified: 'reprint', themes: ['west', 'model'] },
  { id: 'k2024a', date: '2024-06-12', form: '采访', venue: '喀什论坛期间接受道中华专访', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_27720461', verified: 'media', themes: ['model', 'rural'] },
  { id: 'k2024b', date: '2024', form: '署名文章', venue: '《与北大国际政治系结缘》（回忆文章）', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/152546.html', verified: 'primary', themes: ['model'] },
  { id: 'k2024c', date: '2024-11-11', form: '署名文章', venue: '《特朗普复辟与国际结构》，《海外看世界》', source: '《海外看世界》微信公众号', url: 'https://mp.weixin.qq.com/s/OOcO4_QRhSUBq2u8rCAVsg', verified: 'primary', themes: ['west', 'model'] },
  { id: 'k2025a', date: '2025-03', form: '署名文章', venue: '《美乌"米洛斯对话"后的四边形国际格局》（《海外看世界》学者快评；澳大机构库著录为 2025-02 待刊）', source: '澳门大学机构库著录；正文仅见转载站', url: 'https://repository.um.edu.mo/handle/10692/144144', verified: 'reprint', themes: ['west'] },
  { id: 'k2025b', date: '2025-10-20', form: '讲座', venue: '澳门大学学生事务长特邀讲座 ·"国与国家，族与民族"', source: '澳门大学电子公告（讲座预告摘要）', url: 'https://e-bulletin.um.edu.mo/notice/438068/', verified: 'primary', themes: ['west'] },
  { id: 'k2026', date: '2026-03-02', form: '署名文章', venue: '《美国的新孤立主义与全球地缘政治动向》（原载《海外看世界》）', source: '北京大学中外人文交流研究基地转载', url: 'https://www.igcu.pku.edu.cn/info/1026/9023.htm', verified: 'primary', themes: ['west'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 中国模式与中华体制 ——
  { id: 'm1', k: 'k2009b', theme: 'model', type: '原话', text: '中国模式是对中华人民共和国60年来走过的成功之路的抽象总结。目前学界政界都存在把西方的今天当中国明天的迷信。' },
  { id: 'm2', k: 'k2009b', theme: 'model', type: '原话', text: '社稷体系塑造了民本政府，民本政府塑造了国民经济，也保障着社稷体系的生存。' },
  { id: 'm3', k: 'k2010b', theme: 'model', type: '原话', text: '我用“当代中华体制”取代“中国模式”。当代中华体制分三个层次：国民经济、民本政治和社稷体制，三位一体，共十二个支柱。' },
  { id: 'm4', k: 'k2010b', theme: 'model', type: '原话', text: '在中国成功之际谈模式，是说失败的可能就在于背离这个模式。' },
  { id: 'm5', k: 'k2009b', theme: 'model', type: '原话', text: '中国模式的弱点极为明显：执政集团可趋于退化，法治尚未健全。与新加坡模式相比，中国缺乏法治。' },
  { id: 'm6', k: 'k2021', theme: 'model', type: '原话', text: '我们不认为中国模式“普适”，不致力于在全世界推广中国社会主义模式。' },
  { id: 'm7', k: 'k2015a', theme: 'model', type: '原话', text: '国家兴衰不取决于政制，而取决于政策。' },
  { id: 'm9', k: 'k2024c', theme: 'model', type: '原话', text: '二是中国官方能否减少精英主义，承认“有限政府”，小心维护市场机制，从而恢复地方活力和全民对市场的信心' },
  { id: 'm10', k: 'k2024a', theme: 'model', type: '原话', text: '铸牢中华民族共同体意识是解决民族问题的中国方案，也为世界指明了增强政治共同体内聚力的道路，是普适的。' },

  // —— 民本政治与民主观 ——
  { id: 'n1', k: 'k2009b', theme: 'minben', type: '原话', text: '民本主义的含义是：政府存在的惟一理由在于照看全体民众的民生福祉；否则“造反有理”，政府理当被推翻。' },
  { id: 'n2', k: 'k2009b', theme: 'minben', type: '原话', text: '中国政治模式最根本的特征是拥有一个先进的执政集团。' },
  { id: 'n3', k: 'k2009b', theme: 'minben', type: '原话', text: '不同于西式的democracy（选举民主）和autocracy（个人专制），中国文官制是大众型的meritocracy（绩优选拔制）。' },
  { id: 'n4', k: 'k2010a', theme: 'minben', type: '原话', text: '西方的两分法是“democracy vs. autocracy”(民主对专制)，我加上“meritocracy”(绩优制)，这个“三”就打开了无数种可能' },
  { id: 'n5', k: 'k2004', theme: 'minben', type: '原话', text: '选举的游戏规则不过是“多数决”。这个游戏并不比考试加日常考核的游戏更出色。' },
  { id: 'n6', k: 'k2004', theme: 'minben', type: '原话', text: '选举不治腐败，选举导致腐败。选举中的腐败是靠法治来控制的。' },
  { id: 'n7', k: 'k2004', theme: 'minben', type: '原话', text: '我无意一概反对选举。在阶级意识强烈和阶级斗争壁垒森严的情况下，我还非常欣赏选举的简单、高效、平和。' },
  { id: 'n8', k: 'k2015a', theme: 'minben', type: '原话', text: '信仰人民是中华民族和中华文明得以生生不息的伟大道统。' },
  { id: 'n9', k: 'k2015a', theme: 'minben', type: '转述', text: '在《大道之行》序言中提出须高度警惕共产党的"国民党化"与"烂根"现象，并称制度决定论属于唯心主义。' },

  // —— 咨询型法治 ——
  { id: 'f1', k: 'k2002', theme: 'fazhi', type: '原话', text: '与专制不同，咨询型法治不是人治，也不是党治。与西方民主为主，法治为辅的体制也不同，咨询型法治是以法治为主，民主为辅的体制。' },
  { id: 'f2', k: 'k2002', theme: 'fazhi', type: '转述', text: '咨询型法治由六大支柱构成：中立的文官体制、独立的司法系统、独立的反贪机构、独立透明的审计机构、以人民代表大会为核心的广泛社会咨询系统，以及言论、出版、集会、结社四大自由。' },
  { id: 'f3', k: 'k2002', theme: 'fazhi', type: '原话', text: '法治优于人治，德治优于法治。人民主权是地道的西方观念，而且是个有很大问题的西方观念，所以我并未强调人民主权。' },
  { id: 'f4', k: 'k2002', theme: 'fazhi', type: '原话', text: '在今天世界的“春秋战国”时代，这个设想也可以说体现一种“新法家”的思潮。' },
  { id: 'f5', k: 'k2003a', theme: 'fazhi', type: '转述', text: '英文论文摘要主张建立"以民主为补充的法治政体"而非"以法治为补充的民主政体"，并提出分三阶段、约二十年的改革路线图，第一阶段为党政分开、党放弃对政府人事的直接管理。' },
  { id: 'f6', k: 'k2003b', theme: 'fazhi', type: '原话', text: '就目前中国的情况而论，适宜建立的不是虚妄的民主，而是法治导向、由六大支柱构成的所谓“咨询型法治”。' },
  { id: 'f7', k: 'k2003b', theme: 'fazhi', type: '原话', text: '笔者不反民主，甚至还有些喜欢民主，可也不信民主教' },
  { id: 'f8', k: 'k2004', theme: 'fazhi', type: '原话', text: '专制的反义词是法治，是分权制衡。' },
  { id: 'f9', k: 'k2015b', theme: 'fazhi', type: '转述', text: '据澎湃报道：在福山清华演讲会上质疑司法独立能否解决一切问题，并称自己二三十年前曾热心研究司法独立。' },

  // —— 社稷体制与基层社会 ——
  { id: 's1', k: 'k2009b', theme: 'sheji', type: '转述', text: '借孟子、朱熹对"社稷"的解释，把以家庭为本位、社区自治为基础的基层社会秩序称为社稷体制，认为基层不稳则天下大乱；政府层级实行弹性条块与"分工制衡"而非西式分权制衡。' },
  { id: 's2', k: 'k2017', theme: 'sheji', type: '原话', text: '党的任务是扎根基层组织社会。什么是执政权？组织基层社会的能力、权力就是执政权。' },
  { id: 's3', k: 'k2017', theme: 'sheji', type: '原话', text: '无论古今中外和国家大小贫富，科层体系都不可能单独治国，人民自治向来重于科层之治。这是政治铁律。' },
  { id: 's4', k: 'k2017', theme: 'sheji', type: '转述', text: '建议选拔党政干部以服务基层社区组织两年为必要条件，并让居民而非党校教员评估干部回炉学习成效。' },
  { id: 's5', k: 'k2019a', theme: 'sheji', type: '原话', text: '官员廉洁最坚实、可靠的基础是社会领域的均等化' },
  { id: 's6', k: 'k2019b', theme: 'sheji', type: '原话', text: '治理体系主要在惩恶，而非锦上添花' },
  { id: 's7', k: 'k2020', theme: 'sheji', type: '原话', text: '社会进步主要基于公共生活演进的自然逻辑，而非应然的价值观和典章制度。' },
  { id: 's8', k: 'k2020', theme: 'sheji', type: '转述', text: '以三把尺子衡量社会进步：维护公共财产及其使用秩序的程度、精算公权使用成本与收益的程度、劳动者再生产的社会化与均等化程度。' },

  // —— 农民与农村集体 ——
  { id: 'r1', k: 'k2002', theme: 'rural', type: '原话', text: '总之，村民自治是个权宜之计。' },
  { id: 'r2', k: 'k2002', theme: 'rural', type: '原话', text: '解决我国农民贫困问题的唯一战略性出路是让大量农民进入工商和服务业，推行城市化。' },
  { id: 'r3', k: 'k2008', theme: 'rural', type: '原话', text: '土地应当流转集中给农村集体。' },
  { id: 'r4', k: 'k2008', theme: 'rural', type: '原话', text: '加强农村集体，巩固农村集体，农民才能自愿进城，而非被资本逼迫进城' },
  { id: 'r5', k: 'k2008', theme: 'rural', type: '原话', text: '实行共有私用，统分结合，双层经营的农村集体才是农民利益真正的代表。' },
  { id: 'r6', k: 'k2009a', theme: 'rural', type: '转述', text: '接受《新财经》采访时警告工商资本下乡大规模租地可能挤占农民土地权益，主张以农村集体而非资本作为流转主体。' },
  { id: 'r7', k: 'k2024a', theme: 'rural', type: '转述', text: '在喀什论坛采访中建议加快南疆农民城镇化，并推广国家通用语言、嵌入主流文化。' },

  // —— 中西比较与国际格局 ——
  { id: 'w1', k: 'k2007', theme: 'west', type: '原话', text: '人类道德观是普世的，但政治价值的所谓“普世”性明显不是事实，过去不是，现在也不是。' },
  { id: 'w2', k: 'k2009b', theme: 'west', type: '原话', text: '十几年后，我们将看到中国成为世界金融开放的旗手，正如中国已经成为自由贸易的旗手。' },
  { id: 'w3', k: 'k2024c', theme: 'west', type: '原话', text: '国际结构变迁并不取决于一、两项尖端技术，而取决于全体国民人均收入提升。' },
  { id: 'w4', k: 'k2024c', theme: 'west', type: '原话', text: '俄乌战争在特朗普上台之际停火，是大概率的。' },
  { id: 'w5', k: 'k2024c', theme: 'west', type: '原话', text: '中国去年约有1800万小学生入学，但去年约只有900万婴儿新生，6年后小学新生将减少一半。换言之，三代人后中国人口将减半到7亿，与届时的美国人口持平。' },
  { id: 'w6', k: 'k2026', theme: 'west', type: '原话', text: '概言之，报告宣告美国放弃全球霸权和冷战意识形态，带有浓厚现实主义和孤立主义色彩。' },
  { id: 'w7', k: 'k2026', theme: 'west', type: '原话', text: '后特朗普时代，新孤立主义会变成两党共识，因为美国很难再重归“世界霸权”追求——如果东亚不发生中国突破第一岛链之战。' },
  { id: 'w8', k: 'k2025a', theme: 'west', type: '转述', text: '据转载稿：美乌白宫会谈后提出美、欧、俄、中"四边形"国际格局，并判断美国居中调解的俄乌停火可能依美国方案较快达成（正文未见原刊页面）。' },
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

export const FEATURED = ['m1', 'm3', 'n1', 'n3', 'f1', 's2', 'm7', 'w7'];

export const THEME_LINKS = {
  model: [{ to: '/govsystem', label: '政府体制' }, { to: '/powerlogic', label: '权力逻辑' }],
  minben: [{ to: '/ideology', label: '意识形态' }, { to: '/leadership', label: '领导体制' }],
  fazhi: [{ to: '/ruleoflaw', label: '法治' }, { to: '/modules/anticorruption', label: '反腐' }],
  sheji: [{ to: '/socialgov', label: '社会治理' }, { to: '/governance', label: '国家治理' }],
  rural: [{ to: '/rural', label: '乡村' }, { to: '/urban', label: '城镇化' }],
  west: [{ to: '/diplomacy', label: '外交' }, { to: '/realism', label: '现实主义' }, { to: '/demographic', label: '人口' }],
};

export const THEME_INTRO = {
  model: '其最具辨识度的一条线：2009 年以"中国模式"总结人民共和国 60 年，随即改称"当代中华体制"，以国民经济、民本政治、社稷体制三位一体、十二支柱加以拆解；同时强调政策重于政制、中国模式不"普适"。学界对"中国模式"提法的保留意见见争议栏。',
  minben: '以"民本"对举"民主"：政府合法性来自照看民生而非选举授权，执政集团是体制的强项也是软肋；文官体系被描述为大众型绩优选拔制，并以"选举迷信"批评选举万能论，但自称不一概反对选举。',
  fazhi: '2000—2003 年前后提出的政体设想："以法治为主、民主为辅"，由中立文官、独立司法、独立反贪、独立审计、人大咨询系统与四大自由六根支柱承托；英文版附有分阶段改革路线图。该设想引发国内外商榷，后续立场变化见存疑栏。',
  sheji: '"社稷"指以家庭和社区自治为基础的基层秩序。《信仰人民》把执政权界定为组织基层社会的能力，主张科层体系不能单独治国；《论社会进步的标准》以公共生活演进为尺度。',
  rural: '从博士论文《农民与市场》的"基层政权—乡镇企业联盟"起步，一面主张农民大量进入工商业和城市，一面主张农地流转应集中于农村集体而非资本；早年称村民自治为权宜之计。',
  west: '以政治价值不"普世"为前提做中西比较；2024—2026 年的公开文字以国际格局短评为主，包括对俄乌停火、美国新孤立主义、人口与国力的判断，其中若干可被事实检验，见台账。',
};

// ============================================================================
// 命题检验台账：只收可被制度与数据事实检验的表述；对照截至核验日
// "兑现"仅指事实走向与表述一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'open', type: '转述', date: '2002-06', venue: '《民主迷信与中国政治体制改革的方向》讲演',
    url: 'https://www.aisixiang.com/data/808.html',
    claim: '咨询型法治支柱之一：设立独立的反贪机构',
    check: '2018-03-11 宪法修正案增设国家监察委员会，2018-03-20《监察法》施行，各级监委与纪委合署办公。专门反腐机构已建立，但与香港廉政公署式"独立于行政"的设计不同，是否符合其"独立"含义尚难判定。',
    dataSrc: '《中华人民共和国宪法修正案》（2018）；《中华人民共和国监察法》（2018）',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2002-06', venue: '《民主迷信与中国政治体制改革的方向》讲演',
    url: 'https://www.aisixiang.com/data/808.html',
    claim: '咨询型法治支柱之一：独立透明的审计机构',
    check: '2018-03《深化党和国家机构改革方案》组建中央审计委员会，强化审计的集中统一领导。审计权威上升，但路径是纳入党的统一领导而非独立化，与原设想的对应关系未定。',
    dataSrc: '中共中央《深化党和国家机构改革方案》（2018-03）',
  },
  {
    id: 'L3', status: 'open', type: '转述', date: '2002-06', venue: '《民主迷信与中国政治体制改革的方向》讲演',
    url: 'https://www.aisixiang.com/data/808.html',
    claim: '咨询型法治支柱之一：独立的司法系统',
    check: '2014-10 十八届四中全会决定推动省以下地方法院、检察院人财物统一管理，设立最高法院巡回法庭，建立领导干部干预司法活动记录制度，同时明确坚持党对司法工作的领导。去地方化措施落地，但"独立"的含义与原设想存在差异。',
    dataSrc: '《中共中央关于全面推进依法治国若干重大问题的决定》（2014-10）',
  },
  {
    id: 'L4', status: 'failed', type: '转述', date: '2003-02', venue: 'Journal of Contemporary China 12(34)',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/10670560305465',
    claim: '分三阶段约二十年推进，第一阶段党政分开、党放弃对政府人事的直接管理',
    check: '路线图起点至今已逾二十年。2018 年宪法修正案在总纲写入"中国共产党领导是中国特色社会主义最本质的特征"，同年机构改革以加强党的全面领导为主线。制度走向与其第一阶段设计方向不一致。',
    dataSrc: '《中华人民共和国宪法修正案》（2018）；《深化党和国家机构改革方案》（2018-03）',
  },
  {
    id: 'L5', status: 'failed', type: '原话', date: '2009-01-17', venue: '新加坡中国商会演讲（《绿叶》2009 年第 4 期）',
    url: 'https://www.aisixiang.com/data/28130.html',
    claim: '但“常例”成为“惯例”仍需经历危机的考验。若终成定制，于中国政治模式的成熟而言善莫大焉。',
    check: '原文语境为领导职务任期"常例"。2018-03 宪法修正案删去国家主席、副主席"连续任职不得超过两届"的规定。原句为条件式期待而非预测，此处仅记录"成为定制"这一事实未出现。',
    dataSrc: '《中华人民共和国宪法修正案》（2018-03-11）',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2008-10-27', venue: '《农地"流转集中"到谁手里？》',
    url: 'https://www.aisixiang.com/data/24061.html',
    claim: '土地应当流转集中给农村集体。',
    check: '2014 年中办国办《关于引导农村土地经营权有序流转发展农业适度规模经营的意见》；2015-04 农业部等《关于加强对工商资本租赁农地监管和风险防范的意见》对工商资本租地设上限、分级备案与风险保障金，限制而非禁止；2016-10 三权分置意见与 2019 年施行的修订版《农村土地承包法》允许经营权向各类主体流转。政策兼容集体与多元主体，未以集体为唯一承接方。',
    dataSrc: '中国政府网（农经发〔2015〕3 号等）；《农村土地承包法》（2018-12 修正）',
  },
  {
    id: 'L7', status: 'done', type: '原话', date: '2008-10-27', venue: '《农地"流转集中"到谁手里？》',
    url: 'https://www.aisixiang.com/data/24061.html',
    claim: '实行共有私用，统分结合，双层经营的农村集体才是农民利益真正的代表。',
    check: '三权分置明确坚持农村土地集体所有权；2017 年十九大报告提出第二轮土地承包到期后再延长三十年；统分结合双层经营体制仍为法定基本经营制度。集体所有制未被私有化，与其主张一致；此为走向一致，不代表因果。',
    dataSrc: '中办国办三权分置意见（2016-10）；十九大报告（2017-10）；《农村土地承包法》',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2009-01-17', venue: '新加坡中国商会演讲（《绿叶》2009 年第 4 期）',
    url: 'https://www.aisixiang.com/data/28130.html',
    claim: '十几年后，我们将看到中国成为世界金融开放的旗手，正如中国已经成为自由贸易的旗手。',
    check: '人民币 2016-10-01 纳入 SDR 货币篮子；外汇局 2019-09-10 取消 QFII/RQFII 投资额度限制。金融开放持续推进，但资本项目尚未完全可兑换，"旗手"缺乏可量化标准，至核验日（已过 17 年）难以判定。',
    dataSrc: 'IMF 公告；国家外汇管理局 2019-09-10 公告',
  },
  {
    id: 'L9', status: 'failed', type: '原话', date: '2024-11-11', venue: '《特朗普复辟与国际结构》',
    url: 'https://mp.weixin.qq.com/s/OOcO4_QRhSUBq2u8rCAVsg',
    claim: '俄乌战争在特朗普上台之际停火，是大概率的。',
    check: '特朗普 2025-01 就职后，乌方于 2025-03 同意美方停火方案，俄方未接受；2026-02 阿布扎比多轮会谈后美方斡旋停滞；2026-09-23 共 51 国联合声明仍在敦促俄方接受停火，至核验日战事未停。',
    dataSrc: 'Anadolu Agency 2026-09-23；bne IntelliNews 2026-02；Kyiv Post 2026-09-28',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2026-03-02', venue: '《美国的新孤立主义与全球地缘政治动向》',
    url: 'https://www.igcu.pku.edu.cn/info/1026/9023.htm',
    claim: '后特朗普时代，新孤立主义会变成两党共识，因为美国很难再重归“世界霸权”追求——如果东亚不发生中国突破第一岛链之战。',
    check: '指向"后特朗普时代"，检验窗口尚未开启。',
    dataSrc: '—（检索截至 2026-09）',
  },
  {
    id: 'L11', status: 'open', type: '原话', date: '2024-11-11', venue: '《特朗普复辟与国际结构》',
    url: 'https://mp.weixin.qq.com/s/OOcO4_QRhSUBq2u8rCAVsg',
    claim: '换言之，三代人后中国人口将减半到7亿，与届时的美国人口持平。',
    check: '所引基期数据与官方统计接近（见数字对照）；"三代人后"约为 2100 年前后的长期推演，无法在核验期内检验。联合国人口司等长期预测存在多种情景，本栏不作裁决。',
    dataSrc: '国家统计局 2023 年统计公报；教育部 2023 年教育统计公报',
  },
  {
    id: 'L12', status: 'open', type: '原话', date: '2002-06', venue: '《民主迷信与中国政治体制改革的方向》讲演',
    url: 'https://www.aisixiang.com/data/808.html',
    claim: '总之，村民自治是个权宜之计。',
    check: '村民自治仍是宪法与《村民委员会组织法》（2010 修订、2018 修正）确立的法定制度；2019-01《中国共产党农村基层组织工作条例》要求村党组织书记通过法定程序担任村委会主任，基层治理重心向党组织领导下的"一肩挑"调整。制度存续与实际运作变化并存，难以闭环。',
    dataSrc: '《村民委员会组织法》；《中国共产党农村基层组织工作条例》（2019-01）',
  },
];

/** 数字对照：其公开表述中可与官方统计直接比对的数值 */
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '2023 年出生人口（"去年约只有900万婴儿新生"）', said: 900, official: 902, unit: '万人', saidSrc: '《特朗普复辟与国际结构》（2024-11-11）', offSrc: '国家统计局《2023年国民经济和社会发展统计公报》', comparable: true },
  { id: 'n2', label: '2023 年小学招生（"去年约有1800万小学生入学"）', said: 1800, official: 1877.88, unit: '万人', saidSrc: '《特朗普复辟与国际结构》（2024-11-11）', offSrc: '教育部《2023年全国教育事业发展统计公报》', comparable: true },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '国民经济', '民本政治', '社稷体制', '咨询型法治', '中西比较'],
  nodes: [
    { id: 'core', name: '当代中华体制\n（中国模式）', cat: 0, size: 58 },
    { id: 'pillars', name: '三位一体 · 十二支柱', cat: 0, size: 30 },
    { id: 'policy', name: '政策重于政制', cat: 0, size: 26 },
    { id: 'guomin', name: '国民经济', cat: 1, size: 38 },
    { id: 'collective', name: '农村集体 · 共有私用', cat: 1, size: 26 },
    { id: 'tve', name: '基层政权—乡镇企业联盟', cat: 1, size: 24 },
    { id: 'minben', name: '民本政治', cat: 2, size: 38 },
    { id: 'ruling', name: '先进执政集团', cat: 2, size: 28 },
    { id: 'merit', name: '绩优选拔制 meritocracy', cat: 2, size: 26 },
    { id: 'fengong', name: '分工制衡 · 弹性条块', cat: 2, size: 24 },
    { id: 'xinyang', name: '信仰人民', cat: 2, size: 26 },
    { id: 'sheji', name: '社稷体制', cat: 3, size: 38 },
    { id: 'jiceng', name: '基层组织即执政权', cat: 3, size: 26 },
    { id: 'zizhi', name: '人民自治重于科层', cat: 3, size: 24 },
    { id: 'jinbu', name: '社会进步三尺度', cat: 3, size: 22 },
    { id: 'zixun', name: '咨询型法治', cat: 4, size: 36 },
    { id: 'six', name: '六大支柱', cat: 4, size: 26 },
    { id: 'mixin', name: '民主迷信 / 选举迷信', cat: 4, size: 28 },
    { id: 'universal', name: '政治价值非普世', cat: 5, size: 26 },
    { id: 'isolation', name: '新孤立主义 · 四边形格局', cat: 5, size: 22 },
    { id: 'entity', name: '政治共同体', cat: 5, size: 22 },
  ],
  links: [
    ['core', 'pillars'], ['core', 'guomin'], ['core', 'minben'], ['core', 'sheji'], ['core', 'policy'],
    ['guomin', 'collective'], ['guomin', 'tve'], ['collective', 'sheji'],
    ['minben', 'ruling'], ['minben', 'merit'], ['minben', 'fengong'], ['minben', 'xinyang'],
    ['sheji', 'jiceng'], ['sheji', 'zizhi'], ['sheji', 'jinbu'], ['jiceng', 'ruling'], ['xinyang', 'jiceng'],
    ['zixun', 'six'], ['zixun', 'mixin'], ['mixin', 'merit'], ['zixun', 'core'],
    ['universal', 'mixin'], ['universal', 'core'], ['isolation', 'universal'], ['entity', 'sheji'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '"咨询型法治"：法治能否先于、替代民主',
    sides: [
      { who: '潘维（2000—2003；JCC 2003；Zhao 编 2006 第 14 章回应）', view: '转述：以法治为主、民主为辅，先建六大支柱式的法治政体，民主作为咨询补充；并以专章回应批评者。' },
      { who: '任羽中、陈斌（《战略与管理》2001）', view: '转述：题为《民主与法治：相辅而相成——与潘维先生商榷》，认为民主与法治相互依存，不能分先后取舍。' },
      { who: '张静（《二十一世纪》网络版 2002-06）', view: '转述：在阅读笔记中把法治与民主都视为达成秩序的制度路径，认为二者难以拆分。' },
      { who: 'Larry Diamond 等（Zhao 编 2006）', view: '转述：同书收入 Diamond《The Rule of Law as Transition to Democracy in China》等文，把法治视为通向民主的过渡而非替代。' },
    ],
    note: '张静原文标题误作"潘伟"，所指即此设想。本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '"中国模式"提法能否成立',
    sides: [
      { who: '潘维（2009—2010）', view: '转述：中国模式是对 60 年成功之路的抽象总结，可解析为当代中华体制三位一体；谈模式是为了警惕背离。' },
      { who: '李君如（《学习时报》2009-12-07）', view: '转述：主张慎提"中国模式"，宜用"中国特色"，理由是体制仍在探索、尚未定型。' },
      { who: '秦晓（剑桥大学演讲 2010-05-09）', view: '转述：认为所谓"中国模式"中的许多特征是改革需要解决的问题，属于制度缺陷而非制度创新。' },
      { who: '许纪霖（《社会观察》2010 年第 12 期）', view: '转述：主张慎提中国模式，认为中国实现的是富强崛起，尚非文明崛起。' },
      { who: '俞可平（《社会观察》2010 年第 12 期）', view: '转述：据文献引证，其文题为《"中国模式"并没有完全定型》（原文未获）。' },
    ],
    note: '李君如、秦晓、许纪霖三文未点名潘维，为同期关于"中国模式"提法的一般性讨论；萧功秦的相关原文未检索到，不列入。本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '民主的价值：民主"是个好东西"还是"民主迷信"',
    sides: [
      { who: '俞可平（《民主是个好东西》，2006）', view: '原文："相对而言，民主是人类迄今最好的政治制度"。' },
      { who: '潘维（《评选举迷信》2004；2009 演讲）', view: '转述：选举不过是多数决，不能治腐败；中国应以民本政治和绩优选拔制理解合法性，但不一概反对选举。' },
    ],
    note: '未检索到二人点名互驳的原文，此处按立场并陈；俞文晚于潘文。本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '2025-06《海外看世界》快评中"以我为主……让子弹飞一会"等语', status: '不收录', reason: '仅搜索摘要称出自潘维，未能在原刊页面确认作者归属（疑为同期另一位学者的快评）。' },
  { id: 'q2', item: 'JCC 论文"Toward a Consultative Rule of Law Regime in China"年份', status: '更正', reason: '澳门大学个人页作 2000，Taylor & Francis 著录为 2003 年第 12 卷第 34 期，以期刊为准。' },
  { id: 'q3', item: '《Behind China\u2019s Economic Miracle》出版年', status: '并陈', reason: '外文出版社版权信息为 2015-09，澳门大学个人页作 2017。' },
  { id: 'q4', item: '《士者弘毅》出版年', status: '并陈', reason: '察网、观察者网均称 2019 年 4 月出版，另有网站标 2018。' },
  { id: 'q5', item: '《中国模式：解读人民共和国的60年》出版时间', status: '并陈', reason: '版权页著录 2009-11，同期新闻报道称 2009 年 12 月底面世。' },
  { id: 'q6', item: '北大中国与世界研究中心主任任期及升任教授年份', status: '〔存疑〕', reason: '未见北大官方页面载明，履历按中心刊物年限推定。' },
  { id: 'q7', item: '关于司法独立的前后表述', status: '并陈', reason: '许雅棠（台湾《人文及社会科学集刊》2019）指出潘维 2003 年称"没有党政分开，没有司法独立，法治无从讲起"，2009 年则支持党对司法的统一领导；本人 2015 年称二三十年前曾热心研究司法独立。只记录文本差异，不推断原因。' },
  { id: 'q8', item: '1999《法治与未来中国政体》（《战略与管理》）、2000—2001《民主迷信与咨询型法治政体》《民主与民主的神话》', status: '不收录', reason: '仅见他人论文引证与摘要，原文未获，不纳入文库与观点条目。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
