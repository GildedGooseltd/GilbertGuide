/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis
 * (former Dashboards charts live at the bottom of the KPIs tab).
 */
(function () {
  const RENDER_VER = "20260719-cases-solutions-off-r1";
  /** Export-backed source footnotes — file path + fields for quick re-pull. */
  const KPI_SOURCES = {
    "#01": {
      file: "Call-details_as-of-2026-07-11 · LSA leads-inbox (15) · hubspot-form-submissions-*-2026-07-16",
      fields: "Search + LSA + HubSpot forms (intake + shorty + postcard) · Jun total 226"
    },
    "#02": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-01/new-cases-by-month.csv",
      fields: "MyCase Created month · Jun 2026 = 34 · Jan–Jun 2026 = 114"
    },
    "#07": {
      file: "LSA leads-inbox (15) · Google Ads Call details · Google account_activities Jun–Jul 2026",
      fields: "LSA media and responses compared with digital media and calls · Jul* partial through Jul 16"
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
      file: "Campaign report (17) Jun 11 – Jul 10 with Phone calls",
      fields: "Cost ÷ Phone calls → $6,277 / 122 = $51 avg"
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
      file: "Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv",
      fields: "Contact group=Client · Pre-Trial Flat Fee / flat / trial / retainer (mean $5,587 · n=142) · see CLIENT-VALUE-BASELINE.md"
    },
    "#29": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-01/contact_report_task_export.csv",
      fields: "Client + fee · n≥5 · Case Type else Cases (practice area) · mean fee by practice · CLIENT-VALUE-BASELINE.md"
    },
    "cases-leads-spend": {
      file: "MyCase new-cases-by-month · LSA leads-inbox (15) · Google Ads Call details · HubSpot form submits · Google account_activities Jan–Jul 2026",
      fields: "New cases · LSA calls · Digital ad calls · Website forms · media spend · June LSA vs digital cost trade-off (media only; HubSpot $1k from Jun)"
    },
    "cash-collected": {
      file: "~/Downloads/ledger_account_activity_report.csv",
      fields: "Ledger Credit by month · full CY 2025 (Jan–Dec) + 2026 YTD through Jul 15"
    },
    "financial": {
      file: "ledger_account_activity_report.csv (2025-01-03→2026-07-15) · new-cases-by-month.csv as-of-2026-07-01 · CLIENT-VALUE-BASELINE mean fee · $80k/mo expense assumption",
      fields: "Cash credits and MyCase new cases by month · expense-pace checkpoint (quoted / collectible vs mid-year + full-year) · Jul 2026 cases not yet available"
    }
  };

  const KPI_HELP = {
    "#01": {
      title: "#01 Total leads",
      desc: "Total lead count from Search call details + LSA inbox + all HubSpot forms (intake, shorty, and postcard).",
      formula: "Search + LSA + HubSpot form submissions. Jun = 138 + 83 + 5 = 226. Target ≥ prior month × 1.2 (20% MoM growth)."
    },
    "#02": {
      title: "#02 New cases",
      desc: "New MyCase Client contacts created in the month (Created date). Target is a monthly case goal.",
      formula: "Count of Client contacts with Created date in month. Jun 2026 = 34 · target 50."
    },
    "#07": {
      title: "#07 Spend Waste",
      desc: "Modeled excess LSA media cost versus producing the same response volume at digital Search’s observed cost per response.",
      formula: "LSA spend − (LSA responses × digital cost per response). Jun: $13,206 − (83 × $60.12) = $8,216 waste. Jul*: $7,163 − (57 × $64.19) = $3,504. Total = −$11,720. Modeled responses missed at the digital rate: 191. Period: Jun–Jul 2026; Jul is partial through Jul 16."
    },
    "#12": {
      title: "#12 Avg. Cost per Call",
      desc: "Digital Search only — Campaign report cost divided by phone calls. Not LSA. NTGUILT → DUI ad group runs $4.86 / interaction (Jun 11–Jul 10) — expand via A2; insurance cards via B5.",
      formula: "Campaign Cost ÷ Phone calls → $6,277 ÷ 122 = $51. Target < $100. Ad-group efficiency: NTGUILT → DUI $1,064 ÷ 219 interactions = $4.86."
    },
    "#19": {
      title: "#19 Missed Opportunity",
      desc: "Estimated monthly potential revenue not earned from unanswered Search calls. Directional for phone priority — not booked revenue.",
      formula: "Missed Search calls × 7.3% lead→case × avg case value ($5,587) → 38 × 7.3% × $5,587 = $15,498/mo."
    },
    "#21": {
      title: "#21 Answered Calls",
      desc: "Share of Search call details that were answered (Received) vs missed.",
      formula: "Answered ÷ (Answered + Missed) → 100 ÷ 138 = 72%. Target ≥ 90%."
    },
    "#03": {
      title: "#03 DUIs Signed",
      desc: "YTD DUI/DWAI signed matters toward the annual goal (practice area). Pace % = signed ÷ 50. Ahead/behind compares signed vs a straight-line target for how much of the year has elapsed. Active paid DUI efficiency: NTGUILT → DUI ad group at $4.86 / interaction (Jun 11–Jul 10) — expand via A2; insurance card mailer is B5.",
      formula:
        "Client contacts Created in goal year with Cases (practice area) DUI/DWAI/Alcohol — (DUI/DWI) tag or DUI-named Criminal Defense — ÷ annual target (50). Schedule = signed − (50 × days elapsed ÷ days in year)."
    },
    "#16": {
      title: "#16 Reviews by channel",
      desc: "Public review ratings and counts by directory. Full profile audit runs under Project Guide B10.",
      formula: null
    },
    "#17": {
      title: "#17 Referral Network",
      desc: "Referral channel counts — not wired yet. Live plan is Project Guide A4 Client Referral Program.",
      formula: null
    },
    "cases-leads-spend": {
      title: "#05 Cases, Leads & Spend",
      desc: "Monthly cases and response volume on the left axis, with marketing spend on the right axis.",
      formula: "Bars show cases and channel responses. The line shows media spend; supporting charts compare June cost per response."
    },
    "financial": {
      title: "#09 Financials",
      desc: "Cash collected and cases created by month, plus the $80k/mo expense-pace checkpoint (quoted / collectible vs mid-year and full-year targets).",
      formula: "Cash = ledger credits by month. Cases = MyCase Client contacts by Created month. Pace = mean fee × cases × 80% collectible vs $80k/mo expenses."
    }
  };

  function kpiHelpBtn(kpiId) {
    const id = String(kpiId || "");
    if (!KPI_HELP[id] && !KPI_SOURCES[id]) return "";
    return `<span class="kpi-help" role="button" tabindex="0" data-kpi-help="${escapeHtml(id)}" aria-label="About ${escapeHtml(id)}">?</span>`;
  }

  /** Card header label only — KPI id lives in lower-right ref mark. */
  function kpiCardTitle(label) {
    return `<span class="kpi-stat-id">${escapeHtml(String(label || "").replace(/^#\S+\s+/, ""))}</span>`;
  }

  /** Display numeric KPI ids without # or a leading zero. */
  function kpiDisplayNumber(kpiId) {
    const raw = String(kpiId || "").trim().replace(/^#/, "");
    return /^\d+$/.test(raw) ? String(Number(raw)) : raw;
  }

  /** Lower-right golden egg KPI reference. */
  function kpiRefMark(kpiId) {
    const id = String(kpiId || "").trim();
    if (!id || id === "#GOAL3") return "";
    return `<span class="kpi-related-project-egg kpi-ref-num" aria-hidden="true">${escapeHtml(kpiDisplayNumber(id))}</span>`;
  }

  /** Clickable project egg — Guide deep-link (replaces long data-guide-link text). */
  function projectEggLink(projectId, ariaLabel, displayText) {
    const id = String(projectId || "").trim();
    if (!id) return "";
    const label = ariaLabel || `Open ${id}`;
    const text = displayText || id;
    return `<a class="kpi-related-project-egg kpi-ref-num kpi-project-egg-link" href="#picker" data-go-view="picker" data-project-id="${escapeHtml(id)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${escapeHtml(text)}</a>`;
  }

  /** Current month first, then count down. */
  function newestFirst(rows) {
    return [...(rows || [])].reverse();
  }

  const KPI_RELATED_PROJECTS = {
    "#19": ["B2", "B11"],
    "#07": ["B9", "RETAINER"],
    "#03": ["A2", "B5"], // Add A11 back in August; add A19 back next summer.
    "#12": ["B11", "REC:budget", "RETAINER", "C1"] // REC:budget → Recommendations · LSA → digital shift
  };

  const KPI_RELATED_LINKS = {
    "REC:budget": {
      title: "Shift LSA budget → digital",
      href: "#recommendation-primary",
      view: "recommendations",
      scrollTo: "recommendation-primary"
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

  function kpiTileWithProjects(kpiId, cardHtml) {
    return `<div class="kpi-tile-with-projects">${cardHtml}${relatedProjectsHtml(kpiId)}</div>`;
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
    return {
      title: h.title,
      desc: h.desc,
      formula: h.formula || "",
      source
    };
  }

  const DATA = {
    period: "June 2026",
    asOf: "2026-07-16",
    source: "Call details + Campaign report (17) · MyCase #28 · LSA inbox (15)",
    kpis: [
      /* #01 = total lead count (Search + LSA + all HubSpot). Target = May×1.2 for ≥20% MoM. */
      { id: "#01", label: "Total leads", value: "226", target: "≥ 107", mom: "+154%", count: 226, verified: true, hit: true, alert: false, gauge: true },
      { id: "#02", label: "New cases", value: "34", target: "50", mom: "+55%", verified: true, alert: false, gauge: true, hit: false },
      { id: "#12", label: "Avg. Cost per Call", value: "$51", target: "< $100", mom: null, verified: true, hit: true, targetBar: true, lowerIsBetter: true },
      /* Team goals: #19 missed-opportunity tracker first in render, then #21, then DUI */
      { id: "#19", label: "Missed Opportunity", value: "$15,498/mo", target: "$0", mom: null, verified: true, alert: true, lostTracker: true },
      { id: "#21", label: "Answered Calls", value: "72%", target: "≥ 90%", mom: "+5%", verified: true, alert: true, gauge: true, goal: true, archived: true },
      /* archived for future iteration — restore by removing archived: true */
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false, archived: true },
      { id: "#28", label: "Avg case fee", value: "$5,587", target: "MyCase mean", mom: null, verified: true },
      { id: "#BHI", label: "Business health index", value: "71", target: "100", mom: "−3%", verified: false, alert: true, letterGrade: true, archived: true }
    ],
    channels: [
      { name: "Search calls", count: 138, prior: 39, mom: "+254%", spend: "$8,296", color: "#3a1a6e", verified: true },
      { name: "LSA inbox", count: 83, prior: 50, mom: "+66%", spend: "$13,206", color: "#1e3a8a", verified: true },
      { name: "HubSpot forms", count: 5, prior: 0, mom: "—", spend: "$0", color: "#b23a78", verified: true }
    ],
    /* Lead Channel Stack months — Jul* = MTD through export date (partial month) */
    channelMonths: [
      {
        month: "May",
        search: 39,
        lsa: 50,
        hubspot: 0,
        searchSpend: 7627,
        lsaSpend: 11006
      },
      {
        month: "Jun",
        search: 138,
        lsa: 83,
        hubspot: 5,
        searchSpend: 8296,
        lsaSpend: 13206
      },
      {
        month: "Jul*",
        search: 26,
        lsa: 57,
        hubspot: 4,
        searchSpend: 1669,
        lsaSpend: 7163,
        note: "Partial through Jul 16 · HubSpot intake + shorty + postcard"
      }
    ],
    sourceMix: [
      { name: "Paid Search", pct: 61, color: "#3a1a6e", count: 138, prior: 39, mom: "+254%" },
      { name: "LSA", pct: 37, color: "#1e3a8a", count: 83, prior: 50, mom: "+66%" },
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
    /* KPI #29 support — Client + fee means · n≥5 · see CLIENT-VALUE-BASELINE.md */
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
      { channel: "All campaigns (avg)", cost: "$51" },
      { channel: "Military", cost: "$40" },
      { channel: "Core DV", cost: "$60" },
      { channel: "NTGUILT", cost: "$128" }
    ],
    referrals: [
      { platform: "Past-client program", count: null, delta: null, status: "building", verified: false },
      { platform: "Friend / family", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Attorney cross-referral", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Yelp", count: null, delta: null, status: "not on", verified: false },
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
      return {
        current: d.current != null ? Number(d.current) : 15,
        jun: d.jun != null ? Number(d.jun) : 3,
        target: d.target != null ? Number(d.target) : 50,
        year: d.year != null ? Number(d.year) : 2026,
        title: d.title || "# DUIs Signed",
        label: d.label || "Signed",
        exportNote: d.exportNote || ""
      };
    })(),
    casesMomSeries: [
      { name: "Closed cases", color: "#64748b", verified: false },
      { name: "New cases", color: "#1e3a8a", verified: true },
      { name: "Red accounts", color: "#b23a78", verified: false }
    ],
    casesMom: [
      { month: "Apr", closed: 6, newCases: 15, redAccounts: 3 },
      { month: "May", closed: 8, newCases: 22, redAccounts: 2 },
      { month: "Jun", closed: 11, newCases: 34, redAccounts: 4 }
    ],
    pipeline: [
      { month: "Jun", closed: 11, mom: "+38%" },
      { month: "Jun", rate: "51%", retained: 14 }
    ],
    /* Dual-axis: left = counts · right = $ spend. Trust omitted — needs fees-collected. */
    casesLeadsSpend: [
      { month: "Jan", cases: 12, leads: null, spend: 0, lsaSpend: 0, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Feb", cases: 14, leads: null, spend: 3197, lsaSpend: 3197, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Mar", cases: 17, leads: null, spend: 921, lsaSpend: 921, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Apr", cases: 15, leads: null, spend: 3449, lsaSpend: 3449, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "May", cases: 22, leads: 50, spend: 18633, lsaSpend: 11006, adsSpend: 7627, adsLeads: 39, websiteLeads: null },
      { month: "Jun", cases: 34, leads: 83, spend: 21502, lsaSpend: 13206, adsSpend: 8296, adsLeads: 138, websiteLeads: 5 },
      { month: "Jul*", cases: 0, leads: 57, spend: 8832, lsaSpend: 7163, adsSpend: 1669, adsLeads: 26, websiteLeads: 4 }
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
      { month: "Jun", credit: 103485, newCases: 34 },
      { month: "Jul*", credit: 44950, newCases: null }
    ],
    cashCollectedTotals: {
      total2025: 945436,
      total2026ToDate: 532976,
      allCredits: 1478412,
      contractedMean: 5587,
      yearLabel: "2025",
      rangeNote: "Ledger Credits · CY 2025 (full) · source through 2026-07-15"
    },
    /* NEW-C / NEW-D — LSA efficiency from inbox (15) + account_activities */
    lsaEfficiency: [
      { month: "May", leads: 50, charged: 19, lsaSpend: 11006 },
      { month: "Jun", leads: 83, charged: 39, lsaSpend: 13206 },
      { month: "Jul*", leads: 57, charged: 17, lsaSpend: 7163 }
    ],
    lsaChargeRateOverall: { charged: 75, leads: 190, pct: 39.5 },
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
        asOf: "2026-07-01",
        clientsWithBalance: 223,
        totalBalance: 987622,
        meanBalance: 4429
      },
      refundCredits2025Feb: 7000
    }
  };

  function star(verified) {
    return verified
      ? '<span class="kpi-verified-mark" title="Verified — export-backed" aria-label="Verified"></span>'
      : '<span class="kpi-unverified" title="Data not acquired" aria-label="Data not acquired">✕</span>';
  }

  /** Corner badge — green checkbox when verified; ✕ when not. */
  function statusCorner(verified) {
    return verified
      ? '<span class="kpi-status-corner kpi-verified-mark" title="Verified — export-backed" aria-label="Verified"></span>'
      : '<span class="kpi-status-corner kpi-unverified" title="Data not acquired" aria-label="Data not acquired">✕</span>';
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
        hubspot: "HubSpot forms"
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
    const max = Math.max(...totals, 1);
    const w = 520;
    const h = 280;
    const pad = { l: 48, r: 24, t: 44, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(96, slot * 0.5);
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
        if (!count) return "";
        const compact = hh < 18;
        const labelX = compact ? x + barW + 7 : x + barW / 2;
        const labelY = compact ? y + Math.max(8, hh / 2 + 4) : y + hh / 2 + 4;
        const labelClass = compact
          ? "kpi-chart-segment-count-outside"
          : seg.name === "LSA inbox"
            ? "kpi-chart-segment-count-dark"
            : "kpi-chart-segment-count";
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
            <title>${escapeHtml(seg.name)}: ${count}</title>
          </rect>
          <text x="${labelX}" y="${labelY}" text-anchor="${compact ? "start" : "middle"}" class="${labelClass}">${count}</text>
        </g>`;
      }).join("");
      const stackTop = pad.t + plotH - (plotH * total) / max;
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${Math.max(14, stackTop - 11)}" text-anchor="middle" class="kpi-chart-total">${total}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${m.month}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Stacked leads by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
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
    const pad = { l: 48, r: 24, t: 44, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(88, slot * 0.48);
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
    const curr = Number(rows[rows.length - 1][key]);
    const prior = Number(rows[rows.length - 2][key]);
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
    const momPct = (curr, prior) => {
      if (prior == null || prior === 0) return "—";
      const pct = Math.round(((curr - prior) / prior) * 100);
      const label = pct > 0 ? `+${pct}%` : `${pct}%`;
      return `<span class="${momClass(label)}">${label}</span>`;
    };
    const tableRows = rows.map((r, i) => {
      const prior = i > 0 ? rows[i - 1] : null;
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
    tableRows.reverse();
    const totClosed = rows.reduce((s, r) => s + r.closed, 0);
    const totNew = rows.reduce((s, r) => s + r.newCases, 0);
    const totRed = rows.reduce((s, r) => s + r.redAccounts, 0);
    tableRows.push([
      "<strong>Total</strong>",
      `<strong>${totClosed}</strong>`,
      `<strong>${totNew}</strong>`,
      `<strong>${totRed}</strong>`,
      `<strong>${totClosed + totNew + totRed}</strong>`,
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

  function chartBlock(opts) {
    const head = opts.head ? `<div class="kpi-chart-head">${opts.head}</div>` : "";
    const legend = opts.legend || "";
    const table = opts.table || "";
    const focus = opts.focus ? ` data-kpi-focus="${opts.focus}"` : "";
    const helpId = opts.helpId || opts.focus || "";
    const help = helpId ? kpiHelpBtn(helpId) : "";
    const footnote = opts.footnote ? `<p class="kpi-chart-footnote">${escapeHtml(opts.footnote)}</p>` : "";
    const badge = typeof opts.verified === "boolean" ? statusCorner(opts.verified) : "";
    const vClass = "";
    return `<div class="kpi-chart-card${vClass}"${focus}>
      ${badge}
      ${help}
      ${head}
      <div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>
      ${footnote}
      ${table}
    </div>`;
  }

  function niceAxisMax(n) {
    const v = Math.max(Number(n) || 0, 1) * 1.12;
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const norm = v / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return nice * mag;
  }

  function axisTicks(max, count) {
    const n = Math.max(2, count || 5);
    return Array.from({ length: n }, (_, i) => Math.round((max * i) / (n - 1)));
  }

  /** Dual-axis: cases + LSA leads (left count) · marketing spend (right $). */
  function dualAxisCasesSpendChart(rows) {
    rows = newestFirst(rows);
    const w = 720;
    const h = 300;
    const pad = { l: 56, r: 64, t: 36, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const leftMax = niceAxisMax(Math.max(...rows.map(r => Math.max(r.cases || 0, r.leads || 0)), 1));
    const rightMax = niceAxisMax(Math.max(...rows.map(r => r.spend || 0), 1));
    const leftY = v => pad.t + plotH * (1 - v / leftMax);
    const rightY = v => pad.t + plotH * (1 - v / rightMax);
    const slot = plotW / rows.length;
    const colors = { cases: "#4f8a63", leads: "#1e3a8a", spend: "#6a5acd" };
    const leftTicks = axisTicks(leftMax, 5).map(t => {
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
      const casesBar = (r.cases != null && r.cases > 0)
        ? `<rect x="${cx - 36}" y="${leftY(r.cases)}" width="28" height="${pad.t + plotH - leftY(r.cases)}" rx="3" fill="${colors.cases}"/>
           <text x="${cx - 22}" y="${leftY(r.cases) - 6}" text-anchor="middle" class="kpi-chart-total">${r.cases}</text>`
        : "";
      const leadsBar = (r.leads != null && r.leads > 0)
        ? `<rect x="${cx + 8}" y="${leftY(r.leads)}" width="28" height="${pad.t + plotH - leftY(r.leads)}" rx="3" fill="${colors.leads}"/>
           <text x="${cx + 22}" y="${leftY(r.leads) - 6}" text-anchor="middle" class="kpi-chart-total">${r.leads}</text>`
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
    const spendDots = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const cy = rightY(r.spend);
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="5" fill="${colors.spend}"/>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" class="kpi-chart-total">${r.spend >= 1000 ? "$" + Math.round(r.spend / 1000) + "k" : "$" + (r.spend || 0)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cases and leads vs marketing spend dual-axis chart">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${leftTicks}${rightTicks}${bars}
      <polyline points="${spendPts}" fill="none" stroke="${colors.spend}" stroke-width="3"/>
      ${spendDots}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cases / leads</text>
      <text x="${w - 12}" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(90 ${w - 12} ${pad.t + plotH / 2})" class="kpi-chart-axis" style="fill:${colors.spend}">Spend ($)</text>
    </svg>`;
  }

  function casesLeadsSpendLegend() {
    const items = [
      { name: "New cases", color: "#4f8a63" },
      { name: "LSA calls", color: "#1e3a8a" },
      { name: "Digital ad calls", color: "#c45c26" },
      { name: "Website forms", color: "#b23a78" },
      { name: "Marketing spend", color: "#6a5acd" }
    ];
    return channelLegend(items);
  }

  function casesLeadsSpendTable(rows) {
    const newest = newestFirst(rows);
    return kpiDetailAccordion(
      "Cases · calls · spend table",
      `${newest.length} periods`,
      ["Period", "Cases", "LSA calls", "Digital ad calls", "Website forms", "LSA media", "Search media"],
      newest.map(r => {
        const dash = "—";
        return [
          escapeHtml(r.month) + " 2026",
          r.cases ? String(r.cases) : dash,
          r.leads != null ? String(r.leads) : dash,
          r.adsLeads != null ? String(r.adsLeads) : dash,
          r.websiteLeads != null ? String(r.websiteLeads) : dash,
          fmtMoney(r.lsaSpend || 0),
          fmtMoney(r.adsSpend || 0)
        ];
      })
    );
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
    const pad = { l: 54, r: 18, t: 34, b: 58 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const max = Math.max(200, ...channels.map(c => c.value));
    const axisMax = Math.ceil(max / 50) * 50;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const value = Math.round(axisMax * p);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${value}</text>
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
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="June cost per response: ${aria}">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cost per response ($)</text>
    </svg>`;
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

  function casesLeadsSpendSectionHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return `<article class="kpi-split-panel data-chart-table-panel" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Cases, Leads & Spend">
      ${statusCorner(true)}
      ${kpiHelpBtn("cases-leads-spend")}
      <div class="kpi-split-panel-body data-chart-table-grid">
        ${chartBlock({
          chart: dualAxisCasesSpendChart(rows),
          legend: casesLeadsSpendLegend(),
          footnote: "Left axis: counts · Right axis: $ spend."
        })}
        <div class="data-chart-table-side">
          ${chartBlock({
            head: `<div class="kpi-chart-title-large"><strong>June cost per response by channel</strong><div class="kpi-chart-subtitle">Media only · website = HubSpot forms fee</div></div>`,
            chart: junCostPerResponseChart(rows)
          })}
          ${chartBlock({
            head: `<div><strong>LSA vs digital cost trend</strong><div class="kpi-chart-subtitle">$/call by month · media only</div></div>`,
            chart: lsaVsDigitalCostTrendChart(rows),
            legend: lsaVsDigitalCostTrendLegend()
          })}
          ${lsaVsDigitalCostTrendNote(rows)}
          ${casesLeadsSpendTable(rows)}
          ${sourceFootnote("cases-leads-spend")}
        </div>
      </div>
      ${kpiRefMark("#05")}
    </article>`;
  }

  function cashCollectedChart(rows) {
    rows = newestFirst(rows);
    const minimum2025 = 65000;
    const target2026 = 80000;
    const current = rows.find(r => /\*/.test(r.month || ""));
    const currentPace = current
      ? {
          projected: Math.round((current.credit / 15) * 31),
          daysElapsed: 15,
          daysInMonth: 31
        }
      : null;
    const max = Math.max(...rows.map(r => r.credit), target2026, currentPace ? currentPace.projected : 0, 1);
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
    const minimumY = pad.t + plotH * (1 - minimum2025 / max);
    const targetY = pad.t + plotH * (1 - target2026 / max);
    /* Newest first: 2026 YTD on the left, 2025 on the right. */
    const dividerIndex = Math.max(0, rows.findIndex(r => Number(r.year) === 2025));
    const dividerX = pad.l + dividerIndex * slot;
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const bh = Math.max(6, (plotH * r.credit) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      /* Full bar fill from cash tier — never force current-month blue on the rect. */
      const fill = cashTierFill(r.credit) || "#5c4f45";
      const applicableTarget = Number(r.year) === 2026 ? target2026 : minimum2025;
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
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cash collected by month — 2025 through July 2026">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${firstYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2026 YTD</text>
      <text x="${secondYearCenter}" y="22" text-anchor="middle" class="kpi-chart-total">2025</text>
      <line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${h - pad.b + 10}" stroke="#7a6a58" stroke-width="2" stroke-dasharray="4 6"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${dividerX}" y2="${targetY}" stroke="#3a1a6e" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="${dividerX - 8}" y="${targetY - 8}" text-anchor="end" class="kpi-chart-total" style="fill:#3a1a6e">$80k target</text>
      <line x1="${dividerX}" y1="${minimumY}" x2="${w - pad.r}" y2="${minimumY}" stroke="#9a3f14" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="${w - pad.r - 6}" y="${minimumY - 8}" text-anchor="end" class="kpi-chart-total" style="fill:#9a3f14">$65k minimum</text>
      ${bars}
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
      const fill = missing ? "#64748b" : "var(--gg-royal-blue)";
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

  function cashCollectedPaceTile(rows) {
    const current = rows.find(r => /\*/.test(r.month || ""));
    if (!current) return "";
    const goal = 80000;
    const daysElapsed = 15;
    const daysInMonth = 31;
    const projected = Math.round((current.credit / daysElapsed) * daysInMonth);
    const historicRows = rows.filter(r => !/\*/.test(r.month || ""));
    const historicAvg = historicRows.length
      ? Math.round(historicRows.reduce((s, r) => s + r.credit, 0) / historicRows.length)
      : null;
    const scaleMax = Math.max(goal, projected, 1);
    const pacePct = Math.round((projected / goal) * 100);
    const status = projected >= goal ? "On track" : "Behind pace";
    const gauge = halfMoonGauge(projected / scaleMax, "cash-current-pace", {
      celebrate: projected >= goal,
      valueLabel: `$${Math.round(projected / 1000)}k`,
      endLabel: `$${Math.round(scaleMax / 1000)}k`,
      goalMark: goal / scaleMax
    });
    return `<div class="kpi-cash-pace-tile" aria-label="July cash pace toward the monthly goal">
      <div class="kpi-cash-pace-copy">
        <span class="kpi-cash-pace-kicker">Current month</span>
        <h3>July cash goal pace</h3>
        <p>${escapeHtml(current.month)} collected through Jul 15, projected through Jul 31.</p>
      </div>
      <div class="kpi-cash-pace-gauge">${gauge}</div>
      <div class="kpi-cash-pace-stats">
        <div><span>Collected</span><strong>${fmtCashTier(current.credit)}</strong></div>
        <div><span>Projected</span><strong>${fmtCashTier(projected)}</strong></div>
        <div><span>Monthly goal</span><strong>${fmtMoney(goal)}</strong></div>
        <div><span>Status</span><strong>${pacePct}% · ${status}</strong></div>
        ${historicAvg ? `<div><span>Prior-month avg</span><strong>${fmtCashTier(historicAvg)}</strong></div>` : ""}
      </div>
    </div>`;
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

  function financialSectionHtml() {
    const cashRows = DATA.cashCollected || [];
    const chartRows = [
      ...cashRows.map(row => ({ ...row, year: 2025 })),
      ...(DATA.cashCollected2026Ytd || []).map(row => ({ ...row, year: 2026 }))
    ];
    if (!cashRows.length) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified" data-feedback-id="section-financial" data-feedback-label="#09 Financials">
      ${statusCorner(true)}
      ${kpiHelpBtn("financial")}
      ${kpiSectionStaticHead("Financials", "Cash collected MoM · expense-pace checkpoint · cash / new case")}
      <div class="kpi-section-body">
        ${cashCollectedPaceTile(chartRows)}
        <p class="kpi-section-intro">NEW-A cash MoM · NEW-B cases created · <strong>2025 through Jul 2026 YTD</strong>. Missing case data is slate gray.</p>
        <div class="kpi-finance-grid kpi-finance-grid-cash">
          <div class="kpi-mini-card">
            <h3>Cash Collected <span class="kpi-finance-card-subtitle">2025 - 2026</span></h3>
            ${chartBlock({
              chart: cashCollectedChart(chartRows),
              table: cashCollectedTable(cashRows)
            })}
          </div>
          <div class="kpi-mini-card">
            ${chartBlock({
              chart: casesCreatedChart(chartRows)
            })}
          </div>
        </div>
        <div class="kpi-mini-card" style="margin-top:0.85rem">
          <h3>Expense pace checkpoint · $80k / month</h3>
          <p class="kpi-section-intro">Quoted and 80% collectible value vs mid-year and full-year expense targets. Not QuickBooks cash. H1 surplus is unreliable until unknown business debt is mapped (B9).</p>
          ${expensePaceCheckpointTableHtml()}
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
      "<strong>Total</strong>",
      `<strong>${mayTotal}</strong>`,
      `<strong>${junTotal}</strong>`,
      `<strong>${junTotal - mayTotal >= 0 ? "+" : ""}${junTotal - mayTotal}</strong>`,
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
        { key: "hubspot", name: "HubSpot forms", color: "#b23a78", spendKey: null }
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
        "<strong>Total</strong>",
        ...totals.map(t => `<strong>${t}</strong>`),
        `<strong>${momChangeHtml(totalDeltaPct) || "—"}</strong>`,
        "—"
      ]);
      const currentMonth = months[0];
      const julNote = currentMonth && currentMonth.note
        ? `<p class="kpi-table-note">${escapeHtml(currentMonth.note)}</p>`
        : "";
      return kpiDetailTable(
        ["Lead type", ...monthLabels, "% vs Jun", "Jun spend"],
        rows
      ) + julNote;
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
      "<strong>Total</strong>",
      `<strong>${leadTotal}</strong>`,
      "<strong>100%</strong>",
      `<strong>${fmtMoney(revTotal)}</strong>`
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
      "<strong>Total</strong>",
      `<strong>${priorTotal}</strong>`,
      `<strong>${leadTotal}</strong>`,
      `<strong>${leadTotal - priorTotal >= 0 ? "+" : ""}${leadTotal - priorTotal}</strong>`,
      momChangeHtml(momTotalPct) || "—"
    ]);
    const note = `<p class="kpi-table-note">Est. potential client revenue = leads × ${(rate * 100).toFixed(1)}% lead→case × ${fmtMoney(fee)} avg case (#28).</p>`;
    return (
      kpiDetailTable(["Source", "Leads", "Share", "Est. potential revenue"], leadRows) +
      `<h4 class="kpi-subtable-title">Month comparison</h4>` +
      kpiDetailTable(["Source", "Prior", "Current", "Δ leads", "Change"], momRows) +
      note
    );
  }

  function campaignDetailTable(items) {
    const total = items.reduce((s, i) => s + i.count, 0);
    const rows = items.map(i => [
      `<span class="kpi-stack-swatch" style="background:${i.color}" aria-hidden="true"></span> ${escapeHtml(i.name)}`,
      String(i.count),
      total ? `${Math.round((i.count / total) * 100)}%` : "—"
    ]);
    rows.push(["<strong>Total</strong>", `<strong>${total}</strong>`, "<strong>100%</strong>"]);
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

  function duiGoalTargetBarChart() {
    const { current, target, label } = DATA.duiGoal;
    return barWithTargetChart(
      [{ label: label || "Signed", value: current }],
      {
        target,
        lowerIsBetter: false,
        format: "count",
        compact: true,
        ariaLabel: `DUIs signed ${current} vs goal ${target}`
      }
    );
  }

  /** Compare YTD signed against the straight-line target for elapsed time. */
  function duiScheduleStatus(g) {
    const year = Number(g.year) || new Date().getFullYear();
    const now = new Date();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    let frac = (now - start) / (end - start);
    frac = Math.max(0, Math.min(1, frac));
    const expected = (Number(g.target) || 0) * frac;
    const delta = (Number(g.current) || 0) - expected;
    const expectedRounded = Math.round(expected);
    const gap = Math.round(Math.abs(delta));
    if (delta >= 0) {
      return {
        cls: "kpi-mom-up",
        arrow: "↑",
        label: `Ahead ${gap}`,
        detail: `${Math.round(frac * 100)}% of year elapsed — on straight-line pace you'd have ~${expectedRounded} signed by now.`
      };
    }
    return {
      cls: "kpi-mom-down",
      arrow: "↓",
      label: `Behind ${gap}`,
      detail: `${Math.round(frac * 100)}% of year elapsed — straight-line pace is ~${expectedRounded} signed by now.`
    };
  }

  function teamDuiGoalCardHtml() {
    const g = DATA.duiGoal;
    const pct = g.current / g.target;
    const hit = pct >= 1;
    const pace = Math.round((g.current / (g.target || 1)) * 100);
    const sched = duiScheduleStatus(g);
    const paceCell = `${pace}% <span class="kpi-mom-change ${sched.cls}" title="${escapeHtml(sched.detail)}">${sched.arrow} ${escapeHtml(sched.label)}</span>`;
    return `<button type="button" class="kpi-goal-card kpi-stat-target-bar" data-kpi-focus="#03">
      ${statusCorner(true)}
      ${kpiHelpBtn("#03")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle((g.title || "DUIs Signed").replace(/^#\s*/, "") + (g.year ? ` ${g.year}` : ""))}
        ${duiGoalTargetBarChart()}
      </div>
      ${goalTrackRows([
        ["YTD", String(g.current) + " / " + String(g.target)],
        ["Pace", paceCell],
        ["NTGUILT → DUI", "$4.86 / interaction"]
      ])}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      <p class="kpi-table-note" style="margin:0.2rem 0 0;text-align:left">Counted from Cases (practice area) · (DUI/DWI) tag or DUI-named Criminal Defense</p>
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
    return `<p class="kpi-legend kpi-legend-top"><span class="kpi-verified-mark kpi-verified-mark-inline" title="Verified"></span> = verified (export-backed) &nbsp; <span class="kpi-unverified">✕</span> = data not acquired</p>`;
  }

  function reportHeader() {
    return `<header class="kpi-report-head">
      <div>
        <h2 class="kpi-report-title">Pav Law KPI Report</h2>
      </div>
    </header>
    ${reportKey()}`;
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
    const valueLabel = isPct
      ? `${Math.round(current)}%`
      : String(Math.round(current));
    const endLabel = isPct
      ? `${Math.round(scaleMax)}%`
      : String(Math.round(scaleMax));
    return {
      pct: current / scaleMax,
      endLabel,
      goalMark: target / scaleMax,
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
   * items: [{ label, value }] — value numeric or "$72" string.
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
      actual: parseMetricNum(it.value != null ? it.value : it.cost)
    })).filter(b => b.label);
    if (!bars.length || !Number.isFinite(target)) return "";

    const maxVal = Math.max(...bars.map(b => b.actual), target, 1) * 1.15;
    const w = opts.width || (compact ? 268 : 420);
    const h = opts.height || (compact ? 118 : 200);
    /* Left pad must fit full money labels ($120). Too-tight pad clipped to “20”. */
    const pad = compact
      ? { l: 46, r: 14, t: 14, b: 30 }
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
      const fill = hit ? TARGET_BAR_COLORS.hit : TARGET_BAR_COLORS.miss;
      const textFill = "#ffffff";
      const valLabel = fmt(b.actual);
      const shortLabel = b.label.length > 10 ? b.label.replace(/\s.*/, "") : b.label;
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
    const overall = DATA.costPerCall.find(c => /^All campaigns/i.test(c.channel));
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
      [{ label: "Missed", value: p.missedPct }],
      {
        target: p.missedTargetPct,
        lowerIsBetter: true,
        format: "percent",
        compact: true,
        ariaLabel: `Missed calls ${p.missedPct}% vs goal ≤ ${p.missedTargetPct}%`
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
    const delta = model.priorMonthlyLost != null ? model.monthlyLost - model.priorMonthlyLost : null;
    let trendDelta = "";
    if (delta != null) {
      const abs = Math.abs(delta);
      const cls = delta <= 0 ? "kpi-mom-up" : "kpi-mom-down";
      const arrow = delta <= 0 ? "↓" : "↑";
      const sign = delta <= 0 ? "−" : "+";
      trendDelta = `<span class="kpi-mom-change ${cls}"><span class="kpi-mom-arrow" aria-hidden="true">${arrow}</span><span class="kpi-mom-pct">${sign}${fmtMoney(abs)}/mo</span></span>`;
    }
    return `<button type="button" class="kpi-goal-card kpi-stat-attention kpi-stat-target-bar" data-kpi-focus="#19">
      ${statusCorner(true)}
      ${kpiHelpBtn("#19")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Missed Opportunity")}
        ${missedCallsTargetBarChart(p)}
        <div class="kpi-metric-with-delta">
          <span class="kpi-stat-val kpi-val-negative">${fmtMoney(model.monthlyLost)}/mo</span>
          ${trendDelta}
        </div>
      </div>
      ${goalTrackRows([
        ["Missed Search", `${model.missedSearchCalls} · ${p.missedPct}% of ${p.monthlyCalls}`],
        ["LSA calls", `${lsaCalls} · ${lsaCharged} charged`],
        ["YTD lost", `${fmtMoney(model.cumulativeYtd)} · 64 missed`]
      ])}
      <p class="kpi-table-note" style="margin:0.2rem 0 0;text-align:left">Estimated potential revenue not earned from unanswered Search calls.</p>
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
    const periodLabel = model.periods.map(r => r.month).join(" · ");
    const benchmark = model.periods[0] || {};
    return `<button type="button" class="kpi-goal-card" data-kpi-focus="#07">
      ${statusCorner(true)}
      ${kpiHelpBtn("#07")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Spend Waste")}
        <span class="kpi-stat-val kpi-negative-value">−${fmtMoney(model.totalWaste)}</span>
      </div>
      ${goalTrackRows([
        ["Period", escapeHtml(periodLabel)],
        ["Potential responses", String(model.extraResponses)],
        ["Digital benchmark", `${fmtMoney(benchmark.digitalCostPerResponse || 0)}/response`]
      ])}
      <p class="kpi-table-note" style="margin:0.2rem 0 0;text-align:left">Modeled LSA cash spent above the observed digital Search cost per response.</p>
      ${kpiRefMark("#07")}
    </button>`;
  }

  function kpiStatCardHtml(k) {
    if (k.lostTracker) return missedRevenueTrackerHtml();
    if (k.letterGrade || k.id === "#BHI") return bhiLetterGradeCardHtml(k);
    const targetLine = k.target ? `target ${k.target}` : "";
    const vClass = verifiedClass(!!k.verified);
    const foot = k.verified ? sourceFootnote(k.id) : "";
    if (k.targetBar) {
      const targetNum = parseTargetNum(k.target);
      const hit = meetsTarget(parseMetricNum(k.value), targetNum, k.lowerIsBetter !== false);
      return `<button type="button" class="kpi-stat-card kpi-stat-target-bar${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        ${kpiCardTitle(k.label)}
        ${metricWithDeltaHtml(targetBarChartForKpi(k), k.mom)}
        <span class="kpi-stat-label">Avg ${escapeHtml(k.value)} · ${escapeHtml(targetLine)}</span>
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    if (nums) {
      const grad = "km-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || meetsTarget(nums.current, nums.target, k.lowerIsBetter === true));
      const goalLine = k.id === "#01" ? "" : targetLine;
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      return `<button type="button" class="kpi-stat-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        ${kpiCardTitle(k.label)}
        ${metricWithDeltaHtml(gauge, k.mom)}
        ${goalLine ? `<span class="kpi-stat-label">${goalLine}</span>` : ""}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    return `<button type="button" class="kpi-stat-card${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      ${kpiHelpBtn(k.id)}
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
          chart: feeByPracticeBarChart(rows),
          table,
          footnote: "Contracted / quoted fees (mostly Pre-Trial Flat Fee) — not cash collected. Fees-collected export still missing."
        })}
        ${sourceFootnote("#29")}
      </div>
      ${kpiRefMark("#29")}
    </article>`;
  }

  function forecastExpenseCoverageDialHtml() {
    const collectible = 884981;
    const expenses = 960000;
    const coverage = collectible / expenses;
    const shortfall = expenses - collectible;
    const gauge = halfMoonGauge(coverage, "forecast-expense-coverage", {
      valueLabel: `${Math.round(coverage * 100)}%`,
      endLabel: "100%",
      goalMark: 1
    });
    return `<article class="kpi-cash-pace-tile kpi-stat-card" aria-label="Full-year collectible forecast coverage of the annual expense run-rate">
      ${statusCorner(true)}
      ${kpiHelpBtn("financial")}
      <div class="kpi-cash-pace-copy">
        <span class="kpi-cash-pace-kicker">2026 forecast</span>
        <h3>Breakeven Forecast</h3>
      </div>
      <div class="kpi-cash-pace-gauge">${gauge}</div>
      <div class="kpi-cash-pace-stats">
        <div><span>Collectible forecast</span><strong>${fmtMoney(collectible)}</strong></div>
        <div><span>Annual expenses</span><strong>${fmtMoney(expenses)}</strong></div>
        <div><span>Coverage gap</span><strong class="kpi-negative-value">−${fmtMoney(shortfall)}</strong></div>
      </div>
      ${kpiRefMark("#09")}
    </article>`;
  }

  function renderKpis(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    const liveKpis = DATA.kpis.filter(k => !k.archived);
    const goals = liveKpis.filter(k => k.goal);
    const metrics = liveKpis.filter(k => !k.goal && !k.lostTracker && k.id !== "#28");
    const goalsCards = [
      kpiTileWithProjects("#19", missedRevenueTrackerHtml()),
      kpiTileWithProjects("#07", lsaMismanagementTrackerHtml()),
      ...goals.map(k => kpiTileWithProjects(k.id, kpiGoalCardHtml(k))),
      kpiTileWithProjects("#03", teamDuiGoalCardHtml())
    ].join("");
    const goalsBlock = `<section class="kpi-section kpi-section-static kpi-section-goals" data-feedback-id="section-goals" data-feedback-label="Team goals">
          ${kpiSectionStaticHead("Team goals", "Missed opportunity · Spend waste · DUI YTD")}
          <div class="kpi-section-body">
            <div class="kpi-goals-grid">${goalsCards}</div>
          </div>
        </section>`;
    const kpiCards = [
      forecastExpenseCoverageDialHtml(),
      ...metrics.map(k => kpiTileWithProjects(k.id, kpiStatCardHtml(k)))
    ].join("");

    el.innerHTML = `${reportHeader()}
      ${goalsBlock}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionStaticHead("Key metrics", "")}
        <div class="kpi-section-body">
          <div class="kpi-stat-grid">${kpiCards}</div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-reviews-presence" data-feedback-label="#16 Reviews by channel">
        ${kpiSectionStaticHead("Reviews by channel", "Presence mix · Listed / Unlisted / Outdated")}
        <div class="kpi-section-body">
          ${reviewsByChannelPanelHtml()}
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Cases, Leads & Spend">
        ${kpiSectionStaticHead("Cases, Leads & Spend", "")}
        <div class="kpi-section-body">
          ${casesLeadsSpendSectionHtml()}
        </div>
      </section>
      ${financialSectionHtml()}`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "kpis");
  }

  /**
   * #08 panel — Impact tab (campaign lead volume).
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
          chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.leadsByCampaign)),
          legend: channelLegend(DATA.leadsByCampaign),
          table: campaignLeadsDetailTable(DATA.leadsByCampaign)
        })}
        <p class="kpi-table-note">Military volume used to look oversized in part because a lot of DV traffic ran inside that campaign — that traffic is now broken out as <strong>Core DV</strong>. Traffic and auto-related demand sits in <strong>NTGUILT</strong>.</p>
        ${sourceFootnote("#08")}
      </div>
      ${kpiRefMark("#08")}
    </article>`;
  }

  /**
   * #17 Referral Network — placeholder counts (null) until A4 tracking wires.
   * Doc: parked/KPI-17-REFERRAL-NETWORK.md
   */
  function totalReferralNetworkPanelHtml() {
    return `<div class="kpi-mini-card" data-kpi-focus="#17">
      ${statusCorner(false)}
      <h3>Total Referral Network</h3>
      ${(() => {
        const segs = presencePieSegments(DATA.referrals);
        return chartBlock({ chart: donutChart(segs) });
      })()}
      <table class="kpi-table">
        <thead><tr><th>Channel</th><th>Referrers</th><th>Change</th></tr></thead>
        <tbody>${DATA.referrals.map(r => `<tr class="${r.status !== "active" ? "kpi-row-gap" : ""}">
          <td>${star(!!r.verified)} ${escapeHtml(r.platform)}</td>
          <td>${dash(r.count)}</td>
          <td>${r.delta != null ? (momChangeHtml(r.delta) || dash(r.delta)) : dash(r.delta)}</td>
        </tr>`).join("")}</tbody>
      </table>
      <p class="kpi-table-note">Placeholder — counts fill when A4 Client Referral Program tracking is live.</p>
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

  function reviewsByChannelPanelHtml() {
    const anyVerified = DATA.reviews.some(r => r.verified);
    const segs = presencePieSegments(DATA.reviews);
    const rows = DATA.reviews.map(r => `<tr class="${r.status !== "active" ? "kpi-row-gap" : ""}">
          <td>${star(!!r.verified)} ${escapeHtml(r.platform)}</td>
          <td>${dash(r.rating)}</td>
          <td>${dash(r.count)}</td>
          <td><span class="${presenceToneClass(r.status)}">${escapeHtml(presenceLabel(r.status))}</span></td>
        </tr>`).join("");
    return `<div class="kpi-mini-card kpi-reviews-presence" data-kpi-focus="#16">
      ${statusCorner(anyVerified)}
      ${kpiHelpBtn("#16")}
      <div class="kpi-reviews-main">
        ${chartBlock({ chart: donutChart(segs) })}
        <details class="kpi-table-acc kpi-reviews-table-wrap">
          <summary class="kpi-table-acc-summary">Channel table</summary>
          <div class="kpi-reviews-table-scroll">
            <table class="kpi-table kpi-table-dense">
              <thead><tr><th>Channel</th><th>Rating</th><th>#</th><th>Status</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>
      </div>
      ${projectEggLink("B10", "Open B10 Digital Profiles Refresh")}
    </div>`;
  }

  function leadsByChannelPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-leads-channel-01" data-feedback-label="#01 Leads by channel">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Leads by channel", "Stacked by month")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#01",
          chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.channels, { useChannelMonths: true })),
          legend: channelLegend(DATA.channels),
          table: channelsDetailTable(DATA.channels)
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
          chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
          legend: casesMomLegend(DATA.casesMomSeries, DATA.casesMom),
          table: casesMomDetailTable(DATA.casesMom)
        })}
      </div>
      ${kpiRefMark("#04")}
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
      ${dataCardHtml("Lead Channel Stack", "Lead source movement and MoM.", leadsByChannelPanelHtml())}
      ${dataCardHtml("Cases MoM", "Closed · New · Red accounts.", casesMomPanelHtml())}
      ${dataCardHtml("Referral Network", "KPI #17 · placeholder until A4 tracking wires.", totalReferralNetworkPanelHtml(), {
        inputNeeded: true,
        inputProjectId: "A4",
        inputProjectLabel: "Open A4 Client Referral Program",
        inputProjectEgg: "17"
      })}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "data");
  }

  function renderImpact(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `<div class="data-grid">
      ${dataCardHtml("Leads By Campaign", "#08 campaign lead volume · Military · Core DV · NTGUILT.", leadsByCampaignPanelHtml())}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "impact");
  }

  /** Blended 2026 case forecast: prior-year H2 seasonality + current H1 run rate. */
  function caseForecastPanelHtml() {
    const forecast = [
      { month: "Jul", cases: 14 },
      { month: "Aug", cases: 15 },
      { month: "Sep", cases: 14 },
      { month: "Oct", cases: 15 },
      { month: "Nov", cases: 12 },
      { month: "Dec", cases: 14 }
    ];
    const actualNewest = [
      { month: "Jun", cases: 34 },
      { month: "May", cases: 22 },
      { month: "Apr", cases: 15 },
      { month: "Mar", cases: 17 },
      { month: "Feb", cases: 14 },
      { month: "Jan", cases: 12 }
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
    const chart = `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="2026 cases: July through December forecast first, then June through January actual newest to oldest">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${forecastCenter}" y="24" text-anchor="middle" class="kpi-chart-total">Forecast · current month → year end</text>
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
        <div class="kpi-mini-card"><h3>Jan–Jun actual</h3><p class="kpi-mini-value">114</p></div>
        <div class="kpi-mini-card"><h3>Jul–Dec forecast</h3><p class="kpi-mini-value">84</p></div>
        <div class="kpi-mini-card"><h3>2026 full-year estimate</h3><p class="kpi-mini-value">198</p></div>
      </div>
      ${chartBlock({
        chart,
        table: kpiDetailTable(["Month", "Cases", "Status"], tableRows),
        footnote: "Source: MyCase cases created · 2025 full year + Jan–Jun 2026. Forecast months lead; completed months follow newest → oldest. Lighter bars = forecast."
      })}
      <p class="data-formula-line">Seasonal H2 = 2025 H2 (57) × 2026/2025 H1 factor (114 ÷ 121) = 54 cases</p>
      <p class="data-formula-line">Run-rate H2 = 2026 H1 average (19/mo) × 6 = 114 cases</p>
      <p class="data-formula-line">Blended H2 = (54 seasonal + 114 run-rate) ÷ 2 = 84 cases · full year = 114 actual + 84 forecast = 198</p>
      <p class="data-warning-note"><strong>Forecast range:</strong> 54–114 Jul–Dec cases. The 84-case midpoint is the planning forecast. Only one complete prior year exists, so replace July’s estimate when the July MyCase export is complete.</p>`;
  }

  function expensePaceGraphHtml() {
    const periods = [
      {
        label: "Full-year forecast",
        forecast: true,
        values: [1106226, 884981, 960000]
      },
      {
        label: "Jan–Jun actual",
        forecast: false,
        values: [636918, 509534, 480000]
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
      head: `<div><strong>Quoted, collectible, and expenses</strong><div class="kpi-chart-subtitle">Full-year forecast first · Jan–Jun actual second</div></div>`,
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
    const actualH1 = 114;
    const fullYearCases = 198;
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
      <p class="data-warning-note"><strong>Issue — do not treat H1 surplus as positive:</strong> H1 collectible after expenses shows +${fmtMoney(m.netCollectibleH1)}, but <strong>unknown business debt</strong> (loans, credit balances, and other liabilities outside the $80k/mo operating assumption) is not included. Flag this as a negative / unreliable indicator until B9 maps every liability.</p>
      <p class="data-inline-note"><strong>Mid-year quoted pace:</strong> Target ${fmtMoney(m.linearQuotedPace)} · actual ${fmtMoney(m.quotedH1)} · ahead ${fmtMoney(m.quotedPaceDelta)} (+${m.quotedPacePct}%).</p>
      <p class="data-inline-note"><strong>Mid-year collectible pace:</strong> Target ${fmtMoney(m.linearCollectiblePace)} · actual ${fmtMoney(m.collectibleH1)} · ahead ${fmtMoney(m.collectiblePaceDelta)}.</p>
      <p class="data-formula-line">H1 expenses = ${fmtMoney(m.monthlyExpense)} × 6 = ${fmtMoney(m.expenseH1)} · H1 collectible after expenses = ${fmtMoney(m.netCollectibleH1)} (unreliable — unknown debt)</p>
      <p class="data-formula-line">Full-year expenses = ${fmtMoney(m.expenseFullYear)} · collectible forecast ${fmtMoney(m.collectibleFullYear)} · shortfall ${fmtMoney(Math.abs(m.netCollectibleFullYear))}</p>
      ${expensePaceCheckpointTableHtml()}
      <p class="data-inline-note"><strong>Next actions:</strong> Keep Sex Crimes Defense / high-mean practice focus in A1 · run B9 financial audit to inventory debt + cancel recurring subscriptions · reforecast after July MyCase cases and QuickBooks collections land.</p>`;
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
      { month: "Jun", cases: 34, forecast: false }
    ];
    const forecastCohorts = [
      { month: "Jul", cases: 14, forecast: true },
      { month: "Aug", cases: 13, forecast: true },
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

    const forwardMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
            : "Payment-plan tails from Jan–Jun only"
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
        "Jan–Jun total",
        "114",
        fmtMoney(Math.round(114 * feeUsed)),
        fmtMoney(Math.round(114 * collectibleUsed)),
        "Actual"
      ]])
    );

    const h1AvgCases = 19;
    const recentAvgCases = 24;
    const junCases = 34;
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

  function predictionsPageHtml() {
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">Predictions</h2>
        <p class="data-page-sub">Rest-of-year case forecast · $80k/mo expense pace · intake-driven cash projection</p>
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

  function recommendationsPageHtml() {
    const r = junPaidChannelRecs();
    if (!r) {
      return `<header class="data-page-head"><div><h2 class="data-page-title">Recommendations</h2></div></header>
        <p class="data-inline-note">Need a complete June LSA + digital month to build recommendations.</p>`;
    }
    const divertTable = kpiDetailTable(
      ["Divert from LSA", "→ Consulting", "→ Digital ads", "Consulting %", "Media %", "All-in $/call", "Decision"],
      r.divertRows.map(row => [
        fmtMoney(row.total),
        fmtMoney(row.toMgmt),
        fmtMoney(row.toMedia),
        `${row.mgmtPct}%`,
        `${row.mediaPct}%`,
        row.allIn != null ? fmtMoney(row.allIn) : "—",
        escapeHtml(row.decision)
      ])
    );
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">Recommendations</h2>
        <p class="data-page-sub">These recommendations are designed to hit the KPIs and cover all expenses through year-end. Immediate cost-cutting action is required: expenses are far too high and funds are not being managed effectively. If sufficient cuts cannot be made elsewhere, staffing reductions may be necessary.</p>
      </div>
    </header>
    <div class="data-grid">
      ${dataCardHtml(
        "Contents",
        "Jump to a recommendation section.",
        `<ol class="data-inline-note" style="margin:0;padding-left:1.2rem">
          <li><a class="data-guide-link" href="#recommendation-primary">LSA call intake + digital Search shift</a></li>
          <li><a class="data-guide-link" href="#recommendation-sex-crimes">Sex Crimes Defense focus</a></li>
          <li><a class="data-guide-link" href="#recommendation-financial-audit">B9 · Full Financial Audit</a></li>
          <li><a class="data-guide-link" href="#recommendation-divert">LSA diversion model</a></li>
          <li><a class="data-guide-link" href="#recommendation-projects">Project information</a></li>
          <li><a class="data-guide-link" href="#recommendation-actions">Next actions</a></li>
        </ol>`,
        { full: true, id: "recommendation-contents" }
      )}
      ${dataCardHtml(
        "LSA call intake + digital Search shift",
        "Patch the LSA call-intake failure before continuing LSA spend; then shift qualified media toward digital Search.",
        `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
          <div class="kpi-mini-card"><h3>LSA $/call</h3><p class="kpi-mini-value">${fmtMoney(r.lsaCpl)}</p></div>
          <div class="kpi-mini-card"><h3>Digital media $/call</h3><p class="kpi-mini-value">${fmtMoney(r.digCpl)}</p></div>
          <div class="kpi-mini-card"><h3>Digital all-in $/call</h3><p class="kpi-mini-value">${fmtMoney(r.digAllIn)}</p></div>
        </div>
        <p class="data-inline-note"><strong>First:</strong> Fix unanswered calls through <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B2">B2 · HubSpot Phone / VoIP Setup</a>. Resume spending after Search + LSA lines reach <strong>≥90% answered for seven days</strong>.</p>
        <p class="data-inline-note"><strong>Then:</strong> Keep the <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="RETAINER">Digital Ads Maintenance Retainer</a> active and move at least ${fmtMoney(r.minDivert)}/mo from LSA to consulting plus digital media.</p>
        <p class="data-formula-line">Minimum shift = ${fmtMoney(r.mgmt)} consulting + ${fmtMoney(r.breakEvenMedia)} digital media = ${fmtMoney(r.minDivert)}/mo</p>
        <p class="data-formula-line">LSA cost = ${fmtMoney(r.jun.lsaSpend)} ÷ ${r.jun.leads} calls = ${fmtMoney(r.lsaCpl)}/call</p>
        <p class="data-formula-line">Digital all-in = (${fmtMoney(r.jun.adsSpend)} media + ${fmtMoney(r.mgmt)} consulting) ÷ ${r.jun.adsLeads} calls = ${fmtMoney(r.digAllIn)}/call</p>`,
        { className: "recommendation-tile", id: "recommendation-primary" }
      )}
      ${dataCardHtml(
        "Sex Crimes Defense focus",
        "Highest mean quoted fee, but 2026 YTD case volume is 62% behind the same 2025 period.",
        `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
          <div class="kpi-mini-card"><h3>Mean quoted fee</h3><p class="kpi-mini-value">$9,500</p></div>
          <div class="kpi-mini-card"><h3>2025 YTD cases</h3><p class="kpi-mini-value">13</p></div>
          <div class="kpi-mini-card"><h3>2026 YTD cases</h3><p class="kpi-mini-value">5</p></div>
          <div class="kpi-mini-card"><h3>YTD change</h3><p class="kpi-mini-value">−62%</p></div>
        </div>
        <div class="kpi-chart-card" style="margin-bottom:0.85rem">
          <h3>2026 case growth forecast</h3>
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
          <p class="data-formula-line">YTD = 5 cases through June · current pace = 10 full-year cases · recovery plan = 5 YTD + 8 additional H2 cases = 13</p>
        </div>
        <div class="kpi-chart-card" style="margin-bottom:0.85rem">
          <h3>Modeled collectible-value forecast</h3>
          <div class="kpi-chart-plot">${barWithTargetChart(
            [
              { label: "YTD", value: 38000 },
              { label: "Pace", value: 76000 },
              { label: "Recovery", value: 98800 }
            ],
            {
              target: 98800,
              lowerIsBetter: false,
              compact: false,
              width: 640,
              height: 220,
              ariaLabel: "Modeled Sex Crimes Defense collectible value: 38 thousand dollars year to date, 76 thousand dollars at current pace, and 98.8 thousand dollars under the recovery plan"
            }
          )}</div>
          <p class="data-formula-line">Cases × $9,500 mean quoted fee × 80% modeled collection · directional forecast, not booked cash</p>
        </div>
        <p class="data-warning-note"><strong>Why move focus:</strong> Sex Assault / Sex Offense is the highest measured fee category — about 70% above the $5,587 firm mean — while signed-case volume is trending materially behind. The eight-case YTD gap represents about <strong>$76,000 in quoted fee value</strong>, or <strong>$60,800</strong> under the 80% collection model.</p>
        <p class="data-inline-note"><strong>Recommended move:</strong> Use <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="A1">A1 · Digital Ad Enhancements</a> to launch a discreet Sex Crimes Defense Search pilot: exact/phrase high-intent terms, dedicated landing page, sensitive-policy review, tracked calls, and signed-case reporting. Do not use Display or broad match for this line.</p>
        <p class="data-formula-line">8 fewer YTD cases × $9,500 mean quoted fee = $76,000 directional signed-value gap</p>
        <p class="data-formula-line">$76,000 × 80% modeled collection = $60,800 directional collectible gap</p>
        <p class="data-inline-note"><strong>Data caution:</strong> $9,500 is a quoted-fee mean, not profit or cash collected, and the fee sample is only n=6. Validate against QuickBooks collections before scaling beyond the pilot.</p>`,
        { className: "recommendation-tile", id: "recommendation-sex-crimes" }
      )}
      ${dataCardHtml(
        "B9 · Full Financial, Credit Card & Subscription Waste Audit",
        "Recommended cost-control project: map debt, reduce recurring expenses, recover credits, and document verified savings.",
        `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
          <div class="kpi-mini-card"><h3>Known 30-day waste floor</h3><p class="kpi-mini-value">$1,063</p></div>
          <div class="kpi-mini-card"><h3>Annualized if repeated</h3><p class="kpi-mini-value">$12,756</p></div>
          <div class="kpi-mini-card"><h3>H1 after expenses</h3><p class="kpi-mini-value">+$29,534*</p></div>
        </div>
        <p class="data-warning-note"><strong>Why an audit is needed:</strong> H1 collectible after the $80k/mo expense assumption shows +$29,534, but that figure is a <strong>negative / unreliable indicator</strong> because <strong>unknown business debt</strong> (loans, credit balances, and other liabilities) is not in the model. A small operating surplus can disappear once debt service is mapped. Separately, the account review already found $1,063 in non-client Search-term spend over 30 days, and many unused or overlapping subscriptions still lack a verified cancel total.</p>
        <p class="data-inline-note"><strong>Recommended project:</strong> Open <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B9">B9 · Full Financial, Credit Card & Subscription Waste Audit</a>. Reconcile QuickBooks, bank and card statements, <strong>debt and liability balances</strong>, subscriptions, software seats, phone lines, ad billing, LSA credits, payroll, contractors, sponsorships, and vendor agreements.</p>
        <p class="data-formula-line">$1,063 known 30-day Search waste × 12 months = $12,756 annualized exposure if unchanged</p>
        <p class="data-formula-line">H1 collectible $509,534 − $480,000 expenses = +$29,534* · *excludes unknown debt</p>
        <p class="data-inline-note"><strong>Payment:</strong> $1,800 fixed fee plus 20% of verified net savings or recovered cash. Measure subscription/service changes for 12 months, continuing vendor-rate revisions for 6 months, variable operating revisions for 3 months, and one-time recoveries when posted.</p>
        <p class="data-inline-note"><strong>No double-counting:</strong> The approximately $694 safe Military Display negative-keyword finding is a subset of the $1,063 Search-term waste. Subscription, phone, duplicate-tool, LSA-credit, debt-service, and vendor savings remain separate and unverified until statements are audited.</p>`,
        { className: "recommendation-tile", id: "recommendation-financial-audit" }
      )}
      ${dataCardHtml(
        "Divert from LSA · consulting vs digital ads split",
        "Pay consulting first; put the remaining diverted dollars into digital media.",
        `${divertTable}
        <p class="data-warning-note"><strong>Warning — clarify before implementation:</strong> This math compares calls, not signed cases. Confirm each channel’s call-to-signed-case rate before moving the budget. LSA is only worth its higher cost if it signs cases at least <strong>${r.closeMultiple.toFixed(2)}× better</strong> than digital. Example: if digital signs 10%, LSA must sign at least ${(10 * r.closeMultiple).toFixed(1)}%.</p>`,
        { full: true, id: "recommendation-divert" }
      )}
      ${dataCardHtml(
        "",
        "Guide projects required to repair intake, clean LSA operations, control financial waste, manage paid media, and test the Sex Crimes Defense opportunity.",
        `${kpiDetailTable(
          ["Project", "Priority / status", "Fee", "Role in recommendation", "Success gate"],
          [
            [
              '<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B2">B2 · HubSpot Phone / VoIP Setup</a>',
              "Priority 1 · Recommended",
              "$0 · included in B13",
              "Route and log inbound Search + LSA calls; create same-day missed-call tasks.",
              "≥90% answered for seven days; live 888 → HubSpot test passes."
            ],
            [
              '<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B11">B11 · LSA Call Process Update</a>',
              "Priority 2 · Recommended",
              "$1,500",
              "Same-day booked/spam/follow-up statuses, call review, and Casey coverage.",
              "Statuses current; disputes caught before billing; coverage calendar active."
            ],
            [
              '<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="RETAINER">RETAINER · Digital Ads Maintenance</a>',
              "Required",
              `${fmtMoney(r.mgmt)}/mo`,
              "Monitor LSA/Search spend, lead quality, bids, and monthly reporting.",
              "Fund before shifting media; do not add a second consulting fee."
            ],
            [
              '<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="A1">A1 · Digital Ad Enhancements</a>',
              "Priority 11 · Available",
              "$2,200",
              "Build the discreet Sex Crimes Defense Search pilot + dedicated landing page and tracking.",
              "Qualified calls and signed cases recover without broad/Display exposure; validate collected revenue in QuickBooks."
            ],
            [
              '<a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B9">B9 · Full Financial, Credit Card & Subscription Waste Audit</a>',
              "Priority 26 · Recommended",
              "$1,800 + 20% verified savings",
              "Reconcile operating spend, unknown business debt/liabilities, unused subscriptions, and duplicate tools; recover credits and stop recurring leakage.",
              "Every recurring charge and liability has an owner and action; verified monthly and annual savings are documented without double-counting; H1 surplus is no longer treated as cash-safe until debt is mapped."
            ]
          ]
        )}
        <p class="data-inline-note"><strong>Order:</strong> Complete B2 call routing first → operate B11 status and coverage controls → continue media under RETAINER only after the seven-day answer-rate gate.</p>`,
        { full: true, id: "recommendation-projects" }
      )}
      ${dataCardHtml(
        "",
        "Guide projects tied to this recommendation.",
        `<ol class="data-inline-note" style="margin:0;padding-left:1.2rem">
          <li>Hold additional LSA media while <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B2">B2</a> patches routing, backup coverage, and missed-call tasks.</li>
          <li>Dial the public 888 number end-to-end; confirm HubSpot rings, logs the contact timeline, and assigns a same-day callback task.</li>
          <li>Run <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B11">B11</a>: same-day LSA statuses, Casey call review, and a fixed coverage calendar.</li>
          <li>After ≥90% answered for seven days, confirm <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="RETAINER">Digital Ads Maintenance Retainer</a> is funded (${fmtMoney(r.mgmt)}/mo).</li>
          <li>Launch the <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="A1">A1 Sex Crimes Defense Search pilot</a>: exact/phrase only, dedicated discreet landing page, no Display or broad match, and a 30-day qualified-call / signed-case review.</li>
          <li>Run <a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B9">B9 Full Financial Audit</a>: export QuickBooks plus all bank/card statements, inventory recurring subscriptions and phone/software seats, <strong>map unknown business debt and liabilities</strong>, and produce a cancel / renegotiate / dispute list with verified monthly and annual savings. Do not treat the +$29,534 H1 collectible-after-expenses figure as a positive indicator until debt is mapped.</li>
          <li>Test diverting ≥ ${fmtMoney(r.minDivert)}/mo from LSA → consulting + Search media; hold for 30 days and track signed-case rate by channel.</li>
          <li>Open Data tab · Cases, Leads & Spend for source charts and June trade-off tables.</li>
        </ol>`,
        { full: true, id: "recommendation-actions" }
      )}
    </div>`;
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
