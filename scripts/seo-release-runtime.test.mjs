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

test('each configured service release preserves the indexed cohort and opens four localized targets', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const liveQueue = JSON.parse(await readFile(`${root}content/seo-release-queue.json`, 'utf8'));
  const cohort = JSON.parse(await readFile(`${root}content/seo-sitemap-cohort.json`, 'utf8'));
  const staticXml = await readFile(`${root}sitemap.xml`, 'utf8');
  const spanishHome = await readFile(`${root}es/index.html`, 'utf8');
  const ready = liveQueue.batches.filter(batch => batch.status === 'ready');
  assert.equal(ready.length, 6);
  for (const [index, batch] of ready.entries()) {
    const atRelease = new Date(batch.releaseAt);
    const beforeRelease = new Date(atRelease.getTime() - 1);
    const beforeXml = scheduledSitemap(liveQueue, staticXml, beforeRelease);
    const releasedXml = scheduledSitemap(liveQueue, staticXml, atRelease);
    assert.equal((beforeXml.match(/<loc>/g) || []).length, 22 + index * 4);
    assert.equal((releasedXml.match(/<loc>/g) || []).length, 22 + (index + 1) * 4);
    for (const path of [...cohort.indexedBaseline, ...cohort.pilot]) {
      assert.ok(releasedXml.includes(`<loc>https://resetdigital.agency${path}</loc>`), path);
    }
    for (const locale of liveQueue.locales) {
      const target = `/${locale}/services/${batch.targetSlug}/`;
      assert.deepEqual(scheduledRoute(liveQueue, target, beforeRelease), { status: 404 });
      assert.equal(scheduledRoute(liveQueue, target, atRelease), null);
      assert.ok(!beforeXml.includes(`<loc>https://resetdigital.agency${target}</loc>`));
      assert.ok(releasedXml.includes(`<loc>https://resetdigital.agency${target}</loc>`));
      if (locale !== 'es') {
        assert.deepEqual(scheduledRoute(liveQueue, `/${locale}/services/${batch.sourceSlug}/`, atRelease), {
          status: 301, location: target,
        });
      }
    }
    const spanishTarget = `href="/es/services/${batch.targetSlug}/"`;
    assert.ok(!scheduledHtml(liveQueue, spanishHome, 'es', beforeRelease).includes(spanishTarget));
    const releasedHome = scheduledHtml(liveQueue, spanishHome, 'es', atRelease);
    assert.equal(releasedHome.split(spanishTarget).length - 1, 1);
  }
});
