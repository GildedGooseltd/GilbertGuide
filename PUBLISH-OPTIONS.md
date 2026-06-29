# Publish & billing — option comparison

## Hosting

| | **Option 1 — Dedicated repo** | **Option 2 — Monorepo + Action** |
|---|---|---|
| **Code location** | Repo contains only `project-picker/` files | Picker inside `1 Cursor Helper` |
| **Deploy trigger** | `git push` to `main` → GitHub Pages | `git push` → Action → `gh-pages` branch |
| **Public URL** | `you.github.io/pav-law-project-picker/` | `you.github.io/REPO-NAME/` |
| **Custom domain** | CNAME supported | Same |
| **Config injection** | Edit `config.js`, commit, push | Secrets → Action writes `config.js` |
| **Best for** | Isolated client deploy | **Default** — edit `content/*.md` |

Same runtime: static HTML/JS, ~1 min rebuild after push.

---

## On submit

| Step | Action |
|------|--------|
| 1 | Row appended to Google Sheet (projects + notes for full invoice) |
| 2 | Email → `support@gildedgooselimited.com` (internal — invoice from this) |
| 3 | Email → submitter address (confirmation + deposit link) |
| 4 | Thank-you UI → **Pay deposit** button; optional auto-open QuickBooks URL |
| 5 | Manual full invoice in QuickBooks from Sheet row |

---

## Billing model

| | **Deposit (redirect)** | **Full invoice (manual)** |
|---|---|---|
| **Amount** | Fixed in `config.js` — e.g. `$2,500` | Sum of selected projects + retainer terms |
| **When** | Immediately after submit | After Sheet/email review |
| **Purpose** | Standard kickoff deposit | Project fees per picker selections |
| **QuickBooks** | Reusable **payment link** | New invoice from Sheet data |

---

## Config keys (`config.js`)

```javascript
window.PAV_PICKER_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/XXXX/exec",
  depositAmount: 2500,
  quickbooksDepositUrl: "https://pay.intuit.com/..."
};
```

Monorepo secrets: `PAV_PICKER_WEBHOOK_URL`, `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`, `PAV_PICKER_DEPOSIT_AMOUNT`

Content editing: [CONTENT-EDIT.md](CONTENT-EDIT.md) · Setup: [BACKEND-SETUP.md](BACKEND-SETUP.md) · Pages: [GITHUB-PAGES-SETUP.md](GITHUB-PAGES-SETUP.md)
