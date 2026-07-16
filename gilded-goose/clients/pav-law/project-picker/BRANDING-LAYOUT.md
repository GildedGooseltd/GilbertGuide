# Gilbert Guide — branding & formatting

**Canonical hub** for how the picker *looks*. Change colors, type, and layout tokens here first — then edit the files this doc points to.

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

### Themes — Dark ↔ Unicorn

Header toggle switches **`dark`** and **`unicorn`** only (legacy `light` maps to `unicorn`). Preference key `gilbert-guide-theme` in `localStorage`. First visit follows `prefers-color-scheme` (dark → dark, else unicorn). Early head script sets `data-theme` before paint. URL override: `?theme=dark` or `?theme=unicorn`.

#### Dark (`html[data-theme="dark"]`)

Deep **purple** night — plum / eggplant surfaces (not brown charcoal), lavender ink, fuchsia accents. No navy.

| Token family | Dark intent |
|--------------|-------------|
| Surfaces | Purple (`#12061f` → `#2d1654`) |
| Text | Lavender (`#f3e8ff` / `#d8b4fe`) |
| Accents | Fuchsia / violet / gold (`#e879f9`, `#d946ef`, `#f0c84a`) |
| Sticky / TOC | Purple panel tokens |
| Buttons on accents | `--btn-on-accent` → deep purple ink |

#### Unicorn (`html[data-theme="unicorn"]`)

**Lisa Frank** energy: neon sticker pink / purple / sunshine yellow / lime / tangerine rainbow (`--lisa-rainbow`), dense glitter stars, rainbow borders on survey/cards/sticky bar. Header **logo title formatting stays default** (`.gg-app-title` color + gold underline only — no holo clip). Still no navy.

**Activation burst:** Switching Dark → Unicorn plays `#unicorn-fart-cloud` — pink/fuchsia sparkle fart cloud, line “good morning sparkle farts!”, and dancing Gilbert GIF (`assets/gilbert-unicorn-dance.gif`) in a fake unicorn headband. Click anywhere or wait ~3s to dismiss. Honors `prefers-reduced-motion`.

---

## 4. Typography

Body: Georgia / Times New Roman (serif cockpit). Titles use `--gg-royal-deep` + gold underline on `.gg-app-title`.

---

## 5. Layout patterns

```
┌─ gg-header ────────────────── Gilbert Guide title + theme toggle (no logo wordmark)
├─ picker-zone-ask ──────────── Choose-your-path survey (2 steps) → filters outlines
├─ picker-zone-outlines ─────── TOC table (filtered) + Filter by value
└─ picker-zone-cards ────────── sticky Continue bar + project cards
Overlays: confirm · thank-you
```

**Survey (subtle trail guide — keep this UX):** `GILBERT_SURVEY` in `app.js` — branching waypoints map to `--vi-*` via `iconFilters`. One quiet `.gilbert-survey` **paper** box (soft forest accent on the zone label only — no topo / blazes, no unicorn glitter chrome on the survey itself). List-row choices. Trailhead / waypoint labels stay. Gilbert portrait (`gilbert-guide-subtle-hat.png`, funny trail hat) on the **right** at **3.5rem** (3rem small screens), facing the questions. “Back to trailhead” resets.

**Character facing rule:** Portraits and mascots always face toward the middle of the composition / adjacent content — never away off the edge of the screen. Prefer placing the figure on the side that lets the native pose look inward; mirror only when needed.

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
- [x] Dark ↔ Unicorn themes via `data-theme` + header toggle

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
