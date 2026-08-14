/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 17,
  jun: 3,
  jul: 2,
  aug: 0,
  target: 50,
  title: "# Auto Cases",
  label: "DUI",
  definition:
    "Client contacts with Created date in 2026 whose Cases (practice area) includes a DUI/DWAI matter — tagged (DUI/DWI), or Criminal Defense with DUI/DWAI/DWI in the matter name. Excludes ancient-only case refs (e.g. 16T9820) and Alcohol-only Criminal Defense without DUI/DWAI. Traffic stack = Client contacts with a (Traffic) practice-area tag and no DUI/DWAI matter. Source export as of 2026-08-12.",
  sourceFile:
    "Downloads/Contact_08-12-2026.csv · aggregates only in Ad Reports/exports/mycase/as-of-2026-08-12/",
  exportStrictCount: 16,
  exportNote:
    "Recount 2026-08-12 from Contact_08-12-2026.csv = DUI 17 · Jun 3 · Jul 2 · Aug* 0. Traffic (Traffic) tag no DUI = 19. Excluded ancient-only / Alcohol-only same rule as prior lock.",
  updatedAt: "2026-08-12",
  notes: "Verified from Cases (practice area) on contact export. Chart = stacked auto case types; total = sum of stack; target line is annual auto goal. Last updated 2026-08-12 · file Contact_08-12-2026.csv.",
  /* Auto case-type columns on #03 chart. vsTarget: true = compare to annual DUI goal line. */
  autoColumns: [
    { label: "DUI", current: 17, vsTarget: true },
    { label: "Traffic", current: 19, vsTarget: false }
  ]
};
