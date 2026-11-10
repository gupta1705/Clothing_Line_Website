/* Authored Poly Haven furniture. See assets/models/office/README.md for CC0 sources.
   create() preserves the meshes and maps, and returns a centered, floor-aligned Group. */
(function () {
  'use strict';
  var entries = {
    chair: { file:'chair.glb', title:'Plastic Monobloc Chair 01', author:'Kuutti Siitonen', id:'plastic_monobloc_chair_01' },
    desk: { file:'desk.glb', title:'Metal Office Desk', author:'Ulan Cabanilla', id:'metal_office_desk' },
    table: { file:'table.glb', title:'Wooden Table 02', author:'Serhii Khromov', id:'wooden_table_02' },
    jug: { file:'jug.glb', title:'Metal Jug', author:'Anzor Lezhava', id:'metal_jug' },
    books: { file:'books.glb', title:'Book Encyclopedia Set 01', author:'John Malcolm', id:'book_encyclopedia_set_01' },
    binder: { file:'binder.glb', title:'Binder Notebook', author:'DaDrood', id:'binder_notebook' },
    stationery: { file:'stationery.glb', title:'Stationery Supplies', author:'Mateusz Sadek', id:'stationery_supplies' }
  };

  window.loadPanchayatOfficeProps = async function (T, renderer) {
    if (!T || !T.GLTFLoader) throw new Error('The office furniture loader is unavailable.');
    var templates = {}, instances = [], manifest = {}, disposed = false;
    var geometries = new Set(), materials = new Set(), textures = new Set(), closedImages = new Set();
    var anisotropy = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
    Object.keys(entries).forEach(function (key) {
      manifest[key] = Object.assign({}, entries[key], { source:'https://polyhaven.com/a/' + entries[key].id, license:'CC0-1.0', front:'+Z', up:'+Y' });
    });

    function trackMaterial(material) {
      if (!material) return;
      materials.add(material);
      Object.keys(material).forEach(function (key) {
        var texture = material[key];
        if (texture && texture.isTexture) { texture.anisotropy = anisotropy; textures.add(texture); }
      });
    }
    function track(root) {
      root.traverse(function (mesh) {
        if (!mesh.isMesh) return;
        geometries.add(mesh.geometry);
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(trackMaterial);
      });
    }
    function release() {
      if (disposed) return;
      disposed = true;
      instances.forEach(function (group) { if (group.parent) group.parent.remove(group); });
      geometries.forEach(function (geometry) { geometry.dispose(); });
      materials.forEach(function (material) { material.dispose(); });
      textures.forEach(function (texture) {
        texture.dispose();
        (Array.isArray(texture.image) ? texture.image : [texture.image]).forEach(function (img) {
          if (img && typeof img.close === 'function' && !closedImages.has(img)) { img.close(); closedImages.add(img); }
        });
      });
      instances.length = 0; templates = {};
    }
    function disposeLate(root) {
      var gs = new Set(), ms = new Set(), ts = new Set(), images = new Set();
      root.traverse(function (mesh) {
        if (!mesh.isMesh) return;
        gs.add(mesh.geometry);
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(function (material) {
          ms.add(material);
          Object.keys(material).forEach(function (key) { if (material[key] && material[key].isTexture) ts.add(material[key]); });
        });
      });
      gs.forEach(function (g) { g.dispose(); }); ms.forEach(function (m) { m.dispose(); });
      ts.forEach(function (t) {
        t.dispose();
        if (t.image && typeof t.image.close === 'function' && !images.has(t.image)) { t.image.close(); images.add(t.image); }
      });
    }
    async function load(key) {
      var controller = new AbortController(), timedOut = false, timer;
      var pending = (async function () {
        var response = await fetch('lab/office-3d/assets/models/office/' + manifest[key].file, { signal:controller.signal });
        if (!response.ok) throw new Error('Could not load ' + manifest[key].title + '.');
        var gltf = await new T.GLTFLoader().parseAsync(await response.arrayBuffer(), '');
        if (timedOut || disposed) { disposeLate(gltf.scene); throw new Error('Office furniture loading was cancelled.'); }
        track(gltf.scene); templates[key] = gltf.scene;
        gltf.scene.updateMatrixWorld(true);
        var box = new T.Box3().setFromObject(gltf.scene), size = box.getSize(new T.Vector3());
        if (!Number.isFinite(size.x + size.y + size.z) || size.lengthSq() === 0) throw new Error('Invalid furniture bounds: ' + key);
        manifest[key].nativeSize = { width:size.x, height:size.y, depth:size.z };
        manifest[key].parts = gltf.scene.children.map(function (part) { return part.name; });
      })();
      try {
        await Promise.race([pending, new Promise(function (_, reject) {
          timer = setTimeout(function () { timedOut = true; controller.abort(); reject(new Error('Office furniture took too long to load.')); }, 45000);
        })]);
      } finally { clearTimeout(timer); }
    }
    var results = await Promise.allSettled(Object.keys(manifest).map(load));
    var failed = results.find(function (result) { return result.status === 'rejected'; });
    if (failed) { release(); throw failed.reason; }

    function create(key, options) {
      if (disposed) throw new Error('The furniture library has been closed.');
      options = options || {};
      var requestedKey = key;
      if (key === 'book') key = 'books';
      if (!templates[key]) throw new Error('Unknown office prop: ' + key);
      var model = templates[key].clone(true), content = new T.Group(), outer = new T.Group();
      outer.name = 'authored-office-' + requestedKey;
      var part = options.part;
      if (key === 'binder') part = options.variant === 'closed' ? 'binder_notebook_closed' : 'binder_notebook';
      if (key === 'stationery' && part && part.indexOf('stationery_supplies_') !== 0) part = 'stationery_supplies_' + part;
      var bookIndex = requestedKey === 'book' ? (options.index == null ? 0 : options.index) : options.book;
      if (bookIndex != null) {
        var index = Math.max(0, Math.min(model.children.length - 1, Math.floor(bookIndex)));
        part = model.children[index].name;
      }
      if (part) {
        var selected = model.getObjectByName(part);
        if (!selected) throw new Error('Unknown ' + key + ' part: ' + part);
        // All source variations are top-level nodes; retain their authored local transforms.
        model = selected.clone(true);
      }
      var copies = new Map();
      model.traverse(function (mesh) {
        if (!mesh.isMesh) return;
        function copy(original) {
          if (copies.has(original)) return copies.get(original);
          var material = original.clone();
          if (options.color != null && material.color) material.color.set(options.color);
          if (options.envMapIntensity != null) material.envMapIntensity = options.envMapIntensity;
          trackMaterial(material); copies.set(original, material); return material;
        }
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(copy) : copy(mesh.material);
        mesh.castShadow = options.castShadow !== false;
        mesh.receiveShadow = options.receiveShadow !== false;
      });
      content.add(model); outer.add(content);
      if (options.rotationX) content.rotation.x = options.rotationX;
      if (options.rotationZ) content.rotation.z = options.rotationZ;
      content.updateMatrixWorld(true);
      var bounds = new T.Box3().setFromObject(content), size = bounds.getSize(new T.Vector3()), center = bounds.getCenter(new T.Vector3());
      var targets = [];
      if (options.height > 0 && size.y > 0) targets.push(options.height / size.y);
      if (options.width > 0 && size.x > 0) targets.push(options.width / size.x);
      if (options.depth > 0 && size.z > 0) targets.push(options.depth / size.z);
      var scale = targets.length ? Math.min.apply(Math, targets) : 1;
      content.scale.setScalar(scale);
      content.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
      outer.rotation.y = options.rotationY || 0;
      outer.userData.asset = key;
      outer.userData.source = manifest[key].source;
      outer.userData.author = manifest[key].author;
      outer.userData.license = 'CC0-1.0';
      outer.userData.size = { width:size.x * scale, height:size.y * scale, depth:size.z * scale };
      outer.userData.part = part || null;
      instances.push(outer); return outer;
    }
    return { create:create, dispose:release, manifest:manifest };
  };
})();
