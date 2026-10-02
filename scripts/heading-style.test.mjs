import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeHeadings} from '../heading-style.js';
test('heading punctuation preserves markup, decimals and body copy',()=>{
 const html='<h1 id="keep-id">CRM — заявки.<br><em>Результат – 1.2%</em>.</h1><p>Текст — без изменений.</p>';
 const expected='<h1 id="keep-id">CRM - заявки<br><em>Результат - 1.2%</em></h1><p>Текст — без изменений.</p>';
 assert.equal(normalizeHeadings(html),expected);
 assert.equal(normalizeHeadings(expected),expected);
});

test('site copy uses hyphens without changing code, links or sentence periods', async()=>{
 const {normalizeTextDashes}=await import('../heading-style.js');
 assert.equal(normalizeTextDashes('<p>Сайт — работает. 2026–2027</p><a href="/a–b/">Текст &mdash; ещё.</a><script>const x="—";</script>'),'<p>Сайт - работает. 2026-2027</p><a href="/a–b/">Текст - ещё.</a><script>const x="—";</script>');
});
test('provider tax ID appears in every localized footer',async()=>{
 const {providerDetails}=await import('../provider-details.js');
 for(const lang of ['ru','uk','en','es'])assert.match(providerDetails(lang,true),/РНОКПП \/ Tax ID: <span translate="no">3672303085<\/span>/);
});
