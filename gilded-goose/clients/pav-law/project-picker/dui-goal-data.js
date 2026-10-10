/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 20,
  jun: 5,
  jul: 2,
  aug: 0,
  sep: 1,
  target: 50,
  title: "# Auto Cases",
  label: "DUI",
  definition:
    "Client contacts with Created date in 2026 in the Auto stack: DUI practice-area rule, or Traffic tag with no DUI/DWAI matter. Chart = two buckets. DUI/DWAI = practice DUI rule. Traffic = all other Auto-stack rows. Source export as of 10/08/2026.",
  sourceFile:
    "Downloads/Contact_10-08-2026.csv · Ad Reports/exports/mycase/as-of-2026-09-23/auto-cases-ytd.csv",
  exportStrictCount: 20,
  exportNote:
    "Recount 10/08/2026 from Contact_10-08-2026.csv = DUI/DWAI 20 · Traffic 22 · Auto total 42 / 50 · pace 84%. Traffic bucket rolls Speeding 5 · Careless 2 · Reckless 1 · Other 14. Same DUI practice + Traffic-tag stack as prior lock.",
  updatedAt: "2026-10-08",
  notes: "Verified from Cases practice area + Case Type on Contact_10-08-2026.csv. Chart = DUI/DWAI + Traffic; total = sum; target line is annual auto goal. Last updated 10/08/2026.",
  /* Auto chart #03 · two buckets. Traffic = Speeding + Careless + Reckless + Other. */
  autoColumns: [
    { label: "DUI/DWAI", current: 20, vsTarget: true },
    { label: "Traffic", current: 22, vsTarget: false }
  ],
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
