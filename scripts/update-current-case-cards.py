#!/usr/bin/env python3
"""Publish current case cards and update the FACTOR hero result."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]

COPY = {
    "ru": {
        "factor": ("142 заявки для двух филиалов", "Средняя стоимость заявки — $6,91."),
        "shepit": ("215 заявок на дома", "CPL кампаний снизился до $5,74; ведущий креатив — $5,15."),
        "delmar": ("103 заявки на недвижимость по $6,79", "Три оффера для объектов, инвестиций и доступного первого платежа."),
        "crm": ("Estate CRM: от заявки до подборки объекта", "Кастомная система Delmar объединяет воронку, каталог недвижимости, работу менеджеров и контроль руководителя."),
        "notion": ("База партнёров, объектов и расчётов в Notion", "Рабочая система для запуска направления Dominanta в Малаге и Валенсии."),
        "architecture": ("Генплан жилого проекта на 57 гектарах", "Зонирование, маршруты, ландшафт и визуальная концепция участка в Болгарии."),
        "villa3d": ("От планировки к 3D-модели виллы", "Экспликации, объёмная модель и основа для фотореалистичной презентации проекта."),
        "hero": "заявки для<br>двух филиалов", "avg": "Средняя стоимость заявки",
    },
    "uk": {
        "factor": ("142 заявки для двох філій", "Середня вартість заявки — $6,91."),
        "shepit": ("215 заявок на будинки", "CPL кампаній знизився до $5,74; провідний креатив — $5,15."),
        "delmar": ("103 заявки на нерухомість по $6,79", "Три офери для об’єктів, інвестицій і доступного першого платежу."),
        "crm": ("Заявки, об’єкти й команда — в Estate CRM", "Кастомна CRM Delmar: воронка, добірки об’єктів, дашборд та інтеграції."),
        "notion": ("База партнерів, об’єктів і розрахунків у Notion", "Робоча система для запуску напряму Dominanta в Малазі та Валенсії."),
        "architecture": ("Генплан житлового проєкту на 57 гектарах", "Зонування, маршрути, ландшафт і візуальна концепція ділянки в Болгарії."),
        "villa3d": ("Від планування до 3D-моделі вілли", "Експлікації, об’ємна модель і основа для фотореалістичної презентації проєкту."),
        "hero": "заявки для<br>двох філій", "avg": "Середня вартість заявки",
    },
    "en": {
        "factor": ("142 leads for two agency branches", "Average cost per lead: $6.91."),
        "shepit": ("215 enquiries for residential homes", "Campaign CPL fell to $5.74; leading creative CPL: $5.15."),
        "delmar": ("103 real estate leads at $6.79", "Three offers for properties, investment and an accessible first payment."),
        "crm": ("Leads, properties and team in Estate CRM", "Delmar’s custom CRM: pipeline, property selections, dashboard and integrations."),
        "notion": ("Partners, properties and calculations in Notion", "A workspace for launching Dominanta in Málaga and Valencia."),
        "architecture": ("A 57-hectare residential masterplan", "Zoning, routes, landscape and the visual concept for a site in Bulgaria."),
        "villa3d": ("From floor plans to a 3D villa model", "Room schedules, a spatial model and the base for a photorealistic presentation."),
        "hero": "leads for<br>two branches", "avg": "Average cost per lead",
    },
    "es": {
        "factor": ("142 leads para dos oficinas", "Coste medio por lead: $6,91."),
        "shepit": ("215 solicitudes de viviendas", "El CPL bajó hasta $5,74; creatividad líder: $5,15."),
        "delmar": ("103 leads inmobiliarios a $6,79", "Tres ofertas para inmuebles, inversión y una primera aportación accesible."),
        "crm": ("Leads, inmuebles y equipo en Estate CRM", "CRM a medida de Delmar: embudo, selecciones, panel e integraciones."),
        "notion": ("Socios, inmuebles y cálculos en Notion", "Un sistema de trabajo para lanzar Dominanta en Málaga y Valencia."),
        "architecture": ("Plan maestro residencial de 57 hectáreas", "Zonificación, recorridos, paisaje y concepto visual para un terreno en Bulgaria."),
        "villa3d": ("De los planos al modelo 3D de una villa", "Cuadros de superficies, modelo volumétrico y base para una presentación fotorrealista."),
        "hero": "leads para<br>dos oficinas", "avg": "Coste medio por lead",
    },
}


def card(lang: str, slug: str, category: str, label: str, image: str, title: str, description: str) -> str:
    prefix = f"/{lang}" if lang else "/ru"
    return (
        f'<article class="dev-work-card" data-work-category="{category}">'
        f'<a class="dev-work-image dev-image-meta" href="{prefix}/cases/{slug}.html" data-work-link="{slug}" aria-label="{title}">'
        f'<img src="{image}" alt="{label}" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></a>'
        f'<div class="dev-work-copy"><p class="dev-label">{label}</p><h3><a href="{prefix}/cases/{slug}.html" data-work-link="{slug}">{title}</a></h3><p>{description}</p></div></article>'
    )


def replace_card(source: str, slug: str, replacement: str) -> str:
    pattern = re.compile(
        r'<article class="dev-work-card[^>]*>(?:(?!</article>).)*?href="[^"]*/cases/'
        + re.escape(slug)
        + r'\.html"(?:(?!</article>).)*?</article>'
    )
    updated, count = pattern.subn(replacement, source, count=1)
    if count != 1:
        raise RuntimeError(f"Expected one card for {slug}, found {count}")
    return updated


def update(path: Path, lang: str) -> None:
    c = COPY[lang]
    source = path.read_text(encoding="utf-8")
    source = replace_card(source, "an-factor", "".join(card(lang, "an-factor", "ads", "FACTOR / Meta Ads", "/cases/factor_assets/Factor1_creo_2.webp", *c["factor"])))
    source = replace_card(source, "shepit-meta-ads", "".join(card(lang, "shepit-meta-ads", "ads", "SHEPIT HOUSE / Meta Ads", "/cases/shepit_assets/Shepit_creo_3.webp", *c["shepit"])))
    source = replace_card(source, "delmar-meta-ads", "".join(card(lang, "delmar-meta-ads", "ads", "DELMAR / Meta Ads", "/cases/delmar_meta_assets/delmar_creo1.webp", *c["delmar"])))
    crm = card(lang, "delmar-custom-crm", "crm", "DELMAR / Estate CRM", "/cases/estate_crm_assets/dashboard4.webp", *c["crm"])
    crm = crm.replace('class="dev-work-image dev-image-meta"', 'class="dev-work-image dev-image-product"')
    source = replace_card(source, "delmar-custom-crm", crm)
    notion = card(lang, "dominanta-spain", "crm", "DOMINANTA / NOTION", "/cases/notion_assets/developers_database.webp", *c["notion"])
    notion = notion.replace('class="dev-work-image dev-image-meta"', 'class="dev-work-image dev-image-product"')
    source = replace_card(source, "dominanta-spain", notion)
    architecture = card(lang, "bulgaria-masterplan", "architecture", "BULGARIA / MASTERPLAN", "/cases/architecture_assets/masterplan-title.webp", *c["architecture"])
    architecture = architecture.replace('class="dev-work-image dev-image-meta"', 'class="dev-work-image dev-image-site"')
    source = replace_card(source, "bulgaria-masterplan", architecture)
    villa3d = card(lang, "bulgaria-villa-3d", "architecture", "BULGARIA / VILLA 3D", "/cases/villa_3d_assets/villa-render.webp", *c["villa3d"])
    villa3d = villa3d.replace('class="dev-work-image dev-image-meta"', 'class="dev-work-image dev-image-site"')
    source = replace_card(source, "bulgaria-villa-3d", villa3d)

    source = source.replace('/cases/shepit_assets/new_google_advertising_example.png', '/cases/shepit_assets/shepit_google.webp')
    nivellux_hero = '/cases/nivellux_assets/nivellux_hero_es.webp' if lang in ('en', 'es') else '/cases/nivellux_assets/nivellux_hero_ru.webp'
    source = source.replace('/assets/reset-valencia-renovation.webp', nivellux_hero)
    source = source.replace('/cases/factor_assets/creo_cuvee.png', '/cases/factor_assets/Factor1_creo_2.webp')

    # The selected-work hero keeps its existing visual system and receives current data.
    hero_pattern = re.compile(r'(<article class="dev-feature dev-feature-meta".*?<div class="hero-result"><h2><strong>).*?(</strong><span>).*?(</span></h2><div class="hero-cpl"><b>).*?(</b><span>).*?(</span>)', re.S)
    source, count = hero_pattern.subn(r'\g<1>142\g<2>' + c["hero"] + r'\g<3>$6.91\g<4>' + c["avg"] + r'\g<5>', source, count=1)
    if count != 1:
        raise RuntimeError(f"Expected FACTOR hero in {path}")
    path.write_text(source, encoding="utf-8")


def main() -> None:
    update(ROOT / "index.html", "ru")
    for lang in COPY:
        update(ROOT / lang / "index.html", lang)


if __name__ == "__main__":
    main()
