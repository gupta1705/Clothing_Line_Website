(() => {
  'use strict';
  const key = 'pradhan-preview-bag-v1';
  const catalogue = {
    shirt: { name: 'Everyday shirt', price: 1490 },
    kurta: { name: 'Classic kurta', price: 2490 },
    jacket: { name: 'Nehru jacket', price: 3990 }
  };
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const formatPrice = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const normalise = value => {
    if (!value || !Object.hasOwn(catalogue, value.id) || !sizes.includes(value.size)) return null;
    return { id: value.id, ...catalogue[value.id], size: value.size, quantity: Math.min(20, Math.max(1, Math.floor(Number(value.quantity) || 1))), giftWrap: Boolean(value.giftWrap), hidePrices: Boolean(value.hidePrices), giftMessage: String(value.giftMessage || '').trim().slice(0, 240) };
  };
  let items = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) items = saved.slice(0, 50).map(normalise).filter(Boolean);
  } catch (_) { /* The bag remains usable when browser storage is unavailable. */ }
  const dialog = document.createElement('dialog');
  dialog.className = 'shop-bag';
  dialog.setAttribute('aria-labelledby', 'bag-title');
  dialog.innerHTML = `<div class="bag-shell"><div class="bag-heading"><h2 id="bag-title" tabindex="-1">Your bag</h2><button class="bag-close" type="button" aria-label="Close bag">Close <span aria-hidden="true">×</span></button></div><p class="bag-caption">Your Pradhan selection</p><div class="bag-items"></div><div class="bag-empty"><p>A little room for something from Phulera.</p><a href="collection.html?collection=all" class="bag-primary">Browse the collection</a></div><div class="bag-bottom"><div class="bag-total" aria-live="polite" aria-atomic="true"><span>Sample subtotal</span><strong></strong></div><p class="bag-small">Illustrative garments and prices. This preview does not take orders or payments.</p><button type="button" class="bag-primary bag-review">Review bag <span aria-hidden="true">→</span></button><div class="bag-review-note" hidden tabindex="-1"><h3>Your selection is ready to review.</h3><p>Sizes and gift choices are saved in this browser. Final products, delivery charges and checkout will be available when the store launches. No order has been placed.</p></div></div><button class="bag-continue" type="button">Continue browsing</button><p class="bag-storage" hidden>Browser storage is unavailable. Your bag will last until you leave this page.</p></div>`;
  document.body.append(dialog);
  const list = dialog.querySelector('.bag-items');
  const review = dialog.querySelector('.bag-review-note');
  let opener = null;
  const textElement = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  };
  function save() {
    try { localStorage.setItem(key, JSON.stringify(items)); }
    catch (_) { dialog.querySelector('.bag-storage').hidden = false; }
  }
  function render() {
    list.replaceChildren();
    items.forEach((item, index) => {
      const row = textElement('article', 'bag-item', '');
      row.append(textElement('h3', '', item.name));
      const details = [`Size ${item.size}`, ...(item.giftWrap ? ['Gift wrap'] : []), ...(item.hidePrices ? ['Price hidden on gift invoice'] : [])];
      row.append(textElement('p', 'bag-item-detail', details.join(' · ')));
      if (item.giftMessage) row.append(textElement('p', 'bag-item-message', `Gift note: ${item.giftMessage}`));
      const controls = textElement('div', 'bag-item-controls', '');
      const quantityLabel = textElement('label', 'bag-quantity', 'Qty');
      const quantity = document.createElement('select');
      quantity.setAttribute('aria-label', `Quantity for ${item.name}, size ${item.size}`);
      for (let n = 1; n <= 20; n++) {
        const option = new Option(String(n), String(n));
        option.selected = n === item.quantity;
        quantity.add(option);
      }
      quantity.addEventListener('change', () => {
        item.quantity = Number(quantity.value);
        row.querySelector('.bag-item-price').textContent = formatPrice(item.price * item.quantity);
        save(); updateTotals(); review.hidden = true;
      });
      quantityLabel.append(quantity);
      const remove = textElement('button', 'bag-remove', 'Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${item.name}, size ${item.size}`);
      remove.addEventListener('click', () => {
        items.splice(index, 1); save(); render();
        const target = list.querySelectorAll('.bag-remove')[Math.min(index, items.length - 1)] || dialog.querySelector('#bag-title');
        target.focus({ preventScroll: true });
      });
      controls.append(quantityLabel, remove, textElement('span', 'bag-item-price', formatPrice(item.price * item.quantity)));
      row.append(controls);
      list.append(row);
    });
    review.hidden = true;
    dialog.querySelector('.bag-empty').hidden = items.length > 0;
    dialog.querySelector('.bag-bottom').hidden = items.length === 0;
    updateTotals();
  }
  function updateTotals() {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-bag-count]').forEach(element => { element.textContent = count; });
    dialog.querySelector('.bag-total strong').textContent = formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }
  function open(trigger) {
    opener = trigger || document.activeElement;
    render();
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('bag-is-open');
    dialog.querySelector('#bag-title').focus({ preventScroll: true });
  }
  dialog.querySelectorAll('.bag-close, .bag-continue').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('bag-is-open');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.querySelector('.bag-review').addEventListener('click', () => {
    review.hidden = false;
    review.focus({ preventScroll: false });
  });
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-bag]');
    if (trigger) open(trigger);
  });
  window.PradhanBag = {
    formatPrice,
    open,
    add(value) {
      const item = normalise(value);
      if (!item) return false;
      const match = items.find(existing => ['id', 'size', 'giftWrap', 'hidePrices', 'giftMessage'].every(property => existing[property] === item[property]));
      if (match) match.quantity = Math.min(20, match.quantity + 1);
      else items.push(item);
      save(); render();
      return true;
    }
  };
  render();
})();
