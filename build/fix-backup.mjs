import fs from 'fs';
const P = 'js/backup.js';
let s = fs.readFileSync(P, 'utf8');
const L = "currentLang()==='en'";
const reps = [
  ["toast('⚠️ حافظه مرورگر نزدیک پر شدن است ('+formatBytes(used)+') — فوراً پشتیبان بگیر','error');",
   `toast(${L}?'⚠️ Browser storage is almost full ('+formatBytes(used)+') — back up now':'⚠️ حافظه مرورگر نزدیک پر شدن است ('+formatBytes(used)+') — فوراً پشتیبان بگیر','error');`],
  ["toast('✅ پشتیبان کامل دانلود شد (Schema v'+DATA_SCHEMA_VERSION+')');",
   `toast(${L}?'✅ Full backup downloaded (Schema v'+DATA_SCHEMA_VERSION+')':'✅ پشتیبان کامل دانلود شد (Schema v'+DATA_SCHEMA_VERSION+')');`],
  ["toast('❌ فایل معتبر نیست یا خراب است','error');",
   `toast(${L}?'❌ File is not valid or is corrupted':'❌ فایل معتبر نیست یا خراب است','error');`],
  ["if(!confirm('⚠️ همه داده‌های فعلی برای همیشه جایگزین می‌شوند. مطمئنی؟')) return;",
   `if(!confirm(${L}?'⚠️ All current data will be permanently replaced. Are you sure?':'⚠️ همه داده‌های فعلی برای همیشه جایگزین می‌شوند. مطمئنی؟')) return;`],
  ["toast('✅ جایگزینی کامل انجام شد');",
   `toast(${L}?'✅ Full replace completed':'✅ جایگزینی کامل انجام شد');`],
  ["toast('✅ فقط تنظیمات بازیابی شد');",
   `toast(${L}?'✅ Settings restored':'✅ فقط تنظیمات بازیابی شد');`],
  ["toast('فایل تنظیمات معتبری ندارد','error');",
   `toast(${L}?'File has no valid settings':'فایل تنظیمات معتبری ندارد','error');`],
  ["toast(`✅ ادغام انجام شد — +${result.addedTrades} معامله جدید، ${result.updatedTrades} به‌روز، +${result.addedJournals} ژورنال`);",
   `toast(${L}?\`✅ Merged — +\${result.addedTrades} new trades, \${result.updatedTrades} updated, +\${result.addedJournals} journals\`:\`✅ ادغام انجام شد — +\${result.addedTrades} معامله جدید، \${result.updatedTrades} به‌روز، +\${result.addedJournals} ژورنال\`);`],
  ["toast('❌ خطا در بازیابی','error');",
   `toast(${L}?'❌ Restore error':'❌ خطا در بازیابی','error');`],
  ["toast('معامله‌ای برای خروجی وجود ندارد','error');return;",
   `toast(${L}?'No trades to export':'معامله‌ای برای خروجی وجود ندارد','error');return;`],
  ["toast('✅ CSV دانلود شد');",
   `toast(${L}?'✅ CSV downloaded':'✅ CSV دانلود شد');`]
];
let miss = 0;
for (const [a, b] of reps) {
  if (s.includes(a)) s = s.split(a).join(b);
  else { console.log('MISS:', a.slice(0, 60)); miss++; }
}
fs.writeFileSync(P, s);
console.log('done, missed:', miss);
