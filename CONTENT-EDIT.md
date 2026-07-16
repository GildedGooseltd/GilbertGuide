# Edit Gilbert Content

**Markdown only.** Your `.md` edits are the source of truth — build never overwrites project files.

**Template:** copy [`_TEMPLATE.md`](_TEMPLATE.md) — same layout as [`projects/B2.md`](projects/B2.md).

---

## File Map

| File | Purpose |
|------|---------|
| [INDEX.md](INDEX.md) | **You edit only** — table titles + **## Notes** (build reads; never writes) |
| [_TEMPLATE.md](_TEMPLATE.md) | Standard layout (matches B2) |
| settings.md | Default package |
| retainer.md | Retainer card |
| projects/{ID}.md | One project per file |

---

## B2 Section Layout

```
## Description
## Value Added          ← ★ bullets on card
## Marketing Education  ← expand section (+ link bullets OK)
## WIP                  ← amber box
## Completed            ← ✓ items
## Account Data & Marketing Principles Applied
   Source: …
```

- **Proper case** in all text (HubSpot, VoIP, Google Ads).
- **Priority:** whole numbers only; omit row for retainer / monthly-only.
- **Angle brackets `<…>`:** treat as prompts — replace with real copy, data, and links (do not leave placeholders live).

---

## Workflow

```bash
cd gilded-goose/clients/pav-law/project-picker
npm run watch    # rebuild on save
```

Push `content/` → GitHub → [GITHUB-PUSH.md](GITHUB-PUSH.md)

**INDEX.md:** you maintain the table and **## Notes** by hand. Build picks up your **Project** names and **P** values for the live picker — it will not change this file.

**Where to get GitHub secret URLs:** [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)
