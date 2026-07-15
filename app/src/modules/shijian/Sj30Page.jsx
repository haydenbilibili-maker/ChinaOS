import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj30Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ30"
      badge="SJ-30 · 史鉴"
      title="黄巾起义"
      subtitle="基座承载越阈 · 太平道动员"
      htmlSrc="/shijian/SJ-30.html"
      frameTitle="SJ-30 黄巾起义"
      hintLinks={[{ href: '/shijian/SJ-30.html', label: '/shijian/SJ-30.html' }]}
    />
  );
}
