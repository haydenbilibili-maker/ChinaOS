import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AntiCorruptionSection from './AntiCorruptionSection.jsx';
import CulturalEliteSection from './CulturalEliteSection.jsx';
import BusinessEliteSection from './BusinessEliteSection.jsx';
import OverseasTalentSection from './OverseasTalentSection.jsx';
import DiplomaticCorpsSection from './DiplomaticCorpsSection.jsx';
import SelfMediaSection from './SelfMediaSection.jsx';
import DissidentSection from './DissidentSection.jsx';
import TaiwanPoliticalSection from './TaiwanPoliticalSection.jsx';
import HigherEducationSection from './HigherEducationSection.jsx';
import ThinkTankSection from './ThinkTankSection.jsx';
import ResearchInstituteSection from './ResearchInstituteSection.jsx';
import TalentDetailPanel from './TalentDetailPanel.jsx';
import FigureRadarChart from './FigureRadarChart.jsx';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar, Button, DistBar } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import { figureStableId } from '../../lib/db/figureDedupe.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from '../../lib/db/figureSeed.js';
import { CULTURAL_ELITE_DEDUPED_COUNT, CE_SUB_CATS, CE_TAB_LABEL } from '../../lib/db/culturalEliteSeed.js';
import { BUSINESS_ELITE_DEDUPED_COUNT } from '../../lib/db/businessEliteSeed.js';
import { OVERSEAS_TALENT_DEDUPED_COUNT, OT_TAB_LABEL } from '../../lib/db/overseasTalentSeed.js';
import { DIPLOMATIC_CORPS_DEDUPED_COUNT, DC_TAB_LABEL } from '../../lib/db/diplomaticCorpsSeed.js';
import { HIGHER_EDUCATION_DEDUPED_COUNT } from '../../lib/db/higherEducationSeed.js';
import { RESEARCH_INSTITUTE_DEDUPED_COUNT, RI_STATE_TYPES } from '../../lib/db/researchInstituteSeed.js';
import { THINK_TANK_DEDUPED_COUNT } from '../../lib/db/thinkTankSeed.js';
import { ANTI_CORRUPTION_COUNT, ANTI_CORRUPTION_SEED_PKG } from '../../lib/db/antiCorruptionSeed.js';
import { DISSIDENT_DEDUPED_COUNT } from '../../lib/db/dissidentSeed.js';
import { TAIWAN_POLITICAL_DEDUPED_COUNT, TW_TAB_LABEL } from '../../lib/db/taiwanPoliticalSeed.js';
import { SELF_MEDIA_DEDUPED_COUNT, SM_TAB_LABEL, SM_SUB_CATS } from '../../lib/db/selfMediaSeed.js';
import { resolveTalentTab, useTalentDeepLink } from '../../lib/talent/routing.js';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

const CUR_YEAR = 2026;
const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: 'var(--text-sm)' };

const ROLE_OPTS = ['总书记', '总理', '副总理', '国务委员', '人大委员长', '政协主席', '政协副主席', '政协秘书长', '纪委书记', '外交部长', '政法委书记', '中组部部长', '组织部部长', '统战部部长', '中宣部部长', '宣传部长', '人大副委员长', '人大秘书长', '监委主任', '军委副主席', '军委委员', '港澳办主任', '党委书记', '市委书记', '省委副书记', '省长', '市长', '常务副省长', '常务副市长', '常务副主席', '自治区主席', '部长', '副部长', '国防部长', '战区司令员', '战区政治委员', '战区副司令员', '参谋长', '政治工作部主任', '副司令员', '副政委', '署长', '局长', '主任', '副主任', '副秘书长', '秘书长', '主席', '董事长', '总经理', '最高法院长', '最高检检察长', '专门委员会主任', '专门委员会副主任', '政协常委', '常委会委员'];
const INSTITUTION_TYPE_OPTS = ['人大', '政协', '部委', '中直', '司法', '央企', '地方人大政协'];
const SECTOR_OPTS = ['国务院', '党中央', '国家机关', '全国政协', '国务院直属机构', '央企', '省属国企', '军队', '地方'];
const LEVEL_RANK = { '党和国家领导人': 0, '副国级': 1, '上将': 1, '正部级': 2, '中将': 2, '省部级': 3, '少将': 3, '副部级': 4, '正厅级': 5 };

// 派生字段
const birthYear = (f) => { const m = (f.fields?.birth || '').match(/(\d{4})/); return m ? +m[1] : null; };
const ageOf = (f) => { const y = birthYear(f); return y ? CUR_YEAR - y : null; };
const decadeOf = (f) => { const y = birthYear(f); return y ? `${String(Math.floor(y / 10) * 10).slice(2)}后` : '未知'; };
const nativeProv = (f) => { const n = f.fields?.native || ''; const m = n.match(/^(北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|陕西|甘肃|青海|宁夏|新疆|西藏|内蒙古)/); return m ? m[1] : (n ? '其他' : '未知'); };
const tenureYears = (f) => { const cur = (f.career || []).find((c) => !c.to); if (!cur) return null; const m = (cur.from || '').match(/(\d{4})/); return m ? CUR_YEAR - +m[1] : null; };

// 分布统计
function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((f) => { const k = keyFn(f); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

// 内联横条分布 → 共享 DistBar（ui.jsx）
const TAB_DEFS = [
  { id: 'resume', baseLabel: '中国政要', accent: 'var(--cyber-cyan)', bg: 'rgba(34,211,238,0.16)' },
  { id: 'anticorruption', baseLabel: '反腐透视', accent: 'var(--china-red)', bg: 'rgba(196,30,58,0.16)' },
  { id: 'dissident', baseLabel: '异见人士', accent: '#a78bfa', bg: 'rgba(139,92,246,0.16)' },
  { id: 'taiwan', baseLabel: '港澳台政要', accent: '#38bdf8', bg: 'rgba(56,189,248,0.16)' },
  { id: 'education', baseLabel: '高等教育', accent: '#10b981', bg: 'rgba(16,185,129,0.16)' },
  { id: 'thinktank', baseLabel: '智库', accent: '#22d3ee', bg: 'rgba(34,211,238,0.16)' },
  { id: 'research', baseLabel: '科研院所', accent: '#a78bfa', bg: 'rgba(139,92,246,0.16)' },
  { id: 'knowledge', baseLabel: '知识精英', accent: '#a78bfa', bg: 'rgba(139,92,246,0.16)' },
  { id: 'business', baseLabel: '商业精英', accent: '#e8a317', bg: 'rgba(232,163,23,0.16)' },
  { id: 'overseas', baseLabel: '海外人才', accent: '#0ea5e9', bg: 'rgba(14,165,233,0.16)' },
  { id: 'diplomatic', baseLabel: '外交人才', accent: '#f59e0b', bg: 'rgba(245,158,11,0.16)' },
  { id: 'self-media', baseLabel: '自媒体人', accent: '#f472b6', bg: 'rgba(244,114,182,0.16)' },
];

const TAB_COUNT = {
  resume: FIGURE_SEED.length,
  anticorruption: ANTI_CORRUPTION_COUNT,
  dissident: DISSIDENT_DEDUPED_COUNT.total,
  taiwan: TAIWAN_POLITICAL_DEDUPED_COUNT.total,
  education: HIGHER_EDUCATION_DEDUPED_COUNT.total,
  thinktank: THINK_TANK_DEDUPED_COUNT.total,
  research: RESEARCH_INSTITUTE_DEDUPED_COUNT.total,
  knowledge: CULTURAL_ELITE_DEDUPED_COUNT.total,
  business: BUSINESS_ELITE_DEDUPED_COUNT.total,
  overseas: OVERSEAS_TALENT_DEDUPED_COUNT.total,
  diplomatic: DIPLOMATIC_CORPS_DEDUPED_COUNT.total,
  'self-media': SELF_MEDIA_DEDUPED_COUNT.total,
};

function buildTalentTabs() {
  return TAB_DEFS.map(({ id, baseLabel, accent, bg }) => ({
    id,
    label: TAB_COUNT[id] ? `${baseLabel}(${TAB_COUNT[id]})` : baseLabel,
    accent,
    bg,
  }));
}

const ceSubtitle = () => {
  const parts = CE_SUB_CATS.map((k) => `${CE_TAB_LABEL[k]} ${CULTURAL_ELITE_DEDUPED_COUNT[k] ?? 0}`);
  return `知识生产队列 · ${parts.join(' / ')} —— 内置 ${CULTURAL_ELITE_DEDUPED_COUNT.total} 条（含两院院士 enrich）`;
};

const TAB_META = {
  resume: {
    title: '人才精英库 · 中国政要',
    subtitle: (n, asOf) => `政治权力队列 · 地方/中央部委/军事将官等公开任职政治人物 —— 内置 ${n} 条，截至 ${asOf}。不含知识生产与商业资本图谱。`,
  },
  anticorruption: {
    title: '人才精英库 · 反腐透视',
    subtitle: (n) => `权力纠错账本 · 十八大以来公开落马/被查案例历年汇总（内置 ${n ?? ANTI_CORRUPTION_COUNT} 条）—— 2026 H1 金融/国企/巡视通报密集期，与中国政要独立建档。`,
  },
  dissident: {
    title: '人才精英库 · 异见人士',
    subtitle: () => {
      const c = DISSIDENT_DEDUPED_COUNT;
      const parts = ['lawyer', 'journalist', 'writer', 'movement', 'religion', 'labor', 'online', 'exile'].map((k) => {
        const labels = { lawyer: '维权律师', journalist: '记者', writer: '作家', movement: '民运', religion: '宗教', labor: '劳工', online: '网络异议', exile: '流亡海外' };
        return `${labels[k]} ${c[k] ?? 0}`;
      });
      return `制度边界档案 · 公开记录中的异议表达者、维权者与制度边界案例；与政要/知识生产队列隔离 —— ${parts.join(' / ')}，内置 ${c.total} 条`;
    },
  },
  taiwan: {
    title: '人才精英库 · 港澳台政要',
    subtitle: () => {
      const c = TAIWAN_POLITICAL_DEDUPED_COUNT;
      return `台港澳公开任职政治人物；与 PRC 中国政要队列分轨建档 —— 台湾 ${c.tw ?? 0} / 香港 ${c.hk ?? 0} / 澳门 ${c.mo ?? 0}，内置 ${c.total} 条`;
    },
  },
  education: {
    title: '人才精英库 · 高等教育',
    subtitle: () => {
      const c = HIGHER_EDUCATION_DEDUPED_COUNT;
      return `机构载体队列 · 985/211/双一流全覆盖（C9 ${c.C9} · 985 ${c['985']} · 211 ${c['211']} · 双一流 ${c.双一流}）—— 内置 ${c.total} 所`;
    },
  },
  thinktank: {
    title: '人才精英库 · 智库',
    subtitle: () => {
      const c = THINK_TANK_DEDUPED_COUNT;
      return `机构载体队列 · 国家级 ${c['国家级智库'] || 0} / 高校 ${c['高校智库'] || 0} / 社会 ${c['社会智库'] || 0} / 部委 ${c['部委智库'] || 0} —— 内置 ${c.total} 家`;
    },
  },
  research: {
    title: '人才精英库 · 科研院所',
    subtitle: () => {
      const c = RESEARCH_INSTITUTE_DEDUPED_COUNT;
      const state = RI_STATE_TYPES.reduce((n, k) => n + (c[k] || 0), 0);
      return `机构载体队列 · 国立体系 ${state} 所 + 民企科研 ${c['民企科研'] || 0} 家 + 大科学装置 ${c['大科学装置'] || 0} 项 —— 国家战略科技力量与企业级研发补充节点，内置 ${c.total} 条`;
    },
  },
  knowledge: {
    title: '人才精英库 · 知识精英',
    subtitle: ceSubtitle,
  },
  business: {
    title: '人才精英库 · 商业精英',
    subtitle: () => {
      const c = BUSINESS_ELITE_DEDUPED_COUNT;
      return `资本逻辑队列 · 创始人 ${c.founder} / 实控人 ${c.controller || 0} / 高管 ${c.executive} / 投资人 ${c.investor} —— 角色 × 行业双维 · 内置 ${c.total} 条`;
    },
  },
  overseas: {
    title: '人才精英库 · 海外人才',
    subtitle: () => {
      const parts = ['knowledge', 'tech', 'industry', 'culture', 'academic'].map((k) => `${OT_TAB_LABEL[k]} ${OVERSEAS_TALENT_DEDUPED_COUNT[k] ?? 0}`);
      return `跨境人力资本队列 · ${parts.join(' / ')} —— 内置 ${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条（与境内队列互补，聚焦海外驻留/游学节点）`;
    },
  },
  diplomatic: {
    title: '人才精英库 · 外交人才',
    subtitle: () => {
      const c = DIPLOMATIC_CORPS_DEDUPED_COUNT;
      const parts = ['亚太', '欧洲', '北美', '拉美', '非洲', '中东', '国际组织'].map((k) => `${DC_TAB_LABEL[k]} ${c[k] ?? 0}`);
      return `驻外使节公开任职图谱 · ${parts.join(' / ')} —— 内置 ${c.total} 条（与境内政要/知识精英队列分轨；外交部长见中国政要）`;
    },
  },
  'self-media': {
    title: '人才精英库 · 自媒体人',
    subtitle: () => {
      const c = SELF_MEDIA_DEDUPED_COUNT;
      const parts = SM_SUB_CATS.map((k) => `${SM_TAB_LABEL[k]} ${c[k] ?? 0}`);
      return `传媒影响力队列 · ${parts.join(' / ')} —— 内置 ${c.total} 条（自知识精英迁出 ${c.migrated ?? 0} 条；平台×垂类×影响力分层）`;
    },
  },
};

const SANDBOX_LEGACY_TABS = { 'party-school': 'party-school', 'org-dept': 'org-dept' };

export default function Page() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = resolveTalentTab(tabParam || 'resume');

  useEffect(() => {
    if (tabParam && SANDBOX_LEGACY_TABS[tabParam]) {
      navigate(`/sandbox?tab=${SANDBOX_LEGACY_TABS[tabParam]}`, { replace: true });
    }
  }, [tabParam, navigate]);
  const setTab = (id) => {
    if (id === 'resume') setSearchParams({}, { replace: true });
    else setSearchParams({ tab: id }, { replace: true });
  };

  useEffect(() => {
    if (tabParam === 'culture') setSearchParams({ tab: 'knowledge' }, { replace: true });
    else if (tabParam === 'scholar') setSearchParams({ tab: 'knowledge', ce: 'humanities' }, { replace: true });
  }, [tabParam, setSearchParams]);

  const tabs = useMemo(() => buildTalentTabs(), []);

  const figuresRaw = useFigures();
  const figures = figuresRaw;
  const dupCount = 0;
  const [q, setQ] = useState(() => searchParams.get('q') || '');
  const [prov, setProv] = useState('');
  const [level, setLevel] = useState('');
  const [role, setRole] = useState('');
  const [sector, setSector] = useState('');
  const [decade, setDecade] = useState('');
  const [minority, setMinority] = useState(false);
  const [institutionType, setInstitutionType] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('list');
  const [compareId, setCompareId] = useState('');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const antiCorruptionNames = useMemo(
    () => new Set((ANTI_CORRUPTION_SEED_PKG.rows || []).map((r) => (r.name || '').trim()).filter(Boolean)),
    [],
  );

  const provinces = useMemo(() => [...new Set((figures || []).map((f) => f.province).filter(Boolean))].sort(), [figures]);
  const levels = useMemo(() => [...new Set((figures || []).map((f) => f.level).filter(Boolean))].sort((a, b) => (LEVEL_RANK[a] ?? 9) - (LEVEL_RANK[b] ?? 9)), [figures]);
  const sectors = useMemo(() => [...new Set((figures || []).map((f) => f.sector).filter(Boolean))], [figures]);
  const decades = useMemo(() => [...new Set((figures || []).map(decadeOf).filter((d) => d !== '未知'))].sort(), [figures]);

  const viceCount = (figures || []).filter((f) => f.level === '副国级').length;
  const ministerCount = (figures || []).filter((f) => f.level === '省部级' && f.province === '中央').length;
  const milCount = (figures || []).filter((f) => f.sector === '军队' && ['上将', '中将', '少将'].includes(f.level)).length;
  const shangCount = (figures || []).filter((f) => f.level === '上将').length;
  const secCount = (figures || []).filter((f) => f.role === '党委书记').length;
  const citySecCount = (figures || []).filter((f) => ['党委书记', '省长', '市长', '自治区主席'].includes(f.role)).length;
  const minorityCount = (figures || []).filter((f) => f.fields?.ethnic && f.fields.ethnic !== '汉族').length;
  const ages = (figures || []).map(ageOf).filter(Boolean);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;

  const filtered = useMemo(() => {
    const list = (figures || []).filter((f) => {
      const hay = [f.name, f.org, f.fields?.title, f.fields?.institution, f.fields?.rank, f.fields?.milRank, f.fields?.milBranch, f.fields?.native, f.fields?.cityTier, f.province, short(f.province), f.role, f.level, f.sector, f.raw, ...(f.career || []).map((c) => c.desc)].join(' ');
      const sectorMatch = !sector || f.sector === sector || (sector === '地方' && f.province && f.province !== '中央');
      const milMatch = quickFilter !== 'military' || (f.sector === '军队' && ['上将', '中将', '少将'].includes(f.level));
      const localMatch = quickFilter !== 'localChief' || (f.province && f.province !== '中央' && ['党委书记', '省长', '市长', '自治区主席'].includes(f.role));
      const instType = f.fields?.institutionType;
      const npcMatch = quickFilter !== 'npc' || instType === '人大' || f.org?.includes('人大') || ['人大副委员长', '人大秘书长', '专门委员会主任', '专门委员会副主任', '常委会委员'].includes(f.role);
      const cppccMatch = quickFilter !== 'cppcc' || instType === '政协' || f.sector === '全国政协' || ['政协副主席', '政协秘书长', '政协常委', '专门委员会主任', '专门委员会副主任'].includes(f.role);
      const ministryMatch = quickFilter !== 'ministry' || instType === '部委' || (f.sector === '国务院' && ['部长', '副部长', '署长', '局长'].includes(f.role));
      const centralMatch = quickFilter !== 'centralParty' || instType === '中直' || (f.province === '中央' && f.sector === '党中央');
      const judicialMatch = quickFilter !== 'judicial' || instType === '司法' || ['最高法院长', '最高检检察长'].includes(f.role) || f.org?.includes('法院') || f.org?.includes('检察院') || f.org?.includes('司法部');
      const soeMatch = quickFilter !== 'soe' || instType === '央企' || f.sector === '央企';
      const provLegMatch = quickFilter !== 'provLeg' || instType === '地方人大政协';
      const instTypeMatch = !institutionType || instType === institutionType;
      return (!prov || f.province === prov)
        && (!level || f.level === level)
        && (!role || f.role === role)
        && sectorMatch
        && (!decade || decadeOf(f) === decade)
        && (!minority || (f.fields?.ethnic && f.fields.ethnic !== '汉族'))
        && milMatch
        && localMatch
        && npcMatch
        && cppccMatch
        && ministryMatch
        && centralMatch
        && judicialMatch
        && soeMatch
        && provLegMatch
        && instTypeMatch
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'ageAsc') list.sort((a, b) => (ageOf(a) || 999) - (ageOf(b) || 999));
    else if (sort === 'ageDesc') list.sort((a, b) => (ageOf(b) || 0) - (ageOf(a) || 0));
    else if (sort === 'level') list.sort((a, b) => (LEVEL_RANK[a.level] ?? 9) - (LEVEL_RANK[b.level] ?? 9));
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    return list;
  }, [figures, q, prov, level, role, sector, decade, minority, institutionType, quickFilter, sort]);

  useEffect(() => {
    if (tab === 'resume' && filtered.length) prefetchFigureAvatars(filtered, 56);
  }, [tab, filtered]);

  const detail = sel || (searchParams.get('id') ? null : filtered[0]) || null;
  const compareFigure = useMemo(
    () => (compareId ? filtered.find((f) => f.id === compareId) : null) || null,
    [compareId, filtered],
  );

  const { selectEntity } = useTalentDeepLink({
    searchParams,
    setSearchParams,
    filtered,
    allList: figures || [],
    sel,
    setSel,
    ready: figures != null && tab === 'resume',
    preserveKeys: [],
  });

  useEffect(() => {
    const qp = searchParams.get('q');
    if (tab === 'resume' && qp && qp !== q) setQ(qp);
  }, [tab, searchParams, q]);
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')], prov && ['省份', short(prov), () => setProv('')],
    sector && ['系统', sector, () => setSector('')], level && ['层级', level, () => setLevel('')],
    role && ['职务', role, () => setRole('')], decade && ['年代', decade, () => setDecade('')],
    minority && ['民族', '少数民族', () => setMinority(false)],
    quickFilter === 'military' && ['快捷', '仅军事将官', () => setQuickFilter('')],
    quickFilter === 'localChief' && ['快捷', '仅地方主官', () => setQuickFilter('')],
    quickFilter === 'npc' && ['快捷', '仅人大体系', () => setQuickFilter('')],
    quickFilter === 'cppcc' && ['快捷', '仅政协体系', () => setQuickFilter('')],
    quickFilter === 'ministry' && ['快捷', '仅部委体系', () => setQuickFilter('')],
    quickFilter === 'centralParty' && ['快捷', '仅中直机关', () => setQuickFilter('')],
    quickFilter === 'judicial' && ['快捷', '仅司法体系', () => setQuickFilter('')],
    quickFilter === 'soe' && ['快捷', '仅央企体系', () => setQuickFilter('')],
    quickFilter === 'provLeg' && ['快捷', '仅地方人大政协', () => setQuickFilter('')],
    institutionType && ['机构带', institutionType, () => setInstitutionType('')],
  ].filter(Boolean);

  // 先清空再以稳定 id 写入：彻底幂等，多次载入不再累积重复
  const loadSeed = async () => {
    setLoading(true);
    await DB.clearFigures();
    let ts = Date.now();
    for (const r of FIGURE_SEED) await DB.putFigure({ ...r, id: figureStableId(r), updatedAt: ts++ });
    setLoading(false);
  };
  const clearAll = () => { setQ(''); setProv(''); setLevel(''); setRole(''); setSector(''); setDecade(''); setMinority(false); setInstitutionType(''); setQuickFilter(''); };

  const pickFigure = useCallback((idx) => {
    const f = filtered[idx];
    if (f) selectEntity(f);
  }, [filtered, selectEntity]);

  useEffect(() => {
    if (tab !== 'resume') return undefined;
    const onKey = (e) => {
      if (!filtered.length || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const cur = detail ? filtered.findIndex((f) => f.id === detail.id) : 0;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); pickFigure(Math.min(cur + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); pickFigure(Math.max(cur - 1, 0)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tab, filtered, detail, pickFigure]);

  if (figures === null && tab === 'resume') return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载人才精英库…</div>;

  // 分布数据（仅中国政要 tab 使用）
  const distLevel = tally(filtered, (f) => f.level);
  const distSector = tally(filtered, (f) => f.sector || (f.province && f.province !== '中央' ? '地方' : ''));
  const distDecade = tally(filtered, decadeOf).sort((a, b) => a[0].localeCompare(b[0]));
  const distNative = tally(filtered, nativeProv).filter(([k]) => k !== '未知').slice(0, 12);
  const distProv = tally(filtered.filter((f) => f.province && f.province !== '中央'), (f) => short(f.province)).slice(0, 14);
  const ageHist = (() => {
    const buckets = [['≤50', 0], ['51-55', 0], ['56-58', 0], ['59-60', 0], ['61-62', 0], ['≥63', 0]];
    filtered.forEach((f) => { const a = ageOf(f); if (!a) return; if (a <= 50) buckets[0][1]++; else if (a <= 55) buckets[1][1]++; else if (a <= 58) buckets[2][1]++; else if (a <= 60) buckets[3][1]++; else if (a <= 62) buckets[4][1]++; else buckets[5][1]++; });
    return buckets;
  })();
  const ageBar = {
    grid: { left: 34, right: 12, top: 12, bottom: 22 },
    xAxis: { type: 'category', data: ageHist.map((b) => b[0]), ...AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    series: [{ type: 'bar', data: ageHist.map((b) => b[1]), barWidth: '60%', itemStyle: { borderRadius: [3, 3, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#c41e3a' }, { offset: 1, color: '#5e0f1d' }] } } }],
  };

  // ── 多维图表配置 ──────────────────────────────────────────────
      const donut = (data, center = ['34%', '52%']) => ({
    tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 人 ({d}%)' },
    legend: { type: 'scroll', orient: 'vertical', right: 2, top: 'center', textStyle: { color: LABEL.color, fontSize: 10.5 }, itemWidth: 9, itemHeight: 9 },
    series: [{ type: 'pie', radius: ['44%', '70%'], center, avoidLabelOverlap: true, itemStyle: { borderColor: '#0f1623', borderWidth: 2 }, label: { show: false }, data: data.map(([n, v], i) => ({ name: n, value: v, itemStyle: { color: CHART_SERIES_PALETTE[i % CHART_SERIES_PALETTE.length] } })) }],
  });
  const levelDonut = donut(distLevel.filter(([k]) => k));
  const sectorDonut = donut(distSector);
  // 中央委员身份构成
  const rankBucket = (f) => { const r = f.fields?.rank || ''; if (/常委/.test(r)) return '政治局常委'; if (/政治局委员/.test(r)) return '政治局委员'; if (/候补/.test(r)) return '候补委员'; if (/中央委员/.test(r)) return '中央委员'; return r ? '其他/部门' : '未注明'; };
  const rankDonut = donut(tally(filtered, rankBucket));
  // 出生年代 × 层级 堆叠
  const DEC = distDecade.map((d) => d[0]);
  const LV_ORD = ['党和国家领导人', '副国级', '上将', '正部级', '中将', '省部级', '少将', '副部级', '正厅级'].filter((l) => filtered.some((f) => f.level === l));
  const decadeLevel = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { type: 'scroll', top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
    grid: { left: 32, right: 10, top: 30, bottom: 20 },
    xAxis: { type: 'category', data: DEC, ...AXIS, axisLabel: LABEL },
    yAxis: { type: 'value', ...AXIS, axisLabel: LABEL },
    series: LV_ORD.map((lv, i) => ({ name: lv, type: 'bar', stack: 't', emphasis: { focus: 'series' }, itemStyle: { color: CHART_SERIES_PALETTE[i % CHART_SERIES_PALETTE.length] }, data: DEC.map((d) => filtered.filter((f) => decadeOf(f) === d && f.level === lv).length) })),
  };
  // 籍贯 Top 横向条
  const natSorted = [...distNative].slice(0, 12).reverse();
  const nativeBar = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 24, top: 8, bottom: 20 },
    xAxis: { type: 'value', ...AXIS, axisLabel: LABEL },
    yAxis: { type: 'category', data: natSorted.map((d) => d[0]), ...AXIS, axisLabel: LABEL },
    series: [{ type: 'bar', data: natSorted.map((d) => d[1]), barWidth: '62%', label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 }, itemStyle: { borderRadius: [0, 3, 3, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#8a6510' }, { offset: 1, color: '#e8a317' }] } } }],
  };
  // 籍贯输出 ↔ 现任流入 对流
  const natMap = Object.fromEntries(tally(filtered, nativeProv));
  const serveMap = Object.fromEntries(tally(filtered.filter((f) => f.province && f.province !== '中央'), (f) => short(f.province)));
  const flowProvs = [...new Set([...Object.keys(natMap), ...Object.keys(serveMap)])].filter((p) => p !== '未知' && p !== '其他')
    .map((p) => [p, natMap[p] || 0, serveMap[p] || 0]).sort((a, b) => (b[1] + b[2]) - (a[1] + a[2])).slice(0, 12).reverse();
  const flowBar = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => `${ps[0].name}<br/>籍贯输出 ${Math.abs(ps[0].value)}<br/>现任流入 ${ps[1] ? ps[1].value : 0}` },
    legend: { data: ['籍贯·输出', '现任·流入'], top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
    grid: { left: 46, right: 26, top: 28, bottom: 20 },
    xAxis: { type: 'value', ...AXIS, axisLabel: { ...LABEL, fontSize: 10, formatter: (v) => Math.abs(v) } },
    yAxis: { type: 'category', data: flowProvs.map((d) => d[0]), ...AXIS, axisLabel: LABEL },
    series: [
      { name: '籍贯·输出', type: 'bar', stack: 't', data: flowProvs.map((d) => -d[1]), itemStyle: { color: '#e8a317' } },
      { name: '现任·流入', type: 'bar', stack: 't', data: flowProvs.map((d) => d[2]), itemStyle: { color: '#22d3ee' } },
    ],
  };
  // 年龄 × 任期 散点（按层级着色）
  const tenureNow = (f) => { const m = (f.fields?.tookOffice || '').match(/(\d{4})/); return m ? CUR_YEAR - +m[1] : tenureYears(f); };
  const ageTenure = {
    tooltip: { formatter: (p) => `${p.data[2]}<br/>${p.data[0]} 岁 · 现职 ${p.data[1]} 年` },
    legend: { type: 'scroll', top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
    grid: { left: 34, right: 14, top: 28, bottom: 30 },
    xAxis: { type: 'value', name: '年龄', nameGap: 18, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, scale: true, ...AXIS, axisLabel: LABEL },
    yAxis: { type: 'value', name: '现职任期', nameTextStyle: { color: '#5b6a82', fontSize: 10 }, ...AXIS, axisLabel: LABEL },
    series: LV_ORD.map((lv, i) => ({ name: lv, type: 'scatter', symbolSize: 7, itemStyle: { color: CHART_SERIES_PALETTE[i % CHART_SERIES_PALETTE.length], opacity: 0.78 }, data: filtered.filter((f) => f.level === lv).map((f) => [ageOf(f), tenureNow(f), f.name]).filter((d) => d[0] && d[1] != null) })),
  };
  // 层级 × 系统 矩阵热力
  const MAT_SECTORS = [...new Set(filtered.map((f) => f.sector || (f.province && f.province !== '中央' ? '地方' : '其他')).filter(Boolean))].slice(0, 8);
  const MAT_LEVELS = LV_ORD.filter((lv) => filtered.some((f) => f.level === lv)).slice(0, 9);
  const matrixHeat = {
    tooltip: { position: 'top', formatter: (p) => `${MAT_LEVELS[p.data[1]]} × ${MAT_SECTORS[p.data[0]]}<br/>${p.data[2]} 人` },
    grid: { left: 72, right: 24, top: 12, bottom: 48 },
    xAxis: { type: 'category', data: MAT_SECTORS, splitArea: { show: true }, axisLabel: { color: '#93a1b5', fontSize: 10, rotate: 28 } },
    yAxis: { type: 'category', data: MAT_LEVELS, splitArea: { show: true }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    visualMap: { min: 0, max: Math.max(3, ...MAT_LEVELS.flatMap((lv, yi) => MAT_SECTORS.map((sec, xi) => filtered.filter((f) => f.level === lv && (f.sector === sec || (sec === '地方' && f.province && f.province !== '中央' && !f.sector))).length))), calculable: false, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#0f1623', AXIS.lineStyle.color, '#c41e3a', '#e8a317'] }, textStyle: { color: LABEL.color, fontSize: 10 } },
    series: [{ type: 'heatmap', data: MAT_LEVELS.flatMap((lv, yi) => MAT_SECTORS.map((sec, xi) => {
      const n = filtered.filter((f) => f.level === lv && (f.sector === sec || (sec === '地方' && f.province && f.province !== '中央' && (!f.sector || f.sector === '地方')))).length;
      return [xi, yi, n];
    })), label: { show: true, color: '#e8f4f8', fontSize: 10 }, emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } } }],
  };

  const meta = TAB_META[tab];
  const headerSubtitle = tab === 'resume'
    ? meta.subtitle(FIGURE_CATALOG_META.breakdown?.total || FIGURE_SEED.length, FIGURE_CATALOG_META.asOf)
    : meta.subtitle();

  return (
    <div>
      <PageHeader badge="Talent · 人才精英库"
        title={meta.title}
        subtitle={headerSubtitle} />

      <TabBar tabs={tabs} value={tab} onChange={setTab} variant="segment" sticky />

      {tab === 'anticorruption' ? (
        <AntiCorruptionSection />
      ) : tab === 'dissident' ? (
        <DissidentSection />
      ) : tab === 'taiwan' ? (
        <TaiwanPoliticalSection />
      ) : tab === 'education' ? (
        <HigherEducationSection />
      ) : tab === 'thinktank' ? (
        <ThinkTankSection />
      ) : tab === 'research' ? (
        <ResearchInstituteSection />
      ) : tab === 'knowledge' ? (
        <CulturalEliteSection />
      ) : tab === 'business' ? (
        <BusinessEliteSection />
      ) : tab === 'overseas' ? (
        <OverseasTalentSection />
      ) : tab === 'diplomatic' ? (
        <DiplomaticCorpsSection />
      ) : tab === 'self-media' ? (
        <SelfMediaSection />
      ) : (
        <>
      <StatGrid>
        <Stat value={figures.length} label="简历总数" accent="#22d3ee" />
        <Stat value={FIGURE_SEED.length} label="内置种子" accent="#64748b" />
        <Stat value={viceCount || '—'} label="副国级" accent="#c41e3a" />
        <Stat value={milCount || shangCount || '—'} label="军事将官" accent="#556b2f" />
        <Stat value={ministerCount || '—'} label="中央部委/机关" accent="#10b981" />
        <Stat value={citySecCount || secCount || '—'} label="书记/主官" accent="#e8a317" />
        <Stat value={avgAge || '—'} label="平均年龄" accent="#8b5cf6" />
        <Stat value={minorityCount || '—'} label="少数民族" accent="#fb923c" />
      </StatGrid>
      <p className="text-[11px] mono mb-4 -mt-2" style={{ color: 'var(--text-tertiary)' }}>
        数据截至 {FIGURE_CATALOG_META.asOf || '2026-06-27'} · 省级/中央/军事队列 · 反腐/知识/商业/海外等分轨见 Tab
      </p>

      {figures.length < 10 && (
        <Card title="一键载入中国政要" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            内置 {FIGURE_SEED.length} 条：省级 {FIGURE_CATALOG_META.breakdown?.provincial} + 人大政协 {FIGURE_CATALOG_META.breakdown?.provincialExtended} + 常委岗位 {FIGURE_CATALOG_META.breakdown?.provincialStanding} + 中央 {FIGURE_CATALOG_META.breakdown?.central} + 扩展 {FIGURE_CATALOG_META.breakdown?.extended} + 结构补全 {FIGURE_CATALOG_META.breakdown?.politicalStructure} + 城市 {FIGURE_CATALOG_META.breakdown?.municipal} + 地级市 {FIGURE_CATALOG_META.breakdown?.prefectureCity} + 机构 {FIGURE_CATALOG_META.breakdown?.org} + 二层 {FIGURE_CATALOG_META.breakdown?.orgTier2} + 军事 {FIGURE_CATALOG_META.breakdown?.military}。来源：{FIGURE_CATALOG_META.sources.join('、')}。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 人才精英</Link> 增量导入或粘贴更新。
          </p>
          <Button variant="primary" onClick={loadSeed} disabled={loading}>
            {loading ? '载入中…' : `载入 ${FIGURE_CATALOG_META.label}（${FIGURE_SEED.length} 条）`}
          </Button>
        </Card>
      )}

      {!figures.length ? (
        <Card title="中国政要队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置中国政要数据集，或到数据底座批量导入。</p></Card>
      ) : (
        <>
          {/* 工具条 */}
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 现任 / 籍贯 / 履历关键词" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={prov} onChange={(e) => setProv(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p)}</option>)}</select>
              <select value={sector} onChange={(e) => setSector(e.target.value)} style={inp}><option value="">全部系统</option>{[...SECTOR_OPTS, ...sectors.filter((s) => !SECTOR_OPTS.includes(s))].map((s) => <option key={s} value={s}>{s}</option>)}</select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inp}><option value="">全部层级</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
              <select value={institutionType} onChange={(e) => { setInstitutionType(e.target.value); setQuickFilter(''); }} style={inp}><option value="">全部机构带</option>{INSTITUTION_TYPE_OPTS.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}><option value="">全部职务</option>{ROLE_OPTS.map((r) => <option key={r} value={r}>{r}</option>)}</select>
              <select value={decade} onChange={(e) => setDecade(e.target.value)} style={inp}><option value="">全部年代</option>{decades.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <button onClick={() => setMinority((v) => !v)} style={{ ...inp, cursor: 'pointer', background: minority ? 'rgba(251,146,60,0.18)' : 'var(--bg-base)', color: minority ? '#fb923c' : 'var(--text-secondary)', borderColor: minority ? '#fb923c' : 'var(--border-subtle)' }}>少数民族</button>
              <button onClick={() => setQuickFilter((v) => v === 'military' ? '' : 'military')} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'military' ? 'rgba(85,107,47,0.2)' : 'var(--bg-base)', color: quickFilter === 'military' ? '#556b2f' : 'var(--text-secondary)', borderColor: quickFilter === 'military' ? '#556b2f' : 'var(--border-subtle)' }}>仅军事将官</button>
              <button onClick={() => setQuickFilter((v) => v === 'localChief' ? '' : 'localChief')} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'localChief' ? 'rgba(232,163,23,0.18)' : 'var(--bg-base)', color: quickFilter === 'localChief' ? '#e8a317' : 'var(--text-secondary)', borderColor: quickFilter === 'localChief' ? '#e8a317' : 'var(--border-subtle)' }}>仅地方主官</button>
              <button onClick={() => { setQuickFilter((v) => v === 'npc' ? '' : 'npc'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'npc' ? 'rgba(196,30,58,0.15)' : 'var(--bg-base)', color: quickFilter === 'npc' ? '#c41e3a' : 'var(--text-secondary)', borderColor: quickFilter === 'npc' ? '#c41e3a' : 'var(--border-subtle)' }}>人大</button>
              <button onClick={() => { setQuickFilter((v) => v === 'cppcc' ? '' : 'cppcc'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'cppcc' ? 'rgba(34,211,238,0.15)' : 'var(--bg-base)', color: quickFilter === 'cppcc' ? '#22d3ee' : 'var(--text-secondary)', borderColor: quickFilter === 'cppcc' ? '#22d3ee' : 'var(--border-subtle)' }}>政协</button>
              <button onClick={() => { setQuickFilter((v) => v === 'ministry' ? '' : 'ministry'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'ministry' ? 'rgba(16,185,129,0.15)' : 'var(--bg-base)', color: quickFilter === 'ministry' ? '#10b981' : 'var(--text-secondary)', borderColor: quickFilter === 'ministry' ? '#10b981' : 'var(--border-subtle)' }}>部委</button>
              <button onClick={() => { setQuickFilter((v) => v === 'centralParty' ? '' : 'centralParty'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'centralParty' ? 'rgba(139,92,246,0.15)' : 'var(--bg-base)', color: quickFilter === 'centralParty' ? '#8b5cf6' : 'var(--text-secondary)', borderColor: quickFilter === 'centralParty' ? '#8b5cf6' : 'var(--border-subtle)' }}>中直</button>
              <button onClick={() => { setQuickFilter((v) => v === 'judicial' ? '' : 'judicial'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'judicial' ? 'rgba(99,102,241,0.15)' : 'var(--bg-base)', color: quickFilter === 'judicial' ? '#6366f1' : 'var(--text-secondary)', borderColor: quickFilter === 'judicial' ? '#6366f1' : 'var(--border-subtle)' }}>司法</button>
              <button onClick={() => { setQuickFilter((v) => v === 'soe' ? '' : 'soe'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'soe' ? 'rgba(232,163,23,0.15)' : 'var(--bg-base)', color: quickFilter === 'soe' ? '#e8a317' : 'var(--text-secondary)', borderColor: quickFilter === 'soe' ? '#e8a317' : 'var(--border-subtle)' }}>央企</button>
              <button onClick={() => { setQuickFilter((v) => v === 'provLeg' ? '' : 'provLeg'); setInstitutionType(''); }} style={{ ...inp, cursor: 'pointer', background: quickFilter === 'provLeg' ? 'rgba(34,211,238,0.12)' : 'var(--bg-base)', color: quickFilter === 'provLeg' ? '#22d3ee' : 'var(--text-secondary)', borderColor: quickFilter === 'provLeg' ? '#22d3ee' : 'var(--border-subtle)' }}>地方人大政协</button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="default">默认排序</option><option value="ageAsc">年龄 ↑</option><option value="ageDesc">年龄 ↓</option><option value="level">按层级</option><option value="name">按姓名</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3'], ['matrix', 'Grid3x3'], ['radar', 'Hexagon']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  const title = v === 'matrix' ? '层级×系统矩阵' : v === 'radar' ? '人物画像·关系雷达' : v;
                  return <button key={v} onClick={() => setView(v)} title={title} style={{ padding: '6px 9px', background: on ? 'rgba(34,211,238,0.18)' : 'var(--bg-base)', color: on ? 'var(--cyber-cyan)' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {figures.length < FIGURE_SEED.length && (
                <button onClick={loadSeed} disabled={loading} title="补全到最新内置库" style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${FIGURE_SEED.length} 条`}
                </button>
              )}
            </div>
            {activeChips.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-3 items-center">
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>筛选</span>
                {activeChips.map(([k, v, clr], i) => (
                  <button key={i} onClick={clr} className="text-[11px] mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>{v}<Lucide.X size={11} />
                  </button>
                ))}
                <button onClick={clearAll} className="text-[11px] mono px-2 py-0.5" style={{ color: 'var(--china-red)', background: 'none', border: 'none', cursor: 'pointer' }}>清空</button>
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>命中 {filtered.length} / {figures.length} 条 · 平均 {avgAge}岁 · ↑↓ 或 j/k 切换</span>
              {dupCount > 0 && (
                <span className="text-[11px] mono flex items-center gap-2" style={{ color: '#e8a317' }}>
                  · 已去重展示，隐藏 {dupCount} 条重复
                  <button onClick={loadSeed} disabled={loading} title="清空并以稳定 id 重载，物理清除重复" className="px-2 py-0.5 rounded flex items-center gap-1" style={{ background: 'rgba(232,163,23,0.14)', border: '1px solid rgba(232,163,23,0.4)', color: '#e8a317', cursor: 'pointer' }}>
                    <Lucide.Wand2 size={11} />{loading ? '清理中…' : '清理库内重复'}
                  </button>
                </span>
              )}
            </div>
          </Card>

          {view === 'matrix' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// 层级 × 系统 交叉矩阵 · 基于当前筛选 {filtered.length} 人 · 单元格数字=人数</div>
              <Card title="权力结构矩阵 · 层级 × 系统"><EChart option={matrixHeat} style={{ height: Math.max(280, MAT_LEVELS.length * 36 + 80) }} /></Card>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))' }}>
                <Card title="层级（点选筛选）"><DistBar data={distLevel.filter(([k]) => k)} color="#c41e3a" onPick={(k) => setLevel(level === k ? '' : k)} active={level} /></Card>
                <Card title="系统（点选筛选）"><DistBar data={distSector} color="#22d3ee" onPick={(k) => setSector(sector === k ? '' : k)} active={sector} /></Card>
              </div>
            </div>
          ) : view === 'radar' ? (
            <div className="talent-split talent-split--balanced mb-4">
              <Card title={`人物选择 (${filtered.length})`} asSection={false} className="talent-split__list-card">
                <p className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  // 关系雷达 · 六维启发式画像 · 可选第二人叠加对比
                </p>
                <div className="mb-3">
                  <label className="text-[10px] mono block mb-1" style={{ color: 'var(--text-tertiary)' }}>对比人物（可选）</label>
                  <select
                    value={compareId}
                    onChange={(e) => setCompareId(e.target.value)}
                    style={inp}
                    className="w-full"
                  >
                    <option value="">不对比 · 仅显示队列均值</option>
                    {filtered.filter((f) => f.id !== detail?.id).map((f) => (
                      <option key={f.id} value={f.id}>{f.name} · {short(f.province) || f.role || ''}</option>
                    ))}
                  </select>
                </div>
                <div className="talent-split__scroll space-y-1.5">
                  {filtered.map((f) => {
                    const on = detail?.id === f.id;
                    return (
                      <button key={f.id} onClick={() => selectEntity(f)} className={`os-list-item w-full text-left px-3 py-2 rounded ${on ? 'is-selected' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <FigureAvatar {...figureAvatarProps(f)} size={24} ring={on} />
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                          {f.level && <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{f.level}</span>}
                        </div>
                        <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{f.fields?.title || f.org || ''}</div>
                      </button>
                    );
                  })}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>
              <div className="talent-split__detail">
                <FigureRadarChart
                  figure={detail ? applyTalentEnrichment(detail, { queue: 'figures' }) : null}
                  compareFigure={compareFigure ? applyTalentEnrichment(compareFigure, { queue: 'figures' }) : null}
                  cohortFigures={filtered}
                  antiCorruptionNames={antiCorruptionNames}
                />
              </div>
            </div>
          ) : view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// 多维统计基于当前命中 {filtered.length} 人；调整上方筛选条件，所有图表实时联动</div>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))' }}>
                <Card title={`年龄结构 · 均 ${avgAge}岁`}><EChart option={ageBar} style={{ height: 200 }} /></Card>
                <Card title={`层级构成 · ${distLevel.filter(([k]) => k).length} 档`}><EChart option={levelDonut} style={{ height: 200 }} /></Card>
                <Card title={`系统口径 · ${distSector.length} 类`}><EChart option={sectorDonut} style={{ height: 200 }} /></Card>
                <Card title="中央委员身份构成"><EChart option={rankDonut} style={{ height: 200 }} /></Card>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(330px,1fr))' }}>
                <Card title="出生年代 × 层级 · 代际权力结构"><EChart option={decadeLevel} style={{ height: 270 }} /><p className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>// 各年代在不同层级的人数堆叠——看「哪一代正卡在哪一层」</p></Card>
                <Card title="籍贯输出 ↔ 现任流入 · 人才地理对流"><EChart option={flowBar} style={{ height: 270 }} /><p className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>// 左=该省籍贯官员数（输出），右=在该省任职数（流入）</p></Card>
                <Card title="籍贯 · 人才输出地 Top12"><EChart option={nativeBar} style={{ height: 270 }} /></Card>
                <Card title="年龄 × 现职任期 · 晋升轨迹（按层级着色）"><EChart option={ageTenure} style={{ height: 270 }} /><p className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>// 左上=年轻且新任（上升势头）· 右下=年长且久任</p></Card>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))' }}>
                <Card title="层级（点选筛选）"><DistBar data={distLevel.filter(([k]) => k)} color="#c41e3a" onPick={(k) => setLevel(level === k ? '' : k)} active={level} /></Card>
                <Card title="出生年代（点选筛选）"><DistBar data={distDecade} color="#8b5cf6" onPick={(k) => setDecade(decade === k ? '' : k)} active={decade} /></Card>
                <Card title="现任地域 Top（点选筛选）"><DistBar data={distProv} color="#22d3ee" onPick={(k) => { const full = provinces.find((p) => short(p) === k); setProv(prov === full ? '' : full); }} active={short(prov)} /></Card>
              </div>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 年龄按公开出生年份折算 · 任期按上任日期折算（截至 {CUR_YEAR}）· 中央委员身份据二十届名单 · 籍贯/任期数据覆盖率不一，未注明者不计入对应图</p>
            </div>
          ) : (
            <div className="talent-split talent-split--list-detail mb-4">
              <Card title={`检索结果 (${filtered.length}/${figures.length})`} asSection={false} className="talent-split__list-card">
                {view === 'grid' ? (
                  <div className="talent-split__scroll grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))' }}>
                    {filtered.map((f) => (
                      <button key={f.id} onClick={() => selectEntity(f)} className={`os-list-item text-left p-2.5 rounded ${detail?.id === f.id ? 'is-selected' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <FigureAvatar {...figureAvatarProps(f)} size={26} ring={detail?.id === f.id} />
                          <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {f.province && <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                          {ageOf(f) && <span className="text-[9px] mono px-1 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{ageOf(f)}岁</span>}
                        </div>
                        <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{f.role || f.fields?.title || ''}</div>
                      </button>
                    ))}
                    {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                ) : (
                  <div className="talent-split__scroll space-y-1.5">
                    {filtered.map((f) => {
                      const on = detail?.id === f.id; const age = ageOf(f);
                      return (
                        <button key={f.id} onClick={() => selectEntity(f)} className={`os-list-item w-full text-left px-3 py-2 rounded ${on ? 'is-selected' : ''}`}>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <FigureAvatar {...figureAvatarProps(f)} size={28} ring={on} />
                            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                            {age && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{age}岁·{decadeOf(f)}</span>}
                            {f.level && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{f.level}</span>}
                            {f.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                            {f.role && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{f.role}</span>}
                            {f.sector && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{f.sector}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{f.fields?.title || f.org || ''}</span>
                            {f.fields?.native && <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>籍 {nativeProv(f)}</span>}
                          </div>
                        </button>
                      );
                    })}
                    {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                )}
              </Card>

              <div className="talent-split__detail space-y-4">
              <FigureRadarChart
                figure={detail ? applyTalentEnrichment(detail, { queue: 'figures' }) : null}
                cohortFigures={filtered}
                antiCorruptionNames={antiCorruptionNames}
                showCohortAvg={false}
              />
              <Card title={detail ? `${detail.name} · 履历详情` : '选择一位'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'figures' });
                  const age = ageOf(d);
                  const ten = tenureYears(d);
                  const tenureNowVal = (() => { const m = (d.fields?.tookOffice || '').match(/(\d{4})/); return m ? CUR_YEAR - +m[1] : ten; })();
                  const tagList = [...new Set([...normalizeTags(d.tags), d.role, d.sector, d.level, decadeOf(d)].filter((t) => t && t !== '未知'))];
                  const baseSections = [
                        {
                          title: '基本信息',
                          cols: 3,
                          fields: [
                            { label: '现任/头衔', value: d.fields?.title },
                            { label: '机构', value: d.org ? `${d.org}${d.sector ? `（${d.sector}）` : ''}` : null },
                            { label: '关联地域', value: d.province ? (d.province === '中央' ? '中央/国家机构' : d.province) : null },
                            { label: '籍贯', value: d.fields?.native },
                            { label: '民族', value: d.fields?.ethnic && d.fields.ethnic !== '汉族' ? d.fields.ethnic : null, accent: '#fb923c' },
                            { label: '出生', value: d.fields?.birth ? `${d.fields.birth}${age ? ` · 现 ${age} 岁` : ''}` : null },
                            { label: '学历', value: d.fields?.edu },
                            { label: '城市层级', value: d.fields?.cityTier },
                          ],
                        },
                        {
                          title: '权力结构',
                          cols: 3,
                          fields: [
                            { label: '层级', value: d.level, accent: 'var(--china-red)' },
                            { label: '职务', value: d.role },
                            { label: '系统', value: d.sector, accent: '#d4af37' },
                            { label: '中委身份', value: d.fields?.rank },
                            { label: '现职任期', value: tenureNowVal != null ? `约 ${tenureNowVal} 年` : null },
                            { label: '上任', value: d.fields?.tookOffice },
                            { label: '军阶', value: d.fields?.milRank },
                            { label: '军种/战区', value: [d.fields?.milBranch, d.fields?.milUnit].filter(Boolean).join(' · ') || null },
                          ],
                        },
                  ];
                  return (
                    <TalentDetailPanel
                      name={d.name}
                      subtitle={d.fields?.title || d.org || ''}
                      avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                      verifyRecord={d}
                      crossLinks={<CrossRefLinks record={d} queue="figures" />}
                      badges={(
                        <>
                          {d.level && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{d.level}</span>}
                          {age && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{age}岁 · {decadeOf(d)}</span>}
                          {d.role && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{d.role}</span>}
                        </>
                      )}
                      tags={tagList}
                      tagAccent="#c41e3a"
                      sections={buildTalentDetailSections(d, { queue: 'figures', baseSections, bioLabel: '公开任职要点' })}
                      timeline={eventsToTimeline(d) || d.career}
                      timelineExpandable
                      timelineAccent="var(--cyber-cyan)"
                      queueNote="// 政治权力队列 · 公开任职口径 · 不含私人信息"
                      footer={buildDetailFooter(d)}
                    />
                  );
                })()}
              </Card>
              </div>
            </div>
          )}
        </>
      )}
      <ModuleFooter
        moduleId="talent"
        disclaimer={`政治权力队列：仅收录公开任职履历，不含私人信息；年龄按公开出生年份折算，任免以新华社/人民网/中国政府网发布为准。${FIGURE_CATALOG_META.notes ? ` ${FIGURE_CATALOG_META.notes}。` : ''}与治国沙盒「可选简历」按省联动。`}
      />
        </>
      )}
    </div>
  );
}
