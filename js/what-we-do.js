/* ────────────────────────────────────────────────────────────
   TexInvestCo — WHAT WE DO (what-we-do.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Tilt + spotlight on the capability tiles
initCardInteractions('.cap');

// Animated line icons — standard sitewide treatment (same as homepage and
// Who We Are). The first time an .ic-anim icon scrolls into view, flip on
// "ic-drawn" to start the repeating draw/erase loop (see
// css/what-we-do-v2.css). Applied here to the eight capability icons.
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
