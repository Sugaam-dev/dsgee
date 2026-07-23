import { useState } from "react";
import {
  User, Shield, Key, Bell, CheckCircle2, Clock, MapPin, Mail, Award,
  Server, Lock, Laptop, Check, AlertTriangle, ChevronRight, Activity, Settings
} from "lucide-react";
import { MOCK_SELF_DATA } from "../data/mockData";

export default function SelfView({ darkMode }) {
  const [activeTab, setActiveTab] = useState("PROFILE"); // PROFILE | ASSETS | CERTIFICATIONS | TASKS | HISTORY | SECURITY
  const [selfData, setSelfData] = useState(MOCK_SELF_DATA);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [prefTheme, setPrefTheme] = useState("AUTO");
  const [savedMsg, setSavedMsg] = useState(false);

  function handleSavePreferences(e) {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  }

  const cardBg = darkMode
    ? "bg-slate-900/80 border-slate-800 text-white"
    : "bg-white border-slate-200 text-slate-900 shadow-sm";

  const subText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="space-y-6">
      {/* Header Profile Hero Card */}
      <div className={`p-6 rounded-3xl border ${cardBg} flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 via-purple-600 to-emerald-500 p-1 flex-shrink-0 shadow-xl">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-2xl text-white">
              RS
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">{selfData.profile.fullName}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                {selfData.profile.employeeId}
              </span>
            </div>
            <p className={`text-xs ${subText} font-medium`}>{selfData.profile.role}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1"><Mail size={13} className="text-sky-400" /> {selfData.profile.email}</span>
              <span className="flex items-center gap-1"><MapPin size={13} className="text-amber-400" /> {selfData.profile.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block text-[10px]">Access Clearance Level</span>
            <span className="text-emerald-400 font-bold">{selfData.profile.clearance}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: "PROFILE", label: "User Profile", icon: User },
          { id: "ASSETS", label: "Assigned Assets", icon: Server },
          { id: "CERTIFICATIONS", label: "Certifications", icon: Award },
          { id: "TASKS", label: "Assigned Tasks", icon: CheckCircle2 },
          { id: "HISTORY", label: "Login History", icon: Clock },
          { id: "SECURITY", label: "Security & Preferences", icon: Lock },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-sky-600 text-white shadow-md"
                  : darkMode
                  ? "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "PROFILE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="font-bold text-sm text-sky-400 border-b border-slate-800/60 pb-2">Departmental & Organizational Scope</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Department</span>
                <p className="font-semibold text-sm">{selfData.profile.department}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Team</span>
                <p className="font-semibold text-sm">{selfData.profile.team}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Platform Tenure</span>
                <p className="font-mono text-slate-300">Joined {selfData.profile.joinedDate} (Active 3 years)</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="font-bold text-sm text-emerald-400 border-b border-slate-800/60 pb-2">Active Security Privileges</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Full Volatility3 & EDR Isolation Break-Glass Access</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> ISO 27001 & SOC 2 SOP Sign-off Authorization</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Playbook Synthesis & Policy Overrides (§4.1)</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "ASSETS" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selfData.assets.map(ast => (
            <div key={ast.id} className={`p-5 rounded-2xl border ${cardBg} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-sky-400">{ast.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">Online</span>
              </div>
              <h4 className="font-bold text-xs">{ast.type}</h4>
              <p className="text-xs text-slate-400 font-mono">IP: {ast.ip} • OS: {ast.os}</p>
              <span className="text-[11px] text-amber-300 block font-semibold pt-1">Role: {ast.role}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "CERTIFICATIONS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selfData.certifications.map((c, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-4`}>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Award size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">{c.name}</h4>
                <p className="text-xs text-slate-400">Issuer: {c.issuer}</p>
                <span className="text-[11px] text-emerald-400 font-mono block">Valid through: {c.validUntil}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "TASKS" && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-3`}>
          <h3 className="font-bold text-sm border-b border-slate-800/60 pb-2">Assigned Remediation Queue</h3>
          <div className="space-y-2 text-xs">
            {selfData.tasks.map(t => (
              <div key={t.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-mono text-sky-400 font-bold">{t.id}</span>
                  <p className="font-semibold text-white mt-0.5">{t.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    t.priority === "HIGH" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                  }`}>{t.priority}</span>
                  <span className="text-slate-400 font-mono">{t.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "HISTORY" && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-3`}>
          <h3 className="font-bold text-sm border-b border-slate-800/60 pb-2">Security Login Logs</h3>
          <div className="space-y-2 text-xs">
            {selfData.loginHistory.map((h, i) => (
              <div key={i} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-mono text-slate-300">{h.time}</p>
                  <span className="text-[11px] text-slate-400">{h.device}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sky-400">{h.ip} ({h.location})</span>
                  <span className="text-emerald-400 block font-bold text-[10px]">{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "SECURITY" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="font-bold text-sm text-sky-400 border-b border-slate-800/60 pb-2">Multi-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Okta Verify Push MFA</p>
                <p className="text-xs text-slate-400">Mandatory for all break-glass actions</p>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mfaEnabled ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {mfaEnabled ? "MFA Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="font-bold text-sm text-purple-400 border-b border-slate-800/60 pb-2">Preferences</h3>
            <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Timezone Preference</label>
                <input
                  type="text"
                  value="Asia/Kolkata (IST +05:30)"
                  disabled
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-300"
                />
              </div>

              <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all">
                Save Security Preferences
              </button>
              {savedMsg && <span className="text-emerald-400 text-xs block text-center">Preferences updated!</span>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
