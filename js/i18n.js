// ===== i18n v6.2 =====
const I18N = {
  fa: {
    'nav.dashboard':'داشبورد روزانه','nav.guide':'راهنمای مکانیکی','nav.history':'آرشیو معاملات',
    'nav.watchlist':'واچ‌لیست','nav.performance':'عملکرد','nav.weekly':'بازبینی هفتگی',
    'nav.routine':'روتین روزانه','nav.settings':'تنظیمات',
    'sidebar.storage':'حافظه: —','sidebar.backup':'⬇️ پشتیبان','sidebar.restore':'⬆️ بازیابی',
    'sidebar.csv':'📄 خروجی CSV',
    'sidebar.multidevice':'چنددستگاهی: پشتیبان بگیر → فایل را در دستگاه دیگر بازیابی کن (ادغام هوشمند)',
    'dash.title':'داشبورد روزانه','dash.compact':'📱 فشرده','dash.compactOff':'📱 عادی',
    'dash.newTrade':'➕ ثبت معامله جدید','dash.todayTrades':'💼 معاملات امروز',
    'dash.journal':'📝 ژورنال پایان روز + تأمل','dash.morning':'☀️ چک‌لیست صبحگاهی',
    'dash.pre':'✅ چک‌لیست قبل از ورود','dash.session':'🗺️ پلن سشن امروز',
    'form.pair':'جفت‌ارز (هسته واچ‌لیست)','form.dir':'جهت','form.entry':'قیمت ورود',
    'form.sl':'قیمت استاپ','form.tp':'قیمت تارگت','form.rr':'R:R (خودکار)',
    'form.allowedRisk':'ریسک مجاز امروز','form.riskUsd':'ریسک پلن دلاری ($)',
    'form.posSize':'سایز (واحدِ قیمت)','form.emotion':'احساس هنگام ورود',
    'form.style':'سبک ترید (تایم‌فریم/سطوح)','form.exit':'استراتژی خروج (Take Profit)',
    'form.setup':'نوع ستاپ','form.liquidity':'نوع نقدینگی','form.poi':'نوع POI',
    'form.note':'یادداشت / دلیل ورود','form.save':'💾 ثبت معامله',
    'form.copySimilar':'📋 کپی از معامله مشابه','form.clear':'🗑️ پاک کردن فرم',
    'form.draft':'📝 پیش‌نویس ذخیره شده','form.copyToForm':'📋 کپی به فرم',
    'perf.title':'عملکرد','perf.sub':'روند، آمار، و الگوهای رفتاری در بازه‌ی زمانی انتخابی',
    'hist.title':'آرشیو معاملات','hist.sub':'تمام معاملات با فیلتر پیشرفته',
    'watch.title':'واچ‌لیست — ابزارهای مجاز','watch.sub':'فقط این ابزارها معامله شوند؛ کیفیت مهم‌تر از تعداد است',
    'weekly.title':'بازبینی هفتگی','weekly.sub':'خلاصه‌ی خودکار هفته + چند سوال هدفمند برای رشد',
    'routine.title':'روتین روزانه','routine.sub':'برنامه‌ی فاز‌به‌فاز روز — قابل‌ویرایش و شخصی‌سازی',
    'settings.title':'تنظیمات','settings.sub':'شخصی‌سازی چک‌لیست، قرارداد، سلامت، و ظاهر',
    'settings.langTitle':'🌐 زبان / Language','settings.langDesc':'رابط کاربری را بین فارسی و انگلیسی جابه‌جا کنید.',
    'settings.multiTitle':'📱 چنددستگاهی و پشتیبان',
    'guide.title':'راهنمای مکانیکی ترید','guide.sub':'مرجع جامع مدل نقدینگی (The Model) + تصمیم‌گیری بدون احساسات',
    'toast.langFa':'زبان: فارسی','toast.langEn':'Language: English',
    'toast.backupOk':'✅ پشتیبان کامل دانلود شد','toast.restoreOk':'✅ بازیابی با موفقیت انجام شد',
    'toast.mergeOk':'✅ ادغام انجام شد','toast.saved':'✅ ذخیره شد','toast.tradeSaved':'✅ معامله ثبت شد',
    'toast.draftCleared':'فرم پاک شد','toast.copied':'کپی شد','toast.contractSaved':'قرارداد ذخیره شد',
    'cat.tech':'📈 تکنیکال','cat.risk':'🛡️ ریسک','cat.mental':'🧠 روحی/جسمی','cat.learning':'📚 یادگیری',
    'emotion.calm':'😌 آرام و مطمئن','emotion.fomo':'😵 FOMO','emotion.revenge':'😡 انتقام‌جو',
    'emotion.hesitant':'🤔 مردد','emotion.overconfident':'😎 بیش‌ازحد مطمئن',
    'emotion.bored':'🥱 بی‌حوصله','emotion.anxious':'😰 مضطرب',
    'result.win':'سود','result.loss':'ضرر','result.be':'سر به سر','result.open':'باز',
    'contract.accept':'تأیید و شروع','contract.edit':'⚙️ ویرایش قرارداد در تنظیمات',
    'contract.check':'این قرارداد را می‌پذیرم و هر روز آن را به یاد دارم.',
    'contract.title':'📜 قرارداد با خود',
    'restore.title':'🔄 بازیابی / ادغام چنددستگاهی',
    'restore.merge':'🔀 ادغام هوشمند (پیشنهادی)','restore.replace':'⚠️ جایگزینی کامل همه داده‌ها',
    'restore.settingsOnly':'⚙️ فقط تنظیمات','restore.cancel':'انصراف',
    'empty.noTrades':'هنوز معامله‌ای ثبت نشده','empty.noTradesHint':'معامله اول را از بخش بالا ثبت کنید',
    'gate.title':"زبان / Language",
    'gate.desc':"زبان رابط کاربری را انتخاب کنید.<br>Choose your interface language.",
    'gate.en':"🇬🇧 Continue in English",
    'gate.fa':"🇮🇷 ادامه به فارسی",
    'dash.sessionHint':"قبل از لندن بنویس: چه ابزاری؟ کدام سطح‌ها؟ سناریوی A (sweep پایین→خرید) و B؟ فقط همان را اجرا کن.",
    'dash.sessionPh':"مثال: فقط XAUUSD — PDH/PDL رسم شده — سناریو A: sweep پاین PDL → CHoCH م15 → خرید به PDH...",
    'dash.editChecklist':"⚙️ ویرایش چک‌لیست",
    'lockout.title':"⏳ توقف اجباری",
    'lockout.desc':"بعد از هر ضرر یا BE، قبل از معامله بعدی ۲ ساعت صبر کن.",
    'form.dirAria':"جهت معامله",
    'form.posSizeTitle':"riskUsd ÷ |ورود−استاپ| — برای فارکس تقریبی",
    'form.exitLiq':"Liquidity-based (هدف: PDH/PDL/Session)",
    'form.exitTime':"Time-based (خروج سر ساعت/ناهار)",
    'form.copyTitle':"کپی از آخرین معامله مشابه یا آخرین معامله",
    'form.clearTitle':"پاک کردن فرم و پیش‌نویس",
    'setup.internal':"Sweep نقدینگی داخلی",
    'setup.external':"Sweep نقدینگی خارجی",
    'setup.obRev':"برگشت از Order Block",
    'setup.fvg':"پرشدن FVG",
    'setup.turtle':"Turtle Soup (شکست کاذب سقف/کف قدیمی)",
    'setup.silver':"Silver Bullet (ستاپ زمان‌محور)",
    'setup.unicorn':"Unicorn Model (تلاقی OB + FVG)",
    'liq.bsl':"BSL — نقدینگی خرید (بالای بازار)",
    'liq.ssl':"SSL — نقدینگی فروش (پایین بازار)",
    'liq.session':"سقف/کف سشن",
    'common.no':"خیر",
    'common.yes':"بله",
    'common.cancel':"انصراف",
    'common.save':"💾 ذخیره",
    'common.close':"بستن",
    'journal.reflection':"🧠 Evening Reflection — ۳ سوال ثابت",
    'journal.q1':"۱. آیا امروز Revenge Trading کردم؟",
    'journal.q2':"۲. آیا از پلن خارج شدم؟",
    'journal.q3':"۳. اگر فردا تکرار شود، چه می‌کنم؟",
    'journal.oneLine':"یک جمله...",
    'journal.best':"⭐ بهترین تصمیم امروز",
    'journal.worst':"⚠️ بدترین تصمیم امروز",
    'journal.scoring':"📊 نمره‌دهی روزانه — خودکار",
    'journal.scoringDesc':"بر اساس چک‌لیست‌های امروز + معاملات ثبت‌شده + پاسخ‌های بالا محاسبه می‌شود.",
    'score.tech':"تکنیکال",
    'score.risk':"ریسک",
    'score.mental':"روحی/جسمی",
    'score.learning':"یادگیری",
    'score.execution':"اجرا (میانگین معاملات بسته‌شده امروز)",
    'journal.noteLabel':"یادداشت روز / درس کلیدی",
    'journal.notePh':"امروز چه اتفاقی افتاد؟ چه درسی گرفتم؟",
    'journal.tagsLabel':"تگ‌های روز (با کاما جدا کن)",
    'journal.save':"📝 ذخیره ژورنال روزانه",
    'perf.rangeWeek':"هفته اخیر (۷ روز)",
    'perf.rangeMonth':"ماه اخیر (۳۰ روز)",
    'perf.rangeD90':"۹۰ روز اخیر",
    'perf.rangeAll':"کل تاریخچه",
    'perf.rangeCustom':"بازه سفارشی",
    'perf.streak':"رکورد ضرر متوالی",
    'perf.count':"تعداد معامله",
    'perf.avgExec':"میانگین Execution Score",
    'perf.radarTitle':"🎯 رادار سه‌بعدی — امروز vs میانگین ۷ روز",
    'perf.radarCap':"در کدام بُعد (تکنیکال/ریسک/روحی-جسمی) نسبت به میانگین ۷ روز اخیر قوی‌تر یا ضعیف‌تری.",
    'perf.pnlTitle':"📈 P&L انباشته — بازه انتخابی",
    'perf.pnlCap':"روند تجمعی سود و زیان در بازه‌ی انتخاب‌شده — صعودی یعنی داری پیشرفت می‌کنی.",
    'perf.corrTitle':"🧭 همبستگی امتیاز چک‌لیست با نتیجه",
    'perf.corrCap':"آیا معاملاتی که با امتیاز اجرای بالاتر گرفته شده‌اند، واقعاً وین‌ریت بهتری داشته‌اند؟",
    'perf.wlTitle':"⚔️ Win / Loss / BE — بازه انتخابی",
    'perf.wlCap':"چند درصد معاملات این بازه برد، باخت یا سربه‌سر بودند.",
    'perf.rdistTitle':"📏 R-Multiple Distribution",
    'perf.rdistCap':"نسبت سود به ریسک واقعی معاملات — هرچه بیشتر سمت راست، بهتر.",
    'perf.dowCap':"کدام روز هفته بهترین یا بدترین نتیجه را در این بازه داشته.",
    'perf.pairCap':"کدام ابزار بیشترین سود یا ضرر را در این بازه ساخته.",
    'perf.sessTitle':"🌍 عملکرد بر اساس بازه زمانی روز",
    'perf.sessCap':"آسیا / قبل از لندن / لندن / قبل از نیویورک / نیویورک — کدام بازه بهتر عمل کرده‌ای.",
    'perf.setupTitle':"🧬 عملکرد بر اساس نوع ستاپ (Trade DNA)",
    'perf.setupCap':"کدام نوع ستاپ (Judas Swing، Continuation، Sweep و ...) برایت بهتر جواب داده.",
    'perf.behavTitle':"🧠 تحلیل رفتاری — بردها در برابر باخت‌ها",
    'perf.behavCap':"پرتکرارترین تگ، جفت‌ارز و احساس در معاملات ضررده‌ی این بازه، در مقایسه با بردها.",
    'perf.modelTitle':"🧬 مدل‌سنج — کدام مرحله/ستاپ/احساس واقعاً پول می‌سازد؟",
    'perf.modelCap':"میانگین R هر مرحله از چک‌لیست قبل از ورود، هر ستاپ و هر احساس. سبز = لبه‌ی تو، قرمز = نشت پول. بعد از ~۳۰ معامله بسته‌شده معنی‌دار می‌شود.",
    'perf.eqTitle':"📉 Equity Curve + Drawdown (کل تاریخچه، مستقل از فیلتر بازه)",
    'perf.eqCap':"بیشترین افت سرمایه از قله‌ی قبلی — نشان می‌دهد ریسک واقعی چقدر بوده.",
    'perf.distTitle':"🍩 توزیع کلی نتایج",
    'perf.distCap':"نسبت کلی برد/باخت/سربه‌سر در بازه‌ی انتخاب‌شده.",
    'filter.pair':"جفت‌ارز (مثلاً EURUSD)",
    'filter.all':"همه نتایج",
    'emoF.all':"همه احساسات",
    'emoF.calm':"آرام و مطمئن",
    'emoF.revenge':"انتقام‌جو",
    'emoF.hesitant':"مردد/دودل",
    'emoF.overconfident':"بیش‌ازحد مطمئن",
    'emoF.bored':"بی‌حوصله",
    'emoF.anxious':"مضطرب/نگران",
    'emoF.rushed':"عجول (قدیمی)",
    'hist.clear':"پاک کردن",
    'hist.thDate':"تاریخ",
    'hist.thPair':"جفت‌ارز",
    'hist.thDir':"جهت",
    'hist.thResult':"نتیجه",
    'hist.thTags':"تگ‌ها",
    'hist.thActions':"عملیات",
    'watch.core':"🟢 هسته اصلی (قابل ویرایش در تنظیمات)",
    'watch.caution':"🟡 با احتیاط",
    'watch.forbidden':"🔴 ممنوع",
    'watch.ethNote':"همبستگی ۰.۸–۰.۹ با BTC — نگه‌داشتن هر دو هم‌زمان تنوع واقعی نمی‌دهد، فقط ریسک روند کریپتو را دوبرابر می‌کند.",
    'watch.exotic':"جفت‌ارزهای Exotic",
    'watch.exoticNote':"TRY، ZAR، MXN و مشابه — اسپرد بالا، نقدینگی کم. اضافه نشود.",
    'weekly.ending':"هفته منتهی به",
    'weekly.autoTitle':"📊 خلاصه‌ی خودکار هفته منتهی به",
    'weekly.suggestTitle':"🤖 پیشنهاد این هفته",
    'weekly.suggestCap':"بر اساس همین آمار بالا — نه حدس.",
    'weekly.trendTitle':"📈 روند هفته‌به‌هفته — وین‌ریت (توپر) / پایبندی (نقطه‌چین)",
    'weekly.q1':"۱. بزرگترین اشتباه هفته و علتش چه بود؟",
    'weekly.q2':"۲. کدام تصمیم بیشترین ارزش را داشت؟",
    'weekly.q3':"۳. هدف هفته آینده؟",
    'weekly.q4':"۴. یک درس کلیدی (یک جمله)",
    'weekly.drill':"🎯 تمرین تمرکزی هفته آینده (Focus Drill — یک مهارت واحد)",
    'weekly.drillPh':"مثال: فقط Sweep خارجی روی EURUSD / بدون ترید بعد از ۲ برد پیاپی...",
    'weekly.save':"💾 ذخیره بازبینی هفتگی",
    'weekly.histTitle':"🗂️ تاریخچه‌ی بازبینی‌های قبلی",
    'weekly.histCap':"هر بار که فرم بالا را ذخیره می‌کنی، همین‌جا زیر هم اضافه می‌شود.",
    'routine.tzTitle':"⏰ نکته‌ی مهم درباره‌ی ساعت‌ها",
    'routine.tzDesc':"ایران از سال ۲۰۲۲ ساعت تابستانی ندارد (همیشه UTC+۳:۳۰ ثابت)، ولی بریتانیا و آمریکا هنوز دارند. یعنی فاصله‌ی ساعت تهران با کیل‌زون‌های واقعی هرسال دو بار، هرکدام یک ساعت، جابه‌جا می‌شود. زمان‌بندی فازهای زیر میانگین دو حالت است؛ بر اساس جدول، حدود یک ساعت با فصل تنظیم کنید (ساعت زنده‌ی بالای فرم ثبت معامله همیشه دقیق است، نیازی به تنظیم دستی ندارد):",
    'routine.thPhase':"فاز",
    'routine.thWinter':"زمستان بریتانیا/آمریکا (~آبان تا اسفند)",
    'routine.thSummer':"تابستان بریتانیا/آمریکا (~فروردین تا مهر)",
    'routine.kzLondon':"Kill Zone لندن",
    'routine.tzLondonW':"۱۰:۳۰–۱۳:۳۰",
    'routine.tzLondonS':"۰۹:۳۰–۱۲:۳۰",
    'routine.tzNyW':"۱۵:۳۰–۱۸:۳۰",
    'routine.tzNyS':"۱۴:۳۰–۱۷:۳۰",
    'routine.kzNy':"Overlap + نیویورک",
    'settings.multiDesc':"داده‌ها روی همین دستگاه (مرورگر) ذخیره می‌شوند. برای استفاده روی لپ‌تاپ + موبایل: <br>۱. از سایدبار «پشتیبان» بگیر <br>۲. فایل را به دستگاه دیگر منتقل کن <br>۳. در دستگاه مقصد «بازیابی» بزن و <b>ادغام هوشمند</b> را انتخاب کن",
    'settings.dlFull':"⬇️ دانلود پشتیبان کامل",
    'settings.restoreMerge':"⬆️ بازیابی / ادغام",
    'settings.balanceTitle':"💰 موجودی اولیه حساب",
    'settings.balanceDesc':"برای محاسبه‌ی درست درصد Drawdown در تب «عملکرد» استفاده می‌شود.",
    'settings.saveBalance':"ذخیره موجودی",
    'settings.lossCapTitle':"🛑 حد ضرر روزانه (٪ حساب)",
    'settings.lossCapDesc':"اگر مجموع P&L بسته‌شده‌ی امروز به این درصد برسد، ثبت معامله تا فردا قفل می‌شود (مستقل از قفل ۲ ضرر). پیش‌فرض: ۲٪.",
    'settings.saveLossCap':"ذخیره حد ضرر",
    'settings.contractTitle':"📜 قرارداد تریدر",
    'settings.contractDesc':"این متن هر روز در داشبورد نمایش داده می‌شود.",
    'settings.saveContract':"ذخیره قرارداد",
    'settings.themeTitle':"☀️/🌙 تم",
    'settings.toggleTheme':"تغییر تم روشن/تیره",
    'settings.watchTitle':"👁️ هسته اصلی واچ‌لیست",
    'settings.watchDesc':"فقط این ابزارها در فرم «ثبت معامله» قابل انتخابند — از تایپ آزاد و ناهماهنگی نام‌ها جلوگیری می‌کند.",
    'settings.pairPh':"مثلاً EURUSD",
    'settings.addPair':"+ افزودن",
    'settings.addItem':"افزودن آیتم",
    'settings.dailyMgr':"⚙️ مدیریت چک‌لیست صبحگاهی",
    'settings.preMgr':"⚙️ مدیریت چک‌لیست قبل از ورود",
    'settings.preMgrDesc':"هر آیتم به یک «مرحله» از چک‌لیست پلکانی داشبورد تعلق دارد.",
    'settings.itemPh':"متن آیتم",
    'settings.itemLabel':"متن آیتم",
    'settings.ptsPh':"امتیاز",
    'settings.critical':"حیاتی",
    'catOpt.tech':"تکنیکال",
    'catOpt.risk':"ریسک",
    'catOpt.mental':"روحی/جسمی",
    'catOpt.learning':"یادگیری",
    'legacy.title':"🧳 داده‌های قدیمی (قبل از v7)",
    'legacy.desc':"آیتم‌هایی که قبلاً به فارسی ساختی (چک‌لیست‌ها، قرارداد) متن فارسی‌شان حفظ می‌شود. این ابزار برای معادل‌های پیش‌فرض شناخته‌شده، ترجمه انگلیسی اضافه می‌کند — متن سفارشی خودت دست‌نخورده می‌ماند.",
    'legacy.btn':"🌐 ترجمه آیتم‌های فارسی ذخیره‌شده → انگلیسی",
    'settings.trashTitle':"🗑️ آیتم‌های حذف‌شده (سطل بازیافت)",
    'settings.emptyTrash':"پاک‌کردن کامل سطل",
    'settings.trashDesc':"آیتم‌های چک‌لیست حذف‌شده تا ۲۰ مورد آخر اینجا نگه داشته می‌شوند و قابل بازگردانی‌اند.",
    'edit.title':"✏️ ویرایش آیتم چک‌لیست",
    'edit.cat':"دسته",
    'edit.pts':"امتیاز",
    'edit.stage':"مرحله (چک‌لیست قبل از ورود)",
    'edit.criticalHint':"آیتم الزامی (★) — بدون تیک این، ورود مجاز نیست",
    'redit.title':"✏️ ویرایش فاز روتین",
    'redit.phaseTitle':"عنوان فاز",
    'redit.phaseTitlePh':"مثلاً: فاز اول · زمینه‌سازی عصبی",
    'redit.window':"بازه‌ی زمانی (نمایشی)",
    'redit.color':"رنگ",
    'redit.purple':"بنفش",
    'redit.amber':"کهربایی",
    'redit.cyan':"فیروزه‌ای",
    'redit.green':"سبز",
    'redit.red':"قرمز",
    'redit.itemsLabel':"آیتم‌های این فاز — هر خط: «ساعت|عنوان|توضیح» (چند نکته را با ~ جدا کن)",
    'redit.itemsPh':"06:30|بیداری|۵۰۰ml آب~۲۰ دقیقه اول گوشی نباشد",
    'result.title':"ثبت نتیجه معامله",
    'result.resultLabel':"نتیجه",
    'result.winOpt':"✅ سود",
    'result.lossOpt':"❌ ضرر",
    'result.beOpt':"➖ سر به سر",
    'result.postTitle':"🧮 Post-Trade Checklist — ۳ سوال اجباری",
    'result.q1':"۱. آیا استاپ را جابجا کردم؟",
    'result.q2':"۲. آیا خارج از پلن خارج شدم؟",
    'result.q3':"۳. آیا احساسات دخیل بود؟",
    'result.tagsLabel':"تگ‌های معامله (با کاما جدا کن)",
    'result.noteLabel':"یادداشت نتیجه / درس",
    'result.notePh':"چرا این نتیجه رخ داد؟",
    'result.noteHint':"یک یادداشت واقعی (حداقل ۱۵ حرف) در Learning Score این معامله لحاظ می‌شود.",
    'result.save':"ذخیره نتیجه",
    'contract.intro':"قبل از شروع، این تعهد را بخوان و بپذیر:"
  },
  en: {
    'nav.dashboard':'Daily Dashboard','nav.guide':'Mechanical Guide','nav.history':'Trade Archive',
    'nav.watchlist':'Watchlist','nav.performance':'Performance','nav.weekly':'Weekly Review',
    'nav.routine':'Daily Routine','nav.settings':'Settings',
    'sidebar.storage':'Storage: —','sidebar.backup':'⬇️ Backup','sidebar.restore':'⬆️ Restore',
    'sidebar.csv':'📄 Export CSV',
    'sidebar.multidevice':'Multi-device: download backup → restore on other device (smart merge)',
    'dash.title':'Daily Dashboard','dash.compact':'📱 Compact','dash.compactOff':'📱 Normal',
    'dash.newTrade':'➕ New Trade','dash.todayTrades':'💼 Today\'s Trades',
    'dash.journal':'📝 End-of-Day Journal','dash.morning':'☀️ Morning Checklist',
    'dash.pre':'✅ Pre-Entry Checklist','dash.session':'🗺️ Session Plan',
    'form.pair':'Pair (core watchlist)','form.dir':'Direction','form.entry':'Entry',
    'form.sl':'Stop Loss','form.tp':'Take Profit','form.rr':'R:R (auto)',
    'form.allowedRisk':'Allowed risk today','form.riskUsd':'Planned risk ($)',
    'form.posSize':'Size (price units)','form.emotion':'Emotion at entry',
    'form.style':'Trade style (TF/levels)','form.exit':'Exit strategy (TP)',
    'form.setup':'Setup type','form.liquidity':'Liquidity type','form.poi':'POI type',
    'form.note':'Note / entry reason','form.save':'💾 Save Trade',
    'form.copySimilar':'📋 Copy similar trade','form.clear':'🗑️ Clear form',
    'form.draft':'📝 Draft saved','form.copyToForm':'📋 Copy to form',
    'perf.title':'Performance','perf.sub':'Trends, stats, and behavioral patterns in selected range',
    'hist.title':'Trade Archive','hist.sub':'All trades with advanced filters',
    'watch.title':'Watchlist — Allowed instruments','watch.sub':'Trade only these — quality over quantity',
    'weekly.title':'Weekly Review','weekly.sub':'Auto weekly summary + focused growth questions',
    'routine.title':'Daily Routine','routine.sub':'Phase-by-phase day plan — editable',
    'settings.title':'Settings','settings.sub':'Customize checklist, contract, health, and appearance',
    'settings.langTitle':'🌐 Language','settings.langDesc':'Switch the interface between Persian and English.',
    'settings.multiTitle':'📱 Multi-device & Backup',
    'guide.title':'Mechanical Trading Guide','guide.sub':'Liquidity Model reference + emotion-free decision framework',
    'toast.langFa':'زبان: فارسی','toast.langEn':'Language: English',
    'toast.backupOk':'✅ Full backup downloaded','toast.restoreOk':'✅ Restore completed',
    'toast.mergeOk':'✅ Merge completed','toast.saved':'✅ Saved','toast.tradeSaved':'✅ Trade saved',
    'toast.draftCleared':'Form cleared','toast.copied':'Copied','toast.contractSaved':'Contract saved',
    'cat.tech':'📈 Technical','cat.risk':'🛡️ Risk','cat.mental':'🧠 Mental/Physical','cat.learning':'📚 Learning',
    'emotion.calm':'😌 Calm & confident','emotion.fomo':'😵 FOMO','emotion.revenge':'😡 Revenge',
    'emotion.hesitant':'🤔 Hesitant','emotion.overconfident':'😎 Overconfident',
    'emotion.bored':'🥱 Bored','emotion.anxious':'😰 Anxious',
    'result.win':'Win','result.loss':'Loss','result.be':'BE','result.open':'Open',
    'contract.accept':'Accept & Start','contract.edit':'⚙️ Edit contract in Settings',
    'contract.check':'I accept this contract and will remember it every day.',
    'contract.title':'📜 Self-Contract',
    'restore.title':'🔄 Restore / Multi-device Merge',
    'restore.merge':'🔀 Smart merge (recommended)','restore.replace':'⚠️ Full replace all data',
    'restore.settingsOnly':'⚙️ Settings only','restore.cancel':'Cancel',
    'empty.noTrades':'No trades logged yet','empty.noTradesHint':'Log your first trade from the section above',
    'gate.title':"Language / زبان",
    'gate.desc':"Choose your interface language.",
    'gate.en':"🇬🇧 Continue in English",
    'gate.fa':"🇮🇷 Continue in Persian (فارسی)",
    'dash.sessionHint':"Before London, write it down: which instrument? Which levels? Scenario A (low sweep → buy) and B? Execute only that.",
    'dash.sessionPh':"Example: XAUUSD only — PDH/PDL drawn — Scenario A: sweep below PDL → M15 CHoCH → buy toward PDH...",
    'dash.editChecklist':"⚙️ Edit checklist",
    'lockout.title':"⏳ Forced Stop",
    'lockout.desc':"After every loss or BE, wait 2 hours before the next trade.",
    'form.dirAria':"Trade direction",
    'form.posSizeTitle':"riskUsd ÷ |entry−stop| — approximate for forex",
    'form.exitLiq':"Liquidity-based (target: PDH/PDL/Session)",
    'form.exitTime':"Time-based (exit at session end/lunch)",
    'form.copyTitle':"Copy from last similar trade or last trade",
    'form.clearTitle':"Clear form and draft",
    'setup.internal':"Internal liquidity sweep",
    'setup.external':"External liquidity sweep",
    'setup.obRev':"Order Block reversal",
    'setup.fvg':"FVG fill",
    'setup.turtle':"Turtle Soup (fake break of old high/low)",
    'setup.silver':"Silver Bullet (time-based setup)",
    'setup.unicorn':"Unicorn Model (OB + FVG)",
    'liq.bsl':"BSL — buy-side liquidity (above market)",
    'liq.ssl':"SSL — sell-side liquidity (below market)",
    'liq.session':"Session high/low",
    'common.no':"No",
    'common.yes':"Yes",
    'common.cancel':"Cancel",
    'common.save':"💾 Save",
    'common.close':"Close",
    'journal.reflection':"🧠 Evening Reflection — 3 fixed questions",
    'journal.q1':"1. Did I revenge-trade today?",
    'journal.q2':"2. Did I stay on plan?",
    'journal.q3':"3. If tomorrow repeats, what will I do?",
    'journal.oneLine':"One sentence...",
    'journal.best':"⭐ Best decision today",
    'journal.worst':"⚠️ Worst decision today",
    'journal.scoring':"📊 Daily scoring — automatic",
    'journal.scoringDesc':"Computed from today's checklists + logged trades + answers above.",
    'score.tech':"Technical",
    'score.risk':"Risk",
    'score.mental':"Mental/Physical",
    'score.learning':"Learning",
    'score.execution':"Execution (avg of today's closed trades)",
    'journal.noteLabel':"Day note / key lesson",
    'journal.notePh':"What happened today? What did I learn?",
    'journal.tagsLabel':"Day tags (comma-separated)",
    'journal.save':"📝 Save daily journal",
    'perf.rangeWeek':"Last week (7 days)",
    'perf.rangeMonth':"Last month (30 days)",
    'perf.rangeD90':"Last 90 days",
    'perf.rangeAll':"All history",
    'perf.rangeCustom':"Custom range",
    'perf.streak':"Consecutive-loss record",
    'perf.count':"Trade count",
    'perf.avgExec':"Avg Execution Score",
    'perf.radarTitle':"🎯 3D radar — today vs 7-day average",
    'perf.radarCap':"In which dimension (technical/risk/mental-physical) are you stronger or weaker vs your 7-day average.",
    'perf.pnlTitle':"📈 Cumulative P&L — selected range",
    'perf.pnlCap':"Cumulative profit/loss trend in the selected range — upward means you are progressing.",
    'perf.corrTitle':"🧭 Checklist score vs outcome correlation",
    'perf.corrCap':"Do trades taken with higher execution scores actually have a better win rate?",
    'perf.wlTitle':"⚔️ Win / Loss / BE — selected range",
    'perf.wlCap':"What percentage of trades in this range were wins, losses or break-even.",
    'perf.rdistTitle':"📏 R-Multiple Distribution",
    'perf.rdistCap':"Actual reward-to-risk of trades — the further right, the better.",
    'perf.dowCap':"Which weekday had the best or worst result in this range.",
    'perf.pairCap':"Which instrument produced the most profit or loss in this range.",
    'perf.sessTitle':"🌍 Performance by time of day",
    'perf.sessCap':"Asia / pre-London / London / pre-NY / NY — which window performed better.",
    'perf.setupTitle':"🧬 Performance by setup type (Trade DNA)",
    'perf.setupCap':"Which setup type (Judas Swing, Continuation, Sweep, etc.) works best for you.",
    'perf.behavTitle':"🧠 Behavioral analysis — wins vs losses",
    'perf.behavCap':"Most frequent tag, pair and emotion in losing trades of this range, compared with wins.",
    'perf.modelTitle':"🧬 Model meter — which stage/setup/emotion actually makes money?",
    'perf.modelCap':"Avg R by pre-entry checklist stage, setup, and emotion. Green = your edge, red = leakage. Meaningful after ~30 closed trades.",
    'perf.eqTitle':"📉 Equity Curve + Drawdown (all history, independent of range filter)",
    'perf.eqCap':"Largest drop from a prior peak — shows what your real risk has been.",
    'perf.distTitle':"🍩 Overall result distribution",
    'perf.distCap':"Overall win/loss/BE ratio in the selected range.",
    'filter.pair':"Pair e.g. EURUSD",
    'filter.all':"All results",
    'emoF.all':"All emotions",
    'emoF.calm':"Calm & confident",
    'emoF.revenge':"Revenge",
    'emoF.hesitant':"Hesitant",
    'emoF.overconfident':"Overconfident",
    'emoF.bored':"Bored",
    'emoF.anxious':"Anxious",
    'emoF.rushed':"Rushed (legacy)",
    'hist.clear':"Clear",
    'hist.thDate':"Date",
    'hist.thPair':"Pair",
    'hist.thDir':"Direction",
    'hist.thResult':"Result",
    'hist.thTags':"Tags",
    'hist.thActions':"Actions",
    'watch.core':"🟢 Core (editable in Settings)",
    'watch.caution':"🟡 With caution",
    'watch.forbidden':"🔴 Forbidden",
    'watch.ethNote':"0.8–0.9 correlation with BTC — holding both at once is not real diversification; it only doubles crypto-trend risk.",
    'watch.exotic':"Exotic pairs",
    'watch.exoticNote':"TRY, ZAR, MXN and similar — high spread, low liquidity. Do not add.",
    'weekly.ending':"Week ending",
    'weekly.autoTitle':"📊 Auto summary — week ending",
    'weekly.suggestTitle':"🤖 This week's suggestion",
    'weekly.suggestCap':"Based on the stats above — not guesswork.",
    'weekly.trendTitle':"📈 Week-by-week trend — win rate (solid) / adherence (dashed)",
    'weekly.q1':"1. Biggest mistake of the week and why?",
    'weekly.q2':"2. Which decision created the most value?",
    'weekly.q3':"3. Goal for next week?",
    'weekly.q4':"4. One key lesson (one sentence)",
    'weekly.drill':"🎯 Next week's focus drill (one single skill)",
    'weekly.drillPh':"Example: only external sweeps on EURUSD / no trading after 2 consecutive wins...",
    'weekly.save':"💾 Save weekly review",
    'weekly.histTitle':"🗂️ Previous review history",
    'weekly.histCap':"Each time you save the form above, it is appended here.",
    'routine.tzTitle':"⏰ Important note about clock times",
    'routine.tzDesc':"Iran has had no daylight saving since 2022 (always UTC+3:30), but the UK and US still do. So Tehran's offset vs real kill zones shifts by one hour, twice a year. Phase times below average both cases; adjust about one hour by season from the table (the live clock above the trade form is always accurate — no manual tweak needed):",
    'routine.thPhase':"Phase",
    'routine.thWinter':"UK/US winter (~Oct to Mar)",
    'routine.thSummer':"UK/US summer (~Apr to Sep)",
    'routine.kzLondon':"London Kill Zone",
    'routine.tzLondonW':"10:30–13:30",
    'routine.tzLondonS':"09:30–12:30",
    'routine.tzNyW':"15:30–18:30",
    'routine.tzNyS':"14:30–17:30",
    'routine.kzNy':"Overlap + New York",
    'settings.multiDesc':"Data is stored on this device (browser). To use laptop + phone: <br>1. \"Backup\" from the sidebar <br>2. Move the file to the other device <br>3. Tap \"Restore\" there and choose <b>Smart merge</b>",
    'settings.dlFull':"⬇️ Download full backup",
    'settings.restoreMerge':"⬆️ Restore / Merge",
    'settings.balanceTitle':"💰 Starting account balance",
    'settings.balanceDesc':"Used to compute the Drawdown percentage correctly on the Performance tab.",
    'settings.saveBalance':"Save balance",
    'settings.lossCapTitle':"🛑 Daily loss cap (% of account)",
    'settings.lossCapDesc':"If today's closed P&L hits this %, new trades lock until tomorrow (independent of the 2-loss lock). Default: 2%.",
    'settings.saveLossCap':"Save loss cap",
    'settings.contractTitle':"📜 Trader contract",
    'settings.contractDesc':"This text is shown on the dashboard every day.",
    'settings.saveContract':"Save contract",
    'settings.themeTitle':"☀️/🌙 Theme",
    'settings.toggleTheme':"Toggle light/dark theme",
    'settings.watchTitle':"👁️ Core watchlist",
    'settings.watchDesc':"Only these instruments are selectable in the \"New Trade\" form — prevents free-typing and name mismatch.",
    'settings.pairPh':"e.g. EURUSD",
    'settings.addPair':"+ Add",
    'settings.addItem':"Add item",
    'settings.dailyMgr':"⚙️ Morning checklist manager",
    'settings.preMgr':"⚙️ Pre-entry checklist manager",
    'settings.preMgrDesc':"Each item belongs to a \"stage\" of the dashboard stepped checklist.",
    'settings.itemPh':"Item text",
    'settings.itemLabel':"Item text",
    'settings.ptsPh':"Score",
    'settings.critical':"Critical",
    'catOpt.tech':"Technical",
    'catOpt.risk':"Risk",
    'catOpt.mental':"Mental/Physical",
    'catOpt.learning':"Learning",
    'legacy.title':"🧳 Legacy data (pre-v7)",
    'legacy.desc':"Items you created in Persian (checklists, contract) keep their Persian text. This tool adds English translations for known default-style wording — your custom wording stays untouched.",
    'legacy.btn':"🌐 Translate stored Persian items → English",
    'settings.trashTitle':"🗑️ Deleted items (trash bin)",
    'settings.emptyTrash':"Empty trash",
    'settings.trashDesc':"Deleted checklist items (last 20) are kept here and can be restored.",
    'edit.title':"✏️ Edit checklist item",
    'edit.cat':"Category",
    'edit.pts':"Score",
    'edit.stage':"Stage (pre-entry checklist)",
    'edit.criticalHint':"Critical item (★) — entry is blocked without ticking this",
    'redit.title':"✏️ Edit routine phase",
    'redit.phaseTitle':"Phase title",
    'redit.phaseTitlePh':"e.g.: Phase 1 · Neural priming",
    'redit.window':"Time window (display only)",
    'redit.color':"Color",
    'redit.purple':"Purple",
    'redit.amber':"Amber",
    'redit.cyan':"Cyan",
    'redit.green':"Green",
    'redit.red':"Red",
    'redit.itemsLabel':"Phase items — each line: \"time|title|note\" (split tips with ~)",
    'redit.itemsPh':"06:30|Wake up|500ml water~No phone first 20 min",
    'result.title':"Log trade result",
    'result.resultLabel':"Result",
    'result.winOpt':"✅ Win",
    'result.lossOpt':"❌ Loss",
    'result.beOpt':"➖ Break-even",
    'result.postTitle':"🧮 Post-Trade Checklist — 3 mandatory questions",
    'result.q1':"1. Did I move the stop?",
    'result.q2':"2. Did I exit off-plan?",
    'result.q3':"3. Were emotions involved?",
    'result.tagsLabel':"Trade tags (comma-separated)",
    'result.noteLabel':"Result note / lesson",
    'result.notePh':"Why did this outcome happen?",
    'result.noteHint':"A real note (min 15 chars) counts toward this trade's Learning Score.",
    'result.save':"Save result",
    'contract.intro':"Before starting, read and accept this commitment:"
  }
};

function currentLang(){
  return (settings && settings.lang) ? settings.lang : 'fa';
}
// Contract is stored bilingual {fa,en} since v7; legacy plain strings still work.
function contractText(){
  const c = settings && settings.contract;
  if(!c) return '';
  if(typeof c === 'string') return c;
  return (currentLang()==='en' ? (c.en || c.fa) : (c.fa || c.en)) || '';
}
function t(key, fallback){
  const lang = currentLang();
  const dict = I18N[lang] || I18N.fa;
  if(dict[key] !== undefined) return dict[key];
  if(I18N.fa[key] !== undefined) return I18N.fa[key];
  return fallback !== undefined ? fallback : key;
}
function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(!key) return;
    // preserve nested input inside label buttons
    const input = el.querySelector('input[type="file"]');
    const text = t(key);
    if(input){
      el.childNodes.forEach(n=>{ if(n.nodeType===3) n.textContent=''; });
      // set text before input
      if(el.firstChild && el.firstChild.nodeType===3) el.firstChild.textContent = text + ' ';
      else el.insertBefore(document.createTextNode(text + ' '), input);
    } else {
      el.textContent = text;
    }
  });
  // attribute variants: placeholder / aria-label / title
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  // page headers
  const pairs = {
    'page-dashboard': ['dash.title', null],
    'page-performance': ['perf.title', 'perf.sub'],
    'page-history': ['hist.title', 'hist.sub'],
    'page-watchlist': ['watch.title', 'watch.sub'],
    'page-weekly': ['weekly.title', 'weekly.sub'],
    'page-routine': ['routine.title', 'routine.sub'],
    'page-settings': ['settings.title', 'settings.sub'],
    'page-guide': ['guide.title', 'guide.sub']
  };
  Object.entries(pairs).forEach(([pid, keys])=>{
    const page = document.getElementById(pid);
    if(!page) return;
    const h1 = page.querySelector('.page-header h1');
    const p = page.querySelector('.page-header p');
    if(h1 && keys[0]) {
      // keep compact button if present
      if(pid==='page-dashboard'){
        const btn = document.getElementById('compactToggleBtn');
        h1.textContent = t(keys[0]);
      } else h1.textContent = t(keys[0]);
    }
    if(p && keys[1]) p.textContent = t(keys[1]);
  });
  // collapse toggles on dashboard
  const ct = {
    'toggleTrade': 'dash.newTrade',
    'toggleToday': 'dash.todayTrades',
    'toggleJournal': 'dash.journal',
    'toggleDaily': 'dash.morning',
    'togglePre': 'dash.pre',
    'toggleSessionplan': 'dash.session'
  };
  Object.entries(ct).forEach(([id,key])=>{
    const btn = document.getElementById(id);
    if(!btn) return;
    const span = btn.querySelector('span:first-child');
    if(span) span.textContent = t(key);
  });
  // trade form labels (first label in each form-group near nt-*)
  const formLabelMap = [
    ['nt-pair', 'form.pair'],['nt-entry','form.entry'],['nt-sl','form.sl'],['nt-tp','form.tp'],
    ['nt-rr','form.rr'],['nt-allowed-risk','form.allowedRisk'],['nt-risk-usd','form.riskUsd'],
    ['nt-pos-size','form.posSize'],['nt-emotion','form.emotion'],['nt-style','form.style'],
    ['nt-exit-type','form.exit'],['nt-setup','form.setup'],['nt-liquidity','form.liquidity'],
    ['nt-poi','form.poi'],['nt-note','form.note']
  ];
  formLabelMap.forEach(([id,key])=>{
    const el = document.getElementById(id);
    if(!el) return;
    const group = el.closest('.form-group');
    const lab = group && group.querySelector('label');
    if(lab) lab.textContent = t(key);
  });
  // dir label
  const dirGroup = document.querySelector('#nt-dir')?.closest('.form-group');
  if(dirGroup){ const lab=dirGroup.querySelector('label'); if(lab) lab.textContent=t('form.dir'); }

  const saveBtn = document.getElementById('btn-save-trade');
  if(saveBtn) saveBtn.textContent = t('form.save');
  const draftInd = document.getElementById('draft-indicator');
  if(draftInd) draftInd.textContent = t('form.draft');

  // compact button
  const compactBtn = document.getElementById('compactToggleBtn');
  if(compactBtn){
    const on = document.body.classList.contains('compact-mode');
    compactBtn.textContent = on ? t('dash.compactOff') : t('dash.compact');
  }

  // contract modal
  const cTitle = document.querySelector('#contractModal .modal-header h3');
  if(cTitle) cTitle.textContent = t('contract.title');
  const cCheck = document.querySelector('#contract-agree')?.parentElement;
  if(cCheck && cCheck.childNodes.length){
    // label text after checkbox
    const nodes = [...cCheck.childNodes].filter(n=>n.nodeType===3);
    if(nodes[0]) nodes[0].textContent = ' ' + t('contract.check');
  }
  const cAccept = document.querySelector('#contractModal .modal-footer .btn');
  if(cAccept) cAccept.textContent = t('contract.accept');
  const cEdit = document.querySelector('#contractModal .btn-ghost');
  if(cEdit) cEdit.textContent = t('contract.edit');

  // restore modal title
  const rTitle = document.querySelector('#restoreModal .modal-header h3');
  if(rTitle) rTitle.textContent = t('restore.title');

  // lang buttons state
  const faBtn = document.getElementById('btnLangFa');
  const enBtn = document.getElementById('btnLangEn');
  if(faBtn && enBtn){
    const lang = currentLang();
    faBtn.className = 'btn btn-sm ' + (lang==='fa'?'btn-primary':'btn-ghost');
    enBtn.className = 'btn btn-sm ' + (lang==='en'?'btn-primary':'btn-ghost');
  }

  // emotion options
  const emoSel = document.getElementById('nt-emotion');
  if(emoSel){
    [...emoSel.options].forEach(opt=>{
      const e = EMOTION_LABELS[opt.value];
      if(e) opt.textContent = e.emoji + ' ' + (currentLang()==='en'?e.en:e.fa);
    });
  }
  // model steps title
  const mst = document.getElementById('model-steps-title');
  if(mst) mst.textContent = currentLang()==='en' ? 'THE MODEL ★ 7 steps to entry' : 'THE MODEL ★ ۷ مرحله تا ورود';
  // history filter options
  const fr = document.getElementById('filter-result');
  if(fr){
    [...fr.options].forEach(opt=>{
      if(opt.value==='') opt.textContent = currentLang()==='en'?'All results':'همه نتایج';
      else if(opt.value==='win') opt.textContent = t('result.win');
      else if(opt.value==='loss') opt.textContent = t('result.loss');
      else if(opt.value==='be') opt.textContent = t('result.be');
      else if(opt.value==='open') opt.textContent = t('result.open');
    });
  }
  const fp = document.getElementById('filter-pair');
  if(fp) fp.placeholder = currentLang()==='en'?'Pair e.g. EURUSD':'جفت‌ارز (مثلاً EURUSD)';
  // trade action buttons
  const draftRow = document.getElementById('trade-draft-row');
  if(draftRow){
    const btns = draftRow.querySelectorAll('button');
    if(btns[0]) btns[0].textContent = t('form.copySimilar');
    if(btns[1]) btns[1].textContent = t('form.clear');
  }
}
// Longest-first FA→EN phrase map for remaining static UI (zero Persian when EN)
function updateLangButton(){
  const btn = document.getElementById('langBtn');
  if(!btn) return;
  const L = currentLang();
  btn.textContent = L==='en' ? 'FA' : 'EN';
  btn.title = L==='en' ? 'Switch to Persian' : 'Switch to English';
}
function applyLanguage(lang){
  const L = (lang==='en') ? 'en' : 'fa';
  settings.lang = L;
  document.documentElement.lang = L;
  document.documentElement.dir = L==='en' ? 'ltr' : 'rtl';
  try{ saveSettings(); }catch(e){}
  applyStaticI18n();
  updateLangButton();
  // Re-render every dynamic section so generated strings follow the active language.
  // Static bilingual blocks (guide, long-form content) switch via html[lang] CSS — no DOM scrubbing.
  const rerender = [
    renderDailyChecklist, renderPreChecklist, renderTodayTrades, updateDashboard,
    renderSettings, renderHistory, drawPerformancePage, renderWatchlistPage,
    renderRoutinePage, renderWeeklyAutoSummary, renderWeeklyList, renderWeeklySuggestions,
    renderJournalHistory, renderQuiz, renderModelGuideTemplates, renderModelReport,
    updateModelStatusBar, renderTrash, renderWatchlistSettings,
    renderKillZoneBanner, renderDayLossMeter, renderBiasConflictWarn,
    renderConditionScore, renderFocusDrillBanner, renderFailurePatternWarn,
    updateGlossaryLinkTitles
  ];
  rerender.forEach(fn=>{ if(typeof fn==='function'){ try{ fn(); }catch(e){ console.error(e); } } });
}
function setLanguage(lang){
  applyLanguage(lang);
  toast(lang==='en' ? t('toast.langEn') : t('toast.langFa'));
}
function cycleLanguage(){
  setLanguage(currentLang()==='en' ? 'fa' : 'en');
}
function chooseLanguage(lang){
  settings.langChosen = true;
  settings.lang = lang==='en' ? 'en' : 'fa';
  try{ saveSettings(); }catch(e){}
  const gate = document.getElementById('langGate');
  if(gate) gate.classList.remove('active');
  applyLanguage(settings.lang);
  showContractIfNeeded();
  toast(t(settings.lang==='en' ? 'toast.langEn' : 'toast.langFa'));
}
function showLangGateIfNeeded(){
  if(settings.langChosen) return;
  const gate = document.getElementById('langGate');
  if(gate) gate.classList.add('active');
}

// نگاشت واحد احساسات هنگام ورود — یک منبع برای select فرم، فیلتر آرشیو، و نمایش روی کارت معامله.
// «rushed» دیگر قابل‌انتخاب نیست (با FOMO یکی گرفته شد) ولی برای معاملات قدیمی ثبت‌شده نگه داشته شده.
const EMOTION_LABELS = {
  calm:          {emoji:'😌', fa:'آرام و مطمئن', en:'Calm & confident'},
  fomo:          {emoji:'😵', fa:'FOMO (ترس از جا موندن)', en:'FOMO'},
  revenge:       {emoji:'😡', fa:'انتقام‌جو', en:'Revenge'},
  hesitant:      {emoji:'🤔', fa:'مردد / دودل', en:'Hesitant'},
  overconfident: {emoji:'😎', fa:'بیش‌ازحد مطمئن', en:'Overconfident'},
  bored:         {emoji:'🥱', fa:'بی‌حوصله', en:'Bored'},
  anxious:       {emoji:'😰', fa:'مضطرب / نگران', en:'Anxious'},
  rushed:        {emoji:'⏱️', fa:'عجول', en:'Rushed'}
};
function emoLabel(val){
  const e=EMOTION_LABELS[val]||EMOTION_LABELS.calm;
  const lab = currentLang()==='en' ? e.en : e.fa;
  return `${e.emoji} ${lab}`;
}
// احساساتی که به‌عنوان «ورود ناپایدار/تکانشی» شمرده می‌شوند (برای امتیاز روحی و هشدار هفتگی)
const IMPULSIVE_EMOTIONS=['fomo','revenge','bored','rushed'];

// روتین روزانه — قابل‌ویرایش. هر فاز: عنوان/بازه‌ی زمانی/رنگ + چند آیتم.
// فرمت هر خط آیتم برای ویرایش ساده در textarea: «زمان|عنوان|توضیح» — چند نکته داخل توضیح با ~ از هم جدا می‌شن.
const DEFAULT_ROUTINE = [
  {id:'ph1', title:'فاز اول · زمینه‌سازی عصبی', titleEn:'Phase 1 · Neural priming', accent:'purple', window:'06:30 – 08:30', items:
`06:30|بیداری|۵۰۰ml آب ولرم~۲۰ دقیقه اول گوشی نباشد
06:50|مدیتیشن|تنفس مربعی ۴-۴-۴-۴ به مدت ۱۰ دقیقه~۵-۱۰ دقیقه نور طبیعی
07:10|صبحانه|پروتئین + چربی سالم + کربوهیدرات پیچیده~قند ساده ممنوع
07:40|تحلیل ماکرو|Daily و H4 / IDM / AH-AL`,
itemsEn:
`06:30|Wake up|500ml warm water~No phone for first 20 minutes
06:50|Meditation|Box breathing 4-4-4-4 for 10 minutes~5-10 min natural light
07:10|Breakfast|Protein + healthy fat + complex carbs~No simple sugar
07:40|Macro analysis|Daily & H4 / IDM / AH-AL`},
  {id:'ph2', title:'فاز دوم · Kill Zone لندن', titleEn:'Phase 2 · London Kill Zone', accent:'amber', window:'08:30 – 12:30', items:
`08:30|فیلتر اخبار|High Impact → ۱۰ دقیقه قبل و بعد هیچ اوردری. برای پوزیشن‌های از قبل باز: استاپ را جابجا نکن؛ اگر SL داخل بازه‌ی احتمالی اسپایک خبر است، حجم را نصف کن یا کامل ببند.
08:30–12:30|Kill Zone لندن|M5 / Sweep آسیا / POI / CHoCH حداقل M5~هیدراتاسیون هر ۳۰ دقیقه`,
itemsEn:
`08:30|News filter|High Impact → no new orders 10 min before/after. For open positions: do not move stop; if SL is inside likely news spike range, half size or close fully.
08:30–12:30|London Kill Zone|M5 / Asia sweep / POI / CHoCH min M5~Hydrate every 30 minutes`},
  {id:'ph3', title:'فاز سوم · ریست', titleEn:'Phase 3 · Reset', accent:'cyan', window:'12:30 – 15:30', items:
`12:30|خروج مطلق|مانیتورها خاموش
12:45|ناهار سبک|
13:30|Power Nap|۲۰ دقیقه در اتاق تاریک`,
itemsEn:
`12:30|Hard stop|Monitors off
12:45|Light lunch|
13:30|Power Nap|20 minutes in a dark room`},
  {id:'ph4', title:'فاز چهارم · Overlap + سشن نیویورک', titleEn:'Phase 4 · Overlap + New York', accent:'amber', window:'15:30 – 19:30', items:
`15:30|به‌روزرسانی|
15:30–17:30|Overlap لندن-نیویورک|بالاترین نقدینگی روز — اگر ۱٪ در لندن خورده → نیویورک تعطیل
17:30–19:30|نیویورک خالص|نقدینگی کمتر از Overlap — احتیاط در حجم`,
itemsEn:
`15:30|Update|
15:30–17:30|London–NY Overlap|Highest liquidity of the day — if 1% taken in London → NY closed
17:30–19:30|Pure New York|Less liquidity than Overlap — careful with size`},
  {id:'ph5', title:'فاز پنجم · تخلیه', titleEn:'Phase 5 · Wind-down', accent:'purple', window:'19:30 →', items:
`19:30|ژورنال|عکس چارت / دلیل ورود / «۱۰۰٪ مکانیکی بودم؟»
20:00|خاموشی|
20:30|ورزش|
22:00|خواب ۸ ساعته|`,
itemsEn:
`19:30|Journal|Chart screenshot / entry reason / "Was I 100% mechanical?"
20:00|Shutdown|
20:30|Exercise|
22:00|8 hours sleep|`}
];

const DEFAULT_DAILY = [
  {id:'dt2',text:'هم‌راستایی H4 تایید شد',textEn:'H4 alignment confirmed',cat:'tech',pts:3,critical:false},
  {id:'dt4',text:'تقویم اقتصادی چک شد',textEn:'Economic calendar checked',cat:'tech',pts:3,critical:false},
  {id:'dr1',text:'سقف سود روزانه (Consistency) در نظر گرفته شد',textEn:'Daily consistency profit cap considered',cat:'risk',pts:4,critical:true},
  {id:'dr2',text:'هیچ معامله باز شبانه/استرس‌زا نیست',textEn:'No stressful overnight open positions',cat:'risk',pts:4,critical:false},
  {id:'dm1',text:'خواب ۸ ساعته کامل',textEn:'Full 8 hours of sleep',cat:'mental',pts:2,critical:false},
  {id:'dm2',text:'۵۰۰ml آب + ۱۰ دقیقه مدیتیشن',textEn:'500ml water + 10 min meditation',cat:'mental',pts:2,critical:false},
  {id:'dm3',text:'صبحانه سالم (بدون قند ساده)',textEn:'Healthy breakfast (no simple sugar)',cat:'mental',pts:2,critical:false},
  {id:'dm4',text:'۲۰ دقیقه اول گوشی چک نشد',textEn:'No phone in first 20 minutes',cat:'mental',pts:2,critical:false}
];
function itemText(item){
  if(!item) return '';
  if(currentLang()==='en' && item.textEn) return item.textEn;
  return item.text || item.textEn || '';
}
// هر آیتم علاوه بر دسته‌ی امتیازدهی (cat) یک «مرحله» (stage) هم داره
const DEFAULT_PRE = [
  {id:'pm1',text:'بدون FOMO یا عجله',textEn:'No FOMO or rushing',cat:'mental',pts:2,critical:true,stage:'mental'},
  {id:'pm2',text:'تمرکز کامل؛ حواس‌پرتی نیست',textEn:'Full focus; no distractions',cat:'mental',pts:2,critical:false,stage:'mental'},
  {id:'pt4',text:'سطوح کلیدی (متناسب با سبک معامله) از قبل رسم شدن',textEn:'Key levels drawn for this trade style',cat:'tech',pts:3,critical:true,stage:'levels'},
  {id:'pt1',text:'POI معتبر شناسایی شد',textEn:'Valid POI identified',cat:'tech',pts:3,critical:true,stage:'sweep'},
  {id:'pt2',text:'Sweep واقعی رخ داد — raid از سطح + Close برگشت به داخل رنج (نه فقط فتیله)',textEn:'Real sweep: level raid + close back inside range (not wick only)',cat:'tech',pts:3,critical:true,stage:'sweep'},
  {id:'pt5',text:'CHoCH تایید شد (حداقل M5)',textEn:'CHoCH confirmed (min M5)',cat:'tech',pts:3,critical:true,stage:'confirm'},
  {id:'pt3',text:'FVG بلافاصله بعد از OB دیده شد',textEn:'FVG seen immediately after OB',cat:'tech',pts:3,critical:false,stage:'confirm'},
  {id:'pr1',text:'R:R حداقل ۱.۵:۱',textEn:'R:R at least 1.5:1',cat:'risk',pts:4,critical:true,stage:'risk'},
  {id:'pr2',text:'استاپ مکانیکی (پله ۱: زیر/بالای OB کامل H4 | پله ۲: زیر/بالای OB کوچک M5)',textEn:'Mechanical stop (tier1: full H4 OB | tier2: small M5 OB)',cat:'risk',pts:4,critical:false,stage:'risk'},
  {id:'pr3',text:'حجم بر اساس ریسک مجاز محاسبه شد',textEn:'Size calculated from allowed risk',cat:'risk',pts:4,critical:false,stage:'risk'},
  {id:'pr4',text:'ورود دو پله‌ای در نظر گرفته شد',textEn:'Two-tier entry considered',cat:'risk',pts:4,critical:false,stage:'risk'},
  {id:'pl3',text:'یادداشت دلیل ورود قبل از کلیک نوشته شد',textEn:'Entry reason noted before click',cat:'learning',pts:3,critical:true,stage:'final'},
  {id:'pl1',text:'این ستاپ را قبلاً دیده و مستند کرده‌ام',textEn:'I have seen and documented this setup before',cat:'learning',pts:3,critical:false,stage:'final'},
  {id:'pl2',text:'اگر ستاپ مشابه قبلاً ضرر داده، می‌دانم این بار چه فرقی دارد',textEn:'If a similar setup lost before, I know what is different now',cat:'learning',pts:3,critical:false,stage:'final'}
];

const PRE_STAGES = [
  {key:'mental', icon:'🧠', title:'آمادگی ذهنی', titleEn:'Mental readiness', guide:'g-model'},
  {key:'bias',   icon:'📊', title:'بایاس / وضعیت بازار', titleEn:'Bias / market condition', guide:'g-bias',  selectKey:'_bias', selectLabel:'وضعیت بازار', selectLabelEn:'Market condition', selectOptions:[['','— انتخاب کنید —'],['trendUp','روند صعودی (HH/HL)'],['trendDown','روند نزولی (LH/LL)'],['ranging','رنج / بدون روند']], selectOptionsEn:[['','— select —'],['trendUp','Uptrend (HH/HL)'],['trendDown','Downtrend (LH/LL)'],['ranging','Range / no trend']]},
  {key:'levels', icon:'📍', title:'سطوح کلیدی', titleEn:'Key levels', guide:'g-liq'},
  {key:'sweep',  icon:'🎯', title:'Sweep نقدینگی', titleEn:'Liquidity sweep', guide:'g-liq'},
  {key:'confirm',icon:'🔎', title:'تأیید LTF', titleEn:'LTF confirmation', guide:'g-entry'},
  {key:'risk',   icon:'🚪', title:'خروج و ریسک', titleEn:'Exit & risk', guide:'g-entry', formFieldCheck:'nt-exit-type'},
  {key:'final',  icon:'📝', title:'یادداشت نهایی', titleEn:'Final note', guide:'g-entry'}
];
function stageTitle(s){ return currentLang()==='en' ? (s.titleEn||s.title) : s.title; }
function stageSelectLabel(s){ return currentLang()==='en' ? (s.selectLabelEn||s.selectLabel) : s.selectLabel; }
function stageSelectOptions(s){ return currentLang()==='en' && s.selectOptionsEn ? s.selectOptionsEn : s.selectOptions; }

const DEFAULT_WATCHLIST = ['EURUSD','GBPUSD','USDJPY','XAUUSD','BTCUSD'];

const SETUP_TYPES = ['Judas Swing','Continuation','Sweep نقدینگی داخلی','Sweep نقدینگی خارجی','برگشت از Order Block','پرشدن FVG'];
const LIQUIDITY_TYPES = ['Asia High/Low Sweep','PDH/PDL Sweep','PWH/PWL Sweep','Equal Highs/Lows','Trendline Liquidity','سقف/کف سشن'];
const POI_TYPES = ['Order Block','Fair Value Gap','OB + FVG','Breaker Block','Mitigation Block'];

const CORRELATIONS = {
  'EURUSD':['GBPUSD','CHFUSD'],
  'GBPUSD':['EURUSD','AUDUSD'],
  'USDJPY':['USDCAD'],
  'XAUUSD':['BTCUSD'],
  'BTCUSD':['ETHUSD','XAUUSD'],
  'ETHUSD':['BTCUSD']
};

function localDateStr(d){
  d = d || new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

