/**
 * Magenta Feedback mode: click a KPI or chart to leave Gilbert comments.
 * Each Save → localStorage + POST to webhook → Google Sheet tab MetricsFeedback (primary).
 * Full “Save all to sheet” = same Sheet destination. Email/mailto is not required for success.
 */
(function () {
  const STORAGE_KEY = "pav-metrics-feedback-v1";
  const REVIEWER_KEY = "pav-metrics-reviewer-v1";
  const SESSION_KEY = "pav-metrics-session-v1";
  const BACKUP_FILENAME = "pav-metrics-feedback.json";
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
    feedbackMode: false,
    sessionId: getOrCreateSessionId(),
    lastRemoteStatus: null
  };

  function loadFeedback() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function getOrCreateSessionId() {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch {
      return "s-anon-" + Date.now().toString(36);
    }
  }

  function loadReviewer() {
    try {
      return JSON.parse(localStorage.getItem(REVIEWER_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveReviewer(name, email) {
    const next = {
      name: (name || "").trim(),
      email: (email || "").trim()
    };
    try {
      localStorage.setItem(REVIEWER_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
    return next;
  }

  function readReviewerFromUi() {
    const nameEl = document.getElementById("metrics-reviewer-name");
    const emailEl = document.getElementById("metrics-email");
    const stored = loadReviewer();
    return saveReviewer(
      nameEl ? nameEl.value : stored.name,
      emailEl ? emailEl.value : stored.email
    );
  }

  function persistFeedbackLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
    updateProgress();
    renderSummary();
    syncChipStates();
  }

  function getConfig() {
    return (typeof window !== "undefined" && window.PAV_PICKER_CONFIG) ? window.PAV_PICKER_CONFIG : {};
  }

  function webhookConfigured() {
    return !!(getConfig().webhookUrl || "").trim();
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
    if (el.classList.contains("kpi-stat-card") || el.classList.contains("kpi-goal-card")) return "metric";
    if (el.classList.contains("kpi-chart-card") || el.querySelector(".kpi-chart-svg")) return "chart";
    if (el.classList.contains("kpi-section")) return "section";
    if (
      el.classList.contains("kpi-dash-card") ||
      el.classList.contains("kpi-mini-card") ||
      el.classList.contains("kpi-split-panel")
    ) return "widget";
    if (el.id === "completed-report-out" || el.classList.contains("completed-report-out")) return "impact";
    if (el.classList.contains("impact-section") || el.classList.contains("picker-zone") || el.classList.contains("pav-guide-ask-section")) {
      return "page";
    }
    return "other";
  }

  function discoverTargets() {
    const seen = new Set();
    const out = [];
    const selectors = [
      ".kpi-stat-card[data-kpi-focus]",
      ".kpi-goal-card[data-kpi-focus]:not([disabled])",
      ".kpi-mini-card[data-kpi-focus]",
      ".kpi-dash-card[data-kpi-focus]",
      ".kpi-split-panel[data-feedback-id]",
      ".kpi-chart-card[data-kpi-focus]",
      ".kpi-chart-card",
      "[data-feedback-id]"
    ].join(", ");

    function addTarget(el) {
      if (el.closest(".kpi-detail-panel")) return;
      let id = targetId(el);
      if (!id && el.classList.contains("kpi-chart-card")) {
        const head = el.querySelector(".kpi-chart-head strong");
        id = "chart-" + (head ? head.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "untitled");
        el.dataset.feedbackId = id;
      }
      if (!id || seen.has(id)) return;
      if (el.classList.contains("kpi-section") && el.querySelector("[data-kpi-focus], .kpi-chart-card, .kpi-split-panel")) {
        return;
      }
      seen.add(id);
      out.push({ id, el, label: targetLabel(el), type: targetType(el) });
    }

    document.querySelectorAll(".kpi-report-root").forEach(root => {
      root.querySelectorAll(selectors).forEach(addTarget);
    });
    document.querySelectorAll(
      "#cockpit-panel-impact [data-feedback-id], #cockpit-panel-picker [data-feedback-id]"
    ).forEach(addTarget);
    return out;
  }

  function verdictMeta(id) {
    return VERDICTS.find(v => v.id === id) || VERDICTS[0];
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
    const nested = e.target.closest(".feedback-target");
    if (nested && nested !== el) return;
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
        <img class="gilbert-popup-portrait" src="assets/gilbert-thinking.png?v=20260714h" alt="">
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

  function remoteStatusMessage() {
    if (!webhookConfigured()) {
      return "Remote gather OFF — webhook not configured. Ratings stay on this device only until Secret 1 (PAV_PICKER_WEBHOOK_URL) is set and redeployed.";
    }
    if (state.lastRemoteStatus === "ok") {
      return "Remote: saved to Google Sheet tab MetricsFeedback.";
    }
    if (state.lastRemoteStatus === "err") {
      return "Remote send failed — kept locally. Check webhook / Apps Script deploy.";
    }
    return "Remote: each Save posts to MetricsFeedback sheet.";
  }

  function openGilbertPopup(id) {
    if (!state.feedbackMode) return;
    state.activeId = id;
    ensureFeedbackPopup();
    const t = state.targets.find(x => x.id === id);
    const { popup, backdrop, body, subtitle } = popupEls();
    if (!popup || !body || !t) return;

    const entry = state.feedback[id] || {};
    const reviewer = loadReviewer();
    if (subtitle) subtitle.textContent = t.label;
    const verdicts = VERDICTS.map(
      v => `<label class="feedback-verdict">
        <input type="radio" name="feedback-verdict" value="${v.id}" ${entry.verdict === v.id ? "checked" : ""}>
        <span>${escapeHtml(v.label)}</span>
      </label>`
    ).join("");

    const remoteHint = webhookConfigured()
      ? `<p class="feedback-remote-ok">Save sends this note to the shared <strong>MetricsFeedback</strong> sheet (plus a copy on this device).</p>`
      : `<p class="feedback-remote-warn">Webhook missing — Save stays on <em>this browser only</em>. Other people’s comments won’t reach Kate until <code>PAV_PICKER_WEBHOOK_URL</code> is set in GitHub and the site is redeployed.</p>`;

    body.innerHTML = `
      <div class="gilbert-feedback-msg gilbert-chat-gilbert">
        <span class="gilbert-chat-who">Gilbert</span>
        <p>How does <strong>${escapeHtml(t.label)}</strong> look?</p>
      </div>
      <p class="feedback-panel-target">${escapeHtml(t.type)} · ${escapeHtml(t.id)}</p>
      ${remoteHint}
      <div class="feedback-field">
        <label for="feedback-popup-name">Your name (optional)</label>
        <input type="text" id="feedback-popup-name" value="${escapeHtml(reviewer.name || "")}" placeholder="So Kate can tell reviewers apart" autocomplete="name">
      </div>
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
      persistFeedbackLocal();
      openGilbertPopup(id);
    });
    document.getElementById("feedback-popup-name")?.addEventListener("change", e => {
      const email = document.getElementById("metrics-email")?.value || loadReviewer().email || "";
      saveReviewer(e.target.value, email);
      const barName = document.getElementById("metrics-reviewer-name");
      if (barName) barName.value = e.target.value;
    });

    popup.hidden = false;
    if (backdrop) backdrop.hidden = false;
    syncChipStates();
    t.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.getElementById("feedback-comment")?.focus();
  }

  async function postToWebhook(payload) {
    const url = (getConfig().webhookUrl || "").trim();
    if (!url) return { ok: false, reason: "missing" };
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      // no-cors: opaque response — treat fire-and-forget as ok if fetch did not throw
      return { ok: true };
    } catch {
      return { ok: false, reason: "network" };
    }
  }

  function buildItemPayload(id, entry, event) {
    const t = state.targets.find(x => x.id === id);
    const reviewer = readReviewerFromUi();
    const popupName = document.getElementById("feedback-popup-name")?.value;
    if (popupName != null) saveReviewer(popupName, reviewer.email);
    const who = loadReviewer();
    const data = window.KPI_REPORT?.getData?.() || {};
    const item = {
      id,
      label: t?.label || id,
      type: t?.type || "other",
      ...entry
    };
    return {
      type: "metrics_feedback",
      event: event || "item_save",
      notifyEmail: SUPPORT_EMAIL,
      submittedAt: new Date().toISOString(),
      submitterName: who.name || "",
      submitterEmail: who.email || "",
      sessionId: state.sessionId,
      period: data.period || "",
      asOf: data.asOf || "",
      source: data.source || (document.body.classList.contains("metrics-page") ? "metrics.html" : "index.html"),
      feedbackCount: 1,
      feedback: [item]
    };
  }

  async function saveActive(id) {
    const verdict = document.querySelector('input[name="feedback-verdict"]:checked')?.value;
    const toast = document.getElementById("feedback-saved-toast");
    if (!verdict) {
      if (toast) toast.textContent = "Pick a verdict first.";
      return;
    }

    const popupName = document.getElementById("feedback-popup-name")?.value || "";
    const email = document.getElementById("metrics-email")?.value || loadReviewer().email || "";
    saveReviewer(popupName, email);
    const barName = document.getElementById("metrics-reviewer-name");
    if (barName) barName.value = popupName;

    const entry = {
      verdict,
      comment: (document.getElementById("feedback-comment")?.value || "").trim(),
      suggestedTarget: (document.getElementById("feedback-target-suggest")?.value || "").trim(),
      updatedAt: new Date().toISOString()
    };
    state.feedback[id] = entry;
    persistFeedbackLocal();

    if (!webhookConfigured()) {
      state.lastRemoteStatus = "missing";
      updateRemoteBanner();
      if (toast) toast.textContent = "Saved on this device only — remote gather OFF (no webhook).";
      setTimeout(() => closeGilbertPopup(), 700);
      return;
    }

    if (toast) toast.textContent = "Saving to shared sheet…";
    const result = await postToWebhook(buildItemPayload(id, entry, "item_save"));
    state.lastRemoteStatus = result.ok ? "ok" : "err";
    updateRemoteBanner();
    if (toast) {
      toast.textContent = result.ok
        ? "Saved to MetricsFeedback sheet (+ local copy)."
        : "Saved locally — remote send failed.";
    }
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

  function buildPayload(event) {
    const data = window.KPI_REPORT?.getData?.() || {};
    const who = readReviewerFromUi();
    const items = feedbackItems();
    return {
      type: "metrics_feedback",
      event: event || "full_submit",
      notifyEmail: SUPPORT_EMAIL,
      submittedAt: new Date().toISOString(),
      submitterName: who.name || "",
      submitterEmail: who.email || "",
      sessionId: state.sessionId,
      period: data.period || "",
      asOf: data.asOf || "",
      source: data.source || (document.body.classList.contains("metrics-page") ? "metrics.html" : "index.html"),
      feedbackCount: items.length,
      feedback: items
    };
  }

  function downloadJson(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || BACKUP_FILENAME;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  async function submitAll() {
    const statusEl = document.getElementById("metrics-submit-status");
    const items = feedbackItems();
    if (!items.length) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "Rate at least one metric first.";
        statusEl.className = "metrics-status err";
      }
      return;
    }

    const payload = buildPayload("full_submit");
    const btn = document.getElementById("metrics-submit-btn");
    if (btn) btn.disabled = true;

    if (!webhookConfigured()) {
      downloadJson(payload);
      state.lastRemoteStatus = "missing";
      updateRemoteBanner();
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "Sheet gather OFF — JSON downloaded to this device only. Set GitHub Secret 1 (PAV_PICKER_WEBHOOK_URL) and redeploy before sharing.";
        statusEl.className = "metrics-status err";
      }
      if (btn) btn.disabled = false;
      return;
    }

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "Saving full set to MetricsFeedback sheet…";
      statusEl.className = "metrics-status";
    }

    const result = await postToWebhook(payload);
    const webhookOk = result.ok;
    state.lastRemoteStatus = webhookOk ? "ok" : "err";
    updateRemoteBanner();

    if (statusEl) {
      statusEl.hidden = false;
      if (webhookOk) {
        statusEl.textContent = "Saved to sheet — tab MetricsFeedback. Email not required.";
        statusEl.className = "metrics-status ok";
      } else {
        downloadJson(payload);
        statusEl.textContent = "Sheet post failed — JSON downloaded as backup. Check webhook / Apps Script deploy.";
        statusEl.className = "metrics-status err";
      }
    }
    if (btn) btn.disabled = false;
  }

  function updateRemoteBanner() {
    const els = document.querySelectorAll("#metrics-remote-status, .metrics-remote-status");
    const msg = remoteStatusMessage();
    const cls = !webhookConfigured()
      ? "metrics-status err metrics-remote-status"
      : state.lastRemoteStatus === "err"
        ? "metrics-status err metrics-remote-status"
        : "metrics-status ok metrics-remote-status";
    els.forEach(el => {
      el.hidden = false;
      el.className = cls;
      el.textContent = msg;
    });
  }

  function hydrateReviewerFields() {
    const who = loadReviewer();
    const nameEl = document.getElementById("metrics-reviewer-name");
    const emailEl = document.getElementById("metrics-email");
    if (nameEl && !nameEl.value && who.name) nameEl.value = who.name;
    if (emailEl && !emailEl.value && who.email) emailEl.value = who.email;
    nameEl?.addEventListener("change", () => {
      saveReviewer(nameEl.value, emailEl?.value || loadReviewer().email || "");
    });
    emailEl?.addEventListener("change", () => {
      saveReviewer(nameEl?.value || loadReviewer().name || "", emailEl.value);
    });
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
    hydrateReviewerFields();
    updateRemoteBanner();
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
    const isMetricsPage = document.body.classList.contains("metrics-page");
    if (isMetricsPage) {
      KPI_REPORT.renderAll(kpis);
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
