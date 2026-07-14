/**
 * Pav Law Project Picker — submission webhook
 *
 * Destination Sheet (Submissions + MetricsFeedback):
 *   https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit
 *
 * 1. Open that Sheet → Extensions → Apps Script → paste this file (or re-paste after edits)
 * 2. Run setup() once (authorize) — creates Submissions + MetricsFeedback tabs on SPREADSHEET_ID
 * 3. Deploy → New deployment (first time) or Manage deployments → Edit → New version (updates)
 *    → Web app → Execute as: Me → Anyone
 * 4. Copy web app /exec URL into GitHub Secret PAV_PICKER_WEBHOOK_URL (Secret 1) — NOT the Sheet URL
 */
const NOTIFY_EMAIL = "support@gildedgooselimited.com";
const SHEET_NAME = "Submissions";

/** Locked destination for Submissions + MetricsFeedback — do not use getActiveSpreadsheet for writes. */
const SPREADSHEET_ID = "1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM";

function getPickerSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function setup() {
  const ss = getPickerSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      "Timestamp",
      "Submitted by",
      "Submitter email",
      "Goal text",
      "Consulting budget filter",
      "Media budget filter",
      "Retainer",
      "Retainer fee/mo",
      "Project IDs",
      "Project titles",
      "Project fees",
      "First month consulting subtotal",
      "Grand total note",
      "Deposit amount",
      "Invoice schedule",
      "Gilbert chat (JSON)",
      "Per-project notes (JSON)",
      "Raw JSON"
    ]);
    sh.getRange(1, 1, 1, 18).setFontWeight("bold");
  }
  setupMetricsFeedbackSheet();
}

function formatNotes(notes) {
  if (!notes || typeof notes !== "object") return "";
  return Object.keys(notes).map(function(k) { return k + ": " + notes[k]; }).join("\n");
}

function formatGilbertChat(chat) {
  if (!chat || !chat.length) return "(none)";
  return chat.map(function(m) {
    var who = m.role === "gilbert" ? "Gilbert" : "Client";
    return who + ": " + (m.text || "");
  }).join("\n");
}

function formatProjectsList(projects) {
  if (!projects || !projects.length) return "  (none — notes only)";
  return projects.map(function(p) {
    var line = "  • " + p.id + " — " + p.title + " — " + p.fee;
    if (p.timeline) line += " — " + p.timeline;
    if (p.parentId) line += " (related to " + p.parentId + ")";
    return line;
  }).join("\n");
}

function formatActionItems(actionItems) {
  if (!actionItems || !actionItems.length) return "  (none)";
  return actionItems.map(function(a) {
    var prefix = a.kpi || "";
    if (a.projectTitle && a.source === "blocker") prefix += " · " + a.projectTitle;
    return "  " + prefix + ": " + (a.text || "");
  }).join("\n");
}

function buildInternalEmail(data, projects, noteBlock) {
  var depositLine = data.depositAmount != null
    ? "$" + data.depositAmount + " (QuickBooks deposit link sent to client)"
    : "—";
  return [
    "Gilbert — project picker (INTERNAL — create full invoice from this)",
    "",
    "Client: " + (data.submittedBy || "(not provided)"),
    "Email: " + (data.submitterEmail || "(not provided)"),
    "Submitted: " + (data.submittedAt || new Date().toISOString()),
    "",
    "Goal: " + (data.goalText || "—"),
    "Consulting budget filter: " + (data.filterConsultingBudget != null ? "$" + data.filterConsultingBudget : "—"),
    "Media budget filter: " + (data.filterMediaBudget != null ? "$" + data.filterMediaBudget : "—"),
    "",
    "Gilbert chat transcript:",
    formatGilbertChat(data.gilbertChat),
    "",
    "Retainer: " + (data.retainer ? "YES — " + data.retainerFee + "/mo (" + (data.retainerTitle || "Digital Ads") + ")" : "NO"),
    "",
    "Projects selected (bill on full invoice):",
    formatProjectsList(projects),
    "",
    "Action items (from selections):",
    formatActionItems(data.actionItems),
    "",
    "Next steps:",
    data.nextStepsText || "(none)",
    "",
    "First month consulting subtotal: " + (data.projectsSubtotal || "$0"),
    "Grand total note: " + (data.grandTotalNote || "—"),
    "",
    "Invoice schedule (QuickBooks): " + (data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "—"),
    "",
    "Standard deposit collected separately: " + depositLine,
    "",
    "Per-project comments:",
    noteBlock || "(none)"
  ].join("\n");
}

function buildClientEmail(data, projects, noteBlock) {
  var depositAmt = data.depositAmount != null ? "$" + Number(data.depositAmount).toLocaleString("en-US") : null;
  var depositSection = "";
  if (depositAmt && data.quickbooksDepositUrl) {
    depositSection = [
      "",
      "Deposit: " + depositAmt,
      "Pay deposit: " + data.quickbooksDepositUrl,
      "",
      "This deposit is a standard kickoff amount. Gilded Goose will send a separate QuickBooks invoice for the full consulting total based on your project selections above."
    ].join("\n");
  } else if (depositAmt) {
    depositSection = [
      "",
      "Deposit: " + depositAmt + " — Gilded Goose will send payment instructions separately.",
      "",
      "A full QuickBooks invoice for your selected projects will follow after we review this submission."
    ].join("\n");
  } else {
    depositSection = [
      "",
      "Gilded Goose will send a QuickBooks invoice after reviewing your selections."
    ].join("\n");
  }

  return [
    "Hi " + (data.submittedBy || "there") + ",",
    "",
    "We received your Pav Law project selections. Summary:",
    "",
    "Retainer: " + (data.retainer ? "YES — " + data.retainerFee + "/mo" : "NO"),
    "",
    "Projects:",
    formatProjectsList(projects),
    "",
    "Action items (from your selections):",
    formatActionItems(data.actionItems),
    "",
    "Next steps:",
    data.nextStepsText || "(none)",
    "",
    "Estimated consulting (first month projects): " + (data.projectsSubtotal || "—"),
    "Note: " + (data.grandTotalNote || "—"),
    "Invoice schedule: " + (data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "—"),
    depositSection,
    "",
    "Gilbert chat:",
    formatGilbertChat(data.gilbertChat),
    "",
    "Your comments:",
    noteBlock || "(none)",
    "",
    "Questions? Reply to this email or contact Gilded Goose.",
    "",
    "— Gilded Goose Limited"
  ].join("\n");
}

function doGet(e) {
  if (e && e.parameter && e.parameter.ping) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      service: "gilbert-guide"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    message: "Gilbert project picker webhook — POST JSON submissions here."
  })).setMimeType(ContentService.MimeType.JSON);
}

function setupMetricsFeedbackSheet() {
  const ss = getPickerSpreadsheet();
  let sh = ss.getSheetByName("MetricsFeedback");
  if (!sh) {
    sh = ss.insertSheet("MetricsFeedback");
  }
  var headers = [
    "Timestamp",
    "Reviewer name",
    "Email",
    "Session ID",
    "Event",
    "Period",
    "As of",
    "Source",
    "Feedback count",
    "Feedback JSON",
    "Raw JSON"
  ];
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    return sh;
  }
  // Upgrade legacy 8-col header (Email was col B) without scrambling existing Email data.
  var b1 = String(sh.getRange(1, 2).getValue() || "");
  if (b1 === "Email") {
    sh.insertColumnsAfter(1, 1); // Timestamp | (new) | Email | Period…
    sh.getRange(1, 2).setValue("Reviewer name");
    sh.insertColumnsAfter(3, 2); // … Email | (new) | (new) | Period…
    sh.getRange(1, 4).setValue("Session ID");
    sh.getRange(1, 5).setValue("Event");
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sh;
}

function handleMetricsFeedback(data) {
  setup();
  const sh = setupMetricsFeedbackSheet();
  var event = data.event || "full_submit";
  var reviewerLabel = data.submitterName || "";
  sh.appendRow([
    new Date(),
    reviewerLabel,
    data.submitterEmail || "",
    data.sessionId || "",
    event,
    data.period || "",
    data.asOf || "",
    data.source || "",
    data.feedbackCount != null ? data.feedbackCount : (data.feedback || []).length,
    JSON.stringify(data.feedback || []),
    JSON.stringify(data)
  ]);

  // Sheet row is the success path. Optional notify emails must never block Sheet writes.
  var emailsSent = { internal: false, client: false };
  if (event !== "item_save") {
    try {
      const lines = (data.feedback || []).map(function(item) {
        return "• " + (item.label || item.id) + " — " + (item.verdict || "") +
            (item.comment ? "\n  " + item.comment : "") +
            (item.suggestedTarget ? "\n  Suggested: " + item.suggestedTarget : "");
      });
      const who = (data.submitterName || "") +
        (data.submitterName && data.submitterEmail ? " · " : "") +
        (data.submitterEmail || "(no email)");
      const body = [
        "Metrics feedback from " + who,
        "Session: " + (data.sessionId || ""),
        "Period: " + (data.period || "") + " · as of " + (data.asOf || ""),
        "Source: " + (data.source || ""),
        "",
        lines.join("\n"),
        "",
        "— Gilbert metrics page (Sheet tab MetricsFeedback is source of truth)"
      ].join("\n");

      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "Gilbert — metrics feedback — " + (data.submitterName || data.submitterEmail || "review"),
        body
      );
      emailsSent.internal = true;

      if (data.submitterEmail) {
        MailApp.sendEmail(
          data.submitterEmail,
          "Gilbert — we received your metric feedback",
          "Thanks — Gilded Goose received your ratings on " + (data.feedbackCount || 0) + " metrics/charts.\n\nWe'll use this to tune targets and chart types for the next report.\n\n— Gilded Goose Limited",
          { name: "Gilded Goose Limited", replyTo: NOTIFY_EMAIL }
        );
        emailsSent.client = true;
      }
    } catch (mailErr) {
      // Keep ok:true — Sheet already has the row.
      emailsSent.error = String(mailErr);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    type: "metrics_feedback",
    event: event,
    sheet: "MetricsFeedback",
    emailsSent: emailsSent
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.type === "metrics_feedback") {
      return handleMetricsFeedback(data);
    }
    setup();
    const ss = getPickerSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME);

    const projects = data.projects || [];
    const noteBlock = formatNotes(data.projectNotes);

    sh.appendRow([
      new Date(),
      data.submittedBy || "",
      data.submitterEmail || "",
      data.goalText || "",
      data.filterConsultingBudget != null ? data.filterConsultingBudget : "",
      data.filterMediaBudget != null ? data.filterMediaBudget : "",
      data.retainer ? "YES" : "NO",
      data.retainerFee || "",
      projects.map(function(p) { return p.id; }).join(", "),
      projects.map(function(p) { return p.title; }).join(" | "),
      projects.map(function(p) { return p.fee; }).join(", "),
      data.projectsSubtotalNum != null ? data.projectsSubtotalNum : "",
      data.grandTotalNote || "",
      data.depositAmount != null ? data.depositAmount : "",
      data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "",
      JSON.stringify(data.gilbertChat || []),
      JSON.stringify(data.projectNotes || {}),
      JSON.stringify(data)
    ]);

    var clientName = data.submittedBy || "Client";
    var internalSubject = "Gilbert — invoice from this — " + clientName;
    var clientSubject = "Gilbert — project selections received — Gilded Goose";

    MailApp.sendEmail(
      NOTIFY_EMAIL,
      internalSubject,
      buildInternalEmail(data, projects, noteBlock)
    );

    if (data.submitterEmail) {
      MailApp.sendEmail(
        data.submitterEmail,
        clientSubject,
        buildClientEmail(data, projects, noteBlock),
        { name: "Gilded Goose Limited", replyTo: NOTIFY_EMAIL }
      );
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      emailsSent: { internal: true, client: !!data.submitterEmail }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
