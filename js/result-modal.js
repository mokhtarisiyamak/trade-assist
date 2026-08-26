// ===== RESULT MODAL =====
function openResultModal(id){
  editingResultId=id;
  const t=trades.find(x=>x.id===id);
  if(!t)return;
  document.getElementById('res-id').value=id;
  document.getElementById('res-result').value=t.result||'open';
  document.getElementById('res-pnl').value=t.pnlUsd||'';
  document.getElementById('res-note').value=t.resNote||'';
  document.getElementById('res-tags').value=t.tags||'';
  const pt=t.postTrade||{};
  document.getElementById('pt-q1').value=pt.q1||'no';
  document.getElementById('pt-q2').value=pt.q2||'no';
  document.getElementById('pt-q3').value=pt.q3||'no';
  toggleResFields();
  document.getElementById('resultModal').classList.add('active');
}
function closeResultModal(){document.getElementById('resultModal').classList.remove('active');editingResultId=null;}
function toggleResFields(){
  const result=document.getElementById('res-result').value;
  const pnlGroup=document.getElementById('res-pnl').closest('.form-group');
  if(pnlGroup) pnlGroup.style.display = (result==='open') ? 'none' : 'block';
}
function saveResult(){
  const id=document.getElementById('res-id').value;
  const idx=trades.findIndex(t=>t.id===id);
  if(idx===-1)return;
  const result=document.getElementById('res-result').value;
  trades[idx].result=result;
  // v5.8: زمان بستن معامله — برای تحلیل «سریع vs کند» و مدت نگهداری
  if(result!=='open' && !trades[idx].closedAt) trades[idx].closedAt=Date.now();
  if(result==='open') trades[idx].closedAt=null;
  trades[idx].pnlUsd=document.getElementById('res-pnl').value;
  const resNoteVal=document.getElementById('res-note').value.trim();
  trades[idx].resNote=resNoteVal;
  trades[idx].tags=document.getElementById('res-tags').value.trim();
  trades[idx].postTrade={
    q1:document.getElementById('pt-q1').value,
    q2:document.getElementById('pt-q2').value,
    q3:document.getElementById('pt-q3').value
  };

  // v5.6: اگر نتیجه ضرر شد و ریسک دلاری پلن ثبت نشده بود، از |P&L| به عنوان 1R استفاده کن
  if((result==='loss') && !(parseFloat(trades[idx].riskUsd)>0)){
    const lossAmt=Math.abs(parseFloat(document.getElementById('res-pnl').value)||0);
    if(lossAmt>0) trades[idx].riskUsd=lossAmt.toFixed(2);
  }

  // Execution Score: retrospective — did you follow the plan mechanically?
  trades[idx].scoreExecution=calcExecutionScore(trades[idx]);

  // v5.6: Learning Score همیشه از مقدار پایه‌ی لحظه‌ی ثبت معامله محاسبه می‌شود
  // (قبلاً هر بار ذخیره، نمره‌ی قبلی×۰.۵ می‌شد و با چند ویرایش، امتیاز آب می‌رفت)
  if(trades[idx].baseScoreLearning===undefined){
    trades[idx].baseScoreLearning = parseFloat(trades[idx].scoreLearning)||0;
  }
  const lessonWritten = resNoteVal.length>=15;
  trades[idx].scoreLearning = Math.round(trades[idx].baseScoreLearning*0.5 + (lessonWritten?100:0)*0.5);

  saveTrades();
  closeResultModal();

  if(result==='loss' || result==='be'){
    startForcedStop();
  }
  if(result==='loss'){
    const today=localDateStr();
    const todayLosses=trades.filter(t=>t.date===today && t.result==='loss').length;
    if(todayLosses>=2){
      toast(currentLang()==='en'?'🚫 Second loss today — full lock now active until end of day, on top of the 2-hour stop':'🚫 دومین ضرر امروز — علاوه بر قفل ۲ ساعته، تا پایان امروز قفل کامل فعال شد','error');
    } else {
      toast(currentLang()==='en'?'⏳ 2-hour forced stop started (rule: after every loss or BE)':'⏳ قفل ۲ ساعته فعال شد (طبق قانون: بعد از هر ضرر یا BE)','error');
    }
    const lossAmt=Math.abs(parseFloat(trades[idx].pnlUsd)||0);
    const bal=parseFloat(settings.startingBalance)||10000;
    if(lossAmt > bal*0.03){
      toast(currentLang()==='en'?'🚨 This loss exceeds the absolute 2% capital cap — per physical barrier #5, do a full system review':'🚨 این ضرر از سقف مطلق ۲٪ سرمایه عبور کرده — طبق موانع فیزیکی #۵، سیستم را کامل بازبینی کن','error');
    }
  } else if(result==='be'){
    toast(currentLang()==='en'?'⏳ 2-hour forced stop started (rule: after every loss or BE)':'⏳ قفل ۲ ساعته فعال شد (طبق قانون: بعد از هر ضرر یا BE)','error');
  }

  renderTodayTrades();
  updateDashboard();
}

// ===== JOURNAL (Structured) =====
function saveJournal(){
  const today=localDateStr();
  const text=document.getElementById('j-text').value.trim();
  if(!text){toast(currentLang()==='en'?'Enter a note':'متن یادداشت را وارد کنید','error');return}
  updateAutoJournalScore();
  const auto=window._autoJournalScore||{tech:0,risk:0,mental:0,learning:0};
  journals.unshift({
    id:Date.now().toString(),date:today,text,
    tech:auto.tech,
    risk:auto.risk,
    mental:auto.mental,
    learning:auto.learning,
    revenge:document.getElementById('j-revenge').value,
    deviate:document.getElementById('j-deviate').value,
    best:(function(){const el=document.getElementById('j-best');return el?el.value.trim():'';})(),
    worst:(function(){const el=document.getElementById('j-worst');return el?el.value.trim():'';})(),
    tomorrow:document.getElementById('j-tomorrow').value,
    tags:document.getElementById('j-tags').value,
    createdAt:Date.now()
  });
  saveJournals();
  document.getElementById('j-text').value='';
  document.getElementById('j-revenge').value='no';
  document.getElementById('j-deviate').value='no';
  document.getElementById('j-tomorrow').value='';
  document.getElementById('j-tags').value='';
  updateAutoJournalScore();
  renderJournalHistory();
  toast(currentLang()==='en'?'✅ Journal saved':'✅ ژورنال ذخیره شد');
}
function renderJournalHistory(){
  const EN=currentLang()==='en';
  const today=localDateStr();
  const items=journals.filter(j=>j.date===today);
  const container=document.getElementById('journal-history-today');
  if(items.length===0){container.innerHTML='';return;}
  container.innerHTML=items.map(j=>{
    const tags=j.tags? j.tags.split(',').map(x=>`<span class="tag-pill">${escapeHTML(x.trim())}</span>`).join(''):'';
    return `<div style="background:var(--panel-2);border-radius:var(--radius-sm);padding:12px;margin-bottom:8px;border-right:3px solid var(--amber);">
      <div style="font-size:.78rem;color:var(--text-dim);white-space:pre-wrap;margin-bottom:6px;">${escapeHTML(j.text)}</div>
      <div style="display:flex;gap:10px;font-size:.72rem;flex-wrap:wrap;margin-bottom:6px;">
        ${j.tech?`<span style="color:var(--cyan)">${EN?'Technical':'تکنیکال'}: ${j.tech}</span>`:''}
        ${j.risk?`<span style="color:var(--amber)">${EN?'Risk':'ریسک'}: ${j.risk}</span>`:''}
        ${j.mental?`<span style="color:var(--purple)">${EN?'Mental/Physical':'روحی/جسمی'}: ${j.mental}</span>`:''}
        ${j.learning?`<span style="color:var(--green)">${EN?'Learning':'یادگیری'}: ${j.learning}</span>`:''}
        ${j.revenge==='yes'?'<span style="color:var(--red)">⚠️ Revenge Trading</span>':''}
        ${j.deviate==='yes'?('<span style="color:var(--red)">⚠️ '+(currentLang()==='en'?'Off-plan exit':'خروج از پلن')+'</span>'):''}
      </div>
      ${j.tomorrow?`<div style="font-size:.75rem;color:var(--text-faint);margin-bottom:4px;">${EN?'Tomorrow':'فردا'}: ${j.tomorrow}</div>`:''}
      <div>${tags}</div>
      <button class="btn btn-sm btn-ghost" style="color:var(--red);margin-top:6px;" onclick="deleteJournal('${j.id}')">${EN?'Delete':'حذف'}</button>
    </div>`;
  }).join('');
}
function deleteJournal(id){if(!confirm(currentLang()==='en'?'Are you sure?':'آیا مطمئنید؟'))return;journals=journals.filter(j=>j.id!==id);saveJournals();renderJournalHistory();}

