import fs from 'fs';
const P = 'index.html';
let s = fs.readFileSync(P, 'utf8');
let miss = 0;
function rep(a, b) { if (!s.includes(a)) { console.log('MISS:', a.slice(0, 80)); miss++; return; } s = s.split(a).join(b); }
function repAll(a, b) { s = s.split(a).join(b); }

// ==================== HISTORY ====================
rep('data-i18n-placeholder="filter.pair"', 'data-i18n-ph="filter.pair"');
rep('data-i18n-option="filter.all"', 'data-i18n="filter.all"');
rep('data-i18n-option="result.win"', 'data-i18n="result.win"');
rep('data-i18n-option="result.loss"', 'data-i18n="result.loss"');
rep('data-i18n-option="result.be"', 'data-i18n="result.be"');
rep('data-i18n-option="result.open"', 'data-i18n="result.open"');
rep('<option value="">همه احساسات</option>', '<option value="" data-i18n="emoF.all">همه احساسات</option>');
rep('<option value="calm">آرام و مطمئن</option>', '<option value="calm" data-i18n="emoF.calm">آرام و مطمئن</option>');
rep('<option value="revenge">انتقام‌جو</option>', '<option value="revenge" data-i18n="emoF.revenge">انتقام‌جو</option>');
rep('<option value="hesitant">مردد/دودل</option>', '<option value="hesitant" data-i18n="emoF.hesitant">مردد/دودل</option>');
rep('<option value="overconfident">بیش‌ازحد مطمئن</option>', '<option value="overconfident" data-i18n="emoF.overconfident">بیش‌ازحد مطمئن</option>');
rep('<option value="bored">بی‌حوصله</option>', '<option value="bored" data-i18n="emoF.bored">بی‌حوصله</option>');
rep('<option value="anxious">مضطرب/نگران</option>', '<option value="anxious" data-i18n="emoF.anxious">مضطرب/نگران</option>');
rep('<option value="rushed">عجول (قدیمی)</option>', '<option value="rushed" data-i18n="emoF.rushed">عجول (قدیمی)</option>');
rep('<button class="btn btn-sm btn-ghost" onclick="clearFilters()">پاک کردن</button>',
    '<button class="btn btn-sm btn-ghost" onclick="clearFilters()" data-i18n="hist.clear">پاک کردن</button>');
rep('<thead><tr><th>تاریخ</th><th>جفت‌ارز</th><th>جهت</th><th>نتیجه</th><th>P&L $</th><th>تکنیکال</th><th>ریسک</th><th>روحی/جسمی</th><th>یادگیری</th><th>تگ‌ها</th><th>عملیات</th></tr></thead>',
    '<thead><tr><th data-i18n="hist.thDate">تاریخ</th><th data-i18n="hist.thPair">جفت‌ارز</th><th data-i18n="hist.thDir">جهت</th><th data-i18n="hist.thResult">نتیجه</th><th>P&L $</th><th data-i18n="score.tech">تکنیکال</th><th data-i18n="score.risk">ریسک</th><th data-i18n="score.mental">روحی/جسمی</th><th data-i18n="score.learning">یادگیری</th><th data-i18n="hist.thTags">تگ‌ها</th><th data-i18n="hist.thActions">عملیات</th></tr></thead>');

// ==================== WATCHLIST ====================
rep('<h3 style="color:var(--green)">🟢 هسته اصلی (قابل ویرایش در تنظیمات)</h3>',
    '<h3 style="color:var(--green)" data-i18n="watch.core">🟢 هسته اصلی (قابل ویرایش در تنظیمات)</h3>');
rep('<h3 style="color:var(--amber)">🟡 با احتیاط</h3>',
    '<h3 style="color:var(--amber)" data-i18n="watch.caution">🟡 با احتیاط</h3>');
rep('<p style="margin:0;color:var(--text-dim);font-size:.85rem;">همبستگی ۰.۸–۰.۹ با BTC — نگه‌داشتن هر دو هم‌زمان تنوع واقعی نمی‌دهد، فقط ریسک روند کریپتو را دوبرابر می‌کند.</p>',
    '<p style="margin:0;color:var(--text-dim);font-size:.85rem;" data-i18n="watch.ethNote">همبستگی ۰.۸–۰.۹ با BTC — نگه‌داشتن هر دو هم‌زمان تنوع واقعی نمی‌دهد، فقط ریسک روند کریپتو را دوبرابر می‌کند.</p>');
rep('<h3 style="color:var(--red)">🔴 ممنوع</h3>',
    '<h3 style="color:var(--red)" data-i18n="watch.forbidden">🔴 ممنوع</h3>');
rep('<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><span class="mono" style="font-weight:700;">جفت‌ارزهای Exotic</span></div>',
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><span class="mono" style="font-weight:700;" data-i18n="watch.exotic">جفت‌ارزهای Exotic</span></div>');
rep('<p style="margin:0;color:var(--text-dim);font-size:.85rem;">TRY، ZAR، MXN و مشابه — اسپرد بالا، نقدینگی کم. اضافه نشود.</p>',
    '<p style="margin:0;color:var(--text-dim);font-size:.85rem;" data-i18n="watch.exoticNote">TRY، ZAR، MXN و مشابه — اسپرد بالا، نقدینگی کم. اضافه نشود.</p>');

// ==================== WEEKLY ====================
rep('<div class="form-group" style="max-width:220px;"><label>هفته منتهی به</label>',
    '<div class="form-group" style="max-width:220px;"><label data-i18n="weekly.ending">هفته منتهی به</label>');
rep('<h3 style="color:var(--cyan);margin:6px 0 10px;">📊 خلاصه‌ی خودکار هفته منتهی به <span id="wr-summary-date" class="mono"></span></h3>',
    '<h3 style="color:var(--cyan);margin:6px 0 10px;"><span data-i18n="weekly.autoTitle">📊 خلاصه‌ی خودکار هفته منتهی به</span> <span id="wr-summary-date" class="mono"></span></h3>');
rep('<h3 style="color:var(--amber);margin-bottom:8px;">🤖 پیشنهاد این هفته</h3>',
    '<h3 style="color:var(--amber);margin-bottom:8px;" data-i18n="weekly.suggestTitle">🤖 پیشنهاد این هفته</h3>');
rep('<p class="chart-caption">بر اساس همین آمار بالا — نه حدس.</p>',
    '<p class="chart-caption" data-i18n="weekly.suggestCap">بر اساس همین آمار بالا — نه حدس.</p>');
rep('<div class="chart-title">📈 روند هفته‌به‌هفته — وین‌ریت (توپر) / پایبندی (نقطه‌چین)</div>',
    '<div class="chart-title" data-i18n="weekly.trendTitle">📈 روند هفته‌به‌هفته — وین‌ریت (توپر) / پایبندی (نقطه‌چین)</div>');
rep('<div class="form-group"><label>۱. بزرگترین اشتباه هفته و علتش چه بود؟</label><textarea id="wr-mistake"></textarea></div>',
    '<div class="form-group"><label data-i18n="weekly.q1">۱. بزرگترین اشتباه هفته و علتش چه بود؟</label><textarea id="wr-mistake"></textarea></div>');
rep('<div class="form-group"><label>۲. کدام تصمیم بیشترین ارزش را داشت؟</label><textarea id="wr-best"></textarea></div>',
    '<div class="form-group"><label data-i18n="weekly.q2">۲. کدام تصمیم بیشترین ارزش را داشت؟</label><textarea id="wr-best"></textarea></div>');
rep('<div class="form-group"><label>۳. هدف هفته آینده؟</label><textarea id="wr-goal"></textarea></div>',
    '<div class="form-group"><label data-i18n="weekly.q3">۳. هدف هفته آینده؟</label><textarea id="wr-goal"></textarea></div>');
rep('<div class="form-group"><label>۴. یک درس کلیدی (یک جمله)</label><input type="text" id="wr-lesson"></div>',
    '<div class="form-group"><label data-i18n="weekly.q4">۴. یک درس کلیدی (یک جمله)</label><input type="text" id="wr-lesson"></div>');
rep('<div class="form-group"><label>🎯 تمرین تمرکزی هفته آینده (Focus Drill — یک مهارت واحد)</label><input type="text" id="wr-drill" placeholder="مثال: فقط Sweep خارجی روی EURUSD / بدون ترید بعد از ۲ برد پیاپی..."></div>',
    '<div class="form-group"><label data-i18n="weekly.drill">🎯 تمرین تمرکزی هفته آینده (Focus Drill — یک مهارت واحد)</label><input type="text" id="wr-drill" placeholder="مثال: فقط Sweep خارجی روی EURUSD / بدون ترید بعد از ۲ برد پیاپی..." data-i18n-ph="weekly.drillPh"></div>');
rep('<button class="btn btn-primary btn-block" onclick="saveWeeklyReview()" aria-label="ذخیره بازبینی هفتگی">💾 ذخیره بازبینی هفتگی</button>',
    '<button class="btn btn-primary btn-block" onclick="saveWeeklyReview()" aria-label="ذخیره بازبینی هفتگی" data-i18n-aria="weekly.save" data-i18n="weekly.save">💾 ذخیره بازبینی هفتگی</button>');
rep('<h3 style="color:var(--purple);margin-bottom:4px;">🗂️ تاریخچه‌ی بازبینی‌های قبلی</h3>',
    '<h3 style="color:var(--purple);margin-bottom:4px;" data-i18n="weekly.histTitle">🗂️ تاریخچه‌ی بازبینی‌های قبلی</h3>');
rep('<p class="chart-caption" style="margin-bottom:10px;">هر بار که فرم بالا را ذخیره می‌کنی، همین‌جا زیر هم اضافه می‌شود.</p>',
    '<p class="chart-caption" style="margin-bottom:10px;" data-i18n="weekly.histCap">هر بار که فرم بالا را ذخیره می‌کنی، همین‌جا زیر هم اضافه می‌شود.</p>');

// ==================== ROUTINE ====================
rep('<h3 style="color:var(--amber)">⏰ نکته‌ی مهم درباره‌ی ساعت‌ها</h3>',
    '<h3 style="color:var(--amber)" data-i18n="routine.tzTitle">⏰ نکته‌ی مهم درباره‌ی ساعت‌ها</h3>');
rep('<p style="color:var(--text-dim);font-size:.85rem;margin-bottom:10px;">ایران از سال ۲۰۲۲ ساعت تابستانی ندارد',
    '<p style="color:var(--text-dim);font-size:.85rem;margin-bottom:10px;" data-i18n="routine.tzDesc">ایران از سال ۲۰۲۲ ساعت تابستانی ندارد');
rep('<thead><tr><th>فاز</th><th>زمستان بریتانیا/آمریکا (~آبان تا اسفند)</th><th>تابستان بریتانیا/آمریکا (~فروردین تا مهر)</th></tr></thead>',
    '<thead><tr><th data-i18n="routine.thPhase">فاز</th><th data-i18n="routine.thWinter">زمستان بریتانیا/آمریکا (~آبان تا اسفند)</th><th data-i18n="routine.thSummer">تابستان بریتانیا/آمریکا (~فروردین تا مهر)</th></tr></thead>');
rep('<tr><td>Kill Zone لندن</td>', '<tr><td data-i18n="routine.kzLondon">Kill Zone لندن</td>');
rep('<tr><td>Overlap + نیویورک</td>', '<tr><td data-i18n="routine.kzNy">Overlap + نیویورک</td>');

// ==================== SETTINGS ====================
rep('<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;line-height:1.7;">\n          داده‌ها روی همین دستگاه (مرورگر) ذخیره می‌شوند. برای استفاده روی لپ‌تاپ + موبایل:',
    '<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;line-height:1.7;" data-i18n="settings.multiDesc">\n          داده‌ها روی همین دستگاه (مرورگر) ذخیره می‌شوند. برای استفاده روی لپ‌تاپ + موبایل:');
rep('<button class="btn btn-sm btn-primary" onclick="downloadBackup()">⬇️ دانلود پشتیبان کامل</button>',
    '<button class="btn btn-sm btn-primary" onclick="downloadBackup()" data-i18n="settings.dlFull">⬇️ دانلود پشتیبان کامل</button>');
s = s.split('⬆️ بازیابی / ادغام\n            <input').join('<span data-i18n="settings.restoreMerge">⬆️ بازیابی / ادغام</span>\n            <input');
rep('<h3>💰 موجودی اولیه حساب</h3>', '<h3 data-i18n="settings.balanceTitle">💰 موجودی اولیه حساب</h3>');
rep('<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;">برای محاسبه‌ی درست درصد Drawdown در تب «عملکرد» استفاده می‌شود.</p>',
    '<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="settings.balanceDesc">برای محاسبه‌ی درست درصد Drawdown در تب «عملکرد» استفاده می‌شود.</p>');
rep('<button class="btn btn-primary" onclick="saveAccountBalance()" aria-label="ذخیره موجودی">ذخیره موجودی</button>',
    '<button class="btn btn-primary" onclick="saveAccountBalance()" aria-label="ذخیره موجودی" data-i18n-aria="settings.saveBalance" data-i18n="settings.saveBalance">ذخیره موجودی</button>');
rep('<h3>🛑 حد ضرر روزانه (٪ حساب)</h3>', '<h3 data-i18n="settings.lossCapTitle">🛑 حد ضرر روزانه (٪ حساب)</h3>');
rep('<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;">اگر مجموع P&L بسته‌شده‌ی امروز به این درصد برسد',
    '<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="settings.lossCapDesc">اگر مجموع P&L بسته‌شده‌ی امروز به این درصد برسد');
rep('<button class="btn btn-primary" onclick="saveDailyLossCap()" aria-label="ذخیره حد ضرر">ذخیره حد ضرر</button>',
    '<button class="btn btn-primary" onclick="saveDailyLossCap()" aria-label="ذخیره حد ضرر" data-i18n-aria="settings.saveLossCap" data-i18n="settings.saveLossCap">ذخیره حد ضرر</button>');
rep('<h3>📜 قرارداد تریدر</h3>', '<h3 data-i18n="settings.contractTitle">📜 قرارداد تریدر</h3>');
rep('<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;">این متن هر روز در داشبورد نمایش داده می‌شود.</p>',
    '<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="settings.contractDesc">این متن هر روز در داشبورد نمایش داده می‌شود.</p>');
rep('<button class="btn btn-primary" onclick="saveContract()" aria-label="ذخیره قرارداد">ذخیره قرارداد</button>',
    '<button class="btn btn-primary" onclick="saveContract()" aria-label="ذخیره قرارداد" data-i18n-aria="settings.saveContract" data-i18n="settings.saveContract">ذخیره قرارداد</button>');
rep('<h3>☀️/🌙 تم</h3>', '<h3 data-i18n="settings.themeTitle">☀️/🌙 تم</h3>');
rep('<button class="btn btn-ghost" onclick="toggleTheme()" aria-label="تغییر تم">تغییر تم روشن/تیره</button>',
    '<button class="btn btn-ghost" onclick="toggleTheme()" aria-label="تغییر تم" data-i18n-aria="settings.toggleTheme" data-i18n="settings.toggleTheme">تغییر تم روشن/تیره</button>');
rep('<h3>👁️ هسته اصلی واچ‌لیست</h3>', '<h3 data-i18n="settings.watchTitle">👁️ هسته اصلی واچ‌لیست</h3>');
rep('<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;">فقط این ابزارها در فرم «ثبت معامله» قابل انتخابند — از تایپ آزاد و ناهماهنگی نام‌ها جلوگیری می‌کند.</p>',
    '<p style="font-size:.82rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="settings.watchDesc">فقط این ابزارها در فرم «ثبت معامله» قابل انتخابند — از تایپ آزاد و ناهماهنگی نام‌ها جلوگیری می‌کند.</p>');
rep('placeholder="مثلاً EURUSD"', 'placeholder="مثلاً EURUSD" data-i18n-ph="settings.pairPh"');
rep('<button class="btn btn-sm btn-success" onclick="addWatchlistItem()" aria-label="افزودن ابزار">+ افزودن</button>',
    '<button class="btn btn-sm btn-success" onclick="addWatchlistItem()" aria-label="افزودن ابزار" data-i18n-aria="settings.addPair" data-i18n="settings.addPair">+ افزودن</button>');
rep('<h3>⚙️ مدیریت چک‌لیست صبحگاهی</h3>', '<h3 data-i18n="settings.dailyMgr">⚙️ مدیریت چک‌لیست صبحگاهی</h3>');
rep('<h3>⚙️ مدیریت چک‌لیست قبل از ورود</h3>', '<h3 data-i18n="settings.preMgr">⚙️ مدیریت چک‌لیست قبل از ورود</h3>');
rep('<p style="font-size:.78rem;color:var(--text-faint);margin-bottom:8px;">هر آیتم به یک «مرحله» از چک‌لیست پلکانی داشبورد تعلق دارد.</p>',
    '<p style="font-size:.78rem;color:var(--text-faint);margin-bottom:8px;" data-i18n="settings.preMgrDesc">هر آیتم به یک «مرحله» از چک‌لیست پلکانی داشبورد تعلق دارد.</p>');
repAll('placeholder="متن آیتم"', 'placeholder="متن آیتم" data-i18n-ph="settings.itemPh"');
repAll('<option value="tech">تکنیکال</option>', '<option value="tech" data-i18n="catOpt.tech">تکنیکال</option>');
repAll('<option value="risk">ریسک</option>', '<option value="risk" data-i18n="catOpt.risk">ریسک</option>');
repAll('<option value="mental">روحی/جسمی</option>', '<option value="mental" data-i18n="catOpt.mental">روحی/جسمی</option>');
repAll('<option value="learning">یادگیری</option>', '<option value="learning" data-i18n="catOpt.learning">یادگیری</option>');
repAll('placeholder="امتیاز"', 'placeholder="امتیاز" data-i18n-ph="settings.ptsPh"');
repAll('> حیاتی</label>', ' data-i18n="settings.critical"> حیاتی</label>'.trimStart());
rep('<h3 style="margin:0;">🗑️ آیتم‌های حذف‌شده (سطل بازیافت)</h3>',
    '<h3 style="margin:0;" data-i18n="settings.trashTitle">🗑️ آیتم‌های حذف‌شده (سطل بازیافت)</h3>');
rep('<button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="clearTrash()">پاک‌کردن کامل سطل</button>',
    '<button class="btn btn-sm btn-ghost" style="color:var(--red)" onclick="clearTrash()" data-i18n="settings.emptyTrash">پاک‌کردن کامل سطل</button>');
rep('<p style="font-size:.8rem;color:var(--text-dim);margin-bottom:10px;">آیتم‌های چک‌لیست حذف‌شده تا ۲۰ مورد آخر اینجا نگه داشته می‌شوند و قابل بازگردانی‌اند.</p>',
    '<p style="font-size:.8rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="settings.trashDesc">آیتم‌های چک‌لیست حذف‌شده تا ۲۰ مورد آخر اینجا نگه داشته می‌شوند و قابل بازگردانی‌اند.</p>');

// ==================== MODALS ====================
rep('<div class="modal-header"><h3>✏️ ویرایش آیتم چک‌لیست</h3></div>',
    '<div class="modal-header"><h3 data-i18n="edit.title">✏️ ویرایش آیتم چک‌لیست</h3></div>');
rep('<div class="form-group"><label>متن آیتم</label><input type="text" id="ei-text"></div>',
    '<div class="form-group"><label data-i18n="settings.itemLabel">متن آیتم</label><input type="text" id="ei-text"></div>');
rep('<div class="form-group"><label>دسته</label>', '<div class="form-group"><label data-i18n="edit.cat">دسته</label>');
rep('<div class="form-group"><label>امتیاز</label>', '<div class="form-group"><label data-i18n="edit.pts">امتیاز</label>');
rep('<div class="form-group" id="ei-stage-group"><label>مرحله (چک‌لیست قبل از ورود)</label>',
    '<div class="form-group" id="ei-stage-group"><label data-i18n="edit.stage">مرحله (چک‌لیست قبل از ورود)</label>');
rep('<input type="checkbox" id="ei-critical"> آیتم الزامی (★) — بدون تیک این، ورود مجاز نیست',
    '<input type="checkbox" id="ei-critical"> <span data-i18n="edit.criticalHint">آیتم الزامی (★) — بدون تیک این، ورود مجاز نیست</span>');
rep('<button class="btn btn-ghost" onclick="closeEditItemModal()" aria-label="انصراف">انصراف</button>',
    '<button class="btn btn-ghost" onclick="closeEditItemModal()" aria-label="انصراف" data-i18n-aria="common.cancel" data-i18n="common.cancel">انصراف</button>');
rep('<button class="btn btn-primary" onclick="saveEditedItem()" aria-label="ذخیره تغییرات">💾 ذخیره</button>',
    '<button class="btn btn-primary" onclick="saveEditedItem()" aria-label="ذخیره تغییرات" data-i18n-aria="common.save" data-i18n="common.save">💾 ذخیره</button>');
rep('<div class="modal-header"><h3>✏️ ویرایش فاز روتین</h3></div>',
    '<div class="modal-header"><h3 data-i18n="redit.title">✏️ ویرایش فاز روتین</h3></div>');
rep('<div class="form-group"><label>عنوان فاز</label><input type="text" id="re-title" placeholder="مثلاً: فاز اول · زمینه‌سازی عصبی"></div>',
    '<div class="form-group"><label data-i18n="redit.phaseTitle">عنوان فاز</label><input type="text" id="re-title" placeholder="مثلاً: فاز اول · زمینه‌سازی عصبی" data-i18n-ph="redit.phaseTitlePh"></div>');
rep('<div class="form-group"><label>بازه‌ی زمانی (نمایشی)</label>', '<div class="form-group"><label data-i18n="redit.window">بازه‌ی زمانی (نمایشی)</label>');
rep('<div class="form-group"><label>رنگ</label>', '<div class="form-group"><label data-i18n="redit.color">رنگ</label>');
rep('<option value="purple">بنفش</option>', '<option value="purple" data-i18n="redit.purple">بنفش</option>');
rep('<option value="amber">کهربایی</option>', '<option value="amber" data-i18n="redit.amber">کهربایی</option>');
rep('<option value="cyan">فیروزه‌ای</option>', '<option value="cyan" data-i18n="redit.cyan">فیروزه‌ای</option>');
rep('<option value="green">سبز</option>', '<option value="green" data-i18n="redit.green">سبز</option>');
rep('<option value="red">قرمز</option>', '<option value="red" data-i18n="redit.red">قرمز</option>');
rep('<label>آیتم‌های این فاز — هر خط: «ساعت|عنوان|توضیح» (چند نکته را با ~ جدا کن)</label>',
    '<label data-i18n="redit.itemsLabel">آیتم‌های این فاز — هر خط: «ساعت|عنوان|توضیح» (چند نکته را با ~ جدا کن)</label>');
rep('placeholder="06:30|بیداری|۵۰۰ml آب~۲۰ دقیقه اول گوشی نباشد"', 'placeholder="06:30|بیداری|۵۰۰ml آب~۲۰ دقیقه اول گوشی نباشد" data-i18n-ph="redit.itemsPh"');
rep('<button class="btn btn-ghost" onclick="closeRoutineEdit()" aria-label="انصراف">انصراف</button>',
    '<button class="btn btn-ghost" onclick="closeRoutineEdit()" aria-label="انصراف" data-i18n-aria="common.cancel" data-i18n="common.cancel">انصراف</button>');
rep('<button class="btn btn-primary" onclick="saveRoutineEdit()" aria-label="ذخیره فاز">💾 ذخیره</button>',
    '<button class="btn btn-primary" onclick="saveRoutineEdit()" aria-label="ذخیره فاز" data-i18n-aria="common.save" data-i18n="common.save">💾 ذخیره</button>');
rep('<div class="modal-header"><h3>ثبت نتیجه معامله</h3>', '<div class="modal-header"><h3 data-i18n="result.title">ثبت نتیجه معامله</h3>');
rep('<div class="form-group"><label>نتیجه</label>', '<div class="form-group"><label data-i18n="result.resultLabel">نتیجه</label>');
rep('<option value="open">باز</option><option value="win">✅ سود</option><option value="loss">❌ ضرر</option><option value="be">➖ سر به سر</option>',
    '<option value="open" data-i18n="result.open">باز</option><option value="win" data-i18n="result.winOpt">✅ سود</option><option value="loss" data-i18n="result.lossOpt">❌ ضرر</option><option value="be" data-i18n="result.beOpt">➖ سر به سر</option>');
rep('<h4 style="font-size:.85rem;color:var(--text-dim);margin-bottom:10px;">🧮 Post-Trade Checklist — ۳ سوال اجباری</h4>',
    '<h4 style="font-size:.85rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="result.postTitle">🧮 Post-Trade Checklist — ۳ سوال اجباری</h4>');
rep('<label>۱. آیا استاپ را جابجا کردم؟</label>', '<label data-i18n="result.q1">۱. آیا استاپ را جابجا کردم؟</label>');
rep('<label>۲. آیا خارج از پلن خارج شدم؟</label>', '<label data-i18n="result.q2">۲. آیا خارج از پلن خارج شدم؟</label>');
rep('<label>۳. آیا احساسات دخیل بود؟</label>', '<label data-i18n="result.q3">۳. آیا احساسات دخیل بود؟</label>');
rep('<div class="form-group"><label>تگ‌های معامله (با کاما جدا کن)</label>', '<div class="form-group"><label data-i18n="result.tagsLabel">تگ‌های معامله (با کاما جدا کن)</label>');
rep('<div class="form-group"><label>یادداشت نتیجه / درس</label>', '<div class="form-group"><label data-i18n="result.noteLabel">یادداشت نتیجه / درس</label>');
rep('placeholder="چرا این نتیجه رخ داد؟"', 'placeholder="چرا این نتیجه رخ داد؟" data-i18n-ph="result.notePh"');
rep('<p class="chart-caption" style="margin-top:4px;">یک یادداشت واقعی (حداقل ۱۵ حرف) در Learning Score این معامله لحاظ می‌شود.</p>',
    '<p class="chart-caption" style="margin-top:4px;" data-i18n="result.noteHint">یک یادداشت واقعی (حداقل ۱۵ حرف) در Learning Score این معامله لحاظ می‌شود.</p>');
rep('<button class="btn btn-ghost" onclick="closeResultModal()">انصراف</button>',
    '<button class="btn btn-ghost" onclick="closeResultModal()" data-i18n="common.cancel">انصراف</button>');
rep('<button class="btn btn-primary" onclick="saveResult()" aria-label="ذخیره نتیجه">ذخیره نتیجه</button>',
    '<button class="btn btn-primary" onclick="saveResult()" aria-label="ذخیره نتیجه" data-i18n-aria="result.save" data-i18n="result.save">ذخیره نتیجه</button>');
rep('<div class="modal-header"><h3>📜 قرارداد با خود</h3></div>',
    '<div class="modal-header"><h3 data-i18n="contract.title">📜 قرارداد با خود</h3></div>');
rep('قبل از شروع، این تعهد را بخوان و بپذیر:<br><br>',
    '<span data-i18n="contract.intro">قبل از شروع، این تعهد را بخوان و بپذیر:</span><br><br>');
rep('<input type="checkbox" id="contract-agree"> این قرارداد را می‌پذیرم و هر روز آن را به یاد دارم.',
    '<input type="checkbox" id="contract-agree"> <span data-i18n="contract.check">این قرارداد را می‌پذیرم و هر روز آن را به یاد دارم.</span>');
rep('⚙️ ویرایش قرارداد در تنظیمات\n      </button>',
    '<span data-i18n="contract.edit">⚙️ ویرایش قرارداد در تنظیمات</span>\n      </button>');
rep('<button class="btn btn-primary btn-block" onclick="acceptContract()" aria-label="تأیید و شروع">تأیید و شروع</button>',
    '<button class="btn btn-primary btn-block" onclick="acceptContract()" aria-label="تأیید و شروع" data-i18n-aria="contract.accept" data-i18n="contract.accept">تأیید و شروع</button>');
rep('<h3>🔄 بازیابی / ادغام چنددستگاهی</h3>',
    '<h3 data-i18n="restore.title">🔄 بازیابی / ادغام چنددستگاهی</h3>');
rep('<button class="modal-close" onclick="closeRestoreModal()" aria-label="بستن">×</button>',
    '<button class="modal-close" onclick="closeRestoreModal()" aria-label="بستن" data-i18n-aria="common.close">×</button>');
rep('<button class="modal-close" onclick="closeResultModal()" aria-label="بستن">×</button>',
    '<button class="modal-close" onclick="closeResultModal()" aria-label="بستن" data-i18n-aria="common.close">×</button>');

fs.writeFileSync(P, s);
console.log('done. missed:', miss);
