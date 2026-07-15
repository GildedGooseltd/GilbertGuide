# Cockpit feedback — thumbs up / down (no Google Sheet)

Each KPI / chart card shows **👍** and **👎**. Votes save in the **browser** and ship via **Copy / Download / Email**.

## How scores are stored

| Place | What |
|-------|------|
| **This browser** | `localStorage` key `pav-metrics-feedback-v2` — score bar + selected thumbs survive refresh on that device |
| **Copy report** | Plain-text score list → clipboard (paste into Slack, Notes, email) |
| **Download JSON** | File `gilbert-kpi-ratings-….json` with full vote log |
| **Email Kate** | Opens mail draft to `support@gildedgooselimited.com` with the report |

**Google Sheet / MetricsFeedback webhook is not used** for thumbs (that path was unreliable).

## Reviewer UX

1. KPIs tab — optional name in the rating bar.
2. Tap 👍 / 👎 under cards (same thumb again clears).
3. When done: **Copy report**, **Download JSON**, or **Email Kate**.

## Kate — reading scores

- Email inbox, or  
- JSON they download / forward, or  
- Text they paste from **Copy report**.
