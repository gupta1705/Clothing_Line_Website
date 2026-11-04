/* Pradhan by Panchayat — small, dependency-free site script */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const img = (name) => `assets/img/${name}.webp`;

  /* ---------- Cart ---------- */
  let cart = store.get('pbp-cart', []);
  const save = () => { store.set('pbp-cart', cart); renderCart(); };
  function add(item) {
    const key = item.id + '|' + (item.size || '') + '|' + (item.amount || '');
    const hit = cart.find((c) => c.key === key);
    if (hit) hit.qty += item.qty; else cart.push({ ...item, key });
    save();
    toast(`${item.name} added to your bag`);
  }
  PBP.add = add;

  function renderCart() {
    const n = cart.reduce((a, c) => a + c.qty, 0);
    $$('[data-count]').forEach((el) => (el.textContent = n));
    const list = $('#cart-items');
    if (!list) return;
    if (!cart.length) list.innerHTML = '<p class="empty">Your bag is empty.<br>Phulera is waiting.</p>';
    else list.innerHTML = cart.map((c, i) => `
      <div class="ci">
        <img src="${img(c.img)}" alt="" width="76" height="76" loading="lazy">
        <div><div class="n">${c.name}</div><div class="m">${c.size ? 'Size ' + c.size + ' · ' : ''}${PBP.inr(c.price)}</div>
          <button class="rm" data-rm="${i}">Remove</button></div>
        <div class="qty" aria-label="Quantity"><button data-dq="${i}" data-d="-1" aria-label="Decrease">−</button><input value="${c.qty}" readonly aria-label="Quantity"><button data-dq="${i}" data-d="1" aria-label="Increase">+</button></div>
      </div>`).join('');
    const sub = cart.reduce((a, c) => a + c.qty * c.price, 0);
    $('#cart-sub').textContent = PBP.inr(sub);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-rm],[data-dq],[data-open-cart],[data-close],[data-search],[data-menu],[data-checkout]');
    if (!t) return;
    if (t.dataset.rm != null) { cart.splice(+t.dataset.rm, 1); save(); }
    else if (t.dataset.dq != null) { const c = cart[+t.dataset.dq]; c.qty = Math.max(1, c.qty + +t.dataset.d); save(); }
    else if (t.hasAttribute('data-open-cart')) openPanel('drawer');
    else if (t.hasAttribute('data-close')) closePanels();
    else if (t.hasAttribute('data-search')) { openPanel('search'); setTimeout(() => $('#search-q')?.focus(), 200); }
    else if (t.hasAttribute('data-menu')) { $('#mnav').classList.toggle('open'); }
    else if (t.hasAttribute('data-checkout')) {
      if (!cart.length) return toast('Add something to your bag first');
      toast('Secure Razorpay checkout opens at launch');
    }
  });
  function openPanel(id) { $('#' + id)?.classList.add('open'); $('#scrim')?.classList.add('open'); }
  function closePanels() { $$('.drawer,.search,.scrim,.mnav,.side').forEach((el) => el.classList.remove('open')); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanels(); });

  /* Gift options persist */
  const gift = store.get('pbp-gift', {});
  $$('[data-gift]').forEach((el) => {
    const k = el.dataset.gift;
    if (el.type === 'checkbox') el.checked = !!gift[k]; else el.value = gift[k] || '';
    el.addEventListener('input', () => { gift[k] = el.type === 'checkbox' ? el.checked : el.value; store.set('pbp-gift', gift); syncGift(); });
  });
  function syncGift() { const m = $('#gift-msg-wrap'); if (m) m.hidden = !gift.note; }
  syncGift();

  let tt;
  function toast(msg) {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600);
  }
  PBP.toast = toast;

  /* ---------- Header state over hero ---------- */
  const hdr = $('.site-header');
  const hero = $('.hero');
  if (hdr && hero && !hdr.classList.contains('solid')) {
    const onScroll = () => {
      const past = window.scrollY > hero.offsetHeight - 100;
      hdr.classList.toggle('glass', !past);
      hdr.classList.toggle('on-light', past);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -12% 0px' }) : null;
  PBP.reveal = (els) => els.forEach((el) => { if (io) { el.classList.add('reveal'); io.observe(el); } });
  PBP.reveal($$('[data-reveal]'));

  /* ---------- Cursor glow (fine pointers only) ---------- */
  const glow = $('.glow');
  if (glow && matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let x = 0, y = 0, gx = 0, gy = 0, raf = 0;
    const tick = () => { gx += (x - gx) * .14; gy += (y - gy) * .14; glow.style.transform = `translate3d(${gx}px,${gy}px,0)`; raf = Math.abs(x - gx) + Math.abs(y - gy) > .5 ? requestAnimationFrame(tick) : 0; };
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; glow.style.opacity = '1'; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    document.addEventListener('pointerleave', () => (glow.style.opacity = '0'));
  }

  /* ---------- Product cards ---------- */
  PBP.card = (p, full) => full ? `
    <article class="card">
      <a href="product.html?id=${p.id}" class="ph"><img src="${img(p.img)}" alt="${p.name}" width="400" height="400" loading="lazy"></a>
      <div class="row"><a href="product.html?id=${p.id}" class="nm">${p.name}</a><span class="pr">${PBP.inr(p.price)}</span></div>
      <div class="by">${p.by}</div>
      <div class="ctl">
        <select class="sel" aria-label="Size for ${p.name}">${p.sizes.length > 1 ? '<option value="">Size</option>' : ''}${p.sizes.map((s) => `<option>${s}</option>`).join('')}</select>
        <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><input value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="Increase">+</button></div>
      </div>
      <button class="btn rose" data-add="${p.id}">Add to Cart</button>
    </article>` : `
    <a class="card" href="product.html?id=${p.id}" data-reveal>
      <span class="ph"><img src="${img(p.img)}" alt="${p.name}" width="400" height="400" loading="lazy"></span>
      <span class="nm">${p.name}</span>
      <span class="pr">${PBP.inr(p.price)}</span>
      <span class="by">${p.by}</span>
    </a>`;

  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]');
    if (q) { const inp = q.parentElement.querySelector('input'); inp.value = Math.max(1, (+inp.value || 1) + +q.dataset.q); return; }
    const a = e.target.closest('[data-add]');
    if (a) {
      const card = a.closest('.card'); const p = PBP.byId(a.dataset.add);
      const sel = card.querySelector('select');
      if (sel && !sel.value) { sel.focus(); return toast('Please choose a size'); }
      add({ id: p.id, name: p.name, price: p.price, img: p.img, size: sel ? sel.value : '', qty: +card.querySelector('.qty input').value || 1 });
    }
  });

  const fav = $('#favourites');
  if (fav) { fav.innerHTML = PBP.products.slice(0, 8).map((p) => PBP.card(p)).join(''); PBP.reveal($$('.card', fav)); }

  renderCart();
})();
