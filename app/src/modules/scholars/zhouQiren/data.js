// ============================================================================
// 学者专栏 · 周其仁 —— 数据真源（核验截至 2026-09-28）
// ----------------------------------------------------------------------------
// 规则：原话 = 出处可见的逐字引文；转述 = 本模块对其观点的概括，不加引号；
// verified：primary 主办方/署名/著作 · media 媒体报道 · reprint 整理稿转载 · doubt 存疑。
// 标题为"周其仁最新演讲"的自媒体搬运/拼接稿不作为原话来源；未经本人确认的整理稿降为 reprint。
// ============================================================================

export const AS_OF = '2026-09-28';

export const THEMES = {
  land: { label: '产权与土地制度', color: '#c41e3a' },
  urban: { label: '城市化与城乡', color: '#22d3ee' },
  money: { label: '货币与宏观', color: '#8b5cf6' },
  health: { label: '医疗与公共服务', color: '#10b981' },
  enterprise: { label: '企业突围与全球布局', color: '#fb923c' },
  reform: { label: '改革方法论与体制成本', color: '#e8a317' },
};
export const THEME_KEYS = Object.keys(THEMES);

export const PROFILE = {
  name: '周其仁',
  born: '1950 年 8 月 · 上海',
  summary:
    '早年在黑龙江生产建设兵团下乡（含完达山狩猎七年半），1978 年考入中国人民大学经济系；毕业后在中国社会科学院农村发展研究所、国务院农村发展研究中心发展研究所从事农村改革调查研究（杜润生指导）。1989 年后赴牛津、科罗拉多、芝加哥访问，1991 年入 UCLA 获硕士、博士学位；1996 年起任教北京大学中国经济研究中心，2008—2012 年任北大国家发展研究院院长，2010—2012 年任中国人民银行货币政策委员会委员。研究以产权与合约、制度变迁为主轴，覆盖农地转让权与征地制度、城乡中国、货币与汇率、医改、体制成本，近年转向企业全球布局的田野调研。',
  current: [
    '北京大学博雅资深教授、国家发展研究院经济学教授',
    '上海市人民政府决策咨询委员会专家（2013 年起，任期未核）',
  ],
  sources: '北大国发院教师页；北大新闻网 2012-11 国发院院长交接报道；中新网 2010-03-29 货币政策委员会人事报道；著作勒口作者简介。',
};

/** 看板壳配置（ScholarBoard 读取） */
export const BOARD = {
  order: 3,
  subtitle: '人物履历 · 农地转让权 · 城乡中国 · 货币教训 · 医改 · 企业寻路 · 预判检验',
  span: '1982—2026',
  careerTitle: '履历时间线 · 兵团 → 农村政策研究 → UCLA → 北大国发院',
  defaultTheme: 'land',
  moduleId: 'scholarZhouQiren',
  sourceNote: '著作原书 / 北大国发院官网 / 署名文章（经济观察报、经济学季刊、财新《中国改革》）/ 主流媒体报道 · 对照数据：全国人大、农业农村部、国家统计局、国家卫健委、海关总署、重庆日报',
};

export const CAREER_GROUPS = {
  youth: { label: '下乡与求学', color: '#94a3b8' },
  rural: { label: '农村政策研究', color: '#e8a317' },
  abroad: { label: '访学与留学', color: '#8b5cf6' },
  pku: { label: '北京大学', color: '#22d3ee' },
  policy: { label: '政策咨询 / 兼职', color: '#c41e3a' },
};

/** 履历甘特：起止为小数年；note 记录口径出入 */
export const CAREER = [
  { id: 'c1', role: '黑龙江生产建设兵团知青（含完达山狩猎七年半）', org: '黑龙江', start: 1968.5, end: 1978.1, group: 'youth', note: '起止月份未核〔存疑〕' },
  { id: 'c2', role: '中国人民大学经济系本科', org: '北京', start: 1978.1, end: 1982.5, group: 'youth', note: '入学、毕业月份未核〔存疑〕' },
  { id: 'c3', role: '中国社科院农村发展研究所 / 国务院农村发展研究中心发展研究所', org: '北京', start: 1982.5, end: 1989.35, group: 'rural' },
  { id: 'c4', role: '牛津大学、科罗拉多大学、芝加哥大学访问学习', org: '英国 / 美国', start: 1989.35, end: 1991.7, group: 'abroad' },
  { id: 'c5', role: 'UCLA 经济学硕士（1993）、博士（2000）', org: '美国', start: 1991.7, end: 1996.0, group: 'abroad', note: '博士学位 2000 年授予，1996 年已回国任教' },
  { id: 'c6', role: '北京大学中国经济研究中心教授（后兼中心主任）', org: '北京大学', start: 1996.0, end: 2008.8, group: 'pku', note: '起点国发院页为 1996-01，维基为 1996-11，并陈' },
  { id: 'c7', role: '浙江大学经济学院受聘任教', org: '杭州', start: 2001.0, end: 2005.0, group: 'policy', note: '仅见著作作者简介，起止未核〔存疑〕' },
  { id: 'c8', role: '北京大学国家发展研究院院长', org: '北京大学', start: 2008.8, end: 2012.9, group: 'pku', note: '2012-11-20 由姚洋接任' },
  { id: 'c9', role: '中国人民银行货币政策委员会委员', org: '北京', start: 2010.25, end: 2012.2, group: 'policy', note: '2010-03-29 获任；卸任时间据 2012 年换届报道推定〔存疑〕' },
  { id: 'c10', role: '北大国发院教授（博雅资深教授）', org: '北京大学', start: 2012.9, end: 2026.75, group: 'pku' },
];

export const BOOKS = [
  { id: 'b1', year: 2002, title: '真实世界的经济学', publisher: '中国发展出版社', date: '2002-02', isbn: '9787800875359', themes: ['reform'], verified: 'primary', note: '北京大学出版社 2006-10 再版（ISBN 9787301109892）' },
  { id: 'b2', year: 2002, title: '产权与制度变迁：中国改革的经验研究', publisher: '社会科学文献出版社', date: '2002-09', isbn: '9787801497420', themes: ['land', 'reform'], verified: 'primary', note: '增订本 北京大学出版社 2004-09（ISBN 9787301077214）' },
  { id: 'b3', year: 2008, title: '病有所医当问谁：医改系列评论', publisher: '北京大学出版社', date: '2008-08', isbn: '9787301137789', themes: ['health'], verified: 'primary', note: '收经济观察报专栏医改评论' },
  { id: 'b4', year: 2010, title: '中国做对了什么：回望改革、面对未来', publisher: '北京大学出版社', date: '2010-01', isbn: '9787301164006', themes: ['reform'], verified: 'primary', note: '中国计划出版社 2017-08 另版' },
  { id: 'b5', year: 2012, title: '货币的教训：汇率与货币系列评论', publisher: '北京大学出版社', date: '2012-01', isbn: '9787301144800', themes: ['money'], verified: 'primary', note: '收经济观察报"其仁其文"专栏 2010—2011 年文章' },
  { id: 'b6', year: 2013, title: '城乡中国（上）', publisher: '中信出版社', date: '2013-08', isbn: '9787508640969', themes: ['urban', 'land'], verified: 'primary', note: '下册 2014-08（ISBN 9787508647050）；修订版合订 2017-04（ISBN 9787508671741）' },
  { id: 'b7', year: 2013, title: '改革的逻辑', publisher: '中信出版社', date: '2013-08', isbn: '9787508640976', themes: ['reform'], verified: 'primary', note: '修订版 2017-10（ISBN 9787508674490）' },
  { id: 'b8', year: 2017, title: '突围集：寻找改革新势力', publisher: '中信出版集团', date: '2017-06', isbn: '9787508674155', themes: ['reform', 'enterprise'], verified: 'primary', note: '部分书目著录副标题为"寻找改革新动力"，并陈' },
  { id: 'b9', year: 2017, title: '产权与中国变革', publisher: '北京大学出版社', date: '2017-07', isbn: '9787301284681', themes: ['land', 'reform'], verified: 'primary', note: '收论文《体制成本与中国经济》' },
  { id: 'b10', year: 2025, title: '寻路集：在全球网络中寻找合适节点', publisher: '中信出版集团', date: '2025-09', isbn: '9787521779967', themes: ['enterprise'], verified: 'primary' },
];

/** 讲话 / 采访 / 署名文章文库 */
export const CORPUS = [
  { id: 'k2004', date: '2004', form: '署名文章', venue: '论文 · 农地产权与征地制度——中国城市化面临的重大选择', source: '《经济学（季刊）》第 3 卷第 4 期（爱思想转载全文）', url: 'https://www.aisixiang.com/data/23384.html', verified: 'primary', themes: ['land'] },
  { id: 'k2008a', date: '2008-01-12', form: '讲话', venue: '第十届北大光华新年论坛 · 重新界定产权之路', source: '周其仁个人网站', url: 'https://zhouqiren.org/archives/641.html', verified: 'primary', themes: ['reform', 'land'] },
  { id: 'k2008b', date: '2008-02-24', form: '讲话', venue: 'CCER 中国经济观察第 12 次报告会', source: '北大新闻网', url: 'http://news.pku.edu.cn/info/2891/2698181.htm', verified: 'media', themes: ['money', 'land'] },
  { id: 'k2008c', date: '2008-08', form: '文章', venue: '文集 · 病有所医当问谁（经济观察报医改专栏结集）', source: '北京大学出版社', url: 'https://book.douban.com/subject/3193403/', verified: 'primary', themes: ['health'] },
  { id: 'k2009', date: '2009-09-17', form: '讲话', venue: '第三届国际玉米产业大会（大连）', source: '21世纪经济报道（新浪财经转载）', url: 'http://finance.sina.com.cn/roll/20090918/00086764844.shtml', verified: 'media', themes: ['money', 'urban'] },
  { id: 'k2010a', date: '2010-04-06', form: '采访', venue: '《第一财经日报》专访 · 通胀与货币', source: '京华时报转载（新浪财经）', url: 'http://finance.sina.com.cn/roll/20100406/03047692926.shtml', verified: 'media', themes: ['money'] },
  { id: 'k2010b', date: '2010-09-16', form: '采访', venue: '《21世纪经济报道》专访 · 成都统筹城乡', source: '21世纪经济报道（新浪财经转载）', url: 'http://finance.sina.com.cn/roll/20100916/00058664150.shtml', verified: 'media', themes: ['land', 'urban'] },
  { id: 'k2011', date: '2011-07-25', form: '署名文章', venue: '经济观察报 · 给农民更多的土地权利，真会损害农民的利益吗？——致“成都模式的批判者”', source: '北大国发院网站转载', url: 'https://www.nsd.pku.edu.cn/sylm/gd/259441.htm', verified: 'primary', themes: ['land'] },
  { id: 'k2012', date: '2012-03-22', form: '采访', venue: '《金证券》采访 · 被动超发货币', source: '金陵晚报（央视网转载）', url: 'http://jingji.cntv.cn/20120322/109193.shtml', verified: 'media', themes: ['money'] },
  { id: 'k2013', date: '2013-10-24', form: '采访', venue: '《南方周末》专访 · 土地改革的诱饵与根子', source: '周其仁个人网站转载', url: 'https://zhouqiren.org/archives/1470', verified: 'reprint', themes: ['land'] },
  { id: 'k2014a', date: '2014-05', form: '署名文章', venue: '经济观察报 · 允许农地农房入市，真的会天下大乱吗', source: '澎湃新闻 2014-09-25 论战脉络摘引', url: 'https://m.thepaper.cn/newsDetail_forward_1268112', verified: 'media', themes: ['land'] },
  { id: 'k2014b', date: '2014-06', form: '署名文章', venue: '经济观察报 · 集体土地依法转让不会导致天下大乱', source: '澎湃新闻 2014-09-25 论战脉络摘引', url: 'https://m.thepaper.cn/newsDetail_forward_1268112', verified: 'media', themes: ['urban', 'land'] },
  { id: 'k2014c', date: '2014-07-28', form: '署名文章', venue: '经济观察报 · 城乡中国系列 · “地票”是一个了不起的创造', source: '北大国发院网站转载', url: 'https://www.nsd.pku.edu.cn/sylm/gd/258786.htm', verified: 'primary', themes: ['land'] },
  { id: 'k2014d', date: '2014-08-17', form: '讲话', venue: '上海书展 · 读懂城乡中国', source: '第一财经日报（北大国发院网站转载）', url: 'https://www.nsd.pku.edu.cn/sylm/gd/258780.htm', verified: 'media', themes: ['urban', 'land'] },
  { id: 'k2014e', date: '2014-09', form: '署名文章', venue: '经济观察报 · 城市化为什么离不开农地农房入市', source: '澎湃新闻 2014-09-25 论战脉络摘引', url: 'https://m.thepaper.cn/newsDetail_forward_1268112', verified: 'media', themes: ['land'] },
  { id: 'k2015', date: '2015-12', form: '采访', venue: '上观新闻年度访谈（高渊）', source: '解放日报·上观新闻（北大国发院 BiMBA 转载）', url: 'https://www.bimba.pku.edu.cn/wm/xwzx/xwlx/zf/425043.htm', verified: 'media', themes: ['urban', 'reform'] },
  { id: 'k2017', date: '2017-04', form: '署名文章', venue: '论文 · 体制成本与中国经济', source: '《经济学（季刊）》第 16 卷第 3 期（北大国发院 PDF）', url: 'https://nsd.pku.edu.cn/docs/20190412151252062696.pdf', verified: 'primary', themes: ['reform'] },
  { id: 'k2024a', date: '2024-01-11', form: '署名文章', venue: '财新《中国改革》2024 年第 1 期（第十四届财新峰会 2023-11-09 演讲修订稿）', source: '财新《中国改革》', url: 'https://cnreform.caixin.com/2024-01-11/102155313.html', verified: 'primary', themes: ['enterprise'] },
  { id: 'k2024b', date: '2024-06-08', form: '讲话', venue: '洪范研究所研讨会发言（整理稿，未经本人确认）', source: '新浪财经转载', url: 'https://finance.sina.com.cn/roll/2024-07-02/doc-incatrii7666763.shtml', verified: 'reprint', themes: ['enterprise'] },
  { id: 'k2024c', date: '2024-08-22', form: '讲话', venue: '郎酒庄园会员节演讲', source: '睿见Economy（新浪财经转载）', url: 'https://finance.sina.com.cn/chanjing/jync/djbd/2024-08-22/doc-incknpii8656565.shtml', verified: 'media', themes: ['enterprise'] },
  { id: 'k2024d', date: '2024-09-25', form: '讲话', venue: '财新第二届亚洲愿景论坛（新加坡）· 企业出海与地缘政治', source: '财新网', url: 'https://www.caixin.com/2024-09-25/102239911.html', verified: 'media', themes: ['enterprise'] },
  { id: 'k2025a', date: '2025-03', form: '讲话', venue: 'OPPO 思享会 · 企业全球化', source: '证券时报', url: 'http://stcn.com/article/detail/1629105.html', verified: 'media', themes: ['enterprise'] },
  { id: 'k2025b', date: '2025', form: '讲话', venue: '财新夏季峰会演讲 · 大变局的本底逻辑与未来机会（作者修订稿，峰会日期未核）', source: '腾讯新闻 2025-10-07 转载', url: 'https://news.qq.com/rain/a/20251007A05D6900', verified: 'reprint', themes: ['enterprise', 'reform'] },
  { id: 'k2025c', date: '2025-10-14', form: '讲座', venue: '北大国发院承泽论坛第 43 期 · 《寻路集》新书分享', source: '北大国发院新闻', url: 'https://nsd.pku.edu.cn/sylm/xw/542542.htm', verified: 'primary', themes: ['enterprise', 'reform'] },
  { id: 'k2025d', date: '2025-11-12', form: '采访', venue: '《南方周末》专访 · 顺差、内需与“中国人经济”', source: '21世纪经济报道网站转载', url: 'https://www.21jingji.com/article/20251112/herald/de86b9cf164573fe8044c18b1bea66df.html', verified: 'media', themes: ['enterprise', 'reform'] },
  { id: 'k2026a', date: '2026-01-05', form: '采访', venue: '《中国企业家》专访 · 出海与创新', source: '北大国发院网站转载', url: 'https://nsd.pku.edu.cn/sylm/xw/1cb398e4232740f294c16650472e81c7.htm', verified: 'media', themes: ['enterprise', 'reform'] },
  { id: 'k2026b', date: '2026-07-17', form: '讲话', venue: '2026 青岛品牌日 · 高处争独到——突围寻路的一场硬仗', source: '观海新闻', url: 'https://www.guanhai.com.cn/p/464704.html', verified: 'media', themes: ['enterprise'] },
];

const CORPUS_BY_ID = Object.fromEntries(CORPUS.map((k) => [k.id, k]));

/** 观点条目：原话逐字、转述概括；verified 缺省继承出处 */
const RAW_CLAIMS = [
  // —— 产权与土地制度 ——
  { id: 'l1', k: 'k2004', theme: 'land', type: '原话', text: '我国现行征地制度通过管制农民土地转让权，将产权租金转变为行政权力租金，从而事先管制了农地转用的价格，妨碍了运用市场机制配置土地资源。这套制度不但引发了分配的不公正，而且导致了生产和交易的低效率。' },
  { id: 'l2', k: 'k2004', theme: 'land', type: '转述', text: '建议的政策组合：结束单一国家征用农地制度、发展农地转用市场；政府征地严格限于法定公益用地范围，并确立按市价向承包农户补偿的原则；准许集体土地进入市场。' },
  { id: 'l3', k: 'k2008b', theme: 'land', type: '转述', text: '据报道，反对叫停小产权房。' },
  { id: 'l4', k: 'k2010b', theme: 'land', type: '原话', text: '地票制度是一种分享机制的尝试。' },
  { id: 'l5', k: 'k2011', theme: 'land', type: '原话', text: '这是一条经典的奇谈怪论，因为完全得不到中国土地革命、土地改革、家庭联产承包和现在成渝改革试验区大量可观察经验的支持。' },
  { id: 'l6', k: 'k2013', theme: 'land', type: '原话', text: '确权是基础，流转是核心，配套是关键' },
  { id: 'l7', k: 'k2013', theme: 'land', type: '转述', text: '主张推动跨县（最好跨省）的土地流转，范围包括宅基地，并加快建立土地交易所。' },
  { id: 'l8', k: 'k2014a', theme: 'land', type: '原话', text: '城地城房入市多年，天下没有大乱，为什么农地农房入市，天就会塌下来呢？' },
  { id: 'l9', k: 'k2014c', theme: 'land', type: '原话', text: '笔者以为最了不起之处，是地票把“挂钩”无可挽回地推进了市场。' },
  { id: 'l10', k: 'k2014c', theme: 'land', type: '原话', text: '“地票”惟一冲击的，是“集体建设用地不得转让用于非农建设”的禁令，此禁不除，讲“市场配置（土地）资源”就永远是一句束之高阁的空话。' },
  { id: 'l11', k: 'k2014e', theme: 'land', type: '转述', text: '反驳华生：不同意以“小产权一律非法”为讨论前提，主张收缩征地、农地入市，而非维持“政府征地 + 卖地”的现行制度。' },

  // —— 城市化与城乡 ——
  { id: 'u1', k: 'k2009', theme: 'urban', type: '原话', text: '所以中国城市化的集聚程度还是落后，而城市化集聚程度对大国的经济发展非常重要。' },
  { id: 'u2', k: 'k2010b', theme: 'urban', type: '原话', text: '成都经验就是给全国趟一条路' },
  { id: 'u3', k: 'k2014b', theme: 'urban', type: '原话', text: '个人之见，这波城镇化实在来得太晚，而绝不是太早。' },
  { id: 'u4', k: 'k2014d', theme: 'urban', type: '原话', text: '土地进城市以后的增值分配不公正，没法把相关的各个利益集团平衡。这就是“半拉子工程”的结构。' },
  { id: 'u5', k: 'k2014d', theme: 'urban', type: '原话', text: '如果政府决定是错的，土地配置与城市发展、经济发展脱节，会导致两个极端：人大量去的地方，土地不够，人大量走的地方，也在盖。' },
  { id: 'u6', k: 'k2014d', theme: 'urban', type: '转述', text: '批评政府“一手征地、一手卖地”，由裁判变成玩家，形成对土地出让收入的依赖；主张集体土地流转的口子“开大一点”。' },
  { id: 'u7', k: 'k2015', theme: 'urban', type: '原话', text: '现在的情况是，人人都要去的地方，承载能力不行，人仰马翻；大家不要去的地方，在大建大修，最后不知怎么收场，全是债务。' },

  // —— 货币与宏观 ——
  { id: 'm2', k: 'k2009', theme: 'money', type: '原话', text: '货币发得很多，但看不见通胀，我的观点是看见就晚了。' },
  { id: 'm3', k: 'k2010a', theme: 'money', type: '原话', text: '我一直认为中文的‘通胀’，比英文的inflation还要准确，因为通胀就指通货本身的膨胀，就是货币供应量大大超出经济增长。' },
  { id: 'm4', k: 'k2010a', theme: 'money', type: '转述', text: '认为超发货币对股市、房价上涨起了推波助澜作用；以 2009 年 M2 同比 27.7%、GDP 增长 8.7% 对比说明货币供应远超经济增长。' },
  { id: 'm5', k: 'k2012', theme: 'money', type: '原话', text: '通胀的根源是货币的被动超发。' },
  { id: 'm6', k: 'k2012', theme: 'money', type: '原话', text: '巨量的人民币供应远高出经济增长的需要，这不是‘货币超发’是什么？' },
  { id: 'm7', k: 'k2012', theme: 'money', type: '转述', text: '称 1994 年《人民银行法》关上了财政透支的“主动超发”之门，但汇率形成机制下央行以基础货币购汇打开了“被动超发”口子；主张央行以坚守人民币币值稳定为第一要务。' },

  // —— 医疗与公共服务 ——
  { id: 'h1', k: 'k2008c', theme: 'health', type: '转述', text: '认为医改困境并非“市场化惹的祸”，医疗服务是“开放最差的部门”，病根在准入管制与价格管制造成的供给不足。' },
  { id: 'h2', k: 'k2008c', theme: 'health', type: '转述', text: '以宿迁医改为样本，批评“政府主导”与“管办合一”，认为公共卫生才是政府首要责任，医院改制不容回避。' },
  { id: 'h3', k: 'k2008c', theme: 'health', type: '转述', text: '主张非营利医院“以民办为优”，警惕“包而不办”，以“英国医疗模式”为例提示全民公医的限制条件。' },

  // —— 企业突围与全球布局 ——
  { id: 'e1', k: 'k2024a', theme: 'enterprise', type: '原话', text: '市场经济以企业为本，而企业不同于行政机构，无须、也绝不应该作茧自缚、画地为牢。' },
  { id: 'e2', k: 'k2024a', theme: 'enterprise', type: '原话', text: '在全球市场网络里选择合适节点，敢于也善于在更宽处布局，是极不确定环境里企业突围的一条可选路径。' },
  { id: 'e3', k: 'k2024a', theme: 'enterprise', type: '转述', text: '以“三明治”格局描述中国制造：上有发达经济体的独到创新，下有后发经济体的成本优势；以 ASML 人均每小时创利约 90 欧元、人工约 50 欧元说明高处竞争的差距。' },
  { id: 'e4', k: 'k2024d', theme: 'enterprise', type: '转述', text: '以泉州等地企业为例，认为地缘冲突推动全球经济重心转移，企业出海是在另一种博弈中重新布局。' },
  { id: 'e5', k: 'k2025a', theme: 'enterprise', type: '原话', text: '早期的产品出口模式已无法满足企业发展需求，更深层次的挑战在于海外办厂和全球化运营。' },
  { id: 'e6', k: 'k2025b', theme: 'enterprise', type: '原话', text: '决定时代结局的，是看似不起眼的普通人物发现并抓住的新机会。' },
  { id: 'e7', k: 'k2025c', theme: 'enterprise', type: '转述', text: '据调研总结企业寻路三条经验：细处求精益、宽处谋布局、高处争独到。' },
  { id: 'e8', k: 'k2025d', theme: 'enterprise', type: '原话', text: '很多人把顺差当作成就，其实是误解。常识来讲，你卖得越多，对方越没有钱支付，这是不可持续的。' },
  { id: 'e9', k: 'k2025d', theme: 'enterprise', type: '原话', text: '我们现在国内购买力还不够，一方面，居民收入占GDP的比例偏低，另一方面是产业界习惯卖低价品。' },
  { id: 'e10', k: 'k2025d', theme: 'enterprise', type: '原话', text: '经济的发展不再局限于国界线之内，而是逐步从“中国经济”转向“中国人经济”，即从GDP（国内生产总值）向GNP（国民生产总值）的延伸。' },
  { id: 'e11', k: 'k2026a', theme: 'enterprise', type: '原话', text: '我们的制造商用在客户身上的时间太少了，这是最大的问题。' },
  { id: 'e12', k: 'k2026a', theme: 'enterprise', type: '原话', text: '我们总认为只有政府才能引导创新，其实，大量的创新活动是通过社会连接起来的，只是其中某些问题需要政府去帮助解决。' },

  // —— 改革方法论与体制成本 ——
  { id: 'r1', k: 'k2008a', theme: 'reform', type: '转述', text: '以“重新界定产权”概括改革三十年的主线：从农村承包到城市与企业，改革的实质是重新界定产权。' },
  { id: 'r2', k: 'k2017', theme: 'reform', type: '原话', text: '体制是成体系的制度安排。举凡体制确立、运行和改变所耗费的资源，即为体制成本。' },
  { id: 'r3', k: 'k2017', theme: 'reform', type: '转述', text: '认为 1978—2008 年高速增长得益于改革开放降低了原先居高不下的体制成本；此后税费、寻租与奢靡推高体制成本，须以结构性改革大幅降低。' },
  { id: 'r4', k: 'k2015', theme: 'reform', type: '原话', text: '我一直向有关部委建议，不妨让各个城市试验一把。' },
  { id: 'r5', k: 'k2025c', theme: 'reform', type: '转述', text: '整理稿：称 2008 年前后体制成本重新掉头向上，当下最大变局是中美关系，起因在美国自身变化。', verified: 'reprint' },
  { id: 'r6', k: 'k2026a', theme: 'reform', type: '原话', text: '我过去研究中国改革，每一次都是自下而上起来的' },
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

export const FEATURED = ['l1', 'l10', 'u7', 'm2', 'm5', 'e1', 'e8', 'r2'];

export const THEME_LINKS = {
  land: [{ to: '/rural', label: '乡村振兴' }, { to: '/housing', label: '住房地产' }],
  urban: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }, { to: '/debt', label: '地方债务' }],
  money: [{ to: '/rmb', label: '人民币' }, { to: '/finance-system', label: '金融体系' }, { to: '/econ-dashboard', label: '经济大盘' }],
  health: [{ to: '/healthcare', label: '医疗' }],
  enterprise: [{ to: '/private', label: '民营经济' }, { to: '/foreign-trade', label: '外贸' }, { to: '/manufacturing', label: '制造业' }],
  reform: [{ to: '/reform', label: '改革' }, { to: '/governance', label: '治理' }],
};

export const THEME_INTRO = {
  land: '其学术主轴：以“转让权”为钥匙审视征地制度——征地把产权租金转为行政权力租金。2004 年提出结束单一征地、集体土地入市、征地限于公益并按市价补偿；此后以成都、重庆地票为田野样本，与贺雪峰、华生展开长期论战。',
  urban: '《城乡中国》的核心判断是城镇化“来得太晚”且集聚不足，症结在土地配置由行政决定、增值分配不公，导致“人去的地方地不够，人走的地方还在盖”，并与土地财政和地方债务相连。',
  money: '2008—2012 年在经济观察报“其仁其文”专栏与央行货币政策委员会任内，持续论证“被动超发”：汇率形成机制下央行购汇投放基础货币，通胀是货币现象，主张央行以币值稳定为第一要务。',
  health: '2007—2008 年医改评论系列认为问题不在“市场化过度”而在开放不足：准入与价格管制压抑供给，“管办合一”扭曲公立医院，政府应先承担公共卫生责任。',
  enterprise: '2023 年后转向企业田野：以“三明治”格局刻画中国制造的中间处境，主张企业“在全球网络中寻找合适节点”，以客户为中心争取“高处”独到；同时指出顺差不可持续、内需不足源于收入占比低与低价习惯。',
  reform: '方法论上以“重新界定产权”解释改革，以“体制成本”解释增长起落，强调改革自下而上、可在城市层面“试验一把”。',
};

// ============================================================================
// 预判检验台账：只收可被事实检验的政策建议与前瞻判断；对照数据截至核验日
// ============================================================================
export const LEDGER = [
  {
    id: 'L1', status: 'done', type: '转述', date: '2004', venue: '《经济学（季刊）》论文 · 农地产权与征地制度',
    url: 'https://www.aisixiang.com/data/23384.html',
    claim: '结束单一国家征用农地制度，准许集体土地进入市场',
    check: '2019-08-26《土地管理法》修正（2020-01-01 施行）第 63 条：土地利用总体规划、城乡规划确定为工业、商业等经营性用途并依法登记的集体经营性建设用地，经本集体三分之二以上成员或村民代表同意，可出让、出租。入市范围限于存量经营性建设用地，宅基地与承包地不在其列，属部分兑现。',
    dataSrc: '全国人大常委会《土地管理法》修正案（新华网 2019-08-26）',
  },
  {
    id: 'L2', status: 'open', type: '转述', date: '2004', venue: '《经济学（季刊）》论文 · 农地产权与征地制度',
    claim: '政府征地严格限于法律程序确定的公益性用地',
    check: '2019 年修正第 45 条首次列举可征收情形（军事外交、基础设施、公共事业、扶贫搬迁与保障性安居工程等），但仍包括“成片开发建设”一项，征地范围有所界定而未严格限于公益。',
    dataSrc: '《土地管理法》（2019 修正）第 45 条',
  },
  {
    id: 'L3', status: 'open', type: '转述', date: '2004', venue: '《经济学（季刊）》论文 · 农地产权与征地制度',
    claim: '征地按市价向承包农户补偿',
    check: '2019 年修正第 48 条以省级公布的“区片综合地价”取代原“年产值倍数”补偿标准，并要求纳入社会保障费用；补偿仍由政府定价而非市场形成，方向接近但未采纳市价原则。',
    dataSrc: '《土地管理法》（2019 修正）第 48 条',
  },
  {
    id: 'L4', status: 'done', type: '原话', date: '2014-07-28', venue: '经济观察报 · “地票”是一个了不起的创造',
    url: 'https://www.nsd.pku.edu.cn/sylm/gd/258786.htm',
    claim: '市场的机能一旦发作，覆水难收，回头路就没得走啦。',
    check: '文中口径：至 2014-06 累计交易地票 13.74 万亩、价款 279 亿元。重庆日报 2024-11-15：地票累计交易约 37 万亩、740 亿元，制度持续运行十年未回撤；但未推广为全国性制度，跨省流通仍限于国家统筹的增减挂钩节余指标调剂。',
    dataSrc: '重庆日报 2024-11-15；国办发〔2018〕16 号',
  },
  {
    id: 'L5', status: 'open', type: '转述', date: '2013-10-24', venue: '《南方周末》专访（转载稿）',
    claim: '推动跨县（最好跨省）土地流转，范围包括宅基地，加快建立土地交易所',
    check: '2018 年国办发〔2018〕16 号允许增减挂钩节余指标跨省域调剂，但由国家统筹、定价下达，并非市场化交易所；宅基地流转仍限于集体经济组织内部，未见跨县交易。',
    dataSrc: '国务院办公厅国办发〔2018〕16 号；农业农村部宅基地制度改革材料',
  },
  {
    id: 'L6', status: 'open', type: '转述', date: '2014-05', venue: '经济观察报 · 允许农地农房入市，真的会天下大乱吗',
    claim: '允许农地农房入市',
    check: '2019 年修正允许进城落户农民自愿有偿退出宅基地；2020-09 起在 104 个县（市、区）和 3 个地级市开展新一轮宅基地制度改革试点；2024 年二十届三中全会提出允许农户合法拥有的住房通过出租、入股、合作等方式盘活利用。城镇居民购买农村宅基地和农房仍被禁止。',
    dataSrc: '农业农村部 2021-09-01；新华网 2025 年中央一号文件',
  },
  {
    id: 'L7', status: 'open', type: '转述', date: '2008-02-24', venue: 'CCER 中国经济观察第 12 次报告会（报道）',
    claim: '反对简单叫停小产权房，不以“小产权一律非法”为前提（2014 年再申此意）',
    check: '2019 年修正未涉及小产权房；至核验日未检索到小产权房合法化的全国性法律或政策。',
    dataSrc: '《土地管理法》（2019 修正）；检索截至 2026-09',
  },
  {
    id: 'L8', status: 'done', type: '原话', date: '2009-09-17', venue: '第三届国际玉米产业大会',
    url: 'http://finance.sina.com.cn/roll/20090918/00086764844.shtml',
    claim: '货币发得很多，但看不见通胀，我的观点是看见就晚了。',
    check: 'CPI 同比：2009 年 -0.7%，2010 年 +3.3%，2011 年 +5.4%，2011-07 月度峰值 +6.5%。讲话时 CPI 为负，此后两年通胀抬升，与判断方向一致。',
    dataSrc: '国家统计局年度统计公报、月度 CPI',
  },
  {
    id: 'L9', status: 'open', type: '转述', date: '2012-03-22', venue: '《金证券》采访',
    claim: '以汇率形成机制改革堵住被动超发，央行以币值稳定为第一要务',
    check: '2015-08-11 人民币兑美元中间价报价机制改革；外汇占款约于 2014 年见顶后回落，被动投放渠道显著收缩。《人民银行法》目标表述仍为“保持货币币值的稳定，并以此促进经济增长”，货币政策仍兼顾多重目标。',
    dataSrc: '中国人民银行 2015-08-11 公告；《中国人民银行法》第 3 条',
  },
  {
    id: 'L10', status: 'done', type: '原话', date: '2015-12', venue: '上观新闻年度访谈',
    url: 'https://www.bimba.pku.edu.cn/wm/xwzx/xwlx/zf/425043.htm',
    claim: '我一直向有关部委建议，不妨让各个城市试验一把。',
    check: '语境为专车/网约车管制。2016-07 交通运输部等七部门发布《网络预约出租汽车经营服务管理暂行办法》（2016-11-01 施行），明确网约车合法地位，具体准入细则授权城市人民政府制定。',
    dataSrc: '交通运输部等《网络预约出租汽车经营服务管理暂行办法》',
  },
  {
    id: 'L11', status: 'open', type: '转述', date: '2008-08', venue: '文集 · 病有所医当问谁',
    claim: '开放医疗服务准入以增加供给，非营利医院以民办为优',
    check: '2024 年末公立医院 11754 家、民营医院 26956 家，民营数量已超公立 2 倍；但民营医院诊疗人次 7.3 亿、占 16.3%，入院人次占 17.7%，服务量仍以公立为主。',
    dataSrc: '国家卫生健康委《2024 年我国卫生健康事业发展统计公报》',
  },
  {
    id: 'L12', status: 'open', type: '原话', date: '2025-11-12', venue: '《南方周末》专访',
    url: 'https://www.21jingji.com/article/20251112/herald/de86b9cf164573fe8044c18b1bea66df.html',
    claim: '很多人把顺差当作成就，其实是误解。常识来讲，你卖得越多，对方越没有钱支付，这是不可持续的。',
    check: '2025 年货物贸易顺差约 1.19 万亿美元，规模仍创新高；“不可持续”属长期判断，至核验日尚无收缩迹象可闭环。',
    dataSrc: '海关总署 2026-01-14 发布',
  },
];

export const NUMERIC_CHECKS = [];

// ============================================================================
// 框架图谱（ECharts graph）
// ============================================================================
export const FRAMEWORK = {
  categories: ['核心', '产权与土地', '城乡中国', '货币制度', '管制与公共服务', '企业寻路'],
  nodes: [
    { id: 'core', name: '重新界定产权\n降低体制成本', cat: 0, size: 58 },
    { id: 'zhuanrang', name: '农地转让权', cat: 1, size: 38 },
    { id: 'zhengdi', name: '征地制度改革', cat: 1, size: 32 },
    { id: 'jiti', name: '集体建设用地入市', cat: 1, size: 32 },
    { id: 'dipiao', name: '地票', cat: 1, size: 30 },
    { id: 'nongfang', name: '农地农房入市 / 小产权', cat: 1, size: 28 },
    { id: 'jiju', name: '城市化集聚', cat: 2, size: 32 },
    { id: 'banla', name: '增值分配“半拉子工程”', cat: 2, size: 26 },
    { id: 'tdcz', name: '土地财政', cat: 2, size: 28 },
    { id: 'chengdu', name: '成都统筹城乡', cat: 2, size: 26 },
    { id: 'chaofa', name: '被动超发', cat: 3, size: 34 },
    { id: 'huilv', name: '汇率形成机制', cat: 3, size: 28 },
    { id: 'bizhi', name: '币值稳定', cat: 3, size: 26 },
    { id: 'yigai', name: '医疗准入开放', cat: 4, size: 28 },
    { id: 'shiyan', name: '城市试验（网约车）', cat: 4, size: 24 },
    { id: 'sandwich', name: '三明治格局', cat: 5, size: 32 },
    { id: 'jiedian', name: '全球网络节点', cat: 5, size: 30 },
    { id: 'kehu', name: '以客户为中心', cat: 5, size: 26 },
    { id: 'gnp', name: '中国人经济 / 顺差', cat: 5, size: 26 },
  ],
  links: [
    ['core', 'zhuanrang'], ['core', 'chaofa'], ['core', 'yigai'], ['core', 'sandwich'], ['core', 'jiju'],
    ['zhuanrang', 'zhengdi'], ['zhuanrang', 'jiti'], ['zhuanrang', 'dipiao'], ['zhuanrang', 'nongfang'],
    ['zhengdi', 'tdcz'], ['jiti', 'chengdu'], ['dipiao', 'chengdu'],
    ['jiju', 'banla'], ['banla', 'tdcz'], ['nongfang', 'jiju'],
    ['chaofa', 'huilv'], ['huilv', 'bizhi'],
    ['yigai', 'shiyan'], ['shiyan', 'core'],
    ['sandwich', 'jiedian'], ['sandwich', 'kehu'], ['jiedian', 'gnp'], ['gnp', 'huilv'],
  ],
};

// ============================================================================
// 争议与出处
// ============================================================================
export const CONTROVERSIES = [
  {
    id: 'x1',
    title: '给农民更多土地权利：周其仁 vs 贺雪峰（成都试验）',
    sides: [
      { who: '周其仁（经济观察报 2011-07-25）', view: '称“给农民更多的土地权利，可能损害农民的利益”是经典的奇谈怪论，得不到土地革命、土改、家庭联产承包与成渝试验区经验支持；批评对方对成都模式的批判缺少第一手调查。2014 年撰文称重庆地票是“了不起的创造”。' },
      { who: '贺雪峰（《地权的逻辑》2010-10；《就地权逻辑答周其仁教授》2012-03）', view: '认为以产权改革为核心的成都城乡一体化对全国不具借鉴意义；农户土地权利越大集体行动越难，形成“反公地悲剧”；并以湄潭 93% 农民要求按人口重分土地反问。2013 年另文称成都经验本质是政府主导的土地财政，级差地租来自城市扩张与基础设施投入。' },
    ],
    note: '时间线据澎湃新闻 2014-09-25《周其仁、华生、贺雪峰过招》；贺文见爱思想（data/63824）与红色文化网转载（2013-07-13）。2014 年人民论坛刊贺雪峰文中涉及对周其仁个人的评价性措辞，本站不收录，仅保留学术论点。',
  },
  {
    id: 'x2',
    title: '土地开发权与小产权房：周其仁 vs 华生（2014）',
    sides: [
      { who: '周其仁（经济观察报 2014-04 至 09 系列）', view: '批驳“建筑不自由”“土地配置靠规划不靠市场”；认为城地城房入市多年天下未乱，农地农房入市亦然；不以“小产权一律非法”为前提，反对维持“政府征地 + 卖地”制度。' },
      { who: '华生（2014-04 至 09 系列回应）', view: '认为土地开发建筑权是社会公权力而非私权；小产权房是违建，“如同走私”，不能合法化；农地农房入市方向无异议，但须以“人转”为中心循序推进，不可一蹴而就。' },
    ],
    note: '双方均认同农地农房市场化的长期方向，分歧在小产权房定性与改革次序。摘引出处：澎湃新闻 2014-09-25 论战脉络。',
  },
  {
    id: 'x3',
    title: '农地制度的功能定位：转让权 vs 稳定器（与温铁军的立场对照）',
    sides: [
      { who: '周其仁（2004 论文等）', view: '强调清楚而有保障的农地转让权是城市化中以价格机制配置土地的基础，现行征地制度造成分配不公与效率损失。' },
      { who: '温铁军（《对改革开放30年来农村改革的三个思考》，浙江大学中国农村发展研究院网站 2012-08-15 转载）', view: '反对土地私有化与兼并，认为农民平均占有土地的制度是中国最大的社会稳定器（转述）。' },
    ],
    note: '检索未见二人直接点名交锋，此处为同一议题上的立场对照，非论战记录；温文未点名周其仁。',
  },
];

export const DOUBTFUL = [
  { id: 'q1', item: '标题为“周其仁最新演讲”的自媒体搬运稿', status: '不收录', reason: '常将旧文或整理稿改题为“最新”，不作为原话来源；检索未见经本人或国发院辟谣的特定托名语录。' },
  { id: 'q2', item: '著作《体制成本》', status: '更正', reason: '未见同名专著；《体制成本与中国经济》为论文，刊《经济学（季刊）》2017 年第 16 卷第 3 期，并收入《产权与中国变革》（北京大学出版社 2017）。' },
  { id: 'q3', item: '《货币的教训》副标题', status: '更正', reason: '书目著录为《货币的教训：汇率与货币系列评论》（北京大学出版社 2012-01）。' },
  { id: 'q4', item: '《突围集》副标题', status: '并陈', reason: '出版社著录“寻找改革新势力”，部分平台作“寻找改革新动力”。' },
  { id: 'q5', item: '《农地产权与征地制度》刊期', status: '更正', reason: '为《经济学（季刊）》2004 年第 3 卷第 4 期（第 193—210 页），非第 4 卷第 1 期。' },
  { id: 'q6', item: '第十四届财新峰会演讲时间', status: '更正', reason: '有转载稿称“2023 年 1 月”，实为 2023-11-09；修订稿刊财新《中国改革》2024 年第 1 期。' },
  { id: 'q7', item: '高速增长顶点：2007/2008 年 vs 2012 年', status: '并陈', reason: '2025-10-14 承泽论坛整理稿以 2008 年前后为体制成本拐点；2025-11 南方周末专访称增速 2012 年见顶，口径不同。' },
  { id: 'q8', item: '承泽论坛第 43 期演讲全文', status: '未检验', reason: '流传全文为整理稿，注明未经本人确认，相关条目降为转载级。' },
  { id: 'q9', item: '深圳壹基金法人代表（2011 年起）', status: '〔存疑〕', reason: '仅见维基类资料，未找到壹基金或民政部门公开信息，未列入履历。' },
  { id: 'q10', item: '2025 年财新夏季峰会演讲日期', status: '〔存疑〕', reason: '仅见 2025-10 作者修订稿转载，峰会具体日期未核。' },
  { id: 'q11', item: '成都“还权赋能”综合课题组报告（2010）', status: '〔存疑〕', reason: '多处提及周其仁主持的北大国发院成都课题，报告出版信息未核，未列入著作。' },
];

export const COUNTS = {
  quote: CLAIMS.filter((c) => c.type === '原话').length,
  paraphrase: CLAIMS.filter((c) => c.type === '转述').length,
  doubt: DOUBTFUL.filter((d) => d.status === '〔存疑〕').length + CAREER.filter((c) => c.note?.includes('存疑')).length,
  corpus: CORPUS.length,
  books: BOOKS.filter((b) => b.verified !== 'doubt').length,
};
