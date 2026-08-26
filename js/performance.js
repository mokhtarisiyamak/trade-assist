// ===== PERFORMANCE: shared time-range + stats engine =====
// v5.6: R واقعی = سود دلاری ÷ ریسک دلاریِ پلن. قبلاً pnl بر فاصله‌ی قیمتی |entry-sl| تقسیم می‌شد
// که واحد ندارد و برای طلا/کریپتو اعداد غلط تولید می‌کرد.
function calcRealR(t){
  const pnl=parseFloat(t.pnlUsd)||0;
  const riskUsd=parseFloat(t.riskUsd);
  if(!isNaN(riskUsd) && riskUsd>0) return isFinite(pnl/riskUsd)?pnl/riskUsd:null;
  // fallback: اگر کاربر ریسک دلاری ثبت نکرده، از ضرر واقعی همان معامله به عنوان 1R استفاده کن
  if(t.result==='loss' && pnl<0) return -1;
  return null; // برای معاملات سودده بدون riskUsd حدس بی‌پایه نمی‌زنیم
}
function getPerfRange(){
  const sel=document.getElementById('perf-range');
  const key = sel ? sel.value : 'week';
  const today=new Date();
  const todayStr=localDateStr(today);
  let fromStr=null, toStr=todayStr;
  if(key==='week'){ const f=new Date(today); f.setDate(f.getDate()-6); fromStr=localDateStr(f); }
  else if(key==='month'){ const f=new Date(today); f.setDate(f.getDate()-29); fromStr=localDateStr(f); }
  else if(key==='d90'){ const f=new Date(today); f.setDate(f.getDate()-89); fromStr=localDateStr(f); }
  else if(key==='all'){ fromStr=null; toStr=null; }
  else if(key==='custom'){
    const f=document.getElementById('perf-from').value;
    const t=document.getElementById('perf-to').value;
    fromStr=f||null; toStr=t||null;
  }
  return {key, from:fromStr, to:toStr};
}
function getFilteredTrades(){
  const r=getPerfRange();
  return trades.filter(t=>{
    if(r.from && t.date<r.from) return false;
    if(r.to && t.date>r.to) return false;
    return true;
  });
}
// day-by-day charts need concrete from/to strings, capped to last 365 days for performance
function getEffectiveRangeDates(){
  const r=getPerfRange();
  let from=r.from, to=r.to;
  if(!to) to=localDateStr();
  if(!from){
    if(trades.length){ from=trades.map(t=>t.date).sort()[0]; }
    else { from=to; }
  }
  const cap=new Date(); cap.setDate(cap.getDate()-365);
  const capStr=localDateStr(cap);
  if(from<capStr) from=capStr;
  return {from,to};
}
function enumerateDays(fromStr,toStr){
  const out=[];
  let d=new Date(fromStr); const end=new Date(toStr);
  if(isNaN(d)||isNaN(end)||d>end) return [toStr];
  while(d<=end){ out.push(localDateStr(d)); d.setDate(d.getDate()+1); }
  return out;
}
function calcPerfStats(list){
  const closed=list.filter(t=>t.result==='win'||t.result==='loss'||t.result==='be');
  const wins=closed.filter(t=>t.result==='win');
  const losses=closed.filter(t=>t.result==='loss');
  const bes=closed.filter(t=>t.result==='be');
  const grossWin=wins.reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
  const grossLoss=losses.reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0); // <=0
  const totalPnl=grossWin+grossLoss+bes.reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
  const wr=(wins.length+losses.length)>0?Math.round((wins.length/(wins.length+losses.length))*100):0;
  const avgWin=wins.length?grossWin/wins.length:0;
  const avgLoss=losses.length?grossLoss/losses.length:0; // negative
  const expectancy=(wr/100)*avgWin+(1-wr/100)*avgLoss;
  let profitFactor;
  if(losses.length===0){ profitFactor = wins.length>0 ? Infinity : null; }
  else { profitFactor = grossWin/Math.abs(grossLoss); }
  const payoff = (avgLoss!==0) ? (avgWin/Math.abs(avgLoss)) : null;

  const rList=list.map(calcRealR).filter(x=>x!==null);
  const avgR = rList.length ? (rList.reduce((s,v)=>s+v,0)/rList.length) : null;

  const chron=[...closed].sort((a,b)=>a.date.localeCompare(b.date)||((a.createdAt||0)-(b.createdAt||0)));
  let curStreak=0, maxStreak=0;
  chron.forEach(t=>{ if(t.result==='loss'){curStreak++; maxStreak=Math.max(maxStreak,curStreak);} else {curStreak=0;} });

  const scored=list.filter(t=>t.scoreTech!==undefined && t.scoreTech!==null);
  const adherence = scored.length ? Math.round(scored.reduce((s,t)=>s+((parseFloat(t.scoreTech)+parseFloat(t.scoreRisk)+parseFloat(t.scoreMental)+(parseFloat(t.scoreLearning)||0))/4),0)/scored.length) : null;

  const execScored=closed.filter(t=>t.scoreExecution!==undefined && t.scoreExecution!==null);
  const avgExecution = execScored.length ? Math.round(execScored.reduce((s,t)=>s+parseFloat(t.scoreExecution),0)/execScored.length) : null;

  const pickExtreme=(arr,wantMax)=>{
    if(!arr.length) return null;
    return arr.reduce((m,t)=>{
      const tv=parseFloat(t.pnlUsd), mv=parseFloat(m.pnlUsd);
      const tvv=isNaN(tv)?(wantMax?-Infinity:Infinity):tv;
      const mvv=isNaN(mv)?(wantMax?-Infinity:Infinity):mv;
      return (wantMax? tvv>mvv : tvv<mvv) ? t : m;
    }, arr[0]);
  };

  return {
    count:list.length, closedCount:closed.length, wins:wins.length, losses:losses.length, bes:bes.length,
    totalPnl, wr, avgWin, avgLoss, expectancy, profitFactor, payoff, avgR, maxLossStreak:maxStreak, adherence, avgExecution,
    bestTrade:pickExtreme(closed,true), worstTrade:pickExtreme(closed,false),
    maxDD:maxDrawdownPct(closed), currentDD:currentDrawdownPct()
  };
}
// v5.8: حداکثر Drawdown درصدی روی منحنی سرمایه (از موجودی اولیه)
function maxDrawdownPct(closedList){
  const bal=parseFloat(settings.startingBalance)||10000;
  const chron=[...(closedList||[])].filter(t=>t.result==='win'||t.result==='loss'||t.result==='be')
    .sort((a,b)=>String(a.date).localeCompare(String(b.date))||(a.createdAt||0)-(b.createdAt||0));
  let eq=bal, peak=bal, maxDd=0;
  chron.forEach(t=>{ eq+=(parseFloat(t.pnlUsd)||0); if(eq>peak)peak=eq; const dd=(peak-eq)/peak*100; if(dd>maxDd)maxDd=dd; });
  return Math.round(maxDd*10)/10;
}
// v5.8: دراودان فعلی نسبت به پیک تاریخی
function currentDrawdownPct(){
  const closed=trades.filter(t=>t.result==='win'||t.result==='loss'||t.result==='be');
  const bal=parseFloat(settings.startingBalance)||10000;
  const chron=closed.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))||(a.createdAt||0)-(b.createdAt||0));
  let eq=bal, peak=bal;
  chron.forEach(t=>{ eq+=(parseFloat(t.pnlUsd)||0); if(eq>peak)peak=eq; });
  if(peak<=0) return 0;
  return Math.round((peak-eq)/peak*1000)/10;
}
function renderPerfStatCards(stats){
  const wrEl=document.getElementById('perf-wr'); if(wrEl) wrEl.textContent=stats.wr+'%';
  const pfEl=document.getElementById('perf-pf');
  if(pfEl){ pfEl.textContent = stats.profitFactor===null?'-':(stats.profitFactor===Infinity?'∞':stats.profitFactor.toFixed(2)); }
  const expEl=document.getElementById('perf-exp');
  if(expEl){ expEl.textContent=(stats.expectancy>=0?'+$':'$')+stats.expectancy.toFixed(2); expEl.style.color=stats.expectancy>=0?'#3fb950':'#f85149'; }
  const avgREl=document.getElementById('perf-avgr'); if(avgREl) avgREl.textContent = stats.avgR!==null ? stats.avgR.toFixed(2)+'R' : '-';
  const payoffEl=document.getElementById('perf-payoff'); if(payoffEl) payoffEl.textContent = stats.payoff!==null ? stats.payoff.toFixed(2) : '-';
  const streakEl=document.getElementById('perf-streak'); if(streakEl) streakEl.textContent = stats.maxLossStreak;
  const maxddEl=document.getElementById('perf-maxdd'); if(maxddEl) maxddEl.textContent = (stats.maxDD!==undefined? '-'+stats.maxDD+'%' : '—');
  const countEl=document.getElementById('perf-count'); if(countEl) countEl.textContent = stats.count;
  const execEl=document.getElementById('perf-exec'); if(execEl) execEl.textContent = stats.avgExecution!==null ? stats.avgExecution : '-';
}
function renderScoreCorrelation(list){
  const EN=currentLang()==='en';
  const container=document.getElementById('score-correlation');
  if(!container) return;
  const closed=list.filter(t=>t.result==='win'||t.result==='loss');
  if(!closed.length){ container.innerHTML='<p style="color:var(--text-faint);font-size:.85rem;">'+(currentLang()==='en'?'Not enough data.':'داده کافی نیست.')+'</p>'; return; }
  const bands=[
    {label:(currentLang()==='en'?'Below 60':'زیر ۶۰'),min:0,max:59,color:'var(--red)'},
    {label:(currentLang()==='en'?'60–79':'۶۰ تا ۷۹'),min:60,max:79,color:'var(--amber)'},
    {label:(currentLang()==='en'?'80+':'۸۰ به بالا'),min:80,max:100,color:'var(--green)'}
  ];
  let html='<div class="grid-3">';
  bands.forEach(b=>{
    const inBand=closed.filter(t=>{
      const sc=(parseFloat(t.scoreTech)+parseFloat(t.scoreRisk)+parseFloat(t.scoreMental)+(parseFloat(t.scoreLearning)||0))/4;
      return sc>=b.min && sc<=b.max;
    });
    const w=inBand.filter(t=>t.result==='win').length;
    const wr = inBand.length? Math.round((w/inBand.length)*100) : null;
    const pnl = inBand.reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
    html+=`<div class="card" style="padding:14px;border-color:${b.color};">
      <div style="font-size:.7rem;color:var(--text-faint);">${EN?'Pre-entry readiness score':'امتیاز آمادگی پیش‌ورود'} ${b.label}</div>
      <div style="font-size:1.05rem;font-weight:700;color:${b.color};margin-top:4px;">${inBand.length} ${EN?'trades':'معامله'}${wr!==null?' · '+wr+(EN?'% win rate':'٪ وین‌ریت'):''}</div>
      <div style="font-size:.76rem;color:var(--text-dim);margin-top:2px;">PnL: ${pnl>=0?'+$':'$'}${pnl.toFixed(2)}</div>
    </div>`;
  });
  html+='</div>';
  container.innerHTML=html;
}
function onPerfRangeChange(){
  const key=document.getElementById('perf-range').value;
  const showCustom = key==='custom';
  document.getElementById('perf-from').style.display = showCustom?'inline-block':'none';
  document.getElementById('perf-to').style.display = showCustom?'inline-block':'none';
  drawPerformancePage();
}
// v5.8: مدل‌سنج — میانگین R بر اساس مراحل پاس‌شده، ستاپ و احساس ورود
function renderModelReport(){
  const box=document.getElementById('model-report');
  if(!box) return;
  const closed=getFilteredTrades().filter(t=>t.result==='win'||t.result==='loss'||t.result==='be');
  if(closed.length<3){ box.innerHTML='<p style="color:var(--text-faint);font-size:.8rem;">'+(currentLang()==='en'?'Activates after a few closed trades.':'بعد از چند معامله بسته‌شده فعال می‌شود.')+'</p>'; return; }
  const en=currentLang()==='en';
  const stageNames=en?{mental:'Mental readiness',bias:'Bias',levels:'Key levels',sweep:'Liquidity sweep',confirm:'LTF confirmation',final:'Exit/Risk'}:{mental:'آمادگی ذهنی',bias:'بایاس',levels:'سطوح کلیدی',sweep:'Sweep نقدینگی',confirm:'تأیید LTF',final:'خروج/ریسک'};
  function avgR(rows){ const rs=rows.map(calcRealR).filter(x=>x!==null); return rs.length? (rs.reduce((s,v)=>s+v,0)/rs.length) : null; }
  function row(label,r,n){
    const cls = r===null?'':(r>=0.15?'good':r<=-0.15?'bad':'');
    const val = r===null?'—':((r>=0?'+':'')+r.toFixed(2)+'R');
    return '<tr class="'+cls+'"><td>'+label+'</td><td>'+val+'</td><td>'+n+'</td></tr>';
  }
  let html='';
  const withStages=closed.filter(t=>Array.isArray(t.stagesComplete));
  if(withStages.length>=3){
    html+='<h4 style="font-size:.8rem;color:var(--cyan);margin:6px 0 4px;">'+(en?'Pre-entry stages (✓ vs ✗)':'مراحل قبل از ورود (✓ vs ✗)')+'</h4><table class="ms-table"><tr><th>'+(en?'Stage':'مرحله')+'</th><th>'+(en?'Avg R':'میانگین R')+'</th><th>'+(en?'Count':'تعداد')+'</th></tr>';
    PRE_STAGES.forEach(s=>{
      const done=withStages.filter(t=>{const st=(t.stagesComplete||[]).find(x=>x.key===s.key);return st&&st.complete;});
      const notDone=withStages.filter(t=>{const st=(t.stagesComplete||[]).find(x=>x.key===s.key);return st&&!st.complete;});
      if(notDone.length>=1 && done.length>=1){
        html+=row('✅ '+(stageNames[s.key]||s.key),avgR(done),done.length);
        html+=row('❌ '+(stageNames[s.key]||s.key),avgR(notDone),notDone.length);
      }
    });
    html+='</table>';
  }
  const bySetup={};
  closed.forEach(t=>{ if(!t.setup)return; (bySetup[t.setup]=bySetup[t.setup]||[]).push(t); });
  const setupRows=Object.entries(bySetup).filter(([,v])=>v.length>=2).map(([k,v])=>row('⚙ '+k,avgR(v),v.length));
  if(setupRows.length){
    html+='<h4 style="font-size:.8rem;color:var(--green);margin:10px 0 4px;">'+(en?'Setups':'ستاپ‌ها')+'</h4><table class="ms-table"><tr><th>'+(en?'Setup':'ستاپ')+'</th><th>'+(en?'Avg R':'میانگین R')+'</th><th>'+(en?'Count':'تعداد')+'</th></tr>'+setupRows.join('')+'</table>';
  }
  const byEmo={};
  closed.forEach(t=>{ if(!t.emotion)return; (byEmo[t.emotion]=byEmo[t.emotion]||[]).push(t); });
  const emoRows=Object.entries(byEmo).filter(([,v])=>v.length>=2).map(([k,v])=>row(emoLabel(k),avgR(v),v.length));
  if(emoRows.length){
    html+='<h4 style="font-size:.8rem;color:var(--purple);margin:10px 0 4px;">'+(en?'Emotion at entry':'احساس هنگام ورود')+'</h4><table class="ms-table"><tr><th>'+(en?'Emotion':'احساس')+'</th><th>'+(en?'Avg R':'میانگین R')+'</th><th>'+(en?'Count':'تعداد')+'</th></tr>'+emoRows.join('')+'</table>';
  }
  box.innerHTML=html||('<p style="color:var(--text-faint);font-size:.8rem;">'+(currentLang()==='en'?'Not enough data yet to break down by stage/setup/emotion.':'هنوز داده‌ی کافی برای شکستن بر اساس مرحله/ستاپ/احساس نیست.')+'</p>');
}
function drawPerformancePage(){
  const list=getFilteredTrades();
  renderPerfStatCards(calcPerfStats(list));
  drawRadar();
  drawPnL();
  drawWinLoss();
  renderScoreCorrelation(list);
  drawRMultiple();
  drawDayOfWeek();
  drawPairPerf();
  drawSessionPerf();
  drawSetupPerf();
  renderBehavioralAnalysis(list);
  drawDrawdown();
  drawPie();
  renderModelReport();
}

// v5.6: آماده‌سازی Canvas برای نمایشگرهای Retina/HiDPI — بدون این، نمودارها تار رندر می‌شوند
// CSS عرض را 100% می‌کند؛ ما رزولوشن پشتیبان را × devicePixelRatio می‌کنیم و مقیاس ctx را اصلاح می‌کنیم
function prepCanvas(cvs){
  if(!cvs) return null;
  const dpr = window.devicePixelRatio || 1;
  const attrW = parseInt(cvs.getAttribute('width'))||400;
  const attrH = parseInt(cvs.getAttribute('height'))||260;
  if(cvs._dprApplied !== dpr){
    cvs.width = Math.round(attrW*dpr);
    cvs.height = Math.round(attrH*dpr);
    cvs._dprApplied = dpr;
  }
  const ctx = cvs.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx, w:attrW, h:attrH};
}
function drawRadar(){
  const cvs=document.getElementById('chartRadar');
  if(!cvs) return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h;
  ctx.clearRect(0,0,w,h);
  const cx=w/2, cy=h/2+10, r=Math.min(w,h)*0.35;
  const labels=(currentLang()==='en')?['Technical','Risk','Mental/Physical','Learning']:['تکنیکال','ریسک','روحی/جسمی','یادگیری'];
  const angles=[-Math.PI/2, 0, Math.PI/2, Math.PI];

  ctx.strokeStyle='#1e2630'; ctx.lineWidth=1;
  for(let i=1;i<=4;i++){
    ctx.beginPath();
    angles.forEach((a,idx)=>{
      const x=cx+Math.cos(a)*(r*i/4), y=cy+Math.sin(a)*(r*i/4);
      idx===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath(); ctx.stroke();
  }
  angles.forEach(a=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();});
  ctx.fillStyle='#8b949e'; ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  angles.forEach((a,i)=>{
    const x=cx+Math.cos(a)*(r+22), y=cy+Math.sin(a)*(r+22);
    ctx.fillText(labels[i],x,y);
  });

  const cs=calcCombinedScore();
  const todayData=[cs.tech,cs.risk,cs.mental,cs.learning];
  ctx.beginPath();
  todayData.forEach((v,i)=>{
    const a=angles[i], d=(v/100)*r, x=cx+Math.cos(a)*d, y=cy+Math.sin(a)*d;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle='rgba(57,208,216,0.25)'; ctx.fill();
  ctx.strokeStyle='#39d0d8'; ctx.lineWidth=2; ctx.stroke();

  let avgTech=0,avgRisk=0,avgMental=0,avgLearning=0,cnt=0;
  const days=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(localDateStr(d));}
  days.forEach(date=>{
    const dc=dailyChecks[date]||{};
    const pc=preChecks[date]||{};
    const items=settings.dailyItems;
    const preItemsList=settings.preItems;
    const catItems=(cat)=>items.filter(i=>i.cat===cat);
    const preCatItems=(cat)=>preItemsList.filter(i=>i.cat===cat);
    const scoreCat=(cat)=>{
      const its=catItems(cat); if(!its.length)return 0;
      let e=0,t=0; its.forEach(i=>{t+=i.pts; if(dc[i.id])e+=i.pts;});
      return Math.round((e/t)*100);
    };
    const scorePreCat=(cat)=>{
      const its=preCatItems(cat); if(!its.length)return 0;
      let e=0,t=0; its.forEach(i=>{t+=i.pts; if(pc[i.id])e+=i.pts;});
      return Math.round((e/t)*100);
    };
    const t=Math.round((scoreCat('tech')+scorePreCat('tech'))/2);
    const r=Math.round((scoreCat('risk')+scorePreCat('risk'))/2);
    const m=Math.round((scoreCat('mental')+scorePreCat('mental'))/2);
    const l=Math.round((scoreCat('learning')+scorePreCat('learning'))/2);
    if(t+r+m+l>0){avgTech+=t;avgRisk+=r;avgMental+=m;avgLearning+=l;cnt++;}
  });
  if(cnt>0){
    avgTech=Math.round(avgTech/cnt); avgRisk=Math.round(avgRisk/cnt); avgMental=Math.round(avgMental/cnt); avgLearning=Math.round(avgLearning/cnt);
    const avgData=[avgTech,avgRisk,avgMental,avgLearning];
    ctx.beginPath();
    avgData.forEach((v,i)=>{
      const a=angles[i], d=(v/100)*r, x=cx+Math.cos(a)*d, y=cy+Math.sin(a)*d;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle='rgba(240,136,62,0.15)'; ctx.fill();
    ctx.strokeStyle='#f0883e'; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }

  ctx.fillStyle='#39d0d8'; ctx.fillRect(20,16,10,10); ctx.fillStyle='#e8eaec'; ctx.font='11px sans-serif'; ctx.textAlign='left';
  ctx.fillText(currentLang()==='en'?'Today':'امروز',34,25);
  ctx.fillStyle='#f0883e'; ctx.fillRect(90,16,10,10); ctx.fillStyle='#e8eaec';
  ctx.fillText(currentLang()==='en'?'7-day avg':'میانگین ۷ روز',104,25);
}

function drawPnL(){
  const cvs=document.getElementById('chartPnL');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const {from,to}=getEffectiveRangeDates();
  const days=enumerateDays(from,to);
  let cum=0;
  const data=days.map(date=>{
    const dayPnl=trades.filter(t=>t.date===date).reduce((s,t)=>s+(parseFloat(t.pnlUsd)||0),0);
    cum+=dayPnl;
    return cum;
  });
  const maxVal=Math.max(...data.map(Math.abs),1);
  const stepX=(w-pad*2)/(days.length-1||1);
  _chartData['chartPnL']={xs:data.map((_,i)=>pad+i*stepX),labels:days,values:data,fmt:v=>(v>=0?'+$':'$')+v.toFixed(2)};

  ctx.strokeStyle='#1e2630'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=pad+(h-pad*2)*(i/4);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}

  ctx.beginPath();
  data.forEach((v,i)=>{
    const x=pad+i*stepX;
    const y=pad+(h-pad*2)*0.5 - (v/maxVal)*((h-pad*2)*0.4);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.strokeStyle='#3fb950'; ctx.lineWidth=2; ctx.stroke();

  ctx.lineTo(pad+(days.length-1)*stepX, pad+(h-pad*2)*0.5);
  ctx.lineTo(pad, pad+(h-pad*2)*0.5);
  ctx.closePath();
  ctx.fillStyle='rgba(63,185,80,0.1)'; ctx.fill();

  ctx.beginPath(); ctx.moveTo(pad, pad+(h-pad*2)*0.5); ctx.lineTo(w-pad, pad+(h-pad*2)*0.5);
  ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.stroke();
}

function drawWinLoss(){
  const cvs=document.getElementById('chartWinLoss');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const {from,to}=getEffectiveRangeDates();
  const days=enumerateDays(from,to);
  const labels=days.map(d=>new Date(d).toLocaleDateString(currentLang()==='en'?'en-GB':'fa-IR',{day:'numeric'}));
  const wins=days.map(d=>trades.filter(t=>t.date===d&&t.result==='win').length);
  const losses=days.map(d=>trades.filter(t=>t.date===d&&t.result==='loss').length);
  const bes=days.map(d=>trades.filter(t=>t.date===d&&t.result==='be').length);
  const maxVal=Math.max(...wins,...losses,...bes,1);
  const barW=(w-pad*2)/days.length*0.5;
  const stepX=(w-pad*2)/days.length;
  const labelStep=days.length<=14?1:Math.ceil(days.length/10);
  _chartData['chartWinLoss']={xs:days.map((_,i)=>pad+i*stepX+stepX/2),
    labels:days,values:wins.map((wv,i)=>wv-losses[i]),
    fmt:v=>v>0?(currentLang()==='en'?('+ '+v+' wins'):('+ '+v+' برد')):v<0?(currentLang()==='en'?(-v+' losses'):(-v+' ضرر')):(currentLang()==='en'?'no trades':'بدون معامله')};

  days.forEach((d,i)=>{
    const x=pad+i*stepX+stepX*0.25;
    const base=pad+(h-pad*2);
    let h1=(wins[i]/maxVal)*(h-pad*2);
    ctx.fillStyle='#3fb950'; ctx.fillRect(x, base-h1, barW/3, h1);
    let h2=(losses[i]/maxVal)*(h-pad*2);
    ctx.fillStyle='#f85149'; ctx.fillRect(x+barW/3, base-h2, barW/3, h2);
    let h3=(bes[i]/maxVal)*(h-pad*2);
    ctx.fillStyle='#f0883e'; ctx.fillRect(x+barW*2/3, base-h3, barW/3, h3);
    if(i%labelStep===0){
      ctx.fillStyle='#7a8492'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(labels[i], x+barW/2, base+14);
    }
  });
}

function drawPie(){
  const cvs=document.getElementById('chartPie');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h;
  ctx.clearRect(0,0,w,h);
  const pieTrades=getFilteredTrades();
  const wins=pieTrades.filter(t=>t.result==='win').length;
  const losses=pieTrades.filter(t=>t.result==='loss').length;
  const bes=pieTrades.filter(t=>t.result==='be').length;
  const total=wins+losses+bes;
  if(total===0){
    ctx.fillStyle='#7a8492'; ctx.font='14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(currentLang()==='en'?'No data yet':'هنوز داده‌ای نیست',w/2,h/2);
    return;
  }
  const data=[wins,losses,bes];
  const colors=['#3fb950','#f85149','#f0883e'];
  const labels=currentLang()==='en'?['Win','Loss','BE']:[ 'سود','ضرر','سر به سر'];
  let start=-Math.PI/2;
  const cx=w/2-40, cy=h/2, r=Math.min(w,h)*0.32;
  data.forEach((v,i)=>{
    const slice=(v/total)*2*Math.PI;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,start+slice); ctx.closePath();
    ctx.fillStyle=colors[i]; ctx.fill(); ctx.strokeStyle='#06080a'; ctx.lineWidth=2; ctx.stroke();
    start+=slice;
  });
  let ly=30;
  data.forEach((v,i)=>{
    ctx.fillStyle=colors[i]; ctx.fillRect(w-90,ly,10,10);
    ctx.fillStyle='#e8eaec'; ctx.font='12px sans-serif'; ctx.textAlign='left';
    ctx.fillText(labels[i]+' ('+v+')', w-75, ly+9);
    ly+=22;
  });
}

