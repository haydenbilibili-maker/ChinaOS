#!/usr/bin/env python3
"""Generate app/src/lib/db/figureTaiwanPolitical2026.js — 台湾政治人物 seed."""
import json
import re
from pathlib import Path
from collections import Counter

OUT = Path(__file__).resolve().parents[1] / "app/src/lib/db/figureTaiwanPolitical2026.js"

# 大陆中国政要 / 异见人士主身份 — 不纳入台湾队列
EXCLUDE_OTHER_QUEUES = {
    "习近平", "李克强", "王岐山", "胡锦涛", "温家宝", "江泽民",
    "梁振英",  # 全国政协副主席 · 主身份在中国政要队列
}

HEADER = """// ============================================================================
// 港澳台政要库 · 台港澳公开政治人物 · 2026-06
// ----------------------------------------------------------------------------
// 口径：台湾民选/任命官员、港澳特区行政长官及主要官员；与 PRC 中国政要队列隔离。
// 生成：scripts/genTaiwanPoliticalSeed.py
// ============================================================================

import { AS_OF } from './figureCommon.js';

export const TAIWAN_POLITICAL_META = {
  id: 'taiwan-political-2026-06',
  asOf: AS_OF,
  label: '港澳台政要库 · 台港澳政治人物 · 2026-06',
  sources: [
    '台湾地区领导人办公室/行政院/立法院公开名录',
    '香港特区政府礼宾处/澳门特区政府官网',
    '台湾当局各部会公开人事公告',
    '新华社/人民日报涉台港澳公开报道',
    'BBC/路透社/美联社公开报道',
    '维基百科公开条目（交叉核验）',
  ],
  scope: '台湾 {tw} 人；香港 {hk} 人；澳门 {mo} 人（含总统副总统 {president} · 行政院长 {premier} · 立法院 {legislature} · 政党 {party} · 地方 {local} · 外交国防 {diplomacy} · 特区首长 {executive} · 其他 {other}）',
  notes: '研究用途档案口径，冷峻中立记录公开履历与制度语境；region 标注 tw|hk|mo；不含 PRC 体制内官员；信息截至 {as_of}。',
};

function regionOf(id) {
  if (id.startsWith('hk-')) return 'hk';
  if (id.startsWith('mo-')) return 'mo';
  return 'tw';
}

/** @param {string} id @param {string} name @param {string} nameEn @param {string} category */
function T(id, name, nameEn, category, party, role, term, status, keyEvents, tags, bio, notes = '') {
  return {
    id, name, nameEn: nameEn || '', region: regionOf(id), category,
    party: party || '', role: role || '', term: term || '', status: status || '',
    keyEvents: keyEvents || [], tags: tags || '', asOf: AS_OF, bio, notes: notes || '',
    taiwanPoliticalPrimary: true,
  };
}

"""

# (id, name, nameEn, cat, party, role, term, status, events, tags, bio, notes?)
# events: list of (from, to, desc)
ENTRIES = [
    # ── 总统/副总统 ──
    ("tw-lai-ching-te", "赖清德", "Lai Ching-te", "president", "DPP", "总统", "2024—", "在任",
     [("2017", "2019", "行政院长"), ("2023", "", "当选总统"), ("2024", "", "就职总统兼民进党主席")],
     "民进党,2024大选,两岸",
     "医师出身，历任国会议员、台南市长、行政院长、副总统；2024年以民进党候选人当选总统，延续蔡英文路线，强调台湾主体性与民主防卫。", ""),
    ("tw-hsiao-bi-khim", "萧美琴", "Hsiao Bi-khim", "president", "DPP", "副总统", "2024—", "在任",
     [("2020", "2024", "驻美代表"), ("2024", "", "当选副总统")],
     "驻美代表,外交,2024大选",
     "外交系统出身，长期驻美代表；2024年与赖清德搭档当选，被视为强化对美沟通与国际空间争取的关键人事安排。", ""),
    ("tw-tsai-ing-wen", "蔡英文", "Tsai Ing-wen", "president", "DPP", "前总统", "2016—2024", "卸任",
     [("2016", "2020", "第一任总统"), ("2020", "2024", "连任"), ("2024", "", "卸任")],
     "民进党,两岸,转型正义", "A", "公开报道",
     "法学背景，2008年起领导民进党；两度当选总统，推动国防自主、产业政策与两岸「维持现状」表述，卸任后政治影响力仍存。", ""),
    ("tw-chen-shui-bian", "陈水扁", "Chen Shui-bian", "president", "DPP", "前总统", "2000—2008", "卸任",
     [("2000", "", "当选首位民进党总统"), ("2006", "", "罢免案未通过"), ("2008", "", "卸任"), ("2009", "", "因贪腐案入狱")],
     "民进党,第一次政党轮替,贪腐案", "A", "公开报道",
     "律师出身，2000年实现台湾首次政党轮替；任内推动「一边一国」论述与公投立法；卸任后因龙潭购地等案定罪入狱，后获特赦/medical parole争议持续。", ""),
    ("tw-ma-ying-jeou", "马英九", "Ma Ying-jeou", "president", "KMT", "前总统", "2008—2016", "卸任",
     [("2008", "", "当选总统"), ("2010", "", "签署ECFA"), ("2014", "", "太阳花学运"), ("2015", "", "马习会新加坡")],
     "国民党,ECFA,马习会,两岸经贸", "A", "公开报道",
     "哈佛法学背景，历任法务部长、台北市长；总统任内推进两岸经贸制度化与马习会，2014年太阳花学运后两岸互动趋缓。", ""),
    ("tw-lee-teng-hui", "李登辉", "Lee Teng-hui", "president", "KMT→本土派", "前总统", "1988—2000", "已故",
     [("1988", "", "继任总统"), ("1996", "", "首次直选总统"), ("2000", "", "卸任"), ("2020", "", "逝世")],
     "国民党,民主化,两国论,本土化", "A", "公开报道",
     "康乃尔经济学博士，推动台湾民主化与总统直选；1999年提出「两国论」引发两岸震荡，被视为台湾本土化与民主转型关键人物。", ""),
    ("tw-chiang-ching-kuo", "蒋经国", "Chiang Ching-kuo", "president", "KMT", "前总统", "1978—1988", "已故",
     [("1978", "", "就任总统"), ("1987", "", "宣布解严"), ("1988", "", "逝世")],
     "国民党,解严,十大建设,本土化", "A", "公开报道",
     "蒋中正之子，主导十大建设与戒严末期改革；1987年宣布解严、允许探亲，为台湾政治转型奠基，亦开启后期民主化进程。", ""),
    ("tw-lu-hsiu-lien", "吕秀莲", "Annette Lu", "president", "DPP", "前副总统", "2000—2008", "卸任",
     [("2000", "", "当选副总统"), ("2004", "319", "枪击案同日当选"), ("2008", "", "卸任")],
     "民进党,319枪击案,女权", "B", "公开报道",
     "法学博士，女权运动者；与陈水扁搭档两届副总统，319枪击案为任内重大政治事件节点。", ""),
    ("tw-chen-chien-jen", "陈建仁", "Chen Chien-jen", "president", "DPP", "前副总统", "2023—2024", "卸任",
     [("2023", "", "就任副总统"), ("2024", "", "卸任")],
     "民进党,梵蒂冈枢机,疫情", "B", "公开报道",
     "病毒学家、前中研院副院长；COVID-19期间任行政院长，后短暂担任副总统。", ""),
    ("tw-wu-den-yih", "吴敦义", "Wu Den-yih", "president", "KMT", "前副总统", "2012—2016", "卸任",
     [("2009", "2012", "行政院长"), ("2012", "", "当选副总统"), ("2017", "2020", "国民党主席"), ("2016", "", "卸任副总统")],
     "国民党,南台湾,党主席", "B", "公开报道",
     "历任南投县长、台北市长、行政院长；马英九第二任期副总统，后担任国民党主席。", ""),

    # ── 行政院长 ──
    ("tw-cho-jung-tai", "卓荣泰", "Cho Jung-tai", "premier", "DPP", "行政院长", "2024—", "在任",
     [("2024", "", "赖清德任命行政院长"), ("2024", "", "组阁完成")],
     "民进党,组阁,阁员人事", "A", "公开报道",
     "律师出身，历任民进党秘书长、台北市长、立法委员；2024年组阁，强调延续产业政策与行政稳定。", ""),
    ("tw-su-tseng-chang", "苏贞昌", "Su Tseng-chang", "premier", "DPP", "前行政院长", "2019—2023", "卸任",
     [("2019", "", "接任行政院长"), ("2021", "", "防疫高峰期"), ("2023", "", "卸任")],
     "民进党,防疫,总召", "A", "公开报道",
     "资深政治人物，历任台北县长、总统府秘书长、民进党主席；2019—2023年行政院长任内主导COVID-19防疫与疫苗采购争议。", ""),
    ("tw-lin-chuan", "林全", "Lin Chuan", "premier", "无党籍", "前行政院长", "2016—2017", "卸任",
     [("2016", "", "蔡英文任命无党籍阁揆"), ("2017", "", "因劳工法案争议请辞")],
     "无党籍,阁揆,劳工法案", "B", "公开报道",
     "财政学者，蔡英文首任内阁行政院长，以技术官僚形象组阁，因劳基法修法争议下台。", ""),
    ("tw-chang-shan-cheng", "张善政", "Chang San-cheng", "premier", "KMT", "前行政院长", "2023—2024", "卸任",
     [("2023", "", "陈建仁内阁改组接任"), ("2024", "", "内阁随政权交接卸任")],
     "国民党,科技官僚,鸿海", "B", "公开报道",
     "工程背景，历任科技部长、行政院副院长、鸿海集团高管；短暂担任行政院长。", ""),
    ("tw-liu-chao-shiuan", "刘兆玄", "Liu Chao-hsuan", "premier", "KMT", "前行政院长", "2008—2009", "卸任",
     [("2008", "", "马英九上任后首任阁揆"), ("2009", "", "因八八水灾处置争议请辞")],
     "国民党,八八水灾", "B", "公开报道",
     "经济学家，马英九首任行政院长，莫拉克风灾处置争议下台。", ""),
    ("tw-yu-shyi-kun", "游锡堃", "Yu Shyi-kun", "legislature", "DPP", "前立法院长", "2020—2024", "卸任",
     [("2002", "2005", "行政院长"), ("2020", "", "民进党执政时期立法院长"), ("2024", "", "卸任")],
     "民进党,立法院长,行政院长", "B", "公开报道",
     "陈水扁时期行政院长，后任立法院长；蔡英文第二任期立法院长，任内处理多项争议法案与议事冲突。", ""),
    ("tw-tang-fei", "唐飞", "Tang Fei", "premier", "KMT", "前行政院长", "2000—2000", "卸任",
     [("2000", "", "陈水扁任命跨党阁揆"), ("2000", "", "四个月即请辞")],
     "国民党,跨党内阁", "B", "公开报道",
     "退役空军上将，陈水扁当选后任命的跨党行政院长，任期极短。", ""),

    # ── 立法院 ──
    ("tw-han-kuo-yu", "韩国瑜", "Han Kuo-yu", "legislature", "KMT", "立法院长", "2024—", "在任",
     [("2018", "2020", "高雄市长"), ("2020", "", "参选总统失利"), ("2024", "", "当选立法院长")],
     "国民党,2024立院,地方包围中央", "A", "公开报道",
     "2018年国民党高雄市长胜选后声势高涨，2020年参选总统失利；2024年国民党立委席次领先背景下当选立法院长。", ""),
    ("tw-wang-jin-pyng", "王金平", "Wang Jin-pyng", "legislature", "KMT", "前立法院长", "1999—2016", "卸任",
     [("1999", "", "当选立法院长"), ("2016", "", "卸任"), ("2020", "", "未连任立委")],
     "国民党,立院协商,派系", "A", "公开报道",
     "国民党资深立委，创纪录长期担任立法院长，以跨党协商著称，被称为「王院长」；2020年结束立委生涯。", ""),
    ("tw-ke-chien-ming", "柯建铭", "Ker Chien-ming", "legislature", "DPP", "党团总召", "长期", "在任",
     [("1992", "", "首次当选立委"), ("2016", "", "出任党团总召")],
     "民进党,总召,议事策略", "A", "公开报道",
     "民进党最长任立委之一，长期担任党团总召，主导议事策略与法案攻防。", ""),
    ("tw-wang-ding-yu", "王定宇", "Wang Ting-yu", "legislature", "DPP", "立法委员", "2016—", "在任",
     [("2016", "", "当选立委"), ("2024", "", "连任")],
     "民进党,台南,外交国防委员会", "B", "公开报道",
     "台南选区立委，常于外交国防委员会发声，立场鲜明。", ""),
    ("tw-fu-kun-chi", "傅崐萁", "Fu Kun-chi", "legislature", "KMT", "党团总召", "2024—", "在任",
     [("2024", "", "国民党席次领先出任总召"), ("2024", "", "推动国会改革法案")],
     "国民党,国会改革,花莲", "A", "公开报道",
     "花莲选区，2024年国民党立委选举后出任党团总召，主导国会改革争议法案。", ""),
    ("tw-chiang-chi-chen", "江启臣", "Johnny Chiang", "legislature", "KMT", "立法委员", "2016—", "在任",
     [("2020", "2021", "国民党主席"), ("2016", "", "当选立委")],
     "国民党,改革派,台中", "B", "公开报道",
     "台中立委，曾任国民党主席，被视为党内改革派代表。", ""),
    ("tw-huang-kuo-chang", "黄国昌", "Huang Kuo-chang", "legislature", "TPP", "立法委员", "2024—", "在任",
     [("2015", "2019", "时代力量立委"), ("2023", "", "加入民众党"), ("2024", "", "以民众党名义连任")],
     "民众党,时代力量,国会改革", "A", "公开报道",
     "法学教授出身，曾任时代力量立委；2024年以台湾民众党身份当选，为第三势力国会关键人物。", ""),
    ("tw-chen-ou-po", "陈欧珀", "Chen Ou-po", "legislature", "DPP", "立法委员", "2016—", "在任",
     [("2016", "", "当选立委"), ("2024", "", "连任")],
     "民进党,宜兰", "B", "公开报道",
     "宜兰选区民进党立委，地方派系与中央关系调和角色。", ""),
    ("tw-lin-yu-fang", "林郁方", "Lin Yu-fang", "legislature", "KMT", "立法委员", "长期", "在任",
     [("1995", "", "首次当选立委"), ("2024", "", "连任")],
     "国民党,国防,新北", "B", "公开报道",
     "新北选区资深蓝营立委，长期关注国防议题。", ""),
    ("tw-wang-shi-chien", "王世坚", "Wang Shi-chian", "legislature", "DPP", "立法委员", "2024—", "在任",
     [("2024", "", "重返立法院")],
     "民进党,台北,媒体性格", "B", "公开报道",
     "台北市议员多年后重返立法院，以鲜明发言风格著称。", ""),

    # ── 政党领袖 ──
    ("tw-chu-li-lun", "朱立伦", "Eric Chu", "party", "KMT", "国民党主席", "2021—", "在任",
     [("2015", "2016", "第一任党主席"), ("2021", "", "再次当选主席"), ("2024", "", "主导立委选战")],
     "国民党,2024大选,党主席", "A", "公开报道",
     "历任桃园县长、行政院副院长、新北市长；2021年回任国民党主席，2024年大选与立委选举中担任党务主导者。", ""),
    ("tw-hou-yu-ih", "侯友宜", "Hou Yu-ih", "party", "KMT", "新北市长", "2018—", "在任",
     [("2018", "", "当选新北市长"), ("2022", "", "连任"), ("2023", "", "参选总统失利")],
     "国民党,2024大选,警政", "A", "公开报道",
     "警政出身，长期担任新北市长；2024年以国民党候选人身份参选总统未胜选，仍掌新北市。", ""),
    ("tw-ko-wen-je", "柯文哲", "Ko Wen-je", "party", "TPP", "台湾民众党主席", "2019—", "在任",
     [("2014", "2022", "台北市长"), ("2019", "", "创立民众党"), ("2024", "", "参选总统")],
     "民众党,第三势力,台北", "A", "公开报道",
     "医师出身，无党籍当选台北市长两届；2019年创立台湾民众党，2024年参选总统，主张「两岸一家亲」表述引发争议。", ""),
    ("tw-james-soong", "宋楚瑜", "James Soong", "party", "PFP", "亲民党主席", "2000—", "在任",
     [("2000", "", "参选总统"), ("2004", "", "与陈水扁搭档副总统参选"), ("2016", "", "再度参选总统")],
     "亲民党,泛蓝,选举", "A", "公开报道",
     "曾任台湾省长，2000年分裂国民党选票后创立亲民党；长期活跃于总统大选，为泛蓝板块重要变量。", ""),
    ("tw-lian-chan", "连战", "Lien Chan", "party", "KMT", "前国民党主席", "2000—2005", "卸任",
     [("2000", "", "参选总统失利"), ("2005", "", "和平之旅访问大陆")],
     "国民党,连战,两岸经贸", "A", "公开报道",
     "曾任行政院长、副总统、国民党主席；2005年率团访问大陆开启两党交流，后淡出一线政治。", ""),
    ("tw-hung-hsiu-chu", "洪秀柱", "Hung Hsiu-chu", "party", "KMT", "前国民党主席", "2016", "卸任",
     [("2016", "", "短暂担任党主席"), ("2016", "", "换柱争议")],
     "国民党,深蓝,换柱", "B", "公开报道",
     "深蓝代表人物，2016年因民调因素被撤换总统候选人资格（换柱事件），短暂担任党主席。", ""),
    ("tw-cheng-li-wen", "郑丽文", "Cheng Li-wen", "party", "KMT", "国民党副主席", "2021—", "在任",
     [("2021", "", "出任副主席")],
     "国民党,党务", "B", "公开报道",
     "国民党党务系统出身，担任副主席，常代表党内论述两岸关系。", ""),
    ("tw-zhao-shao-kang", "赵少康", "Chao Shao-kang", "party", "KMT", "中广董事长", "2021—", "在任",
     [("1994", "", "参选台北市长"), ("2021", "", "重返国民党"), ("2024", "", "参选副总统")],
     "国民党,媒体,深蓝", "B", "公开报道",
     "媒体人与政治评论员，2021年重返国民党；2024年与侯友宜搭档参选副总统。", ""),
    ("tw-chen-chi-mai", "陈其迈", "Chen Chi-mai", "party", "DPP", "高雄市长", "2020—", "在任",
     [("2020", "", "当选高雄市长"), ("2022", "", "连任")],
     "民进党,南台湾,高雄", "A", "公开报道",
     "民进党南部重镇首长，接替韩国瑜后稳定高雄政局，被视为赖清德系地方支柱。", ""),
    ("tw-huang-min-hui", "黄敏惠", "Huang Min-hui", "party", "KMT", "嘉义市长", "2018—", "在任",
     [("2018", "", "当选嘉义市长"), ("2022", "", "连任")],
     "国民党,地方,女性首长", "B", "公开报道",
     "国民党籍女性地方首长，嘉义市长期执政代表。", ""),

    # ── 地方首长 ──
    ("tw-chiang-wan-an", "蒋万安", "Chiang Wan-an", "local", "KMT", "台北市长", "2022—", "在任",
     [("2022", "", "当选台北市长"), ("2024", "", "任内处理都更与治安议题")],
     "国民党,台北,蒋家", "A", "公开报道",
     "国民党籍，2022年当选台北市长；身世与蒋家关联为媒体关注焦点，任内聚焦都市更新与市政效率。", ""),
    ("tw-lu-shiow-yen", "卢秀燕", "Lu Shiow-yen", "local", "KMT", "台中市长", "2018—", "在任",
     [("2018", "", "击败林佳龙当选"), ("2022", "", "连任")],
     "国民党,台中,中部", "A", "公开报道",
     "国民党台中市长，两度击败民进党对手，为蓝营中部执政标杆。", ""),
    ("tw-huang-wei-che", "黄伟哲", "Huang Wei-che", "local", "DPP", "台南市长", "2018—", "在任",
     [("2018", "", "当选台南市长"), ("2022", "", "连任")],
     "民进党,台南,南台湾", "B", "公开报道",
     "民进党台南市长，延续绿营南部票仓优势。", ""),
    ("tw-lin-chia-lung", "林佳龙", "Lin Chia-lung", "diplomacy", "DPP", "外交部长", "2024—", "在任",
     [("2014", "2018", "台中市长"), ("2018", "", "寻求连任失利"), ("2023", "", "交通部长"), ("2024", "", "卓荣泰内阁外交部长")],
     "民进党,台中,外交", "B", "公开报道",
     "曾任台中市长、交通部长；2024年起担任外交部长，延续强化对美欧与印太伙伴外交路线。", ""),
    ("tw-cheng-wen-tsan", "郑文灿", "Cheng Wen-tsan", "local", "DPP", "前桃园市长", "2014—2022", "卸任",
     [("2014", "", "当选桃园市长"), ("2022", "", "连任"), ("2024", "", "因贪腐案辞职")],
     "民进党,桃园,贪腐案", "A", "公开报道",
     "民进党桃园长期执政市长，2024年因市长任内案件被调查辞职，折射地方派系与中央关系张力。", ""),
    ("tw-lin-yu-chang", "林右昌", "Lin Yu-chang", "local", "DPP", "基隆市长", "2014—2022", "卸任",
     [("2014", "", "当选基隆市长"), ("2023", "", "出任民进党秘书长")],
     "民进党,基隆,党务", "B", "公开报道",
     "基隆市长后转任民进党秘书长，负责党务与选举操盘。", ""),
    ("tw-ann-kao", "高虹安", "Ann Kao", "local", "TPP", "新竹市长", "2022—", "在任",
     [("2022", "", "当选新竹市长"), ("2024", "", "涉贪案停职争议")],
     "民众党,新竹,科技城市", "B", "公开报道",
     "民众党籍新竹市长，任内涉助理费争议与停职司法攻防，为第三势力地方执政案例。", ""),
    ("tw-lin-chi-ling", "林姿妙", "Lin Tze-chang", "local", "KMT", "宜兰县长", "2018—", "在任",
     [("2018", "", "当选宜兰县长"), ("2022", "", "连任")],
     "国民党,宜兰,地方", "B", "公开报道",
     "国民党宜兰县长，东部县市蓝营执政代表。", ""),
    ("tw-wang-hui-mei", "王惠美", "Wang Huei-mei", "local", "KMT", "彰化县长", "2014—", "在任",
     [("2014", "", "当选彰化县长"), ("2022", "", "连任")],
     "国民党,彰化,中部", "B", "公开报道",
     "国民党彰化县长，中部农业县长期执政者。", ""),
    ("tw-chung-tung-chin", "锺东锦", "Chung Tung-chin", "local", "无党籍", "苗栗县长", "2022—", "在任",
     [("2022", "", "当选苗栗县长")],
     "无党籍,苗栗,派系", "B", "公开报道",
     "无党籍当选苗栗县长，地方派系政治典型。", ""),
    ("tw-hsu-chen-wo", "徐榛蔚", "Hsu Chen-wo", "local", "KMT", "花莲县长", "2018—", "在任",
     [("2018", "", "当选花莲县长"), ("2022", "", "连任")],
     "国民党,花莲,傅崐萁", "B", "公开报道",
     "国民党花莲县长，与傅崐萁地方政治网络关联。", ""),
    ("tw-chang-li-yun", "张丽云", "Chang Li-yun", "local", "KMT", "云林县长", "2018—", "在任",
     [("2018", "", "当选云林县长"), ("2022", "", "连任")],
     "国民党,云林,农业", "B", "公开报道",
     "国民党云林县长，农业县治理与地方派系平衡。", ""),

    # ── 外交国防 ──
    ("tw-wellington-woo", "吴钊燮", "Joseph Wu", "diplomacy", "DPP", "前外交部长", "2018—2024", "卸任",
     [("2018", "", "就任外交部长"), ("2024", "", "内阁改组卸任")],
     "外交,国际空间,蔡英文时期", "A", "公开报道",
     "蔡英文时期外交部长，任内推动台美关系升级与国际参与策略，遭北京制裁列入。", ""),
    ("tw-ku-cheng-kung", "顾立雄", "Gu Lih-hsiung", "diplomacy", "DPP", "国防部长", "2024—", "在任",
     [("2024", "", "就任国防部长"), ("2024", "", "推动不对称作战与国防预算")],
     "国防,不对称作战,赖清德", "A", "公开报道",
     "律师与国安背景，2024年出任国防部长；强调备战与吓阻、不对称作战概念。", ""),
    ("tw-chiu-kuo-cheng", "邱国正", "Chiu Kuo-cheng", "diplomacy", "无党籍", "前国防部长", "2021—2024", "卸任",
     [("2021", "", "就任国防部长"), ("2024", "", "卸任")],
     "国防,蔡英文时期,退役上将", "B", "公开报道",
     "退役陆军上将，蔡英文末期国防部长，任内应对台海军事压力上升。", ""),
    ("tw-lee-hsi-ming", "李喜明", "Lee Hsi-ming", "diplomacy", "无党籍", "前参谋总长", "2017—2019", "卸任",
     [("2017", "", "就任参谋总长"), ("2019", "", "退役")],
     "国防,台海防卫,整体防卫构想", "A", "公开报道",
     "退役海军上将，提出「整体防卫构想」；退役后持续参与国防政策讨论。", ""),
    ("tw-lee-ta-wei", "李大维", "Lee Ta-wei", "diplomacy", "KMT", "前国安局长", "2018—2023", "卸任",
     [("2018", "", "就任国安局长"), ("2023", "", "卸任")],
     "国安,蔡英文时期", "B", "公开报道",
     "蔡英文时期国安团队核心，负责两岸与国安情报统筹。", ""),
    ("tw-tsai-ming-yen", "蔡明彦", "Tsai Ming-yen", "diplomacy", "无党籍", "国安局长", "2023—", "在任",
     [("2023", "", "接任国安局长")],
     "国安,赖清德时期", "B", "公开报道",
     "2023年起担任国安局长，承接台海情报与风险评估职能。", ""),
    ("tw-feng-shih-kuan", "冯世宽", "Feng Shih-kuan", "diplomacy", "KMT", "前国防部长", "2016—2018", "卸任",
     [("2016", "", "蔡英文首任国防部长"), ("2018", "", "卸任")],
     "国防,退役上将", "B", "公开报道",
     "退役空军上将，蔡英文第一任期内阁国防部长。", ""),
    ("tw-yen-teh-fa", "严德发", "Yen Teh-fa", "diplomacy", "KMT", "前国防部长", "2018—2021", "卸任",
     [("2018", "", "接任国防部长"), ("2021", "", "转任退辅会主任委员")],
     "国防,退役上将", "B", "公开报道",
     "退役陆军上将，中期国防部长，后转任退伍军人事务。", ""),

    # ── 其他 ──
    ("tw-chen-chu", "陈菊", "Chen Chu", "other", "DPP", "监察院长", "2020—", "在任",
     [("2020", "", "就任监察院长"), ("2024", "", "任内调查争议案件")],
     "监察院,转型正义,高雄", "B", "公开报道",
     "曾任高雄市长、总统府秘书长；2020年起担任监察院长，为党内资深女性政治人物。", ""),
    ("tw-hsu-tsung-li", "许宗力", "Hsu Tzong-li", "other", "无党籍", "司法院院长", "2016—", "在任",
     [("2016", "", "就任司法院院长")],
     "司法,宪法解释,大法官", "B", "公开报道",
     "法学教授出身，长期担任司法院院长，主导多项宪法解释与司法改革议程。", ""),
    ("tw-frank-hsieh", "谢长廷", "Frank Hsieh", "other", "DPP", "驻日代表", "2016—2024", "卸任",
     [("2016", "", "出任驻日代表"), ("2024", "", "卸任")],
     "外交,驻日,民进党", "B", "公开报道",
     "曾任行政院长、总统府秘书长；2016—2024年担任驻日本代表，处理台日关系与福岛食品进口争议。", ""),
    ("tw-shih-ming-te", "施明德", "Shih Ming-te", "other", "DPP→无党籍", "前民进党主席", "1994—1996", "已故",
     [("1979", "", "美丽岛事件"), ("2000", "", "退出民进党"), ("2024", "", "逝世")],
     "美丽岛,民主运动,退党", "A", "公开报道",
     "美丽岛事件核心人物，民主运动象征；后退出民进党，2024年逝世。", ""),
    ("tw-hsu-hsin-liang", "许信良", "Hsu Hsin-liang", "other", "DPP", "前民进党主席", "1996—1998", "已故",
     [("1996", "", "担任党主席"), ("2024", "", "逝世")],
     "民进党,早期民主化", "B", "公开报道",
     "民进党早期主席之一，主张较为务实两岸路线，2024年逝世。", ""),
    ("tw-terry-gou", "郭台铭", "Terry Gou", "other", "无党籍", "2024总统参选", "2024", "卸任",
     [("2023", "", "宣布独立参选"), ("2023", "", "宣布退选")],
     "鸿海,2024大选,工商界", "B", "公开报道",
     "鸿海创办人，2024年一度宣布参选总统后退出，影响蓝营选票分配讨论。", ""),
    ("tw-chen-tan-sun", "陈唐山", "Chen Tan-sun", "other", "DPP", "前外交部长", "2004—2006", "已故",
     [("2004", "", "就任外交部长"), ("2024", "", "逝世")],
     "外交,陈水扁时期", "B", "公开报道",
     "陈水扁时期外交部长，任内处理外交攻防与联合国入联公投争议。", ""),
    ("tw-shen-fu-hsiung", "沈富雄", "Shen Fu-hsiung", "other", "DPP→无党籍", "前立法委员", "1992—2012", "卸任",
     [("2012", "", "结束立委生涯")],
     "民进党,政论,退出政坛", "B", "公开报道",
     "资深立委与政论人物，以犀利评论著称，后淡出选举政治。", ""),
    ("tw-roger-lee", "李四川", "Lee Shih-chuan", "other", "KMT", "台北市副市长", "2022—", "在任",
     [("2022", "", "蒋万安团队副市长")],
     "国民党,市政,工程", "B", "公开报道",
     "工程背景，担任台北市副市长，负责重大市政建设。", ""),
    ("tw-lin-wei-chou", "林韦助", "Lin Wei-chou", "other", "DPP", "总统府秘书长", "2024—", "在任",
     [("2024", "", "赖清德任命府秘书长")],
     "总统府,党务,赖清德", "B", "公开报道",
     "赖清德总统府秘书长，负责府院协调与党务沟通。", ""),
    ("tw-pan-men-an", "潘孟安", "Pan Men-an", "other", "DPP", "总统府秘书长", "2023—2024", "卸任",
     [("2023", "", "出任总统府秘书长"), ("2024", "", "内阁改组卸任")],
     "总统府,南台湾", "B", "公开报道",
     "曾任屏东县长，蔡英文末期总统府秘书长。", ""),
    ("tw-chang-chun-hsiung", "张俊雄", "Chang Chun-hsiung", "other", "DPP", "前行政院长", "2007—2008", "已故",
     [("2007", "", "陈水扁末期行政院长"), ("2024", "", "逝世")],
     "民进党,行政院长", "B", "公开报道",
     "陈水扁第二任期末期行政院长，2024年逝世。", ""),
    ("tw-yen-ching-piao", "颜清标", "Yen Ching-piao", "other", "无党籍", "前立法院副院长", "1999—2008", "卸任",
     [("1999", "", "担任立法院副院长")],
     "地方派系,云林,妈祖", "B", "公开报道",
     "云林地方派系代表人物，曾任立法院副院长，象征地方派系在国会的影响力。", ""),
    # ══ 香港 · 特区行政 ══
    ("hk-john-lee", "李家超", "John Lee Ka-chiu", "executive", "—", "行政长官", "2022—", "在任",
     [("2022", "", "当选第六任行政长官"), ("2021", "2022", "任政务司司长")],
     "行政长官,国安", "A", "香港特区政府礼宾处",
     "2022年就任行政长官；前保安局局长，国安法后治港框架下首任特首。", ""),
    ("hk-carrie-lam", "林郑月娥", "Carrie Lam", "executive", "—", "行政长官", "2017—2022", "卸任",
     [("2017", "2022", "任第五任行政长官")],
     "行政长官,修例风波", "A", "公开报道",
     "2017—2022年行政长官；任内经历修例风波与国安法实施。", ""),
    ("hk-cy-leung", "梁振英", "Leung Chun-ying", "executive", "—", "行政长官", "2012—2017", "卸任",
     [("2012", "2017", "任第四任行政长官")],
     "行政长官,占中", "A", "公开报道",
     "2012—2017年行政长官；任内经历占中运动。", ""),
    ("hk-tung", "董建华", "Tung Chee-hwa", "executive", "—", "行政长官", "1997—2005", "卸任",
     [("1997", "2005", "任首任行政长官")],
     "行政长官,回归", "A", "公开报道",
     "1997年香港回归后首任行政长官。", ""),
    ("hk-donald-tsang", "曾荫权", "Donald Tsang", "executive", "—", "行政长官", "2005—2012", "卸任",
     [("2005", "2012", "任行政长官")],
     "行政长官,财金", "A", "公开报道",
     "2005—2012年行政长官；长期财政司司长背景。", ""),
    ("hk-paul-chan", "陈茂波", "Paul Chan Mo-po", "executive", "—", "财政司司长", "2017—", "在任",
     [("2017", "", "任财政司司长")],
     "财金,预算", "A", "香港特区政府",
     "2017年起任财政司司长；香港财政与联系汇率政策核心。", ""),
    ("hk-chris-tang", "邓炳强", "Chris Tang Ping-keung", "executive", "—", "保安局局长", "2020—", "在任",
     [("2020", "", "任保安局局长"), ("2019", "2020", "任警务处处长")],
     "国安,警务", "A", "公开报道",
     "2020年起任保安局局长；前警务处处长。", ""),
    ("hk-eric-chan", "陈国基", "Eric Chan Kwok-ki", "executive", "—", "政务司司长", "2022—", "在任",
     [("2022", "", "任政务司司长")],
     "政务司", "A", "香港特区政府",
     "2022年就任政务司司长；李家超政府二号人物。", ""),
    ("hk-regina-ip", "叶刘淑仪", "Regina Ip Lau Suk-yee", "executive", "新民党", "行政会议召集人", "2022—", "在任",
     [("2022", "", "任行政会议召集人"), ("2008", "", "创立新民党")],
     "行会,新民党", "B", "公开报道",
     "行政会议召集人；新民党主席，亲建制派代表。", ""),
    ("hk-zheng", "郑雁雄", "Zheng Yanxiong", "liaison", "—", "中联办主任", "2023—", "在任",
     [("2023", "", "任香港中联办主任")],
     "中联办,中央驻港", "A", "新华社",
     "2023年就任香港中联办主任。", ""),
    ("hk-andrew-leung", "梁君彦", "Andrew Leung Kwan-yuen", "legislature", "—", "立法会主席", "2016—", "在任",
     [("2016", "", "任立法会主席")],
     "立法会,建制", "B", "立法会官网",
     "2016年起任立法会主席。", ""),
    ("hk-starry-lee", "李慧琼", "Starry Lee Wai-king", "legislature", "民建联", "立法会议员/民建联主席", "2008—", "在任",
     [("2015", "", "任民建联主席")],
     "立法会,民建联", "B", "公开报道",
     "民建联主席；建制派立法会核心。", ""),
    # ══ 澳门 · 特区行政 ══
    ("mo-sam-hou", "岑浩辉", "Sam Hou Fai", "executive", "—", "行政长官", "2024—", "在任",
     [("2024", "", "当选第六任行政长官"), ("1999", "2024", "任终审法院院长")],
     "行政长官,司法", "A", "澳门特区政府",
     "2024年就任行政长官；前终审法院院长，首位土生澳门人特首。", ""),
    ("mo-ho-iat", "贺一诚", "Ho Iat Seng", "executive", "—", "行政长官", "2019—2024", "卸任",
     [("2019", "2024", "任第五任行政长官")],
     "行政长官,博彩", "A", "公开报道",
     "2019—2024年行政长官；任内经历博彩业监管调整。", ""),
    ("mo-chui-sai", "崔世安", "Fernando Chui Sai On", "executive", "—", "行政长官", "2009—2019", "卸任",
     [("2009", "2019", "任第三—四任行政长官")],
     "行政长官", "A", "公开报道",
     "2009—2019年行政长官；澳门长期稳定治理期代表。", ""),
    ("mo-edmund-ho", "欧阳瑜", "Edmund Ho Hau Wah", "executive", "—", "行政法务司司长", "2019—", "在任",
     [("2019", "", "任行政法务司司长")],
     "法务,博彩监管", "B", "澳门特区政府",
     "2019年起任行政法务司司长；博彩与法治政策接口。", ""),
    ("mo-ao-ieong", "欧安", "Ao Ieong U", "executive", "—", "社会文化司司长", "2019—", "在任",
     [("2019", "", "任社会文化司司长")],
     "社会文化,旅游", "B", "澳门特区政府",
     "负责社会文化、旅游与博彩业协调。", ""),
    ("mo-lei-wai", "李伟农", "Lei Wai Nong", "executive", "—", "经济财政司司长", "2019—", "在任",
     [("2019", "", "任经济财政司司长")],
     "财政,博彩税收", "B", "澳门特区政府",
     "澳门财政与博彩税收政策核心官员。", ""),
    ("mo-jose-coutinho", "高天赐", "José Maria Pereira Coutinho", "legislature", "—", "立法会议员", "2005—", "在任",
     [("2005", "", "连任立法会议员多届")],
     "立法会,直选", "B", "立法会官网",
     "澳门直选立法会议员；议会监督角色。", ""),
    ("mo-chan-hoi", "陈海帆", "Chan Hoi Fan", "judiciary", "—", "终审法院院长", "2024—", "在任",
     [("2024", "", "任终审法院院长")],
     "司法,终审法院", "B", "澳门特区政府",
     "2024年就任终审法院院长。", ""),
]

def esc(s):
    if s is None:
        return "''"
    return json.dumps(str(s), ensure_ascii=False)


def fmt_events(events):
    if not events:
        return "[]"
    parts = []
    for fr, to, desc in events:
        parts.append(f"{{ from: {esc(fr)}, to: {esc(to)}, desc: {esc(desc)} }}")
    return "[" + ", ".join(parts) + "]"


CAT_RANK = {
    "president": 0, "executive": 1, "premier": 2, "diplomacy": 3,
    "legislature": 4, "party": 5, "local": 6, "liaison": 7, "judiciary": 8, "other": 9,
}
STATUS_RANK = {"在任": 0, "卸任": 1, "已故": 2}
DUPE_ID_SUFFIXES = ("-premier", "-mayor", "-diplo", "-speaker", "-fm", "-shi-mai")


def normalize_name(n):
    return re.sub(r"\s+", "", (n or "").strip())


def id_score(id_):
    score = len(id_ or "")
    for s in DUPE_ID_SUFFIXES:
        if s in (id_ or ""):
            score += 1000
    return score


def parse_entry(e):
    (id_, name, nameEn, cat, party, role, term, status, events, tags, *rest) = e
    if len(rest) >= 3 and rest[0] in ("A", "B"):
        bio = rest[2]
        notes = rest[3] if len(rest) > 3 else ""
    else:
        bio = rest[0] if rest else ""
        notes = rest[1] if len(rest) > 1 else ""
    return id_, name, nameEn, cat, party, role, term, status, events, tags, bio, notes


def entry_row_score(e):
    id_, _name, _nameEn, cat, _party, _role, _term, status, _events, _tags, bio, _notes = parse_entry(e)
    return (STATUS_RANK.get(status, 9), CAT_RANK.get(cat, 99), id_score(id_), -len(bio or ""))


def merge_events(*event_lists):
    seen = set()
    merged = []
    for events in event_lists:
        for ev in events or []:
            key = (ev[0], ev[1], ev[2])
            if key not in seen:
                seen.add(key)
                merged.append(ev)
    return merged


def merge_tags(*tag_strs):
    parts = []
    seen = set()
    for ts in tag_strs:
        for p in (ts or "").replace("，", ",").split(","):
            p = p.strip()
            if p and p not in seen:
                seen.add(p)
                parts.append(p)
    return ",".join(parts)


def dedupe_by_name(entries):
    groups = {}
    for e in entries:
        groups.setdefault(normalize_name(e[1]), []).append(e)
    deduped = []
    dupe_log = []
    for _n, group in groups.items():
        if len(group) == 1:
            deduped.append(group[0])
            continue
        best = min(group, key=entry_row_score)
        canonical_id = min((e[0] for e in group), key=id_score)
        id_, name, nameEn, cat, party, role, term, status, events, tags, bio, notes = parse_entry(best)
        all_events = merge_events(*[e[8] for e in group])
        all_tags = merge_tags(*[e[9] for e in group])
        dropped_ids = [e[0] for e in group if e[0] != canonical_id]
        dupe_log.append((name, canonical_id, dropped_ids))
        deduped.append((canonical_id, name, nameEn, cat, party, role, term, status, all_events, all_tags, bio, notes))
    return deduped, dupe_log


# Filter valid entries
filtered = []
seen_ids = set()
for e in ENTRIES:
    if len(e) < 12:
        continue
    id_, name = e[0], e[1]
    if id_ in seen_ids or name in EXCLUDE_OTHER_QUEUES:
        continue
    seen_ids.add(id_)
    filtered.append(e)

raw_count = len(filtered)
filtered, dupe_log = dedupe_by_name(filtered)
if dupe_log:
    print("Deduped by normalized name:")
    for name, keep, dropped in dupe_log:
        print(f"  {name}: keep {keep}, drop {dropped}")

counts = Counter(e[3] for e in filtered)
region_counts = Counter(e[0].split('-')[0] for e in filtered)

scope = HEADER.split("scope: '")[1].split("'")[0]
scope = scope.format(
    tw=region_counts.get("tw", 0),
    hk=region_counts.get("hk", 0),
    mo=region_counts.get("mo", 0),
    president=counts.get("president", 0),
    premier=counts.get("premier", 0),
    legislature=counts.get("legislature", 0),
    party=counts.get("party", 0),
    local=counts.get("local", 0),
    diplomacy=counts.get("diplomacy", 0),
    executive=counts.get("executive", 0),
    other=counts.get("other", 0),
)
header = HEADER.replace(HEADER.split("scope: '")[1].split("'")[0], scope)
notes_tpl = header.split("notes: '")[1].split("'")[0]
header = header.replace(notes_tpl, notes_tpl.format(as_of="2026-07-14"))

lines = [header.rstrip()]

lines.append("export const TAIWAN_POLITICAL_2026 = [")
for e in filtered:
    id_, name, nameEn, cat, party, role, term, status, events, tags, bio, notes = parse_entry(e)
    notes_arg = f", {esc(notes)}" if notes else ""
    lines.append(
        f"  T({esc(id_)}, {esc(name)}, {esc(nameEn)}, {esc(cat)}, {esc(party)}, "
        f"{esc(role)}, {esc(term)}, {esc(status)}, "
        f"{fmt_events(events)}, {esc(tags)}, {esc(bio)}{notes_arg}),"
    )
lines.append("];\n")
lines.append("export const TAIWAN_POLITICAL_COUNT = {")
for k in ["president", "premier", "legislature", "party", "local", "diplomacy", "executive", "liaison", "judiciary", "other"]:
    lines.append(f"  {k}: {counts.get(k, 0)},")
lines.append(f"  tw: {region_counts.get('tw', 0)},")
lines.append(f"  hk: {region_counts.get('hk', 0)},")
lines.append(f"  mo: {region_counts.get('mo', 0)},")
lines.append(f"  total: {len(filtered)},")
lines.append("};\n")

OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {len(filtered)} entries to {OUT} (raw {raw_count})")
if dupe_log:
    print(f"Merged {raw_count - len(filtered)} duplicate name(s)")
print(dict(counts))
print(f"total={len(filtered)}")
