# Client value baseline (aggregates only)

**As of:** 2026-07-01 (MyCase export) · **Locked into Guide:** 2026-07-15  
**Source file (local only):** `Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv`  
**No PII in this doc** — counts and means only.

## Locked Guide baseline (KPI #28)

| Metric | Value | Definition |
|--------|-------|------------|
| **Mean client fee** | **$5,587** | Contact group = Client · fee present · n = 142 |
| Fee selection order | Pre-Trial Flat Fee → pre-File flat → trial_fee → retainer → down payments → AR last | First nonzero wins |

### Sensitivity (do not use as primary unless Kate re-locks)

| Slice | n | Mean |
|-------|---|------|
| Client + fee (primary) | 142 | **$5,587** |
| Exclude AR from fee pick | 136 | $5,694 |
| Flat/trial/retainer only | 135 | $5,725 |
| Pre-Trial Flat Fee only | 125 | $5,855 |

## Practice area means (Client + fee · n ≥ 5)

Classification from MyCase `Case Type` when filled, else `Cases (practice area)` text. Fuzzy — not a formal matter taxonomy.

| Practice area | n | Mean |
|---------------|---|------|
| Sex Assault / Sex Offense | 6 | $9,500 |
| Theft / Property | 12 | $7,333 |
| Assault / Menacing | 20 | $6,538 |
| Domestic Violence / DV | 52 | $5,414 |
| Criminal Defense (other) | 11 | $4,582 |
| Probation Revocation | 5 | $4,500 |
| DUI / DWAI / Traffic | 24 | $3,542 |

## Trust / balance fields (Client · nonzero)

| Field | n | Mean |
|-------|---|------|
| Trust balance | 223 | $4,429 |
| Accounts receivable | 56 | $4,583 |
| Credit balance | 0 | — |

Trust balance ≠ contracted fee. AR incomplete per DATA-PULL-LIST — not used as revenue.

## Data quality checks (2026-07-15)

| Check | Result |
|-------|--------|
| Sample/[TEST] rows in fee set | 0 |
| Client + fee duplicate emails | 0 |
| Fees &gt; $50k | 0 |
| Fees &lt; $500 | 0 |
| Client contacts total | 455 |
| Client + fee coverage | 142 / 455 (31%) |
| Case Type filled (all contacts) | ~328 / 5,081 (sparse) |
| Fees-collected billing export | **Still missing** |

## Downstream Guide updates

When #28 changes, scale modeled #19 missed revenue by `5587 / 3870`:

| Field | Prior | Updated |
|-------|-------|---------|
| #28 Avg case fee | $3,870 | **$5,587** |
| app.js `PAV_HISTORICAL.avgCaseFee` | $4,800 | **$5,587** |
| #19 monthlyLost | $4,200 | **$6,060** |
| #19 priorMonthlyLost | $4,800 | **$6,930** |
| #19 cumulativeYtd | $27,300 | **$39,400** |

## Still needed for cash-collected truth

1. MyCase payments collected by practice (2025 + 2026)  
2. HubSpot deals × lead source / military status  
3. Better Case Type + practice fill rate  

Re-run analysis after next MyCase pull; update this file + `kpi-report.js` + `app.js` together.
