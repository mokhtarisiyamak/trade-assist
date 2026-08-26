import fs from 'fs';
const P = 'tools/build/guide-en-raw.html';
let s = fs.readFileSync(P, 'utf8');
const before = s;

s = s.replace(/:<\/strong>(?=[A-Za-z(])/g, ':</strong> ');
s = s.replace(/←<strong/g, '← <strong');
s = s.replace(/=<strong/g, '= <strong');
s = s.replace(/<\/strong>\(/g, '</strong> (');
s = s.replace(/<\/strong>(?=[A-Z])/g, '</strong> ');
s = s.replace(/([a-z])<strong>/g, '$1 <strong>');
s = s.replace(/ {2,}/g, ' ');

const reps = [
  ['The most reliable liquidity on the chart sits next to<strong style="color:var(--gold-400);">previous day high/low</strong>— or —<strong style="color:var(--gold-400);">prior session</strong>Bias comes from the higher timeframe; execution happens on the lower timeframe.',
   'The most reliable liquidity sits right at<strong style="color:var(--gold-400);">previous day high/low</strong> — or<strong style="color:var(--gold-400);">prior session</strong> high/low. Bias comes from the higher timeframe; execution happens on the lower timeframe.'],
  ['Choose one<strong>Before</strong>Choose before entry — not when money is on the table.',
   'Choose one<strong>before</strong> entry — not when money is on the table.'],
  ['Step 5 · Types<span class="no-glossary">POI</span>+ scoring system',
   'Step 5 · <span class="no-glossary">POI</span> types + scoring system'],
  ['Minimum reward-to-risk<span class="mono" style="color:var(--amber);font-weight:700;">1.5 : 1</span>If the second target',
   'Minimum reward-to-risk <span class="mono" style="color:var(--amber);font-weight:700;">1.5 : 1</span>. If the second target'],
  ['Wait for<strong>CHoCH with body close</strong>Stay on at least M5',
   'Wait for a<strong>CHoCH with body close</strong>, on at least M5'],
  ['trades:<strong>2%</strong>Never take', 'trades: <strong>2%</strong>. Never take'],
  ['confirmation:<strong>M5</strong>Never M1', 'confirmation: <strong>M5</strong>. Never M1'],
  ['border-right:3px solid var(--red)', 'border-inline-start:3px solid var(--red)']
];
for (const [a, b] of reps) { if (!s.includes(a)) console.log('NOT FOUND:', a.slice(0, 60)); s = s.split(a).join(b); }

fs.writeFileSync(P, s);
console.log('changed:', s !== before, '| bytes:', s.length);
const segs = s.split(/(<[a-zA-Z\/!][^>]*>)/g);
let bad = 0; segs.forEach(seg => { if (!seg.startsWith('<') && /[\u0600-\u06FF]/.test(seg)) bad++; });
console.log('persian-left:', bad);
console.log('open-divs:', (s.match(/<div\b/g) || []).length, 'close-divs:', (s.match(/<\/div>/g) || []).length);
