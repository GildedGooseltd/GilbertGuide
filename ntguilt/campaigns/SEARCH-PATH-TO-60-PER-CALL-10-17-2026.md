# Search path back to about $60 per call

Analyzed 10/17/2026 from Downloads plus archived Campaign / activities / Call details. Aggregates only. No caller rows.

Target: restore Search unit cost near the Jun/Jul proof band of about $55–$66 per Call details call. Guide kill switch stays ≤ $175. The $60 line is the proof benchmark, not a softer goal.

---

## 1. Verdict

You already proved ~$55–$60 per call on the ended Campaign Total twins:

| Campaign | All-time cost | Calls | $/call | Avg CPC | Click→call |
| --- | ---: | ---: | ---: | ---: | ---: |
| Military \| Search \| Calls | $11,500 | 208 | $55 | $12.31 | 22% |
| NTGUILT | $4,535 | 78 | $58 | $10.31 | 18% |

October MTD through 10/17/2026 is about **$467 per call** on live HS Search. That is not a small miss. It is a different auction and mix.

The identity that matters:

**$/call ≈ Avg CPC ÷ click→call rate**

Proof Military: $12.31 ÷ 0.223 ≈ $55.

October Military: $84.91 ÷ 0.154 ≈ $552.

You cannot reach $60 while Military average CPC sits near $85. Click→call help alone is not enough. CPC has to fall back toward the teens or low twenties, and Military click→call has to hold near 20–25%.

HS: DUI pav.law is closed as of 10/17/2026. Keep it paused. It spent ~$1,658 for 2 calls at ~$847 each and crushed account click→call with 434 clicks.

---

## 2. Proof months vs burn months

### 2.1 Unit cost by month

Sources: `account_activities_*` Search lines + Call details campaign rows. Guide `channelMonths` matches these phone counts.

| Month | Search $ | Search calls | $/call | What was live |
| --- | ---: | ---: | ---: | --- |
| Jun 2026 | $8,296 | 126 | **$66** | Military \| Search \| Calls · NTGUILT · Core DV |
| Jul 2026 | $7,262 | 131 | **$55** | Same ended stack + early HS shells |
| Aug 2026 | $1,775 | 30 | $59 | Thin · unpaid pause month |
| Sep 2026 | $13,651 | 41 | **$333** | HS: Military · HS: NTGUILT · HS: DV · Max Conv burn |
| Oct* 1–17 | $6,533 | 14 | **$467** | HS live · DUI click sink · then pause |

Jun/Jul were not magic. They bought cheap clicks that converted to phones. Sep/Oct buy expensive clicks that mostly do not.

### 2.2 Phone volume by campaign family

From Call details All-time export on disk through early October, then Oct calendar Call details (19).

| Month | Military family | NTGUILT family | Core / DV / DUI | Total |
| --- | ---: | ---: | ---: | ---: |
| May | 36 | 0 | 3 | 39 |
| Jun | 103 | 11 | 12 | 126 |
| Jul | 73 | 56 | 2 | 131 |
| Aug | 14 | 11 | 5 | 30 |
| Sep | 33 | 6 | 2 | 41 |
| Oct* 1–17 | 6 | 6 | 2 | 14 |

Proof months were Military-heavy with real phone volume. September still had Military click→call near 32% on Campaign report (40), but cost per call was already ~$187 because CPC had jumped to ~$59. Volume without cheap clicks is not the proof stack.

### 2.3 October MTD by live campaign

Campaign report (50) · Oct 1–17 · paired with activities Search lines.

| Campaign | Spend | Calls | $/call | Clicks | Click→call | Avg CPC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| HS: Military | $3,209–$3,311 | 6 | ~$535–$552 | 39 | 15% | $84.91 |
| HS: NTGUILT | $1,539 | 6 | ~$256 | 66 | 9% | $23.31 |
| HS: DUI pav.law | $1,658–$1,693 | 2 | ~$847 | 434 | 0.5% | $3.90 |
| Live HS blended | $6,533 | 14 | **$467** | ~539 | 2.6% | — |
| Ex-DUI only | ~$4,875 | 12 | **$406** | ~105 | 11% | — |

Pausing DUI removes the click sink. It does **not** by itself restore $60. Military + NTGUILT alone are still ~$400/call MTD.

---

## 3. What the proof stack looked like

### 3.1 Campaign structure

Ended twins that made the $55–$58 lifetime numbers:

- `Military | Search | Calls` · Campaign Total budget · later paused
- `NTGUILT` · Campaign Total · later paused
- `Core | DV | Search | Calls` · weaker unit cost historically ~$142 lifetime · not the $60 hero

Kate moved to Daily `HS:*` shells because Campaign Total cannot convert to Daily in the UI. That migration was correct for budget control. The quality and CPC of the new shells are what broke.

### 3.2 Economics of the proof stack

| Lever | Proof Military | Proof NTGUILT |
| --- | --- | --- |
| Avg CPC | ~$12 | ~$10 |
| Click→call | ~22% | ~18% |
| Implied $/call | ~$55 | ~$58 |
| Phone share | Dominant in Jun | Strong in Jul |

Guide also locked Jun Search spend $8,296 / 126 calls and Jul $7,262 / 131 calls. Same story as activities.

### 3.3 Setup notes that still apply

From locked Pav rules and build docs:

- Presence targeting · Front Range income + crime counties · not Springs-only
- Hire Exact/Phrase over Broad
- Primary bid goal = Calls from ads · total calls
- After Max Conv burn: Maximize clicks, then set CPC ceiling 170
- Daily budget is the second lid
- LSA off stays · do not refill LSA to “fix” Search $/call
- DUI pav.law landing test closed 10/17/2026 · stay paused

Early HS: NTGUILT build notes still listed Maximize conversions as a possible later step. That path burned Sep. Do not reopen uncapped Max Conv.

---

## 4. What broke after the HS migration

### 4.1 CPC inflation is the main driver

Military average CPC:

| Window | Avg CPC |
| --- | ---: |
| Ended Military all-time | $12.31 |
| HS: Military Sep 1–28 Campaign (40) | $59.02 |
| HS: Military Oct 1–17 Campaign (50) | $84.91 |

That is roughly **7×** proof CPC on the same practice lane.

NTGUILT Oct avg CPC ~$23 is closer to workable if click→call recovers. Military at $85 is not.

### 4.2 Max Conv + thin phone signal

September Search spend ~$13.7k for 41 phones. HS: DV alone ran ~$2,000+/call on Campaign (40). Portfolio Max Conv and uncapped conversion bidding learned on weak call volume and chased expensive clicks. That is the locked Max Conv signal-gate story. Do not repeat it.

### 4.3 Mix shift and click sinks

- Sep: HS: DV still spending with almost no phones
- Oct: HS: DUI pav.law bought 434 cheap clicks at ~$3.90 CPC with almost no phones
- Cheap CPC on a junk path still destroys account click→call and wastes daily budget that should sit on Military hire terms

### 4.4 Keyword economics on live HS

Search keyword report (59) All-time · Interactions used as click proxy.

| Campaign · match | Cost | Interactions | Avg cost |
| --- | ---: | ---: | ---: |
| HS: Military · Phrase | $7,198 | 106 | $68 |
| HS: Military · Exact | $1,602 | 19 | $84 |
| HS: Military · Broad | $2,031 | 52 | $39 · all Broad cost is on Paused rows |
| HS: NTGUILT · Phrase | $4,455 | 85 | $52 |
| HS: NTGUILT · Exact | $857 | 23 | $37 |

Military Broad is already paused on cost. The bleed is Enabled Phrase/Exact at $50–$180 average cost, not leftover Broad.

Highest lifetime cost Enabled terms still on Military include:

- "serious criminal charges lawyer"
- "fort carson legal help"
- "domestic violence assault lawyer" · very high avg cost
- "traffic ticket attorneys" / "traffic attorney" on Military
- [criminal attorney colorado springs] Exact · tiny interactions · very high avg cost

October phones that did land still cluster on a few of those same terms, especially `criminal attorney colorado springs` and Mil Felony. The terms can phone. They are just too expensive per click right now.

### 4.5 Ad group concentration

Ad group report (39) All-time cost leaders:

| Campaign | Ad group | Cost |
| --- | --- | ---: |
| HS: Military | Mil Felony | $4,010 |
| HS: Military | Mil Auto | $3,731 |
| HS: Military | Mil DV | $3,531 |
| HS: NTGUILT | Tickets | $3,378 |

Military Auto/traffic inside HS: Military competes with NTGUILT Tickets. Kate lock: Auto/traffic is always NTGUILT. Military should not keep buying generic ticket phrases if NT owns that lane.

### 4.6 Answer rate

Oct Call details (19): 14 calls · 5 missed · 9 received. About 36% missed. Five calls were 0 seconds. Proof months also missed a share, so this is not the whole $/call story, but every missed phone wastes a paid click. Intake cover is already “as covered as it will be.” Do not throttle dailies around intake theory. Do keep call assets and schedule aligned to hours that answer.

---

## 5. Path math · what combination hits ~$60

| Avg CPC | Click→call 15% | 20% | 25% | 30% |
| ---: | ---: | ---: | ---: | ---: |
| $12 | $80 | **$60** | $48 | $40 |
| $20 | $133 | $100 | $80 | **$67** |
| $30 | $200 | $150 | $120 | $100 |
| $50 | $333 | $250 | $200 | $167 |
| $85 | $567 | $425 | $340 | $283 |

Read it plain:

1. Proof recipe: ~$12 CPC and ~20–22% click→call.
2. If CPC only falls to ~$20, you need ~30% click→call to sit near $67.
3. At $85 CPC, even 30% click→call is still ~$283. That is why “just improve ads” will not get you to $60 while auctions stay this expensive.

---

## 6. Recommendations · sequence

Do these in order. Do not raise daily budgets first.

### Step 0 · Already done or keep locked

- HS: DUI pav.law paused · leave paused
- LSA off · leave off for this recovery
- Maximize clicks + CPC ceiling 170 on live HS · confirm in UI if Change history since 10/05 is not on disk
- Military daily $25 for OOO week stays until you choose a raise after unit cost improves
- No Broad re-enable
- No uncapped Maximize conversions

### Step 1 · Make Military cheap again before you fund it

Goal for Military: avg CPC trending under ~$25 within 7–14 days, then under ~$20.

Actions:

1. Pause or hard-cut Military traffic/ticket Phrases that belong on NTGUILT: "traffic ticket attorneys", "traffic attorney", Springs traffic Exact/Phrase that are not military-qualified.
2. Keep Fort Carson / UCMJ / active-duty / military DV-SA-felony hire terms. Those are the lane.
3. On Enabled Military terms with lifetime avg cost above ~$100 and weak phone proof, pause or leave for WEB review first. Highest avg-cost offenders from the keyword export: Exact [criminal attorney colorado springs], Phrase "domestic violence assault lawyer", Phrase "felony lawyer denver".
4. Do not raise Military daily while Oct MTD $/call is still hundreds. $25/day is a gate, not a failure, until CPC cools.

### Step 2 · Fund the phone lane you still have

NTGUILT Oct MTD ~$256/call is bad vs $60, but better than Military ~$535 and far better than DUI.

1. Keep NTGUILT on Maximize clicks + CPC 170.
2. Prefer Tickets + License terms that already produced October phones: colorado springs traffic lawyer, traffic ticket attorneys, dmv lawyer colorado, driving under restraint colorado.
3. Starve NTGUILT DUI Phrases with high avg cost and thin phones until Military/NT ticket economics stabilize. Example lifetime: "colorado dui lawyer" ~$114 avg cost on thin interactions.
4. After OOO, if NT phones hold and $/call falls under ~$175, raise NT daily before Military.

### Step 3 · Restore Military click→call to ≥20%

Military Oct click→call ~15%. Sep was ~32% on Campaign (40). The creative/match can still convert when the auction is right.

1. One Eligible RSA per live Military ad group. Do not pause working spenders to test twins.
2. Keep call assets and Presence.
3. Rank keep/pause by phones first, then clicks. Do not keep high-spend low-phone Exact only because Quality Score looks fine.

### Step 4 · Only then restore proof-shaped daily budgets

Proof months spent roughly $7k–$8k Search per month with 120+ phones. That is about $230–$270 Search/day blended across the old stack, mostly Military.

Rebuild toward that only after:

- Military avg CPC ≤ ~$25 for a full week
- Military click→call ≥ 20% on that week
- Blended Search $/call ≤ $175, then ≤ $100, then chase $60

Raise in 20–30% steps every 7–14 days. Do not jump Military from $25 to proof daily in one click while CPC is $85.

### Step 5 · Optional Editor cleanup pack after you confirm live UI

When you want a Post pack, pull same-day: Campaign · Ad · Ad group · Search keyword · Call details · Change history. Then pause only the Military traffic orphans and the worst high-CPC zero-phone Exact/Phrase rows that are still Enabled. One pack. No Broad Adds. No second RSA A/B.

---

## 7. Realistic timeline

| Horizon | Success look |
| --- | --- |
| This week | DUI stays off · Military traffic junk cut · no Max Conv · CPC 170 confirmed · daily lids hold |
| Next 7–14 days | Military avg CPC falling · blended Search $/call under $175 on a clean MTD window |
| Next 2–4 weeks | Military click→call ≥20% · blended toward $100 |
| Full proof restore | Avg CPC teens–low twenties · click→call ~20%+ · blended ~$60 · then raise dailies |

If CPC does not fall after cutting Military ticket bleed and keeping Max clicks + 170, the next check is geo bid adj and query reports for those remaining Phrases, not a budget raise.

---

## 8. What not to do

- Do not turn HS: DUI pav.law back on to “test volume”
- Do not turn LSA back on to paper over Search unit cost
- Do not add Broad for Limited by search volume
- Do not switch back to uncapped Maximize conversions
- Do not raise Military daily to chase June phone counts while CPC is ~$85
- Do not judge success from CTR alone · Sep CTR was fine while $/call burned
- Do not use Campaign All-time Cost ÷ Phone calls for the October tile · use same-window activities + Call details

---

## 9. Source files used

Downloads:

- Campaign report (50) · Oct 1–17
- Campaign report (49) · All time
- Campaign report (40)/(41) · Sep 1–28
- Call details (19) · Oct 1–17
- Call details (17)/(13) · All time phone history
- Call details (11) · Sep 1–28
- account_activities_202610 (2) · Oct Search HS lines
- account_activities_202609 (3) · Sep Search + LSA
- account_activities_202607(1) · Jul
- account_activities_202606 (1) · Jun
- Search keyword report (59) · All time
- Ad group report (39) · All time
- Location report (11) · All time

Archived:

- Ad Reports/exports/google-ads/monthly/2026-06 and 2026-07 Campaign reports
- Ad Reports/exports/2026-reference Campaign all-time NTGUILT/Military/Core as of 08/12/2026

Guide locks:

- `kpi-report.js` channelMonths · funnelAds · digitalGoals
- KATE-CONTEXT Pav Ads rows · Max Conv gate · calls = leads · DUI pause 10/17/2026

Related build docs:

- [HS-NTGUILT-DAILY-BUILD.md](HS-NTGUILT-DAILY-BUILD.md)
- [MILITARY-SEARCH-CHECKLIST.md](MILITARY-SEARCH-CHECKLIST.md)
- [PLAN-NT-VS-PAV-DUI-LANDING-10-01-2026.md](PLAN-NT-VS-PAV-DUI-LANDING-10-01-2026.md)

---

## 10. Bottom line

The $60/call account already existed on ended Military and NTGUILT twins at ~$10–$12 CPC and ~18–22% click→call. Live HS Search is the same practices at much higher CPC, thinner phones, and recent click-sink tests.

Path home:

1. Keep DUI and LSA off.
2. Cut Military’s non-military traffic spend.
3. Hold Max clicks + CPC 170 and low dailies until CPC falls.
4. Prefer NT phones while Military cools.
5. Raise budgets only after $/call clears $175, then $100, then the $60 proof band.
