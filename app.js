(function () {
  function getConfig() {
    return Object.assign(
      {
        webhookUrl: "",
        depositAmount: 2500,
        quickbooksDepositUrl: "",
        notifyEmail: "support@gildedgooselimited.com",
        /** Custom typed e-sign in-guide — not Dropbox/DocuSign/Adobe. */
        esignProvider: "custom",
        esignCreateUrl: "",
        msaLabel: "Master Services Agreement (MSA)",
        sowTemplateNote: "GGL SOW template + Schedule A from payment plan"
      },
      typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
    );
  }
  let CONFIG = getConfig();
  function currentBrandAsset(value, fallback) {
    const deprecated = new Set(["assets/gigi-goose-guide.svg", "assets/gigi-logo-frame.png"]);
    return value && !deprecated.has(value) ? value : fallback;
  }
  const GILBERT_ICON = currentBrandAsset(PROJECT_DATA.guideIcon || PROJECT_DATA.paviIcon, "assets/gigi-seal.jpg");
  const GILBERT_HERO = PROJECT_DATA.guideHero || "assets/gigi-goose-walk.png";
  const GILBERT_SEAL = currentBrandAsset(PROJECT_DATA.guideSeal, "assets/gilbert-celebrating.png");
  const GILBERT_LOGO = currentBrandAsset(PROJECT_DATA.guideLogo, "assets/gigi-logo.jpg");
  const GUIDE_NAME = PROJECT_DATA.guideName || "Lord Gilbert Granville";
  const GUIDE_SHORT = PROJECT_DATA.guideShortName || "Gilbert";
  const GILBERT_GREETING = "Hello! What's your biggest business problem today we can work on fixing?";

  let lastSubmittedPayload = null;

  /** Word cloud → click a category to drill into keyword branches → tags feed goalText.
      Multiple branches open at once; multiple keywords selectable. Session-only (clears on refresh). */
  const GILBERT_CLOUD = [
    {
      id: "leads", label: "Leads & Ads", size: "lg",
      keywords: [
        { id: "more-leads", label: "More leads", tags: "leads consults volume campaigns" },
        { id: "lsa", label: "LSA calls", tags: "LSA local services ads calls" },
        { id: "search", label: "Search ads", tags: "search paid ads campaigns" },
        { id: "display", label: "Display / brand", tags: "display brand awareness campaign" },
        { id: "signed", label: "Signed consults", tags: "consults conversion cases signed" }
      ]
    },
    {
      id: "intake", label: "Phones & Intake", size: "md",
      keywords: [
        { id: "phones", label: "Phone coverage", tags: "phones VoIP calls answer routing" },
        { id: "followup", label: "Fast follow-up", tags: "intake speed follow-up routing" },
        { id: "crm", label: "CRM / HubSpot", tags: "HubSpot CRM intake pipeline" }
      ]
    },
    {
      id: "web", label: "Website & SEO", size: "md",
      keywords: [
        { id: "website", label: "Website", tags: "website landing pages" },
        { id: "seo", label: "SEO", tags: "SEO organic search" },
        { id: "content", label: "Content", tags: "content blog pages" }
      ]
    },
    {
      id: "data", label: "Tracking & Data", size: "md",
      keywords: [
        { id: "kpi", label: "KPI dashboard", tags: "KPI dashboard reporting" },
        { id: "tracking", label: "Tracking", tags: "tracking analytics data" },
        { id: "reporting", label: "Reporting", tags: "reporting data analytics" }
      ]
    },
    {
      id: "referrals", label: "Referrals", size: "sm",
      keywords: [
        { id: "past", label: "Past clients", tags: "past clients referral nurture" },
        { id: "program", label: "Referral program", tags: "referral program email" }
      ]
    },
    {
      id: "efficiency", label: "Cut Waste", size: "sm",
      keywords: [
        { id: "cpl", label: "Lower CPL", tags: "CPL efficiency cost per lead" },
        { id: "pause", label: "Pause waste", tags: "waste pause optimize spend" },
        { id: "audit", label: "Quick audit", tags: "audit quick wins stack safety" }
      ]
    },
    {
      id: "growth", label: "Launch & Grow", size: "sm",
      keywords: [
        { id: "military", label: "Military", tags: "Military campaign launch growth" },
        { id: "ntguilt", label: "NTGUILT", tags: "NTGUILT campaign launch" }
      ]
    }
  ];

  function isRequiredProject(item, isRetainer) {
    if (!item) return false;
    if (isRetainer || item.id === "RETAINER" || item.category === "Retainer") {
      const st = String(item.status || "required").toLowerCase();
      return st.includes("required") || st.includes("ongoing");
    }
    return String(item.status || "").toLowerCase().includes("required");
  }

  /** INDEX Status → default cart: Required + Recommended (not available / planning / etc.). */
  function isIndexDefaultSelected(item, isRetainer) {
    if (!item) return false;
    if (isRequiredProject(item, isRetainer)) return true;
    const st = String(item.status || "").toLowerCase();
    return st.includes("recommended");
  }

  function fitScoreLabel(item, isRetainer) {
    if (!item || isRequiredProject(item, isRetainer)) return "—";
    const scoreRaw = computeProjectScore(item);
    if (scoreRaw == null || scoreRaw <= -999) return "—";
    return String(scoreRaw);
  }

  function findProjectById(id) {
    if (id === "RETAINER") return { ...RETAINER, isRetainer: true };
    const p = PROJECTS.find(x => x.id === id);
    return p ? { ...p, isRetainer: false } : null;
  }

  function hasAbQuestions(item) {
    return false;
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
    const card = document.getElementById(`project-${id}`) || scope.querySelector(`.research-row[data-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    card?.querySelector(`.project-note[data-id="${id}"]`)?.focus();
  }

  function gilbertAbQNoticeText(item) {
    const qs = (item.abQuestions || []).map((q, i) => `${i + 1}. ${q}`).join(" ");
    return `${item.title} is Blocked (needs Andrew): ${qs} — answer in the Blocked box on that card before it can go in the cart.`;
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
    if (!add && isRequiredProject(item, isRetainer)) {
      if (!opts?.silent) showToast("Required items stay in the cart", true);
      return false;
    }
    if (add && !canSelectProject(item, isRetainer)) {
      if (!opts?.silent) {
        showToast("Blocked: answer Andrew's question before adding to cart", true);
        openAbQComment(id);
        announceGilbertAbQ(item);
      }
      return false;
    }
    if (isRetainer) {
      if (add) state.retainer = true;
      else state.retainer = false;
    } else {
      if (add) state.projects.add(id);
      else state.projects.delete(id);
    }
    return true;
  }

  function applyCartCheckboxChange(id, wantAdd, chk) {
    const row = chk?.closest?.("tr");
    if (row && row.dataset.required === "true") {
      if (chk) chk.checked = true;
      return false;
    }
    if (!trySetProjectInCart(id, wantAdd)) {
      if (chk) chk.checked = !wantAdd;
      return false;
    }
    saveState();
    /* Keep Best Fit (top) and Project Outlines (bottom) checkboxes in sync. */
    renderAllCards();
    renderSummary();
    return true;
  }

  function abQuestionsBannerHtml(item) {
    if (!hasAbQuestions(item)) return "";
    const id = item.id;
    if (abQuestionAnswered(id)) return "";
    const qs = item.abQuestions.map(q => `<li>${escapeHtml(q)}</li>`).join("");
    return `<div class="ab-q-flag" role="note">
      <div class="ab-q-flag-head"><span class="ab-q-badge">Blocked</span> Needs Andrew before cart</div>
      <ul class="ab-q-list">${qs}</ul>
      <label for="ab-q-${id}" class="ab-q-answer-label">Answer for Andrew Brown (required before cart)</label>
      <textarea id="ab-q-${id}" class="project-note ab-q-answer" data-id="${id}" placeholder="Reply for Andrew Brown…">${escapeHtml(state.notes[id] || "")}</textarea>
    </div>`;
  }

  function isPriorityUrgent(item) {
    return !!item.enabler || item.status === "wip" || hasPartialProgress(item);
  }

  const REQUIRED_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

  const VALUE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="17" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="17" width="7" height="4.5" rx="0.5"/><rect x="17" y="17" width="6" height="4.5" rx="0.5"/><rect x="5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="13.5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="1" y="6" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="6" width="7" height="4.5" rx="0.5"/><path d="M18 2.5 21.5 6"/><path d="M14.5 6.5 20 12"/><path d="M17.5 3.5h4v4"/></svg>`,
    retainer: REQUIRED_ICON_SVG,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/><circle cx="5" cy="10.5" r="2"/><path d="M1 20v-0.5a2.5 2.5 0 0 1 2-2.45"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 9v11"/><path d="M13 13h5"/><path d="M13 17h5"/></svg>`,
    /* Official HubSpot company sprocket (brand mark) — filled; white on --vi-hubspot-bg */
    hubspot: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.001 2.861a6.01 6.01 0 00-2.812 1.388l-7.57-5.88a2.483 2.483 0 00.095-.676 2.5 2.5 0 00-5 0 2.5 2.5 0 002.5 2.5c.4-.001.794-.097 1.146-.279l7.405 5.745a5.97 5.97 0 00-.888 3.15c0 1.12.313 2.17.85 3.07l-2.303 2.304a1.864 1.864 0 00-.592-.108 1.904 1.904 0 101.904 1.904c0-.21-.037-.41-.094-.6l2.226-2.226a5.994 5.994 0 004.026 1.554 6.01 6.01 0 006.011-6.01 6.007 6.007 0 00-4.163-5.713zM17.17 16.018a3.026 3.026 0 01-3.028-3.028 3.026 3.026 0 013.028-3.028 3.026 3.026 0 013.028 3.028 3.026 3.026 0 01-3.028 3.028z"/></svg>`,
    seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5.5 5.5"/></svg>`,
    referrals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7-4 4 4 4"/><path d="M3 11h13"/><path d="m17 17 4-4-4-4"/><path d="M21 13H8"/></svg>`,
    efficiency: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M10 19V9M16 19v-6M22 19V3"/></svg>`,
    finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c-.6-.9-1.5-1.4-3-1.4-1.8 0-3 1-3 2.3 0 1.2.9 1.9 2.7 2.3l.8.2c1.8.4 2.7 1.1 2.7 2.4 0 1.4-1.3 2.4-3.2 2.4-1.5 0-2.6-.5-3.2-1.3"/></svg>`,
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
    const listIdx = PROJECTS.findIndex(p => p.id === item.id);
    const reverseList = listIdx >= 0 ? listIdx : 0;
    let idScore = 0;
    const id = String(item.id || "");
    for (let i = 0; i < id.length; i++) idScore = idScore * 33 + id.charCodeAt(i);
    return asOfMs * 1e7 + reverseList * 100 + (idScore % 1000);
  }

  /** INDEX Status includes Recommended (Kate's list) — not Gilbert survey flags. */
  function isIndexRecommendedStatus(item) {
    return String(item?.status || "").toLowerCase().includes("recommended");
  }

  /**
   * Display-only Project score 1…n from fit score (highest score → 1). INDEX item.priority
   * (Project score column) is unchanged and still feeds the score weight. Required / unscored rows stay unmapped.
   */
  function buildUniqueTocPriorityMap(items) {
    const map = new Map();
    const rows = items
      .filter(item => !item.isRetainer && item.id !== "RETAINER")
      .map(item => ({
        item,
        score: computeProjectScore(item),
        src: sourceTocPriority(item)
      }))
      .filter(row => row.score > -999 || row.src != null);
    rows.sort((a, b) => {
      const aScore = a.score > -999 ? a.score : Number.NEGATIVE_INFINITY;
      const bScore = b.score > -999 ? b.score : Number.NEGATIVE_INFINITY;
      if (aScore !== bScore) return bScore - aScore;
      const ap = a.src ?? 99;
      const bp = b.src ?? 99;
      if (ap !== bp) return ap - bp;
      return projectNewnessScore(b.item) - projectNewnessScore(a.item);
    });
    rows.forEach((row, i) => map.set(row.item.id, i + 1));
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

  /* Colors live in index.html :root --vi-* + .value-icon.icon-{id}. Filter + table share those classes — never hardcode badge colors here. */
  const VALUE_ICON_DEFS = [
    { id: "foundation", svgId: "foundation", cls: "icon-foundation", label: "Foundation", match: item => !!item.enabler },
    { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Retainer", match: item => item.isRetainer || item.id === "RETAINER" || item.category === "Retainer" },
    { id: "leads", svgId: "leads", cls: "icon-leads", label: "Leads", match: item => /paid media|outbound|display|search|seasonal|social proof|google ads|microsoft|lsa|ppc/i.test(iconMatchText(item)) },
    { id: "crm", svgId: "crm", cls: "icon-crm", label: "CRM", match: item => /crm|pipeline|contact import|landing page/i.test(iconMatchText(item)) && !/\bhubspot\b/i.test(iconMatchText(item)) },
    { id: "hubspot", svgId: "hubspot", cls: "icon-hubspot", label: "HubSpot", match: item => /\bhubspot\b|^hs:/i.test(iconMatchText(item)) || /^hs:/i.test(String(item.title || "")) },
    { id: "seo", svgId: "seo", cls: "icon-seo", label: "SEO", match: item => /seo|blog|local search|website ux|website content|website speed|website module/i.test(iconMatchText(item)) },
    { id: "referrals", svgId: "referrals", cls: "icon-referrals", label: "Referrals", match: item => /referral|testimonial|social proof|direct mail|mailer|case win|past client/i.test(iconMatchText(item)) },
    { id: "efficiency", svgId: "efficiency", cls: "icon-efficiency", label: "Analytics", match: item => /analytics|dashboard|strategy|operations|kpi|reporting/i.test(iconMatchText(item)) },
    { id: "finance", svgId: "finance", cls: "icon-finance", label: "Finance", match: item => /\bfinance\b|financial|waste audit|payout|cashflow|breakeven|subscription waste|credit card|quickbooks/i.test(iconMatchText(item)) },
    { id: "intake", svgId: "intake", cls: "icon-intake", label: "Intake", match: item => /intake|chat|after-hours|infrastructure|call infrastructure|voip|phone/i.test(iconMatchText(item)) },
    { id: "creative", svgId: "creative", cls: "icon-creative", label: "Creative", match: item => /creative|email|social media|display|repurpose/i.test(iconMatchText(item)) }
  ];

  /** Dashboard KPIs tied to each value icon (kept for docs / future use — not shown on filter chips). */
  const ICON_KPI_MAP = {
    foundation: ["#21", "#27"],
    retainer: ["#08", "#12", "#14", "#15"],
    leads: ["#01", "#07", "#08", "#12", "#15"],
    crm: ["#06", "#20", "#27"],
    hubspot: ["#06", "#20", "#21", "#27"],
    seo: ["#11", "#18"],
    referrals: ["#16", "#17"],
    efficiency: ["#01", "#10", "#19", "#28"],
    finance: ["#10", "#19", "#28"],
    intake: ["#09", "#21", "#23"],
    creative: ["#08", "#14"]
  };

  function iconMatchText(item) {
    const desc = item.description ? String(item.description).replace(/<[^>]+>/g, " ") : "";
    const kw = Array.isArray(item.keywords) ? item.keywords.join(" ") : String(item.keywords || "");
    return [
      item.category,
      item.campaignType,
      item.title,
      desc,
      item.valueAdd || "",
      kw
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
    surveyStep: 0,
    surveyAnswers: {},
    surveyDone: false,
    cloudSelected: new Set(),
    cloudOpen: new Set(),
    iconFilters: [],
    statusFilters: [],
    kpiFilter: "",
    tocSort: { field: "priority", dir: "asc" },
    tocExpanded: false,
    showAllProjects: false,
    activeViewTab: "kpis",
    doNextVisible: false,
    priorityEdit: false,
    clientPriorityIds: []
  };

  function normalizeViewTab(tab) {
    const t = String(tab || "kpis").toLowerCase().trim();
    if (t === "revenue" || t === "completed" || t === "results" || t === "impact") return "kpis";
    if (t === "dashboards") return "kpis";
    if (t === "recs" || t === "recommendation" || t === "recommendations") return "kpis";
    if (
      t === "prediction" ||
      t === "predictions" ||
      t === "forecast" ||
      t === "cash-projection" ||
      t === "recs-predictions"
    ) {
      return "kpis";
    }
    if (
      t === "kpis" ||
      t === "data" ||
      t === "picker"
    ) {
      return t;
    }
    return "kpis";
  }

  function setActiveViewTab(tab) {
    state.activeViewTab = normalizeViewTab(tab);
  }

  function normalizeStatus(item) {
    const s = String(item.status || "available").toLowerCase();
    if (s.includes("completed")) return "completed";
    if (s.includes("archived")) return "archived";
    if (s.includes("research")) return "research";
    if (s.includes("draft") || s.includes("outline")) return "draft";
    if (s.includes("hold")) return "onhold";
    if (s.includes("blocked")) return "blocked";
    if (s.includes("required")) return "required";
    if (s.includes("recommended")) return "recommended";
    if (s.includes("launched")) return "launched";
    if (s.includes("planning")) return "planning";
    if (s.includes("ongoing")) return "ongoing";
    if (s.includes("wip") || s.includes("started")) return "wip";
    return "available";
  }

  const STATUS_FILTER_DEFS = [
    { id: "required", label: "Required" },
    { id: "recommended", label: "Recommended" },
    { id: "wip", label: "WIP / Started" },
    { id: "available", label: "Available" },
    { id: "planning", label: "Planning" },
    { id: "launched", label: "Launched" },
    { id: "ongoing", label: "Ongoing" },
    { id: "onhold", label: "On Hold" },
    { id: "blocked", label: "Blocked" },
    { id: "research", label: "Research / draft" }
  ];

  function statusFilterLabel(id) {
    return STATUS_FILTER_DEFS.find(d => d.id === id)?.label || id;
  }

  /** Named 0–100 best-fit weights (positives sum to 100 at full credit). Bonuses stack on top. */
  const SCORE_WEIGHTS = {
    priority: 30,
    leadGenerator: 17,
    enabler: 15,
    goalMatch: 15,
    dataBacked: 6,
    dataReturn: 4,
    feeAccess: 8,
    cartSynergy: 5,
    wip: 10,
    /** Extra points as a project's projected start date approaches (see seasonUrgencyBoost). */
    seasonUrgency: 10,
    /** INDEX Status = Recommended — boost so recommended projects rank above peers. */
    recommended: 20
  };

  function normalizePublishStatus(item) {
    const s = String(item.publishStatus || "published").toLowerCase().trim();
    if (
      s === "unpublished" ||
      s === "unpublish" ||
      s === "hidden" ||
      s === "gray" ||
      s === "grey" ||
      s === "planning" ||
      s === "plan" ||
      s === "draft" ||
      s === "outline"
    ) {
      return "unpublished";
    }
    return "published";
  }

  function isPlanningPublish(item) {
    return normalizePublishStatus(item) === "unpublished";
  }

  function isCompletedStatus(item) {
    const s = normalizeStatus(item);
    return s === "completed" || s === "archived";
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

  function liveRankableProjects() {
    return PROJECTS.filter(p => !p.monthlyOnly && !isCompletedStatus(p));
  }

  function livePriorityBounds() {
    const pris = liveRankableProjects()
      .map(p => p.priority)
      .filter(p => p != null && Number.isFinite(Number(p)))
      .map(Number);
    if (!pris.length) return { min: 1, max: 1 };
    return { min: Math.min(...pris), max: Math.max(...pris) };
  }

  function isLeadGenerator(item) {
    return getValueIcons(item).some(v => v.id === "leads");
  }

  /**
   * Bonus points as projected start date approaches (closer = higher).
   * Ramp: 0 beyond 90 days out → full seasonUrgency at start date; hold 45 days after, then fade by day 90.
   */
  function seasonUrgencyBoost(item) {
    const raw = item && (item.startDate || item.campaignStart || item.seasonStart);
    if (!raw) return 0;
    const start = new Date(String(raw).trim() + (String(raw).includes("T") ? "" : "T12:00:00"));
    if (Number.isNaN(start.getTime())) return 0;
    const now = new Date();
    const daysUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    const max = SCORE_WEIGHTS.seasonUrgency;
    const rampDays = 90;
    if (daysUntil > rampDays) return 0;
    if (daysUntil <= 0) {
      if (daysUntil >= -45) return max;
      if (daysUntil >= -90) return max * Math.max(0, (daysUntil + 90) / 45);
      return 0;
    }
    return max * (1 - daysUntil / rampDays);
  }

  /** Best-fit score on a named 0–100 scale (see SCORE_WEIGHTS / INDEX.md). Required items are not scored. */
  function computeProjectScore(item) {
    if (!item || isRequiredProject(item, !!item.isRetainer) || isCompletedStatus(item) || item.monthlyOnly) return -999;
    const W = SCORE_WEIGHTS;
    let score = 0;

    const { min: pMin, max: pMax } = livePriorityBounds();
    const pri = Number(item.priority);
    const priSafe = Number.isFinite(pri) ? pri : pMax;
    if (pMax === pMin) score += W.priority;
    else score += W.priority * Math.max(0, Math.min(1, (pMax - priSafe) / (pMax - pMin)));

    if (isLeadGenerator(item)) score += W.leadGenerator;
    if (item.enabler) score += W.enabler;

    if (state.goalText.trim()) {
      const words = state.goalText.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      const raw = scoreItemForGoal(item, words);
      score += Math.min(W.goalMatch, raw * (W.goalMatch / 12));
    }

    if (item.backedMetric && item.backedMetric.label) score += W.dataBacked;
    if (item.returnEstimate) score += W.dataReturn;

    const fee = itemSelectionCost(item);
    const feeMax = maxProjectFee();
    score += Math.max(0, W.feeAccess * (1 - fee / feeMax));

    if (state.projects.size && item.enabler) score += W.cartSynergy;
    if (normalizeStatus(item) === "wip") score += W.wip;
    score += seasonUrgencyBoost(item);
    if (isIndexRecommendedStatus(item)) score += W.recommended;

    /* Max 140: 100 named positives + WIP 10 + season 10 + Recommended 20. No status penalties. */
    score = Math.min(140, score);

    return Math.round(Math.max(0, score) * 10) / 10;
  }

  function topScoredProjects(limit) {
    return activeOptionalProjects()
      .filter(item => !isRequiredProject(item, false))
      .map(item => ({ item, score: computeProjectScore(item) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit || 3);
  }

  /**
   * INDEX Status = Recommended (Kate's list). Sorted by fit score (desc) — includes +20 Recommended.
   */
  function indexRecommendedBestFit(limit) {
    const items = activeOptionalProjects()
      .filter(item => {
        if (isRequiredProject(item, false)) return false;
        return isIndexRecommendedStatus(item);
      })
      .map(item => ({ item, score: computeProjectScore(item) }))
      .sort((a, b) => b.score - a.score || (a.item.priority ?? 99) - (b.item.priority ?? 99));
    if (typeof limit === "number" && limit > 0) return items.slice(0, limit);
    return items;
  }

  /** Required (locked) + Recommended — the plan that should match the invoice on fresh load. */
  function indexPlanBestFit() {
    const required = [];
    if (isRequiredProject(RETAINER, true)) {
      required.push({ item: { ...RETAINER, isRetainer: true }, score: -999 });
    }
    activeOptionalProjects().forEach(item => {
      if (!isRequiredProject(item, false)) return;
      if (isCompletedStatus(item) || isPlanningPublish(item)) return;
      required.push({ item, score: -999 });
    });
    return required.concat(indexRecommendedBestFit());
  }

  /** Nest {item,score} rows so HubSpot (and other) children stay under their parent. */
  function nestRankedList(ranked) {
    if (!ranked?.length) return [];
    const scoreOf = new Map(ranked.map(r => [r.item.id, r.score]));
    const nested = nestChildrenUnderParents(
      ranked.map(r => r.item),
      (a, b) => {
        const aReq = isRequiredProject(a, !!a.isRetainer);
        const bReq = isRequiredProject(b, !!b.isRetainer);
        if (aReq !== bReq) return aReq ? -1 : 1;
        const as = scoreOf.get(a.id) ?? 0;
        const bs = scoreOf.get(b.id) ?? 0;
        if (as !== bs) return bs - as;
        return (a.priority ?? 99) - (b.priority ?? 99);
      }
    );
    return nested.map(item => ({ item, score: scoreOf.get(item.id) ?? 0 }));
  }

  /** Best Fit rows = invoice line items (same projects), required first then by score. */
  function rankedInvoiceForBestFit() {
    const ranked = getInvoiceLineItems().map(row => {
      const item = findProjectById(row.id) || { id: row.id, title: row.title, isRetainer: row.id === "RETAINER" };
      const isRet = !!item.isRetainer || item.id === "RETAINER";
      const score = isRequiredProject(item, isRet) ? -999 : computeProjectScore(item);
      return { item: { ...item, isRetainer: isRet }, score };
    });
    return nestRankedList(ranked);
  }

  /** Session-only: Gilbert/survey may override Best Fit until refresh. Never persisted. */
  let bestFitSessionActive = false;

  function activateBestFitSession() {
    bestFitSessionActive = true;
  }

  function resetBestFitSession() {
    bestFitSessionActive = false;
  }

  function bestFitRankedListHtml(ranked) {
    if (!ranked.length) {
      return `<p class="kpi-dashboard-note">No recommended projects in INDEX yet — set Status to Recommended, or finish the survey.</p>`;
    }
    const bodyRows = ranked.map(({ item, score }, i) => {
      const isRetainer = !!item.isRetainer || item.id === "RETAINER";
      const required = isRequiredMaintenance(item, isRetainer);
      const selected = isItemSelected(item);
      const chkDisabled = required ? " disabled" : "";
      const req = requiredMarkerHtml(item, isRetainer);
      const scoreLabel = score <= -999 ? "—" : String(score);
      const scoreTitle = required ? "Required — no fit score" : "Best-fit / impact — higher is better";
      return `<tr data-id="${escapeHtml(item.id)}" data-retainer="${isRetainer}" data-required="${required}">
        <td class="col-select">
          <input type="checkbox" class="cart-proj-chk" data-id="${escapeHtml(item.id)}" aria-label="Add ${escapeHtml(item.title)} to plan"${chkDisabled} ${selected ? "checked" : ""}>
        </td>
        <td class="col-project"><a href="${projectAnchor(item.id)}" class="priority-desc-link" data-project-id="${escapeHtml(item.id)}"><span class="priority-req-slot" aria-hidden="${req ? "false" : "true"}">${req || ""}</span><span class="priority-desc-title">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</span></a></td>
        <td class="col-score" title="${escapeHtml(scoreTitle)}">${escapeHtml(scoreLabel)}</td>
      </tr>`;
    }).join("");
    return `<div class="pav-priorities-scroll"><table class="pav-priorities-table pav-priorities-cart-only pav-priorities-best-fit">
      <thead>
        <tr>
          <th class="col-select" scope="col">Add</th>
          <th class="col-project" scope="col">Project</th>
          <th class="col-score" scope="col" title="Best-fit / impact — higher is better. Required items show —.">Fit</th>
        </tr>
      </thead>
      <tbody>${bodyRows}</tbody>
    </table></div>`;
  }

  function renderKpiDashboard() {
    if (!window.KPI_REPORT) return;
    const kpis = document.getElementById("kpi-report-kpis");
    if (kpis) KPI_REPORT.renderKpis(kpis);
  }

  function pinKpiTabToTop() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function renderDoNextPanel() {
    const el = document.getElementById("do-next-panel");
    if (!el) return;
    el.hidden = false;
    const cartItems = getInvoiceLineItems();
    const hasCart = cartItems.length > 0;
    const head = `<div class="do-next-head">
      <div class="do-next-head-copy">
        <h3>Best Fit Projects for Pav Law</h3>
      </div>
    </div>`;

    /* Best Fit and invoice always show the same projects (cart line items).
       Fresh load seeds cart to INDEX Required + Recommended. */
    let ranked = rankedInvoiceForBestFit();
    if (!ranked.length) {
      ranked = bestFitSessionActive && hasGilbertActivity()
        ? nestRankedList(gilbertRankedPicks(5).map(item => ({ item, score: computeProjectScore(item) })))
        : nestRankedList(indexPlanBestFit());
    }
    const body = bestFitRankedListHtml(ranked);

    el.innerHTML = `${head}
      <div class="total-box" id="plan-summary">${body}</div>
      <button type="button" class="btn btn-primary project-continue-btn" id="continue-to-confirm" ${hasCart ? "" : "disabled"}>Review Plan</button>`;

  }

  function renderPlanSummary() {
    renderDoNextPanel();
  }

  function campaignMetricsHtml() {
    return "";
  }

  function resultsBlockHtml(item) {
    let html = "";
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
      <p class="completed-card-meta">${escapeHtml(normalizeStatus(item))}${item.timeline ? ` · ${escapeHtml(item.timeline)}` : ""}</p>
      ${resultsBlockHtml(item)}
    </article>`;
  }

  function completedReportOutProjectHtml(item) {
    const shipped = (item.completedItems || []).slice(0, 3);
    const metaParts = [
      normalizeStatus(item),
      item.timeline,
      [item.category, item.campaignType].filter(Boolean).join(" / ")
    ].filter(Boolean);
    return `<div class="completed-report-out-project">
      <h4>${escapeHtml(item.title)}</h4>
      <p class="completed-report-out-project-meta">${escapeHtml(metaParts.join(" · "))}</p>
      <ul>
        ${shipped.length ? `<li><strong>Completed:</strong> ${escapeHtml(shipped.join("; "))}</li>` : ""}
      </ul>
    </div>`;
  }

  function completedReportOutHtml(items) {
    if (!items.length) {
      return `<div class="completed-report-out-head">
          <span class="completed-report-out-badge">Draft</span>
          <h3>Report out — completed projects</h3>
        </div>
        <p class="completed-report-out-lede">No projects marked <strong>completed</strong> in INDEX yet. When a project ships, set Status to completed — this report-out will populate from Completed.</p>`;
    }
    const names = items.map(p => `<strong>${escapeHtml(p.title)}</strong>`).join("; ");
    const closer =
      items.some(p => p.id === "AccessAud") && items.some(p => p.id === "EmailDns")
        ? "Systems foundation is closed and paid (Invoice 1018): admin access cleansed across Ads/LSA/GBP/Analytics/hosting/CMS/MyCase, and the email/DNS outage has a documented root cause, resolution protocol, and maintenance log. Next lift depends on WIP enablers — HubSpot Phone/VoIP, LSA call process Phase 2, and HubSpot Marketing Setup."
        : items.some(p => p.id === "SummerEmail") && items.some(p => p.id === "StackAudit")
        ? "Holiday email path is live and the stack priorities are set. Continued lift depends on WIP enablers — phones, LSA/intake coverage, and the KPI cockpit."
        : "Confirm outcomes in HubSpot before locking revenue figures.";
    return `<div class="completed-report-out-head">
        <span class="completed-report-out-badge">Draft</span>
        <h3>Report out — completed projects</h3>
      </div>
      <p class="completed-report-out-lede">${items.length} project${items.length === 1 ? "" : "s"} closed: ${names}. Detail cards below show Completed work.</p>
      ${items.map(completedReportOutProjectHtml).join("")}
      <p class="completed-report-out-bottom"><strong>Bottom line:</strong> ${escapeHtml(closer)}</p>
      <p class="completed-report-out-footnote">Draft for review — edit project markdown to update.</p>`;
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
    const tagLabel = abQ && !answered ? "Comment — Blocked" : (note ? "Comment ✓" : "+ Comment");
    return `<div class="research-row${sel ? " selected" : ""}${abQ && !answered ? " ab-q-pending" : ""}" data-id="${id}">
      <input type="checkbox" class="proj-chk research-chk" data-id="${id}" ${sel ? "checked" : ""}${abQ && !answered ? ' title="Answer Blocked note in Comment first"' : ""}>
      <div>
        <div class="research-row-title">${escapeHtml(item.title)}</div>
        ${abQ ? abQuestionsBannerHtml(item) : ""}
      </div>
      <button type="button" class="research-comment-tag${note ? " has-note" : ""}${abQ && !answered ? " needs-ab-q" : ""}" data-id="${id}">${tagLabel}</button>
      <div class="research-comment-popover" data-id="${id}" hidden>
        <textarea class="project-note" data-id="${id}" placeholder="${abQ ? "Answer for Andrew Brown (Blocked)…" : "Planning notes for Gilded Goose…"}">${escapeHtml(state.notes[id] || "")}</textarea>
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
      if (view === "kpis" || view === "data" || view === "recommendations") {
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
    const isData = state.activeViewTab === "data";
    const isRecs = state.activeViewTab === "recommendations";
    const isPicker = state.activeViewTab === "picker";
    const isImpact = state.activeViewTab === "impact";
    const kpisPanel = document.getElementById("cockpit-panel-kpis");
    const dataPanel = document.getElementById("cockpit-panel-data");
    const recsPanel = document.getElementById("cockpit-panel-recommendations");
    const pickerPanel = document.getElementById("cockpit-panel-picker");
    const impactPanel = document.getElementById("cockpit-panel-impact");
    if (kpisPanel) kpisPanel.hidden = !isKpis;
    if (dataPanel) dataPanel.hidden = !isData;
    if (recsPanel) recsPanel.hidden = !isRecs;
    if (pickerPanel) pickerPanel.hidden = !isPicker;
    if (impactPanel) impactPanel.hidden = !isImpact;
    syncViewTabs();
    renderResearchSection();
    renderKpiDashboard();
    if (isData && window.KPI_REPORT) {
      const dataEl = document.getElementById("kpi-report-data");
      if (dataEl) KPI_REPORT.renderData(dataEl);
    }
    if (isRecs && window.KPI_REPORT) {
      const recsEl = document.getElementById("kpi-report-recommendations");
      if (recsEl) KPI_REPORT.renderRecommendations(recsEl);
      const predEl = document.getElementById("kpi-report-predictions");
      if (predEl) KPI_REPORT.renderPredictions(predEl);
    }
    if (isImpact) {
      if (window.KPI_REPORT) {
        const impactEl = document.getElementById("kpi-report-impact");
        if (impactEl) KPI_REPORT.renderImpact(impactEl);
      }
      renderCompletedList();
      renderRevenueCalculator();
    }
  }

  const OMNI_CHANNEL_WHY =
    "Pav Law grows when the same trusted message meets clients wherever they search — paid search, display, directories, email, referrals, and the website. Omnichannel works because each channel feeds the others: ads drive qualified visits; a fast site and clear intake convert them; phones and CRM route every lead; retargeting and mailers bring back prospects who did not book the first time. Connected channels produce signed cases you can trace to spend — not siloed clicks.";

  const PROJECT_LIST_LIMIT = 10;

  const PERFORMANCE_PAY_IDS = new Set(["RETAINER", "AdEnhance", "NtguiltAd", "SummerEmail", "Referral", "GabrielOut", "SocialAds", "HolidayAds"]);

  /** Payment calculator defaults — full rules in PAYMENT-SCHEDULE.md (doc may lag; code wins) */
  const PAYMENT_DEPOSIT_PCT = 0.5;
  const PAYMENT_NO_SURCHARGE_DAYS = 30;

  function getProjectsInvoiceTotal() {
    return getSelectedProjects().reduce((s, p) => s + projectScheduleFee(p), 0);
  }

  /** One-time fee that participates in deposit + schedule (excludes retainer / monthly / ongoing). */
  function projectScheduleFee(item) {
    if (!item || item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return 0;
    return Math.max(0, Math.round(Number(item.fee) || 0));
  }

  function projectMonthlyBill(item) {
    if (!item) return 0;
    if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) {
      return Math.max(0, Math.round(Number(item.fee) || 0));
    }
    return Math.max(0, Math.round(Number(item.ongoingFee) || 0));
  }

  function normalizeDepositPct(raw) {
    if (raw == null || raw === "") return PAYMENT_DEPOSIT_PCT;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return PAYMENT_DEPOSIT_PCT;
    return n > 1 ? Math.min(1, n / 100) : Math.min(1, n);
  }

  /** Per-project payment option: due now, remaining on schedule, optional monthly bill. */
  function getProjectPaymentOption(item) {
    const isRetainer = !!(item.isRetainer || item.id === "RETAINER");
    const scheduleFee = projectScheduleFee(item);
    const monthly = projectMonthlyBill(item);
    const payType = getPaymentType(item, isRetainer);

    if (scheduleFee <= 0) {
      return {
        id: item.id,
        title: item.title,
        kind: "monthly",
        scheduleFee: 0,
        dueNow: 0,
        remaining: 0,
        monthly,
        depositPct: null,
        paymentType: payType
      };
    }

    const depositPct = normalizeDepositPct(item.depositPct);
    let dueNow = item.depositAmount != null && item.depositAmount !== ""
      ? Math.round(Number(item.depositAmount))
      : Math.round(scheduleFee * depositPct);
    dueNow = Math.max(0, Math.min(scheduleFee, dueNow));
    const remaining = scheduleFee - dueNow;
    return {
      id: item.id,
      title: item.title,
      kind: "project",
      scheduleFee,
      dueNow,
      remaining,
      monthly,
      depositPct: dueNow / scheduleFee,
      paymentType: payType
    };
  }

  function getCartPaymentOptions() {
    const items = [];
    if (state.retainer) items.push(getProjectPaymentOption({ ...RETAINER, isRetainer: true }));
    getSelectedProjects().forEach(p => items.push(getProjectPaymentOption({ ...p, isRetainer: false })));
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) items.push(getProjectPaymentOption({ ...p, isRetainer: false }));
    });
    return items;
  }

  function cartPaymentTotals(options) {
    const rows = options || getCartPaymentOptions();
    return {
      dueNow: rows.reduce((s, r) => s + r.dueNow, 0),
      remaining: rows.reduce((s, r) => s + r.remaining, 0),
      scheduleFees: rows.reduce((s, r) => s + r.scheduleFee, 0),
      monthly: rows.reduce((s, r) => s + r.monthly, 0)
    };
  }

  function buildPaymentOptionsHtml() {
    const rows = getCartPaymentOptions();
    if (!rows.length) {
      return `<p class="payment-options-empty">Add projects to see deposit and schedule amounts.</p>`;
    }
    const totals = cartPaymentTotals(rows);
    const body = rows.map(r => `<tr>
      <td class="col-project"><a href="${projectAnchor(r.id)}" class="priority-desc-link" data-project-id="${escapeHtml(r.id)}">${escapeHtml(r.title)}</a></td>
      <td class="col-fee">${r.scheduleFee ? fmt(r.scheduleFee) : (r.monthly ? `${fmt(r.monthly)}/mo` : "—")}</td>
      <td class="col-due">${r.dueNow ? fmt(r.dueNow) : (r.kind === "monthly" ? "Monthly" : "—")}</td>
      <td class="col-remain">${r.remaining ? fmt(r.remaining) : "—"}</td>
    </tr>`).join("");
    return `<div class="payment-options-scroll"><table class="payment-options-table">
      <thead>
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Total fee</th>
          <th scope="col">Deposit due</th>
          <th scope="col">Scheduled</th>
        </tr>
      </thead>
      <tbody>
        ${body}
        <tr class="payment-options-totals">
          <td>Totals</td>
          <td>${totals.scheduleFees ? fmt(totals.scheduleFees) : "—"}</td>
          <td>${totals.dueNow ? fmt(totals.dueNow) : "—"}</td>
          <td>${totals.remaining ? fmt(totals.remaining) : "—"}</td>
        </tr>
      </tbody>
    </table></div>`;
  }

  /** Payment calculator: deposit from payment options; remaining on schedule.
   *  Surcharge: 0% for first 30 days (1 month); then +10% per additional month on remaining balance.
   *  rate = max(0, months - 1) × 0.10 */

  function paymentSurchargeRateForMonths(months) {
    const m = Number(months) || 0;
    if (m <= 1) return 0;
    return (m - 1) * 0.10;
  }

  function computePaymentPlan(months, projectTotal) {
    const cart = cartPaymentTotals();
    const fees = Math.max(0, Math.round(cart.scheduleFees || Number(projectTotal) || 0));
    const m = months != null && months !== "" ? Number(months) : null;
    const deposit = Math.max(0, Math.round(cart.dueNow != null ? cart.dueNow : fees * PAYMENT_DEPOSIT_PCT));
    const remainingBase = Math.max(0, Math.round(cart.remaining != null ? cart.remaining : fees - deposit));
    if (!m || m < 1 || fees <= 0) {
      return {
        months: m && m >= 1 ? m : null,
        projectFees: fees,
        depositPct: fees ? deposit / fees : PAYMENT_DEPOSIT_PCT,
        deposit,
        remainingBase,
        surchargeRate: 0,
        surchargeAmount: 0,
        financedRemaining: remainingBase,
        perInvoice: null,
        totalDue: deposit + remainingBase,
        noSurcharge: true,
        within30Days: true,
        within60Days: true,
        daysEstimate: m && m >= 1 ? m * 30 : null,
        monthlySeparate: cart.monthly || 0
      };
    }
    const daysEstimate = m * 30;
    const noSurcharge = daysEstimate <= PAYMENT_NO_SURCHARGE_DAYS;
    const surchargeRate = paymentSurchargeRateForMonths(m);
    const surchargeAmount = Math.round(remainingBase * surchargeRate);
    const financedRemaining = remainingBase + surchargeAmount;
    const perInvoice = Math.round(financedRemaining / m);
    const totalDue = deposit + financedRemaining;
    return {
      months: m,
      projectFees: fees,
      depositPct: fees ? deposit / fees : PAYMENT_DEPOSIT_PCT,
      deposit,
      remainingBase,
      surchargeRate,
      surchargeAmount,
      financedRemaining,
      perInvoice,
      totalDue,
      noSurcharge,
      within30Days: noSurcharge,
      within60Days: noSurcharge,
      daysEstimate,
      monthlySeparate: cart.monthly || 0
    };
  }

  function paymentPlanBreakdownHtml(plan) {
    if (!plan || plan.projectFees <= 0) {
      return `<div class="payment-calc-breakdown" id="payment-calc-breakdown">
        <p class="payment-calc-empty">Select one-time projects to calculate deposit and invoice schedule.</p>
      </div>`;
    }
    const ratePct = Math.round(plan.surchargeRate * 100);
    const rows = [
      ["Project fees (one-time)", fmt(plan.projectFees)],
      [`Due now (from payment options)`, fmt(plan.deposit)],
      ["Remaining on schedule", fmt(plan.remainingBase)]
    ];
    if (plan.monthlySeparate) {
      rows.push(["Monthly (retainer / ongoing)", `${fmt(plan.monthlySeparate)}/mo separate`]);
    }
    if (plan.months) {
      rows.push(["Payoff window", `~${plan.daysEstimate} days (${plan.months} invoice${plan.months === 1 ? "" : "s"})`]);
      if (plan.noSurcharge) {
        rows.push(["Schedule surcharge", "None — paid within 30 days"]);
      } else {
        rows.push([`Schedule surcharge (+${ratePct}% on remaining)`, fmt(plan.surchargeAmount)]);
        rows.push(["Financed remaining", fmt(plan.financedRemaining)]);
      }
      if (plan.perInvoice != null) {
        rows.push([`Amount per invoice × ${plan.months}`, fmt(plan.perInvoice)]);
      }
      rows.push(["Total due (deposit + invoices)", fmt(plan.totalDue)]);
    } else {
      rows.push(["Choose a schedule", `Select how long to pay the remaining ${fmt(plan.remainingBase)}`]);
    }
    function paymentCalcRowClass(label) {
      if (/Total due/i.test(label)) return "payment-calc-row--total";
      if (/Due now/i.test(label)) return "payment-calc-row--deposit";
      if (/Schedule surcharge/i.test(label)) {
        return plan.noSurcharge ? "payment-calc-row--surcharge-none" : "payment-calc-row--surcharge";
      }
      return "";
    }
    return `<div class="payment-calc-breakdown" id="payment-calc-breakdown">
      <table class="payment-calc-table"><tbody>
        ${rows.map(([k, v]) => {
          const cls = paymentCalcRowClass(k);
          return `<tr${cls ? ` class="${cls}"` : ""}><th scope="row">${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`;
        }).join("")}
      </tbody></table>
    </div>`;
  }

  function updateInvoiceScheduleAmount() {
    const monthsEl = document.getElementById("invoice-payment-months");
    const amountEl = document.getElementById("invoice-payment-amount");
    const breakdownHost = document.getElementById("payment-calc-breakdown-host");
    if (!monthsEl || !amountEl) return;

    const months = monthsEl.value !== "" ? Number(monthsEl.value) : null;
    const projectTotal = getProjectsInvoiceTotal();
    const plan = computePaymentPlan(months, projectTotal);

    if (breakdownHost) breakdownHost.innerHTML = paymentPlanBreakdownHtml(plan);

    if (projectTotal <= 0) {
      amountEl.value = "";
      amountEl.placeholder = "No project fees to invoice";
      syncPaymentTermsFromDom();
      return;
    }

    if (!months || months < 1) {
      amountEl.value = "";
      amountEl.placeholder = "Select schedule first";
      syncPaymentTermsFromDom();
      return;
    }

    amountEl.value = String(plan.perInvoice != null ? plan.perInvoice : "");
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
    const plan = computePaymentPlan(months, projectTotal);
    let label = null;
    if (months && monthlyAmount != null && plan.projectFees > 0) {
      const surchargeNote = plan.surchargeAmount
        ? `; +${Math.round(plan.surchargeRate * 100)}% schedule surcharge ${fmt(plan.surchargeAmount)} on remaining`
        : "; no surcharge (≤30 days)";
      label = `Due now ${fmt(plan.deposit)}; then ${months} QuickBooks invoice${months === 1 ? "" : "s"} of ${fmt(monthlyAmount)} (financed remaining ${fmt(plan.financedRemaining)}${surchargeNote}; total ${fmt(plan.totalDue)})`;
    } else if (months) {
      label = `${months} invoice${months === 1 ? "" : "s"} — deposit billed immediately per payment options`;
    }
    return {
      months,
      monthlyAmount,
      projectTotal: plan.projectFees,
      depositAmount: plan.deposit,
      depositPct: plan.depositPct,
      remainingBase: plan.remainingBase,
      surchargeRate: plan.surchargeRate,
      surchargeAmount: plan.surchargeAmount,
      financedRemaining: plan.financedRemaining,
      totalDue: plan.totalDue,
      within30Days: plan.within30Days,
      within60Days: plan.within60Days,
      monthlySeparate: plan.monthlySeparate || 0,
      lineItems: getCartPaymentOptions(),
      label
    };
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
    if (/\bhubspot\b/.test(text) || /\bhubspot\b/.test(cat)) ids.push("hubspot");
    if (/crm|pipeline/.test(cat)) ids.push("crm");
    if (/paid media|outbound|ppc|search|lsa|display|google ads|microsoft|seasonal/.test(cat)) ids.push("leads");
    if (/seo|website|blog|local search|local presence/.test(cat)) ids.push("seo");
    if (/referral|direct mail|testimonial|social proof|past client/.test(cat)) ids.push("referrals");
    if (/analytics|strategy|operations|kpi/.test(cat)) ids.push("efficiency");
    if (/finance|financial|audit|payout|billing|waste/.test(cat) || /\bfinance\b|financial|cashflow|breakeven|payout|waste audit/.test(text)) ids.push("finance");
    if (/intake|infrastructure|phone|call|voip|\bai\b/.test(cat)) ids.push("intake");
    if (/creative|email|social media|brand/.test(cat)) ids.push("creative");
    if (/booking|speed.to.lead|form fill|web lead|call tracking|voip/.test(text) && !ids.includes("intake")) ids.push("intake");
    if (/display|ntguilt|brand awareness|upper.funnel/.test(text) && /paid|display|brand|creative/.test(cat) && !ids.includes("creative")) {
      ids.push("creative");
    }
    return [...new Set(ids)];
  }

  function getValueIcons(item) {
    let icons = [];
    if (item.valueIcons && item.valueIcons.length) {
      icons = item.valueIcons.map(id => {
        const def = VALUE_ICON_DEFS.find(d => d.id === id);
        return def || { id, svgId: id, cls: `icon-${id}`, label: id };
      }).filter(Boolean);
    } else if (item.isRetainer || item.id === "RETAINER" || item.category === "Retainer") {
      const def = VALUE_ICON_DEFS.find(d => d.id === "retainer");
      icons = [def || { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Retainer" }];
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

  function cardCornerIconsHtml(item, isRetainer, inline) {
    const valueHtml = valueIconsHtml({ ...item, isRetainer });
    if (!valueHtml) return "";
    const cls = inline ? "card-icons-inline" : "card-icons-corner";
    return `<div class="${cls}">${valueHtml}</div>`;
  }

  function itemMatchesIconFilters(item) {
    if (!state.iconFilters.length) return true;
    const iconIds = getValueIcons(item).map(i => i.id);
    return state.iconFilters.some(f => iconIds.includes(f));
  }

  function itemMatchesStatusFilters(item) {
    if (!state.statusFilters.length) return true;
    const st = normalizeStatus(item);
    if (state.statusFilters.includes(st)) return true;
    if (state.statusFilters.includes("research") && (st === "research" || st === "draft")) return true;
    return false;
  }

  function resolveKpiFilterKey(raw) {
    const key = String(raw || "").trim();
    if (!key) return "";
    if (key === "yelp") return "yelp";
    if (key === "financial") return "financial";
    return normalizeKpiRef(key) || key;
  }

  function kpiFilterLabel(kpiId) {
    const key = resolveKpiFilterKey(kpiId);
    if (!key) return "";
    if (key === "yelp") return "Yelp Goal";
    if (key === "financial") return "Breakeven Forecast";
    if (KPI_IMPACT_META[key] && KPI_IMPACT_META[key].name) return KPI_IMPACT_META[key].name;
    if (window.KPI_REPORT && typeof window.KPI_REPORT.kpiLabel === "function") {
      return window.KPI_REPORT.kpiLabel(key);
    }
    return key;
  }

  function relatedProjectIdsForKpi(kpiId) {
    const key = resolveKpiFilterKey(kpiId);
    if (!key) return [];
    if (window.KPI_REPORT && typeof window.KPI_REPORT.relatedProjectsForKpi === "function") {
      return window.KPI_REPORT.relatedProjectsForKpi(key);
    }
    return [];
  }

  function itemMatchesKpiFilter(item) {
    const key = resolveKpiFilterKey(state.kpiFilter);
    if (!key) return true;
    const id = item.isRetainer || item.id === "RETAINER" ? "RETAINER" : item.id;
    const related = relatedProjectIdsForKpi(key);
    if (related.includes(id)) return true;
    const numeric = normalizeKpiRef(key);
    if (!numeric) return related.length ? false : true;
    return kpiIdsForProject(item).includes(numeric);
  }

  function itemMatchesOutlineFilters(item) {
    return itemMatchesIconFilters(item) && itemMatchesStatusFilters(item) && itemMatchesKpiFilter(item);
  }

  function clearKpiFilter() {
    state.kpiFilter = "";
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function openGuideFilteredToKpi(kpiId) {
    const key = resolveKpiFilterKey(kpiId);
    if (!key) return;
    state.kpiFilter = key;
    state.showAllProjects = true;
    setActiveViewTab("picker");
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
    requestAnimationFrame(() => {
      const banner = document.getElementById("kpi-project-filter-banner");
      const list = document.getElementById("project-list");
      (banner || list)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleIconFilter(id) {
    const idx = state.iconFilters.indexOf(id);
    if (idx >= 0) state.iconFilters.splice(idx, 1);
    else state.iconFilters.push(id);
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function clearIconFilters() {
    state.iconFilters = [];
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function toggleStatusFilter(id) {
    const idx = state.statusFilters.indexOf(id);
    if (idx >= 0) state.statusFilters.splice(idx, 1);
    else state.statusFilters.push(id);
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function clearStatusFilters() {
    state.statusFilters = [];
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function clearOutlineFilters() {
    state.iconFilters = [];
    state.statusFilters = [];
    state.kpiFilter = "";
    saveState();
    renderOutlineFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  }

  function statusesPresentInPool() {
    const pool = allItemsByPriority().filter(item => {
      if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return true;
      return !isCompletedStatus(item);
    });
    const present = new Set(pool.map(normalizeStatus));
    if (present.has("draft")) present.add("research");
    return STATUS_FILTER_DEFS.filter(d => present.has(d.id) || (d.id === "research" && (present.has("research") || present.has("draft"))));
  }

  function renderOutlineFilters() {
    renderValueIconKey();
    renderStatusFilterKey();
  }

  function renderStatusFilterKey() {
    const el = document.getElementById("status-filter-key");
    if (!el) return;
    const defs = statusesPresentInPool();
    const activeCount = state.statusFilters.length;
    const clearBtn = activeCount
      ? `<button type="button" class="icon-filter-clear" id="status-filter-clear">Clear status (${activeCount})</button>`
      : "";
    el.innerHTML =
      `<span class="value-icon-key-title">Filter by status <span class="tab-help" data-help-title="Filter by status" data-help-desc="Show only projects with these INDEX statuses. WIP includes Started. Multi-select is OR. Clears with Clear status." aria-label="How to use status filters">?</span></span>${clearBtn}` +
      defs.map(d => {
        const active = state.statusFilters.includes(d.id) ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn status-filter-btn${active}" data-status-filter="${d.id}" title="Show ${escapeHtml(d.label)} projects"><span class="key-item-meta"><span class="key-item-label">${escapeHtml(d.label)}</span></span></button>`;
      }).join("");
    el.querySelectorAll("[data-status-filter]").forEach(btn => {
      btn.addEventListener("click", () => toggleStatusFilter(btn.dataset.statusFilter));
    });
    el.querySelector("#status-filter-clear")?.addEventListener("click", clearStatusFilters);
  }

  function renderValueIconKey() {
    const el = document.getElementById("value-icon-key");
    if (!el) return;
    const totalActive = state.iconFilters.length + state.statusFilters.length + (state.kpiFilter ? 1 : 0);
    const hint = totalActive
      ? `<button type="button" class="icon-filter-clear" id="icon-filter-clear">Clear all filters (${totalActive})</button>`
      : "";
    const kpiKey = resolveKpiFilterKey(state.kpiFilter);
    const kpiBanner = kpiKey
      ? `<div class="kpi-project-filter-banner" id="kpi-project-filter-banner" role="status">
          <span>Showing projects that impact <span class="kpi-filter-name">${escapeHtml(kpiFilterLabel(kpiKey))}</span>${/^#\d{2}$/.test(kpiKey) ? ` · ${escapeHtml(kpiKey)}` : ""}</span>
          <button type="button" class="icon-filter-clear" id="kpi-filter-clear">Clear KPI filter</button>
        </div>`
      : "";
    el.innerHTML = `${kpiBanner}<span class="value-icon-key-title">Filter by value <span class="tab-help" data-help-title="Filter by value" data-help-desc="Filter by value icon, check projects into your cart, read details, then Review Plan for fees, payment options, and next steps." aria-label="How to use value filters">?</span></span>${hint}` +
      VALUE_ICON_DEFS.map(d => {
        const active = state.iconFilters.includes(d.id) ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn key-filter-${d.id}${active}" data-icon-filter="${d.id}" title="Show projects that add ${escapeHtml(d.label)} value">${valueIconMarkup(d)}<span class="key-item-meta"><span class="key-item-label">${escapeHtml(d.label)}</span></span></button>`;
      }).join("");
    el.querySelectorAll(".key-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleIconFilter(btn.dataset.iconFilter);
      });
    });
    el.querySelector("#icon-filter-clear")?.addEventListener("click", clearOutlineFilters);
    el.querySelector("#kpi-filter-clear")?.addEventListener("click", clearKpiFilter);
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
    setActiveViewTab("kpis");
    renderViewLayout();
    requestAnimationFrame(() => {
      window.KPI_REPORT?.focusKpi?.(id);
    });
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
    const sorted = sortInvoiceRowsRequiredFirst(rows);
    const order = new Map(sorted.map((row, i) => [row.id, i]));
    const withMeta = sorted.map(row => {
      const item = findProjectById(row.id);
      return {
        ...row,
        parentId: item?.parentId || null,
        priority: item?.priority ?? 99
      };
    });
    return nestChildrenUnderParents(withMeta, (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  /** Required (lock) rows first in Pav Priorities cart / invoice lists, then by fit score. */
  function sortInvoiceRowsRequiredFirst(rows) {
    return [...rows].sort((a, b) => {
      const aRet = a.id === "RETAINER";
      const bRet = b.id === "RETAINER";
      const aItem = aRet ? RETAINER : findProjectById(a.id);
      const bItem = bRet ? RETAINER : findProjectById(b.id);
      const aReq = aItem ? isRequiredProject(aItem, aRet) : false;
      const bReq = bItem ? isRequiredProject(bItem, bRet) : false;
      if (aReq !== bReq) return aReq ? -1 : 1;
      if (aRet !== bRet) return aRet ? -1 : 1;
      const aScore = aItem && !aReq ? computeProjectScore({ ...aItem, isRetainer: aRet }) : -999;
      const bScore = bItem && !bReq ? computeProjectScore({ ...bItem, isRetainer: bRet }) : -999;
      if (aScore !== bScore) return bScore - aScore;
      return (aItem?.priority ?? 99) - (bItem?.priority ?? 99);
    });
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
    answerRate: 0.72,
    consultToRetained: 0.51,
    leadToCaseRate: 9 / 124,
    /* MyCase Client mean fee — CLIENT-VALUE-BASELINE.md · as of 2026-07-25 */
    avgCaseFee: 5587,
    /** May–Jun 2026 avg Search calls — Guide channelMonths */
    monthlySearchCallsBaseline: 89,
    /** May–Jun 2026 avg total leads Search+LSA+forms */
    monthlyLeadsBaseline: 169
  };

  /** KPI labels + tracking quality for impact list (ICON_KPI_MAP + live report names). */
  const KPI_IMPACT_META = {
    "#01": { name: "Total leads", tracking: "Clean — Search + LSA + HubSpot forms when all three exports are current." },
    "#02": { name: "New cases", tracking: "Clean — MyCase Client Created-date count." },
    "#03": { name: "Auto Cases", tracking: "Partial — MyCase auto signed stack vs annual goal of 50." },
    "#05": { name: "Key Channel Activity", tracking: "Partial — cases / leads / spend channel stack." },
    "#06": { name: "Pipeline / CRM completeness", tracking: "Partial — depends on HubSpot field hygiene and deal stage use." },
    "#07": { name: "Spend Waste", tracking: "Modeled excess LSA cash paid versus the same response volume at digital Search cost per response." },
    "#08": { name: "Campaign cost efficiency", tracking: "Clean for digital Search cost ÷ calls; not LSA." },
    "#09": { name: "Intake conversion", tracking: "Partial — needs consistent consult booking and outcome logging." },
    "#10": { name: "Lead channel mix", tracking: "Clean once #01 channel stack is reconciled monthly." },
    "#11": { name: "Organic / local search presence", tracking: "Partial — rankings and GBP metrics need scheduled pulls." },
    "#12": { name: "Avg. Cost per Direct Contact", tracking: "Search media + HubSpot forms fee (+ Yelp ad spend when wired) ÷ Search calls + form submits + Yelp leads. Target ceiling = LSA avg call cost." },
    "#14": { name: "Creative / channel response", tracking: "Partial — creative tests need UTM or asset labels to attribute cleanly." },
    "#15": { name: "Cost per lead", tracking: "Clean when spend and lead definition match the same window." },
    "#16": { name: "Reviews by channel", tracking: "Partial until Digital Profiles Refresh wires directory scrapes into DATA.reviews." },
    "#17": { name: "Referral Network", tracking: "Proxy until referral tracking is live in HubSpot/MyCase." },
    "#18": { name: "Website / SEO contribution", tracking: "Partial — form + organic attribution depends on GA4/UTM setup." },
    "#19": { name: "Missed Opportunity", tracking: "Directional potential revenue not earned — missed Search calls × lead→case × avg fee; not booked cash." },
    "#20": { name: "CRM follow-up discipline", tracking: "Partial — task completion and owner fields must stay filled." },
    "#21": { name: "Answered Calls", tracking: "Clean — Call details Received vs Missed for Search; LSA status separate." },
    "#22": { name: "Speed to lead", tracking: "Partial — needs HubSpot workflow timestamps." },
    "#28": { name: "Avg case fee", tracking: "Clean — MyCase Client contracted mean; not cash collected." },
    "#30": { name: "Cost per Case", tracking: "Firm-wide — Search + LSA media + management retainer + HubSpot forms + Referral Sites ÷ new cases on complete months. Known stack only. Prior installment subscriptions ≥$20k YTD not fully visible. Not by channel." },
    "#31": { name: "Cost per signed case", tracking: "By channel when Lead Source on hire — spend ÷ signed cases." },
    "#32": { name: "Channel ROI", tracking: "Hold until measured signed ÷ leads per channel." },
    "#23": { name: "Intake coverage / after-hours", tracking: "Partial — needs routing logs and after-hours disposition." },
    "#27": { name: "Ops backlog / open tasks", tracking: "Partial — HubSpot task queues when owners and due dates are used." },
    "#28": { name: "Avg case fee", tracking: "Clean — MyCase Client mean fee baseline." }
  };

  function getCartSelectionItems() {
    const items = [];
    if (state.retainer) items.push({ ...RETAINER, isRetainer: true });
    getMaintenanceProjects().forEach(p => {
      if (state.projects.has(p.id)) items.push({ ...p, isRetainer: false });
    });
    getSelectedProjects().forEach(p => items.push({ ...p, isRetainer: false }));
    return items;
  }

  function normalizeKpiRef(id) {
    const raw = String(id || "").trim();
    if (!raw) return "";
    if (/^#\d{2}$/.test(raw)) return raw;
    const m = raw.match(/(\d{2})/);
    return m ? `#${m[1]}` : "";
  }

  function projectTimelineLabel(item) {
    if (!item) return "2–4 weeks setup";
    if (item.timeline && String(item.timeline).trim()) return String(item.timeline).trim();
    if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return "Ongoing monthly";
    if (item.enabler) return "1–3 weeks setup · then ongoing ops";
    return "2–4 weeks setup · then measure in following 30 days";
  }

  function projectImpactBlurb(item) {
    const brief = briefValueAdd(item);
    if (brief) return brief;
    const bullets = valueAddedBullets(item);
    if (bullets[0]) return String(bullets[0]).replace(/^Deliverable:\s*/i, "").trim();
    if (item.tldr) return String(item.tldr).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
    if (item.goal) return String(item.goal).replace(/\s+/g, " ").trim().slice(0, 160);
    return item.title || item.id;
  }

  function itemHasHubspotIcon(item) {
    return getValueIcons(item).some(i => i.id === "hubspot");
  }

  /** Replaces former "HS:" title prefix with the HubSpot value badge. */
  function hubspotTitleMarkHtml(item) {
    if (!itemHasHubspotIcon(item)) return "";
    const def = VALUE_ICON_DEFS.find(d => d.id === "hubspot");
    if (!def) return "";
    return `<span class="toc-hubspot-mark">${valueIconMarkup(def)}</span>`;
  }

  function kpiIdsForProject(item) {
    const ids = new Set();
    (item.kpiRefs || []).forEach(ref => {
      const id = normalizeKpiRef(ref);
      if (id) ids.add(id);
    });
    getValueIcons(item).forEach(icon => {
      (ICON_KPI_MAP[icon.id] || []).forEach(kpi => {
        const id = normalizeKpiRef(kpi);
        if (id) ids.add(id);
      });
    });
    const text = `${item.estimatedLeads || ""} ${item.goal || ""} ${item.tldr || ""}`;
    const re = /#(\d{2})/g;
    let m;
    while ((m = re.exec(text))) ids.add(`#${m[1]}`);
    return [...ids];
  }

  /** Selected projects → impacted KPIs with impact, timeline, tracking quality. */
  function buildActionItems(selectionItems) {
    const items = selectionItems || getCartSelectionItems();
    if (!items.length) return [];

    const byKpi = new Map();
    items.forEach(item => {
      kpiIdsForProject(item).forEach(kpiId => {
        if (!byKpi.has(kpiId)) byKpi.set(kpiId, []);
        byKpi.get(kpiId).push(item);
      });
    });

    const rows = [...byKpi.entries()]
      .sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)))
      .slice(0, 14)
      .map(([kpi, projects]) => {
        const meta = KPI_IMPACT_META[kpi] || { name: kpi, tracking: "Partial — confirm source export before treating as contractual." };
        const titles = projects.map(p => p.title).filter(Boolean);
        const blurbs = projects.map(projectImpactBlurb).filter(Boolean);
        const impact = blurbs.length
          ? `${titles.join("; ")} — ${blurbs.slice(0, 2).join("; ")}`
          : `${titles.join("; ")} support this metric through the selected scope.`;
        const timelines = [...new Set(projects.map(projectTimelineLabel))];
        return {
          kpi,
          name: meta.name,
          impact,
          timeline: timelines.join(" · "),
          tracking: meta.tracking,
          projectIds: projects.map(p => p.id),
          text: `${meta.name}: ${impact}`,
          source: "kpi"
        };
      });

    return rows;
  }

  function buildActionItemsHtml(actions) {
    if (!actions || !actions.length) {
      return `<h3>KPIs impacted by the selected projects</h3>
        <p class="action-items-intro">Add projects to see which account KPIs this plan is built to move, how, and how cleanly they track.</p>
        <p class="kpi-impact-empty">No projects selected yet.</p>`;
    }
    const list = actions.map(a => {
      const label = a.name ? `${a.kpi} ${a.name}` : a.kpi;
      return `<li class="kpi-impact-item">
        <div class="kpi-impact-head"><span class="kpi-stat-id">${escapeHtml(a.kpi)}</span> ${escapeHtml(a.name || a.kpi)}</div>
        <p class="kpi-impact-how">${escapeHtml(a.impact || a.text || "")}</p>
        <p class="kpi-impact-meta"><span class="kpi-impact-label">Timeline</span> ${escapeHtml(a.timeline || "—")}
        <span class="kpi-impact-sep">·</span>
        <span class="kpi-impact-label">Tracking</span> ${escapeHtml(a.tracking || "—")}</p>
      </li>`;
    }).join("");
    return `<h3>KPIs impacted by the selected projects</h3>
      <p class="action-items-intro">Account KPIs tied to your selected projects via value icons and KPI links — impact path, timeline, and tracking quality.</p>
      <ul class="kpi-action-list kpi-impact-list" aria-label="KPIs impacted by the selected projects">${list}</ul>`;
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
    html += `<p class="confirm-next-foot">After submit: Andrew receives a private link for the fixed SOW. After he signs, Gilded Goose receives a separate countersign link. PDF copies are emailed and the final version is archived in Drive.</p>`;
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
    const estEl = document.getElementById("confirm-estimated-results");
    if (estEl) {
      estEl.innerHTML = "";
      estEl.hidden = true;
    }
    const payEl = document.getElementById("confirm-payment-options-body");
    if (payEl) payEl.innerHTML = buildPaymentOptionsHtml();
    updateInvoiceScheduleAmount();
  }

  function formatActionItemsText(actions) {
    if (!actions || !actions.length) return "(none)";
    return actions.map(a => {
      const head = a.name ? `${a.kpi} ${a.name}` : a.kpi;
      const impact = a.impact || a.text || "";
      const timeline = a.timeline ? ` | Timeline: ${a.timeline}` : "";
      const tracking = a.tracking ? ` | Tracking: ${a.tracking}` : "";
      return `  ${head}: ${impact}${timeline}${tracking}`;
    }).join("\n");
  }

  function openProjectDescription(id) {
    if (!id) return;
    if (id !== "RETAINER") {
      const item = findProjectById(id);
      if (item && isPlanningPublish(item)) {
        requestAnimationFrame(() => {
          document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
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
    const nonCampaignIds = new Set(["RETAINER", "GabrielOut", "OpsDash", "DataMgmt", "StackAudit", "HsPipe", "WebSpeed", "WasteAud", "DigProf"]);
    if (item.isRetainer || nonCampaignIds.has(item.id))
      return { value: null, label: "No direct leads", isCalls: false };
    if (item.id === "HsVoip") {
      const baselineCalls = PAV_HISTORICAL.monthlySearchCallsBaseline;
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

  function wipBadgeHtml(item) {
    if (item.status === "completed") return "";
    if (item.status === "wip" || hasPartialProgress(item)) {
      return `<span class="badge badge-wip card-wip-badge" title="Work already started on this project">WIP</span>`;
    }
    return "";
  }

  function cardCheckColHtml(item, isRetainer, required, sel, chkDisabled, abPending) {
    const id = item.id;
    const reqMark = required ? requiredMarkerHtml(item, isRetainer) : "";
    const abTitle = abPending ? ' title="Blocked: answer before cart"' : "";
    return `<div class="card-check-col">
      <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer"' : ""}${chkDisabled}${abTitle} ${sel ? "checked" : ""}>
      ${reqMark}
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

  /** Prefer a short bullet list from Value Added + Description (deduped). */
  function conciseDescriptionBullets(item) {
    const seen = new Set();
    const out = [];
    const push = raw => {
      let t = cleanBusinessText(String(raw || "").replace(/^Deliverable:\s*/i, "").trim());
      t = t.replace(/^[-•*]\s*/, "").trim();
      if (!t || isExecutionBlurb(t)) return;
      const key = t.toLowerCase().replace(/\s+/g, " ").slice(0, 72);
      if (seen.has(key)) return;
      seen.add(key);
      out.push(t);
    };

    valueAddedBullets(item).forEach(push);

    const desc = fullDescriptionText(item);
    if (desc) {
      const lines = String(desc)
        .split(/\n+/)
        .map(l => l.replace(/^[-•*\d.)\s]+/, "").trim())
        .filter(Boolean);
      if (lines.length > 1) {
        lines.forEach(push);
      } else if (!out.length) {
        const sents = String(desc).match(/[^.!?]+[.!?]+/g) || [desc];
        sents.slice(0, 4).forEach(s => push(s.trim()));
      } else {
        const sents = String(desc).match(/[^.!?]+[.!?]+/g) || [];
        sents.slice(0, 2).forEach(s => {
          const t = s.trim();
          const overlap = out.some(b => {
            const a = b.toLowerCase().slice(0, 32);
            const c = t.toLowerCase().slice(0, 32);
            return a && c && (b.toLowerCase().includes(c) || t.toLowerCase().includes(a));
          });
          if (!overlap) push(t);
        });
      }
    }

    if (!out.length) {
      const tldr = itemTldr(item);
      if (tldr) push(tldr);
    }

    return out.slice(0, 6);
  }

  function conciseDescriptionBulletsHtml(item) {
    const bullets = conciseDescriptionBullets(item);
    if (!bullets.length) return "";
    return `<ul class="card-objectives card-summary-bullets">${bullets.map(b =>
      `<li>${mdLinksToHtml(b)}</li>`
    ).join("")}</ul>`;
  }

  function progressHtml(item) {
    const done = (item.completedItems || []).map(t =>
      `<li><span class="progress-check done" aria-hidden="true">✓</span><span>${escapeHtml(t)}</span></li>`
    ).join("");
    const todo = (item.inProgressItems || []).map(t =>
      `<li><span class="progress-check open" aria-hidden="true"></span><span>${escapeHtml(t)}</span></li>`
    ).join("");
    if (!done && !todo) return "";
    return `<div class="progress-split card-progress-lists">
      ${todo ? `<div class="progress-col progress-todo"><h4>To Do</h4><ul class="progress-list">${todo}</ul></div>` : ""}
      ${done ? `<div class="progress-col progress-completed"><h4>Completed</h4><ul class="progress-list">${done}</ul></div>` : ""}
    </div>`;
  }

  function descriptionHtml(item) {
    const progress = progressHtml(item);
    return `<div class="card-summary card-merged-desc">
      ${conciseDescriptionBulletsHtml(item)}
      ${progress ? `<div class="card-progress-under">${progress}</div>` : ""}
    </div>`;
  }

  function marketingEducationToHtml(text) {
    if (!text) return "";
    return projectTextToHtml(String(text))
      .split(/\n\n+/)
      .map(p => `<p>${p.trim()}</p>`)
      .join("");
  }

  function expandBtnLabel(item, exp) {
    const chevron = `<span class="expand-btn-chevron" aria-hidden="true">${exp ? "▴" : "▾"}</span>`;
    if (exp) return `${chevron}<span class="expand-btn-text">Hide current status</span>`;
    return `${chevron}<span class="expand-btn-text">Expand for current status</span>`;
  }

  function cardDetailBodyHtml() {
    return "";
  }

  function cardFeaturedImageHtml(item) {
    const src = item.featuredImage && String(item.featuredImage).trim();
    if (!src) return "";
    return `<img class="card-featured-image" src="${escapeHtml(src)}" alt="" loading="lazy">`;
  }

  function cardReferenceLinkHtml() {
    return "";
  }

  function closeAllCommentPopovers() {
    document.querySelectorAll(".research-comment-popover").forEach(el => {
      el.hidden = true;
    });
    document.querySelectorAll(".research-comment-tag").forEach(btn => btn.setAttribute("aria-expanded", "false"));
  }

  function toggleCommentPopover(id, root) {
    const scope = root || document;
    const pop = scope.querySelector(`.research-comment-popover[data-id="${id}"]`);
    const btn = scope.querySelector(`.research-comment-tag[data-id="${id}"]`);
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
    scope.querySelectorAll(`.research-comment-tag[data-id="${id}"]`).forEach(btn => {
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
      noteEntries.forEach(([id, text]) => {
        const title = findProjectById(id)?.title || id;
        lines.push(`  ${title}: ${text}`);
      });
    } else {
      lines.push("  (none)");
    }
    lines.push("", "Projects selected:");
    (payload.projects || []).forEach(p => lines.push(`  • ${p.title} — ${p.fee}`));
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
      .replace(/\*\*([^*]+)\*\*/g, "$1");
    return s;
  }

  function isRequiredMaintenance(item, isRetainer) {
    return isRequiredProject(item, isRetainer);
  }

  function ensureRequiredMaintenance() {
    if (isRequiredProject(RETAINER, true)) {
      state.retainer = true;
      state.recommended.add("RETAINER");
    }
    PROJECTS.forEach(p => {
      if (!isRequiredProject(p, false)) return;
      trySetProjectInCart(p.id, true, { silent: true });
      if (state.projects.has(p.id)) state.recommended.add(p.id);
    });
  }

  function isInRecommendedPackage(item) {
    return isIndexDefaultSelected(item, !!item.isRetainer);
  }

  /** Fresh cart from INDEX Status: Required (locked) + Recommended. */
  function applyIndexDefaultSelections() {
    if (isIndexDefaultSelected(RETAINER, true)) {
      state.retainer = true;
      state.recommended.add("RETAINER");
    }
    PROJECTS.forEach(p => {
      if (!isIndexDefaultSelected(p, false)) return;
      if (isCompletedStatus(p) || isPlanningPublish(p)) return;
      trySetProjectInCart(p.id, true, { silent: true });
      if (state.projects.has(p.id)) state.recommended.add(p.id);
    });
    ensureRequiredMaintenance();
  }

  function applyRecommendedPackage() {
    applyIndexDefaultSelections();
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
    /* Keep children under their parent — do not flat re-sort the nested list. */
    return out;
  }

  /**
   * Keep parentId children directly under their parent after a flat sort.
   * Orphans (parent missing from this list) keep their sorted position among roots.
   */
  function nestChildrenUnderParents(items, compareFn) {
    const list = Array.isArray(items) ? items.slice() : [];
    if (list.length < 2) return list;
    const cmp = typeof compareFn === "function"
      ? compareFn
      : (a, b) => (a.priority ?? 99) - (b.priority ?? 99);
    const byId = new Map(list.map(item => [item.id, item]));
    const childrenOf = new Map();
    const roots = [];
    list.forEach(item => {
      const pid = item.parentId;
      if (pid && byId.has(pid)) {
        if (!childrenOf.has(pid)) childrenOf.set(pid, []);
        childrenOf.get(pid).push(item);
        return;
      }
      roots.push(item);
    });
    roots.sort(cmp);
    const out = [];
    roots.forEach(root => {
      out.push(root);
      const kids = (childrenOf.get(root.id) || []).slice().sort(cmp);
      out.push(...kids);
    });
    return out;
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
    }).filter(item => itemMatchesOutlineFilters(item));
  }

  function ensureClientPriorityIds(baseItems) {
    /* Seed reorder list from current score ranks (not stale INDEX Project score). */
    const pool = tocSortableItems();
    const scoreMap = buildUniqueTocPriorityMap(pool);
    const scoreSorted = sortTocItems(pool, scoreMap);
    const items = baseItems || scoreSorted;
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
    const flat = [...items].sort((a, b) => {
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
    /* Client reorder is explicit row order — do not regroup under parents. */
    if (useClientOrder || state.priorityEdit) return flat;
    const order = new Map(flat.map((item, i) => [item.id, i]));
    return nestChildrenUnderParents(flat, (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  /** Collapsed TOC still shows every selected project (and its HubSpot parent if needed). */
  function visibleTocItems(items) {
    if (state.tocExpanded || state.priorityEdit || items.length <= 5) return items;
    const keep = new Set();
    items.slice(0, 5).forEach(item => keep.add(item.id));
    items.forEach(item => {
      if (!isItemSelected(item)) return;
      keep.add(item.id);
      if (item.parentId) keep.add(item.parentId);
    });
    /* Keep already-included parents’ children that were in the opening slice. */
    items.forEach((item, idx) => {
      if (idx < 5 && item.parentId && keep.has(item.parentId)) keep.add(item.id);
    });
    return items.filter(item => keep.has(item.id));
  }

  function gilbertRankedPicks(limit) {
    const goal = state.goalText.trim();
    const pool = getAllItems().filter(item => {
      if (isCompletedStatus(item)) return false;
      if (isRequiredProject(item, !!item.isRetainer)) return false;
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
          score += Math.max(0, computeProjectScore(item)) * 0.5;
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
    /* Gilbert's picks live only in Pav Priorities (do-next-panel). */
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
    const visibleItems = visibleTocItems(items);
    listEl.innerHTML = visibleItems.map(item => {
      const selected = isItemSelected(item);
      const inPkg = isInRecommendedPackage(item);
      const isRetainer = !!item.isRetainer || item.id === "RETAINER";
      const required = isRequiredMaintenance(item, isRetainer);
      const chkDisabled = required ? " disabled" : "";
      const abPending = hasAbQuestions(item) && !abQuestionAnswered(item.id);
      const abTitle = abPending ? ' title="Blocked: answer before cart"' : "";
      const chkClass = isRetainer ? "toc-proj-chk" : "proj-chk toc-proj-chk";
      const statusNorm = normalizeStatus(item);
      const statusRowClass =
        statusNorm === "recommended"
          ? " toc-status-recommended"
          : statusNorm === "wip"
            ? " toc-status-wip"
            : "";
      return `<tr class="toc-item${selected ? " row-selected" : ""}${inPkg ? " row-package" : ""}${isPlanningPublish(item) ? " toc-planning" : ""}${statusRowClass}${state.priorityEdit ? " toc-prio-editing" : ""}" data-id="${item.id}" data-retainer="${isRetainer}" data-required="${required}" data-status="${statusNorm}">
        <td class="toc-col-select">
          <input type="checkbox" class="${chkClass}" data-id="${escapeHtml(item.id)}" aria-label="Add ${escapeHtml(item.title)} to plan"${chkDisabled}${abTitle} ${selected ? "checked" : ""}>
        </td>
        <td class="toc-col-project toc-title"><div class="toc-title-row"><a href="#project-${item.id}" title="${escapeHtml(item.title)}">${hubspotTitleMarkHtml(item)}${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a><span class="toc-value">${valueIconsHtml(item)}</span></div></td>
      </tr>`;
    }).join("");
    const editBtn = document.getElementById("toc-priority-edit");
    if (editBtn) {
      editBtn.textContent = state.priorityEdit ? "Done" : "Reorder scores";
      editBtn.setAttribute("aria-pressed", state.priorityEdit ? "true" : "false");
      editBtn.title = state.priorityEdit
        ? "Finish reordering project scores"
        : "Reorder projects for your preferred project score";
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
      const total = allItemsByPriority().filter(item => {
        if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return true;
        return !isCompletedStatus(item);
      }).length;
      const shown = items.length;
      const parts = [];
      if (state.statusFilters.length) {
        parts.push(`status: ${state.statusFilters.map(statusFilterLabel).join(", ")}`);
      }
      if (state.iconFilters.length) parts.push("value icons");
      if (state.kpiFilter) parts.push(`KPI ${kpiFilterLabel(state.kpiFilter)}`);
      statusEl.textContent = parts.length && shown !== total
        ? `Showing ${shown} of ${total} projects · ${parts.join(" · ")}`
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
    const label = String(item.estCostLabel || "").trim();
    if (label && label !== "—" && label !== "-") return label;
    if (item.ongoingFee) return `${fmt(item.fee)} + ${fmt(item.ongoingFee)}`;
    if (item.perCampaignFee) return `${fmt(item.fee)} per campaign`;
    if (item.monthlyOnly || item.id === "RETAINER" || item.id === "DataMgmt") return `${fmt(item.fee)}/mo`;
    return fmt(item.fee);
  }

  function marketFeeLabel(item) {
    if (item.feeEstimate == null || !Number.isFinite(Number(item.feeEstimate))) return "";
    const unit = item.feeEstimateUnit === "mo" ? "/mo" : "";
    let s = `${fmt(item.feeEstimate)}${unit}`;
    if (item.feeEstimateOngoing) s += ` + ${fmt(item.feeEstimateOngoing)}/mo`;
    return s;
  }

  /** Quote fee only — market fee estimate / calculation is not shown on Guide. */
  function feeCellHtml(itemOrProp) {
    const item = itemOrProp && itemOrProp.id ? itemOrProp : null;
    const quote = item ? feeLabelFor(item) : String(itemOrProp?.fee || itemOrProp || "—");
    return escapeHtml(quote);
  }

  function feeQuoteLineHtml(item) {
    return `<div class="card-fee-quote">${escapeHtml(feeLabelFor(item))}</div>`;
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
    if (!itemMatchesOutlineFilters(item) && !selected) classes.push("filtered-out");
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
      applyIndexDefaultSelections();
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
    resetBestFitSession();
    document.getElementById("goal-input").value = "";
    state.goalText = "";
    state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
    state.iconFilters = [];
    state.statusFilters = [];
    state.projects = new Set();
    state.recommended = new Set();
    state.doNextVisible = false;
    applyIndexDefaultSelections();
    renderGilbertChat();
    renderOutlineFilters();
    suggestPlan(true);
  }

  function renderFilterStatus() {
    /* status shown via search suggestions + invoice summary */
  }

  const CART_STORAGE_KEY = "pav-project-picker-v3";

  function loadState() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        applyIndexDefaultSelections();
        return;
      }
      const saved = JSON.parse(raw);
      /* Notes / email / survey may persist. Cart always resets to INDEX Required +
         Recommended so Best Fit and the invoice stay the same project set. */
      state.notes = saved.notes || {};
      sanitizeCartForAbQ();
      state.submitterEmail = saved.submitterEmail || "";
      if (state.submitterEmail) document.getElementById("submitted-email").value = state.submitterEmail;
      if (saved.invoicePaymentMonths != null) {
        let monthsVal = String(saved.invoicePaymentMonths);
        const monthsNum = Number(monthsVal);
        if (monthsNum > 12) monthsVal = "12";
        state.invoicePaymentMonths = monthsVal;
        const monthsEl = document.getElementById("invoice-payment-months");
        if (monthsEl) monthsEl.value = monthsVal;
      }
      updateInvoiceScheduleAmount();
      /* Ask Gilbert word cloud + derived goal are session-only — clear on every refresh. */
      state.goalText = "";
      state.surveyDone = false;
      state.cloudSelected = new Set();
      state.cloudOpen = new Set();
      if (Array.isArray(saved.gilbertChat) && saved.gilbertChat.length) {
        state.gilbertChat = saved.gilbertChat;
      }
      if (Array.isArray(saved.iconFilters)) {
        state.iconFilters = saved.iconFilters.filter(f => f && f !== "account-data");
      }
      if (Array.isArray(saved.statusFilters)) {
        state.statusFilters = saved.statusFilters.filter(f => STATUS_FILTER_DEFS.some(d => d.id === f));
      }
      if (saved.kpiFilter) {
        state.kpiFilter = resolveKpiFilterKey(saved.kpiFilter);
      }
      if (saved.doNextVisible != null) {
        state.doNextVisible = !!saved.doNextVisible;
      } else if (state.surveyDone || (Array.isArray(saved.gilbertChat) && saved.gilbertChat.some(m => m.role === "user"))) {
        state.doNextVisible = true;
      }
      /* Client reorder is session-only. Restoring it from localStorage kept the old
         Priority column after refresh and hid score ranking (+20 Recommended). */
      state.clientPriorityIds = [];
      if (saved.expanded) state.expanded = new Set(saved.expanded);
      if (saved.expandAll) allProjectIds().forEach(id => state.expanded.add(id));
      state.retainer = false;
      state.projects = new Set();
      applyIndexDefaultSelections();
    } catch (e) {}
    ensureRequiredMaintenance();
  }

  function saveState() {
    ensureRequiredMaintenance();
    state.submitterEmail = document.getElementById("submitted-email").value;
    syncPaymentTermsFromDom();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
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
      surveyStep: state.surveyStep,
      surveyAnswers: state.surveyAnswers,
      surveyDone: state.surveyDone,
      iconFilters: state.iconFilters,
      statusFilters: state.statusFilters,
      kpiFilter: state.kpiFilter,
      doNextVisible: state.doNextVisible,
      clientPriorityIds: state.clientPriorityIds
    }));
    try { localStorage.removeItem("pav-project-picker"); } catch (e) {}
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
    if (state.surveyDone && state.goalText.trim()) return true;
    return state.gilbertChat.some(m => m.role === "user" && String(m.text || "").trim());
  }

  function cloudCategory(catId) {
    return GILBERT_CLOUD.find(c => c.id === catId) || null;
  }

  function cloudKeyword(catId, kwId) {
    const cat = cloudCategory(catId);
    return cat ? (cat.keywords.find(k => k.id === kwId) || null) : null;
  }

  function selectedCloudKeywords() {
    const out = [];
    state.cloudSelected.forEach(key => {
      const [catId, kwId] = String(key).split(":");
      const kw = cloudKeyword(catId, kwId);
      if (kw) out.push(kw);
    });
    return out;
  }

  function buildCloudGoalText() {
    const picks = selectedCloudKeywords();
    if (!picks.length) return "";
    const labels = picks.map(p => p.label);
    const tags = picks.map(p => p.tags);
    return `Gilbert cloud: ${labels.join(" · ")}. Keywords: ${tags.join(" ")}`;
  }

  /** Live-apply the current word-cloud selection to goalText + best-fit ranking. */
  function applyCloudSelection() {
    const goal = buildCloudGoalText();
    state.goalText = goal;
    const goalInput = document.getElementById("goal-input");
    if (goalInput) goalInput.value = goal;
    if (goal) {
      activateBestFitSession();
      state.surveyDone = true;
      state.doNextVisible = true;
    } else {
      resetBestFitSession();
      state.surveyDone = false;
    }
    suggestPlan(true);
    renderGilbertSurvey();
    renderCondensedToc();
    renderDoNextPanel();
    renderPlanSummary();
    renderProjectToc();
  }

  /** Clear all cloud selections + open branches (also invoked on "Clear"). */
  function resetGilbertSurvey() {
    state.cloudSelected = new Set();
    state.cloudOpen = new Set();
    applyCloudSelection();
  }

  /** Deterministic organic-ish radial placement around the central Gilbert. */
  function cloudPositions(n) {
    const pos = [];
    for (let i = 0; i < n; i++) {
      const ang = (-90 + (360 / n) * i) * Math.PI / 180;
      const jitter = ((i * 37) % 11) - 5;
      const x = 50 + 40 * Math.cos(ang) + jitter * 0.45;
      const y = 50 + 34 * Math.sin(ang) + jitter * 0.35;
      pos.push({ x: Math.max(12, Math.min(88, x)), y: Math.max(12, Math.min(88, y)) });
    }
    return pos;
  }

  function renderGilbertSurvey() {
    const dock = document.getElementById("gilbert-priority-dock");
    if (dock && dock.hasAttribute("hidden")) return;
    const el = document.getElementById("gilbert-survey");
    if (!el) return;

    const coreSrc = "assets/gilbert-thinking.png?v=20260714h";
    const pos = cloudPositions(GILBERT_CLOUD.length);
    const catNodes = GILBERT_CLOUD.map((c, i) => {
      const open = state.cloudOpen.has(c.id);
      const count = c.keywords.filter(k => state.cloudSelected.has(`${c.id}:${k.id}`)).length;
      const sizeCls = c.size ? ` cloud-${c.size}` : "";
      const badge = count ? `<span class="gilbert-cloud-badge">${count}</span>` : "";
      return `<button type="button" class="gilbert-cloud-cat${sizeCls}${open ? " is-open" : ""}${count ? " has-sel" : ""}"
        data-cloud-cat="${escapeHtml(c.id)}" style="left:${pos[i].x}%;top:${pos[i].y}%"
        aria-expanded="${open ? "true" : "false"}">${escapeHtml(c.label)}${badge}</button>`;
    }).join("");

    const branches = GILBERT_CLOUD.filter(c => state.cloudOpen.has(c.id)).map(c => {
      const chips = c.keywords.map(k => {
        const sel = state.cloudSelected.has(`${c.id}:${k.id}`);
        return `<button type="button" class="gilbert-cloud-kw${sel ? " is-selected" : ""}"
          data-cloud-kw="${escapeHtml(c.id)}:${escapeHtml(k.id)}" aria-pressed="${sel ? "true" : "false"}">${escapeHtml(k.label)}</button>`;
      }).join("");
      return `<div class="gilbert-branch"><p class="gilbert-branch-label">${escapeHtml(c.label)}</p><div class="gilbert-branch-chips">${chips}</div></div>`;
    }).join("");

    const selCount = state.cloudSelected.size;
    const picks = selCount ? gilbertRankedPicks(3).map(p => p.title) : [];
    const infoLine = picks.length
      ? `<p class="gilbert-cloud-fits">Top fits: <strong>${picks.map(escapeHtml).join("</strong>, <strong>")}</strong></p>`
      : "";

    el.innerHTML = `
      <div class="gilbert-cloud" role="group" aria-label="Explore topics">
        <img class="gilbert-cloud-core" src="${coreSrc}" alt="" aria-hidden="true">
        ${catNodes}
      </div>
      ${branches ? `<div class="gilbert-cloud-branches">${branches}</div>` : ""}
      ${infoLine}
      ${selCount ? `<div class="gilbert-cloud-actions"><button type="button" class="btn-survey-ghost" data-cloud-action="clear">Clear (${selCount})</button></div>` : ""}`;
  }

  function bindGilbertSurvey() {
    const el = document.getElementById("gilbert-survey");
    if (!el || el.dataset.bound === "1") return;
    el.dataset.bound = "1";
    el.addEventListener("click", e => {
      const cat = e.target.closest("[data-cloud-cat]");
      if (cat) {
        const id = cat.getAttribute("data-cloud-cat");
        if (state.cloudOpen.has(id)) state.cloudOpen.delete(id);
        else state.cloudOpen.add(id);
        renderGilbertSurvey();
        return;
      }
      const kw = e.target.closest("[data-cloud-kw]");
      if (kw) {
        const key = kw.getAttribute("data-cloud-kw");
        if (state.cloudSelected.has(key)) state.cloudSelected.delete(key);
        else state.cloudSelected.add(key);
        applyCloudSelection();
        return;
      }
      const action = e.target.closest("[data-cloud-action]");
      if (action && action.getAttribute("data-cloud-action") === "clear") {
        resetGilbertSurvey();
      }
    });
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
    const ids = allProjectIds().filter(id => {
      if (id === "RETAINER") return true;
      const item = findProjectById(id);
      return item && !isPlanningPublish(item);
    });
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
    if (open) {
      allProjectIds().forEach(id => {
        if (id === "RETAINER") {
          state.expanded.add(id);
          return;
        }
        const item = findProjectById(id);
        if (item && isPlanningPublish(item)) return;
        state.expanded.add(id);
      });
    } else state.expanded.clear();
    saveState();
    renderAllCards();
  }

  function publishStatusBadgeHtml(item) {
    if (!isPlanningPublish(item)) return "";
    return `<span class="publish-status-badge" title="Research &amp; Planning">Research &amp; Planning</span>`;
  }

  function cardHtml(item, isRetainer, isFirstSelected) {
    const id = item.id;
    const required = isRequiredMaintenance(item, isRetainer);
    const sel = isRetainer ? state.retainer : state.projects.has(id);
    const unpublished = !isRetainer && isPlanningPublish(item);
    if (unpublished) state.expanded.delete(id);
    const exp = !unpublished && state.expanded.has(id);
    const extra = getItemFilterClasses(item, isRetainer);
    const pkgClass = isInRecommendedPackage({ ...item, isRetainer }) ? " package-included" : "";
    const iconsHtml = cardCornerIconsHtml(item, isRetainer, true) || "";
    const wipBadge = wipBadgeHtml(item);
    const retainerClass = isRetainer ? " retainer-card required-retainer" : "";
    const maintClass = item.monthlyOnly ? ` maintenance-card${required ? " required-maintenance" : ""}` : "";
    const subClass = item.parentId ? " card-sub-related" : "";
    const selFirst = isFirstSelected ? " selected-first" : "";
    const chkDisabled = required ? " disabled" : "";
    const mutedClass = isPlanningPublish(item) || isResearchStatus(item) || isCompletedStatus(item) ? " status-muted" : "";
    const planningClass = unpublished ? " publish-planning card-header-only" : "";
    const abPending = hasAbQuestions(item) && !abQuestionAnswered(id);
    const abClass = abPending ? " ab-q-pending" : (hasAbQuestions(item) ? " ab-q-cleared" : "");
    const wipStarted = !isRetainer && item.status !== "completed" && (normalizeStatus(item) === "wip" || hasPartialProgress(item));
    const wipClass = wipStarted ? " card-wip-started" : "";
    const statusNorm = normalizeStatus(item);
    const statusHighlightClass =
      statusNorm === "recommended"
        ? " card-status-recommended"
        : statusNorm === "wip"
          ? " card-status-wip"
          : "";

    if (unpublished) {
      return `
      <div class="card${maintClass}${subClass}${pkgClass}${selFirst}${mutedClass}${planningClass}${abClass}${wipClass}${statusHighlightClass} ${sel ? "selected" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}" data-ab-q="${hasAbQuestions(item) ? "1" : "0"}" data-publish="${normalizePublishStatus(item)}" data-status="${statusNorm}">
        <div class="card-header">
          ${cardCheckColHtml(item, isRetainer, required, sel, chkDisabled, abPending)}
            <div class="card-body">
              <div class="card-top-row">
                <div class="card-title">${escapeHtml(item.title)}${publishStatusBadgeHtml(item)}</div>
                ${wipBadge ? `<div class="card-title-icons">${wipBadge}</div>` : ""}
              </div>
            </div>
        </div>
      </div>`;
    }

    return `
      <div class="card${retainerClass}${maintClass}${subClass}${pkgClass}${selFirst}${mutedClass}${planningClass}${abClass}${wipClass}${statusHighlightClass} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}" data-ab-q="${hasAbQuestions(item) ? "1" : "0"}" data-publish="${normalizePublishStatus(item)}" data-status="${statusNorm}">
        <div class="card-header">
          ${cardCheckColHtml(item, isRetainer, required, sel, chkDisabled, abPending)}
            <div class="card-body">
              ${cardFeaturedImageHtml(item)}
              ${cardReferenceLinkHtml(item)}
              <div class="card-top-row">
                <div class="card-title">${escapeHtml(item.title)}${publishStatusBadgeHtml(item)}</div>
                ${wipBadge || iconsHtml ? `<div class="card-title-icons">${wipBadge}${iconsHtml}</div>` : ""}
              </div>
              ${feeQuoteLineHtml(item)}
              ${relatedSubHtml(item) ? `<div class="card-meta-row">${relatedSubHtml(item)}</div>` : ""}
              ${descriptionHtml(item)}
            <button type="button" class="expand-btn" aria-expanded="${exp ? "true" : "false"}">${expandBtnLabel(item, exp)}</button>
          </div>
        </div>
        <div class="card-detail">
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
    // Live cards first; Research & Planning (unpublished) always at bottom
    const maintLive = maintenance.filter(p => !isPlanningPublish(p));
    const maintPlan = maintenance.filter(p => isPlanningPublish(p));
    const optLive = optional.filter(p => !isPlanningPublish(p));
    const optPlan = optional.filter(p => isPlanningPublish(p));
    const visible = visibleOptionalProjects(optLive);
    const hidden = hiddenOptionalCount(optLive);
    let markedFirst = false;
    const projectCards = visible.map(p => {
      const sel = state.projects.has(p.id);
      const isFirst = sel && !markedFirst;
      if (isFirst) markedFirst = true;
      return cardHtml(p, false, isFirst);
    }).join("");
    const maintCards = maintLive.map(p => cardHtml(p, false, false)).join("");
    const showMoreBtn = hidden > 0
      ? `<div class="project-list-show-more"><button type="button" class="btn btn-secondary" id="show-more-projects">Show ${hidden} more project${hidden === 1 ? "" : "s"}</button></div>`
      : state.showAllProjects && optLive.length > PROJECT_LIST_LIMIT
        ? `<div class="project-list-show-more"><button type="button" class="btn btn-secondary" id="show-more-projects">Show fewer</button></div>`
        : "";
    const planCards = maintPlan.concat(optPlan).map(p => cardHtml(p, false, false)).join("");
    const planBlock = planCards
      ? `<div class="research-planning-list" role="group" aria-label="Research and Planning"><div class="research-planning-heading">Research &amp; Planning</div>${planCards}</div>`
      : "";
    list.innerHTML = cardHtml(RETAINER, true, true) + maintCards + projectCards + showMoreBtn + planBlock;
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
          showToast("Removed from cart — Blocked until Andrew's question is answered", true);
        }
        syncCommentTag(pid, root);
        saveState();
        updateSubmitButtons();
        renderAllCards();
        renderSummary();
      });
    });

    root.querySelectorAll(".research-comment-tag").forEach(btn => {
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
        applyCartCheckboxChange(id, chk.checked, chk);
      });
    });

    root.querySelectorAll(".card").forEach(card => {
      if (card.dataset.cardBound) return;
      card.dataset.cardBound = "1";
      card.addEventListener("click", e => {
        if (e.target.type === "checkbox" || e.target.classList.contains("expand-btn") || e.target.closest("a") || e.target.closest(".required-icon") || e.target.closest(".ab-q-flag") || e.target.closest(".project-note") || e.target.closest(".research-comment-tag") || e.target.closest(".research-comment-popover")) return;
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

  function isValidSubmitEmail(email) {
    const e = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function canSubmit() {
    const email = (document.getElementById("submitted-email") || {}).value || "";
    if (!isValidSubmitEmail(email)) return false;
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
    if (guideImg) {
      guideImg.src = GILBERT_LOGO;
      guideImg.alt = "Gilded Goose Ltd.";
    }
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
      depositAmount: paymentTerms.depositAmount != null && paymentTerms.depositAmount > 0
        ? paymentTerms.depositAmount
        : (CONFIG.depositAmount || null),
      depositPct: paymentTerms.depositPct != null ? paymentTerms.depositPct : null,
      paymentSurchargeRate: paymentTerms.surchargeRate != null ? paymentTerms.surchargeRate : null,
      paymentSurchargeAmount: paymentTerms.surchargeAmount != null ? paymentTerms.surchargeAmount : null,
      paymentFinancedRemaining: paymentTerms.financedRemaining != null ? paymentTerms.financedRemaining : null,
      paymentTotalDue: paymentTerms.totalDue != null ? paymentTerms.totalDue : null,
      paymentWithin30Days: paymentTerms.within30Days,
      paymentWithin60Days: paymentTerms.within60Days,
      quickbooksDepositUrl: CONFIG.quickbooksDepositUrl || null,
      signingBaseUrl: window.location.origin + window.location.pathname,
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
      nextStepsText: formatNextStepsText(),
      sowDraft: null,
      esignStatus: "pending"
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
    const hasIntake = selected.some(p => getValueIcons(p).some(v => v.id === "intake" || v.id === "crm"));
    const hasLeads = selected.some(p => getValueIcons(p).some(v => v.id === "leads"));
    const hasAnalytics = selected.some(p => getValueIcons(p).some(v => v.id === "efficiency"));
    const parts = [];

    parts.push(
      count === 1
        ? "This selection is a strong mix because it targets one bottleneck with work you can measure — not a scatter of vanity tactics."
        : `This ${count}-project mix is strong because the pieces reinforce each other: measurement, demand, and conversion are treated as one system.`
    );

    if (hasFoundation || hasAnalytics) {
      parts.push(
        "Foundation and reporting work first follows the same logic Google Ads and HubSpot inbound playbooks push: fix attribution and CRM truth before you scale spend, so CPL and answered-call rates mean something."
      );
    }
    if (hasLeads && hasIntake) {
      parts.push(
        "Pairing lead generation with intake closes the classic leak — paid clicks that never become answered consults. That is the same measurement-over-vanity stance used in accountable search programs: track calls and consults, not impressions alone."
      );
    } else if (hasLeads) {
      parts.push(
        "Lead-driving work here is framed around calls and consults you can audit in Call details and campaign exports — not awareness metrics that do not move signed matters."
      );
    } else if (hasIntake) {
      parts.push(
        "Intake and phone coverage protect the lead volume you already buy. Industry answer-rate targets and your own #21 / #19 stack make that measurable."
      );
    }
    if (payload.goalText) {
      const g = payload.goalText.trim();
      parts.push(`It also lines up with the problem you named for Gilbert: "${g.length > 120 ? g.slice(0, 120) + "…" : g}".`);
    }
    parts.push(
      "For a law firm, public creative still needs attorney review under advertising rules — this plan keeps execution on ops and measurement while compliance stays with Pav."
    );
    return parts.join(" ");
  }

  function buildSelectionImpactSummary(items) {
    const list = items || [];
    if (!list.length) {
      return "Add projects to see estimated lead and client impact for this plan.";
    }

    const valueBits = [];
    list.forEach(item => {
      const brief = briefValueAdd(item);
      if (brief) valueBits.push(brief);
      else {
        const bullets = valueAddedBullets(item);
        if (bullets[0]) {
          valueBits.push(String(bullets[0]).replace(/^Deliverable:\s*/i, "").trim());
        }
      }
    });
    const uniqueValue = [...new Set(valueBits.filter(Boolean))].slice(0, 3);

    let leadSum = 0;
    let leadProjects = 0;
    list.forEach(item => {
      const leads = estimateProjectLeadsGained(item);
      if (leads.value != null && leads.value > 0) {
        leadSum += leads.value;
        leadProjects += 1;
      }
    });
    const casesEst = leadSum * PAV_HISTORICAL.leadToCaseRate;
    const revenueEst = Math.round(casesEst * PAV_HISTORICAL.avgCaseFee);

    const parts = [];
    if (uniqueValue.length) {
      parts.push(
        uniqueValue.length === 1
          ? `Added value focus: ${uniqueValue[0]}.`
          : `Added value across this plan: ${uniqueValue.slice(0, -1).join("; ")}; and ${uniqueValue[uniqueValue.length - 1]}.`
      );
    } else {
      parts.push("This plan strengthens infrastructure, intake, and marketing so results compound month over month.");
    }

    if (leadSum > 0) {
      const leadLo = Math.max(1, Math.round(leadSum * 0.85));
      const leadHi = Math.max(leadLo, Math.round(leadSum * 1.15));
      const caseLo = Math.max(0.5, Math.round(casesEst * 10) / 10);
      const caseHi = Math.max(caseLo, Math.round(casesEst * 1.2 * 10) / 10);
      parts.push(
        `Estimated impact: about ${leadLo}–${leadHi} incremental leads/mo` +
        (leadProjects > 1 ? ` from ${leadProjects} lead-driving projects` : "") +
        `, or roughly ${caseLo === caseHi ? `~${caseLo}` : `${caseLo}–${caseHi}`} new clients/mo` +
        ` (~${fmt(revenueEst)}/mo potential fees at ${(PAV_HISTORICAL.leadToCaseRate * 100).toFixed(1)}% lead→case × ${fmt(PAV_HISTORICAL.avgCaseFee)} avg).`
      );
    } else {
      parts.push(
        "Lead volume is mostly indirect on these selections — impact shows up as better answer rates, cleaner tracking, and higher conversion of the ~124 leads/mo already in the funnel."
      );
    }

    return parts.join(" ");
  }

  function buildThankYouReturnsHtml(selected, includeRetainer) {
    const items = [];
    if (includeRetainer) items.push(RETAINER);
    sortByPriority(selected).forEach(p => items.push(p));
    const rows = items.map(item => {
      const signals = getReturnSignals(item);
      if (!signals.length) return "";
      return `<div class="thank-you-roi-item"><strong>${escapeHtml(item.title)}</strong><span class="thank-you-roi-signals">${signals.map(s => escapeHtml(s)).join(" · ")}</span></div>`;
    }).filter(Boolean);
    if (!rows.length) return "";
    return `<div class="thank-you-roi-box"><h3>Estimated return on these activities</h3>${rows.join("")}</div>`;
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
        return `I'd look at ${list} — but ${names} ${abBlocked.length === 1 ? "is" : "are"} Blocked for Andrew. Answer on ${abBlocked.length === 1 ? "that card" : "those cards"} before cart.`;
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
    activateBestFitSession();
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
      img.alt = `${GUIDE_NAME} — project fit survey`;
    }
    if (!state.gilbertChat.length) {
      state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
    }
    bindGilbertSurvey();
    renderGilbertSurvey();
    renderDoNextPanel();
  }

  function depositFromPayload(payload) {
    const p = payload || lastSubmittedPayload || {};
    return p.depositAmount != null ? p.depositAmount : CONFIG.depositAmount;
  }

  function showThankYou(payload) {
    const selected = getSelectedProjects();
    const depositAmt = depositFromPayload(payload);
    const depositUrl = CONFIG.quickbooksDepositUrl || payload.quickbooksDepositUrl;

    document.getElementById("thank-you-gilbert").src = GILBERT_SEAL;

    const noteEntries = Object.entries(payload.projectNotes || {});
    let notesHtml = "";
    if (noteEntries.length) {
      notesHtml += `<div class="thank-you-comments"><h3>Your comments</h3><ul class="thank-you-list">` +
        noteEntries.map(([id, text]) => {
          const title = findProjectById(id)?.title || id;
          return `<li><strong>${escapeHtml(title)}:</strong> ${escapeHtml(text)}</li>`;
        }).join("") + "</ul></div>";
    }

    const emailNote = payload.submitterEmail
      ? `<p class="confirm-note">Confirmation sent to <strong>${escapeHtml(payload.submitterEmail)}</strong> and Gilded Goose.</p>`
      : `<p class="confirm-note">Confirmation sent to Gilded Goose.</p>`;

    const signedNote = payload.esignStatus === "client_signed"
      ? `<p class="confirm-note">Andrew’s electronic signature is recorded. His PDF copy was emailed; Gilded Goose’s countersignature is next.</p>`
      : payload.esignStatus === "signed"
      ? `<p class="confirm-note">SOW signed electronically — copies emailed to you and Gilded Goose.</p>`
      : payload.esignStatus === "signed_local"
      ? `<p class="confirm-note">SOW signed in this browser — email via webhook failed; signed copy was downloaded. Gilded Goose will confirm from the Sheet.</p>`
      : "";

    const actionItemsHtml = `<div class="thank-you-action-items action-items-panel">${buildActionItemsHtml(payload.actionItems)}</div>`;

    const depositSummary = depositAmt
      ? `<div class="thank-you-deposit-line"><span class="thank-you-deposit-caption">Kickoff deposit due now</span><span class="deposit-amount">${fmt(depositAmt)}</span></div>`
      : "";

    document.getElementById("thank-you-body").innerHTML = `
      <div class="thank-you-affirm"><strong>Why this is a strong mix</strong>${escapeHtml(buildThankYouAffirmation(payload, selected))}</div>
      ${actionItemsHtml}
      ${depositSummary}
      ${notesHtml}
      ${emailNote}
      ${signedNote}`;

    const payBtn = document.getElementById("btn-pay-deposit");
    if (payBtn && depositUrl && depositAmt) {
      payBtn.href = depositUrl;
      payBtn.textContent = "Pay " + fmt(depositAmt) + " deposit — QuickBooks";
      payBtn.removeAttribute("aria-disabled");
      payBtn.classList.remove("btn-disabled");
      payBtn.style.display = "block";
    } else if (payBtn && depositAmt) {
      payBtn.removeAttribute("href");
      payBtn.textContent = "Pay " + fmt(depositAmt) + " deposit — link by email";
      payBtn.setAttribute("aria-disabled", "true");
      payBtn.classList.add("btn-disabled");
      payBtn.style.display = "block";
    } else if (payBtn) {
      payBtn.style.display = "none";
    }

    document.getElementById("thank-you").classList.add("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "false");
    hideSowPage();
    hideConfirmPage();
    document.getElementById("main-app").classList.add("hidden");
    document.querySelector(".pav-guide-ask-section")?.setAttribute("hidden", "");
    closeGilbertChat();
    window.scrollTo(0, 0);
  }

  /* ---- Fixed SOW + private, staged e-sign links ---- */

  const ESIGN_CONSENT_VERSION = "2026-07-17-v2";
  const CLIENT_SIGNER = "Andrew Brown";
  const CONSULTANT_SIGNER = "Kate Stannard";
  let activeSowSigning = null;
  let activeSowToken = "";
  let signedPdfBase64 = "";
  let signedPdfName = "Pav-Law-SOW-signed.pdf";

  function projectTitlesForSow(payload) {
    const titles = [];
    const p = payload || {};
    if (p.retainer && p.retainerTitle) titles.push(p.retainerTitle);
    (p.projects || []).forEach(proj => {
      if (proj && proj.title) titles.push(proj.title);
    });
    return titles;
  }

  function updateEsignStatusText(text) {
    const el = document.getElementById("sow-esign-status");
    if (el) el.textContent = text;
  }

  function setSowContinueEnabled(on) {
    const btn = document.getElementById("sow-continue-thankyou");
    const hint = document.getElementById("sow-continue-hint");
    if (btn) btn.disabled = !on;
    if (hint) {
      hint.textContent = on
        ? "Signed — continue to pay the QuickBooks deposit."
        : "Andrew signs first; Gilded Goose countersigns from a separate private link.";
    }
  }

  function clearSowChecks() {
    ["sow-check-reviewed", "sow-check-firm", "sow-check-individual", "sow-check-consent"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
  }

  function showSowPage(record) {
    if (!record || typeof record !== "object") {
      throw new Error("Private signing record is missing.");
    }
    activeSowSigning = record;
    lastSubmittedPayload = record.payload || null;
    const role = record.role || "client";
    const isClient = role === "client";
    const titles = projectTitlesForSow(record.payload || {});

    const intro = document.getElementById("sow-intro");
    if (intro) {
      intro.textContent = isClient
        ? "Private link for Andrew Brown. Review the fixed SOW, check each statement, then sign. Gilded Goose receives a separate private countersign link next."
        : "Private Gilded Goose countersign link. Review the SOW already signed by Andrew Brown, then countersign to finalize it.";
    }

    const doc = document.getElementById("sow-document");
    if (doc) doc.textContent = record.sowText || "Agreement unavailable.";

    const projList = document.getElementById("sow-project-list");
    if (projList) {
      projList.innerHTML = titles.length
        ? titles.map(title => `<li><strong>${escapeHtml(title)}</strong></li>`).join("")
        : `<li><em>No projects selected</em></li>`;
    }

    const payLine = document.getElementById("sow-payment-line");
    if (payLine) {
      const p = record.payload || {};
      const dep = p.depositAmount ? `${fmt(p.depositAmount)} deposit at kickoff` : "Deposit per payment terms";
      payLine.textContent = `${dep} · ${p.invoicePaymentTermsLabel || "invoice schedule per payment terms"}.`;
    }

    clearSowChecks();
    const signerName = document.getElementById("sow-signer-name");
    if (signerName) signerName.textContent = isClient ? CLIENT_SIGNER : CONSULTANT_SIGNER;
    const signRole = document.getElementById("sow-sign-role");
    if (signRole) {
      signRole.textContent = isClient
        ? "Andrew Brown signs once for Pav Law (as owner) and individually — both Co-Clients are jointly liable for fees."
        : "Kate Stannard countersigns for Gilded Goose Limited.";
    }

    const firmWrap = document.getElementById("sow-check-firm-wrap");
    const individualWrap = document.getElementById("sow-check-individual-wrap");
    if (firmWrap) firmWrap.hidden = !isClient;
    if (individualWrap) individualWrap.hidden = !isClient;
    const consentText = document.getElementById("sow-esign-consent-text");
    if (consentText) {
      consentText.textContent = isClient
        ? "I consent to transact electronically and intend this checkbox-and-button process to be my electronic signature, with the same effect as my handwritten signature."
        : "I, Kate Stannard, consent to transact electronically and intend this checkbox-and-button process to be my countersignature for Gilded Goose Limited.";
    }

    const signBtn = document.getElementById("sow-send-esign");
    if (signBtn) {
      signBtn.disabled = false;
      signBtn.textContent = isClient ? "Andrew Brown — sign fixed SOW" : "Kate Stannard — countersign fixed SOW";
    }
    const continueBtn = document.getElementById("sow-continue-thankyou");
    const continueHint = document.getElementById("sow-continue-hint");
    if (continueBtn) continueBtn.hidden = !isClient;
    if (continueHint) continueHint.hidden = !isClient;
    setSowContinueEnabled(false);

    const downloadBtn = document.getElementById("sow-download-copy");
    if (downloadBtn) downloadBtn.classList.remove("show");
    updateEsignStatusText("The signing link is single-use and expires " + (record.expiresAt || "after the signing period") + ".");

    document.getElementById("sow-page").classList.add("show");
    document.getElementById("sow-page").setAttribute("aria-hidden", "false");
    hideConfirmPage();
    document.getElementById("main-app").classList.add("hidden");
    document.querySelector(".pav-guide-ask-section")?.setAttribute("hidden", "");
    closeGilbertChat();
    window.scrollTo(0, 0);
  }

  function hideSowPage() {
    const el = document.getElementById("sow-page");
    if (!el) return;
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
  }

  /* ---- Local SOW preview (no live webhook) ---- */

  const LOCAL_SOW_TOKEN = "local-preview";

  function sowMoney(value) {
    return value != null && Number.isFinite(Number(value)) ? fmt(Number(value)) : null;
  }

  function buildLocalSowText(payload) {
    const data = payload || {};
    const titles = projectTitlesForSow(data);
    const lines = [
      "STATEMENT OF WORK",
      "Marketing and Business Operations Consulting",
      "",
      "Governed by: Master Services Agreement (MSA)",
      "Consultant: Gilded Goose Limited · Kate Stannard",
      "Co-Client 1: Pav Law · authorized signer Andrew Brown (Owner / Attorney)",
      "Co-Client 2: Andrew Brown · individually (jointly and severally liable with Pav Law)",
      "Notice address: 102 S Tejon St, Colorado Springs, CO 80903",
      "Governing law / venue: Colorado · El Paso County",
      "If Pav Law dissolves or cannot pay, Andrew Brown remains personally liable",
      "SOW prepared: " + new Date().toISOString(),
      "Client contact email: " + (data.submitterEmail || "[email]"),
      "",
      "————————————————————————",
      "1. SUMMARY",
      "",
      titles.length ? "Selected projects: " + titles.join("; ") + "." : "Selected projects: [none]."
    ];
    if (data.goalText) lines.push("Client goal note: " + data.goalText);
    lines.push("", "————————————————————————", "2. SCOPE — SELECTED PROJECT TITLES", "");
    if (titles.length) {
      titles.forEach((title, index) => lines.push((index + 1) + ". " + title));
    } else {
      lines.push("1. [projects]");
    }
    lines.push(
      "",
      "Change orders. Work outside this scope needs a written change order (email OK) with fee and schedule impact before Consultant proceeds.",
      "",
      "————————————————————————",
      "3. CLIENT RESPONSIBILITIES",
      "",
      "• Admin access, tools, and data within 3 business days of signing",
      "• Attorney advertising approval before any public publish/place",
      "• Feedback within twenty-four (24) hours for public-facing ad/content review, unless Client states a longer window",
      "• Pay Schedule A invoices on time",
      "",
      "————————————————————————",
      "4. FEES AND PAYMENT",
      "",
      "List / consulting subtotal: " + (data.projectsSubtotal || data.grandTotalNote || "$[___]"),
      "Deposit due at signing: " + (sowMoney(data.depositAmount) || "$[___]") +
        (data.depositPct != null ? " (" + Math.round(Number(data.depositPct) * 100) + "%)" : ""),
      "Remainder / invoice schedule: " + (data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "Per payment terms selected"),
      data.maintenanceMonthlyNum ? "Retainer / maintenance: " + data.maintenanceMonthly + "/mo, billed separately" : "Retainer / maintenance: none selected",
      "Media spend: Client direct to platforms",
      "Pass-through, handling, tax, and late charges: MSA Article 5",
      "",
      "————————————————————————",
      "5. SCHEDULE A — PAYMENT TERMS",
      "",
      data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "Per payment terms selected in the Project Guide.",
      data.paymentSurchargeAmount ? "Schedule surcharge: " + sowMoney(data.paymentSurchargeAmount) : "Schedule surcharge: none",
      data.paymentTotalDue != null ? "Total due on project schedule: " + sowMoney(data.paymentTotalDue) : "",
      "",
      "————————————————————————",
      "6. SIGNATURES",
      "",
      "This SOW is governed by the MSA between the Parties.",
      "",
      "Andrew Brown signs once in two capacities:",
      "• For Pav Law as owner / authorized signer (Co-Client 1)",
      "• Individually (Co-Client 2) — jointly and severally liable with Pav Law, including if Pav Law goes under",
      "",
      "Gilded Goose Limited countersigns through a separate private signing link.",
      "",
      "Status: Awaiting Andrew Brown electronic signature."
    );
    return lines.filter(line => line !== null && line !== undefined).join("\n");
  }

  function showLocalSowPreview(payload) {
    const record = {
      role: "client",
      payload,
      sowText: buildLocalSowText(payload),
      expiresAt: "when this browser tab is refreshed (local preview)",
      local: true
    };
    activeSowToken = LOCAL_SOW_TOKEN;
    showSowPage(record);
    updateEsignStatusText("Local preview — no live webhook configured. Review and sign here to preview the flow; nothing is emailed, logged, or archived.");
  }

  function signingChecks(role) {
    return {
      reviewed: !!document.getElementById("sow-check-reviewed")?.checked,
      firmAuthority: role === "client" ? !!document.getElementById("sow-check-firm")?.checked : true,
      individualCapacity: role === "client" ? !!document.getElementById("sow-check-individual")?.checked : true,
      electronicConsent: !!document.getElementById("sow-check-consent")?.checked
    };
  }

  function validateSigningChecks(checks, role) {
    if (!checks.reviewed) return "Check that you reviewed the complete fixed SOW.";
    if (role === "client" && !checks.firmAuthority) return "Andrew must confirm authority to sign for Pav Law.";
    if (role === "client" && !checks.individualCapacity) return "Andrew must confirm personal joint liability with Pav Law.";
    if (!checks.electronicConsent) return "Check the electronic-signature consent statement.";
    return "";
  }

  async function getPublicIp() {
    try {
      const res = await fetch("https://api64.ipify.org?format=json", { cache: "no-store" });
      if (!res.ok) throw new Error("IP lookup failed");
      const data = await res.json();
      return data.ip || "unavailable";
    } catch (e) {
      return "unavailable";
    }
  }

  function downloadBase64Pdf(base64, filename) {
    if (!base64) return;
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "Pav-Law-SOW-signed.pdf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function signSowAndEmail() {
    CONFIG = getConfig();
    if (!activeSowSigning || !activeSowToken) {
      updateEsignStatusText("This page is not attached to a valid private signing link.");
      return;
    }
    const role = activeSowSigning.role || "client";
    const checks = signingChecks(role);
    const validation = validateSigningChecks(checks, role);
    if (validation) {
      updateEsignStatusText(validation);
      showToast(validation, true);
      return;
    }

    if (activeSowSigning.local || !CONFIG.webhookUrl) {
      const previewBtn = document.getElementById("sow-send-esign");
      if (previewBtn) previewBtn.disabled = true;
      if (role === "client") {
        if (lastSubmittedPayload) lastSubmittedPayload.esignStatus = "client_signed";
        setSowContinueEnabled(true);
        updateEsignStatusText("Local preview — Andrew's signature simulated. Nothing was emailed or archived. Continue to preview the deposit step.");
      } else {
        if (lastSubmittedPayload) lastSubmittedPayload.esignStatus = "signed";
        updateEsignStatusText("Local preview — countersignature simulated. Nothing was emailed or archived.");
      }
      showToast("Local preview signature recorded — not emailed or archived");
      return;
    }

    const btn = document.getElementById("sow-send-esign");
    if (btn) {
      btn.disabled = true;
      btn.textContent = role === "client" ? "Recording Andrew’s signature…" : "Recording Kate’s countersignature…";
    }
    updateEsignStatusText("Recording server timestamp, public IP, document hash, and signature…");

    try {
      const publicIp = await getPublicIp();
      const result = await postToWebhook(CONFIG.webhookUrl, {
        type: "sow_sign",
        token: activeSowToken,
        role,
        checks,
        consentVersion: ESIGN_CONSENT_VERSION,
        publicIp,
        clientSignedAt: new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        userAgent: navigator.userAgent || ""
      }, true);
      const data = result.data || {};
      signedPdfBase64 = data.pdfBase64 || "";
      signedPdfName = data.pdfName || "Pav-Law-SOW-signed.pdf";
      if (signedPdfBase64) downloadBase64Pdf(signedPdfBase64, signedPdfName);

      const downloadBtn = document.getElementById("sow-download-copy");
      if (downloadBtn && signedPdfBase64) downloadBtn.classList.add("show");
      if (btn) btn.disabled = true;

      if (role === "client") {
        updateEsignStatusText("Andrew’s signature is recorded. His PDF copy was downloaded and emailed. Kate’s private countersign link was emailed to Gilded Goose.");
        if (lastSubmittedPayload) lastSubmittedPayload.esignStatus = "client_signed";
        setSowContinueEnabled(true);
      } else {
        updateEsignStatusText("Countersigned and complete. Final PDF downloaded and emailed to both parties; the finished SOW was saved to the private Drive folder.");
        if (lastSubmittedPayload) lastSubmittedPayload.esignStatus = "signed";
      }
      showToast(role === "client" ? "Andrew signature recorded" : "SOW finalized and archived");
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = role === "client" ? "Andrew Brown — sign fixed SOW" : "Kate Stannard — countersign fixed SOW";
      }
      updateEsignStatusText("Signature was not recorded. Nothing was finalized. " + (err.message || "Try again."));
      showToast("Signature failed — try again", true);
    }
  }

  async function loadPrivateSowLink() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("sow");
    if (!token) return false;
    CONFIG = getConfig();
    activeSowToken = token;
    document.getElementById("main-app").classList.add("hidden");
    document.getElementById("sow-page").classList.add("show");
    document.getElementById("sow-page").setAttribute("aria-hidden", "false");
    updateEsignStatusText("Opening private signing record…");
    try {
      const url = CONFIG.webhookUrl + "?action=sow&token=" + encodeURIComponent(token);
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.signing) {
        throw new Error(data.error || "Private signing link is invalid or the webhook is not on private-staged-v2 yet.");
      }
      showSowPage(data.signing);
    } catch (err) {
      updateEsignStatusText((err.message || "Could not load this signing link.") + " Ask Gilded Goose for a new link.");
      const btn = document.getElementById("sow-send-esign");
      if (btn) btn.disabled = true;
    }
    return true;
  }

  function continueToThankYou() {
    const payload = lastSubmittedPayload;
    if (!payload || payload.esignStatus !== "client_signed") {
      updateEsignStatusText("Andrew must sign before continuing to deposit.");
      return;
    }
    showThankYou(payload);
  }

  function buildPrioritiesCartHtml() {
    const items = getInvoiceLineItems();
    if (!items.length) {
      return `<p class="empty-state">Selections appear here as you choose projects.</p>`;
    }
    const bodyRows = items.map(row => {
      const isRetainer = row.id === "RETAINER";
      const item = findProjectById(row.id);
      const required = item ? isRequiredMaintenance(item, isRetainer) : false;
      const req = item ? requiredMarkerHtml(item, isRetainer) : "";
      const chkDisabled = required ? " disabled" : "";
      const scoreLabel = item ? fitScoreLabel(item, isRetainer) : "—";
      const scoreTitle = required ? "Required — no fit score" : "Best-fit / impact — higher is better";
      return `<tr data-id="${escapeHtml(row.id)}" data-retainer="${isRetainer}" data-required="${required}">
        <td class="col-select">
          <input type="checkbox" class="cart-proj-chk" data-id="${escapeHtml(row.id)}" aria-label="Keep ${escapeHtml(row.title)} in cart"${chkDisabled} checked>
        </td>
        <td class="col-project"><a href="${projectAnchor(row.id)}" class="priority-desc-link" data-project-id="${escapeHtml(row.id)}"><span class="priority-req-slot" aria-hidden="${req ? "false" : "true"}">${req || ""}</span><span class="priority-desc-title">${row.parentId ? "↳ " : ""}${escapeHtml(row.title)}</span></a></td>
        <td class="col-score" title="${escapeHtml(scoreTitle)}">${escapeHtml(scoreLabel)}</td>
      </tr>`;
    }).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    return `<div class="pav-priorities-scroll"><table class="pav-priorities-table pav-priorities-cart-only">
      <thead>
        <tr>
          <th class="col-select" scope="col">Add</th>
          <th class="col-project" scope="col">Project</th>
          <th class="col-score" scope="col" title="Best-fit / impact — higher is better. Required items show —.">Fit</th>
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
        <tr class="priorities-totals-row">
          <td class="col-select"></td>
          <td class="col-project">${label}</td>
          <td class="col-score"></td>
        </tr>
      </tbody>
    </table></div>`;
  }

  function buildRevenueCalculatorHtml() {
    const items = getInvoiceLineItems();
    if (!items.length) {
      return `<p class="empty-state">Add projects in Project Guide — fees for your Pav Priorities cart show here.</p>`;
    }
    const bodyRows = items.map(row => {
      const req = row.id === "RETAINER"
        ? requiredMarkerHtml(RETAINER, true)
        : (() => { const p = PROJECTS.find(x => x.id === row.id); return p ? requiredMarkerHtml(p, false) : ""; })();
      const item = row.id === "RETAINER" ? RETAINER : PROJECTS.find(x => x.id === row.id);
      return `<tr>
        <td class="col-project"><a href="${projectAnchor(row.id)}" class="priority-desc-link" data-project-id="${escapeHtml(row.id)}"><span class="priority-req-slot" aria-hidden="${req ? "false" : "true"}">${req || ""}</span><span class="priority-desc-title">${row.parentId ? "↳ " : ""}${escapeHtml(row.title)}</span></a></td>
        <td class="col-fee">${item ? feeCellHtml(item) : escapeHtml(row.fee)}</td>
      </tr>`;
    }).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    return `<div class="pav-priorities-scroll"><table class="pav-priorities-table revenue-calc-table">
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

  async function postToWebhook(url, payload, requireResponse) {
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
      if (requireResponse) throw err;
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body
      });
      return { ok: true, noCors: true, data: null };
    }
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch (e) { /* GAS may return empty on some errors */ }
    if (res.ok && (data.ok || text.includes('"ok":true'))) return { ok: true, data };
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
    let signingUrl = "";

    if (!CONFIG.webhookUrl) {
      saveSubmissionLocally(payload);
      lastSubmittedPayload = payload;
      showToast("No live webhook configured — opening a local SOW preview.");
      showLocalSowPreview(payload);
      btn.textContent = "Submit selections";
      updateSubmitButtons();
      return;
    }

    try {
      const result = await postToWebhook(CONFIG.webhookUrl, payload, true);
      signingUrl = result.data?.signing?.url || "";
      if (!signingUrl) throw new Error("Signing link was not returned.");
    } catch (err) {
      saveSubmissionLocally(payload);
      lastSubmittedPayload = payload;
      showToast("Live signing link unavailable (" + err.message + ") — opening a local SOW preview.", true);
      showLocalSowPreview(payload);
      btn.textContent = "Submit selections";
      updateSubmitButtons();
      return;
    }

    if (signingUrl) {
      lastSubmittedPayload = payload;
      saveSubmissionLocally(payload);
      showToast("Private signing link emailed to Andrew Brown");
      window.location.assign(signingUrl);
    }
    btn.textContent = "Submit selections";
    updateSubmitButtons();
  }

  document.getElementById("do-next-panel")?.addEventListener("click", e => {
    if (e.target.closest("#continue-to-confirm")) {
      showConfirmPage();
      return;
    }
    if (e.target.closest('input[type="checkbox"].cart-proj-chk')) return;
    const link = e.target.closest(".priority-desc-link");
    if (link) {
      e.preventDefault();
      openProjectDescription(link.dataset.projectId);
    }
  });

  document.getElementById("do-next-panel")?.addEventListener("change", e => {
    const chk = e.target.closest('input[type="checkbox"].cart-proj-chk');
    if (!chk) return;
    e.stopPropagation();
    applyCartCheckboxChange(chk.dataset.id, chk.checked, chk);
  });
  document.getElementById("cockpit-panel-impact")?.addEventListener("change", e => {
    const chk = e.target.closest('input[type="checkbox"].cart-proj-chk');
    if (!chk) return;
    e.stopPropagation();
    applyCartCheckboxChange(chk.dataset.id, chk.checked, chk);
  });
  document.getElementById("confirm-back").addEventListener("click", hideConfirmPage);
  document.getElementById("submit-selections").addEventListener("click", submitSelections);
  document.getElementById("btn-back-picker").addEventListener("click", hideThankYou);
  document.getElementById("sow-send-esign")?.addEventListener("click", signSowAndEmail);
  document.getElementById("sow-continue-thankyou")?.addEventListener("click", continueToThankYou);
  document.getElementById("sow-download-copy")?.addEventListener("click", () => {
    downloadBase64Pdf(signedPdfBase64, signedPdfName);
  });
  document.getElementById("submitted-email").addEventListener("input", () => { saveState(); updateSubmitButtons(); });
  document.getElementById("invoice-payment-months").addEventListener("change", () => {
    updateInvoiceScheduleAmount();
    saveState();
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
      setActiveViewTab(goView.dataset.goView || "kpis");
      renderAllCards();
      renderSummary();
      const dest = state.activeViewTab;
      const projectId = goView.dataset.projectId;
      const scrollTo = goView.dataset.scrollTo;
      if (dest === "picker" && projectId) {
        requestAnimationFrame(() => openProjectDescription(projectId));
        return;
      }
      if (scrollTo) {
        requestAnimationFrame(() => {
          const anchor = document.getElementById(scrollTo);
          if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
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
    const kpiTile = e.target.closest(".kpi-goal-card[data-kpi-focus], .kpi-stat-card[data-kpi-focus]");
    if (kpiTile) {
      if (e.target.closest(".kpi-help, .tab-help, a, button:not(.kpi-goal-card):not(.kpi-stat-card)")) return;
      const focus = kpiTile.getAttribute("data-kpi-focus");
      if (!focus || focus === "#GOAL3") return;
      e.preventDefault();
      openGuideFilteredToKpi(focus);
      return;
    }
    const kpiLink = e.target.closest(".kpi-ref-link");
    if (kpiLink) {
      e.preventDefault();
      focusKpi(kpiLink.dataset.kpi);
      return;
    }
    if (e.target.closest(".research-comment-tag") || e.target.closest(".research-comment-popover")) return;
    closeAllCommentPopovers();
  });

  document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
    btn.addEventListener("click", e => {
      if (e.target.closest(".tab-help, .kpi-help")) return;
      setActiveViewTab(btn.dataset.view || "kpis");
      renderAllCards();
      renderSummary();
    });
  });

  function closeHelpPopup() {
    const popup = document.getElementById("help-popup");
    const backdrop = document.getElementById("help-popup-backdrop");
    if (popup) popup.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }

  function openHelpPopup({ title, desc, formula, source }) {
    const popup = document.getElementById("help-popup");
    const backdrop = document.getElementById("help-popup-backdrop");
    const titleEl = document.getElementById("help-popup-title");
    const descEl = document.getElementById("help-popup-desc");
    const formulaEl = document.getElementById("help-popup-formula");
    const sourceEl = document.getElementById("help-popup-source");
    if (!popup || !titleEl || !descEl || !formulaEl) return;
    titleEl.textContent = title || "Help";
    descEl.textContent = desc || "";
    if (formula) {
      formulaEl.hidden = false;
      formulaEl.textContent = formula;
    } else {
      formulaEl.hidden = true;
      formulaEl.textContent = "";
    }
    if (sourceEl) {
      if (source) {
        sourceEl.hidden = false;
        sourceEl.textContent = source;
      } else {
        sourceEl.hidden = true;
        sourceEl.textContent = "";
      }
    }
    if (backdrop) backdrop.hidden = false;
    popup.hidden = false;
  }

  function helpFromTarget(el) {
    if (!el) return null;
    const kpiId = el.getAttribute("data-kpi-help");
    if (kpiId && window.KPI_REPORT && typeof window.KPI_REPORT.getHelp === "function") {
      return window.KPI_REPORT.getHelp(kpiId);
    }
    return {
      title: el.getAttribute("data-help-title") || el.getAttribute("aria-label") || "Help",
      desc: el.getAttribute("data-help-desc") || el.getAttribute("title") || "",
      formula: el.getAttribute("data-help-formula") || "",
      source: el.getAttribute("data-help-source") || ""
    };
  }

  document.addEventListener("click", e => {
    const help = e.target.closest(".tab-help, .kpi-help");
    if (help) {
      e.preventDefault();
      e.stopPropagation();
      openHelpPopup(helpFromTarget(help) || {});
      return;
    }
    if (e.target.closest("#help-popup-close") || e.target.id === "help-popup-backdrop") {
      closeHelpPopup();
    }
  }, true);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeHelpPopup();
  });

  document.getElementById("toc-expand-row")?.addEventListener("click", e => {
    const btn = e.target.closest(".toc-expand-btn");
    if (!btn) return;
    state.tocExpanded = btn.dataset.expand === "all";
    renderProjectToc();
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
    applyCartCheckboxChange(chk.dataset.id, chk.checked, chk);
  });

  loadState();
  ensureRequiredMaintenance();
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  setActiveViewTab("kpis");
  initGilbertGuide();
  renderPackageIntro();
  renderOutlineFilters();
  renderKpiDashboard();
  renderDoNextPanel();
  renderCondensedToc();
  renderAllCards();
  pinKpiTabToTop();
  requestAnimationFrame(() => {
    pinKpiTabToTop();
    requestAnimationFrame(pinKpiTabToTop);
  });
  window.addEventListener("kpi-report-rendered", () => {
    if (state.activeViewTab === "kpis" && !window.__gilbertKpiScrolledOnce) {
      window.__gilbertKpiScrolledOnce = true;
      pinKpiTabToTop();
      /* Feedback wraps can shift layout after paint — re-pin once more */
      setTimeout(pinKpiTabToTop, 50);
      setTimeout(pinKpiTabToTop, 200);
    }
  }, { once: false });
  if (state.goalText.trim()) suggestPlan(true);
  else {
    renderSummary();
  }
  loadPrivateSowLink();
})();
