import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduledRoute, scheduledSitemap, scheduledHtml } from '../seo-release-runtime.js';

const queue = {
  locales: ['ru', 'uk', 'en', 'es'],
  batches: [{
    id: 'sample', kind: 'service', sourceSlug: 'old-service', targetSlug: 'better-service',
    status: 'ready', releaseAt: '2026-11-02T09:00:00Z',
    labels: { ru: 'Услуга', uk: 'Послуга', en: 'Service', es: 'Servicio' },
  }],
};
const before = new Date('2026-11-02T08:59:59Z');
const after = new Date('2026-11-02T09:00:00Z');

test('scheduled pages stay unavailable until release; old URL redirects directly at release', () => {
  assert.deepEqual(scheduledRoute(queue, '/ru/services/better-service/', before), { status: 404 });
  assert.equal(scheduledRoute(queue, '/ru/services/old-service/', before), null);
  assert.deepEqual(scheduledRoute(queue, '/ru/services/old-service/', after), {
    status: 301, location: '/ru/services/better-service/',
  });
  assert.equal(scheduledRoute(queue, '/ru/services/better-service/', after), null);
});

test('sitemap and public links change at the same release instant', () => {
  const xml = '<?xml version="1.0"?><urlset></urlset>';
  assert.equal(scheduledSitemap(queue, xml, before), xml);
  const released = scheduledSitemap(queue, xml, after);
  for (const locale of queue.locales) assert.ok(released.includes(`https://resetdigital.agency/${locale}/services/better-service/`));

  const html = '<head><title>Карта сайта</title><link rel="canonical" href="https://resetdigital.agency/ru/sitemap.html"></head><main><h1>Карта сайта</h1><section class="section-cards"><a href="/ru/services/old-service/">Old</a></section></main>';
  assert.equal(scheduledHtml(queue, html, 'ru', before), html);
  const updated = scheduledHtml(queue, html, 'ru', after);
  assert.ok(updated.includes('href="/ru/services/better-service/"'));
  assert.ok(updated.includes('<li><a href="/ru/services/better-service/">Услуга</a></li>'));
});
