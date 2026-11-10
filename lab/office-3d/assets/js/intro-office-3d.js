/* Panchayat's office, reconstructed from production stills with scanned
   furniture, photographic PBR surfaces and working architectural openings. */
(function () {
  'use strict';

  window.buildPanchayatOffice = function (T, scene, resources) {
    resources = resources || {}; var props = resources.props, scanned = resources.materials || {};
    var boxGeometry = new T.BoxGeometry(1, 1, 1);
    var cylinderCache = {};
    var seed = 27461;
    function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function canvasTexture(width, height, paint) {
      var canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      paint(canvas.getContext('2d'), width, height);
      var texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      texture.wrapS = texture.wrapT = T.RepeatWrapping;
      texture.anisotropy = 4;
      return texture;
    }
    function plaster(base, shade) {
      return canvasTexture(512, 512, function (c, w, h) {
        c.fillStyle = base; c.fillRect(0, 0, w, h);
        // Broad uneven limewash, without repeated dark circular blotches.
        for (var i = 0; i < 26; i++) {
          var x = random() * w, y = random() * h, r = 90 + random() * 210;
          var g = c.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(' + shade + ',0.022)'); g.addColorStop(1, 'rgba(' + shade + ',0)');
          c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
        }
        for (var j = 0; j < 7000; j++) {
          c.fillStyle = random() > .5 ? 'rgba(255,248,221,.035)' : 'rgba(65,53,34,.018)';
          c.fillRect(random() * w, random() * h, 1 + random(), 1);
        }
      });
    }
    function dataTexture(width, height, paint) {
      var texture = canvasTexture(width, height, paint);
      texture.colorSpace = T.NoColorSpace;
      return texture;
    }
    var plasterBump = dataTexture(256, 256, function (c, w, h) {
      c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 7000; i++) {
        var value = 117 + Math.floor(random() * 22);
        c.fillStyle = 'rgb(' + value + ',' + value + ',' + value + ')';
        c.fillRect(random() * w, random() * h, 1 + random() * 2, 1);
      }
    });
    plasterBump.repeat.set(5, 2);
    var upperMap = plaster('#d6c9a4', '109,89,54');
    var lowerMap = plaster('#c59d3c', '96,69,30');
    var paperMap = canvasTexture(512, 256, function (c, w, h) {
      c.fillStyle = '#d4ccb4'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 2 + Math.floor(random() * 3)) {
        c.strokeStyle = 'rgba(92,82,59,' + (.12 + random() * .18) + ')';
        c.lineWidth = .4 + random() * .65; c.beginPath(); c.moveTo(0, y);
        for (var x = 0; x <= w; x += 24) c.lineTo(x, y + (random() - .5) * 1.7);
        c.stroke();
        c.fillStyle = 'rgba(250,241,214,.16)'; c.fillRect(0, y + 1, w, .7);
      }
      for (var i = 0; i < 35; i++) {
        var cx = random() * w, cy = random() * h, g = c.createRadialGradient(cx, cy, 0, cx, cy, 18 + random() * 54);
        g.addColorStop(0, 'rgba(141,109,57,.08)'); g.addColorStop(1, 'rgba(141,109,57,0)');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      }
    });
    var baseWearMap = canvasTexture(1024, 256, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      for (var i = 0; i < 95; i++) {
        var x = random() * w, top = h * (.22 + random() * .65), spread = 9 + random() * 29;
        var g = c.createLinearGradient(0, top, 0, h);
        g.addColorStop(0, 'rgba(91,73,42,0)'); g.addColorStop(.6, 'rgba(91,73,42,.045)'); g.addColorStop(1, 'rgba(91,73,42,.12)');
        c.fillStyle = g; c.beginPath(); c.moveTo(x - spread, h); c.bezierCurveTo(x - spread * .6, top + 25, x, top + 25, x + spread * .25, top); c.bezierCurveTo(x + spread * .6, top + 50, x + spread, h - 30, x + spread, h); c.fill();
      }
      for (var k = 0; k < 160; k++) {
        var px = random() * w, py = h * (.66 + random() * .34), r = 1 + random() * 7;
        c.fillStyle = k % 3 ? 'rgba(195,184,151,.4)' : 'rgba(93,80,51,.13)';
        c.beginPath(); c.moveTo(px - r, py); c.lineTo(px - r * .3, py - r * .65); c.lineTo(px + r * .8, py - r * .3); c.lineTo(px + r, py + r * .5); c.lineTo(px - r * .6, py + r * .7); c.fill();
      }
    });
    var windowWearMap = canvasTexture(512, 768, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      // Damp rings sit outside the frame; the transparent middle stays clean.
      for (var i = 0; i < 65; i++) {
        var side = i % 2, x = side ? w * (.84 + random() * .1) : w * (.05 + random() * .1);
        var y = random() * h, g = c.createRadialGradient(x, y, 0, x, y, 12 + random() * 29);
        g.addColorStop(0, 'rgba(96,76,42,.14)'); g.addColorStop(1, 'rgba(96,76,42,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      }
      for (var j = 0; j < 30; j++) {
        var xx = 25 + random() * (w - 50), yy = h * .89;
        var g2 = c.createLinearGradient(0, yy, 0, h); g2.addColorStop(0, 'rgba(93,75,45,.11)'); g2.addColorStop(1, 'rgba(93,75,45,0)');
        c.fillStyle = g2; c.fillRect(xx, yy, 2 + random() * 4, h - yy);
      }
    });
    var metalMap = canvasTexture(512, 512, function (c, w, h) {
      c.fillStyle = '#82857f'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 1200; i++) {
        c.fillStyle = random() > .55 ? 'rgba(238,239,226,.025)' : 'rgba(41,47,44,.025)';
        c.fillRect(random() * w, random() * h, .5 + random(), 5 + random() * 26);
      }
      c.strokeStyle = 'rgba(191,193,177,.24)'; c.lineWidth = .6;
      for (var j = 0; j < 18; j++) {
        var x = random() * w, y = random() * h;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + random() * 13, y + random() * 3); c.stroke();
      }
      // Sparse worn paint along folded edges, never an all-over rust texture.
      for (var k = 0; k < 80; k++) {
        var edge = k % 3, px = edge === 0 ? random() * 9 : edge === 1 ? w - random() * 9 : random() * w;
        var py = edge === 2 ? h - random() * 12 : random() * h;
        c.fillStyle = k % 4 ? 'rgba(63,65,55,.24)' : 'rgba(115,75,45,.28)';
        c.fillRect(px, py, .6 + random() * 2, 1 + random() * 5);
      }
      var g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(25,29,25,.075)'); g.addColorStop(.15, 'rgba(255,255,255,.018)'); g.addColorStop(.9, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(28,32,27,.08)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    });
    var metalBump = dataTexture(256, 512, function (c, w, h) {
      c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
      [[.69,.62,.22],[.23,.84,.13]].forEach(function (dent) {
        var x = w * dent[0], y = h * dent[1], r = w * dent[2];
        var g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(25,25,25,.19)'); g.addColorStop(.72, 'rgba(78,78,78,.04)'); g.addColorStop(1, 'rgba(128,128,128,0)');
        c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r);
      });
      for (var i = 0; i < 1800; i++) {
        c.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.025)';
        c.fillRect(random() * w, random() * h, .7, 3 + random() * 20);
      }
    });
    function woodGrain(c, w, h, heightMap) {
      c.fillStyle = heightMap ? '#808080' : '#71543e'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 210; i++) {
        var y = i * h / 210, offset = Math.sin(i * .59) * 1.4;
        c.strokeStyle = heightMap ? (i % 4 ? 'rgba(30,30,30,.16)' : 'rgba(235,235,235,.2)') : (i % 4 ? 'rgba(47,30,19,.12)' : 'rgba(207,163,112,.14)');
        c.lineWidth = i % 5 ? .45 : 1.1; c.beginPath();
        for (var x = 0; x <= w; x += 8) {
          var drift = Math.sin(x / 71 + i * .08) * 1.6 + Math.sin(x / 123 + i * .19) * 2.1;
          // A single irregular knot bends the grain instead of painting stripes.
          var knot = Math.exp(-Math.pow((x - w * .68) / 60, 2)) * Math.sin((y - h * .46) / 12) * 9;
          if (!x) c.moveTo(x, y + offset + drift + knot); else c.lineTo(x, y + offset + drift + knot);
        }
        c.stroke();
      }
    }
    var timberMap = canvasTexture(512, 256, function (c, w, h) { woodGrain(c, w, h, false); });
    var timberBump = dataTexture(512, 256, function (c, w, h) { woodGrain(c, w, h, true); });
    var clothMap = canvasTexture(512, 512, function (c, w, h) {
      c.fillStyle = '#08736a'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < w; i += 2) {
        c.fillStyle = i % 4 ? 'rgba(0,38,34,.16)' : 'rgba(111,167,136,.13)'; c.fillRect(i, 0, 1, h);
      }
      for (var j = 0; j < h; j += 2) {
        c.fillStyle = j % 4 ? 'rgba(0,40,36,.1)' : 'rgba(161,185,144,.11)'; c.fillRect(0, j, w, 1);
      }
      var g = c.createRadialGradient(130, 90, 20, 130, 90, 460); g.addColorStop(0, 'rgba(78,129,98,.12)'); g.addColorStop(1, 'rgba(0,20,17,.16)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    });
    var tileMap = canvasTexture(1024, 1024, function (c, w, h) {
      c.fillStyle = '#968d75'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
        var n = Math.floor(random() * 17);
        c.fillStyle = 'rgb(' + (159 + n) + ',' + (153 + n) + ',' + (132 + n) + ')';
        c.fillRect(x * 256 + 2, y * 256 + 2, 252, 252);
        for (var k = 0; k < 9; k++) {
          var cx = x * 256 + random() * 256, cy = y * 256 + random() * 256;
          var g = c.createRadialGradient(cx, cy, 0, cx, cy, 65 + random() * 65);
          g.addColorStop(0, 'rgba(81,78,61,.035)'); g.addColorStop(1, 'rgba(81,78,61,0)');
          c.fillStyle = g; c.fillRect(x * 256, y * 256, 256, 256);
        }
      }
      for (var i = 0; i < 25000; i++) { c.fillStyle = i % 2 ? 'rgba(238,230,200,.07)' : 'rgba(50,49,38,.045)'; c.fillRect(random() * w, random() * h, 1.5, 1.5); }
    }); tileMap.repeat.set(3, 3);
    var tileBump = dataTexture(512, 512, function (c, w, h) {
      c.fillStyle = '#555555'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
        var level = 128 + Math.floor(random() * 7);
        c.fillStyle = 'rgb(' + level + ',' + level + ',' + level + ')';
        c.fillRect(x * 128 + 1, y * 128 + 1, 126, 126);
        c.strokeStyle = 'rgba(230,230,230,.16)'; c.lineWidth = 1;
        c.strokeRect(x * 128 + 2, y * 128 + 2, 124, 124);
      }
      for (var i = 0; i < 14000; i++) {
        c.fillStyle = i % 2 ? 'rgba(220,220,220,.055)' : 'rgba(20,20,20,.055)';
        c.fillRect(random() * w, random() * h, 1, 1);
      }
    }); tileBump.repeat.set(3, 3);
    var exteriorMap = canvasTexture(256, 512, function (c, w, h) {
      var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#dbe1cd'); g.addColorStop(.5, '#c4c99a'); g.addColorStop(1, '#7a8657'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 110; i++) { c.fillStyle = 'rgba(' + (52 + Math.floor(random() * 35)) + ',' + (70 + Math.floor(random() * 45)) + ',40,.12)'; c.beginPath(); c.arc(random() * w, 110 + random() * h, 12 + random() * 27, 0, Math.PI * 2); c.fill(); }
    });

    function mat(color, roughness, extra) { return new T.MeshStandardMaterial(Object.assign({ color: color, roughness: roughness == null ? .86 : roughness }, extra || {})); }
    var m = {
      upper: mat('#ffffff', .98, { map: upperMap, bumpMap: plasterBump, bumpScale: .002 }), lower: mat('#ffffff', .98, { map: lowerMap, bumpMap: plasterBump, bumpScale: .002 }),
      floor: mat('#ffffff', .86, { map: tileMap, bumpMap: tileBump, bumpScale: .009 }), skirting: mat('#8b754d'),
      metal: mat('#ffffff', .8, { map: metalMap, bumpMap: metalBump, bumpScale: .003, metalness: .08 }), darkMetal: mat('#333b37', .72, { metalness: .18 }),
      foldedMetal: mat('#6b716b', .84, { metalness: .08 }),
      window: mat('#526768', .7, { metalness: .2 }), wood: mat('#ffffff', .8, { map: timberMap, bumpMap: timberBump, bumpScale: .0025 }),
      edge: mat('#493626'), cloth: mat('#ffffff', .98, { map: clothMap, side: T.DoubleSide }),
      plastic: mat('#bcaa80', .65), plasticDark: mat('#9c8d69', .75), chair: mat('#585a50', .85),
      chrome: mat('#a6a79a', .38, { metalness: .75 }), paper: mat('#ffffff', 1, { map: paperMap }),
      paperEdge: mat('#bdb69d', 1, { map: paperMap }), black: mat('#242b26', .75), cardboard: mat('#937b55'),
      redCloth: mat('#873f2c'), glass: mat('#d8e1cc', .18, { transparent: true, opacity: .5 }),
      tea: mat('#a37543', .4), clay: mat('#c6bda1'),
      view: new T.MeshBasicMaterial({ color: '#e7ecde', toneMapped:false })
    };
    Object.keys(scanned).forEach(function(key){if(m[key]){m[key]=scanned[key];m[key].userData.worldScale=1;}});
    var geometryCache = {};
    function b(parent, w, h, d, x, y, z, material, shadows) {
      var geo = boxGeometry;
      if(material && material.userData.worldScale){
        var key=[w,h,d,material.userData.worldScale].join(':');
        if(!geometryCache[key]){
          geo=new T.BoxGeometry(w,h,d);var pos=geo.attributes.position,uv=geo.attributes.uv,n=geo.attributes.normal,s=material.userData.worldScale;
          for(var i=0;i<uv.count;i++){if(Math.abs(n.getY(i))>.5)uv.setXY(i,pos.getX(i)/s,pos.getZ(i)/s);else if(Math.abs(n.getX(i))>.5)uv.setXY(i,pos.getZ(i)/s,pos.getY(i)/s);else uv.setXY(i,pos.getX(i)/s,pos.getY(i)/s);}
          geometryCache[key]=geo;
        }else geo=geometryCache[key];
      }
      var mesh = new T.Mesh(geo, material); if(geo===boxGeometry)mesh.scale.set(w,h,d);mesh.position.set(x,y,z);
      mesh.castShadow = shadows!==false && !(material.transparent || material.isMeshBasicMaterial); mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    function bevelPanel(parent, w, h, d, x, y, z, material, radius) {
      // Real rolled sheet edges catch a narrow highlight in close-up.
      var r = Math.min(radius || .006, d * .25), hw = w / 2 - r, hh = h / 2 - r;
      var shape = new T.Shape(); shape.moveTo(-hw, -hh); shape.lineTo(hw, -hh); shape.lineTo(hw, hh); shape.lineTo(-hw, hh); shape.closePath();
      var geometry = new T.ExtrudeGeometry(shape, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, steps: 1, curveSegments: 1 });
      geometry.translate(0, 0, -d / 2 + r);
      var pos = geometry.attributes.position, uv = geometry.attributes.uv, normals = geometry.attributes.normal;
      for (var i = 0; i < uv.count; i++) {
        var nx = Math.abs(normals.getX(i)), ny = Math.abs(normals.getY(i)), nz = Math.abs(normals.getZ(i));
        var realUV=material.userData.worldScale;
        if (ny > nx && ny > nz) uv.setXY(i, pos.getX(i) / (realUV||w) + .5, pos.getZ(i) / (realUV||d) + .5);
        else if (nx > nz) uv.setXY(i, pos.getZ(i) / (realUV||d) + .5, pos.getY(i) / (realUV||h) + .5);
        else uv.setXY(i, pos.getX(i) / (realUV||w) + .5, pos.getY(i) / (realUV||h) + .5);
      }
      var panel = new T.Mesh(geometry, material); panel.position.set(x, y, z); panel.castShadow = true; panel.receiveShadow = true; parent.add(panel); return panel;
    }
    function cyl(parent, radius, height, x, y, z, material, segments) {
      var key = (segments || 12); if (!cylinderCache[key]) cylinderCache[key] = new T.CylinderGeometry(1, 1, 1, key);
      var mesh = new T.Mesh(cylinderCache[key], material); mesh.scale.set(radius, height, radius); mesh.position.set(x, y, z); mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    function group(parent, x, y, z, ry) { var g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; parent.add(g); return g; }
    function label(parent, text, width, height, x, y, z, options) {
      options = options || {};
      var map = options.photo ? new T.TextureLoader().load('lab/office-3d/assets/models/office-reference/'+options.photo+'.webp',resources.invalidate) : canvasTexture(512, 512 * height / width, function (c, w, h) {
        c.fillStyle = options.background || '#ded5b8'; c.fillRect(0, 0, w, h);
        if (options.border) { c.strokeStyle = options.border; c.lineWidth = 8; c.strokeRect(8, 8, w - 16, h - 16); }
        c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = options.ink || '#454638';
        var lines = text.split('\n'); var size = options.fontSize || Math.min(65, h / (lines.length + 1));
        c.font = (options.weight || '500') + ' ' + size + 'px "Nirmala UI", Arial, sans-serif';
        lines.forEach(function (line, i) { c.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.35, w - 36); });
        if (options.lines) { c.strokeStyle = '#a29d82'; c.lineWidth = 2; for (var j = 0; j < options.lines; j++) { var ly = h * .32 + j * h * .065; c.beginPath(); c.moveTo(w * .13, ly); c.lineTo(w * (.78 + random() * .1), ly); c.stroke(); } }
      });
      map.colorSpace=T.SRGBColorSpace;
      var material = new T.MeshStandardMaterial({ map: map, roughness: 1, side: T.DoubleSide });
      var plane = new T.Mesh(new T.PlaneGeometry(width, height), material); plane.position.set(x, y, z); parent.add(plane); return plane;
    }
    // Soft static grounding complements the directional light without a render pass.
    var contactMap = canvasTexture(128, 128, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      var g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.38, 'rgba(255,255,255,.6)');
      g.addColorStop(.7, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    });
    contactMap.wrapS = contactMap.wrapT = T.ClampToEdgeWrapping;
    var contactGeo = new T.PlaneGeometry(1, 1), contactMaterials = {};
    function contactShadow(parent, x, z, w, d, strength) {
      var key = strength || .3;
      if (!contactMaterials[key]) contactMaterials[key] = new T.MeshBasicMaterial({ map: contactMap, color: '#28261f', transparent: true, opacity: key, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      var shadow = new T.Mesh(contactGeo, contactMaterials[key]); shadow.name = 'soft-contact-shadow';
      shadow.rotation.x = -Math.PI / 2; shadow.scale.set(w, d, 1); shadow.position.set(x, -.006, z);
      parent.add(shadow); return shadow;
    }

    // Cut the windows through the masonry, allowing daylight and grille shadows in.
    b(scene, 11.2, 1.1, .16, 0, .55, -4.38, m.lower);
    var wallTop=3.7, windowBottom=1.14, windowTop=3.04;
    b(scene,11.2,.04,.16,0,1.12,-4.38,m.upper);
    b(scene,11.2,wallTop-windowTop,.16,0,(wallTop+windowTop)/2,-4.38,m.upper);
    [[-5.6,-3.865],[-2.735,-.78],[.34,5.6]].forEach(function(part){b(scene,part[1]-part[0],windowTop-windowBottom,.16,(part[1]+part[0])/2,(windowTop+windowBottom)/2,-4.38,m.upper);});
    b(scene, .16, 1.1, 8.2, -5.58, .55, -.28, m.lower);
    b(scene,.16,.05,8.2,-5.58,1.125,-.28,m.upper);
    b(scene,.16,.65,8.2,-5.58,3.375,-.28,m.upper);
    [[-4.38,-1.48],[-.16,3.82]].forEach(function(part){b(scene,.16,1.9,part[1]-part[0],-5.58,2.1,(part[1]+part[0])/2,m.upper);});
    b(scene, .16, 1.1, 8.2, 5.58, .55, -.28, m.lower);
    b(scene, .16, 2.6, 8.2, 5.58, 2.4, -.28, m.upper);
    b(scene, 11.2, .07, 12.6, 0, -.045, 1.9, m.floor);
    b(scene,11.2,.12,8.2,0,3.76,-.28,m.upper);
    b(scene, 11, .105, .06, 0, .05, -4.27, m.skirting);
    b(scene, .06, .105, 8.2, -5.47, .05, -.28, m.skirting);
    b(scene, .06, .105, 8.2, 5.47, .05, -.28, m.skirting);
    b(scene, 11.1, .17, .16, 0, 3.56, -4.22, m.upper);
    b(scene, .16, .17, 8, -5.43, 3.56, -.22, m.upper);
    b(scene, .16, .17, 8, 5.43, 3.56, -.22, m.upper);

    function wearDecal(parent, map, w, h, x, y, z, ry) {
      var material = new T.MeshStandardMaterial({ map: map, roughness: 1, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      var mesh = new T.Mesh(new T.PlaneGeometry(w, h), material); mesh.position.set(x, y, z); mesh.rotation.y = ry || 0; parent.add(mesh);
    }
    wearDecal(scene, baseWearMap, 11, .65, 0, .33, -4.291, 0);
    wearDecal(scene, baseWearMap, 8.15, .65, -5.491, .33, -.28, Math.PI / 2);
    wearDecal(scene, baseWearMap, 8.15, .65, 5.491, .33, -.28, -Math.PI / 2);

    function barredWindow(parent, x, y, z, rotation, width) {
      var win = group(parent, x, y, z, rotation), w = width || 1.15, h = 1.9;
      wearDecal(win, windowWearMap, w + .45, h + .49, 0, -.04, -.103, 0);
      // Deep plaster reveals, an exterior view and separate metal grille.
      b(win,.095,h+.19,.24,-w/2-.048,0,-.08,m.upper);b(win,.095,h+.19,.24,w/2+.048,0,-.08,m.upper);
      b(win,w,.095,.24,0,h/2+.048,-.08,m.upper);b(win,w,.095,.24,0,-h/2-.048,-.08,m.upper);
      b(win,w,h,.015,0,0,-.32,m.view,false);
      b(win, w + .08, .055, .14, 0, h / 2, .08, m.window);
      b(win, w + .08, .055, .14, 0, -h / 2, .08, m.window);
      b(win, .055, h, .14, -w / 2, 0, .08, m.window);
      b(win, .055, h, .14, w / 2, 0, .08, m.window);
      for (var i = -2; i <= 2; i++) b(win, .018, h, .018, i * w / 5, 0, .14, m.window);
      for (var j = -4; j <= 4; j++) b(win, w, .018, .018, 0, j * h / 10, .155, m.window);
      b(win, w + .23, .07, .25, 0, -h / 2 - .07, .095, m.upper);
      var shutter = group(win, -w / 2, 0, .11, -.9);
      b(shutter, w * .45, h * .97, .035, w * .225, 0, 0, m.window);
      b(shutter, .025, h * .9, .035, w * .2, 0, .027, m.darkMetal);
      return win;
    }
    barredWindow(scene, -3.3, 2.09, -4.19, 0, 1.13);
    barredWindow(scene, -.22, 2.09, -4.19, 0, 1.12);
    barredWindow(scene, -5.4, 2.1, -.82, Math.PI / 2, 1.32);

    // Static documents are instanced, so their rich clutter has few draw calls.
    var filePalette = [m.paper, m.paperEdge, mat('#9b6745'), mat('#9c853f'), mat('#526d74'), mat('#655947'), mat('#856258')];
    var fileInstances = filePalette.map(function () { return []; });
    function fileBox(which, w, h, d, x, y, z, ry) { fileInstances[which].push([w, h, d, x, y, z, ry || 0]); }
    function fileStack(x, y, z, count, width, depth) {
      if(window.buildPanchayatOfficeDetails)return y;
      var height = y;
      for (var i = 0; i < count; i++) {
        var w = (width || .48) * (.76 + random() * .27), d = (depth || .32) * (.78 + random() * .24);
        var h = .013 + random() * .043, dx = (random() - .5) * .1, dz = (random() - .5) * .085, ry = (random() - .5) * .3;
        fileBox(0, w, h, d, x + dx, height + h / 2, z + dz, ry);
        fileBox(2 + Math.floor(random() * 5), w + .008, .005, d + .01, x + dx, height + h + .003, z + dz, ry);
        if (i % 2 === 0) fileBox(1, w, .003, d + .004, x + dx, height + h * .45, z + dz, ry);
        if (i % 3 === 1) {
          fileBox(0, w * .93, .002, d * .98, x + dx + .025, height + h + .007, z + dz + .023, ry + .09);
          fileBox(0, w * .95, .002, d * 1.03, x + dx - .018, height + h + .01, z + dz + .014, ry - .04);
        }
        height += h + .009;
      }
      return height;
    }
    function cubby(x, y, z, width, height, depth) {
      b(scene, width, height, .035, x, y, z - depth / 2, m.wood);
      b(scene, .045, height, depth, x - width / 2, y, z, m.wood);
      b(scene, .045, height, depth, x + width / 2, y, z, m.wood);
      for (var i = 0; i < 3; i++) b(scene, width, .035, depth, x, y - height / 2 + i * height / 2, z, m.wood);
      fileStack(x - width * .2, y - height / 2 + .025, z + .02, 6, width * .48, depth * .85);
      fileStack(x + width * .23, y + .025, z + .02, 5, width * .43, depth * .9);
      fileStack(x, y + height / 2 + .025, z, 5, width * .82, depth * .83);
      // A few tall upright orange/yellow files among the paper bundles.
      for (var k = 0; k < 4; k++) {
        var book = b(scene, .04, height * .39, depth * .7, x + width * .17 + k * .047, y - height * .27, z, filePalette[2 + k % 3]); book.rotation.z = -.14 + k * .035;
      }
    }
    cubby(-1.76, 2.15, -4.03, 1.02, 1.25, .37);
    cubby(1.16, 2.65, -4.03, .95, .78, .37);
    function rack(x, z, width, height) {
      var depth = .52;
      contactShadow(scene, x, z + .04, width + .38, depth + .6, .4);
      [-1, 1].forEach(function (sign) {
        [-1, 1].forEach(function (front) { b(scene, .034, height, .034, x + sign * width / 2, height / 2, z + front * depth / 2, m.darkMetal); });
      });
      for (var j = 0; j < 5; j++) {
        var y = .13 + j * (height - .18) / 4;
        b(scene, width + .04, .033, depth + .03, x, y, z, m.darkMetal);
        b(scene, width, .075, .018, x, y - .025, z + depth / 2, m.darkMetal);
        if (j < 4) { fileStack(x - width * .23, y + .025, z, 5 + j % 3, width * .43, .43); fileStack(x + width * .23, y + .025, z + .015, 4 + j % 3, width * .43, .41); }
      }
      b(scene, width * .46, .43, .44, x - width * .22, height + .16, z, m.cardboard);
      fileStack(x + width * .25, height - .025, z, 5, width * .42, .4);
      if(!window.buildPanchayatOfficeDetails){var bundle = b(scene, .33, .09, .31, x - width * .22, height + .43, z, m.redCloth); bundle.rotation.y = .17;}
    }
    rack(4.55, -3.95, 1.3, 2.75);
    rack(-4.78, -3.95, 1.04, 2.65);

    // Computer workstation behind Sachiv ji's desk.
    var secondary = group(scene, -.12, 0, -3.42);
    contactShadow(secondary, 0, .05, 2.7, 1.2, .32);
    if(props){var oldTable=props.create('table',{height:.79});oldTable.scale.x*=1.25;secondary.add(oldTable);}else{
      b(secondary, 2.2, .07, .7, 0, .78, 0, m.wood, true);
      [-1, 1].forEach(function (s) { b(secondary, .07, .78, .65, s * 1.03, .39, 0, m.edge); });
      b(secondary, .72, .6, .6, .67, .4, -.02, m.wood);
    }
    b(secondary, .76, .49, .075, -.43, 1.1, -.11, m.black, true);
    b(secondary, .69, .41, .012, -.43, 1.11, -.065, mat('#354342', .55));
    b(secondary, .055, .19, .075, -.43, .87, -.11, m.black);
    b(secondary, .33, .025, .23, -.43, .824, -.08, m.black);
    b(secondary, .21, .43, .36, -.96, 1.03, -.02, m.black);
    b(secondary, .018, .12, .012, -.94, 1.12, .168, m.chrome);
    var keyboard = b(secondary, .56, .018, .18, -.4, .826, .2, m.black); keyboard.rotation.y = .06;
    fileStack(.62, .83, -3.45, 5, .51, .4);
    fileStack(.67, .12, -3.3, 5, .47, .39);

    // Weathered electrical plates and visible conduit are characteristic of the set.
    function switchPlate(x, y, z) {
      b(scene, .21, .25, .035, x, y, z, m.clay);
      for (var i = -1; i <= 1; i++) b(scene, .024, .062, .013, x + i * .051, y + .025, z + .022, m.paper);
      cyl(scene, .014, .026, x + .047, y - .063, z + .025, m.black, 8).rotation.x = Math.PI / 2;
    }
    if(!window.buildPanchayatOfficeDetails){switchPlate(.56, 1.63, -4.18); switchPlate(3.87, 2.16, -4.17);b(scene, .018, 1.36, .018, 3.97, 2.99, -4.17, m.clay);}
    label(scene, '', .53, .88, 3.65, 2.85, -4.17, {photo:'scheme-poster'});
    label(scene, '', .22, .34, -2.48, 1.68, -4.17, {photo:'cubby-notice'});
    label(scene, '', .19, .28, -2.48, 2.05, -4.17, { background: '#d3cbb1', lines: 8 });

    // Green-covered Sachiv desk; a rippled cloth drape is geometry, not a flat image.
    var desk = group(scene, -1.04, 0, -.32);
    contactShadow(desk, 0, .05, 2.9, 1.65, .36);
    if(props){var oldDesk=props.create('desk',{height:.87});var deskBounds=new T.Box3().setFromObject(oldDesk).getSize(new T.Vector3());oldDesk.scale.x*=2.35/deskBounds.x;oldDesk.scale.z*=1.1/deskBounds.z;oldDesk.rotation.y=Math.PI;desk.add(oldDesk);}else{
    b(desk, 2.35, .065, 1.1, 0, .85, 0, m.wood, true);
    [-1, 1].forEach(function (s) {
      b(desk, .055, .82, .055, s * 1.07, .41, .45, m.darkMetal);
      b(desk, .055, .82, .055, s * 1.07, .41, -.45, m.darkMetal);
      b(desk, .045, .035, .92, s * 1.07, .18, 0, m.darkMetal);
    });
    b(desk, 2.14, .035, .04, 0, .19, -.45, m.darkMetal);
    b(desk, .55, .71, .98, -.74, .42, -.015, m.wood, true);
    }
    // One continuous cloth surface wraps the tabletop and gathers at its corners.
    var clothGeo=new T.PlaneGeometry(3.04,1.83,112,72),cp=clothGeo.attributes.position,cu=clothGeo.attributes.uv;
    for(var ci=0;ci<cp.count;ci++){
      var u=cp.getX(ci),v=cp.getY(ci),ox=Math.max(0,Math.abs(u)-1.19),oz=Math.max(0,Math.abs(v)-.565),drop=Math.max(ox,oz)+Math.min(ox,oz)*.35;
      var fold=Math.sin(u*23+Math.sin(u*8)*.8)*.018+Math.sin(u*47)*.003;
      var px=Math.max(-1.19,Math.min(1.19,u))+Math.sign(u)*ox*.08+Math.sin(v*26+u)*ox*.12;
      var pz=Math.max(-.565,Math.min(.565,v))+Math.sign(v)*oz*.06+fold*(oz/.35);
      var py=.899-drop+Math.sin(u*14+v*8)*.002+Math.sin(v*27)*.0015+Math.sin(u*21)*drop*.018;
      cp.setXYZ(ci,px,py,pz);cu.setXY(ci,u+1.52,v+.915);
    }
    clothGeo.computeVertexNormals();var deskcloth=new T.Mesh(clothGeo,m.cloth);deskcloth.castShadow=true;deskcloth.receiveShadow=true;desk.add(deskcloth);
    fileStack(-1.79, .91, -.45, 3, .57, .4); fileStack(-.33, .91, -.63, 4, .58, .42);
    if(!window.buildPanchayatOfficeDetails){var openBook = b(desk, .52, .019, .34, -.55, .913, .24, m.paper); openBook.rotation.y = -.12;b(desk, .012, .021, .34, -.55, .913, .24, m.paperEdge).rotation.y = -.12;}
    var nameplate = group(desk, .4, .925, .43, -.05);
    b(nameplate, .62, .15, .055, 0, .045, 0, m.edge);
    label(nameplate, 'अभिषेक त्रिपाठी', .59, .12, 0, .045, .03, { background: '#483a2c', ink: '#eee4c9', fontSize: 67 });
    // Small desk organiser, pen pot, stamps and clear chai glasses.
    b(desk, .3, .12, .16, .06, .96, .08, m.edge); b(desk, .29, .05, .055, .06, 1.025, .135, m.wood);
    cyl(desk, .055, .145, -.17, .969, .1, m.chrome, 12);
    [-.027, 0, .025].forEach(function (x, i) { var p = cyl(desk, .004, .23 + i * .018, -.17 + x, 1.04, .1, i % 2 ? m.black : m.window, 6); p.rotation.z = x * 4; });
    cyl(desk, .024, .07, -.3, .95, .26, m.redCloth, 10); cyl(desk, .04, .012, -.3, .918, .26, m.black, 10);
    b(desk, .095, .052, .085, -.42, .929, .3, mat('#d5b24b', .55));
    function chai(parent, x, y, z) { cyl(parent, .036, .09, x, y + .045, z, m.glass, 12); cyl(parent, .031, .052, x, y + .028, z, m.tea, 12); }
    chai(desk, .81, .906, .31); chai(desk, -.91, .906, .25);
    b(desk, .15, .024, .2, -.86, .93, -.08, m.black).rotation.y = -.12;

    // Shared moulded-chair geometry. The slots are real holes, not painted bars.
    function roundedRect(shape, x, y, w, h, r) {
      shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y); shape.closePath(); return shape;
    }
    var backShape = new T.Shape();
    backShape.moveTo(-.264, .43); backShape.lineTo(.264, .43); backShape.lineTo(.278, .92);
    backShape.quadraticCurveTo(.275, .98, .22, .997); backShape.quadraticCurveTo(0, 1.055, -.22, .997);
    backShape.quadraticCurveTo(-.275, .98, -.278, .92); backShape.lineTo(-.264, .43); backShape.closePath();
    for (var slot = -2; slot <= 2; slot++) {
      var slotX = slot * .076, slotHeight = .31 - Math.abs(slot) * .014;
      backShape.holes.push(roundedRect(new T.Shape(), slotX - .018, .592, .036, slotHeight, .016));
    }
    var backGeo = new T.ExtrudeGeometry(backShape, { depth: .032, bevelEnabled: true, bevelThickness: .006, bevelSize: .006, bevelSegments: 2, curveSegments: 5, steps: 1 });
    var bp = backGeo.attributes.position;
    for (var vi = 0; vi < bp.count; vi++) {
      var vx = bp.getX(vi), vy = bp.getY(vi), bend = Math.max(0, (vy - .43) / .6);
      bp.setZ(vi, bp.getZ(vi) - .275 - .078 * bend - .046 * (1 - Math.pow(vx / .29, 2)) * bend);
    }
    backGeo.computeVertexNormals();
    var seatShape = roundedRect(new T.Shape(), -.287, -.269, .574, .54, .075);
    var seatGeo = new T.ExtrudeGeometry(seatShape, { depth: .035, bevelEnabled: true, bevelThickness: .008, bevelSize: .007, bevelSegments: 2, curveSegments: 6, steps: 1 });
    seatGeo.rotateX(-Math.PI / 2);
    var sp = seatGeo.attributes.position;
    for (var si = 0; si < sp.count; si++) {
      var sx = sp.getX(si), sz = sp.getZ(si);
      sp.setY(si, sp.getY(si) + .416 - .012 * Math.max(0, 1 - Math.pow(sx / .29, 2)) * Math.max(0, 1 - Math.pow(sz / .28, 2)));
    }
    seatGeo.computeVertexNormals();
    var legGeo = new T.CylinderGeometry(.037, .023, .42, 4, 1); legGeo.rotateY(Math.PI / 4);
    var armGeometries = [-1, 1].map(function (side) {
      var curve = new T.CatmullRomCurve3([
        new T.Vector3(side * .263, .44, .185), new T.Vector3(side * .29, .595, .18),
        new T.Vector3(side * .31, .664, .12), new T.Vector3(side * .313, .68, -.08),
        new T.Vector3(side * .295, .695, -.23), new T.Vector3(side * .265, .73, -.31)
      ]);
      return new T.TubeGeometry(curve, 15, .022, 7, false);
    });
    function plasticChair(x, z, rotation) {
      var chair = group(scene, x, 0, z, rotation);
      contactShadow(chair, 0, -.015, .96, 1.05, .28);
      if(props){chair.add(props.create('chair',{height:1.03,color:0xd9c9ac}));return chair;}
      [seatGeo, backGeo].forEach(function (geo) { var mesh = new T.Mesh(geo, m.plastic); mesh.castShadow = true; mesh.receiveShadow = true; chair.add(mesh); });
      [-1, 1].forEach(function (side, index) {
        [-1, 1].forEach(function (end) {
          var leg = new T.Mesh(legGeo, m.plastic); leg.position.set(side * .236, .211, end * .213);
          leg.rotation.z = -side * .075; leg.rotation.x = end * .08; leg.castShadow = true; leg.receiveShadow = true; chair.add(leg);
        });
        var arm = new T.Mesh(armGeometries[index], m.plastic); arm.castShadow = true; arm.receiveShadow = true; chair.add(arm);
      });
      return chair;
    }
    plasticChair(.76, 1.29, .27); plasticChair(2.42, .52, -.65);
    plasticChair(-3.06, .44, .85);
    plasticChair(1.06, -2.6, -.38);
    // Sachiv's woven office chair faces the desk from behind.
    var chair = group(scene, -1.05, 0, -1.38);
    contactShadow(chair, 0, -.04, 1.0, 1.05, .3);
    b(chair, .59, .07, .53, 0, .47, 0, m.chair, true);
    b(chair, .6, .61, .04, 0, .8, -.22, m.chair, true);
    for (var i = -6; i <= 6; i++) b(chair, .012, .55, .045, i * .043, .8, -.215, m.plasticDark);
    cyl(chair, .038, .4, 0, .22, 0, m.darkMetal);
    for (var j = 0; j < 5; j++) { var foot = b(chair, .045, .04, .38, 0, .07, -.12, m.darkMetal); var pivot = group(chair, 0, 0, 0, j * Math.PI * 2 / 5); pivot.add(foot); }
    [-1, 1].forEach(function (s) { b(chair, .035, .23, .03, s * .31, .58, .12, m.darkMetal); b(chair, .065, .04, .43, s * .31, .7, -.02, m.chair); });

    // The small foreground bench from the production still.
    var bench = group(scene, -.65, 0, 2.05, -.025);
    contactShadow(bench, 0, 0, 2.65, .93, .28);
    bevelPanel(bench, 2.22, .065, .54, 0, .41, 0, m.wood, .007);
    [-1, 1].forEach(function (s) { [-1, 1].forEach(function (f) { b(bench, .035, .4, .035, s * 1.02, .2, f * .21, m.darkMetal); }); b(bench, .035, .035, .43, s * 1.02, .06, 0, m.darkMetal); });
    b(bench, 2.08, .035, .035, 0, .07, -.21, m.darkMetal);
    var tray = b(bench, .39, .025, .24, -.65, .459, 0, m.clay); tray.rotation.y = .14;

    // Functional almirah: its doors pivot at real outer-edge hinges.
    var cabinet = group(scene, 2.65, 0, -3.5);
    contactShadow(cabinet, 0, .08, 2.7, 1.2, .44);
    var cw = 2.12, ch = 2.12, cd = .72, base = .13;
    bevelPanel(cabinet, cw, .075, cd, 0, base, 0, m.metal, .006);
    bevelPanel(cabinet, cw, .055, cd, 0, ch + base, 0, m.metal, .006);
    bevelPanel(cabinet, .06, ch, cd, -cw / 2 + .03, ch / 2 + base, 0, m.metal, .006);
    bevelPanel(cabinet, .06, ch, cd, cw / 2 - .03, ch / 2 + base, 0, m.metal, .006);
    b(cabinet, cw - .09, ch, .045, 0, ch / 2 + base, -cd / 2, m.metal);
    b(cabinet, cw - .1, .045, cd - .05, 0, .43, -.015, m.metal);
    [-1, 1].forEach(function (s) { b(cabinet, .09, .14, .62, s * .92, .07, 0, m.darkMetal); });
    var rod = cyl(cabinet, .017, 1.96, 0, 1.77, .02, m.chrome, 12); rod.rotation.z = Math.PI / 2;
    var leftDoor = group(cabinet, -1.025, 0, .386), rightDoor = group(cabinet, 1.025, 0, .386);
    bevelPanel(leftDoor, 1.015, 2.05, .045, .5075, 1.19, 0, m.metal, .006);
    bevelPanel(rightDoor, 1.015, 2.05, .045, -.5075, 1.19, 0, m.metal, .006);
    b(leftDoor, .006, 2.01, .012, 1.001, 1.19, .025, m.foldedMetal);
    b(rightDoor, .007, 2.01, .014, -.998, 1.19, .025, m.metal);
    bevelPanel(rightDoor, .15, .028, .038, -.83, 1.05, .052, m.chrome, .004);
    [-.885, -.775].forEach(function (x) { cyl(rightDoor, .014, .027, x, 1.05, .037, m.chrome, 10).rotation.x = Math.PI / 2; });
    var lock = cyl(rightDoor, .026, .025, -.83, .94, .05, m.chrome, 12); lock.rotation.x = Math.PI / 2;
    b(rightDoor, .006, .016, .004, -.83, .942, .065, m.black);
    [leftDoor, rightDoor].forEach(function (door, index) {
      var cx = index ? -.5075 : .5075;
      // Narrow folded returns and welded reinforcement are visible when doors swing out.
      b(door, .89, .006, .004, cx, .205, .023, m.foldedMetal);
      b(door, .89, .006, .004, cx, 2.174, .023, m.foldedMetal);
      b(door, .025, 1.93, .025, cx + (index ? .43 : -.43), 1.19, -.026, m.foldedMetal);
      [.55, 1.86].forEach(function (y) { cyl(door, .021, .1, 0, y, -.005, m.chrome, 8); });
      for (var n = 0; n < 4; n++) b(door, .17, .009, .003, (index ? -.75 : .75), .29 + n * .022, .025, m.darkMetal);
    });
    label(leftDoor, 'धूम्रपान\nनिषेध', .23, .3, .66, 1.75, .025, { background: '#ded8c5', ink: '#a1513e', fontSize: 77 });
    label(rightDoor, '', .33, .46, -.64, 1.69, .025, {photo:'cabinet-paper'});
    fileStack(2.11, 2.28, -3.51, 4, .82, .53); fileStack(3.17, 2.28, -3.51, 5, .83, .51);
    // A small stack remains on the lower shelf when the clothing display opens.
    b(cabinet, .48, .09, .39, -.59, .5, -.05, m.paper); b(cabinet, .5, .007, .41, -.59, .549, -.05, filePalette[4]);

    // Actual hooks and rail along the right wall for the casuals collection.
    var casualAnchor = group(scene, 5.2, 2.25, 0, -Math.PI / 2);
    var rail = cyl(casualAnchor, .016, 2.66, 0, .04, -.04, m.darkMetal, 12); rail.rotation.z = Math.PI / 2;
    [-1.2, 1.2].forEach(function (x) { b(casualAnchor, .055, .08, .26, x, .04, -.15, m.darkMetal); });
    [-1, 0, 1].forEach(function (x) { cyl(casualAnchor, .018, .11, x, -.007, .015, m.chrome, 10); });
    label(casualAnchor, 'सचिव जी', .75, .19, 0, .39, -.12, { background: '#d8cba4', ink: '#6a573b', fontSize: 80 });

    // Ceiling fan built around a central pivot; root controls its slow rotation.
    var fan = group(scene, -.1, 3.25, -.8);
    cyl(fan, .025, .47, 0, .23, 0, m.darkMetal, 10);
    cyl(fan, .12, .075, 0, -.015, 0, m.plasticDark, 20);
    for (var blade = 0; blade < 3; blade++) {
      var arm = group(fan, 0, -.06, 0, blade * Math.PI * 2 / 3);
      b(arm, .045, .014, .65, 0, 0, .29, m.plasticDark);
      var shape = new T.Shape(); shape.moveTo(-.055, .25); shape.lineTo(-.11, .91); shape.quadraticCurveTo(0, 1.04, .15, .92); shape.lineTo(.08, .25); shape.closePath();
      var bladeMesh = new T.Mesh(new T.ShapeGeometry(shape), new T.MeshStandardMaterial({ color: '#7d795e', roughness: .7, side: T.DoubleSide }));
      bladeMesh.rotation.x = Math.PI / 2; arm.add(bladeMesh);
    }

    var transform = new T.Object3D();
    fileInstances.forEach(function (list, index) {
      if (!list.length) return;
      var instances = new T.InstancedMesh(boxGeometry, filePalette[index], list.length);
      instances.receiveShadow = true;
      list.forEach(function (p, i) { transform.position.set(p[3], p[4], p[5]); transform.scale.set(p[0], p[1], p[2]); transform.rotation.set(0, p[6], 0); transform.updateMatrix(); instances.setMatrixAt(i, transform.matrix); });
      instances.instanceMatrix.needsUpdate = true; scene.add(instances);
    });

    var result = {
      cabinet: { group: cabinet, leftDoor: leftDoor, rightDoor: rightDoor, center: new T.Vector3(2.65, 1.25, -3.1), garmentRailY: 1.77 },
      desk: desk, casualAnchor: casualAnchor, fan: fan, secondary:secondary, bench:bench,
      overview: { position: new T.Vector3(3.8, 2.65, 8.4), target: new T.Vector3(0, 1.35, -1.4) },
      kurtaView: { position: new T.Vector3(2.65, 1.58, -.08), target: new T.Vector3(2.65, 1.16, -3.38) },
      casualView: { position: new T.Vector3(1.45, 1.7, .18), target: new T.Vector3(5.2, 1.48, 0) }
    };
    if(window.buildPanchayatOfficeDetails)result.details=window.buildPanchayatOfficeDetails(T,scene,result,resources);
    return result;
  };
})();
