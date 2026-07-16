# Shared CSS/JS fragments for SJW interactive signature slices
SIG_CSS = r'''
/* === SJW signature premium interactivity === */
.sjw-sig-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,280px);gap:12px;align-items:start;margin-top:8px}
.sjw-sig-stage{
  border:1px solid var(--sjw-line);border-radius:var(--sjw-radius);
  background:linear-gradient(180deg,var(--sjw-ink-800),var(--sjw-ink-900));
  box-shadow:0 1px 0 rgba(216,221,230,.04),0 18px 48px rgba(0,0,0,.45);
  padding:8px;overflow:auto;
}
.sjw-sig-stage svg{display:block;width:100%;height:auto;max-width:820px;margin:0 auto}
.sjw-sig-node{cursor:pointer;transition:opacity .2s ease,filter .2s ease}
.sjw-sig-node:focus-visible{outline:2px solid var(--sjw-ochre);outline-offset:3px}
.sjw-sig-edge{transition:opacity .2s ease,filter .2s ease}
.sjw-sig-stage.is-picking .sjw-sig-node{opacity:.28}
.sjw-sig-stage.is-picking .sjw-sig-node.is-hot{opacity:1;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--sjw-ochre) 50%,transparent))}
.sjw-sig-stage.is-picking .sjw-sig-edge{opacity:.14}
.sjw-sig-stage.is-picking .sjw-sig-edge.is-hot{opacity:1;filter:drop-shadow(0 0 3px color-mix(in srgb,var(--sjw-vermil) 45%,transparent))}
.sjw-sig-aside{
  border:1px solid var(--sjw-line);border-radius:var(--sjw-radius);
  background:linear-gradient(180deg,var(--sjw-ink-800),var(--sjw-ink-900));
  padding:14px 16px;position:sticky;top:12px;min-height:160px;
}
.sjw-sig-aside .k{font-family:var(--sjw-mono);font-size:10px;letter-spacing:.14em;color:var(--sjw-ochre);margin-bottom:6px}
.sjw-sig-aside h3{font-size:15px;letter-spacing:.06em;margin-bottom:8px;color:var(--sjw-paper-100)}
.sjw-sig-aside p{font-size:13px;color:var(--sjw-paper-300);line-height:1.65}
.sjw-sig-aside-empty{font-size:13px;color:var(--sjw-paper-300);opacity:.85}
.sjw-sig-legend{display:flex;flex-wrap:wrap;gap:10px 16px;margin-top:10px;font-family:var(--sjw-mono);font-size:10px;color:var(--sjw-paper-300)}
.sjw-sig-legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:middle}
.sjw-sig-guide{font-size:13.5px;color:var(--sjw-paper-300);margin-top:10px;max-width:76ch;line-height:1.7}
.sjw-sig-guide b{color:var(--sjw-paper-100);font-weight:600}
@media (max-width:900px){.sjw-sig-layout{grid-template-columns:1fr}.sjw-sig-aside{position:static}}
@media (prefers-reduced-motion:reduce){
  .sjw-sig-node,.sjw-sig-edge{transition:none!important}
  .sjw-sig-stage.is-picking .sjw-sig-node.is-hot,.sjw-sig-stage.is-picking .sjw-sig-edge.is-hot{filter:none}
}
/* === /SJW signature premium === */
'''

def make_script(node_data: dict, node_edges: dict) -> str:
    import json
    nd = json.dumps(node_data, ensure_ascii=False)
    ne = json.dumps(node_edges, ensure_ascii=False)
    return f'''<script>
(function(){{
  var stage=document.getElementById('sjw-sig-stage');
  if(!stage)return;
  var nodes=Array.from(stage.querySelectorAll('.sjw-sig-node'));
  var edges=Array.from(stage.querySelectorAll('.sjw-sig-edge'));
  var empty=document.getElementById('sjw-sig-empty');
  var body=document.getElementById('sjw-sig-body');
  var NODE_DATA={nd};
  var NODE_EDGE={ne};
  function clear(){{
    stage.classList.remove('is-picking');
    nodes.forEach(function(n){{n.classList.remove('is-hot')}});
    edges.forEach(function(e){{e.classList.remove('is-hot')}});
  }}
  function show(id){{
    var d=NODE_DATA[id]; if(!d)return;
    if(empty)empty.hidden=true;
    if(body)body.hidden=false;
    var t=document.getElementById('sjw-sig-tag');
    var n=document.getElementById('sjw-sig-name');
    var x=document.getElementById('sjw-sig-text');
    if(t)t.textContent=d.tag||'';
    if(n)n.textContent=d.name||'';
    if(x)x.textContent=d.body||'';
  }}
  function pick(id){{
    if(!NODE_DATA[id])return;
    clear();
    stage.classList.add('is-picking');
    nodes.forEach(function(n){{n.classList.toggle('is-hot',n.getAttribute('data-id')===id)}});
    var hot=NODE_EDGE[id]||[];
    edges.forEach(function(e){{e.classList.toggle('is-hot',hot.indexOf(e.getAttribute('data-edge'))>=0)}});
    show(id);
  }}
  nodes.forEach(function(n){{
    var act=function(){{pick(n.getAttribute('data-id'))}};
    n.addEventListener('click',act);
    n.addEventListener('keydown',function(e){{if(e.key==='Enter'||e.key===' '){{e.preventDefault();act();}}}});
  }});
  edges.forEach(function(e){{
    e.style.cursor='pointer';
    e.addEventListener('click',function(){{
      var eid=e.getAttribute('data-edge');
      for(var id in NODE_EDGE){{if((NODE_EDGE[id]||[]).indexOf(eid)>=0){{pick(id);return;}}}}
    }});
  }});
  document.addEventListener('keydown',function(e){{if(e.key==='Escape')clear();}});
}})();
</script>'''


def wrap_section(vid: str, title: str, motif: str, svg_inner: str, guide: str, legend_html: str, node_data: dict, node_edges: dict) -> str:
    svg = f'''<svg viewBox="0 0 820 420" role="img" aria-labelledby="sjw-sig-t sjw-sig-d">
<title id="sjw-sig-t">{title}</title>
<desc id="sjw-sig-d">{motif}</desc>
<rect width="820" height="420" fill="var(--sjw-ink-900)"/>
<!-- world-line frame -->
<rect x="8" y="8" width="804" height="404" rx="8" fill="none" stroke="var(--sjw-line)" stroke-width="1"/>
<rect x="14" y="14" width="12" height="392" rx="2" fill="var(--sjw-celadon)" opacity=".35"/>
<rect x="794" y="14" width="12" height="392" rx="2" fill="var(--sjw-ochre)" opacity=".35"/>
<text x="40" y="36" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">{vid} · 签名切片 · {motif}</text>
{svg_inner}
</svg>'''
    return f'''<section class="sjw-sec" id="sec-sig">
  <div class="sjw-sec-h"><span class="num">01 · 签名视觉</span><h2>{title}</h2></div>
  <div class="sjw-sig-layout">
    <div class="sjw-sig-stage" id="sjw-sig-stage">{svg}</div>
    <aside class="sjw-sig-aside" aria-live="polite">
      <div id="sjw-sig-empty" class="sjw-sig-aside-empty">点击节点展开机制说明；Esc 清除高亮。</div>
      <div id="sjw-sig-body" hidden>
        <div class="k" id="sjw-sig-tag"></div>
        <h3 id="sjw-sig-name"></h3>
        <p id="sjw-sig-text"></p>
      </div>
    </aside>
  </div>
  <div class="sjw-sig-legend">{legend_html}</div>
  <p class="sjw-sig-guide">{guide}</p>
</section>
{make_script(node_data, node_edges)}'''
