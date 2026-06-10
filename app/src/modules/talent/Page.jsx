import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from '../../lib/db/figureSeed.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const ROLE_OPTS = ['', '党委书记', '省长', '市长', '自治区主席', '总书记', '总理', '人大委员长', '政协主席', '书记处书记', '副总理', '纪委书记'];

export default function Page() {
  const figures = useFigures();
  const [q, setQ] = useState('');
  const [prov, setProv] = useState('');
  const [level, setLevel] = useState('');
  const [role, setRole] = useState('');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const provinces = useMemo(() => [...new Set((figures || []).map((f) => f.province).filter(Boolean))].sort(), [figures]);
  const levels = useMemo(() => [...new Set((figures || []).map((f) => f.level).filter(Boolean))], [figures]);
  const asOf = useMemo(() => {
    const dates = (figures || []).map((f) => f.asOf).filter(Boolean);
    return dates.length ? dates[0] : null;
  }, [figures]);

  const filtered = useMemo(() => (figures || []).filter((f) => {
    const hay = [f.name, f.fields?.title, f.fields?.rank, f.fields?.native, f.province, short(f.province), f.role, f.level, f.raw, ...(f.career || []).map((c) => c.desc)].join(' ');
    return (!prov || f.province === prov)
      && (!level || f.level === level)
      && (!role || f.role === role)
      && (!q || hay.toLowerCase().includes(q.toLowerCase()));
  }), [figures, q, prov, level, role]);

  const detail = sel || filtered[0] || null;
  const secCount = (figures || []).filter((f) => f.role === '党委书记').length;
  const chiefCount = (figures || []).filter((f) => ['省长', '市长', '自治区主席'].includes(f.role)).length;

  const loadSeed = async () => {
    setLoading(true);
    let ts = Date.now();
    for (const r of FIGURE_SEED) await DB.putFigure({ ...r, updatedAt: ts++ });
    setLoading(false);
  };

  if (figures === null) return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载人才库…</div>;

  return (
    <div>
      <PageHeader badge="Talent · 人才库" title="省部级公开履历人才库"
        subtitle={`按省份 / 层级 / 职务 / 履历检索 —— 内置数据集截至 ${FIGURE_CATALOG_META.asOf}，与治国沙盒人才配置联动`} />
      <Grid cols={4} className="mb-6">
        <Stat value={figures.length} label="简历总数" accent="#22d3ee" />
        <Stat value={provinces.length} label="覆盖省份" accent="#10b981" />
        <Stat value={secCount || '—'} label="省委书记/区委书记" accent="#c41e3a" />
        <Stat value={chiefCount || '—'} label="省长/市长/主席" accent="#e8a317" />
      </Grid>

      {figures.length < 10 && (
        <Card title="一键载入省部级公开履历" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            内置 {FIGURE_SEED.length} 条公开任职记录（政治局常委 7 + 31 省党委书记 + 31 省政府首长），来源：{FIGURE_CATALOG_META.sources.join('、')}。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 政治人物简历</Link> 增量导入或粘贴更新。
          </p>
          <button type="button" onClick={loadSeed} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${FIGURE_CATALOG_META.label}（${FIGURE_SEED.length} 条）`}
          </button>
        </Card>
      )}

      {!figures.length ? (
        <Card title="人才库为空">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置数据集，或到数据底座批量导入。</p>
        </Card>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
          <Card title={`检索结果 (${filtered.length}/${figures.length})${asOf ? ` · 数据截至 ${asOf}` : ''}`}>
            <div className="flex gap-2 flex-wrap mb-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 现任 / 履历关键词" style={{ ...inp, flex: 1, minWidth: 140 }} />
              <select value={prov} onChange={(e) => setProv(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p)}</option>)}</select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inp}><option value="">全部层级</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}><option value="">全部职务</option>{ROLE_OPTS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}</select>
            </div>
            <div className="space-y-2" style={{ maxHeight: 460, overflowY: 'auto' }}>
              {filtered.map((f) => (
                <button key={f.id} type="button" onClick={() => setSel(f)} className="w-full text-left p-3 rounded" style={{ background: detail?.id === f.id ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${detail?.id === f.id ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                    {f.province && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                    {f.role && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{f.role}</span>}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{f.fields?.title || ''}</div>
                </button>
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          </Card>
          <Card title={detail ? `${detail.name} · 履历详情` : '选择一位'}>
            {detail && (
              <>
                <div className="grid gap-1 text-xs mb-3" style={{ gridTemplateColumns: 'auto 1fr' }}>
                  {detail.fields?.title && <><span style={{ color: 'var(--text-tertiary)' }}>现任</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.title}</span></>}
                  {detail.level && <><span style={{ color: 'var(--text-tertiary)' }}>层级</span><span style={{ color: 'var(--text-secondary)' }}>{detail.level}{detail.role ? ` · ${detail.role}` : ''}</span></>}
                  {detail.province && <><span style={{ color: 'var(--text-tertiary)' }}>关联省份</span><span style={{ color: 'var(--text-secondary)' }}>{detail.province}</span></>}
                  {detail.fields?.birth && <><span style={{ color: 'var(--text-tertiary)' }}>出生</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.birth}</span></>}
                  {detail.fields?.native && <><span style={{ color: 'var(--text-tertiary)' }}>籍贯</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.native}</span></>}
                  {detail.fields?.ethnic && detail.fields.ethnic !== '汉族' && <><span style={{ color: 'var(--text-tertiary)' }}>民族</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.ethnic}</span></>}
                  {detail.fields?.rank && <><span style={{ color: 'var(--text-tertiary)' }}>中央委员身份</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.rank}</span></>}
                  {detail.fields?.tookOffice && <><span style={{ color: 'var(--text-tertiary)' }}>上任日期</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.tookOffice}</span></>}
                  {detail.fields?.edu && <><span style={{ color: 'var(--text-tertiary)' }}>学历</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.edu}</span></>}
                  {detail.fields?.note && <><span style={{ color: 'var(--text-tertiary)' }}>备注</span><span style={{ color: '#e8a317' }}>{detail.fields.note}</span></>}
                </div>
                {detail.career?.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>公开任职时间线</div>
                    {detail.career.map((c, i) => (
                      <div key={i} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
                        <span className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>{c.from}{c.to ? `–${c.to}` : ' 至今'}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>{c.desc}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>暂无结构化履历条目。</p>}
                <div className="mt-3 pt-3 text-[11px] flex flex-wrap gap-x-3" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                  <span>来源：{detail.source || '用户导入'}</span>
                  {detail.asOf && <span>截至：{detail.asOf}</span>}
                </div>
              </>
            )}
          </Card>
        </div>
      )}
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        仅收录公开任职履历，不含私人信息；任免以新华社/人民网/中国政府网发布为准。
        {FIGURE_CATALOG_META.notes && ` ${FIGURE_CATALOG_META.notes}。`}
        与治国沙盒「可选简历」按省联动。
      </p>
    </div>
  );
}
