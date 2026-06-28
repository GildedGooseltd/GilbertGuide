/**
 * Parse / serialize Picky Pavi project markdown (B2 template format).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const META_KEYS = {
  id: "id",
  priority: "priority",
  fee: "fee",
  timeline: "timeline",
  category: "category",
  "campaign type": "campaignType",
  status: "status",
  keywords: "keywords",
  parent: "parentId",
  enabler: "enabler",
  "monthly only": "monthlyOnly",
  "ongoing fee": "ongoingFee",
  "per campaign fee": "perCampaignFee",
  icon: "paviIcon"
};

const BRAND_FIXES = [
  [/\bhubspot\b/gi, "HubSpot"],
  [/\bvoip\b/gi, "VoIP"],
  [/\bgoogle ads\b/gi, "Google Ads"],
  [/\blsa\b/g, "LSA"],
  [/\bntguilt\b/gi, "NTGUILT"],
  [/\bpav\.law\b/gi, "pav.law"],
  [/\baba\b/g, "ABA"]
];

function applyProperCase(text) {
  if (!text) return text;
  let out = text;
  for (const [re, rep] of BRAND_FIXES) out = out.replace(re, rep);
  return out;
}

function parseMetaTable(text) {
  const meta = {};
  const rows = text.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|$/gm) || [];
  for (const row of rows) {
    const m = row.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    let val = m[2].trim();
    const field = META_KEYS[key];
    if (!field) continue;
    if (field === "priority") {
      if (val && val !== "—" && val !== "-" && val.toLowerCase() !== "blank")
        meta.priority = parseInt(val, 10);
    } else if (field === "fee" || field === "ongoingFee" || field === "perCampaignFee")
      meta[field] = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
    else if (field === "enabler" || field === "monthlyOnly")
      meta[field] = /^(yes|true|1)$/i.test(val);
    else if (field === "keywords")
      meta.keywords = val.split(/,\s*/).filter(Boolean);
    else if (field === "status")
      meta[field] = val.toLowerCase();
    else meta[field] = val;
  }
  return meta;
}

function parseListSection(body) {
  return body
    .split("\n")
    .map(l => l.replace(/^-\s+/, "").trim())
    .filter(l => l && !l.startsWith("|"));
}

function parseLearnings(body) {
  const links = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*—\s*(.+))?$/);
    if (m) links.push({ label: m[1], url: m[2], ...(m[3] ? { note: m[3] } : {}) });
  }
  return links;
}

function parseAccountSection(body) {
  const lines = body.split("\n").map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  const src = body.match(/^Source:\s*(.+)$/im);
  let label = body
    .replace(/^Source:\s*.+$/im, "")
    .replace(/<[^>]*>/g, "")
    .trim();
  if (!label && lines[0]) label = lines[0];
  return { label: label.replace(/\s+/g, " ").trim(), source: src ? src[1].trim() : "" };
}

function parseSections(text) {
  const parts = text.split(/^## /m).slice(1);
  const sections = {};
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const name = part.slice(0, nl).trim().toLowerCase();
    const body = part.slice(nl + 1).trim();
    sections[name] = body;
  }
  return sections;
}

export function parseProjectMarkdown(text, fallbackId) {
  const metaBlock = text.match(/\n---\n/s);
  const head = metaBlock ? text.slice(0, metaBlock.index) : text;
  const rest = metaBlock ? text.slice(metaBlock.index + 5) : "";

  const h1 = head.match(/^#\s+(.+)$/m);
  let titleFromH1 = "";
  if (h1) {
    const t = h1[1].trim();
    const dash = t.match(/^[A-Z0-9.]+\s*[—–-]\s*(.+)$/);
    titleFromH1 = dash ? dash[1].trim() : t;
  }

  const meta = parseMetaTable(head);
  if (!meta.id && fallbackId) meta.id = fallbackId.replace(/\.md$/, "");
  if (!meta.title && titleFromH1) meta.title = applyProperCase(titleFromH1);

  const sections = parseSections(rest);
  const project = { ...meta };

  if (sections.description) project.description = applyProperCase(sections.description.trim());

  const valueAdded = [];
  if (sections["value added"]) valueAdded.push(...parseListSection(sections["value added"]));
  if (sections["value bullets"]) valueAdded.push(...parseListSection(sections["value bullets"]));
  if (sections["value add"] && !sections["value added"] && !sections["value bullets"])
    valueAdded.push(sections["value add"].trim());
  project.valueAdded = valueAdded.filter(Boolean);

  if (sections["marketing education"]) {
    const body = sections["marketing education"].trim();
    const linkLines = parseLearnings(body);
    const prose = body
      .split("\n")
      .filter(l => !/^-\s+\[/.test(l.trim()))
      .join("\n")
      .trim();
    project.marketingEducation = applyProperCase(prose);
    if (linkLines.length) {
      project.learningsLinks = linkLines;
    }
  }

  if (sections.deliverables) project.deliverables = parseListSection(sections.deliverables);
  if (sections.completed || sections.done)
    project.completedItems = parseListSection(sections.completed || sections.done);
  if (sections.wip || sections["in progress"])
    project.inProgressItems = parseListSection(sections.wip || sections["in progress"]);

  if (sections.learnings) project.learningsLinks = parseLearnings(sections.learnings);
  if (sections.references) project.references = parseLearnings(sections.references);

  const accountKey =
    sections["account data & marketing principles applied"] ||
    sections["account data"];
  if (accountKey) {
    const bm = parseAccountSection(accountKey);
    if (bm?.label) project.backedMetric = bm;
  }

  return project;
}

function isRetainerPhase(p) {
  return (
    p.id === "RETAINER" ||
    p.monthlyOnly ||
    p.category === "Retainer" ||
    (p.campaignType && /maintenance retainer/i.test(p.campaignType))
  );
}

function padMetaRow(label, value) {
  const l = `**${label}**`;
  return `| ${l.padEnd(17)} | ${String(value).padEnd(58)} |`;
}

function metaTableRows(p) {
  const rows = [
    ["ID", p.id],
    ...(isRetainerPhase(p) || p.priority == null ? [] : [["Priority", p.priority]]),
    ["Fee", p.fee],
    ["Timeline", p.timeline],
    ["Category", p.category],
    ["Campaign type", p.campaignType],
    ["Status", p.status || "available"],
    ...(p.parentId ? [["Parent", p.parentId]] : []),
    ...(p.enabler ? [["Enabler", "yes"]] : []),
    ...(p.monthlyOnly ? [["Monthly only", "yes"]] : []),
    ...(p.ongoingFee ? [["Ongoing fee", p.ongoingFee]] : []),
    ...(p.perCampaignFee ? [["Per campaign fee", p.perCampaignFee]] : []),
    ["Keywords", (p.keywords || []).join(", ")]
  ];
  return rows.map(([l, v]) => padMetaRow(l, v));
}

function listSection(title, items) {
  const clean = (items || []).map(i => applyProperCase(i)).filter(Boolean);
  if (!clean.length) return "";
  return `## ${title}\n\n${clean.map(i => `- ${i}`).join("\n")}\n\n`;
}

function buildMarketingEducation(p) {
  let edu = p.marketingEducation || "";
  const links = [...(p.learningsLinks || []), ...(p.references || [])];
  if (links.length) {
    const linkBlock = links
      .map(l => `- [${l.label}](${l.url})${l.note ? ` — ${l.note}` : ""}`)
      .join("\n");
    edu = edu ? `${edu.trim()}\n\n${linkBlock}` : linkBlock;
  }
  return edu.trim();
}

function buildAccountSection(p) {
  if (!p.backedMetric?.label) return "";
  let body = applyProperCase(p.backedMetric.label);
  if (p.backedMetric.source)
    body += `\n\nSource: ${applyProperCase(p.backedMetric.source)}`;
  return body;
}

export function projectToMarkdown(p) {
  const id = p.id || "NEW";
  const title = applyProperCase(p.title || "Untitled Project");
  const valueItems = [...(p.valueAdded || [])];
  if (p.deliverables?.length) valueItems.push(...p.deliverables.map(d => `Deliverable: ${d}`));

  let md = `# ${id} — ${title}\n\n`;
  md += `|                   |                                                            |\n`;
  md += `| ----------------- | ---------------------------------------------------------- |\n`;
  md += metaTableRows(p).join("\n");
  md += `\n\n---\n\n`;

  if (p.description) md += `## Description\n\n${applyProperCase(p.description.trim())}\n\n`;
  md += listSection("Value Added", valueItems);
  const edu = buildMarketingEducation(p);
  if (edu) md += `## Marketing Education\n\n${edu}\n\n`;
  md += listSection("WIP", p.inProgressItems);
  md += listSection("Completed", p.completedItems);
  const account = buildAccountSection(p);
  if (account) md += `## Account Data & Marketing Principles Applied\n\n${account}\n\n`;

  return md.trim() + "\n";
}

export function parseSettingsMarkdown(text) {
  const meta = parseMetaTable(text);
  const sections = parseSections(text);
  const label = sections["default package label"]?.trim() || "Recommended package";
  const ids = parseListSection(sections["default package projects"] || "");
  const retainerLine = text.match(/Include retainer:\s*(yes|no)/i);
  return {
    paviIcon: meta.paviIcon || "assets/pavi-icon.png",
    recommendedPackage: {
      label,
      retainer: retainerLine ? /^yes/i.test(retainerLine[1]) : true,
      projectIds: ids.length ? ids : []
    }
  };
}

export function settingsToMarkdown(settings) {
  const pkg = settings.recommendedPackage || {};
  return `# Picker Settings

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| **Icon**          | ${settings.paviIcon || "assets/pavi-icon.png"}${" ".repeat(Math.max(0, 58 - (settings.paviIcon || "assets/pavi-icon.png").length))}|

---

## Default Package Label

${pkg.label || "Recommended package"}

## Default Package Projects

${(pkg.projectIds || []).map(id => `- ${id}`).join("\n")}

Include retainer: ${pkg.retainer !== false ? "yes" : "no"}
`;
}

export function buildIndex(projects, retainer) {
  const all = [{ ...retainer, id: retainer.id || "RETAINER" }, ...projects];
  all.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  let md = `# Project Index

Open a file below to edit. Sorted by priority (P). Template: [\`_TEMPLATE.md\`](_TEMPLATE.md) (matches \`B2.md\`).

| P | ID | Project | File |
|---|-----|---------|------|
`;

  for (const p of all) {
    const file = p.id === "RETAINER" ? "retainer.md" : `projects/${p.id}.md`;
    const pri = p.priority != null ? `P${p.priority}` : "—";
    md += `| ${pri} | ${p.id} | ${p.title} | [${file}](${file}) |\n`;
  }

  md += `\n**Retainer / monthly-only:** omit **Priority** row (shows as —).\n`;
  return md;
}

/** Migrate all project markdown to B2 format in place. */
export function migrateAllToB2Format(root) {
  const content = path.join(root, "content");
  const projectsDir = path.join(content, "projects");
  for (const file of ["retainer.md"]) {
    const fp = path.join(content, file);
    if (!fs.existsSync(fp)) continue;
    const p = parseProjectMarkdown(fs.readFileSync(fp, "utf8"), file);
    fs.writeFileSync(fp, projectToMarkdown(p));
  }
  for (const f of fs.readdirSync(projectsDir).filter(x => x.endsWith(".md") && !x.startsWith("_"))) {
    const fp = path.join(projectsDir, f);
    const p = parseProjectMarkdown(fs.readFileSync(fp, "utf8"), f);
    fs.writeFileSync(fp, projectToMarkdown(p));
  }
}

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
if (process.argv[1]?.includes("migrate-to-b2-format")) {
  migrateAllToB2Format(ROOT);
  console.log("Migrated all projects to B2 markdown format");
}
