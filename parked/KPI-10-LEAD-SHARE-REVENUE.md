# Parked — Lead Share & Potential Revenue (#10)

**Removed from:** Data tab (2026-07-16)  
**Restore UI:** `KPI_REPORT.parked.sourceMixPanelHtml()` in `kpi-report.js`  
**Live data:** still in `DATA.sourceMix` · helpers `sourceMixDetailTable` · `sourceMixPanelHtml`

Card title on Data tab was **Lead Share & Potential Revenue** (source mix donut + MoM + est. potential client revenue).

## Snapshot (as parked · Jun stack)

| Source | Leads | Share | Prior | MoM | Est. potential revenue* |
| ------ | ----- | ----- | ----- | --- | ----------------------- |
| Paid Search | 138 | 61% | 39 | +254% | leads × 7.3% × $5,587 |
| LSA | 83 | 37% | 50 | +66% | same formula |
| HubSpot / other | 5 | 2% | 0 | — | same formula |

\*Est. potential = leads × lead→case (#19 lock 7.3%) × avg case fee (#28).

## Tile layout (saved)

- Split panel · `#10 Source mix`
- Donut from `DATA.sourceMix`
- Tables: Source · Leads · Share · Est. potential revenue · Month comparison (Prior / Current / Δ / Change)
- Footnote: formula note + `KPI_SOURCES["#10"]`

## Related

- Keep `DATA.sourceMix` for any future Impact / client view
- Do not re-add to Data tab until Kate asks
