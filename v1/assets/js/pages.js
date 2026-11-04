/* Page-specific behaviour: collection listing and product page */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const img = (n) => `assets/img/${n}.webp`;

  /* ---------- Collection ---------- */
  const grid = $('#cgrid');
  if (grid) {
    const st = { cat: qs.get('c') || '', colour: qs.get('colour') || '', size: '', q: (qs.get('q') || '').toLowerCase(), wish: qs.has('wish'), sort: 'new', edit: qs.get('edit') || '' };
    const tiles = $('#ctiles');
    tiles.innerHTML = PBP.categories.map((c) => `<button class="ctile" data-cat="${c.id}" aria-pressed="${c.id === st.cat}"><span class="im"><img src="${img(c.img)}" alt="" width="480" height="640" loading="lazy"></span>${c.name}</button>`).join('');
    const order = ['S', 'M', 'L', 'XL', 'XXL', 'Free'];
    const sizes = [...new Set(PBP.products.flatMap((p) => p.sizes))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    $('#f-size').innerHTML = '<span>Size</span>' + sizes.map((s) => `<button class="fchip" data-size="${s}" aria-pressed="false">${s}</button>`).join('');
    $('#f-colour').innerHTML = '<span>Colour</span>' + PBP.colours.map((c) => `<button class="fchip" data-colour="${c.id}" aria-pressed="${c.id === st.colour}"><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${c.hex};margin-right:6px;border:1px solid rgba(0,0,0,.15)"></span>${c.name}</button>`).join('');
    if (st.colour || st.q || st.wish) $('#fpanel').classList.add('open');

    tiles.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; st.cat = st.cat === b.dataset.cat ? '' : b.dataset.cat; $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.cat === st.cat)); render(); });
    $('#fpanel').addEventListener('click', (e) => {
      const s = e.target.closest('[data-size]'), c = e.target.closest('[data-colour]');
      if (s) { st.size = st.size === s.dataset.size ? '' : s.dataset.size; $$('[data-size]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.size === st.size)); }
      if (c) { st.colour = st.colour === c.dataset.colour ? '' : c.dataset.colour; $$('[data-colour]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.colour === st.colour)); }
      if (e.target.closest('#f-clear')) { Object.assign(st, { cat: '', colour: '', size: '', q: '', wish: false, edit: '' }); $$('[aria-pressed]', document.querySelector('main')).forEach((x) => x.setAttribute('aria-pressed', 'false')); history.replaceState(null, '', 'collection.html'); }
      render();
    });
    $('#fbtn').addEventListener('click', () => $('#fpanel').classList.toggle('open'));
    $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; render(); });

    const promoA = `<a class="promo" href="collection.html?c=nehru-jackets"><img src="${img('l-festive')}" alt="" loading="lazy" width="440" height="675"><span class="t">The Festive<br>Edit</span><span class="pill light">Shop Now</span></a>`;
    const promoB = `<a class="promo rust" href="index.html#gifting"><small>Diwali gifting</small><span class="t">Free</span><span style="font-size:22px;margin:4px 0 14px">gift wrap</span><span class="pill light">On every order</span></a>`;

    function render() {
      const wish = (() => { try { return JSON.parse(localStorage.getItem('pbp-wish')) || []; } catch { return []; } })();
      let list = PBP.products.filter((p) => (!st.cat || p.cat === st.cat) && (!st.colour || p.colour === st.colour) && (!st.size || p.sizes.includes(st.size)) &&
        (!st.wish || wish.includes(p.id)) && (!st.edit || p.line === st.edit) && (!st.q || (p.name + ' ' + p.line + ' ' + p.cat + ' ' + p.colour).toLowerCase().includes(st.q)));
      if (st.sort === 'lo') list.sort((a, b) => a.price - b.price);
      if (st.sort === 'hi') list.sort((a, b) => b.price - a.price);
      const cat = PBP.categories.find((c) => c.id === st.cat);
      $('#crumb').textContent = st.wish ? 'Your Wishlist' : st.q ? `Search: “${st.q}”` : st.edit ? st.edit : cat ? cat.name : 'Shop All';
      $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
      let html = list.map(PBP.card);
      const plain = !st.cat && !st.colour && !st.size && !st.q && !st.wish && !st.edit;
      if (plain && html.length > 3) { html.splice(3, 0, promoA); if (html.length > 9) html.splice(9, 0, promoB); }
      grid.innerHTML = html.length ? html.join('') : `<p class="none">${st.wish ? 'Nothing saved yet. Tap the heart on anything you like.' : 'Nothing here yet. Try another filter.'}</p>`;
      PBP.syncWish();
    }
    render();
    addEventListener('storage', (e) => { if (e.key === 'pbp-wish' && st.wish) render(); });
  }

  /* ---------- Product page ---------- */
  const pdp = $('#pdp');
  if (pdp) {
    const p = PBP.byId(qs.get('id')) || PBP.products[0];
    const cat = PBP.categories.find((c) => c.id === p.cat);
    const col = PBP.colours.find((c) => c.id === p.colour);
    document.title = `${p.name} | Pradhan by Panchayat`;
    let size = p.sizes.length === 1 ? p.sizes[0] : '';
    const others = PBP.products.filter((x) => x.id !== p.id);
    const pick = (n) => others[(PBP.products.indexOf(p) + n) % others.length];
    const sc = { sweaters: [5, 3, 5, 4], shirts: [5, 3, 4, 5], kurtas: [4, 5, 5, 3], 'nehru-jackets': [4, 5, 3, 3], pajamas: [2, 2, 5, 4], gifts: [3, 5, 4, 3] }[p.cat] || [4, 4, 4, 4];
    pdp.innerHTML = `
      <div class="gal">
        <div class="a"><span class="badge">${p.tag}</span><img src="${img(p.img)}" alt="${p.name}" width="480" height="640"></div>
        <div class="b"><img src="${img(pick(1).img)}" alt="Styled with ${pick(1).name}" width="480" height="640" loading="lazy"></div>
        <div class="c"><img src="${img(p.img)}" alt="" width="480" height="640" loading="lazy" style="object-position:50% 80%;transform:scale(1.35)"></div>
        <div class="d"><img src="${img(p.cat === 'kurtas' || p.cat === 'pajamas' ? 'g-loom' : 'g-office')}" alt="" width="720" height="405" loading="lazy"></div>
      </div>
      <div class="info">
        <div class="crumb"><a href="collection.html">Shop All</a> / <a href="collection.html?c=${cat.id}">${cat.name}</a></div>
        <h1>${p.name}</h1>
        <p class="desc">${p.craft}</p>
        <div class="price">${PBP.inr(p.price)}<small>Inclusive of all taxes</small></div>
        <div class="offers"><div class="offer hot"><b>Diwali gifting</b><br>Free gift wrap on this piece</div><div class="offer"><b>Price-free invoice</b><br>Perfect for gifts</div><div class="offer"><b>Handwritten note</b><br>Add one in your bag</div></div>
        <div class="lbl"><span>Choose your colour: <b>${col.name}</b></span></div>
        <div style="display:flex;gap:10px"><span style="width:30px;height:30px;border-radius:6px;background:${col.hex};box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--ink)"></span></div>
        <div class="lbl"><span>What’s your size?</span><a href="#size-guide" onclick="document.getElementById('size-guide').open=true">Size guide</a></div>
        <div class="sizes">${p.sizes.map((s) => `<button data-s="${s}" aria-pressed="${s === size}">${s}</button>`).join('')}</div>
        <div class="buy"><button class="btn" id="padd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>Add to Bag</button><button class="heart" data-wish="${p.id}" aria-pressed="false" aria-label="Save to wishlist">${PBP.ICON.heart}</button></div>
        <div class="perks"><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>Free delivery across India</div><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>Easy size exchange</div></div>
        <div class="acc">
          <details open><summary>Fit and feel</summary><p>${p.fit}</p></details>
          <details><summary>Material and care</summary><p>${p.craft} Hand wash cold or gentle machine wash. Dry in shade. Handmade cloth has small slubs and variations: that is the village in it.</p></details>
          <details id="size-guide"><summary>Size guide</summary><p>Buying for Papa? Measure a shirt or kurta he already loves, flat across the chest, and double it.</p>
            <table class="size-table"><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr><tr><td>S</td><td>38</td><td>28</td></tr><tr><td>M</td><td>40</td><td>29</td></tr><tr><td>L</td><td>42</td><td>30</td></tr><tr><td>XL</td><td>44</td><td>31</td></tr><tr><td>XXL</td><td>46</td><td>32</td></tr></table></details>
          <details><summary>Returns and exchange</summary><p>Size exchange within 15 days of delivery. Gift orders can be exchanged by the person receiving them.</p></details>
        </div>
      </div>`;
    const wicons = {
      office: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>',
      shaadi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c2 3 5 4 5 8a5 5 0 0 1-10 0c0-4 3-5 5-8Z"/><path d="M7 21h10M12 16v5"/></svg>',
      chaupal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8h10l-1.3 11H7.3Z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2.4M9 4c0 1 1 1 1 2M12 3c0 1 1 1 1 2"/></svg>',
      travel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h5l3 7M10 10l-1-3H7M15 10l1-3h2"/></svg>'
    };
    const wc = (w, k) => `<div class="wcard"><span class="ico">${wicons[w.id]}</span><b>${w.name}</b><small>${w.note}</small><span class="wdots" aria-label="${sc[k]} out of 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= sc[k] ? 'on' : ''}"></i>`).join('')}</span></div>`;
    $('#wear').innerHTML = `<div class="col">${wc(PBP.wear[0], 0)}${wc(PBP.wear[2], 2)}</div><div class="wimg"><img src="${img(p.cat === 'kurtas' || p.cat === 'nehru-jackets' ? 'h-ensemble' : 'h-office')}" alt="" loading="lazy" width="1200" height="675"></div><div class="col">${wc(PBP.wear[3], 3)}${wc(PBP.wear[1], 1)}</div>`;
    pdp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-s]');
      if (b) { size = b.dataset.s; $$('[data-s]', pdp).forEach((x) => x.setAttribute('aria-pressed', x === b)); }
      if (e.target.closest('#padd')) {
        if (!size) { PBP.toast('Please choose a size'); return; }
        PBP.add({ id: p.id, name: p.name, price: p.price, img: p.img, size, qty: 1 }); PBP.openCart();
      }
    });
    $('#more').innerHTML = others.filter((x) => x.cat === p.cat).concat(others.filter((x) => x.cat !== p.cat)).slice(0, 8).map(PBP.card).join('');
    PBP.initTracks(); PBP.syncWish();
  }
})();
