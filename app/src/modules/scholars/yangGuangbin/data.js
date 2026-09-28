// ============================================================================
// 学者专栏 · 杨光斌 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"杨光斌认为"而无原文可溯者一律不收录。
// 合著论文标注合作者；官方政策与其表述一致者只记"方向一致"，不作因果归功。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  democracy: { label: '民主理论与可治理的民主', color: '#c41e3a' },
  histpol: { label: '历史政治学与方法论', color: '#e8a317' },
  governance: { label: '国家治理与治理能力', color: '#10b981' },
  worldpol: { label: '世界政治与比较政治', color: '#22d3ee' },
  autonomy: { label: '中国政治学自主知识体系', color: '#8b5cf6' },
  party: { label: '政党中心主义与民主集中制', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '杨光斌',
  born: '1963 年 6 月 · 河南桐柏',
  summary:
    '河南大学政治学系法学学士（1985）、北京大学国际政治系法学硕士（1988）、中国人民大学法学博士（2002，在职）。1988 年起任教中国人民大学，历任助教、讲师、副教授、教授；1992—1993 年英国萨塞克斯大学访问学者，1997—1998 年美国乔治华盛顿大学富布莱特访问学者。2017 年起任中国人民大学国际关系学院院长，2024 年起兼任澄海全球发展与安全高等研究院院长。研究线索由"制度变迁与国家治理"起步，2010 年前后提出"政党中心主义"，2015 年前后提出"治理民主/可治理的民主"与"国家治理能力"三要素理论，2019 年起系统倡导"历史政治学"与"以中国为方法的政治学"，近年集中于中国政治学自主知识体系与世界政治学建设。',
  current: [
    '中国人民大学国际关系学院院长、吴玉章讲席教授、国家一级教授',
    '中国人民大学澄海全球发展与安全高等研究院院长（2024 年起）',
    '第十三、十四届全国政协委员、外事委员会委员',
    '国务院学位委员会政治学学科评议组成员兼秘书长；中国政治学会副会长',
    '中央马克思主义理论研究和建设工程首席专家；教育部"长江学者"特聘教授（2009）',
  ],
  sources: '中国人民大学国际关系学院官网教师页与学院新闻；人大澄海研究院介绍页；中国社会科学网、中国青年报（澄海研究院揭牌报道）；《学术月刊》2026 年第 2 期访谈；百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 13,
  subtitle: '可治理的民主 · 历史政治学 · 国家治理能力 · 政党中心主义 · 自主知识体系',
  span: '2008—2026',
  careerTitle: '履历时间线 · 河大 → 北大 → 人大国关 → 院长 / 澄海研究院 / 政协',
  defaultTheme: 'histpol',
  moduleId: 'scholarYangGuangbin',
  sourceNote: '期刊论文原文 / 署名文章（人民日报、光明日报、求是、北京日报）/ 学术访谈 / 主办方讲座报道 · 对照：中办、国新办白皮书、国务院学位委员会、党的全会文件',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  ruc: { label: '人大教职', color: '#22d3ee' },
  admin: { label: '院系/研究院行政', color: '#10b981' },
  study: { label: '求学/访学', color: '#8b5cf6' },
  gov: { label: '全国政协/人才计划', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '河南大学政治学系本科（法学学士）', org: '河南大学', start: 1981.7, end: 1985.5, group: 'study', note: '官网仅载年份，起止月份取学年近似' },
  { id: 'c2', role: '北京大学国际政治系硕士研究生（法学硕士）', org: '北京大学', start: 1985.7, end: 1988.5, group: 'study', note: '官网仅载年份，起止月份取学年近似' },
  { id: 'c3', role: '中国人民大学助教、讲师、副教授、教授', org: '中国人民大学', start: 1988.6, end: 2026.75, group: 'ruc', note: '官网作"1988—现在 助教、讲师、副教授、教授（二级）"，各职级晋升年份未载' },
  { id: 'c4', role: '英国萨塞克斯大学访问学者', org: 'University of Sussex', start: 1992.5, end: 1993.5, group: 'study', note: '官网仅载 1992—1993，月份取年中近似' },
  { id: 'c5', role: '美国乔治华盛顿大学富布莱特访问学者（获美国外交研究生证书）', org: 'George Washington University', start: 1997.5, end: 1998.5, group: 'study', note: '官网仅载 1997—1998，月份取年中近似' },
  { id: 'c6', role: '中国人民大学国际关系学院在职博士研究生（法学博士）', org: '中国人民大学', start: 1999.7, end: 2002.5, group: 'study', note: '官网仅载 1999—2002，月份取学年近似' },
  { id: 'c7', role: '美国丹佛大学讲授课程（秋季）', org: 'University of Denver', start: 2003.7, end: 2003.95, group: 'study' },
  { id: 'c8', role: '新加坡国立大学东亚研究所高级访问研究员（夏季）', org: 'NUS 东亚所', start: 2007.45, end: 2007.7, group: 'study' },
  { id: 'c9', role: '教育部"长江学者"特聘教授', org: '教育部', start: 2009.5, end: 2009.9, group: 'gov', note: '官网作"教育部国家高层次人才计划（2009）"，授予月份未载' },
  { id: 'c10', role: '中国人民大学国际关系学院院长', org: '中国人民大学', start: 2017.55, end: 2026.75, group: 'admin', note: '2017-06-18 人大重阳报道仍称陈岳为院长，2017-08-16 光明日报已署"院长"，任职起点落在其间，确切日期〔存疑〕' },
  { id: 'c11', role: '中国人民大学国际关系学院党委书记（兼）', org: '中国人民大学', start: 2019.2, end: 2023.39, group: 'admin', note: '2019-03 已见兼任记录，起点〔存疑〕；2023-05-23 学院通报免去党委书记职务、续聘院长' },
  { id: 'c12', role: '第十三、十四届全国政协委员（外事委员会委员）', org: '全国政协', start: 2018.2, end: 2026.75, group: 'gov', note: '起点按十三届全国政协一次会议（2018-03）计' },
  { id: 'c13', role: '人大澄海全球发展与安全高等研究院院长', org: '中国人民大学', start: 2024.27, end: 2026.75, group: 'admin', note: '2024-01-15 捐建签约报道已称院长；2024-04-07 揭牌' },
];

export const BOOKS = [
  { id: 'b1', year: 2003, title: '中国政府与政治导论', publisher: '中国人民大学出版社', date: '2003-08', isbn: '9787300044675', themes: ['governance', 'party'], verified: 'primary', note: '据豆瓣书目与日本新潟大学馆藏记录；中国政治学网著作目录作 2004 年，并陈' },
  { id: 'b2', year: 2003, title: '中国经济转型中的国家权力', publisher: '当代世界出版社', themes: ['governance'], verified: 'primary', note: '据中国政治学网专家著作目录；版权页信息未独立核对' },
  { id: 'b3', year: 2006, title: '制度变迁与国家治理：中国政治发展研究', publisher: '人民出版社', date: '2006-01', isbn: '9787010052861', themes: ['governance', 'party'], verified: 'primary', note: '豆瓣书目' },
  { id: 'b4', year: 2011, title: '政治变迁中的国家与制度', publisher: '中央编译出版社', themes: ['governance', 'histpol'], verified: 'primary', note: '入选首届国家哲学社会科学成果文库；出版年有 2011 与 2016 两说，见存疑栏' },
  { id: 'b5', year: 2015, title: '让民主归位', publisher: '中国人民大学出版社', date: '2015-01', isbn: '9787300201672', themes: ['democracy'], verified: 'primary', note: '收录 2008 年后民主理论论文与评论' },
  { id: 'b6', year: 2015, title: '观念的民主与实践的民主：比较历史视野下的民主与国家治理', publisher: '中国社会科学出版社', date: '2015-11', isbn: '9787516169308', themes: ['democracy', 'worldpol'], verified: 'primary', note: '豆瓣书目' },
  { id: 'b7', year: 2015, title: '中国民主：轨迹与走向（1978—2020）', publisher: '中国社会科学出版社', isbn: '9787516168479', coauthors: '杨光斌等著', themes: ['democracy'], verified: 'primary', note: '出版时间有 2015-11 与 2016-04 两种书目记录，并陈' },
  { id: 'b8', year: 2018, title: '中国政治认识论', publisher: '中国社会科学出版社', date: '2018-08', isbn: '9787520328722', themes: ['autonomy', 'party'], verified: 'primary', note: '学院官网作 2020 年，以书目 2018-08 为准' },
  { id: 'b9', year: 2019, title: '政治学导论（第五版）', publisher: '中国人民大学出版社', date: '2019-07', isbn: '9787300270241', coauthors: '杨光斌主编', themes: ['autonomy'], verified: 'primary', note: '教材；官网提及第六版，版本信息未独立核对' },
  { id: 'b10', year: 2021, title: '世界政治理论', publisher: '中国社会科学出版社', date: '2021-03', isbn: '9787520377652', themes: ['worldpol'], verified: 'primary', note: '学院官网作 2022 年，以书目 2021-03 为准；获教育部第九届高校科研优秀成果奖（人文社科）一等奖' },
  { id: 'b11', year: 2023, title: '历史政治学：中国政治学的范式革命', publisher: '中国人民大学出版社', date: '2023-07', isbn: '9787300318820', themes: ['histpol', 'autonomy'], verified: 'primary', note: '豆瓣书目' },
  { id: 'b12', year: 2024, title: '政治的概念：历史政治学的知识论原理', publisher: '中国人民大学出版社', date: '2024-06', isbn: '9787300326573', themes: ['histpol', 'autonomy'], verified: 'primary', note: '316 页；2025-04 收入"中国自主知识体系研究文库"再版（ISBN 9787300337333）' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'y2008', date: '2008-12-29', form: '采访', venue: '《瞭望东方周刊》专访 · 谈中国民主政治的路径', source: '新浪新闻转载（新华网—瞭望东方周刊）', url: 'http://news.sina.com.cn/c/2008-12-29/165916942806.shtml', verified: 'media', themes: ['democracy', 'governance', 'party'] },
  { id: 'y2010', date: '2010', form: '论文', venue: '《制度变迁中的政党中心主义》，《西华大学学报（哲学社会科学版）》2010 年第 2 期', source: '复旦大学高研院网站转载（注明原刊）', url: 'http://www.ias.fudan.edu.cn/article/4512', verified: 'primary', themes: ['party', 'worldpol'] },
  { id: 'y2012a', date: '2012-06', form: '署名文章', venue: '《充分认识"政治"在转型社会中的重要性》，《学习时报》', source: '《学习时报》（爱思想转载）', url: 'https://www.aisixiang.com/data/54334.html', verified: 'reprint', themes: ['autonomy', 'party'] },
  { id: 'y2012b', date: '2012-08-31', form: '署名文章', venue: '《行政决策的法治化、民主化》，《中国社会科学报》', source: '中国理论网转载', url: 'https://www.theorychina.org.cn/c/2012-09-19/1267809.shtml', verified: 'primary', themes: ['democracy'] },
  { id: 'y2014', date: '2014-03-17', form: '署名文章', venue: '《几个流行的民主化理论命题的证伪》，《北京日报》', source: '人民网理论频道转载', url: 'http://theory.people.com.cn/n/2014/0317/c49150-24650660.html', verified: 'primary', themes: ['democracy', 'worldpol'] },
  { id: 'y2015a', date: '2015-06-15', form: '署名文章', venue: '《从国际政治比较看"治理民主"的优势》，《北京日报》', source: '人民网理论频道转载', url: 'http://theory.people.com.cn/n/2015/0615/c49150-27154347.html', verified: 'primary', themes: ['democracy', 'worldpol'] },
  { id: 'y2015b', date: '2015', form: '论文', venue: '《论作为"中国模式"的民主集中制政体》，《政治学研究》2015 年（期号有第 4 期、第 6 期两说）', source: '《政治学研究》论文摘要（期号与署名见存疑栏）', verified: 'primary', themes: ['party', 'governance'] },
  { id: 'y2015c', date: '2015-12', form: '署名文章', venue: '《不能做"合法性"概念的囚徒》，共识网', source: '爱思想转载（2015-12-03）', url: 'https://www.aisixiang.com/data/94647.html', verified: 'reprint', themes: ['governance', 'autonomy'] },
  { id: 'y2017a', date: '2017-01', form: '论文', venue: '《关于国家治理能力的一般理论——探索世界政治（比较政治）研究的新范式》，《教学与研究》2017 年第 1 期，第 5—22 页', source: '中国人民大学国际关系学院官网', url: 'http://sis.ruc.edu.cn/ch/syzyzy/syzygzplzw/ed56e539035f497ea9d0c90ccbe0d92c.htm', verified: 'primary', themes: ['governance', 'worldpol', 'party'] },
  { id: 'y2017b', date: '2017-08-16', form: '署名文章', venue: '《世界政治研究亟待"转型升级"》，《光明日报》', source: '人大重阳网站转载', url: 'http://rdcy.ruc.edu.cn/zw/xw/jrgd/6915cab0d23d4208b1230586eded22d9.htm', verified: 'reprint', themes: ['worldpol', 'autonomy'] },
  { id: 'y2018a', date: '2018-03', form: '署名文章', venue: '《思想话语权事关国家安全》，《人民日报》', source: '爱思想转载（2018-03-08）', url: 'https://www.aisixiang.com/data/108741.html', verified: 'reprint', themes: ['autonomy'] },
  { id: 'y2019a', date: '2019-01', form: '论文', venue: '杨光斌、乔哲青《人民民主：优势、挑战与对策》，《西华大学学报（哲学社会科学版）》2019 年第 1 期', source: '中国政治学网（中国社会科学网）转载', url: 'http://chinaps.cssn.cn/zxcg/202002/t20200204_5084784.shtml', verified: 'primary', themes: ['party', 'governance', 'democracy'] },
  { id: 'y2019b', date: '2019-10', form: '论文', venue: '《以中国为方法的政治学》，《中国社会科学》2019 年第 10 期', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/119118.html', verified: 'primary', themes: ['autonomy', 'histpol', 'party'] },
  { id: 'y2020', date: '2020-02', form: '署名文章', venue: '《衡量国家治理能力的基本指标》，《前线》', source: '爱思想转载（2020-02-18）', url: 'https://www.aisixiang.com/data/120254.html', verified: 'reprint', themes: ['governance'] },
  { id: 'y2021', date: '2021-10-25', form: '署名文章', venue: '《在比较研究中彰显治理效能》，《人民日报》', source: '人民论坛网转载', url: 'https://www.rmlt.com.cn/2021/1025/629098.shtml', verified: 'media', themes: ['governance', 'worldpol'] },
  { id: 'y2022', date: '2022-01', form: '论文', venue: '《中国民主模式的理论表述问题》，《政治学研究》2022 年第 1 期', source: '《政治学研究》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/132817.html', verified: 'primary', themes: ['democracy', 'party', 'worldpol'] },
  { id: 'y2023', date: '2023-02-13', form: '署名文章', venue: '《历史政治学与中国自主知识体系的建构》，《光明日报》', source: '中国理论网转载', url: 'https://www.theorychina.org.cn/c/2023-02-13/1460470.shtml', verified: 'primary', themes: ['histpol', 'autonomy'] },
  { id: 'y2024a', date: '2024-01', form: '论文', venue: '《历史政治学与当代中国政治史研究：以"第二个结合"为例》，《当代中国史研究》2024 年第 1 期', source: '中国社会科学院马克思主义研究网转载', url: 'http://marxism.cass.cn/zyzgh/202403/t20240306_5737095.shtml', verified: 'primary', themes: ['histpol'] },
  { id: 'y2024b', date: '2024', form: '论文', venue: '《历史政治学的几个问题》，《中国政治学》2024 年第 3 辑', source: '《中国政治学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/170130.html', verified: 'primary', themes: ['histpol', 'party'] },
  { id: 'y2024c', date: '2024-10-28', form: '署名文章', venue: '《中国式现代化与全球化新模式》，《北京日报》', source: '光明网理论频道转载', url: 'https://theory.gmw.cn/2024-10/28/content_37639669.htm', verified: 'primary', themes: ['worldpol'] },
  { id: 'y2024d', date: '2024-11-04', form: '讲座', venue: '胡华大讲堂第 42 讲 · 政治的概念：中国政治史与欧洲社会史的对话', source: '中国人民大学中共党史党建研究院报道（转载页）', verified: 'media', themes: ['histpol'] },
  { id: 'y2025a', date: '2025-02-05', form: '署名文章', venue: '《中国式现代化的世界意义》，《人民日报》第 9 版', source: '中国社会科学院马克思主义研究网转载', url: 'http://marxism.cass.cn/ddzg/202502/t20250205_5842975.shtml', verified: 'primary', themes: ['worldpol'] },
  { id: 'y2025b', date: '2025-03', form: '署名文章', venue: '《建构中国政治学自主知识体系》，《中国社会科学报》', source: '爱思想转载（2025-03-10；原刊日期未核）', url: 'https://www.aisixiang.com/data/160360.html', verified: 'reprint', themes: ['autonomy', 'democracy'] },
  { id: 'y2025c', date: '2025-08-16', form: '署名文章', venue: '《建构中国政治学自主知识体系的探索与思考》，《求是》2025 年第 16 期', source: '求是网', url: 'https://www.qstheory.cn/20250815/b957e823f47f4183b0279841c1afa75e/c.html', verified: 'primary', themes: ['autonomy', 'democracy'] },
  { id: 'y2025d', date: '2025-09-06', form: '讲座', venue: '"通州·世界政治论衡"第二讲 · 新世界政治时代的学科供给', source: '中国人民大学国际关系学院微信公众号（学院官网学术活动栏收录）', url: 'https://mp.weixin.qq.com/s/ayvRl5Jo5mEjzlGBA5tfsg', verified: 'media', themes: ['worldpol', 'histpol'] },
  { id: 'y2026a', date: '2026-02-03', form: '署名文章', venue: '《从对华外交热潮读懂中国的"势"》，《环球时报》', source: '爱思想转载', url: 'https://www.aisixiang.com/data/172429.html', verified: 'reprint', themes: ['worldpol'] },
  { id: 'y2026b', date: '2026-02', form: '采访', venue: '《探索政治学的新概念新议程新范式——杨光斌教授访谈》，《学术月刊》2026 年第 2 期', source: '《学术月刊》（爱思想转载）', url: 'https://www.aisixiang.com/data/173547.html', verified: 'reprint', themes: ['democracy', 'governance', 'party', 'worldpol'] },
  { id: 'y2026c', date: '2026-03', form: '论文', venue: '《为什么说历史政治学是一场范式革命》（转载页标注载于《学术月刊》2026 年第 2 期，待核）', source: '爱思想转载（2026-03-13）', url: 'https://www.aisixiang.com/data/173522.html', verified: 'reprint', themes: ['histpol', 'governance'] },
  { id: 'y2026d', date: '2026-06-10', form: '讲座', venue: '南开大学"翔宇学者讲堂"第 25 期 · 国家兴衰研究的第三种路径', source: '南开大学周恩来政府管理学院官网', url: 'https://zfxy.nankai.edu.cn/info/1180/9392.htm', verified: 'primary', themes: ['histpol', 'worldpol'] },
  { id: 'y2026e', date: '2026-08-21', form: '署名文章', venue: '《历史本体论与政治学的"知识革命"》，《光明日报》', source: '人民网理论频道转载', url: 'http://theory.people.com.cn/n1/2026/0821/c40531-40783642.html', verified: 'primary', themes: ['histpol', 'autonomy'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 民主理论与可治理的民主 ——
  { id: 'd1', k: 'y2008', theme: 'democracy', type: '原话', text: '民主是一个产生权力的过程，法治是约束权力、规制权力的过程。' },
  { id: 'd2', k: 'y2014', theme: 'democracy', type: '原话', text: '我一直认为，民主在价值上是公共之善，值得也必须追求；但是，民主更是一个现实中的工具性问题即是一个政体问题' },
  { id: 'd3', k: 'y2014', theme: 'democracy', type: '原话', text: '结果，党争民主很有可能导致分裂型社会。' },
  { id: 'd4', k: 'y2014', theme: 'democracy', type: '转述', text: '提出竞争性选举有效运转依赖三项"同质性条件"——国家认同、基本政治共识、社会结构大致平等与同质；缺少这些条件的后发国家搞党争民主，党争易沿种族、宗教、阶级分界展开。' },
  { id: 'd5', k: 'y2015a', theme: 'democracy', type: '原话', text: '“治理民主”的构成要素是：参与——国家自主性回应——责任。' },
  { id: 'd6', k: 'y2015a', theme: 'democracy', type: '原话', text: '基于此，完全有理由将中国的社会主义民主表述为“民本主义民主”。' },
  { id: 'd7', k: 'y2022', theme: 'democracy', type: '原话', text: '社会主义民主—民主集中制—协商共识型民主—可治理的民主，就构成了以人民民主为价值原则的中国模式。' },
  { id: 'd8', k: 'y2022', theme: 'democracy', type: '原话', text: '我们说民主是人类共同价值，这一点和以美国为首的西方国家能够沟通起来。然而，民主要落地，必须以各自的历史条件为前提' },
  { id: 'd9', k: 'y2022', theme: 'democracy', type: '转述', text: '主张以治理能力与治理程度衡量实践中的民主：能有效实现国家治理者为"可治理的民主"，否则为"无效的民主"；并认为自由主义民主经熊彼特、达尔等人的改造而将选举程序等同于民主。' },
  { id: 'd10', k: 'y2025b', theme: 'democracy', type: '转述', text: '主张以同心圆方式呈现民主理论，由内而外依次为"民主"—"人民民主"—"全过程人民民主"，并把实践中的民主视为离元概念远近的"近似值"。' },
  { id: 'd11', k: 'y2026b', theme: 'democracy', type: '原话', text: '“可治理的民主”可以说是“全过程人民民主”的一种学理化表达。' },
  { id: 'd12', k: 'y2026b', theme: 'democracy', type: '原话', text: '然而，自由民主的普世叙事忽视了民主的条件比民主本身更重要。' },

  // —— 历史政治学与方法论 ——
  { id: 'h1', k: 'y2019b', theme: 'histpol', type: '转述', text: '在《以中国为方法的政治学》中提出以历史政治学为方法，认为文明普遍性与特殊性之分是假问题、多元文明互鉴才是真问题。' },
  { id: 'h2', k: 'y2023', theme: 'histpol', type: '原话', text: '历史本体论、历史连续性和时间空间化，是理解历史政治学的几个关键词。' },
  { id: 'h3', k: 'y2024b', theme: 'histpol', type: '原话', text: '历史政治学属于政治学范畴，旨在发现概念和理论，具有“历史本体论—制度变迁—政治理论”的知识论原理。' },
  { id: 'h4', k: 'y2024b', theme: 'histpol', type: '转述', text: '认为中国历史政治学的鲜活议程是大一统与中国式现代化，并把历史制度主义概括为加入动态时间概念的"时间性制度主义"以示区分。' },
  { id: 'h5', k: 'y2024d', theme: 'histpol', type: '转述', text: '在胡华大讲堂以"政治的概念"为题，强调历史政治学关注从中国政治史中"发现"概念，而非"发明"概念，并以中国政治史与欧洲社会史对照展开（据主办方报道）。' },
  { id: 'h6', k: 'y2026c', theme: 'histpol', type: '原话', text: '历史政治学还是一种“政治产品”，为中国政治合法性论述提供了替代性标准。' },
  { id: 'h7', k: 'y2026d', theme: 'histpol', type: '转述', text: '在南开讲座中把"组织化程度"作为制度主义、文化主义之外研究国家兴衰的第三种路径（据主办方报道）。' },
  { id: 'h8', k: 'y2026e', theme: 'histpol', type: '原话', text: '中国历史的内在属性就是大一统，中国史本质上是“国家史”或“政治史”，中华文明是政治文明或国家文明。' },
  { id: 'h9', k: 'y2026e', theme: 'histpol', type: '转述', text: '自认历史政治学主要解释各国走向现代化与构建现代国家时组织化程度的差异，"并非人类政治发展的唯一诠释框架"，而是一条重要的解释路径。' },

  // —— 国家治理与治理能力 ——
  { id: 'g1', k: 'y2008', theme: 'governance', type: '原话', text: '我认为我们的行政民主走得太远了，甚至在世界上也是走得最远的。' },
  { id: 'g2', k: 'y2015c', theme: 'governance', type: '原话', text: '合法律性、有效性和正义性都能达成共识，其中“有效性”又是合法性的最大公约数，而“人民性”则存在争议' },
  { id: 'g3', k: 'y2017a', theme: 'governance', type: '原话', text: '国家治理能力其实是协调国家权力关系的能力，它由“体制吸纳力—制度整合力—政策执行力”构成，作为一种祛价值化的实践性理论，具有系统性、分层性和非对称性的特征。' },
  { id: 'g4', k: 'y2019a', theme: 'governance', type: '原话', text: '哪怕党性和人民性是一致的，也不可能消灭官僚主义。' },
  { id: 'g5', k: 'y2020', theme: 'governance', type: '转述', text: '以体制吸纳力、制度整合力、政策执行力作为衡量国家治理能力的基本指标，认为体制吸纳力有些类似合法性概念。' },
  { id: 'g6', k: 'y2020', theme: 'governance', type: '原话', text: '一些国家没有认识到政治制度是其他权力相互作用的结果而非原因' },
  { id: 'g7', k: 'y2021', theme: 'governance', type: '转述', text: '主张评价一种制度的优劣离不开对治理效能的考察，并建议把国家治理能力研究作为比较政治学的重点研究领域。' },
  { id: 'g8', k: 'y2026b', theme: 'governance', type: '原话', text: '国家治理体系和治理能力现代化命题与“治体”有直接的关系，与“政体”理论无关。' },

  // —— 世界政治与比较政治 ——
  { id: 'w1', k: 'y2010', theme: 'worldpol', type: '转述', text: '以比较历史视角区分三类现代化组织模式：英美由商人阶层主导、法德日由官僚体系主导、俄中由政党组织主导。' },
  { id: 'w2', k: 'y2015a', theme: 'worldpol', type: '转述', text: '以中印比较说明评价尺度之别：按竞争性选举衡量印度被认为优于中国，按"治理民主"衡量则中国表现更优。' },
  { id: 'w3', k: 'y2017b', theme: 'worldpol', type: '转述', text: '批评国际关系学"三大范式"主要服务于西方国家的对外战略，呼吁世界政治研究转型升级、加强发展中国家研究。' },
  { id: 'w4', k: 'y2024c', theme: 'worldpol', type: '原话', text: '在世界近代史的尺度上，如果说“经济垄断式全球化”是全球化进程的“上半场”，那么“经济平等式全球化”意味着全球化进入了“下半场”。' },
  { id: 'w5', k: 'y2025a', theme: 'worldpol', type: '转述', text: '认为中国式现代化在改变自身的同时改写了世界现代化范式，并引 2001—2021 年发达经济体占世界经济份额由 78.84% 降至 59.08% 说明世界经济格局变化（数据口径以原文为准）。' },
  { id: 'w6', k: 'y2025d', theme: 'worldpol', type: '转述', text: '在"通州·世界政治论衡"讲座中讨论新世界政治时代的学科供给，主张以历史本体论区分国家史与社会史传统（据主办方报道）。' },
  { id: 'w7', k: 'y2026a', theme: 'worldpol', type: '原话', text: '这个“势”也代表着中国从世界舞台的因变量华丽转身为自变量。' },

  // —— 中国政治学自主知识体系 ——
  { id: 'a1', k: 'y2012a', theme: 'autonomy', type: '转述', text: '认为不同的现代化模式应产生不同的社会科学理论体系，分别对应社会中心主义、国家中心主义与政党中心主义。' },
  { id: 'a2', k: 'y2017b', theme: 'autonomy', type: '转述', text: '认为与经济结构转型升级相比，中国社会科学知识体系的转型升级在某种程度上更为迫切。' },
  { id: 'a3', k: 'y2018a', theme: 'autonomy', type: '转述', text: '把思想话语权与国家安全相联系，主张基于本国历史形成自己的理论体系与研究方式以巩固制度自信。' },
  { id: 'a4', k: 'y2019b', theme: 'autonomy', type: '原话', text: '因此，政治学首先是“本国中心主义”立场的治国理政学说。' },
  { id: 'a5', k: 'y2023', theme: 'autonomy', type: '原话', text: '也就是说，建构自主知识体系的关键前提，是要有属于本学科的方法论。' },
  { id: 'a6', k: 'y2025c', theme: 'autonomy', type: '原话', text: '总之，方法论研究、基础理论“重述”、中国政治发展研究和在此基础上建构的原理体系，是我们努力探索的中国政治学自主知识体系的“四梁八柱”。' },
  { id: 'a7', k: 'y2025c', theme: 'autonomy', type: '转述', text: '指出根本和基本政治制度指向政治团结，但学科上缺少相应的"政治团结学"，并主张对全过程人民民主的民主理论基础作学理化阐释。' },

  // —— 政党中心主义与民主集中制 ——
  { id: 'p1', k: 'y2010', theme: 'party', type: '原话', text: '在理论上，政党中心主义将是对长期主导国际社会科学的国家中心主义、尤其是社会中心主义的挑战。' },
  { id: 'p2', k: 'y2015b', theme: 'party', type: '原话', text: '作为权力结构的民主集中制同时还是决策过程的一般原则,做到了形式与过程的统一,这是其他现代政体所不具有的优势。' },
  { id: 'p3', k: 'y2017a', theme: 'party', type: '转述', text: '认为把国家治理体系落实为国家治理能力的中介机制是民主集中制，并以此解释中国的治理绩效。' },
  { id: 'p4', k: 'y2019a', theme: 'party', type: '原话', text: '因此，实现人民民主的关键是能够代表人民性的政党，其实现机制是民主集中制。' },
  { id: 'p5', k: 'y2019b', theme: 'party', type: '转述', text: '把"民主集中制政体"作为对中国模式的合理化解释，视之为相对于代议制民主的一种代表性政体。' },
  { id: 'p6', k: 'y2024b', theme: 'party', type: '转述', text: '在历史政治学框架下把民主集中制解释为几千年大一统传统的现代形式。' },
  { id: 'p7', k: 'y2026b', theme: 'party', type: '转述', text: '回顾自 2008 年前后提出"政党中心主义"、近年发展为"政党国家"与"使命型政党"论述，并以领导权、执行权、监督权刻画中国的权力体系，以干部制区别于韦伯式官僚制。' },
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

export const FEATURED = ['d5', 'd11', 'd12', 'h3', 'h8', 'g3', 'a4', 'p4'];

export const THEME_LINKS = {
  democracy: [{ to: '/govsystem', label: '政府体制' }, { to: '/ideology', label: '意识形态' }],
  histpol: [{ to: '/modules/shijian', label: '史鉴' }, { to: '/pathdependence', label: '路径依赖' }, { to: '/civilization', label: '文明' }],
  governance: [{ to: '/governance', label: '国家治理' }, { to: '/reform', label: '改革' }],
  worldpol: [{ to: '/diplomacy', label: '外交' }, { to: '/realism', label: '现实主义' }],
  autonomy: [{ to: '/ideology', label: '意识形态' }, { to: '/culture', label: '文化' }],
  party: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/govsystem', label: '政府体制' }],
};

export const THEME_INTRO = {
  democracy: '其最具辨识度的一条线：从 2008 年"民主产生权力、法治约束权力"的区分出发，2014 年以"同质性条件"质疑竞争性选举的普遍适用，2015 年提出"治理民主"（参与—自主性回应—责任），2022 年定型为"可治理的民主"，2026 年自称其为全过程人民民主的学理化表达；与俞可平的分歧见"争议"栏。',
  histpol: '2019 年起系统倡导的方法论主张：以"历史本体论—制度变迁—政治理论"为知识论原理，强调从中国政治史中发现概念，并与历史制度主义、历史社会学相区分；自认并非唯一诠释框架。学界评估与批评见"争议"栏。',
  governance: '以"体制吸纳力—制度整合力—政策执行力"三要素界定国家治理能力，主张以治理效能而非政体类型评价制度；对合法性概念作多维重述，并以"治体"对照"政体"。',
  worldpol: '从 2010 年三类现代化组织模式的比较出发，延伸到对国际关系"三大范式"的批评、世界政治学（世界市场与政治思潮为基本单元）与"经济平等式全球化"等判断；多为解释性框架。',
  autonomy: '把"以中国为方法""本国中心主义"立场与学科方法论相联系，2025 年在《求是》提出方法论、基础理论重述、中国政治发展研究、原理体系为自主知识体系的"四梁八柱"。',
  party: '以"政党中心主义"对照国家中心主义与社会中心主义，把民主集中制视为兼具政体与决策过程双重属性的制度，近年以历史政治学将其解释为大一统传统的现代形式。',
};

// ============================================================================
// 命题检验台账：只收可与政策文本或事后事实对照的表述；对照截至核验日
// "兑现"仅指政策走向与表述一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2015-06-15', venue: '《北京日报》署名文章',
    url: 'http://theory.people.com.cn/n/2015/0615/c49150-27154347.html',
    claim: '“治理民主”的构成要素是：参与——国家自主性回应——责任。',
    check: '2019-11-02 习近平在上海长宁区虹桥街道提出"人民民主是一种全过程的民主"；2021-12-04 国新办《中国的民主》白皮书称全过程人民民主实现过程民主和成果民主、程序民主和实质民主等相统一，并以"管用"等标准评价民主。官方以结果与过程并重评价民主的取向与其"治理民主"一致；其本人 2026 年称"可治理的民主"是全过程人民民主的学理化表达。仅记方向一致。',
    dataSrc: '新华网 2019-11-03；国务院新闻办公室《中国的民主》白皮书（2021-12-04）',
  },
  {
    id: 'L2', status: 'open', type: '原话', date: '2015-06-15', venue: '《北京日报》署名文章',
    url: 'http://theory.people.com.cn/n/2015/0615/c49150-27154347.html',
    claim: '基于此，完全有理由将中国的社会主义民主表述为“民本主义民主”。',
    check: '截至核验日，《中国的民主》白皮书、党的二十大报告等官方文本采用"全过程人民民主"表述，未见采用"民本主义民主"一词；属学术概念主张，尚未进入官方话语，保留为未决。',
    dataSrc: '国新办白皮书（2021-12）；党的二十大报告（2022-10）',
  },
  {
    id: 'L3', status: 'done', type: '原话', date: '2008-12-29', venue: '《瞭望东方周刊》专访',
    url: 'http://news.sina.com.cn/c/2008-12-29/165916942806.shtml',
    claim: '我认为我们的行政民主走得太远了，甚至在世界上也是走得最远的。',
    check: '其所指包括局长职位竞选等做法。2014-01 中共中央修订印发《党政领导干部选拔任用工作条例》：公开选拔、竞争上岗仅为选拔方式之一并限定适用情形，要求防止简单以推荐票、分数取人；中组部负责人答问批评"凡提必竞"。干部选任政策走向与其判断一致。',
    dataSrc: '中国政府网 2014-01-15（条例全文及中组部答问）',
  },
  {
    id: 'L4', status: 'done', type: '转述', date: '2014-03-17', venue: '《北京日报》署名文章',
    url: 'http://theory.people.com.cn/n/2014/0317/c49150-24650660.html',
    claim: '在缺少同质性条件的情况下，应建设全面的、多层次的协商民主制度而非党争民主',
    check: '2015-02-09 新华社播发中共中央《关于加强社会主义协商民主建设的意见》，部署政党、人大、政府、政协、人民团体、基层、社会组织七类协商。该方向由十八届三中全会（2013-11）提出，其文属对既定方针的学理呼应，非独立预判。',
    dataSrc: '新华网 2015-02-09',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2017-01', venue: '《教学与研究》2017 年第 1 期',
    url: 'http://sis.ruc.edu.cn/ch/syzyzy/syzygzplzw/ed56e539035f497ea9d0c90ccbe0d92c.htm',
    claim: '国家治理能力其实是协调国家权力关系的能力，它由“体制吸纳力—制度整合力—政策执行力”构成',
    check: '2019-10-31 十九届四中全会通过关于坚持和完善中国特色社会主义制度、推进国家治理体系和治理能力现代化的决定，强调把制度优势更好转化为国家治理效能。以治理效能评价制度的取向与其一致；但总目标早在 2013-11 十八届三中全会提出，其"三力"结构亦未见官方采用。',
    dataSrc: '十九届四中全会决定（新华社 2019-11-05 播发）',
  },
  {
    id: 'L6', status: 'done', type: '转述', date: '2017-08-16', venue: '《光明日报》署名文章',
    url: 'http://rdcy.ruc.edu.cn/zw/xw/jrgd/6915cab0d23d4208b1230586eded22d9.htm',
    claim: '世界政治研究亟待转型升级，应加强发展中国家与区域研究',
    check: '2022-09-13 国务院学位委员会、教育部印发《研究生教育学科专业目录（2022 年）》（学位〔2022〕15 号），在交叉学科门类增设"区域国别学"（1407）。学科建制走向与其主张一致，属多方推动结果，不作归功。',
    dataSrc: '教育部官网 2022-09-14',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2014-03-17', venue: '《北京日报》署名文章',
    url: 'http://theory.people.com.cn/n/2014/0317/c49150-24650660.html',
    claim: '缺少同质性条件的后发国家推行党争民主，易导致分裂型社会',
    check: '属因果命题。此后部分转型国家出现政治动荡（如泰国 2014-05 军事政变），与判断方向相符，但冲突成因涉及地缘、外部干预、经济结构等多重因素，个案走势不能证成因果；比较政治学界对"民主化与冲突"关系亦有多种实证结论，保留为未决。',
    dataSrc: '公开报道（检索截至 2026-09）',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2024-10-28', venue: '《北京日报》署名文章',
    url: 'https://theory.gmw.cn/2024-10/28/content_37639669.htm',
    claim: '在世界近代史的尺度上，如果说“经济垄断式全球化”是全球化进程的“上半场”，那么“经济平等式全球化”意味着全球化进入了“下半场”。',
    check: '属长时段解释框架，缺乏可操作的检验指标；与"逆全球化""脱钩"等竞争性叙事并存，同期发布报告的命名亦有"经济解放式全球化"之别（见存疑栏）。',
    dataSrc: '公开资料（检索截至 2026-09）',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2022-01', venue: '《政治学研究》2022 年第 1 期',
    url: 'https://www.aisixiang.com/data/132817.html',
    claim: '以民主集中制为特征的中国制度和体制更能适应人工智能时代的政治',
    check: '属前瞻性比较判断，至核验日尚无可比较的跨国制度绩效证据；各国人工智能治理路径仍在演化中。',
    dataSrc: '公开资料（检索截至 2026-09）',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2025-08-16', venue: '《求是》2025 年第 16 期',
    url: 'https://www.qstheory.cn/20250815/b957e823f47f4183b0279841c1afa75e/c.html',
    claim: '应建设与政治团结相对应的"政治团结学"',
    check: '学科建设主张；截至核验日未检索到以"政治团结学"命名的学科目录条目或国家社科基金学科分类调整。',
    dataSrc: '国务院学位委员会学科目录；公开资料（检索截至 2026-09）',
  },
];

// 杨光斌公开表述以理论命题为主，引用数字多为背景性统计，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '历史政治学', '民主理论', '国家治理', '政党与制度', '世界政治学'],
  nodes: [
    { id: 'core', name: '以中国为方法\n的政治学', cat: 0, size: 58 },
    { id: 'histpol', name: '历史政治学', cat: 1, size: 40 },
    { id: 'ontology', name: '历史本体论', cat: 1, size: 30 },
    { id: 'continuity', name: '历史连续性', cat: 1, size: 22 },
    { id: 'timespace', name: '时间空间化', cat: 1, size: 22 },
    { id: 'statehist', name: '国家史 / 社会史', cat: 1, size: 24 },
    { id: 'dayitong', name: '大一统', cat: 1, size: 28 },
    { id: 'govdem', name: '可治理的民主\n（治理民主）', cat: 2, size: 38 },
    { id: 'triaddem', name: '参与—自主性回应—责任', cat: 2, size: 24 },
    { id: 'minben', name: '民本主义民主', cat: 2, size: 24 },
    { id: 'homog', name: '同质性条件', cat: 2, size: 24 },
    { id: 'partisan', name: '党争民主', cat: 2, size: 22 },
    { id: 'approx', name: '民主"近似值"', cat: 2, size: 20 },
    { id: 'capacity', name: '国家治理能力', cat: 3, size: 36 },
    { id: 'triadcap', name: '体制吸纳力—制度整合力—政策执行力', cat: 3, size: 26 },
    { id: 'zhiti', name: '治体 vs 政体', cat: 3, size: 24 },
    { id: 'legit', name: '合法性重述（有效性）', cat: 3, size: 24 },
    { id: 'partycentric', name: '政党中心主义', cat: 4, size: 36 },
    { id: 'demcentral', name: '民主集中制', cat: 4, size: 34 },
    { id: 'mission', name: '使命型政党 / 政党国家', cat: 4, size: 24 },
    { id: 'consensus', name: '协商共识型民主', cat: 4, size: 22 },
    { id: 'worldpol', name: '世界政治学', cat: 5, size: 32 },
    { id: 'marketideas', name: '世界市场 · 政治思潮', cat: 5, size: 22 },
    { id: 'equalglob', name: '经济平等式全球化', cat: 5, size: 24 },
    { id: 'orgdeg', name: '组织化程度', cat: 5, size: 26 },
  ],
  links: [
    ['core', 'histpol'], ['core', 'govdem'], ['core', 'capacity'], ['core', 'partycentric'], ['core', 'worldpol'],
    ['histpol', 'ontology'], ['histpol', 'continuity'], ['histpol', 'timespace'], ['histpol', 'statehist'], ['ontology', 'dayitong'],
    ['dayitong', 'demcentral'], ['histpol', 'orgdeg'],
    ['govdem', 'triaddem'], ['govdem', 'minben'], ['govdem', 'approx'], ['homog', 'partisan'], ['govdem', 'homog'],
    ['govdem', 'consensus'], ['consensus', 'demcentral'],
    ['capacity', 'triadcap'], ['capacity', 'zhiti'], ['capacity', 'legit'], ['triadcap', 'demcentral'],
    ['partycentric', 'demcentral'], ['partycentric', 'mission'], ['mission', 'orgdeg'],
    ['worldpol', 'marketideas'], ['worldpol', 'equalglob'], ['worldpol', 'orgdeg'], ['legit', 'histpol'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '民主的普遍性：民主是"好东西"还是"条件比民主本身更重要"',
    sides: [
      { who: '俞可平（《民主是个好东西》，2006；爱思想转载）', view: '转述：在人类迄今发明和推行的政治制度中民主是弊端最少的一种，相对而言是最好的政治制度；同时强调民主不是无条件的，推进民主须考虑时机与条件。' },
      { who: '俞可平（《关于"民主"这个全球性争议话题》，爱思想转载）', view: '转述：民主制是普遍性与特殊性的统一，不能以特殊性否定普遍性。' },
      { who: '杨光斌（《北京日报》2014-03-17；《政治学研究》2022 年第 1 期）', view: '转述：民主在价值上是公共之善，但更是政体问题；竞争性选举依赖同质性条件，缺少条件时党争民主易致分裂；民主是人类共同价值，但落地须以各自历史条件为前提。' },
      { who: '杨光斌（《学术月刊》2026 年第 2 期访谈）', view: '原话：然而，自由民主的普世叙事忽视了民主的条件比民主本身更重要。' },
    ],
    note: '所引杨光斌文本未点名俞可平。双方都承认民主有条件，分歧主要在于以竞争性选举为核心的自由民主是否具有普遍适用性，以及应以程序还是治理效能评价民主。本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '历史政治学：范式革命还是尚待检验的研究纲领',
    sides: [
      { who: '杨光斌（《中国政治学》2024 年第 3 辑；《光明日报》2026-08-21）', view: '转述：历史政治学以"历史本体论—制度变迁—政治理论"为知识论原理，区别于作为"时间性制度主义"的历史制度主义；自认并非人类政治发展的唯一诠释框架。' },
      { who: '张树平（《政治学研究》2022 年第 1 期）', view: '转述：对历史政治学作阶段性评估，认为其主要风险在于理论建构与经验基础相剥离，"批判的自我呈现"仍有待努力。' },
      { who: '郎友兴、王旭（《广西师范大学学报（哲学社会科学版）》2026 年第 62 卷第 2 期，第 36—46 页）', view: '转述：从发生学视角指出历史政治学面临学科边界、结构与能动、宏观与微观分化、时间处理等方面的挑战，并讨论方法论革新。' },
    ],
    note: '张树平、郎友兴等文属学术评估与方法论讨论，并非对杨光斌的全盘否定；本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '《论作为"中国模式"的民主集中制政体》期号与署名', status: '并陈', reason: '人大相关页面著作目录作《政治学研究》2015 年第 4 期，百度百科等作第 6 期；个别数据库索引另列乔哲青为合作者，未能核对原刊，暂以本人署名、期号并陈。' },
  { id: 'q2', item: '《世界政治理论》《中国政治认识论》出版年', status: '更正', reason: '学院官网分别作 2022、2020 年；书目记录分别为 2021-03、2018-08（ISBN 9787520377652、9787520328722），以书目为准，官网年份或为获奖或重印年份。' },
  { id: 'q3', item: '《政治变迁中的国家与制度》出版年与书名', status: '并陈', reason: '《让民主归位》作者简介作《政治变革中的国家与制度》（2011），学院官网作 2016 年；2012 年《学习时报》文已称该书入选首届国家哲学社会科学成果文库，暂取 2011。' },
  { id: 'q4', item: '人大国家发展与战略研究院副院长', status: '〔存疑〕', reason: '见于百度百科与 2015 年图书作者简介，任职起止未见学校官网载明，未列入现职。' },
  { id: 'q5', item: '《为什么说历史政治学是一场范式革命》刊载信息', status: '〔存疑〕', reason: '爱思想转载页标注"载于《学术月刊》2026 年第 2 期"，与同期访谈为同一期刊，未能核对目录确认是否为独立论文。' },
  { id: 'q6', item: '2024-10 世界政治报告中的全球化命名', status: '并陈', reason: '2024-10-19 通州论坛发布报告的学院新闻作"经济解放式全球化"，2024-10-28《北京日报》署名文章作"经济平等式全球化"，以署名文章为准。' },
  { id: 'q7', item: '网传"国家治理能力是检验政治制度的唯一标准""政治学的中国范式"等逐字提法', status: '不收录', reason: '未检得对应原文；最接近的原话为 2021 年《人民日报》"评价一种制度的优劣，离不开对治理效能的考察"。' },
  { id: 'q8', item: '人大政治学论坛 2025"作为第四种方法的历史政治学"报告', status: '不收录', reason: '仅见议程标题，未见讲话整理稿或主办方内容报道。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
