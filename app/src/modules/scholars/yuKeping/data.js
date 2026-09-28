// ============================================================================
// 学者专栏 · 俞可平 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"俞可平认为"而无原文可溯者一律不收录。
// 合著、主编成果标注合作者，不单独归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  democracy: { label: '增量民主与民主理论', color: '#c41e3a' },
  goodgov: { label: '善治与国家治理现代化', color: '#10b981' },
  civil: { label: '公民社会与社会治理', color: '#22d3ee' },
  innovation: { label: '政府创新与城市治理', color: '#e8a317' },
  authority: { label: '权力、权威与官本主义', color: '#8b5cf6' },
  discipline: { label: '政治学科与比较政治', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '俞可平',
  born: '1959 年 7 月 · 浙江诸暨',
  summary:
    '1981 年绍兴师专政史系毕业，1982 年入厦门大学哲学系读硕士，1985 年考入北京大学国际政治系攻读博士（师从赵宝煦，毕业年份有 1987、1988 两说）。先任教北大，1990 年代初调入中共中央编译局，1997 年任当代马克思主义研究所所长，2001—2015 年任编译局副局长；2015-10 辞去副局长职务回到北大，任讲席教授、中国政治学研究中心主任，并任政府管理学院院长至 2020-11；2022-07 起任深圳大学政府管理学院首任院长。2006 年《民主是个好东西》引起广泛讨论，此前已提出"增量民主"与"善治"，2014 年起系统阐释"国家治理体系和治理能力现代化"，并长期主持中国地方政府创新奖；近年研究重心转向官本主义与古典政治、城市治理和数字主权。',
  current: [
    '深圳大学政府管理学院院长、全球特大型城市治理研究院院长、特聘教授（2022-07 起）',
    '北京大学讲席教授、中国政治学研究中心主任（2015 年起）',
    '北京大学城市治理研究院院长',
    '《政治通鉴》主编（中国大百科全书出版社，第八卷 2025-11 发布）',
  ],
  sources: '深圳大学政府管理学院现任领导页与 2025-11-28 招聘启事；北京大学新闻网、北大信息公开网（校发〔2020〕290 号）；财新网 2015-10-28；北京青年报 2015-10-29；《增量民主与善治》自序；维基百科、百度百科（仅作交叉核对，与官方页面冲突处以官方为准）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 11,
  subtitle: '增量民主 · 善治 · 国家治理现代化 · 地方政府创新 · 官本主义',
  span: '1999—2026',
  careerTitle: '履历时间线 · 厦大/北大求学 → 中央编译局 → 北大 → 深大',
  defaultTheme: 'democracy',
  moduleId: 'scholarYuKeping',
  sourceNote: '期刊论文原文 / 署名文章 / 主办方讲座报道 / 主流媒体采访 · 对照：党代会报告、中共中央与中办国办文件、政府工作报告、国务院条例',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  study: { label: '求学/访学', color: '#8b5cf6' },
  cctb: { label: '中央编译局', color: '#c41e3a' },
  pku: { label: '北京大学', color: '#22d3ee' },
  szu: { label: '深圳大学', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '厦门大学哲学系硕士研究生', org: '厦门大学', start: 1982.7, end: 1985.5, group: 'study', note: '1982 年入学；毕业月份取年中近似' },
  { id: 'c2', role: '北京大学国际政治系博士研究生（导师赵宝煦）', org: '北京大学', start: 1985.7, end: 1987.6, group: 'study', note: '财新、北青作 1987 年毕业；《增量民主与善治》自序作 1988 年获博士学位，并陈' },
  { id: 'c3', role: '北京大学政治学与行政管理系教师', org: '北京大学', start: 1987.6, end: 1990.5, group: 'pku', note: '调离年份仅见"1990 年代初"〔存疑〕' },
  { id: 'c4', role: '中共中央编译局研究人员', org: '中央编译局', start: 1990.5, end: 1997.5, group: 'cctb', note: '调入时间据"1990 年代初"取近似' },
  { id: 'c5', role: '杜克大学访问教授', org: 'Duke University', start: 1994.3, end: 1994.7, group: 'study', note: '月份未载，取年中近似' },
  { id: 'c6', role: '柏林自由大学客座教授', org: 'FU Berlin', start: 1995.3, end: 1995.7, group: 'study', note: '月份未载，取年中近似' },
  { id: 'c7', role: '中央编译局当代马克思主义研究所所长', org: '中央编译局', start: 1997.5, end: 2001.5, group: 'cctb', note: '卸任时间未见载明，取任副局长之年' },
  { id: 'c8', role: '中共中央编译局副局长', org: '中央编译局', start: 2001.5, end: 2015.82, group: 'cctb', note: '2015-10-28 本人宣布辞职获批' },
  { id: 'c9', role: '北京大学讲席教授、中国政治学研究中心主任', org: '北京大学', start: 2015.85, end: 2026.75, group: 'pku' },
  { id: 'c10', role: '北京大学政府管理学院院长', org: '北京大学', start: 2015.85, end: 2020.88, group: 'pku', note: '2020-11-17 北大校发〔2020〕290 号任命继任院长，原班子自然免职' },
  { id: 'c11', role: '北京大学城市治理研究院院长', org: '北京大学', start: 2017.2, end: 2026.75, group: 'pku', note: '起始 2017-03 仅见维基百科' },
  { id: 'c12', role: '深圳大学政府管理学院首任院长', org: '深圳大学', start: 2022.53, end: 2026.75, group: 'szu' },
];

export const BOOKS = [
  { id: 'b1', year: 1989, title: '西方政治分析新方法论', publisher: '人民出版社', themes: ['discipline'], verified: 'primary', note: '据北大中国政治学研究中心著作目录' },
  { id: 'b2', year: 1998, title: '社群主义', publisher: '中国社会科学出版社', themes: ['discipline'], verified: 'primary', note: '据北大中国政治学研究中心著作目录' },
  { id: 'b3', year: 2000, title: '权利政治与公益政治', publisher: '社会科学文献出版社', themes: ['discipline', 'authority'], verified: 'primary', note: '据北大中国政治学研究中心著作目录' },
  { id: 'b4', year: 2000, title: '治理与善治（主编）', publisher: '社会科学文献出版社', themes: ['goodgov'], verified: 'primary', note: '译文与论文合集，本人主编' },
  { id: 'b5', year: 2005, title: '增量民主与善治', publisher: '社会科学文献出版社', date: '2005-02', isbn: '9787801904836', themes: ['democracy', 'goodgov'], verified: 'primary', note: '294 页（豆瓣书目 1272284）' },
  { id: 'b6', year: 2006, title: '民主是个好东西：俞可平访谈录', publisher: '社会科学文献出版社', coauthors: '闫健（编）', themes: ['democracy'], verified: 'primary', note: '同名序言即《民主是个好东西》一文' },
  { id: 'b7', year: 2006, title: '中国公民社会的制度环境', publisher: '北京大学出版社', date: '2006-08', isbn: '9787301106891', coauthors: '俞可平等', themes: ['civil'], verified: 'primary', note: '集体著作' },
  { id: 'b8', year: 2009, title: 'Democracy Is a Good Thing', publisher: 'Brookings Institution Press', date: '2009-01-09', isbn: '9780815796947', themes: ['democracy'], verified: 'primary', note: '219 页；北大页面误作 2008，以出版社为准' },
  { id: 'b9', year: 2014, title: '论国家治理现代化', publisher: '社会科学文献出版社', date: '2014-06', isbn: '9787509756775', themes: ['goodgov'], verified: 'primary', note: '修订版 2015-03，ISBN 9787509770399' },
  { id: 'b10', year: 2018, title: '中国的治理变迁（1978—2018）', publisher: '社会科学文献出版社', date: '2018-05', isbn: '9787520125246', coauthors: '俞可平等', themes: ['goodgov', 'innovation'], verified: 'primary', note: '384 页；另有书目作 2018-06' },
  { id: 'b11', year: 2020, title: '权力与权威：政治哲学若干重要问题', publisher: '商务印书馆（国家治理丛书）', date: '2020-06', isbn: '9787100180436', themes: ['authority'], verified: 'primary', note: '221 页' },
  { id: 'b12', year: 2020, title: '政治通鉴（主编，计划 40 卷）', publisher: '中国大百科全书出版社', date: '2020-07', themes: ['discipline'], verified: 'primary', note: '第一卷发布会 2020-07-30；第八卷 2025-11-01 发布' },
  { id: 'b13', year: 2023, title: '帝国新论', publisher: '浙江人民出版社', date: '2023-05', isbn: '9787213110054', themes: ['discipline'], verified: 'primary', note: '270 页；前身为《清华大学学报》2022 年第 2 期同名论文' },
  { id: 'b14', year: 2025, title: '政治学前沿（主编）', publisher: '北京大学出版社', date: '2025-08', isbn: '9787301365601', themes: ['discipline'], verified: 'primary' },
  { id: 'b15', year: 2025, title: '中国古典政治九论', publisher: '商务印书馆', date: '2025-10', isbn: '9787100257053', themes: ['authority'], verified: 'primary', note: '408 页；出版社页介绍书中提出"官本主义"分析范式' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k1999', date: '1999', form: '论文', venue: '《治理和善治引论》，《马克思主义与现实》1999 年第 5 期，第 37—41 页', source: '《马克思主义与现实》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/3039.html', verified: 'primary', themes: ['goodgov', 'civil', 'discipline'] },
  { id: 'k2006a', date: '2006-01', form: '论文', venue: '《中国公民社会：概念、分类与制度环境》，《中国社会科学》2006 年第 1 期', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/9815.html', verified: 'primary', themes: ['civil'] },
  { id: 'k2006b', date: '2006-10-23', form: '署名文章', venue: '《民主是个好东西》（同名访谈录序言；报刊版刊于《北京日报》2006-10-23，《学习时报》第 367 期转载）', source: '社会科学文献出版社《民主是个好东西》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/12388.html', verified: 'primary', themes: ['democracy', 'discipline'] },
  { id: 'k2007', date: '2007-09-18', form: '署名文章', venue: '《我国民主政治建设取得了哪些重大成果》（含"增量民主"八特征与三条路径；北京日报另以《增量民主：中国特色政治模式》刊发）', source: '北京大学新闻网转新华网', url: 'http://news.pku.edu.cn/info/2891/2702101.htm', verified: 'primary', themes: ['democracy', 'civil'] },
  { id: 'k2009', date: '2009-12-25', form: '采访', venue: '新浪新闻深度报道 · 俞可平谈《民主是个好东西》发表前后', source: '新浪新闻', url: 'http://news.sina.com.cn/c/sd/2009-12-25/164119339416_3.shtml', verified: 'media', themes: ['democracy'] },
  { id: 'k2011', date: '2011-11-21', form: '采访', venue: '人民政协网专访 · 协商民主与人民政协', source: '人民政协网', url: 'http://www.cppcc.gov.cn/2011/11/21/ARTI1321842150421285.shtml', verified: 'media', themes: ['democracy'] },
  { id: 'k2013a', date: '2013-05', form: '论文', venue: '《官本主义引论——对中国传统社会的一种政治学反思》，《人民论坛·学术前沿》2013 年 5 月上（总第 25 期）', source: '《学术前沿》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/64380.html', verified: 'primary', themes: ['authority'] },
  { id: 'k2013b', date: '2013-11-27', form: '讲话', venue: '南开大学"协商民主理论与实践国际研讨会"（2013-11-09/10）发言', source: '人民网理论频道', url: 'http://theory.people.com.cn/n/2013/1127/c40531-23667489.html', verified: 'primary', themes: ['democracy'] },
  { id: 'k2014a', date: '2014-02-27', form: '署名文章', venue: '《推进国家治理体系和治理能力现代化》，原载《前线》', source: '人民网理论频道转载（光明网 2014-04-02 亦转载）', url: 'http://theory.people.com.cn/n/2014/0227/c83859-24485027.html', verified: 'primary', themes: ['goodgov', 'civil'] },
  { id: 'k2014b', date: '2014-11-28', form: '采访', venue: '《浙江日报》专访（浙江省社科界学术年会 2014-11-15 报告后）', source: '浙江日报', url: 'http://zjrb.zjol.com.cn/html/2014-11/28/content_2828671.htm', verified: 'media', themes: ['innovation', 'goodgov'] },
  { id: 'k2015', date: '2015-10-28', form: '讲话', venue: '中国深化改革理论研讨会 · 宣布辞去中央编译局副局长', source: '财新网', url: 'https://china.caixin.com/2015-10-28/100867500.html', verified: 'media', themes: ['discipline'] },
  { id: 'k2016', date: '2016-05', form: '论文', venue: '《权力与权威：新的解释》，《中国人民大学学报》2016 年第 30 卷第 3 期，第 40—49 页', source: '《中国人民大学学报》官网；北大中国政治学研究中心全文', url: 'http://xuebao.ruc.edu.cn/CN/Y2016/V30/I3/40', verified: 'primary', themes: ['authority'] },
  { id: 'k2018a', date: '2018', form: '论文', venue: '《中国政治学的主要趋势（1978—2018）》，《北京大学学报（哲学社会科学版）》2018 年第 5 期，第 9—19 页', source: '北大中国政治学研究中心全文', url: 'https://www.rccp.pku.edu.cn/mzyt/86021.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2018b', date: '2018-11-04', form: '讲话', venue: '《中国的治理变迁（1978—2018）》新书发布会主旨演讲', source: '北京大学社会科学部', url: 'https://fss.pku.edu.cn/xbdt/xzxw/86164.htm', verified: 'primary', themes: ['goodgov'] },
  { id: 'k2019', date: '2019', form: '论文', venue: '《中国地方政府创新的可持续性（2000—2015）——以"中国地方政府创新奖"获奖项目为例》，《公共管理学报》2019 年', source: '北大中国政治学研究中心全文（2019-04-08 发布）', url: 'https://www.rccp.pku.edu.cn/mzyt/94751.htm', verified: 'primary', themes: ['innovation'] },
  { id: 'k2021', date: '2021-06', form: '署名文章', venue: '《中国城市治理创新的若干重要问题》', source: '爱思想转载', url: 'https://www.aisixiang.com/data/127048.html', verified: 'reprint', themes: ['innovation'] },
  { id: 'k2022', date: '2022', form: '论文', venue: '《帝国新论》，《清华大学学报（哲学社会科学版）》2022 年第 2 期', source: '《清华大学学报》；2023 年扩写为同名专著', verified: 'primary', themes: ['discipline'] },
  { id: 'k2023', date: '2023-02', form: '署名文章', venue: '《北大金融评论》撰文 · 城市治理', source: '北京大学城市治理研究院官网', url: 'https://www.iug.pku.edu.cn/xwzx/byxw/24iug1364561.htm', verified: 'primary', themes: ['innovation', 'civil'] },
  { id: 'k2024a', date: '2024-01-14', form: '讲话', venue: '第三届"中国城市治理创新优秀案例奖"颁奖致辞', source: '北大中国政治学研究中心官网', url: 'https://www.rccp.pku.edu.cn/zxxw/156119.htm', verified: 'primary', themes: ['innovation'] },
  { id: 'k2024b', date: '2024-05-25', form: '讲话', venue: '南京大学第三届"国家+"论坛主旨演讲 · 国家的消亡与人类的理想政治', source: '北大中国政治学研究中心官网', url: 'https://www.rccp.pku.edu.cn/zxxw/159487.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2025a', date: '2025-01', form: '论文', venue: '《"奴婢贱人，律比畜产"——中国古代贱民的政治学分析》，《学术月刊》2025 年第 57 卷第 1 期，第 73—89 页', source: '《学术月刊》官网（爱思想转载）', url: 'https://www.xsyk021.com/article/id/1cf71ad3-6a3c-428d-a72d-c2b7ef8670f1', verified: 'primary', themes: ['authority'] },
  { id: 'k2025b', date: '2025-04-03', form: '讲座', venue: '绍兴文理学院风则江大讲堂 · 帝国及其命运', source: '绍兴文理学院官网', url: 'https://www.usx.edu.cn/info/1138/50731.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2025c', date: '2025-04-05', form: '讲座', venue: '云南民族大学讲座 · 全球民粹政治的兴起', source: '主办方微信公众号', url: 'https://mp.weixin.qq.com/s/nKiuSPwxZRKpvzHSDkUtUg', verified: 'reprint', themes: ['discipline'] },
  { id: 'k2025d', date: '2025-05-21', form: '讲话', venue: '北京大学"数字与人文高端对话：人工智能与国家治理"主旨演讲', source: '新京报', url: 'https://m.bjnews.com.cn/detail/174815807519600.html', verified: 'media', themes: ['discipline'] },
  { id: 'k2025e', date: '2025-07-25', form: '讲话', venue: '格拉斯哥大学研讨会主旨演讲 · Megacities and Human Development', source: '北大中国政治学研究中心官网', url: 'https://www.rccp.pku.edu.cn/zxxw/1070rccp170168.htm', verified: 'primary', themes: ['innovation'] },
  { id: 'k2025f', date: '2025', form: '论文', venue: '《城市治理与国家治理》，《中国治理评论》2025 年第 3 期，第 45—51 页', source: '深圳大学政府管理学院官网转载', url: 'https://sg.szu.edu.cn/info/1024/4240.htm', verified: 'primary', themes: ['innovation', 'goodgov'] },
  { id: 'k2025g', date: '2025-11-01', form: '讲话', venue: '北大中国政治学研究中心成立十周年暨《政治通鉴》第八卷、《政治学前沿》、《中国古典政治九论》发布会', source: '北京大学新闻网（2025-11-03）', url: 'http://news.pku.edu.cn/info/7921/2773471.htm', verified: 'primary', themes: ['authority', 'discipline'] },
  { id: 'k2026a', date: '2026-02-04', form: '讲座', venue: '深圳市规划和自然资源局"规资大讲堂" · 城市治理与全球治理——从城市文明到全球文明', source: '深圳大学政府管理学院官网', url: 'https://sg.szu.edu.cn/info/1024/4560.htm', verified: 'primary', themes: ['innovation'] },
  { id: 'k2026b', date: '2026-06-13', form: '讲话', venue: '清华大学第五届"国家+"论坛主旨发言 · 数智化对国家主权的新挑战', source: '深圳大学政府管理学院官网', url: 'https://sg.szu.edu.cn/info/1005/5960.htm', verified: 'primary', themes: ['discipline'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 增量民主与民主理论 ——
  { id: 'd1', k: 'k2006b', theme: 'democracy', type: '原话', text: '民主是个好东西，不是对个别的人而言的，也不是对一些官员而言的；它是对整个国家和民族而言的，是对广大人民群众而言的。' },
  { id: 'd2', k: 'k2006b', theme: 'democracy', type: '原话', text: '但是，在人类迄今发明和推行的所有政治制度中，民主是弊端最少的一种。也就是说，相对而言，民主是人类迄今最好的政治制度。' },
  { id: 'd3', k: 'k2006b', theme: 'democracy', type: '原话', text: '民主是个好东西，不是说民主是无条件的。实现民主需要具备相应的经济、文化和政治条件，不顾条件而推行民主，会给国家和人民带来灾难性的结果。' },
  { id: 'd4', k: 'k2007', theme: 'democracy', type: '原话', text: '这种政治模式最明显的特征，就是通过增量改革来逐渐推进中国的民主治理，扩大公民的政治权益，因此，我把它称为“增量民主”。' },
  { id: 'd5', k: 'k2007', theme: 'democracy', type: '原话', text: '增量民主的实质，是在不损害人民群众原有政治利益的前提下，最大限度地增加新的政治利益。' },
  { id: 'd6', k: 'k2007', theme: 'democracy', type: '原话', text: '没有党内的民主，中国目前的民主就是一句空话。' },
  { id: 'd7', k: 'k2007', theme: 'democracy', type: '原话', text: '民主的发展过程也就是人民政治选择的范围不断扩大的过程，是由更少的竞争性选择到更多的竞争性选择的过程。' },
  { id: 'd8', k: 'k2007', theme: 'democracy', type: '转述', text: '提出增量民主的三条路线图：以党内民主带动社会民主、由基层民主向高层民主推进、由更少的竞争到更多的竞争；并强调公民参与须合法、有组织、有秩序，纳入党和政府主导的政治框架。' },
  { id: 'd9', k: 'k2009', theme: 'democracy', type: '转述', text: '据报道：本人回顾《民主是个好东西》于 2006-09-15 先上传中国政府创新网，发表后同时遭到来自极左与极右两个方向的批评。' },
  { id: 'd10', k: 'k2011', theme: 'democracy', type: '转述', text: '认为选举民主与协商民主是民主的两种最重要形式，主张把人民政协的工作重点定位于协商民主，并把协商范围扩展到政府与群众之间的协商。' },
  { id: 'd11', k: 'k2013b', theme: 'democracy', type: '原话', text: '选举民主和协商民主作为民主政治的两个基本环节是一种互补的关系，而不是排斥关系。' },
  { id: 'd12', k: 'k2013b', theme: 'democracy', type: '转述', text: '区分协商民主与咨询民主，认为二者在主体、主体间关系与议程设置三方面不同。' },

  // —— 善治与国家治理现代化 ——
  { id: 'g1', k: 'k1999', theme: 'goodgov', type: '原话', text: '概括地说，善治就是使公共利益最大化的社会管理过程。善治的本质特征，就在于它是政府与公民对公共生活的合作管理，是政治国家与市民社会的一种新颖关系，是两者的最佳状态。' },
  { id: 'g2', k: 'k1999', theme: 'goodgov', type: '原话', text: '专制政治在其最佳的状态下，可以有善政，但不会有善治。善治只有在民主政治的条件下才能真正实现，没有民主善治便不可能存在。' },
  { id: 'g3', k: 'k1999', theme: 'goodgov', type: '转述', text: '列出善治的基本要素，包括合法性、透明性、责任性、法治与回应等。' },
  { id: 'g4', k: 'k2014a', theme: 'goodgov', type: '原话', text: '‘多一些治理，少一些统治’是21世纪世界主要国家政治变革的重要特征。' },
  { id: 'g5', k: 'k2014a', theme: 'goodgov', type: '原话', text: '国家治理体系就是规范社会权力运行和维护公共秩序的一系列制度和程序。' },
  { id: 'g6', k: 'k2014a', theme: 'goodgov', type: '原话', text: '其中，民主是现代国家治理体系的本质特征，是区别于传统国家治理体系的根本所在。' },
  { id: 'g7', k: 'k2014a', theme: 'goodgov', type: '转述', text: '归纳统治与治理的五点区别，并以制度化、民主化、法治、效率、协调五项标准衡量国家治理现代化。' },
  { id: 'g8', k: 'k2018b', theme: 'goodgov', type: '转述', text: '据主办方报道：以"变"与"不变"相结合解释中国发展之谜，认为改革开放以来的政治改革在很大程度上是治理改革。' },

  // —— 公民社会与社会治理 ——
  { id: 's1', k: 'k1999', theme: 'civil', type: '原话', text: '它认为政府不是合法权力的唯一源泉，公民社会也同样是合法权力的来源' },
  { id: 's2', k: 'k2006a', theme: 'civil', type: '原话', text: '中国公民社会制度环境的特征，典型地体现为宏观鼓励与微观约束、分级登记与双重管理、双重管理与多头管理、政府法规与党的政策、制度剩余与制度匮乏、现实空间与制度空间的共存。' },
  { id: 's3', k: 'k2006a', theme: 'civil', type: '转述', text: '对中国公民社会的概念、分类与制度环境作系统梳理；该研究为联合国开发计划署与商务部委托课题的成果。' },
  { id: 's4', k: 'k2014a', theme: 'civil', type: '原话', text: '强调‘国家治理’而非‘国家统治’，强调‘社会治理’而非‘社会管理’，不是简单的词语变化，而是思想观念的变化。' },
  { id: 's5', k: 'k2007', theme: 'civil', type: '转述', text: '主张培育公民社会、推进社会管理体制改革，改革社会保障、社会治安、户籍与社区治理等制度，让民间组织与政府合作共同管理社会政治生活。' },

  // —— 政府创新与城市治理 ——
  { id: 'i1', k: 'k2014b', theme: 'innovation', type: '转述', text: '提出推进国家治理现代化的若干举措：解放思想、加强顶层设计、及时把地方创新做法上升为国家制度、借鉴国外经验、破除阻碍进步的体制机制、破除官本位观念。' },
  { id: 'i2', k: 'k2019', theme: 'innovation', type: '原话', text: '越是成功的政府创新，其可持续性便越高；政府创新的可持续，关键在于其要素的延续与扩散，而不在其形式的存续' },
  { id: 'i3', k: 'k2019', theme: 'innovation', type: '转述', text: '中国地方政府创新奖共办 8 届，有效申报 1334 项、入围 178 项（优胜 80 项），其中 165 项存续、13 项中止，可持续率接近 93%；问卷中 78% 不认同"主要负责人更换后项目会终止"。' },
  { id: 'i4', k: 'k2024a', theme: 'innovation', type: '转述', text: '据致辞：第三届城市治理创新优秀案例奖共有 245 个党政机构申报，浙江申报 175 项、占 56%，评出优胜 10 项、入围 9 项。' },
  { id: 'i5', k: 'k2025f', theme: 'innovation', type: '原话', text: '城市治理也是国家治理的基础，城市治理的现代化是国家治理现代化的基础。' },
  { id: 'i6', k: 'k2025f', theme: 'innovation', type: '原话', text: '国家治理的现代化，在很大程度上将取决于城市治理的现代化。' },
  { id: 'i7', k: 'k2025f', theme: 'innovation', type: '转述', text: '以 1978—2023 年城镇化率由 17.9% 升至约 67%、城市由 193 个增至 694 个为背景，并指出地方政府创新奖获奖项目中深圳 16 项、北京 9 项、上海 7 项。' },
  { id: 'i8', k: 'k2026a', theme: 'innovation', type: '转述', text: '据主办方报道：提出 21 世纪是城市的世纪，城市治理是国家治理的基础，并由城市文明延伸讨论全球治理。' },

  // —— 权力、权威与官本主义 ——
  { id: 'a1', k: 'k2013a', theme: 'authority', type: '原话', text: '官本主义就是以权力为本位的政治文化和社会政治形态' },
  { id: 'a2', k: 'k2013a', theme: 'authority', type: '原话', text: '民主法治是破解官本主义，促使传统政治文明走向现代政治文明的不二法门。' },
  { id: 'a3', k: 'k2016', theme: 'authority', type: '原话', text: '权力是迫使对方服从的制度性强制力量，权威是一种使对象因信服而顺从的影响力，两者的实质性区别是强制服从和自愿服从。' },
  { id: 'a4', k: 'k2016', theme: 'authority', type: '原话', text: '民主而非专制，法治而非人治，善治而非善政，成为现代政治权威的主要合法性来源。' },
  { id: 'a5', k: 'k2016', theme: 'authority', type: '转述', text: '以"霸道"与"王道"对应权力与权威，认同鲁迅关于王道只是理想、霸道才是现实的判断，并认为网络化将使权威来源趋于多样。' },
  { id: 'a6', k: 'k2025a', theme: 'authority', type: '原话', text: '贱民政治即是奴性政治，国民奴性的形成与贱籍制度有着内在的联系。' },
  { id: 'a7', k: 'k2025g', theme: 'authority', type: '转述', text: '据报道：发布《中国古典政治九论》，以"官本主义"作为解释中国传统政治的分析范式。' },

  // —— 政治学科与比较政治 ——
  { id: 'p1', k: 'k2018a', theme: 'discipline', type: '原话', text: '没有政治科学的繁荣，就难有高度发达的民主政治，也不可能有国家治理的现代化。' },
  { id: 'p2', k: 'k2018a', theme: 'discipline', type: '原话', text: '亟待提高中国政治学的知识化、专业化、学术化和全球化程度' },
  { id: 'p3', k: 'k2006b', theme: 'discipline', type: '原话', text: '如果一个国家主要用强制的手段，让其他国家的人民也接受自己的所谓民主制度，那就是国际的政治专制，是国际的暴政。' },
  { id: 'p4', k: 'k1999', theme: 'discipline', type: '转述', text: '在引介治理理论的同时提醒：全球治理理论可能削弱国家主权，并被用作干涉他国内政的理论依据。' },
  { id: 'p5', k: 'k2022', theme: 'discipline', type: '转述', text: '认为帝国时代已一去不复返，但帝国主义还将长期存在。' },
  { id: 'p6', k: 'k2025d', theme: 'discipline', type: '转述', text: '据报道：认为数智时代的国家主权受到算法权力、跨境数据流动与网络暴力的冲击，并宣布将成立"国家数字主权实验室"。' },
  { id: 'p7', k: 'k2026b', theme: 'discipline', type: '转述', text: '据主办方报道：以数智化对国家主权的新挑战为题作主旨发言，延续其数字主权议题。' },
  { id: 'p8', k: 'k2015', theme: 'discipline', type: '转述', text: '据报道：辞去编译局副局长的理由包括专心推动基础理论研究、践行干部"能上能下"（副局长任职 14 年，已超任期年限），以及由"尘世的学问"转向"天国的学问"。' },
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

export const FEATURED = ['d1', 'd2', 'd3', 'd5', 'g2', 'g6', 'a4', 'i6'];

export const THEME_LINKS = {
  democracy: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/ideology', label: '意识形态' }],
  goodgov: [{ to: '/governance', label: '国家治理' }, { to: '/reform', label: '改革' }],
  civil: [{ to: '/socialgov', label: '基层治理' }, { to: '/ruleoflaw', label: '法治' }],
  innovation: [{ to: '/urban', label: '城市' }, { to: '/govsystem', label: '政府体制' }],
  authority: [{ to: '/modules/anticorruption', label: '反腐结构观测' }, { to: '/modules/shijian', label: '史鉴' }],
  discipline: [{ to: '/civilization', label: '文明' }, { to: '/digital', label: '数字' }],
};

export const THEME_INTRO = {
  democracy: '其最具辨识度的一条线：2006 年《民主是个好东西》断言民主是"弊端最少"的制度，同时强调民主有条件、不照搬；此前提出的"增量民主"主张在存量基础上渐进增加政治利益，并给出党内民主、基层民主、竞争扩大三条路线图。与王绍光、潘维、杨光斌的分歧见"争议"栏。',
  goodgov: '1999 年引介治理理论并提出"善治"是政府与公民对公共生活的合作管理、只能在民主条件下实现；十八届三中全会后以"国家治理"对"国家统治"的区分阐释治理现代化，并把民主视为现代国家治理体系的本质特征。',
  civil: '公民社会研究以 2006 年《中国社会科学》论文为代表，概括制度环境的六组并存特征；在其框架中公民社会既是合法权力的来源，也是由社会管理走向社会治理的主体。',
  innovation: '2000 年起联合主持中国地方政府创新奖，以获奖项目追踪创新的可持续性；近年转向城市治理，主张城市治理现代化是国家治理现代化的基础，并创设城市治理创新案例奖。',
  authority: '区分强制服从的权力与自愿服从的权威，把民主、法治、善治视为现代权威的合法性来源；以"官本主义"概括中国传统社会的权力本位结构，2025 年延伸到贱民政治与《中国古典政治九论》。',
  discipline: '关注中国政治学的专业化与全球化，主编《政治通鉴》；比较政治方面讨论全球治理与主权、帝国与帝国主义、民粹政治，近两年聚焦数智化对国家主权的冲击。',
};

// ============================================================================
// 命题检验台账：只收可与制度演进对照的命题；对照截至核验日
// done 仅指制度演进与命题方向一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'open', type: '转述', date: '2007-09-18', venue: '北大新闻网转新华网署名文章',
    url: 'http://news.pku.edu.cn/info/2891/2702101.htm',
    claim: '以党内民主带动社会民主',
    check: '十七大报告（2007-10）提出"以扩大党内民主带动人民民主"，十八大报告（2012-11）重申"以党内民主带动人民民主"，与命题一致；十九大、二十大报告全文未再出现"带动人民民主"表述，二十大报告改为"落实党内民主制度，保障党员权利"，并以"全过程人民民主"统领民主论述。表述变化后路径是否延续尚难判定。',
    dataSrc: '中新网 2007-10-19（十七大报告）；国史网 2012-12-18（十八大报告）；中国政府网十九大、二十大报告全文',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2007-09-18', venue: '北大新闻网转新华网署名文章',
    url: 'http://news.pku.edu.cn/info/2891/2702101.htm',
    claim: '逐渐由基层民主向高层民主推进，重大民主改革经基层试验逐步向上',
    check: '村民自治等基层群众自治制度持续存在（该文称截至 2004 年底建立 64.4 万个村委会）；检索截至核验日，未见把基层选举试验推广至更高层级的全国性制度安排。',
    dataSrc: '公开制度文件（检索截至 2026-09）',
  },
  {
    id: 'L3', status: 'open', type: '原话', date: '2007-09-18', venue: '北大新闻网转新华网署名文章',
    url: 'http://news.pku.edu.cn/info/2891/2702101.htm',
    claim: '民主的发展过程也就是人民政治选择的范围不断扩大的过程，是由更少的竞争性选择到更多的竞争性选择的过程。',
    check: '属长期方向性命题；检索截至核验日，未见扩大竞争性选举范围的全国性制度安排，近年官方民主论述的重心在协商民主与全过程人民民主。未作失败判定，因命题未给出时间表。',
    dataSrc: '二十大报告（2022-10）；公开制度文件',
  },
  {
    id: 'L4', status: 'done', type: '转述', date: '2013-11-27', venue: '南开协商民主国际研讨会发言（人民网）',
    url: 'http://theory.people.com.cn/n/2013/1127/c40531-23667489.html',
    claim: '应从国家层面、以制度和法律形式授权政协承担或推动协商民主',
    check: '2015-02-09 公布的中共中央《关于加强社会主义协商民主建设的意见》提出"充分发挥人民政协作为协商民主重要渠道和专门协商机构的作用"；二十大报告要求"发挥人民政协作为专门协商机构作用"。中央文件层面的定位与命题一致，但以党内文件而非法律形式确立，且不代表采纳了本人建议。',
    dataSrc: '新华网 2015-02-09；中国政府网二十大报告全文',
  },
  {
    id: 'L5', status: 'done', type: '转述', date: '2011-11-21', venue: '人民政协网专访',
    url: 'http://www.cppcc.gov.cn/2011/11/21/ARTI1321842150421285.shtml',
    claim: '扩大协商范围，把政府与群众的协商也包括进来',
    check: '二十大报告要求"统筹推进政党协商、人大协商、政府协商、政协协商、人民团体协商、基层协商以及社会组织协商"，政府协商列为协商渠道之一。与命题方向一致，不作因果归功。',
    dataSrc: '中国政府网二十大报告全文（2022-10-25）',
  },
  {
    id: 'L6', status: 'done', type: '原话', date: '2014-02-27', venue: '《前线》（人民网转载）',
    url: 'http://theory.people.com.cn/n/2014/0227/c83859-24485027.html',
    claim: '强调‘国家治理’而非‘国家统治’，强调‘社会治理’而非‘社会管理’，不是简单的词语变化，而是思想观念的变化。',
    check: '"推进国家治理体系和治理能力现代化"自十八届三中全会（2013-11）确立为全面深化改革总目标，十九届四中全会（2019-10）以专门决定部署，二十大报告继续沿用"社会治理"表述。该文为对既定提法的阐释，此处仅记录其判断与后续制度走向一致。',
    dataSrc: '十八届三中全会、十九届四中全会决定；二十大报告',
  },
  {
    id: 'L7', status: 'done', type: '转述', date: '2014-11-28', venue: '《浙江日报》专访',
    url: 'http://zjrb.zjol.com.cn/html/2014-11/28/content_2828671.htm',
    claim: '及时把地方创新做法上升为国家制度',
    check: '起源于浙江的"最多跑一次"写入 2018 年政府工作报告（"必须到现场办的也要力争做到‘只进一扇门’、‘最多跑一次’"）。属地方创新上升为全国政策的一例，与命题方向一致；个例不足以证明普遍机制，亦不归功于本人。',
    dataSrc: '中国政府网 2018 年政府工作报告',
  },
  {
    id: 'L8', status: 'open', type: '转述', date: '2007-09-18', venue: '北大新闻网转新华网署名文章',
    url: 'http://news.pku.edu.cn/info/2891/2702101.htm',
    claim: '培育公民社会组织，改革社会管理体制',
    check: '2016-08-21 中办国办《关于改革社会组织管理制度促进社会组织健康有序发展的意见》对行业协会商会类、科技类、公益慈善类、城乡社区服务类四类社会组织实行直接登记；其余类别仍须业务主管单位审查。2006 年所概括的"双重管理"仅部分松动，改革方向与幅度并存，记为未决。',
    dataSrc: '中国政府网 2016-08-21',
  },
  {
    id: 'L9', status: 'open', type: '原话', date: '2007-09-18', venue: '北大新闻网转新华网署名文章',
    url: 'http://news.pku.edu.cn/info/2891/2702101.htm',
    claim: '动态的政治稳定将逐渐取代静态的政治稳定。',
    check: '"以疏为主"的动态稳定缺乏可公开量化的指标；官方仍强调维护稳定与基层治理体系建设，难以判定取代是否发生。',
    dataSrc: '无可直接对照的统计口径',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2025', venue: '《中国治理评论》2025 年第 3 期',
    url: 'https://sg.szu.edu.cn/info/1024/4240.htm',
    claim: '国家治理的现代化，在很大程度上将取决于城市治理的现代化。',
    check: '2025-07-14/15 中央城市工作会议要求"创新城市治理的理念、模式、手段"、"调动人民群众参与城市治理的积极性"，相关讲话 2026-01-15 刊于《求是》。政策对城市治理的重视与命题一致，但"取决于"属因果判断，尚无法检验。',
    dataSrc: '中国政府网 2025-07；《求是》2026 年第 2 期',
  },
];

// 俞可平公开表述以理论命题为主，文中统计数字多为引述官方或奖项数据，不设独立数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '增量民主', '善治与治理', '公民社会', '权力与权威', '政府创新'],
  nodes: [
    { id: 'core', name: '民主治理\n与国家治理现代化', cat: 0, size: 58 },
    { id: 'incr', name: '增量民主', cat: 1, size: 40 },
    { id: 'good', name: '民主是个好东西', cat: 1, size: 32 },
    { id: 'paths', name: '三条路线图', cat: 1, size: 26 },
    { id: 'intra', name: '党内民主带动社会民主', cat: 1, size: 24 },
    { id: 'compet', name: '由少竞争到多竞争', cat: 1, size: 22 },
    { id: 'dynstab', name: '动态稳定', cat: 1, size: 22 },
    { id: 'delib', name: '选举民主 × 协商民主', cat: 1, size: 26 },
    { id: 'shanzhi', name: '善治', cat: 2, size: 38 },
    { id: 'shanzheng', name: '善政 → 善治', cat: 2, size: 24 },
    { id: 'zhili', name: '统治 → 治理', cat: 2, size: 28 },
    { id: 'modern', name: '治理现代化五标准', cat: 2, size: 26 },
    { id: 'civil', name: '公民社会', cat: 3, size: 32 },
    { id: 'env', name: '制度环境六组并存', cat: 3, size: 24 },
    { id: 'social', name: '社会管理 → 社会治理', cat: 3, size: 24 },
    { id: 'authority', name: '权力 / 权威', cat: 4, size: 30 },
    { id: 'guanben', name: '官本主义', cat: 4, size: 32 },
    { id: 'rights', name: '权力本位 → 权利本位', cat: 4, size: 24 },
    { id: 'jianmin', name: '贱民政治', cat: 4, size: 20 },
    { id: 'innov', name: '地方政府创新', cat: 5, size: 32 },
    { id: 'sustain', name: '创新可持续性', cat: 5, size: 22 },
    { id: 'city', name: '城市治理是国家治理的基础', cat: 5, size: 28 },
    { id: 'digital', name: '数字主权', cat: 5, size: 20 },
  ],
  links: [
    ['core', 'incr'], ['core', 'shanzhi'], ['core', 'civil'], ['core', 'authority'], ['core', 'innov'],
    ['incr', 'good'], ['incr', 'paths'], ['paths', 'intra'], ['paths', 'compet'], ['incr', 'dynstab'], ['incr', 'delib'],
    ['shanzhi', 'shanzheng'], ['shanzhi', 'zhili'], ['zhili', 'modern'], ['good', 'shanzhi'],
    ['civil', 'env'], ['civil', 'social'], ['civil', 'shanzhi'], ['social', 'zhili'],
    ['authority', 'guanben'], ['authority', 'rights'], ['guanben', 'jianmin'], ['authority', 'shanzhi'],
    ['innov', 'sustain'], ['innov', 'city'], ['city', 'modern'], ['city', 'digital'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '"民主是个好东西"引发的评论与商榷',
    sides: [
      { who: '俞可平（2006 序言；2009 新浪报道）', view: '民主是迄今弊端最少的政治制度，但有经济、文化、政治条件，不照搬国外模式；本人称文章发表后同时受到来自左右两个方向的批评（转述）。' },
      { who: '高民政（《探索与争鸣》2013 年第 11 期）', view: '转述：以《中国式民主也是个好东西》为题，由"民主是个好东西"引出，论证中国式民主同样有其价值与合理性。' },
      { who: '蒋德海（《探索与争鸣》2014 年第 2 期）', view: '转述：与高民政商榷，主张"中国式民主"的好坏须由民主的一般标准来检验。' },
    ],
    note: '高、蒋二文围绕"民主是个好东西"命题展开，但均非对俞可平本人的直接点名反驳；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '民主的内涵与普遍性：普遍价值、"选主"还是"民主迷信"',
    sides: [
      { who: '俞可平（2006；2007）', view: '民主是人类迄今最好的政治制度；支撑中国政治变革的普遍价值是自由、民主、平等和人权，同时强调条件与本国特色（转述）。' },
      { who: '王绍光（《民主四讲》，三联书店 2008-08）', view: '转述：认为现代代议民主在很大程度上已变成"选主"，主张重新审视抽签等更接近"民治"的形式，并追问民主如何从"坏东西"变成"好东西"。' },
      { who: '潘维（《法治与"民主迷信"》，香港社会科学出版社 2003-05；《民主迷信与中国政治体制改革的方向》）', view: '转述：反对以竞争性选举为改革方向，主张以法治为主、民主为辅的"咨询型法治"。' },
    ],
    note: '王、潘二书均未以俞可平为直接对象，此处按民主观的解释路径并陈；本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '竞争性选举与民主条件：扩大竞争还是警惕"党争民主"',
    sides: [
      { who: '俞可平（2007；2013）', view: '民主发展是由更少的竞争性选择到更多的竞争性选择的过程；选举民主与协商民主互补而非排斥（转述）。' },
      { who: '杨光斌（《几个流行的民主化理论命题的证伪》，荆楚网 2014-03）', view: '转述：民主在价值上是公共之善，但更是政体与工具问题，需要社会同质性等条件，"党争民主"易导致国家分裂。' },
      { who: '杨光斌（《政体理论的回归与超越》）', view: '转述：民主政体在根本上是"官民关系"问题，强调国家自主性。' },
    ],
    note: '杨光斌文本未点名俞可平，属民主条件论的解释路径并陈；本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '《民主是个好东西》报刊首发时间', status: '并陈', reason: '爱思想转载注与北大资料作《北京日报》2006-10-23；北京青年报 2015-10-29 称"2006 年 12 月在《北京日报》发表"；本人另称 2006-09-15 先上传中国政府创新网。' },
  { id: 'q2', item: '博士学位获得年份', status: '并陈', reason: '财新、北青作 1987 年毕业；《增量民主与善治》自序作 1988 年获博士学位。' },
  { id: 'q3', item: '中国地方政府创新奖停办年份', status: '并陈', reason: '2019 年论文正文一处作"2015 年中止"，另一处作"2016 年暂停"。' },
  { id: 'q4', item: 'Democracy Is a Good Thing 英文版出版年', status: '更正', reason: '北大页面作 2008，Brookings 出版社页面为 2009-01-09，以出版社为准。' },
  { id: 'q5', item: '"北大博雅讲席教授/人文讲席教授""燕京学堂"等头衔', status: '不收录', reason: '北大、深大官方页面均只载"讲席教授"，未检索到博雅讲席、人文讲席或燕京学堂任职的出处。' },
  { id: 'q6', item: '清华大学凯风政治发展研究所所长任期', status: '〔存疑〕', reason: '仅见简介性材料提及，起止年份未见官方载明，未列入履历甘特。' },
  { id: 'q7', item: '"胡锦涛文胆""智囊"等媒体标签', status: '不收录', reason: '属海外媒体与自媒体的定性说法，无本人或官方出处，不作为履历信息。' },
  { id: 'q8', item: '《中国的治理变迁（1978—2018）》出版月份', status: '并陈', reason: '豆瓣等书目作 2018-05，另有书目作 2018-06；发布会为 2018-11-04。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
