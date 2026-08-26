# Trade Assist Coach

A bilingual (Persian / English), offline-capable trading-coach dashboard built as a single static page — no backend, no account, no tracking. All data lives in your browser's `localStorage`.

**Live app:** https://mokhtarisiyamak.github.io/trade-assist/

## Features

- **Daily dashboard** — morning + pre-entry checklists (scored, with critical gates), session plan, forced-stop timers (2h after a loss/BE, full lock after 2 losses or the daily loss cap)
- **The Model** — a mechanical ICT-style liquidity model (bias → sweep → CHoCH → POI → staged entry/exit) wired into the checklist flow
- **Trade journal** — entries with Trade DNA (setup / liquidity / POI / emotion / session), two-tier entries, post-trade review questions
- **Performance analytics** — win rate, profit factor, expectancy, R-multiple distribution, equity curve + drawdown, per-weekday/pair/session/setup breakdowns, behavioral analysis of losses vs wins, checklist-score ↔ outcome correlation
- **Weekly review** — auto-generated week summary, focus drill, review history
- **Daily routine** — editable phase-by-phase schedule with kill-zone clock (DST-aware, Tehran/London/New York)
- **Backup & multi-device** — one-click full JSON backup, restore with **smart merge** (newer records win), settings-only restore, CSV export (Excel-friendly UTF-8 BOM)
- **PWA-lite** — installable, works offline via a service worker

## Language support (v7)

Full parity between **فارسی** and **English**:

- Static UI via a key-based i18n dictionary (`js/i18n.js`) + `data-i18n` attributes
- The full mechanical guide exists natively in both languages (CSS-toggled blocks — no runtime text scrubbing)
- Canvas charts, toasts, modals and generated reports are language-aware
- Dates use `fa-IR` / `en-GB` per language; trade session zones are stored as language-neutral keys
- Checklist items, routine phases and the trader contract store both languages (`{fa, en}`)
- Legacy data authored in Persian before v7 keeps its Persian text; an opt-in tool in **Settings → Legacy data** adds English translations where known wording is recognized

## Development

No build step. Plain HTML/CSS/JS:

```
index.html            markup only
css/styles.css        all styles
js/*.js               modules loaded in order (state → i18n → … → main)
sw.js                 offline service worker
manifest.webmanifest  PWA manifest
tools/qa              puppeteer-core harness driving system Edge (see below)
tools/build           one-shot scripts used for the v7 i18n migration (kept for provenance)
```

### Run locally

```bash
python -m http.server 8123
# → http://localhost:8123
```

(Open via HTTP, not file:// — the service worker and some APIs require it.)

### QA harness

`tools/qa/check.js` and `tools/qa/check-en.js` drive a headless Edge via puppeteer-core:
render stats, console/page errors, and — in EN mode — a DOM-wide scan asserting zero
Persian text outside intentionally-bilingual spots. Screenshots land in `tools/qa/shots/`.

```bash
cd tools/qa && npm i
node check-en.js http://localhost:8123/ my-label
```

## Data & privacy

Everything is stored locally in your browser. Clearing site data erases your journal — take regular backups (the sidebar has a one-click backup; the app nags weekly if you don't).
