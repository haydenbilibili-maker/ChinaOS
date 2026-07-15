/**
 * Case-specific structure-slice geometries — true source: docs/shijian/结构切片几何规格.md
 * Do NOT clone SJ-05 vertical-axis template across cases; read spec §0–§1 before regenerating.
 */
import { buildSvg, nodeRect, nodeBase, nodeCircle, stripUnusedMarkers } from './sj-premium-slice.mjs';
import { POLISH_SLICE_CONFIGS } from './sj-slice-polish-r2.mjs';

export const GEOMETRY_SPEC_VERSION = '1.0';
export const FORBIDDEN_CLONE_MOTIF = 'wang-anshi-vertical-spine';

/** Type → allowed motif (§0) */
export const SLICE_MOTIF_BY_TYPE = {
  bianfa: 'case-specific — never default vertical spine',
  bengjie: 'convergent resonance / encirclement',
  junzhan: 'two-army confrontation + decisive point',
  zhidu: 'long-duration curve open→solidified',
  guaidian: 'case-specific',
  shangsheng: 'five-force synergy + buried risk',
};

export const GEOMETRY_SLICE_CONFIGS = {
  '09': {
    prefix: 'sj-09',
    prose: '权力几何——<strong>考成 × 清丈 双网格</strong>：张居正以首辅实权、幼帝万历摄政背书，织两张网——考成法问责网格穿透官僚层、清丈网格覆于土地清查隐田，两网合力把税基统合为一条鞭折银。士绅—隐田地主抵制清丈；居正身后（1582）遭清算，然一条鞭作为制度部分延续。',
    railSummary: '考成×清丈双网格 → 士绅抵制隐田 → 1582 身后清算，一条鞭部分延续。',
    legend: '色义：万历=赭金虚线 · 张居正=青瓷 · 双网格=赭金 # 线 · 士绅=朱红 · 底盘=深墨。双网格≠王安石竖轴；一条鞭部分延续为与 SJ-05 关键差异。',
    nodeData: {
      wanli: { name: '万历 · 幼帝', tag: '合法性 · 摄政脆弱', body: '万历初年幼帝，张居正以首辅摄政强力主导；万历十年（1582）居正卒，皇权反转、改革遭清算。' },
      zhangjuzheng: { name: '张居正 · 首辅', tag: '技术官僚 · 穿透', body: '以首辅实权 + 考成法穿透官僚，清丈田亩、一条鞭折银，短中期充盈国库、缓解边饷——改革引擎。' },
      kaocheng: { name: '考成法 · 问责网格', tag: '精英控制工具', body: '以考成法层层考核问责官僚、压制惰政，把中枢意志织成穿透官僚层的问责网格——张居正区别于王安石的独有工具。' },
      qingzhang: { name: '清丈 · 丈量网格', tag: '汲取重建', body: '丈量全国田亩、清查隐田，把税基从分散人头/项目统合为资产；一条鞭折银的前提。' },
      shishen: { name: '士绅 · 隐田地主', tag: '精英抵制 · 死穴', body: '清丈直接触动士绅—地主的隐田特权，形成强烈反弹；居正身后遭舆论清算，人亡政息。' },
      yitiaobian: { name: '一条鞭 · 折银底盘', tag: '汲取产物 · 部分延续', body: '赋役折银、统合征调；虽居正身后遭清算，一条鞭作为制度部分延续——不同于王安石之全废。' },
    },
    nodeEdge: {
      wanli: ['beishu'], zhangjuzheng: ['beishu', 'drive-kc', 'drive-qz', 'rebound'],
      kaocheng: ['drive-kc'], qingzhang: ['drive-qz', 'output', 'resist'],
      shishen: ['resist', 'rebound'], yitiaobian: ['output'],
    },
    svg: () => buildSvg({
      title: '张居正一条鞭法 · 考成清丈双网格结构切片图',
      desc: '万历虚线背书张居正；考成与清丈双网格合力下行至一条鞭折银底盘；士绅抵制清丈后以朱红回路反扑。',
      header: '结构切片 · 一条鞭法',
      sub: 'SJ-09 · 张居正改革 · 步骤①',
      zhupi: '朱批：考成×清丈双网格 · 士绅抵制隐田 → 1582 身后清算 · 一条鞭部分延续',
      edges: `
    <path class="sj-edge" data-edge="beishu" d="M360,156 C280,182 240,196 224,214" stroke="var(--sj-ochre)" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="drive-kc" d="M226,224 L298,232" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="drive-qz" d="M226,252 L298,330" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="resist" d="M566,308 L502,336" stroke="var(--sj-vermil)" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="output" d="M400,378 L410,416" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="rebound" d="M600,326 C420,344 260,268 224,244" stroke="var(--sj-vermil)" stroke-width="3.4" marker-end="url(#a-vermil)" opacity="0.95"/>`,
      edgeLabels: `
    <text x="250" y="192" fill="var(--sj-ochre)">摄政背书 · 1582抽走</text>
    <text x="520" y="322" fill="var(--sj-vermil)">抵制清丈</text>
    <text x="424" y="404" fill="var(--sj-ochre)">折银汲取</text>
    <text x="330" y="270" fill="var(--sj-vermil)" font-size="12" font-weight="600">身后清算 · 人亡政息</text>`,
      nodes: `
${nodeRect('wanli', 310, 110, 200, 46, 'var(--sj-ochre)', '万历 · 幼帝', '摄政合法性 · 脆弱', { dash: '5 4', sw: '1.6' })}
${nodeRect('zhangjuzheng', 56, 206, 170, 60, 'var(--sj-celadon)', '张居正 · 首辅', '首辅实权 · 穿透', { sw: '2.6' })}
  <g class="sj-node" data-id="kaocheng" tabindex="0" role="button" aria-label="考成法 问责网格">
    <rect x="300" y="196" width="200" height="76" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2"/>
    <line x1="366" y1="200" x2="366" y2="268" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.3"/>
    <line x1="434" y1="200" x2="434" y2="268" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.3"/>
    <line x1="304" y1="234" x2="496" y2="234" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.25"/>
    <text x="400" y="222" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">考成法 · 问责网格</text>
    <text x="400" y="258" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">考核官僚 · 压惰政</text>
  </g>
  <g class="sj-node" data-id="qingzhang" tabindex="0" role="button" aria-label="清丈 丈量网格">
    <rect x="300" y="300" width="200" height="76" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2"/>
    <line x1="366" y1="304" x2="366" y2="372" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.3"/>
    <line x1="434" y1="304" x2="434" y2="372" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.3"/>
    <line x1="304" y1="338" x2="496" y2="338" stroke="var(--sj-ochre)" stroke-width="0.6" opacity="0.25"/>
    <text x="400" y="326" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">清丈 · 丈量网格</text>
    <text x="400" y="362" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">丈量隐田 · 扩税基（1581）</text>
  </g>
${nodeRect('shishen', 566, 250, 196, 76, 'var(--sj-vermil)', '士绅 · 隐田地主', '抵制清丈 · 死穴', { dash: '5 4', sw: '2.4' })}
  <g class="sj-node" data-id="yitiaobian" tabindex="0" role="button" aria-label="一条鞭 折银 底盘">
    <rect x="56" y="420" width="708" height="86" rx="6" fill="url(#sj-base)" stroke="var(--sj-line)" stroke-width="1.4"/>
    <text x="410" y="450" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="Songti SC,serif">一条鞭 · 赋役折银 · 编户底盘</text>
    <text x="410" y="470" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">两网合力→折银汲取 · 转嫁基层结构未变</text>
    <text x="410" y="490" text-anchor="middle" fill="var(--sj-celadon)" font-size="10" font-family="Songti SC,serif">身后一条鞭部分延续 —— 不同于王安石之全废</text>
  </g>`,
      footer: 'viewBox 820×600 · 考成清丈双网格',
    }),
  },

  '10': {
    prefix: 'sj-10',
    prose: '权力几何——中央「京师·崇祯」被<strong>四力向心合围</strong>：基座(小冰期大旱)与财政(三饷)双引燃，边疆(后金辽东)与精英(东林阉党党争)同时施压，四力经三饷枢纽汇聚；流民李自成破京(1644)。箭头一律向心汇聚，非竖轴、非天宝旧 id。',
    railSummary: '四力合围京师 · 三饷枢纽 · 1644 易代。',
    legend: '色义：京师=赭金虚线 · 三饷=赭金枢纽圆 · 基座/边疆/流民=朱红向心 · 党争=青瓷。合围箭头向心，禁止竖轴纵列。',
    nodeData: {
      jingshi: { name: '京师 · 崇祯', tag: '中央被围 · 虚弱', body: '勤政未能转化为救灾与军事绩效；合法性叙事与亡国结局撕裂——被四力合围的虚线中央。' },
      xiaobingqi: { name: '小冰期 · 大旱', tag: '基座慢变量 · 引燃①', body: '气候异常叠加灾荒，基座承载力崩溃，流民膨胀——与财政越阈同步引燃。' },
      sanxiang: { name: '三饷 · 财政枢纽', tag: '汲取越阈 · 变压器', body: '辽饷、剿饷、练饷加派越过民变阈值，财政枢纽把边疆军费与内乱镇压耦合并轨。' },
      houjin: { name: '后金 · 辽东', tag: '边疆军事 · 外压', body: '辽东军费吞噬财政，与三饷形成死亡螺旋；外压与内崩同步。' },
      dangzheng: { name: '东林 · 阉党', tag: '精英内耗', body: '党争堵塞精英循环，中枢无法有效纠偏——与财政、基座压力共振。' },
      liukou: { name: '流民 · 李自成', tag: '内崩 · 引燃②', body: '灾荒—加派—流亡链引爆；1644 破京，明亡——合围的最终击穿点。' },
    },
    nodeEdge: {
      jingshi: ['hub'], xiaobingqi: ['ignite-base', 'conv1'], sanxiang: ['hub', 'conv1', 'conv2', 'conv3'],
      houjin: ['conv2'], dangzheng: ['conv3'], liukou: ['ignite-liu', 'conv4'],
    },
    svg: () => buildSvg({
      title: '崇祯易代 · 四力共振合围结构切片图',
      desc: '京师崇祯虚弱居中；小冰期、三饷、后金、党争、流民五向箭头经三饷枢纽向心合围中央。',
      header: '结构切片 · 四力合围',
      sub: 'SJ-10 · 崇祯易代 · 步骤①',
      zhupi: '朱批：基座(小冰期)+财政(三饷)双引燃 · 边疆后金 · 精英党争 · 四力共振合围京师',
      edges: `
    <path class="sj-edge" data-edge="conv1" d="M133,280 C220,300 300,290 360,280" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv2" d="M677,280 C580,285 480,285 460,280" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv3" d="M410,200 C410,220 410,240 410,252" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="conv4" d="M410,420 C410,380 410,340 410,318" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="ignite-base" d="M133,310 L133,280" stroke="var(--sj-vermil)" stroke-width="1.6" marker-end="url(#a-vermil)" opacity="0.7"/>
    <path class="sj-edge" data-edge="ignite-liu" d="M300,452 L360,420" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="hub" d="M410,252 L410,268" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.8"/>`,
      edgeLabels: `
    <text x="240" y="268" fill="var(--sj-vermil)">基座引燃</text>
    <text x="580" y="268" fill="var(--sj-vermil)">辽饷外压</text>
    <text x="430" y="218" fill="var(--sj-celadon)">党争内耗</text>
    <text x="430" y="400" fill="var(--sj-vermil)" font-size="12" font-weight="600">1644 破京</text>`,
      nodes: `
${nodeRect('jingshi', 310, 118, 200, 46, 'var(--sj-ochre)', '京师 · 崇祯', '中央被围 · 虚弱', { dash: '5 4', sw: '1.4' })}
${nodeRect('xiaobingqi', 52, 252, 162, 72, 'var(--sj-vermil)', '小冰期 · 大旱', '基座慢变量 · 引燃', { sw: '2.4' })}
${nodeCircle('sanxiang', 410, 290, 40, 'var(--sj-ochre)', '三饷 · 财政枢纽', '汲取越阈 · 变压器')}
${nodeRect('houjin', 586, 252, 182, 72, 'var(--sj-vermil)', '后金 · 辽东', '边疆军事 · 外压', { sw: '2.8' })}
${nodeRect('dangzheng', 310, 168, 200, 46, 'var(--sj-celadon)', '东林 · 阉党', '精英内耗 · 党争')}
${nodeRect('liukou', 300, 420, 220, 52, 'var(--sj-vermil)', '流民 · 李自成', '内崩引爆 · 破京', { sw: '2.6' })}`,
      footer: 'viewBox 820×600 · 四力合围',
    }),
  },

  '11': {
    prefix: 'sj-11',
    prose: '权力几何——<strong>通道置换</strong>：军功爵化作上升阶梯（寒门→斩首授爵→田宅→爵位），从编户耕战底盘拾级而上；「斩」箭头斩断右上「世卿世禄」世袭通道。死穴：孝公卒（前338）→ 世卿反扑 → 车裂。',
    railSummary: '孝公背书 → 军功爵阶梯斩断世卿 → 前338 车裂。',
    legend: '色义：孝公=赭金虚线 · 商鞅=青瓷 · 军功爵阶梯=赭金签名 · 世卿=朱红 · 连坐=灰 · 底盘=深墨。阶梯+斩断=通道置换，非王安石竖轴。',
    nodeData: {
      xiaogong: { name: '秦孝公', tag: '合法性背书 · 虚线', body: '变法依赖孝公个人权威；前338 孝公卒，商鞅遭车裂。' },
      shangyang: { name: '商鞅', tag: '变法引擎', body: '废井田、开阡陌，推行县制、连坐法，以军功爵打开精英通道——把秦国改造成高动员战争—农业国家。' },
      jueti: { name: '军功爵阶梯', tag: '签名 · 通道开放', body: '斩首授爵、累进田宅——寒门/士兵沿阶梯上升，财政与军事动员合一。' },
      shiqing: { name: '世卿世禄', tag: '世袭通道 · 被斩断', body: '旧贵族世袭特权遭摧毁性打击；孝公身后反扑，商鞅车裂——通道置换的死穴。' },
      lianzuo: { name: '连坐什伍', tag: '合法性工具', body: '以严刑峻法替代周礼秩序，短期强化服从，长期积累民怨。' },
      base: { name: '编户耕战底盘', tag: '农战基座', body: '农战体制下的税收与兵役来源，承受严刑峻法的高压——承托一切汲取与动员。' },
    },
    nodeEdge: {
      xiaogong: ['back'], shangyang: ['back', 'ladder', 'cut'], jueti: ['ladder', 'cut', 'down'],
      shiqing: ['cut', 'rebound'], lianzuo: ['down'], base: ['down', 'rebound'],
    },
    svg: () => buildSvg({
      title: '商鞅变法 · 军功爵通道置换结构切片图',
      desc: '军功爵阶梯自编户耕战底盘上升；斩首箭头斩断世卿世禄世袭通道；孝公虚线背书。',
      header: '结构切片 · 通道置换',
      sub: 'SJ-11 · 商鞅变法 · 步骤①',
      zhupi: '朱批：军功爵阶梯斩断世卿世禄＝通道置换 · 死穴在孝公卒后车裂',
      edges: `
    <path class="sj-edge" data-edge="back" d="M320,158 L220,220" stroke="var(--sj-ochre)" stroke-width="1.6" stroke-dasharray="6 5" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="ladder" d="M220,280 L280,340 L340,400 L400,440" stroke="var(--sj-ochre)" stroke-width="2.6" marker-end="url(#a-ochre)" opacity="0.95"/>
    <path class="sj-edge" data-edge="cut" d="M400,360 L580,220" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down" d="M280,440 L410,486" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="rebound" d="M580,260 C520,180 400,150 320,158" stroke="var(--sj-vermil)" stroke-width="2.4" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.8"/>`,
      edgeLabels: `
    <text x="260" y="200" fill="var(--sj-ochre)">前338 孝公卒</text>
    <text x="320" y="400" fill="var(--sj-ochre)">寒门→爵位</text>
    <text x="500" y="280" fill="var(--sj-vermil)" font-size="12" font-weight="600">斩 · 世卿通道</text>
    <text x="480" y="180" fill="var(--sj-vermil)">反扑 → 车裂</text>`,
      nodes: `
${nodeRect('xiaogong', 320, 112, 180, 46, 'var(--sj-ochre)', '秦孝公', '背书 · 虚线', { dash: '5 4', sw: '1.8' })}
${nodeRect('shangyang', 130, 220, 176, 60, 'var(--sj-celadon)', '商鞅', '变法引擎 · 县制')}
  <g class="sj-node" data-id="jueti" tabindex="0" role="button" aria-label="军功爵阶梯">
    <rect x="260" y="300" width="200" height="120" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2.4"/>
    <line x1="280" y1="400" x2="440" y2="320" stroke="var(--sj-ochre)" stroke-width="1.2" opacity="0.5"/>
    <line x1="280" y1="360" x2="400" y2="300" stroke="var(--sj-ochre)" stroke-width="1" opacity="0.35"/>
    <text x="360" y="340" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">军功爵阶梯</text>
    <text x="360" y="360" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">斩首授爵 · 累进田宅</text>
  </g>
${nodeRect('shiqing', 564, 200, 186, 72, 'var(--sj-vermil)', '世卿世禄', '世袭通道 · 被斩', { sw: '3' })}
${nodeRect('lianzuo', 130, 360, 120, 50, 'var(--sj-paper-300)', '连坐什伍', '严刑 · 什伍', { sw: '1.6' })}
${nodeBase('base', '编户耕战底盘', '承托汲取与动员 · 承受严刑高压', '')}`,
      footer: 'viewBox 820×600 · 通道置换',
    }),
  },

  '13': {
    prefix: 'sj-13',
    prose: '权力几何——<strong>理想与现实的断层</strong>：顶部「复古蓝图」(王田/周礼/五均六筦) 自上强加；中部锯齿断层线分隔理想/现实——错位；现实层为豪族兼并(死穴)+币制屡改；灾荒叠加→编户流民→赤眉绿林→新莽亡(23)。',
    railSummary: '复古蓝图压现实 → 币制紊乱 · 豪族死穴 → 新莽速亡。',
    legend: '色义：王莽=赭金虚线 · 蓝图=青瓷 · 断层=朱红锯齿 · 豪族=朱红 · 流民=灰 · 底盘=深墨。断层线=签名，非竖轴。',
    nodeData: {
      wangmang: { name: '王莽', tag: '篡位 · 脆弱合法性', body: '禅让叙事难掩篡汉污名；始建国元年（9）代汉（《汉书·王莽传》）。' },
      lantu: { name: '复古蓝图', tag: '理想层 · 周礼', body: '王田、私属、五均六筦等托古改制蓝图——以儒家乌托邦话语包装财政—土地重整。' },
      duanceng: { name: '错位断层', tag: '签名 · 理想/现实', body: '复古蓝图压在现实结构上——执行错位，改革失去同意基础。' },
      bizhi: { name: '币制屡改', tag: '财政紊乱', body: '刀布→大钱→货泉降值螺旋，加剧民怨与市场混乱。' },
      haoqiang: { name: '豪族兼并', tag: '精英抵制 · 死穴', body: '土地兼并利益集团强烈反弹，是改制真正的结构死穴。' },
      minluan: { name: '流民→赤眉绿林', tag: '崩解引爆', body: '灾荒与改制失败叠加，武装起义夺「天命」话语。' },
      base: { name: '编户齐民底盘', tag: '承受改制混乱', body: '编户承受改制混乱与灾荒双重压力——基座引燃。' },
    },
    nodeEdge: {
      wangmang: ['down'], lantu: ['down', 'fault'], duanceng: ['fault'],
      bizhi: ['fault', 'ignite'], haoqiang: ['fault', 'rebound'], minluan: ['ignite'], base: ['down', 'ignite'],
    },
    svg: () => buildSvg({
      title: '王莽改制 · 理想现实断层结构切片图',
      desc: '复古蓝图自上强加；锯齿断层分隔理想与现实；豪族兼并与币制紊乱引燃流民起义。',
      header: '结构切片 · 理想断层',
      sub: 'SJ-13 · 王莽改制 · 步骤①',
      zhupi: '朱批：复古蓝图压在现实结构上→错位 · 币制屡改致紊乱 · 灾荒民变引爆速亡',
      edges: `
    <path class="sj-edge" data-edge="down" d="M410,158 L410,220" stroke="var(--sj-ochre)" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#a-ochre)" opacity="0.8"/>
    <path class="sj-edge" data-edge="fault" d="M410,220 L410,300" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="rebound" d="M580,360 C640,280 520,180 410,158" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="ignite" d="M410,420 L410,486" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)" opacity="0.85"/>`,
      edgeLabels: `
    <text x="430" y="200" fill="var(--sj-ochre)">禅让包装 · 篡汉</text>
    <text x="430" y="268" fill="var(--sj-vermil)" font-size="12" font-weight="600">★ 错位断层</text>
    <text x="600" y="320" fill="var(--sj-vermil)">豪族死穴</text>`,
      nodes: `
${nodeRect('wangmang', 320, 112, 180, 46, 'var(--sj-ochre)', '王莽', '篡位合法性', { dash: '5 4', sw: '1.6' })}
  <g class="sj-node" data-id="lantu" tabindex="0" role="button" aria-label="复古蓝图">
    <rect x="280" y="168" width="260" height="52" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2"/>
    <line x1="290" y1="182" x2="530" y2="182" stroke="var(--sj-celadon)" stroke-width="0.5" opacity="0.3"/>
    <line x1="290" y1="198" x2="530" y2="198" stroke="var(--sj-celadon)" stroke-width="0.5" opacity="0.3"/>
    <text x="410" y="192" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-weight="600" font-family="Songti SC,serif">复古蓝图 · 王田周礼</text>
    <text x="410" y="210" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">五均六筦 · 理想层</text>
  </g>
  <g class="sj-node" data-id="duanceng" tabindex="0" role="button" aria-label="错位断层">
    <path d="M120,280 L200,260 L280,290 L360,250 L440,285 L520,255 L600,275 L680,265" fill="none" stroke="var(--sj-vermil)" stroke-width="2.8"/>
    <text x="410" y="248" text-anchor="middle" fill="var(--sj-vermil)" font-size="13" font-weight="600" font-family="Songti SC,serif">错位断层 · 签名</text>
  </g>
${nodeRect('bizhi', 130, 320, 160, 50, 'var(--sj-celadon)', '币制屡改', '刀布→货泉 · 紊乱')}
${nodeRect('haoqiang', 530, 320, 186, 60, 'var(--sj-vermil)', '豪族兼并', '死穴 · 抵制', { sw: '3' })}
${nodeRect('minluan', 310, 380, 200, 56, 'var(--sj-vermil)', '流民→赤眉绿林', '起义 · 夺天命', { sw: '2.4' })}
${nodeBase('base', '编户齐民底盘', '承受改制混乱与灾荒', '')}`,
      footer: 'viewBox 820×600 · 理想断层',
    }),
  },

  '31': {
    prefix: 'sj-31',
    prose: '权力几何：<strong>袁绍北方资源盘</strong>（冀青幽并）对垒<strong>曹操中枢+精锐</strong>；乌巢粮道为机制链枢纽，许都中枢维系曹军持续作战。两军对峙+决胜点几何（非竖轴）。',
    railSummary: '袁曹对峙 → 乌巢奇袭 → 200 北方锁定。',
    legend: '色义：袁绍=赭金资源盘 · 曹操=朱红精锐 · 乌巢=朱红决胜点 · 许都=青瓷合法性 · 底盘=深墨。战役几何：两军对峙+粮道枢纽。',
    nodeData: {
      yuanshao: { name: '袁绍 · 北方', tag: '资源占优', body: '据北方四州，士众数十万〔存疑〕，税基与兵源占优；但指挥链分散、谋士谏言不被采纳。' },
      caocao: { name: '曹操 · 精锐', tag: '组织胜出', body: '兵少而精，屯田制支撑后勤；许攸投曹提供乌巢情报，决策链灵活。' },
      wuchao: { name: '乌巢 · 粮道', tag: '机制枢纽 · 决胜点', body: '淳于琼守乌巢，曹操亲率精兵焚粮——袁绍军心溃散的结构引爆点。' },
      xudu: { name: '许都 · 中枢', tag: '合法性', body: '曹操奉天子都许，增强「讨逆」名义；袁绍错失政治牌。' },
      guandu: { name: '官渡 · 200', tag: '时点 · 对峙', body: '建安五年主战场；袁军连营而曹军固守，僵持至乌巢一击逆转。' },
      jingying: { name: '谋士链', tag: '精英循环', body: '田丰、沮授主缓战不被听；许攸叛袁——精英循环断裂的战场表现。' },
      base: { name: '河北 · 兖豫基座', tag: '底盘', body: '河北经战乱仍富；兖豫经曹操屯田修复。基座优势需经军事组织转化。〔人口数字存疑〕' },
    },
    nodeEdge: {
      yuanshao: ['e1', 'e3'], caocao: ['e2', 'e4'], wuchao: ['e1', 'e2', 'e5'],
      xudu: ['e4'], guandu: ['e3'], jingying: ['e3', 'e2'], base: ['e5'],
    },
    svg: () => buildSvg({
      title: '官渡之战 · 两军对峙结构切片图',
      desc: '袁绍北方资源盘对垒曹操精锐；乌巢粮道奇袭为决胜点；许都支撑曹家中枢。',
      header: '结构切片 · 官渡之战',
      sub: 'SJ-31 · 三国 · 军事决战',
      zhupi: '朱批：资源盘≠效能 · 乌巢粮道=机制枢纽 · 组织度决胜',
      edges: `
    <path class="sj-edge" data-edge="e1" d="M156,212 L410,250" stroke="var(--sj-ochre)" stroke-width="2.2" stroke-dasharray="6 5" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="e2" d="M664,212 L410,285" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="e3" d="M156,212 L220,360" stroke="var(--sj-ochre)" stroke-width="1.8" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="e4" d="M664,316 L410,320" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="e5" d="M410,320 L410,452" stroke="var(--sj-line)" stroke-width="1.6" marker-end="url(#a-paper)" opacity="0.7"/>`,
      edgeLabels: `
    <text x="280" y="228" text-anchor="middle" fill="var(--sj-ochre)">资源→粮道</text>
    <text x="540" y="248" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">奇袭焚粮</text>
    <text x="540" y="310" text-anchor="middle" fill="var(--sj-celadon)">许都支撑</text>`,
      nodes: `
${nodeRect('yuanshao', 56, 126, 200, 86, 'var(--sj-ochre)', '袁绍 · 北方', '冀青幽并 · 资源盘', { sw: '2.4' })}
${nodeRect('caocao', 564, 126, 200, 86, 'var(--sj-vermil)', '曹操 · 精锐', '唯才是举 · 组织度', { sw: '2.4' })}
${nodeRect('wuchao', 310, 250, 200, 70, 'var(--sj-vermil)', '乌巢 · 粮道', '建安五年 · 奇袭', { sw: '2.4' })}
${nodeRect('xudu', 564, 250, 200, 70, 'var(--sj-celadon)', '许都 · 中枢', '挟天子 · 合法性', { sw: '2.4' })}
${nodeRect('guandu', 130, 360, 180, 56, 'var(--sj-vermil)', '官渡 · 200', '对峙 · 决战', { sw: '2.4' })}
${nodeRect('jingying', 340, 360, 140, 56, 'var(--sj-celadon)', '谋士链', '田丰 · 许攸', { sw: '2.4' })}
${nodeBase('base', '河北 · 兖豫基座', '税基广 vs 屯田稳', '')}`,
      footer: 'viewBox 820×600 · 官渡',
    }),
  },

  '32': {
    prefix: 'sj-32',
    prose: '权力几何——<strong>制度长时段曲线</strong>：220 创制初开放（陈群·中正官）→ 沿曲线右移 → 门阀固化「上品无寒门」。青瓷为制度轨迹，朱批为门阀化逆流。非竖轴纵列。',
    railSummary: '九品创制 → 中正官 → 门阀固化。',
    legend: '色义：皇权=赭金 · 制度曲线=青瓷（左开右固）· 门阀=朱红锁死 · 寒门=灰 · 底盘=深墨。横轴=时间，曲线上升后折向固化。',
    nodeData: {
      huangquan: { name: '曹丕 · 魏文帝', tag: '220 授权', body: '曹丕代汉后授权陈群创制九品——重建崩解后的选官秩序。' },
      chenqun: { name: '陈群 · 创制', tag: '制度开放端', body: '奏置九品中正，本意「选贤与能」——曲线起点。' },
      zhongzheng: { name: '中正官', tag: '评定枢纽', body: '按家世德才品第士人，作为选官依据——制度执行节点。' },
      menfa: { name: '门阀 · 势族', tag: '固化端 · 死穴', body: '迅速门阀化，「上品无寒门，下品无势族」——曲线右端锁死。' },
      hanshi: { name: '寒门士人', tag: '通道收窄', body: '寒门上升通道被品第制度结构性收窄。' },
      xuanju: { name: '选官 · 仕途', tag: '品第→官职', body: '品第决定仕途，门阀互评固化利益。' },
      base: { name: '宗族 · 土地底盘', tag: '门阀依附', body: '门阀依附土地与宗族网络固化基层控制。' },
    },
    nodeEdge: {
      huangquan: ['c1'], chenqun: ['c1', 'c2'], zhongzheng: ['c2', 'c3', 'c4'],
      menfa: ['c3', 'c5'], hanshi: ['c4'], xuanju: ['c3'], base: ['c5'],
    },
    svg: () => buildSvg({
      title: '九品中正制 · 制度曲线结构切片图',
      desc: '220 创制开放端沿曲线右移至门阀固化；中正官为枢纽；寒门通道收窄。',
      header: '结构切片 · 制度曲线',
      sub: 'SJ-32 · 魏晋 · 制度演变',
      zhupi: '朱批：初开放→终固化 · 门阀化逆流＝曲线右端锁死',
      edges: `
    <path class="sj-edge" data-edge="c1" d="M120,380 C200,340 280,300 360,260" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="c2" d="M360,260 C440,240 500,250 520,280" stroke="var(--sj-celadon)" stroke-width="2.6" marker-end="url(#a-celadon)" opacity="0.95"/>
    <path class="sj-edge" data-edge="c3" d="M520,280 C600,300 660,340 700,380" stroke="var(--sj-vermil)" stroke-width="3" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="c4" d="M360,260 L218,400" stroke="var(--sj-paper-300)" stroke-width="1.6" stroke-dasharray="4 4" marker-end="url(#a-paper)" opacity="0.75"/>
    <path class="sj-edge" data-edge="c5" d="M700,380 L410,486" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path d="M100,400 C240,320 400,220 560,240 C680,260 740,340 760,400" fill="none" stroke="var(--sj-line)" stroke-width="1" stroke-dasharray="4 6" opacity="0.5"/>`,
      edgeLabels: `
    <text x="200" y="320" fill="var(--sj-celadon)">220 创制 · 开放</text>
    <text x="480" y="230" fill="var(--sj-celadon)">中正官枢纽</text>
    <text x="660" y="340" fill="var(--sj-vermil)" font-size="12" font-weight="600">门阀固化</text>
    <text x="180" y="420" fill="var(--sj-paper-300)">寒门收窄</text>`,
      nodes: `
${nodeRect('huangquan', 56, 360, 160, 46, 'var(--sj-ochre)', '曹丕 · 魏文帝', '220 授权')}
${nodeRect('chenqun', 280, 280, 160, 56, 'var(--sj-celadon)', '陈群 · 创制', '九品奏议 · 开放端')}
${nodeRect('zhongzheng', 480, 240, 180, 64, 'var(--sj-celadon)', '中正官', '品第评定 · 枢纽', { sw: '2.6' })}
${nodeRect('menfa', 640, 320, 186, 64, 'var(--sj-vermil)', '门阀 · 势族', '上品无寒门 · 锁死', { sw: '3' })}
${nodeRect('hanshi', 130, 400, 176, 50, 'var(--sj-paper-300)', '寒门士人', '通道收窄', { sw: '1.6' })}
${nodeRect('xuanju', 640, 240, 160, 56, 'var(--sj-ochre)', '选官 · 仕途', '品第→官职')}
${nodeBase('base', '宗族 · 土地底盘', '门阀依附基座', '')}`,
      footer: 'viewBox 820×600 · 制度曲线',
    }),
  },

  '33': {
    prefix: 'sj-33',
    prose: '权力几何：<strong>苻坚多民族大军</strong>（账面优势）→ 淝水对峙 → <strong>北府兵+谢玄</strong>触发士气链崩溃。两军对峙+决胜点；强调多民族拼凑军士气链脆弱（非竖轴）。',
    railSummary: '苻坚账面优势 → 淝水对峙 → 北府兵击溃。',
    legend: '色义：前秦=赭金账面 · 北府兵=朱红精锐 · 淝水=朱红决胜 · 谢安=青瓷中枢 · 士气链=朱批 · 底盘=深墨。',
    nodeData: {
      fujian: { name: '苻坚 · 前秦', tag: '账面优势', body: '多民族拼凑大军，「投鞭断流」式兵力误判〔存疑〕——账面优势≠战场效能。' },
      beifu: { name: '北府兵 · 谢玄', tag: '精锐 · 决胜', body: '东晋北府兵以少胜多，触发前秦军士气链崩溃。' },
      feishui: { name: '淝水 · 383', tag: '对峙 · 决胜点', body: '太元八年（383）淝水一战，前秦迅速崩解的结构引爆点。' },
      shiqichain: { name: '士气链崩溃', tag: '机制枢纽', body: '多民族军一旦前军溃退，后军连锁崩溃——组织度与士气链脆弱。' },
      xiean: { name: '谢安 · 中枢', tag: '合法性 · 稳局', body: '谢安稳局、谢玄督战——东晋中枢在危机中维持决策链。' },
      minzu: { name: '多民族军', tag: '拼凑 · 脆弱', body: '前秦军民族成分复杂，指挥链与士气同步性弱。' },
      base: { name: '江南 · 中原基座', tag: '底盘', body: '南北人口与资源基座不对称；效能取决于组织度而非账面。〔人口存疑〕' },
    },
    nodeEdge: {
      fujian: ['e1', 'e2'], beifu: ['e2', 'e3'], feishui: ['e1', 'e3', 'e4'],
      shiqichain: ['e2', 'e4'], xiean: ['e5'], minzu: ['e1'], base: ['e4'],
    },
    svg: () => buildSvg({
      title: '淝水之战 · 两军对峙结构切片图',
      desc: '苻坚多民族大军对垒北府兵；淝水对峙；士气链崩溃为决胜机制。',
      header: '结构切片 · 淝水之战',
      sub: 'SJ-33 · 东晋 · 军事决战',
      zhupi: '朱批：账面优势≠效能 · 士气链崩溃=机制枢纽',
      edges: `
    <path class="sj-edge" data-edge="e1" d="M156,212 L410,260" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="e2" d="M664,212 L410,285" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="e3" d="M410,285 L410,360" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="e4" d="M410,360 L410,452" stroke="var(--sj-line)" stroke-width="1.6" marker-end="url(#a-paper)" opacity="0.7"/>
    <path class="sj-edge" data-edge="e5" d="M664,316 L520,330" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.85"/>`,
      edgeLabels: `
    <text x="280" y="240" fill="var(--sj-ochre)">多民族拼凑</text>
    <text x="540" y="248" fill="var(--sj-vermil)" font-size="12" font-weight="600">北府反击</text>
    <text x="430" y="330" fill="var(--sj-vermil)">383 淝水</text>
    <text x="430" y="400" fill="var(--sj-vermil)">士气链崩溃</text>`,
      nodes: `
${nodeRect('fujian', 56, 126, 200, 86, 'var(--sj-ochre)', '苻坚 · 前秦', '多民族 · 账面优', { sw: '2.4' })}
${nodeRect('beifu', 564, 126, 200, 86, 'var(--sj-vermil)', '北府兵 · 谢玄', '精锐 · 决胜', { sw: '2.4' })}
${nodeRect('feishui', 310, 260, 200, 70, 'var(--sj-vermil)', '淝水 · 383', '对峙 · 决胜点', { sw: '2.4' })}
${nodeRect('shiqichain', 310, 360, 200, 56, 'var(--sj-vermil)', '士气链崩溃', '机制枢纽 · 连锁', { sw: '2.6' })}
${nodeRect('xiean', 564, 280, 200, 56, 'var(--sj-celadon)', '谢安 · 中枢', '稳局 · 督战', { sw: '2.4' })}
${nodeRect('minzu', 56, 280, 160, 56, 'var(--sj-paper-300)', '多民族军', '拼凑 · 脆弱', { sw: '1.6' })}
${nodeBase('base', '江南 · 中原基座', '南北资源不对称', '')}`,
      footer: 'viewBox 820×600 · 淝水',
    }),
  },

  '34': {
    prefix: 'sj-34',
    prose: '权力几何——<strong>合法性叙事桥接</strong>：孝文帝（宣纸色）以汉化改制架桥连接鲜卑军事贵族与汉人士族；均田/三长下行汲取；朱批为六镇鲜卑旧贵族反弹。非竖轴纵列，而是 Y 形叙事桥+财政下行。',
    railSummary: '汉化桥接 → 均田三长 → 六镇反弹。',
    legend: '色义：孝文帝=宣纸白 · 汉化=合法性桥 · 均田=赭金下行 · 鲜卑旧贵=朱红 · 汉士族=青瓷 · 底盘=深墨。',
    nodeData: {
      xiaowen: { name: '孝文帝 · 元宏', tag: '合法性 · 桥接', body: '拓跋宏以汉化重建「华夏正统」叙事——从「胡虏」转为「魏承汉」。' },
      hanhua: { name: '汉化改制', tag: '叙事桥 · 左支', body: '改姓、禁胡语胡服、祭孔——合法性叙事主动重建。' },
      luoyang: { name: '洛阳 · 494', tag: '迁都 · 时点', body: '太和十八年（494）迁都洛阳——空间象征绑定汉地正统。' },
      juntian: { name: '均田 · 三长', tag: '财政下行', body: '均田制重建税基；三长制强化基层编户，汲取链向汉化政权集中。' },
      xianbei: { name: '鲜卑旧贵族', tag: '六镇 · 反弹', body: '北方六镇鲜卑军户被汉化政策边缘化——军事力与合法性改革脱节。' },
      hanshi: { name: '汉人士族', tag: '融合 · 右支', body: '鲜卑贵族改汉姓、与汉士族通婚，试图打开精英融合通道。' },
      base: { name: '编户齐民 · 北方基座', tag: '税基底盘', body: '战乱后北方人口重新匹配；均田试图锁定税基〔实施范围存疑〕。' },
    },
    nodeEdge: {
      xiaowen: ['b1', 'b2', 'b3'], hanhua: ['b1', 'b4'], luoyang: ['b4'],
      juntian: ['b3', 'b5'], xianbei: ['b2', 'b6'], hanshi: ['b2'], base: ['b5'],
    },
    svg: () => buildSvg({
      title: '孝文帝改革 · 合法性桥接结构切片图',
      desc: '孝文帝以汉化架桥连接鲜卑与汉士族；均田三长下行；六镇旧贵族朱红反弹。',
      header: '结构切片 · 合法性桥接',
      sub: 'SJ-34 · 北魏 · 变法',
      zhupi: '朱批：汉化桥接(宣纸) + 均田下行(赭金) + 六镇反弹(朱红)',
      edges: `
    <path class="sj-edge" data-edge="b1" d="M410,158 L218,230" stroke="var(--sj-paper-100)" stroke-width="2.4" marker-end="url(#a-paper)" opacity="0.95"/>
    <path class="sj-edge" data-edge="b2" d="M410,158 L607,230" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="b3" d="M410,158 L410,310" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="b4" d="M218,280 L218,330" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="b5" d="M410,390 L410,450" stroke="var(--sj-ochre)" stroke-width="2.4" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="b6" d="M607,280 C520,360 480,400 460,330" stroke="var(--sj-vermil)" stroke-width="2.6" stroke-dasharray="5 4" marker-end="url(#a-vermil)" opacity="0.9"/>`,
      edgeLabels: `
    <text x="280" y="200" fill="var(--sj-paper-100)">汉化桥</text>
    <text x="540" y="200" fill="var(--sj-vermil)">旧贵触怒</text>
    <text x="430" y="280" fill="var(--sj-ochre)">均田下行</text>
    <text x="540" y="360" fill="var(--sj-vermil)">六镇反弹</text>`,
      nodes: `
${nodeRect('xiaowen', 310, 112, 200, 46, 'var(--sj-paper-100)', '孝文帝 · 元宏', '皇权 · 汉化桥', { sw: '2.4' })}
${nodeRect('hanhua', 130, 220, 176, 60, 'var(--sj-paper-100)', '汉化改制', '改姓 · 禁胡语', { sw: '2.4' })}
${nodeRect('luoyang', 130, 330, 176, 56, 'var(--sj-celadon)', '洛阳 · 494', '迁都 · 象征', { sw: '2' })}
${nodeRect('juntian', 310, 310, 200, 60, 'var(--sj-ochre)', '均田 · 三长', '汲取重建 · 下行', { sw: '2.4' })}
${nodeRect('xianbei', 514, 220, 186, 60, 'var(--sj-vermil)', '鲜卑旧贵族', '六镇 · 反弹', { sw: '2.8' })}
${nodeRect('hanshi', 514, 310, 186, 60, 'var(--sj-celadon)', '汉人士族', '融合 · 通婚', { sw: '2.4' })}
${nodeBase('base', '编户齐民 · 北方基座', '均田农民底盘', '')}`,
      footer: 'viewBox 820×600 · 合法性桥接',
    }),
  },

  '45': {
    prefix: 'sj-45',
    prose: '权力几何——<strong>制度长时段曲线</strong>：行省初为「因事而设」的临时派出（左端开放）→ 至元二十四年（1287）改行中书省为定制 → 沿曲线右移固化为「腹里+十行省」格局。青瓷为制度轨迹，朱批为蒙古—汉地双轨张力。非竖轴纵列。',
    railSummary: '因事而设 → 1287 定制 → 十行省固化。',
    legend: '色义：中书=赭金 · 制度曲线=青瓷（左开右固）· 达鲁花赤=灰白双轨 · 四等人制=朱红隐患 · 底盘=深墨。横轴=时间，曲线初临时后常设。',
    nodeData: {
      zhongshu: { name: '中书省 · 皇帝', tag: '皇权 · 授权', body: '元废三省留中书，为最高政务机关；腹里（今华北一带）由中书省直辖。' },
      yinshi: { name: '因事而设', tag: '曲线开放端', body: '初为平定叛乱、经理财赋的临时派出机构——「行动的中书省」，非一开始就常设。' },
      dingzhi: { name: '1287 定制', tag: '制度拐点', body: '至元二十四年改行尚书省为行中书省，渐成定制——曲线中段枢纽（《元史·百官志》）。' },
      xingsheng: { name: '行中书省', tag: '制度枢纽', body: '掌一路以上军民钱粮，由只管军事到兼管民政——元帝国空间治理的核心模块。' },
      daru: { name: '达鲁花赤', tag: '精英双轨', body: '各路设蒙古监官，与汉官并置——保障蒙古利益的双轨结构。' },
      shiyi: { name: '十行省格局', tag: '固化端', body: '至顺元年（1330）约一中书省+十行省——曲线右端锁定的空间分块格局。' },
      base: { name: '编户 · 腹里与行省底盘', tag: '基座', body: '统一后括户、赋役试图锁定税基；行省分块使大帝国治理成为可能。' },
    },
    nodeEdge: {
      zhongshu: ['c1'], yinshi: ['c1', 'c2'], dingzhi: ['c2', 'c3'],
      xingsheng: ['c3', 'c4', 'c5'], daru: ['c4'], shiyi: ['c5'], base: ['c6'],
    },
    svg: () => buildSvg({
      title: '行省制度 · 制度曲线结构切片图',
      desc: '因事而设开放端沿曲线右移至1287定制与十行省固化；达鲁花赤双轨为执行张力。',
      header: '结构切片 · 制度曲线',
      sub: 'SJ-45 · 元 · 制度演变',
      zhupi: '朱批：初临时→终固化 · 1287 定制＝曲线拐点 · 非竖轴',
      edges: `
    <path class="sj-edge" data-edge="c1" d="M120,380 C200,340 280,300 360,260" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="c2" d="M360,260 C440,240 500,250 520,280" stroke="var(--sj-celadon)" stroke-width="2.6" marker-end="url(#a-celadon)" opacity="0.95"/>
    <path class="sj-edge" data-edge="c3" d="M520,280 C580,300 620,320 640,340" stroke="var(--sj-celadon)" stroke-width="2.6" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="c4" d="M640,340 L640,280" stroke="var(--sj-paper-300)" stroke-width="1.8" stroke-dasharray="4 4" marker-end="url(#a-paper)" opacity="0.8"/>
    <path class="sj-edge" data-edge="c5" d="M640,340 C680,360 720,400 740,420" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="c6" d="M740,420 L410,486" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path d="M100,400 C240,320 400,220 560,240 C680,260 740,340 760,420" fill="none" stroke="var(--sj-line)" stroke-width="1" stroke-dasharray="4 6" opacity="0.5"/>`,
      edgeLabels: `
    <text x="200" y="320" fill="var(--sj-celadon)">因事而设 · 开放</text>
    <text x="480" y="230" fill="var(--sj-celadon)">1287 定制</text>
    <text x="680" y="360" fill="var(--sj-vermil)" font-size="12" font-weight="600">十行省固化</text>
    <text x="560" y="300" fill="var(--sj-paper-300)">达鲁花赤双轨</text>`,
      nodes: `
${nodeRect('zhongshu', 56, 360, 160, 46, 'var(--sj-ochre)', '中书省 · 皇帝', '腹里直辖 · 授权')}
${nodeRect('yinshi', 280, 280, 160, 56, 'var(--sj-celadon)', '因事而设', '临时派出 · 开放端')}
${nodeRect('dingzhi', 480, 240, 180, 64, 'var(--sj-celadon)', '1287 定制', '行中书省 · 拐点', { sw: '2.6' })}
${nodeRect('xingsheng', 600, 300, 186, 64, 'var(--sj-celadon)', '行中书省', '军民钱粮 · 枢纽', { sw: '2.4' })}
${nodeRect('daru', 600, 220, 160, 50, 'var(--sj-paper-300)', '达鲁花赤', '蒙古监官 · 双轨')}
${nodeRect('shiyi', 640, 380, 186, 56, 'var(--sj-vermil)', '十行省格局', '1330 约定型 · 固化', { sw: '2.4' })}
${nodeBase('base', '编户 · 腹里与行省底盘', '税基 · 多民族帝国', '')}`,
      footer: 'viewBox 820×600 · 制度曲线',
    }),
  },

  '46': {
    prefix: 'sj-46',
    prose: '权力几何——中央「大都·顺帝」被<strong>四力向心合围</strong>：基座(流民灾荒)与财政(变钞通胀)双引燃，合法性(白莲明王)与军事(刘福通红巾)同时施压，治河征发经枢纽汇聚；群雄割据击穿元廷。箭头一律向心汇聚，非竖轴。',
    railSummary: '四力合围大都 · 1351 颍州引爆 · 元亡明兴。',
    legend: '色义：顺帝=赭金虚线 · 治河=赭金枢纽 · 基座/红巾/通胀=朱红向心 · 白莲=宣纸 · 群雄=青瓷。合围箭头向心。',
    nodeData: {
      shundi: { name: '元顺帝', tag: '中央被围 · 虚弱', body: '元末顺帝朝政腐败，权臣专擅，无法有效应对民变——合法性绩效破产，被四力合围的虚线中央。' },
      zhihe: { name: '治黄河 · 开河', tag: '财政引燃', body: '至正十一年征十五万民夫治河，克扣工食，「石人一只眼，挑动黄河天下反」——汲取越阈引爆点。' },
      bianchao: { name: '变钞 · 通胀', tag: '财政共振', body: '滥发纸币、物价飞腾，与治河征发叠加——财政多线越阈。' },
      bailian: { name: '白莲 · 明王', tag: '叙事夺权', body: '「弥勒下生、明王出世」提供反抗合法性，与元正统叙事对垒。' },
      liufutong: { name: '刘福通 · 红巾', tag: '军事—叙事', body: '1351 颍州起义，红巾为号，建小明宋——夺「天命」话语的引爆点。' },
      qunxiong: { name: '徐寿辉 · 朱元璋', tag: '精英旁路', body: '南方红巾、朱元璋等集团各自发展，元无法逐一扑灭——军事力碎片化。' },
      liumin: { name: '流民 · 灾荒', tag: '基座引燃', body: '黄河决口、饥荒瘟疫制造大量流民——崩解的底盘引燃力。' },
      base: { name: '编户 · 灾荒底盘', tag: '基座', body: '黄河泛滥、旱疫与征发叠加，编户承载崩溃——合围的底盘。' },
    },
    nodeEdge: {
      shundi: ['hub'], zhihe: ['conv1', 'hub'], bianchao: ['conv2', 'hub'],
      bailian: ['conv3'], liufutong: ['conv4', 'ignite'], qunxiong: ['conv5'],
      liumin: ['conv1', 'ignite'], base: ['ignite'],
    },
    svg: () => buildSvg({
      title: '红巾起义 · 四力共振合围结构切片图',
      desc: '元顺帝虚弱居中；治河、变钞、白莲、红巾、流民五向箭头经治河枢纽向心合围中央。',
      header: '结构切片 · 四力合围',
      sub: 'SJ-46 · 元末 · 崩解',
      zhupi: '朱批：基座(流民)+财政(变钞/治河)双引燃 · 白莲叙事 · 红巾引爆 · 四力共振合围',
      edges: `
    <path class="sj-edge" data-edge="conv1" d="M133,310 C220,300 300,290 360,280" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv2" d="M677,280 C580,285 480,285 460,280" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv3" d="M410,200 C410,220 410,240 410,252" stroke="var(--sj-paper-100)" stroke-width="2.2" marker-end="url(#a-paper)" opacity="0.85"/>
    <path class="sj-edge" data-edge="conv4" d="M607,292 C520,320 480,340 460,318" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="conv5" d="M607,366 C520,400 480,420 460,420" stroke="var(--sj-celadon)" stroke-width="2" marker-end="url(#a-celadon)" opacity="0.85"/>
    <path class="sj-edge" data-edge="ignite" d="M300,452 L360,420" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="hub" d="M410,252 L410,268" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.8"/>`,
      edgeLabels: `
    <text x="240" y="268" fill="var(--sj-vermil)">基座引燃</text>
    <text x="580" y="268" fill="var(--sj-vermil)">变钞通胀</text>
    <text x="430" y="230" fill="var(--sj-paper-100)">白莲叙事</text>
    <text x="540" y="340" fill="var(--sj-vermil)" font-size="12" font-weight="600">1351 引爆</text>
    <text x="520" y="400" fill="var(--sj-celadon)">群雄割据</text>`,
      nodes: `
${nodeRect('shundi', 310, 112, 200, 46, 'var(--sj-ochre)', '元顺帝 · 大都', '中央被围 · 虚弱', { dash: '5 4', sw: '1.4' })}
${nodeCircle('zhihe', 410, 290, 44, 'var(--sj-ochre)', '治河 · 开河', '至正十一年 · 枢纽')}
${nodeRect('bianchao', 600, 220, 176, 60, 'var(--sj-vermil)', '变钞 · 通胀', '财政共振 · 外压')}
${nodeRect('bailian', 310, 168, 200, 46, 'var(--sj-paper-100)', '白莲 · 明王', '合法性叙事 · 上压')}
${nodeRect('liufutong', 514, 250, 186, 72, 'var(--sj-vermil)', '刘福通 · 红巾', '1351 颍州 · 引爆', { sw: '2.8' })}
${nodeRect('qunxiong', 514, 360, 186, 56, 'var(--sj-celadon)', '徐寿辉 · 朱元璋', '群雄割据')}
${nodeRect('liumin', 56, 360, 176, 60, 'var(--sj-vermil)', '流民 · 灾荒', '基座引燃 · 左压', { sw: '2.4' })}
${nodeBase('base', '编户 · 灾荒底盘', '黄河 · 旱疫 · 编户崩溃', '')}`,
      footer: 'viewBox 820×600 · 四力合围',
    }),
  },

  '50': {
    prefix: 'sj-50',
    prose: '权力几何——中央「清廷·咸丰」被<strong>四力向心合围</strong>：基座(人口压力承 SJ-49)与财政(厘金筹饷)双引燃，军事(洪秀全天朝)与精英(湘淮督抚)同时施压，江南战祸经枢纽汇聚。箭头向心汇聚，非军事对峙竖轴。',
    railSummary: '四力合围清廷 · 1851 金田引爆 · 承康乾拐点。',
    legend: '色义：清廷=赭金虚线 · 战祸=朱红枢纽 · 人口/天朝/厘金=朱红向心 · 湘淮=青瓷 · 底盘=深墨。合围非对峙。',
    nodeData: {
      qingting: { name: '清廷 · 咸丰', tag: '中央被围 · 虚弱', body: '鸦片战争后财政与合法性受创，咸丰年间内忧外患并发——被四力合围的虚线中央。' },
      hong: { name: '洪秀全 · 天朝', tag: '叙事夺权', body: '1851 金田起义建号太平天国，以宗教+平均主义动员——合法性被体系外叙事夺取。' },
      xianghuai: { name: '湘淮 · 曾李', tag: '精英—军事', body: '曾国藩、李鸿章等以地方团练崛起，汉人督抚权力膨胀——精英循环变轨。' },
      renkou: { name: '人口压力', tag: '基座慢变量', body: '承 SJ-49 康乾拐点；学界估战祸人口损失约 5000万–7000万（曹树基《中国人口史》等，标估算）。' },
      yangwu: { name: '厘金 · 筹饷', tag: '财政引燃', body: '战争推动厘金等近代化汲取工具——财政被迫调整以应军事消耗。' },
      zhanhuo: { name: '江南 · 战祸', tag: '军事枢纽', body: '战争遍及苏皖浙赣，1864 天京陷——军事消耗与财政双透支的汇聚点。' },
      base: { name: '广西 · 江南底盘', tag: '慢变量', body: '承 SJ-49 人口压力；广西起事、江南决战——基座承载越阈的地理表现。' },
    },
    nodeEdge: {
      qingting: ['hub'], hong: ['conv1', 'ignite'], xianghuai: ['conv2'],
      renkou: ['conv3'], yangwu: ['conv4', 'hub'], zhanhuo: ['hub', 'conv5'], base: ['conv3', 'conv5'],
    },
    svg: () => buildSvg({
      title: '太平天国 · 四力共振合围结构切片图',
      desc: '清廷咸丰虚弱居中；人口压力、厘金、天朝、湘淮、战祸五向箭头经战祸枢纽向心合围中央。',
      header: '结构切片 · 四力合围',
      sub: 'SJ-50 · 清 · 崩解',
      zhupi: '朱批：基座(人口)+财政(厘金)双引燃 · 天朝叙事 · 湘淮变轨 · 四力共振合围',
      edges: `
    <path class="sj-edge" data-edge="conv1" d="M607,266 C520,280 480,290 460,280" stroke="var(--sj-vermil)" stroke-width="3" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="conv2" d="M218,280 C300,285 360,288 380,282" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv3" d="M133,310 C220,300 300,290 360,280" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv4" d="M677,320 C580,310 480,300 460,310" stroke="var(--sj-ochre)" stroke-width="2.6" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="conv5" d="M410,400 C410,360 410,340 410,318" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="ignite" d="M607,292 L460,300" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="hub" d="M410,252 L410,268" stroke="var(--sj-ochre)" stroke-width="2" marker-end="url(#a-ochre)" opacity="0.8"/>`,
      edgeLabels: `
    <text x="540" y="270" fill="var(--sj-vermil)">1851 天朝</text>
    <text x="280" y="268" fill="var(--sj-celadon)">湘淮变轨</text>
    <text x="240" y="300" fill="var(--sj-vermil)">人口压力</text>
    <text x="580" y="310" fill="var(--sj-ochre)">厘金筹饷</text>
    <text x="430" y="360" fill="var(--sj-vermil)" font-size="12" font-weight="600">江南战祸</text>`,
      nodes: `
${nodeRect('qingting', 310, 112, 200, 46, 'var(--sj-ochre)', '清廷 · 咸丰', '中央被围 · 虚弱', { dash: '5 4', sw: '1.4' })}
${nodeCircle('zhanhuo', 410, 290, 44, 'var(--sj-vermil)', '江南 · 战祸', '1864 天京陷 · 枢纽')}
${nodeRect('hong', 514, 230, 186, 72, 'var(--sj-vermil)', '洪秀全 · 天朝', '1851 金田 · 引爆', { sw: '2.8' })}
${nodeRect('xianghuai', 130, 230, 176, 60, 'var(--sj-celadon)', '湘淮 · 曾李', '团练 · 督抚')}
${nodeRect('renkou', 56, 360, 176, 60, 'var(--sj-vermil)', '人口压力', '承 SJ-49 · 估算', { sw: '2.4' })}
${nodeRect('yangwu', 600, 340, 186, 56, 'var(--sj-ochre)', '厘金 · 筹饷', '财政被迫调整')}
${nodeBase('base', '广西 · 江南底盘', '灾荒 · 流民 · 土地', '')}`,
      footer: 'viewBox 820×600 · 四力合围',
    }),
  },

  '51': {
    prefix: 'sj-51',
    prose: '权力几何——<strong>103 日改革窗口</strong>：光绪（虚线背书）授权康梁推行废八股/大学堂/裁冗下行；守旧派（慈禧）以粗朱红回路反扑（1898.9.21 政变）。甲午外环施压；死穴在「无制度化改革保障」。因案而异，非王安石竖轴。',
    railSummary: '103 日窗口 → 触动科举 → 政变反扑 · 承 SJ-14 甲午。',
    legend: '色义：光绪=赭金虚线 · 康梁=青瓷改革窗 · 慈禧=朱红粗回路 · 甲午=朱红外环 · 底盘=深墨。窗口+回路，非竖轴纵列。',
    nodeData: {
      guangxu: { name: '光绪帝', tag: '合法性背书', body: '1898.6.11 颁明定国是诏，但人事军政仍受慈禧制约——改革背书脆弱。' },
      kangliang: { name: '康有为 · 梁启超', tag: '改革引擎', body: '保国会、变法奏议；推动废八股、设大学堂、裁冗——体制突破尝试。' },
      cixi: { name: '慈禧 · 守旧派', tag: '精英反扑', body: '1898.9.21 发动政变，训政，杀谭嗣同等——变法真正的结构死穴。' },
      reform: { name: '废八股 · 大学堂', tag: '制度下行', body: '废八股触动士绅通道；京师大学堂等为少数存续遗产。' },
      jiawu: { name: '甲午 · 1894', tag: '上游引爆', body: '甲午战败证伪洋务-only 路径，催生维新——体系外压力内化（SJ-14 外环）。' },
      tans: { name: '谭嗣同 · 六君子', tag: '失败代价', body: '政变后六君子遇害，改良路线受挫，革命思潮上升。' },
      base: { name: '士绅 · 编户底盘', tag: '基座未改', body: '变法未触及土地与基层汲取；人口压力与财政危机仍在——基座矛盾留给 SJ-15。' },
    },
    nodeEdge: {
      guangxu: ['back', 'window'], kangliang: ['back', 'window', 'touch', 'down'],
      cixi: ['touch', 'coup', 'kill'], reform: ['down'], jiawu: ['pressure'],
      tans: ['kill'], base: ['down'],
    },
    svg: () => buildSvg({
      title: '戊戌变法 · 改革窗口结构切片图',
      desc: '光绪虚线背书；康梁 103 日改革窗口下行；慈禧粗回路反扑；甲午外环施压。',
      header: '结构切片 · 改革窗口',
      sub: 'SJ-51 · 清 · 变法',
      zhupi: '朱批：103 日窗口 · 触动科举死穴 · 政变粗回路反扑 · 非竖轴',
      edges: `
    <path class="sj-edge" data-edge="back" d="M360,158 L250,250" stroke="var(--sj-ochre)" stroke-width="1.8" stroke-dasharray="6 5" marker-end="url(#a-ochre)" opacity="0.85"/>
    <path class="sj-edge" data-edge="window" d="M218,310 L218,372" stroke="var(--sj-celadon)" stroke-width="2.6" marker-end="url(#a-celadon)" opacity="0.95"/>
    <path class="sj-edge" data-edge="touch" d="M306,286 L462,286" stroke="var(--sj-vermil)" stroke-width="3.2" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="down" d="M220,422 L410,486" stroke="var(--sj-ochre)" stroke-width="2.2" marker-end="url(#a-ochre)" opacity="0.9"/>
    <path class="sj-edge" data-edge="coup" d="M640,498 C724,452 716,340 588,320" stroke="var(--sj-vermil)" stroke-width="3.6" marker-end="url(#a-vermil)" opacity="0.95"/>
    <path class="sj-edge" data-edge="pressure" d="M133,308 C200,280 280,260 360,158" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)" opacity="0.85"/>
    <path class="sj-edge" data-edge="kill" d="M555,310 L555,372" stroke="var(--sj-vermil)" stroke-width="2" marker-end="url(#a-vermil)" opacity="0.9"/>`,
      edgeLabels: `
    <text x="280" y="210" fill="var(--sj-ochre)">103 日窗口</text>
    <text x="384" y="278" text-anchor="middle" fill="var(--sj-vermil)" font-size="12" font-weight="600">触动科举</text>
    <text x="700" y="400" fill="var(--sj-vermil)" font-size="12" font-weight="600">★ 政变反扑</text>
    <text x="180" y="240" fill="var(--sj-vermil)">甲午外环</text>`,
      nodes: `
${nodeRect('guangxu', 320, 112, 180, 46, 'var(--sj-ochre)', '光绪帝', '明定国是 · 脆弱', { dash: '5 4', sw: '2.4' })}
${nodeRect('kangliang', 130, 250, 176, 60, 'var(--sj-celadon)', '康有为 · 梁启超', '维新引擎 · 窗口')}
${nodeRect('cixi', 462, 250, 186, 60, 'var(--sj-vermil)', '慈禧 · 守旧派', '1898.9.21 政变', { sw: '2.8' })}
${nodeRect('reform', 132, 372, 176, 50, 'var(--sj-ochre)', '废八股 · 大学堂', '制度下行')}
${nodeRect('jiawu', 52, 280, 162, 56, 'var(--sj-vermil)', '甲午 · 1894', 'SJ-14 外环', { sw: '2.4' })}
${nodeRect('tans', 462, 372, 186, 50, 'var(--sj-vermil)', '谭嗣同 · 六君子', '1898.9.28')}
${nodeBase('base', '士绅 · 编户底盘', '科举—土地未动', '')}`,
      footer: 'viewBox 820×600 · 改革窗口',
    }),
  },

  ...POLISH_SLICE_CONFIGS,

  // ── 架构师改定几何（规格 §1）· 必须覆盖 ROUND/POLISH 的 round-data 克隆，勿回退为竖轴 ──
  '53': {
    prefix: 'sj-53',
    prose: '权力几何——<strong>北上统一（军事力定正统）</strong>：广州誓师（南端·起点）→ 国民革命军北上主轴（朱红粗箭）各个击破军阀（吴佩孚/孙传芳）→ 东北易帜（北端·形式统一）。国共合作为执行链汇入主轴；四一二为侧向断裂切断国共链；农民底盘土地未解＝形式统一下深层分裂。非竖轴纵列。',
    railSummary: '广州誓师 → 北上各个击破军阀 → 1928 东北易帜形式统一；四一二国共破裂，土地未解＝深层分裂。',
    legend: '色义：广州/军阀=赭金 · 国民革命军/四一二=朱红主轴与断裂 · 国共合作/东北易帜=青瓷执行链与形式统一 · 底盘=深墨。南→北纵向推进，非王安石竖轴克隆。',
    nodeData: {
      guangzhou: { name: '广州国民政府', tag: '正统争夺 · 誓师起点', body: '孙中山遗产 + 国共合作；1926.7.9 蒋介石就国民革命军总司令誓师北伐——南端起点。' },
      beifajun: { name: '国民革命军 · 主轴', tag: '军事主轴 · 组织度', body: '政治工作 + 精锐部队，汀泗桥、贺胜桥等决战取胜；组织度胜过军阀松散联盟，军事力定正统的近代样本。' },
      junfa: { name: '吴佩孚 · 孙传芳', tag: '军阀联盟 · 被击破', body: '军阀联盟松散、政治腐败；北伐军各个击破——旧秩序被军事力重排。' },
      guogong: { name: '国共合作', tag: '精英双轨 · 执行链', body: '共产党员参与军政与群众动员，汇入北伐主轴；1927.4.12 后断裂。' },
      siyi: { name: '四一二 · 1927', tag: '分裂拐点 · 侧向断裂', body: '蒋介石上海政变，国共合作破裂——重整链侧向断裂点，切断群众动员执行链。' },
      yizhi: { name: '东北易帜', tag: '形式统一 · 北端', body: '1928.12 张学良宣布服从国民政府——北伐形式完成统一，为北上主轴终点。' },
      base: { name: '农民 · 战乱底盘', tag: '基座未整合', body: '北伐未解决土地问题，农民承受战乱代价——形式统一下的深层分裂。' },
    },
    nodeEdge: {
      guangzhou: ['spine1'], beifajun: ['spine1', 'spine2', 'jipuo', 'dongyuan'],
      junfa: ['jipuo'], guogong: ['dongyuan', 'duanlie'], siyi: ['duanlie'],
      yizhi: ['spine2'], base: [],
    },
    svg: () => stripUnusedMarkers(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">结构切片 · 北伐战争</title>
  <desc id="sj-desc">权力几何：南→北统一推进——广州誓师（起点）→ 国民革命军北上主轴（朱红）各个击破军阀 → 东北易帜形式统一（北端）；国共合作为执行链，四一二侧向断裂，土地未解＝形式统一下深层分裂。</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%">
      <stop offset="0%" stop-color="var(--sj-ink-800)"/>
      <stop offset="100%" stop-color="var(--sj-ink-900)"/>
    </radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse">
      <line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/>
    </pattern>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/>
    </linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
  </defs>
  <rect width="820" height="600" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="420" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,Noto Serif SC,serif" letter-spacing="0.1em">结构切片 · 北上统一</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,JetBrains Mono,monospace" letter-spacing="0.08em">SJ-53 · 北伐 · 军事力定正统</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,Noto Serif SC,serif">朱批：广州誓师 → 北上各个击破军阀 → 东北易帜形式统一；四一二国共破裂，土地未解＝形式统一下深层分裂</text>
  <g fill="none" stroke-linecap="round">
    <path class="sj-edge" data-edge="spine1" d="M410,428 L410,364" stroke="var(--sj-vermil)" stroke-width="3.4" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="spine2" d="M410,300 L410,172" stroke="var(--sj-vermil)" stroke-width="3.4" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="jipuo" d="M510,330 L546,330" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="dongyuan" d="M206,384 C260,360 285,348 310,342" stroke="var(--sj-celadon)" stroke-width="2.2" marker-end="url(#a-celadon)"/>
    <path class="sj-edge" data-edge="duanlie" d="M560,404 C440,388 340,378 262,388" stroke="var(--sj-vermil)" stroke-width="2.2" stroke-dasharray="5 4" marker-end="url(#a-vermil)"/>
  </g>
  <g font-family="Songti SC,Noto Serif SC,serif" font-size="11">
    <text x="424" y="400" fill="var(--sj-vermil)" font-weight="600">北上</text>
    <text x="424" y="244" fill="var(--sj-vermil)" font-weight="600">定正统</text>
    <text x="512" y="318" fill="var(--sj-vermil)">各个击破</text>
    <text x="214" y="352" fill="var(--sj-celadon)">群众动员</text>
    <text x="360" y="372" text-anchor="middle" fill="var(--sj-vermil)">1927 国共破裂</text>
  </g>
  <g class="sj-node" data-id="yizhi" tabindex="0" role="button" aria-label="东北易帜">
    <rect x="310" y="120" width="200" height="48" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.4"/>
    <text x="410" y="144" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-weight="600" font-family="Songti SC,serif">东北易帜 · 形式统一</text>
    <text x="410" y="162" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">1928.12 · 北伐终点</text>
  </g>
  <g class="sj-node" data-id="beifajun" tabindex="0" role="button" aria-label="国民革命军">
    <rect x="310" y="300" width="200" height="64" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-vermil)" stroke-width="3"/>
    <text x="410" y="328" text-anchor="middle" fill="var(--sj-vermil)" font-size="15" font-weight="600" font-family="Songti SC,serif">国民革命军 · 主轴</text>
    <text x="410" y="347" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">组织度 &gt; 军阀松散联盟</text>
  </g>
  <g class="sj-node" data-id="junfa" tabindex="0" role="button" aria-label="吴佩孚 · 孙传芳">
    <rect x="546" y="302" width="210" height="56" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="651" y="326" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">吴佩孚 · 孙传芳</text>
    <text x="651" y="344" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">军阀联盟 · 各个击破</text>
    <line x1="556" y1="308" x2="746" y2="352" stroke="var(--sj-vermil)" stroke-width="1.2"/>
  </g>
  <g class="sj-node" data-id="siyi" tabindex="0" role="button" aria-label="四一二">
    <rect x="546" y="392" width="210" height="56" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-vermil)" stroke-width="2.6"/>
    <text x="651" y="416" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-weight="600" font-family="Songti SC,serif">四一二 · 1927</text>
    <text x="651" y="434" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">国共破裂 · 重整链断</text>
  </g>
  <g class="sj-node" data-id="guogong" tabindex="0" role="button" aria-label="国共合作">
    <rect x="56" y="360" width="150" height="56" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.2"/>
    <text x="131" y="384" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-weight="600" font-family="Songti SC,serif">国共合作</text>
    <text x="131" y="402" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">政治工作 · 工农</text>
  </g>
  <g class="sj-node" data-id="guangzhou" tabindex="0" role="button" aria-label="广州国民政府">
    <rect x="310" y="428" width="200" height="52" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="2.4"/>
    <text x="410" y="452" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">广州国民政府</text>
    <text x="410" y="470" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">1926.7 誓师北伐 · 起点</text>
  </g>
  <g class="sj-node" data-id="base" tabindex="0" role="button" aria-label="农民 · 战乱底盘">
    <rect x="56" y="506" width="708" height="64" rx="6" fill="url(#sj-base)" stroke="var(--sj-line)" stroke-width="1.4"/>
    <text x="240" y="534" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="Songti SC,serif">农民 · 战乱底盘</text>
    <text x="240" y="552" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">土地未均 · 基座未整合</text>
  </g>
  <text x="764" y="588" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,JetBrains Mono,monospace">viewBox 820×600 · 北上统一</text>
</svg>`),
  },

  '54': {
    prefix: 'sj-54',
    prose: '权力几何——<strong>削禄与伏尸</strong>：楚悼王（背书·虚线）授权吴起（令尹·引擎）；削疏远公族之禄（青瓷精英）抽入强兵（朱红军事）＝汲取转向军事 → 助赵伐魏（短期兑现）。旧贵族反扑害吴起；悼王一卒即伏尸——射王尸者后皆夷三族，死穴与反噬同体。非商鞅阶梯、非竖轴。',
    railSummary: '削疏远公族之禄养战士＝汲取转向军事；悼王一卒伏尸，射王尸者夷三族，死穴与反噬同体。',
    legend: '色义：楚悼王=赭金虚线背书 · 吴起/助赵伐魏=青瓷 · 强兵/旧贵族反扑/伏尸=朱红 · 底盘=深墨。削禄 siphon 由青瓷→朱红体现汲取转向；死穴＝反噬同体，非竖轴克隆。',
    nodeData: {
      daowang: { name: '楚悼王', tag: '皇权背书 · 虚线', body: '素闻吴起贤，至则相楚——变法系于悼王个人支持；前381 悼王卒即引爆反噬。' },
      wuqi: { name: '吴起 · 令尹', tag: '变法枢纽', body: '明法审令、捐不急之官、废公族疏远者，以抚养战斗之士（《史记·孙子吴起列传》）。' },
      guizu: { name: '旧贵族 · 封君', tag: '精英反扑 · 死穴', body: '楚之贵戚尽欲害吴起——世袭封君禄被削，变法死穴在触动世卿；射王尸者后皆夷三族。' },
      qiangbing: { name: '强兵抚战', tag: '汲取转向军事 · 签名', body: '节俸养士、废疏远公族禄以充军费——汲取链军事化，青瓷精英之禄抽入朱红军事。' },
      zhanguo: { name: '助赵伐魏', tag: '军事兑现', body: '变法后楚助赵伐魏、南平百越——前381 短期军事成果，未能延续。' },
      fanpu: { name: '悼王卒 · 伏尸', tag: '机制引爆 · 反噬同体', body: '悼王死，宗室攻吴起，吴起伏王尸——乱箭射中王尸，吴起遇害；射王尸者后皆夷三族（70余家），死穴与反噬同体。' },
      base: { name: '楚国王族 · 封君底盘', tag: '基座 · 既得利益网络', body: '楚国贵族封君体系深厚——变法触动基座上的既得利益网络，反弹力最强。' },
    },
    nodeEdge: {
      daowang: ['auth', 'trigger'], wuqi: ['auth', 'drive', 'rebound'],
      guizu: ['rebound', 'fushi'], qiangbing: ['drive', 'siphon', 'win'],
      fanpu: ['trigger', 'fushi'], zhanguo: ['win'], base: ['siphon'],
    },
    svg: () => stripUnusedMarkers(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 600" role="img" aria-labelledby="sj-title sj-desc">
  <title id="sj-title">结构切片 · 吴起变法</title>
  <desc id="sj-desc">权力几何：吴起削疏远公族之禄（青瓷精英）抽入强兵（朱红军事）＝汲取转向；旧贵族反扑为死穴，悼王一卒即伏尸——吴起以身拉贵族陪葬，射王尸者后皆夷三族，死穴与反噬同体。</desc>
  <defs>
    <radialGradient id="sj-glow" cx="50%" cy="34%" r="72%">
      <stop offset="0%" stop-color="var(--sj-ink-800)"/>
      <stop offset="100%" stop-color="var(--sj-ink-900)"/>
    </radialGradient>
    <pattern id="sj-xuan" width="8" height="14" patternUnits="userSpaceOnUse">
      <line x1="0" y1="1" x2="8" y2="1" stroke="var(--sj-paper-100)" stroke-width="0.4" opacity="0.35"/>
    </pattern>
    <linearGradient id="sj-base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241e19"/><stop offset="100%" stop-color="#100e0c"/>
    </linearGradient>
    <marker id="a-ochre" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-ochre)"/></marker>
    <marker id="a-vermil" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-vermil)"/></marker>
    <marker id="a-celadon" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--sj-celadon)"/></marker>
  </defs>
  <rect width="820" height="600" fill="url(#sj-glow)"/>
  <rect x="44" y="96" width="732" height="420" fill="url(#sj-xuan)" opacity="0.05"/>
  <g aria-hidden="true" opacity="0.7">
    <rect x="16" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="20" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
    <rect x="792" y="104" width="12" height="420" rx="5" fill="none" stroke="var(--sj-ochre)" stroke-width="1.2"/>
    <rect x="796" y="108" width="4" height="412" rx="2" fill="var(--sj-line)"/>
  </g>
  <text x="48" y="40" fill="var(--sj-paper-100)" font-size="22" font-weight="600" font-family="Songti SC,Noto Serif SC,serif" letter-spacing="0.1em">结构切片 · 削禄与伏尸</text>
  <text x="48" y="62" fill="var(--sj-ochre)" font-size="11" font-family="Source Han Mono,JetBrains Mono,monospace" letter-spacing="0.08em">SJ-54 · 吴起变法 · 削封君禄→强兵·反噬同体</text>
  <text x="48" y="82" fill="var(--sj-vermil)" font-size="11" font-family="Songti SC,Noto Serif SC,serif">朱批：削疏远公族之禄以养战士＝汲取转向军事；悼王一卒，旧贵族乱箭害吴起——吴起伏王尸，射王尸者后皆夷三族，死穴与反噬同体</text>
  <g fill="none" stroke-linecap="round">
    <path class="sj-edge" data-edge="auth" d="M400,158 C330,180 300,210 292,236" stroke="var(--sj-ochre)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#a-ochre)"/>
    <path class="sj-edge" data-edge="drive" d="M218,300 L218,378" stroke="var(--sj-celadon)" stroke-width="2.4" marker-end="url(#a-celadon)"/>
    <path class="sj-edge" data-edge="siphon" d="M360,486 C300,470 260,454 236,436" stroke="var(--sj-celadon)" stroke-width="2.8" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="win" d="M316,407 L322,407" stroke="var(--sj-vermil)" stroke-width="2.4" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="rebound" d="M504,268 L318,268" stroke="var(--sj-vermil)" stroke-width="2.6" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="trigger" d="M494,150 C640,180 664,300 622,378" stroke="var(--sj-vermil)" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#a-vermil)"/>
    <path class="sj-edge" data-edge="fushi" d="M560,378 L560,302" stroke="var(--sj-vermil)" stroke-width="2.8" marker-end="url(#a-vermil)"/>
  </g>
  <g font-family="Songti SC,Noto Serif SC,serif" font-size="11">
    <text x="300" y="204" fill="var(--sj-ochre)">授权变法</text>
    <text x="248" y="352" fill="var(--sj-celadon)">强兵</text>
    <text x="250" y="474" fill="var(--sj-vermil)" font-weight="600">削封君禄→养战士</text>
    <text x="404" y="266" text-anchor="middle" fill="var(--sj-vermil)">尽欲害吴起</text>
    <text x="640" y="250" fill="var(--sj-vermil)">悼王卒·前381</text>
    <text x="574" y="342" fill="var(--sj-vermil)" font-weight="600">伏尸·射者夷三族</text>
  </g>
  <g class="sj-node" data-id="daowang" tabindex="0" role="button" aria-label="楚悼王">
    <rect x="310" y="112" width="200" height="46" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-ochre)" stroke-width="1.6" stroke-dasharray="5 4"/>
    <text x="410" y="138" text-anchor="middle" fill="var(--sj-ochre)" font-size="14" font-weight="600" font-family="Songti SC,serif">楚悼王 · 授权</text>
    <text x="410" y="154" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">前401–381 · 系于一人</text>
  </g>
  <g class="sj-node" data-id="wuqi" tabindex="0" role="button" aria-label="吴起 · 令尹">
    <rect x="120" y="236" width="196" height="64" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.6"/>
    <text x="218" y="264" text-anchor="middle" fill="var(--sj-celadon)" font-size="15" font-weight="600" font-family="Songti SC,serif">吴起 · 令尹</text>
    <text x="218" y="283" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">明法审令 · 废疏远公族</text>
  </g>
  <g class="sj-node" data-id="guizu" tabindex="0" role="button" aria-label="旧贵族 · 封君">
    <rect x="504" y="236" width="216" height="64" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.6"/>
    <text x="612" y="264" text-anchor="middle" fill="var(--sj-celadon)" font-size="15" font-weight="600" font-family="Songti SC,serif">旧贵族 · 封君</text>
    <text x="612" y="283" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">世袭禄被削 · 尽欲害吴起</text>
  </g>
  <g class="sj-node" data-id="qiangbing" tabindex="0" role="button" aria-label="强兵抚战">
    <rect x="120" y="378" width="196" height="58" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-vermil)" stroke-width="2.4"/>
    <text x="218" y="404" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-weight="600" font-family="Songti SC,serif">强兵抚战</text>
    <text x="218" y="422" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">削禄养战士 · 汲取军事化</text>
  </g>
  <g class="sj-node" data-id="zhanguo" tabindex="0" role="button" aria-label="助赵伐魏">
    <rect x="322" y="378" width="176" height="58" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-celadon)" stroke-width="2.2"/>
    <text x="410" y="404" text-anchor="middle" fill="var(--sj-celadon)" font-size="14" font-weight="600" font-family="Songti SC,serif">助赵伐魏</text>
    <text x="410" y="422" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">前381 · 短期兑现</text>
  </g>
  <g class="sj-node" data-id="fanpu" tabindex="0" role="button" aria-label="悼王卒 · 伏尸">
    <rect x="504" y="378" width="216" height="58" rx="6" fill="var(--sj-ink-800)" stroke="var(--sj-vermil)" stroke-width="2.6"/>
    <text x="612" y="404" text-anchor="middle" fill="var(--sj-vermil)" font-size="14" font-weight="600" font-family="Songti SC,serif">悼王卒 · 伏尸</text>
    <text x="612" y="422" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">前381 · 死穴＝反噬</text>
  </g>
  <g class="sj-node" data-id="base" tabindex="0" role="button" aria-label="楚国王族 · 封君底盘">
    <rect x="56" y="486" width="708" height="74" rx="6" fill="url(#sj-base)" stroke="var(--sj-line)" stroke-width="1.4"/>
    <text x="410" y="516" text-anchor="middle" fill="var(--sj-paper-100)" font-size="14" font-family="Songti SC,serif">楚国王族 · 封君底盘</text>
    <text x="410" y="536" text-anchor="middle" fill="var(--sj-paper-300)" font-size="10" font-family="Songti SC,serif">公族世袭封地 · 变法触动的既得利益网络</text>
  </g>
  <text x="764" y="586" text-anchor="end" fill="var(--sj-line)" font-size="9" font-family="Source Han Mono,JetBrains Mono,monospace">viewBox 820×600 · 削禄·伏尸</text>
</svg>`),
  },
};
