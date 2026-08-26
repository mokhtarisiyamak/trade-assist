import fs from 'fs';
const P = 'index.html';
const lines = fs.readFileSync(P, 'utf8').split(/\r?\n/);
const enOpen = lines.findIndex(l => l.includes('id="guideEnRoot"'));
const faOpen = lines.findIndex(l => l.includes('id="guideFaRoot"'));
if (enOpen < 0 || faOpen < 0 || faOpen <= enOpen) { console.error('markers not found', enOpen, faOpen); process.exit(1); }
const raw = fs.readFileSync('tools/build/guide-en-raw.html', 'utf8').replace(/\r?\n/g, '\n').trimEnd();
const nl = '\r\n';
const block = ['<div data-lang="en" id="guideEnRoot">', raw, '</div><!-- /guideEnRoot -->'].join(nl);
const out = [...lines.slice(0, enOpen), ...block.split(nl), ...lines.slice(faOpen)];
fs.writeFileSync(P, out.join(nl) + nl);
console.log('replaced lines', enOpen + 1, '..', faOpen, '| new total:', out.length);
