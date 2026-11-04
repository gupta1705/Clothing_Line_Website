/* Page-specific behaviour: shop listing, product page, gift card */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const img = (name) => `assets/img/${name}.webp`;

  /* ---------- Shop ---------- */
  const grid = $('#shop-grid');
  if (grid) {
    const state = { cat: qs.get('c') || 'all', q: (qs.get('q') || '').toLowerCase(), max: 6000, size: '', sort: 'rec' };
    const cats = $('#cats');
    cats.innerHTML = [`<li><a href="shop.html" data-cat="all">All Products</a></li>`]
      .concat(PBP.categories.map((c) => `<li><a href="shop.html?c=${c.id}" data-cat="${c.id}">${c.name}</a></li>`)).join('');
    const order = ['S', 'M', 'L', 'XL', 'XXL', 'Free'];
    const sizes = [...new Set(PBP.products.flatMap((p) => p.sizes))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    $('#size-chips').innerHTML = sizes.map((s) => `<button class="chip" data-size="${s}" aria-pressed="false">${s}</button>`).join('');

    cats.addEventListener('click', (e) => {
      const a = e.target.closest('[data-cat]'); if (!a) return;
      e.preventDefault(); state.cat = a.dataset.cat;
      history.replaceState(null, '', state.cat === 'all' ? 'shop.html' : 'shop.html?c=' + state.cat);
      $('.side')?.classList.remove('open'); render();
    });
    $('#price').addEventListener('input', (e) => { state.max = +e.target.value; $('#price-max').textContent = PBP.inr(state.max); render(); });
    $('#size-chips').addEventListener('click', (e) => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      state.size = state.size === b.dataset.size ? '' : b.dataset.size;
      $$('[data-size]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.size === state.size));
      render();
    });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    $('#mfilter')?.addEventListener('click', () => $('.side').classList.add('open'));

    function render() {
      let list = PBP.products.filter((p) => (state.cat === 'all' || p.cat === state.cat) && p.price <= state.max && (!state.size || p.sizes.includes(state.size)) &&
        (!state.q || (p.name + ' ' + p.by + ' ' + p.cat).toLowerCase().includes(state.q)));
      if (state.sort === 'lo') list.sort((a, b) => a.price - b.price);
      if (state.sort === 'hi') list.sort((a, b) => b.price - a.price);
      if (state.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
      const cat = PBP.categories.find((c) => c.id === state.cat);
      $('#crumb-cur').textContent = state.q ? `Search: “${state.q}”` : cat ? cat.name : 'All Products';
      $$('[data-cat]').forEach((a) => a.classList.toggle('on', a.dataset.cat === state.cat));
      $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
      grid.innerHTML = list.length ? list.map((p) => PBP.card(p, true)).join('') : '<p class="no-res">Nothing here yet. Try another filter.</p>';
    }
    render();
  }

  /* ---------- Product page ---------- */
  const pdp = $('#pdp');
  if (pdp) {
    const p = PBP.byId(qs.get('id')) || PBP.products[0];
    const cat = PBP.categories.find((c) => c.id === p.cat);
    document.title = `${p.name} | Pradhan by Panchayat`;
    $('#crumb-cat').textContent = cat.name; $('#crumb-cat').href = 'shop.html?c=' + cat.id;
    $('#crumb-cur').textContent = p.name;
    let size = p.sizes.length === 1 ? p.sizes[0] : '';
    pdp.innerHTML = `
      <div class="media"><div class="ph"><img src="${img(p.img)}" alt="${p.name}" width="400" height="400"></div></div>
      <div>
        <h1>${p.name}</h1>
        <div class="price">${PBP.inr(p.price)}</div>
        <div class="by">${p.by}</div>
        <span class="lbl">Size</span>
        <div class="sizes">${p.sizes.map((s) => `<button aria-pressed="${s === size}" data-s="${s}">${s}</button>`).join('')}</div>
        <span class="lbl">Quantity</span>
        <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><input id="pq" value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="Increase">+</button></div>
        <div class="acts">
          <button class="btn rose" id="padd">Add to Cart</button>
          <button class="btn" id="pbuy">Buy Now</button>
        </div>
        <details open><summary>The craft</summary><p>${p.craft} Every Pradhan piece is made in small batches by artisan families, paid fairly and on time.</p></details>
        <details><summary>Size guide</summary>
          <p>Buying for Papa? Measure a shirt or kurta he already loves, flat across the chest, and double it.</p>
          <table class="size-table"><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr>
          <tr><td>S</td><td>38</td><td>28</td></tr><tr><td>M</td><td>40</td><td>29</td></tr><tr><td>L</td><td>42</td><td>30</td></tr><tr><td>XL</td><td>44</td><td>31</td></tr><tr><td>XXL</td><td>46</td><td>32</td></tr></table>
        </details>
        <details><summary>Gifting</summary><p>Add free gift wrap, a handwritten note and a price-free invoice from your bag.</p></details>
        <details><summary>Delivery &amp; returns</summary><p>Free delivery across India. Easy size exchange within 15 days.</p></details>
      </div>`;
    pdp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-s]');
      if (b) { size = b.dataset.s; $$('[data-s]', pdp).forEach((x) => x.setAttribute('aria-pressed', x === b)); }
      const go = e.target.closest('#padd,#pbuy');
      if (go) {
        if (!size) return PBP.toast('Please choose a size');
        PBP.add({ id: p.id, name: p.name, price: p.price, img: p.img, size, qty: +$('#pq').value || 1 });
        if (go.id === 'pbuy') document.querySelector('[data-open-cart]').click();
      }
    });
    const more = $('#more');
    if (more) more.innerHTML = PBP.products.filter((x) => x.id !== p.id && x.cat === p.cat).concat(PBP.products.filter((x) => x.cat !== p.cat)).slice(0, 4).map((x) => PBP.card(x)).join('');
    PBP.reveal($$('.card', more));
  }

  /* ---------- Gift card ---------- */
  const gc = $('#gc-form');
  if (gc) {
    let amount = 2000, forWho = 'else';
    const setAmt = (v) => { amount = v; $('#gc-amt').textContent = PBP.inr(v); $$('[data-amt]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.amt === v)); };
    gc.addEventListener('click', (e) => {
      const a = e.target.closest('[data-amt]'); if (a) { e.preventDefault(); setAmt(+a.dataset.amt); }
      const w = e.target.closest('[data-who]');
      if (w) { e.preventDefault(); forWho = w.dataset.who; $$('[data-who]').forEach((b) => b.setAttribute('aria-pressed', b === w)); $('#gc-recipient').hidden = forWho === 'me'; }
      const go = e.target.closest('[data-gc]');
      if (go) {
        e.preventDefault();
        if (forWho === 'else' && !$('#gc-email').value.includes('@')) { $('#gc-email').focus(); return PBP.toast('Add the recipient’s email'); }
        PBP.add({ id: 'gift-card', name: 'Pradhan eGift Card', price: amount, amount, img: 'p-gift-box', qty: +$('#gc-q').value || 1 });
        if (go.dataset.gc === 'buy') document.querySelector('[data-open-cart]').click();
      }
    });
    setAmt(amount);
  }
})();
