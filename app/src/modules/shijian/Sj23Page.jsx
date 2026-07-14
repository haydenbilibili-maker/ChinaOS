import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj23Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ23"
      badge="SJ-23 · 史鉴"
      title="社会映射 · 古今对照"
      subtitle="承载上限 · 流民变体 · 人口结构容错 · 慢变量约束"
      htmlSrc="/shijian/SJ-23.html"
      frameTitle="SJ-23 社会映射"
      hintLinks={[{ href: '/shijian/SJ-23.html', label: '/shijian/SJ-23.html' }]}
    />
  );
}
