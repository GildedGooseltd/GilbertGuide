# Guide questionnaire

Edit this file, then run `npm run build` (or `npm run watch`).  
Short labels work best. **Icons** must match value-icon ids (`leads`, `crm`, `seo`, `intake`, `efficiency`, `referrals`, `creative`, `foundation`, …).  
**Next** is another question id, or `done` to finish and filter the outline list.

## Start
q1

## q1
- **Step:** 1 / 2
- **Prompt:** Biggest problem right now?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| leads | Not enough leads | Ads & reach | q2_leads | leads | More leads |
| convert | Leads don't convert | Intake & CRM | q2_convert | intake, crm | Convert leads |
| clarity | Can't see what's working | KPIs | q2_clarity | efficiency | Clearer metrics |
| web | Website / SEO weak | Content & search | q2_web | seo | Stronger web |
| refer | Need referrals | Reputation | q2_refer | referrals | More referrals |
| costs | Cut costs | Waste & subscriptions | q2_costs | efficiency | Cut costs |
| foundation | Start with foundation | Must-dos first | done | foundation | Foundation first |

## q2_leads
- **Step:** 2 / 2
- **Prompt:** Where should leads come from?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| paid | Paid search & display | Google / LSA | done | leads | Paid leads |
| creative | Social & creative | Campaigns | done | leads, creative | Social leads |
| mix | Paid + organic | Ads with SEO | done | leads, seo, creative | Paid & organic |

## q2_convert
- **Step:** 2 / 2
- **Prompt:** Where do leads drop?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| phones | Phones / after-hours | Missed calls | done | intake | Fix intake |
| crm | CRM follow-up | Pipeline | done | crm | Tighten CRM |
| both_conv | Intake + CRM | Full handoff | done | intake, crm | Intake + CRM |

## q2_clarity
- **Step:** 2 / 2
- **Prompt:** What clarity do you need?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| kpi | Live KPIs | Leads + spend | done | efficiency | KPI clarity |
| audit | Priorities audit | What to fund | done | efficiency, foundation | Priorities |
| spend | Find waste | Leaking spend | done | efficiency | Cut waste |

## q2_web
- **Step:** 2 / 2
- **Prompt:** What should the site fix first?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| content | Content & SEO | Pages & blogs | done | seo | Content & SEO |
| ux | Speed & navigation | UX cleanup | done | seo | Site UX |
| land | Landing pages | Campaign pages | done | seo, crm, leads | Landing pages |

## q2_refer
- **Step:** 2 / 2
- **Prompt:** How should reputation grow?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| program | Referral program | Setup + ongoing | done | referrals | Referral program |
| proof | Case wins & quotes | Social proof | done | referrals, creative | Testimonials |
| mail | Re-engage clients | Mailers | done | referrals, creative | Past clients |

## q2_costs
- **Step:** 2 / 2
- **Prompt:** Where should we cut first?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| subs | Unused subscriptions | SaaS & tools | done | efficiency | Cut SaaS waste |
| ads | Ad spend waste | Bids & targeting | done | leads, efficiency | Tighten ad spend |
| both_cost | Full spend audit | Cards + ads | done | efficiency | Full cost audit |
