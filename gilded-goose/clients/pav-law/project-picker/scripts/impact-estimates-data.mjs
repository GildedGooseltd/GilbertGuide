/**
 * Impact estimates per campaign — update when new Ad Reports / HubSpot / LSA data is pulled.
 * Run: npm run sync-impact (or npm run build)
 */
export const DATA_PULL = {
  asOf: "2026-07-24",
  source: "Guide channelMonths May–Jun 2026 · LSA May corrected to inbox file 72 · PERFORMANCE-REVIEW-2026-07-11"
};

const R = {
  answerRate: 0.72,
  leadToCase: 9 / 124,
  /** May–Jun avg Search calls · Guide channelMonths */
  searchCallsAvg: 89,
  /** May–Jun avg LSA inbox leads · May 72 validated + Jun 83 */
  lsaLeadsAvg: 78,
  militaryCallsMay: 36,
  /** May 36 + Jun ~103 Military Search calls ÷ 2 */
  militaryCallsAvg: 70,
  totalLeadsAvg: 169
};

function monthly(impacted, connected, retained, note) {
  const c = connected ?? Math.round(impacted * R.answerRate * 10) / 10;
  const r = retained ?? Math.round(c * R.leadToCase * 10) / 10;
  return {
    leadsImpacted: impacted,
    leadsConnected: c,
    clientsRetained: r,
    period: "mo",
    ...DATA_PULL,
    ...(note ? { note } : {})
  };
}

function wave(impacted, connected, retained, note) {
  return {
    leadsImpacted: impacted,
    leadsConnected: connected,
    clientsRetained: retained,
    period: "wave",
    ...DATA_PULL,
    ...(note ? { note } : {})
  };
}

function none(note) {
  return {
    leadsImpacted: 0,
    leadsConnected: 0,
    clientsRetained: 0,
    period: "mo",
    ...DATA_PULL,
    note: note || "Infrastructure / reporting — no direct lead-gen"
  };
}

/** @type {Record<string, object>} */
export const IMPACT_ESTIMATES = {
  RETAINER: monthly(167, 120, 8.8, "May–Jun avg · ~89 Search calls + ~78 LSA leads · answer 72%"),
  AdEnhance: monthly(R.militaryCallsAvg, 50, 3.6, "Negatives + RSA fixes on Military ~70 calls/mo avg"),
  NtguiltAd: monthly(282, 45, 0.3, "NTGUILT Search clicks Jul; calls still thin — 9 all-time through Jun"),
  SummerEmail: wave(850, 120, 2, "Past-client list ~850 · holiday open rate ~14% est."),
  Referral: monthly(200, 35, 0.5, "Referral network outreach pool"),
  HsLanding: monthly(80, 12, 0.1, "Paid LP traffic already landing"),
  GabrielOut: monthly(60, 18, 0.2, "Warm outbound dials/mo target"),
  SocialAds: monthly(500, 75, 0.1, "Social reach engagements/mo target"),
  OpsDash: monthly(R.totalLeadsAvg, 122, 8.9, "May–Jun avg total leads ~169 · lead→case 7.3%"),
  DataMgmt: monthly(R.totalLeadsAvg, 122, 8.9, "Same KPI set — retainer reporting refresh"),
  CaseWins: monthly(40, 8, 0.05, "Proof-content readers → consult uplift"),
  StackAudit: none("Strategy audit — measures execution compliance not leads"),
  HolidayAds: monthly(25, 17, 0.2, "Seasonal flight call target"),
  PaviChat: monthly(15, 10, 0.1, "After-hours chat/form captures"),
  AdultAds: monthly(120, 8, 0.05, "Display placement traffic est."),
  HsPipe: monthly(R.totalLeadsAvg, 122, 2, "Speed-to-lead uplift on ~169 inbound/mo avg"),
  HsVoip: monthly(R.searchCallsAvg, 64, 4.6, "May–Jun Search avg 89 · 72%→90% answer recovers ~16 connected"),
  WebSpeed: monthly(90, 14, 0.15, "Speed fix on top paid entry pages"),
  WebContent: monthly(45, 7, 0.08, "Organic discovery sessions/mo target"),
  InsMailer: wave(200, 40, 1.5, "Insurance sleeve households per wave"),
  BlogRevamp: monthly(30, 5, 0.05, "Blog organic entrances"),
  HsContacts: monthly(400, 60, 0.4, "Marketable past-client upload target"),
  HsSocial: monthly(300, 45, 0.08, "Social post reach/mo"),
  WasteAud: none("Cost savings — not lead attribution"),
  DigProf: monthly(120, 18, 0.15, "Profile discovery + GBP calls after NAP refresh")
};

export const FIELD_LABELS = {
  leadsImpacted: "Leads impacted",
  leadsConnected: "Leads connected",
  clientsRetained: "Clients retained"
};

export function formatImpactLabel(metric, est) {
  const v = est[metric];
  if (v == null) return "—";
  const p = est.period === "wave" ? "/wave" : "/mo";
  const n = Number(v);
  const display = n < 1 && n > 0 ? n.toFixed(1) : `~${Math.round(n * 10) / 10}`;
  return `${display}${p}`;
}
