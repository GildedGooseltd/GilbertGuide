/**
 * Committed fallback for Deploy Gilbert Guide when PAV_PICKER_WEBHOOK_URL is empty.
 * Public on GitHub Pages by design (same as secret inject).
 */
window.PAV_PICKER_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/AKfycbyXinGO9Tnh0XlI9pKRD2sp7z3ruY6ZvFZU3yIjtxMW2HTRyak94q1g7ixbFA2DTfiAXw/exec",
  feedbackFormUrl: "",
  depositAmount: 2500,
  /** Review fallback when Secret 2 empty. Live deploy should inject PAV_PICKER_QUICKBOOKS_DEPOSIT_URL. */
  quickbooksDepositUrl: "https://connect.intuit.com/pay/GildedGooseLimited/scs-v1-0df21a0017904621b181ae1a6966f612e00ab1e96756482eb00984d15e5bd8436ee16a8e815c4749957b0f1602fade57-0?locale=EN_US&cta=saveandcopylink",
  notifyEmail: "support@gildedgooselimited.com"
};
