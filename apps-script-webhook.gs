/**
 * Pav Law Project Picker — submission webhook
 *
 * 1. New Google Sheet → Extensions → Apps Script → paste this file
 * 2. Run setup() once (authorize)
 * 3. Deploy → New deployment → Web app → Execute as: Me → Anyone
 * 4. Copy web app URL into config.js → webhookUrl
 */
const NOTIFY_EMAIL = "support@gildedgooselimited.com";
const SHEET_NAME = "Submissions";

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
      "General suggestions",
      "Per-project notes (JSON)",
      "Raw JSON"
    ]);
    sh.getRange(1, 1, 1, 17).setFontWeight("bold");
  }
}

function formatNotes(notes) {
  if (!notes || typeof notes !== "object") return "";
  return Object.keys(notes).map(function(k) { return k + ": " + notes[k]; }).join("\n");
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

function buildInternalEmail(data, projects, noteBlock) {
  var depositLine = data.depositAmount != null
    ? "$" + data.depositAmount + " (QuickBooks deposit link sent to client)"
    : "—";
  return [
    "Picky Pavi — project picker (INTERNAL — create full invoice from this)",
    "",
    "Client: " + (data.submittedBy || "(not provided)"),
    "Email: " + (data.submitterEmail || "(not provided)"),
    "Submitted: " + (data.submittedAt || new Date().toISOString()),
    "",
    "Goal: " + (data.goalText || "—"),
    "Consulting budget filter: " + (data.filterConsultingBudget != null ? "$" + data.filterConsultingBudget : "—"),
    "Media budget filter: " + (data.filterMediaBudget != null ? "$" + data.filterMediaBudget : "—"),
    "",
    "Retainer: " + (data.retainer ? "YES — " + data.retainerFee + "/mo (" + (data.retainerTitle || "Digital Ads") + ")" : "NO"),
    "",
    "Projects selected (bill on full invoice):",
    formatProjectsList(projects),
    "",
    "First month consulting subtotal: " + (data.projectsSubtotal || "$0"),
    "Grand total note: " + (data.grandTotalNote || "—"),
    "",
    "Standard deposit collected separately: " + depositLine,
    "",
    "General suggestions:",
    data.generalSuggestions || "(none)",
    "",
    "Per-project notes:",
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
    "Estimated consulting (first month projects): " + (data.projectsSubtotal || "—"),
    "Note: " + (data.grandTotalNote || "—"),
    depositSection,
    "",
    "Your notes:",
    data.generalSuggestions || "(none)",
    "",
    "Per-project notes:",
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
      service: "picky-pavi"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    message: "Picky Pavi webhook — POST JSON submissions here."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    setup();
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
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
      data.generalSuggestions || "",
      JSON.stringify(data.projectNotes || {}),
      JSON.stringify(data)
    ]);

    var clientName = data.submittedBy || "Client";
    var internalSubject = "Picky Pavi — invoice from this — " + clientName;
    var clientSubject = "Picky Pavi — project selections received — Gilded Goose";

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
