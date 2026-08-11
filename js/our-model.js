/* ────────────────────────────────────────────────────────────
   TexInvestCo — OUR MODEL (our-model.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Reveal-on-scroll — same staggered IntersectionObserver pattern used on
// every other page (home.js/who-we-are.js/what-we-do.js).
(function(){
  const rvs=document.querySelectorAll('.rv');
  if(!rvs.length) return;
  const ro=new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('on'),i*50);
        ro.unobserve(e.target);
      }
    });
  },{threshold:0.07,rootMargin:'0px 0px -36px 0px'});
  rvs.forEach(e=>ro.observe(e));
})();

// Animated line icons — standard sitewide treatment (see css/our-model.css
// for the shared .ic-anim rules). Applied here to the eight Operating
// Engine capability icons.
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

// Tilt + spotlight on the four model cards
initCardInteractions('.om-force');
