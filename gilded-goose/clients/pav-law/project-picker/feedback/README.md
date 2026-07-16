# Cockpit feedback — parked for later

**Status (2026-07-15):** Comment / Send / thumbs UI is **off** in the live cockpit.

## Restore later

1. Copy `feedback/metrics-feedback-comments.parked.js` → `metrics-feedback.js`
2. In `index.html`, keep `<script src="metrics-feedback.js?v=…">` and bump `?v=`
3. Finish **T065** first: Apps Script New version so ping shows `"metricsFeedback":true`, then push GilbertGuide
4. Test: comment → **Send comments** → Sheet tab **MetricsFeedback** + support email

## Parked file

| File | What |
|------|------|
| `metrics-feedback-comments.parked.js` | Comments-only UI + localStorage + Send (webhook) + Download |
| `../apps-script-webhook.gs` | `handleMetricsFeedback` + MailApp (unchanged; still needed for roll-out) |

## Not used while parked

- No comment boxes / rating bar on KPIs
- No automatic Sheet or email from cockpit ratings

Owner webhook ping: [owner-webhook-setup.html](../owner-webhook-setup.html)
