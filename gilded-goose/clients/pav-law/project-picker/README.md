# Gilbert Guide — project prioritizer

Guide character: **Lord Gilbert Granville** (Gilbert).

GitHub: [GildedGooseltd/PickyPavi](https://github.com/GildedGooseltd/PickyPavi) · Live: `https://gildedgooseltd.github.io/PickyPavi/`

Static project picker: choose-your-path survey → filters outlines, value filters, cards, notes, submit → Sheet + email.

## Edit content

**Style guide:** [STYLE-GUIDE.md](STYLE-GUIDE.md) · token/layout map: [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md)  
**Start here for projects:** [`content/INDEX.md`](content/INDEX.md) — links to every project file.

| File | Purpose |
|------|---------|
| `content/INDEX.md` | Master list by priority (+ link to guide Q&A) |
| `content/survey.md` | Guide questionnaire questions & answers (edit then build) |
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
