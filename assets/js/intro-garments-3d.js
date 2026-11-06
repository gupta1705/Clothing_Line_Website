/* Hanging cloth for the office scene. All silhouettes, folds and sleeves are
   real closed meshes; the tiny shared texture adds only the cotton weave. */
(function () {
  'use strict';
  var textures = {};

  window.buildPanchayatGarment = function (T, config) {
    config = config || {};
    var kind = config.type || 'shirt';
    var kurta = kind === 'kurta', tee = kind === 'tee';
    var length = kurta ? 1.6 : 1.2;
    var group = new T.Group();
    group.name = 'hanging-' + kind;

    function weave(checked) {
      var key = checked ? 'checks' : 'cotton';
      if (textures[key]) return textures[key];
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      var c = canvas.getContext('2d');
      c.fillStyle = '#f5f1e7'; c.fillRect(0, 0, 128, 128);
      if (checked) {
        c.fillStyle = 'rgba(36,48,51,.3)';
        for (var p = 0; p < 128; p += 32) {
          c.fillRect(p + 7, 0, 10, 128); c.fillRect(0, p + 7, 128, 10);
        }
        c.fillStyle = 'rgba(255,255,239,.5)';
        for (var q = 0; q < 128; q += 32) {
          c.fillRect(q + 23, 0, 2, 128); c.fillRect(0, q + 23, 128, 2);
        }
      }
      for (var i = 0; i < 128; i += 2) {
        c.fillStyle = i % 4 ? 'rgba(255,255,255,.09)' : 'rgba(58,43,25,.06)';
        c.fillRect(i, 0, 1, 128); c.fillRect(0, i, 128, 1);
      }
      var tex = new T.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      if (T.SRGBColorSpace) tex.colorSpace = T.SRGBColorSpace;
      tex.repeat.set(2.2, kurta ? 4 : 3);
      tex.anisotropy = 2;
      textures[key] = tex;
      return tex;
    }

    var fabric = new T.MeshStandardMaterial({ color: config.color == null ? 0xd9cbaa : config.color, map: weave(!!config.checks), roughness: .94, metalness: 0 });
    var trim = fabric.clone(); trim.color.multiplyScalar(.91);
    var seamMat = fabric.clone(); seamMat.color.multiplyScalar(.72); seamMat.map = null;
    var buttonMat = new T.MeshStandardMaterial({ color: tee ? 0x766b51 : 0xd8d1b8, roughness: .6 });
    var wood = new T.MeshStandardMaterial({ color: 0x936638, roughness: .67 });
    var wire = new T.MeshStandardMaterial({ color: 0xb1aca0, roughness: .32, metalness: .8 });

    function mesh(geometry, material, name) {
      var m = new T.Mesh(geometry, material || fabric);
      m.name = name || 'cloth'; m.castShadow = true; m.receiveShadow = true;
      group.add(m); return m;
    }
    function rod(a, b, r, material, name) {
      var start = new T.Vector3(a[0], a[1], a[2]), end = new T.Vector3(b[0], b[1], b[2]);
      var delta = end.clone().sub(start);
      var m = mesh(new T.CylinderGeometry(r, r, delta.length(), 8), material, name);
      m.position.copy(start.add(end).multiplyScalar(.5));
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
      return m;
    }
    function makeGeometry(vertices, indices, uvs) {
      var geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      if (uvs) geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
    }
    function patch(points, material, depth, z, name) {
      var shape = new T.Shape();
      points.forEach(function (p, i) { if (i) shape.lineTo(p[0], p[1]); else shape.moveTo(p[0], p[1]); });
      shape.closePath();
      var m = mesh(new T.ExtrudeGeometry(shape, { depth: depth || .007, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .002, bevelThickness: .002 }), material, name);
      m.position.z = z || .09; return m;
    }
    function ribbon(points, width, material, name) {
      var vertices = [], indices = [];
      points.forEach(function (p, i) {
        vertices.push(p[0] - width / 2, p[1], p[2], p[0] + width / 2, p[1], p[2]);
        if (i) { var n = i * 2; indices.push(n - 2, n, n - 1, n - 1, n, n + 1); }
      });
      return mesh(makeGeometry(vertices, indices), material || seamMat, name || 'stitched-seam');
    }

    // Hook sits at zero; the wood shoulders remain visible above the neckline.
    var hook = mesh(new T.TorusGeometry(.052, .007, 6, 16, Math.PI * 1.55), wire, 'metal-hanger-hook');
    hook.position.set(0, -.051, -.012); hook.rotation.z = -.35;
    rod([.038, -.075, -.012], [0, -.15, -.012], .006, wire, 'hanger-neck');
    rod([0, -.15, -.012], [-.365, -.285, -.012], .021, wood, 'wood-hanger-left');
    rod([0, -.15, -.012], [.365, -.285, -.012], .021, wood, 'wood-hanger-right');
    rod([-.365, -.285, -.012], [.365, -.285, -.012], .011, wood, 'hanger-trouser-bar');

    // Front and back are joined at all four boundaries, giving the cloth volume.
    var cols = 24, rows = 34, stride = cols + 1, sideCount = stride * (rows + 1);
    var vertices = [], indices = [], uvs = [];
    function bodyPoint(u, v, back) {
      var width = .27 - .025 * Math.sin(v * Math.PI) + (kurta ? .015 : .007) * v;
      var x = u * width;
      var neck = .075 * Math.exp(-u * u * 16) * (1 - v);
      var y = -.275 - v * (length - .29) - neck;
      y += Math.sin(u * 6 + .4) * .009 * Math.pow(v, 3);
      var fold = (Math.sin(u * 12 + v * 1.8) * .011 + Math.sin(u * 25 - v * 2.7) * .005) * (.25 + .75 * v);
      var dome = .035 + .045 * (1 - u * u) * (.65 + .35 * Math.sin(v * Math.PI));
      return [x, y, (back ? -1 : 1) * (dome + fold)];
    }
    for (var side = 0; side < 2; side++) {
      for (var row = 0; row <= rows; row++) for (var col = 0; col <= cols; col++) {
        var p = bodyPoint(col / cols * 2 - 1, row / rows, side === 1);
        vertices.push(p[0], p[1], p[2]); uvs.push(col / cols, 1 - row / rows);
        if (row < rows && col < cols) {
          var a = side * sideCount + row * stride + col, b = a + 1, c = a + stride, d = c + 1;
          if (!side) indices.push(a, c, b, b, c, d); else indices.push(a, b, c, b, d, c);
        }
      }
    }
    function join(a, b) { indices.push(a, b, a + sideCount, b, b + sideCount, a + sideCount); }
    for (var edge = 0; edge < cols; edge++) { join(edge + 1, edge); join(rows * stride + edge, rows * stride + edge + 1); }
    for (var edgeRow = 0; edgeRow < rows; edgeRow++) { join(edgeRow * stride, (edgeRow + 1) * stride); join((edgeRow + 1) * stride + cols, edgeRow * stride + cols); }
    mesh(makeGeometry(vertices, indices, uvs), fabric, 'draped-cotton-body');

    // Elliptical sleeves follow a curved centerline, with compressions at elbows.
    [-1, 1].forEach(function (sign) {
      var sv = [], si = [], su = [], rings = tee ? 8 : 15, around = 12;
      var sleeveEnd = tee ? -.54 : (kurta ? -.95 : -.87);
      for (var r = 0; r <= rings; r++) {
        var t = r / rings, cx = sign * (.235 + .175 * t + .015 * Math.sin(t * Math.PI));
        var cy = -.32 + (sleeveEnd + .32) * t;
        var dx = sign * (.175 + .015 * Math.PI * Math.cos(t * Math.PI)), dy = sleeveEnd + .32;
        var mag = Math.sqrt(dx * dx + dy * dy), nx = -dy / mag, ny = dx / mag;
        var radius = (tee ? .125 - .025 * t : .122 - .055 * t);
        for (var s = 0; s <= around; s++) {
          var angle = s / around * Math.PI * 2;
          var wave = 1 + .055 * Math.sin(t * 24 + angle * 3) * Math.sin(t * Math.PI);
          var rad = radius * wave;
          sv.push(cx + nx * Math.cos(angle) * rad, cy + ny * Math.cos(angle) * rad, Math.sin(angle) * rad * .68);
          su.push(s / around, 1 - t);
          if (r < rings && s < around) {
            var a = r * (around + 1) + s, b = a + 1, c = a + around + 1, d = c + 1;
            si.push(a, b, c, b, d, c);
          }
        }
      }
      mesh(makeGeometry(sv, si, su), fabric, sign < 0 ? 'left-draped-sleeve' : 'right-draped-sleeve');
      if (!tee) {
        var cuff = mesh(new T.CylinderGeometry(.068, .064, .064, 12, 1, true), trim, 'turned-cuff');
        cuff.scale.z = .68; cuff.position.set(sign * .41, sleeveEnd, 0);
        cuff.rotation.z = sign * .28;
        var cb = mesh(new T.SphereGeometry(.008, 8, 5), buttonMat, 'cuff-button');
        cb.scale.z = .4; cb.position.set(sign * .417, sleeveEnd, .047);
      }
    });

    if (tee) {
      var neckBand = mesh(new T.TorusGeometry(.085, .012, 6, 20, Math.PI), trim, 'ribbed-tee-neck');
      neckBand.rotation.z = Math.PI; neckBand.position.set(0, -.28, .082); neckBand.scale.y = .7;
      patch([[-.19, -.53], [.19, -.53], [.19, -.64], [-.19, -.64]], new T.MeshStandardMaterial({ color: 0x566344, roughness: .95 }), .002, .085, 'woven-chest-band');
    } else {
      var placket = [], startY = kurta ? -.345 : -.34, endY = kurta ? -.77 : -length + .025;
      for (var s = 0; s <= 18; s++) {
        var y = startY + (endY - startY) * s / 18;
        var v = Math.min(1, (-y - .31) / (length - .31));
        var bp = bodyPoint(0, v, false);
        placket.push([0, y, bp[2] + .008]);
      }
      ribbon(placket, .028, trim, 'button-placket');
      var count = kurta ? 4 : 6;
      for (var button = 0; button < count; button++) {
        var by = startY - .055 + (endY - startY + .09) * button / (count - 1);
        var bv = Math.min(1, (-by - .31) / (length - .31));
        var ball = mesh(new T.SphereGeometry(.0085, 8, 6), buttonMat, 'sewn-button');
        ball.scale.z = .35; ball.position.set(0, by, bodyPoint(0, bv, false)[2] + .015);
      }
      if (kurta) {
        var collar = mesh(new T.CylinderGeometry(.085, .092, .046, 18, 1, true, .2, Math.PI * 2 - .4), trim, 'standing-kurta-collar');
        collar.scale.z = .64; collar.position.set(0, -.285, .021); collar.rotation.y = Math.PI;
      } else {
        patch([[-.09, -.255], [-.015, -.33], [-.075, -.44], [-.158, -.31]], trim, .008, .087, 'folded-left-collar');
        patch([[.09, -.255], [.015, -.33], [.075, -.44], [.158, -.31]], trim, .008, .087, 'folded-right-collar');
      }
      // A layered breast pocket sits against the curved chest, with a turned lip.
      patch([[.105, -.48], [.219, -.48], [.217, -.615], [.163, -.637], [.105, -.615]], fabric, .004, .078, 'breast-pocket');
      rod([.108, -.483, .087], [.215, -.483, .087], .0017, seamMat, 'pocket-top-stitch');
    }

    // The hem and side stitching follow the same drape as the fabric mesh.
    var hemPoints = [];
    for (var h = 0; h <= 24; h++) {
      var hp = bodyPoint(h / 12 - 1, .988, false);
      hemPoints.push([hp[0], hp[1], hp[2] + .003]);
    }
    // One small mesh follows the hem, keeping each garment's draw count low.
    var hemVertices = [], hemIndices = [];
    hemPoints.forEach(function (p, i) {
      var before = hemPoints[Math.max(0, i - 1)], after = hemPoints[Math.min(hemPoints.length - 1, i + 1)];
      var dx = after[0] - before[0], dy = after[1] - before[1], distance = Math.sqrt(dx * dx + dy * dy);
      var ox = dy / distance * .0013, oy = -dx / distance * .0013;
      hemVertices.push(p[0] + ox, p[1] + oy, p[2], p[0] - ox, p[1] - oy, p[2]);
      if (i) { var n = i * 2; hemIndices.push(n - 2, n, n - 1, n - 1, n, n + 1); }
    });
    mesh(makeGeometry(hemVertices, hemIndices), seamMat, 'hem-stitch');
    group.userData.garmentLength = length;
    return group;
  };
})();
