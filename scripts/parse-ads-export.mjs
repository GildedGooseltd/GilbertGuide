#!/usr/bin/env node
/**
 * Validate picker/KPI numbers against LOCAL Ad Reports CSVs only.
 * - Reads files under Ad Reports/exports/{batch}/ on this machine
 * - Writes aggregate counts to DATA-VALIDATION.md (no phones, names, or emails)
 * - Never uploads or calls external APIs
 *
 * Usage:
 *   npm run validate-data
 *   node scripts/parse-ads-export.mjs --batch=2026-07-11 --prior=2026-05-30
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { KPI_EXPECTED } from "./kpi-expected.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = path.resolve(ROOT, "..", "..", "..", "..");
const EXPORTS_ROOT = path.join(WORKSPACE, "Ad Reports", "exports");
const OUT_MD = path.join(ROOT, "DATA-VALIDATION.md");

function arg(name, fallback) {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

/** Parse one CSV line respecting quoted fields. */
function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === "," && !q) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function findCampaignReport(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => /^Campaign report.*\.csv$/i.test(f));
  return files.length ? path.join(dir, files[0]) : null;
}

/**
 * Parse Google Ads campaign CSV — skips multiline quoted ad-strength blocks
 * by only accepting rows whose first cell is Enabled|Paused|Total.
 */
function parseCampaignReport(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const dateRange = (lines[1] || "").replace(/"/g, "").trim();
  const headerLine = lines.find(l => l.startsWith("Campaign status,"));
  if (!headerLine) throw new Error(`No header in ${filePath}`);
  const headers = splitCsvLine(headerLine);
  const idx = name => headers.indexOf(name);

  const campaigns = [];
  let hasPhoneCalls = idx("Phone calls") >= 0;

  for (const line of lines) {
    if (!/^(Enabled|Paused),/.test(line)) continue;
    const cols = splitCsvLine(line);
    const name = cols[idx("Campaign")];
    if (!name || name === " --") continue;
    const cost = parseFloat(String(cols[idx("Cost")] || "0").replace(/,/g, ""));
    const clicks = parseInt(String(cols[idx("Clicks")] ?? cols[idx("Interactions")] ?? "0").replace(/,/g, ""), 10);
    const phoneCalls = hasPhoneCalls
      ? parseInt(String(cols[idx("Phone calls")] || "0").replace(/,/g, ""), 10)
      : null;
    const avgCpc = parseFloat(String(cols[idx("Avg. CPC")] ?? cols[idx("Avg. cost")] ?? "0").replace(/,/g, ""));
    campaigns.push({ name, cost, clicks, phoneCalls, avgCpc });
  }

  const total = campaigns.reduce(
    (a, c) => ({
      spend: a.spend + (c.cost || 0),
      clicks: a.clicks + (c.clicks || 0),
      phoneCalls: c.phoneCalls != null ? a.phoneCalls + c.phoneCalls : a.phoneCalls
    }),
    { spend: 0, clicks: 0, phoneCalls: hasPhoneCalls ? 0 : null }
  );

  return { dateRange, hasPhoneCalls, campaigns, total };
}

/** LSA leads-inbox — aggregate counts only; Customer column never stored. */
function parseLsaInbox(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  const iReceived = headers.indexOf("Lead received");
  const iCharge = headers.indexOf("Charge status");
  const iType = headers.indexOf("Lead type");

  const byMonth = {};
  let total = 0;
  let charged = 0;
  let phone = 0;

  for (let n = 1; n < lines.length; n++) {
    const cols = splitCsvLine(lines[n]);
    if (cols.length < 3) continue;
    total++;
    const received = cols[iReceived] || "";
    const month = received.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+\s+(\d{4})/);
    const key = month ? `${month[1]} ${month[2]}` : "Unknown";
    if (!byMonth[key]) byMonth[key] = { leads: 0, charged: 0, phone: 0 };
    byMonth[key].leads++;
    if ((cols[iCharge] || "").toLowerCase() === "charged") {
      byMonth[key].charged++;
      charged++;
    }
    if ((cols[iType] || "").toLowerCase().includes("phone")) {
      byMonth[key].phone++;
      phone++;
    }
  }

  return { total, charged, phone, byMonth };
}

function near(a, b, tol = 0.02) {
  if (a == null || b == null) return null;
  const x = Number(a);
  const y = Number(b);
  if (Number.isNaN(x) || Number.isNaN(y)) return false;
  if (y === 0) return Math.abs(x - y) < 0.01;
  return Math.abs(x - y) / Math.abs(y) <= tol;
}

function status(ok, warn, msg) {
  if (ok === null) return { level: "gap", msg };
  if (ok) return { level: "ok", msg };
  if (warn) return { level: "warn", msg };
  return { level: "fail", msg };
}

function run() {
  const batch = arg("batch", "2026-07-11");
  const prior = arg("prior", "2026-05-30");
  const batchDir = path.join(EXPORTS_ROOT, batch);
  const priorDir = path.join(EXPORTS_ROOT, prior);

  const rows = [];
  const push = (area, check, result) => rows.push({ area, check, ...result });

  if (!fs.existsSync(EXPORTS_ROOT)) {
    console.error("Ad Reports/exports not found at", EXPORTS_ROOT);
    process.exit(1);
  }

  const julCampaignPath = findCampaignReport(batchDir);
  const mayCampaignPath = findCampaignReport(priorDir);
  const lsaPath = path.join(batchDir, fs.existsSync(batchDir)
    ? fs.readdirSync(batchDir).find(f => /^leads-inbox.*\.csv$/i.test(f)) || ""
    : "");

  let jul = null;
  let may = null;
  let lsa = null;

  if (julCampaignPath) {
    jul = parseCampaignReport(julCampaignPath);
    push("Google Ads (current)", "Export file", { level: "ok", msg: path.basename(julCampaignPath) + ` · ${jul.dateRange}` });
    push("Google Ads (current)", "Phone calls column", jul.hasPhoneCalls
      ? { level: "ok", msg: "Present — cost/call can be computed from file" }
      : { level: "gap", msg: "Missing — re-export with Phone calls (see DATA-EXPORT-CLICKPATHS.md)" });

    for (const [name, exp] of Object.entries(KPI_EXPECTED.campaignsJul)) {
      const row = jul.campaigns.find(c => c.name === name);
      if (!row) {
        push("Google Ads (current)", name, { level: "fail", msg: "Campaign not found in export" });
        continue;
      }
      push("Google Ads (current)", `${name} spend`, status(near(row.cost, exp.spend, 0.01), true,
        `File $${row.cost.toFixed(2)} vs expected $${exp.spend}`));
      push("Google Ads (current)", `${name} clicks`, status(row.clicks === exp.clicks, true,
        `File ${row.clicks} vs expected ${exp.clicks}`));
    }

    const mil = jul.campaigns.find(c => c.name === "Military | Search | Calls");
    if (mil && jul.hasPhoneCalls && mil.phoneCalls > 0) {
      const cpc = mil.cost / mil.phoneCalls;
      push("KPI #12", "Military cost/call (from file)", status(
        cpc >= KPI_EXPECTED.kpis.militaryCostPerCallReviewLow && cpc <= KPI_EXPECTED.kpis.militaryCostPerCallReviewHigh,
        cpc < KPI_EXPECTED.kpis.militaryCostPerCallUi,
        `Computed $${cpc.toFixed(0)}/call · UI shows $${KPI_EXPECTED.kpis.militaryCostPerCallUi} · review band $${KPI_EXPECTED.kpis.militaryCostPerCallReviewLow}–$${KPI_EXPECTED.kpis.militaryCostPerCallReviewHigh}`
      ));
    } else if (mil) {
      push("KPI #12", "Military cost/call (from file)", {
        level: "gap",
        msg: `Cannot compute — spend $${mil.cost.toFixed(0)} but no phone calls in export`
      });
    }
  } else {
    push("Google Ads (current)", "Export file", { level: "fail", msg: `No campaign report in ${batchDir}` });
  }

  if (mayCampaignPath) {
    may = parseCampaignReport(mayCampaignPath);
    const milMay = may.campaigns.find(c => c.name === "Military | Search | Calls");
    if (milMay?.phoneCalls != null) {
      push("Google Ads (prior May)", "Military phone calls", status(
        milMay.phoneCalls === KPI_EXPECTED.kpis.militaryCallsMay,
        true,
        `File ${milMay.phoneCalls} vs picker baseline ${KPI_EXPECTED.kpis.militaryCallsMay} · ${may.dateRange}`
      ));
      if (milMay.phoneCalls > 0) {
        const cpc = milMay.cost / milMay.phoneCalls;
        push("Google Ads (prior May)", "Military cost/call", {
          level: "ok",
          msg: `~$${cpc.toFixed(0)}/call from file ($${milMay.cost.toFixed(0)} / ${milMay.phoneCalls} calls)`
        });
      }
    }
  }

  if (lsaPath && fs.existsSync(lsaPath)) {
    lsa = parseLsaInbox(lsaPath);
    push("LSA inbox", "Total rows (aggregate)", { level: "ok", msg: `${lsa.total} leads in file (phones not written to this report)` });
    for (const [key, exp] of Object.entries(KPI_EXPECTED.lsaMonthly)) {
      const monthKey = key.replace("Partial", "").trim();
      const b = lsa.byMonth[monthKey];
      if (!b) {
        push("LSA inbox", `${monthKey} bucket`, { level: "warn", msg: "No rows parsed for this month in file" });
        continue;
      }
      const expLeads = exp.leads ?? exp.leadsPartial;
      const expCharged = exp.charged ?? exp.chargedPartial;
      push("LSA inbox", `${monthKey} lead count`, status(b.leads === expLeads, true,
        `File ${b.leads} vs PERFORMANCE-REVIEW ${expLeads}`));
      push("LSA inbox", `${monthKey} charged`, status(b.charged === expCharged, true,
        `File ${b.charged} vs PERFORMANCE-REVIEW ${expCharged}`));
    }
    push("KPI #01", "LSA channel (41 in UI)", {
      level: "warn",
      msg: `UI uses 41/mo — Jun file has ${lsa.byMonth["Jun 2026"]?.leads ?? "?"} total LSA rows. Lock definition (charged vs all phone) before wiring ★`
    });
  } else {
    push("LSA inbox", "Export file", { level: "gap", msg: "leads-inbox*.csv not in batch folder" });
  }

  const channelSum = KPI_EXPECTED.kpis.searchCallsChannel
    + KPI_EXPECTED.kpis.lsaInboxChannel
    + KPI_EXPECTED.kpis.hubspotFormsChannel;
  push("KPI #01", "Channel sum", status(channelSum === KPI_EXPECTED.kpis.totalLeads, true,
    `Search ${KPI_EXPECTED.kpis.searchCallsChannel} + LSA ${KPI_EXPECTED.kpis.lsaInboxChannel} + HubSpot ${KPI_EXPECTED.kpis.hubspotFormsChannel} = ${channelSum} vs total ${KPI_EXPECTED.kpis.totalLeads}`));
  push("KPI #01", "HubSpot slice", { level: "gap", msg: "29 forms — no HubSpot export on file to verify" });
  push("KPI #02", "New cases (9)", { level: "gap", msg: "Needs MyCase or HubSpot deals export — not in Ad Reports" });
  push("KPI #21", "Answer rate (69%)", { level: "gap", msg: "Needs HubSpot call logs / VoIP — not in Ad Reports" });
  push("KPI #22", "Speed to lead", { level: "gap", msg: "Needs HubSpot workflow timestamps" });
  push("KPI #28", "Avg case fee", { level: "gap", msg: "Needs MyCase billing export" });

  const levelIcon = { ok: "✅", warn: "⚠️", fail: "❌", gap: "⬜" };
  const safe = s => String(s).replace(/\|/g, " · ");
  const md = [
    "# Data validation (local aggregates only)",
    "",
    `**Generated:** ${new Date().toISOString().slice(0, 10)} · **Batch:** \`${batch}\`${prior ? ` · **Prior:** \`${prior}\`` : ""}`,
    `**Exports path:** \`Ad Reports/exports/\` (local — not deployed to GitHub Pages)`,
    "",
    "> No phone numbers, names, or emails in this file. Re-run: `npm run validate-data`",
    "",
    "| Area | Check | Status | Detail |",
    "|------|-------|--------|--------|",
    ...rows.map(r => `| ${safe(r.area)} | ${safe(r.check)} | ${levelIcon[r.level]} | ${safe(r.msg)} |`),
    "",
    "## Next exports",
    "",
    "See [DATA-EXPORT-CLICKPATHS.md](DATA-EXPORT-CLICKPATHS.md).",
    "",
    "## Client data policy",
    "",
    "- Raw CSV/PDF exports stay in `Ad Reports/exports/` on your Mac only.",
    "- `.gitignore` blocks CSV/XLSX/PDF from git push.",
    "- Gilbert Guide deploy ships `project-picker/` only — not `Ad Reports/`.",
    ""
  ].join("\n");

  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_MD);
  console.log(`Checks: ${rows.filter(r => r.level === "ok").length} ok · ${rows.filter(r => r.level === "warn").length} warn · ${rows.filter(r => r.level === "gap").length} gap · ${rows.filter(r => r.level === "fail").length} fail`);
}

run();
