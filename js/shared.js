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

  hbg.addEventListener('click', () => {
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
}
