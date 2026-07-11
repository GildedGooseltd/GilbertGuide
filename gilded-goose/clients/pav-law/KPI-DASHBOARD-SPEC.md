# Pav Law — KPI dashboard spec (Gilbert A8)

**Gilbert:** A8 Lead & KPI Dashboard · A8M retainer  
**Setup:** [`pav-law-analytics/google-ads/GOOGLE-ADS-API-SETUP.md`](../../../pav-law-analytics/google-ads/GOOGLE-ADS-API-SETUP.md)

Refresh **monthly**.

**Edit KPIs:** [`kpi-list.md`](kpi-list.md) — source of truth.  
**Cockpit tiles:** kpi-list § Desktop cockpit (IDs 01, 02, 06, 16, 21, 27, 30, 33).

---

## Tiered bonuses

**Rules:** Flat $ only · highest tier fully met wins · disputes within 5 business days · fill **$[___]** before Andrew sign-off · [INCENTIVE-COMP-PLAN.md](../../../ntguilt/operations/INCENTIVE-COMP-PLAN.md)

### Romina

| Tier | Gates (all required) | Bonus |
|------|----------------------|-------|
| **T1** | 02 ≥ **[___]** · 31 ≥ **90%** · 34 = **0** | **$[___]** |
| **T2** | 02 ≥ **[___]** · 33 **< 5 min** · 27 **≤ 25%** · 31 **100%** | **$[___]** |
| **T3** | T2 · 02 ≥ **[___]** · 05 up MoM · 35 **100%** | **$[___]** |

### Casey

| Tier | Gates (all required) | Bonus |
|------|----------------------|-------|
| **T1** | 29 **< 10%** · 31 ≥ **90%** · 39 **3/4** weeks | **$[___]** |
| **T2** | 28 **≤ 25%** · 32 **≥ 75%** · 29 **< 5%** · 31 **100%** | **$[___]** |
| **T3** | T2 · 28 **≤ 20%** · 29 **0%** · 30 **≥ 45%** | **$[___]** |

### Gabriel

| Tier | Gates (all required) | Bonus |
|------|----------------------|-------|
| **T1** | 36 ≥ **[___]** · 37 **≥ 15%** | **$[___]** |
| **T2** | 36 ≥ **[___]** · 26 ≥ **[___]** · 37 **≥ 15%** | **$[___]** |
| **T3** | T2 · 26 ≥ **[___]** · 38 **100%** | **$[___]** |

### Jack

| Tier | Gates (all required) | Bonus |
|------|----------------------|-------|
| **T1** | 40 **3/4** weeks · 41 **< 10**/wk avg | **$[___]** |
| **T2** | 40 **4/4** · 41 **< 5** | **$[___]** |
| **T3** | T2 · 40 **100%** match · 41 **0** month-end | **$[___]** |

### Kate (vendor · Track B)

Highest tier per row · monthly cap **$[___]** · [PERFORMANCE-PAYMENT-PLAN.md](PERFORMANCE-PAYMENT-PLAN.md)

| ID | KPI # | T1 | T2 | T3 | Bonus T1 / T2 / T3 |
|----|-------|----|----|-----|-------------------|
| **P1** | 01, 07, 21 | ≥ **[___]** | ≥ **[___]** | ≥ **[___]** | **$[___]** / **$[___]** / **$[___]** |
| **P2** | 02 | ≥ **[___]** | ≥ **[___]** | ≥ **[___]** | **$[___]** / **$[___]** / **$[___]** |
| **P3** | 21 | ≤ **$[___]** | ≤ 90% target | ≤ 80% target | **$[___]** / **$[___]** / **$[___]** |
| **P4** | 22 | Phase met | + engagement | + 2nd send | **$[___]** / phase |
| **P5** | 43 | On time | + weekly 4/4 | + API reconciled | **$[___]** / **$[___]** / **$[___]** |
| **P6** | 28 | ≤ 30% | ≤ 25% | ≤ 20% | **$[___]** / **$[___]** / **$[___]** |
| **P7** | 29, 34 | <10% · ≤3 open | <5% · 0 open | 0% · 0 open | **$[___]** / **$[___]** / **$[___]** |

Optional ads add-on (inside cap): **T1** 16 **< $120** or 20 cut MoM · **T2** 16 **< $100** + 19 up MoM · **T3** 16 **< $80** + 21 at T3 → **$[___]** each.

### Firm pool (quarterly · optional)

Only if Romina + Casey ≥ T1. Not tied to attorney fees.

| Tier | Gates | Pool |
|------|-------|------|
| **T1** | 01 up QoQ · 02 ≥ **[___]**/mo avg | **$[___]** — Romina 40% · Casey 25% · Gabriel 25% · Jack 10% |
| **T2** | T1 + 05 ≥ **[___]%** | **$[___]** — same split |
| **T3** | T2 + 03 ≥ **[___]** avg active cases | **$[___]** — same split |

---

## Export (1st of month)

1. Google Ads API → `Ad Reports/exports/api/YYYY-MM/`
2. LSA inbox CSV → `lsa-inbox/`
3. HubSpot contacts export
4. MyCase — new, active, closed matters
5. Scorecard + tier calc due with KPI **43**
