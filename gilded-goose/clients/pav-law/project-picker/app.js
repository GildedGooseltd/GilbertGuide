(function () {
  function getConfig() {
    return Object.assign(
      { webhookUrl: "", depositAmount: 2500, quickbooksDepositUrl: "", notifyEmail: "support@gildedgooselimited.com" },
      typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
    );
  }
  let CONFIG = getConfig();
  const GILBERT_ICON = PROJECT_DATA.guideIcon || PROJECT_DATA.paviIcon || "assets/gigi-goose-guide.svg";
  const GILBERT_HERO = PROJECT_DATA.guideHero || "assets/gigi-goose-walk.png";
  const GILBERT_SEAL = PROJECT_DATA.guideSeal || "assets/gigi-logo-frame.png";
  const GUIDE_NAME = PROJECT_DATA.guideName || "Lord Gilbert Granville";
  const GUIDE_SHORT = PROJECT_DATA.guideShortName || "Gilbert";
  const GILBERT_GREETING = "Hello! What's your biggest business problem today we can work on fixing?";

  function isRequiredProject(item, isRetainer) {
    return isRetainer || item.id === "RETAINER" || item.category === "Retainer";
  }

  function findProjectById(id) {
    if (id === "RETAINER") return { ...RETAINER, isRetainer: true };
    const p = PROJECTS.find(x => x.id === id);
    return p ? { ...p, isRetainer: false } : null;
  }

  function hasAbQuestions(item) {
    return !!(item && item.abQuestions && item.abQuestions.length);
  }

  function abQuestionAnswered(id) {
    return !!(state.notes[id] || "").trim();
  }

  function canSelectProject(item, isRetainer) {
    if (!item || isRetainer || item.isRetainer || item.monthlyOnly) return true;
    if (!hasAbQuestions(item)) return true;
    return abQuestionAnswered(item.id);
  }

  function sanitizeCartForAbQ() {
    [...state.projects].forEach(id => {
      const item = findProjectById(id);
      if (item && !canSelectProject(item, false)) state.projects.delete(id);
    });
  }

  function openAbQComment(id, root) {
    const scope = root || document;
    toggleCommentPopover(id, scope);
    const card = document.getElementById(`project-${id}`) || scope.querySelector(`.research-row[data-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function gilbertAbQNoticeText(item) {
    const qs = (item.abQuestions || []).map((q, i) => `${i + 1}. ${q}`).join(" ");
    return `${item.title} has AB – Q (question for Andrew Brown): ${qs} — add Andrew's answer in Comment on that card before it can go in the cart.`;
  }

  function announceGilbertAbQ(item) {
    if (!hasAbQuestions(item) || abQuestionAnswered(item.id)) return;
    const msg = gilbertAbQNoticeText(item);
    const dup = state.gilbertChat.some(m => m.role === "gilbert" && m.text === msg);
    if (!dup) {
      state.gilbertChat.push({ role: "gilbert", text: msg });
      renderGilbertChat();
    }
    openGilbertChat();
  }

  function projectsWithPendingAbQ() {
    return PROJECTS.filter(p => hasAbQuestions(p) && !abQuestionAnswered(p.id));
  }

  function trySetProjectInCart(id, add, opts) {
    const item = findProjectById(id);
    if (!item) return false;
    const isRetainer = !!item.isRetainer;
    if (add && !canSelectProject(item, isRetainer)) {
      if (!opts?.silent) {
        showToast("AB – Q: answer Andrew's question in Comment before adding to cart", true);
        openAbQComment(id);
        announceGilbertAbQ(item);
      }
      return false;
    }
    if (isRetainer) {
      if (add) state.retainer = true;
      else if (!isRequiredProject(item, true)) state.retainer = false;
    } else {
      if (add) state.projects.add(id);
      else state.projects.delete(id);
    }
    return true;
  }

  function abQuestionsBannerHtml(item) {
    if (!hasAbQuestions(item)) return "";
    const answered = abQuestionAnswered(item.id);
    const qs = item.abQuestions.map(q => `<li>${escapeHtml(q)}</li>`).join("");
    return `<div class="ab-q-flag${answered ? " ab-q-flag--answered" : ""}" role="note">
      <div class="ab-q-flag-head"><span class="ab-q-badge">AB – Q</span> Question for Andrew Brown</div>
      <ul class="ab-q-list">${qs}</ul>
      <p class="ab-q-hint">${answered
        ? "Answer recorded in Comment — you can add this to the cart."
        : `${GUIDE_SHORT}: reply in Comment before this goes in the cart.`}</p>
    </div>`;
  }

  function isPriorityUrgent(item) {
    return !!item.enabler || item.status === "wip" || hasPartialProgress(item);
  }

  const REQUIRED_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

  const ACCOUNT_DATA_ICON = "assets/gg-shield-emblem.png";

  function accountDataBadgeImg() {
    return `<img class="pav-law-shield-img" src="${ACCOUNT_DATA_ICON}" alt="" width="24" height="29">`;
  }

  const VALUE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="17" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="17" width="7" height="4.5" rx="0.5"/><rect x="17" y="17" width="6" height="4.5" rx="0.5"/><rect x="5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="13.5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="1" y="6" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="6" width="7" height="4.5" rx="0.5"/><path d="M18 2.5 21.5 6"/><path d="M14.5 6.5 20 12"/><path d="M17.5 3.5h4v4"/></svg>`,
    retainer: REQUIRED_ICON_SVG,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/><circle cx="5" cy="10.5" r="2"/><path d="M1 20v-0.5a2.5 2.5 0 0 1 2-2.45"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 9v11"/><path d="M13 13h5"/><path d="M13 17h5"/></svg>`,
    seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5.5 5.5"/></svg>`,
    referrals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7-4 4 4 4"/><path d="M3 11h13"/><path d="m17 17 4-4-4-4"/><path d="M21 13H8"/></svg>`,
    efficiency: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M10 19V9M16 19v-6M22 19V3"/></svg>`,
    intake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    creative: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-4.5 0-8 3.6-8 8.2 0 2.8 1.3 4.8 3 6 .6.4 1.2.6 1.8.6.9 0 1.6-.5 1.9-1.3.5-1 1.6-1.6 2.6-1.3 1.1.4 1.8 1.5 1.8 2.7 0 .3 0 .6-.1.9-.4 1.4 1 2.9 2.8 2.9 3.2 0 5.8-2.6 5.8-5.8C22 8.2 17.5 3 12 3z"/><circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="11.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="13.5" r="1" fill="currentColor" stroke="none"/></svg>`,
    general: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.4 6.8H21l-5.5 4 2.1 6.7L12 17.8 6.4 20.5l2.1-6.7L3 9.8h6.6L12 3z"/></svg>`
  };

  function requiredMarkerHtml(item, isRetainer) {
    if (!isRequiredProject(item, isRetainer)) return "";
    const isRet = isRetainer || item.id === "RETAINER" || item.category === "Retainer";
    const tip = isRet
      ? "Required retainer — ongoing digital ads management"
      : "Required monthly maintenance";
    return `<span class="required-icon" title="${escapeHtml(tip)}" aria-label="${escapeHtml(tip)}">${REQUIRED_ICON_SVG}</span>`;
  }

  function sourceTocPriority(item) {
    if (item.isRetainer || item.id === "RETAINER") return null;
    if (item.priority == null || item.priority === "" || Number.isNaN(Number(item.priority))) return null;
    return Math.trunc(Number(item.priority));
  }

  /** Higher = newer / wins a contested source priority number. Does not mutate item.priority. */
  function projectNewnessScore(item) {
    if (state.priorityEdit && state.clientPriorityIds?.length) {
      const idx = state.clientPriorityIds.indexOf(item.id);
      if (idx >= 0) return (state.clientPriorityIds.length - idx) * 1e15;
    }
    const asOfRaw = (item.impactEstimates && item.impactEstimates.asOf) || item.asOf || "";
    const asOfMs = Date.parse(asOfRaw) || 0;
    let noteMs = 0;
    for (const n of item.gilbertMetricNotes || []) {
      const t = Date.parse(n.date || "") || 0;
      if (t > noteMs) noteMs = t;
    }
    const listIdx = PROJECTS.findIndex(p => p.id === item.id);
    const reverseList = listIdx >= 0 ? listIdx : 0;
    let idScore = 0;
    const id = String(item.id || "");
    for (let i = 0; i < id.length; i++) idScore = idScore * 33 + id.charCodeAt(i);
    return asOfMs * 1e7 + noteMs * 1e4 + reverseList * 100 + (idScore % 1000);
  }

  /**
   * Display-only unique ranks from source priorities. Newest claimant keeps the contested
   * number; older claimants take the next free integers. Source item.priority is unchanged.
   */
  function buildUniqueTocPriorityMap(items) {
    const map = new Map();
    const used = new Set();
    const bySource = new Map();
    for (const item of items) {
      const p = sourceTocPriority(item);
      if (p == null) continue;
      if (!bySource.has(p)) bySource.set(p, []);
      bySource.get(p).push(item);
    }
    const keys = [...bySource.keys()].sort((a, b) => a - b);
    const rankedGroups = keys.map(p => ({
      p,
      group: bySource.get(p).slice().sort((a, b) => projectNewnessScore(b) - projectNewnessScore(a))
    }));
    /* Pass 1: newest in each source-priority group keeps that number (or next free if taken). */
    for (const { p, group } of rankedGroups) {
      const winner = group[0];
      if (!winner) continue;
      let rank = p;
      while (used.has(rank)) rank += 1;
      used.add(rank);
      map.set(winner.id, rank);
    }
    /* Pass 2: older duplicates take the next available slots. */
    for (const { p, group } of rankedGroups) {
      for (let i = 1; i < group.length; i++) {
        let rank = p;
        while (used.has(rank)) rank += 1;
        used.add(rank);
        map.set(group[i].id, rank);
      }
    }
    return map;
  }

  function uniqueTocPriority(item, usedPriorities, priorityMap) {
    if (priorityMap && priorityMap.has(item.id)) {
      const rank = priorityMap.get(item.id);
      usedPriorities.add(rank);
      return rank;
    }
    const p = sourceTocPriority(item);
    if (p == null) return null;
    let rank = p;
    while (usedPriorities.has(rank)) rank += 1;
    usedPriorities.add(rank);
    return rank;
  }

  function priorityTocHtml(item, displayPriority) {
    const required = isRequiredProject(item, !!item.isRetainer);
    const p = displayPriority != null ? displayPriority : "";
    const urgent = isPriorityUrgent(item) ? '<span class="priority-urgent" title="Urgent or fixing an active issue">!</span>' : "";
    const req = required ? requiredMarkerHtml(item, !!item.isRetainer) : "";
    return `<span class="toc-priority-inner">${urgent}${p}</span>${req ? `<span class="toc-required-icon">${req}</span>` : ""}`;
  }

  /* Colors live in index.html :root --vi-* + .value-icon.icon-{id}. Filter + table share those classes — never hardcode badge colors here. */
  const VALUE_ICON_DEFS = [
    { id: "foundation", svgId: "foundation", cls: "icon-foundation", label: "Foundation", match: item => !!item.enabler },
    { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Retainer", match: item => item.isRetainer || item.id === "RETAINER" || item.category === "Retainer" },
    { id: "leads", svgId: "leads", cls: "icon-leads", label: "Leads", match: item => /paid media|outbound|display|search|seasonal|social proof|google ads|microsoft|lsa|ppc/i.test(iconMatchText(item)) },
    { id: "crm", svgId: "crm", cls: "icon-crm", label: "CRM", match: item => /crm|hubspot|pipeline|contact import|landing page/i.test(iconMatchText(item)) },
    { id: "seo", svgId: "seo", cls: "icon-seo", label: "SEO", match: item => /seo|blog|local search|website ux|website content|website speed|website module/i.test(iconMatchText(item)) },
    { id: "referrals", svgId: "referrals", cls: "icon-referrals", label: "Referrals", match: item => /referral|testimonial|social proof|direct mail|mailer|case win|past client/i.test(iconMatchText(item)) },
    { id: "efficiency", svgId: "efficiency", cls: "icon-efficiency", label: "Analytics", match: item => /analytics|dashboard|strategy|audit|finance|operations|kpi|reporting/i.test(iconMatchText(item)) },
    { id: "intake", svgId: "intake", cls: "icon-intake", label: "Intake", match: item => /intake|chat|after-hours|infrastructure|call infrastructure|voip|phone/i.test(iconMatchText(item)) },
    { id: "creative", svgId: "creative", cls: "icon-creative", label: "Creative", match: item => /creative|email|social media|display|repurpose/i.test(iconMatchText(item)) }
  ];

  /** Dashboard KPIs tied to each value icon (picker filter + project cards). */
  const ICON_KPI_MAP = {
    foundation: ["#21", "#22", "#27"],
    retainer: ["#08", "#12", "#14", "#15"],
    leads: ["#01", "#07", "#08", "#12", "#15"],
    crm: ["#06", "#20", "#22", "#27"],
    seo: ["#11", "#18"],
    referrals: ["#16", "#17"],
    efficiency: ["#01", "#10", "#19", "#28"],
    intake: ["#09", "#21", "#22", "#23"],
    creative: ["#08", "#14"],
    "account-data": ["#01", "#12", "#15", "#21"]
  };

  const KPI_DASHBOARD_IDS = new Set(["#01", "#02", "#04", "#05", "#08", "#10", "#19", "#21"]);

  function iconMatchText(item) {
    const desc = item.description ? String(item.description).replace(/<[^>]+>/g, " ") : "";
    return [
      item.category,
      item.campaignType,
      item.title,
      desc,
      item.valueAdd || ""
    ].filter(Boolean).join(" ");
  }

  function valueIconMarkup(def) {
    const svg = VALUE_ICON_SVGS[def.svgId || def.id] || VALUE_ICON_SVGS.general;
    return `<span class="value-icon ${def.cls}" title="${escapeHtml(def.label)}" aria-label="${escapeHtml(def.label)}">${svg}</span>`;
  }

  let RETAINER = PROJECT_DATA.retainer;
  let PROJECTS = PROJECT_DATA.projects;

  const state = {
    retainer: false,
    projects: new Set(),
    expanded: new Set(),
    recommended: new Set(),
    notes: {},
    submitterEmail: "",
    invoicePaymentMonths: "",
    invoicePaymentMonthlyAmount: "",
    goalText: "",
    gilbertChat: [],
    iconFilters: [],
    tocSort: { field: "priority", dir: "asc" },
    tocExpanded: false,
    showAllProjects: false,
    activeViewTab: "picker",
    doNextVisible: false,
    priorityEdit: false,
    clientPriorityIds: []
  };

  function normalizeViewTab(tab) {
    const t = String(tab || "picker").toLowerCase().trim();
    if (t === "revenue" || t === "completed") return "impact";
    if (t === "kpis" || t === "picker" || t === "dashboards" || t === "impact") return t;
    return "picker";
  }

  function setActiveViewTab(tab) {
    state.activeViewTab = normalizeViewTab(tab);
  }

  function normalizeStatus(item) {
    const s = String(item.status || "available").toLowerCase();
    if (s.includes("completed")) return "completed";
    if (s.includes("research")) return "research";
    if (s.includes("draft") || s.includes("outline")) return "draft";
    if (s.includes("ongoing")) return "ongoing";
    if (s.includes("wip")) return "wip";
    return "available";
  }

  function normalizePublishStatus(item) {
    const s = String(item.publishStatus || "published").toLowerCase().trim();
    if (s === "planning" || s === "plan" || s === "draft" || s === "outline") return "planning";
    return "published";
  }

  function isPlanningPublish(item) {
    return normalizePublishStatus(item) === "planning";
  }

  function isCompletedStatus(item) {
    return normalizeStatus(item) === "completed";
  }

  function isResearchStatus(item) {
    const s = normalizeStatus(item);
    return s === "research" || s === "draft";
  }

  function activeOptionalProjects() {
    return orderedProjects().filter(p => {
      if (p.monthlyOnly || isCompletedStatus(p)) return false;
      if (isResearchStatus(p) && !isPlanningPublish(p)) return false;
      return true;
    });
  }

  function researchProjects() {
    return sortByPriority(orderedProjects().filter(p => !p.monthlyOnly && isResearchStatus(p) && !isPlanningPublish(p)));
  }

  function completedProjects() {
    return sortByPriority(orderedProjects().filter(p => !p.monthlyOnly && isCompletedStatus(p)));
  }

  function maxProjectFee() {
    return Math.max(500, ...PROJECTS.filter(p => !p.monthlyOnly).map(p => itemSelectionCost(p)));
  }

  function computeProjectScore(item) {
    if (isCompletedStatus(item) || item.monthlyOnly) return -999;
    let score = 0;
    const pri = item.priority ?? 50;
    score += Math.max(0, 32 - pri);
    if (item.enabler) score += 22;
    if (state.goalText.trim()) {
      const words = state.goalText.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      score += Math.min(28, scoreItemForGoal(item, words) * 3);
    }
    const fee = itemSelectionCost(item);
    score += Math.max(0, 16 * (1 - fee / maxProjectFee()));
    if (item.backedMetric && item.backedMetric.label) score += 14;
    if (item.returnEstimate) score += 10;
    if (state.projects.size && item.enabler) score += 8;
    const st = normalizeStatus(item);
    if (st === "research" || st === "draft") score -= 45;
    if (isPlanningPublish(item)) score -= 50;
    if (st === "wip") score -= 4;
    return Math.round(score * 10) / 10;
  }

  function topScoredProjects(limit) {
    return activeOptionalProjects()
      .map(item => ({ item, score: computeProjectScore(item) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit || 3);
  }

  function renderKpiDashboard() {
    if (!window.KPI_REPORT) return;
    const kpis = document.getElementById("kpi-report-kpis");
    const dash = document.getElementById("kpi-report-dashboards");
    if (kpis) KPI_REPORT.renderKpis(kpis);
    if (dash) KPI_REPORT.renderDashboards(dash);
  }

  function renderDoNextPanel() {
    const el = document.getElementById("do-next-panel");
    if (!el) return;
    el.hidden = false;
    const asked = hasGilbertActivity();
    const head = `<div class="do-next-head">
      <div class="do-next-head-copy">
        <h3>Recommended Priority Projects</h3>
        <p class="do-next-blurb">${asked
          ? "Updated from your chat with Gilbert — refine the list anytime by telling him more about leads, intake, ads, website, or CRM."
          : "Ask Gilbert on the left about leads, intake, ads, website, or CRM — he will refine this shortlist as you chat."}</p>
      </div>
    </div>`;
    const ranked = asked
      ? gilbertRankedPicks(5).map(item => ({ item, score: computeProjectScore(item) }))
      : topScoredProjects(5);
    if (!ranked.length) {
      el.innerHTML = `${head}<p class="kpi-dashboard-note">No matches yet — add more detail in chat with Gilbert.</p>`;
      return;
    }
    el.innerHTML = `${head}<ol class="do-next-list">${ranked.map(({ item, score }, i) =>
      `<li>
        <span class="do-next-rank">${i + 1}.</span>
        <div class="do-next-item-copy">
          <a href="#project-${item.id}">${escapeHtml(item.title)}</a>
          <span class="do-next-item-blurb">${escapeHtml(elevatorPitch(item))}</span>
        </div>
        <span class="do-next-score">score ${score}</span>
      </li>`
    ).join("")}</ol>`;
  }

  function resolveImpactEstimates(item) {
    const e = item?.impactEstimates;
    if (e && (e.leadsImpacted != null || e.leadsConnected != null || e.clientsRetained != null)) {
      const period = e.period === "wave" ? "/wave" : "/mo";
      const fmt = v => {
        if (v == null) return "—";
        const n = Number(v);
        return n < 1 && n > 0 ? `~${n.toFixed(1)}${period}` : `~${Math.round(n * 10) / 10}${period}`;
      };
      return {
        leadsImpacted: { value: e.leadsImpacted, label: fmt(e.leadsImpacted) },
        leadsConnected: { value: e.leadsConnected, label: fmt(e.leadsConnected) },
        clientsRetained: { value: e.clientsRetained, label: fmt(e.clientsRetained) },
        asOf: e.asOf || "",
        source: e.source || ""
      };
    }
    const gained = estimateProjectLeadsGained(item);
    const touch = estimateCustomerTouchpoints(item);
    const retained = gained.value != null ? gained.value * PAV_HISTORICAL.leadToCaseRate : null;
    return {
      leadsImpacted: { value: null, label: touch },
      leadsConnected: { value: gained.value, label: gained.label },
      clientsRetained: {
        value: retained,
        label: retained != null ? `~${(Math.round(retained * 10) / 10).toFixed(retained < 1 ? 1 : 0)}/mo` : "—"
      },
      asOf: "",
      source: ""
    };
  }

  function impactEstimatesHtml(item) {
    const imp = resolveImpactEstimates(item);
    const asOf = imp.asOf ? `<span class="impact-as-of">As of ${escapeHtml(imp.asOf)}</span>` : "";
    return `<div class="impact-estimates-block">
      <h4>Impact estimates ${asOf}</h4>
      <ul class="impact-estimates-list">
        <li><strong>Leads impacted:</strong> ${escapeHtml(imp.leadsImpacted.label)}</li>
        <li><strong>Leads connected:</strong> ${escapeHtml(imp.leadsConnected.label)}</li>
        <li><strong>Est. revenue:</strong> —</li>
      </ul>
      ${gilbertMetricNotesHtml(item)}
    </div>`;
  }

  function campaignMetricsListHtml(title, items, placeholder, options) {
    const opts = options || {};
    const cls = ["campaign-metrics-block", opts.className].filter(Boolean).join(" ");
    if (items && items.length) {
      return `<div class="${cls}"><h4>${title}</h4><ul class="campaign-metrics-list">${items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`;
    }
    if (placeholder) {
      return `<div class="${cls}"><h4>${title}</h4><p class="results-placeholder">${placeholder}</p></div>`;
    }
    return "";
  }

  function campaignMetricsHtml(item) {
    const blocks = [impactEstimatesHtml(item)];
    if (item.goal) {
      blocks.push(`<div class="campaign-metrics-block campaign-goal-block"><h4>Goal</h4><p>${escapeHtml(item.goal)}</p></div>`);
    }
    blocks.push(campaignMetricsListHtml("Results", item.resultsItems, item.resultsItems?.length ? "" : `Add ## Results in ${item.id}.md`));
    blocks.push(campaignMetricsListHtml("Recommended metrics", item.recommendedMetrics, ""));
    blocks.push(campaignMetricsListHtml("Blockers (next round)", item.blockers, "Add ## Blockers (next round) in project markdown", { className: "campaign-blockers-callout" }));
    blocks.push(campaignMetricsListHtml("Insights & improvements", item.insightsImprovements, "Add ## Insights & improvements in project markdown"));
    const content = blocks.filter(Boolean).join("");
    return content ? `<div class="campaign-metrics-panel">${content}</div>` : "";
  }

  function resultsBlockHtml(item) {
    let html = campaignMetricsHtml(item);
    const auto = [...(item.completedItems || []), ...(item.inProgressItems || [])];
    if (auto.length) {
      html += `<div class="completed-auto"><h4>Work logged</h4><ul>${auto.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul></div>`;
    }
    if (item.backedMetric && item.backedMetric.label) {
      html += `<div class="completed-auto"><h4>Verified data</h4><p>${escapeHtml(item.backedMetric.label)}</p>${item.backedMetric.source ? `<p class="completed-source">${escapeHtml(item.backedMetric.source)}</p>` : ""}</div>`;
    }
    return html;
  }

  function completedCardHtml(item) {
    return `<article class="completed-card" id="completed-${item.id}">
      <h3>${escapeHtml(item.title)}</h3>
      <p class="completed-card-meta">${escapeHtml(item.id)} · ${escapeHtml(normalizeStatus(item))}${item.timeline ? ` · ${escapeHtml(item.timeline)}` : ""}</p>
      ${resultsBlockHtml(item)}
    </article>`;
  }

  function completedReportOutProjectHtml(item) {
    const shipped = (item.resultsItems || []).slice(0, 3);
    const next = (item.insightsImprovements || item.blockers || []).slice(0, 2);
    const imp = resolveImpactEstimates(item);
    const metaParts = [
      normalizeStatus(item),
      item.timeline,
      [item.category, item.campaignType].filter(Boolean).join(" / ")
    ].filter(Boolean);
    const impactLine = item.impactEstimates?.note
      ? `${escapeHtml(item.impactEstimates.note)} · Est. revenue —`
      : `Leads impacted ${escapeHtml(imp.leadsImpacted.label)} · connected ${escapeHtml(imp.leadsConnected.label)}${imp.asOf ? ` · as of ${escapeHtml(imp.asOf)}` : ""} · Est. revenue —`;
    return `<div class="completed-report-out-project">
      <h4>${escapeHtml(item.id)} — ${escapeHtml(item.title)}</h4>
      <p class="completed-report-out-project-meta">${escapeHtml(metaParts.join(" · "))}</p>
      <ul>
        ${item.goal ? `<li><strong>Goal:</strong> ${escapeHtml(item.goal)}</li>` : ""}
        ${shipped.length ? `<li><strong>Shipped:</strong> ${escapeHtml(shipped.join("; "))}</li>` : `<li><strong>Shipped:</strong> <em>Add ## Results in ${escapeHtml(item.id)}.md</em></li>`}
        <li><strong>Impact:</strong> ${impactLine}</li>
        ${next.length ? `<li><strong>Next:</strong> ${escapeHtml(next.join("; "))}</li>` : ""}
      </ul>
    </div>`;
  }

  function completedReportOutHtml(items) {
    if (!items.length) {
      return `<div class="completed-report-out-head">
          <span class="completed-report-out-badge">Draft</span>
          <h3>Report out — completed projects</h3>
        </div>
        <p class="completed-report-out-lede">No projects marked <strong>completed</strong> in INDEX yet. When a project ships, set Status to completed and fill <code>## Results</code> / <code>## Insights</code> — this report-out will populate automatically.</p>`;
    }
    const names = items.map(p => `<strong>${escapeHtml(p.id)} ${escapeHtml(p.title)}</strong>`).join("; ");
    const asOfDates = items.map(p => p.impactEstimates?.asOf).filter(Boolean);
    const asOf = asOfDates.length ? asOfDates.sort().slice(-1)[0] : "";
    const bottomBits = items.flatMap(p => (p.insightsImprovements || []).slice(0, 1));
    const bottom = bottomBits.length
      ? bottomBits.join(" · ")
      : "Confirm outcomes in HubSpot before locking revenue figures.";
    const closer =
      items.some(p => p.id === "A3") && items.some(p => p.id === "A10")
        ? "Holiday email path is live and the stack priorities are set. Continued lift depends on WIP enablers — phones (B2), LSA/intake coverage, and the KPI cockpit (A8)."
        : bottom;
    return `<div class="completed-report-out-head">
        <span class="completed-report-out-badge">Draft</span>
        <h3>Report out — completed projects</h3>
      </div>
      <p class="completed-report-out-lede">${asOf ? `As of ${escapeHtml(asOf)}, ` : ""}${items.length} project${items.length === 1 ? "" : "s"} closed: ${names}. Est. revenue remains <strong>—</strong> until attribution is validated. Detail cards below carry goals, results, blockers, and next-round insights.</p>
      ${items.map(completedReportOutProjectHtml).join("")}
      <p class="completed-report-out-bottom"><strong>Bottom line:</strong> ${escapeHtml(closer)}</p>
      <p class="completed-report-out-footnote">Draft for review — edit project markdown to update. Numbers from Impact estimates / Ad Reports where set.</p>`;
  }

  function renderCompletedList() {
    const el = document.getElementById("completed-list");
    const reportEl = document.getElementById("completed-report-out");
    const items = completedProjects();
    if (reportEl) reportEl.innerHTML = completedReportOutHtml(items);
    if (!el) return;
    el.innerHTML = items.length
      ? items.map(completedCardHtml).join("")
      : `<p class="kpi-dashboard-note">No completed projects in INDEX yet — set Status to <strong>completed</strong>.</p>`;
  }

  function researchRowHtml(item) {
    const id = item.id;
    const sel = state.projects.has(id);
    const note = (state.notes[id] || "").trim();
    const abQ = hasAbQuestions(item);
    const answered = abQuestionAnswered(id);
    const tagLabel = abQ && !answered ? "Comment — AB-Q" : (note ? "Comment ✓" : "+ Comment");
    return `<div class="research-row${sel ? " selected" : ""}${abQ && !answered ? " ab-q-pending" : ""}" data-id="${id}">
      <input type="checkbox" class="proj-chk research-chk" data-id="${id}" ${sel ? "checked" : ""}${abQ && !answered ? ' title="Answer AB – Q in Comment first"' : ""}>
      <div>
        <span class="research-row-id">${escapeHtml(id)}</span>
        <div class="research-row-title">${escapeHtml(item.title)}</div>
        ${abQ ? abQuestionsBannerHtml(item) : ""}
      </div>
      <button type="button" class="research-comment-tag${note ? " has-note" : ""}${abQ && !answered ? " needs-ab-q" : ""}" data-id="${id}">${tagLabel}</button>
      <div class="research-comment-popover" data-id="${id}" hidden>
        <textarea class="project-note" data-id="${id}" placeholder="${abQ ? "Answer for Andrew Brown (AB – Q)…" : "Planning notes for Gilded Goose…"}">${escapeHtml(state.notes[id] || "")}</textarea>
        <button type="button" class="comment-popover-done" data-id="${id}">Done</button>
      </div>
    </div>`;
  }

  function renderResearchSection() {
    const wrap = document.getElementById("research-section-wrap");
    if (!wrap) return;
    const items = researchProjects();
    if (!items.length || state.activeViewTab !== "picker") {
      wrap.innerHTML = "";
      return;
    }
    wrap.innerHTML = `<details class="research-section">
      <summary>Research &amp; planning <span class="research-row-id">(${items.length})</span></summary>
      <p class="research-section-note">Titles only — still selectable. Full card copy coming later.</p>
      ${items.map(researchRowHtml).join("")}
    </details>`;
  }

  function syncViewTabs() {
    state.activeViewTab = normalizeViewTab(state.activeViewTab);
    document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
      const on = btn.dataset.view === state.activeViewTab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    const activeCount = activeOptionalProjects().length + researchProjects().length;
    const doneCount = completedProjects().length;
    document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
      const view = btn.dataset.view;
      if (view === "kpis" || view === "dashboards") {
        const badge = btn.querySelector(".tab-count");
        if (badge) badge.remove();
        return;
      }
      const count = view === "impact" ? doneCount : activeCount;
      let badge = btn.querySelector(".tab-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "tab-count";
        btn.appendChild(badge);
      }
      badge.textContent = String(count);
    });
  }

  function renderViewLayout() {
    state.activeViewTab = normalizeViewTab(state.activeViewTab);
    const isKpis = state.activeViewTab === "kpis";
    const isPicker = state.activeViewTab === "picker";
    const isDashboards = state.activeViewTab === "dashboards";
    const isImpact = state.activeViewTab === "impact";
    const kpisPanel = document.getElementById("cockpit-panel-kpis");
    const pickerPanel = document.getElementById("cockpit-panel-picker");
    const dashboardsPanel = document.getElementById("cockpit-panel-dashboards");
    const impactPanel = document.getElementById("cockpit-panel-impact");
    if (kpisPanel) kpisPanel.hidden = !isKpis;
    if (pickerPanel) pickerPanel.hidden = !isPicker;
    if (dashboardsPanel) dashboardsPanel.hidden = !isDashboards;
    if (impactPanel) impactPanel.hidden = !isImpact;
    syncViewTabs();
    renderResearchSection();
    renderKpiDashboard();
    if (isImpact) {
      renderCompletedList();
      renderRevenueCalculator();
    }
  }

  const OMNI_CHANNEL_WHY =
    "Pav Law grows when the same trusted message meets clients wherever they search — paid search, display, directories, email, referrals, and the website. Omnichannel works because each channel feeds the others: ads drive qualified visits; a fast site and clear intake convert them; phones and CRM route every lead; retargeting and mailers bring back prospects who did not book the first time. Connected channels produce signed cases you can trace to spend — not siloed clicks.";

  const PROJECT_LIST_LIMIT = 10;

  const PERFORMANCE_PAY_IDS = new Set(["RETAINER", "A1", "A2", "A3", "A4", "A6", "A7", "A11"]);

  function getProjectsInvoiceTotal() {
    return getSelectedProjects().reduce((s, p) => s + itemSelectionCost(p), 0);
  }

  function updateInvoiceScheduleAmount() {
    const monthsEl = document.getElementById("invoice-payment-months");
    const amountEl = document.getElementById("invoice-payment-amount");
    const hintEl = document.getElementById("invoice-schedule-hint");
    if (!monthsEl || !amountEl) return;

    const months = monthsEl.value !== "" ? Number(monthsEl.value) : null;
    const projectTotal = getProjectsInvoiceTotal();
    const baseHint = "Deposit is billed immediately. Project invoices are sent via QuickBooks on the schedule you choose. Retainer and maintenance bill separately each month.";

    if (!months || months < 1) {
      amountEl.value = "";
      amountEl.placeholder = "Select invoices first";
      if (hintEl) hintEl.textContent = baseHint;
      syncPaymentTermsFromDom();
      return;
    }

    if (projectTotal <= 0) {
      amountEl.value = "";
      amountEl.placeholder = "No project fees to invoice";
      if (hintEl) {
        hintEl.textContent = "No one-time project fees selected — only retainer/maintenance apply. " + baseHint;
      }
      syncPaymentTermsFromDom();
      return;
    }

    const perInvoice = Math.round(projectTotal / months);
    amountEl.value = String(perInvoice);
    if (hintEl) {
      hintEl.textContent = `${fmt(projectTotal)} in project fees split over ${months} invoice${months === 1 ? "" : "s"} (${fmt(perInvoice)} each). ${baseHint}`;
    }
    syncPaymentTermsFromDom();
  }

  function getPaymentTermsPayload() {
    const monthsEl = document.getElementById("invoice-payment-months");
    const amountEl = document.getElementById("invoice-payment-amount");
    const monthsRaw = monthsEl ? monthsEl.value : state.invoicePaymentMonths;
    const amountRaw = amountEl ? amountEl.value : state.invoicePaymentMonthlyAmount;
    const months = monthsRaw !== "" && monthsRaw != null ? Number(monthsRaw) : null;
    const monthlyAmount = amountRaw !== "" && amountRaw != null ? Math.max(0, Number(amountRaw)) : null;
    const projectTotal = getProjectsInvoiceTotal();
    let label = null;
    if (months && monthlyAmount != null) {
      label = `${months} QuickBooks invoice${months === 1 ? "" : "s"} of ${fmt(monthlyAmount)} (${fmt(monthlyAmount * months)} project fees; deposit billed immediately)`;
    } else if (months) {
      label = `${months} invoice${months === 1 ? "" : "s"} — deposit billed immediately`;
    }
    return { months, monthlyAmount, projectTotal, label };
  }

  function syncPaymentTermsFromDom() {
    const monthsEl = document.getElementById("invoice-payment-months");
    const amountEl = document.getElementById("invoice-payment-amount");
    state.invoicePaymentMonths = monthsEl ? monthsEl.value : "";
    state.invoicePaymentMonthlyAmount = amountEl ? amountEl.value : "";
  }

  function getPaymentType(item, isRetainer) {
    const raw = item.paymentType;
    if (raw === "performance" || raw === "flat") return raw;
    if (isRetainer || item.id === "RETAINER") return "performance";
    if (item.monthlyOnly) return "flat";
    if (PERFORMANCE_PAY_IDS.has(item.id)) return "performance";
    return "flat";
  }

  function visibleOptionalProjects(optional) {
    if (state.showAllProjects) return optional;
    const selected = optional.filter(p => state.projects.has(p.id));
    const rest = optional.filter(p => !state.projects.has(p.id));
    const room = Math.max(0, PROJECT_LIST_LIMIT - selected.length);
    return [...selected, ...rest.slice(0, room)];
  }

  function hiddenOptionalCount(optional) {
    if (state.showAllProjects) return 0;
    return optional.length - visibleOptionalProjects(optional).length;
  }

  function sortValueIconsByFilterOrder(icons) {
    const order = VALUE_ICON_DEFS.map(d => d.id);
    return [...icons].sort((a, b) => {
      const ia = order.indexOf(a.id);
      const ib = order.indexOf(b.id);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
  }

  function inferValueIconIds(item) {
    const ids = [];
    const cat = `${item.category || ""} ${item.campaignType || ""}`.toLowerCase();
    const text = iconMatchText(item).toLowerCase();

    if (item.enabler) ids.push("foundation");
    if (/crm|hubspot|pipeline/.test(cat)) ids.push("crm");
    if (/paid media|outbound|ppc|search|lsa|display|google ads|microsoft|seasonal/.test(cat)) ids.push("leads");
    if (/seo|website|blog|local search|local presence/.test(cat)) ids.push("seo");
    if (/referral|direct mail|testimonial|social proof|past client/.test(cat)) ids.push("referrals");
    if (/analytics|strategy|finance|operations|kpi/.test(cat)) ids.push("efficiency");
    if (/intake|infrastructure|phone|call|voip|\bai\b/.test(cat)) ids.push("intake");
    if (/creative|email|social media|brand/.test(cat)) ids.push("creative");
    if (/booking|speed.to.lead|form fill|web lead|call tracking|voip/.test(text) && !ids.includes("intake")) ids.push("intake");
    if (/display|ntguilt|brand awareness|upper.funnel/.test(text) && /paid|display|brand|creative/.test(cat) && !ids.includes("creative")) {
      ids.push("creative");
    }
    return [...new Set(ids)];
  }

  function getValueIcons(item) {
    if (item.isRetainer || item.id === "RETAINER" || item.category === "Retainer") {
      const def = VALUE_ICON_DEFS.find(d => d.id === "retainer");
      return [def || { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Retainer" }];
    }
    let icons = [];
    if (item.valueIcons && item.valueIcons.length) {
      icons = item.valueIcons.map(id => {
        const def = VALUE_ICON_DEFS.find(d => d.id === id);
        return def || { id, svgId: id, cls: `icon-${id}`, label: id };
      });
    } else {
      const inferred = inferValueIconIds(item);
      if (inferred.length) {
        icons = inferred
          .map(id => VALUE_ICON_DEFS.find(d => d.id === id))
          .filter(Boolean);
      } else {
        for (const def of VALUE_ICON_DEFS) {
          if (def.id === "retainer") continue;
          if (def.match(item) && !icons.some(i => i.id === def.id)) icons.push(def);
        }
      }
    }
    if (!icons.length) icons.push({ id: "general", svgId: "general", cls: "icon-general", label: "Growth" });
    return sortValueIconsByFilterOrder(icons);
  }

  function valueIconsHtml(item) {
    const icons = getValueIcons(item);
    return `<span class="value-icons">${icons.map(valueIconMarkup).join("")}</span>`;
  }

  function accountDataIconHtml(item) {
    if (!item.backedMetric) return "";
    const label = item.backedMetric.label || "Verified account data";
    const src = item.backedMetric.source ? ` (${item.backedMetric.source})` : "";
    const tip = escapeHtml(label + src);
    return `<span class="account-data-shield" title="${tip}" aria-label="Account data: ${tip}">${accountDataBadgeImg()}</span>`;
  }

  function cardCornerIconsHtml(item, isRetainer, inline) {
    const valueHtml = valueIconsHtml({ ...item, isRetainer });
    const dataHtml = accountDataIconHtml(item);
    if (!valueHtml && !dataHtml) return "";
    const cls = inline ? "card-icons-inline" : "card-icons-corner";
    return `<div class="${cls}">${valueHtml}${dataHtml}</div>`;
  }

  function itemMatchesIconFilters(item) {
    if (!state.iconFilters.length) return true;
    if (state.iconFilters.includes("account-data") && item.backedMetric) return true;
    const iconIds = getValueIcons(item).map(i => i.id);
    return state.iconFilters.some(f => f !== "account-data" && iconIds.includes(f));
  }

  function toggleIconFilter(id) {
    const idx = state.iconFilters.indexOf(id);
    if (idx >= 0) state.iconFilters.splice(idx, 1);
    else state.iconFilters.push(id);
    saveState();
    renderValueIconKey();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function clearIconFilters() {
    state.iconFilters = [];
    saveState();
    renderValueIconKey();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function renderValueIconKey() {
    const el = document.getElementById("value-icon-key");
    if (!el) return;
    const hint = state.iconFilters.length
      ? `<button type="button" class="icon-filter-clear" id="icon-filter-clear">Clear filters (${state.iconFilters.length})</button>`
      : "";
    const kpiHintHtml = (iconId) => {
      const kpis = ICON_KPI_MAP[iconId] || [];
      if (!kpis.length) return "";
      return `<span class="key-kpi-hint">${kpis.slice(0, 4).map(id => {
        const label = String(id).replace(/^#/, "");
        return `<a href="#" class="kpi-ref-link" data-kpi="${id}" title="Open ${id} in dashboard">${escapeHtml(label)}</a>`;
      }).join("")}</span>`;
    };
    el.innerHTML = `<span class="value-icon-key-title">Filter by value</span>${hint}` +
      VALUE_ICON_DEFS.map(d => {
        const active = state.iconFilters.includes(d.id) ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn key-filter-${d.id}${active}" data-icon-filter="${d.id}">${valueIconMarkup(d)}<span class="key-item-meta"><span class="key-item-label">${escapeHtml(d.label)}</span>${kpiHintHtml(d.id)}</span></button>`;
      }).join("") +
      (() => {
        const active = state.iconFilters.includes("account-data") ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn key-filter-account-data${active}" data-icon-filter="account-data"><span class="account-data-shield key-shield">${accountDataBadgeImg()}</span><span class="key-item-meta"><span class="key-item-label">Account data</span>${kpiHintHtml("account-data")}</span></button>`;
      })();
    el.querySelectorAll(".key-filter-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        if (e.target.closest(".kpi-ref-link")) return;
        toggleIconFilter(btn.dataset.iconFilter);
      });
    });
    el.querySelector("#icon-filter-clear")?.addEventListener("click", clearIconFilters);
  }

  function normalizeKpiId(kpiId) {
    const raw = String(kpiId || "").trim();
    if (!raw) return "";
    if (raw.startsWith("#")) return raw.length === 3 ? raw : `#${raw.slice(1).padStart(2, "0")}`;
    const n = raw.replace(/\D/g, "");
    return n ? `#${n.padStart(2, "0")}` : "";
  }

  function focusKpi(kpiId) {
    const id = normalizeKpiId(kpiId);
    if (!id) return;
    const tab = KPI_DASHBOARD_IDS.has(id) ? "dashboards" : "kpis";
    setActiveViewTab(tab);
    renderViewLayout();
    requestAnimationFrame(() => {
      window.KPI_REPORT?.focusKpi?.(id);
    });
  }

  function getProjectKpiIds(item) {
    const ids = new Set(item.kpiRefs || []);
    getValueIcons(item).forEach(icon => {
      (ICON_KPI_MAP[icon.id] || []).forEach(k => ids.add(k));
    });
    if (item.backedMetric) {
      (ICON_KPI_MAP["account-data"] || []).forEach(k => ids.add(k));
    }
    return [...ids].sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  }

  function projectKpiRefsHtml(item) {
    const ids = getProjectKpiIds(item);
    if (!ids.length) return "";
    return `<div class="card-kpi-refs" aria-label="Related dashboard KPIs">${ids.map(id =>
      `<a href="#" class="kpi-ref-link" data-kpi="${id}">${id}</a>`
    ).join("")}</div>`;
  }

  function isItemSelected(item) {
    if (item.isRetainer || item.id === "RETAINER") return state.retainer;
    return state.projects.has(item.id);
  }

  function getMaintenanceProjects() {
    return PROJECTS.filter(p => p.monthlyOnly);
  }

  function requiredMaintenanceMonthly() {
    let n = state.retainer ? RETAINER.fee : 0;
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) n += p.fee;
    });
    return n;
  }

  function sortCartFirst(items) {
    return [...items].sort((a, b) => {
      const aSel = isItemSelected(a);
      const bSel = isItemSelected(b);
      if (aSel !== bSel) return aSel ? -1 : 1;
      const aRec = state.recommended.has(a.id);
      const bRec = state.recommended.has(b.id);
      if (aRec !== bRec) return aRec ? -1 : 1;
      const planDiff = (isPlanningPublish(a) ? 1 : 0) - (isPlanningPublish(b) ? 1 : 0);
      if (planDiff !== 0) return planDiff;
      return (a.priority ?? 99) - (b.priority ?? 99);
    });
  }

  function sortSelectedFirst(items) {
    return sortCartFirst(items);
  }

  function getInvoiceLineItems() {
    const rows = [];
    if (state.retainer) {
      rows.push({ id: "RETAINER", title: RETAINER.title, fee: feeLabelFor(RETAINER) });
    }
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) {
        rows.push({ id: p.id, title: p.title, fee: feeLabelFor(p) });
      }
    });
    getSelectedProjects().forEach(p => {
      rows.push({ id: p.id, title: p.title, fee: feeLabelFor(p) });
    });
    return rows;
  }

  function getSuggestedItems() {
    const items = [];
    if (state.retainer) items.push({ ...RETAINER, isRetainer: true });
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) items.push({ ...p, isRetainer: false });
    });
    getSelectedProjects().forEach(p => items.push({ ...p, isRetainer: false }));
    return sortByPriority(items);
  }

  function projectAnchor(id) {
    return `#project-${id}`;
  }

  const PAV_HISTORICAL = {
    answerRate: 0.69,
    consultToRetained: 0.51,
    leadToCaseRate: 9 / 124,
    avgCaseFee: 4800,
    monthlyLeadsBaseline: 124
  };

  const ACCOUNT_KPI_ACTIONS = [
    { kpi: "#21", text: "Answered phones 69% — assign Casey phone block Wed AM", projectIds: ["B2", "RETAINER", "A8", "B1", "A6"] },
    { kpi: "#19", text: "Est. missed revenue $4,200/mo — review Search routing + after-hours callback", projectIds: ["B2", "RETAINER", "A6", "A8", "A1"] },
    { kpi: "#15", text: "CPL $142 over target — pause Core DV bleed", projectIds: ["RETAINER", "A1"] },
    { kpi: "#17", text: "GBP referrals −3 MoM — refresh profile + UTM pass", projectIds: ["B10", "A2", "B5"] }
  ];

  function getCartSelectionItems() {
    const items = [];
    if (state.retainer) items.push({ ...RETAINER, isRetainer: true });
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) items.push({ ...p, isRetainer: false });
    });
    getSelectedProjects().forEach(p => items.push({ ...p, isRetainer: false }));
    return items;
  }

  function buildActionItems(selectionItems) {
    const items = selectionItems || getCartSelectionItems();
    if (!items.length) return [];

    const selectedIds = new Set(items.map(i => i.id));
    const actions = [];
    const seen = new Set();

    function pushAction(action) {
      const key = (action.kpi || "") + "|" + action.text;
      if (seen.has(key)) return;
      seen.add(key);
      actions.push(action);
    }

    ACCOUNT_KPI_ACTIONS.forEach(a => {
      if (a.projectIds.some(id => selectedIds.has(id))) {
        pushAction({ kpi: a.kpi, text: a.text, source: "kpi" });
      }
    });

    items.filter(i => !i.monthlyOnly).forEach(item => {
      (item.blockers || []).slice(0, 2).forEach(blocker => {
        if (!blocker || !String(blocker).trim()) return;
        pushAction({
          kpi: item.id,
          text: blocker,
          projectId: item.id,
          projectTitle: item.title,
          source: "blocker"
        });
      });
    });

    return actions.slice(0, 14);
  }

  function buildActionItemsHtml(actions) {
    if (!actions || !actions.length) return "";
    const list = actions.map(a => {
      const tag = a.source === "kpi" ? a.kpi : escapeHtml(a.kpi);
      const projectHint = a.projectTitle && a.source === "blocker"
        ? ` <span class="action-project-hint">(${escapeHtml(a.projectTitle)})</span>`
        : "";
      return `<li><span class="kpi-stat-id">${tag}</span> ${escapeHtml(a.text)}${projectHint}</li>`;
    }).join("");
    return `<h3>Action items</h3>
      <p class="action-items-intro">From your selections and Jun 2026 account KPIs — address these as projects kick off.</p>
      <ul class="kpi-action-list">${list}</ul>`;
  }

  function buildConfirmNextStepsHtml() {
    const rec = buildRecommendation();
    const ordered = getCartSelectionItems()
      .filter(i => !i.monthlyOnly)
      .sort((a, b) => {
        if (a.enabler && !b.enabler) return -1;
        if (b.enabler && !a.enabler) return 1;
        if (a.isRetainer && !b.isRetainer) return -1;
        if (b.isRetainer && !a.isRetainer) return 1;
        return (a.priority ?? 99) - (b.priority ?? 99);
      });
    if (!ordered.length) {
      return `<h3>Next steps</h3><p class="confirm-next-foot">Add projects to your cart, then return here for an execution sequence.</p>`;
    }
    let html = `<h3>Next steps</h3>`;
    if (rec?.strategy) {
      html += `<p class="confirm-next-intro">${escapeHtml(rec.strategy)}</p>`;
    }
    html += `<ol class="confirm-next-list">${ordered.map(item => {
      const pitch = briefValueAdd(item) || item.timeline || "Kick off after deposit clears";
      return `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(pitch)}</li>`;
    }).join("")}</ol>`;
    html += `<p class="confirm-next-foot">After submit: pay the QuickBooks deposit, Gilded Goose schedules kickoff, and project invoices follow your chosen schedule.</p>`;
    return html;
  }

  function formatNextStepsText() {
    const ordered = getCartSelectionItems()
      .filter(i => !i.monthlyOnly)
      .sort((a, b) => {
        if (a.enabler && !b.enabler) return -1;
        if (b.enabler && !a.enabler) return 1;
        if (a.isRetainer && !b.isRetainer) return -1;
        if (b.isRetainer && !a.isRetainer) return 1;
        return (a.priority ?? 99) - (b.priority ?? 99);
      });
    const rec = buildRecommendation();
    const lines = [];
    if (rec?.strategy) lines.push(rec.strategy);
    ordered.forEach((item, i) => {
      const pitch = briefValueAdd(item) || item.timeline || "Kick off after deposit";
      lines.push(`  ${i + 1}. ${item.title} — ${pitch}`);
    });
    return lines.length ? lines.join("\n") : "(none)";
  }

  function renderActionItemsPanel() {
    const actions = buildActionItems();
    const html = buildActionItemsHtml(actions);
    const el = document.getElementById("confirm-action-items");
    if (!el) return;
    if (!html || !actions.length) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML = html;
  }

  function renderConfirmPlanReview() {
    const selected = getSelectedProjects();
    const estEl = document.getElementById("confirm-estimated-results");
    if (estEl) {
      const totals = buildRevenueCalculatorHtml();
      const returns = buildThankYouReturnsHtml(selected, state.retainer);
      const hasCart = getInvoiceLineItems().length > 0;
      estEl.innerHTML = hasCart
        ? `<h3>Estimated results</h3><div class="confirm-priorities-wrap">${totals}</div>${returns}`
        : `<h3>Estimated results</h3><p class="confirm-next-foot">Notes or Gilbert chat only — add projects for impact estimates.</p>`;
    }
    renderActionItemsPanel();
    const nextEl = document.getElementById("confirm-next-steps");
    if (nextEl) nextEl.innerHTML = buildConfirmNextStepsHtml();
  }

  function formatActionItemsText(actions) {
    if (!actions || !actions.length) return "(none)";
    return actions.map(a => {
      const prefix = a.source === "kpi" ? a.kpi : a.kpi + (a.projectTitle ? " · " + a.projectTitle : "");
      return `  ${prefix}: ${a.text}`;
    }).join("\n");
  }

  function openProjectDescription(id) {
    if (!id) return;
    if (id !== "RETAINER") {
      state.expanded.add(id);
      saveState();
      renderAllCards();
    }
    requestAnimationFrame(() => {
      document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function parseLeadsFromEstimatedText(text) {
    if (!text || /n\/a|not lead|cost savings|strategy audit/i.test(text)) return null;
    const range = text.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
    if (range) return { value: (Number(range[1]) + Number(range[2])) / 2, isCalls: /calls?/i.test(text) };
    const perMonth = text.match(/(\d+(?:\.\d+)?)\s*\/\s*mo/i);
    if (perMonth) return { value: Number(perMonth[1]), isCalls: /calls?/i.test(text) };
    const calls = text.match(/~?(\d+)\s*calls?/i);
    if (calls) return { value: Number(calls[1]), isCalls: true };
    if (/all tracked|all inbound|unified|hubspot \+ lsa|124\/mo/i.test(text)) {
      return { value: PAV_HISTORICAL.monthlyLeadsBaseline, isCalls: false };
    }
    return null;
  }

  function estimateProjectLeadsGained(item) {
    if (!item) return { value: null, label: "—", isCalls: false };
    const nonCampaignIds = new Set(["RETAINER", "A6", "A8", "A8M", "A10", "B1", "B3", "B9", "B10"]);
    if (item.isRetainer || nonCampaignIds.has(item.id))
      return { value: null, label: "No direct leads", isCalls: false };
    if (item.id === "B2") {
      const baselineCalls = 35;
      const recovered = baselineCalls * (0.90 - PAV_HISTORICAL.answerRate);
      return { value: recovered, label: `~${Math.round(recovered)} gained/mo`, isCalls: false };
    }
    const r = item.returnEstimate;
    if (r?.calls) {
      const calls = (r.calls.min + r.calls.max) / 2;
      const value = calls * PAV_HISTORICAL.answerRate;
      return {
        value,
        label: `~${Math.round(value)} gained/mo`,
        isCalls: false
      };
    }
    if (r?.consults) {
      const value = (r.consults.min + r.consults.max) / 2;
      return { value, label: `${r.consults.min}–${r.consults.max} consults/mo`, isCalls: false };
    }
    const text = item.estimatedLeads || "";
    if (/retained matters/i.test(text)) {
      return { value: 1.5, label: "1–2 gained/wave", isCalls: false };
    }
    const parsed = parseLeadsFromEstimatedText(text);
    if (parsed) {
      const value = parsed.isCalls ? parsed.value * PAV_HISTORICAL.answerRate : parsed.value;
      return { value, label: `~${Math.round(value)} gained/mo`, isCalls: false };
    }
    return { value: null, label: "Estimate pending", isCalls: false };
  }

  function estimateCustomerTouchpoints(item) {
    if (!item) return "—";
    const explicit = String(item.clientTouchpoints || "").match(/~?(\d[\d,]*(?:\.\d+)?)\s*(?:–|-)?\s*(\d[\d,]*(?:\.\d+)?)?/);
    if (explicit) {
      const first = explicit[1];
      const second = explicit[2];
      return second ? `${first}–${second}` : `~${first}`;
    }
    const leadText = String(item.estimatedLeads || "");
    const households = leadText.match(/~?(\d[\d,]*)\s*households?/i);
    if (households) return `~${households[1]}/wave`;
    const parsed = parseLeadsFromEstimatedText(leadText);
    if (parsed) return `~${Math.round(parsed.value)}/mo`;
    if (/all inbound|all tracked|unified/i.test(leadText))
      return `~${PAV_HISTORICAL.monthlyLeadsBaseline}/mo`;
    return "Estimate pending";
  }

  function estimateProjectLeadRevenue(item) {
    const leads = estimateProjectLeadsGained(item);
    if (leads.value != null && leads.value > 0) {
      let funnelLeads = leads.value;
      if (leads.isCalls) funnelLeads = leads.value * PAV_HISTORICAL.answerRate;
      const cases = funnelLeads * PAV_HISTORICAL.leadToCaseRate;
      const revenue = Math.round(cases * PAV_HISTORICAL.avgCaseFee);
      return { value: revenue, label: `${fmt(revenue)}/mo` };
    }
    const pf = item?.returnEstimate?.potentialFees;
    if (pf) {
      const mid = Math.round((pf.min + pf.max) / 2);
      return { value: mid, label: `${fmt(pf.min)}–${fmt(pf.max)}${pf.period ? " " + pf.period : ""}` };
    }
    return { value: null, label: "—" };
  }

  function buildRecommendation() {
    const selected = [];
    if (state.retainer) selected.push({ ...RETAINER, isRetainer: true });
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) selected.push({ ...p, isRetainer: false });
    });
    getSelectedProjects().forEach(p => selected.push({ ...p, isRetainer: false }));

    const hasGoal = !!state.goalText.trim();
    const projectItems = selected.filter(i => !i.isRetainer && !i.monthlyOnly);

    if (!selected.length && !hasGoal) return null;

    const rec = { goalIntro: null, maintenanceOnly: false, projectBullets: [], omnichannel: OMNI_CHANNEL_WHY, strategy: null, pickPrompt: null };

    if (hasGoal) {
      const g = state.goalText.trim();
      rec.goalIntro =
        `You told Gilbert the core problem is: "${g.length > 160 ? g.slice(0, 160) + "…" : g}". The projects below close that gap — not as a random list, but as a sequenced marketing stack.`;
    }

    if (!projectItems.length && selected.length) {
      rec.maintenanceOnly = true;
      return rec;
    }

    if (projectItems.length) {
      rec.projectBullets = projectItems.map(item => ({
        title: item.title,
        blurb: briefValueAdd(item),
        pitch: elevatorPitch(item)
      }));

      const hasEnabler = selected.some(i => i.enabler);
      const hasLeads = selected.some(i => getValueIcons(i).some(v => v.id === "leads"));
      const hasIntake = selected.some(i => getValueIcons(i).some(v => v.id === "intake" || v.id === "crm"));
      const hasSeo = selected.some(i => getValueIcons(i).some(v => v.id === "seo"));
      const hasReferrals = selected.some(i => getValueIcons(i).some(v => v.id === "referrals"));
      const hasRetainer = selected.some(i => i.isRetainer || i.id === "RETAINER");

      let strategy = "";
      if (hasEnabler && hasLeads) {
        strategy = "Fix tracking, phones, and CRM infrastructure first, then scale paid media. That order protects ad spend — you know which campaigns and keywords produce signed cases before you increase budget.";
      } else if (hasEnabler && hasIntake) {
        strategy = "Build the foundation (calls, forms, routing) alongside intake improvements so every lead is captured and followed up before you push more traffic.";
      } else if (hasLeads && hasIntake) {
        strategy = "Pair lead generation with intake and follow-up work so consult volume rises without dropping response time or Romina's desk.";
      } else if (hasLeads && hasSeo) {
        strategy = "Combine paid search and display with organic and site content so you own both high-intent clicks and long-tail discovery.";
      } else if (hasReferrals && hasLeads) {
        strategy = "Balance outbound and paid leads with referral and past-client programs — lower CAC on the referral side, predictable volume from ads.";
      } else if (hasLeads) {
        strategy = "Focus spend on measurable calls and consults tied to account data, then optimize creative and landing pages against what actually converts.";
      } else if (hasSeo) {
        strategy = "Strengthen owned channels (site, SEO, content) so the firm is less dependent on paid auction costs over time.";
      } else if (projectItems.length > 1) {
        strategy = "These projects stack — each unlocks or amplifies the next so the firm compounds results instead of running siloed one-offs.";
      } else {
        strategy = "This project targets a specific bottleneck; add foundation or retainer work if you want a fuller stack.";
      }

      if (hasRetainer && projectItems.length) {
        strategy += " The retainer keeps campaigns managed and optimized while project work delivers the structural upgrades.";
      }

      rec.strategy = strategy;
    } else if (hasGoal) {
      rec.pickPrompt = "Pick projects from the list below — Gilbert will explain how they fit together as you add them.";
    }

    return rec;
  }

  function renderWhyPanel() {
    const el = document.getElementById("why-panel");
    if (!el) return;
    const rec = buildRecommendation();
    if (!rec) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }

    let body = "";
    if (rec.goalIntro) body += `<p class="why-lead">${escapeHtml(rec.goalIntro)}</p>`;
    if (rec.maintenanceOnly) {
      body += `<p>Your cart is retainer and required maintenance only — ongoing ads management and monthly upkeep so performance stays stable while you decide on upgrade projects.</p>`;
    } else if (rec.projectBullets.length) {
      body += `<h4 class="why-subhead">What each project adds</h4><ul class="why-project-list">${rec.projectBullets.map(b =>
        `<li><strong>${escapeHtml(b.title)}</strong>${b.pitch ? ` — ${escapeHtml(b.pitch)}` : ""}</li>`
      ).join("")}</ul>`;
      body += `<h4 class="why-subhead">Why omnichannel marketing works</h4><p>${escapeHtml(rec.omnichannel)}</p>`;
      if (rec.strategy) {
        body += `<h4 class="why-subhead">How these fit together</h4><p>${escapeHtml(rec.strategy)}</p>`;
      }
    } else if (rec.pickPrompt) {
      body += `<p>${escapeHtml(rec.pickPrompt)}</p>`;
    }

    if (!body) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }

    el.hidden = false;
    el.innerHTML = `<div class="why-gilded-frame"><div class="recommendation-box"><h3>Why this combination</h3>${body}</div></div>`;
  }

  function renderPlanSummary() {
    const el = document.getElementById("plan-summary");
    const wrap = document.getElementById("pav-priorities-cart-wrap");
    if (!el) return;
    const hasItems = getInvoiceLineItems().length > 0;
    if (wrap) wrap.hidden = !hasItems;
    el.innerHTML = buildPrioritiesCartHtml();
  }

  function renderRevenueCalculator() {
    const el = document.getElementById("revenue-calculator");
    if (!el) return;
    el.innerHTML = buildRevenueCalculatorHtml();
  }

  function renderRecommendation() {
    renderPlanSummary();
  }

  function getAllItems() {
    return [{ ...RETAINER, isRetainer: true }, ...PROJECTS.map(p => ({ ...p, isRetainer: false }))];
  }

  function hasPartialProgress(item) {
    return (item.completedItems || []).length > 0 || (item.inProgressItems || []).length > 0;
  }

  function wipBadgeUnderCheckbox(item) {
    if (item.status === "completed") return "";
    if (item.status === "wip" || hasPartialProgress(item)) {
      return `<span class="badge badge-wip card-wip-under-chk" title="Work already started on this project">WIP</span>`;
    }
    return "";
  }

  function cardCheckColHtml(item, isRetainer, required, sel, chkDisabled, abPending) {
    const id = item.id;
    const reqMark = required ? requiredMarkerHtml(item, isRetainer) : "";
    const abTitle = abPending ? ' title="AB – Q: answer in Comment before cart"' : "";
    return `<div class="card-check-col">
      <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer"' : ""}${chkDisabled}${abTitle} ${sel ? "checked" : ""}>
      ${reqMark}
      ${wipBadgeUnderCheckbox(item)}
    </div>`;
  }

  function stripInlineLinks(html) {
    if (!html) return "";
    return String(html)
      .replace(/<a [^>]*>(.*?)<\/a>/gi, "$1")
      .replace(/<\/?[^>]+(>|$)/g, "");
  }

  function conciseDescription(item) {
    const desc = stripInlineLinks(item.description || "");
    if (!desc) return "";
    const first = desc.match(/[^.!?]+[.!?]+/);
    const text = first ? first[0].trim() : desc;
    return text.length > 160 ? text.slice(0, 157).trim() + "…" : text;
  }

  function elevatorPitch(item) {
    const bullets = valueAddedBullets(item);
    if (bullets.length) {
      let b = String(bullets[0]).replace(/^Deliverable:\s*/i, "").trim().replace(/^[-•]\s*/, "");
      if (!/[.!?]$/.test(b)) b += ".";
      if (/^(builds?|creates?|adds?|delivers?|launches?|fixes?|improves?|enables?|reduces?|increases?|pairs?|combines?|strengthens?)/i.test(b)) {
        return `For Pav Law, this project ${b.charAt(0).toLowerCase()}${b.slice(1)}`;
      }
      return `For Pav Law, this means ${b.charAt(0).toLowerCase()}${b.slice(1)}`;
    }
    if (item.enabler) {
      return "Foundation work that connects phones, forms, and ad tracking — so every marketing dollar ties to a qualified consult, not a dead lead.";
    }
    const iconIds = getValueIcons(item).map(i => i.id);
    if (iconIds.includes("leads")) {
      return "More qualified calls and consults from paid media — with spend tied to signed cases, not vanity clicks.";
    }
    if (iconIds.includes("intake")) {
      return "Faster, more reliable intake — so leads that arrive after hours or from referrals convert to booked consults.";
    }
    if (iconIds.includes("seo")) {
      return "Stronger organic visibility — so Pav Law earns discovery traffic beyond paid auction costs.";
    }
    if (iconIds.includes("referrals")) {
      return "Structured referral and past-client outreach — lower acquisition cost than cold paid leads alone.";
    }
    if (iconIds.includes("crm")) {
      return "A tighter CRM and pipeline — so Romina's desk sees every lead, every follow-up, and every consult in one place.";
    }
    if (item.isRetainer || item.id === "RETAINER") {
      return "Ongoing ads management and optimization — campaigns stay live, measured, and adjusted month over month.";
    }
    const r = item.returnEstimate;
    if (r && r.summary) return r.summary;
    const desc = stripInlineLinks(item.description || "");
    const first = desc.match(/[^.!?]+[.!?]+/);
    if (first) {
      let s = first[0].trim();
      if (s.length > 200) s = s.slice(0, 197).trim() + "…";
      return s;
    }
    return `${item.title} — scoped deliverables, clear timeline, and marketing tied to consult volume and signed cases.`;
  }

  const EXECUTION_BLURB_PATTERN = /→|utm|hubspot task|workflow|extension|verif|dashboard plan|export|sheet|romina desk|lsa's/i;

  function cleanBusinessText(text) {
    return String(text || "")
      .replace(/^Deliverable:\s*/i, "")
      .replace(/^[-•]\s*/, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isExecutionBlurb(text) {
    return EXECUTION_BLURB_PATTERN.test(text);
  }

  function businessBullets(item) {
    return valueAddedBullets(item)
      .map(cleanBusinessText)
      .filter(b => b && !isExecutionBlurb(b));
  }

  function iconValuePitch(item) {
    const iconIds = getValueIcons(item).map(i => i.id);
    if (item.enabler) {
      return "Foundation work that connects phones, forms, and ad tracking so every marketing dollar ties to a qualified consult — not a lost lead.";
    }
    if (iconIds.includes("leads")) {
      return "Drives more qualified calls and consults from paid media, with spend measured against signed cases rather than vanity clicks.";
    }
    if (iconIds.includes("intake")) {
      return "Strengthens intake reliability so inquiries that arrive after hours or from referrals convert to booked consults instead of dropping off.";
    }
    if (iconIds.includes("seo")) {
      return "Builds organic visibility so Pav Law earns discovery traffic beyond rising paid auction costs.";
    }
    if (iconIds.includes("referrals")) {
      return "Activates referral and past-client channels to lower acquisition cost compared with cold paid leads alone.";
    }
    if (iconIds.includes("crm")) {
      return "Tightens pipeline visibility so every lead, follow-up, and consult is tracked in one place — improving speed to consult and close rate.";
    }
    if (iconIds.includes("creative")) {
      return "Extends brand presence and creative reach so prospects recognize Pav Law before they search or call.";
    }
    if (iconIds.includes("efficiency")) {
      return "Improves reporting and decision-making so leadership sees which channels and campaigns actually produce revenue.";
    }
    if (item.isRetainer || item.id === "RETAINER") {
      return "Keeps campaigns live, measured, and optimized month over month so ad spend continues to produce consults at sustainable cost.";
    }
    return "";
  }

  function tableValueAdd(item) {
    if (item.tableValue && String(item.tableValue).trim()) return String(item.tableValue).trim();

    const parts = [];
    const tldr = item.tldr ? cleanBusinessText(item.tldr) : "";
    if (tldr && !isExecutionBlurb(tldr)) {
      parts.push(/[.!?]$/.test(tldr) ? tldr : `${tldr}.`);
    }

    const bullets = businessBullets(item);
    if (!parts.length && bullets.length) {
      let b = bullets[0];
      if (!/[.!?]$/.test(b)) b += ".";
      parts.push(b);
    }

    if (!parts.length) {
      const pitch = iconValuePitch(item);
      if (pitch) parts.push(pitch);
    }

    if (!parts.length) {
      const desc = stripInlineLinks(item.description || "");
      const sent = desc.match(/[^.!?]+[.!?]+/);
      if (sent) parts.push(sent[0].trim());
    }

    if (parts.length === 1 && bullets.length > 1) {
      const extra = bullets.find(b => !parts[0].includes(b.slice(0, Math.min(28, b.length))));
      if (extra) {
        let e = extra;
        if (!/[.!?]$/.test(e)) e += ".";
        parts.push(e);
      }
    }

    if (!parts.length) {
      return `${item.title} — scoped work with clear timeline and marketing tied to consult volume and signed cases.`;
    }

    let out = parts.slice(0, 2).join(" ");
    if (out.length > 300) out = out.slice(0, 297).trim() + "…";
    return out;
  }

  function briefValueAdd(item) {
    return tableValueAdd(item);
  }

  function fullDescriptionText(item) {
    const desc = item.description ? String(item.description).trim() : "";
    const edu = item.marketingEducation ? String(item.marketingEducation).trim() : "";
    if (!edu) return desc;
    if (desc && desc.toLowerCase().includes(edu.slice(0, Math.min(48, edu.length)).toLowerCase())) return desc;
    return [desc, edu].filter(Boolean).join("\n\n");
  }

  function itemTldr(item) {
    if (item.tldr && String(item.tldr).trim()) return String(item.tldr).trim();
    const bullets = valueAddedBullets(item);
    if (bullets.length) {
      let b = String(bullets[0]).replace(/^Deliverable:\s*/i, "").trim().replace(/^[-•]\s*/, "");
      if (!/[.!?]$/.test(b)) b += ".";
      return b;
    }
    return elevatorPitch(item);
  }

  function valueAddedListHtml(item) {
    const bullets = valueAddedBullets(item);
    if (!bullets.length) return "";
    return `<ul class="card-objectives card-summary-bullets">${bullets.map(b => {
      const text = String(b).replace(/^Deliverable:\s*/i, "").trim();
      return `<li>${mdLinksToHtml(text)}</li>`;
    }).join("")}</ul>`;
  }

  function cardMetaFieldsHtml() {
    return "";
  }

  function cardSummaryHtml(item) {
    const tldr = itemTldr(item);
    return `<div class="card-summary">
      <p class="card-tldr">${projectTextToHtml(tldr)}</p>
      ${valueAddedListHtml(item)}
      ${projectKpiRefsHtml(item)}
    </div>`;
  }

  function fullDescriptionHtml(item) {
    const combined = fullDescriptionText(item);
    if (!combined) return "";
    const body = combined.includes("<a ")
      ? combined
      : marketingEducationToHtml(combined);
    return `<div class="card-description">${body}</div>`;
  }

  function cardDetailBodyHtml(item) {
    const full = fullDescriptionHtml(item);
    if (!full) return "";
    return `<div class="detail-block detail-full-description"><h4>Current Status</h4>${full}</div>`;
  }

  function descriptionHtml(item) {
    return cardSummaryHtml(item);
  }

  function marketingEducationToHtml(text) {
    if (!text) return "";
    return projectTextToHtml(String(text))
      .split(/\n\n+/)
      .map(p => `<p>${p.trim()}</p>`)
      .join("");
  }

  function progressHtml(item) {
    const done = (item.completedItems || []).map(t =>
      `<li><span class="progress-check done" aria-hidden="true">✓</span><span>${escapeHtml(t)}</span></li>`
    ).join("");
    const wip = (item.inProgressItems || []).map(t =>
      `<li><span class="progress-check open" aria-hidden="true"></span><span>${escapeHtml(t)}</span></li>`
    ).join("");
    if (!done && !wip) return "";
    return `<div class="progress-split">
      ${wip ? `<div class="progress-col progress-wip"><h4>WIP</h4><ul class="progress-list">${wip}</ul></div>` : ""}
      ${done ? `<div class="progress-col progress-completed"><h4>Completed</h4><ul class="progress-list">${done}</ul></div>` : ""}
    </div>`;
  }

  function expandBtnLabel(item, exp) {
    const hasProgress = hasPartialProgress(item);
    const hasFullDesc = !!fullDescriptionText(item);
    if (hasFullDesc) return exp ? "Hide current status" : "Current Status";
    if (hasProgress) return exp ? "Hide details" : "Show details";
    return exp ? "Hide scope" : "Show scope";
  }

  function cardFeaturedImageHtml(item) {
    const src = item.featuredImage && String(item.featuredImage).trim();
    if (!src) return "";
    return `<img class="card-featured-image" src="${escapeHtml(src)}" alt="" loading="lazy">`;
  }

  function cardReferenceLinkHtml() {
    return "";
  }

  function cardCommentUiHtml(id, item) {
    const note = (state.notes[id] || "").trim();
    const abQ = item && hasAbQuestions(item);
    const answered = abQuestionAnswered(id);
    const tagLabel = abQ && !answered ? "Comment — AB-Q" : (note ? "Comment ✓" : "+ Comment");
    const tagClass = `card-comment-tag${note ? " has-note" : ""}${abQ && !answered ? " needs-ab-q" : ""}${abQ && answered ? " ab-q-answered" : ""}`;
    const placeholder = abQ
      ? "Answer for Andrew Brown (AB – Q) — required before cart…"
      : "Scope, timing, or questions…";
    return `<button type="button" class="${tagClass}" data-id="${id}" aria-expanded="false">${tagLabel}</button>
      <div class="card-comment-popover" data-id="${id}" hidden>
        <label for="comment-${id}">${abQ ? "AB – Q — reply for Andrew Brown" : "Comment for Gilded Goose"}</label>
        <textarea id="comment-${id}" class="project-note" data-id="${id}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(state.notes[id] || "")}</textarea>
        <button type="button" class="comment-popover-done" data-id="${id}">Done</button>
      </div>`;
  }

  function closeAllCommentPopovers() {
    document.querySelectorAll(".card-comment-popover, .research-comment-popover").forEach(el => {
      el.hidden = true;
    });
    document.querySelectorAll(".card-comment-tag").forEach(btn => btn.setAttribute("aria-expanded", "false"));
  }

  function toggleCommentPopover(id, root) {
    const scope = root || document;
    const pop = scope.querySelector(`.card-comment-popover[data-id="${id}"], .research-comment-popover[data-id="${id}"]`);
    const btn = scope.querySelector(`.card-comment-tag[data-id="${id}"], .research-comment-tag[data-id="${id}"]`);
    if (!pop) return;
    const willOpen = pop.hidden;
    closeAllCommentPopovers();
    if (willOpen) {
      pop.hidden = false;
      if (btn) btn.setAttribute("aria-expanded", "true");
      const ta = pop.querySelector(".project-note");
      if (ta) ta.focus();
    }
  }

  function syncCommentTag(id, root) {
    const scope = root || document;
    const note = (state.notes[id] || "").trim();
    scope.querySelectorAll(`.card-comment-tag[data-id="${id}"], .research-comment-tag[data-id="${id}"]`).forEach(btn => {
      btn.textContent = note ? "Comment ✓" : "+ Comment";
      btn.classList.toggle("has-note", !!note);
    });
  }

  function formatGilbertChatText(chat) {
    if (!Array.isArray(chat) || !chat.length) return "(none)";
    return chat.map(msg => {
      const who = msg.role === "gilbert" ? GUIDE_SHORT : "Client";
      return `${who}: ${msg.text || ""}`;
    }).join("\n");
  }

  function formatActivityEmailBody(payload) {
    const lines = [
      "Gilbert project guide — activity log",
      "",
      "Submitted: " + (payload.submittedAt || new Date().toISOString()),
      "Email: " + (payload.submitterEmail || "(not provided)"),
      "",
      "Gilbert chat:",
      formatGilbertChatText(payload.gilbertChat),
      "",
      "Per-project comments:"
    ];
    const noteEntries = Object.entries(payload.projectNotes || {});
    if (noteEntries.length) {
      noteEntries.forEach(([id, text]) => lines.push(`  ${id}: ${text}`));
    } else {
      lines.push("  (none)");
    }
    lines.push("", "Projects selected:");
    (payload.projects || []).forEach(p => lines.push(`  • ${p.id} — ${p.title} — ${p.fee}`));
    if (payload.retainer) lines.unshift("Retainer: YES — " + (payload.retainerFee || ""));
    lines.push("", "Action items (from selections):");
    lines.push(formatActionItemsText(payload.actionItems));
    lines.push("", "Next steps:");
    lines.push(payload.nextStepsText || "(none)");
    return lines.join("\n");
  }

  function emailActivityLog(payload) {
    const to = CONFIG.notifyEmail || "support@gildedgooselimited.com";
    const subject = encodeURIComponent("Gilbert picker — chat & comments — " + (payload.submitterEmail || "submission"));
    const body = encodeURIComponent(formatActivityEmailBody(payload));
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
  }

  function valueAddedBullets(item) {
    if (item.valueAdded && item.valueAdded.length)
      return item.valueAdded.filter(b => b && String(b).trim());
    const r = item.returnEstimate;
    if (!r) return [];
    const bullets = [];
    if (r.summary) bullets.push(r.summary);
    if (r.calls) {
      bullets.push(`${r.calls.min}–${r.calls.max} calls ${r.calls.period}${r.calls.note ? " — " + r.calls.note : ""}`);
    }
    if (r.consults && !r.calls) {
      bullets.push(`${r.consults.min}–${r.consults.max} consults ${r.consults.period}`);
    }
    if (r.newClients && bullets.length < 3) {
      bullets.push(`${r.newClients.min}–${r.newClients.max} new clients ${r.newClients.period}${r.newClients.note ? " — " + r.newClients.note : ""}`);
    }
    if (r.potentialFees && bullets.length < 4) {
      const pf = r.potentialFees;
      bullets.push(`${fmt(pf.min)}–${fmt(pf.max)} potential fees ${pf.period}`);
    }
    return bullets.slice(0, 4);
  }

  function categorizeValueBullet(b) {
    const bl = b.toLowerCase();
    if (/client|call|lead|intake|consult|referral|case|response|romina|speed|appointment|booking/i.test(bl)) return "client";
    if (/brand|reputation|trust|testimonial|review|social proof|credibility|community/i.test(bl)) return "brand";
    if (/ads|seo|search|campaign|display|media|cpl|conversion|marketing|google|microsoft|lsa|traffic|visibility/i.test(bl)) return "marketing";
    return "business";
  }

  function buildBusinessValue(item) {
    const bullets = valueAddedBullets(item);
    const desc = stripInlineLinks(item.description || "");
    const r = item.returnEstimate;
    let why = "";
    if (r && r.summary) why = r.summary;
    else if (desc) {
      const m = desc.match(/[^.!?]+[.!?]+/);
      why = m ? m[0].trim() : desc.slice(0, 220).trim();
    }
    if (item.enabler) {
      why += (why ? " " : "") + "This is foundation work — other marketing and call tracking depend on it being done first.";
    }
    const buckets = { client: [], brand: [], marketing: [], business: [] };
    bullets.forEach(b => {
      const clean = String(b).replace(/^Deliverable:\s*/i, "").trim();
      if (!clean) return;
      buckets[categorizeValueBullet(b)].push(clean);
    });
    if (item.backedMetric && item.backedMetric.label) {
      buckets.marketing.push(item.backedMetric.label);
    }
    Object.keys(buckets).forEach(k => {
      buckets[k] = [...new Set(buckets[k])].slice(0, 3);
    });
    return { why, ...buckets };
  }

  function mdLinksToHtml(text) {
    return projectTextToHtml(text);
  }

  function projectTextToHtml(text) {
    if (!text) return "";
    let s = String(text);
    s = s.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, _url, label) => String(label).trim());
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label) => String(label).trim());
    s = escapeHtml(s)
      .replace(/KPI\s+(#\d{2})/gi, (_m, id) =>
        `<a href="#" class="kpi-ref-link" data-kpi="${id.toLowerCase()}">${id}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s;
  }

  function isRequiredMaintenance(item, isRetainer) {
    return isRequiredProject(item, isRetainer);
  }

  function ensureRequiredMaintenance() {
    state.retainer = true;
  }

  function isInRecommendedPackage(item) {
    const pkg = PROJECT_DATA.recommendedPackage;
    if (!pkg) return false;
    if (item.isRetainer || item.id === "RETAINER") return !!pkg.retainer;
    return (pkg.projectIds || []).includes(item.id);
  }

  function applyRecommendedPackage() {
    const pkg = PROJECT_DATA.recommendedPackage;
    if (!pkg) return;
    if (pkg.retainer) {
      state.retainer = true;
      state.recommended.add("RETAINER");
    }
    (pkg.projectIds || []).forEach(id => {
      trySetProjectInCart(id, true, { silent: true });
      if (state.projects.has(id)) state.recommended.add(id);
    });
    ensureRequiredMaintenance();
  }

  function renderPackageIntro() {
    const el = document.getElementById("package-intro");
    if (el) el.textContent = "";
  }

  function sortedProjects() {
    return [...PROJECTS].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }

  function orderedProjects() {
    const sorted = sortedProjects();
    const out = [];
    const used = new Set();
    for (const p of sorted) {
      if (used.has(p.id) || p.parentId) continue;
      out.push(p);
      used.add(p.id);
      sorted.filter(c => c.parentId === p.id).forEach(c => {
        out.push(c);
        used.add(c.id);
      });
    }
    sorted.forEach(p => {
      if (!used.has(p.id)) out.push(p);
    });
    return sortByPriority(out);
  }

  function parentProject(item) {
    if (!item.parentId) return null;
    return PROJECTS.find(p => p.id === item.parentId) || null;
  }

  function relatedSubHtml(item) {
    if (!item.parentId) return "";
    const parent = parentProject(item);
    const label = parent ? parent.title : item.parentId;
    return `<span class="badge badge-related" title="Related sub-project">Related · ${escapeHtml(label)}</span>`;
  }

  function allItemsByPriority() {
    return [{ ...RETAINER, isRetainer: true }, ...PROJECTS.map(p => ({ ...p, isRetainer: false }))]
      .sort((a, b) => {
        const planDiff = (isPlanningPublish(a) ? 1 : 0) - (isPlanningPublish(b) ? 1 : 0);
        if (planDiff !== 0) return planDiff;
        return (a.priority ?? 99) - (b.priority ?? 99);
      });
  }

  function sortByPriority(items) {
    return [...items].sort((a, b) => {
      const planDiff = (isPlanningPublish(a) ? 1 : 0) - (isPlanningPublish(b) ? 1 : 0);
      if (planDiff !== 0) return planDiff;
      return (a.priority ?? 99) - (b.priority ?? 99);
    });
  }

  function tocItemFee(item) {
    if (item.isRetainer || item.id === "RETAINER") return item.fee;
    return itemSelectionCost(item);
  }

  function tocSortableItems() {
    return allItemsByPriority().filter(item => {
      if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return true;
      return !isCompletedStatus(item);
    }).filter(item => itemMatchesIconFilters(item));
  }

  function ensureClientPriorityIds(baseItems) {
    const items = baseItems || sortTocItems(tocSortableItems());
    const ids = items.map(i => i.id);
    if (!Array.isArray(state.clientPriorityIds) || !state.clientPriorityIds.length) {
      state.clientPriorityIds = ids.slice();
      return state.clientPriorityIds;
    }
    const known = new Set(state.clientPriorityIds);
    const merged = state.clientPriorityIds.filter(id => ids.includes(id));
    ids.forEach(id => {
      if (!known.has(id)) merged.push(id);
    });
    state.clientPriorityIds = merged;
    return state.clientPriorityIds;
  }

  function clientPriorityRank(item) {
    if (!state.clientPriorityIds?.length) return null;
    const idx = state.clientPriorityIds.indexOf(item.id);
    return idx >= 0 ? idx + 1 : null;
  }

  function effectivePriority(item) {
    const clientRank = clientPriorityRank(item);
    if (clientRank != null) return clientRank;
    return item.priority ?? 99;
  }

  function moveClientPriority(id, dir) {
    ensureClientPriorityIds();
    const list = state.clientPriorityIds.slice();
    const i = list.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    state.clientPriorityIds = list;
    state.tocSort = { field: "priority", dir: "asc" };
    saveState();
    renderProjectToc();
  }

  function setPriorityEdit(on) {
    state.priorityEdit = !!on;
    if (state.priorityEdit) {
      state.tocExpanded = true;
      ensureClientPriorityIds();
      state.tocSort = { field: "priority", dir: "asc" };
    }
    saveState();
    renderProjectToc();
  }

  function sortTocItems(items, priorityMap) {
    const { field, dir } = state.tocSort;
    const mult = dir === "asc" ? 1 : -1;
    const useClientOrder = state.clientPriorityIds?.length && field === "priority";
    const ranks = priorityMap || (field === "priority" && !useClientOrder
      ? buildUniqueTocPriorityMap(items)
      : null);
    return [...items].sort((a, b) => {
      /* Selected-first only for non-priority sorts so Priority ▲/▼ can fully invert. */
      if (field !== "priority" && !useClientOrder) {
        const aSel = isItemSelected(a);
        const bSel = isItemSelected(b);
        if (aSel !== bSel) return aSel ? -1 : 1;
      }
      const planDiff = (isPlanningPublish(a) ? 1 : 0) - (isPlanningPublish(b) ? 1 : 0);
      if (planDiff !== 0) return planDiff;
      if (field === "fee") {
        const diff = tocItemFee(a) - tocItemFee(b);
        return diff !== 0 ? mult * diff : mult * (effectivePriority(a) - effectivePriority(b));
      }
      if (useClientOrder) {
        const ap = effectivePriority(a);
        const bp = effectivePriority(b);
        if (ap !== bp) return mult * (ap - bp);
        return mult * (tocItemFee(a) - tocItemFee(b));
      }
      const ap = ranks?.has(a.id) ? ranks.get(a.id) : (a.priority ?? 99);
      const bp = ranks?.has(b.id) ? ranks.get(b.id) : (b.priority ?? 99);
      if (ap !== bp) return mult * (ap - bp);
      const newness = projectNewnessScore(b) - projectNewnessScore(a);
      if (newness !== 0) return newness;
      return mult * (tocItemFee(a) - tocItemFee(b));
    });
  }

  function updateTocSortUi() {
    const btn = document.getElementById("toc-sort-priority");
    const arrow = document.getElementById("sort-arrow-priority");
    if (!btn || !arrow) return;
    btn.classList.add("active");
    const dir = state.tocSort.field === "priority" ? state.tocSort.dir : "asc";
    arrow.textContent = dir === "asc" ? "▲" : "▼";
    btn.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
    btn.title = dir === "asc" ? "Priority ascending — click for descending" : "Priority descending — click for ascending";
  }

  function toggleTocSort(field) {
    if (state.tocSort.field === field) {
      state.tocSort.dir = state.tocSort.dir === "asc" ? "desc" : "asc";
    } else {
      state.tocSort.field = field;
      state.tocSort.dir = field === "priority" ? "asc" : "desc";
    }
    renderProjectToc();
  }

  function gilbertRankedPicks(limit) {
    const goal = state.goalText.trim();
    const pool = getAllItems().filter(item => {
      if (isCompletedStatus(item)) return false;
      if (item.monthlyOnly && !isItemSelected(item)) return false;
      if (item.isRetainer) return true;
      if (isPlanningPublish(item) && !isItemSelected(item)) return false;
      return !isResearchStatus(item) || isItemSelected(item);
    });

    if (goal) {
      const words = goal.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      const ranked = pool
        .map(item => {
          let score = scoreItemForGoal(item, words) * 5;
          score += Math.max(0, computeProjectScore(item)) * 0.4;
          const id = item.isRetainer ? "RETAINER" : item.id;
          if (isItemSelected(item)) score += 18;
          if (state.recommended.has(id)) score += 10;
          return { item, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit || 5)
        .map(x => x.item);
      if (ranked.length) return ranked;
    }

    const fallback = sortByPriority(pool.filter(item => {
      const id = item.isRetainer ? "RETAINER" : item.id;
      return state.recommended.has(id) || isItemSelected(item);
    }));
    return fallback.slice(0, limit || 5);
  }

  function renderCondensedToc() {
    /* Gilbert's picks live only in Recommended Priority Projects (do-next-panel). */
    const el = document.getElementById("toc-condensed");
    if (el) {
      el.hidden = true;
      el.innerHTML = "";
    }
    renderDoNextPanel();
  }

  function renderProjectToc() {
    const listEl = document.getElementById("toc-list");
    const statusEl = document.getElementById("table-filter-status");
    const hintEl = document.getElementById("toc-summary-hint");
    const expandEl = document.getElementById("toc-expand-row");
    if (!listEl) return;
    const baseItems = tocSortableItems();
    const useClientRanks = !!(state.clientPriorityIds?.length);
    const priorityMap = useClientRanks ? null : buildUniqueTocPriorityMap(baseItems);
    const items = sortTocItems(baseItems, priorityMap);
    if (state.priorityEdit) ensureClientPriorityIds(items);
    const visibleItems = state.tocExpanded || state.priorityEdit ? items : items.slice(0, 5);
    const usedPriorities = new Set();
    listEl.innerHTML = visibleItems.map((item, rowIdx) => {
      const selected = isItemSelected(item);
      const inPkg = isInRecommendedPackage(item);
      const blurb = briefValueAdd(item);
      const isRetainer = !!item.isRetainer || item.id === "RETAINER";
      const required = isRequiredMaintenance(item, isRetainer);
      const chkDisabled = required ? " disabled" : "";
      const abPending = hasAbQuestions(item) && !abQuestionAnswered(item.id);
      const abTitle = abPending ? ' title="AB – Q: answer in Comment before cart"' : "";
      const chkClass = isRetainer ? "toc-proj-chk" : "proj-chk toc-proj-chk";
      const displayPriority = useClientRanks
        ? (clientPriorityRank(item) || rowIdx + 1)
        : uniqueTocPriority(item, usedPriorities, priorityMap);
      const editControls = state.priorityEdit
        ? `<span class="toc-prio-edit">
            <button type="button" class="toc-prio-btn" data-prio-move="up" data-id="${escapeHtml(item.id)}" title="Move up" aria-label="Move ${escapeHtml(item.title)} up">↑</button>
            <button type="button" class="toc-prio-btn" data-prio-move="down" data-id="${escapeHtml(item.id)}" title="Move down" aria-label="Move ${escapeHtml(item.title)} down">↓</button>
          </span>`
        : "";
      return `<tr class="toc-item${selected ? " row-selected" : ""}${inPkg ? " row-package" : ""}${isPlanningPublish(item) ? " toc-planning" : ""}${state.priorityEdit ? " toc-prio-editing" : ""}" data-id="${item.id}" data-retainer="${isRetainer}" data-required="${required}">
        <td class="toc-col-select">
          <input type="checkbox" class="${chkClass}" data-id="${escapeHtml(item.id)}" aria-label="Add ${escapeHtml(item.title)} to plan"${chkDisabled}${abTitle} ${selected ? "checked" : ""}>
        </td>
        <td class="toc-col-priority"><span class="toc-priority">${editControls}${priorityTocHtml(item, displayPriority)}</span></td>
        <td class="toc-col-project toc-title"><a href="#project-${item.id}">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a></td>
        <td class="toc-col-blurb toc-blurb">${escapeHtml(blurb)}</td>
        <td class="toc-col-icons toc-value">${valueIconsHtml(item)}</td>
      </tr>`;
    }).join("");
    const editBtn = document.getElementById("toc-priority-edit");
    if (editBtn) {
      editBtn.textContent = state.priorityEdit ? "Done" : "Edit";
      editBtn.setAttribute("aria-pressed", state.priorityEdit ? "true" : "false");
      editBtn.title = state.priorityEdit
        ? "Finish reordering priorities"
        : "Reorder projects for your preferred priority";
    }
    document.getElementById("project-toc")?.classList.toggle("priority-editing", state.priorityEdit);
    if (hintEl) {
      const selCount = items.filter(i => isItemSelected(i)).length;
      const countLabel = state.tocExpanded || state.priorityEdit || items.length <= 5
        ? `${items.length} projects`
        : `Top 5 of ${items.length} projects`;
      hintEl.textContent = state.priorityEdit
        ? "Use ↑ ↓ to set your priority order, then Done"
        : (selCount ? `${countLabel} · ${selCount} selected` : countLabel);
    }
    if (statusEl) {
      const total = allItemsByPriority().length;
      const shown = items.length;
      statusEl.textContent = state.iconFilters.length && shown !== total
        ? `Showing ${shown} of ${total} projects (icon filter)`
        : (state.priorityEdit ? "Editing client priority order — saved with your submission." : "");
    }
    if (expandEl) {
      if (items.length > 5 && !state.priorityEdit) {
        expandEl.hidden = false;
        expandEl.innerHTML = state.tocExpanded
          ? `<button type="button" class="btn btn-secondary btn-sm toc-expand-btn" data-expand="top">Show top 5 only</button>`
          : `<button type="button" class="btn btn-secondary btn-sm toc-expand-btn" data-expand="all">Show all ${items.length} projects</button>`;
      } else {
        expandEl.hidden = true;
        expandEl.innerHTML = "";
      }
    }
    updateTocSortUi();
  }

  function getFilters() {
    return state.filters || {};
  }

  function itemPassesCostPriorityFilter() {
    return true;
  }

  function filtersActive() {
    return !!state.goalText.trim();
  }

  function feeLabelFor(item) {
    if (item.ongoingFee) return `${fmt(item.fee)} + ${fmt(item.ongoingFee)}`;
    if (item.perCampaignFee) return `${fmt(item.fee)} per campaign`;
    return fmt(item.fee);
  }

  function itemSelectionCost(item) {
    if (item.monthlyOnly) return item.fee;
    return item.fee + (item.ongoingFee || 0);
  }

  function getSelectionCost() {
    let cost = requiredMaintenanceMonthly();
    getSelectedProjects().forEach(p => { cost += itemSelectionCost(p); });
    return cost;
  }

  function itemCouldHelpPlan(item, budget) {
    return budget == null || itemSelectionCost(item) <= budget;
  }

  function getItemFilterClasses(item, isRetainer) {
    const classes = [];
    const id = isRetainer ? "RETAINER" : item.id;
    const selected = isRetainer ? state.retainer : state.projects.has(id);
    if (!itemMatchesIconFilters(item) && !selected) classes.push("filtered-out");
    if (state.recommended.has(id)) classes.push("recommended");
    return classes.join(" ");
  }

  function scoreItemForGoal(item, words) {
    const kw = item.keywords || [];
    const text = (item.title + " " + item.description + " " + (item.valueAdd || "") + " " + (item.valueAdded || []).join(" ") + " " + item.category).toLowerCase();
    let score = 0;
    words.forEach(w => {
      if (w.length < 3) return;
      if (text.includes(w)) score += 2;
      if (kw.some(k => k.includes(w) || w.includes(k))) score += 4;
    });
    return score;
  }

  function suggestPlan(silent) {
    const goal = document.getElementById("goal-input").value.trim();
    state.goalText = goal;
    state.recommended = new Set();
    ensureRequiredMaintenance();
    state.recommended.add("RETAINER");
    let added = 0;

    if (goal) {
      const words = goal.toLowerCase().split(/\W+/).filter(Boolean);
      const scored = getAllItems().map(item => ({
        item, score: scoreItemForGoal(item, words), isRetainer: item.isRetainer
      })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      scored.slice(0, 6).forEach(({ item, isRetainer }) => {
        if (isRetainer || item.monthlyOnly) return;
        if (!itemPassesCostPriorityFilter({ ...item, isRetainer: false })) return;
        if (!state.projects.has(item.id) && trySetProjectInCart(item.id, true, { silent: true })) added += 1;
        else if (state.projects.has(item.id)) state.recommended.add(item.id);
      });

      if (!scored.length && !silent) showToast("No strong matches — try different keywords", true);
      else if (added > 0 && !silent) {
        showToast(`Added ${added} project${added === 1 ? "" : "s"} to your cart`);
      }
    } else {
      const pkg = PROJECT_DATA.recommendedPackage;
      (pkg?.projectIds || []).forEach(id => {
        const p = PROJECTS.find(x => x.id === id);
        if (p && itemPassesCostPriorityFilter({ ...p, isRetainer: false })) {
          trySetProjectInCart(id, true, { silent: true });
          if (state.projects.has(id)) state.recommended.add(id);
        }
      });
    }

    saveState();
    renderAllCards();
    renderSummary();
  }

  let suggestTimer;
  function scheduleSuggestPlan() {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => suggestPlan(true), 350);
  }

  function clearFilters() {
    document.getElementById("goal-input").value = "";
    state.goalText = "";
    state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
    state.iconFilters = [];
    state.projects = new Set();
    state.recommended = new Set();
    state.doNextVisible = false;
    ensureRequiredMaintenance();
    renderGilbertChat();
    renderValueIconKey();
    suggestPlan(true);
  }

  function renderFilterStatus() {
    /* status shown via search suggestions + invoice summary */
  }

  function loadState() {
    try {
      const raw = localStorage.getItem("pav-project-picker");
      if (!raw) {
        applyRecommendedPackage();
        ensureRequiredMaintenance();
        return;
      }
      const saved = JSON.parse(raw);
      state.retainer = !!saved.retainer;
      state.projects = new Set(saved.projects || []);
      state.notes = saved.notes || {};
      sanitizeCartForAbQ();
      state.submitterEmail = saved.submitterEmail || "";
      if (state.submitterEmail) document.getElementById("submitted-email").value = state.submitterEmail;
      if (saved.invoicePaymentMonths != null) {
        state.invoicePaymentMonths = saved.invoicePaymentMonths;
        const monthsEl = document.getElementById("invoice-payment-months");
        if (monthsEl) monthsEl.value = saved.invoicePaymentMonths;
      }
      updateInvoiceScheduleAmount();
      if (saved.goalText) {
        document.getElementById("goal-input").value = saved.goalText;
        state.goalText = saved.goalText;
      }
      if (Array.isArray(saved.gilbertChat) && saved.gilbertChat.length) {
        state.gilbertChat = saved.gilbertChat;
      }
      if (Array.isArray(saved.iconFilters)) {
        state.iconFilters = saved.iconFilters;
      }
      if (saved.doNextVisible != null) {
        state.doNextVisible = !!saved.doNextVisible;
      } else if (Array.isArray(saved.gilbertChat) && saved.gilbertChat.some(m => m.role === "user")) {
        state.doNextVisible = true;
      }
      if (Array.isArray(saved.clientPriorityIds)) {
        state.clientPriorityIds = saved.clientPriorityIds.filter(Boolean);
      }
      if (saved.expanded) state.expanded = new Set(saved.expanded);
      if (saved.expandAll) allProjectIds().forEach(id => state.expanded.add(id));
    } catch (e) {}
    ensureRequiredMaintenance();
  }

  function saveState() {
    ensureRequiredMaintenance();
    state.submitterEmail = document.getElementById("submitted-email").value;
    syncPaymentTermsFromDom();
    localStorage.setItem("pav-project-picker", JSON.stringify({
      retainer: state.retainer,
      projects: [...state.projects],
      expanded: [...state.expanded],
      expandAll: isExpandAll(),
      notes: state.notes,
      submitterEmail: state.submitterEmail,
      invoicePaymentMonths: state.invoicePaymentMonths,
      invoicePaymentMonthlyAmount: state.invoicePaymentMonthlyAmount,
      goalText: state.goalText,
      gilbertChat: state.gilbertChat,
      iconFilters: state.iconFilters,
      doNextVisible: state.doNextVisible,
      clientPriorityIds: state.clientPriorityIds
    }));
    updateSubmitButtons();
  }

  function fmt(n) { return "$" + n.toLocaleString(); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function hasAnyNotes() {
    return Object.values(state.notes).some(n => n && String(n).trim());
  }

  function hasGilbertActivity() {
    return state.gilbertChat.some(m => m.role === "user" && String(m.text || "").trim());
  }

  function getNotesPayload() {
    const notes = {};
    Object.entries(state.notes).forEach(([id, text]) => {
      if (text && String(text).trim()) notes[id] = String(text).trim();
    });
    return notes;
  }

  function allProjectIds() {
    const ids = ["RETAINER"];
    getMaintenanceProjects().forEach(p => ids.push(p.id));
    orderedProjects().filter(p => !p.monthlyOnly).forEach(p => ids.push(p.id));
    return ids;
  }

  function isExpandAll() {
    const ids = allProjectIds();
    return ids.length > 0 && ids.every(id => state.expanded.has(id));
  }

  function syncExpandAllCheckbox() {
    const chk = document.getElementById("expand-all-projects");
    if (!chk) return;
    const on = isExpandAll();
    chk.checked = on;
    chk.setAttribute("aria-checked", on ? "true" : "false");
  }

  function setExpandAll(open) {
    if (open) allProjectIds().forEach(id => state.expanded.add(id));
    else state.expanded.clear();
    saveState();
    renderAllCards();
  }

  function publishStatusBadgeHtml(item) {
    if (!isPlanningPublish(item)) return "";
    return `<span class="publish-status-badge" title="Project plan in progress — shown for visibility, not yet published">Planning</span>`;
  }

  function cardHtml(item, isRetainer, isFirstSelected) {
    const id = item.id;
    const required = isRequiredMaintenance(item, isRetainer);
    const sel = isRetainer ? state.retainer : state.projects.has(id);
    const exp = state.expanded.has(id);
    const extra = getItemFilterClasses(item, isRetainer);
    const pkgClass = isInRecommendedPackage({ ...item, isRetainer }) ? " package-included" : "";
    const iconMarkup = cardCornerIconsHtml(item, isRetainer);
    const iconsHtml = iconMarkup || "";
    const retainerClass = isRetainer ? " retainer-card required-retainer" : "";
    const maintClass = item.monthlyOnly ? ` maintenance-card${required ? " required-maintenance" : ""}` : "";
    const subClass = item.parentId ? " card-sub-related" : "";
    const selFirst = isFirstSelected ? " selected-first" : "";
    const chkDisabled = required ? " disabled" : "";
    const mutedClass = isPlanningPublish(item) || isResearchStatus(item) || isCompletedStatus(item) ? " status-muted" : "";
    const planningClass = isPlanningPublish(item) ? " publish-planning" : "";
    const abPending = hasAbQuestions(item) && !abQuestionAnswered(id);
    const abClass = abPending ? " ab-q-pending" : (hasAbQuestions(item) ? " ab-q-cleared" : "");

    return `
      <div class="card${retainerClass}${maintClass}${subClass}${pkgClass}${selFirst}${mutedClass}${planningClass}${abClass} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}" data-ab-q="${hasAbQuestions(item) ? "1" : "0"}" data-publish="${normalizePublishStatus(item)}">
        ${cardCommentUiHtml(id, item)}
        <div class="card-header">
          ${cardCheckColHtml(item, isRetainer, required, sel, chkDisabled, abPending)}
            <div class="card-body">
              ${cardFeaturedImageHtml(item)}
              ${cardReferenceLinkHtml(item)}
              <div class="card-top-row">
                <div class="card-title"><span>${escapeHtml(item.title)}</span>${publishStatusBadgeHtml(item)}</div>
                ${iconsHtml}
              </div>
              ${relatedSubHtml(item) ? `<div class="card-meta-row">${relatedSubHtml(item)}</div>` : ""}
              ${abQuestionsBannerHtml(item)}
              ${descriptionHtml(item)}
            <button type="button" class="expand-btn">${expandBtnLabel(item, exp)}</button>
          </div>
        </div>
        <div class="card-detail">
          ${progressHtml(item)}
          ${campaignMetricsHtml(item)}
          ${cardDetailBodyHtml(item)}
        </div>
      </div>`;
  }

  function renderAllCards() {
    renderViewLayout();
    const list = document.getElementById("project-list");
    if (!list || state.activeViewTab !== "picker") {
      if (state.activeViewTab === "impact") {
        renderCompletedList();
        renderRevenueCalculator();
      }
      return;
    }
    const maintenance = sortCartFirst(getMaintenanceProjects());
    const optional = sortCartFirst(activeOptionalProjects());
    const visible = visibleOptionalProjects(optional);
    const hidden = hiddenOptionalCount(optional);
    let markedFirst = false;
    const projectCards = visible.map(p => {
      const sel = state.projects.has(p.id);
      const isFirst = sel && !markedFirst;
      if (isFirst) markedFirst = true;
      return cardHtml(p, false, isFirst);
    }).join("");
    const maintCards = maintenance.map(p => cardHtml(p, false, false)).join("");
    const showMoreBtn = hidden > 0
      ? `<div class="project-list-show-more"><button type="button" class="btn btn-secondary" id="show-more-projects">Show ${hidden} more project${hidden === 1 ? "" : "s"}</button></div>`
      : state.showAllProjects && optional.length > PROJECT_LIST_LIMIT
        ? `<div class="project-list-show-more"><button type="button" class="btn btn-secondary" id="show-more-projects">Show fewer</button></div>`
        : "";
    list.innerHTML = cardHtml(RETAINER, true, true) + maintCards + projectCards + showMoreBtn;
    syncExpandAllCheckbox();
    attachProjectListListeners(list);
    attachProjectListListeners(document.getElementById("research-section-wrap"));
  }

  function attachProjectListListeners(root) {
    if (!root) return;
    const showMoreEl = root.querySelector("#show-more-projects") || document.getElementById("show-more-projects");
    if (showMoreEl && !showMoreEl.dataset.bound) {
      showMoreEl.dataset.bound = "1";
      showMoreEl.addEventListener("click", e => {
        e.preventDefault();
        state.showAllProjects = !state.showAllProjects;
        renderAllCards();
      });
    }

    root.querySelectorAll(".project-note").forEach(ta => {
      if (ta.dataset.noteBound) return;
      ta.dataset.noteBound = "1";
      ta.addEventListener("click", e => e.stopPropagation());
      ta.addEventListener("input", e => {
        const pid = ta.dataset.id;
        state.notes[pid] = e.target.value;
        const item = findProjectById(pid);
        if (item && hasAbQuestions(item) && !abQuestionAnswered(pid) && state.projects.has(pid)) {
          state.projects.delete(pid);
          showToast("Removed from cart — AB – Q needs an answer in Comment", true);
        }
        syncCommentTag(pid, root);
        saveState();
        updateSubmitButtons();
        renderAllCards();
        renderSummary();
      });
    });

    root.querySelectorAll(".card-comment-tag, .research-comment-tag").forEach(btn => {
      if (btn.dataset.commentBound) return;
      btn.dataset.commentBound = "1";
      btn.addEventListener("click", e => {
        e.stopPropagation();
        toggleCommentPopover(btn.dataset.id, root);
      });
    });

    root.querySelectorAll(".comment-popover-done").forEach(btn => {
      if (btn.dataset.doneBound) return;
      btn.dataset.doneBound = "1";
      btn.addEventListener("click", e => {
        e.stopPropagation();
        closeAllCommentPopovers();
      });
    });

    root.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      if (chk.dataset.chkBound) return;
      chk.dataset.chkBound = "1";
      chk.addEventListener("change", e => {
        e.stopPropagation();
        const id = chk.dataset.id;
        const card = chk.closest(".card");
        if (card && card.dataset.required === "true") return;
        const wantAdd = chk.checked;
        if (!trySetProjectInCart(id, wantAdd)) {
          chk.checked = !wantAdd;
          return;
        }
        saveState();
        renderAllCards();
        renderSummary();
      });
    });

    root.querySelectorAll(".card").forEach(card => {
      if (card.dataset.cardBound) return;
      card.dataset.cardBound = "1";
      card.addEventListener("click", e => {
        if (e.target.type === "checkbox" || e.target.classList.contains("expand-btn") || e.target.closest("a") || e.target.closest(".required-icon") || e.target.closest(".card-comment-tag") || e.target.closest(".card-comment-popover") || e.target.closest(".research-comment-tag") || e.target.closest(".research-comment-popover")) return;
        if (card.classList.contains("over-budget")) return;
        const id = card.dataset.id;
        if (card.dataset.required === "true") return;
        const isRetainer = card.dataset.retainer === "true";
        if (isRetainer) {
          if (state.retainer) state.retainer = false;
          else state.retainer = true;
        } else if (state.projects.has(id)) {
          trySetProjectInCart(id, false);
        } else if (!trySetProjectInCart(id, true)) {
          return;
        }
        saveState();
        renderAllCards();
        renderSummary();
      });
      const expandBtn = card.querySelector(".expand-btn");
      if (expandBtn) {
        expandBtn.addEventListener("click", e => {
          e.stopPropagation();
          const id = card.dataset.id;
          if (state.expanded.has(id)) state.expanded.delete(id);
          else state.expanded.add(id);
          saveState();
          renderAllCards();
        });
      }
    });
  }

  function getSelectedProjects() {
    return PROJECTS.filter(p => state.projects.has(p.id) && !p.monthlyOnly);
  }

  function hasSelection() {
    return true;
  }

  function canContinue() {
    return getInvoiceLineItems().length > 0 || hasAnyNotes() || hasGilbertActivity();
  }

  function canSubmit() {
    const email = (document.getElementById("submitted-email") || {}).value || "";
    if (!email.trim()) return false;
    return getInvoiceLineItems().length > 0 || hasAnyNotes() || hasGilbertActivity();
  }

  function updateWebhookWarning() {
    const el = document.getElementById("webhook-warning");
    if (!el) return;
    const cfg = getConfig();
    if (cfg.webhookUrl) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML = "Live webhook not configured yet — submit still works: your selections download as JSON and are saved in this browser. For automatic email + Sheet logging, add GitHub Secret <strong>PAV_PICKER_WEBHOOK_URL</strong> and redeploy.";
  }

  function updateSubmitButtons() {
    CONFIG = getConfig();
    const cont = document.getElementById("continue-to-confirm");
    if (cont) cont.disabled = !canContinue();
    const submit = document.getElementById("submit-selections");
    if (submit) {
      submit.disabled = !canSubmit();
      submit.title = "";
    }
    updateWebhookWarning();
  }

  function showConfirmPage() {
    if (!canContinue()) return;
    const guideImg = document.getElementById("confirm-gilbert");
    if (guideImg) guideImg.src = GILBERT_ICON;
    renderConfirmPlanReview();
    document.getElementById("confirm-page").classList.add("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "false");
    closeGilbertChat();
    document.querySelector(".pav-guide-ask-section")?.setAttribute("hidden", "");
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    document.getElementById("submitted-email")?.focus();
  }

  function hideConfirmPage() {
    document.getElementById("confirm-page").classList.remove("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "true");
    document.querySelector(".pav-guide-ask-section")?.removeAttribute("hidden");
  }

  function buildPayload() {
    const selected = getSelectedProjects();
    const maintenance = getMaintenanceProjects().filter(p => state.projects.has(p.id));
    const projectTotal = selected.reduce((s, p) => s + itemSelectionCost(p), 0);
    const maintMonthly = requiredMaintenanceMonthly();
    const submitterEmail = (document.getElementById("submitted-email") || {}).value || "";
    const paymentTerms = getPaymentTermsPayload();
    const maintRows = maintenance.map(p => ({
      id: p.id,
      title: p.title,
      fee: feeLabelFor(p),
      feeNum: p.fee,
      timeline: p.timeline || "",
      priority: p.priority ?? null,
      clientPriority: clientPriorityRank(p),
      parentId: p.parentId || null,
      monthlyOnly: true,
      paymentType: getPaymentType(p, false)
    }));
    const projectRows = selected.map(p => ({
      id: p.id,
      title: p.title,
      fee: feeLabelFor(p),
      feeNum: itemSelectionCost(p),
      timeline: p.timeline || "",
      priority: p.priority ?? null,
      clientPriority: clientPriorityRank(p),
      parentId: p.parentId || null,
      paymentType: getPaymentType(p, false)
    }));
    return {
      submittedAt: new Date().toISOString(),
      submittedBy: "",
      submitterEmail: submitterEmail.trim(),
      invoicePaymentTerms: paymentTerms.label || "",
      invoicePaymentTermsLabel: paymentTerms.label,
      invoicePaymentMonths: paymentTerms.months,
      invoicePaymentMonthlyAmount: paymentTerms.monthlyAmount,
      invoicePaymentMonthlyAmountFormatted: paymentTerms.monthlyAmount != null ? fmt(paymentTerms.monthlyAmount) : null,
      invoicePaymentTotalFormatted: paymentTerms.months && paymentTerms.monthlyAmount != null
        ? fmt(paymentTerms.months * paymentTerms.monthlyAmount)
        : null,
      goalText: document.getElementById("goal-input").value.trim(),
      filterConsultingBudget: null,
      filterMediaBudget: null,
      retainer: state.retainer,
      retainerFee: state.retainer ? fmt(RETAINER.fee) : null,
      retainerTitle: state.retainer ? RETAINER.title : null,
      retainerPaymentType: state.retainer ? getPaymentType(RETAINER, true) : null,
      maintenanceMonthly: fmt(maintMonthly),
      maintenanceMonthlyNum: maintMonthly,
      depositAmount: CONFIG.depositAmount || null,
      quickbooksDepositUrl: CONFIG.quickbooksDepositUrl || null,
      projects: [...maintRows, ...projectRows],
      projectsSubtotal: fmt(projectTotal),
      projectsSubtotalNum: projectTotal,
      grandTotalNote: fmt(getSelectionCost()),
      gilbertChat: state.gilbertChat.slice(),
      clientPriorityOrder: (state.clientPriorityIds || []).map((id, i) => {
        const item = findProjectById(id) || PROJECTS.find(p => p.id === id) || (id === "RETAINER" ? RETAINER : null);
        return { id, rank: i + 1, title: item?.title || id };
      }),
      projectNotes: getNotesPayload(),
      actionItems: buildActionItems(),
      nextStepsText: formatNextStepsText()
    };
  }

  function getReturnSignals(item) {
    const signals = [];
    valueAddedBullets(item).forEach(b => {
      const clean = String(b).replace(/^Deliverable:\s*/i, "").trim();
      if (/call|client|consult|referral|fee|revenue|save|waste|cpl|\$|lead|case|intake|month|roi|return/i.test(clean)) {
        signals.push(clean);
      }
    });
    if (item.backedMetric && item.backedMetric.label) signals.push(item.backedMetric.label);
    return [...new Set(signals)].slice(0, 2);
  }

  function buildThankYouAffirmation(payload, selected) {
    const count = selected.length + (payload.retainer ? 1 : 0);
    const hasFoundation = selected.some(p => p.enabler);
    const hasLeads = selected.some(p => /paid media|search|display|referral|seo/i.test((p.category || "") + (p.campaignType || "")));
    const parts = [];
    parts.push(`You selected ${count} investment${count === 1 ? "" : "s"} that directly support measurable growth — leads, intake, and marketing you can track.`);
    if (hasFoundation) {
      parts.push("Starting with foundation work means every ad dollar and referral can be tracked, answered, and improved — not wasted on broken intake or blind spend.");
    }
    if (hasLeads) {
      parts.push("The marketing pieces you chose focus on measurable leads and consults, not vanity metrics.");
    }
    if (payload.goalText) {
      const g = payload.goalText.trim();
      parts.push(`This package aligns with your stated goal: "${g.length > 120 ? g.slice(0, 120) + "…" : g}"`);
    }
    parts.push("Gilded Goose will execute with clear deliverables, monthly visibility, and a team that already knows your account.");
    return parts.join(" ");
  }

  function buildThankYouReturnsHtml(selected, includeRetainer) {
    const items = [];
    if (includeRetainer) items.push(RETAINER);
    sortByPriority(selected).forEach(p => items.push(p));
    const rows = items.map(item => {
      const signals = getReturnSignals(item);
      if (!signals.length) return "";
      return `<div class="thank-you-roi-item"><strong>${escapeHtml(item.title)}</strong>${signals.map(s => escapeHtml(s)).join(" · ")}</div>`;
    }).filter(Boolean);
    let summary = "";
    const allSignals = items.flatMap(getReturnSignals);
    const hasCalls = allSignals.some(s => /call/i.test(s));
    const hasFees = allSignals.some(s => /\$|fee|revenue/i.test(s));
    if (hasCalls && hasFees) {
      summary = "Combined, these activities target lower cost per call, more qualified consults, and revenue you can tie back to marketing — not guesswork.";
    } else if (hasCalls) {
      summary = "Combined, these activities focus on more qualified calls and consults from the marketing you're already running.";
    } else if (rows.length) {
      summary = "These projects stack: stronger infrastructure, clearer reporting, and marketing that compounds month over month.";
    } else {
      summary = "Your selections prioritize measurable business outcomes — better intake, clearer data, and marketing that supports signed cases.";
    }
    if (!rows.length) {
      return `<div class="thank-you-roi-box"><h3>Estimated return on these activities</h3><p class="thank-you-roi-summary">${summary}</p></div>`;
    }
    return `<div class="thank-you-roi-box"><h3>Estimated return on these activities</h3>${rows.join("")}<p class="thank-you-roi-summary">${summary}</p></div>`;
  }

  function renderGilbertChat() {
    const el = document.getElementById("gilbert-chat-messages");
    if (!el) return;
    if (!state.gilbertChat.length) {
      state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
    }
    el.innerHTML = state.gilbertChat.map(msg => {
      const who = msg.role === "gilbert" ? GUIDE_SHORT : "You";
      return `<div class="gilbert-chat-msg gilbert-chat-${msg.role}"><span class="gilbert-chat-who">${escapeHtml(who)}</span><p>${escapeHtml(msg.text)}</p></div>`;
    }).join("");
    el.scrollTop = el.scrollHeight;
  }

  function userCursedGilbert(text) {
    return /\b(fuck|shit|damn|asshole|bitch|bastard|cunt|dick|wtf)\b/i.test(text || "");
  }

  function userThankedGilbert(text) {
    return /\b(thanks|thank you|thank\s*u|tysm|thx|appreciate)\b/i.test(text || "");
  }

  function launchConfetti(count) {
    const n = count || 90;
    let layer = document.getElementById("confetti-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "confetti-layer";
      layer.className = "confetti-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
    }
    const colors = ["#7c3aed", "#b8860b", "#ffd700", "#4e2a84", "#f8f5ef", "#c4b5fd"];
    for (let i = 0; i < n; i++) {
      const piece = document.createElement("span");
      const glitter = Math.random() > 0.45;
      piece.className = "confetti-piece" + (glitter ? " glitter" : "");
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (1.1 + Math.random() * 1.9) + "s";
      piece.style.animationDelay = Math.random() * 0.35 + "s";
      layer.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  function pickGilbertReply(userText) {
    const text = (userText || "").trim();
    const items = getInvoiceLineItems();
    const count = items.length;
    if (userCursedGilbert(text)) {
      return "Well fuck you too, Sparky. Now — what's actually broken in the business so we can fix it?";
    }
    if (userThankedGilbert(text)) {
      return "Anytime Sparklefarts!";
    }
    if (!text) {
      return "Tell me what's not working — leads, intake, ads, website, or CRM. We'll map projects to fix it.";
    }
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const scored = getAllItems()
      .filter(item => !item.isRetainer && item.id !== "RETAINER")
      .map(item => ({ item, score: scoreItemForGoal(item, words) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);
    if (scored.length) {
      const picks = scored.slice(0, 3).map(s => s.item.title);
      const list = picks.length === 1 ? picks[0] : picks.slice(0, -1).join(", ") + " and " + picks[picks.length - 1];
      const abBlocked = scored.filter(s => hasAbQuestions(s.item) && !abQuestionAnswered(s.item.id));
      if (abBlocked.length) {
        const names = abBlocked.slice(0, 2).map(s => s.item.title).join(", ");
        return `I'd look at ${list} — but ${names} ${abBlocked.length === 1 ? "has" : "have"} AB – Q for Andrew. Answer in Comment on ${abBlocked.length === 1 ? "that card" : "those cards"} before cart.`;
      }
      if (count > 0) {
        return `Understood. I'd prioritize ${list} — ${count} item${count === 1 ? "" : "s"} in your cart so far. Add more detail or pick from the list below.`;
      }
      return `I hear you. I'd start with ${list} — I'm matching those to your cart. What else should we fix?`;
    }
    if (count > 0) {
      return `${count} project${count === 1 ? "" : "s"} in your cart. Tell me more about the problem and I'll refine the mix.`;
    }
    return "Got it. Browse the project list below, or tell me more — wasted ad spend, broken forms, slow intake — and I'll suggest matches.";
  }

  function sendGilbertMessage() {
    const input = document.getElementById("goal-input");
    const text = (input?.value || "").trim();
    if (!text) return;
    state.goalText = text;
    if (input) input.value = "";
    state.gilbertChat.push({ role: "user", text });
    state.gilbertChat.push({ role: "gilbert", text: pickGilbertReply(text) });
    if (userThankedGilbert(text)) launchConfetti();
    if (!userThankedGilbert(text) && !userCursedGilbert(text)) state.doNextVisible = true;
    renderGilbertChat();
    saveState();
    suggestPlan(true);
    renderCondensedToc();
    renderDoNextPanel();
    renderPlanSummary();
    renderProjectToc();
  }

  function openGilbertChat() {
    const backdrop = document.getElementById("gilbert-chat-backdrop");
    if (backdrop) backdrop.hidden = true;
    renderGilbertChat();
    renderDoNextPanel();
    document.getElementById("goal-input")?.focus();
  }

  function closeGilbertChat() {
    const backdrop = document.getElementById("gilbert-chat-backdrop");
    if (backdrop) backdrop.hidden = true;
  }

  function initGilbertGuide() {
    const heroSrc = (GILBERT_HERO || "assets/gilbert-thinking.png") +
      ((GILBERT_HERO || "").includes("?") ? "" : "?v=20260714h");
    const img = document.getElementById("gilbert-launcher-img");
    if (img) {
      img.src = heroSrc;
      img.alt = `${GUIDE_NAME} — ask a question`;
    }
    if (!state.gilbertChat.length) {
      state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
      if (state.goalText.trim()) {
        state.gilbertChat.push({ role: "user", text: state.goalText.trim() });
        state.gilbertChat.push({ role: "gilbert", text: pickGilbertReply(state.goalText) });
      }
    }
    renderGilbertChat();
    renderDoNextPanel();
    try {
      const qs = new URLSearchParams(location.search || "");
      if (qs.get("gilbert") === "1" || location.hash === "#gilbert") {
        setTimeout(() => openGilbertChat(), 0);
      }
    } catch (_) { /* ignore */ }
  }

  function showThankYou(payload) {
    const selected = getSelectedProjects();
    const depositAmt = CONFIG.depositAmount;
    const depositUrl = CONFIG.quickbooksDepositUrl || payload.quickbooksDepositUrl;

    document.getElementById("thank-you-gilbert").src = GILBERT_SEAL;
    document.getElementById("thank-you-sub").textContent =
      "Your selections build a stronger marketing stack — Gilded Goose will execute with clear deliverables.";

    const lines = [];
    if (payload.retainer) lines.push(`<li><strong>${escapeHtml(RETAINER.title)}</strong> — ${fmt(RETAINER.fee)}</li>`);
    (payload.projects || []).forEach(p => lines.push(`<li><strong>${escapeHtml(p.title)}</strong> — ${p.fee}</li>`));
    if (!lines.length) lines.push("<li><em>Notes submitted — Gilded Goose will follow up</em></li>");

    const itemCount = lines.length;
    const totalLine = payload.grandTotalNote || "—";
    const termsLine = payload.invoicePaymentTermsLabel
      ? escapeHtml(payload.invoicePaymentTermsLabel)
      : "Not specified";

    let notesHtml = "";
    const chatLines = (payload.gilbertChat || []).filter(m => m.role === "user" || (m.role === "gilbert" && payload.gilbertChat.indexOf(m) > 0));
    if (chatLines.length) {
      notesHtml += `<div class="thank-you-chat-log"><h3>Gilbert chat</h3><ul class="thank-you-list">${chatLines.map(m =>
        `<li><strong>${escapeHtml(m.role === "gilbert" ? GUIDE_SHORT : "You")}:</strong> ${escapeHtml(m.text)}</li>`
      ).join("")}</ul></div>`;
    }
    const noteEntries = Object.entries(payload.projectNotes || {});
    if (noteEntries.length) {
      notesHtml += `<div class="thank-you-comments"><h3>Your comments</h3><ul class="thank-you-list">` +
        noteEntries.map(([id, text]) => `<li><strong>${escapeHtml(id)}:</strong> ${escapeHtml(text)}</li>`).join("") + "</ul></div>";
    }

    let depositHtml = "";
    if (depositAmt && depositUrl) {
      depositHtml = `<div class="thank-you-deposit-box">
        <p>Secure your spot with the standard kickoff deposit</p>
        <p class="deposit-amount">${fmt(depositAmt)}</p>
        <p>Full invoice for selected projects follows separately. Pay now via QuickBooks:</p>
        <a class="thank-you-qb-link" href="${escapeHtml(depositUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(depositUrl)}</a>
      </div>`;
    } else if (depositAmt) {
      depositHtml = `<div class="thank-you-deposit-box"><p>Standard deposit: <span class="deposit-amount">${fmt(depositAmt)}</span> — payment link coming by email.</p></div>`;
    }

    const emailNote = payload.submitterEmail
      ? `<p class="confirm-note">Confirmation sent to <strong>${escapeHtml(payload.submitterEmail)}</strong> and Gilded Goose.</p>`
      : `<p class="confirm-note">Confirmation sent to Gilded Goose.</p>`;

    const actionItemsHtml = (payload.actionItems && payload.actionItems.length)
      ? `<div class="thank-you-action-items action-items-panel">${buildActionItemsHtml(payload.actionItems)}</div>`
      : "";
    const nextStepsHtml = payload.nextStepsText
      ? `<div class="confirm-review-block thank-you-next-steps">${buildConfirmNextStepsHtml()}</div>`
      : "";

    document.getElementById("thank-you-body").innerHTML = `
      <div class="thank-you-affirm"><strong>Why this is a strong choice</strong>${escapeHtml(buildThankYouAffirmation(payload, selected))}</div>
      ${buildThankYouReturnsHtml(selected, payload.retainer)}
      <div class="thank-you-selection">
        <h3>Your consulting estimate</h3>
        <p class="thank-you-total-single">${itemCount} item${itemCount === 1 ? "" : "s"} · <strong>${totalLine}</strong></p>
        <p class="thank-you-terms-line">Invoice schedule: <strong>${termsLine}</strong></p>
      </div>
      ${actionItemsHtml}
      ${nextStepsHtml}
      ${depositHtml}
      ${notesHtml}
      ${emailNote}`;

    const payBtn = document.getElementById("btn-pay-deposit");
    if (payBtn && depositUrl && depositAmt) {
      payBtn.href = depositUrl;
      payBtn.textContent = "Pay " + fmt(depositAmt) + " deposit — open QuickBooks";
      payBtn.style.display = "block";
    } else if (payBtn) {
      payBtn.style.display = "none";
    }

    document.getElementById("thank-you").classList.add("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "false");
    hideConfirmPage();
    document.getElementById("main-app").classList.add("hidden");
    document.querySelector(".pav-guide-ask-section")?.setAttribute("hidden", "");
    closeGilbertChat();
    window.scrollTo(0, 0);
  }

  function buildPrioritiesCartHtml() {
    const items = getInvoiceLineItems();
    const total = getSelectionCost();
    if (!items.length) {
      return `<p class="empty-state">Selections appear here as you choose projects.</p>`;
    }
    const bodyRows = items.map(row => {
      const req = row.id === "RETAINER"
        ? requiredMarkerHtml(RETAINER, true)
        : (() => { const p = PROJECTS.find(x => x.id === row.id); return p ? requiredMarkerHtml(p, false) : ""; })();
      return `<tr>
        <td class="col-project"><a href="${projectAnchor(row.id)}" class="priority-desc-link" data-project-id="${escapeHtml(row.id)}"><span class="priority-req-slot" aria-hidden="${req ? "false" : "true"}">${req || ""}</span><span class="priority-desc-title">${escapeHtml(row.title)}</span></a></td>
        <td class="col-fee">${row.fee}</td>
      </tr>`;
    }).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    return `<div class="pav-priorities-scroll"><table class="pav-priorities-table">
      <thead>
        <tr>
          <th class="col-project" scope="col">Project</th>
          <th class="col-fee" scope="col">Fee</th>
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
        <tr class="priorities-totals-row">
          <td class="col-project">${label}</td>
          <td class="col-fee">${fmt(total)}</td>
        </tr>
      </tbody>
    </table></div>`;
  }

  function buildRevenueCalculatorHtml() {
    const items = getInvoiceLineItems();
    if (!items.length) {
      return `<p class="empty-state">Add projects in Project Guide — leads impacted, connected, and estimated revenue show here.</p>`;
    }
    let sumConnected = 0;
    let hasConnectedSum = false;
    // Rev. column: placeholder until estimated-revenue numbers are validated (no computed $)
    const revenuePlaceholder = "—";
    const bodyRows = items.map(row => {
      const item = findProjectById(row.id);
      const req = row.id === "RETAINER"
        ? requiredMarkerHtml(RETAINER, true)
        : (() => { const p = PROJECTS.find(x => x.id === row.id); return p ? requiredMarkerHtml(p, false) : ""; })();
      const imp = resolveImpactEstimates(item);
      if (imp.leadsConnected.value != null) { sumConnected += imp.leadsConnected.value; hasConnectedSum = true; }
      return `<tr>
        <td class="col-project"><a href="${projectAnchor(row.id)}" class="priority-desc-link" data-project-id="${escapeHtml(row.id)}"><span class="priority-req-slot" aria-hidden="${req ? "false" : "true"}">${req || ""}</span><span class="priority-desc-title">${escapeHtml(row.title)}</span></a></td>
        <td class="col-num" title="${escapeHtml(imp.leadsImpacted.label)}">${escapeHtml(imp.leadsImpacted.label)}</td>
        <td class="col-num" title="${escapeHtml(imp.leadsConnected.label)}">${escapeHtml(imp.leadsConnected.label)}</td>
        <td class="col-num" title="Estimated revenue TBD">${revenuePlaceholder}</td>
        <td class="col-fee">${row.fee}</td>
      </tr>`;
    }).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    const connectedTotal = hasConnectedSum ? `~${Math.round(sumConnected * 10) / 10}/mo` : "—";
    return `<div class="pav-priorities-scroll"><table class="pav-priorities-table revenue-calc-table">
      <thead>
        <tr>
          <th class="col-project" scope="col">Project</th>
          <th class="col-num" scope="col" title="Leads impacted">Imp.</th>
          <th class="col-num" scope="col" title="Leads connected">Conn.</th>
          <th class="col-num" scope="col" title="Estimated revenue">Rev.</th>
          <th class="col-fee" scope="col">Fee</th>
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
        <tr class="priorities-totals-row">
          <td class="col-project">${label}</td>
          <td class="col-num">—</td>
          <td class="col-num">${connectedTotal}</td>
          <td class="col-num">${revenuePlaceholder}</td>
          <td class="col-fee">${fmt(getSelectionCost())}</td>
        </tr>
      </tbody>
    </table></div>`;
  }

  function buildTotalsHtml() {
    return buildPrioritiesCartHtml();
  }

  function hideThankYou() {
    document.getElementById("thank-you").classList.remove("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "true");
    document.getElementById("main-app").classList.remove("hidden");
    document.querySelector(".pav-guide-ask-section")?.removeAttribute("hidden");
  }

  function renderInvoiceSummary() {
    renderPlanSummary();
  }

  function renderSummary() {
    renderKpiDashboard();
    renderDoNextPanel();
    renderPlanSummary();
    if (state.activeViewTab === "impact") {
      renderCompletedList();
      renderRevenueCalculator();
    }
    renderCondensedToc();
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    renderProjectToc();
    renderViewLayout();
  }

  function downloadSubmissionJson(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pav-law-selections-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function postToWebhook(url, payload) {
    const body = JSON.stringify(payload);
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body
      });
    } catch (err) {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body
      });
      return { ok: true, noCors: true };
    }
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch (e) { /* GAS may return empty on some errors */ }
    if (res.ok && (data.ok || text.includes('"ok":true'))) return { ok: true };
    throw new Error(data.error || text.slice(0, 120) || `HTTP ${res.status}`);
  }

  function saveSubmissionLocally(payload) {
    localStorage.setItem("pav-picker-last-submission", JSON.stringify(payload));
    const pending = JSON.parse(localStorage.getItem("pav-picker-pending-submissions") || "[]");
    pending.push({ savedAt: new Date().toISOString(), payload });
    localStorage.setItem("pav-picker-pending-submissions", JSON.stringify(pending.slice(-20)));
  }

  function showToast(msg, isError) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show" + (isError ? " error" : "");
    setTimeout(() => t.classList.remove("show"), 4000);
  }

  async function submitSelections() {
    if (!canSubmit()) return;
    CONFIG = getConfig();
    const payload = buildPayload();
    const btn = document.getElementById("submit-selections");
    btn.disabled = true;
    btn.textContent = "Submitting…";
    let ok = false;

    if (!CONFIG.webhookUrl) {
      try {
        saveSubmissionLocally(payload);
        downloadSubmissionJson(payload);
        emailActivityLog(payload);
        ok = true;
      } catch (err) {
        showToast("Could not save submission — try again or email support@gildedgooselimited.com", true);
      }
    } else {
      try {
        const result = await postToWebhook(CONFIG.webhookUrl, payload);
        if (result.ok) ok = true;
      } catch (err) {
        showToast("Submit failed — try again or email support@gildedgooselimited.com. " + err.message, true);
      }
    }

    if (ok) showThankYou(payload);
    btn.textContent = "Submit selections";
    updateSubmitButtons();
  }

  document.getElementById("continue-to-confirm").addEventListener("click", showConfirmPage);
  document.getElementById("confirm-back").addEventListener("click", hideConfirmPage);
  document.getElementById("submit-selections").addEventListener("click", submitSelections);
  document.getElementById("btn-back-picker").addEventListener("click", hideThankYou);
  document.getElementById("submitted-email").addEventListener("input", () => { saveState(); updateSubmitButtons(); });
  document.getElementById("invoice-payment-months").addEventListener("change", () => {
    updateInvoiceScheduleAmount();
    saveState();
  });
  document.getElementById("goal-input")?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendGilbertMessage();
    }
  });
  document.getElementById("gilbert-chat-backdrop")?.setAttribute("hidden", "");
  document.getElementById("expand-all-projects").addEventListener("change", e => {
    e.target.setAttribute("aria-checked", e.target.checked ? "true" : "false");
    setExpandAll(e.target.checked);
  });

  document.addEventListener("click", e => {
    const goView = e.target.closest("[data-go-view]");
    if (goView) {
      e.preventDefault();
      setActiveViewTab(goView.dataset.goView || "picker");
      renderAllCards();
      renderSummary();
      const dest = state.activeViewTab;
      if (dest === "impact") {
        const sub = String(goView.dataset.goView || "").toLowerCase();
        const anchor = sub === "revenue"
          ? document.getElementById("impact-revenue")
          : sub === "completed"
            ? document.getElementById("impact-completed")
            : null;
        if (anchor) requestAnimationFrame(() => anchor.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
      return;
    }
    const kpiLink = e.target.closest(".kpi-ref-link");
    if (kpiLink) {
      e.preventDefault();
      focusKpi(kpiLink.dataset.kpi);
      return;
    }
    if (e.target.closest(".card-comment-tag") || e.target.closest(".card-comment-popover")
      || e.target.closest(".research-comment-tag") || e.target.closest(".research-comment-popover")) return;
    closeAllCommentPopovers();
  });

  document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveViewTab(btn.dataset.view || "picker");
      renderAllCards();
      renderSummary();
    });
  });

  document.getElementById("toc-expand-row")?.addEventListener("click", e => {
    const btn = e.target.closest(".toc-expand-btn");
    if (!btn) return;
    state.tocExpanded = btn.dataset.expand === "all";
    renderProjectToc();
  });

  document.getElementById("plan-summary")?.addEventListener("click", e => {
    const link = e.target.closest(".priority-desc-link");
    if (!link) return;
    e.preventDefault();
    openProjectDescription(link.dataset.projectId);
  });

  document.getElementById("toc-priority-edit")?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    setPriorityEdit(!state.priorityEdit);
  });

  document.getElementById("toc-list")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-prio-move]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    moveClientPriority(btn.dataset.id, btn.dataset.prioMove === "up" ? -1 : 1);
  });

  document.getElementById("toc-list")?.addEventListener("change", e => {
    const chk = e.target.closest('input[type="checkbox"].toc-proj-chk');
    if (!chk) return;
    e.stopPropagation();
    const row = chk.closest("tr.toc-item");
    if (row && row.dataset.required === "true") return;
    const id = chk.dataset.id;
    const wantAdd = chk.checked;
    if (!trySetProjectInCart(id, wantAdd)) {
      chk.checked = !wantAdd;
      return;
    }
    saveState();
    renderAllCards();
    renderSummary();
  });

  document.querySelectorAll(".toc-sort-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      toggleTocSort(btn.dataset.sort);
    });
  });

  loadState();
  ensureRequiredMaintenance();
  initGilbertGuide();
  renderPackageIntro();
  renderValueIconKey();
  renderKpiDashboard();
  renderDoNextPanel();
  renderCondensedToc();
  renderAllCards();
  if (state.goalText.trim()) suggestPlan(true);
  else {
    renderSummary();
  }
})();
