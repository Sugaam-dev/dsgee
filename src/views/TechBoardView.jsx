import { useState } from "react";
import {
  Server, Cpu, Layers, Activity, AlertTriangle, CheckCircle2, RefreshCw,
  Box, Terminal, Globe, ShieldAlert, GitBranch, Clock, ArrowUpRight
} from "lucide-react";
import { MOCK_TECH_BOARD } from "../data/mockData";

export default function TechBoardView({ darkMode }) {
  const [data, setData] = useState(MOCK_TECH_BOARD);
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  const cardBg = darkMode
    ? "bg-slate-900/80 border-slate-800 text-white"
    : "bg-white border-slate-200 text-slate-900 shadow-sm";

  const subText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl">
            <Server className="text-sky-400" size={22} />
          </div>
          <div>
            <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
              Technical Operations Board
            </h2>
            <p className={`text-xs ${subText}`}>
              Real-time NOC/SOC infrastructure monitoring, containers, K8s pods & pipeline health
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin text-sky-400" : ""} />
          {refreshing ? "Syncing Grid..." : "Refresh Board"}
        </button>
      </div>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Services", val: `${data.services.length} Healthy`, sub: "0 Outages", color: "text-emerald-400" },
          { label: "Running Containers", val: `${data.containers.length} Containers`, sub: "Docker 24.0", color: "text-sky-400" },
          { label: "K8s Pod Cluster", val: `${data.k8sPods.length} Pods`, sub: "1 CrashLoop", color: "text-amber-400" },
          { label: "Agent Health", val: `${data.agents.length} Online`, sub: "Avg latency 22ms", color: "text-purple-400" },
        ].map((st, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${cardBg}`}>
            <span className={`text-xs ${subText} block font-medium`}>{st.label}</span>
            <p className={`text-2xl font-bold mt-1 ${st.color}`}>{st.val}</p>
            <span className={`text-[11px] ${subText} block mt-0.5 font-mono`}>{st.sub}</span>
          </div>
        ))}
      </div>

      {/* Grid Section 1: Active Services & Failed Pipelines Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Services Grid */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Globe size={16} className="text-sky-400" /> Active Platform Microservices
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Primary Gateway APIs Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.services.map((svc, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h4 className="font-bold text-xs">{svc.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] mt-1 text-slate-400 font-mono">
                    <span>Port: {svc.port}</span>
                    <span>Uptime: {svc.uptime}</span>
                    <span>Load: {svc.load}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {svc.version}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Pipelines Alert List */}
        <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2 text-red-400">
              <ShieldAlert size={16} /> Pipeline Health & Failure Alerts
            </h3>
            <span className="text-xs text-red-400 font-bold font-mono">2 Failures</span>
          </div>

          <div className="space-y-3">
            {data.failedPipelines.map((fp, i) => (
              <div key={i} className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-300">{fp.pipeline}</span>
                  <span className="text-[10px] font-mono text-red-400">{fp.failedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <GitBranch size={12} /> {fp.branch} ({fp.commit})
                </div>
                <p className="text-[11px] font-mono text-red-200 bg-black/40 p-2 rounded border border-red-900/40">
                  Failed step: <strong>{fp.step}</strong> — {fp.error}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section 2: Containers, Kubernetes Pods, Running Jobs, Agent Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kubernetes Pods & Containers */}
        <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Box size={16} className="text-purple-400" /> Kubernetes Pods & Containers
            </h3>
            <span className="text-xs text-slate-400 font-mono">Namespace: prod-sec</span>
          </div>

          <div className="space-y-2 text-xs">
            {data.k8sPods.map((pod, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  pod.status === "Running"
                    ? darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div>
                  <h4 className="font-mono font-semibold text-xs text-sky-400">{pod.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{pod.node} • restarts: {pod.restarts}</span>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border ${
                  pod.status === "Running"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/20 border-red-500/40 text-red-300 animate-pulse"
                }`}>
                  {pod.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Health & Scheduled Jobs */}
        <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /> DSGEE Execution Agents Health
            </h3>
            <span className="text-xs text-emerald-400 font-mono">4 Connected</span>
          </div>

          <div className="space-y-2 text-xs">
            {data.agents.map((ag, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{ag.id}</span>
                    <span className="text-slate-400 font-mono">({ag.host})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{ag.os} • latency: {ag.latency}</span>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                  ag.status === "Online"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  {ag.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
