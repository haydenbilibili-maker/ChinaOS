// ============================================================================
// 学者专栏 · 王绍光 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/论文原文 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 搜索引擎摘要、自媒体中托名"王绍光认为"而无原文可溯者一律不收录。
// 合著论文的结论标注合作者，不单独归于本人；本人对自身政策影响的回顾只作"本人叙述"。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  capacity: { label: '国家能力与财政汲取', color: '#c41e3a' },
  democracy: { label: '代表型民主与人民民主', color: '#8b5cf6' },
  zhengdao: { label: '政道思维与中西比较', color: '#22d3ee' },
  policy: { label: '议程设置与学习型体制', color: '#e8a317' },
  social: { label: '社会政策与公共卫生', color: '#10b981' },
  stateBuilding: { label: '国家制度建设与国家理论', color: '#fb923c' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '王绍光',
  born: '1954 年 · 湖北武汉',
  summary:
    '1972—1977 年任教武汉市堤角中学；北京大学法学士（1982），康奈尔大学政治学硕士（1984）、博士（1990）。1990—2000 年任教耶鲁大学政治学系，1999—2017 年任教香港中文大学政治与公共行政系，曾任讲座教授、系主任及《The China Review》主编；2006—2013 年任香港特区策略发展委员会委员；2017 年后任教清华大学公共管理学院、苏世民书院。1991 年起以"国家能力"为理论支点研究预算外资金与"两个比重"，1993 年与胡鞍钢合著《中国国家能力报告》；此后延伸至民主理论（选主、代表型民主、人民民主"四维一体"）、政道思维、公共政策议程设置与学习机制、公共卫生与社会政策，以及抽签民主的历史考察。',
  current: [
    '香港中文大学政治与公共行政系荣休讲座教授',
    '清华大学国情研究院兼职高级研究员',
    '华中科技大学国家治理研究院特聘研究员',
    '复旦大学中国研究院特邀研究员',
  ],
  sources: '香港中文大学政治与公共行政系个人简历页；清华大学国情研究院专家页；华中科技大学国家治理研究院人物页（2020-12-24）；复旦大学中国研究院研究员页；本人《我与国家能力研究》（《东方学刊》2026 年夏季刊）；百度百科（交叉核对）。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 12,
  subtitle: '国家能力 · 汲取能力 · 代表型民主 · 政道思维 · 议程设置 · 学习机制',
  span: '1991—2026',
  careerTitle: '履历时间线 · 武汉 → 北大 → 康奈尔 → 耶鲁 → 港中大 → 清华',
  defaultTheme: 'capacity',
  moduleId: 'scholarWangShaoguang',
  sourceNote: '期刊论文原文 / 本人回顾文章 / 主办方讲座报道 / 期刊专访 · 对照政策：国务院、财政部、全国人大常委会、中共中央文件与国务院新闻办白皮书',
  ledgerMode: 'proposition',
};

export const CAREER_GROUPS = {
  teach: { label: '中学/海外教职', color: '#22d3ee' },
  study: { label: '求学', color: '#8b5cf6' },
  cuhk: { label: '香港中文大学', color: '#c41e3a' },
  gov: { label: '香港特区咨询', color: '#e8a317' },
  tsinghua: { label: '清华大学', color: '#10b981' },
};

/** 履历甘特：起止为小数年；月份未载者取年中近似；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '武汉市堤角中学教师', org: '武汉', start: 1972.5, end: 1977.5, group: 'teach', note: '月份未载，取年中近似' },
  { id: 'c2', role: '北京大学法律系本科（法学士）', org: '北京大学', start: 1978.7, end: 1982.5, group: 'study', note: '1982 年毕业；入学年月未见本人简历载明〔存疑〕' },
  { id: 'c3', role: '康奈尔大学政府系硕士（1984）、博士（1990）', org: 'Cornell', start: 1982.7, end: 1990.5, group: 'study' },
  { id: 'c4', role: '耶鲁大学政治学系助理教授', org: 'Yale', start: 1990.6, end: 2000.5, group: 'teach', note: '起止据港中大简历"1990—2000"，月份取近似' },
  { id: 'c5', role: '香港中文大学政治与公共行政系教授、讲座教授、系主任', org: '香港中文大学', start: 1999.6, end: 2017.5, group: 'cuhk', note: '现为荣休讲座教授' },
  { id: 'c6', role: '香港特区策略发展委员会委员', org: '香港特区政府', start: 2006.5, end: 2013.5, group: 'gov', note: '月份未载，取年中近似' },
  { id: 'c7', role: '清华大学公共管理学院 / 苏世民书院教授', org: '清华大学', start: 2017.6, end: 2020.5, group: 'tsinghua', note: '华科页作 2017—2020，本人 2026 年文章称苏世民书院为 2017—2019，终止年份〔存疑〕' },
  { id: 'c8', role: '清华大学 EMPA 香港政务人才项目授课', org: '清华大学', start: 2019.5, end: 2023.5, group: 'tsinghua', note: '据本人 2026 年文章自述，月份取近似' },
];

export const BOOKS = [
  { id: 'b1', year: 1993, title: '中国国家能力报告', publisher: '辽宁人民出版社', coauthors: '胡鞍钢', date: '1993-12', isbn: '7205027810', themes: ['capacity'], verified: 'primary', note: '287 页；马宾作序；牛津大学出版社（香港）1994 年初出繁体版' },
  { id: 'b2', year: 1997, title: '挑战市场神话：国家在经济转型中的作用', publisher: '牛津大学出版社（香港）', isbn: '019590480X', themes: ['capacity', 'stateBuilding'], verified: 'primary', note: '268 页；收《建立一个强有力的民主国家》《中国改革分权的底线》《中国军费研究》等十章' },
  { id: 'b3', year: 1999, title: '多元与统一：第三部门国际比较研究', publisher: '浙江人民出版社（第三部门研究丛书）', isbn: '7213019449', themes: ['zhengdao', 'social'], verified: 'primary', note: '427 页；比较 20 个国家或地区的第三部门，本人称意在破除"公民社会"神话' },
  { id: 'b4', year: 2002, title: '美国进步时代的启示', publisher: '中国财政经济出版社', date: '2002-06', isbn: '9787500557906', themes: ['stateBuilding', 'capacity'], verified: 'primary', note: '项怀诚作序；以预算改革为"非暴力的制度控制方法"' },
  { id: 'b5', year: 2003, title: '第二次转型：国家制度建设', publisher: '清华大学出版社', coauthors: '胡鞍钢、周建明', date: '2003-07', isbn: '9787302069270', themes: ['stateBuilding'], verified: 'primary', note: '增订版 2009-01，ISBN 9787302168898' },
  { id: 'b6', year: 2007, title: '安邦之道：国家转型的目标与途径', publisher: '生活·读书·新知三联书店', date: '2007-08', isbn: '9787108027573', themes: ['stateBuilding', 'social'], verified: 'primary', note: '文集' },
  { id: 'b7', year: 2008, title: '民主四讲', publisher: '生活·读书·新知三联书店', date: '2008-08', isbn: '9787108029812', themes: ['democracy'], verified: 'primary', note: '256 页' },
  { id: 'b8', year: 2010, title: '祛魅与超越：反思民主、自由、平等、公民社会', publisher: '中信出版社', date: '2010-01', isbn: '9787508617787', themes: ['democracy', 'zhengdao'], verified: 'primary', note: '文集' },
  { id: 'b9', year: 2012, title: '理想政治秩序：中西古今的探求', publisher: '生活·读书·新知三联书店', date: '2012-07', isbn: '9787108041326', themes: ['zhengdao'], verified: 'primary', note: '主编' },
  { id: 'b10', year: 2014, title: '中国·政道', publisher: '中国人民大学出版社', isbn: '9787300200439', themes: ['zhengdao', 'democracy'], verified: 'primary', note: '出版月份诸书目作 2014-09/10/11 不一，见存疑栏' },
  { id: 'b11', year: 2014, title: '中国·治道', publisher: '中国人民大学出版社', date: '2014-10', isbn: '9787300200446', themes: ['policy', 'capacity'], verified: 'primary', note: '与《中国·政道》配套' },
  { id: 'b12', year: 2018, title: '抽签与民主、共和：从雅典到威尼斯', publisher: '中信出版集团', date: '2018-12', isbn: '9787508692760', themes: ['democracy'], verified: 'primary', note: '计划三卷中的第一卷' },
  { id: 'b13', year: 2020, title: '中国崛起的世界意义', publisher: '中信出版集团', isbn: '9787521713510', themes: ['stateBuilding', 'democracy'], verified: 'primary', note: '文集' },
  { id: 'b14', title: '理性与疯狂：文化大革命中的群众', publisher: '牛津大学出版社（香港）', themes: ['stateBuilding'], verified: 'doubt', note: '仅见本人文章提及，版权页信息未独立核对' },
];

/** 论文 / 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k1991', date: '1991-02', form: '论文', venue: '《建立一个强有力的民主国家——兼论"政权形式"与"国家能力"的区别》，《当代中国研究中心论文》第 4 期', source: '据本人《我与国家能力研究》（2026）引述；原刊未见线上全文', verified: 'reprint', themes: ['capacity', 'democracy'] },
  { id: 'k1994a', date: '1994-02', form: '论文', venue: '王绍光、胡鞍钢《中国政府汲取能力的下降及其后果》，《二十一世纪》1994 年 2 月号（总第 21 期），第 5—14 页', source: '香港中文大学中国文化研究所《二十一世纪》期目录', url: 'https://www.cuhk.edu.hk/ics/21c/cn/issues/c021.html', verified: 'primary', themes: ['capacity'] },
  { id: 'k1994b', date: '1994-04', form: '论文', venue: '《再论中国政府的汲取能力——兼答杨大利、崔之元、饶余庆、萧耿诸先生》，《二十一世纪》1994 年 4 月号（总第 22 期）', source: '香港中文大学中国文化研究所《二十一世纪》期目录', url: 'https://www.cuhk.edu.hk/ics/21c/cn/issues/c022.html', verified: 'primary', themes: ['capacity'] },
  { id: 'k1995', date: '1995', form: '论文', venue: '《分权的底线》，《当代中国研究》1995 年第 1 期', source: '《当代中国研究》官网全文', url: 'https://www.modernchinastudies.org/us/issues/past-issues/45-mcs-1995-issue-1/249-2011-12-29-11-30-06.html', verified: 'primary', themes: ['capacity', 'stateBuilding'] },
  { id: 'k2003a', date: '2003', form: '论文', venue: '王绍光、胡鞍钢、周建明《第二代改革战略：积极推进国家制度建设》，《战略与管理》2003 年第 2 期，第 90—95 页', source: '据何增科《渐进政治改革与民主的政治转型》注释', verified: 'reprint', themes: ['stateBuilding'] },
  { id: 'k2003b', date: '2003', form: '署名文章', venue: '《中国公共卫生的危机与转机》', source: '爱思想转载（原刊处未载明）', url: 'https://www.aisixiang.com/data/11998.html', verified: 'reprint', themes: ['social'] },
  { id: 'k2005', date: '2005', form: '论文', venue: '王绍光、何焕荣、乐园《政策导向、汲取能力与卫生公平》，《中国社会科学》2005 年第 6 期，第 101—120 页', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/9981.html', verified: 'primary', themes: ['social', 'capacity'] },
  { id: 'k2006', date: '2006', form: '论文', venue: '《中国公共政策议程设置的模式》，《中国社会科学》2006 年第 5 期，第 86—99 页', source: '《中国社会科学》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/12697.html', verified: 'primary', themes: ['policy'] },
  { id: 'k2008a', date: '2008-01', form: '论文', venue: '《大转型：1980 年代以来中国的双向运动》，《中国社会科学》2008 年第 1 期，第 129—148 页', source: '《中国社会科学》（人文与社会网转载）', url: 'http://wen.org.cn/modules/article/view.article.php/324', verified: 'primary', themes: ['social'] },
  { id: 'k2008b', date: '2008-11', form: '论文', venue: '《学习机制与适应能力：中国农村合作医疗体制变迁的启示》，《中国社会科学》2008 年第 6 期，第 111—133 页', source: '《中国社会科学》（上海财经大学学术通讯摘要页）', url: 'https://academicnewsletter.sufe.edu.cn/info/230385', verified: 'primary', themes: ['policy', 'social'] },
  { id: 'k2009', date: '2009-07', form: '论文', venue: '《学习机制、适应能力与中国模式》，《开放时代》2009 年第 7 期，第 36—40 页', source: '《开放时代》（复旦大学高研院转载）', url: 'http://www.ias.fudan.edu.cn/article/3837', verified: 'primary', themes: ['policy'] },
  { id: 'k2011', date: '2011-02-22', form: '署名文章', venue: '《超越"选主"》', source: '观察者网转载（来源爱思想）', url: 'https://www.guancha.cn/indexnews/2011_02_22_54404.shtml', verified: 'reprint', themes: ['democracy'] },
  { id: 'k2012', date: '2012', form: '署名文章', venue: '《中式政道思维还是西式政体思维？》', source: '人文与社会网转载', url: 'http://wen.org.cn/modules/article/view.article.php/3190', verified: 'reprint', themes: ['zhengdao'] },
  { id: 'k2013', date: '2013-12-05', form: '讲话', venue: '中国社会科学论坛发言（光明网报道）', source: '光明网理论频道', url: 'http://theory.gmw.cn/2013-12/05/content_9709498.htm', verified: 'media', themes: ['democracy'] },
  { id: 'k2014a', date: '2014-03', form: '论文', venue: '《代表型民主与代议型民主》，《开放时代》2014 年第 2 期，第 152—174 页', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/73405.html', verified: 'primary', themes: ['democracy'] },
  { id: 'k2014b', date: '2014-05', form: '论文', venue: '《国家治理与基础性国家能力》，《华中科技大学学报（社会科学版）》2014 年第 3 期，第 8—10 页', source: '《华中科技大学学报》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/76121.html', verified: 'primary', themes: ['capacity', 'stateBuilding'] },
  { id: 'k2014c', date: '2014-11', form: '论文', venue: '《社会建设的方向："公民社会"还是人民社会？》，《开放时代》2014 年第 6 期，第 26—48 页', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/80646.html', verified: 'primary', themes: ['zhengdao', 'social'] },
  { id: 'k2015', date: '2015-04-07', form: '讲座', venue: '法意读书会 · 政道思维与政体思维（人民论坛网报道）', source: '人民论坛网', url: 'https://theory.rmlt.com.cn/2015/0407/380713.shtml', verified: 'media', themes: ['zhengdao'] },
  { id: 'k2019', date: '2019-10', form: '论文', venue: '《新技术革命与国家理论》，《中央社会主义学院学报》2019 年第 5 期，第 93—100 页', source: '《中央社会主义学院学报》（观察者网 2019-12-27 转载）', url: 'https://www.guancha.cn/WangShaoGuang/2019_12_27_529668.shtml', verified: 'primary', themes: ['stateBuilding'] },
  { id: 'k2020', date: '2020-05', form: '论文', venue: '《筑牢疾控体系：四次危机，一个教训》，《开放时代》2020 年第 3 期', source: '《开放时代》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/121344.html', verified: 'primary', themes: ['social'] },
  { id: 'k2023a', date: '2023-03-12', form: '采访', venue: '中新社"东西问"专访 · 人民民主"四维一体"', source: '中国新闻网', url: 'https://www.chinanews.com.cn/dxw/2023/03-12/9970192.shtml', verified: 'media', themes: ['democracy'] },
  { id: 'k2023b', date: '2023', form: '讲座', venue: '《人民民主：四维一体》，《比较政治学研究》总第 22 辑（天津人民出版社）；据 2021-06-07 清华国情讲坛第 54 讲整理', source: '《比较政治学研究》（历史与社会期刊平台下载）', url: 'https://www.lishiyushehui.cn/article/download/1062', verified: 'primary', themes: ['democracy'] },
  { id: 'k2023c', date: '2023-10', form: '采访', venue: '《政治学研究》2023 年第 5 期专访（记者唐磊）', source: '《政治学研究》（观察者网 2024-02-16 转载）', url: 'https://www.guancha.cn/WangShaoGuang/2024_02_16_725403_s.shtml', verified: 'primary', themes: ['capacity', 'democracy', 'policy', 'zhengdao'] },
  { id: 'k2024', date: '2024-05-15', form: '讲座', venue: '清华国情讲坛第 61 讲 · 从"民主"到"人民民主"（1820—1949）', source: '清华大学国情研究院官网', url: 'https://www.iccs.tsinghua.edu.cn/announce_info/1340.html', verified: 'primary', themes: ['democracy'] },
  { id: 'k2025a', date: '2025-06-10', form: '讲座', venue: '上海交通大学国是学者讲坛第 42 期 · 人民民主溯源', source: '上海交通大学国际与公共事务学院官网', url: 'https://www.sipa.sjtu.edu.cn/show/6271', verified: 'primary', themes: ['democracy'] },
  { id: 'k2025b', date: '2025-08', form: '讲话', venue: '上海书展前期与欧树军对谈波兰尼《大转型》', source: '观察者网（活字文化授权，2025-08-16 发布）', url: 'https://www.guancha.cn/WangShaoGuang/2025_08_16_786727_1.shtml', verified: 'reprint', themes: ['social'] },
  { id: 'k2025c', date: '2025-10-16', form: '讲话', venue: '复旦大学"2025 思想者论坛"发言', source: '观察者网', url: 'https://www.guancha.cn/WangShaoGuang/2025_10_19_793842.shtml', verified: 'reprint', themes: ['zhengdao', 'stateBuilding'] },
  { id: 'k2026a', date: '2026-05-12', form: '讲座', venue: '浙江大学青山大讲堂第十二期 · 人民民主溯源', source: '浙江大学官网报道', url: 'http://tiabs.zju.edu.cn/2026/0526/c75255a3166418/page.htm', verified: 'primary', themes: ['democracy'] },
  { id: 'k2026b', date: '2026-07', form: '署名文章', venue: '《我与国家能力研究》，《东方学刊》2026 年夏季刊（文末署 2025-10-19 深圳）', source: '《东方学刊》（爱思想全文转载）', url: 'https://www.aisixiang.com/data/179225.html', verified: 'primary', themes: ['capacity', 'stateBuilding'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 国家能力与财政汲取 ——
  { id: 'c1', k: 'k1991', theme: 'capacity', type: '原话', text: '除非我们相信国家完全不必干预社会经济事务，否则国家能力总是越强越好。当然，国家能力强的政府，不一定不干坏事；但可以肯定的是，国家能力太弱的政府，干不了好事。' },
  { id: 'c2', k: 'k2026b', theme: 'capacity', type: '原话', text: '在这四种国家能力中，汲取能力最为根本。国家只有掌握了必要的财力才能实现它的其他功能' },
  { id: 'c3', k: 'k1994a', theme: 'capacity', type: '转述', text: '与胡鞍钢合作，以财政收入占 GDP 比重、中央财政收入占全国财政收入比重（"两个比重"）的双双下降，论证放权让利与财政包干导致中央汲取能力衰退，并警示其政治后果（合著结论）。' },
  { id: 'c4', k: 'k1995', theme: 'capacity', type: '原话', text: '从逻辑上讲，恐怕没人会否认分权有其下限；超过了这个下限；也会出现种种危机。过度集权会造成严重的效率损失，过度分权则可能导致国家的分崩离析。' },
  { id: 'c5', k: 'k1995', theme: 'capacity', type: '原话', text: '正确的提法不是“要集权还是要分权？”，而是“哪些权应该集、哪些权应该分？”' },
  { id: 'c6', k: 'k2014b', theme: 'capacity', type: '原话', text: '十八大提出"国家治理体系和治理能力"，"治理能力"四字非常关键，没有相应的治理能力，"治理体系"就只会是一个空架子。' },
  { id: 'c7', k: 'k2014b', theme: 'capacity', type: '转述', text: '提出现代国家应具备八项基础性国家能力：强制、汲取、濡化、认证、规管、统领、再分配、吸纳与整合；并区分"能力"与"权力"，主张前者培养、后者限制。' },
  { id: 'c8', k: 'k2023c', theme: 'capacity', type: '原话', text: '现在全世界没有一个国家的中央政府的财政支出，即直接的财政支出比重像中国这样低！从这个角度看，中国还是一个高度分权的国家。' },
  { id: 'c9', k: 'k2026b', theme: 'capacity', type: '转述', text: '本人叙述：称《中国国家能力报告》的分税制建议与当时中央决策思路相近，并引刘仲藜、翁礼华等人的评价；属本人回顾，不构成报告推动分税制的因果证明。' },

  // —— 代表型民主与人民民主 ——
  { id: 'd1', k: 'k2011', theme: 'democracy', type: '原话', text: '当然，现在大多数人，包括我都认为民主是个好东西。但不同的人对民主的理解十分不同。' },
  { id: 'd2', k: 'k2011', theme: 'democracy', type: '原话', text: '选主就是以竞争性选举为特征的所谓民主制度。我把它称之为“选主”是因为它的实质不是人民当家作主，而是由人民选出主人来，或者选一个主人（如总统），或者选一群主人，由这些人来进行统治。' },
  { id: 'd3', k: 'k2014a', theme: 'democracy', type: '原话', text: '本文的基本论点是，代议型民主只是一种金丝鸟笼式民主，不应是、也不可能是唯一可取的民主形式。' },
  { id: 'd4', k: 'k2014a', theme: 'democracy', type: '原话', text: '简而言之，中国体制之所以认受性高，是因为中国践行了一种符合本国民众心愿的新型民主——代表型民主。' },
  { id: 'd5', k: 'k2014a', theme: 'democracy', type: '原话', text: '群众路线是中式代表型民主的核心所在。' },
  { id: 'd6', k: 'k2014a', theme: 'democracy', type: '转述', text: '以"代表谁、由谁代表、代表什么、怎样代表"四个问题比较代表型民主（representational）与代议型民主（representative），认为后者重程序授权、前者重实质回应。' },
  { id: 'd7', k: 'k2023a', theme: 'democracy', type: '原话', text: '西式代议民主是单维代表，只有形式性代表一个维度。中国的人民民主则是全方位代表，将象征性、描绘性、形式性和实质性代表聚为一体，形成“四维一体”的民主。' },
  { id: 'd8', k: 'k2023a', theme: 'democracy', type: '原话', text: '没有哪一种政治制度可以垄断对民主的解释。' },
  { id: 'd9', k: 'k2023c', theme: 'democracy', type: '原话', text: '形式民主只是一方面，实质民主更重要，就是老百姓的利益是否得到实现。' },
  { id: 'd10', k: 'k2013', theme: 'democracy', type: '转述', text: '据光明网报道：援引调查称七成以上受访者支持中央政府，认为中国已经形成了自己关于民主的话语体系。' },
  { id: 'd11', k: 'k2024', theme: 'democracy', type: '转述', text: '据主办方报道：梳理 1820—1949 年中国民主观念的演变，归纳出贤人政治、全民政治、平民政权、工农民主、人民民主五种理论形态。' },
  { id: 'd12', k: 'k2025a', theme: 'democracy', type: '转述', text: '据主办方报道：追溯"人民民主"概念的形成史，认为中国共产党是推动这一概念落地的第一推手。' },
  { id: 'd13', k: 'k2026a', theme: 'democracy', type: '转述', text: '据主办方报道：认为推动民主概念在中国落地的主要力量，是受马克思主义影响的先进知识分子。' },

  // —— 政道思维与中西比较 ——
  { id: 'z1', k: 'k2012', theme: 'zhengdao', type: '转述', text: '区分"政体思维"（关注政府形式与程序）与"政道思维"（关注治国之道与政策取向），以"儒家贵民，法家贵君，墨家贵兼，道家贵己"说明中国传统政治思考侧重政道。' },
  { id: 'z2', k: 'k2015', theme: 'zhengdao', type: '转述', text: '据报道：认为西式政体思维有三大缺陷，主张激活中国传统的政道思维来评判政治体制的优劣。' },
  { id: 'z3', k: 'k2023c', theme: 'zhengdao', type: '转述', text: '自述"政道思维"的提法最早形成于 2010 年中国文化论坛的讨论。' },
  { id: 'z4', k: 'k2014c', theme: 'zhengdao', type: '原话', text: '公民社会不应是中国社会建设的方向，真正值得中国人追求的是构筑一个以劳动大众为主体的政治共同体——人民社会。' },
  { id: 'z5', k: 'k2014c', theme: 'zhengdao', type: '转述', text: '批评"公民社会"理论的五种神话：同质、圣洁、独立、国家与社会二元对立、民主动力。' },
  { id: 'z6', k: 'k2025c', theme: 'zhengdao', type: '原话', text: '中国在现实中取得的成就以及提出的一些理念，实际上是对过去撒切尔夫人所谓“别无选择”（There is no alternative）之论的有力回应。' },

  // —— 议程设置与学习型体制 ——
  { id: 'p1', k: 'k2006', theme: 'policy', type: '原话', text: '在今日中国，六种公共政策议程设置模式依然并存。' },
  { id: 'p2', k: 'k2006', theme: 'policy', type: '转述', text: '按议程提出者（决策者、智囊、民间）与民众参与程度，将议程设置划分为关门、动员、内参、借力、上书、外压六种模式，判断外压模式日益频繁。' },
  { id: 'p3', k: 'k2008b', theme: 'policy', type: '原话', text: '此间高适应体制的"中国模式"逐渐成型,其活力来源于从不相信任何"放之四海而皆准"的标准。' },
  { id: 'p4', k: 'k2008b', theme: 'policy', type: '转述', text: '以农村合作医疗变迁为案例，按推动者（决策者/政策倡导者）与学习源（实践/实验）划分四类学习模式，认为学习机制是体制适应能力的来源。' },
  { id: 'p5', k: 'k2009', theme: 'policy', type: '原话', text: '从动态的角度看，适应能力也许比什么都重要。' },
  { id: 'p6', k: 'k2009', theme: 'policy', type: '原话', text: '学习模式的优劣、适应能力的强弱与有没有竞争性选举毫无关系。' },
  { id: 'p7', k: 'k2023c', theme: 'policy', type: '原话', text: '我提到的调适能力与民主制度没有什么必然关系' },
  { id: 'p8', k: 'k2023c', theme: 'policy', type: '原话', text: '2001年以后，中国开始推行大规模的预算改革。现在各级政府部门的预算公开程度远远高于20年前。' },

  // —— 社会政策与公共卫生 ——
  { id: 's1', k: 'k2003b', theme: 'social', type: '原话', text: '由于指导思想上的失误，在我国的医疗卫生领域，政府失职与市场失灵同时存在。' },
  { id: 's2', k: 'k2005', theme: 'social', type: '转述', text: '与何焕荣、乐园合作，把卫生公平与政策导向、国家汲取能力联系起来考察，认为二者共同影响卫生资源的分配（合著结论）。' },
  { id: 's3', k: 'k2008a', theme: 'social', type: '原话', text: '在1990年代短暂地经历了“市场社会”的梦魇之后，中国已出现了蓬勃的反向运动，并正在催生一个“社会市场”。' },
  { id: 's4', k: 'k2008a', theme: 'social', type: '原话', text: '近年来出台的一系列社会政策显示，中国政府既有政治意愿也有财政能力来充当社会市场的助产士，虽然无论在意愿还是能力上，两者都有待加强。' },
  { id: 's5', k: 'k2020', theme: 'social', type: '转述', text: '将疾控体系的波折归纳为 1958—1961、1967—1971、1985—2003、2008 年至今四次危机，教训是疾控必须由财政稳定保障而非依赖有偿服务。' },
  { id: 's6', k: 'k2020', theme: 'social', type: '转述', text: '据其援引数据：2002 年疾控中心收入中有偿服务占 72%；到 2018 年财政性投入占比达 74.4%（本人整理口径）。' },
  { id: 's7', k: 'k2025b', theme: 'social', type: '原话', text: '波兰尼最重要的不是要反对市场经济，反对市场，他是要反对以市场原则来统治整个社会这样一种情况，他叫作市场社会。' },
  { id: 's8', k: 'k2025b', theme: 'social', type: '转述', text: '以 1990 年代后期的大规模下岗为例，说明家庭内部互惠接济在市场冲击下的保护作用，呼应波兰尼的"互惠"原则。' },

  // —— 国家制度建设与国家理论 ——
  { id: 'b1', k: 'k2003a', theme: 'stateBuilding', type: '转述', text: '与胡鞍钢、周建明合作，主张第二代改革战略应以积极推进国家制度建设为核心（合著结论；据何增科文引述，原文未见线上全文）。' },
  { id: 'b2', k: 'k2019', theme: 'stateBuilding', type: '原话', text: '正在发生的新技术革命很可能釜底抽薪、彻底颠覆现有的国家理论。' },
  { id: 'b3', k: 'k2019', theme: 'stateBuilding', type: '转述', text: '认为在新技术革命条件下，传统国家理论的支柱性概念——暴力、战争、疆域——都发生了根本变化，国家能力的各方面也随之改变。' },
  { id: 'b4', k: 'k2026b', theme: 'stateBuilding', type: '原话', text: '关心中国前途的人们不应陶醉于目前的大好形势，而应以百分之九十九的努力，去阻止哪怕只有百分之一可能性的内乱' },
  { id: 'b5', k: 'k2026b', theme: 'stateBuilding', type: '转述', text: '回顾称 2008 年提出"适应能力"，加上此前归纳的九种能力，现代国家应具备的基础性国家能力共十种。' },
  { id: 'b6', k: 'k2026b', theme: 'stateBuilding', type: '转述', text: '回顾 1998 年军队、武警停止经商与此后国防费由财政保障的变化，将其视为国家强制能力与汲取能力建设的一环（本人叙述）。' },
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

export const FEATURED = ['c1', 'c4', 'c8', 'd2', 'd3', 'p5', 's3', 'b2'];

export const THEME_LINKS = {
  capacity: [{ to: '/debt', label: '地方债务' }, { to: '/govsystem', label: '政府体制' }],
  democracy: [{ to: '/ideology', label: '意识形态' }, { to: '/powerlogic', label: '权力逻辑' }],
  zhengdao: [{ to: '/civilization', label: '文明' }, { to: '/culture', label: '文化' }],
  policy: [{ to: '/policydocs', label: '政策文件' }, { to: '/governance', label: '国家治理' }],
  social: [{ to: '/healthcare', label: '医疗医保' }, { to: '/socialgov', label: '基层治理' }],
  stateBuilding: [{ to: '/reform', label: '改革' }, { to: '/aiplus', label: '人工智能+' }],
};

export const THEME_INTRO = {
  capacity: '其起家的一条线：以"国家将自身意志转化为现实的能力"界定国家能力，从预算外资金膨胀与"两个比重"下降切入，1993 年与胡鞍钢合著《中国国家能力报告》；此后清单由四种扩展到八种、九种，再加适应能力为十种。与自由主义经济学者的争论见"争议"栏。',
  democracy: '从 2008 年《民主四讲》、2011 年"选主"批评，到 2014 年"代表型民主"与 2021 年后"人民民主·四维一体"，核心论点是把民主的判准从程序授权移向实质代表；近年转向 1820—1949 年人民民主概念史的溯源。',
  zhengdao: '以"政道思维"对照西式"政体思维"，主张评判政治体制看治国之道与政策取向而非政府形式；延伸到以"人民社会"替代"公民社会"的社会建设论。',
  policy: '以六种议程设置模式和四类学习模式刻画中国公共政策过程，认为体制适应能力来自学习机制，与是否实行竞争性选举无必然关系。',
  social: '借波兰尼"双向运动"解释 1990 年代以来的市场化与社会保护，公共卫生与农村合作医疗是其实证重点；2020 年以四次危机论证疾控体系须由财政稳定保障。',
  stateBuilding: '以"第二次转型"概括国家制度建设的议程，并追问新技术革命对暴力、战争、疆域等国家理论基石的冲击；2026 年的回顾文章系统梳理了其国家能力研究与相关政策的时间对应。',
};

// ============================================================================
// 命题检验台账：只收可被政策事实检验的命题；对照截至核验日
// "兑现"仅指制度演进与命题一致，不代表因果归功于本人。
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '1993-12', venue: '《中国国家能力报告》第六章（辽宁人民出版社）',
    claim: '以规范的分税制取代财政包干制，提高"两个比重"',
    check: '1993-12-15 国务院《关于实行分税制财政管理体制的决定》，1994-01-01 起施行。制度走向与报告建议一致；报告公开出版与决定发布同月，本人回顾称二者思路相近，但无公开档案证明因果，仅记为一致。',
    dataSrc: '国务院 1993-12-15 分税制决定；本人《我与国家能力研究》（2026）',
  },
  {
    id: 'L2', status: 'done', type: '原话', date: '1993-12', venue: '《中国国家能力报告》（据本人 2026 年文章引述）',
    url: 'https://www.aisixiang.com/data/179225.html',
    claim: '彻底清理预算外资金……尽快结束两种预算并存的混乱局面',
    check: '财政部《关于将按预算外资金管理的收入纳入预算管理的通知》（财预〔2010〕88号，2010-06）规定自 2011-01-01 起全部预算外收入纳入预算管理、取消预算外收支科目；2014-08-31 全国人大常委会修改《预算法》，规定政府全部收入和支出都应纳入预算。制度结果与命题一致，时间相隔约 17 年，不作因果归功。',
    dataSrc: '财政部财预〔2010〕88号（教育部网站转载）；《预算法》2014 年修正',
  },
  {
    id: 'L4', status: 'done', type: '原话', date: '2003', venue: '《中国公共卫生的危机与转机》（爱思想转载）',
    url: 'https://www.aisixiang.com/data/11998.html',
    claim: '由于指导思想上的失误，在我国的医疗卫生领域，政府失职与市场失灵同时存在。',
    check: '2009-03 中共中央、国务院《关于深化医药卫生体制改革的意见》提出坚持公共医疗卫生的公益性质、强化政府责任和投入。政策方向与其"政府失职"判断一致；新医改是多方长期讨论的结果，不归功于单一学者。',
    dataSrc: '中共中央 国务院《关于深化医药卫生体制改革的意见》（2009-03-17）',
  },
  {
    id: 'L5', status: 'done', type: '原话', date: '2008-01', venue: '《中国社会科学》2008 年第 1 期',
    url: 'http://wen.org.cn/modules/article/view.article.php/324',
    claim: '中国政府既有政治意愿也有财政能力来充当社会市场的助产士，虽然无论在意愿还是能力上，两者都有待加强。',
    check: '2009 年起新型农村社会养老保险试点，2014 年国务院合并新农保与城居保建立统一的城乡居民基本养老保险，2016 年整合城乡居民基本医疗保险。社会保护覆盖持续扩大，与"社会市场"方向一致；"有待加强"部分属开放判断。',
    dataSrc: '国务院 2009 年新农保试点指导意见；国发〔2014〕8号；国发〔2016〕3号',
  },
  {
    id: 'L6', status: 'done', type: '转述', date: '2020-05', venue: '《开放时代》2020 年第 3 期',
    url: 'https://www.aisixiang.com/data/121344.html',
    claim: '疾控体系必须由财政稳定保障、提升其地位，而非依赖有偿服务',
    check: '2021-05-13 国家疾病预防控制局挂牌；2023-12 国务院办公厅印发《关于推动疾病预防控制事业高质量发展的指导意见》。机构地位提升与其主张一致；财政保障力度缺少统一公开口径，无法量化验证。',
    dataSrc: '国家疾控局官网；中国政府网（国务院办公厅 2023-12 指导意见）',
  },
  {
    id: 'L7', status: 'done', type: '原话', date: '2023-10', venue: '《政治学研究》2023 年第 5 期专访',
    url: 'https://www.guancha.cn/WangShaoGuang/2024_02_16_725403_s.shtml',
    claim: '2001年以后，中国开始推行大规模的预算改革。现在各级政府部门的预算公开程度远远高于20年前。',
    check: '2008-05-01《政府信息公开条例》施行；2014 年修正的《预算法》规定预算、预算调整、决算经批准后 20 日内向社会公开。制度层面与其描述一致；公开质量的评价另有第三方指数，未纳入本条。',
    dataSrc: '《政府信息公开条例》（2007）；《预算法》2014 年修正',
  },
  {
    id: 'L8', status: 'open', type: '原话', date: '2023-10', venue: '《政治学研究》2023 年第 5 期专访',
    url: 'https://www.guancha.cn/WangShaoGuang/2024_02_16_725403_s.shtml',
    claim: '现在全世界没有一个国家的中央政府的财政支出，即直接的财政支出比重像中国这样低！从这个角度看，中国还是一个高度分权的国家。',
    check: '2024-07 二十届三中全会《决定》提出"适当加强中央事权、提高中央财政支出比例"。已写入改革部署，但中央本级支出比重的实际变化尚待后续决算数据，且"全世界最低"的比较口径未经本栏独立核对。',
    dataSrc: '《中共中央关于进一步全面深化改革 推进中国式现代化的决定》（2024-07）',
  },
  {
    id: 'L9', status: 'open', type: '原话', date: '2019-10', venue: '《中央社会主义学院学报》2019 年第 5 期',
    url: 'https://www.guancha.cn/WangShaoGuang/2019_12_27_529668.shtml',
    claim: '正在发生的新技术革命很可能釜底抽薪、彻底颠覆现有的国家理论。',
    check: '属理论层面的长期判断，没有可在政策文件中闭环的检验标准。',
    dataSrc: '无直接对照（检索截至 2026-09）',
  },
  {
    id: 'L10', status: 'open', type: '原话', date: '2023-03-12', venue: '中新社"东西问"专访',
    url: 'https://www.chinanews.com.cn/dxw/2023/03-12/9970192.shtml',
    claim: '中国的人民民主则是全方位代表，将象征性、描绘性、形式性和实质性代表聚为一体，形成“四维一体”的民主。',
    check: '国务院新闻办 2021-12-04 发布《中国的民主》白皮书，以"全过程人民民主"为官方表述，未采用"四维一体"框架。属概念阐释，其解释力依赖评价标准，暂无可量化检验。',
    dataSrc: '国务院新闻办《中国的民主》白皮书（2021-12）',
  },
  {
    id: 'L11', status: 'open', type: '转述', date: '2018-12', venue: '《抽签与民主、共和：从雅典到威尼斯》（中信出版集团）',
    claim: '抽签是竞争性选举之外的一种民主形式，值得重新审视',
    check: '至核验日未检索到以抽签产生公职或代表的全国性制度安排；地方层面的随机抽取民意代表等做法零散，与其论证的对应关系未经本人阐明。',
    dataSrc: '公开制度文件（检索截至 2026-09）',
  },
];

// 王绍光公开表述中的数字多为本人整理的历史口径（如疾控收入结构），缺少可与同口径官方统计直接比对的数值，故不设数字对照。
export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '国家能力', '民主理论', '政道与社会', '政策过程', '社会政策'],
  nodes: [
    { id: 'core', name: '国家能力\n与国家建设', cat: 0, size: 58 },
    { id: 'extract', name: '汲取能力', cat: 1, size: 40 },
    { id: 'ratio', name: '两个比重', cat: 1, size: 30 },
    { id: 'offbudget', name: '预算外资金', cat: 1, size: 24 },
    { id: 'floor', name: '分权的底线', cat: 1, size: 30 },
    { id: 'ten', name: '十种基础性能力', cat: 1, size: 32 },
    { id: 'rep', name: '代表型民主', cat: 2, size: 38 },
    { id: 'xuanzhu', name: '选主', cat: 2, size: 28 },
    { id: 'masses', name: '群众路线', cat: 2, size: 26 },
    { id: 'four', name: '四维一体', cat: 2, size: 28 },
    { id: 'lot', name: '抽签', cat: 2, size: 22 },
    { id: 'zhengdao', name: '政道 vs 政体', cat: 3, size: 34 },
    { id: 'people', name: '人民社会', cat: 3, size: 26 },
    { id: 'tina', name: '别无选择之论', cat: 3, size: 20 },
    { id: 'agenda', name: '议程设置六模式', cat: 4, size: 30 },
    { id: 'learn', name: '学习机制', cat: 4, size: 32 },
    { id: 'adapt', name: '适应能力', cat: 4, size: 32 },
    { id: 'double', name: '双向运动', cat: 5, size: 30 },
    { id: 'socmkt', name: '社会市场', cat: 5, size: 26 },
    { id: 'cdc', name: '疾控体系', cat: 5, size: 24 },
  ],
  links: [
    ['core', 'extract'], ['core', 'ten'], ['core', 'rep'], ['core', 'zhengdao'], ['core', 'adapt'], ['core', 'double'],
    ['extract', 'ratio'], ['ratio', 'offbudget'], ['extract', 'floor'], ['ten', 'extract'], ['ten', 'adapt'],
    ['rep', 'xuanzhu'], ['rep', 'masses'], ['rep', 'four'], ['rep', 'lot'],
    ['zhengdao', 'rep'], ['zhengdao', 'people'], ['zhengdao', 'tina'],
    ['agenda', 'learn'], ['learn', 'adapt'], ['adapt', 'xuanzhu'],
    ['double', 'socmkt'], ['socmkt', 'cdc'], ['extract', 'cdc'], ['learn', 'cdc'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '民主的判准：选举程序优先，还是实质代表优先',
    sides: [
      { who: '俞可平（《关于"民主是个好东西"的辨正》，《北京日报》2006-10-23）', view: '原话："相对而言，民主是人类迄今最好的政治制度"；主张以增量方式推进民主。' },
      { who: '王绍光（《超越"选主"》2011；《代表型民主与代议型民主》2014）', view: '转述：同意"民主是个好东西"，但认为以竞争性选举为核心的代议型民主只是"选主"，中国应以代表型民主衡量民主。' },
      { who: '何增科（《渐进政治改革与民主的政治转型》）', view: '转述：将王绍光、胡鞍钢归为"民主的国家制度建设说"，评其强调国家能力建设优先、具有国家中心论倾向，对公民社会的能力建设重视不够。' },
    ],
    note: '俞、王两人并无一问一答式论战，此处按命题并陈；何增科文发表年份转载页未载。本栏并陈，不作裁决。',
  },
  {
    id: 'x2',
    title: '1994 年汲取能力论战：中央财政衰退是否危及国家统一',
    sides: [
      { who: '王绍光、胡鞍钢（《二十一世纪》1994 年 2 月号）', view: '转述："两个比重"下降已使中央汲取能力降至危险水平，若不改革财政体制，可能出现央地、地区间冲突。' },
      { who: '杨大利、崔之元、饶余庆与萧耿（同期《二十一世纪》）', view: '转述：同期分别以《对「濒危论」的几点反驳》《「国家能力」辩证观》《中国真将分崩离析吗？》提出质疑；杨大利观点目前仅见王绍光答复文中的转述。' },
      { who: '王绍光（《二十一世纪》1994 年 4 月号）', view: '转述：撰文逐一答复，重申汲取能力判断。' },
    ],
    note: '各方原文载《二十一世纪》总第 21、22 期，本栏据期目录与王绍光答复文整理。本栏并陈，不作裁决。',
  },
  {
    id: 'x3',
    title: '提高汲取能力，还是先转变政府职能与约束财政',
    sides: [
      { who: '张曙光（《国家能力与制度变革和社会转型——兼评〈中国国家能力报告〉》，《中国书评》1995 年 1 月总第 3 期；另有《再评》）', view: '转述：将政府与纳税人关系视为交易关系，认为相对于公共服务，税负未必过少；批评《报告》只看预算收支，忽视预算外、制度外财政的不规范。' },
      { who: '李强（《国家能力与国家权力的悖论》）', view: '转述：更深层次的改革是政府职能转化，而不仅是提高中央财政汲取比重。' },
      { who: '王绍光（《我与国家能力研究》2026）', view: '转述：回应称《报告》已有专节主张取消预算外资金、结束两种预算并存，批评者忽略了这部分内容。' },
    ],
    note: '1994-11 天则经济研究所曾就《报告》举行研讨，胡鞍钢到场答辩；王绍光的回应写于三十年后，属本人叙述。本栏并陈，不作裁决。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '网传"王绍光语录"及自媒体托名表态', status: '不收录', reason: '未找到对应论文、讲座或署名出处。' },
  { id: 'q2', item: '1991 年文所列国家能力的维数', status: '并陈', reason: '本人 2023 年专访说三种，2026 年回顾文章列汲取、调控、合法化、强制四种。' },
  { id: 'q3', item: '基础性国家能力是九种还是十种', status: '并陈', reason: '2023 年专访称"最终确定了九种"（含调适）；2026 年文章称九种加 2008 年提出的适应能力共十种，口径不同。' },
  { id: 'q4', item: '《分权的底线》的首刊处', status: '并陈', reason: '《当代中国研究》1995 年第 1 期有全文；李强文章引作《战略与管理》1995 年第 2 期第 37—56 页，可能两处均有刊载。' },
  { id: 'q5', item: '《正视不平等的挑战》（《管理世界》）的年份与字句', status: '不收录', reason: '仅见二手引用，有引文把 1999 年第 4 期误作 1994 年，且字句不一，未见原文。' },
  { id: 'q6', item: '"现任清华苏世民书院教授"的说法', status: '更正', reason: '本人 2026 年文章称苏世民书院任教为 2017—2019 年，华科页作 2017—2020 年；现职为港中大荣休讲座教授及清华国情院兼职高级研究员等。' },
  { id: 'q7', item: '"《中国国家能力报告》推动了分税制改革"之说', status: '〔存疑〕', reason: '见于本人回顾及合作机构书页，属当事人叙述；未见决策档案佐证因果。' },
  { id: 'q8', item: '《中国·政道》出版月份', status: '并陈', reason: '豆瓣作 2014-11，其他书目作 2014-09 或 2014-10。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
