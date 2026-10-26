import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { scheduledRoute, scheduledSitemap, scheduledHtml } from '../seo-release-runtime.js';

const queue = {
  locales: ['ru', 'uk', 'en', 'es'],
  batches: [{
    id: 'sample', kind: 'service', sourceSlug: 'old-service', targetSlug: 'better-service',
    status: 'ready', releaseAt: '2026-11-02T09:00:00Z', newLocales: ['es'],
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
  assert.equal(scheduledRoute(queue, '/es/services/old-service/', after), null);
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

test('the configured Meta Ads release preserves the indexed cohort and opens four localized targets', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const liveQueue = JSON.parse(await readFile(`${root}content/seo-release-queue.json`, 'utf8'));
  const cohort = JSON.parse(await readFile(`${root}content/seo-sitemap-cohort.json`, 'utf8'));
  const staticXml = await readFile(`${root}sitemap.xml`, 'utf8');
  const beforeRelease = new Date('2026-11-02T08:59:59Z');
  const atRelease = new Date('2026-11-02T09:00:00Z');

  assert.equal(scheduledSitemap(liveQueue, staticXml, beforeRelease), staticXml);
  for (const locale of liveQueue.locales) {
    const target = `/${locale}/services/real-estate-meta-ads/`;
    assert.deepEqual(scheduledRoute(liveQueue, target, beforeRelease), { status: 404 });
    assert.equal(scheduledRoute(liveQueue, target, atRelease), null);
    if (locale !== 'es') {
      assert.deepEqual(scheduledRoute(liveQueue, `/${locale}/services/meta-ads/`, atRelease), {
        status: 301, location: target,
      });
    }
  }

  const releasedXml = scheduledSitemap(liveQueue, staticXml, atRelease);
  for (const path of [...cohort.indexedBaseline, ...cohort.pilot]) {
    assert.ok(releasedXml.includes(`<loc>https://resetdigital.agency${path}</loc>`), path);
  }
  for (const locale of liveQueue.locales) {
    assert.ok(releasedXml.includes(`<loc>https://resetdigital.agency/${locale}/services/real-estate-meta-ads/</loc>`));
  }
  assert.equal((releasedXml.match(/<loc>/g) || []).length, 26);
});
