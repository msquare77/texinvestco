/* ────────────────────────────────────────────────────────────
   TexInvestCo — SHARED JS
   Mobile nav (hamburger + slide-out panel) — identical behavior
   on every page. Call initMobileNav() once the DOM for #hbg /
   #mpanel exists. Pass { navOffset: <fixed-nav-height> } only on
   pages where the mobile panel's links can point to an in-page
   "#hash" (currently just the homepage) so those clicks smooth-
   scroll instead of doing a full navigation.
   ──────────────────────────────────────────────────────────── */
function initMobileNav(opts){
  opts = opts || {};
  const navOffset = opts.navOffset;
  const hbg = document.getElementById('hbg');
  const mp = document.getElementById('mpanel');
  if(!hbg || !mp) return;

  // iPhone WebKit can fire more than one click/touch event per tap; each
  // extra firing races the previous open/close transition and reads as
  // the menu "flickering". Debounce ONLY on iPhone (small viewport +
  // WebKit-only feature check) — Android/desktop get zero behavior change.
  let isIOSPhone = false;
  if (window.CSS && CSS.supports && CSS.supports('-webkit-touch-callout: none')) {
    isIOSPhone = window.innerWidth <= 600; // keep in sync with the CSS gate in shared.css
  }
  let toggleLocked = false;

  hbg.addEventListener('click', () => {
    if (isIOSPhone) {
      if (toggleLocked) return;
      toggleLocked = true;
      setTimeout(() => { toggleLocked = false; }, 400);
    }
    const o = mp.classList.toggle('on');
    hbg.classList.toggle('act', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });

  mp.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      mp.classList.remove('on');
      hbg.classList.remove('act');
      document.body.style.overflow = '';
      if (navOffset != null && href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          const t = document.querySelector(href);
          if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navOffset, behavior: 'smooth' });
        }, 300);
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mp.classList.contains('on')) {
      mp.classList.remove('on');
      hbg.classList.remove('act');
      document.body.style.overflow = '';
    }
  });

  // If the viewport crosses into desktop width (resize or orientation
  // change) while the mobile overlay is open, force it closed — otherwise
  // the CSS-driven desktop nav reappears while the full-screen mobile
  // panel is still open underneath it.
  const desktopMQ = window.matchMedia('(min-width: 721px)');
  const closeOnDesktop = (e) => {
    if (e.matches && mp.classList.contains('on')) {
      mp.classList.remove('on');
      hbg.classList.remove('act');
      document.body.style.overflow = '';
    }
  };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', closeOnDesktop);
  else desktopMQ.addListener(closeOnDesktop); // Safari <14 fallback
}

/* ────────────────────────────────────────────────────────────
   SITEWIDE MOTION EFFECTS
   All of the below are self-creating (no HTML changes required)
   and respect prefers-reduced-motion / touch input.
   ──────────────────────────────────────────────────────────── */

/* Scroll-progress indicator — thin gold line across the very top of
   the viewport that fills as the user scrolls the page. Auto-run on
   every page at the bottom of this file. */
function initScrollProgress(){
  const bar=document.createElement('div');
  bar.className='scroll-progress';
  bar.setAttribute('aria-hidden','true');
  document.body.prepend(bar);
  let ticking=false;
  function apply(){
    const h=document.documentElement;
    const scrollTop=h.scrollTop||document.body.scrollTop;
    const scrollHeight=(h.scrollHeight||document.body.scrollHeight)-h.clientHeight;
    const pct=scrollHeight>0?(scrollTop/scrollHeight)*100:0;
    bar.style.width=pct+'%';
    ticking=false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(apply); ticking=true; } }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',apply);
  apply();
}

/* Cursor-following glow — a soft radial gradient that trails the mouse
   (with easing, so it drifts rather than snaps) behind a container's
   content. Used behind the homepage hero. Skipped on touch devices. */
function initCursorGlow(containerSelector){
  const container=typeof containerSelector==='string'?document.querySelector(containerSelector):containerSelector;
  if(!container) return;
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if(getComputedStyle(container).position==='static') container.style.position='relative';
  const glow=document.createElement('div');
  glow.className='cursor-glow';
  glow.setAttribute('aria-hidden','true');
  const dot=document.createElement('div');
  dot.className='cursor-glow-dot';
  glow.appendChild(dot);
  container.insertBefore(glow,container.firstChild);
  let tx=0,ty=0,cx=0,cy=0,raf=null;
  function loop(){
    cx+=(tx-cx)*0.08; cy+=(ty-cy)*0.08;
    dot.style.transform=`translate(${cx}px,${cy}px)`;
    if(Math.abs(tx-cx)>0.3||Math.abs(ty-cy)>0.3){ raf=requestAnimationFrame(loop); } else { raf=null; }
  }
  container.addEventListener('mousemove',e=>{
    const r=container.getBoundingClientRect();
    tx=e.clientX-r.left; ty=e.clientY-r.top;
    dot.classList.add('on');
    if(!raf) raf=requestAnimationFrame(loop);
  });
  container.addEventListener('mouseleave',()=>{ dot.classList.remove('on'); });
}

/* Tilt + spotlight card interaction — a small 3D perspective tilt plus
   a soft gold spotlight, both tracking the cursor within each card.
   Used on card-grid tiles (partner cards, edge cards, capability
   tiles) where an actual glow-behind-content would be hidden by the
   tiles' solid backgrounds. Skipped on touch devices. */
function initCardInteractions(selector){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll(selector).forEach(card=>{
    card.classList.add('tilt-card');
    card.style.transition='transform 0.15s ease-out, border-color 0.2s ease, background 0.2s ease';
    const spot=document.createElement('div');
    spot.className='card-spot';
    spot.setAttribute('aria-hidden','true');
    card.appendChild(spot);
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=((e.clientX-r.left)/r.width)*100;
      const py=((e.clientY-r.top)/r.height)*100;
      spot.style.setProperty('--mx',px+'%');
      spot.style.setProperty('--my',py+'%');
      const rx=((py/100)-0.5)*-6;
      const ry=((px/100)-0.5)*6;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      spot.style.opacity='1';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
      spot.style.opacity='0';
    });
  });
}

/* Gradient mesh — slow, JS-driven drifting blobs behind a section,
   updated every frame via requestAnimationFrame. Very quiet; adds
   depth without calling attention to itself. Used behind the Our
   Model section only (not the hero). */
function initGradientMesh(containerSelector,opts){
  const container=typeof containerSelector==='string'?document.querySelector(containerSelector):containerSelector;
  if(!container) return;
  if(getComputedStyle(container).position==='static') container.style.position='relative';
  container.style.overflow='hidden';
  const wrap=document.createElement('div');
  wrap.className='mesh-bg';
  wrap.setAttribute('aria-hidden','true');
  const specs=(opts&&opts.specs)||[
    {size:44,color:'rgba(202,168,75,0.16)',pos:{left:'-8%',top:'-12%'}},
    {size:38,color:'rgba(110,145,210,0.14)',pos:{right:'-10%',top:'14%'}},
    {size:34,color:'rgba(202,168,75,0.12)',pos:{left:'26%',bottom:'-18%'}}
  ];
  const blobs=specs.map(s=>{
    const b=document.createElement('span');
    b.className='mesh-blob';
    b.style.width=s.size+'vw'; b.style.height=s.size+'vw';
    Object.assign(b.style,s.pos);
    b.style.background=`radial-gradient(circle, ${s.color} 0%, transparent 70%)`;
    wrap.appendChild(b);
    return b;
  });
  container.insertBefore(wrap,container.firstChild);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start=performance.now();
  function loop(now){
    const t=(now-start)/1000;
    blobs.forEach((b,i)=>{
      const speed=0.07+i*0.02;
      const rx=Math.sin(t*speed+i*2)*70;
      const ry=Math.cos(t*speed*0.8+i)*56;
      b.style.transform=`translate(${rx}px,${ry}px)`;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* Scroll-linked parallax for background-image elements (the CTA
   strip's and "Beyond the Build"'s wavy-line texture) — the texture
   drifts slightly slower than the foreground content as the page
   scrolls, deepening the existing motif rather than adding a new one. */
function initParallaxBG(selector,speed){
  const els=document.querySelectorAll(selector);
  if(!els.length) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking=false;
  function apply(){
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      const mid=r.top+r.height/2-window.innerHeight/2;
      el.style.backgroundPositionY=`calc(50% + ${(-mid*speed).toFixed(1)}px)`;
    });
    ticking=false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(apply); ticking=true; } }
  window.addEventListener('scroll',onScroll,{passive:true});
  apply();
}

/* Soft particle drift confined to a canvas element — used around the
   subpage hero art panels (compass / north star / constellation),
   NOT across the whole hero. The canvas itself is sized and masked
   via CSS (.hero-art-particles) to a soft-edged area around the art,
   so the drift reads as "around the image" rather than a full-hero
   effect. */
function initImageParticles(canvasSelector,opts){
  const canvas=typeof canvasSelector==='string'?document.querySelector(canvasSelector):canvasSelector;
  if(!canvas||!canvas.getContext) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx=canvas.getContext('2d');
  const dpr=window.devicePixelRatio||1;
  const count=(opts&&opts.count)||22;
  let w=0,h=0,particles=[];
  function resize(){
    const r=canvas.getBoundingClientRect();
    w=r.width; h=r.height;
    canvas.width=Math.max(1,Math.round(w*dpr));
    canvas.height=Math.max(1,Math.round(h*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function seed(){
    particles=Array.from({length:count},()=>({
      x:Math.random()*w, y:Math.random()*h,
      r:Math.random()*1.3+0.4,
      vx:(Math.random()-0.5)*0.10, vy:(Math.random()-0.5)*0.10,
      o:Math.random()*0.45+0.15
    }));
  }
  resize(); seed();
  window.addEventListener('resize',()=>{ resize(); });
  function loop(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x+=w; if(p.x>w)p.x-=w;
      if(p.y<0)p.y+=h; if(p.y>h)p.y-=h;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(202,168,75,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

initScrollProgress();
initParallaxBG('.cta-strip',0.06);
initParallaxBG('.beyond-sec',0.05);
