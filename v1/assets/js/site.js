/* Pradhan by Panchayat — small, dependency-free site script */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const img = (n) => `assets/img/${n}.webp`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A4.9 4.9 0 0 1 12 6.2 4.9 4.9 0 0 1 21.2 11C19 15.6 12 20 12 20Z"/></svg>',
    leaf: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M14 2C7 2 3 5 3 10c0 1.3.4 2.4 1 3.3C5 9 8 7 11 6 8 8 6 10.5 5.2 14c.8.4 1.7.6 2.8.6C12 14.6 14 10 14 2Z"/></svg>'
  };
  PBP.ICON = ICON;

  /* ---------- Toast ---------- */
  let tt;
  PBP.toast = (msg) => { const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); };

  /* ---------- Wishlist ---------- */
  let wish = store.get('pbp-wish', []);
  const syncWish = () => {
    $$('[data-wish]').forEach((b) => b.setAttribute('aria-pressed', wish.includes(b.dataset.wish)));
    $$('[data-wcount]').forEach((el) => { el.textContent = wish.length; el.dataset.n = wish.length; });
  };
  PBP.syncWish = syncWish;

  /* ---------- Cart ---------- */
  let cart = store.get('pbp-cart', []);
  const save = () => { store.set('pbp-cart', cart); renderCart(); };
  PBP.add = (item) => {
    const key = item.id + '|' + (item.size || '');
    const hit = cart.find((c) => c.key === key);
    if (hit) hit.qty += item.qty; else cart.push({ ...item, key });
    save(); PBP.toast(`${item.name} added to your bag`);
  };
  function renderCart() {
    const n = cart.reduce((a, c) => a + c.qty, 0);
    $$('[data-count]').forEach((el) => { el.textContent = n; el.dataset.n = n; });
    const list = $('#cart-items'); if (!list) return;
    list.innerHTML = cart.length ? cart.map((c, i) => `
      <div class="ci"><img src="${img(c.img)}" alt="" width="70" height="92" loading="lazy">
        <div><div class="n">${c.name}</div><div class="m">${c.size ? 'Size ' + c.size + ' · ' : ''}${PBP.inr(c.price)}</div><button class="rm" data-rm="${i}">Remove</button></div>
        <div class="qty"><button data-dq="${i}" data-d="-1" aria-label="Decrease">−</button><input value="${c.qty}" readonly aria-label="Quantity"><button data-dq="${i}" data-d="1" aria-label="Increase">+</button></div>
      </div>`).join('') : '<p class="empty">Your bag is empty.<br>Phulera is waiting.</p>';
    $('#cart-sub').textContent = PBP.inr(cart.reduce((a, c) => a + c.qty * c.price, 0));
  }

  const open = (id) => { $('#' + id)?.classList.add('open'); $('#scrim')?.classList.add('open'); };
  const closeAll = () => $$('.drawer,.search,.scrim,.mnav').forEach((el) => el.classList.remove('open'));
  PBP.openCart = () => open('drawer');
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-rm],[data-dq],[data-open-cart],[data-close],[data-search],[data-menu],[data-checkout],[data-wish],[data-wishlist],[data-q],[data-soon]');
    if (!t) return;
    if (t.dataset.rm != null) { cart.splice(+t.dataset.rm, 1); save(); }
    else if (t.dataset.dq != null) { const c = cart[+t.dataset.dq]; c.qty = Math.max(1, c.qty + +t.dataset.d); save(); }
    else if (t.hasAttribute('data-open-cart')) open('drawer');
    else if (t.hasAttribute('data-close')) closeAll();
    else if (t.hasAttribute('data-search')) { e.preventDefault(); closeAll(); open('search'); setTimeout(() => $('#search-q')?.focus(), 150); }
    else if (t.hasAttribute('data-menu')) $('#mnav').classList.toggle('open');
    else if (t.hasAttribute('data-checkout')) PBP.toast(cart.length ? 'Secure Razorpay checkout opens at launch' : 'Add something to your bag first');
    else if (t.dataset.wish) {
      e.preventDefault(); const id = t.dataset.wish;
      wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
      store.set('pbp-wish', wish); syncWish();
      PBP.toast(wish.includes(id) ? 'Saved to your wishlist' : 'Removed from your wishlist');
    }
    else if (t.hasAttribute('data-wishlist')) { e.preventDefault(); location.href = 'collection.html?wish=1'; }
    else if (t.dataset.q) { const inp = t.parentElement.querySelector('input'); inp.value = Math.max(1, (+inp.value || 1) + +t.dataset.q); }
    else if (t.hasAttribute('data-soon')) { e.preventDefault(); PBP.toast(t.dataset.soon); }
  });
  addEventListener('storage', (e) => { if (e.key === 'pbp-wish') { wish = store.get('pbp-wish', []); syncWish(); } if (e.key === 'pbp-cart') { cart = store.get('pbp-cart', []); renderCart(); } });

  /* Gift options persist */
  const gift = store.get('pbp-gift', {});
  $$('[data-gift]').forEach((el) => {
    const k = el.dataset.gift;
    if (el.type === 'checkbox') el.checked = !!gift[k]; else el.value = gift[k] || '';
    el.addEventListener('input', () => { gift[k] = el.type === 'checkbox' ? el.checked : el.value; store.set('pbp-gift', gift); syncGift(); });
  });
  function syncGift() { const m = $('#gift-msg-wrap'); if (m) m.hidden = !gift.note; }
  syncGift();

  /* Newsletter */
  $$('.news').forEach((f) => f.addEventListener('submit', (e) => { e.preventDefault(); PBP.toast('Thank you. Our letters start at launch.'); f.reset(); }));

  /* ---------- Header: floats over hero, sticks on scroll ---------- */
  const hdr = $('.hdr');
  if (hdr && !hdr.classList.contains('solid')) {
    const on = () => hdr.classList.toggle('stuck', scrollY > 120);
    on(); addEventListener('scroll', on, { passive: true });
  }

  /* ---------- Product card ---------- */
  PBP.card = (p) => {
    const cls = { 'Diwali Special': '', 'Limited Release': 'lt', Restocked: 'gr', 'Phulera Drop': 'gr', Bestseller: 'lt', 'Festive Edit': '', New: 'gr' }[p.tag] ?? '';
    return `<article class="pc">
      <a class="ph" href="product.html?id=${p.id}">
        ${p.tag ? `<span class="badge ${cls}">${p.tag}</span>` : ''}
        <img src="${img(p.img)}" alt="${p.name}" width="480" height="640" loading="lazy">
        <span class="chip">${ICON.leaf}Handmade</span>
      </a>
      <button class="heart" data-wish="${p.id}" aria-pressed="false" aria-label="Save ${p.name} to wishlist">${ICON.heart}</button>
      <a class="meta" href="product.html?id=${p.id}"><span class="nm">${p.name}</span><span class="pr">${PBP.inr(p.price)}</span><span class="ln">${p.line}</span></a>
    </article>`;
  };

  /* ---------- Carousels (native scroll + arrows) ---------- */
  PBP.initTracks = () => $$('.track-wrap').forEach((w) => {
    const tr = $('.track', w), nx = $('.next', w), pv = $('.prev', w);
    if (!tr || !tr.children.length || w.dataset.ready) return; w.dataset.ready = 1;
    const step = () => (tr.firstElementChild?.getBoundingClientRect().width || 300) + 14;
    const upd = () => { if (pv) pv.disabled = tr.scrollLeft < 8; if (nx) nx.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 8; };
    nx?.addEventListener('click', () => tr.scrollBy({ left: step() * 2, behavior: reduce ? 'auto' : 'smooth' }));
    pv?.addEventListener('click', () => tr.scrollBy({ left: -step() * 2, behavior: reduce ? 'auto' : 'smooth' }));
    tr.addEventListener('scroll', upd, { passive: true }); upd();
  });

  $$('[data-row]').forEach((el) => {
    const ids = el.dataset.row.split(',');
    el.innerHTML = ids.map((id) => PBP.byId(id)).filter(Boolean).map(PBP.card).join('');
  });
  PBP.initTracks();

  /* ---------- Hero slider ---------- */
  const slides = $$('.slide');
  if (slides.length > 1) {
    const dots = $('.dots'); let i = 0, timer;
    dots.innerHTML = slides.map((_, k) => `<button aria-label="Slide ${k + 1}" aria-current="${k === 0}"></button>`).join('');
    const go = (k) => {
      slides[i].classList.remove('on'); slides[i].setAttribute('aria-hidden', 'true');
      i = (k + slides.length) % slides.length;
      slides[i].classList.add('on'); slides[i].removeAttribute('aria-hidden');
      $$('button', dots).forEach((b, n) => b.setAttribute('aria-current', n === i));
      // lazy-load the next slide's image
      const nimg = $('img[data-src]', slides[(i + 1) % slides.length]); if (nimg) { nimg.srcset = nimg.dataset.srcset; nimg.src = nimg.dataset.src; nimg.removeAttribute('data-src'); }
    };
    const play = () => { if (!reduce) { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); } };
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { go($$('button', dots).indexOf(b)); play(); } });
    setTimeout(() => { const nimg = $('img[data-src]', slides[1]); if (nimg) { nimg.srcset = nimg.dataset.srcset; nimg.src = nimg.dataset.src; nimg.removeAttribute('data-src'); } }, 2500);
    play();
  }

  /* ---------- People of Phulera ---------- */
  const quotes = $$('.quote'), pimgs = $$('.pimg .fr > img'), pdots = $('.pdots');
  if (quotes.length > 1) {
    let q = 0, qt;
    pdots.innerHTML = quotes.map((_, k) => `<button aria-label="Story ${k + 1}" aria-current="${k === 0}"></button>`).join('');
    const show = (k) => {
      q = (k + quotes.length) % quotes.length;
      quotes.forEach((el, n) => el.classList.toggle('on', n === q));
      pimgs.forEach((el, n) => el.classList.toggle('on', n === q));
      $$('button', pdots).forEach((b, n) => b.setAttribute('aria-current', n === q));
      const p = PBP.byId(quotes[q].dataset.product);
      const chip = $('.pchip');
      if (p && chip) { chip.href = 'product.html?id=' + p.id; $('img', chip).src = img(p.img); $('.n', chip).textContent = p.name; $('.p', chip).textContent = PBP.inr(p.price); }
    };
    pdots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { show($$('button', pdots).indexOf(b)); clearInterval(qt); } });
    show(0);
    if (!reduce) qt = setInterval(() => show(q + 1), 7000);
  }

  /* ---------- Colours of Phulera ---------- */
  const cp = $('#colours');
  if (cp) {
    const tabs = $('.ctabs', cp), sw = $('.sw', cp);
    tabs.innerHTML = PBP.colours.map((c, k) => `<button role="tab" aria-selected="${k === 0}" data-c="${c.id}">${c.name}</button>`).join('');
    sw.innerHTML = PBP.colours.map((c, k) => `<button role="tab" aria-selected="${k === 0}" data-c="${c.id}" style="background:${c.hex}" aria-label="${c.name}"></button>`).join('');
    const set = (id) => {
      const c = PBP.colours.find((x) => x.id === id);
      $$('[data-c]', cp).forEach((b) => b.setAttribute('aria-selected', b.dataset.c === id));
      $('h3', cp).textContent = c.name; $('.cinfo p', cp).textContent = c.blurb;
      $('.cinfo .pill', cp).href = 'collection.html?colour=' + c.id; $('.cinfo .pill span', cp).textContent = 'Shop ' + c.name;
      $('.cinfo .ic', cp).innerHTML = PBP.colourIcon(c.icon);
      const list = PBP.products.filter((p) => p.colour === id).slice(0, 2);
      $('.cprods', cp).innerHTML = list.map(PBP.card).join(''); syncWish();
    };
    cp.addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) set(b.dataset.c); });
    set(PBP.colours[0].id);
  }

  renderCart(); syncWish();
})();
