import fs from 'fs';
const P = 'index.html';
let s = fs.readFileSync(P, 'utf8');
let miss = 0;
function rep(a, b) { if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70)); miss++; return; } s = s.split(a).join(b); }

// ---- performance: stat tiles ----
rep('<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);">رکورد ضرر متوالی</div>',
    '<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);" data-i18n="perf.streak">رکورد ضرر متوالی</div>');
rep('<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);">تعداد معامله</div>',
    '<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);" data-i18n="perf.count">تعداد معامله</div>');
rep('<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);">میانگین Execution Score</div>',
    '<div style="font-family:var(--mono);font-size:.65rem;color:var(--text-faint);" data-i18n="perf.avgExec">میانگین Execution Score</div>');

// ---- performance: range options ----
rep('<option value="week" selected>هفته اخیر (۷ روز)</option>',
    '<option value="week" selected data-i18n="perf.rangeWeek">هفته اخیر (۷ روز)</option>');
rep('<option value="month">ماه اخیر (۳۰ روز)</option>',
    '<option value="month" data-i18n="perf.rangeMonth">ماه اخیر (۳۰ روز)</option>');
rep('<option value="d90">۹۰ روز اخیر</option>',
    '<option value="d90" data-i18n="perf.rangeD90">۹۰ روز اخیر</option>');
rep('<option value="all">کل تاریخچه</option>',
    '<option value="all" data-i18n="perf.rangeAll">کل تاریخچه</option>');
rep('<option value="custom">بازه سفارشی</option>',
    '<option value="custom" data-i18n="perf.rangeCustom">بازه سفارشی</option>');

// ---- chart titles + captions ----
rep('<div class="chart-title">🎯 رادار سه‌بعدی — امروز vs میانگین ۷ روز</div>',
    '<div class="chart-title" data-i18n="perf.radarTitle">🎯 رادار سه‌بعدی — امروز vs میانگین ۷ روز</div>');
rep('<p class="chart-caption">در کدام بُعد (تکنیکال/ریسک/روحی-جسمی) نسبت به میانگین ۷ روز اخیر قوی‌تر یا ضعیف‌تری.</p>',
    '<p class="chart-caption" data-i18n="perf.radarCap">در کدام بُعد (تکنیکال/ریسک/روحی-جسمی) نسبت به میانگین ۷ روز اخیر قوی‌تر یا ضعیف‌تری.</p>');
rep('<div class="chart-title">📈 P&L انباشته — بازه انتخابی</div>',
    '<div class="chart-title" data-i18n="perf.pnlTitle">📈 P&L انباشته — بازه انتخابی</div>');
rep('<p class="chart-caption">روند تجمعی سود و زیان در بازه‌ی انتخاب‌شده — صعودی یعنی داری پیشرفت می‌کنی.</p>',
    '<p class="chart-caption" data-i18n="perf.pnlCap">روند تجمعی سود و زیان در بازه‌ی انتخاب‌شده — صعودی یعنی داری پیشرفت می‌کنی.</p>');
rep('<h3 style="color:var(--green);margin-bottom:10px;">🧭 همبستگی امتیاز چک‌لیست با نتیجه</h3>',
    '<h3 style="color:var(--green);margin-bottom:10px;" data-i18n="perf.corrTitle">🧭 همبستگی امتیاز چک‌لیست با نتیجه</h3>');
rep('<p class="chart-caption">آیا معاملاتی که با امتیاز اجرای بالاتر گرفته شده‌اند، واقعاً وین‌ریت بهتری داشته‌اند؟</p>',
    '<p class="chart-caption" data-i18n="perf.corrCap">آیا معاملاتی که با امتیاز اجرای بالاتر گرفته شده‌اند، واقعاً وین‌ریت بهتری داشته‌اند؟</p>');
rep('<div class="chart-title">⚔️ Win / Loss / BE — بازه انتخابی</div>',
    '<div class="chart-title" data-i18n="perf.wlTitle">⚔️ Win / Loss / BE — بازه انتخابی</div>');
rep('<p class="chart-caption">چند درصد معاملات این بازه برد، باخت یا سربه‌سر بودند.</p>',
    '<p class="chart-caption" data-i18n="perf.wlCap">چند درصد معاملات این بازه برد، باخت یا سربه‌سر بودند.</p>');
rep('<div class="chart-title">📏 R-Multiple Distribution</div>',
    '<div class="chart-title" data-i18n="perf.rdistTitle">📏 R-Multiple Distribution</div>');
rep('<p class="chart-caption">نسبت سود به ریسک واقعی معاملات — هرچه بیشتر سمت راست، بهتر.</p>',
    '<p class="chart-caption" data-i18n="perf.rdistCap">نسبت سود به ریسک واقعی معاملات — هرچه بیشتر سمت راست، بهتر.</p>');
rep('<p class="chart-caption">کدام روز هفته بهترین یا بدترین نتیجه را در این بازه داشته.</p>',
    '<p class="chart-caption" data-i18n="perf.dowCap">کدام روز هفته بهترین یا بدترین نتیجه را در این بازه داشته.</p>');
rep('<p class="chart-caption">کدام ابزار بیشترین سود یا ضرر را در این بازه ساخته.</p>',
    '<p class="chart-caption" data-i18n="perf.pairCap">کدام ابزار بیشترین سود یا ضرر را در این بازه ساخته.</p>');
rep('<div class="chart-title">🌍 عملکرد بر اساس بازه زمانی روز</div>',
    '<div class="chart-title" data-i18n="perf.sessTitle">🌍 عملکرد بر اساس بازه زمانی روز</div>');
rep('<p class="chart-caption">آسیا / قبل از لندن / لندن / قبل از نیویورک / نیویورک — کدام بازه بهتر عمل کرده‌ای.</p>',
    '<p class="chart-caption" data-i18n="perf.sessCap">آسیا / قبل از لندن / لندن / قبل از نیویورک / نیویورک — کدام بازه بهتر عمل کرده‌ای.</p>');
rep('<div class="chart-title">🧬 عملکرد بر اساس نوع ستاپ (Trade DNA)</div>',
    '<div class="chart-title" data-i18n="perf.setupTitle">🧬 عملکرد بر اساس نوع ستاپ (Trade DNA)</div>');
rep('<p class="chart-caption">کدام نوع ستاپ (Judas Swing، Continuation، Sweep و ...) برایت بهتر جواب داده.</p>',
    '<p class="chart-caption" data-i18n="perf.setupCap">کدام نوع ستاپ (Judas Swing، Continuation، Sweep و ...) برایت بهتر جواب داده.</p>');
rep('<h3 style="color:var(--red);margin-bottom:4px;">🧠 تحلیل رفتاری — بردها در برابر باخت‌ها</h3>',
    '<h3 style="color:var(--red);margin-bottom:4px;" data-i18n="perf.behavTitle">🧠 تحلیل رفتاری — بردها در برابر باخت‌ها</h3>');
rep('<p class="chart-caption" style="margin-bottom:10px;">پرتکرارترین تگ، جفت‌ارز و احساس در معاملات ضررده‌ی این بازه، در مقایسه با بردها.</p>',
    '<p class="chart-caption" style="margin-bottom:10px;" data-i18n="perf.behavCap">پرتکرارترین تگ، جفت‌ارز و احساس در معاملات ضررده‌ی این بازه، در مقایسه با بردها.</p>');
rep('<h3 style="color:var(--gold-400);margin-bottom:4px;">🧬 مدل‌سنج — کدام مرحله/ستاپ/احساس واقعاً پول می‌سازد؟</h3>',
    '<h3 style="color:var(--gold-400);margin-bottom:4px;" data-i18n="perf.modelTitle">🧬 مدل‌سنج — کدام مرحله/ستاپ/احساس واقعاً پول می‌سازد؟</h3>');
rep('<p class="chart-caption" style="margin-bottom:10px;">میانگین R هر مرحله از چک‌لیست قبل از ورود، هر ستاپ و هر احساس. سبز = لبه‌ی تو، قرمز = نشت پول. بعد از ~۳۰ معامله بسته‌شده معنی‌دار می‌شود.</p>',
    '<p class="chart-caption" style="margin-bottom:10px;" data-i18n="perf.modelCap">میانگین R هر مرحله از چک‌لیست قبل از ورود، هر ستاپ و هر احساس. سبز = لبه‌ی تو، قرمز = نشت پول. بعد از ~۳۰ معامله بسته‌شده معنی‌دار می‌شود.</p>');
rep('<div class="chart-title">📉 Equity Curve + Drawdown (کل تاریخچه، مستقل از فیلتر بازه)</div>',
    '<div class="chart-title" data-i18n="perf.eqTitle">📉 Equity Curve + Drawdown (کل تاریخچه، مستقل از فیلتر بازه)</div>');
rep('<p class="chart-caption">بیشترین افت سرمایه از قله‌ی قبلی — نشان می‌دهد ریسک واقعی چقدر بوده.</p>',
    '<p class="chart-caption" data-i18n="perf.eqCap">بیشترین افت سرمایه از قله‌ی قبلی — نشان می‌دهد ریسک واقعی چقدر بوده.</p>');
rep('<div class="chart-title">🍩 توزیع کلی نتایج</div>',
    '<div class="chart-title" data-i18n="perf.distTitle">🍩 توزیع کلی نتایج</div>');
rep('<p class="chart-caption">نسبت کلی برد/باخت/سربه‌سر در بازه‌ی انتخاب‌شده.</p>',
    '<p class="chart-caption" data-i18n="perf.distCap">نسبت کلی برد/باخت/سربه‌سر در بازه‌ی انتخاب‌شده.</p>');

fs.writeFileSync(P, s);
console.log('done. missed:', miss);
