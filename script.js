const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('nav a')];
window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-140)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));},{passive:true});

const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.hero-dots button')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeSlide=0;
let heroTimer;
function showSlide(index){activeSlide=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('active',i===activeSlide));dots.forEach((dot,i)=>dot.classList.toggle('active',i===activeSlide));}
function startHero(){if(reduceMotion||slides.length<2)return;clearInterval(heroTimer);heroTimer=setInterval(()=>showSlide(activeSlide+1),7000);}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startHero();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(heroTimer);else startHero();});
startHero();


const headerConsultation=document.querySelector('.header-cta');
headerConsultation?.addEventListener('click',(event)=>{
  event.preventDefault();
  window.scrollTo({top:document.documentElement.scrollHeight-window.innerHeight,behavior:reduceMotion?'auto':'smooth'});
});
