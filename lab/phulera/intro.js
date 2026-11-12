/* Pradhan opening: a walk through Phulera. At each stop the fluid peels the real scene away and shows the shop inside it:
   the Panchayat almirah full of kurtas, clothes laid out on the tanki, the slogan wall repainted, the lauki turned into a gift.
   No WebGL and no libraries, so it stays smooth on budget phones. A small fluid-like field runs on the CPU, gets traced into a
   crisp outline (marching squares), and that outline clips a pre-scaled image on a 2D canvas. Stops load one at a time. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('intro-on')) return;
  var intro = document.getElementById('intro');
  var cvA = document.getElementById('intro-a');
  var cv = document.getElementById('intro-canvas');
  var ctx = cv && cv.getContext && cv.getContext('2d');
  var ctxA = cvA && cvA.getContext && cvA.getContext('2d');
  var hidden = [];

  function setSiteInert(on) {
    if (on) {
      [].forEach.call(document.body.children, function (el) {
        if (el !== intro && el.tagName !== 'SCRIPT' && !el.inert) { el.inert = true; hidden.push(el); }
      });
    } else { hidden.forEach(function (el) { el.inert = false; }); hidden = []; }
  }
  function removeIntro() {
    setSiteInert(false);
    html.classList.remove('intro-on', 'intro-lock');
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
  }
  if (!intro || !ctx || !ctxA || !window.Path2D) { removeIntro(); return; }
  setSiteInert(true);

  /* ---------- The stops. Hotspots are [x, y, rx, ry] as shares of the plate, one set for wide screens and one for tall ones. ---------- */
  var STOPS = [
    { n: '1', label: 'Almirah', tone: 'light', type: 'cut', thread: 'rgba(139,58,30,.9)', g: 0,
      L: 'Files <b>nahi,</b>', L2: 'kurte <b>hain.</b>', side: 'l',
      line: 'The Panchayat office almirah. Open it and pick a kurta.',
      hint: ['Dekh raha hai, Binod? Click the almirah', 'Dekh raha hai, Binod? Tap the almirah'],
      door: [0.2952, 0.1655, 0.3966, 0.7114],
      picks: [
        { f: [0.3002, 0.1991, 0.1436, 0.5749], pid: 'handloom-khadi-kurta' },
        { f: [0.3052, 0.1957, 0.1817, 0.5828], pid: 'neel-handloom-kurta' },
        { f: [0.3484, 0.198, 0.1817, 0.5962], pid: 'prahlad-cotton-kurta' },
        { f: [0.3936, 0.1991, 0.1797, 0.5928], pid: 'safed-cotton-kurta' },
        { f: [0.4367, 0.2058, 0.1817, 0.604], pid: 'mitti-khadi-kurta' },
        { f: [0.4819, 0.2069, 0.2098, 0.6152], pid: 'mehendi-cotton-kurta' },
        { f: [0.5241, 0.2036, 0.1687, 0.5928], pid: 'jute-stripe-kurta' }
      ],
      shop: ['Shop kurtas', 'shop.html?c=kurtas', 'kurtas'],
      floor: 0.894,
      fit: { w: { h: .84, ax: .5, cx: .66, by: .955 }, p: { h: .5, ax: .5, cx: .5, by: .74 } },
      hot: [
        { w: [0.497, 0.5168, 0.1988, 0.3758], tag: 'In the almirah', pid: 'handloom-khadi-kurta' }
      ] },
    { n: '2', label: 'Tanki', tone: 'light', type: 'cut', thread: 'rgba(139,58,30,.9)', g: .12,
      L: 'Kapde <b>tanki</b>', L2: 'pe <b>sukh rahe.</b>', side: 'l',
      line: 'Where Sachiv ji and Rinki had their chai. The washing came later.',
      hint: ['Hover over the tanki', 'Touch the tanki'],
      shop: ['Shop shirts', 'shop.html?c=shirts', 'shirts'],
      fit: { w: { h: .9, ax: 1, cx: 1.01, by: 1.0 }, p: { h: .6, ax: .5, cx: .5, by: .82 } },
      hot: [
        { w: [.5124, .1735, .1242, .0972], tag: 'On the tanki', pid: 'sachiv-check-shirt' },
        { w: [.8075, .1249, .1615, .0833], tag: 'On the line', pid: 'prahlad-cotton-kurta' },
        { w: [.1988, .5692, .1429, .1596], tag: 'Sachiv ji is wearing', pid: 'sachiv-check-shirt' },
        { w: [.4534, .5969, .1118, .1388], tag: 'Pradhan ji is wearing', pid: 'pradhan-linen-shirt' }
      ] },
    { n: '3', label: 'Deewar', tone: 'light', type: 'cut', thread: 'rgba(246,239,226,.95)', g: .2, streak: 1,
      L: 'Do <b>kurte,</b>', L2: 'meethi <b>kheer.</b>', side: 'l',
      line: '<span lang="hi">दो कुर्ते हैं मीठी खीर, उससे ज़्यादा अमीर।</span> Two kurtas are sweet kheer. Any more and you’re rich.',
      hint: ['Hover over the wall', 'Touch the wall'],
      shop: ['Pick your two', 'shop.html?c=kurtas', 'kurtas'],
      fit: { w: { h: .66, ax: 1, cx: 1.09, by: .87 }, p: { h: .44, ax: .7, cx: .5, by: .74 } },
      hot: [
        { w: [.7403, .6597, .2251, .25], tag: 'Fresh on the wall', pid: 'prahlad-cotton-kurta' },
        { w: [.1342, .5278, .1299, .2917], tag: 'Sachiv ji is wearing', pid: 'sachiv-check-shirt' }
      ] },
    { n: '4', label: 'Lauki', tone: 'dark', thread: 'rgba(255,205,140,.95)', g: 0,
      L: 'Lauki <b>nahi,</b>', L2: 'gift <b>do.</b>', side: 'l',
      line: 'Bijli gayi. Pradhan ji gifts lauki. You can do one better.',
      hint: ['Hover over the lauki', 'Touch the lauki'],
      shop: ['Shop gift sets', 'shop.html?c=gifts', 'gifts'],
      focus: { w: [.85, .5], p: [.95, 0] },
      hot: [
        { w: [.8984, .5642, .1611, .2257], p: [.7326, .4188, .4242, .1675], tag: 'Instead of a lauki', pid: 'pradhan-gift-box' },
        { w: [.9204, .2431, .0732, .191], p: [.7905, .1804, .1928, .1418], tag: 'By the emergency light', pid: 'phulera-gamchha-stole' }
      ] },
    { n: '5', label: 'Pradhan ji', tone: 'light', type: 'portrait', thread: 'rgba(139,58,30,.85)', g: 0,
      L: 'Every', L2: '<b>Thread</b>', R: 'has a', R2: '<b>Village.</b>', side: 'both',
      line: 'Aviators off. Half sweater on.',
      hint: ['Hover over Pradhan ji’s face', 'Touch Pradhan ji’s face'],
      shop: ['Shop the Office Edit', 'shop.html?edit=Pradhan%20Office%20Edit', ''],
      wear: { a: 'pradhan-linen-shirt', b: 'pradhan-half-sweater' },
      hot: [{ tag: 'Pradhan ji is wearing', pid: 'pradhan-linen-shirt' }] }
  ];

  var IMG = 'assets/img/op/', PAPER = '#f6efe2', BRICK = '#8b3a1e';
  var low = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 3);
  var THRESH = 0.5, PAD = 24, PORT_RATIO = 1700 / 1460, EYE_Y = 520 / 1460;
  var vw, vh, dpr, cell, nx, ny, ox, oy, rBrush, tall;
  var F, F2, U, V, N, G, Dist, nextEdge, seen, ex, ey, sinI, sinJ, streak;
  var maxF = 0, cur = 0, path = null, dirty = true, offB = null, offN = null;
  var bx0 = 0, by0 = 0, bx1 = 0, by1 = 0, pbx0 = 0, pby0 = 0, pbx1 = 0, pby1 = 0, hasPrev = false;
  var raf = 0, last = 0, px = null, py = null, ptrInside = false, ptrSeen = false, acted = false, lastInput = 0;
  var ghostStart = 0, ghostHot = null, nextGhost = 0, isTouch = matchMedia('(hover: none)').matches;
  var hots = [], hotNow = -1, holdHot = -1, hold = 0, sticky = 0, stuck = -1, pinShown = false;
  var pxT = 0, pyT = 0, pxC = 0, pyC = 0, wearState = 'a';
  var tr = null, opening = false, busy = false, sampled = 0, slowFrames = 0, idleTimer = 0, autoTimer = 0, fgxLast = 0, fgyLast = 0;
  var geo = null, contoursImg = null;

  var $ = function (s) { return intro.querySelector(s); };
  var figure = $('.intro-figure'), elL = $('.intro-line.l'), elR = $('.intro-line.r'), elLine = $('.intro-ref'), elShop = $('.intro-shop'), elCount = $('.intro-count');
  var elNext = $('.intro-next'), elWear = $('.intro-wear'), elPin = $('.intro-pin'), elHint = $('.intro-hint'), elCap = $('.intro-caption');
  var routeBtns = [].slice.call(intro.querySelectorAll('.intro-route button')), elProg = $('.intro-thread .p');

  function smoothstep(t) { return t * t * (3 - 2 * t); }
  function isPort(st) { return st.type === 'portrait'; }
  function isCut(st) { return st.type === 'cut'; }
  function variant() { return vw / vh < 0.85 ? 'p' : (Math.max(vw, vh) * (window.devicePixelRatio || 1) > 1300 ? 'w' : 'm'); }

  /* ---------- Image loading, one stop at a time ---------- */
  function load(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(function () { res(im); }); };
      im.onerror = rej;
      im.src = src;
    });
  }
  function ensure(i) {
    var st = STOPS[i], v = isPort(st) ? (innerWidth <= 900 ? '-sm' : '') : variant();
    if (st.ready && st.v === v) return st.ready;
    st.v = v;
    var want = isPort(st)
      ? [load('assets/img/intro-a' + v + '.webp'), load('assets/img/intro-b' + v + '.webp'), load('assets/img/intro-contours.svg')]
      : isCut(st) ? [load(IMG + st.n + 'a-' + (v === 'w' ? 'w' : 'm') + '.webp'), load(IMG + st.n + 'b-' + (v === 'w' ? 'w' : 'm') + '.webp'), load('assets/img/intro-contours.svg')]
      : [load(IMG + st.n + 'a-' + v + '.webp'), load(IMG + st.n + 'b-' + v + '.webp')];
    st.ready = Promise.all(want).then(function (r) { st.a = r[0]; st.b = r[1]; if (r[2]) contoursImg = r[2]; });
    st.ready.catch(function () { st.ready = null; });
    return st.ready;
  }

  /* ---------- Layout ---------- */
  function fitPlate(st) {
    if (isCut(st)) {       /* a cutout: sized by screen height, one point of it pinned to a point on screen */
      var f = st.fit[tall ? 'p' : 'w'], ch = vh * f.h, cw = ch * st.a.naturalWidth / st.a.naturalHeight;
      return { x: vw * f.cx - cw * f.ax, y: vh * f.by - ch, w: cw, h: ch };
    }
    var w = st.a.naturalWidth, h = st.a.naturalHeight, s = Math.max(vw / w, vh / h);
    var fo = st.focus[tall ? 'p' : 'w'];
    return { x: (vw - w * s) * fo[0], y: (vh - h * s) * fo[1], w: w * s, h: h * s };
  }
  function fitPortrait() {
    var pW, pH, pX, pY;
    if (tall) {                    /* phones: head fills the width, figure anchored above the caption */
      var line = $('.intro-line.r'), textBottom = line && line.offsetHeight ? line.getBoundingClientRect().bottom : 170;
      pH = Math.min(vw * 2.02 / PORT_RATIO, (vh - textBottom - 14) / 0.88);
      pW = pH * PORT_RATIO; pY = vh - pH * 0.95;
    } else { pH = vh * 1.2; pW = pH * PORT_RATIO; pY = vh * 0.015; }
    pX = (vw - pW) / 2 + (tall ? pW * 0.03 : 0);
    var eyeX = pX + pW / 2, eyeY = pY + pH * EYE_Y, headW = pW * 0.36, headH = pH * 0.46;
    return { x: pX, y: pY, w: pW, h: pH, eyeX: eyeX, eyeY: eyeY, headW: headW, headH: headH,
      headCx: eyeX - pW * 0.0135, headCy: eyeY - pH * 0.053, headR: pW * 0.3 };
  }
  function drawStop(c, st, which) {
    c.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    c.imageSmoothingQuality = 'high';
    if (isPort(st) || isCut(st)) {
      var f = isCut(st) ? fitPlate(st) : fitPortrait();
      c.fillStyle = PAPER; c.fillRect(-PAD, -PAD, vw + PAD * 2, vh + PAD * 2);
      if (contoursImg) {
        var cw = contoursImg.naturalWidth || 1600, ch = contoursImg.naturalHeight || 1000, cs = Math.max((vw + PAD * 2) / cw, (vh + PAD * 2) / ch);
        c.drawImage(contoursImg, (vw - cw * cs) / 2, (vh - ch * cs) / 2, cw * cs, ch * cs);
      }
      if (st.floor) {      /* a studio floor, so the object stands on something */
        var fy = f.y + f.h * st.floor;
        c.fillStyle = '#eadfc8'; c.fillRect(-PAD, fy, vw + PAD * 2, vh + PAD - fy);
        c.fillStyle = 'rgba(58,38,24,.13)'; c.fillRect(-PAD, fy, vw + PAD * 2, 1);
        var sx = f.x + f.w * 0.542, sy = f.y + f.h * 0.9315, sr = f.w * 0.42;
        c.save(); c.translate(sx, sy); c.scale(1, 0.085);
        var sg = c.createRadialGradient(0, 0, 0, 0, 0, sr); sg.addColorStop(0, 'rgba(40,24,12,.5)'); sg.addColorStop(0.55, 'rgba(40,24,12,.2)'); sg.addColorStop(1, 'rgba(40,24,12,0)');
        c.fillStyle = sg; c.beginPath(); c.arc(0, 0, sr, 0, 6.2832); c.fill(); c.restore();
      }
      c.drawImage(which === 'a' ? st.a : st.b, f.x, f.y, f.w, f.h);
    } else {
      var g = fitPlate(st);
      c.drawImage(which === 'a' ? st.a : st.b, g.x, g.y, g.w, g.h);
    }
  }
  function offscreen(st, which) {
    var c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height;
    drawStop(c.getContext('2d'), st, which);
    return c;
  }
  /* The next stop's scaled images are made ahead of time, so moving to it never stalls. Only one spare set is kept. */
  var prep = null, nextB = null;
  function prepare(i) {
    var key = cv.width + 'x' + cv.height;
    if (prep && prep.i === i && prep.key === key) return prep;
    prep = { i: i, key: key, a: offscreen(STOPS[i], 'a'), b: offscreen(STOPS[i], 'b') };
    return prep;
  }
  function layoutHots() {
    var st = STOPS[cur]; hots = [];
    if (isPort(st)) {
      var f = fitPortrait(); geo = f;
      hots.push({ cx: f.eyeX, cy: f.eyeY + f.headH * 0.02, rx: f.headW * 0.62, ry: f.headH * 0.62, gx: f.headCx, gy: f.headCy, grx: f.headR, gry: f.headR, d: st.hot[0] });
    } else {
      var g = fitPlate(st), key = tall ? 'p' : 'w';
      st.hot.forEach(function (h) {
        var a = h[key] || (isCut(st) ? h.w : null); if (!a) return;
        var o = { cx: g.x + a[0] * g.w, cy: g.y + a[1] * g.h, rx: a[2] * g.w, ry: a[3] * g.h, d: h };
        o.gx = o.cx; o.gy = o.cy; o.grx = o.rx * 1.12; o.gry = o.ry * 1.12;
        if (o.cx + o.rx > 0 && o.cx - o.rx < vw) hots.push(o);
      });
    }
    placePin();
  }
  function layout() {
    vw = intro.clientWidth; vh = intro.clientHeight; tall = vw / vh < 0.85;
    dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
    cv.width = cvA.width = Math.round((vw + PAD * 2) * dpr); cv.height = cvA.height = Math.round((vh + PAD * 2) * dpr);
    cell = low ? 14 : (vw > 900 ? 9 : 8);
    ox = -PAD - cell; oy = -PAD - cell;
    nx = Math.ceil((vw + PAD * 2) / cell) + 3; ny = Math.ceil((vh + PAD * 2) / cell) + 3;
    var n = nx * ny;
    F = new Float32Array(n); F2 = new Float32Array(n); U = new Float32Array(n); V = new Float32Array(n);
    N = new Float32Array(n); G = new Float32Array(n); Dist = new Float32Array(n);
    nextEdge = new Int32Array(n * 2); seen = new Uint8Array(n * 2); ex = new Float32Array(n * 2); ey = new Float32Array(n * 2);
    sinI = new Float32Array(nx); sinJ = new Float32Array(ny); streak = new Float32Array(nx);
    /* Static low-frequency noise makes the reveal edge organic instead of round. */
    var s = 9 / cell;
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var a = i / s, b = j / s;
      N[j * nx + i] = 0.1 * Math.sin(a * 0.21 + 1.3) * Math.cos(b * 0.17 + 0.4) + 0.07 * Math.sin((a + b) * 0.09 + 2) + 0.05 * Math.sin(a * 0.47 - b * 0.31);
    }
    /* Drips: some columns run faster than others. */
    for (i = 0; i < nx; i++) {
      var q = 0.5 + 0.5 * Math.sin(i * 0.53 + 1.1) * Math.sin(i * 0.17 + 0.3);
      streak[i] = q * q * q;
    }
    rBrush = Math.max(58, Math.min(vw, vh) * (tall ? 0.15 : 0.125));
    maxF = 0; path = null; dirty = true; hasPrev = false;
    var st = STOPS[cur];
    if (st.a) {
      drawStop(ctxA, st, 'a');
      offB = offscreen(st, 'b');
      layoutHots();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    placeDoor(); if (doorOpen && cur === 0 && offB) showOpen();
  }

  /* ---------- Fluid ---------- */
  function splat(x, y, r, amt, vx, vy) {
    var cx = (x - ox) / cell, cy = (y - oy) / cell, rc = r / cell, R = rc * 1.7;
    var i0 = Math.max(1, (cx - R) | 0), i1 = Math.min(nx - 2, (cx + R + 1) | 0);
    var j0 = Math.max(1, (cy - R) | 0), j1 = Math.min(ny - 2, (cy + R + 1) | 0);
    var inv = 1 / (rc * rc);
    for (var j = j0; j <= j1; j++) {
      var k = j * nx + i0;
      for (var i = i0; i <= i1; i++, k++) {
        var dx = i - cx, dy = j - cy, w = Math.exp(-(dx * dx + dy * dy) * inv);
        var v = amt * w; if (v > F[k]) F[k] = v;
        U[k] += vx * w; V[k] += vy * w;
      }
    }
    if (amt > maxF) maxF = amt;
  }
  function splatE(x, y, rx, ry, amt) {
    var cx = (x - ox) / cell, cy = (y - oy) / cell, ax = Math.max(rx / cell, 0.5), ay = Math.max(ry / cell, 0.5);
    var i0 = Math.max(1, (cx - ax * 1.6) | 0), i1 = Math.min(nx - 2, (cx + ax * 1.6 + 1) | 0);
    var j0 = Math.max(1, (cy - ay * 1.6) | 0), j1 = Math.min(ny - 2, (cy + ay * 1.6 + 1) | 0);
    var ix = 1 / (ax * ax), iy = 1 / (ay * ay);
    for (var j = j0; j <= j1; j++) {
      var k = j * nx + i0, dy = j - cy, qy = dy * dy * iy;
      for (var i = i0; i <= i1; i++, k++) {
        var dx = i - cx, v = amt * Math.exp(-(dx * dx * ix + qy));
        if (v > F[k]) F[k] = v;
      }
    }
    if (amt > maxF) maxF = amt;
  }
  function paint(x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, d = Math.sqrt(dx * dx + dy * dy), r = rBrush;
    var steps = Math.min(10, Math.max(1, Math.ceil(d / (r * 0.4))));
    var vx = (dx / cell) * 0.1 / steps, vy = (dy / cell) * 0.1 / steps;
    for (var s = 1; s <= steps; s++) splat(x0 + dx * s / steps, y0 + dy * s / steps, r, 1.6, vx, vy);
  }

  /* One step: semi-Lagrangian advection, slow swirl, an optional downward run, fade back to the real scene. */
  function step(f, now) {
    if (maxF <= 0) return;
    var st = STOPS[cur], gr = st.g * f;
    var decay = Math.pow(0.985, f), vd = Math.pow(0.9, f), t = now * 0.0007, i, j, k, peak = 0;
    for (i = 0; i < nx; i++) sinI[i] = Math.sin(i * 0.16 * cell / 9 + t) * 0.2 * f + gr * (st.streak ? 0.15 + 2.4 * streak[i] : 1 + 1.4 * streak[i]);
    for (j = 0; j < ny; j++) sinJ[j] = Math.sin(j * 0.19 * cell / 9 - t * 0.8) * 0.2 * f;
    var maxX = nx - 1.001, maxY = ny - 1.001;
    for (j = 1; j < ny - 1; j++) {
      k = j * nx + 1;
      for (i = 1; i < nx - 1; i++, k++) {
        var x = i - U[k] * f - sinJ[j], y = j - V[k] * f - sinI[i];
        if (x < 0) x = 0; else if (x > maxX) x = maxX;
        if (y < 0) y = 0; else if (y > maxY) y = maxY;
        var x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, m = y0 * nx + x0;
        var v = ((F[m] * (1 - fx) + F[m + 1] * fx) * (1 - fy) + (F[m + nx] * (1 - fx) + F[m + nx + 1] * fx) * fy) * decay;
        if (v < 0.004) v = 0;
        F2[k] = v; if (v > peak) peak = v;
        U[k] *= vd; V[k] *= vd;
      }
    }
    var tmp = F; F = F2; F2 = tmp; maxF = peak; dirty = true;
  }

  /* Marching squares on G into closed, consistently wound loops. Edge ids: 2k = top of cell k, 2k+1 = left of cell k. */
  function march() {
    var i, j, k;
    for (i = 0; i < nx; i++) { G[i] = 0; G[(ny - 1) * nx + i] = 0; }
    for (j = 0; j < ny; j++) { G[j * nx] = 0; G[j * nx + nx - 1] = 0; }
    nextEdge.fill(-1); seen.fill(0);
    function hp(id, a, b, x, y) { var t = (THRESH - a) / (b - a); ex[id] = ox + (x + t) * cell; ey[id] = oy + y * cell; }
    function vp(id, a, b, x, y) { var t = (THRESH - a) / (b - a); ex[id] = ox + x * cell; ey[id] = oy + (y + t) * cell; }
    var any = false, i0 = nx, i1 = 0, j0 = ny, j1 = 0;
    for (j = 0; j < ny - 1; j++) {
      for (i = 0; i < nx - 1; i++) {
        k = j * nx + i;
        var a = G[k], b = G[k + 1], c = G[k + nx + 1], d = G[k + nx];
        var cs = (a > THRESH ? 1 : 0) | (b > THRESH ? 2 : 0) | (c > THRESH ? 4 : 0) | (d > THRESH ? 8 : 0);
        if (cs === 0 || cs === 15) continue;
        any = true;
        if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j;
        var T = 2 * k, L = 2 * k + 1, B = 2 * (k + nx), R = 2 * (k + 1) + 1;
        if ((a > THRESH) !== (b > THRESH)) hp(T, a, b, i, j);
        if ((d > THRESH) !== (c > THRESH)) hp(B, d, c, i, j + 1);
        if ((a > THRESH) !== (d > THRESH)) vp(L, a, d, i, j);
        if ((b > THRESH) !== (c > THRESH)) vp(R, b, c, i + 1, j);
        switch (cs) {
          case 1: nextEdge[L] = T; break;  case 2: nextEdge[T] = R; break;
          case 3: nextEdge[L] = R; break;  case 4: nextEdge[R] = B; break;
          case 5: nextEdge[L] = T; nextEdge[R] = B; break;
          case 6: nextEdge[T] = B; break;  case 7: nextEdge[L] = B; break;
          case 8: nextEdge[B] = L; break;  case 9: nextEdge[B] = T; break;
          case 10: nextEdge[T] = R; nextEdge[B] = L; break;
          case 11: nextEdge[B] = R; break; case 12: nextEdge[R] = L; break;
          case 13: nextEdge[R] = T; break; case 14: nextEdge[T] = L; break;
        }
      }
    }
    if (!any) return null;
    /* Device-pixel box around the outline, so each frame copies only what it needs. */
    var m0 = cell + 4;
    bx0 = Math.max(0, Math.floor((ox + i0 * cell - m0 + PAD) * dpr)); by0 = Math.max(0, Math.floor((oy + j0 * cell - m0 + PAD) * dpr));
    bx1 = Math.min(cv.width, Math.ceil((ox + (i1 + 1) * cell + m0 + PAD) * dpr)); by1 = Math.min(cv.height, Math.ceil((oy + (j1 + 1) * cell + m0 + PAD) * dpr));
    var p = new Path2D(), m = nextEdge.length;
    for (var id = 0; id < m; id++) {
      if (nextEdge[id] < 0 || seen[id]) continue;
      var e = id, nx0 = nextEdge[e], sx = (ex[e] + ex[nx0]) / 2, sy = (ey[e] + ey[nx0]) / 2, guard = 0;
      p.moveTo(sx, sy);
      do {
        seen[e] = 1;
        var nn = nextEdge[e];
        if (nn < 0) break;
        var nn2 = nextEdge[nn];
        if (nn2 < 0) break;
        p.quadraticCurveTo(ex[nn], ey[nn], (ex[nn] + ex[nn2]) / 2, (ey[nn] + ey[nn2]) / 2);
        e = nn;
      } while (e !== id && !seen[e] && ++guard < 20000);
      p.closePath();
    }
    return p;
  }
  function trace() {
    if (maxF + 0.3 < THRESH) { path = null; return; }
    for (var k = 0, n = nx * ny; k < n; k++) G[k] = F[k] > 0.004 ? F[k] + N[k] : 0;
    path = march();
  }

  function clearPrev() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (hasPrev) ctx.clearRect(pbx0, pby0, pbx1 - pbx0, pby1 - pby0);
    hasPrev = false;
  }
  function remember() { pbx0 = bx0; pby0 = by0; pbx1 = bx1; pby1 = by1; hasPrev = true; }
  function strokeThread(p, color) {
    ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    if (!low) { ctx.strokeStyle = 'rgba(58,38,24,.14)'; ctx.lineWidth = 5; ctx.stroke(p); }
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.stroke(p);   /* the thread */
  }
  function draw() {
    clearPrev();
    if (!path || !offB) return;
    var bw = bx1 - bx0, bh = by1 - by0;
    if (bw <= 0 || bh <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    ctx.save(); ctx.clip(path, 'evenodd');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(offB, bx0, by0, bw, bh, bx0, by0, bw, bh);
    ctx.restore();
    strokeThread(path, STOPS[cur].thread);
    remember();
  }

  /* ---------- A liquid edge that sweeps the whole screen: to the next stop, or into the store ---------- */
  function floodTo(R, soft, t) {
    var i, j, k = 0, amp = 1.7;
    for (i = 0; i < nx; i++) sinI[i] = 0.10 * Math.sin(i * 0.31 * cell / 9 + t * 2.1);
    for (j = 0; j < ny; j++) sinJ[j] = 0.10 * Math.sin(j * 0.27 * cell / 9 - t * 1.7);
    for (j = 0; j < ny; j++) for (i = 0; i < nx; i++, k++) G[k] = 0.5 + (R - Dist[k]) / soft + (N[k] * amp + sinI[i] + sinJ[j]);
  }
  /* ---------- The almirah: a click swings the doors open, then each kurta can be picked ---------- */
  var alm = null, picksEl = null, pickImgs = [], doorOpen = false, doorBusy = false, pickNow = -1;
  function buildDoor() {
    if (alm) return;
    alm = document.createElement('div'); alm.className = 'intro-alm';
    alm.innerHTML = '<div class="d l"><img src="' + IMG + '1dl.webp" alt=""><i></i></div><div class="d r"><img src="' + IMG + '1dr.webp" alt=""><i></i></div>';
    picksEl = document.createElement('div'); picksEl.className = 'intro-picks'; picksEl.innerHTML = '<div class="dim"></div>';
    STOPS[0].picks.forEach(function (p, i) {
      var im = new Image(); im.alt = '';
      im.onload = function () {      /* keep the piece's own outline for exact hit tests */
        try { var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.drawImage(im, 0, 0); p.a = x.getImageData(0, 0, c.width, c.height).data; p.aw = c.width; p.ah = c.height; } catch (e) {}
      };
      im.src = IMG + '1k' + i + '.webp';
      picksEl.appendChild(im); pickImgs.push(im);
    });
    figure.appendChild(alm); figure.appendChild(picksEl);
  }
  function placeDoor() {
    if (!alm) return;
    var st = STOPS[0], on = cur === 0 && st.a && !tr;
    picksEl.style.display = on && doorOpen ? 'block' : 'none';
    if (!on) { alm.style.display = 'none'; return; }
    var g = fitPlate(st), d = st.door;
    var dm = picksEl.firstChild.style; dm.left = (g.x + d[0] * g.w) + 'px'; dm.top = (g.y + d[1] * g.h) + 'px'; dm.width = (d[2] * g.w) + 'px'; dm.height = (d[3] * g.h) + 'px';
    alm.style.left = (g.x + d[0] * g.w) + 'px'; alm.style.top = (g.y + d[1] * g.h) + 'px'; alm.style.width = (d[2] * g.w) + 'px'; alm.style.height = (d[3] * g.h) + 'px';
    st.picks.forEach(function (p, i) {
      p.x = g.x + p.f[0] * g.w; p.y = g.y + p.f[1] * g.h; p.w = p.f[2] * g.w; p.h = p.f[3] * g.h;
      var im = pickImgs[i].style; im.left = p.x + 'px'; im.top = p.y + 'px'; im.width = p.w + 'px'; im.height = p.h + 'px';
    });
  }
  function showOpen() {       /* the open almirah, drawn whole on the top canvas */
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(offB, 0, 0);
    pbx0 = 0; pby0 = 0; pbx1 = cv.width; pby1 = cv.height; hasPrev = true;
  }
  function openDoor() {
    if (doorOpen || doorBusy || cur !== 0 || busy || opening || !offB) return;
    buildDoor(); doorBusy = true; acted = true; clearTimeout(autoTimer); showPin(false);
    placeDoor();
    alm.classList.remove('open'); alm.style.opacity = '1'; alm.style.display = 'block';
    cv.style.transition = 'none'; cv.style.opacity = '0'; showOpen();
    void cv.offsetWidth;
    cv.style.transition = 'opacity .45s ease'; cv.style.opacity = '1';
    alm.classList.add('open');
    setTimeout(function () { if (alm) alm.style.opacity = '0'; }, 620);
    setTimeout(function () {
      doorBusy = false; if (cur !== 0 || tr || opening) return;
      doorOpen = true; alm.style.display = 'none'; placeDoor();
      /* a quick ripple through the rail shows the kurtas can be picked */
      pickImgs.forEach(function (im, i) { setTimeout(function () { if (!doorOpen) return; im.classList.add('peek'); setTimeout(function () { im.classList.remove('peek'); }, 260); }, 90 * i); });
    }, 1050);
  }
  function resetDoor() {
    doorOpen = false; doorBusy = false; setPick(-1);
    cv.style.transition = 'none'; cv.style.opacity = '';
    if (alm) { alm.style.display = 'none'; alm.classList.remove('open'); picksEl.style.display = 'none'; }
  }
  function pickAt(x, y) {
    if (!doorOpen) return -1;
    var ps = STOPS[0].picks;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], u = (x - pxC - p.x) / p.w, v = (y - pyC - p.y) / p.h;
      if (u < 0 || v < 0 || u >= 1 || v >= 1 || !p.a) continue;
      if (p.a[(((v * p.ah) | 0) * p.aw + ((u * p.aw) | 0)) * 4 + 3] > 70) return i;
    }
    return -1;
  }
  function pickInfo(i) {
    var p = STOPS[0].picks[i], pr = p.pid && window.PBP ? PBP.byId(p.pid) : null;
    return pr ? { href: 'product.html?id=' + pr.id, tile: { tag: 'In the almirah', pid: pr.id } }
              : { href: 'shop.html?c=kurtas', tile: { tag: 'In the almirah', name: p.name, note: 'See all kurtas', href: 'shop.html?c=kurtas', img: IMG + '1k' + i + '.webp' } };
  }
  function setPick(i) {
    if (i === pickNow) return;
    if (pickNow >= 0 && pickImgs[pickNow]) pickImgs[pickNow].classList.remove('on');
    pickNow = i;
    intro.classList.toggle('pick-on', i >= 0); if (picksEl) picksEl.classList.toggle('has', i >= 0);
    if (i >= 0) { pickImgs[i].classList.add('on'); clearTimeout(tileTimer); setTile(pickInfo(i).tile, true); }
    else if (elWear) hideTileSoon();
  }

  function startFlood(x, y, kind, data) {
    /* Freeze whatever the reveal is showing into the base layer, then sweep over it. */
    if (hasPrev || path) { ctxA.setTransform(1, 0, 0, 1, 0, 0); ctxA.drawImage(cv, 0, 0); }
    resetDoor();
    clearPrev(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    F.fill(0); U.fill(0); V.fill(0); maxF = 0; path = null; hold = 0; holdHot = -1; sticky = 0; stuck = -1;
    var far = 0, k = 0;
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++, k++) {
      var dx = ox + i * cell - x, dy = oy + j * cell - y, d = Math.sqrt(dx * dx + dy * dy);
      Dist[k] = d; if (d > far) far = d;
    }
    tr = { kind: kind, data: data, start: performance.now(), dur: kind === 'stop' ? 980 : 760, far: far };
    busy = true; kick();
  }
  function frameFlood(now) {
    var p = Math.min((now - tr.start) / tr.dur, 1), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    var soft = Math.max(90, tr.far * 0.18), R = e * (tr.far + soft * 1.6) - soft * 0.4;
    floodTo(R, soft, now * 0.001);
    var fp = march();
    clearPrev();
    if (fp) {
      var bw = bx1 - bx0, bh = by1 - by0;
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      if (tr.kind === 'stop') {
        ctx.save(); ctx.clip(fp, 'evenodd');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (bw > 0 && bh > 0) ctx.drawImage(offN, bx0, by0, bw, bh, bx0, by0, bw, bh);
        ctx.restore();
        strokeThread(fp, STOPS[tr.data].thread);
      } else {
        ctx.fillStyle = BRICK; ctx.fill(fp, 'evenodd');
      }
      remember();
    }
    if (tr.kind === 'stop' && !tr.mid && p > 0.42) { tr.mid = true; setCaption(tr.data); }
    if (p >= 1) { finishFlood(); }
  }
  function finishFlood() {
    var t = tr; tr = null; busy = false;
    if (t.kind === 'stop') {
      cur = t.data;
      ctxA.setTransform(1, 0, 0, 1, 0, 0); ctxA.drawImage(offN, 0, 0);
      clearPrev(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      offB = nextB; offN = null; nextB = null; prep = null;
      layoutHots();
      if (queued >= 0 && queued !== cur) { var q = queued; queued = -1; go(q); return; }
      queued = -1; arrive();
    } else if (t.kind === 'store') { covered(); }
    else if (t.kind === 'link') { location.href = t.data; }
  }

  /* ---------- Moving between stops ---------- */
  var queued = -1;
  function go(i, x, y) {
    if (opening || i < 0 || i >= STOPS.length) return;
    if (busy) { queued = i; return; }      /* asked mid-sweep: do it when the sweep lands */
    if (i === cur) return;
    busy = true; clearTimeout(autoTimer); ghostStart = 0; nextGhost = 0;
    var b = routeBtns[i]; if (b) b.classList.add('is-loading');
    ensure(i).then(function () {
      if (b) b.classList.remove('is-loading');
      if (opening) return;
      var pr = prepare(i); offN = pr.a; nextB = pr.b;
      var ox_ = x !== undefined ? x : (px !== null && ptrSeen ? px : (hots[0] ? hots[0].cx : vw / 2));
      var oy_ = y !== undefined ? y : (py !== null && ptrSeen ? py : (hots[0] ? hots[0].cy : vh / 2));
      startFlood(ox_, oy_, 'stop', i);
    }).catch(function () { busy = false; if (b) b.classList.remove('is-loading'); });
  }
  function next(x, y) {
    var from = busy && tr && tr.kind === 'stop' ? tr.data : cur;
    if (from < STOPS.length - 1) go(from + 1, x, y); else open();
  }
  function prev() {
    var from = busy && tr && tr.kind === 'stop' ? tr.data : cur;
    if (from > 0) go(from - 1);
  }

  function fromPrice(cat) {
    if (!window.PBP || !cat) return '';
    var m = Infinity; PBP.products.forEach(function (p) { if (p.cat === cat && p.price < m) m = p.price; });
    return m < Infinity ? 'from ' + PBP.inr(m) : '';
  }
  function setCaption(i) {
    var st = STOPS[i];
    intro.setAttribute('data-tone', st.tone);
    intro.setAttribute('data-stop', st.label);
    intro.classList.toggle('is-portrait', isPort(st));
    intro.setAttribute('data-side', st.side);
    var both = st.side === 'both';
    elL.innerHTML = '<span>' + st.L + '</span><span>' + st.L2 + '</span>';
    elR.innerHTML = both ? '<span>' + st.R + '</span><span>' + st.R2 + '</span>' : '';
    elLine.innerHTML = st.line;
    elShop.href = st.shop[1];
    elShop.querySelector('.t').textContent = st.shop[0];
    elShop.querySelector('.f').textContent = fromPrice(st.shop[2]);
    intro.classList.remove('cap-in'); void intro.offsetWidth; intro.classList.add('cap-in');
    routeBtns.forEach(function (b, k) {
      b.classList.toggle('on', k === i); b.classList.toggle('done', k < i);
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    if (elProg) elProg.style.strokeDashoffset = String(1 - i / (STOPS.length - 1));
    var nx_ = STOPS[i + 1];
    elNext.querySelector('.t').textContent = nx_ ? 'Next: ' + nx_.label : 'Enter the store';
    if (elCount) elCount.textContent = (i + 1) + ' / ' + STOPS.length;
    elNext.classList.toggle('last', !nx_);
    setTile(st.hot[0], false);
    wearState = 'a'; intro.classList.remove('is-bare');
  }
  function setTile(h, on) {
    if (elWear && h && h.name) {
      elWear.href = h.href; var ig = elWear.querySelector('img'); if (ig) ig.src = h.img;
      elWear.querySelector('small').textContent = h.tag; elWear.querySelector('b').textContent = h.name; elWear.querySelector('em').textContent = h.note;
      if (on !== undefined) elWear.classList.toggle('is-on', !!on);
      return;
    }
    if (!elWear || !window.PBP || !h) return;
    var p = PBP.byId(h.pid); if (!p) return;
    elWear.href = 'product.html?id=' + p.id;
    var im = elWear.querySelector('img'); if (im) { im.src = 'assets/img/' + p.img + '.webp'; im.alt = ''; }
    elWear.querySelector('small').textContent = h.tag;
    elWear.querySelector('b').textContent = p.name;
    elWear.querySelector('em').textContent = PBP.inr(p.price);
    if (on !== undefined) elWear.classList.toggle('is-on', !!on);
  }
  var tileTimer = 0;
  function hideTileSoon() { clearTimeout(tileTimer); tileTimer = setTimeout(function () { elWear.classList.remove('is-on'); }, 2200); }
  function placePin() {
    var h = hots[0], st = STOPS[cur];
    if (!h || !elPin) return;
    var x = Math.min(vw - 30, Math.max(30, h.cx)), y = Math.min(vh - 30, Math.max(70, h.cy));
    elPin.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    elHint.querySelector('.m').textContent = st.hint[0];
    elHint.querySelector('.t').textContent = st.hint[1];
  }
  function showPin(on) { pinShown = on; intro.classList.toggle('pin-on', on); }
  function arrive() {
    showPin(true);
    ghostHot = hots[0] || null; ghostStart = performance.now() + 500; nextGhost = 0;
    if (STOPS[cur].door) { ghostStart = 0; buildDoor(); placeDoor(); clearTimeout(autoTimer); autoTimer = setTimeout(function () { if (!acted) openDoor(); }, 4200); }
    /* Quietly fetch the next stop so it is ready when asked for, unless the connection is slow. */
    var c = navigator.connection, slow = c && /(^|-)[23]g/.test(c.effectiveType || '');
    if (cur + 1 < STOPS.length && !slow) setTimeout(function () {
      if (opening) return;
      var i = cur + 1;
      ensure(i).then(function () {
        var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
        idle(function () { if (!opening && !tr && cur + 1 === i) prepare(i); });
      }).catch(function () {});
    }, 1400);
    kick();
  }

  /* ---------- Frame ---------- */
  function frame(now) {
    raf = 0;
    var dt = last ? now - last : 0, f = dt ? Math.min(dt / 16.67, 2.5) : 1; last = now;

    if (tr) {
      frameFlood(now);
      raf = requestAnimationFrame(frame);
      return;
    }

    /* Struggling device: drop to a lighter canvas and grid rather than stutter. */
    if (!low && dt && maxF > 0.004) {
      sampled++; if (dt > 30) slowFrames++;
      if (sampled >= 24) {
        if (slowFrames > 12) { low = true; layout(); }
        sampled = 0; slowFrames = 0;
      }
    }

    /* Ghost hand: shows what the effect does until someone tries it, opening the main object once. */
    var ghosting = false;
    if (ghostStart && now >= ghostStart && ghostHot) {
      var g = (now - ghostStart) / 3600;
      if (g >= 1 || (ptrSeen && !isTouch && now - lastInput < 400)) {
        ghostStart = 0; nextGhost = now + (isTouch ? 7000 : 10000);
        if (!acted && !opening && cur < STOPS.length - 1) { clearTimeout(autoTimer); autoTimer = setTimeout(function () { if (!acted && !opening) next(); }, 2200); }
      } else {
        ghosting = true;
        var pi2 = Math.PI * 2, h0 = ghostHot;
        var gx = h0.cx + h0.rx * 0.7 * Math.sin(pi2 * g * 1.15 - 1.2), gy = h0.cy + h0.ry * 0.62 * Math.sin(pi2 * g * 0.72 + 0.2);
        if (g > 0.01) paint(fgxLast, fgyLast, gx, gy); else splat(gx, gy, rBrush, 1.6, 0, 0);
        fgxLast = gx; fgyLast = gy;
        var o = smoothstep(Math.min(1, Math.max(0, (g - 0.16) / 0.3))) * smoothstep(Math.min(1, Math.max(0, (0.98 - g) / 0.2)));
        if (o > 0.02) splatE(h0.gx, h0.gy, h0.grx * o, h0.gry * o, 1.35);
      }
    } else if (!ghostStart && !opening && nextGhost && now > nextGhost && now - lastInput > 5000) {
      ghostHot = hots[0] || null; ghostStart = now; nextGhost = 0;
    }

    /* Resting on an object keeps growing until the whole of it has changed. */
    var over = -1;
    if (!opening) {
      if (ptrInside && px !== null) {
        for (var i = 0; i < hots.length; i++) {
          var hq = hots[i], qa = (px - hq.cx) / hq.rx, qb = (py - hq.cy) / hq.ry;
          if (qa * qa + qb * qb < 1) { over = i; break; }
        }
        if (!STOPS[cur].door) splat(px, py, over >= 0 ? rBrush * 1.08 : rBrush * 0.9, 1.3, 0, 0);
      }
      if (sticky && now > sticky) { sticky = 0; stuck = -1; }
      if (stuck >= 0 && over < 0) over = stuck;
      if (over !== hotNow) {
        hotNow = over;
        if (over >= 0) { holdHot = over; clearTimeout(tileTimer); setTile(hots[over].d, true); }
        else hideTileSoon();     /* long enough to reach the tile and click it */
      }
      if (over >= 0) hold = Math.min(1, hold + (sticky ? 0.05 : 0.024) * f);
      else hold = Math.max(0, hold - 0.07 * f);
      if (hold > 0 && holdHot >= 0 && hots[holdHot]) {
        var hh = hots[holdHot], gr = smoothstep(hold);
        if (!STOPS[cur].door) splatE(hh.gx, hh.gy, hh.grx * gr, hh.gry * gr, 1.35);
        if (hold > 0.35 && pinShown && !STOPS[cur].door) showPin(false);
      }
    }

    if (!STOPS[cur].door) { step(f, now); if (dirty) { trace(); draw(); dirty = false; } }

    /* Pradhan ji's stop: the tile follows what he is wearing. */
    var st = STOPS[cur];
    if (st.wear && geo) {
      var ii = Math.round((geo.eyeX - ox) / cell), jj = Math.round((geo.eyeY - oy) / cell);
      if (ii > 0 && jj > 0 && ii < nx - 1 && jj < ny - 1) {
        var ws = F[jj * nx + ii] > THRESH ? 'b' : 'a';
        if (ws !== wearState) {
          wearState = ws; intro.classList.toggle('is-bare', ws === 'b');
          setTile({ tag: 'Pradhan ji is wearing', pid: st.wear[ws] }, true);
        }
      }
    }

    /* Gentle depth, composited only. */
    pxC += (pxT - pxC) * 0.07; pyC += (pyT - pyC) * 0.07;
    var moving = Math.abs(pxT - pxC) + Math.abs(pyT - pyC) > 0.08;
    if (moving) figure.style.transform = 'translate3d(' + pxC.toFixed(2) + 'px,' + pyC.toFixed(2) + 'px,0)';

    /* Nothing moving: stop drawing entirely and wake only for the next ghost pass. */
    var holding = ptrInside && px !== null;
    if (ghosting || ghostStart || moving || holding || maxF > 0.004 || hold > 0) { raf = requestAnimationFrame(frame); }
    else if (nextGhost && !opening) { clearTimeout(idleTimer); idleTimer = setTimeout(kick, Math.max(250, Math.min(nextGhost - now, 2500))); }
  }
  function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

  function open() {
    if (opening) return;
    opening = true; acted = true; ghostStart = 0; nextGhost = 0; clearTimeout(autoTimer);
    intro.classList.add('is-leaving');
    var x = px !== null ? px : vw / 2, y = py !== null ? py : vh * 0.45;
    if (tr) { tr = null; busy = false; }
    startFlood(x, y, 'store');
  }
  function follow(href, x, y) {
    if (opening) return;
    opening = true; acted = true; ghostStart = 0; nextGhost = 0; clearTimeout(autoTimer);
    intro.classList.add('is-leaving');
    if (tr) { tr = null; busy = false; }
    setTimeout(function () { location.href = href; }, 1100);   /* in case the frame never comes */
    startFlood(x, y, 'link', href);
  }
  function covered() {
    intro.classList.add('is-covered');
    html.classList.remove('intro-lock');
    window.scrollTo(0, 0);
    setSiteInert(false);
    setTimeout(function () {
      intro.classList.add('is-lifting');
      document.body.classList.add('site-enter');
      setTimeout(function () { removeIntro(); document.body.classList.remove('site-enter'); }, 1150);
    }, 320);
  }

  /* ---------- Input ---------- */
  function noteAct() { acted = true; clearTimeout(autoTimer); }
  intro.addEventListener('pointermove', function (e) {
    var x = e.clientX, y = e.clientY;
    if (!opening && !busy) {
      if (STOPS[cur].door) { setPick(pickAt(x, y)); if (!doorOpen && hots[0]) { var qa = (x - hots[0].cx) / hots[0].rx, qb = (y - hots[0].cy) / hots[0].ry; intro.classList.toggle('pick-on', qa * qa + qb * qb < 1); } }
      else if (px !== null && ptrInside) paint(px, py, x, y); else splat(x, y, rBrush * 0.9, 1.6, 0, 0);
      ptrSeen = true; lastInput = e.timeStamp;
      if (e.pointerType === 'mouse') noteAct();
      if (ghostStart && !isTouch) ghostStart = 0;
    }
    px = x; py = y; ptrInside = true;
    if (e.pointerType === 'mouse') { pxT = (x / vw - 0.5) * -14; pyT = (y / vh - 0.5) * -8; }
    kick();
  }, { passive: true });
  intro.addEventListener('pointerleave', function () { ptrInside = false; kick(); });

  var swipeX = 0, swipeY = 0, swipeT = 0, moved = 0, swipeOnHot = false;
  intro.addEventListener('pointerdown', function (e) {
    px = e.clientX; py = e.clientY; ptrSeen = true; lastInput = e.timeStamp; swipeX = e.clientX; swipeY = e.clientY; swipeT = e.timeStamp; moved = 0;
    swipeOnHot = false;
    for (var i = 0; i < hots.length; i++) {
      var h = hots[i], qa = (px - h.cx) / h.rx, qb = (py - h.cy) / h.ry;
      if (qa * qa + qb * qb < 1) { swipeOnHot = true; break; }
    }
    if (e.pointerType !== 'mouse') { ptrInside = true; noteAct(); }
    if (ghostStart) ghostStart = 0;
    kick();
  }, { passive: true });
  intro.addEventListener('pointerup', function (e) {
    lastInput = e.timeStamp;
    var dx = e.clientX - swipeX, dy = e.clientY - swipeY, adx = Math.abs(dx), ady = Math.abs(dy), dur = Math.max(1, e.timeStamp - swipeT);
    var onUi = e.target && e.target.closest && e.target.closest('a,button');
    if (e.pointerType !== 'mouse') {
      ptrInside = false;
      /* A swipe has to be long and brisk. Dragging over an object is painting, so one that starts there has to go further. */
      if (!onUi && dy < 0 && ady > adx && ady > vh * (swipeOnHot ? 0.45 : 0.28) && ady / dur > 0.35) { open(); return; }
      if (!onUi && adx > ady && adx > vw * (swipeOnHot ? 0.6 : 0.42) && adx / dur > 0.3) { if (dx < 0) next(e.clientX, e.clientY); else prev(); return; }
    }
    /* A tap on an object opens it and keeps it open for a moment, with its product in the tile. */
    if (!onUi && adx < 12 && ady < 12 && STOPS[cur].door && !busy && !opening) {
      if (!doorOpen) {
        var h0 = hots[0], a0 = h0 ? (e.clientX - h0.cx) / h0.rx : 9, b0 = h0 ? (e.clientY - h0.cy) / h0.ry : 9;
        if (a0 * a0 + b0 * b0 < 1.3) { openDoor(); return; }
      } else {
        var pk = pickAt(e.clientX, e.clientY);
        if (pk >= 0) {       /* mouse: the hovered kurta opens its page. Touch: first tap picks it, second opens it. */
          if (e.pointerType === 'mouse' || pk === pickNow) { follow(pickInfo(pk).href, e.clientX, e.clientY); return; }
          setPick(pk); return;
        }
        setPick(-1);
      }
    }
    if (!onUi && adx < 12 && ady < 12) {
      for (var i = 0; i < hots.length; i++) {
        var h = hots[i], a = (e.clientX - h.cx) / h.rx, b = (e.clientY - h.cy) / h.ry;
        if (a * a + b * b < 1) { stuck = i; sticky = performance.now() + 7000; holdHot = i; setTile(h.d, true); showPin(false); kick(); break; }
      }
    }
  }, { passive: true });
  intro.addEventListener('pointercancel', function () { ptrInside = false; }, { passive: true });

  var wheel = 0, wheelLock = 0;
  intro.addEventListener('wheel', function (e) {
    noteAct();
    var t = e.timeStamp;
    if (t < wheelLock) return;
    wheel += e.deltaY;
    if (Math.abs(wheel) > 60) {
      wheelLock = t + 1100;
      if (wheel > 0) next(); else prev();
      wheel = 0;
    }
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (!html.classList.contains('intro-lock')) return;
    var k = e.key, body = document.activeElement === document.body;
    if (k === 'Escape' || k === 'ArrowDown') { e.preventDefault(); open(); }
    else if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && body) || (k === 'Enter' && body)) { e.preventDefault(); noteAct(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); noteAct(); prev(); }
  });
  [].forEach.call(intro.querySelectorAll('[data-intro-open]'), function (b) { b.addEventListener('click', function () { open(); }); });
  routeBtns.forEach(function (b, i) { b.addEventListener('click', function () { noteAct(); go(i); }); });
  elNext.addEventListener('click', function () { noteAct(); next(); });
  elWear.addEventListener('pointerenter', function () { clearTimeout(tileTimer); });
  elWear.addEventListener('pointerleave', hideTileSoon);
  [elShop, elWear].forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      follow(a.getAttribute('href'), e.clientX || vw / 2, e.clientY || vh / 2);
    });
  });

  var rz = 0;
  addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () {
      if (opening || tr) return;
      vw = intro.clientWidth; vh = intro.clientHeight;
      ensure(cur).then(function () { layout(); kick(); }).catch(function () {});
    }, 150);
  });

  /* ---------- Load the first stop, then lift the curtain ---------- */
  var bar = intro.querySelector('.intro-bar i');
  vw = intro.clientWidth; vh = intro.clientHeight; tall = vw / vh < 0.85;
  var t0 = performance.now();
  var timeout = new Promise(function (_, rej) { setTimeout(rej, 6000); });
  if (bar) bar.style.transform = 'scaleX(.3)';
  setCaption(0);
  Promise.race([ensure(0), timeout]).then(function () {
    if (bar) bar.style.transform = 'scaleX(1)';
    layout();
    setTimeout(function () {
      intro.classList.add('is-ready');
      setTimeout(function () { px = null; py = null; arrive(); }, 1050);
    }, Math.max(0, 900 - (performance.now() - t0)));
  }).catch(function () {
    /* Slow network or a failed image: never hold a shopper back. */
    html.classList.remove('intro-lock'); setSiteInert(false);
    intro.classList.add('is-covered', 'is-lifting');
    setTimeout(removeIntro, 1100);
  });
})();
