/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis and #kpi-report-dashboards.
 */
(function () {
  const RENDER_VER = "20260714-status-v15";
  const DATA = {
    period: "June 2026",
    asOf: "2026-07-11",
    source: "Ad Reports/exports/2026-07-11",
    kpis: [
      { id: "#01", label: "Total leads", value: "124", target: "110", mom: "+18%", verified: true, hit: true, gauge: true },
      { id: "#02", label: "New cases", value: "9", target: "12", mom: "−25%", verified: false, alert: false, gauge: true },
      { id: "#12", label: "Cost/call Military", value: "$41", target: "< $100", mom: null, verified: true },
      { id: "#15", label: "CPL", value: "$142", target: "≤ $120", mom: null, verified: true, alert: true },
      { id: "#21", label: "Answered phones", value: "69%", target: "≥ 90%", mom: "+2%", verified: false, alert: true, gauge: true, goal: true },
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false },
      { id: "#28", label: "Avg case fee", value: "$3,870", target: "Q2 review", mom: null, verified: false },
      { id: "#19", label: "Missed revenue", value: "$4,200/mo", target: "$0", mom: null, verified: false, alert: true, goal: true }
    ],
    channels: [
      { name: "Search calls", count: 54, prior: 31, mom: "+74%", spend: "$2,214", color: "#3a1a6e" },
      { name: "LSA inbox", count: 41, prior: 38, mom: "+8%", spend: "$12,792", color: "#00d4c4" },
      { name: "HubSpot forms", count: 29, prior: 24, mom: "+21%", spend: "$0", color: "#b8860b" }
    ],
    sourceMix: [
      { name: "Paid Search", pct: 44, color: "#3a1a6e" },
      { name: "LSA", pct: 33, color: "#00d4c4" },
      { name: "HubSpot / other", pct: 23, color: "#b8860b" }
    ],
    /* Campaign brand: Military royal · Core DV teal · NTGUILT gold */
    searchCallsByCampaign: [
      { name: "Military", count: 36, color: "#3a1a6e" },
      { name: "Core DV", count: 14, color: "#00d4c4" },
      { name: "NTGUILT", count: 4, color: "#b8860b" }
    ],
    leadsByCampaign: [
      { name: "Military", count: 36, prior: 28, mom: "+29%", spend: "$1,476", color: "#3a1a6e" },
      { name: "Core DV", count: 14, prior: 11, mom: "+27%", spend: "$1,980", color: "#00d4c4" },
      { name: "NTGUILT", count: 4, prior: 2, mom: "+100%", spend: "$420", color: "#b8860b" }
    ],
    phoneIntake: {
      targetPct: 90,
      answeredPct: 69,
      priorAnsweredPct: 67,
      missedPct: 31,
      priorMissedPct: 33,
      missedMomPp: -2,
      monthlyCalls: 54,
      avgCaseFee: 3870,
      leadToCaseRate: 9 / 124,
      monthlyLost: 4200,
      priorMonthlyLost: 4800,
      cumulativeYtd: 27300
    },
    costPerCall: [{ channel: "Military", cost: "$41" }, { channel: "NTGUILT (est.)", cost: "TBD" }],
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
      { name: "New cases", color: "#00d4c4", verified: false },
      { name: "Red accounts", color: "#4c1d95", verified: false }
    ],
    casesMom: [
      { month: "Apr", closed: 6, newCases: 12, redAccounts: 3 },
      { month: "May", closed: 8, newCases: 12, redAccounts: 2 },
      { month: "Jun", closed: 11, newCases: 9, redAccounts: 4 }
    ],
    pipeline: [
      { month: "Jun", closed: 11, mom: "+38%" },
      { month: "Jun", rate: "51%", retained: 14 }
    ]
  };

  function star(verified) {
    return verified
      ? '<span class="kpi-star" title="Export on file">★</span>'
      : '<span class="kpi-unverified" title="Source not wired yet" aria-label="Not verified">✕</span>';
  }

  /** Corner badge for tiles / section cards (upper-left quick reference). */
  function statusCorner(verified) {
    return verified
      ? '<span class="kpi-status-corner kpi-star" title="Export on file" aria-label="Export on file">★</span>'
      : '<span class="kpi-status-corner kpi-unverified" title="Source not wired yet" aria-label="Not wired yet">✕</span>';
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
    return `<div class="kpi-chart-card"${focus}>
      ${badge}
      ${head}
      <div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>
      ${table}
    </div>`;
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
    return kpiDetailTable(
      ["Source", "Share"],
      segments.map(s => [
        `<span class="kpi-stack-swatch" style="background:${s.color}" aria-hidden="true"></span> ${escapeHtml(s.name)}`,
        `${s.pct}%`
      ])
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

  function missedRevenuePanel(pi) {
    const momLabel = pi.missedMomPp < 0
      ? `↓ ${Math.abs(pi.missedMomPp)} pp fewer missed (MoM)`
      : pi.missedMomPp > 0
        ? `↑ +${pi.missedMomPp} pp more missed (MoM)`
        : "No change MoM";
    const momClassName = pi.missedMomPp <= 0 ? "kpi-mom-up" : "kpi-mom-down";
    const maxLost = Math.max(pi.monthlyLost, pi.priorMonthlyLost, pi.cumulativeYtd / 6, 1);
    const priorW = Math.max(12, (pi.priorMonthlyLost / maxLost) * 160);
    const currW = Math.max(12, (pi.monthlyLost / maxLost) * 160);
    const cumW = Math.max(12, (pi.cumulativeYtd / (maxLost * 6)) * 160);
    return `<div class="kpi-missed-panel">
      <div class="kpi-missed-stats">
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Missed calls</span>
          <span class="kpi-missed-val">${pi.missedPct}%</span>
          <span class="kpi-missed-sub">was ${pi.priorMissedPct}% prior month · <span class="${momClassName}">${momLabel}</span></span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Est. revenue lost (Jun)</span>
          <span class="kpi-missed-val">${fmtMoney(pi.monthlyLost)}</span>
          <span class="kpi-missed-sub">was ${fmtMoney(pi.priorMonthlyLost)} prior month</span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Cumulative YTD lost</span>
          <span class="kpi-missed-val">${fmtMoney(pi.cumulativeYtd)}</span>
          <span class="kpi-missed-sub">Jan–Jun est. from unanswered calls × ${(pi.leadToCaseRate * 100).toFixed(1)}% lead→case × ${fmtMoney(pi.avgCaseFee)} avg fee</span>
        </div>
      </div>
      <svg class="kpi-chart-svg" viewBox="0 0 260 100" role="img" aria-label="Missed revenue comparison">
        <text x="0" y="14" class="kpi-chart-axis">Prior mo lost</text>
        <rect x="88" y="4" width="${priorW}" height="16" rx="4" fill="#3a1a6e" opacity="0.45"/>
        <text x="${88 + priorW + 6}" y="16" class="kpi-chart-val-sm">${fmtMoney(pi.priorMonthlyLost)}</text>
        <text x="0" y="44" class="kpi-chart-axis">Jun lost</text>
        <rect x="88" y="34" width="${currW}" height="16" rx="4" fill="#3a1a6e"/>
        <text x="${88 + currW + 6}" y="46" class="kpi-chart-val-sm">${fmtMoney(pi.monthlyLost)}</text>
        <text x="0" y="74" class="kpi-chart-axis">YTD cumulative</text>
        <rect x="88" y="64" width="${cumW}" height="16" rx="4" fill="#b8860b"/>
        <text x="${88 + cumW + 6}" y="76" class="kpi-chart-val-sm">${fmtMoney(pi.cumulativeYtd)}</text>
      </svg>
      ${kpiDetailTable(
        ["Measure", "Value", "Notes"],
        [
          ["Missed call rate", `${pi.missedPct}%`, `was ${pi.priorMissedPct}% · <span class="${momClassName}">${momLabel}</span>`],
          ["Est. lost (Jun)", fmtMoney(pi.monthlyLost), `prior ${fmtMoney(pi.priorMonthlyLost)}`],
          ["YTD cumulative", fmtMoney(pi.cumulativeYtd), `${(pi.leadToCaseRate * 100).toFixed(1)}% lead→case × ${fmtMoney(pi.avgCaseFee)} avg fee`]
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
    active: "#00d4c4",
    building: "#b8860b",
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
    const cy = 72;
    const r = 68;
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    const fillGradId = `${gradId}-fill`;
    const goldStops = `<stop offset="0%" stop-color="${GOLD_GAUGE.pale}"/><stop offset="40%" stop-color="${GOLD_GAUGE.mid}"/><stop offset="100%" stop-color="${GOLD_GAUGE.dark}"/>`;
    const progressStops = `<stop offset="0%" stop-color="${PROGRESS_GAUGE.red}"/><stop offset="45%" stop-color="${PROGRESS_GAUGE.mid}"/><stop offset="100%" stop-color="${PROGRESS_GAUGE.green}"/>`;
    const fillAmt = celebrate ? 1 : clamped;
    const fillPath = halfMoonFillPath(cx, cy, r, fillAmt);
    const endLabel = opts.endLabel != null ? opts.endLabel : "";
    const aria = celebrate ? "Target reached" : "Progress half-moon gauge";
    const arcStroke = celebrate ? GOLD_GAUGE.dark : PROGRESS_GAUGE.green;

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 112" role="img" aria-label="${aria}">
      <defs><linearGradient id="${fillGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${celebrate ? goldStops : progressStops}</linearGradient></defs>
      <line x1="${left.x}" y1="${cy}" x2="${right.x}" y2="${cy}" stroke="var(--gg-royal-border)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 22 72 A 68 68 0 0 1 166 72" fill="none" stroke="var(--gg-cream-panel)" stroke-width="10" stroke-linecap="round"/>
      ${fillPath ? `<path d="${fillPath}" fill="url(#${fillGradId})"/>` : ""}
      <path d="M 22 72 A 68 68 0 0 1 166 72" fill="none" stroke="${arcStroke}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
      <text x="22" y="98" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="166" y="98" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
    </svg>`;
  }

  function teamDuiGoalCardHtml() {
    const pct = DATA.duiGoal.current / DATA.duiGoal.target;
    const hit = pct >= 1;
    return `<button type="button" class="kpi-stat-card kpi-stat-gauge" data-kpi-focus="#DUI">
      ${statusCorner(false)}
      <span class="kpi-stat-id">DUI YTD</span>
      ${halfMoonGauge(Math.min(pct, 1), "goal-dui", { endLabel: String(DATA.duiGoal.target), celebrate: hit })}
      <span class="kpi-gauge-val">${DATA.duiGoal.current} / ${DATA.duiGoal.target}</span>
      <span class="kpi-stat-label">50 DUI cases · calendar year</span>
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
    </button>`;
  }

  function goalTrackRows(rows) {
    return `<table class="kpi-goal-track"><tbody>${rows.map(([k, v]) =>
      `<tr><th scope="row">${k}</th><td>${v}</td></tr>`
    ).join("")}</tbody></table>`;
  }

  function placeholderGoalCardHtml() {
    return `<button type="button" class="kpi-goal-card kpi-goal-placeholder" data-kpi-focus="#GOAL3" disabled aria-disabled="true">
      ${statusCorner(false)}
      <div class="kpi-goal-visual">
        <span class="kpi-goal-eyebrow">Team goal</span>
        <span class="kpi-stat-id">#—</span>
        ${halfMoonGauge(0, "goal-placeholder", { endLabel: "—" })}
        <span class="kpi-gauge-val">— / —</span>
      </div>
      ${goalTrackRows([
        ["Metric", "Third team goal"],
        ["Actual", "—"],
        ["Target", "—"],
        ["MoM", "—"],
        ["Status", "Placeholder — add next goal"]
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
    return `<p class="kpi-legend kpi-legend-top"><span class="kpi-star">★</span> Gold star = export on file &nbsp; <span class="kpi-unverified">✕</span> Red ✕ = not wired yet</p>`;
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

  function kpiGoalCardHtml(k) {
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    const status = (k.hit || (nums && nums.pct >= 1))
      ? '<span class="kpi-target-hit">Target reached</span>'
      : (k.alert ? "Requires action" : "Open goal");
    if (nums) {
      const grad = "goal-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || nums.pct >= 1);
      return `<button type="button" class="kpi-goal-card kpi-stat-gauge${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        <div class="kpi-goal-visual">
          <span class="kpi-goal-eyebrow">Team goal</span>
          <span class="kpi-stat-id">${k.id}</span>
          ${halfMoonGauge(Math.min(nums.pct, 1), grad, { endLabel: String(nums.target), celebrate: hit })}
          <span class="kpi-gauge-val">${k.value} / ${k.target.replace(/^[≥≤<>]\s*/, "")}</span>
        </div>
        ${goalTrackRows([
          ["Metric", escapeHtml(k.label)],
          ["Actual", escapeHtml(k.value)],
          ["Target", escapeHtml(k.target)],
          ["MoM", k.mom ? `<span class="${momClass(k.mom)}">${escapeHtml(k.mom)}</span>` : "—"],
          ["Status", typeof status === "string" ? status : "Open goal"]
        ])}
      </button>`;
    }
    const lostCap = 6000;
    const lostN = parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0;
    const lostPct = Math.min(1, lostN / lostCap);
    const grad = "goal-" + String(k.id).replace(/\W/g, "");
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      <div class="kpi-goal-visual">
        <span class="kpi-goal-eyebrow">Team goal</span>
        <span class="kpi-stat-id">${k.id}${k.alert ? " · Requires action" : ""}</span>
        ${halfMoonGauge(lostPct, grad, { endLabel: escapeHtml(k.target || "$0") })}
        <span class="kpi-gauge-val">${escapeHtml(k.value)}</span>
      </div>
      ${goalTrackRows([
        ["Metric", escapeHtml(k.label)],
        ["Actual", escapeHtml(k.value)],
        ["Target", escapeHtml(k.target || "—")],
        ["MoM", k.mom ? `<span class="${momClass(k.mom)}">${escapeHtml(k.mom)}</span>` : "—"],
        ["Status", typeof status === "string" ? status : "Open goal"]
      ])}
    </button>`;
  }

  function kpiStatCardHtml(k) {
    const headline = `${k.id} ${k.label}`;
    const targetLine = k.target ? `target ${k.target}` : "";
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    if (nums) {
      const grad = "km-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || nums.pct >= 1);
      return `<button type="button" class="kpi-stat-card kpi-stat-gauge${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${statusCorner(!!k.verified)}
        <span class="kpi-stat-id">${headline}</span>
        ${halfMoonGauge(Math.min(nums.pct, 1), grad, { endLabel: String(nums.target), celebrate: hit })}
        <span class="kpi-gauge-val">${k.value} / ${k.target}</span>
        <span class="kpi-stat-label">${targetLine}</span>
        ${k.mom ? `<span class="${momClass(k.mom)}">${k.mom} MoM</span>` : ""}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      </button>`;
    }
    return `<button type="button" class="kpi-stat-card${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
      ${statusCorner(!!k.verified)}
      <span class="kpi-stat-id">${headline}</span>
      <span class="kpi-stat-val">${k.value}</span>
      <span class="kpi-stat-label">${targetLine}</span>
      ${k.mom ? `<span class="${momClass(k.mom)}">${k.mom} MoM</span>` : ""}
      ${k.hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
    </button>`;
  }

  function renderKpis(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    const goals = DATA.kpis.filter(k => k.goal);
    const metrics = DATA.kpis.filter(k => !k.goal);
    const goalsCards = [...goals.map(kpiGoalCardHtml), placeholderGoalCardHtml()].join("");
    const goalsBlock = `<section class="kpi-section kpi-section-static kpi-section-goals" data-feedback-id="section-goals" data-feedback-label="Team goals">
          ${kpiSectionStaticHead("Team goals", "Phones · missed revenue · add a third")}
          <div class="kpi-section-body">
            <div class="kpi-goals-grid">${goalsCards}</div>
            <div class="kpi-detail-panel" id="kpi-detail-panel" hidden>
              <p class="kpi-detail-text">Select a goal or metric for context.</p>
            </div>
          </div>
        </section>`;
    const kpiCards = [teamDuiGoalCardHtml(), ...metrics.map(kpiStatCardHtml)].join("");

    el.innerHTML = `${reportHeader()}
      ${goalsBlock}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionStaticHead("Key metrics", "Tap a card for detail")}
        <div class="kpi-section-body">
          <div class="kpi-stat-grid">${kpiCards}</div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static kpi-section-leads-split" data-feedback-id="section-leads-channel" data-feedback-label="Leads by channel & campaign">
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <article class="kpi-split-panel" data-feedback-id="section-leads-channel-01" data-feedback-label="#01 Leads by channel">
              ${statusCorner(true)}
              ${kpiSectionStaticHead("#01 Leads by channel", "Stacked by month")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#01",
                  chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.channels)),
                  legend: channelLegend(DATA.channels),
                  table: channelsDetailTable(DATA.channels)
                })}
              </div>
            </article>
            <article class="kpi-split-panel" data-feedback-id="section-leads-campaign" data-feedback-label="#08 Leads by campaign">
              ${statusCorner(true)}
              ${kpiSectionStaticHead("#08 Leads by campaign", "Stacked by month")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#08",
                  chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.leadsByCampaign)),
                  legend: channelLegend(DATA.leadsByCampaign),
                  table: campaignLeadsDetailTable(DATA.leadsByCampaign)
                })}
              </div>
            </article>
          </div>
        </div>
      </section>
      <section class="kpi-section kpi-section-static" data-feedback-id="section-reputation" data-feedback-label="Reputation">
        ${kpiSectionStaticHead("Reputation", "Referrals & reviews · includes gap channels")}
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
            <div class="kpi-mini-card" data-kpi-focus="#17">
              ${statusCorner(false)}
              <h3>#17 Referrals by channel</h3>
              ${(() => {
                const segs = presencePieSegments(DATA.referrals);
                return chartBlock({ chart: donutChart(segs) });
              })()}
              <table class="kpi-table">
                <thead><tr><th>Channel</th><th>Leads</th><th>Δ MoM</th></tr></thead>
                <tbody>${DATA.referrals.map(r => `<tr class="${r.status !== "active" ? "kpi-row-gap" : ""}">
                  <td>${star(!!r.verified)} ${r.platform}</td>
                  <td>${dash(r.count)}</td>
                  <td class="${momClass(r.delta)}">${dash(r.delta)}</td>
                </tr>`).join("")}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    dispatchRendered(el, "kpis");
  }

  function renderDashboards(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    const depositPct = DATA.avgDeposit.current / DATA.avgDeposit.target;

    el.innerHTML = `${reportHeader()}
      <section class="kpi-section kpi-section-static">
        ${kpiSectionStaticHead("Business health & pipeline")}
        <div class="kpi-section-body">
          <div class="kpi-dash-grid-2">
            <div class="kpi-dash-card kpi-gauge-card kpi-bhi-card" data-kpi-focus="#BHI" data-feedback-label="Business health index">
              ${statusCorner(false)}
              <strong>Business health index</strong>
              <div class="kpi-gauge-val">${DATA.bhi.value} / ${DATA.bhi.target}</div>
              <span class="kpi-mom-down">↓ ${DATA.bhi.mom} MoM</span>
            </div>
            <div class="kpi-dash-card kpi-gauge-card" data-kpi-focus="#DEPOSIT">
              ${statusCorner(false)}
              <span class="kpi-stat-id">Avg deposit</span>
              ${halfMoonGauge(Math.min(depositPct, 1), "g-deposit", { endLabel: String(DATA.avgDeposit.target) })}
              <div class="kpi-gauge-val">$${DATA.avgDeposit.current} / $${DATA.avgDeposit.target}</div>
              <div class="kpi-stat-label">Goal $${DATA.avgDeposit.target} · placeholder current $${DATA.avgDeposit.current}</div>
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
          ${chartBlock({
            focus: "#04",
            verified: false,
            head: `<strong>#04 / #05 Cases MoM</strong> <span class="kpi-mom-up">Closed ↑ +38%</span> · <span class="kpi-mom-down">New ↓ −25%</span> · Red accounts placeholder`,
            chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
            legend: channelLegend(DATA.casesMomSeries),
            table: casesMomDetailTable(DATA.casesMom)
          })}
        </div>
      </section>
      <section class="kpi-section kpi-section-static kpi-section-leads">
        ${kpiSectionStaticHead("Lead channel expansion")}
        <div class="kpi-section-body">
          ${kpiSectionIntro("Pav Law should not depend on a single intake channel. LSA delivers volume today, but high cost per lead and limited control over lead quality make diversification essential. This section tracks Search, web forms, referrals, and emerging paths — the goal is to keep adding reliable channels so total lead flow stays strong even when one source underperforms.")}
          ${chartBlock({
            focus: "#01",
            verified: true,
            head: `<strong>#01 Total leads by channel</strong> <span class="kpi-mom-up">↑ +18% MoM</span>`,
            chart: channelBarChart(DATA.channels),
            legend: channelLegend(DATA.channels),
            table: channelsDetailTable(DATA.channels)
          })}
          <div class="kpi-dash-grid-2">
            ${chartBlock({
              focus: "#10",
              verified: true,
              head: `<strong>#10 Source mix</strong>`,
              chart: donutChart(DATA.sourceMix),
              table: sourceMixDetailTable(DATA.sourceMix)
            })}
            ${chartBlock({
              focus: "#08",
              verified: true,
              head: `<strong>#08 Search calls by campaign</strong> <span class="kpi-mom-up">↑ +74% MoM</span>`,
              chart: horizontalBarChart(DATA.searchCallsByCampaign),
              legend: channelLegend(DATA.searchCallsByCampaign),
              table: campaignDetailTable(DATA.searchCallsByCampaign)
            })}
          </div>
        </div>
      </section>`;
    el.dataset.rendered = RENDER_VER;
    bindDashboardInteractions(el);
    dispatchRendered(el, "dashboards");
  }

  function dispatchRendered(el, kind) {
    window.dispatchEvent(new CustomEvent("kpi-report-rendered", { detail: { root: el, kind } }));
  }

  function renderAll(kpisEl, dashboardsEl) {
    if (kpisEl) renderKpis(kpisEl);
    if (dashboardsEl) renderDashboards(dashboardsEl);
    window.dispatchEvent(new CustomEvent("kpi-report-ready"));
  }

  const KPI_DETAIL = {
    "#DUI": "Team DUI goal: 50 cases calendar year · 18 YTD (open). Gold fill unlocks at 100%+.",
    "#GOAL3": "Third team goal slot — set the next firm-wide goal (e.g. DUI cases, lead→case rate, or speed-to-lead) when ready.",
    "#01": "124 unified leads — above 110 target. HubSpot + LSA + Search combined (Jun dummy).",
    "#08": "Search-call leads by campaign (placeholder May/Jun) — Military · Core DV · NTGUILT.",
    "#02": "9 new cases vs 12 target. Lead→case rate 7.3% on 124 leads ≈ 9 cases — intake and answer rate are the levers.",
    "#12": "Military ~$41/call from Jul export — under $100 target. Strong efficiency lane.",
    "#15": "CPL $142 exceeds $120 target — Core DV waste and broad match noise; see neg list work.",
    "#16": "Review presence across GBP, Yelp, Nextdoor, Avvo, Justia, FindLaw, and social — many channels outdated or not claimed (B10).",
    "#17": "Referral channels only (past-client, friend/family, attorney cross-referral, Yelp, Nextdoor). GBP is a lead source — not listed here.",
    "#21": "31% missed (was 33%) — est. $4,200/mo lost, $27,300 YTD cumulative. B2 phone + Casey coverage is highest-ROI fix before more spend.",
    "#22": "8 min speed-to-lead — HubSpot workflow gap; B1 sprint target <5 min.",
    "#28": "Blended avg case fee $3,870 — feeds revenue and missed-revenue (#19) math.",
    "#19": "Unanswered calls × avg fee ≈ $4,200/mo left on table at current answer rate."
  };

  function bindKpiInteractions(root) {
    const panel = root.querySelector("#kpi-detail-panel");
    root.querySelectorAll(".kpi-stat-card[data-kpi-focus], .kpi-goal-card[data-kpi-focus]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.kpiFocus;
        root.querySelectorAll(".kpi-stat-card, .kpi-goal-card").forEach(c => c.classList.remove("kpi-stat-active"));
        btn.classList.add("kpi-stat-active");
        if (panel) {
          panel.hidden = false;
          const goalsSection = panel.closest("details");
          if (goalsSection) goalsSection.open = true;
          panel.innerHTML = `<strong>${id}</strong><p>${KPI_DETAIL[id] || "Detail coming when live data wires."}</p>`;
        }
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
    for (const rootId of ["kpi-report-dashboards", "kpi-report-kpis"]) {
      const root = document.getElementById(rootId);
      if (!root) continue;
      const btn = root.querySelector(`[data-kpi-focus="${id}"]`);
      if (btn) {
        const section = btn.closest("details");
        if (section) section.open = true;
        if (btn.classList.contains("kpi-stat-card") || btn.classList.contains("kpi-goal-card")) btn.click();
        btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
        btn.classList.add("kpi-stat-active");
        setTimeout(() => btn.classList.remove("kpi-stat-active"), 2400);
        return true;
      }
    }
    return false;
  }

  window.KPI_REPORT = {
    renderKpis,
    renderDashboards,
    renderAll,
    focusKpi,
    getData: () => ({ ...DATA }),
    refresh() {
      document.querySelectorAll("[data-rendered]").forEach(el => {
        delete el.dataset.rendered;
        el.innerHTML = "";
      });
    }
  };
})();
