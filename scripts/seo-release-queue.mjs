import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const queue = JSON.parse(await readFile(resolve(root, 'content/seo-release-queue.json'), 'utf8'));
const cohort = JSON.parse(await readFile(resolve(root, 'content/seo-sitemap-cohort.json'), 'utf8'));
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const locales = new Set(['ru', 'uk', 'en', 'es']);
const statuses = new Set(['needs-editorial', 'ready', 'released']);
const seen = new Set();
const blockers = [];

if (queue.version !== 1 || queue.locales.length !== 4 || queue.locales.some(locale => !locales.has(locale))) {
  throw new Error('Invalid SEO release queue format or locales');
}

for (const batch of queue.batches) {
  if (seen.has(batch.id)) throw new Error(`Duplicate batch: ${batch.id}`);
  seen.add(batch.id);
  if (!statuses.has(batch.status)) throw new Error(`Invalid status: ${batch.id}`);
  if (!['case', 'service'].includes(batch.kind)) throw new Error(`Invalid kind: ${batch.id}`);
  if (batch.status !== 'needs-editorial' && !batch.targetSlug) throw new Error(`Missing target URL: ${batch.id}`);
  if (batch.status === 'ready' && (!batch.releaseAt || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(batch.releaseAt))) {
    throw new Error(`Ready batch has no UTC release time: ${batch.id}`);
  }
  if (batch.status === 'ready' && queue.locales.some(locale => !batch.labels?.[locale])) {
    throw new Error(`Ready batch has no localized navigation labels: ${batch.id}`);
  }
  if (batch.status === 'released' && !batch.releasedAt) throw new Error(`Released batch has no date: ${batch.id}`);

  for (const locale of queue.locales) {
    const source = batch.kind === 'case'
      ? `/${locale}/cases/${batch.sourceSlug}`
      : `/${locale}/services/${batch.sourceSlug}/`;
    const sourceFile = resolve(root, `.${source}${source.endsWith('/') ? 'index.html' : ''}`);
    if (batch.newLocales?.includes(locale) && existsSync(sourceFile)) throw new Error(`New locale already has a source URL: ${source}`);
    if (batch.status !== 'released' && !batch.newLocales?.includes(locale) && !existsSync(sourceFile)) {
      if (batch.status === 'ready') throw new Error(`Missing source: ${source}`);
      blockers.push(`Missing locale page: ${source}`);
      continue;
    }
    if (cohort.indexedBaseline.includes(source)) throw new Error(`Indexed baseline must not migrate automatically: ${source}`);
    if (!batch.targetSlug) continue;

    const target = batch.kind === 'case'
      ? `/${locale}/cases/${batch.targetSlug}`
      : `/${locale}/services/${batch.targetSlug}/`;
    const targetFile = resolve(root, `.${target}${target.endsWith('/') ? 'index.html' : ''}`);
    if (!existsSync(targetFile)) throw new Error(`Missing target: ${target}`);
    const html = await readFile(targetFile, 'utf8');
    if (!html.includes(`rel="canonical" href="https://resetdigital.agency${target}"`)) {
      throw new Error(`Wrong canonical: ${target}`);
    }
    if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) throw new Error(`Noindex target: ${target}`);
    for (const alternate of queue.locales) {
      const alternateTarget = batch.kind === 'case'
        ? `/${alternate}/cases/${batch.targetSlug}`
        : `/${alternate}/services/${batch.targetSlug}/`;
      if (!html.includes(`hreflang="${alternate}" href="https://resetdigital.agency${alternateTarget}"`)) {
        throw new Error(`Missing alternate ${alternate}: ${target}`);
      }
    }
    if (batch.status === 'released' && (!cohort.pilot.includes(target) || !sitemap.includes(`<loc>https://resetdigital.agency${target}</loc>`))) {
      throw new Error(`Released URL missing from sitemap: ${target}`);
    }
    if (batch.status !== 'released' && sitemap.includes(`<loc>https://resetdigital.agency${target}</loc>`)) {
      throw new Error(`Unreleased URL in sitemap: ${target}`);
    }
  }
}

const released = queue.batches.filter(batch => batch.status === 'released').length;
const ready = queue.batches.filter(batch => batch.status === 'ready').length;
const needsEditorial = queue.batches.filter(batch => batch.status === 'needs-editorial').length;
console.log(`SEO queue: ${released} released, ${ready} ready, ${needsEditorial} need editorial work.`);
for (const blocker of blockers) console.log(`- ${blocker}`);
