/* ────────────────────────────────────────────────────────────
   TexInvestCo — WHO WE ARE (who-we-are.html) page-specific JS
   Loaded after js/shared.js.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

// Team toggles
function toggleFounder(btn){
  const ext=document.getElementById('founder-ext');
  const open=ext.style.maxHeight==='0px'||ext.style.maxHeight==='0';
  ext.style.maxHeight=open?'600px':'0';
  btn.textContent=open?'Read less ▴':'Read more ▾';
}

function toggleTeam(id,btn){
  const c=document.getElementById(id);
  const open=c.classList.toggle('on');
  btn.textContent=open?'Read less ▴':'Read more ▾';
}
