(() => {
  'use strict';

  window.createArticleOutlines = (headings, icon, esc) => {
    const groups = [];
    headings.forEach(heading => {
      const entry = {id: heading.id, title: heading.textContent, children: []};
      if (heading.tagName === 'H2' || !groups.length) groups.push(entry);
      else groups[groups.length - 1].children.push(entry);
    });
    const hosts = [];
    const desktop = document.getElementById('page-toc');
    if (!headings.length) { desktop.hidden = true; return {update() {}}; }

    function mount(host, name) {
      const link = (entry, child = false) => `<a class="toc-link${child ? ' toc-child-link' : ''}" href="#${encodeURIComponent(entry.id)}" data-heading="${esc(entry.id)}">${esc(entry.title)}</a>`;
      host.innerHTML = `<nav class="article-outline${name === 'desktop' ? ' page-toc' : ''}" aria-label="On this page">
        <div class="toc-header"><p class="toc-label">In this article</p><span class="toc-position" aria-label="Current section"></span></div>
        <div class="toc-search">${icon('search')}<input type="search" aria-label="Filter sections in this article" placeholder="Find a section" autocomplete="off"></div>
        <div class="toc-toolbar"><span class="toc-count" role="status"></span><button type="button" class="toc-expand">Expand all</button></div>
        <div class="toc-list" tabindex="0" aria-label="Article sections">${groups.map((group, index) => `<div class="toc-section" data-section="${esc(group.id)}">
          <div class="toc-row">${link(group)}${group.children.length ? `<button type="button" class="toc-toggle" aria-label="Show subsections: ${esc(group.title)}" aria-controls="toc-${name}-${index}" aria-expanded="false">${icon('down')}</button>` : ''}</div>
          ${group.children.length ? `<div class="toc-children" id="toc-${name}-${index}" hidden>${group.children.map(child => link(child, true)).join('')}</div>` : ''}
        </div>`).join('')}<p class="toc-empty" hidden>No sections found.</p></div>
        <a class="toc-back" href="#top">Back to top ${icon('right')}</a>
      </nav>`;
      const nav = host.querySelector('.article-outline');
      const input = nav.querySelector('input');
      const sections = [...nav.querySelectorAll('.toc-section')];
      const expand = nav.querySelector('.toc-expand');
      const toggles = [...nav.querySelectorAll('.toc-toggle')];
      const expanded = new Set();
      let currentId = '', autoExpanded = '';

      function revealActive() {
        const list = nav.querySelector('.toc-list'), active = nav.querySelector('.toc-link.active');
        if (!active?.getClientRects().length || !list.clientHeight) return;
        const bounds = list.getBoundingClientRect(), target = active.getBoundingClientRect();
        if (target.top < bounds.top + 8) list.scrollTop += target.top - bounds.top - 8;
        else if (target.bottom > bounds.bottom - 8) list.scrollTop += target.bottom - bounds.bottom + 8;
      }

      function render() {
        const query = input.value.trim().toLowerCase();
        let matches = 0;
        sections.forEach((section, index) => {
          const group = groups[index];
          const parentMatch = group.title.toLowerCase().includes(query);
          const children = [...section.querySelectorAll('.toc-child-link')];
          children.forEach((child, i) => {
            const match = group.children[i].title.toLowerCase().includes(query);
            child.hidden = Boolean(query) && !parentMatch && !match;
            if (match) matches++;
          });
          if (parentMatch) matches++;
          section.hidden = Boolean(query) && !parentMatch && children.every(child => child.hidden);
          const open = Boolean(query) || expanded.has(group.id);
          const toggle = section.querySelector('.toc-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} subsections: ${group.title}`);
            toggle.disabled = Boolean(query);
            section.querySelector('.toc-children').hidden = !open;
          }
        });
        nav.querySelector('.toc-empty').hidden = !query || matches > 0;
        const countText = query
          ? `${matches} ${matches === 1 ? 'match' : 'matches'}`
          : `${headings.length} sections`;
        const count = nav.querySelector('.toc-count');
        if (count.textContent !== countText) count.textContent = countText;
        expand.hidden = !toggles.length || Boolean(query);
        expand.textContent = toggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true') ? 'Collapse all' : 'Expand all';
      }

      toggles.forEach(toggle => toggle.addEventListener('click', () => {
        const id = toggle.closest('.toc-section').dataset.section;
        if (autoExpanded === id) autoExpanded = '';
        expanded.has(id) ? expanded.delete(id) : expanded.add(id);
        render();
      }));
      expand.addEventListener('click', () => {
        autoExpanded = '';
        const collapse = toggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true');
        groups.forEach(group => { if (group.children.length) collapse ? expanded.delete(group.id) : expanded.add(group.id); });
        render();
      });
      input.addEventListener('input', render);
      input.addEventListener('keydown', event => {
        if (event.key === 'Escape' && input.value) {
          event.preventDefault(); event.stopPropagation(); input.value = ''; render();
        }
        if (event.key === 'ArrowDown' || event.key === 'Enter') {
          const first = [...nav.querySelectorAll('.toc-link')].find(a => a.getClientRects().length && a.textContent.toLowerCase().includes(input.value.trim().toLowerCase()));
          if (first) { event.preventDefault(); first.focus(); }
        }
      });
      render();
      const controller = {
        reveal: revealActive,
        update(heading, index) {
          const changed = currentId !== heading.id;
          currentId = heading.id;
          const group = groups.find(group => group.id === heading.id || group.children.some(child => child.id === heading.id));
          if (changed && group && autoExpanded !== group.id) {
            if (autoExpanded) expanded.delete(autoExpanded);
            autoExpanded = expanded.has(group.id) ? '' : group.id;
            expanded.add(group.id);
          }
          nav.querySelector('.toc-position').textContent = `${index + 1} / ${headings.length}`;
          nav.querySelector('.toc-position').setAttribute('aria-label', `Section ${index + 1} of ${headings.length}`);
          sections.forEach(section => {
            let contains = false;
            section.querySelectorAll('.toc-link').forEach(a => {
              const selected = a.dataset.heading === heading.id;
              a.classList.toggle('active', selected);
              if (selected) { a.setAttribute('aria-current', 'location'); contains = true; }
              else a.removeAttribute('aria-current');
            });
            section.classList.toggle('contains-current', contains);
          });
          if (!changed) return;
          render();
          revealActive();
        }
      };
      hosts.push(controller);
      return controller;
    }

    mount(desktop, 'desktop');
    const mobile = document.createElement('details');
    mobile.className = 'mobile-toc';
    mobile.innerHTML = '<summary>In this article</summary><div class="mobile-outline"></div>';
    document.querySelector('article').before(mobile);
    const mobileController = mount(mobile.querySelector('.mobile-outline'), 'mobile');
    mobile.addEventListener('toggle', () => { if (mobile.open) mobileController.reveal(); });
    return {
      update(heading, index) { hosts.forEach(host => host.update(heading, index)); },
      reveal() { hosts.forEach(host => host.reveal()); }
    };
  };
})();
