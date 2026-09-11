# Dashboard staging · Cost per Case · #30

Status: staged off Guide Data tab on 09/10/2026. Was Financial Breakdown tile. Model still runs in [`kpi-report.js`](kpi-report.js). Restore live by removing `archived: true` on `#30` and putting the tile back in `financialBreakdownTilesHtml()`. Avg Case Value was staged separately on 09/10/2026 · [DASHBOARD-STAGING-AVG-CASE-VALUE.md](DASHBOARD-STAGING-AVG-CASE-VALUE.md).

Rule: aggregates only. Firm-wide marketing cost ÷ new cases. Not by channel.

Help / source: `KPI_HELP["#30"]` · `KPI_SOURCES["#30"]`

---

## Live snapshot when staged · May–Aug 2026

| Field | Value |
| ----- | ----- |
| Period | May–Aug 2026 · complete months only · Sep* out |
| Cost per case | $779 |
| Formula | $67,017 media + $12,000 management + $3,000 HubSpot + $6,000 Referral Sites ÷ 113 cases |
| Note | Known stack only. Prior payments and subscriptions still on monthly installments are not fully visible. At least $20k this year is not paid off. Final amount unknown. |

### Month inputs

| Month | Media | Management | HubSpot | Referral Sites | Cases |
| ----- | ----- | ---------- | ------- | -------------- | ----- |
| May | $17,011 | $3,000 | $0 | $1,500 | 22 |
| Jun | $21,502 | $3,000 | $1,000 | $1,500 | 36 |
| Jul | $21,818 | $3,000 | $1,000 | $1,500 | 35 |
| Aug | $6,686 | $3,000 | $1,000 | $1,500 | 20 |
| Total | $67,017 | $12,000 | $3,000 | $6,000 | 113 |

Stack rules: Search + LSA media from `casesLeadsSpend` · $3,000/mo digital management · $1,000/mo HubSpot from Jun onward · $1,500/mo Referral Sites. Partial months with `*` stay out of the average.

---

## Wire notes when approved

- Data tab Financial Breakdown tile via `kpiCostPerCaseCardHtml` / `hydrateMarketingCostPerCaseKpi`
- Keep Avg Case Value on the same complete-month basis
- Refresh after each Contact + ledger + media pull
- Related: [DASHBOARD-STAGING-100K-CALCULATOR.md](DASHBOARD-STAGING-100K-CALCULATOR.md) · Referral Sites $1,500/mo knob
