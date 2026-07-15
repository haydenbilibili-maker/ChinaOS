#!/usr/bin/env node
/** Generate SJ-45/46/50/51 Round 3 余案（元+清深化）. Premium §02 via patch-sj-slices.mjs */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../app/public/shijian');
const DOCS = path.resolve(import.meta.dirname, '../docs/shijian');

const CASES = [
  {
    num: '45', cls: 'sj-45',
    title: '行省制度', subtitle: '央地分权创新 · 行中书省 · 省制奠基',
    badge: 'SJ-45 · 制度演变案例卷 · 元',
    dynasty: '元', dynastyId: 'yuan', type: '制度',
    extraChip: '',
    zhupi: '朱批：本案是<strong>央地结构创新</strong>样本——元设行中书省，由中央派出机构渐成地方最高政区，「省」制由此定型并延续至今。口径：《元史·百官志》《地理志》；1287 改行尚书省为行中书省、成宗大德后辖区渐稳为通说〔细节存疑〕。',
    hook: '蒙古统一后疆域辽阔，仅靠中书省与临时派出机构难以治理。元世祖以<b>行中书省</b>（简称行省）统辖一路以上军民钱粮，初为因事而设，后渐成定制——由只管军事到兼管民政，形成「腹里（中书省直辖）+ 十行省」格局。行省是今天省级政区的历史源头，也是大一统帝国央地分权的结构创新。',
    chronology: '系年：至元二十四年（1287）改行尚书省为行中书省 · 至顺元年（1330）约十一行省格局 · 出处《元史·百官志》《地理志》',
    sliceProse: '权力几何：<strong>中书省/皇帝</strong>授权<strong>行中书省</strong>纵列 → 路府州县下行治理 → <strong>腹里与行省</strong>双底盘。制度纵列（青瓷）为主轴，蒙古—汉地精英博弈（朱批）为执行张力。',
    phase: '鼎盛期 · 制度奠基', phaseProse: '元朝在<strong>上升—鼎盛</strong>相位完成疆域整合，行省制度落于 SJ-04「鼎盛期·央地结构创新」。与 SJ-35 隋初三省、SJ-39 唐藩镇截留构成「中央—地方汲取链」对照：行省是主动分权而非被动分割。',
    forces: [
      ['财政汲取', '「行省治民」', '行省掌辖区内钱粮、漕运、屯田——汲取链由中央纵列直达路府，较唐藩镇截留更可控'],
      ['精英循环', '达鲁花赤 · 汉官', '蒙古达鲁花赤与汉地官僚并置，精英通道双轨；色目人、汉人、南人等级影响仕途'],
      ['合法性叙事', '「大一统」', '行省为「行动的中书省」，以统一叙事包装多民族帝国治理'],
      ['边疆军事', '征东等行省', '部分行省因军事征伐而设（如征东行省），后多撤销；辽阳、甘肃、云南等兼边防'],
      ['生态—人口基座', '—', '统一后赋役与户籍括户（如大索貌阅传统）试图锁定税基〔元初户数存疑〕'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '剥离「行省=现代省」的简单等同——元行省初为派出机关，职权与辖区屡变，至大德年间才趋稳定。'],
      ['钱穆', '《国史大纲》', '强调行省对后世地方行政的深远影响；元制承金、启明。'],
      ['金观涛', '超稳定结构', '官僚模块化在疆域扩张下的「分块治理」——行省是超稳定结构的空间复制。'],
      ['黄仁宇', '数目字管理', '元试图以行省统合数目字管理，但基层会计仍薄；与明清省制有连续也有断裂。'],
      ['西方汉学', 'Yuan provinces', '学界共识：行省制是 Medieval China 地方行政的关键创新；1287 改制为重要节点。〔存疑〕'],
    ],
    verdict: {
      ok: ['省制延续至今', '疆域整合治理', '央地分权模板'],
      fail: ['民族等级固化', '后期腐败', '元末崩解未改行省名'],
      open: ['〔反事实〕若元初即固定行省辖区与任期，能否延缓元末地方失控？'],
    },
    mirror: {
      same: '大一统帝国下的央地分权；派出机关地方化；汲取链空间分块。',
      diff: '现代省制有宪法与民主程序；但「中央派出→地方常设政区」的路径仍可对读（→ SJ-35 三省、当代央地关系）。',
    },
    xrefs: [
      ['SJ-35 · 隋文帝', '隋初', '三省六部为中枢模块化上游。'],
      ['SJ-39 · 两税法', '两税', '藩镇截留 vs 行省统辖的对照。'],
      ['SJ-04 · 相位盘', '相位盘', '鼎盛期·制度奠基定位。'],
    ],
    footerPrev: 'SJ-34', footerNext: 'SJ-46',
    nodes: [
      { id: 'zhongshu', x: 310, y: 112, w: 200, h: 46, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '中书省 · 皇帝', sub: '中央中枢 · 腹里', tfill: 'var(--sj-ochre)', tag: '皇权', body: '元废三省留中书，为最高政务机关；腹里（今华北一带）由中书省直辖。' },
      { id: 'xingsheng', x: 130, y: 220, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '行中书省', sub: '1287 定制 · 纵列', tfill: 'var(--sj-celadon)', tag: '制度枢纽', body: '「行动的中书省」——初临时、后常设，掌一路以上军民钱粮。至元二十四年改行尚书省为行中书省（《元史·百官志》）。' },
      { id: 'lufu', x: 310, y: 330, w: 200, h: 60, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '路 · 府 · 州', sub: '汲取下行', tfill: 'var(--sj-ochre)', tag: '财政链', body: '行省之下设路府州县，税粮、徭役经路府征解至行省再解中央——汲取纵列。' },
      { id: 'daru', x: 514, y: 220, w: 186, h: 60, stroke: 'var(--sj-paper-300)', fill: 'var(--sj-ink-800)', title: '达鲁花赤', sub: '蒙古监官 · 双轨', tfill: 'var(--sj-paper-300)', tag: '精英双轨', body: '各路设蒙古监官，与汉官并置——精英循环的双轨结构，保障蒙古利益。' },
      { id: 'menfa', x: 514, y: 330, w: 186, h: 60, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '色目 · 南人', sub: '四等人制 · 张力', tfill: 'var(--sj-vermil)', tag: '合法性隐患', body: '民族等级使合法性叙事与基层承受力脱节，为元末矛盾埋伏笔。' },
      { id: 'shiyi', x: 130, y: 330, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '十行省格局', sub: '1330 约定型', tfill: 'var(--sj-celadon)', tag: '空间分块', body: '岭北、辽阳、河南、陕西、甘肃、江浙、江西、湖广、四川、云南等——约十一行省（含腹里为中书直辖）。' },
      { id: 'base', x: 56, y: 450, w: 708, h: 70, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '编户 · 腹里与行省底盘', sub: '税基 · 多民族帝国', tfill: 'var(--sj-paper-100)', tag: '基座', body: '统一后括户、赋役试图锁定税基；行省分块使大帝国治理成为可能。〔户数存疑〕' },
    ],
    edges: [
      { id: 'e1', d: 'M410,158 L218,220', stroke: 'var(--sj-ochre)', w: 2.4, marker: 'a-ochre', label: '派出行省', lx: 310, ly: 195, nodes: ['zhongshu', 'xingsheng'] },
      { id: 'e2', d: 'M218,280 L410,330', stroke: 'var(--sj-celadon)', w: 2.6, marker: 'a-celadon', label: '路府下行', lx: 310, ly: 310, nodes: ['xingsheng', 'lufu'] },
      { id: 'e3', d: 'M410,390 L410,450', stroke: 'var(--sj-ochre)', w: 2.2, marker: 'a-ochre', nodes: ['lufu', 'base'] },
      { id: 'e4', d: 'M306,250 L514,250', stroke: 'var(--sj-paper-300)', w: 2, marker: 'a-paper', nodes: ['xingsheng', 'daru'] },
      { id: 'e5', d: 'M607,280 L510,330', stroke: 'var(--sj-vermil)', w: 2, marker: 'a-vermil', label: '等级张力', lx: 570, ly: 305, nodes: ['menfa', 'lufu'] },
      { id: 'e6', d: 'M218,330 L310,330', stroke: 'var(--sj-celadon)', w: 1.8, nodes: ['shiyi', 'xingsheng'] },
    ],
    nodeEdge: {
      zhongshu: ['e1'], xingsheng: ['e1', 'e2', 'e4', 'e6'], lufu: ['e2', 'e3', 'e5'],
      daru: ['e4'], menfa: ['e5'], shiyi: ['e6'], base: ['e3'],
    },
  },
  {
    num: '46', cls: 'sj-46',
    title: '红巾起义', subtitle: '崩解期多力共振 · 黄河民变 · 元亡明兴',
    badge: 'SJ-46 · 王朝崩解案例卷 · 元',
    dynasty: '元', dynastyId: 'yuan', type: '崩解',
    extraChip: '',
    zhupi: '朱批：本案是<strong>崩解期多力共振</strong>样本——至正十一年（1351）治黄河征发引爆民变，韩山童/刘福通红巾起，白莲教「明王出世」夺合法性叙事，元顺帝中枢失控。口径：《元史·顺帝本纪》；韩山童事泄遇害、刘福通颍州起义为通说。',
    hook: '元末政治腐败、财政枯竭、黄河泛滥与治河征发叠加，至正十一年（1351）<b>韩山童</b>（事泄遇害）之徒<b>刘福通</b>于颍州起义，头裹红巾，以「弥勒下生、明王出世」与「恢复大宋」为号召——<b>红巾起义</b>引燃元末崩解链，群雄割据，最终由朱元璋完成重整（→ 明）。',
    chronology: '系年：至正十一年（1351）颍州起义 · 至正十九年（1359）刘福通汴梁受挫 · 1368 明军北伐 · 出处《元史·顺帝本纪》',
    sliceProse: '权力几何：<strong>元顺帝中枢虚化</strong> → 治黄河/开河（赭金过载）下行压垮编户 → <strong>刘福通/红巾</strong>（朱红引爆）夺叙事。多力共振链，非单因「暴政」叙事。',
    phase: '崩解期 · 多力共振', phaseProse: '元末处于<strong>崩解期</strong>——财政（治河/变钞）、基座（灾荒流民）、合法性（民族等级+白莲叙事）与军事（各支义军）共振。落于 SJ-04「崩解期·多力引燃」。与 SJ-10 明末三饷、SJ-12 秦末汲取过载同构。',
    forces: [
      ['财政汲取', '治河 · 变钞', '至正十一年征十五万民夫治黄河，官吏克扣工食；变钞通货膨胀——财政枢纽越阈（《元史·食货志》）'],
      ['精英循环', '脱脱 · 伯颜', '元末权臣更替、蒙古贵族内斗，中枢无法协调镇压；地方豪强与义军首领崛起'],
      ['合法性叙事', '白莲 · 明王', '「弥勒下生、明王出世」夺「天命」话语；韩林儿小明王国号宋，与元「天命」对垒'],
      ['边疆军事', '红巾 · 群雄', '刘福通、徐寿辉、朱元璋等军事集团割据；元军屡败，军事力离心'],
      ['生态—人口基座', '黄河 · 饥荒', '黄河决口、旱疫并发，流民为起义底盘——基座引燃与财政引燃共振'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '剥离「民族压迫单因论」——结构实因是财政征发+灾荒+合法性破产的多力共振。'],
      ['钱穆', '《国史大纲》', '元亡于政治腐败与民变，明承元制而又改之；红巾为明初记忆。'],
      ['金观涛', '超稳定结构', '崩解期「汲取越阈+叙事夺权」标准链；元明易代仍在大一统框架内。'],
      ['黄仁宇', '数目字管理', '元末数目字管理失败，治河工程暴露基层会计与征发失控。'],
      ['西方汉学', 'Red Turban', '学界共识：1351 为 Yuan collapse 关键节点；与 Late Ming 民变有结构可比。〔存疑〕'],
    ],
    verdict: {
      ok: ['元统治瓦解', '明初重整', '农民战争改朝样本'],
      fail: ['韩山童遇害', '红巾内斗', '元末人口损失'],
      open: ['〔未决〕若元廷及时赈济减征，能否避免 1351 引爆？对照 SJ-10 三饷。'],
    },
    mirror: {
      same: '财政征发越阈+灾荒+合法性叙事被夺；多力共振崩解；改朝换代链。',
      diff: '现代有救灾与社会保障；但「工程征发+通胀+流民」组合仍值得警戒（→ SJ-10 明末、SJ-12 秦末）。',
    },
    xrefs: [
      ['SJ-07 · 崩解矩阵', '崩解矩阵', '元行可纳入崩解对比（规划扩展）。'],
      ['SJ-10 · 明末', '明末', '三饷+小冰期多力共振对照。'],
      ['SJ-04 · 相位盘', '相位盘', '崩解期·多力引燃定位。'],
    ],
    footerPrev: 'SJ-45', footerNext: 'SJ-50',
    nodes: [
      { id: 'shundi', x: 310, y: 112, w: 200, h: 46, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '元顺帝', sub: '中枢虚化 · 合法性', tfill: 'var(--sj-ochre)', tag: '皇权空壳', body: '元末顺帝朝政腐败，权臣专擅，无法有效应对民变——合法性绩效破产。' },
      { id: 'zhihe', x: 130, y: 230, w: 176, h: 60, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '治黄河 · 开河', sub: '至正十一年 · 征发', tfill: 'var(--sj-ochre)', tag: '财政引燃', body: '征十五万民夫治河，克扣工食，「石人一只眼，挑动黄河天下反」——汲取越阈引爆点。' },
      { id: 'liufutong', x: 514, y: 230, w: 186, h: 72, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '刘福通 · 红巾', sub: '1351 颍州 · 引爆', tfill: 'var(--sj-vermil)', tag: '军事—叙事', body: '韩山童事泄遇害后，刘福通率众起义，红巾为号，建小明宋——夺「天命」话语。' },
      { id: 'bailian', x: 130, y: 360, w: 176, h: 56, stroke: 'var(--sj-paper-100)', fill: 'var(--sj-ink-800)', title: '白莲 · 明王', sub: '合法性叙事', tfill: 'var(--sj-paper-100)', tag: '叙事夺权', body: '「弥勒下生、明王出世」提供反抗合法性，与元正统叙事对垒。' },
      { id: 'qunxiong', x: 514, y: 360, w: 186, h: 56, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '徐寿辉 · 朱元璋', sub: '群雄割据', tfill: 'var(--sj-celadon)', tag: '精英旁路', body: '南方红巾、朱元璋等集团各自发展，元无法逐一扑灭——军事力碎片化。' },
      { id: 'bianchao', x: 310, y: 360, w: 200, h: 56, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '变钞 · 通胀', sub: '财政共振', tfill: 'var(--sj-vermil)', tag: '共振力', body: '滥发纸币、物价飞腾，与治河征发叠加——财政多线越阈。' },
      { id: 'base', x: 56, y: 452, w: 708, h: 60, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '流民 · 灾荒底盘', sub: '黄河 · 旱疫', tfill: 'var(--sj-paper-100)', tag: '基座引燃', body: '黄河决口、饥荒瘟疫制造大量流民——崩解的底盘引燃力。' },
    ],
    edges: [
      { id: 'e1', d: 'M410,158 L218,230', stroke: 'var(--sj-ochre)', w: 1.6, dash: '5 4', marker: 'a-ochre', nodes: ['shundi', 'zhihe'] },
      { id: 'e2', d: 'M218,290 L410,452', stroke: 'var(--sj-ochre)', w: 2.8, marker: 'a-ochre', label: '征发越阈', lx: 280, ly: 380, nodes: ['zhihe', 'base'] },
      { id: 'e3', d: 'M607,266 C680,320 680,400 410,452', stroke: 'var(--sj-vermil)', w: 3.4, marker: 'a-vermil', label: '1351 引爆', lx: 620, ly: 360, nodes: ['liufutong', 'base'] },
      { id: 'e4', d: 'M306,260 L514,260', stroke: 'var(--sj-vermil)', w: 2.6, marker: 'a-vermil', nodes: ['zhihe', 'liufutong'] },
      { id: 'e5', d: 'M218,360 L410,388', stroke: 'var(--sj-paper-100)', w: 2, nodes: ['bailian', 'liufutong'] },
      { id: 'e6', d: 'M410,158 L410,360', stroke: 'var(--sj-vermil)', w: 2, marker: 'a-vermil', nodes: ['shundi', 'bianchao'] },
      { id: 'e7', d: 'M607,360 L410,420', stroke: 'var(--sj-celadon)', w: 1.8, nodes: ['qunxiong', 'base'] },
    ],
    nodeEdge: {
      shundi: ['e1', 'e6'], zhihe: ['e1', 'e2', 'e4'], liufutong: ['e3', 'e4', 'e5'],
      bailian: ['e5'], qunxiong: ['e7'], bianchao: ['e6'], base: ['e2', 'e3', 'e7'],
    },
  },
  {
    num: '50', cls: 'sj-50',
    title: '太平天国', subtitle: '基座承载越阈 · 军事消耗 · 清帝国震荡',
    badge: 'SJ-50 · 王朝崩解案例卷 · 清',
    dynasty: '清', dynastyId: 'qing', type: '崩解',
    extraChip: '<a class="sj-50-chip" href="./SJ-49.html">↔ SJ-49</a>',
    zhupi: '朱批：本案承<strong>SJ-49 康乾拐点</strong>下游——人口压力、财政枯竭与合法性危机叠加，1851 金田起义以拜上帝会动员，基座承载与军事消耗双引燃。口径：《清史稿·洪秀全传》；人口损失学界估算差异大，须标出处或〔存疑〕（何炳棣/曹树基等）。',
    hook: '嘉道以降，人口逼近承载、鸦片贸易与白银外流、吏治腐败，清帝国进入隐性崩解。咸丰元年（1851）<b>洪秀全</b>于广西金田起义，建号<b>太平天国</b>，以宗教—平均主义叙事动员流民；虽最终被湘淮军与洋枪队镇压，但战祸遍及江南，人口损失学界估算约五千万至七千万〔存疑，须标出处〕——是清帝国最大的内部军事震荡，直接通向洋务—维新—辛亥链（SJ-14→SJ-51→SJ-15）。',
    chronology: '系年：咸丰元年（1851.1.11）金田起义 · 同治三年（1864）天京陷 · 出处《清史稿·洪秀全传》',
    sliceProse: '权力几何：<strong>清廷/咸丰</strong>（虚化）→ 团练/湘淮（青瓷）对垒 <strong>洪秀全/天朝</strong>（朱红）→ 江南基座（人口+战祸）越阈。承 SJ-49 人口慢变量，军事消耗为快变量引爆。',
    phase: '崩解期 · 内部战争', phaseProse: '太平天国落于<strong>崩解期</strong>——承康乾拐点后人口/僵化积累（SJ-49），以内部战争形式释放压力。在 SJ-04 相位盘与 SJ-07 清行崩解叙事衔接；下游为 SJ-14 洋务局部修补。',
    forces: [
      ['财政汲取', '厘金 · 筹饷', '战争迫使清廷开厘金、借外债，财政结构被迫调整——汲取工具近代化但负担加重'],
      ['精英循环', '湘淮 · 汉人督抚', '曾国藩、李鸿章等汉人督抚以团练崛起，精英循环通道变化——「内轻外重」再演'],
      ['合法性叙事', '拜上帝 · 天朝', '洪秀全以基督教变体+平均主义夺「天命」；清廷「祖宗之法」叙事受冲击'],
      ['边疆军事', '湘军 · 洋枪', '湘淮军+洋枪队（「常胜军」）决定战争走向；军事力地方化'],
      ['生态—人口基座', '战祸 · 饥荒', '江南长期战场，人口损失学界估约 5000万–7000万〔存疑，曹树基等〕——基座与军事双引燃'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '剥离「农民革命」单一道德叙事——结构实因是人口压力+财政危机+动员宗教化。'],
      ['钱穆', '《国史大纲》续论', '太平天国为清衰关键事件；汉人督抚坐大影响晚清政治结构。'],
      ['金观涛', '超稳定结构', '内部战争为超稳定结构释放压力的方式；未能突破农业帝国天花板。'],
      ['黄仁宇', '数目字管理', '战争暴露清后期数目字管理仍不足以支撑现代战争财政。'],
      ['西方汉学', 'Taiping', '学界对人口损失与革命性质争议大；与 SJ-49 人口拐点构成因果讨论。〔存疑〕'],
    ],
    verdict: {
      ok: ['迫使洋务回应', '厘金等财政近代化', '汉人督抚崛起'],
      fail: ['天京陷落', '人口损失巨大', '未能完成现代转型'],
      open: ['〔未决〕人口损失精确数字学界未共识；对 SJ-14 洋务触发程度仍存争议。'],
    },
    mirror: {
      same: '人口/基座压力+合法性危机→内部战争；宗教化动员；地方军事集团崛起。',
      diff: '现代国家有工业战争能力与社会保障；但「慢变量人口压力+快变量战争」共振逻辑仍可对读（→ SJ-49、SJ-23 社会映射）。',
    },
    xrefs: [
      ['SJ-49 · 康乾拐点', '康乾', '人口/僵化上游；隐性拐点下游。'],
      ['SJ-14 · 洋务', '洋务', '战争后局部现代化；中体西用。'],
      ['SJ-07 · 崩解矩阵', '崩解矩阵', '清行崩解深描之一。'],
    ],
    footerPrev: 'SJ-46', footerNext: 'SJ-51',
    nodes: [
      { id: 'qingting', x: 310, y: 112, w: 200, h: 46, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '清廷 · 咸丰', sub: '合法性动摇', tfill: 'var(--sj-ochre)', tag: '皇权危机', body: '鸦片战争后财政与合法性受创，咸丰年间内忧外患并发。' },
      { id: 'hong', x: 514, y: 220, w: 186, h: 72, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '洪秀全 · 天朝', sub: '1851 金田 · 拜上帝', tfill: 'var(--sj-vermil)', tag: '叙事夺权', body: '金田起义建号太平天国，以宗教+平均主义动员——合法性被体系外叙事夺取。' },
      { id: 'xianghuai', x: 130, y: 220, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '湘淮 · 曾李', sub: '团练 · 督抚', tfill: 'var(--sj-celadon)', tag: '精英—军事', body: '曾国藩、李鸿章等以地方团练崛起，汉人督抚权力膨胀——精英循环变轨。' },
      { id: 'zhanhuo', x: 310, y: 340, w: 200, h: 60, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '江南 · 战祸', sub: '1864 天京陷', tfill: 'var(--sj-vermil)', tag: '军事消耗', body: '战争遍及苏皖浙赣，长期拉锯消耗双方——军事力与财政双透支。' },
      { id: 'renkou', x: 514, y: 340, w: 186, h: 56, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '人口损失', sub: '5000万–7000万〔存疑〕', tfill: 'var(--sj-vermil)', tag: '基座引燃', body: '学界估算人口损失约五千万至七千万（曹树基等），须标「估算」与出处。' },
      { id: 'yangwu', x: 130, y: 340, w: 176, h: 56, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '厘金 · 筹饷', sub: '财政被迫调整', tfill: 'var(--sj-ochre)', tag: '财政', body: '战争推动厘金等近代化汲取工具——局部制度回应。' },
      { id: 'base', x: 56, y: 452, w: 708, h: 60, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '广西 · 江南底盘', sub: '灾荒 · 流民 · 土地', tfill: 'var(--sj-paper-100)', tag: '慢变量', body: '承 SJ-49 人口压力；广西起事、江南决战——基座承载越阈的地理表现。' },
    ],
    edges: [
      { id: 'e1', d: 'M410,158 L218,220', stroke: 'var(--sj-ochre)', w: 1.4, dash: '4 4', marker: 'a-ochre', nodes: ['qingting', 'xianghuai'] },
      { id: 'e2', d: 'M306,250 L514,250', stroke: 'var(--sj-vermil)', w: 3, marker: 'a-vermil', label: '1851 对峙', lx: 410, ly: 242, nodes: ['xianghuai', 'hong'] },
      { id: 'e3', d: 'M607,292 L410,340', stroke: 'var(--sj-vermil)', w: 2.6, marker: 'a-vermil', nodes: ['hong', 'zhanhuo'] },
      { id: 'e4', d: 'M410,400 L410,452', stroke: 'var(--sj-vermil)', w: 2.4, marker: 'a-vermil', nodes: ['zhanhuo', 'base'] },
      { id: 'e5', d: 'M607,366 L410,420', stroke: 'var(--sj-vermil)', w: 2.8, marker: 'a-vermil', label: '人口〔存疑〕', lx: 520, ly: 400, nodes: ['renkou', 'base'] },
      { id: 'e6', d: 'M218,280 L218,340', stroke: 'var(--sj-ochre)', w: 2, marker: 'a-ochre', nodes: ['xianghuai', 'yangwu'] },
      { id: 'e7', d: 'M410,158 C480,200 520,260 607,256', stroke: 'var(--sj-vermil)', w: 2, dash: '5 4', marker: 'a-vermil', nodes: ['qingting', 'hong'] },
    ],
    nodeEdge: {
      qingting: ['e1', 'e7'], hong: ['e2', 'e3', 'e7'], xianghuai: ['e1', 'e2', 'e6'],
      zhanhuo: ['e3', 'e4'], renkou: ['e5'], yangwu: ['e6'], base: ['e4', 'e5'],
    },
  },
  {
    num: '51', cls: 'sj-51',
    title: '戊戌变法', subtitle: '体制突破失败 · 百日维新 · 守旧反扑',
    badge: 'SJ-51 · 变法改革案例卷 · 清',
    dynasty: '清', dynastyId: 'qing', type: '变法',
    extraChip: '<a class="sj-51-chip" href="./SJ-14.html">↔ SJ-14</a>',
    zhupi: '朱批：本案是<strong>变法谱系「体制突破型」失败</strong>样本——甲午后光绪求变，1898 百日维新触及制度，因无独立权力基础、触动守旧派，慈禧政变而败。与 SJ-14「只改器物不改体制」构成变法谱系两种失败路径。口径：《清史稿·德宗本纪》；1898.6.11–9.21 为通说。',
    hook: '甲午战败（SJ-14 下游）后，光绪帝于光绪二十四年（1898）六月十一日颁「明定国是」诏，<b>康有为、梁启超</b>等推动<b>百日维新</b>——废八股、设京师大学堂、裁冗员、鼓励工商。变法触及科举与官制，守旧派反扑；九月二十一日<b>慈禧政变</b>，光绪囚瀛台，谭嗣同等「六君子」遇害，变法失败——这是「比洋务更进一层、却仍系于皇权钟摆」的体制突破失败标本。',
    chronology: '系年：光绪二十四年六月十一日（1898.6.11）明定国是 · 九月二十一日（1898.9.21）戊戌政变 · 出处《清史稿·德宗本纪》',
    sliceProse: '权力几何：<strong>光绪</strong>（虚线背书）→ <strong>康梁维新</strong>纵列 → 废八股/大学堂/裁冗下行 → <strong>慈禧/守旧派</strong>（朱红粗回路）反扑。承 SJ-14 甲午外环，变法死穴在「无制度化的改革保障」。',
    phase: '僵化期 · 改革窗口', phaseProse: '晚清处于<strong>僵化期</strong>——洋务未能救崩解，维新试图体制突破。落于 SJ-04「僵化期·改革窗口」与 SJ-16 变法谱系「触动精英/体制型」。下游 SJ-15 辛亥以革命替代改良。',
    forces: [
      ['财政汲取', '裁冗 · 工商', '裁并衙门、奖励实业——试图减轻财政负担并开辟税源，执行阻力大'],
      ['精英循环', '废八股 · 守旧派', '废八股直接触动士绅—科举精英通道；守旧派（翁同龢之后的一班满洲与汉族保守官僚）集体反扑'],
      ['合法性叙事', '「明定国是」', '光绪以皇帝诏书背书变法，但慈禧「训政」叙事仍强——双头合法性'],
      ['边疆军事', '练新军', '维新派主张练新军，但未及成军即政变；军事力仍在慈禧—荣禄系'],
      ['生态—人口基座', '—', '人口压力未解；变法未触及土地与基层汲取，基座矛盾仍在'],
    ],
    hist: [
      ['李敖式考据', '祛魅', '剥离「光绪明君」叙事——变法系于个人权威、无制度保障，失败结构必然。'],
      ['钱穆', '《国史大纲》续论', '戊戌为清亡前最后一次自上而下改革；失败后革命思潮上升。'],
      ['金观涛', '超稳定结构', '僵化期改革窗口的典型失败——触动精英而未获独立权力基础。'],
      ['黄仁宇', '数目字管理', '维新未推进数目字管理，与明治维新形成对照——制度现代化不足。'],
      ['西方汉学', 'Hundred Days', '学界共识：1898 为 Late Qing reform 关键失败；与 Meiji 对比为常见议题。〔存疑〕'],
    ],
    verdict: {
      ok: ['京师大学堂等遗产', '思想启蒙', '变法谱系重要一环'],
      fail: ['百日而败', '六君子遇害', '光绪被囚'],
      open: ['〔反事实〕若光绪能真正亲政并控制军权，戊戌能否不同于洋务？此为 SJ-16 谱系未决项。'],
    },
    mirror: {
      same: '僵化期改革窗口；触动精英/体制；系于皇权个人背书；守旧派反扑。',
      diff: '现代改革有法治与制度化保障；但「改革无独立权力基础→钟摆反扑」仍值得警戒（→ SJ-05 人亡政息、SJ-16 变法谱系）。',
    },
    xrefs: [
      ['SJ-14 · 洋务', '洋务', '甲午上游；器物 vs 体制两种失败路径。'],
      ['SJ-15 · 辛亥', '辛亥', '改良失败后革命链。'],
      ['SJ-16 · 变法谱系', '变法谱系', '体制突破型失败成员。'],
    ],
    footerPrev: 'SJ-50', footerNext: 'SJ-15',
    nodes: [
      { id: 'guangxu', x: 320, y: 112, w: 180, h: 46, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '光绪帝', sub: '明定国是 · 脆弱', tfill: 'var(--sj-ochre)', tag: '合法性背书', body: '1898.6.11 颁明定国是诏，但人事军政仍受慈禧制约——改革背书脆弱。' },
      { id: 'kangliang', x: 130, y: 250, w: 176, h: 60, stroke: 'var(--sj-celadon)', fill: 'var(--sj-ink-800)', title: '康有为 · 梁启超', sub: '维新纵列', tfill: 'var(--sj-celadon)', tag: '改革引擎', body: '保国会、变法奏议；推动废八股、设大学堂、裁冗——体制突破尝试。' },
      { id: 'cixi', x: 462, y: 250, w: 186, h: 60, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '慈禧 · 守旧派', sub: '九月二十一日政变', tfill: 'var(--sj-vermil)', tag: '精英反扑', body: '1898.9.21 发动政变，训政，杀谭嗣同等——变法真正的结构死穴。' },
      { id: 'reform', x: 132, y: 372, w: 176, h: 50, stroke: 'var(--sj-ochre)', fill: 'var(--sj-ink-800)', title: '废八股 · 大学堂', sub: '制度下行', tfill: 'var(--sj-ochre)', tag: '财政—精英枢纽', body: '废八股触动士绅通道；京师大学堂等为少数存续遗产。' },
      { id: 'jiawu', x: 52, y: 280, w: 162, h: 56, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '甲午 · 1894', sub: 'SJ-14 外环', tfill: 'var(--sj-vermil)', tag: '上游引爆', body: '甲午战败证伪洋务-only 路径，催生维新——体系外压力内化。' },
      { id: 'tans', x: 462, y: 372, w: 186, h: 50, stroke: 'var(--sj-vermil)', fill: 'var(--sj-ink-800)', title: '谭嗣同 · 六君子', sub: '1898.9.28', tfill: 'var(--sj-vermil)', tag: '失败代价', body: '政变后六君子遇害，改良路线受挫，革命思潮上升。' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, stroke: 'var(--sj-line)', fill: 'url(#sj-base)', title: '士绅 · 编户底盘', sub: '科举—土地未动', tfill: 'var(--sj-paper-100)', tag: '基座未改', body: '变法未触及土地与基层汲取；人口压力与财政危机仍在——基座矛盾留给 SJ-15。' },
    ],
    edges: [
      { id: 'e1', d: 'M360,158 L250,250', stroke: 'var(--sj-ochre)', w: 1.8, dash: '6 5', marker: 'a-ochre', label: '103 日窗口', lx: 280, ly: 210, nodes: ['guangxu', 'kangliang'] },
      { id: 'e2', d: 'M306,286 L462,286', stroke: 'var(--sj-vermil)', w: 3.2, marker: 'a-vermil', label: '触动科举', lx: 384, ly: 278, nodes: ['kangliang', 'cixi'] },
      { id: 'e3', d: 'M220,310 L220,372', stroke: 'var(--sj-celadon)', w: 2.4, marker: 'a-celadon', nodes: ['kangliang', 'reform'] },
      { id: 'e4', d: 'M220,422 L410,486', stroke: 'var(--sj-ochre)', w: 2.2, marker: 'a-ochre', nodes: ['reform', 'base'] },
      { id: 'e5', d: 'M640,498 C724,452 716,340 588,320', stroke: 'var(--sj-vermil)', w: 3.6, marker: 'a-vermil', label: '★ 政变反扑', lx: 700, ly: 400, nodes: ['cixi', 'kangliang'] },
      { id: 'e6', d: 'M133,308 C200,280 280,260 360,158', stroke: 'var(--sj-vermil)', w: 2.4, marker: 'a-vermil', label: '甲午', lx: 180, ly: 240, nodes: ['jiawu', 'guangxu'] },
      { id: 'e7', d: 'M555,310 L555,372', stroke: 'var(--sj-vermil)', w: 2, marker: 'a-vermil', nodes: ['cixi', 'tans'] },
    ],
    nodeEdge: {
      guangxu: ['e1', 'e6'], kangliang: ['e1', 'e2', 'e3', 'e5'], cixi: ['e2', 'e5', 'e7'],
      reform: ['e3', 'e4'], jiawu: ['e6'], tans: ['e7'], base: ['e4'],
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
  const nodeData = Object.fromEntries(c.nodes.map((n) => [n.id, { name: n.title, tag: n.tag, body: n.body }]));
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
.sj-edge{transition:opacity .2s ease,filter .2s ease}
.${c.cls}-stage.is-picking .sj-node{opacity:.3}
.${c.cls}-stage.is-picking .sj-node.is-hot{opacity:1;filter:drop-shadow(0 0 6px rgba(184,137,74,.4))}
.${c.cls}-stage.is-picking .sj-edge{opacity:.16}
.${c.cls}-stage.is-picking .sj-edge.is-hot{opacity:1;filter:drop-shadow(0 0 3px rgba(168,59,44,.4))}
.${c.cls}-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:14px;align-items:start;margin-top:14px}
.${c.cls}-aside{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:linear-gradient(180deg,var(--sj-ink-800),var(--sj-ink-900));padding:14px 16px;position:sticky;top:12px;min-height:150px}
.${c.cls}-aside .k{font-family:var(--sj-mono);font-size:10px;letter-spacing:.16em;color:var(--sj-ochre);margin-bottom:6px}
.${c.cls}-aside h3{font-size:16px;letter-spacing:.08em;margin-bottom:8px}
.${c.cls}-aside p{font-size:13.5px;color:var(--sj-paper-300);line-height:1.7}
.${c.cls}-aside-empty{font-size:13px;color:var(--sj-paper-300);opacity:.85}
.${c.cls}-note{font-size:13px;color:var(--sj-paper-300);line-height:1.65;max-width:74ch}
@media(max-width:900px){.${c.cls}-layout{grid-template-columns:1fr}.${c.cls}-aside{position:static}}
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
@media(max-width:768px){.${c.cls}-hist,.${c.cls}-mirror,.${c.cls}-verdict,.${c.cls}-xref{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.sj-node,.sj-edge{transition:none}}
.sj-rail-mini{font-size:12.5px;color:var(--sj-paper-300);line-height:1.6;margin-top:6px}
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
      ${c.extraChip || ''}
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
<section class="sj-ledger-field" id="f2" aria-labelledby="h-f2">
  <div class="sj-ledger-fh"><span class="fnum">02</span><h2 id="h-f2">结构切片</h2><span class="en">SLICE · 步骤①</span></div>
  <p class="${c.cls}-prose">${c.sliceProse}</p>
  <div class="${c.cls}-stage" id="stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">结构切片 · ${esc(c.title)}</title>
  <desc id="sj-desc">${esc(c.sliceProse.replace(/<[^>]+>/g, ''))}</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%"><stop offset="0%" stop-color="var(--sj-ink-800)"/><stop offset="100%" stop-color="var(--sj-ink-900)"/></radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/></pattern>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/></linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
    <marker id="a-paper" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-paper-100)"/></marker>
  </defs>
  <rect width="820" height="600" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="420" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,serif">结构切片 · ${esc(c.title)}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-${c.num} · ${esc(c.dynasty)} · ${esc(c.type)}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批 · 五力色义 · 点击节点交互</text>
  <g fill="none" stroke-linecap="round">${svgEdges}</g>
  ${svgNodes}
  <text x="764" y="588" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,monospace">viewBox 820×600 · SJ-${c.num}</text>
</svg></div>
  <div class="${c.cls}-layout">
    <div class="${c.cls}-note" style="margin-top:0">点选节点展开机制链；色义见 premium 切片图例（patch 后更新）。</div>
    <aside class="${c.cls}-aside" id="aside" aria-live="polite">
      <div id="aside-empty" class="${c.cls}-aside-empty">点选切片中任一节点，展开其在拐点中的角色。</div>
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
  const stage=document.getElementById('stage');
  if(!stage) return;
  const nodes=Array.from(stage.querySelectorAll('.sj-node'));
  const edges=Array.from(stage.querySelectorAll('.sj-edge'));
  const asideEmpty=document.getElementById('aside-empty');
  const asideBody=document.getElementById('aside-body');
  const NODE_DATA=${JSON.stringify(nodeData, null, 2)};
  const NODE_EDGE=${JSON.stringify(c.nodeEdge, null, 2)};
  function clearVisual(){stage.classList.remove('is-picking');nodes.forEach(n=>n.classList.remove('is-hot'));edges.forEach(e=>e.classList.remove('is-hot'));}
  function showAside(id){const d=NODE_DATA[id];if(!d)return;asideEmpty.hidden=true;asideBody.hidden=false;document.getElementById('aside-tag').textContent=d.tag;document.getElementById('aside-name').textContent=d.name;document.getElementById('aside-text').textContent=d.body;}
  function pick(id){if(!NODE_DATA[id])return;clearVisual();stage.classList.add('is-picking');nodes.forEach(n=>n.classList.toggle('is-hot',n.dataset.id===id));const hot=NODE_EDGE[id]||[];edges.forEach(e=>e.classList.toggle('is-hot',hot.indexOf(e.dataset.edge)>=0));showAside(id);}
  nodes.forEach(n=>{const act=()=>pick(n.dataset.id);n.addEventListener('click',act);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  edges.forEach(e=>{if(!e.dataset.edge||!NODE_DATA[e.dataset.edge])return;const act=()=>pick(e.dataset.edge);e.style.cursor='pointer';e.setAttribute('tabindex','0');e.setAttribute('role','button');e.addEventListener('click',act);e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();act();}});});
})();
</script>
</body>
</html>`;
}

function renderSpec(c) {
  return `# SJ-${c.num} · ${c.title} —— 建设规格

> ${c.badge}。朝代：${c.dynasty} · 类型：${c.type}

## 模块头

- 系年：见 HTML §01
- 交叉引用：见 HTML §◆；SJ-03 五力 / SJ-04 相位盘

## 七字段摘要

① ${c.hook.replace(/<[^>]+>/g, '').slice(0, 100)}…

② ${c.sliceProse.replace(/<[^>]+>/g, '').slice(0, 80)}…

③ ${c.phase}

④ 五力：见 HTML 台账表

⑤ 史家交锋：李敖/钱穆/金观涛/黄仁宇/汉学

⑥ 成败三列：已兑现/已失败/未决

⑦ 古今映射：相似机制 + 关键差异双栏

## 结构切片

- 节点数：${c.nodes.length} · NODE_DATA 交互 · premium 卷轴 SVG（patch-sj-slices）
- Tier：T2
`;
}

for (const c of CASES) {
  fs.writeFileSync(path.join(OUT, `SJ-${c.num}.html`), renderHtml(c), 'utf8');
  fs.writeFileSync(path.join(DOCS, `SJ-${c.num}-${c.title}-建设规格.md`), renderSpec(c), 'utf8');
  console.log('Wrote SJ-' + c.num);
}
console.log('Done:', CASES.length, 'Round 3 元/清 volumes');
