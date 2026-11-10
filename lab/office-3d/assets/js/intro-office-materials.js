/* Photographic, CC0 Poly Haven surfaces. UV coordinates are measured in metres.
   See assets/models/office-materials/README.md for original scans and scale. */
(function () {
  'use strict';

  var baseURL = new URL('../models/office-materials/', document.currentScript ? document.currentScript.src : new URL('lab/office-3d/assets/js/intro-office-materials.js', document.baseURI)).href;
  var manifest = {
    upper: { id: 'plastered_wall_04', metres: [3.2, 3.2], color: 0xffefd1, normal: .24, roughness: .94, ao: .25 },
    lower: { id: 'yellow_plaster', metres: [2, 2], color: 0xe9ca83, normal: .27, roughness: .92, ao: .3 },
    floor: { id: 'grey_tiles', metres: [2.2, 2.2], color: 0xf0eee3, normal: .45, roughness: .86, ao: .62 },
    wood: { id: 'wood_table_001', metres: [1.5, 1.5], color: 0xbaa48a, normal: .32, roughness: .82, ao: .35 },
    cloth: { id: 'stretch_poplin', metres: [.291, .2808], color: 0x387a52, normal: .38, roughness: 1, ao: .25 },
    metal: { id: 'blue_metal_plate', metres: [2.5, 2.5], color: 0xd2c6b7, normal: .2, roughness: .82, ao: .35 }
  };
  Object.keys(manifest).forEach(function (key) {
    manifest[key].source = 'https://polyhaven.com/a/' + manifest[key].id;
    manifest[key].license = 'CC0-1.0';
  });

  window.loadPanchayatOfficeMaterials = async function (T, renderer) {
    if (!T || !T.TextureLoader) throw new Error('The office texture loader is unavailable.');
    var textures = new Set(), materials = {}, controllers = new Set(), objectURLs = new Set();
    var closedImages = new Set(), disposed = false;
    var anisotropy = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
    var loader = new T.TextureLoader();

    function release() {
      if (disposed) return;
      disposed = true;
      controllers.forEach(function (controller) { controller.abort(); });
      objectURLs.forEach(function (url) { URL.revokeObjectURL(url); });
      objectURLs.clear();
      Object.keys(materials).forEach(function (key) { materials[key].dispose(); });
      textures.forEach(function (texture) {
        texture.dispose();
        var image = texture.image;
        if (image && typeof image.close === 'function' && !closedImages.has(image)) {
          closedImages.add(image); image.close();
        }
      });
    }

    async function loadMap(key, kind) {
      var controller = new AbortController(), objectURL, timer, expired = false;
      controllers.add(controller);
      var operation = (async function () {
        var response = await fetch(baseURL + key + '-' + kind + '.jpg', { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load the office ' + key + ' texture.');
        var blob = await response.blob();
        if (disposed || expired) throw new Error('Office texture loading ended.');
        objectURL = URL.createObjectURL(blob); objectURLs.add(objectURL);
        var texture = await new Promise(function (resolve, reject) {
          loader.load(objectURL, function (loaded) {
            if (disposed || expired) { loaded.dispose(); reject(new Error('Office texture loading ended.')); return; }
            resolve(loaded);
          }, undefined, reject);
        });
        if (disposed || expired) { texture.dispose(); throw new Error('Office texture loading ended.'); }
        texture.name = 'photographic-' + key + '-' + kind;
        texture.colorSpace = kind === 'diffuse' ? T.SRGBColorSpace : T.NoColorSpace;
        texture.wrapS = texture.wrapT = T.RepeatWrapping;
        texture.repeat.set(1 / manifest[key].metres[0], 1 / manifest[key].metres[1]);
        texture.anisotropy = anisotropy;
        // AO uses the same metre-based UVs as the scan's other maps.
        texture.channel = 0;
        texture.needsUpdate = true;
        textures.add(texture);
        return texture;
      })();
      try {
        return await Promise.race([operation, new Promise(function (_, reject) {
          timer = setTimeout(function () {
            expired = true; controller.abort();
            reject(new Error('The office materials took too long to load. Please retry.'));
          }, 25000);
        })]);
      } finally {
        clearTimeout(timer); controllers.delete(controller);
        if (objectURL) { URL.revokeObjectURL(objectURL); objectURLs.delete(objectURL); }
      }
    }

    var results = await Promise.allSettled(Object.keys(manifest).map(async function (key) {
      var spec = manifest[key];
      var maps = await Promise.all(['diffuse', 'nor_gl', 'rough', 'ao'].map(function (kind) { return loadMap(key, kind); }));
      if (disposed) throw new Error('The office materials have been closed.');
      var material = new T.MeshStandardMaterial({
        name: 'photographic-' + spec.id,
        color: spec.color,
        map: maps[0], normalMap: maps[1], roughnessMap: maps[2], aoMap: maps[3],
        roughness: spec.roughness,
        metalness: key === 'metal' ? .08 : 0,
        aoMapIntensity: spec.ao,
        side: key === 'cloth' ? T.DoubleSide : T.FrontSide
      });
      material.normalScale.set(spec.normal, spec.normal);
      material.userData.source = spec.source;
      material.userData.license = spec.license;
      material.userData.metresPerTile = spec.metres.slice();
      material.userData.worldUV = true;
      materials[key] = material;
    }));
    var failure = results.find(function (result) { return result.status === 'rejected'; });
    if (failure) { release(); throw failure.reason; }
    return { materials: materials, dispose: release, manifest: manifest };
  };
})();
