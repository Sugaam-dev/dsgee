import { useState, useCallback, useEffect } from "react";
import {
  Terminal, Activity, Layers, Radar, Moon, Sun, Shield,
  ChevronRight, Bell, Settings, User, Cpu, AlertCircle, Server, LogOut
} from "lucide-react";
import ExecutionEngine from "./views/ExecutionEngine";
import TelemetryTracking from "./views/TelemetryTracking";
import GovernanceLifecycle from "./views/GovernanceLifecycle";
import SelfAwareIntelligence from "./views/SelfAwareIntelligence";
import TechBoardView from "./views/TechBoardView";
import SelfView from "./views/SelfView";
import AuthPages from "./views/AuthPages";
import NotificationDrawer from "./components/NotificationDrawer";
import EventLogDrawer from "./components/EventLogDrawer";
import CardDetailDrawer from "./components/CardDetailDrawer";

import {
  MOCK_AUDIT_LOGS,
  MOCK_PLAYBOOKS,
  MOCK_NOTIFICATIONS,
  MOCK_USER
} from "./data/mockData";
import pmrgLogo from "./assets/PMRG logo_orig.png";

const NAV_ITEMS = [
  { id: "execution", label: "Execution Engine", icon: Terminal, subtitle: "Analyst View", accent: "sky" },
  { id: "telemetry", label: "Telemetry & Tracking", icon: Activity, subtitle: "SOC Observability", accent: "emerald" },
  { id: "governance", label: "Governance & Lifecycle", icon: Layers, subtitle: "SOP-as-Code", accent: "purple" },
  { id: "intelligence", label: "Self-Aware Intelligence", icon: Radar, subtitle: "Threat Synthesis", accent: "red" },
  { id: "techboard", label: "Tech Board", icon: Server, subtitle: "Operations & K8s", accent: "sky" },
  { id: "self", label: "Self Workspace", icon: User, subtitle: "User Profile", accent: "emerald" },
];

const ACCENT_MAP = {
  sky: { text: "text-sky-500 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  red: { text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
};

let auditCounter = MOCK_AUDIT_LOGS.length + 1;

export default function App() {
  // PERSIST AUTHENTICATION STATE IN LOCAL STORAGE UNTIL EXPLICIT SIGN OUT
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("dsgee_authenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("dsgee_user");
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const [activeView, setActiveView] = useState("execution");
  const [darkMode, setDarkMode] = useState(true);

  // Audit Logs & Playbooks state
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [playbooks, setPlaybooks] = useState(MOCK_PLAYBOOKS);
  const [yamlModified, setYamlModified] = useState(false);
  const [mitreExtra, setMitreExtra] = useState([]);

  // Drawers state
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isEventLogDrawerOpen, setIsEventLogDrawerOpen] = useState(false);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);

  const handleLoginSuccess = (loginData) => {
    const updatedUser = {
      ...user,
      name: loginData.name,
      shortName: loginData.name.split(" ")[0],
      role: loginData.role,
    };
    setIsAuthenticated(true);
    setUser(updatedUser);
    localStorage.setItem("dsgee_authenticated", "true");
    localStorage.setItem("dsgee_user", JSON.stringify(updatedUser));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dsgee_authenticated");
    localStorage.removeItem("dsgee_user");
  };

  const addAuditLog = useCallback((entry) => {
    const id = `EVT-${String(auditCounter++).padStart(4, "0")}`;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setAuditLogs(prev => [...prev, { id, timestamp, outcome: "SUCCESS", ...entry }]);
  }, []);

  const handlePlaybookDeployed = useCallback((newPB) => {
    setPlaybooks(prev => [newPB, ...prev]);
    setMitreExtra(prev => [
      ...prev,
      { tactic: "RCE Response", id: "AUTO-01", techniques: ["T1190"], covered: 1, total: 1 },
    ]);
    addAuditLog({
      actor: user.shortName,
      action: "PLAYBOOK_DEPLOYED",
      resource: newPB.id,
      severity: "WARN",
      ocsf: "3005",
      service: "Execution Engine",
      user: user.name,
      status: "Deployed"
    });
  }, [addAuditLog, user]);

  const handleMarkAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated) {
    return <AuthPages onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const activeNav = NAV_ITEMS.find(n => n.id === activeView);
  const acc = ACCENT_MAP[activeNav?.accent || "sky"];

  const bg = darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900";
  const sidebarbg = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const mainbg = darkMode ? "bg-slate-950" : "bg-slate-100";
  const headerbg = darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm";

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${bg}`}>
      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* CLICKABLE OCSF EVENT LOG DRAWER */}
      <EventLogDrawer
        isOpen={isEventLogDrawerOpen}
        onClose={() => setIsEventLogDrawerOpen(false)}
        auditLogs={auditLogs}
        darkMode={darkMode}
      />

      {/* Interactive Card Detail Drawer */}
      {selectedCardDetail && (
        <CardDetailDrawer
          cardData={selectedCardDetail}
          onClose={() => setSelectedCardDetail(null)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 border-r flex flex-col ${sidebarbg}`}>
        {/* Logo Header */}
        <div className="px-4 py-5 border-b border-slate-800/40 flex flex-col items-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative bg-white rounded-xl p-2.5 shadow-md border border-slate-200 w-44 flex items-center justify-center">
            <img src={pmrgLogo} alt="PMRG Logo" className="w-full h-auto object-contain" />
          </div>
          <div className="text-center relative">
            <h1 className="text-[20px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 dark:from-sky-400 dark:via-sky-200 dark:to-sky-100">
              DSGEE PLATFORM
            </h1>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-mono uppercase tracking-[0.2em] mt-0.5 font-bold">
              v2.4.1 Enterprise
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className={`text-[11px] font-bold uppercase tracking-wider px-3 mb-2 ${darkMode ? "text-slate-500" : "text-slate-700"}`}>
            Platform Pillars
          </p>
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
                    ? `${itemAcc.bg} ${itemAcc.border} border font-bold`
                    : darkMode
                    ? "hover:bg-slate-800 border border-transparent text-slate-400"
                    : "hover:bg-slate-100 border border-transparent text-slate-700 font-semibold"
                }`}
              >
                <Icon size={16} className={isActive ? itemAcc.text : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-900"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${isActive ? (darkMode ? "text-white" : "text-slate-950 font-bold") : (darkMode ? "text-slate-300" : "text-slate-800 font-semibold")}`}>
                    {item.label}
                  </p>
                  <p className={`text-[10px] truncate ${isActive ? itemAcc.text : "text-slate-500"}`}>{item.subtitle}</p>
                </div>
                {isActive && <ChevronRight size={13} className={itemAcc.text} />}
              </button>
            );
          })}
        </nav>

        {/* System Health Indicator Box */}
        <div className="p-3 border-t border-slate-800/40">
          <div className={`rounded-xl border p-3 ${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DSGEE Engine Online</span>
            </div>
            <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-600 font-medium"}`}>3 incidents active · 84% automated</p>
            <div className="mt-2 w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full" style={{ width: "84%" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className={`h-14 flex-shrink-0 flex items-center justify-between px-6 border-b backdrop-blur-sm ${headerbg}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${acc.bg} ${acc.border} border`}>
              {activeNav && <activeNav.icon size={16} className={acc.text} />}
            </div>
            <div>
              <p className={`text-xs font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>{activeNav?.label}</p>
              <p className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-600 font-medium"}`}>{activeNav?.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* CLICKABLE OCSF EVENTS BADGE BUTTON */}
            <button
              onClick={() => setIsEventLogDrawerOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer hover:scale-105 ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500"
                  : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 font-bold shadow-sm"
              }`}
              title="Click to view complete list of OCSF events"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{auditLogs.length} OCSF events</span>
            </button>

            {/* Clickable Notification Icon */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className={`relative p-2 rounded-xl transition-all ${
                darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-800"
              }`}
              title="Open Notifications Drawer"
            >
              <Bell size={17} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                darkMode
                  ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-sky-100 border border-sky-300 text-sky-900 hover:bg-sky-200 shadow-sm"
              }`}
            >
              {darkMode ? <Sun size={13} /> : <Moon size={13} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Indian User Profile Badge */}
            <div
              onClick={() => setActiveView("self")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-slate-100 border-slate-300 hover:bg-slate-200 shadow-sm"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                {user.initials || "RS"}
              </div>
              <span className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>{user.name}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className={`p-2 transition-colors ${darkMode ? "text-slate-500 hover:text-red-400" : "text-slate-600 hover:text-red-600"}`}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-6 ${mainbg}`}>
          {activeView === "execution" && (
            <ExecutionEngine
              addAuditLog={addAuditLog}
              darkMode={darkMode}
              playbooks={playbooks}
              onOpenCardDetail={setSelectedCardDetail}
            />
          )}
          {activeView === "telemetry" && (
            <TelemetryTracking
              auditLogs={auditLogs}
              addAuditLog={addAuditLog}
              darkMode={darkMode}
              onOpenCardDetail={setSelectedCardDetail}
            />
          )}
          {activeView === "governance" && (
            <GovernanceLifecycle
              addAuditLog={addAuditLog}
              yamlModified={yamlModified}
              onYamlModify={setYamlModified}
              mitreExtra={mitreExtra}
              onMitreUpdate={setMitreExtra}
              darkMode={darkMode}
            />
          )}
          {activeView === "intelligence" && (
            <SelfAwareIntelligence
              addAuditLog={addAuditLog}
              onPlaybookDeployed={handlePlaybookDeployed}
              darkMode={darkMode}
            />
          )}
          {activeView === "techboard" && (
            <TechBoardView darkMode={darkMode} />
          )}
          {activeView === "self" && (
            <SelfView darkMode={darkMode} />
          )}
        </main>
      </div>
    </div>
  );
}
