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
| Call details | `Call details (N).csv` | Search phones · Answer Rate Search · Sales Funnel Search · digital click→call · phoneByMonth · channelMonths.search |
| LSA inbox | `leads-inbox (N).csv` | LSA leads · charge rate · Answer Rate LSA · Sales Funnel LSA · lsaEfficiency · channelMonths.lsa |
| LSA activities | `account_activities_YYYYMM*.csv` | LSA media spend · LSA Cost tiles · casesLeadsSpend.lsaSpend · Lead Cost LSA |
| Search / Billing | Campaign report · Billing activity | Search spend · CTR · impressions · funnelAds · digital $/phone · channelMonths.searchSpend |
| Search keyword / Ad / AG | keyword · Ad · Ad group reports | Editor packs · quality diagnosis · not always tile numbers |
| HubSpot forms | form-submit exports | HubSpot tile · funnel forms · channelMonths.hubspot · not CRM Contacts export |
| Yelp ads / inbox | `Yelp Ad Analytics*.csv` · screenshots | yelpBaseline · Reviews · Lead Cost Yelp · directory Yelp card |
| Justia Profile Stats | pull / screenshot pack | justiaBaseline · directory Justia · Lead Cost Justia |
| FindLaw order / Lead-Source | Order PDF · `FindLaw-Lead-Source-*.csv` · matches | findlawPackage · directory FindLaw · Confirmed |
| LSA Lead-Source join | `LSA-Lead-Source-*.csv` | lsaMatchedCases · Lead Source LSA charts · Confirmed · Clients w/$ when fee-joined |
| PPC Lead-Source join | `PPC-Lead-Source-*.csv` | leadSourceConfirmed.ppc · PPC Matches · future PPC month card |
| Leads referral | `Leads_referral_*.csv` | Parallel referral mix · wire only as that story · not Contact Lead Source |
| Change history | Change history report | Ads post verify · not KPI tiles |

---

## Surfaces that must stay in sync

When an aggregate moves, update every reader of that aggregate across tabs. Examples:

| Aggregate changes | Also refresh |
|---|---|
| Search phones from Call details | phoneByMonth · Answer Rate · Sales Funnel Search · digital click→call · Lead Cost Digital when phones are the unit · channelMonths.search |
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
| 10/08/2026 | Process locked Guide-wide. Lead Source Confirmed pack partial. Full Can update / Blocked list in that day’s chat audit. |
