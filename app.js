(function () {
  const CONFIG = Object.assign(
    { webhookUrl: "", depositAmount: 2500, quickbooksDepositUrl: "" },
    typeof window !== "undefined" && window.PAV_PICKER_CONFIG ? window.PAV_PICKER_CONFIG : {}
  );
  const STAR = "★";
  const PAVI_IMG = PROJECT_DATA.paviIcon || "assets/pavi-icon.png";

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
    filters: { consultingBudget: null, mediaBudget: null, hideNonMatching: true, maxFee: null, minPriority: null, maxPriority: null },
    goalText: ""
  };

  function getAllItems() {
    return [{ ...RETAINER, isRetainer: true }, ...PROJECTS.map(p => ({ ...p, isRetainer: false }))];
  }

  function hasPartialProgress(item) {
    return (item.completedItems || []).length > 0 || (item.inProgressItems || []).length > 0;
  }

  function statusBadge(item) {
    if (item.status === "ongoing") {
      return `<span class="badge badge-ongoing" title="Ongoing maintenance">⟳ Ongoing</span>`;
    }
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

  function valueAddedHtml(item) {
    const bullets = valueAddedBullets(item);
    if (!bullets.length) return "";
    return `<div class="value-added-box">
      <h4 class="value-added-title">Value Added</h4>
      <ul class="value-added-list">${bullets.map(b => `<li>${STAR} ${b}</li>`).join("")}</ul>
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
    return `<span class="badge badge-priority" title="Recommended priority order">P${p}</span>`;
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
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }

  function renderPriorityTable() {
    const tbody = document.getElementById("priority-table-body");
    const statusEl = document.getElementById("table-filter-status");
    if (!tbody) return;
    const items = allItemsByPriority().filter(item => itemPassesCostPriorityFilter(item));
    tbody.innerHTML = items.map(item => {
      const selected = item.isRetainer ? true : state.projects.has(item.id);
      const inPkg = isInRecommendedPackage(item);
      const fee = item.isRetainer ? `${fmt(item.fee)}/mo` : feeLabelFor(item, false);
      return `<tr class="${selected ? "row-selected" : ""}${inPkg ? " row-package" : ""}" data-id="${item.id}">
        <td class="col-p">${item.priority != null ? Math.trunc(item.priority) : "—"}${item.isRetainer ? ' <span class="badge badge-required table-required">Required</span>' : ""}${inPkg ? '<span class="pkg-dot" title="In recommended package">●</span>' : ""}</td>
        <td><a class="table-project-link${item.parentId ? " table-project-sub" : ""}" href="#project-${item.id}">${item.parentId ? "↳ " : ""}${escapeHtml(item.title)}</a></td>
        <td class="col-fee">${fee}</td>
        <td class="col-type">${escapeHtml(item.campaignType || item.category || "—")}</td>
      </tr>`;
    }).join("");
    if (statusEl) {
      const total = allItemsByPriority().length;
      const shown = items.length;
      if (costPriorityFiltersActive()) {
        statusEl.textContent = shown === total
          ? `Showing all ${total} projects`
          : `Showing ${shown} of ${total} projects (fee and priority filters)`;
      } else {
        statusEl.textContent = "";
      }
    }
  }

  function campaignTypeLabel(item) {
    return item.campaignType || item.category;
  }

  function getFilters() {
    const consultingRaw = document.getElementById("filter-consulting").value;
    const mediaRaw = document.getElementById("filter-media").value;
    const maxFeeRaw = document.getElementById("filter-max-fee").value;
    const minPRaw = document.getElementById("filter-priority-min").value;
    const maxPRaw = document.getElementById("filter-priority-max").value;
    state.filters.consultingBudget = consultingRaw === "" ? null : Math.max(0, Number(consultingRaw));
    state.filters.mediaBudget = mediaRaw === "" ? null : Math.max(0, Number(mediaRaw));
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
    return f.consultingBudget != null || f.mediaBudget != null || costPriorityFiltersActive();
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
    showToast("Selected " + ((state.retainer ? 1 : 0) + state.projects.size) + " matching projects — review and adjust");
  }

  function clearGoalMatch() {
    document.getElementById("goal-input").value = "";
    state.goalText = "";
    state.recommended = new Set();
    ensureRequiredRetainer();
    renderAllCards();
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
    showToast("Suggested plan applied — review and adjust");
  }

  function clearFilters() {
    document.getElementById("filter-consulting").value = "";
    document.getElementById("filter-media").value = "";
    document.getElementById("filter-max-fee").value = "";
    document.getElementById("filter-priority-min").value = "";
    document.getElementById("filter-priority-max").value = "";
    state.filters = { consultingBudget: null, mediaBudget: null, hideNonMatching: true, maxFee: null, minPriority: null, maxPriority: null };
    state.recommended = new Set();
    ensureRequiredRetainer();
    renderAllCards();
    renderSummary();
    renderFilterStatus();
  }

  function renderFilterStatus() {
    const el = document.getElementById("filter-status");
    const f = getFilters();
    const cost = getSelectionCost();
    const parts = [];

    if (f.consultingBudget != null) {
      const pct = Math.min(100, Math.round((cost / f.consultingBudget) * 100));
      const over = cost > f.consultingBudget;
      parts.push(`<strong>Consulting selected:</strong> ${fmt(cost)} of ${fmt(f.consultingBudget)} consulting budget (${pct}%)`);
      parts.push(`<div class="budget-bar-wrap"><div class="budget-bar"><div class="budget-bar-fill${over ? " over" : ""}" style="width:${pct}%"></div></div></div>`);
    }
    if (f.mediaBudget != null) {
      parts.push(`<strong>Google Ads media budget:</strong> ${fmt(f.mediaBudget)} billed on your Google invoice, separate from consulting`);
    }
    if (!filtersActive()) {
      el.className = "filter-status";
      el.innerHTML = "Enter budgets to filter projects.";
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
        if (saved.filters.mediaBudget != null) document.getElementById("filter-media").value = saved.filters.mediaBudget;
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

  function cardHtml(item, isRetainer) {
    const id = item.id;
    const sel = isRetainer ? true : state.projects.has(id);
    const exp = state.expanded.has(id);
    const extra = getItemFilterClasses(item, isRetainer);
    const pkgClass = isInRecommendedPackage({ ...item, isRetainer }) ? " package-included" : "";
    const feeLabel = feeLabelFor(item, isRetainer);
    const enablerBadge = item.enabler ? `<span class="badge badge-enabler">Enabler — required for call ads</span>` : "";
    const retainerClass = isRetainer ? " retainer-card required-retainer" : "";

    const subClass = item.parentId ? " card-sub-related" : "";

    return `
      <div class="card${retainerClass}${subClass}${pkgClass} ${sel ? "selected" : ""} ${exp ? "expanded" : ""} ${extra}" id="project-${id}" data-id="${id}" data-retainer="${isRetainer}">
        <div class="card-header">
          <input type="checkbox" class="${isRetainer ? "" : "proj-chk"}" data-id="${id}"${isRetainer ? ' id="chk-retainer" disabled' : ""} ${sel || isRetainer ? "checked" : ""}>
            <div class="card-body">
              <div class="card-top-row">
                <div class="card-title">${item.title}</div>
                <div class="card-corner">
                  ${priorityBadge(item)}
                  <span class="badge badge-cat badge-cat-corner">${campaignTypeLabel(item)}</span>
                </div>
              </div>
              <div class="card-meta">
                <span class="badge badge-fee">${feeLabel}</span>
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
    list.innerHTML = cardHtml(RETAINER, true) + orderedProjects().map(p => cardHtml(p, false)).join("");

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
      filterMediaBudget: state.filters.mediaBudget,
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

  function showThankYou(payload) {
    const lines = [];
    if (payload.retainer) lines.push(`<li><strong>${escapeHtml(RETAINER.title)}</strong> — ${fmt(RETAINER.fee)} per month</li>`);
    (payload.projects || []).forEach(p => lines.push(`<li><strong>${escapeHtml(p.title)}</strong> — ${p.fee}</li>`));
    if (!lines.length) lines.push("<li><em>No projects selected — notes only</em></li>");

    let notesHtml = "";
    if (payload.generalSuggestions) notesHtml += `<p style="margin-top:1rem"><strong>General:</strong> ${escapeHtml(payload.generalSuggestions)}</p>`;
    const noteEntries = Object.entries(payload.projectNotes || {});
    if (noteEntries.length) {
      notesHtml += "<p style='margin-top:0.75rem'><strong>Per project:</strong></p><ul class='thank-you-list'>" +
        noteEntries.map(([id, text]) => `<li><strong>${id}:</strong> ${escapeHtml(text)}</li>`).join("") + "</ul>";
    }

    const depositAmt = CONFIG.depositAmount;
    const depositUrl = CONFIG.quickbooksDepositUrl;
    let depositHtml = "";
    if (depositAmt && depositUrl) {
      depositHtml = `<p class="deposit-note">Standard deposit: <strong>${fmt(depositAmt)}</strong> via QuickBooks. Gilded Goose will send a <strong>full invoice</strong> for your selected projects separately.</p>`;
    } else if (depositAmt) {
      depositHtml = `<p class="deposit-note">Standard deposit: <strong>${fmt(depositAmt)}</strong>. Payment instructions will follow by email.</p>`;
    }

    const emailNote = payload.submitterEmail
      ? `<p class="confirm-note">Confirmation emailed to <strong>${escapeHtml(payload.submitterEmail)}</strong> and Gilded Goose.</p>`
      : `<p class="confirm-note">Confirmation emailed to Gilded Goose.</p>`;

    document.getElementById("thank-you-body").innerHTML = `
      ${emailNote}
      <p><strong>Estimated consulting:</strong> ${payload.grandTotalNote || "—"}</p>
      ${depositHtml}
      <ul class="thank-you-list" style="margin-top:1rem">${lines.join("")}</ul>${notesHtml}`;

    const payBtn = document.getElementById("btn-pay-deposit");
    if (payBtn && depositUrl && depositAmt) {
      payBtn.href = depositUrl;
      payBtn.textContent = "Pay " + fmt(depositAmt) + " deposit (QuickBooks)";
      payBtn.style.display = "block";
    } else if (payBtn) {
      payBtn.style.display = "none";
    }

    document.getElementById("thank-you").classList.add("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "false");
    document.getElementById("main-app").classList.add("hidden");
    window.scrollTo(0, 0);

    if (depositUrl) {
      setTimeout(() => window.open(depositUrl, "_blank", "noopener,noreferrer"), 1500);
    }
  }

  function hideThankYou() {
    document.getElementById("thank-you").classList.remove("show");
    document.getElementById("thank-you").setAttribute("aria-hidden", "true");
    document.getElementById("main-app").classList.remove("hidden");
  }

  function renderSummary() {
    const selected = getSelectedProjects();
    const projectTotal = selected.reduce((s, p) => s + itemSelectionCost(p), 0);
    const totalsEl = document.getElementById("totals");

    if (!hasSelection()) {
      totalsEl.innerHTML = '<div class="empty-state">Select projects to see totals.</div>';
    } else {
      let rows = "";
      if (state.retainer) rows += `<div class="total-row"><span>${RETAINER.title}</span><span>${fmt(RETAINER.fee)} per month</span></div>`;
      selected.forEach(p => {
        const label = p.ongoingFee ? `${p.title} (setup)` : p.title;
        rows += `<div class="total-row"><span>${label}</span><span>${feeLabelFor(p, false)}</span></div>`;
      });
      const grandLabel = state.retainer && selected.length
        ? `${fmt(projectTotal)} projects + ${fmt(RETAINER.fee)} per month retainer`
        : state.retainer ? `${fmt(RETAINER.fee)} per month retainer` : `${fmt(projectTotal)} total`;
      rows += `<div class="total-row grand"><span>Consulting total</span><span>${grandLabel}</span></div>`;
      totalsEl.innerHTML = rows;
    }

    const deliverablesEl = document.getElementById("selected-deliverables");
    const items = [];
    if (state.retainer) items.push(RETAINER);
    selected.forEach(p => items.push(p));
    if (!items.length) {
      deliverablesEl.innerHTML = '<div class="empty-state">—</div>';
    } else {
      deliverablesEl.innerHTML = items.map(item =>
        `<div class="impact-item"><strong>${item.title}</strong><ul class="deliverable-list compact">${(item.deliverables || []).slice(0, 3).map(d => `<li>${STAR} ${d}</li>`).join("")}</ul></div>`
      ).join("");
    }

    updateSubmitButtons();
    renderFilterStatus();
    renderPriorityTable();
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
  ["filter-consulting", "filter-media", "filter-max-fee", "filter-priority-min", "filter-priority-max"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => { renderAllCards(); renderSummary(); });
  });
  document.getElementById("filter-hide-nonmatching").addEventListener("change", () => { renderAllCards(); renderPriorityTable(); });

  loadState();
  ensureRequiredRetainer();
  renderPackageIntro();
  renderAllCards();
  renderSummary();
  renderFilterStatus();
})();
