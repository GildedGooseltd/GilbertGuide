# Update-safe workflow (Data tab + cockpit)

**Purpose:** Batch design/data updates without clobbering Kate’s open-tab edits or mixing publish scopes.

**Rules that always win:** [`.cursor/rules/preserve-user-edits.mdc`](../../../.cursor/rules/preserve-user-edits.mdc) · [`gilbert-guide-content.mdc`](../../../.cursor/rules/gilbert-guide-content.mdc)

---

## 1. Comment → apply (no chat memory)

| Who | Does |
|-----|------|
| **Kate** | Pastes design notes into [`DESIGN-COMMENTS.md`](DESIGN-COMMENTS.md) only — one bullet per change |
| **Agent** | Reads that file from disk → patches listed files → marks each bullet `done` |
| **Neither** | Rebuilds a file from an old chat summary |

Say **apply comments** when ready. Until then, agents do not invent layout from prior turns.

---

## 2. Who edits what

| Change type | Edit only | Do not touch |
|-------------|-----------|--------------|
| Data tab layout / branding CSS | `index.html` (`.data-panel` / `.data-report-root` block) | KPIs tab chrome unless asked |
| Chart order / which cards / card titles | `kpi-report.js` → `renderData()` | `projects-data.js` by hand |
| Chart numbers / formulas | `kpi-report.js` → `DATA` + helpers | inventing from memory |
| Project titles / fees / status | `content/INDEX.md` + `content/projects/*.md` | `projects-data.js` |
| Rebuild picker JS from markdown | `npm run build` → writes `projects-data.js` only | `sync-impact` / migrate / format-content |
| Brand tokens site-wide | `BRANDING-LAYOUT.md` first, then `index.html` `:root` | Data-only tokens rolled everywhere early |

**Data tab CSS is scoped** under `.data-panel` / `.data-report-root` until Kate says roll out branding globally.

---

## 3. Update order (one pass)

1. Kate dumps bullets in `DESIGN-COMMENTS.md`
2. Agent reads disk on every file before patching
3. Smallest `StrReplace` only — no full-file rewrite
4. Bump cache: `RENDER_VER` in `kpi-report.js` + matching `?v=` on scripts in `index.html`
5. Preview in **Chrome** (not Cursor browser split):  
   `cd gilded-goose/clients/pav-law/project-picker && python3 -m http.server 8766`  
   → [http://127.0.0.1:8766/](http://127.0.0.1:8766/) → **Data** tab → hard-refresh
6. Kate confirms → agent marks bullets `done`
7. **Publish only when Kate says push** — stage only the files she named (usually `index.html` + `kpi-report.js` + `app.js`). Leave unrelated dirty tree alone.

---

## 4. Forbidden this round

- Full-file `Write` on `index.html` / `kpi-report.js` / `INDEX.md` / any Kate-open file
- Restoring deleted cards, sections, or chart full-width flags she removed
- Editing `projects-data.js` by hand while payment/content churn is dirty
- Running `npm run sync-impact` / `format-content` / `migrate` without explicit ask
- Opening Cursor Simple/Agent Browser for design review (use Chrome — avoids sticky split panels)
- Mixing “publish Data tab” with unrelated workspace commits

---

## 5. Open-tab conflict

If Kate’s editor buffer and disk might differ: **ask which wins** before any write.

---

## Related

- Design queue: [`DESIGN-COMMENTS.md`](DESIGN-COMMENTS.md)
- Brand hub: [`BRANDING-LAYOUT.md`](BRANDING-LAYOUT.md)
- Content markdown: [`CONTENT-EDIT.md`](CONTENT-EDIT.md)
- Push: [`GITHUB-PUSH.md`](GITHUB-PUSH.md)
