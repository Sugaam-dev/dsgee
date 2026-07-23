import { useState } from "react";
import {
  Bell, X, CheckCheck, Check, Search, Filter, AlertTriangle, ShieldAlert,
  Info, ExternalLink, ShieldCheck, Clock
} from "lucide-react";

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead
}) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedNotif, setSelectedNotif] = useState(null);

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    const matchesFilter =
      filter === "ALL" ? true :
      filter === "UNREAD" ? !n.read :
      filter === "CRITICAL" ? n.severity === "CRITICAL" :
      filter === "WARN" ? n.severity === "WARN" :
      filter === "INFO" ? n.severity === "INFO" : true;

    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      (n.asset && n.asset.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Slide-out Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Slide-out Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
              <Bell size={18} className="text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Notifications Center</h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "All notifications read"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/50 space-y-2">
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search notifications, assets, or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {["ALL", "UNREAD", "CRITICAL", "WARN", "INFO"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-sky-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No notifications matching criteria</p>
            </div>
          ) : (
            filtered.map(n => {
              const isCrit = n.severity === "CRITICAL";
              const isWarn = n.severity === "WARN";
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    setSelectedNotif(n);
                    if (!n.read) onMarkAsRead(n.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
                    !n.read
                      ? isCrit
                        ? "bg-red-500/10 border-red-500/40 hover:border-red-500/70"
                        : isWarn
                        ? "bg-amber-500/10 border-amber-500/40 hover:border-amber-500/70"
                        : "bg-sky-500/10 border-sky-500/40 hover:border-sky-500/70"
                      : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600"
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  )}
                  <div className="flex items-start gap-2.5">
                    {isCrit ? (
                      <ShieldAlert size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    ) : isWarn ? (
                      <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info size={16} className="text-sky-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          isCrit ? "bg-red-500/20 border-red-500/30 text-red-300" :
                          isWarn ? "bg-amber-500/20 border-amber-500/30 text-amber-300" :
                          "bg-sky-500/20 border-sky-500/30 text-sky-300"
                        }`}>
                          {n.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                        {n.category && (
                          <span className="text-[10px] text-slate-500 truncate">• {n.category}</span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-white leading-snug group-hover:text-sky-300 transition-colors">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      {n.asset && (
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50">
                            Asset: {n.asset}
                          </span>
                          <span className="text-sky-400 font-medium flex items-center gap-0.5">
                            Details <ExternalLink size={10} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
          DSGEE Real-time Security Notification Stream
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedNotif.severity === "CRITICAL" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                  selectedNotif.severity === "WARN" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                  "bg-sky-500/10 border-sky-500/30 text-sky-400"
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedNotif.severity === "CRITICAL" ? "bg-red-500/20 border-red-500/40 text-red-300" :
                    selectedNotif.severity === "WARN" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" :
                    "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  }`}>
                    {selectedNotif.severity}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1">{selectedNotif.title}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedNotif(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Timestamp: <strong className="text-white font-mono">{selectedNotif.timestamp}</strong></span>
                <span>Category: <strong className="text-sky-300">{selectedNotif.category}</strong></span>
              </div>
              {selectedNotif.asset && (
                <div className="text-slate-400">
                  Target Resource: <code className="text-amber-300 font-mono">{selectedNotif.asset}</code>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Details & Payload</h4>
              <p className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
                {selectedNotif.details || selectedNotif.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
