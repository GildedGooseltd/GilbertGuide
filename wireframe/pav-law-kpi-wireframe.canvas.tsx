import {
  BarChart,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  IconButton,
  LineChart,
  PieChart,
  Pill,
  Row,
  Stack,
  Table,
  Text,
  TextInput,
  TodoListCard,
  useCanvasState,
} from "cursor/canvas";

const PERIOD = "June 2026";
const SOURCE = "Dummy data · layout approval · GGL brand";

const GGL = {
  cream: "#f8f5ef",
  creamPanel: "#f3ede4",
  paper: "#fffcf7",
  brown: "#3d3028",
  brownMuted: "#5c4f45",
  gold: "#c9a86c",
  goldDark: "#b8860b",
  royal: "#4e2a84",
  royalMid: "#5b21b6",
  royalDim: "rgba(78, 42, 132, 0.1)",
  royalBorder: "rgba(78, 42, 132, 0.32)",
  red: "#CF2D56",
  orange: "#F1B467",
  green: "#1F8A65",
  peacockTeal: "#00d4c4",
  peacockBlue: "#4d8bff",
  peacockViolet: "#7c5cff",
  peacockPurple: "#b24bf3",
  peacockMagenta: "#ff2d95",
};

const GGL_CARD: Record<string, string | number> = {
  background: GGL.paper,
  border: `1px solid rgba(61, 48, 40, 0.14)`,
  color: GGL.brown,
  boxShadow: "0 1px 3px rgba(61, 48, 40, 0.06)",
};

/** ★ = on-file export per Ad Reports/exports/INDEX.md · Waldo = source gap */
const KPI_DATA_READY: Record<string, boolean> = {
  "01": true,
  "02": false,
  "03": false,
  "04": false,
  "05": false,
  "06": false,
  "07": true,
  "08": true,
  "09": false,
  "10": true,
  "11": true,
  "12": true,
  "13": true,
  "14": true,
  "15": true,
  "16": false,
  "17": false,
  "18": false,
  "19": false,
  "20": false,
  "21": false,
  "22": false,
  "23": false,
  "24": false,
  "25": false,
  "26": false,
  "27": false,
  "28": false,
  "29": false,
  bhi: false,
  "dui-annual": false,
  "cases-vertical": false,
};

const CASES_BY_VERTICAL = [
  { vertical: "DUI/DWAI", ytd: 18, month: 4 },
  { vertical: "Military", ytd: 8, month: 2 },
  { vertical: "Traffic", ytd: 6, month: 2 },
  { vertical: "DV", ytd: 3, month: 1 },
];

const DUI_ANNUAL_GOAL = 50;
const DUI_YTD = 18;

function GglCard({
  children,
  style,
  ...props
}: {
  children?: any;
  style?: Record<string, string | number>;
  [key: string]: unknown;
}) {
  return (
    <Card {...props} style={{ ...GGL_CARD, color: GGL.brown, ...style }}>
      {children}
    </Card>
  );
}

const GGL_TABLE_STYLE: Record<string, string | number> = {
  color: GGL.brown,
  background: GGL.paper,
  width: "100%",
};

function GglTable({
  headers,
  rows,
  columnAlign,
  rowTone,
  striped = true,
}: {
  headers: string[];
  rows: any[][];
  columnAlign?: Array<"left" | "center" | "right" | undefined>;
  rowTone?: Array<"success" | "danger" | "warning" | "info" | "neutral" | undefined>;
  striped?: boolean;
}) {
  return (
    <Table
      headers={headers.map((header) => (
        <Text weight="semibold" style={{ color: GGL.royal, fontSize: 13 }}>
          {header}
        </Text>
      ))}
      rows={rows.map((row) =>
        row.map((cell) =>
          typeof cell === "string" || typeof cell === "number" ? (
            <Text style={{ color: GGL.brown, fontSize: 13 }}>{cell}</Text>
          ) : (
            cell
          ),
        ),
      )}
      columnAlign={columnAlign}
      rowTone={rowTone}
      framed={false}
      striped={striped}
      style={GGL_TABLE_STYLE}
    />
  );
}

function DeltaText({ value }: { value: string }) {
  const isDown = value.startsWith("−") || value.startsWith("-");
  return (
    <Text weight="semibold" style={{ color: isDown ? GGL.red : GGL.brown }}>
      {value}
    </Text>
  );
}

function MutedText({ children, style }: { children: any; style?: Record<string, string | number> }) {
  return (
    <Text size="small" style={{ color: GGL.brownMuted, ...style }}>
      {children}
    </Text>
  );
}

function GglStat({ value, label }: { value: string; label: string }) {
  return (
    <Stack gap={4}>
      <Text style={{ fontSize: 28, fontWeight: 700, color: GGL.royal, lineHeight: 1.1 }}>{value}</Text>
      <Text style={{ fontSize: 12, color: GGL.brownMuted }}>{label}</Text>
    </Stack>
  );
}

function DataStatusIcon({ kpiKey, title }: { kpiKey: string; title: string }) {
  const ready = KPI_DATA_READY[kpiKey] ?? false;
  return (
    <span title={ready ? "Data on file" : "Source not wired yet"} style={{ display: "inline-flex", lineHeight: 1 }}>
      {ready ? (
        <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
          <path
            d="M7 1.2l1.55 3.14 3.47.5-2.51 2.45.59 3.45L7 9.38 3.9 10.74l.59-3.45L2 4.84l3.47-.5L7 1.2z"
            fill={GGL.goldDark}
          />
        </svg>
      ) : (
        <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
          <circle cx={7} cy={5.5} r={2.2} fill="#e8dcc8" stroke={GGL.brownMuted} strokeWidth={0.6} />
          <rect x={4.5} y={8} width={5} height={4.5} rx={1} fill="#c41e3a" />
          <rect x={4.5} y={8} width={5} height={1.1} fill="#fff" />
          <rect x={4.5} y={10.2} width={5} height={1.1} fill="#fff" />
        </svg>
      )}
      <span className="sr-only">{ready ? `${title} — data on file` : `${title} — awaiting source`}</span>
    </span>
  );
}

function ChartTitleRow({
  kpiKey,
  title,
  momPct,
  momFavorable,
}: {
  kpiKey: string;
  title: string;
  momPct?: number;
  momFavorable?: boolean;
}) {
  return (
    <Row gap={8} align="center" wrap>
      <DataStatusIcon kpiKey={kpiKey} title={title} />
      <Text weight="semibold" style={{ color: GGL.royal, fontSize: 15 }}>
        {title}
      </Text>
      {momPct !== undefined ? <MomChange pct={momPct} favorable={momFavorable ?? true} /> : null}
    </Row>
  );
}

function ChartPanel({
  kpiKey,
  title,
  caption,
  momPct,
  momFavorable,
  children,
  tableHeaders,
  tableRows,
  columnAlign,
}: {
  kpiKey: string;
  title: string;
  caption?: string;
  momPct?: number;
  momFavorable?: boolean;
  children: any;
  tableHeaders: string[];
  tableRows: any[][];
  columnAlign?: Array<"left" | "center" | "right" | undefined>;
}) {
  return (
    <GglCard>
      <CardBody>
        <ChartTitleRow kpiKey={kpiKey} title={title} momPct={momPct} momFavorable={momFavorable} />
        {caption ? <MutedText style={{ marginTop: 4, marginBottom: 10, display: "block" }}>{caption}</MutedText> : null}
        <div style={{ color: GGL.brown, background: GGL.paper, padding: 8, borderRadius: 8 }}>{children}</div>
        <Divider />
        <MutedText style={{ marginBottom: 8, display: "block" }}>Expanded metrics</MutedText>
        <GglTable headers={tableHeaders} rows={tableRows} columnAlign={columnAlign} />
      </CardBody>
    </GglCard>
  );
}

function ChartFrame({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: any;
}) {
  return (
    <GglCard>
      <CardBody>
        <Text weight="semibold" style={{ color: GGL.royal, fontSize: 15, marginBottom: caption ? 4 : 10 }}>
          {title}
        </Text>
        {caption ? <MutedText style={{ marginBottom: 10, display: "block" }}>{caption}</MutedText> : null}
        <div style={{ color: GGL.brown, background: GGL.paper, padding: 8, borderRadius: 8 }}>
          {children}
        </div>
      </CardBody>
    </GglCard>
  );
}

function InlineChart({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: any;
}) {
  return (
    <Stack gap={6}>
      <Text weight="semibold" style={{ color: GGL.royal, fontSize: 14 }}>
        {title}
      </Text>
      {caption ? <Text style={{ color: GGL.brownMuted, fontSize: 12 }}>{caption}</Text> : null}
      <div style={{ color: GGL.brown, background: GGL.paper, padding: 8, borderRadius: 8 }}>{children}</div>
    </Stack>
  );
}

const CHART_STYLE: Record<string, string> = {
  color: GGL.brown,
  fill: GGL.brownMuted,
};

const LEAD_CHANNEL_ROWS_GGL = [
  ["HubSpot forms", "29", <DeltaText value="+21%" />, "$0", "$0"],
  ["LSA inbox", "41", <DeltaText value="+8%" />, "$312", "$12,792"],
  ["Search calls", "54", <DeltaText value="+74%" />, "$41", "$2,214"],
];

const SOURCE_MIX_ROWS_GGL = [
  ["Paid Search", "54", <DeltaText value="+74%" />, "$41/call", "$2,214"],
  ["LSA", "41", <DeltaText value="+8%" />, "$312/lead", "$12,792"],
  ["Direct", "18", <DeltaText value="+6%" />, "$0", "$0"],
  ["Referral", "11", <DeltaText value="−3%" />, "$0", "$0"],
];

function scorePillColor(score: number) {
  if (score >= 70) {
    return GGL.green;
  }
  if (score >= 40) {
    return GGL.orange;
  }
  return GGL.goldDark;
}

function ScorePill({ score }: { score: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        minWidth: 36,
        textAlign: "center",
        padding: "3px 10px",
        borderRadius: 999,
        background: scorePillColor(score),
        color: GGL.paper,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {score}
    </span>
  );
}

const HIGHLIGHT_NOTES: Record<string, string> = {
  "highlight-lsa":
    "LSA charge rate 47% (38 of 81 leads). Top practice: DUI/DWAI at 62% of LSA volume. Charge rate = billed leads ÷ total LSA inbox leads.",
  "highlight-search":
    "Search calls +74% MoM — Military campaign driving most of June lift. Drill #08 by campaign before shifting budget.",
};

const LEAD_CHANNEL_ROWS = [
  ["HubSpot forms", "29", "+21%", "$0", "$0"],
  ["LSA inbox", "41", "+8%", "$312", "$12,792"],
  ["Search calls", "54", "+74%", "$41", "$2,214"],
];

const SOURCE_MIX_ROWS = [
  ["Paid Search", "54", "+74%", "$41/call", "$2,214"],
  ["LSA", "41", "+8%", "$312/lead", "$12,792"],
  ["Direct", "18", "+6%", "$0", "$0"],
  ["Referral", "11", "−3%", "$0", "$0"],
];

const BUSINESS_HEALTH = {
  index: 71,
  mom: -3,
  pillars: [
    { name: "Infrastructure", score: 78 },
    { name: "Operations", score: 71 },
    { name: "Finance", score: 68 },
    { name: "Marketing", score: 74 },
    { name: "Sales", score: 65 },
  ],
};

/** Dummy model inputs — replace retainer/bonus from SOW before client-facing build */
const ROI_MODEL = {
  platformCpl: 121,
  leadToCaseRate: 9 / 124,
  consultToRetained: 0.51,
  avgCaseFee: 4800,
  retainerMonthly: 2500,
  bonusMonthlyEst: 750,
  prior: {
    period: "May 2026",
    context: "Platform-only baseline · no GGL retainer on books",
    platformSpend: 5861,
    agencySpend: 0,
    leads: 68,
    consults: 24,
    cases: 12,
  },
  current: {
    period: "June 2026",
    context: "GGL stewardship · KPI #01 unified lead count",
    platformSpend: 15006,
    agencySpend: 3250,
    leads: 124,
    consults: 27,
    cases: 9,
  },
};

function formatUsd(value: number, compact = false) {
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

function parseInputNumber(raw: string, fallback: number) {
  const parsed = Number.parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function roiPct(revenue: number, invested: number) {
  if (invested <= 0) {
    return 0;
  }
  return Math.round(((revenue - invested) / invested) * 100);
}

function periodMetrics(period: (typeof ROI_MODEL)["prior"]) {
  const totalInvested = period.platformSpend + period.agencySpend;
  const revenue = period.cases * ROI_MODEL.avgCaseFee;
  const allInCpl = totalInvested / period.leads;
  const costPerCase = totalInvested / period.cases;
  return {
    totalInvested,
    revenue,
    allInCpl,
    costPerCase,
    marketingRoi: roiPct(revenue, totalInvested),
    revenuePerDollar: revenue / totalInvested,
  };
}

function MarketingInvestmentModel() {
  const [targetLeads, setTargetLeads] = useCanvasState("roi-target-leads", "110");

  const leads = parseInputNumber(targetLeads, 110);
  const platformSpend = leads * ROI_MODEL.platformCpl;
  const agencySpend = ROI_MODEL.retainerMonthly + ROI_MODEL.bonusMonthlyEst;
  const totalMarketing = platformSpend + agencySpend;
  const projectedCases = leads * ROI_MODEL.leadToCaseRate;
  const projectedRevenue = projectedCases * ROI_MODEL.avgCaseFee;
  const projectedRoi = roiPct(projectedRevenue, totalMarketing);
  const platformShare = Math.round((platformSpend / totalMarketing) * 100);
  const agencyShare = 100 - platformShare;

  return (
    <Stack gap={12}>
      <GglCard>
        <CardHeader trailing={<Pill size="sm">What-if</Pill>}>Budget → leads → revenue</CardHeader>
        <CardBody>
          <Row gap={16} align="center" wrap>
            <Stack gap={6} style={{ minWidth: 200 }}>
              <Text weight="semibold" size="small">
                Target leads (KPI #01)
              </Text>
              <TextInput value={targetLeads} onChange={setTargetLeads} type="number" placeholder="110" />
            </Stack>
            <MutedText style={{ flex: 1, minWidth: 220 }}>
              Uses June platform CPL ({formatUsd(ROI_MODEL.platformCpl)}) · lead→case rate{" "}
              {(ROI_MODEL.leadToCaseRate * 100).toFixed(1)}% · avg case fee {formatUsd(ROI_MODEL.avgCaseFee)}
            </MutedText>
          </Row>
          <Grid columns={4} gap={12} style={{ marginTop: 16 }}>
            <GglStat value={formatUsd(totalMarketing, true)} label="Total marketing in" />
            <GglStat value={String(Math.round(leads))} label="Projected leads" />
            <GglStat value={projectedCases.toFixed(1)} label="Projected new cases" />
            <GglStat value={formatUsd(projectedRevenue, true)} label="Projected case revenue" />
          </Grid>
        </CardBody>
      </GglCard>

      <Grid columns={2} gap={16}>
        <GglCard>
          <CardHeader>Spend split · platform vs GGL</CardHeader>
          <CardBody>
            <GglTable
              headers={["Payee", "Amount", "Share", "What it buys"]}
              columnAlign={["left", "right", "right", "left"]}
              rows={[
                [
                  "Google + LSA (platform)",
                  formatUsd(platformSpend),
                  `${platformShare}%`,
                  "Paid impressions, calls, LSA inbox",
                ],
                ["GGL retainer", formatUsd(ROI_MODEL.retainerMonthly), "—", "CRM, ads stewardship, reporting"],
                [
                  "GGL performance bonus (est.)",
                  formatUsd(ROI_MODEL.bonusMonthlyEst),
                  "—",
                  "KPI tiers P1–P6 · not % of legal fees",
                ],
                ["Total marketing", formatUsd(totalMarketing), "100%", "Platform + agency"],
              ]}
            />
            <MutedText style={{ marginTop: 10 }}>
              Retainer/bonus = placeholders until SOW §3.1 filled · pass-through ad spend bills separately on
              platform invoices
            </MutedText>
          </CardBody>
        </GglCard>
        <GglCard>
          <CardHeader>Formula chain</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small">
                <Text weight="semibold">1.</Text> Platform spend = target leads × platform CPL (
                {formatUsd(ROI_MODEL.platformCpl)})
              </Text>
              <Text size="small">
                <Text weight="semibold">2.</Text> Agency spend = retainer + est. bonus = {formatUsd(agencySpend)}/mo
              </Text>
              <Text size="small">
                <Text weight="semibold">3.</Text> Cases = leads × {(ROI_MODEL.leadToCaseRate * 100).toFixed(1)}% (
                MyCase new matters)
              </Text>
              <Text size="small">
                <Text weight="semibold">4.</Text> Revenue = cases × {formatUsd(ROI_MODEL.avgCaseFee)} avg fee (#29
                blend)
              </Text>
              <Text size="small">
                <Text weight="semibold">5.</Text> Marketing ROI = (revenue − total marketing) ÷ total marketing ={" "}
                <Text weight="semibold" style={{ color: projectedRoi >= 0 ? GGL.green : GGL.red }}>
                  {projectedRoi}%
                </Text>
              </Text>
              <Text size="small">
                <Text weight="semibold">6.</Text> Revenue per $1 invested = $
                {(projectedRevenue / totalMarketing).toFixed(2)}
              </Text>
            </Stack>
          </CardBody>
        </GglCard>
      </Grid>
    </Stack>
  );
}

function RoiComparisonTable() {
  const prior = periodMetrics(ROI_MODEL.prior);
  const current = periodMetrics(ROI_MODEL.current);
  const delta = (now: number, was: number) => {
    if (was === 0) {
      return "—";
    }
    const pct = ((now - was) / was) * 100;
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(0)}%`;
  };

  return (
    <GglCard>
      <CardHeader trailing={<Pill size="sm">Hire vs prior</Pill>}>ROI · GGL stewardship vs platform-only baseline</CardHeader>
      <CardBody>
        <GglTable
          headers={["Metric", ROI_MODEL.prior.period, ROI_MODEL.current.period, "Δ"]}
          columnAlign={["left", "right", "right", "right"]}
          rows={[
            ["Context", ROI_MODEL.prior.context, ROI_MODEL.current.context, "—"],
            ["Platform spend", formatUsd(ROI_MODEL.prior.platformSpend), formatUsd(ROI_MODEL.current.platformSpend), delta(ROI_MODEL.current.platformSpend, ROI_MODEL.prior.platformSpend)],
            ["GGL (retainer + bonus)", formatUsd(ROI_MODEL.prior.agencySpend), formatUsd(ROI_MODEL.current.agencySpend), "—"],
            ["Total marketing", formatUsd(prior.totalInvested), formatUsd(current.totalInvested), delta(current.totalInvested, prior.totalInvested)],
            ["Leads (#01)", String(ROI_MODEL.prior.leads), String(ROI_MODEL.current.leads), delta(ROI_MODEL.current.leads, ROI_MODEL.prior.leads)],
            ["All-in cost / lead", formatUsd(prior.allInCpl), formatUsd(current.allInCpl), delta(current.allInCpl, prior.allInCpl)],
            ["New cases (#02)", String(ROI_MODEL.prior.cases), String(ROI_MODEL.current.cases), delta(ROI_MODEL.current.cases, ROI_MODEL.prior.cases)],
            ["Cost / new case", formatUsd(prior.costPerCase), formatUsd(current.costPerCase), delta(current.costPerCase, prior.costPerCase)],
            ["Est. case revenue", formatUsd(prior.revenue, true), formatUsd(current.revenue, true), delta(current.revenue, prior.revenue)],
            ["Marketing ROI", `${prior.marketingRoi}%`, `${current.marketingRoi}%`, `${current.marketingRoi - prior.marketingRoi}pp`],
            ["Revenue per $1 spent", `$${prior.revenuePerDollar.toFixed(2)}`, `$${current.revenuePerDollar.toFixed(2)}`, delta(current.revenuePerDollar * 100, prior.revenuePerDollar * 100)],
          ]}
        />
        <MutedText style={{ marginTop: 10 }}>
          Prior = May platform-only · Current = June with GGL retainer. Compare like periods once 90-day baseline locks.
          Case revenue = new matters × avg fee — not collected cash or legal outcomes.
        </MutedText>
      </CardBody>
    </GglCard>
  );
}

function FunnelStage({
  label,
  value,
  sub,
  widthPct,
}: {
  label: string;
  value: string;
  sub: string;
  widthPct: number;
}) {
  return (
    <Stack gap={4}>
      <Row justify="space-between" align="center">
        <Text weight="semibold" size="small">
          {label}
        </Text>
        <Text weight="semibold">{value}</Text>
      </Row>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: GGL.creamPanel,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${widthPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${GGL.royal} 0%, ${GGL.gold} 100%)`,
            borderRadius: 999,
          }}
        />
      </div>
      <MutedText>{sub}</MutedText>
    </Stack>
  );
}

function FullCycleTracker() {
  const period = ROI_MODEL.current;
  const totalIn = period.platformSpend + period.agencySpend;
  const revenue = period.cases * ROI_MODEL.avgCaseFee;
  const leadWidth = 100;
  const consultWidth = (period.consults / period.leads) * 100;
  const caseWidth = (period.cases / period.leads) * 100;
  const revenueWidth = Math.min(100, (revenue / totalIn) * 8);

  return (
    <Stack gap={12}>
      <GglCard>
        <CardHeader trailing={<Pill size="sm">{period.period}</Pill>}>Full cycle · dollars in → dollars out</CardHeader>
        <CardBody>
          <Grid columns={2} gap={16}>
            <Stack gap={14}>
              <FunnelStage
                label="1 · Marketing $ in"
                value={formatUsd(totalIn)}
                sub={`Platform ${formatUsd(period.platformSpend)} + GGL ${formatUsd(period.agencySpend)}`}
                widthPct={100}
              />
              <FunnelStage
                label="2 · Leads (#01)"
                value={String(period.leads)}
                sub={`All-in CPL ${formatUsd(totalIn / period.leads)} · platform CPL ${formatUsd(ROI_MODEL.platformCpl)}`}
                widthPct={leadWidth}
              />
              <FunnelStage
                label="3 · Consults booked"
                value={String(period.consults)}
                sub={`${((period.consults / period.leads) * 100).toFixed(0)}% of leads → consult`}
                widthPct={consultWidth}
              />
              <FunnelStage
                label="4 · New cases (#02)"
                value={String(period.cases)}
                sub={`${((period.cases / period.leads) * 100).toFixed(1)}% lead→case · ${((period.cases / period.consults) * 100).toFixed(0)}% consult→retained`}
                widthPct={caseWidth}
              />
              <FunnelStage
                label="5 · Case revenue (est.)"
                value={formatUsd(revenue, true)}
                sub={`${period.cases} cases × ${formatUsd(ROI_MODEL.avgCaseFee)} avg · KPI #28/#29 feed`}
                widthPct={revenueWidth}
              />
            </Stack>
            <Stack gap={12}>
              <GglTable
                headers={["Stage conversion", "Rate", "Source"]}
                columnAlign={["left", "right", "left"]}
                rows={[
                  ["Lead → consult", `${((period.consults / period.leads) * 100).toFixed(0)}%`, "HubSpot meetings"],
                  ["Consult → retained", `${((period.cases / period.consults) * 100).toFixed(0)}%`, "MyCase + Romina (#05)"],
                  ["Lead → case", `${((period.cases / period.leads) * 100).toFixed(1)}%`, "End-to-end yield"],
                  ["Marketing ROI", `${roiPct(revenue, totalIn)}%`, "(revenue − all-in) ÷ all-in"],
                  ["Payback ratio", `${(revenue / totalIn).toFixed(2)}×`, "Case revenue ÷ marketing $"],
                ]}
              />
              <ChartFrame title="Marketing in vs case revenue" caption="May · Jun · Target">
                <LineChart
                  categories={["May", "Jun", "Target"]}
                  series={[
                    { name: "Marketing $ in", data: [5861, 18256, 18256], tone: "info" },
                    { name: "Case revenue (est.)", data: [57600, 43200, 52800], tone: "success" },
                  ]}
                  height={180}
                  style={CHART_STYLE}
                />
              </ChartFrame>
              <MutedText>
                Build wires MyCase fees collected (cash) as stage 6 when QB export lands · separates signed revenue from
                collected revenue
              </MutedText>
            </Stack>
          </Grid>
        </CardBody>
      </GglCard>
    </Stack>
  );
}

function halfMoonPoint(cx: number, cy: number, r: number, progress: number) {
  const angle = Math.PI * (1 - progress);
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

function halfMoonPath(cx: number, cy: number, r: number, progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const steps = Math.max(2, Math.ceil(40 * clamped));
  const points = Array.from({ length: steps + 1 }, (_, index) =>
    halfMoonPoint(cx, cy, r, (clamped * index) / steps),
  );
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function halfMoonFillPath(cx: number, cy: number, r: number, progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const left = halfMoonPoint(cx, cy, r, 0);
  const right = halfMoonPoint(cx, cy, r, 1);
  if (clamped <= 0) {
    return "";
  }
  if (clamped >= 1) {
    const arc = halfMoonPath(cx, cy, r, 1);
    return `${arc} L ${right.x} ${cy} L ${left.x} ${cy} Z`;
  }
  const end = halfMoonPoint(cx, cy, r, clamped);
  const arc = halfMoonPath(cx, cy, r, clamped);
  return `${arc} L ${end.x} ${cy} L ${left.x} ${cy} Z`;
}

/** Gold half-moon at 100% target (no egg) */
const GOLD_GAUGE = { pale: "#fde68a", mid: "#c9a86c", dark: "#b8860b" };

function GilbertGoldFillGauge({
  cx,
  cy,
  r,
  startLabel,
  endLabel,
  clipId,
}: {
  cx: number;
  cy: number;
  r: number;
  startLabel: string;
  endLabel: string;
  clipId: string;
}) {
  const left = halfMoonPoint(cx, cy, r, 0);
  const right = halfMoonPoint(cx, cy, r, 1);
  const labelY = cy + 26;
  const fillPath = halfMoonFillPath(cx, cy, r, 1);
  const gradId = `${clipId}-gold`;

  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GOLD_GAUGE.pale} />
          <stop offset="45%" stopColor={GOLD_GAUGE.mid} />
          <stop offset="100%" stopColor={GOLD_GAUGE.dark} />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} />
      <path
        d={halfMoonPath(cx, cy, r, 1)}
        fill="none"
        stroke={GOLD_GAUGE.dark}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.55}
      />
      <line x1={left.x} y1={cy} x2={right.x} y2={cy} stroke={GGL.royalBorder} strokeWidth={2} strokeLinecap="round" />
      <text x={left.x} y={labelY} textAnchor="middle" fill={GGL.goldDark} fontSize={11} fontWeight={700}>
        {startLabel}
      </text>
      <text x={right.x} y={labelY} textAnchor="middle" fill={GGL.goldDark} fontSize={11} fontWeight={700}>
        {endLabel}
      </text>
    </>
  );
}

function HalfMoonGauge({
  progress,
  startLabel,
  endLabel,
  celebrate,
}: {
  progress: number;
  startLabel: string;
  endLabel: string;
  celebrate?: boolean;
}) {
  const w = 188;
  const h = 112;
  const cx = w / 2;
  const cy = 72;
  const r = 68;
  const clamped = Math.max(0, Math.min(100, progress));
  const left = halfMoonPoint(cx, cy, r, 0);
  const right = halfMoonPoint(cx, cy, r, 1);
  const labelY = cy + 26;
  const gradId = `gauge-${startLabel}-${endLabel}`.replace(/[^a-z0-9]/gi, "");
  const fillGradId = `${gradId}-fill`;
  const celebrateClipId = `${gradId}-gilbert-gold`;

  if (celebrate) {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ display: "block", margin: "0 auto" }}>
        <GilbertGoldFillGauge
          cx={cx}
          cy={cy}
          r={r}
          startLabel={startLabel}
          endLabel={endLabel}
          clipId={celebrateClipId}
        />
      </svg>
    );
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id={fillGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="40%" stopColor="#c9a86c" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <line x1={left.x} y1={cy} x2={right.x} y2={cy} stroke={GGL.royalBorder} strokeWidth={2} strokeLinecap="round" />
      <path
        d={halfMoonPath(cx, cy, r, 1)}
        fill="none"
        stroke={GGL.creamPanel}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {clamped > 0 ? (
        <path
          d={halfMoonFillPath(cx, cy, r, clamped / 100)}
          fill={`url(#${fillGradId})`}
          stroke="none"
        />
      ) : null}
      <path
        d={halfMoonPath(cx, cy, r, 1)}
        fill="none"
        stroke={GGL.royalBorder}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <text x={left.x} y={labelY} textAnchor="middle" fill={GGL.brownMuted} fontSize={11}>
        {startLabel}
      </text>
      <text x={right.x} y={labelY} textAnchor="middle" fill={GGL.brownMuted} fontSize={11}>
        {endLabel}
      </text>
    </svg>
  );
}

function MomChange({ pct, favorable }: { pct: number; favorable: boolean }) {
  const up = pct > 0;
  const isDown = pct < 0;
  const color = isDown ? GGL.red : favorable ? GGL.green : GGL.brownMuted;
  const arrow = up ? "↑" : pct < 0 ? "↓" : "→";
  const signed = pct > 0 ? `+${pct}%` : `${pct}%`;
  return (
    <Text style={{ color, fontSize: 12, fontWeight: 600 }}>
      {arrow} {signed} MoM
    </Text>
  );
}

function GooseIcon({ tipId }: { tipId: string }) {
  const [active, setActive] = useCanvasState<string | null>("goose-tip", null);
  const open = active === tipId;
  return (
    <Stack gap={6}>
      <IconButton
        title="Guide note"
        onClick={() => setActive(open ? null : tipId)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: `1px solid ${GGL.royalBorder}`,
          background: open ? GGL.royalDim : GGL.paper,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1.5c2 2.5 3.5 4 3.5 6a3.5 3.5 0 1 1-7 0c0-2 1.5-3.5 3.5-6z" fill={GGL.goldDark} />
          <circle cx={8} cy={11} r={1.2} fill={GGL.royal} />
        </svg>
      </IconButton>
      {open && HIGHLIGHT_NOTES[tipId] ? (
        <GglCard>
          <CardBody>
            <Text size="small">{HIGHLIGHT_NOTES[tipId]}</Text>
          </CardBody>
        </GglCard>
      ) : null}
    </Stack>
  );
}

function SectionBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: any;
}) {
  return (
    <GglCard>
      <CardHeader>
        <Stack gap={4}>
          <Text style={{ margin: 0, fontSize: 22, fontWeight: 700, color: GGL.royal }}>{title}</Text>
          <MutedText>{subtitle}</MutedText>
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack gap={12}>{children}</Stack>
      </CardBody>
    </GglCard>
  );
}

function MissedRevenueCard() {
  return (
    <GglCard style={{ borderLeft: `4px solid ${GGL.red}` }}>
      <CardBody>
        <Row gap={10} align="start" wrap>
          <DataStatusIcon kpiKey="19" title="Est. missed revenue" />
          <Stack gap={4} style={{ flex: 1, minWidth: 180 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: GGL.red, letterSpacing: "0.06em" }}>
              #19 · REQUIRES ACTION
            </Text>
            <Text style={{ fontSize: 18, fontWeight: 700, color: GGL.brown }}>Est. missed revenue</Text>
            <MutedText>Missed calls × close rate × avg case value</MutedText>
          </Stack>
          <Stack gap={4} style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 28, fontWeight: 700, color: GGL.red, lineHeight: 1 }}>$4,200/mo</Text>
            <MutedText>target $0</MutedText>
          </Stack>
        </Row>
      </CardBody>
    </GglCard>
  );
}

function CasesPerVerticalTracker() {
  return (
    <GglCard>
      <CardBody>
        <Row gap={8} align="center" style={{ marginBottom: 10 }}>
          <DataStatusIcon kpiKey="cases-vertical" title="Cases per vertical" />
          <Text weight="semibold" style={{ color: GGL.royal, fontSize: 14 }}>
            Cases per vertical · YTD
          </Text>
        </Row>
        <GglTable
          headers={["Vertical", "June", "YTD"]}
          columnAlign={["left", "right", "right"]}
          rows={CASES_BY_VERTICAL.map((row) => [row.vertical, String(row.month), String(row.ytd)])}
          striped={false}
        />
        <MutedText style={{ marginTop: 8, display: "block" }}>MyCase export · feeds #29</MutedText>
      </CardBody>
    </GglCard>
  );
}

function TeamGoalGauge({
  id,
  label,
  actual,
  target,
  gaugePct,
  periodLabel,
}: {
  id: string;
  label: string;
  actual: number;
  target: number;
  gaugePct: number;
  periodLabel: string;
}) {
  const celebrate = gaugePct >= 100;
  return (
    <GglCard>
      <CardBody>
        <Row gap={8} align="center" style={{ marginBottom: 6 }}>
          <DataStatusIcon kpiKey={id} title={label} />
          <Text style={{ fontSize: 11, color: GGL.brownMuted }}>
            Team goal · {periodLabel}
          </Text>
        </Row>
        <HalfMoonGauge progress={gaugePct} startLabel="0" endLabel={String(target)} celebrate={celebrate} />
        <Text
          style={{
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: GGL.royal,
            marginTop: 4,
            lineHeight: 1.1,
          }}
        >
          {actual} / {target}
        </Text>
        <Text style={{ textAlign: "center", fontSize: 12, color: GGL.brownMuted, marginTop: 6 }}>{label}</Text>
      </CardBody>
    </GglCard>
  );
}

function CockpitGauge({
  id,
  label,
  actual,
  target,
  gaugePct,
  momPct,
  momFavorable,
}: {
  id: string;
  label: string;
  actual: number;
  target: number;
  gaugePct: number;
  momPct: number;
  momFavorable: boolean;
}) {
  const celebrate = gaugePct >= 100;
  return (
    <GglCard>
      <CardBody>
        <Row gap={8} align="center" style={{ marginBottom: 6 }}>
          <DataStatusIcon kpiKey={id} title={label} />
          <Text style={{ fontSize: 11, color: GGL.brownMuted }}>
            #{id} {label}
          </Text>
        </Row>
        <HalfMoonGauge progress={gaugePct} startLabel="0" endLabel={String(target)} celebrate={celebrate} />
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
            color: GGL.royal,
            marginTop: 4,
            lineHeight: 1.1,
          }}
        >
          {actual} / {target}
        </Text>
        {celebrate ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              color: GGL.goldDark,
              marginTop: 4,
              letterSpacing: "0.04em",
            }}
          >
            Target reached
          </Text>
        ) : null}
        <Stack gap={4} style={{ marginTop: 8 }}>
          <MomChange pct={momPct} favorable={momFavorable} />
        </Stack>
      </CardBody>
    </GglCard>
  );
}

function PillarScoresExpansion() {
  return (
    <CollapsibleSection title="Pillar scores" count={5} style={{ color: GGL.brown }}>
      <Stack gap={10} style={{ paddingTop: 8 }}>
        {BUSINESS_HEALTH.pillars.map((pillar) => (
          <Row justify="space-between" align="center">
            <Text style={{ color: GGL.brown }}>{pillar.name}</Text>
            <ScorePill score={pillar.score} />
          </Row>
        ))}
      </Stack>
    </CollapsibleSection>
  );
}

function MetricChip({
  id,
  label,
  value,
  target,
  trendingDown,
}: {
  id: string;
  label: string;
  value: string;
  target: string;
  trendingDown?: boolean;
}) {
  const valueColor = trendingDown ? GGL.red : GGL.royal;
  return (
    <GglCard>
      <CardBody>
        <Row gap={8} align="center">
          <DataStatusIcon kpiKey={id} title={label} />
          <Text style={{ fontSize: 11, color: GGL.brownMuted }}>
            #{id} {label}
          </Text>
        </Row>
        <Text style={{ fontSize: 26, fontWeight: 700, color: valueColor, marginTop: 4 }}>
          {value}
        </Text>
        <MutedText style={{ marginTop: 4, display: "block" }}>target {target}</MutedText>
      </CardBody>
    </GglCard>
  );
}

function PhoneAnswerStat({
  answered,
  missed,
  momPct,
}: {
  answered: number;
  missed: number;
  momPct: number;
}) {
  const onTrack = answered >= 90;
  const valueColor = onTrack ? GGL.green : GGL.royal;
  return (
    <GglCard>
      <CardBody>
        <Row justify="space-between" align="start" wrap>
          <Stack gap={4}>
            <Row gap={8} align="center">
              <DataStatusIcon kpiKey="21" title="Answered phones" />
              <Text style={{ fontSize: 11, color: GGL.brownMuted }}>#21 Answered phones</Text>
            </Row>
            <Text style={{ fontSize: 42, fontWeight: 700, color: valueColor, lineHeight: 1 }}>
              {answered}%
            </Text>
            <MutedText>
              {missed}% missed · target ≥ 90% answered
            </MutedText>
            <MomChange pct={momPct} favorable />
          </Stack>
          <Stack gap={6}>
            <Pill size="sm" active={onTrack}>
              {onTrack ? "On track" : "Below target"}
            </Pill>
            <MutedText>All Search call extensions</MutedText>
          </Stack>
        </Row>
      </CardBody>
    </GglCard>
  );
}

function StatusPill({ onTrack }: { onTrack: boolean }) {
  return (
    <Pill size="sm" active={onTrack}>
      {onTrack ? "On track" : "Watch"}
    </Pill>
  );
}

export default function PavLawKpiWireframe() {
  return (
    <Stack
      gap={24}
      style={{
        padding: 20,
        maxWidth: 1100,
        background: GGL.cream,
        color: GGL.brown,
        minHeight: "100%",
      }}
    >
      <Row justify="space-between" align="start" wrap>
        <Stack gap={4}>
          <H1 style={{ margin: 0, color: GGL.royal }}>Pav Law — KPI Report</H1>
          <Text style={{ color: GGL.brownMuted }}>
            {PERIOD} · {SOURCE}
          </Text>
        </Stack>
        <Pill active>Layout approval</Pill>
      </Row>

      <GglCard>
        <CardHeader trailing={<Pill size="sm" active>4 open</Pill>}>Action items</CardHeader>
        <CardBody>
          <TodoListCard todos={ACTION_ITEMS} defaultExpanded />
        </CardBody>
      </GglCard>

      <SectionBlock
        title="Monthly Cockpit"
        subtitle="0 → target · gold fill at 100%"
      >
        <Grid columns={3} gap={12}>
          <MissedRevenueCard />
          <CasesPerVerticalTracker />
          <TeamGoalGauge
            id="dui-annual"
            label="50 DUI cases · calendar year"
            actual={DUI_YTD}
            target={DUI_ANNUAL_GOAL}
            gaugePct={Math.round((DUI_YTD / DUI_ANNUAL_GOAL) * 100)}
            periodLabel="2026 YTD"
          />
        </Grid>
        <Grid columns={2} gap={12}>
          <CockpitGauge
            id="01"
            label="Total leads"
            actual={124}
            target={110}
            gaugePct={100}
            momPct={18}
            momFavorable
          />
          <CockpitGauge
            id="02"
            label="New cases"
            actual={9}
            target={12}
            gaugePct={75}
            momPct={-25}
            momFavorable={false}
          />
        </Grid>
      </SectionBlock>

      <SectionBlock
        title="Business Health & Case Pipeline"
        subtitle="Firm pulse · revenue yield · MyCase throughput — problem log stays backend-only"
      >
        <GglCard>
          <CardHeader
            trailing={
              <Row gap={8} align="center">
                <DataStatusIcon kpiKey="bhi" title="Business health index" />
                <Pill size="sm">BHI · Watch</Pill>
              </Row>
            }
          >
            Business health index
          </CardHeader>
          <CardBody>
            <HalfMoonGauge progress={BUSINESS_HEALTH.index} startLabel="0" endLabel="100" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 36,
                fontWeight: 700,
                color: GGL.royal,
                marginTop: 4,
              }}
            >
              {BUSINESS_HEALTH.index} / 100
            </Text>
            <MutedText style={{ textAlign: "center", marginTop: 4, display: "block" }}>
              Composite score · not a percentage
            </MutedText>
            <MomChange pct={BUSINESS_HEALTH.mom} favorable={false} />
            <Divider />
            <PillarScoresExpansion />
          </CardBody>
        </GglCard>

        <Grid columns={4} gap={12}>
          <MetricChip id="12" label="Cost/call" value="$41" target="< $100" />
          <MetricChip id="28" label="Revenue per lead" value="$3,870" target="Q2 review" />
          <MetricChip id="15" label="CPL" value="$142" target="≤ $120" />
          <MetricChip id="22" label="Speed to task" value="8 min" target="< 5 min" />
        </Grid>

        <GglCard>
          <CardHeader trailing={<DataStatusIcon kpiKey="29" title="Revenue per case type" />}>
            #29 Revenue per case type
          </CardHeader>
          <CardBody>
            <GglTable
              headers={["Case type", "Avg fee", "Cases Q2"]}
              columnAlign={["left", "right", "right"]}
              rows={[
                ["DUI/DWAI", "$4,800", "4"],
                ["Military", "$6,200", "2"],
                ["Traffic", "$2,100", "2"],
                ["DV", "$8,500", "1"],
              ]}
            />
          </CardBody>
        </GglCard>

        <GglCard>
          <CardHeader>Case pipeline</CardHeader>
          <CardBody>
            <Grid columns={3} gap={12}>
              <GglStat value="38" label="#03 Active cases" />
              <GglStat value="47 days" label="Avg case closed time" />
              <GglStat value="51%" label="#05 Consult → retained" />
            </Grid>
            <Grid columns={2} gap={16} style={{ marginTop: 16 }}>
              <ChartPanel
                kpiKey="04"
                title="#04 Closed cases"
                caption="Monthly count"
                momPct={38}
                momFavorable
                tableHeaders={["Month", "Closed", "Δ MoM", "Revenue est."]}
                columnAlign={["left", "right", "right", "right"]}
                tableRows={[
                  ["April", "6", "—", "$28.8k"],
                  ["May", "8", <DeltaText value="+33%" />, "$38.4k"],
                  ["June", "11", <DeltaText value="+38%" />, "$52.8k"],
                ]}
              >
                <LineChart
                  categories={["Apr", "May", "Jun"]}
                  series={[{ name: "Closed", data: [6, 8, 11], tone: "success" }]}
                  height={160}
                  showValues
                  style={CHART_STYLE}
                />
              </ChartPanel>
              <ChartPanel
                kpiKey="05"
                title="#05 Consult → retained trend"
                caption="Monthly rate"
                momPct={6}
                momFavorable
                tableHeaders={["Month", "Rate", "Consults", "Retained"]}
                columnAlign={["left", "right", "right", "right"]}
                tableRows={[
                  ["April", "42%", "19", "8"],
                  ["May", "48%", "21", "10"],
                  ["June", "51%", "27", "14"],
                ]}
              >
                <LineChart
                  categories={["Apr", "May", "Jun"]}
                  series={[{ name: "Rate", data: [42, 48, 51], tone: "info" }]}
                  valueSuffix="%"
                  height={160}
                  showValues
                  style={CHART_STYLE}
                />
              </ChartPanel>
            </Grid>
          </CardBody>
        </GglCard>
      </SectionBlock>

      <SectionBlock
        title="Lead Channel Expansion"
        subtitle="Where demand comes from · chart + expanded metrics table per KPI"
      >
        <Row gap={12} align="start">
          <GooseIcon tipId="highlight-lsa" />
          <GooseIcon tipId="highlight-search" />
        </Row>

        <ChartPanel
          kpiKey="01"
          title="#01 Total leads by channel"
          caption="Stacked monthly · HubSpot · LSA · Search"
          momPct={18}
          momFavorable
          tableHeaders={["Channel", "Count", "Δ MoM", "Unit cost", "Spend"]}
          columnAlign={["left", "right", "right", "right", "right"]}
          tableRows={LEAD_CHANNEL_ROWS_GGL}
        >
          <BarChart
            categories={["Apr", "May", "Jun"]}
            series={[
              { name: "HubSpot", data: [18, 24, 29], tone: "success" },
              { name: "LSA", data: [22, 38, 41], tone: "info" },
              { name: "Search", data: [28, 31, 54], tone: "neutral" },
            ]}
            stacked
            height={180}
            style={CHART_STYLE}
          />
        </ChartPanel>

        <Grid columns={2} gap={16}>
          <ChartPanel
            kpiKey="10"
            title="#10 Source mix"
            caption="Share of June leads"
            momPct={12}
            momFavorable
            tableHeaders={["Source", "Count", "Δ MoM", "Unit cost", "Spend"]}
            columnAlign={["left", "right", "right", "right", "right"]}
            tableRows={SOURCE_MIX_ROWS_GGL}
          >
            <PieChart
              data={[
                { label: "Paid Search", value: 44, tone: "success" },
                { label: "LSA", value: 33, tone: "info" },
                { label: "Direct", value: 14, tone: "neutral" },
                { label: "Referral", value: 9, tone: "warning" },
              ]}
              donut
              size={200}
              style={CHART_STYLE}
            />
          </ChartPanel>
          <ChartPanel
            kpiKey="08"
            title="#08 Search calls by campaign"
            caption="June call volume"
            momPct={74}
            momFavorable
            tableHeaders={["Campaign", "Calls", "Cost/call", "Spend"]}
            columnAlign={["left", "right", "right", "right"]}
            tableRows={[
              ["Military", "36", "$41", "$1,476"],
              ["NTGUILT", "4", "$118", "$472"],
              ["Core DV", "14", "$18", "$252"],
            ]}
          >
            <BarChart
              categories={["Military", "NTGUILT", "Core DV"]}
              series={[{ name: "Calls", data: [36, 4, 14], tone: "success" }]}
              height={180}
              showValues
              style={CHART_STYLE}
            />
          </ChartPanel>
        </Grid>
      </SectionBlock>

      <SectionBlock title="Marketing Spend Efficiency" subtitle="Cost per outcome · referral momentum">
        <Grid columns={2} gap={16}>
          <GglCard>
            <CardHeader trailing={<DataStatusIcon kpiKey="12" title="Cost per call" />}>Cost per call</CardHeader>
            <CardBody>
              <GglTable
                headers={["Channel", "Cost/call", "Volume"]}
                columnAlign={["left", "right", "right"]}
                rows={[
                  ["Military", "$41", "36 calls"],
                  ["NTGUILT", "$118", "4 calls"],
                  ["LSA", "$312/lead", "41 leads"],
                ]}
              />
            </CardBody>
          </GglCard>
          <GglCard>
            <CardHeader trailing={<DataStatusIcon kpiKey="17" title="Referral count by platform" />}>
              Referral count by platform
            </CardHeader>
            <CardBody>
              <GglTable
                headers={["Platform", "Count", "Δ MoM"]}
                columnAlign={["left", "right", "right"]}
                rowTone={["danger", "success", undefined, "success"]}
                rows={[
                  ["Google Business", "42", <DeltaText value="−3" />],
                  ["Yelp", "18", <DeltaText value="+2" />],
                  ["Facebook", "11", "0"],
                  ["Avvo", "6", <DeltaText value="+1" />],
                ]}
              />
            </CardBody>
          </GglCard>
        </Grid>
      </SectionBlock>

      <SectionBlock
        title="Marketing Investment Model"
        subtitle="Input budget → projected leads → case revenue · split platform spend vs GGL fees · compare ROI to prior period"
      >
        <MarketingInvestmentModel />
        <RoiComparisonTable />
      </SectionBlock>

      <SectionBlock
        title="Full Funnel Cycle"
        subtitle="Track dollars in through leads, consults, cases, and estimated revenue out — monthly actuals + trend"
      >
        <FullCycleTracker />
      </SectionBlock>

      <SectionBlock title="Sales Intake Performance" subtitle="Phone answer rate · team execution · chart + expanded table">
        <PhoneAnswerStat answered={69} missed={31} momPct={2} />
        <ChartPanel
          kpiKey="21"
          title="#21 Answered phones trend"
          caption="Target line 90%"
          momPct={2}
          momFavorable
          tableHeaders={["Period", "Answered %", "Missed %", "Total calls"]}
          columnAlign={["left", "right", "right", "right"]}
          tableRows={[
            ["May 2026", "67%", "33%", "142"],
            ["June 2026", "69%", "31%", "158"],
            ["July WTD", "72%", "28%", "41"],
          ]}
        >
          <LineChart
            categories={["May", "Jun", "Jul WTD"]}
            series={[{ name: "Answered %", data: [67, 69, 72], tone: "success" }]}
            valueSuffix="%"
            showValues
            referenceLines={[{ value: 90, label: "Target 90%", tone: "success" }]}
            height={180}
            style={CHART_STYLE}
          />
        </ChartPanel>
        <GglCard>
          <CardHeader trailing={<DataStatusIcon kpiKey="20" title="Team metrics" />}>Team metrics · #20–#27</CardHeader>
          <CardBody>
            <GglTable
              headers={["#", "KPI", "June", "Target", "Δ MoM", "Status"]}
              columnAlign={["left", "left", "right", "right", "right", "right"]}
              rows={[
                ["20", "Inbound meetings", "14", "18/mo", <DeltaText value="+2" />, <StatusPill onTrack={false} />],
                ["23", "After-hours callback", "82%", "100% by 10am", <DeltaText value="+4pp" />, <StatusPill onTrack={false} />],
                ["24", "Outbound dials", "86/wk", "100/wk", <DeltaText value="−4" />, <StatusPill onTrack={false} />],
                ["25", "Connect rate", "17%", "≥ 15%", <DeltaText value="+1pp" />, <StatusPill onTrack />],
                ["26", "Follow-up ≤3h", "92%", "100%", <DeltaText value="+3pp" />, <StatusPill onTrack={false} />],
                ["27", "CRM hygiene flags", "3/wk", "< 5/wk", "0", <StatusPill onTrack />],
              ]}
            />
          </CardBody>
        </GglCard>
      </SectionBlock>

      <GglCard>
        <CardBody>
          <Row gap={16} align="center" wrap>
            <Row gap={6} align="center">
              <DataStatusIcon kpiKey="01" title="Data on file" />
              <MutedText>Gold star = export on file (Ad Reports/exports)</MutedText>
            </Row>
            <Row gap={6} align="center">
              <DataStatusIcon kpiKey="02" title="Awaiting source" />
              <MutedText>Waldo = source not wired yet</MutedText>
            </Row>
          </Row>
          <MutedText style={{ marginTop: 10, display: "block" }}>
            BHI problem log = backend only (not shown). Goose icon placements TBD by Kate. Build loads notes from
            GILBERT-NOTES.md.
          </MutedText>
        </CardBody>
      </GglCard>
    </Stack>
  );
}

const ACTION_ITEMS = [
  {
    id: "a1",
    content: "Answered phones 69% — assign Casey phone block Wed AM; Romina backup Thu (KPI 21)",
    status: "pending" as const,
  },
  {
    id: "a2",
    content: "Est. missed revenue $4,200/mo — review Search routing + after-hours callback (KPI 19, 23)",
    status: "pending" as const,
  },
  {
    id: "a3",
    content: "CPL $142 over target — pause Core DV bleed; negative keyword sweep (KPI 15)",
    status: "in_progress" as const,
  },
  {
    id: "a4",
    content: "GBP referrals −3 MoM — refresh profile + UTM pass (KPI 17)",
    status: "pending" as const,
  },
];
