import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj22Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ22"
      badge="SJ-22 · 史鉴"
      title="文化映射 · 古今对照"
      subtitle="象征通胀 · 文教投入 · 思想边界 · 意识形态再生产"
      htmlSrc="/shijian/SJ-22.html"
      frameTitle="SJ-22 文化映射"
      hintLinks={[{ href: '/shijian/SJ-22.html', label: '/shijian/SJ-22.html' }]}
    />
  );
}
