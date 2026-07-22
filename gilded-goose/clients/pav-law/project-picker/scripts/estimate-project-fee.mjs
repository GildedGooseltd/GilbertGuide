/**
 * Market fee estimate from project scope (tasks, value-add, info, keywords)
 * blended from local Front Range + national law-marketing bands.
 *
 * Does NOT overwrite Fee / INDEX Est. cost — attaches feeEstimate* on the project
 * object at build time. Use `npm run estimate-fees` for a delta report.
 */
import {
  FEE_LANES,
  LOCAL_WEIGHT,
  NATIONAL_WEIGHT,
  bandMid,
  detectFeeLane,
  roundFee100
} from "./fee-estimate-bands.mjs";

function isInfoPlaceholder(item) {
  return /^_Add:_?$/i.test(String(item || "").trim());
}

function listCount(arr, { skipPlaceholder = false } = {}) {
  return (arr || []).filter(x => {
    const t = String(x || "").trim();
    if (!t || t === "-") return false;
    if (skipPlaceholder && isInfoPlaceholder(t)) return false;
    return true;
  }).length;
}

function wordCount(text) {
  return String(text || "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Scope units grow as Kate adds Value Added, Tasks/WIP, Completed, Information needed, AB-Qs, KPIs.
 */
export function scopeScore(p) {
  const valueAdd = listCount(p.valueAdded);
  const tasks =
    listCount(p.taskItems) +
    listCount(p.inProgressItems) +
    listCount(p.deliverables);
  const completed = listCount(p.completedItems);
  const info = listCount(p.informationNeeded, { skipPlaceholder: true });
  const ab = listCount(p.abQuestions);
  const kpis = listCount(p.kpiRefs);
  const descWords = wordCount(p.description) + wordCount(p.tldr) + wordCount(p.goal);
  const descUnits = Math.min(3, descWords / 80);

  const raw =
    valueAdd * 1 +
    tasks * 1.25 +
    completed * 0.4 +
    info * 0.55 +
    ab * 0.65 +
    kpis * 0.35 +
    descUnits;

  return {
    raw: Math.round(raw * 100) / 100,
    parts: { valueAdd, tasks, completed, info, ab, kpis, descUnits: Math.round(descUnits * 100) / 100 }
  };
}

/** Complexity premium for compliance, multi-channel, sensitive practice, deep CRM. */
export function complexityMultiplier(p) {
  const blob = [
    p.title,
    p.category,
    p.campaignType,
    p.description,
    p.tldr,
    ...(p.keywords || []),
    ...(p.valueAdded || []),
    ...(p.taskItems || []),
    ...(p.inProgressItems || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let m = 1;
  if (/aba|ethics|compliance|rpc|counsel review/i.test(blob)) m *= 1.08;
  if (/hubspot/.test(blob) && /voip|phone|pipeline|crm/.test(blob)) m *= 1.1;
  if (/display/.test(blob) && /search/.test(blob)) m *= 1.08;
  if (/sex crimes|adult site|sensitive|discreet/.test(blob)) m *= 1.12;
  if (/financial audit|quickbooks|reconciliation|savings.?share/.test(blob)) m *= 1.06;
  if (/multi.?channel|omnichannel/.test(blob)) m *= 1.06;
  return Math.round(Math.min(m, 1.35) * 1000) / 1000;
}

/**
 * Scope multiplier: thin outlines sit below band mid; fuller scopes rise toward/above mid.
 * Caps keep runaway bullet lists from exploding fees.
 */
export function scopeMultiplier(scoreRaw) {
  /* Soft curve: thin outlines ~0.75× mid; rich docs approach ~1.45× mid — not 2×. */
  return Math.min(1.45, Math.max(0.72, 0.78 + Math.log10(1 + scoreRaw) * 0.42));
}

function packagedHint(p) {
  const label = String(p.estCostLabel || "");
  if (/^incl/i.test(label) || /^merged/i.test(label)) return true;
  if (p.parentId && !(Number(p.fee) > 0)) return true;
  return false;
}

/**
 * @returns {{
 *   feeEstimate: number,
 *   feeEstimateOngoing: number|null,
 *   feeEstimateLane: string,
 *   feeEstimateUnit: "setup"|"mo",
 *   feeEstimateLocalMid: number,
 *   feeEstimateNationalMid: number,
 *   feeEstimateScope: object,
 *   feeEstimateComplexity: number,
 *   feeEstimateBlend: string,
 *   feeEstimatePackaged: boolean,
 *   feeEstimateDelta: number|null,
 *   feeEstimateNote: string
 * }}
 */
export function estimateProjectFee(p) {
  const laneId = detectFeeLane(p);
  const lane = FEE_LANES[laneId] || FEE_LANES.sprint_general;
  const localMid = bandMid(lane.local);
  const nationalMid = bandMid(lane.national);
  const blendedMid = LOCAL_WEIGHT * localMid + NATIONAL_WEIGHT * nationalMid;
  const scope = scopeScore(p);
  const scopeMult = scopeMultiplier(scope.raw);
  const complexity = complexityMultiplier(p);
  const raw = blendedMid * scopeMult * complexity;
  const feeEstimate = roundFee100(raw);
  const unit = lane.unit || "setup";

  let feeEstimateOngoing = null;
  if (unit === "setup" && laneId === "referral_program") {
    const mo = FEE_LANES.referral_mo;
    const moMid = LOCAL_WEIGHT * bandMid(mo.local) + NATIONAL_WEIGHT * bandMid(mo.national);
    feeEstimateOngoing = roundFee100(moMid * Math.min(1.25, 0.85 + scope.raw * 0.04));
  }

  const quote = Number(p.fee) || 0;
  const packaged = packagedHint(p);
  const delta = packaged || quote <= 0 ? null : feeEstimate - quote;

  const note = [
    `${laneId.replace(/_/g, " ")} lane`,
    `local mid $${Math.round(localMid).toLocaleString("en-US")}`,
    `national mid $${Math.round(nationalMid).toLocaleString("en-US")}`,
    `scope ×${scopeMult.toFixed(2)} (${scope.raw} units)`,
    `complexity ×${complexity}`
  ].join(" · ");

  return {
    feeEstimate,
    feeEstimateOngoing,
    feeEstimateLane: laneId,
    feeEstimateUnit: unit,
    feeEstimateLocalMid: roundFee100(localMid),
    feeEstimateNationalMid: roundFee100(nationalMid),
    feeEstimateScope: scope,
    feeEstimateComplexity: complexity,
    feeEstimateBlend: `${Math.round(LOCAL_WEIGHT * 100)}% local / ${Math.round(NATIONAL_WEIGHT * 100)}% national`,
    feeEstimatePackaged: packaged,
    feeEstimateDelta: delta,
    feeEstimateNote: note
  };
}

/** Attach estimate fields onto a project or retainer record (mutates + returns). */
export function applyFeeEstimate(p) {
  if (!p) return p;
  const est = estimateProjectFee(p);
  Object.assign(p, est);
  return p;
}
