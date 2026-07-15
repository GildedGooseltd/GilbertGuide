/**
 * Live/static PAV_PICKER_CONFIG. Deploy may overwrite from secret; if secret empty,
 * workflow falls back to pages-config.defaults.js (same webhookUrl).
 * Public on Pages by design for this architecture.
 */
window.PAV_PICKER_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/AKfycbyXinGO9Tnh0XlI9pKRD2sp7z3ruY6ZvFZU3yIjtxMW2HTRyak94q1g7ixbFA2DTfiAXw/exec",
  /** Google Form published URL (/viewform or forms.gle). Popup embeds this. */
  feedbackFormUrl: "",
  depositAmount: 2500,
  quickbooksDepositUrl: "",
  notifyEmail: "support@gildedgooselimited.com"
};
