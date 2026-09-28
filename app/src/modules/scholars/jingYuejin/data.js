// ============================================================================
// 学者专栏 · 景跃进 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 期刊原文/署名文章/主办方报道 · media 媒体报道 · reprint 题录或二手引述 · doubt 存疑。
// 仅见题录而未见全文的论文只作转述；讲座类条目一律据主办方报道转述。
// 合著、合编成果标注合作者，不单独归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  partystate: { label: '党政体制与党政关系', color: '#c41e3a' },
  bringparty: { label: '将政党带进来', color: '#8b5cf6' },
  grassroots: { label: '基层民主与乡村治理', color: '#10b981' },
  represent: { label: '代表理论·群众路线·选举技术', color: '#e8a317' },
  democracy: { label: '民主理论与民主化序列', color: '#22d3ee' },
  discipline: { label: '中国政治学学科建设与概念方法', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '景跃进',
  born: '1958 年 7 月 · 祖籍浙江萧山（另有"浙江嘉兴人"之说，并陈）',
  summary:
    '杭州大学哲学学士（1982），南开大学社会学系研究生班（1986），中国人民大学政治学博士（2004，在职）。1986—2008 年任教中国人民大学社会学系、行政学所与国际关系学院政治学系，历任讲师、副教授、教授，兼人大 MPA 政治学课程首席教授；约 2008—2009 年调入清华大学社会科学学院政治学系任教授，多年任系副主任。早年研究村民自治与"两委关系"，继而提出"规律—使命式代表"与"选举式代表"的区分、以"党政体制"描述当代中国政治结构，2019 年主张"将政党带进来"、把国家—社会二分改为政党—政府—社会三分；近年转向民主理论重构与中国政治学概念方法（穹概念+亚类型、病理分析向生理分析的转向）。',
  current: [
    '清华大学社会科学学院政治学系教授（2024-06 清华人文学院页面称"退休教授"，见存疑栏）',
    '中山大学人文高等研究院特邀访问教授（2023 学年秋季）',
    '第三届全国基层政权建设和社区治理专家委员会成员（据华南师大 2023-12 讲座页介绍）',
    '《当代中国政府与政治》（人大出版社，第二版 2024）主编之一',
  ],
  sources: '清华大学政治学系个人页；清华国际关系研究院人物页；爱思想专栏；北大文研院讲座简介；中山大学政务学院、华南师大讲座页；百度百科（仅作交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 18,
  subtitle: '党政体制 · 将政党带进来 · 选择性行政化 · 代表理论 · 穹概念+亚类型',
  span: '1992—2026',
  careerTitle: '履历时间线 · 杭大 → 南开 → 人大 → 清华 · 访学与咨询兼职',
  defaultTheme: 'bringparty',
  moduleId: 'scholarJingYuejin',
  sourceNote: '期刊论文原文 / 教材导论摘编 / 署名文章 / 主办方讲座报道 · 对照：中共中央、中办国办、全国人大及其常委会、中组部、国新办文件',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  study: { label: '求学', color: '#8b5cf6' },
  ruc: { label: '杭大/人大教职', color: '#22d3ee' },
  thu: { label: '清华教职', color: '#c41e3a' },
  admin: { label: '系务/课程', color: '#10b981' },
  visit: { label: '访学/访问', color: '#e8a317' },
  service: { label: '兼职与咨询', color: '#94a3b8' },
};

/** 履历甘特：起止为小数年；月份未载者取近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '杭州大学哲学系本科', org: '杭州大学', start: 1978.7, end: 1982.5, group: 'study', note: '1982 年获学士学位；入学年份按四年学制推算〔存疑〕' },
  { id: 'c2', role: '杭州大学哲学系助教', org: '杭州大学', start: 1982.5, end: 1984.6, group: 'ruc' },
  { id: 'c3', role: '南开大学社会学系研究生班', org: '南开大学', start: 1984.7, end: 1986.5, group: 'study', note: '1986 年结业；起始月份未载，取近似' },
  { id: 'c4', role: '中国人民大学社会学系助教', org: '中国人民大学', start: 1986.5, end: 1988.5, group: 'ruc' },
  { id: 'c5', role: '人大行政学研究所讲师、副教授', org: '中国人民大学', start: 1988.5, end: 1994.5, group: 'ruc' },
  { id: 'c6', role: '人大国际关系学院政治学系副教授', org: '中国人民大学', start: 1994.5, end: 2004.5, group: 'ruc', note: '2004 年获人大政治学博士（在职）' },
  { id: 'c7', role: '人大国际关系学院政治学系教授、博导', org: '中国人民大学', start: 2004.5, end: 2008.7, group: 'ruc' },
  { id: 'c8', role: '人大 MPA 政治学课程首席教授', org: '中国人民大学', start: 2001.0, end: 2008.7, group: 'admin' },
  { id: 'c9', role: '英国纽卡斯尔大学访问学者', org: 'Newcastle', start: 1995.1, end: 1995.6, group: 'visit' },
  { id: 'c10', role: '美国丹佛大学访问学者', org: 'Denver', start: 2000.2, end: 2000.45, group: 'visit' },
  { id: 'c11', role: '哥伦比亚大学富布赖特访问学者', org: 'Columbia', start: 2005.7, end: 2006.55, group: 'visit', note: '清华简历作 2005-09 至 2006-07；北大文研院简介作 2004—2005 年度，并陈' },
  { id: 'c12', role: '清华大学社会科学学院政治学系教授', org: '清华大学', start: 2008.7, end: 2026.75, group: 'thu', note: '清华简历人大任职止于 2008 年，北大文研院简介作 2009 年调入，并陈' },
  { id: 'c13', role: '清华大学政治学系副主任', org: '清华大学', start: 2011.0, end: 2021.9, group: 'admin', note: '仅见 2011、2019、2021 年相关页面记载，任期连续性〔存疑〕' },
  { id: 'c14', role: '华中师大中国农村问题研究中心兼职研究员', org: '华中师范大学', start: 2000.0, end: 2026.75, group: 'service', note: '起始年据清华简历，是否延续至今未载' },
  { id: 'c15', role: '全国村务公开协调小组专家咨询团成员', org: '全国村务公开协调小组', start: 2005.0, end: 2026.75, group: 'service', note: '起始年据清华简历，是否延续至今未载' },
  { id: 'c16', role: '中山大学人文高等研究院特邀访问教授', org: '中山大学', start: 2023.7, end: 2024.0, group: 'visit' },
];

export const BOOKS = [
  { id: 'b1', year: 1989, title: '现代化的动力（C.E. 布莱克著）', publisher: '浙江人民出版社', coauthors: '合译', themes: ['discipline'], verified: 'primary', note: '译著，据清华个人页著作目录' },
  { id: 'b2', year: 1990, title: '社会调查研究方法', publisher: '中国和平出版社', coauthors: '合著', themes: ['discipline'], verified: 'primary', note: '据清华个人页著作目录；版权页未独立核对' },
  { id: 'b3', year: 2001, title: '比较政治学导论', publisher: '中国人民大学出版社', date: '2001-11', isbn: '9787300038865', coauthors: '张小劲', themes: ['discipline', 'democracy'], verified: 'primary', note: '初版时间书目网站作 2001-11 或 2002-07，并陈；第二版 2008-03（ISBN 9787300090368）' },
  { id: 'b4', year: 2004, title: '政治空间的转换：制度变迁与技术操作', publisher: '中国社会科学出版社', date: '2004-04', isbn: '9787500444367', themes: ['grassroots', 'represent', 'democracy'], verified: 'primary', note: '个人论文集，18 篇分 3 个专题' },
  { id: 'b5', year: 2004, title: '当代中国农村"两委关系"的微观解析与宏观透视', publisher: '中央文献出版社', date: '2004-05', isbn: '9787507316360', themes: ['grassroots', 'partystate'], verified: 'primary', note: '村党支部与村委会关系的专著' },
  { id: 'b6', year: 2006, title: '政治学原理', publisher: '中国人民大学出版社', date: '2006-02', isbn: '9787300070889', coauthors: '张小劲（合编主编）', themes: ['discipline'], verified: 'primary', note: '教材。第二版 ISBN 9787300120782，出版时间书目网站分别作 2006-03 与 2010-09，并陈；第三版 2015（ISBN 9787300205151）' },
  { id: 'b7', year: 2006, title: '政治科学的理论与方法（马什、斯托克编）', publisher: '中国人民大学出版社', coauthors: '合译', themes: ['discipline'], verified: 'primary', note: '译著，据清华个人页著作目录' },
  { id: 'b8', year: 2012, title: '理解中国政治：关键词的方法', publisher: '中国社会科学出版社', date: '2012-10', isbn: '9787516116043', coauthors: '张小劲、余逊达（合编主编）', themes: ['discipline', 'partystate'], verified: 'primary', note: '21 个关键词；俞可平作序；入选中华读书报 2012 年度百佳图书' },
  { id: 'b9', year: 2014, title: '比较政治学前沿（第 2 辑）：比较政治中的概念问题', publisher: '中央编译出版社', date: '2014-06', isbn: '9787511721990', coauthors: '高奇琦（合编主编）', themes: ['discipline'], verified: 'primary' },
  { id: 'b10', year: 2016, title: '当代中国政府与政治', publisher: '中国人民大学出版社', date: '2016-01', isbn: '9787300220055', coauthors: '陈明明、肖滨（合编主编）', themes: ['partystate', 'bringparty', 'grassroots'], verified: 'primary', note: '第二版 2024-06（ISBN 9787300328478），8 所高校 11 位作者参编；导论提出"党政体制"' },
];

/** 论文 / 讲话 / 讲座 / 署名文章文库 */
export const CORPUS = [
  { id: 'k1992', date: '1992-11', form: '论文', venue: '邓正来、景跃进《建构中国的市民社会》，《中国社会科学季刊》（香港）创刊号，第 59—67 页', source: '据邓正来相关论著引注（未见全文扫描）', verified: 'reprint', themes: ['bringparty'] },
  { id: 'k2003', date: '2003', form: '论文', venue: '《行政民主：意义与局限——温岭"民主恳谈会"的启示》，《浙江社会科学》2003 年', source: '期刊题录（未见全文）', verified: 'reprint', themes: ['democracy', 'grassroots'] },
  { id: 'k2004a', date: '2004', form: '论文', venue: '《选举技术与民主化进程——关于改进乡镇国家机关领导人员候选人提名程序的思考》，《浙江学刊》2004 年，第 113—120 页', source: '《浙江学刊》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/14299.html', verified: 'primary', themes: ['represent', 'democracy'] },
  { id: 'k2004b', date: '2004', form: '论文', venue: '《"群众路线"与当代中国政治发展：内涵、结构与实践》，《湖南科技大学学报（社科版）》2004 年第 7 卷第 6 期，第 5—14 页', source: '期刊题录（未见全文）', verified: 'reprint', themes: ['represent'] },
  { id: 'k2005a', date: '2005-03', form: '论文', venue: '《党、国家与社会：三者维度的关系——从基层实践看中国政治的特点》，《华中师范大学学报（人文社科版）》2005 年第 44 卷第 2 期，第 9—13、29 页', source: '北京大学中国政治学研究中心转载（摘录）', url: 'https://www.rccp.pku.edu.cn/mzyt/56172.htm', verified: 'primary', themes: ['partystate', 'grassroots'] },
  { id: 'k2005b', date: '2005-03', form: '论文', venue: '《执政党与民众的联系：特征与机制——一个比较分析的简纲》，《浙江社会科学》2005 年第 2 期', source: '《浙江社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/23540.html', verified: 'primary', themes: ['represent', 'grassroots'] },
  { id: 'k2007', date: '2007-05', form: '论文', venue: '《代表理论与中国政治——一个比较视野下的考察》，《社会科学研究》2007 年第 3 期，第 16—21 页', source: '《社会科学研究》（人民论坛网转载）', url: 'https://www.rmlt.com.cn/2016/1019/442588.shtml', verified: 'primary', themes: ['represent', 'grassroots'] },
  { id: 'k2011a', date: '2011-01', form: '论文', venue: '《民主化理论与当代中国政治发展》，《新视野》2011 年第 1 期', source: '《新视野》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/53435.html', verified: 'primary', themes: ['democracy'] },
  { id: 'k2011b', date: '2011-03', form: '论文', venue: '《关于民主发展的多元维度与民主化序列问题》，《新视野》2011 年第 2 期，第 31—34 页', source: '《新视野》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/53434.html', verified: 'primary', themes: ['democracy'] },
  { id: 'k2011c', date: '2011-03', form: '论文', venue: '《转型、吸纳和渗透——挑战环境下执政党组织技术的嬗变及其问题》，《中国非营利评论》第七卷（2011 年第 1 期）', source: '社会科学文献出版社皮书数据库（摘要）', url: 'https://sociology.ssap.com.cn/skwx_shx/LiteratureDetail.aspx?ID=295266', verified: 'primary', themes: ['partystate'] },
  { id: 'k2012', date: '2012-12-15', form: '讲话', venue: '《理解中国政治：关键词的方法》发布座谈会发言', source: '中国新闻网', url: 'https://www.chinanews.com.cn/cul/2012/12-15/4411378.shtml', verified: 'media', themes: ['discipline'] },
  { id: 'k2016', date: '2016-01', form: '著作摘编', venue: '《"党政体制"与中国政治》，摘自景跃进、陈明明、肖滨主编《当代中国政府与政治》导论（人大出版社 2016）', source: '爱思想（教材导论摘编）', url: 'https://www.aisixiang.com/data/105836.html', verified: 'primary', themes: ['partystate'] },
  { id: 'k2017', date: '2017-07', form: '论文', venue: 'Jing Yuejin & Zhang Lina, "The changing institutional space regarding roles and behavior of village leaders: an evolution from villagers\u2019 autonomy to the power list", Journal of Chinese Governance 2(3): 271—291', source: 'Journal of Chinese Governance（与张丽娜合作；RePEc 题录）', url: 'https://ideas.repec.org/a/taf/rgovxx/v2y2017i3p271-291.html', verified: 'primary', themes: ['grassroots'] },
  { id: 'k2018', date: '2018-01', form: '论文', venue: '《中国农村基层治理的逻辑转换——国家与乡村社会关系的再思考》，《治理研究》2018 年第 34 卷第 1 期，第 48—57 页', source: '《治理研究》编辑部官网；华中师大中国农村研究院全文转载', url: 'http://journal08.magtech.org.cn/Jwk3_zlyj/CN/Y2018/V34/I1/48', verified: 'primary', themes: ['grassroots'] },
  { id: 'k2019a', date: '2019-08', form: '论文', venue: '《将政党带进来——国家与社会关系范畴的反思与重构》，《探索与争鸣》2019 年第 8 期，第 85—100、198 页', source: '《探索与争鸣》编辑部官网；爱思想全文转载', url: 'https://www.tsyzm.cn/CN/Y2019/V1/I8/85', verified: 'primary', themes: ['bringparty', 'partystate'] },
  { id: 'k2019b', date: '2019-11-18', form: '讲座', venue: '北大文研讲座第 151 期 · 社会科学中的概念问题', source: '清华大学政治学系官网；北京大学人文社会科学研究院', url: 'https://www.dps.tsinghua.edu.cn/info/1197/2083.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2021a', date: '2021-07', form: '论文', venue: '《中国政治学理论建构的若干议题——田野基础、历史脉络与创新维度》，《华中师范大学学报（人文社科版）》2021 年第 4 期', source: '清华大学政治学系官网转载', url: 'https://www.dps.tsinghua.edu.cn/info/1114/2392.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2021b', date: '2021-12-20', form: '署名文章', venue: '《中国民主理念与实践具有"两个超越"》', source: '北京日报客户端；清华大学新闻网转载', url: 'https://www.tsinghua.edu.cn/info/1662/90301.htm', verified: 'primary', themes: ['democracy'] },
  { id: 'k2022', date: '2022-01', form: '论文', venue: '《民主理论的发展：超越与重构》，《政治学研究》2022 年第 1 期', source: '中国政治学网；清华大学政治学系官网转载', url: 'http://chinaps.cssn.cn/rdpl_58843/202204/t20220412_5403107.shtml', verified: 'primary', themes: ['democracy', 'discipline'] },
  { id: 'k2023', date: '2023-11-10', form: '讲座', venue: '中山大学讲座 · 萨托利的古典概念分析及其"突破"', source: '中山大学政治与公共事务管理学院官网', url: 'https://sog.sysu.edu.cn/article/3257', verified: 'primary', themes: ['discipline'] },
  { id: 'k2024a', date: '2024-05-10', form: '讲座', venue: '华中师大讲座 · 开拓当代中国政府与政治研究的新视野', source: '华中师范大学政治与国际关系学院官网', url: 'https://politics.ccnu.edu.cn/info/1289/10574.htm', verified: 'primary', themes: ['partystate', 'discipline'] },
  { id: 'k2024b', date: '2024-06-06', form: '讲座', venue: '清华大学社科大讲堂第四讲 · 萨托利与比较政治中的概念分析', source: '清华大学人文学院官网', url: 'https://www.rwxy.tsinghua.edu.cn/info/1162/9286.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2024c', date: '2024-06', form: '讲座', venue: '南京大学第八届政治概念研究工作坊主题发言', source: '南京大学政府管理学院官网', url: 'https://public.nju.edu.cn/sy/xyxw/20240628/i269422.html', verified: 'primary', themes: ['discipline', 'democracy'] },
  { id: 'k2024d', date: '2024-11-21', form: '讲座', venue: '武汉大学珞珈政治学论坛 · 中国政治研究的两种概念范式', source: '武汉大学政治与公共管理学院官网', url: 'https://www.pspa.whu.edu.cn/info/1137/7641.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2024e', date: '2024-12-12', form: '讲座', venue: '清华大学政治学系"学心"读书会 ·《当代中国政府与政治》', source: '清华大学政治学系官网', url: 'https://www.dps.tsinghua.edu.cn/info/1197/3252.htm', verified: 'primary', themes: ['partystate'] },
  { id: 'k2025a', date: '2025-01', form: '论文', venue: '景跃进、张丽娜《中国政治研究的两种概念范式——复盘萨托利与邹谠的概念研究》，《西华师范大学学报（哲社版）》2025 年第 1 期，第 1—17 页', source: '《西华师范大学学报》（爱思想全文转载；与张丽娜合作）', url: 'https://www.aisixiang.com/data/163113.html', verified: 'primary', themes: ['discipline', 'democracy'] },
  { id: 'k2025b', date: '2025-04-18', form: '署名文章', venue: '陈国权等《广义政府与功能性分权理论》序', source: '清华大学政治学系官网', url: 'https://www.dps.tsinghua.edu.cn/info/1198/3352.htm', verified: 'primary', themes: ['bringparty', 'partystate'] },
  { id: 'k2025c', date: '2025-11-08', form: '讲话', venue: '华东师大 ·《政治学研究》"自主知识生产与中国政治学的分析范式"研讨会发言', source: '华东师范大学政治与国际关系学院官网（会议报道）', url: 'https://polis.ecnu.edu.cn/en/a/1569', verified: 'primary', themes: ['discipline'] },
  { id: 'k2025d', date: '2025-12-14', form: '讲话', venue: '第七届中国政治学知识体系论坛发言 · 中国政治学知识体系的构成与类型', source: '中国人民大学国家发展与战略研究院官网（会议报道）', url: 'http://www.sgas.ruc.edu.cn/xwgg/yjyxw/e093f7468c2a406f85363b059ca8a07c.htm', verified: 'primary', themes: ['discipline'] },
  { id: 'k2026', date: '2026-01', form: '论文', venue: '《比较政治学视野下的中国经验——三种角色的嬗变及其挑战》，《理论与改革》2026 年第 1 期', source: '《理论与改革》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/175122.html', verified: 'primary', themes: ['discipline', 'democracy'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 党政体制与党政关系 ——
  { id: 'p1', k: 'k2016', theme: 'partystate', type: '原话', text: '中国共产党是中华人民共和国的领导核心，是当代中国政治体制的中轴。' },
  { id: 'p2', k: 'k2016', theme: 'partystate', type: '原话', text: '在中国政治的结构中，它是一个常量，而不是变量。' },
  { id: 'p3', k: 'k2016', theme: 'partystate', type: '原话', text: '党政体制的奥秘在于，作为一个复合体，它既超越了政党组织的逻辑，也超越了政府组织的逻辑。' },
  { id: 'p4', k: 'k2016', theme: 'partystate', type: '原话', text: '认识中国政治不但要读宪法，也要看党章；不但要了解国家法律和行政法规，也要了解党内法规和党委文件' },
  { id: 'p5', k: 'k2016', theme: 'partystate', type: '原话', text: '“一套人马、两块牌子”的现象意味着，党政体制中的政府系统的职能是不完整的。' },
  { id: 'p6', k: 'k2016', theme: 'partystate', type: '转述', text: '把党的科层组织嵌入并重组政府结构的方式归纳为六种：党组、归口管理（"口"）、领导小组、交叉任职、一个机构两块牌子、合署办公；由此形成双重官僚制，但并不构成二元结构。' },
  { id: 'p7', k: 'k2016', theme: 'partystate', type: '转述', text: '选用"党政体制"而不用"党国体制"，理由之一是后者在西方语境中带有较强的价值负载；"党政体制"更适合作为描述性、分析性概念。' },
  { id: 'p8', k: 'k2005a', theme: 'partystate', type: '转述', text: '从村党支部书记与村委会主任"一肩挑"等基层实践出发，讨论党、国家与社会三者关系的中国特点（据论文摘录）。' },
  { id: 'p9', k: 'k2011c', theme: 'partystate', type: '转述', text: '讨论市场转型与社会分化带来的挑战下，执政党组织技术如何通过吸纳新兴社会群体、向新领域渗透来调整，并指出其中的问题（据摘要）。' },

  // —— 将政党带进来 ——
  { id: 'b1', k: 'k2019a', theme: 'bringparty', type: '原话', text: '西方政党是市民社会的组成部分，而中共的位置在国家中构成了公权力的组成部分。' },
  { id: 'b2', k: 'k2019a', theme: 'bringparty', type: '原话', text: '在党国体制中，党对国家的全面渗透是一个基本事实，但是这一事实本身并不构成在逻辑上和概念上将党归入国家范畴的理由' },
  { id: 'b3', k: 'k2019a', theme: 'bringparty', type: '原话', text: '党国体制无法实行百分之百的党政分开；另一方面，也无法实现完全的党政融合，它只能在脱离两极的居中状态里移动。' },
  { id: 'b4', k: 'k2019a', theme: 'bringparty', type: '原话', text: '政党、政府与社会三分法是指导经验研究的分析性工具，而不是用来套经验事实的罩子。' },
  { id: 'b5', k: 'k2019a', theme: 'bringparty', type: '原话', text: '“将政党带进来”是一种方法论意义上的学术主张，它带来了概念范畴的一场“革命”，但并不提供现成的操作工具' },
  { id: 'b6', k: 'k2019a', theme: 'bringparty', type: '原话', text: '政党与政府关系的紧密程度与政党作为独立分析变量的可能性之间大致呈现一种反向关系。' },
  { id: 'b7', k: 'k2019a', theme: 'bringparty', type: '转述', text: '主张把国家—社会二分法调适为政党、政府与社会三分法，原先单维关系扩展为政党—社会、政府—社会、政党—政府三组关系，并辨析若干具体类型供经验研究选用。' },
  { id: 'b8', k: 'k2025b', theme: 'bringparty', type: '原话', text: '所以不是将政党“带回来”，而是将政党“带进来”。' },
  { id: 'b9', k: 'k2025b', theme: 'bringparty', type: '原话', text: '事实上，“广义政府”更换了中国社会科学知识体系大厦的基石，对政治学和法学的知识传统提出了结构性挑战。' },
  { id: 'b10', k: 'k1992', theme: 'bringparty', type: '转述', text: '早年与邓正来合撰，以国家与市民社会关系为框架，主张建构中国市民社会并形成二者的良性互动（合著，据他文引述）。' },

  // —— 基层民主与乡村治理 ——
  { id: 'g1', k: 'k2018', theme: 'grassroots', type: '原话', text: '村干部行政化依然是一种“选择性行政化”——在维持行政村组织法律性质不变的前提下，在局部领域注入政府官僚制的因子。' },
  { id: 'g2', k: 'k2018', theme: 'grassroots', type: '原话', text: '在逻辑类型上，“选择性行政化”可以视为“政权下乡”的一个特殊变体，是一种不完整的政府官僚制化过程。' },
  { id: 'g3', k: 'k2018', theme: 'grassroots', type: '原话', text: '应当鼓励和允许各地根据自身的条件，采取不同的、适合本地情况的治理结构。从央地关系/府间关系的角度来看，也应当适度下放乡镇和行政村设置和管理权限，尽量减少体制层面的一刀切。' },
  { id: 'g4', k: 'k2018', theme: 'grassroots', type: '转述', text: '认为农业税费改革与城乡资源配置逆转后，国家权力以项目、下派第一书记、加强基层党建、财政支付村干部报酬等方式进入乡村；同时各地在自然村层面探索新的自治形式。' },
  { id: 'g5', k: 'k2017', theme: 'grassroots', type: '转述', text: '与张丽娜合作，考察村干部角色与行为的制度空间如何从村民自治演变到以"权力清单"规范（合著结论，据题录摘要）。' },
  { id: 'g6', k: 'k2007', theme: 'grassroots', type: '转述', text: '以东北某村主任"我与村支书谁大"的发问为例，说明村两委冲突背后是选举式代表与党组织代表两种代表逻辑的碰撞。' },
  { id: 'g7', k: 'k2005b', theme: 'grassroots', type: '转述', text: '认为村民自治把"选举"这一变量引入了群众路线，是群众路线在机制上的转换。' },

  // —— 代表理论·群众路线·选举技术 ——
  { id: 'r1', k: 'k2007', theme: 'represent', type: '原话', text: '可以说，没有选举就没有代表。' },
  { id: 'r2', k: 'k2007', theme: 'represent', type: '原话', text: '党的先锋队所体现的“规律-使命式”代表要优越于经由选举产生的人民代表大会制度的代表性。' },
  { id: 'r3', k: 'k2007', theme: 'represent', type: '转述', text: '区分两种代表理论：以掌握历史规律、承担使命为依据的"规律—使命式"代表，与以授权—问责为依据的选举式代表，并以此解释人大与党组织关系中的结构性张力。' },
  { id: 'r4', k: 'k2005b', theme: 'represent', type: '原话', text: '群众路线不能光停留在工作作风的层次上，它必须经历一个的制度化的过程，从而成为不以领导人个人意志为转移的行为规则。' },
  { id: 'r5', k: 'k2005b', theme: 'represent', type: '原话', text: '群众路线实行得最好的时刻，党最有生气的时刻，往往是党面临危机的时刻。' },
  { id: 'r6', k: 'k2004a', theme: 'represent', type: '原话', text: '民主化压力越大，需要控制的冲动就越强，采取的办法就越是生硬而强制，付出的控制成本以及带来的负面效应也就越大。' },
  { id: 'r7', k: 'k2004a', theme: 'represent', type: '转述', text: '主张改进乡镇国家机关领导人员候选人的提名程序，通过选举技术的渐进改良来协调党管干部原则与选举程序之间的张力。' },

  // —— 民主理论与民主化序列 ——
  { id: 'd1', k: 'k2011b', theme: 'democracy', type: '原话', text: '选举(权力来源)固然是政府与民众之间建立回应关系的重要环节，但它不是唯一的；在这一点上，达尔在《多头政体》一书建构的论述逻辑过于绝对了。在权力行使(公共政策)的环节，我们同样可以建立起强固的政府对公众的回应关系。' },
  { id: 'd2', k: 'k2021b', theme: 'democracy', type: '原话', text: '因为只有建构出真正意义上的普遍民主理论，我们才能把西方的原型民主锚定在特殊类型的地位上。' },
  { id: 'd3', k: 'k2021b', theme: 'democracy', type: '原话', text: '它是西方民主的衡量标准，但不是民主政体的衡量标准。' },
  { id: 'd4', k: 'k2022', theme: 'democracy', type: '原话', text: '这一概念转换并没有忽视不同政体之间的重要差别，但是这种差别不再是零和博弈的对抗性关系，它将水平层面的二分法转化为同一民主范畴下的亚类型，将原先不同阵营的敌对关系转化为民主阵营的内部关系。' },
  { id: 'd5', k: 'k2021b', theme: 'democracy', type: '转述', text: '认为民主的普遍性至少包括三条：人民主权（权力来源）、公民的普遍参与、政府对民众需求的回应；竞争性选举只是区分亚类型的二级标准。' },
  { id: 'd6', k: 'k2022', theme: 'democracy', type: '转述', text: '主张以"三位一体"超越民主—威权二分：民主政体居于上位，西式民主与中式民主作为并列的亚类型。' },
  { id: 'd7', k: 'k2003', theme: 'democracy', type: '转述', text: '以温岭"民主恳谈会"为例讨论行政民主（在权力行使环节引入公众参与）的意义与局限（据题录）。' },

  // —— 中国政治学学科建设与概念方法 ——
  { id: 's1', k: 'k2021a', theme: 'discipline', type: '原话', text: '理论建构的基础是经验的，但理论得以确立的依据是价值的；同样道理，理论建构的出发点是中国的，但其指向必定是世界的。' },
  { id: 's2', k: 'k2026', theme: 'discipline', type: '原话', text: '“生理分析”的一个基本假定是，当代中国政制不是所谓的病态或变态政体，而是在中国现代化历史进程中自然形成的、不同于西方的常态政体。' },
  { id: 's3', k: 'k2026', theme: 'discipline', type: '原话', text: '从“病理分析”转向“生理分析”是发生在中国政治学界的一件具有分水岭意义的大事。' },
  { id: 's4', k: 'k2025a', theme: 'discipline', type: '原话', text: '“穹概念+亚类型”，即通过设置穹概念（或对既有穹概念做出新阐释）来建构或重构普遍性，通过设置亚类型来展现特殊性。' },
  { id: 's5', k: 'k2025a', theme: 'discipline', type: '原话', text: '在这个意义上，仅仅“将邹谠带回来”是不够的，还需要超越邹谠' },
  { id: 's6', k: 'k2026', theme: 'discipline', type: '转述', text: '把比较政治学中的中国经验概括为三种角色的嬗变：改造对象、分析对象、理论创新来源；对应从"病理分析"（改善型/否定型）到"生理分析"的转向。' },
  { id: 's7', k: 'k2021a', theme: 'discipline', type: '转述', text: '把中国政治学理论建构视为"五重奏"：解释中国政治的知识体系、重构比较政治学框架、中国价值观、普遍价值知识、国际关系理论五项任务相互交织。' },
  { id: 's8', k: 'k2025c', theme: 'discipline', type: '转述', text: '据主办方报道：以"中国式现代化"的构词为例，提出"开发特殊性、重构普遍性"；重构普遍性不是否定普遍价值，而是拒绝西方对普遍性的垄断。' },
  { id: 's9', k: 'k2025d', theme: 'discipline', type: '转述', text: '据主办方报道：讨论中国政治学知识体系的构成与类型，认为面对西方时应强调特殊性，面对全球南方时则需提炼可供参考的普遍性成分。' },
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

export const FEATURED = ['p3', 'p4', 'b1', 'b5', 'g1', 'r2', 'd2', 's3'];

export const THEME_LINKS = {
  partystate: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/govsystem', label: '政府体系' }],
  bringparty: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/leadership', label: '领袖统治' }],
  grassroots: [{ to: '/rural', label: '乡村振兴' }, { to: '/governance', label: '治理现代化' }],
  represent: [{ to: '/principalagent', label: '委托代理' }, { to: '/talent', label: '人才精英库' }],
  democracy: [{ to: '/ideology', label: '意识形态' }, { to: '/reform', label: '改革开放' }],
  discipline: [{ to: '/ideology', label: '意识形态' }, { to: '/policydocs', label: '政令文库' }],
};

export const THEME_INTRO = {
  partystate: '2016 年主编教材导论以"党政体制"刻画当代中国政治结构：党是政治体制的中轴与常量，通过党组、归口、领导小组、合署办公等方式嵌入并重组政府；主张认识中国政治须同时读宪法与党章。',
  bringparty: '最具辨识度的一条线：2019 年《将政党带进来》指出中共位于国家之中而非市民社会之中，主张把国家—社会二分改为政党—政府—社会三分；2025 年再申"不是带回来而是带进来"，并称"广义政府"更换了知识体系的基石。',
  grassroots: '早年研究村民自治与村"两委关系"；2018 年把税费改革后的村干部行政化概括为"选择性行政化"，并主张允许各地采用不同的村庄治理结构、减少一刀切。',
  represent: '2007 年区分"规律—使命式"代表与选举式代表，以此解释党组织与人大、村支书与村主任之间的结构张力；2004—2005 年讨论选举技术改良与群众路线制度化。',
  democracy: '主张民主回应不只来自选举（权力来源），也可在权力行使环节建立；2021—2022 年提出以"三位一体"超越民主—威权二分，把西式民主降为与中式民主并列的亚类型。',
  discipline: '长期参与政治学教材与学科建设；近年以萨托利与邹谠的概念研究为线索，提出"穹概念+亚类型"，并把中国政治学的转向概括为从"病理分析"到"生理分析"。',
};

// ============================================================================
// 命题检验台账：核心命题 × 其后的制度演进（对照截至核验日）
// "一致"仅指制度走向与命题相符，不代表因果归功于本人；结构性命题优先记为未决。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2016-01', venue: '《当代中国政府与政治》导论（爱思想摘编）',
    url: 'https://www.aisixiang.com/data/105836.html',
    claim: '“一套人马、两块牌子”的现象意味着，党政体制中的政府系统的职能是不完整的。',
    check: '2018-02-28 十九届三中全会通过《中共中央关于深化党和国家机构改革的决定》：党的有关机构可以同职能相近、联系紧密的其他部门统筹设置，实行合并设立或合署办公；国家监察委员会同中央纪委合署办公。党政机构统合的制度化与其对党政体制结构的描述一致；一致不代表归功。',
    dataSrc: '中国政府网 2018-03-04 刊发《中共中央关于深化党和国家机构改革的决定》',
  },
  {
    id: 'L2', status: 'open', type: '原话', date: '2019-08', venue: '《探索与争鸣》2019 年第 8 期',
    url: 'https://www.tsyzm.cn/CN/Y2019/V1/I8/85',
    claim: '党国体制无法实行百分之百的党政分开；另一方面，也无法实现完全的党政融合，它只能在脱离两极的居中状态里移动。',
    check: '2023-03 中共中央、国务院印发《党和国家机构改革方案》，组建中央社会工作部作为党中央职能部门，统一领导国家信访局，国家信访局同时调整为国务院直属机构。党的统合进一步加强，但政府序列机构仍然保留。截至核验日与"居中状态"判断一致，但这是结构性的"只能"命题，无法以单次改革闭环，记为未决。',
    dataSrc: '中国政府网 2023-03-16《党和国家机构改革方案》',
  },
  {
    id: 'L3', status: 'done', type: '原话', date: '2016-01', venue: '《当代中国政府与政治》导论（爱思想摘编）',
    url: 'https://www.aisixiang.com/data/105836.html',
    claim: '认识中国政治不但要读宪法，也要看党章；不但要了解国家法律和行政法规，也要了解党内法规和党委文件',
    check: '2021-08 中共中央办公厅法规局发布《中国共产党党内法规体系》：截至 2021-07-01 现行有效党内法规共 3615 部，宣布已形成比较完善的党内法规体系；2018-03-11 宪法修正案在第一条增写"中国共产党领导是中国特色社会主义最本质的特征"。党内法规与国家法律并行的双轨格局得到制度确认；一致不代表归功。',
    dataSrc: '人民网 2021-08-04《中国共产党党内法规体系》；新华网 2018-03-11 宪法修正案',
  },
  {
    id: 'L4', status: 'open', type: '原话', date: '2018-01', venue: '《治理研究》2018 年第 1 期',
    url: 'http://journal08.magtech.org.cn/Jwk3_zlyj/CN/Y2018/V34/I1/48',
    claim: '应当鼓励和允许各地根据自身的条件，采取不同的、适合本地情况的治理结构……尽量减少体制层面的一刀切。',
    check: '一方面，2016-10 中办国办印发的村民小组/自然村村民自治试点方案（厅字〔2016〕31 号）仍在推进；另一方面，2018-12-29 全国人大常委会修改《村民委员会组织法》，把村委会任期由 3 年改为 5 年，与党组织任期统一；2020—2021 年村两委换届后，"一肩挑"比例达 95.6%（中组部 2022-05）。制度走向既有试点多样化，也有统一化，记为未决。',
    dataSrc: '中国人大网 2018-12-29 修改决定；人民网 2022-05-23 中组部发布会；中办国办 2016 年试点方案',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2018-01', venue: '《治理研究》2018 年第 1 期',
    url: 'http://journal08.magtech.org.cn/Jwk3_zlyj/CN/Y2018/V34/I1/48',
    claim: '村干部行政化依然是一种“选择性行政化”——在维持行政村组织法律性质不变的前提下，在局部领域注入政府官僚制的因子。',
    check: '2018 年修正后的《村民委员会组织法》仍将村委会定位为基层群众性自治组织，法律性质未变；同期村党组织书记通过法定程序兼任村委会主任（2019《中国共产党农村基层组织工作条例》；换届后"一肩挑"达 95.6%），行政与党建要素继续在局部注入。截至核验日与"选择性"判断一致；一致不代表归功。',
    dataSrc: '中国人大网 2018-12-29；人民网 2022-05-23 中组部发布会',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2005-03', venue: '《浙江社会科学》2005 年第 2 期',
    url: 'https://www.aisixiang.com/data/23540.html',
    claim: '群众路线不能光停留在工作作风的层次上，它必须经历一个的制度化的过程，从而成为不以领导人个人意志为转移的行为规则。',
    check: '2015-02-09 中共中央印发《关于加强社会主义协商民主建设的意见》，称协商民主"是党的群众路线在政治领域的重要体现"，并提出推进协商民主广泛多层制度化发展。制度化方向与其主张相近，但群众路线在多大程度上成为"不以领导人个人意志为转移"的规则难以衡量，记为未决。',
    dataSrc: '新华网 2015-02-09《关于加强社会主义协商民主建设的意见》全文',
  },
  {
    id: 'L7', status: 'done', type: '原话', date: '2011-03', venue: '《新视野》2011 年第 2 期',
    url: 'https://www.aisixiang.com/data/53434.html',
    claim: '在权力行使(公共政策)的环节，我们同样可以建立起强固的政府对公众的回应关系。',
    check: '2015-02 中共中央协商民主意见部署政府协商、基层协商等渠道；2021-12-04 国务院新闻办公室《中国的民主》白皮书提出全过程人民民主"使选举民主和协商民主这两种重要民主形式更好结合起来"。官方民主叙事把重心放在决策与施政环节的参与，与其主张方向一致；一致不代表归功。',
    dataSrc: '新华网 2015-02-09；中国政府网 2021-12-04《中国的民主》白皮书',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2021-12-20', venue: '北京日报客户端署名文章',
    url: 'https://www.tsinghua.edu.cn/info/1662/90301.htm',
    claim: '因为只有建构出真正意义上的普遍民主理论，我们才能把西方的原型民主锚定在特殊类型的地位上。',
    check: '2021-12-04《中国的民主》白皮书称全过程人民民主"既有鲜明的中国特色，也体现全人类共同价值"。官方话语与其"重构普遍性"的方向相近，但"普遍民主理论"属学术建构任务，是否被国际学界接受没有可检验的终点，记为未决。',
    dataSrc: '中国政府网 2021-12-04《中国的民主》白皮书',
  },
  {
    id: 'L9', status: 'done', type: '原话', date: '2007-05', venue: '《社会科学研究》2007 年第 3 期',
    url: 'https://www.rmlt.com.cn/2016/1019/442588.shtml',
    claim: '党的先锋队所体现的“规律-使命式”代表要优越于经由选举产生的人民代表大会制度的代表性。',
    check: '这是对既有政治实践的描述性判断。2018-03-11 宪法修正案第一条第二款增写"中国共产党领导是中国特色社会主义最本质的特征"；2018-12 修改《村民委员会组织法》，使村委会任期与村党组织一致，常委会审议报告称此举旨在"坚持和加强党的全面领导"。两种代表在制度位阶上的排序由此进一步明文化；一致不代表归功。',
    dataSrc: '新华网 2018-03-11 宪法修正案；中国人大网 2018-12-29 宪法和法律委员会审议结果报告',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2025-11-08', venue: '华东师大 ·《政治学研究》研讨会（主办方报道）',
    claim: '以"开发特殊性、重构普遍性"推进中国政治学自主知识生产',
    check: '2025-10 二十届四中全会审议通过的《中共中央关于制定国民经济和社会发展第十五个五年规划的建议》提出"创新实施马克思主义理论研究和建设工程，加快构建中国哲学社会科学自主知识体系"（据中央党史和文献研究院网 2025-12-19 文章援引《建议》原文）。政策方向与其学术议程一致，但知识体系是否建成没有明确检验标准，记为未决。',
    dataSrc: '《中共中央关于制定国民经济和社会发展第十五个五年规划的建议》（中央党史和文献研究院网 2025-12-19 援引）；华东师范大学政治与国际关系学院会议报道（2025-11）',
  },
];

// 景跃进公开表述以概念与机制分析为主，少见可与官方统计直接比对的数值口径，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '党政体制', '将政党带进来', '基层治理', '代表与民主', '概念方法'],
  nodes: [
    { id: 'core', name: '政党—政府—社会\n的中国分析', cat: 0, size: 58 },
    { id: 'dangzheng', name: '党政体制', cat: 1, size: 40 },
    { id: 'zhongzhou', name: '中轴 / 常量', cat: 1, size: 26 },
    { id: 'qianru', name: '六种嵌入方式', cat: 1, size: 26 },
    { id: 'shuangguan', name: '双重官僚制', cat: 1, size: 24 },
    { id: 'paizi', name: '一套人马两块牌子', cat: 1, size: 22 },
    { id: 'bring', name: '将政党带进来', cat: 2, size: 40 },
    { id: 'sanfen', name: '政党—政府—社会三分法', cat: 2, size: 30 },
    { id: 'zaiguo', name: '政党在国家中', cat: 2, size: 26 },
    { id: 'juzhong', name: '党政分合的居中状态', cat: 2, size: 24 },
    { id: 'fanxiang', name: '党政紧密度—政党变量反向关系', cat: 2, size: 22 },
    { id: 'xuanze', name: '选择性行政化', cat: 3, size: 34 },
    { id: 'xiaxiang', name: '政权下乡的特殊变体', cat: 3, size: 22 },
    { id: 'liangwei', name: '两委关系', cat: 3, size: 26 },
    { id: 'ziran', name: '自然村自治', cat: 3, size: 20 },
    { id: 'guilv', name: '规律—使命式代表', cat: 4, size: 30 },
    { id: 'xuanju', name: '选举式代表', cat: 4, size: 26 },
    { id: 'qunzhong', name: '群众路线制度化', cat: 4, size: 24 },
    { id: 'laiyuan', name: '权力来源 / 权力行使', cat: 4, size: 26 },
    { id: 'sanwei', name: '民主三位一体', cat: 4, size: 26 },
    { id: 'qiong', name: '穹概念+亚类型', cat: 5, size: 32 },
    { id: 'shengli', name: '病理分析→生理分析', cat: 5, size: 28 },
    { id: 'wuchong', name: '理论建构五重奏', cat: 5, size: 22 },
  ],
  links: [
    ['core', 'dangzheng'], ['core', 'bring'], ['core', 'xuanze'], ['core', 'guilv'], ['core', 'qiong'],
    ['dangzheng', 'zhongzhou'], ['dangzheng', 'qianru'], ['dangzheng', 'shuangguan'], ['qianru', 'paizi'],
    ['bring', 'sanfen'], ['bring', 'zaiguo'], ['bring', 'juzhong'], ['bring', 'fanxiang'], ['dangzheng', 'bring'],
    ['juzhong', 'dangzheng'], ['xuanze', 'xiaxiang'], ['xuanze', 'liangwei'], ['xuanze', 'ziran'],
    ['liangwei', 'guilv'], ['liangwei', 'xuanju'], ['guilv', 'xuanju'], ['guilv', 'qunzhong'],
    ['laiyuan', 'sanwei'], ['xuanju', 'laiyuan'], ['sanwei', 'qiong'], ['qiong', 'shengli'], ['shengli', 'wuchong'],
    ['sanfen', 'liangwei'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '国家—社会二分还是政党—政府—社会三分',
    sides: [
      { who: '邓正来、景跃进（《中国社会科学季刊》1992 年创刊号）', view: '转述：以国家与市民社会的二元关系为框架，主张建构中国市民社会并形成与国家的良性互动；这是 1990 年代国家—社会范式的代表性起点之一。' },
      { who: '国家—社会二分法的"党国同一"用法（景跃进 2019 年文中概括）', view: '转述：鉴于党对国家的全面渗透，把党与国家视为同一分析单元，沿用国家—社会二分即可。' },
      { who: '景跃进（《探索与争鸣》2019 年第 8 期）', view: '转述：全面渗透不构成把党归入国家范畴的理由，党在组织与功能上保持相对独立，应将二分法调适为三分法；文中也承认三分法"不提供现成的操作工具"，是否把政党作为独立变量取决于具体场景。' },
    ],
    note: '景跃进本人即 1992 年市民社会框架的合作者，2019 年文属自我修正与范式对话；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '如何命名与分析党—国复合结构',
    sides: [
      { who: '景跃进（《当代中国政府与政治》导论，2016）', view: '转述：采用中性的"党政体制"，认为"党国体制"一词附带价值负载；以党组、归口、领导小组等六种嵌入方式描述党政关系。' },
      { who: '陈明明（《作为一种政治形态的政党-国家及其对中国国家建设的意义》，《江苏社会科学》2015 年第 2 期）', view: '转述：以"政党-国家"作为一种政治形态，讨论其对中国国家建设的意义，偏重历史形成与国家建设功能。' },
      { who: '杨光斌（《制度变迁中的政党中心主义》，《西华大学学报（哲社版）》2010 年第 2 期）', view: '转述：在社会中心主义、国家中心主义之外提出"政党中心主义"，同样批评国家—社会二分对中国的解释力，但以政党为中心而非三分并置。' },
      { who: '陈国权等"广义政府"论（景跃进 2025 年序文所引）', view: '转述：主张中国实质上的国家由党和国家共同构成，"广义政府"指复合国家的机构之和；景跃进作序予以肯定，认为其更换了知识体系的基石。' },
    ],
    note: '各家对"党—国"关系的事实判断相近，分歧主要在命名与分析单位（党政体制 / 政党-国家 / 政党中心 / 广义政府）；本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '村干部是否已经官僚化',
    sides: [
      { who: '欧阳静（《村级组织的官僚化及其逻辑》，《南京农业大学学报（社科版）》2010 年第 4 期）', view: '转述：认为村级组织在形式与实质上都已发展为具有显著官僚制特征的行政组织。' },
      { who: '景跃进（《治理研究》2018 年第 1 期）', view: '转述：理解上述判断的经验基础，但认为其"过于激进"；行政村的法律性质未变，村干部行政化只是局部注入官僚制因子的"选择性行政化"。' },
      { who: '徐勇（《村干部的双重角色：代理人与当家人》，1997）', view: '转述：村干部同时扮演政府代理人与村庄当家人双重角色，是讨论行政化程度的常用参照框架。' },
    ],
    note: '欧阳静一文由景跃进 2018 年文直接引述并回应；徐勇框架作为背景并列。本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '"中国政治学会副会长"头衔', status: '不收录', reason: '2025-12-13 中国政治学会第十届理事会副会长名单中未见其名；此前各届任职情况未检索到可靠出处，故不写入现职。' },
  { id: 'q2', item: '"曾任清华大学政治学系主任"', status: '更正', reason: '清华官网 2011、2019、2021 年页面均称其为系副主任，未见任系主任的记载。' },
  { id: 'q3', item: '《当代中国政府与政治》合编者', status: '更正', reason: '部分转述误作"景跃进、张小劲主编"；出版社书目与 2024 年第二版信息均为景跃进、陈明明、肖滨主编。' },
  { id: 'q4', item: '调入清华年份', status: '并陈', reason: '清华简历人大任职止于 2008 年；北大文研院讲座简介作"2009 年调入清华"。' },
  { id: 'q5', item: '籍贯', status: '并陈', reason: '清华个人页作祖籍浙江萧山；部分简介作"浙江嘉兴人"。' },
  { id: 'q6', item: '哥伦比亚大学富布赖特访学时间', status: '并陈', reason: '清华简历作 2005-09 至 2006-07；北大文研院简介作 2004—2005 年度。' },
  { id: 'q7', item: '在职 / 退休状态', status: '〔存疑〕', reason: '2024-06 清华人文学院社科大讲堂页面称"政治学系退休教授"，其他近年页面仍称"教授"；未见官方退休公告。' },
  { id: 'q8', item: '《如何认识中国政治？》（2010，网传爱思想/共识网文章）', status: '不收录', reason: '仅见陈明明 2015 年文引注，未找到可访问的原文链接，不作为引文来源。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
