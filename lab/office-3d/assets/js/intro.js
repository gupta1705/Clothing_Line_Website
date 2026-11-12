/* Real-time 3D office opening; the storefront below remains independent. */
(function () {
 'use strict';
 var html=document.documentElement, intro=document.getElementById('intro');
 if(!intro || !html.classList.contains('intro-on')) return;
 var reduced=matchMedia('(prefers-reduced-motion: reduce)'), T=window.PanchayatThree;
 var hidden=[], room='village', leaving=false, disposed=false, lastTrigger, raf=0, timers=[];
 var renderer,scene,camera,office,raycaster,pointer,garmentKey,garmentFill,modelLibrary,officeMaterials,officeProps,composer,aoPass,environmentTarget,inspection,selected,zoomed=false,inspectionYaw=0,animations=[],garments=[],pickMeshes=[];
 var pane=intro.querySelector('.intro-detail'), products=intro.querySelector('#intro-products'), status=intro.querySelector('#intro-status');
 var inspectControls=intro.querySelector('.intro-inspect');
 var host=intro.querySelector('#office-canvas'), frameTime=0, lastTime=0, activeUntil=0, doorAngle=0, roomStarted=0;
 var width=innerWidth,height=innerHeight,low=width<650 || navigator.deviceMemory<=4;
 var cameraGoal,targetGoal,currentTarget,parallax={x:0,y:0},dragYaw=0,dragStart=null,dragDistance=0;
 var roomData={
  kurtas:{eyebrow:'01 / THE ALMIRAH',title:'A wardrobe, waiting.',copy:'Open the steel doors and get closer to the cloth. Demo garments for now; the final kurtas will take their place.',collection:'shop.html?c=kurtas'},
  casuals:{eyebrow:'02 / SACHIV JI’S OFFICE',title:'Everyday in Phulera.',copy:'Pick a hanging piece. Turn it around, explore the folds and get a closer look. Preview garments ahead of the final collection.',collection:'shop.html?edit=Phulera%20Everyday'}
 };
 function animate(el,frames,opts){
  if(window.PanchayatMotion&&!reduced.matches){try{var a=PanchayatMotion.animate(el,frames,opts);animations.push(a);return a;}catch(e){}}
  Object.keys(frames).forEach(function(k){var v=frames[k];el.style[k]=Array.isArray(v)?v[v.length-1]:v;});
 }
 function stopAnimations(){animations.forEach(function(a){try{a.stop();}catch(e){}});animations=[];}
 function setSiteInert(on){
  if(on) Array.from(document.body.children).forEach(function(el){if(el!==intro&&el.tagName!=='SCRIPT'&&!el.inert){hidden.push(el);el.inert=true;}});
  else {hidden.forEach(function(el){el.inert=false;});hidden=[];}
 }
 function wake(){if(!renderer||!office||disposed)return;activeUntil=performance.now()+(reduced.matches?0:6500);if(!raf&&!disposed)raf=requestAnimationFrame(frame);}
 function viewFor(name){
  if(inspection){
   return width<600?{position:new T.Vector3(0,1.4,zoomed?4.2:5.25),target:new T.Vector3(0,1.4,2.2)}:{position:new T.Vector3(0,1.35,zoomed?3.65:4.55),target:new T.Vector3(-.48,1.35,2.2)};
  }
  var view=name==='kurtas'?office.kurtaView:name==='casuals'?office.casualView:office.overview;
  var pos=view.position.clone(),target=view.target.clone();
  if(name==='village'&&width>=600){pos.set(4.3,1.6,5.6);target.set(-1.6,1.25,-2.5);}
  if(name==='village'){
   if(width<600){pos.set(3.0,2.7,7.8);target.set(.85,1.4,-1.65);}
  } else if(width>=600){
   // Shift the subject right, leaving room for the editorial copy on the left.
   var direction=target.clone().sub(pos).normalize();
   var right=new T.Vector3().crossVectors(direction,new T.Vector3(0,1,0)).normalize();
   target.addScaledVector(right,-(name==='kurtas'?.62:.8));
   if(width/height<1.35)pos.addScaledVector(direction,name==='casuals'?-1.45:-.7);
  } else {
   var d=pos.clone().sub(target).normalize();
   pos.addScaledVector(d,name==='kurtas'?1.4:2.35);
   target.y+=.25;
  }
  return {position:pos,target:target};
 }
 function addShafts(sun){
  var dir=sun.target.position.clone().sub(sun.position).normalize(),L=7.5,geo=new T.BufferGeometry(),pos=[],col=[];
  function quad(a,b){var a2=a.clone().addScaledVector(dir,L),b2=b.clone().addScaledVector(dir,L);[a,b,b2,a,b2,a2].forEach(function(v,i){pos.push(v.x,v.y,v.z);var near=(i===0||i===1||i===3)?1:0;col.push(.55*near,.34*near,.16*near);});}
  [[-3.3,1.13],[-.22,1.12]].forEach(function(w){
   var x0=w[0]-w[1]/2,x1=w[0]+w[1]/2,y0=1.2,y1=2.98,z=-4.05;
   for(var i=0;i<=5;i++){var x=x0+(x1-x0)*i/5;quad(new T.Vector3(x,y0,z),new T.Vector3(x,y1,z));}
   for(var j=0;j<=4;j++){var y=y0+(y1-y0)*j/4;quad(new T.Vector3(x0,y,z),new T.Vector3(x1,y,z));}
  });
  geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(col,3));
  var mesh=new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.1,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false,toneMapped:false}));
  mesh.renderOrder=5;mesh.frustumCulled=false;scene.add(mesh);
  // the same sun as real light: a warm pool on the floor and furniture, and its bounce
  [-3.3,-.22].forEach(function(x){var sp=new T.SpotLight(0xffc27a,150,14,.3,.7,1.4);sp.position.set(x,2.15,-3.9);sp.target.position.copy(sp.position).addScaledVector(dir,5);sp.castShadow=false;sp.shadow.mapSize.set(512,512);sp.shadow.bias=-.0005;sp.shadow.normalBias=.02;scene.add(sp,sp.target);});
  var bounce=new T.PointLight(0xffc48a,5,8,1.6);bounce.position.set(-3.4,.5,.6);scene.add(bounce);
 }
 function setView(name){if(!renderer||disposed)return;renderer.shadowMap.needsUpdate=true;var v=viewFor(name);cameraGoal.copy(v.position);targetGoal.copy(v.target);dragYaw=0;parallax.x=0;parallax.y=0;if(reduced.matches){camera.position.copy(cameraGoal);currentTarget.copy(targetGoal);}wake();}
 function fillProducts(name){
  products.replaceChildren();
  garments.filter(function(g){return g.room===name;}).forEach(function(g){
   var button=document.createElement('button');button.type='button';button.className='intro-product';
   var type=document.createElement('small');type.textContent='DEMO GARMENT';
   var title=document.createElement('b');title.textContent=g.label;
   var bottom=document.createElement('span');bottom.textContent='View in 3D ↗';
   button.append(type,title,bottom);button.addEventListener('click',function(){inspectGarment(g.id);});products.append(button);
  });
 }
 function inspectGarment(id){
  if(leaving||disposed||inspection)return;
  selected=garments.find(function(g){return g.id===id;});if(!selected)return;
  stopAnimations();[pane,products].forEach(function(el){el.style.opacity='1';el.style.transform='none';});inspection=selected.group.clone(true);inspection.visible=true;inspection.position.set(0,0,0);inspection.rotation.set(0,0,0);inspection.scale.setScalar(1);inspection.updateMatrixWorld(true);var size=new T.Box3().setFromObject(inspection).getSize(new T.Vector3());inspection.scale.setScalar(Math.min(1.65/size.x,1.3/size.y));inspection.position.set(0,2.05,2.2);scene.add(inspection);inspectionYaw=0;zoomed=false;
  garments.forEach(function(g){g.group.visible=false;});products.hidden=true;inspectControls.hidden=false;intro.dataset.inspect='true';
  pane.querySelector('button').textContent=room==='kurtas'?'← Back to the almirah':'← Back to the clothing wall';pane.querySelector('.detail-eyebrow').textContent='THE CLOTH, UP CLOSE';pane.querySelector('h3').textContent=selected.label;pane.querySelector('.detail-copy').textContent='Real folds. Every seam. Turn the piece and see it from every side. This is a demo garment for the collection preview.';
  inspectControls.querySelector('.intro-collection').href=roomData[room].collection;inspectControls.querySelector('[data-zoom]').textContent='Zoom in +';
  intro.querySelector('#intro-instruction').textContent='Drag to turn · zoom in for the details';status.textContent=selected.label+'. Drag to rotate, or use the turn buttons.';setView(room);pane.querySelector('button').focus({preventScroll:true});
 }
 function closeInspection(){
  if(!inspection)return;scene.remove(inspection);inspection=null;selected=null;delete intro.dataset.inspect;inspectControls.hidden=true;products.hidden=false;
  garments.forEach(function(g){g.group.visible=g.room===room;});var config=roomData[room];pane.querySelector('button').textContent='← Back to the office';pane.querySelector('.detail-eyebrow').textContent=config.eyebrow;pane.querySelector('h3').textContent=config.title;pane.querySelector('.detail-copy').textContent=config.copy;intro.querySelector('#intro-instruction').textContent='Pick a hanging piece to take a closer look.';setView(room);pane.querySelector('button').focus({preventScroll:true});
 }
 function openRoom(name,trigger){
  if(leaving||!modelLibrary||!roomData[name]||room!=='village')return;
  stopAnimations();room=name;lastTrigger=trigger;intro.dataset.room=name;roomStarted=performance.now();
  var config=roomData[name];pane.hidden=false;products.hidden=false;
  pane.querySelector('.detail-eyebrow').textContent=config.eyebrow;pane.querySelector('h3').textContent=config.title;pane.querySelector('.detail-copy').textContent=config.copy;
  fillProducts(name);
  garments.forEach(function(g){g.group.visible=g.room===name;});
  intro.querySelectorAll('[data-room-open]').forEach(function(b){b.setAttribute('aria-expanded',String(b.dataset.roomOpen===name));});
  intro.querySelector('#intro-instruction').textContent='Pick a hanging piece to take a closer look.';
  status.textContent=name==='kurtas'?'The almirah is open. Two demo garments hang inside.':'At Sachiv Ji’s office. Three demo garments hang on the wall.';
  setView(name);
  animate(pane,{opacity:[0,1],transform:['translateY(10px)','none']},{duration:.6,delay:.25,ease:[.22,1,.36,1]});
  animate(products,{opacity:[0,1],transform:['translateY(15px)','none']},{duration:.6,delay:.65,ease:[.22,1,.36,1]});
  pane.querySelector('button').focus({preventScroll:true});
 }
 function closeRoom(){
  if(inspection){closeInspection();return;}
  if(room==='village'||leaving)return;stopAnimations();room='village';intro.dataset.room=room;pane.hidden=true;products.hidden=true;
  garments.forEach(function(g){g.group.visible=false;});intro.querySelectorAll('[data-room-open]').forEach(function(b){b.setAttribute('aria-expanded','false');});
  intro.querySelector('#intro-instruction').textContent='Move around. Pick a place. Find your piece.';status.textContent='Back in the Panchayat office.';setView(room);
  if(lastTrigger)lastTrigger.focus({preventScroll:true});
 }
 function markPick(group,data){group.traverse(function(mesh){if(mesh.isMesh){mesh.userData.introAction=data;pickMeshes.push(mesh);}});}
 function addGarments(){
  var configs=[
   {room:'kurtas',id:'wardrobe-shirt',asset:'tee',label:'Cotton in charcoal',color:0x404747,x:-.49},
   {room:'kurtas',id:'wardrobe-tee',asset:'tee',label:'Soft cotton tee',color:0xc7b694,x:.49},
   {room:'casuals',id:'wall-shirt',asset:'shirt',label:'The long-sleeve shirt',x:-1.02},
   {room:'casuals',id:'wall-tee',asset:'tee',label:'Cotton in sage',color:0x708272,x:0},
   {room:'casuals',id:'wall-jacket',asset:'jacket',label:'The quilted jacket',x:1.02}
  ];
  configs.forEach(function(c){
   var g=modelLibrary.create(c);g.visible=false;
   if(c.room==='kurtas'){g.scale.setScalar(.85);g.position.set(c.x,office.cabinet.garmentRailY,.08);office.cabinet.group.add(g);}
   else {g.scale.setScalar(c.asset==='shirt'?1.4:.88);g.position.set(c.x,0,.065);office.casualAnchor.add(g);}
   markPick(g,{product:c.id});garments.push({room:c.room,group:g,id:c.id,label:c.label||g.userData.label||'Cotton studio sample',phase:garments.length*.7});
  });
 }
 function placeHotspot(id,point,offset){
  var p=point.clone().project(camera),el=document.getElementById(id);var w=el.offsetWidth||170,h=el.offsetHeight||50;
  var x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height+(offset||0);
  el.style.left=Math.max(w/2+12,Math.min(width-w/2-12,x))+'px';el.style.top=Math.max(140,Math.min(height-150,y))+'px';
 }
 function frame(now){
  raf=0;if(disposed||!renderer||document.hidden)return;
  var dt=Math.min((now-lastTime)/1000||.016,.05);lastTime=now;
  var speed=reduced.matches?1:1-Math.pow(.003,dt);
  var desired=cameraGoal.clone();
  if(room==='village'&&!reduced.matches){
   var dx=desired.x-targetGoal.x,dz=desired.z-targetGoal.z,a=dragYaw+parallax.x*.035;
   desired.x=targetGoal.x+dx*Math.cos(a)+dz*Math.sin(a);desired.z=targetGoal.z+dz*Math.cos(a)-dx*Math.sin(a);desired.y+=parallax.y*.07;
  }
  camera.position.lerp(desired,speed);currentTarget.lerp(targetGoal,speed);camera.lookAt(currentTarget);
  // Neutral fill and the photographic environment reveal authored cloth normals.
  if(garmentKey){
   var viewing=room!=='village';
   garmentKey.intensity+=((viewing?5:0)-garmentKey.intensity)*speed;
   garmentFill.intensity+=((viewing?2:0)-garmentFill.intensity)*speed;
   if(inspection){garmentKey.position.set(-1.5,2.8,3.8);garmentFill.position.set(1.8,1.4,3.2);inspection.rotation.y+=(inspectionYaw-inspection.rotation.y)*speed;}
   else if(room==='kurtas'){garmentKey.position.set(1.6,2.6,-1.4);garmentFill.position.set(3.8,1.6,-1.8);}
   else if(room==='casuals'){garmentKey.position.set(3.9,2.7,.6);garmentFill.position.set(3.6,1.5,-1.1);}
  }
  var oldAngle=doorAngle;doorAngle+=( (room==='kurtas'?1.92:0)-doorAngle)*speed;
  office.cabinet.leftDoor.rotation.y=-doorAngle;office.cabinet.rightDoor.rotation.y=doorAngle;
  if(office.fan&&!reduced.matches)office.fan.rotation.y+=dt*.5;
  var since=(now-roomStarted)/1000;
  garments.forEach(function(g){if(g.group.visible)g.group.rotation.z=reduced.matches?0:Math.sin(since*3.2+g.phase)*.06*Math.exp(-since*.8);});
  if(room==='village'){
   placeHotspot('almirah-hotspot',office.cabinet.center,0);
   var deskPoint=new T.Vector3(-.6,1.05,.45);placeHotspot('office-hotspot',deskPoint,25);
  }
  var fps=low?30:60;
  if(reduced.matches||now-frameTime>1000/fps-2){if(Math.abs(oldAngle-doorAngle)>.0002 || (room!=='village'&&since<4)||(inspection&&Math.abs(inspection.rotation.y-inspectionYaw)>.002))renderer.shadowMap.needsUpdate=true;if(composer)composer.render(dt);else renderer.render(scene,camera);frameTime=now;}
  var moving=camera.position.distanceTo(desired)>.002||currentTarget.distanceTo(targetGoal)>.002||Math.abs(doorAngle-(room==='kurtas'?1.92:0))>.002||(inspection&&Math.abs(inspection.rotation.y-inspectionYaw)>.002);
  if(moving||now<activeUntil)raf=requestAnimationFrame(frame);
 }
 function resize(){
  if(!renderer||disposed)return;width=host.clientWidth;height=host.clientHeight;camera.aspect=width/height;camera.fov=width<600?58:50;camera.updateProjectionMatrix();renderer.setSize(width,height);if(composer){composer.setSize(width,height);if(aoPass){var ratio=renderer.getPixelRatio()*(low?.5:.75);aoPass.setSize(Math.max(1,Math.round(width*ratio)),Math.max(1,Math.round(height*ratio)));}}if(office)setView(room);
 }
 function pick(e){
  if(!renderer||disposed)return null;
  var r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);raycaster.setFromCamera(pointer,camera);
  var hits=raycaster.intersectObjects(pickMeshes,false).filter(function(hit){var m=hit.object;while(m){if(!m.visible)return false;m=m.parent;}return true;});
  return hits.length?hits[0].object.userData.introAction:null;
 }
 function onPointerMove(e){
  if(!renderer||leaving)return;
  parallax.x=e.clientX/width-.5;parallax.y=.5-e.clientY/height;
  if(dragStart){var dx=e.clientX-dragStart.x;dragDistance=Math.max(dragDistance,Math.abs(dx));if(inspection){inspectionYaw=dragStart.yaw+dx/width*Math.PI*3;renderer.shadowMap.needsUpdate=true;}else if(room==='village')dragYaw=Math.max(-.19,Math.min(.19,dragStart.yaw+dx/width*.5));}
  else {var hit=pick(e);host.style.cursor=hit?'pointer':'grab';}
  wake();
 }
 function onPointerDown(e){if(!renderer||disposed)return;dragStart={x:e.clientX,yaw:inspection?inspectionYaw:dragYaw};dragDistance=0;host.setPointerCapture(e.pointerId);wake();}
 function onPointerUp(e){
  if(!dragStart)return;var click=dragDistance<7;dragStart=null;if(!click||leaving||inspection)return;var hit=pick(e);if(!hit)return;
  if(hit.room&&room==='village')openRoom(hit.room,intro.querySelector('[data-room-open="'+hit.room+'"]'));
  else if(hit.product&&room!=='village')inspectGarment(hit.product);
 }
 function fallback(error){
  console.warn('Panchayat office 3D unavailable:',error&&error.message||error);dispose();renderer=null;inspection=null;selected=null;delete intro.dataset.inspect;inspectControls.hidden=true;room='village';intro.dataset.room=room;pane.hidden=true;products.hidden=true;intro.classList.add('is-ready','is-fallback');intro.querySelector('.intro-fallback').hidden=false;intro.querySelector('#intro-instruction').textContent='Explore a collection, or enter the store.';host.replaceChildren();
 }
 async function boot(){
  try{
   if(!T||!window.buildPanchayatOffice||!window.loadPanchayatGarments||!window.loadPanchayatOfficeMaterials||!window.loadPanchayatOfficeProps)throw new Error('3D assets unavailable');
   renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,low?1.25:1.5));
   renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
   renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
   host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
   scene=new T.Scene();scene.background=new T.Color(0xfff1d6);
   camera=new T.PerspectiveCamera(42,1,.08,60);raycaster=new T.Raycaster();pointer=new T.Vector2();
   scene.add(new T.HemisphereLight(0xfff3df,0x8a7354,.5));
   var sun=new T.DirectionalLight(0xffdcae,5);sun.position.set(2.2,4.6,-12);sun.target.position.set(-2,0,3);sun.castShadow=true;sun.shadow.mapSize.set(low?1024:2048,low?1024:2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.camera.near=.2;sun.shadow.camera.far=30;sun.shadow.normalBias=.008;sun.shadow.bias=-.0001;sun.shadow.radius=3;scene.add(sun,sun.target);
   T.RectAreaLightUniformsLib.init();
   [[-3.3,2.09,-3.98,1.13,1.9],[-.22,2.09,-3.98,1.12,1.9],[-5.32,2.1,-.82,1.32,1.9]].forEach(function(p,i){var light=new T.RectAreaLight(0xe6efff,i===2?4.5:3.5,p[3],p[4]);light.position.set(p[0],p[1],p[2]);light.lookAt(i===2?0:p[0],1.3,i===2?-.2:1);scene.add(light);});
   var roomFill=new T.RectAreaLight(0xffe9c8,2.6,4,3);roomFill.position.set(.5,3.2,1);roomFill.lookAt(0,.4,-2);scene.add(roomFill);
   garmentKey=new T.PointLight(0xffffff,0,5,2);garmentFill=new T.PointLight(0xf5f7ff,0,4,2);scene.add(garmentKey,garmentFill);
   var environmentLoad=new T.HDRLoader().loadAsync('lab/office-3d/assets/models/studio_small_03_1k.hdr').then(function(texture){
    if(disposed||leaving){texture.dispose();return;}
    var pmrem=new T.PMREMGenerator(renderer);environmentTarget=pmrem.fromEquirectangular(texture);texture.dispose();pmrem.dispose();scene.environment=environmentTarget.texture;scene.environmentIntensity=.2;wake();
   }).catch(function(e){console.warn('Studio environment unavailable; using the office lights.',e.message);});
   var assets=await Promise.allSettled([window.loadPanchayatOfficeMaterials(T,renderer),window.loadPanchayatOfficeProps(T,renderer),window.loadPanchayatGarments(T,renderer)]);
   var failed=assets.find(function(a){return a.status==='rejected';});
   if(disposed||leaving||failed){assets.forEach(function(a){if(a.status==='fulfilled')a.value.dispose();});if(failed)throw failed.reason;return;}
   officeMaterials=assets[0].value;officeProps=assets[1].value;modelLibrary=assets[2].value;
   office=window.buildPanchayatOffice(T,scene,{materials:officeMaterials.materials,props:officeProps,invalidate:wake});markPick(office.cabinet.group,{room:'kurtas'});markPick(office.desk,{room:'casuals'});addGarments();addShafts(sun);
   var target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:low?0:4});composer=new T.EffectComposer(renderer,target);composer.addPass(new T.RenderPass(scene,camera));
   aoPass=new T.GTAOPass(scene,camera,1,1);aoPass.output=T.GTAOPass.OUTPUT.Default;aoPass.blendIntensity=.62;aoPass.updateGtaoMaterial({radius:.23,thickness:.45,samples:low?8:16,screenSpaceRadius:false});aoPass.updatePdMaterial({radius:4,samples:low?8:16});composer.addPass(aoPass);composer.addPass(new T.OutputPass());
   cameraGoal=office.overview.position.clone();targetGoal=office.overview.target.clone();currentTarget=targetGoal.clone();camera.position.copy(cameraGoal);
   resize();var v=viewFor('village');camera.position.copy(v.position);currentTarget.copy(v.target);
   host.addEventListener('pointermove',onPointerMove);host.addEventListener('pointerdown',onPointerDown);window.addEventListener('pointerup',onPointerUp);host.addEventListener('pointercancel',function(){dragStart=null;});
   renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();if(!disposed){cancelAnimationFrame(raf);raf=0;fallback(new Error('Graphics context lost'));}});
   window.addEventListener('resize',resize);wake();
   renderer.shadowMap.needsUpdate=true;intro.classList.add('is-ready');status.textContent='The Panchayat office is ready to explore.';wake();
   await environmentLoad;
  }catch(e){if(!disposed&&!leaving)fallback(e);}
 }
 function dispose(){
  if(disposed)return;disposed=true;cancelAnimationFrame(raf);raf=0;
  window.removeEventListener('resize',resize);window.removeEventListener('pointerup',onPointerUp);host.removeEventListener('pointermove',onPointerMove);host.removeEventListener('pointerdown',onPointerDown);document.removeEventListener('visibilitychange',onVisibility);
  if(scene){var gs=new Set(),ms=new Set(),ts=new Set();scene.traverse(function(o){if(o.geometry)gs.add(o.geometry);if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){ms.add(m);Object.keys(m).forEach(function(k){if(m[k]&&m[k].isTexture)ts.add(m[k]);});});}});gs.forEach(function(g){g.dispose();});ms.forEach(function(m){m.dispose();});ts.forEach(function(t){t.dispose();});}
  if(modelLibrary)modelLibrary.dispose();if(officeMaterials)officeMaterials.dispose();if(officeProps)officeProps.dispose();if(environmentTarget)environmentTarget.dispose();
  if(composer){composer.passes.forEach(function(pass){if(pass.dispose)pass.dispose();});if(aoPass){aoPass.gtaoMaterial.dispose();aoPass.blendMaterial.dispose();}composer.dispose();}
  if(renderer){renderer.dispose();renderer.forceContextLoss();}
 }
 function finish(){
  if(!intro.isConnected)return;stopAnimations();dispose();setSiteInert(false);html.classList.remove('intro-on','intro-lock');intro.remove();
  document.removeEventListener('keydown',onKey);reduced.removeEventListener('change',onReduced);window.removeEventListener('pagehide',onPageHide);window.removeEventListener('pageshow',onPageShow);
  var main=document.getElementById('main');if(main){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}
 }
 function enterStore(){
  if(leaving)return;leaving=true;stopAnimations();intro.classList.add('is-leaving');window.scrollTo(0,0);
  var a=animate(intro,{opacity:[1,0],transform:['none','scale(1.025)']},{duration:.6,ease:[.65,0,.35,1]});
  if(a){a.then(finish);timers.push(setTimeout(finish,850));}else finish();
 }
 function onKey(e){
  if(e.key==='Escape'){e.preventDefault();if(room!=='village')closeRoom();else enterStore();return;}
  if(e.key!=='Tab'||leaving)return;
  var list=Array.from(intro.querySelectorAll('button,a[href]')).filter(function(el){return el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';});
  var first=list[0],last=list[list.length-1];
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===intro)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
 function onReduced(){intro.classList.toggle('is-reduced',reduced.matches);if(reduced.matches){stopAnimations();pane.style.opacity='1';pane.style.transform='none';products.style.opacity='1';products.style.transform='none';if(leaving){finish();return;}}if(office)setView(room);}
 function onVisibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(renderer&&!disposed)wake();}
 function onPageHide(){setSiteInert(false);html.classList.remove('intro-lock');cancelAnimationFrame(raf);raf=0;}
 function onPageShow(e){if(e.persisted)finish();}
 intro.querySelectorAll('[data-room-open]').forEach(function(b){b.addEventListener('click',function(){openRoom(b.dataset.roomOpen,b);});});
 intro.querySelectorAll('[data-intro-open]').forEach(function(b){b.addEventListener('click',enterStore);});pane.querySelector('button').addEventListener('click',closeRoom);
 inspectControls.querySelectorAll('[data-turn]').forEach(function(b){b.addEventListener('click',function(){if(!inspection||disposed||!renderer)return;inspectionYaw+=Number(b.dataset.turn)*Math.PI/4;if(reduced.matches)inspection.rotation.y=inspectionYaw;renderer.shadowMap.needsUpdate=true;wake();});});
 inspectControls.querySelector('[data-zoom]').addEventListener('click',function(){if(!inspection||disposed)return;zoomed=!zoomed;this.textContent=zoomed?'Zoom out −':'Zoom in +';setView(room);});
 document.addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onReduced);window.addEventListener('pagehide',onPageHide);window.addEventListener('pageshow',onPageShow);
 intro.classList.toggle('is-reduced',reduced.matches);window.panchayatIntroReady=true;clearTimeout(window.introFailsafe);setSiteInert(true);intro.setAttribute('tabindex','-1');intro.focus({preventScroll:true});
 // Let the loading text paint before constructing the set.
 requestAnimationFrame(function(){if(!leaving&&!disposed)boot();});
})();
