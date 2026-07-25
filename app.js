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
