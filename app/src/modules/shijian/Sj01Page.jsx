import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj01Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ01"
      badge="SJ-01 · 史鉴"
      title="史家方法对比矩阵"
      subtitle="八家光谱 · 四栏矩阵 · 镜头指南"
      htmlSrc="/shijian/SJ-01.html"
      frameTitle="SJ-01 史家方法对比矩阵"
      hintLinks={[{ href: '/shijian/SJ-01.html', label: '/shijian/SJ-01.html' }]}
    />
  );
}
