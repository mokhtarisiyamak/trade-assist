import fs from 'fs';
const P = 'tools/build/guide-en-raw.html';
let s = fs.readFileSync(P, 'utf8');
const reps = [
  ['The most reliable liquidity on the chart sits next to<strong style="color:var(--gold-400);">previous day high/low</strong>— or —<strong style="color:var(--gold-400);">prior session</strong> Bias comes from the higher timeframe; execution happens on the lower timeframe.',
   'The most reliable liquidity sits right at<strong style="color:var(--gold-400);">previous day high/low</strong> — or<strong style="color:var(--gold-400);">prior session</strong> high/low. Bias comes from the higher timeframe; execution happens on the lower timeframe.'],
  ['Choose one <strong>Before</strong> Choose before entry — not when money is on the table.',
   'Choose one<strong>before</strong> entry — not when money is on the table.'],
  ['Wait for <strong>CHoCH with body close</strong> Stay on at least M5 (wick is not enough). M1 is not allowed.',
   'Wait for a<strong>CHoCH with body close</strong>, on at least M5 (a wick is not enough). M1 is not allowed.'],
  ['trades:<strong>2%</strong> Never take', 'trades: <strong>2%</strong>. Never take'],
  ['entry confirmation:<strong>M5</strong> Never M1', 'entry confirmation: <strong>M5</strong>. Never M1']
];
for (const [a, b] of reps) { if (!s.includes(a)) console.log('NOT FOUND:', a.slice(0, 60)); s = s.split(a).join(b); }
fs.writeFileSync(P, s);
console.log('done | bytes:', s.length);
