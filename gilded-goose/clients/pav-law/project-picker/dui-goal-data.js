/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 18,
  target: 50,
  label: "Signed",
  title: "# DUIs Signed",
  definition:
    "Count MyCase matters where Case Type is DUI, DWAI, Alcohol, or DUI Pre-file, and Created date falls in the goal year. Cross-check Cases (practice area) tagged (DUI/DWI) when Case Type is blank.",
  sourceFile:
    "Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv",
  exportStrictCount: 8,
  exportNote:
    "Strict Case Type filter on the Jul 1 contact export yields 8 rows for 2026. Dashboard current (18) matches feeByPractice DUI/DWAI YTD — treat as override until a clean MyCase signed-case export is filed.",
  updatedAt: "2026-07-16",
  notes: ""
};
