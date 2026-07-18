/**
 * Pav Law Project Picker — submission webhook
 *
 * Destination Sheet (Submissions + MetricsFeedback + SowSigning):
 *   https://docs.google.com/spreadsheets/d/1rPRZlFu-iq5ddStMJFByPs8dDzRk4NZ7tJZze-T_JlM/edit
 *
 * 1. Open that Sheet → Extensions → Apps Script → paste this file (or re-paste after edits)
 * 2. Run setup() once (authorize) — creates Submissions + MetricsFeedback + SowSigning tabs
 * 3. Deploy → New deployment (first time) or Manage deployments → Edit → New version (updates)
 *    → Web app → Execute as: Me → Anyone
 * 4. Copy web app /exec URL into GitHub Secret PAV_PICKER_WEBHOOK_URL (Secret 1) — NOT the Sheet URL
 */
const NOTIFY_EMAIL = "support@gildedgooselimited.com";
const SHEET_NAME = "Submissions";

/** Locked destination — do not use getActiveSpreadsheet for writes. */
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
  setupSowSigningSheet();
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

function formatConsentBlock(data) {
  if (!data || !data.consentAgreed) return "";
  return [
    "",
    "E-sign consent: YES",
    "Consent version: " + (data.consentVersion || "—"),
    "Consent at: " + (data.consentAt || data.esignSignedAt || "—"),
    "Firm signer: " + (data.signerFirm || "—"),
    "Individual signer: " + (data.signerIndividual || "—"),
    "Consent text: " + (data.consentText || "—")
  ].join("\n");
}

const SOW_SIGNING_SHEET = "SowSigning";
const GUIDE_SIGNING_URL = "https://gildedgooseltd.github.io/GilbertGuide/";
const CLIENT_SIGNER = "Andrew Brown";
const CONSULTANT_SIGNER = "Kate Stannard";
const SOW_LINK_DAYS = 14;
const SOW_HEADERS = [
  "Created", "Request ID", "Status", "Expires", "Client email",
  "Client token hash", "Consultant token hash", "Payload JSON", "Current SOW text", "Document hash",
  "Andrew server timestamp", "Andrew client timestamp", "Andrew public IP", "Andrew timezone", "Andrew user agent", "Andrew checks JSON",
  "Kate server timestamp", "Kate client timestamp", "Kate public IP", "Kate timezone", "Kate user agent", "Kate checks JSON",
  "Drive Doc ID", "Drive PDF ID", "Final document hash"
];

function setupSowSigningSheet() {
  const ss = getPickerSpreadsheet();
  let sh = ss.getSheetByName(SOW_SIGNING_SHEET);
  if (!sh) sh = ss.insertSheet(SOW_SIGNING_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(SOW_HEADERS);
    sh.getRange(1, 1, 1, SOW_HEADERS.length).setFontWeight("bold");
  }
  return sh;
}

function sha256Hex(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value || ""),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    var n = b < 0 ? b + 256 : b;
    return ("0" + n.toString(16)).slice(-2);
  }).join("");
}

function newSigningToken() {
  return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, "");
}

function signingUrl(token) {
  return GUIDE_SIGNING_URL + "?sow=" + encodeURIComponent(token);
}

function money(value) {
  var n = Number(value);
  if (!isFinite(n)) return "$[___]";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function selectedSowTitles(data) {
  var titles = [];
  if (data.retainer && data.retainerTitle) titles.push(data.retainerTitle);
  (data.projects || []).forEach(function(project) {
    if (project && project.title) titles.push(project.title);
  });
  return titles;
}

function buildCanonicalSow(data) {
  var titles = selectedSowTitles(data);
  var lines = [
    "STATEMENT OF WORK",
    "Marketing and Business Operations Consulting",
    "",
    "Governed by: Master Services Agreement (MSA)",
    "Consultant: Gilded Goose Limited · Kate Stannard",
    "Co-Client 1: Pav Law · authorized signer Andrew Brown",
    "Co-Client 2: Andrew Brown · individually",
    "SOW prepared: " + new Date().toISOString(),
    "Client contact email: " + (data.submitterEmail || "[email]"),
    "",
    "————————————————————————",
    "1. SUMMARY",
    "",
    titles.length ? "Selected projects: " + titles.join("; ") + "." : "Selected projects: [none]."
  ];
  if (data.goalText) lines.push("Client goal note: " + data.goalText);
  lines = lines.concat([
    "",
    "————————————————————————",
    "2. SCOPE — SELECTED PROJECT TITLES",
    ""
  ]);
  if (titles.length) {
    titles.forEach(function(title, index) { lines.push((index + 1) + ". " + title); });
  } else {
    lines.push("1. [projects]");
  }
  lines = lines.concat([
    "",
    "Change orders. Work outside this scope needs a written change order (email OK) with fee and schedule impact before Consultant proceeds.",
    "",
    "————————————————————————",
    "3. CLIENT RESPONSIBILITIES",
    "",
    "• Admin access, tools, and data within 3 business days of signing",
    "• Attorney advertising approval before any public publish/place",
    "• Feedback within twenty-four (24) hours for public-facing ad/content review, unless Client states a longer window",
    "• Pay Schedule A invoices on time",
    "",
    "————————————————————————",
    "4. FEES AND PAYMENT",
    "",
    "List / consulting subtotal: " + (data.projectsSubtotal || data.grandTotalNote || "$[___]"),
    "Deposit due at signing: " + (data.depositAmount != null ? money(data.depositAmount) : "$[___]") +
      (data.depositPct != null ? " (" + Math.round(Number(data.depositPct) * 100) + "%)" : ""),
    "Remainder / invoice schedule: " + (data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "Per payment terms selected"),
    data.maintenanceMonthlyNum ? "Retainer / maintenance: " + data.maintenanceMonthly + "/mo, billed separately" : "Retainer / maintenance: none selected",
    "Media spend: Client direct to platforms",
    "Pass-through, handling, tax, and late charges: MSA Article 5",
    "",
    "————————————————————————",
    "5. SCHEDULE A — PAYMENT TERMS",
    "",
    data.invoicePaymentTermsLabel || data.invoicePaymentTerms || "Per payment terms selected in the Project Guide.",
    data.paymentSurchargeAmount ? "Schedule surcharge: " + money(data.paymentSurchargeAmount) : "Schedule surcharge: none",
    data.paymentTotalDue != null ? "Total due on project schedule: " + money(data.paymentTotalDue) : "",
    "",
    "————————————————————————",
    "6. SIGNATURES",
    "",
    "This SOW is governed by the MSA between the Parties.",
    "",
    "Andrew Brown signs once in two capacities:",
    "• For Pav Law as authorized signer (Co-Client 1)",
    "• Individually (Co-Client 2)",
    "",
    "Gilded Goose Limited countersigns through a separate private signing link.",
    "",
    "Status: Awaiting Andrew Brown electronic signature."
  ]);
  return lines.filter(function(line) { return line !== null && line !== undefined; }).join("\n");
}

function appendSignatureAudit(sowText, signature) {
  return String(sowText || "").replace(/\nStatus: .*$/, "") + [
    "",
    "————————————————————————",
    signature.role === "client" ? "ANDREW BROWN ELECTRONIC SIGNATURE" : "GILDED GOOSE COUNTERSIGNATURE",
    "",
    "Signer: " + signature.signer,
    "Capacity: " + signature.capacity,
    "Server timestamp: " + signature.serverTimestamp,
    "Signer-device timestamp: " + (signature.clientTimestamp || "unavailable"),
    "Public IP reported by independent browser lookup: " + (signature.publicIp || "unavailable"),
    "Time zone: " + (signature.timeZone || "unavailable"),
    "User agent: " + (signature.userAgent || "unavailable"),
    "Consent version: " + (signature.consentVersion || "unavailable"),
    "Required acknowledgments: " + JSON.stringify(signature.checks || {}),
    "Document hash before this signature (SHA-256): " + signature.documentHash,
    "",
    signature.role === "client"
      ? "Andrew Brown electronically signed for Pav Law and individually as Co-Client 2."
      : "Kate Stannard electronically countersigned for Gilded Goose Limited.",
    "",
    "Status: " + (signature.role === "client" ? "Awaiting Gilded Goose countersignature." : "Fully executed.")
  ].join("\n");
}

function findSigningRecord(token) {
  var hash = sha256Hex(token);
  var sh = setupSowSigningSheet();
  if (sh.getLastRow() < 2) return null;
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, SOW_HEADERS.length).getValues();
  for (var i = 0; i < rows.length; i += 1) {
    if (rows[i][5] === hash) return { sheet: sh, rowNumber: i + 2, values: rows[i], role: "client" };
    if (rows[i][6] === hash) return { sheet: sh, rowNumber: i + 2, values: rows[i], role: "consultant" };
  }
  return null;
}

function isSigningExpired(record) {
  return new Date(record.values[3]).getTime() < Date.now();
}

function validateChecks(checks, role) {
  if (!checks || !checks.reviewed || !checks.electronicConsent) return false;
  if (role === "client" && (!checks.firmAuthority || !checks.individualCapacity)) return false;
  return true;
}

function createSowSigningRequest(data) {
  if (!data.submitterEmail) throw new Error("Andrew Brown email is required for the private signing link.");
  var sh = setupSowSigningSheet();
  var requestId = "SOW-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Utilities.getUuid().slice(0, 8);
  var token = newSigningToken();
  var sowText = buildCanonicalSow(data);
  var expires = new Date(Date.now() + SOW_LINK_DAYS * 24 * 60 * 60 * 1000);
  sh.appendRow([
    new Date(), requestId, "awaiting_client", expires, data.submitterEmail,
    sha256Hex(token), "", JSON.stringify(data), sowText, sha256Hex(sowText),
    "", "", "", "", "", "",
    "", "", "", "", "", "",
    "", "", ""
  ]);
  var url = signingUrl(token);
  MailApp.sendEmail({
    to: data.submitterEmail,
    subject: "Private link — Andrew Brown: sign Pav Law SOW",
    body: [
      "Andrew,",
      "",
      "Use this private, single-use link to review and electronically sign the fixed Pav Law Statement of Work:",
      url,
      "",
      "The link expires in " + SOW_LINK_DAYS + " days. Do not forward it.",
      "After you sign, your PDF copy will download and arrive by email. Kate will receive a separate private countersign link.",
      "",
      "— Gilded Goose Limited"
    ].join("\n"),
    name: "Gilded Goose Limited",
    replyTo: NOTIFY_EMAIL
  });
  return { requestId: requestId, url: url, expiresAt: expires.toISOString() };
}

function signingRecordForBrowser(token) {
  var record = findSigningRecord(token);
  if (!record) throw new Error("Private signing link is invalid.");
  if (isSigningExpired(record)) throw new Error("Private signing link expired. Ask Gilded Goose for a new link.");
  var status = record.values[2];
  if (record.role === "client" && status !== "awaiting_client") throw new Error("Andrew’s signing link has already been used.");
  if (record.role === "consultant" && status !== "awaiting_consultant") throw new Error("Gilded Goose’s countersign link has already been used.");
  return {
    role: record.role,
    requestId: record.values[1],
    expiresAt: new Date(record.values[3]).toISOString(),
    payload: JSON.parse(record.values[7] || "{}"),
    sowText: record.values[8],
    documentHash: record.values[9]
  };
}

function makePdfBlob(text, name) {
  var doc = DocumentApp.create(name);
  doc.getBody().setText(text);
  doc.saveAndClose();
  var file = DriveApp.getFileById(doc.getId());
  var pdf = file.getAs(MimeType.PDF).setName(name + ".pdf");
  file.setTrashed(true);
  return pdf;
}

function getSignedSowFolder() {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty("SOW_DRIVE_FOLDER_ID");
  if (folderId) {
    try { return DriveApp.getFolderById(folderId); } catch (e) { /* create replacement below */ }
  }
  var folder = DriveApp.createFolder("Gilbert Guide Signed SOWs");
  props.setProperty("SOW_DRIVE_FOLDER_ID", folder.getId());
  return folder;
}

function archiveFinalSow(text, requestId) {
  var folder = getSignedSowFolder();
  var name = requestId + " — Pav Law — fully executed";
  var doc = DocumentApp.create(name);
  doc.getBody().setText(text);
  doc.saveAndClose();
  var docFile = DriveApp.getFileById(doc.getId());
  docFile.moveTo(folder);
  var pdfBlob = docFile.getAs(MimeType.PDF).setName(name + ".pdf");
  var pdfFile = folder.createFile(pdfBlob);
  return { docId: docFile.getId(), pdfId: pdfFile.getId(), pdfBlob: pdfBlob };
}

function signSowRecord(data) {
  if (!data.token) throw new Error("Missing signing token.");
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var record = findSigningRecord(data.token);
    if (!record) throw new Error("Private signing link is invalid.");
    if (isSigningExpired(record)) throw new Error("Private signing link expired.");
    if (data.role !== record.role) throw new Error("Signing role does not match this private link.");
    if (!validateChecks(data.checks, record.role)) throw new Error("Every required acknowledgment must be checked.");

    var expectedStatus = record.role === "client" ? "awaiting_client" : "awaiting_consultant";
    if (record.values[2] !== expectedStatus) throw new Error("This private signing link has already been used.");

    var serverTimestamp = new Date().toISOString();
    var currentText = String(record.values[8] || "");
    var currentHash = sha256Hex(currentText);
    if (currentHash !== record.values[9]) throw new Error("Stored SOW hash mismatch; signature stopped.");

    var signature = {
      role: record.role,
      signer: record.role === "client" ? CLIENT_SIGNER : CONSULTANT_SIGNER,
      capacity: record.role === "client"
        ? "Pav Law authorized signer and Individual Co-Client 2"
        : "Gilded Goose Limited, Principal",
      serverTimestamp: serverTimestamp,
      clientTimestamp: data.clientSignedAt || "",
      publicIp: data.publicIp || "unavailable",
      timeZone: data.timeZone || "",
      userAgent: data.userAgent || "",
      consentVersion: data.consentVersion || "",
      checks: data.checks,
      documentHash: currentHash
    };
    var signedText = appendSignatureAudit(currentText, signature);
    var signedHash = sha256Hex(signedText);
    var payload = JSON.parse(record.values[7] || "{}");
    var requestId = record.values[1];

    if (record.role === "client") {
      var consultantToken = newSigningToken();
      record.sheet.getRange(record.rowNumber, 3).setValue("awaiting_consultant");
      record.sheet.getRange(record.rowNumber, 7).setValue(sha256Hex(consultantToken));
      record.sheet.getRange(record.rowNumber, 9).setValue(signedText);
      record.sheet.getRange(record.rowNumber, 10).setValue(signedHash);
      record.sheet.getRange(record.rowNumber, 11, 1, 6).setValues([[
        serverTimestamp, data.clientSignedAt || "", data.publicIp || "unavailable",
        data.timeZone || "", data.userAgent || "", JSON.stringify(data.checks)
      ]]);

      var clientPdf = makePdfBlob(signedText, requestId + " — Andrew signed");
      var counterUrl = signingUrl(consultantToken);
      MailApp.sendEmail({
        to: payload.submitterEmail,
        subject: "Pav Law SOW — Andrew signature recorded",
        body: "Andrew’s electronic signature was recorded at " + serverTimestamp + ".\n\nA PDF copy is attached. Gilded Goose has received a separate countersign link.",
        attachments: [clientPdf],
        name: "Gilded Goose Limited",
        replyTo: NOTIFY_EMAIL
      });
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Action required — countersign Pav Law SOW",
        body: [
          "Andrew Brown signed the fixed Pav Law SOW.",
          "",
          "Use this private, single-use link to review and countersign:",
          counterUrl,
          "",
          "Do not forward this link. The Andrew-signed PDF is attached.",
          "Request: " + requestId
        ].join("\n"),
        attachments: [clientPdf]
      });
      return {
        ok: true,
        stage: "client_signed",
        pdfName: clientPdf.getName(),
        pdfBase64: Utilities.base64Encode(clientPdf.getBytes())
      };
    }

    var archive = archiveFinalSow(signedText, requestId);
    record.sheet.getRange(record.rowNumber, 3).setValue("completed");
    record.sheet.getRange(record.rowNumber, 9).setValue(signedText);
    record.sheet.getRange(record.rowNumber, 10).setValue(signedHash);
    record.sheet.getRange(record.rowNumber, 17, 1, 6).setValues([[
      serverTimestamp, data.clientSignedAt || "", data.publicIp || "unavailable",
      data.timeZone || "", data.userAgent || "", JSON.stringify(data.checks)
    ]]);
    record.sheet.getRange(record.rowNumber, 23).setValue(archive.docId);
    record.sheet.getRange(record.rowNumber, 24).setValue(archive.pdfId);
    record.sheet.getRange(record.rowNumber, 25).setValue(signedHash);

    var finalBody = [
      "The Pav Law Statement of Work is fully executed.",
      "",
      "Andrew Brown signed for Pav Law and individually.",
      "Kate Stannard countersigned for Gilded Goose Limited.",
      "Final server timestamp: " + serverTimestamp,
      "Final SHA-256: " + signedHash,
      "",
      "The final PDF is attached. Gilded Goose’s private Drive archive contains the Google Doc and PDF.",
      "Request: " + requestId
    ].join("\n");
    MailApp.sendEmail({
      to: payload.submitterEmail,
      cc: NOTIFY_EMAIL,
      subject: "Fully executed — Pav Law Statement of Work",
      body: finalBody,
      attachments: [archive.pdfBlob],
      name: "Gilded Goose Limited",
      replyTo: NOTIFY_EMAIL
    });
    return {
      ok: true,
      stage: "completed",
      pdfName: archive.pdfBlob.getName(),
      pdfBase64: Utilities.base64Encode(archive.pdfBlob.getBytes()),
      driveDocId: archive.docId,
      drivePdfId: archive.pdfId
    };
  } finally {
    lock.releaseLock();
  }
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
    formatConsentBlock(data),
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
    formatConsentBlock(data),
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
  if (e && e.parameter && e.parameter.action === "sow") {
    try {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        signing: signingRecordForBrowser(e.parameter.token || "")
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: String(err && err.message ? err.message : err)
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  if (e && e.parameter && e.parameter.ping) {
    var formUrl = "";
    try {
      formUrl = PropertiesService.getScriptProperties().getProperty("FEEDBACK_FORM_URL") || "";
    } catch (err) { /* ignore */ }
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      service: "gilbert-guide",
      metricsFeedback: true,
      sowEsign: "private-staged-v2",
      spreadsheetId: SPREADSHEET_ID,
      feedbackFormUrl: formUrl
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    message: "Gilbert project picker webhook — POST JSON submissions here.",
    metricsFeedback: true
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from Apps Script editor (Run → createCockpitFeedbackForm).
 * Creates a Form linked to this spreadsheet, logs the published URL,
 * and stores it in Script Properties as FEEDBACK_FORM_URL.
 * Paste that URL into pages-config.js → feedbackFormUrl for the cockpit popup.
 */
function createCockpitFeedbackForm() {
  var form = FormApp.create("Pav Law Cockpit — layout & design feedback");
  form.setDescription(
    "Tell us what to change on the Pav Law Cockpit (KPIs, Project Guide, Impact, overall layout)."
  );
  form.addTextItem().setTitle("Your name").setRequired(false);
  form.addListItem()
    .setTitle("Which area?")
    .setChoiceValues([
      "KPIs / metrics",
      "Project Guide",
      "Impact",
      "Overall layout / branding",
      "Other"
    ])
    .setRequired(true);
  form.addParagraphTextItem()
    .setTitle("What should we change?")
    .setRequired(true);
  form.addScaleItem()
    .setTitle("How clear is this page (1–5)?")
    .setBounds(1, 5)
    .setRequired(false);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, SPREADSHEET_ID);
  var published = form.getPublishedUrl();
  PropertiesService.getScriptProperties().setProperty("FEEDBACK_FORM_URL", published);
  Logger.log("Published URL (paste into pages-config.js feedbackFormUrl):\n" + published);
  Logger.log("Edit form:\n" + form.getEditUrl());
  return published;
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
        var bit = "• " + (item.label || item.id);
        if (item.verdict) bit += " — " + item.verdict;
        if (item.comment) bit += "\n  " + item.comment;
        if (item.suggestedTarget) bit += "\n  Suggested: " + item.suggestedTarget;
        return bit;
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
    if (data.type === "sow_sign") {
      return ContentService.createTextOutput(JSON.stringify(signSowRecord(data)))
        .setMimeType(ContentService.MimeType.JSON);
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
    var signing = createSowSigningRequest(data);

    var clientName = data.submittedBy || "Client";
    var internalSubject = "Gilbert — invoice from this — " + clientName;
    var clientSubject = "Gilbert — project selections received — Gilded Goose";

    var emailsSent = { internal: false, client: false };
    try {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        internalSubject,
        buildInternalEmail(data, projects, noteBlock)
      );
      emailsSent.internal = true;

      if (data.submitterEmail) {
        MailApp.sendEmail(
          data.submitterEmail,
          clientSubject,
          buildClientEmail(data, projects, noteBlock),
          { name: "Gilded Goose Limited", replyTo: NOTIFY_EMAIL }
        );
        emailsSent.client = true;
      }
    } catch (mailErr) {
      emailsSent.error = String(mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      emailsSent: emailsSent,
      signing: signing
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
