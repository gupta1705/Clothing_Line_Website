/* Pradhan by Panchayat: small, dependency-free site script */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const CK = 'pbp2-cart', WK = 'pbp2-wish', GK = 'pbp2-gift';
  const img = (n) => `assets/img/${n}.webp`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A4.9 4.9 0 0 1 12 6.2 4.9 4.9 0 0 1 21.2 11C19 15.6 12 20 12 20Z"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  PBP.HEART = HEART;

  let tt;
  PBP.toast = (m) => { const el = $('#toast'); if (!el) return; el.textContent = m; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); };

  /* Wishlist */
  let wish = store.get(WK, []);
  PBP.syncWish = () => {
    $$('[data-wish]').forEach((b) => b.setAttribute('aria-pressed', wish.includes(b.dataset.wish)));
    $$('[data-wcount]').forEach((el) => { el.textContent = wish.length; el.dataset.n = wish.length; });
  };

  /* Cart */
  let cart = store.get(CK, []);
  const save = () => { store.set(CK, cart); renderCart(); };
  PBP.add = (it) => {
    const key = it.id + '|' + it.size; const hit = cart.find((c) => c.key === key);
    if (hit) hit.qty += it.qty; else cart.push({ ...it, key });
    save(); PBP.toast(`Added to bag · Size ${it.size}`);
  };
  function renderCart() {
    const n = cart.reduce((a, c) => a + c.qty, 0);
    $$('[data-count]').forEach((el) => { el.textContent = n; el.dataset.n = n; });
    const list = $('#cart-items'); if (!list) return;
    list.innerHTML = cart.length ? cart.map((c, i) => `<div class="ci"><img src="${img(c.img)}" alt="" width="72" height="110" loading="lazy">
      <div><div class="n">${c.name}</div><div class="m">Size ${c.size} · ${PBP.inr(c.price)}</div><button class="rm" data-rm="${i}">Remove</button></div>
      <div class="qty"><button data-dq="${i}" data-d="-1" aria-label="Decrease">−</button><input value="${c.qty}" readonly aria-label="Quantity"><button data-dq="${i}" data-d="1" aria-label="Increase">+</button></div></div>`).join('')
      : '<p class="empty">Your bag is empty</p>';
    $('#cart-sub').textContent = PBP.inr(cart.reduce((a, c) => a + c.qty * c.price, 0));
  }
  const open = (id) => { closeAll(); $('#' + id)?.classList.add('open'); $('#scrim')?.classList.add('open'); };
  const closeAll = () => $$('.drawer,.search,.scrim,.menu').forEach((el) => el.classList.remove('open'));
  PBP.openCart = () => open('drawer');
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); $$('.pc.picking').forEach((c) => c.classList.remove('picking')); } });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-rm],[data-dq],[data-open-cart],[data-close],[data-search],[data-menu],[data-checkout],[data-wish],[data-wishlist],[data-quick],[data-qs],[data-soon]');
    if (!t) { $$('.pc.picking').forEach((c) => c.classList.remove('picking')); return; }
    if (t.dataset.rm != null) { cart.splice(+t.dataset.rm, 1); save(); }
    else if (t.dataset.dq != null) { const c = cart[+t.dataset.dq]; c.qty = Math.max(1, c.qty + +t.dataset.d); save(); }
    else if (t.hasAttribute('data-open-cart')) { e.preventDefault(); open('drawer'); }
    else if (t.hasAttribute('data-close')) closeAll();
    else if (t.hasAttribute('data-search')) { e.preventDefault(); open('search'); setTimeout(() => $('#search-q')?.focus(), 150); }
    else if (t.hasAttribute('data-menu')) { e.preventDefault(); $('#menu').classList.contains('open') ? closeAll() : open('menu'); }
    else if (t.hasAttribute('data-checkout')) PBP.toast(cart.length ? 'Secure Razorpay checkout opens at launch' : 'Add something to your bag first');
    else if (t.dataset.wish) {
      e.preventDefault(); const id = t.dataset.wish;
      wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id]; store.set(WK, wish); PBP.syncWish();
      PBP.toast(wish.includes(id) ? 'Saved to wishlist' : 'Removed from wishlist');
    }
    else if (t.hasAttribute('data-wishlist')) { e.preventDefault(); location.href = 'shop.html?wish=1'; }
    else if (t.dataset.quick) {
      e.preventDefault(); const card = t.closest('.pc'); const p = PBP.byId(t.dataset.quick);
      if (p.sizes.length === 1) { PBP.add({ id: p.id, name: p.name, price: p.price, img: p.img, size: p.sizes[0], qty: 1 }); return; }
      $$('.pc.picking').forEach((c) => c !== card && c.classList.remove('picking')); card.classList.toggle('picking');
    }
    else if (t.dataset.qs) {
      e.preventDefault(); const card = t.closest('.pc'); const p = PBP.byId(card.dataset.id);
      PBP.add({ id: p.id, name: p.name, price: p.price, img: p.img, size: t.dataset.qs, qty: 1 }); card.classList.remove('picking');
    }
    else if (t.hasAttribute('data-soon')) { e.preventDefault(); PBP.toast(t.dataset.soon); }
  });
  addEventListener('storage', (e) => { if (e.key === WK) { wish = store.get(WK, []); PBP.syncWish(); } if (e.key === CK) { cart = store.get(CK, []); renderCart(); } });

  const gift = store.get(GK, {});
  $$('[data-gift]').forEach((el) => {
    const k = el.dataset.gift;
    if (el.type === 'checkbox') el.checked = !!gift[k]; else el.value = gift[k] || '';
    el.addEventListener('input', () => { gift[k] = el.type === 'checkbox' ? el.checked : el.value; store.set(GK, gift); sync(); });
  });
  const sync = () => { const m = $('#gift-msg-wrap'); if (m) m.hidden = !gift.note; }; sync();
  $$('.news').forEach((f) => f.addEventListener('submit', (e) => { e.preventDefault(); PBP.toast('Thanks. Our letters start at launch'); f.reset(); }));

  /* Product card (Snitch style) */
  PBP.card = (p) => {
    const col = PBP.colours.find((c) => c.id === p.colour);
    return `<article class="pc" data-id="${p.id}">
      <div class="phw">
        <a class="ph" href="product.html?id=${p.id}"><img src="${img(p.img)}" alt="${p.name}" width="480" height="640" loading="lazy"></a>
        <button class="heart" data-wish="${p.id}" aria-pressed="false" aria-label="Save ${p.name}">${HEART}</button>
        <div class="qs"><small>Select size</small><div>${p.sizes.map((s) => `<button data-qs="${s}">${s}</button>`).join('')}</div></div>
      </div>
      <div class="row"><a class="nm" href="product.html?id=${p.id}">${p.name}</a><span class="pr">${PBP.inr(p.price)}</span><button class="add" data-quick="${p.id}" aria-label="Quick add ${p.name}">${PLUS}</button></div>
      <div class="dots"><i style="background:${col.hex}"></i>${col.name}</div>
    </article>`;
  };

  /* Trending tabs + grid */
  const tg = $('#trend-grid');
  if (tg) {
    const tabs = $('#trend-tabs'); let cat = '';
    tabs.innerHTML = '<button role="tab" aria-selected="true" data-t="">All</button>' + PBP.categories.map((c) => `<button role="tab" aria-selected="false" data-t="${c.id}">${c.name}</button>`).join('');
    const draw = () => { tg.innerHTML = PBP.products.filter((p) => !cat || p.cat === cat).map(PBP.card).join(''); PBP.syncWish(); };
    tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (!b) return; cat = b.dataset.t; $$('[data-t]', tabs).forEach((x) => x.setAttribute('aria-selected', x === b)); draw(); });
    draw();
  }

  /* Hero 2-up slider */
  const tr = $('.hero-track');
  if (tr) {
    const slides = $$('.hs', tr); let i = 0, timer;
    const per = () => (innerWidth > 900 ? 2 : 1);
    const go = (k) => { const max = slides.length - per(); i = k > max ? 0 : k < 0 ? max : k; tr.style.transform = `translateX(${-i * (100 / per())}%)`; };
    const play = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(i + 1), 5000); };
    addEventListener('resize', () => go(i)); play();
  }

  renderCart(); PBP.syncWish();
})();
