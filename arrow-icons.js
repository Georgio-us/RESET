(() => {
  const paths = {
    '↗': ['M5 19 19 5', 'M5 5h14v14'], '→': ['M4 12h16', 'm14 6 6 6-6 6'],
    '←': ['M20 12H4', 'm10 6-6 6 6 6'], '↓': ['M12 4v16', 'm6 14 6 6 6-6'],
    '↑': ['M12 20V4', 'm6 10 6-6 6 6'], '✓': ['m5 12 4 4L19 6'],
    '×': ['m6 6 12 12M18 6 6 18'], '⌖': ['M12 2v4m0 12v4M2 12h4m12 0h4', 'M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0'],
    '⌂': ['m3 11 9-8 9 8M5 9v12h14V9M10 21v-7h4v7'],
    '◉': ['M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
    '⌁': ['M3 15c3-12 6 12 9 0s6 12 9 0'], '⌕': ['M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0', 'm15 15 6 6'],
    '🌐': ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18'],
  };
  const pattern = /[↗→←↓↑✓×⌖⌂◉⌁⌕🌐]/gu;
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = glyph => {
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('class', 'icon-arrow reset-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '1em'); svg.setAttribute('height', '1em');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'display:inline-block;flex:none;vertical-align:-.12em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round';
    paths[glyph].forEach(d => { const path = document.createElementNS(namespace, 'path'); path.setAttribute('d', d); svg.append(path); });
    return svg;
  };
  function replace(root) {
    if (!root || root.closest?.('script,style,svg,textarea,select,code,pre,[contenteditable]')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    if (root.nodeType === Node.TEXT_NODE) nodes.push(root);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest('script,style,svg,textarea,select,code,pre,[contenteditable]')) continue;
      const text = node.nodeValue;
      pattern.lastIndex = 0;
      const matches = [...text.matchAll(pattern)];
      if (!matches.length) continue;
      const fragment = document.createDocumentFragment(); let cursor = 0;
      for (const match of matches) { fragment.append(text.slice(cursor, match.index), icon(match[0])); cursor = match.index + match[0].length; }
      fragment.append(text.slice(cursor)); node.replaceWith(fragment);
    }
  }
  function start() {
    replace(document.body);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') replace(record.target);
        else for (const node of record.addedNodes) replace(node);
      }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
