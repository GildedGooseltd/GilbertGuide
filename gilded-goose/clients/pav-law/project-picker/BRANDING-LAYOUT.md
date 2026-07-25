# Pav Law Cockpit — branding & formatting guide

**Canonical hub** for how the tool *looks*. Change colors, type, and layout tokens here first — then edit the files this doc points to.

**Copy / project text** lives elsewhere: [CONTENT-INDEX.md](CONTENT-INDEX.md) · [CONTENT-EDIT.md](CONTENT-EDIT.md)

---

## TOC

1. [Change formatting all at once](#1-change-formatting-all-at-once)
2. [File map (where CSS lives)](#2-file-map-where-css-lives)
3. [Brand tokens](#3-brand-tokens)
4. [Typography](#4-typography)
5. [Layout patterns](#5-layout-patterns)
6. [KPI chart colors](#6-kpi-chart-colors)
7. [Value icon color map](#7-value-icon-color-map)
8. [Do / don’t](#8-do--dont)
9. [Images & assets](#9-images--assets)
10. [Scanability checklist](#10-scanability-checklist)
11. [Build, preview, deploy](#11-build-preview-deploy)
12. [Related rules & docs](#12-related-rules--docs)

---



## Brand tokens

Defined in `index.html` ****`:root`. `metrics.css` repeats the core GG set for the metrics page.

### Gilded Goose (royal-led UI · gold reserved for critical highlights)


| Token               | Default               | Use                                           |
| ------------------- | --------------------- | --------------------------------------------- |
| `--gg-gold`         | `#c9a86c`             | Rare critical CTA / milestone only            |
| `--gg-gold-bright`  | `#e3c58d`             | Rare critical highlight only                  |
| `--gg-gold-dark`    | `#b8860b`             | Critical metallic accent only                 |
| `--gg-cream`        | `#f8f5ef`             | Page background (`--bg`)                      |
| `--gg-cream-panel`  | `#f3ede4`             | Nested panels                                 |
| `--gg-chart-plot`   | `#fff5ca`             | Chart plot field (light yellow for series contrast) |
| `--gg-paper`        | `#fffcf7`             | Cards, inputs (`--surface`)                   |
| `--gg-brown`        | `#3d3028`             | Body text (`--text`)                          |
| `--gg-brown-muted`  | `#5c4f45`             | Secondary (`--secondary`)                     |
| `--gg-royal-deep`   | `#2d1454`             | Section headers, deep accents                 |
| `--gg-royal`        | `#3a1a6e`             | Headings, buttons, chart primary              |
| `--gg-royal-blue`   | `#1e3a8a`             | Intake / blue accents                         |
| `--gg-royal-mid`    | `#4c1d95`             | Focus rings                                   |
| `--gg-burnt`        | `#c45c26`             | Secondary chart / head accent                 |
| `--gg-forest`       | `#2d5a3d`             | Legacy forest family; not a positive alias    |
| `--gg-rose`         | `#b23a78`             | Website / HubSpot / referral series           |
| `--gg-plum`         | `#6a5acd`             | Spend / cost series                           |
| `--gg-slate`        | `#64748b`             | Neutral / unavailable category                |
| `--gg-caution`      | `#eab308`             | Watch / pending semantic state                |
| `--gg-royal-dim`    | `rgba(45,20,84,0.12)` | Selected wash                                 |
| `--gg-royal-border` | `rgba(45,20,84,0.38)` | Borders                                       |
| `--gg-negative`     | `#cf2d56`             | **Negative numbers only** (− values / gaps)   |
| `--gg-positive`     | `#1f8a65`             | Cash in / target hit only                     |

Percentage-change labels use black, regular-weight `↑ +N%` / `↓ −N%` text. Do not color or bold them.


### Dark panels + chart series (GGL — **no teal**)


| Token                              | Default                                      | Use                                      |
| ---------------------------------- | -------------------------------------------- | ---------------------------------------- |
| `--gg-series-1` … `4`              | royal · burnt · rose · slate                  | KPI chart series                         |
| `--gg-head-accent`                 | burnt orange                                 | Title underline, zone bars               |
| `--pav-ink` / `--pav-ink-panel`    | near-black                                   | Gilbert chat / thank-you dark shells     |
| `--pav-text`                       | `#e8e8ec`                                    | Text on **dark** panels only             |
| `--pav-border`                     | royal rgba                                   | Dark panel borders                       |
| `--pav-gradient-panel` / `-accent` | royal / burnt → ink                          | Dark shells only                         |
| `--pav-teal`                       | → `--gg-series-2` (burnt)                    | **Deprecated** — do not introduce teal   |
| Cockpit title                      | `--gg-royal-deep` + burnt rule               | `.cockpit-title`                         |


Semantic aliases (`--bg`, `--surface`, `--text`, `--border`, `--gradient-brand`, `--radius`, `--space-*`) map to GG tokens — prefer editing the `--gg-*` sources.

**Gold lock:** live gold is limited to the primary Review Plan/continue CTA, completion/thank-you milestones, the premium Why Gilded Goose frame, and the critical Solutions callout. Use royal purple or semantic red/yellow/green everywhere else.

### Layout scale


| Token                                                     | Default            | Use                           |
| --------------------------------------------------------- | ------------------ | ----------------------------- |
| `--radius`                                                | `12px`             | Cards, panels                 |
| `--space-sm` / `--space-md` / `--space-lg` / `--space-xl` | `0.75` → `2.75rem` | Gaps                          |
| `--font-min-rem`                                          | `0.875rem` (14px)  | Labels, hints — UI copy floor |




### Contrast (ADA)

On cream/paper (`--bg`, `--gg-paper`, `--surface-plan`): use `--text`, `--gg-brown`, or `--gg-royal` only.

**Never** put `#f0f4fc`, `--pav-text`, or white rgba washes on light panels.

Links on light: `--gg-royal` + underline. Focus: `outline: 2px solid var(--gg-royal-mid)`.

---



## 4. Typography


| Element               | Selector / location    | Pattern                                                                     |
| --------------------- | ---------------------- | --------------------------------------------------------------------------- |
| Body (cockpit)        | `body` in `index.html` | Georgia / Times, serif · `1.14rem` · line-height `1.65` — “legal memo” feel |
| Body (metrics page)   | `metrics.css` `body`   | system-ui sans — metrics-only exception                                     |
| Cockpit title         | `.cockpit-title`       | `clamp(2.35rem, 6vw, 3.75rem)`, weight 800, `--gg-royal-deep` + burnt underline |
| Section / zone labels | `.picker-zone-label`   | Uppercase royal label + royal/burnt rule                                      |
| KPI section titles    | `.kpi-section-title`   | Bold white; summary = solid royal-deep fill + burnt left bar                  |
| Card titles           | `.card-title`          | ~`1.28rem`, weight 800, royal                                               |
| KPI report title      | `.kpi-report-title`    | `1.35rem`, weight 800, royal                                                |
| Table headers         | `.toc-table thead`     | Uppercase, muted brown                                                      |


**Section title pattern:** solid royal-deep header → short uppercase white label → lavender hint → burnt left rule. No gradient or pale wash. Gold appears only when the section itself is a critical milestone.

To switch cockpit body to sans: change only `body { font-family }` in `index.html`; re-check card density.

---



## 5. Layout patterns

```
┌─ cockpit-header ───────────── title + subtitle
├─ cockpit-tabs ─────────────── KPIs | Project Guide | Impact
│
├─ [KPIs] ───────────────────── kpi-report.js → #kpi-report-kpis
│     collapsible .kpi-section (<details>)
│     .kpi-stat-card / .kpi-goal-card tiles
│     .kpi-split-grid → .kpi-split-panel (side-by-side; stack ≤900px)
├─ [Impact] ─────────────────── #completed-list + #revenue-calculator
└─ [Project Guide]
   ├─ .picker-zone-priorities ── selection + Pav Priorities
   ├─ .picker-zone-outlines ──── value filters + priority table
   └─ .picker-zone-cards ─────── project cards → submit

Overlays: Gilbert chat · confirm · thank-you
```


| Pattern           | Classes                                | Behavior                                        |
| ----------------- | -------------------------------------- | ----------------------------------------------- |
| Cockpit tabs      | `.cockpit-tabs`, `.view-tab`           | One active view; royal active fill              |
| KPI sections      | `.kpi-section`, `.kpi-section-summary` | Collapsible; burnt/royal accent + distinctive head |
| Stat / goal cards | `.kpi-stat-card`, `.kpi-goal-card`     | `--gg-box-border` / paper; yellow only for written caution; **same-row equal height** via `.kpi-tile-with-projects` subgrid |
| Tile + Solutions  | `.kpi-tile-with-projects`             | Card band + Solutions band; cards in a row match height on all pages |
| Split grids       | `.kpi-split-grid`, `.kpi-split-panel`  | Shared box chrome; 2-col → 1-col ≤900px         |
| Project cards     | `.card`, `.card.selected`              | Box border/shadow; selected = royal wash        |
| Zone labels       | `.picker-zone` + `.picker-zone-label`  | Royal/burnt accent heads; scan breaks between areas |
| Charts            | `chartBlock()` in JS                   | **Required** `.kpi-chart-head` title (+ subtitle) · plot · legend (2+ series) · detail table |


Confirm flow: payment options → submit → fixed SOW emailed by private link → Andrew checkbox signature → Kate private countersign link → final PDF email + Drive archive. Andrew can continue to the QuickBooks deposit after his signature. Action items appear on thank-you / email — not on the picker browse zones.

---



## 6. KPI chart colors

**Structure:** every graph card uses `chartBlock({ title, subtitle, chart, … })` — **required** header title in `.kpi-chart-head`, then plot + legend (2+ series) + detail table always below (not behind “Show table” alone). Section heads alone do not satisfy the chart-title rule. Rotated Y-axis titles must clear tick labels (left pad ≥ 84 for multi-word axis titles — see REPORTING-BRAND-GUIDE §7). **Y-scale headroom:** top tick ≥ one integer above the highest data point (same guide §7).

**Plot field:** `--gg-chart-plot` (`#fff5ca`) light yellow behind every chart so series colors read clearly. Stacked bars use a single **royal-deep** stroke — never white/paper outlines between segments.

**Locked triad** (unique, high-contrast — no two similar purples adjacent):


| Role                                           | Hex       | Token / note     |
| ---------------------------------------------- | --------- | ---------------- |
| Primary / cases / Military                     | `#3a1a6e` | `--gg-series-1` / `--gg-royal` |
| Digital / Search / Core DV                     | `#c45c26` | `--gg-series-2` / `--gg-burnt` |
| Website / HubSpot / NTGUILT                    | `#b23a78` | `--gg-series-3` / `--gg-rose` |
| Neutral / unavailable                          | `#64748b` | `--gg-series-4` / `--gg-slate` |
| LSA / intake                                   | `#1e3a8a` | `--gg-royal-blue` |
| Spend / cost                                   | `#6a5acd` | `--gg-plum` |


**Cases MoM stack:** Closed `#64748b` · New `#1e3a8a` · Red accounts `#b23a78` (red accounts are rose as a named category, not alert red).

**Forbidden:** teal/cyan (`#00d4c4`, `#2dd4bf`, etc.) anywhere in the cockpit. `--gg-negative` only for negative deltas. Half-moon gauges finish in `--gg-positive`; target achievement is green, not gold.

**Half-moon gauge format:** numeric value only at the inside base of the arc; no descriptive or target text inside/beneath the gauge. Keep both endpoint scale labels black (`#111`) in every state. Goal ticks are unlabeled; nearby title/stat copy carries the context.

Agent rule: `[.cursor/rules/pav-law-kpi-charts.mdc](../../../../.cursor/rules/pav-law-kpi-charts.mdc)`

---



## 7. Value icon color map

**One map only.** Filter tiles and Project Outlines ICONS column share `.value-icon.icon-{id}` → `--vi-`* tokens in `index.html` `:root`.


| Icon id        | Label        | Badge bg / fg / border            |
| -------------- | ------------ | --------------------------------- |
| `foundation`   | Foundation   | `#d4ddd0` / `#3d3028` / `#5c4f45` (sage/brown) |
| `retainer`     | Retainer     | `#818cf8` / `#312e81` / `#4f46e5` |
| `leads`        | Leads        | `#fb923c` / `#7c2d12` / `#ea580c` |
| `crm`          | CRM          | `#a78bfa` / `#4c1d95` / `#7c3aed` |
| `hubspot`      | HubSpot      | `#ff7a59` bg · white sprocket (official company mark) · `#e85d3d` border |
| `seo`          | SEO          | `#60a5fa` / `#1e3a8a` / `#2563eb` (blue) |
| `referrals`    | Referrals    | `#f472b6` / `#831843` / `#db2777` |
| `efficiency`   | Analytics    | `#94a3b8` / `#1e293b` / `#64748b` (slate) |
| `finance`      | Finance      | `#6b9b76` / `#1e3a2f` / `#3d6b4f` (forest) |
| `intake`       | Intake       | `#c4b5fd` / `#2d1454` / `#4c1d95` (royal) |
| `creative`     | Creative     | `#e879f9` / `#701a75` / `#c026d3` |
| `general`      | Growth       | `#94a3b8` / `#0f172a` / `#64748b` |


Chip soft tints: `--vi-*-chip` / `--vi-*-chip-border` (do not replace badge fills).

Palette comment in `:root`: `value-icon-palette v=20260724-finance`.

**Forbidden:** filter-only purple overrides · duplicate hex under `.toc-value` · second palette in `app.js` / `projects-data.js` / markdown.

Agent rule: `[.cursor/rules/pav-law-value-icons.mdc](../../../../.cursor/rules/pav-law-value-icons.mdc)`

---



## 8. Do / don’t



### Do

- Edit `:root` tokens first; let components inherit.
- Keep cream + brown + **deep royal** as the light-UI voice; reserve gold for rare critical highlights.
- Keep Georgia body on the cockpit for memo/brief tone.
- Keep chart series distinguishable (royal / blue / burnt / rose / plum / slate).
- Shared box chrome: `--gg-box-border`, `--gg-box-shadow`, `--gg-head-accent` on section heads.
- Use red only for negatives and unverified **✕** badges. Verified tiles use a **green outline** (no star).
- One job per section; collapsible KPI topics stay focused.



### Don’t

- Generic AI look: purple-on-white marketing gradients, Inter/Roboto stacks as “brand,” glow blobs, pill spam, card walls with heavy shadows.
- Gradient text on `.cockpit-title`; use solid `--gg-royal-deep` with the standard burnt rule.
- Gold on ranks, scores, table chrome, ordinary badges, category series, target-hit gauges, or selected rows.
- Teal/cyan chart or UI accents (`#00d4c4`, `#2dd4bf`, peacock teal).
- Light-on-light or `--pav-text` on cream panels.
- Swap chart series to two near-identical purples.
- Recolor value icons on one surface only.
- Put branding hex in project markdown or `projects-data.js`.

Voice: practical law-firm cockpit for Andrew/team — polished, scannable, not startup-landing or dashboard-wallpaper.

---



## 9. Images & assets


| Asset                | Path                              | Referenced from        |
| -------------------- | --------------------------------- | ---------------------- |
| Gilbert / brand icon | `assets/gigi-seal.jpg`            | `content/settings.md`  |
| Gilbert thinking     | `assets/gilbert-thinking.png`     | Launcher / ask-Gilbert |
| Gilbert celebrating  | `assets/gilbert-celebrating.png`  | Thank-you              |
| Gilded Goose logo    | `assets/gigi-logo.jpg`            | Confirm header · Logo  |
| Gilded Goose account | `assets/gilded-goose-account.svg` | Badges                 |


Replace files or update paths in `content/settings.md`, then `npm run build` if settings affect generated output.

---



## 10. Scanability checklist

- [ ] Picker zones have `.picker-zone` + visible `.picker-zone-label`
- [ ] Sticky continue/submit bar readable on long lists
- [ ] Table zebra; selected row royal wash
- [ ] Cards spaced with `var(--space-lg)`
- [ ] Summary / value bullets: left royal border (`.card-tldr`)
- [ ] KPI sections collapsible — one topic per `<details>`
- [ ] No light-on-light on Priorities / plan / outlines tables
- [ ] Links underlined or clearly distinct
- [ ] Tab/button `:focus-visible` ring
- [ ] Red **✕** = unverified; green outline = export-backed (no ★)

---



## 11. Build, preview, deploy

```bash
cd gilded-goose/clients/pav-law/project-picker
python3 -m http.server 8765
# open http://localhost:8765/index.html
```

Hard-refresh after CSS edits. Bump `?v=` on scripts if cached.

1. Edit `index.html` and/or `kpi-report.js` / `metrics.css`
2. Preview locally
3. Push — [GITHUB-PUSH.md](GITHUB-PUSH.md)

No `npm run build` for pure CSS/HTML/JS layout. Run build only if `content/**/*.md` or settings changed.

---



## 12. Related rules & docs


| Doc / rule                                | Role                                   |
| ----------------------------------------- | -------------------------------------- |
| **This file**                             | Branding + formatting (single hub)     |
| [REPORTING-BRAND-GUIDE.md](REPORTING-BRAND-GUIDE.md) | Reporting color coding + shade ramp + table catalog |
| [CONTENT-INDEX.md](CONTENT-INDEX.md)      | Every string by page                   |
| [CONTENT-EDIT.md](CONTENT-EDIT.md)        | Project markdown workflow              |
| [content/INDEX.md](content/INDEX.md)      | Project list (Kate-owned)              |
| [README.md](README.md)                    | Entry + deploy pointers                |
| `.cursor/rules/pav-law-kpi-charts.mdc`    | Chart structure + locked series colors |
| `.cursor/rules/pav-law-value-icons.mdc`   | One value-icon palette                 |
| `.cursor/rules/gilbert-guide-content.mdc` | Don’t clobber `content/INDEX.md`       |


When palette or chart conventions change, update **this file** and the matching `.mdc` rule in the same PR.