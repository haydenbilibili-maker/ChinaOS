import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj42Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ42"
      badge="SJ-42 · 史鉴"
      title="南宋偏安"
      subtitle="区域再配置 · 淮上守江"
      htmlSrc="/shijian/SJ-42.html"
      frameTitle="SJ-42 南宋偏安"
      hintLinks={[{ href: '/shijian/SJ-42.html', label: '/shijian/SJ-42.html' }]}
    />
  );
}
