/**
 * Thumbs up / thumbs down on each KPI / data point.
 * Storage: browser localStorage (reliable) + Download Feedback Report.
 * Google Sheet webhook is optional and not required.
 */
(function () {
  const STORAGE_KEY = "pav-metrics-feedback-v2";
  const REVIEWER_KEY = "pav-metrics-reviewer-v1";
  const SESSION_KEY = "pav-metrics-session-v1";

  const VERDICTS = {
    up: { id: "thumbs_up", label: "Thumbs up", score: 1 },
    down: { id: "thumbs_down", label: "Thumbs down", score: -1 }
  };

  const state = {
    targets: [],
    feedback: loadFeedback(),
    sessionId: getOrCreateSessionId(),
    toastTimer: null
  };

  function loadFeedback() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (raw && typeof raw === "object") return raw;
    } catch { /* ignore */ }
    try {
      const legacy = JSON.parse(localStorage.getItem("pav-metrics-feedback-v1") || "{}");
      const migrated = {};
      Object.keys(legacy).forEach(id => {
        const e = legacy[id];
        if (!e?.verdict) return;
        migrated[id] = {
          ...e,
          verdict: e.verdict === "ok" ? "thumbs_up" : "thumbs_down",
          score: e.verdict === "ok" ? 1 : -1
        };
      });
      return migrated;
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
    const next = { name: (name || "").trim(), email: (email || "").trim() };
    try {
      localStorage.setItem(REVIEWER_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
    return next;
  }

  function readReviewerFromUi() {
    const stored = loadReviewer();
    return saveReviewer(stored.name || "", stored.email || "");
  }

  function persistFeedbackLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
    } catch { /* ignore quota */ }
    updateScoreBar();
    syncThumbUi();
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
    if (
      el.classList.contains("kpi-dash-card") ||
      el.classList.contains("kpi-mini-card") ||
      el.classList.contains("kpi-split-panel")
    ) return "widget";
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
      ".kpi-chart-card"
    ].join(", ");

    function addTarget(el) {
      if (el.closest(".kpi-detail-panel")) return;
      let id = targetId(el);
      if (!id && el.classList.contains("kpi-chart-card")) {
        const head = el.querySelector(".kpi-chart-head strong");
        id = "chart-" + (head
          ? head.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
          : "untitled");
        el.dataset.feedbackId = id;
      }
      if (!id || seen.has(id)) return;
      seen.add(id);
      out.push({ id, el, label: targetLabel(el), type: targetType(el) });
    }

    document.querySelectorAll(".kpi-report-root").forEach(root => {
      root.querySelectorAll(selectors).forEach(addTarget);
    });
    return out;
  }

  function entryHasContent(e) {
    return !!(e && (e.verdict || String(e.comment || "").trim()));
  }

  function scoreTotals() {
    let up = 0;
    let down = 0;
    let notes = 0;
    Object.values(state.feedback).forEach(e => {
      if (e?.verdict === "thumbs_up") up += 1;
      else if (e?.verdict === "thumbs_down") down += 1;
      if (String(e?.comment || "").trim()) notes += 1;
    });
    return { up, down, net: up - down, rated: up + down, notes };
  }

  function feedbackItems() {
    return state.targets
      .filter(t => entryHasContent(state.feedback[t.id]))
      .map(t => ({
        id: t.id,
        label: t.label,
        type: t.type,
        ...state.feedback[t.id]
      }));
  }

  function buildReport() {
    const who = readReviewerFromUi();
    const data = window.KPI_REPORT?.getData?.() || {};
    const totals = scoreTotals();
    const items = feedbackItems();
    const stamp = new Date().toISOString();
    return {
      type: "kpi_thumb_ratings",
      submittedAt: stamp,
      submitterName: who.name || "",
      sessionId: state.sessionId,
      period: data.period || "",
      asOf: data.asOf || "",
      source: data.source || (document.body.classList.contains("metrics-page") ? "metrics.html" : "index.html"),
      scores: totals,
      feedbackCount: items.length,
      feedback: items
    };
  }

  function downloadReport() {
    const report = buildReport();
    if (!report.feedbackCount) {
      showToast("Add a thumb or comment on at least one card first.", "err");
      return;
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gilbert-feedback-report-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Downloaded feedback report.", "ok");
  }

  function ensureScoreBar() {
    const panel = document.getElementById("cockpit-panel-kpis");
    if (!panel || document.getElementById("kpi-rating-bar")) return;
    const bar = document.createElement("div");
    bar.id = "kpi-rating-bar";
    bar.className = "kpi-rating-bar";
    bar.innerHTML =
      '<div class="kpi-rating-bar-main">' +
      '<p class="kpi-rating-score" id="kpi-rating-score" aria-live="polite"></p>' +
      '<div class="kpi-rating-actions">' +
      '<button type="button" class="kpi-rating-action kpi-rating-action-primary" id="kpi-rating-download">Download Feedback Report</button>' +
      "</div>" +
      "</div>" +
      '<p class="kpi-rating-hint">Thumbs and comments save on this device. Download the feedback report when done.</p>' +
      '<p class="kpi-rating-toast" id="kpi-rating-toast" aria-live="polite"></p>';
    const root = panel.querySelector(".kpi-report-root");
    if (root) panel.insertBefore(bar, root);
    else panel.prepend(bar);

    document.getElementById("kpi-rating-download")?.addEventListener("click", downloadReport);
  }

  function updateScoreBar() {
    ensureScoreBar();
    const el = document.getElementById("kpi-rating-score");
    if (!el) return;
    const t = scoreTotals();
    const total = state.targets.length;
    el.innerHTML =
      `<strong>${t.up}</strong> 👍 · <strong>${t.down}</strong> 👎 · net <strong>${t.net >= 0 ? "+" : ""}${t.net}</strong>` +
      ` · <span>${t.rated} of ${total} rated</span>` +
      (t.notes ? ` · <span>${t.notes} with notes</span>` : "");
  }

  function showToast(msg, kind) {
    const toast = document.getElementById("kpi-rating-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className = "kpi-rating-toast" + (kind === "err" ? " is-err" : kind === "ok" ? " is-ok" : "");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      toast.textContent = "";
      toast.className = "kpi-rating-toast";
    }, 3600);
  }

  function ensureThumbUi(t) {
    let wrap = t.el.closest(".kpi-rate-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "kpi-rate-wrap";
      wrap.dataset.feedbackFor = t.id;
      const parent = t.el.parentNode;
      if (!parent) return;
      parent.insertBefore(wrap, t.el);
      wrap.appendChild(t.el);
    }
    wrap.dataset.feedbackFor = t.id;
    let btns = wrap.querySelector(":scope > .kpi-rate-btns");
    if (!btns) {
      btns = document.createElement("div");
      btns.className = "kpi-rate-btns";
      btns.innerHTML =
        `<button type="button" class="kpi-rate-btn kpi-rate-up" data-rate="up" data-rate-id="${escapeHtml(t.id)}" title="Thumbs up" aria-label="Thumbs up for ${escapeHtml(t.label)}">👍</button>` +
        `<button type="button" class="kpi-rate-btn kpi-rate-down" data-rate="down" data-rate-id="${escapeHtml(t.id)}" title="Thumbs down" aria-label="Thumbs down for ${escapeHtml(t.label)}">👎</button>`;
      wrap.appendChild(btns);
    }
    let note = wrap.querySelector(":scope > .kpi-rate-note");
    if (!note) {
      note = document.createElement("label");
      note.className = "kpi-rate-note";
      note.innerHTML =
        `<span class="kpi-rate-note-label">Comment</span>` +
        `<textarea class="kpi-rate-comment" data-comment-id="${escapeHtml(t.id)}" rows="2" placeholder="Optional note on this box…"></textarea>`;
      wrap.appendChild(note);
    }
    t.el.classList.add("feedback-target");
    t.el.dataset.feedbackFor = t.id;
  }

  function syncThumbUi() {
    state.targets.forEach(t => {
      ensureThumbUi(t);
      const wrap = t.el.closest(".kpi-rate-wrap");
      if (!wrap) return;
      const entry = state.feedback[t.id];
      wrap.classList.toggle("has-feedback-ok", entry?.verdict === "thumbs_up");
      wrap.classList.toggle("has-feedback-flag", entry?.verdict === "thumbs_down");
      wrap.classList.toggle("has-feedback-note", !!(entry?.comment && String(entry.comment).trim()));
      wrap.querySelectorAll(".kpi-rate-btn").forEach(btn => {
        const v = btn.dataset.rate === "up" ? "thumbs_up" : "thumbs_down";
        btn.classList.toggle("is-selected", entry?.verdict === v);
        btn.setAttribute("aria-pressed", entry?.verdict === v ? "true" : "false");
      });
      const ta = wrap.querySelector(".kpi-rate-comment");
      if (ta && document.activeElement !== ta) {
        ta.value = entry?.comment || "";
      }
    });
  }

  function saveComment(id, text) {
    const comment = String(text || "").trim();
    const prev = state.feedback[id] || {};
    if (!comment && !prev.verdict) {
      delete state.feedback[id];
      persistFeedbackLocal();
      return;
    }
    state.feedback[id] = {
      ...prev,
      comment,
      updatedAt: new Date().toISOString()
    };
    if (!state.feedback[id].verdict) {
      delete state.feedback[id].score;
      delete state.feedback[id].label;
    }
    persistFeedbackLocal();
  }

  function rateTarget(id, direction) {
    const meta = VERDICTS[direction];
    if (!meta) return;
    const prev = state.feedback[id];
    const comment = prev?.comment || "";
    if (prev?.verdict === meta.id) {
      if (comment.trim()) {
        state.feedback[id] = { comment, updatedAt: new Date().toISOString() };
      } else {
        delete state.feedback[id];
      }
      persistFeedbackLocal();
      showToast("Cleared vote (this browser).");
      return;
    }
    state.feedback[id] = {
      verdict: meta.id,
      score: meta.score,
      label: meta.label,
      comment,
      updatedAt: new Date().toISOString()
    };
    persistFeedbackLocal();
    showToast("Saved on this device. Download or email when done.", "ok");
  }

  function bindClicks() {
    if (document.documentElement.dataset.kpiThumbsBound === "1") return;
    document.documentElement.dataset.kpiThumbsBound = "1";
    document.addEventListener("click", e => {
      const btn = e.target.closest(".kpi-rate-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.rateId;
      const dir = btn.dataset.rate;
      if (id && dir) rateTarget(id, dir);
    });
    document.addEventListener("change", e => {
      const ta = e.target.closest(".kpi-rate-comment");
      if (!ta) return;
      saveComment(ta.dataset.commentId, ta.value);
    });
    document.addEventListener("blur", e => {
      const ta = e.target.classList?.contains("kpi-rate-comment") ? e.target : null;
      if (!ta || !ta.dataset?.commentId) return;
      saveComment(ta.dataset.commentId, ta.value);
    }, true);
  }

  function refresh() {
    ensureScoreBar();
    state.targets = discoverTargets();
    syncThumbUi();
    updateScoreBar();
  }

  function init() {
    bindClicks();
    refresh();
  }

  function onReady() {
    if (document.body.classList.contains("metrics-page") && window.KPI_REPORT) {
      const kpis = document.getElementById("kpi-report-kpis");
      if (kpis) KPI_REPORT.renderAll(kpis);
    }
    const start = () => {
      if (document.getElementById("kpi-report-kpis")?.dataset.rendered || document.body.classList.contains("metrics-page")) {
        init();
      } else {
        setTimeout(start, 50);
      }
    };
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.addEventListener("kpi-report-rendered", () => {
    refresh();
  });

  window.PAV_KPI_RATINGS = {
    refresh,
    getScores: scoreTotals,
    getFeedback: () => ({ ...state.feedback }),
    buildReport,
    downloadReport
  };
})();
