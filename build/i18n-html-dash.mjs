import fs from 'fs';
const P = 'index.html';
let s = fs.readFileSync(P, 'utf8');
let miss = 0;
function rep(a, b) {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70)); miss++; return; }
  s = s.split(a).join(b);
}

// ---- lang gate / nav / sidebar aria ---- (applied earlier via Edit; nothing here)

// ---- dashboard: contract banner ----
rep('<strong style="display:block;">📜 قرارداد با خود:</strong>',
    '<strong style="display:block;" data-i18n="contract.title">📜 قرارداد با خود:</strong>');

// ---- session plan ----
rep('<span class="collapse-title">🗺️ پلن سشن امروز</span>',
    '<span class="collapse-title" data-i18n="dash.session">🗺️ پلن سشن امروز</span>');
rep('<p style="font-size:.8rem;color:var(--text-dim);margin-bottom:10px;">قبل از لندن بنویس: چه ابزاری؟ کدام سطح‌ها؟ سناریوی A (sweep پایین→خرید) و B؟ فقط همان را اجرا کن.</p>',
    '<p style="font-size:.8rem;color:var(--text-dim);margin-bottom:10px;" data-i18n="dash.sessionHint">قبل از لندن بنویس: چه ابزاری؟ کدام سطح‌ها؟ سناریوی A (sweep پایین→خرید) و B؟ فقط همان را اجرا کن.</p>');
rep('placeholder="مثال: فقط XAUUSD — PDH/PDL رسم شده — سناریو A: sweep پاین PDL → CHoCH م15 → خرید به PDH..."',
    'placeholder="مثال: فقط XAUUSD — PDH/PDL رسم شده — سناریو A: sweep پاین PDL → CHoCH م15 → خرید به PDH..." data-i18n-ph="dash.sessionPh"');

// ---- checklists ----
rep('<span>☀️ چک‌لیست صبحگاهی (امتیاز پایه روزانه)</span>',
    '<span data-i18n="dash.morning">☀️ چک‌لیست صبحگاهی (امتیاز پایه روزانه)</span>');
rep('<span>✅ چک‌لیست قبل از ورود</span>',
    '<span data-i18n="dash.pre">✅ چک‌لیست قبل از ورود</span>');
rep('<button class="btn btn-sm btn-ghost" onclick="openChecklistSettings()">⚙️ ویرایش چک‌لیست</button>',
    '<button class="btn btn-sm btn-ghost" onclick="openChecklistSettings()" data-i18n="dash.editChecklist">⚙️ ویرایش چک‌لیست</button>');

// ---- new trade toggle + forced stop ----
rep('<span>➕ ثبت معامله جدید</span>', '<span data-i18n="dash.newTrade">➕ ثبت معامله جدید</span>');
rep('<h3>⏳ Forced Stop</h3>\n            <p>بعد از هر ضرر یا BE، قبل از معامله بعدی ۲ ساعت صبر کن.</p>',
    '<h3 data-i18n="lockout.title">⏳ Forced Stop</h3>\n            <p data-i18n="lockout.desc">بعد از هر ضرر یا BE، قبل از معامله بعدی ۲ ساعت صبر کن.</p>');

// ---- form: direction aria + pos-size title ----
rep('<div class="seg" role="radiogroup" aria-label="جهت معامله">',
    '<div class="seg" role="radiogroup" aria-label="جهت معامله" data-i18n-aria="form.dirAria">');
rep('<label title="riskUsd ÷ |ورود−استاپ| — برای فارکس تقریبی">سایز (واحدِ قیمت)</label>',
    '<label title="riskUsd ÷ |ورود−استاپ| — برای فارکس تقریبی" data-i18n-title="form.posSizeTitle">سایز (واحدِ قیمت)</label>');

// ---- exit strategy options ----
rep('<option value="liquidityBased" selected>Liquidity-based (هدف: PDH/PDL/Session)</option>',
    '<option value="liquidityBased" selected data-i18n="form.exitLiq">Liquidity-based (هدف: PDH/PDL/Session)</option>');
rep('<option value="timeBased">Time-based (خروج سر ساعت/ناهار)</option>',
    '<option value="timeBased" data-i18n="form.exitTime">Time-based (خروج سر ساعت/ناهار)</option>');

// ---- setup options (value stays Persian = data compat; only label translates) ----
rep('<option value="Sweep نقدینگی داخلی">Sweep نقدینگی داخلی</option>',
    '<option value="Sweep نقدینگی داخلی" data-i18n="setup.internal">Sweep نقدینگی داخلی</option>');
rep('<option value="Sweep نقدینگی خارجی">Sweep نقدینگی خارجی</option>',
    '<option value="Sweep نقدینگی خارجی" data-i18n="setup.external">Sweep نقدینگی خارجی</option>');
rep('<option value="برگشت از Order Block">برگشت از Order Block</option>',
    '<option value="برگشت از Order Block" data-i18n="setup.obRev">برگشت از Order Block</option>');
rep('<option value="پرشدن FVG">پرشدن FVG</option>',
    '<option value="پرشدن FVG" data-i18n="setup.fvg">پرشدن FVG</option>');
rep('<option value="Turtle Soup">Turtle Soup (شکست کاذب سقف/کف قدیمی)</option>',
    '<option value="Turtle Soup" data-i18n="setup.turtle">Turtle Soup (شکست کاذب سقف/کف قدیمی)</option>');
rep('<option value="Silver Bullet">Silver Bullet (ستاپ زمان‌محور)</option>',
    '<option value="Silver Bullet" data-i18n="setup.silver">Silver Bullet (ستاپ زمان‌محور)</option>');
rep('<option value="Unicorn Model">Unicorn Model (تلاقی OB + FVG)</option>',
    '<option value="Unicorn Model" data-i18n="setup.unicorn">Unicorn Model (تلاقی OB + FVG)</option>');

// ---- liquidity options ----
rep('<option value="BSL (Buyside)">BSL — نقدینگی خرید (بالای بازار)</option>',
    '<option value="BSL (Buyside)" data-i18n="liq.bsl">BSL — نقدینگی خرید (بالای بازار)</option>');
rep('<option value="SSL (Sellside)">SSL — نقدینگی فروش (پایین بازار)</option>',
    '<option value="SSL (Sellside)" data-i18n="liq.ssl">SSL — نقدینگی فروش (پایین بازار)</option>');
rep('<option value="سقف/کف سشن">سقف/کف سشن</option>',
    '<option value="سقف/کف سشن" data-i18n="liq.session">سقف/کف سشن</option>');

// ---- draft row buttons ----
rep('<button type="button" class="btn btn-sm btn-ghost" onclick="copyLastSimilarTrade()" title="کپی از آخرین معامله مشابه یا آخرین معامله">📋 کپی از معامله مشابه</button>',
    '<button type="button" class="btn btn-sm btn-ghost" onclick="copyLastSimilarTrade()" title="کپی از آخرین معامله مشابه یا آخرین معامله" data-i18n-title="form.copyTitle" data-i18n="form.copySimilar">📋 کپی از معامله مشابه</button>');
rep('<button type="button" class="btn btn-sm btn-ghost" onclick="clearTradeForm(true)" title="پاک کردن فرم و پیش‌نویس">🗑️ پاک کردن فرم</button>',
    '<button type="button" class="btn btn-sm btn-ghost" onclick="clearTradeForm(true)" title="پاک کردن فرم و پیش‌نویس" data-i18n-title="form.clearTitle" data-i18n="form.clear">🗑️ پاک کردن فرم</button>');
rep('<button class="btn btn-primary btn-block" id="btn-save-trade" onclick="saveNewTrade()" aria-label="ثبت معامله">💾 ثبت معامله</button>',
    '<button class="btn btn-primary btn-block" id="btn-save-trade" onclick="saveNewTrade()" aria-label="ثبت معامله" data-i18n-aria="form.save" data-i18n="form.save">💾 ثبت معامله</button>');
rep('<span class="draft-badge" id="draft-indicator" style="display:none;">📝 پیش‌نویس ذخیره شده</span>',
    '<span class="draft-badge" id="draft-indicator" style="display:none;" data-i18n="form.draft">📝 پیش‌نویس ذخیره شده</span>');

// ---- today trades empty state ----
rep('<div class="empty-state"><div class="icon">💼</div><h3>هنوز معامله‌ای ثبت نشده</h3><p>معامله اول را از بخش بالا ثبت کنید</p></div>',
    '<div class="empty-state"><div class="icon">💼</div><h3 data-i18n="empty.noTrades">هنوز معامله‌ای ثبت نشده</h3><p data-i18n="empty.noTradesHint">معامله اول را از بخش بالا ثبت کنید</p></div>');

// ---- journal / evening reflection ----
rep('<span>💼 معاملات امروز</span>', '<span data-i18n="dash.todayTrades">💼 معاملات امروز</span>');
rep('<span>📝 ژورنال پایان روز + تأمل</span>', '<span data-i18n="dash.journal">📝 ژورنال پایان روز + تأمل</span>');
rep('<h4 style="color:var(--purple);margin-bottom:12px;">🧠 Evening Reflection — ۳ سوال ثابت</h4>',
    '<h4 style="color:var(--purple);margin-bottom:12px;" data-i18n="journal.reflection">🧠 Evening Reflection — ۳ سوال ثابت</h4>');
rep('<label>۱. آیا امروز Revenge Trading کردم؟</label>',
    '<label data-i18n="journal.q1">۱. آیا امروز Revenge Trading کردم؟</label>');
rep('<label>۲. آیا از پلن خارج شدم؟</label>',
    '<label data-i18n="journal.q2">۲. آیا از پلن خارج شدم؟</label>');
rep('<label>۳. اگر فردا تکرار شود، چه می‌کنم؟</label>',
    '<label data-i18n="journal.q3">۳. اگر فردا تکرار شود، چه می‌کنم؟</label>');
rep('<label>⭐ بهترین تصمیم امروز</label>', '<label data-i18n="journal.best">⭐ بهترین تصمیم امروز</label>');
rep('<label>⚠️ بدترین تصمیم امروز</label>', '<label data-i18n="journal.worst">⚠️ بدترین تصمیم امروز</label>');
s = s.split('<option value="no">خیر</option><option value="yes">بله</option>').join('<option value="no" data-i18n="common.no">خیر</option><option value="yes" data-i18n="common.yes">بله</option>');
rep('placeholder="یک جمله..."', 'placeholder="یک جمله..." data-i18n-ph="journal.oneLine"');
rep('<h4 style="color:var(--cyan);margin-bottom:4px;font-size:.9rem;">📊 نمره‌دهی روزانه — خودکار</h4>',
    '<h4 style="color:var(--cyan);margin-bottom:4px;font-size:.9rem;" data-i18n="journal.scoring">📊 نمره‌دهی روزانه — خودکار</h4>');
rep('<p style="font-size:.76rem;color:var(--text-faint);margin-bottom:10px;">بر اساس چک‌لیست‌های امروز + معاملات ثبت‌شده + پاسخ‌های بالا محاسبه می‌شود.</p>',
    '<p style="font-size:.76rem;color:var(--text-faint);margin-bottom:10px;" data-i18n="journal.scoringDesc">بر اساس چک‌لیست‌های امروز + معاملات ثبت‌شده + پاسخ‌های بالا محاسبه می‌شود.</p>');
rep('<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);">تکنیکال</div>',
    '<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);" data-i18n="score.tech">تکنیکال</div>');
rep('<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);">ریسک</div>',
    '<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);" data-i18n="score.risk">ریسک</div>');
rep('<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);">روحی/جسمی</div>',
    '<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);" data-i18n="score.mental">روحی/جسمی</div>');
rep('<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);">یادگیری</div>',
    '<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);" data-i18n="score.learning">یادگیری</div>');
rep('<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);">اجرا (میانگین معاملات بسته‌شده امروز)</div>',
    '<div style="font-family:var(--mono);font-size:.68rem;color:var(--text-faint);" data-i18n="score.execution">اجرا (میانگین معاملات بسته‌شده امروز)</div>');
rep('<label>یادداشت روز / درس کلیدی</label>', '<label data-i18n="journal.noteLabel">یادداشت روز / درس کلیدی</label>');
rep('placeholder="امروز چه اتفاقی افتاد؟ چه درسی گرفتم؟"', 'placeholder="امروز چه اتفاقی افتاد؟ چه درسی گرفتم؟" data-i18n-ph="journal.notePh"');
rep('<label>تگ‌های روز (با کاما جدا کن)</label>', '<label data-i18n="journal.tagsLabel">تگ‌های روز (با کاما جدا کن)</label>');
rep('<button class="btn btn-success btn-block" onclick="saveJournal()" aria-label="ذخیره ژورنال">📝 ذخیره ژورنال روزانه</button>',
    '<button class="btn btn-success btn-block" onclick="saveJournal()" aria-label="ذخیره ژورنال" data-i18n-aria="journal.save" data-i18n="journal.save">📝 ذخیره ژورنال روزانه</button>');

fs.writeFileSync(P, s);
console.log('done. missed:', miss);
