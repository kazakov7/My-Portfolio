import {useEffect,useRef,useState} from 'react';
import {Swiper,SwiperSlide} from 'swiper/react';
import {A11y,Keyboard,EffectFade} from 'swiper/modules';
import {ChevronLeft,ChevronRight,Quote} from 'lucide-react';
import {approaches} from './design-content';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function PrincipleSwiper({lang,t,motion,suspended=false}){
 const api=useRef(null),[active,setActive]=useState(0);
 useEffect(()=>{const swiper=api.current;if(!swiper||swiper.destroyed)return;if(suspended)swiper.keyboard?.disable();else swiper.keyboard?.enable();},[suspended]);
 return <><div className="principle-carousel motion-reveal" role="region" aria-roledescription={t.carouselRole} aria-label={t.principleCarousel}><button className="carousel-arrow" aria-label={t.previous} onClick={()=>api.current?.slidePrev(motion?550:0)}><ChevronLeft size={23}/></button><Swiper className="principle-swiper" modules={[A11y,Keyboard,EffectFade]} slidesPerView={1} loop effect="fade" fadeEffect={{crossFade:true}} speed={motion?550:0} grabCursor keyboard={{enabled:!suspended,onlyInViewport:true,pageUpDown:false}} onSwiper={swiper=>{api.current=swiper;}} onSlideChange={swiper=>setActive(swiper.realIndex)} a11y={{enabled:true,containerRoleDescriptionMessage:t.carouselRole,itemRoleDescriptionMessage:t.slideRole,slideLabelMessage:t.slideLabel}}>{approaches.map((p,i)=><SwiperSlide key={i} aria-hidden={active!==i}><article className="principle-card"><img src="/assets/portrait.webp" alt="Kevin" loading="lazy" draggable="false"/><Quote className="quote-mark" size={85}/><p>{p.quote[lang]}</p><div><strong>Kevin</strong><span>{p.tag[lang]}</span></div><h3>{p.title[lang]}</h3></article></SwiperSlide>)}</Swiper><button className="carousel-arrow" aria-label={t.next} onClick={()=>api.current?.slideNext(motion?550:0)}><ChevronRight size={23}/></button></div><div className="carousel-dots">{approaches.map((p,i)=><button key={i} aria-label={p.title[lang]} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>api.current?.slideToLoop(i,motion?550:0)}/>)}</div></>
}
