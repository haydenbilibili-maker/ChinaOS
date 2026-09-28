// ============================================================================
// 学者专栏 · 周黎安 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"周黎安认为"而无原文可溯者一律不收录。
// 合著论文的结论标注合作者，不单独归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  tournament: { label: '晋升锦标赛与官员激励', color: '#c41e3a' },
  subcontract: { label: '行政发包制与央地关系', color: '#8b5cf6' },
  dualmarket: { label: '官场+市场与政商关系', color: '#22d3ee' },
  fiscal: { label: '地方债与土地财政', color: '#e8a317' },
  governance: { label: '国家治理与治理不可能三角', color: '#10b981' },
  industry: { label: '产业政策与有为政府', color: '#fb923c' },
  rural: { label: '乡村振兴与乡村CEO', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '周黎安',
  born: '1966 年 · 江西高安（祖籍江西黎川）',
  summary:
    '北京大学经济学学士（1988）、硕士（1991），斯坦福大学经济学博士（2002）。1991—1996 年任教北大经济学院，2002 年起任教北大光华管理学院应用经济系，2010 年升任教授，历任应用经济系主任（2011—2020）、光华管理学院副院长（2018—2022）。2004、2007 年在《经济研究》提出并系统化"晋升锦标赛"模式，2014 年提出"行政发包制"，2018 年提出"官场+市场"，2026 年提出"治理不可能三角"，研究对象集中于地方官员激励、央地关系、政商关系与国家治理。',
  current: [
    '北京大学经济与管理学部主任（2022 年起）',
    '北京大学光华管理学院应用经济系教授、博雅讲席教授（2025-05 起）',
    '第十四届全国政协委员、农业和农村委员会委员',
    '教育部"长江学者"特聘教授（2016）',
  ],
  sources: '北京大学光华管理学院官网个人简历 PDF（2025-09-05 上传）；北大管理科学中心人物专访《拒绝童话》；上海交大政治经济研究院人物页；百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 8,
  subtitle: '晋升锦标赛 · 行政发包制 · 官场+市场 · 地方债 · 治理不可能三角',
  span: '2004—2026',
  careerTitle: '履历时间线 · 北大经院 → 斯坦福 → 光华 → 学部 / 政协',
  defaultTheme: 'tournament',
  moduleId: 'scholarZhouLian',
  sourceNote: '期刊论文原文 / 主办方讲座报道 / 署名文章 / 主流媒体采访 · 对照政策：中组部、中办国办、财政部、国家发展改革委、人社部',
};

export const CAREER_GROUPS = {
  pku: { label: '北大教职', color: '#22d3ee' },
  admin: { label: '北大行政', color: '#10b981' },
  study: { label: '求学/访学', color: '#8b5cf6' },
  gov: { label: '全国政协', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '北京大学经济学院助教、讲师', org: '北京大学', start: 1991.5, end: 1996.5, group: 'pku' },
  { id: 'c2', role: '斯坦福大学经济系博士研究生', org: 'Stanford', start: 1996.6, end: 2002.4, group: 'study', note: '2002 年获博士学位；入学年份未见本人简历载明〔存疑〕' },
  { id: 'c3', role: '光华管理学院应用经济系助理教授', org: '北京大学', start: 2002.5, end: 2005.5, group: 'pku' },
  { id: 'c4', role: '光华管理学院应用经济系副教授', org: '北京大学', start: 2005.5, end: 2010.6, group: 'pku' },
  { id: 'c5', role: '耶鲁大学经济增长中心访问学者', org: 'Yale', start: 2007.1, end: 2007.6, group: 'study' },
  { id: 'c6', role: '光华管理学院应用经济系教授', org: '北京大学', start: 2010.6, end: 2026.75, group: 'pku' },
  { id: 'c7', role: '光华应用经济系副主任', org: '北京大学', start: 2006.6, end: 2011.0, group: 'admin' },
  { id: 'c8', role: '光华应用经济系主任', org: '北京大学', start: 2011.0, end: 2020.7, group: 'admin' },
  { id: 'c9', role: '光华管理学院副院长', org: '北京大学', start: 2018.4, end: 2022.3, group: 'admin' },
  { id: 'c10', role: '北京大学经济与管理学部主任', org: '北京大学', start: 2022.0, end: 2026.75, group: 'admin', note: '本人简历作 2022-01，百度百科作 2022-04，以本人简历为准' },
  { id: 'c11', role: '第十四届全国政协委员（农业和农村委员会委员）', org: '全国政协', start: 2023.05, end: 2026.75, group: 'gov' },
];

export const BOOKS = [
  { id: 'b1', year: 1992, title: '边缘地带的小农：中国贫困的微观解理', publisher: '人民出版社', coauthors: '沈红、陈胜利', themes: ['rural'], verified: 'primary', note: '据本人简历著作目录' },
  { id: 'b2', year: 2008, title: '为增长而竞争：中国增长的政治经济学', publisher: '格致出版社、上海人民出版社', coauthors: '张军（合编）', themes: ['tournament', 'dualmarket'], verified: 'primary', note: '据本人简历著作目录' },
  { id: 'b3', year: 2008, title: '转型中的地方政府：官员激励与治理', publisher: '格致出版社（中国改革30年研究丛书）', date: '2008-11', isbn: '9787543215306', themes: ['tournament', 'subcontract', 'fiscal'], verified: 'primary', note: '339 页；获第六届高校科研优秀成果奖（人文社科）二等奖（2013）' },
  { id: 'b4', year: 2009, title: 'Incentives and Governance: China\u2019s Local Governments', publisher: 'Cengage Learning', themes: ['tournament'], verified: 'primary', note: '据本人简历著作目录；版权页信息未独立核对' },
  { id: 'b5', year: 2017, title: '转型中的地方政府：官员激励与治理（第二版）', publisher: '格致出版社、上海三联书店、上海人民出版社（当代经济学系列丛书）', date: '2017-08', isbn: '9787543227651', themes: ['tournament', 'subcontract', 'dualmarket'], verified: 'primary', note: '442 页；增补行政发包制等章节' },
  { id: 'b6', year: 2024, title: '黄宗智对话周黎安：实践社会科学', publisher: '广西师范大学出版社', date: '2024-01', isbn: '9787559864642', coauthors: '黄宗智', themes: ['subcontract', 'governance'], verified: 'primary', note: '652 页' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k2004', date: '2004-06', form: '论文', venue: '《晋升博弈中政府官员的激励与合作——兼论我国地方保护主义和重复建设问题长期存在的原因》，《经济研究》2004 年第 6 期，第 33—40 页', source: '《经济研究》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/9048.html', verified: 'primary', themes: ['tournament', 'dualmarket'] },
  { id: 'k2005', date: '2005-09', form: '论文', venue: 'Li & Zhou, "Political Turnover and Economic Performance", Journal of Public Economics 89(9-10): 1743—1762', source: 'Journal of Public Economics（与 Hongbin Li 合作）', verified: 'primary', themes: ['tournament'] },
  { id: 'k2007', date: '2007-07', form: '论文', venue: '《中国地方官员的晋升锦标赛模式研究》，《经济研究》2007 年第 7 期，第 36—50 页', source: '《经济研究》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/18217.html', verified: 'primary', themes: ['tournament', 'governance'] },
  { id: 'k2013', date: '2013-11-29', form: '采访', venue: '《中国青年报》专访 · 地方政府改革不能只在收放权上绕圈子', source: '中国青年报', url: 'https://zqb1.cyol.com/html/2013-11/29/nw.D110000zgqnb_20131129_1-07.htm', verified: 'media', themes: ['fiscal', 'governance', 'subcontract'] },
  { id: 'k2014', date: '2014-11', form: '论文', venue: '《行政发包制》，《社会》2014 年第 34 卷第 6 期，第 1—38 页', source: '《社会》编辑部官网', url: 'https://www.society.shu.edu.cn/cn/y2014/v34/i6/1', verified: 'primary', themes: ['subcontract'] },
  { id: 'k2015', date: '2015-04', form: '论文', venue: 'Fang, Gu, Xiong & Zhou, "Demystifying the Chinese Housing Boom", NBER WP 21112；收入 NBER Macroeconomics Annual 2015, Vol.30: 105—166（2016 年刊行）', source: 'NBER（与 Hanming Fang、Quanlin Gu、Wei Xiong 合作）', url: 'https://www.nber.org/books-and-chapters/nber-macroeconomics-annual-2015-volume-30/demystifying-chinese-housing-boom', verified: 'primary', themes: ['fiscal'] },
  { id: 'k2018a', date: '2018-05-25', form: '署名文章', venue: '改革开放40年 · 中国政府治理的变革与现代化', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_2138337', verified: 'primary', themes: ['governance', 'tournament', 'fiscal'] },
  { id: 'k2018b', date: '2018-03', form: '论文', venue: '《“官场+市场”与中国增长故事》，《社会》2018 年第 38 卷第 2 期，第 1—45 页', source: '《社会》编辑部官网', url: 'https://www.society.shu.edu.cn/CN/Y2018/V38/I2/1', verified: 'primary', themes: ['dualmarket', 'industry'] },
  { id: 'k2018c', date: '2018-12', form: '论文', venue: '吴敏、周黎安《晋升激励与城市建设：公共品可视性的视角》，《经济研究》2018 年第 12 期', source: '《经济研究》（与吴敏合作；南开大学区域政策研究中心摘要页）', url: 'https://chinareal.nankai.edu.cn/info/1100/2555.htm', verified: 'primary', themes: ['tournament', 'fiscal'] },
  { id: 'k2019', date: '2019-10', form: '论文', venue: 'Li, Liu, Weng & Zhou, "Target Setting in Tournaments: Theory and Evidence from China", Economic Journal 129(623): 2888—2915', source: 'The Economic Journal（与 Xing Li、Chong Liu、Xi Weng 合作）', url: 'https://ideas.repec.org/a/oup/econjl/v129y2019i623p2888-2915..html', verified: 'primary', themes: ['tournament'] },
  { id: 'k2020a', date: '2020-08-18', form: '讲话', venue: '政府与市场经济学年会主旨演讲', source: '清华大学中国经济社会数据研究中心（ACCEPT）官网', url: 'http://www.accept.tsinghua.edu.cn/2020/1112/c46a101/page.htm', verified: 'primary', themes: ['dualmarket', 'tournament'] },
  { id: 'k2020b', date: '2020', form: '论文', venue: 'Wang, Zhang & Zhou, "Career Incentives of City Leaders and Urban Spatial Expansion in China", Review of Economics and Statistics 102(5): 897—911', source: 'The Review of Economics and Statistics（与 Zhi Wang、Qinghua Zhang 合作）', url: 'https://ideas.repec.org/a/tpr/restat/v102y2020i5p897-911.html', verified: 'primary', themes: ['fiscal', 'tournament'] },
  { id: 'k2021', date: '2021-11', form: '论文', venue: '《地区增长联盟与中国特色的政商关系》，《社会》2021 年第 41 卷第 6 期，第 1—40 页', source: '《社会》', verified: 'primary', themes: ['dualmarket'] },
  { id: 'k2022a', date: '2022-12-25', form: '论文', venue: '《晋升锦标赛——文献评述与研究展望》，《经济管理学刊》2022 年第 1 卷第 1 期，第 1—34 页', source: '《经济管理学刊》编辑部官网', url: 'https://www.jgcm.ac.cn/qjem/cn/article/id/jjglxk-1', verified: 'primary', themes: ['tournament'] },
  { id: 'k2022b', date: '2022-07', form: '论文', venue: '《行政发包制与中国特色的国家能力》，《开放时代》2022 年第 4 期', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/135497.html', verified: 'primary', themes: ['subcontract', 'governance'] },
  { id: 'k2023a', date: '2023-03', form: '论文', venue: '《从“双重创造”到“双向塑造”——构建政府与市场关系的中国经验》，《学术月刊》2023 年第 3 期', source: '《学术月刊》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/141944.html', verified: 'primary', themes: ['industry', 'dualmarket'] },
  { id: 'k2023b', date: '2023-12-20', form: '讲座', venue: '北大文研讲座第 317 期 · 行政发包制的历史面向', source: '北京大学人文社会科学研究院官网', url: 'http://www.ihss.pku.edu.cn/wyjz1/articles/1373713219696332800.html', verified: 'primary', themes: ['subcontract'] },
  { id: 'k2024a', date: '2024-05-22', form: '讲话', venue: '第六届政府与市场经济学国际研讨会', source: '清华大学 ACCEPT 官网会议综述', url: 'http://www.accept.tsinghua.edu.cn/2024/0522/c838a6180/page.htm', verified: 'primary', themes: ['tournament', 'governance'] },
  { id: 'k2024b', date: '2024-10-28', form: '讲座', venue: '西南政法大学讲座 ·“行政发包制”与国家治理（载《法律和政治科学》总第 8 辑）', source: '《法律和政治科学》（爱思想转载）', url: 'https://www.aisixiang.com/data/178935.html', verified: 'primary', themes: ['governance', 'subcontract'] },
  { id: 'k2024c', date: '2024-12-31', form: '讲座', venue: '北大南燕大讲堂第 117 讲 · 中国特色的政商关系', source: '北京大学新闻网；澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_29860289', verified: 'media', themes: ['dualmarket'] },
  { id: 'k2025a', date: '2025-02-15', form: '署名文章', venue: '委员署名文章 · 履职一年间', source: '人民政协网', url: 'https://www.rmzxw.com.cn/c/2025-02-15/3678988.shtml', verified: 'primary', themes: ['rural'] },
  { id: 'k2025b', date: '2025-04-27', form: '采访', venue: '《人民周刊》2025 年第 6 期专访 · 完善乡村CEO制度', source: '人民周刊', url: 'https://www.peopleweekly.cn/html/2025/renminzhoukan_0427/246439.html', verified: 'media', themes: ['rural'] },
  { id: 'k2025c', date: '2025-11-02', form: '讲座', venue: '上海交通大学国是学者讲坛第 44 期 · 挑选地方冠军', source: '上海交通大学国际与公共事务学院官网', url: 'https://www.sipa.sjtu.edu.cn/show/6445', verified: 'primary', themes: ['industry', 'dualmarket'] },
  { id: 'k2026a', date: '2026-03-27', form: '讲座', venue: '中国人民大学求是讲座第 286 讲 · 治理不可能三角', source: '中国人民大学公共管理学院官网', url: 'http://spap.ruc.edu.cn/xwdt/6c11861fd7a449699c1dc2af246f3470.htm', verified: 'primary', themes: ['governance'] },
  { id: 'k2026b', date: '2026-07-24', form: '论文', venue: '《治理不可能三角》，《社会》2026 年第 46 卷第 3 期，第 1—31 页', source: '《社会》编辑部官网；爱思想转载', url: 'https://www.society.shu.edu.cn/CN/Y2026/V46/I3/1', verified: 'primary', themes: ['governance', 'subcontract'] },
  { id: 'k2026c', date: '2026-08-15', form: '讲座', venue: '北大光华 EMBA 天津站讲座', source: 'MBAChina 网转载', url: 'https://www.mbachina.com/html/mbachina/202608/657702.html', verified: 'reprint', themes: ['industry', 'dualmarket'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 晋升锦标赛与官员激励 ——
  { id: 't1', k: 'k2004', theme: 'tournament', type: '原话', text: '对于那些利己不利人的事情激励最充分，而对于那些既利己又利人的“双赢”合作则激励不足。' },
  { id: 't2', k: 'k2004', theme: 'tournament', type: '转述', text: '以晋升博弈中的相对位次竞争解释地方保护主义与重复建设长期存在：官员关心的是相对排名而非绝对增长，合作收益被竞争对手分享时合作动力弱。' },
  { id: 't3', k: 'k2005', theme: 'tournament', type: '转述', text: '与李宏彬合作，基于 1979—1995 年省级党政领导数据发现：辖区经济绩效越好晋升概率越高，且晋升对任期内平均绩效比对当年绩效更敏感（合著结论）。' },
  { id: 't4', k: 'k2007', theme: 'tournament', type: '原话', text: '晋升锦标赛作为中国政府官员的激励模式，它是中国经济奇迹的重要根源，但由于晋升锦标赛自身的一些缺陷，尤其是其激励官员的目标与政府职能的合理设计之间存在严重冲突，它目前正面临着重要的转型。' },
  { id: 't5', k: 'k2007', theme: 'tournament', type: '原话', text: '晋升锦标赛使得地方官员是地区间晋升博弈的运动员，同时政府职能要求他们又必须是辖区内市场经济的裁判员，这两者存在内在的角色冲突，政府职能转换之艰难便源于此。' },
  { id: 't6', k: 'k2007', theme: 'tournament', type: '原话', text: '由于晋升职位总是有限的，晋升锦标赛具有一种“赢家通吃”和“零和博弈”的特征，一人提升势必降低别的竞争者的晋升机会' },
  { id: 't7', k: 'k2007', theme: 'tournament', type: '转述', text: '认为增设综合指标只是局部改进，更根本的转型方向是引入辖区公众满意度、人大政协监督、差额选举与媒体监督等自下而上的评价与约束。' },
  { id: 't8', k: 'k2018c', theme: 'tournament', type: '转述', text: '与吴敏合作发现：城市党委书记、市长任期与可视性公共品支出呈倒 U 型关系，约在任期第 3 年达峰；非可视性公共品无此关系（合著结论）。' },
  { id: 't9', k: 'k2019', theme: 'tournament', type: '转述', text: '合作研究以 Tullock 竞赛模型刻画多层级锦标赛中的目标设定，预测并以省级、地级市数据检验经济增长目标沿行政层级自上而下逐级放大（合著结论）。' },
  { id: 't10', k: 'k2022a', theme: 'tournament', type: '转述', text: '综述晋升锦标赛的理论与实证文献，回应并澄清常见误解与质疑，同时检视现有研究的不足与局限（据期刊摘要）。' },
  { id: 't11', k: 'k2024a', theme: 'tournament', type: '转述', text: '据主办方综述：地方官员竞争已由单一增长指标转向多目标考核，出现部分官员成为"全能冠军"、部分官员"躺平"的分化。' },

  // —— 行政发包制与央地关系 ——
  { id: 's1', k: 'k2014', theme: 'subcontract', type: '原话', text: '行政发包制类似于在科层制内部引入“分封”和“包干”的因素，或者说在科层制的外壳之下置入“发包制”的灵魂，是一种混合或中间形态的组织类型(hybrid form)。' },
  { id: 's2', k: 'k2014', theme: 'subcontract', type: '原话', text: '更为关键的是，对于上级指定的任务目标，下级政府通常需要全力调动自身的财政和其他资源去完成，经常的情况是“中央请客，地方买单”或“上级点菜，下级买单”。' },
  { id: 's3', k: 'k2014', theme: 'subcontract', type: '转述', text: '从行政权分配、经济激励（财政分成与预算包干）、内部控制（结果导向的考核）三个维度刻画行政发包制，与韦伯式科层制和外包制相区分。' },
  { id: 's4', k: 'k2018a', theme: 'subcontract', type: '原话', text: '纵向行政发包与横向的政治锦标赛相互结合、相互作用塑造了中国政府治理的基本特征。' },
  { id: 's5', k: 'k2022b', theme: 'subcontract', type: '原话', text: '作为承包方的基层政府只能“拆东墙补西墙”，紧急调配资源，临时应付检查，或者采取合谋变通的策略主义、形式主义的“避责”“躺平”策略等等；专项运动结束，考核压力放松之后，一切就会回到原初状态。' },
  { id: 's6', k: 'k2023b', theme: 'subcontract', type: '转述', text: '据主办方报道：追溯行政发包制的历史渊源，以"寓分封于郡县中"概括帝制中国郡县制框架下的发包因素。' },
  { id: 's7', k: 'k2013', theme: 'subcontract', type: '转述', text: '认为央地关系长期在"一放就乱、一收就死"之间循环，改革不能只在收权放权上绕圈子，需同时建立自上而下与自下而上的监督。' },

  // —— 官场+市场与政商关系 ——
  { id: 'm1', k: 'k2018b', theme: 'dualmarket', type: '原话', text: '中国“官场+市场”的增长模式在总体上提供了这三个关键条件，在最积极的意义上实现了辖区内政治企业家与民间企业家精神的结合，政治精英与经济精英的结合，中国历史悠久的官僚政治传统与西方国家市场经济传统的结合，为我们揭示中国增长之谜开辟了新的视角。' },
  { id: 'm2', k: 'k2018b', theme: 'dualmarket', type: '转述', text: '将增长的三个关键条件概括为"把事做对""防止做坏事""做对的事"，认为官员在官场的竞争与企业在市场的竞争相互嵌套、相互约束。' },
  { id: 'm3', k: 'k2020a', theme: 'dualmarket', type: '原话', text: '官场竞争有更多零和博弈的性质，这跟市场竞争的逻辑完全不一致，这种不一致，会导致各种各样的问题出现。' },
  { id: 'm4', k: 'k2020a', theme: 'dualmarket', type: '转述', text: '认为市场竞争为官场竞争提供信息反馈与纠错回路，地方官员的决策须经受辖区企业在市场中的检验。' },
  { id: 'm5', k: 'k2021', theme: 'dualmarket', type: '转述', text: '提出"地区增长联盟"：地方官员"政绩"与企业"业绩"相互绑定，政商关系呈制度化与人格化混合形态，在一定程度上弥补了国家层面对民营企业制度性保护的不足。' },
  { id: 'm6', k: 'k2024c', theme: 'dualmarket', type: '转述', text: '据报道：主张政商关系由"地区增长联盟"迈向"地区发展联盟"，在"亲""清"框架下减少寻租空间。' },

  // —— 地方债与土地财政 ——
  { id: 'f1', k: 'k2013', theme: 'fiscal', type: '原话', text: '如果当前地方政府的治理模式不改变，规模庞大的地方债的偿付风险最终只会转嫁到中央政府头上。' },
  { id: 'f2', k: 'k2013', theme: 'fiscal', type: '转述', text: '将地方债扩张归因于预算软约束：地方预期上级兜底，举债决策与偿债责任分离。' },
  { id: 'f3', k: 'k2018a', theme: 'fiscal', type: '原话', text: '近十年来投融资平台的兴起和发展以及地方债的积累是财政二元性的延伸，是地方政府以各种金融手段应对事权与财权不对等的结果。' },
  { id: 'f4', k: 'k2018a', theme: 'fiscal', type: '转述', text: '建议将地方政府债务与长期生态效应纳入考核，并由中央承担更多支出责任、加大转移支付以缓解事权财权不对等。' },
  { id: 'f5', k: 'k2015', theme: 'fiscal', type: '转述', text: '合著研究以 2003—2013 年 120 个城市数据测算：除少数一线城市外房价涨幅与收入增长大致相当；低收入购房者房价收入比超过 8，但首付比例通常高于 35%；判断系统性危机并非迫在眉睫，但经济"急停"可能引发房价下跌并放大冲击（合著结论）。' },
  { id: 'f6', k: 'k2020b', theme: 'fiscal', type: '转述', text: '合著研究基于 2000—2011 年约 200 个城市数据：市领导晋升激励每增加 1 个标准差，城市建成区向外扩张约多 9 公里（较均值高约 23%），并有资源错配的提示性证据（合著结论）。' },

  // —— 国家治理与治理不可能三角 ——
  { id: 'g1', k: 'k2018a', theme: 'governance', type: '原话', text: '简言之，传统政府治理更倾向于强激励、弱约束、结果导向，而现代化治理更强调弱激励、强约束、结果与程序并重。' },
  { id: 'g2', k: 'k2018a', theme: 'governance', type: '原话', text: '弱激励和强约束防止了权力滥用，但也有可能带来政府不作为、庸政懒政的问题。' },
  { id: 'g3', k: 'k2013', theme: 'governance', type: '原话', text: '只有约束、没有激励的政府制度，对于当前的中国来说可能太昂贵了，我们暂时还“买不起”。' },
  { id: 'g4', k: 'k2024b', theme: 'governance', type: '原话', text: '在上述三个角中，任意两个刚性组合是可行的，但必须让第三个角保持开放和弹性。三个刚性条件同时满足，在现实中是行不通的。' },
  { id: 'g5', k: 'k2026b', theme: 'governance', type: '原话', text: '当委托人试图强制“三角并行”，即同时要求刚性目标、刚性预算与刚性规则时，组织必然会出现一系列“异常反应”。' },
  { id: 'g6', k: 'k2026b', theme: 'governance', type: '转述', text: '主张以科层制为"底盘"、行政发包为"发动机"、外部承包为补充的混合治理结构，在刚性目标、刚性预算、刚性规则三者之间保留弹性。' },
  { id: 'g7', k: 'k2026a', theme: 'governance', type: '转述', text: '据主办方报道：在中国人民大学求是讲座系统阐述"治理不可能三角"，以此解释基层形式主义与避责行为的组织根源。' },

  // —— 产业政策与有为政府 ——
  { id: 'i1', k: 'k2018b', theme: 'industry', type: '原话', text: '中国经济发展和产业政策的丰富实践所呈现的政府与市场关系、政企关系已经远远超越了林张之争，如果我们仍然恪守传统的政府与市场的关系范式去解析和评判中国产业政策的功过得失，将错失中国四十年经济增长奇迹赋予我们最宝贵的理论创新机会。' },
  { id: 'i2', k: 'k2023a', theme: 'industry', type: '原话', text: '有效市场与有为政府相互依赖、相互促进，不存在分割、分立意义上的有为政府和有效市场，两者更不是二元对立的关系。' },
  { id: 'i3', k: 'k2025c', theme: 'industry', type: '转述', text: '据主办方报道：研究地方政府"挑选冠军企业"，发现税收优惠向冠军企业集中，同时这些企业也面临更多审计，概括为"有约束的绩效主义"。' },
  { id: 'i4', k: 'k2026c', theme: 'industry', type: '转述', text: '据转载稿：以新能源汽车为例，提出中央政府、地方政府、市场的"三分法"与"三性合一"框架解释产业发展（整理稿，未见主办方原文）。' },

  // —— 乡村振兴与乡村CEO ——
  { id: 'r1', k: 'k2025b', theme: 'rural', type: '原话', text: '乡村全面振兴的瓶颈不是资金，也不是资源，而是有创意、有干劲的经营型人才。' },
  { id: 'r2', k: 'k2025b', theme: 'rural', type: '原话', text: '乡村CEO的发展，对于全面推进乡村振兴具有重要的战略意义。' },
  { id: 'r3', k: 'k2025b', theme: 'rural', type: '转述', text: '建议出台全国性指导意见、提高乡村CEO工作在村党支部书记考核中的权重，实行"CEO 管经营、村两委管治理"，将乡村CEO纳入国家职业分类并设立专项基金。' },
  { id: 'r4', k: 'k2025a', theme: 'rural', type: '转述', text: '回顾 2024 年全国两会提交《大力培育乡村CEO、创新人才下乡机制》提案，称已获农业农村部、教育部、人社部答复。' },
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

export const FEATURED = ['t4', 't5', 's1', 'm1', 'f1', 'g3', 'g4', 'i2'];

export const THEME_LINKS = {
  tournament: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/principalagent', label: '委托代理' }],
  subcontract: [{ to: '/govsystem', label: '政府体制' }, { to: '/governance', label: '国家治理' }],
  dualmarket: [{ to: '/private', label: '民营经济' }, { to: '/regional', label: '区域格局' }],
  fiscal: [{ to: '/debt', label: '地方债务' }, { to: '/housing', label: '住房地产' }],
  governance: [{ to: '/governance', label: '国家治理' }, { to: '/reform', label: '改革' }],
  industry: [{ to: '/manufacturing', label: '制造业' }, { to: '/unified-market', label: '统一大市场' }],
  rural: [{ to: '/rural', label: '乡村' }],
};

export const THEME_INTRO = {
  tournament: '其最具辨识度的一条线：以相对绩效排名的晋升竞争解释地方官员"为增长而竞争"，同时指出零和博弈、运动员与裁判员角色冲突带来的扭曲；实证争议见"争议"栏。',
  subcontract: '"行政发包制"刻画纵向的央地与上下级关系——科层外壳下的分封与包干，属地管理、结果考核与财政包干相互配套，并与横向锦标赛共同构成其政府治理分析框架。',
  dualmarket: '"官场+市场"把官员在政治市场的竞争与企业在经济市场的竞争视为相互嵌套的双重竞争，延伸到"地区增长联盟"与政商关系研究。',
  fiscal: '将地方债与融资平台视为"财政二元性"与事权财权不对等的延伸，2013 年即提出偿付风险终将上移至中央；房价与城市扩张的判断主要来自合著实证研究。',
  governance: '从"强激励弱约束"向"弱激励强约束"的治理转型出发，2024—2026 年提出"治理不可能三角"：刚性目标、刚性预算、刚性规则三者不可同时满足。',
  industry: '主张跳出"林张之争"式的政府—市场二分，强调有为政府与有效市场相互塑造；近年研究地方政府挑选冠军企业的激励与约束。',
  rural: '担任全国政协委员后的履职重点：以"乡村CEO"为抓手推动经营型人才下乡，提案与采访给出了可对照的政策清单。',
};

// ============================================================================
// 预判检验台账：只收可被政策事实检验的前瞻性表述；对照截至核验日
// "兑现"仅指政策走向与表述一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2007-07', venue: '《经济研究》2007 年第 7 期',
    url: 'https://www.aisixiang.com/data/18217.html',
    claim: '晋升锦标赛……目前正面临着重要的转型。',
    check: '2013-12 中组部《关于改进地方党政领导班子和领导干部政绩考核工作的通知》：不再把地区生产总值及增长率作为主要指标、不搞 GDP 排名，对限制开发区域取消 GDP 考核，并把政府债务状况作为重要考核指标。考核体系的转向与其判断一致。',
    dataSrc: '新华网 2013-12-09 转发中组部通知',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2007-07', venue: '《经济研究》2007 年第 7 期',
    claim: '更根本的转型需引入公众满意度、人大政协监督、差额选举与媒体监督',
    check: '2013 年后考核改革以上级主导的多指标考核为主，未见以辖区公众满意度或差额选举作为地方主官晋升核心机制的全国性制度安排；属方向性建议，难以闭环。',
    dataSrc: '中组部 2013 年政绩考核通知；公开制度文件（检索截至 2026-09）',
  },
  {
    id: 'L3', status: 'done', type: '原话', date: '2018-05-25', venue: '澎湃新闻署名文章',
    url: 'https://www.thepaper.cn/newsDetail_forward_2138337',
    claim: '弱激励和强约束防止了权力滥用，但也有可能带来政府不作为、庸政懒政的问题。',
    check: '2018-05 中办印发《关于进一步激励广大干部新时代新担当新作为的意见》，建立容错纠错机制、提出"三个区分开来"；政府网 2018-05-24 报道援引地方组织部门所称"为了不出事、宁愿不干事"现象；2024-08 中办国办印发《整治形式主义为基层减负若干规定》。问题被官方确认并出台对策。',
    dataSrc: '新华网 2018-05-20；中国政府网 2018-05-24、2024-08',
  },
  {
    id: 'L4', status: 'open', type: '原话', date: '2013-11-29', venue: '《中国青年报》专访',
    url: 'https://zqb1.cyol.com/html/2013-11/29/nw.D110000zgqnb_20131129_1-07.htm',
    claim: '如果当前地方政府的治理模式不改变，规模庞大的地方债的偿付风险最终只会转嫁到中央政府头上。',
    check: '2024-11 财政部宣布 6 万亿元置换额度 + 5 年每年 8000 亿元新增专项债，合计 10 万亿元化债资源，隐性债务由 2023 年末 14.3 万亿元降至 2028 年前 2.3 万亿元（财政部口径）。中央提供额度与政策支持，但置换债仍由地方政府作为债务人偿还，风险是否"转嫁中央"取决于口径，尚难定论。',
    dataSrc: '财政部 2024-11-08 新闻发布会（蓝佛安）',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2004-06', venue: '《经济研究》2004 年第 6 期',
    url: 'https://www.aisixiang.com/data/9048.html',
    claim: '对于那些利己不利人的事情激励最充分，而对于那些既利己又利人的“双赢”合作则激励不足。',
    check: '该文以晋升博弈解释地方保护与重复建设的长期性。2024-08-01《公平竞争审查条例》施行；2025-01 国家发展改革委发布《全国统一大市场建设指引（试行）》；2025 年政府工作报告提出综合整治"内卷式"竞争。地方保护与重复建设问题持续存在并成为中央专项治理对象，与其"长期存在"的判断一致。',
    dataSrc: '中国政府网；国家发展改革委；2025 年政府工作报告',
  },
  {
    id: 'L6', status: 'open', type: '转述', date: '2024-05-22', venue: '第六届政府与市场经济学国际研讨会（主办方综述）',
    claim: '多目标考核下地方官员出现"全能冠军"与"躺平"分化',
    check: '属结构性判断，缺乏可公开检验的官员行为统计；官方以基层减负、容错纠错等文件回应"不作为"问题，但分化程度无法量化。',
    dataSrc: '中办国办 2024-08 基层减负规定（间接）',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2024-12-31', venue: '北大南燕大讲堂第 117 讲（媒体报道）',
    claim: '政商关系由"地区增长联盟"迈向"地区发展联盟"',
    check: '方向性判断，暂无可量化指标；2025 年《民营经济促进法》等制度建设可作参照，但与其概念的对应关系未经其本人阐明。',
    dataSrc: '公开报道（检索截至 2026-09）',
  },
  {
    id: 'L8', status: 'done', type: '转述', date: '2025-04-27', venue: '《人民周刊》专访',
    url: 'https://www.peopleweekly.cn/html/2025/renminzhoukan_0427/246439.html',
    claim: '将乡村CEO纳入国家职业分类',
    check: '2025-07 人社部等发布 17 个新职业，其中含"农村集体经济经理人"。职业名称与"乡村CEO"不完全一致，且无证据表明与其提案存在因果关系，仅记为方向一致。',
    dataSrc: '21世纪经济报道 2025-07-23',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2025-04-27', venue: '《人民周刊》专访',
    claim: '出台乡村CEO全国性指导意见、设立专项基金',
    check: '至核验日未检索到以"乡村CEO"为名的全国性指导意见或专项基金；农业农村部 2026 年相关实施意见未见独立条目。',
    dataSrc: '农业农村部公开文件（检索截至 2026-09）',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2018-05-25', venue: '澎湃新闻署名文章',
    claim: '中央承担更多支出责任、加大转移支付',
    check: '2024-07 二十届三中全会决定提出"适当加强中央事权、提高中央财政支出比例"。已写入改革部署，但中央支出比例的落地数据尚待后续预算执行报告。',
    dataSrc: '《中共中央关于进一步全面深化改革 推进中国式现代化的决定》（2024-07）',
  },
  {
    id: 'L11', status: 'done', type: '转述', date: '2015-04', venue: 'NBER WP 21112（合著）',
    url: 'https://www.nber.org/books-and-chapters/nber-macroeconomics-annual-2015-volume-30/demystifying-chinese-housing-boom',
    claim: '系统性住房金融危机并非迫在眉睫，但"急停"可能引发房价下跌并放大冲击',
    check: '2016—2020 年未出现系统性金融危机；2021 年后房地产进入深度调整，70 城二手住宅价格较峰值累计约 -23.42%（至 2026-08），2026 年 1—8 月房地产开发投资同比 -19.9%，未演变为银行体系危机。两段判断均与事后走势相符；属合著结论。',
    dataSrc: '国家统计局 70 城价格指数与房地产开发投资（本站住房模块）',
  },
];

// 周黎安公开表述以机制论证为主，少见可与官方统计直接比对的数值口径，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '晋升锦标赛', '行政发包', '官场+市场', '财政与债务', '治理理论'],
  nodes: [
    { id: 'core', name: '地方官员激励\n与政府治理', cat: 0, size: 58 },
    { id: 'tour', name: '晋升锦标赛', cat: 1, size: 40 },
    { id: 'relperf', name: '相对绩效考核', cat: 1, size: 28 },
    { id: 'target', name: '目标逐级加码', cat: 1, size: 24 },
    { id: 'visible', name: '可视性公共品', cat: 1, size: 22 },
    { id: 'zerosum', name: '零和博弈 / 地方保护', cat: 1, size: 28 },
    { id: 'subc', name: '行政发包制', cat: 2, size: 40 },
    { id: 'shudi', name: '属地管理 · 结果考核', cat: 2, size: 26 },
    { id: 'zhongyang', name: '上级点菜 下级买单', cat: 2, size: 26 },
    { id: 'history', name: '寓分封于郡县', cat: 2, size: 22 },
    { id: 'dual', name: '官场+市场', cat: 3, size: 38 },
    { id: 'coalition', name: '地区增长联盟', cat: 3, size: 28 },
    { id: 'champion', name: '挑选地方冠军', cat: 3, size: 22 },
    { id: 'double', name: '有为政府 × 有效市场', cat: 3, size: 26 },
    { id: 'softbc', name: '预算软约束', cat: 4, size: 26 },
    { id: 'debt', name: '财政二元性 / 地方债', cat: 4, size: 32 },
    { id: 'sprawl', name: '城市扩张', cat: 4, size: 22 },
    { id: 'weak', name: '弱激励 强约束', cat: 5, size: 28 },
    { id: 'triangle', name: '治理不可能三角', cat: 5, size: 36 },
    { id: 'tangping', name: '避责 / 躺平', cat: 5, size: 24 },
    { id: 'rural', name: '乡村CEO', cat: 5, size: 22 },
  ],
  links: [
    ['core', 'tour'], ['core', 'subc'], ['core', 'dual'], ['core', 'debt'], ['core', 'triangle'],
    ['tour', 'relperf'], ['tour', 'target'], ['tour', 'visible'], ['tour', 'zerosum'], ['tour', 'subc'],
    ['subc', 'shudi'], ['subc', 'zhongyang'], ['subc', 'history'], ['zhongyang', 'debt'],
    ['dual', 'coalition'], ['dual', 'champion'], ['dual', 'double'], ['tour', 'dual'],
    ['softbc', 'debt'], ['tour', 'sprawl'], ['sprawl', 'debt'], ['visible', 'debt'],
    ['weak', 'tangping'], ['triangle', 'tangping'], ['triangle', 'subc'], ['tour', 'weak'], ['rural', 'double'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '晋升锦标赛的实证基础：GDP 增长是否决定晋升',
    sides: [
      { who: '周黎安 / Li & Zhou（2005，JPubE）', view: '省级领导晋升概率与辖区经济绩效正相关，且对任期平均绩效更敏感；2022 年综述回应"常见误解与质疑"（转述）。' },
      { who: '陶然、苏福兵、陆曦、朱昱铭（《管理世界》2010 年第 12 期）', view: '转述：未发现把晋升与 GDP 挂钩的正式分层考核体系，亦未发现省级 GDP 增长影响省级官员晋升的稳健证据。' },
      { who: 'Shih, Adolph & Liu（APSR 2012, 106(1)）', view: '转述：未发现经济增长带来中央委员会排名提升的证据，派系关系、学历与财政汲取更有解释力。' },
      { who: '杨其静、郑楠（《世界经济》2013 年第 12 期）', view: '转述：基于 2003—2012 年地级市书记数据不支持锦标赛假说，更接近以省内前列为门槛的宽松"资格赛"，城市规模有影响。' },
    ],
    note: '分歧部分源于样本层级（省级 vs 地市级）、时段、晋升定义与控制变量不同；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '行政发包制能否解释央地关系的周期变化',
    sides: [
      { who: '周黎安（《社会》2014 年第 6 期）', view: '行政发包制是科层制与发包制之间的混合形态，以行政权分配、经济激励、内部控制三维刻画。' },
      { who: '周雪光（《社会》2014 年第 6 期评论文章）', view: '转述：以"帝国逻辑"视角提出集权—分权的周期模型，认为"上收—下放"的循环变化未被行政发包概念充分捕捉。' },
    ],
    note: '两文同期刊发于《社会》2014 年第 6 期，属对话式讨论；周黎安 2022、2024 年论文继续讨论发包制的历史渊源与国家能力。',
  },
  {
    id: 'x3',
    title: '地方债扩张的主因：官员激励还是财政压力',
    sides: [
      { who: '激励解释（周黎安等）', view: '转述：晋升激励与预算软约束驱动举债投资，债务是"财政二元性"与事权财权不对等的延伸。' },
      { who: '聂卓、李力行、马光荣（《地方债务治理再思考：财政政策模式的视角》）', view: '转述：梳理"官员激励"与"财政压力"两类解释，提出从财政政策模式角度理解地方债务。' },
    ],
    note: '聂卓等文为综合性再思考而非对周黎安的直接反驳，此处按解释路径并陈。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '搜索引擎摘要、自媒体所称"周黎安谈新能源汽车内卷""周黎安谈化债"等具体表态', status: '不收录', reason: '未找到对应原文、主办方或署名出处，疑为机器摘要拼接或转述失真。' },
  { id: 'q2', item: '"国家文科一级教授"头衔', status: '〔存疑〕', reason: '仅见 MBAChina 2026 年转载稿，本人简历与北大官方页面均未载。' },
  { id: 'q3', item: '北大博雅特聘教授 / 博雅讲席教授的称谓出入', status: '已核', reason: '本人简历：2016-05 至 2025-04 博雅特聘教授，2025-05 起博雅讲席教授；不同年份报道称谓不一属时间差。' },
  { id: 'q4', item: '经济与管理学部主任任职起点', status: '并陈', reason: '本人简历作 2022-01，百度百科作 2022-04。' },
  { id: 'q5', item: 'REStat 论文卷号', status: '更正', reason: '北大实验室页面作 "120(5)"，RePEc 记录为 102(5): 897—911（2020），以后者为准。' },
  { id: 'q6', item: '《学术月刊》2023 年论文副题"双向塑造"/"双重塑造"', status: '并陈', reason: '期刊与爱思想转载作"双向塑造"，本人简历目录作"双重塑造"，以期刊为准。' },
  { id: 'q7', item: '2025-10-31 SAGE 讲座', status: '不收录', reason: '仅见活动预告，未见讲座内容报道或整理稿。' },
  { id: 'q8', item: '《转型中的地方政府》版次与出版社', status: '并陈', reason: '第一版（2008-11）为格致出版社；第二版（2017-08）为格致出版社、上海三联书店、上海人民出版社联合出版。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
