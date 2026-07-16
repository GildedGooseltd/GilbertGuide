# Gilbert Guide — payment schedule & calculator

**Used by:** Confirm / invoicing page (`Payment options` + schedule calculator in `app.js`).  
**Client-facing:** amounts come from cart fees; rules below are fixed unless a project overrides deposit.

---

## Default rules (project one-time fees)

| Step | Rule |
|------|------|
| **Deposit due now** | **50%** of each project’s one-time fee (setup `Fee`) |
| **Remaining** | Other **50%**, invoiced on the schedule Andrew picks |
| **No surcharge** | Payoff window **≤ 60 days** (1–2 monthly invoices) |
| **+5% on remaining** | **3–6** months |
| **+10% on remaining** | **7–12** months |
| **Retainer / monthly** | Full monthly amount bills separately — **not** in the project schedule pool |
| **Ongoing fee** (e.g. `$1,700 + $500/mo`) | Deposit/schedule on **setup fee only**; ongoing bills with monthly |

Calculator implementation: `computePaymentPlan()` / `updateInvoiceScheduleAmount()` in `app.js`.

---

## Per-project overrides (optional)

In a project `.md` meta table:

| Field | Effect |
|-------|--------|
| **Deposit pct** | e.g. `100` or `1` = all due now; `25` = 25% deposit |
| **Deposit amount** | Fixed $ due now (caps at one-time fee) |

If neither is set → default **50%**.

---

## Related docs

| Doc | Role |
|-----|------|
| [STANDARD-SOW.md](../STANDARD-SOW.md) §5 | SOW deposit / terms blanks |
| [PERFORMANCE-PAYMENT-PLAN.md](../PERFORMANCE-PAYMENT-PLAN.md) | Retainer + KPI bonus track (not à la carte schedule) |
| [CONTENT-INDEX.md](CONTENT-INDEX.md) | Where confirm-page copy lives |
