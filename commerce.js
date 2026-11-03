(() => {
  'use strict';
  const bagKey = 'pradhan-preview-bag-v1';
  const wishlistKey = 'pradhan-wishlist-v1';
  const fallbackCatalogue = [
    { id: 'shirt', name: 'Everyday shirt', price: 1490 },
    { id: 'kurta', name: 'Classic kurta', price: 2490 },
    { id: 'jacket', name: 'Nehru jacket', price: 3990 }
  ];
  const catalogue = new Map((Array.isArray(window.PradhanCatalogue) ? window.PradhanCatalogue : fallbackCatalogue).map(product => [product.id, product]));
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const formatPrice = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const normalise = value => {
    if (!value || !catalogue.has(value.id) || !sizes.includes(value.size)) return null;
    return { id: value.id, size: value.size, quantity: Math.min(20, Math.max(1, Math.floor(Number(value.quantity) || 1))), giftWrap: Boolean(value.giftWrap), hidePrices: Boolean(value.hidePrices), giftMessage: String(value.giftMessage || '').trim().slice(0, 240) };
  };
  const readArray = (key, supplied) => {
    try {
      const saved = JSON.parse(supplied === undefined ? localStorage.getItem(key) || '[]' : supplied || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) { return []; }
  };
  const cleanWishlist = values => [...new Set(values.filter(id => typeof id === 'string' && catalogue.has(id)))];
  let items = readArray(bagKey).slice(0, 50).map(normalise).filter(Boolean);
  let wishlist = cleanWishlist(readArray(wishlistKey));
  const textElement = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  };
  function productImage(product, className) {
    if (!product.image) return null;
    const img = document.createElement('img');
    img.className = className;
    img.src = product.image;
    img.alt = product.imageAlt || product.name;
    img.width = 120;
    img.height = 150;
    img.loading = 'lazy';
    return img;
  }
  const productLink = id => `collection.html?product=${encodeURIComponent(id)}`;
  const dialog = document.createElement('dialog');
  dialog.className = 'shop-bag';
  dialog.setAttribute('aria-labelledby', 'bag-title');
  dialog.innerHTML = `<div class="bag-shell"><div class="bag-heading"><h2 id="bag-title" tabindex="-1">Your bag</h2><button class="bag-close" type="button" aria-label="Close bag">Close <span aria-hidden="true">×</span></button></div><p class="bag-caption">Your Pradhan selection</p><div class="bag-items"></div><div class="bag-empty"><p>A little room for something from Phulera.</p><a href="collection.html?collection=all" class="bag-primary">Browse the collection</a></div><div class="bag-bottom"><div class="bag-total" aria-live="polite" aria-atomic="true"><span>Subtotal</span><strong></strong></div><p class="bag-small">Store opening soon. Checkout is not available yet.</p><button type="button" class="bag-primary bag-review">Review bag <span aria-hidden="true">→</span></button><div class="bag-review-note" hidden tabindex="-1"><h3>Your selection, saved.</h3><p>Your sizes and gift choices are saved in this browser. You can change quantities or remove items above. No order has been placed.</p></div></div><button class="bag-continue" type="button">Continue browsing</button><p class="bag-storage" hidden>Browser storage is unavailable. Your bag will last until you leave this page.</p></div>`;
  document.body.append(dialog);
  const list = dialog.querySelector('.bag-items');
  const review = dialog.querySelector('.bag-review-note');
  let opener = null;
  function saveBag() {
    try { localStorage.setItem(bagKey, JSON.stringify(items)); }
    catch (_) { dialog.querySelector('.bag-storage').hidden = false; }
  }
  function renderBag() {
    list.replaceChildren();
    items.forEach((item, index) => {
      const product = catalogue.get(item.id);
      const row = textElement('article', 'bag-item', '');
      const photo = productImage(product, 'bag-item-image');
      if (photo) {
        const imageLink = document.createElement('a');
        imageLink.className = 'bag-image-link';
        imageLink.href = productLink(item.id);
        imageLink.append(photo);
        row.append(imageLink);
      }
      const content = textElement('div', 'bag-item-content', '');
      content.append(textElement('h3', '', product.name));
      const details = [...(product.color ? [product.color] : []), `Size ${item.size}`, ...(item.giftWrap ? ['Gift wrap'] : []), ...(item.hidePrices ? ['Price hidden on gift invoice'] : [])];
      content.append(textElement('p', 'bag-item-detail', details.join(' · ')));
      if (item.giftMessage) content.append(textElement('p', 'bag-item-message', `Gift note: ${item.giftMessage}`));
      const controls = textElement('div', 'bag-item-controls', '');
      const quantityLabel = textElement('label', 'bag-quantity', 'Qty');
      const quantity = document.createElement('select');
      quantity.setAttribute('aria-label', `Quantity for ${product.name}, size ${item.size}`);
      for (let n = 1; n <= 20; n++) {
        const option = new Option(String(n), String(n));
        option.selected = n === item.quantity;
        quantity.add(option);
      }
      quantity.addEventListener('change', () => {
        item.quantity = Number(quantity.value);
        row.querySelector('.bag-item-price').textContent = formatPrice(product.price * item.quantity);
        saveBag(); updateTotals(); review.hidden = true;
      });
      quantityLabel.append(quantity);
      const remove = textElement('button', 'bag-remove', 'Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${product.name}, size ${item.size}`);
      remove.addEventListener('click', () => {
        items.splice(index, 1); saveBag(); renderBag();
        const target = list.querySelectorAll('.bag-remove')[Math.min(index, items.length - 1)] || dialog.querySelector('#bag-title');
        target.focus({ preventScroll: true });
      });
      controls.append(quantityLabel, remove, textElement('span', 'bag-item-price', formatPrice(product.price * item.quantity)));
      if (!photo) row.classList.add('bag-no-image');
      row.append(content, controls);
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
    dialog.querySelector('.bag-total strong').textContent = formatPrice(items.reduce((sum, item) => sum + catalogue.get(item.id).price * item.quantity, 0));
  }
  function openBag(trigger) {
    opener = trigger || document.activeElement;
    renderBag();
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('bag-is-open');
    dialog.querySelector('#bag-title').focus({ preventScroll: true });
  }
  dialog.querySelectorAll('.bag-close, .bag-continue').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('bag-is-open');
    if (!document.querySelector('dialog[open]') && opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.querySelector('.bag-review').addEventListener('click', () => {
    review.hidden = false;
    review.focus({ preventScroll: false });
  });

  const wishlistDialog = document.createElement('dialog');
  wishlistDialog.className = 'shop-bag shop-wishlist';
  wishlistDialog.setAttribute('aria-labelledby', 'wishlist-title');
  wishlistDialog.innerHTML = `<div class="bag-shell"><div class="bag-heading"><h2 id="wishlist-title" tabindex="-1">Your wishlist</h2><button class="bag-close" type="button" aria-label="Close wishlist">Close <span aria-hidden="true">×</span></button></div><p class="bag-caption">A few things to come back to.</p><div class="wishlist-items"></div><div class="bag-empty wishlist-empty"><p>Found something you like?</p><p class="wishlist-empty-help">Tap the heart on a piece to keep it here.</p><a href="collection.html?collection=all" class="bag-primary">Browse the collection</a></div><button class="bag-continue" type="button">Continue browsing</button><p class="bag-storage wishlist-storage" hidden>Browser storage is unavailable. Your wishlist will last until you leave this page.</p></div>`;
  document.body.append(wishlistDialog);
  const wishlistList = wishlistDialog.querySelector('.wishlist-items');
  let wishlistOpener = null;
  function syncWishlistButtons() {
    document.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
      const id = button.dataset.wishlistToggle;
      const product = catalogue.get(id);
      const saved = wishlist.includes(id);
      button.setAttribute('aria-pressed', String(saved));
      if (product) button.setAttribute('aria-label', saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`);
    });
    document.querySelectorAll('[data-wishlist-count]').forEach(element => { element.textContent = wishlist.length; });
  }
  function saveWishlist() {
    try { localStorage.setItem(wishlistKey, JSON.stringify(wishlist)); }
    catch (_) { wishlistDialog.querySelector('.wishlist-storage').hidden = false; }
  }
  function renderWishlist() {
    wishlistList.replaceChildren();
    wishlist.forEach((id, index) => {
      const product = catalogue.get(id);
      const row = textElement('article', 'wishlist-item', '');
      const photo = productImage(product, 'wishlist-item-image');
      if (photo) {
        const imageLink = document.createElement('a');
        imageLink.className = 'wishlist-image-link';
        imageLink.href = productLink(id);
        imageLink.append(photo);
        row.append(imageLink);
      }
      const content = textElement('div', 'wishlist-item-content', '');
      const title = textElement('h3', '', product.name);
      content.append(title);
      if (product.color) content.append(textElement('p', 'bag-item-detail', product.color));
      content.append(textElement('p', 'wishlist-price', formatPrice(product.price)));
      const actions = textElement('div', 'wishlist-actions', '');
      const link = textElement('a', 'wishlist-view', 'View item');
      link.href = productLink(id);
      const remove = textElement('button', 'bag-remove', 'Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${product.name} from wishlist`);
      remove.addEventListener('click', () => {
        toggleWishlist(id);
        const target = wishlistList.querySelectorAll('.bag-remove')[Math.min(index, wishlist.length - 1)] || wishlistDialog.querySelector('#wishlist-title');
        target.focus({ preventScroll: true });
      });
      actions.append(link, remove);
      content.append(actions);
      row.append(content);
      wishlistList.append(row);
    });
    wishlistDialog.querySelector('.wishlist-empty').hidden = wishlist.length > 0;
    syncWishlistButtons();
  }
  function notifyWishlist() {
    document.dispatchEvent(new CustomEvent('pradhan:wishlist-changed', { bubbles: true, detail: { ids: [...wishlist], count: wishlist.length } }));
  }
  function toggleWishlist(id) {
    if (!catalogue.has(id)) return false;
    wishlist = wishlist.includes(id) ? wishlist.filter(value => value !== id) : [...wishlist, id];
    saveWishlist();
    renderWishlist();
    notifyWishlist();
    return wishlist.includes(id);
  }
  function openWishlist(trigger) {
    wishlistOpener = trigger || document.activeElement;
    renderWishlist();
    if (!wishlistDialog.open) wishlistDialog.showModal();
    document.documentElement.classList.add('wishlist-is-open');
    wishlistDialog.querySelector('#wishlist-title').focus({ preventScroll: true });
  }
  wishlistDialog.querySelectorAll('.bag-close, .bag-continue').forEach(button => button.addEventListener('click', () => wishlistDialog.close()));
  wishlistDialog.addEventListener('close', () => {
    document.documentElement.classList.remove('wishlist-is-open');
    if (!document.querySelector('dialog[open]') && wishlistOpener?.isConnected) wishlistOpener.focus({ preventScroll: true });
  });
  document.addEventListener('click', event => {
    const heart = event.target.closest('[data-wishlist-toggle]');
    if (heart) {
      event.preventDefault();
      toggleWishlist(heart.dataset.wishlistToggle);
      return;
    }
    const wishlistTrigger = event.target.closest('[data-open-wishlist]');
    if (wishlistTrigger) { openWishlist(wishlistTrigger); return; }
    const bagTrigger = event.target.closest('[data-open-bag]');
    if (bagTrigger) openBag(bagTrigger);
  });
  window.addEventListener('storage', event => {
    if (event.key === bagKey || event.key === null) {
      const hadFocus = dialog.open && dialog.contains(document.activeElement);
      items = readArray(bagKey, event.key === null ? null : event.newValue).slice(0, 50).map(normalise).filter(Boolean);
      renderBag();
      if (hadFocus) dialog.querySelector('#bag-title').focus({ preventScroll: true });
    }
    if (event.key === wishlistKey || event.key === null) {
      const hadFocus = wishlistDialog.open && wishlistDialog.contains(document.activeElement);
      wishlist = cleanWishlist(readArray(wishlistKey, event.key === null ? null : event.newValue));
      renderWishlist(); notifyWishlist();
      if (hadFocus) wishlistDialog.querySelector('#wishlist-title').focus({ preventScroll: true });
    }
  });
  window.PradhanBag = {
    formatPrice,
    open: openBag,
    add(value) {
      const item = normalise(value);
      if (!item) return false;
      const match = items.find(existing => ['id', 'size', 'giftWrap', 'hidePrices', 'giftMessage'].every(property => existing[property] === item[property]));
      if (match) match.quantity = Math.min(20, match.quantity + 1);
      else items.push(item);
      saveBag(); renderBag();
      return true;
    }
  };
  window.PradhanWishlist = { toggle: toggleWishlist, has: id => wishlist.includes(id), open: openWishlist, syncButtons: syncWishlistButtons };
  renderBag();
  renderWishlist();
})();
