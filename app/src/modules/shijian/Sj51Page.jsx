import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj51Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ51"
      badge="SJ-51 · 史鉴"
      title="戊戌变法"
      subtitle="体制突破失败 · 百日维新 · 守旧反扑"
      htmlSrc="/shijian/SJ-51.html"
      frameTitle="SJ-51 戊戌变法"
      hintLinks={[{ href: '/shijian/SJ-51.html', label: '/shijian/SJ-51.html' }]}
    />
  );
}
