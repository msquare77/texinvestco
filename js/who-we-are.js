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
