/* Phulera Starter. Motion follows Mana Yerba Mate's own code (read with the Awwwards MCP's bundle tool):
   letters pop with an elastic scale and flash through the palette 70 ms a colour; the look picker slides a pill and
   swaps the portrait through three growing circles with a springy settle; sections arch in, cards drift with a tilt,
   a wheel of pieces turns as you scroll. Plain JS, CSS and SVG: no libraries, transforms only. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s) }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)) };
  var root = document.documentElement, body = document.body, NS = 'http://www.w3.org/2000/svg';
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
  var inOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 };

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

  /* ---------- drawn stickers ---------- */
  function star(n, r1, r2) { var pts = []; for (var i = 0; i < n * 2; i++) { var a = i / (n * 2) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r2 : r1; pts.push((50 + Math.cos(a) * r).toFixed(1) + ',' + (50 + Math.sin(a) * r).toFixed(1)) } return pts.join(' ') }
  var DECO = {
    sun: '<svg viewBox="0 0 100 100"><polygon points="' + star(12, 48, 34) + '" fill="#f0c14b" stroke="#3a2618" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="50" r="17" fill="#e0892a" stroke="#3a2618" stroke-width="3"/></svg>',
    spool: '<svg viewBox="0 0 70 80"><rect x="12" y="14" width="46" height="52" fill="#c8374a" stroke="#3a2618" stroke-width="3"/><path d="M12 26h46M12 36h46M12 46h46M12 56h46" stroke="#3a2618" stroke-width="1.5" opacity=".45"/><rect x="4" y="5" width="62" height="11" rx="2" fill="#b07a4a" stroke="#3a2618" stroke-width="3"/><rect x="4" y="64" width="62" height="11" rx="2" fill="#b07a4a" stroke="#3a2618" stroke-width="3"/><path d="M58 40c10 2 8 14 2 22" fill="none" stroke="#c8374a" stroke-width="2.5" stroke-linecap="round"/></svg>',
    lauki: '<svg viewBox="0 0 80 110"><path d="M40 16c6 0 8 6 7 12-1 8-7 12-7 22 0 12 18 16 18 36 0 14-9 20-18 20s-18-6-18-20c0-20 18-24 18-36 0-10-6-14-7-22-1-6 1-12 7-12z" fill="#7d8f3a" stroke="#3a2618" stroke-width="3" stroke-linejoin="round"/><path d="M40 16c0-6 4-10 9-11" fill="none" stroke="#3a2618" stroke-width="3" stroke-linecap="round"/><path d="M33 70c-2 6-1 14 3 19" fill="none" stroke="#f6efe2" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>',
    tanki: '<svg viewBox="0 0 90 130"><path d="M20 70 10 126M70 70l10 56M45 70v56M14 104h62" stroke="#3a2618" stroke-width="3.5" stroke-linecap="round"/><rect x="12" y="20" width="66" height="54" rx="4" fill="#d9c4a0" stroke="#3a2618" stroke-width="3"/><path d="M12 32h66M12 60h66" stroke="#3a2618" stroke-width="2" opacity=".35"/><rect x="34" y="8" width="22" height="13" fill="#f6efe2" stroke="#3a2618" stroke-width="3"/><text x="45" y="52" text-anchor="middle" font-family="Arial" font-weight="700" font-size="11" fill="#3a2618">फुलेरा</text></svg>'
  };
  $$('[data-deco]').forEach(function (d) { d.innerHTML = DECO[d.getAttribute('data-deco')] || '' });

  /* ---------- hero: pick a Phulera look ---------- */
  var LOOKS = [
    { who: 'Pradhan ji', pid: 'pradhan-half-sweater', img: 'p-half-sweater', tone: '#f0c14b', s: 'hand-knitted in', b: 'Kullu' },
    { who: 'Sachiv ji', pid: 'sachiv-check-shirt', img: 'p-check-shirt', tone: '#9cc3e3', s: 'handloom from', b: 'Pochampally' },
    { who: 'Prahlad Cha', pid: 'prahlad-cotton-kurta', img: 'p-cotton-kurta', tone: '#c3cd8a', s: 'woven in', b: 'Bhagalpur' },
    { who: 'Vikas', pid: 'vikas-everyday-tee', img: 'p-vikas-tee', tone: '#f3a58c', s: 'hand-printed', b: 'Organic tee' }
  ];
  LOOKS.forEach(function (L) { var im = new Image(); im.src = 'assets/img/' + L.img + '.webp' });   // warm the cache so swaps never wait
  var picker = $('.picker'), pill = $('.pill'), word = $('.word'), svg = $('.portrait'), defs = $('defs', svg), layers = $('.layers', svg);
  var price = $('.price'), craft = $('.craft'), look = $('.look'), frame = $('.frame'), tone = $('.tone'), cur = -1, cpN = 0;
  picker.insertAdjacentHTML('beforeend', LOOKS.map(function (L, i) { return '<button type="button" role="tab" aria-selected="false" data-i="' + i + '">' + L.who + '</button>' }).join(''));
  var tabs = $$('button', picker);
  var POS = [[[25, 50], [70, 70], [40, 20]], [[50, 20], [60, 65], [20, 80]], [[30, 70], [45, 25], [80, 45]], [[75, 25], [20, 40], [55, 85]], [[15, 15], [85, 55], [40, 75]]];
  function image(src) { var im = document.createElementNS(NS, 'image'); im.setAttribute('href', src); im.setAttribute('width', 600); im.setAttribute('height', 800); im.setAttribute('preserveAspectRatio', 'xMidYMid slice'); return im }
  function portrait(L, instant) {   // the new still opens through three circles that grow one after another
    var g = document.createElementNS(NS, 'g'); g.appendChild(image('assets/img/' + L.img + '.webp'));
    if (instant || reduce) { layers.replaceChildren(g); return }
    var id = 'cp' + (++cpN), cp = document.createElementNS(NS, 'clipPath'); cp.id = id;
    var cs = POS[Math.random() * POS.length | 0].map(function (p) { var c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', p[0] * 6); c.setAttribute('cy', p[1] * 8); c.setAttribute('r', 0); cp.appendChild(c); return c });
    defs.appendChild(cp); g.setAttribute('clip-path', 'url(#' + id + ')'); layers.appendChild(g);
    var t0 = performance.now();
    requestAnimationFrame(function tick(now) {
      var done = true;
      cs.forEach(function (c, k) { var t = clamp((now - t0 - k * 70) / 1000, 0, 1); if (t < 1) done = false; c.setAttribute('r', (1000 * inOut(t)).toFixed(1)) });
      if (!done) return requestAnimationFrame(tick);
      g.removeAttribute('clip-path'); cp.remove(); while (layers.firstChild !== g) layers.removeChild(layers.firstChild);
    });
    if (frame.animate) frame.animate([{ scale: .95 }, { scale: 1 }], { duration: 1100, easing: EL });
  }
  function bounceIn(el) { if (!reduce && el.animate) el.animate([{ scale: 0 }, { scale: 1 }], { duration: 900, easing: EL, delay: 250 }) }
  function movePill(b) { pill.style.width = b.offsetWidth + 'px'; pill.style.height = b.offsetHeight + 'px'; pill.style.transform = 'translate(' + b.offsetLeft + 'px,' + b.offsetTop + 'px)' }   // also works when phones wrap the picker into a grid
  function setLook(i, instant) {
    if (i === cur) return; cur = i; var L = LOOKS[i], d = byId(L.pid);
    root.style.setProperty('--tone', L.tone);
    tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1 });
    movePill(tabs[i]);
    split(word, L.who); if (!instant) pop(word);
    svg.setAttribute('aria-label', L.who + (d ? ' wearing the ' + d.name : ''));
    portrait(L, instant);
    var href = 'product.html?id=' + L.pid;
    $('b', price).textContent = d ? inr(d.price) : ''; price.href = href; price.setAttribute('aria-label', (d ? d.name + ', ' + inr(d.price) : L.who) + ', shop it');
    $('small', craft).textContent = L.s; $('b', craft).textContent = L.b;
    $('.nm', look).textContent = d ? d.name : L.who; $('.go', look).href = href;
    if (!instant) { bounceIn(price); bounceIn(craft); if (tone.animate) tone.animate([{ rotate: (Math.random() < .5 ? -4 : 4) + 'deg' }, { rotate: '0deg' }], { duration: 1000, easing: EL }) }
  }
  var auto = !reduce, autoT, heroOn = true;
  function stopAuto() { auto = false; clearTimeout(autoT) }
  function tickAuto() { clearTimeout(autoT); if (auto) autoT = setTimeout(function () { if (heroOn && !document.hidden) setLook((cur + 1) % LOOKS.length); tickAuto() }, 4600) }
  picker.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) { stopAuto(); setLook(+b.dataset.i) } });
  picker.addEventListener('keydown', function (e) {
    var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    stopAuto(); var n = (cur + k + LOOKS.length) % LOOKS.length; setLook(n); tabs[n].focus(); e.preventDefault();
  });
  new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting }).observe($('.hero'));

  /* ---------- bands ---------- */
  var PHR = ['Handloom', 'Hand-knitted', 'Made in villages', 'Ab aap bhi Pradhan ji', 'Dekh raha hai Binod'];
  $$('.band .track').forEach(function (t, k) { var s = (k ? PHR.slice().reverse() : PHR).map(function (p) { return '<span>' + p + '</span><i>✺</i>' }).join(''); t.innerHTML = s + s });

  /* ---------- villages ---------- */
  var VIL = [
    ['01', 'Kullu', 'A women’s collective hand-knits the wool for Pradhan ji’s half sweater.', 'pradhan-half-sweater'],
    ['02', 'Pochampally', 'Sachiv ji’s checks come off handlooms in Telangana, one shuttle at a time.', 'sachiv-check-shirt'],
    ['03', 'Bhagalpur', 'Prahlad Cha’s fine-stripe cotton, with every seam finished by hand.', 'prahlad-cotton-kurta'],
    ['04', 'Bengal', 'Artisan families hand-spin and hand-weave the khadi for the khadi kurta.', 'handloom-khadi-kurta']
  ];
  $('.cards').innerHTML = VIL.map(function (v) {
    var d = byId(v[3]);
    return '<article class="card"><span class="n">' + v[0] + ' · Village</span><h3>' + v[1] + '</h3><p>' + esc(v[2]) + '</p>' +
      (d ? '<a href="product.html?id=' + d.id + '"><img src="assets/img/' + d.img + '.webp" alt="" loading="lazy">' + esc(d.name) + '</a>' : '') + '</article>';
  }).join('');
  var cards = $$('.card').map(function (c) { return { el: c, x0: Math.random() * 40 - 20, x1: Math.random() * 40 - 20, r0: Math.random() * 10 - 5, r1: Math.random() * 6 - 3 } });

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

  /* ---------- quotes ---------- */
  var QUOTES = [['Dekh raha hai Binod?', 'Bhushan, Phulera'], ['Ab aap bhi Pradhan ji', 'Pradhan by Panchayat'], ['Pradhan poore gaon ko saath le ke chalta hai', 'Why the brand is called Pradhan']];
  var q = $('.q'), who = $('.who'), qnav = $('.qnav'), qi = -1, qT, qOn = false;
  qnav.innerHTML = QUOTES.map(function (_, i) { return '<button type="button" aria-pressed="false" aria-label="Quote ' + (i + 1) + '">' + (i + 1) + '</button>' }).join('');
  function setQuote(i, show) { qi = i; split(q, QUOTES[i][0]); who.textContent = QUOTES[i][1]; $$('button', qnav).forEach(function (b, k) { b.setAttribute('aria-pressed', k === i) }); if (show) pop(q) }
  function nextQuote() { clearTimeout(qT); qT = setTimeout(function () { if (qOn && !document.hidden) setQuote((qi + 1) % QUOTES.length, true); nextQuote() }, 5200) }
  qnav.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { setQuote($$('button', qnav).indexOf(b), true); nextQuote() } });
  setQuote(0, false);
  new IntersectionObserver(function (es) { var was = qOn; qOn = es[0].isIntersecting; if (qOn && !was) { pop(q); if (!reduce) nextQuote() } }, { threshold: .4 }).observe($('.quotes'));

  /* ---------- footer word ---------- */
  var giant = $('.giant'); split(giant, 'Phulera'); seen.observe(giant);
  giant.addEventListener('pointerover', function (e) { var l = e.target.closest('.l'); if (l) flash(l, 0) });

  /* ---------- one frame loop for scroll and pointer ---------- */
  var stage = $('.stage'), decos = $$('.stage .sticker, .stage .deco'), pars = $$('[data-par]'), village = $('.village'), arch = $('.arch');
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
      stage.style.transform = 'translate3d(0,' + (hp * 14).toFixed(2) + 'vh,0) rotate(' + (hp * -5).toFixed(2) + 'deg) scale(' + (1 - hp * .1).toFixed(3) + ')';
      stage.style.translate = (sx * 18).toFixed(1) + 'px ' + (sy * 12).toFixed(1) + 'px';
      word.style.translate = (sx * -26).toFixed(1) + 'px ' + (hp * -14).toFixed(2) + 'vh';
      decos.forEach(function (d, k) {   // stickers float with the pointer and fly off to the sides as you scroll (Mana's step3 .gauche / .droite)
        var dir = d.offsetLeft < stage.offsetWidth / 2 ? -1 : 1, dep = 14 + k * 7;
        d.style.translate = (sx * dep + dir * hp * 38 * innerWidth / 100).toFixed(1) + 'px ' + (sy * dep - hp * 24 * vh / 100).toFixed(1) + 'px';
        d.style.rotate = (dir * hp * 28).toFixed(1) + 'deg';
      });
    }
    var vr = village.getBoundingClientRect();
    if (vr.top < vh * 1.4 && vr.bottom > 0) {
      arch.style.transform = 'scaleY(' + clamp((vh - vr.top) / (vh * .8), 0, 1).toFixed(3) + ')';
      cards.forEach(function (c) {
        var r = c.el.getBoundingClientRect(), p = clamp((vh - r.top) / (vh * .9), 0, 1);
        c.el.style.transform = 'translate3d(' + (c.x0 + (c.x1 - c.x0) * p).toFixed(1) + 'px,' + ((1 - p) * 40).toFixed(1) + '%,0) rotate(' + (c.r0 + (c.r1 - c.r0) * p).toFixed(2) + 'deg)';
      });
    }
    pars.forEach(function (d) { var r = d.parentNode.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh) d.style.translate = '0 ' + ((r.top + r.height / 2 - vh / 2) * +d.dataset.par).toFixed(1) + 'px' });
    var or = office.getBoundingClientRect();
    if (or.top < vh && or.bottom > 0) {
      var p = clamp(-or.top / (or.height - vh), 0, 1);
      ring.style.transform = 'translate3d(0,' + (vh * .8 + R).toFixed(0) + 'px,0) rotate(' + (28 - p * 250).toFixed(2) + 'deg)';
    }
  }
  addEventListener('scroll', want, { passive: true });
  addEventListener('resize', function () { layoutRing(); if (cur >= 0) movePill(tabs[cur]); want() });
  $('.hero').addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; want() });

  /* ---------- go ---------- */
  layoutRing(); setLook(0, true); want();
  (document.fonts && document.fonts.ready || Promise.resolve()).then(function () {
    movePill(tabs[cur]);
    requestAnimationFrame(function () {
      body.classList.add('ready'); pop(word);
      $$('[data-pop]').forEach(function (el) { if (el !== word) seen.observe(el) });
      tickAuto();
    });
  });
})();
