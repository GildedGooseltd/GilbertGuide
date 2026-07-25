# Parked — Ask Gilbert (word cloud)

**Status:** Hidden on live Guide (2026-07-25). Work here, then restore into `index.html`.  
**Live shell:** `#gilbert-priority-dock` in `index.html` — keep `hidden` + `aria-hidden="true"` until ready.  
**Logic stays in:** `app.js` (`GILBERT_CLOUD`, `renderGilbertSurvey()`, cloud ranking → Pav Priorities).

Do not delete `app.js` cloud code while parked — Best Fit scoring still uses `#goal-input` and cloud selection state when present.

**Hide note:** `.gilbert-inline-panel { display: flex }` overrides native `[hidden]`. Live CSS forces `#gilbert-priority-dock[hidden] { display: none !important }`. Keep that rule when parked.

---

## Restore checklist

1. In `index.html`, remove `hidden` and `aria-hidden` from `#gilbert-priority-dock`.
2. Confirm `.pav-guide-ask-section` is two columns again (CSS `:has([hidden])` override drops automatically).
3. Put back the Project Outlines blurb line about Ask Gilbert if you want it.
4. Hard-refresh; tap topics and confirm Pav Priorities re-ranks.

---

## HTML shell (paste back into `.pav-guide-ask-section` left column)

```html
<aside class="gilbert-inline-panel" id="gilbert-priority-dock" aria-label="Ask Gilbert">
  <div class="gilbert-inline-head">
    <img id="gilbert-launcher-img" class="gilbert-launcher-fig" src="assets/gilbert-thinking.png?v=20260714h" alt="">
    <div class="gilbert-inline-titles">
      <p class="gilbert-dock-hint">Ask Gilbert <span class="tab-help" data-help-title="Ask Gilbert" data-help-desc="Tap a topic word to drill into keywords. Pick as many as fit and open several branches — Pav Priorities on the right re-ranks to your best-fit shortlist. Clears on refresh." aria-label="How to use Ask Gilbert">?</span></p>
      <p class="gilbert-inline-sub">Tap topics — best-fit projects</p>
    </div>
  </div>
  <div class="gilbert-survey-wrap" id="gilbert-survey" aria-label="Project fit survey">
    <!-- filled by app.js renderGilbertSurvey() -->
  </div>
  <input type="hidden" id="goal-input" value="" autocomplete="off">
  <div class="gilbert-chat-messages" id="gilbert-chat-messages" hidden aria-hidden="true"></div>
</aside>
```

`#goal-input` must stay in the live DOM even while the dock is hidden (scoring reads it).

---

## CSS (live in `index.html`)

Block starts ~`.pav-guide-ask-section` through `.gilbert-inline-panel .gilbert-chat-messages[hidden]`.  
Word cloud: `.gilbert-cloud`, `.gilbert-cloud-cat`, `.gilbert-cloud-kw`, branches, badges.

While parked, this rule keeps Best Fit full-width:

```css
.pav-guide-ask-section:has(#gilbert-priority-dock[hidden]) {
  grid-template-columns: 1fr;
}
```

---

## JS entry points (`app.js`)

| Piece | Where |
|---|---|
| Topic tree | `GILBERT_CLOUD` (top of file) |
| Render | `renderGilbertSurvey()` |
| Layout | `cloudPositions()` |
| Ranking | `gilbertRankedPicks()` + goal sync into `#goal-input` |
| Session clear | refresh clears `state.cloudOpen` / `cloudSelected` |

---

## WIP notes

- Multi-level drill-down was deferred earlier — resume design here before un-hiding.
- Chat UI (`.gilbert-chat-wrap`) is already forced off in CSS; cloud survey is the live agent surface.
