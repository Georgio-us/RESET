const routeLocale = location.pathname.match(/^\/(ru|uk|en|es)(?:\/|$)/)?.[1] || 'ru';
const routePath = location.pathname.replace(/^\/(?:ru|uk|en|es)(?=\/|$)/, '').replace(/index\.html$/, '').replace(/\.html$/, '/') || '/';

if (document.body.classList.contains('case-page') && !document.querySelector('link[href$="typography-tokens.css"]')) {
  const typographyStyles = document.createElement('link');
  typographyStyles.rel = 'stylesheet';
  typographyStyles.href = '../typography-tokens.css';
  document.head.append(typographyStyles);
}

if (!document.querySelector('link[rel="canonical"]')) {
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = `/${routeLocale}${routePath}`;
  document.head.append(canonical);
  ['ru', 'uk', 'en', 'es'].forEach((language) => {
    const alternate = document.createElement('link');
    alternate.rel = 'alternate'; alternate.hreflang = language; alternate.href = `/${language}${routePath}`;
    document.head.append(alternate);
  });
  const defaultAlternate = document.createElement('link');
  defaultAlternate.rel = 'alternate'; defaultAlternate.hreflang = 'x-default'; defaultAlternate.href = `/ru${routePath}`;
  document.head.append(defaultAlternate);
}

if ((new URLSearchParams(location.search).get('lang') === 'uk' || /^\/uk(?:\/|$)/.test(location.pathname)) && !document.querySelector('script[src$="i18n.js"]')) {
  const i18nScript = document.createElement('script');
  i18nScript.src = location.pathname.includes('/cases/') ? '../i18n.js' : 'i18n.js';
  i18nScript.defer = true;
  document.head.append(i18nScript);
}

const tabs = document.querySelectorAll('.navigator-tab');
const panels = document.querySelectorAll('.navigator-panel');
const navigatorPrevious = document.querySelector('[data-navigator-prev]');
const navigatorNext = document.querySelector('[data-navigator-next]');

const setActiveNavigatorTab = (tab, shouldScroll = false) => {
  const target = tab.dataset.caseTarget;
  tabs.forEach((item) => {
    item.classList.toggle('is-active', item === tab);
    item.setAttribute('aria-selected', String(item === tab));
  });
  panels.forEach((panel) => {
    const active = panel.dataset.casePanel === target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
  if (shouldScroll) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveNavigatorTab(tab, true));
});

const moveNavigatorTab = (offset) => {
  const activeIndex = Array.from(tabs).findIndex((tab) => tab.classList.contains('is-active'));
  const nextIndex = (activeIndex + offset + tabs.length) % tabs.length;
  setActiveNavigatorTab(tabs[nextIndex], true);
};

navigatorPrevious?.addEventListener('click', () => moveNavigatorTab(-1));
navigatorNext?.addEventListener('click', () => moveNavigatorTab(1));

const testimonials = {
  shepit: { quote: '«RESET помог собрать рабочую digital-систему для проекта: сайт, рекламу, аналитику и CRM в единой логике.»', name: 'Алексей', role: 'SHEPIT HOUSE', index: '01 / 06' },
  factor: { quote: '«Запрос на рекламу стал началом более важной работы: увидели слабые места сайта, соцсетей и обработки заявок. Теперь закрываем разрыв между лидом и продажей.»', name: 'Вадим', role: 'Агентство «Фактор» · Meta Ads и консалтинг продаж', index: '02 / 06' },
  estyle: { quote: '«Теперь я чётко понимаю, что происходит с SEO, Google и всеми направлениями, в которых мы работаем. Мы решили технические ограничения и собрали все доступы в одно место.»', name: 'Светлана', role: 'Estyle Properties Spain · AI / SEO / Mediaelx', index: '03 / 06' },
  nivellux: { quote: '«Мы пришли не просто за сайтом. RESET помог упаковать компанию: от названия и позиционирования до рекламы, кейсов и понятного направления роста.»', name: 'Богдан', role: 'NIVELLUX · строительство и ремонты / Валенсия', index: '04 / 06' },
  dominant: { quote: '«Для выхода на рынок Испании мы собрали не отдельный инструмент, а рабочую основу: базу девелоперов, процессы команды, партнёрства и знания в одном пространстве.»', name: 'Анастасия', role: 'Dominant Spain · международное направление', index: '05 / 06' },
  delmar: { quote: '«Мини-приложение стало для каждого агента своим сайтом в кармане: подборки отправляются за секунды, а Telegram превращается в самостоятельный канал работы с аудиторией.»', name: 'Юлия', role: 'DELMAR · Telegram Mini App', index: '06 / 06' },
};

const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialQuote = document.querySelector('.testimonial-quote');
const testimonialName = document.querySelector('.testimonial-name');
const testimonialRole = document.querySelector('.testimonial-role');
const testimonialIndex = document.querySelector('.testimonial-index');

testimonialItems.forEach((item) => {
  item.addEventListener('click', () => {
    const testimonial = testimonials[item.dataset.testimonial];
    if (!testimonial) return;
    testimonialQuote.textContent = testimonial.quote;
    testimonialName.textContent = testimonial.name;
    testimonialRole.textContent = testimonial.role;
    testimonialIndex.textContent = testimonial.index;
    testimonialItems.forEach((entry) => entry.classList.toggle('is-selected', entry === item));
  });
});

const leadModal = document.querySelector('#lead-modal');
const leadModalForm = leadModal?.querySelector('[data-lead-form]');
const leadModalContent = leadModal?.querySelector('[data-lead-modal-content]');
const leadModalSuccess = leadModal?.querySelector('[data-lead-modal-success]');
let leadModalTrigger = null;

const leadCountries = {
  ua: { prefix: '+38', flag: '🇺🇦' },
  es: { prefix: '+34', flag: '🇪🇸' },
  other: { prefix: '+1', flag: '🌐' },
};

const setLeadCountry = (countryCode) => {
  if (!leadModalForm) return;
  const country = leadCountries[countryCode] || leadCountries.ua;
  leadModalForm.elements.countryCode.value = countryCode in leadCountries ? countryCode : 'ua';
  leadModal.querySelector('[data-country-flag]').textContent = country.flag;
  leadModal.querySelector('[data-country-prefix]').textContent = country.prefix;
};

const setLeadContactMethod = (method) => {
  if (!leadModal || !leadModalForm) return;
  const isEmail = method === 'email';
  leadModal.querySelectorAll('[data-contact-method]').forEach((button) => {
    const active = button.dataset.contactMethod === method;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  leadModal.querySelector('[data-country-field]').hidden = isEmail;
  const contact = leadModalForm.elements.contact;
  contact.type = isEmail ? 'email' : 'tel';
  contact.autocomplete = isEmail ? 'email' : 'tel';
  contact.inputMode = isEmail ? 'email' : 'tel';
  contact.placeholder = isEmail ? 'you@email.com' : 'Номер телефона';
  leadModalForm.dataset.contactMethod = method;
};

const contactSettings = {
  phone: { type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: '+38 0XX XXX XX XX' },
  telegram: { type: 'text', autocomplete: 'off', inputmode: 'text', placeholder: '@username или номер телефона' },
  whatsapp: { type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: '+38 0XX XXX XX XX' },
  email: { type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: 'name@company.com' },
};

const configureContactField = (form) => {
  const method = form.querySelector('[name="contactMethod"]');
  const contact = form.querySelector('[name="contact"]');
  if (!method || !contact) return;
  const settings = contactSettings[method.value] || contactSettings.phone;
  Object.entries(settings).forEach(([property, value]) => { contact[property] = value; });
};

const serializeLead = (form) => Object.fromEntries(new FormData(form).entries());

const getClientContext = () => {
  const parameters = new URLSearchParams(location.search);
  const utm = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    .map((key) => [key, parameters.get(key)])
    .filter(([, item]) => item));
  const mobile = matchMedia('(max-width: 767px)').matches;
  return {
    device: mobile ? 'Мобильное устройство' : 'Компьютер',
    screen: `${window.screen.width}×${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || '',
    utm,
  };
};

const submitLead = async (form) => {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const payload = {
    ...serializeLead(form),
    contactMethod: form.dataset.contactMethod || form.elements.contactMethod?.value || 'phone',
    locale: routeLocale,
    page: location.href,
    client: getClientContext(),
  };
  const submit = form.querySelector('.diagnostic-submit');
  const error = form.querySelector('.form-error');
  const initialButton = submit.innerHTML;
  error.textContent = '';
  submit.disabled = true;
  submit.textContent = 'Отправляем…';

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || 'Не удалось отправить заявку.');
    window.dispatchEvent(new CustomEvent('reset:lead-submitted', { detail: payload }));
    form.classList.add('is-sent');
    submit.innerHTML = 'Запрос принят <b aria-hidden="true">✓</b>';
    if (form === leadModalForm) {
      leadModalContent.hidden = true;
      leadModalSuccess.hidden = false;
      leadModal.querySelector('[data-lead-close]')?.focus();
    }
  } catch (submitError) {
    error.textContent = submitError.message || 'Не удалось отправить заявку. Попробуйте ещё раз.';
    submit.disabled = false;
    submit.innerHTML = initialButton;
  }
};

document.querySelectorAll('.diagnostic-form, .lead-form').forEach((form) => {
  configureContactField(form);
  form.querySelector('[name="contactMethod"]')?.addEventListener('change', () => configureContactField(form));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLead(form);
  });
});

const closeLeadModal = () => {
  if (!leadModal) return;
  leadModal.hidden = true;
  leadModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lead-modal-open');
  leadModalTrigger?.focus();
};

const openLeadModal = (trigger) => {
  if (!leadModal || !leadModalForm) return;
  leadModalTrigger = trigger;
  leadModalForm.reset();
  leadModalForm.classList.remove('is-sent');
  leadModalContent.hidden = false;
  leadModalSuccess.hidden = true;
  leadModalForm.querySelector('.form-error').textContent = '';
  const submit = leadModalForm.querySelector('.diagnostic-submit');
  submit.innerHTML = 'Отправить запрос <b aria-hidden="true">↗</b>';
  submit.disabled = false;
  leadModalForm.elements.source.value = trigger.dataset.leadSource || 'cta';
  setLeadCountry(routeLocale === 'es' ? 'es' : 'ua');
  setLeadContactMethod('phone');
  leadModal.hidden = false;
  leadModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lead-modal-open');
  requestAnimationFrame(() => leadModalForm.elements.name.focus());
};

document.querySelectorAll('[data-lead-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => openLeadModal(trigger));
});

leadModal?.querySelectorAll('[data-contact-method]').forEach((button) => {
  button.addEventListener('click', () => setLeadContactMethod(button.dataset.contactMethod));
});

leadModal?.querySelector('[data-country-toggle]')?.addEventListener('click', () => {
  const menu = leadModal.querySelector('[data-country-menu]');
  const toggle = leadModal.querySelector('[data-country-toggle]');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  menu.hidden = expanded;
  toggle.setAttribute('aria-expanded', String(!expanded));
});

leadModal?.querySelectorAll('[data-country-code]').forEach((button) => {
  button.addEventListener('click', () => {
    setLeadCountry(button.dataset.countryCode);
    leadModal.querySelector('[data-country-menu]').hidden = true;
    leadModal.querySelector('[data-country-toggle]').setAttribute('aria-expanded', 'false');
    leadModalForm.elements.contact.focus();
  });
});

document.addEventListener('click', (event) => {
  const country = leadModal?.querySelector('.lead-country');
  if (country && !country.contains(event.target)) {
    leadModal.querySelector('[data-country-menu]').hidden = true;
    leadModal.querySelector('[data-country-toggle]').setAttribute('aria-expanded', 'false');
  }
});

leadModal?.querySelectorAll('[data-lead-close]').forEach((trigger) => {
  trigger.addEventListener('click', closeLeadModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && leadModal && !leadModal.hidden) closeLeadModal();
});

const caseStudiesSlider = document.querySelector('[data-case-studies-slider]');
const shepitAssets = document.querySelector('#shepit-case-title');
const factorAssets = document.querySelector('#an-factor-case-title');

const shepitStoryTitles = {
  strategy: 'Сначала собрали логику<br /><em>запуска проекта.</em>',
  site: 'Создание продающего сайта<br />и <em>мобильной версии.</em>',
  'google-ads': 'Настройка и запуск<br /><em>Google Ads.</em>',
  'meta-ads': 'Настройка и запуск<br /><em>Meta Ads.</em>',
  analytics: 'Сквозная аналитика:<br /><em>от рекламы до заявки.</em>',
  crm: 'CRM-система<br />и <em>обработка лидов.</em>',
  summary: 'Результат комплексного<br /><em>запуска проекта.</em>',
};

if (shepitAssets) {
  Object.entries(shepitStoryTitles).forEach(([sectionId, title]) => {
    const heading = document.querySelector(`#${sectionId} h2`);
    if (heading) heading.innerHTML = title;
  });

  const strategyIntro = document.querySelector('#strategy .case-story-copy p');
  const strategyGrid = document.querySelector('#strategy .strategy-principles');

  if (strategyIntro && strategyGrid) {
    strategyIntro.textContent = 'На старте не было единой системы: продукт существовал отдельно, а сайт, реклама и работа с обращениями ещё не были связаны. Мы изучили локальных конкурентов, их позиционирование, сайты, офферы и рекламную подачу — затем определили, как представить проект, откуда приводить спрос и как передавать его в работу отдела продаж.';
    strategyGrid.innerHTML = `
    <article><span>01 / ПОЗИЦИОНИРОВАНИЕ</span><h3>Приватная жилая среда рядом с Киевом</h3><p>Камерный проект на 8 домов: природа, приватность, современная архитектура и комфортная дистанция до города.</p></article>
    <article><span>02 / ПРОДУКТ</span><h3>Предложение, которое легко сравнить и понять</h3><p>Форматы домов, площадь, планировки, стоимость, рассрочка и преимущества каждого варианта.</p></article>
    <article><span>03 / ПРИВЛЕЧЕНИЕ</span><h3>Разделили сформированный и потенциальный спрос</h3><p>Google Ads работает с готовым намерением купить дом. Meta Ads формирует интерес через офферы и визуальные сценарии.</p></article>
    <article class="strategy-priority"><span>04 / ПРОДАЖИ</span><h3>Связали рекламу, сайт, аналитику и CRM</h3><p>Каждое обращение фиксируется, передаётся менеджеру и проходит понятную воронку до встречи и сделки.</p></article>`;
  }
}

if (false && shepitAssets) {
  const assetRoot = 'shepit_assets/';
  document.querySelector('.site-devices').innerHTML = `<figure class="case-asset site-asset-desktop"><img src="${assetRoot}website.png" alt="Десктопная версия сайта SHEPIT HOUSE" /><figcaption>ДЕСКТОПНАЯ ВЕРСИЯ САЙТА</figcaption></figure><figure class="case-asset site-asset-mobile"><img src="${assetRoot}mobile.png" alt="Мобильная версия сайта SHEPIT HOUSE" /><figcaption>МОБИЛЬНАЯ ВЕРСИЯ</figcaption></figure>`;
  document.querySelector('.performance-board').innerHTML = `<figure class="case-asset asset-wide"><img src="${assetRoot}google_ads_general.png" alt="Показатели рекламных кампаний Google Ads" /><figcaption>GOOGLE ADS: РАСХОД, КЛИКИ И КОНВЕРСИИ</figcaption></figure><div class="asset-pair"><figure class="case-asset"><img src="${assetRoot}google_ads_keys.png" alt="Коммерческие поисковые запросы Google Ads и CTR" /><figcaption>КОММЕРЧЕСКИЕ ЗАПРОСЫ И CTR</figcaption></figure><figure class="case-asset"><img src="${assetRoot}google_ads_ad1.png" alt="Объявления Google Ads и CTR" /><figcaption>ОБЪЯВЛЕНИЯ И CTR</figcaption></figure><figure class="case-asset"><img src="${assetRoot}google_ads_ad2.png" alt="Дополнительные объявления Google Ads" /><figcaption>ГРУППЫ ОБЪЯВЛЕНИЙ</figcaption></figure></div>`;
  document.querySelector('.creative-rail').innerHTML = `<figure class="case-asset meta-dashboard"><img src="${assetRoot}meta_ads_general.png" alt="Результаты рекламных кампаний Meta Ads" /><figcaption>META ADS: РЕЗУЛЬТАТЫ КАМПАНИЙ, ЦЕНА ЛИДА 257 ГРН</figcaption></figure><div class="creative-assets">${[1,2,3,4].map((index) => `<figure class="case-asset"><img src="${assetRoot}meta_ads_creo${index}.png" alt="Рекламный креатив Meta Ads ${index}" /><figcaption>КРЕАТИВ ${String(index).padStart(2, '0')}</figcaption></figure>`).join('')}</div>`;
  document.querySelector('.analytics-map').innerHTML = `<span>05 / СКВОЗНАЯ АНАЛИТИКА GOOGLE ANALYTICS 4</span><div class="analytics-assets"><figure class="case-asset"><img src="${assetRoot}GA4_general.png" alt="Общие показатели пользователей Google Analytics 4" /><figcaption>ПОЛЬЗОВАТЕЛИ ЗА ПЕРИОД</figcaption></figure><figure class="case-asset"><img src="${assetRoot}GA4_trafic.png" alt="Источники трафика Google Analytics 4" /><figcaption>ОРГАНИЧЕСКИЙ И РЕКЛАМНЫЙ ТРАФИК</figcaption></figure><figure class="case-asset"><img src="${assetRoot}GA4_pages_view.png" alt="Просмотры страниц сайта в Google Analytics 4" /><figcaption>ПРОСМОТРЫ СТРАНИЦ</figcaption></figure><figure class="case-asset"><img src="${assetRoot}GA4_events.png" alt="Настроенные события Google Analytics 4" /><figcaption>СОБЫТИЯ И ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЕЙ</figcaption></figure></div>`;
  document.querySelector('.crm-flow').outerHTML = `<div class="crm-real"><figure class="case-asset crm-image"><img src="${assetRoot}crm_funnel.png" alt="CRM-воронка SHEPIT HOUSE с размытыми персональными данными" /><figcaption>CRM: АВТОМАТИЧЕСКАЯ ПЕРЕДАЧА ЛИДОВ ИЗ GOOGLE ADS И META ADS</figcaption></figure><div class="crm-principles"><div><b>Новый лид</b><span>нет первого контакта</span></div><div><b>В работе</b><span>контакт и подбор решения</span></div><div><b>Встреча</b><span>намерение и состоявшийся визит</span></div><div><b>Отложенные</b><span>актуализация спроса</span></div><div><b>Бронирование</b><span>следующий этап сделки</span></div><div><b>Успешно</b><span>завершённые сделки</span></div></div></div>`;
  const crmNote = document.querySelector('.crm-note');
  if (crmNote) crmNote.textContent = 'Воронка сделана для ежедневной работы менеджера: лиды автоматически приходят из Google Ads и Meta Ads, а этапы показывают следующий шаг с клиентом. Мы не добавляем статусы без практической функции.';

  const previewButton = (label, asset, alt) => `<button class="case-preview-button" type="button" style="--preview:url('${assetRoot}${asset}')" data-case-preview="${asset}" data-case-preview-alt="${alt}"><b>${label}</b><span>ОТКРЫТЬ ↗</span></button>`;
  document.querySelector('.site-devices').innerHTML = `<div class="visual-summary site-summary"><b>01</b><h3>Сайт объясняет объект<br />и ведёт к выбору дома.</h3><p>Отдельные сценарии для десктопа и мобильного устройства. Структура сайта помогает изучить проект, выбрать дом и оставить обращение.</p><div>${previewButton('Смотреть desktop', 'website.png', 'Десктопная версия сайта SHEPIT HOUSE')}${previewButton('Смотреть mobile', 'mobile.png', 'Мобильная версия сайта SHEPIT HOUSE')}</div></div>`;
  document.querySelector('.performance-board').innerHTML = `<div class="visual-summary ads-summary"><span>GOOGLE ADS / РЕЗУЛЬТАТ</span><div class="summary-stat"><strong>45</strong><b>лидов</b><i>поисковый спрос<br />и коммерческие запросы</i></div><div class="summary-columns"><span>Ключевые слова<br /><b>коммерческие</b></span><span>Объявления<br /><b>по группам спроса</b></span><span>CTR<br /><b>по запросам и объявлениям</b></span></div><div>${previewButton('Смотреть статистику', 'google_ads_general.png', 'Показатели Google Ads')}${previewButton('Смотреть запросы', 'google_ads_keys.png', 'Коммерческие запросы Google Ads')}${previewButton('Смотреть объявления', 'google_ads_ad1.png', 'Объявления Google Ads')}</div></div>`;
  document.querySelector('.creative-rail').innerHTML = `<div class="visual-summary meta-summary"><span>META ADS / РЕЗУЛЬТАТ</span><div class="summary-stat"><strong>257 ₴</strong><b>цена лида</b><i>тестирование офферов,<br />форматов и креативов</i></div><p>Креативы используются как разные точки входа в проект: дом, локация, условия покупки и архитектура.</p><div>${previewButton('Смотреть кабинет Meta Ads', 'meta_ads_general.png', 'Результаты Meta Ads')}${[1,2,3,4].map(i => previewButton(`Креатив ${i}`, `meta_ads_creo${i}.png`, `Креатив Meta Ads ${i}`)).join('')}</div></div>`;
  document.querySelector('.analytics-map').innerHTML = `<div class="visual-summary analytics-summary"><span>05 / GOOGLE ANALYTICS 4</span><h3>Понимаем источник<br />трафика и действия<br />на сайте.</h3><div class="analytics-signals"><b>ПОЛЬЗОВАТЕЛИ</b><b>ОРГАНИЧЕСКИЙ ПОИСК</b><b>CROSS-NETWORK</b><b>ПРОСМОТРЫ СТРАНИЦ</b><b>СОБЫТИЯ</b></div><div>${previewButton('Показатели GA4', 'GA4_general.png', 'Пользователи Google Analytics 4')}${previewButton('Источники трафика', 'GA4_trafic.png', 'Источники трафика GA4')}${previewButton('События', 'GA4_events.png', 'События Google Analytics 4')}</div></div>`;
  document.querySelector('.crm-real').innerHTML = `<div class="visual-summary crm-summary"><span>CRM / ПРИНЦИП ВОРОНКИ</span><h3>Меньше статусов.<br />Понятнее следующий шаг.</h3><p>Лиды из Google Ads и Meta Ads автоматически поступают в CRM. Этапы показывают действие менеджера, а не создают дополнительную отчётность.</p><div class="crm-stages"><b>Новый лид</b><b>В работе</b><b>Встреча</b><b>Отложенные</b><b>Бронирование</b><b>Успешно</b></div><div>${previewButton('Смотреть CRM-воронку', 'crm_funnel.png', 'CRM-воронка SHEPIT HOUSE')}</div></div>`;
  const previewDialog = document.createElement('dialog'); previewDialog.className = 'case-preview-dialog'; previewDialog.innerHTML = '<button type="button" aria-label="Закрыть">×</button><img alt="" />'; document.body.append(previewDialog); previewDialog.querySelector('button').addEventListener('click', () => previewDialog.close()); document.querySelectorAll('[data-case-preview]').forEach((button) => button.addEventListener('click', () => { const image = previewDialog.querySelector('img'); image.src = `${assetRoot}${button.dataset.casePreview}`; image.alt = button.dataset.casePreviewAlt; previewDialog.showModal(); }));
}

if (shepitAssets) {
  const siteVisual = document.querySelector('.site-devices');
  if (siteVisual) siteVisual.innerHTML = `<div class="shepit-product-stage" data-device-slider data-autoplay="1000" aria-label="Версии сайта SHEPIT HOUSE"><i class="product-orbit orbit-one"></i><i class="product-orbit orbit-two"></i><svg class="product-links" viewBox="0 0 1000 520" aria-hidden="true"><path d="M250 260V470H40"/><path d="M610 80V180H805V330"/><circle cx="250" cy="260" r="7"/><circle cx="805" cy="330" r="7"/></svg><figure class="shepit-desktop-preview site-device-slide is-active" data-device-slide data-device-label="Десктопная версия"><img src="shepit_assets/website.png" alt="Десктопная версия сайта SHEPIT HOUSE" /><figcaption>ДЕСКТОПНАЯ ВЕРСИЯ / SHEPIT HOUSE</figcaption></figure><figure class="shepit-mobile-preview site-device-slide" data-device-slide data-device-label="Мобильная / адаптивная версия"><img src="shepit_assets/mobile.png" alt="Мобильная версия сайта SHEPIT HOUSE" /><figcaption>МОБИЛЬНАЯ ВЕРСИЯ / АДАПТИВ</figcaption></figure><div class="site-device-controls" aria-label="Управление слайдером"><span aria-live="polite" data-device-label-output>Мобильная / адаптивная версия</span><button type="button" data-device-next aria-label="Следующая версия"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button></div><aside class="site-product-details"><span>ЧТО СДЕЛАЛИ</span><ul><li>Многостраничный сайт</li><li>Интерактивный генплан</li><li>Каталог домов и карточки объектов</li><li>Планировки и калькулятор рассрочки</li><li>CTA и формы заявок</li></ul></aside><div class="site-product-stats"><b>14+<small>страниц</small></b><b>ДЕСКТОП<small>+ МОБИЛЬНАЯ ВЕРСИЯ</small></b><b>ИНТЕРАКТИВНЫЙ<small>ГЕНПЛАН</small></b><b>ФОРМЫ<small>ЗАЯВОК</small></b></div><span class="site-tech-note">ИНТЕРФЕЙС ПРОДУКТА<br />САЙТ / ПУТЬ ЗАЯВКИ</span></div>`;
  const siteDetails = siteVisual?.querySelector('.site-product-details');
  if (siteDetails) siteDetails.innerHTML = '<span>ЧТО ПОЛУЧИЛ ПРОЕКТ</span><div class="site-outcome-grid"><article><b>14+</b><p>отдельных URL-страниц<br />и SEO-структура сайта</p></article><article><b>02</b><p>версии интерфейса:<br />Desktop + Mobile</p></article><article><b>01</b><p>интерактивный<br />генплан проекта</p></article><article><b>MAP</b><p>интеграция с картой<br />и геолокацией</p></article><article><b>UI</b><p>планировки с переключением<br />дизайн-проекта</p></article><article><b>CAT</b><p>каталог домов<br />и калькулятор</p></article></div><a href="https://shepithouse.ua" target="_blank" rel="noreferrer">Посмотреть сайт <b>↗</b></a>';
  const siteStats = siteVisual?.querySelector('.site-product-stats');
  if (siteStats) siteStats.innerHTML = '<b>14+<small>уникальных страниц</small></b><b>2<small>версии: Desktop + Mobile</small></b><b>ИНТЕРАКТИВНЫЙ<small>генплан</small></b><b>КАТАЛОГ<small>домов</small></b>';
  const googleBlock = document.querySelector('.performance-board');
  const googleIntro = document.querySelector('#google-ads .case-story-copy p');
  if (googleIntro) googleIntro.textContent = 'Поисковые кампании собраны вокруг коммерческих запросов покупателей домов: покупка, рассрочка, локация, формат жилья и выбор объекта.';
  if (googleBlock) googleBlock.innerHTML = `<div class="google-analysis"><div class="google-analysis-top"><span>03 / GOOGLE ADS</span><span>05.06 — 11.08</span></div><figure class="google-account"><img src="shepit_assets/new_google_stats.png" alt="Обновлённый обзор кампаний Google Ads SHEPIT HOUSE" /><figcaption>ОБЗОР АККАУНТА GOOGLE ADS</figcaption></figure><svg class="google-connectors" viewBox="0 0 1000 500" aria-hidden="true"><path d="M118 308H290V382H504"/><path d="M708 109V214H875"/><circle cx="290" cy="308" r="6"/><circle cx="708" cy="214" r="6"/></svg><div class="google-evidence"><figure><img src="shepit_assets/google_ads_keys.png" alt="Коммерческие ключевые слова Google Ads" /><figcaption>КОММЕРЧЕСКИЕ КЛЮЧЕВЫЕ СЛОВА</figcaption></figure><figure><img src="shepit_assets/new_google_advertising_example.png" alt="Адаптивное объявление Google Ads" /><figcaption>ГРУППЫ И АДАПТИВНЫЕ ОБЪЯВЛЕНИЯ</figcaption></figure></div><aside class="google-kpis"><div><span>СРЕДНИЙ CTR GOOGLE ADS</span><b>5.22%</b></div><div><span>РАСХОДЫ НА РЕКЛАМУ</span><b>37.4K</b><small>за период кампании</small></div><div><span>ЛУЧШЕЕ ОБЪЯВЛЕНИЕ</span><b>7.53%</b></div></aside><div class="google-work"><span>ЧТО СДЕЛАЛИ</span><p>Исследование спроса · семантическое ядро · коммерческие ключевые слова · группы и адаптивные объявления · минус-слова · оптимизация CTR</p></div></div>`;
  const googleCopy = document.querySelector('#google-ads .case-story-copy');
  if (googleCopy && !googleCopy.querySelector('.google-key-results')) googleCopy.insertAdjacentHTML('beforeend', '<div class="google-key-results"><div><b>37.4K</b><span>расходы<br />на рекламу</span></div><div><b>5.22%</b><span>средний CTR<br />Google Ads</span></div><div><b>7.53%</b><span>лучшее<br />объявление</span></div></div>');
  const metaBlock = document.querySelector('.creative-rail');
  const metaIntro = document.querySelector('#meta-ads .case-story-title p');
  if (metaIntro) metaIntro.textContent = 'Мы разработали рекламные креативы под разные сценарии принятия решения. Вместо одного универсального объявления использовали несколько офферов, чтобы охватить разные мотивы покупки и увеличить количество заявок.';
  if (metaBlock) metaBlock.innerHTML = `<div class="meta-case-board"><div class="meta-board-top"><span>04 / META ADS</span><span>КРЕАТИВЫ, КАМПАНИИ И ОПТИМИЗАЦИЯ</span></div><svg class="meta-connectors" viewBox="0 0 1200 760" aria-hidden="true"><path d="M74 462H230V530H390"/><path d="M892 206H1050V310H1135"/><circle cx="230" cy="462" r="6"/><circle cx="1050" cy="310" r="6"/></svg><div class="meta-creatives" aria-label="Лучшие рекламные креативы Meta Ads">${[1, 2, 3, 4].map((index) => `<figure><img src="shepit_assets/meta_ads_creo${index}.png" alt="Рекламный креатив Meta Ads ${index}" /><figcaption>КРЕАТИВ 0${index}</figcaption></figure>`).join('')}</div><figure class="meta-dashboard-real"><img src="shepit_assets/new_meta_stats.png" alt="Обновлённая таблица результатов рекламных кампаний Meta Ads" /><figcaption>META ADS / РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ КАМПАНИЙ</figcaption></figure><aside class="meta-usage"><span>ЧТО ИСПОЛЬЗОВАЛИ</span><ul><li>Рассрочка без переплат</li><li>Первый взнос 0%</li><li>Несколько форматов домов</li><li>Образ жизни и локация</li><li>Офферы для разных сегментов аудитории</li></ul></aside><div class="meta-optimization"><span>РЕЗУЛЬТАТ ОПТИМИЗАЦИИ</span><div class="meta-compare"><article><small>ПЕРВАЯ КАМПАНИЯ</small><b>45 <i>лидов</i></b><p>Бюджет 33 995 грн<br />Стоимость лида 755 грн</p></article><article><small>ПОСЛЕ ОПТИМИЗАЦИИ</small><b>73 <i>лида</i></b><p>Бюджет 16 884 грн<br />Стоимость лида 231 грн</p></article></div><div class="meta-cpl-drop"><span>СТОИМОСТЬ ЛИДА СНИЖЕНА</span><b><s>755 грн</s><i>→</i>231 грн</b><strong>В 3.27 РАЗА ДЕШЕВЛЕ</strong></div><p class="meta-optimization-note">При меньшем бюджете удалось увеличить объём заявок благодаря оптимизации рекламной кампании.</p></div></div>`;
  const metaOptimization = metaBlock?.querySelector('.meta-optimization');
  const metaOptimizationLabel = metaOptimization?.querySelector(':scope > span');
  if (metaOptimizationLabel) metaOptimizationLabel.textContent = 'СТОИМОСТЬ ЛИДА СНИЖЕНА В 3.27 РАЗА';
  const metaCompare = metaOptimization?.querySelector('.meta-compare');
  if (metaCompare && !metaOptimization.querySelector('.meta-deltas')) metaCompare.insertAdjacentHTML('afterend', '<div class="meta-deltas"><span>−50% бюджета</span><b>↓</b><span>−69% стоимости лида</span></div>');
  const analyticsBlock = document.querySelector('.analytics-map');
  const analyticsCopy = document.querySelector('#analytics .case-story-copy');
  const analyticsIntro = analyticsCopy?.querySelector('p');
  if (analyticsIntro) analyticsIntro.textContent = 'Настроили GA4, Google Tag Manager, Meta Pixel и систему событий, чтобы видеть весь путь пользователя — от первого перехода до отправки заявки.';
  if (analyticsBlock) analyticsBlock.innerHTML = `<div class="analytics-board"><div class="analytics-board-top"><span>05 / GOOGLE ANALYTICS 4</span><span>РАБОЧИЙ ДАШБОРД</span></div><svg class="analytics-connectors" viewBox="0 0 1000 700" aria-hidden="true"><path d="M78 594H250V474H418"/><path d="M724 112V225H883V344"/><circle cx="250" cy="474" r="6"/><circle cx="724" cy="225" r="6"/></svg><figure class="analytics-main-screen"><img src="shepit_assets/GA4_stats.png" alt="Статистика Google Analytics 4" /><figcaption>ДАШБОРД СТАТИСТИКИ</figcaption></figure><figure class="analytics-traffic-screen"><img src="shepit_assets/GA4_trafic.png" alt="Источники трафика в Google Analytics 4" /><figcaption>ИСТОЧНИКИ ТРАФИКА</figcaption></figure><figure class="analytics-pages-screen"><img src="shepit_assets/GA4_pages_view.png" alt="Просмотры страниц в Google Analytics 4" /><figcaption>СТРАНИЦЫ И ВОВЛЕЧЕНИЕ</figcaption></figure><figure class="analytics-events-screen"><img src="shepit_assets/GA4_events.png" alt="События Google Analytics 4" /><figcaption>СОБЫТИЯ</figcaption></figure><span class="analytics-tech-note">GA4 / GTM / META PIXEL<br />ПУТЬ ПОЛЬЗОВАТЕЛЯ</span></div>`;
  if (analyticsCopy) {
    const checklist = analyticsCopy.querySelector('.case-checklist');
    if (checklist) checklist.outerHTML = '<div class="analytics-tracking"><span>ЧТО ОТСЛЕЖИВАЕМ</span><ul><li>Источники трафика</li><li>Поведение пользователей</li><li>События и взаимодействия</li><li>Отправку форм</li><li>Эффективность рекламных кампаний</li></ul></div><div class="analytics-result"><span>РЕЗУЛЬТАТ</span><p>Теперь можно понять:</p><ul><li>откуда приходит каждый пользователь;</li><li>какие страницы работают лучше всего;</li><li>где люди уходят;</li><li>какие кампании приводят реальные заявки.</li></ul></div>';
  }
  const crmTitle = document.querySelector('#crm .case-story-title');
  if (crmTitle && !crmTitle.querySelector('p')) crmTitle.insertAdjacentHTML('beforeend', '<p>Настроили CRM-систему так, чтобы менеджер видел весь путь клиента, не терял обращения и всегда понимал следующий шаг по каждой заявке.</p>');
  const crmFlow = document.querySelector('#crm .crm-flow');
  if (crmFlow) crmFlow.outerHTML = '<div class="crm-case-layout"><figure class="crm-kanban"><img src="shepit_assets/crm_funnel.png" alt="Kanban-доска CRM SHEPIT HOUSE" /><figcaption>CRM / KANBAN-ДОСКА — УПРАВЛЕНИЕ ОБРАЩЕНИЯМИ</figcaption><svg class="crm-interface-lines" viewBox="0 0 1000 520" aria-hidden="true"><path d="M65 385H180V440H360"/><path d="M744 95V176H910"/><circle cx="180" cy="385" r="6"/><circle cx="744" cy="176" r="6"/></svg></figure><aside class="crm-implementation"><span>ЧТО РЕАЛИЗОВАЛИ</span><ul><li>Воронка продаж</li><li>История коммуникации</li><li>Интеграция рекламных источников</li><li>Контроль этапов сделки</li><li>Отложенный спрос</li></ul></aside><div class="crm-funnel-logic"><span>ЛОГИКА ВОРОНКИ</span><dl><div><dt>Новый лид</dt><dd>Обращение получено, ожидает первого контакта.</dd></div><div><dt>В работе</dt><dd>Менеджер связался с клиентом и ведет консультацию.</dd></div><div><dt>Договорились о встрече</dt><dd>Назначен следующий шаг.</dd></div><div><dt>Встреча состоялась</dt><dd>Клиент посмотрел объект.</dd></div><div><dt>Отложенный спрос</dt><dd>Клиент пока не готов купить, но остается в системе для дальнейшей работы.</dd></div></dl></div></div>';
  const crmImplementation = document.querySelector('#crm .crm-implementation ul');
  if (crmImplementation) crmImplementation.innerHTML = '<li>Воронка продаж</li><li>Полная история коммуникации</li><li>Интеграция рекламных источников</li><li>Контроль каждой сделки</li><li>Работа с отложенным спросом</li>';
  const crmLogic = document.querySelector('#crm .crm-funnel-logic');
  if (crmLogic) crmLogic.innerHTML = '<span>ЛОГИКА ВОРОНКИ</span><dl><div><dt>Новый лид</dt><dd>Получено новое обращение</dd></div><div><dt>В работе</dt><dd>Первый контакт и консультация</dd></div><div><dt>Договорились о встрече</dt><dd>Назначен следующий шаг</dd></div><div><dt>Встреча состоялась</dt><dd>Клиент посмотрел объект</dd></div><div><dt>Отложенный спрос</dt><dd>Клиент пока не готов к покупке, но остается в системе для дальнейшей работы</dd></div></dl>';
  const crmNote = document.querySelector('#crm .crm-note');
  if (crmNote) {
    crmNote.className = 'crm-case-note';
    crmNote.textContent = 'Ни одно обращение не теряется. Все лиды проходят понятную последовательную воронку до сделки или переходят в работу с отложенным спросом.';
  }
  const summaryCopy = document.querySelector('#summary .case-story-copy');
  if (summaryCopy && !summaryCopy.querySelector('p')) summaryCopy.insertAdjacentHTML('beforeend', '<p>За несколько этапов была выстроена полноценная digital-система проекта: от позиционирования и сайта до рекламы, аналитики и обработки обращений.</p>');
  const summaryIntro = summaryCopy?.querySelector('p');
  if (summaryIntro) summaryIntro.textContent = 'Что получил клиент после комплексного запуска проекта?';
  const summaryResults = document.querySelector('#summary .summary-results');
  if (summaryResults) summaryResults.outerHTML = '<div class="summary-scorecard"><div class="summary-metrics"><article><b>100+</b><span>лидов привлечено<br />из Google Ads и Meta Ads</span></article><article class="summary-featured"><b>в 3 раза</b><span>снижена стоимость лида<br />после оптимизации Meta Ads<br /><small>с 755 грн до 231 грн</small></span></article><article><b>7.59%</b><span>CTR лучших коммерческих<br />поисковых запросов Google Ads</span></article><article><b>1000+</b><span>посетителей сайта<br />за период запуска проекта</span></article><article><b>GA4 + CRM</b><span>все обращения и действия пользователей<br />отслеживаются и фиксируются<br />в единой системе</span></article><article><b>14+</b><span>страниц сайта, интерактивный генплан,<br />каталог домов и калькулятор</span></article></div><div class="summary-conclusion"><p>В результате проект получил полноценную digital-систему: сайт, рекламу, аналитику и CRM, которые работают как единый процесс. Каждый этап — от первого клика до обращения клиента — измеряется и управляется.</p><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div>';
}

if (factorAssets) {
  const factorStrategy = document.querySelector('#strategy .strategy-principles');
  const factorStrategyIntro = document.querySelector('#strategy .case-story-copy p');
  const factorStrategyTitle = document.querySelector('#strategy .case-story-copy h2');
  if (factorStrategyTitle) factorStrategyTitle.innerHTML = 'Собрали логику<br /><em>перезапуска Meta Ads.</em>';
  if (factorStrategyIntro) factorStrategyIntro.textContent = 'Нужно было быстро перезапустить поток заявок: определить рабочие офферы, подготовить креативы и собрать кампании с понятной стоимостью лида.';
  if (factorStrategy) factorStrategy.innerHTML = '<article><span>01 / АУДИТ</span><h3>Проверили текущие кампании и точки роста</h3><p>Определили, какие настройки, офферы и аудитории требуют перезапуска.</p></article><article><span>02 / ОФФЕРЫ</span><h3>Собрали предложения под спрос каждого филиала</h3><p>Сформировали понятные поводы оставить заявку и поговорить с менеджером.</p></article><article><span>03 / КРЕАТИВЫ</span><h3>Подготовили визуалы для разных сценариев выбора</h3><p>Тестировали подачу объекта, стоимости, форматов и преимуществ.</p></article><article class="strategy-priority"><span>04 / ЗАПУСК</span><h3>Перезапустили Meta Ads для двух филиалов</h3><p>Настроили кампании и лид-формы, получили равное количество заявок для каждого направления.</p></article>';

  const factorMeta = document.querySelector('#meta-ads .creative-rail');
  const factorMetaIntro = document.querySelector('#meta-ads .case-story-title p');
  const factorMetaTitle = document.querySelector('#meta-ads .case-story-title h2');
  if (factorMetaTitle) factorMetaTitle.innerHTML = 'Настройка и запуск<br /><em>Meta Ads.</em>';
  if (factorMetaIntro) factorMetaIntro.textContent = 'Результат не нужно ждать месяцами: уже за первые две недели после перезапуска получили 76 заявок со средней стоимостью лида 6.94 $.';
  if (factorMeta) factorMeta.innerHTML = '<div class="meta-case-board"><div class="meta-board-top"><span>04 / META ADS</span><span>КРЕАТИВЫ И РЕЗУЛЬТАТЫ КАМПАНИЙ</span></div><div class="meta-creatives" aria-label="Рекламные креативы Meta Ads"><figure><img src="factor_assets/creo_NY.png" alt="Рекламный креатив Meta Ads 01" /><figcaption>КРЕАТИВ 01</figcaption></figure><figure><img src="factor_assets/creo_cuvee.png" alt="Рекламный креатив Meta Ads 02" /><figcaption>КРЕАТИВ 02</figcaption></figure><figure><img src="factor_assets/creo_option.png" alt="Рекламный креатив Meta Ads 03" /><figcaption>КРЕАТИВ 03</figcaption></figure><figure><img src="factor_assets/creo_price.png" alt="Рекламный креатив Meta Ads 04" /><figcaption>КРЕАТИВ 04</figcaption></figure></div><div class="factor-meta-screens"><figure><img src="factor_assets/filial_1.png" alt="Результаты первой кампании Meta Ads" /><figcaption>META ADS / РЕЗУЛЬТАТЫ КАМПАНИЙ</figcaption></figure><figure><img src="factor_assets/filial_4.png" alt="Результаты второй кампании Meta Ads" /><figcaption>META ADS / РЕЗУЛЬТАТЫ КАМПАНИЙ</figcaption></figure></div><aside class="meta-usage"><span>ЧТО СДЕЛАЛИ</span><ul><li>Перезапустили кампании</li><li>Разделили направления</li><li>Подготовили новые креативы</li><li>Настроили лид-формы</li><li>Контролируем стоимость лида</li></ul></aside><div class="meta-results"><div><span>МИНИМАЛЬНАЯ ЦЕНА ЛИДА</span><b>3.29 $</b><small>по одной из кампаний</small></div><div><span>СРЕДНЯЯ ЦЕНА ЛИДА</span><b>6.94 $</b><small>по всем кампаниям</small></div><div><span>ОБЩЕЕ КОЛИЧЕСТВО ЛИДОВ</span><b>76</b><small>заявок получено</small></div><div><span>РЕЗУЛЬТАТ ЗА ПЕРВЫЕ</span><b>2 недели</b><small>работы кампаний</small></div></div></div>';

  const factorSummaryTitle = document.querySelector('#summary .case-story-copy h2');
  const factorSummaryCopy = document.querySelector('#summary .case-story-copy');
  if (factorSummaryCopy && !factorSummaryCopy.querySelector('p')) factorSummaryCopy.insertAdjacentHTML('beforeend', '<p></p>');
  const factorSummaryIntro = factorSummaryCopy?.querySelector('p');
  const factorSummary = document.querySelector('#summary .summary-results');
  if (factorSummaryTitle) factorSummaryTitle.innerHTML = 'Результат уже<br /><em>за 2 недели.</em>';
  if (factorSummaryIntro) factorSummaryIntro.textContent = 'Первые измеримые результаты можно получить сразу после корректного запуска кампаний.';
  if (factorSummary) factorSummary.outerHTML = '<div class="summary-scorecard"><div class="summary-metrics"><article><b>76</b><span>лидов суммарно<br />за первые две недели</span></article><article class="summary-featured"><b>6.94 $</b><span>средняя стоимость лида<br />по всем кампаниям<br /><small>с первого периода запуска</small></span></article><article><b>3.29 $</b><span>минимальная стоимость лида<br />по одной из кампаний</span></article><article><b>20+</b><span>креативов<br />для тестирования офферов</span></article><article><b>2 недели</b><span>до первого<br />зафиксированного результата</span></article><article><b>527.76 $</b><span>потраченный бюджет<br />за первые две недели</span></article></div><div class="summary-conclusion"><p>Агентство получило работающую систему Meta Ads: креативы, лид-формы и прозрачные показатели, которые позволяют управлять стоимостью и объёмом заявок уже со старта.</p><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div>';
}

const casePageNavigation = {
  'shepit-house.html': { position: '01 / 08', title: 'SHEPIT HOUSE', previous: 'telegram-ai-crm.html', next: 'an-factor.html', nextLabel: 'АГЕНТСТВО НЕДВИЖИМОСТИ / META ADS / УКРАИНА' },
  'an-factor.html': { position: '02 / 08', title: 'AN FACTOR', previous: 'shepit-house.html', next: 'estyle-spain.html', nextLabel: 'АГЕНТСТВО НЕДВИЖИМОСТИ / SEO / ИСПАНИЯ' },
  'estyle-spain.html': { position: '03 / 08', title: 'ESTYLE SPAIN', previous: 'an-factor.html', next: 'nivellux.html', nextLabel: 'РЕМОНТНО-СТРОИТЕЛЬНАЯ КОМПАНИЯ / DIGITAL / ИСПАНИЯ' },
  'nivellux.html': { position: '04 / 08', title: 'NIVELLUX', previous: 'estyle-spain.html', next: 'irina-uzhelovskaya.html', nextLabel: 'ЛИЧНЫЙ БРЕНД / ОБРАЗОВАНИЕ / УКРАИНА' },
  'irina-uzhelovskaya.html': { position: '05 / 08', title: 'IRINA UZHELOVSKAYA', previous: 'nivellux.html', next: 'dominanta-spain.html', nextLabel: 'МЕЖДУНАРОДНОЕ АГЕНТСТВО / MARKET ENTRY / ИСПАНИЯ' },
  'dominanta-spain.html': { position: '06 / 08', title: 'DOMINANTA SPAIN', previous: 'irina-uzhelovskaya.html', next: 'ai-sales-assistant.html', nextLabel: 'ESTYLESPAIN / AI ПРОДУКТ / НЕДВИЖИМОСТЬ' },
  'ai-sales-assistant.html': { position: '07 / 08', title: 'AI SALES ASSISTANT', previous: 'dominanta-spain.html', next: 'telegram-ai-crm.html', nextLabel: 'DELMAR · HELPING · DOMSTAR / SAAS / НЕДВИЖИМОСТЬ' },
  'telegram-ai-crm.html': { position: '08 / 08', title: 'TELEGRAM AI CRM', previous: 'ai-sales-assistant.html', next: 'shepit-house.html', nextLabel: 'ДЕВЕЛОПЕР КОТТЕДЖНОГО ГОРОДКА / REAL ESTATE / УКРАИНА' },
};

const currentCaseFile = window.location.pathname.split('/').pop();
const currentCaseNavigation = casePageNavigation[currentCaseFile];

if (document.body.classList.contains('case-page') && currentCaseNavigation && !document.querySelector('.case-page-header')) {
  document.body.insertAdjacentHTML('afterbegin', `<header class="site-header case-page-header container"><a class="brand" href="../index.html" aria-label="RESET — на главную"><span class="brand-name"><span class="brand-mark-light">RE</span><span class="brand-mark-accent">SET</span></span></a><nav class="navigation" aria-label="Основная навигация"><a href="../index.html#system">Система</a><a href="../index.html#system">Решения</a><a href="../index.html#case-index">Кейсы</a></nav><div class="header-actions"><div class="language-switcher" aria-label="Язык сайта"><button class="is-active" type="button" data-locale="ru" aria-current="true">RU</button><button type="button" data-locale="uk">UA</button><button type="button" disabled>EN</button><button type="button" disabled>ES</button></div><a class="menu-link" href="../index.html#contact">Обсудить задачу <span aria-hidden="true">↗</span></a></div></header><nav class="case-breadcrumbs" aria-label="Хлебные крошки"><div class="container"><a href="../index.html">Главная</a><span>/</span><a href="../index.html#case-index">Кейсы</a><span>/</span><b>${currentCaseNavigation.title}</b></div></nav>`);

}

const caseNav = document.querySelector('.case-page-nav');
if (document.body.classList.contains('case-page') && currentCaseNavigation && caseNav) {
  const arrowLeft = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>';
  const arrowRight = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>';
  caseNav.innerHTML = `<div class="container case-page-nav-layout"><a class="case-nav-previous" href="${currentCaseNavigation.previous}">${arrowLeft}<span>Предыдущий кейс</span></a><span class="case-nav-position">${currentCaseNavigation.position}</span><a class="case-nav-next-control" href="${currentCaseNavigation.next}"><span>Следующий кейс</span>${arrowRight}</a><a class="case-nav-home" href="../index.html">Вернуться на главную</a><a class="case-nav-title" href="${currentCaseNavigation.next}">${currentCaseNavigation.nextLabel}</a></div>`;
}

const caseStoryTemplates = {
  'estyle-spain.html': [
    `<section class="case-story case-story-strategy"><div class="container case-story-grid"><div class="case-story-meta"><span>01 / СТРАТЕГИЯ</span><i></i><small>ТОЧКА ВОССТАНОВЛЕНИЯ</small></div><div class="case-story-copy"><h2>Сначала вернули<br /><em>контроль над системой.</em></h2><p>Собрали приоритеты после миграции: технические ошибки, структура сайта, аналитика и дальнейшая SEO-работа.</p></div><div class="strategy-principles"><article><span>01 / АУДИТ</span><h3>Нашли технические блокеры</h3><p>Проверили индексацию, структуру, скорость и критические ошибки сайта.</p></article><article><span>02 / SEO</span><h3>Вернули основу для органического роста</h3><p>Собрали понятную структуру страниц и точки дальнейшей оптимизации.</p></article><article><span>03 / АНАЛИТИКА</span><h3>Настроили измерение спроса</h3><p>Зафиксировали источники трафика, события и обращения.</p></article><article class="strategy-priority"><span>04 / РАЗВИТИЕ</span><h3>Связали сайт, SEO и аналитику в одну систему</h3><p>Команда получила основу для последовательного восстановления видимости и развития сайта.</p></article></div></div></section>`,
    `<section class="case-story case-story-performance"><div class="container case-story-grid"><div class="case-story-copy"><span class="case-kicker">02 / GOOGLE ADS</span><h2>Спрос, который<br /><em>можно измерить.</em></h2><p>Шаблон для настройки кампаний, структуры запросов и контроля качества рекламного трафика.</p></div><div class="performance-board"><div class="board-top"><span>GOOGLE ADS / ШАБЛОН РАБОТЫ</span><b>ГОТОВО К НАСТРОЙКЕ</b></div><div class="performance-main"><strong>ADS</strong><span>структура кампаний<br />и коммерческие запросы</span><i>↗ запуск</i></div><svg viewBox="0 0 600 150" aria-hidden="true"><polyline points="0,122 45,105 80,112 125,80 170,95 215,51 260,68 305,43 350,70 395,38 440,53 485,25 530,47 600,18" fill="none" stroke="#b9dce5" stroke-width="3" /></svg><div class="performance-metrics"><span><b>01</b>структура</span><span><b>02</b>кампании</span><span><b>03</b>контроль</span></div></div></div></section>`,
    `<section class="case-story case-story-analytics"><div class="container case-story-grid"><div class="analytics-map"><span>03 / АНАЛИТИКА</span><div class="analytics-node node-ad">SEO / ADS</div><div class="analytics-node node-site">САЙТ</div><div class="analytics-node node-lead">ЗАЯВКА</div><div class="analytics-node node-crm">CRM</div><div class="analytics-core">GA4<br />+ GTM</div></div><div class="case-story-copy"><h2>Аналитика:<br /><em>от поиска до обращения.</em></h2><p>GA4, Google Tag Manager и Search Console объединяют техническую картину сайта и поведение пользователей.</p><ul class="case-checklist"><li>Источники органического трафика</li><li>События и действия на сайте</li><li>Заявки и качество спроса</li></ul></div></div></section>`,
    `<section class="case-story case-story-summary"><div class="container case-story-grid"><div class="case-story-copy"><span class="case-kicker">04 / ИТОГИ</span><h2>Основа для<br /><em>цифрового роста.</em></h2></div><div class="summary-results"><div><b>01</b><p>Техническая и SEO-структура сайта</p></div><div><b>02</b><p>Измеримая аналитика и события</p></div><div><b>03</b><p>Подготовка рекламных каналов</p></div><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div></section>`,
  ],
  'nivellux.html': [
    `<section class="case-story case-story-strategy"><div class="container case-story-grid"><div class="case-story-meta"><span>01 / СТРАТЕГИЯ</span><i></i><small>ТОЧКА ВХОДА</small></div><div class="case-story-copy"><h2>Сначала собрали<br /><em>логику digital-упаковки.</em></h2><p>Определили, как показать компанию, её услуги и реализованные проекты в понятной системе коммуникации.</p></div><div class="strategy-principles"><article><span>01 / ПОЗИЦИОНИРОВАНИЕ</span><h3>Собрали ясный образ компании</h3><p>Определили ключевые услуги, преимущества и тональность бренда.</p></article><article><span>02 / СТРУКТУРА</span><h3>Связали услуги, проекты и обращения</h3><p>Сформировали путь клиента от первого интереса до контакта.</p></article><article><span>03 / ВИЗУАЛ</span><h3>Подготовили основу для доверия</h3><p>Показали качество работ, процессы и специализацию компании.</p></article><article class="strategy-priority"><span>04 / ЗАПУСК</span><h3>Собрали основу для системного digital-присутствия</h3><p>Бренд, сайт и коммуникация начинают работать как единое целое.</p></article></div></div></section>`,
    `<section class="case-story case-story-site"><div class="container"><div class="case-story-title"><span>02 / САЙТ</span><h2>Первый контакт<br />с компанией — <em>не форма.</em></h2><p>Сайт объясняет специализацию, показывает качество работ и ведёт клиента к понятному следующему шагу.</p></div><div class="site-devices"><div class="site-browser"><div class="device-top"><i></i><i></i><i></i><span>nivellux.es</span></div><div class="site-screen"><b>NIVEL<br />LUX</b><span>РЕМОНТ И СТРОИТЕЛЬСТВО<br />В ВАЛЕНСИИ</span><button>Обсудить проект ↗</button></div></div><div class="site-phone"><div></div><b>NL</b><span>УСЛУГИ<br />И ПРОЕКТЫ</span></div><p>DESKTOP + MOBILE<br />ОДИН СЦЕНАРИЙ КЛИЕНТА</p></div></div></section>`,
    `<section class="case-story case-story-meta-ads"><div class="container"><div class="case-story-title"><span>03 / META ADS</span><h2>Креативы, которые<br /><em>объясняют качество работы.</em></h2><p>Шаблон рекламной коммуникации: услуги, проекты, процесс и преимущества компании.</p></div><div class="creative-rail"><article><span>01 / УСЛУГИ</span><b>РЕМОНТ<br />ПОД КЛЮЧ</b><small>ВАЛЕНСИЯ</small></article><article><span>02 / ПРОЕКТЫ</span><b>ДЕТАЛИ,<br />КОТОРЫЕ ВИДНО</b><small>ПОРТФОЛИО РАБОТ</small></article><article><span>03 / ПРОЦЕСС</span><b>ПОНЯТНЫЙ<br />ПЛАН РАБОТ</b><small>ОТ ЗАДАЧИ ДО СДАЧИ</small></article><article><span>04 / КАЧЕСТВО</span><b>ПРОСТРАНСТВО<br />ДЛЯ ЖИЗНИ</b><small>NIVELLUX</small></article></div></div></section>`,
    `<section class="case-story case-story-summary"><div class="container case-story-grid"><div class="case-story-copy"><span class="case-kicker">04 / ИТОГИ</span><h2>Собрали основу<br /><em>для роста компании.</em></h2></div><div class="summary-results"><div><b>01</b><p>Позиционирование и фирменный стиль</p></div><div><b>02</b><p>Сайт и путь обращения клиента</p></div><div><b>03</b><p>Шаблон рекламной коммуникации</p></div><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div></section>`,
  ],
  'irina-uzhelovskaya.html': [
    `<section class="case-story case-story-strategy"><div class="container case-story-grid"><div class="case-story-meta"><span>01 / СТРАТЕГИЯ</span><i></i><small>ТОЧКА ВХОДА</small></div><div class="case-story-copy"><h2>Собрали знания<br /><em>в работающую структуру.</em></h2><p>Авторские методики, продукты и материалы были объединены в понятную digital-платформу для дальнейшего развития.</p></div><div class="strategy-principles"><article><span>01 / АРХИТЕКТУРА</span><h3>Разложили большой объём контента</h3><p>Собрали логичную структуру программ, материалов и разделов.</p></article><article><span>02 / ПРОДУКТЫ</span><h3>Сделали предложения понятными</h3><p>Каждый образовательный продукт получил своё место и путь выбора.</p></article><article><span>03 / СЦЕНАРИИ</span><h3>Продумали путь пользователя</h3><p>От знакомства с методикой до выбора программы и оплаты.</p></article><article class="strategy-priority"><span>04 / ПЛАТФОРМА</span><h3>Подготовили основу для онлайн-продаж</h3><p>Сайт стал единой точкой работы с контентом, продуктами и аудиторией.</p></article></div></div></section>`,
    `<section class="case-story case-story-site"><div class="container"><div class="case-story-title"><span>02 / DIGITAL-ПЛАТФОРМА</span><h2>Материалы и продукты<br /><em>в одной системе.</em></h2><p>Платформа объединяет программы, блог, каталог продуктов и будущую онлайн-оплату.</p></div><div class="site-devices"><div class="site-browser"><div class="device-top"><i></i><i></i><i></i><span>irina-uzhelovskaya.com</span></div><div class="site-screen"><b>IRINA<br />UZHELOVSKAYA</b><span>АВТОРСКИЕ МЕТОДИКИ<br />И ОБРАЗОВАТЕЛЬНЫЕ ПРОДУКТЫ</span><button>Выбрать программу ↗</button></div></div><div class="site-phone"><div></div><b>IU</b><span>КАТАЛОГ<br />ПРОДУКТОВ</span></div><p>DESKTOP + MOBILE<br />ЕДИНАЯ ПЛАТФОРМА</p></div></div></section>`,
    `<section class="case-story case-story-summary"><div class="container case-story-grid"><div class="case-story-copy"><span class="case-kicker">03 / ИТОГИ</span><h2>Платформа готова<br /><em>к дальнейшему развитию.</em></h2></div><div class="summary-results"><div><b>01</b><p>Структура авторских материалов</p></div><div><b>02</b><p>Каталог образовательных продуктов</p></div><div><b>03</b><p>Основа для онлайн-продаж</p></div><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div></section>`,
  ],
};

const templatesForCurrentCase = caseStoryTemplates[currentCaseFile];
const currentCaseNav = document.querySelector('.case-page-nav');
if (templatesForCurrentCase && currentCaseNav && !document.querySelector('[data-case-templates]')) {
  currentCaseNav.insertAdjacentHTML('beforebegin', `<div data-case-templates>${templatesForCurrentCase.join('')}</div>`);
}

const templateRoot = document.querySelector('[data-case-templates]');
// CANONICAL SHEPIT HOUSE TEMPLATE: this is the final, rendered case section.
// Reuse it unchanged first; alter its content only in a follow-up case-specific task.
const templateSummary = () => '<div class="summary-scorecard"><div class="summary-metrics"><article><b>100+</b><span>лидов привлечено<br />из Google Ads и Meta Ads</span></article><article class="summary-featured"><b>в 3 раза</b><span>снижена стоимость лида<br />после оптимизации Meta Ads<br /><small>с 755 грн до 231 грн</small></span></article><article><b>7.59%</b><span>CTR лучших коммерческих<br />поисковых запросов Google Ads</span></article><article><b>1000+</b><span>посетителей сайта<br />за период запуска проекта</span></article><article><b>GA4 + CRM</b><span>все обращения и действия пользователей<br />отслеживаются и фиксируются<br />в единой системе</span></article><article><b>14+</b><span>страниц сайта, интерактивный генплан,<br />каталог домов и калькулятор</span></article></div><div class="summary-conclusion"><p>В результате проект получил полноценную digital-систему: сайт, рекламу, аналитику и CRM, которые работают как единый процесс. Каждый этап — от первого клика до обращения клиента — измеряется и управляется.</p><a href="../index.html#contact">Обсудить проект <span>↗</span></a></div></div>';

if (templateRoot) {
  templateRoot.querySelectorAll('.case-story-strategy').forEach((section) => {
    const title = section.querySelector('.case-story-copy h2');
    const intro = section.querySelector('.case-story-copy p');
    const cards = section.querySelector('.strategy-principles');
    if (title) title.innerHTML = shepitStoryTitles.strategy;
    if (intro) intro.textContent = 'На старте не было единой системы: продукт существовал отдельно, а сайт, реклама и работа с обращениями ещё не были связаны. Мы изучили локальных конкурентов, их позиционирование, сайты, офферы и рекламную подачу — затем определили, как представить проект, откуда приводить спрос и как передавать его в работу отдела продаж.';
    if (cards) cards.innerHTML = '<article><span>01 / ПОЗИЦИОНИРОВАНИЕ</span><h3>Приватная жилая среда рядом с Киевом</h3><p>Камерный проект на 8 домов: природа, приватность, современная архитектура и комфортная дистанция до города.</p></article><article><span>02 / ПРОДУКТ</span><h3>Предложение, которое легко сравнить и понять</h3><p>Форматы домов, площадь, планировки, стоимость, рассрочка и преимущества каждого варианта.</p></article><article><span>03 / ПРИВЛЕЧЕНИЕ</span><h3>Разделили сформированный и потенциальный спрос</h3><p>Google Ads работает с готовым намерением купить дом. Meta Ads формирует интерес через офферы и визуальные сценарии.</p></article><article class="strategy-priority"><span>04 / ПРОДАЖИ</span><h3>Связали рекламу, сайт, аналитику и CRM</h3><p>Каждое обращение фиксируется, передаётся менеджеру и проходит понятную воронку до встречи и сделки.</p></article>';
  });

  templateRoot.querySelectorAll('.summary-results').forEach((summary) => {
    summary.outerHTML = templateSummary();
  });

  const site = templateRoot.querySelector('.case-story-site .site-devices');
  const siteSection = templateRoot.querySelector('.case-story-site');
  const siteTitle = siteSection?.querySelector('.case-story-title h2');
  const siteIntro = siteSection?.querySelector('.case-story-title p');
  if (siteTitle) siteTitle.innerHTML = shepitStoryTitles.site;
  if (siteIntro) siteIntro.textContent = 'Сайт объясняет ценность дома, помогает выбрать участок и переводит интерес в конкретное действие.';
  if (site) site.innerHTML = `<div class="shepit-product-stage" data-device-slider data-autoplay="1000" aria-label="Версии сайта SHEPIT HOUSE"><i class="product-orbit orbit-one"></i><i class="product-orbit orbit-two"></i><svg class="product-links" viewBox="0 0 1000 520" aria-hidden="true"><path d="M250 260V470H40"/><path d="M610 80V180H805V330"/><circle cx="250" cy="260" r="7"/><circle cx="805" cy="330" r="7"/></svg><figure class="shepit-desktop-preview site-device-slide is-active" data-device-slide data-device-label="Десктопная версия"><img src="shepit_assets/website.png" alt="Десктопная версия сайта SHEPIT HOUSE" /><figcaption>ДЕСКТОПНАЯ ВЕРСИЯ / SHEPIT HOUSE</figcaption></figure><figure class="shepit-mobile-preview site-device-slide" data-device-slide data-device-label="Мобильная / адаптивная версия"><img src="shepit_assets/mobile.png" alt="Мобильная версия сайта SHEPIT HOUSE" /><figcaption>МОБИЛЬНАЯ ВЕРСИЯ / АДАПТИВ</figcaption></figure><div class="site-device-controls" aria-label="Управление слайдером"><span aria-live="polite" data-device-label-output>Мобильная / адаптивная версия</span><button type="button" data-device-next aria-label="Следующая версия"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button></div><aside class="site-product-details"><span>ЧТО ПОЛУЧИЛ ПРОЕКТ</span><div class="site-outcome-grid"><article><b>14+</b><p>отдельных URL-страниц<br />и SEO-структура сайта</p></article><article><b>02</b><p>версии интерфейса:<br />Desktop + Mobile</p></article><article><b>01</b><p>интерактивный<br />генплан проекта</p></article><article><b>MAP</b><p>интеграция с картой<br />и геолокацией</p></article><article><b>UI</b><p>планировки с переключением<br />дизайн-проекта</p></article><article><b>CAT</b><p>каталог домов<br />и калькулятор</p></article></div><a href="https://shepithouse.ua" target="_blank" rel="noreferrer">Посмотреть сайт <b>↗</b></a></aside><div class="site-product-stats"><b>14+<small>уникальных страниц</small></b><b>2<small>версии: Desktop + Mobile</small></b><b>ИНТЕРАКТИВНЫЙ<small>генплан</small></b><b>КАТАЛОГ<small>домов</small></b><span class="site-tech-note">ИНТЕРФЕЙС ПРОДУКТА<br />САЙТ / ПУТЬ ЗАЯВКИ</span></div></div>`;

  const google = templateRoot.querySelector('.case-story-performance .performance-board');
  const googleSection = templateRoot.querySelector('.case-story-performance');
  const googleKicker = googleSection?.querySelector('.case-kicker');
  const googleTitle = googleSection?.querySelector('.case-story-copy h2');
  const googleIntro = googleSection?.querySelector('.case-story-copy p');
  if (googleTitle) googleTitle.innerHTML = shepitStoryTitles['google-ads'];
  if (googleKicker) googleKicker.textContent = '03 / GOOGLE ADS';
  if (googleIntro) googleIntro.textContent = 'Поисковые кампании собраны вокруг коммерческих запросов покупателей домов: покупка, рассрочка, локация, формат жилья и выбор объекта.';
  if (google) google.innerHTML = `<div class="google-analysis"><div class="google-analysis-top"><span>03 / GOOGLE ADS</span><span>05.06 — 11.08</span></div><figure class="google-account"><img src="shepit_assets/new_google_stats.png" alt="Обновлённый обзор кампаний Google Ads SHEPIT HOUSE" /><figcaption>ОБЗОР АККАУНТА GOOGLE ADS</figcaption></figure><svg class="google-connectors" viewBox="0 0 1000 500" aria-hidden="true"><path d="M118 308H290V382H504"/><path d="M708 109V214H875"/><circle cx="290" cy="308" r="6"/><circle cx="708" cy="214" r="6"/></svg><div class="google-evidence"><figure><img src="shepit_assets/google_ads_keys.png" alt="Коммерческие ключевые слова Google Ads" /><figcaption>КОММЕРЧЕСКИЕ КЛЮЧЕВЫЕ СЛОВА</figcaption></figure><figure><img src="shepit_assets/new_google_advertising_example.png" alt="Адаптивное объявление Google Ads" /><figcaption>ГРУППЫ И АДАПТИВНЫЕ ОБЪЯВЛЕНИЯ</figcaption></figure></div><aside class="google-kpis"><div><span>СРЕДНИЙ CTR GOOGLE ADS</span><b>5.22%</b></div><div><span>РАСХОДЫ НА РЕКЛАМУ</span><b>37.4K</b><small>за период кампании</small></div><div><span>ЛУЧШЕЕ ОБЪЯВЛЕНИЕ</span><b>7.53%</b></div></aside><div class="google-work"><span>ЧТО СДЕЛАЛИ</span><p>Исследование спроса · семантическое ядро · коммерческие ключевые слова · группы и адаптивные объявления · минус-слова · оптимизация CTR</p></div></div>`;
  const googleCopy = googleSection?.querySelector('.case-story-copy');
  if (googleCopy && !googleCopy.querySelector('.google-key-results')) googleCopy.insertAdjacentHTML('beforeend', '<div class="google-key-results"><div><b>37.4K</b><span>расходы<br />на рекламу</span></div><div><b>5.22%</b><span>средний CTR<br />Google Ads</span></div><div><b>7.53%</b><span>лучшее<br />объявление</span></div></div>');

  const meta = templateRoot.querySelector('.case-story-meta-ads .creative-rail');
  const metaSection = templateRoot.querySelector('.case-story-meta-ads');
  const metaKicker = metaSection?.querySelector('.case-story-title > span');
  const metaTitle = metaSection?.querySelector('.case-story-title h2');
  const metaIntro = metaSection?.querySelector('.case-story-title p');
  if (metaTitle) metaTitle.innerHTML = shepitStoryTitles['meta-ads'];
  if (metaKicker) metaKicker.textContent = '04 / META ADS';
  if (metaIntro) metaIntro.textContent = 'Мы разработали рекламные креативы под разные сценарии принятия решения. Вместо одного универсального объявления использовали несколько офферов, чтобы охватить разные мотивы покупки и увеличить количество заявок.';
  if (meta) meta.innerHTML = `<div class="meta-case-board"><div class="meta-board-top"><span>04 / META ADS</span><span>КРЕАТИВЫ, КАМПАНИИ И ОПТИМИЗАЦИЯ</span></div><svg class="meta-connectors" viewBox="0 0 1200 760" aria-hidden="true"><path d="M74 462H230V530H390"/><path d="M892 206H1050V310H1135"/><circle cx="230" cy="462" r="6"/><circle cx="1050" cy="310" r="6"/></svg><div class="meta-creatives" aria-label="Лучшие рекламные креативы Meta Ads">${[1, 2, 3, 4].map((index) => `<figure><img src="shepit_assets/meta_ads_creo${index}.png" alt="Рекламный креатив Meta Ads ${index}" /><figcaption>КРЕАТИВ 0${index}</figcaption></figure>`).join('')}</div><figure class="meta-dashboard-real"><img src="shepit_assets/new_meta_stats.png" alt="Обновлённая таблица результатов рекламных кампаний Meta Ads" /><figcaption>META ADS / РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ КАМПАНИЙ</figcaption></figure><aside class="meta-usage"><span>ЧТО ИСПОЛЬЗОВАЛИ</span><ul><li>Рассрочка без переплат</li><li>Первый взнос 0%</li><li>Несколько форматов домов</li><li>Образ жизни и локация</li><li>Офферы для разных сегментов аудитории</li></ul></aside><div class="meta-optimization"><span>СТОИМОСТЬ ЛИДА СНИЖЕНА В 3.27 РАЗА</span><div class="meta-compare"><article><small>ПЕРВАЯ КАМПАНИЯ</small><b>45 <i>лидов</i></b><p>Бюджет 33 995 грн<br />Стоимость лида 755 грн</p></article><article><small>ПОСЛЕ ОПТИМИЗАЦИИ</small><b>73 <i>лида</i></b><p>Бюджет 16 884 грн<br />Стоимость лида 231 грн</p></article></div><div class="meta-deltas"><span>−50% бюджета</span><b>↓</b><span>−69% стоимости лида</span></div><div class="meta-cpl-drop"><span>СТОИМОСТЬ ЛИДА СНИЖЕНА</span><b><s>755 грн</s><i>→</i>231 грн</b><strong>В 3.27 РАЗА ДЕШЕВЛЕ</strong></div><p class="meta-optimization-note">При меньшем бюджете удалось увеличить объём заявок благодаря оптимизации рекламной кампании.</p></div></div>`;

  const analytics = templateRoot.querySelector('.case-story-analytics .analytics-map');
  const analyticsSection = templateRoot.querySelector('.case-story-analytics');
  const analyticsTitle = analyticsSection?.querySelector('.case-story-copy h2');
  const analyticsIntro = analyticsSection?.querySelector('.case-story-copy p');
  if (analyticsTitle) analyticsTitle.innerHTML = shepitStoryTitles.analytics;
  if (analyticsIntro) analyticsIntro.textContent = 'Настроили GA4, Google Tag Manager, Meta Pixel и систему событий, чтобы видеть весь путь пользователя — от первого перехода до отправки заявки.';
  if (analytics) analytics.innerHTML = `<div class="analytics-board"><div class="analytics-board-top"><span>05 / GOOGLE ANALYTICS 4</span><span>РАБОЧИЙ ДАШБОРД</span></div><svg class="analytics-connectors" viewBox="0 0 1000 700" aria-hidden="true"><path d="M78 594H250V474H418"/><path d="M724 112V225H883V344"/><circle cx="250" cy="474" r="6"/><circle cx="724" cy="225" r="6"/></svg><figure class="analytics-main-screen"><img src="shepit_assets/GA4_stats.png" alt="Статистика Google Analytics 4" /><figcaption>ДАШБОРД СТАТИСТИКИ</figcaption></figure><figure class="analytics-traffic-screen"><img src="shepit_assets/GA4_trafic.png" alt="Источники трафика в Google Analytics 4" /><figcaption>ИСТОЧНИКИ ТРАФИКА</figcaption></figure><figure class="analytics-pages-screen"><img src="shepit_assets/GA4_pages_view.png" alt="Просмотры страниц в Google Analytics 4" /><figcaption>СТРАНИЦЫ И ВОВЛЕЧЕНИЕ</figcaption></figure><figure class="analytics-events-screen"><img src="shepit_assets/GA4_events.png" alt="События Google Analytics 4" /><figcaption>СОБЫТИЯ</figcaption></figure><span class="analytics-tech-note">GA4 / GTM / META PIXEL<br />ПУТЬ ПОЛЬЗОВАТЕЛЯ</span></div>`;
  const analyticsChecklist = analyticsSection?.querySelector('.case-checklist');
  if (analyticsChecklist) analyticsChecklist.outerHTML = '<div class="analytics-tracking"><span>ЧТО ОТСЛЕЖИВАЕМ</span><ul><li>Источники трафика</li><li>Поведение пользователей</li><li>События и взаимодействия</li><li>Отправку форм</li><li>Эффективность рекламных кампаний</li></ul></div><div class="analytics-result"><span>РЕЗУЛЬТАТ</span><p>Теперь можно понять:</p><ul><li>откуда приходит каждый пользователь;</li><li>какие страницы работают лучше всего;</li><li>где люди уходят;</li><li>какие кампании приводят реальные заявки.</li></ul></div>';

  templateRoot.querySelectorAll('.case-story-summary').forEach((section) => {
    const kicker = section.querySelector('.case-kicker');
    const title = section.querySelector('.case-story-copy h2');
    const intro = section.querySelector('.case-story-copy p');
    if (kicker) kicker.textContent = '07 / ИТОГИ';
    if (title) title.innerHTML = shepitStoryTitles.summary;
    if (intro) intro.textContent = 'Что получил клиент после комплексного запуска проекта?';
  });
}

document.querySelectorAll('[data-product-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll('[data-product-slide]')];
  const copies = [...slider.querySelectorAll('[data-product-copy]')];
  const previous = slider.querySelector('[data-product-prev]');
  const next = slider.querySelector('[data-product-next]');
  const current = slider.querySelector('[data-product-current]');
  const interval = Number(slider.dataset.autoplay) || 5500;
  let active = 0;
  let timer;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === active));
    copies.forEach((copy, copyIndex) => copy.classList.toggle('is-active', copyIndex === active));
    if (current) current.textContent = String(active + 1).padStart(2, '0');
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(active + 1), interval);
  };

  previous?.addEventListener('click', () => { show(active - 1); restart(); });
  next?.addEventListener('click', () => { show(active + 1); restart(); });
  slider.addEventListener('mouseenter', () => window.clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  show(0);
  restart();
});

document.querySelectorAll('[data-device-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll('[data-device-slide]')];
  const next = slider.querySelector('[data-device-next]');
  const output = slider.querySelector('[data-device-label-output]');
  let active = 0;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === active;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    const nextSlide = slides[(active + 1) % slides.length];
    if (output) output.textContent = nextSlide.dataset.deviceLabel || '';
    if (next) next.setAttribute('aria-label', `Показать: ${nextSlide.dataset.deviceLabel || 'следующую версию'}`);
  };

  next?.addEventListener('click', () => show(active + 1));
  show(0);
});

if (caseStudiesSlider) {
  const caseSlides = [...caseStudiesSlider.querySelectorAll('[data-case-slide]')]
    .sort((first, second) => Number(first.dataset.caseOrder) - Number(second.dataset.caseOrder));
  caseSlides.forEach((slide) => {
    const sectionNumber = slide.querySelector('.case-template-meta > span:first-child');
    if (sectionNumber) sectionNumber.textContent = '03 / CASE STUDY';
  });
  const previousCase = caseStudiesSlider.querySelector('[data-case-studies-prev]');
  const nextCase = caseStudiesSlider.querySelector('[data-case-studies-next]');
  const currentCase = caseStudiesSlider.querySelector('.case-studies-status span');
  const totalCases = caseStudiesSlider.querySelector('.case-studies-status b');
  const activeCaseTitle = caseStudiesSlider.querySelector('[data-case-studies-title]');
  let activeCaseIndex = 0;
  let pointerStartX = null;

  const showCase = (nextIndex, direction = 'next') => {
    activeCaseIndex = (nextIndex + caseSlides.length) % caseSlides.length;

    caseSlides.forEach((slide, index) => {
      const isActive = index === activeCaseIndex;
      slide.classList.toggle('is-active', isActive);
      slide.classList.remove('is-entering-next', 'is-entering-prev');
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
      if (isActive) {
        void slide.offsetWidth;
        slide.classList.add(direction === 'prev' ? 'is-entering-prev' : 'is-entering-next');
      }
    });

    const activeSlide = caseSlides[activeCaseIndex];
    caseStudiesSlider.style.setProperty('--case-progress', `${((activeCaseIndex + 1) / caseSlides.length) * 100}%`);
    currentCase.textContent = String(activeCaseIndex + 1).padStart(2, '0');
    totalCases.textContent = `/ ${String(caseSlides.length).padStart(2, '0')}`;
    activeCaseTitle.textContent = activeSlide.dataset.caseName;
  };

  previousCase.addEventListener('click', () => showCase(activeCaseIndex - 1, 'prev'));
  nextCase.addEventListener('click', () => showCase(activeCaseIndex + 1, 'next'));

  caseStudiesSlider.querySelectorAll('a[href^="#"]').forEach((link) => {
    const targetIndex = caseSlides.findIndex((slide) => `#${slide.id}` === link.getAttribute('href'));
    if (targetIndex < 0) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showCase(targetIndex, targetIndex < activeCaseIndex ? 'prev' : 'next');
    });
  });

  caseStudiesSlider.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });

  caseStudiesSlider.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 60) return;
    showCase(activeCaseIndex + (distance < 0 ? 1 : -1), distance < 0 ? 'next' : 'prev');
  });
}
