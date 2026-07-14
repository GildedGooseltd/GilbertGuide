# Pav Law Cockpit — branding & layout

**Edit this file** when you want to change how the tool *looks* (colors, spacing, section breaks, fonts).  
**Edit text/copy** using [CONTENT-INDEX.md](CONTENT-INDEX.md) — full map of every string and where it lives.

---

## Quick start

| You want to change… | Edit this |
|---------------------|-----------|
| Colors, fonts, spacing, borders, card shape | `index.html` → `<style>` → `:root { … }` and class rules below |
| Page title in browser tab | `index.html` → `<title>` |
| Cockpit headline + subtitle | `index.html` → `.cockpit-header` |
| Tab names (KPIs, Project Guide, Dashboards, Impact) | `index.html` → `.cockpit-tabs .view-tab` buttons |
| Section labels in Project Picker (“Your selection”, …) | `index.html` → `.picker-zone-label` |
| Confirm / thank-you page chrome | `index.html` → `#confirm-page`, `#thank-you` |
| KPI & dashboard charts / metrics layout | `kpi-report.js` + KPI CSS block in `index.html` |
| Gilbert images only | `content/settings.md` → paths under `assets/` |
| Project card content (not layout) | `content/projects/*.md` — see [CONTENT-INDEX.md](CONTENT-INDEX.md) |

**Preview locally**

```bash
cd gilded-goose/clients/pav-law/project-picker
python3 -m http.server 8765
# open http://localhost:8765/index.html
```

Hard-refresh after edits (`Cmd+Shift+R`). Bump `?v=` on script tags in `index.html` if CSS/JS looks cached.

---

## Brand tokens (`index.html` `:root`)

These CSS variables drive almost everything. Change hex values here first — avoid scattering one-off colors in other files.

### Gilded Goose (cream / gold / brown / royal)

| Token | Default | Use |
|-------|---------|-----|
| `--gg-gold` | `#c9a86c` | Accents, borders |
| `--gg-gold-bright` | `#e3c58d` | Highlights |
| `--gg-gold-dark` | `#b8860b` | Rank numbers, chart accents |
| `--gg-cream` | `#f8f5ef` | Page background |
| `--gg-cream-panel` | `#f3ede4` | Nested panels |
| `--gg-paper` | `#fffcf7` | Cards, inputs |
| `--gg-brown` | `#3d3028` | Body text |
| `--gg-brown-muted` | `#5c4f45` | Secondary text |
| `--gg-royal-deep` | `#2d1454` | Section headers, active tabs, primary accents |
| `--gg-royal` | `#3a1a6e` | Headings, buttons, links |
| `--gg-royal-mid` | `#4c1d95` | Focus rings, active states |
| `--gg-royal-dim` | `rgba(45,20,84,0.12)` | Selected card wash |
| `--gg-royal-border` | `rgba(45,20,84,0.38)` | Borders |
| `--gg-negative` | `#cf2d56` | **Negative numbers only** — ↓ MoM, `−` deltas |
| `--gg-positive` | `#1f8a65` | Positive MoM, target hit |

### Contrast rule (ADA)

On cream/paper surfaces (`--bg`, `--gg-paper`, `--surface-plan`): use `--text`, `--gg-brown`, or `--gg-royal` only.

**Never** use `#f0f4fc`, `--pav-text`, or white rgba washes on light panels — they fail contrast.

Peacock ink + `--pav-text` are for **Gilbert chat** and **thank-you** dark panels only.

Links on light surfaces: `--gg-royal` + underline. Interactive elements: `:focus-visible` outline `2px solid var(--gg-royal-mid)`.

### Pav Law cockpit title

| Token | Default | Use |
|-------|---------|-----|
| Cockpit headline color | `#0d1b2a` | Solid navy on `.cockpit-title` — **no gradient** |
| `--pav-gradient-panel` | pink → navy radial | Priority panel background (if used) |
| `--pav-teal` | `#00d4c4` | Legacy chart accent |

### Layout scale

| Token | Default | Use |
|-------|---------|-----|
| `--radius` | `12px` | Cards, panels |
| `--space-sm` | `0.75rem` | Tight gaps |
| `--space-md` | `1.25rem` | Default section gap |
| `--space-lg` | `2rem` | Between major zones |
| `--space-xl` | `2.75rem` | Page bottom padding |
| `--font-min-rem` | `0.875rem` (14px) | Labels, table headers, hints — **floor for UI copy** |

### Semantic aliases (prefer editing tokens above)

- `--bg`, `--surface`, `--text`, `--secondary`, `--border` → map to GG tokens
- Do not edit `projects-data.js` for branding

---

## Layout map (what you see on screen)

```
┌─ cockpit-header ───────────── title + subtitle
├─ cockpit-tabs ─────────────── KPIs | Project Guide | Dashboards | Impact
│
├─ [KPIs tab] ───────────────── kpi-report.js → #kpi-report-kpis
├─ [Dashboards tab] ─────────── kpi-report.js → #kpi-report-dashboards
├─ [Impact tab] ─────────────── #completed-list + #revenue-calculator
│
└─ [Project Guide tab]
   ├─ zone: Your selection ───── do-next + Pav Priorities table
   ├─ zone: Browse & filter ─── filter icons + priority table
   └─ zone: Project details ── cards → **Review plan & submit**

Confirm overlay (after cart):
   ├─ Estimated results · Action items · Next steps
   └─ Confirm & submit (email + invoice schedule)

Overlays: Gilbert chat launcher · Confirm page · Thank-you page
```

### Scan-friendly zones (Project Picker)

Section labels use class `.picker-zone-label` — uppercase royal purple, full-width divider between zones. Adjust in `index.html` under `#cockpit-panel-picker`.

| Zone class | Label (editable) | Contents |
|------------|------------------|----------|
| `.picker-zone-priorities` | Your selection | Best to do next + Pav Priorities |
| `#action-items-panel` | *(removed from picker)* | Action items only on confirm page |
| Confirm: estimated results | `app.js` | `renderConfirmPlanReview()` → `#confirm-estimated-results` |
| Confirm: action items | `app.js` | `renderActionItemsPanel()` → `#confirm-action-items` |
| Confirm: next steps | `app.js` | `buildConfirmNextStepsHtml()` → `#confirm-next-steps` |
| `.picker-zone-outlines` | Browse & filter | Value icons + project table |
| `.picker-zone-cards` | Project details | Full project cards |

---

## Typography

| Element | Location | Current |
|---------|----------|---------|
| Body | `body` in `index.html` | Georgia, serif, `1.14rem`, line-height `1.65` |
| Cockpit title | `.cockpit-title` | `clamp(2.35rem, 6vw, 3.75rem)`, weight 800, navy `#0d1b2a` |
| Cockpit intro | `.cockpit-intro` | What it's for + tab-by-tab how-to |
| Section labels | `.picker-zone-label` | uppercase, `0.8125rem`, royal |
| Card title | `.card-title` | `1.22rem`, weight 800 |
| Table headers | `.toc-table thead` | uppercase, muted brown |
| KPI report title | `.kpi-report-title` in `index.html` | `1.35rem`, royal |

**Sans-serif UI:** Not used globally — intentional “brief / legal memo” feel. To switch body to system sans, change `body { font-family: … }` only; test card readability after.

---

## Components — where CSS lives

All in `index.html` `<style>` unless noted.

| Component | CSS classes | Notes |
|-----------|-------------|-------|
| Project cards | `.card`, `.card-title`, `.card-tldr`, `.card-summary` | Selected = `.card.selected` |
| Priority table | `.toc-table`, `.pav-priorities-table` | Zebra rows on outlines table |
| Value icon filters + table badges | `.value-icon.icon-{id}` | **One map only** — see [Value icon color map](#value-icon-color-map) |
| Gilbert chat | `.gilbert-chat-popup`, `.gilbert-chat-gilbert` | Fixed bottom-right |
| Confirm panel | `.confirm-page`, `.why-panel` | Full-screen overlay |
| Thank you | `.thank-you`, `.thank-you-affirm` | Post-submit |
| KPI sections | `.kpi-section`, `.kpi-stat-card` | Collapsible `<details>` |
| Unverified metric | `.kpi-unverified` | Red **✕** (not wired) |
| Action items | `.action-items-panel` | Confirm page + thank-you + email only |

**Charts:** SVG in `kpi-report.js`. Every chart card uses `chartBlock()` — plot + color legend + **detail table always visible below** (not behind “Show table”). Series colors must be uniquely distinguishable: royal `#3a1a6e` · teal `#00d4c4` · gold `#b8860b` (do not use two similar purples for adjacent series). Lead channels (#01): Search `#3a1a6e` · LSA `#00d4c4` · HubSpot `#b8860b`. Search campaigns (#08): Military `#3a1a6e` · Core DV `#00d4c4` · NTGUILT `#b8860b`. KPIs tab leads row: `.kpi-split-grid` / `.kpi-split-panel` — #01 channel + #08 campaign side-by-side (stack ≤900px). Cases MoM stack: Closed `#3a1a6e` · New `#00d4c4` · Red accounts `#4c1d95` (royal-mid — never alert red for this series fill). Never red/magenta for positive counts. Red (`--gg-negative`) is for negative deltas only. Half-moon gauges: progress red→green until target; gold fill at 100%+ (no egg). Gilbert launcher = thinking portrait (`assets/gilbert-thinking.png`).

---

## Value icon color map

**Rule:** Filter-by-value tiles and Project Outlines table ICONS column share one palette. Change colors only in `index.html` `:root` `--vi-*` tokens. Both surfaces use `.value-icon.icon-{id}` from `valueIconMarkup()` in `app.js`.

| Icon id | Label | Badge bg / fg / border | Filter chip (soft) |
|---------|-------|------------------------|--------------------|
| `foundation` | Foundation | `#f87171` / `#7f1d1d` / `#dc2626` | `--vi-foundation-chip` |
| `retainer` | Retainer | `#818cf8` / `#312e81` / `#4f46e5` | `--vi-retainer-chip` |
| `leads` | Leads | `#fb923c` / `#7c2d12` / `#ea580c` | `--vi-leads-chip` |
| `crm` | CRM | `#a78bfa` / `#4c1d95` / `#7c3aed` | `--vi-crm-chip` |
| `seo` | SEO | `#4ade80` / `#14532d` / `#16a34a` | `--vi-seo-chip` |
| `referrals` | Referrals | `#f472b6` / `#831843` / `#db2777` | `--vi-referrals-chip` |
| `efficiency` | Analytics | `#2dd4bf` / `#134e4a` / `#0d9488` | `--vi-efficiency-chip` |
| `intake` | Intake | `#60a5fa` / `#1e3a8a` / `#2563eb` | `--vi-intake-chip` |
| `creative` | Creative | `#e879f9` / `#701a75` / `#c026d3` | `--vi-creative-chip` |
| `general` | Growth | `#94a3b8` / `#0f172a` / `#64748b` | — |
| `account-data` | Account data | `#facc15` / `#713f12` / `#ca8a04` | `--vi-account-data-chip` |

**Forbidden:**
- Overriding filter badge colors with a shared purple (`rgba(45,20,84,…)` or `!important`) while table keeps `.icon-*` colors
- Duplicating hex values under `.toc-value .value-icon.icon-*` (size/layout only there)
- A second palette in `app.js`, `projects-data.js`, or content markdown

Palette version comment in `:root`: `value-icon-palette v=20260714`. Hard-refresh after token edits.

---

## Images & assets

| Asset | Path | Referenced from |
|-------|------|----------------|
| Gilbert guide icon | `assets/gigi-goose-guide.svg` | `content/settings.md` |
| Gilbert portrait (thinking) | `assets/gilbert-thinking.png` | Launcher, ask-Gilbert popup |
| Gilbert celebrating | `assets/gilbert-celebrating.png` | Thank-you |
| Pav Law shield | `assets/pav-law-shield.svg` | Account-data badge |
| Gilded Goose account | `assets/gilded-goose-account.svg` | Badges |

Replace files in `assets/` or update paths in `content/settings.md`, then `npm run build`.

---

## Build & deploy (layout changes only)

1. Edit `index.html` and/or `kpi-report.js`
2. Preview with local server
3. Push to GitHub — [GITHUB-PUSH.md](GITHUB-PUSH.md)

No `npm run build` needed for pure CSS/HTML/JS layout edits.  
Run `npm run build` only if you also changed `content/**/*.md` or impact scripts.

---

## Scanability checklist (maintain when editing)

- [ ] Major picker areas have `.picker-zone` + visible label
- [ ] Sticky **Continue to submit** bar stays readable on long card lists
- [ ] Table rows zebra-striped; selected row uses gold wash
- [ ] Cards separated by `var(--space-lg)` — not a solid wall of text
- [ ] TLDR / value bullets use left royal border (`.card-tldr`)
- [ ] KPI sections stay collapsible — one topic per `<details>`
- [ ] **No light-on-light text** on Pav Priorities table, plan summary, or outlines table
- [ ] Links underlined or clearly distinct from body text
- [ ] Tab / button focus ring visible on keyboard navigation
- [ ] Red **✕** only on unverified / not-wired metrics; **★** on export-backed numbers (corner badges on tiles)

---

## Related docs

- [CONTENT-INDEX.md](CONTENT-INDEX.md) — every text string by page
- [CONTENT-EDIT.md](CONTENT-EDIT.md) — project markdown workflow
- [content/INDEX.md](content/INDEX.md) — project list you maintain by hand
