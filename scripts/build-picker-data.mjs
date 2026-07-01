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

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "projects-data.js");

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

  const data = {
    guideName: settings.guideName,
    guideShortName: settings.guideShortName,
    guideIcon: settings.guideIcon,
    guideHero: settings.guideHero,
    guideSeal: settings.guideSeal,
    guideLogo: settings.guideLogo,
    paviIcon: settings.guideIcon,
    recommendedPackage: settings.recommendedPackage,
    retainer,
    projects
  };

  const header = `/**
 * AUTO-GENERATED — do not edit. Source: content/*.md (titles/priority from INDEX.md when present)
 * Rebuild: npm run build
 */
window.PROJECT_DATA = `;

  fs.writeFileSync(OUT, header + JSON.stringify(data, null, 2) + ";\n", "utf8");
  console.log(`Built ${OUT} (${projects.length} projects)`);
}

function watch() {
  build();
  fs.watch(CONTENT, { recursive: true }, () => {
    try {
      build();
    } catch (e) {
      console.error(e.message);
    }
  });
  console.log("Watching content/ … (INDEX.md is never modified by build)");
}

if (process.argv.includes("--watch")) watch();
else build();
