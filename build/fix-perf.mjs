import fs from 'fs';
const EN = "currentLang()==='en'";
let s = fs.readFileSync('js/performance.js', 'utf8');
let miss = 0;
function rep(a, b) { if (s.includes(a)) s = s.split(a).join(b); else { console.log('MISS:', a.slice(0, 70)); miss++; } }

rep("{label:'زیر ۶۰',min:0,max:59,color:'var(--red)'},", "{label:${EN?'Below 60':'زیر ۶۰'},min:0,max:59,color:'var(--red)'},");
rep("{label:'۶۰ تا ۷۹',min:60,max:79,color:'var(--amber)'},", "{label:${EN?'60–79':'۶۰ تا ۷۹'},min:60,max:79,color:'var(--amber)'},");
rep("{label:'۸۰ به بالا',min:80,max:100,color:'var(--green)'}", "{label:${EN?'80+':'۸۰ به بالا'},min:80,max:100,color:'var(--green)'}");
rep("امتیاز آمادگی پیش‌ورود ${b.label}", "${EN?'Pre-entry readiness score':'امتیاز آمادگی پیش‌ورود'} ${b.label}");
rep("${inBand.length} معامله${wr!==null?' · '+wr+'٪ وین‌ریت':''}", "${inBand.length} ${EN?'trades':'معامله'}${wr!==null?' · '+wr+(EN?'% win rate':'٪ وین‌ریت'):''}");
rep("const stageNames={mental:'آمادگی ذهنی',bias:'بایاس',levels:'سطوح کلیدی',sweep:'Sweep نقدینگی',confirm:'تأیید LTF',final:'خروج/ریسک'};",
  "const en=${EN};\n  const stageNames=en?{mental:'Mental readiness',bias:'Bias',levels:'Key levels',sweep:'Liquidity sweep',confirm:'LTF confirmation',final:'Exit/Risk'}:{mental:'آمادگی ذهنی',bias:'بایاس',levels:'سطوح کلیدی',sweep:'Sweep نقدینگی',confirm:'تأیید LTF',final:'خروج/ریسک'};");
rep("مراحل قبل از ورود (✓ vs ✗)", "${en?'Pre-entry stages (✓ vs ✗)':'مراحل قبل از ورود (✓ vs ✗)'}");
rep("<tr><th>مرحله</th><th>میانگین R</th><th>تعداد</th></tr>", "<tr><th>${en?'Stage':'مرحله'}</th><th>${en?'Avg R':'میانگین R'}</th><th>${en?'Count':'تعداد'}</th></tr>");
rep("<h4 style=\"font-size:.8rem;color:var(--green);margin:10px 0 4px;\">ستاپ‌ها</h4><table class=\"ms-table\"><tr><th>ستاپ</th><th>میانگین R</th><th>تعداد</th></tr>",
  "<h4 style=\"font-size:.8rem;color:var(--green);margin:10px 0 4px;\">${en?'Setups':'ستاپ‌ها'}</h4><table class=\"ms-table\"><tr><th>${en?'Setup':'ستاپ'}</th><th>${en?'Avg R':'میانگین R'}</th><th>${en?'Count':'تعداد'}</th></tr>");
rep("<h4 style=\"font-size:.8rem;color:var(--purple);margin:10px 0 4px;\">احساس هنگام ورود</h4><table class=\"ms-table\"><tr><th>احساس</th><th>میانگین R</th><th>تعداد</th></tr>",
  "<h4 style=\"font-size:.8rem;color:var(--purple);margin:10px 0 4px;\">${en?'Emotion at entry':'احساس هنگام ورود'}</h4><table class=\"ms-table\"><tr><th>${en?'Emotion':'احساس'}</th><th>${en?'Avg R':'میانگین R'}</th><th>${en?'Count':'تعداد'}</th></tr>");
rep("const labels=['تکنیکال','ریسک','روحی/جسمی','یادگیری'];",
  "const labels=${EN}?['Technical','Risk','Mental/Physical','Learning']:['تکنیکال','ریسک','روحی/جسمی','یادگیری'];");
rep("fmt:v=>v>0?('+ '+v+' برد'):v<0?(-v+' ضرر'):'بدون معامله'};",
  "fmt:v=>v>0?(EN?('+ '+v+' wins'):('+ '+v+' برد')):v<0?((EN?(-v+' losses':-v+' ضرر'))):(EN?'no trades':'بدون معامله')};");
fs.writeFileSync('js/performance.js', s);
console.log('performance.js done, missed:', miss);
