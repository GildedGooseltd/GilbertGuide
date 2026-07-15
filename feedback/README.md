# Cockpit feedback — Google Form popup

**Feedback** on the cockpit opens a popup with an embedded **Google Form**. Responses land in the linked spreadsheet (Form Responses tab).

## Sheet

[Pav Law feedback spreadsheet](https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit?gid=0#gid=0)

## Wire the form (once)

1. Create the form (pick one):
   - Sheet → **Tools → Create a new form**, add questions, **Send** → copy link  
   - Or Apps Script → Run **`createCockpitFeedbackForm`** → copy published URL from **Execution log**
2. Paste into `pages-config.js` (and `pages-config.defaults.js` if you use deploy fallback):

```js
feedbackFormUrl: "https://docs.google.com/forms/d/e/XXXX/viewform"
```

3. Hard-refresh the cockpit. **Feedback** opens the popup with that form.

Embed needs a `/viewform` URL (prefer that over short `forms.gle` links).

## Old MetricsFeedback webhook ratings

Card-by-card “Feedback mode” + webhook Save is retired on the cockpit UI in favor of this Form popup. Apps Script `handleMetricsFeedback` remains for any older clients.
