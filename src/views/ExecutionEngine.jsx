import { useState, useEffect, useRef } from "react";
import {
  Terminal, Play, ShieldAlert, ChevronRight, CheckCircle2, Clock,
  AlertTriangle, Zap, SkipForward, X, Bot, Copy, Send, Loader2,
  CircleDot, Lock
} from "lucide-react";
import { MOCK_PLAYBOOKS, MOCK_TERMINAL_LINES } from "../data/mockData";

const STEP_STATUS_CONFIG = {
  completed: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  "in-progress": { color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30", icon: Loader2 },
  pending: { color: "text-slate-500", bg: "bg-slate-800/50 border-slate-700/50", icon: CircleDot },
};

const SEVERITY_CONFIG = {
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/30",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-700/30",
};

function BypassModal({ step, onConfirm, onCancel }) {
  const [justification, setJustification] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg"><ShieldAlert className="text-red-400" size={20} /></div>
          <div>
            <h3 className="font-semibold text-white">Break-Glass Step Bypass</h3>
            <p className="text-xs text-slate-400">This action will be immutably logged in the OCSF audit trail.</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mb-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Bypassing Step</p>
          <p className="text-sm font-mono text-amber-300">{step?.name}</p>
        </div>
        <label className="block text-xs text-slate-400 mb-2">Justification <span className="text-red-400">*</span></label>
        <textarea
          value={justification}
          onChange={e => setJustification(e.target.value)}
          placeholder="Provide a business/security justification for bypassing this step..."
          className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 p-3 resize-none focus:outline-none focus:border-sky-500"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
          <button
            onClick={() => justification.trim() && onConfirm(justification)}
            disabled={!justification.trim()}
            className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Bypass
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExecutionEngine({ addAuditLog, darkMode }) {
  const [selectedPB, setSelectedPB] = useState(MOCK_PLAYBOOKS[0]);
  const [steps, setSteps] = useState(MOCK_PLAYBOOKS[0].steps);
  const [terminalLines, setTerminalLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cliInput, setCliInput] = useState("");
  const [bypassModal, setBypassModal] = useState(null);
  const [overrideApplied, setOverrideApplied] = useState(false);
  const terminalRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function runAction() {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalLines([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    addAuditLog({ actor: "J.Doe", action: "ACTION_TRIGGERED", resource: selectedPB.id, severity: "INFO", ocsf: "3002" });
    MOCK_TERMINAL_LINES.forEach((line) => {
      const t = setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, line.delay);
      timersRef.current.push(t);
    });
    const endTimer = setTimeout(() => setIsRunning(false), 7500);
    timersRef.current.push(endTimer);
  }

  function applyOverride() {
    setOverrideApplied(true);
    addAuditLog({ actor: "J.Doe", action: "AI_OVERRIDE_APPLIED", resource: "Step 3 Isolation Timeout → 5min", severity: "WARN", ocsf: "3004" });
    setTerminalLines(prev => [...prev, {
      text: "[AI-OVERRIDE] :: Isolation timeout updated: 120s → 300s — Applied by J.Doe",
      type: "success", delay: 0,
    }]);
  }

  function sendCliCommand(e) {
    e.preventDefault();
    if (!cliInput.trim()) return;
    const cmd = cliInput.trim();
    setCliInput("");
    addAuditLog({ actor: "J.Doe", action: "MANUAL_CLI_CMD", resource: cmd, severity: "WARN", ocsf: "3004" });
    setTerminalLines(prev => [...prev,
      { text: `[ANALYST OVERRIDE] $ ${cmd}`, type: "cmd", delay: 0 },
      { text: `[SYS] :: Command queued for execution on ${selectedPB.asset}...`, type: "info", delay: 0 },
    ]);
  }

  function handleBypassConfirm(justification) {
    const step = bypassModal;
    setBypassModal(null);
    addAuditLog({ actor: "J.Doe", action: "STEP_BYPASSED", resource: `${selectedPB.id}::${step.name}`, severity: "CRITICAL", ocsf: "3004" });
    setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: "completed" } : s));
    setTerminalLines(prev => [...prev,
      { text: `[BREAK-GLASS] :: Step "${step.name}" BYPASSED by J.Doe`, type: "danger", delay: 0 },
      { text: `[BREAK-GLASS] :: Justification logged to audit trail (OCSF 3004)`, type: "warn", delay: 0 },
    ]);
  }

  const termLineColor = { info: "text-slate-300", success: "text-emerald-400", warn: "text-amber-400", danger: "text-red-400", cmd: "text-sky-300" };
  const activeStep = steps.find(s => s.status === "in-progress") || steps.find(s => s.status === "pending");

  return (
    <div className="flex flex-col gap-4 h-full">
      {bypassModal && <BypassModal step={bypassModal} onConfirm={handleBypassConfirm} onCancel={() => setBypassModal(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg"><Terminal className="text-sky-400" size={20} /></div>
          <div>
            <h2 className="text-lg font-bold text-white">Execution Engine</h2>
            <p className="text-xs text-slate-400">Live Playbook Runner — Analyst View</p>
          </div>
        </div>
        <div className="flex gap-2">
          {MOCK_PLAYBOOKS.map(pb => (
            <button
              key={pb.id}
              onClick={() => { setSelectedPB(pb); setSteps(pb.steps); setTerminalLines([]); setIsRunning(false); }}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                selectedPB.id === pb.id
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {pb.id}
            </button>
          ))}
        </div>
      </div>

      {/* Incident header card */}
      <div className={`rounded-xl border p-4 flex items-center gap-4 ${SEVERITY_CONFIG[selectedPB.severity]} border`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${SEVERITY_CONFIG[selectedPB.severity]}`}>{selectedPB.severity}</span>
            <span className="text-xs text-slate-400 font-mono">{selectedPB.id}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{selectedPB.assignee}</span>
          </div>
          <h3 className="text-white font-semibold text-base">{selectedPB.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Asset: <span className="font-mono text-sky-300">{selectedPB.asset}</span></p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAction}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-sky-900/40"
          >
            {isRunning ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            {isRunning ? "Running…" : "Run Action"}
          </button>
          <button
            onClick={() => activeStep && setBypassModal(activeStep)}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/50 border border-red-700/40 text-red-300 text-sm font-semibold rounded-lg transition-all"
          >
            <SkipForward size={15} />Bypass Step
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Steps */}
        <div className="col-span-1 flex flex-col gap-2 overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Playbook Steps</p>
          {steps.map((step, i) => {
            const cfg = STEP_STATUS_CONFIG[step.status];
            const Icon = cfg.icon;
            return (
              <div key={step.id} className={`rounded-xl border p-3 transition-all ${cfg.bg}`}>
                <div className="flex items-start gap-2">
                  <Icon size={15} className={`mt-0.5 flex-shrink-0 ${cfg.color} ${step.status === "in-progress" ? "animate-spin" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs text-slate-500">{i + 1}.</span>
                      <p className="text-xs font-semibold text-white truncate">{step.name}</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${cfg.color} bg-slate-900/50`}>{step.tactic}</span>
                      {step.automated && <span className="text-xs text-emerald-400/70">⚡ automated</span>}
                    </div>
                    {step.status !== "pending" && (
                      <code className="block mt-2 text-xs font-mono text-sky-300/70 bg-slate-900/80 rounded px-2 py-1 truncate">
                        $ {step.command}
                      </code>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Terminal + AI Advisor */}
        <div className="col-span-2 flex flex-col gap-3 min-h-0">
          {/* AI Advisor */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">AI Action Advisor</span>
              <span className="ml-auto text-xs text-slate-500 font-mono">DSGEE-ADVISOR v2.4</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="text-amber-300 font-semibold">⚠ Recommendation:</span> Our records show{" "}
              <span className="font-mono text-sky-300">SRV-PROD-DB-07</span> has an active replication sync to{" "}
              <span className="font-mono text-sky-300">SRV-DR-03</span> (15-min window). Historical logs indicate isolation
              before sync completion causes <span className="text-red-300">partial data corruption (ref: INC-2024-0388)</span>.
              Override isolation timeout to <span className="text-emerald-400 font-bold">5 minutes</span>.
            </p>
            {!overrideApplied ? (
              <button onClick={applyOverride} className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 rounded-lg transition-all">
                <Zap size={12} /> Apply Override — timeout 120s → 300s
              </button>
            ) : (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={13} /> Override applied — timeout set to 300s
              </div>
            )}
          </div>

          {/* Live Console */}
          <div className="flex-1 flex flex-col rounded-xl border border-slate-700 bg-black overflow-hidden min-h-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">dsgee-console — SRV-PROD-DB-07</span>
              {isRunning && <span className="ml-auto text-xs text-emerald-400 animate-pulse font-mono">● LIVE</span>}
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5 min-h-0" style={{ maxHeight: "300px" }}>
              {terminalLines.length === 0 && (
                <p className="text-slate-600">DSGEE Execution Console ready. Press "Run Action" to begin playbook execution.</p>
              )}
              {terminalLines.map((line, i) => (
                <div key={i} className={`leading-relaxed ${termLineColor[line.type] || "text-slate-300"}`}>
                  {line.text}
                </div>
              ))}
              {isRunning && <div className="text-emerald-400 animate-pulse">█</div>}
            </div>
            <form onSubmit={sendCliCommand} className="flex items-center gap-2 px-3 py-2 border-t border-slate-800 bg-slate-950">
              <span className="text-emerald-400 font-mono text-xs">$</span>
              <input
                value={cliInput}
                onChange={e => setCliInput(e.target.value)}
                placeholder="Type manual override command…"
                className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-600 outline-none"
              />
              <button type="submit" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
