import {useEffect} from 'react';

// Update transforms directly, once per animation frame, without React rerenders.
export default function useDepthMotion(rootRef, enabled, contentKey) {
 useEffect(()=>{
  const root=rootRef.current;
  if(!root)return;
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let active=null,frame=0,point=null,heroFrame=0;
  function resetCard(){if(active){active.classList.remove('is-tilting');active.style.removeProperty('--depth-x');active.style.removeProperty('--depth-y');active.style.removeProperty('--shine-x');active.style.removeProperty('--shine-y');active=null;}}
  function renderTilt(){frame=0;if(!point||!enabled||!fine)return;const {card,x,y}=point;if(active!==card)resetCard();active=card;const rect=card.getBoundingClientRect();const nx=Math.max(-1,Math.min(1,(x-rect.left)/rect.width*2-1));const ny=Math.max(-1,Math.min(1,(y-rect.top)/rect.height*2-1));const strength=Number(card.dataset.depth)||7;card.classList.add('is-tilting');card.style.setProperty('--depth-x',`${(-ny*strength).toFixed(2)}deg`);card.style.setProperty('--depth-y',`${(nx*strength).toFixed(2)}deg`);card.style.setProperty('--shine-x',`${(nx+1)*50}%`);card.style.setProperty('--shine-y',`${(ny+1)*50}%`);}
  function move(event){if(!enabled||!fine||event.pointerType==='touch')return;const target=event.target instanceof Element?event.target:null;const card=target?.closest('.depth-card');if(card&&root.contains(card)){point={card,x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(renderTilt);}else resetCard();const hero=target?.closest('.hero');if(hero&&!heroFrame){const rect=hero.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;heroFrame=requestAnimationFrame(()=>{hero.style.setProperty('--hero-x',`${(x*11).toFixed(2)}deg`);hero.style.setProperty('--hero-y',`${(-y*8).toFixed(2)}deg`);heroFrame=0;});}}
  function leave(event){if(!event.relatedTarget||!root.contains(event.relatedTarget)){resetCard();const hero=root.querySelector('.hero');hero?.style.removeProperty('--hero-x');hero?.style.removeProperty('--hero-y');}}
  const hero=root.querySelector('.hero');
  const observer=new IntersectionObserver(([entry])=>hero?.classList.toggle('hero-offscreen',!entry.isIntersecting),{threshold:0});if(hero)observer.observe(hero);
  const visibility=()=>root.classList.toggle('page-hidden',document.hidden);document.addEventListener('visibilitychange',visibility);visibility();
  if(enabled){root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerout',leave,{passive:true});}
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);root.classList.remove('page-hidden');hero?.classList.remove('hero-offscreen');cancelAnimationFrame(frame);cancelAnimationFrame(heroFrame);root.removeEventListener('pointermove',move);root.removeEventListener('pointerout',leave);resetCard();hero?.style.removeProperty('--hero-x');hero?.style.removeProperty('--hero-y');};
 },[rootRef,enabled,contentKey]);
}
