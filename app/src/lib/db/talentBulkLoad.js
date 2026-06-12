// ============================================================================
// 人才精英 · 一键清空并载入全部内置种子
// ============================================================================
import * as DB from './localdb.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from './figureSeed.js';
import { ANTI_CORRUPTION_SEED_PKG, ANTI_CORRUPTION_META, ANTI_CORRUPTION_COUNT } from './antiCorruptionSeed.js';
import { HIGHER_EDUCATION_SEED_PKG, HIGHER_EDUCATION_META, HIGHER_EDUCATION_COUNT } from './higherEducationSeed.js';
import { THINK_TANK_SEED_PKG, THINK_TANK_META, THINK_TANK_DEDUPED_COUNT } from './thinkTankSeed.js';
import { RESEARCH_INSTITUTE_SEED_PKG, RESEARCH_INSTITUTE_META, RESEARCH_INSTITUTE_COUNT } from './researchInstituteSeed.js';
import { ACADEMICIAN_SEED_PKG, ACADEMICIAN_META, ACADEMICIAN_DEDUPED_COUNT } from './academicianSeed.js';
import { CULTURAL_ELITE_SEED_PKG, CULTURAL_ELITE_META, CULTURAL_ELITE_DEDUPED_COUNT } from './culturalEliteSeed.js';
import { BUSINESS_ELITE_SEED_PKG, BUSINESS_ELITE_META, BUSINESS_ELITE_COUNT } from './businessEliteSeed.js';
import { OVERSEAS_TALENT_SEED_PKG, OVERSEAS_TALENT_META, OVERSEAS_TALENT_DEDUPED_COUNT } from './overseasTalentSeed.js';
import { DIPLOMATIC_CORPS_SEED_PKG, DIPLOMATIC_CORPS_META, DIPLOMATIC_CORPS_DEDUPED_COUNT } from './diplomaticCorpsSeed.js';
import { DISSIDENT_SEED_PKG, DISSIDENT_META, DISSIDENT_DEDUPED_COUNT } from './dissidentSeed.js';
import { TAIWAN_POLITICAL_SEED_PKG, TAIWAN_POLITICAL_META, TAIWAN_POLITICAL_DEDUPED_COUNT } from './taiwanPoliticalSeed.js';
import { SELF_MEDIA_SEED_PKG, SELF_MEDIA_META, SELF_MEDIA_DEDUPED_COUNT } from './selfMediaSeed.js';

/** 一键载入队列定义（顺序即执行顺序） */
export const TALENT_BULK_QUEUES = [
  { key: 'figures', label: '中国政要', type: 'figures', count: FIGURE_SEED.length, asOf: FIGURE_CATALOG_META.asOf },
  { key: 'anticorruption', label: ANTI_CORRUPTION_META.label, type: 'dataset', pkg: ANTI_CORRUPTION_SEED_PKG, count: ANTI_CORRUPTION_COUNT, asOf: ANTI_CORRUPTION_META.asOf },
  { key: 'dissident', label: DISSIDENT_META.label, type: 'dataset', pkg: DISSIDENT_SEED_PKG, count: DISSIDENT_DEDUPED_COUNT.total, asOf: DISSIDENT_META.asOf },
  { key: 'taiwan_political', label: TAIWAN_POLITICAL_META.label, type: 'dataset', pkg: TAIWAN_POLITICAL_SEED_PKG, count: TAIWAN_POLITICAL_DEDUPED_COUNT.total, asOf: TAIWAN_POLITICAL_META.asOf },
  { key: 'higher_education', label: HIGHER_EDUCATION_META.label, type: 'dataset', pkg: HIGHER_EDUCATION_SEED_PKG, count: HIGHER_EDUCATION_COUNT.total, asOf: HIGHER_EDUCATION_META.asOf },
  { key: 'think_tank', label: THINK_TANK_META.label, type: 'dataset', pkg: THINK_TANK_SEED_PKG, count: THINK_TANK_DEDUPED_COUNT.total, asOf: THINK_TANK_META.asOf },
  { key: 'research_institute', label: RESEARCH_INSTITUTE_META.label, type: 'dataset', pkg: RESEARCH_INSTITUTE_SEED_PKG, count: RESEARCH_INSTITUTE_COUNT.total, asOf: RESEARCH_INSTITUTE_META.asOf },
  { key: 'academician', label: ACADEMICIAN_META.label, type: 'dataset', pkg: ACADEMICIAN_SEED_PKG, count: ACADEMICIAN_DEDUPED_COUNT.total, asOf: ACADEMICIAN_META.asOf },
  { key: 'cultural_elite', label: CULTURAL_ELITE_META.label, type: 'dataset', pkg: CULTURAL_ELITE_SEED_PKG, count: CULTURAL_ELITE_DEDUPED_COUNT.total, asOf: CULTURAL_ELITE_META.asOf },
  { key: 'business_elite', label: BUSINESS_ELITE_META.label, type: 'dataset', pkg: BUSINESS_ELITE_SEED_PKG, count: BUSINESS_ELITE_COUNT.total, asOf: BUSINESS_ELITE_META.asOf },
  { key: 'overseas_talent', label: OVERSEAS_TALENT_META.label, type: 'dataset', pkg: OVERSEAS_TALENT_SEED_PKG, count: OVERSEAS_TALENT_DEDUPED_COUNT.total, asOf: OVERSEAS_TALENT_META.asOf },
  { key: 'diplomatic_corps', label: DIPLOMATIC_CORPS_META.label, type: 'dataset', pkg: DIPLOMATIC_CORPS_SEED_PKG, count: DIPLOMATIC_CORPS_DEDUPED_COUNT.total, asOf: DIPLOMATIC_CORPS_META.asOf },
  { key: 'self_media', label: SELF_MEDIA_META.label, type: 'dataset', pkg: SELF_MEDIA_SEED_PKG, count: SELF_MEDIA_DEDUPED_COUNT.total, asOf: SELF_MEDIA_META.asOf },
];

export const TALENT_BULK_TOTAL_COUNT = TALENT_BULK_QUEUES.reduce((n, q) => n + q.count, 0);

export const TALENT_BULK_SCOPE_LABEL =
  '中国政要、反腐透视、异见人士、港澳台政要、高等教育、智库、科研院所、两院院士、知识精英、商业精英、海外人才、外交人才、自媒体人';

export function getTalentBulkConfirmMessage() {
  const detail = TALENT_BULK_QUEUES.map((q) => `${q.label} ${q.count}`).join(' · ');
  return `将清空并覆盖载入全部人才精英库（${detail}），本地已有数据将被替换，继续？`;
}

export function formatTalentBulkSummary(results) {
  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const parts = ok.map((r) => `${r.label} ${r.count}`);
  let msg = `已载入 ${ok.length}/${results.length} 队列：${parts.join(' · ')}`;
  if (failed.length) {
    msg += `；失败：${failed.map((r) => `${r.label}${r.error ? `（${r.error}）` : ''}`).join('、')}`;
  }
  return msg;
}

/**
 * 清空人才精英相关 IndexedDB 并顺序载入全部内置种子。
 * @param {{ onProgress?: (ev: { queue: object, index: number, total: number, status: 'loading'|'done'|'error', count?: number, error?: string }) => void }} opts
 */
export async function loadAllTalentEliteSeeds({ onProgress } = {}) {
  const results = [];
  const total = TALENT_BULK_QUEUES.length;

  await DB.clearFigures();

  for (let i = 0; i < TALENT_BULK_QUEUES.length; i++) {
    const queue = TALENT_BULK_QUEUES[i];
    onProgress?.({ queue, index: i, total, status: 'loading' });
    try {
      let count;
      if (queue.type === 'figures') {
        let ts = Date.now();
        for (const r of FIGURE_SEED) await DB.putFigure({ ...r, updatedAt: ts++ });
        count = FIGURE_SEED.length;
      } else {
        await DB.putDataset({ ...queue.pkg, stampMs: Date.now() });
        count = queue.pkg.rows.length;
      }
      const row = { key: queue.key, label: queue.label, count, ok: true };
      results.push(row);
      onProgress?.({ queue, index: i, total, status: 'done', count });
    } catch (e) {
      const row = { key: queue.key, label: queue.label, count: 0, ok: false, error: String(e.message || e) };
      results.push(row);
      onProgress?.({ queue, index: i, total, status: 'error', error: row.error });
    }
  }

  return {
    results,
    success: results.every((r) => r.ok),
    totalLoaded: results.filter((r) => r.ok).reduce((n, r) => n + r.count, 0),
  };
}
