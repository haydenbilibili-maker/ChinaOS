import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj25Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ25"
      badge="SJ-25 · 史鉴"
      title="秦统一六国"
      subtitle="制度升级 vs 战争机器 · 郡县奠基"
      htmlSrc="/shijian/SJ-25.html"
      frameTitle="SJ-25 秦统一六国"
      hintLinks={[{ href: '/shijian/SJ-25.html', label: '/shijian/SJ-25.html' }]}
    />
  );
}
