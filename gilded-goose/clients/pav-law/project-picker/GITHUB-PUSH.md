# Get picker content from your Mac → GitHub → live site

**What you edit:** `gilded-goose/clients/pav-law/project-picker/content/` (markdown files)

**Where it goes:** GitHub repo → Action builds → public picker on GitHub Pages

**Live site:** `https://gildedgooseltd.github.io/PickyPavi/`

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

**Verify:** Browser → your repo on GitHub → you should see folder `gilded-goose/clients/pav-law/project-picker/` with `content/projects/B1.md` etc.

### Step 4 — Add webhook secrets (required before submit works)

See [BACKEND-SETUP.md](BACKEND-SETUP.md) **Part C3–C5** — paste Apps Script URL and QuickBooks URL into GitHub **Settings → Secrets and variables → Actions**.

### Step 5 — Turn on Pages and deploy

| Where | Do this |
|--------|---------|
| GitHub repo → **Settings** → **Pages** | Branch: **`gh-pages`** · folder **`/ (root)`** → **Save** |
| **Actions** tab → **Deploy Pav Project Picker** | **Run workflow** → **Run workflow** |
| **Actions** tab | Wait for green ✓ |
| **Settings** → **Pages** | Copy **Your site is live at** — that is the public picker URL |

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
| `config.js` empty on live site | Add GitHub secrets (Step 4) → re-run deploy workflow |

---

## What not to push

| File | Why |
|------|-----|
| `project-picker/config.js` | Gitignored — webhook URL goes in GitHub **Secrets** instead |
| Unrelated workspace folders | First push above only adds picker + workflow; add other folders later if you want full backup |
