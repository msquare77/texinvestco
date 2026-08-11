/* ────────────────────────────────────────────────────────────
   TexInvestCo — LIBRARY shared JS
   Loaded after js/shared.js on library.html, library-from-ahmad-mian.html,
   and every library-article-*.html page. Every block below no-ops when
   its target markup isn't present, so one file covers the whole system.
   ──────────────────────────────────────────────────────────── */

initMobileNav();

/* Reveal-on-scroll */
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

/* Animated line icons */
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icons=document.querySelectorAll('.ic-anim');
  if(!icons.length) return;
  if(reduced){ icons.forEach(svg=>svg.classList.add('ic-drawn')); return; }
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('ic-drawn');
      io.unobserve(entry.target);
    });
  },{threshold:0.35,rootMargin:'0px 0px -20px 0px'});
  icons.forEach(svg=>io.observe(svg));
})();

/* ────────────────────────────────────────────────────────────
   LIBRARY HUB — filter pills + search + topic control.
   Cards outside .lib-grid (the curated Featured composition) are never
   touched by filtering — only cards inside [data-lib-grid] respond.
   State is preserved in the URL query string (?type=&topic=&q=).
   ──────────────────────────────────────────────────────────── */
(function(){
  const grid=document.querySelector('[data-lib-grid]');
  if(!grid) return;
  const cards=Array.from(grid.querySelectorAll('.lib-card'));
  const pills=Array.from(document.querySelectorAll('.lib-pill'));
  const topicBtns=Array.from(document.querySelectorAll('.lib-topic'));
  const search=document.querySelector('.lib-search input');
  const empty=document.querySelector('.lib-empty');
  const emptyType=document.querySelector('.lib-empty-type');

  const params=new URLSearchParams(window.location.search);
  let state={
    type: params.get('type') || 'all',
    topic: params.get('topic') || 'all',
    q: params.get('q') || ''
  };

  function syncUrl(){
    const p=new URLSearchParams();
    if(state.type!=='all') p.set('type', state.type);
    if(state.topic!=='all') p.set('topic', state.topic);
    if(state.q) p.set('q', state.q);
    const qs=p.toString();
    const url=window.location.pathname+(qs?('?'+qs):'');
    window.history.replaceState(null,'',url);
  }

  function apply(){
    let visible=0;
    cards.forEach(card=>{
      const type=card.getAttribute('data-type')||'';
      const topic=card.getAttribute('data-topic')||'';
      const text=(card.getAttribute('data-search')||'').toLowerCase();
      const matchType = state.type==='all' || type===state.type;
      const matchTopic = state.topic==='all' || topic===state.topic;
      const matchQ = !state.q || text.includes(state.q.toLowerCase());
      const show = matchType && matchTopic && matchQ;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(empty){
      empty.style.display = visible===0 ? '' : 'none';
      if(emptyType){
        const label = state.type==='all' ? 'items' : state.type;
        emptyType.textContent = label;
      }
    }
    pills.forEach(p=>p.setAttribute('aria-pressed', p.getAttribute('data-filter-type')===state.type ? 'true':'false'));
    topicBtns.forEach(b=>b.setAttribute('aria-pressed', b.getAttribute('data-filter-topic')===state.topic ? 'true':'false'));
    syncUrl();
  }

  pills.forEach(p=>{
    p.addEventListener('click', ()=>{
      state.type=p.getAttribute('data-filter-type');
      apply();
    });
  });
  topicBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      state.topic=b.getAttribute('data-filter-topic');
      apply();
    });
  });
  if(search){
    search.value=state.q;
    let t=null;
    search.addEventListener('input', ()=>{
      clearTimeout(t);
      t=setTimeout(()=>{ state.q=search.value; apply(); },150);
    });
  }
  apply();
})();

/* ────────────────────────────────────────────────────────────
   ARTICLE TEMPLATE — reading progress bar, auto-built "On This Page"
   list from the article body's H2s, and share actions (copy link).
   ──────────────────────────────────────────────────────────── */
(function(){
  const bar=document.querySelector('.lib-progress');
  const body=document.querySelector('.lib-a-body');
  if(!bar || !body) return;
  function update(){
    const rect=body.getBoundingClientRect();
    const total=body.scrollHeight - window.innerHeight + rect.top + window.scrollY;
    const scrolled=window.scrollY;
    const start=rect.top + window.scrollY - 140;
    const pct = total>start ? Math.min(100, Math.max(0, ((scrolled-start)/(total-start))*100)) : 0;
    bar.style.width=pct+'%';
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

(function(){
  const body=document.querySelector('.lib-a-body');
  const list=document.querySelector('.lib-otp-list');
  if(!body || !list) return;
  const heads=Array.from(body.querySelectorAll('h2'));
  if(!heads.length){
    const mod=list.closest('.lib-aside-mod');
    if(mod) mod.style.display='none';
    return;
  }
  heads.forEach((h,i)=>{
    if(!h.id) h.id='s'+(i+1);
    const a=document.createElement('a');
    a.href='#'+h.id;
    a.textContent=h.textContent;
    list.appendChild(a);
  });
})();

(function(){
  const btn=document.querySelector('[data-copy-link]');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    navigator.clipboard?.writeText(window.location.href).catch(()=>{});
    const original=btn.getAttribute('aria-label');
    btn.setAttribute('aria-label','Link copied');
    btn.classList.add('copied');
    setTimeout(()=>{ btn.setAttribute('aria-label', original); btn.classList.remove('copied'); }, 1800);
  });
})();
