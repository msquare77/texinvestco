/* ────────────────────────────────────────────────────────────
   TexInvestCo — HOMEPAGE (index.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

// Rotating phrase
const phrases=['experienced operators','operating capacity','aligned ownership','disciplined execution'];
let idx=0;
const el=document.getElementById('rphrase');
el.style.opacity='1';el.style.transform='translateY(0)';
function next(){
  el.style.opacity='0';el.style.transform='translateY(-7px)';
  setTimeout(()=>{
    idx=(idx+1)%phrases.length;el.textContent=phrases[idx];
    el.style.transition='none';el.style.opacity='0';el.style.transform='translateY(9px)';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      el.style.transition='opacity 0.38s ease,transform 0.38s ease';
      el.style.opacity='1';el.style.transform='translateY(0)';
    }));
  },420);
}
setInterval(next,3200);

// Reveal
const rvs=document.querySelectorAll('.rv');
const ro=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*50);ro.unobserve(e.target);}});
},{threshold:0.07,rootMargin:'0px 0px -36px 0px'});
rvs.forEach(e=>ro.observe(e));

// Enhancement: animated line icons, sitewide. Every drawable shape in every
// icon on the page carries pathLength="100" in the markup (see index.html),
// so a single fixed 0→100 stroke-dashoffset range works regardless of a
// shape's real geometry — no per-icon length measurement needed. The first
// time an icon scrolls into view this flips on a "drawn" class, which starts
// the CSS `kpiRedraw` animation: draw in, hold, erase, redraw — looping
// continuously. The 4 Core Metrics (.kpi-icon-anim) additionally layer their
// own signature secondary motion (see css/home-v2.css); every other icon on
// the page (.ic-anim — Our Model, Who We Partner With, Our Edge, Recognition)
// just gets the repeating draw/erase loop at a thinner stroke.
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wire(selector, drawnClass){
    const icons=document.querySelectorAll(selector);
    if(!icons.length) return;
    if(reduced){
      icons.forEach(svg=>svg.classList.add(drawnClass));
      return;
    }
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add(drawnClass);
        io.unobserve(entry.target);
      });
    },{threshold:0.35,rootMargin:'0px 0px -20px 0px'});
    icons.forEach(svg=>io.observe(svg));
  }

  wire('.kpi-icon-anim','kpi-icon-drawn');
  wire('.ic-anim','ic-drawn');
})();

// Nav active
const sects=document.querySelectorAll('section[id]');
const nls=document.querySelectorAll('.nlinks a');
window.addEventListener('scroll',()=>{
  let cur='';
  sects.forEach(s=>{if(window.scrollY>=s.offsetTop-80)cur=s.id;});
  nls.forEach(l=>l.classList.toggle('act',l.getAttribute('href')==='#'+cur));
},{passive:true});

// Desktop nav + CTA smooth scroll with fixed-nav offset correction
document.querySelectorAll('nav a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    const t=document.querySelector(href);
    if(t){
      e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-68,behavior:'smooth'});
    }
  });
});

// Mobile nav (hamburger + panel) — shared.js; homepage panel links can be same-page "#hash"es
initMobileNav({ navOffset: 68 });

// Cursor-following glow behind the hero content
initCursorGlow('.hero');

// Tilt + spotlight on the partner cards and edge cards
initCardInteractions('.pcard, .ecard');

// Slow drifting gradient mesh behind the Our Model section (hero-only removal — this one stays)
initGradientMesh('#model');

// Parallax: the hero's wavy-line texture drifts as the page scrolls, plus
// a slight continuous undulation so the lines feel alive even at rest.
(function(){
  const hwaves=document.querySelector('.hwaves');
  if(!hwaves||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let scrollY=0;
  const start=performance.now();
  function loop(now){
    const t=(now-start)/1000;
    const undulate=Math.sin(t*0.35)*10;
    hwaves.style.transform=`translateY(${(scrollY*0.35+undulate).toFixed(1)}px)`;
    requestAnimationFrame(loop);
  }
  window.addEventListener('scroll',()=>{ scrollY=window.scrollY; },{passive:true});
  requestAnimationFrame(loop);
})();

// Engage accordion
function toggleEC(id){
  const all=document.querySelectorAll('.encard');
  const c=document.getElementById(id);
  const was=c.classList.contains('on');
  all.forEach(x=>{
    x.classList.remove('on');
    const btn=x.querySelector('.enchd');
    if(btn)btn.setAttribute('aria-expanded','false');
  });
  if(!was){
    c.classList.add('on');
    const btn=c.querySelector('.enchd');
    if(btn)btn.setAttribute('aria-expanded','true');
  }
}

function toggleTeam(id,btn){
  const c=document.getElementById(id);
  const wasOpen=c.classList.contains('on');
  // close every team card first so only one is ever open at a time
  document.querySelectorAll('.titem.on').forEach(item=>{
    item.classList.remove('on');
    const b=item.querySelector('.tmore');
    if(b)b.textContent='Read more ▾';
  });
  if(!wasOpen){
    c.classList.add('on');
    btn.textContent='Read less ▴';
  }
}

// Focus name field on desktop when user clicks Discuss CTA (same-page,
// e.g. the homepage's own header/hero/mobile-panel CTAs).
document.querySelectorAll('a[href="#contact"]').forEach(a=>{
  a.addEventListener('click',()=>{
    if(window.innerWidth>720){
      setTimeout(()=>{
        const fn=document.getElementById('fn');
        if(fn)fn.focus();
      },600);
    }
  });
});

// Focus name field when arriving from another page already pointed at
// "index.html#contact" (every "Discuss an Operating Partnership" CTA on
// every other page navigates here). shared.js's initHashOffset() already
// scrolls the section into place (instantly, with a couple of late
// re-checks — see its comment for why). This does its OWN redundant
// position check right before focusing rather than trusting that timing
// alone, because focus() itself is a common trigger for browsers to
// interrupt an in-flight scroll — by the time we focus, we want scroll
// to already be finished and correct, not racing it.
(function(){
  if(window.location.hash !== '#contact') return;
  if(window.innerWidth <= 720) return;
  function settleAndFocus(){
    const el=document.getElementById('contact');
    const fn=document.getElementById('fn');
    if(!el||!fn) return;
    const prevBehavior=document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior='auto';
    const y=el.getBoundingClientRect().top + window.pageYOffset - 68;
    window.scrollTo({top:Math.max(0,y),behavior:'auto'});
    document.documentElement.style.scrollBehavior=prevBehavior;
    fn.focus({preventScroll:true});
  }
  function focusName(){
    // Give initHashOffset's own passes (0ms/200ms/600ms after load) a
    // moment to finish, then do a final settle + focus.
    setTimeout(settleAndFocus, 700);
  }
  if(document.readyState === 'complete'){ focusName(); }
  else { window.addEventListener('load', focusName); }
})();

// Contact form
const ct=document.getElementById('fthanks');
const cf=document.getElementById('cform');
const cerr=document.getElementById('ferror');
const csubmit=cf.querySelector('button[type="submit"]');
function showError(msg){
  cerr.textContent=msg;
  cerr.style.display='block';
  // keep focus in the form and announce the error without a blocking dialog
  cerr.setAttribute('tabindex','-1');
  cerr.focus();
}
cf.addEventListener('submit',async e=>{
  e.preventDefault();
  cerr.style.display='none';
  csubmit.disabled=true;
  const originalLabel=csubmit.textContent;
  csubmit.textContent='Sending…';
  const data=new FormData(cf);
  try{
    const res=await fetch(cf.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      cf.style.display='none';
      ct.style.display='block';
      ct.focus();
    }else{
      showError('Something went wrong sending your message. Please email hello@texinvestco.com directly.');
    }
  }catch(err){
    showError('Something went wrong sending your message. Please email hello@texinvestco.com directly.');
  }finally{
    csubmit.disabled=false;
    csubmit.textContent=originalLabel;
  }
});

// Featured-story audio — plays the real narration MP3 on click. Button
// state (label + which icon shows) is driven by the <audio> element's own
// play/pause/ended events, not assumed from the click, so a blocked or
// failed play() (autoplay policies, etc.) can't leave the button showing
// "playing" when nothing is actually playing.
(function(){
  const audio=document.getElementById('fcAudio');
  const btn=document.getElementById('fcAudioBtn');
  if(!audio||!btn) return;
  const label=btn.querySelector('.fc-audio-label');
  function setPlaying(isPlaying){
    btn.classList.toggle('playing', isPlaying);
    btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    if(label) label.textContent = isPlaying ? 'Pause the Story' : 'Listen to the Story →';
  }
  btn.addEventListener('click', ()=>{
    if(audio.paused){
      audio.play().catch(()=>{});
    }else{
      audio.pause();
    }
  });
  audio.addEventListener('play', ()=>setPlaying(true));
  audio.addEventListener('pause', ()=>setPlaying(false));
  audio.addEventListener('ended', ()=>setPlaying(false));
})();
