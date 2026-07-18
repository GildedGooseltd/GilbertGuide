/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 15,
  target: 50,
  label: "Signed",
  title: "# DUIs Signed",
  definition:
    "Client contacts with Created date in 2026 whose Cases (practice area) includes a DUI/DWAI/Alcohol matter — tagged (DUI/DWI), or Criminal Defense mis-tagged with DUI/DWAI in the matter name. Excludes ancient-only case refs (e.g. 16T). Source export as of 2026-07-01.",
  sourceFile:
    "Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv",
  exportStrictCount: 11,
  exportNote:
    "Practice-area count = 15 (11 with (DUI/DWI) tag + 4 DUI-named under Criminal Defense). Case Type–only strict was 8. Jun = 3 of the 15.",
  updatedAt: "2026-07-17",
  notes: "Recalculated from practice area on request 2026-07-17."
};
