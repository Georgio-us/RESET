import test from 'node:test';
import assert from 'node:assert/strict';
import {renderArticle} from '../templates/articles/render.mjs';
const a={locale:'ru',category:'development',slug:'sample',status:'published',title:'A < B',description:'Description',blocks:{budget:{type:'table',caption:'Budget',columns:['Stage'],rows:[['Research']]}}};
test('article renderer preserves stable anchors, content, metadata and per-article attribution',()=>{
 const html=renderArticle(a,'<p>Introduction</p><h2 id="prices">Prices</h2><p>Body</p><!-- block:budget -->',[a],()=>true);
 assert.match(html,/<section id="prices"/);assert.match(html,/href="#prices"/);assert.match(html,/<p>Body<\/p>/);assert.match(html,/Research/);assert.match(html,/A &lt; B/);assert.match(html,/value="article-sample"/);
 const graph=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(graph['@graph'][0].headline,a.title);
});
test('draft recommendations stay hidden and invalid blocks or duplicate anchors fail',()=>{
 const draft={...a,slug:'draft',status:'draft'};const html=renderArticle(draft,'<p>Draft</p>',[draft],()=>true);
 assert.match(html,/noindex,follow/);assert.doesNotMatch(html,/ed-related-card/);
 assert.throws(()=>renderArticle(a,'<!-- block:missing -->',[a],()=>true),/Missing block/);
 assert.throws(()=>renderArticle(a,'<h2 id="same">One</h2><h2 id="same">Two</h2>',[a],()=>true),/Duplicate section/);
});
