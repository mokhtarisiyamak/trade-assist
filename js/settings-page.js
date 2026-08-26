// ===== SETTINGS / CUSTOM CHECKLIST =====
// ===== روتین روزانه (تب مستقل، قابل‌ویرایش) =====
function parseRoutineItems(raw){
  return (raw||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [time='', title='', body=''] = line.split('|');
    return {time, title, body};
  });
}
function routinePhaseTitle(ph){
  if(currentLang()==='en') return ph.titleEn || ph.title;
  return ph.title;
}
function routinePhaseItems(ph){
  if(currentLang()==='en' && ph.itemsEn) return ph.itemsEn;
  return ph.items||'';
}
function renderRoutinePage(){
  const container=document.getElementById('routine-phases');
  if(!container) return;
  const phases = settings.routinePhases || DEFAULT_ROUTINE;
  const en = currentLang()==='en';
  container.innerHTML = phases.map((ph,idx)=>{
    const items = parseRoutineItems(routinePhaseItems(ph));
    return `<div class="phase" data-idx="${idx}"><div class="phase-head" style="--accent:var(--${ph.accent})">
        <h3>${escapeHTML(routinePhaseTitle(ph))}</h3>
        <span class="phase-window">${escapeHTML(ph.window)}</span>
        <button type="button" class="btn btn-sm btn-ghost" onclick="openRoutineEdit(${idx})" style="margin-inline-start:auto;">✏️</button>
        <button type="button" class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="deleteRoutinePhase(${idx})">🗑️</button>
      </div>
      <div class="phase-body">
        ${items.map(it=>`<div class="phase-item"><span class="t">${escapeHTML(it.time)}</span><strong class="title">${escapeHTML(it.title)}</strong>
          ${it.body?(it.body.includes('~')?`<ul>${it.body.split('~').map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul>`:`<p>${escapeHTML(it.body)}</p>`):''}
        </div>`).join('')}
      </div>
    </div>`;
  }).join('') + `<button class="btn btn-sm btn-ghost btn-block" onclick="openRoutineEdit(-1)" style="margin-top:8px;">${en?'➕ Add new phase':'➕ افزودن فاز جدید'}</button>`;}
function openRoutineEdit(idx){
  const phases = settings.routinePhases || DEFAULT_ROUTINE;
  const isNew = idx<0;
  const ph = isNew ? {title:'',accent:'cyan',window:'',items:''} : phases[idx];
  document.getElementById('re-idx').value = idx;
  document.getElementById('re-title').value = ph.title;
  document.getElementById('re-window').value = ph.window;
  document.getElementById('re-accent').value = ph.accent;
  document.getElementById('re-items').value = ph.items;
  document.getElementById('routineEditModal').classList.add('active');
}
function closeRoutineEdit(){document.getElementById('routineEditModal').classList.remove('active');}
function saveRoutineEdit(){
  const idx = parseInt(document.getElementById('re-idx').value);
  const updated = {
    id: idx>=0 ? (settings.routinePhases||DEFAULT_ROUTINE)[idx].id : 'ph_'+Date.now(),
    title: document.getElementById('re-title').value.trim(),
    window: document.getElementById('re-window').value.trim(),
    accent: document.getElementById('re-accent').value,
    items: document.getElementById('re-items').value
  };
  if(!updated.title){toast(currentLang()==='en'?'Enter the phase title':'عنوان فاز را وارد کن','error');return;}
  if(!settings.routinePhases) settings.routinePhases = JSON.parse(JSON.stringify(DEFAULT_ROUTINE));
  if(idx>=0) settings.routinePhases[idx]=updated; else settings.routinePhases.push(updated);
  saveSettings();
  closeRoutineEdit();
  renderRoutinePage();
  toast(currentLang()==='en'?'✅ Routine saved':'✅ روتین ذخیره شد');
}
function deleteRoutinePhase(idx){
  if(!confirm(currentLang()==='en'?'Delete this phase?':'این فاز حذف شود؟')) return;
  if(!settings.routinePhases) settings.routinePhases = JSON.parse(JSON.stringify(DEFAULT_ROUTINE));
  settings.routinePhases.splice(idx,1);
  saveSettings();
  renderRoutinePage();
}

function renderSettings(){
  document.getElementById('contract-input').value=contractText();
  document.getElementById('account-balance-input').value=settings.startingBalance||10000;
  renderWatchlistSettings();

  const stageSel=document.getElementById('new-pre-stage');
  if(stageSel && !stageSel.options.length){
    stageSel.innerHTML=PRE_STAGES.map(s=>`<option value="${s.key}">${s.icon} ${escapeHTML(stageTitle(s))}</option>`).join('');
  }

  const dList=document.getElementById('settings-daily-list');
  dList.innerHTML=settings.dailyItems.map((it,idx)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--panel-2);border-radius:6px;margin-bottom:6px;font-size:.82rem;">
      <span style="flex:1;">${it.critical?'★':''} ${escapeHTML(itemText(it))} <span class="badge badge-${it.cat}">+${it.pts}</span></span>
      <button class="btn btn-sm btn-ghost" onclick="openEditItemModal('daily',${idx})">✏️</button>
      <button class="btn btn-sm btn-ghost" onclick="removeDailyItem(${idx})">🗑️</button>
    </div>
  `).join('');
  const pList=document.getElementById('settings-pre-list');
  pList.innerHTML=settings.preItems.map((it,idx)=>{
    const stage=PRE_STAGES.find(s=>s.key===it.stage);
    return `
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--panel-2);border-radius:6px;margin-bottom:6px;font-size:.82rem;">
      <span style="flex:1;">${it.critical?'★':''} ${escapeHTML(itemText(it))} <span class="badge badge-${it.cat}">+${it.pts}</span> ${stage?`<span class="badge" style="background:var(--panel);color:var(--text-faint);">${stage.icon} ${escapeHTML(stageTitle(stage))}</span>`:''}</span>
      <button class="btn btn-sm btn-ghost" onclick="openEditItemModal('pre',${idx})">✏️</button>
      <button class="btn btn-sm btn-ghost" onclick="removePreItem(${idx})">🗑️</button>
    </div>
  `;}).join('');
  // category selects in settings
  document.querySelectorAll('#new-daily-cat option, #new-pre-cat option, #ei-cat option').forEach(opt=>{
    const v=opt.value;
    if(v==='tech') opt.textContent=t('cat.tech');
    else if(v==='risk') opt.textContent=t('cat.risk');
    else if(v==='mental') opt.textContent=t('cat.mental');
    else if(v==='learning') opt.textContent=t('cat.learning');
  });
  renderTrash();
}

// ===== EDIT checklist item =====
function openEditItemModal(listType, idx){
  const list = listType==='daily' ? settings.dailyItems : settings.preItems;
  const it = list[idx];
  if(!it) return;
  document.getElementById('ei-list-type').value=listType;
  document.getElementById('ei-idx').value=idx;
  document.getElementById('ei-text').value=itemText(it);
  document.getElementById('ei-cat').value=it.cat;
  document.getElementById('ei-pts').value=it.pts;
  document.getElementById('ei-critical').checked=!!it.critical;
  const stageGroup=document.getElementById('ei-stage-group');
  const stageSel=document.getElementById('ei-stage');
  if(listType==='pre'){
    stageSel.innerHTML=PRE_STAGES.map(s=>`<option value="${s.key}">${s.icon} ${escapeHTML(stageTitle(s))}</option>`).join('');
    stageSel.value=it.stage||'final';
    stageGroup.style.display='';
  } else {
    stageGroup.style.display='none';
  }
  document.getElementById('editItemModal').classList.add('active');
}
function closeEditItemModal(){document.getElementById('editItemModal').classList.remove('active');}
function saveEditedItem(){
  const listType=document.getElementById('ei-list-type').value;
  const idx=parseInt(document.getElementById('ei-idx').value);
  const text=document.getElementById('ei-text').value.trim();
  if(!text){toast(currentLang()==='en'?'Enter item text':'متن آیتم را وارد کنید','error');return;}
  const updated={
    cat:document.getElementById('ei-cat').value,
    pts:parseInt(document.getElementById('ei-pts').value)||3,
    critical:document.getElementById('ei-critical').checked
  };
  if(currentLang()==='en') updated.textEn = text;
  else updated.text = text;
  if(listType==='pre') updated.stage=document.getElementById('ei-stage').value;
  const list = listType==='daily' ? settings.dailyItems : settings.preItems;
  if(!list[idx]) return;
  list[idx] = Object.assign({}, list[idx], updated); // keep original id
  saveSettings();
  closeEditItemModal();
  renderSettings();
  renderPreChecklist();
  renderDailyChecklist();
  toast(currentLang()==='en'?'✅ Item updated':'✅ آیتم ویرایش شد');
}

// ===== TRASH / RECOVERY for deleted checklist items =====
function renderTrash(){
  const EN=currentLang()==='en';
  const container=document.getElementById('settings-trash-list');
  if(!container) return;
  if(!settings.trash || !settings.trash.length){
    container.innerHTML='<p style="font-size:.8rem;color:var(--text-faint)">'+(currentLang()==='en'?'Nothing deleted.':'چیزی حذف نشده.')+'</p>';
    return;
  }
  container.innerHTML=settings.trash.map((tr,idx)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--panel-2);border-radius:6px;margin-bottom:6px;font-size:.8rem;">
      <span style="flex:1;color:var(--text-faint);">
        <span class="badge badge-${tr.item.cat}">${tr.listType==='daily'?(EN?'Morning':'صبحگاهی'):(EN?'Pre-entry':'پیش‌ورود')}</span>
        ${tr.item.critical?'★':''} ${escapeHTML(tr.item.text)}
      </span>
      <button class="btn btn-sm btn-success" onclick="restoreTrashItem(${idx})">↩️ ${EN?'Restore':'بازیابی'}</button>
      <button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="purgeTrashItem(${idx})">${EN?'Delete forever':'حذف کامل'}</button>
    </div>
  `).join('');
}
function restoreTrashItem(idx){
  const tr=settings.trash[idx];
  if(!tr) return;
  if(tr.listType==='daily') settings.dailyItems.push(tr.item);
  else settings.preItems.push(tr.item);
  settings.trash.splice(idx,1);
  saveSettings();
  renderSettings();
  toast(currentLang()==='en'?'✅ Item restored':'✅ آیتم بازیابی شد');
}
function purgeTrashItem(idx){
  if(!confirm(currentLang()==='en'?'This item will be permanently deleted. Sure?':'این آیتم برای همیشه پاک می‌شود. مطمئنید؟'))return;
  settings.trash.splice(idx,1);
  saveSettings();
  renderTrash();
}
function clearTrash(){
  if(!settings.trash || !settings.trash.length) return;
  if(!confirm(currentLang()==='en'?'All trash items will be permanently deleted. Sure?':'همه آیتم‌های سطل بازیافت برای همیشه پاک می‌شوند. مطمئنید؟'))return;
  settings.trash=[];
  saveSettings();
  renderTrash();
  toast(currentLang()==='en'?'Trash emptied':'سطل بازیافت خالی شد');
}
function moveToTrash(item, listType){
  if(!settings.trash) settings.trash=[];
  settings.trash.unshift({item, listType, deletedAt:Date.now()});
  if(settings.trash.length>20) settings.trash=settings.trash.slice(0,20); // keep only last 20
}

function addDailyItem(){
  const text=document.getElementById('new-daily-text').value.trim();
  const cat=document.getElementById('new-daily-cat').value;
  const pts=parseInt(document.getElementById('new-daily-pts').value)||3;
  const critical=document.getElementById('new-daily-critical').checked;
  if(!text){toast(currentLang()==='en'?'Enter item text':'متن آیتم را وارد کنید','error');return;}
  settings.dailyItems.push({id:'d_'+Date.now(),text,cat,pts,critical});
  saveSettings();
  renderSettings();
  document.getElementById('new-daily-text').value='';
}
function removeDailyItem(idx){
  const it=settings.dailyItems[idx];
  if(!it) return;
  if(!confirm(currentLang()==='en'?'Delete this item? (recoverable from trash later)':'این آیتم حذف شود؟ (بعداً از سطل بازیافت قابل بازگردانی است)'))return;
  moveToTrash(it,'daily');
  settings.dailyItems.splice(idx,1);
  saveSettings();
  renderSettings();
  toast(currentLang()==='en'?'Item deleted — recoverable from the trash bin':'آیتم حذف شد — از سطل بازیافت قابل بازگردانی است');
}
function addPreItem(){
  const text=document.getElementById('new-pre-text').value.trim();
  const cat=document.getElementById('new-pre-cat').value;
  const stage=document.getElementById('new-pre-stage').value || 'final';
  const pts=parseInt(document.getElementById('new-pre-pts').value)||3;
  const critical=document.getElementById('new-pre-critical').checked;
  if(!text){toast(currentLang()==='en'?'Enter item text':'متن آیتم را وارد کنید','error');return;}
  settings.preItems.push({id:'p_'+Date.now(),text,cat,pts,critical,stage});
  saveSettings();
  renderSettings();
  renderPreChecklist();
  document.getElementById('new-pre-text').value='';
}
function removePreItem(idx){
  const it=settings.preItems[idx];
  if(!it) return;
  if(!confirm(currentLang()==='en'?'Delete this item? (recoverable from trash later)':'این آیتم حذف شود؟ (بعداً از سطل بازیافت قابل بازگردانی است)'))return;
  moveToTrash(it,'pre');
  settings.preItems.splice(idx,1);
  saveSettings();
  renderSettings();
  toast(currentLang()==='en'?'Item deleted — recoverable from the trash bin':'آیتم حذف شد — از سطل بازیافت قابل بازگردانی است');
}

// ===== WATCHLIST (core, editable) =====
function renderWatchlistSettings(){
  const list=document.getElementById('settings-watchlist-list');
  if(!list) return;
  if(!settings.watchlist || !settings.watchlist.length){
    list.innerHTML='<p style="font-size:.8rem;color:var(--text-faint)">'+(currentLang()==='en'?'No instruments added.':'هیچ ابزاری اضافه نشده.')+'</p>';
  } else {
    list.innerHTML=settings.watchlist.map((sym,idx)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--panel-2);border-radius:6px;margin-bottom:6px;font-size:.82rem;">
        <span class="mono" style="flex:1;">${escapeHTML(sym)}</span>
        <button class="btn btn-sm btn-ghost" onclick="removeWatchlistItem(${idx})">🗑️</button>
      </div>
    `).join('');
  }
  populatePairDropdown();
}
function addWatchlistItem(){
  const input=document.getElementById('new-watchlist-item');
  const sym=input.value.trim().toUpperCase().replace('/','');
  if(!sym){toast(currentLang()==='en'?'Enter an instrument name':'نام ابزار را وارد کنید','error');return;}
  if(!settings.watchlist) settings.watchlist=[];
  if(settings.watchlist.includes(sym)){toast(currentLang()==='en'?'Instrument already added':'این ابزار قبلاً اضافه شده','error');return;}
  settings.watchlist.push(sym);
  saveSettings();
  renderWatchlistSettings();
  input.value='';
  toast(currentLang()==='en'?'✅ Added to watchlist':'✅ به واچ‌لیست اضافه شد');
}
function removeWatchlistItem(idx){
  settings.watchlist.splice(idx,1);
  saveSettings();
  renderWatchlistSettings();
}
function populatePairDropdown(){
  const sel=document.getElementById('nt-pair');
  if(!sel) return;
  const prev=sel.value;
  const list=(settings.watchlist && settings.watchlist.length) ? settings.watchlist : DEFAULT_WATCHLIST;
  sel.innerHTML='<option value="">'+(currentLang()==='en'?'— select —':'— انتخاب کنید —')+'</option>'+list.map(sym=>`<option value="${escapeHTML(sym)}">${escapeHTML(sym)}</option>`).join('');
  if(list.includes(prev)) sel.value=prev;
  renderWatchlistPage();
}

const WATCHLIST_DESCRIPTIONS={
  'GBPUSD':{fa:'نوسان روزانه بالا، ساختار سشن (Asia → London Judas → NY) را تمیز رعایت می‌کند.',en:'High daily range; respects session structure cleanly (Asia → London Judas → NY).'},
  'EURUSD':{fa:'نقدشونده‌ترین جفت‌ارز دنیا، کمترین اسپرد، نویز کمتر نسبت به سایرین.',en:'The most liquid pair in the world; tightest spread, less noise than the others.'},
  'USDJPY':{fa:'همبستگی با بازده اوراق و ریسک‌پذیری بازار. ⚠️ اگر هم‌زمان با XAU/BTC روی «دلار ضعیف» باز شود، یک شرط تکراری است نه تنوع واقعی.',en:'Correlates with bond yields and market risk appetite. ⚠️ If opened alongside XAU/BTC on a "weak dollar" thesis, it is one repeated condition, not real diversification.'},
  'XAUUSD':{fa:'یکی از تمیزترین ابزارها برای مفاهیم نقدینگی — Sweep و Reversal‌های واضح.',en:'One of the cleanest instruments for liquidity concepts — clear sweeps and reversals.'},
  'BTCUSD':{fa:'نقدینگی بالا، ساختار OB/FVG تمیز. توجه: سشن‌های Asia/London/NY روی کریپتو تقریبی‌اند، نه ساختار نهادی واقعی مثل فارکس.',en:'High liquidity, clean OB/FVG structure. Note: Asia/London/NY sessions are approximate on crypto, not real institutional structure like forex.'}
};
function renderWatchlistPage(){
  const container=document.getElementById('watchlist-core-display');
  if(!container) return;
  const list=(settings.watchlist && settings.watchlist.length) ? settings.watchlist : DEFAULT_WATCHLIST;
  const en=currentLang()==='en';
  if(!list.length){ container.innerHTML='<p style="color:var(--text-faint);font-size:.85rem;">'+(en?'No instruments added yet — add them from Settings.':'هنوز ابزاری اضافه نشده — از بخش تنظیمات اضافه کن.')+'</p>'; return; }
  container.innerHTML=list.map(sym=>{
    const d=WATCHLIST_DESCRIPTIONS[sym];
    const desc=d ? (en?d.en:d.fa) : (en?'Added to core in Settings — document your reason and logic for this instrument.':'در تنظیمات به هسته اصلی اضافه شده — دلیل و منطق این ابزار را خودت مستند کن.');
    return `<div style="padding:14px 16px;background:var(--panel-2);border-radius:var(--radius-sm);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><span class="mono" style="font-weight:700;">${escapeHTML(sym)}</span></div>
      <p style="margin:0;color:var(--text-dim);font-size:.85rem;">${desc}</p>
    </div>`;
  }).join('');
}
function openChecklistSettings(){
  document.querySelector('[data-page="settings"]').click();
}

// ===== v7: opt-in migration for user data authored in Persian before v7 =====
// Loads the legacy phrase table lazily and fills the English side of stored
// checklist items (textEn) and the contract (contract.en) where confident.
function migrateLegacyPersian(){
  const en=currentLang()==='en';
  const finish=(translated,skipped)=>{
    saveSettings();
    toast(en
      ? `✅ Migration finished — ${translated} item(s) translated, ${skipped} left as-is (custom wording)`
      : `✅ مهاجرت انجام شد — ${translated} آیتم ترجمه شد، ${skipped} مورد دست‌نخورده ماند`);
    renderSettings();
  };
  const run=()=>{
    let translated=0, skipped=0;
    const tx=window.TBC_LEGACY_TRANSLATE;
    (settings.dailyItems||[]).concat(settings.preItems||[]).forEach(it=>{
      if(!it.text || it.textEn) return;
      const out=tx(it.text);
      if(out && !/[\u0600-\u06FF]/.test(out) && out.replace(/\s/g,'')!==''){ it.textEn=out; translated++; }
      else skipped++;
    });
    const c=settings.contract;
    if(typeof c==='string'){ settings.contract={fa:c,en:tx(c)||c}; translated++; }
    else if(c && !c.en && c.fa){ const o=tx(c.fa); if(o && !/[\u0600-\u06FF]/.test(o)){ c.en=o; translated++; } else skipped++; }
    finish(translated,skipped);
  };
  if(window.TBC_LEGACY_TRANSLATE){ run(); return; }
  const sc=document.createElement('script');
  sc.src='js/legacy-fa-phrases.js';
  sc.onload=run;
  sc.onerror=()=>toast(en?'❌ Could not load the translation table':'❌ بارگذاری جدول ترجمه ناموفق بود','error');
  document.head.appendChild(sc);
}

