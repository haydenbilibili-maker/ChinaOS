import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const gdpTrend = {
  grid: { left: 48, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['1978', '1990', '2000', '2010', '2020', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'log', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [0.36, 1.9, 10, 41, 101, 134], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};
const industryTrend = {
  legend: { data: ['第一产业', '第二产业', '第三产业'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['1978', '1990', '2005', '2015', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '第一产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(16,185,129,0.3)' }, data: [28, 27, 12, 9, 7], lineStyle: { color: '#10b981' } },
    { name: '第二产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(196,30,58,0.3)' }, data: [48, 41, 47, 41, 38], lineStyle: { color: '#c41e3a' } },
    { name: '第三产业', type: 'line', stack: 't', areaStyle: { color: 'rgba(34,211,238,0.3)' }, data: [24, 32, 41, 50, 55], lineStyle: { color: '#22d3ee' } },
  ],
};
const compRadar = {
  radar: { indicator: [{ name: '市场化', max: 100 }, { name: '制度型开放', max: 100 }, { name: '产业链', max: 100 }, { name: '科技自立', max: 100 }, { name: '社会公平', max: 100 }, { name: '安全冗余', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [82, 75, 95, 78, 65, 88], name: '中国式现代化', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Reform · Realist Evolution" title="改革开放的现实主义逻辑" subtitle="系统重启 · 灰度测试 · 资源汲取 · 绩效契约 —— 一场彻底的「生存算法切换」" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>1978 年的改革开放是把系统最高优先级从「纯洁度」调整为「生产力」的务实权力交易：通过向社会释放局部经济自由（两权分离），换取系统在剧变时代的整体稳定与绝对领导权。指数级增长是「绩效合法性」最强硬的物理证据。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="1978" label="代码重写起点" accent="#c41e3a" />
        <Stat value="100 倍" label="名义 GDP 增幅" accent="#e8a317" />
        <Stat value="8 亿+" label="减贫规模" accent="#10b981" />
        <Stat value="4 亿+" label="中等收入群体" accent="#22d3ee" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="GDP 指数增长（万亿元 · 对数轴 · 示意）"><EChart option={gdpTrend} style={{ height: 240 }} /></Card>
        <Card title="三大产业贡献结构变迁（% · 示意）"><EChart option={industryTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="灰度测试 · 局部试验与系统冗余" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>超大规模社会直接改底层代码风险极高，体制建立「特区」这一物理隔离的沙盒环境，实施灰度测试。</p>
        <Grid cols={3}>
          {[['特区 · 系统隔离层', '深圳、珠海等是「主权项下的外部接口」，引入资本主义要素压力测试，成功后逐步推广。', '点状突破→面状覆盖'],
            ['地方竞争 · 分布式算力', '财政承包制（分灶吃饭）把发展动能分布式分配给地方，锦标赛激励驱动生产力爆发。', '锦标赛激励'],
            ['渐进主义 · 低损耗迭代', '拒绝休克疗法，「双轨制」软着陆，新旧系统共存缓慢切换，消解改革摩擦。', '稳定胜于速度']].map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}><div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p><span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="资源汲取 · 入世后的「引力陷阱」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>加入 WTO 是利用全球化红利的「主权规模扩张」——把庞大劳动力与全球资本、技术对撞，构建无法逃逸的「世界工厂」重力场，在全球分工中占据不可替代节点。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>贸易作为动员工具</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>经进出口流量把经济嵌合进世界体系，实现「你中有我」。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>逆向工程与技术沉淀</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>市场换技术，数十年完成西方两百年的工业化积累。</p></div>
          </div>
        </Card>
        <Card title="中国式现代化竞争力（示意）"><EChart option={compRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="隐形契约 · 增长与服从的置换" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>四十年核心政治契约：体制提供持续增长与生活改善，社会让渡政治决策参与度。增速进入换挡期（L 型拐点）后，体制正通过「新质生产力」更新契约，用「共同富裕」与「安全冗余」在低增速环境维持有效性。</p>
      </Card>

      <Card title="调研结论 · 算法的终极校准" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从「开放」转向「受控开放」', '从全方位对接世界转向以我为主的全球布局；在确保供应链主权前提下实施更高水平制度型开放。'],
            ['2 · 绩效合法性红利递减', '单纯 GDP 增长已不足以支撑长期共识，体制注入「公平」与「安全」两个新变量二次校准。'],
            ['3 · 永无止境的系统优化', '改革没有终点，是能吸收外部熵值、微观试错、宏观收拢的自我演化治理软件。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="调研组终评"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>改革开放是中国权力逻辑中最成功的「版本迭代」——以极致的实用主义，把一个濒临崩溃的系统转化为全球最具规模的复杂协同体。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局(NBS)、世界银行(WB)、WTO 等，部分为示意值 · 由 china.html「体制改革」专题迁移</p>
    </div>
  );
}
