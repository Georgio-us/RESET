import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
class Element {
  constructor(dataset = {}, textContent = '') { this.dataset = dataset; this.textContent = textContent; this.hidden = false; this.attributes = {}; this.events = {}; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, fn) { this.events[key] = fn; }
  fire(key, props = {}) { this.events[key]?.({ preventDefault() {}, ...props }); }
}
function setup() {
  const slides = [0, 1, 2].map(i => { const e = new Element(); e.hidden = i !== 0; e.querySelector = () => ({ textContent: `Project ${i}` }); return e; });
  const selectors = slides.map((_, i) => new Element({ featureSelect: String(i) }, `Project ${i}`));
  const filters = ['all', 'ads', 'development', 'crm', 'seo'].map(workFilter => new Element({ workFilter }, workFilter));
  const cards = ['ads', 'development', 'ads', 'ads', 'development crm', 'seo', 'crm'].map(workCategory => new Element({ workCategory }));
  const next = new Element(), prev = new Element(), status = new Element(), filterStatus = new Element(), showcase = new Element();
  showcase.querySelectorAll = key => key === '[data-feature]' ? slides : selectors;
  showcase.querySelector = key => ({ '[data-feature-prev]':prev, '[data-feature-next]':next, '[data-feature-status]':status, '.dev-feature-tabs':new Element() })[key];
  const document = { querySelector:key => key === '.dev-showcase' ? showcase : filterStatus, querySelectorAll:key => ({ '[data-work-filter]':filters, '[data-work-category]':cards })[key] || [] };
  vm.runInNewContext(readFileSync(new URL('../dev-home.js', import.meta.url), 'utf8'), { document });
  return { slides, selectors, filters, cards, next, prev, status, showcase };
}
test('preview buttons select one slide and wrap in both directions', () => {
  const x = setup(); x.prev.fire('click'); assert.deepEqual(x.slides.map(s => s.hidden), [true,true,false]);
  x.next.fire('click'); assert.deepEqual(x.slides.map(s => s.hidden), [false,true,true]);
  x.selectors[1].fire('click'); assert.equal(x.selectors[1].attributes['aria-pressed'], 'true'); assert.match(x.status.textContent, /2 \/ 3/);
});
test('each filter returns matching cases and All restores the full set', () => {
  const x = setup();
  for (const filter of x.filters.slice(1)) {
    filter.fire('click'); assert.ok(x.cards.some(c => !c.hidden));
    for (const card of x.cards) assert.equal(card.hidden, !card.dataset.workCategory.split(/\s+/).includes(filter.dataset.workFilter));
  }
  x.filters[0].fire('click'); assert.ok(x.cards.every(c => !c.hidden));
});
test('keyboard navigation works; vertical touch scrolling does not change a slide', () => {
  const x = setup(); x.showcase.fire('keydown', { key:'ArrowRight' }); assert.equal(x.slides[1].hidden,false);
  x.showcase.fire('touchstart', { touches:[{clientX:200,clientY:100}] }); x.showcase.fire('touchend', { changedTouches:[{clientX:120,clientY:400}] }); assert.equal(x.slides[1].hidden,false);
  x.showcase.fire('touchstart', { touches:[{clientX:200,clientY:100}] }); x.showcase.fire('touchend', { changedTouches:[{clientX:100,clientY:105}] }); assert.equal(x.slides[2].hidden,false);
});
