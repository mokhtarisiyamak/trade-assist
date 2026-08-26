import fs from 'fs';
let s = fs.readFileSync('js/i18n.js', 'utf8');
const pairs = [
  ["'settings.addPair':'+ افزودن',", "'settings.addPair':'+ افزودن','settings.addItem':'افزودن آیتم',"],
  ["'settings.addPair':'+ Add',", "'settings.addPair':'+ Add','settings.addItem':'Add item',"],
  ["'routine.kzLondon':'Kill Zone لندن','routine.kzNy':'Overlap + نیویورک',",
   "'routine.kzLondon':'Kill Zone لندن','routine.kzNy':'Overlap + نیویورک','routine.tzLondonW':'۱۰:۳۰–۱۳:۳۰','routine.tzLondonS':'۰۹:۳۰–۱۲:۳۰','routine.tzNyW':'۱۵:۳۰–۱۸:۳۰','routine.tzNyS':'۱۴:۳۰–۱۷:۳۰',"],
  ["'routine.kzLondon':'London Kill Zone','routine.kzNy':'Overlap + New York',",
   "'routine.kzLondon':'London Kill Zone','routine.kzNy':'Overlap + New York','routine.tzLondonW':'10:30–13:30','routine.tzLondonS':'09:30–12:30','routine.tzNyW':'15:30–18:30','routine.tzNyS':'14:30–17:30',"]
];
let ok = 0;
for (const [a, b] of pairs) { if (s.includes(a)) { s = s.split(a).join(b); ok++; } else console.log('MISS:', a.slice(0, 50)); }
fs.writeFileSync('js/i18n.js', s);
console.log('applied', ok, 'of', pairs.length);
