/**
 * Copy to config.js and fill in after Apps Script + QuickBooks setup.
 */
window.PAV_PICKER_CONFIG = {
  webhookUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  /** Standard deposit via QuickBooks link; full project invoice created from Sheet later */
  depositAmount: 2500,
  quickbooksDepositUrl: "https://pay.intuit.com/YOUR_PAYMENT_LINK"
};
