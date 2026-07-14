import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj02Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ02"
      badge="SJ-02 · 史鉴"
      title="史鉴引擎 · 四步法"
      subtitle="结构切片 → 周期定位 → 机制归因 → 古今映射"
      htmlSrc="/shijian/SJ-02.html"
      frameTitle="SJ-02 史鉴引擎四步法"
      hintLinks={[{ href: '/shijian/SJ-02.html', label: '/shijian/SJ-02.html' }]}
    />
  );
}
