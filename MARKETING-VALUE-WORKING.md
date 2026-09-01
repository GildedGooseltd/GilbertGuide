# Marketing value · working analysis

Status: draft for Kate to edit and respond in-line. Aggregates only — no client names, phones, or row-level exports in this file.

Related: [kpi-report.js](kpi-report.js) · [CLIENT-VALUE-BASELINE.md](CLIENT-VALUE-BASELINE.md) · [PAID-MEDIA-OPS-DRAFT.md](PAID-MEDIA-OPS-DRAFT.md) · [DATA-PULL-LIST.md](../../../Ad Reports/DATA-PULL-LIST.md)

As of: 2026-09-01

Scope this round: **MyCase only.** Paid media, HubSpot, Yelp, and GA4 stay on Aug 24 pulls until a later pass.

---

## How to use this doc

1. Read each section finding.
2. Add notes under **Kate response** lines — agree, reject, or add context Andrew should see.
3. Flag anything that needs a fresh export before we lock a client-facing story.

---

## Data limits — read before trusting any number


| Topic              | What we have                                                                         | What we do not have                               |
| ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Cash on the dash   | Aug **$104,545** · Trust account activity → `ledger_account_activity_report (4).csv` | Billed revenue or profit                          |
| MyCase UI name     | **Trust account activity** — export only; cannot save in MyCase                      | —                                                 |
| Aug leads / Search | Search calls through **Aug 14** · LSA inbox through **Aug 21**                       | **Deferred** — not updating this round            |
| Aug Search ads     | **Paused unpaid** — prior pull only                                                  | **Deferred**                                      |
| LSA Aug            | Prior pull · $6,286 media · 61 inbox                                                 | **Deferred**                                      |
| Case duration      | `case_list_report (2).csv` — tiny Aug snapshot · stage days only                     | Closed-matter export with close dates by practice |
| Sample size        | May–Jul = **3 full months** with full lead stack                                     | Too few months for statistical proof alone        |


Cash ≠ contracted fee ≠ lifetime collected on `Case_revenue_*.csv`. For “value of a signed case,” use mean contracted fee **$5,662 · n=138** as a proxy when cash timing is unknown.

Kate response:

---

## Monthly stack — leads, spend, cases, cash

Search + LSA media only. HubSpot forms fee and management retainer not in media column.


| Month | Search calls | LSA inbox | Total leads | Search $ | LSA $  | Media $ | New cases | Lead→case same month | Cash collected ledger |
| ----- | ------------ | --------- | ----------- | -------- | ------ | ------- | --------- | -------------------- | --------------------- |
| May   | 39           | 72        | 111         | 6,005    | 11,006 | 17,011  | 22        | 19.8%                | 92,140                |
| Jun   | 138          | 83        | 226         | 8,296    | 13,206 | 21,502  | 36        | 15.9%                | 103,485               |
| Jul   | 131          | 132       | 267         | 7,262    | 14,556 | 21,818  | 35        | 13.1%                | 108,350               |
| Aug*  | 25           | 61        | 86          | 400      | 6,286  | 6,686   | 19        | 22.1%                | 104,545               |


Aug* leads and media from **Aug 24 paid-media pull — frozen.** Cash and cases from **MyCase Sep 1 pull.**

Kate response:

---

## Correlation — leads and cases

Computed on May–Jul full months unless noted. Pearson r on four monthly points — directional only, not proof of causation.


| Pair                           | May–Jul r | May–Aug* r | Plain read                                                   |
| ------------------------------ | --------- | ---------- | ------------------------------------------------------------ |
| Total leads → cases same month | 0.949     | 0.971      | When lead stack rises, cases rise same month                 |
| Search calls → cases           | 1.000     | 0.999      | Search volume tracks cases tightly in this window            |
| Media spend → cases            | 0.992     | 0.876      | Spend and cases move together until Aug* breaks the pattern  |
| Leads → cash collected         | 0.999     | 0.860      | Cash follows lead volume in strong months                    |
| Cash → cases same month        | 0.936     | 0.864      | Cash lags signing — same-month tie is weaker than leads→cash |


Lead→case same-month rate fell May→Jul even while volume rose: **19.8% → 15.9% → 13.1%**. Intake or mix may be converting a smaller share, or cases are coming from older pipeline.

### Lag check — prior month leads vs this month cases


| This month cases | Prior month leads | Implied rate |
| ---------------- | ----------------- | ------------ |
| Jun 36           | May 111           | 32.4%        |
| Jul 35           | Jun 226           | 15.5%        |
| Aug* 19          | Jul 267           | 7.1%         |


Aug* at 7.1% looks like a lag story — Jul leads still feeding Aug signs — plus Aug is partial on cases and leads. Do not treat 7.1% as the true conversion rate.

Kate response:

---

## Correlation — spend and cases


| Month | Media $ | Cases | Cases per $1k media | Search $/call | LSA $/inbox lead |
| ----- | ------- | ----- | ------------------- | ------------- | ---------------- |
| May   | 17,011  | 22    | 1.29                | 154           | 153              |
| Jun   | 21,502  | 36    | 1.67                | 60            | 159              |
| Jul   | 21,818  | 35    | 1.60                | 55            | 110              |
| Aug*  | 6,686   | 19    | 2.84                | 16            | 103              |


Aug* shows higher cases per $1k because Search spend collapsed while LSA still produced inbox volume and cases still landed from prior pipeline.

Jul vs Aug* media change: **−$15,132** total · Search cut **−$6,862** · LSA cut **−$8,270**.

Kate response:

---

## Case timing by type — what we can and cannot say

### Contract value by practice — mean quoted fee, not duration

From Contact aggregates · n≥5 · [fee-means-by-practice.csv](../../../Ad Reports/exports/mycase/as-of-2026-09-01/fee-means-by-practice.csv)


| Practice                  | n   | Mean fee |
| ------------------------- | --- | -------- |
| Theft / Property          | 10  | 8,000    |
| Sex Assault / Sex Offense | 9   | 7,778    |
| Assault / Menacing        | 17  | 7,721    |
| Domestic Violence / DV    | 35  | 5,693    |
| Criminal Defense other    | 21  | 4,471    |
| Probation Revocation      | 9   | 4,056    |
| DUI / DWAI / Traffic      | 20  | 3,600    |


Higher-fee matters are not automatically longer — we need close dates to tie duration to type.

### Days in current stage — Aug snapshot only

Source: `case_list_report (2).csv` · open matters · **n=12** rows with stage day counts · not closed-matter duration.


| Practice area    | n   | Median days in current stage | Mean |
| ---------------- | --- | ---------------------------- | ---- |
| Criminal Defense | 9   | 19                           | 16   |


Closed in that export: 2 matters · 6 and 10 days open→close — too few to generalize.

### Cash timing proxy — ledger credits ÷ new cases same month


| Month                          | Cash per new case |
| ------------------------------ | ----------------- |
| Jan–Apr 2026                   | 4,668–5,996       |
| May                            | 4,188             |
| Jun                            | 2,874             |
| Jul                            | 3,095             |
| Aug* ledger partial            | 3,160             |
| Aug full electronic ÷ 19 cases | ~5,318            |


Jun–Jul cash per case runs below mean fee — collections trail signing. Aug* ledger is truncated; full-month electronic ~$101k ÷ 19 cases ≈ **$5,318** collected per new case if all Aug cash mapped to Aug signs — that mapping is not validated.

Kate response:

---

## August ads off — what changed


| Metric       | Jul full | Aug* partial          | Change         |
| ------------ | -------- | --------------------- | -------------- |
| Search media | 7,262    | 400                   | −94%           |
| Search calls | 131      | 25                    | −81%           |
| Total leads  | 267      | 86                    | −68%           |
| LSA media    | 14,556   | 6,286                 | −57%           |
| New cases    | 35       | 19                    | −46%           |
| Ledger cash  | 108,350  | 60,045 through day 24 | not comparable |


Search was effectively off. LSA still ran. Cases and cash did not fall as far as leads — pipeline and LSA carried part of the month.

Kate response:

---

## Past spend → impact — simple proof lines for Andrew

Use these as talking points. Pair with the caveat that n=3–4 months and Aug is partial.

1. **May–Jul:** Each +100 leads in the stack aligned with roughly +13–16 signed cases same month at observed rates.
2. **May–Jul:** ~$22k/mo media aligned with 35–36 cases/mo and **$103k–$108k** ledger cash.
3. **Search pause Aug:** Call volume −81%. That is the primary top-of-funnel cut — not LSA.
4. **Jul pipeline:** 267 leads still fed Aug signs. Aug lead drought hits **Sep–Oct** harder if ads stay off.
5. **Cash goal:** $100k/mo target. Jul cleared it. Aug full electronic ~$101k suggests cash can still clear goal without Search **if** LSA + referrals + pipeline hold — dash ledger just has not caught up.

Kate response:

---

## Forward impact — if Search stays off

Rough ranges from observed conversion — not forecasts.

### September new cases


| Assumption                                           | Calculation | Sep cases est. |
| ---------------------------------------------------- | ----------- | -------------- |
| Aug* leads convert at Jul-like same-month rate 13.1% | 86 × 13.1%  | ~11            |
| Aug* leads convert at Jun-like rate 15.9%            | 86 × 15.9%  | ~14            |
| Jul leads convert at lag rate 15.5%                  | 267 × 15.5% | ~41            |
| Jul leads convert at Aug* lag rate 7.1%              | 267 × 7.1%  | ~19            |


Realistic band if Search stays off: **~11–19 new cases in Sep** unless referral or LSA volume replaces Search calls.

### Cash impact — use cash per case, not revenue

At **~$3,100–$5,300** cash per new case on recent months:


| Sep cases vs Jul 35 | Cases delta | Cash delta vs Jul pace |
| ------------------- | ----------- | ---------------------- |
| 19 cases            | −16         | ~$50k–$85k             |
| 14 cases            | −21         | ~$65k–$111k            |
| 11 cases            | −24         | ~$74k–$127k            |


At **$5,662 mean fee × 80% collectible** ≈ **$4,530** modeled value per case — upper bound if full fee lands over time, not in-month cash.

Kate response:

---

## Proving marketing value while ads were off

Story arc that matches the data without over-claiming:


| Claim                                        | Supported? | Evidence                                         |
| -------------------------------------------- | ---------- | ------------------------------------------------ |
| Paused Search cut top-of-funnel              | Yes        | 131 → 25 Search calls                            |
| LSA alone did not replace Search             | Partial    | 61 LSA inbox vs 132 Jul · cases 19 vs 35         |
| Firm still signed cases in Aug               | Yes        | 19 Created through Sep 1                         |
| Aug cash may still near $100k                | Plausible  | Electronic Aug $101k — needs ledger confirm      |
| Marketing ROI is provable from cash alone    | Weak       | Cash lags signing · mix shifts · partial exports |
| Prior spend built pipeline that buffered Aug | Yes        | Jul 267 leads · lag conversion visible           |


Stronger proof needs: full Aug exports · Sep case count · side-by-side month with Search on vs off.

Kate response:

---



---

## Questions for Andrew / ops

1. LSA budget — hold, cut, or reallocate to Search first?
2. Aug cases — how many came from referral or repeat vs paid channel?
3. Typical days from first call to signed client — needed for lag model.
4. Is ~$104k Aug cash operating + trust combined or trust-only?

Kate response:

---

## Hypotheses to test next month

- [ ] Sep cases < 20 if Search stays off and LSA unchanged
- [ ] Cash Sep drops below $100k before cases do — lag confirms cash is trailing indicator
- [ ] DUI / Traffic mix rises when Search off — lower mean fee drags cash per case
- [ ] Re-enable Search at Jul spend restores calls before cases recover by 30–45 days

Kate notes:

---

## Revision log


| Date       | Change                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-09-01 | Initial analysis from Contact Sep 1 · kpi-report Aug* stack · Electronic payments Aug · case_list snapshot |
| 2026-09-01 | Downloads re-scan — no new files · dash verified current on Sep 1 MyCase pull                              |


