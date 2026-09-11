# Dashboard staging · Avg Case Value

Status: staged off Guide Data tab on 09/10/2026. Was the last Financial Breakdown tile. Model still runs in [`kpi-report.js`](kpi-report.js) via `avgCaseValueModel` / `DATA.avgCaseValue`. Restore live by putting `avgCaseValueCardHtml()` back in `financialBreakdownTilesHtml()`.

Rule: aggregates only. Cash collected ÷ new cases on complete months. Not by client.

Help / source: `KPI_HELP["avg-case-value"]` · `KPI_SOURCES["avg-case-value"]`

---

## Live snapshot when staged · May–Aug 2026

| Field | Value |
| ----- | ----- |
| Period | May–Aug 2026 · complete months only · Sep* out |
| Avg case value | $3,615 |
| Formula | $408,520 collected ÷ 113 new cases |
| Contracted mean fee | $5,662 |
| Net of $779 marketing cost per case | $2,836 stays with the firm |

Note when staged: Collections mix older-case payments with new deposits. Contracted fee at signing is the cleaner case-value basis when available. Tile showed red period mark while dash month was September because May–Aug stack does not include Sep*.

---

## Wire notes when approved

- Data tab Financial Breakdown tile via `avgCaseValueCardHtml`
- Same complete-month stack as staged Cost per Case #30
- Related: [DASHBOARD-STAGING-COST-PER-CASE.md](DASHBOARD-STAGING-COST-PER-CASE.md)
