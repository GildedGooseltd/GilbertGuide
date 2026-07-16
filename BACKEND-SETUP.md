# Pav Law Project Picker — backend setup

**Outcome when done:** Live URL → submit → Google Sheet row + email to `support@gildedgooselimited.com` + submitter email + QuickBooks deposit tab.

**Deploy:** Option 2 — monorepo `1 Cursor Helper` → GitHub Actions → branch `gh-pages`.

Complete **Part A → B → C → D** in order. Each paste step lists **Copy from** and **Paste into**.

### Two secrets — two tools (both saved in GitHub only)

| | Secret 1 | Secret 2 |
|---|----------|----------|
| **GitHub name** | `PAV_PICKER_WEBHOOK_URL` | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |
| **Get link from** | **Part A** — Google Apps Script Deploy | **Part B** — QuickBooks Payment links |
| **Link type** | `script.google.com/.../exec` | `connect.intuit.com/pay/...` |
| **Save in** | GitHub | GitHub — **not Google, not Apps Script** |

Quick reference: **[WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)**

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

Expected on screen: `{"ok":true,"service":"picky-pavi"}`

---

## Part B — QuickBooks deposit link

**This link is Secret 2.** You copy it from QuickBooks and paste it into **GitHub only** (Part C, Secret 2). Do not paste it into Apps Script, the Sheet, or Secret 1.

| Step | Where | Do this |
|------|--------|---------|
| **B1** | [QuickBooks Online](https://qbo.intuit.com) | Left nav **Sales & get paid** → **Payment links** *(or search: Payment links)* |
| **B2** | Payment links page | **New payment link** |
| **B3** | Link type | **Multi-use payment link** → **Next** |
| **B4** | Amount field | `2500` |
| **B5** | Description | `Pav Law project picker deposit` |
| **B6** | After **Create link** → payment URL shown | Copy URL → Notes as `QB_DEPOSIT_URL` |

**Verify B:** Browser → paste `QB_DEPOSIT_URL` → checkout shows **$2,500**.

**Save for picker:** Part C Secret 2 → [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new) — name `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`, Secret = `QB_DEPOSIT_URL`.

---

## Part C — GitHub: push repo, secrets, Pages

**First time pushing from your Mac:** follow **[GITHUB-PUSH.md](GITHUB-PUSH.md)** (create repo → commit → push → secrets → Pages).

Summary below assumes files are already on GitHub.

### C1–C2 — Push monorepo *(first time — see GITHUB-PUSH.md)*

| Step | Copy from / Where | Paste into / Do this |
|------|-------------------|----------------------|
| **C1** | Browser → [github.com/new](https://github.com/new) | Create repo (e.g. `1-cursor-helper`) — no README |
| **C2** | **Mac Terminal** | Run each line:<br>`cd "/Users/gildedgoose/Documents/1 Cursor Helper"`<br>`git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git` *(skip if remote exists)*<br>`git push -u origin HEAD:main` |

### C3–C5 — Repository secrets (two secrets, added one at a time)

**Where secrets live:** GitHub repo settings only. Neither secret is saved in Google after Part A/B — you only *copy* links from Google (A) and QuickBooks (B), then paste into GitHub here.

**You are on the right page** if the heading says **Actions secrets / New secret** (or you see **New repository secret**).

**Do not** put both names in the **Secret** box. GitHub wants **one secret per save** — a **Name** (label) and a **Secret** (the actual URL only).

**Cannot edit a secret later** — [Secrets list](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions) → **Remove** → [New secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new) again.

---

#### Secret 1 of 2 — webhook

1. Open: [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new)
2. **Name** field — type exactly (copy/paste):

   `PAV_PICKER_WEBHOOK_URL`

3. **Secret** field — paste **only** your Apps Script URL from Part A16. Example shape:

   `https://script.google.com/macros/s/AKfycb…/exec`

   Not the words “Apps Script URL”. Not `PAV_PICKER_WEBHOOK_URL = …`. **Just the https:// link.**

4. Click **Add secret**.

---

#### Secret 2 of 2 — QuickBooks deposit (NOT Apps Script)

1. Open again: [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new)
2. **Name** field:

   `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`

3. **Secret** field — paste **only** your QuickBooks payment link from Part B6. Example shape:

   `https://connect.intuit.com/pay/GildedGooseLimited/scs-v1-…`

   **Wrong for this field:** any `script.google.com/.../exec` URL (that is Secret 1).

4. Click **Add secret**.

---

#### Optional secret 3 — deposit amount

Only if you need something other than $2,500:

- [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new)
- **Name:** `PAV_PICKER_DEPOSIT_AMOUNT`
- **Secret:** `2500`

---

#### Verify secrets saved

Open: [Actions secrets list](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions)

Under **Repository secrets** you should see at least:

- `PAV_PICKER_WEBHOOK_URL`
- `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`

(GitHub never shows the URL values again — only the names.)

**Wrong (what the screenshot showed):** both lines pasted into **Secret** — that creates one broken secret.

**Wrong:** `https://script.google.com/macros/s/XXXX/exec` — `XXXX` is a placeholder. Use your real URL from Apps Script deploy ([where to get it](WHERE-TO-GET-LINKS.md)).

**Right:** two trips to **New repository secret** — name in **Name**, URL in **Secret**, each time.

Full link guide: [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)

**No Settings tab?** You need **Admin** on [PickyPavi](https://github.com/GildedGooseltd/PickyPavi).

**Terminal alternative:**

```bash
gh secret set PAV_PICKER_WEBHOOK_URL --repo GildedGooseltd/PickyPavi
gh secret set PAV_PICKER_QUICKBOOKS_DEPOSIT_URL --repo GildedGooseltd/PickyPavi
```

Paste each URL when prompted — not the secret name.

### C6–C9 — Pages + first deploy

| Step | Link | Do this |
|------|------|---------|
| **C6** | [Pages settings](https://github.com/GildedGooseltd/PickyPavi/settings/pages) | **Build and deployment** → Source: **Deploy from a branch** → Branch: **`gh-pages`** / **`/ (root)`** → **Save** |
| **C7** | [Actions — Deploy Picky Pavi](https://github.com/GildedGooseltd/PickyPavi/actions/workflows/pav-project-picker-pages.yml) | **Run workflow** → **Run workflow** |
| **C8** | [Actions tab](https://github.com/GildedGooseltd/PickyPavi/actions) | Wait for green ✓ on latest run |
| **C9** | [Pages settings](https://github.com/GildedGooseltd/PickyPavi/settings/pages) | Copy **Your site is live at** → `https://gildedgooseltd.github.io/PickyPavi/` |

**Verify C:** [Live picker](https://gildedgooseltd.github.io/PickyPavi/) loads → then [config.js](https://gildedgooseltd.github.io/PickyPavi/config.js) shows real URLs (not `YOUR_DEPLOYMENT_ID`).

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
| **Script function not found: doGet** | Deployed code is incomplete — copy **entire** `apps-script-webhook.gs` from Mac (includes `doGet` + `doPost`) → Save → **Deploy → Manage deployments → Edit → New version → Deploy** |
| Apps Script URL in Secret 2 | Remove Secret 2 → re-add with QuickBooks `connect.intuit.com` link only |
| “Nowhere to save deposit link” | GitHub Secret 2 only — not Google |
| Two `/exec` URLs | Archive spare deployment; one URL in Secret 1 |
| CORS / failed to fetch | A14 must be **Anyone**; URL must end `/exec` |
| Sheet empty | Run `setup` from Apps Script bound to this spreadsheet (open via **Extensions → Apps Script** on the sheet, not a standalone script project) |
| Code.gs wrong after edit | Always copy full file from Mac path in A5 — do not paste fragments |
