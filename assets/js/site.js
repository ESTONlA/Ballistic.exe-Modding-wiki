(() => {
  'use strict';
  const pages = window.WIKI_PAGES;
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${{
    book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    moon:'<path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    right:'<path d="m9 5 7 7-7 7"/>',
    link:'<path d="m10 13 4-4m-7 2-2 2a4 4 0 0 0 6 6l2-2m0-10 2-2a4 4 0 0 1 6 6l-2 2"/>',
    copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    external:'<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>'
  }[name]}</svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const id = document.body.dataset.page;
  const page = pages.find(p => p[0] === id) || pages[0];
  const nav = () => [...new Set(pages.map(p => p[2]))].map(group => `<details class="nav-group"${group === page[2] || group === 'Getting started' ? ' open' : ''}><summary>${group}${icon('down')}</summary>${pages.filter(p => p[2] === group).map(p => `<a href="${p[0]}.html"${p[0] === id ? ' aria-current="page"' : ''}>${p[1]}</a>`).join('')}</details>`).join('');
  const footer = '<div class="sidebar-footer">Ballistic.exe modding documentation<br><a href="tools.html">Tools &amp; external documentation</a></div>';
  document.getElementById('site-header').innerHTML = `<header class="site-header"><button class="icon-button menu-toggle" aria-label="Open navigation">${icon('menu')}</button><a class="brand" href="introduction.html"><span class="brand-mark">${icon('book')}</span>Ballistic Modding Wiki</a><nav class="top-nav" aria-label="Main"><a class="active" href="introduction.html">Documentation</a><a href="tools.html">Resources</a></nav><div class="header-tools"><button class="search-trigger" aria-label="Search documentation">${icon('search')}<span>Search documentation</span><kbd>Ctrl K</kbd></button><button class="icon-button theme-toggle" aria-label="Switch color theme"></button><a class="external-header" href="https://store.steampowered.com/app/3432980/Ballisticexe/" target="_blank" rel="noreferrer">Steam ${icon('external')}</a></div></header>`;
  document.getElementById('sidebar').innerHTML = `<aside class="sidebar" aria-label="Documentation navigation"><p class="sidebar-label">Documentation</p><input class="sidebar-filter" type="search" aria-label="Filter navigation" placeholder="Filter pages…">${nav()}<p class="nav-empty" hidden>No matching pages.</p>${footer}</aside>`;
  document.getElementById('breadcrumb').innerHTML = `<a href="introduction.html">Docs</a>${icon('right')}<span>${esc(page[2])}</span>${icon('right')}<span>${esc(page[1])}</span>`;
  const article = document.querySelector('article');
  const h1 = article.querySelector('h1');
  const title = document.createElement('div'); title.className = 'article-title'; h1.before(title); title.append(h1);
  const copyLink = document.createElement('button'); copyLink.className = 'icon-button article-tools'; copyLink.setAttribute('aria-label','Copy page link'); copyLink.innerHTML = icon('link'); title.append(copyLink);
  const headings = [...article.querySelectorAll('h2,h3')];
  const toc = headings.map(h => `<a href="#${h.id}">${esc(h.textContent)}</a>`).join('');
  document.getElementById('page-toc').innerHTML = `<nav class="page-toc" aria-label="On this page"><p class="toc-label">In this article</p>${toc}<div class="toc-source">Need an API detail?<a href="https://docs.ue4ss.com/dev/" target="_blank" rel="noreferrer">UE4SS documentation ↗</a></div></nav>`;
  if (headings.length) {
    const mobileToc = document.createElement('details'); mobileToc.className = 'mobile-toc'; mobileToc.innerHTML = `<summary>In this article</summary>${toc}`;
    article.before(mobileToc);
  }
  headings.forEach(h => { const a = document.createElement('a'); a.href = `#${h.id}`; a.className = 'heading-anchor'; a.textContent = '#'; a.setAttribute('aria-label',`Link to ${h.textContent}`); h.append(a); });
  const index = pages.indexOf(page), previous = pages[index-1], next = pages[index+1];
  document.getElementById('page-end').innerHTML = `<div class="page-bottom"><span>Examples based on the Ballistic.exe Demo</span><a href="#top">Back to top ↑</a></div><nav class="page-navigation" aria-label="Adjacent pages">${previous ? `<a href="${previous[0]}.html"><small>Previous</small>← ${previous[1]}</a>` : ''}${next ? `<a href="${next[0]}.html"><small>Next</small>${next[1]} →</a>` : ''}</nav><footer class="site-footer">Ballistic Modding Wiki · Independent documentation. Not affiliated with Tic Tac Toe Digital.</footer>`;
  let toastTimer;
  function notify(message) {
    let box = document.querySelector('.toast');
    if (!box) { box = document.createElement('div'); box.className = 'toast'; box.setAttribute('role','status'); document.body.append(box); }
    box.textContent = message; box.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => box.hidden = true, 2400);
  }
  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const input = document.createElement('textarea'); input.value = text; input.style.cssText = 'position:fixed;opacity:0'; document.body.append(input); input.select();
        const copied = document.execCommand('copy'); input.remove(); if (!copied) throw Error('Clipboard unavailable');
      }
      return true;
    } catch { notify('Clipboard unavailable. Select the text to copy it.'); return false; }
  }
  copyLink.addEventListener('click', async () => { if (await copy(location.href)) notify('Page link copied'); });
  article.querySelectorAll('pre').forEach(pre => {
    const text = pre.textContent, block = document.createElement('div'); block.className = 'code-block'; pre.before(block);
    const header = document.createElement('div'); header.className = 'code-header';
    const label = document.createElement('span'); label.textContent = pre.dataset.title || pre.dataset.language || 'Code';
    const button = document.createElement('button'); button.className = 'copy-code'; button.innerHTML = `${icon('copy')} Copy`; button.setAttribute('aria-label',`Copy ${label.textContent}`);
    button.addEventListener('click',async () => { if(await copy(text)) { button.textContent = 'Copied'; setTimeout(() => button.innerHTML = `${icon('copy')} Copy`,1600); } });
    header.append(label,button); block.append(header,pre);
    if (pre.dataset.language === 'lua') {
      const code = pre.querySelector('code');
      code.innerHTML = text.split(/(--[^\n]*|"[^"\n]*"|'[^'\n]*'|\[\[[\s\S]*?\]\]|\b(?:local|function|end|if|then|return|nil|true|false|not|and|or|for|do|in)\b)/g).map(token => {
        const type = token.startsWith('--') ? 'comment' : /^['"]|^\[\[/.test(token) ? 'string' : /^(local|function|end|if|then|return|nil|true|false|not|and|or|for|do|in)$/.test(token) ? 'keyword' : '';
        return type ? `<span class="token-${type}">${esc(token)}</span>` : esc(token);
      }).join('');
    }
  });
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle'); button.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon'); button.setAttribute('aria-label',`Use ${theme === 'dark' ? 'light' : 'dark'} theme`);
    try { localStorage.setItem('ballistic-wiki-theme',theme); } catch {}
  }
  setTheme(document.documentElement.dataset.theme || 'dark');
  document.querySelector('.theme-toggle').addEventListener('click',() => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  const mobileMenu = document.createElement('dialog'); mobileMenu.className = 'mobile-menu'; mobileMenu.setAttribute('aria-label','Documentation navigation');
  mobileMenu.innerHTML = `<div class="menu-header">Documentation<button class="icon-button" aria-label="Close navigation">${icon('close')}</button></div>${nav()}${footer}`; document.body.append(mobileMenu);
  document.querySelector('.menu-toggle').addEventListener('click',() => mobileMenu.showModal());
  mobileMenu.querySelector('button').addEventListener('click',() => mobileMenu.close());
  mobileMenu.addEventListener('click',e => { if(e.target === mobileMenu && e.clientX > mobileMenu.getBoundingClientRect().right) mobileMenu.close(); });
  window.addEventListener('resize',() => { if(innerWidth > 760 && mobileMenu.open) mobileMenu.close(); });
  const filter = document.querySelector('.sidebar-filter');
  filter.addEventListener('input',() => {
    let matches = 0;
    document.querySelectorAll('.sidebar .nav-group').forEach(group => {
      let groupMatches = 0;
      group.querySelectorAll('a').forEach(a => { a.hidden = !a.textContent.toLowerCase().includes(filter.value.toLowerCase()); if(!a.hidden) groupMatches++; });
      group.hidden = !groupMatches; if(filter.value) group.open = true; matches += groupMatches;
    });
    document.querySelector('.nav-empty').hidden = matches > 0;
  });
  const search = document.createElement('dialog'); search.className = 'search-dialog'; search.setAttribute('aria-label','Search documentation');
  search.innerHTML = `<div class="search-head">${icon('search')}<input type="search" placeholder="Search the documentation…" aria-label="Search all pages" autocomplete="off"><button class="icon-button" aria-label="Close search">${icon('close')}</button></div><div class="search-results" role="listbox" aria-label="Search results"></div><p class="search-caption">↑ ↓ to navigate · Enter to open · Esc to close</p>`;
  document.body.append(search);
  const searchInput = search.querySelector('input'), resultBox = search.querySelector('.search-results'); let selected = 0;
  function results() {
    const words = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const source = window.WIKI_SEARCH || pages.map(p => ({id:p[0],title:p[1],text:p[2]}));
    const found = source.filter(p => words.every(w => `${p.title} ${p.text}`.toLowerCase().includes(w))).slice(0,9);
    selected = 0;
    resultBox.innerHTML = found.length ? found.map((p,i) => {
      const pos = words.length ? p.text.toLowerCase().indexOf(words[0]) : 0;
      const snippet = p.text.slice(Math.max(0,pos-35),Math.max(0,pos-35)+120);
      return `<a role="option" aria-selected="${i === 0}" class="search-result" href="${p.id}.html"><strong>${esc(p.title)}</strong><span>${esc(snippet)}…</span></a>`;
    }).join('') : '<p class="search-empty">No matching pages. Try a class name, function or topic.</p>';
  }
  const openSearch = () => { if(mobileMenu.open) mobileMenu.close(); if(!search.open) search.showModal(); results(); searchInput.focus(); };
  document.querySelector('.search-trigger').addEventListener('click',openSearch);
  search.querySelector('button').addEventListener('click',() => search.close()); searchInput.addEventListener('input',results);
  search.addEventListener('click',e => { if(e.target === search) { const r=search.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)search.close(); } });
  searchInput.addEventListener('keydown',e => {
    if(e.key === 'Escape') { e.preventDefault(); search.close(); return; }
    const links = [...resultBox.querySelectorAll('a')];
    if(['ArrowDown','ArrowUp'].includes(e.key) && links.length) { e.preventDefault(); selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length; links.forEach((a,i) => a.setAttribute('aria-selected',String(i === selected))); links[selected].scrollIntoView({block:'nearest'}); }
    if(e.key === 'Enter' && links[selected]) { e.preventDefault(); links[selected].click(); }
  });
  document.addEventListener('keydown',e => {
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    if(e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); openSearch(); }
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting)document.querySelectorAll('.page-toc a').forEach(a => a.classList.toggle('active',a.hash === `#${entry.target.id}`));
    }),{rootMargin:'-80px 0px -65% 0px'});
    headings.forEach(h => observer.observe(h));
  }
})();
