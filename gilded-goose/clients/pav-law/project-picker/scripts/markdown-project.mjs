/**
 * Parse / serialize Gilbert project picker markdown (B2 template format).
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
  "payment type": "paymentType",
  "monthly only": "monthlyOnly",
  "ongoing fee": "ongoingFee",
  "per campaign fee": "perCampaignFee",
  icon: "guideIcon",
  "guide hero": "guideHero",
  seal: "guideSeal",
  logo: "guideLogo",
  "guide name": "guideName",
  "guide short name": "guideShortName"
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
  const preserved = [];
  let safe = text.replace(/(\[[^\]]*\]\([^)]+\)|https?:\/\/[^\s)'"]+|<a [^>]*>[\s\S]*?<\/a>)/gi, m => {
    preserved.push(m);
    return `\x00${preserved.length - 1}\x00`;
  });
  for (const [re, rep] of BRAND_FIXES) safe = safe.replace(re, rep);
  return safe.replace(/\x00(\d+)\x00/g, (_, i) => preserved[Number(i)]);
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
    else if (field === "paymentType") {
      const v = val.toLowerCase();
      if (/perf/.test(v)) meta.paymentType = "performance";
      else if (/flat|fixed/.test(v)) meta.paymentType = "flat";
    }
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

  const deliverables = [...(project.deliverables || [])];
  const cleanValue = [];
  for (const item of project.valueAdded) {
    const text = String(item).trim();
    if (/^Deliverable:\s*/i.test(text)) {
      deliverables.push(text.replace(/^Deliverable:\s*/i, "").trim());
    } else {
      cleanValue.push(text);
    }
  }
  project.valueAdded = cleanValue;
  if (deliverables.length) project.deliverables = deliverables;

  if (sections["marketing education"]) {
    const body = sections["marketing education"].trim();
    const linkLines = dedupeLinks([
      ...parseLearnings(body),
      ...parseInlineMarkdownLinks(body)
    ]);
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

  if (sections.deliverables) {
    project.deliverables = [
      ...(project.deliverables || []),
      ...parseListSection(sections.deliverables)
    ];
  }
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
    ...(p.paymentType ? [["Payment type", p.paymentType === "performance" ? "performance" : "flat"]] : []),
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

function dedupeLinks(links) {
  const seen = new Set();
  return (links || []).filter(l => {
    const key = (l.url || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseInlineMarkdownLinks(text) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text || "")) !== null) {
    links.push({ label: m[1].trim(), url: m[2].trim() });
  }
  return links;
}

function buildMarketingEducationB2(p) {
  let edu = (p.marketingEducation || "").trim();
  const links = dedupeLinks([...(p.learningsLinks || []), ...(p.references || [])]);
  if (!links.length) return edu;

  const phrases = links.map(l => `[${l.label}](${l.url})`);
  const alreadyInline = phrases.every(ph => edu.includes(ph));
  if (alreadyInline) return edu;

  if (!edu) {
    if (phrases.length === 1) return phrases[0] + ".";
    if (phrases.length === 2) return `See ${phrases[0]} and ${phrases[1]}.`;
    const last = phrases[phrases.length - 1];
    return `See ${phrases.slice(0, -1).join(", ")}, and ${last}.`;
  }

  if (phrases.length === 1) return `${edu.replace(/\s+$/, "")} See ${phrases[0]}.`;
  if (phrases.length === 2) return `${edu.replace(/\s+$/, "")} See ${phrases[0]} and ${phrases[1]}.`;
  const last = phrases[phrases.length - 1];
  return `${edu.replace(/\s+$/, "")} See ${phrases.slice(0, -1).join(", ")}, and ${last}.`;
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

  let md = `# ${id} — ${title}\n\n`;
  md += `|                   |                                                            |\n`;
  md += `| ----------------- | ---------------------------------------------------------- |\n`;
  md += metaTableRows(p).join("\n");
  md += `\n\n---\n\n`;

  if (p.description) md += `## Description\n\n${applyProperCase(p.description.trim())}\n\n`;
  md += listSection("Value Added", p.valueAdded || []);
  const edu = buildMarketingEducationB2(p);
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
    guideName: meta.guideName || "Lord Gilbert Granville",
    guideShortName: meta.guideShortName || "Gilbert",
    guideIcon: meta.guideIcon || meta.paviIcon || "assets/gigi-goose-guide.svg",
    guideHero: meta.guideHero || "assets/gigi-goose-walk.png",
    guideSeal: meta.guideSeal || "assets/gigi-logo-frame.png",
    guideLogo: meta.guideLogo || "assets/gigi-logo-frame.png",
    paviIcon: meta.guideIcon || meta.paviIcon || "assets/gigi-goose-guide.svg",
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

/** Valid picker project IDs — rejects scratch rows like "WIP Live" in the ID column. */
export function isValidProjectId(id) {
  return /^(RETAINER|[AB]\d+M?)$/i.test(String(id || "").trim());
}

export function parseIndexMarkdown(text) {
  const result = {
    intro: "",
    rowsById: {},
    footer: "",
    notes: ""
  };
  if (!text) return result;

  const notesMatch = text.match(/\n## Notes[^\n]*\n([\s\S]*)$/i);
  if (notesMatch) {
    result.notes = notesMatch[0].trim();
    text = text.slice(0, notesMatch.index);
  }

  const lines = text.split("\n");
  const tableLines = lines.filter(l => /^\|/.test(l) && !/^\|[\s\-:|]+\|$/.test(l.replace(/\s/g, "")));
  for (const line of tableLines) {
    const cells = line.split("|").map(c => c.trim()).filter(Boolean);
    if (cells.length < 4 || cells[0] === "P") continue;
    const id = cells[1];
    if (!id || id === "ID" || !isValidProjectId(id)) continue;
    if (result.rowsById[id]) continue;
    result.rowsById[id] = {
      p: cells[0],
      title: cells[2],
      file: cells[3]
    };
  }

  const introEnd = text.indexOf("| P |");
  if (introEnd > 0) result.intro = text.slice(0, introEnd).trim();

  const footerStart = text.indexOf("**Retainer");
  if (footerStart > 0) result.footer = text.slice(footerStart).trim();

  return result;
}

/** INDEX table titles + P column → picker data (INDEX wins over project .md H1). */
export function applyIndexOverrides(projects, retainer, existingText) {
  const { rowsById } = parseIndexMarkdown(existingText || "");
  const applyTo = item => {
    const o = rowsById[item.id];
    if (!o) return item;
    const next = { ...item };
    if (o.title) next.title = o.title;
    const pm = String(o.p || "").match(/^P?(\d+)$/i);
    if (pm) next.priority = parseInt(pm[1], 10);
    return next;
  };
  const merged = projects.map(applyTo);
  merged.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  return { retainer: applyTo(retainer), projects: merged };
}

export function buildIndex(projects, retainer, existingText) {
  const overrides = parseIndexMarkdown(existingText || "");
  const all = [{ ...retainer, id: retainer.id || "RETAINER" }, ...projects];
  all.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  let md = overrides.intro || `# Project Index

Open a file below to edit. Sorted by priority (P). Template: [\`_TEMPLATE.md\`](_TEMPLATE.md) (matches \`B2.md\`).

Edit **Project** titles and add **## Notes** at the bottom — build keeps your changes and adds new projects.`;

  md += `\n\n| P | ID | Project | File |\n|---|-----|---------|------|\n`;

  const seen = new Set();
  for (const p of all) {
    const id = p.id;
    seen.add(id);
    const file = id === "RETAINER" ? "retainer.md" : `projects/${id}.md`;
    const fileCell = `[${file}](${file})`;
    const o = overrides.rowsById[id];
    const pri = o?.p ?? (p.priority != null ? `P${p.priority}` : "—");
    const title = o?.title || p.title;
    md += `| ${pri} | ${id} | ${title} | ${fileCell} |\n`;
  }

  for (const [id, o] of Object.entries(overrides.rowsById)) {
    if (seen.has(id) || !isValidProjectId(id)) continue;
    md += `| ${o.p} | ${id} | ${o.title} | ${o.file} |\n`;
  }

  md += `\n${overrides.footer || "**Retainer / monthly-only:** omit **Priority** row (shows as —)."}\n`;

  if (overrides.notes) {
    md += `\n${overrides.notes}\n`;
  } else {
    md += `\n## Notes\n\n<!-- Your notes for agents — preserved on every build -->\n\n`;
  }

  return md.trim() + "\n";
}

/** Migrate all project markdown to B2 format in place. Preserves wording; normalizes layout. */
export function migrateAllToB2Format(root) {
  const content = path.join(root, "content");
  const projectsDir = path.join(content, "projects");
  const indexPath = path.join(content, "INDEX.md");
  const indexTitles = fs.existsSync(indexPath)
    ? parseIndexMarkdown(fs.readFileSync(indexPath, "utf8")).rowsById
    : {};

  function normalizeOne(fp, fallbackId) {
    const p = parseProjectMarkdown(fs.readFileSync(fp, "utf8"), fallbackId);
    const row = indexTitles[p.id];
    if (row?.title) p.title = row.title;
    if (row?.p) {
      const pm = String(row.p).match(/^P(\d+)$/i);
      if (pm) p.priority = parseInt(pm[1], 10);
    }
    if (p.learningsLinks) p.learningsLinks = dedupeLinks(p.learningsLinks);
    if (p.references) p.references = dedupeLinks(p.references);
    fs.writeFileSync(fp, projectToMarkdown(p));
    return p.id;
  }

  const ids = [];
  for (const file of ["retainer.md"]) {
    const fp = path.join(content, file);
    if (!fs.existsSync(fp)) continue;
    ids.push(normalizeOne(fp, file));
  }
  for (const f of fs.readdirSync(projectsDir).filter(x => x.endsWith(".md") && !x.startsWith("_"))) {
    ids.push(normalizeOne(path.join(projectsDir, f), f));
  }
  return ids;
}

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
if (process.argv[1]?.includes("migrate-to-b2-format")) {
  migrateAllToB2Format(ROOT);
  console.log("Migrated all projects to B2 markdown format");
}
