/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 22,
  jun: 5,
  jul: 2,
  aug: 0,
  sep: 1,
  target: 50,
  title: "# Auto Cases",
  label: "DUI",
  definition:
    "Client contacts with Created date in 2026 in the Auto stack: DUI practice-area rule, or Traffic tag with no DUI/DWAI matter. Chart = two buckets. DUI/DWAI = practice DUI rule. Traffic = all other Auto-stack rows. Source export as of 11/19/2026.",
  sourceFile:
    "Downloads/Contact_11-19-2026(1).csv",
  exportStrictCount: 22,
  exportNote:
    "Recheck 11/19/2026 from Contact_11-19-2026(1).csv = DUI/DWAI 22, Traffic 33, Auto total 55 / 50, pace 110%. November added 2 DUI/DWAI and 9 Traffic Client creates. Traffic = practice-area (Traffic) tag without DUI/DWAI.",
  updatedAt: "2026-11-19",
  notes: "Verified from Cases practice area (Traffic) tag plus DUI/DWAI practice rule on Contact_11-19-2026(1).csv. Chart = DUI/DWAI plus Traffic. Total = sum. Target line is the annual auto goal. Recheck 11/19/2026.",
  /* Auto chart #03 · two buckets. Traffic = Speeding + Careless + Reckless + Other. */
  autoColumns: [
    { label: "DUI/DWAI", current: 22, vsTarget: true },
    { label: "Traffic", current: 33, vsTarget: false }
  ],
  /* Trust balance on the chart cohort. Contact_11-19-2026(1).csv. Creates through 11/19/2026. */
  trustDui: 62070,
  trustTraffic: 50050,
  trustAsOf: "2026-11-19",
  /* Est. revenue · case-num cross-ref Contact_09-23 auto stack × Case_balance/list/revenue · 09/24/2026
     19/42 matched · fill unknowns with kind median DUI $5,500 · Traffic $1,500. Aggregates only. */
  estRevenue: {
    ytd: 150300,
    goal: 170200,
    duiYtd: 110500,
    trafficYtd: 39800,
    matchedN: 19,
    totalN: 42,
    duiMedian: 5500,
    trafficMedian: 1500,
    asOf: "2026-09-24",
    note: "19/42 case-number fee matches + median fill · not Contact fee fields"
  }
};
