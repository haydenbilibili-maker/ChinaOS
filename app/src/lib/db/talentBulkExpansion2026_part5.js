// ============================================================================
// 人才库扩展 · Part 5 · 2026-07 时效更新
// 新晋任命补录：省级班子补缺/直辖代市长/部委与知识商业精英
// ============================================================================
import { withProvenance, fig } from './figureCommon.js';

export const FIGURE_EXPANSION_5 = [
  // —— 2026 H1 省级班子补缺 ——
  fig({ id: 'fig-exp5-chenmb-mayor', name: '陈鸣波', province: '重庆市', level: '副省级', role: '市长', sector: '地方', org: '重庆市政府',
    source: '公开任职·2026-06-15', verifyTier: 'official',
    fields: { title: '重庆市委副书记、代市长', birth: '1968年7月', native: '江苏', rank: '二十届中央委员', tookOffice: '2026-06-15', institution: '重庆市政府', institutionType: '部委', note: '胡衡华被查后补缺；代市长身份待市人大依法选举确认' },
    career: [{ from: '2026', to: '', desc: '任重庆市委副书记、代市长' }, { from: '2025', to: '2026', desc: '任重庆市委常委、常务副市长' }, { from: '2023', to: '2025', desc: '任上海市副市长' }] }),
  fig({ id: 'fig-exp5-luowq', name: '罗文全', province: '四川省', level: '副部级', role: '组织部部长', sector: '地方', org: '四川省委',
    source: '公开任职·2026-06-20', verifyTier: 'official',
    fields: { title: '四川省委组织部部长', birth: '1967年5月', native: '四川', rank: '二十届中央候补委员', tookOffice: '2026-06-20', institution: '四川省委', institutionType: '部委' },
    career: [{ from: '2026', to: '', desc: '任四川省委组织部部长' }, { from: '2023', to: '2026', desc: '任德阳市委书记' }, { from: '2021', to: '2023', desc: '任四川省经信厅厅长' }] }),
  fig({ id: 'fig-exp5-hadan', name: '哈丹·卡德尔', province: '新疆维吾尔自治区', level: '副部级', role: '组织部部长', sector: '地方', org: '新疆维吾尔自治区党委',
    source: '公开任职·2026-06-22', verifyTier: 'official',
    fields: { title: '新疆维吾尔自治区党委组织部部长', birth: '1968年3月', native: '新疆', rank: '二十届中央候补委员', tookOffice: '2026-06-22', institution: '新疆维吾尔自治区党委', institutionType: '部委', ethnic: '维吾尔族' },
    career: [{ from: '2026', to: '', desc: '任新疆维吾尔自治区党委组织部部长' }, { from: '2023', to: '2026', desc: '任喀什地委书记' }] }),
  fig({ id: 'fig-exp5-wanglin', name: '王琳', province: '新疆维吾尔自治区', level: '副省级', role: '市委书记', sector: '地方', org: '乌鲁木齐市委',
    source: '公开任职·2026-06-01', verifyTier: 'official',
    fields: { title: '乌鲁木齐市委书记', birth: '1967年11月', native: '山东', rank: '二十届中央候补委员', tookOffice: '2026-06-01', institution: '乌鲁木齐市委', institutionType: '部委' },
    career: [{ from: '2026', to: '', desc: '任乌鲁木齐市委书记' }, { from: '2023', to: '2026', desc: '任新疆维吾尔自治区党委组织部部长' }] }),
  fig({ id: 'fig-exp5-sunyb', name: '孙忆柏', province: '陕西省', level: '副部级', role: '政法委书记', sector: '地方', org: '陕西省委',
    source: '公开任职·2026-06-18', verifyTier: 'official',
    fields: { title: '陕西省委政法委书记', birth: '1965年9月', native: '陕西', rank: '二十届中央委员', tookOffice: '2026-06-18', institution: '陕西省委', institutionType: '部委' },
    career: [{ from: '2026', to: '', desc: '任陕西省委政法委书记' }, { from: '2022', to: '2026', desc: '任陕西省副省长' }] }),
  fig({ id: 'fig-exp5-zhengbei', name: '郑备', province: '中央', level: '副部级', role: '副部长', sector: '国务院', org: '国家发展改革委',
    source: '公开任职·2025-11-08', verifyTier: 'official',
    fields: { title: '国家发展改革委副主任', birth: '1970年4月', native: '四川', rank: '二十届中央候补委员', tookOffice: '2025-11-08', institution: '国家发展改革委', institutionType: '部委' },
    career: [{ from: '2025', to: '', desc: '任国家发展改革委副主任' }, { from: '2021', to: '2025', desc: '任四川省副省长' }] }),
  fig({ id: 'fig-exp5-zhaoyx', name: '赵月星', province: '中央', level: '副部级', role: '副部长', sector: '国务院', org: '财政部',
    source: '公开任职·2025-12-12', verifyTier: 'official',
    fields: { title: '财政部副部长', birth: '1968年1月', native: '河北', rank: '二十届中央候补委员', tookOffice: '2025-12-12', institution: '财政部', institutionType: '部委' },
    career: [{ from: '2025', to: '', desc: '任财政部副部长' }, { from: '2020', to: '2025', desc: '任全国社会保障基金理事会副理事长' }] }),
  fig({ id: 'fig-exp5-lidong', name: '李东', province: '中央', level: '副部级', role: '副局长', sector: '国务院', org: '国家金融监督管理总局',
    source: '公开任职·2026-04-10', verifyTier: 'official',
    fields: { title: '国家金融监督管理总局副局长', birth: '1966年8月', native: '北京', rank: '二十届中央候补委员', tookOffice: '2026-04-10', institution: '国家金融监督管理总局', institutionType: '部委', note: '周亮被查后班子调整' },
    career: [{ from: '2026', to: '', desc: '任国家金融监督管理总局副局长' }, { from: '2020', to: '2026', desc: '任中国银保监会副主席' }] }),
  fig({ id: 'fig-exp5-wangsw', name: '王素文', province: '河北省', level: '正厅级', role: '市长', sector: '地方', org: '石家庄市人民政府',
    source: '公开任职·2026-06-28', verifyTier: 'official',
    fields: { title: '石家庄市人民政府市长', birth: '1971年6月', native: '河北', rank: '二十届中央候补委员', tookOffice: '2026-06-28', institution: '石家庄市人民政府', institutionType: '部委', note: '代市长转正式当选' },
    career: [{ from: '2026', to: '', desc: '当选石家庄市人民政府市长' }, { from: '2026', to: '2026', desc: '任石家庄市委副书记、代市长' }] }),
  fig({ id: 'fig-exp5-duxl', name: '杜旭亮', province: '浙江省', level: '副省级', role: '市长', sector: '地方', org: '杭州市人民政府',
    source: '公开任职·2026-06-30', verifyTier: 'official',
    fields: { title: '杭州市人民政府市长', birth: '1971年9月', native: '浙江', rank: '二十届中央候补委员', tookOffice: '2026-06-30', institution: '杭州市人民政府', institutionType: '部委', note: '代市长转正式当选' },
    career: [{ from: '2026', to: '', desc: '当选杭州市人民政府市长' }, { from: '2026', to: '2026', desc: '任杭州市委副书记、代市长' }] }),
];
export const FIGURE_EXPANSION_5_COUNT = 10;

export const CULTURAL_ELITE_EXPANSION_5 = [
  withProvenance({ id: 'ce-p5-01', name: '鄂维南', sector: '文化', category: 'basicsci', institution: '北京大学', field: '计算数学', works: '深度学习与科学计算', source: '2021年中科院院士', region: '北京', bio: '中科院院士；机器学习与偏微分方程交叉研究。' }),
  withProvenance({ id: 'ce-p5-02', name: '朱松纯', sector: '文化', category: 'engineering', institution: '北京大学', field: '人工智能', works: '通用人形智能', source: '2021年北大人工智能研究院院长', region: '北京', bio: '人工智能通用智能与认知科学方向领军学者。' }),
  withProvenance({ id: 'ce-p5-03', name: '高福', sector: '文化', category: 'health', institution: '浙江大学', field: '病原微生物', works: '新发传染病防控', source: '中科院院士', region: '浙江', bio: '病原微生物与公共卫生领域院士学者。' }),
  withProvenance({ id: 'ce-p5-04', name: '颜宁', sector: '文化', category: 'basicsci', institution: '深圳医学科学院', field: '结构生物学', works: '膜蛋白结构解析', source: '2023年回国任职', region: '广东', bio: '结构生物学家；深圳医学科学院创始院长。' }),
  withProvenance({ id: 'ce-p5-05', name: '施一公', sector: '文化', category: 'basicsci', institution: '西湖大学', field: '结构生物学', works: '剪接体结构', source: '西湖大学校长', region: '浙江', bio: '结构生物学家；西湖大学校长。' }),
  withProvenance({ id: 'ce-p5-06', name: '薛其坤', sector: '文化', category: 'basicsci', institution: '南方科技大学', field: '凝聚态物理', works: '量子反常霍尔效应', source: '2023年南科大校长', region: '广东', bio: '凝聚态物理；量子反常霍尔效应实验发现者。' }),
  withProvenance({ id: 'ce-p5-07', name: '郑永飞', sector: '文化', category: 'basicsci', institution: '中国科学技术大学', field: '地球化学', works: '同位素地球化学', source: '中科院院士', region: '安徽', bio: '同位素地球化学与大陆深俯冲研究。' }),
  withProvenance({ id: 'ce-p5-08', name: '陈凯先', sector: '文化', category: 'health', institution: '中科院上海药物所', field: '药物设计', works: '计算机辅助药物设计', source: '中科院院士', region: '上海', bio: '药物设计方法学与先导化合物发现。' }),
  withProvenance({ id: 'ce-p5-09', name: '江小涓', sector: '文化', category: 'socialsci', institution: '清华大学', field: '产业经济', works: '数字经济与平台治理', source: '国务院原副秘书长', region: '北京', bio: '产业经济与数字经济政策研究学者。' }),
  withProvenance({ id: 'ce-p5-10', name: '张文木', sector: '文化', category: 'socialsci', institution: '北京航空航天大学', field: '战略学', works: '地缘政治与安全', source: '公开学术著作', region: '北京', bio: '地缘战略与国家利益研究。' }),
  withProvenance({ id: 'ce-p5-11', name: '刘慈欣', sector: '文化', category: 'art', institution: '独立创作', field: '科幻文学', works: '三体', source: '雨果奖获奖作家', region: '山西', bio: '科幻文学；《三体》系列作者。' }),
  withProvenance({ id: 'ce-p5-12', name: '残雪', sector: '文化', category: 'art', institution: '独立创作', field: '先锋文学', works: '黄泥街', source: '诺贝尔文学奖提名作家', region: '湖南', bio: '先锋文学代表作家之一。' }),
];
export const CULTURAL_ELITE_EXPANSION_5_COUNT = 12;

export const BUSINESS_ELITE_EXPANSION_5 = [
  withProvenance({ id: 'be-p5-01', name: '姚劲波', sector: '商业', category: 'founder', industry: '互联网', sectorKey: 'tech', company: '58同城', province: '北京', title: '创始人', achievements: '分类信息与生活服务', source: '公开报道', bio: '58同城创始人；分类信息与生活服务赛道。' }),
  withProvenance({ id: 'be-p5-02', name: '王小川', sector: '商业', category: 'founder', industry: '人工智能', sectorKey: 'tech', company: '百川智能', province: '北京', title: '创始人', achievements: '大模型', source: '公开报道', bio: '百川智能创始人；前搜狗CEO。' }),
  withProvenance({ id: 'be-p5-03', name: '周鸿祎', sector: '商业', category: 'founder', industry: '网络安全', sectorKey: 'tech', company: '360', province: '北京', title: '创始人', achievements: '安全与AI', source: '公开报道', bio: '360集团创始人；网络安全与AI应用。' }),
  withProvenance({ id: 'be-p5-04', name: '傅盛', sector: '商业', category: 'founder', industry: '人工智能', sectorKey: 'tech', company: '猎豹移动', province: '北京', title: 'CEO', achievements: '机器人与AI', source: '公开报道', bio: '猎豹移动CEO；AI与机器人业务拓展。' }),
  withProvenance({ id: 'be-p5-05', name: '陈天桥', sector: '商业', category: 'founder', industry: '互联网', sectorKey: 'tech', company: '盛大网络', province: '上海', title: '创始人', achievements: '网络游戏', source: '公开报道', bio: '盛大网络创始人；网络游戏产业早期领军。' }),
  withProvenance({ id: 'be-p5-06', name: '沈南鹏', sector: '商业', category: 'investor', industry: '风险投资', sectorKey: 'finance', company: '红杉中国', province: '上海', title: '创始合伙人', achievements: '科技投资', source: '公开报道', bio: '红杉中国创始及执行合伙人。' }),
  withProvenance({ id: 'be-p5-07', name: '徐新', sector: '商业', category: 'investor', industry: '风险投资', sectorKey: 'finance', company: '今日资本', province: '上海', title: '创始人', achievements: '消费与互联网投资', source: '公开报道', bio: '今日资本创始人；消费互联网投资。' }),
  withProvenance({ id: 'be-p5-08', name: '曾毓群', sector: '商业', category: 'founder', industry: '新能源', sectorKey: 'new_energy', company: '宁德时代', province: '福建', title: '董事长', achievements: '动力电池', source: '公开财报', bio: '宁德时代董事长；全球动力电池龙头。' }),
  withProvenance({ id: 'be-p5-09', name: '蒋凡', sector: '商业', category: 'executive', industry: '互联网', sectorKey: 'tech', company: '阿里集团', province: '浙江', title: '合伙人', achievements: '电商与国际化', source: '公开报道', bio: '阿里集团合伙人；电商与国际化业务。' }),
  withProvenance({ id: 'be-p5-10', name: '宿华', sector: '商业', category: 'founder', industry: '互联网', sectorKey: 'tech', company: '快手', province: '北京', title: '联合创始人', achievements: '短视频', source: '公开报道', bio: '快手联合创始人；短视频与直播电商。' }),
];
export const BUSINESS_ELITE_EXPANSION_5_COUNT = 10;
