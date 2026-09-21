#!/usr/bin/env python3
"""Build the current advertising and Estate CRM case pages in every locale."""

from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "uk", "en", "es")

UI = {
    "ru": {"cases": "Кейсы", "services": "Услуги", "contact": "Обсудить задачу", "back": "← Все кейсы", "proof": "Подтверждение результата", "creative": "Креативы", "product": "Интерфейс продукта", "cta": "Есть похожая задача?", "cta_text": "Покажите нам проект и текущие цифры. Предложим следующий шаг и объясним, на чём его строим.", "button": "Обсудить задачу ↗", "home": "/ru/"},
    "uk": {"cases": "Кейси", "services": "Послуги", "contact": "Обговорити задачу", "back": "← Усі кейси", "proof": "Підтвердження результату", "creative": "Креативи", "product": "Інтерфейс продукту", "cta": "Є схоже завдання?", "cta_text": "Покажіть нам проєкт і поточні цифри. Запропонуємо наступний крок і пояснимо, на чому його будуємо.", "button": "Обговорити задачу ↗", "home": "/uk/"},
    "en": {"cases": "Cases", "services": "Services", "contact": "Discuss a project", "back": "← All cases", "proof": "Proof of performance", "creative": "Creative work", "product": "Product interface", "cta": "Working on a similar challenge?", "cta_text": "Show us the project and current numbers. We will suggest the next step and explain the reasoning behind it.", "button": "Discuss a project ↗", "home": "/en/"},
    "es": {"cases": "Casos", "services": "Servicios", "contact": "Hablar del proyecto", "back": "← Todos los casos", "proof": "Prueba del resultado", "creative": "Creatividades", "product": "Interfaz del producto", "cta": "¿Tienes un reto parecido?", "cta_text": "Enséñanos el proyecto y sus cifras actuales. Propondremos el siguiente paso y explicaremos el criterio.", "button": "Hablar del proyecto ↗", "home": "/es/"},
}

CASES = {
    "an-factor": {
        "kind": "ads", "client": "FACTOR", "service": "Meta Ads", "place": "Odesa / Ukraine",
        "hero": "/cases/factor_assets/creo_cuvee.png",
        "proof_images": ["/cases/factor_assets/factor_filial_1_2026.webp", "/cases/factor_assets/factor_filial_4_2026.webp"],
        "gallery": ["/cases/factor_assets/creo_cuvee.png", "/cases/factor_assets/creo_NY.png", "/cases/factor_assets/creo_price.png"],
        "copy": {
            "ru": {"title": "142 заявки для двух филиалов агентства недвижимости.", "lead": "Перезапустили Meta Ads для FACTOR и собрали отдельную подачу для двух филиалов. Кампании привели 142 обращения при средней стоимости $6,91.", "metrics": [("142", "заявки по двум филиалам"), ("$6,91", "средняя стоимость заявки"), ("$2,72", "лучший CPL креатива")], "section": "Один бренд, две локальные рекламные системы.", "cards": [("Разделили филиалы", "Каждый филиал получил собственные кампании, офферы и контроль результата."), ("Проверяли спрос креативами", "Сравнивали предложения об объектах, цене и сценариях покупки."), ("Масштабировали рабочее", "Сильные связки получили больший бюджет после подтверждения стоимости заявки.")], "proof_text": [("76", "заявок получил первый филиал при среднем CPL $6,27."), ("66", "заявок получил четвёртый филиал при среднем CPL $7,65."), ("$2,72", "лучший результат отдельного рекламного креатива.")], "conclusion": "FACTOR получил управляемый канал обращений для двух филиалов. Кампании можно развивать отдельно, сохраняя общую логику бренда."},
            "uk": {"title": "142 заявки для двох філій агентства нерухомості.", "lead": "Перезапустили Meta Ads для FACTOR і зібрали окрему подачу для двох філій. Кампанії принесли 142 звернення із середньою вартістю $6,91.", "metrics": [("142", "заявки за двома філіями"), ("$6,91", "середня вартість заявки"), ("$2,72", "найкращий CPL креативу")], "section": "Один бренд, дві локальні рекламні системи.", "cards": [("Розділили філії", "Кожна філія отримала власні кампанії, офери та контроль результату."), ("Перевіряли попит креативами", "Порівнювали пропозиції про об’єкти, ціну та сценарії купівлі."), ("Масштабували робоче", "Сильні зв’язки отримали більший бюджет після підтвердження вартості заявки.")], "proof_text": [("76", "заявок отримала перша філія із середнім CPL $6,27."), ("66", "заявок отримала четверта філія із середнім CPL $7,65."), ("$2,72", "найкращий результат окремого рекламного креативу.")], "conclusion": "FACTOR отримав керований канал звернень для двох філій. Кампанії можна розвивати окремо, зберігаючи спільну логіку бренду."},
            "en": {"title": "142 leads for two real estate agency branches.", "lead": "We relaunched Meta Ads for FACTOR with a dedicated setup for each branch. The campaigns generated 142 enquiries at an average CPL of $6.91.", "metrics": [("142", "leads across two branches"), ("$6.91", "average cost per lead"), ("$2.72", "best creative CPL")], "section": "One brand, two local acquisition systems.", "cards": [("Separated the branches", "Each branch received its own campaigns, offers and performance control."), ("Tested demand through creatives", "We compared property, price and buying-scenario propositions."), ("Scaled proven combinations", "Strong ad combinations received more budget once lead cost was confirmed.")], "proof_text": [("76", "leads for branch one at an average CPL of $6.27."), ("66", "leads for branch four at an average CPL of $7.65."), ("$2.72", "the best result from an individual creative.")], "conclusion": "FACTOR received a manageable enquiry channel for two branches. Each campaign can grow independently while staying within one brand logic."},
            "es": {"title": "142 leads para dos oficinas de una agencia inmobiliaria.", "lead": "Relanzamos Meta Ads para FACTOR con una estructura específica para cada oficina. Las campañas generaron 142 contactos con un CPL medio de $6,91.", "metrics": [("142", "leads entre dos oficinas"), ("$6,91", "coste medio por lead"), ("$2,72", "mejor CPL de una creatividad")], "section": "Una marca, dos sistemas locales de captación.", "cards": [("Separamos las oficinas", "Cada oficina recibió campañas, ofertas y control de resultados propios."), ("Probamos la demanda", "Comparamos propuestas basadas en inmuebles, precio y escenarios de compra."), ("Escalamos lo validado", "Las combinaciones sólidas recibieron más presupuesto al confirmar el coste por lead.")], "proof_text": [("76", "leads para la primera oficina con un CPL medio de $6,27."), ("66", "leads para la cuarta oficina con un CPL medio de $7,65."), ("$2,72", "el mejor resultado de una creatividad individual.")], "conclusion": "FACTOR obtuvo un canal gestionable de contactos para dos oficinas. Las campañas pueden crecer por separado bajo una misma lógica de marca."},
        },
    },
    "shepit-meta-ads": {
        "kind": "ads", "client": "SHEPIT HOUSE", "service": "Meta Ads", "place": "Kyiv region / Ukraine",
        "hero": "/cases/shepit_assets/meta_ads_creo1.png",
        "proof_images": ["/cases/shepit_assets/shepit_leads_2026.webp", "/cases/shepit_assets/shepit_leads_creo_2026.webp"],
        "gallery": ["/cases/shepit_assets/meta_ads_creo1.png", "/cases/shepit_assets/meta_ads_creo2.png", "/cases/shepit_assets/meta_ads_creo3.png"],
        "copy": {
            "ru": {"title": "215 заявок на дома. CPL кампаний снизился до $5,74.", "lead": "Для загородного проекта SHEPIT HOUSE последовательно обновляли офферы, креативы и настройки кампаний. Каждая итерация снижала стоимость обращения.", "metrics": [("215", "заявок в актуальных кампаниях"), ("$9,52", "средний CPL по трём кампаниям"), ("$5,15", "CPL ведущего креатива")], "section": "Продажа домов через последовательные рекламные итерации.", "cards": [("Показали продукт", "В креативах раскрыли дома, окружение проекта и ключевые условия покупки."), ("Сравнили офферы", "Каждая кампания проверяла новую подачу и давала данные для следующего запуска."), ("Снизили стоимость", "CPL кампаний последовательно прошёл путь $16,79 → $10,19 → $5,74.")], "proof_text": [("99", "заявок принесла самая результативная из трёх текущих кампаний."), ("$5,74", "стоимость заявки в кампании с лучшей экономикой."), ("96", "заявок получил ведущий креатив при CPL $5,15.")], "conclusion": "SHEPIT HOUSE получил устойчивую рекламную основу: 215 обращений и подтверждённую связку, которую можно масштабировать.", "source": "Суммы пересчитаны по согласованному курсу 45 ₴/$; исходные данные сохранены на скриншотах."},
            "uk": {"title": "215 заявок на будинки. CPL кампаній знизився до $5,74.", "lead": "Для заміського проєкту SHEPIT HOUSE послідовно оновлювали офери, креативи й налаштування кампаній. Кожна ітерація знижувала вартість звернення.", "metrics": [("215", "заявок в актуальних кампаніях"), ("$9,52", "середній CPL за трьома кампаніями"), ("$5,15", "CPL провідного креативу")], "section": "Продаж будинків через послідовні рекламні ітерації.", "cards": [("Показали продукт", "У креативах розкрили будинки, оточення проєкту та ключові умови купівлі."), ("Порівняли офери", "Кожна кампанія перевіряла нову подачу й давала дані для наступного запуску."), ("Знизили вартість", "CPL кампаній послідовно пройшов шлях $16,79 → $10,19 → $5,74.")], "proof_text": [("99", "заявок принесла найрезультативніша з трьох поточних кампаній."), ("$5,74", "вартість заявки в кампанії з найкращою економікою."), ("96", "заявок отримав провідний креатив за CPL $5,15.")], "conclusion": "SHEPIT HOUSE отримав стійку рекламну основу: 215 звернень і підтверджену зв’язку, яку можна масштабувати.", "source": "Суми перераховано за погодженим курсом 45 ₴/$; вихідні дані збережено на скриншотах."},
            "en": {"title": "215 house enquiries. Campaign CPL fell to $5.74.", "lead": "For the SHEPIT HOUSE residential project, we iterated on offers, creatives and campaign settings. Each round lowered the cost of an enquiry.", "metrics": [("215", "leads in the current campaigns"), ("$9.52", "average CPL across three campaigns"), ("$5.15", "leading creative CPL")], "section": "Selling homes through successive ad iterations.", "cards": [("Presented the product", "The creatives showed the homes, project setting and key purchase conditions."), ("Compared offers", "Each campaign tested a new angle and supplied data for the next launch."), ("Lowered acquisition cost", "Campaign CPL progressed from $16.79 to $10.19 and then $5.74.")], "proof_text": [("99", "leads from the strongest of the three current campaigns."), ("$5.74", "lead cost in the campaign with the best economics."), ("96", "leads from the leading creative at a CPL of $5.15.")], "conclusion": "SHEPIT HOUSE gained a reliable advertising foundation: 215 enquiries and a validated combination ready to scale.", "source": "Figures converted at the agreed exchange rate of UAH 45 per USD; source values remain visible in the screenshots."},
            "es": {"title": "215 solicitudes de casas. El CPL bajó hasta $5,74.", "lead": "Para el proyecto residencial SHEPIT HOUSE iteramos ofertas, creatividades y ajustes de campaña. Cada ronda redujo el coste de contacto.", "metrics": [("215", "leads en las campañas actuales"), ("$9,52", "CPL medio de tres campañas"), ("$5,15", "CPL de la creatividad líder")], "section": "Venta de viviendas mediante iteraciones publicitarias.", "cards": [("Mostramos el producto", "Las creatividades presentaron las casas, el entorno y las condiciones clave de compra."), ("Comparamos ofertas", "Cada campaña probó un enfoque nuevo y aportó datos para el siguiente lanzamiento."), ("Reducimos el coste", "El CPL de las campañas pasó de $16,79 a $10,19 y finalmente a $5,74.")], "proof_text": [("99", "leads de la campaña más eficaz de las tres actuales."), ("$5,74", "coste por lead de la campaña con mejor rendimiento."), ("96", "leads de la creatividad líder con un CPL de $5,15.")], "conclusion": "SHEPIT HOUSE obtuvo una base publicitaria sólida: 215 contactos y una combinación validada lista para escalar.", "source": "Importes convertidos al cambio acordado de 45 UAH por USD; los datos de origen permanecen en las capturas."},
        },
    },
    "delmar-meta-ads": {
        "kind": "ads", "client": "DELMAR", "service": "Meta Ads", "place": "Odesa / Ukraine",
        "hero": "/cases/delmar_meta_assets/delmar_creo1.webp",
        "proof_images": ["/cases/delmar_meta_assets/delmar_leads.webp", "/cases/delmar_meta_assets/delmar_leads_creo.webp"],
        "gallery": ["/cases/delmar_meta_assets/delmar_creo1.webp", "/cases/delmar_meta_assets/delmar_creo2.webp", "/cases/delmar_meta_assets/delmar_creo3.webp"],
        "copy": {
            "ru": {"title": "103 заявки на недвижимость по $6,79.", "lead": "Для агентства Delmar собрали Meta Ads вокруг конкретных объектов и понятных условий покупки. Кампании дали 103 обращения при расходе $698,90.", "metrics": [("103", "заявки из Meta Ads"), ("$6,79", "средняя стоимость заявки"), ("$2,52", "лучший CPL креатива")], "section": "Три разных оффера, одна понятная цель — обращение.", "cards": [("Готовые объекты", "Показывали дефицит предложения и конкретную стартовую стоимость."), ("Инвестиционная подача", "Раскрывали цену объекта и потенциальный ежемесячный доход."), ("Доступный первый платёж", "Снижали барьер входа через понятную сумму первого взноса.")], "proof_text": [("64", "заявки принесла самая объёмная кампания при CPL $5,88."), ("$4,08", "CPL креатива, который дал 20 обращений."), ("$2,52", "лучший CPL: 14 заявок с одного объявления.")], "conclusion": "Delmar получил рекламную систему, которая продаёт разные типы объектов через отдельные сильные офферы."},
            "uk": {"title": "103 заявки на нерухомість по $6,79.", "lead": "Для агентства Delmar зібрали Meta Ads навколо конкретних об’єктів і зрозумілих умов купівлі. Кампанії дали 103 звернення за витрат $698,90.", "metrics": [("103", "заявки з Meta Ads"), ("$6,79", "середня вартість заявки"), ("$2,52", "найкращий CPL креативу")], "section": "Три різні офери, одна зрозуміла мета — звернення.", "cards": [("Готові об’єкти", "Показували дефіцит пропозиції та конкретну стартову вартість."), ("Інвестиційна подача", "Розкривали ціну об’єкта й потенційний щомісячний дохід."), ("Доступний перший платіж", "Знижували бар’єр входу через зрозумілу суму першого внеску.")], "proof_text": [("64", "заявки принесла наймасштабніша кампанія за CPL $5,88."), ("$4,08", "CPL креативу, який дав 20 звернень."), ("$2,52", "найкращий CPL: 14 заявок з одного оголошення.")], "conclusion": "Delmar отримав рекламну систему, що продає різні типи об’єктів через окремі сильні офери."},
            "en": {"title": "103 real estate leads at $6.79 each.", "lead": "For Delmar, we built Meta Ads around specific properties and clear purchase terms. The campaigns generated 103 enquiries on $698.90 of spend.", "metrics": [("103", "leads from Meta Ads"), ("$6.79", "average cost per lead"), ("$2.52", "best creative CPL")], "section": "Three distinct offers with one clear goal: an enquiry.", "cards": [("Ready properties", "We used limited availability and a concrete starting price."), ("Investment angle", "The proposition combined property price with potential monthly income."), ("Accessible first payment", "A clear initial payment lowered the entry barrier.")], "proof_text": [("64", "leads from the highest-volume campaign at a CPL of $5.88."), ("$4.08", "CPL of the creative that produced 20 enquiries."), ("$2.52", "the best CPL: 14 leads from one ad.")], "conclusion": "Delmar received an ad system that sells different property types through focused, strong offers."},
            "es": {"title": "103 leads inmobiliarios a $6,79.", "lead": "Para Delmar construimos Meta Ads alrededor de inmuebles concretos y condiciones de compra claras. Las campañas generaron 103 contactos con una inversión de $698,90.", "metrics": [("103", "leads desde Meta Ads"), ("$6,79", "coste medio por lead"), ("$2,52", "mejor CPL de una creatividad")], "section": "Tres ofertas distintas con un objetivo claro: el contacto.", "cards": [("Inmuebles listos", "Mostramos la disponibilidad limitada y un precio inicial concreto."), ("Enfoque de inversión", "La propuesta unió el precio del inmueble con el ingreso mensual potencial."), ("Primera aportación accesible", "Una cuota inicial clara redujo la barrera de entrada.")], "proof_text": [("64", "leads de la campaña de mayor volumen con un CPL de $5,88."), ("$4,08", "CPL de la creatividad que produjo 20 contactos."), ("$2,52", "el mejor CPL: 14 leads desde un anuncio.")], "conclusion": "Delmar obtuvo un sistema publicitario que vende distintos tipos de inmueble mediante ofertas claras y específicas."},
        },
    },
    "delmar-custom-crm": {
        "kind": "crm", "client": "DELMAR", "service": "Estate CRM", "place": "Real estate operations",
        "hero": "/cases/estate_crm_assets/dashboard4.webp",
        "proof_images": ["/cases/estate_crm_assets/funnel.webp", "/cases/estate_crm_assets/properties.webp"],
        "gallery": ["/cases/estate_crm_assets/dashboard1.webp", "/cases/estate_crm_assets/integrations.webp"],
        "copy": {
            "ru": {"title": "Estate CRM для Delmar: от заявки до подборки объекта.", "lead": "Система принимает обращения, ведёт их по воронке, связывает сделки с базой недвижимости и помогает менеджеру отправить клиенту подходящие объекты. Руководитель видит работу команды на одном дашборде.", "metrics": [("Воронка", "заявки, этапы, задачи и следующий контакт"), ("Каталог", "объекты, поиск и подборки для клиента"), ("Дашборд", "нагрузка команды и точки внимания")], "section": "Что Estate CRM делает в ежедневной работе Delmar.", "cards": [("Собирает обращения", "Заявки из Meta, Telegram и таблиц попадают в единую воронку с источником и ответственным менеджером."), ("Ускоряет подбор", "Менеджер ищет объект по параметрам, открывает карточку и собирает варианты для конкретного клиента."), ("Даёт контроль руководителю", "Дашборд показывает просроченные задачи, сделки без ответственного и клиентов без следующего шага.")], "proof_heading": "Две ключевые сущности: сделки и объекты.", "proof_captions": ["Воронка сделок: этап, источник, ответственный и следующий шаг", "Каталог объектов: карточки, параметры, цены и быстрый поиск"], "proof_text": [("01 / ЗАЯВКА", "Воронка показывает этап сделки, источник, ответственного и действие, которое должен сделать менеджер."), ("02 / ОБЪЕКТ", "Каталог объединяет карточки недвижимости, цены, характеристики и поиск по жилому комплексу или застройщику."), ("03 / ПОДБОРКА", "Выбранные объекты можно собрать под запрос клиента и отправить из рабочего сценария менеджера.")], "gallery_captions": ["Дашборд руководителя: задачи, ответственные и сделки, требующие внимания", "Интеграции: Meta Lead Ads, Telegram, Google Sheets, телефония и импорт данных"], "conclusion": "В результате команда ведёт клиента, работает с объектами и контролирует следующий шаг в одной системе. Руководителю доступна картина работы агентства без ручной сверки нескольких сервисов."},
            "uk": {"title": "Estate CRM для Delmar: від заявки до добірки об’єктів.", "lead": "Система приймає звернення, веде їх воронкою, пов’язує угоди з базою нерухомості й допомагає менеджеру надіслати клієнту відповідні об’єкти. Керівник бачить роботу команди на одному дашборді.", "metrics": [("Воронка", "заявки, етапи, завдання й наступний контакт"), ("Каталог", "об’єкти, пошук і добірки для клієнта"), ("Дашборд", "навантаження команди й точки уваги")], "section": "Що Estate CRM робить у щоденній роботі Delmar.", "cards": [("Збирає звернення", "Заявки з Meta, Telegram і таблиць потрапляють у єдину воронку з джерелом і відповідальним менеджером."), ("Прискорює добір", "Менеджер шукає об’єкт за параметрами, відкриває картку й збирає варіанти для конкретного клієнта."), ("Дає контроль керівнику", "Дашборд показує прострочені завдання, угоди без відповідального та клієнтів без наступного кроку.")], "proof_heading": "Дві ключові сутності: угоди й об’єкти.", "proof_captions": ["Воронка угод: етап, джерело, відповідальний і наступний крок", "Каталог об’єктів: картки, параметри, ціни та швидкий пошук"], "proof_text": [("01 / ЗАЯВКА", "Воронка показує етап угоди, джерело, відповідального й дію, яку має виконати менеджер."), ("02 / ОБ’ЄКТ", "Каталог об’єднує картки нерухомості, ціни, характеристики й пошук за житловим комплексом або забудовником."), ("03 / ДОБІРКА", "Вибрані об’єкти можна зібрати під запит клієнта й надіслати з робочого сценарію менеджера.")], "gallery_captions": ["Дашборд керівника: завдання, відповідальні й угоди, що потребують уваги", "Інтеграції: Meta Lead Ads, Telegram, Google Sheets, телефонія та імпорт даних"], "conclusion": "Команда веде клієнта, працює з об’єктами й контролює наступний крок в одній системі. Керівнику доступна картина роботи агентства без ручної звірки кількох сервісів."},
            "en": {"title": "Estate CRM for Delmar: from enquiry to property selection.", "lead": "The system captures enquiries, moves them through the pipeline, connects deals to the property database and helps an agent send relevant options to a client. Management sees the team’s work on one dashboard.", "metrics": [("Pipeline", "leads, stages, tasks and the next contact"), ("Catalogue", "properties, search and client selections"), ("Dashboard", "team workload and items needing attention")], "section": "What Estate CRM does in Delmar’s daily operation.", "cards": [("Captures enquiries", "Leads from Meta, Telegram and spreadsheets enter one pipeline with a source and responsible agent."), ("Speeds up selection", "An agent searches by parameters, opens a property card and assembles options for a specific client."), ("Gives management control", "The dashboard reveals overdue tasks, unassigned deals and clients with no next step.")], "proof_heading": "Two core entities: deals and properties.", "proof_captions": ["Deal pipeline: stage, source, owner and next action", "Property catalogue: cards, attributes, prices and fast search"], "proof_text": [("01 / ENQUIRY", "The pipeline shows the deal stage, source, owner and action the agent needs to take."), ("02 / PROPERTY", "The catalogue combines property cards, prices, attributes and search by development or developer."), ("03 / SELECTION", "Relevant properties can be assembled around a client request and shared from the agent’s workflow.")], "gallery_captions": ["Management dashboard: tasks, owners and deals that need attention", "Integrations: Meta Lead Ads, Telegram, Google Sheets, telephony and data imports"], "conclusion": "The team now guides clients, works with properties and controls the next step in one system. Management has a clear view of agency operations without manually reconciling several services."},
            "es": {"title": "Estate CRM para Delmar: de la solicitud a la selección de inmuebles.", "lead": "El sistema recibe solicitudes, las mueve por el embudo, conecta las operaciones con la base de inmuebles y ayuda al agente a enviar opciones relevantes. Dirección ve el trabajo del equipo en un único panel.", "metrics": [("Embudo", "leads, etapas, tareas y siguiente contacto"), ("Catálogo", "inmuebles, búsqueda y selecciones"), ("Panel", "carga del equipo y puntos de atención")], "section": "Qué aporta Estate CRM al trabajo diario de Delmar.", "cards": [("Recoge las solicitudes", "Los leads de Meta, Telegram y hojas entran en un embudo con fuente y agente responsable."), ("Agiliza la selección", "El agente busca por parámetros, abre la ficha y reúne opciones para un cliente concreto."), ("Da control a dirección", "El panel muestra tareas vencidas, operaciones sin responsable y clientes sin siguiente paso.")], "proof_heading": "Dos entidades centrales: operaciones e inmuebles.", "proof_captions": ["Embudo: etapa, fuente, responsable y siguiente acción", "Catálogo: fichas, características, precios y búsqueda rápida"], "proof_text": [("01 / SOLICITUD", "El embudo muestra la etapa, la fuente, el responsable y la acción que debe realizar el agente."), ("02 / INMUEBLE", "El catálogo reúne fichas, precios, características y búsqueda por promoción o promotor."), ("03 / SELECCIÓN", "Los inmuebles relevantes se reúnen según la solicitud del cliente y se comparten desde el flujo del agente.")], "gallery_captions": ["Panel de dirección: tareas, responsables y operaciones que requieren atención", "Integraciones: Meta Lead Ads, Telegram, Google Sheets, telefonía e importación de datos"], "conclusion": "El equipo acompaña al cliente, trabaja con inmuebles y controla el siguiente paso en un solo sistema. Dirección obtiene una vista clara de la agencia sin conciliar manualmente varios servicios."},
        },
    },
    "dominanta-spain": {
        "kind": "notion", "client": "DOMINANTA", "service": "Notion workspace", "place": "Málaga + Valencia / Spain",
        "hero": "/cases/notion_assets/developers_database.webp",
        "proof_images": ["/cases/notion_assets/developers_database_projects.webp", "/cases/notion_assets/developers_database_listings.webp"],
        "gallery": ["/cases/notion_assets/ROI_calc.webp", "/cases/notion_assets/mortgage_calc.webp", "/cases/notion_assets/tax_calc.webp"],
        "copy": {
            "ru": {"title": "База знаний и расчётов для выхода агентства на рынок Испании.", "lead": "Для Dominanta собрали рабочее пространство в Notion для партнёрств с застройщиками Малаги и Валенсии. В одной системе агент получает данные о партнёрах, проектах, объектах и расчёты для консультации клиента.", "metrics": [("Партнёры", "застройщики, регионы и условия сотрудничества"), ("Объекты", "проекты, лоты, цены и характеристики"), ("Расчёты", "ROI, ипотека и налоги по сценарию клиента")], "section": "Как агентство работает с новым рынком внутри Notion.", "cards": [("Фиксирует партнёрства", "Информация от застройщиков хранится в единой базе с регионами, проектами, стартовыми ценами и рабочими ссылками."), ("Связывает три уровня", "Застройщик открывает список своих проектов, а каждый проект — актуальный перечень объектов и характеристик."), ("Помогает консультировать", "Агент использует калькуляторы доходности, ипотеки и налогов прямо во время подготовки предложения клиенту.")], "proof_heading": "Три уровня базы: застройщик, проект, объект.", "proof_captions": ["Карточка застройщика и связанные проекты в Малаге и Валенсии", "База объектов: цена, площадь, комнаты, этаж и принадлежность к проекту"], "proof_text": [("01 / ЗАСТРОЙЩИК", "Партнёрская карточка хранит географию работы, стартовую стоимость, комментарии и доступ к проектам."), ("02 / ПРОЕКТ", "Проекты сгруппированы по городу, стадии строительства, формату недвижимости и цене входа."), ("03 / ОБЪЕКТ", "Листинги дают агенту конкретные варианты с площадью, комнатами, этажом, ценой и другими параметрами.")], "gallery_captions": ["ROI-калькулятор использует рыночные показатели Tinsa Market, локацию, тип объекта и стадию проекта", "Ипотечный калькулятор учитывает первый взнос, статус резидента, доход, возраст и срок кредита", "Налоговый калькулятор показывает ITP или AJD, нотариальные и регистрационные расходы"], "conclusion": "Команда получила понятную среду для запуска испанского направления. Новый агент может изучить партнёров, найти объект и подготовить финансовую часть предложения в одном рабочем пространстве."},
            "uk": {"title": "База знань і розрахунків для виходу агенції на ринок Іспанії.", "lead": "Для Dominanta зібрали робочий простір у Notion для партнерств із забудовниками Малаги та Валенсії. В одній системі агент отримує дані про партнерів, проєкти, об’єкти й розрахунки для консультації клієнта.", "metrics": [("Партнери", "забудовники, регіони й умови співпраці"), ("Об’єкти", "проєкти, лоти, ціни й характеристики"), ("Розрахунки", "ROI, іпотека й податки за сценарієм клієнта")], "section": "Як агенція працює з новим ринком усередині Notion.", "cards": [("Фіксує партнерства", "Інформація від забудовників зберігається в єдиній базі з регіонами, проєктами, стартовими цінами й робочими посиланнями."), ("Пов’язує три рівні", "Забудовник відкриває список своїх проєктів, а кожен проєкт — актуальний перелік об’єктів і характеристик."), ("Допомагає консультувати", "Агент використовує калькулятори дохідності, іпотеки й податків під час підготовки пропозиції клієнту.")], "proof_heading": "Три рівні бази: забудовник, проєкт, об’єкт.", "proof_captions": ["Картка забудовника й пов’язані проєкти в Малазі та Валенсії", "База об’єктів: ціна, площа, кімнати, поверх і належність до проєкту"], "proof_text": [("01 / ЗАБУДОВНИК", "Партнерська картка зберігає географію роботи, стартову вартість, коментарі й доступ до проєктів."), ("02 / ПРОЄКТ", "Проєкти згруповані за містом, стадією будівництва, форматом нерухомості й ціною входу."), ("03 / ОБ’ЄКТ", "Лістинги дають агенту конкретні варіанти з площею, кімнатами, поверхом, ціною та іншими параметрами.")], "gallery_captions": ["ROI-калькулятор використовує ринкові показники Tinsa Market, локацію, тип об’єкта й стадію проєкту", "Іпотечний калькулятор враховує перший внесок, статус резидента, дохід, вік і строк кредиту", "Податковий калькулятор показує ITP або AJD, нотаріальні й реєстраційні витрати"], "conclusion": "Команда отримала зрозуміле середовище для запуску іспанського напряму. Новий агент може вивчити партнерів, знайти об’єкт і підготувати фінансову частину пропозиції в одному робочому просторі."},
            "en": {"title": "A knowledge and calculation system for entering the Spanish market.", "lead": "For Dominanta, we built a Notion workspace for partnerships with developers in Málaga and Valencia. One system gives agents access to partners, projects, listings and the calculations needed for client consultations.", "metrics": [("Partners", "developers, regions and cooperation terms"), ("Listings", "projects, units, prices and attributes"), ("Calculations", "ROI, mortgage and taxes for each client scenario")], "section": "How an agency works with a new market inside Notion.", "cards": [("Records partnerships", "Developer information lives in one database with regions, projects, entry prices and working links."), ("Connects three levels", "Each developer opens into its projects, and every project links to its current units and attributes."), ("Supports consultations", "Agents use ROI, mortgage and tax calculators while preparing a client proposal.")], "proof_heading": "Three database levels: developer, project and unit.", "proof_captions": ["Developer profile with related projects across Málaga and Valencia", "Property database with price, area, rooms, floor and project relationship"], "proof_text": [("01 / DEVELOPER", "The partner profile stores geography, entry price, comments and access to related projects."), ("02 / PROJECT", "Projects are grouped by city, construction phase, property format and entry price."), ("03 / UNIT", "Listings give an agent concrete options with area, rooms, floor, price and other attributes.")], "gallery_captions": ["The ROI calculator uses Tinsa Market indicators, location, property type and project phase", "The mortgage calculator uses down payment, residency, income, age and loan term", "The tax calculator shows ITP or AJD plus notary and registration costs"], "conclusion": "The team received a clear environment for launching its Spanish direction. A new agent can study partners, find a property and prepare the financial part of an offer in one workspace."},
            "es": {"title": "Una base de conocimiento y cálculo para entrar en el mercado español.", "lead": "Para Dominanta creamos un espacio de trabajo en Notion para colaborar con promotoras de Málaga y Valencia. El agente accede a socios, promociones, inmuebles y cálculos para asesorar al cliente desde un único sistema.", "metrics": [("Socios", "promotoras, regiones y condiciones de colaboración"), ("Inmuebles", "promociones, unidades, precios y características"), ("Cálculos", "ROI, hipoteca e impuestos para cada escenario")], "section": "Cómo trabaja una agencia con un mercado nuevo dentro de Notion.", "cards": [("Registra colaboraciones", "La información de las promotoras vive en una base con regiones, proyectos, precios de entrada y enlaces de trabajo."), ("Conecta tres niveles", "Cada promotora abre sus promociones y cada promoción enlaza sus unidades y características actuales."), ("Facilita el asesoramiento", "El agente utiliza calculadoras de rentabilidad, hipoteca e impuestos al preparar la propuesta del cliente.")], "proof_heading": "Tres niveles: promotora, promoción e inmueble.", "proof_captions": ["Ficha de la promotora y promociones relacionadas en Málaga y Valencia", "Base de inmuebles con precio, superficie, habitaciones, planta y promoción"], "proof_text": [("01 / PROMOTORA", "La ficha guarda su geografía, precio de entrada, comentarios y acceso a las promociones."), ("02 / PROMOCIÓN", "Las promociones se agrupan por ciudad, fase de construcción, tipo de inmueble y precio de entrada."), ("03 / INMUEBLE", "Los listados dan al agente opciones concretas con superficie, habitaciones, planta, precio y otros parámetros.")], "gallery_captions": ["La calculadora de ROI usa indicadores de Tinsa Market, ubicación, tipo de inmueble y fase del proyecto", "La calculadora hipotecaria usa entrada, residencia, ingresos, edad y plazo del préstamo", "La calculadora fiscal muestra ITP o AJD, notaría y registro"], "conclusion": "El equipo obtuvo un entorno claro para lanzar su línea española. Un agente nuevo puede estudiar socios, localizar un inmueble y preparar la parte financiera de la oferta en un solo espacio."},
        },
    },
    "bulgaria-masterplan": {
        "kind": "architecture", "client": "KALOFER SITE", "service": "Masterplan", "place": "Kalofer / Bulgaria",
        "hero": "/cases/architecture_assets/photorealistic-site.webp",
        "hero_fit": "cover",
        "proof_images": [
            "/cases/architecture_assets/axo-base.webp",
            "/cases/architecture_assets/axo-landscape.webp",
            "/cases/architecture_assets/masterplan-3d.webp",
        ],
        "gallery": [
            "/cases/architecture_assets/masterplan-explication.webp",
            "/cases/architecture_assets/masterplan-close.webp",
            "/cases/architecture_assets/masterplan-overview.webp",
        ],
        "copy": {
            "ru": {
                "title": "Генплан жилого проекта на 57 гектарах в Болгарии.",
                "lead": "Для горного участка возле Калофера разработали концепцию жилого проекта: разместили дома, дороги, веломаршруты, парковки, общественные и рекреационные зоны, затем собрали генеральный план и визуальную подачу для заказчика.",
                "metrics": [("57 га", "площадь проектируемой территории"), ("20 домов", "жилые кластеры в составе концепции"), ("14 зон", "объекты и сценарии в экспликации")],
                "section": "Территория получила структуру, по которой можно развивать проект.",
                "cards": [("Прочитали рельеф", "Разместили застройку и маршруты с учётом перепада высот, существующего ландшафта и лесного окружения."), ("Собрали зонирование", "Связали жилые кластеры с общественными, спортивными, рекреационными и сервисными зонами."), ("Подготовили подачу", "Перевели проектную схему в генплан с экспликацией и визуальную концепцию для обсуждения с заказчиком.")],
                "proof_heading": "От геометрии участка к ландшафтной концепции.",
                "proof_captions": ["Базовая аксонометрия фиксирует геометрию участка, дороги и расположение функциональных зон", "Ландшафтный слой показывает лесное окружение и связь застройки с природным контекстом", "Объёмная схема объединяет жилые кластеры, маршруты, водоём и общественные функции"],
                "proof_text": [("01 / РЕЛЬЕФ", "Отметки участка находятся в диапазоне 774–884 м. Планировка учитывает склон и сохраняет большую часть территории под озеленение."), ("02 / СЦЕНАРИИ", "В концепции предусмотрены жильё, парковки, велодорожка, спорт, общественное пространство, рекреация и сервисные функции."), ("03 / СВЯЗНОСТЬ", "Дороги, въезд, пешеходные и велосипедные маршруты собраны в единую схему движения по территории.")],
                "gallery_heading": "Генплан и визуальная концепция.",
                "gallery_captions": ["Основной генплан с экспликацией, балансом территории и размещением 14 функциональных зон", "Приближённый вид показывает посадку домов, дорожную сеть и общественное ядро в рельефе", "Общий вид территории используется как дополнительная иллюстрация масштаба и взаимного расположения зон"],
                "conclusion": "Заказчик получил цельную концепцию участка: понятное зонирование, баланс площадей, маршруты и визуальную модель, на которой можно обсуждать следующий этап проектирования.",
            },
            "uk": {
                "title": "Генплан житлового проєкту на 57 гектарах у Болгарії.",
                "lead": "Для гірської ділянки біля Калофера розробили концепцію житлового проєкту: розмістили будинки, дороги, веломаршрути, паркування, громадські й рекреаційні зони, а потім зібрали генеральний план і візуальну подачу для замовника.",
                "metrics": [("57 га", "площа проєктованої території"), ("20 будинків", "житлові кластери у складі концепції"), ("14 зон", "об’єкти та сценарії в експлікації")],
                "section": "Територія отримала структуру для подальшого розвитку проєкту.",
                "cards": [("Проаналізували рельєф", "Розмістили забудову й маршрути з урахуванням перепаду висот, наявного ландшафту та лісового оточення."), ("Зібрали зонування", "Пов’язали житлові кластери з громадськими, спортивними, рекреаційними й сервісними зонами."), ("Підготували подачу", "Перетворили проєктну схему на генплан з експлікацією та візуальну концепцію для обговорення із замовником.")],
                "proof_heading": "Від геометрії ділянки до ландшафтної концепції.",
                "proof_captions": ["Базова аксонометрія фіксує геометрію ділянки, дороги й розташування функціональних зон", "Ландшафтний шар показує лісове оточення та зв’язок забудови з природним контекстом", "Об’ємна схема об’єднує житлові кластери, маршрути, водойму й громадські функції"],
                "proof_text": [("01 / РЕЛЬЄФ", "Відмітки ділянки перебувають у діапазоні 774–884 м. Планування враховує схил і зберігає більшу частину території під озеленення."), ("02 / СЦЕНАРІЇ", "Концепція охоплює житло, паркування, велодоріжку, спорт, громадський простір, рекреацію та сервісні функції."), ("03 / ЗВ’ЯЗНІСТЬ", "Дороги, в’їзд, пішохідні й велосипедні маршрути зібрані в єдину схему руху територією.")],
                "gallery_heading": "Генплан і візуальна концепція.",
                "gallery_captions": ["Основний генплан з експлікацією, балансом території та розміщенням 14 функціональних зон", "Наближений вид показує посадку будинків, дорожню мережу й громадське ядро в рельєфі", "Загальний вид території додатково показує масштаб і взаємне розташування зон"],
                "conclusion": "Замовник отримав цілісну концепцію ділянки: зрозуміле зонування, баланс площ, маршрути й візуальну модель для обговорення наступного етапу проєктування.",
            },
            "en": {
                "title": "A 57-hectare residential masterplan in Bulgaria.",
                "lead": "For a mountain site near Kalofer, we developed a residential concept covering homes, roads, cycling routes, parking, public space and recreation, then assembled the masterplan and its visual presentation for the client.",
                "metrics": [("57 ha", "total site under design"), ("20 homes", "residential clusters in the concept"), ("14 zones", "functions defined in the legend")],
                "section": "A clear site structure for the next stage of development.",
                "cards": [("Read the terrain", "We placed development and routes around the elevation change, existing landscape and forest setting."), ("Built the zoning", "Residential clusters connect to public, sport, recreation and service areas."), ("Prepared the presentation", "The planning scheme became an annotated masterplan and a visual concept for client review.")],
                "proof_heading": "From site geometry to a landscape concept.",
                "proof_captions": ["The base axonometric drawing establishes site geometry, roads and the position of functional zones", "The landscape layer shows the forest setting and the relationship between buildings and nature", "The spatial scheme combines housing clusters, routes, water and public functions"],
                "proof_text": [("01 / TERRAIN", "The site ranges from 774 to 884 metres in elevation. The layout works with the slope and retains most of the land as green space."), ("02 / USES", "The concept includes homes, parking, cycling, sport, public space, recreation and supporting services."), ("03 / CONNECTIONS", "Roads, the entrance, pedestrian links and cycle routes form one movement system across the site.")],
                "gallery_heading": "Masterplan and visual concept.",
                "gallery_captions": ["The main masterplan combines the legend, land balance and placement of 14 functional zones", "The closer view shows home placement, the road network and the public centre within the terrain", "The overview supports the presentation of scale and the relationship between zones"],
                "conclusion": "The client received one coherent site concept with zoning, area balance, routes and a visual model ready for the next design discussion.",
            },
            "es": {
                "title": "Plan maestro de un proyecto residencial de 57 hectáreas en Bulgaria.",
                "lead": "Para un terreno de montaña cerca de Kalofer desarrollamos una propuesta residencial con viviendas, carreteras, rutas ciclistas, aparcamiento, espacios públicos y zonas recreativas, y preparamos el plan general y su presentación visual para el cliente.",
                "metrics": [("57 ha", "superficie total del proyecto"), ("20 viviendas", "agrupaciones residenciales de la propuesta"), ("14 zonas", "funciones definidas en la leyenda")],
                "section": "Una estructura clara para desarrollar la siguiente etapa del proyecto.",
                "cards": [("Analizamos el relieve", "Situamos la edificación y los recorridos según el desnivel, el paisaje existente y el entorno forestal."), ("Ordenamos los usos", "Conectamos las agrupaciones residenciales con zonas públicas, deportivas, recreativas y de servicios."), ("Preparamos la presentación", "La propuesta se convirtió en un plan con leyenda y una visualización para revisarla con el cliente.")],
                "proof_heading": "De la geometría del terreno al concepto paisajístico.",
                "proof_captions": ["La axonometría base fija la geometría del terreno, las vías y la posición de las zonas funcionales", "La capa paisajística muestra el bosque y la relación de la edificación con el contexto natural", "El esquema volumétrico reúne viviendas, recorridos, agua y funciones públicas"],
                "proof_text": [("01 / RELIEVE", "Las cotas del terreno van de 774 a 884 metros. La ordenación trabaja con la pendiente y conserva la mayor parte como espacio verde."), ("02 / USOS", "La propuesta incluye vivienda, aparcamiento, ciclismo, deporte, espacio público, recreación y servicios."), ("03 / CONEXIONES", "Las vías, el acceso, los recorridos peatonales y ciclistas forman un único sistema de movimiento.")],
                "gallery_heading": "Plan maestro y concepto visual.",
                "gallery_captions": ["El plan principal reúne la leyenda, el balance de superficies y la ubicación de 14 zonas funcionales", "La vista cercana muestra las viviendas, la red viaria y el centro público dentro del relieve", "La vista general apoya la lectura de la escala y la relación entre las zonas"],
                "conclusion": "El cliente recibió una propuesta coherente del terreno con zonificación, balance de superficies, recorridos y un modelo visual para avanzar a la siguiente fase de diseño.",
            },
        },
    },
    "bulgaria-villa-3d": {
        "kind": "villa3d", "client": "KALOFER VILLA", "service": "3D architecture", "place": "Kalofer / Bulgaria",
        "hero": "/cases/villa_3d_assets/villa-render.webp",
        "hero_fit": "cover",
        "proof_images": [
            "/cases/villa_3d_assets/floor-plan-1.webp",
            "/cases/villa_3d_assets/floor-plan-2.webp",
        ],
        "gallery": [
            "/cases/villa_3d_assets/model-front.webp",
            "/cases/villa_3d_assets/model-rear.webp",
            "/cases/villa_3d_assets/model-entry.webp",
            "/cases/villa_3d_assets/model-section.webp",
        ],
        "copy": {
            "ru": {
                "title": "От планировки к 3D-модели виллы в Болгарии.",
                "lead": "Для виллы в составе проекта возле Калофера проработали планы этажей, экспликации помещений и объёмную модель. Эта основа помогает развивать архитектуру, проверять решения и создавать фотореалистичные материалы для презентации и маркетинга.",
                "metrics": [("244 м²", "площадь двух надземных этажей по наружному контуру"), ("2 этажа", "планировки с площадями и назначением помещений"), ("4 ракурса", "проверка фасадов, объёмов и внутренних связей")],
                "section": "Одна модель связывает планировку, архитектуру и будущую презентацию.",
                "cards": [("Собрали планировки", "Определили состав помещений, площади, лестницу, террасы и связь между уровнями."), ("Подняли объём", "Перенесли планы в 3D и проверили пропорции, остекление, фасады, навесы и открытые пространства."), ("Подготовили к рендеру", "Модель стала основой для материалов, которые можно использовать при дальнейшем проектировании и продвижении вилл.")],
                "proof_heading": "Планировка задаёт точную основу модели.",
                "proof_captions": ["Первый этаж: 130 м² по наружному контуру, общественная зона, гостевые помещения и терраса", "Второй этаж: 114 м² по наружному контуру, спальни, ванные, гардеробная и открытая терраса"],
                "proof_text": [("01 / ФУНКЦИИ", "Экспликации фиксируют назначение и площадь каждого помещения до работы с объёмом."), ("02 / СВЯЗИ", "Общая лестница связывает уровни, а расположение проёмов согласовано с планами и фасадами."), ("03 / МАСШТАБ", "Габариты и площади помогают контролировать пропорции виллы на каждом следующем этапе.")],
                "gallery_heading": "Архитектурная модель со всех сторон.",
                "gallery_captions": ["Главный фасад, панорамное остекление и протяжённая терраса", "Тыльный фасад, навес и взаимное положение двух объёмов", "Входная группа, вертикальные акценты и боковая терраса", "Разрез модели показывает лестницы, уровни и внутреннюю организацию"],
                "conclusion": "Проект получил согласованную пространственную основу: по ней можно уточнять архитектурные решения, готовить рабочие материалы и выпускать финальные рендеры для презентации объекта.",
            },
            "uk": {
                "title": "Від планування до 3D-моделі вілли в Болгарії.",
                "lead": "Для вілли у складі проєкту біля Калофера опрацювали плани поверхів, експлікації приміщень і об’ємну модель. Ця основа допомагає розвивати архітектуру, перевіряти рішення та створювати фотореалістичні матеріали для презентації й маркетингу.",
                "metrics": [("244 м²", "площа двох надземних поверхів за зовнішнім контуром"), ("2 поверхи", "планування з площами та призначенням приміщень"), ("4 ракурси", "перевірка фасадів, об’ємів і внутрішніх зв’язків")],
                "section": "Одна модель пов’язує планування, архітектуру й майбутню презентацію.",
                "cards": [("Зібрали планування", "Визначили склад приміщень, площі, сходи, тераси та зв’язок між рівнями."), ("Побудували об’єм", "Перенесли плани в 3D і перевірили пропорції, скління, фасади, навіси та відкриті простори."), ("Підготували до рендеру", "Модель стала основою для матеріалів, які можна використовувати в подальшому проєктуванні та просуванні вілл.")],
                "proof_heading": "Планування задає точну основу моделі.",
                "proof_captions": ["Перший поверх: 130 м² за зовнішнім контуром, громадська зона, гостьові приміщення й тераса", "Другий поверх: 114 м² за зовнішнім контуром, спальні, ванні, гардеробна й відкрита тераса"],
                "proof_text": [("01 / ФУНКЦІЇ", "Експлікації фіксують призначення та площу кожного приміщення до роботи з об’ємом."), ("02 / ЗВ’ЯЗКИ", "Спільні сходи поєднують рівні, а розташування прорізів узгоджене з планами й фасадами."), ("03 / МАСШТАБ", "Габарити та площі допомагають контролювати пропорції вілли на кожному наступному етапі.")],
                "gallery_heading": "Архітектурна модель з усіх боків.",
                "gallery_captions": ["Головний фасад, панорамне скління та протяжна тераса", "Тильний фасад, навіс і взаємне розташування двох об’ємів", "Вхідна група, вертикальні акценти й бічна тераса", "Розріз моделі показує сходи, рівні та внутрішню організацію"],
                "conclusion": "Проєкт отримав узгоджену просторову основу для уточнення архітектури, підготовки робочих матеріалів і фінальних рендерів для презентації об’єкта.",
            },
            "en": {
                "title": "From floor plans to a 3D villa model in Bulgaria.",
                "lead": "For a villa within the Kalofer development, we created floor plans, room schedules and a spatial model. This foundation supports architectural development, design checks and photorealistic material for presentations and marketing.",
                "metrics": [("244 m²", "combined external area of two above-ground floors"), ("2 floors", "plans with room functions and areas"), ("4 views", "checks of façades, volumes and internal connections")],
                "section": "One model connects planning, architecture and presentation.",
                "cards": [("Developed the plans", "We defined rooms, areas, stairs, terraces and the connections between levels."), ("Built the volume", "The plans were translated into 3D to check proportions, glazing, façades, canopies and outdoor space."), ("Prepared for rendering", "The model became a base for further design work and marketing material for the villas.")],
                "proof_heading": "The floor plans provide an exact base for the model.",
                "proof_captions": ["Ground floor: 130 m² by external contour, with living space, guest rooms and a terrace", "First floor: 114 m² by external contour, with bedrooms, bathrooms, dressing room and an open terrace"],
                "proof_text": [("01 / FUNCTIONS", "Room schedules establish the purpose and area of every space before modelling begins."), ("02 / CONNECTIONS", "A shared stair connects the levels, while openings remain coordinated across plans and façades."), ("03 / SCALE", "Dimensions and areas keep the villa’s proportions controlled through each following stage.")],
                "gallery_heading": "The architectural model from every side.",
                "gallery_captions": ["Main façade with panoramic glazing and a continuous terrace", "Rear façade, canopy and the relationship between the two volumes", "Entrance, vertical accents and the side terrace", "Section view showing stairs, levels and internal organisation"],
                "conclusion": "The project gained a coordinated spatial base for refining the architecture, preparing working material and producing final presentation renders.",
            },
            "es": {
                "title": "De los planos al modelo 3D de una villa en Bulgaria.",
                "lead": "Para una villa del proyecto cerca de Kalofer desarrollamos los planos, los cuadros de superficies y el modelo volumétrico. Esta base permite avanzar la arquitectura, comprobar decisiones y crear material fotorrealista para presentación y marketing.",
                "metrics": [("244 m²", "superficie exterior combinada de las dos plantas"), ("2 plantas", "distribuciones con usos y superficies"), ("4 vistas", "control de fachadas, volúmenes y conexiones interiores")],
                "section": "Un modelo conecta distribución, arquitectura y presentación.",
                "cards": [("Desarrollamos las plantas", "Definimos estancias, superficies, escalera, terrazas y conexiones entre niveles."), ("Construimos el volumen", "Trasladamos los planos a 3D para comprobar proporciones, acristalamiento, fachadas, cubiertas y espacios abiertos."), ("Preparamos el render", "El modelo se convirtió en la base para el desarrollo posterior y el material de marketing de las villas.")],
                "proof_heading": "Las plantas establecen una base precisa para el modelo.",
                "proof_captions": ["Planta baja: 130 m² por contorno exterior, con zona social, habitaciones de invitados y terraza", "Planta superior: 114 m² por contorno exterior, con dormitorios, baños, vestidor y terraza abierta"],
                "proof_text": [("01 / USOS", "Los cuadros fijan el uso y la superficie de cada espacio antes de construir el volumen."), ("02 / CONEXIONES", "Una escalera común conecta los niveles y los huecos se coordinan entre plantas y fachadas."), ("03 / ESCALA", "Las dimensiones y superficies mantienen controladas las proporciones de la villa en las fases siguientes.")],
                "gallery_heading": "El modelo arquitectónico desde todos los ángulos.",
                "gallery_captions": ["Fachada principal, acristalamiento panorámico y terraza continua", "Fachada posterior, cubierta y relación entre los dos volúmenes", "Acceso, elementos verticales y terraza lateral", "La sección muestra escaleras, niveles y organización interior"],
                "conclusion": "El proyecto obtuvo una base espacial coordinada para afinar la arquitectura, preparar material técnico y producir renders finales para presentar el inmueble.",
            },
        },
    },
}


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def alternates(slug: str) -> str:
    rows = [f'<link rel="alternate" hreflang="{loc}" href="https://resetdigital.agency/{loc}/cases/{slug}.html">' for loc in LOCALES]
    rows.append(f'<link rel="alternate" hreflang="x-default" href="https://resetdigital.agency/ru/cases/{slug}.html">')
    return "\n    ".join(rows)


def render(slug: str, case: dict, locale: str) -> str:
    ui = UI[locale]
    c = case["copy"][locale]
    canonical = f"https://resetdigital.agency/{locale}/cases/{slug}.html"
    metrics = "".join(f'<div class="sales-metric"><strong>{esc(a)}</strong><span>{esc(b)}</span></div>' for a, b in c["metrics"])
    cards = "".join(f'<article class="sales-card"><span>0{i}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></article>' for i, (a, b) in enumerate(c["cards"], 1))
    proof_captions = c.get("proof_captions", [])
    proof_figs = "".join(f'<figure><img src="{src}" alt="{esc(case["client"])} — {esc(proof_captions[i - 1] if i <= len(proof_captions) else ui["proof"] + f" {i}")}" loading="lazy"><figcaption>{esc(proof_captions[i - 1] if i <= len(proof_captions) else ui["proof"] + f" {i}")}</figcaption></figure>' for i, src in enumerate(case["proof_images"], 1))
    insights = "".join(f'<div class="sales-insight"><strong>{esc(a)}</strong><p>{esc(b)}</p></div>' for a, b in c["proof_text"])
    captions = c.get("gallery_captions", [])
    gallery = "".join(f'<figure><img src="{src}" alt="{esc(case["client"])} — {esc(ui["creative"] if case["kind"] == "ads" else ui["product"])} {i}" loading="lazy"><figcaption>{esc(captions[i - 1] if i <= len(captions) else (ui["creative"] if case["kind"] == "ads" else ui["product"]) + f" / 0{i}")}</figcaption></figure>' for i, src in enumerate(case["gallery"], 1))
    gallery_class = "sales-gallery-grid" if case["kind"] == "ads" else "sales-product-grid"
    source = f'<p class="sales-source">{esc(c["source"])}</p>' if c.get("source") else ""
    schema = {"@context": "https://schema.org", "@type": "CreativeWork", "name": c["title"], "description": c["lead"], "url": canonical, "creator": {"@type": "Organization", "name": "RESET"}, "about": [case["client"], case["service"], "real estate"]}
    return f'''<!doctype html>
<html lang="{locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{esc(c['lead'])}">
  <title>{esc(c['title'])} — RESET</title>
  <link rel="canonical" href="{canonical}">
  {alternates(slug)}
  <link rel="stylesheet" href="/case-sales.css">
  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body class="sales-case sales-case-{case['kind']}">
  <header class="sales-header"><a class="sales-brand" href="{ui['home']}">RE<span>SET</span></a><a class="sales-back" href="{ui['home']}#case-index">{esc(ui['back'])}</a><nav><a href="{ui['home']}#case-index" aria-current="page">{esc(ui['cases'])}</a><a href="{ui['home']}#services">{esc(ui['services'])}</a><a href="{ui['home']}#contact">{esc(ui['contact'])}</a></nav></header>
  <main>
    <section class="sales-hero">
      <div class="sales-meta"><span>{esc(case['client'])}</span><i></i><span>{esc(case['service'])}</span><i></i><span>{esc(case['place'])}</span></div>
      <div class="sales-hero-grid">
        <div><p class="sales-kicker">RESET / CASE STUDY</p><h1>{esc(c['title'])}</h1><p class="sales-lead">{esc(c['lead'])}</p></div>
        <figure class="sales-hero-visual{' contain' if case.get('hero_fit', 'contain' if case['kind'] != 'ads' else 'cover') == 'contain' else ''}"><img src="{case['hero']}" alt="{esc(case['client'])} — {esc(case['service'])}"><figcaption class="sales-visual-tag">{esc(case['client'])} / {esc(case['service'])}</figcaption></figure>
      </div>
      <div class="sales-metrics">{metrics}</div>
    </section>
    <section class="sales-story">
      <div class="sales-section-head"><p class="sales-eyebrow">RESET / APPROACH</p><h2>{esc(c['section'])}</h2></div>
      <div class="sales-cards">{cards}</div>
    </section>
    <section class="sales-proof" id="workflow">
      <div class="sales-section-head"><p class="sales-eyebrow">{'PRODUCT / WORKFLOW' if case['kind'] != 'ads' else 'DATA / RESULT'}</p><h2>{esc(c.get('proof_heading', ui['proof'] + '.'))}</h2></div>
      <div class="sales-proof-grid"><div>{proof_figs}</div><div class="sales-insights">{insights}<div class="sales-insight"><p>{esc(c['conclusion'])}</p>{source}</div></div></div>
    </section>
    <section class="sales-gallery" id="product-interface">
      <div class="sales-section-head"><p class="sales-eyebrow">{esc(case['client'])} / {esc(case['service'])}</p><h2>{esc(c.get('gallery_heading', (ui['creative'] if case['kind'] == 'ads' else ui['product']) + '.'))}</h2></div>
      <div class="{gallery_class}">{gallery}</div>
    </section>
    <section class="sales-cta" id="contact"><h2>{esc(ui['cta'])}</h2><div><p>{esc(ui['cta_text'])}</p><a class="sales-button" href="{ui['home']}#contact">{esc(ui['button'])}</a></div></section>
  </main>
  <footer class="sales-footer"><span>© 2017–2026 RESET</span><a href="mailto:hello@reset.agency">hello@reset.agency</a></footer>
</body>
</html>
'''


def main() -> None:
    for slug, case in CASES.items():
        for locale in LOCALES:
            path = ROOT / locale / "cases" / f"{slug}.html"
            path.write_text(render(slug, case, locale), encoding="utf-8")
        # Root case URLs mirror the Russian version for compatibility with old links.
        (ROOT / "cases" / f"{slug}.html").write_text(render(slug, case, "ru"), encoding="utf-8")


if __name__ == "__main__":
    main()
