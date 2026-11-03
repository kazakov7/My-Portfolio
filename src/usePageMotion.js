import {useEffect,useRef} from 'react';

export default function usePageMotion(rootRef,enabled,contentKey){
 const lastKey=useRef(contentKey);
 useEffect(()=>{
  const root=rootRef.current;if(!root)return;
  let frame=0;
  const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--read-progress',String(max>0?Math.min(1,scrollY/max):0));};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const resize=new ResizeObserver(scroll);resize.observe(root);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll,{passive:true});update();
  return()=>{resize.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
 },[rootRef]);
 useEffect(()=>{
  const root=rootRef.current;if(!root||!enabled)return;
  const animations=new Set(),elements=[...root.querySelectorAll('.motion-reveal')];
  const play=(element,delay=0,hero=false)=>{element.classList.remove('motion-pending');if(typeof element.animate!=='function')return;const frames=hero?[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}];const animation=element.animate(frames,{duration:hero?750:650,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.add(animation);animation.finished.then(()=>animations.delete(animation)).catch(()=>{});if(element.matches('.service-grid,.notes-grid,.social-cards')){[...element.children].forEach((child,i)=>{const stagger=child.animate([{opacity:0,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:600,delay:i*70,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.add(stagger);stagger.finished.then(()=>animations.delete(stagger)).catch(()=>{});});}};
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);entry.target.dataset.motionSeen='true';play(entry.target);}}, {threshold:.06,rootMargin:'0px 0px -24px 0px'});
  elements.forEach(element=>{if(element.dataset.motionSeen)return;element.classList.add('motion-pending');observer.observe(element);});
  const focus=e=>{const pending=e.target.closest?.('.motion-pending');if(pending){observer.unobserve(pending);pending.classList.remove('motion-pending');}};root.addEventListener('focusin',focus);
  const visibility=()=>{animations.forEach(animation=>{if(document.hidden)animation.pause();else if(animation.playState==='paused')animation.play();});};document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();animations.forEach(a=>a.cancel());elements.forEach(e=>e.classList.remove('motion-pending'));root.removeEventListener('focusin',focus);document.removeEventListener('visibilitychange',visibility);};
 },[rootRef,enabled]);
 useEffect(()=>{if(lastKey.current===contentKey)return;lastKey.current=contentKey;if(!enabled)return;const element=rootRef.current?.querySelector('.work-presentation');const catalog=rootRef.current?.querySelector('.skill-catalog');const animations=[element,catalog].filter(Boolean).map(el=>el.animate([{opacity:.45,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'}));return()=>animations.forEach(a=>a.cancel());},[contentKey,enabled,rootRef]);
}
