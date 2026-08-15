(() => {
  const icons = {
    '↗': ['M5 19 19 5', 'M9 5h10v10'],
    '→': ['M4 12h16', 'm14 6 6 6-6 6'],
    '←': ['M20 12H4', 'm10 6-6 6 6 6'],
    '↓': ['M12 4v16', 'm6 14 6 6 6-6'],
    '↑': ['M12 20V4', 'm6 10 6-6 6 6'],
  };
  const arrowPattern = /[↗→←↓↑]/g;
  const namespace = 'http://www.w3.org/2000/svg';

  const createIcon = (direction) => {
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('class', `icon-arrow icon-arrow--${direction}`);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '1em');
    svg.setAttribute('height', '1em');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'display:inline-block;flex:none;vertical-align:-0.12em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round';
    icons[direction].forEach((pathData) => {
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute('d', pathData);
      svg.append(path);
    });
    return svg;
  };

  const replaceArrows = (root = document) => {
    root.querySelectorAll?.('a, button').forEach((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (!arrowPattern.test(node.nodeValue)) return;
        arrowPattern.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let cursor = 0;
        node.nodeValue.replace(arrowPattern, (arrow, offset) => {
          fragment.append(node.nodeValue.slice(cursor, offset), createIcon(arrow));
          cursor = offset + arrow.length;
          return arrow;
        });
        fragment.append(node.nodeValue.slice(cursor));
        node.replaceWith(fragment);
      });
    });
  };

  const start = () => {
    replaceArrows();
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) replaceArrows(node.parentElement || document);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
