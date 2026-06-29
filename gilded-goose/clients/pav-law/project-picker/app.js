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

  const VALUE_ICON_DEFS = [
    { id: "foundation", icon: "⚙", cls: "icon-foundation", label: "Foundation — other marketing depends on this", match: item => !!item.enabler },
    { id: "retainer", icon: "⟳", cls: "icon-leads", label: "Ongoing paid media management", match: item => item.isRetainer || item.id === "RETAINER" || item.category === "Retainer" },
    { id: "leads", icon: "📞", cls: "icon-leads", label: "Lead generation — calls & paid media", match: item => /paid media|outbound|display|search|seasonal/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "crm", icon: "🔄", cls: "icon-crm", label: "Pipeline, CRM & follow-up", match: item => /crm/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "seo", icon: "🔍", cls: "icon-seo", label: "Organic search & visibility", match: item => /seo|blog|local search|website ux/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "trust", icon: "⭐", cls: "icon-trust", label: "Trust, referrals & social proof", match: item => /referral|testimonial|social proof|direct mail|mailer/i.test((item.category || "") + (item.campaignType || "") + (item.title || "")) },
    { id: "efficiency", icon: "📊", cls: "icon-efficiency", label: "Reporting, analytics & spend control", match: item => /analytics|dashboard|strategy|audit|finance|operations/i.test((item.category || "") + (item.campaignType || "")) },
    { id: "intake", icon: "💬", cls: "icon-foundation", label: "Intake, phone & client experience", match: item => /intake|chat|after-hours|infrastructure|call infrastructure/i.test((item.category || "") + (item.campaignType || "") + (item.title || "")) },
    { id: "creative", icon: "🎨", cls: "icon-trust", label: "Creative, email & brand reach", match: item => /creative|email|social/i.test((item.category || "") + (item.campaignType || "")) }
  ];

  let RETAINER = PROJECT_DATA.retainer;
  let PROJECTS = PROJECT_DATA.projects;

  const state = {
    retainer: false,
    projects: new Set(),
    expanded: new Set(),
    recommended: new Set(),
    notes: {},
    generalSuggestions: "",
    submittedBy: "",
    submitterEmail: "",
    filters: { consultingBudget: null, hideNonMatching: true, maxFee: null, minPriority: null, maxPriority: null },
    goalText: "",
    tocSort: { field: "priority", dir: "asc" }
  };

  function getValueIcons(item) {
    const icons = [];
    for (const def of VALUE_ICON_DEFS) {
      if (def.match(item) && !icons.some(i => i.id === def.id)) icons.push(def);
      if (icons.length >= 3) break;
    }
    if (!icons.length) icons.push({ id: "general", icon: "✦", cls: "icon-seo", label: "Business growth project" });
    return icons.slice(0, 3);
  }

  function valueIconsHtml(item, compact) {
    const icons = getValueIcons(item);
    return `<span class="value-icons">${icons.map(i =>
      `<span class="value-icon ${i.cls}" title="${escapeHtml(i.label)}" aria-label="${escapeHtml(i.label)}">${i.icon}</span>`
    ).join("")}</span>`;
  }

  function renderValueIconKey() {
    const el = document.getElementById("value-icon-key");
    if (!el) return;
    el.innerHTML = `<span class="value-icon-key-title">Value icons key</span>` +
      VALUE_ICON_DEFS.map(d =>
        `<span class="key-item"><span class="value-icon ${d.cls}">${d.icon}</span> ${escapeHtml(d.label)}</span>`
      ).join("");
  }

  function isItemSelected(item) {
    if (item.isRetainer || item.id === "RETAINER") return true;
    return state.projects.has(item.id);
  }

  function sortSelectedFirst(items) {
    return [...items].sort((a, b) => {
      const aSel = isItemSelected(a);
      const bSel = isItemSelected(b);
      if (aSel !== bSel) return aSel ? -1 : 1;
      return (a.priority ?? 99) - (b.priority ?? 99);
    });
  }

  function buildRecommendation() {
    const selected = [];
    if (state.retainer) selected.push({ ...RETAINER, isRetainer: true });
    getSelectedProjects().forEach(p => selected.push({ ...p, isRetainer: false }));

    const f = getFilters();
    const cost = getSelectionCost();
    const hasGoal = !!state.goalText.trim();
    const hasBudget = f.consultingBudget != null;
    const hasFilters = filtersActive();

    if (!selected.length && !hasGoal && !hasBudget && !hasFilters) return null;

    const introParts = [];
    if (hasGoal) {
      const g = state.goalText.trim();
      introParts.push(`Goal: "${g.length > 140 ? g.slice(0, 140) + "…" : g}"`);
    }
    if (hasBudget && selected.length) {
      const pct = Math.min(100, Math.round((cost / f.consultingBudget) * 100));
      introParts.push(`Uses ${fmt(cost)} of ${fmt(f.consultingBudget)} consulting budget (${pct}%).`);
    } else if (hasBudget && !selected.length) {
      introParts.push(`Consulting budget ${fmt(f.consultingBudget)} — click Suggest plan or select projects below.`);
    }

    if (!selected.length) {
      return { intro: introParts.join(" "), bullets: [] };
    }

    const bullets = selected.map(item => {
      const icons = getValueIcons(item);
      const valueHint = icons.map(i => i.label.split("—")[0].trim()).join(", ");
      const topValue = valueAddedBullets(item)[0];
      let line = `${item.title} — ${valueHint}`;
      if (item.enabler) line += ". Foundation work: call tracking and ads depend on this first.";
      else if (topValue) line += `. ${topValue.replace(/^Deliverable:\s*/i, "")}`;
      return line;
    });

    if (selected.length > 1) {
      const hasEnabler = selected.some(i => i.enabler);
      const hasLeads = selected.some(i => getValueIcons(i).some(v => v.id === "leads" || v.id === "retainer"));
      if (hasEnabler && hasLeads) {
        introParts.push("This mix fixes infrastructure first, then scales lead generation — the order that protects ad spend.");
      } else if (hasLeads) {
        introParts.push("These projects focus on measurable leads and calls within your budget.");
      }
    }

    return { intro: introParts.join(" "), bullets };
  }

  function renderRecommendation() {
    const el = document.getElementById("recommendation-box");
    if (!el) return;
    const rec = buildRecommendation();
    if (!rec) {
      el.className = "recommendation-box empty";
      el.innerHTML = "<h3>Why this combination</h3><p>Enter a goal or consulting budget, then click <strong>Find matching projects</strong> or <strong>Suggest plan</strong>.</p>";
      return;
    }
    el.className = "recommendation-box";
    el.innerHTML = `<h3>Why this combination</h3>${rec.intro ? `<p>${escapeHtml(rec.intro)}</p>` : ""}${rec.bullets.length ? `<ul>${rec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : "<p>Select projects below or use Suggest plan.</p>"}`;
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

  function descriptionHtml(item) {
    const desc = stripInlineLinks(item.description);
    const value = stripInlineLinks(item.valueAdd || "");
    const merged = value ? `${desc} ${value}` : desc;
    let account = "";
    if (item.backedMetric) {
      account = `<p class="account-data-footnote"><strong>Account data:</strong> ${item.backedMetric.label} <span class="metric-source">(${item.backedMetric.source})</span></p>`;
    }
    return `<div class="card-description"><p>${merged}</p>${account}</div>`;
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

  function valueSectionHtml(title, items) {
    if (!items || !items.length) return "";
    return `<div class="value-section"><h5>${title}</h5><ul>${items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`;
  }

  function valueAddedHtml(item) {
    const v = buildBusinessValue(item);
    const hasContent = v.why || v.client.length || v.brand.length || v.marketing.length || v.business.length;
    if (!hasContent) return "";
    return `<div class="value-added-box">
      <h4 class="value-added-title">Business value</h4>
      ${v.why ? `<p class="value-why"><strong>Why invest in this:</strong> ${escapeHtml(v.why)}</p>` : ""}
      <div class="value-sections">
        ${valueSectionHtml("Impact on clients", v.client)}
        ${valueSectionHtml("Brand & reputation", v.brand)}
        ${valueSectionHtml("Marketing & growth", v.marketing)}
        ${valueSectionHtml("Business outcomes", v.business)}
      </div>
    </div>`;
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

  function priorityBadge(item) {
    if (item.priority == null || item.priority === "") return "";
    const p = Math.trunc(Number(item.priority));
    if (!p || p < 1) return "";
    const hot = isHotPriority(item) ? hotStarHtml(true) : "";
    return `<span class="badge badge-priority" title="Recommended priority order">${hot}P${p}</span>`;
  }

  function isRequiredRetainer(item, isRetainer) {
    return isRetainer || item.id === "RETAINER" || item.category === "Retainer";
  }

  function ensureRequiredRetainer() {
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
    ensureRequiredRetainer();
  }

  function renderPackageIntro() {
    const el = document.getElementById("package-intro");
    if (!el) return;
    const pkg = PROJECT_DATA.recommendedPackage;
    if (!pkg) { el.textContent = ""; return; }
    el.textContent = pkg.label || "Pre-selected package";
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
    ["priority", "fee"].forEach(f => {
      const btn = document.getElementById("toc-sort-" + f);
      const arrow = document.getElementById("sort-arrow-" + f);
      if (!btn || !arrow) return;
      if (state.tocSort.field === f) {
        btn.classList.add("active");
        arrow.textContent = state.tocSort.dir === "asc" ? "▲" : "▼";
      } else {
        btn.classList.remove("active");
        arrow.textContent = "↕";
      }
    });
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
      const fee = item.isRetainer ? `${fmt(item.fee)}/mo` : feeLabelFor(item, false);
      const pLabel = item.priority != null ? Math.trunc(item.priority) : "—";
      const hot = isHotPriority(item) ? hotStarHtml(false) : "";
      return `<li class="toc-item${selected ? " row-selected" : ""}${inPkg ? " row-package" : ""}" data-id="${item.id}">
        <span class="toc-priority">${hot}${pLabel}</span>
        <span class="toc-id">${escapeHtml(item.id || "")}</span>
        <span class="toc-title"><a href="#project-${item.id}">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a>${item.isRetainer ? ' <span class="badge badge-required table-required">Required</span>' : ""}</span>
        <span class="toc-fee">${fee}</span>
        <span class="toc-value">${valueIconsHtml(item, true)}</span>
      </li>`;
    }).join("");
    if (hintEl) {
      const hotIds = items.filter(isHotPriority).map(i => i.id).join(", ");
      const selCount = items.filter(i => isItemSelected(i)).length;
      hintEl.textContent = hotIds
        ? `★ Next: ${hotIds} · ${items.length} projects${selCount ? ` · ${selCount} selected` : ""}`
        : `${items.length} projects · click to expand`;
    }
    if (statusEl) {
      const total = allItemsByPriority().length;
      const shown = items.length;
      const sortLabel = state.tocSort.field === "fee"
        ? `fee (${state.tocSort.dir === "asc" ? "low→high" : "high→low"})`
        : `priority (${state.tocSort.dir === "asc" ? "P1 first" : "P21 first"})`;
      if (costPriorityFiltersActive() && shown !== total) {
        statusEl.textContent = `Showing ${shown} of ${total} · sorted by ${sortLabel} · ★ = work on next (P1–P6)`;
      } else {
        statusEl.textContent = `Sorted by ${sortLabel} · ★ = work on next (P1–P6)`;
      }
    }
    updateTocSortUi();
  }

  function getFilters() {
    const consultingRaw = document.getElementById("filter-consulting").value;
    const maxFeeRaw = document.getElementById("filter-max-fee").value;
    const minPRaw = document.getElementById("filter-priority-min").value;
    const maxPRaw = document.getElementById("filter-priority-max").value;
    state.filters.consultingBudget = consultingRaw === "" ? null : Math.max(0, Number(consultingRaw));
    state.filters.maxFee = maxFeeRaw === "" ? null : Math.max(0, Number(maxFeeRaw));
    state.filters.minPriority = minPRaw === "" ? null : Number(minPRaw);
    state.filters.maxPriority = maxPRaw === "" ? null : Number(maxPRaw);
    state.filters.hideNonMatching = document.getElementById("filter-hide-nonmatching").checked;
    return state.filters;
  }

  function costPriorityFiltersActive() {
    const f = getFilters();
    return f.maxFee != null || f.minPriority != null || f.maxPriority != null;
  }

  function itemFeeForFilter(item, isRetainer) {
    if (isRetainer) return item.fee;
    return itemSelectionCost(item);
  }

  function itemPassesCostPriorityFilter(item) {
    const f = getFilters();
    const isRetainer = item.isRetainer || item.id === "RETAINER";
    const cost = itemFeeForFilter(item, isRetainer);
    const p = item.priority ?? 99;
    if (f.maxFee != null && cost > f.maxFee) return false;
    if (f.minPriority != null && p < f.minPriority) return false;
    if (f.maxPriority != null && p > f.maxPriority) return false;
    return true;
  }

  function filtersActive() {
    const f = getFilters();
    return f.consultingBudget != null || costPriorityFiltersActive() || !!state.goalText.trim();
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
    let cost = 0;
    if (state.retainer) cost += RETAINER.fee;
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
    const selected = isRetainer ? state.retainer : state.projects.has(item.id);

    if (!itemPassesCostPriorityFilter({ ...item, isRetainer }) && !selected) {
      if (f.hideNonMatching) classes.push("filtered-out");
    }

    if (filtersActive() && f.consultingBudget != null) {
      const cost = getSelectionCost();
      const budget = f.consultingBudget;
      const remaining = budget - cost + (selected ? itemSelectionCost(item) : 0);
      const affordable = itemSelectionCost(item) <= remaining;
      const couldHelp = itemCouldHelpPlan(item, budget);
      if (!couldHelp && !selected) {
        if (f.hideNonMatching) classes.push("filtered-out");
        else classes.push("over-budget");
      } else if (!affordable && !selected) {
        if (f.hideNonMatching) classes.push("filtered-out");
        else classes.push("over-budget");
      }
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

  function matchGoalFromInput() {
    const goal = document.getElementById("goal-input").value.trim();
    if (!goal) { showToast("Describe your goal first", true); return; }
    state.goalText = goal;
    const words = goal.toLowerCase().split(/\W+/).filter(Boolean);
    const scored = getAllItems().map(item => ({
      item, score: scoreItemForGoal(item, words), isRetainer: item.isRetainer
    })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    if (!scored.length) { showToast("No strong matches — try different keywords", true); return; }

    state.retainer = false;
    state.projects = new Set();
    state.recommended = new Set();
    ensureRequiredRetainer();
    state.recommended.add("RETAINER");
    const budget = getFilters().consultingBudget;
    let spent = RETAINER.fee;

    scored.slice(0, 5).forEach(({ item, isRetainer }) => {
      if (isRetainer) return;
      if (budget != null && spent + itemSelectionCost(item) > budget) return;
      state.projects.add(item.id);
      state.recommended.add(item.id);
      spent += itemSelectionCost(item);
    });

    saveState();
    renderAllCards();
    renderSummary();
    renderFilterStatus();
    renderRecommendation();
    showToast("Selected " + ((state.retainer ? 1 : 0) + state.projects.size) + " matching projects — review and adjust");
  }

  function clearGoalMatch() {
    document.getElementById("goal-input").value = "";
    state.goalText = "";
    state.recommended = new Set();
    ensureRequiredRetainer();
    renderAllCards();
    renderRecommendation();
  }

  function suggestPlan() {
    getFilters();
    const budget = state.filters.consultingBudget;
    if (budget == null) { showToast("Enter a consulting budget first", true); return; }

    const candidates = [{ id: "RETAINER", fee: RETAINER.fee, isRetainer: true, enabler: false, priority: RETAINER.priority ?? 3 }];
    PROJECTS.forEach(p => {
      candidates.push({ id: p.id, fee: itemSelectionCost(p), isRetainer: false, enabler: !!p.enabler, priority: p.priority ?? 99 });
    });
    candidates.sort((a, b) => {
      if (a.enabler !== b.enabler) return a.enabler ? -1 : 1;
      return a.priority - b.priority;
    });

    state.retainer = false;
    state.projects = new Set();
    state.recommended = new Set();
    ensureRequiredRetainer();
    state.recommended.add("RETAINER");
    let spent = RETAINER.fee;

    for (const c of candidates) {
      if (c.isRetainer) continue;
      if (spent + c.fee > budget) continue;
      state.projects.add(c.id);
      state.recommended.add(c.id);
      spent += c.fee;
    }

    if (budget < RETAINER.fee) {
      showToast("Consulting budget is below the required retainer ($2,700/mo)", true);
      return;
    }

    saveState();
    renderAllCards();
    renderSummary();
    renderFilterStatus();
    renderRecommendation();
    showToast("Suggested plan applied — review and adjust");
  }

  function clearFilters() {
    document.getElementById("filter-consulting").value = "";
    document.getElementById("filter-max-fee").value = "";
    document.getElementById("filter-priority-min").value = "";
    document.getElementById("filter-priority-max").value = "";
    state.filters = { consultingBudget: null, hideNonMatching: true, maxFee: null, minPriority: null, maxPriority: null };
    state.recommended = new Set();
    ensureRequiredRetainer();
    renderAllCards();
    renderSummary();
    renderFilterStatus();
    renderRecommendation();
  }

  function renderFilterStatus() {
    const el = document.getElementById("filter-status");
    const f = getFilters();
    const cost = getSelectionCost();
    const parts = [];

    if (f.consultingBudget != null) {
      const pct = Math.min(100, Math.round((cost / f.consultingBudget) * 100));
      const over = cost > f.consultingBudget;
      parts.push(`<strong>Consulting selected:</strong> ${fmt(cost)} of ${fmt(f.consultingBudget)} (${pct}%)`);
      parts.push(`<div class="budget-bar-wrap"><div class="budget-bar"><div class="budget-bar-fill${over ? " over" : ""}" style="width:${pct}%"></div></div></div>`);
    }
    if (!filtersActive() && !state.projects.size && state.retainer) {
      el.className = "filter-status";
      el.innerHTML = "Enter a consulting budget or goal to filter and recommend projects.";
      return;
    }
    if (!filtersActive()) {
      el.className = "filter-status";
      el.innerHTML = "Enter a consulting budget or goal to filter projects.";
      return;
    }
    el.className = cost > (f.consultingBudget || Infinity) ? "filter-status bad" : "filter-status ok";
    el.innerHTML = parts.join("<br>");
  }

  function loadState() {
    try {
      const raw = localStorage.getItem("pav-project-picker");
      if (!raw) {
        applyRecommendedPackage();
        ensureRequiredRetainer();
        return;
      }
      const saved = JSON.parse(raw);
      state.retainer = !!saved.retainer;
      state.projects = new Set(saved.projects || []);
      state.notes = saved.notes || {};
      state.generalSuggestions = saved.generalSuggestions || "";
      state.submittedBy = saved.submittedBy || "";
      state.submitterEmail = saved.submitterEmail || "";
      if (state.generalSuggestions) document.getElementById("general-suggestions").value = state.generalSuggestions;
      if (state.submittedBy) document.getElementById("submitted-by").value = state.submittedBy;
      if (state.submitterEmail) document.getElementById("submitted-email").value = state.submitterEmail;
      if (saved.filters) {
        if (saved.filters.consultingBudget != null) document.getElementById("filter-consulting").value = saved.filters.consultingBudget;
        else if (saved.filters.budget != null) document.getElementById("filter-consulting").value = saved.filters.budget;
        if (saved.filters.hideNonMatching != null) document.getElementById("filter-hide-nonmatching").checked = saved.filters.hideNonMatching;
        if (saved.filters.maxFee != null) document.getElementById("filter-max-fee").value = saved.filters.maxFee;
        if (saved.filters.minPriority != null) document.getElementById("filter-priority-min").value = saved.filters.minPriority;
        if (saved.filters.maxPriority != null) document.getElementById("filter-priority-max").value = saved.filters.maxPriority;
      }
      if (saved.goalText) {
        document.getElementById("goal-input").value = saved.goalText;
        state.goalText = saved.goalText;
      }
    } catch (e) {}
    ensureRequiredRetainer();
  }

  function saveState() {
    ensureRequiredRetainer();
    getFilters();
    state.generalSuggestions = document.getElementById("general-suggestions").value;
    state.submittedBy = document.getElementById("submitted-by").value;
    state.submitterEmail = document.getElementById("submitted-email").value;
    localStorage.setItem("pav-project-picker", JSON.stringify({
      retainer: state.retainer,
      projects: [...state.projects],
      notes: state.notes,
      generalSuggestions: state.generalSuggestions,
      submittedBy: state.submittedBy,
      submitterEmail: state.submitterEmail,
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

  function cardHtml(item, isRetainer, isFirstSelected) {
    const id = item.id;
    const sel = isRetainer ? true : state.projects.has(id);
    const exp = state.expanded.has(id);
    const extra = getItemFilterClasses(item, isRetainer);
    const pkgClass = isInRecommendedPackage({ ...item, isRetainer }) ? " package-included" : "";
    const feeLabel = feeLabelFor(item, isRetainer);
    const enablerBadge = item.enabler ? `<span class="badge badge-enabler">Foundation project</span>` : "";
    const retainerClass = isRetainer ? " retainer-card required-retainer" : "";
    const subClass = item.parentId ? " card-sub-related" : "";
    const selFirst = isFirstSelected ? " selected-first" : "";

    return `
      <div class="card${retainerClass}${subClass}${pkgClass}${selFirst} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}">
        <div class="card-header">
          <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer" disabled' : ""} ${sel || isRetainer ? "checked" : ""}>
            <div class="card-body">
              <div class="card-top-row">
                <div class="card-title">${isHotPriority(item) ? hotStarHtml(true) : ""}${item.title}</div>
                <span class="card-price">${feeLabel}</span>
              </div>
              <div class="card-meta-row">
                ${priorityBadge(item)}
                <span class="card-corner-icons">${valueIconsHtml(item)}</span>
                ${relatedSubHtml(item)}
                ${statusBadge(item)}
                ${enablerBadge}
              </div>
              ${descriptionHtml(item)}
            ${valueAddedHtml(item)}
            ${progressHtml(item)}
            <button type="button" class="expand-btn">${exp ? "Hide details" : "Deliverables and learnings"}</button>
          </div>
        </div>
        <div class="card-detail">
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
    const ordered = orderedProjects();
    let markedFirst = false;
    const projectCards = ordered.map(p => {
      const sel = state.projects.has(p.id);
      const isFirst = sel && !markedFirst;
      if (isFirst) markedFirst = true;
      return cardHtml(p, false, isFirst);
    }).join("");
    list.innerHTML = cardHtml(RETAINER, true, true) + projectCards;

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
        const isRetainer = id === "RETAINER";
        if (isRetainer) return;
        if (chk.checked) state.projects.add(id);
        else state.projects.delete(id);
        saveState();
        renderAllCards();
        renderSummary();
        renderFilterStatus();
      });
    });

    list.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.type === "checkbox" || e.target.classList.contains("expand-btn") || e.target.closest("a")) return;
        if (card.classList.contains("over-budget")) return;
        const id = card.dataset.id;
        const isRetainer = card.dataset.retainer === "true";
        if (isRetainer) return;
        if (state.projects.has(id)) state.projects.delete(id);
        else state.projects.add(id);
        saveState();
        renderAllCards();
        renderSummary();
        renderFilterStatus();
      });
      card.querySelector(".expand-btn").addEventListener("click", e => {
        e.stopPropagation();
        const id = card.dataset.id;
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        renderAllCards();
      });
    });
  }

  function getSelectedProjects() {
    return PROJECTS.filter(p => state.projects.has(p.id));
  }

  function hasSelection() {
    return state.retainer || state.projects.size > 0;
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
    document.getElementById("download-csv").disabled = !hasSelection();
  }

  function buildPayload() {
    const selected = getSelectedProjects();
    const projectTotal = selected.reduce((s, p) => s + itemSelectionCost(p), 0);
    const submittedBy = (document.getElementById("submitted-by") || {}).value || "";
    const submitterEmail = (document.getElementById("submitted-email") || {}).value || "";
    return {
      submittedAt: new Date().toISOString(),
      submittedBy: submittedBy.trim(),
      submitterEmail: submitterEmail.trim(),
      goalText: document.getElementById("goal-input").value.trim(),
      filterConsultingBudget: state.filters.consultingBudget,
      filterMediaBudget: null,
      retainer: state.retainer,
      retainerFee: state.retainer ? fmt(RETAINER.fee) : null,
      retainerTitle: state.retainer ? RETAINER.title : null,
      depositAmount: CONFIG.depositAmount || null,
      quickbooksDepositUrl: CONFIG.quickbooksDepositUrl || null,
      projects: selected.map(p => ({
        id: p.id,
        title: p.title,
        fee: feeLabelFor(p, false),
        feeNum: itemSelectionCost(p),
        timeline: p.timeline || "",
        priority: p.priority ?? null,
        parentId: p.parentId || null
      })),
      projectsSubtotal: fmt(projectTotal),
      projectsSubtotalNum: projectTotal,
      grandTotalNote: state.retainer
        ? fmt(RETAINER.fee) + " per month retainer + " + fmt(projectTotal) + " first month projects"
        : fmt(projectTotal) + " projects only",
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

  const PAVI_CELEBRATE_LINES = [
    "Great picks! I'll get the team on it.",
    "Love these choices — big win for the firm!",
    "Pavi approves! Let's make it happen.",
    "Smart stack! Your clients will feel the difference."
  ];

  function showThankYou(payload) {
    const selected = getSelectedProjects();
    const depositAmt = CONFIG.depositAmount;
    const depositUrl = CONFIG.quickbooksDepositUrl || payload.quickbooksDepositUrl;

    document.getElementById("thank-you-pavi").src = PAVI_IMG;
    document.getElementById("pavi-speech").textContent =
      PAVI_CELEBRATE_LINES[Math.floor(Math.random() * PAVI_CELEBRATE_LINES.length)];
    document.getElementById("thank-you-sub").textContent =
      payload.submittedBy
        ? `${payload.submittedBy}, your selections set Pav Law up for stronger leads, better intake, and marketing you can measure.`
        : "Your selections set Pav Law up for stronger leads, better intake, and marketing you can measure.";

    const lines = [];
    if (payload.retainer) lines.push(`<li><strong>${escapeHtml(RETAINER.title)}</strong> — ${fmt(RETAINER.fee)}/mo</li>`);
    (payload.projects || []).forEach(p => lines.push(`<li><strong>${escapeHtml(p.title)}</strong> — ${p.fee}</li>`));
    if (!lines.length) lines.push("<li><em>Notes submitted — Gilded Goose will follow up</em></li>");

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
        <p style="margin:0 0 0.5rem;font-size:0.95rem;color:#fff;font-weight:600">${payload.grandTotalNote || "—"}</p>
        <ul class="thank-you-list">${lines.join("")}</ul>
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
    const selected = sortByPriority(getSelectedProjects());
    const projectTotal = selected.reduce((s, p) => s + itemSelectionCost(p), 0);
    if (!hasSelection()) {
      return '<div class="empty-state">Select projects below to see your consulting total.</div>';
    }
    let rows = "";
    if (state.retainer) {
      rows += `<div class="total-row"><span>${RETAINER.title}</span><span>${fmt(RETAINER.fee)} per month</span></div>`;
    }
    selected.forEach(p => {
      const label = p.ongoingFee ? `${p.title} (setup)` : p.title;
      const hot = isHotPriority(p) ? hotStarHtml(true) : "";
      rows += `<div class="total-row"><span>${hot}${escapeHtml(label)}</span><span>${feeLabelFor(p, false)}</span></div>`;
    });
    const grandLabel = state.retainer && selected.length
      ? `${fmt(projectTotal)} projects + ${fmt(RETAINER.fee)} per month retainer`
      : state.retainer ? `${fmt(RETAINER.fee)} per month retainer` : `${fmt(projectTotal)} total`;
    rows += `<div class="total-row grand"><span>Consulting total</span><span>${grandLabel}</span></div>`;
    return rows;
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

    const selected = getSelectedProjects();
    const deliverablesEl = document.getElementById("selected-deliverables");
    const items = [];
    if (state.retainer) items.push(RETAINER);
    selected.forEach(p => items.push(p));
    if (!items.length) {
      deliverablesEl.innerHTML = '<div class="empty-state">—</div>';
    } else {
      deliverablesEl.innerHTML = items.map(item =>
        `<div class="impact-item"><strong>${isHotPriority(item) ? hotStarHtml(true) : ""}${item.title}</strong><ul class="deliverable-list compact">${(item.deliverables || []).slice(0, 3).map(d => `<li>${STAR} ${d}</li>`).join("")}</ul></div>`
      ).join("");
    }

    updateSubmitButtons();
    renderFilterStatus();
    renderProjectToc();
    renderRecommendation();
  }

  function buildCsvRows() {
    const payload = buildPayload();
    const header = ["Submitted at", "Goal", "Retainer", "Retainer fee per month", "Project ID", "Project title", "Est. fee", "Timeline"];
    const rows = [header];
    const base = [payload.submittedAt, payload.goalText || "", payload.retainer ? "YES" : "NO", payload.retainer ? RETAINER.fee : ""];
    if (payload.retainer) rows.push([...base, "RETAINER", RETAINER.title, RETAINER.fee, RETAINER.timeline]);
    getSelectedProjects().forEach(p => rows.push([...base, p.id, p.title, p.fee, p.timeline]));
    if (!payload.retainer && !getSelectedProjects().length) return [];
    return rows;
  }

  function csvEscape(v) {
    const s = String(v == null ? "" : v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function downloadCsv() {
    const rows = buildCsvRows();
    if (!rows.length) return;
    const csv = rows.map(r => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pav-law-project-selection-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("CSV downloaded");
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
        downloadCsv();
        showToast("Webhook failed — CSV downloaded. " + err.message, true);
        ok = true;
      }
    } else {
      downloadCsv();
      showToast("Webhook not configured — CSV downloaded for now.");
      ok = true;
    }

    if (ok) showThankYou(payload);
    btn.textContent = "Submit selections and notes";
    updateSubmitButtons();
  }

  document.getElementById("pavi-header-img").src = PAVI_IMG;
  document.getElementById("download-csv").addEventListener("click", downloadCsv);
  document.getElementById("submit-selections").addEventListener("click", submitSelections);
  document.getElementById("btn-back-picker").addEventListener("click", hideThankYou);
  document.getElementById("general-suggestions").addEventListener("input", saveState);
  document.getElementById("submitted-by").addEventListener("input", saveState);
  document.getElementById("submitted-email").addEventListener("input", () => { saveState(); updateSubmitButtons(); });
  document.getElementById("match-goal").addEventListener("click", matchGoalFromInput);
  document.getElementById("clear-goal").addEventListener("click", clearGoalMatch);
  document.getElementById("goal-input").addEventListener("input", () => { state.goalText = document.getElementById("goal-input").value; saveState(); });
  document.getElementById("suggest-plan").addEventListener("click", suggestPlan);
  document.getElementById("clear-filters").addEventListener("click", clearFilters);
  ["filter-consulting", "filter-max-fee", "filter-priority-min", "filter-priority-max"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => { renderAllCards(); renderSummary(); renderRecommendation(); });
  });
  document.getElementById("filter-hide-nonmatching").addEventListener("change", () => { renderAllCards(); renderProjectToc(); renderRecommendation(); });

  document.querySelectorAll(".toc-sort-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      toggleTocSort(btn.dataset.sort);
    });
  });

  loadState();
  ensureRequiredRetainer();
  renderPackageIntro();
  renderValueIconKey();
  renderAllCards();
  renderSummary();
  renderFilterStatus();
  renderRecommendation();
})();
