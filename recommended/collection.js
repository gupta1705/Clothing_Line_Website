(() => {
  'use strict';
  const collections = {
    everyday: {
      number: 'Collection 01',
      title: 'Phulera days',
      description: 'Easy shirts and everyday layers, inspired by the unhurried mornings and familiar corners of Phulera.',
      products: ['shirt']
    },
    gathering: {
      number: 'Collection 02',
      title: 'The gathering edit',
      description: 'Kurtas and Nehru jackets for the occasions that bring everyone together. A little of Panchayat’s warmth, carried into your own celebrations.',
      products: ['kurta', 'jacket']
    },
    heirloom: {
      number: 'Collection 03',
      title: 'For our own',
      description: 'For the people who make a place feel like home. Familiar silhouettes, with a personal note and a little extra thought.',
      products: ['shirt', 'kurta', 'jacket']
    }
  };
  const requested = new URLSearchParams(window.location.search).get('collection');
  const key = Object.prototype.hasOwnProperty.call(collections, requested) ? requested : 'everyday';
  const collection = collections[key];
  document.getElementById('chapter-number').textContent = collection.number;
  document.getElementById('collection-title').textContent = collection.title;
  document.getElementById('collection-description').textContent = collection.description;
  document.getElementById('study-count').textContent = collection.products.length + (collection.products.length === 1 ? ' sample' : ' samples');
  document.title = collection.title + ' — Pradhan by Panchayat';
  document.querySelectorAll('[data-item]').forEach(item => {
    item.hidden = !collection.products.includes(item.dataset.item);
  });
  document.querySelectorAll('[data-collection]').forEach(link => {
    if (link.dataset.collection === key) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const products = {shirt: 'Everyday shirt', kurta: 'Classic kurta', jacket: 'Nehru jacket'};
  const dialog = document.getElementById('product-dialog');
  const form = document.getElementById('sample-form');
  const summary = document.getElementById('summary-panel');
  const title = document.getElementById('dialog-title');
  const description = document.getElementById('dialog-description');
  const editButton = document.getElementById('edit-options');
  let selectedProduct = '';
  let opener = null;

  function showOptions() {
    title.textContent = selectedProduct;
    description.textContent = 'An illustrative silhouette. Try the sample options below; nothing is sent or saved, and ordering is not available.';
    form.hidden = false;
    summary.hidden = true;
  }

  document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', () => {
      selectedProduct = products[button.dataset.product];
      if (!selectedProduct) return;
      opener = button;
      form.reset();
      showOptions();
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.scrollTop = 0;
      title.focus({preventScroll: true});
    });
  });

  dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    form.reset();
    if (opener && opener.isConnected) opener.focus({preventScroll: true});
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    document.getElementById('summary-product').textContent = selectedProduct;
    document.getElementById('summary-size').textContent = values.get('size');
    document.getElementById('summary-wrap').textContent = values.has('giftWrap') ? 'Included in preview' : 'Not selected';
    document.getElementById('summary-invoice').textContent = values.has('hidePrices') ? 'Prices hidden' : 'Standard invoice';
    document.getElementById('summary-message').textContent = String(values.get('giftMessage') || '').trim() || 'No message added.';
    title.textContent = 'Sample order details';
    description.textContent = 'A preview of your choices. No order has been placed, and nothing has been sent or saved.';
    form.hidden = true;
    summary.hidden = false;
    dialog.scrollTop = 0;
    title.focus({preventScroll: true});
  });

  editButton.addEventListener('click', () => {
    showOptions();
    dialog.scrollTop = 0;
    const selected = form.querySelector('input[name="size"]:checked');
    (selected || form.querySelector('input[name="size"]')).focus();
  });
})();
