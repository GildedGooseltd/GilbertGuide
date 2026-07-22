/**
 * Local (CO Springs / Front Range) + national law-firm marketing fee bands.
 * Used by estimate-project-fee.mjs — values are consulting fees only
 * (platform ad spend and print/merch production stay separate).
 *
 * Sources (Jul 2026): FEE-BENCHMARK-CO-SPRINGS.md, public PPC/CRM agency ranges,
 * HubSpot partner onboarding norms, national legal-marketing package listings.
 */

/** @typedef {{ local: [number, number], national: [number, number], unit?: "setup"|"mo" }} FeeBand */

/** @type {Record<string, FeeBand>} */
export const FEE_LANES = {
  retainer_ads: { local: [1000, 5000], national: [1500, 6000], unit: "mo" },
  digital_bundle_mo: { local: [1800, 2800], national: [2500, 4500], unit: "mo" },
  hubspot_foundation: { local: [3000, 8000], national: [5000, 15000], unit: "setup" },
  hubspot_sprint: { local: [1200, 2500], national: [2000, 5000], unit: "setup" },
  crm_nurture_mo: { local: [500, 1500], national: [750, 2000], unit: "mo" },
  website_ux: { local: [3000, 8000], national: [4000, 15000], unit: "setup" },
  website_content: { local: [1800, 3500], national: [2500, 6000], unit: "setup" },
  social_setup: { local: [2500, 6000], national: [3000, 7500], unit: "setup" },
  social_mo: { local: [500, 1500], national: [800, 2500], unit: "mo" },
  profiles_local: { local: [1200, 2500], national: [1500, 3500], unit: "setup" },
  referral_program: { local: [1400, 2800], national: [1800, 4500], unit: "setup" },
  referral_mo: { local: [400, 800], national: [500, 1200], unit: "mo" },
  ads_campaign: { local: [1500, 3500], national: [2000, 5500], unit: "setup" },
  display_search_launch: { local: [2200, 4000], national: [3000, 6500], unit: "setup" },
  intake_voip: { local: [1500, 3500], national: [2000, 4500], unit: "setup" },
  lsa_process: { local: [1000, 2200], national: [1500, 3500], unit: "setup" },
  audit_finance: { local: [1500, 3500], national: [2500, 6000], unit: "setup" },
  audit_stack: { local: [1200, 2500], national: [1800, 4000], unit: "setup" },
  performance_comp: { local: [1000, 2200], national: [1500, 3500], unit: "setup" },
  creative_brand: { local: [1400, 2800], national: [2000, 4500], unit: "setup" },
  email_campaign: { local: [900, 2200], national: [1200, 3000], unit: "setup" },
  chat_qa: { local: [1500, 3000], national: [2000, 4500], unit: "setup" },
  mailer: { local: [1500, 2800], national: [2000, 4000], unit: "setup" },
  swag_consult: { local: [800, 1800], national: [1000, 2500], unit: "setup" },
  outbound_enable: { local: [900, 1800], national: [1200, 2800], unit: "setup" },
  blog_seo: { local: [1800, 3200], national: [2500, 5500], unit: "setup" },
  systems_access: { local: [1500, 3000], national: [2000, 4500], unit: "setup" },
  sprint_general: { local: [1200, 4500], national: [1800, 6000], unit: "setup" }
};

/** Blend weight: Front Range is primary; national keeps quotes from undercutting big-firm norms. */
export const LOCAL_WEIGHT = 0.55;
export const NATIONAL_WEIGHT = 0.45;

/** Round Guide fees to nearest $100 (FEE-BENCHMARK rule). */
export function roundFee100(n) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.max(100, Math.round(n / 100) * 100);
}

export function bandMid([lo, hi]) {
  return (Number(lo) + Number(hi)) / 2;
}

/**
 * Pick a pricing lane from category / campaign type / title / keywords.
 * @param {{ category?: string, campaignType?: string, title?: string, keywords?: string[], id?: string, monthlyOnly?: boolean }} p
 */
export function detectFeeLane(p) {
  const id = String(p.id || "");
  const blob = [
    id,
    p.category,
    p.campaignType,
    p.title,
    ...(p.keywords || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const monthly =
    p.monthlyOnly ||
    id === "RETAINER" ||
    id === "A8M" ||
    /retainer|maintenance|\/mo|per month|monthly/i.test(blob);

  if (id === "RETAINER" || (/digital ads|ads maintenance|ppc|lsa/i.test(blob) && monthly && /retain|maint/i.test(blob)))
    return "retainer_ads";
  if (monthly && /social/i.test(blob)) return "social_mo";
  if (monthly && /referral|nurture|crm/i.test(blob)) return "referral_mo";
  if (monthly && /hubspot|crm|nurture/i.test(blob)) return "crm_nurture_mo";
  if (monthly) return "digital_bundle_mo";

  /* Exact IDs first — never use /B1/ style regex (matches B10, B11, B13…). */
  if (id === "B13") return "hubspot_foundation";
  if (id === "B2") return "intake_voip";
  if (id === "B11") return "lsa_process";
  if (id === "B10") return "profiles_local";
  if (id === "A4" || id === "A17") return "referral_program";
  if (id === "B9") return "audit_finance";
  if (id === "A10") return "audit_stack";
  if (id === "A14") return "performance_comp";
  if (id === "B3") return "website_ux";
  if (id === "B4") return "website_content";
  if (id === "B6") return "blog_seo";
  if (id === "A2") return "display_search_launch";
  if (id === "A7") return "social_setup";
  if (id === "B5") return "mailer";
  if (id === "B14") return "swag_consult";
  if (id === "A6") return "outbound_enable";
  if (id === "A12") return "chat_qa";
  if (id === "B1" || id === "B7" || id === "A5" || id === "A3") return "hubspot_sprint";

  if (/hubspot marketing setup|hs setup|foundation/i.test(blob)) return "hubspot_foundation";
  if (/pipeline|contacts upload|landing page|module/i.test(blob)) return "hubspot_sprint";
  if (/voip|phone|call infrastructure/i.test(blob)) return "intake_voip";
  if (/lsa call|call process/i.test(blob)) return "lsa_process";
  if (/profile|directory|yelp|gbp|nap/i.test(blob)) return "profiles_local";
  if (/performance plan|payout|incentive|comp plan/i.test(blob)) return "performance_comp";
  if (/referral/i.test(blob)) return "referral_program";
  if (/credit card|subscription leak|financial audit/i.test(blob)) return "audit_finance";
  if (/stack priorit|audit/i.test(blob)) return "audit_stack";
  if (/website speed|navigation|ux/i.test(blob)) return "website_ux";
  if (/website content|content overhaul/i.test(blob)) return "website_content";
  if (/blog/i.test(blob)) return "blog_seo";
  if (/display|search launch|ntguilt display/i.test(blob)) return "display_search_launch";
  if (/ad expansion|seasonal ads|adult site|digital ad/i.test(blob)) return "ads_campaign";
  if (/social campaign/i.test(blob)) return "social_setup";
  if (/mailer|envelope|direct mail/i.test(blob)) return "mailer";
  if (/swag|apparel/i.test(blob)) return "swag_consult";
  if (/outbound|calling|gabriel/i.test(blob)) return "outbound_enable";
  if (/chat|after-hours|pavi/i.test(blob)) return "chat_qa";
  if (/rebrand|case win|testimonial|creative|brand/i.test(blob)) return "creative_brand";
  if (/email/i.test(blob)) return "email_campaign";
  if (/systems access|dns|outage/i.test(blob)) return "systems_access";
  return "sprint_general";
}
