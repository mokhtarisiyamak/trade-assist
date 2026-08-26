// ===== SECURITY: escape user-provided text before inserting into innerHTML =====
function escapeHTML(str){
  if(str===null || str===undefined) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ساعت واقعی تهران — با Intl.DateTimeFormat و IANA timezone، نه محاسبه‌ی دستی آفست.
// این روش همیشه درسته چون به دیتابیس تایم‌زون مرورگر تکیه می‌کنه، نه یک عدد ثابت که ممکنه اشتباه/قدیمی باشه.
function getTehranHour(d){
  d = d || new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Tehran', hour:'2-digit', minute:'2-digit', hour12:false}).formatToParts(d);
  const h = parseInt(parts.find(p=>p.type==='hour').value, 10);
  const m = parseInt(parts.find(p=>p.type==='minute').value, 10);
  return h + m/60;
}
function formatHourMin(t){
  const h = Math.floor(t % 24);
  const m = Math.floor((t % 1) * 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// Trade DNA — auto time-of-day zone (بر اساس ساعت واقعی تهران)
// v7: zones are stored as language-neutral keys; legacy Persian labels are
// mapped on read so old data keeps grouping correctly.
const ZONE_KEYS = { asia:'asia', preLondon:'preLondon', london:'london', preNY:'preNY', ny:'ny' };
const ZONE_LABELS = {
  asia:      {fa:'آسیا',         en:'Asia'},
  preLondon: {fa:'قبل از لندن',  en:'Pre-London'},
  london:    {fa:'لندن',         en:'London'},
  preNY:     {fa:'قبل از نیویورک', en:'Pre-New York'},
  ny:        {fa:'نیویورک',      en:'New York'}
};
const ZONE_LEGACY_FA = {'آسیا':'asia','قبل از لندن':'preLondon','لندن':'london','قبل از نیویورک':'preNY','نیویورک':'ny'};
function getTimeOfDayZone(d){
  const h = getTehranHour(d);
  if(h>=0 && h<6.5) return ZONE_KEYS.asia;
  if(h>=6.5 && h<8.5) return ZONE_KEYS.preLondon;
  if(h>=8.5 && h<12.5) return ZONE_KEYS.london;
  if(h>=12.5 && h<15.5) return ZONE_KEYS.preNY;
  return ZONE_KEYS.ny;
}
function zoneKey(v){ return ZONE_LEGACY_FA[v] || (ZONE_LABELS[v] ? v : null); }
function zoneLabel(v){
  const k = zoneKey(v);
  if(!k) return v || '';
  const z = ZONE_LABELS[k];
  return currentLang()==='en' ? z.en : z.fa;
}

function loadAll(){
  try{
    const t=localStorage.getItem(STORAGE.trades); if(t) trades=JSON.parse(t);
    const j=localStorage.getItem(STORAGE.journal); if(j) journals=JSON.parse(j);
    const c=localStorage.getItem(STORAGE.dailyChecks); if(c) dailyChecks=JSON.parse(c);
    const pc=localStorage.getItem(STORAGE.preChecks); if(pc) preChecks=JSON.parse(pc);
    const s=localStorage.getItem(STORAGE.scores); if(s) scoresCache=JSON.parse(s);
    const set=localStorage.getItem(STORAGE.settings); if(set) settings=JSON.parse(set); else initSettings();
    if(settings.startingBalance===undefined) settings.startingBalance=10000;
    if(settings.consistencyCapPercent===undefined) settings.consistencyCapPercent=30;
    if(settings.dailyLossCapPercent===undefined) settings.dailyLossCapPercent=2;
    if(settings.lang!=='en' && settings.lang!=='fa') settings.lang='fa';
    if(settings.langChosen===undefined) settings.langChosen=false;
    if(!settings.watchlist) settings.watchlist=JSON.parse(JSON.stringify(DEFAULT_WATCHLIST));
    if(!settings.trash) settings.trash=[];
    const w=localStorage.getItem(STORAGE.weekly); if(w) weeklyReviews=JSON.parse(w);
    migratePreItemStages();
    migrateRemoveDuplicateDailyItems();
    migrateItemTextEn();
  }catch(e){console.error(e); initSettings();}
}
// نسخه‌های قبل از این آپدیت preItems بدون فیلد «stage» ذخیره شده‌اند؛ بدون این فیلد آیتم در هیچ مرحله‌ای
// از چک‌لیست پلکانی نمایش داده نمی‌شود. این تابع یک‌بار، بی‌صدا، مقدار مناسب را برای هر آیتم قدیمی پر می‌کند.
function migratePreItemStages(){
  const knownStage=Object.fromEntries(DEFAULT_PRE.map(i=>[i.id,i.stage]));
  const fallbackByCat={mental:'mental',tech:'sweep',risk:'risk',learning:'final'};
  let changed=false;
  (settings.preItems||[]).forEach(i=>{
    if(!i.stage || !PRE_STAGES.some(s=>s.key===i.stage)){
      i.stage = knownStage[i.id] || fallbackByCat[i.cat] || 'final';
      changed=true;
    }
  });
  if(changed) saveSettings();
}
// dt1 (بایاس Daily) و dt3 (مرزهای آسیا) با مراحل «بایاس» و «سطوح کلیدی» در چک‌لیست قبل از ورود هم‌پوشانی
// داشتند و از پیش‌فرض حذف شدند؛ این تابع همان دو آیتم را از داده‌ی قبلاً ذخیره‌شده‌ی کاربر هم پاک می‌کند.
function migrateRemoveDuplicateDailyItems(){
  const removedIds=['dt1','dt3'];
  const before=(settings.dailyItems||[]).length;
  settings.dailyItems=(settings.dailyItems||[]).filter(i=>!removedIds.includes(i.id));
  if(settings.dailyItems.length!==before) saveSettings();
}
// v6.2: attach English text for known default checklist items
function migrateItemTextEn(){
  const mapD = Object.fromEntries(DEFAULT_DAILY.map(i=>[i.id,i.textEn]));
  const mapP = Object.fromEntries(DEFAULT_PRE.map(i=>[i.id,i.textEn]));
  let changed=false;
  (settings.dailyItems||[]).forEach(i=>{
    if(!i.textEn && mapD[i.id]){ i.textEn=mapD[i.id]; changed=true; }
  });
  (settings.preItems||[]).forEach(i=>{
    if(!i.textEn && mapP[i.id]){ i.textEn=mapP[i.id]; changed=true; }
  });
  if(changed) saveSettings();
}
function initSettings(){
  settings = {
    contract:{fa:'من متعهد می‌شوم که اگر ۲ استاپ بخورم، امروز کامپیوتر را خاموش می‌کنم. من فقط ستاپ A+ می‌گیرم و زیر ۲:۱ وارد نمی‌شوم.',en:'I commit that if I take 2 stops, I shut the computer down for today. I only take A+ setups and do not enter below 2:1.'},
    contractAccepted:false,
    dailyItems:JSON.parse(JSON.stringify(DEFAULT_DAILY)),
    preItems:JSON.parse(JSON.stringify(DEFAULT_PRE)),
    routinePhases:JSON.parse(JSON.stringify(DEFAULT_ROUTINE)),
    theme:'dark',
    lang:'fa',
    langChosen:false,
    startingBalance:10000,
    consistencyCapPercent:30,
    dailyLossCapPercent:2,
    watchlist:JSON.parse(JSON.stringify(DEFAULT_WATCHLIST)),
    trash:[]
  };
  saveSettings();
}
// v5.6 + v6.0: مدیریت خطای پر شدن localStorage (کوتای ~5MB)
let _storageWarned=false;
function handleStorageError(err){
  console.error('localStorage error:', err);
  if(!_storageWarned){
    _storageWarned=true;
    try{
      const used = typeof estimateStorageUsage==='function' ? formatBytes(estimateStorageUsage()) : '?';
      toast('⚠️ حافظه‌ی مرورگر پر است ('+used+') — فوراً پشتیبان بگیر','error');
    }catch(e){}
  }
}
function saveTrades(){try{localStorage.setItem(STORAGE.trades,JSON.stringify(trades))}catch(e){handleStorageError(e)}}
function saveJournals(){try{localStorage.setItem(STORAGE.journal,JSON.stringify(journals))}catch(e){handleStorageError(e)}}
function saveDailyChecks(){try{localStorage.setItem(STORAGE.dailyChecks,JSON.stringify(dailyChecks))}catch(e){handleStorageError(e)}}
function savePreChecks(){try{localStorage.setItem(STORAGE.preChecks,JSON.stringify(preChecks))}catch(e){handleStorageError(e)}}
function saveScores(){try{localStorage.setItem(STORAGE.scores,JSON.stringify(scoresCache))}catch(e){handleStorageError(e)}}
function saveSettings(){try{localStorage.setItem(STORAGE.settings,JSON.stringify(settings))}catch(e){handleStorageError(e)}}
function saveWeekly(){try{localStorage.setItem(STORAGE.weekly,JSON.stringify(weeklyReviews))}catch(e){handleStorageError(e)}}

