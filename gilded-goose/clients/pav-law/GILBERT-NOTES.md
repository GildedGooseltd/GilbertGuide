# Pav Law KPI — Gilbert notes

**Edit here.** Each box = one clickable **Gilbert** pill in the dashboard.  
**Fields:** Box # · Location · `tipId` (do not change unless you add a new box) · Content (what Gilbert says on click)

Wireframe sync: copy content into `GILBERT_NOTES` in `pav-law-kpi-wireframe.canvas.tsx` after edits (or automate on A8 build).

---

## Box 1 — Report header

| | |
|---|---|
| **Location** | Page header · top right |
| **tipId** | `report-header` |

Monthly KPI report for Pav Law — Gilbert pulls from Google Ads API, LSA inbox, HubSpot, and MyCase on the 1st. Dummy data in wireframe; build wires live exports.

---

## Box 2 — Action items

| | |
|---|---|
| **Location** | Action items card · header |
| **tipId** | `actions` |

Action items are human tasks, not auto-insights. They stay open until someone marks done. In build, each row gets an owner (Romina · Casey · Kate · Andrew) and links to the KPI that triggered it.

---

## Box 3 — Overall health (section)

| | |
|---|---|
| **Location** | Overall health · section label |
| **tipId** | `overall-health` |

Overall health is the firm pulse: BHI composite, revenue yield (#28–29), problem log, and MyCase pipeline (#03–05). Cockpit numbers live below — not repeated here.

---

## Box 4 — Business health index

| | |
|---|---|
| **Location** | BHI card · header |
| **tipId** | `bhi` |

Business Health Index rolls five pillars into one score. Gauge runs **0 (left) → 100 (right)** on a flat half-moon. Below 70 = pause ad scale and fix intake first. Formulas in `kpi-list.md` § BHI.

---

## Box 5 — Pillar · Infrastructure

| | |
|---|---|
| **Location** | BHI card · Infrastructure bar |
| **tipId** | `pillar-infrastructure` |

Infrastructure = can we trust the data and answer the phone? CRM hygiene (#27), site traffic (#18), and answer rate (#21) weighted 40/30/30.

---

## Box 6 — Pillar · Operations

| | |
|---|---|
| **Location** | BHI card · Operations bar |
| **tipId** | `pillar-operations` |

Operations = does intake run smoothly? Speed to first task (#22), after-hours callback (#23), follow-up (#26), and after-hours forms (#09).

---

## Box 7 — Pillar · Finance

| | |
|---|---|
| **Location** | BHI card · Finance bar |
| **tipId** | `pillar-finance` |

Finance = are cases and dollars moving? New cases (#02), closed (#04), missed-revenue flag (#19), and revenue per lead (#28). Fix leakage before scaling spend.

---

## Box 8 — Pillar · Marketing

| | |
|---|---|
| **Location** | BHI card · Marketing bar |
| **tipId** | `pillar-marketing` |

Marketing = is ad spend efficient? Cost/call (#12) and CPL (#15) carry most of the weight. Strong Military $/call can hide CPL bleed — check both.

---

## Box 9 — Pillar · Sales

| | |
|---|---|
| **Location** | BHI card · Sales bar |
| **tipId** | `pillar-sales` |

Sales = is the team converting inbound? Answered phones (#21) is 40% of this pillar. Casey phone blocks move this number fastest.

---

## Box 10 — BHI problem log

| | |
|---|---|
| **Location** | Problem log card · header |
| **tipId** | `problem-log` |

Problem log lists every KPI scoring below 100, sorted by how many points it drags BHI. Clear a row when the KPI hits target. Pts lost = (100 − score) × KPI weight × 20%.

---

## Box 11 — #28 Revenue per lead

| | |
|---|---|
| **Location** | Overall health · right column · top |
| **tipId** | `kpi-28` |

Revenue per lead = MyCase fees collected ÷ total leads (#01) for the quarter. Rising RPL with flat leads means better case mix or higher fees per matter.

---

## Box 12 — #29 Revenue per case type

| | |
|---|---|
| **Location** | Overall health · right column · table |
| **tipId** | `kpi-29` |

Revenue per case type shows which practice areas pay best. Use it to tune referral focus and ad creative — not to starve low-fee volume if it feeds retainers.

---

## Box 13 — Case pipeline

| | |
|---|---|
| **Location** | Overall health · Case pipeline heading |
| **tipId** | `case-pipeline` |

Case pipeline is MyCase only: open matters (#03), closed trend (#04), consult→retained (#05). New cases (#02) is in Cockpit — not duplicated here.

---

## Box 14 — #03 Active cases

| | |
|---|---|
| **Location** | Case pipeline · active cases stat |
| **tipId** | `kpi-03` |

Active cases = open matters in MyCase right now. Set a target band with Andrew — too many open can mean intake backlog; too few can mean conversion gap.

---

## Box 15 — #04 Closed cases

| | |
|---|---|
| **Location** | Case pipeline · closed chart |
| **tipId** | `kpi-04` |

Closed cases trend shows throughput. Pair with #05: if closes rise but retain % falls, you may be signing lower-quality matters.

---

## Box 16 — #05 Consult → retained

| | |
|---|---|
| **Location** | Case pipeline · retained chart |
| **tipId** | `kpi-05` |

Consult → retained % = calendar consults that became MyCase matters. Romina owns this path. Fix before increasing top-of-funnel spend.

---

## Box 17 — Cockpit (section)

| | |
|---|---|
| **Location** | Cockpit · section label |
| **tipId** | `cockpit` |

Cockpit = seven monthly half-moon gauges. **0 on the left arc end → target number on the right.** Resets on the 1st. Green ↑ MoM when favorable. Click Gilbert on any tile for that KPI.

---

## Box 18 — Cockpit · #01 Total leads

| | |
|---|---|
| **Location** | Cockpit tile · #01 |
| **tipId** | `cockpit-01` |

Total leads = HubSpot new contacts + LSA leads + Search calls. Gauge: **0 → 110** (floor). Over 110 fills full arc. Drill Lead data if a channel drops.

---

## Box 19 — Cockpit · #02 New cases

| | |
|---|---|
| **Location** | Cockpit tile · #02 |
| **tipId** | `cockpit-02` |

New cases = MyCase matters opened MTD. Gauge: **0 → 12**. Below arc fill → check #05 and #22 before increasing ads.

---

## Box 20 — Cockpit · #12 Cost/call

| | |
|---|---|
| **Location** | Cockpit tile · #12 |
| **tipId** | `cockpit-12` |

Cost/call = ad spend ÷ calls (Military baseline). Gauge: **$0 → $100** — lower is better; fill = how close to target. Under target → OK to test +10% budget.

---

## Box 21 — Cockpit · #15 CPL

| | |
|---|---|
| **Location** | Cockpit tile · #15 |
| **tipId** | `cockpit-15` |

CPL = Google spend ÷ qualified HubSpot leads. Gauge: **$0 → $120** — lower is better. Over the right number → audit terms and pause bleed campaigns.

---

## Box 22 — Cockpit · #19 Est. missed revenue

| | |
|---|---|
| **Location** | Cockpit tile · #19 |
| **tipId** | `cockpit-19` |

Est. missed revenue = missed calls × close rate × case value. Gauge: **$0 → $0** target (flag). Any fill above zero → same-day action item for phones and routing.

---

## Box 23 — Cockpit · #21 Answered phones

| | |
|---|---|
| **Location** | Cockpit tile · #21 |
| **tipId** | `cockpit-21` |

Answered phones = answered % from Google Ads call details. Gauge: **0% → 90%**. Below fill → Casey phone block + Romina backup.

---

## Box 24 — Cockpit · #22 Speed to task

| | |
|---|---|
| **Location** | Cockpit tile · #22 |
| **tipId** | `cockpit-22` |

Speed to first task = median minutes contact create → first HubSpot task (business hours). Gauge: **0 → 5 min** — lower is better. Above 5 → workflow audit.

---

## Box 25 — Lead data (section)

| | |
|---|---|
| **Location** | Lead data · section label |
| **tipId** | `lead-data` |

Lead data = where demand comes from. Stacked #01 by channel, source mix (#10), Search calls by campaign (#08). Insights flag LSA charge rate and volume shifts.

---

## Box 26 — Marketing efficiency (section)

| | |
|---|---|
| **Location** | Marketing · section label |
| **tipId** | `marketing` |

Marketing efficiency = spend vs outcomes. Cost/call table (#12), referrals (#17), missed-revenue detail (#19). Cockpit holds headline CPL and $/call — tables break down by channel.

---

## Box 27 — Sales team efficiency (section)

| | |
|---|---|
| **Location** | Sales · section label |
| **tipId** | `sales` |

Sales team efficiency = intake and outreach. Answered-phone trend (#21), meetings (#20), dials (#24), connect (#25), follow-up (#26), CRM hygiene (#27).

---

## Box 28 — Layout notes

| | |
|---|---|
| **Location** | Layout notes card · header |
| **tipId** | `layout-notes` |

Layout approval wireframe — confirm half-moon gauges, Gilbert placement, and no duplicate stats before Gilbert A8 build goes live.

---

## Add a new box

1. Add a **Box N** section here (location + tipId + content).
2. Add matching `GilbertChip` in wireframe/build at that location.
3. Add `tipId` row to `kpi-list.md` § Gilbert notes table.
