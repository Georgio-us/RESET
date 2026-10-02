import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeHeadings} from '../heading-style.js';
test('heading punctuation preserves markup, decimals and body copy',()=>{
 const html='<h1 id="keep-id">CRM — заявки.<br><em>Результат – 1.2%</em>.</h1><p>Текст — без изменений.</p>';
 const expected='<h1 id="keep-id">CRM - заявки<br><em>Результат - 1.2%</em></h1><p>Текст — без изменений.</p>';
 assert.equal(normalizeHeadings(html),expected);
 assert.equal(normalizeHeadings(expected),expected);
});
