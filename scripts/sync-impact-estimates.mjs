#!/usr/bin/env node
/**
 * Sync impact estimates into project markdown; append Gilbert notes when numbers change.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  IMPACT_ESTIMATES,
  DATA_PULL,
  FIELD_LABELS,
  formatImpactLabel
} from "./impact-estimates-data.mjs";
import { parseProjectMarkdown, projectToMarkdown } from "./markdown-project.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const HISTORY_PATH = path.join(CONTENT, "impact-history.json");

const FIELD_MEANING = {
  leadsImpacted:
    "Everyone this campaign reached — calls, clicks, opens, mail, or profile views.",
  leadsConnected:
    "Prospects who actually connected with intake (answered, booked, or submitted).",
  clientsRetained:
    "Signed matters at historical lead→case rate (7.3% · Jun 2026) unless noted otherwise."
};

function listProjectFiles() {
  const files = [path.join(CONTENT, "retainer.md")];
  const dir = path.join(CONTENT, "projects");
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".md") && !x.startsWith("_"))) {
    files.push(path.join(dir, f));
  }
  return files;
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_PATH)) {
    return { lastPull: null, source: null, projects: {} };
  }
  return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n", "utf8");
}

function metricSnapshot(est) {
  return {
    leadsImpacted: est.leadsImpacted,
    leadsConnected: est.leadsConnected,
    clientsRetained: est.clientsRetained,
    period: est.period
  };
}

function gilbertChangeNote(field, prev, next, est, projectId) {
  const period = est.period === "wave" ? "per wave" : "per month";
  const src = DATA_PULL.source;
  const asOf = DATA_PULL.asOf;
  let why = "";
  if (prev == null || prev === undefined) {
    why = `Baseline set at ${next} ${period} from ${src}.`;
  } else if (next > prev) {
    const pct = prev > 0 ? Math.round(((next - prev) / prev) * 100) : 100;
    why = `Up from ${prev} to ${next} (+${pct}%) after ${asOf} data pull.`;
    if (est.note) why += ` ${est.note}`;
  } else if (next < prev) {
    why = `Down from ${prev} to ${next} after ${asOf} data pull — check export column gaps or seasonality.`;
    if (est.note) why += ` ${est.note}`;
  } else {
    return null;
  }
  if (field === "leadsConnected" && projectId === "B2") {
    why += " B2 go-live should push connected toward ~32/mo at 90% answer (#21).";
  }
  return why.trim();
}

function buildGilbertNotes(id, est, prevSnap, existingNotes) {
  const notes = [...(existingNotes || [])];
  const seen = new Set(notes.map(n => `${n.date}|${n.field}|${n.text}`));
  for (const field of ["leadsImpacted", "leadsConnected", "clientsRetained"]) {
    const prev = prevSnap?.[field];
    const next = est[field];
    if (prev === next && prevSnap?.period === est.period) continue;
    const text = gilbertChangeNote(field, prev, next, est, id);
    if (!text) continue;
    const entry = { date: DATA_PULL.asOf, field: FIELD_LABELS[field], text };
    const key = `${entry.date}|${entry.field}|${entry.text}`;
    if (!seen.has(key)) {
      notes.unshift(entry);
      seen.add(key);
    }
  }
  return notes.slice(0, 8);
}

function impactEstimatesToMarkdown(est) {
  if (!est) return { impactEstimates: null, impactLines: [] };
  const lines = [
    `- Leads impacted: ${formatImpactLabel("leadsImpacted", est)} (as of ${est.asOf})`,
    `- Leads connected: ${formatImpactLabel("leadsConnected", est)}`,
    `- Clients retained: ${formatImpactLabel("clientsRetained", est)}`
  ];
  if (est.source) lines.push(`- Source: ${est.source}`);
  if (est.note) lines.push(`- Note: ${est.note}`);
  return {
    impactEstimates: {
      leadsImpacted: est.leadsImpacted,
      leadsConnected: est.leadsConnected,
      clientsRetained: est.clientsRetained,
      period: est.period,
      asOf: est.asOf,
      source: est.source,
      note: est.note || ""
    },
    impactLines: lines
  };
}

function run() {
  const history = loadHistory();
  let updated = 0;
  for (const fp of listProjectFiles()) {
    const text = fs.readFileSync(fp, "utf8");
    const base = path.basename(fp, ".md");
    const project = parseProjectMarkdown(text, base);
    const est = IMPACT_ESTIMATES[project.id];
    if (!est) continue;

    const { impactEstimates } = impactEstimatesToMarkdown(est);
    project.impactEstimates = impactEstimates;
    delete project.gilbertMetricNotes;

    fs.writeFileSync(fp, projectToMarkdown(project));
    history.projects[project.id] = metricSnapshot(est);
    updated++;
    console.log("Impact sync:", project.id);
  }
  history.lastPull = DATA_PULL.asOf;
  history.source = DATA_PULL.source;
  saveHistory(history);
  console.log(`Synced impact estimates for ${updated} projects · history → ${HISTORY_PATH}`);
}

run();
