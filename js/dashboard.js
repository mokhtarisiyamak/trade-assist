// ===== DASHBOARD =====
function checkWeeklyMonthlyDrawdown(){
  const box=document.getElementById('macro-risk-warn');
  if(!box) return;
  const en=currentLang()==='en';
  const bal=parseFloat(settings.startingBalance)||10000;
  const today=new Date();
  const weekFrom=new Date(today); weekFrom.setDate(weekFrom.getDate()-6);
  const monthFrom=new Date(today); monthFrom.setDate(monthFrom.getDate()-29);
  const weekFromStr=localDateStr(weekFrom), monthFromStr=localDateStr(monthFrom), todayStr=localDateStr(today);
  const weekPnl=trades.filter(t=>t.date>=weekFromStr&&t.date<=todayStr).reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
  const monthPnl=trades.filter(t=>t.date>=monthFromStr&&t.date<=todayStr).reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
  if(monthPnl < -bal*0.10){
    box.innerHTML= en
      ? `<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">🚨</span><div class="coach-alert-text"><div class="coach-alert-title">Monthly stop is active</div><div class="coach-alert-body">Cumulative 30-day loss exceeded 10% of capital (${monthPnl.toFixed(2)}$). Per rule, stop trading and review the whole system — not just execution.</div></div></div>`
      : `<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">🚨</span><div class="coach-alert-text"><div class="coach-alert-title">توقف ماهانه فعال است</div><div class="coach-alert-body">ضرر انباشته‌ی ۳۰ روز اخیر از ۱۰٪ سرمایه عبور کرده (${monthPnl.toFixed(2)}$). طبق قانون، معامله متوقف و کل سیستم باید بازبینی شود — نه فقط اجرا.</div></div></div>`;
  } else if(weekPnl < -bal*0.06){
    box.innerHTML= en
      ? `<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">🚨</span><div class="coach-alert-text"><div class="coach-alert-title">Weekly stop is active</div><div class="coach-alert-body">Cumulative 7-day loss exceeded 6% of capital (${weekPnl.toFixed(2)}$). Per rule, do not trade until next week starts.</div></div></div>`
      : `<div class="coach-alert coach-alert-bad"><span class="coach-alert-icon">🚨</span><div class="coach-alert-text"><div class="coach-alert-title">توقف هفتگی فعال است</div><div class="coach-alert-body">ضرر انباشته‌ی ۷ روز اخیر از ۶٪ سرمایه عبور کرده (${weekPnl.toFixed(2)}$). طبق قانون، تا شروع هفته‌ی بعد معامله نکن.</div></div></div>`;
  } else {
    box.innerHTML='';
  }
}
function updateDashboard(){
  renderDailyChecklist();
  renderPreChecklist();
  checkWeeklyMonthlyDrawdown();
  renderConsistencyCheck();
  renderDayLossMeter();      // v5.8
  renderFocusDrillBanner();  // v5.8
  renderFailurePatternWarn();// v5.8
  const cs=calcCombinedScore();
  const rp=getRiskPercent(cs.total, cs.criticalMissed);
  renderConditionScore(cs);

  const cb=document.getElementById('contractBanner');
  const ct=document.getElementById('contractText');
  if(settings.contract && settings.contractAccepted){
    cb.style.display='block'; ct.textContent=contractText();
  } else { cb.style.display='none'; }

  const en = currentLang()==='en';
  const btnSave=document.getElementById('btn-save-trade');
  if(isLockedOut()){
    if(btnSave){btnSave.disabled=true; btnSave.style.opacity='0.5'; btnSave.textContent=en?'🔒 Locked (2 losses today)':'🔒 قفل شده (۲ ضرر امروز)';}
  } else {
    if(btnSave && !isForcedStop()){btnSave.disabled=false; btnSave.style.opacity='1'; btnSave.textContent=t('form.save');}
  }

  const fsb=document.getElementById('forcedStopBanner');
  if(isForcedStop()){
    if(fsb) fsb.style.display='block';
    const left=Math.ceil((forcedStopEnd-Date.now())/1000);
    const hh=Math.floor(left/3600), mm=Math.floor((left%3600)/60), ss=left%60;
    const ft=document.getElementById('forcedTimer');
    if(ft) ft.textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    if(btnSave){btnSave.disabled=true; btnSave.style.opacity='0.5';}
  } else {
    if(fsb) fsb.style.display='none';
    if(!isLockedOut() && btnSave){btnSave.disabled=false; btnSave.style.opacity='1';}
  }

  const navScore=document.getElementById('nav-score');
  if(navScore){
    navScore.textContent=cs.total;
    navScore.style.background=getScoreColor(cs.total);
    navScore.style.color=cs.total>=50?'#000':'#fff';
  }
  const navTrades=document.getElementById('nav-trades');
  if(navTrades) navTrades.textContent=trades.filter(t=>t.date===localDateStr()).length;

  const arField=document.getElementById('nt-allowed-risk');
  if(arField){
    if(rp===0) arField.value=en?'Entry blocked':'ورود ممنوع';
    else arField.value = en
      ? `${rp}% allowed (Probe ${(rp/3).toFixed(1)}% + Confirmation ${(rp*2/3).toFixed(1)}%)`
      : `${rp}٪ ریسک مجاز (Probe ${(rp/3).toFixed(1)}٪ + Confirmation ${(rp*2/3).toFixed(1)}٪)`;
  }

  updateAutoJournalScore();
}

// ===== Auto-computed end-of-day journal score =====
function updateAutoJournalScore(){
  const techEl=document.getElementById('j-auto-tech');
  if(!techEl) return; // journal section not in DOM (shouldn't happen, but safe)

  const cs=calcCombinedScore();
  let tech=cs.tech!==undefined?cs.tech:cs.total;
  let risk=cs.risk!==undefined?cs.risk:cs.total;
  let mental=cs.mental!==undefined?cs.mental:cs.total;
  let learning=cs.learning!==undefined?cs.learning:cs.total;

  const today=localDateStr();
  const todayTrades=trades.filter(t=>t.date===today);

  if(todayTrades.length>0){
    const avg=(key)=>todayTrades.reduce((s,t)=>s+(parseFloat(t[key])||0),0)/todayTrades.length;
    tech = tech*0.4 + avg('scoreTech')*0.6;
    risk = risk*0.4 + avg('scoreRisk')*0.6;
    mental = mental*0.4 + avg('scoreMental')*0.6;
    learning = learning*0.4 + avg('scoreLearning')*0.6;
  }

  const revengeSel=document.getElementById('j-revenge');
  const deviateSel=document.getElementById('j-deviate');
  if(revengeSel && revengeSel.value==='yes') risk-=30;
  if(deviateSel && deviateSel.value==='yes') risk-=20;

  const fomoCount=todayTrades.filter(t=>IMPULSIVE_EMOTIONS.includes(t.emotion)).length;
  if(fomoCount>0) mental-=Math.min(30, fomoCount*15);

  const violationCount=todayTrades.filter(t=>t.postTrade && (t.postTrade.q1==='yes'||t.postTrade.q2==='yes'||t.postTrade.q3==='yes'));
  if(violationCount.length>0) risk-=Math.min(30, violationCount.length*15);

  tech=Math.max(0,Math.min(100,Math.round(tech)));
  risk=Math.max(0,Math.min(100,Math.round(risk)));
  mental=Math.max(0,Math.min(100,Math.round(mental)));
  learning=Math.max(0,Math.min(100,Math.round(learning)));

  const closedToday=todayTrades.filter(t=>t.scoreExecution!==undefined && t.scoreExecution!==null);
  const avgExecution = closedToday.length ? Math.round(closedToday.reduce((s,t)=>s+parseFloat(t.scoreExecution),0)/closedToday.length) : null;

  techEl.textContent=tech;
  techEl.style.color=getScoreColor(tech);
  const riskEl=document.getElementById('j-auto-risk');
  const mentalEl=document.getElementById('j-auto-mental');
  const learningEl=document.getElementById('j-auto-learning');
  const execEl=document.getElementById('j-auto-execution');
  if(riskEl){riskEl.textContent=risk; riskEl.style.color=getScoreColor(risk);}
  if(mentalEl){mentalEl.textContent=mental; mentalEl.style.color=getScoreColor(mental);}
  if(learningEl){learningEl.textContent=learning; learningEl.style.color=getScoreColor(learning);}
  if(execEl){execEl.textContent=avgExecution!==null?avgExecution:'—'; if(avgExecution!==null) execEl.style.color=getScoreColor(avgExecution);}

  window._autoJournalScore={tech,risk,mental,learning,execution:avgExecution};
}

