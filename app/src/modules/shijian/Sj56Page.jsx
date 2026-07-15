import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj56Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ56"
      badge="SJ-56 · 史鉴"
      title="长平之战"
      subtitle="军事消耗 · 基座承载越阈 · 赵国衰变"
      htmlSrc="/shijian/SJ-56.html"
      frameTitle="SJ-56 长平之战"
      hintLinks={[{ href: '/shijian/SJ-56.html', label: '/shijian/SJ-56.html' }]}
    />
  );
}
