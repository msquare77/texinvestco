/* ────────────────────────────────────────────────────────────
   TexInvestCo — WHAT WE DO (what-we-do.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Tilt + spotlight on the capability tiles
initCardInteractions('.cap');

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
