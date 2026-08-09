/* ────────────────────────────────────────────────────────────
   TexInvestCo — WHO WE ARE (who-we-are.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Animated line icons — standard sitewide treatment (same as homepage).
// The first time an .ic-anim icon scrolls into view, flip on "ic-drawn"
// to start the repeating draw/erase loop (see css/who-we-are-v2.css).
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icons=document.querySelectorAll('.ic-anim');
  if(!icons.length) return;
  if(reduced){
    icons.forEach(svg=>svg.classList.add('ic-drawn'));
    return;
  }
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('ic-drawn');
      io.unobserve(entry.target);
    });
  },{threshold:0.35,rootMargin:'0px 0px -20px 0px'});
  icons.forEach(svg=>io.observe(svg));
})();

// Philosophy — interactive four-bar diagram. Hover/focus brings all bars
// into alignment and grows the selected one slightly while its contrast
// phrase types open (pure CSS, see who-we-are-v2.css); click/tap locks a
// bar open (needed for touch, where there's no hover to leave). Only one
// bar is ever active.
(function(){
  const stage=document.getElementById('bandStage');
  if(!stage) return;
  const bands=Array.from(stage.querySelectorAll('.pband'));
  if(!bands.length) return;

  function setActive(btn){
    stage.classList.add('has-active');
    bands.forEach(b=>b.classList.toggle('active', b===btn));
  }
  function clearActive(){
    stage.classList.remove('has-active');
    bands.forEach(b=>b.classList.remove('active'));
  }

  bands.forEach(b=>{
    b.addEventListener('mouseenter',()=>setActive(b));
    b.addEventListener('mouseleave',()=>{ if(!b.classList.contains('locked')) clearActive(); });
    b.addEventListener('focus',()=>setActive(b));
    b.addEventListener('blur',()=>{ if(!b.classList.contains('locked')) clearActive(); });
    b.addEventListener('click',()=>{
      const wasLocked=b.classList.contains('locked');
      bands.forEach(x=>x.classList.remove('locked'));
      if(wasLocked){
        clearActive();
      }else{
        b.classList.add('locked');
        setActive(b);
      }
    });
  });
})();

// Team toggles
function toggleFounder(btn){
  const ext=document.getElementById('founder-ext');
  const open=ext.style.maxHeight==='0px'||ext.style.maxHeight==='0';
  ext.style.maxHeight=open?'600px':'0';
  btn.textContent=open?'Read less ▴':'Read more ▾';
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
