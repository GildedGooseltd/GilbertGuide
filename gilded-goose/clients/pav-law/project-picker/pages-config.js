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
  /** Review branch: wired here for local/preview. Live GilbertGuide injects via GitHub Secret PAV_PICKER_QUICKBOOKS_DEPOSIT_URL later. */
  quickbooksDepositUrl: "https://connect.intuit.com/pay/GildedGooseLimited/scs-v1-0df21a0017904621b181ae1a6966f612e00ab1e96756482eb00984d15e5bd8436ee16a8e815c4749957b0f1602fade57-0?locale=EN_US&cta=saveandcopylink",
  notifyEmail: "support@gildedgooselimited.com"
};
