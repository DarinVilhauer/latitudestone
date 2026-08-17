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


// v5.1 — Market Intelligence dual calculators
(() => {
  const $=id=>document.getElementById(id);
  const investmentForm=$('investment-calculator-form');
  const valuationForm=$('valuation-calculator-form');
  if(!investmentForm && !valuationForm) return;

  const fmtCurrency=value=>{
    if(!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
  };
  const rawNumber=value=>{
    const cleaned=String(value??'').replace(/[^0-9.]/g,'');
    return Math.max(0,parseFloat(cleaned)||0);
  };
  const formatMoneyInput=el=>{
    if(!el) return;
    const digits=el.value.replace(/\D/g,'');
    el.value=digits ? Number(digits).toLocaleString('en-US') : '';
  };
  const bindMoneyInput=el=>{
    if(!el) return;
    el.addEventListener('input',()=>{
      formatMoneyInput(el);
      calculateInvestment();
      calculateValuation();
    });
  };

  // Tool selector
  const toolButtons=[...document.querySelectorAll('[data-tool]')];
  const panels=[...document.querySelectorAll('[data-tool-panel]')];
  function selectTool(name){
    toolButtons.forEach(btn=>{
      const active=btn.dataset.tool===name;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
    panels.forEach(panel=>{
      const active=panel.dataset.toolPanel===name;
      panel.classList.toggle('active',active);
      panel.hidden=!active;
    });
  }
  toolButtons.forEach(btn=>btn.addEventListener('click',()=>selectTool(btn.dataset.tool)));

  // Investment Analysis
  const inv={
    price:$('calc-price'), noi:$('calc-noi'), down:$('calc-down'),
    rate:$('calc-rate'), amort:$('calc-amort'),
    vacancy:$('calc-vacancy'), reserves:$('calc-reserves')
  };
  bindMoneyInput(inv.price);
  bindMoneyInput(inv.noi);

  function clearInvestmentResults(){
    ['result-cap','result-loan','result-equity','result-monthly','result-adjusted-noi',
     'result-annual-debt','result-cashflow','result-dscr'].forEach(id=>{if($(id)) $(id).textContent='—'});
    if($('result-dscr-label')) $('result-dscr-label').textContent='Enter property assumptions';
  }

  function calculateInvestment(){
    if(!investmentForm) return {};
    const price=rawNumber(inv.price?.value);
    const noi=rawNumber(inv.noi?.value);
    const downPct=Math.min(100,rawNumber(inv.down?.value));
    const ratePct=rawNumber(inv.rate?.value);
    const amortYears=Math.max(1,rawNumber(inv.amort?.value)||25);
    const vacancyPct=Math.min(100,rawNumber(inv.vacancy?.value));
    const reservesPct=Math.min(100,rawNumber(inv.reserves?.value));

    if(!(price>0 && noi>0)){
      clearInvestmentResults();
      return {price,noi,downPct,ratePct,amortYears,vacancyPct,reservesPct};
    }

    const equity=price*(downPct/100);
    const loan=Math.max(0,price-equity);
    const monthlyRate=(ratePct/100)/12;
    const n=amortYears*12;
    const monthlyDebt=loan===0 ? 0 :
      (monthlyRate===0 ? loan/n :
       loan*(monthlyRate*Math.pow(1+monthlyRate,n))/(Math.pow(1+monthlyRate,n)-1));
    const annualDebt=monthlyDebt*12;
    const adjustedNoi=noi*(1-vacancyPct/100-reservesPct/100);
    const cashflow=adjustedNoi-annualDebt;
    const cap=noi/price;
    const dscr=annualDebt>0 ? adjustedNoi/annualDebt : 0;

    $('result-cap').textContent=(cap*100).toFixed(2)+'%';
    $('result-loan').textContent=fmtCurrency(loan);
    $('result-equity').textContent=fmtCurrency(equity);
    $('result-adjusted-noi').textContent=fmtCurrency(adjustedNoi);
    $('result-annual-debt').textContent=fmtCurrency(annualDebt);
    $('result-cashflow').textContent=fmtCurrency(cashflow);
    $('result-dscr').textContent=annualDebt>0 ? dscr.toFixed(2)+'x' : '—';

    let label='—';
    if(annualDebt>0){
      if(dscr>=1.50) label='Strong';
      else if(dscr>=1.25) label='Healthy';
      else if(dscr>=1.00) label='Limited';
      else label='Shortfall';
    }
    $('result-dscr-label').textContent=label;
    return {price,noi,downPct,ratePct,amortYears,vacancyPct,reservesPct,equity,loan,monthlyDebt,annualDebt,adjustedNoi,cashflow,cap,dscr,label};
  }

  [inv.down,inv.rate,inv.amort,inv.vacancy,inv.reserves].forEach(el=>el?.addEventListener('input',calculateInvestment));
  $('calculator-reset')?.addEventListener('click',()=>{
    inv.price.value='';
    inv.noi.value='';
    inv.down.value=35;
    inv.rate.value=6;
    inv.amort.value=25;
    inv.vacancy.value=6;
    inv.reserves.value=3;
    clearInvestmentResults();
  });

  const investmentModal=$('investment-modal');
  function openInvestment(){
    const r=calculateInvestment();
    const summary=$('investment-summary');
    if(summary){
      summary.innerHTML=
        '<strong>Scenario summary</strong><br>'+
        'Purchase Price: '+(r.price?fmtCurrency(r.price):'Not entered')+'<br>'+
        'Annual NOI: '+(r.noi?fmtCurrency(r.noi):'Not entered')+'<br>'+
        'Adjusted NOI: '+(Number.isFinite(r.adjustedNoi)?fmtCurrency(r.adjustedNoi):'—')+'<br>'+
        'Purchase Cap Rate: '+(Number.isFinite(r.cap)?(r.cap*100).toFixed(2)+'%':'—')+'<br>'+
        'Loan Amount: '+(Number.isFinite(r.loan)?fmtCurrency(r.loan):'—')+'<br>'+
        'DSCR: '+(Number.isFinite(r.dscr)&&r.annualDebt>0?r.dscr.toFixed(2)+'x':'—');
    }
    investmentModal?.classList.add('open');
    investmentModal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }
  function closeInvestment(){
    investmentModal?.classList.remove('open');
    investmentModal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }
  document.querySelector('.investment-lead-trigger')?.addEventListener('click',openInvestment);
  document.querySelectorAll('[data-investment-close]').forEach(el=>el.addEventListener('click',closeInvestment));

  // Property Value Calculator
  const val={
    noi:$('valuation-noi'), type:$('valuation-type'),
    low:$('valuation-low-cap'), high:$('valuation-high-cap')
  };
  bindMoneyInput(val.noi);

  // Illustrative starting cap-rate assumptions. Users can edit them.
  const capRanges={
    retail:[6.25,7.25],
    industrial:[5.75,6.75],
    office:[7.00,8.50],
    medical:[6.25,7.25],
    multifamily:[5.00,6.25],
    mixed:[6.50,7.50],
    other:[6.50,7.50]
  };
  const propertyLabels={
    retail:'Retail',industrial:'Industrial',office:'Office',medical:'Medical Office',
    multifamily:'Multifamily',mixed:'Mixed Use',other:'Other'
  };

  function clearValuationResults(){
    if($('valuation-range')) $('valuation-range').textContent='—';
    if($('valuation-midpoint')) $('valuation-midpoint').textContent='—';
    if($('valuation-cap-range')) $('valuation-cap-range').textContent='—';
    if($('valuation-cap-note')) $('valuation-cap-note').textContent='Select a property type to apply a starting cap-rate range.';
  }

  function applyPropertyRange(){
    const range=capRanges[val.type?.value];
    if(range){
      val.low.value=range[0].toFixed(2);
      val.high.value=range[1].toFixed(2);
    }
    calculateValuation();
  }

  function calculateValuation(){
    if(!valuationForm) return {};
    const noi=rawNumber(val.noi?.value);
    const type=val.type?.value||'';
    const lowCap=rawNumber(val.low?.value);
    const highCap=rawNumber(val.high?.value);

    if(!(noi>0 && type && lowCap>0 && highCap>0)){
      clearValuationResults();
      return {noi,type,lowCap,highCap};
    }

    const lowRate=Math.min(lowCap,highCap)/100;
    const highRate=Math.max(lowCap,highCap)/100;
    const lowValue=noi/highRate;
    const highValue=noi/lowRate;
    const midpoint=(lowValue+highValue)/2;

    $('valuation-range').textContent=fmtCurrency(lowValue)+' – '+fmtCurrency(highValue);
    $('valuation-midpoint').textContent=fmtCurrency(midpoint);
    $('valuation-cap-range').textContent=(lowRate*100).toFixed(2)+'% – '+(highRate*100).toFixed(2)+'%';
    $('valuation-cap-note').textContent='Based on the cap-rate range shown below. Adjust assumptions if appropriate.';
    return {noi,type,lowCap:lowRate*100,highCap:highRate*100,lowValue,highValue,midpoint};
  }

  val.type?.addEventListener('change',applyPropertyRange);
  [val.low,val.high].forEach(el=>el?.addEventListener('input',calculateValuation));
  $('valuation-reset')?.addEventListener('click',()=>{
    val.noi.value='';
    val.type.value='';
    val.low.value='6.50';
    val.high.value='7.50';
    clearValuationResults();
  });

  const valuationModal=$('valuation-modal');
  function openValuation(){
    const r=calculateValuation();
    const summary=$('valuation-summary');
    if(summary){
      summary.innerHTML=
        '<strong>Property estimate summary</strong><br>'+
        'Property Type: '+(propertyLabels[r.type]||'Not selected')+'<br>'+
        'Annual NOI: '+(r.noi?fmtCurrency(r.noi):'Not entered')+'<br>'+
        'Cap Rate Range: '+(r.lowCap&&r.highCap?r.lowCap.toFixed(2)+'% – '+r.highCap.toFixed(2)+'%':'—')+'<br>'+
        'Estimated Value Range: '+(Number.isFinite(r.lowValue)?fmtCurrency(r.lowValue)+' – '+fmtCurrency(r.highValue):'—');
    }
    valuationModal?.classList.add('open');
    valuationModal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }
  function closeValuation(){
    valuationModal?.classList.remove('open');
    valuationModal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }
  document.querySelector('.valuation-lead-trigger')?.addEventListener('click',openValuation);
  document.querySelectorAll('[data-valuation-close]').forEach(el=>el.addEventListener('click',closeValuation));

  // Modal submission prototypes
  [$('investment-review-form'),$('valuation-review-form')].forEach(formEl=>{
    formEl?.addEventListener('submit',e=>{
      e.preventDefault();
      const btn=e.currentTarget.querySelector('button[type="submit"]');
      if(btn){btn.textContent='Thank you';btn.disabled=true}
    });
  });

  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape') return;
    if(investmentModal?.classList.contains('open')) closeInvestment();
    if(valuationModal?.classList.contains('open')) closeValuation();
  });

  clearInvestmentResults();
  clearValuationResults();
  selectTool('investment');
})();
