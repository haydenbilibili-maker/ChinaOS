// ============================================================================
// 学者专栏 · 贺雪峰 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 其文章大量经“新乡土”公众号首发、再由红歌会网/昆仑策/爱思想等转载，转载页一律降为 reprint；
// 自媒体改题拼接的“贺雪峰说”类稿件未见署名原文者一律不收录。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  urban: { label: '城市化与农民工', color: '#22d3ee' },
  land: { label: '土地制度', color: '#c41e3a' },
  county: { label: '县域 · 房地产与教育', color: '#e8a317' },
  revival: { label: '乡村振兴与“保底”', color: '#10b981' },
  governance: { label: '基层治理', color: '#8b5cf6' },
  aging: { label: '农村养老与社会政策', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '贺雪峰',
  born: '1968 年 6 月 · 湖北荆门',
  summary:
    '黄冈师范专科学校毕业后在荆门任中学教师，1993 年入华中师范大学师从张厚安攻读政治学硕士；毕业后任教于荆门市委党校、荆门职业技术学院，2001 年调入华中师范大学中国农村问题研究中心，2002 年破格晋升教授。2004 年底与吴毅、董磊明等创办华中科技大学中国乡村治理研究中心，2017 年底转任武汉大学并创办武汉大学中国乡村治理研究中心。长期组织团队驻村调研，主张“田野的灵感、野性的思维、直白的文风”，被学界称为“华中乡土派”代表人物；议题覆盖村治、土地制度、城市化道路、县域城镇化、乡村振兴与农村养老。',
  current: [
    '武汉大学社会学院院长、教授、博士生导师',
    '武汉大学中国乡村治理研究中心主任',
    '教育部“长江学者”特聘教授（2015 年入选）',
    '中信改革发展研究基金会资深研究员、湖北省深改组专家组成员',
  ],
  sources: '武汉大学社会学院官网（院长致辞、2026-01 新书快讯）；长江日报 2021-01 专访；爱思想作者页；本人《我的学术小传》（《关东学刊》2019 年第 2 期，转载稿）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 5,
  subtitle: '人物履历 · 城乡关系 · 地权论争 · 县域城镇化 · 乡村振兴 · 预判检验',
  span: '2003—2026',
  careerTitle: '履历时间线 · 荆门 → 华中师大 → 华中科大 → 武汉大学',
  defaultTheme: 'urban',
  moduleId: 'scholarHeXuefeng',
  sourceNote: '著作原书 / 高校官网 / 署名文章（新乡土、观察者网专栏）/ 主流媒体专访 · 对照数据：国家统计局（统计公报、农民工监测调查报告）、财政部、中央一号文件',
};

export const CAREER_GROUPS = {
  jm: { label: '荆门', color: '#94a3b8' },
  ccnu: { label: '华中师范大学', color: '#e8a317' },
  hust: { label: '华中科技大学', color: '#22d3ee' },
  whu: { label: '武汉大学', color: '#c41e3a' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '荆门中学教师', org: '荆门', start: 1989.6, end: 1992.7, group: 'jm', note: '本人自述：1987—1989 年黄冈师专生物科，毕业回荆门任教，1992 年赴湖北教育学院进修' },
  { id: 'c2', role: '华中师范大学科学社会主义研究所 政治学硕士研究生（导师张厚安）', org: '武汉', start: 1993.7, end: 1996.6, group: 'ccnu', note: '毕业年份按学制推算〔存疑〕' },
  { id: 'c3', role: '荆门市委党校、荆门职业技术学院教师', org: '荆门', start: 1996.6, end: 2001.9, group: 'jm', note: '维基百科载荆门职院 1996—2001；党校任职起止未核〔存疑〕' },
  { id: 'c4', role: '华中师范大学中国农村问题研究中心（2002 年破格晋升教授）', org: '武汉', start: 2001.9, end: 2004.9, group: 'ccnu', note: '本人自述“2001 年底调入”' },
  { id: 'c5', role: '华中科技大学中国乡村治理研究中心 创办人、主任', org: '武汉', start: 2004.9, end: 2017.9, group: 'hust', note: '本人自述“2004 年底”调入' },
  { id: 'c6', role: '武汉大学社会学系主任 → 社会学院院长；中国乡村治理研究中心主任', org: '武汉', start: 2017.9, end: 2026.75, group: 'whu', note: '2017 年底任系主任；改设学院及出任院长的具体时间未核〔存疑〕' },
];

export const BOOKS = [
  { id: 'b1', year: 2003, title: '新乡土中国', publisher: '广西师范大学出版社', themes: ['governance', 'revival'], verified: 'primary', note: '北京大学出版社修订版简介载明初版 2003 年由广西师大出版' },
  { id: 'b2', year: 2013, title: '新乡土中国（修订版）', publisher: '北京大学出版社', date: '2013-09', isbn: '9787301227213', themes: ['governance', 'revival'], verified: 'primary', note: '出版月份书目记录有 2013-09 与 2013-10 两说' },
  { id: 'b3', year: 2010, title: '地权的逻辑：中国农村土地制度向何处去', publisher: '中国政法大学出版社', date: '2010-10', isbn: '9787562037002', themes: ['land'], verified: 'primary', note: '第六章为“成都模式批判”，引发与周其仁论争' },
  { id: 'b4', year: 2013, title: '地权的逻辑Ⅱ：地权变革的真相与谬误', publisher: '东方出版社', date: '2013-05', isbn: '9787506062541', themes: ['land'], verified: 'primary' },
  { id: 'b5', year: 2013, title: '小农立场', publisher: '中国政法大学出版社', date: '2013-06', isbn: '9787562047483', themes: ['revival', 'urban'], verified: 'primary' },
  { id: 'b6', year: 2014, title: '城市化的中国道路', publisher: '东方出版社', date: '2014-07', isbn: '9787506074520', themes: ['urban', 'land'], verified: 'primary', note: '另有书目记 2014-06' },
  { id: 'b7', year: 2017, title: '治村', publisher: '北京大学出版社', date: '2017-05', isbn: '9787301281185', themes: ['governance'], verified: 'primary' },
  { id: 'b8', year: 2017, title: '最后一公里村庄', publisher: '中信出版社', date: '2017-07', isbn: '9787508672083', themes: ['governance', 'revival'], verified: 'primary', note: '豆瓣记 2017-09' },
  { id: 'b9', year: 2017, title: '南北中国：中国农村区域差异研究', publisher: '社会科学文献出版社', date: '2017-12', isbn: '9787520115575', coauthors: '等（合著）', themes: ['governance'], verified: 'primary' },
  { id: 'b10', year: 2018, title: '地权的逻辑Ⅲ：为什么说中国土地制度是全世界最先进的', publisher: '中国政法大学出版社', date: '2018-06', isbn: '7562082685', coauthors: '桂华、夏柱智', themes: ['land'], verified: 'primary', note: '本人小传称 2017 年出版，豆瓣记 2018-06，并陈' },
  { id: 'b11', year: 2019, title: '大国之基：中国乡村振兴诸问题', publisher: '东方出版社', date: '2019-10', isbn: '9787520711203', themes: ['revival', 'governance', 'land'], verified: 'primary' },
  { id: 'b12', year: 2024, title: '乡村的视角：乡村振兴与共同富裕若干问题解读', publisher: '大有书局', date: '2024-01', isbn: '9787807721451', themes: ['revival', 'county', 'aging'], verified: 'primary' },
  { id: 'b13', year: 2026, title: '大国小农：城市化进程中的农民', publisher: '中国人民大学出版社', date: '2026-01', isbn: '9787300315393', themes: ['urban', 'aging', 'revival'], verified: 'primary', note: '武汉大学社会学院官网 2026-01 书讯' },
];

/** 讲话 / 采访 / 署名文章 / 著作文库 */
export const CORPUS = [
  { id: 'k2010', date: '2010-10', form: '著作', venue: '《地权的逻辑》结语 · 土地不能私有化', source: '中国政法大学出版社（中国经济史论坛转载结语）', url: 'http://economy.guoxue.com/?p=1054', verified: 'primary', themes: ['land'] },
  { id: 'k2011', date: '2011-02-16', form: '采访', venue: '《经济参考报》专访 · 城乡二元结构', source: '经济参考报', url: 'https://www.jjckb.cn/2011-02/16/content_287957.htm', verified: 'media', themes: ['urban'] },
  { id: 'k2013a', date: '2013-04-16', form: '著作', venue: '《新乡土中国》修订版自序', source: '北京大学出版社（三农中国/红色文化网转载）', url: 'https://www.hswh.org.cn/wzzx/llyd/sn/2013-10-02/23110.html', verified: 'reprint', themes: ['revival', 'urban'] },
  { id: 'k2013b', date: '2013-06', form: '著作', venue: '《小农立场》前言 · 为九亿小农说话', source: '中国政法大学出版社', url: 'https://www.hswh.org.cn/wzzx/llyd/sn/2013-06-24/21478.html', verified: 'primary', themes: ['revival'] },
  { id: 'k2013c', date: '2013-07-13', form: '署名文章', venue: '破除“还权赋能”的迷信——与周其仁商榷', source: '三农中国（红色文化网转载）', url: 'https://m1.hswh.org.cn/wzzx/llyd/sn/2013-07-13/21780.html', verified: 'reprint', themes: ['land'] },
  { id: 'k2013d', date: '2013-12-02', form: '署名文章', venue: '关于中国式小农经济的几点认识', source: '爱思想转载（文末署 2013-08-17）', url: 'https://www.aisixiang.com/data/70066.html', verified: 'reprint', themes: ['urban', 'revival'] },
  { id: 'k2014a', date: '2014-03-12', form: '著作', venue: '《城市化的中国道路》自序 · 中国城市化应告别激进', source: '东方出版社（爱思想转载）', url: 'https://www.aisixiang.com/data/137568.html', verified: 'primary', themes: ['urban', 'land'] },
  { id: 'k2014b', date: '2014-09-09', form: '采访', venue: '澎湃新闻·思想市场专访 · 农民要审慎进城', source: '澎湃新闻', url: 'https://www.thepaper.cn/newsDetail_forward_1265991', verified: 'media', themes: ['urban', 'county'] },
  { id: 'k2014c', date: '2014-09-09', form: '署名文章', venue: '周其仁真不懂中国农村土地问题——就地权的逻辑答周其仁教授', source: '人民论坛网', url: 'https://theory.rmlt.com.cn/2014/0909/316620.shtml', verified: 'media', themes: ['land'] },
  { id: 'k2015a', date: '2015-03-23', form: '署名文章', venue: '让失意的农民工回得去农村', source: '环球时报（红歌会网转载）', url: 'https://www.szhgh.com/Article/news/politics/2015-03-23/79367.html', verified: 'reprint', themes: ['urban'] },
  { id: 'k2015b', date: '2015-06-08', form: '采访', venue: '周其仁、贺雪峰辩论 · 土地增值归政府还是农民', source: '新华网（人民网转载）', url: 'http://politics.people.com.cn/n/2015/0608/c70731-27121410.html', verified: 'media', themes: ['land'] },
  { id: 'k2017a', date: '2017-05', form: '著作', venue: '《治村》内容简介', source: '北京大学出版社', verified: 'primary', themes: ['governance'] },
  { id: 'k2017b', date: '2017-09-24', form: '署名文章', venue: '为什么说中国土地制度是全世界最先进的——答黄小虎先生', source: '爱思想（2017-10-09）；武汉大学环境法研究所网站转载', url: 'https://www.aisixiang.com/data/106336.html', verified: 'reprint', themes: ['land'] },
  { id: 'k2019a', date: '2019-04-15', form: '采访', venue: '长江日报“读+访谈” · 动动土地制度就能产个金娃娃？', source: '长江日报（三农中国转载）', url: 'http://www.snzg.net/article/2019/0416/article_42155.html', verified: 'reprint', themes: ['land'] },
  { id: 'k2019b', date: '2019', form: '署名文章', venue: '我的学术小传（《关东学刊》2019 年第 2 期）', source: '关东学刊（网络转载稿，夹杂无关文字）', verified: 'reprint', themes: ['governance', 'urban', 'aging'] },
  { id: 'k2020', date: '2020-09-03', form: '署名文章', venue: '农民如何城市化', source: '红歌会网转载', url: 'https://www.szhgh.com/Article/opinion/xuezhe/2020-09-03/246684.html', verified: 'reprint', themes: ['county', 'urban'] },
  { id: 'k2021a', date: '2021-04-17', form: '署名文章', venue: '县城买房：未完成的城市化', source: '爱思想转载（2021-05-14）', url: 'https://www.aisixiang.com/data/126482.html', verified: 'reprint', themes: ['county'] },
  { id: 'k2021b', date: '2021-10-02', form: '署名文章', venue: '农民进城与县域城市化的风险', source: '红歌会网转载', url: 'https://www.szhgh.com/Article/gnzs/farmer/2021-10-02/280742.html', verified: 'reprint', themes: ['county', 'urban'] },
  { id: 'k2022', date: '2022-01-05', form: '采访', venue: '进城与返乡，农民应有弹性空间', source: '澎湃号·湃客', url: 'https://www.thepaper.cn/newsDetail_forward_16120337', verified: 'reprint', themes: ['urban', 'revival'] },
  { id: 'k2024a', date: '2024-01', form: '著作', venue: '《乡村的视角》前言', source: '大有书局（今日头条转载前言）', url: 'https://www.toutiao.com/article/7327198957711999540/', verified: 'reprint', themes: ['revival'] },
  { id: 'k2024b', date: '2024-03-24', form: '署名文章', venue: '三个误区：审视乡村振兴的实践探索（摘自《乡村的视角》）', source: '新乡土公众号（昆仑策网转载）', url: 'https://kunlunce.com/klzt/tydl/2024-03-24/176438.html', verified: 'reprint', themes: ['revival', 'land'] },
  { id: 'k2024c', date: '2024-04-16', form: '署名文章', venue: '中西部县域，大城市的“脚”还是农村的“脑”？', source: '新乡土公众号；澎湃号 2024-04-16、观察者网贺雪峰专栏 2024-05-13 刊发', url: 'https://www.guancha.cn/HeXueFeng/2024_05_13_734599_2.shtml', verified: 'primary', themes: ['county', 'revival'] },
  { id: 'k2024d', date: '2024-08-24', form: '署名文章', venue: '基层形式主义背后的工作方法问题：规划院还是试验田？', source: '红歌会网转载', url: 'https://www.szhgh.com/Article/opinion/xuezhe/2024-08-24/358417.html', verified: 'reprint', themes: ['governance'] },
  { id: 'k2024e', date: '2024-08-26', form: '署名文章', venue: '乡村振兴不能目中无人', source: '红歌会网转载', url: 'https://m.szhgh.com/Article/gnzs/farmer/2024-08-26/358550.html', verified: 'reprint', themes: ['revival'] },
  { id: 'k2024f', date: '2024-11-29', form: '署名文章', venue: '应对农村老龄化的中国方案', source: '新乡土公众号（昆仑策网转载）', url: 'https://www.kunlunce.com/gcjy/zxzz111/2024-11-29/182883.html', verified: 'reprint', themes: ['aging'] },
  { id: 'k2025a', date: '2025-02-25', form: '采访', venue: '南方农村报专访 · 解读一号文件宅基地两个“不允许”', source: '南方农村报（腾讯新闻）', url: 'https://news.qq.com/rain/a/20250225A07TJE00', verified: 'media', themes: ['land'] },
  { id: 'k2025b', date: '2025', form: '论文', venue: '再论保护型城乡二元体制（《文化软实力》2025 年第 4 期）', source: '红歌会网转载（2025-10-23）', url: 'https://m.szhgh.com/Article/gnzs/farmer/2025-10-23/389395.html', verified: 'reprint', themes: ['urban', 'county'] },
  { id: 'k2025c', date: '2025', form: '论文', venue: '村社养老实践与国家的责任（《社会保障研究》2025 年第 3 期）', source: '新乡土（红歌会网转载 2025-11-09）', url: 'https://www.szhgh.com/Article/gnzs/farmer/2025-11-09/390750.html', verified: 'reprint', themes: ['aging'] },
  { id: 'k2026', date: '2026-01-22', form: '著作', venue: '《大国小农》节选 · 让富人下乡、穷人进城，将夺走农民最后一点保障', source: '凤凰网刊发节选', url: 'https://news.ifeng.com/c/8q7yYeFqe7D', verified: 'reprint', themes: ['urban', 'aging'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 城市化与农民工 ——
  { id: 'u1', k: 'k2011', theme: 'urban', type: '原话', text: '城市是活力的源泉，是发展的源泉，但农村是稳定器，是中国现代化的蓄水池。' },
  { id: 'u2', k: 'k2013d', theme: 'urban', type: '原话', text: '到目前为止，中国农民家庭的基本特征是“以代际分工为基础的半工半耕”的劳动力再生产模式，当前大约有80%农民家庭都存在年轻子女外出务工以获务工收入、年龄比较大父母留守在家务农以获取务农收入的结构。' },
  { id: 'u3', k: 'k2014a', theme: 'urban', type: '原话', text: '正是农民可以返乡，中国城市没有出现一般发展中国家都有的大规模贫民窟。' },
  { id: 'u4', k: 'k2014a', theme: 'urban', type: '转述', text: '把小农经济、集体土地制度、城乡二元结构视为中国城市化的“制度红利”而非负担，主张未来 30 年同时驱动传统农业、加工制造业和现代科技，即“三轮驱动的中国现代化道路”。' },
  { id: 'u5', k: 'k2014a', theme: 'urban', type: '原话', text: '让人忧虑的是，目前中国城市化道路似乎正被误导，正在误入歧途中。' },
  { id: 'u6', k: 'k2014b', theme: 'urban', type: '原话', text: '稳健的城镇化是中国现代化之福，激进的城镇化很可能翻车。' },
  { id: 'u7', k: 'k2014b', theme: 'urban', type: '原话', text: '农民有能力进城，就让农民进城，如果农民没能力进城，那不要催农民进城，逼农民进城。一旦进城失败，要允许农民返乡。' },
  { id: 'u9', k: 'k2019b', theme: 'urban', type: '原话', text: '2002年提出“农村是中国现代化的稳定器和劳动力的蓄水池”，2008年金融危机期间，大量农民工返乡并未造成社会普遍担忧的不稳定问题，充分证明了这个判断的正确性。' },
  { id: 'u10', k: 'k2019b', theme: 'urban', type: '转述', text: '提出“保护型城乡二元结构”：农民可以自由进城，城市资本却不能自由下乡，从而为进城失败者保留退路。' },
  { id: 'u11', k: 'k2022', theme: 'urban', type: '原话', text: '中国的城市化，最重要的是保留了农民的主体性，允许农民在城乡之间往返。' },
  { id: 'u12', k: 'k2025b', theme: 'urban', type: '原话', text: '保护型城乡二元体制既是现实制度设计，也是刻意政策安排。' },
  { id: 'u13', k: 'k2025b', theme: 'urban', type: '原话', text: '当前已有近3亿农民工进城务工经商，农户家庭第一大收入来源早就是务工收入了，真正来自农业的收入反而有限。' },
  { id: 'u14', k: 'k2026', theme: 'urban', type: '原话', text: '富人下乡、穷人进城，从统计上看，城乡居民收入差距的确可以缩小，但问题是：缺少进城能力的农民进城了，他们在城市的生存将更加艰难' },

  // —— 土地制度 ——
  { id: 'l1', k: 'k2010', theme: 'land', type: '原话', text: '一旦小产权房合法化，则城市的商品房就不再可以销售得出去，且小产权房也不再可以售出高价，因为农民可以建设出远远超出市场需求的小产权房，最终因为供过于求，农民建小产权房并没有致富，城市规划却又被破坏，土地也被滥用。' },
  { id: 'l2', k: 'k2010', theme: 'land', type: '转述', text: '书中核心命题之一：给农民更多的土地权利，其结果可能恰恰会损害农民的利益；以村社集体为主体的地权安排可避免“反公地悲剧”，反对农村土地私有化。' },
  { id: 'l3', k: 'k2013c', theme: 'land', type: '原话', text: '再过20—30年，中国城市化已经完成，根本就不再需要大规模征地了，也不再需要土地财政来建设投资极大的城市基础设施了。' },
  { id: 'l5', k: 'k2015b', theme: 'land', type: '原话', text: '城市建设用地自然增值来自于政府基础设施投资后的集聚效应，土地出让收入相当于政府成本回收，并在回收后用于新一轮公共投资建设。' },
  { id: 'l6', k: 'k2017b', theme: 'land', type: '原话', text: '我以为，现行中国土地制度是世界上最先进的土地制度，在进行土地管理法修订时，一定要保留现行土地制度的合理部分，尤其对征地制度的改动要慎之又慎，对集体经营性建设用地入市规定要慎之又慎。' },
  { id: 'l7', k: 'k2019a', theme: 'land', type: '原话', text: '我对中国的现行土地制度是非常肯定的，这是中国一个很大的优势而非劣势。' },
  { id: 'l8', k: 'k2024b', theme: 'land', type: '原话', text: '要防止当前一些地方政府在增加农民财产权的幌子下，打农民土地主意的行为。' },
  { id: 'l9', k: 'k2025a', theme: 'land', type: '原话', text: '土地能产生财富的核心不是地块本身，只有当城市建设需要占用土地时土地才值钱。' },
  { id: 'l10', k: 'k2025a', theme: 'land', type: '原话', text: '不能用看城市土地的方式去看农村土地，不能用看发达地区土地的方式去看中西部地区的土地。' },
  { id: 'l11', k: 'k2025a', theme: 'land', type: '转述', text: '支持 2025 年中央一号文件宅基地两个“不允许”：宅基地应允许“必要冗余”以保障弱势农民“返乡权”；若放开买卖，最可能变卖宅基地的恰是最弱势的农民。' },

  // —— 县域 · 房地产与教育 ——
  { id: 'c1', k: 'k2014b', theme: 'county', type: '原话', text: '我在全国调研时感觉很焦虑，因为全国的县城到处都在建“鬼城”，建大量的房子。' },
  { id: 'c2', k: 'k2020', theme: 'county', type: '原话', text: '被外出务工农民工返回县城买房所激励起来的广大中西部地区县委书记们的雄心是值得警惕的。' },
  { id: 'c3', k: 'k2020', theme: 'county', type: '转述', text: '县政府为推动农民县城购房，把高中乃至越来越多初中集中到县城，“无房不嫁”观念叠加教育进城推高县城房价，形成以农民工收入支撑的土地财政。' },
  { id: 'c4', k: 'k2021a', theme: 'county', type: '原话', text: '很可能的后果就是，缺少制造业的中西部县城现在建设越繁荣，将来命运越不堪。' },
  { id: 'c6', k: 'k2021b', theme: 'county', type: '原话', text: '农民在县城买房不是降低了农业对农民家庭的重要性，在很多时候反而增加了农业和农村对农民家庭的重要性。' },
  { id: 'c7', k: 'k2024c', theme: 'county', type: '原话', text: '结果就是，全国中西部地区县级政府普遍形成了巨额政府负债，一些地区县级政府财政收入还不够偿还政府负债利息。' },
  { id: 'c8', k: 'k2025b', theme: 'county', type: '原话', text: '前十多年中西部县域范围普遍有一轮以房地产开发为主的经济增长，本质上是以农民农业收入和外出务工收入为基础的再分配经济。' },

  // —— 乡村振兴与“保底” ——
  { id: 'r1', k: 'k2013a', theme: 'revival', type: '原话', text: '再过10年，也许是20年或30年，中国的城市已经比较强大，农村不再可能也不被需要作为中国现代化的稳定器和蓄水池发挥作用，中国因此不再是一个“捆绑在土地上的中国”了！' },
  { id: 'r2', k: 'k2013b', theme: 'revival', type: '原话', text: '小农立场，就是中国立场，就是国家立场。' },
  { id: 'r3', k: 'k2024a', theme: 'revival', type: '原话', text: '这个底线要逐步提高，却绝对不可能高到比城市更好。' },
  { id: 'r4', k: 'k2024b', theme: 'revival', type: '原话', text: '当前全国地方进行的乡村振兴实践，教训远远多于经验。' },
  { id: 'r5', k: 'k2024b', theme: 'revival', type: '转述', text: '称中国仍有 6 亿农村居民、2 亿多农户、8 亿农村户籍人口，农业要为 2 亿多农户“保底”；地方不应人为扶持规模经营主体而排斥小农户，“老人农业”将长期存在并具合理性。' },
  { id: 'r6', k: 'k2024c', theme: 'revival', type: '转述', text: '将乡村振兴分两阶段：2035 年前服务中国式现代化“突围”，农村发挥稳定器与蓄水池作用；基本实现现代化后再以国家力量建设“强富美”新乡村，2050 年全面振兴。' },
  { id: 'r7', k: 'k2024e', theme: 'revival', type: '原话', text: '乡村振兴不是要为中国现代化进程中的强势群体提供更多市场机会更好生活环境更全社会保障，而是要为作为弱势群体的农民尤其是农民中的弱势群体提供基本保障与最后退路。' },

  // —— 基层治理 ——
  { id: 'g1', k: 'k2017a', theme: 'governance', type: '转述', text: '《治村》主张在乡村政治、资源下乡、土地权利等方面依据各地实际多元探索，核心是把农民组织起来、发挥农民主体性，并警惕富人治村、贿选与“分利秩序”。' },
  { id: 'g2', k: 'k2019b', theme: 'governance', type: '原话', text: '2010年在调研中发现基层治理中出现了比较普遍的卸责行为，概括为“不出事逻辑”。' },
  { id: 'g3', k: 'k2019b', theme: 'governance', type: '转述', text: '提出基层治理“责权利不对称”原理：上级难以有效监督时，以下级“权小、利少、责大”的安排调动基层积极性。' },
  { id: 'g4', k: 'k2024d', theme: 'governance', type: '原话', text: '上面不仅千条线伸向基层而且千把刀砍向基层' },
  { id: 'g5', k: 'k2024d', theme: 'governance', type: '转述', text: '基层形式主义根源在于把战略方向机械分解为量化指标并以部门、条线和第三方考核对标，主张给一线“试验田”式因地制宜空间，而非“规划院”式指标管理。' },

  // —— 农村养老与社会政策 ——
  { id: 'a1', k: 'k2019b', theme: 'aging', type: '原话', text: '即使消费水平没有大幅度提高，也可以通过改善人际关系、提高闲暇生活质量，让农村老年人获得更高的福利水平。' },
  { id: 'a2', k: 'k2024f', theme: 'aging', type: '转述', text: '提出“不离家、不离土、不离乡”的“三不离”应对农村老龄化方案：国家重点支持村社集体建立互助养老机制，而非把农民养老对接城镇职工养老统筹。' },
  { id: 'a3', k: 'k2025c', theme: 'aging', type: '转述', text: '在“三不离”基础上以国家政策和财政支持发展村社养老，利用既有家庭与村社资源，建立“低消费、高福利”的农村养老体系。' },
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

export const FEATURED = ['u1', 'u6', 'u3', 'l9', 'c4', 'r7', 'g4', 'l1'];

export const THEME_LINKS = {
  urban: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }, { to: '/gig', label: '灵活就业' }],
  land: [{ to: '/rural', label: '乡村' }, { to: '/food-security', label: '粮食安全' }],
  county: [{ to: '/housing', label: '住房地产' }, { to: '/debt', label: '地方债务' }, { to: '/education', label: '教育' }],
  revival: [{ to: '/rural', label: '乡村' }, { to: '/socialgov', label: '社会治理' }],
  governance: [{ to: '/governance', label: '国家治理' }, { to: '/principalagent', label: '委托代理' }],
  aging: [{ to: '/silver-economy', label: '银发经济' }, { to: '/demographic', label: '人口' }],
};

export const THEME_INTRO = {
  urban: '其城市化论述以“农村是现代化的稳定器与蓄水池”为轴：以代际分工为基础的半工半耕让农户同时拥有务工与务农两笔收入，保护型城乡二元结构为进城失败者保留返乡退路，据此主张稳健而非激进的城镇化。',
  land: '土地论述集中于《地权的逻辑》三部曲：以“地利共享”“涨价归公”为宪法秩序核心，反对土地私有化、小产权房合法化与宅基地市场化，并与周其仁、文贯中等产权派长期论争。',
  county: '2014 年起持续讨论中西部县城：缺少制造业就业、以教育进城和“无房不嫁”推动农民购房、以农民工收入支撑土地财政，判断其不可持续并警示县级债务风险。',
  revival: '把乡村振兴的近期目标定为“保底”——为缺乏进城能力和可能进城失败的弱势农民提供基本保障与最后退路，而非把农村建得比城市更好，并批评各地实践中的“目中无人”。',
  governance: '村治研究是其起点：从村民自治、乡村治理的社会基础，到“不出事逻辑”“责权利不对称”“分利秩序”等概念，近年转向批评指标化考核带来的基层形式主义。',
  aging: '针对农村“未富先老”，提出“不离家、不离土、不离乡”的村社互助养老方案，以“低消费、高福利”替代高成本的城乡统筹养老对接。',
};

// ============================================================================
// 预判检验台账：只收可被数据或政策检验的前瞻性表述；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '原话', date: '2011-02-16', venue: '《经济参考报》专访（其称 2002 年即提出该判断）',
    url: 'https://www.jjckb.cn/2011-02/16/content_287957.htm',
    claim: '城市是活力的源泉，是发展的源泉，但农村是稳定器，是中国现代化的蓄水池。',
    check: '2009-02-02 陈锡文在国新办吹风会称，1.3 亿外出农民工中约 2000 万（15.3%）因金融危机失业或未找到工作而返乡；此后未出现大规模城市失业人口沉淀。属定性判断，官方未作“稳定器”专项评估，以该次冲击为主要检验样本。',
    dataSrc: '国新办 2009-02-02 新闻背景吹风会（中新网、央视网报道）',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '2010-10', venue: '《地权的逻辑》结语',
    url: 'http://economy.guoxue.com/?p=1054',
    claim: '一旦小产权房合法化，则城市的商品房就不再可以销售得出去……（反对小产权房合法化）',
    check: '至核验日小产权房未合法化：2025-01 自然资源部、农业农村部“八不准”通知及 2026 年中央一号文件均将违法违规买卖农房宅基地、“小产权房”列入严禁或严查范围。',
    dataSrc: '2026 年中央一号文件（新华社 2026-02-03）；自然资源部、农业农村部 2025-01-07 通知',
  },
  {
    id: 'L3', status: 'done', type: '转述', date: '2025-02-25', venue: '南方农村报专访',
    url: 'https://news.qq.com/rain/a/20250225A07TJE00',
    claim: '宅基地两个“不允许”应坚持，不宜放开宅基地流转',
    check: '2025-09-16 国新办发布会重申不允许城镇居民到农村购买农房、宅基地，严禁退休干部到农村占地建房；2026 年中央一号文件写入“严查严防违法违规购买农房宅基地”，政策方向延续。',
    dataSrc: '2025、2026 年中央一号文件；国新办 2025-09-16 发布会',
  },
  {
    id: 'L4', status: 'failed', type: '转述', date: '2017-09-24', venue: '答黄小虎先生（爱思想转载）',
    url: 'https://www.aisixiang.com/data/106336.html',
    claim: '反对“缩小征地范围、建立城乡统一的建设用地市场、允许集体建设用地入市”方案；入市规定要“慎之又慎”',
    check: '2019-08-26 修正的《土地管理法》（2020-01-01 施行）允许集体经营性建设用地入市；2026 年中央一号文件要求“有序推进”入市，但“严禁用于建设商品住房”。征地制度得到保留（法条列举公共利益情形），与其主张部分一致；入市这一维度与其建议相反。',
    dataSrc: '《中华人民共和国土地管理法》2019 年修正；2026 年中央一号文件',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2014-09-09', venue: '澎湃新闻专访；延续至 2020—2021 年县城系列文章',
    url: 'https://www.thepaper.cn/newsDetail_forward_1265991',
    claim: '今天县域的房地产开发明显超过了农民的需求（县城房地产以农民工收入支撑、不可持续）',
    check: '全国口径：新建商品房销售面积由 2021 年约 17.94 亿平方米降至 2025 年 8.81 亿平方米（约 -51%）；国有土地使用权出让收入由 2021 年 87051 亿元降至 2025 年 41518 亿元（约 -52%），2026 年 1—8 月再降 28.6%。县级分项无官方序列，以全国数据作代理，结论受此限制。',
    dataSrc: '国家统计局 2025 年统计公报；财政部政府性基金收支（本站经济大盘模块）',
  },
  {
    id: 'L6', status: 'open', type: '原话', date: '2021-04-17', venue: '县城买房：未完成的城市化',
    url: 'https://www.aisixiang.com/data/126482.html',
    claim: '很可能的后果就是，缺少制造业的中西部县城现在建设越繁荣，将来命运越不堪。',
    check: '远期判断，缺少中西部县城房价、空置率、县级财政的官方统一序列。70 城二手住宅价格较峰值约 -23.42%（至 2026-08），但样本不含县城。',
    dataSrc: '国家统计局 70 个大中城市住宅销售价格指数（本站住房模块测算）',
  },
  {
    id: 'L7', status: 'open', type: '原话', date: '2024-04-16', venue: '中西部县域，大城市的“脚”还是农村的“脑”？',
    url: 'https://www.guancha.cn/HeXueFeng/2024_05_13_734599_2.shtml',
    claim: '不讲条件、不惜代价推动县域经济发展和经营县城，结果可能就是不仅盘剥了农民，而且欠下巨额债务，造成县域经济破产。',
    check: '债务一端获官方确认：2023 年末全国隐性债务余额 14.3 万亿元，2024-11 起安排 6 万亿元限额置换 + 5 年 4 万亿元专项债化债，2028 年前需消化隐性债务降至 2.3 万亿元。“县域经济破产”未见发生，县级分口径债务未公布。',
    dataSrc: '财政部部长蓝佛安 2024-11-08 全国人大常委会办公厅发布会',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2013-07-13', venue: '破除“还权赋能”的迷信——与周其仁商榷',
    url: 'https://m1.hswh.org.cn/wzzx/llyd/sn/2013-07-13/21780.html',
    claim: '再过20—30年，中国城市化已经完成，根本就不再需要大规模征地了',
    check: '检验窗口 2033—2043 年。常住人口城镇化率 2025 年末 67.89%（年增 0.89 个百分点）；土地出让收入已较 2021 年峰值下降逾五成，但城镇化仍在推进。',
    dataSrc: '国家统计局 2025 年统计公报；财政部',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2013-06', venue: '《小农立场》；2024 年《乡村的视角》重申',
    claim: '小农户与“老人农业”将在未来数十年长期存在',
    check: '第三次全国农业普查：2016 年末农业经营户 20743 万户，其中规模农业经营户 398 万户；2019-02 中办国办印发《关于促进小农户和现代农业发展有机衔接的意见》。2025 年农民工中 50 岁以上占 32.0%。窗口为“数十年”，暂列未决。',
    dataSrc: '国家统计局三农普公报；中办国办 2019 年意见；2025 年农民工监测调查报告',
  },
  {
    id: 'L10', status: 'open', type: '转述', date: '2014-07', venue: '《城市化的中国道路》（据南京农业大学学报 2016 年论文引述第 109 页）',
    claim: '“半工半耕”约占农户 80% 的高比例可能还要维持 20 年甚至更长',
    check: '检验窗口至约 2034 年，且“半工半耕”农户比例无官方统计。可比指标：2025 年农民工总量 30115 万人（+0.5%），外出农民工 18006 万人，年末进城农民工 13092 万人；户籍人口城镇化率 48.3%（2023 年）。',
    dataSrc: '国家统计局 2025 年农民工监测调查报告（2026-04-30）',
  },
  {
    id: 'L11', status: 'open', type: '转述', date: '2024-04-16', venue: '中西部县域，大城市的“脚”还是农村的“脑”？',
    claim: '2035 年前乡村振兴以“保底”为主，基本实现现代化后才转向建设“强富美”新乡村',
    check: '属阶段性政策主张，检验窗口 2035 年。2026 年中央一号文件仍以“锚定农业农村现代化、扎实推进乡村全面振兴”为题，未见阶段划分表述。',
    dataSrc: '2026 年中央一号文件',
  },
  {
    id: 'L12', status: 'open', type: '转述', date: '2025', venue: '村社养老实践与国家的责任（《社会保障研究》2025 年第 3 期）',
    claim: '以国家财政支持村社互助养老，建立“三不离”农村养老体系',
    check: '至核验日未检索到以“村社养老”为主体的全国性制度安排；农村互助养老在地方层面推进。政策采纳程度待观察。',
    dataSrc: '检索截至 2026-09（中央一号文件、民政部公开文件）',
  },
];

// ============================================================================
// 数字口径对照：其公开表述 vs 官方统计（偏离 = (表述 - 官方) / 官方）
// ============================================================================
export const NUMERIC_CHECKS = [
  { id: 'n1', label: '农村人口（2013 年末）', said: 6.0, official: 6.2961, unit: '亿人', saidSrc: '2014-09-09 澎湃专访“6亿多农村人口”（取下限）', offSrc: '国家统计局：2013 年末乡村常住人口 62961 万人', comparable: true },
  { id: 'n2', label: '农村居民（2023 年末）', said: 6.0, official: 4.77, unit: '亿人', saidSrc: '2024-03 “三个误区”文：“6亿农村居民”', offSrc: '国家统计局：2023 年末乡村常住人口 47700 万人（其口径可能含户籍在乡者）', comparable: false },
  { id: 'n3', label: '农村户籍人口', said: 8.0, official: 7.29, unit: '亿人', saidSrc: '2024-03 “三个误区”文：“8亿农村户籍人口”', offSrc: '本站推算：2023 年末总人口 14.10 亿 ×（1 − 户籍城镇化率 48.3%）', comparable: false },
  { id: 'n4', label: '农户数', said: 2.0, official: 2.0743, unit: '亿户', saidSrc: '2024-03 “三个误区”文：“2亿多农户”（取下限）', offSrc: '第三次全国农业普查：2016 年末农业经营户 20743 万户', comparable: true },
  { id: 'n5', label: '农民工总量', said: 3.0, official: 2.9973, unit: '亿人', saidSrc: '2025 年《文化软实力》文：“近3亿农民工”', offSrc: '国家统计局：2024 年 29973 万人（2025 年 30115 万人）', comparable: true },
].map((n) => ({ ...n, deviation: Math.round(((n.said - n.official) / n.official) * 1000) / 10 }));

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '城乡关系', '土地制度', '基层治理', '县域与民生', '乡村振兴与养老'],
  nodes: [
    { id: 'core', name: '农村＝现代化的\n稳定器与蓄水池', cat: 0, size: 58 },
    { id: 'bgbg', name: '代际分工 · 半工半耕', cat: 1, size: 36 },
    { id: 'baohu', name: '保护型城乡二元结构', cat: 1, size: 36 },
    { id: 'fanxiang', name: '返乡权', cat: 1, size: 30 },
    { id: 'wenjian', name: '稳健城镇化', cat: 1, size: 30 },
    { id: 'sanlun', name: '三轮驱动', cat: 1, size: 24 },
    { id: 'dili', name: '地利共享 · 涨价归公', cat: 2, size: 34 },
    { id: 'antipriv', name: '反对土地私有化', cat: 2, size: 30 },
    { id: 'xcq', name: '小产权房', cat: 2, size: 24 },
    { id: 'zjd', name: '宅基地两个“不允许”', cat: 2, size: 28 },
    { id: 'bcs', name: '不出事逻辑', cat: 3, size: 26 },
    { id: 'qzl', name: '责权利不对称', cat: 3, size: 24 },
    { id: 'xszy', name: '指标治理 · 形式主义', cat: 3, size: 28 },
    { id: 'zhongjian', name: '中坚农民', cat: 3, size: 24 },
    { id: 'xcmf', name: '县城买房 · 教育进城', cat: 4, size: 32 },
    { id: 'yjsz', name: '一家三制', cat: 4, size: 26 },
    { id: 'debt', name: '县级负债', cat: 4, size: 28 },
    { id: 'baodi', name: '乡村振兴“保底”', cat: 5, size: 34 },
    { id: 'xiaonong', name: '小农立场 · 老人农业', cat: 5, size: 28 },
    { id: 'sanbuli', name: '“三不离”村社养老', cat: 5, size: 28 },
    { id: 'dxf', name: '低消费、高福利', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'bgbg'], ['core', 'baohu'], ['core', 'dili'], ['core', 'baodi'], ['core', 'xszy'],
    ['bgbg', 'fanxiang'], ['baohu', 'fanxiang'], ['fanxiang', 'wenjian'], ['wenjian', 'sanlun'],
    ['dili', 'antipriv'], ['antipriv', 'xcq'], ['baohu', 'zjd'], ['antipriv', 'zjd'],
    ['bcs', 'qzl'], ['qzl', 'xszy'], ['bgbg', 'zhongjian'], ['zhongjian', 'bcs'],
    ['wenjian', 'xcmf'], ['xcmf', 'yjsz'], ['xcmf', 'debt'], ['bgbg', 'yjsz'],
    ['baodi', 'xiaonong'], ['baodi', 'sanbuli'], ['sanbuli', 'dxf'], ['xiaonong', 'bgbg'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '成都“还权赋能”与农地产权：周其仁—贺雪峰论争',
    sides: [
      { who: '周其仁（北京大学国家发展研究院，2011-07-27）', view: '转述：《给农民更多的土地权利，真会损害农民的利益吗？》批评《地权的逻辑》核心命题为“经典的奇谈怪论”，认为缺乏第一手调查，主张通过确权与转让权“还权赋能”，土地增值收益应在政府与农民间“分成”（2015-06-08 新华网辩论）。' },
      { who: '贺雪峰（人民论坛网 2014-09-09；三农中国 2013-07-13）', view: '转述：成都模式本质是政府凭借土地财政推动城市扩张，城郊级差地租源于城市化而非确权；给少数城郊农民完整转让权会形成土地食利者、损及 95% 的一般农区农民；出让收入相当于政府基础设施投资的成本回收。' },
    ],
    note: '双方分歧在于土地增值的来源与归属（产权赋予 vs 公共投资集聚），实证样本均以成都为主。周文原载北大国发院官网（nsd.pku.edu.cn/sylm/gd/259441.htm）；本站不对论争作结论。',
  },
  {
    id: 'x2',
    title: '土地私有化与小产权房：文贯中等产权派 vs 贺雪峰',
    sides: [
      { who: '文贯中（爱思想专栏；2014 年“交锋”研讨）', view: '转述：主张对承包地确权颁证后允许所有类型土地入市交易、停止宅基地无偿划拨，并认为小产权房是市场被压抑的产物、应予合法化；同时强调前提是暂不改变土地用途分类。' },
      { who: '贺雪峰（《地权的逻辑》结语；“交锋”研讨转述）', view: '转述：小产权房合法化会导致供过于求、破坏规划，并塑造只惠及约 5% 城郊农民的土地食利者阶层，主张严禁合法化；认为海外华人经济学家的私有化主张缺乏中国农村经验依据。' },
    ],
    note: '“交锋”研讨见三农中国网 2015-01-01 转载稿（snzg.cn/article/2015/0101/article_40246.html），属整理稿；文贯中观点见爱思想 data/105106。',
  },
  {
    id: 'x3',
    title: '城镇化节奏与资本下乡：“保守论”批评',
    sides: [
      { who: '张曙光、党国英等', view: '转述：张曙光在点评《城市化的中国道路》时质疑限制资本下乡，认为农业现代化离不开外部资本；党国英（人民网 2013-11-12）主张土地产权明晰、发育市场、用途管制公开透明，由市场平衡政府与农民利益。批评者常以“保守”概括贺雪峰的城市化与土地立场。' },
      { who: '贺雪峰（澎湃新闻 2014-09-09）', view: '转述：并不反对农民进城，而是反对“催农民进城、逼农民进城”；资本下乡可能挤占缺乏进城能力的农民在村庄的获利机会，应保留进城失败者的返乡退路。' },
    ],
    note: '张曙光点评来自研讨整理稿（reprint）；“保守”为批评方概括，非本站评价。',
  },
  {
    id: 'x4',
    title: '土地财政与“全世界最先进的土地制度”',
    sides: [
      { who: '黄小虎（原国土资源部规划院，转述自贺文）', view: '转述：撰文《漫议土地制度改革——贺雪峰文章引发的思考》，对贺雪峰《论土地资源与土地价值》的若干观点表示不赞同。黄文原文本站未检得，内容据贺雪峰回应文转述。' },
      { who: '贺雪峰（2017-09-24 答黄小虎）', view: '转述：土地财政使农地非农使用增值收益主要用于城市基础设施，形成城市化良性循环，故称现行土地制度“全世界最先进”；修法时征地制度与集体经营性建设用地入市均须“慎之又慎”。' },
    ],
    note: '黄小虎观点仅见贺文引述，列为单方转述，待补原文；2019 年修法结果见预判检验台账 L4。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '自媒体“贺雪峰说”“贺雪峰最新观点”类改题、拼接短视频与图文', status: '不收录', reason: '大量营销号截取段落、改写标题，未能追溯至署名原文或主流媒体报道。' },
  { id: 'q2', item: '“新三农”公众号作为其署名发布渠道', status: '〔存疑〕', reason: '未检索到其以该公众号署名发文的可靠记录；武汉大学社会学院官网快速链接及转载稿来源均为“新乡土”，本库以“新乡土”为准。' },
  { id: 'q3', item: '最高学位', status: '〔存疑〕', reason: '武汉大学、爱思想简介与《学术小传》作者简介称“法学博士”，维基百科称“法学硕士”；博士学位授予单位与年份未检得。' },
  { id: 'q4', item: '2002 年提出“稳定器与蓄水池”的原始文献', status: '〔存疑〕', reason: '本人自述 2002 年提出，澎湃 2014 年专访引其“12年前”文字，但原始发表出处未检得，故台账以 2011 年《经济参考报》专访为最早可见出处。' },
  { id: 'q5', item: '《地权的逻辑Ⅲ》出版年', status: '并陈', reason: '《学术小传》称 2017 年，豆瓣书目记 2018-06（中国政法大学出版社）。' },
  { id: 'q6', item: '转载页作者简介“华中科技大学教授”', status: '更正', reason: '红歌会网等 2025—2026 年转载页仍沿用旧简介；其 2017 年底起任职武汉大学。' },
  { id: 'q7', item: '2024 年“华中乡土派”网络争议中匿名文章作者', status: '并陈', reason: '贺雪峰 2024-06-03 在“新乡土”发文指认《贼喊捉贼》作者为某高校讲师，当事人同日声明否认（观察者网 2024-06-06 报道）。本站不作判断，不收录双方涉人身内容。' },
  { id: 'q8', item: '《大国之基》“2019 年度中国好书”', status: '未检验', reason: '仅见电商与书评页面标注，未核官方公布名单，故未写入著作条目。' },
  { id: 'q9', item: '“出版著作 30 余部”', status: '并陈', reason: '武汉大学 2026 年书讯称 30 余部，长江日报 2021 年专访称二十余部，口径随时间更新。' },
  { id: 'q10', item: '“6亿农村居民”“8亿农村户籍人口”', status: '以官方为准', reason: '与国家统计局 2023 年末乡村常住人口 4.77 亿及按户籍城镇化率推算的约 7.3 亿存在口径差异，详见数字口径对照。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
