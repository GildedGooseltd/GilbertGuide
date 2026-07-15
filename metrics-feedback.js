/**
 * Thumbs up / thumbs down on KPI and feedback boxes.
 * Storage: browser localStorage + Download Feedback Report.
 */
(function () {
  const STORAGE_KEY = "pav-metrics-feedback-v2";
  const REVIEWER_KEY = "pav-metrics-reviewer-v1";
  const SESSION_KEY = "pav-metrics-session-v1";

  const VERDICTS = {
    up: { id: "thumbs_up", label: "Thumbs up", score: 1 },
    down: { id: "thumbs_down", label: "Thumbs down", score: -1 }
  };

  const TARGET_SELECTORS = [
    ".kpi-stat-card[data-kpi-focus]",
    ".kpi-goal-card[data-kpi-focus]:not([disabled]):not([aria-disabled='true'])",
    ".kpi-mini-card[data-kpi-focus]",
    ".kpi-dash-card[data-kpi-focus]",
    ".kpi-split-panel[data-feedback-id]",
    ".kpi-chart-card[data-kpi-focus]",
    ".kpi-section[data-feedback-id]",
    ".picker-zone[data-feedback-id]",
    ".impact-section[data-feedback-id]",
    "#completed-report-out[data-feedback-id]",
    ".pav-guide-ask-section[data-feedback-id]"
  ].join(", ");

  const state = {
    targets: [],
    feedback: loadFeedback(),
    sessionId: getOrCreateSessionId(),
    toastTimer: null,
    mo: null,
    syncing: false
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

  function slug(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled";
  }

  /** Stable unique id per box — never reuse the same focus across card vs chart. */
  function computeTargetId(el) {
    if (el.dataset.feedbackId) return el.dataset.feedbackId.trim();
    const focus = (el.dataset.kpiFocus || "").trim();
    if (focus) {
      if (el.classList.contains("kpi-chart-card")) return `chart:${focus}`;
      if (el.classList.contains("kpi-mini-card")) return `mini:${focus}`;
      if (el.classList.contains("kpi-dash-card")) return `dash:${focus}`;
      if (el.classList.contains("kpi-goal-card")) return `goal:${focus}`;
      if (el.classList.contains("kpi-stat-card")) return `stat:${focus}`;
      return `kpi:${focus}`;
    }
    if (el.classList.contains("kpi-chart-card")) {
      const head = el.querySelector(".kpi-chart-head strong, h3, .kpi-section-title");
      return "chart:" + slug(head ? head.textContent : "untitled");
    }
    return "";
  }

  function targetLabel(el, id) {
    if (el.dataset.feedbackLabel) return el.dataset.feedbackLabel.trim();
    const kpi = el.dataset.kpiFocus;
    if (kpi) {
      const idEl = el.querySelector(".kpi-stat-id");
      const head = el.querySelector(".kpi-chart-head strong, h3");
      if (idEl) return idEl.textContent.trim();
      if (head) return head.textContent.trim();
      return kpi;
    }
    const title = el.querySelector(".kpi-section-title, .completed-panel-head, .revenue-panel-head, h3");
    if (title) return title.textContent.trim();
    return id || "Metric";
  }

  function targetType(el) {
    if (el.classList.contains("kpi-stat-card") || el.classList.contains("kpi-goal-card")) return "metric";
    if (el.classList.contains("kpi-chart-card") || el.querySelector(".kpi-chart-svg")) return "chart";
    if (
      el.classList.contains("kpi-dash-card") ||
      el.classList.contains("kpi-mini-card") ||
      el.classList.contains("kpi-split-panel")
    ) return "widget";
    if (el.classList.contains("kpi-section") || el.classList.contains("picker-zone") || el.classList.contains("impact-section")) {
      return "section";
    }
    return "other";
  }

  /** Look up stored vote; migrate legacy bare "#01" keys onto new unique ids. */
  function entryFor(id, el) {
    if (state.feedback[id]) return state.feedback[id];
    const focus = (el?.dataset?.kpiFocus || "").trim();
    if (focus && state.feedback[focus]) {
      state.feedback[id] = { ...state.feedback[focus] };
      delete state.feedback[focus];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
      } catch { /* ignore */ }
      return state.feedback[id];
    }
    return null;
  }

  function discoverTargets() {
    const candidates = [];
    document.querySelectorAll(TARGET_SELECTORS).forEach(el => {
      if (el.closest(".kpi-detail-panel")) return;
      if (el.closest(".kpi-rate-btns, .kpi-rate-note, .kpi-rate-tray")) return;
      const id = computeTargetId(el);
      if (!id) return;
      el.dataset.feedbackFor = id;
      if (!el.dataset.feedbackId && id.indexOf(":") === -1 && !el.dataset.kpiFocus) {
        el.dataset.feedbackId = id;
      }
      candidates.push({ id, el, label: targetLabel(el, id), type: targetType(el) });
    });

    // Prefer leaf boxes so a section wrapper doesn't steal thumbs from each card inside.
    const leaves = candidates.filter(
      c => !candidates.some(other => other.el !== c.el && c.el.contains(other.el))
    );

    const seen = new Set();
    const out = [];
    leaves.forEach(c => {
      if (seen.has(c.id)) return;
      seen.add(c.id);
      out.push(c);
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
    const byId = new Map(state.targets.map(t => [t.id, t]));
    return Object.keys(state.feedback)
      .filter(id => entryHasContent(state.feedback[id]))
      .map(id => {
        const t = byId.get(id);
        return {
          id,
          label: t?.label || state.feedback[id].targetLabel || id,
          type: t?.type || "other",
          ...state.feedback[id]
        };
      });
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
    // Never put controls inside a <button> metric card — wrap the card instead.
    let wrap = t.el.closest(".kpi-rate-wrap");
    if (wrap && wrap.dataset.feedbackFor && wrap.dataset.feedbackFor !== t.id) {
      // Wrong wrap from a parent target — build our own.
      wrap = null;
    }
    if (!wrap || !wrap.contains(t.el)) {
      wrap = document.createElement("div");
      wrap.className = "kpi-rate-wrap";
      wrap.dataset.feedbackFor = t.id;
      const parent = t.el.parentNode;
      if (!parent) return null;
      parent.insertBefore(wrap, t.el);
      wrap.appendChild(t.el);
    }
    wrap.dataset.feedbackFor = t.id;
    wrap.classList.add("kpi-rate-wrap--" + (t.type || "other"));

    let tray = wrap.querySelector(":scope > .kpi-rate-tray");
    if (!tray) {
      tray = document.createElement("div");
      tray.className = "kpi-rate-tray";
      tray.innerHTML =
        `<div class="kpi-rate-btns" role="group" aria-label="Rate ${escapeHtml(t.label)}">` +
        `<button type="button" class="kpi-rate-btn kpi-rate-up" data-rate="up" data-rate-id="${escapeHtml(t.id)}" title="Thumbs up" aria-pressed="false" aria-label="Thumbs up for ${escapeHtml(t.label)}">👍</button>` +
        `<button type="button" class="kpi-rate-btn kpi-rate-down" data-rate="down" data-rate-id="${escapeHtml(t.id)}" title="Thumbs down" aria-pressed="false" aria-label="Thumbs down for ${escapeHtml(t.label)}">👎</button>` +
        `</div>` +
        `<label class="kpi-rate-note">` +
        `<span class="kpi-rate-note-label">Comment</span>` +
        `<textarea class="kpi-rate-comment" data-comment-id="${escapeHtml(t.id)}" rows="2" placeholder="Optional note on this box…"></textarea>` +
        `</label>`;
      wrap.appendChild(tray);
    } else {
      // Keep rate-id in sync if target id migrated
      tray.querySelectorAll("[data-rate-id], [data-comment-id]").forEach(node => {
        if (node.dataset.rateId != null) node.dataset.rateId = t.id;
        if (node.dataset.commentId != null) node.dataset.commentId = t.id;
      });
    }

    t.el.classList.add("feedback-target");
    t.el.dataset.feedbackFor = t.id;
    return wrap;
  }

  function applyThumbState(wrap, entry) {
    if (!wrap) return;
    const hasUp = entry?.verdict === "thumbs_up";
    const hasDown = entry?.verdict === "thumbs_down";
    const hasNote = !!(entry?.comment && String(entry.comment).trim());
    wrap.classList.toggle("has-feedback-ok", hasUp);
    wrap.classList.toggle("has-feedback-flag", hasDown);
    wrap.classList.toggle("has-feedback-note", hasNote);
    wrap.querySelectorAll(".kpi-rate-btn").forEach(btn => {
      const v = btn.dataset.rate === "up" ? "thumbs_up" : "thumbs_down";
      const on = entry?.verdict === v;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const ta = wrap.querySelector(".kpi-rate-comment");
    if (ta && document.activeElement !== ta) {
      ta.value = entry?.comment || "";
    }
  }

  function syncThumbUi() {
    state.targets.forEach(t => {
      const wrap = ensureThumbUi(t);
      applyThumbState(wrap, entryFor(t.id, t.el));
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
      targetLabel: state.targets.find(t => t.id === id)?.label || prev.targetLabel,
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
    if (!meta || !id) return;
    const prev = state.feedback[id] || {};
    const comment = prev.comment || "";
    // Toggle off only if clicking the same verdict again
    if (prev.verdict === meta.id) {
      if (comment.trim()) {
        state.feedback[id] = {
          comment,
          targetLabel: state.targets.find(t => t.id === id)?.label || prev.targetLabel,
          updatedAt: new Date().toISOString()
        };
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
      targetLabel: state.targets.find(t => t.id === id)?.label || prev.targetLabel,
      updatedAt: new Date().toISOString()
    };
    persistFeedbackLocal();
    // Immediate paint in case a concurrent re-render raced
    requestAnimationFrame(() => {
      const wrap =
        document.querySelector(`.kpi-rate-wrap[data-feedback-for="${id.replace(/"/g, '\\"')}"]`) ||
        Array.from(document.querySelectorAll(".kpi-rate-wrap")).find(w => w.dataset.feedbackFor === id);
      if (wrap) applyThumbState(wrap, state.feedback[id]);
      else syncThumbUi();
    });
    showToast("Saved on this device. Download when done.", "ok");
  }

  function bindClicks() {
    if (document.documentElement.dataset.kpiThumbsBound === "1") return;
    document.documentElement.dataset.kpiThumbsBound = "1";
    document.addEventListener(
      "click",
      e => {
        const btn = e.target.closest(".kpi-rate-btn");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        const id = btn.getAttribute("data-rate-id") || btn.dataset.rateId;
        const dir = btn.getAttribute("data-rate") || btn.dataset.rate;
        if (id && dir) rateTarget(id, dir);
      },
      true
    );
    document.addEventListener("input", e => {
      const ta = e.target.closest?.(".kpi-rate-comment");
      if (!ta) return;
      const id = ta.getAttribute("data-comment-id") || ta.dataset.commentId;
      if (!id) return;
      // Debounced live persist via blur/change as well; input keeps UI flags in sync
      const comment = String(ta.value || "");
      const prev = state.feedback[id] || {};
      if (!comment.trim() && !prev.verdict) {
        if (state.feedback[id]) {
          delete state.feedback[id];
          persistFeedbackLocal();
        }
        return;
      }
      state.feedback[id] = {
        ...prev,
        comment: comment.trim() ? comment : "",
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
      } catch { /* ignore */ }
      const wrap = ta.closest(".kpi-rate-wrap");
      applyThumbState(wrap, state.feedback[id]);
      updateScoreBar();
    });
    document.addEventListener(
      "blur",
      e => {
        const ta = e.target?.classList?.contains("kpi-rate-comment") ? e.target : null;
        if (!ta) return;
        const id = ta.getAttribute("data-comment-id") || ta.dataset.commentId;
        if (id) saveComment(id, ta.value);
      },
      true
    );
  }

  function mutationLooksLikeReportRebuild(mutations) {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.classList?.contains("kpi-rate-wrap")) continue;
        if (node.classList?.contains("kpi-section") || node.classList?.contains("kpi-stat-card") || node.id === "kpi-report-kpis") {
          return true;
        }
        if (node.querySelector?.(".kpi-section, .kpi-stat-card, .kpi-goals-grid")) return true;
      }
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.classList?.contains("kpi-rate-wrap") || node.classList?.contains("kpi-rate-tray")) continue;
        if (node.classList?.contains("kpi-section") || node.classList?.contains("kpi-stat-grid") || node.classList?.contains("kpi-goals-grid")) {
          return true;
        }
      }
    }
    return false;
  }

  function observeDom() {
    if (state.mo) return;
    const roots = [
      document.getElementById("kpi-report-kpis"),
      document.getElementById("cockpit-panel-impact"),
      document.getElementById("cockpit-panel-picker")
    ].filter(Boolean);
    if (!roots.length) return;
    let scheduled = false;
    state.mo = new MutationObserver(mutations => {
      if (state.syncing || scheduled) return;
      if (!mutationLooksLikeReportRebuild(mutations)) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        refresh();
      });
    });
    roots.forEach(root => {
      state.mo.observe(root, { childList: true, subtree: true });
    });
  }

  function refresh() {
    if (state.syncing) return;
    state.syncing = true;
    try {
      ensureScoreBar();
      state.targets = discoverTargets();
      syncThumbUi();
      updateScoreBar();
      observeDom();
    } finally {
      requestAnimationFrame(() => {
        state.syncing = false;
      });
    }
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

  window.addEventListener("kpi-report-ready", () => {
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
