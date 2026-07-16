#!/usr/bin/env node
/**
 * Merge CAMPAIGN_METRICS into content project markdown (Goal, Results, Recommended metrics, Blockers, Insights).
 * Run: node scripts/apply-campaign-metrics.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CAMPAIGN_METRICS } from "./campaign-metrics-data.mjs";
import { parseProjectMarkdown, projectToMarkdown } from "./markdown-project.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

function listProjectFiles() {
  const files = [path.join(CONTENT, "retainer.md")];
  const dir = path.join(CONTENT, "projects");
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".md") && !x.startsWith("_"))) {
    files.push(path.join(dir, f));
  }
  return files;
}

function mergeMetrics(project) {
  const data = CAMPAIGN_METRICS[project.id];
  if (!data) return project;
  const next = { ...project };
  if (data.goal) next.goal = data.goal;
  if (data.results?.length) next.resultsItems = data.results;
  if (data.recommendedMetrics?.length) next.recommendedMetrics = data.recommendedMetrics;
  if (data.blockers?.length) next.blockers = data.blockers;
  if (data.insights?.length) next.insightsImprovements = data.insights;
  return next;
}

function run() {
  let count = 0;
  for (const fp of listProjectFiles()) {
    const text = fs.readFileSync(fp, "utf8");
    const base = path.basename(fp, ".md");
    const project = mergeMetrics(parseProjectMarkdown(text, base));
    if (!CAMPAIGN_METRICS[project.id]) continue;
    fs.writeFileSync(fp, projectToMarkdown(project));
    count++;
    console.log("Updated", project.id);
  }
  console.log(`Applied campaign metrics to ${count} files`);
}

run();
