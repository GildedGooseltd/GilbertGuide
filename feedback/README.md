# Metrics feedback — where data lives

## Primary (shared reviewers)

| | |
|---|---|
| **Sheet** | Same as Part A in `BACKEND-SETUP.md` — usually titled `Pav Law Project Picker Submissions` |
| **Tab** | **`MetricsFeedback`** |
| **How it gets there** | Live site POSTs via Apps Script webhook (`PAV_PICKER_WEBHOOK_URL` / Secret 1) on each **Save** and on **Save all to sheet** |

Email is **not** required. Mailto is **not** the success path.

## Not readable from Cursor

Ratings stored only in a reviewer’s browser (`localStorage`) **cannot** be pulled into Cursor or this folder. There is no agent path to other people’s local cache.

To get feedback into Cursor after reviewers finish:

1. Open the Google Sheet → tab **MetricsFeedback**
2. Copy or File → Download → CSV/JSON as needed
3. Optionally paste/export into this `feedback/` folder if you want a dated snapshot in the repo

## Before sharing the live URL

See **BACKEND-SETUP.md → Metrics feedback** — confirm [live config.js](https://gildedgooseltd.github.io/GilbertGuide/config.js) has a non-empty `webhookUrl`.
