# Cash Projection From Case Intake — Pav Law (2026)

**Model type:** intake-driven *incremental* cash model. It projects cash arriving from cases signed in **2026 only** (Jan–Jun cohorts, plus a labeled Jul estimate). It does **not** forecast total firm cash — collections from pre-2026 cases are excluded (see Reality Check).

---

## Headline numbers

- **Collectible per case** = $5,587 avg fee × 80% payment rate = **$4,469.60**
- **Total billed, 2026 cohorts (Jan–Jun):** $636,918 → **collectible $509,534**
- **Steady-state monthly cash-in once intake holds:**
  - At Jun level (34/mo): **~$151,966/mo**
  - At recent avg (24/mo): **~$107,270/mo**
  - At H1 avg (19/mo): **~$84,922/mo**

---

## Assumptions (stated exactly)

1. **Fee per case:** $5,587 (firm-wide MyCase client mean, KPI #28). Used as the headline base for all cohorts.
2. **Payment rate:** 80% of billed fees collected → **collectible = $4,469.60/case**.
3. **Collection curve** (share of a cohort's *collectible* total arriving each month after signing; month 0 = signing/deposit month):

| Month after signing | 0 | 1 | 2 | 3 | 4 | 5 | 6 | Total |
|---|---|---|---|---|---|---|---|---|
| % collected | 40% | 20% | 15% | 10% | 7% | 5% | 3% | 100% |
| Cumulative | 40% | 60% | 75% | **85%** | 92% | 97% | 100% | — |

   - **85% collected by end of month 3** ("most within 3"). **100% by month 6** ("fully paid within 6"). Sums to 100%.
   - Per-case dollar amounts: m0 $1,787.84 · m1 $893.92 · m2 $670.44 · m3 $446.96 · m4 $312.87 · m5 $223.48 · m6 $134.09.

---

## 1. Per-cohort: billed vs collectible

| Signing month | New cases | Billed ($5,587/case) | Collectible (×0.80) |
|---|---|---|---|
| Jan | 12 | $67,044 | $53,635 |
| Feb | 14 | $78,218 | $62,574 |
| Mar | 17 | $94,979 | $75,983 |
| Apr | 15 | $83,805 | $67,044 |
| May | 22 | $122,914 | $98,331 |
| Jun | 34 | $189,958 | $151,966 |
| **Jan–Jun total** | **114** | **$636,918** | **$509,534** |
| Jul* (est. @ 34) | 34* | $189,958* | $151,966* |

\* **Jul is incomplete.** Dashboard shows Jul* (57 leads, cases not closed out). The 34-case Jul figure is a **projection at Jun run-rate**, not actual signed cases.

---

## 2. Cash-in by calendar month (2026-signed cohorts only)

Each cohort's collectible is spread across the curve above, then summed down each calendar column. **Jan–Jun signed cohorts only** (no Jul+ intake assumed here). Months Aug–Dec below are the *tail* of Jan–Jun cohorts still paying off.

| Cash arrives | Projected cash-in | Which cohorts are paying |
|---|---|---|
| Jan | $21,454 | Jan(m0) |
| Feb | $35,757 | Jan(m1), Feb(m0) |
| Mar | $50,953 | Jan–Mar |
| Apr | $56,764 | Jan–Apr |
| May | $74,151 | Jan–May |
| Jun | $105,170 | Jan–Jun (all six cohorts active) |
| Jul | $61,904 | Jan(m6)…Jun(m1) tails |
| Aug | $42,998 | Feb(m6)…Jun(m2) tails |
| Sep | $27,712 | Mar(m6)…Jun(m3) tails |
| Oct | $17,566 | Apr(m6)…Jun(m4) tails |
| Nov | $10,548 | May(m6), Jun(m5) tails |
| Dec | $4,559 | Jun(m6) tail |
| **Total** | **$509,534** | ties to collectible total |

> Jul–Dec here reflect **only** the residual payments from Jan–Jun cases. Real Jul–Dec cash will be higher once new (Jul+) intake is added — see Section 3.

**Cohort spread detail** (rows = cohort, columns = calendar month it lands in):

| Cohort | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Jan (53,635) | 21,454 | 10,727 | 8,045 | 5,364 | 3,754 | 2,682 | 1,609 | | | | | |
| Feb (62,574) | | 25,030 | 12,515 | 9,386 | 6,257 | 4,380 | 3,129 | 1,877 | | | | |
| Mar (75,983) | | | 30,393 | 15,197 | 11,397 | 7,598 | 5,319 | 3,799 | 2,279 | | | |
| Apr (67,044) | | | | 26,818 | 13,409 | 10,057 | 6,704 | 4,693 | 3,352 | 2,011 | | |
| May (98,331) | | | | | 39,332 | 19,666 | 14,750 | 9,833 | 6,883 | 4,917 | 2,950 | |
| Jun (151,966) | | | | | | 60,787 | 30,393 | 22,795 | 15,197 | 10,638 | 7,598 | 4,559 |
| **Column sum** | **21,454** | **35,757** | **50,953** | **56,764** | **74,151** | **105,170** | **61,904** | **42,998** | **27,712** | **17,566** | **10,548** | **4,559** |

---

## 3. Run-rate / forward projection

Once intake holds steady at *N* cases/month, monthly cash-in converges to **N × $4,469.60** (one full cohort's collectible completes per month). Ramp to steady state takes ~6 months as the curve fills in.

**Intake scenarios:**
- **(a) Jun level — 34/mo:** steady-state **$151,966/mo**
- **(b) Recent avg — 24/mo** (≈ Apr–Jun mean of 15/22/34): steady-state **$107,270/mo**
- (ref) H1 2026 avg — 19/mo: steady-state $84,922/mo

**Forward cash-in** = Jan–Jun tails (from Section 2) + new Jul-onward cohorts at run-rate.

| Cash arrives | Scenario A: 34/mo | Scenario B: 24/mo |
|---|---|---|
| Jul (est) | $122,691 | $104,812 |
| Aug | $134,177 | $107,360 |
| Sep | $141,686 | $108,164 |
| Oct | $146,737 | $108,745 |
| Nov | $150,357 | $109,237 |
| Dec | $151,966 | $108,611 |

- **Scenario A** reaches the $151,966/mo steady state by ~Dec.
- **Scenario B** plateaus near $107–109k/mo.
- **Jun's spike to 34 is the swing factor.** If it was a one-off (recent avg ~24 is more defensible), plan around Scenario B; if 34 holds, Scenario A.

---

## 4. Reality check vs actual 2026 cash collected

Actual ledger credits vs the model (Jan–Jun cohorts only). The model **under-counts** because actual cash includes collections from **prior-month and prior-year** cases the model doesn't cover.

| Month | Model (2026 cohorts) | Actual (ledger credits) | Gap = pre-2026 / prior cash |
|---|---|---|---|
| Jan | $21,454 | $57,925 | $36,471 |
| Feb | $35,757 | $83,950 | $48,193 |
| Mar | $50,953 | $80,500 | $29,547 |
| Apr | $56,764 | $70,026 | $13,262 |
| May | $74,151 | $92,140 | $17,989 |
| Jun | $105,170 | $103,485 | –$1,685 |
| Jul* (partial) | $61,904 | $44,950* | — |

- **Model < actual** every full month Jan–May → expected; the gap is legacy cash (cases signed before 2026 or in-progress carryover).
- **Jun ~ matches** (model slightly over by ~$1.7k), which is coincidental: the large Jun cohort's month-0 deposits happen to fill the same window.
- **Jul is partial in both.** Model Jul ($61,904) covers only Jan–Jun tails and exceeds the *partial* actual ($44,950) simply because the month isn't closed. Do not read this as the model over-projecting.
- **Takeaway:** treat this model as **incremental cash from new 2026 intake**, useful for "what does signing N cases add to future cash." For a full cash forecast, add a legacy-cash baseline (~$15k–$48k/mo early 2026, trending down as old cases close).

---

## Rounding note
All table figures rounded to whole dollars. Per-case and per-month math uses exact values ($4,469.60/case); column and total rounding may differ by ±$1–2.
