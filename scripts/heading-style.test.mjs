import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeHeadings, normalizeStandaloneSentences} from '../heading-style.js';
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
test('one-sentence body blocks omit final dots while multi-sentence copy and metadata keep them',()=>{
 const html='<meta name="description" content="Один текст."><h2>Заголовок.</h2><p>Короткая мысль.</p><p>Первая мысль. Вторая мысль.</p><p>Цена $6.79.</p><p>Текст с <strong>акцентом.</strong></p><li>Один пункт.</li><figcaption>Снимок экрана.</figcaption><script>const sample="<p>В коде.</p>";</script>';
 const expected='<meta name="description" content="Один текст."><h2>Заголовок.</h2><p>Короткая мысль</p><p>Первая мысль. Вторая мысль.</p><p>Цена $6.79</p><p>Текст с <strong>акцентом</strong></p><li>Один пункт</li><figcaption>Снимок экрана</figcaption><script>const sample="<p>В коде.</p>";</script>';
 assert.equal(normalizeStandaloneSentences(html),expected);
 assert.equal(normalizeStandaloneSentences(expected),expected);
});
test('punctuation follows sentence boundaries in translated paragraphs',()=>{
 assert.equal(normalizeStandaloneSentences('<p>Una frase.</p><p>Primero revisamos la web. Después lanzamos la campaña.</p>','es'),'<p>Una frase</p><p>Primero revisamos la web. Después lanzamos la campaña.</p>');
 assert.equal(normalizeStandaloneSentences('<p>Ми перевіряємо сторінку. Потім запускаємо рекламу.</p>','uk'),'<p>Ми перевіряємо сторінку. Потім запускаємо рекламу.</p>');
});
test('standalone case cover captions omit a final dot',()=>{
 assert.equal(normalizeStandaloneSentences('<em class="case-cover-caption">A clear result.</em><em>Keep this.</em>','en'),'<em class="case-cover-caption">A clear result</em><em>Keep this.</em>');
});
test('provider tax ID appears in every localized footer',async()=>{
 const {providerDetails}=await import('../provider-details.js');
 for(const lang of ['ru','uk','en','es'])assert.match(providerDetails(lang,true),/РНОКПП \/ Tax ID: <span translate="no">3672303085<\/span>/);
});
