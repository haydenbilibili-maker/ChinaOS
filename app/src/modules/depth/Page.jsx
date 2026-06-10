import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';

const DIMS = [
  ['制度与改革', '体改 · 国资 · 治理现代化 · 权力结构 · 法治'],
  ['社会与民生', '人口 · 灵活就业 · 医保 · 基层综治 · 住房 · 教育'],
  ['产业与制造', '制造 · 机器人 · 材料 · 汽车 · 能源 · 算力 · 物流'],
  ['科技与创新', 'AI+ · 半导体 · 工业软件 · 量子 · 生物 · 脑机'],
  ['区域与全球化', '区域协调 · 城镇化 · 海权 · 极地 · 贸易 · 文化'],
  ['货币与主权', '系统性风险 · 人民币国际化 · FDI · 绿色金融 · 地方债'],
  ['安全与国防', '政权安全 · 军队改革 · 粮食安全 · 大安全观 · 台海'],
];

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Depth Lens"
        title="深度透视 · 7 维 90+ 专题"
        subtitle="项目最大的内容主体；迁移期专题逐个从 china.html 迁入独立模块"
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/food-security" className="text-sm mono" style={{ color: 'var(--china-red)' }}>
            ★ 已迁移样板：粮食安全（含中国地图）
          </Link>
          <a
            href="../china.html"
            target="_blank"
            rel="noreferrer"
            className="text-sm mono"
            style={{ color: 'var(--cyber-cyan)' }}
          >
            → 在传统视图（china.html）中浏览全部专题
          </a>
        </div>
      </PageHeader>
      <Grid cols={2}>
        {DIMS.map(([t, d]) => (
          <Card key={t} title={t}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
