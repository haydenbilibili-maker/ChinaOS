#!/usr/bin/env node
/** Generate SJ-31~34 Round 3 split-period case volumes */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../app/public/shijian');

const CASES = [
  {
    num: '31', slug: 'sj-31', cls: 'sj-31',
    title: '官渡之战', subtitle: '区域军事力决胜 · 以少胜多 · 北方格局锁定',
    badge: 'SJ-31 · 军事决胜案例卷 · 三国',
    dynasty: '三国', dynastyId: 'sanguo', type: '军事',
    zhupi: '朱批：本案是<strong>分裂期单战转折</strong>样本——袁绍据北方四州资源占优，曹操以精锐+奇袭乌巢逆转；军事力组织度与决策链胜过账面兵力。与 SJ-08 五代「军事力畸大定正统」构成分裂期对照链：本案是<strong>战前格局→战后锁定</strong>，五代是<strong>制度性军事轮替</strong>。口径：《三国志·袁绍传》《曹操传》《资治通鉴》卷63；兵力数字标〔存疑〕。',
    hook: '建安五年（200），袁绍率大军南下，曹操以<b>精兵+奇袭乌巢</b>焚其粮秣，以少胜多——北方主导权由袁转曹，三国鼎立格局由此锁定。本案是分裂期「区域军事力决胜」的教科书转折：资源占优≠军事效能，组织度与后勤链才是结构实因。',
    chronology: '系年：建安五年（200）官渡 · 乌巢之战 · 出处《三国志·袁绍传》《曹操传》',
    sliceProse: '权力几何：<strong>袁绍北方资源盘</strong>（冀青幽并）对垒<strong>曹操中枢+精锐</strong>；乌巢粮道被焚为机制链枢纽，许都中枢维系曹军持续作战。点击节点展开五力角色。',
    phase: '分裂期 · 军事决胜', phaseProse: '东汉末至三国初处于<strong>崩解→分裂</strong>相位——中央合法性耗尽，区域军事集团定格局。官渡之战落于 SJ-04「分裂期·军事决胜」象限：单战锁定北方，而非制度性重整（→ SJ-08 五代）。',
    forces: [
      ['财政汲取', '「四州之地，带甲百万」', '袁绍据河北富庶区，税基广；但粮秣集中乌巢、一旦被焚则汲取链断裂——财政枢纽依赖单一节点〔兵力存疑〕'],
      ['精英循环', '「士多归附」', '袁绍门阀精英汇聚但谏言分裂（田丰、沮授不被采纳）；曹操唯才是举，精英循环更灵活'],
      ['合法性叙事', '「奉天子以令诸侯」', '曹操挟天子牌增强名义合法性；袁绍「四世三公」族望强但未能转化为统一叙事'],
      ['边疆军事', '官渡决战', '军事力组织度+奇袭决策决胜；许攸叛袁投曹提供乌巢情报为转折点'],
      ['生态—人口基座', '—', '河北战乱后人口与耕地仍优于兖豫；但基座优势未自动转化为战场效能〔存疑〕'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '剥离「以弱胜强」道德叙事——核心是乌巢粮道被焚+袁绍指挥链失灵，非天命'],
      ['钱穆', '《国史大纲》', '官渡定北方格局，曹魏承汉制而强，为三国归一奠基'],
      ['金观涛', '超稳定结构', '分裂期军事集团竞争的标准样本——组织度胜出资源盘'],
      ['黄仁宇', '数目字管理', '曹军后勤会计与屯田制支撑持续作战；袁军数目字管理薄、粮秣集中风险高'],
      ['西方汉学', 'Three Kingdoms', '学界共识：Guandu 为北方主导权转折点；Cao Cao 组织创新 vs Yuan Shao 资源诅咒。〔细节存疑〕'],
    ],
    verdict: {
      ok: ['曹操锁定北方', '三国鼎立格局奠基', '组织度>资源盘验证'],
      fail: ['袁绍集团瓦解', '河北生灵涂炭', '未终结分裂仅锁定一方'],
      open: ['〔反事实〕若袁绍采纳缓战拖垮曹军，能否避免乌巢之败？'],
    },
    mirror: {
      same: '分裂期军事决胜：资源盘≠战场效能；后勤链/指挥链为结构实因；单战可锁定区域格局。',
      diff: '现代战争有工业体系与信息化后勤，但「集中粮道节点被毁→全军崩溃」逻辑仍适用；与 SJ-08 五代制度性军事轮替不同，本案是单战转折。',
    },
    xrefs: [
      ['SJ-08 · 五代', '五代', '分裂—重整对照：本案是战前转折，五代是制度轮替。'],
      ['SJ-03 · 五力', '五力', '军事力组织度 vs 资源盘；后勤链为枢纽。'],
      ['SJ-04 · 相位盘', '相位盘', '分裂期·军事决胜定位。'],
    ],
    footerPrev: 'SJ-27', footerNext: 'SJ-32',
    nodes: [
      { id: 'yuanshao', x: 56, y: 126, w: 200, h: 86, stroke: 'var(--sj-ochre)', fill: '#2a2218', title: '袁绍 · 北方', sub: '冀青幽并 · 资源盘', tfill: 'var(--sj-ochre)', tag: '资源占优', body: '据北方四州，士众数十万〔存疑〕，税基与兵源占优；但指挥链分散、谋士谏言不被采纳。' },
      { id: 'caocao', x: 564, y: 126, w: 200, h: 86, stroke: 'var(--sj-vermil)', fill: '#2a1a16', title: '曹操 · 精锐', sub: '唯才是举 · 组织度', tfill: 'var(--sj-vermil)', tag: '组织胜出', body: '兵少而精，屯田制支撑后勤；许攸投曹提供乌巢情报，决策链灵活。' },
      { id: 'wuchao', x: 310, y: 250, w: 200, h: 70, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '乌巢 · 粮道', sub: '建安五年 · 奇袭', tfill: 'var(--sj-vermil)', tag: '机制枢纽', body: '淳于琼守乌巢，曹操亲率精兵焚粮——袁绍军心溃散的结构引爆点。' },
      { id: 'xudu', x: 564, y: 250, w: 200, h: 70, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '许都 · 中枢', sub: '挟天子 · 名义合法性', tfill: 'var(--sj-celadon)', tag: '合法性', body: '曹操奉天子都许，增强「讨逆」名义；袁绍错失政治牌。' },
      { id: 'guandu', x: 130, y: 360, w: 180, h: 56, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '官渡 · 200', sub: '对峙 · 决战', tfill: 'var(--sj-vermil)', tag: '时点标注', body: '建安五年主战场；袁军连营而曹军固守，僵持至乌巢一击逆转。' },
      { id: 'jingying', x: 340, y: 360, w: 140, h: 56, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '谋士链', sub: '田丰 · 许攸', tfill: 'var(--sj-celadon)', tag: '精英循环', body: '田丰、沮授主缓战不被听；许攸叛袁——精英循环断裂的战场表现。' },
      { id: 'base', x: 56, y: 452, w: 708, h: 60, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '河北 · 兖豫基座', sub: '税基广 vs 屯田稳', tfill: 'var(--sj-paper-100)', tag: '基座', body: '河北经战乱仍富；兖豫经曹操屯田修复。基座优势需经军事组织转化。〔人口数字存疑〕' },
    ],
    edges: [
      { id: 'e1', d: 'M156,212 L410,250', stroke: 'var(--sj-ochre)', w: 2.2, dash: '6 5', marker: 'a-ochre', label: '资源→粮道', lx: 280, ly: 228, nodes: ['yuanshao', 'wuchao'] },
      { id: 'e2', d: 'M664,212 L410,285', stroke: 'var(--sj-vermil)', w: 3.2, marker: 'a-vermil', label: '奇袭焚粮', lx: 540, ly: 248, nodes: ['caocao', 'wuchao'] },
      { id: 'e3', d: 'M256,126 L220,360', stroke: 'var(--sj-ochre)', w: 1.8, dash: '5 4', marker: 'a-ochre', label: '对峙', lx: 200, ly: 250, nodes: ['yuanshao', 'guandu'] },
      { id: 'e4', d: 'M664,316 L410,320', stroke: 'var(--sj-celadon)', w: 2, marker: 'a-celadon', label: '中枢支撑', lx: 540, ly: 310, nodes: ['xudu', 'caocao'] },
      { id: 'e5', d: 'M410,320 L410,452', stroke: 'var(--sj-line)', w: 1.6, nodes: ['wuchao', 'base'] },
    ],
    nodeEdge: {
      yuanshao: ['e1', 'e3'], caocao: ['e2', 'e4'], wuchao: ['e1', 'e2', 'e5'],
      xudu: ['e4'], guandu: ['e3'], jingying: [], base: ['e5'],
    },
  },
  {
    num: '32', slug: 'sj-32', cls: 'sj-32',
    title: '九品中正制', subtitle: '精英循环制度化 · 门阀通道 · 上品无寒门',
    badge: 'SJ-32 · 制度案例卷 · 魏晋',
    dynasty: '魏晋', dynastyId: 'sanguo', type: '制度',
    zhupi: '朱批：本案是<strong>分裂期精英循环制度化</strong>样本——陈群创九品中正，本意为「选贤与能」，却迅速门阀化、「上品无寒门」。与 SJ-08 五代武人政治压制精英形成对照：本案是<strong>精英通道固化</strong>而非断裂。口径：《晋书·职官志》《三国志·魏书·陈群传》。',
    hook: '曹丕代汉后，陈群创<b>九品中正制</b>——由中正官按家世、德才评定士人品第，作为选官依据。制度本意重建汉末崩解后的精英循环，却迅速固化为门阀垄断，「上品无寒门，下品无势族」——精英循环力从开放通道变为封闭管道。',
    chronology: '系年：220 魏立 · 陈群奏置中正 · 出处《晋书·职官志》《三国志·陈群传》',
    sliceProse: '权力几何：<strong>皇权/中枢</strong>授权<strong>中正官</strong>评定士人 → 品第决定仕途 → <strong>门阀底盘</strong>固化。青瓷为制度纵列，朱批为门阀化逆流。',
    phase: '分裂重整期 · 精英固化', phaseProse: '魏晋之际处于<strong>重整期</strong>——九品中正试图重建崩解后的选官秩序，却在 SJ-04 相位盘呈现「重整期·精英通道固化」：制度设计被既得利益捕获。',
    forces: [
      ['财政汲取', '—', '选官不直接涉税，但门阀兼并土地使税基向豪强集中——间接削弱汲取广度'],
      ['精英循环', '「九品官人」', '中正官评定品第→选官依据；本意选贤，实为门阀互评，寒门上升通道收窄'],
      ['合法性叙事', '「禅让」', '曹丕代汉需新合法性；九品配合「以孝治天下」重建士人认同'],
      ['边疆军事', '—', '魏晋之际军事力仍重，但选官制度与军事功勋通道分离〔存疑〕'],
      ['生态—人口基座', '—', '战乱后人口流动，门阀依附土地与宗族网络固化基层控制'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '「选贤制度」需剥离——中正多出自门阀，评品实质是利益互认'],
      ['钱穆', '《国史大纲》', '九品为科举前夜，门阀政治的典型制度；隋唐科举是对其反拨'],
      ['金观涛', '超稳定结构', '精英循环制度化=超稳定结构的「上层封闭」机制；延缓但加深僵化'],
      ['黄仁宇', '数目字管理', '品第评定缺乏可量化标准，基层会计薄，门阀主观裁量空间大'],
      ['西方汉学', 'Nine-rank', '学界共识：制度初衷 vs 门阀化结局的悖论；与 European nobility 有结构可比性。〔细节存疑〕'],
    ],
    verdict: {
      ok: ['重建选官秩序', '为隋唐科举提供反拨靶点', '士人网络再组织'],
      fail: ['上品无寒门', '门阀垄断仕途', '精英循环实质封闭'],
      open: ['〔反事实〕若中正官不受地方门阀挟制，能否保持开放？'],
    },
    mirror: {
      same: '崩解后重建精英通道；制度设计意图 vs 既得利益捕获；选官标准主观化→封闭化。',
      diff: '现代公务员考录体系有公开考试与监督；但「推荐制+主观评价→圈层固化」风险仍可对读（→ SJ-20 政治映射）。',
    },
    xrefs: [
      ['SJ-08 · 五代', '五代', '对照：本案固化精英，五代武人压制精英。'],
      ['SJ-35 · 隋初', '隋初', '科举雏形是对九品门阀的反拨。'],
      ['SJ-04 · 相位盘', '相位盘', '重整期·精英固化定位。'],
    ],
    footerPrev: 'SJ-31', footerNext: 'SJ-33',
    nodes: [
      { id: 'huangquan', x: 310, y: 112, w: 200, h: 46, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '曹丕 · 魏文帝', sub: '皇权授权', tfill: 'var(--sj-ochre)', tag: '合法性', body: '代汉建魏，需新选官制度重建士人认同；采纳陈群奏议。' },
      { id: 'chenqun', x: 130, y: 220, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '陈群 · 创制', sub: '九品奏议', tfill: 'var(--sj-celadon)', tag: '制度设计', body: '《晋书·职官志》载其创九品中正；本意选贤与能。' },
      { id: 'zhongzheng', x: 310, y: 310, w: 200, h: 70, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '中正官', sub: '品第评定', tfill: 'var(--sj-celadon)', tag: '精英循环', body: '按家世、德才评九品；州郡设大中正、县设小中正。' },
      { id: 'menfa', x: 514, y: 220, w: 186, h: 60, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '门阀 · 势族', sub: '上品无寒门', tfill: 'var(--sj-vermil)', tag: '结构实因', body: '中正多出门阀，评品实质互认；「下品无势族」固化封闭。' },
      { id: 'hanshi', x: 130, y: 400, w: 176, h: 50, stroke: 'var(--sj-paper-300)', fill: 'var(--sj-ink-800)', title: '寒门士人', sub: '通道收窄', tfill: 'var(--sj-paper-300)', tag: '被排斥', body: '品第低则仕途无望；魏晋南北朝门阀政治典型。' },
      { id: 'xuanju', x: 514, y: 310, w: 186, h: 70, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '选官 · 仕途', sub: '品第→官职', tfill: 'var(--sj-ochre)', tag: '财政间接', body: '品第决定起家官阶；门阀子弟平流而上，寒门难入中枢。' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '宗族 · 土地底盘', sub: '门阀依附基座', tfill: 'var(--sj-line)', tag: '基座', body: '门阀以宗族+土地网络固化基层；中正评定与土地兼并互为表里。' },
    ],
    edges: [
      { id: 'e1', d: 'M410,158 L218,220', stroke: 'var(--sj-ochre)', w: 2, marker: 'a-ochre', nodes: ['huangquan', 'chenqun'] },
      { id: 'e2', d: 'M218,280 L410,310', stroke: 'var(--sj-celadon)', w: 2.4, marker: 'a-celadon', label: '创制', lx: 310, ly: 295, nodes: ['chenqun', 'zhongzheng'] },
      { id: 'e3', d: 'M607,280 L510,310', stroke: 'var(--sj-vermil)', w: 2.8, marker: 'a-vermil', label: '门阀化', lx: 570, ly: 295, nodes: ['menfa', 'zhongzheng'] },
      { id: 'e4', d: 'M410,380 L607,340', stroke: 'var(--sj-ochre)', w: 2, marker: 'a-ochre', nodes: ['zhongzheng', 'xuanju'] },
      { id: 'e5', d: 'M218,450 L410,486', stroke: 'var(--sj-paper-300)', w: 1.6, dash: '4 4', nodes: ['hanshi', 'base'] },
      { id: 'e6', d: 'M607,450 L410,520', stroke: 'var(--sj-vermil)', w: 2, nodes: ['menfa', 'base'] },
    ],
    nodeEdge: {
      huangquan: ['e1'], chenqun: ['e1', 'e2'], zhongzheng: ['e2', 'e3', 'e4'],
      menfa: ['e3', 'e6'], hanshi: ['e5'], xuanju: ['e4'], base: ['e5', 'e6'],
    },
  },
  {
    num: '33', slug: 'sj-33', cls: 'sj-33',
    title: '淝水之战', subtitle: '军事力误判 · 士气链崩溃 · 分裂期南北分界',
    badge: 'SJ-33 · 军事误判案例卷 · 东晋十六国',
    dynasty: '东晋十六国', dynastyId: 'sanguo', type: '军事',
    zhupi: '朱批：本案是<strong>军事力账面优势≠战场效能</strong>的极端样本——苻坚「投鞭断流」〔存疑〕式兵力误判，淝水一战东晋北府兵以少胜多，前秦迅速崩解。与 SJ-31 官渡同属分裂期军事决胜，但本案强调<strong>多民族拼凑军的士气链脆弱</strong>。口径：《晋书·谢玄传》《苻坚传》《资治通鉴》卷105。',
    hook: '太元八年（383），前秦苻坚率大军南征东晋，号称百万〔存疑〕；淝水一战，东晋<b>北府兵</b>以少胜多，前秦军「风声鹤唳、草木皆兵」而溃——军事力账面优势被士气链崩溃逆转，南北对峙格局由此锁定。',
    chronology: '系年：太元八年（383）淝水 · 出处《晋书·谢玄传》《苻坚传》',
    sliceProse: '权力几何：<strong>苻坚多民族大军</strong>（账面优势）→ 淝水对峙 → <strong>北府兵+谢玄</strong>触发士气链崩溃。朱批为「投鞭断流」式误判。',
    phase: '分裂期 · 军事误判', phaseProse: '东晋十六国处于<strong>长期分裂</strong>——淝水之战落于 SJ-04「分裂期·军事决胜/误判」：前秦未能力整合多民族军事力，一战崩盘。',
    forces: [
      ['财政汲取', '「百万之师」', '前秦疆域辽阔但民族杂糅，汲取链碎片化；军粮补给线过长〔兵力存疑〕'],
      ['精英循环', '北府兵', '谢玄、谢安领衔东晋士族+流民帅，精英与军事结合紧密'],
      ['合法性叙事', '「混一南北」', '苻坚以「混一宇内」叙事南征；败后前秦合法性迅速归零'],
      ['边疆军事', '淝水决战', '军事力误判：多民族拼凑军士气链脆弱，一触即溃'],
      ['生态—人口基座', '—', '北方连年征战基座承载透支；南迁汉人支撑东晋江南基座'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '「百万」需剥离——《晋书》载苻坚众八十万〔存疑〕，实际作战兵力远低；败因是组织度非单纯数量'],
      ['钱穆', '《国史大纲》', '淝水保全东晋，延续南朝正统；前秦崩解加速十六国分裂'],
      ['金观涛', '超稳定结构', '多民族帝国军事扩张极限——未整合即南征，一战回到分裂'],
      ['黄仁宇', '数目字管理', '前秦缺乏统一数目字管理，各族军队指挥链混乱；东晋北府兵编制相对清晰'],
      ['西方汉学', 'Battle of Fei River', '学界共识：psychological collapse 与 multi-ethnic army 组织问题是主因。〔数字存疑〕'],
    ],
    verdict: {
      ok: ['东晋保全', '南北对峙锁定', '北府兵制度验证'],
      fail: ['前秦迅速崩解', '北方再陷分裂', '民族矛盾总爆发'],
      open: ['〔反事实〕若苻坚未急攻而先整合内部，能否避免淝水式崩溃？'],
    },
    mirror: {
      same: '账面兵力≠战场效能；士气链/指挥链为结构实因；分裂期单战可锁定长期格局。',
      diff: '现代军队有统一编制与信息化指挥；但「多民族/多派系拼凑→一触即溃」在联盟战争仍有警示（→ SJ-08 分裂期对照）。',
    },
    xrefs: [
      ['SJ-31 · 官渡', '官渡', '同属分裂期军事决胜；本案强调误判与士气链。'],
      ['SJ-08 · 五代', '五代', '分裂—重整链：本案锁定南北，五代锁定东西。'],
      ['SJ-04 · 相位盘', '相位盘', '分裂期·军事误判定位。'],
    ],
    footerPrev: 'SJ-32', footerNext: 'SJ-34',
    nodes: [
      { id: 'fujian', x: 210, y: 126, w: 220, h: 86, stroke: 'var(--sj-ochre)', fill: '#2a2218', title: '苻坚 · 前秦', sub: '百万〔存疑〕· 南征', tfill: 'var(--sj-ochre)', tag: '账面优势', body: '统一北方后南征东晋，号称百万；多民族拼凑，指挥链杂。' },
      { id: 'beifu', x: 564, y: 126, w: 200, h: 86, stroke: 'var(--sj-vermil)', fill: '#2a1a16', title: '北府兵 · 谢玄', sub: '流民帅 · 精锐', tfill: 'var(--sj-vermil)', tag: '组织胜出', body: '东晋门阀+流民帅组建，编制清晰；谢玄、谢安指挥得宜。' },
      { id: 'feishui', x: 310, y: 260, w: 200, h: 70, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '淝水 · 383', sub: '对峙 · 决战', tfill: 'var(--sj-vermil)', tag: '时点标注', body: '太元八年淝水之战；晋军小胜触发前秦后军溃退的连锁反应。' },
      { id: 'shiqichain', x: 130, y: 370, w: 200, h: 56, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '士气链崩溃', sub: '风声鹤唳', tfill: 'var(--sj-vermil)', tag: '机制链', body: '「草木皆兵」：前秦后军误以为晋军来袭，自相践踏——士气链断裂。' },
      { id: 'xiean', x: 564, y: 260, w: 200, h: 70, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '谢安 · 中枢', sub: '「小儿辈大破贼」', tfill: 'var(--sj-celadon)', tag: '合法性', body: '东晋士族中枢稳定，合法性叙事「保境安民」支撑抗战。' },
      { id: 'minzu', x: 340, y: 370, w: 140, h: 56, stroke: 'var(--sj-paper-300)', fill: 'var(--sj-ink-800)', title: '多民族军', sub: '氐羌汉杂', tfill: 'var(--sj-paper-300)', tag: '结构弱点', body: '前秦未整合各族即南征；败后民族矛盾总爆发，北方再分裂。' },
      { id: 'base', x: 56, y: 452, w: 708, h: 60, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '江南 · 中原基座', sub: '南迁 vs 透支', tfill: 'var(--sj-paper-100)', tag: '基座', body: '江南经开发承载东晋；北方连年征战基座透支——长期分裂的慢变量背景。' },
    ],
    edges: [
      { id: 'e1', d: 'M320,212 L410,260', stroke: 'var(--sj-ochre)', w: 2.4, marker: 'a-ochre', label: '南征', lx: 360, ly: 235, nodes: ['fujian', 'feishui'] },
      { id: 'e2', d: 'M664,212 L410,295', stroke: 'var(--sj-vermil)', w: 3.2, marker: 'a-vermil', label: '决战', lx: 540, ly: 250, nodes: ['beifu', 'feishui'] },
      { id: 'e3', d: 'M410,330 L230,370', stroke: 'var(--sj-vermil)', w: 3, marker: 'a-vermil', label: '崩溃链', lx: 310, ly: 355, nodes: ['feishui', 'shiqichain'] },
      { id: 'e4', d: 'M664,330 L410,320', stroke: 'var(--sj-celadon)', w: 2, marker: 'a-celadon', nodes: ['xiean', 'beifu'] },
      { id: 'e5', d: 'M320,280 L410,370', stroke: 'var(--sj-paper-300)', w: 1.8, dash: '4 4', nodes: ['fujian', 'minzu'] },
      { id: 'e6', d: 'M410,420 L410,452', stroke: 'var(--sj-line)', w: 1.6, nodes: ['shiqichain', 'base'] },
    ],
    nodeEdge: {
      fujian: ['e1', 'e5'], beifu: ['e2', 'e4'], feishui: ['e1', 'e2', 'e3'],
      shiqichain: ['e3', 'e6'], xiean: ['e4'], minzu: ['e5'], base: ['e6'],
    },
  },
  {
    num: '34', slug: 'sj-34', cls: 'sj-34',
    title: '孝文帝改革', subtitle: '合法性叙事重建 · 汉化改制 · 分裂期制度整合',
    badge: 'SJ-34 · 合法性重建案例卷 · 北魏/南北朝',
    dynasty: '北魏/南北朝', dynastyId: 'sanguo', type: '变法',
    zhupi: '朱批：本案是<strong>分裂期合法性叙事重建</strong>样本——拓跋鲜卑入主中原，孝文帝以改姓、汉化、均田试图绑定汉人士族与编户齐民。与 SJ-08 五代「合法性归零」形成对照：本案是<strong>主动重建叙事</strong>而非军事轮替。口径：《魏书·高祖纪》《食货志》；汉化程度与反弹规模〔部分存疑〕。',
    hook: '北魏孝文帝（拓跋宏）以<b>迁都洛阳、改姓元、禁胡语胡服、推行均田</b>，试图将鲜卑军事贵族转化为中原正统王朝——合法性叙事力从「胡虏」转为「华夏」，但触怒鲜卑旧贵族，六镇之乱埋下分裂伏笔。',
    chronology: '系年：太和十八年（494）迁都洛阳 · 出处《魏书·高祖纪》',
    sliceProse: '权力几何：<strong>孝文帝皇权</strong> → 汉化改制纵列 → 均田/三长下行 → <strong>鲜卑旧贵族/汉人士族</strong>双底盘。合法性（宣纸色）为主轴，朱批为六镇反弹。',
    phase: '分裂重整期 · 合法性重建', phaseProse: '南北朝处于<strong>长期分裂+重整尝试</strong>——孝文帝改革落于 SJ-04「重整期·合法性叙事重建」：以文化整合替代纯军事征服，但过度激进而引发反弹。',
    forces: [
      ['财政汲取', '均田 · 三长制', '均田制重建税基；三长制强化基层编户，汲取链向汉化政权集中'],
      ['精英循环', '改姓 · 通婚', '鲜卑贵族改汉姓、与汉士族通婚，试图打开精英融合通道'],
      ['合法性叙事', '「华夏正统」', '迁都洛阳、祭孔、改汉制——从「胡虏」叙事转为「魏」承「汉」正统'],
      ['边疆军事', '六镇', '北方六镇鲜卑军户被汉化政策边缘化，军事力与合法性改革脱节——反弹伏笔'],
      ['生态—人口基座', '—', '战乱后北方人口重新匹配；均田试图锁定税基〔实施范围存疑〕'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '「汉化伟业」需剥离——改革触怒鲜卑基本盘，六镇之乱证明整合失败'],
      ['钱穆', '《国史大纲》', '肯定孝文制度进步，但指出北齐北周仍须再整合；隋唐承其遗产'],
      ['金观涛', '超稳定结构', '少数民族入主→汉化→再分裂的标准路径；文化整合难替代军事—财政整合'],
      ['黄仁宇', '数目字管理', '均田+三长是数目字管理尝试；但汉化速度超过基层承载力'],
      ['西方汉学', 'Sinicization', '学界共识：孝文改革是 non-Han regime 合法性重建典型；Six Garrisons 反弹为后续研究重点。〔存疑〕'],
    ],
    verdict: {
      ok: ['隋唐制度遗产', '均田三长延续', '汉化融合部分成功'],
      fail: ['六镇之乱', '北魏分裂', '鲜卑旧贵族反扑'],
      open: ['〔反事实〕若渐进汉化而非激进迁都，能否避免六镇反弹？'],
    },
    mirror: {
      same: '分裂期政权需重建合法性叙事；文化整合+制度移植；改革速度与基本盘承受力的张力。',
      diff: '现代民族国家有宪法框架整合多元群体；但「主流叙事重建→边缘群体反弹」仍可对读（→ SJ-20 政治映射）。',
    },
    xrefs: [
      ['SJ-08 · 五代', '五代', '对照：本案重建合法性，五代合法性归零。'],
      ['SJ-35 · 隋初', '隋初', '均田—租庸调承北魏—隋制度链。'],
      ['SJ-04 · 相位盘', '相位盘', '重整期·合法性重建定位。'],
    ],
    footerPrev: 'SJ-33', footerNext: 'SJ-35',
    nodes: [
      { id: 'xiaowen', x: 310, y: 112, w: 200, h: 46, stroke: 'var(--sj-paper-100)', fill: 'var(--sj-ink-800)', title: '孝文帝 · 元宏', sub: '皇权 · 汉化', tfill: 'var(--sj-paper-100)', tag: '合法性', body: '拓跋宏改姓元，迁都洛阳，以汉化绑定中原正统。' },
      { id: 'hanhua', x: 130, y: 220, w: 176, h: 60, stroke: 'var(--sj-paper-100)', fill: 'var(--sj-ink-800)', title: '汉化改制', sub: '改姓 · 禁胡语', tfill: 'var(--sj-paper-100)', tag: '叙事重建', body: '改汉姓、穿汉服、说汉语、祭孔——合法性叙事从胡虏转为华夏。' },
      { id: 'juntian', x: 310, y: 330, w: 200, h: 60, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '均田 · 三长', sub: '汲取重建', tfill: 'var(--sj-ochre)', tag: '财政', body: '均田制重建税基；三长制强化基层编户，为隋唐均田—租庸调奠基。' },
      { id: 'xianbei', x: 514, y: 220, w: 186, h: 60, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '鲜卑旧贵族', sub: '六镇 · 反弹', tfill: 'var(--sj-vermil)', tag: '抵制', body: '北方六镇军户被边缘化；孝文死后鲜卑贵族反扑，六镇之乱引爆分裂。' },
      { id: 'hanshi', x: 514, y: 330, w: 186, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '汉人士族', sub: '融合 · 通婚', tfill: 'var(--sj-celadon)', tag: '精英循环', body: '与鲜卑贵族通婚、共仕；精英循环通道部分打开。' },
      { id: 'luoyang', x: 130, y: 330, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '洛阳 · 494', sub: '迁都 · 时点', tfill: 'var(--sj-celadon)', tag: '时点标注', body: '太和十八年迁都洛阳，象征从平城草原帝国转向中原正统。' },
      { id: 'base', x: 56, y: 450, w: 708, h: 70, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '编户齐民 · 北方基座', sub: '均田农民底盘', tfill: 'var(--sj-paper-100)', tag: '基座', body: '战乱后北方人口与耕地重新匹配；均田试图锁定税基与合法性绑定。〔范围存疑〕' },
    ],
    edges: [
      { id: 'e1', d: 'M410,158 L218,220', stroke: 'var(--sj-paper-100)', w: 2.4, marker: 'a-paper', nodes: ['xiaowen', 'hanhua'] },
      { id: 'e2', d: 'M218,280 L410,330', stroke: 'var(--sj-celadon)', w: 2, marker: 'a-celadon', nodes: ['luoyang', 'juntian'] },
      { id: 'e3', d: 'M410,158 L607,220', stroke: 'var(--sj-vermil)', w: 2.8, marker: 'a-vermil', label: '触怒', lx: 520, ly: 185, nodes: ['xiaowen', 'xianbei'] },
      { id: 'e4', d: 'M410,280 L607,330', stroke: 'var(--sj-celadon)', w: 2, marker: 'a-celadon', nodes: ['hanhua', 'hanshi'] },
      { id: 'e5', d: 'M410,390 L410,450', stroke: 'var(--sj-ochre)', w: 2, marker: 'a-ochre', nodes: ['juntian', 'base'] },
      { id: 'e6', d: 'M607,280 L410,450', stroke: 'var(--sj-vermil)', w: 1.8, dash: '5 4', marker: 'a-vermil', label: '六镇反弹', lx: 520, ly: 380, nodes: ['xianbei', 'base'] },
    ],
    nodeEdge: {
      xiaowen: ['e1', 'e3'], hanhua: ['e1', 'e4'], juntian: ['e2', 'e5'],
      xianbei: ['e3', 'e6'], hanshi: ['e4'], luoyang: ['e2'], base: ['e5', 'e6'],
    },
  },
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderNodes(nodes) {
  return nodes.map((n) => {
    const ty = n.y + (n.h > 60 ? 32 : 28);
    const sy = n.y + (n.h > 60 ? 50 : 0);
    const sub = n.sub ? `<text x="${n.x + n.w / 2}" y="${ty + (sy ? 18 : 0)}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${esc(n.sub)}</text>` : '';
    return `<g class="sj-node" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(n.title)}">
    <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2.4"/>
    <text x="${n.x + n.w / 2}" y="${ty}" text-anchor="middle" fill="${n.tfill}" font-size="14" font-weight="600" font-family="Songti SC,serif">${esc(n.title)}</text>
    ${sub}
  </g>`;
  }).join('\n');
}

function renderEdges(edges) {
  return edges.map((e) => {
    const dash = e.dash ? ` stroke-dasharray="${e.dash}"` : '';
    const me = e.marker ? ` marker-end="url(#${e.marker})"` : '';
    const lbl = e.label ? `<text x="${e.lx}" y="${e.ly}" text-anchor="middle" fill="${e.stroke}" font-size="11" font-family="Songti SC,serif">${esc(e.label)}</text>` : '';
    return `<path class="sj-edge" data-edge="${e.id}" d="${e.d}" stroke="${e.stroke}" stroke-width="${e.w}"${dash}${me}/>${lbl}`;
  }).join('\n');
}

function renderForces(forces) {
  return forces.map(([f, z, s]) => `<tr><td>${esc(f)}</td><td class="zheng">${esc(z)}</td><td class="shi">${esc(s)}</td></tr>`).join('\n');
}

function renderHist(hist) {
  return hist.map(([w, s, p], i) => {
    const span = i === hist.length - 1 ? ' style="grid-column:1/-1"' : '';
    return `<article${span}><div class="who">${esc(w)}<span>${esc(s)}</span></div><p>${esc(p)}</p></article>`;
  }).join('\n');
}

function renderHtml(c) {
  const p = c.cls.split('-')[1];
  const nodeData = Object.fromEntries(
    c.nodes.map((n) => [n.id, { name: n.title, tag: n.tag, body: n.body }])
  );
  const svgNodes = renderNodes(c.nodes);
  const svgEdges = renderEdges(c.edges);
  const xrefs = c.xrefs.map(([n, h, p]) =>
    `<a href="./${n.split(' ')[0]}.html"><div class="n">${esc(n)}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></a>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SJ-${c.num} · ${esc(c.title)}</title>
<meta name="description" content="ChinaOS 史鉴系列案例卷 SJ-${c.num}：${esc(c.title)}——${esc(c.subtitle)}。史鉴台账七字段。"/>
<style>
:root{
  --sj-ink-900:#14110f;--sj-ink-800:#1d1916;--sj-paper-100:#e8ddc7;--sj-paper-300:#cdbe9f;
  --sj-vermil:#a83b2c;--sj-celadon:#5f7a6f;--sj-ochre:#b8894a;--sj-line:#3a322b;
  --sj-radius:6px;--sj-space:clamp(12px,2vw,24px);
  --sj-serif:"Songti SC","Noto Serif SC","Source Han Serif SC",serif;
  --sj-mono:"Source Han Mono","JetBrains Mono",ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{min-height:100vh;background:radial-gradient(1000px 560px at 72% -8%,#2a221c 0%,transparent 55%),var(--sj-ink-900);color:var(--sj-paper-100);font-family:var(--sj-serif);line-height:1.75}
.${c.cls}-wrap{max-width:min(100%,1180px);margin:0 auto;padding:var(--sj-space) var(--sj-space) 48px}
@media(min-width:1280px){.${c.cls}-wrap{max-width:min(100%,1480px)}}
@media(min-width:1536px){.${c.cls}-wrap{max-width:min(100%,1600px)}}
.sj-page-layout{display:flex;flex-direction:column;gap:var(--sj-space)}
@media(min-width:1280px){.sj-page-layout{display:grid;grid-template-columns:minmax(0,58fr) minmax(280px,38fr);gap:clamp(16px,2vw,28px);align-items:start}}
.sj-main-col{min-width:0}
.sj-rail{display:flex;flex-direction:column;gap:12px}
@media(min-width:1280px){.sj-rail{position:sticky;top:1rem;align-self:start;max-height:calc(100vh - 2rem);overflow-y:auto}}
@media(max-width:1279px){.sj-page-layout{flex-direction:column}.sj-main-col{display:contents}.sj-rail{order:2;margin:8px 0 20px}}
.sj-rail-card{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px}
.sj-rail-card .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.sj-rail-toc{display:grid;gap:6px;margin-top:8px}
.sj-rail-toc a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);padding:8px 10px;text-decoration:none;color:inherit;font-size:13px}
.sj-rail-toc a:hover,.sj-rail-toc a:focus-visible,.sj-rail-toc a.is-active{border-color:var(--sj-ochre);outline:none}
.sj-rail-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:4px 4px 0 0}
.${c.cls}-mast{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid var(--sj-line);margin-bottom:20px}
.${c.cls}-mast .badge{font-family:var(--sj-mono);font-size:11px;letter-spacing:.18em;color:var(--sj-ochre);margin-bottom:6px}
.${c.cls}-mast h1{font-size:clamp(22px,3vw,28px);font-weight:600;letter-spacing:.16em}
.${c.cls}-mast h1 em{font-style:normal;color:var(--sj-paper-300);font-weight:400;font-size:.72em;display:block;margin-top:4px}
.${c.cls}-meta{font-family:var(--sj-mono);font-size:11px;color:var(--sj-paper-300);text-align:right}
.${c.cls}-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:2px}
.${c.cls}-dynasty{color:var(--sj-ochre);border-color:var(--sj-ochre)}
.sj-zhupi{color:var(--sj-vermil);font-size:13.5px;margin:0 0 18px;padding-left:12px;border-left:2px solid var(--sj-vermil);max-width:74ch}
.sj-ledger{display:grid;gap:8px}
.sj-ledger-field{margin:20px 0 8px;scroll-margin-top:24px}
.sj-ledger-fh{display:flex;align-items:baseline;gap:12px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--sj-line)}
.sj-ledger-fh .fnum{font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);border:1px solid var(--sj-line);border-radius:4px;padding:1px 7px}
.sj-ledger-fh h2{font-size:clamp(16px,2.1vw,19px);font-weight:600}
.${c.cls}-prose{font-size:15.5px;max-width:74ch}
.${c.cls}-hook{border:1px solid var(--sj-line);border-left:3px solid var(--sj-vermil);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:18px 22px}
.${c.cls}-hook p{font-size:clamp(16px,2.3vw,20px);line-height:1.7}
.${c.cls}-hook .yr{margin-top:10px;font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre)}
.${c.cls}-stage{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:8px;overflow:auto}
.${c.cls}-stage svg{display:block;width:100%;height:auto}
.sj-node{cursor:pointer;transition:opacity .2s ease,filter .2s ease}
.sj-node:focus-visible{outline:2px solid var(--sj-ochre);outline-offset:4px}
.sj-edge{transition:opacity .2s ease}
.${c.cls}-stage.is-picking .sj-node{opacity:.3}
.${c.cls}-stage.is-picking .sj-node.is-hot{opacity:1;filter:drop-shadow(0 0 6px rgba(184,137,74,.4))}
.${c.cls}-stage.is-picking .sj-edge{opacity:.16}
.${c.cls}-stage.is-picking .sj-edge.is-hot{opacity:1}
.${c.cls}-layout{display:grid;grid-template-columns:1fr minmax(240px,300px);gap:14px;margin-top:14px}
.${c.cls}-aside{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px;min-height:140px}
.${c.cls}-aside .k{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);margin-bottom:6px}
.${c.cls}-aside h3{font-size:16px;margin-bottom:8px}
.${c.cls}-aside p{font-size:13.5px;color:var(--sj-paper-300);line-height:1.7}
.${c.cls}-aside-empty{font-size:13px;color:var(--sj-paper-300);opacity:.85}
.${c.cls}-phase .pb{font-family:var(--sj-mono);font-size:12px;color:var(--sj-vermil);border:1px solid var(--sj-vermil);border-radius:20px;padding:6px 16px}
.${c.cls}-table-wrap{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);overflow:auto}
.${c.cls}-table{width:100%;border-collapse:collapse;font-size:13px}
.${c.cls}-table th{background:var(--sj-ink-900);color:var(--sj-ochre);font-family:var(--sj-mono);font-size:10px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--sj-line)}
.${c.cls}-table td{padding:10px 12px;border-bottom:1px solid var(--sj-line);color:var(--sj-paper-300);vertical-align:top}
.${c.cls}-table td:first-child{color:var(--sj-paper-100);font-weight:600}
.${c.cls}-hist{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${c.cls}-hist article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-hist .who{font-size:14px;font-weight:600;color:var(--sj-celadon);margin-bottom:6px}
.${c.cls}-hist .who span{font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);margin-left:6px}
.${c.cls}-hist p{font-size:13px;color:var(--sj-paper-300);line-height:1.65}
.${c.cls}-verdict{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.${c.cls}-verdict article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-verdict .vh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${c.cls}-verdict article.ok .vh{color:var(--sj-celadon)}
.${c.cls}-verdict article.fail .vh{color:var(--sj-vermil)}
.${c.cls}-verdict article.open .vh{color:var(--sj-ochre)}
.${c.cls}-verdict p{font-size:13px;color:var(--sj-paper-300)}
.${c.cls}-mirror{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${c.cls}-mirror article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${c.cls}-mirror .mh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${c.cls}-mirror article.same .mh{color:var(--sj-celadon)}
.${c.cls}-mirror article.diff .mh{color:var(--sj-ochre)}
.${c.cls}-mirror p{font-size:13px;color:var(--sj-paper-100);line-height:1.68}
.${c.cls}-xref{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.${c.cls}-xref a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px;text-decoration:none;color:inherit}
.${c.cls}-xref .n{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);margin-bottom:4px}
.${c.cls}-xref h3{font-size:14px;margin-bottom:6px}
.${c.cls}-xref p{font-size:12.5px;color:var(--sj-paper-300)}
.${c.cls}-foot{margin-top:40px;padding-top:14px;border-top:1px solid var(--sj-line);font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.${c.cls}-foot a{color:var(--sj-celadon);text-decoration:none}
@media(max-width:900px){.${c.cls}-layout{grid-template-columns:1fr}}
@media(max-width:768px){.${c.cls}-hist,.${c.cls}-mirror,.${c.cls}-verdict,.${c.cls}-xref{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.sj-node,.sj-edge{transition:none}}
</style>
</head>
<body>
<div class="${c.cls}-wrap" id="${c.cls}-top">
<header class="${c.cls}-mast">
  <div>
    <div class="badge">${esc(c.badge)}</div>
    <h1>${esc(c.title)}<em>${esc(c.subtitle)}</em></h1>
    <div>
      <span class="${c.cls}-chip ${c.cls}-dynasty" data-dynasty="${c.dynastyId}">朝代 · ${esc(c.dynasty)}</span>
      <span class="${c.cls}-chip">${esc(c.type)}</span>
      <a class="${c.cls}-chip" href="./SJ-00.html">↔ SJ-00</a>
      <a class="${c.cls}-chip" href="./SJ-03.html">↔ SJ-03</a>
      <a class="${c.cls}-chip" href="./SJ-04.html">↔ SJ-04</a>
      <a class="${c.cls}-chip" href="./SJ-08.html">↔ SJ-08</a>
    </div>
  </div>
  <div class="${c.cls}-meta">史鉴台账七字段 · ${esc(c.dynasty.split('/')[0])}<br/><b>AS_OF 2026-07-15</b> · v0.1</div>
</header>
<p class="sj-zhupi">${c.zhupi}</p>
<article class="sj-ledger">
<div class="sj-page-layout">
<div class="sj-main-col">
<section class="sj-ledger-field" id="f1"><div class="sj-ledger-fh"><span class="fnum">01</span><h2>一句话拐点</h2></div>
  <div class="${c.cls}-hook"><p>${c.hook}</p><div class="yr">${esc(c.chronology)}</div></div>
</section>
<section class="sj-ledger-field" id="f2"><div class="sj-ledger-fh"><span class="fnum">02</span><h2>结构切片</h2></div>
  <p class="${c.cls}-prose">${c.sliceProse}</p>
  <div class="${c.cls}-stage" id="stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">结构切片 · ${esc(c.title)}</title>
  <desc id="sj-desc">${esc(c.sliceProse.replace(/<[^>]+>/g, ''))}</desc>
  <defs>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/></linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
    <marker id="a-paper" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-paper-100)"/></marker>
  </defs>
  <rect width="820" height="600" fill="var(--sj-ink-900)"/>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,serif">结构切片 · ${esc(c.title)}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-${c.num} · ${esc(c.dynasty)} · ${esc(c.type)}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批 · 五力色义 · 点击节点交互</text>
  ${svgEdges}
  ${svgNodes}
  <text x="764" y="588" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,monospace">viewBox 820×600 · SJ-${c.num}</text>
</svg></div>
  <div class="${c.cls}-layout">
    <aside class="${c.cls}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="${c.cls}-aside-empty">点选切片中任一节点，展开机制链角色（NODE_DATA 交互）。</div>
      <div id="aside-body" hidden>
        <div class="k" id="aside-tag">—</div>
        <h3 id="aside-name">—</h3>
        <p id="aside-text">—</p>
      </div>
    </aside>
  </div>
</section>
</div>
<aside class="sj-rail"><div class="sj-rail-card"><div class="k">台账 · 七字段</div>
  <nav class="sj-rail-toc"><a href="#f1">01 · 拐点</a><a href="#f2">02 · 切片</a><a href="#f3">03 · 相位</a><a href="#f4">04 · 五力</a><a href="#f5">05 · 交锋</a><a href="#f6">06 · 成败</a><a href="#f7">07 · 映射</a></nav>
  <a class="sj-rail-chip" href="./SJ-00.html#sec-case-hub">案例库 Hub</a>
  <a class="sj-rail-chip" href="./SJ-03.html">SJ-03 五力</a>
  <a class="sj-rail-chip" href="./SJ-04.html">SJ-04 相位盘</a>
  <a class="sj-rail-chip" href="./SJ-08.html">SJ-08 分裂重整</a>
</div></aside>
</div>
<section class="sj-ledger-field" id="f3"><div class="sj-ledger-fh"><span class="fnum">03</span><h2>相位定位</h2></div>
  <div class="${c.cls}-phase"><span class="pb">${esc(c.phase)}</span></div>
  <p class="${c.cls}-prose">${c.phaseProse}</p>
</section>
<section class="sj-ledger-field" id="f4"><div class="sj-ledger-fh"><span class="fnum">04</span><h2>五力归因台账</h2></div>
  <div class="${c.cls}-table-wrap"><table class="${c.cls}-table"><thead><tr><th>力</th><th>正史归因</th><th>结构实因</th></tr></thead><tbody>${renderForces(c.forces)}</tbody></table></div>
</section>
<section class="sj-ledger-field" id="f5"><div class="sj-ledger-fh"><span class="fnum">05</span><h2>史家交锋</h2></div>
  <div class="${c.cls}-hist">${renderHist(c.hist)}</div>
</section>
<section class="sj-ledger-field" id="f6"><div class="sj-ledger-fh"><span class="fnum">06</span><h2>成败判定</h2></div>
  <div class="${c.cls}-verdict">
    <article class="ok"><div class="vh">已兑现</div>${c.verdict.ok.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
    <article class="fail"><div class="vh">已失败</div>${c.verdict.fail.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
    <article class="open"><div class="vh">未决</div>${c.verdict.open.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
  </div>
</section>
<section class="sj-ledger-field" id="f7"><div class="sj-ledger-fh"><span class="fnum">07</span><h2>古今映射</h2></div>
  <div class="${c.cls}-mirror">
    <article class="same"><div class="mh">相似机制</div><p>${esc(c.mirror.same)}</p></article>
    <article class="diff"><div class="mh">关键差异</div><p>${esc(c.mirror.diff)}</p></article>
  </div>
</section>
<section class="sj-ledger-field" id="fx"><div class="sj-ledger-fh"><span class="fnum">◆</span><h2>交叉引用</h2></div>
  <div class="${c.cls}-xref">${xrefs}</div>
</section>
</article>
<footer class="${c.cls}-foot">
  <span>ChinaOS · 史鉴 SJ-${c.num} · v0.1 · ${esc(c.dynasty)}</span>
  <span><a href="./SJ-00.html">← SJ-00</a> · <a href="./${c.footerPrev}.html">← ${c.footerPrev}</a></span>
  <span><a href="./${c.footerNext}.html">${c.footerNext} →</a></span>
</footer>
</div>
<script>
(function(){
  const stage = document.getElementById('stage');
  const nodes = Array.from(stage.querySelectorAll('.sj-node'));
  const edges = Array.from(stage.querySelectorAll('.sj-edge'));
  const asideEmpty = document.getElementById('aside-empty');
  const asideBody = document.getElementById('aside-body');
  const NODE_DATA = ${JSON.stringify(nodeData, null, 2)};
  const NODE_EDGE = ${JSON.stringify(c.nodeEdge, null, 2)};
  function clearVisual(){ stage.classList.remove('is-picking'); nodes.forEach(n=>n.classList.remove('is-hot')); edges.forEach(e=>e.classList.remove('is-hot')); }
  function showAside(id){ const d=NODE_DATA[id]; if(!d) return; asideEmpty.hidden=true; asideBody.hidden=false;
    document.getElementById('aside-tag').textContent=d.tag; document.getElementById('aside-name').textContent=d.name; document.getElementById('aside-text').textContent=d.body; }
  function pick(id){ if(!NODE_DATA[id]) return; clearVisual(); stage.classList.add('is-picking');
    nodes.forEach(n=>n.classList.toggle('is-hot', n.dataset.id===id));
    const hot=NODE_EDGE[id]||[]; edges.forEach(e=>e.classList.toggle('is-hot', hot.indexOf(e.dataset.edge)>=0));
    showAside(id); }
  nodes.forEach(n=>{ const act=()=>pick(n.dataset.id); n.addEventListener('click',act);
    n.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); act(); } }); });
})();
</script>
</body>
</html>`;
}

function renderSpec(c) {
  return `# SJ-${c.num} · ${c.title} —— 建设规格

> SJ-${c.num} · ${c.type}案例卷 · ${c.dynasty}。朝代：${c.dynasty} · 类型：${c.type}

## 模块头

- 系年：见 HTML §01
- 交叉引用：见 HTML §◆；SJ-03 五力 / SJ-04 相位盘 / SJ-08 分裂—重整对照链

## 七字段摘要

① ${c.hook.slice(0, 120)}…

② ${c.sliceProse.replace(/<[^>]+>/g, '').slice(0, 100)}…

③ ${c.phase}

④ 五力：见 HTML 台账表

⑤ 史家交锋：李敖/钱穆/金观涛/黄仁宇/汉学

⑥ 成败三列：已兑现/已失败/未决

⑦ 古今映射：相似机制 + 关键差异双栏

## 结构切片

- 节点数：${c.nodes.length} · NODE_DATA 交互 · 五力色义
- 分裂期须链 SJ-08「分裂—重整」对照
`;
}

for (const c of CASES) {
  const htmlPath = path.join(OUT, `SJ-${c.num}.html`);
  const specPath = path.resolve(import.meta.dirname, `../docs/shijian/SJ-${c.num}-${c.title}-建设规格.md`);
  fs.writeFileSync(htmlPath, renderHtml(c), 'utf8');
  fs.writeFileSync(specPath, renderSpec(c), 'utf8');
  console.log('Wrote', htmlPath, specPath);
}
