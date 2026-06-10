import React from 'react';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';

const VOLUMES = [
  '卷二 · 法家与外儒内法', '卷三 · 道家与战略弹性', '卷四 · 儒家与社会底层逻辑',
  '卷五 · 汉字与科举', '卷六 · 佛学中国化与深层心理', '卷七 · 易经与五行宇宙观',
  '卷八 · 人情面子与江湖', '卷十一 · 地理宿命与天下观', '卷十二 · 盐铁专卖与双轨经济',
];

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Civilization Lens"
        title="文明透视 · 12 卷源代码"
        subtitle="从历史深层结构解读今日制度与心理的底层代码"
      >
        <a href="../civilization-confucianism-source-code.html" target="_blank" rel="noreferrer" className="text-sm mono" style={{ color: 'var(--cyber-cyan)' }}>
          → 在传统视图中浏览文明专题
        </a>
      </PageHeader>
      <Grid cols={3}>
        {VOLUMES.map((v) => (
          <Card key={v}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v}</p>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
