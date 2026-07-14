#!/usr/bin/env node
/**
 * 核验并写入政要头像覆盖表（失败封闭：无把握则首字母，禁止错脸）
 *
 * 策略：
 * 1. 仅对高价值队列（政治局常委 / 副国级 / 省级正职 / 中央部长）尝试 Wikimedia
 * 2. 禁止搜索兜底；仅试「姓名」与「姓名 (出生年)」确定性标题
 * 3. 消歧义页 / 无缩略图 / 摘要不含出生年 → 跳过
 * 4. 同 wiki 页映射到不同人 → 冲突双方均剔除
 * 5. BY_NAME 仅保留全域唯一姓名；同名多人只写 BY_ID（figureStableId）
 *
 * Usage:
 *   node scripts/resolveVerifiedAvatars.mjs
 *   node scripts/resolveVerifiedAvatars.mjs --limit 40
 *   node scripts/resolveVerifiedAvatars.mjs --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'app/src/lib/db/avatarOverrides.js');
const REPORT = path.join(ROOT, 'reports/avatar-verify-report.json');
const UA = 'china2OS-avatar-resolve/1.0 (research; local batch; mailto:local)';

const args = process.argv.slice(2);
const LIMIT = Number(args.find((a, i) => args[i - 1] === '--limit') || 0) || 220;
const DRY = args.includes('--dry-run');
const MIN_DELAY = Number(args.find((a, i) => args[i - 1] === '--delay') || 0) || 1100;

const BAD_URL_RE = /landscape|scenery|building|architecture|anime|cartoon|logo|emblem|flag|\.svg(?:\?|$)|风景|建筑|卡通|动漫/i;
const DISAMBIG_RE = /消歧义|disambiguation/i;
const INSTITUTION_RE = /(大学|学院|研究院|研究所|研究中心|实验室|学校|公司|集团|委员会|基金会|博物馆|图书馆|医院|中心$|部$)/;

/** 已知消歧（胜过裸姓名） */
const TITLE_FORCE = {
  李强: '李强 (1959年)', // 国务院总理；社会学李强 / 市长李强另作年号消歧
  习近平: '习近平',
  赵乐际: '赵乐际',
  王沪宁: '王沪宁',
  蔡奇: '蔡奇',
  丁薛祥: '丁薛祥',
  李希: '李希',
  何立峰: '何立峰',
  张国清: '张国清',
  刘国中: '刘国中',
  王毅: '王毅',
  王小洪: '王小洪',
  谌贻琴: '谌贻琴',
  吴政隆: '吴政隆',
  王浩: '王浩 (1963年)', // 浙江省委书记
  王宁: '王宁 (1961年)', // 云南省委书记
  陈刚: '陈刚 (1965年)', // 广西党委书记
  黄强: '黄强 (1963年)', // 吉林省委书记
  刘宁: '刘宁 (1962年)',
  林武: '林武 (1962年)',
  王君正: '王君正',
  陈小江: '陈小江',
  关志鸥: '关志鸥',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    await sleep(MIN_DELAY * (attempt === 0 ? 1 : 1.4 ** attempt));
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (res.status === 429 || res.status === 503) {
      const wait = 4000 * (attempt + 1);
      console.log(`(rate-limit, wait ${wait}ms)`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  throw new Error('HTTP 429');
}

function birthYear(birth = '') {
  const m = String(birth).match(/(19|20)\d{2}/);
  return m ? m[0] : '';
}

function isPriority(f) {
  if (!f?.name || /暂缺|vacancy/i.test(f.name)) return false;
  if (f.level === '党和国家领导人' || f.level === '副国级') return true;
  if (f.level === '省部级') {
    const blob = `${f.role || ''} ${f.fields?.title || ''}`;
    if (/党委书记|省委书记|市委书记|省长|市长|自治区主席|部长|主任|院长|检察长/.test(blob)
      && !/副书记|副省长|副市长|副部长|副主任|副院长|副检察长|常务副/.test(blob)) {
      return true;
    }
  }
  if (f.province === '中央' && f.level === '省部级') return true;
  return false;
}

function candidateTitles(name, birth) {
  const y = birthYear(birth);
  const out = [];
  if (TITLE_FORCE[name]) out.push(TITLE_FORCE[name]);
  out.push(name);
  if (y) {
    out.push(`${name} (${y}年)`);
    out.push(`${name} (${y}年生)`);
  }
  return [...new Set(out)].filter((t) => !INSTITUTION_RE.test(t));
}

function wikiTitleMatchesPerson(wikiTitle, personName) {
  const title = (wikiTitle || '').trim();
  const name = (personName || '').trim();
  if (!title || !name) return false;
  if (INSTITUTION_RE.test(title)) return false;
  return title.includes(name);
}

async function probeWikiTitle(title, lang, personName, year, { requireBirthInExtract = false } = {}) {
  if (!wikiTitleMatchesPerson(title, personName)) {
    return { ok: false, reason: 'title_mismatch' };
  }
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages|pageprops|categories|extracts|info',
    piprop: 'thumbnail|name',
    pithumbsize: '320',
    cllimit: '20',
    exintro: '1',
    explaintext: '1',
    redirects: '1',
    format: 'json',
    origin: '*',
  });
  const data = await fetchJson(`https://${lang}.wikipedia.org/w/api.php?${params}`);
  const page = Object.values(data?.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return { ok: false, reason: 'missing' };
  if (page.pageprops?.disambiguation !== undefined) return { ok: false, reason: 'disambiguation' };
  if (DISAMBIG_RE.test(page.title || '')) return { ok: false, reason: 'disambiguation' };
  const cats = page.categories || [];
  if (cats.some((c) => DISAMBIG_RE.test(c.title || ''))) return { ok: false, reason: 'disambiguation' };

  const resolvedTitle = page.title || title;
  if (!wikiTitleMatchesPerson(resolvedTitle, personName)) {
    return { ok: false, reason: 'redirect_mismatch' };
  }

  const titleHasYear = year && resolvedTitle.includes(year);
  const extract = page.extract || '';
  if (requireBirthInExtract && year && !titleHasYear) {
    if (!extract.includes(year)) {
      return { ok: false, reason: 'birth_year_not_in_extract', resolvedTitle };
    }
  }

  const thumb = page.thumbnail?.source;
  const fileName = page.pageimage || page.thumbnail?.name || '';
  if (!thumb) return { ok: false, reason: 'no_thumbnail', resolvedTitle };
  if (BAD_URL_RE.test(thumb) || (fileName && BAD_URL_RE.test(fileName))) {
    return { ok: false, reason: 'bad_image', resolvedTitle };
  }

  return {
    ok: true,
    wikiTitle: resolvedTitle,
    wikiLang: lang,
    avatarUrl: thumb,
    pageId: page.pageid,
    reason: 'verified',
  };
}

async function resolvePerson(entry, { nameIsAmbiguous = false } = {}) {
  const { name, birth } = entry;
  const year = birthYear(birth);
  // 同名强制消歧时，跳过裸姓名试探（李强等）
  const titles = candidateTitles(name, birth).filter((t) => {
    if (TITLE_FORCE[name] && t === name && TITLE_FORCE[name] !== name) return false;
    return true;
  });

  for (const title of titles) {
    try {
      const requireBirth = nameIsAmbiguous || (!TITLE_FORCE[name] && title === name);
      const r = await probeWikiTitle(title, 'zh', name, year, { requireBirthInExtract: requireBirth });
      if (r.ok) {
        return {
          wikiTitle: r.wikiTitle,
          wikiLang: 'zh',
          avatarUrl: r.avatarUrl,
          source: 'curated',
          verifyTier: 'verified_portrait',
          pageId: r.pageId,
          probe: title,
        };
      }
    } catch (e) {
      return { fail: String(e.message || e) };
    }
  }
  return { fail: 'no_verified_portrait' };
}

function parseExistingOverrides() {
  if (!fs.existsSync(OUT)) return { byId: {}, byName: {}, stats: {} };
  const text = fs.readFileSync(OUT, 'utf8');
  const byId = {};
  const byName = {};
  const idBlock = text.match(/export const AVATAR_OVERRIDES_BY_ID = \{([\s\S]*?)\n\};/);
  const nameBlock = text.match(/export const AVATAR_OVERRIDES_BY_NAME = \{([\s\S]*?)\n\};/);
  function fill(block, target) {
    if (!block) return;
    const re = /^\s*("(?:\\.|[^"])*")\s*:\s*\{([^}]*)\}\s*,?\s*$/gm;
    let m;
    while ((m = re.exec(block[1]))) {
      const key = JSON.parse(m[1]);
      const ov = {};
      for (const km of m[2].matchAll(/(\w+):\s*("(?:\\.|[^"])*")/g)) {
        ov[km[1]] = JSON.parse(km[2]);
      }
      target[key] = ov;
    }
  }
  fill(idBlock, byId);
  fill(nameBlock, byName);
  return { byId, byName };
}

function jsStr(s) {
  return JSON.stringify(s);
}

function writeOverrides(byId, byName, stats) {
  const lines = [
    '// ============================================================================',
    '// 人才头像 · 离线覆盖表（经 resolveVerifiedAvatars.mjs 核验）',
    '// 生成：scripts/resolveVerifiedAvatars.mjs — 勿手改核验字段；可重跑脚本更新',
    '// 规则：verified_portrait / curated 才可拉网；失败封闭为首字母；同名冲突仅 BY_ID',
    '// ============================================================================',
    '',
    `export const AVATAR_OVERRIDE_STATS = ${JSON.stringify(stats)};`,
    '',
    '/** @type {Record<string, { avatarUrl?: string, wikiTitle?: string, wikiLang?: string, nameEn?: string, source?: string, verifyTier?: string }>} */',
    'export const AVATAR_OVERRIDES_BY_ID = {',
  ];
  for (const fid of Object.keys(byId).sort()) {
    const ov = byId[fid];
    const parts = [];
    for (const k of ['avatarUrl', 'wikiTitle', 'wikiLang', 'nameEn', 'source', 'verifyTier']) {
      if (ov[k]) parts.push(`${k}: ${jsStr(ov[k])}`);
    }
    if (parts.length) lines.push(`  ${jsStr(fid)}: { ${parts.join(', ')} },`);
  }
  lines.push('};', '');
  lines.push('/** @type {Record<string, { avatarUrl?: string, wikiTitle?: string, wikiLang?: string, nameEn?: string, source?: string, verifyTier?: string }>} */');
  lines.push('export const AVATAR_OVERRIDES_BY_NAME = {');
  for (const name of Object.keys(byName).sort()) {
    const ov = byName[name];
    const parts = [];
    for (const k of ['avatarUrl', 'wikiTitle', 'wikiLang', 'nameEn', 'source', 'verifyTier']) {
      if (ov[k]) parts.push(`${k}: ${jsStr(ov[k])}`);
    }
    if (parts.length) lines.push(`  ${jsStr(name)}: { ${parts.join(', ')} },`);
  }
  lines.push('};', '');
  fs.writeFileSync(OUT, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  const seedMod = await import(pathToFileURL(path.join(ROOT, 'app/src/lib/db/figureSeed.js')).href);
  const dedupeMod = await import(pathToFileURL(path.join(ROOT, 'app/src/lib/db/figureDedupe.js')).href);
  const { FIGURE_SEED } = seedMod;
  const { figureStableId } = dedupeMod;

  const all = FIGURE_SEED.map((f) => ({
    ...f,
    id: figureStableId(f),
  }));

  // 姓名全局计数（用于 BY_NAME 唯一性）
  const nameCount = new Map();
  for (const f of all) {
    nameCount.set(f.name, (nameCount.get(f.name) || 0) + 1);
  }

  const priority = all.filter(isPriority);
  console.log(`FIGURE_SEED=${all.length}, priority=${priority.length}, limit=${LIMIT}`);

  const existing = parseExistingOverrides();
  const byId = { ...existing.byId };

  // 清除已知错误：清华社会学「李强」不得挂总理维基页
  if (byId['ce-x-soc01']?.wikiTitle === '李强') {
    delete byId['ce-x-soc01'];
    console.log('stripped bad override ce-x-soc01 → 李强');
  }

  const results = [];
  const pageOwners = new Map(); // pageId|wikiTitle → [{id,name}]
  let attempted = 0;

  for (const f of priority) {
    if (attempted >= LIMIT) break;
    // 已核验且有 URL：跳过网络（支持断点续跑）
    if (byId[f.id]?.verifyTier === 'verified_portrait' && byId[f.id]?.avatarUrl && byId[f.id]?.wikiTitle) {
      results.push({
        id: f.id,
        name: f.name,
        status: 'ok',
        wikiTitle: byId[f.id].wikiTitle,
        avatarUrl: byId[f.id].avatarUrl,
        cached: true,
      });
      const key = `t:${byId[f.id].wikiTitle}`;
      if (!pageOwners.has(key)) pageOwners.set(key, []);
      pageOwners.get(key).push({ id: f.id, name: f.name, birth: f.fields?.birth || '' });
      continue;
    }
    attempted += 1;
    process.stdout.write(`[${attempted}/${Math.min(LIMIT, priority.length)}] ${f.name}… `);
    const resolved = await resolvePerson(
      { name: f.name, birth: f.fields?.birth || '' },
      { nameIsAmbiguous: (nameCount.get(f.name) || 0) > 1 },
    );
    if (resolved.fail) {
      console.log(`skip (${resolved.fail})`);
      results.push({ id: f.id, name: f.name, status: 'fail', reason: resolved.fail });
      const transient = /HTTP 429|HTTP 503|fetch/i.test(resolved.fail);
      // 失败封闭：仅去掉未核验 zh-default 的拉取暗示；保留已核验；瞬时错误不删库
      if (!transient && byId[f.id] && byId[f.id].verifyTier !== 'verified_portrait') {
        if (byId[f.id].source === 'zh-default') {
          // keep as metadata-only
        } else if (byId[f.id].source === 'curated' && !byId[f.id].avatarUrl) {
          delete byId[f.id];
        }
      }
      continue;
    }
    console.log(`OK ${resolved.wikiTitle}`);
    const key = `p:${resolved.pageId || resolved.wikiTitle}`;
    if (!pageOwners.has(key)) pageOwners.set(key, []);
    pageOwners.get(key).push({ id: f.id, name: f.name, birth: f.fields?.birth || '' });
    byId[f.id] = {
      wikiTitle: resolved.wikiTitle,
      wikiLang: resolved.wikiLang,
      avatarUrl: resolved.avatarUrl,
      source: 'curated',
      verifyTier: 'verified_portrait',
    };
    results.push({
      id: f.id,
      name: f.name,
      status: 'ok',
      wikiTitle: resolved.wikiTitle,
      avatarUrl: resolved.avatarUrl,
    });
    // 每 8 条成功检查点，避免中断丢进度
    if (results.filter((r) => r.status === 'ok' && !r.cached).length % 8 === 0) {
      const ckStats = {
        generatedAt: new Date().toISOString().slice(0, 10),
        checkpoint: true,
        withVerifiedPortrait: Object.values(byId).filter((v) => v.verifyTier === 'verified_portrait').length,
        outputIdEntries: Object.keys(byId).length,
      };
      if (!DRY) {
        // 临时按 id 写入；结束时再重建 BY_NAME
        writeOverrides(byId, existing.byName, ckStats);
        console.log(`  [checkpoint] verified=${ckStats.withVerifiedPortrait}`);
      }
    }
  }

  // 冲突：同 wiki 页映射到不同姓名
  let conflicts = 0;
  for (const [key, owners] of pageOwners) {
    const names = [...new Set(owners.map((o) => o.name))];
    if (names.length <= 1) continue;
    conflicts += 1;
    console.log(`CONFLICT ${key}: ${owners.map((o) => o.name).join(' / ')}`);
    for (const o of owners) {
      delete byId[o.id];
      const r = results.find((x) => x.id === o.id);
      if (r) {
        r.status = 'conflict';
        r.reason = 'same_wiki_page_multi_person';
      }
    }
  }

  // 重建 BY_NAME：仅全域唯一姓名 + 已核验
  const byName = {};
  for (const [fid, ov] of Object.entries(byId)) {
    if (ov.verifyTier !== 'verified_portrait' && ov.source !== 'curated') continue;
    const person = all.find((f) => f.id === fid);
    const name = person?.name;
    if (!name) continue;
    if ((nameCount.get(name) || 0) !== 1) continue;
    // 不覆盖：若已有不同 wikiTitle
    if (byName[name] && byName[name].wikiTitle !== ov.wikiTitle) {
      delete byName[name];
      continue;
    }
    byName[name] = { ...ov };
  }

  // 保留非政要队列中已有、且不与冲突冲突的旧 curated（名人等）
  for (const [fid, ov] of Object.entries(existing.byId)) {
    if (byId[fid]) continue;
    if (ov.source === 'curated' || ov.verifyTier === 'verified_portrait') {
      // 跳过错误李强
      if (fid === 'ce-x-soc01' && ov.wikiTitle === '李强') continue;
      byId[fid] = ov;
      const nm = Object.entries(existing.byName).find(([, v]) => v.wikiTitle === ov.wikiTitle)?.[0];
      if (nm && (nameCount.get(nm) || 0) <= 1 && ov.source === 'curated') {
        byName[nm] = byName[nm] || ov;
      }
    } else if (ov.source === 'zh-default' || ov.source === 'nameEn') {
      byId[fid] = ov; // 元数据提示，不授权拉取
    }
  }
  for (const [name, ov] of Object.entries(existing.byName)) {
    if (byName[name]) continue;
    if ((nameCount.get(name) || 0) > 1) continue; // 同名绝不按姓名覆盖
    if (name === '李强') continue;
    if (ov.source === 'curated' || ov.verifyTier === 'verified_portrait') {
      byName[name] = ov;
    } else if (ov.source === 'zh-default' || ov.source === 'nameEn') {
      byName[name] = ov;
    }
  }

  const verified = Object.values(byId).filter((v) => v.verifyTier === 'verified_portrait').length;
  const curatedFetchable = Object.values(byId).filter(
    (v) => v.source === 'curated' && v.wikiTitle,
  ).length;

  const stats = {
    generatedAt: new Date().toISOString().slice(0, 10),
    seedTotal: all.length,
    priorityTotal: priority.length,
    attempted,
    verifiedOk: results.filter((r) => r.status === 'ok').length,
    failed: results.filter((r) => r.status === 'fail').length,
    conflicts,
    withVerifiedPortrait: verified,
    curatedFetchable,
    outputIdEntries: Object.keys(byId).length,
    outputNameEntries: Object.keys(byName).length,
    uniqueNameOnly: true,
    failClosed: true,
  };

  const report = { stats, results, conflicts: [...pageOwners.entries()]
    .filter(([, o]) => new Set(o.map((x) => x.name)).size > 1)
    .map(([k, o]) => ({ key: k, owners: o })) };

  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
  console.log('\n=== Stats ===');
  console.log(stats);

  if (!DRY) {
    writeOverrides(byId, byName, stats);
    console.log(`Wrote ${OUT}`);
  } else {
    console.log('dry-run: skipped write');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
