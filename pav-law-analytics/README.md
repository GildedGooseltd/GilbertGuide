# Pav Law — GA4 + HubSpot implementation kit

Deployable files for **pav.law** WordPress (Newfold), GA4 property **`G-4RQMF505EB`**, and new HubSpot CRM.

## Quick start (2–3 hours)

| Phase | Doc | Time |
|-------|-----|------|
| 1 Audit | [`audit-findings.md`](audit-findings.md) | 15 min |
| 2 GTM + GA4 | [`wordpress/WORDPRESS-SETUP.md`](wordpress/WORDPRESS-SETUP.md) + [`gtm/GTM-SETUP.md`](gtm/GTM-SETUP.md) | 45 min |
| 3 HubSpot | [`hubspot/HUBSPOT-SETUP.md`](hubspot/HUBSPOT-SETUP.md) | 60 min |
| 4 GTM events | Included in GTM import | 30 min |
| 5 Conversions + Ads | [`ga4-admin/LINK-GOOGLE-ADS.md`](ga4-admin/LINK-GOOGLE-ADS.md) | 15 min |
| 6 Validate | [`VALIDATION-CHECKLIST.md`](VALIDATION-CHECKLIST.md) | 15 min |
| 7 Ads API + KPI dashboard | [`google-ads/GOOGLE-ADS-API-SETUP.md`](google-ads/GOOGLE-ADS-API-SETUP.md) + [`../gilded-goose/clients/pav-law/KPI-DASHBOARD-SPEC.md`](../gilded-goose/clients/pav-law/KPI-DASHBOARD-SPEC.md) | Gilbert A8 |

## File map

```
pav-law-analytics/
├── README.md                    ← you are here
├── audit-findings.md            Phase 1 results
├── VALIDATION-CHECKLIST.md      Phase 6 tests
├── config/
│   └── site-config.env.example  Fill in IDs after audit
├── gtm/
│   ├── GTM-SETUP.md
│   ├── pav-law-gtm-container.json   Import into tagmanager.google.com
│   └── snippets/                    Copy-paste if building tags manually
├── wordpress/
│   ├── WORDPRESS-SETUP.md
│   ├── redirects.csv
│   └── snippets/gtm-head.php, gtm-body.php
├── hubspot/
│   └── HUBSPOT-SETUP.md
├── ga4-admin/
│   └── LINK-GOOGLE-ADS.md
└── google-ads/
    └── GOOGLE-ADS-API-SETUP.md   Gilbert A8 — API + LSA backfill
```

## Architecture

```
pav.law (WordPress)
  ├── GTM container → GA4 G-4RQMF505EB (page_view, generate_lead, phone_click)
  ├── HubSpot plugin → CRM contacts on form submit
  └── Site Kit → Search Console only (GA4 output OFF)
         ↓
Google Ads ← linked GA4 property (gclid auto-tagging)
```

## Critical rules

1. **One GA4 source** — GTM fires tags; disable Site Kit “Place Analytics code”
2. **HubSpot forms need GTM listener** — iframe forms don’t trigger default GTM Form Submit
3. **Ignore 771 URL tag audit** — ad landing pages already Tagged per export
4. **301 www + /contact** — see `wordpress/redirects.csv`

## Config

Copy `config/site-config.env.example` → `config/site-config.env` and fill in after Phase 1 browser audit. Do not commit real portal IDs if repo is public.
