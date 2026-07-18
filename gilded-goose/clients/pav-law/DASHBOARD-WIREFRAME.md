# Pav Law — KPI dashboard wireframe

**Purpose:** Layout approval before Gilbert A8 build.  
**Gilbert Guide (live preview):** [`project-picker/kpi-wireframe.html`](project-picker/kpi-wireframe.html) — **Reporting & dashboards** tab on [Gilbert Guide](https://gildedgooseltd.github.io/GilbertGuide/) after push.  
**Interactive wireframe (edit):** [`project-picker/wireframe/pav-law-kpi-wireframe.canvas.tsx`](project-picker/wireframe/pav-law-kpi-wireframe.canvas.tsx) — Cursor canvas; copy from `canvases/` when updating.  
**KPI source:** [`kpi-list.md`](kpi-list.md) (29 locked metrics)  
**Brand:** GGL cream · gold · royal purple (`project-picker/index.html` tokens)

**Status:** Round 1 merged · revisions needed · update `kpi-wireframe.html` when canvas layout changes until better sync tooling exists.

All numbers below are **dummy data** for layout only.

---

## Page flow (top → bottom)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Pav Law KPI Report · [Month Year] · GGL brand      │
├─────────────────────────────────────────────────────────────┤
│  ACTION ITEMS (4)                              [red badge]  │
├─────────────────────────────────────────────────────────────┤
│  MONTHLY COCKPIT — #01 leads · #02 cases (2 gauges only)    │
├─────────────────────────────────────────────────────────────┤
│  BUSINESS HEALTH & CASE PIPELINE                            │
│  [#19 MISSED REVENUE ALERT — top, full width]               │
│  BHI score + pillar table │ metric chips #12 #15 #22        │
│  #28 · #29 · case pipeline + avg closed time                │
├─────────────────────────────────────────────────────────────┤
│  LEAD CHANNEL EXPANSION                                     │
│  [goose icons] LSA + Search highlights (click pop-up)       │
│  ▼ #01 channel table (counts · Δ · costs)                   │
│  stacked bar │ ▼ #10 source mix table │ donut │ bar #08     │
├─────────────────────────────────────────────────────────────┤
│  MARKETING SPEND EFFICIENCY                                 │
│  cost/call table · referral table                           │
├─────────────────────────────────────────────────────────────┤
│  MARKETING INVESTMENT MODEL                                 │
│  what-if calculator · platform vs GGL split · ROI compare   │
├─────────────────────────────────────────────────────────────┤
│  FULL FUNNEL CYCLE                                          │
│  $ in → leads → consults → cases → revenue out              │
├─────────────────────────────────────────────────────────────┤
│  SALES INTAKE PERFORMANCE                                   │
│  #21 big stat + trend line · table #20 #23–#27              │
└─────────────────────────────────────────────────────────────┘
```

---

## Section rules

| Block | Content |
|-------|---------|
| **Action items** | Required follow-up · stays until done |
| **Monthly Cockpit** | Count gauges only: #01 · #02 |
| **Business Health & Case Pipeline** | #19 alert top · BHI · pillars table · chips #12 #15 #22 · #28 #29 · pipeline |
| **Lead Channel Expansion** | Goose-icon highlights · expandable #01 + #10 tables |
| **Marketing Spend Efficiency** | Drill tables — no duplicate cockpit headlines |
| **Marketing Investment Model** | Budget→leads→revenue calculator · platform vs GGL split · prior-period ROI |
| **Full Funnel Cycle** | Dollars in through leads/consults/cases/revenue out |
| **Sales Intake Performance** | #21 stat + line · scannable table #20 #23–#27 |

**Gilbert:** No “Gilbert” text labels. Goose icon placements TBD; notes in `GILBERT-NOTES.md`.

---

## Gauge scale

Gold → royal → green arc fill · **red only on ↓ MoM** · at 100%: full half-moon clipped to downloaded peacock feather emblem + magenta quill overlay (`canvases/peacock-feather-emblem.png`).

---

## Approve / change

Comment in chat or edit wireframe canvas.
