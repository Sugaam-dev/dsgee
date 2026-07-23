import { useState } from "react";
import { X, Search, FileText, Filter, Clock, User, Server, ExternalLink } from "lucide-react";
import EventDetailModal from "./EventDetailModal";

const SEVERITY_BADGE = {
  INFO: "text-sky-700 bg-sky-100 border-sky-300 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
  WARN: "text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
  CRITICAL: "text-red-700 bg-red-100 border-red-300 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20",
  SUCCESS: "text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
};

export default function EventLogDrawer({ isOpen, onClose, auditLogs, darkMode }) {
  const [search, setSearch] = useState("");
  const [filterSev, setFilterSev] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSev = filterSev === "ALL" ? true : log.severity === filterSev;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const drawerBg = darkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200 shadow-2xl";
  const headerBg = darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200";
  const inputBg = darkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400";
  const rowHover = darkMode ? "hover:bg-slate-800/60 border-slate-800/60" : "hover:bg-slate-100 border-slate-200";
  const subText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl border-l shadow-2xl flex flex-col animate-slide-left ${drawerBg}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <FileText size={18} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-base">OCSF Event Audit Stream</h3>
              <p className={`text-xs ${subText}`}>{auditLogs.length} total events recorded in immutable log</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search & Severity Filters */}
        <div className={`p-3 border-b space-y-2 ${darkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search event ID, action, resource, or user..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-sky-500 border ${inputBg}`}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {["ALL", "CRITICAL", "WARN", "INFO"].map(s => (
              <button
                key={s}
                onClick={() => setFilterSev(s)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterSev === s
                    ? "bg-sky-600 text-white"
                    : darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className={`text-center py-12 ${subText}`}>
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No OCSF events matching query</p>
            </div>
          ) : (
            [...filteredLogs].reverse().map(log => (
              <div
                key={log.id}
                onClick={() => setSelectedEvent(log)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group space-y-1.5 ${
                  darkMode ? "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800" : "bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-500">{log.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEVERITY_BADGE[log.severity] || SEVERITY_BADGE.INFO}`}>
                      {log.severity}
                    </span>
                    <span className={`text-[10px] font-mono ${subText}`}>OCSF: {log.ocsf || "3002"}</span>
                  </div>
                  <span className={`font-mono text-[11px] ${subText}`}>{log.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold leading-tight group-hover:text-sky-500 transition-colors">
                  {log.action}
                </h4>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className={`font-mono truncate max-w-[260px] ${subText}`}>
                    Resource: <strong className={darkMode ? "text-amber-300" : "text-amber-700"}>{log.resource}</strong>
                  </span>
                  <span className={`font-medium ${subText}`}>
                    Actor: <strong className={darkMode ? "text-slate-200" : "text-slate-800"}>{log.actor || log.user}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-center text-xs ${subText} ${headerBg}`}>
          Click any event entry to inspect raw JSON payload & OCSF schema.
        </div>
      </div>
    </>
  );
}
