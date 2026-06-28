#!/usr/bin/env node
/** Migrate content/*.json → *.md (one-time or re-run safe) */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  projectToMarkdown,
  settingsToMarkdown
} from "./markdown-project.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const PROJECTS = path.join(CONTENT, "projects");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const settingsPath = path.join(CONTENT, "settings.json");
if (fs.existsSync(settingsPath)) {
  fs.writeFileSync(path.join(CONTENT, "settings.md"), settingsToMarkdown(readJson(settingsPath)));
  fs.unlinkSync(settingsPath);
}

const retainerPath = path.join(CONTENT, "retainer.json");
if (fs.existsSync(retainerPath)) {
  fs.writeFileSync(path.join(CONTENT, "retainer.md"), projectToMarkdown(readJson(retainerPath)));
  fs.unlinkSync(retainerPath);
}

if (fs.existsSync(PROJECTS)) {
  for (const f of fs.readdirSync(PROJECTS).filter(x => x.endsWith(".json"))) {
    const data = readJson(path.join(PROJECTS, f));
    fs.writeFileSync(path.join(PROJECTS, f.replace(/\.json$/, ".md")), projectToMarkdown(data));
    fs.unlinkSync(path.join(PROJECTS, f));
  }
}

console.log("Converted JSON → Markdown in content/");
