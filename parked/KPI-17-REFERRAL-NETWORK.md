# Parked — #17 Total Referral Network

Removed from: KPIs tab · Reputation section · 07/15/2026  
Data tab: placeholder donut was live 07/16/2026 · staged off Data again 09/10/2026  
UI: `totalReferralNetworkPanelHtml()` in `kpi-report.js` · still in `KPI_REPORT.parked`  
Live data object: `DATA.referrals` — fill when Referral tracking wires  
Restore: put `${chartPairGridHtml(totalReferralNetworkPanelHtml())}` back on Data, or call via `KPI_REPORT.parked.totalReferralNetworkPanelHtml()`

GBP is a lead source. Not listed here. Referral channels only.

## Snapshot when staged off Data · 09/10/2026

| Channel | Referrers | Status | Verified |
| ------- | --------- | ------ | -------- |
| Past-client program | — | building | no |
| Friend / family | — | not wired | no |
| Attorney cross-referral | — | not wired | no |
| Yelp | 9 | active | yes |
| Nextdoor | — | not on | no |

Title on chart was Referral Network Activity. Presence pie showed Listed / Unlisted from channel status.

## Tile layout (saved)

- Chart title: Referral Network Activity
- Donut: presence pie from channel `status` (active / building / outdated / not on / not wired)
- Table columns: Channel · Referrers · Change

## Related

- Project: Referral Client Referral Program · DigProf KPI link `#17` still valid for planning
- Do not mark verified until tracking is wired
