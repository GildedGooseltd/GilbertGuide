# Gilbert Guide — style guide

Canonical visual system for **Gilbert Guide / Trail Guide** (Pav Law project picker).  
Implement tokens in [`index.html`](index.html). Layout notes: [`BRANDING-LAYOUT.md`](BRANDING-LAYOUT.md). Design sandbox: [`mockup/index.html`](mockup/index.html).

---

## 1. Brand personality

- Trail guide / paper journal — calm, clear, premium
- Cream paper + deep purple + antique gold
- Quiet UI: one paper card for the path, numbered rows, no character portrait in the survey
- Business-level questions (priority → audience → horizon), not tactical jargon in the first path

**Product names**

| Context | Name |
|---------|------|
| Visible UI title | **Trail Guide** |
| Repo / docs / brand house | **Gilbert Guide** |
| Theme storage key | `gilbert-guide-theme` |

---

## 2. Color system

### 2.1 Light (default)

| Role | Hex | Token | Use |
|------|-----|-------|-----|
| Page cream | `#f8f5ef` | `--gg-cream` / `--bg` | Page background |
| Paper | `#fffcf7` | `--gg-paper` / `--surface` | Cards, survey |
| Panel | `#f3ede4` | `--gg-cream-panel` | Nested panels |
| Body ink | `#3d3028` | `--gg-brown` / `--text` | Body copy |
| Secondary ink | `#5c4f45` | `--gg-brown-muted` / `--secondary` | Hints, leads |
| Title purple | `#3b1769` | `--gg-royal-deep` | Headings, app title |
| Action purple | `#4e2a84` | `--gg-royal` | Links, primary actions |
| Mid purple | `#6d28a8` | `--gg-royal-mid` | Rails, focus, selected |
| Soft purple | `#8b5cf6` | `--gg-royal-light` | Rare soft accent only |
| Antique gold | `#c9a86c` | `--gg-gold` | Important highlights |
| Gold bright | `#e3c58d` | `--gg-gold-bright` | Metallic edges (light) |
| Gold dark | `#b8860b` | `--gg-gold-dark` | Zone labels |
| Burnt | `#c2410c` | `--gg-burnt` | Warm accent (not text default) |
| Forest | `#166534` | `--gg-forest` | Positive / SEO |

### 2.2 Dark

Surfaces stay **black → deep plum**. Text stays **neutral / warm off-white** — not lavender.

| Role | Hex | Token | Use |
|------|-----|-------|-----|
| Page | `#050308` | `--bg` | Near-black |
| Surface | `#14101c` | `--surface` | Cards |
| Paper | `#161022` | `--gg-paper` | Survey card |
| Panel | `#1c1528` | `--surface-panel` | Nested |
| Body ink | `#f4f1ea` | `--text` / `--gg-brown` | Primary reading text |
| Secondary ink | `#b8b2a8` | `--secondary` / `--gg-brown-muted` | Hints (warm gray) |
| Titles | `#f4f1ea` | `--gg-royal-deep` | Same as body ink in dark — **not** light purple |
| Links / accents | `#a78bfa` | `--gg-royal` | Links, interactive accents only |
| Mid accent | `#8b5cf6` | `--gg-royal-mid` | Borders, rails |
| Gold | `#c9a86c` | `--gg-gold` | Important highlights only |

### 2.3 Hard rules

1. **Do not use light purple / lilac as text** (`#cfc2ea`, `#ebe6f4`, `#d8b4fe`, `#9b90b0`, washed lavender). Hard to read on dark and cream.
2. **Purple is for accents** — titles (light theme), links, borders, selected washes — not body paragraphs in dark mode.
3. **No fuchsia / hot pink** (`#e879f9`, `#d946ef`, `#ff2d95`, `#f472b6` as brand chrome).
4. **No navy** as brand surface (`#0f172a`, `#1e3a5f`, etc.).
5. **Gold / yellow only for important highlights** — app title underline, zone labels, primary CTAs (light). Not every number, chevron, or kicker in dark.
6. Value-icon colors may stay categorical in **light**; in **dark**, shift pink/fuchsia icons into the purple family (see `index.html` dark overrides).

---

## 3. Typography

| Role | Spec |
|------|------|
| Family | `Georgia, "Times New Roman", serif` |
| Body size | ~`1.14rem`, line-height ~`1.8` |
| App title | `.gg-app-title` — ~`1.75rem`, weight 800, gold underline (`3px solid --gg-gold`) |
| Survey title | `.survey-title` — clamp ~`1.55–1.85rem`, `--gg-royal-deep` (light) / off-white (dark) |
| Survey prompt | ~`1.02rem`, bold |
| Kicker | Caps, tracked (`0.26em`), small — gold (light) / warm gray (dark) |
| Zone label | Caps, gold dark + left gold bar |

**Avoid:** Inter / Roboto / Arial / system-ui as the primary brand voice (dock/chrome in the mockup may use sans for controls only).

---

## 4. Components

### Header
- Brand name hero-level: **Trail Guide**
- One short subtitle
- Theme toggle: Light ↔ Dark only

### Path survey (paper card)
- Centered masthead: optional leaf · `TRAIL GUIDE` kicker · **Choose your path** · one lead line
- Numbered choice rows (`01`…) + hint + chevron
- Crumbs: `Path so far: …`
- Actions: Back / Start over
- No character portrait; no Trailhead / Waypoint chrome

### Zones
- Gold left bar + uppercase label (`Project outlines`, `Project details`)
- Purple zone titles

### Project cards
- Paper surface, strong border
- Selected: purple wash + border (not gold flood)
- Value TLDR: left purple rail

### Buttons
- **Primary (light):** gold metal gradient, dark brown text  
- **Primary (dark):** solid purple, near-black or white text as needed for contrast  
- **Secondary:** paper/surface + strong border  

---

## 5. Themes

| Theme | `data-theme` | Notes |
|-------|--------------|-------|
| Light | `light` | Default |
| Dark | `dark` | Black/purple surfaces, neutral text |
| Legacy `unicorn` | maps → `light` | Removed as a mode |

Storage: `localStorage['gilbert-guide-theme']`  
URL: `?theme=light` / `?theme=dark`

---

## 6. Motion

Keep motion quiet: short hover shifts on rows, focus rings, theme paint. No glitter / unicorn overlays.

---

## 7. Content voice (path questions)

See [`content/QUESTIONS.md`](content/QUESTIONS.md).

- Layer 1 — business priority  
- Layer 2 — audience  
- Layer 3 — timeline / reactivity  
- Stay strategic; tactics live in project cards, not the first path  

---

## 8. Where to edit

| Change | File |
|--------|------|
| Colors, type, survey layout | [`index.html`](index.html) `:root` + dark block |
| Behavior / survey render | [`app.js`](app.js) |
| Path copy | [`content/QUESTIONS.md`](content/QUESTIONS.md) → sync [`content/survey.md`](content/survey.md) → `npm run build` |
| Design experiments | [`mockup/index.html`](mockup/index.html) + [`mockup/FEEDBACK.md`](mockup/FEEDBACK.md) |
| This guide | [`STYLE-GUIDE.md`](STYLE-GUIDE.md) |

After token or JS changes, bump `?v=` on script tags in `index.html`.

---

## 9. Quick checklist

- [ ] Body text is brown (light) or warm off-white (dark) — never light purple  
- [ ] Secondary text is warm gray — never lilac  
- [ ] Purple used for titles (light), links, borders, washes  
- [ ] Gold reserved for important highlights  
- [ ] No fuchsia, hot pink, or navy brand surfaces  
- [ ] Survey reads as one quiet paper card  
- [ ] Trail Guide name is visible in the first viewport  
