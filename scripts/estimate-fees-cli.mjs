#!/usr/bin/env node
/**
 * Report market fee estimates vs locked Fee / INDEX Est. cost.
 * Estimates recalculate from project markdown scope on every `npm run build`.
 *
 * Usage:
 *   npm run estimate-fees
 *   npm run estimate-fees -- --id=A4
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  parseProjectMarkdown,
  applyIndexOverrides
} from "./markdown-project.mjs";
import { applyFeeEstimate } from "./estimate-project-fee.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

function loadAll() {
  const dir = path.join(CONTENT, "projects");
  let retainer = parseProjectMarkdown(
    fs.readFileSync(path.join(CONTENT, "retainer.md"), "utf8"),
    "retainer"
  );
  let projects = fs
    .readdirSync(dir)
    .filter(f => f.endsWith(".md") && !f.startsWith("_"))
    .map(f => parseProjectMarkdown(fs.readFileSync(path.join(dir, f), "utf8"), f));
  const indexPath = path.join(CONTENT, "INDEX.md");
  if (fs.existsSync(indexPath)) {
    ({ retainer, projects } = applyIndexOverrides(
      projects,
      retainer,
      fs.readFileSync(indexPath, "utf8")
    ));
  }
  applyFeeEstimate(retainer);
  projects.forEach(applyFeeEstimate);
  return { retainer, projects };
}

function fmt(n) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `$${Number(n).toLocaleString("en-US")}`;
}

function rowLabel(p) {
  const unit = p.feeEstimateUnit === "mo" ? "/mo" : "";
  const ong = p.feeEstimateOngoing ? ` + ${fmt(p.feeEstimateOngoing)}/mo` : "";
  const quote =
    p.feeEstimateUnit === "mo" || p.monthlyOnly || p.id === "RETAINER" || p.id === "A8M"
      ? `${fmt(p.fee)}/mo`
      : p.ongoingFee
        ? `${fmt(p.fee)} + ${fmt(p.ongoingFee)}/mo`
        : fmt(p.fee);
  const delta =
    p.feeEstimateDelta == null
      ? p.feeEstimatePackaged
        ? "packaged"
        : "—"
      : (p.feeEstimateDelta >= 0 ? "+" : "") + fmt(p.feeEstimateDelta);
  return {
    id: p.id,
    quote,
    market: `${fmt(p.feeEstimate)}${unit}${ong}`,
    delta,
    lane: p.feeEstimateLane,
    scope: p.feeEstimateScope?.raw
  };
}

const idFilter = (process.argv.find(a => a.startsWith("--id=")) || "").slice(5);
const { retainer, projects } = loadAll();
const all = [retainer, ...projects].filter(p => !idFilter || p.id === idFilter);

console.log("Market fee estimates (local Front Range + national blend)");
console.log("Quote = Fee / INDEX Est. cost · Market updates when you add tasks / value / info\n");
console.log(
  "ID".padEnd(8) +
    "Quote".padEnd(18) +
    "Market".padEnd(22) +
    "Δ".padEnd(12) +
    "Scope".padEnd(8) +
    "Lane"
);
console.log("-".repeat(90));
for (const p of all) {
  const r = rowLabel(p);
  console.log(
    r.id.padEnd(8) +
      r.quote.padEnd(18) +
      r.market.padEnd(22) +
      r.delta.padEnd(12) +
      String(r.scope ?? "—").padEnd(8) +
      r.lane
  );
}
console.log("\nDoes not change Fee or INDEX. Copy Market → INDEX Est. cost when you accept a quote.");
