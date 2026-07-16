# Guide questionnaire

Edit this file, then run `npm run build` (or `npm run watch`).  
Short, specific labels. **Icons** must match value-icon ids (`leads`, `crm`, `seo`, `intake`, `efficiency`, `referrals`, `creative`, `foundation`, …).  
**Next** is another question id, or `done` to finish and filter the outline list.

Three layers: pressure → channel / surface → concrete bottleneck.

## Start
q1

## q1
- **Step:** 1 / 3
- **Prompt:** What should marketing fix first?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| leads | Get more qualified cases | Paid & campaign demand | q2_leads | leads | More qualified cases |
| web | Make the website earn its keep | SEO, speed, landers | q2_web | seo | Stronger website |
| clarity | See leads, spend, and ROI clearly | Dashboards & audits | q2_clarity | efficiency | Clearer metrics |
| costs | Stop leaking money | Ads & subscriptions | q2_costs | efficiency | Cut waste |

## q2_leads
- **Step:** 2 / 3
- **Prompt:** Which demand channel first?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| search | Google / Microsoft search & LSA | Intent capture | q3_after_click | leads | Search & LSA |
| display | Display & brand (NTGUILT) | Upper funnel | q3_after_click | leads, creative | Display & brand |
| seasonal | Seasonal / focus-area push | Holidays, military, DUI | q3_after_click | leads, creative | Seasonal campaigns |
| warm | Past-client & warm channels | Mail, referral, proof | q3_warm | referrals | Warm demand |

## q3_after_click
- **Step:** 3 / 3
- **Prompt:** After someone clicks or calls, what breaks?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| voip | Phone / VoIP capture | Missed or untracked calls | done | intake, leads | Fix call intake |
| chat | After-hours chat intake | Nights & weekends | done | intake | After-hours chat |
| crm | HubSpot pipeline follow-up | Stages & workflows | done | crm | CRM follow-up |
| track | Lead-source tracking | UTM, KPI dashboard | done | efficiency, leads | Track lead sources |

## q3_warm
- **Step:** 3 / 3
- **Prompt:** Which warm channel?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| referral | Client referral program | Setup + ongoing | done | referrals | Referral program |
| proof | Case wins & testimonials | Social proof | done | referrals, creative | Testimonials |
| mail | Insurance / past-client mailer | Print re-engagement | done | referrals, creative | Past-client mail |
| profiles | Directories & social profiles | NAP, Avvo, GBP | done | referrals, creative | Profile refresh |

## q2_web
- **Step:** 2 / 3
- **Prompt:** What’s weakest on the site?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| seo | SEO content & local search | Schema, blogs, NAP | q3_web_seo | seo | SEO & content |
| speed | Speed & navigation | Load time, IA | done | seo | Site speed & nav |
| landers | Campaign landing pages | Forms & modules | done | seo, crm, leads | Landing pages |

## q3_web_seo
- **Step:** 3 / 3
- **Prompt:** SEO workstream?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| pages | Site content & linking | Overhaul pages | done | seo | Content overhaul |
| blog | Blog revamp | Posts, meta, links | done | seo | Blog revamp |
| local | Local / directory consistency | NAP + profiles | done | seo, referrals | Local SEO & profiles |

## q2_clarity
- **Step:** 2 / 3
- **Prompt:** What must get measurable?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| kpi | Live lead & spend KPIs | Dashboard | q3_kpi | efficiency | KPI dashboard |
| roadmap | What to fund next | Stack priorities | done | efficiency, foundation | Priorities audit |
| leak | Where cash is leaking | Cards & SaaS | done | efficiency | Spend leak audit |

## q3_kpi
- **Step:** 3 / 3
- **Prompt:** Dashboard focus?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| build | Build the lead/KPI dashboard | GA4, UTM, GTM | done | efficiency | Build KPIs |
| maintain | Keep reporting current | Monthly retainer | done | efficiency, retainer | KPI maintenance |

## q2_costs
- **Step:** 2 / 3
- **Prompt:** Where is money wasting?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| saas | Credit cards & subscriptions | Recurring tools | done | efficiency | Cut SaaS waste |
| adwaste | Ad bids & targeting waste | Search/display efficiency | q3_adwaste | leads, efficiency | Tighten ad spend |
| both | Full spend clean-up | Cards + ads + roadmap | done | efficiency | Full cost clean-up |

## q3_adwaste
- **Step:** 3 / 3
- **Prompt:** Which ad waste to cut?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| enhance | Fix existing search campaigns | Digital ad enhancements | done | leads, efficiency | Fix ad waste |
| seasonal_cut | Rebuild seasonal targeting | Focus-area campaigns | done | leads | Retarget seasonal |
| retain | Keep ads maintained | Ads retainer | done | leads, retainer | Ads retainer |
