# Client value baseline (aggregates only)

**As of:** 2026-08-24  
**Source file (local):** `Downloads/Contact_08-24-2026.csv` · aggregates in `Ad Reports/exports/mycase/as-of-2026-08-24/` · **last updated 2026-08-24**  
**Derived:** `Ad Reports/exports/mycase/as-of-2026-08-24/fee-means-by-practice.csv`  
**No PII in this doc** — counts and means only.

## Locked Guide baseline (KPI #28)

| Metric | Value | Definition |
|--------|-------|------------|
| **Mean client fee** | **$5,662** | Contact group = Client · fee present · n = 138 |
| Fee selection order | Pre-Trial Flat Fee → pre-File flat → trial_fee → retainer → payment_amount | First nonzero wins |

Prior Jul-25 lock was $5,587 · n=142. Aug-24 recompute: **$5,662 · n=138**.

### Sensitivity (do not use as primary unless Kate re-locks)

| Slice | n | Mean |
|-------|---|------|
| Client + fee (primary) | 138 | **$5,662** |

## Practice area means (Client + fee · n ≥ 5)

Classification from MyCase `Cases (practice area)` text. Fuzzy — not a formal matter taxonomy. Refreshed 2026-08-24.

| Practice area | n | Mean |
|---------------|---|------|
| Theft / Property | 10 | $8,000 |
| Sex Assault / Sex Offense | 9 | $7,778 |
| Assault / Menacing | 17 | $7,721 |
| Domestic Violence / DV | 35 | $5,693 |
| Criminal Defense (other) | 21 | $4,471 |
| Probation Revocation | 9 | $4,056 |
| DUI / DWAI / Traffic | 20 | $3,600 |

## Trust / balance fields (Client · nonzero)

| Field | n | Mean | Notes |
|-------|---|------|-------|
| Trust balance | 270 | $4,172 | Total ≈ $1,126,567 · refreshed 2026-08-24 |
| Credit balance | 0 | — | |

Trust balance ≠ contracted fee.

## Data quality checks (2026-08-24)

| Check | Result |
|-------|--------|
| Client contacts total | 510 |
| Client + fee coverage | 138 / 510 |
| Fees-collected billing export | **Not available from MyCase — use QuickBooks** |

## Downstream Guide updates

When #28 changes, scale modeled #19 missed revenue with the new mean.

| Field | Prior Jul-25 | Updated Aug-24 |
|-------|--------------|----------------|
| #28 Avg case fee | $5,587 | **$5,662** |
| #19 Aug* Search missed 10 | ~$4,079 | **~$4,133** |

## Still needed for cash-collected truth

**Fees collected cannot be calculated in MyCase** — this export exposes only contract fields (flat/trial/retainer) + A/R, not payments received. Collections must come from **QuickBooks** billing.

1. QuickBooks payments collected by practice / matter (2025 + 2026)  
2. HubSpot deals × lead source / military status  
3. Better Case Type + practice fill rate  

Re-run analysis after next MyCase pull; update this file + `kpi-report.js` together.
