# Trail Guide — design mockup framework

Working sandbox that mirrors the **live Trail Guide** layout for design editing feedback. Does not write to the live picker.

## Open

Open [`index.html`](index.html) in a browser (or via the local static server).

## What’s here

| File | Role |
|------|------|
| [`index.html`](index.html) | Clickable guide shell — survey, outlines, project cards, light/dark |
| [`cream-ship-preview.html`](cream-ship-preview.html) | Cream ship review — charts, icons, goose masthead |
| [`SHIP-CREAM.md`](SHIP-CREAM.md) | What can ship on cream vs hold |
| [`FEEDBACK.md`](FEEDBACK.md) | Lasting design notes (commit these) |
| This README | How to use the framework |

## Design dock (top bar)

- **Leaf icon** — show/hide masthead leaf
- **Feedback notes** — browser-local scratchpad
- Links to [`FEEDBACK.md`](FEEDBACK.md), [`../content/QUESTIONS.md`](../content/QUESTIONS.md), live [`../index.html`](../index.html)
- **Reset path** — restart the questionnaire

## How to give visual feedback

1. Click through the path questionnaire (tree mirrors [`../content/survey.md`](../content/survey.md)).
2. Toggle **Dark** / **Light** and leaf on/off.
3. Edit **CSS tokens** at the top of `index.html` (`:root` / `html[data-theme="dark"]`).
4. Capture notes in the dock or paste into [`FEEDBACK.md`](FEEDBACK.md).
5. When copy should go live: edit [`../content/QUESTIONS.md`](../content/QUESTIONS.md), then say **sync QUESTIONS → survey**.

## Not for production

This folder is a design template only. Live app stays in `../index.html` + `../app.js` + built `projects-data.js`.
