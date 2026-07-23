import { useState, useEffect, useRef } from "react";
import {
  Terminal, Play, ShieldAlert, ChevronRight, CheckCircle2, Clock,
  AlertTriangle, Zap, SkipForward, X, Bot, Copy, Send, Loader2,
  CircleDot, Lock, Eye, EyeOff, Layers, RefreshCw
} from "lucide-react";
import { MOCK_PLAYBOOKS, MOCK_TERMINAL_LINES } from "../data/mockData";
import LinuxConsole from "../components/LinuxConsole";
import BypassModal from "../components/BypassModal";
import PlaybookViewerModal from "../components/PlaybookViewerModal";

const STEP_STATUS_CONFIG = {
  completed: {
    colorDark: "text-emerald-400",
    colorLight: "text-emerald-700 font-bold",
    bgDark: "bg-emerald-500/10 border-emerald-500/30",
    bgLight: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2
  },
  "in-progress": {
    colorDark: "text-sky-400",
    colorLight: "text-sky-700 font-bold",
    bgDark: "bg-sky-500/10 border-sky-500/30",
    bgLight: "bg-sky-50 border-sky-200",
    icon: Loader2
  },
  pending: {
    colorDark: "text-slate-400",
    colorLight: "text-slate-600 font-bold",
    bgDark: "bg-slate-800/40 border-slate-700/50",
    bgLight: "bg-slate-50 border-slate-200",
    icon: CircleDot
  },
};

export default function ExecutionEngine({ addAuditLog, darkMode, playbooks, onOpenCardDetail }) {
  const [selectedPB, setSelectedPB] = useState(playbooks[0] || MOCK_PLAYBOOKS[0]);
  const [steps, setSteps] = useState((playbooks[0] || MOCK_PLAYBOOKS[0]).steps);
  const [terminalLines, setTerminalLines] = useState([]);

  // Run Action State Machine: IDLE | QUEUED | INITIALIZING | RUNNING | PROCESSING | COMPLETED
  const [actionState, setActionState] = useState("IDLE");
  const [completionTime, setCompletionTime] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  // Remediation Status Message: PASS | FAIL | RUNNING | null
  const [remediationStatus, setRemediationStatus] = useState("PASS");

  const [bypassModal, setBypassModal] = useState(null);
  const [viewPlaybookModal, setViewPlaybookModal] = useState(null);
  const [overrideApplied, setOverrideApplied] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  const timersRef = useRef([]);
  const cooldownIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    };
  }, []);

  function runAction() {
    if (actionState !== "IDLE" || cooldown > 0) return;

    setActionState("QUEUED");
    setRemediationStatus("RUNNING");
    setTerminalLines([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    addAuditLog({
      actor: "Rajesh Sharma",
      action: "ACTION_TRIGGERED",
      resource: selectedPB.id,
      severity: "INFO",
      ocsf: "3002",
      service: "Execution Engine",
      user: "Rajesh Sharma",
      status: "Queued"
    });

    const t1 = setTimeout(() => { setActionState("INITIALIZING"); }, 800);

    const t2 = setTimeout(() => {
      setActionState("RUNNING");
      MOCK_TERMINAL_LINES.forEach(line => {
        const tLine = setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
        }, line.delay);
        timersRef.current.push(tLine);
      });
    }, 1800);

    const t3 = setTimeout(() => { setActionState("PROCESSING"); }, 5500);

    const t4 = setTimeout(() => {
      setActionState("COMPLETED");
      setRemediationStatus("PASS");
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      setCompletionTime(timeStr);

      addAuditLog({
        actor: "Rajesh Sharma",
        action: "AUTO_REMEDIATION_COMPLETED",
        resource: selectedPB.id,
        severity: "INFO",
        ocsf: "3005",
        service: "Execution Engine",
        user: "Rajesh Sharma",
        status: "Completed"
      });

      setCooldown(60);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldown(c => {
          if (c <= 1) {
            clearInterval(cooldownIntervalRef.current);
            setActionState("IDLE");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, 7500);

    timersRef.current.push(t1, t2, t3, t4);
  }

  function applyOverride() {
    setOverrideApplied(true);
    addAuditLog({
      actor: "Rajesh Sharma",
      action: "AI_OVERRIDE_APPLIED",
      resource: "Step 3 Isolation Timeout → 5min",
      severity: "WARN",
      ocsf: "3004",
      service: "Execution Engine",
      user: "Rajesh Sharma",
      status: "Modified"
    });
    setTerminalLines(prev => [
      ...prev,
      { text: "[AI-OVERRIDE] :: Isolation timeout updated: 120s → 300s — Applied by Rajesh Sharma", type: "success", delay: 0 }
    ]);
  }

  function handleBypassConfirm(justification) {
    const step = bypassModal;
    setBypassModal(null);
    addAuditLog({
      actor: "Rajesh Sharma",
      action: "STEP_BYPASSED",
      resource: `${selectedPB.id}::${step.name}`,
      severity: "CRITICAL",
      ocsf: "3004",
      service: "Execution Engine",
      user: "Rajesh Sharma",
      status: "Bypassed"
    });
    setSteps(prev => prev.map(s => (s.id === step.id ? { ...s, status: "completed" } : s)));
    setTerminalLines(prev => [
      ...prev,
      { text: `[BREAK-GLASS] :: Step "${step.name}" BYPASSED by Rajesh Sharma`, type: "danger", delay: 0 },
      { text: `[BREAK-GLASS] :: Justification: ${justification}`, type: "warn", delay: 0 }
    ]);
  }

  function toggleExpandCard(id) {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const activeStep = steps.find(s => s.status === "in-progress") || steps.find(s => s.status === "pending");

  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const subText = darkMode ? "text-slate-400" : "text-slate-700 font-medium";

  // Light/Dark Incident Header Card Styling
  const incidentCardStyle = selectedPB.severity === "CRITICAL"
    ? darkMode ? "bg-red-500/10 border-red-500/30 text-white" : "bg-red-50 border-red-200 text-slate-900 shadow-sm"
    : darkMode ? "bg-orange-500/10 border-orange-500/30 text-white" : "bg-orange-50 border-orange-200 text-slate-900 shadow-sm";

  return (
    <div className="flex flex-col gap-4 h-full">
      {bypassModal && <BypassModal step={bypassModal} onConfirm={handleBypassConfirm} onCancel={() => setBypassModal(null)} />}
      {viewPlaybookModal && <PlaybookViewerModal playbook={viewPlaybookModal} onClose={() => setViewPlaybookModal(null)} />}

      {/* Auto Remediation Status Banner */}
      {remediationStatus === "PASS" && (
        <div className={`rounded-xl border p-3.5 flex items-center justify-between animate-fade-in ${
          darkMode ? "border-emerald-500/40 bg-emerald-500/10 text-white" : "border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm"
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <div>
              <p className={`text-xs font-bold ${darkMode ? "text-emerald-300" : "text-emerald-950"}`}>PASS — Auto Remediation Status</p>
              <p className={`text-xs ${darkMode ? "text-emerald-300/80" : "text-emerald-900"}`}>Auto remediation completed successfully. System is compliant.</p>
            </div>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
            darkMode ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-emerald-100 border-emerald-300 text-emerald-800"
          }`}>
            SOP COMPLIANT
          </span>
        </div>
      )}
      {remediationStatus === "RUNNING" && (
        <div className={`rounded-xl border p-3.5 flex items-center justify-between animate-pulse ${
          darkMode ? "border-sky-500/40 bg-sky-500/10 text-white" : "border-sky-300 bg-sky-50 text-sky-950 shadow-sm"
        }`}>
          <div className="flex items-center gap-3">
            <Loader2 className="text-sky-500 animate-spin" size={20} />
            <div>
              <p className={`text-xs font-bold ${darkMode ? "text-sky-300" : "text-sky-950"}`}>RUNNING — Auto Remediation Status</p>
              <p className={`text-xs ${darkMode ? "text-sky-300/80" : "text-sky-900"}`}>Auto remediation in progress...</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-300">EST REMAINING: 00:02:15</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20"><Terminal className="text-sky-500" size={20} /></div>
          <div>
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Execution Engine</h2>
            <p className={`text-xs ${subText}`}>Live SOP Playbook Runner — DevSecOps Analyst View</p>
          </div>
        </div>
        <div className="flex gap-2">
          {playbooks.map(pb => (
            <button
              key={pb.id}
              onClick={() => { setSelectedPB(pb); setSteps(pb.steps); setTerminalLines([]); setActionState("IDLE"); setRemediationStatus(null); }}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                selectedPB.id === pb.id
                  ? "bg-sky-600 text-white font-bold border-sky-500 shadow-md"
                  : darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
              }`}
            >
              {pb.id}
            </button>
          ))}
        </div>
      </div>

      {/* Incident header card with CRISP contrast in Light & Dark mode */}
      <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-all ${incidentCardStyle}`}>
        <div className="flex-1 cursor-pointer" onClick={() => onOpenCardDetail && onOpenCardDetail({ label: selectedPB.name, value: selectedPB.id, trend: -5 })}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
              selectedPB.severity === "CRITICAL"
                ? "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300"
                : "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300"
            }`}>
              {selectedPB.severity}
            </span>
            <span className={`text-xs font-mono font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{selectedPB.id}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className={`text-xs font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>Assignee: {selectedPB.assignee}</span>
          </div>

          <h3 className={`font-bold text-base ${darkMode ? "text-white" : "text-slate-950"}`}>{selectedPB.name}</h3>

          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            Asset: <span className="font-mono text-sky-600 dark:text-sky-300 font-bold">{selectedPB.asset}</span> • Remaining Time: <strong className="text-amber-700 dark:text-amber-300 font-mono">00:04:05</strong>
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setViewPlaybookModal(selectedPB)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              darkMode ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200" : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm"
            }`}
          >
            <Layers size={14} /> View Playbook
          </button>

          {/* RUN ACTION BUTTON WITH STATE MACHINE & 60s COOLDOWN TIMER */}
          <button
            onClick={runAction}
            disabled={actionState !== "IDLE" || cooldown > 0}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg ${
              actionState === "COMPLETED"
                ? "bg-emerald-600 text-white"
                : actionState !== "IDLE" || cooldown > 0
                ? "bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-500 cursor-not-allowed border border-slate-400 dark:border-slate-700"
                : "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/40"
            }`}
          >
            {actionState === "QUEUED" && <Loader2 size={14} className="animate-spin" />}
            {actionState === "INITIALIZING" && <Loader2 size={14} className="animate-spin" />}
            {actionState === "RUNNING" && <Loader2 size={14} className="animate-spin" />}
            {actionState === "PROCESSING" && <Loader2 size={14} className="animate-spin" />}
            {actionState === "COMPLETED" && <CheckCircle2 size={14} />}
            {actionState === "IDLE" && cooldown === 0 && <Play size={14} />}

            {actionState === "QUEUED" && "Queued..."}
            {actionState === "INITIALIZING" && "Initializing..."}
            {actionState === "RUNNING" && "Running..."}
            {actionState === "PROCESSING" && "Processing..."}
            {actionState === "COMPLETED" && `Completed at ${completionTime}`}
            {actionState === "IDLE" && cooldown > 0 && `Cooling down (${cooldown}s)`}
            {actionState === "IDLE" && cooldown === 0 && "Run Action"}
          </button>

          <button
            onClick={() => activeStep && setBypassModal(activeStep)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all shadow"
          >
            <SkipForward size={14} /> Bypass Step
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Steps Column */}
        <div className="lg:col-span-1 flex flex-col gap-2 overflow-y-auto pr-1">
          <p className={`text-xs font-semibold ${subText} uppercase tracking-wider px-1`}>Playbook Workflow Steps</p>
          {steps.map((step, i) => {
            const cfg = STEP_STATUS_CONFIG[step.status];
            const Icon = cfg.icon;
            const isExpanded = expandedCards[step.id];
            const stepBg = darkMode ? cfg.bgDark : cfg.bgLight;
            const stepTextColor = darkMode ? cfg.colorDark : cfg.colorLight;

            return (
              <div key={step.id} className={`rounded-2xl border p-3.5 transition-all ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="flex items-start gap-2.5">
                  <Icon size={16} className={`mt-0.5 flex-shrink-0 ${stepTextColor} ${step.status === "in-progress" ? "animate-spin" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-800"}`}>{i + 1}.</span>
                      <p className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{step.name}</p>
                    </div>

                    <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-700 font-medium"} ${!isExpanded ? "line-clamp-2" : ""}`}>
                      {step.description}
                    </p>

                    <button
                      onClick={() => toggleExpandCard(step.id)}
                      className="text-[11px] text-sky-600 dark:text-sky-400 font-bold hover:underline mt-1 block"
                    >
                      {isExpanded ? "Collapse" : "View More"}
                    </button>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        darkMode ? "bg-slate-800 border-slate-700 text-sky-300" : "bg-slate-100 border-slate-300 text-sky-800"
                      }`}>
                        {step.tactic}
                      </span>
                      {step.automated && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">⚡ automated</span>}
                    </div>

                    {step.status !== "pending" && (
                      <code className={`block mt-2 text-[11px] font-mono rounded-lg px-2.5 py-1 truncate border ${
                        darkMode ? "text-sky-300 bg-black/80 border-slate-800" : "text-sky-900 bg-slate-100 border-slate-300 font-bold"
                      }`}>
                        $ {step.command}
                      </code>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Console Column */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          {/* AI Action Advisor */}
          <div className={`rounded-2xl border p-3.5 space-y-2 ${
            darkMode ? "border-amber-500/40 bg-amber-500/10 text-white" : "border-amber-300 bg-amber-50 text-amber-950 shadow-sm"
          }`}>
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-amber-500" />
              <span className={`text-xs font-bold ${darkMode ? "text-amber-300" : "text-amber-950"}`}>AI Action Advisor — Active Intelligence</span>
              <span className={`ml-auto text-[10px] font-mono ${darkMode ? "text-slate-400" : "text-slate-600"}`}>DSGEE-ADVISOR v2.4</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-800 font-medium"}`}>
              <span className="text-amber-600 dark:text-amber-300 font-bold">⚠ Recommendation:</span> Endpoint <span className="font-mono text-sky-600 dark:text-sky-300 font-bold">SRV-PROD-DB-07</span> has active replication sync to <span className="font-mono text-sky-600 dark:text-sky-300 font-bold">SRV-DR-03</span>. Recommend isolation override timeout to <strong className="text-emerald-700 dark:text-emerald-400 font-bold">5 minutes</strong> to prevent partial replication corruption.
            </p>
            {!overrideApplied ? (
              <button
                onClick={applyOverride}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all font-bold shadow-md"
              >
                <Zap size={13} /> Apply Override — timeout 120s → 300s
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={14} /> Override applied by Rajesh Sharma — timeout set to 300s
              </div>
            )}
          </div>

          {/* Linux Console Component */}
          <LinuxConsole
            initialLines={terminalLines}
            isRunning={actionState === "RUNNING" || actionState === "PROCESSING"}
            onRunAction={runAction}
            assetName={selectedPB.asset}
          />
        </div>
      </div>
    </div>
  );
}
