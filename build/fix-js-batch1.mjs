import fs from 'fs';
const EN = "currentLang()==='en'";
let totalMiss = 0;

function patch(file, reps) {
  let s = fs.readFileSync(file, 'utf8');
  let miss = 0;
  for (const [a, b] of reps) {
    if (s.includes(a)) s = s.split(a).join(b);
    else { console.log(file, 'MISS:', a.slice(0, 70)); miss++; }
  }
  fs.writeFileSync(file, s);
  console.log(file, 'done, missed:', miss);
  totalMiss += miss;
}

patch('js/history.js', [
  ["const resText=t.result==='win'?'سود':t.result==='loss'?'ضرر':t.result==='be'?'سر به سر':'باز';",
   `const resText=t.result==='win'?t('result.win'):t.result==='loss'?t('result.loss'):t.result==='be'?t('result.be'):t('result.open');`],
  ["labels:bins.map(b=>'R'+b),values:counts,fmt:v=>v+' معامله'};",
   `labels:bins.map(b=>'R'+b),values:counts,fmt:v=>v+(EN?' trades':' معامله')};`],
  ["const emoLabel=k=>k==='fomo'?'FOMO':k==='rushed'?'عجول':'آرام';",
   `const emoLabel=k=>k==='fomo'?'FOMO':k==='rushed'?(EN?'Rushed':'عجول'):(EN?'Calm':'آرام');`],
  ["بیشترین ضرر در جفت‌ارز", "بیشترین ضرر در جفت‌ارز"], // placeholder replaced below
]);
// history.js behavioral labels need full-line replacements (multiline templates)
{
  let s = fs.readFileSync('js/history.js', 'utf8');
  const en = EN;
  s = s.replace("بیشترین ضرر در جفت‌ارز", "${en?'Top losing pair':'بیشترین ضرر در جفت‌ارز'}");
  s = s.replace("احساس غالب در ضررها", "${en?'Dominant emotion in losses':'احساس غالب در ضررها'}");
  s = s.replace("احساس غالب در بردها", "${en?'Dominant emotion in wins':'احساس غالب در بردها'}");
  s = s.replace("(${topPair[1]} بار)", "(${topPair[1]}${en?'×':' بار'})");
  s = s.replace("(${topEmoLoss[1]} بار)", "(${topEmoLoss[1]}${en?'×':' بار'})");
  s = s.replace("(${topEmoWin[1]} بار)", "(${topEmoWin[1]}${en?'×':' بار'})");
  s = s.replace("پرریسک‌ترین تگ‌ها (حداقل ۲ بار رخ‌داده، مرتب بر اساس درصد ضرر):",
    "${en?'Highest-risk tags (≥2 occurrences, sorted by loss rate):':'پرریسک‌ترین تگ‌ها (حداقل ۲ بار رخ‌داده، مرتب بر اساس درصد ضرر):'}");
  s = s.replace("${rt.total} بار رخ داده · ${rt.rate}٪ آن‌ها ضرر بوده",
    "${rt.total}${en?'× occurred':' بار رخ داده'} · ${rt.rate}% ${en?'were losses':'آن‌ها ضرر بوده'}");
  // ensure `const en` exists in renderBehavioralAnalysis
  s = s.replace('function renderBehavioralAnalysis(list){', 'function renderBehavioralAnalysis(list){\n  const en=currentLang()===\'en\';');
  fs.writeFileSync('js/history.js', s);
  console.log('history.js behavioral labels done');
}

patch('js/main.js', [
  ["toast(`⚙️ سبک ترید به ${val.toUpperCase()} تغییر کرد ( سطوح و تایم‌فریم آپدیت شد )`);",
   `toast(${EN}?\`⚙️ Trade style changed to \${val.toUpperCase()} (levels & timeframes updated)\`:\`⚙️ سبک ترید به \${val.toUpperCase()} تغییر کرد ( سطوح و تایم‌فریم آپدیت شد )\`);`],
  ["if(storEl) storEl.textContent = 'حافظه: ' + formatBytes(estimateStorageUsage());",
   `if(storEl) storEl.textContent = (currentLang()==='en'?'Storage: ':'حافظه: ') + formatBytes(estimateStorageUsage());`],
  ["if(el) el.textContent = 'حافظه: ' + formatBytes(estimateStorageUsage());",
   `if(el) el.textContent = (currentLang()==='en'?'Storage: ':'حافظه: ') + formatBytes(estimateStorageUsage());`],
]);

patch('js/trade-form.js', [
  ["el.value = (riskUsd/Math.abs(entry-sl)).toFixed(4)+' واحد';",
   `el.value = (riskUsd/Math.abs(entry-sl)).toFixed(4)+(EN?' units':' واحد');`],
  ["if(opts.showToast) toast(opts.toastMsg || 'فرم پر شد');",
   `if(opts.showToast) toast(opts.toastMsg || (${EN}?'Form filled':'فرم پر شد'));`],
  ["toast('فرم پاک شد');", `toast(${EN}?'Form cleared':'فرم پاک شد');`],
  ["if(!trades.length){ toast('هنوز معامله‌ای ثبت نشده','error'); return; }",
   `if(!trades.length){ toast(${EN}?'No trades logged yet':'هنوز معامله‌ای ثبت نشده','error'); return; }`],
  ["if(!src){ toast('معامله‌ای برای کپی نیست','error'); return; }",
   `if(!src){ toast(${EN}?'No trade to copy from':'معامله‌ای برای کپی نیست','error'); return; }`],
  ["}, {showToast:true, toastMsg: 'کپی شد از ' + (src.pair||'') + ' · ' + (src.date||'')});",
   `}, {showToast:true, toastMsg: (${EN}?'Copied from ':'کپی شد از ') + (src.pair||'') + ' · ' + (src.date||'')});`],
  ["if(isLockedOut()){ toast('🔴 Lockout فعال است — امروز ۲ ضرر خورده‌ای، تا فردا صبر کن','error'); return; }",
   `if(isLockedOut()){ toast(${EN}?'🔴 Lockout active — 2 losses today, wait until tomorrow':'🔴 Lockout فعال است — امروز ۲ ضرر خورده‌ای، تا فردا صبر کن','error'); return; }`],
  ["if(isForcedStop()){ toast('⏳ قفل ۲ ساعته فعال است — صبر کن','error'); return; }",
   `if(isForcedStop()){ toast(${EN}?'⏳ 2-hour forced stop active — wait':'⏳ قفل ۲ ساعته فعال است — صبر کن','error'); return; }`],
  ["if(rp===0){ toast('🔴 ورود ممنوع — ابتدا هر دو چک‌لیست را تکمیل کن.','error'); return; }",
   `if(rp===0){ toast(${EN}?'🔴 Entry blocked — complete both checklists first.':'🔴 ورود ممنوع — ابتدا هر دو چک‌لیست را تکمیل کن.','error'); return; }`],
  ["if(isDailyLossBreached()){ toast('🛑 حد ضرر روزانه ('+(settings.dailyLossCapPercent||2)+'٪) پر شده — ثبت معامله تا فردا بسته است','error'); return; }",
   `if(isDailyLossBreached()){ toast(${EN}?'🛑 Daily loss cap ('+(settings.dailyLossCapPercent||2)+'%) hit — trading locked until tomorrow':'🛑 حد ضرر روزانه ('+(settings.dailyLossCapPercent||2)+'٪) پر شده — ثبت معامله تا فردا بسته است','error'); return; }`],
  ["if(!confirm('⚠️ ریسک پلن ($'+planRisk.toFixed(2)+') از سقف امروز ($'+allowedUsd.toFixed(2)+' = '+rp+'٪) بیشتر است.\\nبا امتیاز '+cs.total+' فقط '+rp+'٪ مجاز است.\\n\\nآگاهانه نقض می‌کنم و ثبت می‌کنم؟')){",
   `if(!confirm(${EN}?'⚠️ Planned risk ($'+planRisk.toFixed(2)+') exceeds today\\'s cap ($'+allowedUsd.toFixed(2)+' = '+rp+'%).\\nWith score '+cs.total+' only '+rp+'% is allowed.\\n\\nKnowingly violate and log?':'⚠️ ریسک پلن ($'+planRisk.toFixed(2)+') از سقف امروز ($'+allowedUsd.toFixed(2)+' = '+rp+'٪) بیشتر است.\\nبا امتیاز '+cs.total+' فقط '+rp+'٪ مجاز است.\\n\\nآگاهانه نقض می‌کنم و ثبت می‌کنم؟')){`],
  ["toast('ثبت لغو شد — ریسک را با سقف امروز تنظیم کن','error');",
   `toast(${EN}?'Logging cancelled — adjust risk to today\\'s cap':'ثبت لغو شد — ریسک را با سقف امروز تنظیم کن','error');`],
  ["if(!confirm('⚠️ تناقض بایاس: وضعیت بازار امروز «'+biasFa+'» ثبت شده ولی داری '+chosenDir+' می‌گیری.\\n\\nباز هم ثبت شود؟')){",
   `if(!confirm(${EN}?'⚠️ Bias conflict: today\\'s market condition is \"'+biasEn+'\" but you are taking '+chosenDir+'.\\n\\nLog anyway?':'⚠️ تناقض بایاس: وضعیت بازار امروز «'+biasFa+'» ثبت شده ولی داری '+chosenDir+' می‌گیری.\\n\\nباز هم ثبت شود؟')){`],
  ["toast('ثبت لغو شد — بایاس یا جهت را بررسی کن','error');",
   `toast(${EN}?'Logging cancelled — check bias or direction':'ثبت لغو شد — بایاس یا جهت را بررسی کن','error');`],
  ["if(!pair){toast('جفت‌ارز را وارد کنید','error');return}",
   `if(!pair){toast(${EN}?'Enter a pair':'جفت‌ارز را وارد کنید','error');return}`],
  ["toast('🛑 تیک تاییدیه پله سوم را بزن یا این معامله را نگیر','error');",
   `toast(${EN}?'🛑 Tick the tier-3 confirmation or skip this trade':'🛑 تیک تاییدیه پله سوم را بزن یا این معامله را نگیر','error');`],
  ["toast('✅ معامله ثبت شد');", `toast(${EN}?'✅ Trade saved':'✅ معامله ثبت شد');`],
  ["if(!src){ toast('معامله پیدا نشد','error'); return; }",
   `if(!src){ toast(${EN}?'Trade not found':'معامله پیدا نشد','error'); return; }`],
  ["}, {showToast:true, toastMsg:'کپی شد — فرم را بررسی و ثبت کن'});",
   `}, {showToast:true, toastMsg:${EN}?'Copied — review the form and save':'کپی شد — فرم را بررسی و ثبت کن'});`],
  ["toast('🔴 هنگام فعال بودن قفل، حذف معامله مجاز نیست — قانون: با ضرر روبه‌رو شو، آن را پاک نکن','error');",
   `toast(${EN}?'🔴 Deleting trades is blocked while lockout is active — face the loss, do not erase it':'🔴 هنگام فعال بودن قفل، حذف معامله مجاز نیست — قانون: با ضرر روبه‌رو شو، آن را پاک نکن','error');`],
  ["if(!confirm('آیا مطمئنید؟'))return;", `if(!confirm(${EN}?'Are you sure?':'آیا مطمئنید؟'))return;`],
]);

fs.writeFileSync('tools/build/.done', 'ok');
console.log('total missed:', totalMiss);
