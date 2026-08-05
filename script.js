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


const siteHeader=document.querySelector('.site-header');
const updateHeaderState=()=>siteHeader?.classList.toggle('scrolled',window.scrollY>48);
updateHeaderState();
window.addEventListener('scroll',updateHeaderState,{passive:true});

// Latitude Stone CRE Community modal
const communityModal=document.querySelector('#community-modal');
const communityTrigger=document.querySelector('.community-trigger');
const communityForm=document.querySelector('#community-form');
const communityCloseButtons=[...document.querySelectorAll('[data-community-close]')];
const roleInputs=[...document.querySelectorAll('input[name="role"]')];
const rolePanels=[...document.querySelectorAll('[data-role-panel]')];
let communityLastFocus=null;

function openCommunityModal(){
  if(!communityModal)return;
  communityLastFocus=document.activeElement;
  communityModal.classList.add('open');
  communityModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  setTimeout(()=>communityModal.querySelector('input[name="name"]')?.focus(),0);
}
function closeCommunityModal(){
  if(!communityModal)return;
  communityModal.classList.remove('open');
  communityModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  communityLastFocus?.focus?.();
}
communityTrigger?.addEventListener('click',openCommunityModal);
communityCloseButtons.forEach(button=>button.addEventListener('click',closeCommunityModal));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&communityModal?.classList.contains('open'))closeCommunityModal();});
roleInputs.forEach(input=>input.addEventListener('change',()=>{
  rolePanels.forEach(panel=>{panel.hidden=panel.dataset.rolePanel!==input.value;});
}));
communityForm?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!communityForm.reportValidity())return;
  const data=new FormData(communityForm);
  const lines=[];
  for(const [key,value] of data.entries())if(String(value).trim())lines.push(`${key.replaceAll('_',' ')}: ${value}`);
  const subject=encodeURIComponent('Latitude Stone CRE Community Signup');
  const body=encodeURIComponent(lines.join('\n'));
  window.location.href=`mailto:info@latitudestonerealestate.com?subject=${subject}&body=${body}`;
});


// Schedule consultation page calendar and submission
const scheduleForm=document.querySelector('#consultation-form');
const calendarDays=document.querySelector('#calendar-days');
const calendarMonth=document.querySelector('#calendar-month');
const selectedDateLabel=document.querySelector('#selected-date-label');
const consultationDate=document.querySelector('#consultation-date');
const consultationTime=document.querySelector('#consultation-time');
if(scheduleForm&&calendarDays){
  let viewDate=new Date(2026,7,1); let selectedDate=null;
  const renderCalendar=()=>{
    calendarMonth.textContent=viewDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    calendarDays.innerHTML='';
    const y=viewDate.getFullYear(),m=viewDate.getMonth();
    const first=new Date(y,m,1).getDay(), total=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){const b=document.createElement('button');b.type='button';b.className='muted';b.disabled=true;b.textContent='';calendarDays.appendChild(b)}
    for(let d=1;d<=total;d++){
      const b=document.createElement('button');b.type='button';b.textContent=d;
      b.addEventListener('click',()=>{selectedDate=new Date(y,m,d);document.querySelectorAll('#calendar-days button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const label=selectedDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});selectedDateLabel.textContent=label;consultationDate.value=label;});
      calendarDays.appendChild(b)
    }
  };
  document.querySelector('#prev-month')?.addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);renderCalendar()});
  document.querySelector('#next-month')?.addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar()});
  document.querySelectorAll('#time-grid button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#time-grid button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');consultationTime.value=b.textContent.trim()}));
  scheduleForm.addEventListener('submit',event=>{event.preventDefault();if(!scheduleForm.reportValidity())return;if(!consultationDate.value||!consultationTime.value){alert('Please select a date and time.');return;}const data=new FormData(scheduleForm);const lines=[];for(const [k,v] of data.entries())if(String(v).trim())lines.push(`${k.replaceAll('_',' ')}: ${v}`);window.location.href=`mailto:info@latitudestonerealestate.com?subject=${encodeURIComponent('Consultation Request')}&body=${encodeURIComponent(lines.join('\n'))}`});
  renderCalendar();
}
