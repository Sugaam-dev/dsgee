import { useState } from "react";
import {
  GitPullRequest, Shield, CheckCircle2, AlertTriangle, XCircle,
  Bot, Code2, BarChart3, FileCheck, ChevronDown, ChevronRight,
  PenLine, Layers, Lock, Unlock, RefreshCw, Info
} from "lucide-react";
import {
  MOCK_GIT_PRS, MOCK_YAML_PREVIEW, MOCK_COMPLIANCE_CONTROLS, MOCK_MITRE_TACTICS
} from "../data/mockData";

const CHECK_ICON = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const CHECK_COLOR = { pass: "text-emerald-400", warn: "text-amber-400", fail: "text-red-400" };

const MITRE_TACTIC_COLOR = (covered, total) => {
  const pct = covered / total;
  if (pct >= 1) return "bg-emerald-500/30 border-emerald-500/50 text-emerald-300";
  if (pct >= 0.6) return "bg-sky-500/20 border-sky-500/40 text-sky-300";
  if (pct >= 0.3) return "bg-amber-500/20 border-amber-500/40 text-amber-300";
  return "bg-red-500/15 border-red-500/30 text-red-300";
};

function DiffViewer({ diff }) {
  return (
    <pre className="text-xs font-mono bg-black/60 rounded-lg p-3 overflow-x-auto leading-relaxed">
      {diff.split("\n").map((line, i) => {
        let cls = "text-slate-400";
        if (line.startsWith("+") && !line.startsWith("+++")) cls = "text-emerald-400 bg-emerald-500/5";
        if (line.startsWith("-") && !line.startsWith("---")) cls = "text-red-400 bg-red-500/5";
        if (line.startsWith("@@")) cls = "text-sky-400";
        return <div key={i} className={`${cls} px-1 rounded`}>{line || " "}</div>;
      })}
    </pre>
  );
}

function EngineeringDesk({ yamlModified, onApplyPolicyRec, policyRecApplied, prs, onMergePR }) {
  const [expandedPR, setExpandedPR] = useState("PR-441");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Git PRs */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SOP-as-Code Pipeline — Active Pull Requests</p>
        {prs.map(pr => {
          const isExpanded = expandedPR === pr.id;
          return (
            <div key={pr.id} className="rounded-xl border border-slate-700/60 bg-slate-800/30 overflow-hidden">
              <button
                onClick={() => setExpandedPR(isExpanded ? null : pr.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/20 transition-colors text-left"
              >
                <GitPullRequest size={15} className={pr.status === "merged" ? "text-purple-400" : "text-emerald-400"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{pr.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{pr.branch} • by {pr.author}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${
                  pr.status === "merged"
                    ? "text-purple-300 bg-purple-500/10 border-purple-500/30"
                    : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                }`}>{pr.status}</span>
                {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </button>
              {isExpanded && (
                <div className="px-3 pb-3">
                  <div className="flex gap-3 mb-3">
                    {Object.entries(pr.checks).map(([check, result]) => {
                      const Icon = CHECK_ICON[result];
                      return (
                        <div key={check} className={`flex items-center gap-1.5 text-xs ${CHECK_COLOR[result]}`}>
                          <Icon size={12} /> {check}
                        </div>
                      );
                    })}
                  </div>
                  <DiffViewer diff={pr.diff} />
                  {pr.status !== "merged" && (
                    <button
                      onClick={() => onMergePR(pr.id)}
                      className="mt-2 w-full py-1.5 text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 rounded-lg transition-all"
                    >
                      Merge & Deploy
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* YAML Preview */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active YAML Configuration</p>
          {yamlModified && <span className="text-xs text-amber-400 font-semibold">● Modified</span>}
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-black/40 overflow-hidden flex-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800">
            <Code2 size={13} className="text-sky-400" />
            <span className="text-xs text-slate-400 font-mono">pb-0042-ransomware-triage.yaml</span>
          </div>
          <pre className="text-xs font-mono text-emerald-300/80 p-3 overflow-y-auto leading-relaxed" style={{ maxHeight: "380px" }}>
            {yamlModified
              ? MOCK_YAML_PREVIEW.replace("isolation_timeout: 120", "isolation_timeout: 300  # AI Override applied")
              : MOCK_YAML_PREVIEW}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ComplianceBoard({ onApproveSOP, sopSigned }) {
  const [expandedFramework, setExpandedFramework] = useState("ISO 27001");
  const frameworks = [...new Set(MOCK_COMPLIANCE_CONTROLS.map(c => c.framework))];
  const complianceScore = Math.round(
    MOCK_COMPLIANCE_CONTROLS.reduce((acc, c) => acc + c.coverage, 0) / MOCK_COMPLIANCE_CONTROLS.length
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Framework compliance */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Posture — Framework Mapping</p>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4 flex items-center gap-4 mb-1">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="transform -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32 * complianceScore / 100} ${2 * Math.PI * 32}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-400">{complianceScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Overall Compliance Score</p>
            <p className="text-xs text-slate-400 mt-1">ISO 27001 · SOC 2 Type II · NIST CSF</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">6 Compliant</span>
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">2 Partial</span>
            </div>
          </div>
        </div>
        {frameworks.map(fw => {
          const controls = MOCK_COMPLIANCE_CONTROLS.filter(c => c.framework === fw);
          const isExpanded = expandedFramework === fw;
          return (
            <div key={fw} className="rounded-xl border border-slate-700/60 bg-slate-800/20 overflow-hidden">
              <button onClick={() => setExpandedFramework(isExpanded ? null : fw)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700/20 transition-colors">
                <span className="text-sm font-semibold text-white">{fw}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${controls.reduce((a, c) => a + c.coverage, 0) / controls.length}%` }} />
                  </div>
                  {isExpanded ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {controls.map(ctrl => (
                    <div key={ctrl.control} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 w-16 flex-shrink-0">{ctrl.control}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 truncate">{ctrl.name}</p>
                        <div className="w-full h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${ctrl.coverage >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${ctrl.coverage}%` }} />
                        </div>
                      </div>
                      <span className={`text-xs font-mono ${ctrl.status === "COMPLIANT" ? "text-emerald-400" : "text-amber-400"}`}>
                        {ctrl.coverage}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Audit Evidence & SOP Sign-off */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Evidence Compiler & SOP Release</p>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck size={15} className="text-sky-400" />
            <p className="text-sm font-semibold text-white">Evidence Bundle — PB-0042 v3.1.4</p>
          </div>
          {[
            { label: "Execution Logs", items: 47, status: "collected" },
            { label: "Policy Attestations", items: 8, status: "collected" },
            { label: "Override Justifications", items: 2, status: "collected" },
            { label: "Compliance Annotations", items: 12, status: "collected" },
            { label: "Digital Signatures", items: sopSigned ? 1 : 0, status: sopSigned ? "signed" : "pending" },
          ].map(ev => (
            <div key={ev.label} className="flex items-center justify-between py-2 border-b border-slate-700/30">
              <span className="text-xs text-slate-300">{ev.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{ev.items} items</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  ev.status === "signed"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : ev.status === "collected"
                    ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}>{ev.status}</span>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-700">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-amber-300 font-semibold">AI Governance Copilot:</span> Playbook PB-0042 v3.1.4 is ready for sign-off.
              All ISO 27001 A.16.1.5 controls are satisfied. Two override events have been logged with compliance-grade justifications.
              Approval will trigger pipeline merge and update audit evidence bundle.
            </p>
          </div>

          {!sopSigned ? (
            <button
              onClick={onApproveSOP}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/30"
            >
              <PenLine size={15} /> Approve & Digital Sign SOP Release
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-300">SOP Release Signed</p>
                <p className="text-xs text-slate-400">Signed by CISO-Proxy at {new Date().toLocaleTimeString()} · PKCS#7 signature attached</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GovernanceLifecycle({ addAuditLog, yamlModified, onYamlModify, mitreExtra, onMitreUpdate }) {
  const [perspective, setPerspective] = useState("engineering");
  const [sopSigned, setSopSigned] = useState(false);
  const [policyRecApplied, setPolicyRecApplied] = useState(false);
  const [prs, setPRs] = useState(MOCK_GIT_PRS);

  function handleApplyPolicyRec() {
    setPolicyRecApplied(true);
    onYamlModify(true);
    addAuditLog({ actor: "AI-COPILOT", action: "POLICY_REC_APPLIED", resource: "PB-0042 isolation_timeout → 300s", severity: "WARN", ocsf: "3004" });
  }

  function handleApproveSOP() {
    setSopSigned(true);
    setPRs(prev => prev.map(pr => pr.status === "open" ? { ...pr, status: "merged" } : pr));
    addAuditLog({ actor: "CISO-PROXY", action: "SOP_RELEASE_SIGNED", resource: "PB-0042 v3.1.4", severity: "INFO", ocsf: "4001" });
  }

  function handleMergePR(prId) {
    setPRs(prev => prev.map(pr => pr.id === prId ? { ...pr, status: "merged" } : pr));
    addAuditLog({ actor: "k.patel", action: "PR_MERGED", resource: prId, severity: "INFO", ocsf: "3002" });
    if (prId === "PR-441") onYamlModify(true);
  }

  const copilotContent = {
    engineering: {
      title: "Pipeline Code Advisor",
      icon: Code2,
      color: "text-sky-400",
      bg: "bg-sky-500/5 border-sky-500/20",
      body: `⚠ Code Smell Detected in PB-0042:\n\n• isolation_timeout: 120 is below recommended SLA (300s for DB hosts)\n• Missing on_failure handler in step_3 — will leave asset in indeterminate state\n• Recommend adding break_glass.mfa_required: true per POL-302 § 2.0\n\nHistorical data: 3 of last 5 ransomware incidents required timeout extension.`,
      action: policyRecApplied ? null : {
        label: "Apply Policy Recommendation",
        onClick: handleApplyPolicyRec,
      },
      applied: policyRecApplied ? "Policy recommendations applied to YAML — PR-441 updated." : null,
    },
    compliance: {
      title: "Governance Risk Translator",
      icon: Shield,
      color: "text-purple-400",
      bg: "bg-purple-500/5 border-purple-500/20",
      body: `The pending YAML modification (PR-441) translates to the following risk assessment:\n\n• Timeout increase (120s→300s): Reduces containment delay risk by ~40% for database assets. Aligns with ISO 27001 A.16.1.5 mandate for timely response.\n• MFA enforcement for break-glass: Satisfies SOC 2 CC9.2 risk mitigation control.\n• Net risk delta: REDUCTION — no new compliance gaps introduced.\n\nSOP v3.1.4 is cleared for executive sign-off.`,
      action: sopSigned ? null : {
        label: "Approve & Digital Sign SOP Release",
        onClick: handleApproveSOP,
      },
      applied: sopSigned ? "SOP Release PB-0042 v3.1.4 digitally signed and merged." : null,
    },
  };

  const cop = copilotContent[perspective];
  const CopIcon = cop.icon;

  return (
    <div className="flex flex-col gap-4">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg"><Layers className="text-purple-400" size={20} /></div>
          <div>
            <h2 className="text-lg font-bold text-white">Governance & Lifecycle</h2>
            <p className="text-xs text-slate-400">Collaborative Compliance & Engineering Workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700">
          <button
            onClick={() => setPerspective("engineering")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              perspective === "engineering" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 size={12} /> Technical Desk
          </button>
          <button
            onClick={() => setPerspective("compliance")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              perspective === "compliance" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield size={12} /> Compliance Board
          </button>
        </div>
      </div>

      {/* Main Content + Copilot */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {perspective === "engineering"
            ? <EngineeringDesk yamlModified={yamlModified} prs={prs} onApplyPolicyRec={handleApplyPolicyRec}
                policyRecApplied={policyRecApplied} onMergePR={handleMergePR} />
            : <ComplianceBoard onApproveSOP={handleApproveSOP} sopSigned={sopSigned} />
          }
        </div>

        {/* AI Copilot Sidebar */}
        <div className={`w-64 flex-shrink-0 rounded-xl border p-4 flex flex-col gap-3 ${cop.bg}`}>
          <div className="flex items-center gap-2">
            <Bot size={15} className={cop.color} />
            <span className={`text-xs font-semibold ${cop.color}`}>AI Governance Copilot</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{cop.body}</div>
          {cop.applied ? (
            <div className="flex items-start gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
              <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" /> {cop.applied}
            </div>
          ) : cop.action && (
            <button
              onClick={cop.action.onClick}
              className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all ${
                perspective === "engineering"
                  ? "bg-sky-600/30 hover:bg-sky-600/50 border-sky-500/30 text-sky-300"
                  : "bg-purple-600/30 hover:bg-purple-600/50 border-purple-500/30 text-purple-300"
              }`}
            >
              {cop.action.label}
            </button>
          )}
        </div>
      </div>

      {/* MITRE ATT&CK Matrix */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">MITRE ATT&CK Coverage Matrix</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50 inline-block" /> Full</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-500/40 inline-block" /> Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40 inline-block" /> Minimal</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/15 border border-red-500/30 inline-block" /> Gap</span>
          </div>
        </div>
        <div className="grid grid-cols-13 gap-1.5">
          {[...MOCK_MITRE_TACTICS, ...(mitreExtra || [])].map(t => (
            <div key={t.tactic}
              className={`rounded-lg border p-2 text-center cursor-pointer transition-all hover:scale-105 ${MITRE_TACTIC_COLOR(t.covered, t.total)}`}
              title={`${t.id}: ${t.covered}/${t.total} techniques covered`}
            >
              <p className="text-xs font-semibold leading-tight" style={{ fontSize: "10px" }}>{t.tactic}</p>
              <p className="text-xs mt-0.5 opacity-70" style={{ fontSize: "9px" }}>{t.covered}/{t.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
