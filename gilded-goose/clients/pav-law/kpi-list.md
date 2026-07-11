# Pav Law — KPI list

**LOCKED:** 2026-07-11 · Kate review  
**Status:** Active dashboard set — 29 KPIs

**Edit rule:** To remove a KPI, clear the **ID** cell and save. On lock review, blank-ID rows are deleted and IDs renumbered.  
**Bonuses:** [`PERFORMANCE-PAYMENT-PLAN.md`](PERFORMANCE-PAYMENT-PLAN.md) — KPI #s match this table.

**Categories:** Exec summary · Lead data · Marketing efficiency · Sales team efficiency · Overall health

---

## KPI table

| ID | KPI | Category | Target | Chart | Notes |
|----|-----|----------|--------|-------|-------|
| 01 | Total leads | Exec summary | Trend up MoM | Stacked bar — channel × month | HubSpot + LSA + Search calls |
| 02 | New cases | Exec summary | [___]/mo | Gauge | MyCase — new matters opened |
| 03 | Active cases | Exec summary | [___] open | Bar — monthly | MyCase — open matter count |
| 04 | Closed cases | Exec summary | Trend up | Line — monthly count | MyCase — matters closed |
| 05 | Consult → retained % | Exec summary | Trend up | Line — % | Romina calendar + MyCase |
| 06 | HubSpot new contacts | Lead data | Monthly floor | Line — weekly | |
| 07 | LSA leads | Lead data | | Bar — monthly | |
| 08 | Search calls | Lead data | | Bar — by campaign | |
| 09 | After-hours forms | Lead data | | Heatmap — hour × day | |
| 10 | Source mix | Lead data | | Donut | HubSpot Original source |
| 11 | Practice mix — all | Lead data | | Stacked bar | Search + LSA + HubSpot by practice |
| 12 | Cost/call by channel | Marketing efficiency | < $100 Military baseline | Gauge | Rollup — Military · NTGUILT · other |
| 13 | LSA cost/charged lead | Marketing efficiency | Trend down | Line — $/lead | |
| 14 | Search CTR | Marketing efficiency | Up (2.6% → 4%+) | Line — monthly | |
| 15 | CPL | Marketing efficiency | ≤ $[___] | Gauge | Ads spend ÷ qualified leads |
| 16 | Referral sends | Marketing efficiency | Per A4 phase | Table | HubSpot email campaigns |
| 17 | Referral count by platform | Marketing efficiency | Net positive MoM | Table — platform × count × Δ | GBP · Yelp · social · directories |
| 18 | Website sessions | Marketing efficiency | | Line — weekly | GA4 clean (excl. spam) |
| 19 | Est. missed revenue | Marketing efficiency | Flag monthly | Table | Missed calls × avg close rate × case value |
| 20 | Inbound meetings booked | Sales team efficiency | [___]/mo | Single stat | HubSpot meetings — intake |
| 21 | Missed calls — total | Sales team efficiency | ≤ 25% | Gauge + line | All Search call extensions |
| 22 | Speed to first task | Sales team efficiency | < 5 min | Histogram | HubSpot workflow — business hours |
| 23 | After-hours callback | Sales team efficiency | By 10am next day | Heatmap | |
| 24 | Outbound dials | Sales team efficiency | [___]/wk | Bar — weekly | Gabriel — HubSpot logged |
| 25 | Outbound connect rate | Sales team efficiency | ≥ 15% | Gauge | |
| 26 | Follow-up within 3h | Sales team efficiency | 100% | Progress bar | VM / no-answer |
| 27 | CRM field hygiene | Sales team efficiency | < 5/wk flags | Single stat | Missing `pl_outbound_campaign` |
| 28 | Revenue per lead | Overall health | Quarterly review | Line — quarterly | MyCase fees ÷ KPI 01 |
| 29 | Revenue per case type | Overall health | Quarterly review | Table — case type × avg fee | MyCase export by practice area |

---

## Removed (2026-07-11 lock)

Deleted when ID cleared — not in active set. Re-add as new row if needed later.

| Was | KPI | Reason |
|-----|-----|--------|
| 06 | Media spend vs budget | Removed |
| 10 | Military calls | Rolled into 08 / 12 |
| 11 | NTGUILT calls | Rolled into 08 / 12 |
| 14 | Practice mix — LSA | Merged into 11 |
| 17 | NTGUILT cost/call | Merged into 12 |
| 20 | Waste spend | Removed |
| 25 | Invalid credits | Replaced by 19 est. missed revenue |
| 28–32, 34 | Military missed · LSA missed · charge · status · answer | Removed — bonus tiers TBD |
| 39–40 | LSA call review log · dial reconciliation | Removed |
| 43 | Report on time | Removed — delivery tracked outside KPI table |

---

## Desktop cockpit

| ID | KPI | Why |
|----|-----|-----|
| 01 | Total leads | North-star volume |
| 02 | New cases | Revenue pipeline |
| 12 | Cost/call by channel | Primary ads health |
| 15 | CPL | Marketing efficiency |
| 19 | Est. missed revenue | Intake leak in dollars |
| 21 | Missed calls — total | Intake leak in % |
| 22 | Speed to first task | Speed-to-lead |

**Layout:** 4×2 single-stat row · red/yellow/green vs target · drill-down to full chart.

---

## Campaign highlights

| Signal | Source | Callout |
|--------|--------|---------|
| Best cost/call | Campaign report | Lowest $/call with ≥5 calls (feeds 12) |
| Best CTR | Campaign report | Highest CTR with meaningful spend (feeds 14) |
| Rising channel | KPI 01 | Channel up >20% MoM |
| LSA practice winner | KPI 11 | Highest volume practice type |

---

## Opportunity areas

| Area | Trigger | Action |
|------|---------|--------|
| Missed calls high | 21 > 25% | Casey/Romina schedule · routing review |
| CPL over target | 15 over gauge | Pause bleed · negatives · landing check |
| Low Search volume | 08 flat MoM | Creative · keywords · budget |
| Referral platform drop | 17 negative Δ | Profile refresh (B10) · UTM check |
| Slow intake | 22 median > 5 min | HubSpot workflow audit |
| NTGUILT stalled | 08 NTGUILT slice flat | Events on pause — maintenance mode only |

---

## Lead growth recommendations

1. Negative keyword sweep (feeds 12, 15)
2. Monthly LSA inbox archive + API backfill (feeds 07, 21)
3. HubSpot speed-to-task audit (feeds 22)
4. After-hours form → task automation (feeds 09, 23)
5. Referral email phase per A4 (feeds 16)
6. Directory UTM on GBP/Yelp/social (feeds 17)
7. Casey on phones + LSA call review for script/rating improvement

---

## Future KPIs (not active)

| Proposed | Category | Data needed |
|----------|----------|-------------|
| Forecast revenue per lead | Overall health | 29 + lead source mix |
| Lead → new case % | Exec summary | 01 ÷ 02 |
| Cost per signed case (CPSC) | Marketing efficiency | Ad spend ÷ 02 by source — internal only |
| Time to first consult | Sales team efficiency | Romina calendar − contact create |
| Form abandonment | Lead data | HubSpot form analytics |
| Review velocity (GBP/Yelp) | Marketing efficiency | Manual or BrightLocal |
| Email open/click by referral | Marketing efficiency | HubSpot (feeds 16) |
| Media spend vs budget | Exec summary | Ads + LSA billing |
| Waste spend | Marketing efficiency | Search terms negatives |
| Report on time | Marketing efficiency | Delivery log |

---

## Edit log

| Date | Change |
|------|--------|
| 2026-07-11 | Lock pass — removed blank-ID rows; 43 → 29 KPIs; renumbered; cockpit + bonuses synced |
| 2026-07-11 | Kate — MyCase exec metrics; est. missed revenue (19); revenue per case type (29); cost/call rollup (12) |
