import { useState } from "react";
import { X, ShieldAlert, CheckCircle2, Copy, FileText, Clock, User, Server, Code } from "lucide-react";

export default function EventDetailModal({ event, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const rawJson = JSON.stringify(event.rawPayload || event, null, 2);

  function copyPayload() {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              event.severity === "CRITICAL" ? "bg-red-500/10 border-red-500/30 text-red-400" :
              event.severity === "WARN" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
              "bg-sky-500/10 border-sky-500/30 text-sky-400"
            }`}>
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">{event.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  event.severity === "CRITICAL" ? "bg-red-500/20 border-red-500/40 text-red-300" :
                  event.severity === "WARN" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" :
                  "bg-sky-500/20 border-sky-500/40 text-sky-300"
                }`}>
                  {event.severity}
                </span>
                <span className="text-xs text-slate-500 font-mono">OCSF: {event.ocsf || "3002"}</span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">{event.action}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1 flex items-center gap-1"><Clock size={12} /> Timestamp</span>
              <strong className="font-mono text-white text-sm">{event.timestamp}</strong>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1 flex items-center gap-1"><User size={12} /> Actor / User</span>
              <strong className="text-sky-300 text-sm font-semibold truncate block">{event.actor || event.user}</strong>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1 flex items-center gap-1"><Server size={12} /> Service Source</span>
              <strong className="text-amber-300 text-sm font-semibold truncate block">{event.service || "Execution Engine"}</strong>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Status</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded inline-block">
                {event.outcome || event.status || "SUCCESS"}
              </span>
            </div>
          </div>

          {/* Resource details */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-semibold block mb-1">Affected Resource</span>
            <code className="text-amber-300 font-mono text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 block truncate">
              {event.resource}
            </code>
          </div>

          {/* Raw JSON Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Code size={13} /> Raw OCSF JSON Payload
              </span>
              <button
                onClick={copyPayload}
                className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <pre className="bg-black/80 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed max-h-60">
              {rawJson}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
}
