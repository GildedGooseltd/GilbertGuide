# Pav Law — KPI list (edit here)

**Categories:** Exec summary · Lead data · Marketing efficiency · Sales team efficiency · Overall health

Edit the table below. Keep **ID** stable — bonus tiers in [`KPI-DASHBOARD-SPEC.md`](KPI-DASHBOARD-SPEC.md) reference these numbers. Set **Active** = `no` to hide without renumbering.

---

## KPI table

| ID | KPI | Category | Target | Chart | Active | Notes |
|----|-----|----------|--------|-------|--------|-------|
| 01 | Total leads | Exec summary | Trend up MoM | Stacked bar — channel × month | yes | All channels: HubSpot + LSA + Search calls |
| 02 | New cases | Exec summary | [___]/mo | Gauge | yes | MyCase — new matters opened |
| 03 | Active cases | Exec summary | [___] open | Bar — monthly | yes | MyCase — open matter count |
| 04 | Closed cases | Exec summary | Trend up | Line — monthly count | yes | MyCase — matters closed |
| 05 | Consult → retained % | Exec summary | Trend up | Line — % | yes | Consults held → new case; needs Romina calendar + MyCase |
| 06 | Media spend vs budget | Exec summary | Within budget | Stacked area | yes | Search + LSA + other paid |
| 07 | HubSpot new contacts | Lead data | Monthly floor | Line — weekly | yes | |
| 08 | LSA leads | Lead data | | Bar — monthly | yes | |
| 09 | Search calls | Lead data | | Bar — by campaign | yes | |
| 10 | Military calls | Lead data | ~36+/mo | Single stat + sparkline | yes | Military \| Search \| Calls |
| 11 | NTGUILT calls | Lead data | Track post-launch | Single stat + sparkline | yes | NTGUILT \| Search \| Drivers |
| 12 | After-hours forms | Lead data | | Heatmap — hour × day | yes | |
| 13 | Source mix | Lead data | | Donut | yes | HubSpot Original source |
| 14 | Practice mix — LSA | Lead data | Firm fit | Horizontal bar | yes | LSA job type |
| 15 | Practice mix — all | Lead data | | Stacked bar | yes | Search + LSA + HubSpot by practice area |
| 16 | Military cost/call | Marketing efficiency | < $100 | Gauge | yes | |
| 17 | NTGUILT cost/call | Marketing efficiency | < $150 | Gauge | yes | Hold scale until met |
| 18 | LSA cost/charged lead | Marketing efficiency | Trend down | Line — $/lead | yes | |
| 19 | Search CTR | Marketing efficiency | Up (2.6% → 4%+) | Line — monthly | yes | |
| 20 | Waste spend | Marketing efficiency | Cut MoM | Bar — by term type | yes | Gov/JAG/competitor terms |
| 21 | CPL | Marketing efficiency | ≤ $[___] | Gauge | yes | Ads spend ÷ qualified leads |
| 22 | Referral sends | Marketing efficiency | Per A4 phase | Table | yes | HubSpot email campaigns |
| 23 | Referral count by platform | Marketing efficiency | Net positive MoM | Table — platform × count × Δ | yes | GBP · Yelp · social · directories |
| 24 | Website sessions | Marketing efficiency | | Line — weekly | yes | GA4 clean (excl. spam) |
| 25 | Invalid credits | Marketing efficiency | Flag only | Table | yes | Google billing credits |
| 26 | Inbound meetings booked | Sales team efficiency | [___]/mo | Single stat | yes | HubSpot meetings — intake |
| 27 | Missed calls — total | Sales team efficiency | ≤ 25% | Gauge + line | yes | All Search call extensions |
| 28 | Missed calls — Military | Sales team efficiency | ≤ 25% | Gauge | yes | Bonus gate — Casey coverage hours |
| 29 | LSA missed labels | Sales team efficiency | < 5% | Gauge | yes | LSA Customer field `Missed:` |
| 30 | LSA charge rate | Sales team efficiency | ≥ 40% | Donut | yes | |
| 31 | LSA leads statused | Sales team efficiency | 100% within 24h | Progress bar | yes | |
| 32 | Call answer rate | Sales team efficiency | ≥ 75% | Gauge | yes | During staffed phone blocks |
| 33 | Speed to first task | Sales team efficiency | < 5 min | Histogram | yes | HubSpot workflow — business hours |
| 34 | LSA open at month-end | Sales team efficiency | 0 | Single stat | yes | Blank status in LSA inbox |
| 35 | After-hours callback | Sales team efficiency | By 10am next day | Heatmap | yes | |
| 36 | Outbound dials | Sales team efficiency | [___]/wk | Bar — weekly | yes | Gabriel — HubSpot logged |
| 37 | Outbound connect rate | Sales team efficiency | ≥ 15% | Gauge | yes | |
| 38 | Follow-up within 3h | Sales team efficiency | 100% | Progress bar | yes | VM / no-answer — tightened from 48h |
| 39 | LSA call review log | Sales team efficiency | 4/4 weeks | Yes/No badge | yes | Casey training phase |
| 40 | Dial reconciliation | Sales team efficiency | Mon 10am weekly | Table — match % | yes | Jack — dial log vs HubSpot |
| 41 | CRM field hygiene | Sales team efficiency | < 5/wk flags | Single stat | yes | Missing `pl_outbound_campaign` |
| 42 | Revenue per lead | Overall health | Quarterly review | Line — quarterly | yes | MyCase fees ÷ KPI 01 |
| 43 | Report on time | Marketing efficiency | Day [___] | Yes/No badge | yes | Monthly scorecard to Andrew |

---

## Desktop cockpit (top of report)

Actionable tiles — always visible. Everything else is drill-down.

| ID | KPI | Why it's here |
|----|-----|---------------|
| 01 | Total leads | North-star volume |
| 02 | New cases | Revenue pipeline |
| 06 | Media spend vs budget | Spend guardrail |
| 16 | Military cost/call | Primary call campaign health |
| 21 | CPL | Marketing efficiency |
| 27 | Missed calls — total | Intake leak — bonus-linked |
| 30 | LSA charge rate | LSA ROI |
| 33 | Speed to first task | Speed-to-lead |

**Layout:** 4×2 single-stat row · red/yellow/green vs target · link each tile to full chart.

---

## Campaign highlights (monthly narrative block)

Auto-flag from exports — editor adds one line each in report.

| Signal | Source | Callout |
|--------|--------|---------|
| Best cost/call | Campaign report | Lowest $/call campaign with ≥5 calls |
| Best CTR | Campaign report | Highest CTR campaign with meaningful spend |
| Rising channel | KPI 01 stack | Channel up >20% MoM |
| Bleed campaign | Search terms + spend | Waste spend (20) > $[___] |
| LSA job type winner | KPI 14 | Highest charged-lead practice type |

---

## Opportunity areas (watch list)

| Area | Trigger | Suggested action |
|------|---------|------------------|
| Missed calls high | 27 or 28 > 25% | Casey schedule · Romina backup · review routing |
| LSA labels backlog | 29 > 5% or 34 > 0 | Same-day LSA status sprint |
| CPL over target | 21 over gauge | Pause low performers · negative keywords · landing page check |
| NTGUILT low volume | 11 flat post-launch | Creative · keywords · budget shift from waste |
| Referral platform drop | 23 negative Δ | Profile refresh (B10) · UTM check |
| Slow intake | 33 median > 5 min | HubSpot workflow · Romina task rules |

---

## Lead growth recommendations (standing list)

Review quarterly — tick when done in **Notes** column above or here.

1. Negative keyword sweep on Military + NTGUILT (feeds 20)
2. Monthly LSA inbox archive + API backfill (feeds 08, 29, 31)
3. HubSpot speed-to-task workflow audit (feeds 33)
4. After-hours form → task automation (feeds 12, 35)
5. Referral email phase per A4 (feeds 22)
6. Directory UTM pass on GBP/Yelp/social (feeds 23)
7. Casey phone block expansion when 28 ≤ 20% for 4 weeks

---

## Future KPIs (not active — gather data first)

Standard benchmarks for law firm marketing + intake ([Clio CPSC/CPL](https://www.clio.com/blog/law-firm-marketing/) · HubSpot speed-to-lead). Add as new rows when source exists.

| Proposed KPI | Category | Data needed | Priority |
|--------------|----------|-------------|----------|
| Forecast revenue per lead | Overall health | MyCase fees × practice mix × lead source | High — case type distribution table |
| Avg revenue per case type | Overall health | MyCase export by practice area | High |
| Lead → new case % | Exec summary | KPI 01 ÷ 02 | High — replaces consult metric if no consult log |
| Cost per signed case (CPSC) | Marketing efficiency | Ad spend ÷ MyCase new cases by source | Medium — internal only, not bonus |
| Time to first consult | Sales team efficiency | Romina calendar − lead create | Medium |
| Chat / form abandonment | Lead data | HubSpot form analytics | Low |
| Review velocity (GBP/Yelp) | Marketing efficiency | Manual or BrightLocal | Low |
| Email open/click by referral send | Marketing efficiency | HubSpot email (feeds 22) | Medium |

**Forecast revenue per lead:** build when **avg revenue per case type** table exists — weight by practice mix from KPI 14/15.

---

## Edit log

| Date | Change |
|------|--------|
| 2026-07-11 | Kate — exec summary shifted to MyCase cases (02–04); referral by platform (23); inbound meetings (26); follow-up 3h (38); cockpit + future sections added |
