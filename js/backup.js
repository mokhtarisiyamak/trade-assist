// ===== BACKUP / EXPORT / MULTI-DEVICE (v6.0) =====
function estimateStorageUsage(){
  let total = 0;
  try{
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k && k.startsWith('tbc_v4_')) total += (localStorage.getItem(k)||'').length * 2; // UTF-16 approx
    }
  }catch(e){}
  return total; // bytes approx
}
function formatBytes(b){
  if(b < 1024) return b + ' B';
  if(b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
  return (b/(1024*1024)).toFixed(2) + ' MB';
}
function checkStorageHealth(){
  const used = estimateStorageUsage();
  const softLimit = 4.2 * 1024 * 1024; // ~4.2MB warning (localStorage often ~5MB)
  if(used > softLimit){
    toast(currentLang()==='en'?'⚠️ Browser storage is almost full ('+formatBytes(used)+') — back up now':'⚠️ حافظه مرورگر نزدیک پر شدن است ('+formatBytes(used)+') — فوراً پشتیبان بگیر','error');
    return false;
  }
  return true;
}

function buildBackupObject(){
  return {
    schemaVersion: DATA_SCHEMA_VERSION,
    appVersion: '7.0',
    exportedAt: new Date().toISOString(),
    deviceId: DEVICE_ID,
    stats: {
      trades: trades.length,
      journals: journals.length,
      weeklyReviews: weeklyReviews.length
    },
    trades, journals, dailyChecks, preChecks, scoresCache, settings, weeklyReviews
  };
}

function downloadBackup(){
  checkStorageHealth();
  const backup = buildBackupObject();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trade-assist-v7.0-' + localDateStr() + '-' + DEVICE_ID.slice(-6) + '.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  try{ localStorage.setItem(STORAGE.backup, localDateStr()); }catch(e){}
  toast(currentLang()==='en'?'✅ Full backup downloaded (Schema v'+DATA_SCHEMA_VERSION+')':'✅ پشتیبان کامل دانلود شد (Schema v'+DATA_SCHEMA_VERSION+')');
}

// --- Smart Merge (v6.0 improved) ---
function mergeBackupData(data, options={}){
  const preferIncoming = !!options.preferIncoming;
  const idMap = (arr) => { const m={}; (arr||[]).forEach(x=>{ if(x && x.id) m[x.id]=x; }); return m; };

  let addedTrades=0, updatedTrades=0, addedJournals=0, addedWeekly=0;

  // Trades: add new; on conflict keep newer by closedAt/updatedAt/date or preferIncoming
  const tm = idMap(trades);
  (data.trades||[]).forEach(t=>{
    if(!t || !t.id) return;
    if(!tm[t.id]){
      trades.push(t);
      addedTrades++;
    } else if(preferIncoming){
      const idx = trades.findIndex(x=>x.id===t.id);
      if(idx>=0){ trades[idx] = t; updatedTrades++; }
    } else {
      // keep local unless incoming looks newer
      const local = tm[t.id];
      const localTs = new Date(local.closedAt || local.updatedAt || local.date || 0).getTime();
      const incTs  = new Date(t.closedAt || t.updatedAt || t.date || 0).getTime();
      if(incTs > localTs){
        const idx = trades.findIndex(x=>x.id===t.id);
        if(idx>=0){ trades[idx] = t; updatedTrades++; }
      }
    }
  });

  // Journals
  const jm = idMap(journals);
  (data.journals||[]).forEach(j=>{
    if(j && j.id && !jm[j.id]){ journals.push(j); addedJournals++; }
  });

  // Weekly reviews
  const wm = idMap(weeklyReviews);
  (data.weeklyReviews||[]).forEach(w=>{
    if(w && w.id && !wm[w.id]){ weeklyReviews.push(w); addedWeekly++; }
  });

  // Daily / Pre checks — deep merge by date
  Object.entries(data.dailyChecks||{}).forEach(([d,v])=>{
    dailyChecks[d] = Object.assign({}, dailyChecks[d]||{}, v);
  });
  Object.entries(data.preChecks||{}).forEach(([d,v])=>{
    preChecks[d] = Object.assign({}, preChecks[d]||{}, v);
  });

  // Scores cache
  if(data.scoresCache){
    scoresCache = Object.assign({}, scoresCache, data.scoresCache);
  }

  // Settings — merge carefully (never wipe local contractAccepted etc. unless replace)
  if(data.settings){
    const keepLocal = ['contractAccepted'];
    const incoming = Object.assign({}, data.settings);
    keepLocal.forEach(k=>{ if(settings[k]!==undefined) incoming[k]=settings[k]; });
    settings = Object.assign({}, settings, incoming);
    if(settings.startingBalance===undefined) settings.startingBalance=10000;
    if(settings.consistencyCapPercent===undefined) settings.consistencyCapPercent=30;
    if(settings.dailyLossCapPercent===undefined) settings.dailyLossCapPercent=2;
    if(!settings.watchlist) settings.watchlist=JSON.parse(JSON.stringify(DEFAULT_WATCHLIST));
    if(!settings.trash) settings.trash=[];
  }

  persistAll();
  refreshAllUI();
  return {addedTrades, updatedTrades, addedJournals, addedWeekly};
}

function persistAll(){
  saveTrades(); saveJournals(); saveDailyChecks(); savePreChecks();
  saveScores(); saveSettings(); saveWeekly();
}
function refreshAllUI(){
  try{
    applyTheme();
    updateDashboard();
    renderTodayTrades();
    renderJournalHistory();
    renderHistory();
    drawPerformancePage();
    if(typeof renderWatchlistPage==='function') renderWatchlistPage();
    if(typeof renderWatchlistSettings==='function') renderWatchlistSettings();
    if(typeof renderSettings==='function') renderSettings();
    if(typeof renderDailyChecklist==='function') renderDailyChecklist();
  }catch(e){ console.error(e); }
}

// Preview differences for the restore modal
function analyzeBackupDiff(data){
  const idSet = (arr) => new Set((arr||[]).filter(x=>x&&x.id).map(x=>x.id));
  const localTradeIds = idSet(trades);
  const fileTradeIds  = idSet(data.trades);
  let newTrades=0, overlapTrades=0;
  fileTradeIds.forEach(id=>{ if(localTradeIds.has(id)) overlapTrades++; else newTrades++; });

  const localJournalIds = idSet(journals);
  let newJournals=0;
  (data.journals||[]).forEach(j=>{ if(j&&j.id && !localJournalIds.has(j.id)) newJournals++; });

  const localWeeklyIds = idSet(weeklyReviews);
  let newWeekly=0;
  (data.weeklyReviews||[]).forEach(w=>{ if(w&&w.id && !localWeeklyIds.has(w.id)) newWeekly++; });

  return {
    schemaVersion: data.schemaVersion || 1,
    appVersion: data.appVersion || '?',
    deviceId: data.deviceId || 'unknown',
    exportedAt: data.exportedAt || '',
    fileTrades: (data.trades||[]).length,
    fileJournals: (data.journals||[]).length,
    localTrades: trades.length,
    localJournals: journals.length,
    newTrades, overlapTrades, newJournals, newWeekly,
    isSameDevice: data.deviceId === DEVICE_ID
  };
}

// Pending restore data (set by file reader)
let _pendingRestoreData = null;

function restoreBackup(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const data = JSON.parse(e.target.result);
      if(!data || (typeof data !== 'object')) throw new Error('invalid');
      _pendingRestoreData = data;
      showRestoreModal(data);
    }catch(err){
      toast(currentLang()==='en'?'❌ File is not valid or is corrupted':'❌ فایل معتبر نیست یا خراب است','error');
      _pendingRestoreData = null;
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function showRestoreModal(data){
  const diff = analyzeBackupDiff(data);
  const modal = document.getElementById('restoreModal');
  const body  = document.getElementById('restoreModalBody');
  if(!modal || !body){ // fallback to old confirm flow
    doRestoreFallback(data);
    return;
  }
  const en = currentLang()==='en';
  const locale = en ? 'en-GB' : 'fa-IR';

  const sameDevBadge = diff.isSameDevice
    ? (en?'<span style="color:var(--green);font-size:.78rem;">● Same device</span>':'<span style="color:var(--green);font-size:.78rem;">● همین دستگاه</span>')
    : (en?'<span style="color:var(--amber);font-size:.78rem;">● Another device</span>':'<span style="color:var(--amber);font-size:.78rem;">● دستگاه دیگر</span>');

  body.innerHTML = `
    <div style="font-size:.84rem;line-height:1.7;color:var(--text-dim);margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong style="color:var(--text);">${en?'Backup file summary':'خلاصه فایل پشتیبان'}</strong>
        ${sameDevBadge}
      </div>
      <div style="background:var(--panel-2);border-radius:10px;padding:12px 14px;font-family:var(--mono);font-size:.78rem;">
        <div>Schema: v${escapeHTML(String(diff.schemaVersion))} · App: ${escapeHTML(String(diff.appVersion))}</div>
        <div>${en?'Exported':'صادرات'}: ${escapeHTML(diff.exportedAt ? new Date(diff.exportedAt).toLocaleString(locale) : '—')}</div>
        <div>Device: ${escapeHTML((diff.deviceId||'').slice(0,18))}…</div>
        <div style="margin-top:8px;border-top:1px solid var(--line);padding-top:8px;">
          ${en?'File':'فایل'}: <b>${diff.fileTrades}</b> ${en?'trades':'معامله'} · <b>${diff.fileJournals}</b> ${en?'journals':'ژورنال'}<br>
          ${en?'Current':'فعلی'}: <b>${diff.localTrades}</b> ${en?'trades':'معامله'} · <b>${diff.localJournals}</b> ${en?'journals':'ژورنال'}
        </div>
        <div style="margin-top:8px;color:var(--cyan);">
          +${diff.newTrades} ${en?'new trades':'معامله جدید'} · ${diff.overlapTrades} ${en?'overlap':'همپوشانی'} · +${diff.newJournals} ${en?'new journals':'ژورنال جدید'}
        </div>
      </div>
    </div>
    <p style="font-size:.82rem;color:var(--text-dim);margin-bottom:12px;">${en?'Choose a restore mode:':'حالت بازیابی را انتخاب کن:'}</p>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn btn-primary btn-block" onclick="executeRestore('merge')">${en?'🔀 Smart merge (recommended)':'🔀 ادغام هوشمند (پیشنهادی)'}</button>
      <button class="btn btn-ghost btn-block" onclick="executeRestore('replace')">${en?'⚠️ Full replace — all data':'⚠️ جایگزینی کامل همه داده‌ها'}</button>
      <button class="btn btn-ghost btn-block" onclick="executeRestore('settings')">${en?'⚙️ Settings only (contract, checklists, watchlist…)':'⚙️ فقط تنظیمات (قرارداد، چک‌لیست، واچ‌لیست...)'}</button>
      <button class="btn btn-ghost btn-block" onclick="closeRestoreModal()">${en?'Cancel':'انصراف'}</button>
    </div>
    <p style="font-size:.72rem;color:var(--text-faint);margin-top:12px;line-height:1.6;">
      • ${en?'Smart merge: new trades/journals are added; on conflict the newer version wins.':'ادغام هوشمند: معاملات/ژورنال‌های جدید اضافه می‌شوند؛ در صورت تعارض نسخه جدیدتر نگه داشته می‌شود.'}<br>
      • ${en?'Full replace: all current data is wiped and replaced with the file.':'جایگزینی کامل: تمام داده‌های فعلی پاک و با فایل جایگزین می‌شود.'}<br>
      • ${en?'Settings only: trades and journals stay untouched.':'فقط تنظیمات: معاملات و ژورنال‌ها دست‌نخورده می‌مانند.'}
    </p>
  `;
  modal.classList.add('active');
}

function closeRestoreModal(){
  const modal = document.getElementById('restoreModal');
  if(modal) modal.classList.remove('active');
  _pendingRestoreData = null;
}

function executeRestore(mode){
  const data = _pendingRestoreData;
  if(!data){ closeRestoreModal(); return; }

  try{
    if(mode === 'replace'){
      if(!confirm(currentLang()==='en'?'⚠️ All current data will be permanently replaced. Are you sure?':'⚠️ همه داده‌های فعلی برای همیشه جایگزین می‌شوند. مطمئنی؟')) return;
      trades = data.trades || [];
      journals = data.journals || [];
      dailyChecks = data.dailyChecks || {};
      preChecks = data.preChecks || {};
      scoresCache = data.scoresCache || {};
      settings = data.settings || {};
      if(settings.startingBalance===undefined) settings.startingBalance=10000;
      if(settings.consistencyCapPercent===undefined) settings.consistencyCapPercent=30;
      if(settings.dailyLossCapPercent===undefined) settings.dailyLossCapPercent=2;
      if(!settings.watchlist) settings.watchlist=JSON.parse(JSON.stringify(DEFAULT_WATCHLIST));
      if(!settings.trash) settings.trash=[];
      weeklyReviews = data.weeklyReviews || [];
      persistAll();
      refreshAllUI();
      toast(currentLang()==='en'?'✅ Full replace completed':'✅ جایگزینی کامل انجام شد');
    }
    else if(mode === 'settings'){
      if(data.settings){
        const preserve = { contractAccepted: settings.contractAccepted };
        settings = Object.assign({}, settings, data.settings, preserve);
        if(!settings.watchlist) settings.watchlist=JSON.parse(JSON.stringify(DEFAULT_WATCHLIST));
        if(!settings.trash) settings.trash=[];
        saveSettings();
        applyTheme();
        if(typeof renderSettings==='function') renderSettings();
        if(typeof renderWatchlistSettings==='function') renderWatchlistSettings();
        if(typeof renderDailyChecklist==='function') renderDailyChecklist();
        toast(currentLang()==='en'?'✅ Settings restored':'✅ فقط تنظیمات بازیابی شد');
      } else {
        toast(currentLang()==='en'?'File has no valid settings':'فایل تنظیمات معتبری ندارد','error');
      }
    }
    else { // merge
      const result = mergeBackupData(data);
      toast(currentLang()==='en'?`✅ Merged — +${result.addedTrades} new trades, ${result.updatedTrades} updated, +${result.addedJournals} journals`:`✅ ادغام انجام شد — +${result.addedTrades} معامله جدید، ${result.updatedTrades} به‌روز، +${result.addedJournals} ژورنال`);
    }
  }catch(err){
    console.error(err);
    toast(currentLang()==='en'?'❌ Restore error':'❌ خطا در بازیابی','error');
  }
  closeRestoreModal();
}

// Fallback if modal missing
function doRestoreFallback(data){
  const replace = confirm(currentLang()==='en' ? 'OK = full replace\nCancel = smart merge' : 'OK = جایگزینی کامل\nCancel = ادغام هوشمند');
  if(replace){
    trades = data.trades||[]; journals=data.journals||[]; dailyChecks=data.dailyChecks||{};
    preChecks=data.preChecks||{}; scoresCache=data.scoresCache||{}; settings=data.settings||{};
    weeklyReviews=data.weeklyReviews||[];
    if(settings.startingBalance===undefined) settings.startingBalance=10000;
    persistAll(); refreshAllUI();
    toast('✅ بازیابی کامل انجام شد');
  } else {
    mergeBackupData(data);
  }
}

function exportCSV(){
  if(!trades.length){toast(currentLang()==='en'?'No trades to export':'معامله‌ای برای خروجی وجود ندارد','error');return;}
  const headers=['Date','Time','Pair','Dir','Entry','SL','TP','RR','Emotion','Setup','Liquidity','POI','TimeZone','Result','PnL','ScoreTech','ScoreRisk','ScoreMental','ScoreLearning','ScoreExecution','Tags','Note','ClosedAt'];
  const rows=trades.map(t=>[
    t.date,t.time||'',t.pair,t.dir,t.entry,t.sl,t.tp,t.rr,t.emotion,`"${t.setup||''}"`,`"${t.liquidity||''}"`,`"${t.poi||''}"`,`"${t.timeZone||''}"`,t.result,t.pnlUsd,
    t.scoreTech,t.scoreRisk,t.scoreMental,t.scoreLearning!==undefined?t.scoreLearning:'',t.scoreExecution!==undefined&&t.scoreExecution!==null?t.scoreExecution:'',`"${t.tags||''}"`,`"${(t.note||'').replace(/"/g,'""')}"`,
    t.closedAt? new Date(t.closedAt).toISOString() : ''
  ]);
  const csv=[headers.join(','),...rows.map(r=>r.join(','))].join('\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='trades-'+localDateStr()+'.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast(currentLang()==='en'?'✅ CSV downloaded':'✅ CSV دانلود شد');
}

function autoBackupCheck(){
  const last=localStorage.getItem(STORAGE.backup);
  const today=localDateStr();
  if(last!==today){
    const lastDate=last?new Date(last):new Date(0);
    const diff=Math.floor((new Date()-lastDate)/(1000*60*60*24));
    if(diff>=7){
      downloadBackup();
    }
  }
  // also check storage health on load
  setTimeout(checkStorageHealth, 2500);
}

