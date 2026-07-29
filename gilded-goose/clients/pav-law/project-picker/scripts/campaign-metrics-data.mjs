/**
 * Per-campaign goals, metrics, blockers, and insights — merged into content/*.md by apply-campaign-metrics.mjs
 * Sources: Ad Reports Jul 2026 exports · PERFORMANCE-REVIEW-2026-07-11.md · KPI wireframe dummy (#01–#35)
 */
export const CAMPAIGN_METRICS = {
  RETAINER: {
    goal: "Hold Military Search near ~70 calls/month May–Jun avg (~$58–67/call) while NTGUILT Search scales without CPL drift above $10/click.",
    results: [
      "May–Jun 2026 avg maintained volume: ~89 Search calls/mo · ~78 LSA leads/mo",
      "May 2026: $2,421 Military spend · 36 calls · ~$67/call",
      "Jun 11–Jul 10: $3,983 Military spend · 330 clicks · primary call engine",
      "NTGUILT Search launched — $1,924 spend · 282 clicks · ~$6.82/click",
      "Mountain DUI + Demand Gen remain paused — waste stopped"
    ],
    recommendedMetrics: [
      "Phone calls by campaign (restore Phone calls column in exports)",
      "Cost/call and cost/lead weekly — Military vs NTGUILT",
      "Search-term waste % (target <15% vs current ~38%)",
      "Answer rate (#21) — baseline 72% · target 90%",
      "Lead→case rate (#02) — baseline 7.3% (9/124 Jun)",
      "Platform CPL vs all-in CPL (retainer + bonus + media)"
    ],
    blockers: [
      "Jul export missing Phone calls column — cannot reconcile cost/call in sheets",
      "Six declined threshold charges in Jun — billing risk before budget increases",
      "Core DV ad groups 2–4 still zero traffic",
      "Military Sexual Assault RSA Poor strength — 42 impressions · $0"
    ],
    insights: [
      "Military DV + Assault RSAs carry spend — fix or pause Poor-strength ad groups before scaling",
      "NTGUILT clicks are efficient; validate call extensions + ntguilt.com forms in HubSpot before +budget",
      "Shared negatives for JAG/PD/sheriff terms could recover ~$1,063/mo waste"
    ]
  },
  AdEnhance: {
    goal: "Lift Military RSA strength to Excellent/Good on top ad groups and cut ~38% search-term waste to <20% within 30 days.",
    results: [
      "Military DV RSA pair driving $1,733 + $1,247 spend blocks (Jun 11–Jul 10)",
      "Mobile bid adjustments active — mobile ~60%+ of Military interactions",
      "NTGUILT Tickets RSA at Excellent strength"
    ],
    recommendedMetrics: [
      "Ad strength by RSA (Poor → fix list)",
      "Waste spend $ by category (gov/JAG/PD/competitor/brand)",
      "Impression share on Military DV + Assault",
      "Calls per $1,000 spend by ad group"
    ],
    blockers: [
      "Conversion actions flagged but not in client-facing reports",
      "Government/navigational queries still buying — neg list incomplete",
      "Competitor firm names consuming $176/period"
    ],
    insights: [
      "Top burners: public defenders office ($138), fort carson legal ($87), CSPD ($82) — add to shared negatives",
      "Brand query `pav law` ($62) — route to exact brand campaign or negative on broad",
      "Pause Military Sexual Assault RSA until creative refresh"
    ]
  },
  NtguiltAd: {
    goal: "Launch NTGUILT upper-funnel display with UTMs so remarketing pool grows 20%+ before scaling Search budget.",
    results: [
      "NTGUILT Search already live — 282 clicks · ~$6.82/click (Jul period)",
      "Brand direction and booth creative drafted",
      "All-time NTGUILT calls: 9 on $1,218 through Jun 24"
    ],
    recommendedMetrics: [
      "Display impressions and view-through assists",
      "NTGUILT.com sessions with UTM source=display",
      "Remarketing list size week over week",
      "View-through vs click-through consults"
    ],
    blockers: [
      "Promo video and giveaway concepts still in WIP — no live display spend",
      "UTM pass-through not verified on all NTGUILT landing URLs",
      "Event sponsorship outreach not closed"
    ],
    insights: [
      "Search lane proving clicks; display layer still missing for true funnel top",
      "Pair summer creative with SocialAds social when budget allows — same UTM scheme as DigProf",
      "Do not scale display until DigProf profile UTMs and OpsDash dashboard can attribute assists"
    ]
  },
  SummerEmail: {
    goal: "Drive 2–4 re-engaged consults from past-client list around July 4 window at <$50 cost per booked consult.",
    results: [
      "Campaign completed for July 4 window",
      "Pre-holiday safety + post-holiday charge guide sequence defined",
      "HubSpot send path to Romina booking in every email"
    ],
    recommendedMetrics: [
      "Emails sent / delivered / bounced",
      "Open rate and click rate by segment (past client vs prospect)",
      "Consults booked within 7 days of click",
      "Revenue attributed to summer-safety UTM tag"
    ],
    blockers: [
      "List hygiene and segment size not logged in Results — add before next holiday send",
      "No HubSpot workflow tying email click → task → consult outcome",
      "ROI difficult to isolate without UTM on booking link"
    ],
    insights: [
      "Pattern-interrupt subject lines worked for engagement — reuse for Thanksgiving/New Year windows",
      "Next round: split test subject line vs send time; log list size and consult count in ## Results",
      "Pair with InsMailer mailer for households that do not open email"
    ]
  },
  Referral: {
    goal: "Generate 3–5 referral-sourced consults/month at lower CPL than paid Search (~$67/call baseline).",
    results: [
      "HubSpot referral foundation scoped",
      "America list and past-client segments identified",
      "Performance-based payment model documented"
    ],
    recommendedMetrics: [
      "Referral asks sent per month",
      "Referral-sourced leads in HubSpot (source = referral)",
      "Consult→retained rate on referral leads (target 51%+)",
      "CPL referral vs paid Search"
    ],
    blockers: [
      "No structured ask workflow live — manual outreach only",
      "Booking friction if Romina link not in every referral touch",
      "Past-client list upload pending (see HsContacts)"
    ],
    insights: [
      "Referral CPL should beat $67 Military cost/call when program is running",
      "Tie to HsContacts contact upload and InsMailer physical reminder for dual-channel asks",
      "Log every referral source in HubSpot — feeds OpsDash KPI #10 channel table"
    ]
  },
  HsLanding: {
    goal: "Lift landing-page conversion rate 15–25% on primary paid-traffic entry pages within 30 days of launch.",
    results: [
      "Module/LP scope aligned to paid traffic already landing"
    ],
    recommendedMetrics: [
      "Sessions → form submit rate by landing page",
      "Bounce rate and time on page (mobile vs desktop)",
      "Cost per form fill from linked Google Ads URLs",
      "HubSpot consults from LP UTM"
    ],
    blockers: [
      "WebSpeed speed cleanup incomplete — LCP may suppress conversions",
      "Form fields and Romina booking path not unified on all LPs",
      "No baseline conversion rate logged pre-launch"
    ],
    insights: [
      "Mobile is majority device mix — LP must load <3s (WebSpeed dependency)",
      "Use same UTM naming as OpsDash dashboard before go-live",
      "One primary CTA per page — book consult, not menu of links"
    ]
  },
  GabrielOut: {
    goal: "Book 4–8 outbound consults/month from warm lists at connect rate ≥25% and answer-rate uplift on returned calls.",
    results: [
      "Gabriel outbound scope defined for paid-search-dependent call volume"
    ],
    recommendedMetrics: [
      "Dials / connects / consults booked per week",
      "Connect rate %",
      "Consult show rate",
      "Revenue per dial"
    ],
    blockers: [
      "HsVoip phone routing not live — outbound callbacks may hit wrong line",
      "List source and DNC scrub not documented",
      "No CRM task template for outbound outcomes"
    ],
    insights: [
      "Outbound works after intake path is verified (HsVoip + HsPipe)",
      "Target lists that already engaged with ads — warmer than cold database",
      "Log dispositions in HubSpot for OpsDash outbound channel row"
    ]
  },
  SocialAds: {
    goal: "Drive 500+ NTGUILT social engagements per wave and 10+ site sessions with UTM social=ntguilt per month.",
    results: [
      "NTGUILT social creative direction aligned with NtguiltAd display"
    ],
    recommendedMetrics: [
      "Reach, engagements, and CTR by platform",
      "UTM-tagged sessions to ntguilt.com / pav.law",
      "Remarketing pool growth from social pixels",
      "Cost per engaged session"
    ],
    blockers: [
      "HsSocial HubSpot social connection may duplicate effort — merge w/ SocialAds per INDEX note",
      "Approval workflow for firm-safe creative not defined",
      "No baseline engagement metrics from prior posts"
    ],
    insights: [
      "Social is free touchpoint between paid flights — consistency beats volume",
      "Use NTGUILT summer creative from NtguiltAd WIP for cohesive brand",
      "Every bio link must use DigProf UTM scheme for GA4 KPI #18"
    ]
  },
  OpsDash: {
    goal: "Ship live KPI cockpit with 124/mo unified lead count, cost/call by channel, and missed-revenue flag (#19) wired to Search data.",
    results: [
      "KPI master table drafted (KPI-01–35)",
      "Wireframe v1 merged into Gilbert Reporting tab",
      "UTM logic drafted for contact URLs",
      "Google Ads API setup doc drafted"
    ],
    recommendedMetrics: [
      "KPI #01 total leads · #02 new cases · #21 answer rate",
      "Cost/call Military (~$58–67) · NTGUILT CPL (~$6.82 click / call TBD)",
      "Missed revenue #19 — unanswered calls × avg case fee ($5,587)",
      "MoM delta on platform spend, agency spend, and revenue"
    ],
    blockers: [
      "Google Ads API credentials not live — monthly pull script blocked",
      "HubSpot ↔ Google Ads integration not confirmed in UI",
      "Jul export missing Phone calls — breaks cost/call automation",
      "Wireframe still dummy data — round 2 revisions before client sign-off"
    ],
    insights: [
      "Fix export column first — fastest path to trustworthy cost/call",
      "LSA leads-inbox CSV should backfill channel table alongside Search",
      "Peacock gauge and missed-revenue card depend on #21 + #29 fee blend"
    ]
  },
  DataMgmt: {
    goal: "Maintain monthly KPI refresh and Andrew review cadence with <5 day lag from month close.",
    results: [
      "Retainer-tier reporting scope defined alongside OpsDash build"
    ],
    recommendedMetrics: [
      "Report delivery date vs month end",
      "Data freshness score (API vs manual export)",
      "KPIs with live vs Waldo placeholder flag",
      "Andrew sign-off on monthly narrative"
    ],
    blockers: [
      "Depends on OpsDash live data pipeline",
      "No SLA documented for manual export fallback"
    ],
    insights: [
      "Retainer dashboard row should mirror OpsDash metrics without duplicate build",
      "Automate Google pull before asking intake for manual LSA exports"
    ]
  },
  CaseWins: {
    goal: "Publish 6+ case-win proof points and lift on-site trust signals to improve consult conversion 5–10%.",
    results: [
      "Case win log scope defined"
    ],
    recommendedMetrics: [
      "Testimonials published count",
      "Time on page for case-win URLs",
      "Consult conversion rate before/after proof block",
      "GBP review velocity (pairs with DigProf)"
    ],
    blockers: [
      "Attorney approval queue for client stories not scheduled",
      "No baseline conversion rate on pav.law consult pages"
    ],
    insights: [
      "Social proof reduces CPL indirectly — track consult rate not just clicks",
      "Sync wins to DigProf directory profiles and HsSocial social calendar"
    ]
  },
  StackAudit: {
    goal: "Deliver one ranked 30-day action list with defer/cut lines so consulting spend does not scatter across 8+ channels.",
    results: [
      "Marketing strategy shift recommendation delivered",
      "Revenue-channel planning framework completed",
      "Priority stack agreed: Military + NTGUILT growth, pause waste campaigns"
    ],
    recommendedMetrics: [
      "Projects started vs audit top-5 list (compliance score)",
      "Spend on deferred channels (should trend to $0)",
      "90-day consult volume vs audit baseline"
    ],
    blockers: [
      "Execution spread — HsVoip/WebSpeed/OpsDash still WIP while new campaigns queue",
      "No quarterly re-audit scheduled"
    ],
    insights: [
      "Audit value decays without KPI dashboard — OpsDash is force multiplier",
      "Next round: 60-day checkpoint with actual cost/call and referral CPL"
    ]
  },
  HolidayAds: {
    goal: "Launch one seasonal Search/Microsoft flight with ≥20 calls at ≤$75 cost/call for chosen focus area.",
    results: [
      "Focus-area shortlist documented (military, DUI, holiday windows, LSA geo)"
    ],
    recommendedMetrics: [
      "Calls and cost/call for seasonal flight only",
      "Impression share during holiday window",
      "Consults within 14 days of call",
      "RSA strength at launch"
    ],
    blockers: [
      "Topic not selected for next quarter",
      "Shared negative list may need seasonal exceptions",
      "Creative and LP readiness per focus area"
    ],
    insights: [
      "Single-topic campaigns outperform catch-all — pick one lane per quarter",
      "July 4 / NYE pair with SummerEmail email for dual touch",
      "Use Military $67/call as go/no-go threshold"
    ]
  },
  PaviChat: {
    goal: "Capture after-hours form fills and chat leads with <5 min first response during pilot hours.",
    results: [
      "Pavi chat QA scope defined for after-hours intake"
    ],
    recommendedMetrics: [
      "After-hours sessions and chat starts",
      "Leads captured outside 9–5",
      "First response time",
      "Consult book rate from chat leads"
    ],
    blockers: [
      "HubSpot chat routing to Romina not verified after hours",
      "HsVoip phone menus must align with chat handoff",
      "No baseline after-hours lead volume"
    ],
    insights: [
      "After-hours leads are high intent — speed-to-lead metric is critical",
      "Log chat source in HubSpot for OpsDash channel table"
    ]
  },
  AdultAds: {
    goal: "Test adult-site Display placements with frequency caps and ≥10 tracked site visits per $100 spend without brand safety flags.",
    results: [
      "Placement strategy and compliance guardrails scoped"
    ],
    recommendedMetrics: [
      "Spend and clicks on placement list only",
      "Frequency cap compliance",
      "Site visits with UTM display=adult",
      "Consults from remarketing pool"
    ],
    blockers: [
      "Brand safety review with Andrew not completed",
      "Separate conversion tracking not isolated from core Search",
      "Creative approval pending"
    ],
    insights: [
      "Keep budget siloed — do not blend with Military reporting",
      "Remarketing tag required before scaling",
      "If CPL >2× NTGUILT Search, pause and refine placements"
    ]
  },
  HsPipe: {
    goal: "Prove form → task → Romina booking in <15 minutes median for 90% of inbound web leads within 2 weeks of sprint.",
    results: [
      "Pipeline stages documented",
      "Workflow gaps identified vs speed-to-lead best practice"
    ],
    recommendedMetrics: [
      "Median speed-to-lead (form to first touch)",
      "Task completion rate within 24h",
      "Consult booked % from web forms",
      "Drop-off by pipeline stage"
    ],
    blockers: [
      "Referral import path not fully connected",
      "Romina booking link not on all form thank-you pages",
      "HsVoip live phones needed for click-to-call leads"
    ],
    insights: [
      "HubSpot 5-minute rule: firms responding in minutes qualify more leads",
      "Sprint should end with one recorded end-to-end test per lead type"
    ]
  },
  HsVoip: {
    goal: "Reach 90% answered phones (#21) on Military/LSA lines and recover ~7 missed calls/month (~$2,400/mo revenue at 7.3% lead→case).",
    results: [
      "Baseline ~70 Military calls/mo May–Jun avg · answer rate 72%",
      "Target 90% answer rate — ~7 recoverable calls/mo at current volume"
    ],
    recommendedMetrics: [
      "Answer rate % by line (HubSpot call logs)",
      "Missed calls count weekly",
      "Call duration and routing path",
      "Cost/call after VoIP live vs baseline"
    ],
    blockers: [
      "Carrier number transfer blocking go-live",
      "Casey ↔ Romina coverage schedule not signed off",
      "Google VoIP verification pending"
    ],
    insights: [
      "21-point answer gap (69%→90%) is highest-ROI fix before more ad spend",
      "LSA documenting training must complete before Casey live answering",
      "Cross-device call tracking still understates volume — note in reporting"
    ]
  },
  WebSpeed: {
    goal: "Cut mobile LCP below 3s on top 5 entry pages and reduce bounce rate 10% on paid landing URLs.",
    results: [
      "Prior work cut load times ~200%",
      "Multi-phase cleanup plan in WIP"
    ],
    recommendedMetrics: [
      "LCP mobile (PageSpeed / GA4)",
      "Bounce rate on /contact and top LP URLs",
      "Organic sessions (secondary)",
      "Form submit rate post-speed fix"
    ],
    blockers: [
      "Navigation cleanup phases not complete",
      "Some heavy assets still on Squarespace/HubSpot modules",
      "No before/after metrics logged in Results yet"
    ],
    insights: [
      "Speed fix unlocks HsLanding LP and paid conversion gains",
      "Log baseline LCP in ## Results before next deploy",
      "Pairs with WebContent SEO — fix speed before content scale"
    ]
  },
  WebContent: {
    goal: "Move priority keywords from avg position 45–58 to top-20 for 5 core terms within 90 days.",
    results: [
      "SEO overhaul scope: schema, NAP, attorney attribution",
      "Internal linking plan drafted"
    ],
    recommendedMetrics: [
      "Avg position by priority keyword cluster",
      "Organic clicks and impressions (GSC)",
      "Organic form fills",
      "Indexed pages count"
    ],
    blockers: [
      "WebSpeed speed debt hurts crawl and UX signals",
      "NAP inconsistencies across DigProf profiles",
      "Content production bandwidth"
    ],
    insights: [
      "Local business schema + attorney attribution are foundation — see Google local SEO docs",
      "Organic discovery reduces reliance on $6k+/mo paid",
      "Sync NAP with DigProf before link-building push"
    ]
  },
  InsMailer: {
    goal: "Generate 1–2 retained matters per ~200-household wave at ≤$3/piece all-in cost.",
    results: [
      "Insurance sleeve mailer concept approved",
      "Sleeve + postage model under ~$3/piece"
    ],
    recommendedMetrics: [
      "Households mailed per wave",
      "Inbound calls/forms with UTM mail=sleeve",
      "Consults within 30 days of mail date",
      "Retained matters per wave (long-tail)"
    ],
    blockers: [
      "Sleeve order quantity not confirmed",
      "Unique phone or URL for attribution not on creative",
      "Cold database list hygiene"
    ],
    insights: [
      "ROI tracking is hard — use dedicated UTMs and ask intake “how did you hear about us”",
      "Physical reminder stays in glovebox — long-tail matches 1–2 retained/wave goal",
      "Pair with SummerEmail email for same household where email exists"
    ]
  },
  BlogRevamp: {
    goal: "Publish 2 posts/month and earn +15% organic entrances to blog URLs within 12 weeks.",
    results: [
      "Blog revamp scope defined"
    ],
    recommendedMetrics: [
      "Posts published per month",
      "Organic sessions to /blog",
      "Avg position on post target keywords",
      "Consults from blog CTAs"
    ],
    blockers: [
      "Editorial calendar not staffed",
      "No baseline organic blog traffic logged"
    ],
    insights: [
      "Blog supports WebContent SEO clusters — each post needs one consult CTA",
      "Repurpose NTGUILT/safety themes from SummerEmail for timely content"
    ]
  },
  HsContacts: {
    goal: "Upload and segment 100% of marketable past-client contacts with bounce rate <2% on first send.",
    results: [
      "Upload scope and field mapping drafted"
    ],
    recommendedMetrics: [
      "Contacts uploaded vs total addressable",
      "Segment counts (past client, referral, America list)",
      "Bounce and unsubscribe on first send",
      "Consults from email within 30 days"
    ],
    blockers: [
      "Source spreadsheets not consolidated",
      "GDPR/marketing consent flags unclear",
      "Duplicate records across lists"
    ],
    insights: [
      "Unlocks SummerEmail, Referral, and InsMailer — list size is force multiplier",
      "Log upload count in ## Results after first import"
    ]
  },
  HsSocial: {
    goal: "Post 8–12 firm-safe items/month across connected channels with approval workflow and UTM on every link.",
    results: [
      "HubSpot social scope defined",
      "INDEX note: merge with SocialAds to avoid duplicate calendars"
    ],
    recommendedMetrics: [
      "Posts published per platform",
      "Click-through to UTM-tagged URLs",
      "Engagement rate",
      "Consults from social source field"
    ],
    blockers: [
      "Overlap with SocialAds NTGUILT social — needs single owner",
      "Andrew approval turnaround not SLA'd",
      "Profiles outdated until DigProf completes"
    ],
    insights: [
      "Consolidate SocialAds+HsSocial into one content calendar",
      "Every link uses DigProf UTM pattern for GA4 KPI #18"
    ]
  },
  WasteAud: {
    goal: "Recover $200+/mo in duplicate or unused subscriptions within 30 days of audit delivery.",
    results: [
      "Spend audit scope defined — QuickBooks + card statements"
    ],
    recommendedMetrics: [
      "Monthly SaaS spend before/after",
      "Subscriptions cancelled count",
      "Duplicate tool overlap list",
      "Hours saved on admin"
    ],
    blockers: [
      "Card access and QuickBooks categorization pending",
      "No baseline subscription inventory"
    ],
    insights: [
      "Not lead-gen — efficiency dollars can fund HsVoip or OpsDash",
      "Cross-check HubSpot tier vs actual seat usage"
    ]
  },
  DigProf: {
    goal: "Refresh 100% of priority profiles (Pav Law, Andrew, Casey) with matching NAP and UTM-tagged links; track discovery traffic in GA4.",
    results: [
      "UTM naming scheme partially drafted for contact URLs",
      "Outdated profile inventory: Facebook, Yelp, Instagram, directories"
    ],
    recommendedMetrics: [
      "Profiles updated / total discovered",
      "Discovery sessions via profile UTMs (GA4 KPI #18)",
      "GBP calls and direction requests",
      "NAP mismatch count (target 0)"
    ],
    blockers: [
      "Andrew/Casey personal profiles need client-provided bios and photos",
      "Directory login credentials scattered",
      "Merge Andrew Brown + Pav Law listings incomplete"
    ],
    insights: [
      "Profile layer complements WebContent SEO — inconsistent phone hurts call tracking",
      "Extend UTM sheet to every bio link before claiming victory",
      "Feeds OpsDash channel table when UTMs are consistent"
    ]
  }
};
