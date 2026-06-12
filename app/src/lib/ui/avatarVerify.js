/**
 * 头像核验：仅当可证实为本人肖像时才返回 URL。
 * verifyTier: 'verified_portrait' | 'empty'
 */

export const VERIFY_TIER = {
  VERIFIED: 'verified_portrait',
  EMPTY: 'empty',
};

const BAD_URL_RE = [
  /landscape/i, /scenery/i, /panorama/i, /cityscape/i, /skyline/i,
  /building/i, /architecture/i, /monument/i, /temple/i, /palace/i,
  /anime/i, /cartoon/i, /manga/i, /illustration/i, /drawing/i,
  /logo/i, /emblem/i, /flag/i, /map/i, /diagram/i, /chart/i,
  /风景/, /建筑/, /卡通/, /动漫/, /插画/, /标志/, /徽章/, /地图/,
  /Category:[^/]*[Ll]andscape/, /Category:[^/]*[Ss]cenery/,
  /\.svg(?:\?|$)/i,
];

const BAD_FILE_RE = [
  /landscape/i, /scenery/i, /building/i, /architecture/i,
  /anime/i, /cartoon/i, /logo/i, /emblem/i, /flag/i,
  /风景/, /建筑/, /卡通/, /动漫/, /标志/,
];

const INSTITUTION_RE = /(大学|学院|研究院|研究所|研究中心|实验室|学校|公司|集团|委员会|基金会|博物馆|图书馆|医院|中心$|部$)/;

const DISAMBIG_RE = /消歧义|disambiguation/i;

/** @param {string} [url] */
export function isBadImageUrl(url) {
  if (!url?.trim()) return true;
  return BAD_URL_RE.some((re) => re.test(url));
}

/** @param {string} [fileName] */
export function isBadImageFileName(fileName) {
  if (!fileName?.trim()) return true;
  return BAD_FILE_RE.some((re) => re.test(fileName));
}

/** @param {string} [title] */
export function isInstitutionTitle(title) {
  if (!title?.trim()) return false;
  return INSTITUTION_RE.test(title.trim());
}

/** @param {string} [wikiTitle] @param {string} [personName] @param {string} [nameEn] */
export function wikiTitleMatchesPerson(wikiTitle, personName, nameEn = '') {
  const title = (wikiTitle || '').trim();
  const name = (personName || '').trim();
  if (!title || !name) return false;
  if (isInstitutionTitle(title)) return false;

  const baseTitle = title.replace(/\s*\([^)]*\)\s*$/, '').trim();

  if (nameEn?.trim()) {
    const en = nameEn.trim().toLowerCase();
    const t = title.toLowerCase();
    if (t === en || t.startsWith(`${en} `) || baseTitle.toLowerCase() === en) return true;
    const parts = en.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts.every((p) => t.includes(p))) return true;
  }

  if (/[\u4e00-\u9fff]/.test(name)) {
    if (title.includes(name) || name.includes(baseTitle)) return true;
    if (name.length >= 2 && baseTitle.includes(name[0]) && baseTitle.length <= name.length + 8) return true;
    return false;
  }

  return title.toLowerCase().includes(name.toLowerCase())
    || name.toLowerCase().includes(baseTitle.toLowerCase());
}

/** @param {object} [page] */
export function isDisambiguationPage(page) {
  if (!page || page.missing !== undefined) return true;
  if (page.pageprops?.disambiguation !== undefined) return true;
  const title = page.title || '';
  if (DISAMBIG_RE.test(title)) return true;
  const cats = page.categories || [];
  return cats.some((c) => DISAMBIG_RE.test(c.title || ''));
}

/** @param {string} [desc] */
export function imageDescriptionLooksNonPortrait(desc) {
  if (!desc) return false;
  const text = String(desc).replace(/<[^>]+>/g, ' ').toLowerCase();
  const flags = [
    'landscape', 'scenery', 'building', 'architecture', 'cityscape', 'panorama',
    'anime', 'cartoon', 'manga', 'illustration', 'logo', 'emblem', 'flag', 'map',
    '风景', '建筑', '卡通', '动漫', '插画', '标志', '徽章', '地图', '全景',
  ];
  return flags.some((f) => text.includes(f));
}

/**
 * @param {string} thumbUrl
 * @param {string} [fileName]
 * @param {string} [description]
 */
export function verifyPortraitCandidate(thumbUrl, fileName, description) {
  if (!thumbUrl || isBadImageUrl(thumbUrl)) {
    return { ok: false, tier: VERIFY_TIER.EMPTY, reason: 'bad_url' };
  }
  if (fileName && isBadImageFileName(fileName)) {
    return { ok: false, tier: VERIFY_TIER.EMPTY, reason: 'bad_filename' };
  }
  if (imageDescriptionLooksNonPortrait(description)) {
    return { ok: false, tier: VERIFY_TIER.EMPTY, reason: 'bad_description' };
  }
  return { ok: true, tier: VERIFY_TIER.VERIFIED, url: thumbUrl };
}

/**
 * @param {object} meta
 * @returns {boolean}
 */
export function canAttemptVerifiedFetch(meta) {
  if (meta?.verifyTier === VERIFY_TIER.VERIFIED && meta?.avatarUrl) return true;
  if (meta?.verifyTier === VERIFY_TIER.VERIFIED && meta?.wikiTitle) return true;
  if (meta?.source === 'curated' && meta?.wikiTitle) return true;
  return false;
}

/**
 * @param {object} meta
 * @returns {{ url: string|null, tier: string }}
 */
export function resolveStaticAvatar(meta) {
  if (meta?.avatarUrl && meta?.verifyTier === VERIFY_TIER.VERIFIED) {
    const check = verifyPortraitCandidate(meta.avatarUrl);
    if (check.ok) return { url: check.url, tier: VERIFY_TIER.VERIFIED };
  }
  return { url: null, tier: VERIFY_TIER.EMPTY };
}
