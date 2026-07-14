import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj21Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ21"
      badge="SJ-21 · 史鉴"
      title="经济映射 · 古今对照"
      subtitle="财政汲取 · 与民争利之辩 · 汲取转嫁基层"
      htmlSrc="/shijian/SJ-21.html"
      frameTitle="SJ-21 经济映射"
      hintLinks={[{ href: '/shijian/SJ-21.html', label: '/shijian/SJ-21.html' }]}
    />
  );
}
