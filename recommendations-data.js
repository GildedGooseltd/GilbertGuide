/**
 * AUTO-GENERATED — do not edit. Source: content/recommendations.md
 * Rebuild: npm run build
 */
window.RECOMMENDATIONS_CONTENT = {
  "page": {
    "title": "Recommendations",
    "subtitle": "Ranked by INDEX project score — ship lower numbers first."
  },
  "jump": [
    {
      "rank": "1",
      "label": "#1–2 Intake",
      "anchor": "recommendation-primary"
    },
    {
      "rank": "2",
      "label": "#11 Sex Crimes",
      "anchor": "recommendation-sex-crimes"
    },
    {
      "rank": "3",
      "label": "#26 Financial audit",
      "anchor": "recommendation-financial-audit"
    },
    {
      "rank": "4",
      "label": "LSA divert",
      "anchor": "recommendation-divert"
    },
    {
      "rank": "",
      "label": "Projects",
      "anchor": "recommendation-projects"
    },
    {
      "rank": "",
      "label": "Actions",
      "anchor": "recommendation-actions"
    }
  ],
  "recs": [
    {
      "id": "recommendation-primary",
      "stats": [
        {
          "label": "LSA $/call",
          "value": "{{lsaCpl}}",
          "context": "June LSA"
        },
        {
          "label": "Digital media $/call",
          "value": "{{digCpl}}",
          "context": "Search media only"
        },
        {
          "label": "Digital all-in $/call",
          "value": "{{digAllIn}}",
          "context": "Media + consulting"
        }
      ],
      "proof": [
        "Minimum shift = {{mgmt}} consulting + {{breakEvenMedia}} digital media = {{minDivert}}/mo",
        "LSA = {{junLsaSpend}} ÷ {{junLeads}} calls = {{lsaCpl}}/call",
        "Digital all-in = ({{junAdsSpend}} + {{mgmt}}) ÷ {{junAdsLeads}} = {{digAllIn}}/call"
      ],
      "projects": [],
      "actions": [],
      "title": "1 · Project #1–2 · LSA call intake + digital Search shift",
      "hint": "Fix unanswered calls before more LSA spend; then shift qualified media to digital Search.",
      "why": "LSA costs {{lsaCpl}}/call vs digital all-in {{digAllIn}}/call. Missed calls waste both channels until answer rate is fixed.",
      "solutions": "Ship [B2 · HubSpot Phone / VoIP](project:B2) (#1) and [B11 · LSA Call Process](project:B11) (#2). Gate: **≥90% answered for 7 days**. Keep the [Digital Ads Maintenance Retainer](project:RETAINER) funded, then divert ≥ {{minDivert}}/mo from LSA.",
      "proofTitle": "Proof / math"
    },
    {
      "id": "recommendation-sex-crimes",
      "stats": [
        {
          "label": "Mean quoted fee",
          "value": "$9,500",
          "context": "n=6 sample"
        },
        {
          "label": "2025 YTD",
          "value": "13",
          "context": "Cases"
        },
        {
          "label": "2026 YTD",
          "value": "5",
          "context": "Cases"
        },
        {
          "label": "YTD change",
          "value": "−62%",
          "context": "Below prior year"
        }
      ],
      "proof": [
        "8 fewer YTD cases × $9,500 = $76,000 quoted gap",
        "$76,000 × 80% = $60,800 collectible gap",
        "Recovery = 5 YTD + 8 H2 cases = 13 full-year cases"
      ],
      "projects": [],
      "actions": [],
      "title": "2 · Project #11 · Sex Crimes Defense focus",
      "hint": "Highest mean quoted fee; 2026 YTD case volume is 62% behind 2025.",
      "whyStatus": "Watch",
      "why": "Highest fee category (~70% above the $5,587 firm mean) with an 8-case YTD gap ≈ **$76k quoted** / **$60.8k** at 80% collectible. Sample n=6 — directional until QuickBooks validates.",
      "solutions": "Launch a discreet Search pilot in [A1 · Digital Ad Enhancements](project:A1) (#11): exact/phrase only, dedicated landing page, tracked calls. No Display or broad match. Gate: 30-day qualified-call + signed-case review."
    },
    {
      "id": "recommendation-financial-audit",
      "stats": [
        {
          "label": "Known 30-day waste",
          "value": "$1,063",
          "context": "Search floor"
        },
        {
          "label": "Annualized floor",
          "value": "$12,756",
          "context": "If unchanged"
        },
        {
          "label": "H1 after expenses",
          "value": "+$29,534*",
          "context": "Excludes unknown debt"
        }
      ],
      "proof": [
        "$1,063 × 12 = $12,756 annualized Search waste if unchanged",
        "H1 collectible $509,534 − $480,000 expenses = +$29,534* · *excludes unknown debt",
        "Savings windows: subscriptions 12 mo · vendor-rate changes 6 mo · variable ops 3 mo · one-time recoveries when posted. Do not double-count the ~$694 Military Display subset inside the $1,063 floor."
      ],
      "projects": [],
      "actions": [],
      "title": "3 · Project #26 · Full financial audit (B9)",
      "hint": "Map debt, cut recurring waste, recover credits — do not treat H1 surplus as cash-safe.",
      "whyStatus": "Action required",
      "why": "+$29,534 H1 collectible-after-expenses excludes **unknown business debt** — treat it as unreliable. Verified Search waste floor is $1,063 / 30 days; unused subscriptions still lack a cancel total.",
      "solutions": "Open [B9 · Full Financial Audit](project:B9) (#26). Reconcile QuickBooks, statements, liabilities, subscriptions, phone/software seats, ads, LSA credits, and toll-pass payment + plates. Fee: $1,800 + 20% verified savings.",
      "proofTitle": "Proof / payment terms"
    },
    {
      "id": "recommendation-divert",
      "stats": [
        {
          "label": "Minimum divert",
          "value": "{{minDivert}}/mo",
          "context": "Consulting + media"
        },
        {
          "label": "To consulting",
          "value": "{{mgmt}}",
          "context": "Retainer first"
        },
        {
          "label": "To digital media",
          "value": "{{breakEvenMedia}}",
          "context": "Search after gate"
        }
      ],
      "proof": [],
      "projects": [],
      "actions": [],
      "title": "4 · After #1–2 answer-rate gate · Divert from LSA",
      "hint": "Pay consulting first; remaining diverted dollars go to digital media.",
      "whyStatus": "Watch",
      "why": "After ≥90% answered for 7 days, LSA’s higher $/call only pays if it signs ≥ **{{closeMultiple}}×** better than digital. Calls ≠ signed cases — confirm close rates before moving budget.",
      "solutions": "Divert ≥ {{minDivert}}/mo from LSA → consulting + Search. Hold 30 days; track signed-case rate by channel.",
      "proofTitle": "Full divert split table",
      "proofType": "divert-table"
    },
    {
      "id": "recommendation-projects",
      "stats": [],
      "proof": [],
      "projects": [
        {
          "project": "[B2 · HubSpot Phone / VoIP Setup](project:B2)",
          "priority": "#1 · WIP",
          "fee": "$0 · incl. B13",
          "role": "Route + log Search/LSA; same-day missed-call tasks",
          "gate": "≥90% answered · 7 days; 888 → HubSpot test passes"
        },
        {
          "project": "[B11 · LSA Call Process Update](project:B11)",
          "priority": "#2 · Recommended",
          "fee": "$1,500",
          "role": "Statuses, call review, Casey coverage",
          "gate": "Statuses current; disputes caught; coverage calendar live"
        },
        {
          "project": "[RETAINER · Digital Ads Maintenance](project:RETAINER)",
          "priority": "Required",
          "fee": "{{mgmt}}/mo",
          "role": "Steward LSA/Search after the answer-rate gate",
          "gate": "Funded before media shift; no second consulting fee"
        },
        {
          "project": "[A1 · Digital Ad Enhancements](project:A1)",
          "priority": "#11 · Available",
          "fee": "$2,200",
          "role": "Sex Crimes Defense Search pilot + landing page",
          "gate": "Qualified calls + signed cases; QuickBooks validates cash"
        },
        {
          "project": "[B9 · Full Financial Audit](project:B9)",
          "priority": "#26 · Recommended",
          "fee": "$1,800 + 20% savings",
          "role": "Debt map, subscriptions, waste, credits",
          "gate": "Every recurring charge/liability has owner + action; savings documented"
        }
      ],
      "actions": [],
      "title": "Projects required",
      "hint": "Ordered by INDEX Project score (lower first).",
      "bodyType": "projects-table"
    },
    {
      "id": "recommendation-actions",
      "stats": [],
      "proof": [],
      "projects": [],
      "actions": [
        "**B2 (#1)** — Hold extra LSA spend; patch routing + missed-call tasks. *Gate:* 888 rings HubSpot end-to-end.",
        "**B11 (#2)** — Same-day LSA statuses + Casey coverage calendar. *Gate:* statuses current before billing.",
        "**Answer rate** — Reach ≥90% answered for 7 days, then fund the **RETAINER** ({{mgmt}}/mo).",
        "**A1 (#11)** — Sex Crimes Defense Search pilot (exact/phrase only). *Gate:* 30-day call + signed-case review.",
        "**B9 (#26) + divert** — Map debt/subscriptions; divert ≥ {{minDivert}}/mo from LSA for 30 days. *Gate:* signed-case rate by channel + verified savings list."
      ],
      "title": "Next actions",
      "hint": "Same order as INDEX Project score.",
      "bodyType": "actions-list"
    }
  ]
};
