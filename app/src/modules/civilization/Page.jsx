import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 文明透视 · 12 卷源代码（全 12 卷已建）
// 内容迁自根目录 civilization-*.html 独立报告（原文保留，可外链全文阅读）
// 文明 OS 栈隐喻：自下而上 物理底座→宇宙观→内核→源代码→减震器→硬件→心理补丁→非正式层→财富闭环
// 卷一为总纲（内核引导）；卷九强制层、卷十交换层补齐全栈
// ============================================================================

const VOLUMES = {
  v1: {
    num: '卷一', title: '总纲 · 文明操作系统总论', role: 'L9 总纲 · 内核引导', color: '#f43f5e',
    file: '',
    thesis: '把全栈串成一部总论：文明不是观念的随机堆叠，而是一套可分层调试的操作系统——自下而上从地理物理底座（L0），经宇宙观（L1）、法家内核（L2）、儒家源代码（L3）、道家减震器（L4）、汉字科举硬件（L5）、佛学心理补丁（L6）、人情非正式层（L7），直到盐铁财富闭环（L8）。本卷提供「引导扇区」：读懂层间调用关系，方能理解今日制度与心理为何如此配置（思想史隐喻，非历史决定论）。',
    sections: [
      ['一 · 分层调试观：从物理到财富', '每一层解决上一层无法解决的问题：地理倒逼集权（L0→L2），集权需要软黏合（L2→L3），紧绷系统需要减震（L3→L4），广域整合需要标准化硬件（L5），意义溢出需要心理补丁（L6）。栈是历史试错的沉积，而非顶层设计。'],
      ['二 · 内核引导顺序：外儒内法剂之以道', '系统启动的核心三件套——法家供强制内核、儒家供合法性源代码、道家供异常恢复。三者非并列而是分时调度：顺境儒法扩张、逆境切道家熬冬，构成两千年「治—乱」周期的调度算法。'],
      ['三 · 层间耦合与超稳定', '汉字—科举（L5）把精英思想入口收敛到同一轨道，与法家内核（L2）形成超稳定锁定：高整合、低方差，这既是文明延续之因，也是李约瑟难题之果——稳定与创新的根本权衡。'],
      ['四 · 总纲的现代读法', '改革开放可读作一次「重启进入安全模式」（道家无为）后逐步加载各层；当代「集中力量办大事」「编制执念」「混合所有制」皆是旧栈在新硬件上的重新加载。本卷是其余十一卷的目录与调用图。'],
    ],
  },
  v11: {
    num: '卷十一', title: '地理宿命与天下观', role: 'L0 物理底座', color: '#64748b',
    file: 'civilization-geography-destiny-tianxia.html',
    thesis: '一切制度与观念，都须落实在物质地基之上。高度中央集权与强集体取向，并非思想史偶然，而与「黄河—治水」「400 毫米降水线两侧农牧张力」「土地与人口的极限博弈」长期互锁。读懂这片土地的物理约束，才能理解历史上对「大一统」与「治—乱」的极端敏感。',
    sections: [
      ['一 · 地理密室与治水帝国', '西有青藏高原、北有戈壁大漠、东临太平洋——半封闭「地理密室」使文明只能向内内卷。黄河含沙悬河、决堤改道，任何村落与小诸侯都无法独立应对，倒逼出能跨部落调动百万劳工的强权核心：大一统集权从一开始就是物理环境倒逼出的生存工具（治水帝国理论）。'],
      ['二 · 400 毫米等降水线', '一条隐形刻度线决定两千年历史走向：线东南降水充沛，演化出定居农耕文明（汉）；线西北干旱少雨，只能演化出逐水草而居的游牧文明（匈奴/突厥/蒙古）——两千年战争的楚河汉界。'],
      ['三 · 马尔萨斯重置', '治乱循环的底层是恐怖的人口大周期：盛世人口逼近土地承载极限→战乱饥荒崩溃重置→再恢复。对「乱」的极端恐惧由此刻入治理基因。'],
      ['四 · 天下体系', '非威斯特伐利亚的宇宙秩序：以文化同心圆（华夏—藩属—四夷）而非主权平等组织世界想象，构成当代地缘观的历史底色。'],
    ],
  },
  v7: {
    num: '卷七', title: '易经与五行宇宙观', role: 'L1 宇宙观底层', color: '#8b5cf6',
    file: 'civilization-yijing-wuxing-cosmology.html',
    thesis: '孔孟老庄是「上层语言」；更底层是以阴阳消长与五行生克关联组织经验世界的传统模型，常与整体论、权变思维与绩效合法性叙事相互缠绕（思想史隐喻，非占卜指引）。',
    sections: [
      ['一 ·《易经》与六爻', '六十四卦构成态势流转的组合空间，强调转化而非绝对定格；阴阳二元常被类比信息态/能量态的互补转化（与莱布尼茨二进制为不同文化脉络的数学发现）。'],
      ['二 · 五行：过程而非实体', '「五行」常被误译为 static elements；在关联思维中更接近五种功能相位——与方位、时令、脏腑、情志构成映射网。'],
      ['三 · 天命：绩效合法性原型', '西周以降「天命」与德政、民心、灾异警示并置——「敬天保民」与欧洲「人格神授君权」形成理想型对照：统治合法性自始挂钩治理绩效。'],
      ['四 · 祖先崇拜与宗法', '纵向香火与横向名望构成血缘—历史中的「延续」叙事；法儒道释与汉字—科举均可在阴阳权变、天命绩效、血缘延续等底层隐喻上找到接口。'],
    ],
  },
  v2: {
    num: '卷二', title: '法家与外儒内法', role: 'L2 内核 Kernel', color: '#c41e3a',
    file: 'civilization-legalism-iron-core.html',
    thesis: '儒家以道德与血缘软性黏合社会，法家则以严刑峻法与绝对权力硬性锻造国家机器。法家不信人性本善，只信利益驱动与恐惧威慑——正是这一底层逻辑赋予古代中国极限社会动员能力，奠定大一统帝国的物理基础。',
    sections: [
      ['一 · 韩非子权力三角：法·术·势', '法=公开的规则（成文法律与 KPI，「刑九赏一」，触犯无论贵贱必惩、达标必赏）；术=隐秘的权谋（驭下之术）；势=绝对的威权（位势压制）。'],
      ['二 · 外儒内法：帝国合成术', '秦纯用法家，高效而暴、二世而亡。汉以后发明两千年政治史的关键专利——「外儒内法，剂之以道」：表面天子爱民、父母官仁义礼智信（降低维稳成本的话语外壳），内核是冷硬的法家机器。'],
      ['三 · 秦制奇迹：国家能力极限压榨', '「编户齐民」+「军功爵制」：破贵族垄断、平民斩首可获土地爵位；国家直向农户征税征兵，动员率在古代语境下极高，终以体量碾压六国。'],
      ['四 · 现代回响', '大一统基因与「集中力量办大事」：国家执行力与超级工程、数字化「编户齐民」与强监管。风险提示：重富国强兵、轻个体消费的历史惯性。'],
    ],
  },
  v4: {
    num: '卷四', title: '儒家与社会底层逻辑', role: 'L3 源代码 Source', color: '#e8a317',
    file: 'civilization-confucianism-source-code.html',
    thesis: '儒家不仅是道德哲学，更是一套经两千多年迭代的「超大型人类社会管理系统」——定义了服从与责任、个体与集体的边界，构成中华文明历劫不灭的核心源代码。',
    sections: [
      ['一 · 差序格局与家国同构', '西方文明基础是个人主义与契约；儒家文明基础是关系与血缘扩展。国家结构是家庭结构的放大，君臣是父子的延伸（「求忠臣必于孝子之门」）：人人尽孝即尽忠，秩序如星辰。'],
      ['二 · 五常矩阵：被皇权篡改的原始代码', '孔孟原教旨极具革命性（「民为贵，社稷次之，君为轻」）；为适应大一统统治需要，董仲舒与后世理学对其大幅「阉割改造」——强化秩序、削弱民权。'],
      ['三 · 历史演进', '春秋：理想主义火种（内圣外王，孟子甚至承认革命权）→ 汉代：官方化与神学化 → 宋明：向内求索的哲学巅峰。'],
      ['四 · 现代投射：幽灵源代码仍在运行', '「万般皆下品惟有读书高」的教育执念；大家长制与人情社会；「大政府」的合法性基础。'],
    ],
  },
  v3: {
    num: '卷三', title: '道家与战略弹性', role: 'L4 减震器 Damper', color: '#10b981',
    file: 'civilization-daoism-shock-absorber.html',
    thesis: '儒家教人「入世」，法家教人「驭世」——二者皆紧绷，经济崩溃或王朝末年系统易折。道家教人在绝境中退守、存续与顺势而为：刻在文化里的均值回归算法，亦是极度内卷下的文明减震器。',
    sections: [
      ['一 · 周期定律：「反者道之动」', '汉初文景、唐初贞观：面对残破经济采黄老之术——轻徭薄赋、与民休息、放松管制，靠自发秩序修复元气；均值回归刻入治国周期。'],
      ['二 · 弱势生存：「上善若水」', '不对称战略三式：避其锋芒、处众人之所恶；柔弱胜刚强；无用之用、方为大用。'],
      ['三 · 无为而治', '底线规则 + 负面清单 + 少干预。改革开放初期包产到户、乡镇企业野蛮生长，本质是退回道家式「无为而治」——「我无为而民自化」。'],
      ['四 ·「躺平」作为防御机制', '非暴力不合作与企业「冬眠战略」。顺境：儒家画愿景、法家用 KPI 驱动扩张；逆境：切换道家低耗熬过冰河期——可据此观察政策从强监管向稳预期的均值回归。'],
    ],
  },
  v5: {
    num: '卷五', title: '汉字与科举', role: 'L5 硬件外挂 Hardware', color: '#22d3ee',
    file: 'civilization-hanzi-keju-hardware.html',
    thesis: '欧洲与中国面积相仿，表音文字与方言分化易导向政治碎裂；中国能长期维持广域整合，靠两项制度—技术组合：超越口语的视觉书写协议（汉字）+ 跨血缘的精英选拔与意识形态标准化网络（科举）。',
    sections: [
      ['一 · 汉字协议', '拼音文字书写与发音强绑定，地域语音分化易演化为文字分化；汉字以形义关联为主，「二维」视觉符号把书写与意义直接绑定，弱化语音隔离对书面政令与经典传承的切割。'],
      ['二 · 科举：标准化选拔与思想格式化', '以标准化考试衔接政权与士人：冲击血缘门阀，同时把天下精英持续纳入同一套经典—文体训练轨道，在制度上强烈收敛「可做官」的思想入口。'],
      ['三 · 李约瑟难题', '古代技术领先却未内生出现代科学—工业革命：一种解释是汉字—科举加固的超稳定集权与知识筛选，以压制思想与产业的「高方差实验」为代价。'],
      ['四 · 现代投射', '高考作为阶层流动的制度化通道、「编制」执念，与数字时代的「车同轨、书同文」（统一平台与标准）隐喻。'],
    ],
  },
  v6: {
    num: '卷六', title: '佛学中国化与深层心理', role: 'L6 心理补丁 Patch', color: '#f0abfc',
    file: 'civilization-buddhism-zen-sanctuary.html',
    thesis: '儒家「未知生焉知死」悬置终极痛苦、法家将人工具化、道家善退守却少谈彼岸——乱世与个体重创下意义系统现「内存溢出」。佛教中国化提供可操作的超越叙事与情绪卸载接口，构成历史的「心理层」缓冲带。',
    sections: [
      ['一 · 因果轮回：第二套正义叙事', '现实司法向权贵倾斜时，「业报轮回」在民间扩散为长线正义想象——施暴者于来世受惩，降低受害者即时暴力复仇冲动：社会心理稳定器（亦可能被权力挪用为驯顺话术）。'],
      ['二 · 禅宗：本土化「降维」', '印度经院佛教卷帙浩繁；禅宗直指人心、顿悟见性，把解脱从长劫苦修收束到劈柴担水的日用之中——极简操作适配士庶心智。'],
      ['三 · 三教合一：生命周期心理权重', '少年儒家进取、中年道家调适、暮年佛家安顿——士大夫精神依赖随生命阶段切换的「三教合一」配置。'],
      ['四 · 民间实用主义', '职能化天庭想象、许愿—还愿逻辑、失灵即切换的「神灵消费」。禅宗解构倾向与功利弹性，使教权难以长期压倒王权，也为近现代接受科技工业化提供现世主义底座。'],
    ],
  },
  v8: {
    num: '卷八', title: '人情面子与江湖', role: 'L7 非正式层 Informal', color: '#fb923c',
    file: 'civilization-guanxi-mianzi-jianghu.html',
    thesis: '成文法与科层指令是一层；日常协作中还叠放着关系、面子与圈层信任。费孝通「差序格局」、人情往来与「庙堂—江湖」二分，是理解组织行为与政策摩擦的社会学启发式（需与制度数据对照，避免本质论）。',
    sections: [
      ['一 · 差序格局', '信任与资源随圈层衰减；「自己人」边界的划定与移动；商务语境中的「关系劳动」。'],
      ['二 · 面子与人情：非正式信用', '互惠与隐性义务、调停与声誉担保构成平行于法律的信用体系。治理风险：人情包裹的权力。'],
      ['三 · 罪感与耻感', '罪感取向（对神的内在负罪 · 西欧理想型）vs 耻感取向（对他人目光的外化约束 · 东亚理想型）的行为约束对照。'],
      ['四 · 庙堂与江湖', '体制核心与游民、商贩等边缘网络并存；危机期非正式互助与暴力动员都可能膨胀。当代民企「兄弟/家人」修辞可与劳动关系、合规一并阅读——理解「纸面制度 vs 执行弹性」。'],
    ],
  },
  v12: {
    num: '卷十二', title: '盐铁专卖与双轨经济', role: 'L8 财富闭环 Loop', color: '#d4af37',
    file: 'civilization-salt-iron-dual-economy.html',
    thesis: '为什么既有统管命脉的庞大国企，又有全球最「卷」最具韧性的民营生态？这不是现代发明的混合所有制，而是自汉代盐铁之辩以来的「大一统经济学」：国家控扼命脉以维稳，民间在缝隙中极致内卷以图存。',
    sections: [
      ['一 ·《盐铁论》：垄断的制度源头', '公元前 81 年盐铁会议确立铁律：帝国控制与御敌成本极高，国家必须垄断超额利润行业。古代盐→现代烟草/电信/数据；古代铁→能源/重工/矿产；古代铸币→金融主干与土地财政。'],
      ['二 · 宗族微资本：小农创业基因', '毛细血管市场由嵌在儒家「家本位」中的宗族微型资本主义驱动：家庭是承担无限责任、强烈追求代际积累的小协作单元；吃苦与高储蓄的伦理压力显著抬高劳动承受阈值。'],
      ['三 · 士农工商：资本的政治天花板', '商居四民之末：财富膨胀触及系统性风险线即遭抑制——资本难以逾越的政治天花板是两千年的结构常量。'],
      ['四 · 终极财富闭环', '经商致富→购地置产→供子读书→入仕为官：财富必须经由土地与功名「洗白」并接入权力，构成中国人的终极财富闭环；其现代映射可与金融、民营经济专题对照阅读。'],
    ],
  },
  v9: {
    num: '卷九', title: '暴力与军事组织 · 枪杆子的文明逻辑', role: 'L2b 强制层 · 暴力垄断', color: '#991b1b',
    file: '',
    thesis: '法家内核（L2）的合法性最终落实在对暴力的垄断之上。「枪杆子里面出政权」不是现代口号，而是贯穿两千年的结构常量：谁能稳定地组织、供养并控制武装，谁就握有真正的内核权限。本卷处理暴力如何被收编、外包又再收编——以及它为何总是文明栈中最危险的一层（思想史隐喻，非军事史实证）。',
    sections: [
      ['一 · 暴力的垄断：从封建私兵到国家常备', '春秋贵族私兵割据 → 秦以「编户齐民」直接征兵、剥夺地方武装权 → 国家成为暴力的唯一合法供应商。暴力一旦私有化（藩镇、军阀），即触发系统崩溃与改朝换代。'],
      ['二 · 府兵与募兵：成本与忠诚的两难', '府兵制（兵农合一、寓兵于农）低成本但战力随土地兼并瓦解；募兵制（职业军人）战力强但财政沉重且易生骄兵。两套调度方案的反复切换，是历代财政—军事张力的核心。'],
      ['三 · 军功爵：暴力的激励工程', '商鞅军功爵把杀敌与土地、爵位直接挂钩，将暴力转化为可计量、可兑付的国家 KPI——平民凭斩首逆袭，贵族世袭被打破。这是法家内核最锋利的动员接口（参见卷二秦制）。'],
      ['四 · 党指挥枪：暴力的再政治化', '近现代的关键制度创新，是把军队从「将领私属/职业雇佣」重新收归政治组织的绝对领导——「党指挥枪」确保暴力服从政治内核而非个人或财阀。可与卷二法家内核、卷十二国家命脉垄断对照阅读：强制层始终是大一统的最后地基。'],
    ],
  },
  v10: {
    num: '卷十', title: '商业伦理与市场 · 士农工商', role: 'L8b 交换层 · 重义轻利', color: '#b45309',
    file: '',
    thesis: '为何中国早有发达的市场与商人，却始终未让商人阶层登上权力顶端？因为在这套栈里，市场是被允许的「交换层」，却被儒家义利之辨与抑商传统反复设限。本卷处理交换的伦理边界：财富可以积累，但「言利」必须被道德话语包裹，资本的政治天花板由此而生（思想史隐喻，非经济史实证）。',
    sections: [
      ['一 · 士农工商：抑商的等级编码', '四民秩序把商人排在末位——并非商业不重要，而是要防止流动的资本侵蚀以土地与功名为锚的稳定秩序。重农抑商是对「交换层」越权的制度性防火墙。'],
      ['二 · 义利之辨：被道德化的市场', '「君子喻于义，小人喻于利」「正其谊不谋其利」——逐利被置于道德审判之下。商人须以慈善、修桥铺路、捐纳功名等方式「赎买」言利之罪，市场行为被迫披上伦理外衣。'],
      ['三 · 宗族微资本：被允许的毛细市场', '抑商抑的是「大商」对权力的威胁，而非小协作单元。嵌在儒家家本位中的宗族微型资本主义（参见卷十二）获得默许：家庭承担无限责任、高储蓄、代际积累，构成最有韧性的市场底盘。'],
      ['四 · 双轨呼应：盐铁之上的交换层', '本卷与卷十二盐铁双轨互为表里：国家垄断命脉（盐铁）划定上限，义利之辨与抑商传统约束伦理，民间则在缝隙中极致内卷。今日「先富—共富」「企业家精神 vs 防止资本无序扩张」的张力，正是这套交换层伦理的现代回响。'],
    ],
  },
};

// 文明栈：自下而上的层序（卷一总纲置顶为内核引导）
const STACK_ORDER = ['v11', 'v7', 'v2', 'v9', 'v4', 'v3', 'v5', 'v6', 'v8', 'v12', 'v10', 'v1'];

// 中西文明 OS 对照维度（思想史理想型，非实证）
const COMPARE_DIMS = [
  { name: '个体 / 集体', max: 100 },
  { name: '超越性来源', max: 100 },
  { name: '权力合法性', max: 100 },
  { name: '变革方式', max: 100 },
  { name: '商业地位', max: 100 },
  { name: '法律 / 关系', max: 100 },
];
// 数值为「中华栈在该维度的相对取向」示意刻度（0=西方理想型一端，100=中华理想型一端）
const COMPARE_TABLE = [
  ['个体 / 集体', '个人主义 · 契约社会', '集体 / 关系 · 家国同构', 85],
  ['超越性来源', '人格神 · 彼岸超越', '天命 · 祖先 · 现世内在', 80],
  ['权力合法性', '神授君权 / 民约', '绩效合法性 · 敬天保民', 75],
  ['变革方式', '革命 · 断裂 · 制度重设', '均值回归 · 治乱循环 · 改良', 70],
  ['商业地位', '商人入主流 · 资本驱动', '士农工商 · 资本政治天花板', 88],
  ['法律 / 关系', '成文法 · 罪感约束', '人情面子 · 耻感约束', 78],
];
const compareRadar = {
  tooltip: {},
  radar: { indicator: COMPARE_DIMS, axisName: { color: '#93a1b5', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
  legend: { data: ['中华文明栈', '西方文明栈（理想型）'], textStyle: { color: '#93a1b5' }, bottom: 0 },
  series: [{
    type: 'radar',
    data: [
      { value: COMPARE_TABLE.map((r) => r[3]), name: '中华文明栈', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.16)' }, itemStyle: { color: '#c41e3a' } },
      { value: COMPARE_TABLE.map((r) => 100 - r[3]), name: '西方文明栈（理想型）', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' }, itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

// 治乱调度：每层在「顺境扩张 / 逆境熬冬」两种系统态下的角色
//   boom=顺境主调度 · bust=逆境主调度 · both=两态常驻（暴力强制）· base=结构常量底座
const REGIME = { v2: 'boom', v4: 'boom', v3: 'bust', v6: 'bust', v9: 'both', v11: 'base', v7: 'base', v5: 'base', v8: 'base', v12: 'base', v10: 'base', v1: 'base' };
const REGIME_TAG = { boom: ['顺境调度', '#e8a317'], bust: ['逆境调度', '#10b981'], both: ['两态常驻', '#991b1b'], base: ['结构常量', '#64748b'] };

// 逐卷 → 现实业务模块接口（叠读直跳）
const VOL_LINKS = {
  v1: [{ to: '/governance', label: '治理现代化', note: '总纲的层间调用图，对应当代国家治理体系的分层装载。' }, { to: '/reform', label: '改革开放', note: '「重启进入安全模式后逐层加载」的现实版本。' }],
  v11: [{ to: '/straits', label: '台海局势', note: '地理密室与天下观 → 地缘重力与硅盾。' }, { to: '/bri', label: '一带一路', note: '半封闭地理的通道再造与外向突围。' }, { to: '/regional', label: '区域协调', note: '400 毫米线两侧的农牧—板块张力当代回响。' }],
  v7: [{ to: '/ideology', label: '意识形态理论', note: '天命绩效合法性 → 当代绩效正当性叙事的底层隐喻。' }],
  v2: [{ to: '/govsystem', label: '政府体系', note: '法家 KPI 与编户齐民 → 压力型体制与执行算法。' }, { to: '/powerlogic', label: '权力逻辑', note: '外儒内法剂之以道的当代运行。' }, { to: '/soe', label: '国有资本', note: '集中力量办大事的制度基因。' }],
  v4: [{ to: '/education', label: '教育', note: '「万般皆下品惟有读书高」的源代码仍在运行。' }, { to: '/socialgov', label: '基层治理', note: '差序格局与家国同构 → 网格与人情社会。' }],
  v3: [{ to: '/reform', label: '改革开放', note: '包产到户、乡镇企业野蛮生长 = 道家无为而治。' }, { to: '/private', label: '民营经济', note: '逆境「冬眠战略」与均值回归。' }],
  v5: [{ to: '/education', label: '教育', note: '科举 → 高考作为阶层流动制度化通道。' }, { to: '/talent', label: '人才库', note: '标准化精英选拔网络的当代映射。' }],
  v6: [{ to: '/culture', label: '文化软实力', note: '三教合一与现世主义底座 → 心理与价值供给。' }],
  v8: [{ to: '/socialgov', label: '基层治理', note: '面子人情的非正式信用与执行弹性。' }, { to: '/private', label: '民营经济', note: '民企「兄弟/家人」修辞与关系劳动。' }],
  v12: [{ to: '/soe', label: '国有资本', note: '盐铁垄断命脉 → 战略底座与链主。' }, { to: '/private', label: '民营经济', note: '缝隙中极致内卷的宗族微资本。' }],
  v9: [{ to: '/military', label: '军事力量', note: '枪杆子里出政权 = 暴力垄断的强制层。' }],
  v10: [{ to: '/private', label: '民营经济', note: '义利之辨与抑商传统 → 资本的政治天花板。' }, { to: '/soe', label: '国有资本', note: '盐铁之上的交换层伦理。' }],
};

// 文明栈分层条：自下而上渲染（reverse STACK_ORDER），active 高亮，dimMode 控制治乱亮灭
function StackBars({ active, onPick, dimFor }) {
  return (
    <div className="space-y-1">
      {[...STACK_ORDER].reverse().map((k) => {
        const x = VOLUMES[k];
        const sel = k === active;
        const op = dimFor ? dimFor(k) : 1;
        return (
          <button key={k} onClick={() => onPick(k)}
            className="w-full text-left rounded flex items-stretch gap-0 overflow-hidden transition-all"
            style={{ background: sel ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${sel ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer', opacity: op }}>
            <span style={{ width: 5, background: x.color, flexShrink: 0 }} />
            <span className="flex items-center gap-3 px-3 py-2 flex-1">
              <span className="text-[10px] mono shrink-0" style={{ width: 132, color: x.color }}>{x.role}</span>
              <span className="text-xs flex-1" style={{ color: sel ? '#fff' : 'var(--text-secondary)' }}>{x.num} · {x.title}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

const TABS = [['stack', '文明栈总览'], ['read', '逐卷精读'], ['schedule', '治乱调度算法'], ['compare', '中西对照']];

export default function Page() {
  const [vol, setVol] = useState('v2');
  const [tab, setTab] = useState('stack');
  const [regime, setRegime] = useState('boom');
  const v = VOLUMES[vol];
  const [rtag, rcolor] = REGIME_TAG[REGIME[vol]];
  const btn = (a) => ({ background: a ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: a ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 14px', fontSize: 13 });
  // 调度态下各层不透明度：主调度全亮、常驻次亮、底座微亮、错配态压暗
  const dimFor = (k) => {
    const r = REGIME[k];
    if (r === regime || r === 'both') return 1;
    if (r === 'base') return 0.5;
    return 0.16;
  };

  return (
    <div>
      <PageHeader badge="Civilization Lens · 12 卷"
        title="文明透视 · 文明源代码栈"
        subtitle="把文明拆成一台可分层调试的操作系统：地理物理底座 → 宇宙观 → 法家内核 → 儒家源代码 → 道家减震器 → 汉字科举硬件 → 佛学心理补丁 → 人情非正式层 → 盐铁财富闭环，以总纲串成引导扇区" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        与「<Link to="/depth" className="mono" style={{ color: 'var(--cyber-cyan)' }}>深度透视</Link>」经济—地缘主线并列的文化战略长篇。核心隐喻：每一卷是一层，自下而上叠成全栈；<strong style={{ color: 'var(--text-primary)' }}>外儒内法剂之以道</strong>不是并列，而是<strong style={{ color: 'var(--text-primary)' }}>分时调度</strong>——顺境儒法扩张、逆境切道家熬冬。12 卷已全部建成（思想史与制度隐喻，非历史决定论）。
      </p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="12/12" label="全栈卷数 · 已就绪" accent="#c41e3a" />
        <Stat value="10 层" label="OS 栈深度（9+总纲）" accent="#22d3ee" />
        <Stat value="2000+" label="年 · 时间纵深" accent="#e8a317" />
        <Stat value="6 维" label="中西对照维度" accent="#10b981" />
      </Grid>

      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} style={btn(k === tab)} className="mono">{label}</button>)}
      </div>

      {tab === 'stack' && (
        <Grid cols={2} className="mb-6">
          <Card title="文明 OS 栈 · 自下而上（点层切换，→ 跳「逐卷精读」）">
            <StackBars active={vol} onPick={(k) => { setVol(k); }} />
            <p className="text-[11px] mono mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>// 左侧色条 = 各层在栈中的位置；下层为上层提供运行前提，上层解决下层无法解决的问题</p>
          </Card>
          <Card title={`${v.num} · ${v.title}`}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              {v.file
                ? <a href={`../${v.file}`} target="_blank" rel="noreferrer" className="text-[11px] mono" style={{ color: 'var(--cyber-cyan)' }}>→ 全文报告</a>
                : <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// 本卷内嵌</span>}
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
            <button onClick={() => setTab('read')} className="text-xs mono" style={{ color: 'var(--cyber-cyan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>展开四节精读 + 现实接口 →</button>
          </Card>
        </Grid>
      )}

      {tab === 'read' && (
        <div className="mb-6">
          <div className="flex gap-1.5 flex-wrap mb-4">
            {[...STACK_ORDER].reverse().map((k) => (
              <button key={k} onClick={() => setVol(k)} className="text-xs px-2.5 py-1 rounded mono"
                style={{ background: k === vol ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === vol ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === vol ? VOLUMES[k].color : 'transparent'}`, cursor: 'pointer' }}>
                {VOLUMES[k].num}
              </button>
            ))}
          </div>
          <Card className="mb-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{v.num} · {v.title}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: v.color }}>{v.role}</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
              {v.file && <a href={`../${v.file}`} target="_blank" rel="noreferrer" className="text-[11px] mono" style={{ color: 'var(--cyber-cyan)' }}>→ 全文报告</a>}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.thesis}</p>
          </Card>
          <Grid cols={2} className="mb-4">
            {v.sections.map(([t, d]) => (
              <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
            ))}
          </Grid>
          {VOL_LINKS[vol] && <CrossLinks title={`${v.num} · 现实接口 · 直跳业务模块`} links={VOL_LINKS[vol]} />}
        </div>
      )}

      {tab === 'schedule' && (
        <Grid cols={2} className="mb-6">
          <Card title="治乱调度算法 · 同一套栈的两种系统态">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setRegime('boom')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'boom' ? 'rgba(232,163,23,0.2)' : 'var(--bg-elevated)', color: regime === 'boom' ? '#e8a317' : 'var(--text-secondary)', border: `1px solid ${regime === 'boom' ? '#e8a317' : 'transparent'}`, cursor: 'pointer' }}>顺境 · 儒法扩张</button>
              <button onClick={() => setRegime('bust')} className="flex-1 text-sm py-2 rounded mono"
                style={{ background: regime === 'bust' ? 'rgba(16,185,129,0.2)' : 'var(--bg-elevated)', color: regime === 'bust' ? '#10b981' : 'var(--text-secondary)', border: `1px solid ${regime === 'bust' ? '#10b981' : 'transparent'}`, cursor: 'pointer' }}>逆境 · 道家熬冬</button>
            </div>
            <StackBars active={vol} onPick={setVol} dimFor={dimFor} />
            <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>// 亮 = 当前态主调度层 · 半亮 = 结构常量底座 · 暗 = 另一态才激活</p>
          </Card>
          <Card title={regime === 'boom' ? '顺境调度 · 儒法驱动扩张' : '逆境调度 · 道家低耗熬冬'}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {regime === 'boom'
                ? '王朝上升期 / 经济扩张期：法家内核（L2）以 KPI 与动员驱动增长，儒家源代码（L3）供合法性与愿景，汉字—科举（L5）持续收敛精英入口。系统高整合、高动员，代价是低方差、压抑高风险创新（李约瑟难题之果）。现实回响：强监管、超级工程、集中力量办大事。'
                : '王朝末年 / 经济崩溃期：切换道家减震器（L4）——轻徭薄赋、与民休息、放松管制、负面清单，靠自发秩序修复元气；佛学心理补丁（L6）卸载意义溢出。系统低耗、容错、均值回归。现实回响：从强监管转向稳预期、休养生息、「我无为而民自化」。'}
            </p>
            <div className="space-y-2">
              {Object.entries(REGIME).filter(([, r]) => r === regime || r === 'both').map(([k]) => (
                <button key={k} onClick={() => { setVol(k); setTab('read'); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: VOLUMES[k].color }} />
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{VOLUMES[k].num} · {VOLUMES[k].title}</span>
                  <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>{VOLUMES[k].role}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>暴力强制层（L2b）两态常驻——无论扩张或收缩，对暴力的垄断始终是内核的最终保障。</p>
          </Card>
        </Grid>
      )}

      {tab === 'compare' && (
        <Grid cols={2} className="mb-6">
          <Card title="中西文明操作系统对照 · 雷达（理想型 · 非实证）">
            <EChart option={compareRadar} style={{ height: 300 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>刻度向外（红）= 偏中华栈取向，向内反向（青）= 偏西方理想型；二者每一维度互为镜像，仅作思想史对照，不代表优劣或精确测量。</p>
          </Card>
          <Card title="维度逐项对照表">
            <div className="space-y-2">
              {COMPARE_TABLE.map(([dim, west, china]) => (
                <div key={dim} className="pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{dim}</div>
                  <div className="flex gap-2 text-[11px] leading-snug">
                    <div className="flex-1" style={{ color: 'var(--cyber-cyan)' }}>西 · {west}</div>
                    <div className="flex-1 text-right" style={{ color: 'var(--china-red)' }}>{china} · 华</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      )}

      <Card title="叠读提示 · 文明栈与现实模块的接口（点「逐卷精读」可逐卷直跳）">
        <Grid cols={3}>
          {[['法家内核 ↔ 制度与改革', '卷二的秦制动员与 KPI 逻辑，对应「政府体系」压力型体制与「权力逻辑」儒表法里。'],
            ['盐铁双轨 ↔ 国资/民营', '卷十二的垄断—缝隙结构，对应「国有资本」战略底座与「民营经济」56789 的当代双轨。'],
            ['地理底座 ↔ 外交博弈', '卷十一的地理密室与天下观，对应「台海」地缘重力与「一带一路」通道再造。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>内容迁自根目录 civilization-*.html 独立报告（原文保留可外链）；各卷为思想史与制度隐喻梳理，非实证结论 · 卷三另有扩展版 civilization-daoism-report-03.html</p>
    </div>
  );
}
