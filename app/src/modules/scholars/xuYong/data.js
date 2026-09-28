// ============================================================================
// 学者专栏 · 徐勇 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 本栏徐勇 = 华中师范大学政治学者（1955 年生，湖北宜昌），与同名的其他学者、官员无涉。
// 搜索引擎摘要、镜像站与自媒体中托名"徐勇认为"而无原文可溯者一律不收录。
// 合著论文的结论标注合作者，不单独归于本人。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  selfgov: { label: '村民自治与基层民主', color: '#c41e3a' },
  field: { label: '田野政治学与微观政治', color: '#8b5cf6' },
  jiahu: { label: '家户制与农村发展道路', color: '#e8a317' },
  statization: { label: '国家化与"下乡"整合', color: '#22d3ee' },
  relation: { label: '关系叠加与国家演化', color: '#10b981' },
  modern: { label: '基层治理现代化', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '徐勇',
  born: '1955 年 7 月 · 湖北宜昌',
  summary:
    '华中师范大学政治系本科（1978—1982）、科学社会主义研究所硕士（1984—1987）、博士（1993—1996），1982 年起任教华中师大，1989、1993 年两次破格晋升副教授、教授。先后主持科学社会主义研究所、中国农村问题研究中心（教育部重点研究基地）、政治学研究院、中国农村研究院，2022 年起任华中师大政治学部部长。1997 年出版《中国农村村民自治》，2002 年提出"县政、乡派、村治"，2007—2009 年以"政党下乡""行政下乡""服务下乡"阐释现代国家对乡土社会的整合，2013 年在《中国社会科学》提出"家户制"，2018 年提出"祖赋人权"，2019 年起出版多卷本《关系中的国家》，2021 年起系统阐述"田野政治学"，2025 年转向"微观政治学"。2006 年 11 月曾为十六届中央政治局第三十六次集体学习讲解基层民主政治建设。',
  current: [
    '华中师范大学资深教授、政治学部部长（2022 年起）',
    '华中师范大学中国农村研究院 / 政治学与国家治理研究院教授（2025 年论文署名）',
    '教育部"长江学者"特聘教授（官方简历作"首批文科"，另见存疑栏）',
    '荆楚社科名家',
  ],
  sources: '华中师范大学政治学与国家治理研究院官网个人简介；华中师大中国农村研究院官网；华中师大人才招聘网专家介绍；央视网、中国青年报 2006 年集体学习报道；百度百科、维基百科（仅交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 16,
  subtitle: '村民自治 · 田野政治学 · 家户制 · 国家化 · 关系中的国家',
  span: '1997—2025',
  careerTitle: '履历时间线 · 华中师大科社所 → 农村问题研究中心 → 政治学研究院 / 中国农村研究院 → 政治学部',
  defaultTheme: 'selfgov',
  moduleId: 'scholarXuYong',
  sourceNote: '期刊论文原文（《中国社会科学》《政治学研究》《学术月刊》《开放时代》等）/ 华中师大官网署名文章 / 主流媒体报道 · 对照政策：中共中央、国务院、全国人大常委会、中央农办、农业农村部',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  study: { label: '求学/访学', color: '#8b5cf6' },
  ccnu: { label: '华中师大教职', color: '#22d3ee' },
  admin: { label: '机构负责人', color: '#10b981' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '华中师范大学政治系本科', org: '华中师大', start: 1978.7, end: 1982.6, group: 'study', note: '入学、毕业月份未载，取学年近似' },
  { id: 'c2', role: '科学社会主义研究所教师', org: '华中师大', start: 1982.6, end: 1989.5, group: 'ccnu', note: '1982 年留校任教；初任职称未见官方简历载明〔存疑〕' },
  { id: 'c3', role: '科学社会主义研究所硕士研究生', org: '华中师大', start: 1984.7, end: 1987.6, group: 'study' },
  { id: 'c4', role: '副教授（破格晋升）', org: '华中师大', start: 1989.5, end: 1993.5, group: 'ccnu', note: '晋升月份未载，取年中近似' },
  { id: 'c5', role: '教授（破格晋升），1997 年起博士生导师', org: '华中师大', start: 1993.5, end: 2026.75, group: 'ccnu' },
  { id: 'c6', role: '博士研究生（法学）', org: '华中师大', start: 1993.7, end: 1996.6, group: 'study' },
  { id: 'c7', role: '科学社会主义研究所所长', org: '华中师大', start: 1998.5, end: 2004.5, group: 'admin', note: '官方简历载 1998 年任所长，卸任时间未载，终点取政治学研究院成立年份〔存疑〕' },
  { id: 'c8', role: '美国南加州大学访问学者', org: 'USC', start: 1999.3, end: 1999.8, group: 'study', note: '官方简历仅载 1999 年，起止月份〔存疑〕' },
  { id: 'c9', role: '斯坦福大学东亚研究中心访问学者', org: 'Stanford', start: 2000.1, end: 2000.5, group: 'study', note: '官方简历仅载 2000 年，起止月份〔存疑〕' },
  { id: 'c10', role: '中国农村问题研究中心主任（教育部人文社科重点研究基地）', org: '华中师大', start: 2000.5, end: 2011.5, group: 'admin', note: '2000 年任主任；该中心后并入中国农村研究院体系，卸任时间〔存疑〕' },
  { id: 'c11', role: '政治学研究院院长', org: '华中师大', start: 2004.5, end: 2012.4, group: 'admin' },
  { id: 'c12', role: '中国农村研究院院长', org: '华中师大', start: 2011.5, end: 2016.5, group: 'admin', note: '官方简历作 2011—2016；2016 年教育部专访、2023 年社科文献出版社作者简介仍称"院长"，终点并陈' },
  { id: 'c13', role: '政治学部部长', org: '华中师大', start: 2022.5, end: 2026.75, group: 'admin', note: '起始月份未载，取年中近似' },
];

export const BOOKS = [
  { id: 'b1', year: 1992, title: '非均衡的中国政治：城市与乡村比较', publisher: '中国广播电视出版社', isbn: '9787504317810', themes: ['modern', 'statization'], verified: 'primary', note: '据官方著作目录；ISBN 据维基百科引注' },
  { id: 'b2', year: 1997, title: '中国农村村民自治', publisher: '华中师范大学出版社', isbn: '9787562218241', themes: ['selfgov'], verified: 'primary', note: '村民自治研究的奠基性专著' },
  { id: 'b3', year: 1998, title: '包产到户沉浮录', publisher: '珠海出版社', isbn: '9787806073841', themes: ['jiahu'], verified: 'primary', note: '据官方著作目录' },
  { id: 'b4', year: 2003, title: '乡村治理与中国政治', publisher: '中国社会科学出版社', date: '2003-12', isbn: '9787500442547', themes: ['modern', 'selfgov'], verified: 'primary', note: '官方目录作 2004 年，维基百科引注作 2003-12，并陈' },
  { id: 'b5', year: 2003, title: '流动中的乡村治理', publisher: '中国社会科学出版社', coauthors: '徐增阳', themes: ['modern'], verified: 'primary', note: '据官方著作目录' },
  { id: 'b6', year: 2009, title: '现代国家、乡土社会与制度建构', publisher: '中国物资出版社', isbn: '9787504730800', themes: ['statization'], verified: 'primary', note: '收录"下乡"系列论文' },
  { id: 'b7', year: 2012, title: '农民改变中国', publisher: '中国社会科学出版社', date: '2012-03', isbn: '9787516105269', themes: ['jiahu'], verified: 'primary', note: '延续"农民理性扩张"论题' },
  { id: 'b8', year: 2018, title: '国家治理的中国底色与路径', publisher: '中国社会科学出版社', date: '2018-12', isbn: '9787520331562', themes: ['relation', 'jiahu'], verified: 'primary', note: '第二章收"祖赋人权"论文' },
  { id: 'b9', year: 2018, title: '中国农村村民自治（增订本）', publisher: '生活书店出版有限公司', date: '2018-08', isbn: '9787807682387', themes: ['selfgov'], verified: 'primary', note: '392 页；澎湃新闻报道首发式' },
  { id: 'b10', year: 2019, title: '城乡差别的中国政治', publisher: '社会科学文献出版社', themes: ['modern'], verified: 'primary', note: '据官方著作目录' },
  { id: 'b11', year: 2019, title: '国家化、农民性与乡村整合', publisher: '江苏人民出版社', date: '2019-09', isbn: '9787214232700', themes: ['statization', 'jiahu'], verified: 'primary', note: '官方简历载获第十三届湖北省社科优秀成果一等奖（2023）、第九届高校科研优秀成果（人文社科）一等奖（2024）' },
  { id: 'b12', year: 2019, title: '关系中的国家（第一卷）：血缘—地域关系中的王制国家', publisher: '社会科学文献出版社', date: '2019-10', isbn: '9787520154468', themes: ['relation'], verified: 'primary', note: '多卷本第一卷' },
  { id: 'b13', year: 2020, title: '关系中的国家（第二卷）：地域—血缘关系中的帝制国家', publisher: '社会科学文献出版社', date: '2020-05', isbn: '9787520164306', themes: ['relation'], verified: 'primary', note: '出版月份另有 2020-03 一说，并陈' },
  { id: 'b14', year: 2023, title: '关系中的国家（第三卷）：地域—民族关系中的帝制国家', publisher: '社会科学文献出版社', date: '2023-08', isbn: '9787522820309', themes: ['relation'], verified: 'primary', note: '社科文献出版社先晓书馆页面' },
  { id: 'b15', year: 2021, title: '田野政治学的构建', publisher: '中国社会科学出版社', date: '2021-09', themes: ['field'], verified: 'primary', note: '官方简历作"中国社会科学文献出版社"，微信读书作中国社会科学出版社 2021-09，出版社并陈' },
];

/** 论文 / 讲话 / 署名文章文库 */
export const CORPUS = [
  { id: 'k1997a', date: '1997', form: '论文', venue: '《GOVERNANCE：治理的阐释》，《政治学研究》1997 年第 1 期', source: '《政治学研究》（官方论文目录；王习明评述）', verified: 'primary', themes: ['modern'] },
  { id: 'k1997b', date: '1997-08', form: '论文', venue: '《村干部的双重角色：代理人与当家人》，《二十一世纪》（香港）1997 年 8 月号', source: '《二十一世纪》（官方论文目录）', verified: 'primary', themes: ['selfgov'] },
  { id: 'k2002', date: '2002-03', form: '论文', venue: '《县政、乡派、村治：乡村治理的结构性转换》，《江苏社会科学》2002 年第 2 期', source: '《江苏社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/3443.html', verified: 'primary', themes: ['modern', 'selfgov'] },
  { id: 'k2006a', date: '2006-11-30', form: '讲话', venue: '十六届中央政治局第三十六次集体学习 · 我国社会主义基层民主政治建设研究（与赵树凯共同讲解）', source: '央视网 2006-12-01；中国青年报 2006-12-02', url: 'https://news.cctv.com/china/20061201/105012.shtml', verified: 'media', themes: ['selfgov'] },
  { id: 'k2006b', date: '2006-03', form: '论文', venue: '《当前中国农村研究方法论问题的反思》，《河北学刊》2006 年第 2 期', source: '《河北学刊》（湖北大学相关研究中心网站转载）', verified: 'reprint', themes: ['field', 'selfgov'] },
  { id: 'k2007a', date: '2007-08', form: '论文', venue: '《政党下乡：现代国家对乡土的整合》，《学术月刊》2007 年第 8 期，第 13—20 页', source: '《学术月刊》（中国乡村发现网转载）', url: 'https://www.zgxcfx.com/jinritoutiao/86985.html', verified: 'reprint', themes: ['statization'] },
  { id: 'k2007b', date: '2007-09', form: '论文', venue: '"行政下乡"专论，《华中师范大学学报（人文社会科学版）》2007 年第 5 期', source: '《华中师范大学学报》（官方论文目录；完整篇名未逐字核对）', verified: 'primary', themes: ['statization'] },
  { id: 'k2009', date: '2009-01', form: '论文', venue: '《"服务下乡"：国家对乡土社会的服务性渗透》，《东南学术》2009 年第 1 期，第 64—70 页', source: '《东南学术》（期刊摘要）', verified: 'primary', themes: ['statization', 'modern'] },
  { id: 'k2010', date: '2010-01', form: '论文', venue: '《农民理性的扩张："中国奇迹"的创造主体分析——对既有理论的挑战及新的分析进路的提出》，《中国社会科学》2010 年第 1 期，第 103—118 页', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/36020.html', verified: 'primary', themes: ['jiahu'] },
  { id: 'k2013', date: '2013-08', form: '论文', venue: '《中国家户制传统与农村发展道路——以俄国、印度的村社传统为参照》，《中国社会科学》2013 年第 8 期，第 102—123 页', source: '《中国社会科学》（人民论坛网转载；中国人民大学社会学理论与方法研究中心转载）', url: 'https://www.rmlt.com.cn/2013/1106/177492.shtml', verified: 'primary', themes: ['jiahu', 'relation'] },
  { id: 'k2014a', date: '2014-07', form: '论文', venue: '徐勇、赵德健《找回自治：对村民自治有效实现形式的探索》，《华中师范大学学报（人文社会科学版）》2014 年第 53 卷第 4 期，第 1—8 页', source: '华中师大中国农村研究院官网（与赵德健合作）', url: 'https://ccrs.ccnu.edu.cn/List/Details.aspx?tid=656', verified: 'primary', themes: ['selfgov'] },
  { id: 'k2014b', date: '2014-04', form: '论文', venue: '《重达自治：连结传统的尝试与困境——以广东省云浮和清远的探索为例》，《探索与争鸣》2014 年第 4 期', source: '华中师大中国农村研究院官网', url: 'https://ccrs.ccnu.edu.cn/List/H5Details.aspx?tid=4857', verified: 'primary', themes: ['selfgov'] },
  { id: 'k2016a', date: '2016-07', form: '论文', venue: '《历史延续性视角下的中国道路》，《中国社会科学》2016 年第 7 期，第 4—25 页', source: '《中国社会科学》（爱思想全文转载；华中师大社科处）', url: 'https://www.aisixiang.com/data/131371.html', verified: 'primary', themes: ['relation', 'modern'] },
  { id: 'k2016b', date: '2016-05-14', form: '讲话', venue: '村民自治有效实现形式研讨发言（媒体报道）', source: '楚河网（chuhe.com）报道', verified: 'media', themes: ['selfgov'] },
  { id: 'k2018a', date: '2018-01', form: '论文', venue: '《祖赋人权：源于血缘理性的本体建构原则》，《中国社会科学》2018 年第 1 期', source: '《中国社会科学》（爱思想全文转载；华中师大中国农村研究院官网）', url: 'https://www.aisixiang.com/data/108453.html', verified: 'primary', themes: ['relation'] },
  { id: 'k2018b', date: '2018-09', form: '论文', venue: '《实证思维通道下对"祖赋人权"命题的扩展认识》，《探索与争鸣》2018 年第 9 期', source: '华中师大中国农村研究院官网', url: 'https://ccrs.ccnu.edu.cn/List/Details.aspx?tid=8446', verified: 'primary', themes: ['relation', 'field'] },
  { id: 'k2018c', date: '2018-07', form: '论文', venue: '《民主与治理：村民自治的伟大创造与深化探索》，《当代世界与社会主义》2018 年第 4 期', source: '《当代世界与社会主义》（官方论文目录）', verified: 'primary', themes: ['selfgov'] },
  { id: 'k2020', date: '2020-01', form: '论文', venue: '《中国的国家成长"早熟论"辨析——以关系叠加为视角》，《政治学研究》2020 年第 1 期，第 2—9 页', source: '中国政治学网（《政治学研究》）；爱思想转载', url: 'http://chinaps.cssn.cn/zhzhxyj/2020ndyq/202005/t20200519_5131011.shtml', verified: 'primary', themes: ['relation'] },
  { id: 'k2021a', date: '2021-03', form: '论文', venue: '《田野政治学的核心概念建构：路径、特性与贡献》，《中国社会科学评价》2021 年第 1 期，第 4—13 页', source: '《中国社会科学评价》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/126666.html', verified: 'primary', themes: ['field'] },
  { id: 'k2021b', date: '2021', form: '署名文章', venue: '《以国家形态为关联的田野政治学》（《田野政治学的构建》书稿章节）', source: '爱思想转载', url: 'https://www.aisixiang.com/data/125320.html', verified: 'reprint', themes: ['statization', 'field'] },
  { id: 'k2022a', date: '2022-03', form: '论文', venue: '《国家根本性议程与中国式治理民主》，《学术月刊》2022 年第 3 期', source: '《学术月刊》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/133339.html', verified: 'primary', themes: ['selfgov'] },
  { id: 'k2023', date: '2023-01', form: '论文', venue: '《从田野政治学看中国自主的知识体系建构》，《开放时代》2023 年第 1 期', source: '《开放时代》编辑部官网摘要', url: 'https://www.opentimes.cn/html/Abstract/23966.html', verified: 'primary', themes: ['field', 'selfgov'] },
  { id: 'k2024a', date: '2024-01', form: '论文', venue: '《从"家户制"到"家户主义"的概念建构》，《开放时代》2024 年第 1 期', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/148716.html', verified: 'primary', themes: ['jiahu'] },
  { id: 'k2024b', date: '2024-08', form: '论文', venue: '《日用而不觉：基础性秩序与治理资源开发》，《学术月刊》2024 年第 8 期', source: '《学术月刊》（华中师大官方论文目录）', verified: 'primary', themes: ['modern'] },
  { id: 'k2025a', date: '2025-01', form: '论文', venue: '《化繁为简：基层治理的功能与走向》，《探索与争鸣》2025 年第 1 期（笔谈）', source: '《探索与争鸣》（爱思想转载）', url: 'https://www.aisixiang.com/data/164042.html', verified: 'primary', themes: ['modern'] },
  { id: 'k2025b', date: '2025-03', form: '论文', venue: '《社会政治视角下的微观政治探讨》，《学术界》2025 年第 3 期', source: '华中师大政治学与国家治理研究院官网（2025-04-15）', url: 'https://ipng.ccnu.edu.cn/home/details?id=11799', verified: 'primary', themes: ['field'] },
  { id: 'k2025c', date: '2025-04', form: '讲话', venue: '《政治学：从不由自主到自由自主——兼谈田野政治学与微观政治学》（据 2025 年 4 月多场研讨会发言整理）', source: '华中师大政治学与国家治理研究院官网（2025-04-24）；爱思想转载', url: 'https://ipng.ccnu.edu.cn/home/details?id=11807', verified: 'primary', themes: ['field'] },
  { id: 'k2025d', date: '2025-06-03', form: '署名文章', venue: '《互动中的微观权力》', source: '华中师大政治学与国家治理研究院官网', url: 'https://ipng.ccnu.edu.cn/home/details?id=11890', verified: 'primary', themes: ['field', 'statization'] },
  { id: 'k2025e', date: '2025-07', form: '论文', venue: '《小规模人群：微观政治分析》，《学习与探索》2025 年第 7 期（附作者 2025-08 研究札记）', source: '《学习与探索》（爱思想转载）', url: 'https://www.aisixiang.com/data/167575.html', verified: 'primary', themes: ['field', 'modern'] },
  { id: 'k2025f', date: '2025-01-05', form: '采访', venue: '东方网"政治学·新知"系列报道之四 · 家户制与国家治理', source: '东方网', verified: 'media', themes: ['jiahu', 'field'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 村民自治与基层民主 ——
  { id: 'a1', k: 'k2014a', theme: 'selfgov', type: '原话', text: '由于自治和村民自治的内在价值，决定村民自治会不断在实践中为自己开辟道路。' },
  { id: 'a2', k: 'k2014a', theme: 'selfgov', type: '原话', text: '处于发展的瓶颈状态，农村治理更多的是依靠外力推动，有人因此宣告“自治已死”' },
  { id: 'a3', k: 'k2014a', theme: 'selfgov', type: '转述', text: '与赵德健合作，把村民自治分为三个阶段：以自然村为基础的"三个自我"、以建制村为基础的"四个民主"、在建制村以下探索有效实现形式，主张建构多层次、多类型、多样式的自治体系（合著结论）。' },
  { id: 'a4', k: 'k2014a', theme: 'selfgov', type: '转述', text: '将村民自治陷入瓶颈的首要原因归为行政抑制自治：上级任务下压使村民委员会"行政化"，自治功能被挤占（合著结论）。' },
  { id: 'a5', k: 'k2014b', theme: 'selfgov', type: '原话', text: '由于人口多、地域广，村民自治难以继续开展，基层自治陷入空转。' },
  { id: 'a6', k: 'k2016b', theme: 'selfgov', type: '转述', text: '据报道：认为自治单位并非越小越好，单位愈小自治范围与内容愈有限，应按不同情况形成多层级的自治形式。' },
  { id: 'a7', k: 'k2006a', theme: 'selfgov', type: '转述', text: '据央视网报道：2006 年 11 月 30 日与赵树凯在十六届中央政治局第三十六次集体学习中讲解我国社会主义基层民主政治建设。' },
  { id: 'a8', k: 'k1997b', theme: 'selfgov', type: '转述', text: '以"代理人"与"当家人"概括村干部的双重角色：既承接政府下达的任务，又代表村民利益（据篇名与官方目录）。' },
  { id: 'a9', k: 'k2022a', theme: 'selfgov', type: '原话', text: '国家根本性议程决定了中国不会，也不能采用通过选举实现政党轮替的西方民主形式。' },
  { id: 'a10', k: 'k2022a', theme: 'selfgov', type: '转述', text: '以"中国式治理民主"概括中国民主形态，强调民主服务于国家根本性议程，并认为党的领导与人民民主具有内在统一性。' },

  // —— 田野政治学与微观政治 ——
  { id: 'f1', k: 'k2021a', theme: 'field', type: '原话', text: '田野政治学概念建构的路径由具体的人到家户，经由村庄，再到国家分层次逐级提升。' },
  { id: 'f2', k: 'k2025c', theme: 'field', type: '原话', text: '田野只是一种获得知识的方法，难以自动构建起知识体系，所提出的原创性概念尚是“概念孤儿”。' },
  { id: 'f3', k: 'k2025c', theme: 'field', type: '转述', text: '把田野政治学的知识生产视为基于实践逻辑的"不由自主"，把微观政治学视为基于知识逻辑的"自由自主"，定位为田野政治学的迭代升级。' },
  { id: 'f4', k: 'k2025b', theme: 'field', type: '原话', text: '以社会人群单位为载体的政治为社会政治，通常称之为微观政治，是人们“身在其中的政治”“日常生活中的政治”。' },
  { id: 'f5', k: 'k2025d', theme: 'field', type: '原话', text: '做群众工作是我党的优势。只是这一优势没有能够转换为学理。' },
  { id: 'f6', k: 'k2025e', theme: 'field', type: '原话', text: '我30多年前研究村民自治，对这一点没有自觉认识，如今总算有了点理论自觉。' },
  { id: 'f7', k: 'k2006b', theme: 'field', type: '转述', text: '反思农村研究方法论，批评"走马观花又一村，一村一个新理论"式的伪实证主义，并回应批评者把村民自治称为"理论怪胎"的说法。' },
  { id: 'f8', k: 'k2023', theme: 'field', type: '转述', text: '以田野政治学为例讨论中国自主知识体系建构，把家庭承包、乡镇企业与村民自治并列为农村改革中农民的伟大创造。' },
  { id: 'f9', k: 'k2025e', theme: 'field', type: '转述', text: '自述"深度中国调查"始于中国农村研究院独立建制之时，覆盖七大区域、文字量逾一亿字，2024 年基本结束（本人口径，未见第三方统计）。' },

  // —— 家户制与农村发展道路 ——
  { id: 'j1', k: 'k2013', theme: 'jiahu', type: '原话', text: '以强大的习俗为支撑的完整的家庭制度和以强大的国家行政为支撑的完整的户籍制度共同构成的家户制，是中国农村社会的基础性制度或本源型传统。' },
  { id: 'j2', k: 'k2013', theme: 'jiahu', type: '原话', text: '家户制是有分化的效益和缺乏保障的“勤劳”，村社制是没有效益的平均和有保障的“怠惰”。' },
  { id: 'j3', k: 'k2013', theme: 'jiahu', type: '原话', text: '家庭农场可能是将传统家户与现代农业结合起来的最佳选择。' },
  { id: 'j4', k: 'k2013', theme: 'jiahu', type: '转述', text: '以俄国、印度的村社传统为参照，主张家户既是国家治理的根基也是社会自治的单元，形成家国共治、官事官管与民事民管并行的农村治理体系；并警告照搬他国道路的风险。' },
  { id: 'j5', k: 'k2010', theme: 'jiahu', type: '原话', text: '要理解“中国奇迹”，必须理解中国农民；要理解农民，必须理解农民理性。' },
  { id: 'j6', k: 'k2010', theme: 'jiahu', type: '转述', text: '将勤劳、勤俭、算计、互惠、人情、好学、求稳、忍耐概括为农民理性的特征，认为其与工业社会优势结合形成"叠加优势"，是"中国奇迹"的创造主体。' },
  { id: 'j7', k: 'k2024a', theme: 'jiahu', type: '转述', text: '把"家户制"提升为认识论层面的"家户主义"：家户是个人与社会、个人与国家的联结点，强调整体性、共同性与责任性。' },
  { id: 'j8', k: 'k2025f', theme: 'jiahu', type: '原话', text: '尽管家户制作为一种制度正在逐渐解体，但其对当下国家治理仍具有重要价值。' },
  { id: 'j9', k: 'k2013', theme: 'jiahu', type: '转述', text: '与秦晖"大共同体本位"说商榷，认为中国农村基础性单元是家户而非村社共同体，"一大二公"的公社正是对家户传统的否定。' },

  // —— 国家化与"下乡"整合 ——
  { id: 's1', k: 'k2007a', theme: 'statization', type: '原话', text: '对于现代中国建构中的乡村治理来说，政党整合发挥着政权整合所不能够发挥的作用。乡村社会在相当程度正是通过党组织而不是政权组织加以治理的。' },
  { id: 's2', k: 'k2007a', theme: 'statization', type: '转述', text: '认为中国共产党能把数亿农村人口整合进国家政治体系，关键在政党向乡村社会的渗透，政党而非其他组织是农村整合的主要力量。' },
  { id: 's3', k: 'k2007a', theme: 'statization', type: '原话', text: '自上而下的权力体制又会造成农村精英“脱草根性”，成为一个特殊的社会群体。' },
  { id: 's4', k: 'k2009', theme: 'statization', type: '转述', text: '据期刊摘要：乡镇改革不应简单撤并"七站八所"，而应改进公共服务，通过服务重新建构国家权威。' },
  { id: 's5', k: 'k2021b', theme: 'statization', type: '原话', text: '国家化是人们超越血缘氏族组织，设立国家政权并利用国家政权的力量推动组成社会的人们获得国家性的过程。' },
  { id: 's6', k: 'k2021b', theme: 'statization', type: '转述', text: '回顾学术路径：早年以"国家化"描述分散的地方性社会走向现代整体国家，2010 年后转向传统国家形态研究并启动深度中国调查。' },

  // —— 关系叠加与国家演化 ——
  { id: 'r1', k: 'k2018a', theme: 'relation', type: '原话', text: '由此构成血缘理性的本体原则——“祖赋人权”，即因为祖宗而赋予同一血缘关系的人的存在与行为的合理性和依据。' },
  { id: 'r2', k: 'k2018a', theme: 'relation', type: '原话', text: '与“天赋人权”内含的社会与国家的二元对立不同，“祖赋人权”内生的是社会与国家的共生共荣关系，形塑的是命运共同体意识。' },
  { id: 'r3', k: 'k2018b', theme: 'relation', type: '原话', text: '从现代性的价值评判的角度看，笔者也并不赞成“祖赋人权”的命题。但从科学研究的实证思维看，无论你是否赞成，它都存在。' },
  { id: 'r4', k: 'k2020', theme: 'relation', type: '原话', text: '血缘关系与地域关系的叠加，使得中国的国家成长不是在旧的关系形态被“炸毁”的形态下行进，而是旧的社会关系与新的社会要素相互纠缠。' },
  { id: 'r5', k: 'k2020', theme: 'relation', type: '转述', text: '以"关系叠加"回应中国国家成长"早熟论"：新旧社会关系相互叠加，使国家成长呈现复合性与反复性。' },
  { id: 'r6', k: 'k2016a', theme: 'relation', type: '原话', text: '中国道路有着深厚的历史根基，其鲜明的特点是历史延续性而不是断裂性' },
  { id: 'r7', k: 'k2016a', theme: 'relation', type: '转述', text: '把中国道路的历史根基归纳为自主性的家户农民、内生性的政府能力与调适性的国家治理三项。' },
  { id: 'r8', k: 'k2018a', theme: 'relation', type: '转述', text: '主张当代中国在"天赋人权"之外建构更具现实性的"法定人权"观。' },

  // —— 基层治理现代化 ——
  { id: 'm1', k: 'k2002', theme: 'modern', type: '原话', text: '县政是指县成为国家在农村的基层政权，独立承担法律责任，直接对本县政务和人民负责。' },
  { id: 'm2', k: 'k2002', theme: 'modern', type: '转述', text: '主张在县一级实行县人大代表与县长双直接选举、乡改为县的派出机构、村实行自治，即"县政、乡派、村治"的结构性转换。' },
  { id: 'm3', k: 'k2002', theme: 'modern', type: '原话', text: '由以上分析可以看出，农村负担的加重不是少数领导人的作风问题，而是一个体制性问题；农民负担只是表面现象，其深层次的原因是乡村治理结构不合理。' },
  { id: 'm4', k: 'k2025a', theme: 'modern', type: '原话', text: '在由传统农业社会向现代工业社会的转变过程中，我国的基层治理正在由直接“管人”向直接“办事”转变，并要求化繁为简、以简驭繁，将复杂的事务办理简约化，实现高效优质办成事。' },
  { id: 'm5', k: 'k2025a', theme: 'modern', type: '原话', text: '化繁为简是基层治理的一场“变法”，它既不是传统的“简约治理”的翻版，也不是现代科层制治理的复制版，而是对复杂化的现代治理的转换，其核心在“化”，其关键在体制机制创新，其目标在高效优质办成事。' },
  { id: 'm6', k: 'k2016a', theme: 'modern', type: '原话', text: '制度粘性、官僚惰性、权力任性等无时不刻不在侵蚀着国家健康的肌体' },
  { id: 'm7', k: 'k2025e', theme: 'modern', type: '转述', text: '认为传统国家以数万官员治理数亿人，重要因素是利用社会内在力量治理社会，"以社会治理社会"至今仍有借鉴价值。' },
  { id: 'm8', k: 'k1997a', theme: 'modern', type: '转述', text: '较早在国内政治学期刊系统阐释 governance（治理）概念（据王习明《村治研究的发展轨迹》评述）。' },
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

export const FEATURED = ['a1', 'a9', 'f2', 'j1', 's1', 'r1', 'r4', 'm5'];

export const THEME_LINKS = {
  selfgov: [{ to: '/governance', label: '国家治理' }, { to: '/govsystem', label: '政府体制' }],
  field: [{ to: '/ideology', label: '意识形态与话语' }, { to: '/governance', label: '国家治理' }],
  jiahu: [{ to: '/rural', label: '乡村振兴' }, { to: '/culture', label: '文化' }],
  statization: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/frontier-gov', label: '边疆治理' }],
  relation: [{ to: '/civilization', label: '文明' }, { to: '/pathdependence', label: '路径依赖' }],
  modern: [{ to: '/reform', label: '改革' }, { to: '/rural', label: '乡村振兴' }],
};

export const THEME_INTRO = {
  selfgov: '其成名领域：1997 年《中国农村村民自治》系统论述村民自治，2006 年为中央政治局集体学习讲解基层民主；2014 年后承认建制村自治陷入"空转"与行政化，主张"找回自治"、下沉自治单元；2022 年以"中国式治理民主"定位中国民主形态。村民自治能否作为"民主试验"的争论见"争议"栏。',
  field: '"田野政治学"是其对华中村治研究方法的学科化命名：由人、家户、村庄到国家逐级提炼概念；2025 年自认田野概念尚是"概念孤儿"，转向"微观政治学"与"小规模人群"分析。',
  jiahu: '以"家户制"对照俄国、印度村社制，解释中国农村的勤劳与分化、包产到户的历史根基，并以"农民理性扩张"解释"中国奇迹"的主体；2024 年升格为"家户主义"，2025 年承认家户制正在解体。',
  statization: '以"国家化"描述分散的乡土社会被整合进现代国家的过程，2007—2009 年以"政党下乡""行政下乡""服务下乡"等系列论文刻画整合机制，并提示精英"脱草根性"的代价。',
  relation: '从血缘—地域"关系叠加"解释中国国家成长的延续性：多卷本《关系中的国家》、"祖赋人权"与"历史延续性"构成其宏观历史线，"祖赋人权"引发商榷。',
  modern: '2002 年从农民负担问题推出"县政、乡派、村治"的结构改革主张；2016 年提示制度粘性与官僚惰性，2025 年以"化繁为简"概括基层治理由"管人"向"办事"的转变。',
};

// ============================================================================
// 命题检验台账：只收可被制度事实检验的核心命题或前瞻性推论；对照截至核验日
// "兑现"仅指制度走向与表述一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'open', type: '转述', date: '2002-03', venue: '《江苏社会科学》2002 年第 2 期',
    url: 'https://www.aisixiang.com/data/3443.html',
    claim: '在县一级实行县人大代表与县长双直接选举，使县成为一级责任政府',
    check: '至核验日县长仍由县级人民代表大会选举产生，未见县长直选的全国性制度安排或正式试点文件；属规范性主张，未被采纳，作为改革命题仍未闭环。',
    dataSrc: '现行《地方各级人民代表大会和地方各级人民政府组织法》（检索截至 2026-09）',
  },
  {
    id: 'L2', status: 'failed', type: '原话', date: '2002-03', venue: '《江苏社会科学》2002 年第 2 期',
    url: 'https://www.aisixiang.com/data/3443.html',
    claim: '县以下的乡成为县的派出机构，接受县政府的委派，专事县政府委托的任务。',
    check: '2021-07-11 公布的中共中央、国务院《关于加强基层治理体系和治理能力现代化建设的意见》要求增强乡镇（街道）行政执行能力，依法赋予乡镇（街道）综合管理权、行政执法权等，强化的是乡镇作为一级政权的职能，与"乡派"方向相反。',
    dataSrc: '中国政府网 2021-07-11《关于加强基层治理体系和治理能力现代化建设的意见》',
  },
  {
    id: 'L3', status: 'open', type: '转述', date: '2014-07', venue: '《华中师范大学学报》2014 年第 4 期（与赵德健合作）',
    url: 'https://ccrs.ccnu.edu.cn/List/Details.aspx?tid=656',
    claim: '在建制村以下探索村民自治有效实现形式，建构多层次、多类型、多样式的村民自治体系',
    check: '2014 年中央一号文件提出"探索不同情况下村民自治的有效实现形式"，可开展以社区、村民小组为基本单元的村民自治试点（该文发表时已引用该文件，不构成预判）。2025-10-28 全国人大常委会第二次修正《村民委员会组织法》，重点在民主协商与党组织领导；修正文本规定村民小组"在村民委员会的组织下开展活动"，村民小组会议可讨论决定本组重要事项，但未将其设为独立的法定自治层级，建制村仍是自治基本单元。',
    dataSrc: '2014 年中央一号文件；揭阳市政府网转载 2025 年《村民委员会组织法》修正说明',
  },
  {
    id: 'L4', status: 'done', type: '原话', date: '2013-08', venue: '《中国社会科学》2013 年第 8 期',
    url: 'https://www.rmlt.com.cn/2013/1106/177492.shtml',
    claim: '家庭农场可能是将传统家户与现代农业结合起来的最佳选择。',
    check: '2013 年起历年中央一号文件均涉及家庭农场；2019-09-09 中央农办、农业农村部等 11 部门印发《关于实施家庭农场培育计划的指导意见》（中农发〔2019〕16 号）。纳入名录的家庭农场由 2019 年末约 85.3 万个增至 2024 年末 395.2 万个，经营土地约 3.1 亿亩（农业农村部口径）。政策方向与其判断一致，无证据表明存在因果关系。',
    dataSrc: '农业农村部；中国农业信息网 2025-10-14；新华社 2025-12',
  },
  {
    id: 'L5', status: 'open', type: '原话', date: '2007-08', venue: '《学术月刊》2007 年第 8 期',
    url: 'https://www.zgxcfx.com/jinritoutiao/86985.html',
    claim: '自上而下的权力体制又会造成农村精英“脱草根性”，成为一个特殊的社会群体。',
    check: '2019-01-10 公布的《中国共产党农村基层组织工作条例》要求村党组织书记通过法定程序担任村民委员会主任（"一肩挑"）；2025-10 修正的《村民委员会组织法》写入村党组织负责人可依法担任村委会主任。党组织整合进一步强化，其所提示的"脱草根性"代价缺乏公开的系统评估数据，未决。',
    dataSrc: '中国政府网 2019-01-10；《村民委员会组织法》2025 年修正',
  },
  {
    id: 'L6', status: 'done', type: '原话', date: '2022-03', venue: '《学术月刊》2022 年第 3 期',
    url: 'https://www.aisixiang.com/data/133339.html',
    claim: '国家根本性议程决定了中国不会，也不能采用通过选举实现政党轮替的西方民主形式。',
    check: '2025-10-28 修正的《村民委员会组织法》新增第四条：村民委员会工作坚持中国共产党的领导，坚持和发展全过程人民民主。基层民主的法定框架与其判断一致；该判断描述的是既有制度方向而非对变化的预测，"兑现"不构成检验力。',
    dataSrc: '《村民委员会组织法》2025 年修正文本（揭阳市政府网转载）',
  },
  {
    id: 'L7', status: 'done', type: '转述', date: '2022-03', venue: '《学术月刊》2022 年第 3 期',
    url: 'https://www.aisixiang.com/data/133339.html',
    claim: '以治理民主定位中国基层民主：重在议事与协商办事，而非以竞争性选举为中心',
    check: '2025-10 修正的《村民委员会组织法》在民主选举、民主决策、民主管理、民主监督之外增加"民主协商"。立法走向与其"治理民主"论述方向一致，属时代共识，不构成因果归功。',
    dataSrc: '《村民委员会组织法》2025 年修正文本',
  },
  {
    id: 'L8', status: 'done', type: '转述', date: '2009-01', venue: '《东南学术》2009 年第 1 期',
    claim: '乡镇改革不应简单撤并"七站八所"，而应改进公共服务，通过服务重建国家权威',
    check: '2021-07 中共中央、国务院基层治理意见将"增强乡镇（街道）为民服务能力"列为基层政权建设任务，基层改革以强化服务而非撤并为主线。方向一致，不代表因果归功于本人。',
    dataSrc: '中国政府网 2021-07-11《关于加强基层治理体系和治理能力现代化建设的意见》',
  },
  {
    id: 'L9', status: 'open', type: '原话', date: '2025-01', venue: '《探索与争鸣》2025 年第 1 期',
    url: 'https://www.aisixiang.com/data/164042.html',
    claim: '我国的基层治理正在由直接“管人”向直接“办事”转变，并要求化繁为简、以简驭繁',
    check: '属趋势判断与规范主张，基层负担与事务复杂度缺乏统一的公开量化指标；中央持续出台基层减负与乡镇赋权文件，但"化繁为简"是否实现无法闭环检验。',
    dataSrc: '公开制度文件（检索截至 2026-09）',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2016-07', venue: '《中国社会科学》2016 年第 7 期',
    url: 'https://www.aisixiang.com/data/131371.html',
    claim: '制度粘性、官僚惰性、权力任性等无时不刻不在侵蚀着国家健康的肌体',
    check: '风险提示型命题，无可量化的检验标准；官方以作风建设、基层减负等持续回应相关问题，但"侵蚀"程度无法以公开数据评估。',
    dataSrc: '无可闭环数据（检索截至 2026-09）',
  },
  {
    id: 'L11', status: 'open', type: '原话', date: '2025-01-05', venue: '东方网"政治学·新知"系列报道',
    claim: '尽管家户制作为一种制度正在逐渐解体，但其对当下国家治理仍具有重要价值。',
    check: '家户制"解体"与家庭户规模缩小、人口流动等长期趋势相关，但家户传统对治理的"价值"难以操作化检验；属未决命题。',
    dataSrc: '无可闭环数据（检索截至 2026-09）',
  },
];

// 徐勇公开表述以概念建构与机制论证为主，少见可与官方统计直接比对的数值口径，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '村民自治', '家户制', '国家化', '关系叠加', '田野/微观政治', '基层治理现代化'],
  nodes: [
    { id: 'core', name: '田野中的\n国家—社会关系', cat: 0, size: 58 },
    { id: 'selfgov', name: '村民自治', cat: 1, size: 40 },
    { id: 'three', name: '三个自我 / 四个民主', cat: 1, size: 26 },
    { id: 'findback', name: '找回自治', cat: 1, size: 26 },
    { id: 'kongzhuan', name: '行政化 / 自治空转', cat: 1, size: 22 },
    { id: 'zldemo', name: '中国式治理民主', cat: 1, size: 30 },
    { id: 'jiahu', name: '家户制', cat: 2, size: 40 },
    { id: 'jiahuism', name: '家户主义', cat: 2, size: 26 },
    { id: 'jiaguo', name: '家国共治', cat: 2, size: 22 },
    { id: 'reason', name: '农民理性扩张 / 叠加优势', cat: 2, size: 28 },
    { id: 'farm', name: '家庭农场', cat: 2, size: 20 },
    { id: 'statization', name: '国家化', cat: 3, size: 38 },
    { id: 'party', name: '政党下乡', cat: 3, size: 28 },
    { id: 'admin', name: '行政下乡', cat: 3, size: 22 },
    { id: 'service', name: '服务下乡', cat: 3, size: 22 },
    { id: 'grass', name: '脱草根性', cat: 3, size: 20 },
    { id: 'overlap', name: '关系叠加', cat: 4, size: 36 },
    { id: 'zufu', name: '祖赋人权', cat: 4, size: 28 },
    { id: 'continuity', name: '历史延续性', cat: 4, size: 26 },
    { id: 'guanxi', name: '关系中的国家', cat: 4, size: 28 },
    { id: 'field', name: '田野政治学', cat: 5, size: 36 },
    { id: 'survey', name: '深度中国调查', cat: 5, size: 24 },
    { id: 'orphan', name: '概念孤儿', cat: 5, size: 20 },
    { id: 'micro', name: '微观政治学 / 小规模人群', cat: 5, size: 28 },
    { id: 'xzxp', name: '县政、乡派、村治', cat: 6, size: 30 },
    { id: 'simplify', name: '化繁为简', cat: 6, size: 26 },
    { id: 'sticky', name: '制度粘性 / 官僚惰性', cat: 6, size: 20 },
  ],
  links: [
    ['core', 'selfgov'], ['core', 'jiahu'], ['core', 'statization'], ['core', 'overlap'], ['core', 'field'], ['core', 'xzxp'],
    ['selfgov', 'three'], ['selfgov', 'findback'], ['selfgov', 'kongzhuan'], ['selfgov', 'zldemo'], ['kongzhuan', 'findback'],
    ['jiahu', 'jiahuism'], ['jiahu', 'jiaguo'], ['jiahu', 'reason'], ['jiahu', 'farm'], ['jiaguo', 'findback'],
    ['statization', 'party'], ['statization', 'admin'], ['statization', 'service'], ['party', 'grass'], ['admin', 'kongzhuan'],
    ['overlap', 'zufu'], ['overlap', 'continuity'], ['overlap', 'guanxi'], ['jiahu', 'zufu'], ['continuity', 'jiahu'],
    ['field', 'survey'], ['field', 'orphan'], ['orphan', 'micro'], ['survey', 'guanxi'], ['survey', 'jiahu'],
    ['xzxp', 'simplify'], ['xzxp', 'selfgov'], ['service', 'simplify'], ['sticky', 'simplify'], ['continuity', 'sticky'], ['micro', 'simplify'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '华中村治研究的分化：政治学的"国家建构"取向与社会学的"区域比较"取向（与贺雪峰异同）',
    sides: [
      { who: '徐勇（《政党下乡》2007；《找回自治》2014；《田野政治学的核心概念建构》2021）', view: '转述：以现代国家建构为主轴理解乡村，关注政党、行政、服务"下乡"如何整合乡土社会；在建制村以下探索多层次自治单元，并将田野经验提升为政治学概念。' },
      { who: '贺雪峰（《乡村的去政治化及其后果》；《农村工作通讯》2016 年访谈；《华中师范大学学报》2026 年第 1 期）', view: '转述：以农民行动单位与区域差异为分析框架；指出取消农业税后一般农业型地区村民对选举冷漠、利益密集地区出现贿选；支持将部分自治下沉到自然村或村民小组，但主张保留行政村结构与选举，2026 年提出以村民小组为基础推进基层治理现代化。' },
      { who: '王习明《村治研究的发展轨迹、学术贡献与动力机制》（中国乡村发现网 2011-11-25）', view: '转述：2005 年后华中村治研究一支以徐勇为代表、侧重政治学框架与现代国家建构，另一支以贺雪峰为代表、侧重社会学方法与区域比较；2004 年后贺雪峰、吴毅等转至华中科技大学。' },
    ],
    note: '两者同出 1990 年代华中师大村治研究群体，在自治单元下沉上存在交集，差异主要在学科框架与问题意识；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '村民自治能否作为中国民主的"试验田"或起点',
    sides: [
      { who: '党国英《"村民自治"是民主政治的起点吗？》（《战略与管理》1999 年第 1 期）', view: '转述：乡村民主应是全社会民主政治的有机组成部分，而非独立的"自治民主"；乡村政治改革应是全社会政治变革的最后环节而非起点。' },
      { who: '沈延生《村政的兴衰与重建》（《战略与管理》1998 年第 6 期）', view: '转述：从村政历史演变质疑以村民自治替代基层政权建设的思路（与党国英文同属 1998—1999 年《战略与管理》上的质疑声音）。' },
      { who: '徐勇（《当前中国农村研究方法论问题的反思》2006；《找回自治》2014）', view: '转述：记录批评者称村民自治为"理论怪胎"、宣告"自治已死"，承认建制村自治陷入瓶颈与行政化，但坚持村民自治的内在价值，主张通过下沉自治单元"找回自治"；2022 年进一步以"治理民主"而非选举竞争定位中国民主。' },
    ],
    note: '争论涉及"民主"的定义（竞争性选举 vs 参与和协商治理）与村级单元的适用边界；本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '"祖赋人权"命题能否成立',
    sides: [
      { who: '徐勇（《中国社会科学》2018 年第 1 期；《探索与争鸣》2018 年第 9 期）', view: '转述：血缘理性构成传统中国的本体建构原则，"祖赋人权"是对事实存在的提炼而非价值主张；本人从现代价值角度亦不赞成该命题，但认为它作为事实"都存在"。' },
      { who: '《"祖赋人权"辨析——兼与徐勇教授商榷》（期刊 2020 年第 6 期，作者未能核实）', view: '转述：血缘关系属自然生物属性而非理性；"祖赋"秩序与王权、天命观念相捆绑；以历史材料论证当下现实不构成有效证据。' },
    ],
    note: '商榷文作者与刊名未能在可访问页面核实，仅记其论点；本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '"以县为单位的自治"表述', status: '更正', reason: '未检索到徐勇以此原词发表的论著；经核实的相关主张为 2002 年《县政、乡派、村治》，本栏以后者为准。' },
  { id: 'q2', item: '"长江学者"批次：首批文科 vs 第六批', status: '〔存疑〕', reason: '华中师大官方简历作"教育部首批文科长江学者特聘教授"，维基百科作"第六批"，未见教育部名单原件。' },
  { id: 'q3', item: '中国农村研究院院长任期终点', status: '并陈', reason: '官方简历作 2011—2016；2016 年教育部专访、2023 年社科文献出版社作者简介仍称"院长"。' },
  { id: 'q4', item: '《田野政治学的构建》出版社', status: '并陈', reason: '官方简历作"中国社会科学文献出版社"（名称本身不规范），微信读书作中国社会科学出版社 2021-09。' },
  { id: 'q5', item: '《乡村治理与中国政治》出版年', status: '并陈', reason: '官方目录作 2004 年，维基百科引注作 2003-12。' },
  { id: 'q6', item: '《关系中的国家》第二卷出版月份', status: '并陈', reason: '出版社与书目数据库作 2020-05，另有 2020-03 一说。' },
  { id: 'q7', item: '镜像站、"火星财经"等转载的托名徐勇文章与语录', status: '不收录', reason: '未能溯源至期刊原文或署名出处，同题文章一律改用爱思想或华中师大官网版本。' },
  { id: 'q8', item: '《功能方法如何照亮微观政治？》刊发时间', status: '〔存疑〕', reason: '仅见爱思想转载，未核实原刊期次，本栏未收入文库。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
