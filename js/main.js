// ===== v5.7: CHART TOOLTIP ENGINE =====
const _chartData = {}; // chartId -> {xs:[pixel centers], labels:[], values:[], fmt}
function registerChartHover(chartId){
  const cvs=document.getElementById(chartId);
  if(!cvs || cvs._hoverWired) return;
  cvs._hoverWired=true;
  const tip=document.getElementById('chartTooltip');
  if(!tip) return;

  function findIndex(evt){
    const d=_chartData[chartId]; if(!d||!d.xs||!d.xs.length) return -1;
    const rect=cvs.getBoundingClientRect();
    // CSS scales canvas to width:100% — map clientX back to logical attr coords
    const lx=(evt.clientX-rect.left)*(parseInt(cvs.getAttribute('width'))||400)/rect.width;
    let best=-1,bestD=Infinity;
    d.xs.forEach((x,i)=>{const dist=Math.abs(lx-x); if(dist<bestD){bestD=dist;best=i;}});
    return bestD<=18?best:-1;
  }
  cvs.addEventListener('mousemove',function(evt){
    const d=_chartData[chartId]; if(!d){tip.style.opacity='0';return;}
    const i=findIndex(evt);
    if(i<0){tip.style.opacity='0';return;}
    tip.innerHTML=d.labels[i]+' · <b>'+d.fmt(d.values[i])+'</b>';
    const pad=14;
    let tx=evt.clientX+pad, ty=evt.clientY-pad-30;
    if(tx+170>window.innerWidth) tx=evt.clientX-170-pad;
    tip.style.left=tx+'px'; tip.style.top=ty+'px'; tip.style.opacity='1';
  });
  cvs.addEventListener('mouseleave',function(){ tip.style.opacity='0'; });
  // touch: tap shows tooltip briefly
  cvs.addEventListener('touchstart',function(evt){
    const d=_chartData[chartId]; if(!d)return;
    const t=evt.touches[0]; const i=findIndex(t);
    if(i<0)return;
    tip.innerHTML=d.labels[i]+' · <b>'+d.fmt(d.values[i])+'</b>';
    tip.style.left=Math.min(t.clientX+12, window.innerWidth-180)+'px';
    tip.style.top=(t.clientY-46)+'px';
    tip.style.opacity='1';
    setTimeout(()=>{tip.style.opacity='0';},1800);
  },{passive:true});
}


// ===== GLOSSARY LINK ENGINE =====
const GLOSSARY_TERMS = [
  {re:/\bIDM\b/g, id:'term-idm'},
  {re:/\bInducement\b/gi, id:'term-idm'},
  {re:/\bCHoCH\b/g, id:'term-choch'},
  {re:/\bBOS\b/g, id:'term-bos'},
  {re:/\bSweep\b/g, id:'term-sweep'},
  {re:/\bInside Bar\b/gi, id:'term-insidebar'},
  {re:/\bOutside Bar\b/gi, id:'term-outsidebar'},
  {re:/\bBSL\b/g, id:'term-bslssl'},
  {re:/\bSSL\b/g, id:'term-bslssl'},
  {re:/\bEQH\b/g, id:'term-eqh'},
  {re:/\bEQL\b/g, id:'term-eqh'},
  {re:/\bPDH\b/g, id:'term-pdh'},
  {re:/\bPDL\b/g, id:'term-pdh'},
  {re:/\bPWH\b/g, id:'term-pdh'},
  {re:/\bPWL\b/g, id:'term-pdh'},
  {re:/\bPOI\b/g, id:'term-poi'},
  {re:/\bOrder Block\b/gi, id:'term-ob'},
  {re:/\b\bOB\b/g, id:'term-ob'},
  {re:/\bFVG\b/g, id:'term-fvg'},
  {re:/\bFair Value Gap\b/gi, id:'term-fvg'},
  {re:/\bBreaker Block\b/gi, id:'term-breaker'},
  {re:/\bMitigation Block\b/gi, id:'term-mitigation'},
  {re:/\bRejection Block\b/gi, id:'term-rejection'},
  {re:/\bUnmitigated\b/gi, id:'term-mitigated'},
  {re:/\bMitigated\b/gi, id:'term-mitigated'},
  {re:/\bKill Zone\b/gi, id:'term-killzone'},
  {re:/\bTranche\b/gi, id:'term-tranche'},
  {re:/\bConsistency Rule\b/gi, id:'term-consistency'},
  {re:/\bCorrelated Risk\b/gi, id:'term-correlated'}
];

function goToGlossaryTerm(termId){
  // Navigate to guide page + glossary tab
  const guideNav = document.querySelector('[data-page="guide"]');
  if(guideNav) guideNav.click();
  setTimeout(()=>{
    const glossTab = document.querySelector('[data-gtab="g-glossary"]');
    if(glossTab) glossTab.click();
    setTimeout(()=>{
      const el = document.getElementById(termId);
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.classList.remove('highlight-term');
        void el.offsetWidth;
        el.classList.add('highlight-term');
        setTimeout(()=>el.classList.remove('highlight-term'), 2200);
      }
    }, 80);
  }, 60);
}

function linkGlossaryInNode(root){
  if(!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      if(!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if(!p) return NodeFilter.FILTER_REJECT;
      if(p.closest('.term, .term-name, .glossary-link, .no-glossary, .guide-tab, .nav-item, button, h1, h2, h3, h4, script, style, textarea, input, select, code, pre, .mono')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(textNode=>{
    let html = textNode.nodeValue;
    let changed = false;
    // Longer phrases first to avoid partial matches
    const sorted = GLOSSARY_TERMS.slice().sort((a,b)=> (b.re.source.length - a.re.source.length));
    sorted.forEach(({re, id})=>{
      const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags+'g');
      if(r.test(html)){
        html = html.replace(r, (m)=>`<span class="glossary-link" data-term="${id}" title="${currentLang()==='en'?'View in glossary':'مشاهده در واژه‌نامه'}">${m}</span>`);
        changed = true;
      }
    });
    if(changed){
      const span = document.createElement('span');
      span.innerHTML = html;
      textNode.parentNode.replaceChild(span, textNode);
    }
  });
}

function initGlossaryLinks(){
  // Link terms inside the entire guide page
  const guidePage = document.getElementById('page-guide');
  if(guidePage) linkGlossaryInNode(guidePage);
  // Also dashboard pre-trade area
  const preBox = document.getElementById('body-pre');
  if(preBox) linkGlossaryInNode(preBox);
  // Click handler (event delegation)
  document.body.addEventListener('click', e=>{
    const link = e.target.closest('.glossary-link');
    if(!link) return;
    e.preventDefault();
    const id = link.getAttribute('data-term');
    if(id) goToGlossaryTerm(id);
  });
}
// Keep glossary-link tooltips in the active language (called on language switch)
function updateGlossaryLinkTitles(){
  const txt = currentLang()==='en' ? 'View in glossary' : 'مشاهده در واژه‌نامه';
  document.querySelectorAll('.glossary-link[data-term]').forEach(el=>{ el.title = txt; });
}

// ===== INIT =====
// ===== THE MODEL ENGINE (v5.5) =====
const THE_MODEL = {
  corePrinciple: "Run the level. Fail to hold. Reverse.",
  goldenRule: "No sweep, no trade.",
  
  timeframeMatrix: {
    swing:       { htf: "Weekly",   ltf: "4H",     session: null },
    shortTerm:   { htf: "Daily",    ltf: "1H",     session: null },
    dayTrading:  { htf: "4H / 1H",  ltf: "15M / 5M", session: "London/NY" },
    scalping:    { htf: "1H / 15M", ltf: "5M / 1M",  session: "Asia/London/NY" }
  },
  
  levelMapping: {
    swing:      { primary: ["PWH", "PWL"],        secondary: "Intra-week H/L" },
    shortTerm:  { primary: ["PDH", "PDL"],        secondary: "Intra-day H/L" },
    dayTrading: { primary: ["PDH", "PDL"],        secondary: "Intra-day H/L" },
    scalping:   { primary: ["Session High/Low"],  secondary: "Intra-session H/L" }
  },
  
  marketCondition: {
    trendingUp:   { structure: "HH/HL", allowed: "LONG",  sweepTarget: "Low",  color: "var(--green)" },
    trendingDown: { structure: "LH/LL", allowed: "SHORT", sweepTarget: "High", color: "var(--red)" },
    ranging:      { structure: "Equal H/L", allowed: "BOTH", sweepTarget: "Edges", color: "var(--amber)" }
  },
  
  exitStrategies: {
    timeBased:    { label: "Time-based (Lunch/Session End)",    icon: "⏰", color: "var(--purple)" },
    liquidityBased:{ label: "Liquidity-based (PDH/PDL/Session)", icon: "🎯", color: "var(--amber)" }
  },
  
  killZones: { // v5.8: ساعت‌ها به وقت محلیِ هر شهر — منبع واحد حقیقت برای بنر و راهنما
    london:  { start: 8, end: 12,  city: 'Europe/London',   label: "London Open / Judas Sweep", color: "var(--amber)" },
    ny:      { start: 7, end: 11,  city: 'America/New_York', label: "NY Open / Power of 3",      color: "var(--purple)" },
    overlap: { start: 7, end: 9.5, city: 'America/New_York', label: "London-NY Overlap",         color: "var(--red)" }
  }
};

// Helper: get active trade style from settings or default
function getActiveTradeStyle() {
  return (settings && settings.tradeStyle) || 'dayTrading';
}

// Render the Model checklist in dashboard pre-trade area
// توضیح کوتاه و پویا زیر عنوان هر مرحله — بر اساس سبک معامله‌گری انتخاب‌شده (نه یک متن ثابت)
function getStageHint(stageKey) {
  const style = getActiveTradeStyle();
  const tf = THE_MODEL.timeframeMatrix[style];
  const levels = THE_MODEL.levelMapping[style];
  const en = currentLang()==='en';
  switch (stageKey) {
    case 'bias':
      return `HTF: ${tf.htf} → ${THE_MODEL.marketCondition.trendingUp.structure} / ${THE_MODEL.marketCondition.trendingDown.structure} / ${THE_MODEL.marketCondition.ranging.structure}`;
    case 'levels':
      return en
        ? `Primary: ${levels.primary.join(' / ')} — Secondary: ${levels.secondary}`
        : `سطوح اصلی: ${levels.primary.join(' / ')} — سطوح فرعی: ${levels.secondary}`;
    case 'confirm':
      return en
        ? `LTF: ${tf.ltf} — CHoCH + valid POI (OB/FVG/Breaker)`
        : `LTF: ${tf.ltf} — CHoCH + POI معتبر (OB/FVG/Breaker)`;
    default:
      return '';
  }
}

// نوار پیشرفت کوچک در سایدبار — بر اساس همون ۷ مرحله‌ی چک‌لیست یکپارچه
function updateModelStatusBar() {
  const bar = document.getElementById('modelProgressFill');
  const stepsMini = document.getElementById('modelStepsMini');
  if (!bar || !stepsMini) return;
  const today = localDateStr();
  const checks = preChecks[today] || {};
  const total = PRE_STAGES.length;
  const done = PRE_STAGES.filter(s => isPreStageComplete(s.key, checks)).length;
  bar.style.width = `${(done/total)*100}%`;
  stepsMini.innerHTML = PRE_STAGES.map((s,i)=>`<span class="${isPreStageComplete(s.key,checks)?'done':''}">${i+1}</span>`).join('');
}

// Render SVG templates into every guide root (EN + FA both carry render slots)
function renderModelGuideTemplates() {
  const map = { sweep: 'tpl-svg-sweep', market: 'tpl-svg-market', tfmatrix: 'tpl-svg-tfmatrix', exits: 'tpl-svg-exits' };
  Object.entries(map).forEach(([name, tplId]) => {
    const tpl = document.getElementById(tplId);
    if (!tpl) return;
    document.querySelectorAll(`.render-slot[data-render="${name}"]`).forEach(slot => {
      slot.innerHTML = tpl.innerHTML;
    });
  });
}

// Call on init
document.addEventListener('DOMContentLoaded', () => {
  // PWA: offline support (skip on file:// — SW requires http(s))
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW registration failed:', err));
  }
  updateModelStatusBar();
  renderModelGuideTemplates();
  renderKillZoneBanner();
  setInterval(renderKillZoneBanner, 60000); // refresh every min
  loadSessionPlan();          // v5.8
  document.querySelectorAll('input[name="nt-dir"]').forEach(r=>{ r.addEventListener('change', renderBiasConflictWarn); }); // v5.8
  setTimeout(initGlossaryLinks, 120); // after templates render
});

function onTradeStyleChange(val) {
  if (!settings) settings = {};
  settings.tradeStyle = val;
  saveSettings();
  const badge = document.getElementById('trade-style-badge');
  if (badge) badge.innerText = `Style: ${val.toUpperCase()}`;
  renderPreChecklist(); // hint متن مراحل بایاس/سطوح/تأیید به سبک جدید آپدیت می‌شه

  // Auto-fill liquidity type based on style
  const liqSel = document.getElementById('nt-liquidity');
  if (liqSel) {
    if (val === 'swing') liqSel.value = 'PWH/PWL Sweep';
    else if (val === 'scalping') liqSel.value = 'سقف/کف سشن';
    else liqSel.value = 'PDH/PDL Sweep';
  }
  toast(currentLang()==='en'?`⚙️ Trade style changed to ${val.toUpperCase()} (levels & timeframes updated)`:`⚙️ سبک ترید به ${val.toUpperCase()} تغییر کرد ( سطوح و تایم‌فریم آپدیت شد )`);
}

// فیلد «استراتژی خروج» بخشی از فرم اصلیه؛ فقط لازمه با تغییرش، وضعیت قفل مرحله‌ی «خروج و ریسک» در چک‌لیست به‌روز بشه
function onExitTypeChange(val) {
  renderPreChecklist();
  updateDashboard();
  const noteInput = document.getElementById('nt-note');
  if (noteInput && val) {
    const label = val === 'timeBased' ? '[Exit: Time-based / Lunch]' : '[Exit: Liquidity-based / PDH-PDL]';
    if (!noteInput.value.includes(label)) {
      noteInput.value = (noteInput.value + ' ' + label).trim();
    }
  }
}

// v5.6: ساعت محلی هر شهر با IANA timezone — DST لندن/نیویورک خودکار رعایت می‌شود
// (روش قبلی: بازه‌ی GMT ثابت که یک ساعت با جدول روتین اختلاف داشت و DST را نادیده می‌گرفت)
function getCityHour(d, tz){
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone: tz, hour:'2-digit', minute:'2-digit', hour12:false}).formatToParts(d);
  const h = parseInt(parts.find(p=>p.type==='hour').value, 10);
  const m = parseInt(parts.find(p=>p.type==='minute').value, 10);
  return h + m/60;
}
function isWeekendNY(d){
  // بازار نیویورک شنبه/یکشنبه تعطیل است (به وقت نیویورک)
  const wd = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York', weekday:'short'}).format(d);
  return wd==='Sat' || wd==='Sun';
}
// Kill Zone detection & warning banner
function renderKillZoneBanner() {
  const banner = document.getElementById('killzone-banner');
  if (!banner) return;
  
  const now = new Date();
  const londonTime = getCityHour(now, 'Europe/London');
  const nyTime     = getCityHour(now, 'America/New_York');
  const tehranTime = getTehranHour(now);
  
  let active = null;
  let statusColor = '';
  let statusText  = '';
  
  const en = currentLang()==='en';
  if (isWeekendNY(now)) {
    statusColor = 'var(--text-faint)';
    statusText = en
      ? `🏖️ Market weekend — New York is closed (${formatHourMin(tehranTime)} Tehran)`
      : `🏖️ آخر هفته‌ی بازار — نیویورک تعطیل است (${formatHourMin(tehranTime)} تهران)`;
  } else if (londonTime >= THE_MODEL.killZones.london.start && londonTime < THE_MODEL.killZones.london.end) {
    active = THE_MODEL.killZones.london;
    statusColor = 'var(--amber)';
    statusText = en
      ? `🔥 LONDON KILL ZONE active — London ${formatHourMin(londonTime)} · Tehran ${formatHourMin(tehranTime)}`
      : `🔥 LONDON KILL ZONE فعال — لندن ${formatHourMin(londonTime)} · تهران ${formatHourMin(tehranTime)}`;
  } else if (nyTime >= THE_MODEL.killZones.ny.start && nyTime < THE_MODEL.killZones.ny.end) {
    active = (nyTime < THE_MODEL.killZones.overlap.end) ? THE_MODEL.killZones.overlap : THE_MODEL.killZones.ny;
    statusColor = (active===THE_MODEL.killZones.overlap) ? 'var(--red)' : 'var(--purple)';
    const tag = (active===THE_MODEL.killZones.overlap) ? 'OVERLAP' : 'NY OPEN';
    statusText = en
      ? `⚡ ${tag} active — New York ${formatHourMin(nyTime)} · Tehran ${formatHourMin(tehranTime)}`
      : `⚡ ${tag} فعال — نیویورک ${formatHourMin(nyTime)} · تهران ${formatHourMin(tehranTime)}`;
  } else if (londonTime >= THE_MODEL.killZones.london.end && nyTime < THE_MODEL.killZones.ny.start) {
    statusColor = 'var(--cyan)';
    statusText = en
      ? `⏸️ Window between London and New York — London ${formatHourMin(londonTime)} · Tehran ${formatHourMin(tehranTime)}`
      : `⏸️ پنجره بین لندن و نیویورک — لندن ${formatHourMin(londonTime)} · تهران ${formatHourMin(tehranTime)}`;
  } else {
    statusColor = 'var(--text-faint)';
    statusText = en
      ? `😴 Outside Kill Zone — Tehran ${formatHourMin(tehranTime)}`
      : `😴 خارج از Kill Zone — تهران ${formatHourMin(tehranTime)}`;
  }
  
  if (active) {
    banner.style.display = 'block';
    // v5.6: fallback rgba برای Safari <16.2 که color-mix ندارد — سپس color-mix اگر پشتیبانی شود override می‌کند
    const kzTintMap = {'var(--amber)': ['rgba(240,136,62,0.15)','rgba(240,136,62,0.4)'], 'var(--red)': ['rgba(248,81,73,0.15)','rgba(248,81,73,0.4)'], 'var(--green)': ['rgba(63,185,80,0.15)','rgba(63,185,80,0.4)'], 'var(--cyan)': ['rgba(57,208,216,0.15)','rgba(57,208,216,0.4)'], 'var(--purple)': ['rgba(163,113,247,0.15)','rgba(163,113,247,0.4)']};
    const kzTint = kzTintMap[statusColor] || ['rgba(139,148,158,0.15)','rgba(139,148,158,0.4)'];
    banner.style.background = kzTint[0];
    banner.style.border = `1px solid ${kzTint[1]}`;
    try { banner.style.background = `color-mix(in srgb, ${statusColor} 15%, var(--panel-2))`; banner.style.border = `1px solid color-mix(in srgb, ${statusColor} 40%, transparent)`; } catch(e){}
    banner.style.color = statusColor;
    banner.innerHTML = `<strong>${statusText}</strong><br><span style="font-size:.76rem;color:var(--text-dim);">${en ? 'Signals are only valid inside these windows — be careful outside Kill Zones.' : 'سیگنال‌ها فقط در این بازه‌ها معتبرند — خارج از KZ احتیاط کن.'}</span>`;
  } else {
    banner.style.display = 'block';
    banner.style.background = 'var(--panel-2)';
    banner.style.border = '1px solid var(--line)';
    banner.style.color = 'var(--text-faint)';
    banner.innerHTML = `${statusText}`;
  }
}

// ===== END THE MODEL ENGINE =====
loadAll();
applyTheme();
showContractIfNeeded();
autoBackupCheck();
populatePairDropdown();
resumeForcedStopIfNeeded(); // v5.6: احیای تایمر توقف اجباری بعد از رفرش
['chartPnL','chartWinLoss','chartDayOfWeek','chartPair','chartSession','chartSetup','chartRMultiple'].forEach(registerChartHover); // v5.7

const todayChecks=dailyChecks[localDateStr()]||{};
updateDashboard();
renderTodayTrades();
renderJournalHistory();
drawPerformancePage();

// v6.0: multi-device UI init
(function initMultiDeviceUI(){
  try{
    const devEl = document.getElementById('settingsDeviceInfo');
    if(devEl) devEl.textContent = 'Device ID: ' + DEVICE_ID + '  ·  Schema v' + DATA_SCHEMA_VERSION;
    const storEl = document.getElementById('storageUsageLabel');
    if(storEl) storEl.textContent = (currentLang()==='en'?'Storage: ':'حافظه: ') + formatBytes(estimateStorageUsage());
    // refresh storage label periodically
    setInterval(()=>{
      const el = document.getElementById('storageUsageLabel');
      if(el) el.textContent = (currentLang()==='en'?'Storage: ':'حافظه: ') + formatBytes(estimateStorageUsage());
    }, 30000);
  }catch(e){}
})();

// v6.1: draft + compact · v6.2: i18n + language gate
(function initUXPhase2(){
  try{
    applyCompactModeOnLoad();
    wireTradeDraftAutosave();
    if(!settings.langChosen){
      showLangGateIfNeeded();
    } else {
      applyLanguage(settings.lang || 'fa');
    }
    setTimeout(()=>{ loadTradeDraft(); }, 300);
  }catch(e){ console.error(e); }
})();

// Modal close on backdrop
document.getElementById('resultModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeResultModal()});
document.getElementById('contractModal').addEventListener('click',e=>{if(e.target===e.currentTarget)acceptContract()});
const restoreModalEl = document.getElementById('restoreModal');
if(restoreModalEl) restoreModalEl.addEventListener('click',e=>{if(e.target===e.currentTarget)closeRestoreModal()});
