/* ────────────────────────────────────────────────────────────
   TexInvestCo — WHAT WE DO (what-we-do.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Tilt + spotlight on the capability tiles
initCardInteractions('.cap');

function toggleTeam(id,btn){
  const c=document.getElementById(id);
  const open=c.classList.toggle('on');
  btn.textContent=open?'Read less ▴':'Read more ▾';
}
