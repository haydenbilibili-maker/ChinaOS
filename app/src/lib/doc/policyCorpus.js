// ============================================================================
// 本地政策原文库 · manifest + fetch
// 文件位于 app/public/policy-corpus/ → 浏览器访问 /policy-corpus/...
// ============================================================================

const CORPUS_BASE = '/policy-corpus';
const MANIFEST_URL = `${CORPUS_BASE}/manifest.json`;

/** @type {Promise<{ version: number, generatedAt: string, entries: Record<string, object> }> | null} */
let _manifestPromise = null;

/** @type {Map<string, Promise<string>>} */
const _bodyCache = new Map();

export const POLICY_CORPUS_STUB_THRESHOLD = 500;

export const POLICY_CORPUS_TIER_LABELS = {
  full: '本地全文',
  excerpt: '原文节选',
  extended: '扩展汇编',
  stub: '原文节选 · 不完整',
};

/** @param {'full'|'excerpt'|'extended'|'stub'|null|undefined} tier */
export function corpusListBadge(tier) {
  if (tier === 'full') return { text: '本地全文', color: '#10b981' };
  if (tier === 'excerpt' || tier === 'extended') return { text: '原文节选', color: '#e8a317' };
  if (tier === 'stub') return { text: '原文节选', color: '#f97316' };
  return null;
}

export const POLICY_CORPUS_BADGE = {
  local: { bg: 'rgba(16,185,129,0.14)', color: '#10b981', border: 'rgba(16,185,129,0.35)' },
  fallback: { bg: 'rgba(100,116,139,0.14)', color: '#94a3b8', border: 'rgba(100,116,139,0.35)' },
};

export const POLICY_CORPUS_DISCLAIMER =
  '本地存档仅供研究学习，以国务院及部委官方发布文本为准；引用与决策请以中国政府网及权威发布渠道公布的全文为准。';

/** @returns {Promise<{ version: number, generatedAt: string, entries: Record<string, object> }>} */
export async function loadPolicyCorpusManifest() {
  if (!_manifestPromise) {
    _manifestPromise = fetch(MANIFEST_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`);
        return r.json();
      })
      .catch((err) => {
        _manifestPromise = null;
        throw err;
      });
  }
  return _manifestPromise;
}

/** @param {string} id */
export async function getCorpusEntry(id) {
  if (!id) return null;
  const manifest = await loadPolicyCorpusManifest();
  return manifest.entries?.[id] || null;
}

/** @param {string} corpusFile */
export function corpusFileUrl(corpusFile) {
  if (!corpusFile) return null;
  return `${CORPUS_BASE}/${corpusFile.replace(/^\//, '')}`;
}

/** @param {string} id */
export async function fetchCorpusBody(id) {
  const entry = await getCorpusEntry(id);
  if (!entry?.corpusFile) return null;

  const url = corpusFileUrl(entry.corpusFile);
  if (_bodyCache.has(url)) return _bodyCache.get(url);

  const promise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`corpus ${r.status}`);
      return r.text();
    })
    .catch((err) => {
      _bodyCache.delete(url);
      throw err;
    });

  _bodyCache.set(url, promise);
  return promise;
}

/** @param {string} id */
export async function hasLocalCorpus(id) {
  try {
    const entry = await getCorpusEntry(id);
    return Boolean(entry?.corpusFile);
  } catch {
    return false;
  }
}

export function invalidateCorpusCache() {
  _manifestPromise = null;
  _bodyCache.clear();
}

/** @returns {Promise<number>} */
export async function countCorpusFiles() {
  try {
    const manifest = await loadPolicyCorpusManifest();
    return Object.values(manifest.entries || {}).filter((e) => e.corpusFile).length;
  } catch {
    return 0;
  }
}
