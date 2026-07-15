import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj48Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ48"
      badge="SJ-48 · 史鉴"
      title="郑和下西洋"
      subtitle="合法性象征投入 · 朝贡秩序"
      htmlSrc="/shijian/SJ-48.html"
      frameTitle="SJ-48 郑和下西洋"
      hintLinks={[{ href: '/shijian/SJ-48.html', label: '/shijian/SJ-48.html' }]}
    />
  );
}
