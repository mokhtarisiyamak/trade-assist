import fs from 'fs';
let s = fs.readFileSync('js/i18n.js', 'utf8');
const reps = [
  ["    'settings.addPair':\"+ افزودن\",",
   "    'settings.addPair':\"+ افزودن\",\n    'settings.addItem':\"افزودن آیتم\","],
  ["    'settings.addPair':\"+ Add\",",
   "    'settings.addPair':\"+ Add\",\n    'settings.addItem':\"Add item\","],
  ["    'routine.kzLondon':\"Kill Zone لندن\",",
   "    'routine.kzLondon':\"Kill Zone لندن\",\n    'routine.tzLondonW':\"۱۰:۳۰–۱۳:۳۰\",\n    'routine.tzLondonS':\"۰۹:۳۰–۱۲:۳۰\",\n    'routine.tzNyW':\"۱۵:۳۰–۱۸:۳۰\",\n    'routine.tzNyS':\"۱۴:۳۰–۱۷:۳۰\","],
  ["    'routine.kzLondon':\"London Kill Zone\",",
   "    'routine.kzLondon':\"London Kill Zone\",\n    'routine.tzLondonW':\"10:30–13:30\",\n    'routine.tzLondonS':\"09:30–12:30\",\n    'routine.tzNyW':\"15:30–18:30\",\n    'routine.tzNyS':\"14:30–17:30\","]
];
for (const [a, b] of reps) {
  if (s.includes(a)) { s = s.split(a).join(b); console.log('ok:', a.trim().slice(0, 40)); }
  else console.log('MISS:', a.trim().slice(0, 40));
}
fs.writeFileSync('js/i18n.js', s);
