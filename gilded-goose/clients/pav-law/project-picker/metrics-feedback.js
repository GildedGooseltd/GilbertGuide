/**
 * Feedback = popup with embedded Google Form (responses → linked Sheet).
 * Set PAV_PICKER_CONFIG.feedbackFormUrl to the Form’s published /viewform URL.
 * Or run createCockpitFeedbackForm() in Apps Script, then paste Logger’s URL into pages-config.js.
 */
(function () {
  const SETUP_SHEET =
    "https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit";

  function getConfig() {
    return typeof window !== "undefined" && window.PAV_PICKER_CONFIG
      ? window.PAV_PICKER_CONFIG
      : {};
  }

  function formUrl() {
    return String(getConfig().feedbackFormUrl || "").trim();
  }

  function toEmbedUrl(url) {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("docs.google.com") && /\/forms\//.test(u.pathname)) {
        if (!u.pathname.includes("/viewform")) {
          u.pathname = u.pathname.replace(/\/edit.*$/, "/viewform").replace(/\/formResponse$/, "/viewform");
          if (!u.pathname.endsWith("/viewform")) {
            u.pathname = u.pathname.replace(/\/?$/, "") + "/viewform";
          }
        }
        u.searchParams.set("embedded", "true");
        return u.toString();
      }
    } catch {
      /* fall through */
    }
    if (/embedded=true/i.test(url)) return url;
    return url + (url.includes("?") ? "&" : "?") + "embedded=true";
  }

  function ensureModal() {
    if (document.getElementById("feedback-form-modal")) return;

    const backdrop = document.createElement("div");
    backdrop.id = "feedback-form-backdrop";
    backdrop.className = "feedback-form-backdrop";
    backdrop.hidden = true;

    const modal = document.createElement("div");
    modal.id = "feedback-form-modal";
    modal.className = "feedback-form-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "feedback-form-title");
    modal.innerHTML =
      '<div class="feedback-form-modal-head">' +
      '<h2 id="feedback-form-title">Leave feedback</h2>' +
      '<button type="button" class="feedback-form-close" id="feedback-form-close" aria-label="Close">×</button>' +
      "</div>" +
      '<div class="feedback-form-modal-body" id="feedback-form-body"></div>';

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
  }

  function renderBody() {
    const body = document.getElementById("feedback-form-body");
    if (!body) return;
    const raw = formUrl();
    const embed = toEmbedUrl(raw);
    if (embed) {
      body.innerHTML =
        '<iframe class="feedback-form-frame" title="Pav Law cockpit feedback form" src="' +
        embed.replace(/"/g, "&quot;") +
        '"></iframe>' +
        '<p class="feedback-form-foot">Responses go to the linked Google Sheet. Close when you’re done.</p>';
      return;
    }
    body.innerHTML =
      '<div class="feedback-form-setup">' +
      "<p><strong>No Google Form is linked yet.</strong></p>" +
      "<p>Owner — pick one:</p>" +
      "<ol>" +
      '<li>Open <a href="' +
      SETUP_SHEET +
      '" target="_blank" rel="noopener">the feedback Sheet</a> → <strong>Tools → Create a new form</strong>. Add questions about layout / KPIs / Guide. <strong>Send</strong> → copy the link.</li>' +
      "<li>Or in Apps Script run <code>createCockpitFeedbackForm</code>, then copy the published URL from the log.</li>" +
      "</ol>" +
      "<p>Paste that URL into <code>pages-config.js</code> as <code>feedbackFormUrl</code> (same folder as this page), save, hard-refresh.</p>" +
      "</div>";
  }

  function openModal() {
    ensureModal();
    renderBody();
    const backdrop = document.getElementById("feedback-form-backdrop");
    const modal = document.getElementById("feedback-form-modal");
    if (backdrop) backdrop.hidden = false;
    if (modal) modal.hidden = false;
    document.body.classList.add("feedback-form-open");
    document.querySelectorAll(".kpi-feedback-mode-toggle").forEach(btn => {
      btn.setAttribute("aria-pressed", "true");
      btn.textContent = "Feedback";
    });
  }

  function closeModal() {
    const backdrop = document.getElementById("feedback-form-backdrop");
    const modal = document.getElementById("feedback-form-modal");
    if (backdrop) backdrop.hidden = true;
    if (modal) modal.hidden = true;
    document.body.classList.remove("feedback-form-open");
    document.querySelectorAll(".kpi-feedback-mode-toggle").forEach(btn => {
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = "Feedback";
    });
  }

  function bind() {
    if (document.documentElement.dataset.feedbackFormBound === "1") return;
    document.documentElement.dataset.feedbackFormBound = "1";

    document.addEventListener("click", e => {
      const openBtn = e.target.closest(".kpi-feedback-mode-toggle, #feedback-open-btn");
      if (openBtn) {
        e.preventDefault();
        const modal = document.getElementById("feedback-form-modal");
        if (modal && !modal.hidden) closeModal();
        else openModal();
        return;
      }
      if (e.target.closest("#feedback-form-close") || e.target.id === "feedback-form-backdrop") {
        e.preventDefault();
        closeModal();
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  function init() {
    ensureModal();
    bind();
    document.querySelectorAll(".kpi-feedback-mode-toggle").forEach(btn => {
      btn.textContent = "Feedback";
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Open feedback form";
    });
  }

  function onReady() {
    if (document.body.classList.contains("metrics-page") && window.KPI_REPORT) {
      const kpis = document.getElementById("kpi-report-kpis");
      if (kpis) KPI_REPORT.renderAll(kpis);
    }
    init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.PAV_FEEDBACK_FORM = { open: openModal, close: closeModal };
})();
