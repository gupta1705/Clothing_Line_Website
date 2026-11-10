/* Authored, licensed GLB demo garments. Only their display placement and
   optional tee colorway change here; original meshes and texture maps stay intact. */
(function () {
  'use strict';
  var manifest = {
    shirt: { file:'collared-shirt.glb', label:'The everyday shirt', author:'Kodie Russell', source:'https://sketchfab.com/3d-models/dickies-long-sleeve-shirt-f6f27327fbaf423081ae9da8e5dc109e', hangerWidth:.17 },
    tee: { file:'studio-tee.glb', label:'Soft cotton tee', author:'ttv.thuyvy', source:'https://sketchfab.com/3d-models/shirt-baked-803c1f1527824c3baf62693b9afc4e13', hangerWidth:.25 },
    jacket: { file:'studio-jacket.glb', label:'The quilted jacket', author:'oluwaphemi', source:'https://sketchfab.com/3d-models/puffer-jacket-7d95660645834760a0a638775e5fe4a7', hangerWidth:.245 }
  };

  window.loadPanchayatGarments = async function (T, renderer) {
    if (!T || !T.GLTFLoader) throw new Error('The garment model loader is unavailable.');
    var loader = new T.GLTFLoader(), templates = {}, instances = [], disposed = false;
    var anisotropy = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
    var ownedGeometries = new Set(), ownedMaterials = new Set(), ownedTextures = new Set(), closedImages = new Set();

    function trackMaterial(material) {
      if (!material) return;
      ownedMaterials.add(material);
      Object.keys(material).forEach(function (key) {
        var value = material[key];
        if (value && value.isTexture) { value.anisotropy = anisotropy; ownedTextures.add(value); }
      });
    }
    function trackScene(scene) {
      scene.traverse(function (m) {
        if (!m.isMesh) return;
        ownedGeometries.add(m.geometry);
        (Array.isArray(m.material) ? m.material : [m.material]).forEach(trackMaterial);
        m.castShadow = true; m.receiveShadow = true;
      });
    }
    function release() {
      if (disposed) return;
      disposed = true;
      instances.forEach(function (g) { if (g.parent) g.parent.remove(g); });
      ownedGeometries.forEach(function (g) { g.dispose(); });
      ownedMaterials.forEach(function (m) { m.dispose(); });
      ownedTextures.forEach(function (tex) {
        tex.dispose();
        var images = Array.isArray(tex.image) ? tex.image : [tex.image];
        images.forEach(function (img) {
          if (img && typeof img.close === 'function' && !closedImages.has(img)) { img.close(); closedImages.add(img); }
        });
      });
      instances.length = 0; templates = {};
    }
    async function load(key) {
      var url = 'lab/office-3d/assets/models/intro-demo/' + manifest[key].file;
      var controller = new AbortController(), timedOut = false, timer;
      var pending = (async function () {
        var response = await fetch(url, { signal:controller.signal });
        if (!response.ok) throw new Error('Could not load the ' + manifest[key].label + ' demo.');
        var gltf = await loader.parseAsync(await response.arrayBuffer(), '');
        if (timedOut || disposed) {
          // Parsing image data may finish after a fetch timeout: reclaim it too.
          var gs=new Set(),ms=new Set(),ts=new Set(),imgs=new Set();
          gltf.scene.traverse(function(m){if(!m.isMesh)return;gs.add(m.geometry);(Array.isArray(m.material)?m.material:[m.material]).forEach(function(mat){ms.add(mat);Object.keys(mat).forEach(function(k){if(mat[k]&&mat[k].isTexture)ts.add(mat[k]);});});});
          gs.forEach(function(g){g.dispose();});ms.forEach(function(m){m.dispose();});ts.forEach(function(t){t.dispose();if(t.image&&typeof t.image.close==='function'&&!imgs.has(t.image)){imgs.add(t.image);t.image.close();}});
          throw new Error('Garment loading ended before the model was ready.');
        }
        trackScene(gltf.scene); templates[key] = gltf.scene; return gltf.scene;
      })();
      try {
        return await Promise.race([pending,new Promise(function(_,reject){timer=setTimeout(function(){timedOut=true;controller.abort();reject(new Error('The garment preview took too long to load. Please retry.'));},30000);})]);
      } finally { clearTimeout(timer); }
    }
    var results = await Promise.allSettled(Object.keys(manifest).map(load));
    var failed = results.find(function (r) { return r.status === 'rejected'; });
    if (failed) { release(); throw failed.reason; }

    function create(config) {
      if (disposed) throw new Error('The garment library has been closed.');
      config = config || {};
      var key = manifest[config.asset] ? config.asset : 'tee', entry = manifest[key];
      var outer = new T.Group(), content = new T.Group(), model = templates[key].clone(true);
      outer.name = 'authored-demo-' + key; content.add(model); outer.add(content);
      var materialCopies = new Map();
      model.traverse(function (m) {
        if (!m.isMesh) return;
        function cloneMaterial(original) {
          if (materialCopies.has(original)) return materialCopies.get(original);
          var material = original.clone();
          // The tee is a neutral authored mesh; preserve its weave normal and AO.
          // Shirt/jacket albedo, roughness and hardware retain their authored finish.
          if (key === 'tee' && config.color != null) material.color.setHex(config.color);
          trackMaterial(material); materialCopies.set(original,material); return material;
        }
        m.material = Array.isArray(m.material) ? m.material.map(cloneMaterial) : cloneMaterial(m.material);
        m.castShadow = true; m.receiveShadow = true;
      });
      model.updateMatrixWorld(true);
      var bounds = new T.Box3().setFromObject(model), size = bounds.getSize(new T.Vector3()), center = bounds.getCenter(new T.Vector3());
      if (!Number.isFinite(size.x+size.y+size.z) || !size.x || !size.y) throw new Error('The garment model has invalid dimensions.');
      var scale = Math.min(.93 / size.x, 1.24 / size.y);
      model.position.x -= center.x; model.position.z -= center.z; model.position.y -= bounds.max.y;
      content.scale.setScalar(scale); content.position.y = -.17;
      // The small display hanger is separate from the unmodified clothing mesh.
      var wood = new T.MeshStandardMaterial({ color:0x8f663e,roughness:.7 });
      var steel = new T.MeshStandardMaterial({ color:0xa7aaa7,metalness:.82,roughness:.26 });
      trackMaterial(wood);trackMaterial(steel);
      function addPart(geometry,material,name) {
        ownedGeometries.add(geometry);var m=new T.Mesh(geometry,material);m.name=name;m.castShadow=true;m.receiveShadow=true;outer.add(m);return m;
      }
      function rod(a,b,r,material,name) {
        var start=new T.Vector3(a[0],a[1],a[2]),end=new T.Vector3(b[0],b[1],b[2]),delta=end.clone().sub(start);
        var m=addPart(new T.CylinderGeometry(r,r,delta.length(),10),material,name);
        m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
      }
      var hook=addPart(new T.TorusGeometry(.036,.0045,8,24,Math.PI*1.65),steel,'display-hanger-hook');
      hook.position.set(0,-.039,-.025);hook.rotation.z=-.25;
      rod([.024,-.064,-.025],[0,-.125,-.025],.0045,steel,'display-hanger-neck');
      rod([0,-.125,-.025],[-entry.hangerWidth,-.26,-.025],.012,wood,'display-hanger-left');
      rod([0,-.125,-.025],[entry.hangerWidth,-.26,-.025],.012,wood,'display-hanger-right');
      outer.userData.label = config.label || entry.label;
      outer.userData.asset = key; outer.userData.productId = config.id || null;
      outer.userData.author = entry.author; outer.userData.source = entry.source;
      outer.userData.license = 'CC-BY-4.0'; outer.userData.demo = true;
      outer.userData.garmentLength = size.y * scale + .17;
      instances.push(outer);return outer;
    }
    return { create:create, dispose:release, manifest:manifest };
  };
})();
