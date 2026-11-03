(() => {
  'use strict';
  const products = window.PradhanCatalogue || [];
  const byId = new Map(products.map(product => [product.id, product]));
  const categories = {
    all: { title: 'The Phulera wardrobe', label: 'Shop', description: 'Familiar shirts, easy kurtas and a layer for the occasion.' },
    shirts: { title: 'Everyday shirts', label: 'Shirts', description: 'Easy shapes and familiar colours for the working week and the weekend.' },
    kurtas: { title: 'Kurtas', label: 'Kurtas', description: 'For a family lunch, a festival morning, or just because.' },
    jackets: { title: 'Nehru jackets', label: 'Nehru jackets', description: 'An extra layer that brings the whole outfit together.' },
    gathering: { title: 'The gathering edit', label: 'The gathering edit', description: 'Kurtas and Nehru jackets for the days that bring everyone together.' },
    gifts: { title: 'For your own Panchayat', label: 'Gifting', description: 'Choose their next favourite piece. Add a personal note and make it theirs.' }
  };
  const aliases = { all: 'all', everyday: 'shirts', gathering: 'gathering', heirloom: 'gifts' };
  const grid = document.querySelector('.product-grid');
  const search = document.getElementById('product-search');
  const sort = document.getElementById('product-sort');
  const priceInputs = Array.from(document.querySelectorAll('[name="price-filter"]'));
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.6 5.6 0 0 0-8 .1L12 5.6l-.8-.8a5.6 5.6 0 0 0-8 7.9L12 22l8.8-9.3a5.6 5.6 0 0 0 0-8Z"/></svg>';
  let activeCategory = 'all';
  const cards = new Map();
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function productButton(product, className, label) {
    const button = element('button', className, label);
    button.type = 'button';
    button.dataset.product = product.id;
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'product-dialog');
    button.addEventListener('click', () => openProduct(product.id, button));
    return button;
  }
  products.forEach((product, index) => {
    const card = element('article', 'product-card');
    card.dataset.item = product.id;
    const visual = element('div', 'product-visual');
    const photoButton = productButton(product, 'product-image-button');
    photoButton.setAttribute('aria-label', 'View ' + product.name);
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.imageAlt;
    image.width = 600; image.height = 800;
    image.loading = index < 3 ? 'eager' : 'lazy';
    if (index === 0) image.fetchPriority = 'high';
    photoButton.append(image);
    const save = element('button', 'wishlist-heart');
    save.type = 'button'; save.dataset.wishlistToggle = product.id;
    save.setAttribute('aria-pressed', 'false');
    save.setAttribute('aria-label', 'Save ' + product.name + ' to wishlist');
    save.innerHTML = heart;
    visual.append(photoButton, save);
    const info = element('div', 'product-info');
    const color = element('p', 'product-color');
    const dot = element('span', 'color-dot');
    dot.style.backgroundColor = product.swatch;
    dot.setAttribute('aria-hidden', 'true');
    color.append(dot, document.createTextNode(product.color));
    const name = element('h2', 'product-name');
    name.append(productButton(product, '', product.name));
    const price = element('p', 'product-price', window.PradhanBag.formatPrice(product.price));
    const add = productButton(product, 'quick-add', 'Choose size');
    add.setAttribute('aria-label', 'Choose size for ' + product.name);
    const plus = element('span', '', '+'); plus.setAttribute('aria-hidden', 'true'); add.append(plus);
    info.append(color, name, price, add);
    card.append(visual, info); grid.append(card); cards.set(product.id, card);
  });
  window.PradhanWishlist.syncButtons();

  function inCategory(product, category) {
    return category === 'all' || category === 'gifts' || (category === 'gathering' ? ['kurtas', 'jackets'].includes(product.category) : product.category === category);
  }
  function categoryFromUrl() {
    const parameters = new URLSearchParams(location.search);
    const direct = parameters.get('category');
    return Object.hasOwn(categories, direct) ? direct : aliases[parameters.get('collection')] || 'all';
  }
  function applyFilters() {
    const price = priceInputs.find(input => input.checked).value;
    const query = search.value.trim().toLowerCase();
    const ordered = products.slice();
    if (sort.value === 'price-low') ordered.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-high') ordered.sort((a, b) => b.price - a.price);
    let count = 0;
    ordered.forEach(product => {
      const matchesPrice = price === 'all' || (price === 'under-2000' && product.price < 2000) || (price === '2000-4000' && product.price >= 2000 && product.price <= 4000) || (price === 'over-4000' && product.price > 4000);
      const matchesSearch = !query || (product.name + ' ' + product.color + ' ' + product.category).toLowerCase().includes(query);
      const visible = inCategory(product, activeCategory) && matchesPrice && matchesSearch;
      const card = cards.get(product.id); card.hidden = !visible; grid.append(card);
      if (visible) count++;
    });
    document.getElementById('product-count').textContent = count + (count === 1 ? ' piece' : ' pieces');
    document.getElementById('no-results').hidden = count > 0;
    const filters = document.querySelector('.active-filters');
    filters.hidden = !query && price === 'all';
    const labels = [];
    if (query) labels.push('Search: ' + search.value.trim());
    if (price !== 'all') labels.push(priceInputs.find(input => input.checked).parentElement.textContent.trim());
    document.getElementById('active-filter-description').textContent = labels.join(' · ');
  }
  function applyCategory(category) {
    activeCategory = Object.hasOwn(categories, category) ? category : 'all';
    const current = categories[activeCategory];
    document.title = current.label + ' — Pradhan by Panchayat';
    document.getElementById('collection-title').textContent = current.title;
    document.getElementById('collection-description').textContent = current.description;
    document.getElementById('breadcrumb-title').textContent = current.label;
    document.querySelectorAll('[data-category]').forEach(link => {
      if (link.dataset.category === activeCategory) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('[data-shop-nav]').setAttribute('aria-current', 'page');
    applyFilters();
  }
  document.querySelectorAll('[data-category-count]').forEach(node => {
    node.textContent = products.filter(product => inCategory(product, node.dataset.categoryCount)).length;
  });
  document.querySelectorAll('[data-category]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    history.pushState(null, '', link.href);
    applyCategory(link.dataset.category);
  }));
  search.addEventListener('input', applyFilters);
  sort.addEventListener('change', applyFilters);
  priceInputs.forEach(input => input.addEventListener('change', applyFilters));
  function clearFilters() { search.value = ''; priceInputs[0].checked = true; applyFilters(); }
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
  document.getElementById('reset-search').addEventListener('click', () => {
    clearFilters();
    history.pushState(null, '', 'collection.html?collection=all');
    applyCategory('all');
  });
  const filterToggle = document.querySelector('.filter-toggle');
  const filterPanel = document.getElementById('filter-panel');
  filterToggle.addEventListener('click', () => {
    const open = filterToggle.getAttribute('aria-expanded') !== 'true';
    filterToggle.setAttribute('aria-expanded', String(open));
    filterPanel.classList.toggle('is-open', open);
  });

  const dialog = document.getElementById('product-dialog');
  const form = document.getElementById('product-form');
  const title = document.getElementById('dialog-title');
  const detailHeart = document.querySelector('.detail-wishlist');
  const gallery = document.getElementById('gallery-thumbnails');
  const detailImage = document.getElementById('dialog-image');
  let selectedProduct = null;
  let opener = null;
  function openProduct(id, trigger) {
    const product = byId.get(id);
    if (!product) return;
    selectedProduct = product;
    opener = trigger || cards.get(id).querySelector('[data-product]');
    form.reset();
    const gifting = activeCategory === 'gifts';
    form.elements.giftWrap.checked = gifting;
    form.elements.hidePrices.checked = gifting;
    document.querySelector('.gift-details').open = gifting;
    document.querySelector('.size-guide').open = false;
    title.textContent = product.name;
    document.getElementById('dialog-price').textContent = window.PradhanBag.formatPrice(product.price);
    document.getElementById('dialog-color').textContent = 'Colour: ' + product.color;
    document.getElementById('dialog-description').textContent = product.description;
    detailHeart.dataset.wishlistToggle = product.id;
    window.PradhanWishlist.syncButtons();
    const images = product.images || [product.image];
    detailImage.src = images[0]; detailImage.alt = product.imageAlt;
    gallery.replaceChildren();
    images.forEach((source, index) => {
      const button = element('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'View ' + (index + 1) + ' of ' + product.name);
      button.setAttribute('aria-pressed', String(index === 0));
      const thumb = document.createElement('img');
      thumb.src = source; thumb.alt = ''; thumb.width = 60; thumb.height = 80;
      button.append(thumb);
      button.addEventListener('click', () => {
        detailImage.src = source;
        detailImage.alt = product.imageAlt + (index ? ', alternate view' : '');
        gallery.querySelectorAll('button').forEach((node, n) => node.setAttribute('aria-pressed', String(index === n)));
      });
      gallery.append(button);
    });
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('product-is-open');
    dialog.scrollTop = 0;
    title.focus({ preventScroll: true });
  }
  dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('product-is-open');
    const url = new URL(location.href);
    if (url.searchParams.has('product')) {
      url.searchParams.delete('product');
      history.replaceState(null, '', url.href);
    }
    if (!document.querySelector('.shop-bag[open],.shop-wishlist[open]') && opener && opener.isConnected) opener.focus({ preventScroll: true });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity() || !selectedProduct) return;
    const data = new FormData(form);
    const added = window.PradhanBag.add({ id: selectedProduct.id, size: data.get('size'), giftWrap: data.has('giftWrap'), hidePrices: data.has('hidePrices'), giftMessage: data.get('giftMessage') });
    if (!added) return;
    dialog.close();
    window.PradhanBag.open(opener);
  });
  function readLocation() {
    applyCategory(categoryFromUrl());
    const id = new URLSearchParams(location.search).get('product');
    if (byId.has(id)) openProduct(id);
    else if (dialog.open) dialog.close();
  }
  window.addEventListener('popstate', readLocation);
  readLocation();
})();
