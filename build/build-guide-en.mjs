import fs from 'fs';

const ROOT = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = p => fs.readFileSync(ROOT + p, 'utf8');

// ---- load phrase pairs from js/i18n.js (eval the array literal only) ----
const i18nSrc = read('js/i18n.js');
const m = i18nSrc.match(/const FA_EN_PHRASES = \[([\s\S]*?)\n\];/);
if (!m) { console.error('FA_EN_PHRASES not found'); process.exit(1); }
const PAIRS = eval('[' + m[1] + ']');
PAIRS.sort((a, b) => b[0].length - a[0].length);
console.log('pairs loaded:', PAIRS.length);

// ---- port of translateTextToEn (non-destructive variant) ----
function toEn(str, leftovers, ctx) {
  let out = str;
  for (const [fa, en] of PAIRS) {
    if (!fa) continue;
    if (fa.length <= 4) { if (out === fa) out = en; continue; }
    if (out.indexOf(fa) !== -1) out = out.split(fa).join(en);
  }
  out = out.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
  out = out.replace(/\u200c/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (/[\u0600-\u06FF]/.test(out)) leftovers.push({ ctx, fa: str, en: out });
  return out;
}

// ---- extract guideFaRoot inner HTML ----
const idx = read('index.html');
const startTag = idx.match(/<div data-lang="fa" id="guideFaRoot">/);
const start = idx.indexOf(startTag[0]) + startTag[0].length;
// find matching close by div depth
let depth = 1, i = start, closeIdx = -1;
const re = /<\/?div\b[^>]*>/g; re.lastIndex = start;
let mm;
while ((mm = re.exec(idx)) !== null) {
  if (mm[0][1] === '/') { depth--; if (depth === 0) { closeIdx = mm.index; break; } }
  else depth++;
}
const faHtml = idx.slice(start, closeIdx);
console.log('guideFaRoot bytes:', faHtml.length);

// ---- translate text segments only (tags untouched) ----
const leftovers = [];
let n = 0;
const outHtml = faHtml.split(/(<[a-zA-Z\/!][^>]*>)/g).map(seg => {
  if (seg.startsWith('<')) return seg;
  if (!seg.trim()) return seg;
  if (!/[\u0600-\u06FF\u200c]/.test(seg)) { n++; return seg; }
  n++;
  return toEn(seg, leftovers, 'seg#' + n);
}).join('');

fs.writeFileSync(ROOT + 'tools/build/guide-en-raw.html', outHtml, 'utf8');
fs.writeFileSync(ROOT + 'tools/build/guide-leftovers.json', JSON.stringify(leftovers, null, 2), 'utf8');
console.log('segments translated:', n);
console.log('leftover Persian segments:', leftovers.length);
leftovers.slice(0, 40).forEach(l => console.log('---\nFA: ' + l.fa.slice(0, 120) + '\n-> ' + l.en.slice(0, 120)));
