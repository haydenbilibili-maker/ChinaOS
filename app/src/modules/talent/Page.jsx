import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import { useFigures } from '../../lib/db/useDataset.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };

export default function Page() {
  const figures = useFigures();
  const [q, setQ] = useState('');
  const [prov, setProv] = useState('');
  const [kind, setKind] = useState('');
  const [sel, setSel] = useState(null);

  const provinces = useMemo(() => [...new Set((figures || []).map((f) => f.province).filter(Boolean))].sort(), [figures]);
  const kinds = useMemo(() => [...new Set((figures || []).map((f) => f.kind).filter(Boolean))], [figures]);
  const filtered = useMemo(() => (figures || []).filter((f) =>
    (!prov || f.province === prov) && (!kind || f.kind === kind) &&
    (!q || (f.name + ' ' + (f.fields?.title || '') + ' ' + short(f.province) + ' ' + (f.fields?.edu || '') + ' ' + (f.raw || '') + ' ' + (f.career || []).map((c) => c.desc).join(' ')).toLowerCase().includes(q.toLowerCase()))
  ), [figures, q, prov, kind]);
  const detail = sel || filtered[0] || null;

  if (figures === null) return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载人才库…</div>;

  return (
    <div>
      <PageHeader badge="Talent · 人才库" title="省部级公开履历人才库"
        subtitle="按省份 / 履历 / 类型检索 —— admin 从权威来源批量导入，与治国沙盒人才配置联动" />
      <Grid cols={4} className="mb-6">
        <Stat value={figures.length} label="简历总数" accent="#22d3ee" />
        <Stat value={provinces.length} label="覆盖省份" accent="#10b981" />
        <Stat value={figures.filter((f) => f.kind === '公开').length} label="公开任职（真实源）" accent="#c41e3a" />
        <Stat value={figures.reduce((s, f) => s + (f.career?.length || 0), 0)} label="履历条目" accent="#e8a317" />
      </Grid>

      {!figures.length ? (
        <Card title="人才库为空">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 政治人物简历</Link> 批量导入公开履历，或点「载入公开样本」。导入后此处即可按省/履历检索。</p>
        </Card>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
          <Card title={`检索结果 (${filtered.length}/${figures.length})`}>
            <div className="flex gap-2 flex-wrap mb-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 现任 / 履历关键词" style={{ ...inp, flex: 1, minWidth: 140 }} />
              <select value={prov} onChange={(e) => setProv(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p)}</option>)}</select>
              <select value={kind} onChange={(e) => setKind(e.target.value)} style={inp}><option value="">全部类型</option>{kinds.map((k) => <option key={k} value={k}>{k}</option>)}</select>
            </div>
            <div className="space-y-2" style={{ maxHeight: 460, overflowY: 'auto' }}>
              {filtered.map((f) => (
                <button key={f.id} onClick={() => setSel(f)} className="w-full text-left p-3 rounded" style={{ background: detail?.id === f.id ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${detail?.id === f.id ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                    {f.province && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                    {f.kind && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: f.kind === '公开' ? 'rgba(16,185,129,0.14)' : 'var(--bg-base)', color: f.kind === '公开' ? '#10b981' : 'var(--text-tertiary)' }}>{f.kind}</span>}
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
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3">
                  {detail.fields?.title && <span style={{ color: 'var(--text-secondary)' }}>现任：{detail.fields.title}</span>}
                  {detail.province && <span style={{ color: 'var(--text-tertiary)' }}>关联省份：{short(detail.province)}</span>}
                  {detail.fields?.native && <span style={{ color: 'var(--text-tertiary)' }}>籍贯：{detail.fields.native}</span>}
                  {detail.fields?.edu && <span style={{ color: 'var(--text-tertiary)' }}>学历：{detail.fields.edu}</span>}
                </div>
                {detail.career?.length > 0 ? (
                  <div className="space-y-2">
                    {detail.career.map((c, i) => (
                      <div key={i} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
                        <span className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>{c.from}{c.to ? `–${c.to}` : ' 至今'}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>{c.desc}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>暂无结构化履历条目。</p>}
                <div className="mt-3 pt-3 text-[11px]" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>来源：{detail.source || '用户导入'}</div>
              </>
            )}
          </Card>
        </div>
      )}
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>仅收录公开任职履历，不含私人信息；真实人物以官方资料库为准，「示例」条目为演示用、非真实任命。与治国沙盒「可选简历」按省联动。</p>
    </div>
  );
}
