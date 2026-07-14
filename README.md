# Gilbert Guide — project prioritizer

Guide character: **Lord Gilbert Granville** (Gilbert).

GitHub: [GildedGooseltd/GilbertGuide](https://github.com/GildedGooseltd/GilbertGuide) · Live: `https://gildedgooseltd.github.io/GilbertGuide/`

Static project picker: budget filters, cards, notes, submit → Sheet + email.

## Edit content

**Start here:** [`content/INDEX.md`](content/INDEX.md) — links to every project file.

| File | Purpose |
|------|---------|
| `content/INDEX.md` | Master list by priority |
| `content/_TEMPLATE.md` | Standard layout for new projects |
| `content/settings.md` | Default package |
| `content/retainer.md` | Retainer card |
| `content/projects/{ID}.md` | One readable markdown file per project |

Guide: **[CONTENT-EDIT.md](CONTENT-EDIT.md)**

```bash
cd gilded-goose/clients/pav-law/project-picker
npm run watch    # rebuild on save while editing
```

Do not edit `projects-data.js` — edit `content/**/*.md` only; build regenerates the JS from your markdown.

## Deploy (Option 2 — monorepo)

**Mac → GitHub → live site:** [GITHUB-PUSH.md](GITHUB-PUSH.md)  
**Webhook + email + QuickBooks:** [BACKEND-SETUP.md](BACKEND-SETUP.md)

## Backend

**Setup (do this):** [BACKEND-SETUP.md](BACKEND-SETUP.md) — Parts A → B → C → D in order.

Do not edit `projects-data.js` — edit `content/**/*.md` only; build regenerates the JS from your markdown.
