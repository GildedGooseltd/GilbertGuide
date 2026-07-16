# Export click paths — Pav Law data pulls

**Account:** Google Ads `414-638-6147` · admin@pav.law  
**Save locally:** `Ad Reports/exports/YYYY-MM-DD/` (never commit raw files — see `.gitignore`)

After each pull: update `scripts/impact-estimates-data.mjs` if numbers changed → `npm run build` → `npm run validate-data`

---

## 1. Google Ads — Campaign report (required every pull)

1. [ads.google.com](https://ads.google.com) → sign in **admin@pav.law**
2. **Reports** → **Report editor** (or **Predefined reports** → **Campaigns**)
3. **Date range:** match prior batch (e.g. last 30 days ending yesterday)
4. **Columns — must include:**
   - Campaign
   - Cost
   - Clicks (or Interactions)
   - **Phone calls** ← required (Jul 11 batch dropped this)
   - Avg. CPC
5. **Segment:** none (campaign level only)
6. **Download** → CSV
7. Save as `Campaign report (NN).csv` in `Ad Reports/exports/YYYY-MM-DD/`

**Verify:** Open CSV row 3 header includes `Phone calls`.

---

## 2. Google Ads — Ad group report

Same date range as §1.

1. **Reports** → **Ad groups**
2. Columns: Ad group, Campaign, Cost, Clicks, **Phone calls**, Impr.
3. Download CSV → `Ad group report (NN).csv`

---

## 3. Google Ads — Search terms

1. **Reports** → **Search terms** (or **Search keywords** → Search terms view)
2. Same date range
3. Columns: Search term, Campaign, Ad group, Cost, Clicks
4. Download → `Search terms report (NN).csv`

---

## 4. Google Ads — Device (optional, monthly)

1. **Reports** → **Device**
2. Columns: Device, Campaign, Cost, Clicks
3. Download → `Device report (NN).csv`

---

## 5. LSA — Leads inbox

1. [ads.google.com/localservices](https://ads.google.com/localservices) (or **Goals** → **Local Services**)
2. **Leads** / **Lead inbox**
3. Date: **All time** or last 90 days (note range in INDEX.md)
4. Export / download CSV → `leads-inbox (NN).csv`

**Contains PII** — local folder only.

---

## 6. LSA — Account activities (billing)

1. Local Services → **Account** or **Billing** → **Activity** / transaction history
2. Export monthly CSV → `account_activities_YYYYMM.csv`

---

## 7. HubSpot — Contacts (gap — not in repo yet)

1. [app.hubspot.com](https://app.hubspot.com) → **CRM** → **Contacts**
2. **Lists** or **All contacts** → filter:
   - `pl_lead_source` contains Google Ads / LSA / Referral (property names per Pav setup)
   - Create date last 30 days
3. **Actions** → **Export** → CSV
4. Columns only: create date, lead source, lifecycle stage, **no notes body** if exporting to shared machine
5. Save as `hubspot-contacts-YYYY-MM-DD.csv` in export batch folder

**Do not** commit this file.

---

## 8. HubSpot — Call analytics (#21 answer rate)

1. **Reports** → **Analytics** → **Calls** (or **Sales** → **Calls** if Service Hub)
2. Date: last 30 days
3. Export aggregate: answered vs missed % by number/queue
4. Save as `hubspot-calls-summary-YYYY-MM-DD.csv` or paste totals into PERFORMANCE-REVIEW only

If Calls report unavailable: **CRM** → **Activities** → filter Call → export count answered/missed manually.

---

## 9. HubSpot — Deals / new cases (#02)

1. **CRM** → **Deals** (or custom object for matters)
2. Filter: create date + stage = retained/signed
3. Export CSV → `hubspot-deals-YYYY-MM-DD.csv`

---

## 10. MyCase — retained matters (if used for #02 / #28)

1. MyCase → **Reports** or **Cases** → closed/retained in period
2. Export aggregate counts + avg fee — avoid client names in shared docs
3. Save locally; reference totals in `PERFORMANCE-REVIEW-YYYY-MM-DD.md` only unless file stays gitignored

---

## Pull order (same day)

| Step | Source | File |
|------|--------|------|
| 1 | Google Ads campaign + ad group + search terms | §1–3 |
| 2 | LSA inbox + account activities | §5–6 |
| 3 | HubSpot contacts + calls + deals | §7–9 |
| 4 | Update `Ad Reports/PERFORMANCE-REVIEW-YYYY-MM-DD.md` | synthesis |
| 5 | `npm run validate-data` in project-picker | validation |
| 6 | `npm run build` if impact numbers changed | picker sync |

---

## What never goes to GitHub / Gilbert Guide

| Keep local only | OK to commit |
|-----------------|--------------|
| `*.csv` in `Ad Reports/` | `Ad Reports/exports/INDEX.md` |
| `leads-inbox*.csv` | `PERFORMANCE-REVIEW-*.md` (aggregates) |
| `hubspot-*.csv`, `mycase-*.csv` | `DATA-VALIDATION.md` (aggregates) |
| PDF/XLSX/tar.gz ad exports | `DATA-EXPORT-CLICKPATHS.md` |
| Phone numbers in any export | `kpi-expected.mjs` (numbers only) |

Gilbert Guide deploy path: `gilded-goose/clients/pav-law/project-picker/` — **does not include** `Ad Reports/`.
