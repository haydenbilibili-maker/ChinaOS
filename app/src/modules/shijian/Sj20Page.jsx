import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj20Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ20"
      badge="SJ-20 · 史鉴"
      title="政治映射 · 古今对照"
      subtitle="精英循环 · 合法性叙事 · 央地钟摆 · 规律同构参数迥异"
      htmlSrc="/shijian/SJ-20.html"
      frameTitle="SJ-20 政治映射"
      hintLinks={[{ href: '/shijian/SJ-20.html', label: '/shijian/SJ-20.html' }]}
    />
  );
}
