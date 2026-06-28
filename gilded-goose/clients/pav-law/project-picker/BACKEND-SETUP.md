# Pav Law Project Picker — backend setup

**Outcome when done:** Live URL → submit → Google Sheet row + email to `support@gildedgooselimited.com` + submitter email + QuickBooks deposit tab.

**Deploy:** Option 2 — monorepo `1 Cursor Helper` → GitHub Actions → branch `gh-pages`.

Complete **Part A → B → C → D** in order. Each paste step lists **Copy from** and **Paste into**.

---

## Part A — Google Sheet + Apps Script webhook

### A1–A2 — Create the spreadsheet

| Step | Where | Do this |
|------|--------|---------|
| **A1** | Browser → [sheets.google.com](https://sheets.google.com) | Click **Blank spreadsheet** |
| **A2** | Top-left title of the new sheet | Click title → type `Pav Law Project Picker Submissions` → Enter |

### A3–A7 — Paste webhook code into Apps Script

| Step | Copy from | Paste into | Do this |
|------|-----------|------------|---------|
| **A3** | The spreadsheet tab from A1–A2 | — | Menu bar **Extensions** → **Apps Script** → a **new browser tab** opens (`script.google.com`) |
| **A4** | — | **Apps Script tab** → left file **Code.gs** → large code panel on the right | Click inside the code panel → **Cmd+A** → **Delete** (panel must be empty) |
| **A5** | **Mac — Cursor** → open file:<br>`/Users/gildedgoose/Documents/1 Cursor Helper/gilded-goose/clients/pav-law/project-picker/apps-script-webhook.gs` | — | **Cmd+A** → **Cmd+C** (entire file copied to clipboard) |
| **A6** | **Clipboard** (from A5) | **Apps Script tab** → **Code.gs** empty panel | Click in panel → **Cmd+V** |
| **A7** | — | **Apps Script tab** → top-left project name ("Untitled project") | Click name → type `Pav Law Picker Webhook` → Enter → click **Save** (disk icon) |

You should see ~210 lines in Code.gs starting with `const NOTIFY_EMAIL = "support@gildedgooselimited.com";`

### A8–A10 — Create Submissions sheet tab

| Step | Where | Do this |
|------|--------|---------|
| **A8** | **Apps Script tab** → toolbar function dropdown (says `setup` or `doGet`) | Select **`setup`** |
| **A9** | Same toolbar | Click **Run** (▶) |
| **A10** | Permission prompt → then **spreadsheet tab** from A1 | Authorize: **Review permissions** → your Google account → **Advanced** → **Go to Pav Law Picker Webhook (unsafe)** → **Allow** → switch back to spreadsheet → confirm tab **Submissions** with header row |

### A11–A16 — Deploy web app URL

| Step | Where | Do this |
|------|--------|---------|
| **A11** | **Apps Script tab** | **Deploy** → **New deployment** |
| **A12** | Deployment dialog | Gear ⚙ → **Select type** → **Web app** → **Select** |
| **A13** | Same dialog | **Execute as:** Me |
| **A14** | Same dialog | **Who has access:** **Anyone** |
| **A15** | Same dialog | **Deploy** → authorize if asked → **Deploy** again |
| **A16** | Deployment success dialog → field **Web app URL** | Copy URL (ends in `/exec`) → Notes app as `WEBHOOK_URL` |

**Verify A:** Browser address bar → paste `WEBHOOK_URL` + `?ping=1` → Enter.

Expected on screen: `{"ok":true,"service":"pav-law-project-picker"}`

---

## Part B — QuickBooks deposit link

| Step | Where | Do this |
|------|--------|---------|
| **B1** | QuickBooks Online | Left nav **Sales & get paid** → **Payment links** *(or search: Payment links)* |
| **B2** | Payment links page | **New payment link** |
| **B3** | Link type | **Multi-use payment link** → **Next** |
| **B4** | Amount field | `2500` |
| **B5** | Description | `Pav Law project picker deposit` |
| **B6** | After **Create link** → payment URL shown | Copy URL → Notes as `QB_DEPOSIT_URL` |

**Verify B:** Browser → paste `QB_DEPOSIT_URL` → checkout shows **$2,500**.

---

## Part C — GitHub: push repo, secrets, Pages

**First time pushing from your Mac:** follow **[GITHUB-PUSH.md](GITHUB-PUSH.md)** (create repo → commit → push → secrets → Pages).

Summary below assumes files are already on GitHub.

### C1–C2 — Push monorepo *(first time — see GITHUB-PUSH.md)*

| Step | Copy from / Where | Paste into / Do this |
|------|-------------------|----------------------|
| **C1** | Browser → [github.com/new](https://github.com/new) | Create repo (e.g. `1-cursor-helper`) — no README |
| **C2** | **Mac Terminal** | Run each line:<br>`cd "/Users/gildedgoose/Documents/1 Cursor Helper"`<br>`git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git` *(skip if remote exists)*<br>`git push -u origin HEAD:main` |

### C3–C5 — Repository secrets

| Step | Copy from | Paste into |
|------|-----------|------------|
| **C3** | Notes `WEBHOOK_URL` (Part A16) | GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** → Name: `PAV_PICKER_WEBHOOK_URL` → Value: paste URL → **Add secret** |
| **C4** | Notes `QB_DEPOSIT_URL` (Part B6) | Same page → **New repository secret** → Name: `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` → Value: paste URL → **Add secret** |
| **C5** | *(optional)* | Secret `PAV_PICKER_DEPOSIT_AMOUNT` → Value `2500` |

### C6–C9 — Pages + first deploy

| Step | Where | Do this |
|------|--------|---------|
| **C6** | GitHub repo → **Settings** → **Pages** | Source: **Deploy from a branch** → Branch: **`gh-pages`** / **`/ (root)`** → **Save** |
| **C7** | **Actions** tab → **Deploy Pav Project Picker** | **Run workflow** → **Run workflow** |
| **C8** | **Actions** tab | Wait for green ✓ on latest run |
| **C9** | **Settings** → **Pages** | Copy **Your site is live at** URL → Notes as `PAGES_URL` |

**Verify C:** Browser → `PAGES_URL` (picker loads) → then `PAGES_URL/config.js` → must show your real webhook URL and QuickBooks URL (not `YOUR_DEPLOYMENT_ID`).

---

## Part D — End-to-end test

| Step | Where | Do this |
|------|--------|---------|
| **D1** | Browser → `PAGES_URL` | Open picker |
| **D2** | Sidebar **Your email** | Enter an address you can check |
| **D3** | Sidebar | **Submit selections and notes** |
| **D4** | Browser | Thank-you screen; deposit tab may open |
| **D5** | Google Sheet **Submissions** tab | New row with today's date |
| **D6** | Inbox `support@gildedgooselimited.com` | Email subject contains `Pav Law picker — invoice from this` |
| **D7** | Submitter inbox | Email `Pav Law project selections received` |

---

## After go-live

| Change | Where to edit |
|--------|----------------|
| Webhook URL | GitHub secret `PAV_PICKER_WEBHOOK_URL` → re-run deploy workflow |
| Deposit URL / amount | Secrets `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` / `PAV_PICKER_DEPOSIT_AMOUNT` |
| Email / Sheet columns | `apps-script-webhook.gs` on Mac → copy into Apps Script Code.gs (same as A5–A6) → **Deploy** → **Manage deployments** → **Edit** → **New version** |
| Project card copy | `content/projects/*.md` on Mac in Cursor — markdown is the source; push only the `.md` files |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| CSV download, no thank-you | `PAGES_URL/config.js` has empty webhook — redo C3, C7 |
| CORS / failed to fetch | A14 must be **Anyone**; URL must end `/exec` |
| Sheet empty | Run `setup` from Apps Script bound to this spreadsheet (open via **Extensions → Apps Script** on the sheet, not a standalone script project) |
| Code.gs wrong after edit | Always copy full file from Mac path in A5 — do not paste fragments |
