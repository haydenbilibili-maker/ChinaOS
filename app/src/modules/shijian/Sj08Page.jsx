import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj08Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ08"
      badge="SJ-08 · 史鉴"
      title="五代十国 · 分裂与重整"
      subtitle="军事力畸大 · 合法性归零 · 过度矫正=下一病灶"
      htmlSrc="/shijian/SJ-08.html"
      frameTitle="SJ-08 五代十国分裂重整"
      hintLinks={[{ href: '/shijian/SJ-08.html', label: '/shijian/SJ-08.html' }]}
    />
  );
}
