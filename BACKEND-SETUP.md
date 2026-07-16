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

**Locked spreadsheet** (Submissions + MetricsFeedback):  
https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit  
ID: `1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM` — constant `SPREADSHEET_ID` in `apps-script-webhook.gs` (`openById`).

### A1–A2 — Open the destination spreadsheet

| Step | Where | Do this |
|------|--------|---------|
| **A1** | Browser | Open [the Pav Law feedback Sheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit?gid=0#gid=0) (must be signed in with an account that can edit it) |
| **A2** | That Sheet | Confirm you can edit — do **not** create a new blank sheet for production writes |

### A3–A7 — Paste webhook code into Apps Script

| Step | Copy from | Paste into | Do this |
|------|-----------|------------|---------|
| **A3** | The spreadsheet from A1 | — | Menu bar **Extensions** → **Apps Script** → a **new browser tab** opens (`script.google.com`) |
| **A4** | — | **Apps Script tab** → left file **Code.gs** → large code panel on the right | Click inside the code panel → **Cmd+A** → **Delete** (panel must be empty) |
| **A5** | **Mac — Cursor** → open file:<br>`/Users/gildedgoose/Documents/1 Cursor Helper/gilded-goose/clients/pav-law/project-picker/apps-script-webhook.gs` | — | **Cmd+A** → **Cmd+C** (entire file copied to clipboard) |
| **A6** | **Clipboard** (from A5) | **Apps Script tab** → **Code.gs** empty panel | Click in panel → **Cmd+V** |
| **A7** | — | **Apps Script tab** → top-left project name ("Untitled project") | Click name → type `Pav Law Picker Webhook` → Enter → click **Save** (disk icon) |

You should see `const SPREADSHEET_ID = "1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM";` near the top of Code.gs.

### A8–A10 — Create Submissions + MetricsFeedback tabs

| Step | Where | Do this |
|------|--------|---------|
| **A8** | **Apps Script tab** → toolbar function dropdown (says `setup` or `doGet`) | Select **`setup`** |
| **A9** | Same toolbar | Click **Run** (▶) |
| **A10** | Permission prompt → then [destination Sheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit) | Authorize: **Review permissions** → your Google account → **Advanced** → **Go to Pav Law Picker Webhook (unsafe)** → **Allow** → confirm tabs **Submissions** and **MetricsFeedback** with header rows |

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

Expected on screen (must include metricsFeedback):  
`{"ok":true,"service":"gilbert-guide","metricsFeedback":true,"spreadsheetId":"1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM"}`  
If you only see `{"ok":true,"service":"gilbert-guide"}` → Code.gs was saved but **New version was not deployed** — do **Deploy → Manage deployments → pencil → Version: New version → Deploy**, then recheck ping before testing Save.

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

**Save for picker:** Part C Secret 2 → [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new) — name `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`, Secret = `QB_DEPOSIT_URL`.

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

**Cannot edit a secret later** — [Secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions) → **Remove** → [New secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new) again.

---

#### Secret 1 of 2 — webhook

1. Open: [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)
2. **Name** field — type exactly (copy/paste):

   `PAV_PICKER_WEBHOOK_URL`

3. **Secret** field — paste **only** your Apps Script URL from Part A16. Example shape:

   `https://script.google.com/macros/s/AKfycb…/exec`

   Not the words “Apps Script URL”. Not `PAV_PICKER_WEBHOOK_URL = …`. **Just the https:// link.**

4. Click **Add secret**.

---

#### Secret 2 of 2 — QuickBooks deposit (NOT Apps Script)

1. Open again: [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)
2. **Name** field:

   `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`

3. **Secret** field — paste **only** your QuickBooks payment link from Part B6. Example shape:

   `https://connect.intuit.com/pay/GildedGooseLimited/scs-v1-…`

   **Wrong for this field:** any `script.google.com/.../exec` URL (that is Secret 1).

4. Click **Add secret**.

---

#### Optional secret 3 — deposit amount

Only if you need something other than $2,500:

- [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)
- **Name:** `PAV_PICKER_DEPOSIT_AMOUNT`
- **Secret:** `2500`

---

#### Verify secrets saved

Open: [Actions secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions)

Under **Repository secrets** you should see at least:

- `PAV_PICKER_WEBHOOK_URL`
- `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL`

(GitHub never shows the URL values again — only the names.)

**Wrong (what the screenshot showed):** both lines pasted into **Secret** — that creates one broken secret.

**Wrong:** `https://script.google.com/macros/s/XXXX/exec` — `XXXX` is a placeholder. Use your real URL from Apps Script deploy ([where to get it](WHERE-TO-GET-LINKS.md)).

**Right:** two trips to **New repository secret** — name in **Name**, URL in **Secret**, each time.

Full link guide: [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)

**No Settings tab?** You need **Admin** on [GilbertGuide](https://github.com/GildedGooseltd/GilbertGuide).

**Terminal alternative:**

```bash
gh secret set PAV_PICKER_WEBHOOK_URL --repo GildedGooseltd/GilbertGuide
gh secret set PAV_PICKER_QUICKBOOKS_DEPOSIT_URL --repo GildedGooseltd/GilbertGuide
```

Paste each URL when prompted — not the secret name.

### C6–C9 — Pages + first deploy

| Step | Link | Do this |
|------|------|---------|
| **C6** | [Pages settings](https://github.com/GildedGooseltd/GilbertGuide/settings/pages) | **Build and deployment** → Source: **Deploy from a branch** → Branch: **`gh-pages`** / **`/ (root)`** → **Save** |
| **C7** | [Actions — Deploy Gilbert Guide](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml) | **Run workflow** → **Run workflow** |
| **C8** | [Actions tab](https://github.com/GildedGooseltd/GilbertGuide/actions) | Wait for green ✓ on latest run |
| **C9** | [Pages settings](https://github.com/GildedGooseltd/GilbertGuide/settings/pages) | Copy **Your site is live at** → `https://gildedgooseltd.github.io/GilbertGuide/` |

**Verify C:** [Live picker](https://gildedgooseltd.github.io/GilbertGuide/) loads → then [pages-config.js](https://gildedgooseltd.github.io/GilbertGuide/pages-config.js) shows real URLs (not `YOUR_DEPLOYMENT_ID`).

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

## Metrics feedback (shared reviewers) — where rows land

**Primary destination = Google Sheet.** Email is optional notify only — not required for reviewer success. Mailto is not used by the cockpit feedback buttons.

When someone rates a KPI/chart and clicks **Save** (or **Save all to sheet**, or turns **Feedback mode OFF**), the picker POSTs to the **same** Apps Script webhook (Secret 1 / `PAV_PICKER_WEBHOOK_URL`). No second `/exec` URL.

| | Detail |
|---|--------|
| **Google Sheet (Kate opens)** | [docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit?gid=0#gid=0) |
| **Spreadsheet ID** | `1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM` (`SPREADSHEET_ID` in Apps Script) |
| **Tab name** | **`MetricsFeedback`** (created by `setup()` / `setupMetricsFeedbackSheet`, or on first metrics feedback POST) |
| **What lands** | One row per **Save**, on **Save all to sheet**, and when Feedback mode turns **OFF** — reviewer name, optional email, session id, event (`item_save` / `full_submit`), verdict/comment JSON. Mode-off flush uses `item_save` (Sheet only, no MailApp). |
| **Email** | Optional Apps Script notify to support after Sheet write; failure/absent email does **not** undo the Sheet row. Reviewer email field is optional in the UI. |
| **Cursor / local files** | Other reviewers’ ratings are **not** in the repo or Cursor — only on the Sheet (and each reviewer’s own browser `localStorage`). See `feedback/README.md`. |

### Sheet URL ≠ Secret 1

| | Correct value |
|---|--------|
| **Secret 1** `PAV_PICKER_WEBHOOK_URL` | Apps Script **Web app** `/exec` URL only |
| **Do not paste into Secret 1** | The Google Sheet link or spreadsheet ID above |

After editing Apps Script so it opens this Sheet ID: **Paste full `apps-script-webhook.gs` → Save → Deploy → Manage deployments → Edit → New version → Deploy**. Secret 1 stays the webhook `/exec` URL (do not replace it with the Sheet URL).

### Secret 1 only — before you share the picker URL for feedback

Do these steps once. **Do not** involve Secret 2 / QuickBooks for metrics gather. **Do not** use a Google Form.

**Owner one-pager (bookmark):** [owner-webhook-setup.html](https://gildedgooseltd.github.io/GilbertGuide/owner-webhook-setup.html)

1. Confirm live config has a real webhook: open [pages-config.js on live site](https://gildedgooseltd.github.io/GilbertGuide/pages-config.js) — look at `webhookUrl`.
   - **Must be:** a real `https://script.google.com/.../exec` URL  
   - **Not empty** / not `YOUR_DEPLOYMENT_ID`  
   - **Not** a `docs.google.com/spreadsheets/...` link
2. If empty — set Secret 1 on **GilbertGuide only** (wrong repo = empty live config forever):
   1. **Copy from:** Sheet → **Extensions → Apps Script** → **Deploy → Manage deployments** → **Web app URL** (ends in `/exec`). If no deploy yet: paste full `apps-script-webhook.gs` → Save → New deployment → Web app → Execute as Me → Anyone → Deploy.
   2. **Paste into:** GitHub → [New repository secret on GilbertGuide](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)
      - **Name:** `PAV_PICKER_WEBHOOK_URL`
      - **Secret:** the `/exec` URL only (nothing else — not the Sheet URL)
   3. If the secret already exists with a wrong/empty value: [Secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions) → **Remove** `PAV_PICKER_WEBHOOK_URL` → add again (secrets are not editable in place)
   4. Re-run [Deploy workflow](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml) → branch **`cursor/op01-submission-updates`** (or latest) → wait for green
   5. **Verify webhook not empty:** refresh [pages-config.js](https://gildedgooseltd.github.io/GilbertGuide/pages-config.js) — `webhookUrl` must show the real `/exec` URL
3. After updating webhook code on Mac (`apps-script-webhook.gs`): **Copy from** that file → **Paste into** Apps Script **Code.gs** → **Deploy → Manage deployments → Edit → New version → Deploy** (same URL; do not create a second web app). Secret 1 does not change unless you deployed a brand-new web app.

**Verify gather:** Feedback mode → rate one metric → **Save** → open [the Sheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit) → tab **MetricsFeedback** → newest row. UI toast should say **Saved to MetricsFeedback sheet** (not mail client). No JSON download.

The status bar shows **Remote gather OFF** / **Not saved to sheet — webhook missing/failed** when `webhookUrl` is empty or the POST fails — do not share for multi-person review until Secret 1 is set and [pages-config.js](https://gildedgooseltd.github.io/GilbertGuide/pages-config.js) shows a real `/exec` URL.

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
| CSV download, no thank-you | `PAGES_URL/pages-config.js` has empty webhook — redo C3, C7 |
| **Script function not found: doGet** | Deployed code is incomplete — copy **entire** `apps-script-webhook.gs` from Mac (includes `doGet` + `doPost`) → Save → **Deploy → Manage deployments → Edit → New version → Deploy** |
| Apps Script URL in Secret 2 | Remove Secret 2 → re-add with QuickBooks `connect.intuit.com` link only |
| “Nowhere to save deposit link” | GitHub Secret 2 only — not Google |
| Two `/exec` URLs | Archive spare deployment; one URL in Secret 1 |
| CORS / failed to fetch | A14 must be **Anyone**; URL must end `/exec` |
| UI says saved / “nothing in sheet” | Live ping is still `{"ok":true,"service":"gilbert-guide"}` **without** `"metricsFeedback":true` → script not on New version. **Switch:** open Mac path from A5 → Cmd+A → Cmd+C → paste Code.gs → Save → **Deploy → Manage deployments → pencil → Version: New version → Deploy**. Recheck ping (or [owner-webhook-setup](owner-webhook-setup.html) status box) **before** Save. Look at tab **MetricsFeedback**, not Form Responses / Submissions. Do **not** change GitHub Secret. |
| Sheet empty | Confirm Code.gs has `SPREADSHEET_ID = "1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM"` → Run **`setup`** → check [destination Sheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit) tabs **Submissions** / **MetricsFeedback** → then **Deploy → New version** |
| Rows on wrong sheet | Old code used `getActiveSpreadsheet()` — re-paste Mac `apps-script-webhook.gs` (uses `openById`) → New version deploy |
| Code.gs wrong after edit | Always copy full file from Mac path in A5 — do not paste fragments |
