# Get picker content from your Mac → GitHub → live site

**What you edit:** `gilded-goose/clients/pav-law/project-picker/content/` (markdown files)

**Where it goes:** GitHub repo → Action builds → public picker on GitHub Pages

**Live site:** `https://gildedgooseltd.github.io/PickyPavi/`

**Secrets + Pages:** repo **`GildedGooseltd/PickyPavi` only**. Do not put `PAV_PICKER_WEBHOOK_URL` on GilbertGuide — that deploy never runs for this live URL.

---

## How it works (one picture)

```
Cursor (edit B1.md, etc.)
    ↓  git add + git commit + git push
GitHub repo (stores the files)
    ↓  workflow "Deploy Pav Project Picker" runs automatically
gh-pages branch (built site)
    ↓  GitHub Pages serves it
Public URL (client opens picker)
```

You never upload files manually in the browser. **Push from Terminal** (or Cursor Source Control) after you edit markdown.

---

## First time only — create GitHub repo and first push

### Step 1 — Create empty repo on GitHub

| Where | Do this |
|--------|---------|
| Browser → [github.com/GildedGooseltd/PickyPavi](https://github.com/GildedGooseltd/PickyPavi) | Repo for this picker |
| HTTPS URL to save | `https://github.com/GildedGooseltd/PickyPavi.git` |

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
git remote add origin https://github.com/GildedGooseltd/PickyPavi.git

git push -u origin HEAD:main
```

*(If `remote origin already exists`: `git remote set-url origin https://github.com/GildedGooseltd/PickyPavi.git` then push.)*
**If asked to log in:** GitHub username + Personal Access Token (not password) — create at GitHub → **Settings** → **Developer settings** → **Personal access tokens**

**If HTTPS auth fails once** (can't paste token, "Device not configured", repeated password prompts) → **stop retrying the same Terminal flow.** Switch immediately to **GitHub Desktop** (recommended) or SSH — do not send the user through token paste again.

### Auth failed? Use GitHub Desktop (do this next)

1. Install: https://desktop.github.com  
2. Sign in via browser in the app  
3. **File → Add Local Repository** → `/Users/gildedgoose/Documents/1 Cursor Helper`  
4. **Publish branch** / **Push origin** → `GildedGooseltd/PickyPavi`, branch **main**

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

**Secret 1:** [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new)

| Field | Paste this |
|-------|------------|
| **Name** | `PAV_PICKER_WEBHOOK_URL` |
| **Secret** | Apps Script `/exec` URL only (BACKEND-SETUP Part A16) |

→ **Add secret**

**Secret 2:** [New repository secret](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions/new) again

| Field | Paste this |
|-------|------------|
| **Name** | `PAV_PICKER_QUICKBOOKS_DEPOSIT_URL` |
| **Secret** | QuickBooks pay URL only (Part B6) — **not** an Apps Script URL |

→ **Add secret**

**Check:** [Secrets list](https://github.com/GildedGooseltd/PickyPavi/settings/secrets/actions) — both names appear.

**Wrong value?** Remove secret → add again (GitHub cannot edit secrets).

**Not this:** putting secret names or HTML buttons in the **Secret** box — URL only.

### Step 5 — Turn on Pages and deploy

| Link | Do this |
|------|---------|
| [Pages settings](https://github.com/GildedGooseltd/PickyPavi/settings/pages) | Branch **`gh-pages`** / **`/ (root)`** → **Save** |
| [Run Deploy Gilbert Guide](https://github.com/GildedGooseltd/PickyPavi/actions/workflows/pav-project-picker-pages.yml) | **Run workflow** |
| [Actions](https://github.com/GildedGooseltd/PickyPavi/actions) | Wait for green ✓ |
| [Live site](https://gildedgooseltd.github.io/PickyPavi/) | Picker loads when deploy finishes |

**Do not re-run old Actions runs** — [Actions](https://github.com/GildedGooseltd/PickyPavi/actions/workflows/pav-project-picker-pages.yml) → **Run workflow** only (uses latest code). Re-running a run from an older commit redeploys that old build to `gh-pages` and overwrites the live site.

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
| Push rejected / auth failed | Use Personal Access Token as password; or `gh auth login` |
| Action did not run | Push must touch `gilded-goose/clients/pav-law/project-picker/**` or run workflow manually |
| Site old after push | Wait for Actions ✓; hard-refresh browser |
| `pages-config.js` empty webhook on live site | Add GitHub secret `PAV_PICKER_WEBHOOK_URL` on **PickyPavi** (Step 4) → re-run deploy → verify [pages-config.js](https://gildedgooseltd.github.io/PickyPavi/pages-config.js) |

---

## What not to push

| File | Why |
|------|-----|
| `project-picker/config.js` | Gitignored — webhook URL goes in GitHub **Secrets** instead |
| Unrelated workspace folders | First push above only adds picker + workflow; add other folders later if you want full backup |
