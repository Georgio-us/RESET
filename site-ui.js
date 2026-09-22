import { uiCopy } from './ui-copy.js';
const escapeAttribute = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const arrow = '<svg class="reset-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
export const socialLinks = { telegram: 'https://t.me/Georgio_P', instagram: null, threads: null };
const brand = (locale) => `<a class="reset-brand" href="/${locale}/" aria-label="RESET">RE<span>SET</span></a>`;
const versionAssets = html => html.replace(/(<(?:link|script)\b[^>]*(?:href|src)=")([^"?]+\.(?:css|js))(?:\?[^\"]*)?("[^>]*>)/g, (match, before, url, after) => /^(https?:)?\/\//.test(url) ? match : `${before}${url}?v=20260922-ui7${after}`);

export function contactForm(locale, source) {
  const c = uiCopy[locale];
  return `<form class="reset-form" data-reset-form>
    <input type="hidden" name="source" value="${source}">
    <label>${c.name}<input name="name" autocomplete="name" maxlength="120"></label>
    <label>${c.company}<input name="company" autocomplete="organization" maxlength="180"></label>
    <label>${c.method}<select name="contactMethod"><option value="phone">${c.phone}</option><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></label>
    <label>${c.contact}<input name="contact" type="tel" autocomplete="tel" inputmode="tel" placeholder="+34 600 000 000" required maxlength="180"></label>
    <label class="reset-form-wide">${c.task}<textarea name="message" rows="3" maxlength="2000"></textarea></label>
    <label class="reset-form-consent reset-form-wide"><input type="checkbox" name="consent" required><span>${c.consent} <a href="/${locale}/privacy.html">${c.consentLink}</a>.</span></label>
    <button class="reset-button reset-form-wide" type="submit">${c.send}${arrow}</button>
    <p class="reset-form-status reset-form-wide" role="status" aria-live="polite"></p>
  </form>`;
}

// Target balanced HTML elements without interpreting or rewriting article content.
function replaceElement(html, opening, replacement) {
  const match = opening.exec(html);
  if (!match) return html;
  const tag = /^<([\w-]+)/.exec(match[0])[1];
  const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tokens.lastIndex = match.index;
  let depth = 0, token;
  while ((token = tokens.exec(html))) {
    depth += token[0].startsWith('</') ? -1 : 1;
    if (!depth) return html.slice(0, match.index) + replacement + html.slice(tokens.lastIndex);
  }
  return html;
}

export function renderSiteUI(html, { locale = 'ru', path = '/', exists = () => true } = {}) {
  html = html.replace(/<link\b[^>]*href="\/(?:design-tokens|shared-ui)\.css(?:\?[^"]*)?"[^>]*>/g, '')
    .replace(/<script\b[^>]*src="\/(?:shared-ui|arrow-icons)\.js(?:\?[^"]*)?"[^>]*><\/script>/g, '');
  // Presentations keep their independent print/slide canvas, not website navigation.
  if (/presentation/.test(path)) return versionAssets(html.replace('</head>', '<link rel="stylesheet" href="/design-tokens.css?v=20260922-ui7"><script src="/arrow-icons.js?v=20260922-ui7" defer></script></head>'));
  const c = uiCopy[locale] || uiCopy.ru;
  const home = `/${locale}/`;
  const nav = `<a href="${home}#system">${c.how}</a><a href="${home}#case-index">${c.cases}</a><a href="${home}#services">${c.services}</a><a href="${home}materials/">Journal</a>`;
  const relative = path.replace(/^\/(ru|uk|en|es)(?=\/|$)/, '').replace(/index\.html$/, '') || '/';
  const languages = ['ru', 'uk', 'en', 'es'].map(lang => {
    const target = `/${lang}${relative}`;
    const available = exists(target) || lang === locale;
    const destination = exists(target) ? target : lang === locale ? path : null;
    const fallback = relative.startsWith('/materials/') ? `/${lang}/materials/` : relative.startsWith('/cases/') ? `/${lang}/#case-index` : `/${lang}/`;
    return `<a href="${escapeAttribute(destination || fallback)}" lang="${lang}" hreflang="${lang}"${lang === locale ? ' aria-current="page"' : ''}${available ? '' : ` title="${c.unavailable}"`}>${lang === 'uk' ? 'UA' : lang.toUpperCase()}</a>`;
  }).join('');
  const presentation = ['ru', 'uk'].includes(locale) ? `<a href="/presentation${locale === 'uk' ? '-uk' : ''}.html">${c.presentation}${arrow}</a>` : '';
  let header = `<header class="reset-header"><div class="reset-shell reset-header-inner">${brand(locale)}<nav class="reset-navigation" aria-label="${c.menu}">${nav}${presentation}</nav><nav class="reset-languages" aria-label="${c.language}">${languages}</nav><a class="reset-header-cta" href="${home}#contact" data-reset-contact>${c.discuss}${arrow}</a><details class="reset-menu"><summary>${c.menu}<svg class="reset-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary><nav aria-label="${c.menu}">${nav}${presentation}<a href="${home}#contact" data-reset-contact>${c.discuss}${arrow}</a></nav></details></div></header>`;
  header = header.replace(`<nav class="reset-languages" aria-label="${c.language}">${languages}</nav>`, `<details class="niv-language"><summary aria-label="${c.language}">${locale === 'uk' ? 'UA' : locale.toUpperCase()}<svg class="reset-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><nav aria-label="${c.language}">${languages}</nav></details>`);
  header = header.replace(`<summary>${c.menu}<svg`, `<summary aria-label="${c.menu}"><svg`);
  const socials = [['telegram','Telegram'],['instagram','Instagram'],['threads','Threads']].map(([key,label]) => socialLinks[key] ? `<a href="${escapeAttribute(socialLinks[key])}" target="_blank" rel="noreferrer">${label}${arrow}</a>` : `<span class="reset-social-pending">${label}</span>`).join('');
  const footer = `<footer class="reset-footer"><div class="reset-shell reset-footer-inner">${brand(locale)}<nav aria-label="${c.menu}">${nav}<a href="${home}#contact" data-reset-contact>${c.discuss}</a></nav><div class="reset-footer-contact"><a href="mailto:hello@reset.agency">hello@reset.agency</a>${socials}</div><div class="reset-footer-bottom"><span>© 2017–2026 RESET</span><a href="${home}privacy.html">${c.policy}</a><a href="${home}sitemap.html">${c.sitemap}</a></div></div></footer>`;
  if (/<header\b/i.test(html)) html = html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, header);
  else html = html.replace(/<body\b[^>]*>/i, '$&' + header);
  const footerPattern = /<footer\b[^>]*class="(?:reset-footer|site-footer|sales-footer|vw-footer|detail-footer|journal-footer)[^"]*"[^>]*>[\s\S]*?<\/footer>/i;
  html = footerPattern.test(html) ? html.replace(footerPattern, footer) : html.replace('</body>', footer + '</body>');
  html = replaceElement(html, /<div\b[^>]*id="lead-modal"[^>]*>/i, '');
  html = html.replace(/<dialog\b[^>]*class="reset-dialog"[^>]*>[\s\S]*?<\/dialog>/gi, '');
  html = html.replace(/<form\b[^>]*class="(?:diagnostic-form|reset-form)"[^>]*>[\s\S]*?<\/form>/gi, form => contactForm(locale, escapeAttribute(form.match(/name="source"\s+value="([^"]*)"/)?.[1] || 'open-form')));
  const modal = `<dialog class="reset-dialog" aria-labelledby="reset-dialog-title"><button class="reset-dialog-close" type="button" aria-label="${c.close}"><svg class="reset-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="reset-dialog-title">${c.title}</h2><p>${c.intro}</p>${contactForm(locale, 'cta')}</dialog>`;
  html = html.replace('</body>', modal + '</body>');
  html = html.replace(/<body\b(?: data-reset-ui)?/i, '<body data-reset-ui');
  html = html.replace('</head>', '<link rel="stylesheet" href="/design-tokens.css?v=20260922-ui7"><link rel="stylesheet" href="/shared-ui.css?v=20260922-ui7"><script type="module" src="/shared-ui.js?v=20260922-ui7"></script><script src="/arrow-icons.js?v=20260922-ui7" defer></script></head>');
  return versionAssets(html);
}
