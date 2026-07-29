# Data validation (local aggregates only)

**Generated:** 2026-07-16 · **Batch:** `2026-07-11` · **Prior:** `2026-05-30`
**Exports path:** `Ad Reports/exports/` (local — not deployed to GitHub Pages)

> No phone numbers, names, or emails in this file. Re-run: `npm run validate-data`

| Area | Check | Status | Detail |
|------|-------|--------|--------|
| Google Ads (current) | Export file | ✅ | Campaign report (15).csv · June 11, 2026 - July 10, 2026 |
| Google Ads (current) | Phone calls column | ⬜ | Missing — re-export with Phone calls (see DATA-EXPORT-CLICKPATHS.md) |
| Google Ads (current) | Military  ·  Search  ·  Calls spend | ✅ | File $3982.68 vs expected $3982.68 |
| Google Ads (current) | Military  ·  Search  ·  Calls clicks | ✅ | File 330 vs expected 330 |
| Google Ads (current) | NTGUILT  ·  Search  ·  Drivers spend | ✅ | File $1924.09 vs expected $1924.09 |
| Google Ads (current) | NTGUILT  ·  Search  ·  Drivers clicks | ✅ | File 282 vs expected 282 |
| Google Ads (current) | Core  ·  DV  ·  Search  ·  Calls spend | ✅ | File $179.46 vs expected $179.46 |
| Google Ads (current) | Core  ·  DV  ·  Search  ·  Calls clicks | ✅ | File 16 vs expected 16 |
| KPI #12 | Military cost/call (from file) | ⬜ | Cannot compute — spend $3983 but no phone calls in export |
| Google Ads (prior May) | Military phone calls | ✅ | File 36 vs picker baseline 36 · May 3, 2026 - May 30, 2026 |
| Google Ads (prior May) | Military cost/call | ✅ | ~$67/call from file ($2421 / 36 calls) |
| LSA inbox | Total rows (aggregate) | ✅ | 181 leads in file (phones not written to this report) |
| LSA inbox | May 2026 lead count | ✅ | File 72 vs PERFORMANCE-REVIEW 72 |
| LSA inbox | May 2026 charged | ✅ | File 27 vs PERFORMANCE-REVIEW 27 |
| LSA inbox | Jun 2026 lead count | ✅ | File 83 vs PERFORMANCE-REVIEW 83 |
| LSA inbox | Jun 2026 charged | ✅ | File 39 vs PERFORMANCE-REVIEW 39 |
| LSA inbox | Jul 2026 lead count | ✅ | File 26 vs PERFORMANCE-REVIEW 26 |
| LSA inbox | Jul 2026 charged | ✅ | File 6 vs PERFORMANCE-REVIEW 6 |
| KPI #01 | LSA channel | ✅ | May–Jun avg ~78 LSA leads/mo · Guide May corrected to inbox file 72 · Jun 83 |
| KPI #01 | Channel sum | ✅ | Search 54 + LSA 41 + HubSpot 29 = 124 vs total 124 |
| KPI #01 | HubSpot slice | ⬜ | 29 forms — no HubSpot export on file to verify |
| KPI #28 | Avg case fee | ✅ | $5,587 mean · Client n=142 · Contact_07-25-2026.csv · last updated 2026-07-25 (unchanged vs Jul-1) — cash-collected export still missing |
| KPI #02 | New cases | ✅ | Jun=36 · Jul*=23 · Jan–Jun=116 · mycase/as-of-2026-07-25/ · last updated 2026-07-25 |
| KPI #29 | Fee by practice | ✅ | 7 practice means n≥5 · fee-means-by-practice.csv · last updated 2026-07-25 |
| KPI #21 | Answer rate (69%) | ⬜ | Needs HubSpot call logs / VoIP — not in Ad Reports |
| KPI #22 | Speed to lead | ⬜ | Needs HubSpot workflow timestamps |

## Next exports

See [DATA-EXPORT-CLICKPATHS.md](DATA-EXPORT-CLICKPATHS.md).

## Client data policy

- Raw CSV/PDF exports stay in `Ad Reports/exports/` on your Mac only.
- `.gitignore` blocks CSV/XLSX/PDF from git push.
- Gilbert Guide deploy ships `project-picker/` only — not `Ad Reports/`.
