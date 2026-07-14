import React from 'react';
import { Link } from 'react-router-dom';
import { LockOpen, ClipboardCheck, UserCircle, Scale, Users } from 'lucide-react';
import { PageHeader } from '../../app/ui.jsx';
import { modulesByGroup } from '../../app/registry.js';
import { HUANGFEIZHAI_GROUP_ID } from '../../domain/huangfeizhai.ts';
import { useHuangfeizhaiAuth } from '../../lib/huangfeizhai/useHuangfeizhaiAuth.js';
import './huangfeizhai.css';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';

const ENTRIES = [
  {
    id: 'anticorruption',
    icon: Scale,
    accent: 'var(--red)',
    tag: '结构 · v2',
  },
  {
    id: 'ableOfficialParadox',
    icon: Users,
    accent: 'var(--amber)',
    tag: '机制',
  },
  {
    id: 'personalReview',
    icon: ClipboardCheck,
    accent: 'var(--brass)',
    tag: '决策',
  },
  {
    id: 'haydenSlice',
    icon: UserCircle,
    accent: 'var(--celadon)',
    tag: '自画像',
  },
];

export default function HuangfeizhaiHubPage() {
  const { lock } = useHuangfeizhaiAuth();
  const mods = modulesByGroup(HUANGFEIZHAI_GROUP_ID).filter((m) => m.id !== 'huangfeizhaiHub');
  const modMap = Object.fromEntries(mods.map((m) => [m.id, m]));

  return (
    <div className="ink-observatory hf-hub-wrap">
      <PageHeader
        badge="ChinaOS · 私人分区"
        title="荒废斋"
        subtitle="私人信息总入口 · 朱砂封印 · 黄铜门环"
        noAccent
      >
        <button type="button" className="hf-lock-btn" onClick={lock} title="重新上锁">
          <LockOpen size={15} />
          重新上锁
        </button>
      </PageHeader>

      <section className="hf-hub-lead">
        <p>
          观象台叙事链终段「我」的落地之所：宏观判读之后，回到<strong>个人仓位、决策复盘与自画像</strong>。
          数据仅存本地浏览器，不入公开图谱。
        </p>
      </section>

      <div className="hf-hub-grid">
        {ENTRIES.map(({ id, icon: Icon, accent, tag }) => {
          const m = modMap[id];
          if (!m) return null;
          return (
            <Link key={m.id} to={m.path} className="hf-hub-card os-card">
              <span className="hf-hub-card-tag" style={{ color: accent }}>{tag}</span>
              <div className="hf-hub-card-icon" style={{ color: accent }}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h2>{m.title}</h2>
              <p>{m.subtitle}</p>
              <span className="hf-hub-card-go">进入 →</span>
            </Link>
          );
        })}
      </div>

      <footer className="hf-hub-foot">
        <p>
          自 <Link to="/modules/observatory">观象台</Link>「我」段可直达决策复盘；
          本斋聚合全部私人模块。
        </p>
      </footer>
      <ModuleFooter moduleId="huangfeizhai" />
    </div>
  );
}
