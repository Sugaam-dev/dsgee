import { useState } from "react";
import {
  GitPullRequest, Shield, CheckCircle2, AlertTriangle, XCircle,
  Bot, Code2, BarChart3, FileCheck, ChevronDown, ChevronRight,
  PenLine, Layers, Lock, Unlock, RefreshCw, Info, Download, FileText
} from "lucide-react";
import {
  MOCK_GIT_PRS, MOCK_YAML_PREVIEW, MOCK_COMPLIANCE_CONTROLS, MOCK_MITRE_TACTICS
} from "../data/mockData";

const CHECK_ICON = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const CHECK_COLOR = { pass: "text-emerald-400", warn: "text-amber-400", fail: "text-red-400" };

function DiffViewer({ diff }) {
  return (
    <pre className="text-xs font-mono bg-black/80 text-slate-200 rounded-xl p-3 overflow-x-auto leading-relaxed border border-slate-800">
      {diff.split("\n").map((line, i) => {
        let cls = "text-slate-400";
        if (line.startsWith("+") && !line.startsWith("+++")) cls = "text-emerald-400 bg-emerald-500/10";
        if (line.startsWith("-") && !line.startsWith("---")) cls = "text-red-400 bg-red-500/10";
        if (line.startsWith("@@")) cls = "text-sky-400 font-bold";
        return <div key={i} className={`${cls} px-1 rounded`}>{line || " "}</div>;
      })}
    </pre>
  );
}

export default function GovernanceLifecycle({
  addAuditLog,
  yamlModified,
  onYamlModify,
  mitreExtra,
  onMitreUpdate,
  darkMode
}) {
  const [perspective, setPerspective] = useState("engineering"); // engineering | compliance | reports
  const [sopSigned, setSopSigned] = useState(false);
  const [prs, setPRs] = useState(MOCK_GIT_PRS);
  const [expandedPR, setExpandedPR] = useState("PR-441");
  const [expandedFramework, setExpandedFramework] = useState("ISO 27001");
  const [reportModal, setReportModal] = useState(false);

  function handleMergePR(prId) {
    setPRs(prev => prev.map(p => p.id === prId ? { ...p, status: "Deployed" } : p));
    addAuditLog({
      actor: "Rajesh Sharma",
      action: "PR_MERGED_AND_DEPLOYED",
      resource: prId,
      severity: "INFO",
      ocsf: "3005",
      service: "Governance",
      user: "Rajesh Sharma",
      status: "Deployed"
    });
  }

  function handleApproveSOP() {
    setSopSigned(true);
    addAuditLog({
      actor: "Rajesh Sharma",
      action: "SOP_RELEASE_APPROVED",
      resource: "PB-0042 v3.1.4",
      severity: "INFO",
      ocsf: "1001",
      service: "Governance",
      user: "Rajesh Sharma",
      status: "Approved"
    });
  }

  const complianceScore = Math.round(
    MOCK_COMPLIANCE_CONTROLS.reduce((acc, c) => acc + c.coverage, 0) / MOCK_COMPLIANCE_CONTROLS.length
  );
  const riskScore = 18; // Low Risk Score out of 100

  const cardBg = darkMode ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const subText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="space-y-6">
      {/* Audit Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-sky-400" size={20} />
                <h3 className="font-bold text-base text-white">ISO 27001 & SOC 2 Compliance Report</h3>
              </div>
              <button onClick={() => setReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <p className="text-emerald-400">STATUS: AUDIT COMPLIANT (Score: {complianceScore}%)</p>
              <p className="text-slate-300">Generated for Organization: PMRG DSGEE Enterprise</p>
              <p className="text-slate-400">Control Frameworks Verified: ISO 27001 (A.16.1.5, A.12.6.1), SOC 2 (CC7.2, CC7.3, CC9.2), NIST CSF</p>
              <p className="text-slate-400">Total Audit Evidence Items Collected: 68</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setReportModal(false)} className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded-xl text-slate-300">Close</button>
              <button onClick={() => setReportModal(false)} className="px-4 py-2 bg-sky-600 text-xs font-bold rounded-xl text-white">Download PDF Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <Layers className="text-purple-400" size={22} />
          </div>
          <div>
            <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
              Governance & SOP Lifecycle
            </h2>
            <p className={`text-xs ${subText}`}>
              SOP-as-Code pipeline, policy RAG, ISO 27001/SOC 2 compliance sign-off & audit reports
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
            {[
              { id: "engineering", label: "SOP-as-Code PRs" },
              { id: "compliance", label: "Compliance & Risk" },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPerspective(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${perspective === p.id ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/30 transition-all"
          >
            <Download size={14} /> Audit Report
          </button>
        </div>
      </div>

      {/* Top Governance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <span className={`text-xs ${subText} block font-medium`}>Policy Compliance Score</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{complianceScore}%</p>
          <span className="text-[11px] text-emerald-500 font-mono">ISO 27001 / SOC 2</span>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <span className={`text-xs ${subText} block font-medium`}>Enterprise Risk Score</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">{riskScore} / 100</p>
          <span className="text-[11px] text-sky-400 font-mono">LOW RISK LEVEL</span>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <span className={`text-xs ${subText} block font-medium`}>SOP Release Sign-off</span>
          <p className={`text-xl font-bold mt-1 ${sopSigned ? "text-emerald-400" : "text-amber-400"}`}>
            {sopSigned ? "SIGNED & MERGED" : "PENDING APPROVAL"}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">PB-0042 v3.1.4</span>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <span className={`text-xs ${subText} block font-medium`}>Open Pull Requests</span>
          <p className="text-2xl font-bold text-purple-400 mt-1">{prs.filter(p => p.status !== "Deployed").length}</p>
          <span className="text-[11px] text-purple-300 font-mono">1 Deployed</span>
        </div>
      </div>

      {perspective === "engineering" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Git PRs */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold ${subText} uppercase tracking-wider`}>
              SOP-as-Code Pipeline — Active Pull Requests
            </p>
            {prs.map(pr => {
              const isExpanded = expandedPR === pr.id;
              const isDeployed = pr.status === "Deployed";
              return (
                <div key={pr.id} className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                  <button
                    onClick={() => setExpandedPR(isExpanded ? null : pr.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-800/40 transition-colors text-left"
                  >
                    <GitPullRequest size={16} className={isDeployed ? "text-purple-400" : "text-emerald-400"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{pr.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{pr.branch} • by {pr.author}</p>
                    </div>
                    {/* RENAMED STATUS "Merged and Deploy" -> "Deployed" with GREEN SUCCESS BADGE */}
                    <span className={`text-xs px-2.5 py-1 rounded-xl border font-bold ${
                      isDeployed
                        ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                        : "text-sky-300 bg-sky-500/10 border-sky-500/30"
                    }`}>
                      {isDeployed ? "Deployed" : pr.status}
                    </span>
                    {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex gap-3">
                        {Object.entries(pr.checks).map(([check, result]) => {
                          const Icon = CHECK_ICON[result];
                          return (
                            <div key={check} className={`flex items-center gap-1.5 text-xs font-medium ${CHECK_COLOR[result]}`}>
                              <Icon size={13} /> {check}
                            </div>
                          );
                        })}
                      </div>
                      <DiffViewer diff={pr.diff} />
                      {!isDeployed && (
                        <button
                          onClick={() => handleMergePR(pr.id)}
                          className="w-full py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                        >
                          Merge & Deploy SOP to Fleet
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active YAML Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={`text-xs font-semibold ${subText} uppercase tracking-wider`}>Active YAML Configuration</p>
              {yamlModified && <span className="text-xs text-amber-400 font-bold">● Modified by AI Override</span>}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <Code2 size={14} className="text-sky-400" />
                <span className="text-xs text-slate-300 font-mono">pb-0042-ransomware-triage.yaml</span>
              </div>
              <pre className="text-xs font-mono text-emerald-400/90 p-4 overflow-y-auto leading-relaxed max-h-[380px]">
                {yamlModified
                  ? MOCK_YAML_PREVIEW.replace("isolation_timeout: 120", "isolation_timeout: 300  # AI Override applied by Rajesh Sharma")
                  : MOCK_YAML_PREVIEW}
              </pre>
            </div>
          </div>
        </div>
      )}

      {perspective === "compliance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Framework Compliance */}
          <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
            <p className={`text-xs font-semibold ${subText} uppercase tracking-wider`}>Compliance Posture — Control Matrix</p>
            {MOCK_COMPLIANCE_CONTROLS.map(ctrl => (
              <div key={ctrl.control} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-sky-400 font-bold">{ctrl.framework} {ctrl.control}</span>
                  <p className="text-white font-semibold mt-0.5">{ctrl.name}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  ctrl.status === "COMPLIANT" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  {ctrl.coverage}% {ctrl.status}
                </span>
              </div>
            ))}
          </div>

          {/* Audit Sign-off Release Card */}
          <div className={`p-5 rounded-2xl border ${cardBg} space-y-4 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileCheck size={18} className="text-sky-400" />
                <h3 className="text-sm font-bold">Evidence Bundle & Digital Release</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                Playbook PB-0042 v3.1.4 has satisfied all ISO 27001 incident response control criteria. Digital signature will record an immutable OCSF attestation block.
              </p>
            </div>

            {!sopSigned ? (
              <button
                onClick={handleApproveSOP}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/30"
              >
                <PenLine size={16} /> Approve & Digital Sign SOP Release
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">SOP Release Approved & Digitally Signed</p>
                  <p className="text-[11px] text-slate-400">Signed by Rajesh Sharma at {new Date().toLocaleTimeString()} • PKCS#7 Verified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
