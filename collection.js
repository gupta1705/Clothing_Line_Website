(() => {
  'use strict';
  const chapters = {
    everyday: { number: 'Chapter 01', title: 'Everyday rituals', description: 'For unhurried mornings, familiar roads, and all the ordinary moments worth keeping.' },
    gathering: { number: 'Chapter 02', title: 'Days of gathering', description: 'For conversations that carry on, shared tables, and the simple pleasure of being together.' },
    heirloom: { number: 'Chapter 03', title: 'Threads of memory', description: 'An exploration of memories, familiar gestures, and the things we choose to carry forward.' }
  };
  const requested = new URLSearchParams(window.location.search).get('collection');
  const key = Object.hasOwn(chapters, requested) ? requested : 'everyday';
  const chapter = chapters[key];
  document.getElementById('chapter-number').textContent = chapter.number;
  document.getElementById('collection-title').textContent = chapter.title;
  document.getElementById('collection-description').textContent = chapter.description;
  document.title = `${chapter.title.replace(/\.$/, '')} — Pradhan by Panchayat`;
  document.querySelectorAll('.chapter-nav a').forEach(link => {
    if (new URL(link.href).searchParams.get('collection') === key) link.setAttribute('aria-current', 'page');
  });

  const products = { shirt: 'Everyday shirt', kurta: 'Cotton kurta', jacket: 'Nehru jacket' };
  const dialog = document.getElementById('product-dialog');
  const selection = document.getElementById('selection-panel');
  const checkout = document.getElementById('checkout-panel');
  const form = document.getElementById('size-form');
  const title = document.getElementById('dialog-title');
  const step = document.getElementById('dialog-step');
  let selectedProduct = '';
  let opener = null;

  document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', () => {
      selectedProduct = products[button.dataset.product];
      if (!selectedProduct) return;
      opener = button;
      title.textContent = selectedProduct;
      step.textContent = 'The silhouette';
      selection.hidden = false;
      checkout.hidden = true;
      form.reset();
      dialog.setAttribute('aria-describedby', 'dialog-description');
      dialog.showModal();
    });
  });
  dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    document.getElementById('summary-product').textContent = selectedProduct;
    document.getElementById('summary-size').textContent = new FormData(form).get('size');
    title.textContent = 'A shorter way to checkout.';
    step.textContent = 'Checkout preview';
    selection.hidden = true;
    checkout.hidden = false;
    dialog.removeAttribute('aria-describedby');
    document.getElementById('edit-size').focus();
  });
  document.getElementById('edit-size').addEventListener('click', () => {
    selection.hidden = false;
    checkout.hidden = true;
    title.textContent = selectedProduct;
    step.textContent = 'The silhouette';
    dialog.setAttribute('aria-describedby', 'dialog-description');
    const checked = form.querySelector('input:checked');
    (checked || form.querySelector('input')).focus();
  });
})();
