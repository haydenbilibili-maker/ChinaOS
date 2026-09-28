// ============================================================================
// 学者专栏 · 周雪光 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"周雪光认为"而无原文可溯者一律不收录。
// 合著论文的结论标注合作者，不单独归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  unity: { label: '一统体制与有效治理', color: '#c41e3a' },
  empire: { label: '中央地方关系与帝国逻辑', color: '#8b5cf6' },
  collusion: { label: '官僚行为：共谋·变通·逆向软预算', color: '#22d3ee' },
  campaign: { label: '运动型治理', color: '#e8a317' },
  control: { label: '控制权理论与政府内部关系', color: '#10b981' },
  history: { label: '官僚制传统与人事制度', color: '#fb923c' },
  method: { label: '组织社会学方法与大转型', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '周雪光',
  born: '出生年份与籍贯未见官方简历载明〔存疑〕',
  summary:
    '复旦大学国际政治系学士（1982），1981 年参加南开大学社会学班培训；斯坦福大学社会学硕士（1985）、博士（1991）。1991—1994 年任康奈尔大学社会学系助理教授，1994—2006 年任教杜克大学（助理教授→副教授→教授），2004—2005 年任香港科技大学组织管理系教授兼系主任，2006 年起任斯坦福大学社会学系教授，2010 年起任 Kwoh-Ting Li 经济发展讲座教授。2004—2015 年在中国北方一个乡镇从事田野研究。2008 年提出基层政府间"共谋现象"，2011 年提出"权威体制与有效治理"的矛盾，2012 年提出"运动型治理机制"并与练宏合作提出"控制权"理论，2014 年以"帝国的逻辑"解读中国国家治理的历史线索；2017 年结集为《中国国家治理的制度逻辑》，2022 年剑桥大学出版社英文版刊行。近年转向官僚体制的历史渊源（官吏分途、黄仁宇悖论、差序格局）与官员人事流动的大数据研究。',
  current: [
    '斯坦福大学社会学系教授、Kwoh-Ting Li 经济发展讲座教授',
    '斯坦福大学弗里曼·斯伯格里国际问题研究所（FSI）高级研究员',
    '斯坦福大学东亚研究中心（CEAS）主任（2024 年起）',
    '北京大学人文社会科学研究院学术委员（据 2025 年讲座介绍）',
  ],
  sources: '斯坦福大学社会学系与 FSI 个人页；斯坦福 CAP 简历（2013-03 版）；斯坦福东亚研究中心治理页；北京大学文研院邀访学者介绍；MOR 2025 作者简介；百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 17,
  subtitle: '一统体制与有效治理 · 帝国逻辑 · 运动型治理 · 控制权理论 · 共谋与变通',
  span: '1992—2026',
  careerTitle: '履历时间线 · 复旦 → 斯坦福 → 康奈尔 → 杜克 → 港科大 → 斯坦福',
  defaultTheme: 'unity',
  moduleId: 'scholarZhouXueguang',
  sourceNote: '期刊论文原文 / 学术著作 / 主办方讲座报道 / 访谈整理稿 · 对照文件：中共中央、国务院、中办国办、全国人大',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  study: { label: '求学', color: '#8b5cf6' },
  us: { label: '美国 / 香港教职', color: '#22d3ee' },
  stanford: { label: '斯坦福', color: '#c41e3a' },
  visit: { label: '访学 / 兼职', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '复旦大学国际政治系本科（1981 年参加南开大学社会学班培训）', org: '复旦大学', start: 1978.7, end: 1982.5, group: 'study', note: '1982 年获学士学位；入学年份未见官方简历载明〔存疑〕' },
  { id: 'c2', role: '复旦大学社会学教员（Instructor）', org: '复旦大学', start: 1982.5, end: 1983.5, group: 'us', note: '斯坦福简历作 1982—1983，月份取年中近似' },
  { id: 'c3', role: '斯坦福大学社会学系硕士、博士研究生', org: 'Stanford', start: 1983.7, end: 1991.5, group: 'study', note: '1985 年获硕士、1991 年获博士；入学年份未见简历载明〔存疑〕' },
  { id: 'c4', role: '康奈尔大学社会学系助理教授', org: 'Cornell', start: 1991.5, end: 1994.5, group: 'us' },
  { id: 'c5', role: '杜克大学社会学系助理教授', org: 'Duke', start: 1994.5, end: 1996.5, group: 'us' },
  { id: 'c6', role: '杜克大学社会学系副教授', org: 'Duke', start: 1996.5, end: 2000.5, group: 'us' },
  { id: 'c7', role: '杜克大学社会学系教授', org: 'Duke', start: 2000.5, end: 2006.5, group: 'us' },
  { id: 'c8', role: '香港科技大学组织管理系教授兼系主任', org: 'HKUST', start: 2004.5, end: 2005.5, group: 'us', note: '期间自杜克休假' },
  { id: 'c9', role: '斯坦福大学社会学系教授', org: 'Stanford', start: 2006.5, end: 2026.75, group: 'stanford' },
  { id: 'c10', role: 'Kwoh-Ting Li 经济发展讲座教授', org: 'Stanford', start: 2010.5, end: 2026.75, group: 'stanford' },
  { id: 'c11', role: 'FSI 高级研究员', org: 'Stanford', start: 2006.5, end: 2026.75, group: 'stanford', note: '起始年份未见官方单列，按入职斯坦福近似〔存疑〕' },
  { id: 'c12', role: '斯坦福大学东亚研究中心（CEAS）主任', org: 'Stanford', start: 2024.5, end: 2026.75, group: 'stanford', note: 'CEAS 治理页作"2024-"，月份取年中近似' },
  { id: 'c13', role: '斯坦福行为科学高等研究中心（CASBS）研究员', org: 'CASBS', start: 2008.7, end: 2009.5, group: 'visit' },
  { id: 'c14', role: '北京大学文研院邀访学者', org: '北京大学', start: 2023.7, end: 2024.0, group: 'visit', note: '2023 年秋季学期' },
];

export const BOOKS = [
  { id: 'b1', year: 1992, title: '当代中国的国家与社会关系（主编）', publisher: '台北桂冠图书公司', themes: ['empire'], verified: 'primary', note: '据斯坦福简历著作目录' },
  { id: 'b2', year: 2000, title: 'The Dynamics of Rules: Change in Written Organizational Codes', publisher: 'Stanford University Press', coauthors: 'James G. March、Martin Schulz', themes: ['method'], verified: 'primary', note: '据斯坦福简历著作目录' },
  { id: 'b3', year: 2003, title: '组织社会学十讲', publisher: '社会科学文献出版社（清华社会学讲义）', date: '2003-12', isbn: '9787801901217', themes: ['method'], verified: 'primary' },
  { id: 'b4', year: 2004, title: 'The State and Life Chances in Urban China: Redistribution and Stratification, 1949–1994', publisher: 'Cambridge University Press', isbn: '9780521835077', themes: ['history', 'method'], verified: 'primary', note: '获 2007 年美国社会学会亚洲与亚美研究分会最佳著作奖' },
  { id: 'b5', year: 2010, title: 'Growing Pains: Tensions and Opportunities in China\u2019s Transformation（合编）', publisher: 'Walter H. Shorenstein Asia-Pacific Research Center', coauthors: 'Jean C. Oi、Scott Rozelle', themes: ['unity'], verified: 'primary', note: '据斯坦福简历著作目录' },
  { id: 'b6', year: 2012, title: '国家建设与政府行为（合编）', publisher: '中国社会科学出版社', coauthors: '刘世定、折晓叶', themes: ['collusion', 'control'], verified: 'primary', note: '据斯坦福简历著作目录' },
  { id: 'b7', year: 2015, title: '国家与生活机遇：中国城市中的再分配与分层（1949—1994）', publisher: '中国人民大学出版社', date: '2015-02', isbn: '9787300189901', coauthors: '郝大海等译', themes: ['history'], verified: 'primary', note: 'b4 中译本' },
  { id: 'b8', year: 2017, title: '中国国家治理的制度逻辑：一个组织学研究', publisher: '生活·读书·新知三联书店（三联·哈佛燕京学术丛书）', date: '2017-03', isbn: '9787108058331', themes: ['unity', 'empire', 'collusion', 'campaign', 'control'], verified: 'primary', note: '467 页；作者斯坦福主页提供全文 PDF' },
  { id: 'b9', year: 2022, title: 'The Logic of Governance in China: An Organizational Approach', publisher: 'Cambridge University Press', date: '2022-12-16', isbn: '9781009159418', themes: ['unity', 'empire', 'control'], verified: 'primary', note: 'Cambridge Core 在线日期 2022-12-16；Google Books 另作 2022-10-20、ISBN 9781009179744' },
];

/** 论文 / 讲话 / 采访 / 著作文库 */
export const CORPUS = [
  { id: 'k2005', date: '2005-03', form: '论文', venue: '《“逆向软预算约束”：一个政府行为的组织分析》，《中国社会科学》2005 年第 2 期，第 132—143 页', source: '《中国社会科学》', verified: 'primary', themes: ['collusion'] },
  { id: 'k2008', date: '2008-11', form: '论文', venue: '《基层政府间的“共谋现象”——一个政府行为的制度逻辑》，《社会学研究》2008 年第 6 期，第 1—22 页', source: '《社会学研究》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/23476.html', verified: 'primary', themes: ['collusion', 'unity'] },
  { id: 'k2011', date: '2011-10', form: '论文', venue: '《权威体制与有效治理：当代中国国家治理的制度逻辑》，《开放时代》2011 年第 10 期，第 67—85 页', source: '《开放时代》', verified: 'primary', themes: ['unity'] },
  { id: 'k2011tp', date: '2011-09', form: '论文', venue: '周雪光、练宏《政府内部上下级部门间谈判的一个分析模型——以环境政策实施为例》，《中国社会科学》2011 年第 5 期', source: '《中国社会科学》（与练宏合作；爱思想全文转载）', url: 'https://www.aisixiang.com/data/50286.html', verified: 'primary', themes: ['control'] },
  { id: 'k2012', date: '2012-09', form: '论文', venue: '《运动型治理机制：中国国家治理的制度逻辑再思考》，《开放时代》2012 年第 9 期，第 100—120 页', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/59706.html', verified: 'primary', themes: ['campaign'] },
  { id: 'k2012kz', date: '2012-09', form: '论文', venue: '周雪光、练宏《中国政府的治理模式：一个“控制权”理论》，《社会学研究》2012 年第 5 期，第 69—93 页', source: '《社会学研究》（与练宏合作；中国社会科学院社会学研究所官网 PDF）', url: 'http://sociology.cssn.cn/webpic/web/sociology/upload/2012/12/d20121204104540421.pdf', verified: 'primary', themes: ['control'] },
  { id: 'k2013wb', date: '2013-05', form: '论文', venue: '《国家治理逻辑与中国官僚体制：一个韦伯理论视角》，《开放时代》2013 年第 3 期', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/63991.html', verified: 'primary', themes: ['history'] },
  { id: 'k2013cj', date: '2013-07', form: '论文', venue: 'Zhou, Lian, Ortolano & Ye, "A Behavioral Model of \u2018Muddling Through\u2019 in the Chinese Bureaucracy", The China Journal 70: 120—147', source: 'The China Journal（与练宏、Leonard Ortolano、Yinyu Ye 合作）', verified: 'primary', themes: ['collusion'] },
  { id: 'k2014kf', date: '2014-07', form: '论文', venue: '《从“黄宗羲定律”到帝国的逻辑：中国国家治理逻辑的历史线索》，《开放时代》2014 年第 4 期，第 108—132 页', source: '《开放时代》（作者斯坦福主页 PDF；爱思想转载）', url: 'https://web.stanford.edu/~xgzhou/zhou_14_empire_CH.pdf', verified: 'primary', themes: ['empire'] },
  { id: 'k2014xs', date: '2014-10', form: '论文', venue: '《中国国家治理及其模式：一个整体性视角》，《学术月刊》2014 年第 10 期', source: '《学术月刊》', verified: 'primary', themes: ['unity'] },
  { id: 'k2014sh', date: '2014-11-20', form: '论文', venue: '《行政发包制与帝国逻辑——周黎安〈行政发包制〉读后感》，《社会》2014 年第 34 卷第 6 期，第 39—51 页', source: '《社会》编辑部官网', url: 'https://www.society.shu.edu.cn/CN/Y2014/V34/I6/39', verified: 'primary', themes: ['empire'] },
  { id: 'k2015', date: '2015', form: '采访', venue: '政见 CNPolitics 专访（2015 年组织社会学工作坊后）', source: '政见 CNPolitics（爱思想转载整理稿）', url: 'https://www.aisixiang.com/data/91354.html', verified: 'reprint', themes: ['empire', 'campaign', 'history', 'method'] },
  { id: 'k2016', date: '2016-01', form: '论文', venue: '《从“官吏分途”到“层级分流”：帝国逻辑下的中国官僚人事制度》，《社会》2016 年第 36 卷第 1 期，第 1—33 页', source: '《社会》编辑部官网', url: 'https://www.society.shu.edu.cn/CN/Y2016/V36/I1/1', verified: 'primary', themes: ['history', 'empire'] },
  { id: 'k2017', date: '2017-03', form: '著作', venue: '《中国国家治理的制度逻辑：一个组织学研究》，生活·读书·新知三联书店 2017 年版', source: '三联书店（作者斯坦福主页全文 PDF）', url: 'https://web.stanford.edu/~xgzhou/zhou_book2017.pdf', verified: 'primary', themes: ['unity', 'campaign', 'empire', 'history'] },
  { id: 'k2019ss', date: '2019-01', form: '论文', venue: '《寻找中国国家治理的历史线索》，《中国社会科学》2019 年第 1 期', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/115371.html', verified: 'primary', themes: ['method', 'history'] },
  { id: 'k2019hr', date: '2019-03', form: '论文', venue: '《黄仁宇悖论与帝国逻辑——以科举制为线索》，《社会》2019 年第 39 卷第 2 期，第 1—30 页', source: '《社会》编辑部官网', url: 'https://www.society.shu.edu.cn/CN/Y2019/V39/I2/1', verified: 'primary', themes: ['history', 'empire'] },
  { id: 'k2021mor', date: '2021', form: '论文', venue: '"Chinese Bureaucracy Through Three Lenses: Weberian, Confucian, and Marchian", Management and Organization Review', source: 'Management and Organization Review', verified: 'primary', themes: ['history', 'method'] },
  { id: 'k2021cjs', date: '2021', form: '论文', venue: 'Zhou, Ai, Ge, Gu, Li Ding, Li Lan, Lu, Zhao & Zhu, "The party–government relationship in the Chinese bureaucracy: Evidence from patterns of personnel flow", Chinese Journal of Sociology', source: 'Chinese Journal of Sociology（与艾云、葛建华、顾慧君、李丁、李兰、卢清莲、赵伟、朱灵合作）', url: 'https://journals.sagepub.com/doi/10.1177/2057150X211031055', verified: 'primary', themes: ['history'] },
  { id: 'k2021sh', date: '2021-11', form: '论文', venue: '姚东旻、崔琳、张鹏远、周雪光《中国政府治理模式的选择与转换：一个正式模型》，《社会》2021 年第 41 卷第 6 期，第 41—74 页', source: '《社会》（与姚东旻、崔琳、张鹏远合作）', verified: 'primary', themes: ['control'] },
  { id: 'k2023wy', date: '2023-11-20', form: '讲座', venue: '北大文研讲座第 312 期 · 家产制、科层制与差序格局', source: '北京大学人文社会科学研究院官网', verified: 'primary', themes: ['history'] },
  { id: 'k2023yj', date: '2023-12-06', form: '讲座', venue: '北京大学燕京学堂讲座 · 中国国家治理的制度逻辑', source: '北京大学燕京学堂官网', url: 'https://yenching.pku.edu.cn/info/1039/4773.htm', verified: 'primary', themes: ['unity'] },
  { id: 'k2024', date: '2024-07', form: '论文', venue: '《“差序格局”：一个理想类型的建构与阐释》，《社会学研究》2024 年第 39 卷第 4 期，第 136—157 页', source: '《社会学研究》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/156406.html', verified: 'primary', themes: ['history', 'method'] },
  { id: 'k2025mor', date: '2025-02', form: '论文', venue: 'Zhou & Sui, "What Can the Research on Chinese Bureaucracy Do for Organization Theory?", Management and Organization Review 21(1): 3—20', source: 'Management and Organization Review（与 Yuze Sui 合作；Cambridge Core）', url: 'https://www.cambridge.org/core/journals/management-and-organization-review/article/what-can-the-research-on-chinese-bureaucracy-do-for-organization-theory/F7CD283D1CAD14E38A075C45AF8B1733', verified: 'primary', themes: ['method', 'collusion'] },
  { id: 'k2025jcc', date: '2025-03-04', form: '论文', venue: 'Zhou & Zhu, "Between Centralism and Localism: Dual Mobility Regimes in the Chinese Bureaucracy", Journal of Contemporary China 35(159): 1480—1505', source: 'Journal of Contemporary China（与朱灵合作，同等贡献；在线首发）', url: 'https://doi.org/10.1080/10670564.2025.2471063', verified: 'primary', themes: ['empire', 'history'] },
  { id: 'k2025cufe', date: '2025-05-20', form: '讲座', venue: '中央财经大学讲座 · 大转型时代与现实社会建构', source: '中央财经大学科研处官网', url: 'https://kyc.cufe.edu.cn/info/1082/5218.htm', verified: 'primary', themes: ['method'] },
  { id: 'k2025pku', date: '2025-05-29', form: '讲座', venue: '北大文研讲座第 381 期', source: '北京大学人文社会科学研究院官网', verified: 'primary', themes: ['method'] },
  { id: 'k2026a', date: '2026-03-23', form: '讲座', venue: '中央财经大学"多重视角下的国家治理"系列第一讲 · 从帝国逻辑到民族国家', source: '中央财经大学财政学院官网', url: 'https://ccfd.cufe.edu.cn/info/1071/6236.htm', verified: 'primary', themes: ['empire'] },
  { id: 'k2026b', date: '2026-03-23', form: '讲座', venue: '中央财经大学"多重视角下的国家治理"系列第二讲 · 控制权理论与治理模式转换', source: '中央财经大学财政学院官网', url: 'http://ccfd.cufe.edu.cn/info/1071/6247.htm', verified: 'primary', themes: ['control'] },
  { id: 'k2026c', date: '2026-03-24', form: '讲座', venue: '中央财经大学"多重视角下的国家治理"系列第三讲 · 从"无组织的集体行动"到"虚拟附近"', source: '中央财经大学财政学院官网', url: 'https://ccfd.cufe.edu.cn/info/1071/6248.htm', verified: 'primary', themes: ['method'] },
  { id: 'k2026d', date: '2026-03-31', form: '讲座', venue: '中国人民大学求是讲座第 287 讲 · 中国政府研究对组织学理论的贡献与挑战', source: '中国人民大学公共管理学院官网', url: 'http://spap.ruc.edu.cn/xwdt/df13b2144f82463f94db31cc14453e3a.htm', verified: 'primary', themes: ['collusion', 'control'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；loc 为著作页码；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 一统体制与有效治理 ——
  { id: 'u1', k: 'k2017', loc: '第 10 页', theme: 'unity', type: '原话', text: '在一统体制中，这一矛盾无法得到根本解决，只能在动态中寻找某种暂时的平衡点。' },
  { id: 'u2', k: 'k2017', loc: '第 19 页', theme: 'unity', type: '原话', text: '一统体制的集中程度越高、越刚性，必然以相应程度上削弱地方治理权为代价，其有效治理的能力就会相应减弱；反之，有效治理能力的增强意味着地方政府治理权的扩张，常常表现在—或被解读为—各自为政，又会对一统体制产生巨大威胁。' },
  { id: 'u3', k: 'k2011', theme: 'unity', type: '原话', text: '在这个意义上，有效治理是以弱化权威体制的正式制度为代价的。' },
  { id: 'u4', k: 'k2011', theme: 'unity', type: '转述', text: '提出权威体制与有效治理之间的内在矛盾，并讨论缓解这一矛盾的若干应对机制，如决策一统性与执行灵活性并存、运动型治理、政治教化的礼仪化。' },
  { id: 'u5', k: 'k2023yj', theme: 'unity', type: '转述', text: '据主办方报道：强调上述矛盾内生于体制、没有一劳永逸的解决方案，治理在试错中推进；若信息反馈机制改善，可实现更细致的调适。' },

  // —— 中央地方关系与帝国逻辑 ——
  { id: 'e1', k: 'k2014kf', theme: 'empire', type: '原话', text: '本文的基本立论是：正式与非正式的并存和转化关系是中华帝国治理的核心所在。' },
  { id: 'e2', k: 'k2014kf', theme: 'empire', type: '原话', text: '黄宗羲定律所描述的税收持续高攀趋势并无史实根据，但这一描述中“杂税丛生—并税式改革—杂税丛生”的循环波动在历史上重复出现，是帝国大背景下“放权—收权—放权”周期性波动在税收领域中的具体表现，其中隐藏着解读中华帝国治理逻辑的密码。' },
  { id: 'e3', k: 'k2014kf', theme: 'empire', type: '转述', text: '以委托与代理、正式与非正式、名与实三对关系作为解读帝国治理逻辑的分析线索。' },
  { id: 'e4', k: 'k2014kf', theme: 'empire', type: '原话', text: '简言之，行政发包制的制度安排在帝国治理中有着其重要地位，但仅此尚不足以概括中华帝国治理的基本特征，特别是帝国治理中“上收—下放”的周期性波动演变。' },
  { id: 'e5', k: 'k2014sh', theme: 'empire', type: '转述', text: '在评论周黎安行政发包制时提出一个模型：君主在效率与治理风险的冲突之下于集权与分权之间抉择，以此解释"上收—下放"的周期波动。' },
  { id: 'e6', k: 'k2015', theme: 'empire', type: '原话', text: '我以为，非正式制度是帝国逻辑的核心。' },
  { id: 'e7', k: 'k2017', loc: '第 429 页', theme: 'empire', type: '原话', text: '帝国的逻辑是以牺牲效率来换取安定，这是众多研究颇为一致的结论。' },
  { id: 'e8', k: 'k2026a', theme: 'empire', type: '转述', text: '据主办方报道：以三对关系梳理帝国逻辑，援引王亚南"原则上不让步，事实上不坚持"的概括，讨论以名代实与以实正名，并指出差序格局在官僚体制内部延续。' },
  { id: 'e9', k: 'k2025jcc', theme: 'empire', type: '转述', text: '与朱灵合作，基于江苏 1990—2012 年官员人事数据，提出中央主义与地方主义张力下并存的"双重流动体制"（合著结论）。' },

  // —— 官僚行为：共谋·变通·逆向软预算 ——
  { id: 'c1', k: 'k2008', theme: 'collusion', type: '原话', text: '在中国行政体制中，基层政府间的共谋行为已经成为一个制度化了的非正式行为；这种共谋行为是其所处制度环境的产物，有着广泛深厚的合法性基础。' },
  { id: 'c2', k: 'k2008', theme: 'collusion', type: '原话', text: '共谋行为不能简单地归咎于政府官员或执行人员的素质或能力，其稳定存在和重复再生是政府组织结构和制度环境的产物，是现行组织制度中决策过程与执行过程分离所导致的结果，在很大程度上也是近年来政府制度设计特别是集权决策过程和激励机制强化所导致的非预期结果。' },
  { id: 'c3', k: 'k2008', theme: 'collusion', type: '转述', text: '以三个悖论解释共谋的制度基础：政策一统性与执行灵活性、激励强度与目标替代、科层非人格化与行政关系人缘化。' },
  { id: 'c4', k: 'k2005', theme: 'collusion', type: '原话', text: '因此，宏观组织制度难以对政府官员的行为实行有效约束。' },
  { id: 'c5', k: 'k2005', theme: 'collusion', type: '转述', text: '提出"逆向软预算约束"：政府机构通过非正式途径向下级政府、企业与个人索取资源，以弥补预算不足、完成上级任务或政绩工程，预算约束由下而上被软化。' },
  { id: 'c6', k: 'k2013cj', theme: 'collusion', type: '转述', text: '与练宏等合作，以环境政策执行的田野材料刻画中国官僚体制中"拼凑应对"（muddling through）的行为模式（合著结论）。' },
  { id: 'c7', k: 'k2015', theme: 'collusion', type: '原话', text: '在这个意义上，官员行为在很大程度上体现了制度的品质，而不是官员本人的品质。' },
  { id: 'c8', k: 'k2026d', theme: 'collusion', type: '转述', text: '据主办方报道：变通、共谋、形式主义在一定程度上解决了正式规则无法解决的问题；技术手段强化监控而基层能力滞后，会加剧执行中的紧张。' },

  // —— 运动型治理 ——
  { id: 'm1', k: 'k2012', theme: 'campaign', type: '原话', text: '运动型治理机制与常规型治理机制是中国国家治理的双重过程和有机组成部分；两者既相互矛盾，又互为依赖，并在一定条件下互相转化。' },
  { id: 'm2', k: 'k2012', theme: 'campaign', type: '原话', text: '若基本治理逻辑未变，替代机制缺失，则运动型治理机制不废。' },
  { id: 'm3', k: 'k2012', theme: 'campaign', type: '原话', text: '但我只能部分地同意冯仕政（2011）总结的“运动式治理”的基本特征，即“在运作方式上具有明显的非制度化、非常规化和非专业化特征”。在我看来，虽然运动式治理表现出了“非常规化”特点，但这一机制植根于稳定的制度化的组织基础之上。' },
  { id: 'm4', k: 'k2017', loc: '第 37 页', theme: 'campaign', type: '原话', text: '运动型治理机制的最大特点是，暂时叫停原官僚制常规过程，以政治动员过程替代之，以便超越官僚制度的组织失败，达到纠偏、规范边界的意图。' },
  { id: 'm5', k: 'k2015', theme: 'campaign', type: '原话', text: '如果大的治理逻辑不变，运动式治理是不会消亡的，因为到目前为止还没有找到一个平稳持续的治理模式，也没有更好的办法来实现不同治理状态间的平稳过渡。' },
  { id: 'm6', k: 'k2015', theme: 'campaign', type: '转述', text: '认为运动既可服务于收权（如整顿小金库），也可服务于放权（如 20 世纪 80 年代的解放思想），方向取决于治理需要。' },
  { id: 'm7', k: 'k2017', loc: '第 437 页', theme: 'campaign', type: '原话', text: '政府的一个强有力动员机制正是把有关的行政管理问题转化为政治问题。' },

  // —— 控制权理论与政府内部关系 ——
  { id: 't1', k: 'k2012kz', theme: 'control', type: '原话', text: '在这里，管理方扮演一个承包商的角色，在其管辖范围行使自己的剩余控制权来安排落实政策执行活动。这是中国政府的常态治理模式。' },
  { id: 't2', k: 'k2012kz', theme: 'control', type: '转述', text: '与练宏合作，将目标设定权、检查验收权、激励分配权在委托方与管理方之间的不同分配，归纳为高度关联型、行政发包制、松散关联型、联邦制四种治理模式（合著结论）。' },
  { id: 't3', k: 'k2011tp', theme: 'control', type: '原话', text: '在委托方采纳动员模式的条件下，“准退出”是代理方的最佳应对策略；而在常规模式下，代理方的应对策略选择有着更大空间。' },
  { id: 't4', k: 'k2011tp', theme: 'control', type: '转述', text: '与练宏合作，以委托方的常规/动员模式与代理方的正式谈判、非正式谈判、准退出策略构建上下级谈判模型，材料取自环境政策实施（合著结论）。' },
  { id: 't5', k: 'k2015', theme: 'control', type: '转述', text: '区分激励模式与治理模式：晋升锦标赛属官员激励模式，行政发包与控制权理论讨论的是范围更宽的政府治理模式。' },
  { id: 't6', k: 'k2026b', theme: 'control', type: '转述', text: '据主办方报道：以剩余控制权的配置解释层层加码、选择性执行、变通共谋以及检查验收时松时紧等现象。' },
  { id: 't7', k: 'k2026d', theme: 'control', type: '转述', text: '据主办方报道：把中央到基层概括为五级委托—代理链，强激励（锦标赛、末位淘汰）下治理在高度关联与松散关联之间循环，称为"变动关联"。' },

  // —— 官僚制传统与人事制度 ——
  { id: 'h1', k: 'k2016', theme: 'history', type: '原话', text: '“官吏分途”是帝国治理应对规模之累以及由此产生的委托—代理困难的一个制度安排。' },
  { id: 'h2', k: 'k2019hr', theme: 'history', type: '原话', text: '黄仁宇悖论描述了中华帝国组织形态松散关联但国家秩序坚韧稳定的矛盾特点。' },
  { id: 'h3', k: 'k2019hr', theme: 'history', type: '原话', text: '在当代中国，国家治理模式发生了重要转型，从观念一体化转向为组织一元化，为国家治理带来了一系列鲜明的特点和新的挑战。' },
  { id: 'h4', k: 'k2015', theme: 'history', type: '原话', text: '我们也可以说，中国长期历史上的实际状况是最高执政者与官僚体制“共天下”。' },
  { id: 'h5', k: 'k2015', theme: 'history', type: '原话', text: '所以我认为所谓的绩效合法性是卡理斯玛权威的一个具体表象，可以包括在韦伯三个合法性基础之内。' },
  { id: 'h6', k: 'k2021cjs', theme: 'history', type: '转述', text: '合作研究基于 1990—2008 年逾 4 万名官员、逾 30 万人年的人事记录，考察党政部门之间的人员流动模式，以此刻画党政关系（合著结论）。' },
  { id: 'h7', k: 'k2024', theme: 'history', type: '原话', text: '以自我为中心、以差序身份为基础、以亲疏有别为特征的一种特定社会认知和组织方式。' },
  { id: 'h8', k: 'k2023wy', theme: 'history', type: '转述', text: '据主办方报道：提出家产制、科层制与差序格局并置的"修正韦伯模型"，认为当下差序格局与正式制度不再相容，由此产生新的紧张。' },

  // —— 组织社会学方法与大转型 ——
  { id: 'd1', k: 'k2019ss', theme: 'method', type: '原话', text: '要寻找国家治理的历史脉络，必须努力超越正式制度和官方文本，搜寻有关非正式运作的历史资料，以便解读正式与非正式之间的相互作用，以及象征性权力与实质性权力之间的转化。' },
  { id: 'd2', k: 'k2025mor', theme: 'method', type: '原话', text: 'agency problems induce the prevalence of informal institutions as an organizational response, which leads to variable coupling in Chinese bureaucracy.' },
  { id: 'd3', k: 'k2015', theme: 'method', type: '原话', text: '从大的历史趋势来看，变化是不可避免的，而且正在发生着。背后的推动力我认为主要有两个：一个是当代社会的多元分化，另一个是无时无处不在的国际竞争。' },
  { id: 'd4', k: 'k2025cufe', theme: 'method', type: '转述', text: '据主办方报道：以"大转型"概括当下，中心化与去中心化并行，主张社会学走出社区与单位范式，追问"谁的现实""谁的附近"。' },
  { id: 'd5', k: 'k2025pku', theme: 'method', type: '转述', text: '据主办方报道：批评制度主义研究以"物象化"方式接受制度，忽视了人对制度的建构过程。' },
  { id: 'd6', k: 'k2026c', theme: 'method', type: '转述', text: '据主办方报道：以"自构化"、反向社会化与"虚拟附近"等概念讨论数字时代的集体行动与社会组织。' },
];

export const CLAIMS = RAW_CLAIMS.map((c) => {
  const k = CORPUS_BY_ID[c.k];
  return {
    id: c.id,
    theme: c.theme,
    type: c.type,
    text: c.text,
    date: k.date,
    venue: c.loc ? `${k.venue}，${c.loc}` : k.venue,
    source: k.source,
    url: k.url,
    verified: c.verified ?? k.verified,
  };
});

export const QUOTES = CLAIMS.filter((c) => c.type === '原话');

export const FEATURED = ['u2', 'e1', 'e2', 'c2', 'm1', 'm2', 't1', 'h3'];

export const THEME_LINKS = {
  unity: [{ to: '/governance', label: '国家治理' }, { to: '/govsystem', label: '政府体制' }],
  empire: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/modules/shijian', label: '史鉴' }],
  collusion: [{ to: '/principalagent', label: '委托代理' }, { to: '/modules/able-official-paradox', label: '能吏悖论' }],
  campaign: [{ to: '/modules/anticorruption', label: '反腐' }, { to: '/modules/xinfang', label: '信访' }],
  control: [{ to: '/principalagent', label: '委托代理' }, { to: '/govsystem', label: '政府体制' }],
  history: [{ to: '/talent', label: '人才与干部' }, { to: '/civilization', label: '文明' }],
  method: [{ to: '/pathdependence', label: '路径依赖' }, { to: '/digital', label: '数字中国' }],
};

export const THEME_INTRO = {
  unity: '其整体框架的起点：中央的一统体制（权威体制）与地方的有效治理之间存在内在矛盾，集中越刚性，地方治理能力越弱，反之又威胁一统；矛盾无法根本解决，只能在动态中寻找暂时平衡。',
  empire: '以"帝国的逻辑"把当代治理问题放回长时段：正式与非正式的并存转化、"放权—收权"的周期波动与"黄宗羲定律"式的税费循环；与周黎安"行政发包制"的对话见"争议"栏。',
  collusion: '从组织结构而非官员素质解释政府行为：基层政府间的"共谋"、执行中的变通与"拼凑应对"，以及向下汲取资源的"逆向软预算约束"。',
  campaign: '"运动型治理"被视为一统体制下常规机制失灵时的纠偏手段，建立在稳定组织基础之上；替代机制缺失则"不废"，与冯仕政"终将消亡"的判断相对。',
  control: '与练宏合作的控制权理论：目标设定、检查验收、激励分配三权在上下级间的配置决定治理模式，并以谈判模型刻画代理方在动员模式下的"准退出"。',
  history: '2016 年后的延伸：官吏分途与层级分流、黄仁宇悖论与科举、差序格局在官僚体制中的延续，以及基于省级人事大数据的官员流动研究（多为合著）。',
  method: '主张社会科学与史学相互照应，超越官方文本寻找非正式运作的资料；近年讲座转向"大转型"、数字时代的社会组织与制度建构。',
};

// ============================================================================
// 命题检验台账：以其理论命题对照其后的政策事实；对照截至核验日
// "一致"仅指事实走向与命题相符，不代表命题得到因果验证或归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2012-09', venue: '《开放时代》2012 年第 9 期',
    url: 'https://www.aisixiang.com/data/59706.html',
    claim: '若基本治理逻辑未变，替代机制缺失，则运动型治理机制不废。',
    check: '2013 年起开展党的群众路线教育实践活动；2018-01 中共中央、国务院印发《关于开展扫黑除恶专项斗争的通知》，三年专项结束后转入常态化；2024-04 中办印发通知在全党开展党纪学习教育。集中式专项行动持续出现，同时部分专项被转为常态化制度，后者既可读作"运动常规化"，也可读作替代机制的建设。',
    dataSrc: '中共中央、国务院 2018-01 通知；中办 2024-04 通知；新华社公开报道',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2014-07', venue: '《开放时代》2014 年第 4 期',
    url: 'https://web.stanford.edu/~xgzhou/zhou_14_empire_CH.pdf',
    claim: '帝国逻辑下"放权—收权—放权"呈周期性波动',
    check: '2018-03《深化党和国家机构改革方案》、2023-03《党和国家机构改革方案》强化集中统一领导；2024-07 二十届三中全会决定提出"适当加强中央事权、提高中央财政支出比例"。观察窗口内处于上收方向，是否回摆为放权尚未发生，周期命题在当前窗口内无法证实或证伪。',
    dataSrc: '中共中央、国务院机构改革方案（2018-03、2023-03）；《中共中央关于进一步全面深化改革 推进中国式现代化的决定》（2024-07）',
  },
  {
    id: 'L3', status: 'done', type: '原话', date: '2008-11', venue: '《社会学研究》2008 年第 6 期',
    url: 'https://www.aisixiang.com/data/23476.html',
    claim: '共谋行为……在很大程度上也是近年来政府制度设计特别是集权决策过程和激励机制强化所导致的非预期结果。',
    check: '2019-03 中办印发《关于解决形式主义突出问题为基层减负的通知》；2024-08 中办、国办印发《整治形式主义为基层减负若干规定》，点名督查检查考核过多过频、过度留痕等问题。应付上级检查类行为被官方反复确认；但官方以"形式主义"定性，不使用"共谋"概念，其因果机制未因此得到检验。',
    dataSrc: '中办 2019-03 通知；中办国办 2024-08 规定（中国政府网）',
  },
  {
    id: 'L4', status: 'done', type: '转述', date: '2012-09', venue: '《社会学研究》2012 年第 5 期（与练宏合作）',
    url: 'http://sociology.cssn.cn/webpic/web/sociology/upload/2012/12/d20121204104540421.pdf',
    claim: '控制权在上下级间的重新配置带来治理模式转换（发包型↔高度关联型）',
    check: '2015-07 中央全面深化改革领导小组审议通过《环境保护督察方案（试行）》，2019-06 中办国办印发《中央生态环境保护督察工作规定》；2016-09 中办国办印发《关于省以下环保机构监测监察执法垂直管理制度改革试点工作的指导意见》。环保领域检查验收权上收，与框架可描述的转换方向一致；该框架为解释性而非预测性，属事后可对照。',
    dataSrc: '中办国办 2016-09 指导意见；中办国办 2019-06 工作规定',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2019-03', venue: '《社会》2019 年第 39 卷第 2 期',
    url: 'https://www.society.shu.edu.cn/CN/Y2019/V39/I2/1',
    claim: '在当代中国，国家治理模式发生了重要转型，从观念一体化转向为组织一元化',
    check: '2018-03-11 十三届全国人大一次会议通过宪法修正案，在第一条增写"中国共产党领导是中国特色社会主义最本质的特征"；2018-03、2023-03 两轮党和国家机构改革组建或调整党中央决策议事协调机构。制度文本走向与其概括一致；该命题系对既有趋势的归纳而非事前预测。',
    dataSrc: '《中华人民共和国宪法修正案》（2018-03-11）；2018、2023 年机构改革方案',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2014-07', venue: '《开放时代》2014 年第 4 期',
    url: 'https://web.stanford.edu/~xgzhou/zhou_14_empire_CH.pdf',
    claim: '“杂税丛生—并税式改革—杂税丛生”的循环波动在历史上重复出现',
    check: '2006 年起全面取消农业税；2024-02 国务院印发《关于进一步规范和监督罚款设定与实施的指导意见》（国发〔2024〕5 号），要求严禁以罚增收、逐利罚款。中央文件确认存在逐利罚款问题，但缺乏全国性非税负担的系统数据，不足以判断是否进入新一轮"杂税丛生"。',
    dataSrc: '国务院国发〔2024〕5 号（2024-02-09 印发，中国政府网 2024-02-19 公布）',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2026-03-31', venue: '中国人民大学求是讲座第 287 讲（主办方报道）',
    url: 'http://spap.ruc.edu.cn/xwdt/df13b2144f82463f94db31cc14453e3a.htm',
    claim: '技术监控强化而基层能力滞后，会加剧执行紧张',
    check: '2024-08《整治形式主义为基层减负若干规定》专门规范政务应用程序与"指尖上的形式主义"，说明技术化考核带来的负担被官方确认；但执行紧张程度缺乏可公开检验的量化指标。',
    dataSrc: '中办国办 2024-08 规定（间接）',
  },
  {
    id: 'L8', status: 'open', type: '转述', date: '2023-11-20', venue: '北大文研讲座第 312 期（主办方报道）',
    claim: '差序格局与正式制度不再相容，产生新的紧张',
    check: '2023-12 中共中央印发修订后的《中国共产党纪律处分条例》，条例对搞团团伙伙、拉帮结派等行为设有处分条款；方向与其判断相关，但差序关系在官僚体制中的强弱难以测度，无法闭环。',
    dataSrc: '《中国共产党纪律处分条例》（2023-12 修订）；公开文件（检索截至 2026-09）',
  },
  {
    id: 'L9', status: 'open', type: '原话', date: '2015', venue: '政见 CNPolitics 专访（整理稿）',
    url: 'https://www.aisixiang.com/data/91354.html',
    claim: '从大的历史趋势来看，变化是不可避免的，而且正在发生着。',
    check: '命题未给出变化方向与时间尺度；社会多元分化与国际竞争两项推动力均无统一测度口径，属方向性判断，无法以单一政策事实检验。',
    dataSrc: '无可直接对照的官方统计（检索截至 2026-09）',
  },
];

// 周雪光公开表述以组织机制论证为主，未见可与官方统计直接比对的数值判断，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）——节点均取其本人概念
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '应对机制', '政府行为', '控制权理论', '帝国逻辑', '官僚制传统'],
  nodes: [
    { id: 'core', name: '一统体制\n与有效治理', cat: 0, size: 58 },
    { id: 'flex', name: '决策一统性与\n执行灵活性', cat: 1, size: 30 },
    { id: 'ritual', name: '政治教化礼仪化', cat: 1, size: 24 },
    { id: 'campaign', name: '运动型治理机制', cat: 1, size: 38 },
    { id: 'routine', name: '常规型治理机制', cat: 1, size: 26 },
    { id: 'collusion', name: '基层政府间共谋', cat: 2, size: 34 },
    { id: 'muddle', name: '拼凑应对', cat: 2, size: 22 },
    { id: 'isbc', name: '逆向软预算约束', cat: 2, size: 28 },
    { id: 'bargain', name: '上下级谈判 / 准退出', cat: 2, size: 24 },
    { id: 'control', name: '控制权理论', cat: 3, size: 38 },
    { id: 'rights', name: '目标设定·检查验收·激励分配', cat: 3, size: 26 },
    { id: 'modes', name: '高度关联 / 发包 / 松散关联 / 联邦', cat: 3, size: 26 },
    { id: 'variable', name: '变动关联', cat: 3, size: 22 },
    { id: 'empire', name: '帝国的逻辑', cat: 4, size: 40 },
    { id: 'pa', name: '委托与代理', cat: 4, size: 24 },
    { id: 'fi', name: '正式与非正式', cat: 4, size: 28 },
    { id: 'mingshi', name: '名与实', cat: 4, size: 22 },
    { id: 'hzx', name: '黄宗羲定律', cat: 4, size: 26 },
    { id: 'cycle', name: '放权—收权周期', cat: 4, size: 26 },
    { id: 'weber', name: '韦伯视角 / 卡理斯玛权威', cat: 5, size: 24 },
    { id: 'guanli', name: '官吏分途 → 层级分流', cat: 5, size: 26 },
    { id: 'hry', name: '黄仁宇悖论\n观念一体化→组织一元化', cat: 5, size: 28 },
    { id: 'chaxu', name: '差序格局', cat: 5, size: 26 },
  ],
  links: [
    ['core', 'flex'], ['core', 'ritual'], ['core', 'campaign'], ['campaign', 'routine'],
    ['flex', 'collusion'], ['flex', 'muddle'], ['isbc', 'collusion'], ['core', 'isbc'],
    ['core', 'control'], ['control', 'rights'], ['control', 'modes'], ['modes', 'variable'],
    ['control', 'bargain'], ['bargain', 'campaign'],
    ['core', 'empire'], ['empire', 'pa'], ['empire', 'fi'], ['empire', 'mingshi'], ['empire', 'hzx'],
    ['hzx', 'cycle'], ['cycle', 'core'], ['mingshi', 'ritual'], ['fi', 'collusion'],
    ['empire', 'guanli'], ['empire', 'hry'], ['weber', 'campaign'], ['weber', 'core'],
    ['chaxu', 'fi'], ['hry', 'ritual'], ['guanli', 'pa'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '行政发包制还是帝国逻辑：如何概括央地关系与帝国治理',
    sides: [
      { who: '周黎安（《行政发包制》，《社会》2014 年第 34 卷第 6 期，第 1—38 页）', view: '转述：行政发包制是科层制与发包制之间的混合形态，以行政权分配、经济激励、内部控制三个维度刻画政府间关系。' },
      { who: '周雪光（《行政发包制与帝国逻辑》，同期第 39—51 页）', view: '原话节选："周黎安提出的分析模型隐含了几个前提假设，笔者以为有进一步澄清和讨论的空间。"转述：另提集权—分权抉择模型，认为发包概念不足以概括"上收—下放"的周期波动。' },
      { who: '周黎安（《行政发包的组织边界：兼论“官吏分途”与“层级分流”现象》，《社会》2016 年第 36 卷第 1 期，第 34—64 页）', view: '转述：以财政压力下"行政内包"与"行政外包"的边界解释官吏分途、吏役合一，明言与周雪光的帝国逻辑理论对话。' },
    ],
    note: '两轮文章均刊于《社会》同期，属对话式讨论；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '运动型治理：非制度化的过渡形态，还是植根于稳定组织基础的常设机制',
    sides: [
      { who: '冯仕政（《中国国家运动的形成与变异：基于政体的整体性解释》，《开放时代》2011 年第 1 期，第 72—97 页）', view: '转述：国家运动源于"革命教化政体"，运作具有非制度化、非常规化、非专业化特征；随卡理斯玛权威常规化趋于温和、频率降低并最终消亡。' },
      { who: '周雪光（《运动型治理机制》，《开放时代》2012 年第 9 期）', view: '转述：只部分同意上述特征概括，认为运动型机制虽"非常规化"，却植根于稳定的制度化组织基础；基本治理逻辑未变、替代机制缺失，则不废。' },
      { who: '蔡禾（《国家治理的有效性与合法性——对周雪光、冯仕政二文的再思考》，《开放时代》2012 年第 2 期）', view: '转述：以有效性与合法性两个维度同时回应周雪光 2011 年与冯仕政 2011 年两文。' },
    ],
    note: '分歧在于运动的制度属性与演化前景；本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '官吏分途的成因与帝国逻辑框架的边界',
    sides: [
      { who: '周雪光（《社会》2016 年第 36 卷第 1 期，第 1—33 页）', view: '原话："“官吏分途”是帝国治理应对规模之累以及由此产生的委托—代理困难的一个制度安排。"' },
      { who: '周黎安（《社会》2016 年第 36 卷第 1 期，第 34—64 页）', view: '转述：更强调财政压力与行政发包边界，把吏役体系视为"行政外包"的结果。' },
      { who: '刘建军、马彦银（《从“官吏分途”到“群体三分”》，《社会》2016 年第 36 卷第 1 期，第 76—98 页）', view: '转述：认为"层级分流"对地方治理有所简化，提出官僚、派生、雇佣"群体三分"，并以"使命政治"补充锦标赛解释。' },
    ],
    note: '三文同期刊发，属围绕同一问题的多角度讨论；本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '"《一统体制与有效治理》（《开放时代》2011）"的题名', status: '更正', reason: '期刊题名为《权威体制与有效治理：当代中国国家治理的制度逻辑》（2011 年第 10 期）；"一统体制与有效治理"是 2017 年著作中的表述。' },
  { id: 'q2', item: '2008 年论文题名"共谋现象"与"合谋现象"、发表年份 2008 与 2009', status: '并陈', reason: '期刊原文作"共谋现象"、2008 年第 6 期；斯坦福简历目录作"合谋"，作者个人主页有一处标为 2009，以期刊为准。' },
  { id: 'q3', item: '控制权理论一文的刊物与合作者', status: '更正', reason: '刊于《社会学研究》2012 年第 5 期（周雪光、练宏），并非《中国社会科学》2012；《中国社会科学》2011 年第 5 期所刊为二人合作的上下级谈判模型。' },
  { id: 'q4', item: '谈判模型一文页码', status: '并陈', reason: '斯坦福简历作第 80—96 页，Google Scholar 作第 81—97 页，未见期刊版面原件。' },
  { id: 'q5', item: '本科经历：复旦大学与南开大学', status: '并陈', reason: '官方简历为复旦大学国际政治系学士（1982）；另有资料称其 1981 年参加南开大学社会学班培训；南开大学 2023-12-02 讲座报道称其"本科阶段在南开大学社会学系学习"，以官方简历为准并陈。' },
  { id: 'q6', item: '出生年份与籍贯', status: '〔存疑〕', reason: '斯坦福、FSI、北大文研院官方简介均未载明，网络流传信息无可溯出处。' },
  { id: 'q7', item: '《国家与生活机遇》中译本出版年份', status: '更正', reason: '个别论文注释作 2014 年；出版社书目为 2015-02（ISBN 9787300189901），以书目为准。' },
  { id: 'q8', item: '北大文研讲座第 410 期（2026-09-18）、上海师大圆桌（2026-08-06）、FSI 讲座（2024-01-19）、普林斯顿 PIIRS 讲座（2025-02-03）', status: '不收录', reason: '仅见活动预告或页面无正文，未见内容报道或整理稿。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
