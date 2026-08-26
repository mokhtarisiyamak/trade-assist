// ===== TRADE FORM =====
function updateLiveRR(){
  const entry=parseFloat(document.getElementById('nt-entry').value);
  const sl=parseFloat(document.getElementById('nt-sl').value);
  const tp=parseFloat(document.getElementById('nt-tp').value);
  const rrField=document.getElementById('nt-rr');
  if(!isNaN(entry)&&!isNaN(sl)&&!isNaN(tp)&&sl!==entry){
    const risk=Math.abs(entry-sl), reward=Math.abs(tp-entry);
    rrField.value = risk>0 ? (reward/risk).toFixed(2)+':1' : '';
    // v5.8: قرمز اگر زیر 2:1 یا TP در جهت اشتباه (آن‌طرفِ ورود نسبت به استاپ)
    const wrongSide = (tp-entry)*(entry-sl) < 0;
    rrField.style.color = (!risk || reward/risk<2 || wrongSide) ? '#f85149' : '#3fb950';
  } else { rrField.value=''; }
  updatePosSize();
}
// v5.8: ماشین‌حساب سایز — ریسک دلاری ÷ فاصله قیمتی استاپ (واحدِ قیمت)
function updatePosSize(){
  const el=document.getElementById('nt-pos-size');
  if(!el) return;
  const entry=parseFloat(document.getElementById('nt-entry').value);
  const sl=parseFloat(document.getElementById('nt-sl').value);
  const riskUsd=parseFloat(document.getElementById('nt-risk-usd').value);
  if(!isNaN(entry)&&!isNaN(sl)&&!isNaN(riskUsd)&&Math.abs(entry-sl)>0){
    el.value = (riskUsd/Math.abs(entry-sl)).toFixed(4)+(currentLang()==='en'?' units':' واحد');
    el.style.color = 'var(--cyan)';
  } else { el.value=''; }
}

function updateTradePyramidWarn(){
  const pair=document.getElementById('nt-pair').value.trim().toUpperCase();
  const box=document.getElementById('nt-pyramid-warn');
  if(!pair){ box.innerHTML=''; return; }
  const today=localDateStr();
  const sameToday=trades.filter(t=>t.date===today && t.pair===pair);
  const step=sameToday.length+1;
  const en=currentLang()==='en';
  if(step>=3){
    box.innerHTML= en
      ? `<div class="coach-alert coach-alert-bad" style="margin:0;"><span class="coach-alert-icon">🛑</span><div class="coach-alert-text"><div class="coach-alert-title">Tier ${step} on ${pair}</div><div class="coach-alert-body">Only with a clear justification — not because of loss/FOMO.</div></div></div>
      <label style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:var(--panel-2);border-radius:var(--radius-sm);border:1px solid var(--red);margin-top:6px;">
        <input type="checkbox" id="nt-pyramid-confirm" style="margin-top:2px;">
        <span style="font-size:.82rem;">I confirm this tier ${step} is a fresh, justified decision</span>
      </label>`
      : `<div class="coach-alert coach-alert-bad" style="margin:0;"><span class="coach-alert-icon">🛑</span><div class="coach-alert-text"><div class="coach-alert-title">پله ${step}ام روی ${pair}</div><div class="coach-alert-body">فقط با توجیه روشن و نه به خاطر ضرر/FOMO.</div></div></div>
      <label style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:var(--panel-2);border-radius:var(--radius-sm);border:1px solid var(--red);margin-top:6px;">
        <input type="checkbox" id="nt-pyramid-confirm" style="margin-top:2px;">
        <span style="font-size:.82rem;">تایید می‌کنم این پله ${step}ام یک تصمیم تازه و توجیه‌شده است</span>
      </label>`;
  } else if(step===2){
    box.innerHTML= en
      ? `<div class="coach-alert coach-alert-warn" style="margin:0;"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-title">Second tier on ${pair}</div><div class="coach-alert-body">Check cumulative risk — 2% cap.</div></div></div>`
      : `<div class="coach-alert coach-alert-warn" style="margin:0;"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-title">پله دوم روی ${pair}</div><div class="coach-alert-body">ریسک تجمعی را چک کن — سقف ۲٪.</div></div></div>`;
  } else { box.innerHTML=''; }
}

// ===== v6.1 TRADE DRAFT + COPY + COMPACT =====
const TRADE_DRAFT_FIELDS = [
  'nt-pair','nt-entry','nt-sl','nt-tp','nt-risk-usd','nt-emotion',
  'nt-style','nt-exit-type','nt-setup','nt-liquidity','nt-poi','nt-note'
];

function collectTradeForm(){
  const dirEl = document.querySelector('input[name="nt-dir"]:checked');
  return {
    pair: (document.getElementById('nt-pair')||{}).value || '',
    dir: dirEl ? dirEl.value : 'BUY',
    entry: (document.getElementById('nt-entry')||{}).value || '',
    sl: (document.getElementById('nt-sl')||{}).value || '',
    tp: (document.getElementById('nt-tp')||{}).value || '',
    riskUsd: (document.getElementById('nt-risk-usd')||{}).value || '',
    emotion: (document.getElementById('nt-emotion')||{}).value || 'calm',
    style: (document.getElementById('nt-style')||{}).value || 'dayTrading',
    exitType: (document.getElementById('nt-exit-type')||{}).value || 'liquidityBased',
    setup: (document.getElementById('nt-setup')||{}).value || '',
    liquidity: (document.getElementById('nt-liquidity')||{}).value || '',
    poi: (document.getElementById('nt-poi')||{}).value || '',
    note: (document.getElementById('nt-note')||{}).value || '',
    savedAt: Date.now()
  };
}

function applyTradeForm(data, opts={}){
  if(!data) return;
  const set = (id, val)=>{ const el=document.getElementById(id); if(el && val!==undefined && val!==null) el.value=val; };
  set('nt-pair', data.pair);
  set('nt-entry', data.entry);
  set('nt-sl', data.sl);
  set('nt-tp', data.tp);
  set('nt-risk-usd', data.riskUsd);
  set('nt-emotion', data.emotion || 'calm');
  set('nt-style', data.style || 'dayTrading');
  set('nt-exit-type', data.exitType || 'liquidityBased');
  set('nt-setup', data.setup);
  set('nt-liquidity', data.liquidity);
  set('nt-poi', data.poi);
  set('nt-note', data.note || '');
  // direction radios
  const buy = document.getElementById('nt-dir');
  const sell = document.getElementById('nt-dir-sell');
  if(data.dir === 'SELL'){ if(sell) sell.checked=true; }
  else { if(buy) buy.checked=true; }
  // trigger dependent UI
  try{
    if(typeof onTradeStyleChange==='function' && data.style) onTradeStyleChange(data.style);
    if(typeof onExitTypeChange==='function' && data.exitType) onExitTypeChange(data.exitType);
    updateLiveRR();
    updatePosSize();
    updateTradePyramidWarn();
    if(typeof checkCorrelatedRisk==='function') checkCorrelatedRisk();
  }catch(e){}
  if(opts.showToast) toast(opts.toastMsg || (currentLang()==='en'?'Form filled':'فرم پر شد'));
}

let _draftSaveTimer = null;
function saveTradeDraft(){
  clearTimeout(_draftSaveTimer);
  _draftSaveTimer = setTimeout(()=>{
    try{
      const data = collectTradeForm();
      // only save if something meaningful is filled
      const hasContent = data.pair || data.entry || data.sl || data.tp || data.note || data.riskUsd;
      if(hasContent){
        localStorage.setItem(STORAGE.tradeDraft, JSON.stringify(data));
        const ind = document.getElementById('draft-indicator');
        if(ind) ind.style.display = 'inline-flex';
      }
    }catch(e){}
  }, 400);
}

function loadTradeDraft(){
  try{
    const raw = localStorage.getItem(STORAGE.tradeDraft);
    if(!raw) return false;
    const data = JSON.parse(raw);
    if(!data) return false;
    applyTradeForm(data);
    const ind = document.getElementById('draft-indicator');
    if(ind) ind.style.display = 'inline-flex';
    return true;
  }catch(e){ return false; }
}

function clearTradeDraft(){
  try{ localStorage.removeItem(STORAGE.tradeDraft); }catch(e){}
  const ind = document.getElementById('draft-indicator');
  if(ind) ind.style.display = 'none';
}

function clearTradeForm(alsoDraft){
  ['nt-pair','nt-entry','nt-sl','nt-tp','nt-rr','nt-note','nt-risk-usd','nt-pos-size','nt-allowed-risk'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  const b=document.getElementById('nt-dir'); if(b) b.checked=true;
  const emo=document.getElementById('nt-emotion'); if(emo) emo.value='calm';
  if(alsoDraft) clearTradeDraft();
  updateTradePyramidWarn();
  toast(currentLang()==='en'?'Form cleared':'فرم پاک شد');
}

function copyLastSimilarTrade(){
  if(!trades.length){ toast(currentLang()==='en'?'No trades logged yet':'هنوز معامله‌ای ثبت نشده','error'); return; }
  const currentPair = (document.getElementById('nt-pair')||{}).value.trim().toUpperCase();
  let src = null;
  if(currentPair){
    src = trades.find(t => (t.pair||'').toUpperCase() === currentPair);
  }
  if(!src) src = trades[0]; // most recent overall
  if(!src){ toast(currentLang()==='en'?'No trade to copy from':'معامله‌ای برای کپی نیست','error'); return; }

  applyTradeForm({
    pair: src.pair || '',
    dir: src.dir || 'BUY',
    entry: src.entry || '',
    sl: src.sl || '',
    tp: src.tp || '',
    riskUsd: src.riskUsd || '',
    emotion: src.emotion || 'calm',
    style: src.style || document.getElementById('nt-style')?.value || 'dayTrading',
    exitType: src.exitType || document.getElementById('nt-exit-type')?.value || 'liquidityBased',
    setup: src.setup || '',
    liquidity: src.liquidity || '',
    poi: src.poi || '',
    note: src.note || ''
  }, {showToast:true, toastMsg: (currentLang()==='en'?'Copied from ':'کپی شد از ') + (src.pair||'') + ' · ' + (src.date||'')});
  saveTradeDraft();
}

function toggleCompactMode(){
  const on = document.body.classList.toggle('compact-mode');
  try{ localStorage.setItem(STORAGE.compactMode, on ? '1' : '0'); }catch(e){}
  const btn = document.getElementById('compactToggleBtn');
  if(btn) btn.textContent = on ? t('dash.compactOff') : t('dash.compact');
  toast(on ? t('dash.compact') : t('dash.compactOff'));
}
function applyCompactModeOnLoad(){
  try{
    if(localStorage.getItem(STORAGE.compactMode)==='1'){
      document.body.classList.add('compact-mode');
      const btn = document.getElementById('compactToggleBtn');
      if(btn) btn.textContent = t('dash.compactOff');
    }
  }catch(e){}
}

// wire draft auto-save on key fields
function wireTradeDraftAutosave(){
  TRADE_DRAFT_FIELDS.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('change', saveTradeDraft);
    if(el.tagName==='INPUT' || el.tagName==='TEXTAREA') el.addEventListener('input', saveTradeDraft);
  });
  document.querySelectorAll('input[name="nt-dir"]').forEach(r=>{
    r.addEventListener('change', saveTradeDraft);
  });
}

function saveNewTrade(){
  if(isLockedOut()){ toast(currentLang()==='en'?'🔴 Lockout active — 2 losses today, wait until tomorrow':'🔴 Lockout فعال است — امروز ۲ ضرر خورده‌ای، تا فردا صبر کن','error'); return; }
  if(isForcedStop()){ toast(currentLang()==='en'?'⏳ 2-hour forced stop active — wait':'⏳ قفل ۲ ساعته فعال است — صبر کن','error'); return; }

  const cs=calcCombinedScore();
  const rp=getRiskPercent(cs.total, cs.criticalMissed);
  if(rp===0){ toast(currentLang()==='en'?'🔴 Entry blocked — complete both checklists first.':'🔴 ورود ممنوع — ابتدا هر دو چک‌لیست را تکمیل کن.','error'); return; }
  // v5.8: گیت حد ضرر روزانه ٪ی (سخت)
  if(isDailyLossBreached()){ toast(currentLang()==='en'?'🛑 Daily loss cap ('+(settings.dailyLossCapPercent||2)+'%) hit — trading locked until tomorrow':'🛑 حد ضرر روزانه ('+(settings.dailyLossCapPercent||2)+'٪) پر شده — ثبت معامله تا فردا بسته است','error'); return; }

  // v5.8: ولیدیتور نرم ریسک دلاری — ریسک پلن > سقف مجاز؟ هشدار + تأیید آگاهانه
  const balNow=parseFloat(settings.startingBalance)||10000;
  const allowedUsd = balNow*rp/100;
  const planRisk=parseFloat(document.getElementById('nt-risk-usd').value);
  if(!isNaN(planRisk) && planRisk>allowedUsd && !window._riskOverridden){
    if(!confirm(currentLang()==='en'?'⚠️ Planned risk ($'+planRisk.toFixed(2)+') exceeds today\'s cap ($'+allowedUsd.toFixed(2)+' = '+rp+'%).\nWith score '+cs.total+' only '+rp+'% is allowed.\n\nKnowingly violate and log?':'⚠️ ریسک پلن ($'+planRisk.toFixed(2)+') از سقف امروز ($'+allowedUsd.toFixed(2)+' = '+rp+'٪) بیشتر است.\nبا امتیاز '+cs.total+' فقط '+rp+'٪ مجاز است.\n\nآگاهانه نقض می‌کنم و ثبت می‌کنم؟')){
      toast(currentLang()==='en'?'Logging cancelled — adjust risk to today\'s cap':'ثبت لغو شد — ریسک را با سقف امروز تنظیم کن','error');
      return;
    }
    window._riskOverridden=true; // در همین نشست دوباره نپرس
  }
  // v5.8: هشدار تناقض بایاس — جهت معامله خلاف «وضعیت بازار» انتخاب‌شده در مرحله بایاس
  const todayBias=(preChecks[localDateStr()]||{})['_bias'];
  const chosenDir=(function(){const c=document.querySelector('input[name="nt-dir"]:checked');return c?c.value:'BUY';})();
  const dirNum = chosenDir==='BUY' ? 1 : -1;
  const biasNum = todayBias==='trendUp' ? 1 : todayBias==='trendDown' ? -1 : 0;
  if(biasNum!==0 && dirNum!==biasNum && !window._biasOverridden){
    const biasFa = todayBias==='trendUp'?'صعودی':'نزولی';
    const biasEn = todayBias==='trendUp'?'Uptrend':'Downtrend';
    if(!confirm(currentLang()==='en'?'⚠️ Bias conflict: today\'s market condition is "'+biasEn+'" but you are taking '+chosenDir+'.\n\nLog anyway?':'⚠️ تناقض بایاس: وضعیت بازار امروز «'+biasFa+'» ثبت شده ولی داری '+chosenDir+' می‌گیری.\n\nباز هم ثبت شود؟')){
      toast(currentLang()==='en'?'Logging cancelled — check bias or direction':'ثبت لغو شد — بایاس یا جهت را بررسی کن','error');
      return;
    }
    window._biasOverridden=true;
  }

  const pair=document.getElementById('nt-pair').value.trim().toUpperCase();
  if(!pair){toast(currentLang()==='en'?'Enter a pair':'جفت‌ارز را وارد کنید','error');return}

  const todayForPyramid=localDateStr();
  const sameTodayCount=trades.filter(t=>t.date===todayForPyramid && t.pair===pair).length;
  if(sameTodayCount>=2){
    const confirmBox=document.getElementById('nt-pyramid-confirm');
    if(!confirmBox || !confirmBox.checked){
      toast(currentLang()==='en'?'🛑 Tick the tier-3 confirmation or skip this trade':'🛑 تیک تاییدیه پله سوم را بزن یا این معامله را نگیر','error');
      return;
    }
  }

  const preScore=calcPreTradeScore();
  const now=new Date();

  const data={
    id:Date.now().toString(),
    date:localDateStr(),
    time:now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0'),
    pair:pair,
    dir:(function(){const c=document.querySelector('input[name="nt-dir"]:checked');return c?c.value:'BUY'})(),
    entry:document.getElementById('nt-entry').value,
    sl:document.getElementById('nt-sl').value,
    tp:document.getElementById('nt-tp').value,
    rr:document.getElementById('nt-rr').value,
    riskUsd:document.getElementById('nt-risk-usd').value, // v5.6: ریسک دلاری پلن — پایه‌ی محاسبه‌ی صحیح R-Multiple
    emotion:document.getElementById('nt-emotion').value,
    note:document.getElementById('nt-note').value.trim(),
    setup:document.getElementById('nt-setup').value,
    liquidity:document.getElementById('nt-liquidity').value,
    poi:document.getElementById('nt-poi').value,
    style:(document.getElementById('nt-style')||{}).value || 'dayTrading',
    exitType:(document.getElementById('nt-exit-type')||{}).value || 'liquidityBased',
    timeZone:getTimeOfDayZone(now),
    scoreTech:preScore.tech,
    scoreRisk:preScore.risk,
    scoreMental:preScore.mental,
    scoreLearning:preScore.learning,
    stagesComplete:(function(){const checks=preChecks[localDateStr()]||{};return PRE_STAGES.map(s=>({key:s.key,complete:isPreStageComplete(s.key,checks)}));})(),
    result:'open',
    pnlUsd:'',
    resNote:'',
    tags:'',
    postTrade:{q1:'no',q2:'no',q3:'no'},
    createdAt:Date.now()
  };
  trades.unshift(data);
  saveTrades();
  clearTradeDraft(); // v6.1: draft consumed

  ['nt-pair','nt-entry','nt-sl','nt-tp','nt-rr','nt-note','nt-risk-usd','nt-pos-size'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  (function(){const b=document.getElementById('nt-dir'); if(b) b.checked=true;})();
  document.getElementById('nt-emotion').value='calm';

  // reset pre-trade checklist so the NEXT setup requires a fresh check (no sweep, no trade — per trade, not per day)
  preChecks[localDateStr()]={};
  savePreChecks();
  renderPreChecklist();

  toast(currentLang()==='en'?'✅ Trade saved':'✅ معامله ثبت شد');
  renderTodayTrades();
  updateDashboard();
  updateTradePyramidWarn();
}

function renderTodayTrades(){
  const today=localDateStr();
  const list=trades.filter(t=>t.date===today);
  const container=document.getElementById('today-trades-list');
  if(list.length===0){
    container.innerHTML=`<div class="empty-state"><div class="icon">💼</div><h3>${t('empty.noTrades')}</h3><p>${t('empty.noTradesHint')}</p></div>`;
    return;
  }
  container.innerHTML=list.map(tr=>{
    const badge=tr.dir==='BUY'?'badge-buy':'badge-sell';
    const resBadge=tr.result==='win'?'badge-win':tr.result==='loss'?'badge-loss':tr.result==='be'?'badge-wait':'badge-open';
    const resText=tr.result==='win'?t('result.win'):tr.result==='loss'?t('result.loss'):tr.result==='be'?t('result.be'):t('result.open');
    const pnlNum=parseFloat(tr.pnlUsd);
    const pnlColor=!isNaN(pnlNum) && pnlNum>0?'#3fb950':!isNaN(pnlNum) && pnlNum<0?'#f85149':'#8b949e';
    const emo=emoLabel(tr.emotion);
    const tags=tr.tags? tr.tags.split(',').map(x=>`<span class="tag-pill">${escapeHTML(x.trim())}</span>`).join(''):'';
    const copyLabel = t('form.copyToForm');
    return `<div class="trade-card">
      <div class="trade-card-header">
        <div class="trade-card-title"><span class="badge ${badge}">${tr.dir}</span><span class="mono">${escapeHTML(tr.pair)}</span></div>
        <span class="badge ${resBadge}">${resText}</span>
      </div>
      <div class="trade-card-meta">
        <span>Entry: <span class="mono">${escapeHTML(tr.entry)||'-'}</span></span>
        <span>SL: <span class="mono">${escapeHTML(tr.sl)||'-'}</span></span>
        <span>TP: <span class="mono">${escapeHTML(tr.tp)||'-'}</span></span>
        <span>R:R: <span class="mono">${escapeHTML(tr.rr)||'-'}</span></span>
        <span style="color:${pnlColor};font-weight:700;">P&L: <span class="mono">${tr.pnlUsd?((!isNaN(pnlNum) && pnlNum>0?'+$':'$')+escapeHTML(tr.pnlUsd)):'-'}</span></span>
        <span>${emo}</span>
      </div>
      ${(tr.setup||tr.liquidity||tr.poi)?`<div style="display:flex;gap:6px;flex-wrap:wrap;font-size:.7rem;">
        ${tr.setup?`<span class="tag-pill">🧬 ${escapeHTML(tr.setup)}</span>`:''}
        ${tr.liquidity?`<span class="tag-pill">💧 ${escapeHTML(tr.liquidity)}</span>`:''}
        ${tr.poi?`<span class="tag-pill">📍 ${escapeHTML(tr.poi)}</span>`:''}
        ${tr.timeZone?`<span class="tag-pill">🕐 ${escapeHTML(zoneLabel(tr.timeZone))}</span>`:''}
      </div>`:''}
      <div style="display:flex;gap:10px;font-size:.74rem;color:var(--text-dim);flex-wrap:wrap;">
        <span style="color:var(--cyan)">${t('cat.tech')}: ${tr.scoreTech}/100</span>
        <span style="color:var(--amber)">${t('cat.risk')}: ${tr.scoreRisk}/100</span>
        <span style="color:var(--purple)">${t('cat.mental')}: ${tr.scoreMental}/100</span>
        <span style="color:var(--green)">${t('cat.learning')}: ${tr.scoreLearning!==undefined?tr.scoreLearning:'-'}/100</span>
        ${tr.scoreExecution!==null&&tr.scoreExecution!==undefined?`<span style="color:#ff2d78">Exec: ${tr.scoreExecution}/100</span>`:''}
        ${tags}
      </div>
      <div class="trade-mini-bar">
        <div class="trade-mini-seg ${tr.scoreTech>=60?'on-tech':''}"></div>
        <div class="trade-mini-seg ${tr.scoreRisk>=60?'on-risk':''}"></div>
        <div class="trade-mini-seg ${tr.scoreMental>=60?'on-mental':''}"></div>
        <div class="trade-mini-seg ${tr.scoreLearning>=60?'on-learning':''}"></div>
      </div>
      ${tr.note?`<div style="font-size:.8rem;color:var(--text-dim);background:var(--panel-2);padding:8px 10px;border-radius:6px;">${escapeHTML(tr.note)}</div>`:''}
      <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
        <button class="btn btn-sm ${tr.result==='open'?'btn-primary':'btn-ghost'}" onclick="openResultModal('${tr.id}')">${tr.result==='open'?'✅ Result':'✏️ Edit'}</button>
        <button class="btn btn-sm btn-ghost" onclick="copyTradeById('${tr.id}')" title="Copy to form">${copyLabel}</button>
        <button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="deleteTrade('${tr.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function copyTradeById(id){
  const src = trades.find(t=>t.id===id);
  if(!src){ toast(currentLang()==='en'?'Trade not found':'معامله پیدا نشد','error'); return; }
  applyTradeForm({
    pair: src.pair || '',
    dir: src.dir || 'BUY',
    entry: src.entry || '',
    sl: src.sl || '',
    tp: src.tp || '',
    riskUsd: src.riskUsd || '',
    emotion: src.emotion || 'calm',
    style: src.style || 'dayTrading',
    exitType: src.exitType || 'liquidityBased',
    setup: src.setup || '',
    liquidity: src.liquidity || '',
    poi: src.poi || '',
    note: src.note || ''
  }, {showToast:true, toastMsg:currentLang()==='en'?'Copied — review the form and save':'کپی شد — فرم را بررسی و ثبت کن'});
  saveTradeDraft();
  // open trade form section
  const body = document.getElementById('body-trade');
  const toggle = document.getElementById('toggleTrade');
  if(body && !body.classList.contains('open')){
    body.classList.add('open');
    if(toggle) toggle.classList.add('open');
  }
  body && body.scrollIntoView({behavior:'smooth', block:'start'});
}

// v5.6: حذف معامله در زمان قفل ممنوع است — وگرنه با پاک کردن ضررها، Lockout دور زده می‌شود
function deleteTrade(id){
  if(isLockedOut() || isForcedStop()){
    toast(currentLang()==='en'?'🔴 Deleting trades is blocked while lockout is active — face the loss, do not erase it':'🔴 هنگام فعال بودن قفل، حذف معامله مجاز نیست — قانون: با ضرر روبه‌رو شو، آن را پاک نکن','error');
    return;
  }
  if(!confirm(currentLang()==='en'?'Are you sure?':'آیا مطمئنید؟'))return;
  trades=trades.filter(t=>t.id!==id);
  saveTrades();
  renderTodayTrades();
  updateDashboard();
  renderHistory();
}

