/**
 * Expected KPI / picker values to validate against local exports.
 * Update when kpi-report.js DATA or impact-estimates-data.mjs changes.
 * No client PII — numbers only.
 */
export const KPI_EXPECTED = {
  asOf: "2026-07-11",
  periodLabel: "June 2026 (picker) · Jun 11–Jul 10 (Ads export)",
  kpis: {
    totalLeads: 124,
    searchCallsChannel: 54,
    lsaInboxChannel: 41,
    hubspotFormsChannel: 29,
    militaryCallsMay: 36,
    militaryCostPerCallUi: 41,
    militaryCostPerCallReviewLow: 59,
    militaryCostPerCallReviewHigh: 72,
    cpl: 142,
    newCases: 9,
    answerRatePct: 69,
    avgCaseFee: 5587
  },
  campaignsJul: {
    "Military | Search | Calls": { spend: 3982.68, clicks: 330 },
    "NTGUILT | Search | Drivers": { spend: 1924.09, clicks: 282 },
    "Core | DV | Search | Calls": { spend: 179.46, clicks: 16 }
  },
  lsaMonthly: {
    "May 2026": { leads: 72, charged: 27 },
    "Jun 2026": { leads: 83, charged: 39 },
    "Jul 2026": { leadsPartial: 26, chargedPartial: 6 }
  },
  impactRetainer: {
    leadsImpacted: 36,
    leadsConnected: 25,
    clientsRetained: 1.8
  }
};
