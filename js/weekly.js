// ===== WEEKLY REVIEW =====
function computeWeekStats(fromStr,toStr){
  const list=trades.filter(t=>t.date>=fromStr && t.date<=toStr);
  const stats=calcPerfStats(list);
  const closedLoss=list.filter(t=>t.result==='loss');
  const tagMap={}, emoMap={};
  closedLoss.forEach(t=>{
    (t.tags||'').split(',').forEach(tag=>{const k=tag.trim().toLowerCase(); if(k) tagMap[k]=(tagMap[k]||0)+1;});
    emoMap[t.emotion]=(emoMap[t.emotion]||0)+1;
  });
  const topTag=Object.entries(tagMap).sort((a,b)=>b[1]-a[1])[0]||null;
  const topEmo=Object.entries(emoMap).sort((a,b)=>b[1]-a[1])[0]||null;

  const fomoCount=list.filter(t=>IMPULSIVE_EMOTIONS.includes(t.emotion)).length;
  const stopMoveCount=list.filter(t=>t.postTrade&&t.postTrade.q1==='yes').length;
  const deviateCount=list.filter(t=>t.postTrade&&t.postTrade.q2==='yes').length;
  const rrVals=list.map(t=>parseFloat((t.rr||'').split(':')[0])).filter(v=>!isNaN(v));
  const avgRR=rrVals.length?(rrVals.reduce((a,b)=>a+b,0)/rrVals.length):0;

  return Object.assign({from:fromStr, to:toStr, topTag, topEmo, fomoCount, stopMoveCount, deviateCount, avgRR}, stats);
}
function generateWeeklySuggestions(s){
  const msgs=[];
  const en=currentLang()==='en';
  if(s.count===0){
    msgs.push({icon:'📭',color:'var(--text-faint)',text: en?'No trades in this range — nothing to analyze.':'در این بازه معامله‌ای ثبت نشده — داده‌ای برای تحلیل نیست.'});
    return msgs;
  }
  if(s.fomoCount>=2) msgs.push({icon:'😵',color:'var(--red)',text: en?`${s.fomoCount} trades with unstable emotions (FOMO/revenge/bored). Take the physical “30-minute pause after this feeling” rule seriously.`:`${s.fomoCount} معامله با احساسات ناپایدار (FOMO/انتقام‌جو/بی‌حوصله) ثبت شده. قانون فیزیکی «۳۰ دقیقه صبر بعد از این احساس» را جدی بگیر.`});
  if(s.stopMoveCount>0) msgs.push({icon:'🛑',color:'var(--red)',text: en?`${s.stopMoveCount} times the stop was moved — this is exactly the pattern that destroys capital.`:`${s.stopMoveCount} بار استاپ جابجا شده — این دقیقاً همان الگویی است که سرمایه را از بین می‌برد.`});
  if(s.deviateCount>0) msgs.push({icon:'⚠️',color:'var(--amber)',text: en?`${s.deviateCount} times you left the plan.`:`${s.deviateCount} بار خارج از پلن خارج شده‌ای.`});
  if(s.adherence!==null && s.adherence<70) msgs.push({icon:'☀️',color:'var(--amber)',text: en?`Average adherence this week was only ${s.adherence}% — often predicts weaker results.`:`میانگین امتیاز پایبندی این هفته فقط ${s.adherence}٪ بوده — معمولاً پیش‌بینی‌کننده‌ی نتیجه‌ی ضعیف‌تر است.`});
  if(s.avgRR>0 && s.avgRR<1.5) msgs.push({icon:'📏',color:'var(--amber)',text: en?`Average planned R:R this week is ${s.avgRR.toFixed(1)} — below the 1.5:1 minimum standard.`:`میانگین R:R برنامه‌ریزی‌شده این هفته ${s.avgRR.toFixed(1)} است — زیر حداقل استاندارد ۱.۵:۱.`});
  if(s.maxLossStreak>=3) msgs.push({icon:'🔥',color:'var(--red)',text: en?`A streak of ${s.maxLossStreak} consecutive losses this week — watch for revenge trading.`:`رکورد ${s.maxLossStreak} ضرر متوالی در همین هفته ثبت شده — مراقب رفتار انتقامی (Revenge Trading) باش.`});
  if(s.wr>=50 && s.totalPnl>0 && s.fomoCount===0 && s.stopMoveCount===0) msgs.push({icon:'✅',color:'var(--green)',text: en?'The system was working this week — repeat the same process next week.':'این هفته سیستم داشت درست کار می‌کرد — همین روال را در هفته بعد تکرار کن.'});
  if(s.consecutiveProfitableWeeks>=4) msgs.push({icon:'🏆',color:'var(--green)',text: en?`${s.consecutiveProfitableWeeks} consecutive green weeks logged. Per the roadmap, this is a reasonable point to review a gradual risk increase — not earlier.`:`${s.consecutiveProfitableWeeks} هفته‌ی سبز متوالی (ثبت‌شده) پشت سر گذاشتی. طبق نقشه راه، این نقطه‌ی معقولی برای بررسی افزایش تدریجی ریسک است — نه زودتر از آن.`});
  if(!msgs.length) msgs.push({icon:'📊',color:'var(--text-dim)',text: en?'No clear warning pattern. Keep logging carefully.':'الگوی هشداردهنده مشخصی دیده نشد. به ثبت دقیق ادامه بده.'});
  return msgs;
}
function renderWeeklySuggestions(s){
  const box=document.getElementById('weekly-suggestions');
  if(!box) return;
  box.innerHTML=generateWeeklySuggestions(s).map(m=>
    `<div class="coach-alert" style="border-color:${m.color};margin-bottom:8px;"><span class="coach-alert-icon">${m.icon}</span><div class="coach-alert-text"><div class="coach-alert-body">${m.text}</div></div></div>`
  ).join('');
}
function getConsecutiveProfitableWeeks(){
  const sorted=weeklyReviews.filter(w=>w.pnl!==undefined).slice().sort((a,b)=>b.date.localeCompare(a.date));
  let count=0;
  for(const w of sorted){ if(w.pnl>0) count++; else break; }
  return count;
}
function renderWeeklyAutoSummary(){
  const en=currentLang()==='en';
  let dateVal=document.getElementById('wr-date').value;
  if(!dateVal){ dateVal=localDateStr(); document.getElementById('wr-date').value=dateVal; }
  const to=dateVal;
  const fromD=new Date(to); fromD.setDate(fromD.getDate()-6);
  const from=localDateStr(fromD);
  document.getElementById('wr-summary-date').textContent=to;

  const cur=computeWeekStats(from,to);
  cur.consecutiveProfitableWeeks=getConsecutiveProfitableWeeks();
  const prevToD=new Date(from); prevToD.setDate(prevToD.getDate()-1);
  const prevTo=localDateStr(prevToD);
  const prevFromD=new Date(prevTo); prevFromD.setDate(prevFromD.getDate()-6);
  const prevFrom=localDateStr(prevFromD);
  const prev=computeWeekStats(prevFrom,prevTo);
  window._curWeekStats=cur;
  renderWeeklySuggestions(cur);

  const arrow=(curV,prevV)=>{
    if(curV===null||curV===undefined||prevV===null||prevV===undefined) return '';
    if(curV>prevV) return ' <span style="color:var(--green)">▲</span>';
    if(curV<prevV) return ' <span style="color:var(--red)">▼</span>';
    return ' <span style="color:var(--text-faint)">–</span>';
  };
  const emoLabel=k=>k==='fomo'?'FOMO':k==='rushed'?(en?'Rushed':'عجول'):k==='calm'?(en?'Calm':'آرام'):'-';

  let html='<div class="grid-4" style="margin-bottom:10px;">';
  html+=`<div class="card" style="padding:12px;"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Trades':'تعداد معامله'}</div><div style="font-size:1.1rem;font-weight:800;margin-top:3px;">${cur.count}</div></div>`;
  html+=`<div class="card" style="padding:12px;"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Win rate':'وین‌ریت'}</div><div style="font-size:1.1rem;font-weight:800;margin-top:3px;color:var(--cyan);">${cur.wr}%${arrow(cur.wr,prev.wr)}</div></div>`;
  html+=`<div class="card" style="padding:12px;"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Week P&L':'PnL هفته'}</div><div style="font-size:1.1rem;font-weight:800;margin-top:3px;color:${cur.totalPnl>=0?'var(--green)':'var(--red)'};">${cur.totalPnl>=0?'+$':'$'}${cur.totalPnl.toFixed(2)}${arrow(cur.totalPnl,prev.totalPnl)}</div></div>`;
  html+=`<div class="card" style="padding:12px;"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Adherence (avg score)':'پایبندی (میانگین امتیاز)'}</div><div style="font-size:1.1rem;font-weight:800;margin-top:3px;">${cur.adherence!==null?cur.adherence+'%':'-'}${arrow(cur.adherence,prev.adherence)}</div></div>`;
  html+='</div>';

  if(cur.bestTrade || cur.worstTrade){
    html+='<div class="grid-2" style="margin-bottom:10px;">';
    if(cur.bestTrade) html+=`<div class="card" style="padding:12px;border-color:var(--green);"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Best trade':'بهترین معامله'}</div><div style="font-size:.92rem;font-weight:700;color:var(--green);margin-top:3px;">${escapeHTML(cur.bestTrade.pair)} · ${(parseFloat(cur.bestTrade.pnlUsd)||0)>=0?'+$':'$'}${escapeHTML(cur.bestTrade.pnlUsd)}</div></div>`;
    if(cur.worstTrade) html+=`<div class="card" style="padding:12px;border-color:var(--red);"><div style="font-size:.65rem;color:var(--text-faint);">${en?'Worst trade':'بدترین معامله'}</div><div style="font-size:.92rem;font-weight:700;color:var(--red);margin-top:3px;">${escapeHTML(cur.worstTrade.pair)} · $${escapeHTML(cur.worstTrade.pnlUsd)}</div></div>`;
    html+='</div>';
  }
  if(cur.count===0) html+='<p style="color:var(--text-faint);font-size:.85rem;">'+(en?'No trades logged in this range.':'در این بازه معامله‌ای ثبت نشده.')+'</p>';
  document.getElementById('weekly-auto-summary').innerHTML=html;

  let hint='';
  if(cur.topTag) hint+=(en?`💡 Most frequent tag in this week's losses: <strong>${cur.topTag[0]}</strong> (${cur.topTag[1]}×). `:`💡 پرتکرارترین تگ در ضررهای این هفته: <strong>${cur.topTag[0]}</strong> (${cur.topTag[1]} بار). `);
  if(cur.topEmo) hint+=(en?`Dominant emotion in losses: <strong>${emoLabel(cur.topEmo[0])}</strong>.`:`احساس غالب در ضررها: <strong>${emoLabel(cur.topEmo[0])}</strong>.`);
  document.getElementById('wr-hint').innerHTML = hint || (en?'No closed trades this week yet — answer the questions based on the overall feel of the week.':'هنوز معامله‌ی بسته‌شده‌ای در این هفته ثبت نشده — سوال‌ها را بر اساس حس کلی هفته پاسخ بده.');
}
function saveWeeklyReview(){
  const date=document.getElementById('wr-date').value||localDateStr();
  let cur=window._curWeekStats;
  if(!cur || cur.to!==date){
    const fromD=new Date(date); fromD.setDate(fromD.getDate()-6);
    cur=computeWeekStats(localDateStr(fromD),date);
  }
  weeklyReviews.unshift({
    id:Date.now().toString(),
    date,
    tradesCount:cur.count,
    winRate:cur.wr,
    pnl:cur.totalPnl,
    adherence:cur.adherence,
    topLossTag: cur.topTag ? cur.topTag[0] : null,
    mistake:document.getElementById('wr-mistake').value,
    best:document.getElementById('wr-best').value,
    goal:document.getElementById('wr-goal').value,
    lesson:document.getElementById('wr-lesson').value,
    drill:(function(){const el=document.getElementById('wr-drill');return el?el.value.trim():'';})()
  });
  saveWeekly();
  renderWeeklyList();
  drawWeeklyTrend();
  toast(currentLang()==='en'?'✅ Weekly review saved':'✅ بازبینی هفتگی ذخیره شد');
  ['wr-mistake','wr-best','wr-goal','wr-lesson'].forEach(id=>document.getElementById(id).value='');
  const drillEl=document.getElementById('wr-drill'); if(drillEl) drillEl.value='';
}
function renderWeeklyList(){
  const EN=currentLang()==='en';
  const container=document.getElementById('weekly-list');
  if(!weeklyReviews.length){container.innerHTML='';return;}
  container.innerHTML=weeklyReviews.map(w=>{
    const hasAuto=w.tradesCount!==undefined;
    return `
    <div class="card" style="padding:14px;border-right:3px solid var(--cyan);">
      ${w.drill?`<div style="font-size:.78rem;color:var(--amber);margin-bottom:6px;">🎯 ${EN?'Week drill':'تمرین هفته'}: ${escapeHTML(w.drill)}</div>`:''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span class="mono" style="font-weight:700;">${EN?'Week ending':'هفته منتهی به'} ${w.date}</span>
        <button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="deleteWeekly('${w.id}')">${EN?'Delete':'حذف'}</button>
      </div>
      ${hasAuto?`<div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.78rem;color:var(--text-dim);margin-bottom:8px;">
        <span>${EN?'Trades':'معاملات'}: <strong>${w.tradesCount}</strong></span>
        <span>${EN?'Win rate':'وین‌ریت'}: <strong style="color:var(--cyan)">${w.winRate}%</strong></span>
        <span>PnL: <strong style="color:${w.pnl>=0?'var(--green)':'var(--red)'}">${w.pnl>=0?'+$':'$'}${(w.pnl||0).toFixed(2)}</strong></span>
        <span>${EN?'Adherence':'پایبندی'}: <strong>${w.adherence!==null&&w.adherence!==undefined?w.adherence+'%':'-'}</strong></span>
        ${w.topLossTag?`<span>${EN?'Top loss tag':'پرتکرارترین تگ ضرر'}: <strong>${w.topLossTag}</strong></span>`:''}
      </div>`:''}
      <div style="font-size:.82rem;color:var(--text-dim);line-height:1.8;">
        ${w.mistake?`<div><strong>${EN?'Biggest mistake':'بزرگترین اشتباه'}:</strong> ${escapeHTML(w.mistake)}</div>`:(w.adherence===undefined&&w.pattern?`<div><strong>${EN?'Repeating pattern':'الگوی تکراری'}:</strong> ${escapeHTML(w.pattern)}</div>`:'')}
        ${w.best?`<div><strong>${EN?'Best decision':'بهترین تصمیم'}:</strong> ${escapeHTML(w.best)}</div>`:''}
        ${w.goal?`<div><strong>${EN?'Future goal':'هدف آینده'}:</strong> ${escapeHTML(w.goal)}</div>`:''}
        ${w.lesson?`<div><strong>${EN?'Lesson':'درس'}:</strong> ${escapeHTML(w.lesson)}</div>`:''}
      </div>
    </div>`;
  }).join('');
}
function deleteWeekly(id){if(!confirm(currentLang()==='en'?'Are you sure?':'آیا مطمئنید؟'))return;weeklyReviews=weeklyReviews.filter(w=>w.id!==id);saveWeekly();renderWeeklyList();drawWeeklyTrend();}
function drawWeeklyTrend(){
  const cvs=document.getElementById('chartWeeklyTrend');
  if(!cvs) return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w,h=_pc.h,pad=40;
  ctx.clearRect(0,0,w,h);
  const withAuto=weeklyReviews.filter(x=>x.winRate!==undefined).slice().reverse();
  if(withAuto.length<2){
    ctx.fillStyle='#7a8492'; ctx.font='13px sans-serif'; ctx.textAlign='center';
    ctx.fillText(currentLang()==='en'?'At least 2 auto reviews needed to show a trend':'برای نمایش روند، حداقل ۲ بازبینی خودکار لازم است',w/2,h/2);
    return;
  }
  const stepX=(w-pad*2)/(withAuto.length-1);
  ctx.strokeStyle='#1e2630'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=pad+(h-pad*2)*(i/4);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}

  ctx.beginPath();
  withAuto.forEach((wk,i)=>{
    const x=pad+i*stepX, y=pad+(h-pad*2)*(1-(wk.winRate/100));
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.strokeStyle='#39d0d8'; ctx.lineWidth=2; ctx.stroke();

  const hasAdh=withAuto.some(x=>x.adherence!==null && x.adherence!==undefined);
  if(hasAdh){
    ctx.beginPath();
    withAuto.forEach((wk,i)=>{
      const a=(wk.adherence!==null&&wk.adherence!==undefined)?wk.adherence:0;
      const x=pad+i*stepX, y=pad+(h-pad*2)*(1-(a/100));
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.strokeStyle='#f0883e'; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.fillStyle='#39d0d8'; ctx.fillRect(pad,16,10,10); ctx.fillStyle='#e8eaec'; ctx.font='11px sans-serif'; ctx.textAlign='left';
  ctx.fillText(currentLang()==='en'?'Win rate':'وین‌ریت',pad+14,25);
  if(hasAdh){
    ctx.fillStyle='#f0883e'; ctx.fillRect(pad+80,16,10,10); ctx.fillStyle='#e8eaec';
    ctx.fillText(currentLang()==='en'?'Adherence':'پایبندی',pad+94,25);
  }
}
function initWeeklyPage(){
  renderWeeklyAutoSummary();
  renderWeeklyList();
  drawWeeklyTrend();
}

