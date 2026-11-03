(() => {
  'use strict';
  const products = {
    shirt: { id: 'shirt', name: 'Everyday shirt', price: 1490, description: 'A familiar short-sleeved silhouette for everyday wear. Shown in ivory.' },
    kurta: { id: 'kurta', name: 'Classic kurta', price: 2490, description: 'A simple kurta for family lunches, festivals and the days in between. Shown in natural.' },
    jacket: { id: 'jacket', name: 'Nehru jacket', price: 3990, description: 'A classic sleeveless layer to wear over your shirt or kurta. Shown in olive.' }
  };
  const categories = {
    all: { title: 'The Phulera wardrobe', label: 'Shop all', description: 'Shirts for the everyday. Kurtas for getting together. Familiar clothes, with a little of Phulera in them.', items: ['shirt', 'kurta', 'jacket'] },
    shirts: { title: 'Phulera days', label: 'Shirts', description: 'For the office, an afternoon out or a long conversation over chai. Start with an everyday shirt.', items: ['shirt'] },
    kurtas: { title: 'A reason to get together', label: 'Kurtas', description: 'A familiar silhouette for family occasions, festival mornings and everything in between.', items: ['kurta'] },
    jackets: { title: 'The Pradhan layer', label: 'Nehru jackets', description: 'A Nehru jacket brings the outfit together. Wear yours over a shirt or a kurta.', items: ['jacket'] },
    gathering: { title: 'The gathering edit', label: 'Kurtas & jackets', description: 'A kurta, a Nehru jacket, and a reason to gather your people. Inspired by the familiar world of Panchayat.', items: ['kurta', 'jacket'] },
    gifts: { title: 'For your own Panchayat', label: 'Gifts', description: 'Choose something for the person who feels like home. Add a personal note and gift wrap when you pick their size.', items: ['shirt', 'kurta', 'jacket'] }
  };
  const aliases = { everyday: 'shirts', gathering: 'gathering', heirloom: 'gifts', all: 'all' };
  const grid = document.querySelector('.product-grid');
  const cards = [...grid.querySelectorAll('[data-item]')];
  const sort = document.getElementById('product-sort');
  let activeCategory = 'all';
  function categoryFromUrl() {
    const parameters = new URLSearchParams(location.search);
    const requested = parameters.get('category');
    return Object.hasOwn(categories, requested) ? requested : aliases[parameters.get('collection')] || 'all';
  }
  function arrange() {
    const ordered = [...cards];
    if (sort.value === 'price-low') ordered.sort((a, b) => products[a.dataset.item].price - products[b.dataset.item].price);
    if (sort.value === 'price-high') ordered.sort((a, b) => products[b.dataset.item].price - products[a.dataset.item].price);
    ordered.forEach(card => grid.append(card));
  }
  function applyCategory(category) {
    activeCategory = Object.hasOwn(categories, category) ? category : 'all';
    const current = categories[activeCategory];
    document.title = `${current.label} — Pradhan by Panchayat`;
    document.getElementById('collection-title').textContent = current.title;
    document.getElementById('collection-description').textContent = current.description;
    document.getElementById('breadcrumb-title').textContent = current.label;
    document.getElementById('study-count').textContent = `${current.items.length} ${current.items.length === 1 ? 'style' : 'styles'}`;
    cards.forEach(card => { card.hidden = !current.items.includes(card.dataset.item); });
    document.querySelectorAll('[data-category]').forEach(link => {
      if (link.dataset.category === activeCategory) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('.header-nav a').forEach(link => {
      const url = new URL(link.href);
      const headerCategory = url.searchParams.get('category') || aliases[url.searchParams.get('collection')];
      if (headerCategory === activeCategory) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    arrange();
  }
  document.querySelectorAll('[data-category]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    history.pushState(null, '', link.href);
    applyCategory(link.dataset.category);
  }));
  window.addEventListener('popstate', () => applyCategory(categoryFromUrl()));
  sort.addEventListener('change', arrange);
  applyCategory(categoryFromUrl());
  const dialog = document.getElementById('product-dialog');
  const form = document.getElementById('sample-form');
  const title = document.getElementById('dialog-title');
  let selectedProduct = null;
  let opener = null;
  document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
    selectedProduct = products[button.dataset.product];
    if (!selectedProduct) return;
    opener = button;
    form.reset();
    form.elements.giftWrap.checked = activeCategory === 'gifts';
    form.elements.hidePrices.checked = activeCategory === 'gifts';
    title.textContent = selectedProduct.name;
    document.getElementById('dialog-description').textContent = selectedProduct.description;
    document.getElementById('dialog-price').textContent = window.PradhanBag.formatPrice(selectedProduct.price);
    dialog.showModal();
    document.documentElement.classList.add('product-is-open');
    dialog.scrollTop = 0;
    title.focus({ preventScroll: true });
  }));
  dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('product-is-open');
    if (!document.querySelector('.shop-bag[open]') && opener?.isConnected) opener.focus({ preventScroll: true });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity() || !selectedProduct) return;
    const values = new FormData(form);
    const added = window.PradhanBag.add({ ...selectedProduct, size: values.get('size'), giftWrap: values.has('giftWrap'), hidePrices: values.has('hidePrices'), giftMessage: values.get('giftMessage') });
    if (!added) return;
    dialog.close();
    window.PradhanBag.open(opener);
  });
})();
