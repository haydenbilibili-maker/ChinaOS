// ============================================================================
// 学者专栏 · 林毅夫 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作/本人机构官网 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 网传托名"林毅夫最新演讲""未来十年最赚钱行业"等未见可靠出处者一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  nse: { label: '新结构经济学与产业政策', color: '#10b981' },
  growth: { label: '增长潜力与宏观', color: '#8b5cf6' },
  reform: { label: '中国改革史（比较优势·双轨制）', color: '#e8a317' },
  invest: { label: '投资、消费与财政', color: '#fb923c' },
  south: { label: '发展经济学与全球南方', color: '#22d3ee' },
  global: { label: '中美与国际格局', color: '#c41e3a' },
  welfare: { label: '民生、收入与人口', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '林毅夫',
  born: '1952 年 10 月 15 日 · 台湾宜兰',
  summary:
    '1979 年赴大陆，1982 年获北京大学政治经济学硕士，1986 年获芝加哥大学经济学博士；回国后任职国务院农村发展研究中心、国务院发展研究中心农村部，1994 年创立北京大学中国经济研究中心（现国家发展研究院）并任主任至 2008 年。2008—2012 年任世界银行高级副行长兼首席经济学家，为首位出任该职的发展中国家学者，任内提出"新结构经济学"框架。返回北大后创立新结构经济学研究院、推动设立南南合作与发展学院；长期任全国政协常委、经济委员会副主任。其公开论述以比较优势与后来者优势为轴，集中于产业政策、增长潜力、投资与财政、中国改革史及发展中国家工业化。',
  current: [
    '北京大学新结构经济学研究院院长',
    '北京大学国家发展研究院名誉院长',
    '北京大学南南合作与发展学院名誉院长（原院长，交接时间未核）',
    '第十四届全国政协常委、经济委员会副主任',
  ],
  sources: '北京大学新结构经济学研究院官网简历（CV，2025-11 版）与师资页；北大学者主页；中国政协网 2025-04-24 专访；维基百科（交叉参照）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 2,
  subtitle: '人物履历 · 新结构经济学 · 增长潜力 · 改革史 · 全球南方 · 预判检验',
  span: '1992—2026',
  careerTitle: '履历时间线 · 台湾 → 北大 / 芝大 → 国务院研究机构 → 北大 → 世界银行 → 北大',
  defaultTheme: 'growth',
  moduleId: 'scholarLinYifu',
  sourceNote: '著作原书 / 北大国发院与新结构经济学研究院官网 / 署名文章 / 主流媒体报道 · 对照数据：国家统计局、世界银行收入分组、政府工作报告',
};

export const CAREER_GROUPS = {
  tw: { label: '台湾', color: '#94a3b8' },
  edu: { label: '求学', color: '#22d3ee' },
  gov: { label: '国务院研究机构', color: '#e8a317' },
  pku: { label: '北京大学', color: '#10b981' },
  wb: { label: '世界银行', color: '#8b5cf6' },
  pol: { label: '政协 / 人大 / 工商联', color: '#c41e3a' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '台湾求学与服役（台大肄业、陆军军官学校、政治大学 MBA）', org: '台湾', start: 1971.0, end: 1979.4, group: 'tw', note: '1979 年由金门赴厦门（公开资料）' },
  { id: 'c2', role: '北京大学经济学系 政治经济学硕士', org: '北京', start: 1980.0, end: 1982.5, group: 'edu', note: '毕业 1982 年见本人简历；入学时间据公开资料，未逐一核实〔存疑〕' },
  { id: 'c3', role: '芝加哥大学经济学博士 → 耶鲁大学经济增长中心博士后', org: '美国', start: 1982.7, end: 1987.5, group: 'edu' },
  { id: 'c4', role: '国务院农村发展研究中心发展研究所副所长', org: '北京', start: 1987.5, end: 1990.0, group: 'gov' },
  { id: 'c5', role: '国务院发展研究中心农村部副部长', org: '北京', start: 1990.0, end: 1993.9, group: 'gov' },
  { id: 'c6', role: '北京大学中国经济研究中心创始主任', org: '北京', start: 1994.5, end: 2008.4, group: 'pku' },
  { id: 'c7', role: '香港科技大学经济系教授（兼）', org: '香港', start: 1995.0, end: 2000.0, group: 'pku' },
  { id: 'c8', role: '全国政协委员（第七至第十届；十届兼经济委员会副主任）', org: '北京', start: 1988.3, end: 2008.2, group: 'pol' },
  { id: 'c9', role: '第十一届全国人大代表', org: '北京', start: 2008.2, end: 2013.2, group: 'pol' },
  { id: 'c10', role: '世界银行高级副行长兼首席经济学家', org: '华盛顿', start: 2008.42, end: 2012.45, group: 'wb', note: '2008-05-31 就任；2012 年任期届满' },
  { id: 'c11', role: '北京大学国家发展研究院名誉院长、教授', org: '北京', start: 2012.5, end: 2026.75, group: 'pku' },
  { id: 'c12', role: '全国工商业联合会专职副主席', org: '北京', start: 2013.2, end: 2017.9, group: 'pol' },
  { id: 'c13', role: '全国政协常委、经济委员会副主任（第十二至十四届）', org: '北京', start: 2013.2, end: 2026.75, group: 'pol' },
  { id: 'c14', role: '北京大学新结构经济学研究院院长', org: '北京', start: 2014.9, end: 2026.75, group: 'pku' },
  { id: 'c15', role: '北京大学南南合作与发展学院院长 → 名誉院长', org: '北京', start: 2016.0, end: 2026.75, group: 'pku', note: '本人简历记 2015 年起、《瞭望》记学院 2016 年成立；2025 年起报道多称名誉院长，交接时间〔存疑〕' },
];

export const BOOKS = [
  { id: 'b1', year: 1992, title: '制度、技术与中国农业发展', publisher: '上海三联书店', themes: ['reform'], verified: 'primary', note: '本人简历；获 1992 年度孙冶方经济科学奖' },
  { id: 'b2', year: 1994, title: '中国的奇迹：发展战略与经济改革', publisher: '上海三联书店、上海人民出版社', coauthors: '蔡昉、李周', themes: ['reform', 'growth'], verified: 'primary', note: '1999 年增订版；另有港中大英文版及日、韩、法、越文版' },
  { id: 'b3', year: 1997, title: '充分信息与国有企业改革', publisher: '上海三联书店、上海人民出版社', coauthors: '蔡昉、李周', themes: ['reform'], verified: 'primary', note: '本人简历' },
  { id: 'b4', year: 2000, title: '再论制度、技术与中国农业发展', publisher: '北京大学出版社', themes: ['reform'], verified: 'primary', note: '本人简历' },
  { id: 'b5', year: 2012, title: '解读中国经济', publisher: '北京大学出版社', themes: ['growth', 'reform'], verified: 'primary', note: '前身为 2008 年《中国经济专题》；英文版 Demystifying the Chinese Economy（剑桥大学出版社 2012）' },
  { id: 'b6', year: 2012, title: '新结构经济学', publisher: '北京大学出版社', themes: ['nse'], verified: 'primary', note: '本人简历列书名"新结构经济学"；副标题各版表述不一，未逐字核对' },
  { id: 'b7', year: 2012, title: '繁荣的求索：发展中经济如何崛起', publisher: '北京大学出版社', themes: ['nse', 'south'], verified: 'primary', note: '英文版 The Quest for Prosperity（普林斯顿大学出版社 2012）' },
  { id: 'b8', year: 2012, title: '从西潮到东风', publisher: '中信出版社', themes: ['global', 'south'], verified: 'primary', note: '世界银行任内对国际经济问题的思考' },
  { id: 'b9', year: 2012, title: '本体与常无：经济学方法论对话', publisher: '北京大学出版社', themes: ['nse'], verified: 'primary', note: '前身为 2005 年《与林老师对话——论经济学方法》' },
  { id: 'b10', year: 2016, title: '超越发展援助：在一个多极世界中重构发展合作新理念', publisher: '北京大学出版社', coauthors: '王燕', themes: ['south'], verified: 'primary' },
  { id: 'b11', year: 2017, title: '战胜命运：跨越贫困陷阱，创造经济奇迹', publisher: '北京大学出版社', coauthors: '孟加（Célestin Monga）', themes: ['south', 'nse'], verified: 'primary' },
  { id: 'b12', year: 2020, title: '解读世界经济发展', publisher: '高等教育出版社', date: '2020-09', isbn: '9787040536027', coauthors: '付才辉', themes: ['south', 'global'], verified: 'primary' },
  { id: 'b13', year: 2021, title: '论中国经济：挑战、底气与后劲', publisher: '中信出版社', date: '2021-04', isbn: '9787521727593', themes: ['growth', 'invest'], verified: 'primary' },
  { id: 'b14', year: 2024, title: '中国的奇迹：发展战略与经济改革（30 周年纪念版）', publisher: '格致出版社', date: '2024-10', isbn: '9787543235960', coauthors: '蔡昉、李周', themes: ['reform', 'growth'], verified: 'primary', note: '新增 30 周年重印序' },
  { id: 'b15', year: 2025, title: '解读中国经济：百年变局加速演进下的民族复兴之路', publisher: '北京大学出版社', date: '2025-01', isbn: '9787301354193', themes: ['growth', 'global'], verified: 'primary', note: '第 5 版；列入 2024 年中宣部主题出版重点出版物' },
];

/** 讲话 / 采访 / 署名文章 / 论文文库 */
export const CORPUS = [
  { id: 'k1992', date: '1992', form: '论文', venue: 'Rural Reforms and Agricultural Growth in China · American Economic Review 第 82 卷第 1 期', source: '美国经济评论（AER）第 34—51 页；本人简历', url: 'https://ideas.repec.org/a/aea/aecrev/v82y1992i1p34-51.html', verified: 'primary', themes: ['reform'] },
  { id: 'k1994', date: '1994', form: '著作', venue: '《中国的奇迹：发展战略与经济改革》（与蔡昉、李周合著）', source: '上海三联书店、上海人民出版社；上观新闻 2024-10-19 报道', url: 'https://www.jfdaily.com/wx/detail.do?id=808782', verified: 'primary', themes: ['reform', 'growth'] },
  { id: 'k2003', date: '2003', form: '讲座', venue: '北大之江发展论坛演讲并答问 · 渐进式改革', source: '北京大学国家发展研究院网站（2004-11-18 发布）', url: 'https://www.nsd.pku.edu.cn/sylm/xw/254134.htm', verified: 'primary', themes: ['reform'] },
  { id: 'k2012', date: '2012-06-18', form: '讲话', venue: '北大国发院"新结构经济学"学术研讨会（世行卸任后首次公开演讲）', source: '新华网（央视网转载）；财新网 2012-06-19', url: 'http://news.cntv.cn/20120619/112018.shtml', verified: 'media', themes: ['growth', 'nse', 'welfare'] },
  { id: 'k2013b', date: '2013-04-06', form: '讲话', venue: '博鳌亚洲论坛 2013 年年会 · 博鳌对话', source: '新华网（人民网转载）', url: 'http://politics.people.com.cn/n/2013/0406/c70731-21034566.html', verified: 'media', themes: ['invest'] },
  { id: 'k2013c', date: '2013-07-11', form: '署名文章', venue: '署名文章 · 投资与消费之辩（兼作媒体访谈声明）', source: '第一财经日报（新浪财经转载）', url: 'http://finance.sina.com.cn/review/hgds/20130711/014516083742.shtml', verified: 'primary', themes: ['invest'] },
  { id: 'k2014', date: '2014-03-21', form: '讲座', venue: '北京高校统战大讲堂首场报告', source: '中国新闻网', url: 'https://www.chinanews.com/cj/2014/03-21/5981190.shtml', verified: 'media', themes: ['growth'] },
  { id: 'k2015', date: '2015-10-29', form: '采访', venue: '搜狐财经现场采访 · 全面放开二孩', source: '搜狐财经（北大国发院 BiMBA 网站转载）', url: 'https://www.bimba.pku.edu.cn/wm/xwzx/nrgs/wz/424311.htm', verified: 'media', themes: ['welfare'] },
  { id: 'k2016', date: '2016-11-09', form: '讲话', venue: '北大国发院"朗润·格政"产业政策思辨会（与张维迎面对面辩论）', source: '澎湃新闻校对整理实录（虎嗅网转载）；北京大学新闻网', url: 'https://m.huxiu.com/article/171678.html', verified: 'media', themes: ['nse'] },
  { id: 'k2017a', date: '2017-03', form: '采访', venue: '全国两会期间财新专访', source: '财新网（北大国发院 BiMBA 网站 2017-03-14 转载）', url: 'https://www.bimba.pku.edu.cn/wm/xwzx/xm/mba_xm/428474.htm', verified: 'media', themes: ['invest', 'growth', 'global'] },
  { id: 'k2017b', date: '2017-07', form: '采访', venue: '凤凰卫视《领航者》访谈', source: '北大国发院 BiMBA 发布；北大新结构经济学研究院 2017-07-20 精简文字版', verified: 'media', themes: ['invest'] },
  { id: 'k2018', date: '2018-12-19', form: '讲座', venue: '清华大学国情研究院"国情讲坛"第 21 讲 · 中国改革开放四十年与新结构经济学', source: '清华大学国情研究院（内容经本人审定）', url: 'https://www.iccs.tsinghua.edu.cn/announce_info/500.html', verified: 'primary', themes: ['reform'] },
  { id: 'k2019', date: '2019', form: '讲话', venue: '创新工场十周年活动演讲 · 预测中国经济未来十年', source: '爱思想网站转载（2019-11-27）', url: 'https://www.aisixiang.com/data/119204.html', verified: 'reprint', themes: ['growth', 'global'] },
  { id: 'k2021a', date: '2021-04', form: '采访', venue: '中新社"中国焦点面对面"专访', source: '中国新闻网 2021-04-09', url: 'https://www.chinanews.com/gn/2021/04-09/9450996.shtml', verified: 'media', themes: ['growth'] },
  { id: 'k2021b', date: '2021-04-18', form: '讲话', venue: '朵云书院"上海之巅读书会" · 《论中国经济》新书活动', source: '文汇网', url: 'http://whb-oss.oss-cn-shanghai.aliyuncs.com/zhuzhan/rd/20210418/400772.html', verified: 'media', themes: ['growth'] },
  { id: 'k2021c', date: '2021-10-29', form: '论文', venue: '工作论文 No.C2021004《地方政府债务与经济增长——基于地方投资平台债务的分析》（与文永恒、顾艳伟）', source: '北京大学新结构经济学研究院；后刊于《财政研究》2023 年第 2 期', url: 'https://www.nse.pku.edu.cn/xsyj/xsjz/gzlw/74f95bf3f44a4a2981b4f2c1fa305cf5.htm', verified: 'primary', themes: ['invest'] },
  { id: 'k2022a', date: '2022-03-03', form: '采访', venue: '中新社采访 · 高收入门槛', source: '中国新闻网（新结构经济学研究院官网 2022-03-04 转载）', url: 'https://www.chinanews.com.cn/gn/2022/03-03/9691320.shtml', verified: 'media', themes: ['growth'] },
  { id: 'k2022b', date: '2022-03', form: '讲话', venue: '北大国发院"中国经济观察"报告会 · 增长目标与共同富裕', source: '中宏网等转载', url: 'http://www.china-cer.com.cn/zhonghong/2022032117403.html', verified: 'reprint', themes: ['growth'] },
  { id: 'k2024b', date: '2024-09-02', form: '采访', venue: '《瞭望》新闻周刊专访 · 中非合作（中非合作论坛峰会前夕）', source: '新华网', url: 'http://www.bj.xinhua.org/20240902/18f2222e248c4f8b964d4af2e665bc6b/c.html', verified: 'media', themes: ['south'] },
  { id: 'k2024d', date: '2024-10-21', form: '署名文章', venue: '《中国的奇迹》出版 30 周年重印序', source: '北京大学新结构经济学研究院官网', url: 'https://www.nse.pku.edu.cn/zxdt/75490e8a863a4e85947cb4d319061ea3.htm', verified: 'primary', themes: ['reform'] },
  { id: 'k2024e', date: '2024-11', form: '讲话', venue: '第七届中国企业论坛 · 不同类型产业如何发展新质生产力', source: '中工网', url: 'https://jd.workercn.cn/c/2024-11-12/8390189.shtml', verified: 'media', themes: ['nse'] },
  { id: 'k2025a', date: '2025-04-22', form: '采访', venue: '人民政协报专访（前一日出席中国公共外交协会"临甲7号"沙龙）', source: '人民政协报 / 人民政协网；观察者网 2025-04-22', url: 'https://www.rmzxw.com.cn/c/2025-04-24/3713074.shtml', verified: 'media', themes: ['global'] },
  { id: 'k2025b', date: '2025-04-28', form: '讲座', venue: '北大国发院承泽论坛第 39 期 · 中国经济的内在逻辑与新挑战', source: '北大国发院新闻稿；观察者网经授权全文转载', url: 'https://www.guancha.cn/LinYiFu/2025_10_25_794516_1.shtml', verified: 'media', themes: ['growth', 'welfare'] },
  { id: 'k2025c', date: '2025-11-23', form: '讲话', venue: '第十届复旦首席经济学家论坛 · 制定十五五增长目标', source: '北京大学新结构经济学研究院官网（2025-12-02 发布）', url: 'https://www.nse.pku.edu.cn/10th/jqhd/343b5336d8284d1c81f01d1625ef6e69.htm', verified: 'primary', themes: ['global', 'growth'] },
  { id: 'k2026b', date: '2026-03-10', form: '采访', venue: '2026 年全国两会人民网采访', source: '人民网', url: 'http://lianghui.people.com.cn/2026/BIG5/n1/2026/0310/c461828-40679050.html', verified: 'media', themes: ['global', 'welfare'] },
  { id: 'k2026a', date: '2026-03', form: '采访', venue: '全国两会期间中国青年报采访', source: '中国青年报（北大新结构经济学研究院官网 2026-03-12 转载）', url: 'https://www.nse.pku.edu.cn/zxdt/ecb5a65d360949cb9c6405199195b2ac.htm', verified: 'media', themes: ['growth', 'welfare'] },
  { id: 'k2026d', date: '2026-03-24', form: '讲话', venue: '博鳌亚洲论坛 2026 年年会 · 中国经济展望分论坛', source: '北京商报（财经网转载）', url: 'http://economy.caijing.com.cn/20260325/5149288.shtml', verified: 'media', themes: ['growth'] },
  { id: 'k2026e', date: '2026-04-25', form: '讲话', venue: '新结构经济学安徽研究中心揭牌活动（合肥）', source: '中国新闻网（大皖新闻、新浪新闻转载）', url: 'https://news.sina.com.cn/c/2026-04-26/doc-inhvvkkf3193950.shtml', verified: 'media', themes: ['growth'] },
  { id: 'k2026g', date: '2026-08-07', form: '讲话', venue: '北大国发院承泽论坛第 59 期 · AI 主题点评', source: '北京大学新结构经济学研究院官网（2026-09-01 发布，据点评整理）', url: 'https://www.nse.pku.edu.cn/zxdt/2b40e083dcc648b996ab709698ec04ba.htm', verified: 'primary', themes: ['south'] },
  { id: 'k2026f', date: '2026-09-19', form: '讲话', venue: '2026 清华五道口首席经济学家论坛', source: '经济学家圈演讲实录（新浪财经转载）；腾讯新闻同日报道', url: 'https://finance.sina.com.cn/cj/2026-09-19/doc-iniskcea7575201.shtml', verified: 'reprint', themes: ['invest', 'global'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 新结构经济学与产业政策 ——
  { id: 'n1', k: 'k2016', theme: 'nse', type: '原话', text: '要让第一个吃螃蟹的企业家能够成功，还要政府发挥因势利导的作用，来解决这些软硬基础设施完善的协调和供给的问题。' },
  { id: 'n2', k: 'k2016', theme: 'nse', type: '原话', text: '如果按照比较优势发展我们知道有两个前提，一个是有效的市场，一个是有为的政府' },
  { id: 'n3', k: 'k2016', theme: 'nse', type: '转述', text: '合适的产业政策应瞄准人均收入为本国一至三倍、要素禀赋相近且发展较快国家的成熟产业（即"潜在比较优势"产业），并以税收优惠激励"第一个吃螃蟹的企业家"；产业政策失败的主因是违背比较优势、依赖保护补贴，从而引发寻租。' },
  { id: 'n4', k: 'k2012', theme: 'nse', type: '原话', text: '按照比较优势发展经济，充分利用后发优势，任何发展中国家都可以维持几十年的高速增长。' },
  { id: 'n5', k: 'k2024e', theme: 'nse', type: '原话', text: '我们可以利用新型举国体制，由企业做龙头，组合国内的科研力量以及相关产业的企业配套力量，在国家支持下取得突破。' },
  // —— 增长潜力与宏观 ——
  { id: 'g1', k: 'k2012', theme: 'growth', type: '原话', text: '未来中国的后发优势潜力仍然很大，中国经济至少还可以保持20年8%左右的增长。' },
  { id: 'g2', k: 'k2014', theme: 'growth', type: '转述', text: '预计到 2020 年左右中国经济年均增速可保持 7.5%—8%，人均收入可达 12700 美元；到 2030 年按市场汇率经济规模可能是美国的 1.5—2 倍、按购买力平价约为 2 倍。' },
  { id: 'g3', k: 'k2019', theme: 'growth', type: '原话', text: '在中国到2028年或者是宽松一点到2030年，还有8%的增长潜力，利用国内的有利条件，我判断实现6%左右的增长没有问题。' },
  { id: 'g4', k: 'k2021b', theme: 'growth', type: '转述', text: '称至少到 2028 年前中国仍有每年 8% 的增长潜力、具备 6% 左右的增长实力，并有信心在 2035 年前使人均 GDP 达到中等发达国家水平。' },
  { id: 'g5', k: 'k2022b', theme: 'growth', type: '原话', text: '增长潜力是从技术面来看，在不引起通胀、不过度消耗自己未来发展的各种资源的状况下，可以维持的经济增长速度。' },
  { id: 'g6', k: 'k2025b', theme: 'growth', type: '原话', text: '尽管如此，我个人的看法是，在8%的增长潜力下，我们在2035年之前实现年均5%-6%的增长是可能的。' },
  { id: 'g7', k: 'k2025b', theme: 'growth', type: '转述', text: '以德、日、韩相近追赶阶段的 16 年人均 GDP 增速（8.1%—8.6%）为参照，推定 2019—2035 年有人均 GDP 年均 8% 的潜力；2036—2049 年仍有约 6% 潜力、可实现 3%—4%，2049 年人均 GDP 有望达到美国一半。' },
  { id: 'g8', k: 'k2025c', theme: 'growth', type: '转述', text: '解释近年实际增速低于潜力的两点原因：应对美国"卡脖子"风险的代价，以及经济信心不足（部分受国外流行言论影响）。' },
  { id: 'g9', k: 'k2026d', theme: 'growth', type: '原话', text: '只要国际环境不发生太大的不可预期事件，中国经济增长达到4.5%甚至5%完全有可能，如果做好一点，甚至会有高于5%的增长。' },
  { id: 'g10', k: 'k2026a', theme: 'growth', type: '原话', text: '我们设定的增长目标是4.5%-5%，我认为是考虑到增长的可能、要应对的挑战以及继续推动改革的需要等的结果。' },
  { id: 'g11', k: 'k2026a', theme: 'growth', type: '转述', text: '称按购买力平价中国经济规模已达美国 130% 多、按市场汇率约为美国 65%；理论上 2030 年可达美国水平，"十五五"时期经济总量很可能达到 170 万亿—180 万亿元。' },
  { id: 'g12', k: 'k2022a', theme: 'growth', type: '原话', text: '我相信，在未来一年、两年或是到‘十四五’规划完成之前，跨过中等收入陷阱，一定可以实现。' },
  { id: 'g13', k: 'k2026e', theme: 'growth', type: '原话', text: '现在高收入的国家门槛是人均国民收入13935美元，我们差距只有135（美元），应该最慢明年，我们就可以跨过这个门槛，变成一个高收入国家。' },
  { id: 'g14', k: 'k2021a', theme: 'growth', type: '转述', text: '按当时高收入门槛人均 GNI 12535 美元计，称中国人均 GDP 约 11500 美元，"相信在 2025 年前后中国就能进入高收入门槛"，跨越中等收入陷阱"不是难事"。' },

  // —— 中国改革史 ——
  { id: 'r1', k: 'k1992', theme: 'reform', type: '转述', text: '以省级面板数据做增长核算，1978—1984 年种植业产出增长中约 46.89% 来自家庭联产承包责任制改革（摘要表述为"约一半"），1984 年后增长放缓另有原因。' },
  { id: 'r2', k: 'k2003', theme: 'reform', type: '原话', text: '一种是在某些国家采用的休克疗法，另一种是国内所采用的逐步渐进的双轨制、逐渐从计划经济向市场经济过渡的办法。' },
  { id: 'r3', k: 'k2018', theme: 'reform', type: '原话', text: '中国没有按照“华盛顿共识”的办法去做，而是推行从1978年以来的“老人老办法、新人新办法”。' },
  { id: 'r4', k: 'k2018', theme: 'reform', type: '转述', text: '双轨渐进改革一方面对原有国企继续给予转型期保护补贴，另一方面放开符合比较优势的民营劳动密集型产业准入；认为资本密集型国企缺乏"自生能力"，扭曲具有内生性，"休克疗法"忽视了这一点。' },
  { id: 'r5', k: 'k2024d', theme: 'reform', type: '原话', text: '让我们感到高兴的是这本书中对中国改革发展进程和成效的诸多预测竟然一一得到证实。', verified: 'primary' },
  { id: 'r6', k: 'k1994', theme: 'reform', type: '转述', text: '据上观新闻 2024 年报道，1994 年初版预测按购买力平价计算中国 GDP 将在 2015 年前后超过美国。', verified: 'media' },

  // —— 投资、消费与财政 ——
  { id: 'i1', k: 'k2013c', theme: 'invest', type: '原话', text: '把我国国民经济中存在的居民收入占比下降、货币超发、创新能力不足、污染、腐败等一系列问题都归结为投资惹的祸，因而认为我国应该放弃投资拉动的增长模式，改为以消费来拉动我国的经济增长，显然是一种头痛医脚、因噎废食、“把婴儿和洗澡水一起倒掉”的主张。' },
  { id: 'i2', k: 'k2017b', theme: 'invest', type: '原话', text: '生产力水平的提高不是吃出来的，不是消费出来的，生产力水平的提高是投资出来的。' },
  { id: 'i3', k: 'k2013b', theme: 'invest', type: '转述', text: '消费是发展的目的，投资是发展的手段；未来驱动增长的投资分两类——以企业为主体的技术创新、产业升级投资，以及基础设施改善投资，基础研发宜由政府主导。' },
  { id: 'i4', k: 'k2017a', theme: 'invest', type: '原话', text: '所以不能简单地讲财政赤字不能超过3%，我认为必要时可以突破这个上限。' },
  { id: 'i5', k: 'k2017a', theme: 'invest', type: '转述', text: '主张允许地方政府发行长期基础设施公债，替代以平台短债投资长期项目造成的期限错配；称政府负债主要对应基础设施资产，净负债率低于名义值。' },
  { id: 'i6', k: 'k2021c', theme: 'invest', type: '转述', text: '工作论文用 28 省 2006—2017 年平台债务数据，发现平台债务上升短期、长期均显著促进增长且未挤出非国有投资，称之为"超越凯恩斯主义"的财政效果，建议在存在基础设施瓶颈时于衰退期实施更积极的财政政策。' },
  { id: 'i7', k: 'k2026f', theme: 'invest', type: '原话', text: '我看我们能做的当然一方面靠投资来进行产业升级，抓住第四次工业革命的机遇。' },
  { id: 'i8', k: 'k2026f', theme: 'invest', type: '转述', text: '称中国经济约占全球 18%，难以用国内需求弥补占 82% 的外需疲软；再平衡主要靠投资（产业升级、绿色与新型基础设施、企业"走出去"），并表示"比较支持余永定"的观点。', verified: 'media' },

  // —— 发展经济学与全球南方 ——
  { id: 's1', k: 'k2024b', theme: 'south', type: '原话', text: '我们希望，中非学界能够进一步加强交流互动，为中非合作交流、全球南方国家繁荣发展贡献积极力量，为人类命运共同体宏伟目标的实现打下坚强的互信和智力基础。' },
  { id: 's2', k: 'k2024b', theme: 'south', type: '转述', text: '介绍南南合作与发展学院（2016 年成立）已培养约 210 位非洲国家学员；研究院以"产业甄别—园区规划—招商引资"框架为非洲国家提供产业政策建议，倡导工业园区与引进龙头企业。' },
  { id: 's3', k: 'k2026g', theme: 'south', type: '原话', text: '如果广大发展中国家能使用中国开源、价廉的人工智能，将人工智能融入生产生活的方方面面，我相信它们就能真正缩小与发达国家的发展差距' },

  // —— 中美与国际格局 ——
  { id: 'w1', k: 'k2025a', theme: 'global', type: '原话', text: '这些没有比较优势的制造业即使回到美国，生产的价格也一定比进口价格高。美国人民将为此付出巨大代价。' },
  { id: 'w2', k: 'k2025a', theme: 'global', type: '转述', text: '中美经济存在"脱钩"风险但完全脱钩可能性不大：美国企业需要中国市场与供应链、美国消费者需要中国商品；高关税将使美国高科技企业出口市场萎缩；主张贸易争端回到 WTO 框架。' },
  { id: 'w3', k: 'k2025c', theme: 'global', type: '原话', text: '我觉得，十五五时期很可能会出现像2000年互联网泡沫破灭那样的人工智能泡沫破灭。' },
  { id: 'w4', k: 'k2025c', theme: 'global', type: '转述', text: '判断发达国家将面临 2008 年金融危机以来的"迷失的 20 年"；认为美国遏制中国的根本原因是"卧榻之侧岂容他人酣睡"的心态，应对之道在于中国自身发展。' },
  { id: 'w5', k: 'k2026b', theme: 'global', type: '原话', text: '中国对世界经济增长的贡献，我相信会比过去更多。' },

  // —— 民生、收入与人口 ——
  { id: 'p1', k: 'k2015', theme: 'welfare', type: '原话', text: '现在调整人口政策已经迟了，但总比不调整要好。' },
  { id: 'p2', k: 'k2025b', theme: 'welfare', type: '原话', text: '决定经济增长的关键因素并非劳动力的数量，而是有效劳动的数量。' },
  { id: 'p3', k: 'k2026b', theme: 'welfare', type: '转述', text: '称研究全球 50 多个进入老龄化的国家发现，"未富先老"国家进入老龄化后经济增速反而加快；应对关键在"有效劳动"（数量×教育质量），老龄化也催生银发经济。' },
  { id: 'p4', k: 'k2026a', theme: 'welfare', type: '原话', text: '人们手头有钱，为什么不消费？我想，跟信心有关。' },
  { id: 'p5', k: 'k2026a', theme: 'welfare', type: '转述', text: '提振消费需提高收入水平相对低、消费倾向高的群体在收入分配中的比重；引用住户存款 2024 年增加 14.26 万亿元、2025 年增加 14.64 万亿元，说明消费不足与信心有关。' },
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

export const FEATURED = ['n1', 'g1', 'g6', 'g12', 'r3', 'i2', 'w1', 'p2'];

export const THEME_LINKS = {
  nse: [{ to: '/manufacturing', label: '制造业' }, { to: '/tech-policy', label: '科技政策' }, { to: '/npf', label: '新质生产力' }],
  growth: [{ to: '/econ-dashboard', label: '经济大盘' }, { to: '/middleincometrap', label: '中等收入陷阱' }, { to: '/benchmark', label: '国际对标' }],
  reform: [{ to: '/reform', label: '改革' }, { to: '/soe', label: '国企' }, { to: '/rural', label: '农村' }],
  invest: [{ to: '/debt', label: '地方债务' }, { to: '/consumption', label: '消费' }],
  south: [{ to: '/bri', label: '一带一路' }, { to: '/fdi', label: '外资' }],
  global: [{ to: '/diplomacy', label: '外交' }, { to: '/thucydides', label: '修昔底德陷阱' }, { to: '/foreign-trade', label: '外贸' }],
  welfare: [{ to: '/demographic', label: '人口' }, { to: '/silver-economy', label: '银发经济' }, { to: '/socialgov', label: '社会治理' }],
};

export const THEME_INTRO = {
  nse: '"新结构经济学"以要素禀赋结构为起点：禀赋决定比较优势，比较优势决定最优产业与技术结构；实现路径是"有效市场 + 有为政府"，政府以因势利导解决先行企业的外部性与软硬基础设施协调问题。2024 年后延伸为五类产业分类与"新型举国体制"攻关战略型产业。',
  growth: '"后来者优势"是其增长判断的核心变量：以中国与美国人均 GDP（PPP）差距对标日、韩、德等追赶经济体，先后提出"2008 年起 20 年 8%""2028 年前 8% 潜力""2035 年前 8% 潜力"，并区分潜力与实际增速；高收入门槛与中美经济规模对比是其反复给出的可检验时间表。',
  reform: '以"比较优势战略 vs 赶超战略"解释改革前后绩效差异，以"老人老办法、新人新办法"的双轨渐进路径对照"华盛顿共识"与"休克疗法"，并以"自生能力"概念说明转型期补贴的内生性。其农业经济学研究（家庭联产承包责任制贡献估计）是这一叙事的实证起点。',
  invest: '坚持"消费是目的、投资是手段"：生产率提高依赖以投资为载体的技术创新、产业升级与基础设施；主张用于消除增长瓶颈的赤字可突破 3%，以地方长期公债替代平台短债。该立场与"消费拉动"论长期对峙，2026 年再次表示支持以投资实现内外再平衡。',
  south: '世行任内将新结构经济学推向发展中国家政策实践，回国后通过南南合作与发展学院培养发展中国家官员，以"产业甄别—园区规划—招商引资"框架服务非洲工业化；2026 年提出以中国开源、低成本人工智能助力发展中国家"趋同"。',
  global: '以比较优势与产业外移解释中美经贸关系，判断完全脱钩可能性不大、高关税对美损害更大；将中国视为全球增长的稳定贡献者（约 30%），并对发达国家"迷失的 20 年"与美国人工智能泡沫风险作出前瞻判断。',
  welfare: '以"有效劳动"（劳动力数量 × 教育质量）回应人口红利消失论，主张老龄化不改变增长潜力；在收入分配上认为消费比重低源于要素市场扭曲与收入分配结构，近年强调提高中低收入群体收入与信心。',
};

// ============================================================================
// 预判检验台账：只收可被数据检验的前瞻性表述；对照数据截至核验日
// 实际增速取国家统计局年度公布值（2025 年 5.0% 据 2026-02-28 统计公报）；2026 年取上半年 4.7%
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '1994', venue: '《中国的奇迹》初版（上观新闻 2024 年转述）',
    claim: '按购买力平价计算，中国 GDP 将在 2015 年前后超过美国',
    check: 'IMF《世界经济展望》2014 年 10 月数据库按 PPP 口径显示 2014 年中国 GDP 超过美国；林本人 2026-03 亦引"2014 年世界银行和 IMF 公布"。',
    dataSrc: 'IMF WEO（2014-10）；中国青年报 2026-03 采访（新结构经济学研究院官网）',
  },
  {
    id: 'L2', status: 'failed', type: '原话', date: '2012-06-18', venue: '北大"新结构经济学"研讨会（新华网）',
    url: 'http://news.cntv.cn/20120619/112018.shtml',
    claim: '中国经济至少还可以保持20年8%左右的增长。',
    check: '2013—2025 年实际增速：7.8、7.4、7.0、6.8、6.9、6.7、6.0、2.2、8.4、3.0、5.2、5.0、5.0（%），算术平均约 6.0%，仅 2021 年（低基数）超过 8%；2026 年上半年 4.7%。即便 2026—2028 年均达 8%，20 年平均亦无法回到 8%。注：林本人后续多次强调 8% 指"潜力"而非实际增速，按潜力口径不可直接证伪，本台账按原句"保持……增长"的实际增速口径判定。',
    dataSrc: '国家统计局历年统计公报；本站经济大盘模块（2026 上半年）',
  },
  {
    id: 'L3', status: 'failed', type: '转述', date: '2014-03-21', venue: '北京高校统战大讲堂（中新网）',
    claim: '到 2020 年左右年均增速 7.5%—8%，人均收入达 12700 美元',
    check: '2014—2020 年实际增速年均约 6.1%（剔除 2020 年约 6.8%）；林本人 2022 年引用 2021 年人均 GDP 为 12551 美元，即 2021 年仍未达 12700 美元。',
    dataSrc: '国家统计局历年统计公报；中新网 2022-03-03',
  },
  {
    id: 'L4', status: 'failed', type: '原话', date: '2022-03-03', venue: '中新社采访',
    url: 'https://www.chinanews.com.cn/gn/2022/03-03/9691320.shtml',
    claim: '我相信，在未来一年、两年或是到‘十四五’规划完成之前，跨过中等收入陷阱，一定可以实现。',
    check: '世界银行 2026-07-01 发布的 FY2027 收入分组（基于 2025 年 Atlas 法人均 GNI）仍将中国列为中高收入经济体，高收入门槛为 14375 美元。国家统计局口径 2025 年人均 GDP 按年均汇率折算 13953 美元（GDP 与 GNI 口径不同）。2021-04（"2025 年前后"）与 2019 年（"2025 年跨过 12700 美元"）的同类判断一并视为未兑现。',
    dataSrc: '世界银行 Country and Lending Groups（2026-07）；国家统计局 2025 年统计公报评读',
  },
  {
    id: 'L5', status: 'open', type: '原话', date: '2026-04-25', venue: '新结构经济学安徽研究中心揭牌活动（中新网）',
    url: 'https://news.sina.com.cn/c/2026-04-26/doc-inhvvkkf3193950.shtml',
    claim: '应该最慢明年，我们就可以跨过这个门槛，变成一个高收入国家。',
    check: '讲话所引 13935 美元为 FY2026 门槛；2026-07 世行已将门槛上调至 14375 美元。"明年"（2027 年）数据对应 2028-07 分组，窗口未到期。',
    dataSrc: '世界银行收入分组（2025-07 / 2026-07）',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2019', venue: '创新工场十周年演讲（爱思想转载）',
    url: 'https://www.aisixiang.com/data/119204.html',
    claim: '在中国到2028年或者是宽松一点到2030年，还有8%的增长潜力，利用国内的有利条件，我判断实现6%左右的增长没有问题。',
    check: '2020—2025 年实际增速 2.2、8.4、3.0、5.2、5.0、5.0（%），年均约 4.8%；2026 年上半年 4.7%。若以 2020—2028 年均 6% 衡量，2026—2028 年需年均约 8.4%。窗口至 2028/2030 年，暂列未决。',
    dataSrc: '国家统计局；本站经济大盘模块',
  },
  {
    id: 'L7', status: 'open', type: '原话', date: '2025-04-28', venue: '北大国发院承泽论坛第 39 期',
    url: 'https://www.guancha.cn/LinYiFu/2025_10_25_794516_1.shtml',
    claim: '在8%的增长潜力下，我们在2035年之前实现年均5%-6%的增长是可能的。',
    check: '2025 年实际增长 5.0%；2026 年目标 4.5%—5%，上半年 4.7%（一季度 5.0、二季度 4.3）。检验窗口至 2035 年。',
    dataSrc: '国家统计局 2025 年统计公报；2026 年政府工作报告；本站经济大盘模块',
  },
  {
    id: 'L8', status: 'open', type: '转述', date: '2026-03', venue: '中国青年报采访；另见 2024-10《中国的奇迹》30 周年座谈',
    claim: '按市场汇率计算，中国经济规模 2030 年前后超过美国',
    check: '林本人 2026-03 称按市场汇率约为美国 65%（2023 年 65.2%）；2025 年中国 GDP 140.19 万亿元。2014 年曾称"2030 年为美国 1.5—2 倍"，后续表述已下修为"达到/超过美国"。窗口至 2030 年。',
    dataSrc: '国家统计局 2025 年统计公报；上观新闻 2024-10-19',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2026-03', venue: '中国青年报采访',
    claim: '"十五五"时期经济总量很可能达到 170 万亿—180 万亿元',
    check: '2025 年 GDP 1401879 亿元；至 2030 年达 170 万亿—180 万亿元需名义年均增长约 3.9%—5.1%。2026 年上半年 GDP 695704 亿元。',
    dataSrc: '国家统计局 2025 年统计公报及 2026-07-15 上半年数据',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2025-11-23', venue: '第十届复旦首席经济学家论坛',
    url: 'https://www.nse.pku.edu.cn/10th/jqhd/343b5336d8284d1c81f01d1625ef6e69.htm',
    claim: '我觉得，十五五时期很可能会出现像2000年互联网泡沫破灭那样的人工智能泡沫破灭。',
    check: '窗口为 2026—2030 年；原话未给出可量化判定标准（如指数回撤幅度），本站不自行设定阈值，暂列未决。',
    dataSrc: '—（待窗口结束后按主流市场指数与主要 AI 企业估值变动复核）',
  },
  {
    id: 'L11', status: 'done', type: '原话', date: '2017-03', venue: '全国两会期间财新专访',
    url: 'https://www.bimba.pku.edu.cn/wm/xwzx/xm/mba_xm/428474.htm',
    claim: '所以不能简单地讲财政赤字不能超过3%，我认为必要时可以突破这个上限。',
    check: '2020 年政府工作报告赤字率按 3.6% 以上安排；2025 年赤字率按 4% 左右安排，3% 上限已被突破。政策动因多元，此处仅记录建议方向与实际政策一致。',
    dataSrc: '2020 年、2025 年政府工作报告',
  },
  {
    id: 'L12', status: 'done', type: '转述', date: '2017-03', venue: '全国两会期间财新专访',
    claim: '保持 6.5% 左右的 GDP 增速切实可行',
    check: '2017 年 GDP 实际增长 6.9%（国家统计局初步核算）。',
    dataSrc: '国家统计局 2017 年统计公报',
  },
  {
    id: 'L13', status: 'open', type: '转述', date: '2013-04-06', venue: '博鳌亚洲论坛 2013 年年会（新华网）',
    claim: '未来中国经济增长仍将由投资而非消费驱动',
    check: '支出法口径：2024 年最终消费拉动 GDP 增长 2.2 个百分点、资本形成 1.3 个百分点；2025 年分别为 2.6、0.8 个百分点。林所指"驱动"是以投资为载体的生产率提升机制，与支出法贡献率口径不同，不作闭环。',
    dataSrc: '国家统计局 2024、2025 年统计公报',
  },
  {
    id: 'L14', status: 'open', type: '原话', date: '2026-03', venue: '中国青年报采访',
    url: 'https://www.nse.pku.edu.cn/zxdt/ecb5a65d360949cb9c6405199195b2ac.htm',
    claim: '即使在4.5%-5%之间，我相信，中国对世界经济增长的贡献依然可以达到30%。',
    check: '需待 2026 年全年中国及全球 GDP 数据（IMF / 世行口径）计算贡献率，窗口未到期。',
    dataSrc: '国家统计局；IMF《世界经济展望》',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '2021 年人均 GDP', said: 12551, official: 12551, unit: '美元', saidSrc: '2022-03-03 中新社采访', offSrc: '国家统计局：人均 GDP 按年平均汇率折算 12551 美元', comparable: true },
  { id: 'n2', label: '2024 年人均 GDP', said: 13445, official: 13445, unit: '美元', saidSrc: '2025-04-28 承泽论坛', offSrc: '国家统计局：95749 元 ÷ 年均汇率 7.1217 ≈ 13445 美元', comparable: true },
  { id: 'n3', label: '高收入门槛', said: 13935, official: 14375, unit: '美元', saidSrc: '2026-04-25 合肥讲话（时行 FY2026 门槛）', offSrc: '世界银行 2026-07-01 更新 FY2027 门槛（讲话后调整）', comparable: false },
  { id: 'n4', label: '2025 年人均水平', said: 13800, official: 13953, unit: '美元', saidSrc: '2026-04-25 合肥讲话：距 13935 美元门槛"差距只有 135"（隐含值，GNI 口径）', offSrc: '国家统计局：2025 年人均 GDP 13953 美元（GDP 口径）', comparable: false },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '新结构经济学', '增长与追赶', '改革与转型', '投资与财政', '国际与南方'],
  nodes: [
    { id: 'core', name: '要素禀赋结构\n→ 比较优势', cat: 0, size: 58 },
    { id: 'market', name: '有效市场', cat: 1, size: 34 },
    { id: 'gov', name: '有为政府', cat: 1, size: 34 },
    { id: 'gifi', name: '因势利导 / 增长甄别', cat: 1, size: 30 },
    { id: 'ptype', name: '五类产业', cat: 1, size: 26 },
    { id: 'jushu', name: '新型举国体制', cat: 1, size: 24 },
    { id: 'late', name: '后来者优势', cat: 2, size: 38 },
    { id: 'pot8', name: '8% 增长潜力', cat: 2, size: 36 },
    { id: 'highinc', name: '高收入门槛', cat: 2, size: 28 },
    { id: 'us2030', name: '2030 规模超美', cat: 2, size: 28 },
    { id: 'efflabor', name: '有效劳动', cat: 2, size: 26 },
    { id: 'dual', name: '双轨渐进改革', cat: 3, size: 34 },
    { id: 'viab', name: '自生能力', cat: 3, size: 28 },
    { id: 'wash', name: '华盛顿共识批判', cat: 3, size: 26 },
    { id: 'hrs', name: '家庭联产承包', cat: 3, size: 24 },
    { id: 'invest', name: '投资是手段', cat: 4, size: 32 },
    { id: 'infra', name: '超越凯恩斯主义\n基础设施', cat: 4, size: 28 },
    { id: 'deficit', name: '赤字突破 3%', cat: 4, size: 24 },
    { id: 'south', name: '南南合作', cat: 5, size: 30 },
    { id: 'decouple', name: '脱钩判断', cat: 5, size: 26 },
    { id: 'aibubble', name: '迷失 20 年 / AI 泡沫', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'market'], ['core', 'gov'], ['core', 'late'], ['core', 'dual'], ['core', 'invest'], ['core', 'south'],
    ['gov', 'gifi'], ['gifi', 'ptype'], ['ptype', 'jushu'], ['market', 'gifi'],
    ['late', 'pot8'], ['pot8', 'highinc'], ['pot8', 'us2030'], ['efflabor', 'pot8'],
    ['dual', 'viab'], ['viab', 'wash'], ['dual', 'hrs'],
    ['invest', 'infra'], ['infra', 'deficit'], ['gov', 'infra'],
    ['south', 'gifi'], ['decouple', 'us2030'], ['aibubble', 'decouple'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '2016 年产业政策之争（林毅夫—张维迎）',
    sides: [
      { who: '林毅夫（北大国发院 2016-11-09 朗润·格政）', view: '二战后持续高增长的 13 个经济体均有产业政策支持；不能因多数产业政策失败而弃之不用，应研究成败机理、按潜在比较优势因势利导，前提是"有效的市场"与"有为的政府"。' },
      { who: '张维迎（同场；央广网 2016-11-10 报道）', view: '产业政策是"政府出于经济发展或其他目的，对私人产品生产领域进行的选择性干预和歧视性对待"；失败源于人类认知局限与激励扭曲，集中决策成功概率远低于分散的企业家决策；持"米塞斯—哈耶克范式"，主张废除产业政策。' },
    ],
    note: '双方对"产业政策"定义宽窄不同（林含基础设施、基础科研等政府投入；张限定为对私人产品的选择性干预），部分分歧源于口径。出处：北京大学新闻网《北大国发院举办产业政策研讨会》；澎湃新闻校对实录；央广网 2016-11-10。本站并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '"8% 增长潜力"与人口红利解释（林毅夫—蔡昉，2019）',
    sides: [
      { who: '林毅夫', view: '人口是慢变量，不能解释 2010 年后的快速减速；减速主要源于 2008 年后全球需求疲软等周期与外部因素，中国仍有约 8% 的增长潜力，应从需求侧扩大投资、实施产业政策（新浪财经 2019-05-14 综述）。' },
      { who: '蔡昉（时任中国社科院副院长）', view: '劳动年龄人口 2010 年前后见顶、抚养比转升，人口红利消失从供给侧削弱增长源泉，潜在增长率由约 10% 降至"十二五"7.6%、"十三五"6.2%，难以回到 8%；改革可延缓下降（财新 2019-04《比较》、2019-05-15 回应文）。' },
    ],
    note: '"潜力"定义不同：林指以后来者优势衡量的技术面上限，蔡指生产函数法估算的潜在增长率，二者不可直接比较。2013—2025 年实际增速算术平均约 6.0%。本站人口模块与蔡昉看板另有相关数据。',
  },
  {
    id: 'x3',
    title: '投资拉动还是消费拉动',
    sides: [
      { who: '林毅夫', view: '消费是目的、投资是手段；放弃投资改为消费拉动是"头痛医脚、因噎废食"（第一财经日报 2013-07-11 署名文章）；2026-09 称外需疲软下再平衡"主要的大概还是在投资方面"，表示比较支持余永定。' },
      { who: '滕泰（2023 年初撰文）', view: '在供给过剩阶段应扩大居民收入与消费；"呼吁扩大消费，就是呼吁扩大居民收入"，批评"扩大消费会家庭破产"之说危言耸听（东方财经周刊等转载，转载级）。' },
    ],
    note: '双方均承认消费是发展目的，分歧集中于短期需求管理与财政投向（生产性投资 vs 居民转移支付）。2023 年流传的林毅夫视频为 2017 年凤凰卫视旧访谈（见存疑清单）。支出法口径下 2025 年消费拉动 2.6 个百分点、资本形成 0.8 个百分点，但这与"长期增长驱动"的理论口径不同。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传"林毅夫最新演讲""未来十年最赚钱行业"类稿件', status: '不收录', reason: '检索未见主办方、日期或主流媒体原文，多为标题加工或拼接托名；以北大国发院、新结构经济学研究院官网发布为准。' },
  { id: 'q2', item: '"我从来没有见过任何一个国家陷入危机是因为过度投资"', status: '不收录', reason: '本人 2013-07-11 第一财经日报署名文章明确声明"是我不曾说过，也不能同意的，是撰稿者妄自添加的观点"。' },
  { id: 'q3', item: '"林毅夫说消费拉动经济增长是骗局"', status: '不收录', reason: '"骗局"为评论文章标题用语，未见本人原话；其原话为"不是不懂经济，就是故意误导中国"（2017 年访谈）。' },
  { id: 'q4', item: '2023 年春节流传的"消费拉动是误导中国"视频', status: '更正', reason: '实为 2017 年 7 月凤凰卫视《领航者》访谈旧片段（新经济学家智库 2023-02-01 说明；新结构经济学研究院 2017-07-20 已发精简文字版），非 2023 年新表态。' },
  { id: 'q5', item: '"光刻机三年之约"', status: '并陈', reason: '2021-05-29 中国企业未来发展论坛，媒体报道其转述 ASML 首席执行官"大概 3 年以后中国就会自己掌握这个技术"的担忧；网传将其当作本人预言。未找到主办方逐字实录，不列入台账。' },
  { id: 'q6', item: '南南合作与发展学院院长任期', status: '〔存疑〕', reason: '本人简历记 2015 年起任院长，《瞭望》称学院 2016 年成立；2025 年后报道称"名誉院长"，交接时间未核。' },
  { id: 'q7', item: '国务院参事任期', status: '〔存疑〕', reason: '简历记 2013 年起任国务院参事，研究院师资页称"曾任"，卸任时间未核，故未列入履历甘特。' },
  { id: 'q8', item: '财新网 2026-09-01"特别呈现"稿', status: '不收录', reason: '属推广页（promote.caixin.com）二次概括博鳌讲话，已以北京商报等原始报道替代。' },
  { id: 'q9', item: '2025 年 GDP 增速', status: '以官方为准', reason: '本站经济大盘三次产业表 2025 年为估算值 4.8%；国家统计局 2026-02-28 统计公报为 5.0%，台账采用官方值。' },
  { id: 'q10', item: '"2030 年中国经济规模为美国 1.5—2 倍"（2014）与"2030 年前后超过美国"（2024—2026）', status: '并陈', reason: '同一时点的预测幅度前后下修，台账按最新表述检验，早期表述在 L8 中注明。' },
  { id: 'q11', item: '2013 年全国两会期间"20 年 8%"表述（人民网 2013-03-08）', status: '未检验', reason: '与 2012-06-18 表述同义，已合并入台账 L2，未单列文库。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
