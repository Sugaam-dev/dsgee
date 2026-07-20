import { useState, useEffect, useRef } from "react";
import {
  Activity, TrendingDown, TrendingUp, AlertOctagon, ShieldCheck,
  FileText, RefreshCw, ChevronRight, Clock, User, Server, AlertTriangle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { MOCK_KPI } from "../data/mockData";

const SEVERITY_BADGE = {
  INFO: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  WARN: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20",
  SUCCESS: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const generateSparkData = (base, variance, points = 12) =>
  Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.max(0, base + (Math.random() - 0.5) * variance),
  }));

const KPI_SPARK = {
  mttr_triage: generateSparkData(4.5, 2),
  mttr_contain: generateSparkData(18, 5),
  active_incidents: generateSparkData(3, 2),
  playbooks_run: generateSparkData(45, 15),
  automation_rate: generateSparkData(84, 5),
  sop_compliance: generateSparkData(97, 1.5),
};

function KpiCard({ label, value, trend, sparkKey }) {
  const isGood = trend < 0 || (label.includes("Rate") || label.includes("Compliance")) && trend > 0;
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 flex flex-col gap-1 relative overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${isGood ? "text-emerald-400" : "text-red-400"}`}>
          {isGood ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
          {Math.abs(trend)}{typeof trend === "number" && label.includes("%") ? "%" : label.includes("Rate") || label.includes("Compliance") ? "%" : ""}
        </span>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <div className="h-10 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={KPI_SPARK[sparkKey]} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${sparkKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isGood ? "#10b981" : "#f59e0b"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isGood ? "#10b981" : "#f59e0b"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={isGood ? "#10b981" : "#f59e0b"} strokeWidth={1.5} fill={`url(#grad-${sparkKey})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AuditRow({ log, index }) {
  return (
    <tr className={`border-b border-slate-800/60 transition-all animate-fade-in ${index === 0 ? "bg-sky-500/5" : "hover:bg-slate-800/30"}`}>
      <td className="px-3 py-2 font-mono text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</td>
      <td className="px-3 py-2">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${SEVERITY_BADGE[log.severity] || SEVERITY_BADGE.INFO}`}>
          {log.severity}
        </span>
      </td>
      <td className="px-3 py-2 text-xs text-slate-300 font-mono">{log.actor}</td>
      <td className="px-3 py-2 text-xs font-semibold text-white">{log.action}</td>
      <td className="px-3 py-2 text-xs text-slate-400 font-mono max-w-[200px] truncate" title={log.resource}>{log.resource}</td>
      <td className="px-3 py-2 text-xs text-slate-500 font-mono">{log.ocsf || "3002"}</td>
    </tr>
  );
}

export default function TelemetryTracking({ auditLogs, addAuditLog }) {
  const [driftDismissed, setDriftDismissed] = useState(false);
  const [remediating, setRemediating] = useState(false);

  function handleRemediate() {
    setRemediating(true);
    addAuditLog({ actor: "DSGEE-ENGINE", action: "DRIFT_REMEDIATION", resource: "CrowdStrike Isolation → DSGEE sync", severity: "INFO", ocsf: "3005" });
    setTimeout(() => { setRemediating(false); setDriftDismissed(true); }, 2000);
  }

  const mttrData = Array.from({ length: 10 }, (_, i) => ({
    day: `D-${9 - i}`,
    triage: +(3 + Math.random() * 4).toFixed(1),
    contain: +(14 + Math.random() * 10).toFixed(1),
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Shadow Drift Alert */}
      {!driftDismissed && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 flex items-center gap-4 animate-pulse-once">
          <AlertOctagon className="text-red-400 flex-shrink-0" size={22} />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-300">⚡ Process Drift Detected — Shadow Execution Alert</p>
            <p className="text-xs text-red-300/80 mt-0.5">
              Analyst <strong>J.Doe</strong> isolated host <span className="font-mono">SRV-PROD-DB-07</span> via CrowdStrike console, bypassing DSGEE orchestration.
              State mismatch detected between CrowdStrike Falcon and DSGEE Execution Engine.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleRemediate}
              disabled={remediating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
            >
              {remediating ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
              {remediating ? "Remediating…" : "Auto-Remediate"}
            </button>
            <button onClick={() => setDriftDismissed(true)} className="text-slate-500 hover:text-slate-300 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg"><Activity className="text-emerald-400" size={20} /></div>
        <div>
          <h2 className="text-lg font-bold text-white">Telemetry & Tracking</h2>
          <p className="text-xs text-slate-400">SOC Manager Dashboard — Real-time observability</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        {Object.entries(MOCK_KPI).map(([key, kpi]) => (
          <KpiCard key={key} {...kpi} sparkKey={key} />
        ))}
      </div>

      {/* MTTR Chart + Audit Log */}
      <div className="grid grid-cols-5 gap-4">
        {/* MTTR Trend */}
        <div className="col-span-2 rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">MTTR Trend (10 days)</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-sky-400"><span className="w-2 h-0.5 bg-sky-400 inline-block" /> Triage</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Contain</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mttrData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="triage" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="contain" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Audit Log */}
        <div className="col-span-3 rounded-xl border border-slate-700/60 bg-slate-800/30 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-slate-400" />
              <p className="text-sm font-semibold text-white">OCSF Audit Log</p>
              <span className="text-xs text-slate-500 font-mono">live</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500">{auditLogs.length} events</p>
          </div>
          <div className="overflow-y-auto flex-1" style={{ maxHeight: "240px" }}>
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-slate-700/60">
                  {["Time", "Severity", "Actor", "Action", "Resource", "OCSF"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...auditLogs].reverse().map((log, i) => (
                  <AuditRow key={log.id} log={log} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
