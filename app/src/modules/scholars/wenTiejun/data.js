// ============================================================================
// 学者专栏 · 温铁军 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 网传托名"温铁军最新演讲"拼接稿、AI 伪造视频、短视频课程文字稿未见可靠出处者一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  sannong: { label: '三农与乡村振兴', color: '#10b981' },
  land: { label: '土地制度', color: '#c41e3a' },
  crisis: { label: '危机与成本转嫁', color: '#8b5cf6' },
  eco: { label: '生态文明与县域经济', color: '#22d3ee' },
  global: { label: '全球化与国际格局', color: '#e8a317' },
  food: { label: '粮食安全', color: '#fb923c' },
  urban: { label: '城镇化与城乡劳动力', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '温铁军',
  born: '1951 年 5 月 · 北京（祖籍河北昌黎）',
  summary:
    '1968 年起在山西汾阳插队及基层工作十余年，1979—1983 年就读中国人民大学新闻系。1985 年起先后在中央农村政策研究室/国务院农村发展研究中心、全国农村改革试验区办公室、农业部农村经济研究中心从事政策研究，1999 年获中国农业大学管理学博士。2004—2013 年任中国人民大学农业与农村发展学院院长，2012 年起任西南大学中国乡村建设学院执行院长，并在福建农林大学等校主持乡村建设与乡村振兴机构。研究以“三农问题”、城乡二元结构下的“成本转嫁”与周期性经济危机、农地集体所有制的社会保障功能、生态化县域经济为主线。',
  current: [
    '西南大学中国乡村建设学院执行院长；西南大学乡村振兴战略研究院首席专家',
    '福建农林大学乡村振兴学院院长（2025-09 辽宁大学报道口径，任职起点未核）',
    '国家粮食安全专家委员会委员（据邮储银行 2024 年度独立董事述职报告）',
    '暨南大学乡村振兴研究院首席研究员',
  ],
  sources: '中国人民大学农业与农村发展学院官网（历任院长）；西南大学乡村振兴战略研究院官网；暨南大学乡村振兴研究院官网；邮储银行独立董事述职报告（2025-03）及董事离任公告（2026-06-26）；光明网理论频道 2016-10-18 人物介绍；辽宁大学新闻网 2025-09。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 4,
  subtitle: '人物履历 · 三农与土地 · 危机与成本转嫁 · 县域生态化 · 预判检验',
  span: '1996—2026',
  careerTitle: '履历时间线 · 基层 → 中央政策研究 → 人大 → 乡建与乡村振兴机构',
  defaultTheme: 'sannong',
  moduleId: 'scholarWenTiejun',
  sourceNote: '著作原书 / 高校与研究院官网 / 署名文章 / 主流媒体专访 · 对照数据：国家统计局、海关总署、中办国办文件、人社部',
};

export const CAREER_GROUPS = {
  base: { label: '基层与求学', color: '#94a3b8' },
  policy: { label: '中央政策研究', color: '#e8a317' },
  ruc: { label: '中国人民大学', color: '#c41e3a' },
  xj: { label: '乡建/乡村振兴机构', color: '#10b981' },
  board: { label: '董事与咨询', color: '#22d3ee' },
};

export const CAREER = [
  { id: 'c1', role: '山西汾阳插队及基层工作（公开履历称“11 年工农兵”）', org: '山西 / 北京', start: 1968.0, end: 1979.0, group: 'base' },
  { id: 'c2', role: '中国人民大学新闻系本科（法学学士）', org: '北京', start: 1979.7, end: 1983.6, group: 'base' },
  { id: 'c3', role: '中央农村政策研究室 / 国务院农村发展研究中心联络室', org: '北京', start: 1985.0, end: 1987.0, group: 'policy' },
  { id: 'c4', role: '全国农村改革试验区办公室（1988 监测处副处长 → 1993 调研处长 → 1995 主持工作副主任）', org: '北京', start: 1987.0, end: 1998.0, group: 'policy' },
  { id: 'c5', role: '中国农业大学在职管理学博士（1999 年获学位）', org: '北京', start: 1995.0, end: 1999.5, group: 'base' },
  { id: 'c6', role: '农业部农村经济研究中心研究员、科研处长', org: '北京', start: 1998.0, end: 2000.0, group: 'policy' },
  { id: 'c7', role: '中国经济体制改革研究会副秘书长、《中国改革》杂志社社长兼总编', org: '北京', start: 2000.0, end: 2004.0, group: 'policy', note: '起止时间未核实〔存疑〕' },
  { id: 'c8', role: '中国人民大学农业与农村发展学院院长', org: '北京', start: 2004.0, end: 2013.0, group: 'ruc', note: '人大农发院官网“历任院长”载 2004—2013 年' },
  { id: 'c9', role: '西南大学中国乡村建设学院执行院长', org: '重庆', start: 2012.9, end: 2026.75, group: 'xj', note: '学院 2012-12-08 揭牌' },
  { id: 'c10', role: '福建农林大学海峡乡村建设学院执行院长 → 新农村发展研究院执行院长 → 乡村振兴学院院长', org: '福州', start: 2013.0, end: 2026.75, group: 'xj', note: '各职起止未核实〔存疑〕' },
  { id: 'c11', role: '北京大学习近平新时代中国特色社会主义思想研究院乡村振兴中心主任', org: '北京', start: 2018.0, end: 2026.75, group: 'xj', note: '起始年份据公开介绍推算、现任状态未核实〔存疑〕' },
  { id: 'c12', role: '中国邮政储蓄银行独立非执行董事', org: '北京', start: 2019.8, end: 2026.5, group: 'board', note: '2019-10 起任；2026-06-30 任期届满离任（邮储银行公告临 2026-030）' },
];

export const BOOKS = [
  { id: 'b1', year: 2000, title: '中国农村基本经济制度研究——“三农”问题的世纪反思', publisher: '中国经济出版社', isbn: '9787501746347', themes: ['sannong', 'land'], verified: 'primary' },
  { id: 'b2', year: 2004, title: '解构现代化：温铁军演讲录', publisher: '广东人民出版社', date: '2004-05', isbn: '9787218045573', themes: ['sannong', 'crisis'], verified: 'primary' },
  { id: 'b3', year: 2009, title: '“三农”问题与制度变迁（第 2 版）', publisher: '中国经济出版社', date: '2009-01', isbn: '9787501786732', themes: ['sannong', 'land'], verified: 'primary', note: '中国经济 50 人论坛丛书' },
  { id: 'b4', year: 2011, title: '解读苏南', publisher: '苏州大学出版社', themes: ['eco', 'crisis'], verified: 'reprint', note: '仅见百科书目记录' },
  { id: 'b5', year: 2013, title: '八次危机：中国的真实经验 1949—2009', publisher: '东方出版社', date: '2013-01', isbn: '9787506055574', coauthors: '温铁军等（国仁文丛）', themes: ['crisis', 'land'], verified: 'primary', note: '版权页 2013-01；人大官网称 2012-12 出版，并陈' },
  { id: 'b6', year: 2016, title: '告别百年激进：温铁军演讲录 2004—2014（上）', publisher: '东方出版社', date: '2016-04', isbn: '9787506088527', themes: ['crisis', 'global'], verified: 'primary' },
  { id: 'b7', year: 2019, title: '去依附：中国化解第一次经济危机的真实经验', publisher: '东方出版社', date: '2019-09', isbn: '9787520710732', coauthors: '董筱丹、温铁军', themes: ['crisis', 'global'], verified: 'primary' },
  { id: 'b8', year: 2021, title: '全球化与国家竞争：新兴七国比较研究', publisher: '东方出版社', date: '2021-02', isbn: '9787520717496', coauthors: '温铁军、刘健芝、黄钰书、薛翠', themes: ['global'], verified: 'primary', note: '版权页 2021-02；豆瓣书目记 2020-12，并陈' },
  { id: 'b9', year: 2021, title: 'Ten Crises: The Political Economy of China’s Development (1949–2020)', publisher: 'Palgrave Macmillan（开放获取）', date: '2021-06-23', isbn: '9789811604546', themes: ['crisis'], verified: 'primary', note: 'DOI 10.1007/978-981-16-0455-3；未见中文版《十次危机》' },
  { id: 'b10', year: 2023, title: '长读苏南', publisher: '东方出版社', date: '2023-03', coauthors: '董筱丹、温铁军', themes: ['eco', 'crisis'], verified: 'reprint', note: '仅见百科书目记录' },
  { id: 'b11', year: 2023, title: '破局乡村振兴——中国式农业农村现代化的 11 个思考', publisher: '重庆出版社', date: '2023-06', isbn: '9787229177072', coauthors: '陈高威、温铁军', themes: ['sannong', 'eco'], verified: 'primary' },
  { id: 'b12', year: null, title: '十次危机（中文版）', publisher: '未见', themes: ['crisis'], verified: 'doubt', note: '检索未见中文出版物，“十次危机”见于 2017 年香港系列讲座与 2021 年英文版〔存疑〕' },
];

// ============================================================================
// 语料库：讲话 / 采访 / 署名文章 / 论文 / 著作
// ============================================================================
export const CORPUS = [
  { id: 'k1996', date: '1996', form: '论文', venue: '《制约三农问题的两个基本矛盾》·《战略与管理》1996 年第 3 期', source: '中国人民大学农业与农村发展学院官网介绍', url: 'https://sard.ruc.edu.cn/xysy/xydt/429d2f8cbe5f48579564e26ca3127872.htm', verified: 'media', themes: ['sannong'] },
  { id: 'k1999', date: '1999-12', form: '署名文章', venue: '《三农问题：世纪末的反思》·《读书》1999 年第 12 期', source: '中国人民大学农业与农村发展学院官网介绍', url: 'https://sard.ruc.edu.cn/xysy/xydt/429d2f8cbe5f48579564e26ca3127872.htm', verified: 'media', themes: ['sannong'] },
  { id: 'k2004', date: '2004-05', form: '著作', venue: '《解构现代化：温铁军演讲录》自序摘录', source: '广东人民出版社（网络摘录）', verified: 'reprint', themes: ['sannong'] },
  { id: 'k2008', date: '2008', form: '署名文章', venue: '《对改革开放 30 年来农村改革的三个思考》', source: '中国农民合作社研究网（浙江大学 CARD 网站转载）', url: 'http://ccfc.zju.edu.cn/2012/0815/c57522a2371834/page.htm', verified: 'reprint', themes: ['land', 'urban'] },
  { id: 'k2009', date: '2009-01-16', form: '署名文章', venue: '《我国为什么不能实行农村土地私有化》·《红旗文稿》2009 年第 2 期', source: '红旗文稿（凤凰网财经转载）', url: 'https://finance.ifeng.com/news/special/xintugai/20100928/2663908.shtml', verified: 'primary', themes: ['land'] },
  { id: 'k2013a', date: '2013-01', form: '著作', venue: '《八次危机：中国的真实经验 1949—2009》', source: '东方出版社', verified: 'primary', themes: ['crisis'] },
  { id: 'k2013b', date: '2013-10-24', form: '采访', venue: '《上海证券报》专访 · 城镇化与土地制度', source: '上海证券报（新浪财经转载）', url: 'https://finance.sina.com.cn/review/hgds/20131024/044017093135.shtml', verified: 'media', themes: ['urban', 'land', 'crisis'] },
  { id: 'k2013c', date: '2013-11-08', form: '采访', venue: '《中国投资》对话（对话日 2013-10-23）', source: '中国投资（新浪财经转载）', url: 'https://finance.sina.com.cn/leadership/mroll/20131108/150217266968.shtml', verified: 'media', themes: ['crisis', 'sannong'] },
  { id: 'k2014', date: '2014-10-10', form: '采访', venue: '《21世纪经济报道》专访 · 新型城镇化', source: '21世纪经济报道（中国城市规划网转载）', url: 'http://www.planning.org.cn/law/view_news?id=1228', verified: 'media', themes: ['urban'] },
  { id: 'k2015a', date: '2015-06-01', form: '讲座', venue: '北京大学演讲 · 周期性危机与成本转嫁（战略与管理杂志社等主办）', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_1337066', verified: 'media', themes: ['crisis'] },
  { id: 'k2015b', date: '2015-08', form: '论文', venue: '《粮食金融化与粮食安全》（计晗、张兰英、温铁军）', source: '网络转载（乌有之乡、国仁乡建相关站点）', verified: 'reprint', themes: ['food'] },
  { id: 'k2017', date: '2017-04', form: '讲座', venue: '香港系列讲座 · 新中国的十次周期性经济危机', source: '观察者网风闻社区转录', verified: 'reprint', themes: ['crisis'] },
  { id: 'k2018', date: '2018-03-01', form: '讲座', venue: '湖北省住建系统讲座 · 乡村振兴战略（经本人审阅）', source: '中国城市规划网', url: 'http://www.planning.org.cn/report/view?id=262', verified: 'media', themes: ['sannong'] },
  { id: 'k2019', date: '2019-09', form: '著作', venue: '《去依附：中国化解第一次经济危机的真实经验》', source: '东方出版社（中国网书讯）', url: 'http://finance.china.com.cn/consume/20190909/5075492.shtml', verified: 'primary', themes: ['global', 'crisis'] },
  { id: 'k2020a', date: '2020-05-13', form: '讲话', venue: '2020 凤凰网财经云峰会', source: '凤凰网财经', url: 'https://finance.ifeng.com/c/7wQxTJsHXLk', verified: 'media', themes: ['food', 'global'] },
  { id: 'k2021', date: '2021-06-23', form: '著作', venue: 'Ten Crises: The Political Economy of China’s Development (1949–2020)', source: 'Palgrave Macmillan', url: 'https://link.springer.com/book/10.1007/978-981-16-0455-3', verified: 'primary', themes: ['crisis'] },
  { id: 'k2022a', date: '2022-05-09', form: '对话', venue: '中国乡村大讲堂 · 与李铁、魏后凯、刘守英对话', source: '中国农业大学新闻网（转中国乡村振兴公众号）', url: 'https://news.cau.edu.cn/mtndnew/858695.htm', verified: 'media', themes: ['eco', 'urban'] },
  { id: 'k2022b', date: '2022-06-05', form: '讲座', venue: '长安街读书会 · 粮食安全', source: '澎湃新闻·政务号转载', url: 'https://www.thepaper.cn/newsDetail_forward_18435836', verified: 'reprint', themes: ['food'] },
  { id: 'k2024a', date: '2024-01-26', form: '讲座', venue: '道中华大讲堂第六讲（中交集团）', source: '中国日报网', url: 'https://cn.chinadaily.com.cn/a/202402/19/WS65d4178aa3109f7860dd2500.html', verified: 'media', themes: ['eco'] },
  { id: 'k2024b', date: '2024-02-20', form: '署名文章', venue: '观察者网“经济学家建言 2024”', source: '观察者网', url: 'https://www.guancha.cn/WenTieJun/2024_02_20_725719.shtml', verified: 'media', themes: ['urban', 'sannong'] },
  { id: 'k2024c', date: '2024-06-22', form: '讲话', venue: '中国政治经济学 40 人论坛发言（2024-07-24 刊发，经作者审核）', source: '观察者网', url: 'https://www.guancha.cn/WenTieJun/2024_07_24_742482.shtml', verified: 'primary', themes: ['eco', 'global', 'food'] },
  { id: 'k2025a', date: '2025-02-19', form: '采访', venue: '观察者网“经济学家建言 2025”', source: '观察者网（新浪财经转载）', url: 'https://finance.sina.com.cn/roll/2025-02-19/doc-inekzcyh5666723.shtml', verified: 'media', themes: ['sannong', 'global', 'crisis', 'urban'] },
  { id: 'k2025b', date: '2025-04-08', form: '讲座', venue: '重庆酉阳讲座 · 全域生态化与县域发展', source: '西南大学乡村振兴战略研究院官网', url: 'https://irrs.swu.edu.cn/info/1065/2581.htm', verified: 'primary', themes: ['eco'] },
  { id: 'k2025c', date: '2025-09-20', form: '讲话', venue: '第六届中国数字经济高质量发展主题论坛主旨报告 · 新质生产力与耐心资本', source: '西南大学新闻网', url: 'https://www.swu.edu.cn/info/1197/25890.htm', verified: 'primary', themes: ['eco'] },
  { id: 'k2025d', date: '2025-09-29', form: '讲座', venue: '辽宁大学“陕公大学堂” · 全球过剩与中国应对危机的战略调整', source: '辽宁大学新闻网', url: 'https://www.lnu.edu.cn/info/15008/83806.htm', verified: 'primary', themes: ['crisis', 'global'] },
  { id: 'k2026a', date: '2026-02-04', form: '对话', venue: '观察者网《思路打开》对话', source: '观察者网', url: 'https://www.guancha.cn/politics/2026_02_04_806081_4.shtml', verified: 'media', themes: ['sannong', 'global', 'urban', 'land', 'crisis'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

// 原话按出处页面逐字；网络转载稿中的错字保留原貌或降为转述
const RAW_CLAIMS = [
  // —— 三农与乡村振兴 ——
  { id: 's1', k: 'k1996', theme: 'sannong', type: '转述', text: '在《制约三农问题的两个基本矛盾》中较早系统使用“三农问题”概念，此前曾建议以“三农问题”取代“农业问题”的提法（人大农发院官网介绍）。' },
  { id: 's2', k: 'k2004', theme: 'sannong', type: '转述', text: '自称政策领域的“试验员”，不以从事规范性学术研究的学者自居。' },
  { id: 's3', k: 'k2018', theme: 'sannong', type: '原话', text: '乡村振兴战略要求的不再是过去产业化时代的资本下乡，而是要求社会下乡。' },
  { id: 's4', k: 'k2025a', theme: 'sannong', type: '原话', text: '中央把乡村振兴视作应对全球化挑战的压舱石，客观上是要应对全球化解体的大危机。' },
  { id: 's5', k: 'k2025a', theme: 'sannong', type: '原话', text: '我从来不主张青年人回乡就是种地。' },
  { id: 's6', k: 'k2025a', theme: 'sannong', type: '原话', text: '从目前的情况看，我对2035年达到农业现代化层次的前景是看好的。' },
  { id: 's7', k: 'k2026a', theme: 'sannong', type: '原话', text: '乡村振兴之所以具有重大的战略意义，在于它能承载危机。' },
  { id: 's8', k: 'k2026a', theme: 'sannong', type: '原话', text: '上世纪80年代，中国出现过内需拉动的黄金增长，这是农民造成的。' },
  { id: 's9', k: 'k2026a', theme: 'sannong', type: '转述', text: '称 2 亿多农户户均约 7 亩地，经营收入不足以支付社保；对新型职业农民职称评定的做法表示疑虑。' },
  { id: 's10', k: 'k2025a', theme: 'sannong', type: '转述', text: '对“农村消费潜力巨大”的说法称“似是而非”，并回顾家电下乡曾以约 13% 的出口退税水平给予补贴。' },

  // —— 土地制度 ——
  { id: 'l1', k: 'k2008', theme: 'land', type: '原话', text: '中国最大的一个稳定器就是农民平均占有的土地制度。' },
  { id: 'l2', k: 'k2008', theme: 'land', type: '原话', text: '中国农村政策的底线就是不搞土地私有化' },
  { id: 'l3', k: 'k2009', theme: 'land', type: '原话', text: '当年提出的这种从私有化必达自由化的逻辑看上去完整，实则似是而非。' },
  { id: 'l4', k: 'k2009', theme: 'land', type: '原话', text: '世界上仅有不超过10个大农场国家，能够有条件实现土地规模经济、产生农业规模收益，它们几乎全部是在殖民化进程之中大规模杀戮当地土著、开疆拓土的产物。' },
  { id: 'l5', k: 'k2009', theme: 'land', type: '原话', text: '几乎所有人口过亿的大型发展中国家，在继承或采行西方制度之后，普遍受制于耕者无其田和城市贫民窟化，并由此造成社会动乱。' },
  { id: 'l6', k: 'k2013b', theme: 'land', type: '原话', text: '中国目前这种按人口平均分配、按户占有产权的农村土地制度，因向农民提供了维持生存的基本保障，而客观上成为中国历次经济危机软着陆的基础。' },
  { id: 'l7', k: 'k2026a', theme: 'land', type: '原话', text: '因为农民拥有小额财产，才使中国成为世界上最大的“小资国”。' },

  // —— 危机与成本转嫁 ——
  { id: 'c1', k: 'k2013a', theme: 'crisis', type: '转述', text: '以 1949—2009 年八次经济危机为线索，提出城市产业资本危机的代价向“三农”转嫁、乡村成为危机软着陆载体的解释框架。' },
  { id: 'c2', k: 'k2013c', theme: 'crisis', type: '原话', text: '现在正在大规模破坏中国人的生存基础，待到把农村破坏完了，危机软着陆的载体就不存在了。' },
  { id: 'c3', k: 'k2013c', theme: 'crisis', type: '原话', text: '我们搞了“百年激进”，现在已经接近于完成西方化了。' },
  { id: 'c4', k: 'k2015a', theme: 'crisis', type: '原话', text: '中国之所以能够渡过危机的原因何在？在于中国有“成本对内转嫁的条件”。' },
  { id: 'c5', k: 'k2015a', theme: 'crisis', type: '转述', text: '以 1949 年恶性通胀（其口径为按月约 38%）作为新中国第一次危机，说明早期危机化解依赖内部动员。' },
  { id: 'c6', k: 'k2017', theme: 'crisis', type: '转述', text: '将“八次危机”扩展为“十次危机”，补入 1949—1951 年与 2013 年之后的两次（整理稿）。' },
  { id: 'c8', k: 'k2025a', theme: 'crisis', type: '原话', text: '因此只要是全球出问题，外需下降，我国国内必发生过剩问题，过剩问题就是生产过剩危机。' },
  { id: 'c9', k: 'k2025a', theme: 'crisis', type: '原话', text: '在替地方政府化解短债、让其变成长债的过程中，长债中应该有一部分是支付社保的，否则这个问题没法解决。' },
  { id: 'c10', k: 'k2026a', theme: 'crisis', type: '原话', text: '城乡二元结构既是矛盾，又是我们应对危机的重要载体。' },

  // —— 生态文明与县域经济 ——
  { id: 'e1', k: 'k2022a', theme: 'eco', type: '转述', text: '主张把产业留在县域，以县域城镇化作为乡村振兴与吸纳劳动力的载体。' },
  { id: 'e2', k: 'k2024a', theme: 'eco', type: '转述', text: '把海拔 800 米以上山区与高原视为优质康养带，主张以“三变”改革盘活乡村生态资源。' },
  { id: 'e3', k: 'k2024c', theme: 'eco', type: '转述', text: '提出通过“三变”改革把村域生态资源开发为城市、金融之外的“第三资产池”，发展新型县域经济与“两山银行”。' },
  { id: 'e4', k: 'k2025b', theme: 'eco', type: '转述', text: '在酉阳讲座中提出全域生态化发展，以流量经济带动山区县域的生态资源价值化。' },
  { id: 'e6', k: 'k2026a', theme: 'eco', type: '转述', text: '建议资本进入乡村开发时，应向村集体交纳不少于三分之一的“两山”收益。' },

  // —— 全球化与国际格局 ——
  { id: 'g1', k: 'k2019', theme: 'global', type: '转述', text: '以新中国初期为案例，论证依靠内部动员、摆脱对外依附化解第一次经济危机的经验（与董筱丹合著）。' },
  { id: 'g2', k: 'k2024c', theme: 'global', type: '转述', text: '称大豆进口依存度“高达 90% 以上”、约 70% 石油天然气与 90% 以上铁矿石依赖进口，以此论证外部依赖风险。' },
  { id: 'g3', k: 'k2025a', theme: 'global', type: '原话', text: '这意味着不会再有这么大的需求了' },
  { id: 'g4', k: 'k2026a', theme: 'global', type: '原话', text: '从2017年特朗普第一次当政开始，我就提出中美关系构成了主要矛盾，美国是矛盾的主要方面，中国是非主要方面。' },

  // —— 粮食安全 ——
  { id: 'f1', k: 'k2015b', theme: 'food', type: '原话', text: '诺大一个13.6亿人口的中国，实际上只有中央政府这一个主体承担着对保障粮食安全的无限责任' },
  { id: 'f2', k: 'k2020a', theme: 'food', type: '原话', text: '石油农业对我们来说已经是一个既成事实了' },
  { id: 'f3', k: 'k2020a', theme: 'food', type: '转述', text: '以 2008 年粮食危机中 38 个国家出现饥饿问题为例，提示疫情冲击下全球供应链断裂对粮食安全的风险。' },
  { id: 'f4', k: 'k2022b', theme: 'food', type: '原话', text: '在金融资本时代，粮食金融化是影响粮食安全的第一个重要因素。' },

  // —— 城镇化与城乡劳动力 ——
  { id: 'u1', k: 'k2013b', theme: 'urban', type: '原话', text: '只要是人口超过一亿，就没有哪一个国家的城市化是成功的。' },
  { id: 'u2', k: 'k2013b', theme: 'urban', type: '转述', text: '把城市比作“资本池”、农村比作“劳动力池”，认为后者在危机中吸纳回流劳动力。' },
  { id: 'u3', k: 'k2014', theme: 'urban', type: '原话', text: '所以城镇化一定是一个去城市化的过程。' },
  { id: 'u4', k: 'k2024b', theme: 'urban', type: '原话', text: '世界上没有哪个国家能承受得起连续发生的、数以千万计的所谓不叫失业的失业。' },
  { id: 'u5', k: 'k2024b', theme: 'urban', type: '原话', text: '这些人返乡要有事做、有饭吃、有地方住，国家才稳得住。' },
  { id: 'u6', k: 'k2026a', theme: 'urban', type: '转述', text: '称上千万打工者出现“二次返乡”，并提示城中村可能成为危机的爆发点。' },
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

export const FEATURED = ['l3', 'l6', 'c4', 'c9', 's7', 'u3', 'g4', 'f4'];

export const THEME_LINKS = {
  sannong: [{ to: '/rural', label: '乡村振兴' }, { to: '/socialgov', label: '社会治理' }],
  land: [{ to: '/rural', label: '乡村振兴' }, { to: '/reform', label: '改革' }],
  crisis: [{ to: '/econ-dashboard', label: '经济大盘' }, { to: '/debt', label: '地方债务' }],
  eco: [{ to: '/regional', label: '区域经济' }, { to: '/urban', label: '城镇化' }],
  global: [{ to: '/foreign-trade', label: '外贸' }, { to: '/thucydides', label: '中美关系' }],
  food: [{ to: '/food-security', label: '粮食安全' }],
  urban: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }],
};

export const THEME_INTRO = {
  sannong: '以“三农问题”概念为起点，把农民、农村、农业并置为结构性问题；近年将乡村振兴定位为承载外部冲击与就业回流的“压舱石”，并强调“社会下乡”而非单纯资本下乡。',
  land: '坚持农地集体所有、按人口平均占有的制度安排，认为其承担社会保障与危机缓冲功能，反对农地私有化；与产权派在确权流转、农地入市等问题上长期存在分歧。',
  crisis: '以“八次危机”（后扩展为“十次危机”）梳理 1949 年以来的周期性经济危机，核心命题是危机代价可向乡村“对内转嫁”，城乡二元结构因此成为软着陆载体。',
  eco: '主张以“三变”改革把村域生态资源开发为“第三资产池”，发展新型县域经济、康养与流量经济，把产业与就业留在县域。',
  global: '以“去依附”视角讨论发展中国家的外部依赖，认为全球化正走向解体、外需收缩将引发国内过剩；2017 年后把中美关系视为主要矛盾。',
  food: '关注粮食金融化与对外依存（尤其大豆），认为粮食安全责任高度集中于中央政府，现代农业对石油投入的依赖构成隐性风险。',
  urban: '对超大人口国家的城市化路径持审慎立场，主张以县域城镇化“去城市化”，并关注农民工“二次返乡”的承接问题。',
};

// ============================================================================
// 预判检验台账：只收可被数据或政策事实检验的前瞻性表述；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '1996', venue: '《战略与管理》1996 年第 3 期',
    url: 'https://sard.ruc.edu.cn/xysy/xydt/429d2f8cbe5f48579564e26ca3127872.htm',
    claim: '以“三农问题”取代“农业问题”作为政策议题框架',
    check: '2003 年中央农村工作会议提出把解决“三农”问题作为全党工作重中之重；2004 年起中央一号文件连续聚焦“三农”。提法已进入中央文件体系（非单一作者之功，属议题被采纳）。',
    dataSrc: '中共中央、国务院历年中央一号文件',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '2008', venue: '《对改革开放 30 年来农村改革的三个思考》（转载稿）',
    url: 'http://ccfc.zju.edu.cn/2012/0815/c57522a2371834/page.htm',
    claim: '中国农村政策的底线就是不搞土地私有化',
    check: '2016 年中办国办“三权分置”意见坚持集体所有权；2017 年明确第二轮土地承包到期后再延长 30 年；2026-03-18 中办国办延包意见印发，2026 年除贵州、西藏外 29 省全面开展整省试点。至核验日农地集体所有未改变。',
    dataSrc: '中国政府网 2026-03 中办国办意见；2016 年三权分置意见',
  },
  {
    id: 'L3', status: 'open', type: '原话', date: '2014-10-10', venue: '《21世纪经济报道》专访',
    url: 'http://www.planning.org.cn/law/view_news?id=1228',
    claim: '所以城镇化一定是一个去城市化的过程。',
    check: '2022-05 中办国办印发《关于推进以县城为重要载体的城镇化建设的意见》，政策方向部分吻合；但常住人口城镇化率仍升至 2025 年末 67.89%，大城市集聚未逆转，暂不能判定。',
    dataSrc: '中国政府网 2022-05 意见；国家统计局 2025 年统计公报',
  },
  {
    id: 'L4', status: 'open', type: '转述', date: '2024-02-20', venue: '观察者网“经济学家建言 2024”',
    url: 'https://www.guancha.cn/WenTieJun/2024_02_20_725719.shtml',
    claim: '几千万农民工“二次返乡”，乡村须承接其就业与居住',
    check: '国家统计局：2025 年农民工总量 30115 万人（+0.5%），外出农民工 18006 万人（+0.8%），进城农民工 13092 万人、较上年减 115 万人。官方无“返乡”口径，几千万量级无法验证。',
    dataSrc: '国家统计局 2026-04-30《2025 年农民工监测调查报告》',
  },
  {
    id: 'L5', status: 'open', type: '原话', date: '2025-02-19', venue: '观察者网“经济学家建言 2025”',
    url: 'https://finance.sina.com.cn/roll/2025-02-19/doc-inekzcyh5666723.shtml',
    claim: '化解地方短债为长债时，长债中应有一部分用于支付社保',
    check: '2024-11 起的 12 万亿元化债安排（6 万亿置换 + 4 万亿专项债 + 2 万亿棚改）未列社保专项份额；城乡居民基础养老金最低标准 2024、2025、2026 年各提高 20 元至每月 163 元。建议未以其提出的形式落地。',
    dataSrc: '财政部 2024-11 发布会；中新网 2026-03-05、中青报 2026-03-09',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2025-02-19', venue: '观察者网“经济学家建言 2025”',
    url: 'https://finance.sina.com.cn/roll/2025-02-19/doc-inekzcyh5666723.shtml',
    claim: '对 2035 年达到农业现代化层次的前景看好',
    check: '检验窗口至 2035 年；“农业现代化层次”无单一量化标准，届时需对照官方农业现代化评价指标。',
    dataSrc: '《加快建设农业强国规划（2024—2035 年）》',
  },
  {
    id: 'L7', status: 'open', type: '原话', date: '2025-02-19', venue: '观察者网“经济学家建言 2025”',
    url: 'https://finance.sina.com.cn/roll/2025-02-19/doc-inekzcyh5666723.shtml',
    claim: '东部外需型县域“不会再有这么大的需求了”（全球化解体、外需收缩）',
    check: '2025 年出口 3.8 万亿美元、同比 +5.5%，顺差 11889 亿美元，但对美出口约 -20%；2026 年 1—8 月出口 20.17 万亿元。总量未收缩、市场结构重排，尚难定论。',
    dataSrc: '海关总署 2026-01-14 发布；本站经济大盘模块',
  },
  {
    id: 'L8', status: 'open', type: '转述', date: '2026-02-04', venue: '观察者网《思路打开》对话',
    url: 'https://www.guancha.cn/politics/2026_02_04_806081_4.shtml',
    claim: '城中村可能成为危机爆发点',
    check: '属风险提示型判断，无明确时间窗与量化阈值；至核验日未见可归因于城中村的系统性风险事件，持续观察。',
    dataSrc: '住建部城中村改造政策（检索截至 2026-09）',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2026-02-04', venue: '观察者网《思路打开》对话',
    url: 'https://www.guancha.cn/politics/2026_02_04_806081_4.shtml',
    claim: '资本进入乡村应向村集体交纳不少于三分之一的“两山”收益',
    check: '至核验日未检索到全国性收益分成比例规定；生态产品价值实现机制仍以地方试点为主。',
    dataSrc: '中办国办《关于建立健全生态产品价值实现机制的意见》（2021）及地方试点',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '大豆进口依存度', said: 90, official: 83.6, unit: '%', saidSrc: '2024-06-22 政治经济学 40 人论坛：“高达 90% 以上”（取下限）', offSrc: '本站估算：2024 年进口 10503.1 万吨 ÷（进口 + 产量 2065 万吨）；海关总署、国家统计局', comparable: true },
  { id: 'n2', label: '常住人口城镇化率', said: 66.7, official: 67.89, unit: '%', saidSrc: '2025-02-19 观察者网：“超过三分之二”（按 2/3 计）', offSrc: '国家统计局：2025 年末 67.89%（表述时点可比 2024 年末 67.0%）', comparable: false },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '三农与城乡', '土地制度', '危机与转嫁', '生态与县域', '全球化与粮食'],
  nodes: [
    { id: 'core', name: '三农问题\n成本转嫁', cat: 0, size: 58 },
    { id: 'sannong', name: '三农问题', cat: 1, size: 36 },
    { id: 'dual', name: '城乡二元结构', cat: 1, size: 32 },
    { id: 'laborpool', name: '劳动力池 / 二次返乡', cat: 1, size: 28 },
    { id: 'social', name: '社会下乡', cat: 1, size: 24 },
    { id: 'land', name: '农地集体所有', cat: 2, size: 36 },
    { id: 'avg', name: '按人口平均占有', cat: 2, size: 28 },
    { id: 'antipriv', name: '反对农地私有化', cat: 2, size: 30 },
    { id: 'sanquan', name: '三权分置 · 延包', cat: 2, size: 24 },
    { id: 'crisis', name: '八次 / 十次危机', cat: 3, size: 36 },
    { id: 'transfer', name: '成本对内转嫁', cat: 3, size: 34 },
    { id: 'softland', name: '危机软着陆', cat: 3, size: 30 },
    { id: 'radical', name: '百年激进', cat: 3, size: 24 },
    { id: 'eco', name: '生态文明', cat: 4, size: 30 },
    { id: 'county', name: '新型县域经济', cat: 4, size: 30 },
    { id: 'lsh', name: '两山 · 第三资产池', cat: 4, size: 28 },
    { id: 'sanbian', name: '三变改革', cat: 4, size: 24 },
    { id: 'qudy', name: '去依附', cat: 5, size: 32 },
    { id: 'global', name: '全球化解体 / 过剩', cat: 5, size: 30 },
    { id: 'food', name: '粮食金融化', cat: 5, size: 26 },
    { id: 'usc', name: '中美主要矛盾', cat: 5, size: 26 },
  ],
  links: [
    ['core', 'sannong'], ['core', 'transfer'], ['core', 'land'], ['core', 'eco'], ['core', 'qudy'],
    ['sannong', 'dual'], ['dual', 'laborpool'], ['laborpool', 'softland'], ['sannong', 'social'],
    ['land', 'avg'], ['avg', 'softland'], ['land', 'antipriv'], ['antipriv', 'sanquan'],
    ['crisis', 'transfer'], ['transfer', 'softland'], ['crisis', 'radical'], ['dual', 'transfer'],
    ['eco', 'county'], ['county', 'lsh'], ['lsh', 'sanbian'], ['county', 'laborpool'],
    ['qudy', 'global'], ['global', 'food'], ['global', 'usc'], ['global', 'crisis'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '农地私有化与确权流转',
    sides: [
      { who: '温铁军（《红旗文稿》2009 年第 2 期）', view: '反对农地私有化，认为按人口平均占有的集体土地制度承担社会保障与危机缓冲功能，私有化将导向“耕者无其田”与城市贫民窟化。' },
      { who: '周其仁（北京大学国家发展研究院）', view: '转述：主张“确权是基础，流转是核心，配套是关键”，推动农地、农房依法入市，以“房转地转，帮衬人转”促进要素流动（周其仁个人网站、北大汇丰商学院报道）。' },
    ],
    note: '2016 年“三权分置”与 2019 年《土地管理法》修正（允许集体经营性建设用地入市，2020-01-01 施行）在集体所有前提下推进确权流转，两派主张在政策中各有部分体现。本站不作裁决。',
  },
  {
    id: 'x2',
    title: '“土地保障论”与“无地则乱”判断',
    sides: [
      { who: '温铁军', view: '人口过亿的发展中国家采行土地私有制后普遍出现无地农民与贫民窟问题，农地是农民生存保障与社会稳定器。' },
      { who: '秦晖（《农民地权六论》，《社会科学论坛》2007 年第 9 期）', view: '转述：质疑以“土地保障”替代社会保障、以“无地则反”论证限制农民地权的逻辑，认为贫民窟与地权制度之间不存在该论所称的因果关系。' },
    ],
    note: '争点在于农地的“保障功能”应由产权安排还是公共社保承担；双方所引国别样本不同，结论不可直接比较。原文见爱思想网。',
  },
  {
    id: 'x3',
    title: '“成本转嫁论”与八次危机叙事的学术评价',
    sides: [
      { who: '温铁军等（《八次危机》2013；Ten Crises 2021）', view: '以经验归纳方式将 1949 年后的周期性危机串联为“城市危机—代价向乡村转嫁—软着陆”的解释框架。' },
      { who: '批评与商榷（董国强《解构温铁军的“三农”问题研究》等）', view: '转述：对其问题界定、史料运用与论证的学术规范提出系统商榷；另有书评肯定其跨学科经验归纳视角（潘启雯书评，《中国减灾》2013）。' },
    ],
    note: '“成本转嫁论”偏重宏观政治经济学叙事，其因果链条尚缺系统计量检验；本站按“命题—证据”分列，不作价值判断。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传“温铁军最新演讲”拼接稿', status: '不收录', reason: '大量自媒体稿件拼接不同年份讲话或托名创作，无主办方、日期或原始媒体可追溯。' },
  { id: 'q2', item: 'AI 伪造“温铁军”带货视频（2025 年推销压片糖果）', status: '不收录', reason: '南方+ 2025-03-16 报道本人确认系假冒；佛山南海区市场监管部门认定为虚假广告（光明网 2026-05-27 续报）。' },
  { id: 'q3', item: 'B 站 / 抖音课程与演讲视频文字稿', status: '不收录', reason: '多为剪辑后二次转录，场合与日期难以核实；本库仅收录机构页面或主流媒体可追溯者。' },
  { id: 'q4', item: '中文专著《十次危机》', status: '更正', reason: '未见中文出版物；“十次危机”见于 2017 年香港系列讲座（整理稿）与 2021 年英文版 Ten Crises（Palgrave，开放获取）。' },
  { id: 'q5', item: '《八次危机》出版时间', status: '并陈', reason: '版权页为 2013-01；人大农发院官网称 2012-12 出版。' },
  { id: 'q6', item: '《全球化与国家竞争》出版时间', status: '并陈', reason: '版权页 2021-02；豆瓣书目记 2020-12。' },
  { id: 'q7', item: '“几千万人二次返乡”', status: '未检验', reason: '国家统计局农民工监测无返乡口径，量级无法对照（见台账 L4）。' },
  { id: 'q8', item: '“2021 年中国农业 GDP 约为美国 5.8 倍”', status: '未检验', reason: '本人口径（2025-02 观察者网），汇率与统计口径未注明，暂不列入数字对照。' },
  { id: 'q9', item: '联合国粮农组织“粮食英雄”称号', status: '〔存疑〕', reason: '仅见百科词条，未找到粮农组织原始公告。' },
  { id: 'q10', item: '2022 年“人民经济”论争', status: '〔存疑〕', reason: '原始访谈出处与向松祚等批评方原文均仅见二手网文转述，暂不列入争议栏。' },
  { id: 'q11', item: '《从农业 1.0 到农业 4.0》', status: '〔存疑〕', reason: '仅见辽宁大学报道简介提及，出版社与年份未核。' },
  { id: 'q12', item: '《解构现代化》网络摘录中的“规范性的拳术研究”', status: '更正', reason: '疑为 OCR 误字（应为“学术”），相关表述降为转述处理。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
