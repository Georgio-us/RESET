import { uiCopy } from './ui-copy.js';

const locale = document.documentElement.lang in uiCopy ? document.documentElement.lang : 'ru';
const copy = uiCopy[locale];
const dialog = document.querySelector('.reset-dialog');
let trigger;
const track = (event, data = {}) => {
  if (localStorage.getItem('reset-analytics-consent') === 'granted') window.gtag?.('event', event, { language: locale, ...data });
};
const openContact = (element) => {
  if (!dialog || dialog.open) return;
  trigger = element;
  const form = dialog.querySelector('form');
  if (form.dataset.sent) form.reset();
  // Preserve an unfinished enquiry when a visitor closes and reopens the dialog.
  form.elements.source.value = element.dataset.leadSource || element.closest('header,footer,section')?.id || 'cta';
  dialog.showModal();
  form.elements.name.focus({ preventScroll: true });
  track('lead_form_open', { lead_source: form.elements.source.value });
};
document.addEventListener('click', event => {
  const element = event.target.closest('[data-lead-modal],[data-reset-contact],a[href]');
  if (!element || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = element.href ? new URL(element.href, location.href) : null;
  const contactLink = url?.origin === location.origin && url.hash === '#contact';
  if (element.matches('[data-lead-modal],[data-reset-contact]') || contactLink) {
    if (!dialog) return;
    event.preventDefault();
    document.querySelector('.reset-menu')?.removeAttribute('open');
    openContact(element);
  }
});
dialog?.querySelector('.reset-dialog-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog?.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
document.querySelectorAll('.reset-menu a').forEach(link => link.addEventListener('click', () => link.closest('details').removeAttribute('open')));
document.addEventListener('keydown', event => {
  const menu = document.querySelector('.reset-menu[open]');
  if (event.key === 'Escape' && menu) { menu.removeAttribute('open'); menu.querySelector('summary').focus(); }
});

document.querySelectorAll('[data-reset-form]').forEach(form => {
  const method = form.elements.contactMethod;
  const contact = form.elements.contact;
  const status = form.querySelector('.reset-form-status');
  const button = form.querySelector('[type=submit]');
  const originalButton = button.innerHTML;
  form.addEventListener('reset', () => {
    delete form.dataset.sent;
    delete form.dataset.started;
    button.disabled = false;
    button.innerHTML = originalButton;
    status.textContent = '';
    status.removeAttribute('data-error');
    queueMicrotask(configure);
  });
  const configure = () => {
    const value = method.value;
    contact.type = value === 'email' ? 'email' : value === 'telegram' ? 'text' : 'tel';
    contact.inputMode = value === 'email' ? 'email' : value === 'telegram' ? 'text' : 'tel';
    contact.autocomplete = value === 'email' ? 'email' : value === 'telegram' ? 'off' : 'tel';
    contact.placeholder = value === 'email' ? 'name@company.com' : value === 'telegram' ? copy.telegramHint : ['ru','uk'].includes(locale) ? '+380 67 000 0000' : '+34 600 000 000';
    contact.setCustomValidity('');
  };
  configure();
  method.addEventListener('change', configure);
  contact.addEventListener('input', () => contact.setCustomValidity(''));
  form.addEventListener('input', () => {
    if (!form.dataset.started) { form.dataset.started = 'true'; track('form_start', { lead_source: form.elements.source.value }); }
  });
  form.addEventListener('focusin', event => {
    const field = event.target.closest('input,select,textarea');
    if (!field || field.dataset.tracked) return;
    field.dataset.tracked = 'true';
    track('form_field_interaction', { lead_source:form.elements.source.value, field_name:field.name });
  });
  form.addEventListener('invalid', event => track('form_validation_error', { lead_source:form.elements.source.value, field_name:event.target.name }), true);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.submitting || form.dataset.sent) return;
    contact.value = contact.value.trim();
    if (!contact.value) contact.setCustomValidity(copy.required);
    if (!form.reportValidity()) return;
    form.dataset.submitting = 'true';
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = copy.sending;
    status.textContent = '';
    status.removeAttribute('data-error');
    const params = new URLSearchParams(location.search);
    const payload = {
      ...Object.fromEntries(new FormData(form)), locale, page: location.href,
      client: { device: matchMedia('(max-width:767px)').matches ? 'Мобильное устройство' : 'Компьютер', screen: `${screen.width}×${screen.height}`, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, referrer: document.referrer, utm: Object.fromEntries([...params].filter(([key]) => /^utm_(source|medium|campaign|term|content)$/.test(key))) },
    };
    try {
      const response = await fetch('/api/leads', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('lead-request-failed');
      form.dataset.sent = 'true';
      button.textContent = copy.success;
      status.textContent = copy.success;
      track('generate_lead', { lead_source:payload.source, contact_method:payload.contactMethod });
      window.dispatchEvent(new CustomEvent('reset:lead-submitted', { detail:payload }));
    } catch {
      status.dataset.error = 'true';
      status.textContent = copy.error;
      button.innerHTML = original;
      button.disabled = false;
      track('form_submit_error', { lead_source:payload.source, error_type:'request' });
    } finally { delete form.dataset.submitting; }
  });
});

// Older catalog templates use a CSS text arrow. Replace it with the shared SVG.
document.querySelectorAll('.section-catalog-card li a').forEach(link => {
  if (!link.querySelector('svg')) link.insertAdjacentHTML('beforeend', '<svg class="reset-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>');
});
