import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj15Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ15"
      badge="SJ-15 · 史鉴"
      title="辛亥革命"
      subtitle="帝制终结 · 合法性破产 · 重建未竟"
      htmlSrc="/shijian/SJ-15.html"
      frameTitle="SJ-15 辛亥革命"
      hintLinks={[{ href: '/shijian/SJ-15.html', label: '/shijian/SJ-15.html' }]}
    />
  );
}
