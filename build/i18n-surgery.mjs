import fs from 'fs';

// 1) split out legacy phrase machinery
const src = fs.readFileSync('js/i18n.js', 'utf8').split(/\r?\n/);
const phrasesStart = src.findIndex(l => l.startsWith('const FA_EN_PHRASES'));
const restoreFnEnd = src.findIndex(l => l.startsWith('function updateLangButton'));
if (phrasesStart < 0 || restoreFnEnd < 0) { console.error('markers missing'); process.exit(1); }
const legacyBody = src.slice(phrasesStart, restoreFnEnd).join('\n');
const legacy = `// ============================================================
// LEGACY FA->EN phrase table — extracted from the v6.2 runtime scrubber.
// NO LONGER USED AT RUNTIME. Loaded on demand ONLY by the opt-in
// "Translate stored Persian items" tool in Settings, to migrate
// user-authored checklist items / notes created before v7.
// ============================================================
${legacyBody}
window.TBC_LEGACY_TRANSLATE = translateTextToEn;
`;
fs.writeFileSync('js/legacy-fa-phrases.js', legacy);
console.log('legacy-fa-phrases.js written:', legacy.length, 'bytes');

// 2) remove phrases + translate + scrub + restore from i18n.js
let out = [...src.slice(0, phrasesStart), ...src.slice(restoreFnEnd)].join('\n');

// 3) replace applyLanguage with clean version (no scrubbing, wider re-render)
const oldApply = out.match(/function applyLanguage\(lang\)\{[\s\S]*?\n\}/);
if (!oldApply) { console.error('applyLanguage not found'); process.exit(1); }
const newApply = `function applyLanguage(lang){
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
    updateModelStatusBar, renderTrash, renderWatchlistSettings
  ];
  rerender.forEach(fn=>{ if(typeof fn==='function'){ try{ fn(); }catch(e){ console.error(e); } } });
}`;
out = out.replace(oldApply[0], newApply);

// 4) chooseLanguage toast via t()
out = out.replace(
  "toast(settings.lang==='en' ? 'Language: English' : 'زبان: فارسی');",
  "toast(t(settings.lang==='en' ? 'toast.langEn' : 'toast.langFa'));"
);

fs.writeFileSync('js/i18n.js', out);
console.log('i18n.js rewritten. lines:', out.split('\n').length);
console.log('scrub references left:', (out.match(/scrubPersianFromDom|restorePersianDom|FA_EN_PHRASES|translateTextToEn/g) || []).length);
