# Общий интерфейс RESET

Обновлено 22 сентября 2026. Тексты статей и административное содержание ведутся отдельно.

## Источники

- `design-tokens.css`: общие цвета, шрифт, размеры контролов. Семантические `--color-*` предназначены для новых компонентов. `--tone-*` сохраняют существующие оттенки и прозрачности иллюстраций/старых композиций без изменения всей палитры. Не добавлять новые локальные HEX вместо токенов.
- `shared-ui.css`: шапка, логотип, навигация, футер, основные CTA, формы, контрастность и чтение статей. Кнопка в шапке плоская. У остальных основных CTA две совпадающие тени в покое, две разнесённые при hover, сжатие при active. Табы, фильтры и управляющие кнопки слайдеров остаются отдельным типом контролов.
- `ui-copy.js`: RU/UK/EN/ES для общего интерфейса и форм.
- `site-ui.js`: единый шаблон шапки, футера и формы. Презентации сохраняют отдельный печатный/слайдовый каркас.
- `shared-ui.js`: модальное окно, одинаковое поведение CTA, контактные методы, валидация, отправка и локализованные состояния.
- `arrow-icons.js`: SVG вместо текстовых стрелок, маркеров и декоративных символов, включая динамический текст. CSS-псевдоэлементы используют SVG-маски.
- `lead-data.js`: нормализация заявки и сохранение компании/четырёх способов связи для уведомления.

## Статические файлы и сервер

`npm run build:ui` обновляет оболочку существующих HTML без переписывания содержимого статей и кейсов. Команда идемпотентна; после генераторов локалей или добавления страниц запускать её ещё раз. Не редактировать сгенерированную шапку отдельно в каждой локали.

`server.js` применяет тот же шаблон при выдаче HTML. Поэтому новые страницы тоже получают общий интерфейс. Статические файлы уже содержат оболочку и работают в обычном статическом превью. Изменённые CSS/JS имеют общую версию ресурсов для сброса старого кэша.

Переключатель языка открывает перевод текущей страницы, если он существует. Если перевод ещё не подготовлен, ссылка ведёт в соответствующий раздел выбранного языка и снабжена пояснением. Активный язык остаётся на текущем материале. Переводы статей автоматически не создаются.

«Все кейсы» ведёт в `/{locale}/#case-index` на главной. Отдельная страница каталога сейчас не требуется. После уточнения владельца каталог восстановлен до 15 карточек: все 10 проектов из карусели, два архитектурных кейса, ESTYLE и две карточки-заглушки Kommo / FACTOR SEO. Незавершённые страницы не дописывались. SEO-фильтр содержит ESTYLE и FACTOR SEO.

## Формы

Общая модальная и встроенная формы используют один контракт: имя, компания, контактный метод, контакт, задача, согласие, источник, язык и страница. Имя, компания и задача необязательны. Номер вводится полностью с международным кодом; Telegram допускает username. Сервер сохраняет `phone`, `telegram`, `whatsapp`, `email` без сведения к телефону.

Основные CTA связи открывают одно модальное окно. Прямой URL `#contact` сохраняет переход к встроенной форме. Нативный `dialog` обеспечивает ограничение фокуса, Escape и возврат фокуса. Незавершённый ввод сохраняется при закрытии.

## Проверки

`npm test`: поведение фильтров и слайдера, контракт контактных методов, идемпотентность шаблона, общий каркас всех страниц, наличие языковых целей и определение токенов.

`node scripts/audit-locales.mjs`: локальные переходы.

Вручную проверяются 360/390/768/1440 px, меню, формы, контрастность обычных/выбранных контролов и отсутствие текстовых иконок. Отправка реальных уведомлений не является частью визуальной проверки.


Для кейсов применяются минимумы 16 px (основной текст), 14 px (подписи) и 12 px (технические метки) из `docs/reset-visual-system.md`. Скриншоты рекламных кейсов вписываются целиком. Google Ads использует строки «скриншот + его пояснение». NIVELLUX и Estate CRM используют CSS-рамки браузера; мобильный NIVELLUX ограничен высотой экрана.

Адреса социальных сетей задаются в `socialLinks` в `site-ui.js`. Instagram и Threads ожидают точных адресов от владельца и пока показаны как «Скоро», без неработающих ссылок.

### Образцовая страница NIVELLUX

`nivellux-case.css` и класс `nivellux-case` содержат новый вариант для визуального согласования. На десктопе обложка широкая, на мобильном используется мобильный ассет. Повтор мобильного изображения ниже скрыт только на мобильном экране. Скриншоты услуг и портфолио связаны с соответствующими пояснениями.

`renderSiteUI` пока применяет новый переключатель языка, бургер без текстовой подписи и упрощённые подписи формы только к этому классу. В этой версии футера Instagram и Threads показаны без статуса «Скоро». После согласования образца нужно перенести общие решения на сайт и продолжить ранее согласованные исправления Telegram, VIA Widget, обложек остальных кейсов, контраста услуг и общей нумерации 15 кейсов.

### Estate CRM — staged review, 2026-09-22

The user requested one case at a time, with explicit visual approval before proceeding. Estate CRM now uses the approved NIVELLUX proportions in isolated `estate-case.css`: full-width dashboard, two screenshot/explanation rows, plain captions, compact integrations, reference header/form/footer controls. All five HTML copies are updated, and its navigation shows 12 / 15. Existing desktop screenshots are preserved fully on mobile; no mobile product UI or lightbox was invented. Other cases and homepage previews remain pending their own review.

Validation: 12 automated tests passed; Russian, Ukrainian, English and Spanish checked at 360, 768 and 1440 pixels with no horizontal overflow; desktop and 390-pixel mobile layouts visually reviewed. Preview: `/ru/cases/delmar-custom-crm.html?review=crm1`. Await user approval before Dominanta or any further case redesign.

### Dominanta / Notion — staged review, 2026-09-22

Estate CRM was approved by the user. The next isolated case is Dominanta, using `dominanta-case.css` and the reference shell. Its cover no longer has the enclosing card or overlapping label; the title is responsive, full screenshots have thin window frames, and developer/project notes are paired with the project screenshot while listing notes are paired with listings. Calculator captions precede the screenshots. Natural image dimensions reserve layout space. All five HTML copies updated; navigation is 10 / 15. No lightbox or fabricated mobile product UI added.

Validation: 12 tests passed; all four locales checked at 360, 768 and 1440 pixels with no horizontal overflow; mobile cover and calculators, desktop cover and content visually checked. Preview `/ru/cases/dominanta-spain.html?review=d1a`. Wait for approval before proceeding to Delmar Meta Ads. Homepage previews and the wider queue remain pending.

### Delmar Meta Ads — staged review, 2026-09-22

Dominanta was approved. Delmar Meta Ads is now the only case awaiting review in this iteration. `delmar-ads-case.css` removes the heavy cover card, preserves the full creative, adapts the cover to one column on mobile, and displays all three creatives without crop. Campaign and ad-level evidence is paired with its corresponding metrics. Captions describe the evidence/offers in all locales; intrinsic image dimensions reserve space; navigation is 11 / 15. Reference header, form and footer applied only to this case.

Validation: 12 automated tests pass. Four locales checked at 360, 768 and 1440 pixels without horizontal overflow; all case images use contain. Desktop/mobile cover and mobile gallery visually inspected. Preview `/ru/cases/delmar-meta-ads.html?review=dm1`. Wait for user approval before the next case. No other case or homepage previews redesigned in this iteration.

### VIA Properties / Telegram — staged review, 2026-09-22

Delmar Meta Ads was approved on desktop and mobile. Telegram is the next isolated review. Added `telegram-case.css`: simplified phone cover, complete scenario screenshots in a grid with controls below (no overlapping controls or clipped phones), reference shell. Removed the redundant product-interface section from all five HTML copies; its capabilities were already described in the preceding scenario section. Client slides now use 1.png, 2.png, 3.png, with the actual intermediate dialogue screenshot verified visually. Agent slides remain 4.png, 5.png, 6.png. These two sliders are manually controlled by `telegram-refinement.js` and no longer initialized by the generic autoplay handler. Navigation is 08 / 15; section numbers updated.

Validation: 12 existing automated tests pass; both roles and all six screens exercised in browser, including wraparound and matching copy/counter; four locales at 360, 768, 1440 pixels without overflow. Mobile cover and intermediate dialogue and desktop agent layout visually checked. Preview `/ru/cases/telegram-ai-crm.html?review=t1`. Await user approval before VIA Widget or further changes.

### VIA Widget — staged review, 2026-09-22

Telegram was approved. VIA Widget now uses isolated `widget-case.css`: full cover screenshot with caption below, no overlapping badge or clipped screen, static content-based demo layout, and a closed 2-column mobile step grid with the fifth step spanning the row. Removed blue inset active stripe and decorative orbits. Conversion screenshots have no outer panels or overlay captions. Reference shell applied, navigation 13 / 15. Widget demo is manual on reviewed pages and retains the selected step after scrolling away and back.

Validation: 12 automated tests passed; all five buttons verified against image/title/number in browser; four locales checked at 360, 768 and 1440 pixels without horizontal overflow. Desktop cover, mobile full cover and step grid visually inspected. Preview `/ru/cases/via-ai-widget.html?review=w2`. Await user approval before next work. Remaining queue includes Factor Meta Ads cover, Shepit Google Ads presentation, homepage preview consistency, sitewide shell/contrast and 15-case counters; do not redesign approved Bulgarian cases or legacy Shepit website.

### Factor Meta Ads — staged review, 2026-09-22

VIA Widget was approved. Factor now uses isolated `factor-case.css` following the approved Delmar Ads layout: full cover image without crop/outer card, plain caption, responsive title, two evidence rows paired with the matching branch metrics. All six creative screenshots retained and captions identify branch 1 or 4. Natural dimensions reserve image space. All five HTML copies updated; reference shell applied, navigation 04 / 15.

Validation: 12 automated tests passed; four locales at 360, 768, 1440 pixels without horizontal overflow; desktop/mobile cover and mobile gallery visually checked. Preview `/ru/cases/an-factor.html?review=f1`. Await approval before Shepit Google Ads or further work. Homepage previews/global shell/count reconciliation remain pending.

### Shepit Google Ads — audit only, 2026-09-22

Factor approved. User recalled Google was already corrected and asked only to check it. Confirmed existing three evidence rows and 14px captions/source note; desktop and mobile visually inspected and four locales at 360/768/1440 checked without overflow. Only changed stale navigation 04 / 12 to 07 / 15 in five HTML copies. No redesign or shell rollout. User's existing browser tab showed older content titled «Поисковая реклама для продажи домов»; fresh query returned current local «CTR 6,15%…». Opened fresh preview `/ru/cases/shepit-google-ads.html?review=gcheck2`, leaving user's original tab intact. Pending: home covers (including NIVELLUX), sitewide header/form/footer rollout, pale services card, overall counts. Wait for user steering; do not assume new case approval from this audit.

### Google cover correction — 2026-09-22

User cancelled the homepage-cover work before it started and rejected Google's oversized cover card with tiny graph and huge badge. Only the Google hero is now restyled through `google-cover.css` in all five HTML copies: natural-ratio full-width graph below the introduction, no padded outer card/shadow/overlay, plain 14px caption. Other case sections preserved. Desktop 1440 and mobile390 visually inspected; four locales at360/768/1440 checked for overflow, border removal and static caption. Preview `/ru/cases/shepit-google-ads.html?review=g1`. Await approval before returning to homepage covers. Previous audit incorrectly treated the cover as acceptable; corrected after user screenshot.

### 2026-09-22 — homepage case covers, review c2
After Google cover approval, updated hero and catalogue previews on all five homepages. Added isolated `home-case-covers.css`: full uncropped creative/report images, subtle browser frames for software, complete portrait screens for Telegram and VIA, responsive NIVELLUX mobile source. Removed duplicate hero image labels and orbit decorations for these previews. Preserved the 10 selected hero projects, all 15 catalogue entries, filters, and untouched architecture/legacy Shepit covers. Checked 390px and 1440px browser views, responsive asset loading, catalogue count and filtering. All 12 existing tests pass; diff whitespace check passes. Awaiting user visual approval before further homepage work.

### 2026-09-22 — final shared shell rollout (ui7)
Promoted approved reference controls site-wide through the shared renderer: icon-only accessible burger, language disclosure (UA label for Ukrainian), plain form labels with required validation retained, branded select/checkbox, navy input text, compact footer and unlinked Instagram/Threads without Coming soon. Added disclosure dismissal and mutual exclusion. Fixed homepage service text contrast and reconciled existing case-navigation counters with all 15 catalogue entries. Shared build updates page chrome only, preserving article/page bodies.
Validation: 12 tests passed, JS syntax and diff whitespace checks passed; all 15 Russian case routes checked at 390px/1440px with no document overflow or broken loaded images; four localized homepages checked at 390px (15 catalogue/10 hero entries, consistent service colors). Local asset/link existence scan for localized homes and cases passed. Visually reviewed mobile burger/languages, modal, services, footer and desktop contact/footer. Form contact-type switching and required contact/consent verified without submitting a live enquiry. Local server restarted to reload the renderer; preview /ru/?review=final2.
