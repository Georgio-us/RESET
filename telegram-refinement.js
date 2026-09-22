// VIA Properties: switch between the two complete product scenarios.
(() => {
  const root = document.querySelector('.telegram-refined');
  if (!root) return;

  const roles = [...root.querySelectorAll('[data-telegram-role]')];
  const panels = [...root.querySelectorAll('[data-telegram-slider]')];
  if (!roles.length || !panels.length) return;

  const showRole = (button) => {
    const targetId = button.getAttribute('aria-controls');
    roles.forEach((role) => role.setAttribute('aria-pressed', String(role === button)));
    panels.forEach((panel) => {
      panel.hidden = panel.id !== targetId;
    });
  };

  roles.forEach((button) => button.addEventListener('click', () => showRole(button)));
  showRole(roles.find((button) => button.getAttribute('aria-pressed') === 'true') || roles[0]);
})();

// Keep each screenshot paired with its explanation; advance only on user input.
(() => {
  document.querySelectorAll('.telegram-reviewed [data-telegram-slider]').forEach(panel => {
    const slides = [...panel.querySelectorAll('[data-product-slide]')];
    const copies = [...panel.querySelectorAll('[data-product-copy]')];
    const counter = panel.querySelector('[data-product-current]');
    let active = 0;
    const show = index => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === active);
        slide.setAttribute('aria-hidden', String(i !== active));
      });
      copies.forEach((copy, i) => copy.classList.toggle('is-active', i === active));
      counter.textContent = String(active + 1).padStart(2, '0');
    };
    counter.parentElement.setAttribute('aria-live', 'polite');
    panel.querySelector('[data-product-prev]').addEventListener('click', () => show(active - 1));
    panel.querySelector('[data-product-next]').addEventListener('click', () => show(active + 1));
    show(0);
  });
})();
