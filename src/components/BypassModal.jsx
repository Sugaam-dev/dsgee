import { useState, useEffect } from "react";
import { ShieldAlert, X, CheckCircle2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

const BYPASS_STAGES = [
  "Validation started",
  "Policy check",
  "Security scan",
  "Resource verification",
  "Compliance verification",
  "Access validation",
  "Risk calculation",
  "Final decision"
];

export default function BypassModal({ step, onConfirm, onCancel }) {
  const [justification, setJustification] = useState("");
  const [executing, setExecuting] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  function startBypassExecution() {
    if (!justification.trim() || executing) return;
    setExecuting(true);
    setCurrentStage(0);

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < BYPASS_STAGES.length) {
        setCurrentStage(stageIdx);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onConfirm(justification);
        }, 500);
      }
    }, 450);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
            <ShieldAlert className="text-red-400" size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Break-Glass Step Bypass Workflow</h3>
            <p className="text-xs text-slate-400">Mandatory verification & OCSF audit logging sequence.</p>
          </div>
          {!executing && (
            <button onClick={onCancel} className="ml-auto text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Target step card */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1 text-xs">
          <span className="text-slate-400 font-medium">Bypassing Step:</span>
          <p className="text-sm font-mono font-semibold text-amber-300">{step?.name}</p>
          <p className="text-slate-400">{step?.description}</p>
        </div>

        {!executing ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business & Security Justification <span className="text-red-400">*</span>
              </label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Provide explicit operational rationale for overriding this automated step..."
                className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-500 p-3 resize-none focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 text-xs text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={startBypassExecution}
                disabled={!justification.trim()}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-red-900/40"
              >
                Execute Bypass Pipeline
              </button>
            </div>
          </>
        ) : (
          /* Multi-step animated verification progress */
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Verification Pipeline</span>
              <span className="text-xs font-mono text-slate-400">
                {Math.round(((currentStage + 1) / BYPASS_STAGES.length) * 100)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-purple-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStage + 1) / BYPASS_STAGES.length) * 100}%` }}
              />
            </div>

            <div className="space-y-1.5 pt-2">
              {BYPASS_STAGES.map((stg, i) => {
                const isPassed = i < currentStage;
                const isCurrent = i === currentStage;
                return (
                  <div
                    key={stg}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isCurrent
                        ? "bg-sky-500/10 border border-sky-500/30 text-sky-300"
                        : isPassed
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 size={13} className="text-sky-400 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span className="font-semibold flex-1">{stg}</span>
                    {isPassed && <span className="text-[10px] text-emerald-500/80 font-mono">VERIFIED</span>}
                    {isCurrent && <span className="text-[10px] text-sky-400 font-mono animate-pulse">CHECKING...</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
