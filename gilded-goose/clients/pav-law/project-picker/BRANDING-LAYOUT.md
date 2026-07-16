# Gilbert Guide — branding & formatting

**Canonical hub** for how the picker *looks*. Change colors, type, and layout tokens here first — then edit the files this doc points to.

**Project copy** lives elsewhere: [CONTENT-EDIT.md](CONTENT-EDIT.md) · [`content/INDEX.md`](content/INDEX.md)

---

## 1. Change formatting all at once

Edit `:root` in [`index.html`](index.html). Rebuild is not required for CSS — hard-refresh the browser (`?v=` cache busters on scripts are bumped when JS changes).

---

## 2. File map

| Concern | File |
|---------|------|
| Tokens, zones, sticky bar, TOC, cards, confirm | `index.html` `<style>` + markup |
| Value icon classes / filter / TOC / confirm summary | `app.js` (classes only — no badge hex) |
| Generated project data | `projects-data.js` (from markdown build) |

Do **not** put branding hex in project markdown or `projects-data.js`.

---

## 3. Brand tokens (`index.html` `:root`)

| Token | Default | Use |
|-------|---------|-----|
| `--gg-gold` | `#c9a86c` | Accents, zone gold bar |
| `--gg-gold-bright` | `#e3c58d` | Highlights, focus ring |
| `--gg-gold-dark` | `#b8860b` | Zone labels, rank accents |
| `--gg-cream` | `#f8f5ef` | Page background (`--bg`) |
| `--gg-cream-panel` | `#f3ede4` | Nested panels, TOC zebra |
| `--gg-paper` | `#fffcf7` | Cards, inputs (`--surface`) |
| `--gg-brown` / `--gg-brown-muted` | `#3d3028` / `#5c4f45` | Body / secondary text |
| `--gg-royal-deep` | `#3d3028` | Titles (alias of brown — **no navy**) |
| `--gg-royal` | `#5c4010` | Dark gold-brown accents |
| `--gg-royal-mid` | `#b8860b` | Gold mid accents / rails |
| `--gg-royal-light` | `#c9a86c` | Soft gold |
| `--gg-royal-dim` / `--gg-royal-border` | gold wash / border | Selected wash / borders |

**Forbidden accents:** navy, blue-purple (`#2d1454`, `#3a1a6e`, `#4c1d95`, neon purple). Brand spine is cream / gold / brown only.
| `--gg-gold-dim` | gold wash | Selected TOC rows |
| `--focus-ring` | gold glow | `:focus-visible` on controls |
| `--space-sm/md/lg/xl` | 0.75 / 1.25 / 2 / 2.75 rem | Spacing scale |

**`--gradient-brand`:** deep royal → royal → gold-dark (no `#6d28d9` / neon purple stops).

**Forbidden:** teal/cyan accents · light-on-light plan panels · neon purple (`#7c5cff`) as brand light.

---

## 4. Typography

Body: Georgia / Times New Roman (serif cockpit). Hierarchy via weight and size; titles use `--gg-royal-deep` + gold underline on `.gg-app-title`.

---

## 5. Layout patterns

```
┌─ gg-header ────────────────── Gilbert Guide title (no logo / no goose)
├─ picker-zone-ask ──────────── Choose-your-path survey (2 steps) → filters outlines
├─ picker-zone-outlines ─────── TOC table (filtered) + Filter by value
└─ picker-zone-cards ────────── sticky Continue bar + project cards
Overlays: confirm · thank-you (text only — no logo / goose images)
```

**Survey:** `GILBERT_SURVEY` in `app.js` — branching questions map to `--vi-*` icon ids via `iconFilters`. Completing a path opens the TOC and shows matching projects only. “Start over” / Clear filters resets the path.

| Pattern | Classes | Behavior |
|---------|---------|----------|
| Zones | `.picker-zone` + `.picker-zone-label` | Gold accent label; one purpose per zone |
| Zone title | `.picker-zone-title` | Short royal-deep headline |
| Sticky submit | `.project-list-controls.sticky-submit-bar` | Sticky bottom; paper + royal border |
| TOC | `.toc-table` | Zebra even rows; `.row-selected` gold wash wins |
| Cards | `.card` | `--space-lg` between cards; selected = royal wash |
| Value TLDR | `.card-tldr` | Left royal rail around value bullets |
| Confirm picks | `#confirm-selection-summary` | List before email / invoice fields |

---

## 6. Value icon color map

**One map only.** Filter tiles and TOC ICONS column share `.value-icon.icon-{id}` → `--vi-*` tokens in `index.html` `:root`.

| Icon id | Label | Badge bg / fg / border |
|---------|-------|------------------------|
| `foundation` | Foundation | `--vi-foundation-*` |
| `retainer` | Retainer | `--vi-retainer-*` |
| `leads` | Leads | `--vi-leads-*` |
| `crm` | CRM | `--vi-crm-*` |
| `seo` | SEO | `--vi-seo-*` |
| `referrals` | Referrals | `--vi-referrals-*` |
| `efficiency` | Analytics | `--vi-efficiency-*` (gold) |
| `intake` | Intake | `--vi-intake-*` (royal) |
| `creative` | Creative | `--vi-creative-*` |
| `general` | Growth | `--vi-general-*` |
| `account-data` | Account data | `--vi-account-data-*` |

Chip soft tints: `--vi-*-chip` on `.key-filter-btn[data-icon-filter].filter-active` only — do not replace badge fills.

Palette comment in `:root`: `value-icon-palette v=20260716-ggl`.

**Never:** hardcode badge colors in `app.js` · filter-only purple overrides · second palette under `.toc-value`.

---

## 7. Do / don’t

- Do keep cream / gold / brown / deep royal as the brand spine.
- Do underline links (TOC, condensed picks, refs) without relying on hover alone.
- Do keep `:focus-visible` rings on buttons, filters, inputs.
- Don’t revive light-on-light `.plan-summary` text (`#f0f4fc` on pale panels).
- Don’t put neon purple in `--gradient-brand` or `--gg-royal-light`.

Voice: practical law-firm cockpit for Andrew/team — scannable, not startup-landing wallpaper.

---

## 8. Scanability checklist

- [x] Picker zones have `.picker-zone` + visible `.picker-zone-label`
- [x] Sticky continue/submit bar readable on long lists
- [x] Table zebra; selected row gold wash
- [x] Cards spaced with `var(--space-lg)`
- [x] Summary / value bullets: left royal border (`.card-tldr`)
- [x] No light-on-light on plan / outlines tables
- [x] Links underlined or clearly distinct
- [x] Tab/button `:focus-visible` ring
- [x] Value icons share one `--vi-*` map (filter + TOC)

---

## 9. Build, preview, deploy

```bash
cd gilded-goose/clients/pav-law/project-picker
python3 -m http.server 8777 --bind 127.0.0.1
# open http://127.0.0.1:8777/index.html
```

Markdown content changes: `npm run build` (or `npm run watch`). CSS/JS in `index.html` / `app.js` — hard-refresh.

Deploy: [GITHUB-PUSH.md](GITHUB-PUSH.md)

---

## 10. Related

- Chart / KPI pages (when present): leave `kpi-report.js` to the charts owner; shared tokens stay in this `:root`.
- Backend / webhook: [BACKEND-SETUP.md](BACKEND-SETUP.md) · [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)
