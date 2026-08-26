import fs from 'fs';
let s = fs.readFileSync('js/i18n.js', 'utf8');
const faLegacy = `    'legacy.title':"🧳 داده‌های قدیمی (قبل از v7)",
    'legacy.desc':"آیتم‌هایی که قبلاً به فارسی ساختی (چک‌لیست‌ها، قرارداد) متن فارسی‌شان حفظ می‌شود. این ابزار برای معادل‌های پیش‌فرض شناخته‌شده، ترجمه انگلیسی اضافه می‌کند — متن سفارشی خودت دست‌نخورده می‌ماند.",
    'legacy.btn':"🌐 ترجمه آیتم‌های فارسی ذخیره‌شده → انگلیسی",
`;
const enLegacy = `    'legacy.title':"🧳 Legacy data (pre-v7)",
    'legacy.desc':"Items you created in Persian (checklists, contract) keep their Persian text. This tool adds English translations for known default-style wording — your custom wording stays untouched.",
    'legacy.btn':"🌐 Translate stored Persian items → English",
`;
const faAnchor = '    \'settings.trashTitle\':"🗑️ آیتم‌های حذف‌شده (سطل بازیافت)",';
const enAnchor = '    \'settings.trashTitle\':"🗑️ Deleted items (trash bin)",';
if (!s.includes(faAnchor)) { console.error('fa anchor missing'); process.exit(1); }
if (!s.includes(enAnchor)) { console.error('en anchor missing'); process.exit(1); }
s = s.replace(faAnchor, faLegacy + faAnchor);
s = s.replace(enAnchor, enLegacy + enAnchor);
fs.writeFileSync('js/i18n.js', s);
console.log('legacy keys added');
