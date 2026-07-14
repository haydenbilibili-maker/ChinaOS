// ============================================================================
// 中枢看板 · 时政要闻数据源
// ----------------------------------------------------------------------------
// 策略：在线优先拉取主流媒体 RSS（经 rss2json 代理规避 CORS），失败则回退
// 内置种子（AS_OF 2026-07-14 风格标题）。开发环境若代理不可达，仍展示种子。
// 各源 RSS 端点公开可查，实际可用性随媒体调整；种子保证离线可读。
// ============================================================================
import { useState, useEffect } from 'react';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

export const AS_OF_NEWS = AS_OF_BASELINE;

/** 时政要闻最大时效（天）；超出则丢弃（RSS 归档项常见） */
export const NEWS_MAX_AGE_DAYS = 60;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 疫情/封控时代标题关键词（日期解析失败时的二次拦截） */
const STALE_PANDEMIC_RE = /新冠|疫情封控|动态清零|核酸检测|方舱医院|封城|抢菜|健康码|行程码/;

/** @typedef {{ id: string, title: string, source: string, url: string, publishedAt: string, category: string }} NewsItem */
/** @typedef {{ filteredOut: number, tooOld: number, missingDate: number, staleKeyword: number }} NewsFilterStats */

/** @type {{ id: string, label: string, badge: string, rss: string, category: string, color: string }[]} */
export const NEWS_SOURCES = [
  { id: 'cctv', label: '央视网', badge: '央视', rss: 'https://news.cctv.com/rss/china.xml', category: '时政', color: '#c41e3a' },
  { id: 'people', label: '人民日报', badge: '人民', rss: 'http://www.people.com.cn/rss/politics.xml', category: '时政', color: '#dc2626' },
  { id: 'xinhua', label: '新华社', badge: '新华', rss: 'http://www.news.cn/politics/news_politics.xml', category: '时政', color: '#2563eb' },
  { id: 'gmrb', label: '光明日报', badge: '光明', rss: 'http://www.gmw.cn/rss/politics.xml', category: '时政', color: '#7c3aed' },
  { id: 'ce', label: '经济日报', badge: '经日', rss: 'http://www.ce.cn/rss/politics.xml', category: '政经', color: '#d97706' },
  { id: 'chinanews', label: '中新网', badge: '中新', rss: 'http://www.chinanews.com.cn/rss/scroll-news.xml', category: '要闻', color: '#0891b2' },
];

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
const FETCH_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 15 * 60 * 1000;
const TITLE_MAX = 52;

let cache = /** @type {{ items: NewsItem[], fetchedAt: number, mode: string, filterStats?: NewsFilterStats } | null} */ (null);

/** 标题归一化：去标点/空白/大小写，用于跨源去重 */
export function normalizeTitle(title) {
  return (title || '')
    .replace(/[\s\u3000]+/g, '')
    .replace(/[「」『』""''【】（）()[\]《》,，。！？；：、·…—\-–]/g, '')
    .toLowerCase();
}

/** 截断展示标题 */
export function truncateTitle(title, max = TITLE_MAX) {
  const t = (title || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** 解析发布时间；无效则 null */
export function parsePublishedAt(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const d = new Date(raw.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 相对 AS_OF 的展示文案 */
export function formatNewsAge(publishedAt, refDate = AS_OF_NEWS) {
  const parsed = parsePublishedAt(publishedAt);
  if (!parsed) return '';
  const ref = parsePublishedAt(refDate) || new Date();
  const diffDays = Math.floor((ref.getTime() - parsed.getTime()) / MS_PER_DAY);
  if (diffDays <= 0) return '今天';
  if (diffDays === 1) return '1天前';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return publishedAt.slice(0, 10);
}

function isStalePandemicTitle(title) {
  return STALE_PANDEMIC_RE.test(title || '');
}

/**
 * 时效性校验：排序前/去重前调用。
 * @param {NewsItem[]} items
 * @param {{ maxAgeDays?: number, referenceDate?: Date, allowMissingDate?: boolean }} [opts]
 * @returns {{ items: NewsItem[], stats: NewsFilterStats }}
 */
export function filterTimelyNews(items, opts = {}) {
  const maxAgeDays = opts.maxAgeDays ?? NEWS_MAX_AGE_DAYS;
  const ref = opts.referenceDate ?? parsePublishedAt(AS_OF_NEWS) ?? new Date();
  const allowMissingDate = opts.allowMissingDate ?? false;
  const maxMs = maxAgeDays * MS_PER_DAY;

  /** @type {NewsFilterStats} */
  const stats = { filteredOut: 0, tooOld: 0, missingDate: 0, staleKeyword: 0 };
  const timely = [];

  for (const item of items) {
    if (isStalePandemicTitle(item.title)) {
      stats.filteredOut += 1;
      stats.staleKeyword += 1;
      continue;
    }

    const parsed = parsePublishedAt(item.publishedAt);
    if (!parsed) {
      if (allowMissingDate) {
        timely.push(item);
      } else {
        stats.filteredOut += 1;
        stats.missingDate += 1;
      }
      continue;
    }

    const ageMs = ref.getTime() - parsed.getTime();
    if (ageMs < 0 || ageMs > maxMs) {
      stats.filteredOut += 1;
      stats.tooOld += 1;
      continue;
    }

    timely.push(item);
  }

  return { items: timely, stats };
}

/** 按归一化标题去重，保留先出现的条目（通常更新鲜） */
export function dedupeNewsItems(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = normalizeTitle(item.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function parseRss2Json(data, sourceMeta) {
  if (!data || data.status !== 'ok' || !Array.isArray(data.items)) return [];
  return data.items.slice(0, 20).map((row, i) => ({
    id: `${sourceMeta.id}-${row.guid || row.link || i}`,
    title: (row.title || '').replace(/<[^>]+>/g, '').trim(),
    source: sourceMeta.label,
    url: row.link || '#',
    publishedAt: row.pubDate || '',
    category: sourceMeta.category,
  })).filter((x) => x.title);
}

async function fetchSource(sourceMeta) {
  const url = `${RSS2JSON}${encodeURIComponent(sourceMeta.rss)}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) return [];
    const json = await res.json();
    return parseRss2Json(json, sourceMeta);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/** 内置种子 · 2025–2026 风格时政/政经标题（离线兜底） */
export const NEWS_SEED = /** @type {NewsItem[]} */ ([
  { id: 'seed-1', title: '习近平主持召开中央全面深化改革委员会会议', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-06-10', category: '时政' },
  { id: 'seed-2', title: '李强主持国务院常务会 部署稳就业稳外贸一揽子举措', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-06-09', category: '政经' },
  { id: 'seed-3', title: '全国人大常委会审议多部法律草案 聚焦数字经济与数据安全', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-06-08', category: '时政' },
  { id: 'seed-4', title: '央行：继续实施适度宽松货币政策 保持流动性合理充裕', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-06-07', category: '政经' },
  { id: 'seed-5', title: '外交部：中方愿同各方一道维护多边贸易体制', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-06-07', category: '时政' },
  { id: 'seed-6', title: '全国夏粮小麦收获进度过半 主产区机收率超九成', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-06-06', category: '政经' },
  { id: 'seed-7', title: '赵乐际同外国议会领导人举行会谈 深化立法机构交往', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-06-05', category: '时政' },
  { id: 'seed-8', title: '王沪宁出席统一战线主题调研 强调凝聚共识服务大局', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-06-05', category: '时政' },
  { id: 'seed-9', title: '蔡奇在党纪学习教育座谈会上强调常态长效推进', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-06-04', category: '时政' },
  { id: 'seed-10', title: '丁薛祥调研科技自立自强 强调关键核心技术攻关', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-06-04', category: '政经' },
  { id: 'seed-11', title: '国务院印发关于加快培育新质生产力的指导意见', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-06-03', category: '政经' },
  { id: 'seed-12', title: '国家发改委：一批重大工程年内开工 扩大有效投资', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-06-03', category: '政经' },
  { id: 'seed-13', title: '商务部回应经贸摩擦：反对单边主义 坚定维护企业权益', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-06-02', category: '政经' },
  { id: 'seed-13b', title: '商务部回应经贸摩擦 反对单边主义维护企业权益', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-06-02', category: '政经' },
  { id: 'seed-14', title: '李希在纪检监察系统部署深化整治群众身边不正之风', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-06-01', category: '时政' },
  { id: 'seed-15', title: '全国高考平稳开考 各地保障考生赴考绿色通道', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-06-07', category: '要闻' },
  { id: 'seed-16', title: '长三角一体化示范区发布年度制度创新清单', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-30', category: '政经' },
  { id: 'seed-17', title: '中央军委举行晋升上将军衔仪式 习近平颁发命令状', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-05-29', category: '时政' },
  { id: 'seed-18', title: '国务院国资委：推动央企加快布局战略性新兴产业', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-05-28', category: '政经' },
  { id: 'seed-19', title: '外交部发言人就台海局势答问 强调一个中国原则不可撼动', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-05-27', category: '时政' },
  { id: 'seed-20', title: '全国铁路端午假期发送旅客预计超6000万人次', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-05-26', category: '要闻' },
  { id: 'seed-21', title: '金融监管总局：稳妥处置中小金融机构风险', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-25', category: '政经' },
  { id: 'seed-22', title: '生态环境部发布空气质量改善行动计划年度进展', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-05-24', category: '政经' },
  { id: 'seed-23', title: '李强会见来华出席论坛的外方嘉宾 强调开放合作', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-05-23', category: '时政' },
  { id: 'seed-24', title: '农业农村部：夏粮收购旺季启动 最低收购价政策托底', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-05-22', category: '政经' },
  { id: 'seed-25', title: '国家能源局：可再生能源装机占比持续提升', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-21', category: '政经' },
  { id: 'seed-26', title: '中办国办印发意见 加强基层治理体系和能力建设', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-05-20', category: '时政' },
  { id: 'seed-27', title: '海关总署：前五月进出口总值稳中有升 外贸结构优化', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-05-19', category: '政经' },
  { id: 'seed-28', title: '全国统战部长会议在京召开 部署民族宗教工作重点', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-05-18', category: '时政' },
  { id: 'seed-29', title: '工信部：人工智能+行动方案落地 培育智能终端消费', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-17', category: '政经' },
  { id: 'seed-30', title: '习近平复信青年学者 勉励深耕基础研究服务强国建设', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-05-16', category: '时政' },
  { id: 'seed-31', title: '国务院台办：坚决反对任何形式「台独」分裂行径', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-05-15', category: '时政' },
  { id: 'seed-32', title: '财政部：加大财政支出力度 支持两重两新建设', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-05-14', category: '政经' },
  { id: 'seed-33', title: '国家医保局：新版药品目录调整启动 聚焦创新药', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-05-13', category: '政经' },
  { id: 'seed-34', title: '最高法发布典型案例 规范涉企执法司法', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-05-12', category: '时政' },
  { id: 'seed-35', title: '李强在地方调研时强调 以高质量项目支撑稳增长', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-05-11', category: '政经' },
  { id: 'seed-36', title: '全国安全生产电视电话会议部署隐患排查整治', source: '央视网', url: 'https://news.cctv.com/', publishedAt: '2026-05-10', category: '要闻' },
  { id: 'seed-37', title: '央行开展买断式逆回购 维护年中流动性平稳', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-09', category: '政经' },
  { id: 'seed-38', title: '国新办发布会介绍「十五五」规划编制进展', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-05-08', category: '时政' },
  { id: 'seed-39', title: '外交部：中方欢迎更多国家加入「一带一路」合作', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-05-07', category: '时政' },
  { id: 'seed-40', title: '全国青年发展论坛在京开幕 聚焦就业与创新创业', source: '光明日报', url: 'https://www.gmw.cn/', publishedAt: '2026-05-06', category: '要闻' },
  { id: 'seed-41', title: '「十五五」规划编制工作座谈会强调高质量谋划发展蓝图', source: '新华社', url: 'https://www.news.cn/', publishedAt: '2026-06-01', category: '时政' },
  { id: 'seed-42', title: '国务院部署「人工智能+」行动 推动大模型行业落地', source: '经济日报', url: 'https://www.ce.cn/', publishedAt: '2026-05-31', category: '政经' },
  { id: 'seed-43', title: '两岸学者论坛在厦门举行 共话融合与和平发展', source: '中新网', url: 'https://www.chinanews.com.cn/', publishedAt: '2026-05-30', category: '时政' },
  { id: 'seed-44', title: '新质生产力调研行：多地培育未来产业先导区', source: '人民日报', url: 'https://www.people.com.cn/', publishedAt: '2026-05-29', category: '政经' },
]);

function prepareNewsPipeline(rawItems, { allowMissingDate = false } = {}) {
  const sorted = sortByDate(rawItems);
  const { items: timely, stats } = filterTimelyNews(sorted, { allowMissingDate });
  const items = dedupeNewsItems(timely).slice(0, 48);
  return { items, stats };
}

export function getSourceBadge(sourceLabel) {
  const hit = NEWS_SOURCES.find((s) => s.label === sourceLabel || sourceLabel?.includes(s.label));
  return hit || { badge: sourceLabel?.slice(0, 2) || '要闻', color: '#64748b' };
}

function sortByDate(items) {
  return [...items].sort((a, b) => {
    const ta = Date.parse(a.publishedAt) || 0;
    const tb = Date.parse(b.publishedAt) || 0;
    return tb - ta;
  });
}

/**
 * 拉取主流媒体 RSS 并去重；全失败则返回种子。
 * @returns {Promise<{ items: NewsItem[], mode: 'live' | 'seed' | 'cached', filterStats?: NewsFilterStats, error?: string }>}
 */
export async function fetchNewsFeed() {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return {
      items: cache.items,
      mode: 'cached',
      filterStats: cache.filterStats,
    };
  }

  const results = await Promise.allSettled(
    NEWS_SOURCES.map((src) => fetchSource(src)),
  );

  const liveRaw = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value?.length) liveRaw.push(...r.value);
  }

  const livePrepared = prepareNewsPipeline(liveRaw, { allowMissingDate: false });

  if (livePrepared.items.length >= 5) {
    cache = {
      items: livePrepared.items,
      fetchedAt: now,
      mode: 'live',
      filterStats: livePrepared.stats,
    };
    return {
      items: livePrepared.items,
      mode: 'live',
      filterStats: livePrepared.stats,
    };
  }

  const seedPrepared = prepareNewsPipeline(NEWS_SEED, { allowMissingDate: true });
  cache = {
    items: seedPrepared.items,
    fetchedAt: now,
    mode: 'seed',
    filterStats: seedPrepared.stats,
  };

  const filterNote = livePrepared.stats.filteredOut > 0
    ? `已滤除 ${livePrepared.stats.filteredOut} 条过期`
    : null;

  return {
    items: seedPrepared.items,
    mode: 'seed',
    filterStats: liveRaw.length ? livePrepared.stats : seedPrepared.stats,
    error: liveRaw.length && filterNote ? `${filterNote}，已回退种子` : null,
  };
}

const INITIAL_SEED = prepareNewsPipeline(NEWS_SEED, { allowMissingDate: true });

/** 清除 RSS 缓存（供看板周期刷新联动） */
export function clearNewsCache() {
  cache = null;
}

/** React hook：时政要闻列表 + 加载/离线状态 */
export function useNewsFeed(refreshKey = 0) {
  const [state, setState] = useState({
    items: INITIAL_SEED.items,
    status: 'loading',
    mode: 'seed',
    error: null,
    filterStats: INITIAL_SEED.stats,
  });

  useEffect(() => {
    let alive = true;
    if (refreshKey > 0) clearNewsCache();
    setState((s) => ({ ...s, status: 'loading' }));
    fetchNewsFeed()
      .then(({ items, mode, error, filterStats }) => {
        if (!alive) return;
        setState({
          items,
          status: navigator.onLine === false ? 'offline' : 'ready',
          mode,
          error: error || null,
          filterStats: filterStats || null,
        });
      })
      .catch(() => {
        if (!alive) return;
        setState({
          items: INITIAL_SEED.items,
          status: 'error',
          mode: 'seed',
          error: '拉取失败，已回退种子',
          filterStats: INITIAL_SEED.stats,
        });
      });

    const onOffline = () => setState((s) => ({ ...s, status: 'offline' }));
    const onOnline = () => {
      fetchNewsFeed().then(({ items, mode, error, filterStats }) => {
        if (!alive) return;
        setState({ items, status: 'ready', mode, error: error || null, filterStats: filterStats || null });
      }).catch(() => {});
    };
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      alive = false;
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [refreshKey]);

  return state;
}
