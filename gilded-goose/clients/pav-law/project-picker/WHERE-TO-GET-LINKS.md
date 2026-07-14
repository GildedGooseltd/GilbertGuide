# GitHub secrets — where links come from & where they are saved

**Both secrets are saved in GitHub only.** There is no “save Secret 2 in Google” step.

Add each at [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new) — **one secret per save**.

---

## Cheat sheet (read this first)

| | Secret 1 | Secret 2 |
|---|----------|----------|
| **GitHub Name** | `PAV_PICKER_WEBHOOK_URL` | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |
| **Tool** | Google Apps Script | **QuickBooks Online** |
| **Copy link from** | Apps Script **Deploy** dialog | QBO **Payment links** |
| **Link looks like** | `https://script.google.com/macros/s/…/exec` | `https://connect.intuit.com/pay/…` |
| **Save link in** | **GitHub only** | **GitHub only** |
| **Never paste in** | QuickBooks · GitHub Secret 2 | Apps Script · Google Sheet · Secret 1 |

**When:** Part A (Google) → Part B (QuickBooks) → Part C (paste both URLs into GitHub) → run Deploy workflow.

**GitHub cannot edit a secret** — wrong value? [Secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions) → **Remove** → add again at [New secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new).

**Apps Script URL cannot be edited** — update code → **Deploy → Manage deployments → Edit (pencil) → New version → Deploy** (URL usually stays the same).

---

## Secret 1 — webhook (Google → GitHub)

**What it does:** Picker POSTs JSON → Google Sheet row + emails. Same URL also receives **metrics feedback** (Save on each KPI) → Sheet tab **`MetricsFeedback`**.

### If you are on Apps Script “New deployment” (Web app)

You are setting up **Secret 1 only**. Secret 2 is not on this screen.

| On screen | Set to |
|-----------|--------|
| **Execute as** | Me |
| **Who has access** | **Anyone** |
| Then | **Deploy** → authorize if asked → copy **Web app URL** |

**Already deployed?** Cancel → **Deploy → Manage deployments → Edit → New version → Deploy** (keeps same URL; avoids a second webhook).

**Copy URL** → GitHub [New secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new):

- **Name:** `PAV_PICKER_WEBHOOK_URL`
- **Secret:** full `/exec` URL only — not the secret name, not QuickBooks

**Test:** `YOUR_URL?ping=1` → `{"ok":true,"service":"gilbert-guide"}`

**Remove extra webhook:** **Deploy → Manage deployments → Archive** on duplicate deployments you don’t use.

Full Google setup: [BACKEND-SETUP.md](BACKEND-SETUP.md) Part A.

---

## Secret 2 — deposit link (QuickBooks → GitHub)

**What it does:** “Pay deposit” button opens QuickBooks checkout. **Not a webhook.** **Not Apps Script.**

### Step 1 — Copy from QuickBooks (do not save here for the picker)

| Step | Where | Do this |
|------|--------|---------|
| 1 | [QuickBooks Online](https://qbo.intuit.com) | Log in |
| 2 | **Sales & get paid → Payment links** | Or search “Payment links” |
| 3 | Your $2,500 multi-use link | **Copy link** (or create: **New → Multi-use → 2500**) |

Link shape: `https://connect.intuit.com/pay/GildedGooseLimited/scs-v1-…`  
Also valid: `https://pay.intuit.com/…`

**Not this:** Apps Script `/exec` URL · HTML “Buy Now” button · pasting into Apps Script or the Sheet

### Step 2 — Save in GitHub (only place)

Open: [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)

| Field | Value |
|--------|--------|
| **Name** | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |
| **Secret** | QuickBooks URL from Step 1 — plain `https://…` only |

**Verify:** [Secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions) shows both names:

- `PAV_PICKER_WEBHOOK_URL`
- `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`

GitHub never shows secret values again — only names.

---

## Optional — `PAV_PICKER_DEPOSIT_AMOUNT`

- **Name:** `PAV_PICKER_DEPOSIT_AMOUNT`
- **Secret:** `2500` (skip if using default)

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Pasted Apps Script URL into Secret 2 | Remove Secret 2 → re-add with QuickBooks `connect.intuit.com` link |
| Pasted secret **name** into Secret field | Secret field = URL only; name goes in **Name** |
| Looking for “save deposit link” in Google | Secret 2 never goes in Google — GitHub only |
| Two Apps Script `/exec` URLs | Keep one (ping works) → Archive the other deployment |
| “Script function not found: doGet” | Paste full `apps-script-webhook.gs` → redeploy **New version** |
| Need to change a GitHub secret | Remove secret → add again (no edit button) |

---

## After both secrets → deploy

1. [Run Deploy Gilbert Guide](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml)
2. [config.js on live site](https://gildedgooseltd.github.io/GilbertGuide/config.js) — real webhook + QuickBooks URLs (not placeholders)
