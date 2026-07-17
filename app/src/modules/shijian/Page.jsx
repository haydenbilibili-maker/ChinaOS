import ShijianHtmlShell from './ShijianHtmlShell.jsx';

const HINT_LINKS = [
  { href: '/shijian/SJ-00.html', label: 'SJ-00 中华五柱枢纽' },
  { href: '/modules/shijian-world', label: '史鉴·世界 · SJW-00' },
  { href: '/modules/shijian/sj-01', label: '方法论 · SJ-01/02' },
  { href: '/modules/shijian/sj-03', label: '周期机制 · SJ-03/04' },
  { href: '/modules/shijian/sj-05', label: '案例库 · SJ-05起' },
  { href: '/modules/shijian/sj-20', label: '古今对照 · SJ-20起' },
  { href: '/shijian/SJ-00.html#sec-mapping-index', label: '对照索引表' },
];

/**
 * 史鉴·中华 SJ-00 · 总索引
 * 五柱枢纽以 public/shijian/SJ-00.html 为真源。
 */
export default function ShijianPage() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ00"
      badge="SJ-00 · 史鉴·中华"
      title="史鉴·中华总索引"
      subtitle="五柱枢纽 · 治乱螺旋 · 并列世界线一级入口"
      htmlSrc="/shijian/SJ-00.html"
      frameTitle="SJ-00 史鉴·中华总索引"
      hintLinks={HINT_LINKS}
    />
  );
}
