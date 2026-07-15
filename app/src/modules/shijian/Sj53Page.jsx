import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj53Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ53"
      badge="SJ-53 · 史鉴"
      title="北伐战争"
      subtitle="军事力定正统 · 国共合作 · 形式统一"
      htmlSrc="/shijian/SJ-53.html"
      frameTitle="SJ-53 北伐战争"
      hintLinks={[{ href: '/shijian/SJ-53.html', label: '/shijian/SJ-53.html' }]}
    />
  );
}
