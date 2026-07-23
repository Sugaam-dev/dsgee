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

export default function SelfAwareIntelligence({ addAuditLog, onPlaybookDeployed, darkMode }) {
  const [selectedThreat, setSelectedThreat] = useState(MOCK_THREATS[0]);
  const [synthesisState, setSynthesisState] = useState("idle"); // idle | running | done
  const [currentStage, setCurrentStage] = useState(-1);
  const [generatedPlaybook, setGeneratedPlaybook] = useState("");
  const [deployed, setDeployed] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function handleSynthesize(threat) {
    setSynthesisState("running");
    setCurrentStage(0);
    setGeneratedPlaybook("");
    setDeployed(false);
    addAuditLog({
      actor: "AI-ENGINE",
      action: "SYNTHESIS_STARTED",
      resource: threat.id,
      severity: "INFO",
      ocsf: "3002",
      service: "AI Intelligence",
      user: "System",
      status: "Running"
    });

    let acc = 0;
    MOCK_SYNTHESIS_STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setCurrentStage(i + 1);
        if (i === MOCK_SYNTHESIS_STAGES.length - 1) {
          setTimeout(() => {
            setSynthesisState("done");
            setGeneratedPlaybook(MOCK_GENERATED_PLAYBOOK);
            addAuditLog({
              actor: "AI-ENGINE",
              action: "PLAYBOOK_SYNTHESIZED",
              resource: threat.id,
              severity: "INFO",
              ocsf: "3002",
              service: "AI Intelligence",
              user: "System",
              status: "Synthesized"
            });
          }, stage.duration);
        }
      }, acc);
      acc += stage.duration;
      timersRef.current.push(t);
    });
  }

  function handleDeploy() {
    setDeployed(true);
    addAuditLog({
      actor: "Rajesh Sharma",
      action: "PLAYBOOK_DEPLOYED",
      resource: "PB-AUTO-CVE-2026-10520",
      severity: "WARN",
      ocsf: "3005",
      service: "AI Intelligence",
      user: "Rajesh Sharma",
      status: "Deployed"
    });
    onPlaybookDeployed({
      id: "PB-AUTO",
      name: "Auto: Ivanti Sentry RCE Response",
      severity: "CRITICAL",
      status: "ACTIVE",
      assignee: "Rajesh Sharma",
      asset: "ivanti-cluster",
      started: new Date().toISOString(),
      steps: [
        { id: 1, name: "Identify Ivanti Instances", description: "Scan for Ivanti Sentry in scope.", command: "asset.discovery.scan --product ivanti-sentry", status: "pending", duration: 0, automated: true, tactic: "Discovery" },
        { id: 2, name: "WAF Rule Deployment", description: "Block exploitation at perimeter.", command: "waf.rule.deploy --rule-set ivanti-sentry-rce-block", status: "pending", duration: 0, automated: true, tactic: "Defense Evasion" },
        { id: 3, name: "Isolate Unpatched Hosts", description: "Network isolation for vulnerable systems.", command: "network.isolate --hosts {{ step_1.results }}", status: "pending", duration: 0, automated: true, tactic: "Containment" },
      ],
    });
  }

  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const subText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl"><Radar className="text-red-400" size={22} /></div>
        <div>
          <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>Self-Aware Threat Synthesis</h2>
          <p className={`text-xs ${subText}`}>Automated CVE ingestion, policy RAG lookup & real-time playbook synthesis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Threat Intel Feed */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Feed
            </span>
            <span className="text-[10px] text-slate-400 font-mono">CISA KEV • NVD</span>
          </div>

          <div className="space-y-2">
            {MOCK_THREATS.map(th => (
              <button
                key={th.id}
                onClick={() => { setSelectedThreat(th); setSynthesisState("idle"); setCurrentStage(-1); setGeneratedPlaybook(""); }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedThreat?.id === th.id
                    ? "bg-sky-500/10 border-sky-500/50 shadow-md"
                    : cardBg
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${SEV_CONFIG[th.severity]?.badge}`}>
                    {th.severity}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${FEED_COLOR[th.feed] || "text-slate-400"}`}>{th.feed}</span>
                </div>
                <h4 className="text-xs font-bold leading-tight">{th.title}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{th.id} • CVSS {th.cvss}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Threat & Synthesis Engine */}
        <div className="lg:col-span-2 space-y-4">
          {selectedThreat && (
            <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-sky-400">{selectedThreat.id}</span>
                    <span className="text-xs text-slate-400">• CVSS {selectedThreat.cvss}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{selectedThreat.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedThreat.description}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${SEV_CONFIG[selectedThreat.severity]?.badge}`}>
                  {selectedThreat.severity}
                </span>
              </div>

              {/* Policy RAG Lookup Match */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Bot size={16} /> Policy RAG/KAG Compliance Engine
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Matched Corporate Policy: <strong className="text-amber-300 font-mono">{selectedThreat.policy_match}</strong>.
                  Automated containment response is mandated within <strong>4 hours</strong>.
                </p>
                <div className="flex gap-2 pt-1">
                  {selectedThreat.mitre.map(m => (
                    <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-700 text-sky-300 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {synthesisState === "idle" && (
                <button
                  onClick={() => handleSynthesize(selectedThreat)}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> Synthesize Remediation Playbook for {selectedThreat.id}
                </button>
              )}

              {/* Synthesis Pipeline Progress */}
              {synthesisState === "running" && (
                <div className="space-y-2 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <p className="font-bold text-sky-400 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Synthesizing SOP Playbook Pipeline...
                  </p>
                  {MOCK_SYNTHESIS_STAGES.map((stg, i) => (
                    <div key={stg.id} className="flex items-center gap-2">
                      {i < currentStage ? <CheckCircle2 size={13} className="text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-700" />}
                      <span className={i < currentStage ? "text-emerald-300" : i === currentStage ? "text-sky-300 font-bold" : "text-slate-600"}>
                        {stg.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Generated Playbook Result */}
              {synthesisState === "done" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Synthesis Complete — Generated YAML Playbook
                    </span>
                    {!deployed ? (
                      <button
                        onClick={handleDeploy}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                      >
                        Deploy Playbook to Fleet
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
                        ✓ Playbook Deployed to Active Engine
                      </span>
                    )}
                  </div>
                  <pre className="bg-black text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-72">
                    {generatedPlaybook}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
