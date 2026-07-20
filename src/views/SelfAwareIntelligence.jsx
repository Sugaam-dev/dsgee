import { useState, useEffect, useRef } from "react";
import {
  Radar, Cpu, ShieldAlert, Check, Play, Loader2, ChevronRight,
  AlertTriangle, Zap, FileCode2, Send, ExternalLink, CheckCircle2,
  Bot, RefreshCw, Globe, Code2
} from "lucide-react";
import { MOCK_THREATS, MOCK_SYNTHESIS_STAGES, MOCK_GENERATED_PLAYBOOK } from "../data/mockData";

const SEV_CONFIG = {
  CRITICAL: { badge: "text-red-400 bg-red-500/10 border-red-500/30", glow: "shadow-red-900/40" },
  HIGH: { badge: "text-orange-400 bg-orange-500/10 border-orange-500/30", glow: "shadow-orange-900/40" },
  MEDIUM: { badge: "text-amber-400 bg-amber-500/10 border-amber-700/30", glow: "" },
};

const FEED_COLOR = {
  "CISA KEV": "text-red-400",
  "NVD": "text-sky-400",
  "FS-ISAC": "text-orange-400",
  "VMware PSIRT": "text-purple-400",
  "0-day Watch": "text-rose-400",
};

function ThreatFeed({ threats, selectedThreat, onSelect }) {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setScanLine(l => (l + 1) % 100), 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <p className="text-xs font-semibold text-red-300 uppercase tracking-wider">Live Threat Intel Feed</p>
        <span className="ml-auto text-xs text-slate-500 font-mono">CISA KEV · NVD · ISAC · 0-day</span>
      </div>
      {/* Scanning animation bar */}
      <div className="relative h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute h-full w-16 bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-none"
          style={{ left: `${scanLine}%`, transform: "translateX(-50%)" }}
        />
      </div>
      {threats.map(threat => (
        <button
          key={threat.id}
          onClick={() => onSelect(threat)}
          className={`w-full text-left rounded-xl border p-3 transition-all hover:scale-[1.01] ${
            selectedThreat?.id === threat.id
              ? "border-sky-500/50 bg-sky-500/10"
              : "border-slate-700/60 bg-slate-800/30 hover:border-slate-600"
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${SEV_CONFIG[threat.severity]?.badge}`}>
                  {threat.severity}
                </span>
                <span className={`text-xs font-mono font-semibold ${FEED_COLOR[threat.feed] || "text-slate-400"}`}>{threat.feed}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-tight">{threat.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{threat.id} · CVSS {threat.cvss}</p>
            </div>
            <ChevronRight size={14} className={`flex-shrink-0 transition-colors ${selectedThreat?.id === threat.id ? "text-sky-400" : "text-slate-600"}`} />
          </div>
        </button>
      ))}
    </div>
  );
}

function ThreatAnalysis({ threat, onSynthesize, synthesisState }) {
  if (!threat) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <Globe size={48} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Select a threat from the feed to begin AI analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Threat header */}
      <div className={`rounded-xl border p-4 ${SEV_CONFIG[threat.severity]?.badge} border`}>
        <div className="flex items-start gap-3">
          <ShieldAlert size={22} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold">{threat.id}</span>
              <span className="text-xs">·</span>
              <span className="text-xs font-mono">{threat.feed}</span>
              <span className="text-xs">·</span>
              <span className="text-xs font-mono">CVSS {threat.cvss}</span>
            </div>
            <h3 className="text-white font-bold text-base">{threat.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{threat.description}</p>
          </div>
        </div>
      </div>

      {/* Policy RAG Analysis */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-purple-400" />
          <span className="text-xs font-semibold text-purple-300">Policy RAG/KAG Compliance Engine</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          <span className="text-purple-300 font-semibold">Matched Policy:</span>{" "}
          <span className="font-mono text-amber-300">{threat.policy_match}</span>{" "}
          — Corporate {threat.policy_match.includes("302") ? "Endpoint" : threat.policy_match.includes("114") ? "Cryptography" : threat.policy_match.includes("201") ? "Email Security" : "Infrastructure"} Policy.
          This threat profile triggers mandatory response within <strong className="text-red-300">4 hours</strong> of identification.
          Automated containment is permitted under §4.1 without prior change-board approval when CVSS ≥ 9.0.
        </p>
        <div className="flex flex-wrap gap-1">
          {threat.mitre.map(t => (
            <span key={t} className="text-xs font-mono px-2 py-0.5 bg-slate-800 border border-slate-600 text-sky-300 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* IoCs */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/20 p-3">
        <p className="text-xs font-semibold text-slate-400 mb-2">Extracted IoCs</p>
        <div className="space-y-1">
          {threat.iocs.map((ioc, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <code className="text-xs font-mono text-red-300">{ioc}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesize button */}
      {synthesisState === "idle" && (
        <button
          onClick={() => onSynthesize(threat)}
          className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-900/30"
        >
          <Zap size={16} /> Synthesize Remediation Playbook
        </button>
      )}
      {synthesisState === "running" && (
        <div className="flex items-center gap-2 py-3 px-4 bg-sky-500/10 border border-sky-500/30 rounded-xl">
          <Loader2 size={16} className="text-sky-400 animate-spin flex-shrink-0" />
          <span className="text-sm text-sky-300 font-semibold">Synthesis in progress…</span>
        </div>
      )}
    </div>
  );
}

function SynthesisPipeline({ stages, currentStage }) {
  if (currentStage < 0) return null;
  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-2">
      <p className="text-xs font-semibold text-sky-300 mb-3">Playbook Synthesis Pipeline</p>
      {stages.map((stage, i) => {
        const isDone = i < currentStage;
        const isActive = i === currentStage;
        return (
          <div key={stage.id} className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isActive ? "bg-sky-500/10" : ""}`}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isDone ? "bg-emerald-500/20 border-emerald-500" :
              isActive ? "bg-sky-500/20 border-sky-500" :
              "bg-slate-800 border-slate-600"
            }`}>
              {isDone ? <Check size={11} className="text-emerald-400" /> :
               isActive ? <Loader2 size={11} className="text-sky-400 animate-spin" /> :
               <span className="text-xs text-slate-500">{i + 1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${isDone ? "text-emerald-400" : isActive ? "text-sky-300" : "text-slate-500"}`}>
                {stage.name}
              </p>
              {isActive && <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SelfAwareIntelligence({ addAuditLog, onPlaybookDeployed }) {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [synthesisState, setSynthesisState] = useState("idle"); // idle | running | done
  const [currentStage, setCurrentStage] = useState(-1);
  const [generatedPlaybook, setGeneratedPlaybook] = useState("");
  const [editablePlaybook, setEditablePlaybook] = useState("");
  const [deployed, setDeployed] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function handleSynthesize(threat) {
    setSynthesisState("running");
    setCurrentStage(0);
    setGeneratedPlaybook("");
    setDeployed(false);
    addAuditLog({ actor: "AI-ENGINE", action: "SYNTHESIS_STARTED", resource: threat.id, severity: "INFO", ocsf: "3002" });

    let acc = 0;
    MOCK_SYNTHESIS_STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setCurrentStage(i + 1);
        if (i === MOCK_SYNTHESIS_STAGES.length - 1) {
          setTimeout(() => {
            setSynthesisState("done");
            setGeneratedPlaybook(MOCK_GENERATED_PLAYBOOK);
            setEditablePlaybook(MOCK_GENERATED_PLAYBOOK);
            addAuditLog({ actor: "AI-ENGINE", action: "PLAYBOOK_SYNTHESIZED", resource: threat.id, severity: "INFO", ocsf: "3002" });
          }, stage.duration);
        }
      }, acc);
      acc += stage.duration;
      timersRef.current.push(t);
    });
  }

  function handleDeploy() {
    setDeployed(true);
    addAuditLog({ actor: "Analyst", action: "PLAYBOOK_DEPLOYED", resource: "PB-AUTO-CVE-2026-10520", severity: "WARN", ocsf: "3005" });
    onPlaybookDeployed({
      id: "PB-AUTO",
      name: "Auto: Ivanti Sentry RCE Response",
      severity: "CRITICAL",
      status: "ACTIVE",
      assignee: "AI-ENGINE",
      asset: "ivanti-cluster",
      started: new Date().toISOString(),
      steps: [
        { id: 1, name: "Identify Ivanti Instances", description: "Scan for Ivanti Sentry in scope.", command: "asset.discovery.scan --product ivanti-sentry", status: "pending", duration: 0, automated: true, tactic: "Discovery" },
        { id: 2, name: "WAF Rule Deployment", description: "Block exploitation at perimeter.", command: "waf.rule.deploy --rule-set ivanti-sentry-rce-block", status: "pending", duration: 0, automated: true, tactic: "Defense Evasion" },
        { id: 3, name: "Isolate Unpatched Hosts", description: "Network isolation for vulnerable systems.", command: "network.isolate --hosts {{ step_1.results }}", status: "pending", duration: 0, automated: true, tactic: "Containment" },
      ],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg"><Radar className="text-red-400" size={20} /></div>
        <div>
          <h2 className="text-lg font-bold text-white">Self-Aware Intelligence</h2>
          <p className="text-xs text-slate-400">Threat Synthesis Engine — Autonomous Zero-Day Response</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Threat feed — left column */}
        <div className="col-span-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <ThreatFeed threats={MOCK_THREATS} selectedThreat={selectedThreat} onSelect={setSelectedThreat} />
        </div>

        {/* Analysis & Synthesis — center */}
        <div className="col-span-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <ThreatAnalysis threat={selectedThreat} onSynthesize={handleSynthesize} synthesisState={synthesisState} />
          {(synthesisState === "running" || synthesisState === "done") && (
            <SynthesisPipeline stages={MOCK_SYNTHESIS_STAGES} currentStage={currentStage} />
          )}
        </div>

        {/* Playbook Editor — right column */}
        <div className="col-span-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {synthesisState === "done" && (
            <>
              <div className="flex items-center gap-2">
                <FileCode2 size={14} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">Analyst Approval Workspace</p>
                <span className="ml-auto text-xs text-emerald-400 font-mono">PB-AUTO-CVE-2026-10520</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-black/50 flex flex-col overflow-hidden flex-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono ml-1">pb-auto-cve-2026-10520.yaml</span>
                </div>
                <textarea
                  value={editablePlaybook}
                  onChange={e => setEditablePlaybook(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-mono text-emerald-300/90 p-3 resize-none outline-none leading-relaxed"
                  style={{ minHeight: "380px" }}
                />
              </div>
              {!deployed ? (
                <button
                  onClick={handleDeploy}
                  className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                >
                  <Send size={15} /> Deploy to Live Engine
                </button>
              ) : (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">Playbook Deployed to Live Engine</p>
                    <p className="text-xs text-slate-400">PB-AUTO-CVE-2026-10520 added to Execution Engine · MITRE matrix updated · Audit logged</p>
                  </div>
                </div>
              )}
            </>
          )}
          {synthesisState === "idle" && (
            <div className="flex-1 flex items-center justify-center p-8 text-center border border-dashed border-slate-700 rounded-xl">
              <div>
                <Code2 size={32} className="text-slate-700 mx-auto mb-3" />
                <p className="text-xs text-slate-500">Synthesized playbook will appear here for analyst review and editing.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
