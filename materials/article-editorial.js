const root = document.querySelector('[data-editorial]');
if (root) {
  const article = root.querySelector('[data-reading-body]');
  const progress = root.querySelector('[data-reading-progress]');
  const percent = root.querySelector('[data-reading-percent]');
  const links = [...root.querySelectorAll('[data-toc] a')];
  const sections = [...article.querySelectorAll('section[id]')];
  let queued = false;
  const update = () => {
    queued = false;
    const rect = article.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    const value = Math.max(0, Math.min(100, Math.round(-rect.top / distance * 100)));
    progress.value = value;
    percent.textContent = `${value}%`;
    const active = sections.filter(section => section.getBoundingClientRect().top <= 150).at(-1) || sections[0];
    for (const link of links) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(article);
  update();
  for (const link of links) link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details) details.open = false;
  });
  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];
  const title = document.querySelector('h1').textContent.trim();
  const urls = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${canonical}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`,
  };
  root.querySelectorAll('[data-ed-share]').forEach(link => link.href = urls[link.dataset.edShare]);
  const status = root.querySelector('[data-copy-status]');
  root.querySelector('[data-ed-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(canonical); status.textContent = 'Ссылка скопирована'; }
    catch { status.textContent = 'Скопируйте адрес страницы из строки браузера.'; }
  });
  const form = document.querySelector('#estimate [data-reset-form]');
  if (form) {
    form.elements.source.value = 'article-ai-development';
    form.elements.message.placeholder = 'Что хотите создать, какие интеграции нужны, есть ли прототип?';
  }
}
