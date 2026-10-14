/* ══════════════════════════════════════════
   adri.js_ — main.js
   Interacciones, juegos y comportamientos UI
══════════════════════════════════════════ */

/* ── Typewriter ── */
(()=>{
  const L=['Software Engineer 👩‍💻','Divulgadora STEM 🔬','Creadora de contenido 📱','Apasionada de JS ⚡'];
  let li=0,ci=0,del=false;
  const el=document.getElementById('tt');
  if(!el)return;
  const t=()=>{const c=L[li];if(!del){el.textContent=c.slice(0,++ci);if(ci===c.length){del=true;setTimeout(t,1800);return;}}else{el.textContent=c.slice(0,--ci);if(!ci){del=false;li=(li+1)%L.length;setTimeout(t,300);return;}}setTimeout(t,del?35:72);};
  t();
})();

/* ── Scroll reveal ── */
document.querySelectorAll('.rv').forEach(el=>{
  new IntersectionObserver(([e])=>{if(e.isIntersecting)el.classList.add('v');},{threshold:.1}).observe(el);
});

/* ── Theme ── */
function T(cls,id){
  document.body.className=cls;
  document.querySelectorAll('.td').forEach(d=>d.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  localStorage.setItem('adri-t',cls+'|'+id);
}
(()=>{
  const s=localStorage.getItem('adri-t');
  if(!s)return;
  const[cls,id]=s.split('|');
  document.body.className=cls;
  document.querySelectorAll('.td').forEach(d=>d.classList.remove('on'));
  document.getElementById(id)?.classList.add('on');
})();

/* ── Modal ── */
function openM(id){document.getElementById('modal-'+id).classList.add('open');document.body.style.overflow='hidden';}
function closeM(id){document.getElementById('modal-'+id).classList.remove('open');document.body.style.overflow='';}
document.querySelectorAll('.mo').forEach(m=>m.addEventListener('click',e=>{if(e.target===m){m.classList.remove('open');document.body.style.overflow='';}}));

/* ── Blog filter & search ── */
function fB(btn,cat){
  document.querySelectorAll('.bf').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  document.querySelectorAll('.post').forEach(p=>p.classList.toggle('hid',cat!=='all'&&p.dataset.cat!==cat));
}
function sB(q){
  q=q.toLowerCase();
  document.querySelectorAll('.post').forEach(p=>p.classList.toggle('hid',!!q&&!p.textContent.toLowerCase().includes(q)));
  if(q)document.querySelectorAll('.bf').forEach(b=>{b.classList.remove('on');if(b.dataset.f==='all')b.classList.add('on');});
}

/* ── Game tabs ── */
function gSwitch(btn,id){
  document.querySelectorAll('.gt').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.gp').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');document.getElementById('panel-'+id).classList.add('on');
}

/* ══ CIRCLE GAME ══ */
(()=>{
  const canvas=document.getElementById('cc');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let drawing=false,pts=[],best=null,tries=0;
  const resize=()=>{const w=Math.min(480,canvas.parentElement.clientWidth-2);canvas.width=w;canvas.height=Math.round(w*280/480);};
  resize();new ResizeObserver(resize).observe(canvas.parentElement);
  const pos=e=>{const r=canvas.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return[s.clientX-r.left,s.clientY-r.top];};
  canvas.addEventListener('mousedown',e=>{drawing=true;pts=[];pts.push(pos(e));});
  canvas.addEventListener('mousemove',e=>{if(!drawing)return;pts.push(pos(e));redraw();});
  canvas.addEventListener('mouseup',e=>{if(!drawing||pts.length<10)return;drawing=false;analyze();});
  canvas.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;pts=[];pts.push(pos(e));},{passive:false});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();if(!drawing)return;pts.push(pos(e));redraw();},{passive:false});
  canvas.addEventListener('touchend',e=>{e.preventDefault();if(!drawing||pts.length<10)return;drawing=false;analyze();},{passive:false});
  function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(pts.length<2)return;
    ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    pts.forEach(([x,y])=>ctx.lineTo(x,y));
    ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--acc').trim()||'#4ade80';
    ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
  }
  function analyze(){
    const cx=pts.reduce((s,p)=>s+p[0],0)/pts.length;
    const cy=pts.reduce((s,p)=>s+p[1],0)/pts.length;
    const dists=pts.map(([x,y])=>Math.hypot(x-cx,y-cy));
    const avg=dists.reduce((s,d)=>s+d,0)/dists.length;
    const std=Math.sqrt(dists.reduce((s,d)=>s+(d-avg)**2,0)/dists.length);
    const angles=pts.map(([x,y])=>Math.atan2(y-cy,x-cx));
    const sorted=[...angles].sort((a,b)=>a-b);
    let maxGap=0;for(let i=1;i<sorted.length;i++)maxGap=Math.max(maxGap,sorted[i]-sorted[i-1]);
    maxGap=Math.max(maxGap,sorted[0]+Math.PI*2-sorted[sorted.length-1]);
    const coverage=Math.max(0,1-maxGap/(Math.PI*2));
    const score=Math.round(Math.max(0,1-std/avg)*70+coverage*30);
    tries++;if(best===null||score>best)best=score;
    document.getElementById('cr-last').textContent=score+'%';
    document.getElementById('cr-best').textContent=best+'%';
    document.getElementById('cr-tries').textContent=tries;
    const e=score>=95?'🏆':score>=85?'⭐':score>=70?'😮':score>=50?'🙂':'😅';
    const m=score>=95?'¡Perfecta! Eres una leyenda':score>=85?'¡Casi perfecto!':score>=70?'¡Muy bien!':score>=50?'Nada mal, sigue':'Practicar hace al maestro 😂';
    document.getElementById('cr-result').textContent=e+' '+score+'%';
    document.getElementById('cr-result').style.color=score>=85?'var(--acc)':score>=60?'var(--code)':'var(--red)';
    document.getElementById('cr-msg').textContent=m;
    ctx.beginPath();ctx.arc(cx,cy,avg,0,Math.PI*2);
    ctx.strokeStyle='rgba(111,191,168,.3)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle='rgba(111,191,168,.6)';ctx.fill();
  }
  window.clearCircle=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pts=[];document.getElementById('cr-result').textContent='';document.getElementById('cr-msg').textContent='Dibuja para empezar';};
})();

/* ══ 2048 ══ */
(()=>{
  let board,score,best=0,over,won;
  const N=4;
  const empty=()=>Array.from({length:N},()=>Array(N).fill(0));
  const addTile=b=>{const e=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!b[r][c])e.push([r,c]);if(!e.length)return;const[r,c]=e[Math.random()*e.length|0];b[r][c]=Math.random()<.9?2:4;};
  window.init20=()=>{board=empty();addTile(board);addTile(board);score=0;over=false;won=false;render();};
  function render(){
    const el=document.getElementById('b20');if(!el)return;el.innerHTML='';
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){
      const d=document.createElement('div');d.className='c20';const v=board[r][c];
      if(v){d.textContent=v;d.dataset.v=v;}el.appendChild(d);
    }
    document.getElementById('s20').textContent=score;
    if(score>best){best=score;document.getElementById('b20s').textContent=best;}
    const msg=document.getElementById('g20msg');
    if(won){msg.textContent='🏆 ¡2048! ¡Lo conseguiste!';msg.style.color='var(--acc)';}
    else if(over){msg.textContent='Game over — ¡inténtalo de nuevo!';msg.style.color='var(--red)';}
    else msg.textContent='';
  }
  function slide(row){let r=row.filter(x=>x);for(let i=0;i<r.length-1;i++){if(r[i]===r[i+1]){r[i]*=2;score+=r[i];if(r[i]===2048)won=true;r.splice(i+1,1);i++;}}while(r.length<N)r.push(0);return r;}
  function move(dir){
    if(over&&!won)return;let moved=false;const b=board.map(r=>[...r]);
    for(let r=0;r<N;r++){
      if(dir==='left'){const nr=slide(b[r]);if(nr.join()!==b[r].join())moved=true;board[r]=nr;}
      if(dir==='right'){const nr=slide([...b[r]].reverse()).reverse();if(nr.join()!==b[r].join())moved=true;board[r]=nr;}
    }
    for(let c=0;c<N;c++){
      const col=board.map(r=>r[c]);let s;
      if(dir==='up'){s=slide(col);if(s.join()!==col.join())moved=true;s.forEach((v,r)=>board[r][c]=v);}
      if(dir==='down'){s=slide([...col].reverse()).reverse();if(s.join()!==col.join())moved=true;s.forEach((v,r)=>board[r][c]=v);}
    }
    if(moved){addTile(board);if(!canMove())over=true;}render();
  }
  const canMove=()=>{for(let r=0;r<N;r++)for(let c=0;c<N;c++){if(!board[r][c])return true;if(c<N-1&&board[r][c]===board[r][c+1])return true;if(r<N-1&&board[r][c]===board[r+1][c])return true;}return false;};
  document.addEventListener('keydown',e=>{const m={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(m[e.key]){e.preventDefault();move(m[e.key]);}});
  let tx,ty;
  window.addEventListener('load',()=>{
    const bd=document.getElementById('b20');if(!bd)return;
    bd.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
    bd.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));},{passive:true});
    init20();
  });
  if(document.readyState==='complete')init20();
})();

/* ══ STROOP ══ */
(()=>{
  const C=[{n:'Rojo',h:'#e5401c'},{n:'Verde',h:'#22c55e'},{n:'Azul',h:'#3b82f6'},{n:'Morado',h:'#8b5cf6'},{n:'Rosa',h:'#ec4899'},{n:'Naranja',h:'#f97316'}];
  let sc=0,secs=30,tmr=null,q=null,active=false;
  const rnd=(arr,ex)=>{const f=arr.filter(x=>x!==ex);return f[Math.random()*f.length|0];};
  function nQ(){
    const word=C[Math.random()*C.length|0];
    const ink=rnd(C,word);
    const opts=[ink];while(opts.length<3){const c=rnd(C,null);if(!opts.includes(c))opts.push(c);}opts.sort(()=>Math.random()-.5);
    q={word,ink,opts};
    document.getElementById('sword').textContent=q.word.n;
    document.getElementById('sword').style.color=q.ink.h;
    const o=document.getElementById('sopts');o.innerHTML='';
    opts.forEach(c=>{
      const b=document.createElement('button');b.className='sopt';b.textContent=c.n;
      b.style.color=c.h;b.style.background=c.h+'18';b.style.borderColor=c.h+'33';
      b.onclick=()=>ans(b,c);o.appendChild(b);
    });
  }
  function ans(btn,ch){
    if(!active)return;
    document.querySelectorAll('.sopt').forEach(b=>b.disabled=true);
    if(ch===q.ink){btn.classList.add('ok');sc++;}
    else{btn.classList.add('err');document.querySelectorAll('.sopt').forEach(b=>{if(b.textContent===q.ink.n)b.classList.add('ok');});}
    document.getElementById('sscore').textContent='Puntos: '+sc;
    setTimeout(()=>{nQ();document.querySelectorAll('.sopt').forEach(b=>b.disabled=false);},450);
  }
  window.startStroop=()=>{
    sc=0;secs=30;active=true;
    document.getElementById('s-start').style.display='none';
    document.getElementById('s-final').style.display='none';
    document.getElementById('s-game').style.display='block';
    document.getElementById('sscore').textContent='Puntos: 0';
    const bar=document.getElementById('sbar');bar.style.width='100%';
    clearInterval(tmr);
    tmr=setInterval(()=>{
      secs--;bar.style.width=(secs/30*100)+'%';
      bar.style.background=secs>10?'var(--acc)':secs>5?'var(--code)':'var(--red)';
      if(secs<=0){
        clearInterval(tmr);active=false;
        document.getElementById('s-game').style.display='none';
        document.getElementById('s-final').style.display='block';
        document.getElementById('sfnum').textContent=sc;
        const m=sc>=25?'🧠 Cerebro de élite. Impresionante.':sc>=15?'⚡ Excelente control cognitivo.':sc>=8?'👍 Buen trabajo, ¡practica más!':'🐢 El cerebro necesita café. O un nap.';
        document.getElementById('sfmsg').textContent=m;
      }
    },1000);
    nQ();
  };
})();
