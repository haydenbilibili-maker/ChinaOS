import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj05Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ05"
      badge="SJ-05 · 史鉴"
      title="王安石变法"
      subtitle="财政重建 vs 精英抵制 · 史鉴台账验证案"
      htmlSrc="/shijian/SJ-05.html"
      frameTitle="SJ-05 王安石变法"
      hintLinks={[{ href: '/shijian/SJ-05.html', label: '/shijian/SJ-05.html' }]}
    />
  );
}
