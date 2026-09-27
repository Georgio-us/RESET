import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('ESTYLE publishes its own evidence and never loads legacy cross-case injections',()=>{
  for(const lang of ['ru','uk','en','es']){
    const html=readFileSync(new URL(`../${lang}/cases/estyle-spain.html`,import.meta.url),'utf8');
    assert.doesNotMatch(html,/<script[^>]+src=["'][^"']*\/app\.js/);
    assert.match(html,/class="estyle-evidence"/);
    assert.match(html,/89 \/ 164/);
    assert.match(html,/15 076/);
    assert.match(html,/11 721/);
    assert.match(html,new RegExp(`/assets/estyle-search-${lang}\\.svg`));
    assert.match(html,/03 \/ 15/);
    assert.doesNotMatch(html,/shepit_assets|100\+|755 грн/);
  }
});
