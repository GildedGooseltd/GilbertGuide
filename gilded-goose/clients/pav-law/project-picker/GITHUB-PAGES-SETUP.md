# GitHub Pages — Pav Law picker (Option 2 only)

Backend (Sheet, email, QuickBooks, secrets): **[BACKEND-SETUP.md](BACKEND-SETUP.md)** — follow Parts A–D there.

This file is reference only for how the deploy works.

| What | Detail |
|------|--------|
| Workflow | `.github/workflows/pav-project-picker-pages.yml` |
| Trigger | Push to `gilded-goose/clients/pav-law/project-picker/**` or manual **Run workflow** |
| Build step | `npm run build` — compiles `content/*.md` → `projects-data.js` |
| Config | Written from GitHub secrets → `config.js` on deploy |
| Output branch | `gh-pages` (root = picker files only) |
| Pages setting | **Settings → Pages →** branch `gh-pages` / `/ (root)` |

Content edits: [CONTENT-EDIT.md](CONTENT-EDIT.md)
