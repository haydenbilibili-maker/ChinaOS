import { useState, useEffect } from 'react';
import * as DB from './localdb.js';
import { CULTURAL_ELITE_DATASET_ID, CULTURAL_ELITE_SEED_PKG } from './culturalEliteSeed.js';
import { BUSINESS_ELITE_DATASET_ID, BUSINESS_ELITE_SEED_PKG } from './businessEliteSeed.js';
import { HIGHER_EDUCATION_DATASET_ID, HIGHER_EDUCATION_SEED_PKG } from './higherEducationSeed.js';
import { THINK_TANK_DATASET_ID, THINK_TANK_SEED_PKG } from './thinkTankSeed.js';
import { RESEARCH_INSTITUTE_DATASET_ID, RESEARCH_INSTITUTE_SEED_PKG } from './researchInstituteSeed.js';
import { WORLD_BANK_DATASET_ID, WORLD_BANK_SEED_PKG } from './worldBankSeed.js';
import { ACADEMICIAN_DATASET_ID, ACADEMICIAN_SEED_PKG } from './academicianSeed.js';
import { OVERSEAS_TALENT_DATASET_ID, OVERSEAS_TALENT_SEED_PKG } from './overseasTalentSeed.js';
import { LEGAL_STATUTE_DATASET_ID, LEGAL_STATUTE_SEED_PKG, dedupeLegalStatute } from './legalStatuteSeed.js';
import { DISSIDENT_DATASET_ID, DISSIDENT_SEED_PKG } from './dissidentSeed.js';
import { TAIWAN_POLITICAL_DATASET_ID, TAIWAN_POLITICAL_SEED_PKG, dedupeTaiwanPolitical } from './taiwanPoliticalSeed.js';
import { DIPLOMATIC_CORPS_DATASET_ID, DIPLOMATIC_CORPS_SEED_PKG, dedupeDiplomaticCorps } from './diplomaticCorpsSeed.js';
import { SELF_MEDIA_DATASET_ID, SELF_MEDIA_SEED_PKG, dedupeSelfMedia } from './selfMediaSeed.js';

// 响应式读取本地库数据集：写入（编辑/导入/删除）即自动刷新 → 模块前台即时更新。
// seed: 库中无此 id 时自动播种（{name,category,source,rows,...}），保证开箱即用。
export function useDataset(id, seed) {
  const [state, setState] = useState({ rows: null, ready: false });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      let ds = await DB.getDataset(id);
      if (!ds && seed) { await DB.putDataset({ id, origin: 'seed', ...seed }); ds = await DB.getDataset(id); }
      if (!ds) { if (alive) setState({ rows: null, ready: true }); return; }
      const rows = (await DB.getRows(id)).map(({ rowId, datasetId, ...r }) => ({ __rowId: rowId, ...r }));
      if (alive) setState({ rows, ready: true });
    };
    load();
    const unsub = DB.subscribe((changedId) => { if (!changedId || changedId === id) load(); });
    return () => { alive = false; unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return state; // { rows, ready }
}

// 响应式读取简历库
export function useFigures() {
  const [figs, setFigs] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => { const f = await DB.listFigures(); if (alive) setFigs(f); };
    load();
    const unsub = DB.subscribe((id) => { if (id === '__figures__' || !id) load(); });
    return () => { alive = false; unsub(); };
  }, []);
  return figs;
}

// 响应式读取民营经济500强三数据集（与政治人物库隔离）
export function usePrivateEnterprise500() {
  const companies = useDataset('pe500-companies');
  const people = useDataset('pe500-people');
  const equity = useDataset('pe500-equity');
  return {
    companies: companies.rows,
    people: people.rows,
    equity: equity.rows,
    ready: companies.ready && people.ready && equity.ready,
  };
}

// 响应式读取政策文件库（政府工作报告 / 五年规划 / 中央经济工作会议 等）
export function useDocs() {
  const [docs, setDocs] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => { const d = await DB.listDocs(); if (alive) setDocs(d); };
    load();
    const unsub = DB.subscribe((id) => { if (id === '__docs__' || !id) load(); });
    return () => { alive = false; unsub(); };
  }, []);
  return docs;
}

// 响应式读取知识精英库（学者 / 知识传播）
export function useCulturalElite() {
  return useDataset(CULTURAL_ELITE_DATASET_ID, CULTURAL_ELITE_SEED_PKG);
}

// 响应式读取商业精英库（创始人 / 高管 / 投资人 / 行业领袖）
export function useBusinessElite() {
  return useDataset(BUSINESS_ELITE_DATASET_ID, BUSINESS_ELITE_SEED_PKG);
}

// 响应式读取海外人才库（跨境人力资本队列）
export function useOverseasTalent() {
  return useDataset(OVERSEAS_TALENT_DATASET_ID, OVERSEAS_TALENT_SEED_PKG);
}

// 响应式读取外交人才库（驻外使节全图）；读取时去重
export function useDiplomaticCorps() {
  const state = useDataset(DIPLOMATIC_CORPS_DATASET_ID, DIPLOMATIC_CORPS_SEED_PKG);
  const rows = state.rows == null ? null : dedupeDiplomaticCorps(state.rows).rows;
  return { rows, ready: state.ready };
}

// 响应式读取异见人士库（制度边界档案队列）
export function useDissident() {
  return useDataset(DISSIDENT_DATASET_ID, DISSIDENT_SEED_PKG);
}

// 响应式读取港澳台政要库（台港澳政治人物队列）；读取时按姓名去重，避免存量重复录入
export function useTaiwanPolitical() {
  const state = useDataset(TAIWAN_POLITICAL_DATASET_ID, TAIWAN_POLITICAL_SEED_PKG);
  const rows = state.rows == null ? null : dedupeTaiwanPolitical(state.rows).rows;
  return { rows, ready: state.ready };
}

// 响应式读取高等教育库（985/211/双一流全覆盖）
export function useHigherEducation() {
  return useDataset(HIGHER_EDUCATION_DATASET_ID, HIGHER_EDUCATION_SEED_PKG);
}

// 响应式读取顶级智库库
export function useThinkTank() {
  return useDataset(THINK_TANK_DATASET_ID, THINK_TANK_SEED_PKG);
}

// 响应式读取科研院所库
export function useResearchInstitute() {
  return useDataset(RESEARCH_INSTITUTE_DATASET_ID, RESEARCH_INSTITUTE_SEED_PKG);
}

// 响应式读取世界银行 WDI 本地数据集（中国 / 香港 / 澳门 · 核心发展指标）
export function useWorldBank() {
  return useDataset(WORLD_BANK_DATASET_ID, WORLD_BANK_SEED_PKG);
}

// 响应式读取两院院士库（中科院 / 工程院）
export function useAcademician() {
  return useDataset(ACADEMICIAN_DATASET_ID, ACADEMICIAN_SEED_PKG);
}

// 响应式读取自媒体人库（传媒影响力队列）；读取时按姓名去重
export function useSelfMedia() {
  const state = useDataset(SELF_MEDIA_DATASET_ID, SELF_MEDIA_SEED_PKG);
  const rows = state.rows == null ? null : dedupeSelfMedia(state.rows).rows;
  return { rows, ready: state.ready };
}

// 响应式读取法律条文库（法律 / 行政法规 / 司法解释）；读取时按 id 去重，避免存量重复录入
export function useLegalStatutes() {
  const state = useDataset(LEGAL_STATUTE_DATASET_ID, LEGAL_STATUTE_SEED_PKG);
  const rows = state.rows == null ? null : dedupeLegalStatute(state.rows).rows;
  return { rows, ready: state.ready };
}
