/* Reference-led office dressing: thin, bent records, tied cloth and desk hardware.
   Geometry and small paper/weave textures are authored here. Scanned props, when
   supplied, retain the attribution and lifetime of the external props library. */
(function () {
  'use strict';

  window.buildPanchayatOfficeDetails = function (T, scene, office, resources) {
    resources = resources || {};
    var root = new T.Group(); root.name = 'office-reference-details'; scene.add(root);
    var seed = 643819, batches = new Map(), unitBox = new T.BoxGeometry(1, 1, 1);
    function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function group(parent, x, y, z, ry) {
      var g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; parent.add(g); return g;
    }
    function texture(w, h, paint, data) {
      var c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
      var map = new T.CanvasTexture(c); map.colorSpace = data ? T.NoColorSpace : T.SRGBColorSpace;
      map.anisotropy = 4; return map;
    }
    function material(color, roughness, extra) {
      return new T.MeshStandardMaterial(Object.assign({ color: color, roughness: roughness == null ? .86 : roughness }, extra || {}));
    }
    function mesh(parent, geo, mat, x, y, z) {
      var m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0);
      m.castShadow = m.receiveShadow = true; m.userData.referenceDetailGeometry = true; parent.add(m); return m;
    }
    function box(parent, w, h, d, x, y, z, mat) {
      var m = mesh(parent, unitBox, mat, x, y, z); m.scale.set(w, h, d); return m;
    }
    function roundRect(s, x, y, w, h, r) {
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); s.closePath(); return s;
    }
    function plate(parent, w, h, d, x, y, z, mat, r) {
      var geo = new T.ExtrudeGeometry(roundRect(new T.Shape(), -w / 2, -h / 2, w, h, r || .004), {
        depth: d, bevelEnabled: true, bevelThickness: .0015, bevelSize: .0015, bevelSegments: 2, curveSegments: 5
      }); geo.translate(0, 0, -d / 2); return mesh(parent, geo, mat, x, y, z);
    }
    function tube(parent, points, radius, mat, segments, closed) {
      var curve = new T.CatmullRomCurve3(points.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); }), !!closed, 'centripetal');
      return mesh(parent, new T.TubeGeometry(curve, segments || 20, radius, 5, !!closed), mat);
    }
    function cylinder(parent, r, h, x, y, z, mat, segments) {
      return mesh(parent, new T.CylinderGeometry(r, r, h, segments || 12), mat, x, y, z);
    }

    // Cream fibres and fine printed rules remain subtle at room scale. Unlike a
    // solid box, every file has a bowed surface, staggered edges and thin covers.
    var edgeMap = texture(512, 128, function (c, w, h) {
      c.fillStyle = '#bcae91'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 2 + Math.floor(rand() * 3)) {
        c.strokeStyle = 'rgba(84,67,42,' + (.12 + rand() * .18) + ')'; c.lineWidth = .5;
        c.beginPath(); c.moveTo(0, y);
        for (var x = 0; x <= w; x += 14) c.lineTo(x, y + (rand() - .5) * 1.5);
        c.stroke(); c.fillStyle = 'rgba(255,253,232,.4)'; c.fillRect(0, y + 1, w, .55);
      }
      for (var i = 0; i < 900; i++) { c.fillStyle = 'rgba(109,83,42,.05)'; c.fillRect(rand() * w, rand() * h, 1, 1); }
    });
    var paperMaps = [0, 1, 2].map(function (variant) {
      return texture(512, 700, function (c, w, h) {
        c.fillStyle = ['#cfc09f', '#bfae8c', '#ded8c6'][variant]; c.fillRect(0, 0, w, h);
        for (var i = 0; i < 30; i++) {
          var x = rand() * w, y = rand() * h, r = 20 + rand() * 160, g = c.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(127,96,41,.018)'); g.addColorStop(1, 'rgba(127,96,41,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        }
        c.fillStyle = 'rgba(53,61,59,.6)'; c.textAlign = 'center'; c.font = '21px "Nirmala UI", serif';
        c.fillText(variant === 1 ? 'कार्यालय प्रति' : 'ग्राम पंचायत कार्यालय', w / 2, 58);
        c.lineWidth = .6; c.strokeStyle = 'rgba(70,75,69,.3)'; c.strokeRect(39, 83, w - 78, h - 125);
        c.textAlign = 'left'; c.font = '10px "Nirmala UI", serif';
        c.fillText('पत्रांक ..................................   दिनांक ......................', 54, 110);
        for (var j = 0; j < 15; j++) {
          var yy = 150 + j * 29; c.strokeStyle = 'rgba(64,69,66,.2)'; c.beginPath(); c.moveTo(53, yy); c.lineTo(w - 51 - (j % 5 === 4 ? 70 : 0), yy); c.stroke();
          if (variant !== 2) for (var k = 0; k < 4 + (j % 5); k++) {
            c.fillStyle = 'rgba(68,74,72,.16)'; c.fillRect(55 + k * 43, yy - 7, 20 + rand() * 16, 2 + rand());
          }
        }
        c.strokeStyle = 'rgba(41,69,103,.34)'; c.lineWidth = 1.2; c.beginPath();
        c.moveTo(290, 627); c.bezierCurveTo(310, 590, 291, 648, 329, 612); c.bezierCurveTo(331, 634, 353, 611, 381, 624); c.stroke();
        for (var n = 0; n < 1700; n++) { c.fillStyle = n % 2 ? 'rgba(255,255,236,.08)' : 'rgba(97,78,41,.025)'; c.fillRect(rand() * w, rand() * h, 1, 1); }
      });
    });
    var fibreMap = texture(256, 256, function (c, w, h) {
      c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 5000; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.07)'; c.fillRect(rand() * w, rand() * h, .7, 1 + rand() * 3); }
    }, true);
    var edge = material('#ffffff', .98, { map: edgeMap });
    var papers = paperMaps.map(function (map) { return material('#ffffff', .98, { map: map, bumpMap: fibreMap, bumpScale: .0003, side: T.DoubleSide }); });
    var covers = ['#b99c63', '#8b4b37', '#8b8060', '#5e7771', '#ae7851', '#d4c09a'].map(function (color) {
      return material(color, .94, { bumpMap: fibreMap, bumpScale: .0005, side: T.DoubleSide });
    });
    var stringMat = material('#b8a787', .98), dark = material('#272824', .55), steel = material('#8d918c', .28, { metalness: .82 });
    var blue = material('#355895', .38, { metalness: .15 }), cream = material('#c4bba0', .78), socketHoles = material('#27271f', .91);
    var redWeave = texture(256, 256, function (c, w, h) {
      c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 3) { c.fillStyle = x % 2 ? '#8c8c8c' : '#757575'; c.fillRect(x, 0, 1, h); }
      for (var y = 0; y < h; y += 3) { c.fillStyle = y % 2 ? 'rgba(220,220,220,.18)' : 'rgba(20,20,20,.17)'; c.fillRect(0, y, w, 1); }
    }, true);
    redWeave.wrapS = redWeave.wrapT = T.RepeatWrapping; redWeave.repeat.set(3, 2);
    var red = material('#73251e', .95, { bumpMap: redWeave, bumpScale: .0012, side: T.DoubleSide });

    // Merge the many small page surfaces by material rather than issuing a draw
    // call per sheet. All coordinates here are world coordinates under root.
    function batchTriangle(mat, a, b, c, ua, ub, uc) {
      var data = batches.get(mat); if (!data) { data = { p: [], uv: [] }; batches.set(mat, data); }
      [a, b, c].forEach(function (p) { data.p.push(p[0], p[1], p[2]); });
      [ua, ub, uc].forEach(function (uv) { data.uv.push(uv[0], uv[1]); });
    }
    function surface(mat, point, sx, sz, flip) {
      for (var iz = 0; iz < sz; iz++) for (var ix = 0; ix < sx; ix++) {
        var u = ix / sx, v = iz / sz, un = (ix + 1) / sx, vn = (iz + 1) / sz;
        var a = point(u, v), b = point(un, v), c = point(un, vn), d = point(u, vn);
        if (flip) {
          batchTriangle(mat, a, b, c, [u, v], [un, v], [un, vn]); batchTriangle(mat, a, c, d, [u, v], [un, vn], [u, vn]);
        } else {
          batchTriangle(mat, a, c, b, [u, v], [un, vn], [un, v]); batchTriangle(mat, a, d, c, [u, v], [u, vn], [un, vn]);
        }
      }
    }
    function folio(x, y, z, w, d, h, angle, coverIndex, loose) {
      var phase = rand() * 6.28, curl = loose ? .012 + rand() * .015 : .005 + rand() * .008;
      var tone = rand(), ca = Math.cos(angle), sa = Math.sin(angle), topMat = papers[tone < .16 ? 2 : tone < .58 ? 0 : 1];
      function warp(u, v) {
        return .0018 * Math.sin(u * 7 + phase) * Math.cos(v * 5 + phase) +
          curl * (Math.pow(Math.abs(u * 2 - 1), 5) * (.45 + .55 * v) + .45 * Math.pow(v, 6)) -
          .002 * Math.exp(-Math.pow((u - .36) * 7, 2));
      }
      function point(u, v, level, spread) {
        var px = (u - .5) * (w + (spread || 0)), pz = (v - .5) * (d + (spread || 0));
        // A lightly cockled fore-edge; sheet boundaries are staggered instead of square.
        px += Math.sin(v * 15 + phase) * .0008 * Math.pow(Math.abs(u * 2 - 1), 5);
        pz += Math.sin(u * 17 + phase) * .0009 * Math.pow(Math.abs(v * 2 - 1), 5);
        return [x + px * ca + pz * sa, y + level + warp(u, v), z - px * sa + pz * ca];
      }
      var layers = loose ? 1 : 3;
      for (var layer = 0; layer < layers; layer++) {
        var low = h * layer / layers, high = h * (layer + 1) / layers;
        // Four rippled paper edges expose thin strata at slightly different widths.
        var spread = layer % 2 ? -.003 : .001;
        [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]].forEach(function (side) {
          surface(edge, function (u, v) {
            return point(side[0] + (side[2] - side[0]) * u, side[1] + (side[3] - side[1]) * u, low + (high - low) * v, spread);
          }, 8, 1, false);
        });
        surface(topMat, function (u, v) { return point(u, v, high, spread); }, 8, 5, false);
      }
      if (coverIndex != null) {
        surface(covers[coverIndex % covers.length], function (u, v) { return point(u, v, h + .0011, .012); }, 8, 5, false);
        surface(covers[coverIndex % covers.length], function (u, v) { return point(u, v, -.001, .012); }, 8, 5, true);
      }
      return h + curl * .65;
    }
    function tie(x, y, z, w, d, h, angle) {
      var g = group(root, x, y, z, angle); g.name = 'cotton-file-tie';
      // Cotton tape follows the compressed packet, with a small off-centre knot.
      tube(g, [[-.05, h + .002, -d / 2], [-.05, h + .005, 0], [-.05, h + .003, d / 2], [-.05, .002, d / 2], [-.05, 0, -d / 2], [-.05, h + .002, -d / 2]], .0018, stringMat, 22);
      tube(g, [[-w / 2, h + .002, .025], [0, h + .002, .025], [w / 2, h + .002, .025], [w / 2, 0, .025], [-w / 2, 0, .025], [-w / 2, h + .002, .025]], .0018, stringMat, 22);
      tube(g, [[-.05, h + .009, .025], [-.085, h + .017, .065], [-.09, h + .012, .035], [-.05, h + .009, .025], [-.019, h + .017, -.01], [-.014, h + .011, .021], [-.05, h + .009, .025]], .0015, stringMat, 22);
      tube(g, [[-.05, h + .01, .025], [-.018, h + .006, .07], [.003, h + .002, .115]], .0014, stringMat, 10);
    }
    function stack(x, y, z, count, w, d, options) {
      options = options || {}; var cursor = y, packetHeight = 0, lean = rand() - .5;
      for (var n = 0; n < count; n++) {
        var ww = w * (.89 + rand() * .13), dd = d * (.91 + rand() * .1), height = .008 + rand() * .014;
        var angle = (rand() - .5) * .18 + (options.angle || 0);
        var xx = x + (rand() - .5) * .047 + lean * n * .002, zz = z + (rand() - .5) * .036;
        folio(xx, cursor, zz, ww, dd, height, angle, rand() < .65 ? Math.floor(rand() * covers.length) : null, false);
        cursor += height + .005; packetHeight = cursor - y;
        if ((n === count - 1 && rand() < .4) || (n !== count - 1 && n % 3 === 2)) {
          folio(xx + .018, cursor + .001, zz + .016, ww * .95, dd * 1.03, .0007, angle + .035, null, true); cursor += .004;
        }
      }
      if (options.tie) tie(x, y + .004, z, w * .96, d * .97, packetHeight + .002, options.angle || 0);
      return cursor;
    }

    // Locations mirror the record shelves in the established room. Root disables
    // the previous fileStack calls when this module is present.
    var scannedBookPositions = [], rackBundleY = 1.61;
    [[4.55, -3.95, 1.3, 2.75], [-4.78, -3.95, 1.04, 2.65]].forEach(function (rack, ri) {
      for (var level = 0; level < 4; level++) {
        var y = .155 + level * (rack[3] - .18) / 4;
        var leftTop = stack(rack[0] - rack[2] * .23, y, rack[1] + .015, 6 + level % 3, rack[2] * .43, .43, { tie: level === 2 });
        var rightTop = stack(rack[0] + rack[2] * .23, y, rack[1] + .025, 6 + (level + ri) % 3, rack[2] * .42, .42, { tie: level === 1 });
        if (ri === 0 && level === 1) scannedBookPositions.push([rack[0] - rack[2] * .23, leftTop + .002, rack[1], 12]);
        if (ri === 1 && level === 2) scannedBookPositions.push([rack[0] + rack[2] * .23, rightTop + .002, rack[1], 17]);
        if (ri === 0 && level === 2) rackBundleY = rightTop + .002;
      }
      stack(rack[0] + rack[2] * .25, rack[3] -.025, rack[1], 7, rack[2] * .42, .4, { tie: true });
    });
    [[-1.76, 2.15, -4.03, 1.02, 1.25, .37], [1.16, 2.65, -4.03, .95, .78, .37]].forEach(function (c, ci) {
      var bottomTop = stack(c[0] - c[3] * .2, c[1] - c[4] / 2 + .025, c[2] + .02, 8, c[3] * .48, c[5] * .88, { tie: true });
      var middleTop = stack(c[0] + c[3] * .23, c[1] + .025, c[2] + .02, 7, c[3] * .43, c[5] * .91);
      scannedBookPositions.push(ci ? [c[0] - c[3] * .2, bottomTop + .002, c[2], 7] : [c[0] + c[3] * .23, middleTop + .002, c[2], 3]);
      stack(c[0], c[1] + c[4] / 2 + .025, c[2], 7, c[3] * .82, c[5] * .86, { tie: true });
    });
    stack(.62, .83, -3.45, 6, .51, .4); stack(.67, .12, -3.3, 7, .47, .39);
    stack(-1.79, .91, -.45, 4, .57, .4); stack(-.33, .91, -.63, 6, .58, .42, { tie: true });
    stack(2.11, 2.28, -3.51, 6, .82, .53, { tie: true }); stack(3.17, 2.28, -3.51, 7, .83, .51);

    function clothBundle(x, y, z, w, d, h, angle) {
      var g = group(root, x, y, z, angle); g.name = 'red-cotton-record-bundle';
      var geo = new T.SphereGeometry(1, 40, 24), p = geo.attributes.position;
      for (var i = 0; i < p.count; i++) {
        var py = p.getY(i), theta = Math.atan2(p.getZ(i), p.getX(i)), t = (py + 1) / 2;
        var radial = Math.pow(Math.max(0, 1 - py * py), .36);
        var crease = Math.sin(theta * 13 + t * 9) * .012 * Math.pow(t, 2) + Math.sin(theta * 7 - t * 6) * .006;
        var gather = t > .69 ? 1 - .53 * Math.pow((t - .69) / .31, .6) : 1;
        p.setXYZ(i, Math.cos(theta) * (w / 2 * radial * gather + crease), Math.max(.001, h * t + .006 * Math.sin(theta * 9) * t * (1 - t)), Math.sin(theta) * (d / 2 * radial * gather + crease));
      }
      geo.computeVertexNormals(); mesh(g, geo, red);
      // Two twisted cloth ears and a string loop sit above the gathered fabric.
      var knot = new T.SphereGeometry(1, 14, 9), kp = knot.attributes.position;
      for (var j = 0; j < kp.count; j++) kp.setXYZ(j, kp.getX(j) * .03, kp.getY(j) * .012, kp.getZ(j) * .023);
      mesh(g, knot, red, 0, h - .003, .005).rotation.z = .4;
      [[-.026, -.3], [.025, .5]].forEach(function (s) {
        var earGeo = new T.PlaneGeometry(.064, .085, 8, 10), ep = earGeo.attributes.position;
        for (var k = 0; k < ep.count; k++) { var ex = ep.getX(k), ey = ep.getY(k); ep.setZ(k, Math.sin(ex * 90 + ey * 34) * .006 + Math.pow(ey / .043, 2) * .009); }
        earGeo.computeVertexNormals(); var ear = mesh(g, earGeo, red, s[0], h + .016, .005); ear.rotation.set(-.55, s[1], s[1]);
      });
      tube(g, [[-.015, h - .01, -.026], [.032, h - .005, 0], [.01, h - .009, .027], [-.028, h - .012, .004], [-.015, h - .01, -.026]], .0016, stringMat, 20);
      tube(g, [[.02, h - .006, .018], [.04, h * .7, .09], [.055, h * .22, d * .44]], .0017, stringMat, 18);
      return g;
    }
    clothBundle(4.264, 3.126, -3.95, .45, .35, .12, .12);
    clothBundle(-5.009, 3.026, -3.95, .38, .31, .11, -.1);
    clothBundle(4.85, rackBundleY, -3.91, .44, .29, .13, .08);
    clothBundle(1.4, 2.285, -3.98, .32, .25, .11, -.23);

    // Yellowed Indian socket plates, rocker switches, slotted screws, plugs and
    // slack electrical leads. Tubes give the cables their actual round profile.
    function socketPlate(x, y, z, width, height) {
      var g = group(root, x, y, z); g.name = 'aged-electrical-socket';
      plate(g, width, height, .02, 0, 0, 0, cream, .008);
      [-1, 1].forEach(function (s) {
        var screw = cylinder(g, .004, .002, 0, s * (height / 2 - .016), .0125, steel, 10); screw.rotation.x = Math.PI / 2;
        var slit = box(g, .004, .0008, .001, 0, s * (height / 2 - .016), .014, dark); slit.rotation.z = .4;
      });
      [-.054, .005].forEach(function (xx) {
        plate(g, .044, .065, .003, xx, height * .23, .013, material('#ada58f', .81), .002);
        var rocker = plate(g, .033, .053, .007, xx, height * .23, .017, cream, .002); rocker.rotation.x = -.08;
      });
      [[-.047, -.06], [.047, -.06]].forEach(function (s) {
        [[0, .022], [-.016, -.007], [.016, -.007]].forEach(function (hole) {
          var dot = cylinder(g, hole[1] > 0 ? .005 : .004, .0016, s[0] + hole[0], s[1] + hole[1], .012, socketHoles, 10); dot.rotation.x = Math.PI / 2;
        });
      });
      return g;
    }
    socketPlate(.56, 1.63, -4.18, .21, .25); socketPlate(3.87, 2.16, -4.17, .25, .22);
    var cableMat = material('#34362e', .85), conduitMat = material('#b9ad8e', .87);
    tube(root, [[3.97, 2.28, -4.18], [3.97, 3.42, -4.18], [3.89, 3.53, -4.18], [2.6, 3.53, -4.18]], .009, conduitMat, 18);
    [2.48, 2.94, 3.4].forEach(function (y) { box(root, .029, .014, .026, 3.97, y, -4.17, cream); });
    var plug = plate(root, .044, .048, .029, .606, 1.565, -4.146, dark, .008); plug.rotation.z = -.16;
    tube(root, [[.608, 1.548, -4.124], [.643, 1.42, -4.09], [.62, 1.08, -4.05], [.44, .7, -4.0], [.06, .57, -3.82], [-.35, .72, -3.58], [-.47, 1.02, -3.59]], .0043, cableMat, 42);
    tube(root, [[.514, 1.556, -4.14], [.49, 1.45, -4.1], [.35, 1.3, -4.04], [.14, 1.16, -3.98], [-.18, 1.02, -3.7]], .0031, material('#8b8877', .86), 30);

    var desk = office && office.desk ? office.desk : group(root, -1.04, 0, -.32);
    var deskDetails = group(desk, 0, 0, 0); deskDetails.name = 'reference-desk-stationery';
    // A blue two-hole punch: rounded cast base, real handle opening, pivot pin,
    // return springs and steel punching shafts; no solid blue placeholder block.
    var punch = group(deskDetails, -.3, .906, -.28, -.17); punch.name = 'blue-hole-punch';
    var punchBase = plate(punch, .17, .12, .017, 0, .012, 0, blue, .016); punchBase.rotation.x = -Math.PI / 2;
    var sole = plate(punch, .166, .116, .006, 0, .003, 0, dark, .015); sole.rotation.x = -Math.PI / 2;
    var handleShape = roundRect(new T.Shape(), -.077, 0, .154, .142, .022);
    handleShape.holes.push(roundRect(new T.Shape(), -.031, .073, .062, .038, .012));
    var handleGeo = new T.ExtrudeGeometry(handleShape, { depth: .007, bevelEnabled: true, bevelSize: .002, bevelThickness: .002, bevelSegments: 3, curveSegments: 9 });
    var handle = mesh(punch, handleGeo, blue, 0, .033, .044); handle.rotation.x = -.88;
    var hinge = cylinder(punch, .008, .16, 0, .036, .043, steel, 16); hinge.rotation.z = Math.PI / 2;
    [-.041, .041].forEach(function (x) {
      cylinder(punch, .005, .041, x, .043, -.021, steel, 12);
      var springPoints = [];
      for (var n = 0; n <= 56; n++) { var a = n / 56 * Math.PI * 10; springPoints.push([x + Math.cos(a) * .008, .023 + n / 56 * .027, -.021 + Math.sin(a) * .008]); }
      tube(punch, springPoints, .001, steel, 56);
    });
    var staple = group(deskDetails, .22, .906, -.27, .22); staple.name = 'worn-metal-stapler';
    var stapleBase = plate(staple, .046, .17, .01, 0, .008, 0, dark, .012); stapleBase.rotation.x = -Math.PI / 2;
    var rail = plate(staple, .031, .145, .008, 0, .023, -.005, steel, .003); rail.rotation.x = -Math.PI / 2;
    var top = plate(staple, .045, .144, .019, 0, .043, -.003, dark, .012); top.rotation.x = -1.49;
    cylinder(staple, .008, .05, 0, .031, -.065, steel, 12).rotation.z = Math.PI / 2;
    var stamp = group(deskDetails, .38, .906, .03, -.13); stamp.name = 'wooden-rubber-stamp';
    var stampBase = plate(stamp, .065, .045, .009, 0, .006, 0, dark, .003); stampBase.rotation.x = -Math.PI / 2;
    var stampWood = material('#7b4c2a', .62, { bumpMap: fibreMap, bumpScale: .0006 });
    var stampUpper = plate(stamp, .063, .043, .011, 0, .016, 0, stampWood, .005); stampUpper.rotation.x = -Math.PI / 2;
    var profile = [[.016,.018],[.016,.023],[.011,.03],[.007,.045],[.012,.069],[.018,.076],[.019,.085],[.013,.093],[0,.095]].map(function (p) { return new T.Vector2(p[0], p[1]); });
    mesh(stamp, new T.LatheGeometry(profile, 24), stampWood);

    // Scanned objects retain their real wear and page edges. These augment the
    // irregular government files; a library row never replaces the archive.
    var props = resources.props;
    function prop(kind, options, parent, x, y, z, angle) {
      if (!props || typeof props.create !== 'function') return null;
      var object = props.create(kind, options); if (!object) return null;
      var holder = group(parent, x, y, z, angle); holder.add(object); return holder;
    }
    var binder = prop('binder', { variant: 'open', width: .51 }, deskDetails, -.56, .907, .23, -.13);
    if (!binder) {
      folio(-1.60, .909, -.08, .49, .34, .006, -.13, 1, false);
      folio(-1.58, .918, -.075, .45, .32, .0008, -.13, null, true);
    }
    prop('stationery', { part: 'pen_blue', width: .12 }, deskDetails, -.2, .907, .34, .5);
    prop('stationery', { part: 'pencil_used', width: .15 }, deskDetails, -.45, .908, .43, -.22);
    scannedBookPositions.forEach(function (p, index) {
      if (!props || typeof props.create !== 'function') return;
      var book = props.create('book', { index: p[3], height: .27 }); if (!book) return;
      book.rotation.z = -Math.PI / 2; book.rotation.y = index % 2 ? .08 : -.05; book.updateMatrixWorld(true);
      var bounds = new T.Box3().setFromObject(book), center = bounds.getCenter(new T.Vector3());
      book.position.x -= center.x; book.position.z -= center.z; book.position.y -= bounds.min.y;
      group(root, p[0], p[1], p[2]).add(book);
    });

    batches.forEach(function (data, mat) {
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(data.p, 3));
      geo.setAttribute('uv', new T.Float32BufferAttribute(data.uv, 2)); geo.computeVertexNormals();
      var merged = mesh(root, geo, mat); merged.name = 'curled-record-pages';
    });
    // Bake the fixed socket, cable, string and cloth parts into one mesh per
    // material. Keep imported scans intact, preserving their authored normals,
    // and keep desk stationery under the clickable desk's transform.
    var staticGroups = new Map(), candidates = [], point = new T.Vector3(), normal = new T.Vector3();
    root.updateWorldMatrix(true, true);
    var inverseRoot = new T.Matrix4().copy(root.matrixWorld).invert();
    root.traverse(function (object) {
      if (object.isMesh && object.userData.referenceDetailGeometry && object.name !== 'curled-record-pages' && !Array.isArray(object.material)) candidates.push(object);
    });
    candidates.forEach(function (object) {
      var data = staticGroups.get(object.material);
      if (!data) { data = { p: [], n: [], uv: [] }; staticGroups.set(object.material, data); }
      var geo = object.geometry, positions = geo.attributes.position, normals = geo.attributes.normal, uvs = geo.attributes.uv;
      var relative = new T.Matrix4().copy(inverseRoot).multiply(object.matrixWorld), normalMatrix = new T.Matrix3().getNormalMatrix(relative);
      var index = geo.index, count = index ? index.count : positions.count;
      for (var v = 0; v < count; v++) {
        var vi = index ? index.getX(v) : v;
        point.fromBufferAttribute(positions, vi).applyMatrix4(relative); data.p.push(point.x, point.y, point.z);
        normal.fromBufferAttribute(normals, vi).applyMatrix3(normalMatrix).normalize(); data.n.push(normal.x, normal.y, normal.z);
        data.uv.push(uvs ? uvs.getX(vi) : 0, uvs ? uvs.getY(vi) : 0);
      }
      object.parent.remove(object);
    });
    staticGroups.forEach(function (data, mat) {
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(data.p, 3));
      geo.setAttribute('normal', new T.Float32BufferAttribute(data.n, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(data.uv, 2));
      mesh(root, geo, mat).name = 'batched-office-detail';
    });
    root.userData.deskDetails = deskDetails;
    root.userData.paperStacks = 30;
    return root;
  };
})();
