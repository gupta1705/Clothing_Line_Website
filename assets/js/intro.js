/* Pradhan opening: hover over Pradhan ji and his aviators come off.
   Modelled on the helmet reveal at landonorris.com, without WebGL so it stays smooth on
   budget phones. A small fluid-like field runs on the CPU, gets traced into a crisp outline
   (marching squares), and that outline clips the two official stills on a 2D canvas. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('intro-on')) return;
  var intro = document.getElementById('intro');
  var cv = document.getElementById('intro-canvas');
  var ctx = cv && cv.getContext && cv.getContext('2d');
  var hidden = [];

  /* Keep the site out of the tab order while the opening is up. */
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
  if (!intro || !ctx || !window.Path2D) { removeIntro(); return; }
  setSiteInert(true);

  var low = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 3);
  var IMG_RATIO = 1700 / 1460, THRESH = 0.5, PAD = 24;
  var EYE_Y = 520 / 1460;      /* eye line, as a share of the image height (both stills are aligned to it) */
  var vw, vh, dpr, cell, nx, ny, ox, oy, pW, pH, pX, pY, rFace, headW, headH, eyeX, eyeY;
  var F, F2, U, V, N, G, nextEdge, seen, ex, ey, sinI, sinJ;
  var maxF = 0, imgA = new Image(), imgB = new Image(), offA, offB, headCx, headCy, headR, faceHold = 0;
  var raf = 0, last = 0, dirty = true, path = null;
  var px = null, py = null, ptrInside = false, ptrSeen = false, lastInput = 0;
  var ghostStart = 0, nextGhost = 0, isTouch = matchMedia('(hover: none)').matches;
  var pxT = 0, pyT = 0, pxC = 0, pyC = 0, wearState = 'a', hinted = false;
  var opening = false, floodStart = 0, floodX = 0, floodY = 0, floodMax = 0;
  var contours = intro.querySelector('.intro-contours');

  function layout() {
    vw = intro.clientWidth; vh = intro.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
    cv.width = Math.round((vw + PAD * 2) * dpr); cv.height = Math.round((vh + PAD * 2) * dpr);
    if (vw / vh < 0.85) {          /* phones: head fills the width, figure anchored to the bottom */
      var line = intro.querySelector('.intro-line.r'), textBottom = line ? line.getBoundingClientRect().bottom : 150;
      /* hair top sits at 7% of the image and the bottom 5% runs off screen, so hair must clear the tagline */
      pH = Math.min(vw * 2.02 / IMG_RATIO, (vh - textBottom - 14) / 0.88);
      pW = pH * IMG_RATIO; pY = vh - pH * 0.95;
    } else {                       /* desktop: large chest-up portrait, like the reference */
      pH = vh * 1.2; pW = pH * IMG_RATIO; pY = vh * 0.015;
    }
    pX = (vw - pW) / 2 + (vw / vh < 0.85 ? pW * 0.03 : 0);   /* phones: centre the aviator head, which sits left of the eyes */
    eyeX = pX + pW / 2; eyeY = pY + pH * EYE_Y;
    headW = pW * 0.36; headH = pH * 0.46;
    rFace = Math.max(64, Math.min(headW * 0.36, vh * 0.19));
    headCx = eyeX - pW * 0.0135; headCy = eyeY - pH * 0.053; headR = pW * 0.3;   /* a circle big enough to clear both heads */
    cell = low ? 14 : (vw > 900 ? 9 : 8);
    ox = -PAD - cell; oy = -PAD - cell;
    nx = Math.ceil((vw + PAD * 2) / cell) + 3; ny = Math.ceil((vh + PAD * 2) / cell) + 3;
    var n = nx * ny;
    F = new Float32Array(n); F2 = new Float32Array(n); U = new Float32Array(n); V = new Float32Array(n);
    N = new Float32Array(n); G = new Float32Array(n);
    nextEdge = new Int32Array(n * 2); seen = new Uint8Array(n * 2); ex = new Float32Array(n * 2); ey = new Float32Array(n * 2);
    sinI = new Float32Array(nx); sinJ = new Float32Array(ny);
    /* Static low-frequency noise makes the reveal edge organic instead of round. */
    var s = 9 / cell;
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var a = i / s, b = j / s;
      N[j * nx + i] = 0.1 * Math.sin(a * 0.21 + 1.3) * Math.cos(b * 0.17 + 0.4) + 0.07 * Math.sin((a + b) * 0.09 + 2) + 0.05 * Math.sin(a * 0.47 - b * 0.31);
    }
    maxF = 0; path = null; dirty = true;
    /* Scale each portrait to the screen once; every frame after that is a plain copy, which is far cheaper. */
    if (imgA.naturalWidth && imgB.naturalWidth) { offA = prerender(imgA); offB = prerender(imgB); }
  }

  function prerender(im) {
    var c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height;
    var x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
    x.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    x.drawImage(im, pX, pY, pW, pH);
    return c;
  }

  /* Add reveal at a point; velocity pushes it along like fluid. */
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

  function inFace(x, y) {
    var a = (x - eyeX) / (headW * 0.62), b = (y - (eyeY + headH * 0.02)) / (headH * 0.62);
    return a * a + b * b < 1;
  }
  function onFigure(x, y) { return y > eyeY - headH * 0.55 && Math.abs(x - eyeX) < pW * (y > eyeY + headH * 0.55 ? 0.38 : 0.22); }

  function paint(x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, d = Math.sqrt(dx * dx + dy * dy);
    var r = inFace(x1, y1) ? rFace * 1.2 : rFace * 0.85;
    var steps = Math.min(10, Math.max(1, Math.ceil(d / (r * 0.4))));
    var vx = (dx / cell) * 0.1 / steps, vy = (dy / cell) * 0.1 / steps;
    for (var s = 1; s <= steps; s++) splat(x0 + dx * s / steps, y0 + dy * s / steps, r, 1.6, vx, vy);
  }

  /* One step: semi-Lagrangian advection, slow swirl, fade back to the aviators. */
  function step(f, now) {
    if (maxF <= 0) return;
    var decay = Math.pow(0.985, f), vd = Math.pow(0.9, f), t = now * 0.0007, i, j, k, peak = 0;
    for (i = 0; i < nx; i++) sinI[i] = Math.sin(i * 0.16 * cell / 9 + t) * 0.2 * f;
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

  /* Marching squares into closed, consistently wound loops. Edge ids: 2k = top of cell k, 2k+1 = left of cell k. */
  function trace() {
    if (maxF + 0.3 < THRESH) { path = null; return; }
    var i, j, k, n = nx * ny;
    for (k = 0; k < n; k++) G[k] = F[k] > 0.004 ? F[k] + N[k] : 0;
    for (i = 0; i < nx; i++) { G[i] = 0; G[(ny - 1) * nx + i] = 0; }
    for (j = 0; j < ny; j++) { G[j * nx] = 0; G[j * nx + nx - 1] = 0; }
    nextEdge.fill(-1); seen.fill(0);
    function hp(id, a, b, x, y) { var t = (THRESH - a) / (b - a); ex[id] = ox + (x + t) * cell; ey[id] = oy + y * cell; }
    function vp(id, a, b, x, y) { var t = (THRESH - a) / (b - a); ex[id] = ox + x * cell; ey[id] = oy + (y + t) * cell; }
    var any = false;
    for (j = 0; j < ny - 1; j++) {
      for (i = 0; i < nx - 1; i++) {
        k = j * nx + i;
        var a = G[k], b = G[k + 1], c = G[k + nx + 1], d = G[k + nx];
        var cs = (a > THRESH ? 1 : 0) | (b > THRESH ? 2 : 0) | (c > THRESH ? 4 : 0) | (d > THRESH ? 8 : 0);
        if (cs === 0 || cs === 15) continue;
        any = true;
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
    if (!any) { path = null; return; }
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
    path = p;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    ctx.clearRect(-PAD, -PAD, vw + PAD * 2, vh + PAD * 2);
    if (!path) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(offA, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr); return; }
    var o = new Path2D(); o.rect(-PAD, -PAD, vw + PAD * 2, vh + PAD * 2); o.addPath(path);
    if (!low) { ctx.fillStyle = 'rgba(107,76,56,.1)'; ctx.fill(path, 'evenodd'); }
    ctx.save(); ctx.clip(o, 'evenodd'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(offA, 0, 0); ctx.restore();
    ctx.save(); ctx.clip(path, 'evenodd'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(offB, 0, 0); ctx.restore();
    ctx.strokeStyle = 'rgba(139,58,30,.8)'; ctx.lineWidth = 1.4; ctx.stroke(path);   /* the thread */
  }

  function wobble(cx, cy, R, t) {
    ctx.beginPath();
    for (var a = 0; a <= 160; a++) {
      var th = a / 160 * Math.PI * 2;
      var r = R * (1 + 0.09 * Math.sin(3 * th + t * 3) + 0.05 * Math.sin(7 * th - t * 2) + 0.025 * Math.sin(13 * th + t));
      var x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r;
      if (a) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath();
  }

  function updateWear() {
    var i = Math.round((eyeX - ox) / cell), j = Math.round((eyeY - oy) / cell);
    if (i < 1 || j < 1 || i >= nx - 1 || j >= ny - 1) return;
    var st = F[j * nx + i] > THRESH ? 'b' : 'a';
    if (st === wearState) return;
    wearState = st;
    intro.classList.toggle('is-bare', st === 'b');
    if (st === 'b' && ptrSeen && !hinted) { hinted = true; intro.classList.add('hint-done'); }
    var wear = intro.querySelector('.intro-wear');
    if (wear && window.PBP) {
      var p = PBP.byId(wear.getAttribute('data-' + st));
      if (p) {
        wear.href = 'product.html?id=' + p.id;
        wear.querySelector('b').textContent = p.name;
        wear.querySelector('em').textContent = PBP.inr(p.price);
      }
    }
  }

  function frame(now) {
    raf = 0;
    var dt = last ? now - last : 0, f = dt ? Math.min(dt / 16.67, 2.5) : 1; last = now;

    /* Struggling device: drop to a lighter canvas and grid rather than stutter. */
    if (!low && dt && maxF > 0.004) {
      sampled++; if (dt > 30) slowFrames++;
      if (sampled >= 24) {
        if (slowFrames > 12) { low = true; layout(); }
        sampled = 0; slowFrames = 0;
      }
    }

    /* Ghost hand: shows what the effect does until someone tries it. */
    var ghosting = false;
    if (ghostStart) {
      var g = (now - ghostStart) / 2800;
      if (g >= 1 || (ptrSeen && !isTouch && now - lastInput < 400)) { ghostStart = 0; }
      else {
        ghosting = true;
        var pi2 = Math.PI * 2;
        var gx = eyeX + headW * 0.62 * Math.sin(pi2 * g * 1.15 - 1.2), gy = eyeY + headH * (0.1 + 0.34 * Math.sin(pi2 * g * 0.72 + 0.2));
        if (px !== null && g > 0) paint(gxLast, gyLast, gx, gy);
        else splat(gx, gy, rFace, 1.6, 0, 0);
        gxLast = gx; gyLast = gy; px = px === null ? gx : px; py = py === null ? gy : py;
      }
    } else if (!opening && nextGhost && now > nextGhost && now - lastInput > 5000) {
      ghostStart = now; nextGhost = now + (isTouch ? 6500 : 9000);
    }

    /* Resting on him keeps the reveal open; resting on the face grows until the whole head has changed. */
    if (ptrInside && px !== null && !opening) {
      var onFace = inFace(px, py);
      if (onFigure(px, py)) splat(px, py, onFace ? rFace * 1.25 : rFace * 0.85, 1.3, 0, 0);
      faceHold = onFace ? Math.min(1, faceHold + 0.024 * f) : Math.max(0, faceHold - 0.06 * f);
      if (faceHold > 0) splat(headCx, headCy, headR * faceHold * faceHold * (3 - 2 * faceHold), 1.35, 0, 0);
    } else if (faceHold) { faceHold = 0; }

    step(f, now);
    if (dirty) { trace(); updateWear(); draw(); dirty = false; }

    /* Gentle depth, composited only. */
    pxC += (pxT - pxC) * 0.07; pyC += (pyT - pyC) * 0.07;
    var moving = Math.abs(pxT - pxC) + Math.abs(pyT - pyC) > 0.08;
    if (moving) {
      cv.style.transform = 'translate3d(' + pxC.toFixed(2) + 'px,' + pyC.toFixed(2) + 'px,0)';
      if (contours) contours.style.transform = 'translate3d(' + (-pxC * 0.5).toFixed(2) + 'px,' + (-pyC * 0.5).toFixed(2) + 'px,0)';
    }

    /* Leaving: ink floods out from the cursor, then the page lifts. */
    if (floodStart) {
      var p = Math.min((now - floodStart) / 780, 1);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      draw();
      ctx.fillStyle = '#8b3a1e';
      wobble(floodX, floodY, e * floodMax, now * 0.002);
      ctx.fill();
      if (p >= 1) { covered(); return; }
    }

    /* Nothing moving: stop drawing entirely and wake up only for the next ghost pass. */
    var holding = ptrInside && px !== null && onFigure(px, py);
    if (floodStart || ghosting || moving || holding || maxF > 0.004) { raf = requestAnimationFrame(frame); }
    else if (nextGhost && !opening) { clearTimeout(idleTimer); idleTimer = setTimeout(kick, Math.max(250, Math.min(nextGhost - now, 2500))); }
  }
  var gxLast = 0, gyLast = 0, idleTimer = 0, sampled = 0, slowFrames = 0;
  function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

  function open() {
    if (opening) return;
    opening = true; nextGhost = 0; ghostStart = 0;
    intro.classList.add('is-leaving');
    floodX = px !== null ? px : vw / 2; floodY = py !== null ? py : vh * 0.45;
    var fx = Math.max(floodX, vw - floodX), fy = Math.max(floodY, vh - floodY);
    floodMax = Math.sqrt(fx * fx + fy * fy) * 1.2;
    floodStart = performance.now();
    kick();
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
  intro.addEventListener('pointermove', function (e) {
    var x = e.clientX, y = e.clientY;
    if (!opening) {
      if (px !== null && ptrInside) paint(px, py, x, y); else splat(x, y, rFace * 0.85, 1.6, 0, 0);
      ptrSeen = true; lastInput = e.timeStamp;
      if (ghostStart && !isTouch) ghostStart = 0;
    }
    px = x; py = y; ptrInside = true;
    if (e.pointerType === 'mouse') { pxT = (x / vw - 0.5) * -18; pyT = (y / vh - 0.5) * -10; }
    kick();
  }, { passive: true });
  intro.addEventListener('pointerleave', function () { ptrInside = false; kick(); });

  var swipeY = 0, swipeT = 0;
  intro.addEventListener('pointerdown', function (e) {
    px = e.clientX; py = e.clientY; ptrSeen = true; lastInput = e.timeStamp; swipeY = e.clientY; swipeT = e.timeStamp;
    if (e.pointerType !== 'mouse') ptrInside = true;
    if (ghostStart) ghostStart = 0;
    kick();
  }, { passive: true });
  intro.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'mouse') {
      ptrInside = false;
      if (swipeY - e.clientY > vh * 0.2 && e.timeStamp - swipeT < 600) open();
    }
    lastInput = e.timeStamp;
  }, { passive: true });
  intro.addEventListener('pointercancel', function () { ptrInside = false; }, { passive: true });

  var wheel = 0;
  intro.addEventListener('wheel', function (e) { if (e.deltaY > 0) { wheel += e.deltaY; if (wheel > 50) open(); } }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (!html.classList.contains('intro-lock')) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Escape' || (e.key === ' ' && document.activeElement === document.body) || (e.key === 'Enter' && document.activeElement === document.body)) {
      e.preventDefault(); open();
    }
  });
  [].forEach.call(intro.querySelectorAll('[data-intro-open]'), function (b) { b.addEventListener('click', open); });

  var rz = 0;
  addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { if (!opening) { layout(); draw(); kick(); } }, 150);
  });

  /* ---------- Load, then lift the curtain ---------- */
  var bar = intro.querySelector('.intro-bar i'), suffix = innerWidth <= 900 ? '-sm' : '', loaded = 0;
  function loadImg(im, name) {
    return new Promise(function (res, rej) {
      im.onload = function () {
        loaded++; if (bar) bar.style.transform = 'scaleX(' + (0.2 + loaded * 0.4) + ')';
        (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(res);
      };
      im.onerror = rej;
      im.src = 'assets/img/' + name + suffix + '.webp';
    });
  }
  var t0 = performance.now();
  var timeout = new Promise(function (_, rej) { setTimeout(rej, 6000); });
  if (bar) bar.style.transform = 'scaleX(.2)';
  Promise.race([Promise.all([loadImg(imgA, 'intro-a'), loadImg(imgB, 'intro-b')]), timeout]).then(function () {
    layout(); draw();
    var wear = intro.querySelector('.intro-wear');
    if (wear && window.PBP) { var p = PBP.byId(wear.getAttribute('data-a')); if (p) { wear.querySelector('em').textContent = PBP.inr(p.price); } }
    setTimeout(function () {
      intro.classList.add('is-ready');
      setTimeout(function () { ghostStart = performance.now(); nextGhost = ghostStart + 8000; px = null; py = null; kick(); }, 1050);
    }, Math.max(0, 750 - (performance.now() - t0)));
  }).catch(function () {
    /* Slow network or a failed image: never hold a shopper back. */
    html.classList.remove('intro-lock'); setSiteInert(false);
    intro.classList.add('is-covered', 'is-lifting');
    setTimeout(removeIntro, 1100);
  });
})();
