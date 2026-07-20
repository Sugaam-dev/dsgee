import { useState, useCallback } from "react";
import {
  Terminal, Activity, Layers, Radar, Moon, Sun, Shield,
  ChevronRight, Bell, Settings, User, Cpu, AlertCircle
} from "lucide-react";
import ExecutionEngine from "./views/ExecutionEngine";
import TelemetryTracking from "./views/TelemetryTracking";
import GovernanceLifecycle from "./views/GovernanceLifecycle";
import SelfAwareIntelligence from "./views/SelfAwareIntelligence";
import { MOCK_AUDIT_LOGS, MOCK_PLAYBOOKS } from "./data/mockData";
import pmrgLogo from "./assets/PMRG logo_orig.png";

const NAV_ITEMS = [
  { id: "execution", label: "Execution Engine", icon: Terminal, subtitle: "Analyst View", accent: "sky" },
  { id: "telemetry", label: "Telemetry & Tracking", icon: Activity, subtitle: "SOC Manager", accent: "emerald" },
  { id: "governance", label: "Governance & Lifecycle", icon: Layers, subtitle: "Compliance Workspace", accent: "purple" },
  { id: "intelligence", label: "Self-Aware Intelligence", icon: Radar, subtitle: "Threat Synthesis", accent: "red" },
];

const ACCENT_MAP = {
  sky: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", glow: "shadow-sky-900/30" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-900/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-purple-900/30" },
  red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", glow: "shadow-red-900/30" },
};

let auditCounter = MOCK_AUDIT_LOGS.length + 1;

export default function App() {
  const [activeView, setActiveView] = useState("execution");
  const [darkMode, setDarkMode] = useState(true);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [playbooks, setPlaybooks] = useState(MOCK_PLAYBOOKS);
  const [yamlModified, setYamlModified] = useState(false);
  const [mitreExtra, setMitreExtra] = useState([]);
  const [notifications, setNotifications] = useState(3);

  const addAuditLog = useCallback((entry) => {
    const id = `EVT-${String(auditCounter++).padStart(4, "0")}`;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setAuditLogs(prev => [...prev, { id, timestamp, outcome: "SUCCESS", ...entry }]);
  }, []);

  const handlePlaybookDeployed = useCallback((newPB) => {
    setPlaybooks(prev => [newPB, ...prev]);
    // Add MITRE coverage for the deployed playbook
    setMitreExtra(prev => [
      ...prev,
      { tactic: "RCE Response", id: "AUTO-01", techniques: ["T1190"], covered: 1, total: 1 },
    ]);
    addAuditLog({ actor: "Analyst", action: "PLAYBOOK_DEPLOYED", resource: newPB.id, severity: "WARN", ocsf: "3005" });
  }, [addAuditLog]);

  const activeNav = NAV_ITEMS.find(n => n.id === activeView);
  const acc = ACCENT_MAP[activeNav?.accent || "sky"];

  const bg = darkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-100 text-slate-900";

  const sidebarbg = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";

  const mainbg = darkMode
    ? "bg-slate-950"
    : "bg-slate-100";

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${bg}`}>
      {/* Sidebar */}
      <aside className={`w-60 flex-shrink-0 border-r flex flex-col ${sidebarbg}`}>
        {/* Logo */}
        <div className="px-4 py-6 border-b border-slate-800/50 flex flex-col items-center gap-4 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
          
          <div className="relative bg-white rounded-xl p-3 shadow-lg shadow-sky-900/20 w-44 flex items-center justify-center border border-white/10">
            <img src={pmrgLogo} alt="PMRG Logo" className="w-full h-auto object-contain" />
          </div>
          
          <div className="text-center relative">
            <h1 className="text-[22px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300">DSGEE</h1>
            <p className="text-[10px] text-sky-400/80 font-mono uppercase tracking-[0.2em] mt-1">v2.4.1 Enterprise</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">Platform Pillars</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const itemAcc = ACCENT_MAP[item.accent];
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                  isActive
                    ? `${itemAcc.bg} ${itemAcc.border} border`
                    : darkMode
                    ? "hover:bg-slate-800 border border-transparent"
                    : "hover:bg-slate-100 border border-transparent"
                }`}
              >
                <Icon size={16} className={isActive ? itemAcc.text : "text-slate-500 group-hover:text-slate-300"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? "text-white" : darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs truncate ${isActive ? itemAcc.text : "text-slate-500"}`}>{item.subtitle}</p>
                </div>
                {isActive && <ChevronRight size={13} className={itemAcc.text} />}
              </button>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div className="p-3 border-t border-slate-800/50">
          <div className={`rounded-xl border p-2.5 ${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">Engine Online</span>
            </div>
            <p className="text-xs text-slate-500">3 incidents active · 84% automated</p>
            <div className="mt-2 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full" style={{ width: "84%" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`h-14 flex-shrink-0 flex items-center justify-between px-6 border-b ${
          darkMode ? "bg-slate-900/80 border-slate-800 backdrop-blur-sm" : "bg-white/80 border-slate-200 backdrop-blur-sm"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${acc.bg} ${acc.border} border`}>
              {activeNav && <activeNav.icon size={16} className={acc.text} />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{activeNav?.label}</p>
              <p className="text-xs text-slate-500">{activeNav?.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live audit counter */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-100 border border-slate-200"
            }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{auditLogs.length} events logged</span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => setNotifications(0)}
              className={`relative p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <Bell size={16} className={darkMode ? "text-slate-400" : "text-slate-500"} />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                darkMode
                  ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-sky-100 border border-sky-200 text-sky-700 hover:bg-sky-200"
              }`}
            >
              {darkMode ? <Sun size={13} /> : <Moon size={13} />}
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* User */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-100 border border-slate-200"
            }`}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <span className={darkMode ? "text-slate-300" : "text-slate-700"}>J. Doe</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto p-6 ${mainbg}`}>
          {activeView === "execution" && (
            <ExecutionEngine addAuditLog={addAuditLog} darkMode={darkMode} playbooks={playbooks} />
          )}
          {activeView === "telemetry" && (
            <TelemetryTracking auditLogs={auditLogs} addAuditLog={addAuditLog} />
          )}
          {activeView === "governance" && (
            <GovernanceLifecycle
              addAuditLog={addAuditLog}
              yamlModified={yamlModified}
              onYamlModify={setYamlModified}
              mitreExtra={mitreExtra}
              onMitreUpdate={setMitreExtra}
            />
          )}
          {activeView === "intelligence" && (
            <SelfAwareIntelligence
              addAuditLog={addAuditLog}
              onPlaybookDeployed={handlePlaybookDeployed}
            />
          )}
        </main>
      </div>
    </div>
  );
}
