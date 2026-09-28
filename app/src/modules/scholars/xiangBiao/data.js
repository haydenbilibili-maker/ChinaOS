// ============================================================================
// 学者专栏 · 项飙 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 视频节目（十三邀等）仅引用官方文字稿或主流媒体报道部分；网传“项飙语录”未见原始出处者一律不收录。
// 项飙不做经济预测：台账只收可被事实检验的社会判断，无可比数据者归 open。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  migration: { label: '流动人口与城市化', color: '#22d3ee' },
  labor: { label: '劳动与全球流动', color: '#e8a317' },
  youth: { label: '青年·内卷·悬浮', color: '#c41e3a' },
  nearby: { label: '附近与社会重建', color: '#10b981' },
  mentality: { label: '社会心态与公共讨论', color: '#8b5cf6' },
  method: { label: '方法论：把自己作为方法', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '项飙',
  born: '1972 年 · 浙江温州',
  summary:
    '社会人类学者。北京大学社会学系本科、硕士期间在北京“浙江村”做了六年田野调查，写成《跨越边界的社区》（2000）；牛津大学博士论文研究印度 IT 劳务“猎身”体制，出版为 Global "Body Shopping"（普林斯顿大学出版社，2006）。2010—2021 年任牛津大学讲师、社会人类学教授；2021 年 9 月起全职出任德国马克斯·普朗克社会人类学研究所所长，2024 年 2 月起任该所执行所长。在中文公共讨论中以“悬浮”“附近”“把自己作为方法”等概念及对“内卷”的讨论知名，不做经济预测。',
  current: [
    '马克斯·普朗克社会人类学研究所所长（经济实验人类学部）',
    '马克斯·普朗克社会人类学研究所执行所长（2024-02 起）',
    '《中国季刊》执行编委（2018 起，据 MPI 简历）',
  ],
  sources: '马克斯·普朗克社会人类学研究所官网简历与新闻稿；马普学会人物页；普林斯顿大学出版社、杜克大学出版社书目页；澎湃新闻、界面新闻、联合早报等报道。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 10,
  subtitle: '人物履历 · 浙江村与猎身 · 悬浮与内卷 · 附近 · 把自己作为方法',
  span: '2000—2026',
  careerTitle: '履历时间线 · 北大与浙江村 → 牛津 → 马普所',
  defaultTheme: 'youth',
  moduleId: 'scholarXiangBiao',
  sourceNote: '著作原书 / 出版社书目页 / 马普所官网 / 主流媒体采访与演讲报道 · 对照数据：国家统计局分年龄组失业率、国家公务员局、国务院及教育部政策文本',
};

export const CAREER_GROUPS = {
  edu: { label: '求学', color: '#94a3b8' },
  field: { label: '田野与社群', color: '#10b981' },
  ox: { label: '牛津', color: '#22d3ee' },
  mpi: { label: '马普所', color: '#c41e3a' },
  other: { label: '其他机构', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '北京大学社会学系本科、硕士', org: '北京', start: 1990.7, end: 1998.5, group: 'edu', note: 'MPI 简历：1990 年入学（1990—1991 军训一年），1995 年本科、1998 年硕士；百度百科作 1992 年入学，并陈' },
  { id: 'c2', role: '北京“浙江村”田野调查', org: '北京', start: 1992.0, end: 1998.5, group: 'field' },
  { id: 'c3', role: '京温市场“爱心会”创始成员（流动人口自治组织）', org: '北京', start: 1994.0, end: 1995.9, group: 'field' },
  { id: 'c4', role: '牛津大学社会人类学博士（论文 Global Body Shopping）', org: '英国牛津', start: 1998.7, end: 2003.0, group: 'edu' },
  { id: 'c5', role: '国际移民组织研究官员', org: '瑞士日内瓦', start: 2002.0, end: 2002.9, group: 'other', note: 'MPI 简历仅列年份，起止月份未核〔存疑〕' },
  { id: 'c6', role: '新加坡国立大学亚洲研究所博士后', org: '新加坡', start: 2003.0, end: 2004.9, group: 'other' },
  { id: 'c7', role: '劳动和社会保障部境外就业国家顾问组成员', org: '北京', start: 2006.0, end: 2007.9, group: 'other' },
  { id: 'c8', role: 'RCUK 学术研究员（牛津 ISCA / COMPAS）', org: '英国牛津', start: 2005.0, end: 2010.0, group: 'ox' },
  { id: 'c9', role: '牛津大学移民研究硕士项目主任', org: '英国牛津', start: 2009.0, end: 2019.9, group: 'ox' },
  { id: 'c10', role: '牛津大学讲师 → 社会人类学教授；圣休学院研究员', org: '英国牛津', start: 2010.0, end: 2021.7, group: 'ox' },
  { id: 'c11', role: '马普社会人类学研究所所长（经济实验人类学部）', org: '德国哈勒', start: 2020.3, end: 2026.75, group: 'mpi', note: '2020-04 接受任命并兼职到任；2021-09-01 起全职' },
  { id: 'c12', role: '马普社会人类学研究所执行所长', org: '德国哈勒', start: 2024.08, end: 2026.75, group: 'mpi', note: 'MPI 新闻稿：2024-02-01 起' },
  { id: 'c13', role: '南洋理工大学南洋公共管理研究生院访问学者', org: '新加坡', start: 2026.6, end: 2026.75, group: 'other', note: '联合早报 2026-08 报道提及；起止时间未核〔存疑〕' },
];

export const BOOKS = [
  { id: 'b1', year: 2000, title: '跨越边界的社区：北京“浙江村”的生活史', publisher: '生活·读书·新知三联书店', date: '2000-01', isbn: '9787108014368', themes: ['migration'], verified: 'primary', note: '据作者修订版序，原稿成书于 1998 年' },
  { id: 'b2', year: 2005, title: 'Transcending Boundaries（《跨越边界的社区》英译本）', publisher: 'Brill', themes: ['migration'], verified: 'primary', note: '作者序称 2001 年为准备英译本删去全书约三分之一' },
  { id: 'b3', year: 2006, title: 'Global "Body Shopping": An Indian Labor System in the Information Technology Industry', publisher: 'Princeton University Press', date: '2006-11', isbn: '9780691118529', themes: ['labor'], verified: 'primary', note: '出版社页面标 2006-11-26 出版，版权页 2007；精装 ISBN 9780691118512；获 2008 年美国人类学会 Anthony Leeds 奖' },
  { id: 'b4', year: 2012, title: '全球“猎身”：世界信息产业和印度的技术劳工', publisher: '北京大学出版社', date: '2012-01', isbn: '9787301182444', coauthors: '王迪 译', themes: ['labor'], verified: 'primary', note: '部分作者简介写作 2010 年出版，以版权页 2012-01 为准' },
  { id: 'b5', year: 2013, title: 'Return: Nationalizing Transnational Mobility in Asia', publisher: 'Duke University Press', date: '2013-10', isbn: '9780822355311', coauthors: 'Brenda S. A. Yeoh、Mika Toyota（合编）', themes: ['labor', 'migration'], verified: 'primary' },
  { id: 'b6', year: 2018, title: '跨越边界的社区：北京“浙江村”的生活史（修订版）', publisher: '生活·读书·新知三联书店（生活书店出品）', date: '2018-03', isbn: '9787807681885', themes: ['migration', 'method'], verified: 'primary', note: '“中国社会学经典文库”；新增修订版序、序二、序三；部分书目出版者作“生活书店出版有限公司”' },
  { id: 'b7', year: 2020, title: '把自己作为方法——与项飙谈话', publisher: '上海文艺出版社（单读）', date: '2020-07', isbn: '9787532176953', coauthors: '吴琦', themes: ['method', 'youth', 'mentality'], verified: 'primary' },
  { id: 'b8', year: 2025, title: '你好，陌生人', publisher: '中信出版集团', date: '2025-05', isbn: '9787521775259', coauthors: '刘小东、何袜皮、李一凡、刘悦来、沈志军、贾冬婷、段志鹏', themes: ['nearby', 'mentality'], verified: 'primary' },
  { id: 'b9', year: null, title: 'Making Money, Making Order', publisher: 'Princeton University Press（作者简介称“即出”）', themes: ['migration'], verified: 'doubt', note: '仅见 2018 年修订版作者简介称即出，出版状态未核〔存疑〕' },
];

/** 讲话 / 采访 / 署名文章 / 著作节选文库 */
export const CORPUS = [
  { id: 'kb2000', date: '2000-01', form: '著作', venue: '《跨越边界的社区：北京“浙江村”的生活史》', source: '生活·读书·新知三联书店', verified: 'primary', themes: ['migration'] },
  { id: 'kb2006', date: '2006-11', form: '著作', venue: 'Global "Body Shopping"（出版社书目介绍）', source: 'Princeton University Press', url: 'https://press.princeton.edu/books/paperback/9780691118529/global-body-shopping', verified: 'primary', themes: ['labor'] },
  { id: 'k2014', date: '2014-12-17', form: '采访', venue: '界面·正午专访《中国人像蜂鸟，振动翅膀悬在空中》（记者郭玉洁）', source: '界面新闻', url: 'https://www.jiemian.com/article/215429.html', verified: 'media', themes: ['migration', 'youth', 'mentality'] },
  { id: 'k2015', date: '2015-12', form: '署名文章', venue: '《中国社会科学“知青时代”的终结》（《文化纵横》2015 年第 12 期）', source: '文化纵横（澎湃新闻 2015-12-09 转载）', url: 'https://m.thepaper.cn/newsDetail_forward_1405189', verified: 'primary', themes: ['method'] },
  { id: 'kb2018', date: '2018-03', form: '著作', venue: '《跨越边界的社区》修订版序', source: '生活·读书·新知三联书店（腾讯新闻 2024-11-08 转载）', url: 'https://news.qq.com/rain/a/20241108A06YUB00', verified: 'reprint', themes: ['method', 'migration'] },
  { id: 'k2019', date: '2019-11-29', form: '采访', venue: '《十三邀》第四季对谈许知远（单读整理文字稿）', source: '凤凰网文化', url: 'https://culture.ifeng.com/c/7ryYxaJB7UG', verified: 'media', themes: ['nearby', 'method'] },
  { id: 'kb2020', date: '2020-07-15', form: '著作', venue: '《把自己作为方法》节选（单读）', source: '上海文艺出版社；澎湃号·湃客 单读', url: 'https://www.thepaper.cn/newsDetail_forward_8267615', verified: 'primary', themes: ['method', 'mentality'] },
  { id: 'k2020', date: '2020-10-22', form: '采访', venue: '澎湃新闻专访 · 内卷（记者王芊霓、葛诗凡）', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_9648585', verified: 'media', themes: ['youth', 'labor'] },
  { id: 'kp2021', date: '2021', form: '论文', venue: 'Suspension: Seeking Agency for Change in the Hypermobile World（Pacific Affairs 94(2) 专刊导言）', source: 'Pacific Affairs（doi:10.5509/2021942233）', verified: 'primary', themes: ['youth'] },
  { id: 'k2021a', date: '2021-04-29', form: '采访', venue: '青年志 Youthology 访谈 · 城市新穷人与大厂', source: '青年志（腾讯新闻转载）', url: 'https://news.qq.com/rain/a/20210429A08HC000', verified: 'reprint', themes: ['labor', 'mentality'] },
  { id: 'k2021b', date: '2021-06-02', form: '采访', venue: 'BBC 中文报道 · 躺平与内卷（记者王凡）', source: 'BBC 中文', url: 'https://www.bbc.com/zhongwen/simp/chinese-news-57304453', verified: 'media', themes: ['youth', 'mentality'] },
  { id: 'k2021c', date: '2021', form: '讲话', venue: '《把自己作为方法》出版一年后直播对谈', source: '界面新闻', url: 'https://www.jiemian.com/article/6391144.html', verified: 'media', themes: ['mentality', 'labor'] },
  { id: 'k2022a', date: '2022-04', form: '讲话', venue: '“看见最初500米”工作坊（广州，与何志森、段志鹏）', source: '景观中国网（活动页转载）', url: 'https://landscape.cn/event/2403.html', verified: 'reprint', themes: ['nearby'] },
  { id: 'k2022b', date: '2022-08-04', form: '采访', venue: '腾讯新闻谷雨专访（记者王竞）', source: '腾讯新闻', url: 'https://news.qq.com/rain/a/20220804A01CSC00', verified: 'media', themes: ['mentality', 'youth'] },
  { id: 'k2022c', date: '2022-10-29', form: '讲话', venue: '三联人文城市光谱论坛演讲（全文 2022-11-21 刊发）', source: '三联生活周刊', url: 'https://www.lifeweek.com.cn/h5/article/detail.do?artId=187237', verified: 'primary', themes: ['nearby'] },
  { id: 'k2023a', date: '2023-06-02', form: '讲话', venue: '与青年学者线上交流', source: '学术桥（2023-07-03 刊发）', url: 'https://www.acabridge.cn/pinglun/202307/t20230703_2450317.shtml', verified: 'reprint', themes: ['mentality'] },
  { id: 'k2023b', date: '2023-06-19', form: '讲话', venue: '澎湃研究所对谈袁长庚 · 考公与工作（对谈 2023-06-16）', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_23537116', verified: 'media', themes: ['youth', 'labor'] },
  { id: 'k2023c', date: '2023-10-04', form: '采访', venue: '《当代青年研究》2023 年第 5 期访谈（康岚）', source: '当代青年研究（澎湃新闻转载）', url: 'https://www.thepaper.cn/newsDetail_forward_24823590', verified: 'media', themes: ['nearby', 'youth', 'migration'] },
  { id: 'k2024', date: '2024-12-25', form: '采访', venue: '青年志 Youthology 对谈 · 教育系统', source: '青年志（腾讯新闻转载）', url: 'https://news.qq.com/rain/a/20241225A03JBQ00', verified: 'reprint', themes: ['youth'] },
  { id: 'kb2025', date: '2025-05-21', form: '著作', venue: '《你好，陌生人》引言节选', source: '中信出版集团（官方号，腾讯新闻）', url: 'https://news.qq.com/rain/a/20250521A0648E00', verified: 'primary', themes: ['nearby', 'mentality'] },
  { id: 'k2026a', date: '2026-02-16', form: '采访', venue: '联合早报“未来365”专访（记者胡文雁，摄于北京大学）', source: '联合早报', url: 'https://www.zaobao.com.sg/news/singapore/story20260216-8341455', verified: 'media', themes: ['youth'] },
  { id: 'k2026b', date: '2026-04-06', form: '讲座', venue: '中山大学讲座', source: '南方都市报（网易号）', url: 'https://m.163.com/dy/article/KPRTAMS005129QAF.html', verified: 'media', themes: ['mentality', 'method'] },
  { id: 'k2026c', date: '2026-04-14', form: '讲座', venue: '浙江大学讲座“如果已经看清一切，为何还这般心慌”', source: '潮新闻（2026-04-16，记者宋浩）；浙江大学人文社科处预告', url: 'https://tidenews.com.cn/news.html?id=3420434', verified: 'media', themes: ['youth', 'mentality'] },
  { id: 'k2026d', date: '2026-08-22', form: '讲座', venue: '南洋理工大学公开讲座“靠‘证明自己’来‘做自己’？”', source: '联合早报', url: 'https://www.zaobao.com.sg/news/singapore/story20260822-9559308', verified: 'media', themes: ['method', 'mentality'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 流动人口与城市化 ——
  { id: 'm1', k: 'kb2000', theme: 'migration', type: '转述', text: '以 1992—1998 年北京“浙江村”田野为基础，记录温州籍流动人口依托亲缘、乡缘网络在城市边缘自组织生产与生活的过程，以“跨越边界”描述其在户籍、行政区划与市场之间的穿行。' },
  { id: 'm2', k: 'k2014', theme: 'migration', type: '原话', text: '在制度意义上，是被悬浮的。' },
  { id: 'm3', k: 'k2014', theme: 'migration', type: '原话', text: '人的状况一直没有沉淀下来，就靠高频度的换工作来维持，是很脆弱的。' },
  { id: 'm4', k: 'k2014', theme: 'migration', type: '原话', text: '但是2003年以后，社会福利的扩大，三险一金的扩大，可能会有一点改变。但是还得假以时日。' },
  // —— 劳动与全球流动 ——
  { id: 'l1', k: 'kb2006', theme: 'labor', type: '转述', text: '以印度 IT 业“猎身”（body shopping）为对象，分析劳务中介把程序员按项目输送给海外客户的全球劳动体制，说明高技能劳动力如何被当作可调度的“身体”在各国间流转。' },
  { id: 'l2', k: 'k2021a', theme: 'labor', type: '原话', text: '我有一个假设和猜想：大厂这么做的原因，很重要的考虑是控制。' },
  { id: 'l3', k: 'k2021a', theme: 'labor', type: '原话', text: '今天我们看到很多所谓的“城市新穷人”，他们不是“经济穷人”，而是“意义贫困”。' },
  { id: 'l4', k: 'k2023b', theme: 'labor', type: '原话', text: '工作变成了固定下来的劳作，体制内外的区别只是，体制内是稳定的、僵硬的工作，体制外是无规则的工作' },
  { id: 'l5', k: 'k2020', theme: 'labor', type: '转述', text: '以德国学徒制与“工匠精神”为参照，主张以职业的横向分化替代单一纵向排名，作为走出悬浮与内卷的路径。' },
  { id: 'l6', k: 'k2021c', theme: 'labor', type: '转述', text: '区分农民工的艰辛与大厂员工的艰辛，认为二者性质不同，不宜在公共讨论中混为一谈。' },

  // —— 青年·内卷·悬浮 ——
  { id: 'y1', k: 'k2014', theme: 'youth', type: '原话', text: '它的本质不是对未来的追求，而是对现在的否定。这个就是我说的，悬浮。把自己拔起来，悬在空中。' },
  { id: 'y2', k: 'k2020', theme: 'youth', type: '原话', text: '今天的内卷是一个陀螺式的死循环，我们要不断抽打自己，让自己就这么空转，每天不断地自己动员自己。' },
  { id: 'y3', k: 'k2020', theme: 'youth', type: '原话', text: '现在内卷的一个很重要的机制，就是没有退出的机制，不允许你退出。' },
  { id: 'y4', k: 'k2020', theme: 'youth', type: '原话', text: '我们今天讲的内卷的一个很重要的前提条件是不分化，大家认准一个目标，为同一个唯一的目标活着。' },
  { id: 'y5', k: 'k2020', theme: 'youth', type: '原话', text: '所谓的短缺，都是人为的。' },
  { id: 'y6', k: 'k2021b', theme: 'youth', type: '原话', text: '这是一个好事，说明大家开始反思过去的发展模式' },
  { id: 'y7', k: 'k2021b', theme: 'youth', type: '转述', text: '据 BBC 转述，称内卷实质上是一种中产阶级焦虑，对政府而言并非很急切的问题，也没有快捷的解决办法。' },
  { id: 'y8', k: 'k2023b', theme: 'youth', type: '原话', text: '考试现在不仅是手段，更成为一种生存方式。' },
  { id: 'y9', k: 'k2024', theme: 'youth', type: '原话', text: '整个教育体系主要就是一个把人分等的机械，而不是一个真正的培育过程。' },
  { id: 'y10', k: 'kp2021', theme: 'youth', type: '转述', text: '把“悬浮”（xuanfu）界定为 2010 年代中期以来流行的自我描述：在高度流动的世界中，人们为未来暂时搁置当下，狂热的创业能量与政治上的无力感并存。' },
  { id: 'y11', k: 'k2026a', theme: 'youth', type: '原话', text: '悬浮，就是一种被时间控制的感觉。' },
  { id: 'y12', k: 'k2026c', theme: 'youth', type: '原话', text: '他提供的，就是普通家庭能够抓住的东西。' },
  { id: 'y13', k: 'k2026c', theme: 'youth', type: '转述', text: '借本雅明区分“抓住”与“拉网”，认为当下焦虑源于变化太慢——经济下行、机会减少，并把 35 岁视为许多人感受到的关键节点。' },

  // —— 附近与社会重建 ——
  { id: 'n1', k: 'k2019', theme: 'nearby', type: '原话', text: '我不太信任你，但是我们都信任支付宝，对复杂的技术构造出来的抽象系统高度信任。' },
  { id: 'n2', k: 'k2023c', theme: 'nearby', type: '原话', text: '我第一次提“附近”应该是在 2019 年夏天，我跟许知远在“十三邀”节目上的对话。' },
  { id: 'n3', k: 'k2023c', theme: 'nearby', type: '原话', text: '所以这是一种“去空间”的或者说“时间的暴政”吧。' },
  { id: 'n4', k: 'k2023c', theme: 'nearby', type: '原话', text: '“附近”的概念不是要做一个社会的宏观理论，它要发展的是一个“生活的人类学”' },
  { id: 'n5', k: 'k2022c', theme: 'nearby', type: '原话', text: '今天我们的城市生活可以说是功能性过剩，生态性不足。' },
  { id: 'n6', k: 'k2022c', theme: 'nearby', type: '原话', text: '“最初500米”，其实是要把生活变得稍微不愉快一点。' },
  { id: 'n7', k: 'k2022a', theme: 'nearby', type: '转述', text: '2022 年在广州与何志森、段志鹏发起为期三个月的“看见最初500米”工作坊，让参与者观察、记录住所周边 500 米的人与空间，成果于第九届深港城市\\建筑双城双年展展出。' },
  { id: 'n8', k: 'kb2025', theme: 'nearby', type: '原话', text: '21世纪初的中国社会在经历一个更具体的趋势，即陌生人社会的进一步“陌生化”。' },
  { id: 'n9', k: 'kb2025', theme: 'nearby', type: '原话', text: '“非思考”甚至“拒绝思考”的岁月静好和“小确幸”，不能够帮助我们处理今天的生活问题。' },

  // —— 社会心态与公共讨论 ——
  { id: 't1', k: 'k2014', theme: 'mentality', type: '原话', text: '拒绝再分配，这是中国一个重要的社会心态。' },
  { id: 't2', k: 'k2021c', theme: 'mentality', type: '原话', text: '能上社交媒体说话的人，会觉得自己的感受是全世界的感受，或者是全中国的感受，听不到其他群体的声音。这样的情况会把一些问题放大，就会失真。' },
  { id: 't3', k: 'k2022b', theme: 'mentality', type: '原话', text: '以成败来论人生是不对的。但我在想，今天全世界的年轻人，挫败感无力感都那么强，以至他们不能把自己的经验转化成力量，这里的突破口在哪里呢？' },
  { id: 't4', k: 'k2022b', theme: 'mentality', type: '转述', text: '认为今天的中国生产发展程度很高，但“再生产”（生活、养育、照料）还没有走出一条路；主张以对话梳理共同的困惑。' },
  { id: 't5', k: 'k2026b', theme: 'mentality', type: '原话', text: '谎言往往是人对一个扭曲环境、情况的真诚反应。' },
  { id: 't6', k: 'kb2020', theme: 'mentality', type: '原话', text: '我们为什么会焦虑，最直接的原因就是对今天没有清晰的认识，总觉得自己现在所处的地方不对，和自己认为的有差距。' },

  // —— 方法论 ——
  { id: 'd1', k: 'kb2020', theme: 'method', type: '原话', text: '你一定要带入你个人的经验，否则其他东西都是飘着的。理解世界必须要通过自己的切身体会。' },
  { id: 'd2', k: 'kb2020', theme: 'method', type: '原话', text: '社会科学首先是关于你的，然后才是关于社会的。' },
  { id: 'd3', k: 'kb2020', theme: 'method', type: '原话', text: '学术是一种干预，我是一个活人，我对这个活的世界要发出自己的想法。' },
  { id: 'd4', k: 'k2019', theme: 'method', type: '原话', text: '你的出发点必须是现在的困惑，必须是大众的困惑，必须是最新的变化。' },
  { id: 'd5', k: 'k2015', theme: 'method', type: '原话', text: '时代在这里不是一个时间概念，而是指奔向明确未来的运动，体现着对历史方向的自信，对推进历史的使命感和基于此的集体意识。' },
  { id: 'd6', k: 'kb2018', theme: 'method', type: '原话', text: '我之所以能够在“浙江村”毫无计划地泡六年，是因为当时的社会科学研究和教学还没有被正规化。' },
  { id: 'd7', k: 'k2026d', theme: 'method', type: '原话', text: '这个时代，AI在几分钟内就可以生成海量的认可式文章，那社会科学还能怎么做？我认为在学术界之外，无论是项目设计、公司管理甚至是政治上，‘认得’都有它的应用价值。' },
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

export const FEATURED = ['y1', 'y2', 'm2', 'n1', 'n6', 'y8', 'n8', 'd2'];

export const THEME_LINKS = {
  migration: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }],
  labor: [{ to: '/gig', label: '灵活就业' }, { to: '/talent', label: '人才' }],
  youth: [{ to: '/education', label: '教育' }, { to: '/demographic', label: '人口' }],
  nearby: [{ to: '/socialgov', label: '社会治理' }, { to: '/urban', label: '城镇化' }],
  mentality: [{ to: '/consumption', label: '消费' }, { to: '/civilization', label: '文明与心态' }],
  method: [{ to: '/civilization', label: '文明与心态' }],
};

export const THEME_INTRO = {
  migration: '起点是 1990 年代北京“浙江村”：流动人口如何在户籍与行政边界之外自组织。2014 年起把东莞等地高频换工的打工者描述为“制度意义上被悬浮”，并对福利扩大能否让人“沉淀下来”持审慎判断。',
  labor: '从印度 IT“猎身”到大厂作息与体制内外工作，关注劳动如何被中介、平台与组织调度；给出的出路是职业的横向分化与“对别人有用的工作”，而非单一排名。',
  youth: '“悬浮”指为了未来而否定当下的生活状态；“内卷”被其描述为无退出机制、目标单一的一体化竞争。2023 年后延伸到考公与教育分等，2026 年再以“被时间控制”重述悬浮。',
  nearby: '“附近”2019 年在《十三邀》首提，意指被市场与抽象系统挤压掉的中间地带；2022 年以“最初500米”工作坊落地为城市观察实践，2025 年以“陌生人社会的进一步陌生化”延伸。',
  mentality: '关注社会心态的形成机制：拒绝再分配、社交媒体的放大与失真、青年的挫败感与焦虑，强调把个人情绪转化为可讨论的问题。',
  method: '“把自己作为方法”主张以切身经验为起点、以大白话表达，把学术视为对生活世界的干预；同时反思社会科学的“正规化”，2026 年提出以“认得”对照“认可”。',
};

// ============================================================================
// 社会判断检验台账：项飙不做经济预测，此处只收可被事实对照的社会判断；
// 其诊断多为描述性，政策走向与之相近不等于“兑现”，无统一测度者一律 open
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'open', type: '原话', date: '2014-12-17', venue: '界面·正午专访', url: 'https://www.jiemian.com/article/215429.html',
    claim: '但是2003年以后，社会福利的扩大，三险一金的扩大，可能会有一点改变。但是还得假以时日。（指打工者“悬浮”状态）',
    check: '2024-07 国务院《深入实施以人为本的新型城镇化战略五年行动计划》要求全面落实城区常住人口 300 万以下城市取消落户限制，推动农业转移人口在社保、住房、随迁子女教育上与户籍人口同权，并以“努力缩小户籍与常住人口城镇化率差距”为目标——说明差距仍在。“悬浮”是主观状态，缺少可比测度，无法判定。',
    dataSrc: '国发〔2024〕17 号（中国政府网 2024-07-31）',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2020-10-22', venue: '澎湃新闻专访',
    claim: '内卷的关键机制是没有退出机制；主张以横向分化（参照德国学徒制）打开竞争之外的出路',
    check: '2022-05-01 新修订《职业教育法》施行：第三条确立职业教育与普通教育“同等重要地位”，普职关系由“分流”改为“协调发展”；教育部 2022-04-27 称并非取消初中后普职分流。制度文本方向相近，但与其主张无直接因果，“退出成本”也没有统一测度。',
    dataSrc: '《中华人民共和国职业教育法》（教育部官网）；教育部 2022-04-27 新闻发布会',
  },
  {
    id: 'L3', status: 'open', type: '转述', date: '2021-06-02', venue: 'BBC 中文（记者转述）',
    claim: '内卷对政府而言并非很急切的问题，也没有快捷的解决办法',
    check: '2024-07-30 中央政治局会议首提防止“内卷式”恶性竞争，2024-12 中央经济工作会议要求“综合整治”，2025-12 改为“深入整治”。但官方所指是企业价格战与产能扩张，与其所说社会心态层面的内卷口径不同，不能据此判定对错。',
    dataSrc: '新华社 中央政治局会议、中央经济工作会议通稿',
  },
  {
    id: 'L4', status: 'open', type: '原话', date: '2023-06-19', venue: '澎湃研究所对谈', url: 'https://www.thepaper.cn/newsDetail_forward_23537116',
    claim: '考试现在不仅是手段，更成为一种生存方式。（以考公热为例）',
    check: '国考过审人数：2022 年度 212.3 万（澎湃原文引用）→ 2026 年度 371.8 万，录用计划 3.81 万，比例约 98∶1；2026 年度报考年龄上限由 35 岁放宽至 38 岁。数据方向与其描述一致，但原话是诊断而非预测，不作“兑现”判定。',
    dataSrc: '国家公务员局 2025-10-26 通报（界面新闻、中国青年报报道）',
  },
  {
    id: 'L5', status: 'open', type: '转述', date: '2026-04-14', venue: '浙江大学讲座（潮新闻报道）',
    claim: '当下焦虑源于变化太慢——经济下行、机会减少；35 岁成为关键节点',
    check: '16—24 岁（不含在校生）劳动力调查失业率 2026-08 为 18.9%，较上月升 1 个百分点。2023-06 旧口径（含在校生）为 21.3%，2023-08 暂停发布，2024-01 改为新口径，新旧不可直接比较。“焦虑”与“变化快慢”的因果无法用单一统计检验。',
    dataSrc: '国家统计局 2026-09-17 分年龄组失业率；国家统计局 2024-01-17《关于完善分年龄组调查失业率有关情况的说明》',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2022-10-29', venue: '三联人文城市光谱论坛', url: 'https://www.lifeweek.com.cn/h5/article/detail.do?artId=187237',
    claim: '今天我们的城市生活可以说是功能性过剩，生态性不足。（据此提出“最初500米”）',
    check: '2023-11 国办转发《城市社区嵌入式服务设施建设工程实施方案》：选约 50 个试点城市、每城约 100 个社区，2027 年起推开，目标是“就近就便”享有公共服务。政策聚焦社区一级，但以功能性设施为主，是否回应其所说“生态性不足”无法测度。',
    dataSrc: '国办函〔2023〕121 号（中国政府网 2023-11-26）',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2014-12-17', venue: '界面·正午专访',
    claim: '中国对外移民呈“上升化”：主体转向高学历、有资产人群，并伴随资本转移',
    check: '官方未发布按学历或资产分层的出境移民统计；第三方机构的高净值人群流出估算方法存在争议，暂无可比口径。',
    dataSrc: '无官方可比数据',
  },
];

export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '流动与户籍', '劳动与全球流动', '悬浮与内卷', '附近与陌生人', '方法'],
  nodes: [
    { id: 'core', name: '把自己作为方法\n生活的人类学', cat: 0, size: 58 },
    { id: 'zjc', name: '浙江村', cat: 1, size: 36 },
    { id: 'hukou', name: '户籍与流动', cat: 1, size: 28 },
    { id: 'hop', name: '高频换工', cat: 1, size: 24 },
    { id: 'emig', name: '移民上升化', cat: 1, size: 22 },
    { id: 'bodyshop', name: '猎身', cat: 2, size: 34 },
    { id: 'bigco', name: '大厂与控制', cat: 2, size: 26 },
    { id: 'craft', name: '工匠 · 横向分化', cat: 2, size: 26 },
    { id: 'xuanfu', name: '悬浮', cat: 3, size: 40 },
    { id: 'neijuan', name: '内卷（无退出）', cat: 3, size: 36 },
    { id: 'tangping', name: '躺平', cat: 3, size: 24 },
    { id: 'exam', name: '考试作为生存方式', cat: 3, size: 26 },
    { id: 'tyranny', name: '时间的暴政', cat: 3, size: 24 },
    { id: 'nearby', name: '附近', cat: 4, size: 40 },
    { id: 'm500', name: '最初500米', cat: 4, size: 30 },
    { id: 'stranger', name: '陌生化', cat: 4, size: 28 },
    { id: 'trust', name: '抽象系统信任', cat: 4, size: 24 },
    { id: 'plain', name: '个人经验 · 大白话', cat: 5, size: 28 },
    { id: 'formal', name: '正规化反思', cat: 5, size: 24 },
    { id: 'rende', name: '认可 vs 认得', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'zjc'], ['core', 'xuanfu'], ['core', 'nearby'], ['core', 'plain'], ['core', 'bodyshop'],
    ['zjc', 'hukou'], ['hukou', 'hop'], ['hop', 'xuanfu'], ['hukou', 'emig'],
    ['bodyshop', 'bigco'], ['bigco', 'neijuan'], ['craft', 'neijuan'], ['craft', 'xuanfu'],
    ['xuanfu', 'neijuan'], ['neijuan', 'tangping'], ['neijuan', 'exam'], ['xuanfu', 'tyranny'],
    ['tyranny', 'nearby'], ['nearby', 'm500'], ['nearby', 'stranger'], ['nearby', 'trust'],
    ['zjc', 'formal'], ['plain', 'formal'], ['plain', 'rende'], ['exam', 'rende'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '“附近”“悬浮”概念的解释力',
    sides: [
      { who: '项飙及实践者', view: '转述：“附近”不是宏观社会理论，而是“生活的人类学”，意在重建被市场与抽象系统挤压掉的中间地带；“最初500米”工作坊（广州 2022，第九届深港双年展展出）被南方周末、三联生活周刊作为城市观察实践报道。' },
      { who: '批评者（个人博客、书评）', view: '转述：个人博客“冷”（stephenleng.com）评其浙大演讲，认为概念新意有限、表述偏口语化、近于心理安慰；Matters 平台书评（于立青，2022）认为《把自己作为方法》对谈体论述含混、结论不足；另有自媒体认为“附近”回避了对资本与制度的结构分析。' },
    ],
    note: '批评多见于个人博客与自媒体（reprint 级），暂未检得学术期刊层面的系统商榷；项飙本人在《十三邀》中也把平台与市场列为“附近”消失的原因之一。本站并陈，不作裁断。',
  },
  {
    id: 'x2',
    title: '“内卷”：社会心态解释 vs 经济学解释',
    sides: [
      { who: '项飙（澎湃 2020-10-22 等）', view: '转述：内卷是目标单一、不分化、没有退出机制的一体化竞争，是近十年的社会心态现象，出路在横向分化与重建意义。' },
      { who: '黄宗智及经济学者', view: '转述：黄宗智沿用其小农经济研究，把内卷界定为“没有发展的增长”即边际报酬递减（《开放时代》2020 年第 4 期；观察者网 2020-10-21），并把学术内卷归因于科层化的量化管理；刘志彪等从要素投入边际报酬递减、地方招商让利与产能过剩解释“内卷式竞争”。2024-07 起官方“反内卷”采用的是后一种产业竞争口径。' },
    ],
    note: '两方所说的“内卷”分别指个体竞争体验与产业/要素层面的低效竞争，概念外延不同，不宜直接比较对错。',
  },
  {
    id: 'x3',
    title: '如何看待“躺平”',
    sides: [
      { who: '项飙（BBC 中文 2021-06-02）', view: '原话：这是一个好事，说明大家开始反思过去的发展模式。' },
      { who: '官方媒体评论', view: '转述：《南方日报》2021-05-20 评论（王庆峰）《“躺平”可耻，哪来的正义感？》（新华网转载）批评躺平态度；BBC 同文提及《光明日报》评论提醒警惕“未富先躺”。' },
    ],
    note: '双方立场差异在于把“躺平”视为反思信号还是消极态度；本站只并陈公开表述。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '语录聚合站“项飙经典语录”合集（句子抄、每日文摘类站点）', status: '不收录', reason: '大量截取、改写或拼接，无场合、日期与原始出处。' },
  { id: 'q2', item: '“人生是旷野，不是轨道”', status: '不收录', reason: '网传归于项飙，未见其著作、访谈中有此句；萌娘百科等考据将其溯至网络流行语，与项飙无关。' },
  { id: 'q3', item: '网传“工作洞”长段语录', status: '〔存疑〕', reason: '流传版本称出自单读访谈，未能找到对应原文逐字核对，不作引语。' },
  { id: 'q4', item: '短视频切片“项飙谈张雪峰事件”', status: '不收录', reason: '仅见短视频平台剪辑；本站只采用潮新闻 2026-04-16 对浙大讲座的报道。' },
  { id: 'q5', item: '“勇敢是对世界的信任”（网传出自时尚杂志访谈）', status: '〔存疑〕', reason: '未检得杂志原文。' },
  { id: 'q6', item: '著作《你好，我的附近》', status: '更正', reason: '未见此书；对应为 2025-05 中信出版集团《你好，陌生人》。' },
  { id: 'q7', item: '《全球“猎身”》中译本“2010 年出版”', status: '更正', reason: '北京大学出版社版权页为 2012-01，ISBN 9787301182444。' },
  { id: 'q8', item: '“早在 2019 年项飙就建议关注身边 500 米”', status: '更正', reason: '“附近”首提于 2019 年《十三邀》；“最初500米”工作坊为 2022 年发起，二者时间不同。' },
  { id: 'q9', item: '“2019 年《十三邀》让‘内卷’成为热词”', status: '并陈', reason: '《十三邀》2019 年对谈主题为“附近”与“悬浮”；其“内卷”系统论述见澎湃新闻 2020-10-22 专访。' },
  { id: 'q10', item: '北京大学入学年份', status: '并陈', reason: 'MPI 官网简历为 1990 年（含一年军训），百度百科为 1992 年。' },
  { id: 'q11', item: '英国科学院中期职业发展奖获奖年份', status: '〔存疑〕', reason: '作者简介提及获奖，年份（网传 2015）未见官方记录。' },
  { id: 'q12', item: 'Making Money, Making Order（普林斯顿“即出”）', status: '〔存疑〕', reason: '截至核验日未见出版社书目页。' },
  { id: 'q13', item: '“绩点性竞争在中国也就是这 10 年才发生”（澎湃 2020-10-22）', status: '未检验', reason: '属历史判断，缺少可比测度，不列入台账。' },
  { id: 'q14', item: '《把自己作为方法》ISBN 9787532175161', status: '更正', reason: '正确为 9787532176953（上海文艺出版社 2020-07）。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
