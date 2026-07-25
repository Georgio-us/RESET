const tabs = document.querySelectorAll('.navigator-tab');
const panels = document.querySelectorAll('.navigator-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
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
  });
});

const testimonials = {
  estyle: { quote: '«Теперь я чётко понимаю, что происходит с SEO, Google и всеми направлениями, в которых мы работаем. Мы решили технические ограничения и собрали все доступы в одно место.»', name: 'Светлана', role: 'Estyle Properties Spain · AI / SEO / Mediaelx', index: '01 / 06' },
  nivellux: { quote: '«Мы пришли не просто за сайтом. RESET помог упаковать компанию: от названия и позиционирования до рекламы, кейсов и понятного направления роста.»', name: 'Богдан', role: 'NIVELLUX · строительство и ремонты / Валенсия', index: '02 / 06' },
  dominant: { quote: '«Для выхода на рынок Испании мы собрали не отдельный инструмент, а рабочую основу: базу девелоперов, процессы команды, партнёрства и знания в одном пространстве.»', name: 'Анастасия', role: 'Dominant Spain · международное направление', index: '03 / 06' },
  factor: { quote: '«Запрос на рекламу стал началом более важной работы: увидели слабые места сайта, соцсетей и обработки заявок. Теперь закрываем разрыв между лидом и продажей.»', name: 'Вадим', role: 'Агентство «Фактор» · Meta Ads и консалтинг продаж', index: '04 / 06' },
  delmar: { quote: '«Мини-приложение стало для каждого агента своим сайтом в кармане: подборки отправляются за секунды, а Telegram превращается в самостоятельный канал работы с аудиторией.»', name: 'Юлия', role: 'DELMAR · Telegram Mini App', index: '05 / 06' },
  domstar: { quote: '«Получили не просто подключение базы, а личное сопровождение: настройку процесса, обучение команды и развитие базы знаний, с которой агенты действительно могут работать.»', name: 'Кристина', role: 'DOMSTAR · интеграция базы и RAG-знания', index: '06 / 06' },
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

const diagnosticForm = document.querySelector('#diagnostic-form');

diagnosticForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!diagnosticForm.checkValidity()) {
    diagnosticForm.reportValidity();
    return;
  }
  diagnosticForm.classList.add('is-sent');
  diagnosticForm.querySelector('.diagnostic-submit').innerHTML = 'Запрос принят <b>✓</b>';
});

const caseStudiesSlider = document.querySelector('[data-case-studies-slider]');

if (caseStudiesSlider) {
  const caseSlides = [...caseStudiesSlider.querySelectorAll('[data-case-slide]')];
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
