# Dashboard staging · Missed Opportunity · #19

Status: staged off Guide Data tab on 09/10/2026. Was Financial Breakdown tile. Model and `phoneByMonth` stay in [`kpi-report.js`](kpi-report.js). Restore live by removing `archived: true` on `#19` and putting `missedOpportunityTextCardHtml()` back in `financialBreakdownTilesHtml()`.

Rule: aggregates only. Never paste Call details caller numbers or LSA Customer names.

Help / source: `KPI_HELP["#19"]` · `KPI_SOURCES["#19"]`

---

## Live snapshot when staged · September 2026

| Field | Value |
| ----- | ----- |
| Period | September 2026 |
| Est. lost / mo | $6,200 |
| Est. lost · quarter | $35,133 |
| Est. lost · year | $56,212 |
| Missed call rate target | 10% or less |
| Weekday | 58% · 15 of 26 |
| Weekend | No calls |
| Search Call details | Sep 1–10 · 26 calls · 11 Received · 15 Missed · answered 42% |
| Uncharged LSA | 11 of 15 inbox leads |

Method note on the tile:

Uncharged LSA calls this month: 11 of 15. To value them, pull the LSA inbox, filter Charge status to not charged, then check each one against the phone log for an outbound callback to the same number within 48 hours. Count only the never-reached calls as lost, and apply the same lead-to-case rate.

### Formula

Missed Search calls × 7.3% lead→case × avg case value $5,662.

Month / quarter / year sum missed calls in that window from `phoneByMonth`. Uncharged LSA calls are not in the dollar total until the 48-hour callback check is done.

### phoneByMonth · Sep*

| Metric | Value |
| ------ | ----- |
| Calls | 26 |
| Received | 11 |
| Missed | 15 |
| Answered % | 42% |
| Weekday calls / missed | 26 / 15 |
| Weekend calls / missed | 0 / 0 |

---

## Wire notes when approved

- Data tab Financial Breakdown via `missedOpportunityTextCardHtml`
- Green check only when `phoneByMonth` has the current tile month
- Related: HsVoip · LsaCall · #21 Answered Calls · #33 lead→case placeholder 7.3%
