# Cockpit feedback — thumbs up / down (no Google Sheet)

Each KPI / chart card shows **👍**, **👎**, and a **Comment** box. Votes and notes save in the **browser** and ship via **Download Feedback Report**.

## How scores are stored

| Place | What |
|-------|------|
| **This browser** | `localStorage` key `pav-metrics-feedback-v2` — score bar + selected thumbs survive refresh on that device |
| **Download Feedback Report** | File `gilbert-feedback-report-….json` with full vote log |

**Google Sheet / MetricsFeedback webhook is not used** for thumbs (that path was unreliable).

## Reviewer UX

1. KPIs tab — score bar at top.
2. Tap 👍 / 👎 under cards (same thumb again clears).
3. Type an optional **Comment** under any box (saved on blur).
4. When done: **Download Feedback Report**.

## Kate — reading scores

JSON they download / forward.
