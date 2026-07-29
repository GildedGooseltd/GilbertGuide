# Recommendations

Edit this file, then run `npm run build` in `project-picker/` and hard-refresh the Guide.
Tokens like `{{lsaCpl}}` fill from live June LSA / digital math at render time.
Project links: `[Title](project:HsVoip)` — clients see Title only; `project:HsVoip` stays internal.

Order follows **INDEX Project score** (lower number first). Active pilots listed first.

---

## Page

| Field | Value |
| ----- | ----- |
| **Title** | Recommendations |
| **Subtitle** | HubSpot intake first · then active pilots · INDEX order. |
| **Alert status** | Action required |
| **Alert label** | HubSpot forms |
| **Alert** | Assign website forms to Casey with same-day callback. Transfer one phone next · write setup docs · start team on phone + app. |

## Jump

| Rank | Label | Anchor |
| ---- | ----- | ------ |
| 1 | HubSpot phone | recommendation-primary |
| 2 | Yelp pilot | recommendation-yelp |
| 3 | #11 Sex Crimes | recommendation-sex-crimes |
| 4 | Known savings | recommendation-financial-audit |
| 5 | LSA divert | recommendation-divert |
|  | Projects | recommendation-projects |
|  | Actions | recommendation-actions |

---

## Rec · recommendation-primary

| Field | Value |
| ----- | ----- |
| **Title** | 1 · #1–2 · HubSpot phone + form callbacks |
| **Hint** | Transfer one line · document it · get Casey on forms + auto calls. |
| **Why status** | Action required |
| **Why** | Missed Search calls and slow form follow-up waste media. Forms need same-day callbacks. Casey should own form callbacks and start answering more auto calls. LSA {{lsaCpl}}/call vs digital {{digAllIn}} all-in. |
| **Solutions** | [HubSpot Phone / VoIP](project:HsVoip): transfer **one** phone first · write setup docs · build a short HubSpot onboarding deck. Assign HubSpot form submits to **Casey** with same-day callback tasks. Pair with [LSA Call Process](project:LsaCall). Gate: **≥90% answered · 7 days**. |
| **Chart** | lsa-vs-digital |
| **Proof title** | Training deck · tools |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| LSA $/call | {{lsaCpl}} | June |
| Digital media | {{digCpl}} | Search only |
| Digital all-in | {{digAllIn}} | Media + consulting |
| Form owner | Casey | Same-day callback |

### Proof

- Start: transfer one line → write PHONE-SETUP steps for that line → test ring in HubSpot app
- Deck stack: HubSpot Academy free lessons + Knowledge Base Calling · Gamma or Canva Magic for slides · Loom for 2–3 min app demos · Claude/ChatGPT to draft outline from HsVoip checklist
- Premade: academy.hubspot.com · Lead Management / Contacts CRM · knowledge.hubspot.com/calling
- Then: forms → Casey · auto-call practice · ≥90% answered before more LSA spend

---

## Rec · recommendation-yelp

| Field | Value |
| ----- | ----- |
| **Title** | Active · Yelp pilot — leads + referrals |
| **Hint** | $5/day promo live · August target 20 channel referrals. |
| **Why status** | On track |
| **Why** | Baseline 6 leads / 30 days. Testing paid + profile work for leads and referrals. |
| **Solutions** | [Digital Presence Refresh](project:DigProf). Keep $5/day. Stories + profile polish. Past-client review email. Gate: **20 Aug referrals**. Yelp → HubSpot number stays gated until Casey is call-ready on HsVoip. |
| **Chart** | yelp-august |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Baseline | 6 | Leads / last 30 days |
| Promo | $5/day | Live now |
| Aug goal | 20 | Channel referrals |
| Reviews | 5.0 · 6 | Yelp listing |

### Proof

- Kickoff: 293 impressions → 29 visits → 6 leads
- Mix: 3 messages · 2 calls · 1 website
- August CTA A/B weekly on DigProf

---

## Rec · recommendation-sex-crimes

| Field | Value |
| ----- | ----- |
| **Title** | 2 · #11 · Sex Crimes Defense |
| **Hint** | Highest fee · YTD cases −62% vs 2025. |
| **Why status** | Watch |
| **Why** | ~$9,500 mean fee · 5 YTD vs 13 last year · ~$76k quoted gap. n=6 — directional. |
| **Solutions** | [Digital Ad Enhancements](project:AdEnhance): exact/phrase Search only · landing page · tracked calls. Gate: 30-day qualified calls + signed cases. |
| **Chart** | cases-recovery |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Mean fee | $9,500 | n=6 |
| 2025 YTD | 13 | Cases |
| 2026 YTD | 5 | Cases |
| Gap | −62% | vs prior year |

### Proof

- 8 cases × $9,500 = $76k quoted · $60.8k at 80% collectible
- Recovery: 5 YTD + 8 H2 = 13 cases

---

## Rec · recommendation-financial-audit

| Field | Value |
| ----- | ----- |
| **Title** | 3 · #26 · Use known savings now |
| **Hint** | No owner signoff on a full audit yet. Still cut known waste now. |
| **Why status** | Action required |
| **Why** | +$29,534 H1 after expenses excludes unknown debt. Verified Search waste floor $1,063 / 30 days. |
| **Solutions** | Use waste already found: Search waste, subscriptions, ads, LSA credits. Keep [Full Financial Waste Audit](project:WasteAud) parked until owner approves. |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| 30-day waste | $1,063 | Search floor |
| Annualized | $12,756 | If unchanged |
| H1 surplus | +$29,534* | *excludes debt |

### Proof

- $1,063 × 12 = $12,756 annualized
- H1 $509,534 collectible − $480k expenses = +$29,534*

---

## Rec · recommendation-divert

| Field | Value |
| ----- | ----- |
| **Title** | 4 · After answer gate · Divert LSA |
| **Hint** | Consulting first · then Search media. |
| **Why status** | Watch |
| **Why** | LSA only wins if close rate ≥ **{{closeMultiple}}×** digital. Confirm signed cases before moving budget. |
| **Solutions** | Divert ≥ {{minDivert}}/mo → consulting + Search · hold 30 days · track signed rate by channel. |
| **Proof type** | divert-table |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Min divert | {{minDivert}}/mo | Total |
| Consulting | {{mgmt}} | Retainer |
| Media | {{breakEvenMedia}} | Search |

---

## Rec · recommendation-projects

| Field | Value |
| ----- | ----- |
| **Title** | Projects |
| **Hint** | INDEX score order. |
| **Body type** | projects-table |

### Projects table

| Project | Score / status | Fee | Role | Success gate |
| ------- | -------------- | --- | ---- | ------------ |
| [HubSpot Phone / VoIP Setup](project:HsVoip) | #1 · WIP | $0 | Transfer 1 phone · docs · forms→Casey · onboarding deck | One line live · same-day form callbacks · staff on app |
| [Digital Presence Refresh](project:DigProf) | Active · WIP | $1,800 | Yelp promo · profile · reviews · CTA test | Aug: 20 Yelp referrals |
| [LSA Call Process Update](project:LsaCall) | #2 · Recommended | $1,500 | Statuses · Casey auto-call practice | Statuses current · Casey answering more autos |
| [Digital Ads Maintenance](project:RETAINER) | Required | {{mgmt}}/mo | Steward ads after gate | Funded before media shift |
| [Digital Ad Enhancements](project:AdEnhance) | #11 · Available | $2,200 | Sex Crimes Search pilot | 30-day call + signed-case review |
| [Full Financial Waste Audit](project:WasteAud) | #26 · Parked | $500 + 20% | Later if owner approves | Not active now |

---

## Rec · recommendation-actions

| Field | Value |
| ----- | ----- |
| **Title** | Next actions |
| **Hint** | Do in order. |
| **Body type** | actions-list |

### Actions

1. **HubSpot (HsVoip)** — Transfer **one** phone into HubSpot. Write setup docs for that line. Assign form submits to **Casey** with same-day callback.
2. **Training deck** — Short HubSpot onboarding: app login · answer/callback · log call · form task. Use Academy + Loom demos; Gamma/Canva for slides.
3. **Casey practice** — Form callbacks first · then more auto/Search calls on the HubSpot phone + app.
4. **Yelp (DigProf)** — $5/day on · stories + polish · track toward **20 Aug referrals**.
5. **LSA process (#2)** — Same-day statuses + Casey calendar.
6. **Answer rate** — ≥90% for 7 days → fund Digital Ads Maintenance ({{mgmt}}/mo).
7. **Known savings** — Cut waste already identified. Full audit stays parked.
