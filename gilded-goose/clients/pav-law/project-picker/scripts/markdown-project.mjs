/**
 * Parse / serialize Gilbert project picker markdown (HsVoip template format).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const META_KEYS = {
  id: "id",
  priority: "priority",
  fee: "fee",
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
  "deposit pct": "depositPct",
  "deposit amount": "depositAmount",
  icon: "guideIcon",
  "guide hero": "guideHero",
  seal: "guideSeal",
  logo: "guideLogo",
  "guide name": "guideName",
  "guide short name": "guideShortName",
  "featured image": "featuredImage",
  "reference link": "referenceLink",
  "estimated leads": "estimatedLeads",
  "estimated leads gained": "estimatedLeads",
  "publish status": "publishStatus",
  "start date": "startDate",
  "campaign start": "startDate",
  "projected start": "startDate",
  "season start": "startDate"
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

function parseReferenceLinkValue(val) {
  if (!val || val === "—" || val === "-") return null;
  const md = val.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (md) return { label: md[1].trim(), url: md[2].trim() };
  if (/^https?:\/\//i.test(val.trim())) return { label: "Project reference", url: val.trim() };
  return null;
}

function formatReferenceLinkValue(link) {
  if (!link?.url) return "";
  const label = (link.label || "Project reference").trim();
  return `[${label}](${link.url})`;
}

function normalizePublishStatus(raw) {
  const s = String(raw || "published").toLowerCase().trim();
  if (
    s === "unpublished" ||
    s === "unpublish" ||
    s === "hidden" ||
    s === "gray" ||
    s === "grey" ||
    s === "planning" ||
    s === "plan" ||
    s === "draft" ||
    s === "outline"
  ) {
    return "unpublished";
  }
  return "published";
}

function parseMetaTable(text) {
  const meta = {};
  const rows = text.match(/^\|\s*(?:\*\*)?(.+?)(?:\*\*)?\s*\|\s*(.+?)\s*\|$/gm) || [];
  for (const row of rows) {
    const m = row.match(/^\|\s*(?:\*\*)?(.+?)(?:\*\*)?\s*\|\s*(.+?)\s*\|$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase().replace(/\*\*/g, "");
    let val = m[2].trim();
    if (/^-{3,}$/.test(key) || key === "field" || key === "value") continue;
    const field = META_KEYS[key];
    if (!field) continue;
    if (field === "priority") {
      if (val && val !== "—" && val !== "-" && val.toLowerCase() !== "blank")
        meta.priority = parseInt(val, 10);
    } else if (field === "fee" || field === "ongoingFee" || field === "perCampaignFee" || field === "depositAmount")
      meta[field] = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
    else if (field === "depositPct") {
      const n = parseFloat(val.replace(/[^0-9.]/g, ""));
      if (Number.isFinite(n)) meta.depositPct = n > 1 ? n / 100 : n;
    }
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
    else if (field === "publishStatus")
      meta.publishStatus = normalizePublishStatus(val);
    else if (field === "referenceLink")
      meta.referenceLink = parseReferenceLinkValue(val);
    else if (field === "featuredImage")
      meta.featuredImage = val && val !== "—" && val !== "-" ? val.trim() : "";
    else meta[field] = val;
  }
  return meta;
}

const VALID_VALUE_ICON_IDS = new Set([
  "foundation", "retainer", "leads", "crm", "hubspot", "seo", "referrals",
  "efficiency", "finance", "intake", "creative", "general"
]);

/** Full icon catalog for Show tables (id → display name). */
export const VALUE_ICON_CATALOG = [
  { id: "foundation", name: "Foundation" },
  { id: "retainer", name: "Retainer" },
  { id: "leads", name: "Leads" },
  { id: "crm", name: "CRM" },
  { id: "hubspot", name: "HubSpot" },
  { id: "seo", name: "SEO" },
  { id: "referrals", name: "Referrals" },
  { id: "efficiency", name: "Analytics" },
  { id: "finance", name: "Finance" },
  { id: "intake", name: "Intake" },
  { id: "creative", name: "Creative" }
];

/** Full KPI catalog for Show tables (id without # → name). */
export const KPI_CATALOG = [
  { id: "01", name: "Total leads" },
  { id: "02", name: "New cases" },
  { id: "05", name: "Key Channel Activity" },
  { id: "06", name: "Pipeline / CRM completeness" },
  { id: "07", name: "Spend Waste" },
  { id: "08", name: "Campaign cost efficiency" },
  { id: "09", name: "Intake conversion" },
  { id: "10", name: "Lead channel mix" },
  { id: "11", name: "Organic / local search presence" },
  { id: "12", name: "Avg. Cost per Call" },
  { id: "14", name: "Creative / channel response" },
  { id: "15", name: "Cost per lead" },
  { id: "16", name: "Reviews by channel" },
  { id: "17", name: "Referral Network" },
  { id: "18", name: "Website / SEO contribution" },
  { id: "19", name: "Missed Opportunity" },
  { id: "20", name: "CRM follow-up discipline" },
  { id: "21", name: "Answered Calls" },
  { id: "22", name: "Speed to lead" },
  { id: "23", name: "Intake coverage / after-hours" },
  { id: "27", name: "Ops backlog / open tasks" },
  { id: "28", name: "Avg case fee" }
];

function normalizeValueIconId(raw) {
  return String(raw || "").trim().toLowerCase().replace(/\s+/g, "-");
}

function parseListSection(body) {
  return body
    .split("\n")
    .map(l => l.replace(/^-\s+/, "").trim())
    .filter(l => l && l !== "-" && !l.startsWith("|"));
}

function splitMarkdownTableCells(line) {
  const t = String(line || "").trim();
  if (!t.startsWith("|")) return null;
  return t
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(c => c.trim());
}

function isMarkdownTableSeparator(cells) {
  return cells && cells.length && cells.every(c => /^:?-{3,}:?$/.test(c.replace(/\s/g, "")));
}

/** True / false / null (unknown — treat as shown for legacy rows without Show). */
function parseShowCell(raw) {
  const s = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\*\*/g, "");
  if (!s || s === "—" || s === "-") return null;
  if (/\[\s*x\s*\]|\[\s*✓\s*\]|✅|☑|^yes$|^true$|^1$|^x$|^on$|^show$/.test(s)) return true;
  if (/^\[\s*\]$|☐|⬜|^no$|^false$|^0$|^off$|^hide$/.test(s)) return false;
  if (/^\[\s*\]/.test(s) && !/x/.test(s)) return false;
  return null;
}

/**
 * Parse a Show | Id | Name markdown table.
 * Returns selected ids (only Show = [x]). Legacy bullet lists → all ids.
 */
function parseShowIdTable(body, { normalizeId, validIds }) {
  const lines = String(body || "").split("\n");
  const tableRows = [];
  let header = null;
  for (const line of lines) {
    const cells = splitMarkdownTableCells(line);
    if (!cells) continue;
    if (isMarkdownTableSeparator(cells)) continue;
    if (!header) {
      header = cells.map(c => c.toLowerCase().replace(/\*\*/g, "").trim());
      continue;
    }
    tableRows.push(cells);
  }

  if (header && tableRows.length) {
    const showIdx = header.findIndex(h => /^(show|visible|on|v)$/.test(h));
    const idIdx = header.findIndex(h =>
      /^(icon|id|kpi|code|ref|key)$/.test(h) || h === "#"
    );
    const selected = [];
    for (const cells of tableRows) {
      const idRaw =
        (idIdx >= 0 ? cells[idIdx] : null) ||
        cells[showIdx >= 0 ? 1 : 0] ||
        "";
      const id = normalizeId(idRaw);
      if (!id) continue;
      if (validIds && !validIds.has(id)) continue;
      const shown = showIdx >= 0 ? parseShowCell(cells[showIdx]) : true;
      if (shown === false) continue;
      selected.push(id);
    }
    return [...new Set(selected)];
  }

  /* Legacy bullets */
  return parseListSection(body)
    .map(normalizeId)
    .filter(id => id && (!validIds || validIds.has(id)));
}

export function formatValueIconsShowTable(selectedIds) {
  const selected = new Set((selectedIds || []).map(normalizeValueIconId));
  const rows = VALUE_ICON_CATALOG.map(
    ({ id, name }) =>
      `| ${selected.has(id) ? "[x]" : "[ ]"} | ${name} |`
  );
  return `## Value icons\n\n| Show | Name |\n| ---- | ---- |\n${rows.join("\n")}\n\n`;
}

export function formatKpiLinksShowTable(selectedRefs) {
  const selected = new Set(
    (selectedRefs || []).map(r => {
      const n = String(r).replace(/\D/g, "");
      return n.length >= 2 ? n.slice(-2) : "";
    }).filter(Boolean)
  );
  const rows = KPI_CATALOG.map(
    ({ id, name }) =>
      `| ${selected.has(id) ? "[x]" : "[ ]"} | ${name} |`
  );
  return `## KPI links\n\n| Show | Name |\n| ---- | ---- |\n${rows.join("\n")}\n\n`;
}

function parseKpiLinksSection(body) {
  const byId = new Map(KPI_CATALOG.map(k => [k.id, k]));
  const byName = new Map(
    KPI_CATALOG.map(k => [k.name.toLowerCase().replace(/\s+/g, " ").trim(), k.id])
  );
  const lines = String(body || "").split("\n");
  let header = null;
  const selected = [];

  for (const line of lines) {
    const cells = splitMarkdownTableCells(line);
    if (!cells) {
      /* Legacy bullets: 21 / #21 / Answered Calls */
      const t = line.replace(/^-\s+/, "").trim();
      if (!t || t.startsWith("|")) continue;
      const n = t.replace(/\D/g, "");
      if (n.length >= 2 && byId.has(n.slice(-2))) {
        selected.push(n.slice(-2));
        continue;
      }
      const nameKey = t.toLowerCase().replace(/\s+/g, " ").trim();
      if (byName.has(nameKey)) selected.push(byName.get(nameKey));
      continue;
    }
    if (isMarkdownTableSeparator(cells)) continue;
    if (!header) {
      header = cells.map(c => c.toLowerCase().replace(/\*\*/g, "").trim());
      continue;
    }
    const showIdx = header.findIndex(h => /^(show|visible|on|v)$/.test(h));
    const idIdx = header.findIndex(h => /^(kpi|id|code|ref|key|#)$/.test(h));
    const nameIdx = header.findIndex(h => /^(name|label|title|metric)$/.test(h));
    const shown = showIdx >= 0 ? parseShowCell(cells[showIdx]) : true;
    if (shown === false) continue;

    let id = "";
    if (idIdx >= 0) {
      const n = String(cells[idIdx] || "").replace(/\D/g, "");
      if (n.length >= 2) id = n.slice(-2).padStart(2, "0");
    }
    if (!id && nameIdx >= 0) {
      const nameKey = String(cells[nameIdx] || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      id = byName.get(nameKey) || "";
    }
    /* Show | Name only — name is the non-show cell */
    if (!id && showIdx >= 0 && cells.length >= 2) {
      const nameCell = cells.find((_, i) => i !== showIdx) || "";
      const nameKey = String(nameCell).toLowerCase().replace(/\s+/g, " ").trim();
      id = byName.get(nameKey) || "";
      if (!id) {
        const n = String(nameCell).replace(/\D/g, "");
        if (n.length >= 2 && byId.has(n.slice(-2))) id = n.slice(-2);
      }
    }
    if (id && byId.has(id)) selected.push(id);
  }

  return [...new Set(selected.map(id => `#${id}`))];
}

function parseImpactMetricBullet(text) {
  const asOf = text.match(/as of\s*(\d{4}-\d{2}-\d{2})/i);
  const cleaned = text
    .replace(/\(as of\s*\d{4}-\d{2}-\d{2}\)/gi, "")
    .replace(/as of\s*\d{4}-\d{2}-\d{2}/gi, "")
    .trim();
  const range = cleaned.match(/~?(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)(?!\d)/);
  const single = cleaned.match(/~?(\d+(?:\.\d+)?)/);
  const period = /\/wave/i.test(text) ? "wave" : /\/mo/i.test(text) ? "mo" : null;
  const value = range
    ? (Number(range[1]) + Number(range[2])) / 2
    : single
      ? Number(single[1])
      : null;
  return { label: text.trim(), value, period, asOf: asOf ? asOf[1] : null };
}

function parseImpactEstimatesSection(body) {
  const est = { period: "mo", asOf: null, source: "", note: "" };
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("-")) continue;
    const m = t.match(/^-\s*(.+?):\s*(.+)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key.includes("leads impacted")) {
      const p = parseImpactMetricBullet(val);
      est.leadsImpacted = p.value;
      if (p.period) est.period = p.period;
      if (p.asOf) est.asOf = p.asOf;
    } else if (key.includes("leads connected")) {
      est.leadsConnected = parseImpactMetricBullet(val).value;
    } else if (key.includes("clients retained")) {
      est.clientsRetained = parseImpactMetricBullet(val).value;
    } else if (key === "source") {
      est.source = val;
    } else if (key === "note") {
      est.note = val;
    }
  }
  if (est.leadsImpacted == null && est.leadsConnected == null && est.clientsRetained == null) return null;
  return est;
}

function parseGilbertMetricNotes(body) {
  const notes = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^-\s*\*\*(\d{4}-\d{2}-\d{2})\s*·\s*([^*]+)\*\*\s*[—–-]\s*(.+)$/);
    if (m) notes.push({ date: m[1], field: m[2].trim(), text: m[3].trim() });
  }
  return notes;
}

function formatImpactEstimatesSection(p) {
  const e = p.impactEstimates;
  if (!e) return "";
  const period = e.period === "wave" ? "/wave" : "/mo";
  const fmt = v => {
    if (v == null) return "—";
    const n = Number(v);
    return n < 1 && n > 0 ? `~${n.toFixed(1)}${period}` : `~${n}${period}`;
  };
  let md = `## Impact estimates\n\n`;
  md += `- Leads impacted: ${fmt(e.leadsImpacted)} (as of ${e.asOf || "—"})\n`;
  md += `- Leads connected: ${fmt(e.leadsConnected)}\n`;
  md += `- Clients retained: ${fmt(e.clientsRetained)}\n`;
  if (e.source) md += `- Source: ${e.source}\n`;
  if (e.note) md += `- Note: ${e.note}\n`;
  return md + "\n";
}

function formatGilbertMetricNotesSection(p) {
  if (!p.gilbertMetricNotes?.length) return "";
  let md = `## Gilbert on metrics\n\n`;
  md += p.gilbertMetricNotes
    .map(n => `- **${n.date} · ${n.field}** — ${n.text}`)
    .join("\n");
  return md + "\n\n";
}

function parseValueIconsSection(body) {
  const byId = new Map(VALUE_ICON_CATALOG.map(k => [k.id, k]));
  const byName = new Map(
    VALUE_ICON_CATALOG.map(k => [k.name.toLowerCase().replace(/\s+/g, " ").trim(), k.id])
  );
  /* efficiency displays as Analytics */
  byName.set("efficiency", "efficiency");
  byName.set("analytics", "efficiency");

  const lines = String(body || "").split("\n");
  let header = null;
  const selected = [];

  for (const line of lines) {
    const cells = splitMarkdownTableCells(line);
    if (!cells) {
      const t = line.replace(/^-\s+/, "").trim();
      if (!t || t.startsWith("|")) continue;
      const id = normalizeValueIconId(t);
      if (byId.has(id)) {
        selected.push(id);
        continue;
      }
      const nameKey = t.toLowerCase().replace(/\s+/g, " ").trim();
      if (byName.has(nameKey)) selected.push(byName.get(nameKey));
      continue;
    }
    if (isMarkdownTableSeparator(cells)) continue;
    if (!header) {
      header = cells.map(c => c.toLowerCase().replace(/\*\*/g, "").trim());
      continue;
    }
    const showIdx = header.findIndex(h => /^(show|visible|on|v)$/.test(h));
    const idIdx = header.findIndex(h => /^(icon|id|code|ref|key)$/.test(h));
    const nameIdx = header.findIndex(h => /^(name|label|title)$/.test(h));
    const shown = showIdx >= 0 ? parseShowCell(cells[showIdx]) : true;
    if (shown === false) continue;

    let id = "";
    if (idIdx >= 0) {
      id = normalizeValueIconId(cells[idIdx] || "");
      if (!byId.has(id)) id = "";
    }
    if (!id && nameIdx >= 0) {
      const nameKey = String(cells[nameIdx] || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      id = byName.get(nameKey) || "";
    }
    if (!id && showIdx >= 0 && cells.length >= 2) {
      const nameCell = cells.find((_, i) => i !== showIdx) || "";
      const nameKey = String(nameCell).toLowerCase().replace(/\s+/g, " ").trim();
      id = byName.get(nameKey) || normalizeValueIconId(nameCell);
      if (!byId.has(id)) id = "";
    }
    if (id && byId.has(id)) selected.push(id);
  }

  return [...new Set(selected)];
}

function parseLearnings(body) {
  const links = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*—\s*(.+))?$/);
    if (m) links.push({ label: m[1], url: m[2], ...(m[3] ? { note: m[3] } : {}) });
  }
  return links;
}

function parseAbQuestions(fullText, sections) {
  const questions = [];
  const sectionBody = sections["ab - q"] || sections["ab-q"] || sections["ab q"];
  if (sectionBody) {
    for (const line of sectionBody.split("\n")) {
      const t = line.replace(/^-\s+/, "").trim();
      if (t) questions.push(t.replace(/^AB\s*[-–]\s*Q:\s*/i, "").trim());
    }
  }
  const re = /^(?:[-•]\s*)?AB\s*[-–]\s*Q:\s*(.+)$/gim;
  let m;
  while ((m = re.exec(fullText)) !== null) {
    questions.push(m[1].trim());
  }
  const inlineRe = /AB\s*[-–]\s*Q:\s*([^\n]+)/gi;
  while ((m = inlineRe.exec(fullText)) !== null) {
    questions.push(m[1].trim());
  }
  return [...new Set(questions.filter(Boolean))];
}

function findSectionBody(sections, baseName) {
  if (!sections) return "";
  if (sections[baseName]) return sections[baseName];
  const key = Object.keys(sections).find(k => {
    const kl = k.toLowerCase();
    const b = baseName.toLowerCase();
    return kl === b || kl.startsWith(`${b} `) || kl.startsWith(`${b}—`) || kl.startsWith(`${b} —`);
  });
  return key ? sections[key] : "";
}

function projectStatusBucket(status) {
  const s = String(status || "available").toLowerCase();
  if (s.includes("completed")) return "completed";
  if (s.includes("wip")) return "wip";
  if (s.includes("ongoing")) return "ongoing";
  if (s.includes("research") || s.includes("draft")) return "research";
  return "available";
}

function isInfoPlaceholder(item) {
  return /^_Add:_?$/i.test(String(item || "").trim());
}

function inferInformationNeeded(p) {
  const bucket = projectStatusBucket(p.status);
  const items = [];
  if (!p.goal?.trim()) items.push("Define measurable Goal");
  if (p.estimatedLeads === "Estimate pending") items.push("Confirm estimated leads gained");
  if (!(p.kpiRefs || []).length && /dashboard|kpi|metric/i.test(`${p.category} ${p.title}`))
    items.push("Link KPI dashboard rows");

  const manual = (p.informationNeeded || [])
    .map(s => String(s || "").trim())
    .filter(Boolean)
    .filter(item => !isInfoPlaceholder(item))
    .filter(item => !/^Resolve blocker:/i.test(item))
    .filter(item => !/^Answer AB – Q:/i.test(item))
    .filter(item => !items.includes(item));

  items.push(...manual);

  const deduped = [];
  for (const item of items) {
    const norm = item.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (deduped.some(x => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === norm)) continue;
    if (/fill impact/i.test(item) && deduped.some(x => /fill impact/i.test(x))) continue;
    deduped.push(item);
  }
  if (!deduped.length) deduped.push("_Add:_");
  else if (deduped.length < 3 && /wip|research|draft/i.test(String(p.status || "")) && !deduped.some(isInfoPlaceholder))
    deduped.push("_Add:_");

  return deduped.slice(0, 8);
}

function formatInformationNeededSection(p) {
  const items = inferInformationNeeded(p);
  let md = `## Information needed\n\n`;
  md += items.map(i => `- ${i}`).join("\n");
  return md + "\n\n";
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

/** Divider + Project plan — Kate/ops only; never published to Guide cards. */
export const UNPUBLISHED_DIVIDER =
  "---\n\n—— Unpublished below ——\n\n";

const UNPUBLISHED_DIVIDER_RE =
  /\n---\s*\n+(?:\*\*)?—— Unpublished below ——(?:\*\*)?[^\n]*\n+/i;

/**
 * Split body into Guide-published sections vs unpublished Project plan tail.
 * Anything at/after the divider (or bare ## Project plan) is not parsed into card fields.
 */
export function splitPublishedUnpublished(rest) {
  const text = String(rest || "");
  const div = text.match(UNPUBLISHED_DIVIDER_RE);
  if (div) {
    return {
      published: text.slice(0, div.index).trimEnd(),
      unpublishedMarkdown: text.slice(div.index).trim()
    };
  }
  const plan = text.match(/\n## Project plan\b/i);
  if (plan) {
    return {
      published: text.slice(0, plan.index).trimEnd(),
      unpublishedMarkdown: (UNPUBLISHED_DIVIDER + text.slice(plan.index).trim()).trim()
    };
  }
  return { published: text, unpublishedMarkdown: "" };
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

  const { published, unpublishedMarkdown } = splitPublishedUnpublished(rest);
  const sections = parseSections(published);
  const project = { ...meta };
  if (unpublishedMarkdown) project.unpublishedMarkdown = unpublishedMarkdown;

  if (sections.description) project.description = applyProperCase(sections.description.trim());
  const summaryBody = sections.summary || sections.tldr;
  const valueAdded = [];
  if (summaryBody) {
    const summaryBullets = parseListSection(summaryBody);
    if (summaryBullets.length) {
      valueAdded.push(...summaryBullets);
      project.tldr = summaryBullets[0];
    } else {
      project.tldr = applyProperCase(summaryBody.trim());
    }
  }
  if (sections["value added"]) valueAdded.push(...parseListSection(sections["value added"]));
  if (sections["value bullets"]) valueAdded.push(...parseListSection(sections["value bullets"]));
  if (sections["value add"] && !sections["value added"] && !sections["value bullets"])
    valueAdded.push(sections["value add"].trim());
  /* Dedupe summary↔value-added overlap */
  const seenVa = new Set();
  project.valueAdded = valueAdded.filter(Boolean).filter(item => {
    const key = String(item).trim().toLowerCase().replace(/\s+/g, " ");
    if (!key || seenVa.has(key)) return false;
    seenVa.add(key);
    return true;
  });

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

  if (sections["value icons"]) {
    project.valueIcons = parseValueIconsSection(sections["value icons"]);
  }

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
  const completedBody = findSectionBody(sections, "completed") || findSectionBody(sections, "done");
  if (completedBody) project.completedItems = parseListSection(completedBody);
  const wipBody = findSectionBody(sections, "wip") || findSectionBody(sections, "in progress");
  if (wipBody) project.inProgressItems = parseListSection(wipBody);
  const tasksBody = findSectionBody(sections, "tasks") || findSectionBody(sections, "task list");
  if (tasksBody) {
    project.taskItems = parseListSection(tasksBody);
    /* Tasks also count as in-progress scope when WIP is empty */
    if (!project.inProgressItems?.length) project.inProgressItems = [...project.taskItems];
  }
  if (sections.results)
    project.resultsItems = parseListSection(sections.results);
  if (sections.goal) project.goal = applyProperCase(sections.goal.trim());
  if (sections["information needed"])
    project.informationNeeded = parseListSection(sections["information needed"]);
  if (sections.blockers || sections["blockers (next round)"])
    project.blockers = parseListSection(sections.blockers || sections["blockers (next round)"]);
  const insightsKey =
    sections["insights & improvements"] ||
    sections["insights and improvements"] ||
    sections.insights;
  if (insightsKey) project.insightsImprovements = parseListSection(insightsKey);
  if (sections["impact estimates"]) {
    project.impactEstimates = parseImpactEstimatesSection(sections["impact estimates"]);
  }

  if (sections.learnings) project.learningsLinks = parseLearnings(sections.learnings);
  if (sections.references) project.references = parseLearnings(sections.references);

  const accountKey =
    sections["account data & marketing principles applied"] ||
    sections["account data"];
  if (accountKey) {
    const bm = parseAccountSection(accountKey);
    if (bm?.label) project.backedMetric = bm;
  }

  project.abQuestions = [];

  if (sections["kpi links"]) {
    project.kpiRefs = parseKpiLinksSection(sections["kpi links"]);
  }

  return sanitizeProjectRecord(project);
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
  const l = String(label);
  return `| ${l.padEnd(17)} | ${String(value).padEnd(58)} |`;
}

function metaTableRows(p) {
  const rows = [
    ...(isRetainerPhase(p) || p.priority == null ? [] : [["Priority", p.priority]]),
    ["Fee", p.fee],
    ["Category", p.category],
    ["Campaign type", p.campaignType],
    ["Status", p.status || "available"],
    ["Publish status", normalizePublishStatus(p.publishStatus)],
    ...(p.parentId ? [["Parent", p.parentId]] : []),
    ...(p.enabler ? [["Enabler", "yes"]] : []),
    ...(p.monthlyOnly ? [["Monthly only", "yes"]] : []),
    ...(p.paymentType ? [["Payment type", p.paymentType === "performance" ? "performance" : "flat"]] : []),
    ...(p.ongoingFee ? [["Ongoing fee", p.ongoingFee]] : []),
    ...(p.perCampaignFee ? [["Per campaign fee", p.perCampaignFee]] : []),
    ...(p.depositPct != null && p.depositPct !== 0.5 ? [["Deposit pct", Math.round(Number(p.depositPct) * 100)]] : []),
    ...(p.depositAmount != null && p.depositAmount !== "" ? [["Deposit amount", p.depositAmount]] : []),
    ...(p.featuredImage ? [["Featured image", p.featuredImage]] : []),
    ...(p.referenceLink?.url ? [["Reference link", formatReferenceLinkValue(p.referenceLink)]] : []),
    ...(p.estimatedLeads ? [["Estimated leads gained", p.estimatedLeads]] : []),
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

function extractKpiId(label, url) {
  const blob = `${label || ""} ${url || ""}`;
  const m = blob.match(/#(\d{2})\b/);
  return m ? `#${m[1]}` : null;
}

function isKpiUrl(url) {
  if (!url) return false;
  const u = String(url).toLowerCase().trim();
  return (
    u.includes("kpi-wireframe") ||
    u.includes("kpi-report") ||
    u.includes("kpi-list") ||
    u.startsWith("#kpi") ||
    /^#?\d{2}$/.test(u)
  );
}

/** Strip external and cross-project links; keep KPI refs as plain "KPI #NN" text. */
export function sanitizeProjectText(text) {
  if (!text) return text;
  let out = String(text);
  out = out.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, url, label) => {
    if (isKpiUrl(url)) {
      const id = extractKpiId(label, url);
      return id ? `KPI ${id}` : String(label).trim();
    }
    return String(label).trim();
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    const u = String(url).trim();
    if (isKpiUrl(u) || /#\d{2}/.test(label)) {
      const id = extractKpiId(label, u);
      return id ? `KPI ${id}` : String(label).trim();
    }
    return String(label).trim();
  });
  out = out.replace(/\s*See\s+(?:[^.\n]*\[([^\]]+)\]\(https?:\/\/[^)]+\)[^.\n]*)+\./gi, ".");
  out = out.replace(/\s*See\s+[^.\n]*https?:\/\/[^.\n]+\./gi, ".");
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

function collectKpiRefs(p) {
  const refs = new Set(p.kpiRefs || []);
  const blob = [
    p.tldr,
    p.description,
    p.goal,
    ...(p.valueAdded || [])
  ]
    .filter(Boolean)
    .join(" ");
  const re = /KPI\s+#(\d{2})|(?<![\w/])#(\d{2})(?![\w/])/g;
  let m;
  while ((m = re.exec(blob)) !== null) {
    refs.add(`#${m[1] || m[2]}`);
  }
  return [...refs].sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
}

export function sanitizeProjectRecord(p) {
  if (!p) return p;
  for (const key of ["tldr", "description", "goal", "marketingEducation"]) {
    if (p[key]) p[key] = sanitizeProjectText(p[key]);
  }
  for (const key of [
    "valueAdded",
    "completedItems",
    "inProgressItems",
    "taskItems",
    "deliverables"
  ]) {
    if (Array.isArray(p[key])) p[key] = p[key].map(sanitizeProjectText).filter(Boolean);
  }
  if (p.referenceLink) delete p.referenceLink;
  delete p.learningsLinks;
  delete p.references;
  if (p.backedMetric?.label) {
    p.backedMetric = {
      ...p.backedMetric,
      label: sanitizeProjectText(p.backedMetric.label)
    };
  }
  p.kpiRefs = collectKpiRefs(p);
  p.publishStatus = normalizePublishStatus(p.publishStatus);
  delete p.clientTouchpoints;
  delete p.planningPhases;
  delete p.timeline;
  delete p.recommendedMetrics;
  delete p.gilbertMetricNotes;
  delete p.resultsItems;
  delete p.blockers;
  delete p.insightsImprovements;
  delete p.impactEstimates;
  /* Keep unpublishedMarkdown for projectToMarkdown round-trip; strip in build-picker-data. */
  return p;
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

function mergeDescriptionAndEducation(p) {
  const desc = (p.description || "").trim();
  const edu = (p.marketingEducation || "").trim();
  if (!edu) return desc;
  if (desc && desc.toLowerCase().includes(edu.slice(0, Math.min(48, edu.length)).toLowerCase())) return desc;
  return [desc, edu].filter(Boolean).join("\n\n");
}

function sentenceFromBullet(text) {
  let b = String(text).replace(/^Deliverable:\s*/i, "").trim().replace(/^[-•]\s*/, "");
  if (!b) return "";
  if (!/[.!?]$/.test(b)) b += ".";
  return b;
}

function inferTldr(p) {
  if (p.tldr && String(p.tldr).trim()) return String(p.tldr).trim();
  if (p.valueAdded && p.valueAdded.length) return sentenceFromBullet(p.valueAdded[0]);
  const desc = String(p.description || "").replace(/<[^>]+>/g, " ");
  const m = desc.match(/[^.!?]+[.!?]+/);
  return m ? m[0].trim() : "";
}

function inferEstimatedLeads(p) {
  if (p.estimatedLeads && String(p.estimatedLeads).trim()) return String(p.estimatedLeads).trim();
  if (p.id === "RETAINER") return "No direct leads";
  const blob = `${p.category || ""} ${p.campaignType || ""} ${(p.keywords || []).join(" ")}`.toLowerCase();
  if (/direct mail|mailer|postcard|envelope/.test(blob)) return "1–2 leads gained per wave";
  return "Estimate pending";
}

const GILBERT_BOILERPLATE = [
  "Everyone this campaign reached — calls, clicks, opens, mail, or profile views.",
  "Prospects who actually connected with intake (answered, booked, or submitted).",
  "Signed matters at historical lead→case rate (7.3% · Jun 2026) unless noted otherwise."
];

function shortenGilbertMetricNotes(notes) {
  return (notes || []).map(n => {
    let text = String(n.text || "").trim();
    for (const phrase of GILBERT_BOILERPLATE) {
      text = text.replace(new RegExp(`\\s*${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g"), "");
    }
    return { ...n, text: text.trim() };
  });
}

function normalizeProjectForTemplate(p) {
  p.tldr = inferTldr(p);
  if (!p.estimatedLeads) p.estimatedLeads = inferEstimatedLeads(p);
  delete p.clientTouchpoints;
  p.description = sanitizeProjectText(mergeDescriptionAndEducation(p));
  delete p.planningPhases;
  delete p.timeline;
  delete p.recommendedMetrics;
  delete p.gilbertMetricNotes;
  p.informationNeeded = inferInformationNeeded(p);
  delete p.marketingEducation;
  delete p.learningsLinks;
  return sanitizeProjectRecord(p);
}

export function projectToMarkdown(p) {
  const id = p.id || "NEW";
  const title = applyProperCase(p.title || "Untitled Project");

  let md = `# ${id} — ${title}\n\n`;
  md += `|                   |                                                            |\n`;
  md += `| ----------------- | ---------------------------------------------------------- |\n`;
  md += metaTableRows(p).join("\n");
  md += `\n\n---\n\n`;

  if (p.valueAdded?.length) {
    md += `## Summary\n\n${p.valueAdded.map(b => `- ${String(b).trim()}`).join("\n")}\n\n`;
  } else if (p.tldr) {
    md += `## Summary\n\n- ${applyProperCase(p.tldr.trim())}\n\n`;
  }
  md += formatValueIconsShowTable(p.valueIcons || []);
  md += formatKpiLinksShowTable(p.kpiRefs || []);
  md += formatInformationNeededSection(p);
  md += listSection("WIP", p.inProgressItems);
  md += listSection("Completed", p.completedItems);

  if (p.unpublishedMarkdown) {
    const tail = String(p.unpublishedMarkdown).trim();
    if (tail) md += (md.endsWith("\n\n") ? "" : "\n") + tail + "\n";
  }

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
    guideIcon: meta.guideIcon || meta.paviIcon || "assets/gigi-seal.jpg",
    guideHero: meta.guideHero || "assets/gigi-goose-walk.png",
    guideSeal: meta.guideSeal || "assets/gilbert-celebrating.png",
    guideLogo: meta.guideLogo || "assets/gigi-logo.jpg",
    paviIcon: meta.guideIcon || meta.paviIcon || "assets/gigi-seal.jpg",
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
  return /^(RETAINER|[A-Za-z][A-Za-z0-9]{1,23})$/i.test(String(id || "").trim());
}

function indexHeaderColumnMap(cells) {
  const lower = cells.map(c => String(c || "").toLowerCase().trim());
  const pick = key => {
    const i = lower.findIndex(c => c === key || c.replace(/\s+/g, "") === key.replace(/\s+/g, ""));
    return i >= 0 ? i : null;
  };
  const hasId = lower.includes("id");
  const hasScore = lower.some(c => c.includes("project score") || c === "score" || c === "priority");
  const hasFile = lower.includes("file");
  const hasProject = lower.includes("project");
  const hasShort = lower.some(c => c === "short title" || c === "shorttitle" || c === "short");
  const hasEst = lower.some(c => /est\.?\s*cost|estimated cost|^cost$|^fee$/.test(c));
  const hasPay = lower.some(c => /payment plan|^payment$|pay plan|^deposit$/.test(c));
  if (!hasId && !hasScore && !hasFile && !hasProject && !hasEst && !hasPay && !hasShort) return null;
  return {
    /* null when this table has no score column — never default to 0 (would steal Est. cost). */
    priority:
      pick("project score") ??
      pick("projectscore") ??
      pick("score") ??
      pick("priority") ??
      pick("p"),
    id: pick("id"),
    status: pick("status"),
    visibility:
      pick("show") ??
      pick("visibility") ??
      pick("publish") ??
      pick("publishstatus"),
    estCost:
      pick("est. cost") ??
      pick("est cost") ??
      pick("estimated cost") ??
      pick("cost") ??
      pick("fee"),
    paymentPlan:
      pick("payment plan") ??
      pick("payment") ??
      pick("pay plan") ??
      pick("deposit"),
    shortTitle:
      pick("short title") ??
      pick("shorttitle") ??
      pick("short"),
    title: pick("project"),
    file: pick("file")
  };
}

/** Extract project ID from INDEX link cell (`[projects/AdEnhance.md](…)` or `[Name](projects/AdEnhance.md)` → AdEnhance). */
export function idFromIndexFileCell(raw) {
  const s = String(raw || "");
  const m =
    s.match(/\bprojects\/([A-Za-z][A-Za-z0-9_-]{0,31})\.md\b/) ||
    s.match(/\b(retainer)\.md\b/i) ||
    s.match(/\b([A-Za-z][A-Za-z0-9_-]{0,31})\.md\b/);
  if (!m) return null;
  if (/^retainer$/i.test(m[1])) return "RETAINER";
  return m[1];
}

/** Parse INDEX Project cell: `[Title](projects/AdEnhance.md)` → { title, href, id }. */
export function parseIndexProjectCell(raw) {
  const s = String(raw || "").trim();
  const m = s.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
  if (m) {
    return { title: m[1].trim(), href: m[2].trim(), id: idFromIndexFileCell(m[2]) };
  }
  const inline = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (inline) {
    return { title: inline[1].trim(), href: inline[2].trim(), id: idFromIndexFileCell(inline[2]) };
  }
  return { title: s, href: null, id: idFromIndexFileCell(s) };
}

/** Parse INDEX Payment plan cells: `50%`, `50/50`, `100%`, `$800`, `monthly`, `—`. */
export function parseIndexPaymentPlan(raw) {
  const s = String(raw || "").trim();
  if (!s || s === "—" || s === "-" || /^n\/?a$/i.test(s) || /^incl/i.test(s) || /^merged/i.test(s) || /^package/i.test(s)) {
    return { label: s || "—", depositPct: null, depositAmount: null, monthly: false };
  }
  if (/monthly|retainer|ongoing/i.test(s)) {
    return { label: s, depositPct: null, depositAmount: null, monthly: true };
  }
  if (/pay\s*in\s*full|full\s*pay|100\s*%|due\s*now/i.test(s)) {
    return { label: s, depositPct: 1, depositAmount: null, monthly: false };
  }
  const slash = s.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/);
  if (slash) {
    const a = parseInt(slash[1], 10);
    const b = parseInt(slash[2], 10);
    if (a + b === 100) return { label: s, depositPct: a / 100, depositAmount: null, monthly: false };
  }
  const pct = s.match(/^(\d{1,3})\s*%$/);
  if (pct) {
    const n = parseInt(pct[1], 10);
    if (n >= 0 && n <= 100) return { label: s, depositPct: n / 100, depositAmount: null, monthly: false };
  }
  const amt = s.match(/^\$?\s*([\d,]+(?:\.\d+)?)\s*$/);
  if (amt && !/%/.test(s)) {
    const n = parseFloat(amt[1].replace(/,/g, ""));
    if (Number.isFinite(n)) return { label: s, depositPct: null, depositAmount: Math.round(n), monthly: false };
  }
  return { label: s, depositPct: null, depositAmount: null, monthly: false };
}

/** Parse INDEX Est. cost cells like `$2,900/mo`, `$2,000 + $500/mo`, `$1,500`, `incl. HsSetup`. */
export function parseIndexEstCost(raw) {
  const s = String(raw || "").trim();
  if (!s || s === "—" || s === "-" || /^incl/i.test(s) || /^merged/i.test(s) || /^n\/?a$/i.test(s)) {
    return { label: s || "—", fee: null, ongoingFee: null };
  }
  const nums = [...s.matchAll(/\$?\s*([\d,]+(?:\.\d+)?)/g)].map(m => parseFloat(m[1].replace(/,/g, "")));
  if (!nums.length) return { label: s, fee: null, ongoingFee: null };
  if (/\/\s*mo/i.test(s) && !/\+/.test(s) && nums.length === 1) {
    // Pure monthly (retainer): store as fee for monthly-only / retainer cards
    return { label: s, fee: nums[0], ongoingFee: null, monthlyOnly: true };
  }
  if (/\+/.test(s) && nums.length >= 2) {
    /* "$500 + 20% verified savings" — second number is a share, not a monthly dollar fee. */
    if (/%/.test(s) && !/\/\s*mo/i.test(s)) {
      return { label: s, fee: nums[0], ongoingFee: null };
    }
    return { label: s, fee: nums[0], ongoingFee: nums[1] };
  }
  if (/\/\s*mo/i.test(s) && nums.length >= 1) {
    return { label: s, fee: nums[0], ongoingFee: null, monthlyOnly: true };
  }
  return { label: s, fee: nums[0], ongoingFee: null };
}

function normalizeIndexVisibility(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim().toLowerCase();
  /* Easy checkbox cells in INDEX */
  if (/^\[[xX✓✔]\]/.test(s) || s === "☑" || s === "✅") return "published";
  if (/^\[\s*\]/.test(s) || s === "☐" || s === "⬜") return "unpublished";
  return normalizePublishStatus(raw);
}

function normalizeIndexStatus(raw) {
  if (!raw) return null;
  const s = String(raw).toLowerCase().trim();
  if (s.includes("completed")) return "completed";
  if (s.includes("research")) return "research";
  if (s.includes("draft") || s.includes("outline")) return "draft";
  if (s.includes("ongoing")) return "ongoing";
  if (/\bwip\b/.test(s)) return "wip";
  if (s.includes("available")) return "available";
  if (s.includes("recommended")) return "recommended";
  if (s.includes("launched")) return "launched";
  if (s.includes("planning")) return "planning";
  if (s.includes("on hold") || s === "onhold") return "onhold";
  if (s.includes("blocked")) return "blocked-ab";
  if (s.includes("archived") || s.includes("merged")) return "archived";
  const first = s.split(/[·•|/]/)[0].trim().replace(/\s+/g, "");
  return first || null;
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
  let colMap = null;
  for (const line of lines) {
    if (!/^\|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim());
    if (!cells.length) continue;
    if (cells.every(c => /^[\-:]+$/.test(c) || c === "")) continue;

    const isHeader =
      cells.some(c => /^id$/i.test(c)) ||
      cells.some(c => /project\s*score/i.test(c)) ||
      cells.some(c => /^show$/i.test(c)) ||
      cells.some(c => /short\s*title/i.test(c)) ||
      cells.some(c => /est\.?\s*cost/i.test(c)) ||
      cells.some(c => /payment\s*plan/i.test(c));
    if (isHeader) {
      const nextMap = indexHeaderColumnMap(cells);
      if (nextMap) colMap = nextMap;
      continue;
    }

    if (!colMap) continue;

    const projectCell = colMap.title != null ? (cells[colMap.title] ?? "") : "";
    const fileCell = colMap.file != null ? (cells[colMap.file] ?? "") : "";
    const parsedProject = parseIndexProjectCell(projectCell);

    let id = colMap.id != null ? cells[colMap.id] : null;
    if (!id || !isValidProjectId(id)) {
      id = parsedProject.id || idFromIndexFileCell(fileCell);
    }
    if (!id || !isValidProjectId(id)) continue;

    const href =
      parsedProject.href ||
      (fileCell.match(/\(([^)]+\.md)\)/) || [])[1] ||
      (id === "RETAINER" ? "retainer.md" : `projects/${id}.md`);
    const prev = result.rowsById[id] || {};
    const row = { ...prev };
    if (parsedProject.title || projectCell) row.title = parsedProject.title || projectCell || prev.title;
    if (href) row.file = `[${href}](${href})`;
    if (colMap.priority != null) {
      row.p = cells[colMap.priority] ?? prev.p ?? "";
      row.hasPriority = true;
    }
    if (colMap.shortTitle != null && cells[colMap.shortTitle]) {
      row.shortTitle = String(cells[colMap.shortTitle]).trim();
    }
    if (colMap.status != null && cells[colMap.status]) row.status = cells[colMap.status];
    if (colMap.visibility != null && cells[colMap.visibility] != null) {
      row.visibility = cells[colMap.visibility];
      row.publishStatus = normalizeIndexVisibility(cells[colMap.visibility]);
    }
    if (colMap.estCost != null && cells[colMap.estCost] != null) {
      row.estCost = cells[colMap.estCost];
      row.estCostParsed = parseIndexEstCost(cells[colMap.estCost]);
    }
    if (colMap.paymentPlan != null && cells[colMap.paymentPlan] != null) {
      row.paymentPlan = cells[colMap.paymentPlan];
      row.paymentPlanParsed = parseIndexPaymentPlan(cells[colMap.paymentPlan]);
    }
    result.rowsById[id] = row;
  }

  const tableStart = text.search(
    /\|[^\n]*\b(ID|Project score|Show|Est\.?\s*cost|Payment plan)\b[^\n]*\|/i
  );
  if (tableStart > 0) result.intro = text.slice(0, tableStart).trim();

  const footerStart = text.indexOf("**Retainer");
  if (footerStart > 0) result.footer = text.slice(footerStart).trim();

  return result;
}

/** INDEX table titles, priority, status, visibility → picker data (INDEX wins over project .md). */
export function applyIndexOverrides(projects, retainer, existingText) {
  const { rowsById } = parseIndexMarkdown(existingText || "");
  const applyTo = item => {
    const o = rowsById[item.id];
    if (!o) return item;
    const next = { ...item };
    if (o.title) next.title = o.title;
    if (o.shortTitle) next.shortTitle = o.shortTitle;
    if (o.hasPriority) {
      const rawP = String(o.p || "").trim();
      const pm = rawP.match(/^P?(\d+)$/i);
      if (pm) next.priority = parseInt(pm[1], 10);
      else if (!rawP || rawP === "—" || rawP === "-" || /^archive$/i.test(rawP)) {
        delete next.priority;
      }
    }
    const status = normalizeIndexStatus(o.status);
    if (status) next.status = status;
    if (o.publishStatus) next.publishStatus = o.publishStatus;
    if (o.estCost) next.estCostLabel = o.estCost;
    const ec = o.estCostParsed || (o.estCost ? parseIndexEstCost(o.estCost) : null);
    if (ec && ec.fee != null && !/^incl/i.test(String(ec.label || "")) && !/^merged/i.test(String(ec.label || ""))) {
      next.fee = ec.fee;
      if (ec.ongoingFee != null) next.ongoingFee = ec.ongoingFee;
      else if (!ec.monthlyOnly) {
        /* INDEX setup-only (no + $/mo) clears a prior Ongoing fee */
        delete next.ongoingFee;
      }
    }
    const pp = o.paymentPlanParsed || (o.paymentPlan ? parseIndexPaymentPlan(o.paymentPlan) : null);
    if (pp) {
      if (o.paymentPlan) next.paymentPlanLabel = o.paymentPlan;
      if (pp.monthly) {
        delete next.depositPct;
        delete next.depositAmount;
      } else if (pp.depositAmount != null) {
        next.depositAmount = pp.depositAmount;
        delete next.depositPct;
      } else if (pp.depositPct != null) {
        next.depositPct = pp.depositPct;
        delete next.depositAmount;
      } else if (pp.label === "—" || pp.label === "-" || !pp.label) {
        delete next.depositPct;
        delete next.depositAmount;
      }
    }
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

Open a file below to edit. Sorted by project score (number). Template: [\`_TEMPLATE.md\`](_TEMPLATE.md) (matches \`HsVoip.md\`).

Edit **Project** titles, **Project score**, **Status**, **Show** (visibility), **Est. cost**, **Payment plan**, and add **## Notes** at the bottom — build keeps your changes and adds new projects.`;

  md += `\n\n| Project score | Status | Show | Est. cost | Payment plan | Project |\n| ------------- | ------ | ---- | --------- | ------------ | ------- |\n`;

  const seen = new Set();
  for (const p of all) {
    const id = p.id;
    seen.add(id);
    const file = id === "RETAINER" ? "retainer.md" : `projects/${id}.md`;
    const o = overrides.rowsById[id];
    const pri = o?.p ?? (p.priority != null ? String(p.priority) : "—");
    const title = parseIndexProjectCell(o?.title || p.title).title || p.title;
    const projectCell = `[${title}](${file})`;
    const status = o?.status || p.status || "available";
    const pub =
      normalizePublishStatus(o?.publishStatus || p.publishStatus) === "published";
    const show =
      o?.visibility && /^\[[xX✓✔\s]*\]|^[☑☐]/.test(String(o.visibility).trim())
        ? (/^\[[xX✓✔]\]|^☑/.test(String(o.visibility).trim()) ? "[x]" : "[ ]")
        : pub
          ? "[x]"
          : "[ ]";
    let est = o?.estCost || "";
    if (!est) {
      if (p.fee && p.ongoingFee) est = `$${Number(p.fee).toLocaleString("en-US")} + $${Number(p.ongoingFee).toLocaleString("en-US")}/mo`;
      else if (p.monthlyOnly || id === "RETAINER" || id === "DataMgmt") est = `$${Number(p.fee || 0).toLocaleString("en-US")}/mo`;
      else if (p.fee) est = `$${Number(p.fee).toLocaleString("en-US")}`;
      else est = "—";
    }
    let pay = o?.paymentPlan || "";
    if (!pay) {
      if (p.monthlyOnly || id === "RETAINER" || id === "DataMgmt") pay = "monthly";
      else if (/^incl/i.test(est) || /^merged/i.test(est)) pay = "—";
      else if (p.depositAmount != null) pay = `$${Number(p.depositAmount).toLocaleString("en-US")}`;
      else if (p.depositPct != null) pay = `${Math.round(Number(p.depositPct) * 100)}%`;
      else pay = "50%";
    }
    md += `| ${pri} | ${status} | ${show} | ${est} | ${pay} | ${projectCell} |\n`;
  }

  for (const [id, o] of Object.entries(overrides.rowsById)) {
    if (seen.has(id) || !isValidProjectId(id)) continue;
    const show =
      o.publishStatus === "unpublished" || /^\[\s*\]/.test(String(o.visibility || ""))
        ? "[ ]"
        : "[x]";
    const file =
      parseIndexProjectCell(o.title).href ||
      (id === "RETAINER" ? "retainer.md" : `projects/${id}.md`);
    const title = parseIndexProjectCell(o.title).title || o.title || id;
    md += `| ${o.p} | ${o.status || "available"} | ${show} | ${o.estCost || "—"} | ${o.paymentPlan || "—"} | [${title}](${file}) |\n`;
  }

  md += `\n${overrides.footer || "**Retainer / monthly-only:** omit **Project score** row (shows as —)."}\n`;

  if (overrides.notes) {
    md += `\n${overrides.notes}\n`;
  } else {
    md += `\n## Notes\n\n<!-- Your notes for agents — preserved on every build -->\n\n`;
  }

  return md.trim() + "\n";
}

/** Migrate all project markdown to HsVoip format in place. Preserves wording; normalizes layout. */
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
    const status = normalizeIndexStatus(row?.status);
    if (status) p.status = status;
    if (p.learningsLinks) p.learningsLinks = dedupeLinks(p.learningsLinks);
    if (p.references) p.references = dedupeLinks(p.references);
    normalizeProjectForTemplate(p);
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
  console.log("Migrated all projects to HsVoip markdown format");
}
