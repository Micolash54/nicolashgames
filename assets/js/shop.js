/* Adapted from the supplied card-shop reference. */
// Nico, Bits and Boards shopkeeper edition: a small vinyl-toy style figure built from primitives.
function buildShopkeeper(THREE){
  const g=new THREE.Group();
  const mat=(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:.42,metalness:0,clearcoat:.35,clearcoatRoughness:.35},o));
  const M={
    skin:mat(0xE8894A,{roughness:.5,clearcoat:.15}),hair:mat(0x3F3634,{roughness:.6,clearcoat:.1}),beard:mat(0x43362F,{roughness:.65,clearcoat:.05}),
    shirt:mat(0xB4C1F0),apron:mat(0x2E3DC4),apronDark:mat(0x2331A0),tie:mat(0xE04E4C),white:mat(0xFFFFFF,{roughness:.2,clearcoat:.8}),
    ink:mat(0x17110F,{roughness:.25,clearcoat:.9}),mouth:mat(0x8E2426,{roughness:.5}),trousers:mat(0x2E3048,{roughness:.55}),
    shoe:mat(0x1E1917,{roughness:.35,clearcoat:.6}),base:mat(0x221B18,{roughness:.3,clearcoat:.7}),rim:mat(0x3A302B,{roughness:.35,clearcoat:.6}),
  };
  // rounded box: a sphere pushed out toward a box, so every edge is soft like moulded vinyl
  function rbox(w,h,d,e=.28){const geo=new THREE.SphereGeometry(1,40,28),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=v=>Math.sign(v)*Math.pow(Math.abs(v),e);p.setXYZ(i,f(x)*w/2,f(y)*h/2,f(z)*d/2)}
    geo.computeVertexNormals();return geo}
  const add=(geo,m,x=0,y=0,z=0,o={})=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);if(o.r)me.rotation.set(...o.r);if(o.s)me.scale.set(...o.s);(o.parent||g).add(me);return me};
  const sph=(r)=>new THREE.SphereGeometry(r,32,24);

  // base
  add(new THREE.CylinderGeometry(.66,.7,.12,64),M.base,0,.06,0);
  add(new THREE.CylinderGeometry(.6,.62,.03,64),M.rim,0,.135,0);
  // shoes + legs
  [-1,1].forEach(s=>{add(rbox(.2,.13,.32,.4),M.shoe,s*.125,.2,.04);add(new THREE.CylinderGeometry(.085,.09,.26,24),M.trousers,s*.12,.37,0)});
  // torso, apron, pocket, straps
  add(rbox(.64,.6,.44,.32),M.shirt,0,.76,0);
  add(rbox(.52,.5,.06,.3),M.apron,0,.68,.2);
  add(rbox(.2,.12,.04,.3),M.apronDark,0,.62,.235);
  [-1,1].forEach(s=>{add(rbox(.075,.34,.05,.35),M.apron,s*.2,.97,.17,{r:[-.25,0,s*.05]});add(rbox(.075,.36,.05,.35),M.apron,s*.2,.9,-.2)});
  // collar + tie
  [-1,1].forEach(s=>add(rbox(.14,.07,.05,.4),M.white,s*.07,1.05,.19,{r:[0,0,s*-.55]}));
  add(rbox(.075,.07,.05,.4),M.tie,0,1.02,.215);
  add(rbox(.07,.22,.035,.35),M.tie,0,.88,.235);
  add(new THREE.BoxGeometry(.06,.06,.03),M.tie,0,.77,.235,{r:[0,0,Math.PI/4]});
  // arms relaxed at the sides
  [-1,1].forEach(s=>{add(new THREE.CapsuleGeometry(.085,.26,8,16),M.shirt,s*.4,.76,0,{r:[0,0,s*.18]});add(sph(.092),M.skin,s*.44,.55,.02)});
  // neck + head
  add(new THREE.CylinderGeometry(.1,.11,.12,24),M.skin,0,1.1,0);
  const head=new THREE.Group();head.position.set(0,1.5,0);g.add(head);
  add(rbox(.8,.76,.68,.3),M.skin,0,0,0,{parent:head});
  [-1,1].forEach(s=>add(sph(.1),M.skin,s*.41,-.02,0,{s:[.55,1,.85],parent:head}));
  // hair: flat top, full back, sideburns running into the beard
  add(rbox(.86,.3,.74,.3),M.hair,0,.3,-.01,{parent:head});
  add(rbox(.84,.52,.32,.3),M.hair,0,.08,-.21,{parent:head});
  [-1,1].forEach(s=>add(rbox(.09,.3,.22,.35),M.beard,s*.395,-.02,.07,{parent:head}));
  // beard wraps the jaw; mouth, teeth and moustache sit on its front
  add(rbox(.84,.44,.7,.32),M.beard,0,-.22,.025,{parent:head});
  add(sph(.15),M.mouth,0,-.195,.345,{s:[1.15,.6,.4],parent:head});
  add(rbox(.26,.05,.04,.4),M.white,0,-.152,.372,{parent:head});
  add(rbox(.34,.085,.1,.35),M.beard,0,-.085,.355,{parent:head});
  // face: nose, eyes, brows
  add(sph(.07),M.skin,0,-.02,.35,{s:[1,.9,.8],parent:head});
  [-1,1].forEach(s=>{
    add(sph(.125),M.white,s*.16,.08,.31,{s:[1,1.12,.5],parent:head});
    add(sph(.064),M.ink,s*.15,.07,.365,{s:[1,1.1,.5],parent:head});
    add(sph(.02),M.white,s*.15+.022,.1,.392,{parent:head});
    add(rbox(.21,.07,.07,.4),M.ink,s*.16,.24,.33,{r:[0,0,s*-.16],parent:head});
  });
  return g;
}

// Mount a turntable render of the figure into `el`. Returns {snapshot(size)}.
function mountFigure(THREE,el,{interactive=false,angle:a0=.35}={}){
  if(THREE.ColorManagement)THREE.ColorManagement.legacyMode=false; // treat hex colours as sRGB
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.NoToneMapping;
  renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
  const cv=renderer.domElement;cv.className='fig3d';el.appendChild(cv);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(26,1,.1,30);
  cam.position.set(0,1.35,5.2);cam.lookAt(0,1.02,0);
  scene.add(new THREE.HemisphereLight(0xfff3e0,0x8a5a48,.62));
  const key=new THREE.DirectionalLight(0xfff0dc,1.25);key.position.set(-2.5,4,4);scene.add(key);
  const rim=new THREE.DirectionalLight(0xbcd4ff,.95);rim.position.set(3,2.5,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffd9b0,.3);fill.position.set(3,1,3);scene.add(fill);
  const fig=buildShopkeeper(THREE);scene.add(fig);
  // soft contact shadow on the base
  const sc=document.createElement('canvas');sc.width=sc.height=128;const sx=sc.getContext('2d'),gr=sx.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=gr;sx.fillRect(0,0,128,128);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(.9,.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));
  sh.rotation.x=-Math.PI/2;sh.position.set(0,.152,.03);scene.add(sh);

  let w=0,h=0,angle=a0,vel=0,hover=false,drag=null,visible=true;
  function size(){const r=el.getBoundingClientRect();const nw=Math.max(1,Math.round(el.clientWidth)),nh=Math.max(1,Math.round(el.clientHeight));
    if(nw===w&&nh===h)return;w=nw;h=nh;renderer.setSize(w,h,false);cam.aspect=w/h;
    // keep the whole figure in frame whatever the window's shape
    const fitH=2.5,fitW=1.9,d=Math.max((fitH/2)/Math.tan(cam.fov*Math.PI/360),(fitW/2)/(Math.tan(cam.fov*Math.PI/360)*cam.aspect));
    cam.position.set(0,1.25,d);cam.lookAt(0,1.03,0);cam.updateProjectionMatrix()}
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let last=performance.now();
  function frame(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(visible&&!document.hidden){size();
      if(drag){}else if(hover){vel+=(2.4-vel)*.08}else{vel*=.94}
      angle+=vel*dt;
      const idle=reduce?0:Math.sin(now/1600)*.28;
      fig.rotation.y=angle+(drag||hover?0:idle);
      fig.position.y=reduce?0:Math.sin(now/900)*.012;
      renderer.render(scene,cam)}
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(el);
  el.addEventListener('pointerenter',()=>hover=true);el.addEventListener('pointerleave',()=>{hover=false});
  if(interactive){
    cv.addEventListener('pointerdown',e=>{if(!interactive())return;drag={x:e.clientX,a:angle};vel=0;cv.setPointerCapture(e.pointerId);e.stopPropagation()});
    cv.addEventListener('pointermove',e=>{if(!drag)return;const na=drag.a+(e.clientX-drag.x)*.012;vel=(na-angle)*30;angle=na});
    const up=()=>{drag=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  }
  return{
    snapshot(px=160){const pw=w,ph=h,pa=cam.aspect;renderer.setSize(px,px*1.25,false);cam.aspect=.8;cam.updateProjectionMatrix();
      const sy=fig.rotation.y;fig.rotation.y=.35;renderer.render(scene,cam);const url=cv.toDataURL('image/png');
      fig.rotation.y=sy;w=0;h=0;size();return url}
  };
}

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const FIG=`<svg viewBox="0 0 120 160" aria-hidden="true">
  <ellipse cx="60" cy="151" rx="40" ry="7" fill="#1c1715"/><rect x="20" y="143" width="80" height="8" fill="#1c1715"/><ellipse cx="60" cy="143" rx="40" ry="7" fill="#3a302b"/>
  <g stroke="#1B1512" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M47 121h11v20H47zM62 121h11v20H62z" fill="#2E2F45"/><path d="M44 140h15v4H44zM61 140h15v4H61z" fill="#1B1512"/>
    <path d="M80 90q12 4 11 20l-1 10h-9z" fill="#CFD6F4"/><circle cx="86" cy="123" r="5.5" fill="#F0924A"/>
    <path d="M37 90q0-8 10-8h26q10 0 10 8v34H37z" fill="#CFD6F4"/>
    <path d="M44 95h32l2 29H42z" fill="#3A44B5"/><path d="M44 95l-3-12M76 95l3-12" fill="none"/><path d="M52 108h16v9H52z" fill="#2F389A"/>
    <path d="M51 82l9 8 9-8" fill="#fff"/><path d="M58 88h4l2.4 16-4.4 5-4.4-5z" fill="#E0504F"/>
    <path d="M40 90q-12 4-11 20l1 10h9z" fill="#CFD6F4"/><circle cx="34" cy="123" r="5.5" fill="#F0924A"/>
    <circle cx="33" cy="52" r="6" fill="#F0924A"/><circle cx="87" cy="52" r="6" fill="#F0924A"/>
    <path d="M35 28q0-14 14-14h22q14 0 14 14v34q0 20-20 22H55q-20-2-20-22z" fill="#F0924A"/>
    <path d="M33 46V26q0-16 16-16h22q16 0 16 16v20h-4l-1-14q-10-6-24-5-14-1-24 5l-1 14z" fill="#4B4442"/>
    <path d="M35 46h3l1 12q3 10 13 10h16q10 0 13-10l1-12h3v16q0 22-22 24h-8q-22-2-22-24z" fill="#4A3C36"/>
    <path d="M46 63.5q14-7 28 0-7-1.6-14 .8-7-2.4-14-.8z" fill="#4A3C36" stroke-width="2"/>
    <path d="M47.5 65q12.5 15 25 0z" fill="#C8352F"/><path d="M49.4 65.7h21.2l-1.4 3H50.8z" fill="#fff" stroke-width="1.3"/><path d="M55 74q5 2.4 10 0" fill="none" stroke="#F08C8C" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="50" cy="49" rx="6.5" ry="7.5" fill="#fff"/><ellipse cx="70" cy="49" rx="6.5" ry="7.5" fill="#fff"/>
  </g>
  <circle cx="51" cy="50" r="3.4" fill="#1B1512"/><circle cx="69" cy="50" r="3.4" fill="#1B1512"/><circle cx="52.2" cy="48.8" r="1.1" fill="#fff"/><circle cx="70.2" cy="48.8" r="1.1" fill="#fff"/>
  <path d="M42 40q7-5 14-1.5M64 38.5q7-3.5 14 1.5" fill="none" stroke="#1B1512" stroke-width="4.4" stroke-linecap="round"/>
  <path d="M59.5 55q2.5 3.6-.6 5" fill="none" stroke="#1B1512" stroke-width="2" stroke-linecap="round"/>
  <path d="M62 94.5l1 3M58.5 99l1 3" stroke="#F7A3A0" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;
const PLANT=`<svg class="plant" viewBox="0 0 80 110" aria-hidden="true"><path d="M40 70 C20 60 8 40 14 22 C28 30 38 48 40 70Z" fill="#4E9F3D"/><path d="M40 70 C58 58 72 38 64 18 C50 28 42 48 40 70Z" fill="#6BBF4A"/><path d="M40 72 C34 50 38 26 48 8 C54 30 50 52 40 72Z" fill="#3E8A31"/><path d="M22 70 h36 l-5 38 h-26z" fill="#C9683F"/><rect x="18" y="66" width="44" height="9" rx="3" fill="#B45A34"/></svg>`;

const P=JSON.parse(document.getElementById('shop-data').textContent);
const EMAIL=P.nico.email;
const PHOTOS=Object.fromEntries(Object.entries(P).map(([id,product])=>[id,product.photos]));

/* ---------- build the shelf ---------- */
function crimp(){const n=18,pts=[];for(let i=0;i<=n;i++)pts.push(`${i/n*100}% ${i%2?0:5}px`);for(let i=n;i>=0;i--)pts.push(`${i/n*100}% calc(100% - ${i%2?0:5}px)`);return `polygon(${pts.join(',')})`}
document.documentElement.style.setProperty('--crimp',crimp());
document.querySelectorAll('.product-fallback').forEach(el=>el.remove());
document.documentElement.classList.add('shop-enhanced');
function productHTML(id){const p=P[id];
  if(p.kind==='fig')return `<span class="body"><span class="box"><span class="hang"></span><span class="hdr">BITS &amp; BOARDS</span><span class="window">${FIG}</span><span class="nm">NICO</span><span class="sub">SHOPKEEPER EDITION</span></span></span>`;
  return `<span class="body"><span class="pk" style="--c1:${p.c1};--c2:${p.c2}"><span class="seal"></span><span class="brand">NICOLASH · BOOSTER</span>
    <span class="win"><img src="${p.art}" alt="">${id==='ar'?'<span class="q">?</span>':''}</span><span class="ttl">${p.title}</span><span class="meta">${p.meta}</span><span class="seal b"></span><span class="foil"></span></span>
    ${id==='ar'?'<span class="tear"><i>✂ TEAR HERE</i></span>':''}</span>`;
}
const rows={bb:'row1',sf:'row1',tc:'row1',ar:'row2',nico:'row2'};
['sf','bb','tc','ar','nico'].forEach(id=>{
  const p=P[id],spot=document.createElement('div');spot.className='spot'+(p.big?' big':'');
  const b=document.createElement('button');b.className='product'+(p.big?' big':'')+(p.legend?' legend':'');b.dataset.id=id;
  b.setAttribute('aria-label',p.kind==='fig'?'Open the Nico figure: about me':`Open the ${p.title} pack`);
  b.innerHTML=productHTML(id);
  spot.innerHTML=`<span class="ghost">AT<br>CHECKOUT</span><span class="tag">${p.tag}</span>${p.talker?`<span class="talker">${p.talker}</span>`:''}`;
  b.insertAdjacentHTML('afterbegin','<span class="shadow"></span>');spot.prepend(b);document.getElementById(rows[id]).appendChild(spot);
  p.el=b;p.spot=spot;
  b.addEventListener('click',()=>state==='shelf'?buy(id):(id==='ar'&&b.classList.contains('sealed')?tear():null));
  b.addEventListener('pointermove',e=>{if(state!=='shelf')return;const r=b.getBoundingClientRect();b.style.setProperty('--rx',((e.clientX-r.left)/r.width-.5)*18+'deg');b.style.setProperty('--ry',(.5-(e.clientY-r.top)/r.height)*14+'deg')});
  b.addEventListener('pointerleave',()=>{b.style.removeProperty('--rx');b.style.removeProperty('--ry')});
  b.addEventListener('pointerenter',()=>{if(state==='shelf'&&!busy)sfx.crinkle()});
});
document.getElementById('row2').insertAdjacentHTML('beforeend',PLANT);
let figSnap=null;
let figureRequested=false;
function loadFigure(){
  if(figureRequested)return;
  figureRequested=true;
  const script=document.createElement('script');
  script.src='https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  script.async=true;
  script.onload=()=>{try{
    const win=P.nico.el.querySelector('.window'),F=mountFigure(window.THREE,win,{interactive:()=>state==='counter'&&cur==='nico'});
    win.classList.add('has3d');
    if(state==='counter'&&cur==='nico')$('note').textContent='Drag the figure to spin it';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{try{figSnap=F.snapshot(120)}catch(e){}}));
  }catch(e){console.warn('3D figure unavailable',e)}};
  script.onerror=()=>console.warn('3D figure unavailable');
  document.head.appendChild(script);
}
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();loadFigure()}
  },{root:document.getElementById('shelfScene'),rootMargin:'100px'});
  observer.observe(P.nico.el);
}else loadFigure();

/* ---------- sound: everything is synthesised with Web Audio ---------- */
const sfx=(()=>{
  let ctx=null,unlocked=false,muted=true,nb=null;
  try{const saved=localStorage.getItem('nicolash-shop-muted');muted=saved===null?true:saved==='1'}catch(e){}
  function ac(){if(muted||!unlocked)return null;if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C()}if(ctx.state==='suspended')ctx.resume();return ctx}
  function env(g,t,a,peak,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
  function tone(f,d,{type='sine',vol=.1,at=0,to=null,a=.005}={}){const c=ac();if(!c)return;const t=c.currentTime+at,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);env(g,t,a,vol,d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+a+d+.05)}
  function buf(c){if(nb)return nb;nb=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return nb}
  function noise(d,{vol=.1,at=0,f=1000,f2=null,q=1,type='bandpass',a=.005}={}){const c=ac();if(!c)return;const t=c.currentTime+at,n=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
    n.buffer=buf(c);n.loop=true;fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);env(g,t,a,vol,d);
    n.connect(fl).connect(g).connect(c.destination);n.start(t,Math.random()*.5);n.stop(t+a+d+.05)}
  return{
    get muted(){return muted},
    unlock(){unlocked=true;ac()},
    toggle(){muted=!muted;try{localStorage.setItem('nicolash-shop-muted',muted?'1':'0')}catch(e){}if(!muted)this.tick();return muted},
    tick(){tone(1400,.03,{type:'square',vol:.025})},
    crinkle(){noise(.07,{vol:.022,f:5200,q:.6,type:'highpass'});noise(.05,{vol:.015,f:3800,q:.6,type:'highpass',at:.05})},
    pick(){noise(.34,{vol:.08,f:380,f2:1700,q:.8,a:.04})},
    whoosh(){noise(.4,{vol:.07,f:1500,f2:320,q:.7,a:.03})},
    thud(){tone(150,.16,{vol:.32,to:55});noise(.05,{vol:.05,f:900,q:.8})},
    beep(){const c=ac();if(!c)return;const t=c.currentTime,g=c.createGain(),o=c.createOscillator(),o3=c.createOscillator(),g3=c.createGain();
      o.type='sine';o.frequency.value=2730;o3.type='sine';o3.frequency.value=8190;g3.gain.value=.12;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.14,t+.004);g.gain.setValueAtTime(.14,t+.125);g.gain.linearRampToValueAtTime(0,t+.14);
      o.connect(g);o3.connect(g3).connect(g);g.connect(c.destination);o.start(t);o3.start(t);o.stop(t+.16);o3.stop(t+.16)},
    print(dur){const c=ac();if(!c)return;const n=Math.floor(dur/.05);for(let i=0;i<n;i++)noise(.022,{vol:.03,f:2400+Math.random()*900,q:2.5,at:i*.05});tone(92,dur,{type:'sawtooth',vol:.01,a:.06})},
    rip(d=.4){noise(d,{vol:.11,f:650,f2:3400,q:.55,a:.01});noise(d*.6,{vol:.05,f:5000,type:'highpass',at:d*.3})},
    flip(i){noise(.035,{vol:.05,f:3200,q:1});tone(660*Math.pow(1.26,i),.2,{vol:.045,type:'triangle',at:.02})},
    flick(){noise(.1,{vol:.05,f:2600,f2:900,q:.9})},
    ching(){tone(1318,.5,{vol:.07,type:'triangle'});tone(2637,.6,{vol:.04,at:.07});noise(.07,{vol:.04,f:5200,type:'highpass'})},
  }
})();
addEventListener('pointerdown',()=>sfx.unlock(),{capture:true});
addEventListener('keydown',()=>sfx.unlock(),{capture:true});

/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
const world=$('world'),shelfScene=$('shelfScene'),counterScene=$('counterScene'),slot=$('slot'),stage=$('stage'),receipt=$('receipt'),fan=$('fan');
const TAP=matchMedia('(pointer:coarse)').matches?'Tap':'Click';
const wait=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
let state='shelf',cur=null,busy=false;
function lcd(a,b){$('lcd1').textContent=a;if(b!=null)$('lcd2').textContent=b;const l=$('lcd');l.classList.remove('flash');void l.offsetWidth;l.classList.add('flash')}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),1800)}
function copy(){sfx.ching();navigator.clipboard.writeText(EMAIL).then(()=>toast('Email copied · '+EMAIL),()=>toast(EMAIL))}
function setHash(h){
  const url=location.pathname+location.search+(h?'#'+h:'');
  if(location.pathname+location.search+location.hash===url)return;
  try{history.pushState(null,'',url)}catch(e){}
}
function pan(to,instant){
  if(instant){world.classList.add('instant')}
  world.classList.toggle('at-counter',to==='counter');
  shelfScene.inert=to!=='shelf';counterScene.inert=to!=='counter';
  if(instant){void world.offsetWidth;world.classList.remove('instant')}
}
// Carry the real item between its shelf spot and the counter: pick it up, arc across while the
// camera pans, hover over the destination, then set it down. `dest` is its new parent and
// `shift` is how far the camera will pan (so the destination can be measured before it moves).
const DUR=1150;
function move(node,dest,shift,onLand){
  const a=node.getBoundingClientRect();
  dest.prepend(node);
  const r=node.getBoundingClientRect(),b={left:r.left+shift,top:r.top,width:r.width,height:r.height};
  if(reduce){onLand&&onLand();return Promise.resolve()}
  // lift the item out of the layout and hold it exactly where it was
  document.body.appendChild(node);node.classList.add('moving','airborne');
  Object.assign(node.style,{left:a.left+'px',top:a.top+'px'});node.style.setProperty('--w',a.width+'px');
  const dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2),s=b.width/a.width,dir=dx>0?1:-1;
  const k=(x,y,sc,rot)=>`translate(${x}px,${y}px) scale(${sc}) rotate(${rot}deg)`;
  const anim=node.animate([
    {transform:k(0,0,1,0),easing:'cubic-bezier(.3,0,.3,1)'},
    {transform:k(0,-22,1.04,-dir*2),offset:.14,easing:'cubic-bezier(.45,0,.25,1)'},
    {transform:k(dx*.5,dy*.5-90,(1+s)/2*1.04,dir*5),offset:.5,easing:'cubic-bezier(.3,0,.3,1)'},
    {transform:k(dx,dy-30,s*1.03,0),offset:.8,easing:'cubic-bezier(.5,0,.75,0)'},
    {transform:k(dx,dy+3,s*.99,0),offset:.93,easing:'ease-out'},
    {transform:k(dx,dy,s,0)}],{duration:DUR,fill:'forwards'});
  setTimeout(()=>{node.classList.remove('airborne');onLand&&onLand()},DUR*.8);
  return anim.finished.then(()=>{
    dest.prepend(node);node.classList.remove('moving');['left','top','--w'].forEach(p=>node.style.removeProperty(p));anim.cancel();
  });
}

/* ---------- buy: shelf → counter ---------- */
async function buy(id,instant){
  if(busy||state!=='shelf')return;busy=true;cur=id;const p=P[id],node=p.el;
  if(id==='nico')loadFigure();
  node.style.removeProperty('--rx');node.style.removeProperty('--ry');node.blur();
  stage.classList.toggle('arch',id==='ar');
  counterScene.scrollTop=0;slot.classList.toggle('big',!!p.big);
  receipt.hidden=true;$('extras').hidden=true;$('note').textContent='';
  lcd('SCANNING...',p.lcd);p.spot.classList.add('away');
  if(instant){slot.prepend(node);pan('counter',true)}else{sfx.pick();const m=move(node,slot,-counterScene.offsetLeft,()=>sfx.thud());pan('counter');await m}
  state='counter';setHash(id);
  await arrive(id,instant);
}
// The item is on the counter: scan it, then print (or wait for the archive pack to be torn open)
async function arrive(id,instant){
  const p=P[id],node=p.el;
  const beam=$('beam');beam.classList.remove('go');void beam.offsetWidth;if(!instant)beam.classList.add('go');
  await wait(instant?0:1050);
  sfx.beep();lcd(p.name,p.lcd);
  renderExtras(id);
  if(id==='ar'){node.classList.add('sealed');node.setAttribute('aria-label','Tear open the Archive pack');$('note').textContent=TAP+' the pack to tear it open';lcd('TEAR TO OPEN',p.lcd);busy=false;node.focus({preventScroll:true});return}
  if(id==='nico'&&document.querySelector('.window.has3d'))$('note').textContent='Drag the figure to spin it';
  printReceipt(id);busy=false;$('back').focus({preventScroll:true});
}

/* ---------- below the item: gameplay photos + customers also bought ---------- */
const ORDER=['bb','sf','tc','ar','nico'],ROT=[-2,4,-5,3,-3];
function chipHTML(o){const q=P[o],fig=q.kind==='fig';
  const th=fig?`<span class="th" style="--c1:#FFF1C9;--c2:#F4B955">${figSnap?`<img src="${figSnap}" alt="" style="aspect-ratio:auto;height:100%;object-fit:contain">`:FIG}</span>`:`<span class="th" style="--c1:${q.c1};--c2:${q.c2}"><img src="${q.art}" alt=""></span>`;
  return `<button class="chip" data-id="${o}" aria-label="Swap for ${fig?'the Nico figure':q.title}">${th}<span><b>${fig?'Nico figure':q.title}</b><small>${fig?'ABOUT ME':o==='ar'?'MYSTERY PACK':q.tag}</small></span></button>`}
function renderExtras(id){
  const ex=$('extras'),photos=id==='ar'&&!fan.children.length?null:PHOTOS[id];
  const label=id==='nico'?'His work':id==='ar'?'From the archive':'Gameplay photos';
  ex.innerHTML=`${photos?`<section><div class="xh"><span>${label}</span><small id="phN">1 / ${photos.length}</small></div>
      <button class="stack" id="stack" aria-label="Show the next photo">${photos.map(src=>`<img src="${src}" alt="">`).join('')}</button>
      <div class="stackcap">${TAP} the stack to flip through</div></section>`:''}
    <section><div class="xh"><span>Customers also bought</span></div><div class="also">${ORDER.filter(o=>o!==id).map(chipHTML).join('')}</div></section>`;
  ex.hidden=false;ex.getAnimations().forEach(x=>x.cancel());
  if(!reduce)ex.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'});
  if(photos)initStack();
  ex.querySelectorAll('.chip').forEach(c=>c.onclick=()=>swap(c.dataset.id));
}
let pOrder=[];
function layoutStack(){const st=$('stack');if(!st)return;const imgs=[...st.children];
  pOrder.forEach((ix,pos)=>{const im=imgs[ix];im.style.zIndex=10-pos;im.classList.toggle('top',pos===0);im.style.opacity=pos<3?1:0;im.style.transform=`rotate(${ROT[pos]}deg) translate(${pos*5}px,${pos*4}px)`});
  $('phN').textContent=`${pOrder[0]+1} / ${imgs.length}`}
function initStack(){
  const st=$('stack'),imgs=[...st.children];pOrder=imgs.map((_,i)=>i);layoutStack();
  st.onclick=()=>{if(st.dataset.busy)return;st.dataset.busy='1';sfx.flick();const top=imgs[pOrder[0]];
    const next=()=>{pOrder.push(pOrder.shift());layoutStack();setTimeout(()=>delete st.dataset.busy,160)};
    if(reduce){next();return}
    // toss the top photo aside; it slides back in underneath the stack
    top.animate([{transform:top.style.transform},{transform:'translate(72%,-12%) rotate(16deg)',offset:.55},{transform:`rotate(${ROT[2]}deg) translate(10px,8px)`}],{duration:480,easing:'cubic-bezier(.3,.7,.4,1)'});
    setTimeout(next,260);
  };
}

/* ---------- swap: trade the item on the counter for another one ---------- */
async function swap(id){
  if(busy||state!=='counter'||id===cur)return;busy=true;
  const old=P[cur],oldNode=old.el,p=P[id],node=p.el,ex=$('extras');
  $('note').textContent='';
  if(!reduce)ex.animate([{opacity:1},{opacity:0}],{duration:220,fill:'forwards'});
  const {tearOff}=await clearCounter(old);
  sfx.whoosh();
  if(!reduce){const out=oldNode.animate([{transform:'none'},{transform:'translate(-24px,-26px) rotate(-5deg)',offset:.3},{transform:'translate(-110vw,-10px) rotate(-16deg)'}],{duration:520,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});await out.finished;await tearOff;
    old.spot.prepend(oldNode);out.cancel()}else old.spot.prepend(oldNode);
  receipt.hidden=true;receipt.getAnimations().forEach(x=>x.cancel());ex.hidden=true;
  old.spot.classList.remove('away');
  cur=id;p.spot.classList.add('away');stage.classList.toggle('arch',id==='ar');slot.classList.toggle('big',!!p.big);slot.prepend(node);
  lcd('SCANNING...',p.lcd);setHash(id);
  counterScene.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  if(!reduce){sfx.whoosh();await node.animate([{transform:'translate(-110vw,-30px) rotate(-12deg)'},{transform:'translate(0,-26px) rotate(2deg)',offset:.78},{transform:'translate(0,3px)',offset:.92},{transform:'none'}],{duration:720,easing:'cubic-bezier(.2,.7,.3,1)'}).finished}
  sfx.thud();
  await arrive(id);
}

/* ---------- archive: tear it open ---------- */
async function tear(){
  if(busy||cur!=='ar')return;busy=true;const node=P.ar.el,pk=node.querySelector('.pk'),body=node.querySelector('.body');
  node.classList.remove('sealed');node.setAttribute('aria-label','The Archive pack, opened');$('note').textContent='';
  const flap=pk.cloneNode(true);flap.classList.add('flap');flap.style.clipPath=`${getComputedStyle(pk).clipPath}`;
  const wrap=document.createElement('span');wrap.className='flap';wrap.style.clipPath='inset(0 0 78% 0)';wrap.appendChild(flap);body.appendChild(wrap);
  pk.style.clipPath='inset(22% 0 0 0)';
  if(!reduce)wrap.animate([{transform:'none'},{transform:'translate(30px,-50px) rotate(16deg)',offset:.35},{transform:'translate(140px,160px) rotate(70deg)',opacity:0}],{duration:950,easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'}).onfinish=()=>wrap.remove();else wrap.remove();
  sfx.rip(.45);lcd('3 CARDS FOUND','ARCHIVE');
  // cards burst out of the pack and fan above it
  const nr=node.getBoundingClientRect(),fr=fan.getBoundingClientRect(),startY=nr.top+nr.height*.35-fr.top;
  const small=matchMedia('(max-width:560px)').matches,sp=small?94:132;
  P.ar.cards.forEach((c,i)=>{
    const el=document.createElement('button');el.className='acard';el.dataset.id=c.id;el.setAttribute('aria-label',c.n);
    el.innerHTML=`<span class="in"><span class="f"><img src="${c.img}" alt=""><b>${c.n}</b><span>${c.m}</span></span><span class="bk"></span></span>`;
    const o=i-1,end=`translate(${o*sp}px,${Math.abs(o)*14}px) rotate(${o*7}deg)`;
    el.style.transform=end;fan.appendChild(el);
    if(!reduce)el.animate([{transform:`translate(0,${startY}px) scale(.35) rotateY(180deg)`,opacity:0},{transform:`translate(${o*sp*.4}px,-40px) scale(1.05) rotateY(90deg)`,opacity:1,offset:.55},{transform:`${end} rotateY(0deg)`}],
      {duration:900,delay:250+i*140,easing:'cubic-bezier(.3,.8,.3,1)',fill:'backwards'});
    setTimeout(()=>sfx.flip(i),reduce?0:250+i*140+480);
    el.addEventListener('click',()=>{fan.querySelectorAll('.acard').forEach(x=>x.classList.toggle('hi',x===el));
      const li=receipt.querySelector(`[data-card="${c.id}"]`);if(li){receipt.querySelectorAll('.citem').forEach(x=>x.classList.toggle('hi',x===li));li.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}});
  });
  await wait(1400);
  $('note').textContent=TAP+' a card to find it on the receipt';
  printReceipt('ar');renderExtras('ar');counterScene.scrollTop=0;busy=false;
  fan.querySelector('.acard')?.focus({preventScroll:true});
}

/* ---------- receipts ---------- */
function stamp(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}  ${p(d.getHours())}:${p(d.getMinutes())}`}
function linkAttrs(url){return url.startsWith('/')?'':' target="_blank" rel="noopener noreferrer"'}
function barcode(){let bars='',x=0;for(const ch of '*'+EMAIL+'*'){const c=ch.charCodeAt(0);for(let k=0;k<5;k++){const w=((c>>k)&1)?3:1.4;if(k%2===0)bars+=`<rect x="${x}" y="0" width="${w}" height="56" fill="#2A2320"/>`;x+=w+1.2}}return `<svg viewBox="0 0 ${x} 56" preserveAspectRatio="none">${bars}</svg>`}
function receiptHTML(id){
  const p=P[id],head=`<div class="c"><span class="logo"><span class="b">[</span><span>Nicolash<br>Games</span><span class="b">]</span></span></div>
    <div class="c small" style="margin-top:8px">GAME &amp; CARD SHOP · TILL 01</div><hr class="hr d">
    <div class="kv small"><span>${stamp()}</span><span>CASHIER: NICO</span></div><hr class="hr">`;
  const foot=`<hr class="hr d"><div class="kv total"><span>TOTAL</span><span>1 ITEM</span></div><div class="lead small"><span>PAID WITH</span><span>CURIOSITY</span></div><hr class="hr d">`;
  const end=`<hr class="hr"><div class="c thanks">THANK YOU · COME AGAIN</div><button class="rback" data-back>← RETURN TO SHELF</button>`;
  if(p.kind==='fig')return head+`<div class="line1"><b>1 × NICO FIGURE</b><span class="tg">ABOUT</span></div><div class="genre">Developer figure · Bits and Boards shopkeeper edition · 1:12</div>
    <hr class="hr"><p class="bio"><b style="color:var(--ink)">${p.intro}</b> ${p.bio[0]}</p>
    ${p.bio.slice(1).map(line=>`<p class="bio">${line}</p>`).join('')}
    <hr class="hr"><div class="sect">FEATURES</div>
    ${p.f.map(feature=>`<div class="lead"><span>${feature}</span><span>✓</span></div>`).join('')}
    <hr class="hr"><div class="sect">ACCESSORIES INCLUDED</div><div class="tools">${p.tools.map(tool=>`<span>${tool}</span>`).join('')}</div>
    <div class="links">${p.links.map(link=>`<a href="${link[1]}"${linkAttrs(link[1])}>${link[0]}</a>`).join('')}</div>
    ${foot}<button class="barcode" data-copy aria-label="Copy email address">${barcode()}</button><div class="c small">${EMAIL}</div><div class="c small">${TAP.toUpperCase()} THE BARCODE TO COPY</div>${end}`;
  if(id==='ar')return head+`<div class="line1"><b>1 × THE ARCHIVE</b><span class="tg">2021–22</span></div><div class="genre">${p.genre}</div>
    <hr class="hr"><div class="sect">PACK CONTENTS (3)</div>
    ${p.cards.map(c=>`<div class="citem" data-card="${c.id}"><img src="${c.img}" alt=""><div><b>${c.n}</b><span class="small">${c.m}</span><p>${c.d}</p><a href="${c.l[1]}"${linkAttrs(c.l[1])}>${c.l[0]} ↗</a></div></div>`).join('')}
    <div class="links"><a href="/archive/">Full archive</a></div>${foot.replace('1 ITEM','3 CARDS')}${end}`;
  return head+`<div class="line1"><b>1 × ${p.name}</b><span class="tg">${p.tag}</span></div><div class="genre">${p.genre}</div>
    <span class="printimg"><img src="${p.shot}" alt="${p.title}"></span><p class="desc">${p.d}</p>
    <hr class="hr"><div class="sect">WHAT’S IN THE PACK</div><ul class="list">${p.f.map(x=>`<li>${x}</li>`).join('')}</ul>
    <hr class="hr"><div class="sect">BUILT WITH</div><div class="tools">${p.tools.map(t=>`<span>${t}</span>`).join('')}</div>
    <div class="links">${p.links.map(l=>`<a href="${l[1]}"${linkAttrs(l[1])}>${l[0]}</a>`).join('')}</div>${foot}${end}`;
}
function printReceipt(id){
  receipt.innerHTML=receiptHTML(id);receipt.hidden=false;
  receipt.classList.remove('print');void receipt.offsetWidth;if(!reduce)receipt.classList.add('print');
  sfx.print(reduce?.3:1.8);
  receipt.querySelectorAll('[data-copy]').forEach(b=>b.onclick=copy);
  receipt.querySelectorAll('[data-back]').forEach(b=>b.onclick=goBack);
  if(matchMedia('(max-width:900px)').matches)setTimeout(()=>counterScene.scrollTo({top:counterScene.scrollTop+$('lcd').getBoundingClientRect().top-counterScene.getBoundingClientRect().top-70,behavior:reduce?'auto':'smooth'}),reduce?0:500);
}

/* ---------- back: counter → shelf ---------- */
// Tear off the receipt, put the archive cards back in their pack and close it
async function clearCounter(p){
  const node=p.el;let tearOff=Promise.resolve();
  if(!receipt.hidden&&!reduce){sfx.rip(.2);tearOff=receipt.animate([{transform:'none',opacity:1},{transform:'translateY(-14px) rotate(-1deg)',opacity:1,offset:.3},{transform:'translate(30px,80px) rotate(6deg)',opacity:0}],{duration:420,easing:'ease-in',fill:'forwards'}).finished}
  const cards=[...fan.children];
  if(cards.length&&!reduce){
    const nr=node.getBoundingClientRect(),fr=fan.getBoundingClientRect(),y=nr.top+nr.height*.35-fr.top,pk=node.querySelector('.pk');
    await Promise.all([...cards.map((c,i)=>c.animate([{},{transform:`translate(0,${y}px) scale(.35)`,opacity:0}],{duration:380,delay:i*50,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'}).finished),
      pk.animate([{clipPath:'inset(22% 0 0 0)'},{clipPath:'inset(0% 0 0 0)'}],{duration:260,delay:330,easing:'ease-out',fill:'forwards'}).finished]);
    pk.getAnimations().forEach(x=>x.cancel());
  }
  fan.innerHTML='';
  node.classList.remove('sealed');const pk=node.querySelector('.pk');if(pk)pk.style.clipPath='';node.querySelectorAll('.flap').forEach(f=>f.remove());
  if(p.kind==='pack')node.setAttribute('aria-label',`Open the ${p.title} pack`);
  return {tearOff};
}
async function goBack(){
  if(busy||state!=='counter')return;busy=true;const p=P[cur],node=p.el;
  lcd('THANK YOU!','COME AGAIN');$('note').textContent='';
  const {tearOff}=await clearCounter(p);
  await Promise.race([tearOff,wait(160)]);
  sfx.pick();
  const m=move(node,p.spot,counterScene.offsetLeft,()=>{p.spot.classList.remove('away');sfx.thud()});
  pan('shelf');
  await tearOff;receipt.hidden=true;receipt.getAnimations().forEach(a=>a.cancel());
  await m;
  $('extras').hidden=true;stage.classList.remove('arch');
  state='shelf';cur=null;setHash('');lcd('WELCOME','TILL 01');busy=false;node.focus({preventScroll:true});
}
$('back').onclick=goBack;
const muteBtn=$('mute');
function syncMute(){muteBtn.setAttribute('aria-pressed',sfx.muted);muteBtn.setAttribute('aria-label',sfx.muted?'Unmute sounds':'Mute sounds')}
muteBtn.onclick=()=>{sfx.unlock();sfx.toggle();syncMute()};syncMute();
addEventListener('keydown',e=>{if(e.key==='Escape')goBack()});

/* ---------- clock + deep link ---------- */
function tick(){const d=new Date(),p=n=>String(n).padStart(2,'0');$('clock').textContent=`${p(d.getHours())}${d.getSeconds()%2?':':' '}${p(d.getMinutes())}`}
tick();setInterval(tick,1000);
function syncFromLocation(){
  if(busy)return;
  const id=location.hash.slice(1);
  if(P[id]){
    if(state==='shelf')buy(id,true);
    else if(cur!==id)swap(id);
  }else if(state==='counter')goBack();
}
addEventListener('popstate',syncFromLocation);
addEventListener('hashchange',syncFromLocation);
syncFromLocation();
