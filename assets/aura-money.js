/**
 * Normalize money display to USD ($) in dynamic/AJAX UI (cart drawer, etc.).
 */
(function () {
  const PREFIX = '$';

  function normalizeMoneyText(text) {
    if (!text || typeof text !== 'string') return text;
    if (!/[\$€£]|USD|EGP|US\$|E£|\bLE\b|L\.E\./i.test(text)) return text;

    let out = text;
    out = out.replace(/\bUS\$\b/gi, '');
    out = out.replace(/\$/g, '');
    out = out.replace(/\bUSD\b/gi, '');
    out = out.replace(/\bEGP\b/gi, '');
    out = out.replace(/\bE£\b/gi, '');
    out = out.replace(/\bLE\b(?!\.)/gi, '');
    out = out.replace(/L\.E\./gi, '');
    out = out.replace(/\s{2,}/g, ' ').trim();
    if (!out) return text;
    // Keep leading currency clean for "LE 1,790.47" style leftovers
    return PREFIX + out.replace(/^\s+/, '');
  }

  function rewriteNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.closest && node.closest('script, style, noscript, [data-aura-money-skip]')) return;

    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    const texts = [];
    while (walk.nextNode()) texts.push(walk.currentNode);
    texts.forEach((t) => {
      const next = normalizeMoneyText(t.nodeValue);
      if (next !== t.nodeValue) t.nodeValue = next;
    });
  }

  const SELECTORS = [
    '.price-item',
    '.cart-item__price',
    '.cart-item__discounted-prices',
    '.totals__total-value',
    '.totals__subtotal-value',
    '.field-currency',
    '.cart-drawer .product-option',
    '.predictive-search__item-price',
  ].join(',');

  function rewriteAll(root) {
    const scope = root || document;
    scope.querySelectorAll(SELECTORS).forEach(rewriteNode);
    scope.querySelectorAll('.field-currency').forEach((el) => {
      el.textContent = '$';
    });
  }

  window.auraFormatMoney = function (cents) {
    const amount = (Number(cents) / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return PREFIX + amount;
  };

  window.theme = window.theme || {};
  window.theme.moneyFormat = '${{amount}}';
  window.theme.moneyWithCurrencyFormat = '${{amount}} USD';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => rewriteAll());
  } else {
    rewriteAll();
  }

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) rewriteAll(n);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
