#!/usr/bin/env node
/** Generate SJ-27/35/38/39/41/49 case volumes (Round 2). */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');
const DOCS = join(ROOT, 'docs/shijian');

const CASES = [
  {
    num: '27',
    badge: 'SJ-27 · 盛世修复案例卷 · 西汉',
    title: '文景之治',
    subtitle: '休养生息 · 基座修复 · 汲取力降阈',
    dynasty: '两汉',
    dynastyId: 'han',
    type: '修复',
    zhupi: '朱批：本案是<strong>上升期基座修复</strong>的教科书样本——秦末崩解后汉初以轻徭薄赋、与民休息修复生态—人口基座，财政汲取力主动降阈而非加征。口径：《史记·孝文本纪》《孝景本纪》《汉书·食货志》；人口数字标〔存疑〕。',
    hook: '秦末崩解后，汉初承秦制而改其暴——文帝、景帝以<b>轻徭薄赋、弛刑、劝农</b>使编户齐民得以回填，基座承载力修复；同时抑制诸侯、稳定中枢，为武帝扩张奠定财政与人口底盘。文景之治是「崩解后重整→上升」相位的典型窗口。',
    year: '系年：文帝前180即位 · 景帝前157即位 · 武帝前141即位 · 出处《史记·孝文本纪》《汉书·食货志》',
    phase: '上升期 · 基座修复',
    phaseNote: '汉初处于<strong>重整期→上升期</strong>转换——汲取力主动降阈、精英循环通道相对开放、合法性叙事以「与民休息」重建。在 SJ-04 相位盘落于「上升期·休养生息」。与 SJ-12 秦末崩解构成因果链下游。',
    sliceTitle: '结构切片 · 文景之治',
    sliceNote: '权力几何：文帝/景帝皇权 → 黄老无为纵列 → 轻徭薄赋下行 → 诸侯/豪强底盘。基座修复（赭金）为主轴，朱批为七国之乱等局部震荡。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '文帝 · 景帝', sub: '皇权 · 休养生息' },
      { id: 'huanglao', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '黄老之治', sub: '无为而治 · 纵列' },
      { id: 'zhuhou', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '诸侯 · 豪强', sub: '七国之乱 · 局部反扑' },
      { id: 'qingfu', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '轻徭薄赋', sub: '三十税一 · 弛刑' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户齐民 · 农业基座', sub: '人口回填 · 承载修复' },
    ],
    forces: [
      ['财政汲取', '「与民休息」', '文帝废除肉刑、减轻田租（十五税一→三十税一〔存疑〕），景帝继续薄赋——汲取力主动降阈，税基广度恢复'],
      ['精英循环', '「削藩」', '推恩令前以削藩抑制诸侯；中央—地方精英再平衡，为后续科举通道奠基'],
      ['合法性叙事', '「拨乱反正」', '承秦制而反秦暴，以黄老「无为」叙事绑定民望；绩效合法性来自休养生息'],
      ['边疆军事', '和亲 · 防御', '对匈奴以和亲、防御为主，军事力克制——为武帝后期扩张积蓄而非透支'],
      ['生态—人口基座', '—', '战乱后人口与耕地重新匹配，基座承载力修复——慢变量回升是文景之治的结构实因〔人口峰值存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「文景盛世」道德书写——核心是汲取降阈与基座回填，非单纯明君贤臣叙事。'],
      ['钱穆', '《国史大纲》', '强调汉承秦制而改其暴，文景为汉四百年寿祚奠基；黄老与儒术并行。'],
      ['金观涛', '超稳定结构', '崩解后小农经济自我修复 + 官僚制模块化复用的典型样本——超稳定结构「低水平恢复」。'],
      ['黄仁宇', '数目字管理', '汉初数目字管理仍薄，但轻徭使基层承受力回升；为后续均输平准奠基。'],
      ['西方汉学', 'Han restoration', '学界共识：文景之治是 post-collapse recovery 的标准案例；与罗马奥古斯都时期有结构可比性。〔细节存疑〕'],
    ],
    verdict: {
      ok: ['基座承载力修复', '汉祚四百年奠基', '汲取力降阈窗口'],
      fail: ['七国之乱局部震荡', '诸侯问题未根除', '为武帝扩张埋财政伏笔'],
      open: '〔反事实〕若文景期即推恩削藩并完成数目字管理，能否避免武帝后期财政越阈？',
    },
    mirror: {
      same: '崩解后休养生息 vs 汲取降阈；基座修复优先于扩张；合法性叙事以绩效（与民休息）重建。',
      diff: '现代国家有宏观调控与转移支付，不必依赖「无为」；但「重整期先修复基座再扩张」规律仍适用（→ SJ-35 隋初、SJ-38 贞观）。',
    },
    xrefs: [
      ['./SJ-12.html', 'SJ-12 · 秦末', '崩解上游；文景是秦亡后重整链。'],
      ['./SJ-03.html', 'SJ-03 · 五力', '基座力修复样本；五力协同上升。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '上升期·休养生息定位。'],
    ],
    prev: ['./SJ-15.html', 'SJ-15'],
    next: ['./SJ-35.html', 'SJ-35'],
  },
  {
    num: '35',
    badge: 'SJ-35 · 变法改革案例卷 · 隋',
    title: '隋文帝改革',
    subtitle: '均田—租庸调 · 三省六部 · 重整奠基',
    dynasty: '隋',
    dynastyId: 'sui',
    type: '变法',
    zhupi: '朱批：隋文帝改革是<strong>分裂后重整期制度升级</strong>样本——均田、租庸调、三省六部、科举雏形同步重建财政汲取与精英循环。口径：《隋书·食货志》《高祖纪》；具体户数〔存疑〕。',
    hook: '南北朝分裂后，隋文帝以<b>均田制、租庸调、三省六部、开皇律</b>重建中央集权与财政汲取力；均田限田抑制兼并，租庸调以人丁为基，科举雏形打开精英通道——为隋唐鼎盛奠基，但均田制本身含刚性约束，炀帝后期即现崩解苗头。',
    year: '系年：开皇元年（581）隋代周 · 开皇九年（589）灭陈统一 · 出处《隋书·食货志》《高祖纪》',
    phase: '重整期 → 上升期',
    phaseNote: '隋初处于<strong>重整期向上升期</strong>转换——五力同步重建：汲取（租庸调）、精英（科举雏形）、合法性（统一叙事）、军事（灭陈）、基座（均田）。在 SJ-04 相位盘落于「重整期·制度奠基」。',
    sliceTitle: '结构切片 · 隋文帝改革',
    sliceNote: '权力几何：隋文帝皇权 → 三省六部纵列 → 均田/租庸调下行 → 门阀/豪强底盘。制度重建（青瓷）为主轴，炀帝工程（朱红）为后续病灶预埋。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '隋文帝 · 皇权', sub: '开皇之治 · 统一' },
      { id: 'zhidu', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '三省六部', sub: '官僚纵列 · 制度重建' },
      { id: 'menfa', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '门阀 · 豪强', sub: '均田限田 · 抵制' },
      { id: 'juntian', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '均田 · 租庸调', sub: '汲取重建 · 下行' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户齐民 · 均田农民', sub: '税基底盘' },
    ],
    forces: [
      ['财政汲取', '租庸调', '以人丁为本的租庸调重建税基；均田制保障税源广度——汲取力从分裂期低水平恢复'],
      ['精英循环', '科举雏形', '开皇设进士科雏形，打破门阀垄断；但门阀仍强，精英循环仅部分打开'],
      ['合法性叙事', '「混一南北」', '统一叙事重建合法性；开皇之治绩效合法性充盈'],
      ['边疆军事', '灭陈 · 防御', '589 灭陈完成统一；对突厥以防御为主——军事力可控'],
      ['生态—人口基座', '—', '分裂后人口重新匹配；均田制试图锁定税基〔均田实施范围存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '「隋文帝圣君」叙事需剥离——改革核心是分裂后制度模块化复用（均田+租庸调承北朝）。'],
      ['钱穆', '《国史大纲》', '肯定隋初制度进步，但指出炀帝暴政使隋速亡；文帝改革遗产为唐所承。'],
      ['金观涛', '超稳定结构', '分裂后再统一的制度升级——均田+租庸调是超稳定结构的标准重启包。'],
      ['黄仁宇', '数目字管理', '三省六部是数目字管理的官僚基础；租庸调以人丁计征，基层会计仍薄。'],
      ['西方汉学', 'Sui reunification', '学界共识：隋初改革是 Medieval China reunification 的制度模板；炀帝工程过载是隋亡主因。〔存疑〕'],
    ],
    verdict: {
      ok: ['南北统一', '租庸调/均田遗产', '三省六部制延续'],
      fail: ['隋二世而亡', '均田制含刚性约束', '炀帝工程预埋崩解'],
      open: '〔反事实〕若无炀帝大运河/远征，隋能否完成唐式长期稳定？',
    },
    mirror: {
      same: '分裂后重整→制度升级；汲取+精英双轨重建；模块化制度跨朝复用。',
      diff: '现代土地制度与户籍管理已质变；但「重整期制度奠基→上升期扩张」节奏仍可对读（→ SJ-38 贞观）。',
    },
    xrefs: [
      ['./SJ-08.html', 'SJ-08 · 五代', '分裂—重整对照上游。'],
      ['./SJ-38.html', 'SJ-38 · 贞观', '隋制遗产为唐所承。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '重整期·制度奠基定位。'],
    ],
    prev: ['./SJ-27.html', 'SJ-27'],
    next: ['./SJ-38.html', 'SJ-38'],
  },
  {
    num: '38',
    badge: 'SJ-38 · 盛世奠基案例卷 · 唐',
    title: '贞观之治',
    subtitle: '上升期制度奠基 · 五力协同 · 天可汗',
    dynasty: '唐',
    dynastyId: 'tang',
    type: '盛世',
    zhupi: '朱批：贞观之治是<strong>上升期五力协同</strong>样本——太宗纳谏、均田承续、府兵可控、天可汗叙事，为开元鼎盛奠基。口径：《旧唐书·太宗本纪》《贞观政要》；「天可汗」系年〔存疑〕。',
    hook: '唐太宗贞观年间（627—649），以<b>纳谏、均田承续、府兵制、天可汗</b>叙事使五力协同处于上升相位——财政汲取可控、精英循环（科举+门阀并行）相对开放、合法性叙事充盈、边疆军事主动而非外包、基座承载宽松。贞观是盛唐制度底盘，也是开元隐性拐点的上游。',
    year: '系年：贞观元年（627）改元 · 贞观二十三年（649）太宗崩 · 出处《旧唐书·太宗本纪》《贞观政要》',
    phase: '上升期 · 制度奠基',
    phaseNote: '唐初处于<strong>上升期</strong>——承隋制而优化，五力协同上升。在 SJ-04 相位盘落于「上升期·开国之治」。与 SJ-06 天宝之乱构成同一王朝的起—伏对照。',
    sliceTitle: '结构切片 · 贞观之治',
    sliceNote: '权力几何：太宗皇权 → 纳谏/三省纵列 → 均田/府兵下行 → 门阀/藩镇底盘（未显）。上升期五力均衡，朱批为后期节度使预埋。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '唐太宗 · 皇权', sub: '纳谏 · 天可汗' },
      { id: 'najian', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '纳谏 · 三省', sub: '精英循环 · 纵列' },
      { id: 'menfa', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '门阀 · 关陇', sub: '后期俘获 · 未显' },
      { id: 'fubing', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '均田 · 府兵', sub: '汲取可控 · 军事' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户齐民 · 均田农民', sub: '基座承载宽松' },
    ],
    forces: [
      ['财政汲取', '均田 · 租庸调', '承隋租庸调，均田制保障税基；贞观轻徭，汲取力可控'],
      ['精英循环', '科举 + 门阀', '科举扩大通道，门阀仍强；纳谏使循环相对开放'],
      ['合法性叙事', '「天可汗」', '绩效合法性（纳谏、平世）+ 象征（天可汗）双源充盈'],
      ['边疆军事', '府兵 · 天可汗', '府兵制使军事力可控、不外包；天可汗叙事整合边疆'],
      ['生态—人口基座', '—', '隋末战乱后人口回填，基座承载宽松〔贞观人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '「贞观盛世」含后世书写；核心是五力协同上升的制度底盘，非单纯明君叙事。'],
      ['钱穆', '《国史大纲》', '强调贞观为唐百年盛世奠基；纳谏与均田是关键制度。'],
      ['金观涛', '超稳定结构', '上升期五力协同的典型——为后续僵化/崩解埋下均田瓦解、府兵转募兵等种子。'],
      ['黄仁宇', '数目字管理', '贞观政要体现数目字管理意识，但基层会计仍薄；为两税法改革埋伏笔。'],
      ['西方汉学', 'Tang Taizong', '学界共识：贞观是 High Tang 的制度模板；与 SJ-06 天宝构成完整衰变链。〔存疑〕'],
    ],
    verdict: {
      ok: ['盛唐制度底盘', '天可汗叙事', '纳谏精英循环'],
      fail: ['均田后期瓦解', '府兵→募兵转型', '为安史预埋结构'],
      open: '〔反事实〕若贞观后即完成两税法式税基重整，能否延缓天宝崩解？',
    },
    mirror: {
      same: '上升期五力协同；制度奠基优先于扩张；合法性双源（绩效+象征）。',
      diff: '现代国家有完整数目字管理与组织穿透；但「上升期制度底盘→鼎盛→僵化」节奏仍可对读（→ SJ-06 天宝、SJ-49 康乾）。',
    },
    xrefs: [
      ['./SJ-35.html', 'SJ-35 · 隋文帝', '隋制上游；唐承隋而优化。'],
      ['./SJ-06.html', 'SJ-06 · 天宝', '同朝起—伏对照。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '上升期·开国之治定位。'],
    ],
    prev: ['./SJ-35.html', 'SJ-35'],
    next: ['./SJ-39.html', 'SJ-39'],
  },
  {
    num: '39',
    badge: 'SJ-39 · 变法改革案例卷 · 唐',
    title: '两税法',
    subtitle: '按资产征调 · 税基重整 · 汲取力修复',
    dynasty: '唐',
    dynastyId: 'tang',
    type: '变法',
    zhupi: '朱批：两税法是母本<strong>汲取力改革谱系第一环</strong>——安史乱后租庸调崩坏，杨炎建中元年（780）改按资产与土产分夏税秋粮，税基从人丁转向资产。口径：《旧唐书·杨炎传》《食货志》；具体税率〔存疑〕。',
    hook: '安史之乱后租庸调因均田瓦解、户籍流散而名存实亡，杨炎以<b>两税法</b>（建中元年 780）改按资产与土产分夏税秋粮征调，不问户籍人丁——税基从「人」转向「地+财」，是财政汲取力的结构性重整，延续唐祚但未能突破「汲取转嫁基层」的母结构。',
    year: '系年：建中元年（780）杨炎奏两税法 · 出处《旧唐书·杨炎传》《新唐书·食货志》',
    phase: '僵化期 · 汲取力重建',
    phaseNote: '唐后期处于<strong>僵化期</strong>——均田瓦解使旧税基流失，两税法是僵化期典型的汲取力修复窗口。在 SJ-04 相位盘落于「僵化期·改革窗口」。与 SJ-09 一条鞭、SJ-05 王安石构成改革谱系。',
    sliceTitle: '结构切片 · 两税法',
    sliceNote: '权力几何：德宗皇权 → 杨炎改革纵列 → 两税下行征调 → 藩镇/豪强底盘。税基重整（赭金）为主轴，藩镇截留（朱红）为执行阻力。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '德宗 · 皇权', sub: '改革背书' },
      { id: 'liangshui', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '杨炎 · 两税法', sub: '税基重整 · 纵列' },
      { id: 'fanzen', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '藩镇 · 豪强', sub: '截留 · 抵制' },
      { id: 'xiashang', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '夏税 · 秋粮', sub: '按资产征调 · 下行' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '编户 · 地主 · 商人', sub: '新税基底盘' },
    ],
    forces: [
      ['财政汲取', '「与民争利」', '两税法按资产与土产征调，税基从人丁转向资产——汲取力结构性重整，延续唐祚'],
      ['精英循环', '杨炎 · 陆贽', '改革触动藩镇与旧户利益；杨炎后被贬，精英循环内耗'],
      ['合法性叙事', '「轻徭简政」', '杨炎以「轻徭」叙事包装，但执行中仍有加派'],
      ['边疆军事', '藩镇', '藩镇截留两税，中央汲取力被分割——军事力与财政耦合并轨'],
      ['生态—人口基座', '—', '安史乱后户籍流散，旧均田基座瓦解——两税法是对基座变迁的适应〔人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「杨炎奸臣」叙事——两税法是税基流失后的必要重整，非个人道德问题。'],
      ['钱穆', '《国史大纲》', '肯定两税法对唐祚延续之功，但指出藩镇截留使改革效果打折。'],
      ['金观涛', '超稳定结构', '僵化期汲取力修复的标准操作——但无法突破「转嫁基层」结构。'],
      ['黄仁宇', '数目字管理', '两税法是数目字管理进步——税基从人丁转向资产，但基层会计仍薄。'],
      ['西方汉学', 'Two-tax system', '学界共识：两税法是中世纪中国 fiscal revolution；为宋明税制奠基。〔存疑〕'],
    ],
    verdict: {
      ok: ['税基重整', '唐祚延续', '改革谱系第一环'],
      fail: ['杨炎被贬', '藩镇截留', '未能突破转嫁结构'],
      open: '〔反事实〕若两税与藩镇裁抑同步，能否完成唐后期财政重建？',
    },
    mirror: {
      same: '税基流失后的汲取力重整；从人丁到资产的税基转换；僵化期改革窗口。',
      diff: '现代已有完整税务与资产登记体系；但「税基重整延续寿命、无法突破转嫁结构」规律仍适用（→ SJ-09 一条鞭、SJ-21 经济映射）。',
    },
    xrefs: [
      ['./SJ-06.html', 'SJ-06 · 天宝', '安史乱后税基崩坏上游。'],
      ['./SJ-09.html', 'SJ-09 · 一条鞭', '汲取力改革谱系第二环。'],
      ['./SJ-21.html', 'SJ-21 · 经济映射', '税制改革古今对照。'],
    ],
    prev: ['./SJ-38.html', 'SJ-38'],
    next: ['./SJ-41.html', 'SJ-41'],
  },
  {
    num: '41',
    badge: 'SJ-41 · 王朝崩解案例卷 · 北宋',
    title: '靖康之耻',
    subtitle: '军事力不足 · 外交误判 · 积弱总清算',
    dynasty: '宋',
    dynastyId: 'song',
    type: '崩解',
    zhupi: '朱批：靖康之耻是母本<strong>「过度矫正→下一周期病灶」</strong>的教科书——宋对五代军事力畸大的反向设计（重文抑武）使边疆—军事力长期不足，联金灭辽外交误判后汴京陷落。口径：《宋史·徽宗本纪》《钦宗本纪》；兵力数字〔存疑〕。',
    hook: '北宋末年，宋廷以<b>联金灭辽</b>外交策略试图收复燕云，但<b>军事力不足</b>（重文抑武、兵制积弱）使开封无可靠防务；1127 年<b>靖康之变</b>，徽钦二帝被俘、汴京陷落，北宋灭亡——这是 SJ-08 五代「过度矫正」的直接后果，也是积弱总清算。',
    year: '系年：靖康元年（1126）金军围汴 · 靖康二年（1127）二帝北狩 · 出处《宋史·徽宗本纪》《钦宗本纪》',
    phase: '崩解期 · 北宋终结',
    phaseNote: '北宋末处于<strong>崩解期</strong>——边疆军事力不足（积弱）+ 外交误判 + 财政汲取（岁币）叠加。在 SJ-04 相位盘落于「崩解期·军事力不足型」。与 SJ-08 五代构成因果链。',
    sliceTitle: '结构切片 · 靖康之耻',
    sliceNote: '权力几何：徽宗/钦宗（空）→ 蔡京/童贯纵列 → 禁军（虚）→ 联金外交（误判）。军事力不足（朱红）为主轴，重文抑武为结构实因。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '徽宗 · 钦宗', sub: '合法性已空' },
      { id: 'dangzheng', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '蔡京 · 童贯', sub: '权臣 · 纵列' },
      { id: 'jinjun', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '金军 · 联金', sub: '外交误判 · 军事压制' },
      { id: 'jinjun2', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '禁军 · 积弱', sub: '重文抑武 · 虚' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '汴京 · 士绅 · 民众', sub: '崩解底盘' },
    ],
    forces: [
      ['财政汲取', '岁币 · 三冗', '岁币使财政长期承压；三冗（冗官冗兵冗费）侵蚀汲取力——但非靖康直接主因'],
      ['精英循环', '党争 · 权臣', '新旧党争、蔡京专权使精英循环内耗；无力协调军事外交'],
      ['合法性叙事', '「联金灭辽」', '收复燕云叙事驱动外交，但军事力不足以支撑——绩效与叙事落差'],
      ['边疆军事', '积弱 · 联金', '重文抑武使军事力长期不足；联金灭辽后金军直取汴京——主引燃力'],
      ['生态—人口基座', '—', '北宋人口峰值但军事承载力不足——基座与军事力错位〔人口存疑〕'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「误国奸臣」单因论——靖康是结构（积弱+外交误判）共振，非蔡童二人之罪。'],
      ['钱穆', '《国史大纲》', '强调宋对五代过度矫正致积弱；联金是外交战略失败。'],
      ['金观涛', '超稳定结构', '「过度矫正→下一周期病灶」的教科书——SJ-08 五代的直接后果。'],
      ['黄仁宇', '数目字管理', '宋有数目字管理进步，但军事组织未同步——文武失衡。'],
      ['西方汉学', 'Jingkang Incident', '学界共识：靖康是 Song military weakness 的总清算；与 SJ-08 构成因果链。〔存疑〕'],
    ],
    verdict: {
      ok: ['南宋偏安延续', '经济/文化峰值', '重文抑武的反向教训'],
      fail: ['北宋灭亡', '二帝北狩', '燕云未复'],
      open: '〔反事实〕若宋初即维持文武平衡，能否避免靖康？此为 SJ-08 过度矫正的反事实。',
    },
    mirror: {
      same: '军事力不足 + 外交误判；过度矫正的周期后果；合法性叙事与军事力落差。',
      diff: '现代国家有完整国防体系；但「对上一周期病灶的过度矫正→下一周期病灶」规律仍适用（→ SJ-08 五代）。',
    },
    xrefs: [
      ['./SJ-08.html', 'SJ-08 · 五代', '过度矫正因果链上游。'],
      ['./SJ-05.html', 'SJ-05 · 王安石', '北宋内政改革对照。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '崩解期·军事力不足型。'],
    ],
    prev: ['./SJ-39.html', 'SJ-39'],
    next: ['./SJ-49.html', 'SJ-49'],
  },
  {
    num: '49',
    badge: 'SJ-49 · 盛衰拐点案例卷 · 清',
    title: '康乾拐点',
    subtitle: '鼎盛隐性拐点 · 人口峰值 · 僵化预埋',
    dynasty: '清',
    dynastyId: 'qing',
    type: '拐点',
    zhupi: '朱批：康乾拐点是母本<strong>「鼎盛期隐性拐点」</strong>样本——五力尚在峰值，但刚性支出、人口逼近上限、精英俘获已在积累。口径：《清史稿·高宗本纪》、学界研究；人口数字〔存疑〕。',
    hook: '康雍乾三朝（1662—1796）为清帝国鼎盛期，但母本指出<strong>鼎盛期是最危险的相位</strong>——五力峰值与隐性拐点叠合：人口逼近马尔萨斯天花板〔存疑〕、刚性支出（军费+河工+皇室）开始积累、文字狱与精英俘获萌芽。康乾是「盛极」与「转衰」的同一时点，为嘉道衰变与鸦片战争预埋结构。',
    year: '系年：康熙元年（1662）即位 · 乾隆六十年（1795）禅位 · 出处《清史稿·圣祖本纪》《高宗本纪》及学界研究',
    phase: '鼎盛期 · 隐性拐点',
    phaseNote: '康乾处于<strong>鼎盛期</strong>——五力峰值，但拐点隐性。在 SJ-04 相位盘落于「鼎盛期·隐性拐点」。与 SJ-38 贞观、SJ-06 开元构成「盛世拐点」三角对照。',
    sliceTitle: '结构切片 · 康乾拐点',
    sliceNote: '权力几何：康雍乾皇权 → 军机处纵列 → 摊丁入亩/改土归流下行 → 士绅/旗人底盘。峰值（赭金）与隐性拐点（朱批）叠合。',
    svgNodes: [
      { id: 'huangquan', x: 320, y: 112, w: 180, h: 46, color: 'ochre', label: '康雍乾 · 皇权', sub: '鼎盛 · 峰值' },
      { id: 'junjichu', x: 130, y: 250, w: 176, h: 60, color: 'celadon', label: '军机处', sub: '集权纵列 · 效率' },
      { id: 'shishen', x: 462, y: 250, w: 186, h: 60, color: 'vermil', label: '文字狱 · 俘获', sub: '精英循环 · 拐点' },
      { id: 'tanding', x: 132, y: 372, w: 176, h: 50, color: 'paper', label: '摊丁入亩', sub: '汲取峰值 · 下行' },
      { id: 'base', x: 56, y: 486, w: 708, h: 86, color: 'ink', label: '人口 · 耕地 · 旗地', sub: '基座逼近上限' },
    ],
    forces: [
      ['财政汲取', '摊丁入亩', '雍正摊丁入亩使汲取力达峰值；但刚性支出（河工+军费）开始积累'],
      ['精英循环', '文字狱 · 旗籍', '文字狱使精英俘获萌芽；旗籍通道与科举并行但固化'],
      ['合法性叙事', '「盛世」修书', '绩效合法性充盈，但象征通胀（四库全书、南巡）开始积累'],
      ['边疆军事', '改土归流 · 准噶尔', '军事力扩张至峰值；但维持成本高昂'],
      ['生态—人口基座', '—', '人口逼近承载上限〔学界估计 3–4 亿，存疑〕——慢变量拐点与快变量峰值叠合'],
    ],
    historians: [
      ['李敖式考据', '祛魅', '剥离「康乾盛世」道德书写——峰值与拐点叠合，非单纯明君叙事。'],
      ['钱穆', '《国史大纲》续论', '对清前期持复杂态度；指出人口压力与制度僵化已埋伏笔。'],
      ['金观涛', '超稳定结构', '鼎盛期隐性拐点的标准样本——超稳定结构在峰值时已开始失修。'],
      ['黄仁宇', '数目字管理', '清前期数目字管理达传统峰值（摊丁入亩、银两财政），但未能突破农业帝国天花板。'],
      ['西方汉学', 'High Qing', '学界对「康乾盛世」有重新评估（peak vs turning point）；人口压力是关键变量。〔存疑〕'],
    ],
    verdict: {
      ok: ['疆域峰值', '摊丁入亩遗产', '数目字管理峰值'],
      fail: ['隐性拐点未识别', '人口压力积累', '嘉道衰变预埋'],
      open: '〔未决〕若康乾即启动近代化改革，能否突破农业帝国天花板？此为 SJ-14 洋务的上游反事实。',
    },
    mirror: {
      same: '鼎盛期隐性拐点；五力峰值与结构失修同步；人口/基座慢变量逼近上限。',
      diff: '现代已有工业化与数目字管理突破农业天花板；但「盛世=最危险相位」的读法仍值得对照（→ SJ-38 贞观、SJ-06 开元）。',
    },
    xrefs: [
      ['./SJ-38.html', 'SJ-38 · 贞观', '盛世拐点三角对照。'],
      ['./SJ-14.html', 'SJ-14 · 洋务', '嘉道衰变下游；近代化局部修复。'],
      ['./SJ-04.html', 'SJ-04 · 相位盘', '鼎盛期·隐性拐点定位。'],
    ],
    prev: ['./SJ-41.html', 'SJ-41'],
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
  const typeNote = c.type === '变法' ? '财政/制度重建 vs 既得利益'
    : c.type === '崩解' ? '多力共振 · 崩解链'
    : c.type === '拐点' ? '鼎盛隐性拐点 · 峰值叠合'
    : c.type === '修复' || c.type === '盛世' ? '基座修复 · 五力协同'
    : '结构实因 · 相位定位';
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
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,serif">朱批：${typeNote}</text>
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
  <a class="sj-rail-chip" href="./SJ-03.html">SJ-03 五力</a>
  <a class="sj-rail-chip" href="./SJ-04.html">SJ-04 相位盘</a>
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
- 交叉引用：见 HTML §◆；SJ-03 五力 / SJ-04 相位盘

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

console.log('Done:', CASES.length, 'Round 2 case volumes');
