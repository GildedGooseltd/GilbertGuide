/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis
 * (former Dashboards charts live at the bottom of the KPIs tab).
 */
(function () {
  const RENDER_VER = "20260716-download-revisions";
  /** Export-backed source footnotes — file path + fields for quick re-pull. */
  const KPI_SOURCES = {
    "#01": {
      file: "Ad Reports/exports + ~/Downloads/leads-inbox (15).csv",
      fields: "Campaign / Phone calls · LSA inbox rows · HubSpot form count still stale"
    },
    "#02": {
      file: "Ad Reports/exports/mycase/as-of-2026-07-01/new-cases-by-month.csv",
      fields: "MyCase Created month · Jun 2026 = 34 · Jan–Jun 2026 = 114"
    },
    "#08": {
      file: "Ad Reports/exports/2026-07-11 · Campaign report (Search calls by campaign)",
      fields: "Campaign, Cost, Clicks, Phone calls (Military · Core DV · NTGUILT)"
    },
    "#10": {
      file: "Derived from #01 channel stack (same export batch)",
      fields: "Search share · LSA share · HubSpot / other %"
    },
    "#12": {
      file: "Ad Reports/exports · Campaign report (spend ÷ phone calls)",
      fields: "Cost, Phone calls → cost/call by campaign"
    },
    "#15": {
      file: "Ad Reports/exports/2026-07-11 · Campaign report (15).csv",
      fields: "Cost, Clicks → CPL (Jun 11 – Jul 10, 2026)"
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
    }
  };
  const DATA = {
    period: "June 2026",
    asOf: "2026-07-15",
    source: "Ad Reports/exports · MyCase contact_report 2026-07-01 (#28)",
    kpis: [
      { id: "#01", label: "Total leads", value: "58%", target: "≥ 20%", mom: "+58%", count: 166, verified: true, hit: true, alert: false, gauge: true },
      { id: "#02", label: "New cases", value: "34", target: "12", mom: "+55%", verified: true, alert: false, gauge: true, hit: true },
      { id: "#12", label: "Avg cost/call", value: "$72", target: "< $100", mom: null, verified: true, targetBar: true, lowerIsBetter: true },
      { id: "#15", label: "CPL", value: "$142", target: "≤ $120", mom: null, verified: true, alert: true, targetBar: true, lowerIsBetter: true },
      /* Team goals: #19 lost-tracker first in render, then #21, then DUI */
      { id: "#19", label: "Lost Revenue", value: "$6,060/mo", target: "$0", mom: null, verified: false, alert: true, lostTracker: true },
      { id: "#21", label: "Answered Calls", value: "69%", target: "≥ 90%", mom: "+2%", verified: false, alert: true, gauge: true, goal: true },
      /* archived for future iteration — restore by removing archived: true */
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false, archived: true },
      { id: "#28", label: "Avg case fee", value: "$5,587", target: "MyCase mean", mom: null, verified: true },
      { id: "#BHI", label: "Business health index", value: "71", target: "100", mom: "−3%", verified: false, alert: true, letterGrade: true, archived: true }
    ],
    channels: [
      { name: "Search calls", count: 54, prior: 31, mom: "+74%", spend: "$2,214", color: "#3a1a6e" },
      { name: "LSA inbox", count: 83, prior: 50, mom: "+66%", spend: "$14,206", color: "#c45c26" },
      { name: "HubSpot forms", count: 29, prior: 24, mom: "+21%", spend: "$0", color: "#2d5a3d" }
    ],
    sourceMix: [
      { name: "Paid Search", pct: 33, color: "#3a1a6e", count: 54, prior: 31, mom: "+74%" },
      { name: "LSA", pct: 50, color: "#c45c26", count: 83, prior: 50, mom: "+66%" },
      { name: "HubSpot / other", pct: 17, color: "#2d5a3d", count: 29, prior: 24, mom: "+21%" }
    ],
    /* Campaign brand: Military royal · Core DV burnt orange · NTGUILT forest (GGL — no teal) */
    searchCallsByCampaign: [
      { name: "Military", count: 36, color: "#3a1a6e" },
      { name: "Core DV", count: 14, color: "#c45c26" },
      { name: "NTGUILT", count: 4, color: "#2d5a3d" }
    ],
    leadsByCampaign: [
      { name: "Military", count: 36, prior: 28, mom: "+29%", spend: "$1,476", color: "#3a1a6e" },
      { name: "Core DV", count: 14, prior: 11, mom: "+27%", spend: "$1,980", color: "#c45c26" },
      { name: "NTGUILT", count: 4, prior: 2, mom: "+100%", spend: "$420", color: "#2d5a3d" }
    ],
    phoneIntake: {
      targetPct: 90,
      missedTargetPct: 10,
      answeredPct: 69,
      priorAnsweredPct: 67,
      missedPct: 31,
      priorMissedPct: 33,
      missedMomPp: -2,
      monthlyCalls: 54,
      /* #19 model inputs — review formula on card footnote */
      missedLsaCalls: 17, /* ≈ monthlyCalls × missedPct (Jun) · LSA unanswered */
      priorMissedLsaCalls: 18, /* ≈ monthlyCalls × priorMissedPct */
      closeRateEst: 0.70, /* estimated close rate for review — not lead→case 7.3% */
      avgCaseFee: 5587, /* #28 MyCase Client mean */
      leadToCaseRate: 9 / 124,
      /* monthlyLost / prior / YTD computed in missedRevenueModel() */
      cumulativeYtd: null
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
      { channel: "All campaigns (avg)", cost: "$72" },
      { channel: "Military", cost: "$41" },
      { channel: "Core DV", cost: "$141" },
      { channel: "NTGUILT", cost: "$105" }
    ],
    referrals: [
      { platform: "Past-client program", count: null, delta: null, status: "building", verified: false },
      { platform: "Friend / family", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Attorney cross-referral", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Yelp", count: null, delta: null, status: "not on", verified: false },
      { platform: "Nextdoor", count: null, delta: null, status: "not on", verified: false }
    ],
    reviews: [
      { platform: "Google Business Profile", rating: "—", count: null, status: "active", verified: false },
      { platform: "Yelp", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "Nextdoor Business", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Avvo", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "Justia", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "FindLaw", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Martindale", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Facebook", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "LinkedIn (firm)", rating: "—", count: null, status: "not wired", verified: false },
      { platform: "BBB", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Bing Places / Apple", rating: "—", count: null, status: "not wired", verified: false }
    ],
    verticals: [
      { name: "DUI/DWAI", jun: 4, ytd: 18 },
      { name: "Military", jun: 2, ytd: 8 },
      { name: "Traffic", jun: 2, ytd: 6 },
      { name: "DV", jun: 1, ytd: 3 }
    ],
    bhi: { value: 71, target: 100, mom: "−3%" },
    avgDeposit: { current: 400, target: 700 },
    duiGoal: { current: 18, target: 50 },
    casesMomSeries: [
      { name: "Closed cases", color: "#3a1a6e", verified: false },
      { name: "New cases", color: "#c45c26", verified: false },
      { name: "Red accounts", color: "#2d5a3d", verified: false }
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
      { month: "May", cases: 22, leads: 69, spend: 18633, lsaSpend: 11006, adsSpend: 7627, adsLeads: 39 },
      { month: "Jun", cases: 34, leads: 83, spend: 21502, lsaSpend: 13206, adsSpend: 8296, adsLeads: 138 },
      { month: "Jul*", cases: 0, leads: 57, spend: 8832, lsaSpend: 7163, adsSpend: 1669, adsLeads: 26 }
    ],
    /** Consulting allocation estimates for channel CPL (not full retainer). */
    consultingLsaMonthly: 1000,
    consultingAdsMonthly: 2000,
    cashCollected: [
      { month: "Jan", credit: 57925 },
      { month: "Feb", credit: 83950 },
      { month: "Mar", credit: 80500 },
      { month: "Apr", credit: 70026 },
      { month: "May", credit: 92140 },
      { month: "Jun", credit: 103485 },
      { month: "Jul*", credit: 44950 }
    ],
    cashCollectedTotals: {
      total2025: 945436,
      total2026ToDate: 532976,
      allCredits: 1478412
    }
  };

  function star(verified) {
    return verified
      ? '<span class="kpi-verified-mark" title="Verified — export-backed" aria-label="Verified"></span>'
      : '<span class="kpi-unverified" title="Data not acquired" aria-label="Data not acquired">✕</span>';
  }

  /** Corner badge for unverified tiles only — verified uses green outline on the card. */
  function statusCorner(verified) {
    return verified
      ? ""
      : '<span class="kpi-status-corner kpi-unverified" title="Data not acquired" aria-label="Data not acquired">✕</span>';
  }

  function verifiedClass(verified) {
    return verified ? " kpi-verified" : "";
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

  function leadsByMonthFromChannels(channels) {
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
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Closed, new, and red accounts stacked by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
    </svg>`;
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
    return `<ul class="kpi-stack-legend" aria-label="Series colors">${channels.map(c => {
      const mark = c.verified === false ? ` ${star(false)}` : c.verified === true ? ` ${star(true)}` : "";
      return `<li><span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span><span>${escapeHtml(c.name)}${mark}</span></li>`;
    }).join("")}</ul>`;
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
    const vClass = opts.verified === true ? " kpi-verified" : "";
    return `<div class="kpi-chart-card${vClass}"${focus}>
      ${badge}
      ${head}
      <div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>
      ${table}
    </div>`;
  }

  /** Dual-axis: cases + LSA leads (left count) · marketing spend (right $). */
  function dualAxisCasesSpendChart(rows) {
    const w = 720;
    const h = 300;
    const pad = { l: 56, r: 64, t: 36, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const leftMax = 100;
    const rightMax = 25000;
    const leftY = v => pad.t + plotH * (1 - v / leftMax);
    const rightY = v => pad.t + plotH * (1 - v / rightMax);
    const slot = plotW / rows.length;
    const colors = { cases: "#3a1a6e", leads: "#2d5a3d", spend: "#c45c26" };
    const leftTicks = [0, 25, 50, 75, 100].map(t => {
      const y = leftY(t);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${t}</text>
      </g>`;
    }).join("");
    const rightTicks = [0, 5000, 10000, 15000, 20000, 25000].map(t => {
      const y = rightY(t);
      const label = t === 0 ? "$0" : `$${t / 1000}k`;
      return `<text x="${w - pad.r + 8}" y="${y + 4}" class="kpi-chart-axis">${label}</text>`;
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
      <text x="${w - 12}" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(90 ${w - 12} ${pad.t + plotH / 2})" class="kpi-chart-axis">Spend ($)</text>
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
    const lsaConsult = DATA.consultingLsaMonthly || 0;
    const adsConsult = DATA.consultingAdsMonthly || 0;
    const totals = rows.reduce((a, r) => ({
      leads: a.leads + r.leads,
      lsaAllIn: a.lsaAllIn + (r.lsaSpend || 0) + lsaConsult,
      adsLeads: a.adsLeads + (r.adsLeads || 0),
      adsAllIn: a.adsAllIn + (r.adsSpend || 0) + adsConsult
    }), { leads: 0, lsaAllIn: 0, adsLeads: 0, adsAllIn: 0 });
    return kpiDetailTable(
      ["Period", "LSA leads", "LSA + $1k consulting", "Cost per LSA lead", "Ads + $2k consulting", "Cost per digital lead"],
      [
        ...rows.map(r => {
          const lsaAllIn = (r.lsaSpend || 0) + lsaConsult;
          const adsAllIn = (r.adsSpend || 0) + adsConsult;
          const adsLeads = r.adsLeads || 0;
          return [
            escapeHtml(r.month) + " 2026",
            String(r.leads),
            fmtMoney(lsaAllIn),
            fmtMoney(lsaAllIn / r.leads),
            fmtMoney(adsAllIn),
            adsLeads ? fmtMoney(adsAllIn / adsLeads) : "—"
          ];
        }),
        [
          "May–Jun totals",
          String(totals.leads),
          fmtMoney(totals.lsaAllIn),
          fmtMoney(totals.lsaAllIn / totals.leads),
          fmtMoney(totals.adsAllIn),
          totals.adsLeads ? fmtMoney(totals.adsAllIn / totals.adsLeads) : "—"
        ]
      ]
    );
  }

  function casesLeadsSpendSectionHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified" data-feedback-id="section-cases-leads-spend" data-feedback-label="Cases and leads vs marketing spend">
      ${kpiSectionStaticHead("Cases and leads vs marketing spend", "Left: counts · Right: $ spend")}
      <div class="kpi-section-body">
        <p class="kpi-section-intro">Cost per LSA lead = (LSA media + ${fmtMoney(DATA.consultingLsaMonthly || 0)} consulting) ÷ LSA leads. Cost per digital lead = (Search media + ${fmtMoney(DATA.consultingAdsMonthly || 0)} consulting) ÷ Search call details. Trust omitted.</p>
        ${chartBlock({
          verified: true,
          chart: dualAxisCasesSpendChart(rows),
          legend: casesLeadsSpendLegend(),
          table: casesLeadsSpendTable(rows)
        })}
        ${sourceFootnote("cases-leads-spend")}
      </div>
    </section>`;
  }

  function cashCollectedChart(rows) {
    const max = Math.max(...rows.map(r => r.credit), 1);
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
    const bars = rows.map((r, i) => {
      const bh = Math.max(6, (plotH * r.credit) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="#2d5a3d"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">$${Math.round(r.credit / 1000)}k</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cash collected by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function cashCollectedTable(rows) {
    const ytd = rows.reduce((s, r) => s + r.credit, 0);
    return kpiDetailTable(
      ["Month", "Cash collected (Ledger Credits)"],
      [
        ...rows.map(r => [escapeHtml(r.month) + " 2026", fmtMoney(r.credit)]),
        ["2026 to date", fmtMoney(ytd)],
        ["2025 total", fmtMoney(DATA.cashCollectedTotals.total2025)],
        ["All ledger credits", fmtMoney(DATA.cashCollectedTotals.allCredits)]
      ]
    );
  }

  function cashCollectedSectionHtml() {
    const rows = DATA.cashCollected || [];
    if (!rows.length) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified" data-feedback-id="section-cash-collected" data-feedback-label="Cash collected">
      ${kpiSectionStaticHead("Cash collected from MyCase ledger", "Credits · aggregate only")}
      <div class="kpi-section-body">
        <p class="kpi-section-intro">New Downloads ledger file adds cash-collected truth beside #28 contracted fee. Jul is through Jul 15 only. No client names shown.</p>
        ${chartBlock({
          verified: true,
          chart: cashCollectedChart(rows),
          table: cashCollectedTable(rows)
        })}
        ${sourceFootnote("cash-collected")}
      </div>
    </section>`;
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
      `<span class="${momClass(c.mom)}">${escapeHtml(c.mom)}</span>`,
      escapeHtml(c.spend)
    ]);
    rows.push([
      "<strong>Total</strong>",
      `<strong>${mayTotal}</strong>`,
      `<strong>${junTotal}</strong>`,
      `<strong>${junTotal - mayTotal >= 0 ? "+" : ""}${junTotal - mayTotal}</strong>`,
      `<strong class="${momClass(momLabel)}">${escapeHtml(momLabel)}</strong>`,
      "—"
    ]);
    return kpiDetailTable(
      [firstCol, "May", "Jun", "Δ", "MoM", "Spend"],
      rows
    );
  }

  function channelsDetailTable(channels) {
    return stackedSeriesDetailTable(channels, { firstCol: "Lead type", totalMom: "+18%" });
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
        s.mom ? `<span class="${momClass(s.mom)}">${escapeHtml(s.mom)}</span>` : "—"
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
      `<strong class="${momClass(momTotalPct)}">${momTotalPct}</strong>`
    ]);
    const note = `<p class="kpi-table-note">Est. potential client revenue = leads × ${(rate * 100).toFixed(1)}% lead→case × ${fmtMoney(fee)} avg case (#28).</p>`;
    return (
      kpiDetailTable(["Source", "Leads", "Share", "Est. potential revenue"], leadRows) +
      `<h4 class="kpi-subtable-title">MoM comparison</h4>` +
      kpiDetailTable(["Source", "Prior", "Current", "Δ leads", "MoM"], momRows) +
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
      <svg class="kpi-chart-svg kpi-donut-svg" viewBox="0 0 112 112" role="img" aria-label="Source mix donut">${arcs}<circle cx="${cx}" cy="${cy}" r="24" fill="var(--gg-paper)"/></svg>
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
    const missed = Number(p.missedLsaCalls);
    const priorMissed = Number(p.priorMissedLsaCalls);
    const close = Number(p.closeRateEst);
    const fee = Number(p.avgCaseFee);
    const monthlyLost = Math.round(missed * close * fee);
    const priorMonthlyLost = Math.round(priorMissed * close * fee);
    const ytdMonths = 6;
    const cumulativeYtd = p.cumulativeYtd != null
      ? Number(p.cumulativeYtd)
      : Math.round(((monthlyLost + priorMonthlyLost) / 2) * ytdMonths);
    return {
      missedLsaCalls: missed,
      priorMissedLsaCalls: priorMissed,
      closeRateEst: close,
      avgCaseFee: fee,
      monthlyLost,
      priorMonthlyLost,
      cumulativeYtd,
      ytdMonths,
      formulaText: `Missed LSA calls × ${Math.round(close * 100)}% close rate × avg case value`,
      formulaWorked: `${missed} × ${Math.round(close * 100)}% × ${fmtMoney(fee)} = ${fmtMoney(monthlyLost)}/mo`
    };
  }

  function missedRevenuePanel(pi) {
    const model = missedRevenueModel(pi);
    const momLabel = pi.missedMomPp < 0
      ? `↓ ${Math.abs(pi.missedMomPp)} pp fewer missed (MoM)`
      : pi.missedMomPp > 0
        ? `↑ +${pi.missedMomPp} pp more missed (MoM)`
        : "No change MoM";
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
          ["Missed LSA calls", String(model.missedLsaCalls), `rate ${pi.missedPct}% · goal ≤ ${pi.missedTargetPct}%`],
          ["Close rate (est.)", `${Math.round(model.closeRateEst * 100)}%`, "Review assumption"],
          ["Avg case value", fmtMoney(model.avgCaseFee), "KPI #28"],
          ["Est. lost (Jun)", fmtMoney(model.monthlyLost), escapeHtml(model.formulaWorked)],
          ["YTD cumulative", fmtMoney(model.cumulativeYtd), `avg of Jun/prior × ${model.ytdMonths} mo`]
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
    const fillAmt = celebrate ? 1 : clamped;
    const arcLen = Math.PI * r;
    const dashLen = Math.max(0, Math.min(arcLen, fillAmt * arcLen));
    const endLabel = opts.endLabel != null ? opts.endLabel : "";
    const valueLabel = opts.valueLabel != null ? String(opts.valueLabel) : "";
    const aria = celebrate ? "Target reached" : "Progress rim gauge";
    const track = "var(--gg-cream-panel)";
    const arcD = `M ${left.x} ${left.y} A ${r} ${r} 0 0 1 ${right.x} ${right.y}`;

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 118" role="img" aria-label="${aria}">
      <defs><linearGradient id="${rimGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${celebrate ? goldStops : progressStops}</linearGradient></defs>
      <path d="${arcD}" fill="none" stroke="${track}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <path d="${arcD}" fill="none" stroke="url(#${rimGradId})" stroke-width="${strokeW}" stroke-linecap="round"
        stroke-dasharray="${dashLen.toFixed(2)} ${(arcLen + 1).toFixed(2)}"/>
      <text x="22" y="108" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="166" y="108" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
      ${valueLabel !== "" ? `<text x="${cx}" y="${cy - 6}" class="kpi-gauge-center" text-anchor="middle">${escapeHtml(valueLabel)}</text>` : ""}
    </svg>`;
  }

  function duiGoalTargetBarChart() {
    const { current, target } = DATA.duiGoal;
    return barWithTargetChart(
      [{ label: "Signed", value: current }],
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
    const pct = DATA.duiGoal.current / DATA.duiGoal.target;
    const hit = pct >= 1;
    return `<button type="button" class="kpi-goal-card kpi-stat-target-bar" data-kpi-focus="#DUI">
      ${statusCorner(false)}
      <div class="kpi-goal-visual">
        <span class="kpi-stat-id"># DUIs Signed 2026</span>
        ${duiGoalTargetBarChart()}
      </div>
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
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
        ["MoM", "—"]
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
    const w = opts.width || (compact ? 210 : 420);
    const h = opts.height || (compact ? 112 : 200);
    const pad = compact
      ? { l: 10, r: 10, t: 10, b: 30 }
      : { l: 20, r: 20, t: 20, b: 44 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / bars.length;
    const barW = Math.min(compact ? 34 : 56, slot * 0.52);
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
      const lineW = barW + 14;
      const lineX = x + barW / 2 - lineW / 2;
      const targetText = i === 0
        ? `<text x="${lineX - 3}" y="${targetY + 4}" text-anchor="end" class="kpi-target-label">${escapeHtml(targetLabel)}</text>`
        : "";
      return `<g class="kpi-target-bar-group">
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${baselineY - 5}" text-anchor="middle" class="kpi-target-bar-val" fill="${textFill}">${escapeHtml(valLabel)}</text>
        <line x1="${lineX}" y1="${targetY}" x2="${lineX + lineW}" y2="${targetY}" class="kpi-target-line"/>
        ${targetText}
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-target-bar-cat">${escapeHtml(shortLabel)}</text>
      </g>`;
    }).join("");

    return `<svg class="kpi-chart-svg kpi-target-bar-chart${compact ? " kpi-target-bar-chart-compact" : ""}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(opts.ariaLabel || "Actual vs target bar chart")}">
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" class="kpi-target-baseline"/>
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
    const items = k.id === "#12" ? costPerCallBarItems() : k.id === "#15" ? cplByCampaignItems() : (k.targetBarItems || []);
    return barWithTargetChart(items, {
      target,
      lowerIsBetter: k.lowerIsBetter !== false,
      targetStr: k.target,
      compact: true,
      ariaLabel: k.id === "#12"
        ? `${k.label} ${k.value} vs ${k.target}`
        : `${k.label} by campaign vs ${k.target}`
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

  function kpiGoalTrackFor(k) {
    const rows = [
      ["MoM", k.mom ? `<span class="${momClass(k.mom)}">${escapeHtml(k.mom)}</span>` : "—"]
    ];
    return goalTrackRows(rows);
  }

  function kpiGoalCardHtml(k) {
    /* Keep #19 lost-tracker chrome in goals grid — do not force gauge layout */
    if (k.lostTracker) return missedRevenueTrackerHtml();
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    const vClass = verifiedClass(!!k.verified);
    const foot = k.verified ? sourceFootnote(k.id) : "";
    if (nums) {
      const grad = "goal-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || nums.pct >= 1);
      return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        <div class="kpi-goal-visual">
          <span class="kpi-stat-id">${k.id} ${escapeHtml(k.label)}</span>
          ${halfMoonGauge(Math.min(nums.pct, 1), grad, {
            endLabel: String(nums.target),
            celebrate: hit,
            valueLabel: `${k.value} / ${k.target.replace(/^[≥≤<>]\s*/, "")}`
          })}
        </div>
        ${kpiGoalTrackFor(k)}
        ${foot}
      </button>`;
    }
    const lostCap = 6000;
    const lostN = parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0;
    const lostPct = Math.min(1, lostN / lostCap);
    const grad = "goal-" + String(k.id).replace(/\W/g, "");
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      <div class="kpi-goal-visual">
        <span class="kpi-stat-id">${k.id}${k.alert ? " · Requires action" : ""}</span>
        ${halfMoonGauge(lostPct, grad, {
          endLabel: k.target || "$0",
          valueLabel: k.value
        })}
      </div>
      ${kpiGoalTrackFor(k)}
      ${foot}
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
      <span class="kpi-stat-id">${k.id} ${escapeHtml(k.label)}</span>
      <span class="kpi-bhi-grade-letter">${escapeHtml(grade)}</span>
      <span class="kpi-bhi-grade-pct">${score}%</span>
      <span class="kpi-stat-label">target ${escapeHtml(k.target || "100")}</span>
      ${k.mom ? `<span class="${momClass(k.mom)}">${escapeHtml(k.mom)} MoM</span>` : ""}
      ${k.verified ? sourceFootnote(k.id) : ""}
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
    const fmtPct = n => `${Math.round(Number(n) * 100)}%`;
    const delta = model.priorMonthlyLost != null ? model.monthlyLost - model.priorMonthlyLost : null;
    let deltaHtml = "—";
    if (delta != null) {
      const abs = Math.abs(delta);
      const cls = delta <= 0 ? "kpi-mom-up" : "kpi-mom-down";
      const sign = delta <= 0 ? "−" : "+";
      deltaHtml = `<span class="${cls}">${sign}${fmtMoney(abs)}/mo vs prior</span>`;
    }
    return `<button type="button" class="kpi-stat-card kpi-lost-tracker kpi-stat-attention kpi-stat-target-bar" data-kpi-focus="#19">
      ${statusCorner(false)}
      <span class="kpi-stat-id">#19 Lost Revenue</span>
      <span class="kpi-lost-amount">${fmtMoney(model.monthlyLost)}<small>/mo</small></span>
      <span class="kpi-stat-label">Ongoing money lost from unanswered LSA calls</span>
      ${missedCallsTargetBarChart(p)}
      <ul class="kpi-lost-facts">
        <li><strong>Missed LSA calls</strong> ${model.missedLsaCalls} <span class="kpi-lost-muted">(${p.missedPct}% of ${p.monthlyCalls})</span></li>
        <li><strong>Avg case value</strong> ${fmtMoney(model.avgCaseFee)} <span class="kpi-lost-muted">(#28)</span></li>
        <li><strong>Close rate (est.)</strong> ${fmtPct(model.closeRateEst)}</li>
        <li><strong>YTD lost</strong> ${fmtMoney(model.cumulativeYtd)}</li>
        <li><strong>Trend</strong> ${deltaHtml}</li>
      </ul>
      <span class="kpi-formula-footnote" title="Review assumption — close rate is estimated, not lead→case ${((p.leadToCaseRate || 0) * 100).toFixed(1)}%">
        <span class="kpi-source-label">Formula</span>
        ${escapeHtml(model.formulaText)} → ${escapeHtml(model.formulaWorked)}
      </span>
    </button>`;
  }

  function kpiStatCardHtml(k) {
    if (k.lostTracker) return missedRevenueTrackerHtml();
    if (k.letterGrade || k.id === "#BHI") return bhiLetterGradeCardHtml(k);
    const headline = `${k.id} ${k.label}`;
    const targetLine = k.target ? `target ${k.target}` : "";
    const vClass = verifiedClass(!!k.verified);
    const foot = k.verified ? sourceFootnote(k.id) : "";
    if (k.targetBar) {
      const targetNum = parseTargetNum(k.target);
      const hit = meetsTarget(parseMetricNum(k.value), targetNum, k.lowerIsBetter !== false);
      return `<button type="button" class="kpi-stat-card kpi-stat-target-bar${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        <span class="kpi-stat-id">${headline}</span>
        ${targetBarChartForKpi(k)}
        <span class="kpi-stat-label">Avg ${escapeHtml(k.value)} · ${escapeHtml(targetLine)}</span>
        ${k.mom ? `<span class="${momClass(k.mom)}">${escapeHtml(k.mom)} MoM</span>` : ""}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
      </button>`;
    }
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    if (nums) {
      const grad = "km-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || nums.pct >= 1);
      const isMomGoal = k.id === "#01";
      const valueLabel = isMomGoal
        ? `${nums.current}% / ${nums.target}%`
        : `${k.value} / ${String(k.target).replace(/^[≥≤<>]\s*/, "")}`;
      const goalLine = isMomGoal
        ? `${k.count != null ? `${k.count} net · ` : ""}goal ≥ ${nums.target}% MoM new leads`
        : targetLine;
      return `<button type="button" class="kpi-stat-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        <span class="kpi-stat-id">${headline}</span>
        ${halfMoonGauge(Math.min(nums.pct, 1), grad, {
          endLabel: isMomGoal ? `${nums.target}%` : String(nums.target),
          celebrate: hit,
          valueLabel
        })}
        <span class="kpi-stat-label">${goalLine}</span>
        ${k.mom ? `<span class="${momClass(k.mom)}">${k.mom} MoM</span>` : ""}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
      </button>`;
    }
    return `<button type="button" class="kpi-stat-card${vClass}${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      <span class="kpi-stat-id">${headline}</span>
      <span class="kpi-stat-val">${k.value}</span>
      <span class="kpi-stat-label">${targetLine}</span>
      ${k.mom ? `<span class="${momClass(k.mom)}">${k.mom} MoM</span>` : ""}
      ${k.hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${foot}
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
      ${casesLeadsSpendSectionHtml()}
      ${cashCollectedSectionHtml()}
      ${feeByPracticeSectionHtml()}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionStaticHead("Key metrics", "")}
        <div class="kpi-section-body">
          <div class="kpi-stat-grid">${kpiCards}</div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static kpi-section-leads-split" data-feedback-id="section-leads-channel" data-feedback-label="Leads by channel">
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <article class="kpi-split-panel kpi-verified" data-feedback-id="section-leads-channel-01" data-feedback-label="#01 Leads by channel">
              ${kpiSectionStaticHead("#01 Leads by channel", "Stacked by month")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#01",
                  chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.channels)),
                  legend: channelLegend(DATA.channels),
                  table: channelsDetailTable(DATA.channels)
                })}
                ${sourceFootnote("#01")}
              </div>
            </article>
          </div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-reputation" data-feedback-label="Reputation">
        ${kpiSectionStaticHead("Reputation", "Reviews by channel · includes gap channels")}
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <div class="kpi-mini-card" data-kpi-focus="#16">
              ${statusCorner(false)}
              <h3>#16 Reviews by channel</h3>
              ${(() => {
                const segs = presencePieSegments(DATA.reviews);
                return chartBlock({ chart: donutChart(segs) });
              })()}
              <table class="kpi-table">
                <thead><tr><th>Channel</th><th>Rating</th><th># Reviews</th></tr></thead>
                <tbody>${DATA.reviews.map(r => `<tr class="${r.status !== "active" ? "kpi-row-gap" : ""}">
                  <td>${star(!!r.verified)} ${r.platform}</td>
                  <td>${dash(r.rating)}</td>
                  <td>${dash(r.count)}</td>
                </tr>`).join("")}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      ${dashboardSectionsHtml()}`;
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
    return `<article class="kpi-split-panel kpi-verified" data-feedback-id="section-leads-campaign" data-feedback-label="#08 Leads by campaign">
      ${kpiSectionStaticHead("#08 Leads by campaign", "Stacked by month")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#08",
          chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.leadsByCampaign)),
          legend: channelLegend(DATA.leadsByCampaign),
          table: campaignLeadsDetailTable(DATA.leadsByCampaign)
        })}
        ${sourceFootnote("#08")}
      </div>
    </article>`;
  }

  /**
   * Parked #17 tile — not shown on KPIs tab.
   * Doc snapshot: parked/KPI-17-REFERRAL-NETWORK.md
   * Restore: insert `${totalReferralNetworkPanelHtml()}` on another dashboard.
   */
  function totalReferralNetworkPanelHtml() {
    return `<div class="kpi-mini-card" data-kpi-focus="#17">
      ${statusCorner(false)}
      <h3>#17 Total Referral Network</h3>
      ${(() => {
        const segs = presencePieSegments(DATA.referrals);
        return chartBlock({ chart: donutChart(segs) });
      })()}
      <table class="kpi-table">
        <thead><tr><th>Channel</th><th>Referrers</th><th>Δ MoM</th></tr></thead>
        <tbody>${DATA.referrals.map(r => `<tr class="${r.status !== "active" ? "kpi-row-gap" : ""}">
          <td>${star(!!r.verified)} ${r.platform}</td>
          <td>${dash(r.count)}</td>
          <td class="${momClass(r.delta)}">${dash(r.delta)}</td>
        </tr>`).join("")}</tbody>
      </table>
    </div>`;
  }

  function dashboardSectionsHtml() {
    const depositHit = meetsTarget(DATA.avgDeposit.current, DATA.avgDeposit.target, false);
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-business-health" data-feedback-label="Pipeline & deposits">
        ${kpiSectionStaticHead("Pipeline & source mix")}
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <article class="kpi-split-panel" data-feedback-id="section-cases-mom" data-feedback-label="#04 / #05 Cases MoM">
              ${statusCorner(false)}
              ${kpiSectionStaticHead("#04 / #05 Cases MoM", "Closed · New · Red accounts")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#04",
                  verified: false,
                  head: `<span class="kpi-mom-up">Closed ↑ +38%</span> · <span class="kpi-mom-down">New ↓ −25%</span> · Red accounts placeholder`,
                  chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
                  legend: channelLegend(DATA.casesMomSeries),
                  table: casesMomDetailTable(DATA.casesMom)
                })}
              </div>
            </article>
            <article class="kpi-split-panel kpi-verified" data-feedback-id="section-source-mix" data-feedback-label="#10 Source mix">
              ${kpiSectionStaticHead("#10 Source mix", "Lead share by channel")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#10",
                  chart: donutChart(DATA.sourceMix),
                  table: sourceMixDetailTable(DATA.sourceMix)
                })}
                ${sourceFootnote("#10")}
              </div>
            </article>
          </div>
          <div class="kpi-dash-grid-2 kpi-dash-grid-1" style="margin-top:1rem">
            <div class="kpi-dash-card kpi-dash-target-bar" data-kpi-focus="#DEPOSIT">
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
            </div>
          </div>
        </div>
      </section>`;
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
    renderDashboards,
    renderAll,
    focusKpi,
    getData: () => ({ ...DATA }),
    /** Parked panels for other dashboard views */
    parked: {
      leadsByCampaignPanelHtml,
      totalReferralNetworkPanelHtml
    },
    refresh() {
      document.querySelectorAll("[data-rendered]").forEach(el => {
        delete el.dataset.rendered;
        el.innerHTML = "";
      });
    }
  };
})();
