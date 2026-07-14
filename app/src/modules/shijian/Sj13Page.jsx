import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj13Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ13"
      badge="SJ-13 · 史鉴"
      title="王莽改制"
      subtitle="复古理想 vs 现实结构 · 僵化期试错"
      htmlSrc="/shijian/SJ-13.html"
      frameTitle="SJ-13 王莽改制"
      hintLinks={[{ href: '/shijian/SJ-13.html', label: '/shijian/SJ-13.html' }]}
    />
  );
}
