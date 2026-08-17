const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>{
  if(document.body.classList.contains('services-page') && el.id==='advisory') return;
  observer.observe(el);
});

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('nav a')];
if(document.body.classList.contains('home-page')){
  const updateHomeNav=()=>{
    let current='home';
    sections.forEach(s=>{if(scrollY>=s.offsetTop-140)current=s.id});
    const activeHref = current==='what-we-do' ? 'services.html'
      : (current==='darin'||current==='why') ? 'about.html'
      : current==='market' ? '#market'
      : current==='insights' ? '#insights'
      : current==='contact' ? ''
      : '#home';
    links.forEach(a=>a.classList.toggle('active',activeHref && (a.getAttribute('href')||'')===activeHref));
  };
  updateHomeNav();
  window.addEventListener('scroll',updateHomeNav,{passive:true});
}

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



const siteHeader=document.querySelector('.site-header');
const updateHeaderState=()=>siteHeader?.classList.toggle('scrolled',window.scrollY>48);
updateHeaderState();
window.addEventListener('scroll',updateHeaderState,{passive:true});

// Latitude Stone CRE Community modal
const communityModal=document.querySelector('#community-modal');
const communityTriggers=[...document.querySelectorAll('.community-trigger')];
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
communityTriggers.forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();openCommunityModal();}));
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
const scheduleSubmit=document.querySelector('#schedule-submit');

if(scheduleForm&&calendarDays){
  let viewDate=new Date(2026,7,1);
  let selectedDate=null;

  const requiredFormComplete=()=>{
    const required=[...scheduleForm.querySelectorAll('[required]')];
    return required.every(field=>{
      if(field.type==='radio') return !!scheduleForm.querySelector(`[name="${field.name}"]:checked`);
      return String(field.value||'').trim()!=='';
    });
  };

  const updateScheduleCTA=()=>{
    if(!scheduleSubmit)return;
    const formComplete=requiredFormComplete();
    const hasDate=!!consultationDate?.value;
    const hasTime=!!consultationTime?.value;

    if(!formComplete){
      scheduleSubmit.textContent='Complete the form to continue';
      scheduleSubmit.disabled=true;
    }else if(!hasDate||!hasTime){
      scheduleSubmit.textContent='Select a date & time';
      scheduleSubmit.disabled=true;
    }else{
      scheduleSubmit.textContent='Schedule My Consultation';
      scheduleSubmit.disabled=false;
    }
  };

  const renderCalendar=()=>{
    calendarMonth.textContent=viewDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    calendarDays.innerHTML='';
    const y=viewDate.getFullYear(),m=viewDate.getMonth();
    const first=new Date(y,m,1).getDay(), total=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){
      const b=document.createElement('button');
      b.type='button';b.className='muted';b.disabled=true;b.textContent='';
      calendarDays.appendChild(b);
    }
    for(let d=1;d<=total;d++){
      const b=document.createElement('button');
      b.type='button';b.textContent=d;
      b.addEventListener('click',()=>{
        selectedDate=new Date(y,m,d);
        document.querySelectorAll('#calendar-days button').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        const label=selectedDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
        selectedDateLabel.textContent=label;
        consultationDate.value=label;
        updateScheduleCTA();
      });
      calendarDays.appendChild(b);
    }
  };

  document.querySelector('#prev-month')?.addEventListener('click',()=>{
    viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);
    renderCalendar();
  });
  document.querySelector('#next-month')?.addEventListener('click',()=>{
    viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);
    renderCalendar();
  });

  document.querySelectorAll('#time-grid button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#time-grid button').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    consultationTime.value=b.textContent.trim();
    updateScheduleCTA();
  }));

  scheduleForm.addEventListener('input',updateScheduleCTA);
  scheduleForm.addEventListener('change',updateScheduleCTA);

  scheduleForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!scheduleForm.reportValidity())return;
    if(!consultationDate.value||!consultationTime.value){
      alert('Please select a date and time.');
      return;
    }
    const data=new FormData(scheduleForm);
    const lines=[];
    for(const [k,v] of data.entries()){
      if(String(v).trim())lines.push(`${k.replaceAll('_',' ')}: ${v}`);
    }
    window.location.href=`mailto:info@latitudestonerealestate.com?subject=${encodeURIComponent('Consultation Request')}&body=${encodeURIComponent(lines.join('\n'))}`;
  });

  renderCalendar();
  updateScheduleCTA();
}

// v4.8: service-page deep links + reliable automatic first-section reveal
if(document.body.classList.contains('services-page')){
  const serviceIds=['advisory','investment-sales','property-disposition','tenant-representation','property-management'];
  const hashId=location.hash.replace('#','');
  const target=serviceIds.includes(hashId)?document.getElementById(hashId):null;
  const advisory=document.getElementById('advisory');

  if(target){
    target.classList.add('visible');
    requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }else if(advisory){
    advisory.classList.remove('visible');
    if(reduceMotion){
      advisory.classList.add('visible');
    }else{
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        window.setTimeout(()=>advisory.classList.add('visible'),550);
      }));
    }
  }
}


// v5.0 — Market Intelligence investment calculator
(() => {
  const form=document.getElementById('investment-calculator-form');
  if(!form) return;

  const $=id=>document.getElementById(id);
  const fields={
    price:$('calc-price'),
    noi:$('calc-noi'),
    down:$('calc-down'),
    rate:$('calc-rate'),
    amort:$('calc-amort')
  };

  const fmtCurrency=value=>{
    if(!Number.isFinite(value)) value=0;
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
  };
  const num=el=>Math.max(0,parseFloat(el?.value)||0);

  function calc(){
    const price=num(fields.price);
    const noi=num(fields.noi);
    const downPct=Math.min(100,num(fields.down));
    const ratePct=num(fields.rate);
    const amortYears=Math.max(1,num(fields.amort));

    const equity=price*(downPct/100);
    const loan=Math.max(0,price-equity);
    const monthlyRate=(ratePct/100)/12;
    const n=amortYears*12;
    const monthlyDebt=loan===0?0:(monthlyRate===0?loan/n:loan*(monthlyRate*Math.pow(1+monthlyRate,n))/(Math.pow(1+monthlyRate,n)-1));
    const annualDebt=monthlyDebt*12;
    const cashflow=noi-annualDebt;
    const cap=price>0?noi/price:0;
    const dscr=annualDebt>0?noi/annualDebt:0;

    $('result-cap').textContent=(cap*100).toFixed(2)+'%';
    $('result-loan').textContent=fmtCurrency(loan);
    $('result-equity').textContent=fmtCurrency(equity);
    $('result-monthly').textContent=fmtCurrency(monthlyDebt);
    $('result-annual-debt').textContent=fmtCurrency(annualDebt);
    $('result-cashflow').textContent=fmtCurrency(cashflow);
    $('result-dscr').textContent=annualDebt>0?dscr.toFixed(2)+'x':'—';

    let label='No debt service';
    if(annualDebt>0){
      if(dscr>=2) label='Very strong coverage';
      else if(dscr>=1.25) label='Healthy coverage';
      else if(dscr>=1) label='Tighter coverage';
      else label='NOI does not fully cover debt service';
    }
    $('result-dscr-label').textContent=label;

    return {price,noi,downPct,ratePct,amortYears,equity,loan,monthlyDebt,annualDebt,cashflow,cap,dscr,label};
  }

  Object.values(fields).forEach(el=>el?.addEventListener('input',calc));
  $('calculator-reset')?.addEventListener('click',()=>{
    fields.price.value=1000000;
    fields.noi.value=70000;
    fields.down.value=35;
    fields.rate.value=6;
    fields.amort.value=25;
    calc();
  });

  document.querySelector('[data-tool-target="investment-calculator"]')?.addEventListener('click',()=>{
    document.getElementById('investment-calculator')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  const modal=$('investment-modal');
  const openInvestment=()=>{
    const r=calc();
    const summary=$('investment-summary');
    if(summary){
      summary.innerHTML=
        '<strong>Scenario summary</strong><br>'+
        'Purchase Price: '+fmtCurrency(r.price)+'<br>'+
        'Annual NOI: '+fmtCurrency(r.noi)+'<br>'+
        'Purchase Cap Rate: '+(r.cap*100).toFixed(2)+'%<br>'+
        'Loan Amount: '+fmtCurrency(r.loan)+'<br>'+
        'DSCR: '+(r.annualDebt>0?r.dscr.toFixed(2)+'x':'—');
    }
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  };
  const closeInvestment=()=>{
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  };
  document.querySelector('.investment-lead-trigger')?.addEventListener('click',openInvestment);
  document.querySelectorAll('[data-investment-close]').forEach(el=>el.addEventListener('click',closeInvestment));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeInvestment()});

  $('investment-review-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=e.currentTarget.querySelector('button[type="submit"]');
    if(btn){
      btn.textContent='Thank you';
      btn.disabled=true;
    }
  });

  calc();
})();
