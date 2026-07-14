/**
 * Inline Pav Law KPI report — no iframe. Renders into #kpi-report-kpis and #kpi-report-dashboards.
 */
(function () {
  const DATA = {
    period: "June 2026",
    asOf: "2026-07-11",
    source: "Ad Reports/exports/2026-07-11",
    kpis: [
      { id: "#01", label: "Total leads", value: "124", target: "110", mom: "+18%", verified: true, hit: true },
      { id: "#02", label: "New cases", value: "9", target: "12", mom: "−25%", verified: false, alert: false },
      { id: "#12", label: "Cost/call Military", value: "$41", target: "< $100", mom: null, verified: true },
      { id: "#15", label: "CPL", value: "$142", target: "≤ $120", mom: null, verified: true, alert: true },
      { id: "#21", label: "Answered phones", value: "69%", target: "≥ 90%", mom: "+2%", verified: false, alert: true },
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false },
      { id: "#28", label: "Avg case fee", value: "$3,870", target: "Q2 review", mom: null, verified: false },
      { id: "#19", label: "Missed revenue", value: "$4,200/mo", target: "$0", mom: null, verified: false, alert: true }
    ],
    channels: [
      { name: "Search calls", count: 54, prior: 31, mom: "+74%", spend: "$2,214", color: "#3a1a6e" },
      { name: "LSA inbox", count: 41, prior: 38, mom: "+8%", spend: "$12,792", color: "#00d4c4" },
      { name: "HubSpot forms", count: 29, prior: 24, mom: "+21%", spend: "$0", color: "#4c1d95" }
    ],
    sourceMix: [
      { name: "Paid Search", pct: 44, color: "#3a1a6e" },
      { name: "LSA", pct: 33, color: "#00d4c4" },
      { name: "HubSpot / other", pct: 23, color: "#4c1d95" }
    ],
    searchCallsByCampaign: [
      { name: "Military", count: 36, color: "#3a1a6e" },
      { name: "Core DV", count: 14, color: "#b8860b" },
      { name: "NTGUILT", count: 4, color: "#00d4c4" }
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
    referrals: [{ platform: "Google Business", count: 42, delta: "−3" }],
    verticals: [
      { name: "DUI/DWAI", jun: 4, ytd: 18 },
      { name: "Military", jun: 2, ytd: 8 },
      { name: "Traffic", jun: 2, ytd: 6 },
      { name: "DV", jun: 1, ytd: 3 }
    ],
    bhi: { value: 71, target: 100, mom: "−3%" },
    duiGoal: { current: 18, target: 50 },
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

  function fmtMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function channelBarChart(channels) {
    const max = Math.max(...channels.map(c => c.count), 1);
    const w = 280;
    const h = 120;
    const pad = { l: 8, r: 8, t: 8, b: 28 };
    const barW = (w - pad.l - pad.r) / channels.length - 12;
    const bars = channels.map((c, i) => {
      const bh = Math.max(6, ((h - pad.t - pad.b) * c.count) / max);
      const x = pad.l + i * ((w - pad.l - pad.r) / channels.length) + 6;
      const y = h - pad.b - bh;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${c.color}" opacity="0.9"/>
        <text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" class="kpi-chart-val">${c.count}</text>
        <text x="${x + barW / 2}" y="${h - 6}" text-anchor="middle" class="kpi-chart-label">${c.name.replace(/ .*/, "")}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Leads by channel bar chart">${bars}</svg>`;
  }

  function channelMoMChart(channel) {
    const max = Math.max(channel.count, channel.prior, 1);
    const w = 200;
    const h = 88;
    const barH = 22;
    const gap = 10;
    const scale = (v) => Math.max(12, ((w - 70) * v) / max);
    const priorW = scale(channel.prior);
    const currW = scale(channel.count);
    return `<svg class="kpi-chart-svg kpi-chart-svg-sm" viewBox="0 0 ${w} ${h}" role="img" aria-label="${channel.name} month over month">
      <text x="0" y="14" class="kpi-chart-mini-title">${channel.name}</text>
      <text x="${w - 4}" y="14" text-anchor="end" class="kpi-chart-mom ${momClass(channel.mom)}">${channel.mom} MoM</text>
      <text x="0" y="36" class="kpi-chart-axis">Prior</text>
      <rect x="42" y="24" width="${priorW}" height="${barH}" rx="4" fill="${channel.color}" opacity="0.35"/>
      <text x="${42 + priorW + 6}" y="40" class="kpi-chart-val-sm">${channel.prior}</text>
      <text x="0" y="66" class="kpi-chart-axis">Jun</text>
      <rect x="42" y="54" width="${currW}" height="${barH}" rx="4" fill="${channel.color}"/>
      <text x="${42 + currW + 6}" y="70" class="kpi-chart-val-sm">${channel.count}</text>
    </svg>`;
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
        <rect x="88" y="64" width="${cumW}" height="16" rx="4" fill="#4c1d95"/>
        <text x="${88 + cumW + 6}" y="76" class="kpi-chart-val-sm">${fmtMoney(pi.cumulativeYtd)}</text>
      </svg>
    </div>`;
  }

  function momClass(mom) {
    if (!mom) return "";
    const s = String(mom).trim();
    if (/^[+↑]/.test(s)) return "kpi-mom-up";
    if (/^[-−↓]/.test(s) || s.startsWith("-")) return "kpi-mom-down";
    return "";
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

  const GOLD_GAUGE = { pale: "#fde68a", bright: "#e3c58d", mid: "#c9a86c", dark: "#b8860b" };

  function goldEggSvg(cx, cy, gradId) {
    const eggGrad = `${gradId}-egg`;
    return `<g class="kpi-gold-egg" aria-hidden="true">
      <defs>
        <radialGradient id="${eggGrad}" cx="38%" cy="28%" r="70%">
          <stop offset="0%" stop-color="${GOLD_GAUGE.bright}"/>
          <stop offset="55%" stop-color="${GOLD_GAUGE.mid}"/>
          <stop offset="100%" stop-color="${GOLD_GAUGE.dark}"/>
        </radialGradient>
      </defs>
      <ellipse cx="${cx}" cy="${cy}" rx="10" ry="12" fill="url(#${eggGrad})" stroke="${GOLD_GAUGE.dark}" stroke-width="1.25"/>
      <ellipse cx="${cx - 3}" cy="${cy - 5}" rx="3.5" ry="4.5" fill="#fff8e7" opacity="0.6"/>
    </g>`;
  }

  function halfMoonGauge(pct, gradId, options) {
    const opts = options || {};
    const clamped = Math.max(0, Math.min(1, pct));
    const celebrate = opts.celebrate || clamped >= 1;
    const cx = 94;
    const cy = 72;
    const r = 68;
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    const fillGradId = `${gradId}-fill`;
    const goldStops = `<stop offset="0%" stop-color="${GOLD_GAUGE.pale}"/><stop offset="40%" stop-color="${GOLD_GAUGE.mid}"/><stop offset="100%" stop-color="${GOLD_GAUGE.dark}"/>`;
    const fillAmt = celebrate ? 1 : clamped;
    const fillPath = halfMoonFillPath(cx, cy, r, fillAmt);
    const egg = celebrate ? goldEggSvg(cx, cy + 16, gradId) : "";
    const endLabel = opts.endLabel != null ? opts.endLabel : "";
    const aria = celebrate ? "Target reached — Gilbert laid a gold egg" : "Progress half-moon gauge";

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 112" role="img" aria-label="${aria}">
      <defs><linearGradient id="${fillGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${goldStops}</linearGradient></defs>
      <line x1="${left.x}" y1="${cy}" x2="${right.x}" y2="${cy}" stroke="var(--gg-royal-border)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 22 72 A 68 68 0 0 1 166 72" fill="none" stroke="var(--gg-cream-panel)" stroke-width="10" stroke-linecap="round"/>
      ${fillPath ? `<path d="${fillPath}" fill="url(#${fillGradId})"/>` : ""}
      <path d="M 22 72 A 68 68 0 0 1 166 72" fill="none" stroke="${GOLD_GAUGE.dark}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
      ${egg}
      <text x="22" y="98" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="166" y="98" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
    </svg>`;
  }

  function kpiSectionSummary(title, hint) {
    const hintHtml = hint ? `<span class="kpi-section-hint">${hint}</span>` : "";
    return `<summary class="kpi-section-summary">
      <span class="kpi-section-heading"><span class="kpi-section-title">${title}</span>${hintHtml}</span>
      <span class="kpi-section-chevron" aria-hidden="true">▾</span>
    </summary>`;
  }

  function kpiSectionIntro(text) {
    if (!text) return "";
    return `<p class="kpi-section-intro">${text}</p>`;
  }

  function reportKey() {
    return `<p class="kpi-legend kpi-legend-top"><span class="kpi-star">★</span> Gold star = export on file &nbsp; <span class="kpi-unverified">✕</span> Purple ✕ = not wired yet</p>`;
  }

  function reportHeader(subtitle) {
    return `<header class="kpi-report-head">
      <div>
        <h2 class="kpi-report-title">Pav Law KPI Report</h2>
        <p class="kpi-report-sub">${subtitle} · ${DATA.period} · as of ${DATA.asOf}</p>
      </div>
      <button type="button" class="kpi-feedback-mode-toggle" aria-pressed="false" title="Turn on to leave comments on metrics and charts">
        Feedback mode
      </button>
    </header>
    ${reportKey()}
    <p class="kpi-report-banner">Turn on magenta Feedback mode, then click a KPI or chart to comment. Data pull: <code>${DATA.source}</code></p>`;
  }

  function renderKpis(el) {
    if (!el || el.dataset.rendered === "1") return;
    const kpiCards = DATA.kpis.map(k => `
      <button type="button" class="kpi-stat-card${k.alert ? " kpi-stat-attention" : ""}" data-kpi-focus="${k.id}">
        ${star(k.verified)}
        <span class="kpi-stat-id">${k.id}</span>
        <span class="kpi-stat-val">${k.value}</span>
        <span class="kpi-stat-label">${k.label}${k.target ? ` · target ${k.target}` : ""}</span>
        ${k.mom ? `<span class="${momClass(k.mom)}">${k.mom} MoM</span>` : ""}
        ${k.hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      </button>`).join("");

    el.innerHTML = `${reportHeader("KPI metrics & tables")}
      <details class="kpi-section" open data-feedback-id="section-key-metrics" data-feedback-label="Key metrics">
        ${kpiSectionSummary("Key metrics", "Tap a card for detail")}
        <div class="kpi-stat-grid">${kpiCards}</div>
        <div class="kpi-detail-panel" id="kpi-detail-panel" hidden>
          <p class="kpi-detail-text">Select a metric card to see context.</p>
        </div>
      </details>
      <details class="kpi-section" open>
        ${kpiSectionSummary("#01 Leads by channel")}
        <table class="kpi-table">
          <thead><tr><th>Channel</th><th>Count</th><th>Δ MoM</th><th>Spend</th></tr></thead>
          <tbody>${DATA.channels.map(c => `<tr><td>${c.name}</td><td>${c.count}</td><td class="${momClass(c.mom)}">${c.mom}</td><td>${c.spend}</td></tr>`).join("")}</tbody>
        </table>
      </details>
      <details class="kpi-section">
        ${kpiSectionSummary("Spend & intake KPIs")}
        <div class="kpi-split-grid">
          <div class="kpi-mini-card">
            <h3>Cost per call</h3>
            <table class="kpi-table">${DATA.costPerCall.map(r => `<tr><td>${r.channel}</td><td>${r.cost}</td></tr>`).join("")}</table>
          </div>
          <div class="kpi-mini-card">
            <h3>#17 Referral by platform</h3>
            <table class="kpi-table">${DATA.referrals.map(r => `<tr><td>${r.platform}</td><td>${r.count}</td><td class="${momClass(r.delta)}">${r.delta}</td></tr>`).join("")}</table>
          </div>
        </div>
      </details>`;
    el.dataset.rendered = "1";
    bindKpiInteractions(el);
    dispatchRendered(el, "kpis");
  }

  function renderDashboards(el) {
    if (!el || el.dataset.rendered === "1") return;
    const leadsPct = 124 / 110;
    const casesPct = 9 / 12;
    const duiPct = DATA.duiGoal.current / DATA.duiGoal.target;

    el.innerHTML = `${reportHeader("Charts & cockpit")}
      <details class="kpi-section" open>
        ${kpiSectionSummary("Monthly cockpit")}
        <div class="kpi-dash-grid-3">
          <div class="kpi-dash-card kpi-stat-attention" data-kpi-focus="#19">
            ${star(false)} <span class="kpi-stat-id">#19 · REQUIRES ACTION</span>
            <div class="kpi-stat-val">$4,200/mo</div>
            <div class="kpi-stat-label">Est. missed revenue · target $0</div>
          </div>
          <div class="kpi-dash-card">
            ${star(false)} <strong>Cases per vertical · YTD</strong>
            <table class="kpi-table kpi-table-compact">${DATA.verticals.map(v => `<tr><td>${v.name}</td><td>${v.jun}</td><td>${v.ytd}</td></tr>`).join("")}</table>
          </div>
          <div class="kpi-dash-card kpi-gauge-card">
            ${star(false)} <span class="kpi-stat-id">Team goal · DUI YTD</span>
            ${halfMoonGauge(duiPct, "g-dui", { endLabel: String(DATA.duiGoal.target) })}
            <div class="kpi-gauge-val">${DATA.duiGoal.current} / ${DATA.duiGoal.target}</div>
            <div class="kpi-stat-label">50 DUI cases · calendar year</div>
          </div>
        </div>
        <div class="kpi-dash-grid-2">
          <div class="kpi-dash-card kpi-gauge-card" data-kpi-focus="#01">
            ${star(true)} <span class="kpi-stat-id">#01 Total leads</span>
            ${halfMoonGauge(Math.min(leadsPct, 1), "g-leads", { endLabel: "110", celebrate: leadsPct >= 1 })}
            <div class="kpi-gauge-val">124 / 110</div>
            <span class="kpi-target-hit">Target reached</span>
            <span class="kpi-mom-up">↑ +18% MoM</span>
          </div>
          <div class="kpi-dash-card kpi-gauge-card" data-kpi-focus="#02">
            ${star(false)} <span class="kpi-stat-id">#02 New cases</span>
            ${halfMoonGauge(casesPct, "g-cases", { endLabel: "12" })}
            <div class="kpi-gauge-val">9 / 12</div>
            <span class="kpi-mom-down">↓ −25% MoM</span>
          </div>
        </div>
      </details>
      <details class="kpi-section" open>
        ${kpiSectionSummary("Business health & pipeline")}
        <div class="kpi-dash-card kpi-gauge-card kpi-bhi-card">
          ${star(false)} <strong>Business health index</strong>
          <div class="kpi-gauge-val">${DATA.bhi.value} / ${DATA.bhi.target}</div>
          <span class="kpi-mom-down">↓ ${DATA.bhi.mom} MoM</span>
        </div>
        <div class="kpi-dash-grid-2">
          <div class="kpi-chart-card">
            <div class="kpi-chart-head">${star(false)} <strong>#04 Closed cases</strong> <span class="kpi-mom-up">↑ +38% MoM</span></div>
            <div class="kpi-chart-placeholder" role="img" aria-label="Line chart placeholder">Apr 6 · May 8 · Jun 11</div>
            <button type="button" class="kpi-expand-btn" data-expand="closed">Show table</button>
            <div class="kpi-expand-panel" data-panel="closed" hidden>
              <table class="kpi-table"><tr><th>Month</th><th>Closed</th><th>Δ MoM</th></tr><tr><td>Jun</td><td>11</td><td>+38%</td></tr></table>
            </div>
          </div>
          <div class="kpi-chart-card">
            <div class="kpi-chart-head">${star(false)} <strong>#05 Consult → retained</strong> <span class="kpi-mom-up">↑ +6% MoM</span></div>
            <div class="kpi-chart-placeholder">42% · 48% · 51%</div>
            <button type="button" class="kpi-expand-btn" data-expand="retained">Show table</button>
            <div class="kpi-expand-panel" data-panel="retained" hidden>
              <table class="kpi-table"><tr><th>Month</th><th>Rate</th><th>Retained</th></tr><tr><td>Jun</td><td>51%</td><td>14</td></tr></table>
            </div>
          </div>
        </div>
      </details>
      <details class="kpi-section kpi-section-leads" open>
        ${kpiSectionSummary("Lead channel expansion")}
        ${kpiSectionIntro("Pav Law should not depend on a single intake channel. LSA delivers volume today, but high cost per lead and limited control over lead quality make diversification essential. This section tracks Search, web forms, referrals, and emerging paths — the goal is to keep adding reliable channels so total lead flow stays strong even when one source underperforms.")}
        <div class="kpi-chart-card" data-kpi-focus="#01">
          <div class="kpi-chart-head"><span class="kpi-star">★</span> <strong>#01 Total leads by channel</strong> <span class="kpi-mom-up">↑ +18% MoM</span></div>
          ${channelBarChart(DATA.channels)}
        </div>
        <div class="kpi-channel-grid">
          ${DATA.channels.map(c => `<div class="kpi-chart-card kpi-channel-card">${channelMoMChart(c)}</div>`).join("")}
        </div>
        <div class="kpi-dash-grid-2">
          <div class="kpi-chart-card" data-kpi-focus="#10">
            <div class="kpi-chart-head"><span class="kpi-star">★</span> <strong>#10 Source mix</strong></div>
            ${donutChart(DATA.sourceMix)}
          </div>
          <div class="kpi-chart-card" data-kpi-focus="#08">
            <div class="kpi-chart-head"><span class="kpi-star">★</span> <strong>#08 Search calls by campaign</strong> <span class="kpi-mom-up">↑ +74% MoM</span></div>
            ${horizontalBarChart(DATA.searchCallsByCampaign)}
          </div>
        </div>
      </details>
      <details class="kpi-section" open>
        ${kpiSectionSummary("Sales intake performance")}
        <div class="kpi-dash-grid-2">
          <div class="kpi-dash-card" data-kpi-focus="#21">
            ${star(false)} <span class="kpi-stat-id">#21 Answered phones</span>
            <div class="kpi-stat-val">${DATA.phoneIntake.answeredPct}%</div>
            <div class="kpi-stat-label">${DATA.phoneIntake.missedPct}% missed · target ≥ ${DATA.phoneIntake.targetPct}%</div>
          </div>
          <div class="kpi-chart-card kpi-missed-card">
            <div class="kpi-chart-head">${star(false)} <strong>#21 Missed calls &amp; revenue lost</strong></div>
            ${missedRevenuePanel(DATA.phoneIntake)}
          </div>
        </div>
      </details>`;
    el.dataset.rendered = "1";
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
    "#01": "124 unified leads — above 110 target. HubSpot + LSA + Search combined (Jun dummy).",
    "#02": "9 new cases vs 12 target. Lead→case rate 7.3% on 124 leads ≈ 9 cases — intake and answer rate are the levers.",
    "#12": "Military ~$41/call from Jul export — under $100 target. Strong efficiency lane.",
    "#15": "CPL $142 exceeds $120 target — Core DV waste and broad match noise; see neg list work.",
    "#21": "31% missed (was 33%) — est. $4,200/mo lost, $27,300 YTD cumulative. B2 phone + Casey coverage is highest-ROI fix before more spend.",
    "#22": "8 min speed-to-lead — HubSpot workflow gap; B1 sprint target <5 min.",
    "#28": "Blended avg case fee $3,870 — feeds revenue and missed-revenue (#19) math.",
    "#19": "Unanswered calls × avg fee ≈ $4,200/mo left on table at current answer rate."
  };

  function bindKpiInteractions(root) {
    const panel = root.querySelector("#kpi-detail-panel");
    root.querySelectorAll(".kpi-stat-card[data-kpi-focus]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.kpiFocus;
        root.querySelectorAll(".kpi-stat-card").forEach(c => c.classList.remove("kpi-stat-active"));
        btn.classList.add("kpi-stat-active");
        if (panel) {
          panel.hidden = false;
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
        if (btn.classList.contains("kpi-stat-card")) btn.click();
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
