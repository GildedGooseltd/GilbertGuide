# Pav Law — KPI list

**LOCKED:** 2026-07-11 · Kate review · trimmed 2026-07-15  
**Status:** Active dashboard set — 21 KPIs (removed 05 · 09 · 20 · 23–27)

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
|  | Consult → retained % | Exec summary | Trend up | Line — % | Removed 2026-07-15 |
| 06 | HubSpot new contacts | Lead data | Monthly floor | Line — weekly | |
| 07 | LSA leads | Lead data | | Bar — monthly | |
| 08 | Search calls | Lead data | | Bar — by campaign | |
|  | After-hours forms | Lead data | | Heatmap — hour × day | Removed 2026-07-15 |
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
|  | Inbound meetings booked | Sales team efficiency | [___]/mo | Single stat | Removed 2026-07-15 |
| 21 | Answered phones | Sales team efficiency | ≥ 90% (≤10% missed) | Gauge + line | All Search call extensions |
| 22 | Speed to first task | Sales team efficiency | < 5 min | Histogram | HubSpot workflow — business hours |
|  | After-hours callback | Sales team efficiency | By 10am next day | Heatmap | Removed 2026-07-15 |
|  | Outbound dials | Sales team efficiency | [___]/wk | Bar — weekly | Removed 2026-07-15 |
|  | Outbound connect rate | Sales team efficiency | ≥ 15% | Gauge | Removed 2026-07-15 |
|  | Follow-up within 3h | Sales team efficiency | 100% | Progress bar | Removed 2026-07-15 |
|  | CRM field hygiene | Sales team efficiency | < 5/wk flags | Single stat | Removed 2026-07-15 |
| 28 | Revenue per lead | Overall health | Quarterly review | Line — quarterly | MyCase fees ÷ KPI 01 |
| 29 | Revenue per case type | Overall health | Quarterly review | Table — case type × avg fee | MyCase export by practice area |

---

## Removed (2026-07-15)

| Was | KPI | Reason |
|-----|-----|--------|
| 05 | Consult → retained % | Cut from active set |
| 09 | After-hours forms | Cut from active set |
| 20 | Inbound meetings booked | Cut from active set |
| 23 | After-hours callback | Cut from active set |
| 24 | Outbound dials | Cut from active set |
| 25 | Outbound connect rate | Cut from active set |
| 26 | Follow-up within 3h | Cut from active set |
| 27 | CRM field hygiene | Cut from active set |

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

## Cockpit

Monthly **half-moon gauges** (180° flat arc) — **reset on the 1st**. **0** at left end of arc → **target number** at right end. Arc gradation: **red &lt;40% · orange to 70% · green to target**. **100% fill → peacock tail celebration.**

**Cockpit tiles (count goals only):**

| ID | KPI | Target (right arc) | Fill along arc |
|----|-----|-------------------|----------------|
| 01 | Total leads | 110 | `min(100, actual ÷ 110 × 100)` |
| 02 | New cases | 12 | `actual ÷ 12 × 100` |

**Not cockpit gauges:** #21 answered phones → Sales section (big stat + line trend). #12 · #15 · #22 → Health metric chips. #19 → Health alert banner (top of section).

**Layout:** Cockpit **first** (after actions) · 2-col tile grid · green ↑ / red ↓ MoM

---

## Business health index (BHI)

**Composite 0–100** · recalculates monthly · lives in **Overall health** beside **#28**, pillars under gauge, **#29** under **#28**. **Case pipeline** (#03–#05) in same section — **no cockpit KPI values repeated**.

### Top-level formula

```
BHI = round(
  0.20 × Infrastructure
+ 0.20 × Operations
+ 0.20 × Finance
+ 0.20 × Marketing
+ 0.20 × Sales
)
```

### KPI score (0–100 each)

| Type | Formula | KPIs |
|------|---------|------|
| Higher-is-better | `min(100, actual ÷ target × 100)` | 02, 04, 05 MoM proxy, 20, 21, 25, 26, 28 vs prior Q |
| Lower-is-better | `min(100, target ÷ actual × 100)` | 12, 15, 22, 27 |
| Flag | `100 if $0 else 0` | 19 |
| Hygiene | `min(100, target ÷ flags × 100)` | 27 (< 5/wk) |
| Sessions MoM | `100 if up · 70 if flat · max(0, 100 + MoM%)` | 18 |
| Referral Δ | `100 if net positive · 50 if flat · max(0, 100 + Δ%)` | 17 |
| After-hours / forms | `% callbacks on time` (build) | 23, 09 |

### Pillar formulas (weighted average)

**Infrastructure** = `0.40×S(27) + 0.30×S(18) + 0.30×S(21)`

**Operations** = `0.35×S(22) + 0.25×S(23) + 0.25×S(26) + 0.15×S(09)`

**Finance** = `0.35×S(02) + 0.25×S(04) + 0.25×S(19) + 0.15×S(28)`

**Marketing** = `0.35×S(12) + 0.35×S(15) + 0.15×S(14) + 0.15×S(17)`

**Sales** = `0.40×S(21) + 0.25×S(20) + 0.20×S(25) + 0.15×S(26)`

`S(n)` = KPI score for #n per table above.

### Problem log

One row per KPI scoring **below 100**. Sorted by **pts lost** descending.

```
pts_lost = (100 − S(kpi)) × kpi_weight_in_pillar × 0.20
```

| Column | Meaning |
|--------|---------|
| Problem | Plain English + actual vs target |
| Pillar | Infrastructure · Operations · Finance · Marketing · Sales |
| KPI | # from KPI table |
| KPI wt | Weight inside pillar (sums to 100% per pillar) |
| Pts lost | Drag on BHI (negative number) |

**June 2026 example**

| Problem | Pillar | KPI | KPI wt | Pts lost |
|---------|--------|-----|--------|----------|
| Answered phones 69% (target 90%) | Sales | 21 | 40% | −8.4 |
| CPL $142 (target ≤ $120) | Marketing | 15 | 35% | −6.4 |
| Speed to task 8 min (target <5) | Operations | 22 | 35% | −5.6 |
| Est. missed revenue $4.2k | Finance | 19 | 25% | −4.0 |
| New cases 9/12 | Finance | 02 | 35% | −3.5 |

Clear a row when KPI score returns to 100. Persist log in build (HubSpot note or sheet tab).

### Bands

| BHI | Band | Action |
|-----|------|--------|
| ≥ 85 | Healthy | Scale tests on winning channels only |
| 70–84 | Watch | Fix top problem-log row before adding spend |
| < 70 | At risk | Pause ad scale · intake + ops sprint |

### Overall health layout (build)

| Order | Block |
|-------|-------|
| 1 | **#19 alert banner** — est. missed revenue (full width, top) |
| 2 | BHI dial (score) + pillar scores table |
| 3 | Metric chips: #12 · #15 · #22 |
| 4 | #28 stat + #29 table |
| 5 | Case pipeline: #03 · avg closed time · #04 · #05 |
| Backend | Problem log — **not rendered** |

---

## Gilbert notes (build)

**Edit:** [`GILBERT-NOTES.md`](GILBERT-NOTES.md) — Box # · Location · `tipId` · Content. Wireframe copies into `GILBERT_NOTES` constant on sync.

Click **goose icon** → show note; click again or another icon → switch/dismiss. No “Gilbert” text labels on dashboard. Icon placements TBD by Kate.

| Box | Location | tipId |
|-----|----------|-------|
| 1 | Report header | `report-header` |
| 2 | Action items | `actions` |
| 3–16 | Overall health · BHI · pillars · problem log · #28–29 · case pipeline | see MD |
| 17–24 | Cockpit section + tiles #01–22 | `cockpit` · `cockpit-01` … |
| 25–28 | Lead · Marketing · Sales · Layout notes | `lead-data` · `marketing` · `sales` · `layout-notes` |

**Build:** Load from `GILBERT-NOTES.md` or JSON keyed by `tipId`. Portrait optional (project picker assets).

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
| Answered phones low | 21 < 90% | Casey/Romina schedule · routing review |
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

## Marketing investment model (dashboard sections)

**Wireframe:** Marketing Investment Model + Full Funnel Cycle (after Marketing Spend Efficiency).

### Budget → leads → revenue

```
platform_spend = target_leads × platform_CPL
agency_spend   = GGL_retainer + est_performance_bonus
total_marketing = platform_spend + agency_spend
projected_cases = target_leads × (KPI_02 ÷ KPI_01)
projected_revenue = projected_cases × avg_case_fee   # KPI #29 blend
marketing_ROI = (projected_revenue − total_marketing) ÷ total_marketing
```

**Payee split:** Platform invoices (Google + LSA) vs GGL retainer/bonuses per [`PERFORMANCE-PAYMENT-PLAN.md`](PERFORMANCE-PAYMENT-PLAN.md) §3 — bonuses are flat KPI tiers, **not** % of legal fees.

### ROI comparison (hire vs prior)

Compare locked monthly periods:

| Metric | Source |
|--------|--------|
| Platform spend | Google Ads + LSA billing exports |
| GGL spend | Retainer + bonus ledger |
| Leads | KPI #01 |
| Cases | KPI #02 |
| Est. case revenue | #02 × avg fee (#29) — **not** collected cash |
| All-in CPL | (platform + GGL) ÷ #01 |
| Revenue per $1 | est. case revenue ÷ total marketing |

**Baseline:** Prior period = platform-only month (e.g. May 2026). Current = GGL stewardship month with retainer on books.

### Full funnel cycle

```
$ in (platform + GGL) → leads (#01) → consults (HubSpot) → new cases (#02) → est. revenue (#29 × #02)
```

**Build stage 6 (future):** MyCase/QB fees **collected** — separates signed case value from cash collected.

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
| 2026-07-11 | BHI weighted formulas · problem log · health layout · cockpit linear gauges |
| 2026-07-11 | Half-moon gauges (0→target on arc) · GILBERT-NOTES.md |
