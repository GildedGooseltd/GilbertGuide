# MyCase Data Cleanse

| Field | Value |
| ----- | ----- |
| Priority | 4 |
| Fee | 1500 |
| Category | Intake / CRM |
| Campaign type | Data Hygiene & Fields |
| Status | Recommended |
| Publish status | published |
| Estimated leads gained | Clean CRM unlocks Spanish ads + HubSpot import without garbage |
| Keywords | mycase, cleanse, data, spanish, checkbox, lead source, phone, duplicate, hubspot, intake, crm, attribution, channel, export |

---

## Summary

- Cleans MyCase client records so new-case KPIs and HubSpot imports are trustworthy
- Adds a Spanish-speaking checkbox for fast intake tagging and Spanish ad routing
- Standardizes Lead Source, phones, names, and practice labels
- Tags every new matter with channel source for KPIs #30–#32
- Deduplicates clients and fixes stale open/closed status before export
- Pulls HubSpot contacts exports into Ad Reports for Original source and hired dates

## Value icons

| Show | Name |
| ---- | ---- |
| [x] | Foundation |
| [ ] | Retainer |
| [ ] | Leads |
| [x] | CRM |
| [x] | HubSpot |
| [ ] | SEO |
| [ ] | Referrals |
| [x] | Analytics |
| [ ] | Finance |
| [x] | Intake |
| [ ] | Creative |

## KPI links

| Show | Name |
| ---- | ---- |
| [ ] | Total leads |
| [x] | New cases |
| [ ] | Key Channel Activity |
| [x] | Pipeline / CRM completeness |
| [ ] | Spend Waste |
| [ ] | Campaign cost efficiency |
| [ ] | Intake conversion |
| [x] | Lead channel mix |
| [ ] | Organic / local search presence |
| [ ] | Avg. Cost per Call |
| [ ] | Creative / channel response |
| [ ] | Cost per lead |
| [ ] | Reviews by channel |
| [ ] | Referral Network |
| [ ] | Website / SEO contribution |
| [ ] | Missed Opportunity |
| [ ] | CRM follow-up discipline |
| [ ] | Answered Calls |
| [ ] | Speed to lead |
| [ ] | Intake coverage / after-hours |
| [x] | Ops backlog / open tasks |
| [ ] | Avg case fee |

## WIP

- Add Spanish-speaking checkbox on MyCase Client/Contact · train Romina / Casey / America to check on intake
- **Create MyCase fields:** Booked / closed by · Case ranking (A/B/C) — see Field build below · T068
- Lock Lead Source values to LSA · Search · Form · Referral · Direct · set at consult booked · confirm at hired
- Mirror the same source on HubSpot deal when the matter is booked or hired
- HubSpot contacts export: Original source · create date · lifecycle · meetings · closed-won / hired date → drop in `Ad Reports/exports/hubspot/_drop-exports-here/`
- Audit Romina Lead Source updates · one month of LSA Booked vs hired counts · T067
- Backfill known Spanish-preferring clients from notes after checkbox is live
- Cleanse Lead Source · phone · name · email · practice/case type · Created dates · open vs closed · duplicates
- Confirm marketing consent / do-not-contact field for safe HubSpot import
- Export hygiene → map to HubSpot `pl_lead_source` · Spanish flag · Booked / closed by · Case ranking · import batch tag
- Run rows in [INTAKE-DATA-CLEANSE-SPANISH-CALLS.md](../../../INTAKE-DATA-CLEANSE-SPANISH-CALLS.md) §1 · CSV filter `system` = MyCase
- After fields live: closed-matters export with Closed by + Case ranking → unlocks KPI #04 staff + mix reporting (OpsDash)

## Completed

- Lead Source field added in MyCase

---

—— Unpublished below ——

## Project plan

### Related files

→ [INTAKE-DATA-CLEANSE-SPANISH-CALLS.md](../../../INTAKE-DATA-CLEANSE-SPANISH-CALLS.md) — §1 MyCase cleanse + fields
→ [INTAKE-DATA-CLEANSE-SPANISH-CALLS.csv](../../../INTAKE-DATA-CLEANSE-SPANISH-CALLS.csv) · filter `system` = MyCase
→ [HUBSPOT-LEAD-TRACKING-SETUP.md](../../../HUBSPOT-LEAD-TRACKING-SETUP.md) — `pl_booked_closed_by`
→ [Ad Reports/exports/hubspot/_drop-exports-here/README.md](../../../../../../Ad%20Reports/exports/hubspot/_drop-exports-here/README.md) — HubSpot contacts drop folder
→ [kpi-list.md](../../../kpi-list.md) — #30 Expected value per lead · #31 Cost per signed case · #32 Channel ROI
→ [CHANNEL-ROI-SPEC.md](../../../CHANNEL-ROI-SPEC.md) — formulas · fields · export → Guide cell map

Related Guide projects:
→ [LsaCall.md](LsaCall.md) — LSA Call Process · Lead Source already live
→ [HsPipe.md](HsPipe.md) — HubSpot Pipeline Sprint
→ [HsSetup.md](HsSetup.md) — HubSpot Marketing Setup parent
→ [HsVoip.md](HsVoip.md) — Phone / VoIP · Spanish queue enablement
→ [WebContent.md](WebContent.md) — Website · Google Translate sitewide
→ [OpsDash.md](OpsDash.md) — Ops dashboard · new-case data quality

### Field build — Lead Source / channel tag

Locked values for every new matter:

- LSA
- Search
- Form
- Referral
- Direct

1. MyCase → Settings → Custom fields → Lead Source dropdown
2. Replace mixed labels with the five locked values above · keep historical notes if old labels remain on past rows
3. Optional parallel: HubSpot deal property with the same five values
4. SOP: set source when consult is booked · confirm or correct when the matter is hired
5. HubSpot map: MyCase Lead Source → `pl_lead_source` with the same five values
6. Feeds KPI #30–#32 channel close rate and fee attribution

### Field build — Spanish-speaking checkbox

1. MyCase → Settings → Custom fields
2. Add checkbox: Spanish-speaking
3. Place on intake form / required view Romina uses
4. SOP: check when caller prefers Spanish or needs Spanish follow-up
5. HubSpot map: checked → `pl_preferred_language` = Spanish
6. Backfill: Romina marks known Spanish clients from notes

### Field build — Booked / closed by (who closed)

1. MyCase → Settings → Custom fields
2. Add dropdown: **Booked / closed by**
3. Options: Casey · Romina · Andrew · America · Other
4. Place on intake / matter view used when consult is booked, client is hired, **and** when the matter is closed
5. SOP:
   - Set when consult is booked
   - Update when lead is closed as hired if a different person closed it
   - Confirm / update again when the **case file closes** (who closed the matter)
6. HubSpot map: same value → contact property `pl_booked_closed_by`
7. Create HubSpot property if missing: Settings → Data Management → Properties → Contact · internal name `pl_booked_closed_by` · label Booked / closed by · dropdown with the same options
8. **Reporting unlock:** staff attribution on hired + closed counts (KPI #04 support · OpsDash)

### Field build — Case ranking

1. MyCase → Settings → Custom fields
2. Add dropdown: **Case ranking**
3. Options (locked):
   - **A** — High priority / complex / higher-fee track
   - **B** — Standard
   - **C** — Lower / volume
4. Place on matter view at hire · review at case close
5. SOP: set when hired · confirm when closed · do not leave blank on new 2026 matters
6. HubSpot map (optional): contact/deal property `pl_case_ranking` · same A · B · C values
7. **Reporting unlock:** mix of A/B/C closed and open matters · fee-by-rank vs #29 practice means · OpsDash dashboard

### HubSpot contacts export — attribution pull

Required columns:

- Original source
- Create date
- Lifecycle stage
- Meetings
- Closed-won / hired date

1. HubSpot → Contacts → export with the fields above for 2026 create dates
2. Save as `hubspot_contacts_YYYY-MM-DD_to_YYYY-MM-DD.csv`
3. Drop into [`Ad Reports/exports/hubspot/_drop-exports-here/`](../../../../../../Ad%20Reports/exports/hubspot/_drop-exports-here/)
4. Then file under `hubspot/monthly/YYYY-MM/` per ORGANIZATION.md
5. Unlocks KPI #01 · #06 · #10 · #11 and channel close rates for #30–#32

### Cleanse order

1. Lock Lead Source to LSA · Search · Form · Referral · Direct · create Spanish-speaking checkbox · Booked / closed by · Case ranking
2. America: M1–M8 cleanse pass on open + recent clients
3. Romina: Spanish backfill after checkbox live
4. Export → dedupe → HubSpot map · `pl_import_batch` = YYYY-MM-mycase-cleanse-v1
5. Drop HubSpot contacts attribution export into `_drop-exports-here/`
6. T068: create fields in MyCase · train staff · include both columns on next closed-matters export for OpsDash

### Done when

- Spanish-speaking checkbox live on intake
- Booked / closed by live on MyCase and HubSpot with matching options
- Case ranking (A · B · C) live on MyCase · optional HubSpot `pl_case_ranking`
- Lead Source locked to LSA · Search · Form · Referral · Direct · set at consult booked · confirmed at hired
- HubSpot contacts export with Original source · create date · lifecycle · meetings · hired date is in `_drop-exports-here/`
- Duplicate / phone · name hygiene pass complete for export cohort
- Export maps ready for HubSpot without junk rows
- Closed-matters pull includes Booked / closed by + Case ranking (OpsDash reporting)

## Notes

- 2026-07-24: Split MyCase §1 from the combined intake cleanse doc into Guide project MyCaseClr so it can be sold / tracked separately from LsaCall LSA process.
- 2026-07-24: Spec’d Booked / closed by for MyCase + HubSpot `pl_booked_closed_by` · create in both systems still open.
- 2026-07-25: Added channel source SOP for KPI #30–#32 · HubSpot contacts attribution export into `_drop-exports-here/`.
- 2026-07-25: Task T067 — audit Romina Lead Source updates · one month LSA Booked vs hired counts.
- 2026-07-25: Attribution methods locked — LSA phone join · Form HubSpot manual · Referral MyCase review.
- 2026-07-25: Spec’d **Case ranking** (A/B/C) · expanded Booked / closed by SOP to matter close · T068 create fields + OpsDash reporting export.
