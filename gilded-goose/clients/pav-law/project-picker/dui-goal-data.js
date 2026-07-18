/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 15,
  jun: 3,
  target: 50,
  label: "Signed",
  title: "# DUIs Signed",
  definition:
    "Client contacts with Created date in 2026 whose Cases (practice area) includes a DUI/DWAI matter — tagged (DUI/DWI), or Criminal Defense with DUI/DWAI/DWI in the matter name. Excludes ancient-only case refs (e.g. 16T9820) and Alcohol-only Criminal Defense without DUI/DWAI. Source export as of 2026-07-01.",
  sourceFile:
    "Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv",
  exportStrictCount: 11,
  exportNote:
    "Practice-area recount 2026-07-17 = 15 (11 with (DUI/DWI) tag + 4 DUI-named under Criminal Defense). Jun = 3. Excluded: Ezekiel Penny 16T9820 (ancient); Price Harpstreith Alcohol-only Criminal Defense. Case Type–only = 9.",
  updatedAt: "2026-07-17",
  notes: "Verified from Cases (practice area) on contact export."
};
