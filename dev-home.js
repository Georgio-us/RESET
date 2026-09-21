(() => {
  const showcase = document.querySelector('.dev-showcase');
  if (!showcase) return;
  const slides = [...showcase.querySelectorAll('[data-feature]')];
  const selectors = [...showcase.querySelectorAll('[data-feature-select]')];
  let selected = 0;
  function show(index) {
    selected = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== selected; });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
    showcase.querySelector('.dev-feature-tabs')?.setAttribute('data-feature-count', `${String(selected + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`);
    showcase.querySelector('[data-feature-status]').textContent = `${selected + 1} / ${slides.length}: ${slides[selected].querySelector('h2').textContent}`;
    if (typeof trackAnalytics === 'function') trackAnalytics('case_preview_select', { case_name: selectors[selected].textContent });
  }
  selectors.forEach((button, i) => button.addEventListener('click', () => show(i)));
  showcase.querySelector('[data-feature-prev]').addEventListener('click', () => show(selected - 1));
  showcase.querySelector('[data-feature-next]').addEventListener('click', () => show(selected + 1));
  showcase.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touch = null;
  showcase.addEventListener('touchstart', e => { touch = [e.touches[0].clientX, e.touches[0].clientY]; }, {passive:true});
  showcase.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch[0], dy = e.changedTouches[0].clientY - touch[1];
    touch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(selected + (dx < 0 ? 1 : -1));
  }, {passive:true});
  const filters = [...document.querySelectorAll('[data-work-filter]')];
  const cards = [...document.querySelectorAll('[data-work-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.workFilter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => {
      const categories = card.dataset.workCategory.split(/\s+/).filter(Boolean);
      card.hidden = category !== 'all' && !categories.includes(category);
    });
    document.querySelector('[data-work-status]').textContent = `${button.textContent}: ${cards.filter(card => !card.hidden).length}`;
    if (typeof trackAnalytics === 'function') trackAnalytics('case_filter', { category });
  }));
  document.querySelectorAll('[data-hero-filter]').forEach(link => link.addEventListener('click', () => {
    filters.find(button => button.dataset.workFilter === link.dataset.heroFilter)?.click();
  }));
  document.querySelectorAll('[data-work-link]').forEach(link => link.addEventListener('click', () => {
    if (typeof trackAnalytics === 'function') trackAnalytics('case_open', { case_name: link.dataset.workLink, cta_location: link.closest('.dev-showcase') ? 'hero' : 'portfolio' });
  }));
  document.querySelectorAll('.dev-mobile-menu a').forEach(link => link.addEventListener('click', () => { link.closest('details').open = false; }));
})();
