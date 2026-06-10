import React, { useEffect, useRef, useState } from 'react';
import {
  Zap,
  Sun,
  Flame,
  ShieldCheck,
  Activity,
  Database,
  Orbit,
  Cpu,
  BatteryCharging,
} from 'lucide-react';

const App = () => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('nuclear');
  const sectionRefs = {
    nuclear: useRef(null),
    renewables: useRef(null),
    fusion: useRef(null),
    storage: useRef(null),
  };

  // 切换 tab 时滚动到对应区块
  useEffect(() => {
    const el = sectionRefs[activeTab]?.current;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab]);

  // 模拟系统背景流：能量对流与高温等离子体脉络
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      color: Math.random() > 0.5 ? '#fbbf24' : '#10b981',
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 0.6;
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.2 * i));
        ctx.lineTo(canvas.width, canvas.height * (0.1 * i + 0.3));
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
      />

      {/* 侧边导航 - 遵循 OS v2.0 规范 */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur-xl border-r border-emerald-900/30 z-50 hidden xl:flex flex-col">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-yellow-500 rounded-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              China OS v2.0
            </span>
            <h2 className="text-lg font-black text-white tracking-tighter">
              能源主权模块
            </h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            能量博弈
          </div>
          {[
            {
              id: 'nuclear',
              name: '四代核电"基荷主权"',
              icon: <ShieldCheck className="w-4 h-4" />,
            },
            {
              id: 'renewables',
              name: '风光电网"算法吸纳"',
              icon: <Sun className="w-4 h-4" />,
            },
            {
              id: 'fusion',
              name: '可控核聚变"人造太阳"',
              icon: <Flame className="w-4 h-4" />,
            },
            {
              id: 'storage',
              name: '长时储能"时空对冲"',
              icon: <BatteryCharging className="w-4 h-4" />,
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 text-xs rounded transition-all group cursor-pointer ${
                activeTab === item.id
                  ? 'bg-emerald-900/40 text-white border-l-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span
                className={
                  activeTab === item.id
                    ? 'text-emerald-400'
                    : 'text-slate-500 group-hover:text-emerald-400'
                }
              >
                {item.icon}
              </span>
              {item.name}
            </div>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-[10px] text-emerald-400 font-mono">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            ENERGY_AUTO_RATE: 85%
          </div>
          <p className="text-[9px] text-slate-500 uppercase tracking-tighter italic">
            Status: Kinetic Independence
          </p>
        </div>
      </aside>

      {/* 主体内容 */}
      <main className="xl:ml-64 p-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-4xl">
            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.4em] mb-3">
              Nuclear Power & New Energy Global Strategy
            </h4>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-6">
              能源变革：
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-500">
                从化石依附向物理主权的代际跨越
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed border-l-2 border-emerald-600 pl-6">
              “能源是文明的动能底座。在现实主义视角下，中国通过构建‘核电压舱石’与‘风光溢价区’，正在物理层面拆解外部能源封锁。当可控核聚变跨越商用奇点，人类将获得定义物质世界秩序的‘无限算力’。”
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">
                Clean_Energy_Installed
              </div>
              <div className="text-3xl font-black text-white">
                50.4<span className="text-sm text-emerald-500 ml-1">%</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">
                Fusion_Pulse_Time
              </div>
              <div className="text-3xl font-black text-yellow-400">1,056s</div>
            </div>
          </div>
        </header>

        {/* 高密度指标矩阵 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: '核电在建规模',
              val: '24 台',
              sub: '全球第一大在建集群',
              icon: <Database className="w-4 h-4" />,
            },
            {
              label: '绿电弃电率控制',
              val: '< 5%',
              sub: '基于特高压与 AI 调度',
              icon: <Activity className="w-4 h-4" />,
            },
            {
              label: '光伏产业链权重',
              val: '80% +',
              sub: '非对称相互依赖的核心筹码',
              icon: <Sun className="w-4 h-4" />,
            },
            {
              label: '高温气冷堆国产化',
              val: '93.4%',
              sub: '四代核电技术的物理闭环',
              icon: <ShieldCheck className="w-4 h-4" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-lg group hover:border-emerald-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  {item.icon}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  PWR_NODE_{i + 1}
                </div>
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                {item.label}
              </div>
              <div className="text-2xl font-black text-white mb-1 tracking-tight">
                {item.val}
              </div>
              <div className="text-[10px] text-slate-600 italic">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* 深度解析区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 01. 第四代核电：基荷主权逻辑 */}
          <div
            ref={sectionRefs.nuclear}
            className="lg:col-span-8 p-10 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-xl relative overflow-hidden scroll-mt-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-1 h-8 bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              战略核心：核电作为“物理压舱石”
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p>
                  在现实主义逻辑下，核电是解决“能源不可能三角”（安全、廉价、低碳）的唯一物理答案。中国正通过批量化建设**“华龙一号”**并率先实现**“高温气冷堆（HTR-PM）”**商运，确立了全球核电代际领先地位。
                </p>
                <div className="p-6 bg-black/40 border border-slate-800 rounded-lg space-y-4 font-mono text-[11px]">
                  <div className="flex justify-between text-emerald-400">
                    <span className="text-slate-400">TECH_ERA:</span>{' '}
                    <span>GEN_IV_ACTIVE</span>
                  </div>
                  <div className="flex justify-between text-yellow-400">
                    <span className="text-slate-400">SAFETY:</span>{' '}
                    <span>INHERENT_PASSIVE_COOLING</span>
                  </div>
                  <div className="flex justify-between text-blue-400">
                    <span className="text-slate-400">GOAL:</span>{' '}
                    <span>BASELOAD_STABILITY_100%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[88%] animate-pulse" />
                  </div>
                </div>
                <p>
                  这不仅是发电，更是**“工业热源主权”**。高温气冷堆提供的
                  950℃ 高温蒸汽，是实现大规模、极低成本“绿氢”生产与钢铁脱碳的终极算法。
                </p>
              </div>
              <div className="bg-black/20 p-6 rounded-lg border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="w-full h-48 border-b border-l border-slate-700 relative flex items-end p-4 gap-2">
                  {[30, 50, 65, 80, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-600/60 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                  <div className="absolute top-4 right-4 text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-1 uppercase font-bold tracking-tighter">
                    Nuclear Self-Sufficiency
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 text-emerald-500">
                    中国核电核心设备国产化率演进 (2010-2024)
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* 02. 新能源与智能电网调度 */}
          <div
            ref={sectionRefs.renewables}
            className="lg:col-span-4 p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-xl flex flex-col justify-between scroll-mt-8"
          >
            <h3 className="text-xl font-black text-white mb-8 text-emerald-400">
              电网革命：算力对冲波动
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: '特高压（UHV）',
                  desc: '能量的“南水北调”，实现跨省域绿电无损流转。',
                  color: 'bg-emerald-500',
                },
                {
                  title: 'AI 调度算法',
                  desc: '预测风光随机性，时延降至秒级，对冲系统熵增。',
                  color: 'bg-blue-500',
                },
                {
                  title: '虚拟电厂（VPP）',
                  desc: '通过数字化接口聚合社会化负荷，实现秒级响应。',
                  color: 'bg-yellow-500',
                },
                {
                  title: '源网荷储一体化',
                  desc: '构建局域物理闭环，确保制造业核心节点“永不断电”。',
                  color: 'bg-teal-500',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div
                    className={`w-1 h-10 ${item.color} rounded-full mt-1 shrink-0 group-hover:scale-y-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-5 bg-emerald-500/5 rounded border border-emerald-500/20 text-center relative overflow-hidden">
              <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-2 text-center">
                Grid_Complexity_Index
              </div>
              <Activity className="w-10 h-10 text-emerald-500 mx-auto opacity-50 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* 03. 可控核聚变：人造太阳的终局博弈 */}
          <div
            ref={sectionRefs.fusion}
            className="lg:col-span-12 p-10 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-xl relative overflow-hidden scroll-mt-8"
          >
            <div className="flex flex-col xl:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-500/20">
                  The Ultimate Power
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                  可控核聚变：
                  <br />
                  <span className="text-yellow-500 italic">“无限动能”</span>
                  的战略耐心
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  中国正通过合肥
                  **EAST（全超导托卡马克装置）** 与成都 **HL-3（新一代人造太阳）**
                  双线推进核聚变研究。现实主义视角下，聚变不仅是科学，更是**“文明等级的入场券”**。谁率先实现
                  Q &gt; 1 的商业化稳态运行，谁就掌握了未来一千年的工业成本定价权。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 group hover:border-yellow-500/50 transition-all">
                    <Orbit className="text-yellow-400 w-8 h-8" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        强磁场约束
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        超导磁体技术实现 100% 自研，确保等离子体稳定悬浮。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 group hover:border-yellow-500/50 transition-all">
                    <Cpu className="text-yellow-400 w-8 h-8" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        聚变计算模拟
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        利用国产超算预测等离子体湍流，缩短商业化实验周期。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-[450px] p-8 bg-black/40 rounded-3xl border border-yellow-900/30 flex flex-col justify-center gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none" />
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                    Fusion Readiness Index
                  </div>
                  <div className="text-6xl font-black text-white">
                    75<span className="text-lg text-yellow-500 ml-1">#Alpha</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-2">
                    Comprehensive Plasma Control Score
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase font-mono">
                    <span>Magnetic Stability:</span>{' '}
                    <span className="text-white font-bold">OPTIMIZED</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full">
                    <div className="h-full bg-yellow-500 w-[92%]" />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-mono">
                    <span>Steady-state runtime:</span>{' '}
                    <span className="text-white font-bold">1,000s+</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full">
                    <div className="h-full bg-yellow-500 w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 04. 长时储能：时空对冲 */}
          <div
            ref={sectionRefs.storage}
            className="lg:col-span-12 p-10 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-xl relative overflow-hidden scroll-mt-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
              <span className="w-1 h-8 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
              长时储能：“时空对冲”与电网弹性
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p>
                  风光等间歇性电源的规模化并网，使**“时间维度上的能量平移”**成为刚需。长时储能（抽水蓄能、压缩空气、液流电池、氢储能）构成能源主权在**“时空对冲”**维度的物理闭环：将过剩绿电在空间与时间上重新配置，确保基荷与调峰的可调度性。
                </p>
                <div className="p-6 bg-black/40 border border-slate-800 rounded-lg space-y-4 font-mono text-[11px]">
                  <div className="flex justify-between text-teal-400">
                    <span className="text-slate-400">STORAGE_STRATEGY:</span>{' '}
                    <span>TIME_SHIFT + SPATIAL_REDIST</span>
                  </div>
                  <div className="flex justify-between text-yellow-400">
                    <span className="text-slate-400">PUMPED_HYDRO:</span>{' '}
                    <span>LARGEST_GLOBAL_CAPACITY</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-teal-600 w-[72%] animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm p-8 bg-black/40 rounded-2xl border border-teal-500/20 flex flex-col items-center gap-4">
                  <BatteryCharging className="w-16 h-16 text-teal-400" />
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Long-Duration Storage Index
                  </div>
                  <div className="text-4xl font-black text-white">
                    68<span className="text-sm text-teal-400 ml-1">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    规划装机与电网需求匹配度
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 05. 最终战略总结 */}
          <div className="lg:col-span-12 p-16 bg-gradient-to-br from-emerald-900/10 to-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-600/10 rounded-full blur-[100px]" />
            <div className="w-24 h-24 bg-white/5 border border-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <Zap className="text-emerald-400 w-12 h-12 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-white mb-6 tracking-tight italic text-center uppercase">
              战略结论：构建动能系统的防御闭环
            </h2>
            <p className="max-w-4xl text-slate-300 text-lg leading-relaxed mb-12 text-center">
              能源主权是 China OS v2.0
              运行的**“物理先决条件”**。通过在核电领域实现代际跨越、在电网层面实施算法控制、在聚变赛道实施战略长投，中国正试图从根本上消解对外部碳氢化合物（油气）的脆弱性依附。这是一个**“从分子到电子再到离子”**的权力迁徙过程。在现实主义的能源棋局中，**“掌控了能量转换效率，就掌握了工业文明的最终定价权”**。
            </p>
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mb-12" />
            <div className="flex flex-wrap justify-center gap-12 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />{' '}
                ENERGY_SELF_SUFFICIENCY: MAX
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />{' '}
                FUSION_BREAKTHROUGH: TRACKING
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />{' '}
                STATUS: STRATEGIC_READY
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-16 border-t border-slate-900 text-center pb-20">
          <div className="text-[11px] text-slate-700 tracking-[0.5em] uppercase mb-4 font-black">
            Realpolitik Intelligence Agency (RIA)
          </div>
          <div className="text-xs text-slate-600 italic">
            “电力的流动不仅是能量，更是主权意志的物理延伸”
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
