/* Real-time 3D office opening; the storefront below remains independent. */
(function () {
 'use strict';
 var html=document.documentElement, intro=document.getElementById('intro');
 if(!intro || !html.classList.contains('intro-on')) return;
 var reduced=matchMedia('(prefers-reduced-motion: reduce)'), T=window.PanchayatThree;
 var hidden=[], room='village', leaving=false, disposed=false, lastTrigger, raf=0, timers=[];
 var renderer,scene,camera,office,raycaster,pointer,animations=[],garments=[],pickMeshes=[];
 var pane=intro.querySelector('.intro-detail'), products=intro.querySelector('#intro-products'), status=intro.querySelector('#intro-status');
 var host=intro.querySelector('#office-canvas'), frameTime=0, lastTime=0, activeUntil=0, doorAngle=0, roomStarted=0;
 var width=innerWidth,height=innerHeight,low=width<650 || navigator.deviceMemory<=4;
 var cameraGoal,targetGoal,currentTarget,parallax={x:0,y:0},dragYaw=0,dragStart=null,dragDistance=0;
 var roomData={
  kurtas:{eyebrow:'01 / THE ALMIRAH',title:'Kurtas, kept with care.',copy:'Open the old steel doors. Find cotton and khadi hanging inside.',ids:['prahlad-cotton-kurta','handloom-khadi-kurta'],labels:['COTTON KURTA','HANDLOOM KHADI']},
  casuals:{eyebrow:'02 / SACHIV JI’S OFFICE',title:'Everyday in Phulera.',copy:'Checks, easy shirts, and a familiar tee. Hanging on the office wall, ready for the day.',ids:['sachiv-check-shirt','sachiv-bike-ride-shirt','vikas-everyday-tee'],labels:['SACHIV JI’S CHECKS','THE BIKE-RIDE SHIRT','VIKAS’S EVERYDAY TEE']}
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
 function wake(){if(!renderer||disposed)return;activeUntil=performance.now()+(reduced.matches?0:6500);if(!raf&&!disposed)raf=requestAnimationFrame(frame);}
 function viewFor(name){
  var view=name==='kurtas'?office.kurtaView:name==='casuals'?office.casualView:office.overview;
  var pos=view.position.clone(),target=view.target.clone();
  if(name==='village'&&width>=600){pos.set(2.9,2.2,5.7);target.set(.2,1.25,-2.5);}
  if(name==='village'){
   if(width<600){pos.set(3.0,2.7,7.8);target.set(.85,1.4,-1.65);}
  } else if(width>=600){
   // Shift the subject right, leaving room for the editorial copy on the left.
   var direction=target.clone().sub(pos).normalize();
   var right=new T.Vector3().crossVectors(direction,new T.Vector3(0,1,0)).normalize();
   target.addScaledVector(right,-(name==='kurtas'?.62:.8));
   if(width/height<1.35)pos.addScaledVector(direction,-.7);
  } else {
   var d=pos.clone().sub(target).normalize();
   pos.addScaledVector(d,name==='kurtas'?1.4:2.35);
   target.y+=.25;
  }
  return {position:pos,target:target};
 }
 function setView(name){if(!renderer||disposed)return;renderer.shadowMap.needsUpdate=true;var v=viewFor(name);cameraGoal.copy(v.position);targetGoal.copy(v.target);dragYaw=0;parallax.x=0;parallax.y=0;if(reduced.matches){camera.position.copy(cameraGoal);currentTarget.copy(targetGoal);}wake();}
 function fillProducts(name){
  products.replaceChildren();
  var config=roomData[name];
  config.ids.forEach(function(id,i){
   var product=window.PBP&&PBP.byId(id);if(!product)return;
   var link=document.createElement('a');link.className='intro-product';link.href='product.html?id='+id;
   var type=document.createElement('small');type.textContent=config.labels[i];
   var title=document.createElement('b');title.textContent=product.name;
   var bottom=document.createElement('span'),price=document.createElement('i'),arrow=document.createElement('i');price.textContent=PBP.inr(product.price);arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');bottom.append(price,arrow);link.append(type,title,bottom);products.append(link);
  });
 }
 function openRoom(name,trigger){
  if(leaving||!office||!roomData[name]||room!=='village')return;
  stopAnimations();room=name;lastTrigger=trigger;intro.dataset.room=name;roomStarted=performance.now();
  var config=roomData[name];pane.hidden=false;products.hidden=false;
  pane.querySelector('.detail-eyebrow').textContent=config.eyebrow;pane.querySelector('h3').textContent=config.title;pane.querySelector('.detail-copy').textContent=config.copy;
  fillProducts(name);
  garments.forEach(function(g){g.group.visible=g.room===name;});
  intro.querySelectorAll('[data-room-open]').forEach(function(b){b.setAttribute('aria-expanded',String(b.dataset.roomOpen===name));});
  intro.querySelector('#intro-instruction').textContent='Pick a hanging piece to take a closer look.';
  status.textContent=name==='kurtas'?'The almirah is open. Two kurtas hang inside.':'At Sachiv Ji’s office. Three casual pieces hang on the wall.';
  setView(name);
  animate(pane,{opacity:[0,1],transform:['translateY(10px)','none']},{duration:.6,delay:.25,ease:[.22,1,.36,1]});
  animate(products,{opacity:[0,1],transform:['translateY(15px)','none']},{duration:.6,delay:.65,ease:[.22,1,.36,1]});
  pane.querySelector('button').focus({preventScroll:true});
 }
 function closeRoom(){
  if(room==='village'||leaving)return;stopAnimations();room='village';intro.dataset.room=room;pane.hidden=true;products.hidden=true;
  garments.forEach(function(g){g.group.visible=false;});intro.querySelectorAll('[data-room-open]').forEach(function(b){b.setAttribute('aria-expanded','false');});
  intro.querySelector('#intro-instruction').textContent='Move around. Pick a place. Find your piece.';status.textContent='Back in the Panchayat office.';setView(room);
  if(lastTrigger)lastTrigger.focus({preventScroll:true});
 }
 function markPick(group,data){group.traverse(function(mesh){if(mesh.isMesh){mesh.userData.introAction=data;pickMeshes.push(mesh);}});}
 function addGarments(){
  var configs=[
   {room:'kurtas',id:'prahlad-cotton-kurta',type:'kurta',color:0xbda15f,x:-.49},
   {room:'kurtas',id:'handloom-khadi-kurta',type:'kurta',color:0xe5ddc8,x:.49},
   {room:'casuals',id:'sachiv-check-shirt',type:'shirt',color:0x627c85,checks:true,x:-1.02},
   {room:'casuals',id:'sachiv-bike-ride-shirt',type:'shirt',color:0x8d414e,x:0},
   {room:'casuals',id:'vikas-everyday-tee',type:'tee',color:0xd7cdb1,x:1.02}
  ];
  configs.forEach(function(c){
   var g=window.buildPanchayatGarment(T,c);g.visible=false;
   if(c.room==='kurtas'){g.scale.setScalar(.85);g.position.set(c.x,office.cabinet.garmentRailY,.08);office.cabinet.group.add(g);}
   else {g.scale.setScalar(.88);g.position.set(c.x,0,.065);office.casualAnchor.add(g);}
   markPick(g,{product:c.id});garments.push({room:c.room,group:g,id:c.id,phase:garments.length*.7});
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
  if(reduced.matches||now-frameTime>1000/fps-2){if(Math.abs(oldAngle-doorAngle)>.0002 || (room!=='village'&&since<4))renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);frameTime=now;}
  var moving=camera.position.distanceTo(desired)>.002||currentTarget.distanceTo(targetGoal)>.002||Math.abs(doorAngle-(room==='kurtas'?1.92:0))>.002;
  if(moving||now<activeUntil)raf=requestAnimationFrame(frame);
 }
 function resize(){
  if(!renderer||disposed)return;width=host.clientWidth;height=host.clientHeight;camera.aspect=width/height;camera.fov=width<600?58:50;camera.updateProjectionMatrix();renderer.setSize(width,height);setView(room);
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
  if(dragStart&&room==='village'){var dx=e.clientX-dragStart.x;dragDistance=Math.max(dragDistance,Math.abs(dx));dragYaw=Math.max(-.19,Math.min(.19,dragStart.yaw+dx/width*.5));}
  else {var hit=pick(e);host.style.cursor=hit?'pointer':'grab';}
  wake();
 }
 function onPointerDown(e){if(!renderer||disposed)return;dragStart={x:e.clientX,yaw:dragYaw};dragDistance=0;wake();}
 function onPointerUp(e){
  if(!dragStart)return;var click=dragDistance<7;dragStart=null;if(!click||leaving)return;var hit=pick(e);if(!hit)return;
  if(hit.room&&room==='village')openRoom(hit.room,intro.querySelector('[data-room-open="'+hit.room+'"]'));
  else if(hit.product&&room!=='village')location.href='product.html?id='+hit.product;
 }
 function fallback(error){
  console.warn('Panchayat office 3D unavailable:',error&&error.message||error);dispose();renderer=null;room='village';intro.dataset.room=room;pane.hidden=true;products.hidden=true;intro.classList.add('is-ready','is-fallback');intro.querySelector('.intro-fallback').hidden=false;intro.querySelector('#intro-instruction').textContent='Explore a collection, or enter the store.';host.replaceChildren();
 }
 function boot(){
  try{
   if(!T||!window.buildPanchayatOffice||!window.buildPanchayatGarment)throw new Error('3D assets unavailable');
   renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,low?1.5:1.75));
   renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
   renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
   host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
   scene=new T.Scene();scene.background=new T.Color(0xc4b69a);
   camera=new T.PerspectiveCamera(50,1,.08,60);raycaster=new T.Raycaster();pointer=new T.Vector2();
   scene.add(new T.HemisphereLight(0xfff0d8,0x514636,1.35));
   var sun=new T.DirectionalLight(0xffe6bc,2.5);sun.position.set(-3.5,7.5,3);sun.target.position.set(.5,0,-2);sun.castShadow=true;sun.shadow.mapSize.set(low?1024:2048,low?1024:2048);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;sun.shadow.camera.near=.2;sun.shadow.camera.far=25;sun.shadow.normalBias=.03;sun.shadow.bias=-.0002;scene.add(sun,sun.target);
   var fill=new T.PointLight(0xe0eaf0,10,14,2);fill.position.set(-2,2.5,-3);scene.add(fill);
   var roomFill=new T.PointLight(0xffead0,4,14,2);roomFill.position.set(2,3,2);scene.add(roomFill);
   office=window.buildPanchayatOffice(T,scene);addGarments();markPick(office.cabinet.group,{room:'kurtas'});markPick(office.desk,{room:'casuals'});
   // Product ownership wins over the enclosing cabinet pick target.
   garments.forEach(function(g){g.group.traverse(function(m){if(m.isMesh)m.userData.introAction={product:g.id};});});
   cameraGoal=office.overview.position.clone();targetGoal=office.overview.target.clone();currentTarget=targetGoal.clone();camera.position.copy(cameraGoal);
   resize();var v=viewFor('village');camera.position.copy(v.position);currentTarget.copy(v.target);
   intro.classList.add('is-ready');
   host.addEventListener('pointermove',onPointerMove);host.addEventListener('pointerdown',onPointerDown);window.addEventListener('pointerup',onPointerUp);host.addEventListener('pointercancel',function(){dragStart=null;});
   renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();if(!disposed){cancelAnimationFrame(raf);raf=0;fallback(new Error('Graphics context lost'));}});
   window.addEventListener('resize',resize);wake();
  }catch(e){fallback(e);}
 }
 function dispose(){
  if(disposed)return;disposed=true;cancelAnimationFrame(raf);raf=0;
  window.removeEventListener('resize',resize);window.removeEventListener('pointerup',onPointerUp);host.removeEventListener('pointermove',onPointerMove);host.removeEventListener('pointerdown',onPointerDown);document.removeEventListener('visibilitychange',onVisibility);
  if(scene){var gs=new Set(),ms=new Set(),ts=new Set();scene.traverse(function(o){if(o.geometry)gs.add(o.geometry);if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){ms.add(m);Object.keys(m).forEach(function(k){if(m[k]&&m[k].isTexture)ts.add(m[k]);});});}});gs.forEach(function(g){g.dispose();});ms.forEach(function(m){m.dispose();});ts.forEach(function(t){t.dispose();});}
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
 document.addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onReduced);window.addEventListener('pagehide',onPageHide);window.addEventListener('pageshow',onPageShow);
 intro.classList.toggle('is-reduced',reduced.matches);window.panchayatIntroReady=true;clearTimeout(window.introFailsafe);setSiteInert(true);intro.setAttribute('tabindex','-1');intro.focus({preventScroll:true});
 // Let the loading text paint before constructing the set.
 requestAnimationFrame(function(){if(!leaving)boot();});
})();
