#!/usr/bin/env node
/** Generate SJ-11~15 case volumes (七字段台账 + 签名 SVG). */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');
const DOCS = join(ROOT, 'docs/shijian');

const CASES = [
  {
    num: '11',
    badge: 'SJ-11 · 变法改革案例卷 · 先秦',
    title: '商鞅变法',
    subtitle: '军功爵制 vs 旧贵族 · 汲取力重建',
    dynasty: '春秋战国',
    dynastyId: 'chunqiu',
    type: '变法',
    zhupi: '朱批：本案是<b>五力衰变模型</b>在先秦的最早完整样本——以军功爵制重建精英循环、以什伍连坐穿透基层，财政汲取与军事动员合一。内容口径：《史记·商君列传》《商君书》；数字标〔存疑〕处保守处理。',
    hook: '战国中期秦国积弱，商鞅以<b>废井田、开阡陌、重农抑商、军功授爵</b>重建财政汲取力与军事动员力，触动旧贵族特权而遭反噬；变法为秦统一奠基，但严刑峻法亦埋秦二世速亡之种子。',
    year: '系年：秦孝公三年（前359）始行变法 · 秦孝公二十四年（前338）商鞅被车裂 · 出处《史记·商君列传》',
    phase: '上升期早段 · 改革窗口',
    phaseNote: '列国竞争压力下，秦国处于<strong>上升期早段</strong>——汲取力与军事力同步重建的典型窗口。在 SJ-04 相位盘落于「上升期·制度创新」。',
    sliceTitle: '结构切片 · 商鞅变法',
    sliceNote: '权力几何：秦孝公皇权背书 → 商鞅技术官僚纵列 → 什伍连坐下行控制 → 旧贵族/宗室底盘。军功爵制切断血缘特权，朱红回路为旧贵族反扑。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '秦孝公 · 皇权', sub: '变法合法性支柱' },
      { id: 'biangfa', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '商鞅 · 变法', sub: '技术官僚 · 制度重建' },
      { id: 'jiuzu', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '旧贵族 · 宗室', sub: '血缘特权 · 抵制' },
      { id: 'shiwu', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '什伍连坐', sub: '基层穿透 · 控制' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户齐民 · 农战之士', sub: '军功爵制底盘' },
    ],
    forces: [
      ['财政汲取', '「苛政」「与民争利」', '废井田、开阡陌、统一度量衡——重建土地税与征发基础；农战一体使汲取与军事合一'],
      ['精英循环', '「刑过不避大臣」', '军功授爵切断血缘世袭 → 旧贵族特权被掏空，这是变法真正的结构性冲击'],
      ['合法性叙事', '「教民以战」背周礼', '孝公提供合法性；但严刑峻法使「霸道」叙事在义理战场失分'],
      ['边疆军事', '西向扩张', '变法直接服务农战动员；军功爵制使军事力与汲取力耦合——秦统一之引擎'],
      ['生态—人口基座', '—', '关中农业基础 + 人口相对可控；什伍连坐是基层控制的技术前提〔人口数字存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「苛政」道德书写——变法很大程度是旧贵族利益叙事；军功爵制是打破血缘垄断的必要工具。'],
      ['钱穆', '《国史大纲》', '承认商鞅变法对秦富强之功，但对「刻薄少恩」持批评；强调制度创新需义理支撑。'],
      ['金观涛', '超稳定结构', '先秦变法是超稳定结构在列国竞争压力下的「制度升级」尝试——成功因未触动大一统后的新精英结构。'],
      ['黄仁宇', '数目字管理', '什伍连坐、统一度量衡是早期「数目字管理」雏形；但缺乏成熟官僚会计体系，依赖人身控制。'],
      ['西方汉学', 'Legalism studies', '学界共识：商鞅变法将国家能力推到战国峰值；严刑与动员一体化是秦亡隐患。〔具体卷名存疑〕'],
    ],
    verdict: {
      ok: ['秦国军力跃升', '统一六国制度基础', '军功爵制打破血缘垄断'],
      fail: ['商鞅本人被车裂', '严刑峻法积累民怨', '旧贵族反扑种子'],
      open: '〔反事实〕若无严刑过度与二世暴政，秦统一体制能否稳定延续？',
    },
    mirror: {
      same: '国家能力重建 vs 既得利益抵制；自上而下改革对最高权力背书的依赖；基层穿透工具（什伍连坐↔组织化动员）。',
      diff: '现代国家已有数目字管理 + 列宁式组织穿透（GY-02），不必依赖严刑人身控制；但「触动精英特权引发反弹」规律不变（→ SJ-05/09 变法谱系）。',
    },
    xrefs: [
      ['./SJ-05.html', 'SJ-05 · 宋变法', '王安石变法——后世汲取力改革对照。'],
      ['./SJ-12.html', 'SJ-12 · 秦末', '变法遗产与暴政叠加后的崩解终点。'],
      ['./SJ-03.html', 'SJ-03 · 五力', '五力归因框架；本案病灶在汲取+军事耦合。'],
    ],
    prev: ['./SJ-10.html', 'SJ-10'],
    next: ['./SJ-12.html', 'SJ-12'],
  },
  {
    num: '12',
    badge: 'SJ-12 · 王朝崩解案例卷 · 秦',
    title: '秦末崩解',
    subtitle: '大一统速亡 · 汲取过载 · 合法性耗尽',
    dynasty: '秦',
    dynastyId: 'qin',
    type: '崩解',
    zhupi: '朱批：秦是<strong>最短命大一统样本</strong>——统一后未能完成相位转换，汲取力过载、合法性叙事破产、军事力反噬中枢。口径：《史记·秦始皇本纪》《项羽本纪》《高祖本纪》。',
    hook: '秦统一六国后未能从「战争动员体制」转向「治理稳态」，<b>徭役赋税过载</b>、<b>焚书坑儒摧毁合法性叙事</b>、<b>陈胜吴广揭竿</b>引发连锁崩解——大一统帝国在<strong>15 年</strong>内土崩瓦解（前221—前206）。',
    year: '系年：秦二世元年（前209）陈胜起义 · 前206 秦亡 · 出处《史记》本纪',
    phase: '崩解期 · 速亡',
    phaseNote: '统一后本应进入<strong>鼎盛—僵化</strong>转换，但秦直接跳入<strong>崩解期</strong>——战争机器未卸、汲取力过载、合法性叙事力归零。',
    sliceTitle: '结构切片 · 秦末崩解',
    sliceNote: '权力几何：咸阳中枢（虚）→ 郡县官僚（薄）→ 徭役征发（重）→ 六国故地底盘（反）。军事力（章邯军）成最后支柱，但无法同时镇压全域。',
    svgNodes: [
      { id: 'zhongyang', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '咸阳 · 中枢', sub: '合法性已空' },
      { id: 'junxian', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '郡县官僚', sub: '薄层控制 · 执行走样' },
      { id: 'yiming', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '六国遗民 · 义军', sub: '合法性真空 · 反秦' },
      { id: 'yaoyi', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '徭役征发', sub: '阿房/长城/骊山' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户齐民 · 戍卒', sub: '汲取过载底盘' },
    ],
    forces: [
      ['财政汲取', '「暴秦」赋役', '统一后工程（长城、阿房、骊山）+ 戍边使徭役过载——汲取力越阈是崩解主因'],
      ['精英循环', '「坑儒」', '未能建立新精英共识通道；六国旧贵族与新型军功集团均不满'],
      ['合法性叙事', '焚书坑儒 · 二世篡立', '「受命于天」叙事破产；赵高篡诏使绩效合法性归零'],
      ['边疆军事', '南征北戍', '章邯军为最后支柱，但无法同时镇压多线起义——军事力被分散消耗'],
      ['生态—人口基座', '—', '连年征战与工程使基座承载越阈；陈胜九百戍卒是信号而非根因〔人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '「暴秦」叙事含汉初政治合法性需要；但徭役过载有出土文献（睡虎地秦简）支撑，非纯道德书写。'],
      ['钱穆', '《国史大纲》', '强调秦「废封建、行郡县」制度进步，但「以法治国」过刚而缺弹性，未能完成治理转型。'],
      ['金观涛', '超稳定结构', '秦是「制度升级失败」样本——统一了形式，未建立可重启的超稳定结构，故速亡。'],
      ['黄仁宇', '数目字管理', '秦有早期数目字管理（统一度量衡、户籍），但缺乏中层官僚缓冲，汲取直达基层引发反弹。'],
      ['西方汉学', 'Qin studies', '学界对秦亡主因有争论（暴政 vs 结构）；共识是统一后未能完成「战争→治理」相位转换。〔存疑〕'],
    ],
    verdict: {
      ok: ['郡县制遗产延续', '统一度量衡/文字', '中央集权范式确立'],
      fail: ['15 年内帝国崩解', '合法性叙事破产', '徭役过载引发全民起义'],
      open: '〔反事实〕若扶苏继位并轻徭薄赋，秦能否完成相位转换？',
    },
    mirror: {
      same: '汲取过载 vs 基层承受极限；合法性叙事破产引发连锁崩解；「战争机器未卸」的转型失败。',
      diff: '现代国家有转移支付、舆情管理与组织化动员缓冲；但「汲取越阈→系统崩解」规律仍适用（→ SJ-07 崩解矩阵秦行）。',
    },
    xrefs: [
      ['./SJ-11.html', 'SJ-11 · 商鞅', '变法遗产与崩解起点的因果链。'],
      ['./SJ-07.html', 'SJ-07 · 崩解对比', '秦行在跨案矩阵中的位置。'],
      ['./SJ-13.html', 'SJ-13 · 王莽', '下一次「复古改制」型崩解。'],
    ],
    prev: ['./SJ-11.html', 'SJ-11'],
    next: ['./SJ-13.html', 'SJ-13'],
  },
  {
    num: '13',
    badge: 'SJ-13 · 变法改革案例卷 · 西汉',
    title: '王莽改制',
    subtitle: '复古理想 vs 现实结构 · 僵化期试错',
    dynasty: '两汉',
    dynastyId: 'han',
    type: '变法',
    zhupi: '朱批：王莽改制是<strong>僵化期复古型改革</strong>的极端样本——以《周礼》理想重建土地与货币制度，触动所有既得利益，引发绿林赤眉与王朝易代。口径：《汉书·王莽传》。',
    hook: '西汉末年土地兼并、奴婢泛滥、财政枯竭，王莽以「复古改制」名义推行<b>王田私属、五均六筦、币制改革</b>，试图重建合法性叙事与财政汲取力；改革脱离现实结构，引发全面反弹，新朝<strong>15 年</strong>而亡（9—23）。',
    year: '系年：初始元年（9）王莽称帝 · 地皇四年（23）绿林军入长安 · 出处《汉书·王莽传》',
    phase: '僵化期 · 改革失败',
    phaseNote: '西汉末处于<strong>僵化期</strong>——土地兼并使基座力恶化，王莽改制是「合法性叙事力」主导的修复尝试，但脱离结构实因。',
    sliceTitle: '结构切片 · 王莽改制',
    sliceNote: '权力几何：王莽（代汉合法性）→ 复古改制纵列 → 五均六筦下行 → 豪强/奴婢/流民底盘。理想与现实的断裂是死因。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '王莽 · 新朝', sub: '禅让合法性 · 复古叙事' },
      { id: 'gaige', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '复古改制', sub: '《周礼》理想 · 制度实验' },
      { id: 'haoqiang', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '豪强 · 地主', sub: '王田触动特权 · 抵制' },
      { id: 'zhixing', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '币制改革', sub: '执行混乱 · 经济扰民' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '流民 · 奴婢 · 贫农', sub: '基座恶化底盘' },
    ],
    forces: [
      ['财政汲取', '「与民争利」', '五均六筦、盐铁专营试图重建汲取，但币制混乱使财政反恶化'],
      ['精英循环', '「篡汉」', '触动豪强土地特权 → 地主—官僚联盟反扑；儒生集团亦因理想破灭而转向'],
      ['合法性叙事', '「禅让」与复古', '初始合法性来自禅让叙事，但复古失败使「受命」叙事迅速破产'],
      ['边疆军事', '匈奴/西南', '对外战争消耗加剧财政压力；军事力未能成为改革支撑'],
      ['生态—人口基座', '—', '土地兼并、流民增多使基座承载恶化——慢变量是改革失败的背景〔人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '「篡汉奸臣」叙事含东汉正统书写；但改制失败确有结构原因，非纯个人道德。'],
      ['钱穆', '《国史大纲》', '对王莽持批评，认为复古脱离现实；但也指出西汉末土地问题确需改革。'],
      ['金观涛', '超稳定结构', '王莽改制是超稳定结构在僵化期的「理想主义修复」——因触动所有力而全面失败。'],
      ['黄仁宇', '数目字管理', '币制改革暴露汉代数目字管理能力不足；复古理想无法替代基层会计与执行能力。'],
      ['西方汉学', 'Han studies', '学界对王莽有重新评价（理想主义改革者 vs 篡位者）；共识是改制脱离社会经济结构。〔存疑〕'],
    ],
    verdict: {
      ok: ['识别土地兼并问题', '尝试制度创新', '推动后续东汉土地政策讨论'],
      fail: ['新朝 15 年而亡', '币制改革混乱', '豪强反弹 + 流民起义'],
      open: '〔反事实〕若渐进改革而非复古激进，能否延长汉祚？',
    },
    mirror: {
      same: '僵化期改革 vs 既得利益；合法性叙事主导但脱离结构实因；币制/土地改革触动全盘。',
      diff: '现代改革强调试点—推广与数目字管理；但「理想主义脱离结构」的教训仍有效（→ SJ-05/09 变法谱系）。',
    },
    xrefs: [
      ['./SJ-05.html', 'SJ-05 · 王安石', '另一「复古/理想型」改革对照。'],
      ['./SJ-12.html', 'SJ-12 · 秦末', '短周期崩解样本对照。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '僵化期改革窗口定位。'],
    ],
    prev: ['./SJ-12.html', 'SJ-12'],
    next: ['./SJ-14.html', 'SJ-14'],
  },
  {
    num: '14',
    badge: 'SJ-14 · 变法改革案例卷 · 清',
    title: '洋务运动',
    subtitle: '中体西用 · 局部现代化 · 体制锁定',
    dynasty: '清',
    dynastyId: 'qing',
    type: '变法',
    zhupi: '朱批：洋务运动是<strong>僵化期晚期「中体西用」</strong>样本——军事与工业局部现代化，但未触动体制核心（旗籍、科举、皇权结构）。口径：《清史稿》相关列传、学界研究〔具体数字存疑〕。',
    hook: '鸦片战争后清帝国处于<strong>僵化期晚期</strong>，曾国藩、李鸿章等以「<b>自强</b>」「<b>求富</b>」兴办军工与民用工业（江南制造局、轮船招商局等），局部重建<b>军事力</b>与<b>财政汲取力</b>；但「中体西用」未改体制，甲午战败证明<strong>局部现代化不足以救崩解</strong>。',
    year: '系年：同治元年（1862）设安庆内军械所 · 光绪二十年（1894）甲午战败 · 出处《清史稿》及学界研究',
    phase: '僵化期晚期 · 局部改革',
    phaseNote: '晚清处于<strong>僵化期晚期</strong>——洋务是「军事力+技术基座」局部修复，但未触及精英循环与合法性叙事核心。',
    sliceTitle: '结构切片 · 洋务运动',
    sliceNote: '权力几何：慈禧/皇权 → 洋务派（李/左/张）→ 近代工业/新军 → 传统士绅/旗人底盘。「中体西用」使改革止于技术层，未改体制。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '慈禧 · 皇权', sub: '改革背书 · 体制不动' },
      { id: 'yangwu', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '洋务派', sub: '李/左/张 · 技术官僚' },
      { id: 'shishen', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '守旧派 · 士绅', sub: '中体不可变 · 抵制' },
      { id: 'gongye', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '近代工业/新军', sub: '局部现代化 · 执行层' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '旗人 · 士绅 · 农民', sub: '未改动的社会底盘' },
    ],
    forces: [
      ['财政汲取', '「与民争利」', '官督商办、盐税、厘金试图重建汲取；但战争赔款使财政更恶化'],
      ['精英循环', '「用夷变夏」', '未改科举与旗籍 → 新军与工业未能吸纳精英，体制锁定'],
      ['合法性叙事', '「中体西用」', '维护儒家道统的叙事使改革止于技术层；甲午失败后叙事破产'],
      ['边疆军事', '海防 vs 塞防', '军事力局部现代化（北洋水师）但制度与组织未改 → 甲午惨败'],
      ['生态—人口基座', '—', '人口压力与财政负担叠加；未触动土地与人口结构〔人口数字存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「卖国」道德书写——洋务派确有救国意图，但体制约束使改革止于局部。'],
      ['钱穆', '《国史大纲》续论', '对晚清改革持复杂态度；承认洋务必要性，但指出未改「体」则「用」不足。'],
      ['金观涛', '超稳定结构', '洋务是超稳定结构在冲击下的「低水平修复」——技术引进无法替代结构升级。'],
      ['黄仁宇', '数目字管理', '洋务引入部分数目字管理（海关、工业会计），但官僚体系整体仍缺数目字能力。'],
      ['西方汉学', 'Self-Strengthening', '学界共识：洋务是「防御性现代化」；甲午证明局部改革不足以应对系统性冲击。〔存疑〕'],
    ],
    verdict: {
      ok: ['近代工业起步', '新军与海军建设', '海关与近代会计引入'],
      fail: ['甲午战败', '未改体制核心', '「中体西用」锁定改革上限'],
      open: '〔反事实〕若戊戌变法成功，能否突破体制锁定？',
    },
    mirror: {
      same: '外部冲击下的局部现代化；技术引进 vs 体制锁定；军事力局部强化但组织未改。',
      diff: '现代改革开放是「体用」整体重构；但「局部改革不足以应对系统性冲击」教训仍有效（→ SJ-15 辛亥）。',
    },
    xrefs: [
      ['./SJ-09.html', 'SJ-09 · 一条鞭', '明清财政改革谱系延伸。'],
      ['./SJ-15.html', 'SJ-15 · 辛亥', '洋务—戊戌—辛亥的改革—革命链。'],
      ['./SJ-24.html', 'SJ-24 · 外交映射', '海防与近代地缘压力。'],
    ],
    prev: ['./SJ-13.html', 'SJ-13'],
    next: ['./SJ-15.html', 'SJ-15'],
  },
  {
    num: '15',
    badge: 'SJ-15 · 王朝崩解案例卷 · 近代',
    title: '辛亥革命',
    subtitle: '帝制终结 · 合法性破产 · 重建未竟',
    dynasty: '近代',
    dynastyId: 'jindai',
    type: '崩解',
    zhupi: '朱批：辛亥革命是<strong>帝制合法性彻底破产</strong>后的重建尝试——革命叙事取代天命，但五力再平衡未竟。口径：《清史稿·宣统本纪》、学界共识〔细节存疑〕。',
    hook: '清末<strong>僵化—崩解</strong>叠加：外债、铁路国有化、新军离心与革命党渗透共振，1911 年<b>武昌起义</b>引发连锁响应，<b>清帝退位</b>（1912）终结两千年帝制；但<strong>五力再平衡未竟</strong>，后续进入长期重整。',
    year: '系年：宣统三年九月（1911.10）武昌起义 · 1912.2.12 清帝退位 · 出处《清史稿》及学界研究',
    phase: '崩解期 → 重整期',
    phaseNote: '清末处于<strong>崩解期</strong>，辛亥是崩解的显性节点；帝制终结后进入<strong>重整期</strong>，但五力再平衡远未完成。',
    sliceTitle: '结构切片 · 辛亥革命',
    sliceNote: '权力几何：清廷（空）→ 各省督抚（割据）→ 新军/革命党 → 民众底盘。帝制合法性归零，「革命」叙事接棒但未完成制度建构。',
    svgNodes: [
      { id: 'qingting', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '清廷 · 空壳', sub: '帝制合法性归零' },
      { id: 'dufu', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '各省督抚', sub: '地方割据 · 观望' },
      { id: 'geming', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '革命党 · 新军', sub: '武昌首义 · 连锁响应' },
      { id: 'xinjun', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '铁路/外债', sub: '财政引爆 · 民变' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '绅商 · 会党 · 民众', sub: '多元底盘' },
    ],
    forces: [
      ['财政汲取', '外债 · 厘金', '《辛丑条约》赔款 + 铁路国有化触发动员；财政枢纽越阈是引爆点之一'],
      ['精英循环', '新军 · 留学生', '新军与革命党吸纳部分精英，但科举废除后通道重构未完成'],
      ['合法性叙事', '「天命」→「革命」', '帝制「天命」叙事破产；「共和」「民族」叙事接棒但未完成制度内化'],
      ['边疆军事', '新军离心', '武昌新军首义；各省新军响应或观望——军事力决定政治正统'],
      ['生态—人口基座', '—', '人口压力与财政负担叠加；但崩解主因是五力共振而非单因〔人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「革命」与「改良」的道德对立——辛亥是多重力量共振，非单一政党功劳。'],
      ['钱穆', '《国史大纲》', '对帝制终结持复杂态度；强调革命后重建比革命本身更难。'],
      ['金观涛', '超稳定结构', '帝制超稳定结构终结，但新结构未立——进入长期「重整期」失衡。'],
      ['黄仁宇', '数目字管理', '清末已开始数目字管理（海关、预算），但官僚体系整体未能完成转型。'],
      ['西方汉学', '1911 Revolution', '学界共识：辛亥是帝制合法性破产的必然结果；但后续重建路径有广泛争论。〔存疑〕'],
    ],
    verdict: {
      ok: ['帝制终结', '共和叙事确立', '现代国家建构起步'],
      fail: ['五力再平衡未竟', '军阀割据', '外债与主权问题延续'],
      open: '〔未决〕重整期能否完成五力再平衡？此为当代仍在回答的问题。',
    },
    mirror: {
      same: '合法性叙事破产引发崩解；军事力决定政治正统；精英循环通道重构。',
      diff: '当代已完成主权国家建构与组织化穿透；但「崩解后重整」的长周期规律仍值得对照（→ SJ-08 分裂重整）。',
    },
    xrefs: [
      ['./SJ-14.html', 'SJ-14 · 洋务', '改革—革命因果链上游。'],
      ['./SJ-08.html', 'SJ-08 · 五代', '分裂—重整样本对照。'],
      ['./SJ-20.html', 'SJ-20 · 政治映射', '精英循环与合法性叙事当代形态。'],
    ],
    prev: ['./SJ-14.html', 'SJ-14'],
    next: ['./SJ-00.html', 'SJ-00'],
  },
];

const COLOR = {
  ochre: 'var(--sj-ochre)',
  celadon: 'var(--sj-celadon)',
  vermil: 'var(--sj-vermil)',
  paper: 'var(--sj-paper-300)',
  ink: 'var(--sj-line)',
};

function svgSlice(c) {
  const nodes = c.svgNodes.map((n) => {
    const stroke = COLOR[n.color] || COLOR.ink;
    const fill = n.color === 'ink' ? 'url(#sj-base)' : 'var(--sj-ink-800)';
    return `<g class="sj-node" data-id="${n.id}" tabindex="0" role="button" aria-label="${n.label}">
    <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2.4"/>
    <text x="${n.x + n.w / 2}" y="${n.y + 28}" text-anchor="middle" fill="${stroke}" font-size="14" font-weight="600" font-family="Songti SC,serif">${n.label}</text>
    <text x="${n.x + n.w / 2}" y="${n.y + 46}" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">${n.sub}</text>
  </g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">${c.sliceTitle}</title>
  <desc id="sj-desc">${c.sliceNote}</desc>
  <defs>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/></linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
  </defs>
  <rect width="820" height="600" fill="var(--sj-ink-900)"/>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,serif">${c.sliceTitle}</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,monospace">SJ-${c.num} · ${c.dynasty} · ${c.type}</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批：${c.type === '变法' ? '财政/制度重建 vs 既得利益' : '多力共振 · 崩解链'}</text>
  <path class="sj-edge" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.8" stroke-dasharray="6 5" marker-end="url(#a-ochre)"/>
  <path class="sj-edge" d="M306,286 L462,286" stroke="var(--sj-paper-300)" stroke-width="2.2"/>
  <path class="sj-edge" d="M640,498 C724,452 716,340 588,320" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)"/>
  ${nodes}
</svg>`;
}

function genHtml(c) {
  const P = `sj-${c.num}`;
  const forceRows = c.forces.map(([f, z, s]) => `<tr><td>${f}</td><td class="zheng">${z}</td><td class="shi">${s}</td></tr>`).join('\n');
  const histCards = c.historians.map(([w, s, p], i) => {
    const span = i === c.historians.length - 1 ? ' style="grid-column:1/-1"' : '';
    return `<article${span}><div class="who">${w}<span>${s}</span></div><p>${p}</p></article>`;
  }).join('\n');
  const xrefs = c.xrefs.map(([h, n, p]) => `<a href="${h}"><div class="n">${n}</div><h3>${n.split(' · ')[1] || n}</h3><p>${p}</p></a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SJ-${c.num} · ${c.title}</title>
<meta name="description" content="ChinaOS 史鉴系列案例卷 SJ-${c.num}：${c.title}——${c.subtitle}。史鉴台账七字段。"/>
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
.${P}-wrap{max-width:min(100%,1180px);margin:0 auto;padding:var(--sj-space) var(--sj-space) 48px}
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
.sj-rail-toc a:hover,.sj-rail-toc a:focus-visible{border-color:var(--sj-ochre);outline:none}
.sj-rail-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:4px 4px 0 0}
.${P}-mast{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid var(--sj-line);margin-bottom:20px}
.${P}-mast .badge{font-family:var(--sj-mono);font-size:11px;letter-spacing:.18em;color:var(--sj-ochre);margin-bottom:6px}
.${P}-mast h1{font-size:clamp(22px,3vw,28px);font-weight:600;letter-spacing:.16em}
.${P}-mast h1 em{font-style:normal;color:var(--sj-paper-300);font-weight:400;font-size:.72em;display:block;margin-top:4px}
.${P}-meta{font-family:var(--sj-mono);font-size:11px;color:var(--sj-paper-300);text-align:right}
.${P}-chip{display:inline-block;font-family:var(--sj-mono);font-size:10px;color:var(--sj-celadon);border:1px solid var(--sj-line);padding:3px 8px;border-radius:var(--sj-radius);text-decoration:none;margin:2px}
.${P}-dynasty{color:var(--sj-ochre);border-color:var(--sj-ochre)}
.sj-zhupi{color:var(--sj-vermil);font-size:13.5px;margin:0 0 18px;padding-left:12px;border-left:2px solid var(--sj-vermil);max-width:74ch}
.sj-ledger{display:grid;gap:8px}
.sj-ledger-field{margin:20px 0 8px;scroll-margin-top:24px}
.sj-ledger-fh{display:flex;align-items:baseline;gap:12px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--sj-line)}
.sj-ledger-fh .fnum{font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre);border:1px solid var(--sj-line);border-radius:4px;padding:1px 7px}
.sj-ledger-fh h2{font-size:clamp(16px,2.1vw,19px);font-weight:600}
.${P}-prose{font-size:15.5px;max-width:74ch}
.${P}-hook{border:1px solid var(--sj-line);border-left:3px solid var(--sj-vermil);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:18px 22px}
.${P}-hook p{font-size:clamp(16px,2.3vw,20px);line-height:1.7}
.${P}-hook .yr{margin-top:10px;font-family:var(--sj-mono);font-size:11px;color:var(--sj-ochre)}
.${P}-stage{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:8px;overflow:auto}
.${P}-stage svg{display:block;width:100%;height:auto}
.${P}-phase .pb{font-family:var(--sj-mono);font-size:12px;color:var(--sj-vermil);border:1px solid var(--sj-vermil);border-radius:20px;padding:6px 16px}
.${P}-table-wrap{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);overflow:auto}
.${P}-table{width:100%;border-collapse:collapse;font-size:13px}
.${P}-table th{background:var(--sj-ink-900);color:var(--sj-ochre);font-family:var(--sj-mono);font-size:10px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--sj-line)}
.${P}-table td{padding:10px 12px;border-bottom:1px solid var(--sj-line);color:var(--sj-paper-300);vertical-align:top}
.${P}-table td:first-child{color:var(--sj-paper-100);font-weight:600}
.${P}-hist{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${P}-hist article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${P}-hist .who{font-size:14px;font-weight:600;color:var(--sj-celadon);margin-bottom:6px}
.${P}-hist .who span{font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);margin-left:6px}
.${P}-hist p{font-size:13px;color:var(--sj-paper-300);line-height:1.65}
.${P}-verdict{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.${P}-verdict article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${P}-verdict .vh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${P}-verdict article.ok .vh{color:var(--sj-celadon)}
.${P}-verdict article.fail .vh{color:var(--sj-vermil)}
.${P}-verdict article.open .vh{color:var(--sj-ochre)}
.${P}-verdict p{font-size:13px;color:var(--sj-paper-300)}
.${P}-mirror{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${P}-mirror article{border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px}
.${P}-mirror .mh{font-family:var(--sj-mono);font-size:10px;margin-bottom:8px}
.${P}-mirror article.same .mh{color:var(--sj-celadon)}
.${P}-mirror article.diff .mh{color:var(--sj-ochre)}
.${P}-mirror p{font-size:13px;color:var(--sj-paper-100);line-height:1.68}
.${P}-xref{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.${P}-xref a{display:block;border:1px solid var(--sj-line);border-radius:var(--sj-radius);background:var(--sj-ink-800);padding:14px 16px;text-decoration:none;color:inherit}
.${P}-xref .n{font-family:var(--sj-mono);font-size:10px;color:var(--sj-ochre);margin-bottom:4px}
.${P}-xref h3{font-size:14px;margin-bottom:6px}
.${P}-xref p{font-size:12.5px;color:var(--sj-paper-300)}
.${P}-foot{margin-top:40px;padding-top:14px;border-top:1px solid var(--sj-line);font-family:var(--sj-mono);font-size:10px;color:var(--sj-paper-300);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.${P}-foot a{color:var(--sj-celadon);text-decoration:none}
@media(max-width:768px){.${P}-hist,.${P}-mirror,.${P}-verdict{grid-template-columns:1fr}.${P}-xref{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<div class="${P}-wrap" id="${P}-top">
<header class="${P}-mast">
  <div>
    <div class="badge">${c.badge}</div>
    <h1>${c.title}<em>${c.subtitle}</em></h1>
    <div>
      <span class="${P}-chip ${P}-dynasty" data-dynasty="${c.dynastyId}">朝代 · ${c.dynasty}</span>
      <span class="${P}-chip">${c.type}</span>
      <a class="${P}-chip" href="./SJ-00.html">↔ SJ-00</a>
      <a class="${P}-chip" href="./SJ-03.html">↔ SJ-03</a>
      <a class="${P}-chip" href="./SJ-04.html">↔ SJ-04</a>
    </div>
  </div>
  <div class="${P}-meta">史鉴台账七字段 · ${c.dynasty}<br/><b>AS_OF 2026-07-15</b> · v0.1</div>
</header>
<p class="sj-zhupi">${c.zhupi}</p>
<article class="sj-ledger">
<div class="sj-page-layout">
<div class="sj-main-col">
<section class="sj-ledger-field" id="f1"><div class="sj-ledger-fh"><span class="fnum">01</span><h2>一句话拐点</h2></div>
  <div class="${P}-hook"><p>${c.hook}</p><div class="yr">${c.year}</div></div>
</section>
<section class="sj-ledger-field" id="f2"><div class="sj-ledger-fh"><span class="fnum">02</span><h2>结构切片</h2></div>
  <p class="${P}-prose">${c.sliceNote}</p>
  <div class="${P}-stage">${svgSlice(c)}</div>
</section>
</div>
<aside class="sj-rail"><div class="sj-rail-card"><div class="k">台账 · 七字段</div>
  <nav class="sj-rail-toc"><a href="#f1">01 · 拐点</a><a href="#f2">02 · 切片</a><a href="#f3">03 · 相位</a><a href="#f4">04 · 五力</a><a href="#f5">05 · 交锋</a><a href="#f6">06 · 成败</a><a href="#f7">07 · 映射</a></nav>
  <a class="sj-rail-chip" href="./SJ-00.html#sec-case-hub">案例库 Hub</a>
</div></aside>
</div>
<section class="sj-ledger-field" id="f3"><div class="sj-ledger-fh"><span class="fnum">03</span><h2>相位定位</h2></div>
  <div class="${P}-phase"><span class="pb">${c.phase}</span></div>
  <p class="${P}-prose">${c.phaseNote}</p>
</section>
<section class="sj-ledger-field" id="f4"><div class="sj-ledger-fh"><span class="fnum">04</span><h2>五力归因台账</h2></div>
  <div class="${P}-table-wrap"><table class="${P}-table"><thead><tr><th>力</th><th>正史归因</th><th>结构实因</th></tr></thead><tbody>${forceRows}</tbody></table></div>
</section>
<section class="sj-ledger-field" id="f5"><div class="sj-ledger-fh"><span class="fnum">05</span><h2>史家交锋</h2></div>
  <div class="${P}-hist">${histCards}</div>
</section>
<section class="sj-ledger-field" id="f6"><div class="sj-ledger-fh"><span class="fnum">06</span><h2>成败判定</h2></div>
  <div class="${P}-verdict">
    <article class="ok"><div class="vh">已兑现</div>${c.verdict.ok.map((p) => `<p>${p}</p>`).join('')}</article>
    <article class="fail"><div class="vh">已失败</div>${c.verdict.fail.map((p) => `<p>${p}</p>`).join('')}</article>
    <article class="open"><div class="vh">未决</div><p>${c.verdict.open}</p></article>
  </div>
</section>
<section class="sj-ledger-field" id="f7"><div class="sj-ledger-fh"><span class="fnum">07</span><h2>古今映射</h2></div>
  <div class="${P}-mirror">
    <article class="same"><div class="mh">相似机制</div><p>${c.mirror.same}</p></article>
    <article class="diff"><div class="mh">关键差异</div><p>${c.mirror.diff}</p></article>
  </div>
</section>
<section class="sj-ledger-field" id="fx"><div class="sj-ledger-fh"><span class="fnum">◆</span><h2>交叉引用</h2></div>
  <div class="${P}-xref">${xrefs}</div>
</section>
</article>
<footer class="${P}-foot">
  <span>ChinaOS · 史鉴 SJ-${c.num} · v0.1 · ${c.dynasty}</span>
  <span><a href="./SJ-00.html">← SJ-00</a> · <a href="${c.prev[0]}">← ${c.prev[1]}</a></span>
  <span><a href="${c.next[0]}">${c.next[1]} →</a></span>
</footer>
</div>
</body>
</html>`;
}

function genSpec(c) {
  return `# SJ-${c.num} · ${c.title} —— 建设规格

> ${c.badge}。朝代：${c.dynasty} · 类型：${c.type}

## 模块头

- 系年：见 HTML §01
- 交叉引用：见 HTML §◆

## 七字段摘要

① ${c.hook.replace(/<[^>]+>/g, '').slice(0, 80)}…

② ${c.sliceNote.slice(0, 60)}…

③ ${c.phase}

④ 五力：见 HTML 台账表

⑤ 史家交锋：李敖/钱穆/金观涛/黄仁宇/汉学

⑥ 成败三列：已兑现/已失败/未决

⑦ 古今映射：相似机制 + 关键差异双栏
`;
}

mkdirSync(DOCS, { recursive: true });
for (const c of CASES) {
  const htmlPath = join(OUT, `SJ-${c.num}.html`);
  writeFileSync(htmlPath, genHtml(c));
  writeFileSync(join(DOCS, `SJ-${c.num}-${c.title}-建设规格.md`), genSpec(c));
  console.log('Wrote', htmlPath);
}

console.log('Done:', CASES.length, 'case volumes');
