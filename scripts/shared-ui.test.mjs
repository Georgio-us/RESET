import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderSiteUI } from '../site-ui.js';
import { normalizeLead, contactLines } from '../lead-data.js';

test('all four contact methods and the company survive notification formatting', () => {
  for (const [contactMethod,label,contact] of [['phone','Телефон','+34600000000'],['telegram','Telegram','@test_user'],['whatsapp','WhatsApp','+380670000000'],['email','Email','test@example.com']]) {
    const lead = normalizeLead({ contactMethod, contact, company:' Sample Agency ', name:' Test ' });
    assert.equal(lead.contactMethod,contactMethod);
    assert.equal(lead.company,'Sample Agency');
    assert.deepEqual(contactLines(lead),['Имя: Test','Компания: Sample Agency',`${label}: ${contact}`]);
  }
});

test('shared renderer preserves article content and explicitly handles missing translations', () => {
  const article = '<main><article><h1>Original title</h1><p>Original text → intact</p></article></main>';
  const input = `<html><head></head><body><header>Old menu</header>${article}<footer class="journal-footer">Old footer</footer></body></html>`;
  const options = { locale:'ru',path:'/materials/marketing/new-article/',exists:path => path.startsWith('/ru/') };
  const output = renderSiteUI(input,options);
  assert.ok(output.includes(article));
  assert.ok(output.includes('href="/en/materials/" lang="en" hreflang="en" title='));
  assert.ok(output.includes('href="/ru/materials/marketing/new-article/"'));
  assert.equal(renderSiteUI(output,options),output);
});

test('unknown route names cannot inject markup through the language switcher', () => {
  const output = renderSiteUI('<html><head></head><body>404</body></html>', {path:'/ru/"<img src=x onerror=alert(1)>',exists:()=>false});
  assert.ok(!output.includes('<img src=x'));
  assert.ok(output.includes('&quot;&lt;img'));
});

test('every website page has one common shell, working language targets and no old modal', () => {
  const root = resolve(import.meta.dirname,'..');
  const walk = dir => readdirSync(dir,{withFileTypes:true}).flatMap(e => ['.git','docs','node_modules','cases_21.09','temporary_assets'].includes(e.name) ? [] : e.isDirectory() ? walk(resolve(dir,e.name)) : e.name.endsWith('.html') ? [resolve(dir,e.name)] : []);
  let count=0;
  for (const file of walk(root)) {
    const html = readFileSync(file,'utf8');
    assert.ok(html.includes('/design-tokens.css'),file);
    if (file.includes('presentation')) continue;
    count++;
    assert.equal((html.match(/<header\b/g)||[]).length,1,file);
    assert.equal((html.match(/class="reset-header"/g)||[]).length,1,file);
    assert.equal((html.match(/class="reset-footer"/g)||[]).length,1,file);
    assert.equal((html.match(/class="reset-dialog"/g)||[]).length,1,file);
    assert.ok(!html.includes('id="lead-modal"'),file);
    for (const [,path] of html.match(/<(?:nav class="reset-languages"|details class="niv-language")[\s\S]*?<\/nav>/)[0].matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)) {
      assert.ok(existsSync(resolve(root,'.'+(path.endsWith('/') ? path+'index.html' : path))),`${file} → ${path}`);
    }
  }
  assert.ok(count>190);
});

test('all migrated color and font tokens resolve to a root declaration', () => {
  const root = resolve(import.meta.dirname,'..');
  const tokens = readFileSync(resolve(root,'design-tokens.css'),'utf8');
  const cssFiles = readdirSync(root).filter(n=>n.endsWith('.css')).map(n=>resolve(root,n)).concat(resolve(root,'materials/materials.css'));
  for (const file of cssFiles) {
    for (const [,name] of readFileSync(file,'utf8').matchAll(/var\((--(?:tone-|color-|font-)[\w-]+)\)/g)) assert.ok(tokens.includes(name+':'),`${file}: ${name}`);
  }
});

test('Google evidence stays paired and interface screenshots keep their device frames', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const prefix of ['', 'ru/', 'uk/', 'en/', 'es/']) {
    const google = await readFile(new URL('../' + prefix + 'cases/shepit-google-ads.html', import.meta.url), 'utf8');
    assert.equal((google.match(/class="sales-evidence-row"/g) || []).length, 3);
    const website = await readFile(new URL('../' + prefix + 'cases/nivellux.html', import.meta.url), 'utf8');
    assert.equal((website.match(/class="phone-frame"/g) || []).length, 2);
    assert.equal((website.match(/class="browser-frame"/g) || []).length, 3);
    const crm = await readFile(new URL('../' + prefix + 'cases/delmar-custom-crm.html', import.meta.url), 'utf8');
    assert.equal((crm.match(/class="browser-frame"/g) || []).length, 5);
  }
});

test('page asset versions survive shared rendering and repeated builds', () => {
 const input='<html><head><link rel="stylesheet" href="/widget-case.css?v=20260925-pricing"><script src="/local.js?version=new" defer></script><script src="/unversioned.js" defer></script></head><body data-reset-ui></body></html>';
 const options={path:'/ru/cases/via-ai-widget.html',exists:()=>true};
 const output=renderSiteUI(input,options);
 assert.ok(output.includes('/widget-case.css?v=20260925-pricing'));
 assert.ok(output.includes('/local.js?version=new'));
 assert.ok(output.includes('/unversioned.js?v=20260922-ui7'));
 assert.equal(renderSiteUI(output,options),output);
});
