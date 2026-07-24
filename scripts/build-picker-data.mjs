#!/usr/bin/env node
/**
 * Compile content/*.md → projects-data.js for GitHub Pages.
 * INDEX.md is read-only here — never written by this script.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  parseProjectMarkdown,
  parseSettingsMarkdown,
  applyIndexOverrides
} from "./markdown-project.mjs";
import { parseRecommendationsMarkdown } from "./parse-recommendations.mjs";
import { applyFeeEstimate } from "./estimate-project-fee.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "projects-data.js");
const REC_OUT = path.join(ROOT, "recommendations-data.js");

function loadProjects() {
  const dir = path.join(CONTENT, "projects");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md") && !f.startsWith("_"));
  const projects = files.map(f => {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    return parseProjectMarkdown(text, f);
  });
  projects.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  return projects;
}

function loadSettings() {
  const md = path.join(CONTENT, "settings.md");
  if (!fs.existsSync(md)) throw new Error("Missing content/settings.md");
  return parseSettingsMarkdown(fs.readFileSync(md, "utf8"));
}

function loadRetainer() {
  const md = path.join(CONTENT, "retainer.md");
  if (!fs.existsSync(md)) throw new Error("Missing content/retainer.md");
  return parseProjectMarkdown(fs.readFileSync(md, "utf8"), "retainer");
}

function build() {
  const settings = loadSettings();
  let retainer = loadRetainer();
  let projects = loadProjects();

  const indexPath = path.join(CONTENT, "INDEX.md");
  if (fs.existsSync(indexPath)) {
    const existingIndex = fs.readFileSync(indexPath, "utf8");
    ({ retainer, projects } = applyIndexOverrides(projects, retainer, existingIndex));
  }

  /* Market estimates from local + national bands × project scope (tasks / value / info). Does not change Fee. */
  applyFeeEstimate(retainer);
  projects.forEach(applyFeeEstimate);

  /* Project plan / unpublishedMarkdown stays in .md only — never ship to Guide JSON. */
  const stripUnpublished = p => {
    if (!p) return p;
    const { unpublishedMarkdown: _drop, ...rest } = p;
    return rest;
  };

  const data = {
    guideName: settings.guideName,
    guideShortName: settings.guideShortName,
    guideIcon: settings.guideIcon,
    guideHero: settings.guideHero,
    guideSeal: settings.guideSeal,
    guideLogo: settings.guideLogo,
    paviIcon: settings.guideIcon,
    recommendedPackage: settings.recommendedPackage,
    retainer: stripUnpublished(retainer),
    projects: projects.map(stripUnpublished)
  };

  const header = `/**
 * AUTO-GENERATED — do not edit. Source: content/*.md (titles/priority from INDEX.md when present)
 * Rebuild: npm run build
 */
window.PROJECT_DATA = `;

  fs.writeFileSync(OUT, header + JSON.stringify(data, null, 2) + ";\n", "utf8");
  console.log(`Built ${OUT} (${projects.length} projects)`);

  const recPath = path.join(CONTENT, "recommendations.md");
  if (fs.existsSync(recPath)) {
    const recommendations = parseRecommendationsMarkdown(fs.readFileSync(recPath, "utf8"));
    const recHeader = `/**
 * AUTO-GENERATED — do not edit. Source: content/recommendations.md
 * Rebuild: npm run build
 */
window.RECOMMENDATIONS_CONTENT = `;
    fs.writeFileSync(REC_OUT, recHeader + JSON.stringify(recommendations, null, 2) + ";\n", "utf8");
    console.log(`Built ${REC_OUT} (${recommendations.recs.length} recommendations)`);
  }
}

function contentMarkdownPaths() {
  const paths = [
    path.join(CONTENT, "INDEX.md"),
    path.join(CONTENT, "settings.md"),
    path.join(CONTENT, "retainer.md"),
    path.join(CONTENT, "recommendations.md")
  ];
  const projectsDir = path.join(CONTENT, "projects");
  if (fs.existsSync(projectsDir)) {
    for (const f of fs.readdirSync(projectsDir)) {
      if (f.endsWith(".md") && !f.startsWith("_")) paths.push(path.join(projectsDir, f));
    }
  }
  return paths;
}

function contentSnapshot() {
  const snap = new Map();
  for (const fp of contentMarkdownPaths()) {
    try {
      snap.set(fp, fs.statSync(fp).mtimeMs);
    } catch {
      /* file removed mid-watch */
    }
  }
  return snap;
}

function watch() {
  build();
  let prev = contentSnapshot();
  setInterval(() => {
    const next = contentSnapshot();
    const changed = next.size !== prev.size || [...next].some(([fp, mtime]) => prev.get(fp) !== mtime);
    if (!changed) return;
    prev = next;
    try {
      build();
    } catch (e) {
      console.error(e.message);
    }
  }, 1000);
  console.log("Watching content/ (poll) … INDEX.md is never modified by build");
}

if (process.argv.includes("--watch")) watch();
else build();
