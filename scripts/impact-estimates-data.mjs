/**
 * Impact estimates per campaign — update when new Ad Reports / HubSpot / LSA data is pulled.
 * Run: npm run sync-impact (or npm run build)
 */
export const DATA_PULL = {
  asOf: "2026-07-11",
  source: "Ad Reports/exports/2026-07-11 · PERFORMANCE-REVIEW-2026-07-11.md"
};

const R = {
  answerRate: 0.69,
  leadToCase: 9 / 124,
  militaryCalls: 36,
  totalLeads: 124
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
  RETAINER: monthly(116, 90, 6.6, "Military 36 calls May verified + ~80 LSA phone/mo · Jul Search $6,277 / 640 interactions · NTGUILT 282 clicks (calls thin)"),
  A1: monthly(R.militaryCalls, 25, 1.8, "Negatives + RSA fixes recover wasted click spend"),
  A2: monthly(282, 45, 0.3, "NTGUILT Search clicks Jul; calls still thin — 9 all-time through Jun"),
  A3: wave(850, 120, 2, "Past-client list ~850 · holiday open rate ~14% est."),
  A4: monthly(200, 35, 0.5, "Referral network outreach pool"),
  A5: monthly(80, 12, 0.1, "Paid LP traffic already landing"),
  A6: monthly(60, 18, 0.2, "Warm outbound dials/mo target"),
  A7: monthly(500, 75, 0.1, "Social reach engagements/mo target"),
  A8: monthly(R.totalLeads, 86, 9, "Unified Jun dummy 124 leads · 9 cases at 7.3%"),
  A8M: monthly(R.totalLeads, 86, 9, "Same KPI set — retainer reporting refresh"),
  A9: monthly(40, 8, 0.05, "Proof-content readers → consult uplift"),
  A10: none("Strategy audit — measures execution compliance not leads"),
  A11: monthly(25, 17, 0.2, "Seasonal flight call target"),
  A12: monthly(15, 10, 0.1, "After-hours chat/form captures"),
  A13: monthly(120, 8, 0.05, "Display placement traffic est."),
  B1: monthly(R.totalLeads, 86, 2, "Speed-to-lead uplift on 124 inbound/mo"),
  B2: monthly(R.militaryCalls, 25, 1.8, "Current 69% answer; target 32 connected at 90%"),
  B3: monthly(90, 14, 0.15, "Speed fix on top paid entry pages"),
  B4: monthly(45, 7, 0.08, "Organic discovery sessions/mo target"),
  B5: wave(200, 40, 1.5, "Insurance sleeve households per wave"),
  B6: monthly(30, 5, 0.05, "Blog organic entrances"),
  B7: monthly(400, 60, 0.4, "Marketable past-client upload target"),
  B8: monthly(300, 45, 0.08, "Social post reach/mo"),
  B9: none("Cost savings — not lead attribution"),
  B10: monthly(120, 18, 0.15, "Profile discovery + GBP calls after NAP refresh")
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
