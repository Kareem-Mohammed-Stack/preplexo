/**
 * Cart drawer DIY FBT — event delegation so it works after cart HTML swaps.
 */
(function () {
  if (window.__perplexoCartFbtBound) return;
  window.__perplexoCartFbtBound = true;

  function rootFrom(el) {
    return el && el.closest ? el.closest('[data-perplexo-cart-fbt]') : null;
  }

  function moneyFromCents(cents, moneyFormat) {
    var value = (Number(cents) / 100).toFixed(2);
    if (moneyFormat && moneyFormat.indexOf('{{') !== -1) {
      return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, value).replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, value.replace('.', ','));
    }
    return '$' + value;
  }

  document.addEventListener('click', function (event) {
    var pill = event.target.closest('[data-perplexo-cart-fbt] .perplexo-diy__variant-pill');
    if (pill) {
      var root = rootFrom(pill);
      if (!root || pill.disabled) return;
      root.querySelectorAll('.perplexo-diy__variant-pill').forEach(function (p) {
        p.classList.remove('is-active');
      });
      pill.classList.add('is-active');
      var btn = root.querySelector('[data-add-both]');
      if (btn) btn.dataset.companionVariant = pill.dataset.variantId;
      var priceEl = root.querySelector('[data-bundle-price]');
      if (priceEl && pill.dataset.bundlePrice != null) {
        priceEl.textContent = moneyFromCents(pill.dataset.bundlePrice, root.dataset.moneyFormat);
      }
      return;
    }

    var addBoth = event.target.closest('[data-perplexo-cart-fbt] [data-add-both]');
    if (!addBoth || addBoth.disabled) return;

    event.preventDefault();
    addBoth.disabled = true;
    var originalLabel = addBoth.textContent;
    addBoth.textContent = 'ADDING…';

    var companionId = Number(addBoth.dataset.companionVariant);
    var mainId = Number(addBoth.dataset.mainVariant);
    var diyInCart = addBoth.dataset.diyInCart === '1';
    var items = diyInCart
      ? [{ id: companionId, quantity: 1 }]
      : [
          { id: mainId, quantity: 1 },
          { id: companionId, quantity: 1 }
        ];

    var rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

    fetch(rootUrl + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        items: items,
        sections: 'cart-drawer,cart-icon-bubble',
        sections_url: window.location.pathname
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Add failed');
        return res.json();
      })
      .then(function (data) {
        var drawer = document.querySelector('cart-drawer');
        if (drawer) drawer.classList.remove('is-empty');

        if (drawer && typeof drawer.renderContents === 'function' && data.sections && data.sections['cart-drawer']) {
          drawer.renderContents(data);
          if (typeof drawer.open === 'function') drawer.open();
          return;
        }

        return fetch(rootUrl + 'cart?section_id=cart-drawer')
          .then(function (r) {
            return r.text();
          })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var newInner = doc.querySelector('.drawer__inner');
            var currentInner = document.querySelector('#CartDrawer .drawer__inner');
            if (newInner && currentInner) {
              currentInner.innerHTML = newInner.innerHTML;
            }
            var bubbleHtml = data.sections && data.sections['cart-icon-bubble'];
            if (bubbleHtml) {
              var bubbleDoc = new DOMParser().parseFromString(bubbleHtml, 'text/html');
              var newBubble = bubbleDoc.querySelector('.shopify-section');
              var curBubble = document.getElementById('shopify-section-cart-icon-bubble');
              if (!curBubble) {
                var iconBubble = document.querySelector('#cart-icon-bubble');
                if (iconBubble) curBubble = iconBubble.closest('.shopify-section');
              }
              if (newBubble && curBubble) curBubble.innerHTML = newBubble.innerHTML;
            }
          });
      })
      .catch(function () {
        addBoth.disabled = false;
        addBoth.textContent = originalLabel;
        alert('Could not add to cart. Please try again.');
      });
  });
})();
