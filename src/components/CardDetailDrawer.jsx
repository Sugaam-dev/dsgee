import { useState } from "react";
import { X, TrendingDown, TrendingUp, Activity, BarChart3, Clock, AlertTriangle, FileText } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function CardDetailDrawer({ cardData, onClose }) {
  if (!cardData) return null;

  const sparkData = Array.from({ length: 12 }, (_, i) => ({
    time: `T-${12 - i}h`,
    val: Math.floor(Math.random() * 40 + 20),
    avg: 30,
  }));

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Activity className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{cardData.label || cardData.title || "Metric Details"}</h3>
              <p className="text-xs text-slate-400">Deep-dive metric telemetry & trend analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Main Stat Card */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Current Telemetry Value</span>
              <p className="text-3xl font-black text-white">{cardData.value || cardData.val || "97.3%"}</p>
            </div>
            {cardData.trend !== undefined && (
              <div className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 ${
                cardData.trend < 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}>
                {cardData.trend < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {Math.abs(cardData.trend)}% 24h change
              </div>
            )}
          </div>

          {/* Historical Trend Chart */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <BarChart3 size={14} className="text-sky-400" /> Historical Trend (12 Hours)
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Sampling: 1h</span>
            </div>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="val" stroke="#38bdf8" strokeWidth={2} fill="url(#chartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-400" /> Automated AI Insights
            </h4>
            <ul className="space-y-1.5 text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Metric is operating within normal DevSecOps SLA boundaries (95% CI).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Peak variance observed during automated break-glass playbook execution window.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Zero manual policy violations recorded during this monitoring period.
              </li>
            </ul>
          </div>

          {/* Related Log Snippet */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" /> Related Telemetry Log
            </h4>
            <pre className="p-3 bg-black/80 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {`[TELEMETRY] metric="${cardData.label || 'Metric'}" value="${cardData.value || '97.3%'}" timestamp="07:35:59" status="OPTIMAL" source="dsgee-agent-07"`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </>
  );
}
