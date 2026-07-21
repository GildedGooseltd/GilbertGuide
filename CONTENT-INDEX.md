# Pav Law Cockpit — content index

**Every place user-visible text comes from.**  
Layout/colors → [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md) · Project writing rules → [CONTENT-EDIT.md](CONTENT-EDIT.md)

---

## Start here


| Task                                                 | Open first                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Change a project title, fee, description, blockers   | `content/projects/{ID}.md` + row in `content/INDEX.md`                              |
| Change Recommendations tab copy                      | `content/recommendations.md` → `npm run build`                                      |
| Change Gilbert’s name, greeting, default package     | `content/settings.md`                                                               |
| Change retainer card                                 | `content/retainer.md`                                                               |
| Change tab labels, confirm intro, thank-you headline | `index.html` (search the visible phrase)                                            |
| Change “why this combination” logic text             | `app.js` → `OMNI_CHANNEL_WHY`, `buildRecommendation()`                              |
| Change KPI numbers / chart labels                    | `kpi-report.js` → `DATA`                                                            |
| Change submission emails                             | `apps-script-webhook.gs`                                                            |
| Change deposit amount / webhook (not copy)           | GitHub secrets + `pages-config.js` — [WHERE-TO-GET-LINKS.md](WHERE-TO-GET-LINKS.md) |


After markdown edits: `npm run build` (or `npm run watch`).

---



## By page / overlay



### Browser & cockpit shell


| What users see          | File         | Field / location                                                         |
| ----------------------- | ------------ | ------------------------------------------------------------------------ |
| Browser tab title       | `index.html` | `<title>Operations Dashboard</title>`                      |
| Main headline           | `index.html` | `.cockpit-title span` — “Operations Dashboard”; Gold       |
| Subtitle + how-to intro | `index.html` | `.cockpit-subtitle`, `.cockpit-intro`, `.cockpit-howto`                  |
| Default tab on load     | `app.js`     | `activeViewTab: "kpis"` — KPIs panel visible first                       |
| Tab: KPIs               | `index.html` | `button[data-view="kpis"]` — includes former Dashboards charts at bottom |
| Tab: Project Guide      | `index.html` | `button[data-view="picker"]`                                             |
| Tab: Impact             | `index.html` | `button[data-view="impact"]` — grayed + Under Construction overlay |



### Project Picker tab


| What users see                                     | File                                              | Field / location                                                            |
| -------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| Ask Gilbert + Pav Priorities (merged)              | `index.html` + `app.js`                           | `#do-next-panel.pav-priorities-merged` — survey left, priorities right      |
| Ask Gilbert word cloud (drill-down)                | `app.js`                                          | `GILBERT_CLOUD` / `renderGilbertSurvey()` — tap topics → keyword branches, multi-select, clears on refresh |
| “Best to do next” (scored shortlist)               | `app.js`                                          | `renderDoNextPanel()` — ranked from survey `goalText`                       |
| “Pav's Priority Project Picklist” panel title    | `app.js`                                          | `renderDoNextPanel()` → `h3` inside `#do-next-panel`                        |
| Pav Priorities cart (project names only)           | `app.js`                                          | `buildPrioritiesCartHtml()` — **no fees** in top panel                      |
| Action items list                                  | `app.js`                                          | `buildActionItems()` — shown on **confirm page** only                       |
| Next steps (confirm page)                          | `app.js`                                          | `buildConfirmNextStepsHtml()`, `formatNextStepsText()`                      |
| “Why this combination”                             | `app.js`                                          | Strategy text now in **Next steps** via `buildRecommendation()`             |
| “Project Outlines” zone title                      | `index.html`                                      | `h2.picker-zone-title` in `.picker-zone-outlines`                           |
| “Project Outlines” table title                     | `index.html`                                      | `.project-outlines-title`                                                   |
| Table hint (count / selected)                      | `app.js`                                          | `renderProjectToc()` → `#toc-summary-hint`                                  |
| “Filter by value” icon key                         | `app.js`                                          | `VALUE_ICON_DEFS` + `renderValueIconKey()`                                  |
| Default package intro line                         | `app.js`                                          | `renderPackageIntro()` ← `content/settings.md` **Default package label**    |
| Package project IDs                                | `content/settings.md`                             | **Default package projects**                                                |
| Table headers: Priority, Project, Value add, Icons | `index.html`                                      | `.toc-table thead`                                                          |
| Each table row title & blurb                       | `projects-data.js`                                | Built from `content/projects/*.md` + `content/INDEX.md` titles              |
| Zone label “Project details”                       | `index.html`                                      | `.picker-zone-cards .picker-zone-label`                                     |
| “Expand All”                                       | `index.html`                                      | `#expand-all-projects` label                                                |
| “Review Plan”                                    | `app.js`                                          | `renderDoNextPanel()` → `#continue-to-confirm`                              |
| Project cards (all body copy)                      | `content/projects/{ID}.md`, `content/retainer.md` | See [CONTENT-EDIT.md](CONTENT-EDIT.md) sections                             |
| Card status badges (WIP, completed, …)             | `content/INDEX.md`                                | **Status** column overrides file                                            |
| AB – Q question text                               | `content/projects/{ID}.md`                        | `AB - Q:` block                                                             |
| Research / optional projects section               | `app.js`                                          | `renderResearchSection()`                                                   |




### Gilbert chat (floating)


| What users see             | File                  | Field / location                                           |
| -------------------------- | --------------------- | ---------------------------------------------------------- |
| Guide full name            | `content/settings.md` | **Guide name** → `projects-data.js`                        |
| Guide short name           | `content/settings.md` | **Guide short name**                                       |
| Launcher aria-label        | `index.html`          | `#gilbert-chat-launcher`                                   |
| Popup title + subtitle     | `index.html`          | `.gilbert-popup-head-title`                                |
| Opening greeting           | `app.js`              | `GILBERT_GREETING` (consider moving to settings in future) |
| Chat replies to user goals | `app.js`              | `pickGilbertReply()`                                       |
| Input placeholder          | `index.html`          | `#goal-input` placeholder                                  |
| Condensed cart in popup    | `app.js`              | `renderCondensedToc()`                                     |




### Confirm & submit overlay


| What users see                  | File         | Field / location                                           |
| ------------------------------- | ------------ | ---------------------------------------------------------- |
| “Your plan” header              | `index.html` | `.confirm-header h2`                                       |
| Intro paragraph                 | `index.html` | `.confirm-intro`                                           |
| Fees / revenue calculator       | `app.js`     | `renderConfirmPlanReview()` → `buildRevenueCalculatorHtml()` (confirm only) |
| Payment options (per project)   | `app.js`     | `buildPaymentOptionsHtml()` · rules in [PAYMENT-SCHEDULE.md](PAYMENT-SCHEDULE.md) |
| Schedule calculator             | `app.js` / `index.html` | `computePaymentPlan()` · `#invoice-payment-months` |
| Estimated results               | —            | **Removed** from confirm (no `#confirm-estimated-results` / ROI inject) |
| Action items                    | `app.js`     | thank-you / email — not on confirm ROI block |
| Next steps                      | `app.js`     | cart / thank-you flow |
| “Confirm & submit” section      | `index.html` | `.confirm-submit-section`                                  |
| Email field label / placeholder | `index.html` | `#submitted-email`                                         |
| Invoice schedule labels         | `index.html` | `#invoice-payment-months`, hints                           |
| E-sign consent clickwrap        | SOW page     | `#sow-esign-consent` on SOW (not confirm) |
| Submit gating                   | `app.js`     | `canSubmit()` — email + cart/notes/Gilbert only |
| Submit / Back buttons           | `index.html` | `#submit-selections`, `#confirm-back`                      |
| Deposit / QuickBooks notes      | `index.html` | `.submit-note` |
| Webhook warning                 | `app.js`     | `updateWebhookWarning()`                                   |




### Thank-you page


| What users see           | File                    | Field / location                   |
| ------------------------ | ----------------------- | ---------------------------------- |
| Headline                 | `index.html`            | `.thank-you-headline`              |
| Subline (also set in JS) | `index.html` + `app.js` | `#thank-you-sub`, `showThankYou()` |
| Affirmation paragraph    | `app.js`                | `buildThankYouAffirmation()`       |
| ROI / return estimates   | —                       | Not injected on thank-you by default |
| Selection summary        | `app.js`                | `showThankYou()`                   |
| Action items block       | `app.js`                | `buildActionItemsHtml()`           |
| Deposit copy             | `app.js`                | `showThankYou()` deposit block     |
| Pay deposit button       | `app.js`                | `showThankYou()` · URL from `CONFIG.quickbooksDepositUrl` |
| “Browse more projects”   | `index.html`            | `#btn-back-picker`                 |

### SOW page

| What users see | File | Field / location |
| -------------- | ---- | ---------------- |
| Flow | submit → private Andrew link → private Kate countersign link → complete | Apps Script creates two separate single-use bearer tokens |
| Scope list | titles only | server-side `selectedSowTitles()` / `buildCanonicalSow()` |
| Agreement | fixed `<pre>` — no user editing | `#sow-document`; server copy and hash are authoritative |
| Andrew signature | one signer, two capacities | Pav Law authorized signer + Andrew individually |
| Signing fields | required checkboxes only | review · firm authority · individual capacity · electronic consent |
| Token security | raw token only in emailed URL | Sheet stores SHA-256 token hash; 14-day expiry; single-use |
| Sign API | `app.js` | `signSowAndEmail()` → webhook `type: "sow_sign"` |
| Audit | Apps Script server timestamp + client timestamp + browser-reported public IP | also timezone, user agent, checks, document hashes |
| Copies | PDF auto-download + `MailApp` attachment | Andrew copy after his signature; both parties after countersign |
| Drive archive | private Google Doc + PDF | created only after Kate countersigns |
| Sheet tab | `SowSigning` | staged state, hashes, signature audit, Drive file IDs |
| Continue to deposit | Andrew only, gated until his signature succeeds | `#sow-continue-thankyou` |
| Email format (signature / link first) | [SOW-EMAIL-FORMAT.md](SOW-EMAIL-FORMAT.md) | invite · recorded · countersign · fully executed |




### KPIs tab


| What users see                          | File            | Field / location                                                 |
| --------------------------------------- | --------------- | ---------------------------------------------------------------- |
| Report title / period / source          | `kpi-report.js` | `DATA.period`, `DATA.asOf`, `DATA.source`, `reportHeader()`      |
| Team goals (phones, DUI YTD)            | `kpi-report.js` | `kpi-section-goals` — `DATA.kpis` goals + `teamDuiGoalCardHtml()` |
| Key metric cards (#01, #BHI, #21, …)    | `kpi-report.js` | `DATA.kpis` (non-goal) — BHI gauge in Key metrics grid           |
| Card detail on click                    | `kpi-report.js` | `KPI_DETAIL`                                                     |
| Leads-by-channel / campaign charts      | `kpi-report.js` | `DATA.channels`, `leadsByCampaign`                               |
| Reputation (#16 / #17)                  | `kpi-report.js` | `DATA.reviews`, `DATA.referrals`                                 |
| #02 New cases YoY (2025 vs 2026)        | `kpi-report.js` | `dashboardSectionsHtml()` — `DATA.newCasesYoY`                   |
| Avg deposit · Cases MoM (#04/#05)       | `kpi-report.js` | `dashboardSectionsHtml()` — `DATA.avgDeposit`, `casesMom`        |
| #10 Source mix                          | `kpi-report.js` | `DATA.sourceMix`                                                 |
| Legend green outline / ✕                | `kpi-report.js` | `reportKey()` — verified vs gap channels                     |




### Impact tab


| What users see               | File                       | Field / location                                            |
| ---------------------------- | -------------------------- | ----------------------------------------------------------- |
| Panel                        | `index.html`               | `#cockpit-panel-impact`                                     |
| Completed section title      | `index.html`               | `.completed-panel-head` inside `#impact-completed`          |
| Completed report-out (draft) | `index.html` / `app.js`    | `#completed-report-out` → `completedReportOutHtml()`        |
| Per-project completed detail | `content/projects/{ID}.md` | `## Completed`, `## Goal`                                   |
| Completed render             | `app.js`                   | `renderCompletedList()`, `campaignMetricsHtml()` (Goal only)|
| Revenue calculator           | `index.html` / `app.js`    | `#revenue-calculator` → cart fees only                      |




### Emails & webhook (post-submit)


| What users see                 | File                     | Field / location                              |
| ------------------------------ | ------------------------ | --------------------------------------------- |
| Internal email to Gilded Goose | `apps-script-webhook.gs` | `buildInternalEmail()`                        |
| Client confirmation email      | `apps-script-webhook.gs` | `buildClientEmail()`                          |
| Action items in both emails    | `apps-script-webhook.gs` | `formatActionItems()` ← payload from `app.js` |
| Activity log mailto body       | `app.js`                 | `formatActivityEmailBody()`                   |
| Notify address default         | `app.js`                 | `CONFIG.notifyEmail` / `pages-config.js`      |


---



## Content source files (complete list)



### You edit (markdown)


| Path                                                 | Purpose                                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| [content/INDEX.md](content/INDEX.md)                 | Master table: priority, status, **display titles** — build never overwrites |
| [content/recommendations.md](content/recommendations.md) | Recommendations tab — edit then `npm run build` |
| [content/settings.md](content/settings.md)           | Gilbert names, image paths, default package                                 |
| [content/retainer.md](content/retainer.md)           | Retainer project card                                                       |
| [content/projects/A1.md … A13.md](content/projects/) | Campaign / project cards                                                    |
| [content/projects/B1.md … B10.md](content/projects/) | Infrastructure / marketing cards                                            |
| [content/projects/A8M.md](content/projects/A8M.md)   | Monthly dashboard maintenance                                               |
| [content/_TEMPLATE.md](content/_TEMPLATE.md)         | Copy for new projects                                                       |




### Generated — do not hand-edit


| Path                          | Built by                            |
| ----------------------------- | ----------------------------------- |
| `projects-data.js`            | `npm run build` ← markdown          |
| `content/impact-history.json` | `scripts/sync-impact-estimates.mjs` |




### Data scripts (metrics & KPI sync)


| Path                                | When to edit                            |
| ----------------------------------- | --------------------------------------- |
| `scripts/campaign-metrics-data.mjs` | Goals, results, blockers, insights bulk |
| `scripts/impact-estimates-data.mjs` | Leads impacted / connected / retained   |
| `kpi-report.js` → `DATA`            | KPI tab + dashboard numbers and charts  |




### UI shell (labels & chrome)


| Path            | Contains                                                      |
| --------------- | ------------------------------------------------------------- |
| `index.html`    | All CSS, static labels, confirm/thank-you chrome, tab names   |
| `app.js`        | Dynamic strings, Gilbert logic, recommendations, action items |
| `kpi-report.js` | KPI/dashboard copy and numbers                                |




### Backend / deploy (not picker copy)


| Path                     | Purpose                          |
| ------------------------ | -------------------------------- |
| `apps-script-webhook.gs` | Email templates                  |
| `pages-config.js`        | Webhook URL, deposit (live site) |
| `BACKEND-SETUP.md`       | Wiring instructions              |
| `GITHUB-PUSH.md`         | Deploy                           |


---



## Recommended edit workflow

1. **Wording on a project card** → edit `content/projects/X.md` → `npm run build`
2. **Reorder or rename in table** → edit `content/INDEX.md` → `npm run build`
3. **Recommendations tab copy** → edit `content/recommendations.md` → `npm run build`
4. **Button or page title** → `index.html` (grep the phrase)
5. **New default package sentence** → `content/settings.md` → build
6. **KPI number** → `kpi-report.js` `DATA` (+ export path in `DATA.source`)
6. **Email paragraph** → `apps-script-webhook.gs` → redeploy Apps Script **New version**

---



## Related

- [BRANDING-LAYOUT.md](BRANDING-LAYOUT.md) — colors, spacing, zones
- [CONTENT-EDIT.md](CONTENT-EDIT.md) — markdown section spec
- [README.md](README.md) — deploy overview

