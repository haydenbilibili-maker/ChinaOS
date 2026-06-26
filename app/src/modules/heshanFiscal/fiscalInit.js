/** 重构河山 · 交互初始化（自 0627.zip 迁移） */
export function initHeshanFiscal(root) {
  if (!root) return () => {};
  const cleanups = [];
  try {
        // 数据：[名称, 人口万, GDP亿, 成本档(0东1中2西), give可显示]
    const P=[
     ["京畿省",2245,11900,0],["冀南省",3190,16400,0],["冀东省",1810,15400,0],
     ["蒙东省",1040,5900,2],["蒙中省",1130,15300,2],["蒙西省",231,2200,2],
     ["胶东省",2330,31800,0],["鲁中省",2560,27300,0],["中原省",4633,36600,1],["豫西南省",2470,12900,1],["淮海省",4910,35100,1],
     ["苏南省",2580,50700,0],["江淮省",2950,49700,0],["浙北省",3760,57000,0],["浙南省",2830,25000,0],["皖南省",1230,12900,0],["皖中省",2655,23100,1],
     ["湖北(重组)",3860,37100,1],["鄂西省",1848,17440,1],
     ["闽东省",2010,25400,0],["闽南省",2200,29000,0],
     ["深圳",1780,35000,0],["珠三角省",6085,75000,0],["潮汕省",1635,8000,0],["粤西省",1820,10600,0],["粤北省",1355,6500,1],
     ["成都平原省",3500,31900,2],["川南省",1450,10100,2],["攀西省",940,5380,2],
     ["关中省",2735,20400,2],["陕北省",590,9200,2],["陕南省",770,4200,2],["陇右省",2000,8550,2],["河西省",445,3520,2],
    ];
    const COSTK=[1.0,1.1,1.3];
    const $=(id)=>root.querySelector(`#${id}`);
    function calc(){
      const exp=+$('exp').value, rev=+$('rev').value/100, eq=+$('eq').value/100, useCost=+$('cost').value;
      $('v_exp').textContent=exp.toFixed(2)+' 万元/人';
      $('v_rev').textContent=(rev*100).toFixed(1)+'%';
      $('v_eq').textContent=Math.round(eq*100)+'%';
      $('v_cost').textContent=useCost? '开启':'关闭';
      let rows=P.map(p=>{
        const k=useCost?COSTK[p[3]]:1.0;
        const stdExp=p[1]*exp*k;          // 万 × 万元 = 亿元
        const stdRev=p[2]*rev;            // 亿
        const gap=stdExp-stdRev;          // +缺口 / -盈余
        const transfer=gap>0? gap*eq : 0;
        const net=gap>0? transfer : gap;  // 受益正、贡献负(=盈余的相反? )
        // 净贡献 = 盈余 (stdRev-stdExp) for surplus provinces
        const give=gap<0? (-gap) : 0;
        return {n:p[0],transfer,give,net:transfer>0?transfer:-give};
      });
      const totalTransfer=rows.reduce((a,r)=>a+r.transfer,0);
      const totalGive=rows.reduce((a,r)=>a+r.give,0);
      const recvCnt=rows.filter(r=>r.transfer>0).length;
      const giveCnt=rows.filter(r=>r.give>0).length;
      // summary
      $('sumcards').innerHTML=`
        <div class="sumcard"><div class="v">${(totalTransfer/10000).toFixed(2)}<small>万亿</small></div><div class="k">转移支付总盘子</div></div>
        <div class="sumcard"><div class="v">${recvCnt}<small>个</small></div><div class="k">净受益单元</div></div>
        <div class="sumcard"><div class="v">${giveCnt}<small>个</small></div><div class="k">净贡献单元</div></div>
        <div class="sumcard"><div class="v">${(totalGive/10000).toFixed(2)}<small>万亿</small></div><div class="k">盈余可上缴财力</div></div>`;
      // bars
      const showgive=$('showgive').checked;
      let list=rows.slice().sort((a,b)=>b.net-a.net);
      if(!showgive) list=list.filter(r=>r.transfer>0);
      const maxV=Math.max(...list.map(r=>Math.max(r.transfer,r.give)),1);
      $('bars').innerHTML=list.map(r=>{
        if(r.transfer>0){
          return `<div class="bar-row"><div class="nm">${r.n}</div><div class="bar-track"><div class="bar-fill recv" style="width:${r.transfer/maxV*100}%"></div></div><div class="val recv">+${Math.round(r.transfer)}亿</div></div>`;
        }else{
          return `<div class="bar-row"><div class="nm">${r.n}</div><div class="bar-track"><div class="bar-fill give" style="width:${r.give/maxV*100}%"></div></div><div class="val give">−${Math.round(r.give)}亿</div></div>`;
        }
      }).join('');
    }
    ['exp','rev','eq','cost','showgive'].forEach(id=>$(id).addEventListener('input',calc));
    
    // mini 1: de-layering savings
    function calcSave(){
      const num=+$('d_num').value, cost=+$('d_cost').value, cut=+$('d_cut').value/100;
      $('rv_num').textContent=num;$('rv_cost').textContent=cost;$('rv_cut').textContent=Math.round(cut*100);
      const save=Math.round(num*cost*cut);
      $('out_save').innerHTML=save.toLocaleString()+'<small>亿/年</small>';
    }
    ['d_num','d_cost','d_cut'].forEach(id=>$(id).addEventListener('input',calcSave));
    // mini 2: debt
    function calcDebt(){
      const debt=+$('b_debt').value, rate=+$('b_rate').value/100, spread=+$('b_spread').value, year=+$('b_year').value;
      $('rv_debt').textContent=debt;$('rv_rate').textContent=Math.round(rate*100);$('rv_spread').textContent=spread.toFixed(1);$('rv_year').textContent=year;
      const swap=debt*rate;                    // 万亿
      const intSave=Math.round(swap*10000*spread/100); // 亿/年
      $('out_int').innerHTML=intSave.toLocaleString()+'<small>亿/年</small>';
      $('out_swap').textContent=(swap/year).toFixed(2);
    }
    ['b_debt','b_rate','b_spread','b_year'].forEach(id=>$(id).addEventListener('input',calcDebt));
    
    calc();calcSave();calcDebt();
  } catch (err) {
    console.warn('[initHeshanFiscal]', err);
  }
  return () => {
    cleanups.forEach((fn) => { try { fn(); } catch (_) {} });
  };
}
