# Google Ads API — Pav Law (Gilbert A8 / HubSpot reporting stack)

**Gilbert project:** A8 Lead & KPI Dashboard · **Parent retainer:** A8M  
**Google Ads customer ID:** `414-638-6147` · **GA4:** `G-4RQMF505EB` · **HubSpot portal:** `246206963`

Use the API for **automated pulls** HubSpot cannot backfill: Search call details, campaign spend, LSA lead history, monthly KPI exports. HubSpot’s native Google Ads connection stays on for **attribution in CRM** — API is the **reporting + LSA backfill** layer.

---

## What each system owns

| System | Copy from | Save in | Use |
|--------|-----------|---------|-----|
| **HubSpot → Integrations → Google Ads** | Google Ads OAuth (admin@pav.law) | HubSpot only | CRM attribution, ad-influenced contacts |
| **Google Ads API** | API Center developer token + OAuth refresh token | `pav-law-analytics/config/site-config.env` (local only — never commit) | Scripted monthly KPI pull, LSA lead backfill, `Call details` automation |
| **LSA inbox CSV** | [ads.google.com/localservices](https://ads.google.com/localservices) → Leads → Download | `Ad Reports/exports/lsa-inbox/` | Lead-level detail (~90-day rolling) |
| **LSA Reports UI** | LSA → ☰ → Reports | `Ad Reports/exports/lsa-reports/` | Monthly charged-lead counts (2017+) |

---

## A1 — Google Cloud project

1. **Copy from:** [console.cloud.google.com](https://console.cloud.google.com) → sign in as **admin@pav.law** (or Ads admin).
2. **Create project:** name `Pav Law Ads Reporting`.
3. **APIs & Services → Library** → enable **Google Ads API**.
4. **Verify:** APIs & Services → Enabled APIs lists **Google Ads API**.

---

## A2 — Developer token

1. **Copy from:** Google Ads → **Tools & Settings → Setup → API Center**.
2. Apply for **Developer token** (start in **Test**; request **Basic** when dashboard is stable).
3. **Save in:** `site-config.env` as `GOOGLE_ADS_DEVELOPER_TOKEN=`.
4. **Verify:** API Center shows token status **Approved** or **Test**.

---

## A3 — OAuth credentials

1. **Google Cloud** → **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Desktop app** (simplest for Kate’s script) or **Web** if hosted later.
3. **Copy from:** Client ID + Client secret on the credential row.
4. **Save in:** `site-config.env` → `GOOGLE_ADS_CLIENT_ID=` · `GOOGLE_ADS_CLIENT_SECRET=`.
5. Run one-time OAuth flow (Google’s `generate_user_credentials` example or `google-ads-python` quickstart) → copy **refresh token**.
6. **Save in:** `site-config.env` → `GOOGLE_ADS_REFRESH_TOKEN=`.
7. **Verify:** Test query returns campaign rows for customer `4146386147` (no dashes in API).

---

## A4 — Customer ID and login customer

1. **Copy from:** Google Ads top bar → account **414-638-6147**.
2. **Save in:** `site-config.env` → `GOOGLE_ADS_CUSTOMER_ID=4146386147`.
3. If using an MCC: add `GOOGLE_ADS_LOGIN_CUSTOMER_ID=` (manager ID). Pav Law is likely direct — leave blank unless API errors say otherwise.

---

## A5 — HubSpot Google Ads connection (same project, different save location)

1. **HubSpot** → **Settings → Integrations → Connected apps → Google Ads** → Connect.
2. Sign in with the **same Google account** that owns the Ads account.
3. **Verify:** HubSpot → **Marketing → Ads** shows Pav Law account; at least one campaign syncs within 24h.
4. **Do not** paste HubSpot OAuth tokens into `site-config.env` — HubSpot stores its own.

---

## A6 — API resources for A8 dashboard (what to pull monthly)

| KPI feed | Google Ads API resource / report | Replaces manual export |
|----------|----------------------------------|------------------------|
| Campaign spend, calls, CTR | `google.ads.search` → `campaign` + metrics | `Campaign report (17).csv` |
| Missed call rate | `call_view` or offline upload report | `Call details.csv` |
| LSA lead history | `local_services_lead` | `leads-inbox*.csv` (backfill pre-inbox window) |
| LSA charged / credited | Billing documents + LSA Reports UI | `account_activities_*.csv` |
| Search terms waste | `search_term_view` | Search terms report |

**Date range:** pull **prior calendar month** on the 1st; store under `Ad Reports/exports/api/YYYY-MM/`.

---

## A7 — Config file

```bash
cp pav-law-analytics/config/site-config.env.example pav-law-analytics/config/site-config.env
```

Fill all `GOOGLE_ADS_*` and `HUBSPOT_PORTAL_ID` fields. Add `site-config.env` to `.gitignore` if repo goes public.

---

## A8 — Gilbert deliverables (A8 scope)

- [ ] API credentials documented in `site-config.env` (local)
- [ ] HubSpot Google Ads integration connected (A5)
- [ ] Monthly script or workflow: campaign metrics + call_view + LSA leads → `Ad Reports/exports/api/`
- [ ] KPI tiles in dashboard spec [`KPI-DASHBOARD-SPEC.md`](../../gilded-goose/clients/pav-law/KPI-DASHBOARD-SPEC.md) wired to API + HubSpot exports
- [ ] A8M retainer: reconcile API pull vs manual CSV on the 5th of each month

---

## References

- [Google Ads API — Get started](https://developers.google.com/google-ads/api/docs/first-call/overview)
- [local_services_lead](https://developers.google.com/google-ads/api/fields/v18/local_services_lead)
- [HubSpot — Connect Google Ads](https://knowledge.hubspot.com/ads/connect-your-google-ads-account-to-hubspot)
- KPI definitions: [`KPI-DASHBOARD-SPEC.md`](../../gilded-goose/clients/pav-law/KPI-DASHBOARD-SPEC.md)
