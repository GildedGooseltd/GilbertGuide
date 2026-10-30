# Guide data refresh · standard process

Kate lock 10/08/2026. Any new export that maps to any Guide graph, tile, or table gets audited and refreshed. Not Lead Source only. Aggregates only. No person fields in the repo.

Rule: [`.cursor/rules/guide-data-refresh-audit.mdc`](../../../.cursor/rules/guide-data-refresh-audit.mdc)

---

## Same-turn checklist

1. List newest matching files in `~/Downloads` by mtime. Open twins. Confirm in-file date range.
2. For each file: File · Window · Guide surfaces · DATA fields · Already wired? · Action.
3. Patch every surface that shares that aggregate. Update `tileAsOf` / source notes. Bump `RENDER_VER` + `kpi-report.js?v=` in `index.html` and `metrics.html`.
4. Update sibling docs when the same numbers are stated there.
5. Gaps only in chat + [`PAID-MEDIA-STILL-NEED.md`](PAID-MEDIA-STILL-NEED.md). Never on Guide KPIs/Data.

---

## Source → Guide matrix

| Source family | Newest name pattern | Primary Guide surfaces |
|---|---|---|
| Contact | `Contact_MM-DD-YYYY.csv` | New cases tile · practice mix · cases MoM · Lead Source tags · Confirmed when tagged · casesLeadsSpend.cases |
| Ledger Credits | `ledger_account_activity_report*.csv` | Revenue · cash pace · Trust Credits charts · cashCollected2026Ytd |
| Trust summary | `Trust_account_summary_*.csv` | Trust snapshot · Lead Source Trust $ · trust Clients signal |
| Case balance | `Case_balance_summary_*.csv` | Fee / Clients w/$ · Yelp and LSA fee packs · avg case value inputs |
| Call details | `Call details (N).csv` | Search phones = Search leads · Search $/phone denominator · Answer Rate Search · Sales Funnel Search · digital click→call · Click → call monitor · phoneByMonth · channelMonths.search · clickCallByCampaign phones |
| LSA inbox | `leads-inbox (N).csv` | LSA leads · charge rate · Answer Rate LSA · Sales Funnel LSA · lsaEfficiency · channelMonths.lsa · Lead Cost LSA uses charged when on file |
| LSA activities | `account_activities_YYYYMM*.csv` | LSA Home Services media · casesLeadsSpend.lsaSpend · Lead Cost LSA numerator only · never Search $/phone |
| Search activities | `account_activities_YYYYMM*.csv` HS Search lines | Search $/phone numerator · funnelAds.searchSpendLock · channelMonths.searchSpend · same window as Call details |
| Search / Billing | Campaign calendar report · Billing activity | CTR · impressions · funnelAds clicks/Impr · not All-time for Search $/phone |
| Search keyword / Ad / AG | keyword · Ad · Ad group reports | Editor packs · quality diagnosis · not always tile numbers |
| HubSpot forms | form-submit exports | HubSpot tile · funnel forms · channelMonths.hubspot · not CRM Contacts export |
| Yelp ads / inbox | `Yelp Ad Analytics*.csv` · screenshots | yelpBaseline · Reviews · Lead Cost Yelp · directory Yelp card |
| Justia Profile Stats | pull / screenshot pack | justiaBaseline · directory Justia · Lead Cost Justia |
| FindLaw order / Lead-Source | Order PDF · `FindLaw-Lead-Source-*.csv` · matches | findlawPackage · directory FindLaw · Confirmed |
| LSA Lead-Source join | `LSA-Lead-Source-*.csv` | lsaMatchedCases · Lead Source LSA charts · Confirmed · Clients w/$ when fee-joined |
| PPC Lead-Source join | `PPC-Lead-Source-*.csv` | leadSourceConfirmed.ppc · PPC Matches · future PPC month card |
| Leads referral | `Leads_referral_*.csv` | Referral source may fill a blank Contact Lead Source. When both are filled, keep Contact Lead Source. Kate 10/18/2026 |
| Change history | Change history report | Ads post verify · not KPI tiles |

---

## Surfaces that must stay in sync

When an aggregate moves, update every reader of that aggregate across tabs. Examples:

| Aggregate changes | Also refresh |
|---|---|
| Search phones from Call details | Search $/phone · phoneByMonth · Answer Rate · Sales Funnel Search · digital click→call · Click → call monitor · Lead Cost PPC · channelMonths.search · clickCallByCampaign · see `.cursor/rules/pav-search-cost-per-phone-tile.mdc` |
| Search clicks / Impr from Campaign | funnelAds · digital CTR · click→call · Click → call monitor · clickCallByCampaign clicks |
| LSA leads or spend | lsaEfficiency · channelMonths · casesLeadsSpend · Lead Cost LSA · LSA charge rate · Sales Funnel LSA |
| New Client creates | New cases tile · practice mix · cases MoM · casesLeadsSpend.cases · media $/Client · cash pace case leg |
| Ledger Credits | Revenue tile · cash pace · cashCollected charts · ROAS numerator when Trust Credits |
| Channel Confirmed / Matches | Channel comparison · Channel rollup · month cards · DIRECTORY-LEADS-ANALYSIS when defs change |
| Yelp spend or signed | yelpBaseline · Lead Cost Yelp · Leadsource Yelp · Reviews if that pack moved |

No orphan one-table updates. No hardcoded `0` Matches while Confirmed > 0 on another card.

---

## Definitions

| Label | Meaning |
|---|---|
| Confirmed Clients / matched clients | MyCase match on Lead-Source join or Contact Lead Source tag. Prefer Trust balance when on the join. **Ignore Contact group** · Kate 10/08/2026 |
| Lead Source vs referral | Referral source fills a blank only. Existing Contact Lead Source wins on overlap. Kate 10/18/2026. 2026 creates are added beside the existing packs: LSA tags 64, Client Referral 5, Professional Referral 3. PPC Search calls and the 14 phone matches stay. Yelp contacts stay. Do not replace those with the tag counts. |
| Clients w/$ | Contracted fee on file |
| Matches | MyCase contact matches on the join |
| Cost/Contact | Window spend ÷ contacts or leads for that channel |
| New cases tiles | Contact group Client by Created date · separate from Lead Source Confirmed until Kate changes it |
| Direct contacts | Locked channel stack in sources · Search + LSA + HubSpot + Yelp + Justia + FindLaw when on file |

---

## Month tiles

Follow pav-kpi-month-update: period label matches values · green when filled · red for `—` · incomplete sources named · never prior complete month under a new month label.

---

## Audit log

| Date | Note |
|---|---|
| 10/29/2026 | ledger (17) Oct* Credits $100,220 through 10/29. 88 credit rows. W1 $24,200, W2 $17,000, W3 $31,600, W4 $27,420. Jan–Sep credits unchanged. YTD $919,126. RENDER_VER 20261029-cash. |
| 10/29/2026 | Trust_account_summary_10-29. Open trust 383, balance $1,784,204. Lifetime credits on that file rose $14,700 since the 10/28 snapshot. No new ledger activity export. October revenue stays $81,470 through 10/26 from ledger (16). RENDER_VER 20261029-trust. |
| 10/29/2026 | September marked complete. Lead Calls goal is the last 3 complete months: Jul 281, Aug 101, Sep 97, round to 160. October stays partial. RENDER_VER 20261029-sep. |
| 10/29/2026 | Goals. Targets unchanged: CTR at least 4%, click to call at least 15%, Search cost per phone at most $175, avg cost per case at most $650, Lead Calls at least 203, new cases at least 23 from the $100k cash formula, auto 50. October actuals: CTR 7.3% hit, click to call 2.3% miss, cost per case about $539 hit, Search cost per phone about $485 miss, Lead Calls 92 miss, new cases 20 miss, auto 43 of 50. RENDER_VER 20261029-goals. |
| 10/29/2026 | DL later. Contact_10-29 Oct* Client Created 20. Mix DV 4, Traffic/DUI 6, PPO 1, Other 9. Auto YTD still 43. Case_balance_10-29 contracted 18 of 20. Trust open on that cohort 13. Cost per case about $539. Campaign (59) Search account Impr 9,557, clicks 700, CTR 7.32%. NTGUILT clicks 174. Phones, Search spend, LSA spend, and cash unchanged. RENDER_VER 20261029-cases20. |
| 10/29/2026 | DL. leads-inbox (29) Oct* 55 received, 15 charged, 38 not charged, 1 in review, 1 credited. Lead Calls 92. Campaign (58) Oct 1 through Oct 29 Search account Impr 9,549, clicks 699, CTR 7.32%. Click to call 16/699 is about 2.3%. Enabled HS: Military 91 clicks, HS: NTGUILT 173 clicks. Search phones stay Call details (23) 16. Search and LSA spend stay activities (3). Cash stays ledger (15) $81,470. RENDER_VER 20261029-lsa55. |
| 10/28/2026 | DL · Contact_10-28 Oct* Client Created 17 · Auto YTD DUI 20 + Traffic tag 23 = 43 · Case_balance contracted 15/17 · Trust 10/28 380 open · $1,769,504 · Call details (23) Search 16 · Lead Calls 63 · Search $/phone $7,753.12÷16≈$485 · $/case ≈$634 · click→call 16/603≈2.7%. Cash still ledger (15) $81,470. No new activities. Call details (22) NTGUILT-only skipped. Campaign (55) Impr held. RENDER_VER 20261028-mycase. |
| 10/27/2026 | DL · leads-inbox (28) Oct* 40 received · 12 charged · Lead Calls 61. Campaign (56) Sep 27–Oct 26 skipped for Oct calendar Impr/CTR. ledger (16) identical to (15). No new Call details · Contact · activities. Spend/cash/$/phone held. RENDER_VER 20261027-lsa-inbox. |
| 10/26/2026 | DL $$ · ledger (15) Oct* Credits $81,470 through 10/26 · W1 $24,200 · W2 $17,000 · W3 $31,600 · W4 $8,670. Trust 10/26 · 379 · $1,765,454. Search $/phone activities (3) $7,753.12 ÷ Call details (21) 14 ≈ $554. LSA $2,096.03 · inbox (27) 31/9. Campaign (55) Impr 8,117 · clicks 603. Lead Calls 52. Cases still Contact_10-17 = 9. No new Case_balance. RENDER_VER 20261026-ledger-trust. |
| 10/21/2026 | DL financial · ledger (14) Oct* Credits $72,800 through 10/21 · W1 $24,200 · W2 $17,000 · W3 $31,600 · W4 $0. Trust snapshot 10/21 · 377 with balance · $1,756,784. Cases still Contact_10-17 = 9. No new Case_balance. RENDER_VER 20261021-ledger-oct. |
| 10/18/2026 | HubSpot first-conversion chart. Oct forms 3. May 7, Jun 8, Jul 6, Aug 0, Sep 4 already matched. Lead Calls 36. Websites bar on the monthly graph uses that 3. Zip still has no date column. RENDER_VER 20261018-hsforms3. |
| 10/18/2026 | Evening DL · Campaign (50) Oct 1–17 live HS Impr 7,113 · clicks 539 · Cost $6,543.42. Call details (20) All-time is Military-only · skipped. Phones stay Call details (19) = 14. Search $/phone stays activities $6,533.46 ÷ 14 ≈ $467. Lead Calls 34 · cases 9 · LSA 19/5 charged unchanged. |
| 10/18/2026 | Tile corner audit · green=fresh · red=stale · yellow WIP=missing. Recheck Contact Auto 20+22=42 · Oct clients 9 · CD19 phones 14. WIP Lead Calls HubSpot Oct forms. Red Yelp Reviews PDF 10/01 only. RENDER_VER 20261018-tileaudit. |
| 10/18/2026 | Call count ignores the 60-second rule. Any Call details row counts. Received and missed. |
| 10/17/2026 | Evening DL · Contact_10-17 Oct cases 7→9 · Trust snapshot 10/17 · Case_balance · Swag 41% · ledger (12) Oct* $58,050 · then Yelp Oct contacts 0 · Lead Calls 34 · LSA Lead Cost ÷ charged 5 not inbox 19. |
| 10/17/2026 | Morning DL · Call details (19) Oct Search 14 · leads-inbox (26) LSA 19 · account_activities_202610 (2) Search $6,533.46 · LSA $1,339.56 · Time_series Oct Impr 7,023 · Lead Calls 49 · Campaign (48) All-time skipped. |
| 10/09/2026 | DL refresh · Call details (17) Oct Search 8 · Contact_10-09 Oct cases 7 · Lead Calls 26. LSA inbox / Billing / ledger / Campaign calendar Impr unchanged. Campaign (47) All-time skipped for Oct Impr. |
| 10/08/2026 | Process locked Guide-wide. Lead Source Confirmed pack partial. Full Can update / Blocked list in that day’s chat audit. |
