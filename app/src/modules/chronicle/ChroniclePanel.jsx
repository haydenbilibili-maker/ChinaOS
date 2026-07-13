// 国运时间轴谱系 · 1949→2026 —— 七个时代 × 六域大事记
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { AS_OF, ERAS, DOMAINS, EVENTS } from './data.js';

const AXIS_LABEL = { color: LABEL.color, fontSize: 10 };
const SPLIT_LINE = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };
const TOOLTIP_SKIN = {
  backgroundColor: 'rgba(15, 22, 35, 0.94)',
  borderColor: 'rgba(148, 163, 184, 0.22)',
  borderWidth: 1,
  textStyle: { color: '#e8edf6', fontSize: 11 },
  extraCssText: 'border-radius: 8px;',
};

const TURNS = [
  { y: 1978, title: '十一届三中全会', accent: '#10b981', fork: '从阶级斗争转向经济建设，市场与开放变量首次进入国家方程。', lock: '发展主义合法性确立，「增长锦标赛」成为此后四十年的治理评价底座。' },
  { y: 1992, title: '南方谈话', accent: '#10b981', fork: '终结「姓社姓资」争论，市场化在政治背书下重启加速。', lock: '出口导向 + 土地财政 + 招商引资的地方竞争模式自此锁定。' },
  { y: 2001, title: '加入 WTO', accent: '#22d3ee', fork: '全面嵌入全球分工体系，规则与关税向国际接轨。', lock: '「世界工厂」定位与外需依赖成型，沿海制造业集群路径固化。' },
  { y: 2008, title: '金融危机 + 四万亿', accent: '#e8a317', fork: '外需塌方倒逼超大规模内需刺激，基建地产成为对冲主力。', lock: '债务—土地—基建循环与地方融资平台路径就此绑定，延续至今。' },
  { y: 2018, title: '贸易战开端', accent: '#fb923c', fork: '中美从接触合作转向战略竞争，技术封锁与脱钩压力开启。', lock: '自主可控与双循环升格为长期主线，安全权重系统性上升。' },
];

export default function ChroniclePanel() {
  const [eraId, setEraId] = useState(null);
  const [domainId, setDomainId] = useState('all');
  const [majorOnly, setMajorOnly] = useState(false);
  const [sel, setSel] = useState(null);

  const domIdx = useMemo(() => Object.fromEntries(DOMAINS.map((d, i) => [d.id, i])), []);
  const domById = useMemo(() => Object.fromEntries(DOMAINS.map((d) => [d.id, d])), []);
  const era = eraId ? ERAS.find((e) => e.id === eraId) : null;
  const majorCount = useMemo(() => EVENTS.filter((e) => e.w === 3).length, []);

  const filtered = useMemo(() => EVENTS.filter((e) =>
    (!era || (e.y >= era.range[0] && e.y <= era.range[1]))
    && (domainId === 'all' || e.domain === domainId)
    && (!majorOnly || e.w === 3)
  ), [era, domainId, majorOnly]);

  const scatterOpt = useMemo(() => ({
    grid: { left: 76, right: 20, top: 16, bottom: 56 },
    tooltip: {
      ...TOOLTIP_SKIN, trigger: 'item', confine: true,
      formatter: (p) => p.data?.title
        ? `<span style="font-family:monospace">${p.data.y}</span> · <b>${p.data.title}</b><br/><span style="opacity:.8">${p.data.desc}</span>`
        : '',
    },
    xAxis: {
      type: 'value', min: era ? era.range[0] - 1 : 1948, max: era ? era.range[1] + 1 : 2027,
      axisLabel: { ...AXIS_LABEL, formatter: (v) => String(v) },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.07)' } },
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
    },
    yAxis: {
      type: 'category', data: DOMAINS.map((d) => d.label), inverse: true,
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisTick: { show: false },
      axisLabel: { ...AXIS_LABEL, fontSize: 11 }, splitLine: SPLIT_LINE,
    },
    dataZoom: [
      { type: 'inside' },
      { type: 'slider', height: 18, bottom: 4, textStyle: { fontSize: 9, color: '#64748b' } },
    ],
    series: [{
      type: 'scatter',
      data: filtered.map((e) => ({
        ...e,
        value: [e.y, domIdx[e.domain]],
        symbolSize: e.w * 4 + 4,
        itemStyle: {
          color: domById[e.domain]?.accent,
          borderColor: e.w === 3 ? '#fff' : 'transparent',
          borderWidth: e.w === 3 ? 1 : 0,
        },
      })),
    }],
  }), [filtered, era, domIdx, domById]);

  const densityOpt = useMemo(() => {
    const starts = [];
    for (let s = 1949; s <= 2026; s += 5) starts.push(s);
    const labels = starts.map((s) => `${s}-${String(Math.min(s + 4, 2026)).slice(2)}`);
    return {
      grid: { left: 36, right: 12, top: 12, bottom: 36 },
      tooltip: { ...TOOLTIP_SKIN, trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: labels, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { ...AXIS_LABEL, fontSize: 9, rotate: 38 } },
      yAxis: { type: 'value', splitLine: SPLIT_LINE, axisLabel: AXIS_LABEL },
      series: DOMAINS.map((d) => ({
        name: d.label, type: 'bar', stack: 'total', barWidth: '60%',
        itemStyle: { color: d.accent },
        data: starts.map((s) => EVENTS.filter((e) => e.domain === d.id && e.y >= s && e.y <= Math.min(s + 4, 2026)).length),
      })),
    };
  }, []);

  const shown = filtered.slice(0, 60);
  const folded = filtered.length - shown.length;
  const decadeGroups = useMemo(() => {
    const map = new Map();
    shown.forEach((e) => {
      const key = `${Math.floor(e.y / 10) * 10}s`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return [...map.entries()];
  }, [shown]);

  return (
    <div className="guoyun-chronicle-panel">
      <div className="text-xs mono mb-4" style={{ color: '#5e8c7a' }}>
        1949→2026 · 七时代 · 六域 · {EVENTS.length} 节点 · 截至 {AS_OF}
      </div>

      <IntroCard>
        长周期读法：单一事件是噪声，节点序列才是结构。把 77 年压进一张时间轴，看的不是「发生了什么」，
        而是「什么在反复发生、什么一旦发生就不可逆」——时间轴是路径依赖与康波周期的经验底片：
        每一次关键转折都在收窄后续的选择集，每一段密集期都对应一轮要素与技术的重新定价。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={EVENTS.length} label="事件节点总数" accent="var(--cyber-cyan)" />
        <Stat value={7} label="时代分段" accent="var(--fire-gold)" />
        <Stat value={6} label="观察域" accent="#8b5cf6" />
        <Stat value={majorCount} label="重大节点 (w=3)" accent="var(--china-red)" />
      </Grid>

      <Card title="时代分段 · 点选聚焦区间">
        <div className="flex flex-wrap gap-2 mb-3">
          {ERAS.map((er) => {
            const active = er.id === eraId;
            return (
              <button
                key={er.id} type="button"
                onClick={() => { setEraId(active ? null : er.id); setSel(null); }}
                className={`os-filter-chip mono ${active ? 'is-active' : ''}`}
                style={{ '--chip-accent': er.accent }}
              >
                <span style={{ color: active ? undefined : er.accent }}>{er.range[0]}–{er.range[1]}</span>
                {' '}{er.label}
              </button>
            );
          })}
        </div>
        {era && (
          <div className="os-card p-4" style={{ borderLeft: `3px solid ${era.accent}`, background: 'var(--bg-elevated)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: era.accent }}>
              {era.label} · {era.range[0]}–{era.range[1]}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{era.summary}</p>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <button
          type="button" onClick={() => setDomainId('all')}
          className={`os-filter-chip mono ${domainId === 'all' ? 'is-active' : ''}`}
          style={{ '--chip-accent': 'var(--cyber-cyan)' }}
        >全部域</button>
        {DOMAINS.map((d) => (
          <button
            key={d.id} type="button" onClick={() => setDomainId(d.id)}
            className={`os-filter-chip mono ${domainId === d.id ? 'is-active' : ''}`}
            style={{ '--chip-accent': d.accent }}
          >{d.label}</button>
        ))}
        <button
          type="button" onClick={() => setMajorOnly((v) => !v)}
          className={`os-filter-chip mono ${majorOnly ? 'is-active' : ''}`}
          style={{ '--chip-accent': 'var(--china-red)', marginLeft: 'auto' }}
        >★ 仅看重大</button>
      </div>

      <Card title={`六域大事记 · ${era ? `${era.label} ${era.range[0]}–${era.range[1]}` : '全程 1949–2026'} · ${filtered.length} 节点`}>
        <EChart
          option={scatterOpt}
          style={{ height: 320 }}
          onReady={(ch) => {
            ch.off('click');
            ch.on('click', (p) => { if (p?.data?.title) setSel(p.data); });
          }}
        />
      </Card>

      {sel ? (
        <div className="os-card p-5 mb-6" style={{ borderLeft: `3px solid ${domById[sel.domain]?.accent || 'var(--china-red)'}` }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="mono text-3xl font-bold" style={{ color: domById[sel.domain]?.accent }}>{sel.y}</div>
            <div className="flex-1" style={{ minWidth: 240 }}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-[11px] mono px-2 py-0.5 rounded"
                  style={{ color: domById[sel.domain]?.accent, border: `1px solid ${domById[sel.domain]?.accent}` }}
                >{domById[sel.domain]?.label}</span>
                <span className="text-[11px]" style={{ color: 'var(--fire-gold)' }}>{'★'.repeat(sel.w || 1)}</span>
                <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{sel.title}</span>
              </div>
              <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>{sel.desc}</p>
              {sel.to && (
                <Link to={sel.to} className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>进入相关模块 →</Link>
              )}
            </div>
            <button type="button" onClick={() => setSel(null)} className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>关闭 ✕</button>
          </div>
        </div>
      ) : (
        <div className="os-card p-4 mb-6 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          点击时间轴节点查看详情 —— 节点大小 = 重要级（w1/w2/w3），白色描边 = 重大节点
        </div>
      )}

      <Card title="事件密度 · 五年桶 × 六域堆叠 —— 哪个时代哪个域在密集发生">
        <EChart option={densityOpt} style={{ height: 200 }} />
      </Card>

      <Card title={`事件流 · 按年代分组（${shown.length} / ${filtered.length} 条）`}>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {decadeGroups.map(([decade, evs]) => (
            <div key={decade} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs mono font-semibold mb-2 pb-2" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
                {decade} · {evs.length} 条
              </div>
              {evs.map((e) => (
                <div key={`${e.y}-${e.title}`} className="mb-2.5">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs mono font-bold" style={{ color: domById[e.domain]?.accent }}>{e.y}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{e.title}</span>
                    {e.w === 3 && <span className="text-[10px]" style={{ color: 'var(--fire-gold)' }}>★★★</span>}
                    {e.to && <Link to={e.to} className="text-[11px] mono" style={{ color: 'var(--cyber-cyan)' }}>→</Link>}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{e.desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {folded > 0 && (
          <p className="text-xs mono mt-3" style={{ color: 'var(--fire-gold)' }}>
            +{folded} 条被折叠 —— 用时代 / 域 / 重大筛选聚焦后查看
          </p>
        )}
        {filtered.length === 0 && (
          <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>当前筛选组合下无事件，放宽条件试试。</p>
        )}
      </Card>

      <Card title="关键转折 · 五个改写选择集的节点">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {TURNS.map((t) => (
            <div key={t.y} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${t.accent}` }}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="mono text-xl font-bold" style={{ color: t.accent }}>{t.y}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
              </div>
              <div className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: t.accent }}>分岔：</span>{t.fork}
              </div>
              <div className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>锁定：</span>{t.lock}
              </div>
              <Link to="/pathdependence" className="text-[11px] mono" style={{ color: 'var(--cyber-cyan)' }}>路径依赖视角 →</Link>
            </div>
          ))}
        </div>
      </Card>

      <FrameworkTrio
        cards={[
          {
            key: 'wave', title: '长波底片', subtitle: '康波视角', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
            body: '1949→2026 横跨第四、第五康波：重工业化对应战后繁荣尾段，改革开放吃到信息长波的全球化红利，当下处在新旧长波交替的萧条—回升换挡期。时间轴上的密集区，多与长波相位切换重合。',
          },
          {
            key: 'juncture', title: '关键节点', subtitle: 'Critical Juncture', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
            body: '1978 / 1992 / 2001 / 2008 / 2018 —— 每个关键节点都不是孤立选择，而是旧均衡失效后的被迫分岔；一旦走出，制度与利益结构迅速自我强化，回头成本指数级上升。读时间轴先找节点，再看节点之间的惯性。',
          },
          {
            key: 'cycle', title: '周期与韧性', subtitle: '治乱与改革的节律', accent: 'var(--china-red)', border: 'var(--china-red)',
            body: '七十七年里「收紧—放开—再平衡」的节律反复出现：危机倒逼改革，改革催生繁荣，繁荣积累失衡。判断当下位置，不靠单一事件定性，而看这一轮节律走到了哪一拍、对冲工具还剩多少。',
          },
        ]}
      />

      <ModuleFooter
        moduleId="guoyun"
        links={[
          { to: '/pathdependence', label: '路径依赖', note: '关键节点如何收窄选择集' },
          { to: '/cognition', label: '康波周期', note: '长波坐标对照' },
          { to: '/modules/guoyun', label: '国运推演', note: '未来情景谱系' },
          { to: '/modules/yishixingtai', label: '合法性机器', note: 'GY-02 意识形态架构' },
        ]}
        disclaimer="大事记为公开史实策展（教科书/白皮书口径），节点取舍为分析框架服务，非完整编年史"
      />
    </div>
  );
}
