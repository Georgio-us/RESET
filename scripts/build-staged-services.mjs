import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSiteUI, contactForm, arrow } from '../site-ui.js';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const origin = 'https://resetdigital.agency';
const queue = JSON.parse(await readFile(resolve(root, 'content/seo-release-queue.json'), 'utf8'));
const batches = queue.batches.filter(item => item.kind === 'service' && item.targetSlug);
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
const textOnly = html => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const section = (id, title, body, caption = '') => `<section class="svc-section" id="${id}"><div class="svc-shell"><div class="svc-section-head"><h2>${escape(title)}</h2>${caption ? `<span>${escape(caption)}</span>` : ''}</div>${body}</div></section>`;
const button = label => `<a class="reset-button" href="#service-enquiry">${escape(label)}${arrow}</a>`;

for (const batch of batches) {
const paths = Object.fromEntries(queue.locales.map(locale => [locale, `/${locale}/services/${batch.targetSlug}/`]));
const note = JSON.parse(await readFile(resolve(root, `content/staged-services/${batch.sourceSlug}-note.json`), 'utf8'));
for (const locale of queue.locales) {
  const data = locale === 'es'
    ? JSON.parse(await readFile(resolve(root, `content/staged-services/es-${batch.sourceSlug}.json`), 'utf8'))
    : JSON.parse(await readFile(resolve(root, `content/services/${locale}.json`), 'utf8'));
  const s = data.service || data.services.find(item => item.slug === batch.sourceSlug);
  if (!s) throw new Error(`Missing ${batch.sourceSlug} content for ${locale}`);
  const l = data.labels;
  const path = paths[locale];
  const breadcrumbs = [
    { name: l.home, item: `${origin}/${locale}/` },
    ...(locale === 'es' ? [] : [{ name: l.services, item: `${origin}/${locale}/services/` }]),
    { name: s.name, item: origin + path },
  ];
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })) },
    { '@type': 'Service', name: s.title, description: s.intro, url: origin + path, inLanguage: locale, provider: { '@type': 'Organization', name: 'RESET', url: origin } },
  ];
  const cases = await Promise.all(s.cases.map(async slug => {
    const casePath = `/${locale}/cases/${slug}.html`;
    const html = await readFile(resolve(root, `.${casePath}`), 'utf8');
    const title = textOnly(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || slug);
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
    return `<a class="svc-case" href="${casePath}"><h3>${escape(title)}</h3><p>${escape(description)}</p><span>${escape(l.caseLink)} ↗</span></a>`;
  }));
  let body = section('includes', l.includes, `<div class="svc-grid">${s.includes.map(([heading, copy], index) => `<article class="svc-card"><span class="svc-number">0${index + 1}</span><h3>${escape(heading)}</h3><p>${escape(copy)}</p></article>`).join('')}</div>`, l.scope);
  if (!Array.isArray(note[locale]) || note[locale].length !== 2) throw new Error(`Missing editorial note for ${locale}: ${batch.id}`);
  body += section('editorial-note', note[locale][0], `<p class="svc-intro">${escape(note[locale][1])}</p>`);
  body += section('process', l.process, `<ol class="svc-steps">${s.steps.map(([heading, copy], index) => `<li><span class="svc-number">0${index + 1}</span><h3>${escape(heading)}</h3><p>${escape(copy)}</p></li>`).join('')}</ol>`, l.steps);
  body += section('cases', l.cases, `<div class="svc-case-grid">${cases.join('')}</div>`);
  body += `<section class="svc-section" id="pricing"><div class="svc-shell svc-cost"><h2>${escape(l.cost)}</h2><div><p>${escape(s.price)}</p><p class="svc-note">${escape(s.priceNote)}</p>${button(l.estimate)}</div></div></section>`;
  body += section('faq', l.faq, `<div class="svc-faq">${s.faq.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}</div>`);
  body += `<section class="svc-section svc-contact" id="service-enquiry"><div class="svc-shell svc-contact-grid"><div><h2>${escape(l.contact)}</h2><p>${escape(l.contactText)}</p></div>${contactForm(locale, batch.id)}</div></section>`;
  const serviceIndex = locale === 'es' ? `/${locale}/#services` : `/${locale}/services/`;
  const alternateLinks = queue.locales.map(language => `<link rel="alternate" hreflang="${language}" href="${origin}${paths[language]}">`).join('');
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(s.title)} - RESET</title><meta name="description" content="${escape(s.intro)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${origin}${path}">${alternateLinks}<link rel="alternate" hreflang="x-default" href="${origin}${paths.en}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(s.title)} - RESET"><meta property="og:description" content="${escape(s.intro)}"><meta property="og:url" content="${origin}${path}"><meta property="og:site_name" content="RESET"><link rel="stylesheet" href="/service-pages.css?v=20260926-s1"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script></head><body class="service-page"><main><section class="svc-hero"><div class="svc-shell"><nav class="svc-breadcrumb" aria-label="${escape(l.home)}"><a href="/${locale}/">${escape(l.home)}</a><a href="${serviceIndex}">${escape(l.services)}</a><span aria-current="page">${escape(s.name)}</span></nav><p class="svc-kicker">${escape(l.eyebrow)}</p><div class="svc-hero-grid"><div><h1>${escape(s.title)}</h1><p class="svc-intro">${escape(s.intro)}</p><div class="svc-actions">${button(l.cta)}<a href="#cases">${escape(l.cases)} ↓</a></div></div><aside class="svc-fit"><h2>${escape(l.fit)}</h2><p>${escape(s.fit)}</p></aside></div></div></section>${body}</main></body></html>`;
  const targetFile = resolve(root, `.${path}index.html`);
  await mkdir(resolve(targetFile, '..'), { recursive: true });
  const rendered = renderSiteUI(html, {
    locale,
    path,
    exists: target => Object.values(paths).includes(target) || existsSync(resolve(root, `.${target.endsWith('/') ? `${target}index.html` : target}`)),
  });
  await writeFile(targetFile, rendered + '\n');
}
console.log(`Staged ${batch.id} in ${queue.locales.join(', ')}.`);
}
