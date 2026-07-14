# Pav Law KPI wireframe — Gilbert Guide merge

**Status:** Round 1 merged · revisions needed before live build.

| Artifact | Purpose |
|----------|---------|
| [`../kpi-wireframe.html`](../kpi-wireframe.html) | Static layout v1 — served on Gilbert Guide **Reporting & dashboards** tab |
| [`pav-law-kpi-wireframe.canvas.tsx`](pav-law-kpi-wireframe.canvas.tsx) | Interactive Cursor canvas — edit layout here, re-copy when round 2 is ready |

**Specs (repo, not on gh-pages):**

- [`../../kpi-list.md`](../../kpi-list.md) — 29 locked KPIs
- [`../../DASHBOARD-WIREFRAME.md`](../../DASHBOARD-WIREFRAME.md) — section rules
- [`../../KPI-DASHBOARD-SPEC.md`](../../KPI-DASHBOARD-SPEC.md) — Gilbert A8 build spec

## Update workflow (until better layout tooling)

1. Edit `pav-law-kpi-wireframe.canvas.tsx` in Cursor canvas.
2. When a round is ready to ship: `cp` canvas → this folder; refresh `kpi-wireframe.html` sections to match (or automate later).
3. Push `project-picker/` → Gilbert Guide deploy.

Do **not** edit `projects-data.js` or `content/INDEX.md` for wireframe-only changes.
