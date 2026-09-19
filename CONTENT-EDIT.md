# Edit Gilbert Content

**Markdown only.** Your `.md` edits are the source of truth.

| Command | Overwrites project `.md`? |
|---------|---------------------------|
| `npm run build` / `watch` | **No** — writes `projects-data.js` (+ market fee estimates) only |
| `npm run estimate-fees` | **No** — prints Quote vs Market table |
| `npm run sync-impact` | **Yes** — full rewrite of projects + retainer |
| `npm run migrate` / `format-content` / `apply-campaign-metrics` | **Yes** — full rewrite |

Agents: run rewrite scripts **only** when Kate asks in that message. See `.cursor/rules/preserve-user-edits.mdc` + `gilbert-guide-content.mdc`.

**Also see:** [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md) — colors, spacing, zones · [CONTENT-INDEX.md](CONTENT-INDEX.md) — every text string by page · [CONTENT-WRITING-GUIDE.md](CONTENT-WRITING-GUIDE.md) — Yelp, SEO, external copy

**Template:** copy `[_TEMPLATE.md](_TEMPLATE.md)` — same layout as `[projects/AdEnhance.md](projects/AdEnhance.md)`.

### Project IDs

ID = filename without `.md`. Use a short name from the project title — letters + digits, 2–24 chars. Examples: `Yelpv1`, `DigProf`, `HsVoip`, `SocialAds`. Do not use letter+number codes like `A20` / `B10`. Retainer file stays `retainer.md` → id `RETAINER`. New projects: pick the short name, create `content/projects/{Id}.md`, link it in INDEX as `(projects/{Id}.md)`.

---

## File Map


| File                         | Purpose                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| [INDEX.md](INDEX.md)         | **You edit only** — titles, **Status**, **Show**, **Est. cost**, priority, **## Notes** (build reads; never writes). Show alone controls Guide dashboard visibility. |
| [_TEMPLATE.md](_TEMPLATE.md) | Standard layout (matches HsVoip)                                                                             |
| settings.md                  | Default package                                                                                          |
| retainer.md                  | Retainer card                                                                                            |
| [recommendations.md](recommendations.md) | **Recommendations tab** copy — ranks, why/do/proof, projects table, actions |
| [forecasting-planning.md](forecasting-planning.md) | Expense pace · case/cash forecast working notes (not auto-built into Guide) |
| projects/{ID}.md             | One project per file                                                                                     |


---



## Project outline layout

```
Meta table · Priority group · Tile space # · Fee · Ongoing fee · Duration weeks · Invoice count · Recommended start · Category · Campaign type
## Project Overview
## HubSpot Application
```

Do not use empty spacer rows in the meta table.
Reference format: `[projects/AdEnhance.md](projects/AdEnhance.md)` · Ad Expansion. Template: `[_TEMPLATE.md](_TEMPLATE.md)`.

- Project Overview — client-facing prose Andrew sees on the Guide. State the work plainly. Polish in place over Kate’s wording. Do not rewrite from agent memory. Put a blank line between each paragraph so the popup shows empty line space.
- HubSpot Application — CRM / Marketing / Service surfaces, or “No HubSpot build in scope”. Heading is HubSpot Application, not HubSpot parts. Write as markdown `-` bullets: `Feature name · what it does`. Guide renders a disc bullet list.
- Tone: positive and direct. State what the work does and when it is ready. Do not write against a missing ideal.
- No bold in project markdown. Meta field labels are plain (`| Priority group |`).
- No project ID in meta. ID comes from the filename.
- Show / dashboard visibility: INDEX Show `[x]` / `[ ]` only. Do not put Publish status in project outlines.
- Retired from project outlines: Fee note · Publish status · Client summary · Employees impacted · Value icons · KPI links · Summary bullet lists · WIP · Tasks · Completed · Project plan · Estimated leads · Keywords.
- Status lives on the project `.md` meta table. Show lives on INDEX only.
- Optional meta rows: Parent · Monthly only · Payment type · Per campaign fee.
- **`npm run build`** updates `projects-data.js` and `recommendations-data.js` only — it does **not** rewrite project markdown.

### Recommendations tab

Edit [`content/recommendations.md`](content/recommendations.md):

- **Page** table — title, subtitle, expense alert
- **Jump** table — sticky nav labels
- **`## Rec · {id}`** — one block per card (Title, Hint, Why, Solutions, Proof)
- **Stats / Proof / Projects table / Actions** — subsections under each Rec
- Tokens: `{{lsaCpl}}`, `{{digCpl}}`, `{{digAllIn}}`, `{{minDivert}}`, `{{mgmt}}`, `{{breakEvenMedia}}`, `{{closeMultiple}}`, …
- Project links: `[HubSpot Phone / VoIP](project:HsVoip)` — title visible; id only in the link target.

Then `npm run build` → hard-refresh Guide.

### Market fee estimates

Adding **Value Added**, **Tasks**, **WIP**, **Information needed**, or **AB-Qs** raises the **Market** estimate on the next build (local Front Range + national blend). Locked **Fee** / INDEX **Est. cost** stay put until you copy Market in. Report: `npm run estimate-fees`. Bands: [`FEE-BENCHMARK-CO-SPRINGS.md`](FEE-BENCHMARK-CO-SPRINGS.md) · `scripts/fee-estimate-bands.mjs`.

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