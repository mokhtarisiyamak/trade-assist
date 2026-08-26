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

patch('js/result-modal.js', [
  ["toast('🚫 دومین ضرر امروز — علاوه بر قفل ۲ ساعته، تا پایان امروز قفل کامل فعال شد','error');",
   `toast(${EN}?'🚫 Second loss today — full lock now active until end of day, on top of the 2-hour stop':'🚫 دومین ضرر امروز — علاوه بر قفل ۲ ساعته، تا پایان امروز قفل کامل فعال شد','error');`],
  ["toast('⏳ قفل ۲ ساعته فعال شد (طبق قانون: بعد از هر ضرر یا BE)','error');",
   `toast(${EN}?'⏳ 2-hour forced stop started (rule: after every loss or BE)':'⏳ قفل ۲ ساعته فعال شد (طبق قانون: بعد از هر ضرر یا BE)','error');`],
  ["toast('🚨 این ضرر از سقف مطلق ۲٪ سرمایه عبور کرده — طبق موانع فیزیکی #۵، سیستم را کامل بازبینی کن','error');",
   `toast(${EN}?'🚨 This loss exceeds the absolute 2% capital cap — per physical barrier #5, do a full system review':'🚨 این ضرر از سقف مطلق ۲٪ سرمایه عبور کرده — طبق موانع فیزیکی #۵، سیستم را کامل بازبینی کن','error');`],
  ["if(!text){toast('متن یادداشت را وارد کنید','error');return}",
   `if(!text){toast(${EN}?'Enter a note':'متن یادداشت را وارد کنید','error');return}`],
  ["toast('✅ ژورنال ذخیره شد');", `toast(${EN}?'✅ Journal saved':'✅ ژورنال ذخیره شد');`],
  ["تکنیکال: ${j.tech}", "${EN?'Technical':'تکنیکال'}: ${j.tech}"],
  ["ریسک: ${j.risk}", "${EN?'Risk':'ریسک'}: ${j.risk}"],
  ["روحی/جسمی: ${j.mental}", "${EN?'Mental/Physical':'روحی/جسمی'}: ${j.mental}"],
  ["یادگیری: ${j.learning}", "${EN?'Learning':'یادگیری'}: ${j.learning}"],
  ["'⚠️ خروج از پلن'", "${EN?'⚠️ Off-plan exit':'⚠️ خروج از پلن'}"],
  ["فردا: ${j.tomorrow}", "${EN?'Tomorrow':'فردا'}: ${j.tomorrow}"],
  ["onclick=\"deleteJournal('${j.id}')\">حذف</button>", "onclick=\"deleteJournal('${j.id}')\">${EN?'Delete':'حذف'}</button>"],
  ["function deleteJournal(id){if(!confirm('آیا مطمئنید؟'))return;",
   `function deleteJournal(id){if(!confirm(${EN}?'Are you sure?':'آیا مطمئنید؟'))return;`],
]);

patch('js/weekly.js', [
  ["toast('✅ بازبینی هفتگی ذخیره شد');", `toast(${EN}?'✅ Weekly review saved':'✅ بازبینی هفتگی ذخیره شد');`],
  ["🎯 تمرین هفته: ${escapeHTML(w.drill)}", "🎯 ${EN?'Week drill':'تمرین هفته'}: ${escapeHTML(w.drill)}"],
  ["هفته منتهی به ${w.date}", "${EN?'Week ending':'هفته منتهی به'} ${w.date}"],
  ["onclick=\"deleteWeekly('${w.id}')\">حذف</button>", "onclick=\"deleteWeekly('${w.id}')\">${EN?'Delete':'حذف'}</button>"],
  ["<span>معاملات: <strong>${w.tradesCount}</strong></span>", "<span>${EN?'Trades':'معاملات'}: <strong>${w.tradesCount}</strong></span>"],
  ["<span>وین‌ریت: <strong style=\"color:var(--cyan)\">${w.winRate}%</strong></span>", "<span>${EN?'Win rate':'وین‌ریت'}: <strong style=\"color:var(--cyan)\">${w.winRate}%</strong></span>"],
  ["<span>پایبندی: <strong>${w.adherence!==null&&w.adherence!==undefined?w.adherence+'%':'-'}</strong></span>", "<span>${EN?'Adherence':'پایبندی'}: <strong>${w.adherence!==null&&w.adherence!==undefined?w.adherence+'%':'-'}</strong></span>"],
  ["پرتکرارترین تگ ضرر: <strong>${w.topLossTag}</strong>", "${EN?'Top loss tag':'پرتکرارترین تگ ضرر'}: <strong>${w.topLossTag}</strong>"],
  ["<strong>بزرگترین اشتباه:</strong> ${escapeHTML(w.mistake)}", "<strong>${EN?'Biggest mistake':'بزرگترین اشتباه'}:</strong> ${escapeHTML(w.mistake)}"],
  ["<strong>الگوی تکراری:</strong> ${escapeHTML(w.pattern)}", "<strong>${EN?'Repeating pattern':'الگوی تکراری'}:</strong> ${escapeHTML(w.pattern)}"],
  ["<strong>بهترین تصمیم:</strong> ${escapeHTML(w.best)}", "<strong>${EN?'Best decision':'بهترین تصمیم'}:</strong> ${escapeHTML(w.best)}"],
  ["<strong>هدف آینده:</strong> ${escapeHTML(w.goal)}", "<strong>${EN?'Future goal':'هدف آینده'}:</strong> ${escapeHTML(w.goal)}"],
  ["<strong>درس:</strong> ${escapeHTML(w.lesson)}", "<strong>${EN?'Lesson':'درس'}:</strong> ${escapeHTML(w.lesson)}"],
  ["function deleteWeekly(id){if(!confirm('آیا مطمئنید؟'))return;",
   `function deleteWeekly(id){if(!confirm(${EN}?'Are you sure?':'آیا مطمئنید؟'))return;`],
]);

patch('js/settings-page.js', [
  ["if(!updated.title){toast('عنوان فاز را وارد کن','error');return;}",
   `if(!updated.title){toast(${EN}?'Enter the phase title':'عنوان فاز را وارد کن','error');return;}`],
  ["toast('✅ روتین ذخیره شد');", `toast(${EN}?'✅ Routine saved':'✅ روتین ذخیره شد');`],
  ["if(!confirm('این فاز حذف شود؟')) return;", `if(!confirm(${EN}?'Delete this phase?':'این فاز حذف شود؟')) return;`],
  ["${tr.listType==='daily'?'صبحگاهی':'پیش‌ورود'}", "${tr.listType==='daily'?(EN?'Morning':'صبحگاهی'):(EN?'Pre-entry':'پیش‌ورود')}"],
  ["onclick=\"restoreTrashItem(${idx})\">↩️ بازیابی</button>", "onclick=\"restoreTrashItem(${idx})\">↩️ ${EN?'Restore':'بازیابی'}</button>"],
  ["onclick=\"purgeTrashItem(${idx})\">حذف کامل</button>", "onclick=\"purgeTrashItem(${idx})\">${EN?'Delete forever':'حذف کامل'}</button>"],
  ["toast('✅ آیتم بازیابی شد');", `toast(${EN}?'✅ Item restored':'✅ آیتم بازیابی شد');`],
  ["if(!confirm('این آیتم برای همیشه پاک می‌شود. مطمئنید؟'))return;",
   `if(!confirm(${EN}?'This item will be permanently deleted. Sure?':'این آیتم برای همیشه پاک می‌شود. مطمئنید؟'))return;`],
  ["if(!confirm('همه آیتم‌های سطل بازیافت برای همیشه پاک می‌شوند. مطمئنید؟'))return;",
   `if(!confirm(${EN}?'All trash items will be permanently deleted. Sure?':'همه آیتم‌های سطل بازیافت برای همیشه پاک می‌شوند. مطمئنید؟'))return;`],
  ["toast('سطل بازیافت خالی شد');", `toast(${EN}?'Trash emptied':'سطل بازیافت خالی شد');`],
  ["if(!text){toast('متن آیتم را وارد کنید','error');return;}", `if(!text){toast(${EN}?'Enter item text':'متن آیتم را وارد کنید','error');return;}`],
  ["if(!confirm('این آیتم حذف شود؟ (بعداً از سطل بازیافت قابل بازگردانی است)'))return;",
   `if(!confirm(${EN}?'Delete this item? (recoverable from trash later)':'این آیتم حذف شود؟ (بعداً از سطل بازیافت قابل بازگردانی است)'))return;`],
  ["toast('آیتم حذف شد — از سطل بازیافت قابل بازگردانی است');",
   `toast(${EN}?'Item deleted — recoverable from the trash bin':'آیتم حذف شد — از سطل بازیافت قابل بازگردانی است');`],
  ["list.innerHTML='<p style=\"font-size:.8rem;color:var(--text-faint)\">هیچ ابزاری اضافه نشده.</p>';",
   `list.innerHTML='<p style="font-size:.8rem;color:var(--text-faint)">'+(${EN}?'No instruments added.':'هیچ ابزاری اضافه نشده.')+'</p>';`],
  ["if(!sym){toast('نام ابزار را وارد کنید','error');return;}",
   `if(!sym){toast(${EN}?'Enter an instrument name':'نام ابزار را وارد کنید','error');return;}`],
  ["if(settings.watchlist.includes(sym)){toast('این ابزار قبلاً اضافه شده','error');return;}",
   `if(settings.watchlist.includes(sym)){toast(${EN}?'Instrument already added':'این ابزار قبلاً اضافه شده','error');return;}`],
  ["toast('✅ به واچ‌لیست اضافه شد');", `toast(${EN}?'✅ Added to watchlist':'✅ به واچ‌لیست اضافه شد');`],
]);

patch('js/rules.js', [
  ["toast('ابتدا تیک پذیرش را بزنید','error'); return;", `toast(${EN}?'Tick the acceptance checkbox first':'ابتدا تیک پذیرش را بزنید','error'); return;`],
  ["toast('✅ موجودی حساب ذخیره شد');", `toast(${EN}?'✅ Account balance saved':'✅ موجودی حساب ذخیره شد');`],
  ["toast('✅ حد ضرر روزانه: '+settings.dailyLossCapPercent+'٪');",
   `toast(${EN}?'✅ Daily loss cap: '+settings.dailyLossCapPercent+'%':'✅ حد ضرر روزانه: '+settings.dailyLossCapPercent+'٪');`],
]);

fs.writeFileSync('tools/build/.done2', 'ok');
console.log('total missed:', totalMiss);
