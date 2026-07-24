# Recommendations

Edit this file, then run `npm run build` in `project-picker/` and hard-refresh the Guide.
Tokens like `{{lsaCpl}}` fill from live June LSA / digital math at render time.
Project links: `[Label](project:B2)` → opens that Guide project.

Order follows **INDEX Project score** (lower number first).

---

## Page

| Field | Value |
| ----- | ----- |
| **Title** | Recommendations |
| **Subtitle** | Ranked by INDEX project score — ship lower numbers first. |

## Jump

| Rank | Label | Anchor |
| ---- | ----- | ------ |
| 1 | #1–2 Intake | recommendation-primary |
| 2 | #11 Sex Crimes | recommendation-sex-crimes |
| 3 | #26 Financial audit | recommendation-financial-audit |
| 4 | LSA divert | recommendation-divert |
|  | Projects | recommendation-projects |
|  | Actions | recommendation-actions |

---

## Rec · recommendation-primary

| Field | Value |
| ----- | ----- |
| **Title** | 1 · Project #1–2 · LSA call intake + digital Search shift |
| **Hint** | Fix unanswered calls before more LSA spend; then shift qualified media to digital Search. |
| **Why** | LSA costs {{lsaCpl}}/call vs digital all-in {{digAllIn}}/call. Missed calls waste both channels until answer rate is fixed. |
| **Solutions** | Ship [B2 · HubSpot Phone / VoIP](project:B2) (#1) and [B11 · LSA Call Process](project:B11) (#2). Gate: **≥90% answered for 7 days**. Keep the [Digital Ads Maintenance Retainer](project:RETAINER) funded, then divert ≥ {{minDivert}}/mo from LSA. |
| **Proof title** | Proof / math |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| LSA $/call | {{lsaCpl}} | June LSA |
| Digital media $/call | {{digCpl}} | Search media only |
| Digital all-in $/call | {{digAllIn}} | Media + consulting |

### Proof

- Minimum shift = {{mgmt}} consulting + {{breakEvenMedia}} digital media = {{minDivert}}/mo
- LSA = {{junLsaSpend}} ÷ {{junLeads}} calls = {{lsaCpl}}/call
- Digital all-in = ({{junAdsSpend}} + {{mgmt}}) ÷ {{junAdsLeads}} = {{digAllIn}}/call

---

## Rec · recommendation-sex-crimes

| Field | Value |
| ----- | ----- |
| **Title** | 2 · Project #11 · Sex Crimes Defense focus |
| **Hint** | Highest mean quoted fee; 2026 YTD case volume is 62% behind 2025. |
| **Why status** | Watch |
| **Why** | Highest fee category (~70% above the $5,587 firm mean) with an 8-case YTD gap ≈ **$76k quoted** / **$60.8k** at 80% collectible. Sample n=6 — directional until QuickBooks validates. |
| **Solutions** | Launch a discreet Search pilot in [A1 · Digital Ad Enhancements](project:A1) (#11): exact/phrase only, dedicated landing page, tracked calls. No Display or broad match. Gate: 30-day qualified-call + signed-case review. |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Mean quoted fee | $9,500 | n=6 sample |
| 2025 YTD | 13 | Cases |
| 2026 YTD | 5 | Cases |
| YTD change | −62% | Below prior year |

### Proof

- 8 fewer YTD cases × $9,500 = $76,000 quoted gap
- $76,000 × 80% = $60,800 collectible gap
- Recovery = 5 YTD + 8 H2 cases = 13 full-year cases

---

## Rec · recommendation-financial-audit

| Field | Value |
| ----- | ----- |
| **Title** | 3 · Project #26 · Full financial audit (B9) |
| **Hint** | Map debt, cut recurring waste, recover credits — do not treat H1 surplus as cash-safe. |
| **Why status** | Action required |
| **Why** | +$29,534 H1 collectible-after-expenses excludes **unknown business debt** — treat it as unreliable. Verified Search waste floor is $1,063 / 30 days; unused subscriptions still lack a cancel total. |
| **Solutions** | Open [B9 · Full Financial Audit](project:B9) (#26). Reconcile QuickBooks, statements, liabilities, subscriptions, phone/software seats, ads, LSA credits, and toll-pass payment + plates. Fee: $1,800 + 20% verified savings. |
| **Proof title** | Proof / payment terms |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Known 30-day waste | $1,063 | Search floor |
| Annualized floor | $12,756 | If unchanged |
| H1 after expenses | +$29,534* | Excludes unknown debt |

### Proof

- $1,063 × 12 = $12,756 annualized Search waste if unchanged
- H1 collectible $509,534 − $480,000 expenses = +$29,534* · *excludes unknown debt
- Savings windows: subscriptions 12 mo · vendor-rate changes 6 mo · variable ops 3 mo · one-time recoveries when posted. Do not double-count the ~$694 Military Display subset inside the $1,063 floor.

---

## Rec · recommendation-divert

| Field | Value |
| ----- | ----- |
| **Title** | 4 · After #1–2 answer-rate gate · Divert from LSA |
| **Hint** | Pay consulting first; remaining diverted dollars go to digital media. |
| **Why status** | Watch |
| **Why** | After ≥90% answered for 7 days, LSA’s higher $/call only pays if it signs ≥ **{{closeMultiple}}×** better than digital. Calls ≠ signed cases — confirm close rates before moving budget. |
| **Solutions** | Divert ≥ {{minDivert}}/mo from LSA → consulting + Search. Hold 30 days; track signed-case rate by channel. |
| **Proof title** | Full divert split table |
| **Proof type** | divert-table |

### Stats

| Label | Value | Context |
| ----- | ----- | ------- |
| Minimum divert | {{minDivert}}/mo | Consulting + media |
| To consulting | {{mgmt}} | Retainer first |
| To digital media | {{breakEvenMedia}} | Search after gate |

---

## Rec · recommendation-projects

| Field | Value |
| ----- | ----- |
| **Title** | Projects required |
| **Hint** | Ordered by INDEX Project score (lower first). |
| **Body type** | projects-table |

### Projects table

| Project | Score / status | Fee | Role | Success gate |
| ------- | -------------- | --- | ---- | ------------ |
| [B2 · HubSpot Phone / VoIP Setup](project:B2) | #1 · WIP | $0 · incl. B13 | Route + log Search/LSA; same-day missed-call tasks | ≥90% answered · 7 days; 888 → HubSpot test passes |
| [B11 · LSA Call Process Update](project:B11) | #2 · Recommended | $1,500 | Statuses, call review, Casey coverage | Statuses current; disputes caught; coverage calendar live |
| [RETAINER · Digital Ads Maintenance](project:RETAINER) | Required | {{mgmt}}/mo | Steward LSA/Search after the answer-rate gate | Funded before media shift; no second consulting fee |
| [A1 · Digital Ad Enhancements](project:A1) | #11 · Available | $2,200 | Sex Crimes Defense Search pilot + landing page | Qualified calls + signed cases; QuickBooks validates cash |
| [B9 · Full Financial Audit](project:B9) | #26 · Recommended | $1,800 + 20% savings | Debt map, subscriptions, waste, credits | Every recurring charge/liability has owner + action; savings documented |

---

## Rec · recommendation-actions

| Field | Value |
| ----- | ----- |
| **Title** | Next actions |
| **Hint** | Same order as INDEX Project score. |
| **Body type** | actions-list |

### Actions

1. **B2 (#1)** — Hold extra LSA spend; patch routing + missed-call tasks. *Gate:* 888 rings HubSpot end-to-end.
2. **B11 (#2)** — Same-day LSA statuses + Casey coverage calendar. *Gate:* statuses current before billing.
3. **Answer rate** — Reach ≥90% answered for 7 days, then fund the **RETAINER** ({{mgmt}}/mo).
4. **A1 (#11)** — Sex Crimes Defense Search pilot (exact/phrase only). *Gate:* 30-day call + signed-case review.
5. **B9 (#26) + divert** — Map debt/subscriptions; divert ≥ {{minDivert}}/mo from LSA for 30 days. *Gate:* signed-case rate by channel + verified savings list.
