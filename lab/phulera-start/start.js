/* Phulera Starter. Motion follows Mana Yerba Mate's own code (read with the Awwwards MCP's bundle tool):
   letters pop with an elastic scale and flash through the palette 70 ms a colour; the look picker slides a pill and
   swaps the portrait through three growing circles with a springy settle;
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

  /* ---------- hero: pick a Phulera look ---------- */
  var LOOKS = [
    { who: 'Pradhan ji', pid: 'pradhan-half-sweater', img: 'p-half-sweater', tone: '#f0c14b' },
    { who: 'Sachiv ji', pid: 'sachiv-check-shirt', img: 'p-check-shirt', tone: '#9cc3e3' },
    { who: 'Prahlad Cha', pid: 'prahlad-cotton-kurta', img: 'p-cotton-kurta', tone: '#c3cd8a' },
    { who: 'Vikas', pid: 'vikas-everyday-tee', img: 'p-vikas-tee', tone: '#f3a58c' }
  ];
  LOOKS.forEach(function (L) { var im = new Image(); im.src = 'assets/img/' + L.img + '.webp' });   // warm the cache so swaps never wait
  var picker = $('.picker'), pill = $('.pill'), word = $('.word'), svg = $('.portrait'), defs = $('defs', svg), layers = $('.layers', svg);
  var price = $('.price'), look = $('.look'), frame = $('.frame'), tone = $('.tone'), cur = -1, cpN = 0;
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
    $('.nm', look).textContent = d ? d.name : L.who; $('.go', look).href = href;
    if (!instant) { bounceIn(price); if (tone.animate) tone.animate([{ rotate: (Math.random() < .5 ? -4 : 4) + 'deg' }, { rotate: '0deg' }], { duration: 1000, easing: EL }) }
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
  var stage = $('.stage'), decos = $$('.stage .sticker');
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
