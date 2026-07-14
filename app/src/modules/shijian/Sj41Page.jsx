import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj41Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ41"
      badge="SJ-41 · 史鉴"
      title="靖康之耻"
      subtitle="军事力不足 · 外交误判 · 积弱总清算"
      htmlSrc="/shijian/SJ-41.html"
      frameTitle="SJ-41 靖康之耻"
      hintLinks={[{ href: '/shijian/SJ-41.html', label: '/shijian/SJ-41.html' }]}
    />
  );
}
