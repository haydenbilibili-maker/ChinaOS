// ============================================================================
// 学者专栏 · 萧功秦 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 期刊原文/作者授权发布/主办方页面 · media 媒体报道 · reprint 整理稿或二手述评 · doubt 存疑。
// 搜索引擎摘要、自媒体拼接稿、营销页中托名"萧功秦认为"而无原文可溯者一律不收录。
// 近三年（2024—2026）可核验新文本仅 4 篇（均为 2024 年），2025—2026 年未检索到新讲座或新文章，不凑数。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  neoauth: { label: '新权威主义与开明权威', color: '#c41e3a' },
  transition: { label: '后全能体制与渐进转型', color: '#8b5cf6' },
  chinamodel: { label: '中国模式与发展政治学', color: '#22d3ee' },
  history: { label: '晚清改革与历史镜鉴', color: '#e8a317' },
  radicalism: { label: '超越左右激进主义', color: '#fb923c' },
  civil: { label: '公民社会与多元整合', color: '#10b981' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '萧功秦',
  born: '1946 年 · 陕西西安（祖籍湖南衡阳）',
  summary:
    '1965 年高中毕业因家庭出身未能升学，进上海嘉定上海第一齿轮厂当学徒、工人；1978 年以同等学力考取南京大学历史系元史专业研究生，师从韩儒林，1981 年获硕士学位后任教上海师范大学历史系，1987 年升副教授，后任教授、博士生导师。1988 年在北戴河会议上提出"新权威主义"，成为 1988—89 年新权威主义论争的"南派"代表；1990 年代转向"新保守主义"，以"软政权与分利集团化"（1994）、"后全能体制"（2000）、"从发展政治学看中国转型"（2008）、"超越左右激进主义"（2012）等论题研究中国政治转型，并以清末新政为历史镜鉴。2016 年获聘上海市文史研究馆馆员。',
  current: [
    '上海师范大学人文学院历史系教授（2024 年出版物与报道署名；是否已退休说法不一，见存疑栏）',
    '上海市文史研究馆馆员（2016-12 起）',
    '曾任上海交通大学国际与公共事务学院政治学教授、复旦大学中国研究中心特聘研究员（据商务印书馆作者简介"曾任"）',
  ],
  sources: '复旦大学高等研究院学者页与讲坛记录；商务印书馆 2022、2024 年作者简介；澎湃新闻 2016-12 文史馆聘任报道；本人回忆文章（观察者网 2011、澎湃 2024）；新民周刊 2024-08 人物稿；维基百科、百度百科（仅交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 15,
  subtitle: '新权威主义 · 后全能体制 · 超越左右激进主义 · 中国模式 · 晚清改革镜鉴',
  span: '1986—2026',
  careerTitle: '履历时间线 · 工厂 → 南大元史 → 上海师大 → 文史馆',
  defaultTheme: 'neoauth',
  moduleId: 'scholarXiaoGongqin',
  sourceNote: '期刊论文原文 / 作者授权发布文章 / 主办方讲座页 / 主流媒体访谈 · 对照政策：全国人大宪法与法律、中办国办文件、十八届与二十届三中全会决定',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  factory: { label: '工厂', color: '#94a3b8' },
  study: { label: '求学', color: '#8b5cf6' },
  shnu: { label: '上海师大', color: '#22d3ee' },
  other: { label: '兼职与聘任', color: '#e8a317' },
};

/** 履历甘特：起止为小数年；月份未载者取近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '上海第一齿轮厂代训学徒、工人', org: '上海嘉定', start: 1965.6, end: 1978.7, group: 'factory', note: '据本人回忆文章（澎湃 2024-04、观察者网 2011）；起止月份为近似' },
  { id: 'c2', role: '南京大学历史系元史专业研究生（导师韩儒林）', org: '南京大学', start: 1978.75, end: 1981.6, group: 'study', note: '1981 年获硕士学位' },
  { id: 'c3', role: '上海师范大学历史系任教', org: '上海师范大学', start: 1981.6, end: 1987.4, group: 'shnu' },
  { id: 'c4', role: '上海师范大学历史系副教授、教授、博士生导师', org: '上海师范大学', start: 1987.4, end: 2026.75, group: 'shnu', note: '1987 年升副教授；升教授年份未见载明；是否已退休说法不一〔存疑〕' },
  { id: 'c5', role: '上海交通大学国际与公共事务学院政治学教授（兼）', org: '上海交通大学', start: 2010.8, end: 2022.1, group: 'other', note: '起止年份未见载明：2010-11 署名已含此职，2022 年作者简介作"曾任"，按署名可见区间标注〔存疑〕' },
  { id: 'c6', role: '复旦大学中国研究中心特聘研究员', org: '复旦大学', start: 2010.8, end: 2022.1, group: 'other', note: '起止年份未见载明，口径同上〔存疑〕' },
  { id: 'c7', role: '上海市文史研究馆馆员', org: '上海市人民政府', start: 2016.95, end: 2026.75, group: 'other', note: '沪府办〔2016〕88 号，2016-12-12 颁发聘书' },
];

export const BOOKS = [
  { id: 'b1', year: 1986, title: '儒家文化的困境', publisher: '四川人民出版社（走向未来丛书）', date: '1986-04', themes: ['history'], verified: 'primary', note: '统一书号 17118·150；广西师大出版社 2006 年再版（ISBN 9787563360222），山西人民出版社 2022-05 版副题"近代士大夫与中西文化的碰撞"（ISBN 9787203121466）' },
  { id: 'b2', year: 1995, title: '萧功秦集', publisher: '黑龙江教育出版社', themes: ['neoauth', 'history'], verified: 'primary', note: '据复旦高研院学者页著作目录；版权页未独立核对' },
  { id: 'b3', year: 1999, title: '危机中的变革：清末现代化进程中的激进与保守', publisher: '上海三联书店', date: '1999-01', isbn: '9787542612083', themes: ['history', 'radicalism'], verified: 'primary', note: '修订版改题《危机中的变革：清末政治中的激进与保守》，广东人民出版社 2011-01（ISBN 9787218069593）' },
  { id: 'b4', year: 2001, title: '与政治浪漫主义告别', publisher: '湖北教育出版社（仁智文丛）', date: '2001-03', isbn: '9787535128614', themes: ['radicalism', 'neoauth'], verified: 'primary' },
  { id: 'b5', year: 2002, title: '知识分子与观念人', publisher: '天津人民出版社', isbn: '9787201039565', themes: ['radicalism'], verified: 'primary' },
  { id: 'b6', year: 2008, title: '中国的大转型：从发展政治学看中国变革', publisher: '新星出版社', date: '2008-03', isbn: '9787802254305', themes: ['transition', 'chinamodel'], verified: 'primary', note: '同年另有印次 ISBN 9787802257160' },
  { id: 'b7', year: 2010, title: '历史的眼睛', publisher: '东方出版中心', date: '2010-01', themes: ['history'], verified: 'primary' },
  { id: 'b8', year: 2010, title: '反思的年代', publisher: '复旦大学出版社', date: '2010-08', themes: ['radicalism', 'transition'], verified: 'primary' },
  { id: 'b9', year: 2012, title: '超越左右激进主义：走出中国转型的困局', publisher: '浙江大学出版社', date: '2012-08', isbn: '9787308102315', themes: ['radicalism', 'transition'], verified: 'primary', note: '副题"困局"/"困境"各处著录不一，见存疑栏' },
  { id: 'b10', year: 2022, title: '走出天下秩序：近代中国变革的思想视角', publisher: '商务印书馆', date: '2022-02', isbn: '9787100199056', themes: ['history'], verified: 'primary' },
  { id: 'b11', year: 2024, title: '热爱生命：学术人生随想录', publisher: '商务印书馆', date: '2024-03', isbn: '9787100229128', themes: ['radicalism', 'history'], verified: 'primary' },
  { id: 'b12', year: 2024, title: '家书中的百年史（增订版）', publisher: '山西人民出版社', date: '2024-09', isbn: '9787203134244', themes: ['history'], verified: 'primary', note: '初版华夏出版社 2014-07（ISBN 9787508081526）' },
  { id: 'b13', year: 2025, title: '危机中的变革：清末政治中的激进与保守（新版）', publisher: '山西人民出版社', date: '2025-05', isbn: '9787203135746', themes: ['history'], verified: 'primary' },
  { id: 'b14', title: '历史拒绝浪漫——新保守主义与中国现代化', publisher: '欧亚学会（香港）', themes: ['neoauth', 'radicalism'], verified: 'doubt', note: '仅见书目转引，出版年份与版权信息未能核实' },
  { id: 'b15', year: 1994, title: '走向成熟', publisher: '出版社未见', themes: ['neoauth'], verified: 'doubt', note: '仅见于复旦高研院学者页目录，未找到版权页或其他书目记录' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k1988', date: '1988-07', form: '讲话', venue: '北戴河知识分子问题学术讨论会发言（据卢毅《回顾一场几乎被遗忘的论争》，《二十一世纪》网络版 2009 年 2 月号总第 83 期）', source: '香港中文大学中国文化研究所《二十一世纪》（二手述评）', url: 'https://cuhk.edu.hk/ics/21c/media/online/0812009.pdf', verified: 'reprint', themes: ['neoauth'] },
  { id: 'k1989', date: '1989', form: '对话', venue: '萧功秦、朱伟《新权威主义：痛苦的两难选择》，收入刘军、李林编《新权威主义——对改革理论纲领的论争》，经济学院出版社 1989，第 54—58 页', source: '论文集著录；英译载 Chinese Sociology & Anthropology 1990-12（本栏未见全文）', verified: 'primary', themes: ['neoauth'] },
  { id: 'k1991', date: '1991', form: '采访', venue: '《改革时代的新保守主义的崛起——与〈中国时报周刊〉记者的谈话录》（年份据文中"论战两年后"推定）', source: '复旦大学高等研究院学者文章页', url: 'http://www.ias.fudan.edu.cn/article/1848', verified: 'reprint', themes: ['neoauth', 'radicalism'] },
  { id: 'k1994', date: '1994', form: '论文', venue: '《“软政权”与分利集团化：中国现代化的两重陷阱》，《战略与管理》1994 年第 1 期，第 2—4 页', source: '《战略与管理》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/6770.html', verified: 'primary', themes: ['transition', 'radicalism'] },
  { id: 'k1999', date: '1999', form: '论文', venue: '《后全能主义时代的来临：世纪之交中国社会各阶层政治态势与前景展望》，《当代中国研究》1999 年第 1 期', source: '《当代中国研究》官网', url: 'https://www.modernchinastudies.org/cn/issues/past-issues/64-mcs-1999-issue-1/482-2012-01-01-10-06-23.html', verified: 'primary', themes: ['transition', 'civil'] },
  { id: 'k2000', date: '2000-12', form: '论文', venue: '《后全能体制与21世纪中国的政治发展》，《战略与管理》2000 年第 6 期', source: '《战略与管理》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/3895.html', verified: 'primary', themes: ['transition', 'civil'] },
  { id: 'k2002', date: '2002-12', form: '论文', venue: '《中国后全能型的权威政治》，《战略与管理》2002 年第 6 期', source: '《战略与管理》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/4213.html', verified: 'primary', themes: ['transition', 'neoauth'] },
  { id: 'k2008a', date: '2008-01', form: '论文', venue: '《从发展政治学看中国转型体制》，《浙江学刊》2008 年第 1 期', source: '《浙江学刊》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/45063.html', verified: 'primary', themes: ['transition', 'chinamodel'] },
  { id: 'k2008b', date: '2008-05', form: '论文', venue: '《从转型政治学看三十年中国变革》，《探索与争鸣》2008 年第 5 期', source: '《探索与争鸣》官网摘要页', url: 'https://www.tsyzm.cn/CN/Y2008/V1/I5/4', verified: 'primary', themes: ['transition', 'chinamodel'] },
  { id: 'k2009', date: '2009-12-01', form: '采访', venue: '经济观察网访谈 · 从千年文明史看中国大转型', source: '经济观察网', url: 'http://www.eeo.com.cn/zt/50forum/tuijian/2009/12/01/157088.shtml', verified: 'media', themes: ['transition', 'chinamodel'] },
  { id: 'k2010a', date: '2010-02-24', form: '文章', venue: '《从新保守主义立场看中国变革中的激进主义》', source: '复旦大学高等研究院学者文章页', url: 'http://www.ias.fudan.edu.cn/article/1984', verified: 'reprint', themes: ['radicalism'] },
  { id: 'k2010b', date: '2010-11-09', form: '署名文章', venue: '《中国模式优势背后面临五大困境》', source: '爱思想（作者授权发布）', url: 'https://www.aisixiang.com/data/37146.html', verified: 'primary', themes: ['chinamodel', 'civil'] },
  { id: 'k2011a', date: '2011-07-25', form: '采访', venue: '《瞭望东方周刊》专访 · 中国模式与改革', source: '瞭望东方周刊（新浪新闻转载；爱思想转载）', url: 'http://news.sina.com.cn/c/2011-07-25/175522873829.shtml', verified: 'media', themes: ['chinamodel', 'radicalism'] },
  { id: 'k2011b', date: '2011', form: '采访', venue: '《亚洲周刊》纪硕鸣访谈 · 超越左右之争：新保守主义与第三条道路', source: '亚洲周刊（爱思想作者授权发布）', url: 'https://www.aisixiang.com/data/41680.html', verified: 'media', themes: ['neoauth', 'civil', 'radicalism'] },
  { id: 'k2012a', date: '2012-07-20', form: '文章', venue: '《中国要警惕激进主义的陷阱》', source: '中国新闻周刊（爱思想转载）', url: 'https://www.aisixiang.com/data/55628.html', verified: 'media', themes: ['radicalism'] },
  { id: 'k2012b', date: '2012', form: '报告', venue: '天大研究院报告 · 从中道立场理解中国转型——关于超越左右激进主义的思考', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/57141.html', verified: 'primary', themes: ['civil', 'radicalism'] },
  { id: 'k2012c', date: '2012-09-27', form: '讲座', venue: '复旦大学"中国深度研究高级讲坛"第五十期 · 坚持中道理性，超越左右极端——关于重建转型期政治共识的思考', source: '复旦大学高等研究院学者页讲坛记录', url: 'http://www.ias.fudan.edu.cn/channel/967', verified: 'primary', themes: ['radicalism'] },
  { id: 'k2012d', date: '2012-10', form: '文章', venue: '《超越左右激进两极思维——以中道理性为基础重建社会共识》', source: '爱思想全文转载', url: 'https://www.aisixiang.com/data/57922.html', verified: 'primary', themes: ['radicalism'] },
  { id: 'k2013', date: '2013-12-08', form: '讲座', venue: '凤凰网"大学问"沙龙第二期演讲 · 从邓小平到习近平：中国改革再出发', source: '爱思想转载整理稿', url: 'http://www.aisixiang.com/data/70569.html', verified: 'reprint', themes: ['neoauth'] },
  { id: 'k2016a', date: '2016-09', form: '论文', venue: '《华夏国家起源新论——从“猴山结构”到中央集权国家》，《文史哲》2016 年第 5 期', source: '《文史哲》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/101405.html', verified: 'primary', themes: ['history'] },
  { id: 'k2016b', date: '2016', form: '论文', venue: '《中国模式的内涵及前途》，《武汉大学学报》（人文科学版）2016 年第 4 期', source: '《武汉大学学报》（人民论坛网 2016-09-26 转载）', url: 'https://www.rmlt.com.cn/2016/0926/440831.shtml', verified: 'primary', themes: ['chinamodel', 'neoauth'] },
  { id: 'k2022', date: '2022-02', form: '著作选段', venue: '《走出天下秩序：近代中国变革的思想视角》内容简介与试读', source: '商务印书馆官网', url: 'https://www.cp.com.cn/book/f91fb251-1.html', verified: 'primary', themes: ['history'] },
  { id: 'k2024a', date: '2024-04-07', form: '署名文章', venue: '《我希望能找到年轻时的启蒙者，还有机会再见到他》', source: '澎湃新闻·湃客（作者授权转载）', url: 'https://www.thepaper.cn/newsDetail_forward_26939319', verified: 'primary', themes: ['history'] },
  { id: 'k2024b', date: '2024-09-05', form: '署名文章', venue: '《萧健、萧默、萧功秦：一个家族的百年史》（《家书中的百年史》增订版自序）', source: '澎湃新闻·湃客', url: 'https://www.thepaper.cn/newsDetail_forward_28625936', verified: 'primary', themes: ['history'] },
  { id: 'k2024c', date: '2024-11-24', form: '讲座', venue: '上海图书馆东馆《热爱生命：学术人生随想录》读书分享会', source: '商务印书馆官网 2024-11-25；南方都市报', url: 'https://www.cp.com.cn/Content/2024/11-25/1627001611.html', verified: 'primary', themes: ['radicalism'] },
  { id: 'k2024d', date: '2024-12-21', form: '采访', venue: 'Chang Che, "The Father of Chinese Authoritarianism Has a Message for America", The New Yorker (The Weekend Essay)', source: 'The New Yorker', url: 'https://www.newyorker.com/news/the-weekend-essay/the-father-of-chinese-authoritarianism-has-a-message-for-america', verified: 'media', themes: ['neoauth', 'transition'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 新权威主义与开明权威 ——
  { id: 'n1', k: 'k1991', theme: 'neoauth', type: '原话', text: '八八年底到八九年初的新权威主义论战，可以说是大陆知识界自一九四九年以来的第一次，也是迄今为止唯一的一次完全自发的有关中国现代化命运选择的学术讨论。' },
  { id: 'n2', k: 'k1988', theme: 'neoauth', type: '转述', text: '据卢毅述评：1988 年 7 月在北戴河学术讨论会上首次提出"新权威主义"，把强势开明权威视为现代化过渡阶段不得不接受的"必要的祸害"（二手述评）。' },
  { id: 'n3', k: 'k1989', theme: 'neoauth', type: '转述', text: '与朱伟以对话形式讨论新权威主义，篇名把它定位为改革中的"痛苦的两难选择"；本栏未见全文，仅据篇名与论争述评转述。' },
  { id: 'n4', k: 'k1991', theme: 'neoauth', type: '转述', text: '回顾论争时区分以其本人为代表的"南派"与以吴稼祥、张炳九为代表的"北派"新权威主义，并以新保守主义概括论战之后的思想走向。' },
  { id: 'n5', k: 'k2013', theme: 'neoauth', type: '原话', text: '新权威主义，从政治学上说，就是指后发展国家中那种具有市场经济现代化导向的、开明的威权政治或强人政治。' },
  { id: 'n6', k: 'k2013', theme: 'neoauth', type: '原话', text: '通俗地说，新权威主义者就是铁腕改革派。' },
  { id: 'n7', k: 'k2011b', theme: 'neoauth', type: '原话', text: '在这个意义上，二十多年前提出的新权威主义，可以说是新保守主义的前身。' },
  { id: 'n8', k: 'k2016b', theme: 'neoauth', type: '原话', text: '共产党领导加市场经济的中国模式，实际上就起到后发展国家中的新权威主义。' },
  { id: 'n10', k: 'k2024d', theme: 'neoauth', type: '转述', text: '据《纽约客》采访：承认理论本身存在两难——新权威主义要求强人领导者足够明智，但无法保证他一定明智；并称威权主义有其自身问题。' },

  // —— 后全能体制与渐进转型 ——
  { id: 't1', k: 'k1994', theme: 'transition', type: '原话', text: '这里的软政权，指的是发展中国家在现代化过程中，行政命令贯彻能力的退化、行政实施效率的低下和法律规则被任意破坏而引起的综合现象。' },
  { id: 't3', k: 'k2000', theme: 'transition', type: '原话', text: '“后全能体制”的社会，存在着有限的多元化。' },
  { id: 't4', k: 'k2000', theme: 'transition', type: '转述', text: '认为中国以"维新模式"而非革命模式，完成了从高度集权的计划经济—政治集权体制向更具多元性的社会政治模式的转变。' },
  { id: 't5', k: 'k2002', theme: 'transition', type: '原话', text: '“后全能政治”在运用强大的国家机器与政治资源动员能力，以刚性方式来排除现代化过程中可能出现的政治动荡与危机方面，应该说是具有其他类型的权威政治所没有的某些特殊的优势的。' },
  { id: 't6', k: 'k2002', theme: 'transition', type: '转述', text: '把当时的体制概括为"后全能主义型的技术专家治国的权威政治模式"，并讨论其政策效果的"延时效应"。' },
  { id: 't7', k: 'k2008a', theme: 'transition', type: '原话', text: '中国民主化必须经由从全能主义向权威主义过渡的这一阶段。' },
  { id: 't8', k: 'k2008a', theme: 'transition', type: '转述', text: '以五个历史—政治要素刻画转型体制：决策精英世俗理性化、有限多元化、意识形态去魅化、脱两极冲突化、政治录用技术官僚化。' },
  { id: 't9', k: 'k2008b', theme: 'transition', type: '原话', text: '现行的中国政治模式是一种介乎于完全没有社会多元化的全能主义旧体制,和具有中国特色的未来民主政治之间的一种过渡性政治形态。' },
  { id: 't11', k: 'k2024d', theme: 'transition', type: '转述', text: '据《纽约客》转述其推导链：强人带来政治稳定，稳定带来经济繁荣，繁荣孕育公民社会，公民社会最终支撑民主。' },

  // —— 中国模式与发展政治学 ——
  { id: 'c1', k: 'k2010b', theme: 'chinamodel', type: '原话', text: '从政治与社会的关系来说，中国模式实际上就是中国自改革开放以来经由特定的历史路径，而自然形成的“强国家—弱社会”的关系模式。' },
  { id: 'c2', k: 'k2010b', theme: 'chinamodel', type: '原话', text: '认为其他国家可以如法炮制中国模式，是一种肤浅的皮相之论。' },
  { id: 'c3', k: 'k2010b', theme: 'chinamodel', type: '转述', text: '概括中国模式的五大困境：腐败困境、国富民穷困境、国有病困境、两极分化困境、社会创新能力弱化困境。' },
  { id: 'c5', k: 'k2011a', theme: 'chinamodel', type: '原话', text: '我觉得“中国模式”是一个中性概念，它并不是一种荣誉奖章，本身不涉及肯定或否定的价值评价。' },
  { id: 'c6', k: 'k2011a', theme: 'chinamodel', type: '转述', text: '认为张维为等人的中国模式论提供了新的参照系，但担心决策层因此产生自满情绪。' },
  { id: 'c7', k: 'k2008b', theme: 'chinamodel', type: '转述', text: '据期刊摘要：提出"中国—越南模式"是转型政治分类学上的一个新"物种"。' },
  { id: 'c8', k: 'k2016b', theme: 'chinamodel', type: '转述', text: '认为中国的新权威主义不同于韩国与台湾地区的东亚模式，最大程度地利用了一党政治的社会资本（据转载页核心提示）。' },

  // —— 晚清改革与历史镜鉴 ——
  { id: 'h1', k: 'k2022', theme: 'history', type: '原话', text: '理解一个时代的人们如何思考问题，比理解这个时代的人们如何行动更为重要。' },
  { id: 'h2', k: 'k2022', theme: 'history', type: '转述', text: '以"清末新政与中国开明专制道路的失败""严复悖论与中国现代化的困境"等章，把清末改革作为转型政治的历史镜鉴（据目录）。' },
  { id: 'h3', k: 'k2011b', theme: 'history', type: '转述', text: '援引严复"非新无以为进，非旧无以为守"作为开明保守主义的基本理念，强调变革须兼顾承续。' },
  { id: 'h4', k: 'k2016a', theme: 'history', type: '转述', text: '以"猴山结构"（庇护制）为分析起点，讨论华夏从早期庇护结构走向中央集权国家的起源路径。' },
  { id: 'h5', k: 'k2024b', theme: 'history', type: '原话', text: '我们家是受左翼思潮影响很深的湖南衡阳士绅之家，家族文化潜移默化地影响了我的人生价值观' },
  { id: 'h6', k: 'k2024a', theme: 'history', type: '原话', text: '我之所以能轻松地实现学术转向，与自己的思维方式方面的训练有关。' },

  // —— 超越左右激进主义 ——
  { id: 'r1', k: 'k1991', theme: 'radicalism', type: '原话', text: '我的直觉与理性都告诉我，中国自改革开放以来的第一思潮时代，即与激进主义思维相联系的“政治浪漫主义”时代，作为一个阶段，已经基本成为过去。' },
  { id: 'r2', k: 'k1994', theme: 'radicalism', type: '原话', text: '今后，中国现代化将步入在稳进中求发展的第二思潮时代。' },
  { id: 'r3', k: 'k2010a', theme: 'radicalism', type: '原话', text: '激进主义的思想基础是政治浪漫主义' },
  { id: 'r4', k: 'k2011b', theme: 'radicalism', type: '转述', text: '把激进主义分为两个方向：主张直接移植西方多元民主的激进西化自由主义，与以平均主义为第一原理的新左派；新保守主义的"保守"是相对这两者而言。' },
  { id: 'r5', k: 'k2012a', theme: 'radicalism', type: '原话', text: '如果不能及时进行进一步的深化改革，化解社会矛盾，而是故步自封，一旦改革进入锁定状态，矛盾将进一步激化，长此以往，中国有可能在左与右的激进主义——民粹主义的夹攻与冲击下，陷入严重的危机与陷阱。' },
  { id: 'r6', k: 'k2012d', theme: 'radicalism', type: '原话', text: '我们强调中道理性，一方面要反对左右的激进主义，另一方面，要反对保守停滞的思想，反对既得利益的保守化，即应对激进挑战而走向退缩性反应。' },
  { id: 'r7', k: 'k2012c', theme: 'radicalism', type: '转述', text: '以"坚持中道理性，超越左右极端"为题，讨论如何重建转型期政治共识（据讲坛记录题目）。' },
  { id: 'r8', k: 'k2024c', theme: 'radicalism', type: '原话', text: '所谓经验主义就是尊重一个民族在应对它的困境和挑战过程中，长期积累下来的集体经验' },
  { id: 'r9', k: 'k2024c', theme: 'radicalism', type: '转述', text: '据主办方报道：主张"有方向的经验主义"，并把知识分子的特点概括为游离性、独立性、学理性与建设性。' },

  // —— 公民社会与多元整合 ——
  { id: 's1', k: 'k2000', theme: 'civil', type: '原话', text: '在这里，市民社会指的就是国家控制力以外的、体制外的自组织系统。' },
  { id: 's2', k: 'k2010b', theme: 'civil', type: '原话', text: '在保持执政党执政地位的历史连续性与正当性的同时，保持政治稳定下的社会多元化，从多元化的成果中来吸取政治稳定的社会资源，使中国可以渐进地走出威权主义，走向民主政治。' },
  { id: 's3', k: 'k2011b', theme: 'civil', type: '原话', text: '对中国执政者来说，要改变思维方式，把“一元整合”的思维变为“多元整合”的思维。' },
  { id: 's4', k: 'k2011b', theme: 'civil', type: '转述', text: '主张政府做培植公民社会的"园丁"，并以政府主导的合作主义（法团主义）而非对抗式路径发展公民社会，认为这更适合中国国情。' },
  { id: 's5', k: 'k2012b', theme: 'civil', type: '原话', text: '经济发展，社会多元化，公民社会建设与民主政治文化的发展，是一个序列关系。' },
  { id: 's6', k: 'k2012b', theme: 'civil', type: '原话', text: '它主张在保持现存体制的历史连续性与秩序稳定的条件下，通过渐进的经济与社会发展最终走向民主政治。' },
  { id: 's7', k: 'k1999', theme: 'civil', type: '原话', text: '应不失时机地建立适合中国国情的有效监督机制，以免使中国陷入糜散性腐败的陷阱、因“急诊室悖论”而失去可行的政治选择。' },
  { id: 's8', k: 'k2010b', theme: 'civil', type: '转述', text: '警告"强国家—弱社会"下以花钱买稳定抑制矛盾，矛盾只会延迟积累，若不能以"高频率低强度"方式化解，可能转为"低频率高强度"的爆发。' },
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

export const FEATURED = ['n5', 'n1', 't1', 't9', 'c1', 'r6', 's2', 's3'];

export const THEME_LINKS = {
  neoauth: [{ to: '/powerlogic', label: '权力逻辑' }, { to: '/leadership', label: '领导体制' }],
  transition: [{ to: '/reform', label: '改革' }, { to: '/pathdependence', label: '路径依赖' }],
  chinamodel: [{ to: '/govsystem', label: '政府体制' }, { to: '/middleincometrap', label: '中等收入陷阱' }],
  history: [{ to: '/modules/shijian', label: '史鉴' }, { to: '/civilization', label: '文明' }],
  radicalism: [{ to: '/ideology', label: '意识形态' }, { to: '/contradictions', label: '社会矛盾' }],
  civil: [{ to: '/socialgov', label: '社会治理' }, { to: '/governance', label: '国家治理' }],
};

export const THEME_INTRO = {
  neoauth: '1988 年提出、1988—89 年论争中被归为"南派"的新权威主义：以具有市场现代化导向的开明强人政治作为过渡，保障秩序与市场化；此后自述演化为"新保守主义"，2016 年把"共产党领导加市场经济"本身读作中国式新权威主义。其原文多作"开明的威权政治/开明的新权威主义"，未见"开明权威"作为独立术语。',
  transition: '从"软政权与分利集团化"（1994）到"后全能体制"（2000）、"过渡性政治形态"（2008），核心命题是：中国经由维新而非革命，从全能主义走向有限多元的权威体制，并须以此为阶段渐进走向民主。',
  chinamodel: '把中国模式界定为"强国家—弱社会"的历史产物，既承认其动员与整合优势，也列出腐败、国富民穷、国有病、两极分化、创新弱化五大困境；主张"中国模式"是中性概念，不可复制。',
  history: '元史出身，以清末新政、严复悖论与"开明专制"的失败作为当代转型的镜鉴；近年著述转向家族史与学术自述，并写作华夏国家起源。',
  radicalism: '一条贯穿三十余年的线：以"政治浪漫主义"批评激进主义，1990 年代宣告"第二思潮时代"，2012 年前后以"中道理性"同时反对左右激进主义与既得利益的保守停滞。',
  civil: '其渐进路线的落点：经济发展、社会多元化、公民社会、民主政治文化构成"序列关系"；主张政府做公民社会的"园丁"、以合作主义路径实现"多元整合"。',
};

// ============================================================================
// 命题检验台账：claim 为其核心理论命题或前瞻性推论；check 为对照的制度演进。
// "一致"仅指制度走向与命题相符，不代表因果归功于本人；难以证伪者一律记 open。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'open', type: '原话', date: '2000-12', venue: '《战略与管理》2000 年第 6 期',
    url: 'https://www.aisixiang.com/data/3895.html',
    claim: '随着市场经济引发的社会多元化趋势的进一步增强，本世纪中期前后……一种与社会利益多元化的经济与社会现实条件相适应的、具有中国民族特色的更具多元化性质的政治模式将有可能出现。',
    check: '2018-03-11 十三届全国人大一次会议通过宪法修正案：在第一条写入"中国共产党领导是中国特色社会主义最本质的特征"，删去国家主席、副主席连续任职不得超过两届的规定，增设国家监察委员会。至核验日制度演进以强化党的集中统一领导为主轴；但命题时点为"本世纪中期前后"，尚未到期，记为未决。',
    dataSrc: '《中华人民共和国宪法修正案》（2018-03-11，全国人大）',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '1994', venue: '《战略与管理》1994 年第 1 期',
    url: 'https://www.aisixiang.com/data/6770.html',
    claim: '这一时期中国现代化面临的主要问题是“软政权化”与分利集团化。',
    check: '2012 年后反腐败被列为中央长期任务，2018-03-20 十三届全国人大一次会议通过《监察法》，建立覆盖所有行使公权力公职人员的国家监察体系。行政贯彻力与腐败问题被官方确认并作为重点治理对象，与其问题判断一致；治理路径（党统一领导下的国家监察）与其论证不必相同，亦不构成因果归功。',
    dataSrc: '《中华人民共和国监察法》（2018-03-20，全国人大）',
  },
  {
    id: 'L3', status: 'open', type: '原话', date: '2008-05', venue: '《探索与争鸣》2008 年第 5 期',
    url: 'https://www.tsyzm.cn/CN/Y2008/V1/I5/4',
    claim: '现行的中国政治模式是一种介乎于完全没有社会多元化的全能主义旧体制,和具有中国特色的未来民主政治之间的一种过渡性政治形态。',
    check: '"过渡性"需以终点检验；官方文件以"全过程人民民主"（2022-10 党的二十大报告）界定中国民主形态，并未采用"过渡形态"叙事。终点未显现，命题难以证伪。',
    dataSrc: '党的二十大报告（2022-10-16）',
  },
  {
    id: 'L4', status: 'open', type: '原话', date: '2008-01', venue: '《浙江学刊》2008 年第 1 期',
    url: 'https://www.aisixiang.com/data/45063.html',
    claim: '正是在这个意义上，中国目前正处于这一过渡阶段的中期。',
    check: '"中期"隐含后续阶段的时间表，但原文未给出可检验的时点或指标；至核验日未见其所述后期阶段的制度信号，也无法据此判定命题失败。',
    dataSrc: '公开制度文件（检索截至 2026-09）',
  },
  {
    id: 'L5', status: 'open', type: '转述', date: '2011', venue: '《亚洲周刊》访谈',
    url: 'https://www.aisixiang.com/data/41680.html',
    claim: '政府做培植公民社会的"园丁"，以合作主义路径发展公民社会',
    check: '2016-03-16《慈善法》通过（2016-09-01 施行）；2016-04-28《境外非政府组织境内活动管理法》通过（2017-01-01 施行）；2016-08 中办国办印发《关于改革社会组织管理制度促进社会组织健康有序发展的意见》。政府主导、登记与监管并重的框架与"合作主义"部分相符，但对公民社会"多元整合"功能的定位与其设想不同，记为未决。',
    dataSrc: '全国人大（2016）；中办国办（2016-08）',
  },
  {
    id: 'L6', status: 'done', type: '转述', date: '2010-11-09', venue: '爱思想署名文章《中国模式优势背后面临五大困境》',
    url: 'https://www.aisixiang.com/data/37146.html',
    claim: '"国富民穷困境"导致社会消费严重不足',
    check: '2024-07-18 二十届三中全会通过《中共中央关于进一步全面深化改革、推进中国式现代化的决定》，提出"构建初次分配、再分配、第三次分配协调配套的制度体系，提高居民收入在国民收入分配中的比重，提高劳动报酬在初次分配中的比重"；2026-03 "十五五"规划纲要延续扩大内需方向。问题被官方确认，与其判断一致；不代表因果归功。',
    dataSrc: '二十届三中全会决定（2024-07-21 发布）；"十五五"规划纲要（2026-03）',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2010-11-09', venue: '爱思想署名文章《中国模式优势背后面临五大困境》',
    url: 'https://www.aisixiang.com/data/37146.html',
    claim: '"国有病困境"：向国企倾斜引发"国进民退"忧虑，民营企业经营日益困难',
    check: '2025-04-30 十四届全国人大常委会通过《民营经济促进法》（2025-05-20 施行），以法律形式确认民营经济地位；同期国企改革深化提升行动仍在推进。二者并行，是否缓解其所述结构性倾斜尚无统一口径，记为未决。',
    dataSrc: '《中华人民共和国民营经济促进法》（全国人大常委会，2025-04-30）',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '1999', venue: '《当代中国研究》1999 年第 1 期',
    url: 'https://www.modernchinastudies.org/cn/issues/past-issues/64-mcs-1999-issue-1/482-2012-01-01-10-06-23.html',
    claim: '应不失时机地建立适合中国国情的有效监督机制，以免使中国陷入糜散性腐败的陷阱、因“急诊室悖论”而失去可行的政治选择。',
    check: '2018 年国家监察体制改革建立党统一领导下的国家监察体系（《监察法》2018-03-20）。"有效监督机制"在体制内监督层面有制度落地，但其原文语境包含社会监督与政治参与，二者不完全对应，记为部分一致、未决。',
    dataSrc: '《中华人民共和国监察法》（2018-03-20）',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2013-12-08', venue: '凤凰网"大学问"沙龙演讲（整理稿）',
    url: 'http://www.aisixiang.com/data/70569.html',
    claim: '以强有力的权威推动反腐与整合，为全面深化改革创造稳定环境',
    check: '2013-11-12 十八届三中全会通过《中共中央关于全面深化改革若干重大问题的决定》，2024-07 二十届三中全会再作系统部署。反腐持续推进与改革部署并行可见，但"权威整合→改革深化"的因果链条难以用公开制度文本检验，记为未决。',
    dataSrc: '十八届三中全会决定（2013-11-12）；二十届三中全会决定（2024-07-18）',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2012-07-20', venue: '《中国新闻周刊》（爱思想转载）',
    url: 'https://www.aisixiang.com/data/55628.html',
    claim: '一旦改革进入锁定状态，矛盾将进一步激化，长此以往，中国有可能在左与右的激进主义——民粹主义的夹攻与冲击下，陷入严重的危机与陷阱。',
    check: '属条件式预警（以"改革锁定"为前提）；2013、2024 年两次三中全会均作全面深化改革部署，前提条件是否成立本身有争议，结论无法证伪。',
    dataSrc: '十八届、二十届三中全会决定',
  },
  {
    id: 'L11', status: 'open', type: '原话', date: '2000-12', venue: '《战略与管理》2000 年第 6 期',
    url: 'https://www.aisixiang.com/data/3895.html',
    claim: '政治控制的范围逐渐缩小，仅局限于与国家与政权安全直接或间接相关的领域。',
    check: '2015-07-01《国家安全法》确立总体国家安全观，国家安全涵盖政治、经济、文化、社会、科技、网络、生态等多个领域。若以"安全相关领域"为口径，其边界本身随法律扩展；控制范围"缩小"还是"扩大"取决于口径，记为未决。',
    dataSrc: '《中华人民共和国国家安全法》（全国人大常委会，2015-07-01）',
  },
];

// 萧功秦的公开表述以政治学概念与阶段论为主，少见可与官方统计直接比对的数值口径，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '新权威主义', '后全能转型', '中国模式', '反激进主义', '公民社会'],
  nodes: [
    { id: 'core', name: '从历史看\n政治转型', cat: 0, size: 58 },
    { id: 'neo', name: '新权威主义', cat: 1, size: 40 },
    { id: 'evil', name: '必要的祸害（过渡权威）', cat: 1, size: 24 },
    { id: 'south', name: '南派 / 北派', cat: 1, size: 22 },
    { id: 'iron', name: '铁腕改革派', cat: 1, size: 24 },
    { id: 'neocons', name: '新保守主义 / 开明保守', cat: 1, size: 30 },
    { id: 'soft', name: '软政权', cat: 2, size: 28 },
    { id: 'rent', name: '分利集团化', cat: 2, size: 26 },
    { id: 'anomy', name: '失范综合症', cat: 2, size: 22 },
    { id: 'post', name: '后全能体制', cat: 2, size: 38 },
    { id: 'limited', name: '有限多元化', cat: 2, size: 26 },
    { id: 'er', name: '急诊室悖论', cat: 2, size: 22 },
    { id: 'strong', name: '强国家—弱社会', cat: 3, size: 34 },
    { id: 'five', name: '五大困境', cat: 3, size: 26 },
    { id: 'neutral', name: '中性概念 / 不可复制', cat: 3, size: 22 },
    { id: 'romance', name: '政治浪漫主义', cat: 4, size: 28 },
    { id: 'twin', name: '左右激进主义', cat: 4, size: 30 },
    { id: 'middle', name: '中道理性', cat: 4, size: 30 },
    { id: 'qing', name: '清末新政 · 开明专制失败', cat: 4, size: 26 },
    { id: 'yanfu', name: '严复：非新无以为进', cat: 4, size: 20 },
    { id: 'civil', name: '公民社会（园丁）', cat: 5, size: 30 },
    { id: 'multi', name: '多元整合', cat: 5, size: 28 },
    { id: 'corp', name: '合作主义路径', cat: 5, size: 22 },
    { id: 'seq', name: '发展→多元→民主 序列', cat: 5, size: 26 },
  ],
  links: [
    ['core', 'neo'], ['core', 'post'], ['core', 'strong'], ['core', 'middle'], ['core', 'civil'], ['core', 'qing'],
    ['neo', 'evil'], ['neo', 'south'], ['neo', 'iron'], ['neo', 'neocons'], ['neocons', 'yanfu'], ['neocons', 'middle'],
    ['soft', 'anomy'], ['rent', 'anomy'], ['soft', 'neo'], ['post', 'limited'], ['post', 'er'], ['post', 'strong'],
    ['strong', 'five'], ['strong', 'neutral'], ['five', 'multi'], ['rent', 'five'],
    ['romance', 'twin'], ['twin', 'middle'], ['qing', 'romance'], ['qing', 'yanfu'],
    ['civil', 'multi'], ['civil', 'corp'], ['civil', 'seq'], ['limited', 'seq'], ['neo', 'seq'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '1988—89 年新权威主义论争：以强人权威推进改革是否可行',
    sides: [
      { who: '萧功秦（北戴河会议 1988-07；《新权威主义：痛苦的两难选择》1989）', view: '转述：后发展国家从传统走向现代需要一个具有现代化导向的开明权威作为过渡，以秩序保障市场化，再由市场与社会多元化孕育民主。' },
      { who: '荣剑《"新权威主义"在中国是否可行？》（《世界经济导报》1989-01-16）', view: '转述：付诸实践可能促成改革全面退却；新权威主义所依赖的"政治和经济的二元化"前提在中国并不存在。' },
      { who: '韩水法、岳麟章、郑永年等（据卢毅述评）', view: '转述：质疑无法保证新权威不蜕化。' },
    ],
    note: '双方材料据卢毅《回顾一场几乎被遗忘的论争》（《二十一世纪》网络版 2009 年 2 月号）及改革数据平台概述转述；本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '"新权威主义 2.0"：2013 年后的再阐释与再批判',
    sides: [
      { who: '萧功秦（凤凰网"大学问"沙龙，2013-12-08）', view: '转述：以铁腕改革派概括新权威主义，认为强有力的权威可为反腐与全面深化改革提供整合力量。' },
      { who: '荣剑《新权威主义再批判》（公法评论网 2013-12-31）', view: '转述：针对 2013 年前后重新兴起的新权威主义论述作系统批评，延续其 1989 年论争中的否定立场（据篇名、发表时间与作者）。' },
    ],
    note: '"1.0/2.0 版本"的说法出自演讲整理稿编者导语，非萧功秦原话；本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '中国模式：阶段性的"强国家—弱社会"，还是自成体系的政治模式',
    sides: [
      { who: '萧功秦（2010-11《中国模式优势背后面临五大困境》；2011-07《瞭望东方周刊》）', view: '转述：中国模式是特定历史路径形成的"强国家—弱社会"结构，是中性概念、不可复制，面临五大困境，出路在培育公民社会、渐进走出威权。' },
      { who: '潘维《中国模式，人民共和国60年的成果》（2009-01-17 演讲，《绿叶》2009 年第 4 期）', view: '转述：以"社稷—民本—国民"三个子模式概括中国模式，强调其政治体制内部的分工制衡，反对照搬西式民主（"拆故宫建白宫"之喻）。' },
    ],
    note: '两人并非直接相互驳论，此处按对"中国模式"性质的判断并陈；本栏并陈，不作裁决。',
  },
  {
    id: 'x4',
    title: '渐进转型论是否回答了"如何避免卡在威权阶段"',
    sides: [
      { who: '萧功秦（2008《从发展政治学看中国转型体制》；2024-12《纽约客》采访）', view: '转述：民主化须经权威主义过渡阶段；2024 年亦承认理论存在"强人必须明智而无法保证明智"的两难。' },
      { who: 'Joseph Fewsmith（据《纽约客》2024-12-21 引述）', view: '转述：萧功秦讨论了国家如何从专制走向民主，却没有探讨如何避免卡在中途。' },
      { who: '樊百华《先"庙堂之忧"而忧的局限——评萧功秦的两篇近作》（《战略与管理》2003 年第 1 期）', view: '转述：篇名即点明批评重心——其后全能权威政治论以执政者（"庙堂"）之忧为出发点（据篇名转述）。' },
    ],
    note: 'Fewsmith 意见为媒体引述，樊百华评论为期刊书评；本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '出生年份 1946 / 1945', status: '并陈', reason: '复育智库、维基语录等作 1946 年 9 月；维基百科信息框作 1945 年。本栏取 1946，未见本人或单位官方页面载明。' },
  { id: 'q2', item: '是否已退休', status: '〔存疑〕', reason: '《纽约客》2024-12 称其"约十年前退休"；商务印书馆 2024-11 报道与澎湃 2024-04 署名仍作"上海师范大学教授"；未检索到上海师大荣休信息。' },
  { id: 'q3', item: '"开明权威""从软政权到强政府"两个标签', status: '不收录', reason: '未检索到以此为题或逐字出现的萧功秦原文；其原文多作"开明的威权政治""开明的新权威主义"与"软政权/硬政权"，以原文术语为准。' },
  { id: 'q4', item: '《“软政权”与分利集团化》期号', status: '并陈', reason: '维普著录为《战略与管理》1994 年第 1 期第 2—4 页；其本人后文脚注作"第二期"。本栏取期刊数据库著录。' },
  { id: 'q5', item: '《超越左右激进主义》副题"困局"/"困境"', status: '并陈', reason: '出版社与书目著录多作"走出中国转型的困局"，部分书店与转引作"困境"。' },
  { id: 'q6', item: '"赵鼎新×萧功秦"南翔书苑对谈、2026 年博客与自媒体转载的"萧功秦新文"', status: '不收录', reason: '对谈仅见报名页，日期与内容未见报道；2026 年博客转载的林彪事件文章原载 2020 年，网易 2024-12 新左派文章与爱思想 2026-04 更新的"我对易中天的印象"均为旧文重发（后者为 2007 年日记）；电商"2026 双册"页面为营销拼接。' },
  { id: 'q7', item: '《纽约客》所述 1988 年相关观点经高层听取汇报的轶事', status: '〔存疑〕', reason: '仅见媒体转述，未见档案或当事人一手出处，不作为事实收录。' },
  { id: 'q8', item: '"中国大转型"', status: '已核', reason: '即《中国的大转型：从发展政治学看中国变革》（新星出版社 2008），非另一部著作。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
