// Editorial rule: heading dashes use hyphens; sentence-ending dots are omitted.
// Keep markup, attributes, decimal points and body copy untouched.
export const normalizeHeadingText = text => text
  .replace(/[\u2013\u2014]|&(?:m|n)dash;|&#(?:8211|8212);|&#x201[34];/gi, '-')
  .replace(/\.(?=\s|$)/g, '');
export const normalizeHeadings = html => html.replace(/(<h[1-6]\b[^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi,
  (_, open, body, close) => open + body.split(/(<[^>]*>)/g).map(part => part.startsWith('<') ? part : normalizeHeadingText(part)).join('') + close);

// Apply the site-wide dash rule only to visible text, never URLs or executable code.
export const normalizeTextDashes = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[^]*?-->|<[^>]*>|[^<]+/gi,
  token => token.startsWith('<') ? token : token.replace(/[\u2013\u2014]|&(?:m|n)dash;|&#(?:8211|8212);|&#x201[34];/gi, '-'));
