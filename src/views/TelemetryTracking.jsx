import { useState, useEffect } from "react";
import {
  Activity, TrendingDown, TrendingUp, AlertOctagon, ShieldCheck,
  FileText, RefreshCw, ChevronRight, Clock, User, Server, AlertTriangle,
  Play, Pause, Download, BarChart2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { MOCK_KPI } from "../data/mockData";
import EventDetailModal from "../components/EventDetailModal";

const SEVERITY_BADGE = {
  INFO: "text-sky-700 bg-sky-100 border-sky-300 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
  WARN: "text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
  CRITICAL: "text-red-700 bg-red-100 border-red-300 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20",
  SUCCESS: "text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
};

const generateSparkData = (base, variance, points = 12) =>
  Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.max(0, +(base + (Math.random() - 0.5) * variance).toFixed(1)),
  }));

const KPI_SPARK = {
  mttr_triage: generateSparkData(4.5, 2),
  mttr_contain: generateSparkData(18, 5),
  active_incidents: generateSparkData(3, 2),
  playbooks_run: generateSparkData(45, 15),
  automation_rate: generateSparkData(84, 5),
  sop_compliance: generateSparkData(97, 1.5),
};

function KpiCard({ label, value, trend, sparkKey, onCardClick, darkMode }) {
  const isGood = trend < 0 || ((label.includes("Rate") || label.includes("Compliance")) && trend > 0);
  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const subText = darkMode ? "text-slate-400" : "text-slate-700 font-bold";

  return (
    <div
      onClick={() => onCardClick({ label, value, trend })}
      className={`rounded-2xl border ${cardBg} p-4 flex flex-col gap-1 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all group`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className={`text-xs ${subText} group-hover:text-sky-600 transition-colors`}>{label}</p>
        <span className={`flex items-center gap-0.5 text-xs font-bold ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isGood ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
          {Math.abs(trend)}{label.includes("%") || label.includes("Rate") || label.includes("Compliance") ? "%" : ""}
        </span>
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <div className="h-10 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={KPI_SPARK[sparkKey]}>
            <defs>
              <linearGradient id={`grad-${sparkKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isGood ? "#10b981" : "#f59e0b"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isGood ? "#10b981" : "#f59e0b"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={isGood ? "#10b981" : "#f59e0b"} strokeWidth={1.5} fill={`url(#grad-${sparkKey})`} isAnimationActive={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function TelemetryTracking({ auditLogs, addAuditLog, darkMode, onOpenCardDetail }) {
  const [driftDismissed, setDriftDismissed] = useState(false);
  const [remediating, setRemediating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Live telemetry controls
  const [liveUpdating, setLiveUpdating] = useState(true);
  const [timeRange, setTimeRange] = useState("24h"); // 1h | 24h | 7d | 30d
  const [showAverage, setShowAverage] = useState(false);

  function handleRemediate() {
    setRemediating(true);
    addAuditLog({
      actor: "DSGEE-ENGINE",
      action: "DRIFT_REMEDIATION",
      resource: "CrowdStrike Isolation → DSGEE sync",
      severity: "INFO",
      ocsf: "3005",
      service: "Telemetry",
      user: "System",
      status: "Completed"
    });
    setTimeout(() => { setRemediating(false); setDriftDismissed(true); }, 2000);
  }

  function exportCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Time,Severity,Actor,Action,Resource,OCSF\n" +
      auditLogs.map(l => `${l.id},${l.timestamp},${l.severity},${l.actor},${l.action},${l.resource},${l.ocsf}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dsgee_telemetry_logs_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // DYNAMIC CHART DATA & X-AXIS LABELS BASED ON SELECTED TIME RANGE
  const getChartData = (range, isAvg) => {
    if (range === "1h") {
      return [
        { label: "50m ago", triage: isAvg ? 4.2 : 5.8, contain: isAvg ? 18.1 : 22.4 },
        { label: "40m ago", triage: isAvg ? 4.2 : 5.1, contain: isAvg ? 18.1 : 19.8 },
        { label: "30m ago", triage: isAvg ? 4.2 : 4.4, contain: isAvg ? 18.1 : 17.2 },
        { label: "20m ago", triage: isAvg ? 4.2 : 3.9, contain: isAvg ? 18.1 : 15.6 },
        { label: "10m ago", triage: isAvg ? 4.2 : 4.6, contain: isAvg ? 18.1 : 18.9 },
        { label: "Now",     triage: isAvg ? 4.2 : 4.2, contain: isAvg ? 18.1 : 18.1 },
      ];
    } else if (range === "24h") {
      return [
        { label: "20h ago", triage: isAvg ? 4.2 : 6.1, contain: isAvg ? 18.1 : 23.2 },
        { label: "16h ago", triage: isAvg ? 4.2 : 5.5, contain: isAvg ? 18.1 : 20.4 },
        { label: "12h ago", triage: isAvg ? 4.2 : 4.1, contain: isAvg ? 18.1 : 16.8 },
        { label: "8h ago",  triage: isAvg ? 4.2 : 3.8, contain: isAvg ? 18.1 : 15.1 },
        { label: "4h ago",  triage: isAvg ? 4.2 : 4.5, contain: isAvg ? 18.1 : 19.3 },
        { label: "Now",     triage: isAvg ? 4.2 : 4.2, contain: isAvg ? 18.1 : 18.1 },
      ];
    } else if (range === "7d") {
      return [
        { label: "Mon",   triage: isAvg ? 4.2 : 7.2, contain: isAvg ? 18.1 : 24.8 },
        { label: "Tue",   triage: isAvg ? 4.2 : 6.4, contain: isAvg ? 18.1 : 21.5 },
        { label: "Wed",   triage: isAvg ? 4.2 : 5.1, contain: isAvg ? 18.1 : 19.2 },
        { label: "Thu",   triage: isAvg ? 4.2 : 4.3, contain: isAvg ? 18.1 : 17.0 },
        { label: "Fri",   triage: isAvg ? 4.2 : 3.9, contain: isAvg ? 18.1 : 16.1 },
        { label: "Sat",   triage: isAvg ? 4.2 : 4.8, contain: isAvg ? 18.1 : 18.5 },
        { label: "Today", triage: isAvg ? 4.2 : 4.2, contain: isAvg ? 18.1 : 18.1 },
      ];
    } else { // 30d
      return [
        { label: "Jul 01", triage: isAvg ? 4.2 : 8.5, contain: isAvg ? 18.1 : 28.1 },
        { label: "Jul 05", triage: isAvg ? 4.2 : 7.1, contain: isAvg ? 18.1 : 24.0 },
        { label: "Jul 10", triage: isAvg ? 4.2 : 6.0, contain: isAvg ? 18.1 : 21.2 },
        { label: "Jul 15", triage: isAvg ? 4.2 : 5.2, contain: isAvg ? 18.1 : 19.4 },
        { label: "Jul 20", triage: isAvg ? 4.2 : 4.5, contain: isAvg ? 18.1 : 18.5 },
        { label: "Today",  triage: isAvg ? 4.2 : 4.2, contain: isAvg ? 18.1 : 18.1 },
      ];
    }
  };

  const mttrData = getChartData(timeRange, showAverage);

  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const subText = darkMode ? "text-slate-400" : "text-slate-700 font-semibold";

  return (
    <div className="flex flex-col gap-4">
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {/* Shadow Drift Alert */}
      {!driftDismissed && (
        <div className={`rounded-2xl border p-4 flex items-center gap-4 animate-fade-in ${
          darkMode ? "border-red-500/50 bg-red-500/10 text-white" : "border-red-300 bg-red-50 text-red-950 shadow-sm"
        }`}>
          <AlertOctagon className="text-red-500 flex-shrink-0" size={22} />
          <div className="flex-1">
            <p className="text-xs font-bold text-red-800 dark:text-red-300">⚡ Process Drift Detected — Shadow Execution Alert</p>
            <p className="text-xs text-red-900 dark:text-red-300/80 mt-0.5 font-medium">
              Analyst <strong>Rajesh Sharma</strong> isolated host <span className="font-mono">SRV-PROD-DB-07</span> via CrowdStrike console, bypassing DSGEE orchestration. State mismatch detected.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleRemediate}
              disabled={remediating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow"
            >
              {remediating ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
              {remediating ? "Remediating…" : "Auto-Remediate"}
            </button>
            <button onClick={() => setDriftDismissed(true)} className="text-slate-500 hover:text-slate-800 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header Bar with Live Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"><Activity className="text-emerald-500" size={20} /></div>
          <div>
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Telemetry & Tracking</h2>
            <p className={`text-xs ${subText}`}>SOC Manager Dashboard — Real-time Observability & Incident Telemetry</p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300 shadow-sm"
          }`}>
            {["1h", "24h", "7d", "30d"].map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg transition-all ${timeRange === t ? "bg-sky-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setLiveUpdating(!liveUpdating);
              setShowAverage(!liveUpdating);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              liveUpdating
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            }`}
          >
            {liveUpdating ? <Pause size={13} /> : <Play size={13} />}
            {liveUpdating ? "Live Stream ON" : "Paused (Show Averages)"}
          </button>

          <button
            onClick={exportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm"
            }`}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(MOCK_KPI).map(([key, kpi]) => (
          <KpiCard key={key} {...kpi} sparkKey={key} onCardClick={onOpenCardDetail} darkMode={darkMode} />
        ))}
      </div>

      {/* MTTR Chart + Interactive Audit Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* MTTR Trend Chart */}
        <div className={`lg:col-span-2 rounded-2xl border p-4 ${cardBg} space-y-3`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold flex items-center gap-2">
              <BarChart2 size={16} className="text-sky-500" /> MTTR & Containment Trend ({timeRange})
            </p>
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 text-sky-500"><span className="w-2 h-0.5 bg-sky-500 inline-block" /> Triage</span>
              <span className="flex items-center gap-1 text-emerald-500"><span className="w-2 h-0.5 bg-emerald-500 inline-block" /> Contain</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mttrData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#cbd5e1"} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: darkMode ? "#94a3b8" : "#334155" }} />
              <YAxis tick={{ fontSize: 10, fill: darkMode ? "#94a3b8" : "#334155" }} />
              <Tooltip
                contentStyle={{ backgroundColor: darkMode ? "#0f172a" : "#ffffff", border: "1px solid #94a3b8", borderRadius: "12px", fontSize: "12px", color: darkMode ? "#ffffff" : "#0f172a" }}
              />
              <Line type="monotone" dataKey="triage" stroke="#0284c7" strokeWidth={2.5} dot={true} isAnimationActive={true} />
              <Line type="monotone" dataKey="contain" stroke="#059669" strokeWidth={2.5} dot={true} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Interactive Audit Log */}
        <div className={`lg:col-span-3 rounded-2xl border ${cardBg} flex flex-col overflow-hidden`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? "border-slate-800/80 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-slate-500" />
              <p className="text-xs font-bold">Interactive OCSF Audit Log</p>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-700 font-semibold"}`}>Click row for payload</span>
              {liveUpdating && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </div>
            <p className={`text-xs font-mono ${subText}`}>{auditLogs.length} events logged</p>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[220px]">
            <table className="w-full text-left text-xs">
              <thead className={`sticky top-0 ${darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-100 text-slate-700 font-bold"} border-b border-slate-200 dark:border-slate-800`}>
                <tr>
                  {["Time", "Severity", "Actor", "Action", "Resource", "OCSF"].map(h => (
                    <th key={h} className="px-3 py-2 uppercase text-[10px] tracking-wider font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
                {[...auditLogs].reverse().map((log, i) => (
                  <tr
                    key={log.id || i}
                    onClick={() => setSelectedEvent(log)}
                    className="hover:bg-sky-500/10 cursor-pointer transition-colors"
                  >
                    <td className={`px-3 py-2 font-mono text-[11px] whitespace-nowrap ${darkMode ? "text-slate-400" : "text-slate-700 font-medium"}`}>{log.timestamp}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${SEVERITY_BADGE[log.severity] || SEVERITY_BADGE.INFO}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className={`px-3 py-2 font-mono font-bold ${darkMode ? "text-slate-300" : "text-slate-900"}`}>{log.actor || log.user}</td>
                    <td className={`px-3 py-2 font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>{log.action}</td>
                    <td className={`px-3 py-2 font-mono max-w-[160px] truncate ${darkMode ? "text-slate-400" : "text-slate-700 font-semibold"}`}>{log.resource}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-500 font-semibold">{log.ocsf || "3002"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
