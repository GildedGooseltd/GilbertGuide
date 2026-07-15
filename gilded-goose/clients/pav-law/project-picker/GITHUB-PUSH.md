# Get picker content from your Mac → GitHub → live site

**What you edit:** `gilded-goose/clients/pav-law/project-picker/content/` (markdown files)

**Where it goes:** GitHub repo → Action builds → public picker on GitHub Pages

**Live site:** `https://gildedgooseltd.github.io/GilbertGuide/`

**Secrets + Pages:** repo **`GildedGooseltd/GilbertGuide` only**.

---

## How it works (one picture)

```
Cursor (edit B1.md, etc.)
    ↓  git add + git commit + git push
GitHub repo (stores the files)
    ↓  workflow "Deploy Gilbert Guide" runs automatically
gh-pages branch (built site)
    ↓  GitHub Pages serves it
Public URL (client opens picker)
```

You never upload files manually in the browser. Prefer **GitHub Desktop → Push**. Terminal / Cursor Source Control also work after auth is set up.

---

## First time only — create GitHub repo and first push

### Step 1 — Create empty repo on GitHub

| Where | Do this |
|--------|---------|
| Browser → [github.com/GildedGooseltd/GilbertGuide](https://github.com/GildedGooseltd/GilbertGuide) | Repo for this picker |
| HTTPS URL to save | `https://github.com/GildedGooseltd/GilbertGuide.git` |

### Step 2 — Commit picker files on your Mac

| Where | Do this |
|--------|---------|
| **Cursor** → **Terminal** (or Mac Terminal app) | Paste and run **each line** (Enter after each): |

```bash
cd "/Users/gildedgoose/Documents/1 Cursor Helper"

git add .github/workflows/pav-project-picker-pages.yml
git add gilded-goose/clients/pav-law/project-picker/

git commit -m "Add Pav Law project picker"
```

**Copy from:** folders above on your Mac  
**Result:** Git records the picker + deploy workflow locally.

If `git commit` says "nothing to commit", files may already be committed — continue to Step 3.

### Step 3 — Connect Mac repo to GitHub and push

| Where | Do this |
|--------|---------|
| Same Terminal | Replace `YOUR_USERNAME` and `YOUR_REPO` with yours, then run: |

```bash
git remote add origin https://github.com/GildedGooseltd/GilbertGuide.git

git push -u origin HEAD:main
```

*(If `remote origin already exists`: `git remote set-url origin https://github.com/GildedGooseltd/GilbertGuide.git` then push.)*

### Personal Access Token (Terminal HTTPS only)

**You only need a token if you push from Terminal / Cursor and Git asks you to log in.**  
**Prefer [GitHub Desktop](https://desktop.github.com)** (browser sign-in) — then skip this whole section.

| Question | Answer |
|----------|--------|
| **What is it for?** | Password substitute so `git push` can talk to GitHub |
| **Suggested Name** (label only) | `GilbertGuide Mac push` |
| **Where do I put it?** | Only in the Terminal **Password** prompt when `git push` asks — **not** in GitHub Secrets, Apps Script, Cursor chat, or any repo file |
| **Username prompt** | Your GitHub username |
| **Password prompt** | Paste the token (not your GitHub account password) |

**Create token:** [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token**

| Scope checkbox | Needed? |
|----------------|---------|
| `repo` (full) | Yes — push code |
| `workflow` | Yes — required if you ever push changes under `.github/workflows/` |

Without `workflow`, GitHub rejects pushes that touch the deploy workflow with:  
`refusing to allow a Personal Access Token to create or update workflow … without workflow scope`

**Never paste a token into Cursor chat.** If you did — revoke it immediately on the tokens page, make a new one, use only at the Password prompt.

macOS usually saves the token in **Keychain** after one successful push — you paste once.

**If HTTPS auth fails once** (can't paste, "Device not configured", repeated prompts, or `workflow` scope error and you don't want a new token) → **stop.** Use **GitHub Desktop** next — do not retry Terminal token paste.

### Auth failed? Use GitHub Desktop (do this next)

1. Install: https://desktop.github.com  
2. Sign in via browser in the app  
3. **File → Add Local Repository** → `/Users/gildedgoose/Documents/1 Cursor Helper`  
4. **Publish branch** / **Push origin** → `GildedGooseltd/GilbertGuide`

No token paste in Terminal.

**SSH alternative:** see BACKEND-SETUP troubleshooting or ask agent for `ssh-keygen` steps.


**Verify:** Browser → your repo on GitHub → you should see folder `gilded-goose/clients/pav-law/project-picker/` with `content/projects/B1.md` etc.

### Step 4 — Add secrets (GitHub only — two saves, not one)

**Both secrets go in GitHub.** Secret 2 does **not** go in Apps Script or the Sheet.

| Secret | Copy link from | Save in GitHub |
|--------|----------------|----------------|
| 1 — webhook | Apps Script Deploy (`/exec`) | `PAV_PICKER_WEBHOOK_URL` |
| 2 — deposit | QuickBooks Payment links (`connect.intuit.com`) | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |

Full cheat sheet: [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)

**Secret 1:** [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new)

| Field | Paste this |
|-------|------------|
| **Name** | `PAV_PICKER_WEBHOOK_URL` |
| **Secret** | Apps Script `/exec` URL only (BACKEND-SETUP Part A16) |

→ **Add secret**

**Secret 2:** [New repository secret](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions/new) again

| Field | Paste this |
|-------|------------|
| **Name** | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |
| **Secret** | QuickBooks pay URL only (Part B6) — **not** an Apps Script URL |

→ **Add secret**

**Check:** [Secrets list](https://github.com/GildedGooseltd/GilbertGuide/settings/secrets/actions) — both names appear.

**Wrong value?** Remove secret → add again (GitHub cannot edit secrets).

**Not this:** putting secret names or HTML buttons in the **Secret** box — URL only.

### Step 5 — Turn on Pages and deploy

| Link | Do this |
|------|---------|
| [Pages settings](https://github.com/GildedGooseltd/GilbertGuide/settings/pages) | Branch **`gh-pages`** / **`/ (root)`** → **Save** |
| [Run Deploy Gilbert Guide](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml) | **Run workflow** |
| [Actions](https://github.com/GildedGooseltd/GilbertGuide/actions) | Wait for green ✓ |
| [Live site](https://gildedgooseltd.github.io/GilbertGuide/) | Picker loads when deploy finishes |

**Do not re-run old Actions runs** — [Actions](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml) → **Run workflow** only (uses latest code). Re-running a run from an older commit redeploys that old build to `gh-pages` and overwrites the live site.

---

## Every time after — publish markdown edits

You edited `content/projects/B1.md` (or any file under `project-picker/`).

| Step | Where | Do this |
|------|--------|---------|
| 1 | **Cursor Terminal** | `cd "/Users/gildedgoose/Documents/1 Cursor Helper"` |
| 2 | Same | `git add gilded-goose/clients/pav-law/project-picker/content/` |
| 3 | Same | `git commit -m "Update picker content"` |
| 4 | Same | `git push` |

**Optional — preview before push (local only, not public):**

```bash
cd "/Users/gildedgoose/Documents/1 Cursor Helper/gilded-goose/clients/pav-law/project-picker"
npm run build
```

Then open `index.html` in browser from that folder.

**After push:** GitHub **Actions** tab → latest run green (~1 min) → refresh public Pages URL.

---

## Cursor UI instead of Terminal (same steps)

| Git step | Cursor |
|----------|--------|
| `git add` | **Source Control** panel (branch icon) → **+** next to changed files under `project-picker/` |
| `git commit` | Message box → **Commit** |
| `git push` | **Sync / Push** (↑ icon) |

First time still needs **Step 3** remote URL in Terminal unless you use **Publish to GitHub** from Cursor and pick the repo.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `remote origin already exists` | Skip `git remote add`; run `git push -u origin HEAD:main` |
| Push rejected / auth failed | **GitHub Desktop → Push** (first choice). Or new PAT with `repo` + `workflow` → paste at Terminal **Password** only |
| `… update workflow … without workflow scope` | Token missing `workflow`. Revoke → new token with `workflow` checked → push again; **or** push from Desktop; **or** commit without `.github/workflows/` changes |
| Where does the PAT go? | Terminal **Password** on push only — never GitHub Secrets / chat / repo files |
| Action did not run | Push must touch `gilded-goose/clients/pav-law/project-picker/**` or [Run Deploy Gilbert Guide](https://github.com/GildedGooseltd/GilbertGuide/actions/workflows/pav-project-picker-pages.yml) manually |
| Site old after push | Wait for Actions ✓; hard-refresh browser |
| `pages-config.js` empty webhook on live site | Add GitHub secret `PAV_PICKER_WEBHOOK_URL` on **GilbertGuide** (Step 4) → re-run deploy → verify [pages-config.js](https://gildedgooseltd.github.io/GilbertGuide/pages-config.js) |

---

## What not to push

| File | Why |
|------|-----|
| `project-picker/config.js` | Gitignored — webhook URL goes in GitHub **Secrets** instead |
| Unrelated workspace folders | First push above only adds picker + workflow; add other folders later if you want full backup |
