const origin = 'https://resetdigital.agency';
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const routeFor = (batch, locale, slug) => batch.kind === 'case'
  ? `/${locale}/cases/${slug}`
  : `/${locale}/services/${slug}/`;

const activeBatches = (queue, now) => queue.batches.filter(batch =>
  batch.status === 'ready' && Date.parse(batch.releaseAt) <= now.getTime());

export function scheduledRoute(queue, pathname, now = new Date()) {
  for (const batch of queue.batches) {
    if (batch.status !== 'ready') continue;
    const active = Date.parse(batch.releaseAt) <= now.getTime();
    for (const locale of queue.locales) {
      const source = routeFor(batch, locale, batch.sourceSlug);
      const target = routeFor(batch, locale, batch.targetSlug);
      if (pathname === target || pathname === `${target}index.html`) {
        if (!active) return { status: 404 };
      }
      if (active && !batch.newLocales?.includes(locale) && (pathname === source || pathname === source.replace(/\/$/, '') || pathname === `${source}index.html`)) {
        return { status: 301, location: target };
      }
    }
  }
  return null;
}

export function scheduledSitemap(queue, staticXml, now = new Date()) {
  const extra = activeBatches(queue, now).flatMap(batch => queue.locales.map(locale =>
    `  <url><loc>${origin}${routeFor(batch, locale, batch.targetSlug)}</loc></url>`));
  return staticXml.replace('</urlset>', `${extra.join('\n')}${extra.length ? '\n' : ''}</urlset>`);
}

export function scheduledHtml(queue, html, locale, now = new Date()) {
  const active = activeBatches(queue, now);
  if (!active.length) return html;
  let result = html;
  for (const batch of active) {
    for (const language of queue.locales) {
      const source = routeFor(batch, language, batch.sourceSlug);
      const target = routeFor(batch, language, batch.targetSlug);
      result = result.replaceAll(`href="${source}"`, `href="${target}"`);
      result = result.replaceAll(`href="${origin}${source}"`, `href="${origin}${target}"`);
    }
    const card = batch.homepageCard?.[locale];
    if (card && html.includes('<section class="platforms-section services-section" id="services"')) {
      const pattern = new RegExp(`(<article class="service-card[^"]*">(?:(?!<\\/article>)[\\s\\S])*?<h3>${escapePattern(card.heading)}<\\/h3>(?:(?!<\\/article>)[\\s\\S])*?)(<\\/article>)`);
      const path = routeFor(batch, locale, batch.targetSlug);
      result = result.replace(pattern, (_, contents, close) =>
        `${contents}<a class="service-detail-link" href="${path}">${card.linkText} <span aria-hidden="true">↗</span></a>${close}`);
    }
  }
  if (!locale || !html.includes('<title>') || !html.includes('</main>')) return result;
  if (!html.includes('<h1>') || !html.includes('section-cards')) return result;
  const links = active.map(batch => {
    const path = routeFor(batch, locale, batch.targetSlug);
    const label = batch.labels?.[locale];
    return `<li><a href="${path}">${label}</a></li>`;
  });
  if (html.includes(`<link rel="canonical" href="${origin}/${locale}/sitemap.html"`)) {
    result = result.replace('</main>', `<section class="section-cards"><h2>${{
      ru: 'Новые материалы', uk: 'Нові матеріали', en: 'New pages', es: 'Nuevas páginas',
    }[locale]}</h2><ul>${links.join('')}</ul></section></main>`);
  }
  return result;
}
