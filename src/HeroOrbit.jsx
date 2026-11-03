import {useEffect,useRef} from 'react';

export default function HeroOrbit({motion,onReady}) {
 const host=useRef(null),state=useRef({motion,dirty:true});
 useEffect(()=>{state.current.motion=motion;state.current.dirty=true;},[motion]);
 useEffect(()=>{
  let disposed=false,renderer,scene,camera,group,environment,pmrem,resize,visibility,raf,texture,room;
  let visible=true,previous=0,time=0,hover={x:0,y:0},lastFrame=0;
  const geometries=[],materials=[];
  const mount=host.current,hero=mount.closest('.hero');
  const mobile=window.matchMedia('(pointer: coarse)').matches;
  const move=e=>{if(e.pointerType==='touch'||!state.current.motion)return;const r=hero.getBoundingClientRect();hover.x=(e.clientX-r.left)/r.width-.5;hover.y=(e.clientY-r.top)/r.height-.5;state.current.dirty=true;};
  const leave=()=>{hover={x:0,y:0};state.current.dirty=true;};
  async function setup(){
   try{
    // Keep the CSS 3D composition when GPU rendering is unavailable.
    const canvas=document.createElement('canvas');
    const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
    if(!context||disposed)return;
    const THREE=await import('three');
    const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');
    if(disposed)return;
    renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    canvas.setAttribute('aria-hidden','true');mount.appendChild(canvas);
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(40,1,.1,50);camera.position.set(0,0,5.8);
    pmrem=new THREE.PMREMGenerator(renderer);room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);room.dispose();scene.environment=environment.texture;
    group=new THREE.Group();scene.add(group);
    const geom=g=>(geometries.push(g),g),mat=m=>(materials.push(m),m);
    const silver=mat(new THREE.MeshPhysicalMaterial({color:0xbac6e8,metalness:.9,roughness:.22,clearcoat:1}));
    const blue=mat(new THREE.MeshPhysicalMaterial({color:0x344afa,metalness:.55,roughness:.2,emissive:0x1325ae,emissiveIntensity:.45,clearcoat:1}));
    const body=new THREE.Mesh(geom(new THREE.CylinderGeometry(1.38,1.38,.15,96)),silver);body.rotation.x=Math.PI/2;group.add(body);
    texture=await new THREE.TextureLoader().loadAsync('/assets/hero-portrait.webp');
    if(disposed){texture.dispose();return;}
    texture.colorSpace=THREE.SRGBColorSpace;
    const face=new THREE.Mesh(geom(new THREE.CircleGeometry(1.365,96)),mat(new THREE.MeshBasicMaterial({map:texture})));face.position.z=.081;group.add(face);
    const rim=new THREE.Mesh(geom(new THREE.TorusGeometry(1.395,.035,12,128)),silver);rim.position.z=.07;group.add(rim);
    const ring1=new THREE.Mesh(geom(new THREE.TorusGeometry(1.68,.018,10,128)),blue);ring1.rotation.set(.46,.18,-.3);group.add(ring1);
    const ring2=new THREE.Mesh(geom(new THREE.TorusGeometry(1.58,.013,8,128)),silver);ring2.rotation.set(-.28,.32,.45);group.add(ring2);
    const satelliteGeometry=geom(new THREE.SphereGeometry(.075,20,14));const satellites=[];
    [blue,silver,blue].forEach((m,i)=>{const orb=new THREE.Mesh(satelliteGeometry,m);group.add(orb);satellites.push(orb);});
    const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-2,3,5);scene.add(key);scene.add(new THREE.AmbientLight(0xdce1ff,1.3));
    const fill=new THREE.PointLight(0x3856ff,8,12);fill.position.set(3,-1,3);scene.add(fill);
    resize=new ResizeObserver(()=>{const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();state.current.dirty=true;});resize.observe(mount);
    visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;state.current.dirty=true;});visibility.observe(mount);
    hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave,{passive:true});
    let announced=false;
    const frame=now=>{if(disposed)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.05);previous=now;if(!visible||document.hidden||now-lastFrame<(mobile?50:33))return;if(!state.current.motion&&!state.current.dirty)return;lastFrame=now;if(state.current.motion)time+=dt;
     group.rotation.x+=(hover.y*.16-group.rotation.x)*.06;group.rotation.y+=(hover.x*.2-group.rotation.y)*.06;
     ring1.rotation.z=-.3+time*.055;ring2.rotation.z=.45-time*.04;
     satellites.forEach((orb,i)=>{const angle=time*.19+i*Math.PI*.68,r=1.69;orb.position.set(Math.cos(angle)*r,Math.sin(angle)*r*.88,Math.sin(angle)*.45);});
     renderer.render(scene,camera);state.current.dirty=false;if(!announced){announced=true;onReady?.();}
    };raf=requestAnimationFrame(frame);
   }catch{renderer?.domElement.remove();}
  }
  setup();
  return()=>{disposed=true;cancelAnimationFrame(raf);resize?.disconnect();visibility?.disconnect();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture?.dispose();environment?.dispose();pmrem?.dispose();renderer?.dispose();renderer?.domElement.remove();};
 },[]);
 return <div className="hero-webgl" ref={host} aria-hidden="true"/>;
}
