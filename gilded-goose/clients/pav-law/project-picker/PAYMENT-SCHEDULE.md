# Gilbert Guide — payment schedule & calculator

**Used by:** Confirm / invoicing page (`Payment options` + biweekly schedule in `app.js`).  
**Client-facing:** amounts come from cart fees; rules below are fixed unless a project overrides deposit.

---

## Default rules (project one-time fees)

| Step | Rule |
|------|------|
| **Equal biweekly** | Split the full setup `Fee` into **equal** payments every **14 days** from start through end. No deposit % |
| **First payment** | Due on the project **start date**. Same dollar amount as later biweekly invoices |
| **Max payments** | Count of biweekly dates from start through end, inclusive. **Weeks ≤ 4** or ≤ 31 days → at most **3**. Example: Yelp Oct 1 → Dec 1 → **5** payments |
| **One-month cap** | If **Weeks ≤ 4** or the work start→end span is **≤ 31 days**, use **at most 3** equal payments |
| **Pay past close** | Optional **Payment grace days** extends the payment window past work end when set. Otherwise payments stop at end |
| **Pay in full** | INDEX `100%` / `pay in full` still means **1 payment** of the full setup fee on start |
| **Per-project dates** | Each one-time project has its own start and end on the calculator / confirm page |
| **Retainer / monthly** | Full monthly amount bills separately — **not** in the project biweekly pool |
| **Ongoing fee** (e.g. `$1,700 + $500/mo`) | Equal biweekly on **setup fee only**; ongoing bills with monthly |

Primary calculator: `computeProjectBiweeklyPlan()` / `biweeklyPlansBreakdownHtml()` in `app.js`.

INDEX **Payment plan** % values are legacy for older SOW wording. The Guide calculator schedule uses equal biweekly parts, not those percentages.

---

## Optional monthly fallback

If project dates are not set, the confirm page still offers the older month-based schedule under **Optional monthly fallback**:

| Window | Surcharge on remaining |
|--------|-------------------------|
| 1 month (≤30 days) | None |
| Each additional month | +10% on remaining |

---

## Submit project request

**Submit project request** emails `support@gildedgooselimited.com` with:

- Selected projects and fees
- Start / end dates
- Biweekly invoice amounts and dates
- Plain-language invoice terms for Kate to write in QuickBooks

Payload type: `project_request` → Apps Script `handleProjectRequest`.

**Submit selections & SOW** still runs the full private signing flow.

---

## Per-project overrides (INDEX wins)

Edit the **Payment plan** column in [content/INDEX.md](content/INDEX.md), then `npm run build`.

| Cell value | Effect |
|------------|--------|
| `50%` / `50/50` | Default deposit |
| `100%` / `pay in full` | All one-time fee due now |
| `25%` · `75/25` | Custom deposit % |
| `$800` | Fixed $ due now |
| `monthly` | Retainer / monthly — not on project schedule |
| `—` | No standalone deposit (package / merged) |

Also supported on a project `.md` meta table (**Deposit pct** / **Deposit amount**) — INDEX overrides those when set.

---

## WasteAud financial-audit savings share

WasteAud keeps its **$1,800 fixed fee** and **50% deposit**. It also uses the Savings-Share Rider in [`SCHEDULES-PAYMENT.md`](../../../website/contracts/SCHEDULES-PAYMENT.md):

- **20% of verified net savings or recovered cash**
- **12 months** for changed recurring subscriptions, software seats, and phone/services
- **6 months** for continuing vendor or contract-rate revisions
- **3 months** for variable ad, LSA, staffing-schedule, or operating-process revisions
- One-time refunds and credits: 20% once the money or credit posts

The Guide calculator shows the fixed fee only because future realized savings are unknown. The signed WasteAud SOW and Savings-Share Rider control the additional quarterly invoices.

---

## Related docs

| Doc | Role |
|-----|------|
| [STANDARD-SOW.md](../STANDARD-SOW.md) §5 | SOW deposit / terms blanks |
| [PERFORMANCE-PAYMENT-PLAN.md](../PERFORMANCE-PAYMENT-PLAN.md) | Retainer + KPI bonus track (not à la carte schedule) |
| [CONTENT-INDEX.md](CONTENT-INDEX.md) | Where confirm-page copy lives |
| [BACKEND-SETUP.md](BACKEND-SETUP.md) | Webhook deploy for `project_request` email |
