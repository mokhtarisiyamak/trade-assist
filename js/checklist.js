// ===== DYNAMIC CHECKLIST RENDER =====
function renderDailyChecklist(){
  const container=document.getElementById('daily-checklist-container');
  const cats={tech:t('cat.tech'),risk:t('cat.risk'),mental:t('cat.mental'),learning:t('cat.learning')};
  const colors={tech:'#39d0d8',risk:'#f0883e',mental:'#a371f7',learning:'#3fb950'};
  const today=localDateStr();
  const checks=dailyChecks[today]||{};
  let html='';
  for(const cat of ['mental','risk','tech','learning']){
    const items=settings.dailyItems.filter(i=>i.cat===cat);
    if(!items.length) continue;
    let checked=0;
    items.forEach(i=>{if(checks[i.id])checked++});
    const pct=Math.round((checked/items.length)*100);
    html+=`<div class="card" style="padding:14px;">
      <div class="checklist-section">
        <div class="checklist-header"><h4 style="color:${colors[cat]}">${cats[cat]}</h4><span class="checklist-progress">${checked}/${items.length}</span></div>
        <div class="checklist-bar"><div class="checklist-bar-fill" style="width:${pct}%;background:${colors[cat]}"></div></div>
        <ul class="checklist" data-layer="daily" data-cat="${cat}">
          ${items.map(i=>`<li><input type="checkbox" id="${i.id}" data-key="${i.id}" ${checks[i.id]?'checked':''} onchange="onDailyCheck(this)">
            <label for="${i.id}">${i.critical?'<span class="critical-star">★</span>':''}${escapeHTML(itemText(i))}</label>
            <span class="pts">+${i.pts}</span></li>`).join('')}
        </ul>
      </div>
    </div>`;
  }
  container.innerHTML=html;
}

// نوار «امتیاز شرایط»
function renderConditionScore(cs){
  const el=document.getElementById('condition-score-bar');
  if(!el) return;
  const colorVar = cs.total>=80?'var(--green)':cs.total>=50?'var(--amber)':'var(--red)';
  const R=50, C=2*Math.PI*R, off=C*(1-(cs.total/100));
  const en = currentLang()==='en';
  const statusMsg = cs.criticalMissed
    ? (en?'⚠️ Critical item missing — entry locked.':'⚠️ آیتم بحرانی جاافتاده — ورود قفل است.')
    : (cs.total>=80 ? (en?'✅ Full 2% risk allowed':( '✅ مجاز به ریسک کامل ۲٪'))
      : cs.total>=60 ? (en?'⚠️ Reduced risk only 1.2%':'⚠️ فقط ریسک کاهش‌یافته ۱.۲٪')
      : (en?'🔴 Entry blocked — score under 60':'🔴 ورود ممنوع — زیر ۶۰'));
  el.innerHTML=`
    <div style="display:flex;align-items:center;gap:18px;">
      <div class="ring-wrap" role="img" aria-label="${en?'Condition score':'امتیاز شرایط'} ${cs.total}/100">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle class="ring-track" cx="60" cy="60" r="${R}"></circle>
          <circle class="ring-fill" cx="60" cy="60" r="${R}" stroke="${colorVar}"
            stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"></circle>
        </svg>
        <div class="ring-num"><span class="val" style="color:${colorVar};">${cs.total}</span><span class="lbl">${en?'/100':'از ۱۰۰'}</span></div>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700;margin-bottom:6px;">📊 ${en?'Condition score':'امتیاز شرایط'}</div>
        <div style="font-size:.8rem;color:var(--text-dim);line-height:1.9;">
          ${en?'Morning checklist + pre-entry combined.':'ترکیب چک‌لیست صبحگاهی + قبل از ورود.'}<br>
          <span style="color:${cs.criticalMissed?'var(--red)':colorVar};font-weight:700">${statusMsg}</span>
        </div>
      </div>
    </div>`;
}

function renderPreChecklist(){
  const container=document.getElementById('pre-checklist-container');
  const today=localDateStr();
  const checks=preChecks[today]||{};
  const stageStatus=PRE_STAGES.map(s=>({key:s.key,complete:isPreStageComplete(s.key,checks)}));
  const en = currentLang()==='en';

  let html='';

  PRE_STAGES.forEach((stage,idx)=>{
    const status=stageStatus[idx];
    const items=settings.preItems.filter(i=>i.stage===stage.key);
    const stateIcon = status.complete ? '✅' : '▫️';
    const hint=getStageHint(stage.key);
    const opts = stageSelectOptions(stage) || stage.selectOptions || [];

    html+=`<div class="model-stage ${status.complete?'passed':''}" data-stage="${stage.key}">
      <div class="stage-head">
        <span class="title">${stateIcon} ${stage.icon} ${stageTitle(stage)}</span>
        <button type="button" class="btn-guide-link" onclick="goToGuide('${stage.guide}')" title="${en?'Guide':'راهنما'}">${en?'? Guide':'؟ راهنما'}</button>
      </div>
      ${hint?`<div class="stage-hint mono">${escapeHTML(hint)}</div>`:''}
      ${items.length?`<div class="stage-items">
        ${items.map(i=>`<label class="stage-item">
          <input type="checkbox" id="${i.id}" data-key="${i.id}" ${checks[i.id]?'checked':''} onchange="onPreCheck(this)">
          <span>${i.critical?'<span class="critical-star">★</span>':''}${escapeHTML(itemText(i))}</span>
          <span class="pts">+${i.pts}</span>
        </label>`).join('')}
      </div>`:''}
      ${stage.selectKey?`<div class="stage-select">
        <label class="stage-select-label">${stageSelectLabel(stage)}</label>
        <select data-key="${stage.selectKey}" onchange="onPreSelect(this)">
          ${opts.map(([v,l])=>`<option value="${escapeHTML(v)}" ${checks[stage.selectKey]===v?'selected':''}>${escapeHTML(l)}</option>`).join('')}
        </select>
      </div>`:''}
      ${stage.formFieldCheck?`<div class="stage-field-note ${status.complete?'ok':'warn'}">
        ${status.complete
          ? (en?'✓ Exit strategy selected in trade form':'✓ استراتژی خروج در فرم معامله انتخاب شده')
          : (en?'⚠ Select exit strategy in the trade form below first':'⚠ ابتدا «استراتژی خروج» را در فرم معامله (پایین‌تر) انتخاب کن')}
      </div>`:''}
    </div>`;
  });

  container.innerHTML=html;
  updateModelStatusBar();
}

function onDailyCheck(cb){
  const today=localDateStr();
  if(!dailyChecks[today]) dailyChecks[today]={};
  dailyChecks[today][cb.dataset.key]=cb.checked;
  saveDailyChecks();
  updateDashboard();
}

function onPreCheck(cb){
  const today=localDateStr();
  if(!preChecks[today]) preChecks[today]={};
  preChecks[today][cb.dataset.key]=cb.checked;
  savePreChecks();
  renderPreChecklist();
  updateDashboard();
}
function onPreSelect(sel){
  const today=localDateStr();
  if(!preChecks[today]) preChecks[today]={};
  preChecks[today][sel.dataset.key]=sel.value;
  savePreChecks();
  renderPreChecklist();
  updateDashboard();
}


// ===== SCORING =====
function calcDailyScore(){
  const today=localDateStr();
  const checks=dailyChecks[today]||{};
  const out={tech:0,risk:0,mental:0,learning:0};
  const cats=['tech','risk','mental','learning'];
  cats.forEach(cat=>{
    const items=settings.dailyItems.filter(i=>i.cat===cat);
    if(!items.length){out[cat]=0;return;}
    let totalPts=0, earnedPts=0;
    items.forEach(i=>{
      totalPts+=i.pts;
      if(checks[i.id]) earnedPts+=i.pts;
    });
    out[cat]=Math.round((earnedPts/totalPts)*100);
  });
  const activeCats=cats.filter(c=>settings.dailyItems.some(i=>i.cat===c));
  out.total=activeCats.length?Math.round(activeCats.reduce((s,c)=>s+out[c],0)/activeCats.length):0;
  const missedCritical=settings.dailyItems.some(i=>i.critical && !checks[i.id]);
  out.criticalMissed=missedCritical;
  return out;
}

// یک مرحله «کامل» است اگر همه‌ی آیتم‌های بحرانی‌اش تیک خورده باشند و (در صورت داشتن select اجباری) مقداری انتخاب شده باشد.
function isPreStageComplete(stageKey, checks){
  const stage=PRE_STAGES.find(s=>s.key===stageKey);
  if(!stage) return true;
  const criticalItems=settings.preItems.filter(i=>i.stage===stageKey && i.critical);
  const itemsOk=criticalItems.every(i=>checks[i.id]);
  let selectOk=true;
  if(stage.selectKey) selectOk = !!checks[stage.selectKey];
  // v5.6: optional chaining حذف شد (سازگاری Safari قدیمی)
  if(stage.formFieldCheck){ const ffEl=document.getElementById(stage.formFieldCheck); selectOk = !!(ffEl && ffEl.value); }
  return itemsOk && selectOk;
}

// v5.6: امتیازدهی قبل از ورود حالا وزنی است (مثل چک‌لیست صبحگاهی) — قبلاً فقط تعداد تیک شمرده می‌شد
// و میانگین دو سیستم ناسازگار، درصد ریسک مجاز را بی‌ثبات می‌کرد.
function calcPreTradeScore(){
  const today=localDateStr();
  const checks=preChecks[today]||{};
  const out={tech:0,risk:0,mental:0,learning:0};
  const cats=['tech','risk','mental','learning'];
  cats.forEach(cat=>{
    const items=settings.preItems.filter(i=>i.cat===cat);
    if(!items.length){out[cat]=0;return;}
    let totalPts=0, earnedPts=0;
    items.forEach(i=>{
      totalPts+=i.pts;
      if(checks[i.id]) earnedPts+=i.pts;
    });
    out[cat]=Math.round((earnedPts/totalPts)*100);
  });
  const activeCats=cats.filter(c=>settings.preItems.some(i=>i.cat===c));
  out.total=activeCats.length?Math.round(activeCats.reduce((s,c)=>s+out[c],0)/activeCats.length):0;
  out.criticalMissed=PRE_STAGES.some(s=>!isPreStageComplete(s.key, checks));
  return out;
}

function calcCombinedScore(){
  const ds=calcDailyScore();
  const ps=calcPreTradeScore();
  const out={
    tech: Math.round((ds.tech + ps.tech) / 2),
    risk: Math.round((ds.risk + ps.risk) / 2),
    mental: Math.round((ds.mental + ps.mental) / 2),
    learning: Math.round((ds.learning + ps.learning) / 2),
    total: Math.round((ds.total + ps.total) / 2),
    criticalMissed: ds.criticalMissed || ps.criticalMissed
  };
  return out;
}

// Execution Score: retrospective, computed per-trade from Post-Trade Checklist answers.
// Distinct from Technical (was the analysis correct?) — Execution asks: did you follow the plan mechanically?
function calcExecutionScore(trade){
  if(!trade || !trade.postTrade || trade.result==='open') return null;
  const pt=trade.postTrade;
  let violations=0;
  if(pt.q1==='yes') violations++;
  if(pt.q2==='yes') violations++;
  if(pt.q3==='yes') violations++;
  return Math.round(100 - (violations*(100/3)));
}

function getRiskPercent(combinedTotal, criticalMissed){
  if(criticalMissed) return 0;
  if(combinedTotal>=80) return 2;
  if(combinedTotal>=60) return 1.2;
  return 0;
}

function getScoreColor(val){
  if(val>=80) return '#3fb950';
  if(val>=60) return '#f0883e';
  return '#f85149';
}

// ===== RADAR UPDATE =====
