import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj45Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ45"
      badge="SJ-45 · 史鉴"
      title="行省制度"
      subtitle="央地分权创新 · 行中书省 · 省制奠基"
      htmlSrc="/shijian/SJ-45.html"
      frameTitle="SJ-45 行省制度"
      hintLinks={[{ href: '/shijian/SJ-45.html', label: '/shijian/SJ-45.html' }]}
    />
  );
}
