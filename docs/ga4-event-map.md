# GA4: карта событий RESET

Статус на 2026-08-16: production-поток `RESET — Web` (`G-TW7GHVZLVD`) подключён к собственному аккаунту `RESET Digital`; события подтверждены в Realtime. Стандартный список «Недавние события» в GA4 может обновляться до 24 часов.

Сбор срабатывает только после согласия на аналитические cookies. В события не передаются имя, телефон, email, текст заявки, URL с персональными данными или содержимое полей.

## Основная воронка

`page_view` → `cta_click` → `lead_form_open` → `form_start` → `generate_lead`

Главным key event (конверсией) в GA4 должен быть только `generate_lead`. Когда оно появится во вкладке «Недавние события», отметить его звёздочкой. `contact_click` можно включить как вторичную конверсию, когда появится реклама.

## События в коде

| Событие | Что означает | Параметры |
| --- | --- | --- |
| `page_view` | просмотр страницы | `language`, `page_path`, `page_title` |
| `section_view` | пользователь увидел 50% смыслового блока | `section_id` |
| `scroll_depth` | дошёл до 25/50/75/90% страницы | `percent_scrolled` |
| `navigation_click` | клик в header/footer/breadcrumbs | `navigation_area`, `target_label` |
| `language_change` | смена языка | `language_from`, `language_to` |
| `cta_click` | клик по основной CTA | `cta_label`, `cta_location`, `target_type` |
| `service_interest` | интерес к карточке услуги | `service_name`, `section_id` |
| `scenario_select` | выбран сценарий проблемы в навигаторе | `scenario`, `scenario_label` |
| `case_select` | переключён кейс в слайдере | `case_name`, `direction` |
| `case_open` | переход в отдельный кейс | `case_name`, `cta_location` |
| `lead_form_open` | открыта форма заявки | `lead_source` |
| `form_start` | начато заполнение формы | `lead_source` |
| `form_field_interaction` | первое взаимодействие с полем | `lead_source`, `field_name` |
| `form_validation_error` | поле не прошло проверку браузера | `lead_source`, `field_name` |
| `form_submit_error` | заявка не ушла из-за сетевой/серверной ошибки | `lead_source`, `error_type` |
| `generate_lead` | заявка успешно принята сервером | `lead_source`, `contact_method` |
| `contact_click` | клик на email/телефон/Telegram | `contact_type`, `cta_location` |

## Что зарегистрировать в GA4

В **Администратор → Пользовательские определения → Создать пользовательское определение** добавьте параметры уровня события:

`language`, `section_id`, `percent_scrolled`, `navigation_area`, `target_label`, `language_from`, `language_to`, `cta_label`, `cta_location`, `target_type`, `service_name`, `scenario`, `scenario_label`, `case_name`, `direction`, `lead_source`, `contact_method`, `field_name`, `error_type`, `contact_type`.

Не создавайте custom dimensions для `page_location`, `page_path`, `page_title`: это стандартные параметры GA4.

## Отчёты

В Exploration создайте Funnel exploration с шагами основной воронки, а в Breakdown используйте `language`, `Session source / medium`, `device category` и `landing page`. Для визуального просмотра действий и кликов следующим этапом подключается Microsoft Clarity с отдельным согласием и маскированием всех полей формы.
