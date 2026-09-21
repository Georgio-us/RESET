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
