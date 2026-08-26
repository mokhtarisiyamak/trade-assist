// ===== HISTORY WITH FILTERS =====
function clearFilters(){
  document.getElementById('filter-pair').value='';
  document.getElementById('filter-result').value='';
  document.getElementById('filter-emotion').value='';
  document.getElementById('filter-from').value='';
  document.getElementById('filter-to').value='';
  renderHistory();
}
function renderHistory(){
  const fPair=document.getElementById('filter-pair').value.trim().toUpperCase();
  const fResult=document.getElementById('filter-result').value;
  const fEmotion=document.getElementById('filter-emotion').value;
  const fFrom=document.getElementById('filter-from').value;
  const fTo=document.getElementById('filter-to').value;

  let filtered=trades.filter(t=>{
    if(fPair && !t.pair.includes(fPair)) return false;
    if(fResult && t.result!==fResult) return false;
    if(fEmotion && t.emotion!==fEmotion) return false;
    if(fFrom && t.date<fFrom) return false;
    if(fTo && t.date>fTo) return false;
    return true;
  });

  const tbody=document.getElementById('history-table-body');
  const sorted=[...filtered].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt);
  const hs=calcPerfStats(filtered);
  document.getElementById('hist-total').textContent=filtered.length;
  document.getElementById('hist-wins').textContent=hs.wins;
  document.getElementById('hist-losses').textContent=hs.losses;
  document.getElementById('hist-pnl').textContent=(hs.totalPnl>0?'+$':'$')+hs.totalPnl.toFixed(2);
  document.getElementById('hist-pnl').style.color=hs.totalPnl>=0?'#3fb950':'#f85149';
  document.getElementById('hist-wr').textContent=hs.wr+'%';
  document.getElementById('hist-exp').textContent=(hs.expectancy>0?'+$':'$')+hs.expectancy.toFixed(2);
  document.getElementById('hist-exp').style.color=hs.expectancy>=0?'#3fb950':'#f85149';
  if(sorted.length===0){tbody.innerHTML='<tr><td colspan="11" style="text-align:center;color:var(--text-faint);padding:24px;">'+(currentLang()==='en'?'No trades found':'موردی یافت نشد')+'</td></tr>';return;}
  tbody.innerHTML=sorted.map(tr=>{
    const dirBadge=tr.dir==='BUY'?'badge-buy':'badge-sell';
    const resBadge=tr.result==='win'?'badge-win':tr.result==='loss'?'badge-loss':tr.result==='be'?'badge-wait':'badge-open';
    const resText=tr.result==='win'?t('result.win'):tr.result==='loss'?t('result.loss'):tr.result==='be'?t('result.be'):t('result.open');
    const pnlNum=parseFloat(tr.pnlUsd);
    const pnlColor=!isNaN(pnlNum) && pnlNum>0?'#3fb950':!isNaN(pnlNum) && pnlNum<0?'#f85149':'#8b949e';
    const tags=tr.tags? tr.tags.split(',').map(x=>`<span class="tag-pill">${escapeHTML(x.trim())}</span>`).join(''):'';
    return `<tr>
      <td class="mono">${tr.date}</td>
      <td class="mono">${escapeHTML(tr.pair)}</td>
      <td><span class="badge ${dirBadge}">${tr.dir}</span></td>
      <td><span class="badge ${resBadge}">${resText}</span></td>
      <td class="mono" style="color:${pnlColor};font-weight:700;">${tr.pnlUsd?((!isNaN(pnlNum) && pnlNum>0?'+$':'$')+tr.pnlUsd):'-'}</td>
      <td style="color:var(--cyan)">${tr.scoreTech}</td>
      <td style="color:var(--amber)">${tr.scoreRisk}</td>
      <td style="color:var(--purple)">${tr.scoreMental}</td>
      <td style="color:var(--green)">${tr.scoreLearning!==undefined?tr.scoreLearning:'-'}</td>
      <td>${tags}</td>
      <td style="display:flex;gap:4px;">
        <button class="btn btn-sm btn-ghost" onclick="openResultModal('${tr.id}')">✏️</button>
        <button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="deleteTrade('${tr.id}')">🗑️</button>
      </td>
    </tr>`;
  }).join('');
}

// ===== ANALYTICS (range-aware) =====
function drawDayOfWeek(){
  const cvs=document.getElementById('chartDayOfWeek');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const list=getFilteredTrades();
  const days=['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
  const dayPnL=days.map((_,idx)=>{
    const dIdx=(idx+1)%7;
    return list.reduce((s,t)=>{
      const d=new Date(t.date); if(d.getDay()===dIdx) return s+(parseFloat(t.pnlUsd)||0); return s;
    },0);
  });
  const maxVal=Math.max(...dayPnL.map(Math.abs),1);
  const stepX=(w-pad*2)/days.length;
  const base=pad+(h-pad*2);
  _chartData['chartDayOfWeek']={xs:days.map((_,i)=>pad+i*stepX+stepX/2),labels:days,values:dayPnL,
    fmt:v=>(v>=0?'+$':'$')+v.toFixed(2)};

  days.forEach((label,i)=>{
    const x=pad+i*stepX+stepX*0.2;
    const barW=stepX*0.6;
    const v=dayPnL[i];
    const barH=(v/maxVal)*((h-pad*2)*0.8);
    ctx.fillStyle=v>=0?'#3fb950':'#f85149';
    ctx.fillRect(x, base-Math.max(0,barH), barW, Math.abs(barH));
    ctx.fillStyle='#7a8492'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(label, x+barW/2, base+14);
  });
  ctx.beginPath(); ctx.moveTo(pad,base); ctx.lineTo(w-pad,base); ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.stroke();
}

function drawPairPerf(){
  const cvs=document.getElementById('chartPair');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const pairMap={};
  getFilteredTrades().forEach(t=>{
    if(!pairMap[t.pair]) pairMap[t.pair]=0;
    pairMap[t.pair]+=(parseFloat(t.pnlUsd)||0);
  });
  const pairs=Object.keys(pairMap).slice(0,6);
  const vals=pairs.map(p=>pairMap[p]);
  const maxVal=Math.max(...vals.map(Math.abs),1);
  const stepX=(w-pad*2)/(pairs.length||1);
  const base=pad+(h-pad*2);
  _chartData['chartPair']={xs:pairs.map((_,i)=>pad+i*stepX+stepX/2),labels:pairs,values:vals,
    fmt:v=>(v>=0?'+$':'$')+v.toFixed(2)};

  pairs.forEach((p,i)=>{
    const x=pad+i*stepX+stepX*0.2;
    const barW=stepX*0.6;
    const v=vals[i];
    const barH=(v/maxVal)*((h-pad*2)*0.8);
    ctx.fillStyle=v>=0?'#3fb950':'#f85149';
    ctx.fillRect(x, base-Math.max(0,barH), barW, Math.abs(barH));
    ctx.fillStyle='#7a8492'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(p, x+barW/2, base+14);
  });
  ctx.beginPath(); ctx.moveTo(pad,base); ctx.lineTo(w-pad,base); ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.stroke();
}

function drawSessionPerf(){
  const cvs=document.getElementById('chartSession');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const zones=['asia','preLondon','london','preNY','ny'];
  const sessions={}; zones.forEach(z=>sessions[z]=0);
  getFilteredTrades().forEach(t=>{
    const raw = t.timeZone || getTimeOfDayZone(new Date(t.createdAt));
    const zone = zoneKey(raw) || raw;
    if(sessions[zone]===undefined) sessions[zone]=0;
    sessions[zone]+=(parseFloat(t.pnlUsd)||0);
  });
  const labels=zones.map(z=>zoneLabel(z));
  const vals=labels.map(l=>sessions[l]);
  const maxVal=Math.max(...vals.map(Math.abs),1);
  const stepX=(w-pad*2)/labels.length;
  const base=pad+(h-pad*2);
  _chartData['chartSession']={xs:labels.map((_,i)=>pad+i*stepX+stepX*0.5),labels:labels,values:vals,
    fmt:v=>(v>=0?'+$':'$')+v.toFixed(2)};

  labels.forEach((l,i)=>{
    const x=pad+i*stepX+stepX*0.15;
    const barW=stepX*0.7;
    const v=vals[i];
    const barH=(v/maxVal)*((h-pad*2)*0.8);
    ctx.fillStyle=v>=0?'#39d0d8':'#f85149';
    ctx.fillRect(x, base-Math.max(0,barH), barW, Math.abs(barH));
    ctx.fillStyle='#8b949e'; ctx.font='9px sans-serif'; ctx.textAlign='center';
    ctx.fillText(l, x+barW/2, base+14);
  });
  ctx.beginPath(); ctx.moveTo(pad,base); ctx.lineTo(w-pad,base); ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.stroke();
}

function drawSetupPerf(){
  const cvs=document.getElementById('chartSetup');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const list=getFilteredTrades().filter(t=>t.setup);
  const setups={};
  list.forEach(t=>{ setups[t.setup]=(setups[t.setup]||0)+(parseFloat(t.pnlUsd)||0); });
  const labels=Object.keys(setups);
  if(!labels.length){
    ctx.fillStyle='#7a8492'; ctx.font='12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(currentLang()==='en'?'No trades logged for this setup type yet':'هنوز داده‌ای با نوع ستاپ ثبت نشده', w/2, h/2);
    return;
  }
  const vals=labels.map(l=>setups[l]);
  const maxVal=Math.max(...vals.map(Math.abs),1);
  const stepX=(w-pad*2)/labels.length;
  const base=pad+(h-pad*2);
  _chartData['chartSetup']={xs:labels.map((_,i)=>pad+i*stepX+stepX*0.55),labels:labels,values:vals,
    fmt:v=>(v>=0?'+$':'$')+v.toFixed(2)};
  labels.forEach((l,i)=>{
    const x=pad+i*stepX+stepX*0.1;
    const barW=stepX*0.8;
    const v=vals[i];
    const barH=(v/maxVal)*((h-pad*2)*0.75);
    ctx.fillStyle=v>=0?'#3fb950':'#f85149';
    ctx.fillRect(x, base-Math.max(0,barH), barW, Math.abs(barH));
    ctx.fillStyle='#8b949e'; ctx.font='8px sans-serif'; ctx.textAlign='center';
    const shortLabel=l.length>10?l.slice(0,9)+'…':l;
    ctx.fillText(shortLabel, x+barW/2, base+13);
  });
  ctx.beginPath(); ctx.moveTo(pad,base); ctx.lineTo(w-pad,base); ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.stroke();
}

function drawRMultiple(){
  const cvs=document.getElementById('chartRMultiple');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  const rmList=getFilteredTrades().map(calcRealR).filter(x=>x!==null);
  if(!rmList.length){
    ctx.fillStyle='#7a8492'; ctx.font='14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(currentLang()==='en'?'Not enough data':'داده کافی نیست',w/2,h/2); return;
  }
  const bins=[-3,-2,-1,0,1,2,3,4];
  const counts=bins.map(()=>0);
  rmList.forEach(r=>{
    for(let i=0;i<bins.length;i++){if(r<bins[i]+1){counts[i]++;return;}}
    counts[bins.length-1]++;
  });
  _chartData['chartRMultiple']={xs:bins.map((_,i)=>pad+i*((w-pad*2)/bins.length)+((w-pad*2)/bins.length)/2),
    labels:bins.map(b=>'R'+b),values:counts,fmt:v=>v+(currentLang()==='en'?' trades':' معامله')};
  const maxC=Math.max(...counts,1);
  const stepX=(w-pad*2)/bins.length;
  const base=pad+(h-pad*2);
  bins.forEach((b,i)=>{
    const x=pad+i*stepX+stepX*0.15;
    const barW=stepX*0.7;
    const barH=(counts[i]/maxC)*((h-pad*2)*0.9);
    ctx.fillStyle=b<0?'#f85149':'#3fb950';
    ctx.fillRect(x, base-barH, barW, barH);
    ctx.fillStyle='#7a8492'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('R'+b, x+barW/2, base+14);
  });
}

function drawDrawdown(){
  const cvs=document.getElementById('chartDrawdown');
  if(!cvs)return;
  const _pc=prepCanvas(cvs); const ctx=_pc.ctx;
  const w=_pc.w, h=_pc.h, pad=40;
  ctx.clearRect(0,0,w,h);
  let equity=parseFloat(settings.startingBalance)||10000, peak=equity;
  const data=trades.slice().reverse().map(t=>{
    equity+=(parseFloat(t.pnlUsd)||0);
    peak=Math.max(peak,equity);
    return {eq:equity,dd:(peak-equity)/peak*100};
  });
  if(!data.length){
    ctx.fillStyle='#7a8492'; ctx.font='14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(currentLang()==='en'?'Not enough data':'داده کافی نیست',w/2,h/2); return;
  }
  const maxDD=Math.max(...data.map(d=>d.dd),1);
  const stepX=(w-pad*2)/(data.length-1||1);

  ctx.beginPath();
  data.forEach((d,i)=>{
    const x=pad+i*stepX;
    const y=pad+(h-pad*2)*(d.dd/maxDD);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.strokeStyle='#f85149'; ctx.lineWidth=2; ctx.stroke();

  ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(w-pad,pad);
  ctx.strokeStyle='#7a8492'; ctx.lineWidth=1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='#7a8492'; ctx.font='11px sans-serif';
  ctx.fillText('Peak', w-pad+4, pad+4);
}

function renderBehavioralAnalysis(list){
  const en=currentLang()==='en';
  const container=document.getElementById('behavioral-analysis');
  if(!container) return;
  list = list || getFilteredTrades();
  const closed=list.filter(t=>t.result==='win'||t.result==='loss');
  if(!closed.length){container.innerHTML='<p style="color:var(--text-faint);font-size:.85rem;">'+(currentLang()==='en'?'Not enough data for behavioral analysis in this range yet.':'هنوز دادهٔ کافی برای تحلیل رفتاری در این بازه وجود ندارد.')+'</p>';return;}

  // tags normalized (lowercase+trim) so "FOMO" and "fomo" count together
  const tagStats={};
  closed.forEach(t=>{
    (t.tags||'').split(',').forEach(tag=>{
      const k=tag.trim().toLowerCase();
      if(!k) return;
      if(!tagStats[k]) tagStats[k]={total:0,loss:0};
      tagStats[k].total++;
      if(t.result==='loss') tagStats[k].loss++;
    });
  });
  const riskyTags=Object.entries(tagStats)
    .filter(([,v])=>v.total>=2)
    .map(([k,v])=>({tag:k,total:v.total,loss:v.loss,rate:Math.round((v.loss/v.total)*100)}))
    .sort((a,b)=>b.rate-a.rate || b.total-a.total)
    .slice(0,4);

  const pairMap={};
  closed.filter(t=>t.result==='loss').forEach(t=>{ pairMap[t.pair]=(pairMap[t.pair]||0)+1; });
  const topPair=Object.entries(pairMap).sort((a,b)=>b[1]-a[1])[0];

  const emoLoss={}, emoWin={};
  closed.forEach(t=>{ (t.result==='loss'?emoLoss:emoWin)[t.emotion]=((t.result==='loss'?emoLoss:emoWin)[t.emotion]||0)+1; });
  const topEmoLoss=Object.entries(emoLoss).sort((a,b)=>b[1]-a[1])[0];
  const topEmoWin=Object.entries(emoWin).sort((a,b)=>b[1]-a[1])[0];
  const emoLabel=k=>k==='fomo'?'FOMO':k==='rushed'?(en?'Rushed':'عجول'):(en?'Calm':'آرام');

  let html=`<div class="grid-3" style="margin-bottom:10px;">`;
  html+=topPair?`<div class="card" style="padding:14px;border-color:var(--amber);"><div style="font-size:.7rem;color:var(--text-faint);">${en?'Top losing pair':'بیشترین ضرر در جفت‌ارز'}</div><div style="font-size:1.05rem;font-weight:700;color:var(--amber);margin-top:4px;">${topPair[0]} (${topPair[1]}${en?'×':' بار'})</div></div>`:'';
  html+=topEmoLoss?`<div class="card" style="padding:14px;border-color:var(--red);"><div style="font-size:.7rem;color:var(--text-faint);">${en?'Dominant emotion in losses':'احساس غالب در ضررها'}</div><div style="font-size:1.05rem;font-weight:700;color:var(--red);margin-top:4px;">${emoLabel(topEmoLoss[0])} (${topEmoLoss[1]}${en?'×':' بار'})</div></div>`:'';
  html+=topEmoWin?`<div class="card" style="padding:14px;border-color:var(--green);"><div style="font-size:.7rem;color:var(--text-faint);">${en?'Dominant emotion in wins':'احساس غالب در بردها'}</div><div style="font-size:1.05rem;font-weight:700;color:var(--green);margin-top:4px;">${emoLabel(topEmoWin[0])} (${topEmoWin[1]}${en?'×':' بار'})</div></div>`:'';
  html+=`</div>`;

  if(riskyTags.length){
    html+='<div style="font-size:.8rem;color:var(--text-dim);margin-bottom:6px;">'+(en?'Highest-risk tags (≥2 occurrences, sorted by loss rate):':'پرریسک‌ترین تگ‌ها (حداقل ۲ بار رخ‌داده، مرتب بر اساس درصد ضرر):')+'</div><div class="grid-2">';
    riskyTags.forEach(rt=>{
      const color=rt.rate>=60?'var(--red)':rt.rate>=40?'var(--amber)':'var(--green)';
      html+=`<div class="card" style="padding:12px;border-color:${color};"><div style="font-size:.85rem;font-weight:700;color:${color};">#${rt.tag}</div><div style="font-size:.76rem;color:var(--text-dim);margin-top:3px;">${rt.total}${en?'× occurred':' بار رخ داده'} · ${rt.rate}% ${en?'were losses':'آن‌ها ضرر بوده'}</div></div>`;
    });
    html+='</div>';
  }
  container.innerHTML=html;
}

