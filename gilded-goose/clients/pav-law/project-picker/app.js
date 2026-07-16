(function () {
  function getConfig() {
    return Object.assign(
      { webhookUrl: "", depositAmount: 2500, quickbooksDepositUrl: "" },
      typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
    );
  }
  let CONFIG = getConfig();
  const GUIDE_NAME = PROJECT_DATA.guideName || "Lord Gilbert Granville";
  const GUIDE_SHORT = PROJECT_DATA.guideShortName || "Gilbert";

  /** Choose-your-path survey — sourced from content/survey.md via projects-data.js */
  const GILBERT_SURVEY = (typeof PROJECT_DATA !== "undefined" && PROJECT_DATA.survey && PROJECT_DATA.survey.nodes)
    ? PROJECT_DATA.survey
    : { start: "q1", nodes: {} };

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
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.8 2.2 22 6.4"/><path d="m20.8 4.2-5.8 5.8"/></svg>`,
    retainer: REQUIRED_ICON_SVG,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/><circle cx="5" cy="10.5" r="2"/><path d="M1 20v-0.5a2.5 2.5 0 0 1 2-2.45"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 9v11"/><path d="M13 13h5"/><path d="M13 17h5"/></svg>`,
    seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5.5 5.5"/></svg>`,
    referrals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7-4 4 4 4"/><path d="M3 11h13"/><path d="m17 17 4-4-4-4"/><path d="M21 13H8"/></svg>`,
    efficiency: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M10 19V9M16 19v-6M22 19V3"/></svg>`,
    intake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v9H8l-4 4V5z"/></svg>`,
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

  /* Colors live in index.html :root --vi-* + .value-icon.icon-{id}. Filter + TOC share those classes — never hardcode badge colors here. */
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
    generalSuggestions: "",
    submitterEmail: "",
    invoicePaymentMonths: "",
    invoicePaymentMonthlyAmount: "",
    goalText: "",
    surveyNode: GILBERT_SURVEY.start,
    surveyPath: [],
    surveyDone: false,
    iconFilters: [],
    tocSort: { field: "priority", dir: "asc" },
    tocExpanded: false,
    showAllProjects: false
  };

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
    if (state.surveyDone) {
      resetSurvey(true);
      return;
    }
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
      : `<span class="icon-filter-hint">Click an icon to filter the project list</span>`;
    el.innerHTML = `<span class="value-icon-key-title">Filter by value</span>${hint}` +
      VALUE_ICON_DEFS.map(d => {
        const active = state.iconFilters.includes(d.id) ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn${active}" data-icon-filter="${d.id}">${valueIconMarkup(d)}<span class="key-item-label">${escapeHtml(d.label)}</span></button>`;
      }).join("") +
      (() => {
        const active = state.iconFilters.includes("account-data") ? " filter-active" : "";
        return `<button type="button" class="key-item key-filter-btn${active}" data-icon-filter="account-data"><span class="account-data-shield key-shield">${accountDataBadgeImg()}</span><span class="key-item-label">Account data</span></button>`;
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
        blurb: briefValueAdd(item)
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
        `<li><strong>${escapeHtml(b.title)}</strong>${b.blurb ? ` — ${escapeHtml(b.blurb)}` : ""}</li>`
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
    renderWhyPanel();
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

  function briefValueAdd(item) {
    const bullets = valueAddedBullets(item);
    if (bullets.length) {
      const b = String(bullets[0]).replace(/^Deliverable:\s*/i, "").trim();
      return b.length > 110 ? b.slice(0, 107).trim() + "…" : b;
    }
    const v = buildBusinessValue(item);
    if (v.why) return v.why.length > 110 ? v.why.slice(0, 107).trim() + "…" : v.why;
    return conciseDescription(item);
  }

  function descriptionHtml(item) {
    const parts = [];
    const desc = item.description ? String(item.description).trim() : "";
    if (desc) {
      const descHtml = desc.includes("<a ") ? desc : mdLinksToHtml(escapeHtml(desc));
      parts.push(`<p>${descHtml}</p>`);
    }
    const bullets = valueAddedBullets(item);
    if (bullets.length) {
      parts.push(`<div class="card-tldr"><ul class="card-objectives">${bullets.map(b =>
        `<li>${escapeHtml(String(b).replace(/^Deliverable:\s*/i, "").trim())}</li>`
      ).join("")}</ul></div>`);
    }
    const edu = item.marketingEducation && String(item.marketingEducation).trim();
    if (edu) {
      parts.push(`<div class="card-principles">${marketingEducationToHtml(edu)}</div>`);
    }
    if (!parts.length) return "";
    return `<div class="card-description">${parts.join("")}</div>`;
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
    if (hasProgress) return exp ? "Hide details" : "Show details";
    return exp ? "Hide notes" : "Questions & notes";
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

  function renderCondensedToc() {
    const el = document.getElementById("toc-condensed");
    if (!el) return;
    const hasRun = !!state.goalText.trim() || state.projects.size > 0 || state.recommended.size > 1;
    const picked = sortByPriority(getAllItems().filter(item => {
      const id = item.isRetainer ? "RETAINER" : item.id;
      return state.recommended.has(id) || isItemSelected(item);
    }));
    if (!hasRun || !picked.length) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    const top5 = picked.slice(0, 5);
    el.hidden = false;
    el.innerHTML = `<div class="toc-condensed-inner">
      <h4 class="toc-condensed-title">Path matches — quick view</h4>
      <ol class="toc-condensed-list">${top5.map(item =>
        `<li><a href="#project-${item.id}">${escapeHtml(item.title)}</a><span class="toc-condensed-blurb">${escapeHtml(briefValueAdd(item))}</span></li>`
      ).join("")}</ol>
      ${picked.length > 5 ? `<p class="toc-condensed-more">+ ${picked.length - 5} more in the full table below</p>` : ""}
      <button type="button" class="btn btn-secondary btn-sm" id="toc-condensed-open">Open full table of contents</button>
    </div>`;
    el.querySelector("#toc-condensed-open")?.addEventListener("click", () => {
      const toc = document.getElementById("project-toc");
      if (toc) {
        toc.open = true;
        toc.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function renderProjectToc() {
    const listEl = document.getElementById("toc-list");
    const statusEl = document.getElementById("table-filter-status");
    const hintEl = document.getElementById("toc-summary-hint");
    const expandEl = document.getElementById("toc-expand-row");
    if (!listEl) return;
    const items = sortTocItems(allItemsByPriority().filter(item => itemMatchesIconFilters(item)));
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
      if (state.iconFilters.length && shown !== total) {
        statusEl.textContent = state.surveyDone
          ? `Showing ${shown} of ${total} projects (your path)`
          : `Showing ${shown} of ${total} projects (icon filter)`;
      } else {
        statusEl.textContent = "";
      }
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
    /* Survey drives filters — keep package recommendations only when no path is set. */
    state.recommended = new Set();
    ensureRequiredMaintenance();
    state.recommended.add("RETAINER");
    if (!state.surveyDone) {
      const pkg = PROJECT_DATA.recommendedPackage;
      (pkg?.projectIds || []).forEach(id => {
        const p = PROJECTS.find(x => x.id === id);
        if (p && itemPassesCostPriorityFilter({ ...p, isRetainer: false })) {
          state.recommended.add(id);
        }
      });
    } else {
      allItemsByPriority().filter(item => itemMatchesIconFilters(item)).slice(0, 8).forEach(item => {
        if (!item.isRetainer && item.id !== "RETAINER") state.recommended.add(item.id);
      });
    }
    if (!silent) { /* no toast — survey applySurveyFilters handles feedback */ }
    saveState();
    renderAllCards();
    renderSummary();
    renderCondensedToc();
  }

  function clearFilters() {
    resetSurvey(true);
  }

  function resetSurvey(keepCart) {
    state.goalText = "";
    state.surveyNode = GILBERT_SURVEY.start;
    state.surveyPath = [];
    state.surveyDone = false;
    state.iconFilters = [];
    if (!keepCart) {
      state.projects = new Set();
      state.recommended = new Set();
      ensureRequiredMaintenance();
    }
    renderGilbertSurvey();
    renderValueIconKey();
    renderAllCards();
    renderProjectToc();
    renderSummary();
    saveState();
  }

  function surveyChoiceByPath() {
    const out = [];
    for (const step of state.surveyPath) {
      const node = GILBERT_SURVEY.nodes[step.nodeId];
      const choice = node?.choices?.find(c => c.id === step.choiceId);
      if (choice) out.push({ nodeId: step.nodeId, choice });
    }
    return out;
  }

  function iconsFromSurveyPath() {
    const icons = [];
    surveyChoiceByPath().forEach(({ choice }) => {
      (choice.icons || []).forEach(id => {
        if (!icons.includes(id)) icons.push(id);
      });
    });
    return icons;
  }

  function goalFromSurveyPath() {
    const parts = surveyChoiceByPath().map(({ choice }) => choice.goal || choice.label).filter(Boolean);
    return parts.join(" · ");
  }

  function applySurveyFilters() {
    const icons = iconsFromSurveyPath();
    state.iconFilters = icons.slice();
    state.goalText = goalFromSurveyPath();
    state.surveyDone = true;
    state.tocExpanded = true;
    const toc = document.getElementById("project-toc");
    if (toc) toc.open = true;
    renderValueIconKey();
    renderAllCards();
    renderProjectToc();
    renderSummary();
    renderCondensedToc();
    saveState();
    const matchCount = allItemsByPriority().filter(item => itemMatchesIconFilters(item)).length;
    showToast(`Trail marked — ${matchCount} project${matchCount === 1 ? "" : "s"} on your map`);
  }

  function selectSurveyChoice(choiceId) {
    const node = GILBERT_SURVEY.nodes[state.surveyNode];
    if (!node) return;
    const choice = node.choices.find(c => c.id === choiceId);
    if (!choice) return;
    state.surveyPath.push({ nodeId: state.surveyNode, choiceId: choice.id });
    if (choice.next === "done") {
      applySurveyFilters();
      renderGilbertSurvey();
      return;
    }
    state.surveyNode = choice.next;
    state.surveyDone = false;
    renderGilbertSurvey();
    saveState();
  }

  function syncSurveyGilbertPortrait() {
    const fig = document.getElementById("survey-gilbert-fig");
    const img = document.getElementById("survey-gilbert-img");
    if (!img) return;
    img.src = "assets/gilbert-guide-subtle-hat.png";
    img.alt = "Lord Gilbert Granville in a funny trail guide hat";
    fig?.classList.remove("is-walk");
    fig?.classList.add("is-profile");
  }

  function renderGilbertSurvey() {
    const el = document.getElementById("gilbert-survey-body") || document.getElementById("gilbert-survey");
    if (!el) return;
    syncSurveyGilbertPortrait();
    const pathLabels = surveyChoiceByPath().map(({ choice }) => choice.label);
    const crumbs = pathLabels.length
      ? `<p class="survey-crumbs">Trail so far: <strong>${escapeHtml(pathLabels.join(" → "))}</strong></p>`
      : "";

    if (state.surveyDone && state.surveyPath.length) {
      const icons = iconsFromSurveyPath();
      const matchCount = allItemsByPriority().filter(item => itemMatchesIconFilters(item)).length;
      const tags = icons.map(id => {
        const def = VALUE_ICON_DEFS.find(d => d.id === id);
        if (!def) return `<span class="survey-tag">${escapeHtml(id)}</span>`;
        return `<span class="survey-tag">${valueIconMarkup(def)}<span>${escapeHtml(def.label)}</span></span>`;
      }).join("");
      el.innerHTML = `<div class="survey-progress">
          <span>Trail marked</span>
          <span class="survey-progress-steps">Map ready</span>
        </div>
        ${crumbs}
        <p class="survey-result-meta">Gilbert marked <strong>${matchCount}</strong> project${matchCount === 1 ? "" : "s"} on the outline map. Pick from the table below, or refine with value icons.</p>
        <div class="survey-result-tags">${tags}</div>
        <div class="survey-actions">
          <button type="button" class="btn btn-primary" id="survey-jump-toc">View the map</button>
          <button type="button" class="btn btn-secondary" id="survey-restart">Back to trailhead</button>
        </div>`;
      el.querySelector("#survey-restart")?.addEventListener("click", () => resetSurvey(true));
      el.querySelector("#survey-jump-toc")?.addEventListener("click", () => {
        const toc = document.getElementById("project-toc");
        if (toc) {
          toc.open = true;
          toc.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    const nodeId = state.surveyNode || GILBERT_SURVEY.start;
    const node = GILBERT_SURVEY.nodes[nodeId];
    if (!node) {
      el.innerHTML = `<p class="survey-result-meta">Trail guide unavailable.</p>`;
      return;
    }
    const waypointLabel = node.step === 1 ? "Trailhead" : "Waypoint";
    const choicesHtml = node.choices.map((c, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `<button type="button" class="survey-choice" data-choice="${escapeHtml(c.id)}">
          <span class="survey-choice-num">${num}</span>
          <span class="survey-choice-copy">
            <span class="survey-choice-label">${escapeHtml(c.label)}</span>
            ${c.hint ? `<span class="survey-choice-hint">${escapeHtml(c.hint)}</span>` : ""}
          </span>
          <span class="survey-choice-chevron" aria-hidden="true">›</span>
        </button>`;
    }).join("");
    el.innerHTML = `<div class="survey-progress">
        <span>${waypointLabel}</span>
        <span class="survey-progress-steps">Waypoint ${node.step} of ${node.steps}</span>
      </div>
      ${crumbs}
      <p class="survey-prompt">${escapeHtml(node.prompt)}</p>
      <div class="survey-choices">${choicesHtml}</div>
      ${state.surveyPath.length ? `<div class="survey-actions"><button type="button" class="btn btn-secondary btn-sm" id="survey-back">Previous waypoint</button></div>` : ""}`;
    el.querySelectorAll(".survey-choice").forEach(btn => {
      btn.addEventListener("click", () => selectSurveyChoice(btn.dataset.choice));
    });
    el.querySelector("#survey-back")?.addEventListener("click", () => {
      const last = state.surveyPath.pop();
      state.surveyNode = last ? last.nodeId : GILBERT_SURVEY.start;
      state.surveyDone = false;
      state.iconFilters = [];
      state.goalText = "";
      renderGilbertSurvey();
      renderValueIconKey();
      renderAllCards();
      renderProjectToc();
      renderSummary();
      saveState();
    });
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
      state.generalSuggestions = saved.generalSuggestions || "";
      state.submitterEmail = saved.submitterEmail || "";
      if (state.generalSuggestions) document.getElementById("general-suggestions").value = state.generalSuggestions;
      if (state.submitterEmail) document.getElementById("submitted-email").value = state.submitterEmail;
      if (saved.invoicePaymentMonths != null) {
        state.invoicePaymentMonths = saved.invoicePaymentMonths;
        const monthsEl = document.getElementById("invoice-payment-months");
        if (monthsEl) monthsEl.value = saved.invoicePaymentMonths;
      }
      updateInvoiceScheduleAmount();
      if (saved.goalText) state.goalText = saved.goalText;
      if (Array.isArray(saved.surveyPath)) state.surveyPath = saved.surveyPath;
      if (saved.surveyNode) state.surveyNode = saved.surveyNode;
      if (saved.surveyDone) state.surveyDone = !!saved.surveyDone;
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
    state.generalSuggestions = document.getElementById("general-suggestions").value;
    state.submitterEmail = document.getElementById("submitted-email").value;
    syncPaymentTermsFromDom();
    localStorage.setItem("pav-project-picker", JSON.stringify({
      retainer: state.retainer,
      projects: [...state.projects],
      expanded: [...state.expanded],
      expandAll: isExpandAll(),
      notes: state.notes,
      generalSuggestions: state.generalSuggestions,
      submitterEmail: state.submitterEmail,
      invoicePaymentMonths: state.invoicePaymentMonths,
      invoicePaymentMonthlyAmount: state.invoicePaymentMonthlyAmount,
      goalText: state.goalText,
      surveyNode: state.surveyNode,
      surveyPath: state.surveyPath,
      surveyDone: state.surveyDone,
      iconFilters: state.iconFilters
    }));
    updateSubmitButtons();
  }

  function fmt(n) { return "$" + n.toLocaleString(); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function hasAnyNotes() {
    if (state.generalSuggestions || document.getElementById("general-suggestions").value.trim()) return true;
    return Object.values(state.notes).some(n => n && String(n).trim());
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

    return `
      <div class="card${retainerClass}${maintClass}${subClass}${pkgClass}${selFirst} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}">
        <div class="card-header">
          ${cardCheckColHtml(item, isRetainer, required, sel, chkDisabled)}
            <div class="card-body">
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
          <div class="detail-block">
            <h4>Questions or suggestions</h4>
            <textarea class="project-note" data-id="${id}" placeholder="Ask about scope, timing, or changes…">${escapeHtml(state.notes[id] || "")}</textarea>
          </div>
        </div>
      </div>`;
  }

  function renderAllCards() {
    const list = document.getElementById("project-list");
    const maintenance = sortCartFirst(getMaintenanceProjects());
    const optional = sortCartFirst(orderedProjects().filter(p => !p.monthlyOnly));
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

    const showMoreEl = document.getElementById("show-more-projects");
    if (showMoreEl) {
      showMoreEl.addEventListener("click", e => {
        e.preventDefault();
        state.showAllProjects = !state.showAllProjects;
        renderAllCards();
      });
    }

    list.querySelectorAll(".project-note").forEach(ta => {
      ta.addEventListener("click", e => e.stopPropagation());
      ta.addEventListener("input", e => {
        state.notes[ta.dataset.id] = e.target.value;
        saveState();
        updateSubmitButtons();
      });
    });

    list.querySelectorAll('input[type="checkbox"]').forEach(chk => {
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

    list.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.type === "checkbox" || e.target.classList.contains("expand-btn") || e.target.closest("a") || e.target.closest(".required-icon")) return;
        if (card.classList.contains("over-budget")) return;
        const id = card.dataset.id;
        if (card.dataset.required === "true") return;
        if (state.projects.has(id)) state.projects.delete(id);
        else state.projects.add(id);
        saveState();
        renderAllCards();
        renderSummary();
      });
      card.querySelector(".expand-btn").addEventListener("click", e => {
        e.stopPropagation();
        const id = card.dataset.id;
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        saveState();
        renderAllCards();
      });
    });
  }

  function getSelectedProjects() {
    return PROJECTS.filter(p => state.projects.has(p.id) && !p.monthlyOnly);
  }

  function hasSelection() {
    return true;
  }

  function canContinue() {
    return getInvoiceLineItems().length > 0 || hasAnyNotes();
  }

  function canSubmit() {
    const email = (document.getElementById("submitted-email") || {}).value || "";
    if (!email.trim()) return false;
    return getInvoiceLineItems().length > 0 || hasAnyNotes();
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

  function selectionCountLabel() {
    const lines = getInvoiceLineItems();
    const n = lines.length;
    if (!n) return "Continue to submit";
    return `Continue to submit · ${n} item${n === 1 ? "" : "s"}`;
  }

  function renderConfirmSelectionSummary() {
    const el = document.getElementById("confirm-selection-summary");
    if (!el) return;
    const lines = getInvoiceLineItems();
    if (!lines.length) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML = `<h3>Your selections</h3>
      <ol class="confirm-selection-list">${lines.map(row =>
        `<li><strong>${escapeHtml(row.title)}</strong>${row.fee ? ` · ${escapeHtml(row.fee)}` : ""}</li>`
      ).join("")}</ol>
      <p class="confirm-selection-meta">${lines.length} item${lines.length === 1 ? "" : "s"} selected · deposit billed separately</p>`;
  }

  function updateSubmitButtons() {
    CONFIG = getConfig();
    const cont = document.getElementById("continue-to-confirm");
    if (cont) {
      cont.disabled = !canContinue();
      cont.textContent = selectionCountLabel();
    }
    const submit = document.getElementById("submit-selections");
    if (submit) {
      submit.disabled = !canSubmit();
      submit.title = "";
    }
    updateWebhookWarning();
  }

  function showConfirmPage() {
    if (!canContinue()) return;
    renderConfirmSelectionSummary();
    document.getElementById("confirm-page").classList.add("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "false");
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    document.getElementById("submitted-email")?.focus();
  }

  function hideConfirmPage() {
    document.getElementById("confirm-page").classList.remove("show");
    document.getElementById("confirm-page").setAttribute("aria-hidden", "true");
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
      goalText: state.goalText || "",
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
      generalSuggestions: document.getElementById("general-suggestions").value.trim(),
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
    const colors = ["#4e2a84", "#b8860b", "#ffd700", "#6d28a8", "#f8f5ef", "#c9a86c", "#c2410c", "#166534"];
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

  function initGilbertGuide() {
    if (state.surveyDone && state.surveyPath.length) {
      state.iconFilters = iconsFromSurveyPath();
      state.goalText = goalFromSurveyPath();
    }
    renderGilbertSurvey();
  }

  const THEME_STORAGE_KEY = "gilbert-guide-theme";
  const THEME_DARK = "dark";
  const THEME_UNICORN = "unicorn";

  function normalizeTheme(value) {
    if (value === THEME_UNICORN || value === "light") return THEME_UNICORN;
    if (value === THEME_DARK) return THEME_DARK;
    return null;
  }

  function getPreferredTheme() {
    try {
      const q = normalizeTheme(new URLSearchParams(location.search).get("theme"));
      if (q) return q;
    } catch (e) { /* ignore */ }
    try {
      const stored = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
      if (stored) return stored;
    } catch (e) { /* ignore */ }
    /* Preferred presentation: cream unicorn + quiet trail questionnaire */
    return THEME_UNICORN;
  }

  let unicornFartTimer = null;
  let unicornFartHideTimer = null;

  function spawnUnicornFartPuffs(host) {
    if (!host) return;
    host.innerHTML = "";
    const colors = ["#c9a86c", "#e3c58d", "#f5efe4", "#c4b5fd", "#a78bfa", "#fff8e7", "#fff"];
    for (let i = 0; i < 16; i++) {
      const puff = document.createElement("span");
      puff.className = "unicorn-fart-puff";
      const size = 70 + Math.random() * 140;
      puff.style.width = size + "px";
      puff.style.height = size + "px";
      puff.style.left = (18 + Math.random() * 64) + "%";
      puff.style.top = (52 + Math.random() * 30) + "%";
      puff.style.background = colors[Math.floor(Math.random() * colors.length)];
      puff.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      puff.style.animationDelay = (Math.random() * 0.45) + "s";
      host.appendChild(puff);
    }
  }

  function hideUnicornFartCloud() {
    const overlay = document.getElementById("unicorn-fart-cloud");
    if (!overlay) return;
    overlay.classList.add("fade-out");
    window.clearTimeout(unicornFartHideTimer);
    unicornFartHideTimer = window.setTimeout(() => {
      overlay.classList.remove("show", "fade-out");
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      const puffs = document.getElementById("unicorn-fart-puffs");
      if (puffs) puffs.innerHTML = "";
    }, 560);
  }

  function playUnicornFartCloud() {
    const reduceMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overlay = document.getElementById("unicorn-fart-cloud");
    if (!overlay) return;
    window.clearTimeout(unicornFartTimer);
    window.clearTimeout(unicornFartHideTimer);
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.remove("fade-out");
    // restart CSS animations
    void overlay.offsetWidth;
    overlay.classList.add("show");
    spawnUnicornFartPuffs(document.getElementById("unicorn-fart-puffs"));
    const img = document.getElementById("unicorn-fart-gilbert");
    if (img) {
      // restart gif
      const src = img.getAttribute("src") || "assets/gilbert-unicorn-dance.gif";
      img.src = src.split("?")[0] + "?t=" + Date.now();
    }
    unicornFartTimer = window.setTimeout(hideUnicornFartCloud, reduceMotion ? 1600 : 3200);
  }

  function applyTheme(theme, options) {
    const opts = options || {};
    const prev = normalizeTheme(document.documentElement.getAttribute("data-theme"));
    const next = normalizeTheme(theme) || THEME_UNICORN;
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) { /* ignore */ }
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const isDark = next === THEME_DARK;
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Switch to unicorn theme" : "Switch to dark theme");
      btn.textContent = isDark ? "Unicorn" : "Dark";
    }
    if (opts.celebrate && next === THEME_UNICORN && prev !== THEME_UNICORN) {
      playUnicornFartCloud();
    }
  }

  function initThemeToggle() {
    applyTheme(getPreferredTheme());
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = normalizeTheme(document.documentElement.getAttribute("data-theme")) || THEME_UNICORN;
      applyTheme(current === THEME_DARK ? THEME_UNICORN : THEME_DARK, { celebrate: true });
    });
    const overlay = document.getElementById("unicorn-fart-cloud");
    if (overlay) {
      overlay.addEventListener("click", hideUnicornFartCloud);
    }
    try {
      if (new URLSearchParams(location.search).get("unicornFart") === "1") {
        applyTheme(THEME_UNICORN);
        playUnicornFartCloud();
      }
    } catch (e) { /* ignore */ }
  }

  function showThankYou(payload) {
    const selected = getSelectedProjects();
    const depositAmt = CONFIG.depositAmount;
    const depositUrl = CONFIG.quickbooksDepositUrl || payload.quickbooksDepositUrl;

    const thankSub = document.getElementById("thank-you-sub");
    if (thankSub) {
      thankSub.textContent =
        "Your selections build a stronger marketing stack — Gilded Goose will execute with clear deliverables.";
    }

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
    if (payload.generalSuggestions) {
      notesHtml += `<p style="margin-top:0.75rem;font-size:0.88rem;color:var(--secondary)"><strong>Your notes:</strong> ${escapeHtml(payload.generalSuggestions)}</p>`;
    }
    const noteEntries = Object.entries(payload.projectNotes || {});
    if (noteEntries.length) {
      notesHtml += "<ul class=\"thank-you-list\" style=\"margin-top:0.5rem\">" +
        noteEntries.map(([id, text]) => `<li><strong>${escapeHtml(id)}:</strong> ${escapeHtml(text)}</li>`).join("") + "</ul>";
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
  }

  function renderInvoiceSummary() {
    renderPlanSummary();
  }

  function renderSummary() {
    renderPlanSummary();
    renderCondensedToc();
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    renderProjectToc();
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
  document.getElementById("general-suggestions").addEventListener("input", saveState);
  document.getElementById("submitted-email").addEventListener("input", () => { saveState(); updateSubmitButtons(); });
  document.getElementById("invoice-payment-months").addEventListener("change", () => {
    updateInvoiceScheduleAmount();
    saveState();
  });
  document.getElementById("expand-all-projects").addEventListener("change", e => setExpandAll(e.target.checked));

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
  initThemeToggle();
  initGilbertGuide();
  renderPackageIntro();
  renderValueIconKey();
  renderAllCards();
  suggestPlan(true);
  renderSummary();
  if (state.surveyDone) {
    const toc = document.getElementById("project-toc");
    if (toc) toc.open = true;
  }
})();
