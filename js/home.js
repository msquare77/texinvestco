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

// Slow drifting gradient mesh behind the Our Model section
initGradientMesh('#model');

// Parallax: the hero's wavy-line texture drifts slightly as the page scrolls
(function(){
  const hwaves=document.querySelector('.hwaves');
  if(!hwaves||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking=false;
  function apply(){ hwaves.style.transform=`translateY(${(window.scrollY*0.12).toFixed(1)}px)`; ticking=false; }
  function onScroll(){ if(!ticking){ requestAnimationFrame(apply); ticking=true; } }
  window.addEventListener('scroll',onScroll,{passive:true});
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
  const open=c.classList.toggle('on');
  btn.textContent=open?'Read less ▴':'Read more ▾';
}

// Focus name field on desktop when user clicks Discuss CTA
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

// Contact form
const ct=document.getElementById('fthanks');
const cf=document.getElementById('cform');
cf.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=new FormData(cf);
  try{
    const res=await fetch(cf.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){cf.style.display='none';ct.style.display='block';}
    else{alert('Something went wrong sending your message. Please email hello@texinvestco.com directly.');}
  }catch(err){alert('Something went wrong sending your message. Please email hello@texinvestco.com directly.');}
});
