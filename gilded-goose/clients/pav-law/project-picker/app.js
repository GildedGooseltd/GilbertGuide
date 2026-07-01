(function () {
  function getConfig() {
    return Object.assign(
      { webhookUrl: "", depositAmount: 2500, quickbooksDepositUrl: "" },
      typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
    );
  }
  let CONFIG = getConfig();
  const GILBERT_ICON = PROJECT_DATA.guideIcon || PROJECT_DATA.paviIcon || "assets/gigi-goose-guide.svg";
  const GILBERT_HERO = PROJECT_DATA.guideHero || "assets/gigi-goose-walk.png";
  const GILBERT_SEAL = PROJECT_DATA.guideSeal || "assets/gigi-logo-frame.png";
  const GUIDE_NAME = PROJECT_DATA.guideName || "Lord Gilbert Granville";
  const GUIDE_SHORT = PROJECT_DATA.guideShortName || "Gilbert";

  function isRequiredProject(item, isRetainer) {
    return isRetainer || item.id === "RETAINER" || item.category === "Retainer";
  }

  function isPriorityUrgent(item) {
    return !!item.enabler || item.status === "wip" || hasPartialProgress(item);
  }

  const REQUIRED_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

  const ACCOUNT_DATA_ICON = "assets/gilded-goose-account.svg";

  function accountDataIconHtml() {
    return `<img class="pav-law-shield-img" src="${ACCOUNT_DATA_ICON}" alt="" width="24" height="29">`;
  }

  const VALUE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25L8.29 2.34a1 1 0 0 0-1.42 0l-2.76 2.76a1 1 0 0 0 0 1.42l10.42 10.42"/></svg>`,
    retainer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/><circle cx="5" cy="10.5" r="2"/><path d="M1 20v-0.5a2.5 2.5 0 0 1 2-2.45"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 9v11"/><path d="M13 13h5"/><path d="M13 17h5"/></svg>`,
    seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5.5 5.5"/></svg>`,
    referrals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="8" r="3"/><path d="M3 20v-2a4 4 0 0 1 4-4h0"/><circle cx="17" cy="8" r="3"/><path d="M21 20v-2a4 4 0 0 0-4-4h0"/><path d="M10.5 10.5h3"/><path d="M12 10.5v2.5"/><path d="M11 13h2"/></svg>`,
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

  function priorityTocHtml(item) {
    const required = isRequiredProject(item, !!item.isRetainer);
    const hasPriority = item.priority != null && item.priority !== "" && !Number.isNaN(Number(item.priority));
    const p = hasPriority ? Math.trunc(Number(item.priority)) : "";
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
    generalSuggestions: "",
    submitterEmail: "",
    invoicePaymentMonths: "",
    invoicePaymentMonthlyAmount: "",
    filters: { hideNonMatching: true, maxFee: null },
    goalText: "",
    tocSort: { field: "priority", dir: "asc" },
    showAllProjects: false
  };

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
    return `<span class="account-data-shield" title="${tip}" aria-label="Account data: ${tip}">${accountDataIconHtml()}</span>`;
  }

  function cardCornerIconsHtml(item, isRetainer, inline) {
    const valueHtml = valueIconsHtml({ ...item, isRetainer });
    const dataHtml = accountDataIconHtml(item);
    if (!valueHtml && !dataHtml) return "";
    const cls = inline ? "card-icons-inline" : "card-icons-corner";
    return `<div class="${cls}">${valueHtml}${dataHtml}</div>`;
  }

  function renderValueIconKey() {
    const el = document.getElementById("value-icon-key");
    if (!el) return;
    el.innerHTML = `<span class="value-icon-key-title">Value icons key</span>` +
      VALUE_ICON_DEFS.map(d =>
        `<span class="key-item">${valueIconMarkup(d)}<span class="key-item-label">${escapeHtml(d.label)}</span></span>`
      ).join("") +
      `<span class="key-item"><span class="account-data-shield key-shield">${accountDataIconHtml()}</span><span class="key-item-label">Account data</span></span>`;
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

    const f = getFilters();
    const cost = getSelectionCost();
    const hasGoal = !!state.goalText.trim();
    const hasMaxFee = f.maxFee != null;

    if (!selected.length && !hasGoal) return null;

    const introParts = [];
    if (hasGoal) {
      const g = state.goalText.trim();
      introParts.push(`Based on your goals: "${g.length > 140 ? g.slice(0, 140) + "…" : g}"`);
    }
    if (selected.length) {
      if (hasMaxFee) {
        introParts.push(`Estimated total ${fmt(cost)}${cost > f.maxFee ? " — above your max fee filter" : ` — within ${fmt(f.maxFee)} max`}.`);
      } else {
        introParts.push(`Estimated total ${fmt(cost)}.`);
      }
    }

    if (!selected.length) {
      return { intro: introParts.join(" ") };
    }

    const projectItems = selected.filter(i => !i.isRetainer && !i.monthlyOnly);
    if (projectItems.length > 1) {
      const hasEnabler = selected.some(i => i.enabler);
      const hasLeads = selected.some(i => getValueIcons(i).some(v => v.id === "leads" || v.id === "retainer"));
      const hasIntake = selected.some(i => getValueIcons(i).some(v => v.id === "intake" || v.id === "crm"));
      if (hasEnabler && hasLeads) {
        introParts.push("This mix fixes infrastructure and tracking first, then scales lead generation — the order that protects ad spend.");
      } else if (hasEnabler && hasIntake) {
        introParts.push("Foundation and intake work together so every lead is captured, routed, and followed up before you grow spend.");
      } else if (hasLeads && hasIntake) {
        introParts.push("Lead generation plus intake improvements mean more consults from the same marketing budget.");
      } else if (hasLeads) {
        introParts.push("These projects focus on measurable leads and calls that tie back to signed cases.");
      } else {
        introParts.push("These projects stack — each piece supports the others so marketing compounds instead of staying siloed.");
      }
    } else if (selected.length > 1) {
      introParts.push("Retainer and maintenance keep performance steady while project work delivers the upgrades.");
    }

    return { intro: introParts.join(" ") };
  }

  function renderPlanSummary() {
    const el = document.getElementById("plan-summary");
    if (!el) return;
    const items = getInvoiceLineItems();
    const rec = buildRecommendation();
    const parts = [];

    if (state.goalText.trim() && rec && rec.intro) {
      parts.push(`<div class="recommendation-box"><h3>Why this combination</h3><p>${escapeHtml(rec.intro)}</p></div>`);
    } else if (state.goalText.trim()) {
      parts.push(`<div class="recommendation-box empty"><h3>Why this combination</h3><p>Adjust your goal or pick projects below.</p></div>`);
    }

    if (!items.length) {
      parts.push(`<p class="empty-state">Your cart is empty — describe your goals above or pick projects below.</p>`);
    } else {
      parts.push(`<div class="total-box cart-box">${buildTotalsHtml()}</div>`);
    }

    el.innerHTML = parts.join("");
    updateGilbertTip();
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
      parts.push(`<ul class="card-objectives">${bullets.map(b =>
        `<li>${escapeHtml(String(b).replace(/^Deliverable:\s*/i, "").trim())}</li>`
      ).join("")}</ul>`);
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

  function renderProjectToc() {
    const listEl = document.getElementById("toc-list");
    const statusEl = document.getElementById("table-filter-status");
    const hintEl = document.getElementById("toc-summary-hint");
    if (!listEl) return;
    const items = sortTocItems(
      allItemsByPriority().filter(item => itemPassesCostPriorityFilter(item))
    );
    listEl.innerHTML = items.map(item => {
      const selected = isItemSelected(item);
      const inPkg = isInRecommendedPackage(item);
      const blurb = briefValueAdd(item);
      return `<tr class="toc-item${selected ? " row-selected" : ""}${inPkg ? " row-package" : ""}" data-id="${item.id}">
        <td class="toc-col-priority"><span class="toc-priority">${priorityTocHtml(item)}</span></td>
        <td class="toc-col-project toc-title"><a href="#project-${item.id}">${requiredMarkerHtml(item, !!item.isRetainer)}${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a></td>
        <td class="toc-col-blurb toc-blurb">${escapeHtml(blurb)}</td>
        <td class="toc-col-icons toc-value">${valueIconsHtml(item)}</td>
      </tr>`;
    }).join("");
    if (hintEl) {
      const selCount = items.filter(i => isItemSelected(i)).length;
      hintEl.textContent = selCount ? `${items.length} projects · ${selCount} selected` : `${items.length} projects`;
    }
    if (statusEl) {
      const total = allItemsByPriority().length;
      const shown = items.length;
      statusEl.textContent = costFiltersActive() && shown !== total
        ? `Showing ${shown} of ${total} projects`
        : "";
    }
    updateTocSortUi();
  }

  function getFilters() {
    const maxFeeRaw = document.getElementById("filter-max-fee").value;
    state.filters.maxFee = maxFeeRaw === "" ? null : Math.max(0, Number(maxFeeRaw));
    state.filters.hideNonMatching = document.getElementById("filter-hide-nonmatching").checked;
    return state.filters;
  }

  function costFiltersActive() {
    const f = getFilters();
    return f.maxFee != null;
  }

  function itemFeeForFilter(item, isRetainer) {
    if (isRetainer) return item.fee;
    return itemSelectionCost(item);
  }

  function itemPassesCostPriorityFilter(item) {
    const f = getFilters();
    const isRetainer = item.isRetainer || item.id === "RETAINER";
    const cost = itemFeeForFilter(item, isRetainer);
    if (f.maxFee != null && cost > f.maxFee) return false;
    return true;
  }

  function filtersActive() {
    return costFiltersActive() || !!state.goalText.trim();
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
    const f = getFilters();
    const classes = [];
    const id = isRetainer ? "RETAINER" : item.id;
    const selected = isRetainer ? state.retainer : state.projects.has(id);

    if (!itemPassesCostPriorityFilter({ ...item, isRetainer }) && !selected) {
      if (f.hideNonMatching) classes.push("filtered-out");
    }

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
    getFilters();
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
    document.getElementById("filter-max-fee").value = "";
    state.filters = { hideNonMatching: true, maxFee: null };
    state.projects = new Set();
    state.recommended = new Set();
    ensureRequiredMaintenance();
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
      if (saved.filters) {
        if (saved.filters.hideNonMatching != null) document.getElementById("filter-hide-nonmatching").checked = saved.filters.hideNonMatching;
        if (saved.filters.maxFee != null) document.getElementById("filter-max-fee").value = saved.filters.maxFee;
      }
      if (saved.goalText) {
        document.getElementById("goal-input").value = saved.goalText;
        state.goalText = saved.goalText;
      }
      if (saved.expanded) state.expanded = new Set(saved.expanded);
      if (saved.expandAll) allProjectIds().forEach(id => state.expanded.add(id));
    } catch (e) {}
    ensureRequiredMaintenance();
  }

  function saveState() {
    ensureRequiredMaintenance();
    getFilters();
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
      filters: state.filters,
      goalText: state.goalText
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
    el.hidden = !!cfg.webhookUrl;
  }

  function updateSubmitButtons() {
    CONFIG = getConfig();
    const cont = document.getElementById("continue-to-confirm");
    if (cont) cont.disabled = !canContinue();
    const submit = document.getElementById("submit-selections");
    if (submit) {
      submit.disabled = !canSubmit();
      submit.title = CONFIG.webhookUrl ? "" : "Webhook not configured on live site — set PAV_PICKER_WEBHOOK_URL in GitHub Secrets";
    }
    updateWebhookWarning();
  }

  function showConfirmPage() {
    if (!canContinue()) return;
    const guideImg = document.getElementById("confirm-gilbert");
    if (guideImg) guideImg.src = GILBERT_ICON;
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

  function pickGilbertTip() {
    const items = getInvoiceLineItems();
    const goal = (state.goalText || "").trim();
    const count = items.length;
    if (!goal && !count) {
      return `${GUIDE_SHORT} here — describe your goals and I'll match projects to your cart.`;
    }
    if (goal && !count) {
      return "Good start. I'll suggest matches as you type — or pick projects below.";
    }
    if (count === 1) {
      return "One in the cart. Add foundation or retainer work if you want a fuller stack.";
    }
    if (count >= 2 && count <= 4) {
      return "Solid mix. Check “Why this combination” in your cart for how they fit.";
    }
    if (count > 4) {
      return "Full cart — use invoice schedule on submit to spread project fees.";
    }
    if (state.retainer && count > 0) {
      return "Retainer plus projects — ads stay managed while upgrades ship.";
    }
    return "Pick projects or refine your goal — I'm here to help you prioritize.";
  }

  function updateGilbertTip() {
    const bubble = document.getElementById("gilbert-tip-bubble");
    if (bubble) bubble.textContent = pickGilbertTip();
  }

  function initGilbertGuide() {
    const guideImg = document.getElementById("gilbert-guide-img");
    if (guideImg) {
      guideImg.src = GILBERT_HERO;
      guideImg.alt = `${GUIDE_NAME} — your Gilded Goose guide`;
    }
    updateGilbertTip();
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
    updateInvoiceScheduleAmount();
    updateSubmitButtons();
    renderProjectToc();
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
      showToast("Submit backend not configured — add PAV_PICKER_WEBHOOK_URL in GitHub repo Secrets, then redeploy.", true);
    } else {
      try {
        const res = await fetch(CONFIG.webhookUrl, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        const text = await res.text();
        let data = {};
        try { data = JSON.parse(text); } catch (e) { /* GAS may return empty on some errors */ }
        if (res.ok && (data.ok || text.includes('"ok":true'))) ok = true;
        else throw new Error(data.error || text.slice(0, 120) || `HTTP ${res.status}`);
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
  document.getElementById("goal-input").addEventListener("input", () => {
    state.goalText = document.getElementById("goal-input").value;
    saveState();
    scheduleSuggestPlan();
  });
  document.getElementById("clear-filters").addEventListener("click", clearFilters);
  document.getElementById("filter-max-fee").addEventListener("input", () => {
    getFilters();
    if (state.goalText.trim()) scheduleSuggestPlan();
    else {
      renderAllCards();
      renderProjectToc();
      renderSummary();
    }
  });
  document.getElementById("filter-hide-nonmatching").addEventListener("change", () => {
    getFilters();
    renderAllCards();
    renderProjectToc();
    renderSummary();
  });
  document.getElementById("expand-all-projects").addEventListener("change", e => setExpandAll(e.target.checked));

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
  document.getElementById("plan-summary")?.addEventListener("click", e => {
    const link = e.target.closest(".invoice-item-link");
    if (!link) return;
    e.preventDefault();
    const id = (link.getAttribute("href") || "").replace("#project-", "");
    if (!id) return;
    state.expanded.add(id);
    saveState();
    renderAllCards();
    requestAnimationFrame(() => {
      const card = document.getElementById("project-" + id);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  renderPackageIntro();
  renderValueIconKey();
  renderAllCards();
  if (state.goalText.trim()) suggestPlan(true);
  else {
    renderSummary();
  }
})();
