/**
 * Magenta Feedback mode: click a KPI or chart to leave Gilbert comments.
 * Saves to localStorage; emails all comments to support@gildedgooselimited.com.
 */
(function () {
  const STORAGE_KEY = "pav-metrics-feedback-v1";
  const SUPPORT_EMAIL = "support@gildedgooselimited.com";
  const VERDICTS = [
    { id: "ok", label: "Looks right", chipClass: "done-ok" },
    { id: "confusing", label: "Confusing / needs context", chipClass: "done-flag" },
    { id: "wrong_number", label: "Wrong number", chipClass: "done-flag" },
    { id: "wrong_chart", label: "Wrong chart type", chipClass: "done-flag" },
    { id: "missing", label: "Missing metric", chipClass: "done-flag" }
  ];

  const state = {
    targets: [],
    activeId: null,
    feedback: loadFeedback(),
    filterPending: false,
    feedbackMode: false
  };

  function loadFeedback() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveFeedback() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
    updateProgress();
    renderSummary();
    syncChipStates();
  }

  function getConfig() {
    return (typeof window !== "undefined" && window.PAV_PICKER_CONFIG) ? window.PAV_PICKER_CONFIG : {};
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function targetId(el) {
    return el.dataset.feedbackId || el.dataset.kpiFocus || "";
  }

  function targetLabel(el) {
    if (el.dataset.feedbackLabel) return el.dataset.feedbackLabel.trim();
    const kpi = el.dataset.kpiFocus;
    if (kpi) {
      const idEl = el.querySelector(".kpi-stat-id");
      const head = el.querySelector(".kpi-chart-head strong");
      if (idEl) return idEl.textContent.trim();
      if (head) return head.textContent.trim();
      return kpi;
    }
    const title = el.querySelector(".kpi-section-title");
    if (title) return title.textContent.trim();
    return targetId(el) || "Metric";
  }

  function targetType(el) {
    if (el.classList.contains("kpi-stat-card")) return "metric";
    if (el.classList.contains("kpi-chart-card") || el.querySelector(".kpi-chart-svg")) return "chart";
    if (el.classList.contains("kpi-section")) return "section";
    if (el.classList.contains("kpi-dash-card") || el.classList.contains("kpi-mini-card")) return "widget";
    return "other";
  }

  function discoverTargets() {
    const seen = new Set();
    const out = [];
    document.querySelectorAll(".kpi-report-root").forEach(root => {
      root.querySelectorAll(
        ".kpi-stat-card[data-kpi-focus], .kpi-chart-card[data-kpi-focus], .kpi-dash-card[data-kpi-focus], .kpi-chart-card"
      ).forEach(el => {
        let id = targetId(el);
        if (!id && el.classList.contains("kpi-chart-card")) {
          const head = el.querySelector(".kpi-chart-head strong");
          id = "chart-" + (head ? head.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "untitled");
          el.dataset.feedbackId = id;
        }
        if (!id || seen.has(id)) return;
        seen.add(id);
        out.push({ id, el, label: targetLabel(el), type: targetType(el) });
      });
    });
    return out;
  }

  function verdictMeta(id) {
    return VERDICTS.find(v => v.id === id) || VERDICTS[0];
  }

  function chipClassFor(entry) {
    if (!entry?.verdict) return "";
    return verdictMeta(entry.verdict).chipClass;
  }

  function markTargets() {
    state.targets.forEach(t => {
      t.el.classList.add("feedback-target");
      t.el.dataset.feedbackFor = t.id;
      if (!t.el._feedbackClickBound) {
        t.el.addEventListener("click", onTargetClick, true);
        t.el._feedbackClickBound = true;
      }
    });
    syncTargetStates();
  }

  function onTargetClick(e) {
    if (!state.feedbackMode) return;
    const el = e.currentTarget;
    if (el.classList.contains("kpi-section")) return;
    const id = el.dataset.feedbackFor || targetId(el);
    if (!id) return;
    e.preventDefault();
    e.stopPropagation();
    openGilbertPopup(id);
  }

  function setFeedbackMode(on) {
    state.feedbackMode = !!on;
    document.body.classList.toggle("feedback-mode-on", state.feedbackMode);
    document.querySelectorAll(".kpi-feedback-mode-toggle").forEach(btn => {
      btn.setAttribute("aria-pressed", state.feedbackMode ? "true" : "false");
      btn.textContent = state.feedbackMode ? "Feedback mode · ON" : "Feedback mode";
    });
    syncTargetStates();
    if (!state.feedbackMode) closeGilbertPopup();
  }

  function syncTargetStates() {
    state.targets.forEach(t => {
      const entry = state.feedback[t.id];
      t.el.classList.remove("has-feedback-ok", "has-feedback-flag", "is-feedback-active");
      if (state.activeId === t.id) t.el.classList.add("is-feedback-active");
      if (entry?.verdict) {
        t.el.classList.add(entry.verdict === "ok" ? "has-feedback-ok" : "has-feedback-flag");
      }
      t.el.querySelectorAll(".feedback-chip").forEach(chip => chip.remove());
    });
    if (state.filterPending && state.feedbackMode) {
      state.targets.forEach(t => {
        t.el.style.display = state.feedback[t.id]?.verdict ? "none" : "";
      });
    } else {
      state.targets.forEach(t => { t.el.style.display = ""; });
    }
  }

  function syncChipStates() {
    syncTargetStates();
  }

  function injectChips() {
    markTargets();
  }

  function popupEls() {
    return {
      popup: document.getElementById("gilbert-feedback-popup"),
      backdrop: document.getElementById("gilbert-feedback-backdrop"),
      body: document.getElementById("gilbert-feedback-body"),
      subtitle: document.getElementById("gilbert-feedback-subtitle")
    };
  }

  function ensureFeedbackPopup() {
    if (document.getElementById("gilbert-feedback-popup")) return;
    const backdrop = document.createElement("div");
    backdrop.id = "gilbert-feedback-backdrop";
    backdrop.className = "gilbert-chat-backdrop";
    backdrop.hidden = true;
    const aside = document.createElement("aside");
    aside.id = "gilbert-feedback-popup";
    aside.className = "gilbert-chat-popup gilbert-feedback-popup";
    aside.hidden = true;
    aside.setAttribute("aria-label", "Gilbert metric feedback");
    aside.innerHTML = `
      <div class="gilbert-chat-popup-head">
        <img class="gilbert-popup-portrait" src="assets/gilbert-lightbulb-idea.png" alt="">
        <div class="gilbert-popup-head-title">Gilbert<small id="gilbert-feedback-subtitle">Comment on this metric</small></div>
        <button type="button" class="gilbert-chat-close" id="gilbert-feedback-close" aria-label="Close">×</button>
      </div>
      <div class="gilbert-chat-wrap gilbert-feedback-body" id="gilbert-feedback-body"></div>`;
    document.body.appendChild(backdrop);
    document.body.appendChild(aside);
    bindPopupChrome();
  }

  function closeGilbertPopup() {
    const { popup, backdrop } = popupEls();
    if (popup) popup.hidden = true;
    if (backdrop) backdrop.hidden = true;
    state.activeId = null;
    syncChipStates();
  }

  function openGilbertPopup(id) {
    if (!state.feedbackMode) return;
    state.activeId = id;
    ensureFeedbackPopup();
    const t = state.targets.find(x => x.id === id);
    const { popup, backdrop, body, subtitle } = popupEls();
    if (!popup || !body || !t) return;

    const entry = state.feedback[id] || {};
    if (subtitle) subtitle.textContent = t.label;
    const verdicts = VERDICTS.map(
      v => `<label class="feedback-verdict">
        <input type="radio" name="feedback-verdict" value="${v.id}" ${entry.verdict === v.id ? "checked" : ""}>
        <span>${escapeHtml(v.label)}</span>
      </label>`
    ).join("");

    body.innerHTML = `
      <div class="gilbert-feedback-msg gilbert-chat-gilbert">
        <span class="gilbert-chat-who">Gilbert</span>
        <p>How does <strong>${escapeHtml(t.label)}</strong> look? Your note goes to support when you submit all ratings.</p>
      </div>
      <p class="feedback-panel-target">${escapeHtml(t.type)} · ${escapeHtml(t.id)}</p>
      <div class="feedback-verdicts" role="group" aria-label="Your verdict">${verdicts}</div>
      <div class="feedback-field">
        <label for="feedback-comment">Your comment</label>
        <textarea id="feedback-comment" placeholder="What's unclear? What should change?">${escapeHtml(entry.comment || "")}</textarea>
      </div>
      <div class="feedback-field">
        <label for="feedback-target-suggest">Suggested target or fix (optional)</label>
        <input type="text" id="feedback-target-suggest" value="${escapeHtml(entry.suggestedTarget || "")}" placeholder="e.g. target 90% answer rate">
      </div>
      <div class="feedback-panel-actions">
        <button type="button" class="btn btn-primary" id="feedback-save-btn">Save</button>
        <button type="button" class="btn" id="feedback-clear-btn">Clear</button>
      </div>
      <p class="feedback-saved-toast" id="feedback-saved-toast" aria-live="polite"></p>`;

    document.getElementById("feedback-save-btn")?.addEventListener("click", () => saveActive(id));
    document.getElementById("feedback-clear-btn")?.addEventListener("click", () => {
      delete state.feedback[id];
      saveFeedback();
      openGilbertPopup(id);
    });

    popup.hidden = false;
    if (backdrop) backdrop.hidden = false;
    syncChipStates();
    t.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.getElementById("feedback-comment")?.focus();
  }

  function saveActive(id) {
    const verdict = document.querySelector('input[name="feedback-verdict"]:checked')?.value;
    const toast = document.getElementById("feedback-saved-toast");
    if (!verdict) {
      if (toast) toast.textContent = "Pick a verdict first.";
      return;
    }
    state.feedback[id] = {
      verdict,
      comment: (document.getElementById("feedback-comment")?.value || "").trim(),
      suggestedTarget: (document.getElementById("feedback-target-suggest")?.value || "").trim(),
      updatedAt: new Date().toISOString()
    };
    saveFeedback();
    if (toast) toast.textContent = "Saved.";
    setTimeout(() => closeGilbertPopup(), 450);
  }

  function updateProgress() {
    const total = state.targets.length;
    const done = state.targets.filter(t => state.feedback[t.id]?.verdict).length;
    const el = document.getElementById("feedback-progress");
    if (el) el.innerHTML = `<strong>${done}</strong> <span>of ${total} rated</span>`;
    const submitBtn = document.getElementById("metrics-submit-btn");
    if (submitBtn) submitBtn.disabled = done === 0;
  }

  function renderSummary() {
    const list = document.getElementById("feedback-summary-list");
    if (!list) return;
    const items = state.targets
      .map(t => ({ ...t, entry: state.feedback[t.id] }))
      .filter(x => x.entry?.verdict);
    if (!items.length) {
      list.innerHTML = "<li><em>None yet — turn on magenta Feedback mode, then click a KPI or chart.</em></li>";
      return;
    }
    list.innerHTML = items.map(x => {
      const cls = x.entry.verdict === "ok" ? "ok" : "flag";
      const short = verdictMeta(x.entry.verdict).label;
      const note = x.entry.comment ? ` — ${escapeHtml(x.entry.comment)}` : "";
      return `<li><span>${escapeHtml(x.label)}${note}</span><span class="${cls}">${escapeHtml(short)}</span></li>`;
    }).join("");
  }

  function feedbackItems() {
    return state.targets
      .filter(t => state.feedback[t.id]?.verdict)
      .map(t => ({
        id: t.id,
        label: t.label,
        type: t.type,
        ...state.feedback[t.id]
      }));
  }

  function buildPayload(email) {
    const data = window.KPI_REPORT?.getData?.() || {};
    const items = feedbackItems();
    return {
      type: "metrics_feedback",
      notifyEmail: SUPPORT_EMAIL,
      submittedAt: new Date().toISOString(),
      submitterEmail: (email || "").trim(),
      period: data.period || "",
      asOf: data.asOf || "",
      source: data.source || "",
      feedbackCount: items.length,
      feedback: items
    };
  }

  function formatEmailBody(payload) {
    const lines = [
      "Pav Law metrics feedback",
      "To: " + SUPPORT_EMAIL,
      "From: " + (payload.submitterEmail || "(not provided)"),
      "Period: " + (payload.period || "") + " · as of " + (payload.asOf || ""),
      "Source: " + (payload.source || ""),
      "Submitted: " + payload.submittedAt,
      "",
      "Ratings (" + payload.feedbackCount + "):",
      ""
    ];
    (payload.feedback || []).forEach(item => {
      lines.push("• " + (item.label || item.id) + " [" + (item.type || "") + "]");
      lines.push("  Verdict: " + (verdictMeta(item.verdict).label || item.verdict));
      if (item.comment) lines.push("  Comment: " + item.comment);
      if (item.suggestedTarget) lines.push("  Suggested: " + item.suggestedTarget);
      lines.push("");
    });
    lines.push("— Gilbert metrics page");
    return lines.join("\n");
  }

  function openMailto(payload) {
    const subject = encodeURIComponent(
      "Gilbert metrics feedback — " + (payload.submitterEmail || payload.asOf || "review")
    );
    const body = encodeURIComponent(formatEmailBody(payload));
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  }

  function downloadJson(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pav-metrics-feedback-${payload.submittedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function submitAll() {
    const emailEl = document.getElementById("metrics-email");
    const statusEl = document.getElementById("metrics-submit-status");
    const email = emailEl?.value || "";
    const items = feedbackItems();
    if (!items.length) {
      if (statusEl) {
        statusEl.textContent = "Rate at least one metric first.";
        statusEl.className = "metrics-status err";
      }
      return;
    }

    const payload = buildPayload(email);
    const cfg = getConfig();
    const btn = document.getElementById("metrics-submit-btn");
    if (btn) btn.disabled = true;
    if (statusEl) {
      statusEl.textContent = "Sending to " + SUPPORT_EMAIL + "…";
      statusEl.className = "metrics-status";
    }

    let webhookOk = false;
    if (cfg.webhookUrl) {
      try {
        await fetch(cfg.webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        webhookOk = true;
      } catch {
        webhookOk = false;
      }
    }

    // Always open mail to support with full comment list (and download backup).
    downloadJson(payload);
    openMailto(payload);

    if (statusEl) {
      statusEl.textContent = webhookOk
        ? "Sent to " + SUPPORT_EMAIL + " — mail app also opened with your comments."
        : "Mail app opened to " + SUPPORT_EMAIL + " with all comments (JSON downloaded as backup).";
      statusEl.className = "metrics-status ok";
    }
    if (btn) btn.disabled = false;
  }

  function bindPopupChrome() {
    document.getElementById("gilbert-feedback-close")?.addEventListener("click", closeGilbertPopup);
    document.getElementById("gilbert-feedback-backdrop")?.addEventListener("click", closeGilbertPopup);
  }

  function bindFeedbackModeToggle() {
    if (document.documentElement.dataset.feedbackModeBound === "1") return;
    document.documentElement.dataset.feedbackModeBound = "1";
    document.addEventListener("click", e => {
      const btn = e.target.closest(".kpi-feedback-mode-toggle");
      if (!btn) return;
      e.preventDefault();
      setFeedbackMode(btn.getAttribute("aria-pressed") !== "true");
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeGilbertPopup();
    });
  }

  function init() {
    ensureFeedbackPopup();
    state.targets = discoverTargets();
    injectChips();
    setFeedbackMode(false);
    updateProgress();
    renderSummary();
    bindPopupChrome();
    bindFeedbackModeToggle();

    document.getElementById("feedback-filter-pending")?.addEventListener("click", e => {
      e.currentTarget.classList.toggle("active");
      state.filterPending = e.currentTarget.classList.contains("active");
      syncChipStates();
    });

    document.getElementById("metrics-submit-btn")?.addEventListener("click", submitAll);
  }

  function onReady() {
    if (!window.KPI_REPORT) return;
    const kpis = document.getElementById("kpi-report-kpis");
    const dash = document.getElementById("kpi-report-dashboards");
    const isMetricsPage = document.body.classList.contains("metrics-page");
    if (isMetricsPage) {
      KPI_REPORT.renderAll(kpis, dash);
    }
    init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.addEventListener("kpi-report-rendered", () => {
    state.targets = discoverTargets();
    injectChips();
    setFeedbackMode(state.feedbackMode);
    updateProgress();
    renderSummary();
  });
})();
