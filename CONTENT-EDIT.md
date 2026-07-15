# Edit Gilbert Content

**Markdown only.** Your `.md` edits are the source of truth — build never overwrites project files.

**Also see:** [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md) (colors, spacing, zones) · [CONTENT-INDEX.md](CONTENT-INDEX.md) (every text string by page)

**Template:** copy `[_TEMPLATE.md](_TEMPLATE.md)` — same layout as `[projects/B2.md](projects/B2.md)`.

---

## File Map


| File                         | Purpose                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| [INDEX.md](INDEX.md)         | **You edit only** — table titles, **Status**, priority numbers, **## Notes** (build reads; never writes) |
| [_TEMPLATE.md](_TEMPLATE.md) | Standard layout (matches B2)                                                                             |
| settings.md                  | Default package                                                                                          |
| retainer.md                  | Retainer card                                                                                            |
| projects/{ID}.md             | One project per file                                                                                     |


---



## B2 Section Layout

```
Meta table: Estimated leads gained (optional row)
## Summary                  ← one-sentence value (top of card)
## Value Added           ← bullets on card (plain weight; markdown links OK)
## Value icons           ← picker filter icons (foundation · leads · crm · …)
## AB - Q                  ← Question for Andrew Brown; cart blocked until Comment answered
## Description           ← full scope (expand to read)
## Goal                   ← measurable outcome
## Information needed     ← gaps, AB-Q, _Add:_ placeholders
## WIP                   ← work in progress
## Completed             ← shipped
```

See `[_TEMPLATE.md](content/_TEMPLATE.md)`. Fee market context: `[FEE-BENCHMARK-CO-SPRINGS.md](FEE-BENCHMARK-CO-SPRINGS.md)`.

- **Marketing education** goes inside **Description** — not a separate section.
- **Summary** optional in markdown (`## Summary`; legacy `## TLDR` still parses); if omitted, first Value Added bullet is used.
- **AB – Q** (`AB - Q:`) — question for Andrew Brown; Gilbert flags it; **Comment required before cart**.
- **Value icons** — `## Value icons` list in each project file (`foundation` · `leads` · `crm` · `seo` · `referrals` · `efficiency` · `intake` · `creative`); overrides auto-detect when set
- **KPI links** — `## KPI links` lists dashboard metrics (`01`, `21`, …). External reference URLs are stripped on build; only **KPI #NN** links in the picker (opens KPIs tab).
- **Estimated leads gained** = incremental leads expected from that campaign, not existing lead volume.
- Card shows **Summary → bullets → leads gained**; **Current Status** expands Description.
- **Goal** renders on expanded cards. Do **not** add Results, Blockers (next round), Insights & improvements, Impact estimates, or Gilbert on metrics — removed from the guide.
- **`npm run build`** updates `projects-data.js` only — it does **not** rewrite project markdown.

- **Proper case** in all text (HubSpot, VoIP, Google Ads).
- **Priority:** whole numbers only; omit row for retainer / monthly-only.
- **Angle brackets** `<…>`**:** treat as prompts — replace with real copy, data, and links (do not leave placeholders live).

---



## Workflow

```bash
cd gilded-goose/clients/pav-law/project-picker
npm run watch    # rebuild on save
```

Push `content/` → GitHub → [GITHUB-PUSH.md](GITHUB-PUSH.md)

**INDEX.md:** you maintain the table and **## Notes** by hand. Use plain numbers in **Priority** (not P1). **Status** overrides project file when set. Build picks up names, priority, and status for the live picker — it will not change this file.

**Where to get GitHub secret URLs:** [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md)