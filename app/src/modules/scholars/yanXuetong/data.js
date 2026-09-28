// ============================================================================
// 学者专栏 · 阎学通 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 英文署名文章的中文译文仅取纽约时报中文网等官方译本；境外媒体政治化解读一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  moral: { label: '道义现实主义与领导力', color: '#8b5cf6' },
  bipolar: { label: '中美两极格局', color: '#c41e3a' },
  strait: { label: '台海与周边安全', color: '#e8a317' },
  tech: { label: '科技竞争与数字时代', color: '#22d3ee' },
  order: { label: '全球治理与国际秩序', color: '#10b981' },
  diplomacy: { label: '中国外交战略', color: '#fb923c' },
  method: { label: '科学方法与国际关系预测', color: '#94a3b8' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '阎学通',
  born: '1952 年 12 月 7 日 · 天津',
  summary:
    '知青经历后于 1977 年考入黑龙江大学英语系，1982 年进入中国现代国际关系研究所，1986 年获国际关系学院硕士，1992 年获美国加州大学伯克利分校政治学博士。2000 年调入清华大学，先后主持国际问题研究所、国际关系学系与当代国际关系研究院（2015 年更名国际关系研究院），2024 年起任名誉院长；创办《国际政治科学》与 The Chinese Journal of International Politics 并任主编至 2018 年，2012—2023 年任世界和平论坛秘书长。以“道义现实主义”理论与可检验的国际关系预测（《历史的惯性》《历史的拐点》）著称，核心议题为政治领导、中美两极竞争与数字时代的大国关系。',
  current: [
    '清华大学文科资深教授（2018 年受聘，据百科资料）',
    '清华大学国际关系研究院名誉院长（2024 年起，具体日期未核）',
    '《国际政治科学》学术顾问（据该刊 2025 年第 3 期署名）',
    '清华大学战略与安全研究中心（CISS）学术委员',
    '中国国际关系学会副会长、中华美国学会副会长（据清华国关院官网简介，任期未核）',
    '俄罗斯科学院外籍院士（2019）',
  ],
  sources: '清华大学国际关系研究院官网个人页与领导成员页；清华大学国际关系学系“历史沿革”；清华 CISS 学术委员页；清华大学新闻网人物报道；《国际政治科学》《CJIP》2018-09-10 换届通告。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 9,
  subtitle: '道义现实主义 · 中美两极 · 台海周边 · 数字竞争 · 预测检验',
  span: '1996—2026',
  careerTitle: '履历时间线 · 现代院 → 伯克利 → 清华国关 → 名誉院长',
  defaultTheme: 'bipolar',
  moduleId: 'scholarYanXuetong',
  sourceNote: '著作原书与出版方页面 / 署名文章（Foreign Affairs、纽约时报、《现代国际关系》《世界经济与政治》）/ 清华官网 / 主流媒体专访 · 对照数据：世界银行 WDI、SIPRI、官方公告与主流媒体时序',
};

export const CAREER_GROUPS = {
  edu: { label: '求学', color: '#94a3b8' },
  cicir: { label: '中国现代国际关系研究所', color: '#e8a317' },
  thu: { label: '清华大学', color: '#8b5cf6' },
  platform: { label: '期刊 / 论坛', color: '#10b981' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '黑龙江大学英语系本科', org: '哈尔滨', start: 1978.1, end: 1982.5, group: 'edu', note: '1977 年恢复高考考入；77 级实际入学月份按通例记为 1978 年初' },
  { id: 'c2', role: '中国现代国际关系研究所（其间获国际关系学院硕士，1986）', org: '北京', start: 1982.5, end: 1987.6, group: 'cicir' },
  { id: 'c3', role: '加州大学伯克利分校政治学博士', org: '美国', start: 1987.6, end: 1992.5, group: 'edu' },
  { id: 'c4', role: '回中国现代国际关系研究所工作', org: '北京', start: 1992.5, end: 2000.5, group: 'cicir', note: '具体职务（VOA 称研究员、副主任）未见官方来源〔存疑〕' },
  { id: 'c5', role: '清华大学国际问题研究所常务副所长 → 所长', org: '清华', start: 2000.5, end: 2015.9, group: 'thu', note: '2000-07 调入；2015-12 该所与当代国际关系研究院合并' },
  { id: 'c6', role: '《国际政治科学》《CJIP》创刊主编', org: '清华', start: 2005.0, end: 2018.7, group: 'platform', note: '2018-09-08 换届，孙学峰接任两刊主编' },
  { id: 'c7', role: '清华大学国际关系学系主任', org: '清华', start: 2007.9, end: 2015.85, group: 'thu', note: '2007-12 建系任主任；卸任时间按继任者孙学峰任期（2015-11 起）推定〔存疑〕' },
  { id: 'c8', role: '当代国际关系研究院院长（2015 年更名国际关系研究院）', org: '清华', start: 2010.8, end: 2024.6, group: 'thu', note: '2024-07 媒体仍称院长，2024-10 官网院长致辞已署孙学峰，交接日期〔存疑〕' },
  { id: 'c9', role: '世界和平论坛秘书长', org: '清华', start: 2012.5, end: 2023.9, group: 'platform', note: '据官网简介（2012—2023）；新京报 2024-07-02 称“副秘书长”，并陈' },
  { id: 'c10', role: '清华大学文科资深教授', org: '清华', start: 2018.0, end: 2026.75, group: 'thu' },
  { id: 'c11', role: '清华大学国际关系研究院名誉院长', org: '清华', start: 2024.6, end: 2026.75, group: 'thu' },
];

export const BOOKS = [
  { id: 'b1', year: 1996, title: '中国国家利益分析', publisher: '天津人民出版社', isbn: '7201024930', themes: ['moral', 'diplomacy'], verified: 'primary', note: 'Google Books 与官网著作列表标 1996；官网正文与书目网站称 1997-08 出版，并陈。1998 年获第十一届中国图书奖' },
  { id: 'b2', year: 2000, title: '美国霸权与中国安全', publisher: '天津人民出版社', date: '2000-03', themes: ['bipolar', 'strait'], verified: 'reprint', note: '年份见官网著作列表；出版社与月份据书目网站' },
  { id: 'b3', year: 2011, title: 'Ancient Chinese Thought, Modern Chinese Power', publisher: 'Princeton University Press', date: '2011-04', isbn: '9780691148267', coauthors: '孙哲等编，Edmund Ryden 译', themes: ['moral'], verified: 'primary', note: '英文编译本，收录先秦思想与当代中国国力的系列论文' },
  { id: 'b4', year: 2013, title: '历史的惯性：未来十年的中国与世界', publisher: '中信出版社', date: '2013-07', themes: ['bipolar', 'method'], verified: 'primary', note: '十年预测著作，2023—2024 年本人主持逐项复盘' },
  { id: 'b5', year: 2015, title: '世界权力的转移：政治领导与战略竞争', publisher: '北京大学出版社', date: '2015-09', themes: ['moral', 'bipolar'], verified: 'primary', note: '维基百科标 2016，官网与书目标 2015，并陈' },
  { id: 'b6', year: 2016, title: '超越韬光养晦：谈3.0版中国外交（编著）', publisher: '天津人民出版社', themes: ['diplomacy'], verified: 'primary', note: '据官网著作列表' },
  { id: 'b7', year: 2018, title: '道义现实主义与中国的崛起战略（编著）', publisher: '中国社会科学出版社', date: '2018-03', coauthors: '张旗', themes: ['moral', 'diplomacy'], verified: 'primary' },
  { id: 'b8', year: 2019, title: 'Leadership and the Rise of Great Powers', publisher: 'Princeton University Press（Princeton-China Series）', isbn: '9780691190082', themes: ['moral', 'bipolar'], verified: 'primary', note: '道义现实主义英文系统表述' },
  { id: 'b9', year: 2020, title: '大国领导力', publisher: '中信出版集团', date: '2020-11', coauthors: '李佩芝 译', themes: ['moral'], verified: 'reprint', note: 'b8 中译本；出版信息据书目网站' },
  { id: 'b10', year: 2023, title: 'The Essence of Interstate Leadership: Debating Moral Realism', publisher: 'Bristol University Press', date: '2023-04', isbn: '9781529232615', coauthors: '方圆圆（合编）', themes: ['moral'], verified: 'primary', note: '收录王庆新、何凯、张锋、Platias 与 Trigkas、Mario Telò、Deborah Welch Larson 等学者的讨论与批评' },
  { id: 'b11', year: 2025, title: '历史的拐点：2025—2035国际格局与秩序', publisher: '中信出版集团', date: '2025-12', isbn: '9787521782691', themes: ['bipolar', 'tech', 'order'], verified: 'primary', note: '附录为对《历史的惯性》预测的检验' },
  { id: 'b12', year: 2026, title: '不安的和平：陌生的国际秩序及其塑造（编著）', publisher: '南开大学出版社', date: '2026-06', isbn: '9787310068999', coauthors: '戴正', themes: ['order', 'bipolar'], verified: 'primary', note: '汇集 2018—2025 年文章与访谈' },
];

/** 讲话 / 采访 / 署名文章 / 论文文库 */
export const CORPUS = [
  { id: 'k1996', date: '1996', form: '著作', venue: '《中国国家利益分析》', source: '天津人民出版社（观点据清华国关院官网简介）', verified: 'primary', themes: ['moral', 'diplomacy'] },
  { id: 'k2008', date: '2008-06-11', form: '署名文章', venue: '《环球时报》国际论坛版 · 台海和平是谁维护的', source: '环球时报（清华校友总会网站转载报道）', url: 'https://www.tsinghua.org.cn/info/1014/8995.htm', verified: 'media', themes: ['strait', 'method'] },
  { id: 'k2013a', date: '2013-01-25', form: '讲话', venue: '财新早餐会（达沃斯）', source: '财新网', url: 'https://international.caixin.com/m/2013-01-26/100486624.html', verified: 'media', themes: ['strait'] },
  { id: 'k2013b', date: '2013-07', form: '著作', venue: '《历史的惯性：未来十年的中国与世界》', source: '中信出版社（预测要点据清华国关院官网简介）', verified: 'primary', themes: ['bipolar', 'method'] },
  { id: 'k2013c', date: '2013-12-09', form: '对话', venue: '与米尔斯海默对话（节选整理）', source: '环球时报（中新网转载）', url: 'https://www.chinanews.com.cn/mil/2013/12-09/5594125.shtml', verified: 'media', themes: ['bipolar'] },
  { id: 'k2016', date: '2016-01-13', form: '采访', venue: '《国际先驱导报》访谈 · 《世界权力的转移》', source: '国际先驱导报（新华网转载）', url: 'http://www.xinhuanet.com/politics/2016-01/13/c_1117763245.htm', verified: 'media', themes: ['moral'] },
  { id: 'k2017', date: '2017-01-25', form: '署名文章', venue: '《纽约时报》评论 · China Can Thrive in the Trump Era（中文版 2017-01-26）', source: '纽约时报 / 纽约时报中文网译文', url: 'https://cn.nytimes.com/opinion/20170126/china-can-thrive-in-the-trump-era/', verified: 'primary', themes: ['bipolar', 'strait', 'diplomacy'] },
  { id: 'k2018', date: '2018-12-11', form: '署名文章', venue: 'Foreign Affairs 2019 年 1/2 月号 · The Age of Uneasy Peace', source: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/china/age-uneasy-peace', verified: 'primary', themes: ['bipolar', 'order'] },
  { id: 'k2020a', date: '2020-01', form: '署名文章', venue: '《现代国际关系》2020 年第 1 期署名文章', source: '现代国际关系（爱思想转载）', url: 'https://www.aisixiang.com/data/120896.html', verified: 'primary', themes: ['bipolar', 'tech'] },
  { id: 'k2020b', date: '2020-04-30', form: '采访', venue: '财新专访 · 疫情后的中国外交与世界秩序', source: '财新网（澎湃新闻转载全文）', url: 'https://international.caixin.com/2020-04-30/101548885.html', verified: 'media', themes: ['diplomacy', 'order'] },
  { id: 'k2020c', date: '2020', form: '论文', venue: 'CJIP 第 13 卷第 3 期 · Bipolar Rivalry in the Early Digital Age', source: 'The Chinese Journal of International Politics（DOI 10.1093/cjip/poaa007）', verified: 'primary', themes: ['tech', 'bipolar'] },
  { id: 'k2021', date: '2021-06-22', form: '署名文章', venue: 'Foreign Affairs 2021 年 7/8 月号 · Becoming Strong', source: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/articles/united-states/2021-06-22/becoming-strong', verified: 'primary', themes: ['diplomacy', 'bipolar'] },
  { id: 'k2022a', date: '2022-01', form: '讲话', venue: '第五届政治学与国际关系教学共同体年会 · 如何为 00 后大学生讲授国际关系课程', source: '澎湃号·湃客（主办方整理稿）', url: 'https://www.thepaper.cn/newsDetail_forward_16474085', verified: 'reprint', themes: ['method'] },
  { id: 'k2022b', date: '2022-05-02', form: '署名文章', venue: 'Foreign Affairs · China’s Ukraine Conundrum', source: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/articles/china/2022-05-02/chinas-ukraine-conundrum', verified: 'primary', themes: ['order', 'diplomacy'] },
  { id: 'k2023a', date: '2023-04-28', form: '著作', venue: 'The Essence of Interstate Leadership: Debating Moral Realism', source: 'Bristol University Press', verified: 'primary', themes: ['moral'] },
  { id: 'k2023b', date: '2023-12-29', form: '采访', venue: '澎湃新闻年终专访（经受访者审定）', source: '澎湃新闻（腾讯新闻转载）', url: 'https://news.qq.com/rain/a/20231229A07KFV00', verified: 'media', themes: ['bipolar', 'method', 'order', 'strait', 'moral'] },
  { id: 'k2024a', date: '2024-01-13', form: '讲话', venue: '“国际关系预测——《历史的惯性》再探究”研讨会', source: '中国网（清华大学新闻网转载）', url: 'https://www.tsinghua.edu.cn/info/1182/109380.htm', verified: 'media', themes: ['method'] },
  { id: 'k2024b', date: '2024-07-02', form: '讲话', venue: '第十二届世界和平论坛媒体吹风会', source: '澎湃新闻、21世纪经济报道', url: 'https://thepaper.cn/newsDetail_forward_27944644', verified: 'media', themes: ['order', 'strait'] },
  { id: 'k2024c', date: '2024-07-05', form: '采访', venue: '北京日报客户端专访 · 中美关系', source: '北京日报客户端', url: 'https://news.bjd.com.cn/2024/07/05/10826068.shtml', verified: 'media', themes: ['bipolar', 'order'] },
  { id: 'k2024d', date: '2024-07-04', form: '采访', venue: '深圳卫视直新闻专访', source: '深圳卫视直新闻（腾讯新闻）', url: 'https://news.qq.com/rain/a/20240704A0AF7H00', verified: 'media', themes: ['bipolar', 'strait'] },
  { id: 'k2024e', date: '2024-11-28', form: '讲话', venue: '2024 搜狐财经峰会', source: 'East is Read 英译（未经本人审校）', url: 'https://www.eastisread.com/p/yan-xuetong-predicts-trump-and-china', verified: 'reprint', themes: ['tech', 'bipolar', 'strait'] },
  { id: 'k2025a', date: '2025-01', form: '讲话', venue: '北京中美关系圆桌论坛', source: '北京日报客户端 2025-01-14', url: 'https://xinwen.bjd.com.cn/content/s6785d8e3e4b08edd28f3c4d6.html', verified: 'media', themes: ['tech', 'diplomacy', 'bipolar'] },
  { id: 'k2025b', date: '2025-06-26', form: '讲话', venue: '第十三届世界和平论坛媒体吹风会', source: '清华大学新闻网；澎湃新闻', url: 'https://www.tsinghua.edu.cn/info/1182/119893.htm', verified: 'primary', themes: ['order'] },
  { id: 'k2025c', date: '2025-06-30', form: '采访', venue: '北京日报客户端专访 · 特朗普第二任期的中美关系', source: '北京日报客户端', url: 'https://news.bjd.com.cn/2025/06/30/11217245.shtml', verified: 'media', themes: ['bipolar', 'moral', 'diplomacy', 'order'] },
  { id: 'k2025d', date: '2025', form: '署名文章', venue: '《国际政治科学》2025 年第 3 期编者寄语 · 演员 VS 剧场', source: '《国际政治科学》微信公众号', verified: 'primary', themes: ['moral', 'method'] },
  { id: 'k2025e', date: '2025-12', form: '著作', venue: '《历史的拐点：2025—2035国际格局与秩序》', source: '中信出版集团（要点据出版方简介与清华 CISS 摘要）', url: 'https://ciss.tsinghua.edu.cn/info/new_achievement_pl/1000000008948', verified: 'primary', themes: ['bipolar', 'tech', 'order'] },
  { id: 'k2026a', date: '2026-01', form: '论文', venue: '《世界经济与政治》2026 年第 1 期 · 道义、政治领导和国际秩序', source: '世界经济与政治（爱思想转载）', url: 'https://www.aisixiang.com/data/174324.html', verified: 'primary', themes: ['moral'] },
  { id: 'k2026b', date: '2026-01-10', form: '署名文章', venue: '“时政国关分析”公众号署名文章 · 2035 年国际格局展望', source: '观察者网 2026-02-04 转载', url: 'https://www.guancha.cn/YanXueTong/2026_02_04_806056.shtml', verified: 'reprint', themes: ['bipolar', 'tech'] },
  { id: 'k2026c', date: '2026-05-12', form: '采访', venue: '澎湃新闻专访 · 特朗普访华前夕', source: '澎湃新闻（网易转载）', url: 'https://www.163.com/dy/article/KSOB8OEQ0514R9P4.html', verified: 'media', themes: ['bipolar', 'tech', 'strait', 'diplomacy'] },
  { id: 'k2026d', date: '2026-06-18', form: '访问', venue: '访问韩国、越南（2026 年 5—6 月）', source: '清华大学国际关系研究院官网', url: 'http://www.tuiir.tsinghua.edu.cn/info/1091/6372.htm', verified: 'primary', themes: ['strait'] },
  { id: 'k2026e', date: '2026-07-05', form: '讲话', venue: '《不安的和平》新书研讨会', source: '南开大学出版社官网；北京日报客户端', url: 'https://nkup.nankai.edu.cn/info/1014/9878.htm', verified: 'primary', themes: ['order'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 道义现实主义与领导力 ——
  { id: 'm1', k: 'k2016', theme: 'moral', type: '原话', text: '‘政治决定论’是把政治领导作为最重要自变量的理论，它是一个‘二元论’的理论，强调实力和政治领导都起作用。先有实力决定国家的基本利益，领导决定用什么策略实现国家利益。' },
  { id: 'm2', k: 'k2026a', theme: 'moral', type: '原话', text: '道义现实主义是一个双变量理论，以大国的实力地位界定客观战略利益，以领导类型判断其战略偏好（利益偏好和实现利益的策略偏好）。' },
  { id: 'm3', k: 'k2026a', theme: 'moral', type: '原话', text: '结构决定行为环境，人是决定如何行为的核心要素，结构适于解释持续，决策者适于解释变化' },
  { id: 'm4', k: 'k1996', theme: 'moral', type: '转述', text: '提出国家利益为统治阶级与被统治阶级共享、不具阶级性，并以效用分析法判断国家利益的优先次序，为外交决策由意识形态原则转向国家利益原则提供理论依据（官网概括）。' },
  { id: 'm5', k: 'k2025c', theme: 'moral', type: '原话', text: '道义现实主义认为国家的国际形象也是相对的，人们是通过比较来判断哪个国家比另一个国家更讲道义。' },
  { id: 'm6', k: 'k2023b', theme: 'moral', type: '原话', text: '国家权力是影响国际关系的最核心要素，因此要想正确预测国际关系的走向和变化，就得研究掌有权力的决策者。' },
  { id: 'm7', k: 'k2025d', theme: 'moral', type: '原话', text: '希望体系理论范式失效的现象能激起学界对于决策者理论范式的研究兴趣。' },

  // —— 中美两极格局 ——
  { id: 'b1', k: 'k2013b', theme: 'bipolar', type: '转述', text: '依据惯性原理预测：至 2023 年中国成为超级大国、世界形成中美两极格局，英国退出欧盟、德国成为欧洲主导国，俄罗斯失去第二军事大国地位，日本仅为地区性大国，巴西成为南美主导国，印度与中国实力差距拉大（清华国关院官网概括）。' },
  { id: 'b2', k: 'k2013c', theme: 'bipolar', type: '原话', text: '中国之所以不会与美国发生直接战争，一是因为核武器，核武器既然能阻止美苏开战，当然也有阻止中美开战的功能。二是因为全球化。' },
  { id: 'b3', k: 'k2017', theme: 'bipolar', type: '原话', text: '特朗普当政期间，中美关系不可避免地会恶化。核威慑应该还是能防止出现一场全面战争，但在可预见的未来，对抗将是这两个大国之间关系的核心。' },
  { id: 'b4', k: 'k2018', theme: 'bipolar', type: '原话', text: 'the coming bipolarity will be an era of uneasy peace between the two superpowers.' },
  { id: 'b5', k: 'k2020a', theme: 'bipolar', type: '原话', text: '冷战是两极格局，但两极格局并不必然是冷战，历史上两极格局是常见现象，而冷战只有过一次。' },
  { id: 'b6', k: 'k2020a', theme: 'bipolar', type: '原话', text: '2019年是两极化结束的一年，即世界两极格局形成的一年。' },
  { id: 'b7', k: 'k2021', theme: 'bipolar', type: '转述', text: '称 2020 年底中国 GDP 已达美国的 71%，美国主导的单极秩序正在消退，取而代之的是“以中美关系为核心的多极秩序”（原文用 multipolar order）。' },
  { id: 'b8', k: 'k2024c', theme: 'bipolar', type: '原话', text: '中美现在的确在创造一个历史，大国战略竞争居然能在不发生战争的条件下进行竞争，在人类历史上很少有。' },
  { id: 'b9', k: 'k2024d', theme: 'bipolar', type: '转述', text: '中美竞争加剧的趋势短期难改，未来五年中美关系发生重大利好改变的可能性不大；双方的核心是管理竞争、防止竞争升级为战争。' },
  { id: 'b10', k: 'k2025e', theme: 'bipolar', type: '转述', text: '预测到 2035 年中美两极格局不可逆转但竞争方式更趋务实；特朗普第二任期后竞争可能依旧激烈，但中美有可能建立新的竞争管理机制，形成长期稳定且无战争的竞争态势。' },
  { id: 'b11', k: 'k2026c', theme: 'bipolar', type: '原话', text: '如果我们将“和平共处”定义为中美之间不发生战争，那么中美已经长期处于“和平共处”的状态。' },

  // —— 台海与周边安全 ——
  { id: 's1', k: 'k2008', theme: 'strait', type: '原话', text: '2000年陈水扁上台后，我一直预测台海发生军事冲突不会晚于2008年。然而，2008年台湾举行的“入联公投”和领导人选举，不但没有引发军事冲突，反而伴随的是更加稳定的和平前景。在此，我先要为我预测的不正确向读者道歉' },
  { id: 's2', k: 'k2008', theme: 'strait', type: '转述', text: '认为台海长期和平始于 1979 年大陆宣布和平统一政策，深层原因是以经济建设为中心的政治原则，而非 2008 年台湾地区领导人选举结果。' },
  { id: 's3', k: 'k2013a', theme: 'strait', type: '转述', text: '对中日关系不悲观，认为两国发生战争的可能性不大，共同利益终将促使双方建立合作关系。' },
  { id: 's4', k: 'k2017', theme: 'strait', type: '原话', text: '考虑到特朗普对现状造成的威胁，台海战争的可能性非常大。' },
  { id: 's5', k: 'k2023b', theme: 'strait', type: '原话', text: '远交近攻思维显然不符合当前实际情况，我个人认为当下需要的是睦邻友好策略。能否下决心将周边外交置于外交工作的首位, 这需要重大的外交改革。' },
  { id: 's6', k: 'k2024b', theme: 'strait', type: '转述', text: '在逆全球化形势下东亚相对和平，但未来一年须警惕东亚形成类似北约的多边军事同盟。' },
  { id: 's7', k: 'k2024e', theme: 'strait', type: '转述', text: '判断特朗普第二任期中美代理人战争可能性低，台海冲突与特朗普“战争无助于巩固美国主导地位”的信念不符（英译稿）。' },
  { id: 's8', k: 'k2026c', theme: 'strait', type: '转述', text: '强调台湾问题是中美关系中不可逾越的红线，中美元首会晤有助于管控台海风险。' },
  { id: 's9', k: 'k2026d', theme: 'strait', type: '转述', text: '2026 年 5—6 月访问韩国、越南，与两国及东盟人士就国际秩序演变、中美技术竞争、区域合作与双边关系交换意见（官网报道）。' },

  // —— 科技竞争与数字时代 ——
  { id: 't1', k: 'k2020a', theme: 'tech', type: '原话', text: '选择性“脱钩”将是美国的既定对华战略。' },
  { id: 't2', k: 'k2020a', theme: 'tech', type: '原话', text: '任何技术进步都改变不了国际关系的本质。' },
  { id: 't3', k: 'k2020c', theme: 'tech', type: '转述', text: '数字时代的中美竞争由技术优势而非意识形态驱动，代理人战争将更少，多数国家会在不同议题上对中美选择性对冲，竞争格局可能持续 20 年以上。' },
  { id: 't4', k: 'k2024e', theme: 'tech', type: '转述', text: '特朗普第二任期美国对华竞争核心仍是防止中美技术差距缩小，官方沟通渠道将少于拜登时期；中美竞争还将延伸为国内政府改革效率之争（英译稿）。' },
  { id: 't5', k: 'k2025a', theme: 'tech', type: '原话', text: '上台后，特朗普可能不再区分技术和贸易领域，在继续打‘贸易战’的同时，对技术合作也会采取更严格的限制措施。' },
  { id: 't6', k: 'k2026c', theme: 'tech', type: '原话', text: '当下中美战略竞争的核心是数字技术创新优势，技术在综合国力中的权重将不断上升。' },
  { id: 't7', k: 'k2026b', theme: 'tech', type: '转述', text: '预测到 2035 年中美网络空间竞争常态化并可能超过物理领域竞争，两国或以双边谈判为主、多边为辅制定网络与 AI/AGI 规范，路径类似美苏推动核不扩散。' },

  // —— 全球治理与国际秩序 ——
  { id: 'o1', k: 'k2018', theme: 'order', type: '转述', text: '中美两极化很可能终结经济领域以外的持续多边主义：西方民族民粹主义与中国的主权原则，共同压缩自由国际主义式政治整合与规范制定的空间。' },
  { id: 'o2', k: 'k2020b', theme: 'order', type: '原话', text: '中国原本就没有全球领导力，一个不存在的领导力就不存在削弱和没削弱的问题。' },
  { id: 'o3', k: 'k2022b', theme: 'order', type: '转述', text: '俄乌战争使中国陷入战略两难：扰乱贸易、加剧东亚紧张并在国内制造亲俄/反俄分化，但北京认为加入谴责俄罗斯无所获，须维持平衡。' },
  { id: 'o4', k: 'k2023b', theme: 'order', type: '原话', text: '当前的事实表明俄乌冲突给我国带来的危害比我当时预测的还大。' },
  { id: 'o5', k: 'k2023b', theme: 'order', type: '原话', text: '逆全球化趋势之所以阻止不了，其原因是缺乏全球化的领导力量。' },
  { id: 'o6', k: 'k2024c', theme: 'order', type: '原话', text: '俄乌冲突一年之内结束不了' },
  { id: 'o7', k: 'k2025b', theme: 'order', type: '原话', text: '特朗普曾宣称能快速结束俄乌战争，但实际介入后也意识到，美国无法决定战争的结束时间与条件，停火条件只能由俄乌双方协商确定。' },
  { id: 'o8', k: 'k2025c', theme: 'order', type: '原话', text: '我们只能说在特朗普第二任期内，俄乌之间的这场军事冲突仍然不会在短期内解决。' },
  { id: 'o9', k: 'k2026e', theme: 'order', type: '转述', text: '国际秩序正由全球化转向逆全球化，形成难以参照历史经验的“陌生的国际秩序”。' },

  // —— 中国外交战略 ——
  { id: 'd1', k: 'k2020b', theme: 'diplomacy', type: '原话', text: '没有外交风度，是外交职业能力不强的表现。' },
  { id: 'd2', k: 'k2020b', theme: 'diplomacy', type: '原话', text: '我们外交需要改善的方面不是细致，而是理性，防止情绪的影响。' },
  { id: 'd3', k: 'k2017', theme: 'diplomacy', type: '转述', text: '建议中国结束长期避免正式结盟的政策，与尽可能多的邻国建立军事联盟，并以更开放的移民政策改善全球道德地位、削弱美国软实力优势。' },
  { id: 'd4', k: 'k2021', theme: 'diplomacy', type: '转述', text: '判断疫情后解放军使命仍是威慑而非扩张，北京将继续拒绝军事同盟。' },
  { id: 'd5', k: 'k2025c', theme: 'diplomacy', type: '原话', text: '我们应该把单方面免签的经验推广到更多领域。' },
  { id: 'd6', k: 'k2026c', theme: 'diplomacy', type: '原话', text: '战略竞争对手也不应放弃对话的方式，因为以外交对话方式解决冲突是最为可取的方法，争取和平共处是应对现实国际冲突的基础目标。' },

  // —— 科学方法与国际关系预测 ——
  { id: 'e1', k: 'k2024a', theme: 'method', type: '原话', text: '根据现有的检验，这本书（《历史的惯性》）所做预测的准确率是82.3%，如果让我打分，那我就稍低一点，打80分' },
  { id: 'e2', k: 'k2024a', theme: 'method', type: '原话', text: '社会上对国际关系研究有一个误解，认为国关研究只能做‘马后炮’，但其实不是，只要是科学知识就一定有预测功能。' },
  { id: 'e3', k: 'k2024a', theme: 'method', type: '转述', text: '以天气预报为样板：准确率 65% 说明方法科学、75% 具参考价值、85% 具使用价值；新一轮十年预测前五年用惯性预测、后五年用折点预测。' },
  { id: 'e4', k: 'k2023b', theme: 'method', type: '转述', text: '以 2023 年现实检验书中预测，称错误率不到 20%；最大意外是自由主义价值观衰落与民粹主义兴起，因而误判 2023 年自由主义国际规范仍居主流、东亚国家会坚持中美对冲。' },
  { id: 'e5', k: 'k2022a', theme: 'method', type: '转述', text: '认为不少 00 后大学生以“居高临下”心态看待他国、以“愿望思维”看待国际事务并倾向中外两分，建议教学结合时事、历史比较，帮助学生认识世界多样性（主办方整理稿）。' },
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

export const FEATURED = ['m2', 'b5', 'b8', 's1', 't2', 'o2', 'd1', 'e1'];

export const THEME_LINKS = {
  moral: [{ to: '/realism', label: '现实主义' }, { to: '/constructivism', label: '建构主义（对照）' }],
  bipolar: [{ to: '/thucydides', label: '修昔底德陷阱' }, { to: '/benchmark', label: '中美对标' }, { to: '/gametheory', label: '博弈论' }],
  strait: [{ to: '/straits', label: '台海' }, { to: '/regional', label: '周边' }],
  tech: [{ to: '/tech-policy', label: '科技政策' }, { to: '/semiconductor', label: '半导体' }, { to: '/digital', label: '数字经济' }],
  order: [{ to: '/bri', label: '一带一路' }, { to: '/inst-open', label: '制度型开放' }],
  diplomacy: [{ to: '/diplomacy', label: '外交' }, { to: '/powerlogic', label: '权力逻辑' }],
  method: [{ to: '/gametheory', label: '博弈论' }, { to: '/realism', label: '现实主义' }],
};

export const THEME_INTRO = {
  moral: '道义现实主义把“政治领导”设为核心自变量、把实力地位视为相对稳定的结构常量，以“对内负责、对外讲信誉”为道义标准划分领导类型；2023 年后其研究转向把领导力作为因变量，并在 2026 年论文中系统回应批评。',
  bipolar: '从 2013 年预言“2023 年中美两极”，到 2019 年宣布“两极格局形成”、2025 年《历史的拐点》延伸至 2035 年，其主线是“两极不等于冷战”：竞争激烈、意识形态弱化、核威慑与管控机制使直接战争风险低。',
  strait: '台海判断是其预测记录中争议最大的一环：2000—2008 年预言冲突并于 2008 年公开致歉，2017 年再称特朗普时期台海战争可能性“非常大”；近年转为强调周边外交优先、警惕“亚太版北约”与台湾问题红线。',
  tech: '自 2019—2020 年提出“数字时代两极竞争”框架，认为中美竞争核心是数字技术创新与标准之争，美国将长期推行选择性脱钩；近年延伸至网络空间与 AI/AGI 规范治理。',
  order: '认为冷战后全球化已转向逆全球化，缺乏领导力量使全球治理倒退；对俄乌冲突持续性的多次短期判断与事实走势一致，并以“不安的和平”“陌生的国际秩序”概括当下秩序。',
  diplomacy: '外交主张兼具现实主义与改革取向：早年主张结盟、提升道德地位，2020 年公开强调外交风度与理性，近年主张周边外交置于首位、在逆全球化中扩大单边开放。',
  method: '长期倡导国际关系科学方法与可检验预测：主持对《历史的惯性》的十年复盘（自报准确率 82.3%），并以天气预报为准确率参照系；其教学发言亦引发关于青年国际观的公共讨论。',
};

// ============================================================================
// 预判检验台账：只收可被事实检验的前瞻性表述；对照截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '2013-07', venue: '《历史的惯性》（官网概括）',
    claim: '至 2023 年英国退出欧盟',
    check: '2016-06-23 英国公投决定脱欧，2020-01-31 正式退出欧盟，在 2023 年窗口内兑现。',
    dataSrc: '英国政府、欧盟理事会公告',
  },
  {
    id: 'L2', status: 'done', type: '转述', date: '2013-07', venue: '《历史的惯性》（官网概括）',
    claim: '至 2023 年印度与中国实力差距拉大',
    check: '按现价美元 GDP：中国 2013 年约 9.74 万亿、2023 年约 18.27 万亿；印度 2013 年约 1.86 万亿、2023 年约 3.4—3.6 万亿（WDI 不同版本）。差距由约 7.9 万亿扩至约 14.7 万亿美元。',
    dataSrc: '世界银行 WDI（FRED 2025-07 版中国序列；印度取 WDI 公开表）',
  },
  {
    id: 'L3', status: 'done', type: '转述', date: '2013-07', venue: '《历史的惯性》（官网概括）',
    claim: '至 2023 年中国成为超级大国、世界形成中美两极格局',
    check: '硬指标口径下兑现：2023 年中国 GDP 约 18.3 万亿美元、军费约 2960 亿美元（SIPRI 估算），均居世界第二且与第三名差距明显。但“超级大国/两极”属定性判断，中国官方仍表述为“多极化”，王缉思等主张“两强”而非两极（见争议），本条仅按硬指标归类。',
    dataSrc: '世界银行 WDI；SIPRI《2023 年世界军费趋势》',
  },
  {
    id: 'L4', status: 'failed', type: '原话', date: '2008-06-11', venue: '《环球时报》署名文章（自述）',
    url: 'https://www.tsinghua.org.cn/info/1014/8995.htm',
    claim: '2000年陈水扁上台后，我一直预测台海发生军事冲突不会晚于2008年。',
    check: '2008 年台海未发生军事冲突；本人于 2008-06-11 撰文公开承认预测错误并致歉。',
    dataSrc: '环球时报 2008-06-11（清华校友总会转载报道）',
  },
  {
    id: 'L5', status: 'failed', type: '原话', date: '2017-01-25', venue: '《纽约时报》评论（中文网译文）',
    url: 'https://cn.nytimes.com/opinion/20170126/china-can-thrive-in-the-trump-era/',
    claim: '考虑到特朗普对现状造成的威胁，台海战争的可能性非常大。',
    check: '特朗普第一任期（2017-01 至 2021-01）台海未发生战争或直接军事冲突。',
    dataSrc: '公开时序（无战事记录）',
  },
  {
    id: 'L6', status: 'done', type: '原话', date: '2017-01-25', venue: '《纽约时报》评论（中文网译文）',
    url: 'https://cn.nytimes.com/opinion/20170126/china-can-thrive-in-the-trump-era/',
    claim: '特朗普当政期间，中美关系不可避免地会恶化。',
    check: '2018 年美方依 301 调查对华加征关税、中方反制，贸易战爆发；2020 年双方互关领馆，关系在特朗普第一任期内显著恶化。',
    dataSrc: '美国贸易代表办公室 301 关税公告；中国外交部',
  },
  {
    id: 'L7', status: 'failed', type: '转述', date: '2013-07', venue: '《历史的惯性》（本人 2023-12 复盘）',
    claim: '至 2023 年自由主义国际规范仍是主流',
    check: '本人在 2023-12 澎湃专访中承认此为最大误判：自由贸易与人权规范已大大弱化，美国成为破坏自由主义国际规范的主力。',
    dataSrc: '澎湃新闻年终专访 2023-12-29',
  },
  {
    id: 'L8', status: 'failed', type: '转述', date: '2013-07', venue: '《历史的惯性》（本人 2023-12 复盘）',
    claim: '东亚国家将坚持在中美之间采取对冲战略',
    check: '本人承认误判：以韩国 2021 年宣布与美国为“经济安全同盟”、参与“芯片四方”合作为例，“经济靠中国、安全靠美国”的平衡被打破。',
    dataSrc: '澎湃新闻年终专访 2023-12-29',
  },
  {
    id: 'L9', status: 'done', type: '原话', date: '2024-07-05', venue: '北京日报客户端专访',
    url: 'https://news.bjd.com.cn/2024/07/05/10826068.shtml',
    claim: '俄乌冲突一年之内结束不了',
    check: '至 2025-07 冲突仍在持续；截至 2026-09-28 仍无全面停火，9 月下旬各方仍在讨论能源设施互停与阿联酋三方技术会谈。',
    dataSrc: '北京日报客户端 2025-06-30；新浪财经 2026-09-25；腾讯新闻 2026-09-26',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2025-06-30', venue: '北京日报客户端专访',
    url: 'https://news.bjd.com.cn/2025/06/30/11217245.shtml',
    claim: '我们只能说在特朗普第二任期内，俄乌之间的这场军事冲突仍然不会在短期内解决。',
    check: '检验窗口至 2029-01。截至 2026-09-28 冲突未停火，走势与判断一致，但窗口未到期。',
    dataSrc: '新浪财经 2026-09-25；腾讯新闻 2026-09-26',
  },
  {
    id: 'L11', status: 'open', type: '原话', date: '2013-12-09', venue: '与米尔斯海默对话（环球时报）',
    url: 'https://www.chinanews.com.cn/mil/2013/12-09/5594125.shtml',
    claim: '中国之所以不会与美国发生直接战争，一是因为核武器……二是因为全球化。',
    check: '长期判断。截至 2026-09 中美未发生直接军事冲突；2025 年釜山元首会晤、2026-05-13 至 15 特朗普国事访问维持了高层接触。“全球化”这一机制前提已被其本人改述为“逆全球化”，理由部分变化。',
    dataSrc: '中国外交部公告；澎湃新闻 2026-05-12',
  },
  {
    id: 'L12', status: 'open', type: '转述', date: '2024-11-28', venue: '2024 搜狐财经峰会（英译稿）',
    claim: '特朗普第二任期中美官方沟通渠道将少于拜登时期',
    check: '2025 年起中美经贸团队在日内瓦、伦敦等地多轮磋商，2025 年釜山元首会晤，2026-05 特朗普访华；但“渠道数量”缺乏可比统计，且任期未满，暂难闭环。',
    dataSrc: '北京日报客户端 2025-06-30；澎湃新闻 2026-05-12',
  },
  {
    id: 'L13', status: 'open', type: '转述', date: '2025-06-30', venue: '北京日报客户端专访',
    claim: '在特朗普任期内中美贸易冲突将持续不断',
    check: '检验窗口至 2029-01。2025 年双方多轮加征关税与反制，谈判达成阶段性安排后摩擦仍在。',
    dataSrc: '北京日报客户端 2025-06-30；澎湃新闻 2026-05-12',
  },
  {
    id: 'L14', status: 'open', type: '转述', date: '2025-12', venue: '《历史的拐点》',
    claim: '到 2035 年中美两极格局不可逆转，并可能形成长期稳定且无战争的竞争管理机制',
    check: '检验窗口至 2035 年，暂无可闭环数据；书中另列近期（2025—2028/2029）分段预测，可随年份逐项检验。',
    dataSrc: '中信出版集团出版方简介；清华 CISS 摘要',
  },
];

// 其公开数字多为学术判断或自评准确率，缺乏与官方统计口径一致的可比项，故不做数字偏离对照
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '道义现实主义', '两极格局', '数字竞争', '周边与台海', '外交与预测'],
  nodes: [
    { id: 'core', name: '道义现实主义\n政治领导决定', cat: 0, size: 58 },
    { id: 'dual', name: '双变量：实力 + 领导', cat: 1, size: 32 },
    { id: 'leader', name: '领导类型划分', cat: 1, size: 30 },
    { id: 'cred', name: '战略信誉 · 对内负责', cat: 1, size: 28 },
    { id: 'decision', name: '决策者范式', cat: 1, size: 28 },
    { id: 'bipolar', name: '中美两极', cat: 2, size: 40 },
    { id: 'nocold', name: '两极 ≠ 冷战', cat: 2, size: 30 },
    { id: 'uneasy', name: '不安的和平', cat: 2, size: 30 },
    { id: 'nowar', name: '无战争竞争 · 管控机制', cat: 2, size: 30 },
    { id: 'digital', name: '数字时代', cat: 3, size: 32 },
    { id: 'techedge', name: '技术优势之争', cat: 3, size: 28 },
    { id: 'decouple', name: '选择性脱钩', cat: 3, size: 26 },
    { id: 'cyber', name: '网络空间 / AI 规范', cat: 3, size: 26 },
    { id: 'strait', name: '台海预测', cat: 4, size: 28 },
    { id: 'neighbor', name: '周边外交首位', cat: 4, size: 26 },
    { id: 'hedge', name: '东亚对冲', cat: 4, size: 24 },
    { id: 'grace', name: '外交风度 · 理性', cat: 5, size: 26 },
    { id: 'open', name: '逆全球化中的开放', cat: 5, size: 28 },
    { id: 'predict', name: '惯性预测 · 可检验', cat: 5, size: 32 },
  ],
  links: [
    ['core', 'dual'], ['core', 'leader'], ['core', 'cred'], ['core', 'decision'], ['core', 'bipolar'],
    ['dual', 'bipolar'], ['bipolar', 'nocold'], ['bipolar', 'uneasy'], ['uneasy', 'nowar'],
    ['bipolar', 'digital'], ['digital', 'techedge'], ['techedge', 'decouple'], ['digital', 'cyber'], ['nowar', 'cyber'],
    ['core', 'predict'], ['decision', 'predict'], ['predict', 'strait'], ['strait', 'neighbor'], ['neighbor', 'hedge'], ['hedge', 'bipolar'],
    ['cred', 'grace'], ['leader', 'open'], ['grace', 'open'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '道义现实主义中“道义”的界定',
    sides: [
      { who: '阎学通（《世界经济与政治》2026 年第 1 期）', view: '该理论的自变量是政治领导而非道义，道义只是划分领导类型的标准；其战略建议是实证的而非规范的，解释范围不限于中国。' },
      { who: '秦亚青（外交学院，关系理论/过程建构主义）', view: '转述：2014 年在 CJIP 第 3 期撰文称其“道义”界定不清甚至误导，把盟友间战略信誉等同于道义，实质仍以国家利益界定道德（据维基百科“道义现实主义”条目转述，原文未直接核阅）。' },
    ],
    note: '另有何凯、张锋、Mario Telò、Deborah Welch Larson 等在 2023 年 Bristol 版论文集中与其辩论；徐进、张锋等亦有专文讨论。本站不对理论优劣作判断。',
  },
  {
    id: 'x2',
    title: '“两极格局”还是“两强并立”：中美关系的格局定性',
    sides: [
      { who: '阎学通（《现代国际关系》2020 年第 1 期；澎湃 2023-12-29）', view: '2019 年世界两极格局形成；只要仅有两个超级大国，两极就是客观现实，而两极格局不等于冷战。' },
      { who: '王缉思（北京大学，《当代美国评论》2022 年第 1 期专访）', view: '原话：由于其他国家和中美之间的差距越来越大，未来可能演变成“两强”并立的世界格局，但是不会出现冷战期间那样的两个阵营。另以“热和平”概括中美关系，2023-12 称“中美尚未进入冷战”（北大国际战略研究院刊文）。' },
    ],
    note: '分歧主要在“极”的定义（实力分布 vs 是否形成阵营）。中国官方长期表述为“多极化”；阎学通本人在 2021 年 Foreign Affairs 文章中亦使用“以中美关系为核心的多极秩序”措辞，口径随语境不同。',
  },
  {
    id: 'x3',
    title: '中美是否会走向战争：道义现实主义 vs 进攻性现实主义',
    sides: [
      { who: '阎学通（2013-12 与米尔斯海默对话）', view: '核武器与全球化使中美不会发生直接战争；中国不一定走美国的道路。' },
      { who: '米尔斯海默（芝加哥大学，同场对话）', view: '转述：美国战略重心转移旨在遏制中国，中美战争很难避免，可能因台湾或朝鲜半岛问题兵戎相见。' },
    ],
    note: '双方观点均出自环球时报整理、中新网 2013-12-09 转载的同场对话节选。截至 2026-09 中美未发生直接军事冲突，但该争议属长期判断，见台账 L11。',
  },
  {
    id: 'x4',
    title: '对外交风格与青年国际观的公开批评及其反响',
    sides: [
      { who: '阎学通（财新 2020-04-30；教学共同体年会 2022-01）', view: '外交应讲风度、以理服人、防止情绪影响；并称部分 00 后大学生以“居高临下”“愿望思维”看待国际事务。' },
      { who: '网络舆论与评论', view: '2020 年相关言论被部分境外媒体援引为对“战狼式”外交的批评；其教学发言在社交平台引发争论，部分网民对其提出指责（世界论坛网 2022-01-24 转载评论所述）。' },
    ],
    note: '本站仅收录其原始采访与主办方整理文本；境外媒体对其“与当局决裂”等政治化解读不收录。不对当事人作人身评价。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '“现任清华大学国际关系研究院院长”说法', status: '更正', reason: '2024 年起为名誉院长；官网领导成员页与 2024-10 院长致辞显示院长为孙学峰。' },
  { id: 'q2', item: '“现任《国际政治科学》主编”说法', status: '更正', reason: '其为 2005—2018 年创刊主编；2018-09-08 换届后孙学峰任主编，2025 年该刊署其为学术顾问。' },
  { id: 'q3', item: '院长卸任的具体日期', status: '〔存疑〕', reason: '2024-07 媒体仍称院长，2024-10 官网已为名誉院长，未见正式任免公告。' },
  { id: 'q4', item: '1992—2000 年在中国现代国际关系研究所的具体职务', status: '〔存疑〕', reason: '仅见美国之音称“研究员、副主任”，未见官方来源。' },
  { id: 'q5', item: '《历史的惯性》预测条目数', status: '并陈', reason: '2023-12 澎湃专访称“188 项预测”错误率不到 20%；2024-01 研讨会复盘称共 298 项、296 项可判定、243.5 项正确（82.3%）。' },
  { id: 'q6', item: '《中国国家利益分析》《世界权力的转移》出版年', status: '并陈', reason: '前者 1996（书目/官网列表）与 1997-08（官网正文）；后者 2015-09（官网/书目）与 2016（维基百科）。' },
  { id: 'q7', item: '官网所称“成功预测 1999 年李登辉公开台独、2000/2004 年陈水扁当选、2016 年蔡英文当选”', status: '未检验', reason: '仅见机构简介自述，未检索到当年预测原文，暂不入台账。' },
  { id: 'q8', item: '世界和平论坛职务口径', status: '并陈', reason: '官网简介为秘书长（2012—2023）；新京报 2024-07-02 称“副秘书长”。' },
  { id: 'q9', item: '网文《中国未来50年里必打的六场战争》', status: '不收录', reason: '2013 年网络流传文章，作者不明，检索未见阎学通署名或本人引述，与其“中美直接战争风险低”的公开立场相左；列此防混淆。' },
  { id: 'q10', item: '无主办方、无日期的自媒体“阎学通最新演讲/预言”转载', status: '不收录', reason: '检索未发现系统性托名伪作，但对不可追溯至主办方或主流媒体原文的拼接稿一律不收录。' },
  { id: 'q11', item: '境外媒体（大纪元、独立中文笔会等）对其言论的政治化解读', status: '不收录', reason: '仅采信财新、澎湃等原始采访文本，不收录二手评论所附加的动机推断。' },
  { id: 'q12', item: '美国之音对《纽约时报》评论的中文转述', status: '以官方为准', reason: '引文以纽约时报中文网译文为准。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
