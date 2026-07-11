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

  function uniqueTocPriority(item, usedPriorities) {
    if (item.isRetainer || item.id === "RETAINER") return null;
    if (item.priority == null || item.priority === "" || Number.isNaN(Number(item.priority))) return null;
    let p = Math.trunc(Number(item.priority));
    while (usedPriorities.has(p)) p += 1;
    usedPriorities.add(p);
    return p;
  }

  function priorityTocHtml(item, displayPriority) {
    const required = isRequiredProject(item, !!item.isRetainer);
    const p = displayPriority != null ? displayPriority : "";
    const urgent = isPriorityUrgent(item) ? '<span class="priority-urgent" title="Urgent or fixing an active issue">!</span>' : "";
    const req = required ? requiredMarkerHtml(item, !!item.isRetainer) : "";
    return `<span class="toc-priority-inner">${urgent}${p}</span>${req ? `<span class="toc-required-icon">${req}</span>` : ""}`;
  }

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
    activeViewTab: "outlines"
  };

  const KPI_PLACEHOLDERS = [
    { id: "calls", label: "Qualified calls", value: "—", hint: "Add KPI in settings later" },
    { id: "consults", label: "Consults booked", value: "—", hint: "Add KPI in settings later" },
    { id: "signed", label: "Signed cases (attributed)", value: "—", hint: "Add KPI in settings later" },
    { id: "cac", label: "Cost per consult", value: "—", hint: "Add KPI in settings later" },
    { id: "completed", label: "Projects delivered", value: "—", hint: "Auto when KPIs wired" },
    { id: "stack", label: "Stack health", value: "—", hint: "Foundation + intake score" }
  ];

  function normalizeStatus(item) {
    const s = String(item.status || "available").toLowerCase();
    if (s.includes("completed")) return "completed";
    if (s.includes("research")) return "research";
    if (s.includes("draft") || s.includes("outline")) return "draft";
    if (s.includes("ongoing")) return "ongoing";
    if (s.includes("wip")) return "wip";
    return "available";
  }

  function isCompletedStatus(item) {
    return normalizeStatus(item) === "completed";
  }

  function isResearchStatus(item) {
    const s = normalizeStatus(item);
    return s === "research" || s === "draft";
  }

  function activeOptionalProjects() {
    return orderedProjects().filter(p => !p.monthlyOnly && !isCompletedStatus(p) && !isResearchStatus(p));
  }

  function researchProjects() {
    return sortByPriority(orderedProjects().filter(p => !p.monthlyOnly && isResearchStatus(p)));
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
    const el = document.getElementById("kpi-dashboard");
    if (!el) return;
    const completedCount = completedProjects().length;
    const tiles = KPI_PLACEHOLDERS.map(k => {
      const value = k.id === "completed" && completedCount ? String(completedCount) : k.value;
      return `<div class="kpi-tile"><div class="kpi-tile-label">${escapeHtml(k.label)}</div><div class="kpi-tile-value">${escapeHtml(value)}</div><div class="kpi-tile-hint">${escapeHtml(k.hint)}</div></div>`;
    }).join("");
    el.innerHTML = `<div class="kpi-dashboard-head"><h2>Marketing results — cumulative</h2><p class="kpi-dashboard-note">Placeholder metrics — you’ll wire live KPIs later.</p></div><div class="kpi-grid">${tiles}</div>`;
  }

  function renderDoNextPanel() {
    const el = document.getElementById("do-next-panel");
    if (!el) return;
    const top = topScoredProjects(3);
    if (!top.length) {
      el.innerHTML = `<h3>Best to do next</h3><p class="kpi-dashboard-note">Tell Gilbert your goal or pick projects — scores appear here.</p>`;
      return;
    }
    el.innerHTML = `<h3>Best to do next</h3><ol class="do-next-list">${top.map(({ item, score }, i) =>
      `<li><span class="do-next-rank">${i + 1}.</span><a href="#project-${item.id}">${escapeHtml(item.title)}</a><span class="do-next-score">score ${score}</span></li>`
    ).join("")}</ol>`;
  }

  function resultsBlockHtml(item) {
    const results = item.resultsItems || [];
    const auto = [...(item.completedItems || []), ...(item.inProgressItems || [])];
    let html = "";
    if (results.length) {
      html += `<div class="results-block"><h4>Results</h4><ul class="results-list">${results.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul></div>`;
    } else {
      html += `<div class="results-block"><h4>Results</h4><p class="results-placeholder">Outcomes to track — add a ## Results section in ${escapeHtml(item.id)}.md</p></div>`;
    }
    if (auto.length) {
      html += `<div class="completed-auto"><h4>Work logged</h4><ul>${auto.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul></div>`;
    }
    if (item.backedMetric && item.backedMetric.label) {
      html += `<div class="completed-auto"><h4>Verified data</h4><p>${escapeHtml(item.backedMetric.label)}</p></div>`;
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

  function renderCompletedList() {
    const el = document.getElementById("completed-list");
    if (!el) return;
    const items = completedProjects();
    el.innerHTML = items.length
      ? items.map(completedCardHtml).join("")
      : `<p class="kpi-dashboard-note">No completed projects in INDEX yet — set Status to <strong>completed</strong>.</p>`;
  }

  function researchRowHtml(item) {
    const id = item.id;
    const sel = state.projects.has(id);
    const note = (state.notes[id] || "").trim();
    return `<div class="research-row${sel ? " selected" : ""}" data-id="${id}">
      <input type="checkbox" class="proj-chk research-chk" data-id="${id}" ${sel ? "checked" : ""}>
      <div>
        <span class="research-row-id">${escapeHtml(id)}</span>
        <div class="research-row-title">${escapeHtml(item.title)}</div>
      </div>
      <button type="button" class="research-comment-tag${note ? " has-note" : ""}" data-id="${id}">${note ? "Comment ✓" : "+ Comment"}</button>
      <div class="research-comment-popover" data-id="${id}" hidden>
        <textarea class="project-note" data-id="${id}" placeholder="Planning notes for Gilded Goose…">${escapeHtml(state.notes[id] || "")}</textarea>
        <button type="button" class="comment-popover-done" data-id="${id}">Done</button>
      </div>
    </div>`;
  }

  function renderResearchSection() {
    const wrap = document.getElementById("research-section-wrap");
    if (!wrap) return;
    const items = researchProjects();
    if (!items.length || state.activeViewTab !== "outlines") {
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
    document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
      const on = btn.dataset.view === state.activeViewTab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    const activeCount = activeOptionalProjects().length + researchProjects().length;
    const doneCount = completedProjects().length;
    document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
      const view = btn.dataset.view;
      if (view === "reporting") {
        const badge = btn.querySelector(".tab-count");
        if (badge) badge.remove();
        return;
      }
      const count = view === "completed" ? doneCount : activeCount;
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
    const isReporting = state.activeViewTab === "reporting";
    const isOutlines = state.activeViewTab === "outlines";
    const isCompleted = state.activeViewTab === "completed";
    const reportingPanel = document.getElementById("cockpit-panel-reporting");
    const outlinesPanel = document.getElementById("cockpit-panel-outlines");
    const completedPanel = document.getElementById("cockpit-panel-completed");
    if (reportingPanel) reportingPanel.hidden = !isReporting;
    if (outlinesPanel) outlinesPanel.hidden = !isOutlines;
    if (completedPanel) completedPanel.hidden = !isCompleted;
    syncViewTabs();
    renderResearchSection();
    if (isCompleted) renderCompletedList();
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

  function getValueIcons(item) {
    if (item.isRetainer || item.id === "RETAINER" || item.category === "Retainer") {
      const def = VALUE_ICON_DEFS.find(d => d.id === "retainer");
      return [def || { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Retainer" }];
    }
    const icons = [];
    for (const def of VALUE_ICON_DEFS) {
      if (def.id === "retainer") continue;
      if (def.match(item) && !icons.some(i => i.id === def.id)) icons.push(def);
    }
    if (!icons.length) icons.push({ id: "general", svgId: "general", cls: "icon-general", label: "Growth" });
    return icons;
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
    el.innerHTML = `<span class="value-icon-key-title">Filter by value</span>${hint}` +
      VALUE_ICON_DEFS.map(d => {
        const active = state.iconFilters.includes(d.id) ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn key-filter-${d.id}${active}" data-icon-filter="${d.id}">${valueIconMarkup(d)}<span class="key-item-label">${escapeHtml(d.label)}</span></button>`;
      }).join("") +
      (() => {
        const active = state.iconFilters.includes("account-data") ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn key-filter-account-data${active}" data-icon-filter="account-data"><span class="account-data-shield key-shield">${accountDataBadgeImg()}</span><span class="key-item-label">Account data</span></button>`;
      })();
    el.querySelectorAll(".key-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => toggleIconFilter(btn.dataset.iconFilter));
    });
    el.querySelector("#icon-filter-clear")?.addEventListener("click", clearIconFilters);
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
    if (!el) return;
    el.innerHTML = buildTotalsHtml();
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

  function cardCheckColHtml(item, isRetainer, required, sel, chkDisabled) {
    const id = item.id;
    const reqMark = required ? requiredMarkerHtml(item, isRetainer) : "";
    return `<div class="card-check-col">
      <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer"' : ""}${chkDisabled} ${sel ? "checked" : ""}>
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

  function briefValueAdd(item) {
    return itemTldr(item);
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
    return `<ul class="card-objectives card-summary-bullets">${bullets.map(b =>
      `<li>${escapeHtml(String(b).replace(/^Deliverable:\s*/i, "").trim())}</li>`
    ).join("")}</ul>`;
  }

  function cardMetaFieldsHtml(item) {
    const leads = item.estimatedLeads && String(item.estimatedLeads).trim();
    const touch = item.clientTouchpoints && String(item.clientTouchpoints).trim();
    if (!leads && !touch) return "";
    const parts = [];
    if (leads) parts.push(`<span class="card-meta-chip"><strong>Est. leads:</strong> ${escapeHtml(leads)}</span>`);
    if (touch) parts.push(`<span class="card-meta-chip"><strong>Touchpoints:</strong> ${escapeHtml(touch)}</span>`);
    return `<div class="card-meta-fields">${parts.join("")}</div>`;
  }

  function cardSummaryHtml(item) {
    const tldr = itemTldr(item);
    return `<div class="card-summary">
      <p class="card-tldr"><strong>TLDR:</strong> ${escapeHtml(tldr)}</p>
      ${valueAddedListHtml(item)}
      ${cardMetaFieldsHtml(item)}
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
    return `<div class="detail-block detail-full-description"><h4>Full description</h4>${full}</div>`;
  }

  function descriptionHtml(item) {
    return cardSummaryHtml(item);
  }

  function marketingEducationToHtml(text) {
    if (!text) return "";
    return mdLinksToHtml(String(text))
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
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
    if (hasFullDesc) return exp ? "Hide full description" : "Read full description";
    if (hasProgress) return exp ? "Hide details" : "Show details";
    return exp ? "Hide scope" : "Show scope";
  }

  function cardFeaturedImageHtml(item) {
    const src = item.featuredImage && String(item.featuredImage).trim();
    if (!src) return "";
    return `<img class="card-featured-image" src="${escapeHtml(src)}" alt="" loading="lazy">`;
  }

  function cardReferenceLinkHtml(item) {
    const ref = item.referenceLink;
    if (!ref?.url) return "";
    const label = ref.label || "Project reference";
    return `<a class="card-ref-link" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`;
  }

  function cardCommentUiHtml(id) {
    const note = (state.notes[id] || "").trim();
    return `<button type="button" class="card-comment-tag${note ? " has-note" : ""}" data-id="${id}" aria-expanded="false">${note ? "Comment ✓" : "+ Comment"}</button>
      <div class="card-comment-popover" data-id="${id}" hidden>
        <label for="comment-${id}">Comment for Gilded Goose</label>
        <textarea id="comment-${id}" class="project-note" data-id="${id}" placeholder="Scope, timing, or questions…">${escapeHtml(state.notes[id] || "")}</textarea>
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
      "Gilbert project picker — activity log",
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
    if (!text) return "";
    return String(text).replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
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
      state.projects.add(id);
      state.recommended.add(id);
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
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }

  function sortByPriority(items) {
    return [...items].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }

  function tocItemFee(item) {
    if (item.isRetainer || item.id === "RETAINER") return item.fee;
    return itemSelectionCost(item);
  }

  function sortTocItems(items) {
    const { field, dir } = state.tocSort;
    const mult = dir === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      const aSel = isItemSelected(a);
      const bSel = isItemSelected(b);
      if (aSel !== bSel) return aSel ? -1 : 1;
      if (field === "fee") {
        const diff = tocItemFee(a) - tocItemFee(b);
        return diff !== 0 ? mult * diff : mult * ((a.priority ?? 99) - (b.priority ?? 99));
      }
      const ap = a.priority ?? 99;
      const bp = b.priority ?? 99;
      if (ap !== bp) return mult * (ap - bp);
      return mult * (tocItemFee(a) - tocItemFee(b));
    });
  }

  function updateTocSortUi() {
    const btn = document.getElementById("toc-sort-priority");
    const arrow = document.getElementById("sort-arrow-priority");
    if (!btn || !arrow) return;
    btn.classList.add("active");
    arrow.textContent = state.tocSort.dir === "asc" ? "▲" : "▼";
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
    const el = document.getElementById("toc-condensed");
    if (!el) return;
    const goal = state.goalText.trim();
    const picked = gilbertRankedPicks(5);
    el.hidden = false;

    if (!picked.length) {
      el.innerHTML = `<div class="toc-condensed-inner">
        <h4 class="toc-condensed-title">Gilbert's picks</h4>
        <p class="toc-condensed-empty">${goal ? "No strong matches yet — try different keywords or browse the list below." : "Tell Gilbert what's not working — matched projects rank here as you chat."}</p>
      </div>`;
      return;
    }

    el.innerHTML = `<div class="toc-condensed-inner">
      <h4 class="toc-condensed-title">Gilbert's picks${goal ? "" : " — your cart"}</h4>
      <ol class="toc-condensed-list">${picked.map(item =>
        `<li><a href="#project-${item.id}">${escapeHtml(item.title)}</a><span class="toc-condensed-blurb">${escapeHtml(elevatorPitch(item))}</span></li>`
      ).join("")}</ol>
    </div>`;
  }

  function renderProjectToc() {
    const listEl = document.getElementById("toc-list");
    const statusEl = document.getElementById("table-filter-status");
    const hintEl = document.getElementById("toc-summary-hint");
    const expandEl = document.getElementById("toc-expand-row");
    if (!listEl) return;
    const items = sortTocItems(allItemsByPriority().filter(item => {
      if (item.isRetainer || item.id === "RETAINER" || item.monthlyOnly) return true;
      return !isCompletedStatus(item);
    }).filter(item => itemMatchesIconFilters(item)));
    const visibleItems = state.tocExpanded ? items : items.slice(0, 5);
    const usedPriorities = new Set();
    listEl.innerHTML = visibleItems.map(item => {
      const selected = isItemSelected(item);
      const inPkg = isInRecommendedPackage(item);
      const blurb = briefValueAdd(item);
      const displayPriority = uniqueTocPriority(item, usedPriorities);
      return `<tr class="toc-item${selected ? " row-selected" : ""}${inPkg ? " row-package" : ""}" data-id="${item.id}">
        <td class="toc-col-priority"><span class="toc-priority">${priorityTocHtml(item, displayPriority)}</span></td>
        <td class="toc-col-project toc-title"><a href="#project-${item.id}">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a></td>
        <td class="toc-col-blurb toc-blurb">${escapeHtml(blurb)}</td>
        <td class="toc-col-icons toc-value">${valueIconsHtml(item)}</td>
      </tr>`;
    }).join("");
    if (hintEl) {
      const selCount = items.filter(i => isItemSelected(i)).length;
      const countLabel = state.tocExpanded || items.length <= 5 ? `${items.length} projects` : `Top 5 of ${items.length} projects`;
      hintEl.textContent = selCount ? `${countLabel} · ${selCount} selected` : countLabel;
    }
    if (statusEl) {
      const total = allItemsByPriority().length;
      const shown = items.length;
      statusEl.textContent = state.iconFilters.length && shown !== total
        ? `Showing ${shown} of ${total} projects (icon filter)`
        : "";
    }
    if (expandEl) {
      if (items.length > 5) {
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
        if (!state.projects.has(item.id)) added += 1;
        state.projects.add(item.id);
        state.recommended.add(item.id);
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
          state.projects.add(id);
          state.recommended.add(id);
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
      iconFilters: state.iconFilters
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
    if (chk) chk.checked = isExpandAll();
  }

  function setExpandAll(open) {
    if (open) allProjectIds().forEach(id => state.expanded.add(id));
    else state.expanded.clear();
    saveState();
    renderAllCards();
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
    const mutedClass = isResearchStatus(item) || isCompletedStatus(item) ? " status-muted" : "";

    return `
      <div class="card${retainerClass}${maintClass}${subClass}${pkgClass}${selFirst}${mutedClass} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}">
        ${cardCommentUiHtml(id)}
        <div class="card-header">
          ${cardCheckColHtml(item, isRetainer, required, sel, chkDisabled)}
            <div class="card-body">
              ${cardFeaturedImageHtml(item)}
              ${cardReferenceLinkHtml(item)}
              <div class="card-top-row">
                <div class="card-title"><span>${escapeHtml(item.title)}</span></div>
                ${iconsHtml}
              </div>
              ${relatedSubHtml(item) ? `<div class="card-meta-row">${relatedSubHtml(item)}</div>` : ""}
              ${descriptionHtml(item)}
            <button type="button" class="expand-btn">${expandBtnLabel(item, exp)}</button>
          </div>
        </div>
        <div class="card-detail">
          ${progressHtml(item)}
          ${cardDetailBodyHtml(item)}
        </div>
      </div>`;
  }

  function renderAllCards() {
    renderViewLayout();
    const list = document.getElementById("project-list");
    if (!list || state.activeViewTab !== "outlines") {
      if (state.activeViewTab === "completed") renderCompletedList();
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
        state.notes[ta.dataset.id] = e.target.value;
        syncCommentTag(ta.dataset.id, root);
        saveState();
        updateSubmitButtons();
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
        if (chk.checked) state.projects.add(id);
        else state.projects.delete(id);
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
        if (state.projects.has(id)) state.projects.delete(id);
        else state.projects.add(id);
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
    renderWhyPanel();
    document.getElementById("confirm-page").classList.add("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "false");
    closeGilbertChat();
    document.getElementById("gilbert-chat-launcher")?.setAttribute("hidden", "");
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    document.getElementById("submitted-email")?.focus();
  }

  function hideConfirmPage() {
    document.getElementById("confirm-page").classList.remove("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "true");
    document.getElementById("gilbert-chat-launcher")?.removeAttribute("hidden");
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
      projectNotes: getNotesPayload()
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
    renderGilbertChat();
    saveState();
    suggestPlan(true);
    renderCondensedToc();
    renderDoNextPanel();
  }

  function openGilbertChat() {
    const popup = document.getElementById("gilbert-chat-popup");
    const backdrop = document.getElementById("gilbert-chat-backdrop");
    const launcher = document.getElementById("gilbert-chat-launcher");
    if (!popup || !backdrop) return;
    popup.hidden = false;
    backdrop.hidden = false;
    if (launcher) launcher.setAttribute("aria-expanded", "true");
    renderGilbertChat();
    document.getElementById("goal-input")?.focus();
  }

  function closeGilbertChat() {
    const popup = document.getElementById("gilbert-chat-popup");
    const backdrop = document.getElementById("gilbert-chat-backdrop");
    const launcher = document.getElementById("gilbert-chat-launcher");
    if (!popup || !backdrop) return;
    popup.hidden = true;
    backdrop.hidden = true;
    if (launcher) launcher.setAttribute("aria-expanded", "false");
  }

  function initGilbertGuide() {
    const heroSrc = "assets/gilbert-thinking.png";
    ["gilbert-launcher-img", "gilbert-popup-img"].forEach(id => {
      const img = document.getElementById(id);
      if (img) {
        img.src = heroSrc;
        img.alt = `${GUIDE_NAME} — your guide`;
      }
    });
    if (!state.gilbertChat.length) {
      state.gilbertChat = [{ role: "gilbert", text: GILBERT_GREETING }];
      if (state.goalText.trim()) {
        state.gilbertChat.push({ role: "user", text: state.goalText.trim() });
        state.gilbertChat.push({ role: "gilbert", text: pickGilbertReply(state.goalText) });
      }
    }
    renderGilbertChat();
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

    document.getElementById("thank-you-body").innerHTML = `
      <div class="thank-you-affirm"><strong>Why this is a strong choice</strong>${escapeHtml(buildThankYouAffirmation(payload, selected))}</div>
      ${buildThankYouReturnsHtml(selected, payload.retainer)}
      <div class="thank-you-selection">
        <h3>Your consulting estimate</h3>
        <p class="thank-you-total-single">${itemCount} item${itemCount === 1 ? "" : "s"} · <strong>${totalLine}</strong></p>
        <p class="thank-you-terms-line">Invoice schedule: <strong>${termsLine}</strong></p>
      </div>
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
    document.getElementById("gilbert-chat-launcher")?.setAttribute("hidden", "");
    closeGilbertChat();
    window.scrollTo(0, 0);
  }

  function buildTotalsHtml() {
    const items = getInvoiceLineItems();
    const total = getSelectionCost();
    if (!items.length) {
      return `<p class="empty-state">Selections appear here as you choose projects.</p>`;
    }
    const rows = items.map(row => {
      const req = row.id === "RETAINER"
        ? requiredMarkerHtml(RETAINER, true)
        : (() => { const p = PROJECTS.find(x => x.id === row.id); return p ? requiredMarkerHtml(p, false) : ""; })();
      return `<div class="total-row"><span><a href="${projectAnchor(row.id)}" class="invoice-item-link">${req}<span>${escapeHtml(row.title)}</span></a></span><span>${row.fee}</span></div>`;
    }).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    return rows + `<div class="total-row grand total-row-single"><span>${label}</span><span>${fmt(total)}</span></div>`;
  }

  function hideThankYou() {
    document.getElementById("thank-you").classList.remove("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "true");
    document.getElementById("main-app").classList.remove("hidden");
    document.getElementById("gilbert-chat-launcher")?.removeAttribute("hidden");
  }

  function renderInvoiceSummary() {
    renderPlanSummary();
  }

  function renderSummary() {
    renderKpiDashboard();
    renderDoNextPanel();
    renderPlanSummary();
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
  document.getElementById("gilbert-chat-launcher")?.addEventListener("click", () => {
    const popup = document.getElementById("gilbert-chat-popup");
    if (popup?.hidden) openGilbertChat();
    else closeGilbertChat();
  });
  document.getElementById("gilbert-chat-close")?.addEventListener("click", closeGilbertChat);
  document.getElementById("gilbert-chat-backdrop")?.addEventListener("click", closeGilbertChat);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeGilbertChat();
  });
  document.getElementById("expand-all-projects").addEventListener("change", e => setExpandAll(e.target.checked));

  document.addEventListener("click", e => {
    if (e.target.closest(".card-comment-tag") || e.target.closest(".card-comment-popover")
      || e.target.closest(".research-comment-tag") || e.target.closest(".research-comment-popover")) return;
    closeAllCommentPopovers();
  });

  document.querySelectorAll(".cockpit-tabs .view-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeViewTab = btn.dataset.view || "outlines";
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
