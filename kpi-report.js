/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis
 * (former Dashboards charts live at the bottom of the KPIs tab).
 */
(function () {
  const RENDER_VER = "20260727-kpi-funnel-r1";
  /** Export-backed source footnotes — file path + fields for quick re-pull. */
  const KPI_SOURCES = {
    "#01": {
      file: "channelMonths + casesLeadsSpend · cashCollected2026Ytd · cashCollected 2025",
      fields: "Target from months with cash >$100k and known lead stack · Jun 2026 = 226 leads / $103,485"
    },
    "yelp": {
      file: "Yelp for Business · Last 30 days · screenshot as-of-2026-07-26 · Ad Reports/exports/yelp/",
      fields: "Impressions 293 · Page visits 29 · Leads 6 (Messages 3 · Calls 2 · Website visits 1 · Directions 0) · kickoff baseline before promotions + review push"
    },
    "#02": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-25 · ledger credits 2026 YTD · #28 mean fee",
      fields: "Jun creates 36 · target from cash/case → cases for >$100k/mo · Jan–Jun 2026 credits ÷ cases"
    },
    "#07": {
      file: "LSA leads-inbox (16) as-of-2026-07-24 · Google Ads Call details · Google account_activities Jun–Jul 2026",
      fields: "LSA media and responses compared with digital media and calls · Jul* leads through Jul 24 · LSA spend still as-of Jul 17 activities"
    },
    "#08": {
      file: "Campaign report (17) Jun 11 – Jul 10 · Call details May prior",
      fields: "Campaign Cost ÷ Phone calls (Military · Core DV · NTGUILT)"
    },
    "#10": {
      file: "Derived from #01 channel stack (Call details + LSA inbox)",
      fields: "Search share · LSA share · HubSpot / other %"
    },
    "#12": {
      file: "Call details Search · HubSpot forms · Yelp for Business · account_activities Search $ · LSA inbox May–Jul 2026",
      fields: "Jun direct contact → $8,296 Search + $1,000 HubSpot fee ÷ 138 calls + 5 forms = $65 · LSA ceiling → $31,375 ÷ 251 = $125 avg"
    },
    "#13": {
      file: "LSA leads-inbox (16) as-of-2026-07-24 · account_activities May–Jul 2026 (Jul 24 activities incomplete — use Jul 17 for Home Services $)",
      fields: "Jun/Jul* match inbox (16) · May held at 72/27 (inbox truncates older May) · Jul* 96 leads · 38 charged · 40% · $189 ($7,163 ÷ 38)"
    },
    "#16": {
      file: "Google Maps + Yelp public pages · scraped 2026-07-16 · 102 S Tejon St",
      fields: "GBP 4.9 · 121 reviews · Yelp 5.0 · 6 reviews · FindLaw 0 (no firm reviews)"
    },
    "#19": {
      file: "Call-details_as-of-2026-07-11 · Status=Missed",
      fields: "Jun missed 38 · May 13 · YTD 64 · × 7.3% lead→case × $5,587"
    },
    "#21": {
      file: "Call-details_as-of-2026-07-11 · Status=Received/Missed",
      fields: "Jun answered 100/138 = 72% · May 26/39 = 67%"
    },
    "#28": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-25/Contact_07-25-2026.csv · fee-means-by-practice.csv",
      fields: "Client + fee mean $5,587 · n=142 · last updated 2026-07-25 (unchanged vs Jul-1)"
    },
    "#30": {
      file: "channelMonths full lead stack · casesLeadsSpend new cases · #28 mean fee · collection rate placeholder",
      fields: "Firm-wide only · complete months · close = cases ÷ Search+LSA+HubSpot+Yelp · fee $5,587 · collection 80% until fees-collected"
    },
    "#29": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-25/Contact_07-25-2026.csv · fee-means-by-practice.csv",
      fields: "Client + fee · Case Type / practice · n≥5 means · last updated 2026-07-25 (unchanged vs Jul-1)"
    },
    "cases-leads-spend": {
      file: "MyCase as-of-2026-07-25/new-cases-by-month.csv · LSA leads-inbox (16) · Call details · HubSpot · account_activities",
      fields: "New cases · leads · spend · last MyCase update 2026-07-25 (Contact_07-25-2026.csv)"
    },
    "sales-cost-funnel": {
      file: "Campaign-report_2026-06-11_to_2026-07-10.csv · June Guide channelMonths / casesLeadsSpend",
      fields: "Impr 15,871 · Interactions 640 · Search $6,277.36 · Jun direct contacts 226 · Jun cases 36 · Search+LSA+forms fee"
    },
    "cash-collected": {
      file: "~/Downloads/ledger_account_activity_report.csv",
      fields: "Ledger Credit by month · full CY 2025 (Jan–Dec) + 2026 YTD through Jul 15"
    },
    "financial": {
      file: "ledger_account_activity_report.csv (2025-01-03→2026-07-15) · cash / new case from MyCase",
      fields: "Cash credits by month · cash / new case"
    },
    "cases-created": {
      file: "mycase/as-of-2026-07-25/new-cases-by-month.csv · Contact_07-25-2026.csv",
      fields: "Cases created by month · 2025 full year + 2026 through Jul* (Created ≤ 2026-07-23) · last updated 2026-07-25"
    },
  };

  const KPI_HELP = {
    "#01": {
      title: "#01 Leads Generated",
      desc: "Total lead count from Search call details + LSA inbox + HubSpot/other (incl. Yelp). Tile = June 2026. Target = leads needed for over $100k cash/mo from months that cleared $100k and have a known lead stack.",
      formula: "Search + LSA + HubSpot/other. Target = floor($100k ÷ cash/lead) + 1 using only full months with cash > $100k and known leads."
    },
    "#02": {
      title: "#02 New Cases",
      desc: "New MyCase Client contacts created in the month (Created date). Tile = June 2026 (36). Target = cases needed for over $100k cash/mo from observed 2026 Jan–Jun ledger credits ÷ new cases (fallback: mean fee × 80% collectible).",
      formula: "Count of Client contacts with Created date in month. Target = floor($100k ÷ cash/case) + 1 so monthly cash clears $100k."
    },
    "#07": {
      title: "#07 Spend Waste",
      desc: "Modeled excess LSA media cost versus producing the same response volume at digital Search’s observed cost per response. Jun full month + Jul* (leads through Jul 24; LSA Home Services spend still from Jul 17 activities — Jul 24 activities file was incomplete).",
      formula: "LSA spend − (LSA responses × digital cost per response). Jun: $13,206 − (83 × $60.12) = $8,216 waste. Jul*: $7,163 − (96 × $64.19) = $1,001. Total = −$9,217. Modeled responses missed at the digital rate: 152."
    },
    "#12": {
      title: "#12 Avg. Cost per Direct Contact",
      desc: "Blended cost of digital Search phone calls, HubSpot form submits, and Yelp leads for the tile month. Gauge ceiling / target = average LSA call cost from account_activities Home Services $ ÷ LSA inbox leads (May–Jul*). Stay under that LSA average.",
      formula: "Direct contact spend = Search media + HubSpot forms fee (+ Yelp ad spend when wired). Contacts = Search calls + form submits + Yelp leads."
    },
    "#13": {
      title: "#13 LSA % charged · leads · avg charge cost",
      desc: "Local Services inbox Charge status + Home Services media from account_activities. Jun/Jul* match leads-inbox (16) as of 2026-07-24 (83/39 · 96/38). May stays at 72/27 from the fuller prior pull — inbox (16) only retains 31 May rows.",
      formula: "% charged = Charged ÷ LSA leads. Avg charge cost = LSA Home Services activity $ ÷ Charged. Jul*: 38 ÷ 96 = 40% · $7,163 ÷ 38 = $189 (spend as-of Jul 17 activities)."
    },
    "#19": {
      title: "#19 Missed Opportunity",
      desc: "Estimated monthly potential revenue not earned from unanswered Search calls (Call details as of 2026-07-11). Directional for phone priority — not booked revenue.",
      formula: "Missed Search calls × 7.3% lead→case × avg case value ($5,587) → 38 × 7.3% × $5,587 = $15,498/mo."
    },
    "#21": {
      title: "#21 Answered Calls",
      desc: "Share of Search call details that were answered (Received) vs missed. Source: Call-details as of 2026-07-11.",
      formula: "Answered ÷ (Answered + Missed) → 100 ÷ 138 = 72%. Target ≥ 90%."
    },
    "#03": {
      title: "#03 Auto Cases",
      desc: "YTD auto signed matters stacked by type (DUI + Traffic). Target line = annual auto goal of 50. Pace % and ahead/behind use total auto signed ÷ 50 vs straight-line elapsed year. Current-month row shows cases needed this month to finish at 50 (remaining months re-split as months pass). Active paid DUI efficiency: NTGUILT → DUI ad group at $4.86 / interaction (Jun 11–Jul 10) — expand via NtguiltAd; insurance card mailer is InsMailer.",
      formula:
        "Stack = auto case types from MyCase practice-area rollup. Total = sum of stack. Schedule = total − (50 × days elapsed ÷ days in year). Current-month need = distribute remaining (50 − YTD) across months left in the year (Aug–Dec plan; front-load remainder)."
    },
    "#08": {
      title: "#08 Leads by campaign",
      desc: "Search call volume by campaign brand from Campaign report (17). Military · Core DV · NTGUILT. Guide projects: Retainer, NtguiltAd, AdEnhance, SocialAds.",
      formula: "Campaign report phone calls by campaign (Military · Core DV · NTGUILT)."
    },
    "#10": {
      title: "#10 Source mix",
      desc: "Share of leads by channel (Paid Search, LSA, HubSpot / other) from the same stack as #01. Est. potential client revenue = leads × lead→case rate × avg case (#28).",
      formula: "Channel lead counts ÷ total. Month comparison uses prior vs current. Partial months (e.g. Jul*) are labeled in the source export."
    },
    "#16": {
      title: "#16 Reviews by channel",
      desc: "Public review ratings and counts by directory (scraped 2026-07-16). Yelp listing: 5.0 · 6 reviews. Ads/lead funnel baseline lives on the Yelp card (Data tab) and Project Guide DigProf.",
      formula: null
    },
    "#17": {
      title: "#17 Referral Network",
      desc: "Referral channel counts. Yelp: 6 leads in the last 30 days (Yelp for Business as of 2026-07-26) — kickoff baseline before promotions and review push. Other channels still wait on Referral Client Referral Program tracking.",
      formula: "Yelp last-30 = 6 leads (Messages 3 · Calls 2 · Website visits 1). Past-client / friend / attorney / Nextdoor still placeholder until Referral wires."
    },
    "yelp": {
      title: "Yelp — kickoff baseline",
      desc: "Yelp for Business last-30-day funnel as of 2026-07-26. Starting point before Yelp promotions and more reviews. Compare future pulls against this window.",
      formula: "Impressions 293 → Page visits 29 → Leads 6. Lead mix: Messages 3 · Calls 2 · Website visits 1 · Directions & map views 0."
    },
    "#28": {
      title: "#28 Avg case fee",
      desc: "Mean contracted / quoted Client fee from MyCase Contact_07-25-2026.csv · last updated 2026-07-25. $5,587 · n=142 (unchanged vs Jul-1). Not cash collected.",
      formula: "First nonzero among Pre-Trial Flat Fee → pre-File flat → trial → retainer → down payments → AR. Contact group = Client."
    },
    "#30": {
      title: "#30 Est. value per lead",
      desc: "Firm-wide estimated value of one lead. Not split by channel. Caveats: close rate uses complete months with a full lead stack only — partial months like Jul* are excluded; avg fee is MyCase contracted mean (#28), not cash collected; collection rate is a historical 80% placeholder until a fees-collected export replaces it; do not use this number to rank LSA vs Search vs Form vs Website — those paths are not like-for-like.",
      formula: "EV / lead = firm close rate × avg case fee × collection rate. Close rate = new cases ÷ full leads (Search + LSA + HubSpot/other)."
    },
    "#29": {
      title: "#29 Mean fee by practice",
      desc: "Mean contracted / quoted fee by practice area (Client + fee · n ≥ 5) from MyCase Contact_07-25-2026.csv · last updated 2026-07-25. Not cash collected.",
      formula: "Contracted / quoted fees (mostly Pre-Trial Flat Fee) — not cash collected. Fees-collected export still missing."
    },
    "cases-leads-spend": {
      title: "#05 Key Channel Activity",
      desc: "Last 3 months: new cases and leads on the left axis, marketing spend on the right. LSA Jul* leads from inbox (16) Jul 24; LSA spend Jul* still Jul 17 activities. Cash from ledger through Jul 15.",
      formula: "Bars = new cases + leads (LSA calls + digital ad calls + website forms). Line = media spend. Leads per case = leads ÷ cases. Conversion = cases ÷ leads. Calls = LSA + digital phone calls. Cash = ledger credits for the month."
    },
    "sales-cost-funnel": {
      title: "Sales Funnel — unit cost stack",
      desc: "Impressions → clicks → direct contacts → signed cases. Impressions and clicks are Ads actuals from Campaign report June 11–July 10. Direct contacts and signed cases are June calendar Guide. Windows are mixed until a June 1–30 Campaign pull with Impr. + Clicks lands. Not channel ROI — volume and unit cost only.",
      formula: "Cost/impression and cost/click = Search spend ÷ Ads volume. Cost/direct contact = June Search + LSA + HubSpot forms fee ÷ June calls + forms + LSA + Yelp. Cost/signed case = June Search + LSA media ÷ June new cases."
    },
    "financial": {
      title: "#09 Financials",
      desc: "Cash collected by month from MyCase ledger credits (CY 2025 full + 2026 YTD through Jul 15). 2025 expense line = $35k Jan–Mar · $65k Apr–Dec. Cash / new case uses MyCase Created counts where available.",
      formula: "Cash = ledger credits by month. Expense pace + case/cash forecasts → Predictions block on Recommendations & Predictions tab."
    },
    "cases-created": {
      title: "Cases Created",
      desc: "MyCase Client contacts by Created month — 2025 full year + 2026 through Jul* from mycase/as-of-2026-07-25 (Contact_07-25-2026.csv · last updated 2026-07-25 · max Created 2026-07-23).",
      formula: "Count of Client contacts with Created date in month. Jul* = 23 through 2026-07-23 (partial month)."
    },
    "cash-collected": {
      title: "Cash collected",
      desc: "Ledger Credits by month. Bars keep downloaded values; 2025 dashed expense line is $35k for Jan–Mar and $65k for Apr–Dec (not a data override). Source through 2026-07-15.",
      formula: "Sum of Credit column by calendar month. 2026 Jul* is partial through Jul 15."
    }
  };

  function kpiHelpBtn(kpiId) {
    const id = String(kpiId || "");
    if (!KPI_HELP[id] && !KPI_SOURCES[id]) return "";
    return `<span class="kpi-help" role="button" tabindex="0" data-kpi-help="${escapeHtml(id)}" aria-label="About ${escapeHtml(id)}">?</span>`;
  }

  /** Card header label only. */
  function kpiCardTitle(label) {
    return `<span class="kpi-stat-id">${escapeHtml(String(label || "").replace(/^#\S+\s+/, ""))}</span>`;
  }

  /** Value-icon marks for Key Metrics row — same badge system as Project Guide. */
  const KPI_TILE_ICONS = {
    financial: { id: "finance", label: "Finance" },
    "#01": { id: "leads", label: "Leads" },
    "#02": { id: "foundation", label: "Cases" },
    "#12": { id: "intake", label: "Direct contact" }
  };

  const KPI_TILE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="17" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="17" width="7" height="4.5" rx="0.5"/><rect x="17" y="17" width="6" height="4.5" rx="0.5"/><rect x="5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="13.5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="1" y="6" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="6" width="7" height="4.5" rx="0.5"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/></svg>`,
    finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c-.6-.9-1.5-1.4-3-1.4-1.8 0-3 1-3 2.3 0 1.2.9 1.9 2.7 2.3l.8.2c1.8.4 2.7 1.1 2.7 2.4 0 1.4-1.3 2.4-3.2 2.4-1.5 0-2.6-.5-3.2-1.3"/></svg>`,
    intake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };

  function kpiMetricIconHtml(kpiId) {
    const meta = KPI_TILE_ICONS[kpiId];
    if (!meta) return "";
    const svg = KPI_TILE_ICON_SVGS[meta.id];
    if (!svg) return "";
    return `<span class="value-icon icon-${escapeHtml(meta.id)} kpi-metric-icon" title="${escapeHtml(meta.label)}" aria-label="${escapeHtml(meta.label)}">${svg}</span>`;
  }

  /** Display numeric KPI ids without # or a leading zero. */
  function kpiDisplayNumber(kpiId) {
    const raw = String(kpiId || "").trim().replace(/^#/, "");
    return /^\d+$/.test(raw) ? String(Number(raw)) : raw;
  }

  /** KPI number eggs removed — ids live in the ? help title. */
  function kpiRefMark() {
    return "";
  }

  /** Guide deep-link — plain text, no gold egg chrome. */
  function projectEggLink(projectId, ariaLabel, displayText) {
    const id = String(projectId || "").trim();
    if (!id) return "";
    const project = relatedProjectById(id);
    const title = project?.title || id;
    const label = ariaLabel || `Open ${title}`;
    const text = displayText || title;
    return `<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="${escapeHtml(id)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${escapeHtml(text)}</a>`;
  }

  /** Current month first, then count down. */
  function newestFirst(rows) {
    return [...(rows || [])].reverse();
  }

  const KPI_RELATED_PROJECTS = {
    "#19": ["HsVoip", "LsaCall"],
    "#07": ["REC:savings", "RETAINER"],
    "#03": ["NtguiltAd", "InsMailer"], // Add HolidayAds back in August; add SummerAds back next summer.
    "#01": ["HsVoip", "DigProf"],
    "#12": ["HsVoip", "RETAINER"],
    yelp: ["DigProf"],
    financial: ["REC:savings", "RETAINER"]
  };

  const KPI_RELATED_LINKS = {
    "REC:budget": {
      title: "Shift LSA budget → digital",
      href: "#recommendation-primary",
      view: "recommendations",
      scrollTo: "recommendation-primary"
    },
    "REC:savings": {
      title: "Use known savings now",
      href: "#recommendation-financial-audit",
      view: "recommendations",
      scrollTo: "recommendation-financial-audit"
    }
  };

  function relatedProjectById(id) {
    const data = window.PROJECT_DATA || {};
    if (id === "RETAINER" && data.retainer) return { ...data.retainer, id };
    return (data.projects || []).find(project => project.id === id) || null;
  }

  function relatedProjectsHtml(kpiId) {
    const ids = KPI_RELATED_PROJECTS[kpiId] || [];
    if (!ids.length) return "";
    const onMetricsPage = /(?:^|\/)metrics\.html$/.test(window.location.pathname);
    const links = ids.map(id => {
      const rec = KPI_RELATED_LINKS[id];
      if (rec) {
        return `<li><a class="data-guide-link" href="${escapeHtml(rec.href)}" data-go-view="${escapeHtml(rec.view)}" data-scroll-to="${escapeHtml(rec.scrollTo)}">${escapeHtml(rec.title)}</a></li>`;
      }
      const project = relatedProjectById(id);
      if (!project) return "";
      const href = `${onMetricsPage ? "index.html" : ""}#project-${encodeURIComponent(project.id)}`;
      return `<li><a href="${href}" data-go-view="picker" data-project-id="${escapeHtml(project.id)}">${escapeHtml(project.title)}</a></li>`;
    }).filter(Boolean).join("");
    if (!links) return "";
    return `<section class="kpi-related-projects" aria-label="Solutions for ${escapeHtml(kpiId)}">
      <strong class="kpi-related-projects-title">Solutions</strong>
      <ul>${links}</ul>
    </section>`;
  }

  function kpiTileWithProjects(kpiId, cardHtml, opts) {
    const wip = opts && opts.wip ? " kpi-tile-wip" : "";
    return `<div class="kpi-tile-with-projects${wip}">${cardHtml}${relatedProjectsHtml(kpiId)}</div>`;
  }

  function getKpiHelp(kpiId) {
    const id = String(kpiId || "");
    const h = KPI_HELP[id];
    const src = KPI_SOURCES[id];
    let source = "";
    if (src) {
      source = `${src.file} · Fields: ${src.fields}`;
    } else if (id === "#03") {
      const d = window.DUI_GOAL_DATA || {};
      if (d.sourceFile) {
        source = `${d.sourceFile}${d.definition ? ` · ${d.definition}` : ""}`;
      }
    }
    if (!h) {
      return { title: id || "Help", desc: "No description yet.", formula: "", source };
    }
    let formula = h.formula || "";
    if (id === "#02" && DATA.newCasesCashGoal) {
      const g = DATA.newCasesCashGoal;
      formula = `${formula} Observed cash/case $${g.cashPerCase.toLocaleString("en-US")} (${g.basis} · $${g.sampleCash.toLocaleString("en-US")} ÷ ${g.sampleCases}). Need ≥ ${g.needed} creates/mo for >$${Math.round(g.goalCash / 1000)}k cash.`;
    }
    if (id === "#01" && DATA.leadsCashGoal) {
      const g = DATA.leadsCashGoal;
      const months = (g.sampleMonths || []).map(m => `${m.month} ${m.leads} leads / $${m.cash.toLocaleString("en-US")}`).join(" · ") || "—";
      formula = `${formula} Over-$100k months with leads: ${months}. Cash/lead $${g.cashPerLead.toLocaleString("en-US")}. Need ≥ ${g.needed} leads/mo. ${g.note || ""}`;
    }
    if (id === "#12" && DATA.directContactCost) {
      const d = DATA.directContactCost;
      const yelpSpendLine = d.yelpSpend ? ` + $${d.yelpSpend.toLocaleString("en-US")} Yelp` : "";
      formula = `${formula} ${d.month} tile: $${d.digitalSpend.toLocaleString("en-US")} Search + $${d.formFee.toLocaleString("en-US")} forms${yelpSpendLine} ÷ ${d.digitalCalls} calls + ${d.forms} forms + ${d.yelp} Yelp = $${d.cost.toLocaleString("en-US")}.`;
    }
    if (id === "#12" && DATA.lsaAvgCallCost) {
      const g = DATA.lsaAvgCallCost;
      formula = `${formula} LSA avg ceiling = $${g.avg.toLocaleString("en-US")} ($${g.spend.toLocaleString("en-US")} ÷ ${g.calls} leads · ${g.basis}). Stay under that.`;
    }
    if (id === "#30") {
      const m = firmEstValuePerLeadModel();
      const closePct = (m.closeRate * 100).toFixed(1);
      const months = m.basisMonths.length ? m.basisMonths.join(" + ") : "—";
      formula = `${formula} ${months}: ${m.cases} cases ÷ ${m.leads} leads = ${closePct}% × $${m.fee.toLocaleString("en-US")} × ${(m.collectionRate * 100).toFixed(0)}% = $${m.ev.toLocaleString("en-US")}/lead.`;
    }
    return {
      title: h.title,
      desc: h.desc,
      formula,
      source
    };
  }

  const DATA = {
    period: "June 2026",
    asOf: "2026-07-25",
    lastUpdated: "2026-07-26",
    source: "MyCase Contact_07-25-2026 · LSA inbox (16) Jul 24 · Call details Jul 11 · Campaign (17) · ledger Jul 15 · LSA spend Jul 17",
    kpis: [
      /* #01 = total lead count (Search + LSA + HubSpot/other). Target from >$100k cash months. */
      { id: "#01", label: "Leads Generated", value: "226", target: "≥ 219", mom: "+154%", count: 226, verified: true, hit: true, alert: false, gauge: true },
      { id: "#02", label: "New Cases", value: "36", target: "≥ 24", mom: "+64%", verified: true, alert: false, gauge: true, hit: true },
      { id: "#12", label: "Avg. Cost per Direct Contact", value: "$65", target: "< $125", mom: null, verified: true, hit: true, gauge: true, lowerIsBetter: true },
      /* Team goals: #19 missed-opportunity tracker first in render, then #21, then DUI */
      { id: "#19", label: "Missed Opportunity", value: "$15,498/mo", target: "$0", mom: null, verified: true, alert: true, lostTracker: true },
      { id: "#21", label: "Answered Calls", value: "72%", target: "≥ 90%", mom: "+5%", verified: true, alert: true, gauge: true, goal: true, archived: true },
      /* archived for future iteration — restore by removing archived: true */
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false, archived: true },
      { id: "#28", label: "Avg case fee", value: "$5,587", target: "MyCase mean", mom: null, verified: true },
      /* #30 value hydrated by hydrateEstValuePerLeadKpi() after DATA + model exist */
      { id: "#30", label: "Est. value per lead", value: "—", target: "Firm-wide", mom: null, verified: true },
      { id: "#BHI", label: "Business health index", value: "71", target: "100", mom: "−3%", verified: false, alert: true, letterGrade: true, archived: true }
    ],
    channels: [
      { name: "Search calls", count: 138, prior: 39, mom: "+254%", spend: "$8,296", color: "#3a1a6e", verified: true },
      { name: "LSA inbox", count: 83, prior: 72, mom: "+15%", spend: "$13,206", color: "#1e3a8a", verified: true },
      { name: "HubSpot forms", count: 5, prior: 0, mom: "—", spend: "$0", color: "#b23a78", verified: true }
    ],
    /* Lead Channel Stack months — Jul* = MTD through export date (partial month) */
    channelMonths: [
      {
        month: "May",
        search: 39,
        lsa: 72,
        hubspot: 0,
        searchSpend: 7627,
        lsaSpend: 11006
      },
      {
        month: "Jun",
        search: 138,
        lsa: 83,
        hubspot: 5,
        hubspotForms: 5,
        yelp: 0,
        yelpSpend: 0,
        searchSpend: 8296,
        lsaSpend: 13206
      },
      {
        month: "Jul*",
        search: 26,
        lsa: 96,
        hubspot: 10,
        hubspotForms: 4,
        yelp: 6,
        yelpSpend: 0,
        searchSpend: 1669,
        lsaSpend: 7163,
        note: "LSA leads through Jul 24 (inbox 16) · LSA spend $7,163 still as-of Jul 17 · website/other = 4 HubSpot forms + 6 Yelp leads (Yelp for Business last-30 as-of 2026-07-26)"
      }
    ],
    sourceMix: [
      { name: "Paid Search", pct: 61, color: "#3a1a6e", count: 138, prior: 39, mom: "+254%" },
      { name: "LSA", pct: 37, color: "#1e3a8a", count: 83, prior: 72, mom: "+15%" },
      { name: "HubSpot / other", pct: 2, color: "#b23a78", count: 5, prior: 0, mom: "—" }
    ],
    /* Campaign brand: Military royal · Core DV burnt orange · NTGUILT rose (GGL — no teal/gold categories) */
    searchCallsByCampaign: [
      { name: "Military", count: 103, color: "#3a1a6e" },
      { name: "Core DV", count: 12, color: "#c45c26" },
      { name: "NTGUILT", count: 11, color: "#b23a78" }
    ],
    leadsByCampaign: [
      { name: "Military", count: 99, prior: 36, mom: "+175%", spend: "$3,983", color: "#3a1a6e" },
      { name: "Core DV", count: 3, prior: 3, mom: "0%", spend: "$179", color: "#c45c26" },
      { name: "NTGUILT", count: 15, prior: 0, mom: "—", spend: "$1,924", color: "#b23a78" }
    ],
    phoneIntake: {
      targetPct: 90,
      missedTargetPct: 10,
      answeredPct: 72,
      priorAnsweredPct: 67,
      missedPct: 28,
      priorMissedPct: 33,
      missedMomPp: -5,
      monthlyCalls: 138,
      /* #19 — Search Call details Status=Missed · lead→case 7.3% (ADS-LSA lock) */
      missedSearchCalls: 38,
      priorMissedSearchCalls: 13,
      missedLsaCalls: 38, /* alias kept for older callers */
      priorMissedLsaCalls: 13,
      closeRateEst: 0.073, /* lead→case · locked in ADS-LSA-ACTION-CLICKPATHS */
      avgCaseFee: 5587, /* #28 MyCase Client mean */
      leadToCaseRate: 0.073,
      cumulativeYtd: 26102 /* 64 missed × 7.3% × $5,587 May–Jul 10 */
    },
    /* #30 firm-wide EV — not by channel. Collection rate updates when fees-collected lands. */
    estValuePerLead: {
      collectionRate: 0.8,
      avgCaseFee: 5587
    },
    /* KPI #29 support — Client + fee means · n≥5 · CLIENT-VALUE-BASELINE.md · as of 2026-07-25 */
    feeByPractice: [
      { name: "Sex Assault / Sex Offense", n: 6, mean: 9500 },
      { name: "Theft / Property", n: 12, mean: 7333 },
      { name: "Assault / Menacing", n: 20, mean: 6538 },
      { name: "Domestic Violence / DV", n: 52, mean: 5414 },
      { name: "Criminal Defense (other)", n: 11, mean: 4582 },
      { name: "Probation Revocation", n: 5, mean: 4500 },
      { name: "DUI / DWAI / Traffic", n: 24, mean: 3542 }
    ],
    costPerCall: [
      { channel: "Direct contact (blended)", cost: "$65" },
      { channel: "Military", cost: "$40" },
      { channel: "Core DV", cost: "$60" },
      { channel: "NTGUILT", cost: "$128" }
    ],
    referrals: [
      { platform: "Past-client program", count: null, delta: null, status: "building", verified: false },
      { platform: "Friend / family", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Attorney cross-referral", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Yelp", count: 6, delta: null, status: "active", verified: true },
      { platform: "Nextdoor", count: null, delta: null, status: "not on", verified: false }
    ],
    reviews: [
      { platform: "Google Business Profile", rating: "4.9", count: 121, status: "active", verified: true },
      { platform: "Yelp", rating: "5.0", count: 6, status: "active", verified: true },
      { platform: "Nextdoor Business", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Avvo", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "Justia", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "FindLaw", rating: "—", count: 0, status: "active", verified: true },
      { platform: "Martindale", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Facebook", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "LinkedIn (firm)", rating: "—", count: null, status: "not wired", verified: false },
      { platform: "BBB", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Bing Places / Apple", rating: "—", count: null, status: "not wired", verified: false }
    ],
    verticals: [
      { name: "DUI/DWAI", jun: 3, ytd: 15 },
      { name: "Military", jun: 2, ytd: 8 },
      { name: "Traffic", jun: 2, ytd: 6 },
      { name: "DV", jun: 1, ytd: 3 }
    ],
    bhi: { value: 71, target: 100, mom: "−3%" },
    avgDeposit: { current: 400, target: 700 },
    duiGoal: (function () {
      const d = window.DUI_GOAL_DATA || {};
      const autoColumns = Array.isArray(d.autoColumns) && d.autoColumns.length
        ? d.autoColumns.map(col => ({
            label: col.label || "Auto",
            current: col.current != null ? Number(col.current) : 0,
            vsTarget: col.vsTarget === true
          }))
        : null;
      return {
        current: d.current != null ? Number(d.current) : 15,
        jun: d.jun != null ? Number(d.jun) : 3,
        target: d.target != null ? Number(d.target) : 50,
        year: d.year != null ? Number(d.year) : 2026,
        title: d.title || "# Auto Cases",
        label: d.label || "DUI",
        exportNote: d.exportNote || "",
        autoColumns
      };
    })(),
    casesMomSeries: [
      { name: "Closed cases", color: "#64748b", verified: false },
      { name: "New cases", color: "#3a1a6e", verified: true },
      { name: "Red accounts", color: "#b23a78", verified: false }
    ],
    casesMom: [
      { month: "Apr", closed: 6, newCases: 15, redAccounts: 3 },
      { month: "May", closed: 8, newCases: 22, redAccounts: 2 },
      { month: "Jun", closed: 11, newCases: 36, redAccounts: 4 }
    ],
    pipeline: [
      { month: "Jun", closed: 11, mom: "+38%" },
      { month: "Jun", rate: "51%", retained: 14 }
    ],
    /* Dual-axis: left = cases + incoming (LSA+digital+forms) · right = $ spend. Trust omitted — needs fees-collected. */
    casesLeadsSpend: [
      { month: "Jan", cases: 12, leads: null, spend: 0, lsaSpend: 0, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Feb", cases: 14, leads: null, spend: 3197, lsaSpend: 3197, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Mar", cases: 17, leads: null, spend: 921, lsaSpend: 921, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Apr", cases: 15, leads: null, spend: 3449, lsaSpend: 3449, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "May", cases: 22, leads: 72, spend: 18633, lsaSpend: 11006, adsSpend: 7627, adsLeads: 39, websiteLeads: null },
      { month: "Jun", cases: 36, leads: 83, spend: 21502, lsaSpend: 13206, adsSpend: 8296, adsLeads: 138, websiteLeads: 5 },
      { month: "Jul*", cases: 23, leads: 96, spend: 8832, lsaSpend: 7163, adsSpend: 1669, adsLeads: 26, websiteLeads: 7 }
    ],
    /** HubSpot forms fee — $1k/mo starting Jun 2026 (not charged Jan–May). */
    websiteHubspotMonthlyFromJun: 1000,
    /** Guide Digital Ads Maintenance Retainer — contractor management for Search/LSA/Microsoft. */
    digitalMgmtMonthly: 2900,
    /** Consulting allocation estimates for channel CPL (not full retainer). */
    consultingLsaMonthly: 1000,
    consultingAdsMonthly: 2000,
    /* NEW-A primary chart = full calendar year 2025 (ledger Credits). */
    cashCollected: [
      { month: "Jan", credit: 76030, newCases: 23 },
      { month: "Feb", credit: 56750, newCases: 16 },
      { month: "Mar", credit: 60550, newCases: 12 },
      { month: "Apr", credit: 92200, newCases: 31 },
      { month: "May", credit: 106780, newCases: 24 },
      { month: "Jun", credit: 106900, newCases: 15 },
      { month: "Jul", credit: 108712, newCases: 10 },
      { month: "Aug", credit: 69689, newCases: 11 },
      { month: "Sep", credit: 65315, newCases: 9 },
      { month: "Oct", credit: 95435, newCases: 13 },
      { month: "Nov", credit: 42775, newCases: 5 },
      { month: "Dec", credit: 64300, newCases: 9 }
    ],
    /* 2026 YTD kept for footer compare — not plotted on NEW-A (Jul* through Jul 15). */
    cashCollected2026Ytd: [
      { month: "Jan", credit: 57925, newCases: 12 },
      { month: "Feb", credit: 83950, newCases: 14 },
      { month: "Mar", credit: 80500, newCases: 17 },
      { month: "Apr", credit: 70026, newCases: 15 },
      { month: "May", credit: 92140, newCases: 22 },
      { month: "Jun", credit: 103485, newCases: 36 },
      { month: "Jul*", credit: 44950, newCases: 23 }
    ],
    cashCollectedTotals: {
      total2025: 945436,
      total2026ToDate: 532976,
      allCredits: 1478412,
      contractedMean: 5587,
      yearLabel: "2025",
      rangeNote: "Ledger Credits · CY 2025 (full) · 2025 expense line $35k Jan–Mar / $65k Apr–Dec · source through 2026-07-15"
    },
    /* NEW-C / NEW-D — LSA efficiency from inbox (16) + account_activities */
    lsaEfficiency: [
      { month: "May", leads: 72, charged: 27, lsaSpend: 11006 },
      { month: "Jun", leads: 83, charged: 39, lsaSpend: 13206 },
      { month: "Jul*", leads: 96, charged: 38, lsaSpend: 7163 }
    ],
    lsaChargeRateOverall: { charged: 104, leads: 251, pct: 41.4 },
    /* NEW-E — Payment Method = Trust applications (ledger) + Client trust balance snapshot */
    trustTransfers: {
      rangeStart: "2025-01-03",
      rangeEnd: "2026-07-15",
      method: "Payment Method = Trust",
      /* Debits = trust applied to invoices. Credits on Trust method are rare refunds (excluded from MoM bars). */
      monthly: [
        { month: "Jan 2025", applications: 0, rows: 0 },
        { month: "Feb 2025", applications: 0, rows: 0 },
        { month: "Mar 2025", applications: 0, rows: 0 },
        { month: "Apr 2025", applications: 0, rows: 0 },
        { month: "May 2025", applications: 0, rows: 0 },
        { month: "Jun 2025", applications: 75833, rows: 24 },
        { month: "Jul 2025", applications: 271427, rows: 65 },
        { month: "Aug 2025", applications: 0, rows: 0 },
        { month: "Sep 2025", applications: 0, rows: 0 },
        { month: "Oct 2025", applications: 0, rows: 0 },
        { month: "Nov 2025", applications: 0, rows: 0 },
        { month: "Dec 2025", applications: 0, rows: 0 },
        { month: "Jan 2026", applications: 0, rows: 0 },
        { month: "Feb 2026", applications: 0, rows: 0 },
        { month: "Mar 2026", applications: 0, rows: 0 },
        { month: "Apr 2026", applications: 0, rows: 0 },
        { month: "May 2026", applications: 1500, rows: 1 },
        { month: "Jun 2026", applications: 0, rows: 0 },
        { month: "Jul* 2026", applications: 0, rows: 0 }
      ],
      snapshot: {
        asOf: "2026-07-25",
        sourceFile: "mycase/as-of-2026-07-25/Contact_07-25-2026.csv",
        clientsWithBalance: 245,
        totalBalance: 1049222,
        meanBalance: 4283
      },
      refundCredits2025Feb: 7000
    }
  };

  function applyLsaAverageCallCostTarget() {
    const rows = (DATA.lsaEfficiency || []).filter(r => r);
    const totals = rows.reduce((sum, row) => ({
      calls: sum.calls + (Number(row.leads) || 0),
      spend: sum.spend + (Number(row.lsaSpend) || 0)
    }), { calls: 0, spend: 0 });
    if (!totals.calls || !totals.spend) return;
    const avg = totals.spend / totals.calls;
    const target = Math.round(avg); /* nearest $ — average LSA call cost */
    const basis = rows.map(r => r.month).join(" · ");
    const kpi = (DATA.kpis || []).find(item => item.id === "#12");
    if (kpi) {
      kpi.target = `< $${target.toLocaleString("en-US")}`;
      kpi.cashGoalNote = "LSA avg";
      kpi.lsaAvgCallCost = target;
    }
    DATA.lsaAvgCallCost = {
      avg: target,
      exact: Math.round(avg * 100) / 100,
      spend: Math.round(totals.spend),
      calls: totals.calls,
      basis
    };
  }

  /** Tile month key from DATA.period — e.g. "June 2026" → "Jun". */
  function periodToChannelMonth(period) {
    const name = String(period || "").trim().split(/\s+/)[0];
    const map = {
      January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May",
      June: "Jun", July: "Jul", August: "Aug", September: "Sep", October: "Oct",
      November: "Nov", December: "Dec"
    };
    return map[name] || name.slice(0, 3);
  }

  /**
   * #12 = blended direct contact cost for tile month.
   * Spend: Search media + HubSpot forms fee (+ Yelp ad spend when wired).
   * Contacts: Search calls + form submits + Yelp leads.
   */
  function applyDirectContactCostKpi() {
    const monthKey = periodToChannelMonth(DATA.period);
    const ch = (DATA.channelMonths || []).find(r => r.month === monthKey);
    if (!ch) return;

    const digitalCalls = Number(ch.search) || 0;
    const digitalSpend = Number(ch.searchSpend) || 0;
    const yelp = Number(ch.yelp) || 0;
    const forms = Number(ch.hubspotForms) ?? Math.max(0, (Number(ch.hubspot) || 0) - yelp);
    const hubFee = DATA.websiteHubspotMonthlyFromJun || 0;
    const formFee = forms > 0 ? hubFee : 0;
    const yelpSpend = Number(ch.yelpSpend) || 0;

    const totalSpend = digitalSpend + formFee + yelpSpend;
    const totalContacts = digitalCalls + forms + yelp;
    if (!totalContacts || !totalSpend) return;

    const exact = totalSpend / totalContacts;
    const cost = Math.round(exact);
    const lsaCeiling = DATA.lsaAvgCallCost && DATA.lsaAvgCallCost.avg;

    const kpi = (DATA.kpis || []).find(item => item.id === "#12");
    if (kpi) {
      kpi.label = "Avg. Cost per Direct Contact";
      kpi.value = `$${cost.toLocaleString("en-US")}`;
      if (Number.isFinite(lsaCeiling)) kpi.hit = cost <= lsaCeiling;
    }

    DATA.directContactCost = {
      cost,
      exact: Math.round(exact * 100) / 100,
      month: monthKey,
      digitalCalls,
      digitalSpend: Math.round(digitalSpend),
      forms,
      formFee,
      yelp,
      yelpSpend: Math.round(yelpSpend),
      totalSpend: Math.round(totalSpend),
      totalContacts
    };

    const avgRow = (DATA.costPerCall || []).find(c => /direct contact|all campaigns/i.test(String(c.channel)));
    if (avgRow) avgRow.cost = `$${cost.toLocaleString("en-US")}`;
  }

  /**
   * #02 target = new cases needed so monthly cash clears $100k.
   * cash/case = 2026 full months (ledger credits ÷ newCases); fallback mean fee × 80%.
   */
  function applyNewCasesCashGoalTarget() {
    const GOAL_CASH = 100000;
    const rows = (DATA.cashCollected2026Ytd || []).filter(r => r && !/\*/.test(String(r.month || "")));
    let cash = 0;
    let cases = 0;
    rows.forEach(r => {
      cash += Number(r.credit) || 0;
      cases += Number(r.newCases) || 0;
    });
    const fee = Number(DATA.cashCollectedTotals && DATA.cashCollectedTotals.contractedMean)
      || Number(DATA.phoneIntake && DATA.phoneIntake.avgCaseFee)
      || 5587;
    const feeCollectible = fee * 0.8;
    let cashPerCase = cases > 0 ? cash / cases : 0;
    let basis = cases > 0
      ? `2026 Jan–${rows[rows.length - 1].month} ledger credits ÷ new cases`
      : "mean fee × 80% collectible";
    if (!cashPerCase || cashPerCase < 1000) {
      cashPerCase = feeCollectible;
      basis = "mean fee × 80% collectible";
    }
    const needed = Math.floor(GOAL_CASH / cashPerCase) + 1;
    const kpi = (DATA.kpis || []).find(item => item.id === "#02");
    if (kpi) {
      const current = Number(kpi.count != null ? kpi.count : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""))) || 0;
      kpi.target = `≥ ${needed}`;
      kpi.hit = current >= needed;
      kpi.cashGoalNote = `>$${Math.round(GOAL_CASH / 1000)}k cash/mo`;
    }
    DATA.newCasesCashGoal = {
      goalCash: GOAL_CASH,
      cashPerCase: Math.round(cashPerCase),
      needed,
      basis,
      sampleCash: Math.round(cash),
      sampleCases: cases
    };
  }

  /**
   * #01 target = leads needed so monthly cash clears $100k.
   * Uses full 2026 months with cash > $100k and a known lead stack (Search+LSA+HubSpot/other).
   * 2025 May–Jul cleared $100k but have no 2025 lead stack in Guide — noted in help, not in ratio.
   */
  function applyLeadsCashGoalTarget() {
    const GOAL_CASH = 100000;
    const leadByMonth = {};
    (DATA.channelMonths || []).forEach(m => {
      if (!m || /\*/.test(String(m.month || ""))) return;
      const key = String(m.month).replace(/\*$/, "");
      leadByMonth[key] = (Number(m.search) || 0) + (Number(m.lsa) || 0) + (Number(m.hubspot) || 0);
    });
    (DATA.casesLeadsSpend || []).forEach(r => {
      if (!r || /\*/.test(String(r.month || ""))) return;
      const key = String(r.month).replace(/\*$/, "");
      if (leadByMonth[key] != null) return;
      const parts = [r.leads, r.adsLeads, r.websiteLeads];
      if (parts.every(v => v == null)) return;
      leadByMonth[key] = parts.reduce((s, v) => s + (Number(v) || 0), 0);
    });
    /* Lead stacks in Guide are 2026 only — do not join onto 2025 cash months. */
    const cashRows = (DATA.cashCollected2026Ytd || [])
      .filter(r => r && !/\*/.test(String(r.month || "")))
      .map(r => ({ ...r, year: 2026 }));
    const over = [];
    cashRows.forEach(r => {
      const cash = Number(r.credit) || 0;
      if (cash <= GOAL_CASH) return;
      const key = String(r.month).replace(/\*$/, "");
      const leads = leadByMonth[key];
      if (leads == null || leads <= 0) return;
      over.push({ month: `${key} ${r.year}`, cash, leads });
    });
    const cashOnlyOver = [
      ...(DATA.cashCollected || []).filter(r => (Number(r.credit) || 0) > GOAL_CASH).map(r => `${r.month} 2025`),
      ...cashRows.filter(r => (Number(r.credit) || 0) > GOAL_CASH && leadByMonth[String(r.month).replace(/\*$/, "")] == null)
        .map(r => `${String(r.month).replace(/\*$/, "")} 2026`)
    ];
    let cashPerLead = 0;
    let sampleCash = 0;
    let sampleLeads = 0;
    let basis = "";
    let note = "";
    if (over.length) {
      sampleCash = over.reduce((s, m) => s + m.cash, 0);
      sampleLeads = over.reduce((s, m) => s + m.leads, 0);
      cashPerLead = sampleCash / sampleLeads;
      basis = `2026 months with cash >$100k + known leads (${over.map(m => m.month).join(", ")})`;
    } else {
      const both = cashRows.map(r => {
        const key = String(r.month).replace(/\*$/, "");
        const leads = leadByMonth[key];
        if (leads == null || leads <= 0) return null;
        return { month: `${key} 2026`, cash: Number(r.credit) || 0, leads };
      }).filter(Boolean);
      if (both.length) {
        sampleCash = both.reduce((s, m) => s + m.cash, 0);
        sampleLeads = both.reduce((s, m) => s + m.leads, 0);
        cashPerLead = sampleCash / sampleLeads;
        basis = "fallback: 2026 months with cash + known leads";
      }
    }
    if (cashOnlyOver.length) {
      note = `Cash >$100k without matching 2026 lead stack (excluded): ${cashOnlyOver.join(", ")}.`;
    }
    if (!cashPerLead || cashPerLead < 50) {
      const casesNeeded = (DATA.newCasesCashGoal && DATA.newCasesCashGoal.needed) || 24;
      const junLeads = leadByMonth.Jun || 226;
      const junCases = 36;
      const leadsPerCase = junCases ? junLeads / junCases : 6;
      const needed = Math.ceil(casesNeeded * leadsPerCase);
      const kpi = (DATA.kpis || []).find(item => item.id === "#01");
      if (kpi) {
        const current = Number(kpi.count != null ? kpi.count : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""))) || 0;
        kpi.target = `≥ ${needed}`;
        kpi.hit = current >= needed;
        kpi.cashGoalNote = `>$${Math.round(GOAL_CASH / 1000)}k cash/mo`;
      }
      DATA.leadsCashGoal = {
        goalCash: GOAL_CASH,
        cashPerLead: 0,
        needed,
        basis: "fallback: cases-for-$100k × Jun leads/case",
        sampleCash: 0,
        sampleLeads: 0,
        sampleMonths: [],
        note
      };
      return;
    }
    const needed = Math.floor(GOAL_CASH / cashPerLead) + 1;
    const kpi = (DATA.kpis || []).find(item => item.id === "#01");
    if (kpi) {
      const current = Number(kpi.count != null ? kpi.count : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""))) || 0;
      kpi.target = `≥ ${needed}`;
      kpi.hit = current >= needed;
      kpi.cashGoalNote = `>$${Math.round(GOAL_CASH / 1000)}k cash/mo`;
    }
    DATA.leadsCashGoal = {
      goalCash: GOAL_CASH,
      cashPerLead: Math.round(cashPerLead),
      needed,
      basis,
      sampleCash: Math.round(sampleCash),
      sampleLeads: sampleLeads,
      sampleMonths: over.length ? over : [],
      note
    };
  }

  /**
   * #30 firm-wide est. value per lead — not by channel.
   * Close rate = new cases ÷ full lead stack for complete months only.
   */
  function firmEstValuePerLeadModel() {
    const cfg = DATA.estValuePerLead || {};
    const fee = Number(cfg.avgCaseFee) || Number(DATA.phoneIntake && DATA.phoneIntake.avgCaseFee) || 5587;
    const collectionRate = Number(cfg.collectionRate);
    const coll = Number.isFinite(collectionRate) && collectionRate > 0 ? collectionRate : 0.8;
    const months = (DATA.channelMonths || []).filter(m => m && !/\*/.test(String(m.month || "")));
    let leads = 0;
    let cases = 0;
    const basisMonths = [];
    months.forEach(m => {
      const monthLeads =
        (Number(m.search) || 0) +
        (Number(m.lsa) || 0) +
        (Number(m.hubspot) || 0) +
        (Number(m.yelp) || 0);
      const row = (DATA.casesLeadsSpend || []).find(r => r.month === m.month);
      const monthCases = row ? Number(row.cases) || 0 : 0;
      if (monthLeads > 0 && monthCases > 0) {
        leads += monthLeads;
        cases += monthCases;
        basisMonths.push(m.month);
      }
    });
    const closeRate = leads ? cases / leads : 0;
    const ev = Math.round(closeRate * fee * coll);
    return {
      fee,
      collectionRate: coll,
      leads,
      cases,
      closeRate,
      ev,
      basisMonths
    };
  }

  function hydrateEstValuePerLeadKpi() {
    const m = firmEstValuePerLeadModel();
    const kpi = (DATA.kpis || []).find(item => item.id === "#30");
    if (!kpi || !m.leads || !m.cases) return;
    kpi.value = `$${m.ev.toLocaleString("en-US")}`;
    kpi.target = "Firm-wide";
    kpi.cashGoalNote = `${m.basisMonths.join("+")} · ${(m.closeRate * 100).toFixed(1)}% close`;
    DATA.estValuePerLead = Object.assign({}, DATA.estValuePerLead || {}, m);
  }

  applyLsaAverageCallCostTarget();
  applyDirectContactCostKpi();
  applyNewCasesCashGoalTarget();
  applyLeadsCashGoalTarget();
  hydrateEstValuePerLeadKpi();

  function star() {
    return "";
  }

  /** Corner badges removed — verification lives in ? help sources. */
  function statusCorner() {
    return "";
  }

  function verifiedClass(verified) {
    /* Verified state uses corner checkbox only — no tile outline. */
    return "";
  }

  function sourceFootnote(kpiId) {
    /* Chart sources now live in the upper-right ? help popup. */
    return "";
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  /**
   * Cash collected monthly tiers (NEW-A):
   * ≥$100k → gold · >$80k → green · $60–70k → burnt umber · else neutral.
   * Gaps (<$60k, $70–80k inclusive of $80k) stay default.
   */
  function cashTierClass(n) {
    const amt = Number(n);
    if (!Number.isFinite(amt)) return "";
    if (amt >= 100000) return "kpi-cash-tier kpi-cash-tier-gold";
    if (amt > 80000) return "kpi-cash-tier kpi-cash-tier-green";
    if (amt >= 60000 && amt <= 70000) return "kpi-cash-tier kpi-cash-tier-umber";
    return "kpi-cash-tier kpi-cash-tier-neutral";
  }

  function cashTierFill(n) {
    const amt = Number(n);
    if (!Number.isFinite(amt)) return null;
    if (amt >= 100000) return "#1f8a65";
    if (amt > 80000) return "#1f8a65";
    if (amt >= 60000 && amt <= 70000) return "#9a3f14";
    return null;
  }

  function fmtCashTier(n) {
    const cls = cashTierClass(n);
    return cls
      ? `<span class="${cls}">${fmtMoney(n)}</span>`
      : fmtMoney(n);
  }

  function kpiDetailAccordion(title, hint, headers, rows) {
    const hintHtml = hint
      ? `<span class="kpi-table-acc-hint">${escapeHtml(hint)}</span>`
      : "";
    return `<details class="kpi-table-acc">
      <summary class="kpi-table-acc-summary">${escapeHtml(title)}${hintHtml}</summary>
      <div class="kpi-chart-detail kpi-chart-detail-acc">
        <table class="kpi-table kpi-chart-table kpi-table-dense">
          <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </details>`;
  }

  function channelBarChart(channels) {
    const max = Math.max(...channels.map(c => c.count), 1);
    const w = 420;
    const h = 200;
    const pad = { l: 44, r: 16, t: 28, b: 40 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / channels.length;
    const barW = Math.min(64, slot * 0.55);
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round(max * p);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = channels.map((c, i) => {
      const bh = Math.max(6, (plotH * c.count) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const short = c.name.replace(/\s.*/, "");
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${c.color}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${c.count}</text>
        <text x="${x + barW / 2}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${short}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Leads by channel bar chart">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function leadsByMonthFromChannels(channels, opts) {
    const useMonths = opts && opts.useChannelMonths && DATA.channelMonths && DATA.channelMonths.length;
    if (useMonths) {
      const colors = {
        search: "#3a1a6e",
        lsa: "#1e3a8a",
        hubspot: "#b23a78"
      };
      const labels = {
        search: "Search calls",
        lsa: "LSA inbox",
        hubspot: "HubSpot / other"
      };
      return newestFirst(DATA.channelMonths).map(m => ({
        month: m.month,
        segments: [
          { name: labels.search, count: m.search || 0, color: colors.search },
          { name: labels.lsa, count: m.lsa || 0, color: colors.lsa },
          { name: labels.hubspot, count: m.hubspot || 0, color: colors.hubspot }
        ]
      }));
    }
    /* Fallback — prior = May, count = Jun only */
    return newestFirst([
      {
        month: "May",
        segments: channels.map(c => ({ name: c.name, count: c.prior, color: c.color }))
      },
      {
        month: "Jun",
        segments: channels.map(c => ({ name: c.name, count: c.count, color: c.color }))
      }
    ]);
  }

  function stackedLeadsByMonthChart(months) {
    const totals = months.map(m => m.segments.reduce((s, x) => s + (Number(x.count) || 0), 0));
    const rawMax = Math.max(...totals, 1);
    /* Round count axis to a clean step (50/100) — avoid odd ticks like 57 / 113 / 170.
       Top tick must stay ≥ one integer above highest data point (brand §7). */
    const step = rawMax <= 100 ? 25 : rawMax <= 250 ? 50 : 100;
    const axisMax = axisMaxAboveData(rawMax * 1.06, step);
    const tickVals = [];
    for (let t = 0; t <= axisMax; t += step) tickVals.push(t);
    const w = 640;
    const h = 300;
    const pad = { l: 54, r: 22, t: 24, b: 52 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(96, slot * 0.52);
    const ticks = tickVals.map(t => {
      const y = pad.t + plotH * (1 - t / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${t}</text>
      </g>`;
    }).join("");
    const bars = months.map((m, i) => {
      const x = pad.l + i * slot + (slot - barW) / 2;
      let y = pad.t + plotH;
      const segs = m.segments.map(seg => {
        const count = Number(seg.count) || 0;
        const hh = (plotH * count) / axisMax;
        y -= hh;
        if (!count) return "";
        /* Only label when the segment is tall enough — tiny slices live in the table. */
        const showLabel = hh >= 22;
        const label = showLabel
          ? `<text x="${x + barW / 2}" y="${y + hh / 2 + 4}" text-anchor="middle" class="kpi-chart-segment-count">${count}</text>`
          : "";
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
            <title>${escapeHtml(seg.name)}: ${count}</title>
          </rect>
          ${label}
        </g>`;
      }).join("");
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(m.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Stacked leads by month — Search, LSA, HubSpot">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Leads</text>
    </svg>`;
  }

  function casesMomByMonth(rows, series) {
    const colorByName = Object.fromEntries(series.map(s => [s.name, s.color]));
    return newestFirst(rows).map(r => ({
      month: r.month,
      segments: [
        { name: "Closed cases", count: r.closed, color: colorByName["Closed cases"] },
        { name: "New cases", count: r.newCases, color: colorByName["New cases"] },
        { name: "Red accounts", count: r.redAccounts, color: colorByName["Red accounts"] }
      ]
    }));
  }

  function stackedCasesMomChart(months) {
    const totals = months.map(m => m.segments.reduce((s, x) => s + (Number(x.count) || 0), 0));
    const max = Math.max(...totals, 1);
    const w = 560;
    const h = 280;
    const pad = { l: 48, r: 36, t: 48, b: 46 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(84, slot * 0.46);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round(max * p);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = months.map((m, i) => {
      const total = totals[i];
      const x = pad.l + i * slot + (slot - barW) / 2;
      let y = pad.t + plotH;
      const segs = m.segments.map(seg => {
        const count = Number(seg.count) || 0;
        const hh = total ? (plotH * count) / max : 0;
        y -= hh;
        const label = hh >= 14
          ? `<text x="${x + barW / 2}" y="${y + hh / 2 + 4}" text-anchor="middle" class="kpi-seg-count">${count}</text>`
          : "";
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
            <title>${escapeHtml(seg.name)}: ${count}</title>
          </rect>
          ${label}
        </g>`;
      }).join("");
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${pad.t - 14}" text-anchor="middle" class="kpi-chart-total">${total}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${m.month}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Closed, new, and red accounts stacked by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
    </svg>`;
  }

  function casesMomSeriesMom(rows, key) {
    if (!rows || rows.length < 2) return null;
    const ordered = newestFirst(rows.slice());
    const curr = Number(ordered[0][key]);
    const prior = Number(ordered[1][key]);
    if (!Number.isFinite(curr) || !Number.isFinite(prior) || prior === 0) return null;
    const pct = Math.round(((curr - prior) / prior) * 100);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  }

  function casesMomLegend(series, rows) {
    const keyByName = {
      "Closed cases": "closed",
      "New cases": "newCases",
      "Red accounts": "redAccounts"
    };
    return `<ul class="kpi-stack-legend" aria-label="Series colors">${series.map(c => {
      const mom = casesMomSeriesMom(rows, keyByName[c.name]);
      const delta = mom ? momChangeHtml(mom) : "";
      return `<li><span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span><span>${escapeHtml(c.name)}</span>${delta}</li>`;
    }).join("")}</ul>`;
  }

  function casesMomDetailTable(rows) {
    const ordered = newestFirst(rows.slice());
    const momPct = (curr, prior) => {
      if (prior == null || prior === 0) return "—";
      const pct = Math.round(((curr - prior) / prior) * 100);
      const label = pct > 0 ? `+${pct}%` : `${pct}%`;
      return momChangeHtml(label) || "—";
    };
    /* Chronological for MoM math, then emit newest → oldest. */
    const chrono = rows.slice().sort((a, b) => String(a.month).localeCompare(String(b.month)));
    const byMonth = Object.fromEntries(chrono.map((r, i) => [r.month, { r, prior: i > 0 ? chrono[i - 1] : null }]));
    const tableRows = ordered.map(r => {
      const prior = (byMonth[r.month] && byMonth[r.month].prior) || null;
      const total = r.closed + r.newCases + r.redAccounts;
      const notes = prior
        ? `Closed ${momPct(r.closed, prior.closed)} · New ${momPct(r.newCases, prior.newCases)} · Red ${momPct(r.redAccounts, prior.redAccounts)}`
        : "—";
      return [
        escapeHtml(r.month),
        String(r.closed),
        String(r.newCases),
        String(r.redAccounts),
        String(total),
        notes
      ];
    });
    const totClosed = rows.reduce((s, r) => s + r.closed, 0);
    const totNew = rows.reduce((s, r) => s + r.newCases, 0);
    const totRed = rows.reduce((s, r) => s + r.redAccounts, 0);
    tableRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${totClosed}</span>`,
      `<span class="kpi-table-total">${totNew}</span>`,
      `<span class="kpi-table-total">${totRed}</span>`,
      `<span class="kpi-table-total">${totClosed + totNew + totRed}</span>`,
      "—"
    ]);
    return kpiDetailTable(
      ["Month", "Closed", "New cases", "Red accounts", "Total", "MoM notes"],
      tableRows
    );
  }

  function channelLegend(channels) {
    /* Series use color swatches only — verified state lives on the panel corner, not per legend row. */
    return `<ul class="kpi-stack-legend" aria-label="Series colors">${channels.map(c =>
      `<li><span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span><span>${escapeHtml(c.name)}</span></li>`
    ).join("")}</ul>`;
  }

  function kpiDetailTable(headers, rows) {
    return `<div class="kpi-chart-detail">
      <table class="kpi-table kpi-chart-table">
        <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
  }

  /**
   * Required chart card title block — every chartBlock must have a head.
   * Brand: REPORTING-BRAND-GUIDE §7 + BRANDING-LAYOUT chart pattern.
   */
  function chartHeadHtml(title, subtitle) {
    const sub = subtitle
      ? `<div class="kpi-chart-subtitle">${escapeHtml(subtitle)}</div>`
      : "";
    return `<div class="kpi-chart-title-large"><strong>${escapeHtml(title)}</strong>${sub}</div>`;
  }

  function chartBlock(opts) {
    const headInner = opts.head || (opts.title ? chartHeadHtml(opts.title, opts.subtitle) : "");
    const head = headInner ? `<div class="kpi-chart-head">${headInner}</div>` : "";
    const legend = opts.legend || "";
    const table = opts.table || "";
    const focus = opts.focus ? ` data-kpi-focus="${opts.focus}"` : "";
    const helpId = opts.helpId || opts.focus || "";
    const help = helpId ? kpiHelpBtn(helpId) : "";
    /* Footnotes live under ? help — not under the chart. */
    const badge = typeof opts.verified === "boolean" ? statusCorner(opts.verified) : "";
    const wipClass = opts.wip ? " kpi-chart-wip" : "";
    const card = `<div class="kpi-chart-card${wipClass}"${focus}>
      ${badge}
      ${help}
      ${head}
      <div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>
      ${table}
    </div>`;
    if (!opts.wip) return card;
    const note = opts.wipNote
      ? `<p class="kpi-chart-wip-note">${escapeHtml(opts.wipNote)}</p>`
      : `<p class="kpi-chart-wip-note">Needs better data before this chart is live.</p>`;
    return `<div class="kpi-chart-wip-shell" aria-disabled="true">
      <span class="kpi-chart-wip-banner">On hold</span>
      ${note}
      ${card}
    </div>`;
  }

  /**
   * Y-scale top must sit at least one integer above the highest data point
   * (REPORTING-BRAND-GUIDE §7 — bars/lines never kiss the top tick).
   */
  function axisMaxAboveData(rawMax, step) {
    const dataMax = Math.max(Number(rawMax) || 0, 0);
    const minTop = Math.floor(dataMax) + 1;
    if (step && step > 0) {
      let top = Math.ceil(minTop / step) * step;
      if (top <= dataMax) top += step;
      return Math.max(top, minTop);
    }
    return minTop;
  }

  function niceAxisMax(n) {
    const dataMax = Math.max(Number(n) || 0, 0);
    const minTop = Math.floor(dataMax) + 1;
    const v = Math.max(dataMax * 1.12, minTop, 1);
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const norm = v / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return Math.max(nice * mag, minTop);
  }

  function axisTicks(max, count) {
    const n = Math.max(2, count || 5);
    return Array.from({ length: n }, (_, i) => Math.round((max * i) / (n - 1)));
  }

  /** LSA calls + digital ad calls + website forms. Null when none of the three are known. */
  function incomingTotal(r) {
    const parts = [r.leads, r.adsLeads, r.websiteLeads];
    if (parts.every(v => v == null)) return null;
    return parts.reduce((s, v) => s + (Number(v) || 0), 0);
  }

  /** Phone calls only (LSA + digital Search). Null when both unknown. */
  function phoneCallsTotal(r) {
    if (r.leads == null && r.adsLeads == null) return null;
    return (Number(r.leads) || 0) + (Number(r.adsLeads) || 0);
  }

  function lastCasesLeadsSpendMonths(rows, n) {
    return newestFirst(rows || []).slice(0, Math.max(1, n || 3));
  }

  function cashForMonth2026(monthLabel) {
    const key = String(monthLabel || "").replace(/\*$/, "");
    const row = (DATA.cashCollected2026Ytd || []).find(r => String(r.month || "").replace(/\*$/, "") === key);
    return row && row.credit != null ? Number(row.credit) : null;
  }

  /** Dual-axis: cases + leads (left count, fixed 0–300) · marketing spend (right $). */
  function dualAxisCasesSpendChart(rows) {
    rows = lastCasesLeadsSpendMonths(rows, 3);
    const w = 980;
    const h = 360;
    const pad = { l: 58, r: 78, t: 28, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const leftMax = 300;
    const rightMax = niceAxisMax(Math.max(...rows.map(r => r.spend || 0), 1));
    const leftY = v => pad.t + plotH * (1 - Math.min(v, leftMax) / leftMax);
    const rightY = v => pad.t + plotH * (1 - v / rightMax);
    const slot = plotW / rows.length;
    const colors = { cases: "#4f8a63", leads: "#1e3a8a", spend: "#6a5acd" };
    const barW = Math.min(48, slot * 0.28);
    const gap = 10;
    const leftTicks = [0, 100, 200, 300].map(t => {
      const y = leftY(t);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${t}</text>
      </g>`;
    }).join("");
    const rightTicks = axisTicks(rightMax, 6).map(t => {
      const y = rightY(t);
      const label = t === 0 ? "$0" : (t >= 1000 ? `$${Math.round(t / 1000)}k` : `$${t}`);
      return `<text x="${w - pad.r + 8}" y="${y + 4}" class="kpi-chart-axis" style="fill:${colors.spend}">${label}</text>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const leads = incomingTotal(r);
      const casesX = cx - barW - gap / 2;
      const leadsX = cx + gap / 2;
      const barLabel = (x, value, topY) =>
        `<text x="${x - 6}" y="${topY + 4}" text-anchor="end" class="kpi-chart-total" style="fill:#111">${value}</text>`;
      const casesBar = (r.cases != null && r.cases > 0)
        ? `<rect x="${casesX}" y="${leftY(r.cases)}" width="${barW}" height="${pad.t + plotH - leftY(r.cases)}" rx="3" fill="${colors.cases}"/>
           ${barLabel(casesX, r.cases, leftY(r.cases))}`
        : "";
      const leadsBar = (leads != null && leads > 0)
        ? `<rect x="${leadsX}" y="${leftY(leads)}" width="${barW}" height="${pad.t + plotH - leftY(leads)}" rx="3" fill="${colors.leads}"/>
           ${barLabel(leadsX, leads, leftY(leads))}`
        : "";
      return `<g>
        ${casesBar}
        ${leadsBar}
        <text x="${cx}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const spendPts = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      return `${cx},${rightY(r.spend)}`;
    }).join(" ");
    /* Spend $ labels sit to the LEFT of markers in black for legibility. */
    const spendDots = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const cy = rightY(r.spend);
      const spendLabel = r.spend >= 1000
        ? `$${Math.round(r.spend / 1000)}k`
        : `$${r.spend || 0}`;
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="5" fill="${colors.spend}"/>
        <text x="${cx - 11}" y="${cy + 4}" text-anchor="end" class="kpi-chart-total" style="fill:#111">${spendLabel}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-chart-svg-wide" viewBox="0 0 ${w} ${h}" role="img" aria-label="New cases and leads vs marketing spend — last 3 months">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${leftTicks}${rightTicks}${bars}
      <polyline points="${spendPts}" fill="none" stroke="${colors.spend}" stroke-width="3"/>
      ${spendDots}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cases</text>
      <text x="${w - 12}" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(90 ${w - 12} ${pad.t + plotH / 2})" class="kpi-chart-axis" style="fill:${colors.spend}">Spend ($)</text>
    </svg>`;
  }

  function casesLeadsSpendLegend() {
    const items = [
      { name: "New cases", color: "#4f8a63" },
      { name: "Direct Contacts", color: "#1e3a8a" },
      { name: "Marketing spend", color: "#6a5acd" }
    ];
    return channelLegend(items);
  }

  function casesLeadsSpendTable(rows) {
    const newest = lastCasesLeadsSpendMonths(rows, 3);
    const dash = "—";
    const body = newest.map(r => {
      const leads = incomingTotal(r);
      const calls = phoneCallsTotal(r);
      const cases = r.cases != null ? Number(r.cases) : null;
      const cash = cashForMonth2026(r.month);
      const conv = (leads != null && leads > 0 && cases != null && cases > 0)
        ? `${((cases / leads) * 100).toFixed(1)}%`
        : dash;
      const leadsPerCase = (leads != null && leads > 0 && cases != null && cases > 0)
        ? `${(leads / cases).toFixed(1)} : 1`
        : dash;
      return [
        escapeHtml(r.month) + " 2026",
        cases != null ? String(cases) : dash,
        leads != null ? String(leads) : dash,
        calls != null ? String(calls) : dash,
        fmtMoney(r.spend || 0),
        cash != null ? fmtMoney(cash) : dash,
        conv,
        leadsPerCase
      ];
    });
    return kpiDetailAccordion(
      "Lead → case planning table",
      "Last 3 months · leads per case for volume planning",
      ["Period", "Cases", "Leads", "Calls", "Marketing spend", "Cash", "Conversion", "Leads per case"],
      body
    );
  }

  function casesLeadsSpendSectionHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return `<article class="kpi-split-panel data-chart-table-panel" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Key Channel Activity">
      ${statusCorner(true)}
      ${kpiHelpBtn("cases-leads-spend")}
      <div class="kpi-split-panel-body data-chart-table-stack">
        <div class="data-chart-table-grid">
          ${chartBlock({
            title: "Cases, leads & marketing spend",
            subtitle: "Last 3 months · left axis 0–300 · newest first",
            chart: dualAxisCasesSpendChart(rows),
            legend: casesLeadsSpendLegend()
          })}
          <div class="kpi-chart-detail data-chart-side-table">
            ${casesLeadsSpendTable(rows)}
            ${sourceFootnote("cases-leads-spend")}
          </div>
        </div>
        ${chartBlock({
          title: "June cost per response by channel",
          subtitle: "Media only · website = HubSpot forms fee",
          chart: junCostPerResponseChart(rows),
          wip: true,
          verified: false,
          wipNote: "Needs better data to calculate lead quality and cost by channel before this goes live."
        })}
      </div>
      ${kpiRefMark("#05")}
    </article>`;
  }

  function junCostPerResponseChart(rows) {
    const jun = (rows || []).find(r => r.month === "Jun");
    if (!jun || !jun.leads || !jun.adsLeads) return "";
    const hubFee = DATA.websiteHubspotMonthlyFromJun || 1000;
    const websiteForms = jun.websiteLeads || 0;
    const channels = [
      { label: "LSA", unit: "$/call", value: jun.lsaSpend / jun.leads, color: "#1e3a8a" },
      { label: "Digital", unit: "$/call", value: jun.adsSpend / jun.adsLeads, color: "#c45c26" },
      { label: "Website", unit: "$/form", value: websiteForms ? hubFee / websiteForms : 0, color: "#6a5acd" }
    ].filter(c => c.value > 0);
    const w = 540;
    const h = 260;
    /* Left pad: room for rotated axis title + tick labels without overlap (brand §7). */
    const pad = { l: 84, r: 18, t: 34, b: 58 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const max = Math.max(200, ...channels.map(c => c.value));
    const axisMax = axisMaxAboveData(max, 50);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const value = Math.round(axisMax * p);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${value}</text>
      </g>`;
    }).join("");
    const slot = plotW / channels.length;
    const barW = Math.min(84, slot * 0.56);
    const bars = channels.map((c, i) => {
      const bh = Math.max(6, (plotH * c.value) / axisMax);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${c.color}" fill-opacity="${c.wip ? "0.4" : "1"}"/>
        <text x="${x + barW / 2}" y="${y - 9}" text-anchor="middle" class="kpi-chart-total"${c.wip ? ' opacity="0.6"' : ""}>${fmtMoney(c.value)}</text>
        <text x="${x + barW / 2}" y="${h - 28}" text-anchor="middle" class="kpi-chart-label">${c.label}</text>
        <text x="${x + barW / 2}" y="${h - 12}" text-anchor="middle" class="kpi-chart-axis">${c.unit}</text>
      </g>`;
    }).join("");
    const aria = channels
      .map(c => `${c.label} ${fmtMoney(c.value)} ${c.unit}`)
      .join(", ");
    const axisTitleX = 18;
    const axisTitleY = pad.t + plotH / 2;
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="June cost per response: ${aria}">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="${axisTitleX}" y="${axisTitleY}" text-anchor="middle" transform="rotate(-90 ${axisTitleX} ${axisTitleY})" class="kpi-chart-axis">Cost per response ($)</text>
    </svg>`;
  }

  /**
   * Sales Funnel — tapered volume bands + unit-cost accordion.
   * Ads window: Jun 11–Jul 10 Campaign · contacts/cases: June calendar Guide.
   * Brand colors only — no teal/cyan.
   */
  function salesCostFunnelStages() {
    const searchSpend = 6277.36;
    const impressions = 15871;
    const clicks = 640;
    const junSearch = 8296;
    const junLsa = 13206;
    const junFormsFee = 1000;
    const junCalls = 138;
    const junForms = 5;
    const junLsaLeads = 83;
    const junYelp = 0;
    const junDirect = junCalls + junForms + junLsaLeads + junYelp;
    const junDirectSpend = junSearch + junLsa + junFormsFee;
    const junCases = 36;
    const junMedia = junSearch + junLsa;
    const stepPct = (part, whole) =>
      whole ? `${((part / whole) * 100).toFixed(1)}%` : "—";
    const moneyDigits = (n, digits) =>
      "$" + Number(n).toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    return [
      {
        key: "impr",
        label: "Impressions",
        volume: impressions,
        volumeText: impressions.toLocaleString("en-US"),
        color: "#3a1a6e",
        unitCost: moneyDigits(searchSpend / impressions, 2),
        spend: moneyDigits(searchSpend, 2),
        spendBasis: "Search Ads",
        conversion: "—"
      },
      {
        key: "clicks",
        label: "Clicks",
        volume: clicks,
        volumeText: clicks.toLocaleString("en-US"),
        color: "#c45c26",
        unitCost: moneyDigits(searchSpend / clicks, 2),
        spend: moneyDigits(searchSpend, 2),
        spendBasis: "Search Ads",
        conversion: stepPct(clicks, impressions)
      },
      {
        key: "contacts",
        label: "Direct contacts",
        volume: junDirect,
        volumeText: String(junDirect),
        color: "#1e3a8a",
        unitCost: fmtMoney(junDirectSpend / junDirect),
        spend: fmtMoney(junDirectSpend),
        spendBasis: "Calls + forms + LSA + Yelp",
        conversion: stepPct(junDirect, clicks)
      },
      {
        key: "cases",
        label: "Signed cases",
        volume: junCases,
        volumeText: String(junCases),
        color: "#b23a78",
        unitCost: fmtMoney(junMedia / junCases),
        spend: fmtMoney(junMedia),
        spendBasis: "All sources · Search + LSA media",
        conversion: stepPct(junCases, junDirect)
      }
    ];
  }

  function salesCostFunnelSvg(stages) {
    const n = stages.length;
    const labelCol = 148;
    const chartW = 360;
    const segH = 56;
    const gap = 6;
    const top = 8;
    const height = top + n * segH + (n - 1) * gap;
    const width = labelCol + chartW + 16;
    const cx = labelCol + chartW / 2;
    const topHalf = chartW / 2 - 4;
    const botHalf = 28;
    const bands = stages.map((stage, i) => {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      const half0 = topHalf + (botHalf - topHalf) * t0;
      const half1 = topHalf + (botHalf - topHalf) * t1;
      const y0 = top + i * (segH + gap);
      const y1 = y0 + segH;
      const poly = [
        `${cx - half0},${y0}`,
        `${cx + half0},${y0}`,
        `${cx + half1},${y1}`,
        `${cx - half1},${y1}`
      ].join(" ");
      const midY = (y0 + y1) / 2 + 5;
      return `<g>
        <polygon points="${poly}" fill="${stage.color}"/>
        <text x="4" y="${midY}" class="kpi-chart-label" style="fill:var(--gg-brown);font-weight:600;font-size:13px">${escapeHtml(stage.label)}</text>
        <text x="${cx}" y="${midY}" text-anchor="middle" class="kpi-chart-total" style="fill:#fffcf7;font-size:18px;font-weight:700">${escapeHtml(stage.volumeText)}</text>
      </g>`;
    }).join("");
    const aria = stages.map(s => `${s.label} ${s.volumeText}`).join(", ");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-sales-funnel-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Sales funnel: ${aria}">
      ${bands}
    </svg>`;
  }

  function salesCostFunnelTable(stages) {
    const rows = stages.map(s => [
      escapeHtml(s.label),
      escapeHtml(s.volumeText),
      escapeHtml(s.spendBasis),
      escapeHtml(s.spend),
      escapeHtml(s.unitCost),
      escapeHtml(s.conversion)
    ]);
    return kpiDetailAccordion(
      "Unit cost table",
      "Ads Jun 11–Jul 10 · contacts/cases June calendar",
      ["Stage", "Volume", "Spend basis", "Spend", "Unit cost", "Step conversion"],
      rows
    );
  }

  function salesCostFunnelPanelHtml() {
    const stages = salesCostFunnelStages();
    return `<article class="kpi-split-panel" data-feedback-id="section-sales-cost-funnel" data-feedback-label="Sales Funnel">
      <div class="kpi-split-panel-body">
        ${chartBlock({
          helpId: "sales-cost-funnel",
          verified: true,
          title: "Sales Funnel",
          subtitle: "Impressions → clicks → direct contacts → signed cases",
          chart: salesCostFunnelSvg(stages),
          table: salesCostFunnelTable(stages)
        })}
      </div>
    </article>`;
  }

  /** Months with both LSA + digital volume & spend (for cost trend). */
  function costCompareMonths(rows) {
    /* Current month first, then count down. */
    return newestFirst(
      (rows || [])
        .filter(r => r.leads > 0 && r.adsLeads > 0 && r.lsaSpend > 0 && r.adsSpend > 0)
        .map(r => {
          const lsaCpl = r.lsaSpend / r.leads;
          const digCpl = r.adsSpend / r.adsLeads;
          return {
            month: r.month,
            partial: /\*/.test(r.month || ""),
            lsaCpl,
            digCpl,
            lsaVsDigRatio: lsaCpl / digCpl
          };
        })
    );
  }

  /** Grouped bars: LSA $/call vs digital $/call by month. */
  function lsaVsDigitalCostTrendChart(rows) {
    const months = costCompareMonths(rows);
    if (!months.length) return "";
    const w = 540;
    const h = 260;
    const pad = { l: 54, r: 18, t: 34, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const max = Math.max(...months.map(m => Math.max(m.lsaCpl, m.digCpl)), 1);
    const axisMax = niceAxisMax(max);
    const colors = { lsa: "#1e3a8a", dig: "#c45c26" };
    const ticks = axisTicks(axisMax, 5).map(t => {
      const y = pad.t + plotH * (1 - t / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${t}</text>
      </g>`;
    }).join("");
    const slot = plotW / months.length;
    const barW = Math.min(28, slot * 0.28);
    const bars = months.map((m, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const lsaH = Math.max(4, (plotH * m.lsaCpl) / axisMax);
      const digH = Math.max(4, (plotH * m.digCpl) / axisMax);
      const lsaY = pad.t + plotH - lsaH;
      const digY = pad.t + plotH - digH;
      const label = m.partial ? `${escapeHtml(m.month)} partial` : escapeHtml(m.month);
      return `<g>
        <rect x="${cx - barW - 3}" y="${lsaY}" width="${barW}" height="${lsaH}" rx="4" fill="${colors.lsa}"/>
        <text x="${cx - barW / 2 - 3}" y="${lsaY - 7}" text-anchor="middle" class="kpi-chart-total">${fmtMoney(m.lsaCpl)}</text>
        <rect x="${cx + 3}" y="${digY}" width="${barW}" height="${digH}" rx="4" fill="${colors.dig}"/>
        <text x="${cx + barW / 2 + 3}" y="${digY - 7}" text-anchor="middle" class="kpi-chart-total">${fmtMoney(m.digCpl)}</text>
        <text x="${cx}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${label}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="LSA vs digital cost per call trend by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">$/call</text>
    </svg>`;
  }

  function lsaVsDigitalCostTrendLegend() {
    return channelLegend([
      { name: "LSA $/call", color: "#1e3a8a" },
      { name: "Digital $/call", color: "#c45c26" }
    ]);
  }

  function lsaVsDigitalCostTrendNote(rows) {
    const months = costCompareMonths(rows);
    if (!months.length) return "";
    const complete = months.filter(m => !m.partial);
    const blendLsa = complete.reduce((s, m) => s + m.lsaCpl * ((rows.find(r => r.month === m.month) || {}).leads || 0), 0);
    const blendLsaCalls = complete.reduce((s, m) => s + ((rows.find(r => r.month === m.month) || {}).leads || 0), 0);
    const blendDig = complete.reduce((s, m) => s + m.digCpl * ((rows.find(r => r.month === m.month) || {}).adsLeads || 0), 0);
    const blendDigCalls = complete.reduce((s, m) => s + ((rows.find(r => r.month === m.month) || {}).adsLeads || 0), 0);
    const blendRatio = blendDigCalls && blendLsaCalls
      ? (blendLsa / blendLsaCalls) / (blendDig / blendDigCalls)
      : 0;
    const trend = months
      .map(m => `${escapeHtml(m.month)}${m.partial ? " partial" : ""} ${m.lsaVsDigRatio.toFixed(2)}×`)
      .join(" · ");
    return `<p class="data-inline-note">LSA cost ${trend} digital. May–Jun blended ratio: ${blendRatio.toFixed(2)}×.</p>`;
  }

  /** Ordinary least-squares line: y ≈ slope * x + intercept. */
  function linearTrendFit(xs, ys) {
    const n = xs.length;
    if (n < 2) return null;
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sxx = 0;
    for (let i = 0; i < n; i++) {
      sx += xs[i];
      sy += ys[i];
      sxy += xs[i] * ys[i];
      sxx += xs[i] * xs[i];
    }
    const denom = n * sxx - sx * sx;
    if (!denom) return null;
    const slope = (n * sxy - sx * sy) / denom;
    const intercept = (sy - slope * sx) / n;
    return { slope, intercept };
  }

  function monthChronoIndex(month) {
    const key = String(month || "").replace(/\*$/, "").slice(0, 3);
    const map = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : 0;
  }

  function cashCollectedChart(rows) {
    rows = newestFirst(rows);
    const expenseEarly2025 = 35000; /* Jan–Mar */
    const expenseLate2025 = 65000; /* Apr–Dec */
    const target2026 = 80000;
    const trendColor = "#1f8a65";
    const expenseColor = "#9a3f14";
    function expenseFor2025Month(month) {
      const key = String(month || "").replace(/\*$/, "");
      return key === "Jan" || key === "Feb" || key === "Mar" ? expenseEarly2025 : expenseLate2025;
    }
    const current = rows.find(r => /\*/.test(r.month || ""));
    const currentPace = current
      ? {
          projected: Math.round((current.credit / 15) * 31),
          daysElapsed: 15,
          daysInMonth: 31
        }
      : null;
    const max = Math.max(
      ...rows.map(r => r.credit),
      target2026,
      expenseLate2025,
      currentPace ? currentPace.projected : 0,
      1
    );
    const w = Math.max(1120, rows.length * 56 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 42, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(36, slot * 0.58);
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round(max * p / 1000);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${val}k</text>
      </g>`;
    }).join("");
    const targetY = pad.t + plotH * (1 - target2026 / max);
    /* Newest first: 2026 YTD on the left, 2025 on the right. */
    const dividerIndex = Math.max(0, rows.findIndex(r => Number(r.year) === 2025));
    const dividerX = pad.l + dividerIndex * slot;
    /* 2025 stepped expense line: Jan–Mar $35k · Apr–Dec $65k */
    const expense2025Segs = [];
    rows.forEach((r, i) => {
      if (Number(r.year) !== 2025) return;
      const level = expenseFor2025Month(r.month);
      const y = pad.t + plotH * (1 - level / max);
      const x1 = pad.l + i * slot;
      const x2 = x1 + slot;
      const prev = expense2025Segs[expense2025Segs.length - 1];
      if (prev && prev.level === level) {
        prev.x2 = x2;
      } else {
        expense2025Segs.push({ level, y, x1, x2 });
      }
    });
    const expenseLineHtml = expense2025Segs.map(seg => {
      const label = seg.level === expenseEarly2025 ? "$35k Jan–Mar" : "$65k Apr–Dec";
      const labelX = seg.level === expenseEarly2025 ? seg.x2 - 4 : seg.x1 + 4;
      const labelAnchor = seg.level === expenseEarly2025 ? "end" : "start";
      return `<g>
        <line x1="${seg.x1}" y1="${seg.y}" x2="${seg.x2}" y2="${seg.y}" stroke="${expenseColor}" stroke-width="2" stroke-dasharray="7 5"/>
        <text x="${labelX}" y="${seg.y - 8}" text-anchor="${labelAnchor}" class="kpi-chart-total" style="fill:${expenseColor}">${label}</text>
      </g>`;
    }).join("");
    /* 2026 trend: OLS on monthly run-rate (Jul* uses pace so partial month does not crush the slope). */
    const trend2026Pts = [];
    rows.forEach((r, i) => {
      if (Number(r.year) !== 2026) return;
      const isCurrent = /\*/.test(r.month || "");
      const yVal = isCurrent && currentPace ? currentPace.projected : Number(r.credit) || 0;
      trend2026Pts.push({
        displayIndex: i,
        chrono: monthChronoIndex(r.month),
        yVal,
        cx: pad.l + i * slot + slot / 2
      });
    });
    const fit = linearTrendFit(
      trend2026Pts.map(p => p.chrono),
      trend2026Pts.map(p => p.yVal)
    );
    let trendLineHtml = "";
    if (fit && trend2026Pts.length >= 2) {
      const fitted = trend2026Pts
        .slice()
        .sort((a, b) => a.displayIndex - b.displayIndex)
        .map(p => {
          const yFit = fit.slope * p.chrono + fit.intercept;
          const y = pad.t + plotH * (1 - Math.max(0, Math.min(max, yFit)) / max);
          return `${p.cx.toFixed(1)},${y.toFixed(1)}`;
        });
      const labelPt = trend2026Pts.reduce((best, p) => (p.displayIndex < best.displayIndex ? p : best), trend2026Pts[0]);
      const labelYFit = fit.slope * labelPt.chrono + fit.intercept;
      const labelY = pad.t + plotH * (1 - Math.max(0, Math.min(max, labelYFit)) / max);
      trendLineHtml = `<g class="kpi-cash-trend-2026" aria-label="2026 cash trend line">
        <polyline points="${fitted.join(" ")}" fill="none" stroke="${trendColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="${labelPt.cx + 10}" y="${Math.max(pad.t + 12, labelY - 10)}" text-anchor="start" class="kpi-chart-total" style="fill:${trendColor}">2026 trend</text>
      </g>`;
    }
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const bh = Math.max(6, (plotH * r.credit) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      /* Full bar fill from cash tier — never force current-month blue on the rect. */
      const fill = cashTierFill(r.credit) || "#5c4f45";
      const applicableTarget = Number(r.year) === 2026 ? target2026 : expenseFor2025Month(r.month);
      const labelColor = r.credit < applicableTarget ? "#cf2d56" : fill;
      const projection = isCurrent && currentPace
        ? (() => {
            const py = pad.t + plotH * (1 - currentPace.projected / max);
            return `<line x1="${x - 4}" x2="${x + barW + 4}" y1="${py}" y2="${py}" stroke="#1e3a8a" stroke-width="3" stroke-dasharray="4 4"/>
        <text x="${x + barW / 2}" y="${py - 8}" text-anchor="middle" class="kpi-chart-total" style="fill:#1e3a8a">$${Math.round(currentPace.projected / 1000)}k pace</text>`;
          })()
        : "";
      const labelStyle = ` style="fill:${labelColor}"`;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${labelStyle}>$${Math.round(r.credit / 1000)}k</text>
        ${projection}
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const firstYearCenter = pad.l + (dividerIndex * slot) / 2;
    const secondYearCenter = dividerX + ((rows.length - dividerIndex) * slot) / 2;
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cash collected by month — 2025 through July 2026 with 2026 trend">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${firstYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2026 YTD</text>
      <text x="${secondYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2025</text>
      <line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${h - pad.b + 10}" stroke="#7a6a58" stroke-width="2" stroke-dasharray="4 6"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${dividerX}" y2="${targetY}" stroke="#3a1a6e" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="${dividerX - 8}" y="${targetY - 8}" text-anchor="end" class="kpi-chart-total" style="fill:#3a1a6e">$80k target</text>
      ${expenseLineHtml}
      ${bars}
      ${trendLineHtml}
    </svg>`;
  }

  function casesCreatedChart(rows) {
    rows = newestFirst(rows);
    const values = rows.filter(r => r.newCases != null).map(r => Number(r.newCases) || 0);
    const max = Math.max(...values, 1);
    const w = Math.max(1120, rows.length * 56 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 42, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(36, slot * 0.58);
    const dividerIndex = Math.max(0, rows.findIndex(r => Number(r.year) === 2025));
    const dividerX = pad.l + dividerIndex * slot;
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round(max * p);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const missing = r.newCases == null;
      const value = missing ? 0 : Number(r.newCases) || 0;
      const bh = missing ? Math.max(34, plotH * 0.18) : Math.max(6, (plotH * value) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = missing ? "#64748b" : "#3a1a6e";
      const label = missing ? "No data" : String(value);
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"${missing ? ' opacity="0.72"' : ""}/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total" style="fill:${fill}">${escapeHtml(label)}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const firstYearCenter = pad.l + (dividerIndex * slot) / 2;
    const secondYearCenter = dividerX + ((rows.length - dividerIndex) * slot) / 2;
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart kpi-cases-created-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cases created by month — 2025 through July 2026; missing data shown in slate">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${firstYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2026 YTD</text>
      <text x="${secondYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2025</text>
      <line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${h - pad.b + 10}" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="4 6"/>
      ${bars}
    </svg>`;
  }

  function cashCollectedTable(rows) {
    const withCases = rows.filter(r => r.newCases != null);
    const yearCredit = rows.reduce((s, r) => s + r.credit, 0);
    const yearCases = withCases.reduce((s, r) => s + r.newCases, 0);
    const yearLabel = DATA.cashCollectedTotals.yearLabel || "2025";
    return kpiDetailAccordion(
      "Cash table",
      `${rows.length} months · CY ${yearLabel}`,
      ["Month", "Cash collected", "New cases", "Cash / new case"],
      [
        ...rows.map(r => {
          const per = r.newCases ? r.credit / r.newCases : null;
          return [
            escapeHtml(r.month) + " " + yearLabel,
            fmtCashTier(r.credit),
            r.newCases != null ? String(r.newCases) : "—",
            per != null ? fmtMoney(per) : "—"
          ];
        }),
        [
          yearLabel + " total",
          fmtCashTier(yearCredit),
          yearCases ? String(yearCases) : "—",
          yearCases ? fmtMoney(yearCredit / yearCases) : "—"
        ],
        ["2026 to date (Jan–Jul* 15)", fmtCashTier(DATA.cashCollectedTotals.total2026ToDate), "—", "—"]
      ]
    );
  }

  function lsaEfficiencyTable(rows) {
    const newest = newestFirst(rows);
    const tot = newest.reduce((a, r) => ({
      leads: a.leads + r.leads,
      charged: a.charged + r.charged,
      lsaSpend: a.lsaSpend + r.lsaSpend
    }), { leads: 0, charged: 0, lsaSpend: 0 });
    const overall = DATA.lsaChargeRateOverall || {};
    return kpiDetailTable(
      ["Period", "LSA leads", "Charged", "Charge rate", "LSA media", "LSA media / charged lead"],
      [
        ...newest.map(r => [
          escapeHtml(r.month) + " 2026",
          String(r.leads),
          String(r.charged),
          Math.round((r.charged / r.leads) * 100) + "%",
          fmtMoney(r.lsaSpend),
          r.charged ? fmtMoney(r.lsaSpend / r.charged) : "—"
        ]),
        [
          "May–Jul* totals",
          String(tot.leads),
          String(tot.charged),
          Math.round((tot.charged / tot.leads) * 100) + "%",
          fmtMoney(tot.lsaSpend),
          tot.charged ? fmtMoney(tot.lsaSpend / tot.charged) : "—"
        ],
        [
          "Inbox (15) overall",
          String(overall.leads || "—"),
          String(overall.charged || "—"),
          (overall.pct != null ? overall.pct + "%" : "—"),
          "—",
          "—"
        ]
      ]
    );
  }

  function lsaChargeRateCardsHtml() {
    const rows = DATA.lsaEfficiency || [];
    const newest = newestFirst(rows);
    const cur = newest[0];
    if (!cur || !cur.leads) {
      return `<p class="data-inline-note">LSA efficiency rows not loaded.</p>`;
    }
    const prior = newest.find(r => r.month !== cur.month && r.leads) || null;
    const rate = Math.round((cur.charged / cur.leads) * 100);
    const avgCost = cur.charged ? cur.lsaSpend / cur.charged : 0;
    const priorRate = prior && prior.leads
      ? `${Math.round((prior.charged / prior.leads) * 100)}%`
      : "—";
    const period = escapeHtml(cur.month);
    const priorLabel = prior ? escapeHtml(prior.month) + " rate" : "Prior rate";
    return `<div class="kpi-goals-grid">
      <button type="button" class="kpi-goal-card" data-kpi-focus="#13" aria-label="LSA leads ${cur.leads}">
        ${statusCorner(true)}
        ${kpiHelpBtn("#13")}
        <div class="kpi-goal-visual">
          ${kpiCardTitle("LSA leads")}
          <span class="kpi-stat-val">${cur.leads}</span>
          <span class="kpi-stat-label">${period}</span>
        </div>
        ${goalTrackRows([
          ["Charged", String(cur.charged)],
          ["Not charged+", String(Math.max(0, cur.leads - cur.charged))]
        ])}
        ${kpiRefMark("#13")}
      </button>
      <button type="button" class="kpi-goal-card" data-kpi-focus="#13" aria-label="LSA percent charged ${rate}%">
        ${statusCorner(true)}
        ${kpiHelpBtn("#13")}
        <div class="kpi-goal-visual">
          ${kpiCardTitle("LSA % charged")}
          <span class="kpi-stat-val">${rate}%</span>
          <span class="kpi-stat-label">${cur.charged} of ${cur.leads} charged</span>
        </div>
        ${goalTrackRows([
          ["Period", period],
          [priorLabel, priorRate]
        ])}
        ${kpiRefMark("#13")}
      </button>
      <button type="button" class="kpi-goal-card" data-kpi-focus="#13" aria-label="Average charge cost ${fmtMoney(avgCost)}">
        ${statusCorner(true)}
        ${kpiHelpBtn("#13")}
        <div class="kpi-goal-visual">
          ${kpiCardTitle("Avg charge cost")}
          <span class="kpi-stat-val">${fmtMoney(avgCost)}</span>
          <span class="kpi-stat-label">LSA media ÷ charged</span>
        </div>
        ${goalTrackRows([
          ["LSA media", fmtMoney(cur.lsaSpend)],
          ["Charged denom", String(cur.charged)]
        ])}
        ${kpiRefMark("#13")}
      </button>
    </div>`;
  }

  function lsaChargeRateSectionHtml() {
    const rows = DATA.lsaEfficiency || [];
    if (!rows.length) return "";
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-lsa-charge-rate" data-feedback-label="#13 LSA % charged">
      <div class="kpi-section-body">
        ${lsaChargeRateCardsHtml()}
        <article class="kpi-split-panel data-chart-table-panel" data-feedback-id="section-lsa-charge-table" data-feedback-label="#13 LSA charge rate table">
          ${statusCorner(true)}
          ${kpiHelpBtn("#13")}
          <div class="kpi-split-panel-body">
            ${chartBlock({
              focus: "#13",
              title: "LSA charge rate by month",
              subtitle: "Newest month first · media ÷ charged = avg charge cost",
              table: lsaEfficiencyTable(rows)
            })}
            <p class="data-inline-note">Process: ${projectEggLink("LsaCall", "Open LSA Call Process Update")} · Phone: ${projectEggLink("HsVoip", "Open Phone(s) & VoIP Setup")}. Jul* spend still as-of Jul 17 activities.</p>
          </div>
          ${kpiRefMark("#13")}
        </article>
      </div>
    </section>`;
  }

  function trustApplicationsChart(rows) {
    rows = newestFirst(rows);
    const max = Math.max(...rows.map(r => r.applications || 0), 1);
    const w = 720;
    const h = 220;
    const pad = { l: 58, r: 16, t: 28, b: 52 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.max(4, Math.min(22, slot * 0.7));
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round((max * p) / 1000);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${val}k</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const amt = r.applications || 0;
      const bh = amt ? Math.max(3, (plotH * amt) / max) : 0;
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const short = String(r.month || "").replace(" 20", " '").replace("Jul*", "Jul*");
      return `<g>
        ${bh ? `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${isCurrent ? "#1e3a8a" : "#7a6a58"}"/>` : ""}
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-chart-label" transform="rotate(-55 ${x + barW / 2} ${h - 8})" style="font-size:8px">${escapeHtml(short)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Trust applications by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function trustTransfersTable(trust) {
    const rows = trust.monthly || [];
    const y2025 = rows.filter(r => /2025/.test(r.month));
    const y2026 = rows.filter(r => /2026/.test(r.month));
    const sumApps = list => list.reduce((s, r) => s + (r.applications || 0), 0);
    const sumRows = list => list.reduce((s, r) => s + (r.rows || 0), 0);
    const active = rows.filter(r => (r.applications || 0) > 0);
    const snap = trust.snapshot || {};
    return `
      ${kpiDetailTable(
        ["Window", "Trust applications", "Ledger rows"],
        [
          ...active.map(r => [
            escapeHtml(r.month),
            fmtMoney(r.applications),
            String(r.rows)
          ]),
          ["2025 total (ledger)", fmtMoney(sumApps(y2025)), String(sumRows(y2025))],
          ["2026 to date (through Jul 15)", fmtMoney(sumApps(y2026)), String(sumRows(y2026))]
        ]
      )}
      ${kpiDetailTable(
        ["Client trust snapshot", "Value"],
        [
          [`As of ${escapeHtml(snap.asOf || "—")}`, "MyCase Contact export"],
          ["Clients with trust balance", String(snap.clientsWithBalance || "—")],
          ["Trust still on books", fmtMoney(snap.totalBalance || 0)],
          ["Mean trust balance", fmtMoney(snap.meanBalance || 0)]
        ]
      )}
      <p class="data-inline-note"><strong>Range:</strong> ledger ${escapeHtml(trust.rangeStart || "")} → ${escapeHtml(trust.rangeEnd || "")} · ${escapeHtml(trust.method || "Payment Method = Trust")}. Bars = trust applied to invoices (debits), not new cash. Insight: Jun–Jul 2025 carried almost all applications ($${Math.round(sumApps(y2025) / 1000)}k); 2026 YTD is nearly quiet ($${Math.round(sumApps(y2026) / 1000)}k) while ~$${Math.round((snap.totalBalance || 0) / 1000)}k remains on Client trust balances.</p>
    `;
  }

  function cashAndCasesChartRows() {
    return [
      ...(DATA.cashCollected || []).map(row => ({ ...row, year: 2025 })),
      ...(DATA.cashCollected2026Ytd || []).map(row => ({ ...row, year: 2026 }))
    ];
  }

  function financialSectionHtml() {
    const cashRows = DATA.cashCollected || [];
    const chartRows = cashAndCasesChartRows();
    if (!cashRows.length) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified" data-feedback-id="section-financial" data-feedback-label="#09 Financials">
      ${statusCorner(true)}
      ${kpiHelpBtn("financial")}
      ${kpiSectionStaticHead("Financials", "Cash collected MoM · cash / new case")}
      <div class="kpi-section-body">
        <div class="kpi-finance-grid kpi-finance-grid-cash">
          <div class="kpi-mini-card">
            ${chartBlock({
              title: "Cash collected",
              subtitle: "2025–2026 · newest → oldest",
              chart: cashCollectedChart(chartRows),
              table: cashCollectedTable(cashRows)
            })}
          </div>
        </div>
        ${sourceFootnote("financial")}
      </div>
      ${kpiRefMark("#09")}
    </section>`;
  }

  function cashCollectedSectionHtml() {
    /* Folded into financialSectionHtml */
    return financialSectionHtml();
  }

  function stackedSeriesDetailTable(series, opts) {
    const firstCol = (opts && opts.firstCol) || "Lead type";
    const totalMom = opts && opts.totalMom;
    const mayTotal = series.reduce((s, c) => s + c.prior, 0);
    const junTotal = series.reduce((s, c) => s + c.count, 0);
    const momLabel = totalMom != null
      ? totalMom
      : (mayTotal ? ((junTotal - mayTotal) / mayTotal >= 0 ? "+" : "") + Math.round(((junTotal - mayTotal) / mayTotal) * 100) + "%" : "—");
    const rows = series.map(c => [
      `<span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span> ${escapeHtml(c.name)}`,
      String(c.prior),
      String(c.count),
      String(c.count - c.prior >= 0 ? "+" + (c.count - c.prior) : c.count - c.prior),
      momChangeHtml(c.mom) || "—",
      escapeHtml(c.spend)
    ]);
    rows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${mayTotal}</span>`,
      `<span class="kpi-table-total">${junTotal}</span>`,
      `<span class="kpi-table-total">${junTotal - mayTotal >= 0 ? "+" : ""}${junTotal - mayTotal}</span>`,
      momChangeHtml(momLabel) || "—",
      "—"
    ]);
    return kpiDetailTable(
      [firstCol, "May", "Jun", "Δ", "Change", "Spend"],
      rows
    );
  }

  function channelsDetailTable(channels) {
    const months = DATA.channelMonths ? newestFirst(DATA.channelMonths) : null;
    if (months && months.length >= 3) {
      const keys = [
        { key: "search", name: "Search calls", color: "#3a1a6e", spendKey: "searchSpend" },
        { key: "lsa", name: "LSA inbox", color: "#1e3a8a", spendKey: "lsaSpend" },
        { key: "hubspot", name: "HubSpot / other", color: "#b23a78", spendKey: null }
      ];
      const monthLabels = months.map(m => m.month);
      const pctVsJun = (curr, jun) => {
        if (!jun) return "—";
        const pct = Math.round(((curr - jun) / jun) * 100);
        return (pct >= 0 ? "+" : "") + pct + "%";
      };
      const rows = keys.map(k => {
        const vals = months.map(m => Number(m[k.key]) || 0);
        const jun = months.find(m => m.month === "Jun");
        const junSpend = k.spendKey && jun ? jun[k.spendKey] : null;
        const deltaPct = pctVsJun(vals[0], vals[1]);
        return [
          `<span class="kpi-stack-swatch" style="background:${k.color}" aria-hidden="true"></span> ${escapeHtml(k.name)}`,
          ...vals.map(String),
          momChangeHtml(deltaPct) || "—",
          junSpend != null ? fmtMoney(junSpend) : "—"
        ];
      });
      const totals = months.map(m => (m.search || 0) + (m.lsa || 0) + (m.hubspot || 0));
      const totalDeltaPct = pctVsJun(totals[0], totals[1]);
      rows.push([
        '<span class="kpi-table-total">Total</span>',
        ...totals.map(t => `<span class="kpi-table-total">${t}</span>`),
        `<span class="kpi-table-total">${momChangeHtml(totalDeltaPct) || "—"}</span>`,
        "—"
      ]);
      return kpiDetailTable(
        ["Lead type", ...monthLabels, "% vs Jun", "Jun spend"],
        rows
      );
    }
    return stackedSeriesDetailTable(channels, { firstCol: "Lead type" });
  }

  function campaignLeadsDetailTable(campaigns) {
    return stackedSeriesDetailTable(campaigns, { firstCol: "Campaign" });
  }

  function sourceMixDetailTable(segments) {
    const rate = DATA.phoneIntake.leadToCaseRate;
    const fee = DATA.phoneIntake.avgCaseFee;
    const estRev = count => Math.round(Number(count || 0) * rate * fee);
    const leadRows = segments.map(s => [
      `<span class="kpi-stack-swatch" style="background:${s.color}" aria-hidden="true"></span> ${escapeHtml(s.name)}`,
      String(s.count != null ? s.count : "—"),
      `${s.pct}%`,
      s.count != null ? fmtMoney(estRev(s.count)) : "—"
    ]);
    const leadTotal = segments.reduce((n, s) => n + (Number(s.count) || 0), 0);
    const revTotal = estRev(leadTotal);
    leadRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${leadTotal}</span>`,
      '<span class="kpi-table-total">100%</span>',
      `<span class="kpi-table-total">${fmtMoney(revTotal)}</span>`
    ]);
    const momRows = segments.map(s => {
      const prior = Number(s.prior) || 0;
      const curr = Number(s.count) || 0;
      const delta = curr - prior;
      const deltaLabel = delta === 0 ? "0" : (delta > 0 ? `+${delta}` : String(delta));
      return [
        `<span class="kpi-stack-swatch" style="background:${s.color}" aria-hidden="true"></span> ${escapeHtml(s.name)}`,
        String(prior || "—"),
        String(curr || "—"),
        deltaLabel,
        s.mom ? momChangeHtml(s.mom) : "—"
      ];
    });
    const priorTotal = segments.reduce((n, s) => n + (Number(s.prior) || 0), 0);
    const momTotalPct = priorTotal
      ? `${leadTotal - priorTotal >= 0 ? "+" : ""}${Math.round(((leadTotal - priorTotal) / priorTotal) * 100)}%`
      : "—";
    momRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${priorTotal}</span>`,
      `<span class="kpi-table-total">${leadTotal}</span>`,
      `<span class="kpi-table-total">${leadTotal - priorTotal >= 0 ? "+" : ""}${leadTotal - priorTotal}</span>`,
      momChangeHtml(momTotalPct) || "—"
    ]);
    return (
      kpiDetailTable(["Source", "Leads", "Share", "Est. potential revenue"], leadRows) +
      `<h4 class="kpi-subtable-title">Month comparison</h4>` +
      kpiDetailTable(["Source", "Prior", "Current", "Δ leads", "Change"], momRows)
    );
  }

  function campaignDetailTable(items) {
    const total = items.reduce((s, i) => s + i.count, 0);
    const rows = items.map(i => [
      `<span class="kpi-stack-swatch" style="background:${i.color}" aria-hidden="true"></span> ${escapeHtml(i.name)}`,
      String(i.count),
      total ? `${Math.round((i.count / total) * 100)}%` : "—"
    ]);
    rows.push(['<span class="kpi-table-total">Total</span>', `<span class="kpi-table-total">${total}</span>`, '<span class="kpi-table-total">100%</span>']);
    return kpiDetailTable(["Campaign", "Calls", "Share"], rows);
  }

  function donutChart(segments) {
    const r = 42;
    const cx = 56;
    const cy = 56;
    let angle = -Math.PI / 2;
    const arcs = segments.map(seg => {
      const slice = (seg.pct / 100) * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += slice;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const large = slice > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      return `<path d="${d}" fill="${seg.color}"/>`;
    }).join("");
    const legend = segments.map((seg, i) =>
      `<span class="kpi-donut-legend-item"><span class="kpi-donut-swatch" style="background:${seg.color}"></span>${seg.name} ${seg.pct}%</span>`
    ).join("");
    return `<div class="kpi-donut-wrap">
      <svg class="kpi-donut-svg" viewBox="0 0 112 112" width="112" height="112" role="img" aria-label="Mix donut">${arcs}<circle cx="${cx}" cy="${cy}" r="24" fill="var(--gg-paper)"/></svg>
      <div class="kpi-donut-legend">${legend}</div>
    </div>`;
  }

  function horizontalBarChart(items) {
    const max = Math.max(...items.map(i => i.count), 1);
    const rows = items.map((item, i) => {
      const y = 8 + i * 28;
      const bw = Math.max(8, (item.count / max) * 180);
      return `<g>
        <text x="0" y="${y + 14}" class="kpi-chart-axis">${item.name}</text>
        <rect x="72" y="${y}" width="${bw}" height="18" rx="4" fill="${item.color}"/>
        <text x="${72 + bw + 6}" y="${y + 14}" class="kpi-chart-val-sm">${item.count}</text>
      </g>`;
    }).join("");
    const h = items.length * 28 + 8;
    return `<svg class="kpi-chart-svg" viewBox="0 0 240 ${h}" role="img" aria-label="Search calls by campaign">${rows}</svg>`;
  }

  function missedRevenueModel(pi) {
    const p = pi || DATA.phoneIntake;
    const missed = Number(p.missedSearchCalls != null ? p.missedSearchCalls : p.missedLsaCalls);
    const priorMissed = Number(p.priorMissedSearchCalls != null ? p.priorMissedSearchCalls : p.priorMissedLsaCalls);
    const close = Number(p.closeRateEst != null ? p.closeRateEst : p.leadToCaseRate);
    const fee = Number(p.avgCaseFee);
    const monthlyLost = Math.round(missed * close * fee);
    const priorMonthlyLost = Math.round(priorMissed * close * fee);
    const closePct = (close * 100).toFixed(close * 100 < 10 ? 1 : 0);
    const cumulativeYtd = p.cumulativeYtd != null
      ? Number(p.cumulativeYtd)
      : monthlyLost + priorMonthlyLost;
    return {
      missedSearchCalls: missed,
      missedLsaCalls: missed,
      priorMissedSearchCalls: priorMissed,
      priorMissedLsaCalls: priorMissed,
      closeRateEst: close,
      avgCaseFee: fee,
      monthlyLost,
      priorMonthlyLost,
      cumulativeYtd,
      formulaText: `Missed Search calls × ${closePct}% lead→case × avg case value`,
      formulaWorked: `${missed} × ${closePct}% × ${fmtMoney(fee)} = ${fmtMoney(monthlyLost)}/mo`
    };
  }

  function missedRevenuePanel(pi) {
    const model = missedRevenueModel(pi);
    const momLabel = pi.missedMomPp < 0
      ? `↓ ${Math.abs(pi.missedMomPp)} pp fewer missed`
      : pi.missedMomPp > 0
        ? `↑ +${pi.missedMomPp} pp more missed`
        : "No change";
    const momClassName = pi.missedMomPp <= 0 ? "kpi-mom-up" : "kpi-mom-down";
    const maxLost = Math.max(model.monthlyLost, model.priorMonthlyLost, model.cumulativeYtd / 6, 1);
    const priorW = Math.max(12, (model.priorMonthlyLost / maxLost) * 160);
    const currW = Math.max(12, (model.monthlyLost / maxLost) * 160);
    const cumW = Math.max(12, (model.cumulativeYtd / (maxLost * 6)) * 160);
    return `<div class="kpi-missed-panel">
      <div class="kpi-missed-stats">
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Missed calls</span>
          <span class="kpi-missed-val">${pi.missedPct}%</span>
          <span class="kpi-missed-sub">goal ≤ ${pi.missedTargetPct}% · was ${pi.priorMissedPct}% prior month · <span class="${momClassName}">${momLabel}</span></span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Est. revenue lost (Jun)</span>
          <span class="kpi-missed-val">${fmtMoney(model.monthlyLost)}</span>
          <span class="kpi-missed-sub">was ${fmtMoney(model.priorMonthlyLost)} prior month</span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Cumulative YTD lost</span>
          <span class="kpi-missed-val">${fmtMoney(model.cumulativeYtd)}</span>
          <span class="kpi-missed-sub">${escapeHtml(model.formulaText)}</span>
        </div>
      </div>
      <svg class="kpi-chart-svg" viewBox="0 0 260 100" role="img" aria-label="Missed revenue comparison">
        <text x="0" y="14" class="kpi-chart-axis">Prior mo lost</text>
        <rect x="88" y="4" width="${priorW}" height="16" rx="4" fill="#3a1a6e" opacity="0.45"/>
        <text x="${88 + priorW + 6}" y="16" class="kpi-chart-val-sm">${fmtMoney(model.priorMonthlyLost)}</text>
        <text x="0" y="44" class="kpi-chart-axis">Jun lost</text>
        <rect x="88" y="34" width="${currW}" height="16" rx="4" fill="#3a1a6e"/>
        <text x="${88 + currW + 6}" y="46" class="kpi-chart-val-sm">${fmtMoney(model.monthlyLost)}</text>
        <text x="0" y="74" class="kpi-chart-axis">YTD cumulative</text>
        <rect x="88" y="64" width="${cumW}" height="16" rx="4" fill="#c45c26"/>
        <text x="${88 + cumW + 6}" y="76" class="kpi-chart-val-sm">${fmtMoney(model.cumulativeYtd)}</text>
      </svg>
      ${kpiDetailTable(
        ["Measure", "Value", "Notes"],
        [
          ["Missed Search calls", String(model.missedSearchCalls), `rate ${pi.missedPct}% · goal ≤ ${pi.missedTargetPct}%`],
          ["Lead→case", `${(model.closeRateEst * 100).toFixed(1)}%`, "ADS-LSA lock"],
          ["Avg case value", fmtMoney(model.avgCaseFee), "KPI #28"],
          ["Est. lost (Jun)", fmtMoney(model.monthlyLost), escapeHtml(model.formulaWorked)],
          ["YTD cumulative", fmtMoney(model.cumulativeYtd), "64 missed May–Jul 10"]
        ]
      )}
    </div>`;
  }

  function momClass(mom) {
    if (!mom) return "";
    const s = String(mom).trim();
    if (/^[+↑]/.test(s)) return "kpi-mom-up";
    if (/^[-−↓]/.test(s) || s.startsWith("-")) return "kpi-mom-down";
    return "";
  }

  /** Small change label: black regular-weight arrow + percent — no “MoM” label. */
  function momChangeHtml(mom) {
    if (mom == null || mom === "") return "";
    const raw = String(mom).trim();
    if (!raw || raw === "—" || raw === "-") return "";
    const cls = momClass(raw);
    const val = raw.replace(/^[↑↓]\s*/, "");
    const num = parseFloat(val.replace(/[^0-9.\-−]/g, "").replace("−", "-"));
    let arrow = "";
    if (cls === "kpi-mom-up" || (Number.isFinite(num) && num > 0)) arrow = "↑";
    else if (cls === "kpi-mom-down" || (Number.isFinite(num) && num < 0)) arrow = "↓";
    const tone = arrow === "↑" ? "kpi-mom-up" : arrow === "↓" ? "kpi-mom-down" : "kpi-mom-flat";
    return `<span class="kpi-mom-change ${tone}"><span class="kpi-mom-arrow" aria-hidden="true">${arrow}</span><span class="kpi-mom-pct">${escapeHtml(val)}</span></span>`;
  }

  function metricWithDeltaHtml(mainHtml, mom) {
    const delta = momChangeHtml(mom);
    if (!delta) return mainHtml;
    return `<div class="kpi-metric-with-delta">${mainHtml}${delta}</div>`;
  }

  function presenceLabel(status) {
    const map = {
      active: "Listed",
      building: "Listed",
      outdated: "Outdated",
      "not wired": "Unlisted",
      "not on": "Unlisted"
    };
    return map[status] || status || "—";
  }

  /** Collapse tracking-only "not wired" into Unlisted for the presence pie. */
  function presenceBucket(status) {
    const s = status || "not on";
    if (s === "active" || s === "building") return "active";
    if (s === "outdated") return "outdated";
    return "not on";
  }

  const PRESENCE_PIE_COLORS = {
    active: "#1f8a65",
    outdated: "#4c1d95",
    "not on": "#3a1a6e"
  };

  function presencePieSegments(rows) {
    const counts = {};
    (rows || []).forEach(r => {
      const k = presenceBucket(r.status);
      counts[k] = (counts[k] || 0) + 1;
    });
    const keys = ["active", "not on", "outdated"].filter(k => counts[k]);
    const total = keys.reduce((s, k) => s + counts[k], 0) || 1;
    let allocated = 0;
    return keys.map((status, i) => {
      let pct = Math.round((counts[status] / total) * 100);
      if (i === keys.length - 1) pct = Math.max(0, 100 - allocated);
      allocated += pct;
      return {
        name: presenceLabel(status),
        pct,
        color: PRESENCE_PIE_COLORS[status] || "#3a1a6e",
        count: counts[status]
      };
    });
  }

  function dash(v) {
    return v == null || v === "" ? "—" : v;
  }

  function halfMoonPoint(cx, cy, r, progress) {
    const angle = Math.PI * (1 - progress);
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  }

  function halfMoonPath(cx, cy, r, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const steps = Math.max(2, Math.ceil(40 * clamped));
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const p = halfMoonPoint(cx, cy, r, (clamped * i) / steps);
      d += (i === 0 ? "M" : " L") + ` ${p.x} ${p.y}`;
    }
    return d;
  }

  function halfMoonFillPath(cx, cy, r, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    if (clamped <= 0) return "";
    if (clamped >= 1) {
      return `${halfMoonPath(cx, cy, r, 1)} L ${right.x} ${cy} L ${left.x} ${cy} Z`;
    }
    const end = halfMoonPoint(cx, cy, r, clamped);
    return `${halfMoonPath(cx, cy, r, clamped)} L ${end.x} ${cy} L ${left.x} ${cy} Z`;
  }

  const SUCCESS_GAUGE = { pale: "#b7e4d2", mid: "#4fb58f", dark: "#1f8a65" };
  const PROGRESS_GAUGE = { red: "#cf2d56", mid: "#eab308", green: "#1f8a65" };

  function halfMoonGauge(pct, gradId, options) {
    const opts = options || {};
    const clamped = Math.max(0, Math.min(1, pct));
    const celebrate = !!(opts.celebrate || clamped >= 1);
    const cx = 94;
    const cy = 88;
    const r = 58;
    const strokeW = 12;
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    const rimGradId = `${gradId}-rim`;
    const successStops = `<stop offset="0%" stop-color="${SUCCESS_GAUGE.pale}"/><stop offset="40%" stop-color="${SUCCESS_GAUGE.mid}"/><stop offset="100%" stop-color="${SUCCESS_GAUGE.dark}"/>`;
    const progressStops = `<stop offset="0%" stop-color="${PROGRESS_GAUGE.red}"/><stop offset="45%" stop-color="${PROGRESS_GAUGE.mid}"/><stop offset="100%" stop-color="${PROGRESS_GAUGE.green}"/>`;
    const fillAmt = celebrate && opts.goalMark == null ? 1 : clamped;
    const arcLen = Math.PI * r;
    const dashLen = Math.max(0, Math.min(arcLen, fillAmt * arcLen));
    const endLabel = opts.endLabel != null ? opts.endLabel : "";
    const valueLabel = opts.valueLabel != null ? String(opts.valueLabel) : "";
    const aria = celebrate ? "Target reached" : "Progress rim gauge";
    const track = "var(--gg-cream-panel)";
    const arcD = `M ${left.x} ${left.y} A ${r} ${r} 0 0 1 ${right.x} ${right.y}`;
    let goalSvg = "";
    if (opts.goalMark != null && Number.isFinite(Number(opts.goalMark))) {
      const g = Math.max(0, Math.min(1, Number(opts.goalMark)));
      const inner = halfMoonPoint(cx, cy, r - strokeW / 2 - 2, g);
      const outer = halfMoonPoint(cx, cy, r + strokeW / 2 + 6, g);
      goalSvg = `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" class="kpi-gauge-goal-mark"/>`;
      /* Label the goal tick when it is not sitting on the end scale mark. */
      const goalLabel = opts.goalLabel != null ? String(opts.goalLabel).trim() : "";
      const atEnd = g >= 0.97 || g <= 0.03;
      const sameAsEnd = goalLabel !== "" && endLabel !== "" && goalLabel === String(endLabel);
      if (goalLabel && !atEnd && !sameAsEnd) {
        const labelPt = halfMoonPoint(cx, cy, r + strokeW / 2 + 18, g);
        const anchor = g < 0.4 ? "end" : g > 0.6 ? "start" : "middle";
        goalSvg += `<text x="${labelPt.x.toFixed(1)}" y="${labelPt.y.toFixed(1)}" class="kpi-gauge-goal-label" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(goalLabel)}</text>`;
      }
    }

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 136" role="img" aria-label="${aria}">
      <defs><linearGradient id="${rimGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${celebrate ? successStops : progressStops}</linearGradient></defs>
      <path d="${arcD}" fill="none" stroke="${track}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <path d="${arcD}" fill="none" stroke="url(#${rimGradId})" stroke-width="${strokeW}" stroke-linecap="round"
        stroke-dasharray="${dashLen.toFixed(2)} ${(arcLen + 1).toFixed(2)}"/>
      ${goalSvg}
      <text x="28" y="126" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="160" y="126" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
      ${valueLabel !== "" ? `<text x="${cx}" y="${cy - 4}" class="kpi-gauge-center" text-anchor="middle">${escapeHtml(valueLabel)}</text>` : ""}
    </svg>`;
  }

  function autoCaseColumns(g) {
    const trafficYtd = (DATA.verticals || []).find(v => /^Traffic$/i.test(v.name));
    if (g.autoColumns && g.autoColumns.length) return g.autoColumns;
    return [
      { label: g.label || "DUI", current: Number(g.current) || 0 },
      ...(trafficYtd ? [{ label: "Traffic", current: Number(trafficYtd.ytd) || 0 }] : [])
    ];
  }

  function autoCaseTotal(g) {
    return autoCaseColumns(g).reduce((sum, col) => sum + (Number(col.current) || 0), 0);
  }

  /** Fixed stack colors — DUI royal-blue, Traffic burnt (different families). */
  const AUTO_CASE_STACK_COLORS = {
    DUI: "#1e3a8a",
    Traffic: "#c45c26"
  };

  function duiGoalTargetBarChart() {
    const g = DATA.duiGoal;
    const columns = autoCaseColumns(g);
    const total = autoCaseTotal(g);
    const target = Number(g.target) || 50;
    const maxVal = Math.max(total, target, 1) * 1.12;
    /* Fill the goal-card visual — less pad, taller plot, wider bar. */
    const w = 320;
    const h = 210;
    const pad = { l: 36, r: 10, t: 18, b: 28 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const barW = Math.min(88, plotW * 0.48);
    const x = pad.l + (plotW - barW) / 2;
    const baselineY = pad.t + plotH;
    const targetY = baselineY - (plotH * target) / maxVal;
    // Keep fills, but remove rect strokes so the stacked bar doesn't look outlined.
    // (User request: "dont outline bar chart".)

    let y = baselineY;
    const segments = columns.map(col => {
      const count = Number(col.current) || 0;
      const hh = Math.max(count ? 8 : 0, (plotH * count) / maxVal);
      y -= hh;
      if (!count) return "";
      const fill = AUTO_CASE_STACK_COLORS[col.label] || "#3a1a6e";
      const showLabel = hh >= 18 || col.label === "Traffic";
      const labelYOffset = col.label === "Traffic" ? 4 : 5;
      const countLabel = showLabel
        ? `<text x="${x + barW / 2}" y="${y + hh / 2 + labelYOffset}" text-anchor="middle" class="kpi-target-bar-val" fill="#ffffff">${count}</text>`
        : "";
      return `<g class="kpi-target-bar-stack-seg">
        <rect x="${x}" y="${y}" width="${barW}" height="${hh}" fill="${fill}">
          <title>${escapeHtml(col.label)}: ${count}</title>
        </rect>
        ${countLabel}
      </g>`;
    }).join("");

    const legend = columns.map((col, i) => {
      const fill = AUTO_CASE_STACK_COLORS[col.label] || "#3a1a6e";
      const lx = pad.l + i * (plotW / Math.max(columns.length, 1));
      return `<g>
        <rect x="${lx}" y="${h - 14}" width="9" height="9" rx="1" fill="${fill}"/>
        <text x="${lx + 13}" y="${h - 6}" class="kpi-target-bar-cat">${escapeHtml(col.label)}</text>
      </g>`;
    }).join("");

    return `<svg class="kpi-chart-svg kpi-target-bar-chart kpi-target-bar-chart-compact kpi-target-bar-chart-stacked kpi-target-bar-chart-goal" viewBox="0 0 ${w} ${h}" role="img" aria-label="Auto cases stacked ${total} vs goal ${target}">
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" class="kpi-target-baseline"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" class="kpi-target-line"/>
      <text x="${pad.l - 4}" y="${targetY + 4}" text-anchor="end" class="kpi-target-label">${target}</text>
      ${segments}
      <text x="${x + barW / 2}" y="${Math.min(y, targetY) - 6}" text-anchor="middle" class="kpi-target-bar-cat">${total}</text>
      ${legend}
    </svg>`;
  }

  /** Compare YTD auto total against the straight-line target for elapsed time. */
  function duiScheduleStatus(g, totalSigned) {
    const year = Number(g.year) || new Date().getFullYear();
    const now = new Date();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    let frac = (now - start) / (end - start);
    frac = Math.max(0, Math.min(1, frac));
    const signed = totalSigned != null ? Number(totalSigned) : Number(g.current) || 0;
    const expected = (Number(g.target) || 0) * frac;
    const delta = signed - expected;
    const expectedRounded = Math.round(expected);
    const gap = Math.round(Math.abs(delta));
    if (delta >= 0) {
      return {
        cls: "kpi-mom-up",
        arrow: "↑",
        label: `Ahead ${gap}`,
        detail: `${Math.round(frac * 100)}% of year elapsed — on straight-line pace you'd have ~${expectedRounded} auto cases by now.`
      };
    }
    return {
      cls: "kpi-mom-down",
      arrow: "↓",
      label: `Behind ${gap}`,
      detail: `${Math.round(frac * 100)}% of year elapsed — straight-line pace is ~${expectedRounded} auto cases by now.`
    };
  }

  /**
   * Monthly cases needed Aug–Dec to hit the annual auto goal from current YTD.
   * Front-loads the remainder so early months carry the extra case.
   */
  function monthlyNeedToAnnualGoal(signed, target, fromMonthIndex) {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const start = Math.max(0, Math.min(11, fromMonthIndex | 0));
    const monthsLeft = 12 - start;
    const remaining = Math.max(0, (Number(target) || 0) - (Number(signed) || 0));
    if (!monthsLeft) return [];
    const base = Math.floor(remaining / monthsLeft);
    const extra = remaining % monthsLeft;
    let running = Number(signed) || 0;
    return monthLabels.slice(start).map((label, i) => {
      const need = base + (i < extra ? 1 : 0);
      running += need;
      return {
        label,
        need,
        ytdAfter: running,
        title: `Need ${need} auto case${need === 1 ? "" : "s"} in ${label} · YTD would be ${running} of ${target}`
      };
    });
  }

  function teamDuiGoalCardHtml() {
    const g = DATA.duiGoal;
    const total = autoCaseTotal(g);
    const target = Number(g.target) || 50;
    const pct = total / (target || 1);
    const hit = pct >= 1;
    const pace = Math.round((total / (target || 1)) * 100);
    const sched = duiScheduleStatus(g, total);
    const paceCell = `${pace}% <span class="kpi-mom-change ${sched.cls}" title="${escapeHtml(sched.detail)}">${sched.arrow} ${escapeHtml(sched.label)}</span>`;
    /* Need-to-goal: only the current calendar month (Aug–Dec plan; before Aug, show Aug). */
    const now = new Date();
    const goalYear = Number(g.year) || now.getFullYear();
    let fromMonth = now.getFullYear() === goalYear ? now.getMonth() : 7;
    if (fromMonth < 7) fromMonth = 7;
    const monthNeeds = monthlyNeedToAnnualGoal(total, target, fromMonth).slice(0, 1);
    const monthRows = monthNeeds.map(m => [
      m.label,
      `<span class="kpi-goal-month-need" title="${escapeHtml(m.title)}">${m.need}<span class="kpi-goal-month-ytd"> → ${m.ytdAfter}/${target}</span></span>`
    ]);
    return `<button type="button" class="kpi-goal-card kpi-stat-target-bar" data-kpi-focus="#03">
      ${statusCorner(true)}
      ${kpiHelpBtn("#03")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle((g.title || "Auto Cases").replace(/^#\s*/, ""))}
        ${duiGoalTargetBarChart()}
      </div>
      ${goalTrackRows([
        ["Pace", paceCell],
        ...monthRows
      ])}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiRefMark("#03")}
    </button>`;
  }

  function goalTrackRows(rows) {
    if (!rows || !rows.length) return "";
    return `<table class="kpi-goal-track"><tbody>${rows.map(([k, v]) =>
      `<tr><th scope="row">${k}</th><td>${v}</td></tr>`
    ).join("")}</tbody></table>`;
  }

  function placeholderGoalCardHtml() {
    return `<button type="button" class="kpi-goal-card kpi-goal-placeholder" data-kpi-focus="#GOAL3" disabled aria-disabled="true">
      ${statusCorner(false)}
      <div class="kpi-goal-visual">
        <span class="kpi-stat-id">#—</span>
        ${halfMoonGauge(0, "goal-placeholder", { endLabel: "—", valueLabel: "—" })}
      </div>
      ${goalTrackRows([
        ["Change", "—"]
      ])}
    </button>`;
  }

  function kpiSectionSummary(title, hint) {
    const hintHtml = hint ? `<span class="kpi-section-hint">${hint}</span>` : "";
    return `<summary class="kpi-section-summary">
      <span class="kpi-section-heading"><span class="kpi-section-title">${title}</span>${hintHtml}</span>
      <span class="kpi-section-chevron" aria-hidden="true">▾</span>
    </summary>`;
  }

  function kpiSectionStaticHead(title, hint) {
    const hintHtml = hint ? `<span class="kpi-section-hint">${hint}</span>` : "";
    return `<div class="kpi-section-summary kpi-section-summary-static">
      <span class="kpi-section-heading"><span class="kpi-section-title">${title}</span>${hintHtml}</span>
    </div>`;
  }

  function kpiSectionIntro(text) {
    if (!text) return "";
    return `<p class="kpi-section-intro">${text}</p>`;
  }

  function reportKey() {
    return "";
  }

  function reportHeader() {
    return `<header class="kpi-report-head">
      <div>
        <h2 class="kpi-report-title">Pav Law KPI Report</h2>
        <p class="kpi-report-sub">Primary month ${escapeHtml(DATA.period)} · Tiles revised ${escapeHtml(DATA.lastUpdated)} · Data as of ${escapeHtml(DATA.asOf)}</p>
      </div>
    </header>
    ${reportKey()}`;
  }

  /** Lower-right stamp — light gray · small. Uses DATA.lastUpdated || DATA.asOf. */
  function syncDataAsOfStamp() {
    const stamp = DATA.lastUpdated || DATA.asOf || "";
    let el = document.getElementById("guide-data-as-of");
    if (!el) {
      el = document.createElement("p");
      el.id = "guide-data-as-of";
      el.className = "guide-data-as-of";
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = stamp ? `Last updated ${stamp}` : "";
  }

  function parseGaugeNums(value, target) {
    const v = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    const tMatch = String(target || "").match(/([0-9]+(?:\.[0-9]+)?)/);
    const t = tMatch ? parseFloat(tMatch[1]) : NaN;
    if (!Number.isFinite(v) || !Number.isFinite(t) || t <= 0) return null;
    return { current: v, target: t, pct: v / t };
  }

  /** Percent gauges: dial 0–100, goal tick at target %, fill = current/100. */
  function percentScaleGauge(k, nums) {
    const looksPct = /%/.test(String(k.value)) || /%/.test(String(k.target));
    return !!(looksPct && nums && nums.target > 0 && nums.target <= 100);
  }

  function halfMoonOptsForKpi(k, nums, hit) {
    const current = nums.current;
    const target = nums.target;
    const scaleMax = Math.max(current, target, 1);
    const isPct = /%/.test(String(k.value)) || /%/.test(String(k.target));
    const isMoney = /\$/.test(String(k.value)) || /\$/.test(String(k.target));
    const valueLabel = isPct
      ? `${Math.round(current)}%`
      : isMoney
        ? `$${Math.round(current).toLocaleString("en-US")}`
        : String(Math.round(current));
    /* #12: right tick = average LSA call cost (the ceiling to stay under), not max(actual, target). */
    const endIsLsaAvg = k.id === "#12" && k.lowerIsBetter && Number.isFinite(target);
    const endVal = endIsLsaAvg ? target : scaleMax;
    const endLabel = isPct
      ? `${Math.round(endVal)}%`
      : isMoney
        ? `$${Math.round(endVal).toLocaleString("en-US")}`
        : String(Math.round(endVal));
    const goalLabel = isPct
      ? `${Math.round(target)}%`
      : isMoney
        ? `$${Math.round(target).toLocaleString("en-US")}`
        : String(Math.round(target));
    return {
      pct: current / scaleMax,
      endLabel,
      goalMark: target / scaleMax,
      goalLabel,
      celebrate: hit,
      valueLabel
    };
  }

  /* GGL brand: on-target = --gg-positive · over-target = --gg-negative */
  const TARGET_BAR_COLORS = { hit: "#1f8a65", miss: "#cf2d56" };

  function parseMetricNum(val) {
    if (typeof val === "number" && Number.isFinite(val)) return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
  }

  function parseTargetNum(targetStr) {
    const m = String(targetStr || "").match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? parseFloat(m[1]) : NaN;
  }

  /** lowerIsBetter: cost metrics — GGL positive when actual ≤ target, negative when above. */
  function meetsTarget(actual, target, lowerIsBetter) {
    if (!Number.isFinite(target)) return true;
    return lowerIsBetter ? actual <= target : actual >= target;
  }

  function fmtBarMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function fmtBarCount(n) {
    return String(Math.round(n));
  }

  function fmtBarPercent(n) {
    return `${Math.round(n)}%`;
  }

  /**
   * Vertical bars with per-category horizontal target markers (screenshot style).
   * items: [{ label, value, vsTarget?, color? }] — value numeric or "$72" string.
   * vsTarget defaults true (hit/miss vs shared target). Set false + color for context columns.
   */
  function barWithTargetChart(items, options) {
    const opts = options || {};
    const lowerIsBetter = opts.lowerIsBetter !== false;
    const target = opts.target != null ? opts.target : parseTargetNum(opts.targetStr);
    const compact = opts.compact !== false;
    const fmt = typeof opts.formatValue === "function"
      ? opts.formatValue
      : (opts.format === "count" ? fmtBarCount : opts.format === "percent" ? fmtBarPercent : fmtBarMoney);
    const bars = (items || []).map(it => ({
      label: it.label || it.name || it.channel || "",
      actual: parseMetricNum(it.value != null ? it.value : it.cost),
      vsTarget: it.vsTarget !== false,
      color: it.color || null
    })).filter(b => b.label);
    if (!bars.length || !Number.isFinite(target)) return "";

    const maxVal = Math.max(...bars.map(b => b.actual), target, 1) * 1.15;
    const w = opts.width || (compact ? Math.max(268, 72 * bars.length + 70) : 420);
    const h = opts.height || (compact ? 118 : 200);
    /* Left pad must fit full money labels ($120). Too-tight pad clipped to “20”. */
    const pad = compact
      ? { l: 46, r: 14, t: 14, b: opts.fullCategoryLabels || bars.length === 1 ? 38 : 30 }
      : { l: 52, r: 20, t: 20, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / bars.length;
    const barW = Math.min(compact ? 36 : 56, slot * 0.52);
    const baselineY = pad.t + plotH;
    const targetY = baselineY - (plotH * target) / maxVal;
    const targetLabel = fmt(target);

    const barEls = bars.map((b, i) => {
      const bh = Math.max(5, (plotH * b.actual) / maxVal);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = baselineY - bh;
      const hit = meetsTarget(b.actual, target, lowerIsBetter);
      const fill = b.color
        ? b.color
        : (b.vsTarget ? (hit ? TARGET_BAR_COLORS.hit : TARGET_BAR_COLORS.miss) : "#1e3a8a");
      const textFill = "#ffffff";
      const valLabel = fmt(b.actual);
      const shortLabel = opts.fullCategoryLabels || bars.length === 1
        ? b.label
        : (b.label.length > 14 ? b.label.replace(/\s.*/, "") : b.label);
      return `<g class="kpi-target-bar-group">
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${baselineY - 5}" text-anchor="middle" class="kpi-target-bar-val" fill="${textFill}">${escapeHtml(valLabel)}</text>
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-target-bar-cat">${escapeHtml(shortLabel)}</text>
      </g>`;
    }).join("");

    return `<svg class="kpi-chart-svg kpi-target-bar-chart${compact ? " kpi-target-bar-chart-compact" : ""}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(opts.ariaLabel || "Actual vs target bar chart")}">
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" class="kpi-target-baseline"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" class="kpi-target-line"/>
      <text x="${pad.l - 4}" y="${targetY + 4}" text-anchor="end" class="kpi-target-label">${escapeHtml(targetLabel)}</text>
      ${barEls}
    </svg>`;
  }

  function costPerCallBarItems() {
    const d = DATA.directContactCost;
    if (d && d.totalContacts) {
      const items = [{ label: "Blend", value: d.cost }];
      if (d.digitalCalls) items.push({ label: "Calls", value: Math.round(d.digitalSpend / d.digitalCalls) });
      if (d.forms) items.push({ label: "Forms", value: Math.round(d.formFee / d.forms) });
      if (d.yelp && d.yelpSpend) items.push({ label: "Yelp", value: Math.round(d.yelpSpend / d.yelp) });
      return items;
    }
    const overall = DATA.costPerCall.find(c => /direct contact|all campaigns/i.test(String(c.channel)));
    if (overall) return [{ label: "Avg", value: overall.cost }];
    const k12 = DATA.kpis.find(k => k.id === "#12");
    return k12 ? [{ label: "Avg", value: k12.value }] : [];
  }

  function cplByCampaignItems() {
    return DATA.leadsByCampaign.map(c => {
      const spend = parseMetricNum(c.spend);
      const count = Math.max(c.count, 1);
      return { label: c.name, value: Math.round(spend / count) };
    });
  }

  function targetBarChartForKpi(k) {
    const target = parseTargetNum(k.target);
    const items = k.id === "#12" ? costPerCallBarItems() : (k.targetBarItems || []);
    return barWithTargetChart(items, {
      target,
      lowerIsBetter: k.lowerIsBetter !== false,
      targetStr: k.target,
      compact: true,
      ariaLabel: `${k.label} ${k.value} vs ${k.target}`
    });
  }

  function avgDepositTargetBarChart() {
    const { current, target } = DATA.avgDeposit;
    return barWithTargetChart(
      [{ label: "Deposit", value: current }],
      {
        target,
        lowerIsBetter: false,
        compact: true,
        ariaLabel: `Avg deposit ${fmtBarMoney(current)} vs goal ${fmtBarMoney(target)}`
      }
    );
  }

  function kpiGoalCardHtml(k) {
    /* Keep #19 lost-tracker chrome in goals grid — do not force gauge layout */
    if (k.lostTracker) return missedRevenueTrackerHtml();
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    const vClass = verifiedClass(!!k.verified);
    /* Source/formula live in ? help popup — not on the goal card face. */
    if (nums) {
      const grad = "goal-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || meetsTarget(nums.current, nums.target, k.lowerIsBetter === true));
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        <div class="kpi-goal-visual">
          ${kpiCardTitle(k.label)}
          ${metricWithDeltaHtml(gauge, k.mom)}
        </div>
        ${kpiRefMark(k.id)}
      </button>`;
    }
    const lostCap = 6000;
    const lostN = parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0;
    const lostPct = Math.min(1, lostN / lostCap);
    const grad = "goal-" + String(k.id).replace(/\W/g, "");
    const gauge = halfMoonGauge(lostPct, grad, {
      endLabel: k.target || "$0",
      valueLabel: fmtMoney(lostN)
    });
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      ${kpiHelpBtn(k.id)}
      <div class="kpi-goal-visual">
        ${kpiCardTitle(k.label || (k.alert ? "Requires action" : k.id))}
        ${metricWithDeltaHtml(gauge, k.mom)}
      </div>
      ${kpiRefMark(k.id)}
    </button>`;
  }

  /**
   * School-style letter grade from 0–100 score.
   * A+ 97–100 · A 93–96 · A- 90–92 · B+ 87–89 · B 83–86 · B- 80–82
   * C+ 77–79 · C 73–76 · C- 70–72 · D+ 67–69 · D 63–66 · D- 60–62 · F <60
   */
  function scoreToLetterGrade(score) {
    const n = Math.round(Number(score) || 0);
    if (n >= 97) return "A+";
    if (n >= 93) return "A";
    if (n >= 90) return "A-";
    if (n >= 87) return "B+";
    if (n >= 83) return "B";
    if (n >= 80) return "B-";
    if (n >= 77) return "C+";
    if (n >= 73) return "C";
    if (n >= 70) return "C-";
    if (n >= 67) return "D+";
    if (n >= 63) return "D";
    if (n >= 60) return "D-";
    return "F";
  }

  function bhiLetterGradeCardHtml(k) {
    const score = Math.round(parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0);
    const grade = scoreToLetterGrade(score);
    return `<button type="button" class="kpi-stat-card kpi-bhi-grade${verifiedClass(!!k.verified)}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      ${kpiHelpBtn(k.id)}
      ${kpiCardTitle(k.label)}
      <span class="kpi-bhi-grade-letter">${escapeHtml(grade)}</span>
      <span class="kpi-bhi-grade-pct">${score}%</span>
      <span class="kpi-stat-label">target ${escapeHtml(k.target || "100")}</span>
      ${momChangeHtml(k.mom)}
      ${k.verified ? sourceFootnote(k.id) : ""}
      ${kpiRefMark(k.id)}
    </button>`;
  }

  function missedCallsTargetBarChart(p) {
    return barWithTargetChart(
      [{ label: "Missed Call Rate", value: p.missedPct }],
      {
        target: p.missedTargetPct,
        lowerIsBetter: true,
        format: "percent",
        compact: true,
        fullCategoryLabels: true,
        width: 300,
        height: 140,
        ariaLabel: `Missed call rate ${p.missedPct}% vs goal ≤ ${p.missedTargetPct}%`
      }
    );
  }

  function missedRevenueTrackerHtml() {
    const p = DATA.phoneIntake;
    const model = missedRevenueModel(p);
    const lsaRows = (DATA.lsaEfficiency || []).slice();
    const lsaJun = lsaRows.find(r => r.month === "Jun")
      || lsaRows[lsaRows.length - 1]
      || {};
    const lsaCalls = Number(lsaJun.leads) || 0;
    const lsaCharged = Number(lsaJun.charged) || 0;
    return `<button type="button" class="kpi-goal-card kpi-stat-attention kpi-stat-target-bar" data-kpi-focus="#19">
      ${statusCorner(true)}
      ${kpiHelpBtn("#19")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Missed Opportunity")}
        ${missedCallsTargetBarChart(p)}
        <span class="kpi-stat-val kpi-val-negative">${fmtMoney(model.monthlyLost)}/mo</span>
      </div>
      ${goalTrackRows([
        ["Search Calls", `${model.missedSearchCalls} of ${p.monthlyCalls}`],
        ["LSA calls", `${lsaCalls} · ${lsaCharged} charged`],
        ["YTD lost", `${fmtMoney(model.cumulativeYtd)} · 64 missed`]
      ])}
      ${kpiRefMark("#19")}
    </button>`;
  }

  function lsaReallocationWasteModel(rows) {
    const periods = (rows || [])
      .filter(r => r.month === "Jun" || r.month === "Jul*")
      .map(r => {
        const lsaResponses = Number(r.leads) || 0;
        const digitalResponses = Number(r.adsLeads) || 0;
        const lsaSpend = Number(r.lsaSpend) || 0;
        const digitalSpend = Number(r.adsSpend) || 0;
        const digitalCostPerResponse = digitalResponses ? digitalSpend / digitalResponses : 0;
        const sameVolumeAtDigitalRate = lsaResponses * digitalCostPerResponse;
        const waste = Math.max(0, lsaSpend - sameVolumeAtDigitalRate);
        const digitalResponsesAtLsaSpend = digitalCostPerResponse ? lsaSpend / digitalCostPerResponse : 0;
        return {
          month: r.month,
          lsaResponses,
          lsaSpend,
          digitalCostPerResponse,
          waste,
          extraResponses: Math.max(0, digitalResponsesAtLsaSpend - lsaResponses)
        };
      });
    return {
      periods: newestFirst(periods),
      totalWaste: Math.round(periods.reduce((sum, r) => sum + r.waste, 0)),
      extraResponses: Math.round(periods.reduce((sum, r) => sum + r.extraResponses, 0))
    };
  }

  function lsaMismanagementTrackerHtml() {
    const model = lsaReallocationWasteModel(DATA.casesLeadsSpend);
    const benchmark = model.periods[0] || {};
    return `<button type="button" class="kpi-goal-card kpi-spend-waste-card" data-kpi-focus="#07" aria-description="Under construction">
      ${statusCorner(true)}
      ${kpiHelpBtn("#07")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Spend Waste")}
        <span class="kpi-stat-val kpi-negative-value">−${fmtMoney(model.totalWaste)}</span>
      </div>
      ${goalTrackRows([
        ["Potential responses", String(model.extraResponses)],
        ["Digital benchmark", `${fmtMoney(benchmark.digitalCostPerResponse || 0)}/response`]
      ])}
      ${kpiRefMark("#07")}
    </button>`;
  }

  function kpiStatKickerHtml(kpiId) {
    if (kpiId === "#01" || kpiId === "#02" || kpiId === "#12") {
      return `<span class="kpi-stat-kicker">Monthly</span>`;
    }
    if (kpiId === "#30") {
      return `<span class="kpi-stat-kicker">Firm-wide</span>`;
    }
    if (kpiId === "financial") {
      return `<span class="kpi-stat-kicker">2026 forecast</span>`;
    }
    return "";
  }

  function kpiStatCardHtml(k) {
    if (k.lostTracker) return missedRevenueTrackerHtml();
    if (k.letterGrade || k.id === "#BHI") return bhiLetterGradeCardHtml(k);
    const targetLine = (k.id === "#01" || k.id === "#02" || k.id === "#12" || k.id === "#30") && k.cashGoalNote
      ? `target ${k.target} · ${k.cashGoalNote}`
      : (k.target ? `target ${k.target}` : "");
    const vClass = verifiedClass(!!k.verified);
    const foot = k.verified ? sourceFootnote(k.id) : "";
    const icon = kpiMetricIconHtml(k.id);
    const kicker = kpiStatKickerHtml(k.id);
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    if (nums) {
      const grad = "km-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || meetsTarget(nums.current, nums.target, k.lowerIsBetter === true));
      const goalLine = targetLine;
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      return `<button type="button" class="kpi-stat-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        ${kicker}
        ${icon}
        ${kpiCardTitle(k.label)}
        ${metricWithDeltaHtml(gauge, k.mom)}
        ${goalLine ? `<span class="kpi-stat-label">${goalLine}</span>` : ""}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    if (k.targetBar) {
      const targetNum = parseTargetNum(k.target);
      const hit = meetsTarget(parseMetricNum(k.value), targetNum, k.lowerIsBetter !== false);
      return `<button type="button" class="kpi-stat-card kpi-stat-target-bar${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        ${icon}
        ${kpiCardTitle(k.label)}
        ${metricWithDeltaHtml(targetBarChartForKpi(k), k.mom)}
        <span class="kpi-stat-label">Avg ${escapeHtml(k.value)} · ${escapeHtml(targetLine)}</span>
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    return `<button type="button" class="kpi-stat-card${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      ${kpiHelpBtn(k.id)}
      ${icon}
      ${kpiCardTitle(k.label)}
      ${metricWithDeltaHtml(`<span class="kpi-stat-val">${k.value}</span>`, k.mom)}
      <span class="kpi-stat-label">${targetLine}</span>
      ${k.hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${foot}
      ${kpiRefMark(k.id)}
    </button>`;
  }

  function feeByPracticeBarChart(rows) {
    const items = rows || DATA.feeByPractice || [];
    const practiceColors = {
      "Sex Assault / Sex Offense": "#6a5acd",
      "Theft / Property": "#334155",
      "Assault / Menacing": "#c45c26",
      "Domestic Violence / DV": "#b23a78",
      "Criminal Defense (other)": "#3a1a6e",
      "Probation Revocation": "#64748b",
      "DUI / DWAI / Traffic": "#1e3a8a"
    };
    const max = niceAxisMax(Math.max(...items.map(r => r.mean), 1));
    const w = 720;
    const h = 300;
    const pad = { l: 52, r: 16, t: 32, b: 72 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / Math.max(items.length, 1);
    const barW = Math.min(56, slot * 0.55);
    const yOf = v => pad.t + plotH * (1 - v / max);
    const ticks = axisTicks(max, 5).map(t => {
      const y = yOf(t);
      const label = t >= 1000 ? `$${Math.round(t / 1000)}k` : `$${t}`;
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${label}</text>
      </g>`;
    }).join("");
    const bars = items.map((r, i) => {
      const bh = Math.max(6, plotH * (r.mean / max));
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const short = String(r.name)
        .replace(" / Sex Offense", "")
        .replace("Domestic Violence / DV", "DV")
        .replace("Criminal Defense (other)", "Crim. Def.")
        .replace("Probation Revocation", "Probation")
        .replace("DUI / DWAI / Traffic", "DUI/Traffic")
        .replace("Assault / Menacing", "Assault")
        .replace("Theft / Property", "Theft")
        .replace("Sex Assault", "Sex Assault");
      const valLabel = r.mean >= 1000
        ? `$${(r.mean / 1000).toFixed(r.mean % 1000 === 0 ? 0 : 1)}k`
        : `$${r.mean}`;
      const color = practiceColors[r.name] || "#64748b";
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${color}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${valLabel}</text>
        <text x="${x + barW / 2}" y="${h - 28}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(short)}</text>
        <text x="${x + barW / 2}" y="${h - 12}" text-anchor="middle" class="kpi-chart-axis">n=${r.n}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Mean client fee by practice area">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function feeByPracticeSectionHtml() {
    const rows = DATA.feeByPractice || [];
    const table = kpiDetailTable(
      ["Practice area", "n", "Mean fee"],
      rows.map(r => [r.name, String(r.n), fmtMoney(r.mean)])
    );
    return `<article class="kpi-split-panel" data-feedback-id="section-fee-by-practice" data-feedback-label="#29 Mean fee by practice">
      ${statusCorner(true)}
      ${kpiHelpBtn("#29")}
      ${kpiSectionStaticHead("Mean fee by practice area", "KPI #29 · Client + fee · n ≥ 5")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#29",
          title: "Mean fee by practice area",
          subtitle: "KPI #29 · Client + fee · n ≥ 5",
          chart: feeByPracticeBarChart(rows),
          table
        })}
        ${sourceFootnote("#29")}
      </div>
      ${kpiRefMark("#29")}
    </article>`;
  }

  function forecastExpenseCoverageDialHtml() {
    const collectibleAnnual = 884981;
    const expensesAnnual = 960000;
    const collectible = collectibleAnnual / 4;
    const expenses = expensesAnnual / 4;
    const coverage = Math.min(1.15, collectible / expenses);
    const shortfall = expenses - collectible;
    const hit = collectible >= expenses;
    const gauge = halfMoonGauge(Math.min(1, coverage), "forecast-expense-coverage", {
      valueLabel: `${Math.round((collectible / expenses) * 100)}%`,
      endLabel: "100%",
      goalMark: 1,
      celebrate: hit
    });
    return `<button type="button" class="kpi-stat-card kpi-stat-gauge kpi-verified" data-kpi-focus="financial" aria-label="Quarterly collectible forecast coverage of the quarterly expense run-rate">
      ${statusCorner(true)}
      ${kpiHelpBtn("financial")}
      ${kpiStatKickerHtml("financial")}
      ${kpiMetricIconHtml("financial")}
      ${kpiCardTitle("Breakeven Forecast")}
      ${metricWithDeltaHtml(gauge, null)}
      <span class="kpi-stat-label">Quarterly expenses ${fmtMoney(expenses)}</span>
      ${hit
        ? '<span class="kpi-target-hit">Target reached</span>'
        : `<span class="kpi-stat-label kpi-negative-value">Coverage gap −${fmtMoney(shortfall)}</span>`}
      ${kpiRefMark("#09")}
    </button>`;
  }

  function forecastExpenseCoverageGoalCardHtml() {
    const collectibleAnnual = 884981;
    const expensesAnnual = 960000;
    const collectible = collectibleAnnual / 4;
    const expenses = expensesAnnual / 4;
    const coverage = Math.min(1.15, collectible / expenses);
    const shortfall = expenses - collectible;
    const hit = collectible >= expenses;
    const gauge = halfMoonGauge(Math.min(1, coverage), "forecast-expense-coverage", {
      valueLabel: `${Math.round((collectible / expenses) * 100)}%`,
      endLabel: "100%",
      goalMark: 1,
      celebrate: hit
    });
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge kpi-verified" data-kpi-focus="financial" aria-label="Quarterly collectible forecast coverage of the quarterly expense run-rate">
      ${statusCorner(true)}
      ${kpiHelpBtn("financial")}
      ${kpiStatKickerHtml("financial")}
      ${kpiMetricIconHtml("financial")}
      ${kpiCardTitle("Breakeven Forecast")}
      ${metricWithDeltaHtml(gauge, null)}
      <span class="kpi-stat-label">Quarterly expenses ${fmtMoney(expenses)}</span>
      ${hit
        ? '<span class="kpi-target-hit">Target reached</span>'
        : `<span class="kpi-stat-label kpi-negative-value">Coverage gap −${fmtMoney(shortfall)}</span>`}
      ${kpiRefMark("#09")}
    </button>`;
  }

  function yelpGoalCardHtml() {
    const reviewTarget = 20;
    const leadTarget = 20;
    const currentReviews = Number((DATA.reviews || []).find(r => r.platform === "Yelp")?.count) || 0;
    const currentLeads = Number((DATA.referrals || []).find(r => r.platform === "Yelp")?.count) || 0;
    const combinedCurrent = currentReviews + currentLeads;
    const combinedTarget = reviewTarget + leadTarget;
    const combinedPct = combinedCurrent / combinedTarget;
    const hit = currentReviews >= reviewTarget && currentLeads >= leadTarget;
    const gauge = halfMoonGauge(Math.min(1, combinedPct), "yelp-goal", {
      valueLabel: `${Math.round(combinedPct * 100)}%`,
      endLabel: "100%",
      goalMark: 1,
      celebrate: hit
    });
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge kpi-verified" data-kpi-focus="yelp" aria-label="Yelp goal progress toward 20 reviews and 20 leads">
      ${statusCorner(true)}
      ${kpiHelpBtn("yelp")}
      ${kpiStatKickerHtml("yelp")}
      ${kpiMetricIconHtml("#12")}
      ${kpiCardTitle("Yelp Goal")}
      ${metricWithDeltaHtml(gauge, null)}
      ${goalTrackRows([
        ["Reviews", `${currentReviews}/${reviewTarget}`],
        ["Leads", `${currentLeads}/${leadTarget}`]
      ])}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiRefMark("#17")}
    </button>`;
  }

  function renderKpis(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    const liveKpis = DATA.kpis.filter(k => !k.archived);
    const goals = liveKpis.filter(k => k.goal);
    const metrics = liveKpis.filter(k => !k.goal && !k.lostTracker && k.id !== "#28");
    const goalsCards = [
      kpiTileWithProjects("#19", missedRevenueTrackerHtml()),
      ...goals.map(k => kpiTileWithProjects(k.id, kpiGoalCardHtml(k))),
      kpiTileWithProjects("#03", teamDuiGoalCardHtml()),
      kpiTileWithProjects("yelp", yelpGoalCardHtml())
    ].join("");
    const goalsBlock = `<section class="kpi-section kpi-section-static kpi-section-goals" data-feedback-id="section-goals" data-feedback-label="Team goals">
          ${kpiSectionStaticHead("Team goals", "Missed opportunity · DUI YTD · Yelp goal")}
          <div class="kpi-section-body">
            <div class="kpi-goals-grid">${goalsCards}</div>
          </div>
        </section>`;
    const kpiCards = [
      ...metrics.map(k => kpiTileWithProjects(k.id, kpiStatCardHtml(k)))
    ].join("");

    el.innerHTML = `${reportHeader()}
      ${goalsBlock}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionStaticHead("Key metrics", `Tiles revised ${DATA.lastUpdated}`)}
        <div class="kpi-section-body">
          <div class="kpi-stat-grid">${kpiCards}</div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Key Channel Activity">
        ${kpiSectionStaticHead("Channel Details", "")}
        <div class="kpi-section-body">
          ${casesLeadsSpendSectionHtml()}
          <div class="kpi-split-grid" style="margin-top:1rem">
            ${salesCostFunnelPanelHtml()}
          </div>
        </div>
      </section>
      ${lsaChargeRateSectionHtml()}
      ${financialSectionHtml()}`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "kpis");
  }

  /**
   * #08 panel — Impact / Results tab (campaign lead volume).
   * Data: DATA.leadsByCampaign · source KPI_SOURCES["#08"]
   */
  function leadsByCampaignPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-leads-campaign" data-feedback-label="#08 Leads by campaign">
      ${statusCorner(true)}
      ${kpiHelpBtn("#08")}
      ${kpiSectionStaticHead("Leads by campaign", "Stacked by month")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#08",
          title: "Leads by campaign",
          subtitle: "Stacked by month",
          chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.leadsByCampaign)),
          legend: channelLegend(DATA.leadsByCampaign),
          table: campaignLeadsDetailTable(DATA.leadsByCampaign)
        })}
        <p class="data-inline-note">Guide projects: ${projectEggLink("RETAINER", "Open Digital Ads Maintenance Retainer")} · ${projectEggLink("NtguiltAd", "Open NTGUILT AdWords Campaign Launch")} · ${projectEggLink("AdEnhance", "Open Digital Ad Enhancements")} · ${projectEggLink("SocialAds", "Open NTGUILT & Firm Social Campaigns")}</p>
        ${sourceFootnote("#08")}
      </div>
      ${kpiRefMark("#08")}
    </article>`;
  }

  /** Results tab — map live stacks to Guide project IDs. */
  function resultsCampaignProjectMapHtml() {
    const rows = [
      ["Military Search", "#08 leads / spend", ["RETAINER", "AdEnhance"]],
      ["Core DV Search", "#08 leads / spend", ["RETAINER", "AdEnhance"]],
      ["NTGUILT Ads", "#08 leads / spend", ["NtguiltAd", "SocialAds"]],
      ["LSA intake", "#07 · #13 · phone", ["LsaCall", "HsVoip"]],
      ["Digital profiles / reviews", "#16 presence", ["DigProf", "CaseyBrand"]],
      ["Referral network", "#17 referrals", ["Referral"]],
      ["HubSpot / CRM forms", "Website forms fee", ["HsVoip", "HsSetup"]],
      ["Financial waste", "#07 spend waste", ["RETAINER", "HsVoip"]]
    ];
    const body = rows.map(([stack, metric, ids]) => [
      escapeHtml(stack),
      escapeHtml(metric),
      ids.map(id => projectEggLink(id)).filter(Boolean).join(" · ") || "—"
    ]);
    return `${kpiDetailTable(["Channel / stack", "Tied KPI", "Guide project"], body)}
      <p class="data-inline-note">Links open the Guide card for that project. Status and fees stay owned by INDEX + project markdown.</p>`;
  }

  /** Results tab — INDEX statuses that should show measurable outcomes. */
  function resultsProjectStatusBoardHtml() {
    const data = window.PROJECT_DATA || {};
    const items = [];
    if (data.retainer) items.push({ ...data.retainer, id: "RETAINER" });
    (data.projects || []).forEach(p => items.push(p));
    const keep = new Set(["required", "recommended", "launched", "wip", "started", "completed", "ongoing"]);
    const rows = items
      .filter(p => keep.has(String(p.status || "").toLowerCase().replace(/\s+/g, "")) || /wip|started|launched|recommended|required|completed|ongoing/i.test(String(p.status || "")))
      .slice(0, 18)
      .map(p => {
        const st = String(p.status || "available");
        const tip = p.id === "NtguiltAd" ? "#08 NTGUILT"
          : p.id === "RETAINER" ? "#08 Military · Core DV · mgmt"
          : p.id === "LsaCall" ? "LSA process"
          : p.id === "DigProf" ? "#16 presence"
          : p.id === "Referral" ? "#17 referrals"
          : p.id === "WasteAud" ? "Spend waste"
          : p.id === "SummerEmail" || p.id === "StackAudit" || p.id === "AccessAud" || p.id === "EmailDns" ? "Completed report-out"
          : "Guide outcomes";
        return [
          projectEggLink(p.id, `Open ${p.title || p.id}`, p.id),
          escapeHtml(p.title || p.id),
          escapeHtml(st),
          escapeHtml(tip)
        ];
      });
    if (!rows.length) {
      return `<p class="data-inline-note">No INDEX projects with active/completed status yet.</p>`;
    }
    return `${kpiDetailTable(["ID", "Project", "Status", "Results tie-in"], rows)}
      <p class="data-inline-note">Board reads live <code>PROJECT_DATA</code> from INDEX. Completed rows also feed the report-out draft below.</p>`;
  }

  function lsaResultsStripHtml() {
    const rows = DATA.lsaEfficiency || [];
    if (!rows.length) return `<p class="data-inline-note">LSA efficiency rows not loaded.</p>`;
    const newest = newestFirst(rows);
    const body = newest.map(r => [
      escapeHtml(r.month),
      String(r.leads),
      String(r.charged),
      r.leads ? `${Math.round((r.charged / r.leads) * 1000) / 10}%` : "—",
      fmtMoney(r.lsaSpend),
      r.charged ? fmtMoney(r.lsaSpend / r.charged) : "—"
    ]);
    return `${kpiDetailTable(["Month", "Leads", "Charged", "Charge rate", "Spend", "Avg charge cost"], body)}
      <p class="data-inline-note">Process owner: ${projectEggLink("LsaCall", "Open LSA Call Process Update")} · Phone / VoIP: ${projectEggLink("HsVoip", "Open Phone(s) & VoIP Setup")}</p>`;
  }

  function renderImpact(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `<div class="data-grid">
      ${dataCardHtml(
        "Leads by campaign",
        "#08 · Military · Core DV · NTGUILT — tied to Retainer, NtguiltAd, AdEnhance, SocialAds.",
        leadsByCampaignPanelHtml(),
        { full: true, id: "results-leads-campaign" }
      )}
      ${dataCardHtml(
        "Campaign → Guide projects",
        "Which Guide projects own each live stack.",
        resultsCampaignProjectMapHtml(),
        { full: true, id: "results-campaign-map" }
      )}
      ${dataCardHtml(
        "Project status board",
        "Required · recommended · launched · WIP · completed — from INDEX.",
        resultsProjectStatusBoardHtml(),
        { full: true, id: "results-status-board" }
      )}
      ${dataCardHtml(
        "LSA efficiency",
        "Inbox charge rate by month · LsaCall / HsVoip.",
        lsaResultsStripHtml(),
        { full: true, id: "results-lsa" }
      )}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "impact");
  }

  /**
   * #17 Referral Network — placeholder counts (null) until Referral tracking wires.
   * Doc: parked/KPI-17-REFERRAL-NETWORK.md
   */
  function totalReferralNetworkPanelHtml() {
    const segs = presencePieSegments(DATA.referrals);
    const tableRows = DATA.referrals.map(r => [
      `${star(!!r.verified)} ${escapeHtml(r.platform)}`,
      dash(r.count),
      r.delta != null ? (momChangeHtml(r.delta) || dash(r.delta)) : dash(r.delta)
    ]);
    return `<div class="kpi-mini-card" data-kpi-focus="#17">
      ${statusCorner(false)}
      <h3>Total Referral Network</h3>
      ${chartBlock({
        title: "Referral network",
        subtitle: "Yelp Jul* = 3 leads · other channels pending Referral",
        chart: donutChart(segs),
        table: kpiDetailTable(["Channel", "Referrers", "Change"], tableRows)
      })}
    </div>`;
  }

  function dashboardSectionsHtml() {
    const depositHit = meetsTarget(DATA.avgDeposit.current, DATA.avgDeposit.target, false);
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-business-health" data-feedback-label="Pipeline & deposits">
        ${kpiSectionStaticHead("Pipeline & source mix")}
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <article class="kpi-split-panel" data-feedback-id="section-cases-mom" data-feedback-label="#04 Cases MoM">
              ${statusCorner(false)}
              ${kpiSectionStaticHead("Cases MoM", "Closed · New · Red accounts")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#04",
                  title: "Cases MoM",
                  subtitle: "Closed · New · Red accounts",
                  chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
                  legend: casesMomLegend(DATA.casesMomSeries, DATA.casesMom),
                  table: casesMomDetailTable(DATA.casesMom)
                })}
              </div>
              ${kpiRefMark("#04")}
            </article>
            <article class="kpi-split-panel kpi-verified" data-feedback-id="section-source-mix" data-feedback-label="#10 Source mix">
              ${kpiSectionStaticHead("Source mix", "Lead share by channel")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#10",
                  title: "Source mix",
                  subtitle: "Lead share by channel",
                  chart: donutChart(DATA.sourceMix),
                  table: sourceMixDetailTable(DATA.sourceMix)
                })}
                ${sourceFootnote("#10")}
              </div>
              ${kpiRefMark("#10")}
            </article>
          </div>
          <div class="kpi-dash-grid-2 kpi-dash-grid-1" style="margin-top:1rem">
            <div class="kpi-dash-card kpi-dash-target-bar" data-kpi-focus="#20">
              ${statusCorner(false)}
              <span class="kpi-stat-id">Avg deposit</span>
              ${avgDepositTargetBarChart()}
              <div class="kpi-stat-label">Goal $${DATA.avgDeposit.target} · placeholder current $${DATA.avgDeposit.current}</div>
              ${depositHit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
              ${kpiDetailTable(
                ["Measure", "Amount"],
                [
                  ["Current (placeholder)", `$${DATA.avgDeposit.current}`],
                  ["Goal", `$${DATA.avgDeposit.target}`],
                  ["Gap", `$${DATA.avgDeposit.target - DATA.avgDeposit.current}`]
                ]
              )}
              ${kpiRefMark("#20")}
            </div>
          </div>
        </div>
      </section>`;
  }

  function presenceToneClass(status) {
    if (status === "active") return "kpi-presence kpi-presence-on";
    if (status === "building") return "kpi-presence kpi-presence-building";
    if (status === "outdated") return "kpi-presence kpi-presence-outdated";
    return "kpi-presence kpi-presence-gap";
  }

  function presenceMixColumnHtml() {
    const anyVerified = DATA.reviews.some(r => r.verified);
    const segs = presencePieSegments(DATA.reviews);
    const rows = DATA.reviews.map(r => [
      `${star(!!r.verified)} ${escapeHtml(r.platform)}`,
      dash(r.rating),
      dash(r.count),
      `<span class="${presenceToneClass(r.status)}">${escapeHtml(presenceLabel(r.status))}</span>`
    ]);
    const channelTable = kpiDetailAccordion(
      "Channel table",
      `${DATA.reviews.length} directories`,
      ["Channel", "Rating", "#", "Status"],
      rows
    );
    return `<div class="kpi-presence-mix-col" data-feedback-id="section-reviews-presence" data-feedback-label="#16 Reviews by channel">
      ${chartBlock({
        focus: "#16",
        helpId: "#16",
        verified: anyVerified,
        title: "Presence mix",
        subtitle: "Listed / Unlisted / Outdated",
        chart: donutChart(segs),
        table: `${channelTable}${projectEggLink("DigProf", "Open Digital Profiles Refresh")}`
      })}
    </div>`;
  }

  function reviewsByChannelPanelHtml() {
    return presenceMixColumnHtml();
  }

  function leadsByChannelPanelHtml(opts) {
    const sideTable = !!(opts && opts.sideTable);
    const chart = stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.channels, { useChannelMonths: true }));
    const legend = channelLegend(DATA.channels);
    const table = channelsDetailTable(DATA.channels);
    if (sideTable) {
      /* Data tab: one title (chartBlock) · chart | table two columns · KPI plot style */
      return `<article class="kpi-split-panel data-chart-table-panel" data-feedback-id="section-leads-channel-01" data-feedback-label="#01 Leads by channel">
      ${statusCorner(true)}
      <div class="kpi-split-panel-body data-chart-table-grid">
        ${chartBlock({
          focus: "#01",
          helpId: "#01",
          title: "Leads by channel",
          subtitle: "Stacked by month · newest first",
          chart,
          legend
        })}
        <div class="kpi-chart-detail data-chart-side-table">
          ${table}
          ${sourceFootnote("#01")}
        </div>
      </div>
      ${kpiRefMark("#01")}
    </article>`;
    }
    return `<article class="kpi-split-panel" data-feedback-id="section-leads-channel-01" data-feedback-label="#01 Leads by channel">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Leads by channel", "Stacked by month")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#01",
          title: "Leads by channel",
          subtitle: "Stacked by month",
          chart,
          legend,
          table
        })}
        ${sourceFootnote("#01")}
      </div>
      ${kpiRefMark("#01")}
    </article>`;
  }

  /**
   * Parked — Lead Share & Potential Revenue (#10).
   * Doc: parked/KPI-10-LEAD-SHARE-REVENUE.md
   * Restore: insert `${sourceMixPanelHtml()}` (or KPI_REPORT.parked.sourceMixPanelHtml()).
   */
  function sourceMixPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-source-mix" data-feedback-label="#10 Source mix">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Source mix", "Lead share by channel")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#10",
          title: "Source mix",
          subtitle: "Lead share by channel",
          chart: donutChart(DATA.sourceMix),
          table: sourceMixDetailTable(DATA.sourceMix)
        })}
        ${sourceFootnote("#10")}
      </div>
      ${kpiRefMark("#10")}
    </article>`;
  }

  function casesMomPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-cases-mom" data-feedback-label="#04 Cases MoM">
      ${statusCorner(false)}
      ${kpiSectionStaticHead("Cases MoM", "Closed · New · Red accounts")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#04",
          title: "Cases MoM",
          subtitle: "Closed · New · Red accounts",
          chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
          legend: casesMomLegend(DATA.casesMomSeries, DATA.casesMom),
          table: casesMomDetailTable(DATA.casesMom)
        })}
      </div>
      ${kpiRefMark("#04")}
    </article>`;
  }

  function casesCreatedPanelHtml() {
    const chartRows = cashAndCasesChartRows();
    if (!chartRows.length) return "";
    return `<article class="kpi-split-panel" data-feedback-id="section-cases-created" data-feedback-label="Cases Created 2025–2026">
      ${statusCorner(true)}
      ${kpiHelpBtn("cases-created")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          chart: casesCreatedChart(chartRows)
        })}
        ${sourceFootnote("cases-created")}
      </div>
    </article>`;
  }

  function avgDepositPanelHtml() {
    const depositHit = meetsTarget(DATA.avgDeposit.current, DATA.avgDeposit.target, false);
    return `<div class="kpi-dash-card kpi-dash-target-bar" data-kpi-focus="#20">
      ${statusCorner(false)}
      <span class="kpi-stat-id">Avg deposit</span>
      ${avgDepositTargetBarChart()}
      <div class="kpi-stat-label">Goal $${DATA.avgDeposit.target} · placeholder current $${DATA.avgDeposit.current}</div>
      ${depositHit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiDetailTable(
        ["Measure", "Amount"],
        [
          ["Current (placeholder)", `$${DATA.avgDeposit.current}`],
          ["Goal", `$${DATA.avgDeposit.target}`],
          ["Gap", `$${DATA.avgDeposit.target - DATA.avgDeposit.current}`]
        ]
      )}
      ${kpiRefMark("#20")}
    </div>`;
  }

  function dataCardHtml(title, note, body, opts) {
    const full = opts && opts.full ? " data-grid-full" : "";
    const extraClass = opts && opts.className ? ` ${escapeHtml(opts.className)}` : "";
    const id = opts && opts.id ? ` id="${escapeHtml(opts.id)}"` : "";
    const inputNeeded = opts && opts.inputNeeded;
    const inputClass = inputNeeded ? " data-card-input-needed" : "";
    const disabled = inputNeeded ? ' aria-disabled="true"' : "";
    const inputProjectEgg = opts && opts.inputProjectId
      ? projectEggLink(opts.inputProjectId, opts.inputProjectLabel, opts.inputProjectEgg)
      : "";
    const head = title ? `<h3>${escapeHtml(title)}</h3>` : "";
    return `<section class="data-card${full}${extraClass}${inputClass}"${id}${disabled}>
      ${head}
      ${note ? `<p class="data-card-note">${escapeHtml(note)}</p>` : ""}
      <div class="data-card-body">${body || ""}</div>
      ${inputNeeded ? '<div class="data-input-needed-overlay" role="status">Data Input Needed</div>' : ""}
      ${inputProjectEgg}
    </section>`;
  }

  function renderData(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `<div class="data-grid">
      ${dataCardHtml("", "", leadsByChannelPanelHtml({ sideTable: true }), {
        className: "data-card-span-2 data-card-kpi-chart",
        id: "data-lead-channel-stack"
      })}
      ${dataCardHtml("", "", reviewsByChannelPanelHtml(), {
        className: "data-card-kpi-chart",
        id: "data-presence-mix"
      })}
      ${dataCardHtml("Cases MoM", "Closed · New · Red accounts.", casesMomPanelHtml())}
      ${dataCardHtml("Cases Created", "MyCase created month · 2025 full year + 2026 YTD.", casesCreatedPanelHtml(), { full: true })}
      ${dataCardHtml("Referral Network", "KPI #17 · placeholder until Referral tracking wires.", totalReferralNetworkPanelHtml(), {
        inputNeeded: true,
        inputProjectId: "Referral",
        inputProjectLabel: "Open Referral Client Referral Program",
        inputProjectEgg: "17"
      })}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "data");
  }

  /** Blended 2026 case forecast: prior-year H2 seasonality + current H1 run rate. */
  function caseForecastPanelHtml() {
    const forecast = [
      { month: "Aug", cases: 15 },
      { month: "Sep", cases: 14 },
      { month: "Oct", cases: 15 },
      { month: "Nov", cases: 12 },
      { month: "Dec", cases: 14 }
    ];
    const actualNewest = [
      { month: "Jul*", cases: 23 },
      { month: "Jun", cases: 36 },
      { month: "May", cases: 22 },
      { month: "Apr", cases: 15 },
      { month: "Mar", cases: 17 },
      { month: "Feb", cases: 14 }
    ];
    const rows = [
      ...forecast.map(r => ({ ...r, forecast: true })),
      ...actualNewest.map(r => ({ ...r, forecast: false }))
    ];
    const w = 820;
    const h = 290;
    const pad = { l: 54, r: 20, t: 50, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const axisMax = 40;
    const slot = plotW / rows.length;
    const barW = Math.min(42, slot * 0.58);
    const ticks = [0, 10, 20, 30, 40].map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 9}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${value}</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const bh = Math.max(5, (plotH * r.cases) / axisMax);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="var(--gg-royal-blue)" fill-opacity="${r.forecast ? "0.38" : "1"}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${r.forecast ? ' opacity="0.62"' : ""}>${r.cases}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}${r.forecast ? " F" : ""}</text>
      </g>`;
    }).join("");
    const dividerX = pad.l + forecast.length * slot;
    const forecastCenter = pad.l + (forecast.length * slot) / 2;
    const actualCenter = dividerX + (actualNewest.length * slot) / 2;
    const chart = `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="2026 cases: August through December forecast first, then July through February actual newest to oldest">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${forecastCenter}" y="24" text-anchor="middle" class="kpi-chart-total">Forecast · Aug → year end</text>
      <text x="${actualCenter}" y="24" text-anchor="middle" class="kpi-chart-total">Completed · newest → oldest</text>
      <line x1="${dividerX}" y1="32" x2="${dividerX}" y2="${h - pad.b + 8}" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="4 6"/>
      ${bars}
      <text x="15" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 15 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cases</text>
    </svg>`;
    const tableRows = rows.map(r => [
      r.month,
      String(r.cases),
      r.forecast ? "Forecast · transparent" : "Actual · completed"
    ]);
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Jan–Jun actual</h3><p class="kpi-mini-value">116</p></div>
        <div class="kpi-mini-card"><h3>Jul–Dec forecast</h3><p class="kpi-mini-value">85</p></div>
        <div class="kpi-mini-card"><h3>2026 full-year estimate</h3><p class="kpi-mini-value">201</p></div>
      </div>
      ${chartBlock({
        title: "Cases forecast",
        subtitle: "Actual + blended H2 estimate · newest first",
        chart,
        table: kpiDetailTable(["Month", "Cases", "Status"], tableRows)
      })}
      <p class="data-formula-line">Seasonal H2 = 2025 H2 (57) × 2026/2025 H1 factor (116 ÷ 121) = 54 cases</p>
      <p class="data-formula-line">Run-rate H2 = 2026 H1 average (~19.3/mo) × 6 = 116 cases</p>
      <p class="data-formula-line">Blended H2 = (54 seasonal + 116 run-rate) ÷ 2 = 85 cases · full year = 116 actual H1 + 85 forecast H2 = 201</p>
      <p class="data-warning-note"><strong>Jul* actual:</strong> 23 Client creates through 2026-07-23 (Contact_07-25-2026.csv). Replace Aug–Dec estimates when those months close.</p>`;
  }

  function expensePaceGraphHtml() {
    const periods = [
      {
        label: "Full-year forecast",
        forecast: true,
        values: [1122987, 898390, 960000]
      },
      {
        label: "Jan–Jun actual",
        forecast: false,
        values: [648092, 518474, 480000]
      }
    ];
    const series = [
      { name: "Quoted value", color: "var(--gg-royal-blue)" },
      { name: "Est. collectible (80%)", color: "var(--gg-positive)" },
      { name: "Expenses", color: "var(--gg-royal)" }
    ];
    const w = 760;
    const h = 320;
    const pad = { l: 64, r: 22, t: 52, b: 64 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const axisMax = 1200000;
    const groupSlot = plotW / periods.length;
    const barW = 58;
    const gap = 12;
    const groupW = series.length * barW + (series.length - 1) * gap;
    const ticks = [0, 300000, 600000, 900000, 1200000].map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      const label = value === 0 ? "$0" : `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 1 : 2)}M`;
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 9}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${label}</text>
      </g>`;
    }).join("");
    const bars = periods.map((period, periodIndex) => {
      const groupX = pad.l + periodIndex * groupSlot + (groupSlot - groupW) / 2;
      const periodBars = period.values.map((value, seriesIndex) => {
        const bh = Math.max(6, plotH * value / axisMax);
        const x = groupX + seriesIndex * (barW + gap);
        const y = pad.t + plotH - bh;
        const label = value >= 1000000
          ? `$${(value / 1000000).toFixed(2)}M`
          : `$${Math.round(value / 1000)}k`;
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${series[seriesIndex].color}" fill-opacity="${period.forecast ? "0.48" : "1"}"/>
          <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${period.forecast ? ' opacity="0.68"' : ""}>${label}</text>
        </g>`;
      }).join("");
      return `<g>
        ${periodBars}
        <text x="${groupX + groupW / 2}" y="${h - 22}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(period.label)}</text>
      </g>`;
    }).join("");
    const legend = `<div class="kpi-chart-legend">${series.map(item =>
      `<span><i class="kpi-stack-swatch" style="background:${item.color}"></i> ${escapeHtml(item.name)}</span>`
    ).join("")}<span style="opacity:0.52">Lighter bars = forecast</span></div>`;
    return chartBlock({
      title: "Quoted, collectible, and expenses",
      subtitle: "Full-year forecast first · Jan–Jun actual second",
      chart: `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Full-year forecast and Jan through June actual quoted value, collectible value, and expenses">
        <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
        ${ticks}${bars}
        <text x="16" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 16 ${pad.t + plotH / 2})" class="kpi-chart-axis">Value ($)</text>
      </svg>`,
      legend,
      footnote: "Quoted = mean fee × cases · collectible = 80% · expenses = $80k/month."
    });
  }

  /** Shared $80k/mo expense-pace math for Financials + Predictions. */
  function expensePaceMetrics() {
    const mean = 5587;
    const collectionRate = 0.8;
    const monthlyExpense = 80000;
    const monthsElapsed = 6;
    const actualH1 = 116;
    const fullYearCases = 201;
    const quotedH1 = actualH1 * mean;
    const collectibleH1 = Math.round(quotedH1 * collectionRate);
    const quotedFullYear = fullYearCases * mean;
    const collectibleFullYear = Math.round(quotedFullYear * collectionRate);
    const expenseH1 = monthlyExpense * monthsElapsed;
    const expenseFullYear = monthlyExpense * 12;
    const linearQuotedPace = Math.round(quotedFullYear * monthsElapsed / 12);
    const linearCollectiblePace = Math.round(collectibleFullYear * monthsElapsed / 12);
    const quotedPaceDelta = quotedH1 - linearQuotedPace;
    const collectiblePaceDelta = collectibleH1 - linearCollectiblePace;
    const netCollectibleH1 = collectibleH1 - expenseH1;
    const netCollectibleFullYear = collectibleFullYear - expenseFullYear;
    const quotedPacePct = Math.round((quotedPaceDelta / linearQuotedPace) * 100);
    return {
      monthlyExpense,
      quotedH1,
      collectibleH1,
      quotedFullYear,
      collectibleFullYear,
      expenseH1,
      expenseFullYear,
      linearQuotedPace,
      linearCollectiblePace,
      quotedPaceDelta,
      collectiblePaceDelta,
      netCollectibleH1,
      netCollectibleFullYear,
      quotedPacePct
    };
  }

  function expensePaceCheckpointTableHtml() {
    const m = expensePaceMetrics();
    return kpiDetailTable(
      ["Checkpoint", "Target / expense", "Actual or forecast", "Gap", "Status"],
      [
        ["Mid-year quoted pace", fmtMoney(m.linearQuotedPace), fmtMoney(m.quotedH1), `+${fmtMoney(m.quotedPaceDelta)}`, "Ahead"],
        ["Mid-year collectible pace", fmtMoney(m.linearCollectiblePace), fmtMoney(m.collectibleH1), `+${fmtMoney(m.collectiblePaceDelta)}`, "Ahead"],
        ["H1 expenses covered (collectible)", fmtMoney(m.expenseH1), fmtMoney(m.collectibleH1), `+${fmtMoney(m.netCollectibleH1)}`, "Issue — unknown debt"],
        ["Full-year expenses covered (collectible forecast)", fmtMoney(m.expenseFullYear), fmtMoney(m.collectibleFullYear), `−${fmtMoney(Math.abs(m.netCollectibleFullYear))}`, "Short"]
      ]
    );
  }

  /** $80k/mo expense pace vs 2026 quoted / collectible forecast. */
  function expensePaceRecommendationHtml() {
    const m = expensePaceMetrics();
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Expense / month</h3><p class="kpi-mini-value">${fmtMoney(m.monthlyExpense)}</p></div>
        <div class="kpi-mini-card"><h3>Quoted pace vs mid-year</h3><p class="kpi-mini-value">+${fmtMoney(m.quotedPaceDelta)}</p></div>
        <div class="kpi-mini-card"><h3>Full-year collectible after expenses</h3><p class="kpi-mini-value">−${fmtMoney(Math.abs(m.netCollectibleFullYear))}</p></div>
      </div>
      ${expensePaceGraphHtml()}
      <p class="data-warning-note"><strong>Recommendation:</strong> Case/quoted volume is <strong>ahead of mid-year pace</strong> (+${m.quotedPacePct}%), but the full-year collectible forecast still does <strong>not cover</strong> an $80k/mo expense run-rate. Treat expense coverage as the tighter constraint — raise collectible value (higher-fee practice mix, Sex Crimes Defense, collection rate) or cut recurring spend before assuming the $1.1M quoted forecast means the year is safe.</p>
      <p class="data-warning-note"><strong>Issue — do not treat H1 surplus as positive:</strong> H1 collectible after expenses shows +${fmtMoney(m.netCollectibleH1)}, but <strong>unknown business debt</strong> (loans, credit balances, and other liabilities outside the $80k/mo operating assumption) is not included. Flag this as a negative / unreliable indicator until WasteAud maps every liability.</p>
      <p class="data-inline-note"><strong>Mid-year quoted pace:</strong> Target ${fmtMoney(m.linearQuotedPace)} · actual ${fmtMoney(m.quotedH1)} · ahead ${fmtMoney(m.quotedPaceDelta)} (+${m.quotedPacePct}%).</p>
      <p class="data-inline-note"><strong>Mid-year collectible pace:</strong> Target ${fmtMoney(m.linearCollectiblePace)} · actual ${fmtMoney(m.collectibleH1)} · ahead ${fmtMoney(m.collectiblePaceDelta)}.</p>
      <p class="data-formula-line">H1 expenses = ${fmtMoney(m.monthlyExpense)} × 6 = ${fmtMoney(m.expenseH1)} · H1 collectible after expenses = ${fmtMoney(m.netCollectibleH1)} (unreliable — unknown debt)</p>
      <p class="data-formula-line">Full-year expenses = ${fmtMoney(m.expenseFullYear)} · collectible forecast ${fmtMoney(m.collectibleFullYear)} · shortfall ${fmtMoney(Math.abs(m.netCollectibleFullYear))}</p>
      ${expensePaceCheckpointTableHtml()}
      <p class="data-inline-note"><strong>Next actions:</strong> Keep Sex Crimes Defense / high-mean practice focus in AdEnhance · cut known waste now without waiting on a full WasteAud audit · reforecast after July MyCase cases and QuickBooks collections land.</p>`;
  }

  /** Intake-driven cash projection — historical case volume × practice-weighted fee × financed payment curve. */
  function cashProjectionPanelHtml() {
    const meanFee = 5587;
    const collectionRate = 0.8;
    /* Financing / payment-plan curve: month 0 deposit through month 6. */
    const payCurve = [0.4, 0.2, 0.15, 0.1, 0.07, 0.05, 0.03];
    const practiceMix = DATA.feeByPractice || [];
    const practiceN = practiceMix.reduce((s, p) => s + (Number(p.n) || 0), 0);
    const mixWeightedFee = practiceN
      ? practiceMix.reduce((s, p) => s + (Number(p.mean) || 0) * (Number(p.n) || 0), 0) / practiceN
      : meanFee;
    const feeUsed = Math.round(mixWeightedFee);
    const collectibleUsed = feeUsed * collectionRate;

    const actualCohorts = [
      { month: "Jan", cases: 12, forecast: false },
      { month: "Feb", cases: 14, forecast: false },
      { month: "Mar", cases: 17, forecast: false },
      { month: "Apr", cases: 15, forecast: false },
      { month: "May", cases: 22, forecast: false },
      { month: "Jun", cases: 36, forecast: false },
      { month: "Jul", cases: 23, forecast: false }
    ];
    const forecastCohorts = [
      { month: "Aug", cases: 15, forecast: true },
      { month: "Sep", cases: 14, forecast: true },
      { month: "Oct", cases: 15, forecast: true },
      { month: "Nov", cases: 12, forecast: true },
      { month: "Dec", cases: 14, forecast: true }
    ];
    const cohorts = [...actualCohorts, ...forecastCohorts];
    const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const cash = Array(12).fill(0);
    const residual = Array(12).fill(0);
    const newIntake = Array(12).fill(0);

    cohorts.forEach(c => {
      const signIdx = monthIndex[c.month];
      const billed = c.cases * collectibleUsed;
      payCurve.forEach((share, lag) => {
        const arriveIdx = signIdx + lag;
        if (arriveIdx > 11) return;
        const amt = billed * share;
        cash[arriveIdx] += amt;
        if (c.forecast) newIntake[arriveIdx] += amt;
        else residual[arriveIdx] += amt;
      });
    });

    const forwardMonths = ["Aug", "Sep", "Oct", "Nov", "Dec"];
    const cashTable = kpiDetailTable(
      ["Cash arrives", "Projected cash-in", "From prior cohorts", "From new intake", "Notes"],
      forwardMonths.map(m => {
        const i = monthIndex[m];
        const total = Math.round(cash[i]);
        const fromPrior = Math.round(residual[i]);
        const fromNew = Math.round(newIntake[i]);
        return [
          m,
          fmtMoney(total),
          fmtMoney(fromPrior),
          fmtMoney(fromNew),
          fromNew
            ? "Prior payment tails + financed new cases"
            : "Payment-plan tails from Jan–Jul* only"
        ];
      })
    );

    const cohortTable = kpiDetailTable(
      ["Signing month", "New cases", "Billed", "Collectible (80%)", "Status"],
      cohorts.slice().reverse().map(c => [
        c.month,
        String(c.cases),
        fmtMoney(Math.round(c.cases * feeUsed)),
        fmtMoney(Math.round(c.cases * collectibleUsed)),
        c.forecast ? "Forecast cases" : "Actual"
      ]).concat([[
        "Jan–Jul* total",
        "139",
        fmtMoney(Math.round(139 * feeUsed)),
        fmtMoney(Math.round(139 * collectibleUsed)),
        "Actual through 2026-07-23"
      ]])
    );

    const h1AvgCases = 19;
    const recentAvgCases = 24;
    const junCases = 36;
    const runRateTable = kpiDetailTable(
      ["Steady-state intake", "Monthly cash-in"],
      [
        [`Jun run-rate (${junCases}/mo)`, fmtMoney(Math.round(junCases * collectibleUsed))],
        [`Recent avg (${recentAvgCases}/mo)`, fmtMoney(Math.round(recentAvgCases * collectibleUsed))],
        [`H1 avg (${h1AvgCases}/mo)`, fmtMoney(Math.round(h1AvgCases * collectibleUsed))]
      ]
    );

    const mixLine = practiceMix.slice(0, 4).map(p =>
      `${escapeHtml(String(p.name).replace(" / Sex Offense", ""))} ${Math.round((p.n / practiceN) * 100)}% @ ${fmtMoney(p.mean)}`
    ).join(" · ");

    return `${cashTable}
      <p class="data-inline-note"><strong>Model:</strong> historical + forecast cases/month × practice-weighted mean fee (${fmtMoney(feeUsed)}) × 80% collectible × financed payment plan 40/20/15/10/7/5/3% over months 0–6.</p>
      <p class="data-formula-line">Collectible/case = ${fmtMoney(feeUsed)} × 0.80 = ${fmtMoney(Math.round(collectibleUsed))}</p>
      <p class="data-formula-line">Practice mix (fee sample n=${practiceN}): ${mixLine}</p>
      <p class="data-formula-line">Cash in month M = Σ (cases signed in M−lag × collectible/case × plan share[lag]) for lag 0–6</p>
      <h3 class="kpi-subtable-title">2026 cohorts</h3>
      ${cohortTable}
      <h3 class="kpi-subtable-title">Steady-state run rates</h3>
      ${runRateTable}
      <p class="data-warning-note"><strong>Research note:</strong> Jul–Dec adds forecast intake on top of payment tails from Jan–Jun. Pre-2026 collections are excluded. Fee sample is quoted means, not QuickBooks cash — reforecast when July MyCase + collections land.</p>
      <p class="data-inline-note">Source basis: MyCase cases-by-month · fee-by-practice means · financed payment curve (Ad Reports cash-from-cases model).</p>`;
  }

  /** Known A/R subset with payment_amount — MyCase Contact_07-25-2026 · assumed monthly. */
  function knownPaymentArPanelHtml() {
    const knownBal = 160700;
    const paySum = 48617;
    const cycle1 = 47617;
    const unknownBal = 140374;
    const arTotal = 301074;
    const payoff = [
      { c: 0, rem: 160700, cash: 0, cum: 0 },
      { c: 1, rem: 113083, cash: 47617, cum: 47617 },
      { c: 2, rem: 73967, cash: 39117, cum: 86733 },
      { c: 3, rem: 43500, cash: 30467, cum: 117200 },
      { c: 4, rem: 24000, cash: 19500, cum: 136700 },
      { c: 5, rem: 16000, cash: 8000, cum: 144700 },
      { c: 6, rem: 9500, cash: 6500, cum: 151200 },
      { c: 7, rem: 4750, cash: 4750, cum: 155950 },
      { c: 8, rem: 1000, cash: 3750, cum: 159700 },
      { c: 9, rem: 250, cash: 750, cum: 160450 },
      { c: 10, rem: 0, cash: 250, cum: 160700 }
    ];
    const byCycles = [
      [1, 3, 7000],
      [2, 4, 12000],
      [3, 7, 24700],
      [4, 6, 47000],
      [5, 2, 21500],
      [6, 1, 9000],
      [7, 2, 8500],
      [8, 2, 24000],
      [10, 1, 7000]
    ];
    const payoffTable = kpiDetailTable(
      ["Cycle", "Cash this cycle", "Cumulative", "Remaining", "% known $ in"],
      payoff.map(r => [
        String(r.c),
        fmtMoney(r.cash),
        fmtMoney(r.cum),
        fmtMoney(r.rem),
        `${Math.round((r.cum / knownBal) * 100)}%`
      ])
    );
    const cycleTable = kpiDetailTable(
      ["Cycles to payoff", "Accounts", "Balance"],
      byCycles.map(([c, n, bal]) => [String(c), String(n), fmtMoney(bal)])
    );
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Known A/R balance</h3><p class="kpi-mini-value">${fmtMoney(knownBal)}</p></div>
        <div class="kpi-mini-card"><h3>Cycle-1 expected cash</h3><p class="kpi-mini-value">${fmtMoney(cycle1)}</p></div>
        <div class="kpi-mini-card"><h3>Median cycles</h3><p class="kpi-mini-value">3.5</p></div>
        <div class="kpi-mini-card"><h3>Unknown A/R (no plan)</h3><p class="kpi-mini-value">${fmtMoney(unknownBal)}</p></div>
      </div>
      <p class="data-inline-note"><strong>Definition:</strong> 28 of 67 positive A/R rows (${fmtMoney(knownBal)} / ${fmtMoney(arTotal)} = 53%) have <code>payment_amount</code>. Cycles = ceil(balance ÷ payment_amount). Cadence assumed monthly — not in export.</p>
      <p class="data-formula-line">Sum of payment_amount = ${fmtMoney(paySum)} · Cycle-1 cash = Σ min(payment, remaining) = ${fmtMoney(cycle1)} · Aggregate balance ÷ payments = 3.31 cycles</p>
      <p class="data-formula-line">Milestones (from 2026-07-25): 50% known $ by cycle 2 (~Sep) · 75% by cycle 4 (~Nov) · 90% by cycle 5 (~Dec) · tail through cycle 10 (~May 2027)</p>
      <h3 class="kpi-subtable-title">Accounts by cycles to payoff</h3>
      ${cycleTable}
      <h3 class="kpi-subtable-title">Assumed monthly runoff · known subset</h3>
      ${payoffTable}
      <p class="data-warning-note"><strong>Do not treat as firm cash:</strong> Unknown ${fmtMoney(unknownBal)} has no installment. Contact A/R ≠ QuickBooks collections. Cross-check ledger Credits before booking runoff as collected.</p>
      <p class="data-inline-note">Source: mycase/as-of-2026-07-25/Contact_07-25-2026.csv · ar-known-payment-cycles.csv · last updated 2026-07-25 · canvas: mycase-close-and-payment-estimate</p>`;
  }

  function predictionsPageHtml() {
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">Predictions</h2>
        <p class="data-page-sub">Rest-of-year case forecast · $80k/mo expense pace · intake cash · known A/R payment cycles</p>
      </div>
    </header>
    <div class="data-grid">
      ${dataCardHtml(
        "Headline",
        "Collectible cash from 2026 case intake — not total firm cash.",
        `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem">
          <div class="kpi-mini-card"><h3>Collectible / case</h3><p class="kpi-mini-value">$4,470</p></div>
          <div class="kpi-mini-card"><h3>Jan–Jun collectible</h3><p class="kpi-mini-value">$509,534</p></div>
          <div class="kpi-mini-card"><h3>Jun steady-state</h3><p class="kpi-mini-value">~$152k/mo</p></div>
        </div>`,
        { full: true, id: "prediction-headline" }
      )}
      ${dataCardHtml(
        "Recommendation · expense pace vs 2026 forecast",
        "Quoted volume is ahead of mid-year pace, but $80k/mo expenses still outrun the full-year collectible forecast.",
        expensePaceRecommendationHtml(),
        { full: true, id: "prediction-expense-pace" }
      )}
      ${dataCardHtml(
        "2026 cases · actual + rest-of-year forecast",
        "Current month first · forecast bars are lighter and transparent.",
        caseForecastPanelHtml(),
        { full: true, id: "prediction-case-forecast" }
      )}
      ${dataCardHtml(
        "Projected cash-in by month",
        "Next months estimated from case volume, practice-weighted fees, and financed payment plans.",
        cashProjectionPanelHtml(),
        { full: true, id: "prediction-cash-by-month" }
      )}
      ${dataCardHtml(
        "Known A/R payment-plan subset",
        "MyCase contacts with payment_amount · assumed monthly cycles · last updated 2026-07-25.",
        knownPaymentArPanelHtml(),
        { full: true, id: "prediction-known-ar-pay" }
      )}
    </div>`;
  }

  function renderPredictions(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = predictionsPageHtml();
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "predictions");
  }

  /** June LSA → digital reallocation recommendations (media + management retainer). */
  function junPaidChannelRecs() {
    const jun = (DATA.casesLeadsSpend || []).find(r => r.month === "Jun");
    if (!jun || !jun.leads || !jun.adsLeads) return null;
    const mgmt = DATA.digitalMgmtMonthly || 2900;
    const lsaCpl = jun.lsaSpend / jun.leads;
    const digCpl = jun.adsSpend / jun.adsLeads;
    const digAllIn = (jun.adsSpend + mgmt) / jun.adsLeads;
    const breakEvenCalls = mgmt / (lsaCpl - digCpl);
    const breakEvenMedia = breakEvenCalls * digCpl;
    const minDivert = mgmt + breakEvenMedia;
    const closeMultiple = lsaCpl / digAllIn;
    const paidCalls = jun.leads + jun.adsLeads;
    const paidSpend = jun.lsaSpend + jun.adsSpend;
    const digEff = jun.adsLeads / paidCalls / (jun.adsSpend / paidSpend);
    const lsaEff = jun.leads / paidCalls / (jun.lsaSpend / paidSpend);
    const divertRows = [mgmt, Math.round(minDivert), 5000, 8000, 10000, mgmt + jun.adsSpend].map(total => {
      const toMgmt = Math.min(mgmt, total);
      const toMedia = Math.max(0, total - mgmt);
      const calls = toMedia > 0 ? toMedia / digCpl : 0;
      const allIn = calls > 0 ? (toMedia + mgmt) / calls : null;
      let decision = "Consulting only — no media";
      if (allIn != null) {
        const d = lsaCpl - allIn;
        if (Math.abs(d) < 1) decision = "Cost break-even vs LSA";
        else if (d > 0) decision = `Digital cheaper by ${fmtMoney(d)}/call`;
        else decision = `LSA cheaper by ${fmtMoney(-d)}/call`;
      }
      return {
        total,
        toMgmt,
        toMedia,
        mgmtPct: Math.round((toMgmt / total) * 100),
        mediaPct: Math.round((toMedia / total) * 100),
        calls,
        allIn,
        decision
      };
    });
    return {
      jun,
      mgmt,
      lsaCpl,
      digCpl,
      digAllIn,
      breakEvenCalls,
      breakEvenMedia,
      minDivert,
      closeMultiple,
      digEff,
      lsaEff,
      divertRows,
      digAtLsaCost: jun.adsLeads * lsaCpl,
      digAdvantage: jun.adsLeads * lsaCpl - jun.adsSpend,
      digAllInAdvantage: jun.adsLeads * lsaCpl - (jun.adsSpend + mgmt)
    };
  }

  function recCallout(kind, label, statusLabel, html) {
    return `<aside class="rec-callout rec-callout-${escapeHtml(kind)}" aria-label="${escapeHtml(statusLabel)}">
      <span class="rec-callout-status">${escapeHtml(statusLabel)}</span>
      <span class="rec-callout-label">${escapeHtml(label)}</span>
      <div class="rec-callout-body">${html}</div>
    </aside>`;
  }

  function recSolutionsHtml(html) {
    return `<section class="kpi-related-projects rec-solutions" aria-label="Solutions">
      <strong class="kpi-related-projects-title">Solutions</strong>
      <div class="rec-solutions-body">${html}</div>
    </section>`;
  }

  function recProofHtml(summary, bodyHtml) {
    return `<details class="rec-proof"><summary>${escapeHtml(summary)}</summary><div class="rec-proof-body">${bodyHtml}</div></details>`;
  }

  function recStatTile(label, value, context) {
    return `<div class="rec-stat-tile">
      <span class="rec-stat-label">${escapeHtml(label)}</span>
      <span class="rec-stat-value">${value}</span>
      ${context ? `<span class="rec-stat-context">${escapeHtml(context)}</span>` : ""}
    </div>`;
  }

  function recSectionHtml(id, title, hint, bodyHtml) {
    return `<section class="kpi-section kpi-section-static rec-section" id="${escapeHtml(id)}">
      ${kpiSectionStaticHead(title, hint)}
      <div class="kpi-section-body rec-section-body">${bodyHtml}</div>
    </section>`;
  }

  function recStatusKind(statusLabel) {
    const s = String(statusLabel || "").toLowerCase();
    if (s.includes("action") || s.includes("required") || s.includes("negative")) return "negative";
    if (s.includes("on track") || s.includes("verified") || s.includes("positive")) return "positive";
    return "watch";
  }

  function recFillTokens(text, tokens) {
    return String(text || "").replace(/\{\{(\w+)\}\}/g, (_, key) => (
      Object.prototype.hasOwnProperty.call(tokens, key) ? String(tokens[key]) : `{{${key}}}`
    ));
  }

  function recInlineMd(text, tokens) {
    let s = escapeHtml(recFillTokens(text, tokens));
    s = s.replace(/\[([^\]]+)\]\(project:([A-Za-z0-9_-]+)\)/g, (_, label, id) =>
      `<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="${escapeHtml(id)}">${label}</a>`
    );
    s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
    s = s.replace(/\*([^*]+)\*/g, "$1");
    return s;
  }

  function recSexCrimesChartHtml() {
    return `<div class="kpi-chart-card rec-chart">
      <div class="kpi-chart-head"><strong>Case recovery path</strong><div class="kpi-chart-subtitle">YTD · current pace · recovery target</div></div>
      <div class="kpi-chart-plot">${barWithTargetChart(
        [
          { label: "YTD", value: 5 },
          { label: "Pace", value: 10 },
          { label: "Recovery", value: 13 }
        ],
        {
          target: 13,
          lowerIsBetter: false,
          compact: false,
          width: 640,
          height: 220,
          format: "count",
          ariaLabel: "Sex Crimes Defense cases: 5 year to date, 10 at current full-year pace, and 13 under the recovery plan"
        }
      )}</div>
    </div>`;
  }

  function recYelpAugustChartHtml() {
    const baseline = 6;
    const goal = 20;
    return `<div class="kpi-chart-card rec-chart">
      <div class="kpi-chart-head"><strong>Yelp — August referral target</strong><div class="kpi-chart-subtitle">Baseline last-30 leads · Aug channel goal</div></div>
      <div class="kpi-chart-plot">${barWithTargetChart(
        [
          { label: "Baseline", value: baseline },
          { label: "Aug MTD", value: 0, vsTarget: false, color: "#6a5acd" }
        ],
        {
          target: goal,
          lowerIsBetter: false,
          compact: false,
          width: 640,
          height: 220,
          format: "count",
          targetLabel: String(goal),
          ariaLabel: `Yelp baseline ${baseline} leads per 30 days vs August goal ${goal} channel referrals`
        }
      )}</div>
    </div>`;
  }

  function recLsaVsDigitalChartHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return `<div class="rec-chart">${chartBlock({
      title: "LSA vs digital cost trend",
      subtitle: "$/call by month · media only",
      chart: lsaVsDigitalCostTrendChart(rows),
      legend: lsaVsDigitalCostTrendLegend()
    })}${lsaVsDigitalCostTrendNote(rows)}</div>`;
  }

  function recommendationsPageHtml() {
    const r = junPaidChannelRecs();
    if (!r) {
      return `<header class="data-page-head"><div><h2 class="data-page-title">Recommendations</h2></div></header>
        <p class="data-inline-note">Need a complete June LSA + digital month to build recommendations.</p>`;
    }
    const content = window.RECOMMENDATIONS_CONTENT;
    if (!content || !Array.isArray(content.recs) || !content.recs.length) {
      return `<header class="data-page-head"><div><h2 class="data-page-title">Recommendations</h2></div></header>
        <p class="data-inline-note">Missing recommendations content. Edit <code>content/recommendations.md</code> and run <code>npm run build</code>.</p>`;
    }
    const tokens = {
      lsaCpl: fmtMoney(r.lsaCpl),
      digCpl: fmtMoney(r.digCpl),
      digAllIn: fmtMoney(r.digAllIn),
      minDivert: fmtMoney(r.minDivert),
      mgmt: fmtMoney(r.mgmt),
      breakEvenMedia: fmtMoney(r.breakEvenMedia),
      closeMultiple: r.closeMultiple.toFixed(2),
      junLsaSpend: fmtMoney(r.jun.lsaSpend),
      junLeads: String(r.jun.leads),
      junAdsSpend: fmtMoney(r.jun.adsSpend),
      junAdsLeads: String(r.jun.adsLeads)
    };
    const divertRows = r.divertRows.map(row => [
      fmtMoney(row.total),
      fmtMoney(row.toMgmt),
      fmtMoney(row.toMedia),
      `${row.mgmtPct}%`,
      `${row.mediaPct}%`,
      row.allIn != null ? fmtMoney(row.allIn) : "—",
      escapeHtml(row.decision)
    ]);
    const page = content.page || {};
    const jump = (content.jump || []).map(item => {
      const rankHtml = item.rank
        ? `<span class="rec-rank">${escapeHtml(item.rank)}</span> `
        : "";
      return `<a class="rec-jump-link" href="#${escapeHtml(item.anchor)}">${rankHtml}${escapeHtml(item.label)}</a>`;
    }).join("");
    const sections = content.recs.map(rec => {
      const bodyType = rec.bodyType || "";
      if (bodyType === "projects-table") {
        const rows = (rec.projects || []).map(row => [
          recInlineMd(row.project, tokens),
          escapeHtml(recFillTokens(row.priority, tokens)),
          escapeHtml(recFillTokens(row.fee, tokens)),
          escapeHtml(recFillTokens(row.role, tokens)),
          escapeHtml(recFillTokens(row.gate, tokens))
        ]);
        return recSectionHtml(
          rec.id,
          recFillTokens(rec.title, tokens),
          recFillTokens(rec.hint, tokens),
          kpiDetailTable(["Project", "Score / status", "Fee", "Role", "Success gate"], rows)
        );
      }
      if (bodyType === "actions-list") {
        const items = (rec.actions || []).map(item =>
          `<li>${recInlineMd(item, tokens)}</li>`
        ).join("");
        return recSectionHtml(
          rec.id,
          recFillTokens(rec.title, tokens),
          recFillTokens(rec.hint, tokens),
          `<ol class="rec-actions kpi-action-list">${items}</ol>`
        );
      }
      const stats = rec.stats || [];
      const statsHtml = stats.length
        ? `<div class="rec-stat-grid" data-cols="${Math.min(4, Math.max(2, stats.length))}">${stats.map(s =>
            recStatTile(
              recFillTokens(s.label, tokens),
              escapeHtml(recFillTokens(s.value, tokens)),
              recFillTokens(s.context, tokens)
            )
          ).join("")}</div>`
        : "";
      const chartHtml = (rec.chart === "yelp-august" || rec.id === "recommendation-yelp")
        ? recYelpAugustChartHtml()
        : (rec.chart === "cases-recovery" || rec.id === "recommendation-sex-crimes")
        ? recSexCrimesChartHtml()
        : (rec.chart === "lsa-vs-digital" || rec.id === "recommendation-divert" || rec.id === "recommendation-primary")
          ? recLsaVsDigitalChartHtml()
          : "";
      const whyKind = recStatusKind(rec.whyStatus);
      const whyHtml = rec.why
        ? recCallout(whyKind, "Why", rec.whyStatus || "Watch", `<p>${recInlineMd(rec.why, tokens)}</p>`)
        : "";
      const solutionsHtml = rec.solutions
        ? recSolutionsHtml(`<p>${recInlineMd(rec.solutions, tokens)}</p>`)
        : "";
      let proofBody = "";
      if (rec.proofType === "divert-table") {
        proofBody = kpiDetailTable(
          ["Divert from LSA", "→ Consulting", "→ Digital ads", "Consulting %", "Media %", "All-in $/call", "Decision"],
          divertRows
        );
      } else if ((rec.proof || []).length) {
        proofBody = rec.proof.map(line => {
          const filled = recInlineMd(line, tokens);
          const cls = /savings windows|do not double-count/i.test(line)
            ? "data-inline-note"
            : "data-formula-line";
          return `<p class="${cls}">${filled}</p>`;
        }).join("");
      }
      const proofHtml = proofBody
        ? recProofHtml(rec.proofTitle || "Proof", proofBody)
        : "";
      return recSectionHtml(
        rec.id,
        recFillTokens(rec.title, tokens),
        recFillTokens(rec.hint, tokens),
        `${statsHtml}${chartHtml}${whyHtml}${solutionsHtml}${proofHtml}`
      );
    }).join("");
    const alertText = String(page.alert || "").trim();
    const alertHtml = alertText
      ? `<aside class="rec-callout rec-callout-${recStatusKind(page.alertStatus)} rec-page-alert" aria-label="${escapeHtml(page.alertStatus || "Action required")}">
      <span class="rec-callout-status">${escapeHtml(page.alertStatus || "Action required")}</span>
      <span class="rec-callout-label">${escapeHtml(page.alertLabel || "Alert")}</span>
      <div class="rec-callout-body"><p>${recInlineMd(alertText, tokens)}</p></div>
    </aside>`
      : "";
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">${escapeHtml(page.title || "Recommendations")}</h2>
        <p class="data-page-sub">${escapeHtml(page.subtitle || "")}</p>
      </div>
    </header>
    ${alertHtml}
    <nav class="rec-jump" aria-label="Jump to recommendation">${jump}</nav>
    <div class="rec-stack">${sections}</div>`;
  }

  function renderRecommendations(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = recommendationsPageHtml();
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "recommendations");
  }

  /** @deprecated Dashboards tab removed — content is in renderKpis(). Kept for callers. */
  function renderDashboards(el) {
    if (!el) return;
    el.innerHTML = "";
    delete el.dataset.rendered;
    dispatchRendered(el, "dashboards");
  }

  function dispatchRendered(el, kind) {
    syncDataAsOfStamp();
    window.dispatchEvent(new CustomEvent("kpi-report-rendered", { detail: { root: el, kind } }));
  }

  function renderAll(kpisEl) {
    if (kpisEl) renderKpis(kpisEl);
    window.dispatchEvent(new CustomEvent("kpi-report-ready"));
  }

  function bindKpiInteractions(root) {
    root.querySelectorAll(".kpi-stat-card[data-kpi-focus], .kpi-goal-card[data-kpi-focus]").forEach(btn => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".kpi-stat-card, .kpi-goal-card").forEach(c => c.classList.remove("kpi-stat-active"));
        btn.classList.add("kpi-stat-active");
      });
    });
  }

  function bindDashboardInteractions(root) {
    root.querySelectorAll(".kpi-expand-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.expand;
        const panel = root.querySelector(`.kpi-expand-panel[data-panel="${key}"]`);
        if (!panel) return;
        const open = panel.hidden;
        panel.hidden = !open;
        btn.textContent = open ? "Hide table" : "Show table";
      });
    });
  }

  function focusKpi(kpiId) {
    const id = kpiId && String(kpiId).startsWith("#") ? kpiId : `#${String(kpiId || "").replace(/\D/g, "").padStart(2, "0")}`;
    const root = document.getElementById("kpi-report-kpis");
    if (!root) return false;
    const btn = root.querySelector(`[data-kpi-focus="${id}"]`);
    if (!btn) return false;
    const section = btn.closest("details");
    if (section) section.open = true;
    if (btn.classList.contains("kpi-stat-card") || btn.classList.contains("kpi-goal-card")) btn.click();
    btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    btn.classList.add("kpi-stat-active");
    setTimeout(() => btn.classList.remove("kpi-stat-active"), 2400);
    return true;
  }

  window.KPI_REPORT = {
    renderKpis,
    renderData,
    renderImpact,
    renderPredictions,
    renderRecommendations,
    renderDashboards,
    renderAll,
    focusKpi,
    getHelp: getKpiHelp,
    getData: () => ({ ...DATA }),
    relatedProjectsForKpi(kpiId) {
      const raw = String(kpiId || "").trim();
      if (!raw) return [];
      const ids = KPI_RELATED_PROJECTS[raw] || KPI_RELATED_PROJECTS[`#${raw.replace(/^#/, "")}`] || [];
      return ids.filter(id => !String(id).startsWith("REC:"));
    },
    kpiLabel(kpiId) {
      const help = getKpiHelp(kpiId);
      if (help && help.title) return String(help.title).replace(/^#\S+\s+/, "").trim();
      return String(kpiId || "");
    },
    /** Parked panels for other dashboard views */
    parked: {
      leadsByCampaignPanelHtml,
      totalReferralNetworkPanelHtml,
      sourceMixPanelHtml
    },
    refresh() {
      document.querySelectorAll("[data-rendered]").forEach(el => {
        delete el.dataset.rendered;
        el.innerHTML = "";
      });
    }
  };
})();
