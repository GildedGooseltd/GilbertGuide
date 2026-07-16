# Gilbert Guide — branding & formatting

**Style guide (canonical):** [`STYLE-GUIDE.md`](STYLE-GUIDE.md) — colors, type, components, hard rules.  
This file maps tokens → files and layout structure.

**Project copy** lives elsewhere: [CONTENT-EDIT.md](CONTENT-EDIT.md) · [`content/INDEX.md`](content/INDEX.md)

---

## 1. Change formatting all at once

Edit `:root` in [`index.html`](index.html). Hard-refresh the browser (`?v=` cache busters on scripts are bumped when JS changes).

---

## 2. File map

| Concern | File |
|---------|------|
| Tokens, zones, sticky bar, TOC, cards, confirm, survey | `index.html` `<style>` + markup |
| Value icon classes / survey / TOC / confirm summary | `app.js` (classes only — no badge hex) |
| Generated project data | `projects-data.js` (from markdown build) |

Do **not** put branding hex in project markdown or `projects-data.js`.

---

## 3. Brand tokens (`index.html` `:root`)

### Spine — cream / gold / brown

| Token | Default | Use |
|-------|---------|-----|
| `--gg-gold` | `#c9a86c` | Accents, zone gold bar |
| `--gg-gold-bright` | `#e3c58d` | Highlights |
| `--gg-gold-dark` | `#b8860b` | Zone labels, rank accents |
| `--gg-cream` | `#f8f5ef` | Page background (`--bg`) |
| `--gg-cream-panel` | `#f3ede4` | Nested panels, TOC zebra |
| `--gg-paper` | `#fffcf7` | Cards, inputs (`--surface`) |
| `--gg-brown` / `--gg-brown-muted` | `#3d3028` / `#5c4f45` | Body / secondary text |

### Accents — purple · burnt orange · forest (**not navy**)

| Token | Default | Use |
|-------|---------|-----|
| `--gg-royal-deep` | `#3b1769` | Titles, deep purple |
| `--gg-royal` | `#4e2a84` | Primary purple actions / links |
| `--gg-royal-mid` | `#6d28a8` | Mid purple, focus, rails |
| `--gg-royal-light` | `#8b5cf6` | Soft purple highlight |
| `--gg-royal-dim` / `--gg-royal-border` | purple wash / border | Selected wash |
| `--gg-burnt` | `#c2410c` | Burnt orange accent |
| `--gg-burnt-dim` / `--gg-burnt-border` | burnt wash / border | Warm callouts |
| `--gg-forest` | `#166534` | Forest green (positive / SEO) |
| `--gg-forest-dim` / `--gg-forest-border` | forest wash / border | Success tints |
| `--gg-positive` | `var(--gg-forest)` | Positive MoM / hits |
| `--gg-negative` | `#cf2d56` | Negative numbers only |
| `--focus-ring` | soft purple glow | `:focus-visible` |
| `--space-sm/md/lg/xl` | 0.75 / 1.25 / 2 / 2.75 rem | Spacing scale |

**`--gradient-brand`:** purple → mid purple → gold-dark.

**Allowed:** purple, burnt orange, forest, gold, cream, brown.

**Forbidden:** navy / blue-black (`#0f172a`, `#1e3a5f`, `#2d1454`, `#3a1a6e`), neon cyan/teal, neon `#7c5cff` as the main brand light, light-on-light plan panels.

### Themes — Light ↔ Dark

Header toggle switches **`light`** and **`dark`** only (legacy `unicorn` maps to `light`). Preference key `gilbert-guide-theme` in `localStorage`. **Default: light** (cream paper + quiet trail questionnaire). Early head script sets `data-theme` before paint. URL override: `?theme=dark` or `?theme=light`.

#### Dark (`html[data-theme="dark"]`)

Black + deep purple night. **No fuchsia / hot pink. No light purple text.** Gold only for rare important highlights.

| Token family | Dark intent |
|--------------|-------------|
| Surfaces | Near-black → deep plum (`#050308` → `#1c1528`) |
| Text | Warm off-white / gray (`#f4f1ea` / `#b8b2a8`) — never lilac |
| Accents | Violet on links/borders (`#a78bfa` / `#8b5cf6`) — not body copy |
| Gold | Antique (`#c9a86c`) — reserved for important highlights only |
| Sticky / TOC | Dark purple panel tokens |
| Buttons on accents | `--btn-on-accent` → near-black ink |

#### Light (`html[data-theme="light"]`)

Quiet cream paper / champagne gold / soft violet. Quiet trail questionnaire. Header **logo title formatting stays default**. No navy. Unicorn mode removed.

---

## 4. Typography

Body: Georgia / Times New Roman (serif cockpit). Titles use `--gg-royal-deep` + gold underline on `.gg-app-title`.

---

## 5. Layout patterns

```
┌─ gg-header ────────────────── Trail Guide title + theme toggle (no logo / character)
├─ picker-zone-ask ──────────── Choose-your-path survey (2 steps) → filters outlines
├─ picker-zone-outlines ─────── TOC table (filtered) + Filter by value
└─ picker-zone-cards ────────── sticky Continue bar + project cards
Overlays: confirm · thank-you
```

**Survey (quiet paper trail-guide):** Q&A in [`content/survey.md`](content/survey.md) → `PROJECT_DATA.survey`. One paper card. Centered masthead (leaf + TRAIL GUIDE + Choose your path). **3-layer** business questions (pressure → channel → bottleneck). No Trailhead/Waypoint chrome. Numbered choice rows with chevrons. Mapping notes: [`content/survey-DRAFT.md`](content/survey-DRAFT.md).

| Pattern | Classes | Behavior |
|---------|---------|----------|
| Zones | `.picker-zone` + `.picker-zone-label` | Gold accent label; one purpose per zone |
| Zone title | `.picker-zone-title` | Short purple-deep headline |
| Sticky submit | `.project-list-controls.sticky-submit-bar` | Sticky bottom; paper + border |
| TOC | `.toc-table` | Zebra even rows; `.row-selected` gold wash wins |
| Cards | `.card` | `--space-lg` between cards; selected = purple wash |
| Value TLDR | `.card-tldr` | Left purple/gold rail around value bullets |
| Confirm picks | `#confirm-selection-summary` | List before email / invoice fields |

---

## 6. Value icon color map

**One map only.** Filter tiles and TOC ICONS column share `.value-icon.icon-{id}` → `--vi-*` tokens in `index.html` `:root`.

| Icon id | Label | Notes |
|---------|-------|-------|
| `foundation` | Foundation | Red family |
| `retainer` | Retainer | Purple |
| `leads` | Leads | Burnt orange |
| `crm` | CRM | Purple |
| `seo` | SEO | Forest |
| `referrals` | Referrals | Rose |
| `efficiency` | Analytics | Gold |
| `intake` | Intake | Soft purple |
| `creative` | Creative | Magenta |
| `general` | Growth | Slate / brown text |
| `account-data` | Account data | Gold |

Chip soft tints: `--vi-*-chip` on `.key-filter-btn[data-icon-filter].filter-active` only — do not replace badge fills.

Palette comment in `:root`: `value-icon-palette v=20260716g`.

**Never:** hardcode badge colors in `app.js` · filter-only navy overrides · second palette under `.toc-value`.

---

## 7. Do / don’t

- Do use purple, burnt orange, and forest as accents on cream / gold / brown.
- Do keep links underlined without relying on hover alone.
- Do keep `:focus-visible` rings on buttons, filters, inputs.
- Don’t use navy / blue-black as primary or secondary.
- Don’t revive light-on-light `.plan-summary` text.

Voice: practical law-firm cockpit for Andrew/team — scannable, not startup-landing wallpaper.

---

## 8. Scanability checklist

- [x] Picker zones have `.picker-zone` + visible `.picker-zone-label`
- [x] Sticky continue/submit bar readable on long lists
- [x] Table zebra; selected row gold wash
- [x] Cards spaced with `var(--space-lg)`
- [x] Summary / value bullets: left accent border (`.card-tldr`)
- [x] Survey in one box; list-row choices
- [x] Links underlined or clearly distinct
- [x] Button `:focus-visible` ring
- [x] Value icons share one `--vi-*` map (filter + TOC)
- [x] No navy brand tokens
- [x] Light ↔ Dark themes via `data-theme` + header toggle

---

## 9. Build, preview, deploy

```bash
cd gilded-goose/clients/pav-law/project-picker
python3 -m http.server 8777 --bind 127.0.0.1
# open http://127.0.0.1:8777/index.html
```

Markdown content changes: `npm run build` (or `npm run watch`). CSS/JS — hard-refresh.

Deploy: [GITHUB-PUSH.md](GITHUB-PUSH.md)

---

## 10. Related

- Chart / KPI pages (when present): leave `kpi-report.js` to the charts owner; shared tokens stay in this `:root`.
- Backend / webhook: [BACKEND-SETUP.md](BACKEND-SETUP.md) · [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)
