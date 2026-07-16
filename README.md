# Gilbert Guide — project prioritizer

Guide character: **Lord Gilbert Granville** (Gilbert).

GitHub: [GildedGooseltd/GilbertGuide](https://github.com/GildedGooseltd/GilbertGuide) · Live: `https://gildedgooseltd.github.io/GilbertGuide/`

Static project picker: budget filters, cards, notes, submit → Sheet + email.

## Edit content

**Branding & formatting (colors, type, layout — edit tokens here first):** [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md)  
**All text by page:** [CONTENT-INDEX.md](CONTENT-INDEX.md)  
**Project markdown:** [CONTENT-EDIT.md](CONTENT-EDIT.md) · start at [`content/INDEX.md`](content/INDEX.md)

```bash
cd gilded-goose/clients/pav-law/project-picker
npm run watch    # rebuild on save while editing
```

Do not edit `projects-data.js` — edit `content/**/*.md` only; build regenerates the JS from your markdown.

## Data pulls (local only)

**Data pulls:** [DATA-EXPORT-CLICKPATHS.md](DATA-EXPORT-CLICKPATHS.md) · [CLIENT-VALUE-BASELINE.md](CLIENT-VALUE-BASELINE.md) (#28 mean fee) · validate: `npm run validate-data` → [DATA-VALIDATION.md](DATA-VALIDATION.md)  
Raw CSVs stay in `Ad Reports/exports/` — gitignored; not deployed with Gilbert Guide.

## Deploy (Option 2 — monorepo)

**Mac → GitHub → live site:** [GITHUB-PUSH.md](GITHUB-PUSH.md)  
**Webhook + email + QuickBooks:** [BACKEND-SETUP.md](BACKEND-SETUP.md) · **Feedback gather (owner):** [owner-webhook-setup.html](owner-webhook-setup.html) · [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)

## Backend

**Setup (do this):** [BACKEND-SETUP.md](BACKEND-SETUP.md) — Parts A → B → C → D in order.

Do not edit `projects-data.js` — edit `content/**/*.md` only; build regenerates the JS from your markdown.
