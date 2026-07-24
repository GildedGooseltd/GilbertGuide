# Forecasting & planning

Working doc for expense pace, case forecast, and cash planning.  
Edit here to build out assumptions and narrative. Live Guide: **Predictions** tab still shows a draft of expense pace + case forecast (WIP blur). **Financials** no longer embeds this checkpoint.

Related: [B9 · Financial Audit](projects/B9.md) · Predictions in Guide · case forecast math in `kpi-report.js` (`caseForecastPanelHtml`, `expensePaceMetrics`).

---

## Expense pace checkpoint · $80k / month

Quoted and 80% collectible value vs mid-year and full-year expense targets. **Not QuickBooks cash.** H1 surplus is unreliable until unknown business debt is mapped (B9).

### Locked assumptions (as of Jul 2026)

| Input | Value | Notes |
| ----- | ----- | ----- |
| Mean fee | $5,587 | CLIENT-VALUE-BASELINE |
| Collection rate | 80% | Collectible = quoted × 0.8 |
| Monthly expense | $80,000 | Operating assumption — not full debt load |
| H1 cases (actual) | 114 | Jan–Jun 2026 MyCase created |
| Full-year cases (forecast) | 198 | 114 actual + 84 blended H2 forecast |
| Months elapsed (mid-year) | 6 | Linear pace = full-year × 6/12 |

### Checkpoint table

| Checkpoint | Target / expense | Actual or forecast | Gap | Status |
| ---------- | ---------------- | ------------------ | --- | ------ |
| Mid-year quoted pace | $553,113 | $636,918 | +$83,805 | Ahead |
| Mid-year collectible pace | $442,491 | $509,534 | +$67,043 | Ahead |
| H1 expenses covered (collectible) | $480,000 | $509,534 | +$29,534 | Issue — unknown debt |
| Full-year expenses covered (collectible forecast) | $960,000 | $884,981 | −$75,019 | Short |

### Formulas

```
Quoted H1 = 114 × $5,587 = $636,918
Collectible H1 = $636,918 × 0.8 = $509,534
Quoted full year = 198 × $5,587 = $1,106,226
Collectible full year = $1,106,226 × 0.8 = $884,981
H1 expenses = $80,000 × 6 = $480,000
Full-year expenses = $80,000 × 12 = $960,000
Linear mid-year quoted pace = $1,106,226 × 6/12 = $553,113
```

### Working notes (build out)

**Recommendation draft:** Case/quoted volume is ahead of mid-year pace (~+15%), but the full-year collectible forecast still does **not** cover an $80k/mo expense run-rate. Treat expense coverage as the tighter constraint — raise collectible value (higher-fee mix, Sex Crimes Defense, collection rate) or cut recurring spend before treating the $1.1M quoted forecast as “safe.”

**Issue — do not treat H1 surplus as positive:** H1 collectible after expenses shows +$29,534, but **unknown business debt** (loans, credit balances, liabilities outside the $80k/mo operating assumption) is not included. Flag as unreliable until B9 maps every liability.

**Next actions (draft):**

- [ ] Keep Sex Crimes Defense / high-mean practice focus in A1
- [ ] Run B9 financial audit — inventory debt + cancel recurring subscriptions
- [ ] Reforcast after July MyCase cases and QuickBooks collections land
- [ ] Decide whether $80k/mo stays the expense floor or gets replaced with a real P&L run-rate

**Open questions:**

- What belongs in the $80k (payroll, rent, ads, debt service)?
- Should Predictions stay the live mirror of this section, or only this md until ready?

---

## Case forecast (pointer)

Guide Predictions still renders the Jul–Dec case forecast bars. Source math: seasonal H2 + run-rate blend → 84 H2 / 198 full year. Expand narrative here when ready.

---

## Cash projection (pointer)

Intake-driven collectible cash curve lives in Predictions (`cashProjectionPanelHtml`). Pull assumptions here when refining payment-plan timing.
