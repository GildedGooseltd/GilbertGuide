/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 17,
  jun: 4,
  target: 50,
  title: "# Auto Cases",
  label: "DUI",
  definition:
    "Client contacts with Created date in 2026 whose Cases (practice area) includes a DUI/DWAI matter — tagged (DUI/DWI), or Criminal Defense with DUI/DWAI/DWI in the matter name. Excludes ancient-only case refs (e.g. 16T9820) and Alcohol-only Criminal Defense without DUI/DWAI. Source export as of 2026-07-25.",
  sourceFile:
    "Ad Reports/exports/mycase/as-of-2026-07-25/Contact_07-25-2026.csv",
  exportStrictCount: 16,
  exportNote:
    "Recount 2026-07-25 from Contact_07-25-2026.csv = 17 (16 with (DUI/DWI) tag + 1 DUI-named under Criminal Defense). Jun = 4 · Jul* = 1 through 2026-07-23. Excluded: Ezekiel Penny 16T9820 (ancient); Price Harpstreith Alcohol-only Criminal Defense. Traffic YTD still from verticals rollup.",
  updatedAt: "2026-07-25",
  notes: "Verified from Cases (practice area) on contact export. Chart = stacked auto case types; total = sum of stack; target line is annual auto goal. Last updated 2026-07-25 · file Contact_07-25-2026.csv.",
  /* Auto case-type columns on #03 chart. vsTarget: true = compare to annual DUI goal line. */
  autoColumns: [
    { label: "DUI", current: 17, vsTarget: true },
    { label: "Traffic", current: 6, vsTarget: false }
  ]
};
