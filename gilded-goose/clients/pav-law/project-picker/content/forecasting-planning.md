# Forecasting & planning

Working doc for expense pace, case forecast, and cash planning.  
Edit here to build out assumptions and narrative. Live Guide: **Predictions** tab still shows a draft of expense pace + case forecast (WIP blur). **Financials** no longer embeds this checkpoint.

Related: [WasteAud · Financial Audit](projects/WasteAud.md) · Predictions in Guide · case forecast math in `kpi-report.js` (`caseForecastPanelHtml`, `expensePaceMetrics`).

---

## Expense pace checkpoint · $80k / month

Quoted and 80% collectible value vs mid-year and full-year expense targets. **Not QuickBooks cash.** H1 surplus is unreliable until unknown business debt is mapped (WasteAud).

### Locked assumptions (as of 2026-07-25)

| Input | Value | Notes |
| ----- | ----- | ----- |
| Mean fee | $5,587 | CLIENT-VALUE-BASELINE · Contact_07-25-2026.csv |
| Collection rate | 80% | Collectible = quoted × 0.8 |
| Monthly expense | $80,000 | Operating assumption — not full debt load |
| H1 cases (actual) | 116 | Jan–Jun 2026 MyCase Created · Client |
| Full-year cases (forecast) | 201 | 116 H1 + 85 blended H2 |
| Months elapsed (mid-year) | 6 | Linear pace = full-year × 6/12 |

### Checkpoint table

| Checkpoint | Target / expense | Actual or forecast | Gap | Status |
| ---------- | ---------------- | ------------------ | --- | ------ |
| Mid-year quoted pace | $561,494 | $648,092 | +$86,598 | Ahead |
| Mid-year collectible pace | $449,195 | $518,474 | +$69,279 | Ahead |
| H1 expenses covered (collectible) | $480,000 | $518,474 | +$38,474 | Issue — unknown debt |
| Full-year expenses covered (collectible forecast) | $960,000 | $898,390 | −$61,610 | Short |

### Formulas

```
Quoted H1 = 116 × $5,587 = $648,092
Collectible H1 = $648,092 × 0.8 = $518,474
Quoted full year = 201 × $5,587 = $1,122,987
Collectible full year = $1,122,987 × 0.8 = $898,390
H1 expenses = $80,000 × 6 = $480,000
Full-year expenses = $80,000 × 12 = $960,000
Linear mid-year quoted pace = $1,122,987 × 6/12 = $561,494
```

### Working notes (build out)

**Recommendation draft:** Case/quoted volume is ahead of mid-year pace, but the full-year collectible forecast still does **not** cover an $80k/mo expense run-rate. Treat expense coverage as the tighter constraint — raise collectible value (higher-fee mix, Sex Crimes Defense, collection rate) or cut recurring spend before treating the ~$1.12M quoted forecast as “safe.”

**Issue — do not treat H1 surplus as positive:** H1 collectible after expenses shows +$38,474, but **unknown business debt** (loans, credit balances, liabilities outside the $80k/mo operating assumption) is not included. Flag as unreliable until WasteAud maps every liability.

**Next actions (draft):**

- [ ] Keep Sex Crimes Defense / high-mean practice focus in AdEnhance
- [ ] Run WasteAud financial audit — inventory debt + cancel recurring subscriptions
- [ ] Reforcast after August MyCase close and QuickBooks collections land
- [ ] Decide whether $80k/mo stays the expense floor or gets replaced with a real P&L run-rate

**Open questions:**

- What belongs in the $80k (payroll, rent, ads, debt service)?
- Should Predictions stay the live mirror of this section, or only this md until ready?

---

## Case forecast (pointer)

Guide Predictions still renders the Jul–Dec case forecast bars. Source math: seasonal H2 + run-rate blend → 85 H2 / 201 full year. Expand narrative here when ready.

---

## Cash projection (pointer)

Intake-driven collectible cash curve lives in Predictions (`cashProjectionPanelHtml`). Pull assumptions here when refining payment-plan timing.

---

## Known A/R payment-plan subset · as of 2026-07-25

**Live:** Guide Predictions → “Known A/R payment-plan subset” · canvas `mycase-close-and-payment-estimate.canvas.tsx`  
**Source file:** `Ad Reports/exports/mycase/as-of-2026-07-25/Contact_07-25-2026.csv`  
**Derived:** `Ad Reports/exports/mycase/as-of-2026-07-25/ar-known-payment-cycles.csv`  
**Last updated:** 2026-07-25

### Scope

| Slice | Accounts | Balance |
| ----- | -------- | ------- |
| Positive A/R (all contacts) | 67 | $301,074 |
| **Known** (`payment_amount` present) | **28** | **$160,700** (53%) |
| Unknown (no installment) | 39 | $140,374 |

### Payment amounts (known subset)

| Stat | Value |
| ---- | ----- |
| Sum of `payment_amount` | $48,617 |
| Expected cash · cycle 1 | $47,617 (capped at remaining balance) |
| Median installment | $1,000 |
| Mean installment | $1,736 |
| Min / max | $500 / $7,500 |

### Cycles to payoff

**Formula:** `cycles = ceil(Accounts receivable ÷ payment_amount)`  
**Cadence assumption:** monthly (not in export — no due date / frequency field)

| Stat | Value |
| ---- | ----- |
| Median cycles | 3.5 |
| Mean cycles | 4 |
| Max (tail) | 10 |
| Aggregate (balance ÷ payment sum) | 3.31 |

| Cycles | Accounts | Balance |
| ------ | -------- | ------- |
| 1 | 3 | $7,000 |
| 2 | 4 | $12,000 |
| 3 | 7 | $24,700 |
| 4 | 6 | $47,000 |
| 5 | 2 | $21,500 |
| 6 | 1 | $9,000 |
| 7 | 2 | $8,500 |
| 8 | 2 | $24,000 |
| 10 | 1 | $7,000 |

### Assumed monthly runoff (known $ only)

Each cycle applies `min(payment_amount, remaining)` per account.

| Cycle | Cash this cycle | Cumulative | Remaining | % known $ in |
| ----- | --------------- | ---------- | --------- | ------------ |
| 0 | $0 | $0 | $160,700 | 0% |
| 1 | $47,617 | $47,617 | $113,083 | 30% |
| 2 | $39,117 | $86,733 | $73,967 | 54% |
| 3 | $30,467 | $117,200 | $43,500 | 73% |
| 4 | $19,500 | $136,700 | $24,000 | 85% |
| 5 | $8,000 | $144,700 | $16,000 | 90% |
| 6–10 | … | $160,700 | $0 | 100% |

**Calendar (from 2026-07-25, if monthly):** 50% known $ ~Sep 2026 · 75% ~Nov 2026 · 90% ~Dec 2026 · tail May 2027.

### How this relates to intake cash forecast

| Model | What it projects | Use |
| ----- | ---------------- | --- |
| Intake cash (`cashProjectionPanelHtml`) | New 2026 cases × fee × 80% × 40/20/15… plan | Forward signed-matter cash |
| Known A/R runoff (this section) | Existing balances with `payment_amount` | Backlog collection pace |

Do **not** add the two models together without reconciliation — intake fees and contact A/R overlap and A/R is incomplete vs QuickBooks.

### Still missing for a reliable payoff date

1. Payment cadence + next due date (plan export)  
2. Delinquency / past-due flag  
3. QuickBooks payments applied to matter  
4. True matter open/close dates (case duration remains unavailable)  
5. **Booked / closed by** + **Case ranking** on MyCase (MyCaseClr / T068) so closed-matter exports support OpsDash #04 staff and mix reporting

### A/R median historical trend

Track positive Accounts receivable **median** across contact-export snapshots (not cash).

| As of | Median | Δ |
| ----- | ------ | - |
| 2026-04-24 | $3,500 | — |
| 2026-07-01 | $3,900 | +$400 |
| 2026-07-25 | $3,600 | −$300 |

**Doc + append steps:** `Ad Reports/exports/mycase/AR-MEDIAN-BALANCE-TREND.md` · series CSV `ar-median-balance-trend.csv` · canvas Median balance over time. Add a row when the next MyCase contact export is filed (prefer month-end).
