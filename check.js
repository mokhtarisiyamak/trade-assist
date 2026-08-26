const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:8123/';
const label = process.argv[3] || 'run';
const profile = process.argv[4] || path.join(__dirname, '.profile-' + Date.now());

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--disable-gpu', '--no-first-run', '--user-data-dir=' + profile]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', m => {
    const t = m.type();
    if (t === 'error') consoleErrors.push(m.text());
    else if (t === 'warning') consoleWarnings.push(m.text());
  });
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('requestfailed', r => failedRequests.push(r.url() + ' :: ' + (r.failure() || {}).errorText));

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const domStats = await page.evaluate(() => {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    return {
      title: document.title,
      htmlLang: document.documentElement.lang,
      htmlDir: document.documentElement.dir,
      langGateActive: !!(($('#langGate') || {}).classList || { contains() { return false; } }).contains('active'),
      pageCount: $$('.page').length,
      canvasCount: $$('canvas').length,
      navItemCount: $$('.sidebar nav a, .nav-item').length,
      sidebarText: ($('.sidebar-footer') || {}).textContent?.trim().slice(0, 80) || null,
      contractBannerPresent: !!$('#contract-banner, .contract-banner'),
      bodyChildren: document.body.children.length,
      domSizeKB: Math.round(document.documentElement.outerHTML.length / 1024)
    };
  });

  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
  await page.screenshot({ path: path.join(__dirname, 'shots', label + '.png'), fullPage: false });

  const result = { url, label, domStats, consoleErrors, consoleWarnings, pageErrors, failedRequests };
  fs.writeFileSync(path.join(__dirname, 'results', label + '.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error('HARNESS-FAIL', e); process.exit(1); });
