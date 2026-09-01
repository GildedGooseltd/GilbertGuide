# MyCase as-of 2026-09-01

Last Downloads scan: 2026-09-01 — no MyCase or paid-media CSV newer than Sep 1 10:25. Dash matches this pull.

Sources in Downloads: `Contact_09-01-2026.csv` · `Case_balance_summary_09-01-2026.csv` · `Electronic_payments_09-01-2026.csv` · `Trust_account_summary_09-01-2026.csv` · `case_list_report (2).csv`.

Raw Contact / case_list / balance files stay in Downloads. Aggregates only here. No names, phones, emails, or case numbers.

Paid media and cash tiles still use the Aug 24 export ceiling: `Call details (4)` through Aug 14 · `leads-inbox(3)` through Aug 21 · `account_activities_202608(3)`. No newer Search or LSA in this pass.

Aug cash on dash: $104,545 from MyCase **Trust account activity** → `ledger_account_activity_report (4).csv` Aug 1–31 Credits. Jan–Jul from ledger (2).

## Filed aggregates

| File | Contents |
| ---- | -------- |
| [new-cases-by-month.csv](new-cases-by-month.csv) | Contact group=Client · Created by month · Aug* 19 through 2026-09-01 |
| [fee-means-summary.csv](fee-means-summary.csv) | Client + fee mean $5,662 · n=138 |
| [fee-means-by-practice.csv](fee-means-by-practice.csv) | Practice means · n≥5 · unchanged from 2026-08-24 pull |
| [trust-balance-snapshot.csv](trust-balance-snapshot.csv) | Client Trust balance · n=272 · total ≈ $1,163,817 · mean ≈ $4,279 |
| [cash-credits-by-month.csv](cash-credits-by-month.csv) | Jan–Jul ledger Credits · Aug $101,045 electronic Aug 1–31 |
| [case-balance-snapshot.csv](case-balance-snapshot.csv) | Open-matter AR / WIP / Client Trust sums from Case_balance_summary |

## Vs prior tiles

| Metric | Prior as-of | This pull |
| ------ | ----------- | --------- |
| New cases Aug* | 17 through Aug 24 | 19 through Sep 1 |
| Avg case fee | $5,662 · n=138 | unchanged |
| Cash Aug | $101,045 electronic only | $104,545 Trust account activity ledger (4) |

Guide edit target: [kpi-report.js](../../../../gilded-goose/clients/pav-law/project-picker/kpi-report.js).
