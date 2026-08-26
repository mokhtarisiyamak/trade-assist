// ===== THEME =====
function applyTheme(){
  document.documentElement.setAttribute('data-theme', settings.theme||'dark');
  document.getElementById('themeBtn').textContent = (settings.theme==='light') ? '☀️' : '🌙';
}
function toggleTheme(){
  settings.theme = (settings.theme==='light') ? 'dark' : 'light';
  saveSettings();
  applyTheme();
}

// ===== NAVIGATION =====
const navItems=document.querySelectorAll('.nav-item');
const pages=document.querySelectorAll('.page');
navItems.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const page=btn.dataset.page;
    navItems.forEach(n=>n.classList.remove('active'));
    btn.classList.add('active');
    pages.forEach(p=>p.classList.remove('active'));
    document.getElementById('page-'+page).classList.add('active');
    toggleSidebar(false); // v5.6.1: منو + بک‌دراپ بسته شود
    if(page==='dashboard'){ updateDashboard(); renderTodayTrades(); renderJournalHistory(); loadSessionPlan(); }
    if(page==='settings'){
      const capInp=document.getElementById('daily-loss-cap-input');
      if(capInp) capInp.value=settings.dailyLossCapPercent||2;
    }
    if(page==='guide'){ if(document.getElementById('quiz-container') && !document.getElementById('quiz-container').innerHTML) renderQuiz(); }
    if(page==='history'){ showSkeleton('history-table-body'); requestAnimationFrame(renderHistory); }
    if(page==='performance'){
      ['chartRadar','chartPnL','chartWinLoss','chartRMultiple'].forEach(id=>{
        const cv=document.getElementById(id);
        if(cv) cv.style.opacity='0';
      });
      requestAnimationFrame(()=>{
        drawPerformancePage();
        ['chartRadar','chartPnL','chartWinLoss','chartRMultiple'].forEach(id=>{
          const cv=document.getElementById(id);
          if(cv){ cv.style.transition='opacity .4s var(--ease-out)'; cv.style.opacity='1'; }
        });
      });
    }
    if(page==='weekly') initWeeklyPage();
    if(page==='routine') renderRoutinePage();
    if(page==='watchlist') renderWatchlistPage();
    if(page==='settings') renderSettings();
  });
});
// v5.6.1: منوی موبایل — باز/بسته + بک‌دراپ + بستن خودکار بعد از انتخاب صفحه یا ESC
// v5.6.3: قفل اسکرول بدنه هنگام باز بودن منو — رفع باگ WebView اندروید که در صفحات
// بلند (داشبورد) بک‌دراپ و موقعیت منو را خراب می‌کند
let _scrollLockY=0;
function toggleSidebar(force){
  const sb=document.getElementById('sidebar');
  const ov=document.getElementById('navOverlay');
  const open = force!==undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  if(ov) ov.classList.toggle('show', open);
  const bd=document.body;
  if(open){
    _scrollLockY=window.scrollY||0;
    bd.style.top=(-_scrollLockY)+'px';
    bd.classList.add('menu-open');
  } else {
    bd.classList.remove('menu-open');
    bd.style.top='';
    window.scrollTo(0,_scrollLockY);
  }
}
document.addEventListener('click',function(e){
  // فقط وقتی کلیک مستقیم روی بک‌دراپ است (نه داخل منو)
  if(e.target.id==='navOverlay') toggleSidebar(false);
});
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  // close topmost overlay: modal > language gate > sidebar
  const modal=document.querySelector('.modal-overlay.active');
  if(modal){
    if(modal.id==='contractModal') return; // contract must be accepted explicitly
    if(modal.id==='restoreModal'){ closeRestoreModal(); return; }
    if(modal.id==='resultModal'){ closeResultModal(); return; }
    if(modal.id==='editItemModal'){ closeEditItemModal(); return; }
    if(modal.id==='routineEditModal'){ closeRoutineEdit(); return; }
    modal.classList.remove('active');
    return;
  }
  toggleSidebar(false);
});

// v5.7: اسکلتون لودینگ — قبل از رندر سنگین، چند ردیف شیمر نشان می‌دهد و در فریم بعدی محتوای واقعی می‌نشیند
function showSkeleton(containerId){
  const c=document.getElementById(containerId);
  if(!c) return;
  c.innerHTML='<div class="skeleton skeleton-row"></div>'.repeat(4);
}
// ===== GUIDE TABS =====
// v7.1: two language roots share same panel IDs (g-model etc.) — duplicate IDs are invalid
// and getElementById would always return the EN panel first. Handle both languages together.
document.querySelectorAll('.guide-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const gtab=tab.dataset.gtab;
    document.querySelectorAll('.guide-tab').forEach(t=>t.classList.toggle('active', t.dataset.gtab===gtab));
    document.querySelectorAll('.guide-panel').forEach(p=>p.classList.toggle('active', p.id===gtab));
  });
});
// لینک مستقیم از یک مرحله‌ی چک‌لیست به تب مرتبط در راهنما (برای دکمه‌ی «؟» هر مرحله)
// v5.6: optional chaining حذف شد — روی Safari <13.1 کل اسکریپت را می‌کشد (صفحه سفید)
// v7.1: language-aware — activate both language panels, scroll the visible one
function goToGuide(gtab){
  const nav=document.querySelector('.nav-item[data-page="guide"]');
  if(nav) nav.click();
  document.querySelectorAll('.guide-tab').forEach(t=>t.classList.toggle('active', t.dataset.gtab===gtab));
  document.querySelectorAll('.guide-panel').forEach(p=>p.classList.toggle('active', p.id===gtab));
  const visibleTab = document.querySelector(`#guide${currentLang()==='en'?'En':'Fa'}Root .guide-tab[data-gtab="${gtab}"]`) || document.querySelector(`.guide-tab[data-gtab="${gtab}"]`);
  if(visibleTab) visibleTab.scrollIntoView({behavior:'smooth',inline:'center'});
}

// ===== COLLAPSE =====
function toggleCollapse(id){
  const btn=document.getElementById('toggle'+id.charAt(0).toUpperCase()+id.slice(1));
  const body=document.getElementById('body-'+id);
  if(btn){btn.classList.toggle('open'); body.classList.toggle('open');}
}

// ===== TOAST =====
function toast(msg,type='success'){
  const c=document.getElementById('toastContainer');
  const el=document.createElement('div');
  el.className='toast toast-'+type;
  el.textContent=msg;
  c.appendChild(el);
  setTimeout(()=>el.remove(),3000);
}

