/* Phulera Starter. Letters pop with an elastic scale and flash through the palette 70 ms a colour (Mana Yerba Mate);
   the looks stand in a ring that turns on its own and can be dragged, and the front look opens a printed bill
   (after filatov.design/offline); a wheel of pieces turns as you scroll. Plain JS and CSS: no libraries, transforms only. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s) }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)) };
  var root = document.documentElement, body = document.body;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var P = window.PBP, byId = function (id) { return P && P.byId(id) }, inr = function (n) { return P ? P.inr(n) : '₹' + n };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)) };
  var PAL = ['#e0892a', '#4f86c6', '#c8374a', '#e98aa6', '#2f4a7a', '#f3c74f'];   // Mana's orange, blue, red, pink, blue, yellow in Phulera tones

  /* GSAP-style elastic.out(amplitude, period) sampled into a CSS linear() curve */
  function elastic(a, p) {
    var p1 = Math.max(a, 1), p2 = p / Math.min(a, 1), p3 = p2 / (2 * Math.PI) * (Math.asin(1 / p1) || 0), w = 2 * Math.PI / p2, v = [];
    for (var i = 0; i <= 60; i++) { var t = i / 60; v.push(t === 1 ? 1 : +(p1 * Math.pow(2, -10 * t) * Math.sin((t - p3) * w) + 1).toFixed(4)) }
    return 'linear(' + v.join(',') + ')';
  }
  var EL = 'cubic-bezier(.34,1.7,.5,1)';
  if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)')) { EL = elastic(1.5, .5); root.style.setProperty('--elastic', EL) }
  var pad = function (n) { return (n < 10 ? '0' : '') + n };

  /* ---------- letters ---------- */
  function split(el, text) {
    el.setAttribute('aria-label', text); var i = 0;
    el.innerHTML = text.split(' ').map(function (w) {
      return '<span class="wd" aria-hidden="true">' + Array.from(w).map(function (c) { return '<span class="l" style="--i:' + (i++) + '">' + esc(c) + '</span>' }).join('') + '</span>';
    }).join(' ');
  }
  function flash(l, delay) {   // the letter runs through the palette, then settles on its own colour
    if (reduce || !l.animate) return;
    var fin = getComputedStyle(l.parentNode).color;
    l.animate(PAL.map(function (c, k) { return { color: c, offset: k / PAL.length, easing: 'steps(1,end)' } }).concat([{ color: fin, offset: 1 }]), { duration: 70 * (PAL.length + 1), delay: delay || 0 });
  }
  function pop(el) {
    el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    $$('.l', el).forEach(function (l, i) { flash(l, i * 55 + 60) });
  }
  $$('[data-pop]').forEach(function (el) { if (el.textContent.trim()) split(el, el.textContent.trim()) });
  var seen = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { pop(e.target); seen.unobserve(e.target) } }) }, { threshold: .35 });

  /* ---------- hero: a ring of Phulera looks ----------
     Each look's bill lists only catalogue pieces you can see in its still. */
  var LOOKS = [
    { who: 'Pradhan ji', t: 'Office', img: 'p-half-sweater', tone: '#f0c14b', items: ['pradhan-half-sweater'] },
    { who: 'Sachiv ji', t: 'Checks', img: 'p-check-shirt', tone: '#9cc3e3', items: ['sachiv-check-shirt'] },
    { who: 'Prahlad Cha', t: 'Everyday', img: 'p-cotton-kurta', tone: '#c3cd8a', items: ['prahlad-cotton-kurta'] },
    { who: 'Vikas', t: 'Weekend', img: 'p-vikas-tee', tone: '#f3a58c', items: ['vikas-everyday-tee'] },
    { who: 'Pradhan ji', t: 'Linen', img: 'p-linen-shirt', tone: '#e7d9b5', items: ['pradhan-linen-shirt'] },
    { who: 'Sachiv ji', t: 'Winter', img: 'p-sachiv-sweater', tone: '#d99a8c', items: ['sachiv-maroon-half-sweater'] },
    { who: 'Sachiv ji', t: 'Bike ride', img: 'p-bike-shirt', tone: '#e98aa6', items: ['sachiv-bike-ride-shirt'] },
    { who: 'Prahlad Cha', t: 'Mela', img: 'p-khadi-kurta', tone: '#9fc7b8', items: ['handloom-khadi-kurta', 'phulera-gamchha-stole'] },
    { who: 'Pradhan ji', t: 'Shaadi', img: 'p-nehru-jacket', tone: '#c8a36a', items: ['olive-nehru-jacket'] }
  ];
  var N = LOOKS.length, word = $('.word'), car = $('.carousel'), ttl = $('.ttl');
  car.innerHTML = LOOKS.map(function (L, i) {
    return '<button type="button" class="lk" data-i="' + i + '" aria-label="Look ' + pad(i + 1) + ': ' + L.who + ', ' + L.t + '"><img src="assets/img/ring/r' + pad(i + 1) + '.webp" alt="" draggable="false"></button>';   // ring figure; the bill keeps the official still
  }).join('');
  var cards = $$('.lk', car), rot = 0, tgt = 0, RX = 0, RY = 0, cur = -1, drag = null, spinRaf = 0, lastT = 0, live = false;
  function fitWord() {   // the name never gets cut: shrink it until it fits the screen
    word.style.fontSize = ''; var w = word.scrollWidth, max = innerWidth * .94;
    if (w > max) word.style.fontSize = (parseFloat(getComputedStyle(word).fontSize) * max / w).toFixed(1) + 'px';
  }
  function setCur(n) {
    cur = n; var L = LOOKS[n];
    root.style.setProperty('--tone', L.tone);
    ttl.textContent = L.who + ' · ' + L.t;
    if (word.getAttribute('aria-label') !== L.who) { split(word, L.who); fitWord(); if (live) pop(word) }
  }
  function place() {   // a ring seen from above: the front card is big, the far ones small, higher and faded
    cards.forEach(function (c, i) {
      var a = (i - rot) / N * 2 * Math.PI, s = Math.sin(a), t = (Math.cos(a) + 1) / 2, k = .34 + .66 * Math.pow(t, 1.6);
      c.style.transform = 'translate3d(' + (s * RX).toFixed(1) + 'px,' + (-(1 - t) * RY).toFixed(1) + 'px,0) scale(' + k.toFixed(3) + ')';
      c.style.zIndex = Math.round(t * 100); c.style.opacity = (.7 + .3 * t).toFixed(2);
    });
    var n = ((Math.round(rot) % N) + N) % N; if (n !== cur) setCur(n);
  }
  function layoutCar() {
    var w = innerWidth, h = car.clientHeight, small = w < 700, cw = Math.min(w * (small ? .42 : .17), h * .64 / 2);   // front figure about two thirds of the ring's height
    car.style.setProperty('--cw', cw.toFixed(0) + 'px');
    RX = Math.min(w * (small ? .5 : .44), 780); RY = h * (small ? .6 : .56);   // deep enough that the far side of the ring shows above the front card
    place(); fitWord();
  }
  function spin(now) {
    spinRaf = 0; var dt = lastT ? Math.min(now - lastT, 100) : 16; lastT = now;
    if (!drag) { var d = tgt - rot; rot = Math.abs(d) < .0008 || reduce ? tgt : rot + d * (1 - Math.pow(.9, dt / 16.7)) }   // same speed at any frame rate
    place();
    if (drag || rot !== tgt) spinRaf = requestAnimationFrame(spin); else lastT = 0;
  }
  function go(t) { tgt = t; if (!spinRaf) spinRaf = requestAnimationFrame(spin) }
  function front() { return ((Math.round(tgt) % N) + N) % N }
  function pick(i) {   // tap any look: it enlarges into its bill, and the ring turns it to the front underneath
    var k = ((i - front()) % N + N) % N; if (k > N / 2) k -= N;
    stopAuto(); if (k) go(Math.round(tgt) + k); openBill(i, cards[i]);
  }

  var auto = !reduce, autoT, heroOn = true, billOn = false;
  function restartAuto() { clearTimeout(autoT); if (auto) autoT = setTimeout(function () { if (heroOn && !billOn && !drag && !document.hidden) go(Math.round(tgt) + 1); restartAuto() }, 3600) }
  function stopAuto() { auto = false; clearTimeout(autoT) }   // the ring turns on its own until someone clicks a look

  car.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    drag = { x: e.clientX, r: rot, card: e.target.closest('.lk'), moved: false, v: 0, lx: e.clientX, lt: e.timeStamp };
    car.setPointerCapture(e.pointerId); if (!spinRaf) spinRaf = requestAnimationFrame(spin);
  });
  car.addEventListener('pointermove', function (e) {
    if (!drag) return; var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; car.classList.add('drag') }
    if (!drag.moved) return;
    var per = RX * Math.sin(2 * Math.PI / N);   // pixels between two neighbouring looks at the front
    rot = drag.r - dx / per; var dt = Math.max(1, e.timeStamp - drag.lt); drag.v = (e.clientX - drag.lx) / dt / per; drag.lx = e.clientX; drag.lt = e.timeStamp;
  });
  function endDrag(e) {
    if (!drag) return; var d = drag; drag = null; car.classList.remove('drag');
    if (d.moved) { tgt = rot; go(Math.round(rot - d.v * 180)); restartAuto() }   // a flick carries on a little
    else if (d.card && e.type === 'pointerup') pick(+d.card.dataset.i);
  }
  car.addEventListener('pointerup', endDrag); car.addEventListener('pointercancel', endDrag);
  car.addEventListener('click', function (e) { var c = e.target.closest('.lk'); if (c && e.detail === 0) pick(+c.dataset.i) });   // keyboard Enter / Space
  car.addEventListener('keydown', function (e) {
    var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault(); go(Math.round(tgt) + k); restartAuto(); cards[front()].focus({ preventScroll: true });
  });
  new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting }).observe($('.hero'));

  /* ---------- the bill ---------- */
  var bill = $('.bill'), cats = {}, lastFocus = null, others = $$('header, main, footer, .lab-badge');
  (P ? P.categories : []).forEach(function (c) { cats[c.id] = c.name });
  function openBill(i, from) {
    var L = LOOKS[i], rows = L.items.map(function (id) { return { d: byId(id) } }).filter(function (o) { return o.d });
    $('.bill-t', bill).innerHTML = '<span>' + pad(i + 1) + '.</span> ' + esc(L.who) + ' · ' + esc(L.t);
    var im = $('.bill-fig img', bill); im.src = 'assets/img/ring/r' + pad(i + 1) + '.webp'; im.alt = L.who + ', ' + L.t;
    root.style.setProperty('--tone', L.tone);
    $('.rc-rows', bill).innerHTML = rows.map(function (o) {
      return '<li><span class="nm"><b>' + esc(o.d.name) + '</b><small>' + esc(cats[o.d.cat] || '') + '</small></span><span class="pr">' + inr(o.d.price) + '</span><a class="add" href="product.html?id=' + o.d.id + '">Shop</a></li>';
    }).join('');
    $('.rc-no', bill).textContent = 'Bill no. ' + pad(i + 1) + '/' + new Date().getFullYear() + ' · ' + new Date().toLocaleDateString('en-IN');
    $('.rc-total b', bill).textContent = inr(rows.reduce(function (a, o) { return a + o.d.price }, 0));
    $('.rc-go', bill).href = rows.length === 1 ? 'product.html?id=' + rows[0].d.id : 'shop.html';
    billOn = true; lastFocus = document.activeElement; bill.hidden = false; root.classList.add('bill-on');
    others.forEach(function (el) { el.inert = true });
    void bill.offsetWidth; bill.classList.add('on'); bill.scrollTop = 0; $('.x', bill).focus();
    if (from && !reduce) fly(from, im);
  }
  function fly(card, im) {   // the figure grows from where it stood in the ring to its place on the bill
    var src = $('img', card), a = card.getBoundingClientRect(), r = src.naturalWidth / src.naturalHeight;
    var aw = Math.min(a.width, a.height * r), ah = aw / r, ax = a.left + (a.width - aw) / 2, ay = a.bottom - ah;   // the drawn figure inside its contain box
    var b = im.getBoundingClientRect(); if (!b.width) return;
    var f = new Image(); f.src = src.src; f.alt = ''; f.className = 'fly';
    f.style.cssText = 'left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px';
    document.body.appendChild(f); im.classList.add('flying'); card.style.visibility = 'hidden';
    var anim = f.animate([{ transform: 'translate(' + (ax - b.left) + 'px,' + (ay - b.top) + 'px) scale(' + (aw / b.width) + ')' }, { transform: 'none' }], { duration: 750, easing: 'cubic-bezier(.22,.8,.24,1)' });
    anim.onfinish = anim.oncancel = function () { im.classList.remove('flying'); f.remove(); card.style.visibility = '' };
  }
  function closeBill() {
    if (!billOn) return; billOn = false; bill.classList.remove('on'); root.classList.remove('bill-on');
    others.forEach(function (el) { el.inert = false });
    setTimeout(function () { if (!billOn) bill.hidden = true }, 320);
    if (lastFocus) lastFocus.focus({ preventScroll: true }); restartAuto();
  }
  $('.x', bill).addEventListener('click', closeBill);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBill() });

  /* ---------- the office: a wheel of every piece ---------- */
  var ring = $('.ring'), office = $('.office'), pcs = P ? P.products : [];
  $('.count').textContent = pcs.length;
  ring.innerHTML = pcs.map(function (d) { return '<a class="pc" href="product.html?id=' + d.id + '"><img src="assets/img/' + d.img + '.webp" alt="" loading="lazy"><span class="nm">' + esc(d.name) + '</span><span class="pr">' + inr(d.price) + '</span></a>' }).join('');
  var R = 0;
  function layoutRing() {
    var small = innerWidth < 700; R = small ? Math.max(500, innerWidth * 1.3) : Math.max(760, innerWidth * .6);
    ring.style.setProperty('--cw', (small ? 150 : 210) + 'px');
    $$('.pc', ring).forEach(function (c, i) { c.style.transform = 'rotate(' + (i * 360 / pcs.length) + 'deg) translate(-50%,calc(-50% - ' + R + 'px))' });   // pivots on the wheel's centre (transform-origin 0 0)
  }

  /* ---------- footer word ---------- */
  var giant = $('.giant'); split(giant, 'Phulera'); seen.observe(giant);
  giant.addEventListener('pointerover', function (e) { var l = e.target.closest('.l'); if (l) flash(l, 0) });

  /* ---------- one frame loop for scroll and pointer ---------- */
  var mx = 0, my = 0, sx = 0, sy = 0, raf = 0;
  function want() { if (!raf) raf = requestAnimationFrame(render) }
  var lastY = 0;
  function render() {
    raf = 0; var vh = innerHeight, y = scrollY;
    if (Math.abs(y - lastY) > 6) { body.classList.toggle('hdr-off', y > lastY && y > vh * .6); lastY = y }   // header slips away going down, returns going up
    sx += (mx - sx) * .12; sy += (my - sy) * .12;
    if (Math.abs(mx - sx) + Math.abs(my - sy) > .001) want();   // keep easing toward the pointer
    var hp = clamp(scrollY / vh, 0, 1.2);
    if (hp < 1.2) {
      car.style.transform = 'translate3d(' + (sx * 18).toFixed(1) + 'px,' + (hp * 12).toFixed(2) + 'vh,0) scale(' + (1 - hp * .1).toFixed(3) + ')';
      word.style.translate = (sx * -26).toFixed(1) + 'px ' + (hp * -14).toFixed(2) + 'vh';
    }
    var or = office.getBoundingClientRect();
    if (or.top < vh && or.bottom > 0) {
      var p = clamp(-or.top / (or.height - vh), 0, 1);
      ring.style.transform = 'translate3d(0,' + (vh * .8 + R).toFixed(0) + 'px,0) rotate(' + (28 - p * 250).toFixed(2) + 'deg)';
    }
  }
  addEventListener('scroll', want, { passive: true });
  addEventListener('resize', function () { layoutRing(); layoutCar(); want() });
  $('.hero').addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; want() });

  /* ---------- STORE: the almirah opens as the store loads ----------
     Click fetches the store page and every file it needs at first paint into the browser cache.
     The doors open in step with that progress, are fully open exactly when it is all in, then we step inside
     and the store paints straight from cache. */
  var alm = $('.almirah'), AL = 'assets/img/almirah/alm-', almReady = null;
  function buildAlmirah() {   // built shortly after load (or on first click) so the page's own first load stays light
    if (almReady) return almReady;
    alm.innerHTML = '<div class="plate"><img src="' + AL + 'body.webp" alt=""><img class="inside" src="' + AL + 'inside.webp" alt="">' +
      '<div class="doors"><div class="d l"><img src="' + AL + 'door-l.webp" alt=""><i></i></div><div class="d r"><img src="' + AL + 'door-r.webp" alt=""><i></i></div></div></div>';
    almReady = Promise.all($$('img', alm).map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve() }));
    return almReady;
  }
  addEventListener('load', function () { setTimeout(buildAlmirah, 1500) });

  function storeFiles(href) {   // the store's HTML, then its same-origin CSS, JS and eager images, with progress callbacks
    return fetch(href).then(function (r) { return r.text() }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'), urls = {};
      function add(u) { if (!u) return; var x = new URL(u, href); if (x.origin === location.origin) urls[x.href] = 1 }
      $$('link[rel="stylesheet"],link[rel="preload"]', doc).forEach(function (l) { add(l.getAttribute('href')) });
      $$('script[src]', doc).forEach(function (s) { add(s.getAttribute('src')) });
      $$('img:not([loading="lazy"])', doc).forEach(function (im) {
        var src = im.getAttribute('src'), pic = im.parentNode;
        if (pic && pic.tagName === 'PICTURE') $$('source', pic).some(function (s) { if (matchMedia(s.getAttribute('media') || 'all').matches) { src = s.getAttribute('srcset'); return true } });
        add(src);
      });
      return Object.keys(urls);
    });
  }

  var opening = false;
  $('[data-almirah]').addEventListener('click', function (e) {
    if (reduce || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;   // new-tab clicks and reduced motion go straight through
    e.preventDefault(); if (opening) return; opening = true;
    var href = this.href, total = 1, done = 0, target = 0, shown = 0, started = 0, last = 0, ease = function (t) { return 1 - Math.pow(1 - t, 3) };
    var tick = function () { done++; target = Math.max(target, done / total) };
    storeFiles(href).then(function (urls) {
      total = urls.length + 1; tick();   // the HTML itself counts as the first piece
      urls.forEach(function (u) { fetch(u).then(tick, tick) });
    }, function () { target = 1 });
    setTimeout(function () { target = 1 }, 10000);   // slow network: never trap anyone in the almirah
    buildAlmirah().then(function () {
      var dl = $('.doors .l', alm), dr = $('.doors .r', alm);
      alm.classList.add('on');
      setTimeout(function () { alm.classList.add('rattle') }, 400);
      setTimeout(function () { started = 1; requestAnimationFrame(swing) }, 900);
      function swing(now) {
        var dt = last ? Math.min(now - last, 250) : 16; last = now;   // real elapsed time, so slow phones swing at the same speed
        var want = Math.max(.07, target);   // they unlatch and crack open at once, then follow the loading
        shown = Math.min(want, shown + Math.max(0, (want - shown) * .12) * dt / 16, shown + dt / 1100);   // eased, and never faster than ~1.1 s for the full swing
        var a = ease(shown);
        dl.style.transform = 'rotateY(' + (-116 * a).toFixed(2) + 'deg)'; dr.style.transform = 'rotateY(' + (130 * a).toFixed(2) + 'deg)';
        if (shown < .999) return requestAnimationFrame(swing);
        alm.classList.add('in'); setTimeout(function () { location.href = href }, 650);
      }
    });
  });
  addEventListener('pageshow', function (e) {   // back button from the store shows the page, not open doors
    if (!e.persisted) return; opening = false; alm.className = 'almirah'; $$('.doors .d', alm).forEach(function (d) { d.style.transform = '' });
  });

  /* ---------- go ---------- */
  layoutRing(); layoutCar(); want();
  (document.fonts && document.fonts.ready || Promise.resolve()).then(function () {
    fitWord();
    requestAnimationFrame(function () {
      body.classList.add('ready'); live = true; pop(word);
      $$('[data-pop]').forEach(function (el) { if (el !== word) seen.observe(el) });
      restartAuto();
    });
  });
})();
