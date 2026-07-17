/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis
 * (former Dashboards charts live at the bottom of the KPIs tab).
 */
(function () {
  const RENDER_VER = "20260717-assign-ids";
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
    "cases-leads-spend": {
      file: "MyCase new-cases-by-month · LSA leads-inbox (15) · Google account_activities May–Jul 2026",
      fields: "New cases (Created) · LSA inbox rows · Search + LSA spend excl. starting/ending balance"
    },
    "cash-collected": {
      file: "~/Downloads/ledger_account_activity_report.csv",
      fields: "Ledger Credit by month · aggregate only · Jan 2025–Jul 15 2026"
    },
    "financial": {
      file: "ledger_account_activity_report.csv (2025-01-03→2026-07-15) · contact_report_task_export as-of-2026-07-01 · LSA inbox (15)",
      fields: "Cash credits MoM · LSA charge rate · Trust Payment Method=Trust applications MoM · Client Trust balance snapshot"
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
      formula: "Count of Client contacts with Created date in month. Jun 2026 = 34 · target 12."
    },
    "#12": {
      title: "#12 Avg. Cost per Call",
      desc: "Digital Search only — Campaign report cost divided by phone calls. Not LSA.",
      formula: "Campaign Cost ÷ Phone calls → $6,277 ÷ 122 = $51. Target < $100."
    },
    "#19": {
      title: "#19 Lost Revenue",
      desc: "Estimated monthly revenue lost from unanswered Search calls. Directional for phone priority — not booked revenue.",
      formula: "Missed Search calls × 7.3% lead→case × avg case value ($5,587) → 38 × 7.3% × $5,587 = $15,498/mo."
    },
    "#21": {
      title: "#21 Answered Calls",
      desc: "Share of Search call details that were answered (Received) vs missed.",
      formula: "Answered ÷ (Answered + Missed) → 100 ÷ 138 = 72%. Target ≥ 90%."
    },
    "#DUI": {
      title: "# DUIs Signed",
      desc: "YTD DUI/DWAI signed matters toward the annual goal (practice area).",
      formula:
        "Client contacts Created in goal year with Cases (practice area) DUI/DWAI/Alcohol — (DUI/DWI) tag or DUI-named Criminal Defense — ÷ annual target (50)."
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
    }
  };

  function kpiHelpBtn(kpiId) {
    const id = String(kpiId || "");
    if (!KPI_HELP[id]) return "";
    return `<span class="kpi-help" role="button" tabindex="0" data-kpi-help="${escapeHtml(id)}" aria-label="About ${escapeHtml(id)}">?</span>`;
  }

  /** Card header label only — KPI id lives in lower-right ref mark. */
  function kpiCardTitle(label) {
    return `<span class="kpi-stat-id">${escapeHtml(String(label || "").replace(/^#\S+\s+/, ""))}</span>`;
  }

  /** Lower-right medium-gray KPI number for reference. */
  function kpiRefMark(kpiId) {
    const id = String(kpiId || "").trim();
    if (!id || id === "#GOAL3") return "";
    return `<span class="kpi-ref-num" aria-hidden="true">${escapeHtml(id)}</span>`;
  }

  function getKpiHelp(kpiId) {
    const id = String(kpiId || "");
    const h = KPI_HELP[id];
    const src = KPI_SOURCES[id];
    let source = "";
    if (src) {
      source = `${src.file} · Fields: ${src.fields}`;
    } else if (id === "#DUI") {
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
      { id: "#02", label: "New cases", value: "34", target: "12", mom: "+55%", verified: true, alert: false, gauge: true, hit: true },
      { id: "#12", label: "Avg. Cost per Call", value: "$51", target: "< $100", mom: null, verified: true, hit: true, targetBar: true, lowerIsBetter: true },
      /* Team goals: #19 lost-tracker first in render, then #21, then DUI */
      { id: "#19", label: "Lost Revenue", value: "$15,498/mo", target: "$0", mom: null, verified: true, alert: true, lostTracker: true },
      { id: "#21", label: "Answered Calls", value: "72%", target: "≥ 90%", mom: "+5%", verified: true, alert: true, gauge: true, goal: true },
      /* archived for future iteration — restore by removing archived: true */
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false, archived: true },
      { id: "#28", label: "Avg case fee", value: "$5,587", target: "MyCase mean", mom: null, verified: true },
      { id: "#BHI", label: "Business health index", value: "71", target: "100", mom: "−3%", verified: false, alert: true, letterGrade: true, archived: true }
    ],
    channels: [
      { name: "Search calls", count: 138, prior: 39, mom: "+254%", spend: "$8,296", color: "#3a1a6e", verified: true },
      { name: "LSA inbox", count: 83, prior: 50, mom: "+66%", spend: "$13,206", color: "#c45c26", verified: true },
      { name: "HubSpot forms", count: 5, prior: 0, mom: "—", spend: "$0", color: "#2d5a3d", verified: true }
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
      { name: "LSA", pct: 37, color: "#c45c26", count: 83, prior: 50, mom: "+66%" },
      { name: "HubSpot / other", pct: 2, color: "#2d5a3d", count: 5, prior: 0, mom: "—" }
    ],
    /* Campaign brand: Military royal · Core DV burnt orange · NTGUILT forest (GGL — no teal) */
    searchCallsByCampaign: [
      { name: "Military", count: 103, color: "#3a1a6e" },
      { name: "Core DV", count: 12, color: "#c45c26" },
      { name: "NTGUILT", count: 11, color: "#2d5a3d" }
    ],
    leadsByCampaign: [
      { name: "Military", count: 99, prior: 36, mom: "+175%", spend: "$3,983", color: "#3a1a6e" },
      { name: "Core DV", count: 3, prior: 3, mom: "0%", spend: "$179", color: "#c45c26" },
      { name: "NTGUILT", count: 15, prior: 0, mom: "—", spend: "$1,924", color: "#2d5a3d" }
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
        target: d.target != null ? Number(d.target) : 50,
        year: d.year != null ? Number(d.year) : 2026,
        title: d.title || "# DUIs Signed",
        label: d.label || "Signed"
      };
    })(),
    casesMomSeries: [
      { name: "Closed cases", color: "#2d5a3d", verified: false },
      { name: "New cases", color: "#1e3a8a", verified: true },
      { name: "Red accounts", color: "#cf2d56", verified: false }
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
      { month: "May", cases: 22, leads: 50, spend: 18633, lsaSpend: 11006, adsSpend: 7627, adsLeads: 39 },
      { month: "Jun", cases: 34, leads: 83, spend: 21502, lsaSpend: 13206, adsSpend: 8296, adsLeads: 138 },
      { month: "Jul*", cases: 0, leads: 57, spend: 8832, lsaSpend: 7163, adsSpend: 1669, adsLeads: 26 }
    ],
    /** Consulting allocation estimates for channel CPL (not full retainer). */
    consultingLsaMonthly: 1000,
    consultingAdsMonthly: 2000,
    cashCollected: [
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
      contractedMean: 5587
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
    const s = KPI_SOURCES[kpiId];
    if (!s) return "";
    return `<span class="kpi-source-footnote"><span class="kpi-source-label">Source</span> ${escapeHtml(s.file)} · <span class="kpi-source-fields">Fields: ${escapeHtml(s.fields)}</span></span>`;
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
    if (amt >= 100000) return "#b8860b";
    if (amt > 80000) return "#2d5a3d";
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
        lsa: "#c45c26",
        hubspot: "#2d5a3d"
      };
      const labels = {
        search: "Search calls",
        lsa: "LSA inbox",
        hubspot: "HubSpot forms"
      };
      return DATA.channelMonths.map(m => ({
        month: m.month,
        segments: [
          { name: labels.search, count: m.search || 0, color: colors.search },
          { name: labels.lsa, count: m.lsa || 0, color: colors.lsa },
          { name: labels.hubspot, count: m.hubspot || 0, color: colors.hubspot }
        ]
      }));
    }
    /* Fallback — prior = May, count = Jun only */
    return [
      {
        month: "May",
        segments: channels.map(c => ({ name: c.name, count: c.prior, color: c.color }))
      },
      {
        month: "Jun",
        segments: channels.map(c => ({ name: c.name, count: c.count, color: c.color }))
      }
    ];
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
        const hh = total ? (plotH * seg.count) / max : 0;
        y -= hh;
        return `<rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
          <title>${escapeHtml(seg.name)}: ${seg.count}</title>
        </rect>`;
      }).join("");
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${pad.t - 14}" text-anchor="middle" class="kpi-chart-total">${total}</text>
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
    return rows.map(r => ({
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
    const badge = typeof opts.verified === "boolean" ? statusCorner(opts.verified) : "";
    const vClass = "";
    return `<div class="kpi-chart-card${vClass}"${focus}>
      ${badge}
      ${head}
      <div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>
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
    const colors = { cases: "#3a1a6e", leads: "#2d5a3d", spend: "#c45c26" };
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
      const casesY = leftY(r.cases);
      const leadsY = leftY(r.leads);
      return `<g>
        <rect x="${cx - 36}" y="${casesY}" width="28" height="${pad.t + plotH - casesY}" rx="3" fill="${colors.cases}"/>
        <text x="${cx - 22}" y="${casesY - 6}" text-anchor="middle" class="kpi-chart-total">${r.cases}</text>
        <rect x="${cx + 8}" y="${leadsY}" width="28" height="${pad.t + plotH - leadsY}" rx="3" fill="${colors.leads}"/>
        <text x="${cx + 22}" y="${leadsY - 6}" text-anchor="middle" class="kpi-chart-total">${r.leads}</text>
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
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" class="kpi-chart-total">$${Math.round(r.spend / 1000)}k</text>
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
      { name: "New cases", color: "#3a1a6e" },
      { name: "LSA leads", color: "#2d5a3d" },
      { name: "Marketing spend", color: "#c45c26" }
    ];
    return channelLegend(items);
  }

  function casesLeadsSpendTable(rows) {
    const newestFirst = [...(rows || [])].reverse();
    return kpiDetailAccordion(
      "Media table",
      `${newestFirst.length} periods`,
      ["Period", "LSA leads", "LSA media", "LSA media / lead", "Search media", "Search media / call"],
      [
        ...newestFirst.map(r => {
          const lsaSpend = r.lsaSpend || 0;
          const adsSpend = r.adsSpend || 0;
          const adsLeads = r.adsLeads || 0;
          return [
            escapeHtml(r.month) + " 2026",
            String(r.leads),
            fmtMoney(lsaSpend),
            r.leads ? fmtMoney(lsaSpend / r.leads) : "—",
            fmtMoney(adsSpend),
            adsLeads ? fmtMoney(adsSpend / adsLeads) : "—"
          ];
        })
      ]
    );
  }

  function casesLeadsSpendSectionHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return `<article class="kpi-split-panel data-chart-table-panel" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Cases, Leads & Spend">
      ${statusCorner(true)}
      <div class="kpi-split-panel-body data-chart-table-grid">
        ${chartBlock({
          chart: dualAxisCasesSpendChart(rows),
          legend: casesLeadsSpendLegend()
        })}
        <div class="data-chart-table-side">
          ${casesLeadsSpendTable(rows)}
          ${sourceFootnote("cases-leads-spend")}
        </div>
      </div>
      ${kpiRefMark("#05")}
    </article>`;
  }

  function cashCollectedChart(rows) {
    const monthlyGoal = 80000;
    const baselineMonthly = Math.round((DATA.cashCollectedTotals.total2025 || 0) / 12);
    const current = rows.find(r => /\*/.test(r.month || ""));
    const currentPace = current
      ? {
          projected: Math.round((current.credit / 15) * 31),
          daysElapsed: 15,
          daysInMonth: 31
        }
      : null;
    const max = Math.max(...rows.map(r => r.credit), monthlyGoal, baselineMonthly, currentPace ? currentPace.projected : 0, 1);
    const w = 720;
    const h = 260;
    const pad = { l: 58, r: 22, t: 32, b: 46 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(54, slot * 0.58);
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round(max * p / 1000);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${val}k</text>
      </g>`;
    }).join("");
    const goalY = pad.t + plotH * (1 - monthlyGoal / max);
    const baselineY = pad.t + plotH * (1 - baselineMonthly / max);
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const bh = Math.max(6, (plotH * r.credit) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = isCurrent ? "#1e3a8a" : "#2d5a3d";
      const projection = isCurrent && currentPace
        ? (() => {
            const py = pad.t + plotH * (1 - currentPace.projected / max);
            return `<line x1="${x - 4}" x2="${x + barW + 4}" y1="${py}" y2="${py}" stroke="#1e3a8a" stroke-width="3" stroke-dasharray="4 4"/>
        <text x="${x + barW / 2}" y="${py - 8}" text-anchor="middle" class="kpi-chart-total" style="fill:#1e3a8a">$${Math.round(currentPace.projected / 1000)}k pace</text>`;
          })()
        : "";
      const labelFill = cashTierFill(r.credit);
      const labelStyle = labelFill ? ` style="fill:${labelFill}"` : "";
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${labelStyle}>$${Math.round(r.credit / 1000)}k</text>
        ${projection}
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cash collected by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" stroke="#7a6a58" stroke-width="2" stroke-dasharray="2 5"/>
      <text x="${pad.l + 8}" y="${baselineY + 16}" class="kpi-chart-total" style="fill:#7a6a58">$${Math.round(baselineMonthly / 1000)}k 2025 baseline</text>
      <line x1="${pad.l}" y1="${goalY}" x2="${w - pad.r}" y2="${goalY}" stroke="#cf2d56" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="${w - pad.r - 6}" y="${goalY - 8}" text-anchor="end" class="kpi-chart-total" style="fill:#cf2d56">$80k target</text>
      ${bars}
    </svg>`;
  }

  function cashCollectedTable(rows) {
    const withCases = rows.filter(r => r.newCases);
    const ytdCredit = rows.reduce((s, r) => s + r.credit, 0);
    const ytdCases = withCases.reduce((s, r) => s + r.newCases, 0);
    const janJunCredit = withCases.reduce((s, r) => s + r.credit, 0);
    return kpiDetailAccordion(
      "Cash table",
      `${rows.length} months`,
      ["Month", "Cash collected", "New cases", "Cash / new case"],
      [
        ...rows.map(r => {
          const per = r.newCases ? r.credit / r.newCases : null;
          return [
            escapeHtml(r.month) + " 2026",
            fmtCashTier(r.credit),
            r.newCases != null ? String(r.newCases) : "—",
            per != null ? fmtMoney(per) : "—"
          ];
        }),
        [
          "Jan–Jun totals",
          fmtCashTier(janJunCredit),
          String(ytdCases),
          fmtMoney(janJunCredit / ytdCases)
        ],
        ["2026 to date (incl. Jul*)", fmtCashTier(ytdCredit), "—", "—"],
        ["2025 total", fmtMoney(DATA.cashCollectedTotals.total2025), "—", "—"]
      ]
    );
  }

  function cashCollectedPaceNote(rows) {
    const current = rows.find(r => /\*/.test(r.month || ""));
    if (!current) return "";
    const goal = 80000;
    const daysElapsed = 15;
    const daysInMonth = 31;
    const projected = Math.round((current.credit / daysElapsed) * daysInMonth);
    const janJunRows = rows.filter(r => !/\*/.test(r.month || ""));
    const historicAvg = janJunRows.length
      ? Math.round(janJunRows.reduce((s, r) => s + r.credit, 0) / janJunRows.length)
      : null;
    const status = projected >= goal ? "on track" : "behind pace";
    return `<p class="data-inline-note"><strong>Current month:</strong> ${escapeHtml(current.month)} is ${fmtCashTier(current.credit)} through Jul 15. At that pace it projects to ${fmtCashTier(projected)} for July, ${status} for the ${fmtMoney(goal)} monthly goal${historicAvg ? ` and above the Jan–Jun average of ${fmtCashTier(historicAvg)}` : ""}.</p>`;
  }

  function lsaEfficiencyTable(rows) {
    const tot = rows.reduce((a, r) => ({
      leads: a.leads + r.leads,
      charged: a.charged + r.charged,
      lsaSpend: a.lsaSpend + r.lsaSpend
    }), { leads: 0, charged: 0, lsaSpend: 0 });
    const overall = DATA.lsaChargeRateOverall || {};
    return kpiDetailTable(
      ["Period", "LSA leads", "Charged", "Charge rate", "LSA media", "LSA media / charged lead"],
      [
        ...rows.map(r => [
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
    if (!cashRows.length) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified" data-feedback-id="section-financial" data-feedback-label="#09 Financials">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Financials", "Cash collected MoM · cash / new case")}
      <div class="kpi-section-body">
        <p class="kpi-section-intro">NEW-A cash MoM · NEW-B cash per new case. Color tiers on monthly cash: $60–70k burnt umber · &gt;$80k green · ≥$100k gold · else neutral.</p>
        <div class="kpi-finance-grid kpi-finance-grid-cash">
          <div class="kpi-mini-card">
            <h3>NEW-A · Cash collected (MoM)</h3>
            ${chartBlock({
              chart: cashCollectedChart(cashRows),
              table: cashCollectedTable(cashRows)
            })}
            ${cashCollectedPaceNote(cashRows)}
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
    const months = DATA.channelMonths;
    if (months && months.length >= 3) {
      const keys = [
        { key: "search", name: "Search calls", color: "#3a1a6e", spendKey: "searchSpend" },
        { key: "lsa", name: "LSA inbox", color: "#c45c26", spendKey: "lsaSpend" },
        { key: "hubspot", name: "HubSpot forms", color: "#2d5a3d", spendKey: null }
      ];
      const monthLabels = months.map(m => m.month);
      const rows = keys.map(k => {
        const vals = months.map(m => Number(m[k.key]) || 0);
        const junSpend = k.spendKey && months[1] ? months[1][k.spendKey] : null;
        return [
          `<span class="kpi-stack-swatch" style="background:${k.color}" aria-hidden="true"></span> ${escapeHtml(k.name)}`,
          ...vals.map(String),
          String(vals[vals.length - 1] - vals[vals.length - 2] >= 0
            ? "+" + (vals[vals.length - 1] - vals[vals.length - 2])
            : vals[vals.length - 1] - vals[vals.length - 2]),
          junSpend != null ? fmtMoney(junSpend) : "—"
        ];
      });
      const totals = months.map(m => (m.search || 0) + (m.lsa || 0) + (m.hubspot || 0));
      rows.push([
        "<strong>Total</strong>",
        ...totals.map(t => `<strong>${t}</strong>`),
        `<strong>${totals[totals.length - 1] - totals[totals.length - 2] >= 0 ? "+" : ""}${totals[totals.length - 1] - totals[totals.length - 2]}</strong>`,
        "—"
      ]);
      const julNote = months[2] && months[2].note
        ? `<p class="kpi-table-note">${escapeHtml(months[2].note)}</p>`
        : "";
      return kpiDetailTable(
        ["Lead type", ...monthLabels, "Δ vs Jun", "Jun spend"],
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

  /** Small change badge: green ↑ / red ↓ + percent — no “MoM” label. */
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
      active: "On",
      building: "Building",
      outdated: "Outdated",
      "not wired": "Not wired",
      "not on": "Not on"
    };
    return map[status] || status || "—";
  }

  const PRESENCE_PIE_COLORS = {
    active: "#2d5a3d",
    building: "#c45c26",
    outdated: "#4c1d95",
    "not on": "#3a1a6e",
    "not wired": "#8b7355"
  };

  function presencePieSegments(rows) {
    const counts = {};
    (rows || []).forEach(r => {
      const k = r.status || "not wired";
      counts[k] = (counts[k] || 0) + 1;
    });
    const keys = Object.keys(counts);
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

  const GOLD_GAUGE = { pale: "#fde68a", mid: "#c9a86c", dark: "#b8860b" };
  const PROGRESS_GAUGE = { red: "#cf2d56", mid: "#d97706", green: "#1f8a65" };

  function halfMoonGauge(pct, gradId, options) {
    const opts = options || {};
    const clamped = Math.max(0, Math.min(1, pct));
    const celebrate = !!(opts.celebrate || clamped >= 1);
    const cx = 94;
    const cy = 78;
    const r = 64;
    const strokeW = 12;
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    const rimGradId = `${gradId}-rim`;
    const goldStops = `<stop offset="0%" stop-color="${GOLD_GAUGE.pale}"/><stop offset="40%" stop-color="${GOLD_GAUGE.mid}"/><stop offset="100%" stop-color="${GOLD_GAUGE.dark}"/>`;
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
      const labelPt = halfMoonPoint(cx, cy, r + strokeW / 2 + 18, g);
      const goalLabel = opts.goalLabel != null ? String(opts.goalLabel) : "";
      goalSvg = `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" class="kpi-gauge-goal-mark"/>`;
      if (goalLabel) {
        const anchor = g >= 0.85 ? "start" : g <= 0.15 ? "end" : "middle";
        goalSvg += `<text x="${labelPt.x.toFixed(1)}" y="${(labelPt.y + 3).toFixed(1)}" class="kpi-gauge-goal-label" text-anchor="${anchor}">${escapeHtml(goalLabel)}</text>`;
      }
    }

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 124" role="img" aria-label="${aria}">
      <defs><linearGradient id="${rimGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${celebrate ? goldStops : progressStops}</linearGradient></defs>
      <path d="${arcD}" fill="none" stroke="${track}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <path d="${arcD}" fill="none" stroke="url(#${rimGradId})" stroke-width="${strokeW}" stroke-linecap="round"
        stroke-dasharray="${dashLen.toFixed(2)} ${(arcLen + 1).toFixed(2)}"/>
      ${goalSvg}
      <text x="22" y="114" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="166" y="114" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
      ${valueLabel !== "" ? `<text x="${cx}" y="${cy - 20}" class="kpi-gauge-center" text-anchor="middle">${escapeHtml(valueLabel)}</text>` : ""}
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

  function teamDuiGoalCardHtml() {
    const g = DATA.duiGoal;
    const pct = g.current / g.target;
    const hit = pct >= 1;
    return `<button type="button" class="kpi-goal-card kpi-stat-target-bar" data-kpi-focus="#DUI">
      ${statusCorner(false)}
      ${kpiHelpBtn("#DUI")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle((g.title || "DUIs Signed").replace(/^#\s*/, "") + (g.year ? ` ${g.year}` : ""))}
        ${duiGoalTargetBarChart()}
      </div>
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      <a class="kpi-dui-edit" href="dui-goal.html" onclick="event.stopPropagation()">Edit inputs</a>
      ${kpiRefMark("#DUI")}
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
        ${halfMoonGauge(0, "goal-placeholder", { endLabel: "—", valueLabel: "— / —" })}
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
    const goalLabel = isPct
      ? `${Math.round(target)}%`
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
      valueLabel: k.value
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
    const fmtPct = n => {
      const pct = Number(n) * 100;
      return `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`;
    };
    const delta = model.priorMonthlyLost != null ? model.monthlyLost - model.priorMonthlyLost : null;
    let trendDelta = "";
    if (delta != null) {
      const abs = Math.abs(delta);
      const cls = delta <= 0 ? "kpi-mom-up" : "kpi-mom-down";
      const arrow = delta <= 0 ? "↓" : "↑";
      const sign = delta <= 0 ? "−" : "+";
      trendDelta = `<span class="kpi-mom-change ${cls}"><span class="kpi-mom-arrow" aria-hidden="true">${arrow}</span><span class="kpi-mom-pct">${sign}${fmtMoney(abs)}/mo</span></span>`;
    }
    return `<button type="button" class="kpi-goal-card kpi-stat-card kpi-lost-tracker kpi-stat-attention kpi-stat-target-bar" data-kpi-focus="#19">
      ${statusCorner(true)}
      ${kpiHelpBtn("#19")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Lost Revenue")}
        <div class="kpi-metric-with-delta">
          <span class="kpi-lost-amount">${fmtMoney(model.monthlyLost)}<small>/mo</small></span>
          ${trendDelta}
        </div>
        <div class="kpi-lost-data" aria-label="Lost revenue details">
          <div class="kpi-lost-datum">
            <span class="kpi-lost-datum-label">Missed Search</span>
            <span class="kpi-lost-datum-val">${model.missedSearchCalls}</span>
            <span class="kpi-lost-muted">${p.missedPct}% of ${p.monthlyCalls}</span>
          </div>
          <div class="kpi-lost-datum">
            <span class="kpi-lost-datum-label">Avg case</span>
            <span class="kpi-lost-datum-val">${fmtMoney(model.avgCaseFee)}</span>
            <span class="kpi-lost-muted">#28</span>
          </div>
          <div class="kpi-lost-datum">
            <span class="kpi-lost-datum-label">Lead→case</span>
            <span class="kpi-lost-datum-val">${fmtPct(model.closeRateEst)}</span>
          </div>
          <div class="kpi-lost-datum">
            <span class="kpi-lost-datum-label">YTD lost</span>
            <span class="kpi-lost-datum-val">${fmtMoney(model.cumulativeYtd)}</span>
            <span class="kpi-lost-muted">64 missed May–Jul 10</span>
          </div>
        </div>
        <span class="kpi-stat-label">Est. money lost from unanswered Search calls</span>
        ${missedCallsTargetBarChart(p)}
      </div>
      ${kpiRefMark("#19")}
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
      const goalLine = k.id === "#01"
        ? `${nums.current} total · target ≥ ${Math.round(nums.target)} (20% MoM vs prior)`
        : targetLine;
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      return `<button type="button" class="kpi-stat-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        ${kpiHelpBtn(k.id)}
        ${kpiCardTitle(k.label)}
        ${metricWithDeltaHtml(gauge, k.mom)}
        <span class="kpi-stat-label">${goalLine}</span>
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

  function feeByPracticeSectionHtml() {
    /* #28 avg fee + practice means stay in DATA for Lost Revenue math — not shown on KPIs tab */
    return "";
  }

  function renderKpis(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    const liveKpis = DATA.kpis.filter(k => !k.archived);
    const goals = liveKpis.filter(k => k.goal);
    const metrics = liveKpis.filter(k => !k.goal && !k.lostTracker && k.id !== "#28");
    const goalsCards = [missedRevenueTrackerHtml(), ...goals.map(kpiGoalCardHtml), teamDuiGoalCardHtml()].join("");
    const goalsBlock = `<section class="kpi-section kpi-section-static kpi-section-goals" data-feedback-id="section-goals" data-feedback-label="Team goals">
          ${kpiSectionStaticHead("Team goals", "Lost Revenue · Phones · DUI YTD")}
          <div class="kpi-section-body">
            <div class="kpi-goals-grid">${goalsCards}</div>
          </div>
        </section>`;
    const kpiCards = metrics.map(kpiStatCardHtml).join("");

    el.innerHTML = `${reportHeader()}
      ${goalsBlock}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionStaticHead("Key metrics", "")}
        <div class="kpi-section-body">
          <div class="kpi-stat-grid">${kpiCards}</div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-reviews-presence" data-feedback-label="#16 Reviews by channel">
        ${kpiSectionStaticHead("Reviews by channel", "Presence mix · On / Not on / Outdated / Not wired")}
        <div class="kpi-section-body">
          ${reviewsByChannelPanelHtml()}
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Cases, Leads & Spend">
        ${kpiSectionStaticHead("Cases, Leads & Spend", "Left: counts · Right: $ spend · media table")}
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

  /** Unique former-Dashboards visuals (dupes of #01 already on KPIs are omitted). */
  /**
   * Parked #08 panel — not shown on KPIs tab.
   * Restore on another dashboard: insert `${leadsByCampaignPanelHtml()}` into that view’s grid.
   * Data: DATA.leadsByCampaign · source KPI_SOURCES["#08"]
   */
  function leadsByCampaignPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-leads-campaign" data-feedback-label="#08 Leads by campaign">
      ${statusCorner(true)}
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
      ${kpiRefMark("#17")}
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
      ${chartBlock({ chart: donutChart(segs) })}
      <details class="kpi-table-acc">
        <summary class="kpi-table-acc-summary">Channel table <span class="kpi-table-acc-hint">${DATA.reviews.length} directories</span></summary>
        <table class="kpi-table kpi-table-dense">
          <thead><tr><th>Channel</th><th>Rating</th><th>#</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </details>
      ${sourceFootnote("#16")}
      <p class="kpi-table-note">Google Maps + Yelp public scrape 2026-07-16. Full audit via B10.</p>
      <p class="kpi-table-note"><a class="data-guide-link" href="#picker" data-go-view="picker" data-project-id="B10">Open B10 Digital Profiles Refresh →</a></p>
      ${kpiRefMark("#16")}
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
    return `<section class="data-card${full}">
      <h3>${escapeHtml(title)}</h3>
      ${note ? `<p class="data-card-note">${escapeHtml(note)}</p>` : ""}
      <div class="data-card-body">${body || ""}</div>
    </section>`;
  }

  function renderData(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">Pav Law Data Dashboard</h2>
      </div>
    </header>
    <div class="data-grid">
      ${dataCardHtml("Lead Channel Stack", "Lead source movement and MoM.", leadsByChannelPanelHtml())}
      ${dataCardHtml("Leads By Campaign", "Parked #08 campaign lead volume.", leadsByCampaignPanelHtml())}
      ${dataCardHtml("Cases MoM", "Closed · New · Red accounts.", casesMomPanelHtml())}
      ${dataCardHtml("Referral Network", "KPI #17 · placeholder until A4 tracking wires.", totalReferralNetworkPanelHtml())}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "data");
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
