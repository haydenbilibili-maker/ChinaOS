import ShijianHtmlShell from './ShijianHtmlShell.jsx';

const HINT_LINKS = [
  { href: '/shijian/SJ-00.html', label: '/shijian/SJ-00.html' },
  { href: '/shijian/SJ-01.html', label: '/shijian/SJ-01.html' },
  { href: '/shijian/SJ-03.html', label: '/shijian/SJ-03.html' },
  { href: '/shijian/SJ-04.html', label: '/shijian/SJ-04.html' },
];

/**
 * 史鉴 SJ-00 · 总索引
 * 卷轴风格报告以 public/shijian/SJ-00.html 为真源；本壳提供侧栏路由与 GY 交叉链接。
 * UI 契约（PageHeader / os-card / ModuleFooter）由 ShijianHtmlShell 承载。
 */
export default function ShijianPage() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ00"
      badge="SJ-00 · 史鉴"
      title="史鉴总索引"
      subtitle="治乱螺旋 · 四步引擎 · 与 GY 交叉引用"
      htmlSrc="/shijian/SJ-00.html"
      frameTitle="SJ-00 史鉴总索引"
      hintLinks={HINT_LINKS}
    />
  );
}
