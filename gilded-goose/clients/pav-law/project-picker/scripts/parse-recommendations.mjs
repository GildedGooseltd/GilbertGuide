/**
 * Parse content/recommendations.md → plain object for recommendations-data.js.
 * Kate edits the markdown; build never writes it back.
 */
export function parseRecommendationsMarkdown(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const page = {};
  const jump = [];
  const recs = [];
  let mode = null; // page | jump | rec
  let current = null;
  let sub = null; // stats | proof | projects | actions

  function flushRec() {
    if (current) recs.push(current);
    current = null;
    sub = null;
  }

  function parsePipeRow(line) {
    const cells = line.split("|").map(c => c.trim());
    if (cells.length && cells[0] === "") cells.shift();
    if (cells.length && cells[cells.length - 1] === "") cells.pop();
    return cells;
  }

  function isSepRow(cells) {
    return cells.length > 0 && cells.every(c => /^[-:]+$/.test(c));
  }

  function setField(obj, key, value) {
    const k = key.replace(/\*\*/g, "").trim().toLowerCase();
    const map = {
      title: "title",
      subtitle: "subtitle",
      "alert status": "alertStatus",
      "alert label": "alertLabel",
      alert: "alert",
      hint: "hint",
      "why status": "whyStatus",
      why: "why",
      solutions: "solutions",
      "proof title": "proofTitle",
      "proof type": "proofType",
      chart: "chart",
      "body type": "bodyType"
    };
    const dest = map[k];
    if (dest) obj[dest] = value;
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line === "---") continue;
    if (/^#\s+Recommendations\b/i.test(line)) continue;
    if (/^Edit this file/i.test(line) || /^Tokens like/i.test(line) || /^Project links:/i.test(line)) continue;

    if (/^##\s+Page\b/i.test(line)) {
      flushRec();
      mode = "page";
      sub = null;
      continue;
    }
    if (/^##\s+Jump\b/i.test(line)) {
      flushRec();
      mode = "jump";
      sub = null;
      continue;
    }
    const recMatch = line.match(/^##\s+Rec\s*·\s*(.+)$/i);
    if (recMatch) {
      flushRec();
      mode = "rec";
      current = {
        id: recMatch[1].trim(),
        stats: [],
        proof: [],
        projects: [],
        actions: []
      };
      sub = null;
      continue;
    }
    if (/^###\s+Stats\b/i.test(line)) {
      sub = "stats";
      continue;
    }
    if (/^###\s+Proof\b/i.test(line)) {
      sub = "proof";
      continue;
    }
    if (/^###\s+Projects table\b/i.test(line)) {
      sub = "projects";
      continue;
    }
    if (/^###\s+Actions\b/i.test(line)) {
      sub = "actions";
      continue;
    }

    if (line.startsWith("|")) {
      const cells = parsePipeRow(line);
      if (!cells.length || isSepRow(cells)) continue;
      if (mode === "page" && cells.length >= 2) {
        setField(page, cells[0], cells.slice(1).join(" | "));
        continue;
      }
      if (mode === "jump") {
        if (/^rank$/i.test(cells[0])) continue;
        jump.push({
          rank: cells[0] || "",
          label: cells[1] || "",
          anchor: cells[2] || ""
        });
        continue;
      }
      if (mode === "rec" && current) {
        if (sub === "stats") {
          if (/^label$/i.test(cells[0])) continue;
          current.stats.push({
            label: cells[0] || "",
            value: cells[1] || "",
            context: cells[2] || ""
          });
          continue;
        }
        if (sub === "projects") {
          if (/^project$/i.test(cells[0])) continue;
          current.projects.push({
            project: cells[0] || "",
            priority: cells[1] || "",
            fee: cells[2] || "",
            role: cells[3] || "",
            gate: cells[4] || ""
          });
          continue;
        }
        if (!sub && cells.length >= 2) {
          setField(current, cells[0], cells.slice(1).join(" | "));
          continue;
        }
      }
      continue;
    }

    if (mode === "rec" && current && sub === "proof" && line.startsWith("-")) {
      current.proof.push(line.replace(/^[-*]\s+/, "").trim());
      continue;
    }
    if (mode === "rec" && current && sub === "actions") {
      const m = line.match(/^\d+\.\s+(.*)$/);
      if (m) current.actions.push(m[1].trim());
    }
  }
  flushRec();

  return { page, jump, recs };
}
