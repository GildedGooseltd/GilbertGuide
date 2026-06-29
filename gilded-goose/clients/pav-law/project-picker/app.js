(function () {
  const CONFIG = Object.assign(
    { webhookUrl: "", depositAmount: 2500, quickbooksDepositUrl: "" },
    typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
  );
  const STAR = "★";
  const PAVI_IMG = PROJECT_DATA.paviIcon || "assets/pavi-icon.png";
  const HOT_PRIORITY_MAX = 6;

  function isHotPriority(item) {
    const p = item.priority;
    return p != null && p >= 1 && p <= HOT_PRIORITY_MAX;
  }

  function hotStarHtml(inline) {
    return `<span class="hot-star${inline ? " hot-star-inline" : ""}" title="Top priority — work on next">★</span>`;
  }

  function isPriorityUrgent(item) {
    return isHotPriority(item) || !!item.enabler || item.status === "wip" || hasPartialProgress(item);
  }

  function priorityTocHtml(item) {
    const required = item.isRetainer || item.id === "RETAINER" || item.monthlyOnly;
    const p = item.priority != null && item.priority !== "" ? Math.trunc(Number(item.priority)) : "—";
    const urgent = isPriorityUrgent(item) ? '<span class="priority-urgent" title="Urgent or fixing an active issue">!</span>' : "";
    const hot = isHotPriority(item) ? hotStarHtml(false) : "";
    const req = required ? '<span class="badge badge-required table-required">Req</span>' : "";
    return `<span class="toc-priority-inner">${urgent}${hot}${p}</span>${req}`;
  }

  const VALUE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.25"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.55 1.55M16.85 16.85l1.55 1.55M5.6 18.4l1.55-1.55M16.85 7.15l1.55-1.55"/></svg>`,
    retainer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4h4l2 5.5-2.5 1.8c1.2 2.4 3.2 4.4 5.6 5.6L17 14.5 22.5 16.5V20.5h-4C9.8 20.5 3.5 14.2 3.5 6V4h3z"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10H7z"/><path d="M4 10V4h6M14 20v-6h6"/></svg>`,
    seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5.5 5.5"/></svg>`,
    referrals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M8 14c2.2 0 4 1.2 4.8 3M16 10c-2.2 0-4 1.2-4.8 3"/></svg>`,
    efficiency: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M10 19V9M16 19v-6M22 19V3"/></svg>`,
    intake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v9H8l-4 4V5z"/></svg>`,
    creative: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-9 5 5 9-12"/></svg>`,
    general: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.4 6.8H21l-5.5 4 2.1 6.7L12 17.8 6.4 20.5l2.1-6.7L3 9.8h6.6L12 3z"/></svg>`
  };

  const VALUE_ICON_DEFS = [
    { id: "foundation", svgId: "foundation", cls: "icon-foundation", label: "Foundation — other marketing depends on this", match: item => !!item.enabler },
    { id: "retainer", svgId: "retainer", cls: "icon-retainer", label: "Ongoing paid media management", match: item => item.isRetainer || item.id === "RETAINER" || item.category === "Retainer" },
    { id: "leads", svgId: "leads", cls: "icon-leads", label: "Lead generation — calls and paid media", match: item => /paid media|outbound|display|search|seasonal/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "crm", svgId: "crm", cls: "icon-crm", label: "Pipeline, CRM, and follow-up", match: item => /crm/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "seo", svgId: "seo", cls: "icon-seo", label: "Organic search and visibility", match: item => /seo|blog|local search|website ux/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "referrals", svgId: "referrals", cls: "icon-referrals", label: "Referrals and repeat clients", match: item => /referral|testimonial|social proof|direct mail|mailer|case win/i.test((item.category || "") + (item.campaignType || "") + (item.title || "")) },
    { id: "efficiency", svgId: "efficiency", cls: "icon-efficiency", label: "Reporting, analytics, and spend control", match: item => /analytics|dashboard|strategy|audit|finance|operations/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "intake", svgId: "intake", cls: "icon-intake", label: "Intake, phone, and client experience", match: item => /intake|chat|after-hours|infrastructure|call infrastructure/i.test((item.category || "") + (item.campaignType || "") + (item.title || "")) },
    { id: "creative", svgId: "creative", cls: "icon-creative", label: "Creative, email, and brand reach", match: item => /creative|email|social/i.test((item.category || "") + (item.campaignType || "")) }
  ];

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

  function getPaymentTermsPayload() {
    const monthsEl = document.getElementById("invoice-payment-months");
    const amountEl = document.getElementById("invoice-payment-amount");
    const monthsRaw = monthsEl ? monthsEl.value : state.invoicePaymentMonths;
    const amountRaw = amountEl ? amountEl.value : state.invoicePaymentMonthlyAmount;
    const months = monthsRaw !== "" && monthsRaw != null ? Number(monthsRaw) : null;
    const monthlyAmount = amountRaw !== "" && amountRaw != null ? Math.max(0, Number(amountRaw)) : null;
    let label = null;
    if (months && monthlyAmount != null) {
      label = `${months} month${months === 1 ? "" : "s"} at ${fmt(monthlyAmount)}/mo (${fmt(monthlyAmount * months)} total)`;
    } else if (months) {
      label = `${months} month${months === 1 ? "" : "s"}`;
    } else if (monthlyAmount != null) {
      label = `${fmt(monthlyAmount)}/mo`;
    }
    return { months, monthlyAmount, label };
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

  function paymentBadgeHtml(item, isRetainer, compact) {
    const t = getPaymentType(item, isRetainer);
    if (t === "performance") {
      return `<span class="badge badge-payment-perf" title="Eligible for performance-based pay when KPIs are met">${compact ? "Perf" : "Perf pay"}</span>`;
    }
    return `<span class="badge badge-payment-flat" title="Fixed fee — flat payment required">${compact ? "Flat" : "Flat fee"}</span>`;
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
    const icons = [];
    for (const def of VALUE_ICON_DEFS) {
      if (def.match(item) && !icons.some(i => i.id === def.id)) icons.push(def);
      if (icons.length >= 3) break;
    }
    if (!icons.length) icons.push({ id: "general", svgId: "general", cls: "icon-general", label: "Business growth project" });
    return icons.slice(0, 3);
  }

  function valueIconsHtml(item) {
    const icons = getValueIcons(item);
    return `<span class="value-icons">${icons.map(valueIconMarkup).join("")}</span>`;
  }

  function renderValueIconKey() {
    const el = document.getElementById("value-icon-key");
    if (!el) return;
    el.innerHTML = `<span class="value-icon-key-title">Value icons key</span>` +
      VALUE_ICON_DEFS.map(d =>
        `<span class="key-item">${valueIconMarkup(d)}<span class="key-item-label">${escapeHtml(d.label)}</span></span>`
      ).join("");
  }

  function isItemSelected(item) {
    if (item.isRetainer || item.id === "RETAINER") return true;
    if (item.monthlyOnly) return true;
    return state.projects.has(item.id);
  }

  function getMaintenanceProjects() {
    return PROJECTS.filter(p => p.monthlyOnly);
  }

  function requiredMaintenanceMonthly() {
    let n = state.retainer ? RETAINER.fee : 0;
    getMaintenanceProjects().forEach(p => { n += p.fee; });
    return n;
  }

  function sortSelectedFirst(items) {
    return [...items].sort((a, b) => {
      const aSel = isItemSelected(a);
      const bSel = isItemSelected(b);
      if (aSel !== bSel) return aSel ? -1 : 1;
      return (a.priority ?? 99) - (b.priority ?? 99);
    });
  }

  function getInvoiceLineItems() {
    const rows = [];
    if (state.retainer) {
      rows.push({ id: "RETAINER", title: RETAINER.title, fee: feeLabelFor(RETAINER, true) });
    }
    getMaintenanceProjects().forEach(p => {
      rows.push({ id: p.id, title: p.title, fee: feeLabelFor(p, false) });
    });
    getSelectedProjects().forEach(p => {
      rows.push({ id: p.id, title: p.title, fee: feeLabelFor(p, false) });
    });
    return rows;
  }

  function getSuggestedItems() {
    const items = [];
    if (state.retainer) items.push({ ...RETAINER, isRetainer: true });
    getMaintenanceProjects().forEach(p => items.push({ ...p, isRetainer: false }));
    getSelectedProjects().forEach(p => items.push({ ...p, isRetainer: false }));
    return sortByPriority(items);
  }

  function projectAnchor(id) {
    return `#project-${id}`;
  }

  function renderSearchSuggestions() {
    const el = document.getElementById("search-suggestions");
    if (!el) return;
    const goal = state.goalText.trim();
    if (!goal) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    const items = getSuggestedItems();
    if (!items.length) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML = `
      <p class="search-suggestions-title">Suggested projects — click for full description</p>
      <ul class="search-suggestions-list">${items.map(item => {
        const id = item.isRetainer ? "RETAINER" : item.id;
        const pri = item.priority != null ? `P${Math.trunc(item.priority)}` : "—";
        return `<li>
          <a href="${projectAnchor(id)}" class="search-suggestion-link">${pri} · ${escapeHtml(item.title)}</a>
          <span class="search-suggestion-fee">${feeLabelFor(item, !!item.isRetainer)}</span>
        </li>`;
      }).join("")}</ul>`;
  }

  function renderRecommendation() {
    /* suggestions live under search panel */
  }

  function getAllItems() {
    return [{ ...RETAINER, isRetainer: true }, ...PROJECTS.map(p => ({ ...p, isRetainer: false }))];
  }

  function hasPartialProgress(item) {
    return (item.completedItems || []).length > 0 || (item.inProgressItems || []).length > 0;
  }

  function statusBadge(item) {
    if (item.status === "ongoing") return "";
    if (item.status === "completed") {
      return `<span class="badge badge-done" title="Completed">✓ Completed</span>`;
    }
    if (item.status === "wip" || hasPartialProgress(item)) {
      return `<span class="badge badge-wip" title="Work already started on this project">WIP</span>`;
    }
    return "";
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
    const merged = conciseDescription(item);
    if (!merged) return "";
    return `<div class="card-description"><p>${escapeHtml(merged)}</p></div>`;
  }

  function cornerMetaHtml(item) {
    const parts = [];
    const cat = item.category;
    const camp = item.campaignType;
    if (cat) parts.push(`<span class="badge badge-cat-corner">${escapeHtml(cat)}</span>`);
    if (camp && camp !== cat) parts.push(`<span class="badge badge-cat">${escapeHtml(camp)}</span>`);
    if (item.backedMetric) {
      const tip = escapeHtml(item.backedMetric.source || item.backedMetric.label || "Verified account data");
      parts.push(`<span class="verified-data-badge" title="${tip}">Account data</span>`);
    }
    return parts.length ? `<div class="card-corner-meta">${parts.join("")}</div>` : "";
  }

  function valueCompactDetailHtml(item) {
    const bullets = valueAddedBullets(item).slice(0, 4);
    let html = "";
    if (bullets.length) {
      html += `<div class="detail-block"><h4>Value add</h4><ul class="deliverable-list compact">${bullets.map(b =>
        `<li>${STAR} ${escapeHtml(String(b).replace(/^Deliverable:\s*/i, ""))}</li>`
      ).join("")}</ul></div>`;
    }
    if (item.backedMetric) {
      const src = item.backedMetric.source ? ` <span class="metric-source">(${escapeHtml(item.backedMetric.source)})</span>` : "";
      html += `<div class="detail-block account-data-detail"><h4>Account data</h4><p>${escapeHtml(item.backedMetric.label)}${src}</p></div>`;
    }
    return html;
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

  function marketingLearningsHtml(item) {
    const edu = item.marketingEducation;
    const links = item.learningsLinks;
    if (!edu && (!links || !links.length)) return "";
    const linkHtml = links && links.length
      ? `<ul class="ref-list">${links.map(r =>
          `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a></li>`
        ).join("")}</ul>`
      : "";
    return `<div class="detail-block marketing-learnings">
      <h4>Marketing Education</h4>
      ${edu ? `<p class="learnings-intro">${mdLinksToHtml(edu)}</p>` : ""}
      ${linkHtml}
    </div>`;
  }

  function progressHtml(item) {
    const done = (item.completedItems || []).map(t => `<li class="done-item">✓ ${t}</li>`).join("");
    const wip = (item.inProgressItems || []).map(t => `<li class="wip-item">⚙ ${t}</li>`).join("");
    if (!done && !wip) return "";
    return `<div class="progress-block">
      ${done ? `<h4>Completed</h4><ul class="progress-list">${done}</ul>` : ""}
      ${wip ? `<div class="in-progress-box"><h4>WIP</h4><ul class="progress-list">${wip}</ul></div>` : ""}
    </div>`;
  }

  function deliverablesHtml(item) {
    if (!item.deliverables || !item.deliverables.length) return "";
    return `<div class="detail-block">
      <h4>Key deliverables</h4>
      <ul class="deliverable-list">${item.deliverables.map(d => `<li>${STAR} ${d}</li>`).join("")}</ul>
    </div>`;
  }

  function isRequiredMaintenance(item, isRetainer) {
    return isRetainer || item.id === "RETAINER" || item.category === "Retainer" || !!item.monthlyOnly;
  }

  function ensureRequiredMaintenance() {
    state.retainer = true;
    getMaintenanceProjects().forEach(p => state.projects.add(p.id));
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
        <td class="toc-col-project toc-title"><a href="#project-${item.id}">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a> ${paymentBadgeHtml(item, !!item.isRetainer, true)}</td>
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

  function feeLabelFor(item, isRetainer) {
    if (isRetainer) return `${fmt(item.fee)} per month`;
    if (item.monthlyOnly) return `${fmt(item.fee)} per month`;
    if (item.ongoingFee) return `${fmt(item.fee)} setup + ${fmt(item.ongoingFee)}/mo`;
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
    const selected = isRetainer ? state.retainer : (item.monthlyOnly || state.projects.has(item.id));

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
    state.projects = new Set();
    state.recommended = new Set();
    ensureRequiredMaintenance();
    state.recommended.add("RETAINER");
    getMaintenanceProjects().forEach(p => state.recommended.add(p.id));

    if (goal) {
      const words = goal.toLowerCase().split(/\W+/).filter(Boolean);
      const scored = getAllItems().map(item => ({
        item, score: scoreItemForGoal(item, words), isRetainer: item.isRetainer
      })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      scored.slice(0, 6).forEach(({ item, isRetainer }) => {
        if (isRetainer || item.monthlyOnly) return;
        if (!itemPassesCostPriorityFilter({ ...item, isRetainer: false })) return;
        state.projects.add(item.id);
        state.recommended.add(item.id);
      });

      if (!scored.length && !silent) showToast("No strong matches — try different keywords", true);
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
      if (saved.invoicePaymentMonthlyAmount != null) {
        state.invoicePaymentMonthlyAmount = saved.invoicePaymentMonthlyAmount;
        const amountEl = document.getElementById("invoice-payment-amount");
        if (amountEl) amountEl.value = saved.invoicePaymentMonthlyAmount;
      }
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
    const sel = required || state.projects.has(id);
    const exp = state.expanded.has(id);
    const extra = getItemFilterClasses(item, isRetainer);
    const pkgClass = isInRecommendedPackage({ ...item, isRetainer }) ? " package-included" : "";
    const valueBlurb = briefValueAdd(item);
    const enablerBadge = item.enabler ? `<span class="badge badge-enabler">Foundation project</span>` : "";
    const retainerClass = isRetainer ? " retainer-card required-retainer" : "";
    const maintClass = item.monthlyOnly ? " maintenance-card required-maintenance" : "";
    const subClass = item.parentId ? " card-sub-related" : "";
    const selFirst = isFirstSelected ? " selected-first" : "";
    const chkDisabled = required ? " disabled" : "";
    const requiredBadge = item.monthlyOnly ? `<span class="badge badge-enabler">Required maintenance</span>` : "";

    return `
      <div class="card${retainerClass}${maintClass}${subClass}${pkgClass}${selFirst} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}" data-required="${required}">
        <div class="card-header">
          <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer"' : ""}${chkDisabled} ${sel ? "checked" : ""}>
            <div class="card-body">
              <div class="card-top-row">
                <div class="card-title">${escapeHtml(item.title)}</div>
                <div class="card-value-slot">
                  ${cornerMetaHtml(item)}
                  ${valueIconsHtml(item)}
                  <span class="card-value-blurb">${escapeHtml(valueBlurb)}</span>
                </div>
              </div>
              <div class="card-meta-row">
                ${paymentBadgeHtml(item, isRetainer, false)}
                ${relatedSubHtml(item)}
                ${statusBadge(item)}
                ${enablerBadge}
                ${requiredBadge}
              </div>
              ${descriptionHtml(item)}
            ${progressHtml(item)}
            <button type="button" class="expand-btn">${exp ? "Hide details" : "Deliverables and learnings"}</button>
          </div>
        </div>
        <div class="card-detail">
          ${valueCompactDetailHtml(item)}
          ${deliverablesHtml(item)}
          ${marketingLearningsHtml(item)}
          <div class="detail-block">
            <h4>Questions or suggestions</h4>
            <textarea class="project-note" data-id="${id}" placeholder="Ask about scope, timing, or changes…">${escapeHtml(state.notes[id] || "")}</textarea>
          </div>
        </div>
      </div>`;
  }

  function renderAllCards() {
    const list = document.getElementById("project-list");
    const maintenance = sortByPriority(getMaintenanceProjects());
    const optional = sortSelectedFirst(orderedProjects().filter(p => !p.monthlyOnly));
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
        if (e.target.type === "checkbox" || e.target.classList.contains("expand-btn") || e.target.closest("a")) return;
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

  function canSubmit() {
    const hasContent = hasSelection() || hasAnyNotes();
    if (!hasContent) return false;
    if (CONFIG.webhookUrl) {
      const email = (document.getElementById("submitted-email") || {}).value || "";
      if (!email.trim()) return false;
    }
    return true;
  }

  function updateSubmitButtons() {
    document.getElementById("submit-selections").disabled = !canSubmit();
  }

  function buildPayload() {
    const selected = getSelectedProjects();
    const maintenance = getMaintenanceProjects();
    const projectTotal = selected.reduce((s, p) => s + itemSelectionCost(p), 0);
    const maintMonthly = requiredMaintenanceMonthly();
    const submitterEmail = (document.getElementById("submitted-email") || {}).value || "";
    const paymentTerms = getPaymentTermsPayload();
    const maintRows = maintenance.map(p => ({
      id: p.id,
      title: p.title,
      fee: feeLabelFor(p, false),
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
      fee: feeLabelFor(p, false),
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
    parts.push(`You selected ${count} investment${count === 1 ? "" : "s"} that directly support how Pav Law wins and keeps clients.`);
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

  function showThankYou(payload) {
    const guideImg = document.getElementById("pavi-guide-img");
    if (guideImg && !guideImg.src.includes("pavi-full-body")) {
      guideImg.src = "assets/pavi-full-body.png";
    }
  }

  function initPaviGuide() {
    const guideImg = document.getElementById("pavi-guide-img");
    if (guideImg && !guideImg.src.includes("pavi-full-body")) {
      guideImg.src = "assets/pavi-full-body.png";
    }
  }

  function showThankYou(payload) {
    const selected = getSelectedProjects();
    const depositAmt = CONFIG.depositAmount;
    const depositUrl = CONFIG.quickbooksDepositUrl || payload.quickbooksDepositUrl;

    document.getElementById("thank-you-pavi").src = "assets/pavi-full-body.png";
    document.getElementById("thank-you-sub").textContent =
      "Your selections set Pav Law up for stronger leads, better intake, and marketing you can measure.";

    const lines = [];
    if (payload.retainer) lines.push(`<li><strong>${escapeHtml(RETAINER.title)}</strong> — ${fmt(RETAINER.fee)}/mo</li>`);
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
      <div class="thank-you-affirm"><strong>Why this is a strong choice for Pav Law</strong>${escapeHtml(buildThankYouAffirmation(payload, selected))}</div>
      ${buildThankYouReturnsHtml(selected, payload.retainer)}
      <div class="thank-you-selection">
        <h3>Your consulting estimate</h3>
        <p class="thank-you-total-single">${itemCount} item${itemCount === 1 ? "" : "s"} · <strong>${totalLine}</strong></p>
        <p class="thank-you-terms-line">Monthly payment terms: <strong>${termsLine}</strong></p>
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
    document.getElementById("main-app").classList.add("hidden");
    window.scrollTo(0, 0);
  }

  function buildTotalsHtml() {
    const items = getInvoiceLineItems();
    const total = getSelectionCost();
    if (!items.length) {
      return `<p class="empty-state">Selections appear here as you choose projects.</p>`;
    }
    const rows = items.map(row =>
      `<div class="total-row"><span><a href="${projectAnchor(row.id)}" class="invoice-item-link">${escapeHtml(row.title)}</a></span><span>${row.fee}</span></div>`
    ).join("");
    const label = items.length === 1 ? "1 item selected" : `${items.length} items selected`;
    return rows + `<div class="total-row grand total-row-single"><span>${label}</span><span>${fmt(total)}</span></div>`;
  }

  function renderInvoiceSummary() {
    const el = document.getElementById("invoice-summary-top");
    if (el) el.innerHTML = buildTotalsHtml();
  }

  function hideThankYou() {
    document.getElementById("thank-you").classList.remove("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "true");
    document.getElementById("main-app").classList.remove("hidden");
  }

  function renderSummary() {
    renderInvoiceSummary();
    renderSearchSuggestions();
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
    const payload = buildPayload();
    const btn = document.getElementById("submit-selections");
    btn.disabled = true;
    btn.textContent = "Submitting…";
    let ok = false;

    if (CONFIG.webhookUrl) {
      try {
        const res = await fetch(CONFIG.webhookUrl, {
          method: "POST", mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) ok = true;
        else throw new Error(data.error || "Submit failed");
      } catch (err) {
        showToast("Submit failed — try again or email Gilded Goose. " + err.message, true);
      }
    } else {
      showToast("Submit not configured yet — contact Gilded Goose.", true);
    }

    if (ok) showThankYou(payload);
    btn.textContent = "Submit selections";
    updateSubmitButtons();
  }

  document.getElementById("submit-selections").addEventListener("click", submitSelections);
  document.getElementById("btn-back-picker").addEventListener("click", hideThankYou);
  document.getElementById("general-suggestions").addEventListener("input", saveState);
  document.getElementById("submitted-email").addEventListener("input", () => { saveState(); updateSubmitButtons(); });
  document.getElementById("invoice-payment-months").addEventListener("change", saveState);
  document.getElementById("invoice-payment-amount").addEventListener("input", saveState);
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
  initPaviGuide();
  document.getElementById("search-suggestions")?.addEventListener("click", e => {
    const link = e.target.closest(".search-suggestion-link, .invoice-item-link");
    if (!link) return;
    const id = (link.getAttribute("href") || "").replace("#project-", "");
    if (!id) return;
    state.expanded.add(id);
    saveState();
    const card = document.getElementById("project-" + id);
    if (card) {
      card.classList.add("expanded");
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  renderPackageIntro();
  renderValueIconKey();
  renderAllCards();
  if (state.goalText.trim()) suggestPlan(true);
  else {
    renderSummary();
  }
})();
