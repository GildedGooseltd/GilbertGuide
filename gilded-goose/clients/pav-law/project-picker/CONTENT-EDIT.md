# Edit Gilbert Content

**Markdown only.** Your `.md` edits are the source of truth — build never overwrites project files.

**Template:** copy [`_TEMPLATE.md`](_TEMPLATE.md) — same layout as [`projects/B2.md`](projects/B2.md).

---

## File Map

| File | Purpose |
|------|---------|
| [INDEX.md](INDEX.md) | **You edit only** — table titles, **Status**, priority numbers, **## Notes** (build reads; never writes) |
| [_TEMPLATE.md](_TEMPLATE.md) | Standard layout (matches B2) |
| settings.md | Default package |
| retainer.md | Retainer card |
| projects/{ID}.md | One project per file |

---

## B2 Section Layout

```
Meta table: Estimated leads · Client touchpoints (optional rows)
## TLDR                  ← one-sentence value (top of card)
## Value Added           ← bullets on card
## Description           ← full scope + marketing education (expand to read)
## WIP                   ← amber box
## Completed             ← ✓ items
## Results               ← outcome metrics (optional)
## Account Data & Marketing Principles Applied
   Source: …
```

- **Marketing education** goes inside **Description** — not a separate section.
- **TLDR** optional in markdown; if omitted, first Value Added bullet is used.
- Card shows **TLDR → bullets → est. leads / touchpoints**; **Read full description** expands Description.

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

**INDEX.md:** you maintain the table and **## Notes** by hand. Use plain numbers in **Priority** (not P1). **Status** overrides project file when set. Build picks up names, priority, and status for the live picker — it will not change this file.

**Where to get GitHub secret URLs:** [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)
