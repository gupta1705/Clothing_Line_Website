/* Page scripts: shop listing and product page */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const img = (n) => `assets/img/${n}.webp`;

  /* ---------- Shop ---------- */
  const grid = $('#shop-grid');
  if (grid) {
    const st = { cat: qs.get('c') || '', edit: qs.get('edit') || '', q: (qs.get('q') || '').toLowerCase(), wish: qs.has('wish'), sort: 'rec' };
    const links = $('#links');
    const edits = [['Phulera Everyday', 'Phulera Drops'], ['Pradhan Office Edit', 'Office Edit'], ['Festive Edit', 'Festive Edit'], ['Loom Fresh', 'Loom Fresh'], ['Gifting', 'Diwali Gifting']];
    links.innerHTML = `<button data-k="all" aria-pressed="${!st.cat && !st.edit && !st.wish}">All</button>`
      + PBP.categories.map((c) => `<button data-c="${c.id}" aria-pressed="${c.id === st.cat}">${c.name}</button>`).join('')
      + edits.map(([id, n]) => `<button data-e="${id}" aria-pressed="${id === st.edit}">${n}${id === 'Gifting' ? '<span class="tag">Free wrap</span>' : ''}</button>`).join('')
      + `<button data-w aria-pressed="${st.wish}">Wishlist</button>`;
    links.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      Object.assign(st, { cat: b.dataset.c || '', edit: b.dataset.e || '', wish: b.hasAttribute('data-w'), q: '' });
      $$('button', links).forEach((x) => x.setAttribute('aria-pressed', x === b));
      history.replaceState(null, '', 'shop.html' + (st.cat ? '?c=' + st.cat : st.edit ? '?edit=' + encodeURIComponent(st.edit) : st.wish ? '?wish=1' : ''));
      render();
    });
    $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; render(); });
    function render() {
      const wish = (() => { try { return JSON.parse(localStorage.getItem('pbp2-wish')) || []; } catch { return []; } })();
      let list = PBP.products.filter((p) => (!st.cat || p.cat === st.cat) && (!st.edit || p.line === st.edit) && (!st.wish || wish.includes(p.id)) &&
        (!st.q || (p.name + ' ' + p.line + ' ' + p.cat).toLowerCase().includes(st.q)));
      if (st.sort === 'lo') list.sort((a, b) => a.price - b.price);
      if (st.sort === 'hi') list.sort((a, b) => b.price - a.price);
      const c = PBP.categories.find((x) => x.id === st.cat);
      $('#title').textContent = st.wish ? 'Wishlist' : st.q ? `“${st.q}”` : c ? c.name : st.edit || 'Shop All';
      $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
      grid.innerHTML = list.length ? list.map(PBP.card).join('') : `<p class="none">${st.wish ? 'Nothing saved yet' : 'Nothing here yet'}</p>`;
      PBP.syncWish();
    }
    render();
  }

  /* ---------- Product ---------- */
  const pdp = $('#pdp');
  if (pdp) {
    const p = PBP.byId(qs.get('id')) || PBP.products[0];
    const cat = PBP.categories.find((c) => c.id === p.cat);
    const col = PBP.colours.find((c) => c.id === p.colour);
    document.title = `${p.name} | Pradhan by Panchayat`;
    let size = p.sizes.length === 1 ? p.sizes[0] : '';
    const others = PBP.products.filter((x) => x.id !== p.id);
    const voices = { sweaters: ['Pradhan ji', 'Panchayat meeting or a wedding, this never lets me down.'], shirts: ['Sachiv ji', 'Fine for the office. Even better on the bike to Phulera.'], kurtas: ['Prahlad Cha', 'Cloth is only good when a village’s hands have made it.'], 'nehru-jackets': ['Pradhan ji', 'Wear it once to a shaadi and everyone asks who the Pradhan is.'], pajamas: ['Vikas', 'For the evenings when the panchayat office is finally shut.'], gifts: ['Sachiv ji', 'Sent one home to Papa. He called twice.'] };
    const [who, line] = voices[p.cat] || voices.shirts;
    pdp.innerHTML = `
      <div class="pgal">
        <div class="m"><img src="${img(p.img)}" alt="${p.name}" width="480" height="640"><button class="heart" data-wish="${p.id}" aria-pressed="false" aria-label="Save to wishlist">${PBP.HEART}</button></div>
        <div class="two"><div><img src="${img(p.img)}" alt="" width="480" height="640" loading="lazy" style="transform:scale(1.4);object-position:50% 70%"></div><div><img src="${img(others[(PBP.products.indexOf(p) + 3) % others.length].img)}" alt="" width="480" height="640" loading="lazy"></div></div>
      </div>
      <div class="pinfo">
        <div style="font-size:12px;text-transform:uppercase;color:var(--muted)"><a href="shop.html">Shop</a> / <a href="shop.html?c=${cat.id}">${cat.name}</a></div>
        <h1>${p.name}</h1>
        <div class="price">${PBP.inr(p.price)}<small>MRP inclusive of all taxes</small></div>
        <div class="offer"><b>Diwali gifting</b>Free gift wrap, a handwritten note and a price-free invoice on this piece.</div>
        <div class="lbl"><span>Selected colour · <b>${col.name}</b></span></div>
        <div class="swatch"><img src="${img(p.img)}" alt="${col.name}" width="480" height="640"></div>
        <div class="lbl"><span>Select size</span><a href="#size-guide" onclick="document.getElementById('size-guide').open=true">Size guide</a></div>
        <div class="sizes">${p.sizes.map((s) => `<button data-s="${s}" aria-pressed="${s === size}">${s}</button>`).join('')}</div>
        <div class="ship">FREE delivery across India</div>
        <button class="btn" id="padd">Add +</button>
        <div class="acc">
          <details open><summary>Delivery</summary><div class="pin" style="margin-top:10px"><input placeholder="Enter pincode" inputmode="numeric" aria-label="Pincode" maxlength="6"><button type="button" data-soon="Delivery dates appear at launch">Check</button></div></details>
          <details><summary>Description &amp; fit</summary><p>${p.craft} ${p.fit}</p></details>
          <details id="size-guide"><summary>Size guide</summary><p>Buying for Papa? Measure a shirt or kurta he already loves, flat across the chest, and double it.</p><table class="size-table"><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr><tr><td>S</td><td>38</td><td>28</td></tr><tr><td>M</td><td>40</td><td>29</td></tr><tr><td>L</td><td>42</td><td>30</td></tr><tr><td>XL</td><td>44</td><td>31</td></tr><tr><td>XXL</td><td>46</td><td>32</td></tr></table></details>
          <details><summary>Returns</summary><p>Easy size exchange within 15 days. Gift orders can be exchanged by the person who receives them.</p></details>
        </div>
        <div class="char"><b>Straight from Phulera · ${who}</b><q>${line}</q></div>
      </div>`;
    pdp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-s]');
      if (b) { size = b.dataset.s; $$('[data-s]', pdp).forEach((x) => x.setAttribute('aria-pressed', x === b)); }
      if (e.target.closest('#padd')) {
        if (!size) { PBP.toast('Please select a size'); return; }
        PBP.add({ id: p.id, name: p.name, price: p.price, img: p.img, size, qty: 1 }); PBP.openCart();
      }
    });
    $('#more').innerHTML = others.filter((x) => x.cat === p.cat).concat(others.filter((x) => x.cat !== p.cat)).slice(0, 5).map(PBP.card).join('');
    PBP.syncWish();
  }
})();
