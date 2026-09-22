export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const plain = html => String(html || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
export const icon = name => `<svg class="ed-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${({arrow:'<path d="M5 19 19 5M5 5h14v14"/>',down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',telegram:'<path d="m21 3-7.4 18-4.1-7.5L2 10.4zM9.5 13.5 21 3"/>',whatsapp:'<path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z"/><path d="M8 7c0 5 4 8 8 8l-1-3-2 1-2-2 1-2Z"/>',facebook:'<path d="M14 21v-9h3l.5-4H14V6c0-1 .5-1.5 2-1.5h2V1h-3c-4 0-5 2-5 5v2H7v4h3v9"/>'})[name] || ''}</svg>`;
export function safeURL(url) {
 if (!url || /[<>"'\s]/.test(url) || !/^(https?:\/\/|\/(?!\/)|#[\w-])/.test(url)) throw Error(`Invalid article URL: ${url}`);
 return escape(url);
}
export function block(b, c) {
 switch(b.type) {
 case 'faq': return `<div class="ed-faq">${b.items.map(i=>`<details><summary>${escape(i.question)}</summary><p>${escape(i.answer)}</p></details>`).join('')}</div>`;
 case 'sources': return `<ol class="ed-sources">${b.items.map(i=>`<li><a href="${safeURL(i.url)}" target="_blank" rel="noopener noreferrer">${escape(i.title)}</a></li>`).join('')}</ol>`;
 case 'prices': return `<div class="ed-price-grid">${b.items.map(i=>`<div class="ed-price"><h3>${escape(i.title)}</h3><strong>${escape(i.price)}</strong><p>${escape(i.description)}</p></div>`).join('')}</div>${b.note?`<p class="ed-note">${escape(b.note)}</p>`:''}`;
 case 'table': return `<div class="ed-table-wrap" tabindex="0" role="region" aria-label="${escape(b.caption)}"><table class="ed-table"><caption>${escape(b.caption)}</caption><thead><tr>${b.columns.map(t=>`<th scope="col">${escape(t)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map(t=>`<td>${escape(t)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 case 'steps': return `<ol class="ed-process">${b.items.map((s,i)=>`<li><span class="ed-step">${String(i+1).padStart(2,'0')}</span><h3>${escape(s.title)}</h3>${s.html}${s.result?`<p class="ed-step-result">${escape(c.stepResult)}: ${escape(s.result)}</p>`:''}</li>`).join('')}</ol>`;
 case 'note': return `<aside class="ed-note-box">${b.title?`<p class="ed-eyebrow">${escape(b.title)}</p>`:''}<p>${escape(b.text)}</p></aside>`;
 case 'image': return `<figure class="ed-photo"><img src="${safeURL(b.src)}" alt="${escape(b.alt)}" width="${Number(b.width)}" height="${Number(b.height)}" loading="lazy" decoding="async">${b.caption?`<figcaption>${escape(b.caption)}</figcaption>`:''}</figure>`;
 case 'related': return `<a class="ed-readmore" href="${safeURL(b.url)}"><span>${b.label?`<small>${escape(b.label)}</small>`:''}${escape(b.title)}</span>${icon('arrow')}</a>`;
 default: throw Error(`Unknown editorial block: ${b.type}`);
 }
}
