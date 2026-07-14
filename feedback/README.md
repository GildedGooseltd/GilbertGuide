# Metrics feedback — where data lives

## Primary (shared reviewers)

| | |
|---|---|
| **Sheet (open this)** | [Pav Law feedback spreadsheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit?gid=0#gid=0) |
| **Spreadsheet ID** | `1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM` (wired in `apps-script-webhook.gs` as `SPREADSHEET_ID`) |
| **Tab** | **`MetricsFeedback`** |
| **How it gets there** | Live site POSTs via Apps Script webhook (`PAV_PICKER_WEBHOOK_URL` / Secret 1) on each **Save**, on **Save all to sheet**, and when **Feedback mode** toggles **OFF** (flush all rated items) |

Email is **not** required. Mailto is **not** the success path.

### Secret 1 is the webhook — not this Sheet URL

| | |
|---|---|
| **GitHub Secret 1** `PAV_PICKER_WEBHOOK_URL` | Apps Script **Web app** URL ending in `/exec` |
| **Never paste into Secret 1** | This Google Sheet link / spreadsheet ID |

After you edit Apps Script to use this Sheet ID: **Deploy → Manage deployments → Edit → New version → Deploy**. Secret 1 stays the same `/exec` URL unless you created a brand-new deployment.

## Not readable from Cursor

Ratings stored only in a reviewer’s browser (`localStorage`) **cannot** be pulled into Cursor or this folder. There is no agent path to other people’s local cache.

To get feedback into Cursor after reviewers finish:

1. Open [the Sheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit?gid=0#gid=0) → tab **MetricsFeedback**
2. Copy or File → Download → CSV/JSON as needed
3. Optionally paste/export into this `feedback/` folder if you want a dated snapshot in the repo

## Before sharing the live URL

See **BACKEND-SETUP.md → Metrics feedback** — confirm [live config.js](https://gildedgooseltd.github.io/PickyPavi/config.js) has a non-empty `webhookUrl`.
