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

const sentenceSegmenters = new Map();
const segmenterFor = locale => {
  if (!sentenceSegmenters.has(locale)) sentenceSegmenters.set(locale, new Intl.Segmenter(locale, { granularity: 'sentence' }));
  return sentenceSegmenters.get(locale);
};

// Editorial punctuation applies to standalone visible body text, not metadata.
// Preserve paragraphs with multiple sentences and leave markup/attributes intact.
export function normalizeStandaloneSentences(html, locale = 'ru') {
  const normalizeTag = (chunk, tag, requiredClass = null) => chunk.replace(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'), (element, body) => {
    if (requiredClass && !new RegExp(`class="[^"]*\\b${requiredClass}\\b`).test(element)) return element;
    if (/<(?:p|li|div|section|ol|ul|h[1-6]|table)\b/i.test(body)) return element;
    const visible = body.replace(/<[^>]*>/g, '').replace(/&(?:nbsp|thinsp);|&#(?:160|8239);/gi, ' ').trim();
    if (!visible.endsWith('.')) return element;
    const sentences = [...segmenterFor(locale).segment(visible)].filter(part => part.segment.trim());
    if (sentences.length !== 1) return element;
    const tokens = body.split(/(<[^>]*>)/g);
    for (let index = tokens.length - 1; index >= 0; index--) {
      if (tokens[index].startsWith('<') || !tokens[index].trim()) continue;
      if (!/\.\s*$/.test(tokens[index])) return element;
      tokens[index] = tokens[index].replace(/\.(\s*)$/, '$1');
      return element.replace(body, tokens.join(''));
    }
    return element;
  });
  const process = chunk => normalizeTag(['p', 'figcaption', 'li'].reduce((current, tag) => normalizeTag(current, tag), chunk), 'em', 'case-cover-caption');
  return html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[^]*?-->)/gi)
    .map(chunk => /^(?:<script\b|<style\b|<!--)/i.test(chunk) ? chunk : process(chunk)).join('');
}
