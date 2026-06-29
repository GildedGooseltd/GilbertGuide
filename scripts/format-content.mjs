#!/usr/bin/env node
/** Re-format all content markdown from parsed data (fixes spacing). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseProjectMarkdown, projectToMarkdown } from "./markdown-project.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

for (const file of ["retainer.md"]) {
  const p = path.join(CONTENT, file);
  fs.writeFileSync(p, projectToMarkdown(parseProjectMarkdown(fs.readFileSync(p, "utf8"), file)));
}

const dir = path.join(CONTENT, "projects");
for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".md") && !x.startsWith("_"))) {
  const p = path.join(dir, f);
  fs.writeFileSync(p, projectToMarkdown(parseProjectMarkdown(fs.readFileSync(p, "utf8"), f)));
}

console.log("Reformatted content markdown");
