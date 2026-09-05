// Only the Telegram case: deliberate, manual exploration with independent role state.
(() => {
 const root = document.querySelector('.telegram-refined');
 if (!root) return;
 const inclusion = root.querySelector('.product-includes');
 const desktop = window.matchMedia('(min-width: 768px)');
 let mobileOpen = false;
 if (inclusion) {
  const syncInclusion = () => { inclusion.open = desktop.matches || mobileOpen; };
  inclusion.addEventListener('click', event => {
   if (!event.target.closest('summary')) return;
   if (desktop.matches) event.preventDefault();
   else mobileOpen = !inclusion.open;
  });
  desktop.addEventListener('change', syncInclusion);
  syncInclusion();
 }
 const roles = [...root.querySelectorAll('[data-telegram-role]')];
 const panels = [...root.querySelectorAll('[data-telegram-slider]')];
 roles.forEach(button => button.addEventListener('click', () => {
  roles.forEach(role => role.setAttribute('aria-pressed', String(role === button)));
  panels.forEach(panel => { panel.hidden = panel.id !== button.getAttribute('aria-controls'); });
 }));
 panels.forEach((panel, n) => {
  panel.hidden = n !== 0;
  const slides = [...panel.querySelectorAll('[data-product-slide]')];
  const copies = [...panel.querySelectorAll('[data-product-copy]')];
  const output = panel.querySelector('[data-product-current]');
  let active = 0;
  const show = i => {
   active = (i + slides.length) % slides.length;
   slides.forEach((slide, j) => { slide.classList.toggle('is-active',j === active); slide.setAttribute('aria-hidden',String(j !== active)); });
   copies.forEach((copy, j) => copy.classList.toggle('is-active',j === active));
   output.textContent = String(active+1).padStart(2,'0');
  };
  panel.querySelector('[data-product-prev]').addEventListener('click',()=>show(active-1));
  panel.querySelector('[data-product-next]').addEventListener('click',()=>show(active+1));
  panel.querySelector('.workflow-controls').setAttribute('aria-live','polite');
  show(0);
 });
})();
