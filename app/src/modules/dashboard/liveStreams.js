// 公共直播信号目录 · 经 curl 核查（2026-06-11）
// Section A: VERIFIED_HLS — curl 200 + #EXTM3U，embedType: hls
// Section B: EXTERNAL_INDEX — 官方页面外链，embedType: page
// playVerified: true 表示 modal 内 hls.js 可播（CORS 开放或开发代理）

export const STREAM_CATEGORIES = {
  panda: { id: 'panda', label: '熊猫直播', accent: '#10b981', icon: 'Panda' },
  scenic: { id: 'scenic', label: '风景名胜区', accent: '#22d3ee', icon: 'Mountain' },
  traffic: { id: 'traffic', label: '城市/交通', accent: '#e8a317', icon: 'TrainFront' },
  other: { id: 'other', label: '其他', accent: '#8b5cf6', icon: 'Telescope' },
};

/** @typedef {'hls'|'page'} EmbedType */

/**
 * @typedef {Object} PublicStream
 * @property {string} id
 * @property {string} title
 * @property {string} region
 * @property {'panda'|'scenic'|'traffic'|'other'} category
 * @property {string} source
 * @property {string} streamUrl
 * @property {EmbedType} embedType
 * @property {boolean} [playVerified]
 * @property {boolean} [verified]
 * @property {boolean} [needsProxy]
 * @property {string} [pageUrl]
 * @property {string} [thumbnail]
 * @property {string} description
 */

const CCTV = 'https://livechina.cctv.com/live_zb';

/** curl 验证通过 · 200 + #EXTM3U @type {PublicStream[]} */
export const VERIFIED_HLS = [
  // ── 真实公开信号 ────────────────────────────────────────────
  {
    id: 'nasa-tv-ntv1',
    title: 'NASA TV·公开频道 NTV-1',
    region: '国际·公开',
    category: 'other',
    source: 'NASA / Akamai',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    pageUrl: 'https://www.nasa.gov/live/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'NASA 官方公开 HLS（任务发布会/科普节目），CORS 开放，modal 内可播。',
  },
  {
    id: 'nasa-tv-ntv2',
    title: 'NASA TV·公开频道 NTV-2',
    region: '国际·公开',
    category: 'other',
    source: 'NASA / Akamai',
    streamUrl: 'https://ntv2.akamaized.net/hls/live/2013923/NASA-NTV2-HLS/master.m3u8',
    pageUrl: 'https://www.nasa.gov/live/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'NASA 官方第二路公开 HLS，CORS 开放，modal 内可播。',
  },
  {
    id: 'njta-turnpike-cam',
    title: '新泽西收费公路·公开路况摄像',
    region: '美国·新泽西',
    category: 'traffic',
    source: 'NJ Turnpike Authority',
    streamUrl: 'https://wink.njta.com/200/public/hls/WF05-24A0-4D14-0622-8C30_nj.m3u8',
    pageUrl: 'https://www.njta.com/travel-resources/camera-list',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'NJTA 官方公开 HLS 路况摄像，CORS 开放，modal 内可播。',
  },
  // ── HLS 演示流（curl 验证 · CORS *） ───────────────────────
  {
    id: 'hls-demo-mux',
    title: 'HLS 演示流·Big Buck Bunny',
    region: '国际·测试流',
    category: 'other',
    source: 'Mux 公开测试',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    pageUrl: 'https://test-streams.mux.dev/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Mux 官方 HLS 测试流，CORS 开放，用于验证播放器链路。',
  },
  {
    id: 'hls-demo-akamai',
    title: 'HLS 演示流·Akamai 公开测试',
    region: '国际·测试流',
    category: 'other',
    source: 'Akamai',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    pageUrl: 'https://www.akamai.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Akamai 官方 HLS 测试直播，CORS 开放，用于链路对照。',
  },
  {
    id: 'hls-demo-tears',
    title: 'HLS 演示·Tears of Steel',
    region: '国际·测试流',
    category: 'other',
    source: 'Unified Streaming',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    pageUrl: 'https://demo.unified-streaming.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Unified Streaming 公开演示流，CORS 开放，多码率自适应。',
  },
  {
    id: 'hls-demo-tears-mp4',
    title: 'HLS 演示·Tears of Steel MP4',
    region: '国际·测试流',
    category: 'other',
    source: 'Unified Streaming',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8',
    pageUrl: 'https://demo.unified-streaming.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Unified Streaming MP4 封装 HLS 演示，CORS 开放。',
  },
  {
    id: 'hls-demo-mux-alt',
    title: 'HLS 演示·Mux test_001',
    region: '国际·测试流',
    category: 'other',
    source: 'Mux 公开测试',
    streamUrl: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    pageUrl: 'https://test-streams.mux.dev/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Mux 备用 HLS 测试流，CORS 开放。',
  },
  {
    id: 'hls-demo-mux-hq',
    title: 'HLS 演示·Mux 多码率 HQ',
    region: '国际·测试流',
    category: 'other',
    source: 'Mux 公开测试',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8',
    pageUrl: 'https://test-streams.mux.dev/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Mux 多码率 HLS 切片演示，CORS 开放。',
  },
  {
    id: 'hls-demo-mux-dai',
    title: 'HLS 演示·Mux DAI discontinuity',
    region: '国际·测试流',
    category: 'other',
    source: 'Mux 公开测试',
    streamUrl: 'https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8',
    pageUrl: 'https://test-streams.mux.dev/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Mux DAI discontinuity 测试流，CORS 开放。',
  },
  {
    id: 'hls-demo-shaka-bbb',
    title: 'HLS 演示·Google Shaka BBB',
    region: '国际·测试流',
    category: 'other',
    source: 'Google Shaka Demo',
    streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    pageUrl: 'https://shaka-player-demo.appspot.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Google Shaka 官方演示 HLS，CORS 开放。',
  },
  {
    id: 'hls-demo-shaka-angel',
    title: 'HLS 演示·Google Shaka Angel One',
    region: '国际·测试流',
    category: 'other',
    source: 'Google Shaka Demo',
    streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
    pageUrl: 'https://shaka-player-demo.appspot.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'Google Shaka Angel One 演示 HLS，CORS 开放。',
  },
  {
    id: 'hls-demo-jw-bipbop',
    title: 'HLS 演示·JW Player BipBop',
    region: '国际·测试流',
    category: 'other',
    source: 'JW Player 公开测试',
    streamUrl: 'https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
    pageUrl: 'https://www.jwplayer.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'JW Player 官方 BipBop HLS 演示，CORS 开放。',
  },
  {
    id: 'hls-demo-jw-bipbop-gear1',
    title: 'HLS 演示·JW Player BipBop Gear1',
    region: '国际·测试流',
    category: 'other',
    source: 'JW Player 公开测试',
    streamUrl: 'https://playertest.longtailvideo.com/adaptive/bipbop/gear1/prog_index.m3u8',
    pageUrl: 'https://www.jwplayer.com/',
    embedType: 'hls',
    playVerified: true,
    verified: true,
    description: 'JW Player BipBop 低码率档位演示，CORS 开放。',
  },
  // ── curl 验证 · 无 CORS（开发代理 / Safari） ────────────────
  {
    id: 'hls-demo-apple-4x3',
    title: 'HLS 演示·Apple BipBop 4×3',
    region: '国际·测试流',
    category: 'other',
    source: 'Apple Developer',
    streamUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
    pageUrl: 'https://developer.apple.com/streaming/examples/',
    embedType: 'hls',
    playVerified: false,
    verified: true,
    needsProxy: true,
    description: 'Apple 官方 HLS 示例，无 CORS 头；开发环境经 Vite 代理可播，生产环境需 Safari 或外链。',
  },
  {
    id: 'hls-demo-apple-16x9',
    title: 'HLS 演示·Apple BipBop 16×9',
    region: '国际·测试流',
    category: 'other',
    source: 'Apple Developer',
    streamUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
    pageUrl: 'https://developer.apple.com/streaming/examples/',
    embedType: 'hls',
    playVerified: false,
    verified: true,
    needsProxy: true,
    description: 'Apple 16×9 HLS 示例，无 CORS 头；开发代理或 Safari 可播。',
  },
  {
    id: 'hls-demo-apple-fmp4',
    title: 'HLS 演示·Apple fMP4 BipBop',
    region: '国际·测试流',
    category: 'other',
    source: 'Apple Developer',
    streamUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    pageUrl: 'https://developer.apple.com/streaming/examples/',
    embedType: 'hls',
    playVerified: false,
    verified: true,
    needsProxy: true,
    description: 'Apple fMP4 HLS 示例，无 CORS 头；开发代理或 Safari 可播。',
  },
];

/** 官方页面外链索引 @type {PublicStream[]} */
export const EXTERNAL_INDEX = [
  // ── 熊猫直播（iframe 实测失败，降级外链） ───────────────────
  {
    id: 'ipanda-en-live',
    title: 'iPanda 熊猫频道·英文站慢直播',
    region: '四川·成都',
    category: 'panda',
    source: 'iPanda 官方',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://en.ipanda.com/live/',
    embedType: 'page',
    description: 'iPanda 英文站公开慢直播；站内 iframe 出现 302/CCTV 顶栏异常，请跳转原页面观看。',
  },
  {
    id: 'ipanda-wolong',
    title: '卧龙中华大熊猫苑神树坪基地',
    region: '四川·阿坝',
    category: 'panda',
    source: 'iPanda 官方',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://en.ipanda.com/live/',
    embedType: 'page',
    description: '与 iPanda 英文站共用公开窗口，圈舍视角随维护轮换；需外链打开。',
  },
  {
    id: 'ipanda-guangzhou',
    title: '广州长隆野生动物世界·熊猫馆',
    region: '广东·广州',
    category: 'panda',
    source: 'iPanda / 长隆',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://www.chimelong.com/',
    embedType: 'page',
    description: '长隆熊猫公开慢直播经 iPanda 英文站聚合；iframe 不可播，请跳转原页面。',
  },
  {
    id: 'ipanda-bifengxia',
    title: '雅安碧峰峡熊猫基地',
    region: '四川·雅安',
    category: 'panda',
    source: 'iPanda 官方',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://www.ipanda.com/',
    embedType: 'page',
    description: '碧峰峡基地公开频道；iframe 内嵌不可用，请跳转 iPanda 原页面。',
  },
  {
    id: 'ipanda-dujiangyan',
    title: '都江堰熊猫谷',
    region: '四川·都江堰',
    category: 'panda',
    source: 'iPanda 官方',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://www.ipanda.com/',
    embedType: 'page',
    description: '野化放归过渡区公开慢直播；iframe 不可播，请跳转原页面。',
  },
  {
    id: 'ipanda-chongqing',
    title: '重庆动物园·熊猫馆',
    region: '重庆',
    category: 'panda',
    source: 'iPanda 官方',
    streamUrl: 'https://en.ipanda.com/live/',
    pageUrl: 'https://en.ipanda.com/live/',
    embedType: 'page',
    description: '重庆动物园公开熊猫慢直播；iframe 内嵌不可用，请跳转原页面。',
  },
  {
    id: 'beijing-zoo-panda',
    title: '北京动物园·熊猫馆',
    region: '北京',
    category: 'panda',
    source: '央视频 / 北京动物园',
    streamUrl: 'https://www.yangshipin.cn/',
    pageUrl: 'https://www.yangshipin.cn/',
    embedType: 'page',
    description: '央视频等平台同步的动物园公开慢直播，X-Frame 限制需外链跳转。',
  },
  // ── 风景名胜区（央视直播中国 iframe 版权拦截，降级外链） ───
  {
    id: 'huangshan-yingke',
    title: '黄山·迎客松',
    region: '安徽·黄山',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE2780.html`,
    pageUrl: `${CCTV}/LIVE2780.html`,
    embedType: 'page',
    description: '黄山风景区公开慢直播；iframe 内嵌提示版权限制，请跳转央视直播中国原页面。',
  },
  {
    id: 'gubei-water-town',
    title: '古北水镇',
    region: '北京·密云',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE3181.html`,
    pageUrl: `${CCTV}/LIVE3181.html`,
    embedType: 'page',
    description: '北方水镇公开慢直播；iframe 内嵌版权拦截，请跳转原页面。',
  },
  {
    id: 'chengdu-anshun-bridge',
    title: '成都·安顺廊桥',
    region: '四川·成都',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE3199.html`,
    pageUrl: `${CCTV}/LIVE3199.html`,
    embedType: 'page',
    description: '锦江安顺廊桥公开慢直播；iframe 内嵌不可用，请跳转原页面。',
  },
  {
    id: 'leshan-sleeping-buddha',
    title: '乐山·睡佛',
    region: '四川·乐山',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE3193.html`,
    pageUrl: `${CCTV}/LIVE3193.html`,
    embedType: 'page',
    description: '乐山大佛景区公开慢直播；iframe 内嵌版权拦截，请跳转原页面。',
  },
  {
    id: 'jian-shui-old-town',
    title: '红河·建水古镇',
    region: '云南·红河',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE3402.html`,
    pageUrl: `${CCTV}/LIVE3402.html`,
    embedType: 'page',
    description: '建水古城公开慢直播；iframe 内嵌不可用，请跳转原页面。',
  },
  {
    id: 'jingmai-mountain',
    title: '普洱·景迈山',
    region: '云南·普洱',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE4239.html`,
    pageUrl: `${CCTV}/LIVE4239.html`,
    embedType: 'page',
    description: '景迈山古茶林公开慢直播；iframe 内嵌版权拦截，请跳转原页面。',
  },
  {
    id: 'shengsi-fishing-port',
    title: '舟山·嵊泗中心渔港',
    region: '浙江·舟山',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE4338.html`,
    pageUrl: `${CCTV}/LIVE4338.html`,
    embedType: 'page',
    description: '嵊泗群岛渔港公开慢直播；iframe 内嵌不可用，请跳转原页面。',
  },
  {
    id: 'linzhi-medog-inn',
    title: '林芝·岷山错高民宿',
    region: '西藏·林芝',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE4366.html`,
    pageUrl: `${CCTV}/LIVE4366.html`,
    embedType: 'page',
    description: '林芝高原公开慢直播；iframe 内嵌版权拦截，请跳转原页面。',
  },
  {
    id: 'huanghuacheng-great-wall',
    title: '怀柔·黄花城水长城',
    region: '北京·怀柔',
    category: 'scenic',
    source: '央视网·直播中国',
    streamUrl: `${CCTV}/LIVE2768.html`,
    pageUrl: `${CCTV}/LIVE2768.html`,
    embedType: 'page',
    description: '水长城公开慢直播；iframe 内嵌不可用，请跳转原页面。',
  },
  {
    id: 'zhangjiajie-tianmen',
    title: '张家界·天门山',
    region: '湖南·张家界',
    category: 'scenic',
    source: '张家界官方',
    streamUrl: 'https://www.zjj.gov.cn/',
    pageUrl: 'https://www.zjj.gov.cn/',
    embedType: 'page',
    description: '天门山玻璃栈道公开视角；暂无稳定 m3u8，需外链。',
  },
  {
    id: 'jiuzhaigou-valley',
    title: '九寨沟·五花海',
    region: '四川·阿坝',
    category: 'scenic',
    source: '九寨沟管理局',
    streamUrl: 'https://www.jiuzhai.com/',
    pageUrl: 'https://www.jiuzhai.com/',
    embedType: 'page',
    description: '九寨沟官方公开慢直播入口，展示五花海、诺日朗瀑布等核心景观。',
  },
  {
    id: 'xihu-duanqiao',
    title: '西湖·断桥残雪',
    region: '浙江·杭州',
    category: 'scenic',
    source: '杭州西湖景区',
    streamUrl: 'https://www.hzwestlake.com/',
    pageUrl: 'https://www.hzwestlake.com/',
    embedType: 'page',
    description: '西湖管委会公开慢直播，断桥、雷峰塔视角轮换。',
  },
  // ── 交通 / 港口（外链） ─────────────────────────────────────
  {
    id: 'shanghai-yangshan-port',
    title: '上海港·洋山深水港',
    region: '上海',
    category: 'traffic',
    source: '上港集团',
    streamUrl: 'https://www.portshanghai.com.cn/',
    pageUrl: 'https://www.portshanghai.com.cn/',
    embedType: 'page',
    description: '洋山四期自动化码头公开慢直播，展示集装箱装卸与航道通行。',
  },
  {
    id: 'hkzm-bridge',
    title: '港珠澳大桥',
    region: '广东·珠海',
    category: 'traffic',
    source: '港珠澳大桥管理局',
    streamUrl: 'https://www.hzmb.org/',
    pageUrl: 'https://www.hzmb.org/',
    embedType: 'page',
    description: '港珠澳大桥公开慢直播，青州航道桥及人工岛全景视角。',
  },
  {
    id: 'beijing-west-station',
    title: '北京西站·南广场',
    region: '北京',
    category: 'traffic',
    source: '国铁集团',
    streamUrl: 'https://www.china-railway.com.cn/',
    pageUrl: 'https://www.china-railway.com.cn/',
    embedType: 'page',
    description: '铁路枢纽公开慢直播，展示旅客集散与列车到发（非安检监控）。',
  },
  {
    id: 'guangzhou-baiyun-airport',
    title: '广州白云机场·T2',
    region: '广东·广州',
    category: 'traffic',
    source: '白云机场',
    streamUrl: 'https://www.gbiac.net/',
    pageUrl: 'https://www.gbiac.net/',
    embedType: 'page',
    description: '航站楼出发层公开慢直播，展示航班运行与旅客流量。',
  },
  {
    id: 'zhoushan-port',
    title: '宁波舟山港·鼠浪湖码头',
    region: '浙江·舟山',
    category: 'traffic',
    source: '浙江省海港集团',
    streamUrl: 'https://www.nbport.com.cn/',
    pageUrl: 'https://www.nbport.com.cn/',
    embedType: 'page',
    description: '全球第一大港公开慢直播，展示矿石中转与巨轮靠泊作业。',
  },
  {
    id: 'shenzhen-bay-bridge',
    title: '深圳湾大桥',
    region: '广东·深圳',
    category: 'traffic',
    source: '深圳市交通局',
    streamUrl: 'https://www.sz.gov.cn/',
    pageUrl: 'https://www.sz.gov.cn/',
    embedType: 'page',
    description: '深圳湾口岸公开慢直播，展示跨境车流与湾区景观。',
  },
  // ── 其他（YouTube / 天文 / 非遗外链） ─────────────────────
  {
    id: 'iss-live-nasa',
    title: '国际空间站·NASA YouTube 直播',
    region: '国际·公开',
    category: 'other',
    source: 'NASA / YouTube',
    streamUrl: 'https://www.youtube.com/watch?v=XfwatJ-qL1o',
    pageUrl: 'https://www.youtube.com/watch?v=XfwatJ-qL1o',
    embedType: 'page',
    description: 'NASA 官方 ISS 高清摄像；YouTube X-Frame 禁止 iframe 内嵌，请跳转 YouTube 原页面。',
  },
  {
    id: 'iss-earth-view',
    title: 'ISS 地球实况·24/7',
    region: '国际·公开',
    category: 'other',
    source: 'NASA / YouTube',
    streamUrl: 'https://www.youtube.com/watch?v=0FBiyFpV__g',
    pageUrl: 'https://www.youtube.com/watch?v=0FBiyFpV__g',
    embedType: 'page',
    description: '国际空间站对地连续慢直播；YouTube 禁止 iframe 内嵌，请跳转原页面。',
  },
  {
    id: 'naoc-beijing',
    title: '北京天文台·公开观测',
    region: '北京',
    category: 'other',
    source: '国家天文台',
    streamUrl: 'https://www.bao.ac.cn/',
    pageUrl: 'https://www.bao.ac.cn/',
    embedType: 'page',
    description: '国家天文台公开慢直播，兴隆观测基地星空及望远镜运行状态。',
  },
  {
    id: 'dunhuang-mogao',
    title: '敦煌·莫高窟数字展示',
    region: '甘肃·敦煌',
    category: 'other',
    source: '敦煌研究院',
    streamUrl: 'https://www.mogaoku.net/',
    pageUrl: 'https://www.mogaoku.net/',
    embedType: 'page',
    description: '莫高窟数字展示中心公开慢直播，非遗壁画保护与数字化工程。',
  },
  {
    id: 'meili-snow-mountain',
    title: '梅里雪山·飞来寺',
    region: '云南·迪庆',
    category: 'other',
    source: '迪庆州文旅局',
    streamUrl: 'https://www.diqing.gov.cn/',
    pageUrl: 'https://www.diqing.gov.cn/',
    embedType: 'page',
    description: '梅里雪山日照金山公开慢直播，卡瓦格博峰远景视角。',
  },
];

/** @type {PublicStream[]} */
export const PUBLIC_STREAMS = [...VERIFIED_HLS, ...EXTERNAL_INDEX];

export const STREAM_COUNT = PUBLIC_STREAMS.length;

const DEMO_ID_PREFIX = 'hls-demo-';

export function isDemoStream(stream) {
  return stream?.id?.startsWith(DEMO_ID_PREFIX) === true;
}

/** 站内 modal 可直接播放（playVerified） */
export function playableStreams() {
  return PUBLIC_STREAMS.filter((s) => s.playVerified === true);
}

/** curl 验证 HLS 子集 */
export function verifiedHlsStreams() {
  return VERIFIED_HLS;
}

/** 外链索引子集 */
export function externalIndexStreams() {
  return EXTERNAL_INDEX;
}

/** @type {PublicStream[]} 可内嵌播放子集（供首页预览断言） */
export const EMBED_PLAYABLE = playableStreams();

/** 首页预览：优先真实信号，演示流最多 2 路 */
export function dashboardPreviewStreams(count = 8, category = 'all') {
  const pool = category === 'all'
    ? PUBLIC_STREAMS
    : PUBLIC_STREAMS.filter((s) => s.category === category);
  const verified = pool.filter((s) => s.playVerified === true);
  const real = verified.filter((s) => !isDemoStream(s));
  const demos = verified.filter((s) => isDemoStream(s));
  const picked = [];
  const seen = new Set();

  const take = (list) => {
    for (const s of list) {
      if (picked.length >= count || seen.has(s.id)) continue;
      picked.push(s);
      seen.add(s.id);
    }
  };

  const realPriority = ['nasa-tv-ntv1', 'nasa-tv-ntv2', 'njta-turnpike-cam'];
  take(realPriority.map((id) => pool.find((s) => s.id === id)).filter(Boolean));
  take(real.filter((s) => !realPriority.includes(s.id)));

  take(demos.filter((s) => ['hls-demo-mux', 'hls-demo-akamai'].includes(s.id)));
  take(demos.filter((s) => !['hls-demo-mux', 'hls-demo-akamai'].includes(s.id)));

  take(verified);

  return picked.slice(0, count);
}

export function countPlayable() {
  return playableStreams().length;
}

export function countExternal() {
  return PUBLIC_STREAMS.filter((s) => !s.playVerified).length;
}

export function streamsByCategory(category) {
  return PUBLIC_STREAMS.filter((s) => s.category === category);
}

export function countByCategory() {
  return Object.keys(STREAM_CATEGORIES).reduce((acc, key) => {
    acc[key] = streamsByCategory(key).length;
    return acc;
  }, {});
}

export function getStream(id) {
  return PUBLIC_STREAMS.find((s) => s.id === id) || null;
}

/** 核查摘要（供页面展示） */
export const STREAM_AUDIT = {
  verifiedAt: '2026-06-11',
  verifiedHls: VERIFIED_HLS.length,
  playableInPage: countPlayable(),
  externalOnly: countExternal(),
  notes: 'iPanda/CCTV/YouTube 暂无可用 m3u8（live.ipanda.com 返回非 HLS）；17 路 curl 验证 HLS（14 路 CORS 可内嵌 + 3 路 Apple 需开发代理），31 路官方页面外链索引。',
};
