import { useState } from "react";
import { X, Code2, Layers, FileJson, CheckCircle2, Clock, Terminal, Copy } from "lucide-react";
import { MOCK_YAML_PREVIEW } from "../data/mockData";

export default function PlaybookViewerModal({ playbook, onClose }) {
  const [activeTab, setActiveTab] = useState("STEPS"); // STEPS | YAML | JSON
  const [copied, setCopied] = useState(false);

  if (!playbook) return null;

  const jsonContent = JSON.stringify(playbook, null, 2);

  function copyCode(content) {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl">
              <Layers className="text-sky-400" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">{playbook.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  playbook.severity === "CRITICAL" ? "bg-red-500/20 border-red-500/40 text-red-300" :
                  playbook.severity === "HIGH" ? "bg-orange-500/20 border-orange-500/40 text-orange-300" :
                  "bg-sky-500/20 border-sky-500/40 text-sky-300"
                }`}>
                  {playbook.severity}
                </span>
                <span className="text-xs text-slate-500">• Assignee: {playbook.assignee}</span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">{playbook.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex gap-4 text-xs font-semibold">
            {[
              { id: "STEPS", label: "Workflow Steps", icon: Layers },
              { id: "YAML", label: "YAML Definition", icon: Code2 },
              { id: "JSON", label: "JSON Spec", icon: FileJson },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                    activeTab === t.id
                      ? "border-sky-500 text-sky-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => copyCode(activeTab === "YAML" ? MOCK_YAML_PREVIEW : jsonContent)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === "STEPS" && (
            <div className="space-y-3">
              {playbook.steps.map((st, i) => (
                <div key={st.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-white text-sm">{st.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        {st.tactic}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        st.status === "completed" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        st.status === "in-progress" ? "bg-sky-500/10 border-sky-500/30 text-sky-400 animate-pulse" :
                        "bg-slate-800 border-slate-700 text-slate-500"
                      }`}>
                        {st.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{st.description}</p>

                  <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono text-emerald-400 text-xs">
                    $ {st.command}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block mb-0.5">Input Parameters</span>
                      <code className="text-slate-300 font-mono block truncate">{st.input || "Default incident context"}</code>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block mb-0.5">Output Signature</span>
                      <code className="text-sky-300 font-mono block truncate">{st.output || "Pending execution output"}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "YAML" && (
            <pre className="bg-black/80 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
              {MOCK_YAML_PREVIEW}
            </pre>
          )}

          {activeTab === "JSON" && (
            <pre className="bg-black/80 text-sky-300 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
              {jsonContent}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
