import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj24Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ24"
      badge="SJ-24 · 史鉴"
      title="外交映射 · 古今对照"
      subtitle="边疆周期 · 朝贡秩序 · 军费财政 · 秩序话语竞争"
      htmlSrc="/shijian/SJ-24.html"
      frameTitle="SJ-24 外交映射"
      hintLinks={[{ href: '/shijian/SJ-24.html', label: '/shijian/SJ-24.html' }]}
    />
  );
}
