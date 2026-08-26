// ===== LOCKOUT & FORCED STOP =====
function isLockedOut(){
  const today=localDateStr();
  const todayLosses=trades.filter(t=>t.date===today && t.result==='loss').length;
  return todayLosses>=2;
}
function isForcedStop(){
  return Date.now() < forcedStopEnd;
}
function startForcedStop(){
  forcedStopEnd = Date.now() + 2*60*60*1000; // 2 hours — matches guide's physical-barrier rule (every loss/BE)
  try{ localStorage.setItem('tbc_v4_forced_stop_end', String(forcedStopEnd)); }catch(e){} // v5.6: persist across refresh
  if(forcedTimerInterval) clearInterval(forcedTimerInterval);
  forcedTimerInterval = setInterval(()=>{
    if(!isForcedStop()){
      clearInterval(forcedTimerInterval);
      forcedTimerInterval=null;
      updateDashboard();
      return;
    }
    const left=Math.ceil((forcedStopEnd-Date.now())/1000);
    const hh=Math.floor(left/3600), mm=Math.floor((left%3600)/60), ss=left%60;
    const timerEl=document.getElementById('forcedTimer');
    if(timerEl) timerEl.textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }, 1000);
  updateDashboard();
}

// v5.6: بعد از رفرش، اگر قفل هنوز فعال است تایمر شمارش معکوس را از سر بگیر (بدون ریست شدن زمان)
function resumeForcedStopIfNeeded(){
  if(!isForcedStop()) return;
  updateDashboard();
  if(forcedTimerInterval) clearInterval(forcedTimerInterval);
  forcedTimerInterval = setInterval(()=>{
    if(!isForcedStop()){
      clearInterval(forcedTimerInterval);
      forcedTimerInterval=null;
      try{ localStorage.removeItem('tbc_v4_forced_stop_end'); }catch(e){}
      updateDashboard();
      return;
    }
    const left=Math.ceil((forcedStopEnd-Date.now())/1000);
    const hh=Math.floor(left/3600), mm=Math.floor((left%3600)/60), ss=left%60;
    const timerEl=document.getElementById('forcedTimer');
    if(timerEl) timerEl.textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }, 1000);
}

// ===== CORRELATED RISK =====
function checkCorrelatedRisk(){
  const pair=document.getElementById('nt-pair').value.trim().toUpperCase().replace('/','');
  const box=document.getElementById('correlated-warn');
  if(!pair || !CORRELATIONS[pair]){ box.innerHTML=''; return; }
  const today=localDateStr();
  const openPairs=trades.filter(t=>t.date===today && t.result==='open').map(t=>t.pair.replace('/',''));
  const correlated=CORRELATIONS[pair].filter(p=>openPairs.includes(p));
  if(correlated.length){
    const en=currentLang()==='en';
    const join=en?', ':' و ';
    box.innerHTML= en
      ? `<div class="coach-alert coach-alert-warn" style="margin:0;"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-title">Correlated risk</div><div class="coach-alert-body">You already have open position(s) on ${correlated.map(escapeHTML).join(join)}. Entering ${escapeHTML(pair)} adds cumulative risk.</div></div></div>`
      : `<div class="coach-alert coach-alert-warn" style="margin:0;"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-title">ریسک همبسته</div><div class="coach-alert-body">امروز روی ${correlated.map(escapeHTML).join(' و ')} پوزیشن باز داری. ورود روی ${escapeHTML(pair)} ریسک تجمعی ایجاد می‌کند.</div></div></div>`;
  } else { box.innerHTML=''; }
}

// ===== STREAK TRACKER =====
// ===== CONTRACT =====
function showContractIfNeeded(){
  if(!settings.langChosen) return; // language first
  if(!settings.contractAccepted){
    const el=document.getElementById('contractModalText');
    if(el) el.textContent='«'+contractText()+'»';
    document.getElementById('contractModal').classList.add('active');
  }
}
function acceptContract(){
  if(!document.getElementById('contract-agree').checked){
    toast(currentLang()==='en'?'Tick the acceptance checkbox first':'ابتدا تیک پذیرش را بزنید','error'); return;
  }
  settings.contractAccepted=true;
  saveSettings();
  document.getElementById('contractModal').classList.remove('active');
  updateDashboard();
}
function saveContract(){
  const v=document.getElementById('contract-input').value.trim();
  if(typeof settings.contract !== 'object' || settings.contract===null){
    const old = typeof settings.contract==='string' ? settings.contract : '';
    settings.contract = {fa:old, en:old};
  }
  settings.contract[currentLang()==='en'?'en':'fa']=v;
  saveSettings();
  toast(currentLang()==='en'?'Contract saved':'قرارداد ذخیره شد');
  updateDashboard();
}
// v6.1: from contract modal → settings
function goEditContract(){
  document.getElementById('contractModal').classList.remove('active');
  // temporarily mark accepted so modal does not immediately reappear
  settings.contractAccepted = true;
  saveSettings();
  const settingsBtn = document.querySelector('[data-page="settings"]');
  if(settingsBtn) settingsBtn.click();
  setTimeout(()=>{
    const ta = document.getElementById('contract-input');
    if(ta){ ta.scrollIntoView({behavior:'smooth', block:'center'}); ta.focus(); }
  }, 200);
  toast(currentLang()==='en'?'Edit the contract, then save':'قرارداد را ویرایش و ذخیره کن');
}
function saveAccountBalance(){
  const v=parseFloat(document.getElementById('account-balance-input').value);
  settings.startingBalance = (!isNaN(v) && v>0) ? v : 10000;
  saveSettings();
  toast(currentLang()==='en'?'✅ Account balance saved':'✅ موجودی حساب ذخیره شد');
  drawPerformancePage();
}
// v5.8: حد ضرر روزانه ٪ی — گیت دوم مستقل از قفل ۲ ضرر
function saveDailyLossCap(){
  const v=parseFloat(document.getElementById('daily-loss-cap-input').value);
  settings.dailyLossCapPercent = (!isNaN(v) && v>=0.5 && v<=20) ? v : 2;
  saveSettings();
  toast(currentLang()==='en'?'✅ Daily loss cap: '+settings.dailyLossCapPercent+'%':'✅ حد ضرر روزانه: '+settings.dailyLossCapPercent+'٪');
  updateDashboard();
}
function getTodayClosedPnl(){
  const today=localDateStr();
  return trades.filter(t=>t.date===today && t.result!=='open').reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
}
function isDailyLossBreached(){
  const bal=parseFloat(settings.startingBalance)||10000;
  const capPct=parseFloat(settings.dailyLossCapPercent)||2;
  return getTodayClosedPnl() <= -(bal*capPct/100);
}
// v5.8: متر روز — پنل مصرف حد ضرر روزانه
function renderDayLossMeter(){
  const box=document.getElementById('day-loss-meter');
  if(!box) return;
  const bal=parseFloat(settings.startingBalance)||10000;
  const capPct=parseFloat(settings.dailyLossCapPercent)||2;
  const pnl=getTodayClosedPnl();
  const limit=bal*capPct/100;
  const used=Math.min(Math.max(-pnl/limit,0),9.99);
  const en=currentLang()==='en';
  if(pnl>=0){
    box.className='day-loss-meter';
    box.innerHTML= en
      ? `💚 Today: <span class="mono">${pnl>=0?'+$':'$'}${pnl.toFixed(2)}</span> — daily loss cap $${limit.toFixed(2)} (${capPct}%) untouched`
      : `💚 امروز: <span class="mono">${pnl>=0?'+$':'$'}${pnl.toFixed(2)}</span> — سقف ضرر روز $${limit.toFixed(2)} (${capPct}٪) دست‌نخورده`;
  } else {
    const pctUsed=Math.round(used*100);
    const cls = used>=1 ? 'danger' : used>=0.5 ? 'warn' : '';
    box.className='day-loss-meter '+cls;
    if(used>=1){
      box.innerHTML = en
        ? `🛑 Today: <span class="mono">$${pnl.toFixed(2)}</span> — loss cap (${capPct}%) hit. New trades locked until tomorrow.`
        : `🛑 امروز: <span class="mono">$${pnl.toFixed(2)}</span> — سقف ضرر (${capPct}٪) پر شد. ثبت معامله تا فردا بسته است.`;
    } else {
      box.innerHTML = en
        ? `🟠 Today: <span class="mono">-$${Math.abs(pnl).toFixed(2)}</span> of cap $${limit.toFixed(2)} (${pctUsed}% used) — remaining $${(limit+pnl).toFixed(2)}`
        : `🟠 امروز: <span class="mono">-$${Math.abs(pnl).toFixed(2)}</span> از سقف ضرر $${limit.toFixed(2)} (${pctUsed}٪ مصرف) — باقی‌مانده $${(limit+pnl).toFixed(2)}`;
    }
  }
}
// v5.8: آزمون هفتگی — سؤال تصادفی از بانک سؤال
const QUIZ_BANK=[
 {q:'کدام یک Sweep معتبر است؟',qEn:'Which one is a valid Sweep?',
  opts:['فتیله زیر Low و Close برگشت داخل رنج','بدنه‌ی کندل کاملاً زیر Low بسته شد','قیمت به Low نزدیک شد ولی نگشت'],
  optsEn:['Wick below Low and close back inside the range','Candle body fully closed below Low','Price approached Low but did not reverse'],a:0,
  why:'Sweep = راندن استاپ‌ها + برگشت Close داخل رنج. Close بیرون = Breakout.',
  whyEn:'Sweep = stop run + close back inside the range. Close outside = Breakout.',lesson:'g-liq'},
 {q:'CHoCH کی تأیید می‌شود؟',qEn:'When is CHoCH confirmed?',
  opts:['با فتیله خلاف روند','با اولین Close بدنه‌دار خلاف جهت آخرین حرکت','با شکست عدد رند'],
  optsEn:['With a wick against the trend','With the first body close against the latest move','With a break of a round number'],a:1,
  why:'CHoCH نیازمند Close است، نه فتیله؛ حداقل M5 در این مدل.',
  whyEn:'CHoCH requires a close, not a wick; minimum M5 in this model.',lesson:'g-bias'},
 {q:'در روز رنج (Equal H/L) چه اجازه داری؟',qEn:'On a range day (Equal H/L), what are you allowed to do?',
  opts:['فقط ادامه‌رونده','خرید در High رنج','Sweep لبه‌ها به سمت داخل — هر دو جهت'],
  optsEn:['Continuation only','Buy at range high','Sweep the edges back inside — either direction'],a:2,
  why:'رنج = نقدینگی دو طرف لبه جمع می‌شود؛ هدف، برگشت از لبه است.',
  whyEn:'Range = liquidity pools at both edges; the goal is a reversal from the edge.',lesson:'g-bias'},
 {q:'Judas Swing یعنی؟',qEn:'What is a Judas Swing?',
  opts:['حرکت قلابی ابتدای سشن خلاف جهت روز','پولبک عمیق وسط روز','شکست دوم PDH'],
  optsEn:['Session-open fake move against the day direction','Deep midday pullback','Second break of PDH'],a:0,
  why:'قلاب ۳۰–۹۰ دقیقه اول سشن؛ ورود واقعی خلاف جهت آن.',
  whyEn:'Trap in the first 30–90 minutes of the session; real entry is against that move.',lesson:'g-model'},
 {q:'ریسک مجاز امروز با امتیاز ۶۵ چقدر است؟',qEn:'With a score of 65, what is today\'s allowed risk?',
  opts:['۲٪','۱.۲٪','۰٪'],optsEn:['2%','1.2%','0%'],a:1,
  why:'زیر ۸۰ = ریسک کاهش‌یافته ۱.۵٪؛ زیر ۵۰ یا جاافتادن آیتم بحرانی = ممنوع.',
  whyEn:'Under 80 = reduced risk 1.2%; under 50 or missing critical item = blocked.',lesson:'g-model'},
 {q:'POI تازه کدام است؟',qEn:'Which is a fresh POI?',
  opts:['OB مربوط به حرکت هفته قبل','OB آخرین ایمپالس قبل از Sweep','هر FVG روی چارت H4'],
  optsEn:['OB from last week\'s move','OB of the last impulse before the Sweep','Any FVG on the H4 chart'],a:1,
  why:'POI باید از آخرین حرکت ایمپالسیو باشد تا سفارشی در آن مانده باشد.',
  whyEn:'POI must come from the latest impulsive move so orders remain there.',lesson:'g-poi'}
];
function quizQ(item){ return currentLang()==='en' ? (item.qEn||item.q) : item.q; }
function quizOpts(item){ return currentLang()==='en' && item.optsEn ? item.optsEn : item.opts; }
function quizWhy(item){ return currentLang()==='en' ? (item.whyEn||item.why) : item.why; }
function renderQuiz(){
  const box=document.getElementById('quiz-container');
  if(!box) return;
  const item=QUIZ_BANK[Math.floor(Math.random()*QUIZ_BANK.length)];
  window._curQuiz=item;
  const opts=quizOpts(item);
  box.innerHTML=`<div class="quiz-q"><strong>${escapeHTML(quizQ(item))}</strong>
    ${opts.map((o,i)=>`<button type="button" class="btn btn-ghost quiz-opt" onclick="answerQuiz(${i})">${escapeHTML(o)}</button>`).join('')}
    <div class="quiz-fb" id="quiz-fb"></div></div>`;
}
function answerQuiz(i){
  const item=window._curQuiz; if(!item) return;
  const fb=document.getElementById('quiz-fb'); if(!fb) return;
  const btns=document.querySelectorAll('#quiz-container .quiz-opt');
  btns.forEach((b,idx)=>{ if(idx===item.a)b.classList.add('correct'); else if(idx===i)b.classList.add('wrong'); });
  const en=currentLang()==='en';
  fb.innerHTML = i===item.a
    ? (en?'✅ Correct! ':'✅ درست! ')+escapeHTML(quizWhy(item))
    : '❌ '+escapeHTML(quizWhy(item))+' — <a href="#" data-lesson="'+item.lesson+'" id="quiz-lesson-link" style="color:var(--cyan);">'+(en?'Go to related lesson':'برو به درس مربوطه')+'</a>';
  const link=document.getElementById('quiz-lesson-link');
  if(link) link.onclick=function(ev){ ev.preventDefault(); goToGuide(item.lesson); return false; };
}
// v5.8: هشدار زنده‌ی تناقض بایاس زیر فرم معامله
function renderBiasConflictWarn(){
  const box=document.getElementById('nt-bias-warn');
  if(!box) return;
  const bias=(preChecks[localDateStr()]||{})['_bias'];
  const checked=document.querySelector('input[name="nt-dir"]:checked');
  const dir=checked?checked.value:null;
  if(!bias || !dir){ box.innerHTML=''; return; }
  const conflict = (bias==='trendUp' && dir==='SELL') || (bias==='trendDown' && dir==='BUY');
  if(conflict){
    const en=currentLang()==='en';
    const fa = bias==='trendUp'?(en?'bullish':'صعودی'):(en?'bearish':'نزولی');
    box.innerHTML= en
      ? '<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-body">Today\'s bias is «'+fa+'» but you selected '+dir+' — if this is a real reversal, update the morning bias.</div></div></div>'
      : '<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">⚠️</span><div class="coach-alert-text"><div class="coach-alert-body">بایاس امروز «'+fa+'» ثبت شده ولی '+dir+' انتخاب کرده‌ای — اگر واقعاً برگشت گرفته‌ای، بایاس صبح را به‌روز کن.</div></div></div>';
  } else {
    box.innerHTML='';
  }
}
// v5.8: پلن سشن صبحگاهی — ذخیره روزانه
function saveSessionPlan(){
  const today=localDateStr();
  const el=document.getElementById('session-plan-input');
  if(!el) return;
  if(!dailyChecks[today]) dailyChecks[today]={};
  dailyChecks[today]['_sessionPlan']=el.value.trim();
  saveDailyChecks();
}
function loadSessionPlan(){
  const el=document.getElementById('session-plan-input');
  if(!el) return;
  const today=localDateStr();
  el.value=(dailyChecks[today]||{})['_sessionPlan']||'';
}
// v5.8: بنر تمرین تمرکزی هفته (از آخرین بازبینی هفتگی)
function renderFocusDrillBanner(){
  const el=document.getElementById('focus-drill-banner');
  if(!el) return;
  const lastW=(weeklyReviews&&weeklyReviews[0])||null;
  if(!lastW || !lastW.drill){ el.innerHTML=''; return; }
  el.innerHTML= currentLang()==='en'
    ? `<div class="focus-drill">🎯 <strong>This week's drill:</strong> ${escapeHTML(lastW.drill)}</div>`
    : `<div class="focus-drill">🎯 <strong>تمرین این هفته:</strong> ${escapeHTML(lastW.drill)}</div>`;
}
// v5.8: الگوی خرابی شخصی — تشخیص «ضرر بعد از برد بزرگ» و «اولین معامله صبح»
function renderFailurePatternWarn(){
  const el=document.getElementById('failure-pattern-warn');
  if(!el) return;
  el.innerHTML='';
  const closed=trades.filter(t=>t.result==='win'||t.result==='loss').slice().sort((a,b)=>a.createdAt-b.createdAt);
  if(closed.length<4) return;
  const en=currentLang()==='en';
  const msgs=[];
  for(let i=1;i<closed.length;i++){
    const prev=closed[i-1], cur=closed[i];
    const rPrev=calcRealR(prev);
    if(prev.result==='win' && cur.result==='loss' && rPrev!==null && rPrev>=1.5){
      msgs.push(en
        ? '⚡ Pattern: losses often follow a large win (≥1.5R) — possible overconfidence after a win.'
        : '⚡ الگوی دیده‌شده: ضررها اغلب درست بعد از یک برد بزرگ (≥۱.۵R) می‌آیند — احتمال Overconfidence بعد از Win.');
      break;
    }
  }
  const last2=closed.slice(-2);
  if(last2.length===2 && last2.every(t=>t.result==='loss') && trades.some(t=>t.result==='open')){
    msgs.push(en
      ? '🚫 Last two trades were losses in a row — is the current open trade outside the model?'
      : '🚫 دو ضرر آخر پشت‌سرهم بوده — معامله باز فعلی خارج از مدل است؟');
  }
  const recent=closed.slice(-3).filter(t=>IMPULSIVE_EMOTIONS.includes(t.emotion));
  if(recent.length>=2){
    const emos=recent.map(t=>emoLabel(t.emotion)).join(en?', ':'، ');
    msgs.push(en
      ? `🧠 ${recent.length} of the last 3 entries used impulsive emotion (${emos}).`
      : `🧠 ${recent.length} از ۳ ورود اخیر با احساس تکانشی (${emos}) ثبت شده.`);
  }
  if(msgs.length){
    el.innerHTML=msgs.map(m=>`<div class="coach-alert coach-alert-bad" style="margin-bottom:8px;"><span class="coach-alert-icon">🧭</span><div class="coach-alert-text"><div class="coach-alert-body">${m}</div></div></div>`).join('');
  }
}
function renderConsistencyCheck(){
  const box=document.getElementById('consistency-live');
  if(!box) return;
  const en=currentLang()==='en';
  const cap=parseFloat(settings.consistencyCapPercent)||30;
  const closed=trades.filter(t=>t.result==='win'||t.result==='loss'||t.result==='be');
  const totalPnl=closed.reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
  if(closed.length===0 || totalPnl<=0){
    box.innerHTML=en
      ? '<p style="color:var(--text-faint);font-size:.8rem;">No accumulated profit yet to compute this rule.</p>'
      : '<p style="color:var(--text-faint);font-size:.8rem;">هنوز سود انباشته‌ای برای محاسبه‌ی این قانون وجود ندارد.</p>';
    return;
  }
  const dayMap={};
  closed.forEach(t=>{ dayMap[t.date]=(dayMap[t.date]||0)+(parseFloat(t.pnlUsd)||0); });
  let bestDay=null, bestDayPnl=-Infinity; let worstDay=null, worstDayPnl=Infinity;
  Object.entries(dayMap).forEach(([d,p])=>{
    if(p>bestDayPnl){bestDayPnl=p; bestDay=d;}
    if(p<worstDayPnl){worstDayPnl=p; worstDay=d;}
  });
  const totalLoss=Object.values(dayMap).filter(p=>p<0).reduce((s,p)=>s+p,0);
  const lossRatio = (totalLoss<0 && worstDayPnl<0) ? Math.round(Math.abs(worstDayPnl/totalLoss)*100) : null;
  const ratio=(bestDayPnl/totalPnl)*100;
  const violated=ratio>cap;
  const newTarget=violated ? (bestDayPnl/(cap/100)) : null;
  if(en){
    box.innerHTML=`<div class="callout ${violated?'callout-sell':'callout-buy'}">
      <strong class="head">${violated?'⚠️ Violated':'✅ Respected'}</strong>
      <p>Biggest day: <span class="mono">${bestDay}</span> at ${bestDayPnl>=0?'+$':'$'}${bestDayPnl.toFixed(2)} — <strong>${ratio.toFixed(0)}%</strong> of total accumulated profit (your cap: ${cap}%).${violated?` New target by formula: <strong>$${newTarget.toFixed(2)}</strong>.`:''}${lossRatio!==null?` <br><span style="font-size:.75rem;color:${lossRatio>50?'var(--red)':'var(--text-dim)'};">Loss mirror: worst day (<span class="mono">${worstDay}</span>) is ${lossRatio}% of total accumulated losses${lossRatio>50?' — blowout-day pattern!':''}.</span>`:''}</p>
    </div>`;
  } else {
    box.innerHTML=`<div class="callout ${violated?'callout-sell':'callout-buy'}">
      <strong class="head">${violated?'⚠️ نقض شده':'✅ رعایت شده'}</strong>
      <p>بزرگ‌ترین روز: <span class="mono">${bestDay}</span> با ${bestDayPnl>=0?'+$':'$'}${bestDayPnl.toFixed(2)} — معادل <strong>${ratio.toFixed(0)}٪</strong> از کل سود انباشته (سقف شما: ${cap}٪).${violated?` هدف جدید طبق فرمول: <strong>$${newTarget.toFixed(2)}</strong>.`:''}${lossRatio!==null?` <br><span style="font-size:.75rem;color:${lossRatio>50?'var(--red)':'var(--text-dim)'};">قرینه‌ی ضرر: بدترین روز (<span class="mono">${worstDay}</span>) ${lossRatio}٪ از کل ضرر انباشته است${lossRatio>50?' — الگوی روزهای Blowout!':''}.</span>`:''}</p>
    </div>`;
  }
}

